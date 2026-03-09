import { useCallback } from 'react'
import { TurnPhase, Card, GameMetadata, Hero, BaseCard, PlayerId } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { getDefaultTargets, resolveCombat, resolveSimultaneousCombat, resolveRangedAttacks } from '../game/combatSystem'
import { removeRunesFromHero } from '../game/runeSystem'
import { createCardFromTemplate } from '../game/sampleData'
import { getNextPhase } from '../game/turnStateMachine'

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
      
      const allBlackHeroesDied = [...blackHeroesDiedA, ...blackHeroesDiedB]
      
      const totalDamageToP1Nexus = resultA.overflowDamage.player2 + resultB.overflowDamage.player2
      const totalDamageToP2Nexus = resultA.overflowDamage.player1 + resultB.overflowDamage.player1

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
      
      // SINGLE atomic setGameState: combat results + cooldowns + card draw + new turn
      setGameState(prev => {
        const newP1NexusHP = Math.max(0, prev.metadata.player1NexusHP - totalDamageToP1Nexus)
        const newP2NexusHP = Math.max(0, prev.metadata.player2NexusHP - totalDamageToP2Nexus)
        
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
          metadata: {
            ...prev.metadata,
            towerA_player1_HP: rangedResult.updatedTowerHP.towerA_player1,
            towerA_player2_HP: rangedResult.updatedTowerHP.towerA_player2,
            towerB_player1_HP: rangedResult.updatedTowerHP.towerB_player1,
            towerB_player2_HP: rangedResult.updatedTowerHP.towerB_player2,
            player1NexusHP: Math.max(0, newP1NexusHP - (rangedResult.overflowDamage.player2)),
            player2NexusHP: Math.max(0, newP2NexusHP - (rangedResult.overflowDamage.player1)),
            deathCooldowns: { ...p1CooldownResult.newCooldowns, ...p2CooldownResult.newCooldowns },
            player1RunePool: updatedP1RunePool,
            player2RunePool: updatedP2RunePool,
            laneMomentum: updatedLaneMomentum,
            currentTurn: prev.metadata.currentTurn + 1,
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
          },
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
  }, [metadata, gameState, combatTargetsA, combatTargetsB, setGameState, setCombatTargetsA, setCombatTargetsB, player1SidebarCards, player2SidebarCards, setPlayer1SidebarCards, setPlayer2SidebarCards, setShowCombatSummary, setCombatSummaryData])

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
      const finalP1Base = prev.player1Base
      const finalP2Base = prev.player2Base
      
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
        prev.player1Base
      )
      const p2RuneResult = clearAndGenerateRunes(
        prev.metadata.player2RunePool,
        prev.metadata.player2Seals || [],
        prev.player2Base
      )
      
      // Temporary stats are now persistent - they don't reset automatically
      // Players can manually remove them if needed
      
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
          player2RunePool: p2RuneResult.updatedPool,
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



