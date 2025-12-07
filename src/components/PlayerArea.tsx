import { PlayerId } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { useDeployment } from '../hooks/useDeployment'
import { useTurnManagement } from '../hooks/useTurnManagement'
import { useItemShop } from '../hooks/useItemShop'
import { useHeroAbilities } from '../hooks/useHeroAbilities'
import { HeroCard } from './HeroCard'

interface PlayerAreaProps {
  player: PlayerId
}

export function PlayerArea({ player }: PlayerAreaProps) {
  const { 
    gameState,
    setGameState,
    selectedCard, 
    selectedCardId, 
    setSelectedCardId, 
    metadata,
    setItemShopPlayer,
    itemShopPlayer,
  } = useGameContext()
  const { handleDeploy } = useDeployment()
  const { handleToggleSpellPlayed } = useTurnManagement()
  const { generateItemShop } = useItemShop()
  const { handleAbilityClick } = useHeroAbilities()

  const playerHand = player === 'player1' ? gameState.player1Hand : gameState.player2Hand
  const playerBase = player === 'player1' ? gameState.player1Base : gameState.player2Base
  const playerMana = player === 'player1' ? metadata.player1Mana : metadata.player2Mana
  const playerMaxMana = player === 'player1' ? metadata.player1MaxMana : metadata.player2MaxMana
  const playerGold = player === 'player1' ? metadata.player1Gold : metadata.player2Gold
  const playerNexusHP = player === 'player1' ? metadata.player1NexusHP : metadata.player2NexusHP

  const playerColor = player === 'player1' ? '#f44336' : '#2196f3'
  const playerBgColor = player === 'player1' ? '#ffebee' : '#e3f2fd'
  const playerTitleColor = player === 'player1' ? '#c62828' : '#1976d2'
  const playerManaColor = player === 'player1' ? '#c62828' : '#1976d2'

  const handleCardClick = (cardId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
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
        <h2 style={{ marginTop: 0, color: playerTitleColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
          Player {player === 'player1' ? '1' : '2'}
          {metadata.actionPlayer === player && (
            <span style={{ fontSize: '20px' }} title="Has Action">🎯</span>
          )}
          {metadata.initiativePlayer === player && (
            <span style={{ fontSize: '20px', opacity: metadata.actionPlayer === player ? 0.6 : 1 }} title="Has Initiative (will act first next turn)">⚡</span>
          )}
        </h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: playerManaColor }}>
              Mana: {playerMana}/{playerMaxMana}
              {playerMana > playerMaxMana && (
                <span style={{ color: '#4caf50', marginLeft: '4px' }} title="Current mana exceeds max (from effects like +1 mana per turn)">
                  (+{playerMana - playerMaxMana})
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setGameState(prev => ({
                    ...prev,
                    metadata: {
                      ...prev.metadata,
                      [`${player}Mana`]: Math.max(0, (prev.metadata[`${player}Mana` as keyof typeof prev.metadata] as number) - 1),
                    },
                  }))
                }}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
                title="Decrease mana by 1"
              >
                -1
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setGameState(prev => ({
                    ...prev,
                    metadata: {
                      ...prev.metadata,
                      [`${player}Mana`]: (prev.metadata[`${player}Mana` as keyof typeof prev.metadata] as number) + 1,
                    },
                  }))
                }}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
                title="Increase mana by 1 (for effects like +1 mana per turn)"
              >
                +1
              </button>
            </div>
          </div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
            Gold: {playerGold}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#d32f2f' }}>
            Nexus: {playerNexusHP} HP
          </div>
          <button
            onClick={() => {
              generateItemShop(player)
              setItemShopPlayer(player)
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: itemShopPlayer === player ? '#f9a825' : '#ffc107',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            {itemShopPlayer === player ? 'Shop (Open)' : 'Item Shop'}
          </button>
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
                onClick={(e) => handleCardClick(card.id, e)}
                isSelected={selectedCardId === card.id}
                showStats={true}
                isDead={!!metadata.deathCooldowns[card.id]}
                cooldownCounter={metadata.deathCooldowns[card.id]}
                isPlayed={!!metadata.playedSpells[card.id]}
                onTogglePlayed={() => handleToggleSpellPlayed(card)}
                onAbilityClick={(heroId, ability) => handleAbilityClick(heroId, ability, card.owner)}
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
                onClick={(e) => handleCardClick(card.id, e)}
                isSelected={selectedCardId === card.id}
                showStats={true}
                isDead={!!metadata.deathCooldowns[card.id]}
                cooldownCounter={metadata.deathCooldowns[card.id]}
                isPlayed={card.location === 'base' && !!metadata.playedSpells[card.id]}
                onTogglePlayed={card.location === 'base' ? () => handleToggleSpellPlayed(card) : undefined}
                onAbilityClick={(heroId, ability) => handleAbilityClick(heroId, ability, card.owner)}
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



