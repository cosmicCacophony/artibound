import React, { useState } from 'react'
import { PlayerId, Hero, HeroAbility } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { RunePoolDisplay } from './RunePoolDisplay'
import { useDeployment } from '../hooks/useDeployment'
import { useTurnManagement } from '../hooks/useTurnManagement'
import { useItemShop } from '../hooks/useItemShop'
import { useHeroAbilities } from '../hooks/useHeroAbilities'
import { HeroCard } from './HeroCard'
import { HeroAbilityEditor } from './HeroAbilityEditor'

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
    draggedCardId,
    setDraggedCardId,
    metadata,
    setItemShopPlayer,
    itemShopPlayer,
  } = useGameContext()
  const [editingHeroId, setEditingHeroId] = useState<string | null>(null)
  const { handleDeploy } = useDeployment()
  const { handleToggleSpellPlayed, handleToggleStun } = useTurnManagement()
  const { generateItemShop } = useItemShop()
  const { handleAbilityClick } = useHeroAbilities()

  const playerHand = player === 'player1' ? gameState.player1Hand : gameState.player2Hand
  const playerBase = player === 'player1' ? gameState.player1Base : gameState.player2Base
  const playerDeployZone = player === 'player1' ? gameState.player1DeployZone : gameState.player2DeployZone
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
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Rune Pool Display */}
          <RunePoolDisplay 
            runePool={player === 'player1' ? metadata.player1RunePool : metadata.player2RunePool}
            playerName={player === 'player1' ? 'Player 1' : 'Player 2'}
            player={player}
            seals={player === 'player1' ? (metadata.player1Seals || []) : (metadata.player2Seals || [])}
          />
          
          {/* Legacy Mana Display (for backward compatibility) */}
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
      
      {/* Deploy Zone - Heroes ready to deploy */}
      <div style={{ marginBottom: '20px', border: `2px solid ${playerColor}`, borderRadius: '8px', padding: '15px', backgroundColor: '#f5f5f5' }}>
        <h3 style={{ marginTop: 0, color: playerTitleColor }}>Deploy Zone ({playerDeployZone.length})</h3>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '-10px', marginBottom: '10px' }}>Heroes ready to deploy to battlefields</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '60px' }}>
          {playerDeployZone.length > 0 ? (
            playerDeployZone.map(card => (
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
                isStunned={card.cardType === 'hero' && Boolean(metadata.stunnedHeroes?.[card.id])}
                onToggleStun={card.cardType === 'hero' ? () => handleToggleStun(card) : undefined}
                onAbilityClick={(heroId, ability) => handleAbilityClick(heroId, ability, card.owner)}
                draggable={true}
                isDragging={draggedCardId === card.id}
                onDragStart={(e) => {
                  // Allow drag for heroes - validation happens on drop
                  if (card.cardType !== 'hero') {
                    console.log('Preventing drag - not a hero', card.cardType)
                    e.preventDefault()
                    return
                  }
                  e.stopPropagation()
                  console.log('[PlayerArea] onDragStart - Setting draggedCardId:', card.id, card.name)
                  setDraggedCardId(card.id)
                  e.dataTransfer.effectAllowed = 'move'
                  // Set data in both formats
                  e.dataTransfer.setData('text/plain', card.id)
                  e.dataTransfer.setData('cardId', card.id)
                  console.log('[PlayerArea] onDragStart - dataTransfer types:', Array.from(e.dataTransfer.types))
                }}
                onDragEnd={(e) => {
                  setDraggedCardId(null)
                }}
              />
            ))
          ) : (
            <p style={{ color: '#999' }}>Empty</p>
          )}
        </div>
      </div>

      {/* Base - Heroes on cooldown and artifacts */}
      <div style={{ marginBottom: '20px', border: '2px solid #999', borderRadius: '8px', padding: '15px', backgroundColor: '#e8e8e8' }}>
        <h3 style={{ marginTop: 0, color: '#666' }}>Base ({playerBase.length})</h3>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '-10px', marginBottom: '10px' }}>Heroes on cooldown and artifacts</p>
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
                isStunned={card.cardType === 'hero' && Boolean(metadata.stunnedHeroes?.[card.id])}
                onToggleStun={card.cardType === 'hero' ? () => handleToggleStun(card) : undefined}
                onAbilityClick={(heroId, ability) => handleAbilityClick(heroId, ability, card.owner)}
                draggable={card.cardType === 'hero' && metadata.currentPhase === 'deploy' && !metadata.deathCooldowns[card.id]}
                isDragging={draggedCardId === card.id}
                onDragStart={(e) => {
                  setDraggedCardId(card.id)
                  e.dataTransfer.setData('cardId', card.id)
                  e.dataTransfer.effectAllowed = 'move'
                }}
                onDragEnd={() => {
                  setDraggedCardId(null)
                }}
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
                onEditAbility={card.cardType === 'hero' ? (heroId) => setEditingHeroId(heroId) : undefined}
                draggable={true}
                isDragging={draggedCardId === card.id}
                onDragStart={(e) => {
                  // Allow drag for heroes - validation happens on drop
                  if (card.cardType !== 'hero') {
                    console.log('Preventing drag - not a hero', card.cardType)
                    e.preventDefault()
                    return
                  }
                  e.stopPropagation()
                  console.log('[PlayerArea] onDragStart - Setting draggedCardId:', card.id, card.name)
                  setDraggedCardId(card.id)
                  e.dataTransfer.effectAllowed = 'move'
                  // Set data in both formats
                  e.dataTransfer.setData('text/plain', card.id)
                  e.dataTransfer.setData('cardId', card.id)
                  console.log('[PlayerArea] onDragStart - dataTransfer types:', Array.from(e.dataTransfer.types))
                }}
                onDragEnd={(e) => {
                  setDraggedCardId(null)
                }}
              />
            ))
          ) : (
            <p style={{ color: '#999' }}>Empty</p>
          )}
        </div>
      </div>

      {editingHeroId && (() => {
        const editingHero = [
          ...gameState.player1Hand,
          ...gameState.player2Hand,
          ...gameState.player1Base,
          ...gameState.player2Base,
          ...gameState.player1DeployZone,
          ...gameState.player2DeployZone,
          ...gameState.battlefieldA.player1,
          ...gameState.battlefieldA.player2,
          ...gameState.battlefieldB.player1,
          ...gameState.battlefieldB.player2,
        ].find(c => c.id === editingHeroId && c.cardType === 'hero') as Hero | undefined

        if (!editingHero) return null

        return (
          <HeroAbilityEditor
            hero={editingHero}
            onSave={(heroId, ability) => {
              setGameState(prev => {
                const findAndUpdateHero = (cards: any[]): any[] => {
                  return cards.map(card => {
                    if (card.id === heroId && card.cardType === 'hero') {
                      return {
                        ...card,
                        ability: ability,
                      } as Hero
                    }
                    return card
                  })
                }

                return {
                  ...prev,
                  player1Hand: findAndUpdateHero(prev.player1Hand),
                  player2Hand: findAndUpdateHero(prev.player2Hand),
                  player1Base: findAndUpdateHero(prev.player1Base),
                  player2Base: findAndUpdateHero(prev.player2Base),
                  player1DeployZone: findAndUpdateHero(prev.player1DeployZone),
                  player2DeployZone: findAndUpdateHero(prev.player2DeployZone),
                  battlefieldA: {
                    player1: findAndUpdateHero(prev.battlefieldA.player1),
                    player2: findAndUpdateHero(prev.battlefieldA.player2),
                  },
                  battlefieldB: {
                    player1: findAndUpdateHero(prev.battlefieldB.player1),
                    player2: findAndUpdateHero(prev.battlefieldB.player2),
                  },
                }
              })
              setEditingHeroId(null)
            }}
            onClose={() => setEditingHeroId(null)}
          />
        )
      })()}
    </div>
  )
}



