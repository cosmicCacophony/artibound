import React from 'react'
import { PlayerId } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { LaneRuneDisplay } from './LaneRuneDisplay'
import { HeroCard } from './HeroCard'

interface PlayerAreaProps {
  player: PlayerId
}

export function PlayerArea({ player }: PlayerAreaProps) {
  const { 
    gameState,
    selectedCardId, 
    setSelectedCardId,
    draggedCardId,
    setDraggedCardId,
    metadata,
    selectedCard,
  } = useGameContext()

  const playerHand = player === 'player1' ? gameState.player1Hand : gameState.player2Hand
  const playerMana = player === 'player1' ? metadata.player1Mana : metadata.player2Mana
  const playerMaxMana = player === 'player1' ? metadata.player1MaxMana : metadata.player2MaxMana
  const playerNexusHP = player === 'player1' ? metadata.player1NexusHP : metadata.player2NexusHP

  const playerColor = player === 'player1' ? '#e53935' : '#1e88e5'
  const playerBg = player === 'player1' ? '#ffebee' : '#e3f2fd'
  const playerLabel = player === 'player1' ? 'Player 1 (RB)' : 'Player 2 (GW)'

  const playerLaneRunes = metadata.laneRunes ? {
    battlefieldA: metadata.laneRunes.battlefieldA[player],
    battlefieldB: metadata.laneRunes.battlefieldB[player],
  } : undefined

  const handleCardClick = (cardId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setSelectedCardId(selectedCardId === cardId ? null : cardId)
  }

  return (
    <div
      style={{
        border: `2px solid ${playerColor}`,
        borderRadius: '8px',
        padding: '16px',
        marginBottom: player === 'player2' ? '15px' : 0,
        backgroundColor: playerBg,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, color: playerColor, fontSize: '16px' }}>
          {playerLabel}
          {metadata.actionPlayer === player && (
            <span style={{ marginLeft: '8px', fontSize: '14px' }} title="Has Action">🎯</span>
          )}
        </h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {/* Lane runes */}
          {metadata.laneRunes && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <LaneRuneDisplay laneRunes={metadata.laneRunes.battlefieldA[player]} laneName="A" />
              <LaneRuneDisplay laneRunes={metadata.laneRunes.battlefieldB[player]} laneName="B" />
            </div>
          )}
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: playerColor }}>
            Mana: {playerMana}/{playerMaxMana}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#d32f2f' }}>
            Nexus: {playerNexusHP}
          </div>
        </div>
      </div>

      {/* Hint for selected card */}
      {selectedCard && selectedCard.owner === player && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#fff9c4',
          borderRadius: '4px',
          marginBottom: '10px',
          fontSize: '13px',
        }}>
          <strong>{selectedCard.name}</strong>
          {' — '}
          {selectedCard.cardType === 'spell' && 'effect' in selectedCard &&
            ['damage', 'targeted_damage', 'damage_and_stun'].includes(selectedCard.effect.type)
            ? 'Click an enemy unit in a lane to cast.'
            : 'Click a lane to deploy.'}
        </div>
      )}

      {/* Hand */}
      <div>
        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', marginBottom: '6px' }}>
          Hand ({playerHand.length})
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', minHeight: '50px' }}>
          {playerHand.length > 0 ? (
            playerHand.map(card => {
              const isTargetedSpell =
                card.cardType === 'spell' &&
                'effect' in card &&
                ['damage', 'targeted_damage', 'damage_and_stun'].includes(
                  (card as import('../game/types').SpellCard).effect.type
                )
              const canDrag = card.cardType !== 'spell' || isTargetedSpell

              return (
                <HeroCard
                  key={card.id}
                  card={card}
                  onClick={(e) => handleCardClick(card.id, e)}
                  isSelected={selectedCardId === card.id}
                  showStats={true}
                  laneRunes={playerLaneRunes}
                  draggable={canDrag}
                  isDragging={draggedCardId === card.id}
                  onDragStart={(e) => {
                    if (!canDrag) { e.preventDefault(); return }
                    e.stopPropagation()
                    setDraggedCardId(card.id)
                    e.dataTransfer.effectAllowed = 'move'
                    e.dataTransfer.setData('text/plain', card.id)
                    e.dataTransfer.setData('cardId', card.id)
                  }}
                  onDragEnd={() => setDraggedCardId(null)}
                />
              )
            })
          ) : (
            <span style={{ color: '#999', fontSize: '13px' }}>Empty</span>
          )}
        </div>
      </div>
    </div>
  )
}
