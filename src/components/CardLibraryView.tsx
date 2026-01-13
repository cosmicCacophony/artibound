import { useState } from 'react'
import { BaseCard, CardType } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { useCardManagement } from '../hooks/useCardManagement'
import { CardPreview } from './CardPreview'
import { CardEditorModal } from './CardEditorModal'

export function CardLibraryView() {
  const { showCardLibrary, setShowCardLibrary, archivedCards } = useGameContext()
  const { updateCard, deleteCard, restoreArchivedCard, getCardsByType } = useCardManagement()
  
  const [selectedType, setSelectedType] = useState<CardType | 'all'>('all')
  const [hoveredCard, setHoveredCard] = useState<BaseCard | null>(null)
  const [hoverPosition, setHoverPosition] = useState<{ x: number, y: number } | null>(null)
  const [editingCard, setEditingCard] = useState<BaseCard | null>(null)
  const [showArchived, setShowArchived] = useState(false)

  if (!showCardLibrary) return null

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
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1500,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '80px',
        }}
        onClick={() => setShowCardLibrary(false)}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '90vw',
            maxHeight: '80vh',
            width: '800px',
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

          {/* Cards List - Compact */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
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
                
                if (!card.colors || card.colors.length === 0) {
                  return { borderColor: '#757575' }
                } else {
                  return { borderColor: COLOR_MAP[card.colors[0]] }
                }
              }
              
              const colorStyles = getColorStyles()
              
              return (
                <div
                  key={showArchived ? `${card.id}_${index}` : card.id}
                  style={{
                    borderLeft: `4px solid ${colorStyles.borderColor}`,
                    borderRadius: '4px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px',
                  }}
                  onMouseEnter={(e) => handleCardHover(card, e)}
                  onMouseLeave={handleCardLeave}
                  onMouseMove={(e) => setHoverPosition({ x: e.clientX, y: e.clientY })}
                  onClick={() => showArchived ? restoreArchivedCard(card) : handleCardClick(card)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div style={{ fontWeight: 'bold', minWidth: '150px' }}>{card.name}</div>
                    <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>
                      {card.cardType}
                    </div>
                    {card.colors && card.colors.length > 0 && (
                      <div style={{ display: 'flex', gap: '4px' }}>
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
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: COLOR_MAP[color],
                                border: '1px solid rgba(0,0,0,0.2)',
                              }}
                              title={color}
                            />
                          )
                        })}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {card.manaCost !== undefined && (
                      <div style={{ fontSize: '12px', color: '#1976d2', fontWeight: 'bold', minWidth: '40px' }}>
                        💎 {card.manaCost}
                      </div>
                    )}
                    {hasStats && attack !== null && health !== null && (
                      <div style={{ fontSize: '12px', fontWeight: 'bold', minWidth: '60px' }}>
                        ⚔️{attack} ❤️{health}
                      </div>
                    )}
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
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                        }}
                        title="Delete card"
                      >
                        ×
                      </button>
                    )}
                  </div>
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

