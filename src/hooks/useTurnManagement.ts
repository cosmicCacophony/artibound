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
    setShowCombatSummary,
    setCombatSummaryData,
  } = useGameContext()
  const metadata = gameState.metadata

  // Combat is now resolved automatically when both players pass, no separate combat phases

  const handleNextPhase = useCallback(() => {
    const player = metadata.activePlayer
    const currentPhase = metadata.currentPhase
    
    // Phase progression: play -> play (next player) - combat happens automatically when both pass
    let nextPhase: TurnPhase = 'play'
    let nextPlayer: 'player1' | 'player2' = player
    let shouldIncrementTurn = false
    
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
        initialTowerHP,
        metadata.stunnedHeroes || {}
      )
      
      // Use updated tower HP from A for B's combat
      const resultB = resolveSimultaneousCombat(
        gameState.battlefieldB,
        'battlefieldB',
        resultA.updatedTowerHP,
        metadata.stunnedHeroes || {}
      )
      
      // Process killed heroes (same logic as in BattlefieldView) - separate by player
      const processKilledHeroes = (
        originalBattlefield: typeof gameState.battlefieldA,
        updatedBattlefield: typeof gameState.battlefieldA,
        player1Base: Card[],
        player2Base: Card[],
        deathCooldowns: Record<string, number>,
        goldRewards: { player1: number, player2: number }
      ) => {
        const newP1Base = [...player1Base]
        const newP2Base = [...player2Base]
        const newCooldowns = { ...deathCooldowns }
        
        // Process player1 heroes
        originalBattlefield.player1.forEach(originalCard => {
          if (originalCard.cardType === 'hero') {
            const stillAlive = updatedBattlefield.player1.some(c => c.id === originalCard.id)
            if (!stillAlive) {
              const hero = originalCard as import('../game/types').Hero
              newP1Base.push({
                ...hero,
                location: 'base' as const,
                currentHealth: 0,
                slot: undefined,
              })
              newCooldowns[hero.id] = 2
              // Opponent (player2) gets 5 gold for killing hero
              goldRewards.player2 += 5
            }
          } else if (originalCard.cardType === 'generic') {
            const stillAlive = updatedBattlefield.player1.some(c => c.id === originalCard.id)
            if (!stillAlive) {
              // Opponent (player2) gets 2 gold for killing unit
              goldRewards.player2 += 2
            }
          }
        })
        
        // Process player2 heroes
        originalBattlefield.player2.forEach(originalCard => {
          if (originalCard.cardType === 'hero') {
            const stillAlive = updatedBattlefield.player2.some(c => c.id === originalCard.id)
            if (!stillAlive) {
              const hero = originalCard as import('../game/types').Hero
              newP2Base.push({
                ...hero,
                location: 'base' as const,
                currentHealth: 0,
                slot: undefined,
              })
              newCooldowns[hero.id] = 2
              // Opponent (player1) gets 5 gold for killing hero
              goldRewards.player1 += 5
            }
          } else if (originalCard.cardType === 'generic') {
            const stillAlive = updatedBattlefield.player2.some(c => c.id === originalCard.id)
            if (!stillAlive) {
              // Opponent (player1) gets 2 gold for killing unit
              goldRewards.player1 += 2
            }
          }
        })
        
        return { newP1Base, newP2Base, newCooldowns }
      }
      
      const goldRewards = { player1: 0, player2: 0 }
      const { newP1Base: newP1BaseA, newP2Base: newP2BaseA, newCooldowns: newCooldownsA } = processKilledHeroes(
        gameState.battlefieldA,
        resultA.updatedBattlefield,
        gameState.player1Base,
        gameState.player2Base,
        metadata.deathCooldowns,
        goldRewards
      )
      
      const { newP1Base: newP1BaseB, newP2Base: newP2BaseB, newCooldowns: newCooldownsB } = processKilledHeroes(
        gameState.battlefieldB,
        resultB.updatedBattlefield,
        newP1BaseA,
        newP2BaseA,
        newCooldownsA,
        goldRewards
      )
      
      // Apply combat results from both battlefields
      setGameState(prev => {
        const updatedState = {
          ...prev,
          battlefieldA: resultA.updatedBattlefield,
          battlefieldB: resultB.updatedBattlefield,
          player1Base: newP1BaseB,
          player2Base: newP2BaseB,
          metadata: {
            ...prev.metadata,
            towerA_player1_HP: resultA.updatedTowerHP.towerA_player1,
            towerA_player2_HP: resultA.updatedTowerHP.towerA_player2,
            towerB_player1_HP: resultB.updatedTowerHP.towerB_player1,
            towerB_player2_HP: resultB.updatedTowerHP.towerB_player2,
            // Apply overflow damage to nexus (sum from both battlefields)
            player1NexusHP: Math.max(0, prev.metadata.player1NexusHP - (resultA.overflowDamage.player1 + resultB.overflowDamage.player1)),
            player2NexusHP: Math.max(0, prev.metadata.player2NexusHP - (resultA.overflowDamage.player2 + resultB.overflowDamage.player2)),
            player1Gold: (prev.metadata.player1Gold as number) + goldRewards.player1,
            player2Gold: (prev.metadata.player2Gold as number) + goldRewards.player2,
            deathCooldowns: newCooldownsB,
          },
        }
        return updatedState
      })
      
      // Show combat summary modal
      setCombatSummaryData({
        battlefieldA: {
          name: 'Battlefield A',
          combatLog: resultA.combatLog,
          towerHP: {
            player1: resultA.updatedTowerHP.towerA_player1,
            player2: resultA.updatedTowerHP.towerA_player2,
          },
          overflowDamage: resultA.overflowDamage,
        },
        battlefieldB: {
          name: 'Battlefield B',
          combatLog: resultB.combatLog,
          towerHP: {
            player1: resultB.updatedTowerHP.towerB_player1,
            player2: resultB.updatedTowerHP.towerB_player2,
          },
          overflowDamage: resultB.overflowDamage,
        },
      })
      setShowCombatSummary(true)
      
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

  const handleToggleStun = useCallback((hero: Card) => {
    // Only heroes can be stunned
    if (hero.cardType !== 'hero') return
    
    setGameState(prev => {
      // Ensure stunnedHeroes exists (for backward compatibility with old game states)
      const currentStunnedHeroes = prev.metadata.stunnedHeroes || {}
      const isCurrentlyStunned = currentStunnedHeroes[hero.id] || false
      
      let newStunnedHeroes: Record<string, boolean>
      if (isCurrentlyStunned) {
        // Unstunning hero - create new object without this hero's ID
        const { [hero.id]: _, ...rest } = currentStunnedHeroes
        newStunnedHeroes = rest
      } else {
        // Stunning hero - they won't deal combat damage, only receive it
        newStunnedHeroes = { ...currentStunnedHeroes, [hero.id]: true }
      }
      
      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          stunnedHeroes: newStunnedHeroes,
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
      
      // At start of new turn, action goes to whoever has initiative
      // If no one has initiative (shouldn't happen), default to player1
      const nextAction = prev.metadata.initiativePlayer || 'player1'
      
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
          // Both players get 2 gold at the start of each turn
          player1Gold: (prev.metadata.player1Gold as number) + 2,
          player2Gold: (prev.metadata.player2Gold as number) + 2,
          // Action goes to whoever has initiative
          actionPlayer: nextAction,
          // Initiative carries over (unless it was null, then default to player1)
          initiativePlayer: prev.metadata.initiativePlayer || 'player1',
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
      // Handle turn 1 deployment passing (counter-deployment phases)
      if (prev.metadata.currentTurn === 1 && prev.metadata.turn1DeploymentPhase && 
          prev.metadata.turn1DeploymentPhase !== 'complete') {
        const phase = prev.metadata.turn1DeploymentPhase
        
        // During counter-deployment phases, passing skips counter-deployment
        if (phase === 'p2_lane1' && player === 'player2') {
          // Player 2 passes counter-deployment to lane 1, move to lane 2 deployment
          return {
            ...prev,
            metadata: {
              ...prev.metadata,
              turn1DeploymentPhase: 'p2_lane2',
            },
          }
        } else if (phase === 'p1_lane2' && player === 'player1') {
          // Player 1 passes counter-deployment to lane 2, deployment complete
          return {
            ...prev,
            metadata: {
              ...prev.metadata,
              turn1DeploymentPhase: 'complete',
              actionPlayer: 'player1',
              initiativePlayer: 'player1',
            },
          }
        } else {
          // Wrong player trying to pass, or wrong phase
          return prev
        }
      }
      
      // Normal turn passing (play phase)
      const currentPlayerPassed = player === 'player1' ? prev.metadata.player1Passed : prev.metadata.player2Passed
      const otherPlayerPassed = player === 'player1' ? prev.metadata.player2Passed : prev.metadata.player1Passed
      
      // Mark this player as passed
      const newMetadata = {
        ...prev.metadata,
        [`${player}Passed`]: true,
      }
      
      // If other player hasn't passed, give them ACTION (but this player RETAINS initiative)
      if (!otherPlayerPassed) {
        // Action goes to opponent
        newMetadata.actionPlayer = player === 'player1' ? 'player2' : 'player1'
        // Initiative STAYS with the player who passed (they locked it in)
        // Don't change initiativePlayer - it stays with the player who passed
      }
      
      // Note: Combat will be resolved automatically in handleNextPhase when both players have passed
      // No need to change phase here
      
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
    handleToggleStun,
    handlePass,
  }
}



