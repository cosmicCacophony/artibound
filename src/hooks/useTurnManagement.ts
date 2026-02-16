import { useCallback, useEffect } from 'react'
import { TurnPhase, Card, GameMetadata, ShopItem, Hero, BaseCard, PlayerId, GameState } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { getDefaultTargets, resolveCombat, resolveSimultaneousCombat, resolveRangedAttacks } from '../game/combatSystem'
import { addRunesFromHero, canAffordCard, consumeRunesForCardWithTracking, removeRunesFromHero } from '../game/runeSystem'
import { tier1Items, createCardFromTemplate } from '../game/sampleData'
import { applyLaneNexusPostTowerDamage, checkWinCondition } from '../game/winCondition'
import { getSpellTargetOptions, maxTargetCount, requiresTargets, resolveSpellCast } from '../game/spellResolution'

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
    player1SidebarCards,
    player2SidebarCards,
    setPlayer1SidebarCards,
    setPlayer2SidebarCards,
  } = useGameContext()
  const metadata = gameState.metadata

  // Combat is now resolved automatically when both players pass, no separate combat phases

  const handleNextPhase = useCallback(() => {
    if (metadata.gameOver) {
      return
    }

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
      
      const initialTowerArmor = {
        towerA_player1: metadata.towerA_player1_Armor,
        towerA_player2: metadata.towerA_player2_Armor,
        towerB_player1: metadata.towerB_player1_Armor,
        towerB_player2: metadata.towerB_player2_Armor,
      }
      
      const resultA = resolveSimultaneousCombat(
        gameState.battlefieldA,
        'battlefieldA',
        initialTowerHP,
        metadata.stunnedHeroes || {},
        initialTowerArmor,
        gameState
      )
      
      // Use updated tower HP from A for B's combat
      const resultB = resolveSimultaneousCombat(
        gameState.battlefieldB,
        'battlefieldB',
        resultA.updatedTowerHP,
        metadata.stunnedHeroes || {},
        initialTowerArmor,
        gameState
      )
      
      // Resolve ranged attacks from base/deploy zone (after battlefield combat)
      const rangedResult = resolveRangedAttacks(
        gameState,
        resultB.updatedTowerHP,
        initialTowerArmor
      )

      const laneMomentumDelta = {
        battlefieldA: {
          player1: Math.max(0, initialTowerHP.towerA_player2 - resultA.updatedTowerHP.towerA_player2),
          player2: Math.max(0, initialTowerHP.towerA_player1 - resultA.updatedTowerHP.towerA_player1),
        },
        battlefieldB: {
          player1: Math.max(0, initialTowerHP.towerB_player2 - resultB.updatedTowerHP.towerB_player2),
          player2: Math.max(0, initialTowerHP.towerB_player1 - resultB.updatedTowerHP.towerB_player1),
        },
      }
      
      // Process killed heroes (same logic as in BattlefieldView) - separate by player
      const processKilledHeroes = (
        originalBattlefield: typeof gameState.battlefieldA,
        updatedBattlefield: typeof gameState.battlefieldA,
        player1Base: Card[],
        player2Base: Card[],
        deathCooldowns: Record<string, number>,
        player1RunePool: GameMetadata['player1RunePool'],
        player2RunePool: GameMetadata['player2RunePool']
      ) => {
        const newP1Base = [...player1Base]
        const newP2Base = [...player2Base]
        const newCooldowns = { ...deathCooldowns }
        let updatedP1RunePool = player1RunePool
        let updatedP2RunePool = player2RunePool
        const blackHeroesDied: Array<{ player: PlayerId }> = []
        
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
              updatedP1RunePool = removeRunesFromHero(hero, updatedP1RunePool)
              if (hero.colors?.includes('black')) {
                blackHeroesDied.push({ player: 'player1' })
              }
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
              updatedP2RunePool = removeRunesFromHero(hero, updatedP2RunePool)
              if (hero.colors?.includes('black')) {
                blackHeroesDied.push({ player: 'player2' })
              }
            }
          }
        })

        return { newP1Base, newP2Base, newCooldowns, updatedP1RunePool, updatedP2RunePool, blackHeroesDied }
      }
      
      const { newP1Base: newP1BaseA, newP2Base: newP2BaseA, newCooldowns: newCooldownsA, updatedP1RunePool: updatedP1RunePoolA, updatedP2RunePool: updatedP2RunePoolA, blackHeroesDied: blackHeroesDiedA } = processKilledHeroes(
        gameState.battlefieldA,
        resultA.updatedBattlefield,
        gameState.player1Base,
        gameState.player2Base,
        metadata.deathCooldowns,
        metadata.player1RunePool,
        metadata.player2RunePool
      )
      
      const { newP1Base: newP1BaseB, newP2Base: newP2BaseB, newCooldowns: newCooldownsB, updatedP1RunePool: updatedP1RunePoolB, updatedP2RunePool: updatedP2RunePoolB, blackHeroesDied: blackHeroesDiedB } = processKilledHeroes(
        gameState.battlefieldB,
        resultB.updatedBattlefield,
        newP1BaseA,
        newP2BaseA,
        newCooldownsA,
        updatedP1RunePoolA,
        updatedP2RunePoolA
      )
      
      // Add B runes for black heroes that died
      const allBlackHeroesDied = [...blackHeroesDiedA, ...blackHeroesDiedB]
      
      // Apply combat results from both battlefields
      // Calculate total overflow damage TO each player's nexus
      // overflowDamage.player1 = damage dealt BY player1 (goes TO player2's nexus)
      // overflowDamage.player2 = damage dealt BY player2 (goes TO player1's nexus)
      const totalDamageToP1Nexus = resultA.overflowDamage.player2 + resultB.overflowDamage.player2
      const totalDamageToP2Nexus = resultA.overflowDamage.player1 + resultB.overflowDamage.player1
      
      setGameState(prev => {
        const newP1NexusHP = Math.max(0, prev.metadata.player1NexusHP - totalDamageToP1Nexus)
        const newP2NexusHP = Math.max(0, prev.metadata.player2NexusHP - totalDamageToP2Nexus)
        
        // Add B runes for black heroes that died
        let updatedP1RunePool = updatedP1RunePoolB
        let updatedP2RunePool = updatedP2RunePoolB
        
        allBlackHeroesDied.forEach(({ player }) => {
          if (player === 'player1') {
            updatedP1RunePool = {
              ...updatedP1RunePool,
              runes: [...updatedP1RunePool.runes, 'black'],
            }
          } else {
            updatedP2RunePool = {
              ...updatedP2RunePool,
              runes: [...updatedP2RunePool.runes, 'black'],
            }
          }
        })
        
        const existingLaneMomentum = prev.metadata.laneMomentum || {
          battlefieldA: { player1: 0, player2: 0 },
          battlefieldB: { player1: 0, player2: 0 },
        }

        const updatedLaneMomentum = {
          battlefieldA: {
            player1: existingLaneMomentum.battlefieldA.player1 + laneMomentumDelta.battlefieldA.player1,
            player2: existingLaneMomentum.battlefieldA.player2 + laneMomentumDelta.battlefieldA.player2,
          },
          battlefieldB: {
            player1: existingLaneMomentum.battlefieldB.player1 + laneMomentumDelta.battlefieldB.player1,
            player2: existingLaneMomentum.battlefieldB.player2 + laneMomentumDelta.battlefieldB.player2,
          },
        }

        let updatedMetadata: GameMetadata = {
          ...prev.metadata,
          towerA_player1_HP: rangedResult.updatedTowerHP.towerA_player1,
          towerA_player2_HP: rangedResult.updatedTowerHP.towerA_player2,
          towerB_player1_HP: rangedResult.updatedTowerHP.towerB_player1,
          towerB_player2_HP: rangedResult.updatedTowerHP.towerB_player2,
          // Apply overflow damage to nexus (sum from both battlefields + ranged attacks)
          player1NexusHP: Math.max(0, newP1NexusHP - (rangedResult.overflowDamage.player2)),
          player2NexusHP: Math.max(0, newP2NexusHP - (rangedResult.overflowDamage.player1)),
          deathCooldowns: newCooldownsB,
          player1RunePool: updatedP1RunePool,
          player2RunePool: updatedP2RunePool,
          laneMomentum: updatedLaneMomentum,
        }

        // Track post-tower nexus damage by lane for win condition B.
        updatedMetadata = applyLaneNexusPostTowerDamage(
          updatedMetadata,
          'player1',
          'battlefieldA',
          resultA.overflowDamage.player1 + rangedResult.overflowDamageByLane.player1.battlefieldA
        )
        updatedMetadata = applyLaneNexusPostTowerDamage(
          updatedMetadata,
          'player1',
          'battlefieldB',
          resultB.overflowDamage.player1 + rangedResult.overflowDamageByLane.player1.battlefieldB
        )
        updatedMetadata = applyLaneNexusPostTowerDamage(
          updatedMetadata,
          'player2',
          'battlefieldA',
          resultA.overflowDamage.player2 + rangedResult.overflowDamageByLane.player2.battlefieldA
        )
        updatedMetadata = applyLaneNexusPostTowerDamage(
          updatedMetadata,
          'player2',
          'battlefieldB',
          resultB.overflowDamage.player2 + rangedResult.overflowDamageByLane.player2.battlefieldB
        )

        const winResult = checkWinCondition(updatedMetadata)
        if (winResult.winner) {
          console.log('[win-condition] winner', {
            winner: winResult.winner,
            reason: winResult.reason,
            p1LaneDamage: updatedMetadata.player1LaneNexusDamageAfterTower,
            p2LaneDamage: updatedMetadata.player2LaneNexusDamageAfterTower,
          })
          updatedMetadata = {
            ...updatedMetadata,
            gameOver: true,
            winner: winResult.winner,
            winReason: winResult.reason,
          }
        }

        return {
          ...prev,
          battlefieldA: resultA.updatedBattlefield,
          battlefieldB: resultB.updatedBattlefield,
          player1Base: newP1BaseB,
          player2Base: newP2BaseB,
          player1Hand: prev.player1Hand,
          player2Hand: prev.player2Hand,
          metadata: updatedMetadata,
        }
      })
      
      // Show combat summary modal (include ranged attacks in combat log)
      setCombatSummaryData({
        battlefieldA: {
          name: 'Battlefield A',
          combatLog: [...resultA.combatLog, ...rangedResult.combatLog],
          towerHP: {
            player1: rangedResult.updatedTowerHP.towerA_player1,
            player2: rangedResult.updatedTowerHP.towerA_player2,
          },
          overflowDamage: {
            player1: resultA.overflowDamage.player1 + rangedResult.overflowDamage.player1,
            player2: resultA.overflowDamage.player2 + rangedResult.overflowDamage.player2,
          },
        },
        battlefieldB: {
          name: 'Battlefield B',
          combatLog: resultB.combatLog,
          towerHP: {
            player1: rangedResult.updatedTowerHP.towerB_player1,
            player2: rangedResult.updatedTowerHP.towerB_player2,
          },
          overflowDamage: {
            player1: resultB.overflowDamage.player1,
            player2: resultB.overflowDamage.player2,
          },
        },
      })
      setShowCombatSummary(true)

      if ((gameState.metadata.gameOver ?? false) || checkWinCondition({
        ...gameState.metadata,
        towerA_player1_HP: rangedResult.updatedTowerHP.towerA_player1,
        towerA_player2_HP: rangedResult.updatedTowerHP.towerA_player2,
        towerB_player1_HP: rangedResult.updatedTowerHP.towerB_player1,
        towerB_player2_HP: rangedResult.updatedTowerHP.towerB_player2,
      }).winner) {
        return
      }
      
      // End turn - after combat, ALWAYS increment turn and go to deploy phase
      // Combat happens when both players pass, so turn should always advance
      shouldIncrementTurn = true
      nextPhase = 'deploy'
      // Player 1 always starts the new turn
      nextPlayer = 'player1'
      // Calculate next turn number
      const nextTurnNumber = normalizeTurnNumber(metadata.currentTurn) + 1
      
      // Reset pass flags at start of new turn
      const resetPassFlags = true
      
      // Decrement cooldowns and move heroes from base to deployZone when cooldown expires
      setGameState(prev => {
        const clearTemporaryModifiers = (cards: Card[]): Card[] =>
          cards.map(card => {
            if (card.cardType !== 'hero' && card.cardType !== 'generic') return card
            const { temporaryAttack, temporaryHP, ...rest } = card as any
            return { ...rest, temporaryAttack: 0, temporaryHP: 0 } as Card
          })

        const processCooldowns = (player: 'player1' | 'player2') => {
          const base = prev[`${player}Base` as keyof typeof prev] as Card[]
          const deployZone = prev[`${player}DeployZone` as keyof typeof prev] as Card[]
          const cooldowns = { ...prev.metadata.deathCooldowns }
          const updatedCooldowns: Record<string, number> = {}
          Object.entries(cooldowns).forEach(([cardId, counter]) => {
            const nextCounter = Math.max(0, counter - 1)
            if (nextCounter > 0) {
              updatedCooldowns[cardId] = nextCounter
            }
          })
          
          console.log(`[turn-debug] processCooldowns START for ${player}`, {
            baseCount: base.length,
            baseHeroes: base.filter(c => c.cardType === 'hero').map(c => c.name),
            deployZoneCount: deployZone.length,
            deployZoneHeroes: deployZone.filter(c => c.cardType === 'hero').map(c => c.name),
            cooldowns: { ...cooldowns },
          })
          
          const heroesToMove: Card[] = []
          const heroesToKeep: Card[] = []
          
          // Process heroes using updated cooldowns
          base.forEach(card => {
            if (card.cardType === 'hero') {
              const newCooldown = updatedCooldowns[card.id] || 0
              if (newCooldown === 0) {
                // Cooldown expired - move to deployZone and heal to full
                const hero = card as import('../game/types').Hero
                heroesToMove.push({ 
                  ...hero, 
                  location: 'deployZone' as const,
                  currentHealth: hero.maxHealth, // Heal to full when ready to deploy
                })
                // Ensure cooldown removed when moved to deployZone
                delete updatedCooldowns[card.id]
              } else {
                // Still on cooldown - keep in base
                heroesToKeep.push(card)
              }
            } else {
              // Non-hero cards (artifacts) stay in base
              heroesToKeep.push(card)
            }
          })
          
          console.log(`[turn-debug] processCooldowns END for ${player}`, {
            heroesToMoveCount: heroesToMove.length,
            heroesToMove: heroesToMove.map(c => c.name),
            heroesToKeepCount: heroesToKeep.length,
            newDeployZoneCount: deployZone.length + heroesToMove.length,
          })
          
          // Filter out any heroes that are already in deployZone to prevent duplicates
          const existingIds = new Set(deployZone.map(c => c.id))
          const uniqueHeroesToMove = heroesToMove.filter(h => !existingIds.has(h.id))
          
          return {
            newBase: heroesToKeep,
            newDeployZone: [...deployZone, ...uniqueHeroesToMove],
            newCooldowns: updatedCooldowns,
          }
        }
        
        const p1Result = processCooldowns('player1')
        const p2Result = processCooldowns('player2')
        
        return {
          ...prev,
          player1Base: p1Result.newBase,
          player1DeployZone: p1Result.newDeployZone,
          player2Base: p2Result.newBase,
          player2DeployZone: p2Result.newDeployZone,
          battlefieldA: {
            player1: clearTemporaryModifiers(prev.battlefieldA.player1),
            player2: clearTemporaryModifiers(prev.battlefieldA.player2),
          },
          battlefieldB: {
            player1: clearTemporaryModifiers(prev.battlefieldB.player1),
            player2: clearTemporaryModifiers(prev.battlefieldB.player2),
          },
          metadata: {
            ...prev.metadata,
            deathCooldowns: { ...p1Result.newCooldowns, ...p2Result.newCooldowns },
            player1SpellsCastThisTurn: 0,
            player2SpellsCastThisTurn: 0,
          },
        }
      })
      
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

      setGameState(prev => {
        const nextP1MaxMana = shouldIncrementTurn
          ? Math.min(prev.metadata.player1MaxMana + 1, 10)
          : prev.metadata.player1MaxMana
        const nextP2MaxMana = shouldIncrementTurn
          ? Math.min(prev.metadata.player2MaxMana + 1, 10)
          : prev.metadata.player2MaxMana

        const nextP1Mana = shouldIncrementTurn ? nextP1MaxMana : prev.metadata.player1Mana
        const nextP2Mana = shouldIncrementTurn ? nextP2MaxMana : prev.metadata.player2Mana

        const resolvedP1Mana = nextPlayer === 'player1' ? nextP1MaxMana : nextP1Mana
        const resolvedP2Mana = nextPlayer === 'player2' ? nextP2MaxMana : nextP2Mana

        const canDeployHero = (playerId: 'player1' | 'player2') => {
          const base = prev[`${playerId}Base` as keyof typeof prev] as Card[]
          const deployZone = prev[`${playerId}DeployZone` as keyof typeof prev] as Card[]
          const cooldowns = prev.metadata.deathCooldowns || {}

          const baseHeroes = base.filter(card => card.cardType === 'hero')
          const baseHeroesReady = baseHeroes.filter(card => (cooldowns[card.id] || 0) === 0)
          const deployHeroesReady = deployZone.filter(card => card.cardType === 'hero')
          
          console.log(`[turn-debug] canDeployHero ${playerId}`, {
            baseHeroCount: baseHeroes.length,
            baseHeroNames: baseHeroes.map(c => c.name),
            baseHeroesReadyCount: baseHeroesReady.length,
            baseHeroesReadyNames: baseHeroesReady.map(c => c.name),
            deployZoneHeroCount: deployHeroesReady.length,
            deployZoneHeroNames: deployHeroesReady.map(c => c.name),
            cooldowns: { ...cooldowns },
          })
          
          return baseHeroesReady.length > 0 || deployHeroesReady.length > 0
        }

        const p1CanDeploy = canDeployHero('player1')
        const p2CanDeploy = canDeployHero('player2')
        
        const shouldSkipDeploy = nextPhase === 'deploy' && !p1CanDeploy && !p2CanDeploy
        
        console.log('[turn-debug] phase decision', {
          nextPhase,
          p1CanDeploy,
          p2CanDeploy,
          shouldSkipDeploy,
          resolvedPhase: shouldSkipDeploy ? 'play' : nextPhase,
        })

        const resolvedPhase = shouldSkipDeploy ? 'play' : nextPhase

        return {
          ...prev,
          metadata: {
            ...prev.metadata,
            [`${player}Gold`]: (prev.metadata[`${player}Gold` as keyof GameMetadata] as number) + totalGoldThisTurn,
            currentTurn: nextTurnNumber,
            activePlayer: nextPlayer,
            currentPhase: resolvedPhase,
            player1MaxMana: nextP1MaxMana,
            player2MaxMana: nextP2MaxMana,
            player1Mana: resolvedP1Mana,
            player2Mana: resolvedP2Mana,
            // Reset pass flags at start of new turn
            player1Passed: false,
            player2Passed: false,
            // Reset deploy counters when entering deploy phase
            ...(resolvedPhase === 'deploy' ? {
              player1HeroesDeployedThisTurn: 0,
              player2HeroesDeployedThisTurn: 0,
            } : {}),
            // Reset turn 1 deployment phase if we're past turn 1
            ...(shouldIncrementTurn && prev.metadata.currentTurn > 1 ? { turn1DeploymentPhase: 'complete' } : {}),
          },
        }
      })
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

  useEffect(() => {
    if (metadata.currentPhase === 'play' && metadata.player1Passed && metadata.player2Passed) {
      handleNextPhase()
    }
  }, [metadata.currentPhase, metadata.player1Passed, metadata.player2Passed, handleNextPhase])

  const handleToggleSpellPlayed = useCallback((card: Card) => {
    if (metadata.gameOver) {
      return
    }
    // Allow any card type to be marked as played (spells, units, heroes)
    if (card.location !== 'base') return
    
    setGameState(prev => {
      const isCurrentlyPlayed = prev.metadata.playedSpells[card.id] || false
      const newPlayedSpells = { ...prev.metadata.playedSpells }
      
      if (isCurrentlyPlayed) {
        // Unmarking card - just remove the visual indicator
        delete newPlayedSpells[card.id]
        return {
          ...prev,
          metadata: {
            ...prev.metadata,
            playedSpells: newPlayedSpells,
          },
        }
      } else {
        // Marking card as played - pass action and initiative to opponent
        newPlayedSpells[card.id] = true
        
        // Pass action and initiative to opponent (same as hero deployment)
        const otherPlayer = prev.metadata.actionPlayer === 'player1' ? 'player2' : 'player1'
        
        return {
          ...prev,
          metadata: {
            ...prev.metadata,
            playedSpells: newPlayedSpells,
            actionPlayer: otherPlayer,
            initiativePlayer: otherPlayer,
            player1Passed: false,
            player2Passed: false,
          },
        }
      }
    })
  }, [metadata.gameOver, setGameState])

  // Spawn a 1/1 creep for generic unit token generation
  const handleSpawnCreep = useCallback((battlefieldId: 'battlefieldA' | 'battlefieldB', player: 'player1' | 'player2') => {
    if (metadata.gameOver) {
      return
    }
    setGameState(prev => {
      const battlefield = prev[battlefieldId]
      const playerUnits = battlefield[player]
      
      // Find first available slot (1-5)
      let availableSlot: number | null = null
      for (let slot = 1; slot <= 5; slot++) {
        const isOccupied = playerUnits.some(unit => unit.slot === slot)
        if (!isOccupied) {
          availableSlot = slot
          break
        }
      }
      
      // If no slots available, don't spawn
      if (availableSlot === null) {
        console.log(`No available slot for ${player} creep on ${battlefieldId}`)
        return prev
      }
      
      // Create the creep
      const creep: import('../game/types').GenericUnit = {
        id: `creep-${player}-${battlefieldId}-${Date.now()}-${Math.random()}`,
        name: 'Creep',
        description: 'Basic 1/1 unit that can have health adjusted',
        cardType: 'generic',
        colors: [],
        manaCost: 0,
        attack: 1,
        health: 1,
        maxHealth: 1,
        currentHealth: 1,
        location: battlefieldId,
        owner: player,
        slot: availableSlot,
      }
      
      return {
        ...prev,
        [battlefieldId]: {
          ...battlefield,
          [player]: [...playerUnits, creep],
        },
      }
    })
  }, [metadata.gameOver, setGameState])

  const handleToggleStun = useCallback((hero: Card) => {
    if (metadata.gameOver) {
      return
    }
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
  }, [metadata.gameOver, setGameState])

  const handleNextTurn = useCallback(() => {
    if (metadata.gameOver) {
      return
    }
    setGameState(prev => {
      const newTurn = normalizeTurnNumber(prev.metadata.currentTurn) + 1
      
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
      
      // Move heroes whose cooldown expired back to deploy zone and heal to full.
      const processReadyHeroes = (base: Card[], deployZone: Card[]) => {
        const updatedBase: Card[] = []
        const heroesToMove: Card[] = []
        const existingIds = new Set(deployZone.map(card => card.id))

        base.forEach(card => {
          if (
            card.cardType === 'hero' &&
            card.location === 'base' &&
            prev.metadata.deathCooldowns[card.id] &&
            !newDeathCooldowns[card.id]
          ) {
            const hero = card as import('../game/types').Hero
            if (!existingIds.has(hero.id)) {
              heroesToMove.push({
                ...hero,
                location: 'deployZone' as const,
                currentHealth: hero.maxHealth,
              })
            }
          } else {
            updatedBase.push(card)
          }
        })

        return {
          newBase: updatedBase,
          newDeployZone: [...deployZone, ...heroesToMove],
        }
      }
      
      // At start of new turn, action goes to whoever has initiative
      // If no one has initiative (shouldn't happen), default to player1
      const nextAction = prev.metadata.initiativePlayer || 'player1'

      const p1Ready = processReadyHeroes(prev.player1Base, prev.player1DeployZone)
      const p2Ready = processReadyHeroes(prev.player2Base, prev.player2DeployZone)
      
      // Dark Archmage spawn logic: spawn Void Apprentice in adjacent slot at start of each turn
      const spawnVoidApprentices = (battlefield: typeof prev.battlefieldA, battlefieldId: 'battlefieldA' | 'battlefieldB') => {
        const updatedBattlefield = { ...battlefield }
        
        // Check both players for Dark Archmage
        for (const player of ['player1', 'player2'] as const) {
          const darkArchmage = updatedBattlefield[player].find(
            c => c.cardType === 'hero' && c.id.startsWith('ub-hero-archmage') && c.slot !== undefined
          )
          
          if (darkArchmage && darkArchmage.slot !== undefined) {
            const archmageSlot = darkArchmage.slot
            // Find adjacent slots (slot - 1 and slot + 1, within 1-5 range)
            const adjacentSlots = [archmageSlot - 1, archmageSlot + 1].filter(s => s >= 1 && s <= 5)
            
            // Find an available adjacent slot
            for (const slot of adjacentSlots) {
              const slotOccupied = updatedBattlefield[player].some(c => c.slot === slot)
              if (!slotOccupied) {
                // Spawn Void Apprentice
                const voidApprentice: import('../game/types').GenericUnit = {
                  id: `ub-spawn-void-apprentice-${player}-${battlefieldId}-${slot}-${newTurn}`,
                  name: 'Void Apprentice',
                  description: 'Spawned by Dark Archmage. At the start of each turn, deals 2 damage to the nearest enemy unit.',
                  cardType: 'generic',
                  colors: ['blue'],
                  manaCost: 0,
                  attack: 2,
                  health: 3,
                  maxHealth: 3,
                  currentHealth: 3,
                  location: battlefieldId,
                  owner: player,
                  slot: slot,
                }
                updatedBattlefield[player] = [...updatedBattlefield[player], voidApprentice]
                break // Only spawn one per archmage per turn
              }
            }
          }
        }
        
        return updatedBattlefield
      }
      
      const updatedBattlefieldA = spawnVoidApprentices(prev.battlefieldA, 'battlefieldA')
      const updatedBattlefieldB = spawnVoidApprentices(prev.battlefieldB, 'battlefieldB')
      
      // REMOVED: Auto-spawn creep system (Core Game Redesign - Phase 1)
      // Creeps no longer spawn automatically each turn - board stays cleaner, heroes are primary threats
      // Keep Void Apprentice spawning
      const battlefieldAWithCreeps = updatedBattlefieldA // No longer spawning creeps
      const battlefieldBWithCreeps = updatedBattlefieldB // No longer spawning creeps
      
      // No saga artifacts - keep battlefields/base as-is
      const finalBattlefieldA = battlefieldAWithCreeps
      const finalBattlefieldB = battlefieldBWithCreeps
      const finalP1Base = p1Ready.newBase
      const finalP2Base = p2Ready.newBase
      const finalP1DeployZone = p1Ready.newDeployZone
      const finalP2DeployZone = p2Ready.newDeployZone
      
      // Rune system updates:
      // 1. Clear temporary runes from previous turn
      // 2. Generate new temporary runes from seals
      // 3. Generate runes from artifacts in base with rune_generation effect
      // 4. Generate temporary mana from rune generator artifacts
      const clearAndGenerateRunes = (
        pool: import('../game/types').RunePool, 
        seals: import('../game/types').Seal[],
        playerBase: import('../game/types').Card[]
      ): { updatedPool: import('../game/types').RunePool; tempMana: number } => {
        // Generate runes from seals
        const sealRunes = seals.map(seal => seal.color)
        
        // Generate runes from artifacts in base with rune_generation effect
        const artifactRunes: import('../game/types').RuneColor[] = []
        let tempMana = 0
        const artifacts = playerBase.filter(card => card.cardType === 'artifact') as import('../game/types').ArtifactCard[]
        
        artifacts.forEach(artifact => {
          if (artifact.effectType === 'rune_generation') {
            // Determine which color(s) to generate based on artifact colors
            // Single-color artifacts: effectValue=1, colors=['black'] -> generates 1 black rune
            // Dual-color artifacts: effectValue=2, colors=['red','white'] -> generates 1 red + 1 white rune
            if (artifact.colors && artifact.colors.length > 0) {
              const effectValue = artifact.effectValue || 1
              
              if (artifact.colors.length === 1) {
                // Single color generator - generate effectValue runes of that color
                for (let i = 0; i < effectValue; i++) {
                  artifactRunes.push(artifact.colors[0] as import('../game/types').RuneColor)
                }
              } else if (artifact.colors.length === 2 && effectValue === 2) {
                // Dual color generator - generate 1 of each color
                artifactRunes.push(artifact.colors[0] as import('../game/types').RuneColor)
                artifactRunes.push(artifact.colors[1] as import('../game/types').RuneColor)
              } else if (artifact.colors.length === 2 && effectValue === 1) {
                // Flexible generator - player chooses, default to first color (could be improved with UI)
                artifactRunes.push(artifact.colors[0] as import('../game/types').RuneColor)
              }
            }
            
            // Add temporary mana from generator
            if (artifact.tempManaGeneration && artifact.tempManaGeneration > 0) {
              tempMana += artifact.tempManaGeneration
            }
          }
        })
        
        return {
          updatedPool: {
            runes: pool.runes, // Permanent runes persist
            temporaryRunes: [...sealRunes, ...artifactRunes], // Seal and artifact runes replace previous temporary runes
          },
          tempMana,
        }
      }
      
      const p1RuneResult = clearAndGenerateRunes(
        prev.metadata.player1RunePool,
        prev.metadata.player1Seals || [],
        finalP1Base
      )
      const p2RuneResult = clearAndGenerateRunes(
        prev.metadata.player2RunePool,
        prev.metadata.player2Seals || [],
        finalP2Base
      )
      
      // Temporary stats are now persistent - they don't reset automatically
      // Players can manually remove them if needed
      
      return {
        ...prev,
        battlefieldA: finalBattlefieldA,
        battlefieldB: finalBattlefieldB,
        player1Hand: prev.player1Hand,
        player2Hand: prev.player2Hand,
        player1Base: finalP1Base,
        player1DeployZone: finalP1DeployZone,
        player2Base: finalP2Base,
        player2DeployZone: finalP2DeployZone,
        metadata: {
          ...prev.metadata,
          currentTurn: newTurn,
          // Start new turn in deploy phase
          currentPhase: 'deploy',
          // Restore mana to max for both players + temporary mana from generators
          player1Mana: newPlayer1MaxMana + p1RuneResult.tempMana,
          player2Mana: newPlayer2MaxMana + p2RuneResult.tempMana,
          player1MaxMana: newPlayer1MaxMana,
          player2MaxMana: newPlayer2MaxMana,
          // Both players get 5 gold at the start of each turn
          player1Gold: (prev.metadata.player1Gold as number) + 5,
          player2Gold: (prev.metadata.player2Gold as number) + 5,
          // Action goes to whoever has initiative
          actionPlayer: nextAction,
          // Initiative carries over (unless it was null, then default to player1)
          initiativePlayer: prev.metadata.initiativePlayer || 'player1',
          // Update death cooldowns
          deathCooldowns: newDeathCooldowns,
          // Reset movement flags
          player1MovedToBase: false,
          player2MovedToBase: false,
          // Reset deploy phase hero counters
          player1HeroesDeployedThisTurn: 0,
          player2HeroesDeployedThisTurn: 0,
          // Update rune pools (clear temp, generate from seals)
          player1RunePool: p1RuneResult.updatedPool,
          player2RunePool: p2RuneResult.updatedPool
        },
      }
    })
  }, [metadata.gameOver, setGameState])

  const handlePass = useCallback((player: 'player1' | 'player2') => {
    if (metadata.gameOver) {
      return
    }
    setGameState(prev => {
      // Handle turn 1 deployment passing (counter-deployment phases)
      if (prev.metadata.currentTurn === 1 && prev.metadata.turn1DeploymentPhase && 
          prev.metadata.turn1DeploymentPhase !== 'complete') {
        const phase = prev.metadata.turn1DeploymentPhase
        const passResult = getTurn1PhaseAfterPass(phase, player)
        if (!passResult) {
          return prev
        }

        const nextMetadata = {
          ...prev.metadata,
          turn1DeploymentPhase: passResult.nextPhase,
          activePlayer: passResult.nextActivePlayer,
        }

        if (passResult.nextPhase === 'complete') {
          nextMetadata.actionPlayer = 'player1'
          nextMetadata.initiativePlayer = 'player1'
          nextMetadata.activePlayer = 'player1'
        }

        return {
          ...prev,
          metadata: nextMetadata,
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
        newMetadata.activePlayer = newMetadata.actionPlayer
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
  }, [metadata.gameOver, setGameState])

  const handleEndDeployPhase = useCallback(() => {
    if (metadata.gameOver) {
      return
    }
    setGameState(prev => {
      if (prev.metadata.currentPhase !== 'deploy') {
        return prev
      }

      const turn = normalizeTurnNumber(prev.metadata.currentTurn)
      const p1HasDeployHeroes = hasDeployableHero(
        prev.player1Base,
        prev.player1DeployZone,
        prev.metadata.deathCooldowns || {}
      )
      const p2HasDeployHeroes = hasDeployableHero(
        prev.player2Base,
        prev.player2DeployZone,
        prev.metadata.deathCooldowns || {}
      )

      const canEndDeploy = shouldEndDeployPhase({
        turn,
        p1HeroesDeployed: prev.metadata.player1HeroesDeployedThisTurn || 0,
        p2HeroesDeployed: prev.metadata.player2HeroesDeployedThisTurn || 0,
        p1HasDeployHeroes,
        p2HasDeployHeroes,
      })

      if (turn === 2 && !canEndDeploy) {
        alert('Turn 2 deploy: both players must deploy 1 hero before starting the turn.')
        return prev
      }

      if (turn >= 3 && !canEndDeploy) {
        alert('Deploy phase continues until both deploy zones are empty.')
        return prev
      }
      
      const nextActionPlayer = prev.metadata.actionPlayer ?? prev.metadata.initiativePlayer ?? 'player1'

      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          currentPhase: 'play',
          actionPlayer: nextActionPlayer,
          activePlayer: nextActionPlayer,
        },
      }
    })
  }, [metadata.gameOver, setGameState])

  // Minimal boss automation for RW slice opponent.
  useEffect(() => {
    if (metadata.gameOver) return
    if (metadata.currentPhase !== 'play') return
    if (metadata.actionPlayer !== 'player2') return

    const timer = setTimeout(() => {
      setGameState(prev => {
        if (prev.metadata.gameOver) return prev
        if (prev.metadata.actionPlayer !== 'player2' || prev.metadata.currentPhase !== 'play') return prev

        const hand = prev.player2Hand
        const runePool = prev.metadata.player2RunePool
        const mana = prev.metadata.player2Mana

        const playable = hand.find(card => {
          const manaOk = !card.manaCost || card.manaCost <= mana
          return manaOk && canAffordCard(card as BaseCard, mana, runePool)
        })

        if (!playable) {
          return {
            ...prev,
            metadata: {
              ...prev.metadata,
              player2Passed: true,
              actionPlayer: 'player1',
            },
          }
        }

        const runeResult = consumeRunesForCardWithTracking(playable as BaseCard, runePool)
        const spentMana = playable.manaCost || 0
        const nextMeta: GameMetadata = {
          ...prev.metadata,
          player2RunePool: runeResult.newPool,
          player2Mana: Math.max(0, prev.metadata.player2Mana - spentMana),
          actionPlayer: 'player1',
          initiativePlayer: 'player1',
          player1Passed: false,
          player2Passed: false,
        }

        const removeFromHand = prev.player2Hand.filter(card => card.id !== playable.id)
        const openSlotA = [1, 2, 3, 4, 5].find(slot => !prev.battlefieldA.player2.some(card => card.slot === slot))
        const openSlotB = [1, 2, 3, 4, 5].find(slot => !prev.battlefieldB.player2.some(card => card.slot === slot))
        const lane: 'battlefieldA' | 'battlefieldB' = openSlotA ? 'battlefieldA' : 'battlefieldB'
        const slot = (openSlotA || openSlotB || 1) as number

        if (playable.cardType === 'hero') {
          const withRunes = addRunesFromHero(playable as Hero, nextMeta.player2RunePool)
          return {
            ...prev,
            player2Hand: removeFromHand,
            [lane]: {
              ...prev[lane],
              player2: [...prev[lane].player2, { ...playable, location: lane, slot }],
            },
            metadata: {
              ...nextMeta,
              player2RunePool: withRunes,
            },
          }
        }

        if (playable.cardType === 'artifact') {
          return {
            ...prev,
            player2Hand: removeFromHand,
            player2Base: [...prev.player2Base, { ...playable, location: 'base' }],
            metadata: nextMeta,
          }
        }

        if (playable.cardType === 'spell') {
          const spell = { ...playable, owner: 'player2', location: 'hand' } as any
          const targetIds = requiresTargets(spell)
            ? getSpellTargetOptions(prev, spell, 'player2', lane)
                .slice(0, maxTargetCount(spell))
                .map(option => option.id)
            : []
          const afterRemove = {
            ...prev,
            player2Hand: removeFromHand,
            metadata: nextMeta,
          } as GameState
          const afterSpell = resolveSpellCast(afterRemove, spell, 'player2', lane, targetIds)
          return afterSpell
        }

        return {
          ...prev,
          player2Hand: removeFromHand,
          [lane]: {
            ...prev[lane],
            player2: [...prev[lane].player2, { ...playable, location: lane, slot }],
          },
          metadata: nextMeta,
        }
      })
    }, 350)

    return () => clearTimeout(timer)
  }, [metadata.actionPlayer, metadata.currentPhase, metadata.gameOver, setGameState])

  useEffect(() => {
    if (metadata.currentPhase === 'play' && metadata.player1Passed && metadata.player2Passed) {
      handleNextPhase()
    }
  }, [metadata.currentPhase, metadata.player1Passed, metadata.player2Passed, handleNextPhase])

  return {
    handleNextPhase,
    handleNextTurn,
    handleToggleSpellPlayed,
    handleToggleStun,
    handlePass,
    handleEndDeployPhase,
    handleSpawnCreep, // Re-added for token generation mechanics
  }
}



