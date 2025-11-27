import React, { useState } from 'react'
import { DraftPack, DraftPoolItem, DraftPickType, BaseCard, Color } from '../game/types'
import { HeroCard } from './HeroCard'
import { CardEditorModal } from './CardEditorModal'
import { useCardManagement } from '../hooks/useCardManagement'

// Color palette mapping
const COLOR_MAP: Record<Color, string> = {
  red: '#d32f2f',
  blue: '#1976d2',
  white: '#f5f5f5',
  black: '#424242',
  green: '#388e3c',
}

const COLOR_LIGHT_MAP: Record<Color, string> = {
  red: '#ffebee',
  blue: '#e3f2fd',
  white: '#ffffff',
  black: '#fafafa',
  green: '#e8f5e9',
}

interface DraftPackProps {
  pack: DraftPack
  selectedItem: DraftPoolItem | null
  onItemClick: (item: DraftPoolItem) => void
  isPlayer1Turn: boolean
}

export default function DraftPackComponent({ pack, selectedItem, onItemClick, isPlayer1Turn }: DraftPackProps) {
  const [editingCard, setEditingCard] = useState<BaseCard | null>(null)
  const { updateCard } = useCardManagement()
  
  const groupedItems = {
    heroes: pack.remainingItems.filter(item => item.type === 'hero'),
    cards: pack.remainingItems.filter(item => item.type === 'card'),
    battlefields: pack.remainingItems.filter(item => item.type === 'battlefield'),
  }

  const handleEditCard = (e: React.MouseEvent, item: DraftPoolItem) => {
    e.stopPropagation()
    if (item.type === 'hero' || item.type === 'card') {
      setEditingCard(item.item as BaseCard)
    }
  }

  const handleSaveCard = (updatedCard: BaseCard, archiveOld: boolean) => {
    if (editingCard) {
      updateCard(editingCard, updatedCard, archiveOld)
      setEditingCard(null)
      // Note: The draft pack won't update immediately, but the card library will
      // The user would need to refresh or we'd need to add state management for draft packs
    }
  }

  const getColorStyles = (colors?: Color[]) => {
    if (!colors || colors.length === 0) {
      return {
        borderColor: '#757575',
        backgroundColor: '#fafafa',
        borderWidth: '2px',
      }
    } else if (colors.length === 1) {
      const color = colors[0]
      return {
        borderColor: COLOR_MAP[color],
        backgroundColor: COLOR_LIGHT_MAP[color],
        borderWidth: '3px',
      }
    } else {
      // Multicolor - create gradient background
      const gradientColors = colors.map(c => COLOR_LIGHT_MAP[c]).join(', ')
      return {
        borderColor: COLOR_MAP[colors[0]], // Primary color border
        background: colors.length === 2
          ? `linear-gradient(to right, ${COLOR_LIGHT_MAP[colors[0]]} 50%, ${COLOR_LIGHT_MAP[colors[1]]} 50%)`
          : `linear-gradient(135deg, ${colors.map((c, i) => {
              const percent = (i / colors.length) * 100
              return `${COLOR_LIGHT_MAP[c]} ${percent}%`
            }).join(', ')})`,
        borderWidth: '3px',
      }
    }
  }

  const renderItem = (item: DraftPoolItem) => {
    const isSelected = selectedItem?.id === item.id
    const canSelect = true // Allow selecting items for either player

    // Get colors from the item
    let itemColors: Color[] = []
    if (item.type === 'hero' || item.type === 'card') {
      itemColors = (item.item as any).colors || []
    }

    const colorStyles = getColorStyles(itemColors)

    let cardData: any = null
    if (item.type === 'hero') {
      const hero = item.item as any
      // Create a proper Hero object for HeroCard component
      cardData = {
        id: hero.id,
        name: hero.name,
        description: hero.description,
        cardType: 'hero' as const,
        colors: hero.colors || [],
        attack: hero.attack || 0,
        health: hero.health || 0,
        maxHealth: hero.maxHealth || hero.health || 0,
        currentHealth: hero.currentHealth || hero.health || 0,
        supportEffect: hero.supportEffect,
        location: 'hand' as const,
        owner: 'player1' as const,
        equippedItems: hero.equippedItems || [],
        signatureCardIds: hero.signatureCardIds || [],
      }
    } else if (item.type === 'card') {
      const card = item.item as any
      // Create a proper card object for display
      if (card.cardType === 'generic') {
        cardData = {
          id: card.id,
          name: card.name,
          description: card.description,
          cardType: 'generic' as const,
          manaCost: card.manaCost,
          colors: card.colors || [],
          attack: card.attack || 0,
          health: card.health || 0,
          maxHealth: card.maxHealth || card.health || 0,
          currentHealth: card.currentHealth || card.health || 0,
          location: 'hand' as const,
          owner: 'player1' as const,
        }
      } else {
        cardData = {
          ...card,
          location: 'hand' as const,
          owner: 'player1' as const,
        }
      }
    }

    return (
      <div
        key={item.id}
        onClick={() => canSelect && onItemClick(item)}
        onContextMenu={(e) => {
          e.preventDefault()
          if (item.type === 'hero' || item.type === 'card') {
            handleEditCard(e, item)
          }
        }}
        style={{
          border: isSelected ? '3px solid #2196F3' : `${colorStyles.borderWidth} solid ${colorStyles.borderColor}`,
          borderRadius: '8px',
          padding: '8px',
          cursor: canSelect ? 'pointer' : 'default',
          // For selected items, use a lighter version of the card's color, or blue if colorless
          backgroundColor: isSelected 
            ? (itemColors.length > 0 ? COLOR_LIGHT_MAP[itemColors[0]] : '#E3F2FD')
            : (colorStyles.backgroundColor || colorStyles.background || '#fff'),
          background: isSelected 
            ? (itemColors.length > 1 ? colorStyles.background : undefined)
            : (colorStyles.background || undefined),
          opacity: canSelect ? 1 : 0.6,
          transition: 'all 0.2s',
          position: 'relative',
          boxShadow: itemColors.length > 0 ? `0 2px 8px rgba(0,0,0,0.15)` : 'none',
        }}
      >
        {(item.type === 'hero' || item.type === 'card') && (
          <button
            onClick={(e) => handleEditCard(e, item)}
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              padding: '4px 8px',
              fontSize: '10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              zIndex: 10,
            }}
            title="Edit card (or right-click)"
          >
            Edit
          </button>
        )}
        {item.type === 'hero' && cardData && (
          <HeroCard card={cardData} />
        )}
        {/* Color indicator bar at top */}
        {itemColors.length > 0 && (
          <div style={{ 
            display: 'flex', 
            height: '6px', 
            marginBottom: '8px',
            borderRadius: '3px',
            overflow: 'hidden',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
          }}>
            {itemColors.map((color, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  backgroundColor: COLOR_MAP[color],
                  borderRight: idx < itemColors.length - 1 ? '1px solid rgba(255,255,255,0.3)' : 'none',
                }}
                title={color}
              />
            ))}
          </div>
        )}
        {item.type === 'card' && (
          <div style={{ marginTop: itemColors.length > 0 ? '14px' : '0' }}>
            <div style={{ fontWeight: 'bold' }}>{item.item.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{item.item.description}</div>
            {(item.item as any).manaCost && (
              <div style={{ marginTop: '4px' }}>
                <span style={{ backgroundColor: '#2196F3', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>
                  {(item.item as any).manaCost} Mana
                </span>
              </div>
            )}
            {(item.item as any).attack !== undefined && (item.item as any).health !== undefined && (
              <div style={{ marginTop: '4px', fontSize: '14px' }}>
                {(item.item as any).attack} / {(item.item as any).health}
              </div>
            )}
            {/* Color badges */}
            {itemColors.length > 0 && (
              <div style={{ marginTop: '6px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {itemColors.map((color, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: COLOR_MAP[color],
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }}
                  >
                    {color}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        {item.type === 'battlefield' && (
          <div>
            <div style={{ fontWeight: 'bold', color: '#9C27B0' }}>Battlefield</div>
            <div style={{ fontWeight: 'bold' }}>{item.item.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{item.item.description}</div>
            <div style={{ marginTop: '4px', fontSize: '12px', fontStyle: 'italic' }}>
              {(item.item as any).staticAbility}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <h2>Round Pack - Available Items</h2>
      <div style={{ marginBottom: '16px', color: '#666' }}>
        {pack.remainingItems.length} items remaining
      </div>

      {groupedItems.heroes.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '12px', color: '#FF9800' }}>Heroes ({groupedItems.heroes.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {groupedItems.heroes.map(renderItem)}
          </div>
        </div>
      )}

      {groupedItems.cards.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '12px', color: '#2196F3' }}>Cards ({groupedItems.cards.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {groupedItems.cards.map(renderItem)}
          </div>
        </div>
      )}

      {groupedItems.battlefields.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '12px', color: '#9C27B0' }}>Battlefields ({groupedItems.battlefields.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {groupedItems.battlefields.map(renderItem)}
          </div>
        </div>
      )}

      {pack.remainingItems.length === 0 && (
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#E8F5E9', borderRadius: '8px' }}>
          This pack is empty! A new pack will be generated for the next round.
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
  )
}

