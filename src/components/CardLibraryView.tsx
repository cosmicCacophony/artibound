import { useState } from 'react'
import { BaseCard, CardType } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { useCardManagement } from '../hooks/useCardManagement'
import { CardPreview } from './CardPreview'
import { CardEditorModal } from './CardEditorModal'

export function CardLibraryView() {
  const { showCardLibrary, setShowCardLibrary, archivedCards } = useGameContext()
  const { getAllCards, updateCard, deleteCard, restoreArchivedCard, getCardsByType } = useCardManagement()
  
  const [selectedType, setSelectedType] = useState<CardType | 'all'>('all')
  const [hoveredCard, setHoveredCard] = useState<BaseCard | null>(null)
  const [hoverPosition, setHoverPosition] = useState<{ x: number, y: number } | null>(null)
  const [editingCard, setEditingCard] = useState<BaseCard | null>(null)
  const [showArchived, setShowArchived] = useState(false)

  if (!showCardLibrary) return null

  const allCards = getAllCards()
  const filteredCards = getCardsByType(selectedType)
  const cardTypes: (CardType | 'all')[] = ['all', 'hero', 'signature', 'hybrid', 'generic', 'spell']

  const handleCardClick = (card: BaseCard) => {
    setEditingCard(card)
  }

  const handleCardHover = (card: BaseCard, event: React.MouseEvent) => {
    setHoveredCard(card)
    setHoverPosition({ x: event.clientX, y: event.clientY })
  }

  const handleCardLeave = () => {
    setHoveredCard(null)
    setHoverPosition(null)
  }

  const handleSaveCard = (updatedCard: BaseCard, archiveOld: boolean) => {
    if (editingCard) {
      updateCard(editingCard, updatedCard, archiveOld)
      setEditingCard(null)
    }
  }

  const handleDeleteCard = (card: BaseCard) => {
    if (confirm(`Delete ${card.name}? This cannot be undone.`)) {
      deleteCard(card)
    }
  }

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => setShowCardLibrary(false)}
      >
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            width: '1200px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ margin: 0 }}>Card Library</h1>
            <button
              onClick={() => setShowCardLibrary(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#9e9e9e',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Close
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '2px solid #eee' }}>
            {cardTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                style={{
                  padding: '10px 16px',
                  backgroundColor: selectedType === type ? '#4a90e2' : 'transparent',
                  color: selectedType === type ? 'white' : '#666',
                  border: 'none',
                  borderBottom: selectedType === type ? '3px solid #1976d2' : '3px solid transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: selectedType === type ? 'bold' : 'normal',
                  textTransform: 'capitalize',
                }}
              >
                {type === 'all' ? 'All Cards' : type}
                {type !== 'all' && (
                  <span style={{ marginLeft: '8px', opacity: 0.7 }}>
                    ({getCardsByType(type).length})
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={() => setShowArchived(!showArchived)}
              style={{
                padding: '10px 16px',
                backgroundColor: showArchived ? '#ff9800' : 'transparent',
                color: showArchived ? 'white' : '#666',
                border: 'none',
                borderBottom: showArchived ? '3px solid #f57c00' : '3px solid transparent',
                cursor: 'pointer',
                fontSize: '14px',
                marginLeft: 'auto',
              }}
            >
              Archived ({archivedCards.length})
            </button>
          </div>

          {/* Cards Grid */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
              padding: '16px',
            }}
          >
            {(showArchived ? archivedCards : filteredCards).map((card, index) => {
              const hasStats = 'attack' in card && 'health' in card && 
                (card as any).attack !== undefined && (card as any).health !== undefined
              const attack = hasStats ? (card as any).attack : null
              const health = hasStats ? (card as any).health : null
              
              // Get color styles for border/background
              const getColorStyles = () => {
                const COLOR_MAP: Record<string, string> = {
                  red: '#d32f2f',
                  blue: '#1976d2',
                  white: '#f5f5f5',
                  black: '#424242',
                  green: '#388e3c',
                }
                const COLOR_LIGHT_MAP: Record<string, string> = {
                  red: '#ffebee',
                  blue: '#e3f2fd',
                  white: '#ffffff',
                  black: '#fafafa',
                  green: '#e8f5e9',
                }
                
                if (!card.colors || card.colors.length === 0) {
                  return {
                    borderColor: '#757575',
                    borderWidth: '2px',
                    backgroundColor: '#fafafa',
                    background: undefined,
                  }
                } else if (card.colors.length === 1) {
                  return {
                    borderColor: COLOR_MAP[card.colors[0]],
                    borderWidth: '3px',
                    backgroundColor: COLOR_LIGHT_MAP[card.colors[0]],
                    background: undefined,
                  }
                } else if (card.colors.length === 2) {
                  return {
                    borderColor: COLOR_MAP[card.colors[0]],
                    borderWidth: '3px',
                    backgroundColor: undefined,
                    background: `linear-gradient(to right, ${COLOR_LIGHT_MAP[card.colors[0]]} 50%, ${COLOR_LIGHT_MAP[card.colors[1]]} 50%)`,
                  }
                } else {
                  // 3+ colors - use first color with indicator
                  return {
                    borderColor: COLOR_MAP[card.colors[0]],
                    borderWidth: '3px',
                    backgroundColor: COLOR_LIGHT_MAP[card.colors[0]],
                    background: undefined,
                  }
                }
              }
              
              const colorStyles = getColorStyles()
              
              return (
                <div
                  key={showArchived ? `${card.id}_${index}` : card.id}
                  style={{
                    border: `${colorStyles.borderWidth} solid ${colorStyles.borderColor}`,
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    backgroundColor: colorStyles.backgroundColor,
                    background: colorStyles.background,
                    transition: 'all 0.2s',
                    position: 'relative',
                    boxShadow: showArchived ? '0 2px 4px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                  onMouseEnter={(e) => handleCardHover(card, e)}
                  onMouseLeave={handleCardLeave}
                  onMouseMove={(e) => setHoverPosition({ x: e.clientX, y: e.clientY })}
                  onClick={() => showArchived ? restoreArchivedCard(card) : handleCardClick(card)}
                >
                  {/* Color indicator bar at top */}
                  {card.colors && card.colors.length > 0 && (
                    <div style={{ 
                      display: 'flex', 
                      height: '4px', 
                      marginBottom: '8px',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}>
                      {card.colors.map((color, idx) => {
                        const COLOR_MAP: Record<string, string> = {
                          red: '#d32f2f',
                          blue: '#1976d2',
                          white: '#f5f5f5',
                          black: '#424242',
                          green: '#388e3c',
                        }
                        return (
                          <div
                            key={idx}
                            style={{
                              flex: 1,
                              backgroundColor: COLOR_MAP[color],
                              borderRight: idx < card.colors!.length - 1 ? '1px solid rgba(255,255,255,0.3)' : 'none',
                            }}
                            title={color}
                          />
                        )
                      })}
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{card.name}</div>
                    {!showArchived && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteCard(card)
                        }}
                        style={{
                          background: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Delete card"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {card.cardType}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                    {card.description.substring(0, 60)}{card.description.length > 60 ? '...' : ''}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
                    {card.manaCost !== undefined && (
                      <div style={{ fontSize: '12px', color: '#1976d2', fontWeight: 'bold' }}>
                        💎 {card.manaCost}
                      </div>
                    )}
                    {hasStats && attack !== null && health !== null && (
                      <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                        ⚔️ {attack} ❤️ {health}
                      </div>
                    )}
                  </div>
                  {showArchived && (
                    <div style={{ fontSize: '10px', color: '#ff9800', marginTop: '8px', fontStyle: 'italic' }}>
                      Click to restore
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {filteredCards.length === 0 && !showArchived && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              No cards of type "{selectedType}" found
            </div>
          )}

          {archivedCards.length === 0 && showArchived && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              No archived cards
            </div>
          )}
        </div>
      </div>

      {/* Hover Preview */}
      {hoveredCard && hoverPosition && (
        <div
          style={{
            position: 'fixed',
            left: `${Math.min(hoverPosition.x + 20, window.innerWidth - 320)}px`,
            top: `${Math.min(hoverPosition.y + 20, window.innerHeight - 200)}px`,
            zIndex: 2000,
            pointerEvents: 'none',
          }}
        >
          <CardPreview card={hoveredCard} />
        </div>
      )}

      {/* Editor Modal */}
      {editingCard && (
        <CardEditorModal
          card={editingCard}
          onSave={handleSaveCard}
          onCancel={() => setEditingCard(null)}
        />
      )}
    </>
  )
}

