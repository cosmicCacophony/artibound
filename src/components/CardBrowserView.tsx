import { useMemo, useState } from 'react'
import { BaseCard, Color } from '../game/types'
import { allCards, allSpells, allArtifacts } from '../game/cardData'
import { CardPreview } from './CardPreview'

const COLOR_ORDER: Color[] = ['white', 'blue', 'black', 'red', 'green']
const COLOR_NAMES: Record<Color, string> = {
  white: 'White',
  blue: 'Blue',
  black: 'Black',
  red: 'Red',
  green: 'Green',
}

const COLOR_DISPLAY: Record<Color, { name: string; color: string; bg: string }> = {
  white: { name: 'White', color: '#FFD700', bg: '#FFF9E6' },
  blue: { name: 'Blue', color: '#1E90FF', bg: '#E6F2FF' },
  black: { name: 'Black', color: '#4A4A4A', bg: '#F0F0F0' },
  red: { name: 'Red', color: '#DC143C', bg: '#FFE6E6' },
  green: { name: 'Green', color: '#228B22', bg: '#E6FFE6' },
}

// Helper to get a sorted color key for grouping (removes duplicates)
function getColorKey(colors: Color[]): string {
  // Remove duplicates by converting to Set, then back to array
  const uniqueColors = Array.from(new Set(colors))
  return uniqueColors.sort((a, b) => COLOR_ORDER.indexOf(a) - COLOR_ORDER.indexOf(b)).join('-')
}

// Helper to format color key for display
function formatColorKey(key: string): string {
  return key.split('-').map(color => COLOR_NAMES[color as Color] || color).join(' / ')
}

interface CardBrowserViewProps {
  onClose: () => void
}

export function CardBrowserView({ onClose }: CardBrowserViewProps) {
  const [selectedColorKey, setSelectedColorKey] = useState<string | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'units' | 'spells' | 'artifacts'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Combine all cards
  const allCardsCombined = useMemo(() => {
    return [
      ...allCards,
      ...allSpells,
      ...allArtifacts,
    ]
  }, [])

  // Group cards by their exact color identity
  const cardsByColorKey = useMemo(() => {
    const grouped: Record<string, BaseCard[]> = {}

    allCardsCombined.forEach((card) => {
      // Safely get colors array, handling undefined/null cases
      const colors = (card.colors && Array.isArray(card.colors)) ? card.colors : []
      
      if (colors.length === 0) {
        // Colorless cards - put in special group
        const key = 'colorless'
        if (!grouped[key]) grouped[key] = []
        grouped[key].push(card)
      } else {
        // Filter out any invalid colors and ensure they're valid Color types
        // Also remove duplicates to get unique colors
        const validColors = Array.from(new Set(
          colors.filter((c): c is Color => 
            COLOR_ORDER.includes(c as Color)
          )
        ))
        
        if (validColors.length === 0) {
          // No valid colors found, treat as colorless
          const key = 'colorless'
          if (!grouped[key]) grouped[key] = []
          grouped[key].push(card)
        } else {
          const key = getColorKey(validColors)
          if (!grouped[key]) grouped[key] = []
          grouped[key].push(card)
        }
      }
    })

    // Sort cards within each group
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => {
        // For spells, sort by manaCost first, then by name
        if (a.cardType === 'spell' && b.cardType === 'spell') {
          const aCost = a.manaCost || 0
          const bCost = b.manaCost || 0
          if (aCost !== bCost) {
            return aCost - bCost
          }
        }
        // Otherwise, sort by name
        return a.name.localeCompare(b.name)
      })
    })

    return grouped
  }, [allCardsCombined])

  // Organize color keys by number of colors
  const colorKeysByCount = useMemo(() => {
    const byCount: Record<number, string[]> = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    }

    Object.keys(cardsByColorKey).forEach((key) => {
      if (!key || key === 'colorless' || key.trim() === '') {
        byCount[0].push(key || 'colorless')
      } else {
        const colorCount = key.split('-').filter(c => c.length > 0).length
        // Safety check: only add if colorCount is within expected range (0-5)
        if (colorCount === 0) {
          byCount[0].push(key)
        } else if (byCount[colorCount]) {
          byCount[colorCount].push(key)
        } else {
          // Fallback: add to the highest available count (5)
          console.warn(`Unexpected color count ${colorCount} for key "${key}", adding to count 5`)
          byCount[5].push(key)
        }
      }
    })

    // Sort each group by color order
    Object.keys(byCount).forEach((count) => {
      byCount[parseInt(count)].sort((a, b) => {
        if (a === 'colorless') return -1
        if (b === 'colorless') return 1
        // Sort by first color in COLOR_ORDER
        const aColors = a.split('-')
        const bColors = b.split('-')
        const aFirst = aColors[0]
        const bFirst = bColors[0]
        const aIndex = COLOR_ORDER.indexOf(aFirst as Color)
        const bIndex = COLOR_ORDER.indexOf(bFirst as Color)
        if (aIndex !== bIndex) return aIndex - bIndex
        // If same first color, sort by second, etc.
        return a.localeCompare(b)
      })
    })

    return byCount
  }, [cardsByColorKey])

  // Filter cards based on selected color key, category, and search term
  const filteredCards = useMemo(() => {
    let cards: BaseCard[] = []

    if (selectedColorKey === 'all') {
      // Get all cards
      Object.values(cardsByColorKey).forEach((cardList) => {
        cards.push(...cardList)
      })
    } else {
      cards = cardsByColorKey[selectedColorKey] || []
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      cards = cards.filter((card) => {
        if (selectedCategory === 'units') {
          return card.cardType === 'generic' || card.cardType === 'signature' || card.cardType === 'hybrid'
        } else if (selectedCategory === 'spells') {
          return card.cardType === 'spell'
        } else if (selectedCategory === 'artifacts') {
          return card.cardType === 'artifact'
        }
        return true
      })
    }

    // Filter by search term
    if (searchTerm) {
      cards = cards.filter((card) =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return cards
  }, [selectedColorKey, selectedCategory, searchTerm, cardsByColorKey])

  // Get card count by color key
  const getColorKeyCount = (key: string) => {
    const cards = cardsByColorKey[key] || []
    if (selectedCategory === 'all') return cards.length
    return cards.filter((card) => {
      if (selectedCategory === 'units') {
        return card.cardType === 'generic' || card.cardType === 'signature' || card.cardType === 'hybrid'
      } else if (selectedCategory === 'spells') {
        return card.cardType === 'spell'
      } else if (selectedCategory === 'artifacts') {
        return card.cardType === 'artifact'
      }
      return true
    }).length
  }

  const totalCount = Object.values(cardsByColorKey).reduce((sum, cards) => {
    if (selectedCategory === 'all') return sum + cards.length
    return sum + cards.filter((card) => {
      if (selectedCategory === 'units') {
        return card.cardType === 'generic' || card.cardType === 'signature' || card.cardType === 'hybrid'
      } else if (selectedCategory === 'spells') {
        return card.cardType === 'spell'
      } else if (selectedCategory === 'artifacts') {
        return card.cardType === 'artifact'
      }
      return true
    }).length
  }, 0)

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '1600px',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '2px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', color: '#333' }}>
              Card Browser
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666' }}>
              {totalCount} cards
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* Filters */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedCategory === 'all' ? '#2196F3' : '#e0e0e0',
                color: selectedCategory === 'all' ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: selectedCategory === 'all' ? 'bold' : 'normal',
              }}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory('units')}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedCategory === 'units' ? '#2196F3' : '#e0e0e0',
                color: selectedCategory === 'units' ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: selectedCategory === 'units' ? 'bold' : 'normal',
              }}
            >
              Units
            </button>
            <button
              onClick={() => setSelectedCategory('spells')}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedCategory === 'spells' ? '#2196F3' : '#e0e0e0',
                color: selectedCategory === 'spells' ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: selectedCategory === 'spells' ? 'bold' : 'normal',
              }}
            >
              Spells
            </button>
            <button
              onClick={() => setSelectedCategory('artifacts')}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedCategory === 'artifacts' ? '#2196F3' : '#e0e0e0',
                color: selectedCategory === 'artifacts' ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: selectedCategory === 'artifacts' ? 'bold' : 'normal',
              }}
            >
              Artifacts
            </button>
          </div>

          {/* Color Filter Button */}
          <button
            onClick={() => setSelectedColorKey('all')}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedColorKey === 'all' ? '#2196F3' : '#e0e0e0',
              color: selectedColorKey === 'all' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: selectedColorKey === 'all' ? 'bold' : 'normal',
            }}
          >
            All Colors ({totalCount})
          </button>

          {/* Search Box */}
          <input
            type="text"
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              marginLeft: 'auto',
              padding: '8px 12px',
              border: '2px solid #e0e0e0',
              borderRadius: '4px',
              fontSize: '14px',
              width: '250px',
            }}
          />
        </div>

        {/* Card Grid */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
        }}>
          {selectedColorKey === 'all' ? (
            // Show by color sections
            <>
              {/* Colorless */}
              {colorKeysByCount[0].length > 0 && colorKeysByCount[0].map((key) => {
                const cards = cardsByColorKey[key].filter((card) => {
                  if (selectedCategory === 'units') {
                    return card.cardType === 'generic' || card.cardType === 'signature' || card.cardType === 'hybrid'
                  } else if (selectedCategory === 'spells') {
                    return card.cardType === 'spell'
                  } else if (selectedCategory === 'artifacts') {
                    return card.cardType === 'artifact'
                  }
                  return true
                }).filter((card) =>
                  !searchTerm ||
                  card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  card.description?.toLowerCase().includes(searchTerm.toLowerCase())
                )

                if (cards.length === 0) return null

                return (
                  <div key={key} style={{ marginBottom: '32px' }}>
                    <h3 style={{
                      fontSize: '20px',
                      color: '#666',
                      marginBottom: '12px',
                      paddingBottom: '8px',
                      borderBottom: '2px solid #666',
                    }}>
                      Colorless ({cards.length})
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: '16px',
                    }}>
                      {cards.map((card) => (
                        <CardPreview key={card.id} card={card} />
                      ))}
                    </div>
                  </div>
                )
              })}

              {/* Single Color */}
              {colorKeysByCount[1].length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{
                    fontSize: '18px',
                    color: '#333',
                    marginBottom: '16px',
                    fontWeight: 'bold',
                  }}>
                    Single Color
                  </h3>
                  {colorKeysByCount[1].map((key) => {
                    const color = key.split('-')[0] as Color
                    const colorInfo = COLOR_DISPLAY[color]
                    const cards = cardsByColorKey[key].filter((card) => {
                      if (selectedCategory === 'units') {
                        return card.cardType === 'generic' || card.cardType === 'signature' || card.cardType === 'hybrid'
                      } else if (selectedCategory === 'spells') {
                        return card.cardType === 'spell'
                      } else if (selectedCategory === 'artifacts') {
                        return card.cardType === 'artifact'
                      }
                      return true
                    }).filter((card) =>
                      !searchTerm ||
                      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      card.description?.toLowerCase().includes(searchTerm.toLowerCase())
                    )

                    if (cards.length === 0) return null

                    return (
                      <div key={key} style={{ marginBottom: '24px' }}>
                        <h4 style={{
                          fontSize: '16px',
                          color: colorInfo.color,
                          marginBottom: '8px',
                          paddingBottom: '4px',
                          borderBottom: `2px solid ${colorInfo.color}`,
                        }}>
                          {colorInfo.name} ({cards.length})
                        </h4>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                          gap: '16px',
                        }}>
                          {cards.map((card) => (
                            <CardPreview key={card.id} card={card} />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Two Colors */}
              {colorKeysByCount[2].length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{
                    fontSize: '18px',
                    color: '#333',
                    marginBottom: '16px',
                    fontWeight: 'bold',
                  }}>
                    Two Colors
                  </h3>
                  {colorKeysByCount[2].map((key) => {
                    const cards = cardsByColorKey[key].filter((card) => {
                      if (selectedCategory === 'units') {
                        return card.cardType === 'generic' || card.cardType === 'signature' || card.cardType === 'hybrid'
                      } else if (selectedCategory === 'spells') {
                        return card.cardType === 'spell'
                      } else if (selectedCategory === 'artifacts') {
                        return card.cardType === 'artifact'
                      }
                      return true
                    }).filter((card) =>
                      !searchTerm ||
                      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      card.description?.toLowerCase().includes(searchTerm.toLowerCase())
                    )

                    if (cards.length === 0) return null

                    return (
                      <div key={key} style={{ marginBottom: '24px' }}>
                        <h4 style={{
                          fontSize: '16px',
                          color: '#666',
                          marginBottom: '8px',
                          paddingBottom: '4px',
                          borderBottom: '2px solid #666',
                        }}>
                          {formatColorKey(key)} ({cards.length})
                        </h4>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                          gap: '16px',
                        }}>
                          {cards.map((card) => (
                            <CardPreview key={card.id} card={card} />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Three Colors */}
              {colorKeysByCount[3].length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{
                    fontSize: '18px',
                    color: '#333',
                    marginBottom: '16px',
                    fontWeight: 'bold',
                  }}>
                    Three Colors
                  </h3>
                  {colorKeysByCount[3].map((key) => {
                    const cards = cardsByColorKey[key].filter((card) => {
                      if (selectedCategory === 'units') {
                        return card.cardType === 'generic' || card.cardType === 'signature' || card.cardType === 'hybrid'
                      } else if (selectedCategory === 'spells') {
                        return card.cardType === 'spell'
                      } else if (selectedCategory === 'artifacts') {
                        return card.cardType === 'artifact'
                      }
                      return true
                    }).filter((card) =>
                      !searchTerm ||
                      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      card.description?.toLowerCase().includes(searchTerm.toLowerCase())
                    )

                    if (cards.length === 0) return null

                    return (
                      <div key={key} style={{ marginBottom: '24px' }}>
                        <h4 style={{
                          fontSize: '16px',
                          color: '#666',
                          marginBottom: '8px',
                          paddingBottom: '4px',
                          borderBottom: '2px solid #666',
                        }}>
                          {formatColorKey(key)} ({cards.length})
                        </h4>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                          gap: '16px',
                        }}>
                          {cards.map((card) => (
                            <CardPreview key={card.id} card={card} />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Four Colors */}
              {colorKeysByCount[4].length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{
                    fontSize: '18px',
                    color: '#333',
                    marginBottom: '16px',
                    fontWeight: 'bold',
                  }}>
                    Four Colors
                  </h3>
                  {colorKeysByCount[4].map((key) => {
                    const cards = cardsByColorKey[key].filter((card) => {
                      if (selectedCategory === 'units') {
                        return card.cardType === 'generic' || card.cardType === 'signature' || card.cardType === 'hybrid'
                      } else if (selectedCategory === 'spells') {
                        return card.cardType === 'spell'
                      } else if (selectedCategory === 'artifacts') {
                        return card.cardType === 'artifact'
                      }
                      return true
                    }).filter((card) =>
                      !searchTerm ||
                      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      card.description?.toLowerCase().includes(searchTerm.toLowerCase())
                    )

                    if (cards.length === 0) return null

                    return (
                      <div key={key} style={{ marginBottom: '24px' }}>
                        <h4 style={{
                          fontSize: '16px',
                          color: '#666',
                          marginBottom: '8px',
                          paddingBottom: '4px',
                          borderBottom: '2px solid #666',
                        }}>
                          {formatColorKey(key)} ({cards.length})
                        </h4>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                          gap: '16px',
                        }}>
                          {cards.map((card) => (
                            <CardPreview key={card.id} card={card} />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          ) : (
            // Show selected color only
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {filteredCards.map((card) => (
                <CardPreview key={card.id} card={card} />
              ))}
            </div>
          )}

          {filteredCards.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: '#999',
              fontSize: '18px',
            }}>
              No cards found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

