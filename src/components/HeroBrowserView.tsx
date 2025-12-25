import { useMemo, useState } from 'react'
import { Hero, Color } from '../game/types'
import { allHeroes } from '../game/cardData'

const COLOR_ORDER: Color[] = ['white', 'blue', 'black', 'red', 'green']

const COLOR_DISPLAY: Record<Color, { name: string; color: string; bg: string }> = {
  white: { name: 'White', color: '#FFD700', bg: '#FFF9E6' },
  blue: { name: 'Blue', color: '#1E90FF', bg: '#E6F2FF' },
  black: { name: 'Black', color: '#4A4A4A', bg: '#F0F0F0' },
  red: { name: 'Red', color: '#DC143C', bg: '#FFE6E6' },
  green: { name: 'Green', color: '#228B22', bg: '#E6FFE6' },
}

interface HeroBrowserViewProps {
  onClose: () => void
}

export function HeroBrowserView({ onClose }: HeroBrowserViewProps) {
  const [selectedColor, setSelectedColor] = useState<Color | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Group heroes by their primary color
  const heroesByColor = useMemo(() => {
    const grouped: Record<Color, Hero[]> = {
      white: [],
      blue: [],
      black: [],
      red: [],
      green: [],
    }

    allHeroes.forEach((hero) => {
      // Primary color is the first color in the colors array
      const primaryColor = hero.colors[0] as Color
      if (primaryColor && grouped[primaryColor]) {
        grouped[primaryColor].push(hero)
      }
    })

    // Sort heroes within each color by name
    COLOR_ORDER.forEach((color) => {
      grouped[color].sort((a, b) => a.name.localeCompare(b.name))
    })

    return grouped
  }, [])

  // Filter heroes based on selected color and search term
  const filteredHeroes = useMemo(() => {
    let heroes: Hero[] = []

    if (selectedColor === 'all') {
      // Get all heroes
      COLOR_ORDER.forEach((color) => {
        heroes.push(...heroesByColor[color])
      })
    } else {
      heroes = heroesByColor[selectedColor]
    }

    // Filter by search term
    if (searchTerm) {
      heroes = heroes.filter((hero) =>
        hero.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hero.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hero.supportEffect?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hero.ability?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return heroes
  }, [selectedColor, searchTerm, heroesByColor])

  // Get hero count by color
  const getColorCount = (color: Color) => heroesByColor[color].length
  const totalCount = COLOR_ORDER.reduce((sum, color) => sum + getColorCount(color), 0)

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
        maxWidth: '1400px',
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
              Hero Browser
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666' }}>
              {totalCount} heroes across {COLOR_ORDER.length} colors
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
          {/* Color Filter Buttons */}
          <button
            onClick={() => setSelectedColor('all')}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedColor === 'all' ? '#2196F3' : '#e0e0e0',
              color: selectedColor === 'all' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: selectedColor === 'all' ? 'bold' : 'normal',
            }}
          >
            All ({totalCount})
          </button>

          {COLOR_ORDER.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedColor === color ? COLOR_DISPLAY[color].color : COLOR_DISPLAY[color].bg,
                color: selectedColor === color ? 'white' : '#333',
                border: `2px solid ${COLOR_DISPLAY[color].color}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: selectedColor === color ? 'bold' : 'normal',
              }}
            >
              {COLOR_DISPLAY[color].name} ({getColorCount(color)})
            </button>
          ))}

          {/* Search Box */}
          <input
            type="text"
            placeholder="Search heroes..."
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

        {/* Hero Grid */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
        }}>
          {selectedColor === 'all' ? (
            // Show by color sections
            COLOR_ORDER.map((color) => {
              const colorHeroes = heroesByColor[color].filter((hero) =>
                !searchTerm || 
                hero.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                hero.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                hero.supportEffect?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                hero.ability?.name.toLowerCase().includes(searchTerm.toLowerCase())
              )

              if (colorHeroes.length === 0) return null

              return (
                <div key={color} style={{ marginBottom: '32px' }}>
                  <h3 style={{
                    fontSize: '20px',
                    color: COLOR_DISPLAY[color].color,
                    marginBottom: '12px',
                    paddingBottom: '8px',
                    borderBottom: `2px solid ${COLOR_DISPLAY[color].color}`,
                  }}>
                    {COLOR_DISPLAY[color].name} ({colorHeroes.length})
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '16px',
                  }}>
                    {colorHeroes.map((hero) => (
                      <HeroCard key={hero.id} hero={hero} />
                    ))}
                  </div>
                </div>
              )
            })
          ) : (
            // Show selected color only
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {filteredHeroes.map((hero) => (
                <HeroCard key={hero.id} hero={hero} />
              ))}
            </div>
          )}

          {filteredHeroes.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: '#999',
              fontSize: '18px',
            }}>
              No heroes found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function HeroCard({ hero }: { hero: Hero }) {
  const primaryColor = hero.colors[0] as Color
  const colorInfo = COLOR_DISPLAY[primaryColor]

  return (
    <div style={{
      border: `2px solid ${colorInfo.color}`,
      borderRadius: '8px',
      padding: '12px',
      backgroundColor: colorInfo.bg,
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'default',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = 'none'
    }}
    >
      {/* Hero Name & Colors */}
      <div style={{ marginBottom: '8px' }}>
        <h4 style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          {hero.name}
          <span style={{ fontSize: '12px', display: 'flex', gap: '2px' }}>
            {hero.colors.map((color, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-block',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: COLOR_DISPLAY[color as Color].color,
                  border: '1px solid #333',
                }}
                title={COLOR_DISPLAY[color as Color].name}
              />
            ))}
          </span>
        </h4>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
      }}>
        <span style={{ color: '#DC143C' }}>⚔️ {hero.attack}</span>
        <span style={{ color: '#228B22' }}>❤️ {hero.health}</span>
      </div>

      {/* Description */}
      {hero.description && (
        <p style={{
          margin: '8px 0',
          fontSize: '13px',
          color: '#555',
          fontStyle: 'italic',
        }}>
          {hero.description}
        </p>
      )}

      {/* Support Effect */}
      {hero.supportEffect && (
        <div style={{
          marginTop: '8px',
          padding: '8px',
          backgroundColor: 'rgba(255,255,255,0.6)',
          borderRadius: '4px',
          fontSize: '12px',
        }}>
          <strong>Support:</strong> {hero.supportEffect}
        </div>
      )}

      {/* Ability */}
      {hero.ability && (
        <div style={{
          marginTop: '8px',
          padding: '8px',
          backgroundColor: 'rgba(255,255,255,0.6)',
          borderRadius: '4px',
          fontSize: '12px',
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {hero.ability.name} ({hero.ability.manaCost} mana)
          </div>
          <div style={{ color: '#555' }}>
            {hero.ability.description}
          </div>
          {hero.ability.cooldown > 0 && (
            <div style={{ marginTop: '4px', fontSize: '11px', color: '#666' }}>
              Cooldown: {hero.ability.cooldown}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

