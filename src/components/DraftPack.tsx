import React from 'react'
import { DraftPack, DraftPoolItem, DraftPickType } from '../game/types'
import { HeroCard } from './HeroCard'

interface DraftPackProps {
  pack: DraftPack
  selectedItem: DraftPoolItem | null
  onItemClick: (item: DraftPoolItem) => void
  isPlayer1Turn: boolean
}

export default function DraftPackComponent({ pack, selectedItem, onItemClick, isPlayer1Turn }: DraftPackProps) {
  const groupedItems = {
    heroes: pack.remainingItems.filter(item => item.type === 'hero'),
    cards: pack.remainingItems.filter(item => item.type === 'card'),
    battlefields: pack.remainingItems.filter(item => item.type === 'battlefield'),
  }

  const renderItem = (item: DraftPoolItem) => {
    const isSelected = selectedItem?.id === item.id
    const canSelect = true // Allow selecting items for either player

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
        style={{
          border: isSelected ? '3px solid #2196F3' : '1px solid #ccc',
          borderRadius: '8px',
          padding: '8px',
          cursor: canSelect ? 'pointer' : 'default',
          backgroundColor: isSelected ? '#E3F2FD' : canSelect ? '#fff' : '#f5f5f5',
          opacity: canSelect ? 1 : 0.6,
          transition: 'all 0.2s',
        }}
      >
        {item.type === 'hero' && cardData && (
          <HeroCard card={cardData} />
        )}
        {item.type === 'card' && (
          <div>
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
      <h2>Pack {pack.packNumber} - Available Items</h2>
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
          Pack {pack.packNumber} is complete!
        </div>
      )}
    </div>
  )
}

