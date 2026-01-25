import { useState } from 'react'
import { useRoguelikeDraft } from '../hooks/useRoguelikeDraft'
import { RoguelikeDraftItem } from '../game/roguelikeTypes'
import { Hero, ArtifactCard, SpellCard, GenericUnit, BaseCard, FinalDraftSelection } from '../game/types'
import { CardPreview } from './CardPreview'
// Simple export function for roguelike draft
const downloadDraftAsJSON = (selection: FinalDraftSelection, archetype: string) => {
  const dataStr = JSON.stringify({
    timestamp: Date.now(),
    archetype,
    selection,
  }, null, 2)
  
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `roguelike-draft-${Date.now()}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
import { useGameContext } from '../context/GameContext'
import { allBattlefields } from '../game/cardData'

interface RoguelikeDraftViewProps {
  onStartGame?: () => void
}

export function RoguelikeDraftView({ onStartGame }: RoguelikeDraftViewProps = {}) {
  const {
    draftState,
    currentPack,
    isHeroPick,
    heroPickNumber,
    makePick,
    getDraftSummary,
  } = useRoguelikeDraft()
  const { initializeDraftGame } = useGameContext()

  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const summary = getDraftSummary()

  const toTemplateId = (cardId: string) => {
    const player1Index = cardId.indexOf('-player1-')
    if (player1Index !== -1) {
      return cardId.slice(0, player1Index)
    }
    const player2Index = cardId.indexOf('-player2-')
    if (player2Index !== -1) {
      return cardId.slice(0, player2Index)
    }
    return cardId
  }

  const buildDraftSelection = () => {
    const allCards: BaseCard[] = [
      ...draftState.draftedArtifacts,
      ...draftState.draftedSpells,
      ...draftState.draftedUnits,
    ]

    const fullHeroes: Hero[] = draftState.draftedHeroes.map((hero, index) => ({
      ...hero,
      location: 'base' as const,
      owner: 'player1' as const,
      id: `${hero.id}-player1-${Date.now()}-${index}`,
    }))

    const selection: FinalDraftSelection = {
      heroes: fullHeroes,
      cards: allCards,
      battlefield: allBattlefields[0],
    }

    return {
      selection,
      normalizedSelection: {
        ...selection,
        heroes: selection.heroes.map(hero => ({ ...hero, id: toTemplateId(hero.id) })),
        cards: selection.cards.map(card => ({ ...card, id: toTemplateId(card.id) })),
      },
    }
  }

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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {heroes.map(hero => (
                <CardPreview key={hero.id} card={hero as BaseCard} />
              ))}
            </div>
          </div>

          {/* Artifacts */}
          <div>
            <h2 style={{ marginBottom: '15px', borderBottom: '2px solid #4CAF50', paddingBottom: '5px' }}>
              Artifacts ({artifacts.length})
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
              {artifacts.map(artifact => (
                <CardPreview key={artifact.id} card={artifact as BaseCard} />
              ))}
            </div>
          </div>

          {/* Spells */}
          <div>
            <h2 style={{ marginBottom: '15px', borderBottom: '2px solid #FF9800', paddingBottom: '5px' }}>
              Spells ({spells.length})
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
              {spells.map(spell => (
                <CardPreview key={spell.id} card={spell as BaseCard} />
              ))}
            </div>
          </div>

          {/* Units */}
          <div>
            <h2 style={{ marginBottom: '15px', borderBottom: '2px solid #9C27B0', paddingBottom: '5px' }}>
              Units ({units.length})
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
              {units.map(unit => (
                <CardPreview key={unit.id} card={unit as BaseCard} />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={() => {
              const { selection } = buildDraftSelection()
              initializeDraftGame(selection)
              if (onStartGame) {
                onStartGame()
              }
            }}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginRight: '10px',
            }}
            title="Start a game with your drafted deck vs the RW deck from 'Start Random Game'"
          >
            🎲 Start Draft Game
          </button>
          <button
            onClick={() => {
              // Auto-detect archetype based on colors and card distribution
              const colorStr = summary.colors.join('-')
              const isSpellFocused = spells.length > artifacts.length + units.length
              const archetype = isSpellFocused 
                ? `Spell Damage (${colorStr})`
                : summary.colors.length >= 3
                ? `Multicolor (${colorStr})`
                : `${colorStr.charAt(0).toUpperCase() + colorStr.slice(1)} Focus`
              
              const { normalizedSelection } = buildDraftSelection()
              downloadDraftAsJSON(normalizedSelection, archetype)
            }}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginRight: '10px',
            }}
          >
            Export Draft (JSON)
          </button>
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
    return (
      <div style={{
        width: '320px',
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {draftState.draftedHeroes.map(hero => (
                <div key={hero.id} style={{ transform: 'scale(0.85)', transformOrigin: 'top left' }}>
                  <CardPreview card={hero as BaseCard} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Artifacts */}
        {draftState.draftedArtifacts.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#4CAF50' }}>
              Artifacts ({draftState.draftedArtifacts.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {draftState.draftedArtifacts.map(artifact => (
                <div key={artifact.id} style={{ transform: 'scale(0.85)', transformOrigin: 'top left' }}>
                  <CardPreview card={artifact as BaseCard} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spells */}
        {draftState.draftedSpells.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#FF9800' }}>
              Spells ({draftState.draftedSpells.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {draftState.draftedSpells.map(spell => (
                <div key={spell.id} style={{ transform: 'scale(0.85)', transformOrigin: 'top left' }}>
                  <CardPreview card={spell as BaseCard} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Units */}
        {draftState.draftedUnits.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#9C27B0' }}>
              Units ({draftState.draftedUnits.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {draftState.draftedUnits.map(unit => (
                <div key={unit.id} style={{ transform: 'scale(0.85)', transformOrigin: 'top left' }}>
                  <CardPreview card={unit as BaseCard} />
                </div>
              ))}
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        {currentPack.allItems.map(item => {
          const isSelected = selectedItems.has(item.id)
          const canSelect = isHeroPick || selectedItems.size < 2
          
          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              style={{
                position: 'relative',
                cursor: canSelect ? 'pointer' : 'not-allowed',
                opacity: !canSelect && !isSelected ? 0.5 : 1,
                transition: 'all 0.2s',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (canSelect) {
                  e.currentTarget.style.transform = 'scale(1.08)'
                  e.currentTarget.style.zIndex = '10'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = isSelected ? 'scale(1.05)' : 'scale(1)'
                e.currentTarget.style.zIndex = '1'
              }}
            >
              {/* Selection border overlay */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    left: '-4px',
                    right: '-4px',
                    bottom: '-4px',
                    border: '4px solid #2196F3',
                    borderRadius: '12px',
                    pointerEvents: 'none',
                    zIndex: 5,
                    boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.3)',
                  }}
                />
              )}
              
              {/* Card Preview */}
              <div style={{ position: 'relative' }}>
                <CardPreview card={item as BaseCard} />
                
                {/* Selected indicator */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      zIndex: 6,
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>
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

