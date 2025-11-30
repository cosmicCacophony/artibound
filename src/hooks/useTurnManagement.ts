import { useCallback, useEffect } from 'react'
import { TurnPhase, Card, GameMetadata, ShopItem } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { getDefaultTargets, resolveCombat, resolveSimultaneousCombat } from '../game/combatSystem'
import { tier1Items } from '../game/sampleData'

export function useTurnManagement() {
  const { 
    gameState, 
    setGameState, 
    combatTargetsA, 
    setCombatTargetsA, 
    combatTargetsB, 
    setCombatTargetsB,
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
        // Decrease death cooldown counters by 1 each turn
        const newDeathCooldowns: Record<string, number> = {}
        Object.entries(prev.metadata.deathCooldowns).forEach(([cardId, counter]) => {
          const newCounter = counter - 1
          // Keep cooldowns that are still active (counter > 0)
          if (newCounter > 0) {
            newDeathCooldowns[cardId] = newCounter
          }
          // Counter reaches 0 - hero can be redeployed, remove from cooldown tracking
        })
        
        // Heal heroes in base that are no longer on death cooldown (counter reached 0)
        const healHeroInBase = (c: Card): Card => {
          if (c.cardType === 'hero' && c.location === 'base' && !newDeathCooldowns[c.id] && prev.metadata.deathCooldowns[c.id]) {
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
    
    // Resolve combat simultaneously on both battlefields when leaving play phase
    if (currentPhase === 'play' && metadata.player1Passed && metadata.player2Passed) {
      // Resolve simultaneous combat for both battlefields
      const initialTowerHP = {
        towerA_player1: metadata.towerA_player1_HP,
        towerA_player2: metadata.towerA_player2_HP,
        towerB_player1: metadata.towerB_player1_HP,
        towerB_player2: metadata.towerB_player2_HP,
      }
      
      const resultA = resolveSimultaneousCombat(
        gameState.battlefieldA,
        'battlefieldA',
        initialTowerHP
      )
      
      // Use updated tower HP from A for B's combat
      const resultB = resolveSimultaneousCombat(
        gameState.battlefieldB,
        'battlefieldB',
        resultA.updatedTowerHP
      )
      
      // Apply combat results from both battlefields
      setGameState(prev => {
        const updatedState = {
          ...prev,
          battlefieldA: resultA.updatedBattlefield,
          battlefieldB: resultB.updatedBattlefield,
          metadata: {
            ...prev.metadata,
            towerA_player1_HP: resultA.updatedTowerHP.towerA_player1,
            towerA_player2_HP: resultA.updatedTowerHP.towerA_player2,
            towerB_player1_HP: resultB.updatedTowerHP.towerB_player1,
            towerB_player2_HP: resultB.updatedTowerHP.towerB_player2,
            // Apply overflow damage to nexus (sum from both battlefields)
            player1NexusHP: Math.max(0, prev.metadata.player1NexusHP - (resultA.overflowDamage.player1 + resultB.overflowDamage.player1)),
            player2NexusHP: Math.max(0, prev.metadata.player2NexusHP - (resultA.overflowDamage.player2 + resultB.overflowDamage.player2)),
          },
        }
        return updatedState
      })
      
      // End turn - switch player and reset to play phase
      nextPlayer = player === 'player1' ? 'player2' : 'player1'
      nextPhase = 'play'
      shouldIncrementTurn = nextPlayer === 'player1'
      
      // Reset pass flags at start of new turn
      const resetPassFlags = true
      
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
          // Reset pass flags at start of new turn
          player1Passed: false,
          player2Passed: false,
          // Reset turn 1 deployment phase if we're past turn 1
          ...(shouldIncrementTurn && prev.metadata.currentTurn > 1 ? { turn1DeploymentPhase: 'complete' } : {}),
        },
      }))
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
  }, [metadata, gameState, combatTargetsA, combatTargetsB, setGameState, setCombatTargetsA, setCombatTargetsB])

  const handleToggleSpellPlayed = useCallback((card: Card) => {
    // Allow any card type to be marked as played (spells, units, heroes)
    if (card.location !== 'base') return
    
    setGameState(prev => {
      const isCurrentlyPlayed = prev.metadata.playedSpells[card.id] || false
      const newPlayedSpells = { ...prev.metadata.playedSpells }
      
      if (isCurrentlyPlayed) {
        // Unmarking card - just remove the visual indicator
        delete newPlayedSpells[card.id]
      } else {
        // Marking card as played - just add the visual indicator (no mana cost, no initiative change)
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

  const handleNextTurn = useCallback(() => {
    setGameState(prev => {
      const newTurn = prev.metadata.currentTurn + 1
      
      // Increase max mana for both players (+1 per turn, capped at 10)
      const newPlayer1MaxMana = Math.min(prev.metadata.player1MaxMana + 1, 10)
      const newPlayer2MaxMana = Math.min(prev.metadata.player2MaxMana + 1, 10)
      
      // Decrease death cooldown counters by 1 each turn
      const newDeathCooldowns: Record<string, number> = {}
      Object.entries(prev.metadata.deathCooldowns).forEach(([cardId, counter]) => {
        const newCounter = counter - 1
        // Keep cooldowns that are still active (counter > 0)
        if (newCounter > 0) {
          newDeathCooldowns[cardId] = newCounter
        }
        // Counter reaches 0 - hero can be redeployed, remove from cooldown tracking
      })
      
      // Heal heroes in base that are no longer on death cooldown (counter reached 0)
      const healHeroInBase = (c: Card): Card => {
        if (c.cardType === 'hero' && c.location === 'base' && !newDeathCooldowns[c.id] && prev.metadata.deathCooldowns[c.id]) {
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
          currentTurn: newTurn,
          // Restore mana to max for both players
          player1Mana: newPlayer1MaxMana,
          player2Mana: newPlayer2MaxMana,
          player1MaxMana: newPlayer1MaxMana,
          player2MaxMana: newPlayer2MaxMana,
          // Reset initiative to player 1 at start of new turn
          initiativePlayer: 'player1',
          // Update death cooldowns
          deathCooldowns: newDeathCooldowns,
          // Reset movement flags
          player1MovedToBase: false,
          player2MovedToBase: false,
        },
      }
    })
  }, [setGameState])

  const handlePass = useCallback((player: 'player1' | 'player2') => {
    setGameState(prev => {
      const currentPlayerPassed = player === 'player1' ? prev.metadata.player1Passed : prev.metadata.player2Passed
      const otherPlayerPassed = player === 'player1' ? prev.metadata.player2Passed : prev.metadata.player1Passed
      
      // If both players have passed, go to combat
      if (currentPlayerPassed && otherPlayerPassed) {
        // Both passed - go to combat for battlefield A
        return {
          ...prev,
          metadata: {
            ...prev.metadata,
            currentPhase: 'combatA',
            player1Passed: false, // Reset pass flags
            player2Passed: false,
          },
        }
      }
      
      // Mark this player as passed
      const newMetadata = {
        ...prev.metadata,
        [`${player}Passed`]: true,
      }
      
      // If other player hasn't passed, give them initiative
      if (!otherPlayerPassed) {
        newMetadata.initiativePlayer = player === 'player1' ? 'player2' : 'player1'
      }
      
      return {
        ...prev,
        metadata: newMetadata,
      }
    })
  }, [setGameState])

  return {
    handleNextPhase,
    handleNextTurn,
    handleToggleSpellPlayed,
    handlePass,
  }
}



