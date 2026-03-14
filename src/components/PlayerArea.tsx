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
  const playerTowerHp = player === 'player1' ? metadata.towerA_player1_HP : metadata.towerA_player2_HP
  const playerRunes = [
    ...(metadata.laneRunes?.battlefieldA[player] || []),
    ...(metadata.temporaryRunes?.[player] || []),
  ]

  const playerColor = player === 'player1' ? '#ef4444' : '#3b82f6'
  const playerBg = player === 'player1' ? '#fef2f2' : '#eff6ff'
  const playerLabel = player === 'player1' ? 'Player 1 (Red/Black)' : 'Player 2 (Green/White)'

  const handleCardClick = (cardId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setSelectedCardId(selectedCardId === cardId ? null : cardId)
  }

  return (
    <div style={{ border: `2px solid ${playerColor}`, borderRadius: '12px', padding: '16px', marginBottom: player === 'player2' ? '15px' : 0, backgroundColor: playerBg }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '12px', flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, color: playerColor, fontSize: '16px' }}>
          {playerLabel}
          {metadata.actionPlayer === player && <span style={{ marginLeft: '8px', fontSize: '13px', color: '#111827' }}>(acting)</span>}
        </h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <LaneRuneDisplay laneRunes={playerRunes} laneName="Lane" />
          <div style={{ fontSize: '14px', fontWeight: 700, color: playerColor }}>
            Mana: {playerMana}/{playerMaxMana}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#991b1b' }}>
            Tower: {playerTowerHp}
          </div>
        </div>
      </div>

      {selectedCard && selectedCard.owner === player && (
        <div style={{ padding: '8px 12px', backgroundColor: '#fff7ed', borderRadius: '8px', marginBottom: '10px', fontSize: '13px', color: '#7c2d12' }}>
          <strong>{selectedCard.name}</strong> selected.
          {selectedCard.cardType === 'spell' ? ' Click an enemy creature to cast it.' : ' Click your battlefield to play it.'}
        </div>
      )}

      <div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
          Hand ({playerHand.length})
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', minHeight: '50px' }}>
          {playerHand.length > 0 ? (
            playerHand.map(card => (
              <HeroCard
                key={card.id}
                card={card}
                onClick={(event) => handleCardClick(card.id, event)}
                isSelected={selectedCardId === card.id}
                showStats={true}
                laneRunes={{ battlefieldA: playerRunes, battlefieldB: [] }}
                draggable={true}
                isDragging={draggedCardId === card.id}
                onDragStart={(event) => {
                  event.stopPropagation()
                  setDraggedCardId(card.id)
                  event.dataTransfer.effectAllowed = 'move'
                  event.dataTransfer.setData('text/plain', card.id)
                  event.dataTransfer.setData('cardId', card.id)
                }}
                onDragEnd={() => setDraggedCardId(null)}
              />
            ))
          ) : (
            <span style={{ color: '#64748b', fontSize: '13px' }}>Empty</span>
          )}
        </div>
      </div>
    </div>
  )
}
