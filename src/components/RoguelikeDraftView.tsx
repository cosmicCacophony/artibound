import React, { useState } from 'react'
import { useRoguelikeDraft } from '../hooks/useRoguelikeDraft'
import { RoguelikeDraftItem } from '../game/roguelikeTypes'
import { Hero, ArtifactCard, SpellCard, GenericUnit } from '../game/types'

export function RoguelikeDraftView() {
  const {
    draftState,
    currentPack,
    isHeroPick,
    heroPickNumber,
    makePick,
    getDraftSummary,
  } = useRoguelikeDraft()

  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const summary = getDraftSummary()

  // Handle item click (select/deselect)
  const handleItemClick = (item: RoguelikeDraftItem) => {
    if (draftState.isComplete) return
    
    const newSelected = new Set(selectedItems)
    
    if (isHeroPick) {
      // Hero picks: only one selection
      newSelected.clear()
      newSelected.add(item.id)
    } else {
      // Mixed packs: up to 2 selections
      if (newSelected.has(item.id)) {
        newSelected.delete(item.id)
      } else if (newSelected.size < 2) {
        newSelected.add(item.id)
      } else {
        // Replace first selection
        const firstId = Array.from(newSelected)[0]
        newSelected.delete(firstId)
        newSelected.add(item.id)
      }
    }
    
    setSelectedItems(newSelected)
  }

  // Handle confirm pick
  const handleConfirmPick = () => {
    if (selectedItems.size === 0) return
    
    // Make picks for all selected items
    selectedItems.forEach(itemId => {
      const item = currentPack.allItems.find(i => i.id === itemId)
      if (item) {
        makePick(item)
      }
    })
    
    // Clear selections
    setSelectedItems(new Set())
  }

  // Get item display info
  const getItemInfo = (item: RoguelikeDraftItem) => {
    if (item.cardType === 'hero') {
      const hero = item as Hero
      return {
        name: hero.name,
        description: hero.description,
        colors: hero.colors || [],
        stats: `${hero.attack}/${hero.health}`,
        type: 'Hero',
      }
    } else if (item.cardType === 'artifact') {
      const artifact = item as ArtifactCard
      return {
        name: artifact.name,
        description: artifact.description,
        colors: artifact.colors || [],
        stats: artifact.manaCost ? `${artifact.manaCost} mana` : '',
        type: 'Artifact',
      }
    } else if (item.cardType === 'spell') {
      const spell = item as SpellCard
      return {
        name: spell.name,
        description: spell.description,
        colors: spell.colors || [],
        stats: spell.manaCost ? `${spell.manaCost} mana` : '',
        type: 'Spell',
      }
    } else {
      const unit = item as GenericUnit
      return {
        name: unit.name,
        description: unit.description,
        colors: unit.colors || [],
        stats: `${unit.attack}/${unit.health}`,
        type: 'Unit',
      }
    }
  }

  // Get color display
  const getColorDisplay = (colors: string[]) => {
    if (colors.length === 0) return 'Colorless'
    return colors.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join('/')
  }

  // Deck review component
  const DeckReview = () => {
    const allDrafted = [
      ...draftState.draftedHeroes,
      ...draftState.draftedArtifacts,
      ...draftState.draftedSpells,
      ...draftState.draftedUnits,
    ]

    const getItemInfo = (item: any) => {
      if (item.cardType === 'hero') {
        return { name: item.name, colors: item.colors || [], stats: `${item.attack}/${item.health}`, type: 'Hero' }
      } else if (item.cardType === 'artifact') {
        return { name: item.name, colors: item.colors || [], stats: item.manaCost ? `${item.manaCost} mana` : '', type: 'Artifact' }
      } else if (item.cardType === 'spell') {
        return { name: item.name, colors: item.colors || [], stats: item.manaCost ? `${item.manaCost} mana` : '', type: 'Spell' }
      } else {
        return { name: item.name, colors: item.colors || [], stats: `${item.attack}/${item.health}`, type: 'Unit' }
      }
    }

    const getColorDisplay = (colors: string[]) => {
      if (colors.length === 0) return 'Colorless'
      return colors.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join('/')
    }

    // Group by type
    const heroes = draftState.draftedHeroes
    const artifacts = draftState.draftedArtifacts
    const spells = draftState.draftedSpells
    const units = draftState.draftedUnits

    return (
      <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Draft Complete!</h1>
        
        {/* Summary */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          justifyContent: 'center', 
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <div><strong>Heroes:</strong> {summary.heroes}/4</div>
          <div><strong>Artifacts:</strong> {artifacts.length}</div>
          <div><strong>Spells:</strong> {spells.length}</div>
          <div><strong>Units:</strong> {units.length}</div>
          <div><strong>Total Cards:</strong> {summary.cards}</div>
          <div><strong>Colors:</strong> {summary.colors.length > 0 ? summary.colors.join(', ') : 'None'}</div>
        </div>

        {/* Deck by Type */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Heroes */}
          <div>
            <h2 style={{ marginBottom: '15px', borderBottom: '2px solid #2196F3', paddingBottom: '5px' }}>
              Heroes ({heroes.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {heroes.map(hero => {
                const info = getItemInfo(hero)
                return (
                  <div
                    key={hero.id}
                    style={{
                      border: '1px solid #ccc',
                      borderRadius: '6px',
                      padding: '12px',
                      backgroundColor: 'white',
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{info.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {info.type} • {getColorDisplay(info.colors)} • {info.stats}
                    </div>
                    {hero.description && (
                      <div style={{ fontSize: '11px', color: '#555', marginTop: '5px' }}>
                        {hero.description}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Artifacts */}
          <div>
            <h2 style={{ marginBottom: '15px', borderBottom: '2px solid #4CAF50', paddingBottom: '5px' }}>
              Artifacts ({artifacts.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
              {artifacts.map(artifact => {
                const info = getItemInfo(artifact)
                return (
                  <div
                    key={artifact.id}
                    style={{
                      border: '1px solid #ccc',
                      borderRadius: '6px',
                      padding: '12px',
                      backgroundColor: 'white',
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{info.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {info.type} • {getColorDisplay(info.colors)} {info.stats && `• ${info.stats}`}
                    </div>
                    {artifact.description && (
                      <div style={{ fontSize: '11px', color: '#555', marginTop: '5px' }}>
                        {artifact.description}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Spells */}
          <div>
            <h2 style={{ marginBottom: '15px', borderBottom: '2px solid #FF9800', paddingBottom: '5px' }}>
              Spells ({spells.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
              {spells.map(spell => {
                const info = getItemInfo(spell)
                return (
                  <div
                    key={spell.id}
                    style={{
                      border: '1px solid #ccc',
                      borderRadius: '6px',
                      padding: '12px',
                      backgroundColor: 'white',
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{info.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {info.type} • {getColorDisplay(info.colors)} {info.stats && `• ${info.stats}`}
                    </div>
                    {spell.description && (
                      <div style={{ fontSize: '11px', color: '#555', marginTop: '5px' }}>
                        {spell.description}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Units */}
          <div>
            <h2 style={{ marginBottom: '15px', borderBottom: '2px solid #9C27B0', paddingBottom: '5px' }}>
              Units ({units.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
              {units.map(unit => {
                const info = getItemInfo(unit)
                return (
                  <div
                    key={unit.id}
                    style={{
                      border: '1px solid #ccc',
                      borderRadius: '6px',
                      padding: '12px',
                      backgroundColor: 'white',
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{info.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {info.type} • {getColorDisplay(info.colors)} • {info.stats}
                    </div>
                    {unit.description && (
                      <div style={{ fontSize: '11px', color: '#555', marginTop: '5px' }}>
                        {unit.description}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginRight: '10px',
            }}
          >
            Start New Draft
          </button>
        </div>
      </div>
    )
  }

  if (draftState.isComplete) {
    return <DeckReview />
  }

  // Drafted cards sidebar component
  const DraftedCardsSidebar = () => {
    const getItemInfo = (item: any) => {
      if (item.cardType === 'hero') {
        return { name: item.name, colors: item.colors || [], stats: `${item.attack}/${item.health}`, type: 'Hero' }
      } else if (item.cardType === 'artifact') {
        return { name: item.name, colors: item.colors || [], stats: item.manaCost ? `${item.manaCost} mana` : '', type: 'Artifact' }
      } else if (item.cardType === 'spell') {
        return { name: item.name, colors: item.colors || [], stats: item.manaCost ? `${item.manaCost} mana` : '', type: 'Spell' }
      } else {
        return { name: item.name, colors: item.colors || [], stats: `${item.attack}/${item.health}`, type: 'Unit' }
      }
    }

    const getColorDisplay = (colors: string[]) => {
      if (colors.length === 0) return 'C'
      return colors.map(c => c.charAt(0).toUpperCase()).join('')
    }

    return (
      <div style={{
        width: '280px',
        backgroundColor: '#f9f9f9',
        borderLeft: '1px solid #ddd',
        padding: '15px',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 40px)',
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Drafted Cards</h3>
        
        {/* Heroes */}
        {draftState.draftedHeroes.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#2196F3' }}>
              Heroes ({draftState.draftedHeroes.length}/4)
            </div>
            {draftState.draftedHeroes.map(hero => {
              const info = getItemInfo(hero)
              return (
                <div
                  key={hero.id}
                  style={{
                    fontSize: '12px',
                    padding: '6px',
                    marginBottom: '4px',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{info.name}</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    {getColorDisplay(info.colors)} • {info.stats}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Artifacts */}
        {draftState.draftedArtifacts.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#4CAF50' }}>
              Artifacts ({draftState.draftedArtifacts.length})
            </div>
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {draftState.draftedArtifacts.map(artifact => {
                const info = getItemInfo(artifact)
                return (
                  <div
                    key={artifact.id}
                    style={{
                      fontSize: '12px',
                      padding: '6px',
                      marginBottom: '4px',
                      backgroundColor: 'white',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                    }}
                  >
                    <div>{info.name}</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      {getColorDisplay(info.colors)} {info.stats && `• ${info.stats}`}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Spells */}
        {draftState.draftedSpells.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#FF9800' }}>
              Spells ({draftState.draftedSpells.length})
            </div>
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {draftState.draftedSpells.map(spell => {
                const info = getItemInfo(spell)
                return (
                  <div
                    key={spell.id}
                    style={{
                      fontSize: '12px',
                      padding: '6px',
                      marginBottom: '4px',
                      backgroundColor: 'white',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                    }}
                  >
                    <div>{info.name}</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      {getColorDisplay(info.colors)} {info.stats && `• ${info.stats}`}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Units */}
        {draftState.draftedUnits.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#9C27B0' }}>
              Units ({draftState.draftedUnits.length})
            </div>
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {draftState.draftedUnits.map(unit => {
                const info = getItemInfo(unit)
                return (
                  <div
                    key={unit.id}
                    style={{
                      fontSize: '12px',
                      padding: '6px',
                      marginBottom: '4px',
                      backgroundColor: 'white',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                    }}
                  >
                    <div>{info.name}</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      {getColorDisplay(info.colors)} • {info.stats}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {draftState.draftedHeroes.length === 0 && 
         draftState.draftedArtifacts.length === 0 && 
         draftState.draftedSpells.length === 0 && 
         draftState.draftedUnits.length === 0 && (
          <div style={{ color: '#999', fontSize: '12px', fontStyle: 'italic' }}>
            No cards drafted yet
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
      {/* Main Draft Area */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
          <h1>Roguelike Draft</h1>
          <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
            <div>
              <strong>Pack:</strong> {draftState.currentPack}/{18}
            </div>
            <div>
              <strong>Heroes:</strong> {summary.heroes}/4
            </div>
            <div>
              <strong>Cards:</strong> {summary.cards}
            </div>
            <div>
              <strong>Colors:</strong> {summary.colors.length > 0 ? summary.colors.join(', ') : 'None'}
            </div>
          </div>
        </div>

      {/* Pack Info */}
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        {isHeroPick ? (
          <div>
            <h2>Hero Pick {heroPickNumber}</h2>
            <p>Pick 1 hero from the options below.</p>
          </div>
        ) : (
          <div>
            <h2>Mixed Pack {draftState.currentPack}</h2>
            <p>Pick 2 items from the pack below.</p>
            <p><strong>Picks remaining:</strong> {draftState.picksRemainingThisPack}</p>
          </div>
        )}
      </div>

      {/* Pack Items */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        {currentPack.allItems.map(item => {
          const info = getItemInfo(item)
          const isSelected = selectedItems.has(item.id)
          const canSelect = isHeroPick || selectedItems.size < 2
          
          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              style={{
                border: isSelected ? '3px solid #2196F3' : '1px solid #ccc',
                borderRadius: '8px',
                padding: '15px',
                cursor: canSelect ? 'pointer' : 'not-allowed',
                backgroundColor: isSelected ? '#e3f2fd' : 'white',
                opacity: !canSelect && !isSelected ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (canSelect) {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                {info.name}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                {info.type} • {getColorDisplay(info.colors)}
              </div>
              {info.stats && (
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>
                  {info.stats}
                </div>
              )}
              <div style={{ fontSize: '11px', color: '#555', marginTop: '8px' }}>
                {info.description}
              </div>
              {isSelected && (
                <div style={{ marginTop: '8px', color: '#2196F3', fontWeight: 'bold' }}>
                  ✓ Selected
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Confirm Button */}
      {selectedItems.size > 0 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={handleConfirmPick}
            disabled={selectedItems.size === 0}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: selectedItems.size > 0 ? '#2196F3' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedItems.size > 0 ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
            }}
          >
            Confirm Pick{selectedItems.size > 1 ? 's' : ''} ({selectedItems.size})
          </button>
        </div>
      )}
      </div>

      {/* Drafted Cards Sidebar */}
      <DraftedCardsSidebar />
    </div>
  )
}

