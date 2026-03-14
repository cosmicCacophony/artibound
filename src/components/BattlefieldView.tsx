import { MAX_UNITS_PER_LANE, PlayerId } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { useDeployment } from '../hooks/useDeployment'
import { useTurnManagement } from '../hooks/useTurnManagement'
import { HeroCard } from './HeroCard'

interface BattlefieldViewProps {
  battlefieldId: 'battlefieldA' | 'battlefieldB'
}

export function BattlefieldView({ battlefieldId }: BattlefieldViewProps) {
  const {
    gameState,
    selectedCard,
    selectedCardId,
    setSelectedCardId,
    draggedCardId,
    setDraggedCardId,
    metadata,
  } = useGameContext()
  const { handleDeploy, handleCastSpellOnTarget, handleTapSeal } = useDeployment()
  const { handleDeclareAttacker, handleSelectBlocker, handleAssignBlocker } = useTurnManagement()

  const battlefield = gameState[battlefieldId]
  const defendingPlayer: PlayerId = metadata.activePlayer === 'player1' ? 'player2' : 'player1'
  const assignments = metadata.blockerAssignments || {}
  const selectedBlockerId = metadata.selectedBlockerId

  const allGameCards = [
    ...gameState.player1Hand,
    ...gameState.player2Hand,
    ...gameState.player1DeployZone,
    ...gameState.player2DeployZone,
    ...gameState.battlefieldA.player1,
    ...gameState.battlefieldA.player2,
  ]

  const handleLaneClick = (player: PlayerId) => {
    if (!selectedCard || selectedCard.owner !== player) {
      return
    }
    if (selectedCard.location !== 'hand') {
      return
    }
    if (selectedCard.cardType === 'spell') {
      return
    }
    handleDeploy('battlefieldA', undefined, selectedCard)
  }

  const handleCardClick = (cardId: string, player: PlayerId) => {
    const card = battlefield[player].find(item => item.id === cardId)
    if (!card) {
      return
    }

    if (selectedCard?.cardType === 'spell' && selectedCard.owner === metadata.activePlayer && player !== selectedCard.owner) {
      handleCastSpellOnTarget(card, 'battlefieldA', selectedCard)
      return
    }

    if (metadata.currentPhase === 'declare_attackers' && player === metadata.activePlayer) {
      handleDeclareAttacker(cardId)
      return
    }

    if (metadata.currentPhase === 'declare_blockers') {
      if (player === defendingPlayer) {
        handleSelectBlocker(cardId)
        return
      }
      if (player === metadata.activePlayer && selectedBlockerId) {
        handleAssignBlocker(cardId)
        return
      }
    }

    setSelectedCardId(selectedCardId === cardId ? null : cardId)
  }

  const renderSealBar = (player: PlayerId) => {
    const seals = (player === 'player1' ? metadata.player1Seals : metadata.player2Seals).filter(seal => seal.inPlay)
    if (seals.length === 0) {
      return null
    }

    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
        {seals.map(seal => (
          <button
            key={seal.id}
            onClick={() => handleTapSeal(seal.id, player)}
            disabled={seal.tapped || metadata.activePlayer !== player || metadata.currentPhase !== 'play'}
            style={{
              padding: '8px 10px',
              borderRadius: '999px',
              border: '1px solid #475569',
              backgroundColor: seal.tapped ? '#334155' : '#0f172a',
              color: '#fff',
              cursor: seal.tapped ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            {seal.name} {seal.tapped ? '(Tapped)' : '(Tap for rune)'}
          </button>
        ))}
      </div>
    )
  }

  const renderSide = (player: PlayerId) => {
    const cards = battlefield[player]
    const playerColor = player === 'player1' ? '#ef4444' : '#22c55e'
    const blockedAttackerIds = new Set(Object.values(assignments))

    return (
      <div
        style={{
          border: `1px solid ${playerColor}55`,
          borderRadius: '12px',
          padding: '12px',
          backgroundColor: `${playerColor}10`,
          minHeight: '240px',
        }}
        onClick={() => handleLaneClick(player)}
        onDragOver={event => event.preventDefault()}
        onDrop={event => {
          event.preventDefault()
          const cardId = event.dataTransfer.getData('cardId') || draggedCardId
          if (!cardId) return
          const droppedCard = allGameCards.find(card => card.id === cardId)
          if (droppedCard && droppedCard.owner === player && droppedCard.location === 'hand' && droppedCard.cardType !== 'spell') {
            handleDeploy('battlefieldA', undefined, droppedCard)
          }
          setDraggedCardId(null)
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: playerColor, fontWeight: 700 }}>
          <span>{player === 'player1' ? 'Player 1 Battlefield' : 'Player 2 Battlefield'}</span>
          <span>{cards.length}/{MAX_UNITS_PER_LANE}</span>
        </div>

        {renderSealBar(player)}

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {cards.length > 0 ? cards.map(card => {
            const assignedTarget = assignments[card.id]
            const blockerForCard = Object.entries(assignments).find(([, attackerId]) => attackerId === card.id)?.[0]
            const isAttacking = Boolean(metadata.declaredAttackers?.includes(card.id))
            const isBlocked = blockedAttackerIds.has(card.id)
            const isSelectedBlocker = selectedBlockerId === card.id

            return (
              <div key={card.id} style={{ position: 'relative' }}>
                <HeroCard
                  card={card}
                  onClick={() => handleCardClick(card.id, player)}
                  isSelected={selectedCardId === card.id || isAttacking || isSelectedBlocker}
                  showStats={true}
                  draggable={card.location === 'hand'}
                />
                {(isAttacking || isBlocked || assignedTarget || blockerForCard) && (
                  <div style={{ position: 'absolute', left: 8, right: 8, bottom: 8, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {isAttacking && (
                      <div style={{ backgroundColor: '#1d4ed8', color: '#fff', fontSize: '10px', fontWeight: 700, borderRadius: '999px', padding: '2px 8px', textAlign: 'center' }}>
                        Attacking
                      </div>
                    )}
                    {isBlocked && (
                      <div style={{ backgroundColor: '#7c3aed', color: '#fff', fontSize: '10px', fontWeight: 700, borderRadius: '999px', padding: '2px 8px', textAlign: 'center' }}>
                        Blocked
                      </div>
                    )}
                    {assignedTarget && (
                      <div style={{ backgroundColor: '#7c3aed', color: '#fff', fontSize: '10px', fontWeight: 700, borderRadius: '999px', padding: '2px 8px', textAlign: 'center' }}>
                        Blocking
                      </div>
                    )}
                    {blockerForCard && (
                      <div style={{ backgroundColor: '#475569', color: '#fff', fontSize: '10px', fontWeight: 700, borderRadius: '999px', padding: '2px 8px', textAlign: 'center' }}>
                        Has blocker
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          }) : (
            <div style={{ color: '#6b7280', fontSize: '13px' }}>
              {selectedCard && selectedCard.owner === player && selectedCard.location === 'hand'
                ? 'Click to play your selected card here.'
                : 'No creatures in play.'}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ border: '2px solid #334155', borderRadius: '16px', padding: '16px', backgroundColor: '#f8fafc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <h3 style={{ margin: 0 }}>Battlefield</h3>
          <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
            {metadata.currentPhase === 'declare_attackers' && 'Declare attackers with the active player.'}
            {metadata.currentPhase === 'declare_blockers' && 'Select a blocker, then click an attacker to assign it.'}
            {metadata.currentPhase === 'play' && 'Play creatures, cast spells, or tap seals before combat.'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontWeight: 700 }}>
          <span style={{ color: '#ef4444' }}>P1 Tower: {metadata.towerA_player1_HP}</span>
          <span style={{ color: '#22c55e' }}>P2 Tower: {metadata.towerA_player2_HP}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '12px' }}>
        {renderSide('player2')}
        {renderSide('player1')}
      </div>
    </div>
  )
}
