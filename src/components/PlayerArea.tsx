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
  const [hoverPosition, setHoverPosition] = useState<{ x: number, y: number } | null>(null)
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

  const playerColor = player === 'player1' ? '#c41e3a' : '#1e90ff'
  const playerBgColor = player === 'player1' ? '#ffe4e1' : '#e0f6ff'
  const playerTitleColor = player === 'player1' ? '#8b0000' : '#0066cc'
  const playerManaColor = player === 'player1' ? '#8b0000' : '#0066cc'

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
        borderRadius: '2px',
        padding: '1px 2px',
        marginBottom: '0',
        backgroundColor: 'transparent',
      }}
    >
      {/* For Player 1, put resources at bottom; for Player 2, keep at top */}
      {player === 'player2' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0', flexWrap: 'wrap', gap: '2px' }}>
          <h2 style={{ marginTop: 0, marginBottom: 0, color: playerTitleColor, display: 'flex', alignItems: 'center', gap: '2px', fontSize: '10px' }}>
            P2
            {metadata.actionPlayer === player && (
              <span style={{ fontSize: '9px' }} title="Has Action">🎯</span>
            )}
            {metadata.initiativePlayer === player && (
              <span style={{ fontSize: '9px', opacity: metadata.actionPlayer === player ? 0.6 : 1 }} title="Has Initiative">⚡</span>
            )}
          </h2>
          <div style={{ display: 'flex', gap: '2px', alignItems: 'center', flexWrap: 'wrap', fontSize: '8px' }}>
            {/* Rune Pool Display */}
            <RunePoolDisplay 
              runePool={metadata.player2RunePool}
              playerName="Player 2"
              player="player2"
              seals={metadata.player2Seals || []}
            />
            
            {/* Legacy Mana Display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: playerManaColor }}>
                💎 {playerMana}/{playerMaxMana}
                {playerMana > playerMaxMana && (
                  <span style={{ color: '#4caf50', marginLeft: '2px' }}>(+{playerMana - playerMaxMana})</span>
                )}
              </div>
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
                  padding: '2px 4px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontSize: '9px',
                }}
                title="Decrease mana"
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
                  padding: '2px 4px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontSize: '9px',
                }}
                title="Increase mana"
              >
                +1
              </button>
            </div>
            <div style={{ fontSize: '10px', fontWeight: 'bold' }}>💰 {playerGold}</div>
            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#d32f2f' }}>❤️ {playerNexusHP}</div>
            <button
              onClick={() => {
                generateItemShop(player)
                setItemShopPlayer(player)
              }}
              style={{
                padding: '3px 6px',
                backgroundColor: itemShopPlayer === player ? '#f9a825' : '#ffc107',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '9px',
                fontWeight: 'bold',
              }}
            >
              Shop
            </button>
          </div>
        </div>
      )}
      
      {/* Player name and cards - always at top for P2, before resources for P1 */}
      {player === 'player1' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '0' }}>
          <h2 style={{ marginTop: 0, marginBottom: 0, color: playerTitleColor, display: 'flex', alignItems: 'center', gap: '2px', fontSize: '10px' }}>
            P1
            {metadata.actionPlayer === player && (
              <span style={{ fontSize: '9px' }} title="Has Action">🎯</span>
            )}
            {metadata.initiativePlayer === player && (
              <span style={{ fontSize: '9px', opacity: metadata.actionPlayer === player ? 0.6 : 1 }} title="Has Initiative">⚡</span>
            )}
          </h2>
        </div>
      )}
      
      {/* Deploy Zone - Compact with hover */}
      <div style={{ marginBottom: '0', padding: '1px 2px', backgroundColor: '#f5f5f5', borderRadius: '1px', fontSize: '8px' }}>
        <strong style={{ color: playerTitleColor, fontSize: '7px' }}>D({playerDeployZone.length}):</strong>{' '}
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
      {hoveredHandCard && hoverPosition && (() => {
        const card = playerDeployZone.find(c => c.id === hoveredHandCard) || playerHand.find(c => c.id === hoveredHandCard)
        if (!card) return null
        return (
          <div
            style={{
              position: 'fixed',
              left: `${Math.min(hoverPosition.x + 20, window.innerWidth - 320)}px`,
              top: `${Math.min(hoverPosition.y + 20, window.innerHeight - 400)}px`,
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

      {/* Base - Compact like hand cards */}
      <div style={{ marginBottom: '0', border: '1px solid #999', borderRadius: '1px', padding: '1px 2px', backgroundColor: '#e8e8e8' }}>
        <h3 style={{ marginTop: 0, marginBottom: '0', color: '#666', fontSize: '7px' }}>Base({playerBase.length})</h3>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {playerBase.length > 0 ? (
            playerBase.map(card => {
              const hero = card.cardType === 'hero' ? card as Hero : null
              const colors = hero?.colors || []
              const COLOR_MAP: Record<string, string> = {
                red: '#c41e3a',
                blue: '#0078d4',
                white: '#f0e68c',
                black: '#2d2d2d',
                green: '#228b22',
              }
              const manaCost = 'manaCost' in card ? card.manaCost : undefined
              const attack = 'attack' in card ? card.attack : undefined
              const health = 'health' in card ? card.health : undefined
              
              return (
                <div
                  key={card.id}
                  style={{
                    position: 'relative',
                    border: `1px solid ${selectedCardId === card.id ? playerColor : '#ddd'}`,
                    borderRadius: '2px',
                    padding: '2px 4px',
                    backgroundColor: selectedCardId === card.id ? playerBgColor : '#f5f5f5',
                    cursor: 'pointer',
                    fontSize: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    minWidth: '60px',
                    maxWidth: '150px',
                  }}
                  onClick={(e) => handleCardClick(card.id, e)}
                  onMouseEnter={(e) => {
                    setHoveredBaseCard(card.id)
                    setHoverPosition({ x: e.clientX, y: e.clientY })
                  }}
                  onMouseMove={(e) => {
                    setHoverPosition({ x: e.clientX, y: e.clientY })
                  }}
                  onMouseLeave={() => {
                    setHoveredBaseCard(null)
                    setHoverPosition(null)
                  }}
                  draggable={card.cardType === 'hero' && metadata.currentPhase === 'deploy' && !metadata.deathCooldowns[card.id]}
                  onDragStart={(e) => {
                    setDraggedCardId(card.id)
                    e.dataTransfer.setData('cardId', card.id)
                    e.dataTransfer.effectAllowed = 'move'
                  }}
                  onDragEnd={() => {
                    setDraggedCardId(null)
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '8px', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.name}</div>
                  {colors.length > 0 && (
                    <div style={{ display: 'flex', gap: '1px', flexShrink: 0 }}>
                      {colors.map((color, i) => (
                        <div
                          key={i}
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: COLOR_MAP[color],
                            border: '1px solid rgba(0,0,0,0.2)',
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {manaCost !== undefined && (
                    <div style={{ fontSize: '8px', color: '#1976d2', fontWeight: 'bold', flexShrink: 0 }}>
                      {manaCost}
                    </div>
                  )}
                  {attack !== undefined && health !== undefined && (
                    <div style={{ fontSize: '8px', flexShrink: 0 }}>
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
        {hoveredBaseCard && hoverPosition && (() => {
          const card = playerBase.find(c => c.id === hoveredBaseCard)
          if (!card) return null
          return (
            <div
              style={{
                position: 'fixed',
                left: `${Math.min(hoverPosition.x + 20, window.innerWidth - 320)}px`,
                top: `${Math.min(hoverPosition.y + 20, window.innerHeight - 400)}px`,
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
      </div>

      {/* Hand - Compact with hover */}
      <div style={{ marginTop: '0', marginBottom: '0' }}>
        <h3 style={{ marginTop: 0, marginBottom: '0', fontSize: '7px' }}>H({playerHand.length})</h3>
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
                    border: `1px solid ${selectedCardId === card.id ? playerColor : '#ddd'}`,
                    borderRadius: '2px',
                    padding: '2px 4px',
                    backgroundColor: selectedCardId === card.id ? playerBgColor : '#f5f5f5',
                    cursor: 'pointer',
                    fontSize: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    minWidth: '60px',
                    maxWidth: '120px',
                  }}
                  onClick={(e) => handleCardClick(card.id, e)}
                  onMouseEnter={(e) => {
                    setHoveredHandCard(card.id)
                    setHoverPosition({ x: e.clientX, y: e.clientY })
                  }}
                  onMouseMove={(e) => {
                    setHoverPosition({ x: e.clientX, y: e.clientY })
                  }}
                  onMouseLeave={() => {
                    setHoveredHandCard(null)
                    setHoverPosition(null)
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
                >
                  <div style={{ fontWeight: 'bold', fontSize: '10px', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.name}</div>
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
                    <div style={{ fontSize: '8px', color: '#1976d2', fontWeight: 'bold', flexShrink: 0 }}>
                      {manaCost}
                    </div>
                  )}
                  {attack !== undefined && health !== undefined && (
                    <div style={{ fontSize: '8px', flexShrink: 0 }}>
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
        {hoveredHandCard && hoverPosition && (() => {
          const card = playerHand.find(c => c.id === hoveredHandCard)
          if (!card) return null
          return (
            <div
              style={{
                position: 'fixed',
                left: `${Math.min(hoverPosition.x + 20, window.innerWidth - 320)}px`,
                top: `${Math.min(hoverPosition.y + 20, window.innerHeight - 400)}px`,
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
      
      {/* Player 1 Resources at Bottom */}
      {player === 'player1' && (
        <div style={{ display: 'flex', gap: '2px', alignItems: 'center', flexWrap: 'wrap', fontSize: '8px', marginTop: '0', paddingTop: '0', borderTop: '1px solid #ddd' }}>
          {/* Rune Pool Display */}
          <RunePoolDisplay 
            runePool={metadata.player1RunePool}
            playerName="Player 1"
            player="player1"
            seals={metadata.player1Seals || []}
          />
          
          {/* Legacy Mana Display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold', color: playerManaColor }}>
              💎 {playerMana}/{playerMaxMana}
              {playerMana > playerMaxMana && (
                <span style={{ color: '#4caf50', marginLeft: '2px' }}>(+{playerMana - playerMaxMana})</span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setGameState(prev => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    player1Mana: Math.max(0, prev.metadata.player1Mana - 1),
                  },
                }))
              }}
              style={{
                padding: '2px 4px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
                fontSize: '9px',
              }}
              title="Decrease mana"
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
                    player1Mana: prev.metadata.player1Mana + 1,
                  },
                }))
              }}
              style={{
                padding: '2px 4px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
                fontSize: '9px',
              }}
              title="Increase mana"
            >
              +1
            </button>
          </div>
          <div style={{ fontSize: '10px', fontWeight: 'bold' }}>💰 {playerGold}</div>
          <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#d32f2f' }}>❤️ {playerNexusHP}</div>
          <button
            onClick={() => {
              generateItemShop('player1')
              setItemShopPlayer('player1')
            }}
            style={{
              padding: '3px 6px',
              backgroundColor: itemShopPlayer === 'player1' ? '#f9a825' : '#ffc107',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '9px',
              fontWeight: 'bold',
            }}
          >
            Shop
          </button>
        </div>
      )}

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



