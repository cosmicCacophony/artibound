import React, { useState } from 'react'
import { DraftedItems, Hero, BaseCard, BattlefieldDefinition } from '../game/types'
import { CardPreview } from './CardPreview'
import { HeroCard } from './HeroCard'
import { CardEditorModal } from './CardEditorModal'
import { useCardManagement } from '../hooks/useCardManagement'

interface DraftPicksProps {
  player1Drafted: DraftedItems
  player2Drafted: DraftedItems
}

export default function DraftPicks({ player1Drafted, player2Drafted }: DraftPicksProps) {
  const [hoveredItem, setHoveredItem] = useState<{
    type: 'hero' | 'card' | 'battlefield'
    item: Hero | BaseCard | BattlefieldDefinition
    player: 'player1' | 'player2'
  } | null>(null)
  const [editingCard, setEditingCard] = useState<BaseCard | null>(null)
  const { updateCard } = useCardManagement()

  const handleEditCard = (item: Hero | BaseCard | BattlefieldDefinition) => {
    if (item && ('cardType' in item)) {
      setEditingCard(item as BaseCard)
    }
  }

  const handleSaveCard = (updatedCard: BaseCard, archiveOld: boolean) => {
    if (editingCard) {
      updateCard(editingCard, updatedCard, archiveOld)
      setEditingCard(null)
    }
  }

  const renderItemList = (
    items: (Hero | BaseCard | BattlefieldDefinition)[],
    type: 'hero' | 'card' | 'battlefield',
    player: 'player1' | 'player2'
  ) => {
    if (items.length === 0) {
      return <div style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>None</div>
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            onMouseEnter={() => setHoveredItem({ type, item, player })}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              padding: '6px 8px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px',
              color: '#333',
              border: '1px solid #e0e0e0',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#e8e8e8'
              e.currentTarget.style.borderColor = player === 'player1' ? '#4CAF50' : '#f44336'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5'
              e.currentTarget.style.borderColor = '#e0e0e0'
            }}
            onDoubleClick={() => {
              if (type === 'hero' || type === 'card') {
                handleEditCard(item)
              }
            }}
            title={type === 'hero' || type === 'card' ? 'Double-click to edit' : ''}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{item.name}</span>
              {(type === 'hero' || type === 'card') && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditCard(item)
                  }}
                  style={{
                    padding: '2px 6px',
                    fontSize: '10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <h2>Drafted Items</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', position: 'relative' }}>
        {/* Player 1 */}
        <div style={{ 
          border: '2px solid #4CAF50', 
          borderRadius: '8px', 
          padding: '16px',
          backgroundColor: '#f9f9f9',
        }}>
          <h3 style={{ color: '#2e7d32', marginTop: 0, marginBottom: '16px' }}>Player 1 (You)</h3>
          <div style={{ marginBottom: '16px' }}>
            <strong style={{ color: '#333', display: 'block', marginBottom: '8px' }}>
              Heroes: {player1Drafted.heroes.length}
            </strong>
            {renderItemList(player1Drafted.heroes, 'hero', 'player1')}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <strong style={{ color: '#333', display: 'block', marginBottom: '8px' }}>
              Cards: {player1Drafted.cards.length}
            </strong>
            {renderItemList(player1Drafted.cards, 'card', 'player1')}
          </div>
          <div>
            <strong style={{ color: '#333', display: 'block', marginBottom: '8px' }}>
              Battlefields: {player1Drafted.battlefields.length}
            </strong>
            {renderItemList(player1Drafted.battlefields, 'battlefield', 'player1')}
          </div>
        </div>

        {/* Player 2 */}
        <div style={{ 
          border: '2px solid #f44336', 
          borderRadius: '8px', 
          padding: '16px',
          backgroundColor: '#f9f9f9',
        }}>
          <h3 style={{ color: '#c62828', marginTop: 0, marginBottom: '16px' }}>Player 2 (Opponent)</h3>
          <div style={{ marginBottom: '16px' }}>
            <strong style={{ color: '#333', display: 'block', marginBottom: '8px' }}>
              Heroes: {player2Drafted.heroes.length}
            </strong>
            {renderItemList(player2Drafted.heroes, 'hero', 'player2')}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <strong style={{ color: '#333', display: 'block', marginBottom: '8px' }}>
              Cards: {player2Drafted.cards.length}
            </strong>
            {renderItemList(player2Drafted.cards, 'card', 'player2')}
          </div>
          <div>
            <strong style={{ color: '#333', display: 'block', marginBottom: '8px' }}>
              Battlefields: {player2Drafted.battlefields.length}
            </strong>
            {renderItemList(player2Drafted.battlefields, 'battlefield', 'player2')}
          </div>
        </div>

        {/* Hover Preview */}
        {hoveredItem && (
          <div
            style={{
              position: 'fixed',
              top: hoveredItem.player === 'player1' ? '120px' : '120px',
              right: '20px',
              zIndex: 1000,
              pointerEvents: 'none',
            }}
          >
            {hoveredItem.type === 'hero' && (
              <div style={{ transform: 'scale(0.8)', transformOrigin: 'top right' }}>
                <HeroCard
                  card={{
                    ...(hoveredItem.item as Hero),
                    location: 'hand',
                    owner: hoveredItem.player,
                  }}
                />
              </div>
            )}
            {hoveredItem.type === 'card' && (
              <CardPreview card={hoveredItem.item as BaseCard} />
            )}
            {hoveredItem.type === 'battlefield' && (
              <div
                style={{
                  border: '2px solid #9C27B0',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#F3E5F5',
                  minWidth: '250px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#9C27B0', marginBottom: '8px', fontSize: '14px' }}>
                  BATTLEFIELD
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
                  {(hoveredItem.item as BattlefieldDefinition).name}
                </div>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                  {(hoveredItem.item as BattlefieldDefinition).description}
                </div>
                <div style={{ fontSize: '12px', fontStyle: 'italic', color: '#7b1fa2' }}>
                  {(hoveredItem.item as BattlefieldDefinition).staticAbility}
                </div>
                {(hoveredItem.item as BattlefieldDefinition).colors && (hoveredItem.item as BattlefieldDefinition).colors.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#666' }}>Colors:</span>
                    {(hoveredItem.item as BattlefieldDefinition).colors.map((color, idx) => {
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
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: COLOR_MAP[color],
                            border: '2px solid rgba(0,0,0,0.2)',
                          }}
                          title={color}
                        />
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Card Editor Modal */}
        {editingCard && (
          <CardEditorModal
            card={editingCard}
            onSave={handleSaveCard}
            onCancel={() => setEditingCard(null)}
          />
        )}
      </div>
    </div>
  )
}

