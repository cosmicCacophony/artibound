import React, { useState } from 'react'
import { PlayerId, Hero } from '../game/types'
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
  const [hoveredBaseCard, setHoveredBaseCard] = useState<string | null>(null)
  const [hoveredHandCard, setHoveredHandCard] = useState<string | null>(null)
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
        border: `1px solid ${playerColor}`,
        borderRadius: '4px',
        padding: '6px',
        marginBottom: player === 'player2' ? '6px' : 0,
        backgroundColor: playerBgColor,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <h2 style={{ marginTop: 0, marginBottom: 0, color: playerTitleColor, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
          Player {player === 'player1' ? '1' : '2'}
          {metadata.actionPlayer === player && (
            <span style={{ fontSize: '12px' }} title="Has Action">🎯</span>
          )}
          {metadata.initiativePlayer === player && (
            <span style={{ fontSize: '12px', opacity: metadata.actionPlayer === player ? 0.6 : 1 }} title="Has Initiative (will act first next turn)">⚡</span>
          )}
        </h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', fontSize: '12px' }}>
          {/* Rune Pool Display */}
          <RunePoolDisplay 
            runePool={player === 'player1' ? metadata.player1RunePool : metadata.player2RunePool}
            playerName={player === 'player1' ? 'Player 1' : 'Player 2'}
            player={player}
            seals={player === 'player1' ? (metadata.player1Seals || []) : (metadata.player2Seals || [])}
          />
          
          {/* Legacy Mana Display (for backward compatibility) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: playerManaColor }}>
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
          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
            Gold: {playerGold}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#d32f2f' }}>
            Nexus: {playerNexusHP} HP
          </div>
          <button
            onClick={() => {
              generateItemShop(player)
              setItemShopPlayer(player)
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: itemShopPlayer === player ? '#f9a825' : '#ffc107',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            {itemShopPlayer === player ? 'Shop (Open)' : 'Item Shop'}
          </button>
        </div>
      </div>
      
      {/* Deploy Zone - Compact with hover */}
      <div style={{ marginBottom: '4px', padding: '4px 6px', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '10px' }}>
        <strong style={{ color: playerTitleColor, fontSize: '10px' }}>Deploy ({playerDeployZone.length}):</strong>{' '}
        {playerDeployZone.length > 0 ? (
          <span style={{ display: 'inline-flex', gap: '4px', flexWrap: 'wrap' }}>
            {playerDeployZone.map((card) => {
              const hero = card as Hero
              const colors = hero.colors || []
              const COLOR_MAP: Record<string, string> = {
                red: '#d32f2f',
                blue: '#1976d2',
                white: '#f5f5f5',
                black: '#424242',
                green: '#388e3c',
              }
              return (
                <span
                  key={card.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    padding: '2px 6px',
                    border: `1px solid ${selectedCardId === card.id ? playerColor : '#ddd'}`,
                    borderRadius: '3px',
                    backgroundColor: selectedCardId === card.id ? playerBgColor : 'white',
                    cursor: 'grab',
                    fontSize: '10px',
                  }}
                  draggable={true}
                  onDragStart={(e) => {
                    if (card.cardType !== 'hero') {
                      e.preventDefault()
                      return
                    }
                    e.stopPropagation()
                    setDraggedCardId(card.id)
                    e.dataTransfer.effectAllowed = 'move'
                    e.dataTransfer.setData('text/plain', card.id)
                    e.dataTransfer.setData('cardId', card.id)
                  }}
                  onDragEnd={() => {
                    setDraggedCardId(null)
                  }}
                  onMouseEnter={() => setHoveredHandCard(card.id)}
                  onMouseLeave={() => setHoveredHandCard(null)}
                  onClick={(e) => handleCardClick(card.id, e)}
                >
                  <span style={{ fontWeight: 'bold' }}>{card.name}</span>
                  {colors.length > 0 && (
                    <span style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }}>
                      {colors.map((color, i) => (
                        <span
                          key={i}
                          style={{
                            display: 'inline-block',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: COLOR_MAP[color],
                            border: '1px solid rgba(0,0,0,0.2)',
                          }}
                          title={color}
                        />
                      ))}
                    </span>
                  )}
                  {'attack' in card && 'health' in card && (
                    <span style={{ fontSize: '9px', color: '#666' }}>
                      {card.attack}/{card.health}
                    </span>
                  )}
                </span>
              )
            })}
          </span>
        ) : (
          <span style={{ color: '#999' }}>Empty</span>
        )}
      </div>
      {hoveredHandCard && (() => {
        const card = playerDeployZone.find(c => c.id === hoveredHandCard) || playerHand.find(c => c.id === hoveredHandCard)
        if (!card) return null
        return (
          <div
            style={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2000,
              pointerEvents: 'none',
            }}
          >
            <HeroCard
              card={card}
              onClick={() => {}}
              isSelected={false}
              showStats={true}
              isDead={!!metadata.deathCooldowns[card.id]}
              cooldownCounter={metadata.deathCooldowns[card.id]}
              isPlayed={card.location === 'base' && !!metadata.playedSpells[card.id]}
              onTogglePlayed={() => {}}
              isStunned={card.cardType === 'hero' && Boolean(metadata.stunnedHeroes?.[card.id])}
              onToggleStun={undefined}
              onAbilityClick={() => {}}
            />
          </div>
        )
      })()}

      {/* Base - Heroes on cooldown and artifacts */}
      <div style={{ marginBottom: '4px', border: '1px solid #999', borderRadius: '4px', padding: '4px', backgroundColor: '#e8e8e8' }}>
        <h3 style={{ marginTop: 0, marginBottom: '4px', color: '#666', fontSize: '10px' }}>Base ({playerBase.length})</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {playerBase.length > 0 ? (
            playerBase.map(card => (
              <div
                key={card.id}
                style={{
                  position: 'relative',
                  transform: 'scale(0.4)',
                  transformOrigin: 'top left',
                  marginRight: '-60%',
                  marginBottom: '-60%',
                }}
                onMouseEnter={() => setHoveredBaseCard(card.id)}
                onMouseLeave={() => setHoveredBaseCard(null)}
              >
                <HeroCard
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
              </div>
            ))
          ) : (
            <p style={{ color: '#999', fontSize: '12px' }}>Empty</p>
          )}
        </div>
        {hoveredBaseCard && (() => {
          const card = playerBase.find(c => c.id === hoveredBaseCard)
          if (!card) return null
          return (
            <div
              style={{
                position: 'fixed',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2000,
                pointerEvents: 'none',
              }}
            >
              <HeroCard
                card={card}
                onClick={() => {}}
                isSelected={false}
                showStats={true}
                isDead={!!metadata.deathCooldowns[card.id]}
                cooldownCounter={metadata.deathCooldowns[card.id]}
                isPlayed={!!metadata.playedSpells[card.id]}
                onTogglePlayed={() => {}}
                isStunned={card.cardType === 'hero' && Boolean(metadata.stunnedHeroes?.[card.id])}
                onToggleStun={undefined}
                onAbilityClick={() => {}}
              />
            </div>
          )
        })()}
        {selectedCard && selectedCard.owner === player && (
          <button
            onClick={() => handleDeploy('base')}
            style={{
              marginTop: '10px',
              padding: '6px 12px',
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Move {selectedCard.name} to Base
          </button>
        )}
      </div>

      {/* Hand - Compact with hover */}
      <div style={{ marginTop: '4px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '2px', fontSize: '10px' }}>Hand ({playerHand.length})</h3>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {playerHand.length > 0 ? (
            playerHand.map(card => {
              const hero = card.cardType === 'hero' ? card as Hero : null
              const colors = hero?.colors || []
              const COLOR_MAP: Record<string, string> = {
                red: '#d32f2f',
                blue: '#1976d2',
                white: '#f5f5f5',
                black: '#424242',
                green: '#388e3c',
              }
              const manaCost = 'manaCost' in card ? card.manaCost : undefined
              const attack = 'attack' in card ? card.attack : undefined
              const health = 'health' in card ? card.health : undefined
              
              return (
                <div
                  key={card.id}
                  style={{
                    position: 'relative',
                    border: `2px solid ${selectedCardId === card.id ? playerColor : '#ddd'}`,
                    borderRadius: '4px',
                    padding: '4px 8px',
                    backgroundColor: selectedCardId === card.id ? playerBgColor : '#f5f5f5',
                    cursor: 'pointer',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    minWidth: '80px',
                  }}
                  onClick={(e) => handleCardClick(card.id, e)}
                  onMouseEnter={() => setHoveredHandCard(card.id)}
                  onMouseLeave={() => setHoveredHandCard(null)}
                  draggable={true}
                  onDragStart={(e) => {
                    if (card.cardType !== 'hero') {
                      e.preventDefault()
                      return
                    }
                    e.stopPropagation()
                    setDraggedCardId(card.id)
                    e.dataTransfer.effectAllowed = 'move'
                    e.dataTransfer.setData('text/plain', card.id)
                    e.dataTransfer.setData('cardId', card.id)
                  }}
                  onDragEnd={() => {
                    setDraggedCardId(null)
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '10px' }}>{card.name}</div>
                  {colors.length > 0 && (
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {colors.map((color, i) => (
                        <div
                          key={i}
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: COLOR_MAP[color],
                            border: '1px solid rgba(0,0,0,0.2)',
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {manaCost !== undefined && (
                    <div style={{ fontSize: '10px', color: '#1976d2', fontWeight: 'bold' }}>
                      {manaCost}
                    </div>
                  )}
                  {attack !== undefined && health !== undefined && (
                    <div style={{ fontSize: '10px' }}>
                      {attack}/{health}
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <p style={{ color: '#999', fontSize: '11px' }}>Empty</p>
          )}
        </div>
        {hoveredHandCard && (() => {
          const card = playerHand.find(c => c.id === hoveredHandCard)
          if (!card) return null
          return (
            <div
              style={{
                position: 'fixed',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2000,
                pointerEvents: 'none',
              }}
            >
              <HeroCard
                card={card}
                onClick={() => {}}
                isSelected={false}
                showStats={true}
                isDead={!!metadata.deathCooldowns[card.id]}
                cooldownCounter={metadata.deathCooldowns[card.id]}
                isPlayed={card.location === 'base' && !!metadata.playedSpells[card.id]}
                onTogglePlayed={() => {}}
                isStunned={card.cardType === 'hero' && Boolean(metadata.stunnedHeroes?.[card.id])}
                onToggleStun={undefined}
                onAbilityClick={() => {}}
              />
            </div>
          )
        })()}
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



