import { useCallback, useEffect } from 'react'
import { TurnPhase, Card, GameMetadata } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { getDefaultTargets, resolveCombat } from '../game/combatSystem'
import { tier1Items } from '../game/sampleData'

export function useTurnManagement() {
  const { 
    gameState, 
    setGameState, 
    combatTargetsA, 
    setCombatTargetsA, 
    combatTargetsB, 
    setCombatTargetsB,
    setItemShopItems,
    setShowItemShop,
  } = useGameContext()
  const metadata = gameState.metadata

  // Initialize combat targets when entering combat phase
  useEffect(() => {
    if (metadata.currentPhase === 'combatA') {
      const defaults = getDefaultTargets(gameState.battlefieldA, metadata.activePlayer)
      setCombatTargetsA(new Map(defaults))
    } else if (metadata.currentPhase === 'combatB') {
      const defaults = getDefaultTargets(gameState.battlefieldB, metadata.activePlayer)
      setCombatTargetsB(new Map(defaults))
    }
  }, [metadata.currentPhase, metadata.activePlayer, gameState.battlefieldA, gameState.battlefieldB, setCombatTargetsA, setCombatTargetsB])

  const handleNextPhase = useCallback(() => {
    const player = metadata.activePlayer
    const currentPhase = metadata.currentPhase
    
    // Phase progression: play -> combatA -> adjust -> combatB -> play (next player)
    let nextPhase: TurnPhase = 'play'
    let nextPlayer: 'player1' | 'player2' = player
    let shouldIncrementTurn = false
    
    // When starting a new turn (play phase), reset movement flags and clear expired death cooldowns
    if (currentPhase === 'combatB') {
      // Next phase will be play for next player - reset movement flags
      setGameState(prev => {
        // Clear death cooldowns that are 1+ turns old (can redeploy now)
        const newDeathCooldowns: Record<string, number> = {}
        const currentTurn = prev.metadata.currentTurn
        Object.entries(prev.metadata.deathCooldowns).forEach(([cardId, turnDied]) => {
          // Keep cooldowns that are still active (died this turn or last turn)
          if (currentTurn - turnDied < 1) {
            newDeathCooldowns[cardId] = turnDied
          }
        })
        
        // Heal heroes in base that are no longer on death cooldown
        const healHeroInBase = (c: Card): Card => {
          if (c.cardType === 'hero' && c.location === 'base' && !newDeathCooldowns[c.id]) {
            const hero = c as import('../game/types').Hero
            if (hero.currentHealth < hero.maxHealth) {
              return { ...hero, currentHealth: hero.maxHealth }
            }
          }
          return c
        }
        
        return {
          ...prev,
          player1Base: prev.player1Base.map(healHeroInBase),
          player2Base: prev.player2Base.map(healHeroInBase),
          metadata: {
            ...prev.metadata,
            deathCooldowns: newDeathCooldowns,
            player1MovedToBase: false,
            player2MovedToBase: false,
          },
        }
      })
    }
    
    // Resolve combat before leaving combat phase
    if (currentPhase === 'combatA') {
      // Resolve combat for battlefield A
      const targets = combatTargetsA.size > 0 ? combatTargetsA : getDefaultTargets(gameState.battlefieldA, player)
      const result = resolveCombat(
        gameState.battlefieldA,
        'battlefieldA',
        targets,
        player,
        {
          towerA: metadata.towerA_HP,
          towerB: metadata.towerB_HP,
        }
      )
      
      // Apply combat results
      setGameState(prev => {
        const updatedState = {
          ...prev,
          battlefieldA: result.updatedBattlefield,
          metadata: {
            ...prev.metadata,
            towerA_HP: result.updatedTowerHP.towerA,
            // Apply overflow damage to nexus
            player2NexusHP: Math.max(0, prev.metadata.player2NexusHP - result.overflowDamage),
          },
        }
        return updatedState
      })
      
      nextPhase = 'adjust'
    } else if (currentPhase === 'adjust') {
      nextPhase = 'combatB'
    } else if (currentPhase === 'combatB') {
      // Resolve combat for battlefield B
      const targets = combatTargetsB.size > 0 ? combatTargetsB : getDefaultTargets(gameState.battlefieldB, player)
      const result = resolveCombat(
        gameState.battlefieldB,
        'battlefieldB',
        targets,
        player,
        {
          towerA: metadata.towerA_HP,
          towerB: metadata.towerB_HP,
        }
      )
      
      // Apply combat results
      setGameState(prev => {
        const updatedState = {
          ...prev,
          battlefieldB: result.updatedBattlefield,
          metadata: {
            ...prev.metadata,
            towerB_HP: result.updatedTowerHP.towerB,
            // Apply overflow damage to nexus
            player2NexusHP: Math.max(0, prev.metadata.player2NexusHP - result.overflowDamage),
          },
        }
        return updatedState
      })
      // End turn - switch player and reset to play phase
      nextPlayer = player === 'player1' ? 'player2' : 'player1'
      nextPhase = 'play'
      shouldIncrementTurn = nextPlayer === 'player1'
      
      // Regenerate mana for next player (+1 max mana, restore to max)
      const nextPlayerMaxMana = Math.min(
        (nextPlayer === 'player1' ? metadata.player1MaxMana : metadata.player2MaxMana) + 1,
        10 // Cap at 10
      )
      
      // Calculate gold per turn (base + items)
      const baseGoldPerTurn = 3
      let goldPerTurnFromItems = 0
      
      // Check all heroes for gold per turn items
      const allPlayerCards = [
        ...gameState[`${player}Hand` as keyof typeof gameState] as Card[],
        ...gameState.battlefieldA[player as 'player1' | 'player2'],
        ...gameState.battlefieldB[player as 'player1' | 'player2'],
      ]
      
      allPlayerCards.forEach(card => {
        if (card.cardType === 'hero') {
          const hero = card as import('../game/types').Hero
          const equippedItems = hero.equippedItems || []
          equippedItems.forEach(itemId => {
            const item = tier1Items.find(i => i.id === itemId)
            if (item && item.goldPerTurn) {
              goldPerTurnFromItems += item.goldPerTurn
            }
          })
        }
      })

      const totalGoldThisTurn = baseGoldPerTurn + goldPerTurnFromItems

      setGameState(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [`${player}Gold`]: (prev.metadata[`${player}Gold` as keyof GameMetadata] as number) + totalGoldThisTurn,
          currentTurn: prev.metadata.currentTurn + (shouldIncrementTurn ? 1 : 0),
          activePlayer: nextPlayer,
          currentPhase: nextPhase,
          [`${nextPlayer}MaxMana`]: nextPlayerMaxMana,
          [`${nextPlayer}Mana`]: nextPlayerMaxMana, // Restore to max
        },
      }))
      
      // Generate item shop for next player
      setTimeout(() => {
        const newPlayerTier = nextPlayer === 'player1' ? metadata.player1Tier : metadata.player2Tier
        const availableItems = tier1Items.filter(item => item.tier === newPlayerTier)
        const shuffled = [...availableItems].sort(() => Math.random() - 0.5)
        setItemShopItems(shuffled.slice(0, 3))
        setShowItemShop(true)
      }, 0)
      return
    }
    
    // Just advance phase
    setGameState(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        currentPhase: nextPhase,
      },
    }))
  }, [metadata, gameState, combatTargetsA, combatTargetsB, setGameState, setCombatTargetsA, setCombatTargetsB, setItemShopItems, setShowItemShop])

  const handleToggleSpellPlayed = useCallback((card: Card) => {
    if (card.cardType !== 'spell' || card.location !== 'base') return
    
    setGameState(prev => {
      const isCurrentlyPlayed = prev.metadata.playedSpells[card.id] || false
      const newPlayedSpells = { ...prev.metadata.playedSpells }
      
      if (isCurrentlyPlayed) {
        delete newPlayedSpells[card.id]
      } else {
        newPlayedSpells[card.id] = true
      }
      
      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          playedSpells: newPlayedSpells,
        },
      }
    })
  }, [setGameState])

  return {
    handleNextPhase,
    handleToggleSpellPlayed,
  }
}

