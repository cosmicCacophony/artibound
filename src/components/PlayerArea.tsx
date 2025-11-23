import { PlayerId } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { useDeployment } from '../hooks/useDeployment'
import { useTurnManagement } from '../hooks/useTurnManagement'
import { HeroCard } from './HeroCard'

interface PlayerAreaProps {
  player: PlayerId
}

export function PlayerArea({ player }: PlayerAreaProps) {
  const { 
    gameState, 
    selectedCard, 
    selectedCardId, 
    setSelectedCardId, 
    metadata 
  } = useGameContext()
  const { handleDeploy } = useDeployment()
  const { handleToggleSpellPlayed } = useTurnManagement()

  const playerHand = player === 'player1' ? gameState.player1Hand : gameState.player2Hand
  const playerBase = player === 'player1' ? gameState.player1Base : gameState.player2Base
  const playerMana = player === 'player1' ? metadata.player1Mana : metadata.player2Mana
  const playerMaxMana = player === 'player1' ? metadata.player1MaxMana : metadata.player2MaxMana
  const playerGold = player === 'player1' ? metadata.player1Gold : metadata.player2Gold
  const playerNexusHP = player === 'player1' ? metadata.player1NexusHP : metadata.player2NexusHP

  const playerColor = player === 'player1' ? '#f44336' : '#2196f3'
  const playerBgColor = player === 'player1' ? '#ffebee' : '#e3f2fd'
  const playerName = player === 'player1' ? 'Warrior' : 'Mage'
  const playerTitleColor = player === 'player1' ? '#c62828' : '#1976d2'
  const playerManaColor = player === 'player1' ? '#c62828' : '#1976d2'

  const handleCardClick = (cardId: string) => {
    setSelectedCardId(selectedCardId === cardId ? null : cardId)
  }

  return (
    <div
      style={{
        border: `3px solid ${playerColor}`,
        borderRadius: '8px',
        padding: '20px',
        marginBottom: player === 'player2' ? '20px' : 0,
        backgroundColor: playerBgColor,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 style={{ marginTop: 0, color: playerTitleColor }}>Player {player === 'player1' ? '1' : '2'} - {playerName}</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: playerManaColor }}>
            Mana: {playerMana}/{playerMaxMana}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
            Gold: {playerGold}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#d32f2f' }}>
            Nexus: {playerNexusHP} HP
          </div>
        </div>
      </div>
      
      {/* Base */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Base ({playerBase.length})</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '60px' }}>
          {playerBase.length > 0 ? (
            playerBase.map(card => (
              <HeroCard
                key={card.id}
                card={card}
                onClick={() => handleCardClick(card.id)}
                isSelected={selectedCardId === card.id}
                showStats={false}
                isDead={!!metadata.deathCooldowns[card.id]}
                isPlayed={card.cardType === 'spell' && !!metadata.playedSpells[card.id]}
                onTogglePlayed={card.cardType === 'spell' ? () => handleToggleSpellPlayed(card) : undefined}
              />
            ))
          ) : (
            <p style={{ color: '#999' }}>Empty</p>
          )}
        </div>
        {selectedCard && selectedCard.owner === player && (
          <button
            onClick={() => handleDeploy('base')}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Move {selectedCard.name} to Base
          </button>
        )}
      </div>

      {/* Hand */}
      <div>
        <h3>Hand ({playerHand.length})</h3>
        {selectedCard && selectedCard.owner === player && player === 'player1' && (
          <div
            style={{
              padding: '10px',
              backgroundColor: '#fff9c4',
              borderRadius: '4px',
              marginBottom: '15px',
            }}
          >
            <strong>Selected: {selectedCard.name}</strong> - Choose a deployment location above
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {playerHand.length > 0 ? (
            playerHand.map(card => (
              <HeroCard
                key={card.id}
                card={card}
                onClick={() => handleCardClick(card.id)}
                isSelected={selectedCardId === card.id}
                showStats={true}
                isDead={!!metadata.deathCooldowns[card.id]}
                isPlayed={card.cardType === 'spell' && card.location === 'base' && !!metadata.playedSpells[card.id]}
                onTogglePlayed={card.cardType === 'spell' && card.location === 'base' ? () => handleToggleSpellPlayed(card) : undefined}
              />
            ))
          ) : (
            <p style={{ color: '#999' }}>Empty</p>
          )}
        </div>
      </div>
    </div>
  )
}

