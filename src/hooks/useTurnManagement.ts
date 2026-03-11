import { useCallback } from 'react'
import { TurnPhase, Card, GameMetadata, Hero, RuneColor } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { resolveSimultaneousCombat } from '../game/combatSystem'
import { createCardFromTemplate } from '../game/sampleData'
import { getNextPhase } from '../game/turnStateMachine'
import { checkWinCondition, computeTowerDamageDealt } from '../game/winCondition'
import { HeroDeathInfo } from '../components/CombatSummaryModal'

export function useTurnManagement() {
  const { 
    gameState, 
    setGameState, 
    setShowCombatSummary,
    setCombatSummaryData,
    player1SidebarCards,
    player2SidebarCards,
    setPlayer1SidebarCards,
    setPlayer2SidebarCards,
  } = useGameContext()
  const metadata = gameState.metadata

  const handleNextPhase = useCallback(() => {
    const currentPhase = metadata.currentPhase
    
    // Resolve combat simultaneously on both battlefields when both players pass
    if (currentPhase === 'play' && metadata.player1Passed && metadata.player2Passed) {
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
      
      const resultB = resolveSimultaneousCombat(
        gameState.battlefieldB,
        'battlefieldB',
        resultA.updatedTowerHP,
        metadata.stunnedHeroes || {},
        initialTowerArmor,
        gameState
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
      
      const processKilledHeroes = (
        originalBattlefield: typeof gameState.battlefieldA,
        updatedBattlefield: typeof gameState.battlefieldA,
        player1Base: Card[],
        player2Base: Card[],
        deathCooldowns: Record<string, number>,
        _battlefieldId: 'battlefieldA' | 'battlefieldB',
        laneRunes: { player1: RuneColor[], player2: RuneColor[] },
      ) => {
        const newP1Base = [...player1Base]
        const newP2Base = [...player2Base]
        const newCooldowns = { ...deathCooldowns }
        const heroDeaths: HeroDeathInfo[] = []
        const updatedLaneRunes = {
          player1: [...laneRunes.player1],
          player2: [...laneRunes.player2],
        }
        
        const processPlayer = (player: 'player1' | 'player2', baseArr: Card[]) => {
          originalBattlefield[player].forEach(originalCard => {
            if (originalCard.cardType === 'hero') {
              const stillAlive = updatedBattlefield[player].some(c => c.id === originalCard.id)
              if (!stillAlive) {
                const hero = originalCard as Hero
                baseArr.push({
                  ...hero,
                  location: 'base' as const,
                  currentHealth: 0,
                })
                newCooldowns[hero.id] = 2

                // Remove one rune of each of the hero's colors from the lane
                const runesLost: RuneColor[] = []
                if (hero.colors) {
                  for (const color of hero.colors) {
                    const idx = updatedLaneRunes[player].indexOf(color as RuneColor)
                    if (idx !== -1) {
                      updatedLaneRunes[player].splice(idx, 1)
                      runesLost.push(color as RuneColor)
                    }
                  }
                }

                heroDeaths.push({
                  heroName: hero.name,
                  heroId: hero.id,
                  owner: player,
                  runesLost,
                })
              }
            }
          })
        }

        processPlayer('player1', newP1Base)
        processPlayer('player2', newP2Base)

        return { newP1Base, newP2Base, newCooldowns, heroDeaths, updatedLaneRunes }
      }
      
      const currentLaneRunes = metadata.laneRunes || {
        battlefieldA: { player1: [], player2: [] },
        battlefieldB: { player1: [], player2: [] },
      }

      const resultAHeroes = processKilledHeroes(
        gameState.battlefieldA,
        resultA.updatedBattlefield,
        gameState.player1Base,
        gameState.player2Base,
        metadata.deathCooldowns,
        'battlefieldA',
        currentLaneRunes.battlefieldA,
      )
      
      const resultBHeroes = processKilledHeroes(
        gameState.battlefieldB,
        resultB.updatedBattlefield,
        resultAHeroes.newP1Base,
        resultAHeroes.newP2Base,
        resultAHeroes.newCooldowns,
        'battlefieldB',
        currentLaneRunes.battlefieldB,
      )

      const newP1BaseB = resultBHeroes.newP1Base
      const newP2BaseB = resultBHeroes.newP2Base
      const newCooldownsB = resultBHeroes.newCooldowns

      const updatedLaneRunesAfterDeaths = {
        battlefieldA: resultAHeroes.updatedLaneRunes,
        battlefieldB: resultBHeroes.updatedLaneRunes,
      }
      
      const totalDamageToP1Nexus = resultA.overflowDamage.player2 + resultB.overflowDamage.player2
      const totalDamageToP2Nexus = resultA.overflowDamage.player1 + resultB.overflowDamage.player1

      // Track cumulative tower damage dealt
      const towerDmgThisRound = computeTowerDamageDealt(initialTowerHP, resultB.updatedTowerHP)

      // Draw 2 cards for each player (turn 2+ only; turn 1 uses starting hands)
      const shouldDraw = metadata.currentTurn >= 1
      const p1TemplatesToDraw = shouldDraw ? player1SidebarCards.slice(0, 2) : []
      const p2TemplatesToDraw = shouldDraw ? player2SidebarCards.slice(0, 2) : []
      const p1CardsToDraw = p1TemplatesToDraw.map(template => createCardFromTemplate(template, 'player1', 'hand'))
      const p2CardsToDraw = p2TemplatesToDraw.map(template => createCardFromTemplate(template, 'player2', 'hand'))

      if (p1TemplatesToDraw.length > 0) setPlayer1SidebarCards(player1SidebarCards.slice(p1TemplatesToDraw.length))
      if (p2TemplatesToDraw.length > 0) setPlayer2SidebarCards(player2SidebarCards.slice(p2TemplatesToDraw.length))

      // Show combat summary modal
      setCombatSummaryData({
        battlefieldA: {
          name: 'Battlefield A',
          combatLog: resultA.combatLog,
          towerHP: {
            player1: resultB.updatedTowerHP.towerA_player1,
            player2: resultB.updatedTowerHP.towerA_player2,
          },
          overflowDamage: {
            player1: resultA.overflowDamage.player1,
            player2: resultA.overflowDamage.player2,
          },
          heroDeaths: resultAHeroes.heroDeaths,
        },
        battlefieldB: {
          name: 'Battlefield B',
          combatLog: resultB.combatLog,
          towerHP: {
            player1: resultB.updatedTowerHP.towerB_player1,
            player2: resultB.updatedTowerHP.towerB_player2,
          },
          overflowDamage: {
            player1: resultB.overflowDamage.player1,
            player2: resultB.overflowDamage.player2,
          },
          heroDeaths: resultBHeroes.heroDeaths,
        },
      })
      setShowCombatSummary(true)
      
      // SINGLE atomic setGameState: combat results + cooldowns + card draw + new turn
      setGameState(prev => {
        const newP1NexusHP = Math.max(0, prev.metadata.player1NexusHP - totalDamageToP1Nexus)
        const newP2NexusHP = Math.max(0, prev.metadata.player2NexusHP - totalDamageToP2Nexus)
        
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

        // Process cooldowns
        const processCooldowns = (playerKey: 'player1' | 'player2', baseCards: Card[]) => {
          const deployZone = prev[`${playerKey}DeployZone` as keyof typeof prev] as Card[]
          const cooldowns = { ...newCooldownsB }
          
          const heroesToMove: Card[] = []
          const heroesToKeep: Card[] = []
          
          baseCards.forEach(card => {
            if (card.cardType === 'hero') {
              const currentCooldown = cooldowns[card.id] || 0
              if (currentCooldown > 0) {
                cooldowns[card.id] = currentCooldown - 1
              }
              
              const newCooldown = cooldowns[card.id] || 0
              if (newCooldown === 0) {
                const hero = card as import('../game/types').Hero
                heroesToMove.push({ 
                  ...hero, 
                  location: 'deployZone' as const,
                  currentHealth: hero.maxHealth,
                })
                delete cooldowns[card.id]
              } else {
                heroesToKeep.push(card)
              }
            } else {
              heroesToKeep.push(card)
            }
          })
          
          return {
            newBase: heroesToKeep,
            newDeployZone: [...deployZone, ...heroesToMove],
            newCooldowns: cooldowns,
          }
        }
        
        const p1CooldownResult = processCooldowns('player1', newP1BaseB)
        const p2CooldownResult = processCooldowns('player2', newP2BaseB)

        const initiativePlayer = prev.metadata.initiativePlayer || 'player1'
        const p1MaxMana = prev.metadata.player1MaxMana
        const p2MaxMana = prev.metadata.player2MaxMana
        const nextPhase = getNextPhase('play', 'COMBAT_RESOLVED', !!prev.metadata.isRunePrototype)

        const prevTotalDmg = prev.metadata.totalTowerDamageDealt || { player1: 0, player2: 0 }
        const newTotalTowerDmg = {
          player1: prevTotalDmg.player1 + towerDmgThisRound.player1,
          player2: prevTotalDmg.player2 + towerDmgThisRound.player2,
        }

        const newTurn = prev.metadata.currentTurn + 1
        const postCombatMetadata: GameMetadata = {
          ...prev.metadata,
          towerA_player1_HP: resultB.updatedTowerHP.towerA_player1,
          towerA_player2_HP: resultB.updatedTowerHP.towerA_player2,
          towerB_player1_HP: resultB.updatedTowerHP.towerB_player1,
          towerB_player2_HP: resultB.updatedTowerHP.towerB_player2,
          player1NexusHP: newP1NexusHP,
          player2NexusHP: newP2NexusHP,
          deathCooldowns: { ...p1CooldownResult.newCooldowns, ...p2CooldownResult.newCooldowns },
          laneMomentum: updatedLaneMomentum,
          laneRunes: updatedLaneRunesAfterDeaths,
          currentTurn: newTurn,
          currentPhase: nextPhase,
          activePlayer: initiativePlayer,
          actionPlayer: initiativePlayer,
          player1Mana: p1MaxMana,
          player2Mana: p2MaxMana,
          player1Passed: false,
          player2Passed: false,
          turn1DeploymentPhase: 'complete',
          resourceChoicesMade: { player1: false, player2: false },
          player1HeroesDeployedThisTurn: 0,
          player2HeroesDeployedThisTurn: 0,
          totalTowerDamageDealt: newTotalTowerDmg,
        }

        const winResult = checkWinCondition(postCombatMetadata)
        if (winResult.gameOver) {
          postCombatMetadata.gameOver = true
          postCombatMetadata.winner = winResult.winner
          postCombatMetadata.winReason = winResult.winReason
        }

        return {
          ...prev,
          battlefieldA: resultA.updatedBattlefield,
          battlefieldB: resultB.updatedBattlefield,
          player1Base: p1CooldownResult.newBase,
          player1DeployZone: p1CooldownResult.newDeployZone,
          player2Base: p2CooldownResult.newBase,
          player2DeployZone: p2CooldownResult.newDeployZone,
          player1Hand: [...(prev.player1Hand || []), ...p1CardsToDraw],
          player2Hand: [...(prev.player2Hand || []), ...p2CardsToDraw],
          metadata: postCombatMetadata,
        }
      })
      return
    }
    
    // Fallback: advance to play phase
    setGameState(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        currentPhase: 'play' as TurnPhase,
      },
    }))
  }, [metadata, gameState, setGameState, player1SidebarCards, player2SidebarCards, setPlayer1SidebarCards, setPlayer2SidebarCards, setShowCombatSummary, setCombatSummaryData])

  const handleToggleSpellPlayed = useCallback((card: Card) => {
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
  }, [setGameState])

  // Spawn a 1/1 creep for generic unit token generation
  const handleSpawnCreep = useCallback((battlefieldId: 'battlefieldA' | 'battlefieldB', player: 'player1' | 'player2') => {
    setGameState(prev => {
      const battlefield = prev[battlefieldId]
      const playerUnits = battlefield[player]
      
      if (playerUnits.length >= 5) {
        return prev
      }
      
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
      }
      
      return {
        ...prev,
        [battlefieldId]: {
          ...battlefield,
          [player]: [...playerUnits, creep],
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
    const p1TemplatesToDraw = player1SidebarCards.slice(0, 2)
    const p2TemplatesToDraw = player2SidebarCards.slice(0, 2)
    const p1CardsToDraw = p1TemplatesToDraw.map(template => createCardFromTemplate(template, 'player1', 'hand'))
    const p2CardsToDraw = p2TemplatesToDraw.map(template => createCardFromTemplate(template, 'player2', 'hand'))

    setPlayer1SidebarCards(player1SidebarCards.slice(p1TemplatesToDraw.length))
    setPlayer2SidebarCards(player2SidebarCards.slice(p2TemplatesToDraw.length))

    setGameState(prev => {
      const newTurn = prev.metadata.currentTurn + 1
      
      // Increase max mana: in rune prototype, mana only grows via resource choices
      const newPlayer1MaxMana = prev.metadata.isRunePrototype
        ? prev.metadata.player1MaxMana
        : Math.min(prev.metadata.player1MaxMana + 1, 10)
      const newPlayer2MaxMana = prev.metadata.isRunePrototype
        ? prev.metadata.player2MaxMana
        : Math.min(prev.metadata.player2MaxMana + 1, 10)
      
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
      
      // Dark Archmage spawn logic: spawn Void Apprentice in same lane at start of each turn
      const spawnVoidApprentices = (battlefield: typeof prev.battlefieldA, battlefieldId: 'battlefieldA' | 'battlefieldB') => {
        const updatedBattlefield = { ...battlefield }
        
        for (const player of ['player1', 'player2'] as const) {
          const hasDarkArchmage = updatedBattlefield[player].some(
            c => c.cardType === 'hero' && c.id.startsWith('ub-hero-archmage')
          )
          
          if (hasDarkArchmage && updatedBattlefield[player].length < 5) {
            const voidApprentice: import('../game/types').GenericUnit = {
              id: `ub-spawn-void-apprentice-${player}-${battlefieldId}-${newTurn}`,
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
            }
            updatedBattlefield[player] = [...updatedBattlefield[player], voidApprentice]
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
      const finalP1Base = prev.player1Base
      const finalP2Base = prev.player2Base
      
      // Calculate temporary mana from rune generator artifacts
      const getTempManaFromArtifacts = (playerBase: import('../game/types').Card[]): number => {
        let tempMana = 0
        const artifacts = playerBase.filter(card => card.cardType === 'artifact') as import('../game/types').ArtifactCard[]
        artifacts.forEach(artifact => {
          if (artifact.effectType === 'rune_generation' && artifact.tempManaGeneration && artifact.tempManaGeneration > 0) {
            tempMana += artifact.tempManaGeneration
          }
        })
        return tempMana
      }
      
      const p1TempMana = getTempManaFromArtifacts(prev.player1Base)
      const p2TempMana = getTempManaFromArtifacts(prev.player2Base)
      
      return {
        ...prev,
        battlefieldA: finalBattlefieldA,
        battlefieldB: finalBattlefieldB,
        player1Hand: [...prev.player1Hand, ...p1CardsToDraw],
        player2Hand: [...prev.player2Hand, ...p2CardsToDraw],
        player1Base: finalP1Base.map(c => healHeroInBase(c)),
        player2Base: finalP2Base.map(c => healHeroInBase(c)),
        metadata: {
          ...prev.metadata,
          currentTurn: newTurn,
          // Start new turn in deploy phase
          currentPhase: 'deploy',
          // Restore mana to max for both players + temporary mana from generators
          player1Mana: newPlayer1MaxMana + p1TempMana,
          player2Mana: newPlayer2MaxMana + p2TempMana,
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
          // Reset resource choices for rune prototype
          ...(prev.metadata.isRunePrototype ? { resourceChoicesMade: { player1: false, player2: false } } : {}),
        },
      }
    })
  }, [setGameState, player1SidebarCards, player2SidebarCards, setPlayer1SidebarCards, setPlayer2SidebarCards])

  const handlePass = useCallback((player: 'player1' | 'player2') => {
    setGameState(prev => {
      // Handle turn 1 deployment passing (counter-deployment phases)
      if (prev.metadata.currentTurn === 1 && prev.metadata.turn1DeploymentPhase && 
          prev.metadata.turn1DeploymentPhase !== 'complete') {
        const phase = prev.metadata.turn1DeploymentPhase
        
        if (phase === 'p2_lane1' && player === 'player2') {
          return {
            ...prev,
            metadata: {
              ...prev.metadata,
              turn1DeploymentPhase: 'p2_lane2',
            },
          }
        } else if (phase === 'p1_lane2' && player === 'player1') {
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
          return prev
        }
      }
      
      const otherPlayerPassed = player === 'player1' ? prev.metadata.player2Passed : prev.metadata.player1Passed
      
      const newMetadata = {
        ...prev.metadata,
        [`${player}Passed`]: true,
      }
      
      if (!otherPlayerPassed) {
        newMetadata.actionPlayer = player === 'player1' ? 'player2' : 'player1'
      }
      
      return {
        ...prev,
        metadata: newMetadata,
      }
    })
  }, [setGameState])

  const handleEndDeployPhase = useCallback(() => {
    setGameState(prev => {
      if (prev.metadata.currentPhase !== 'deploy') {
        return prev
      }
      
      const nextPhase = getNextPhase('deploy', 'END_DEPLOY', !!prev.metadata.isRunePrototype)
      
      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          currentPhase: nextPhase,
        },
      }
    })
  }, [setGameState])

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



