import { useCallback, useEffect } from 'react'
import { TurnPhase, Card, GameMetadata, ShopItem, Hero, BaseCard } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { getDefaultTargets, resolveCombat, resolveSimultaneousCombat, resolveRangedAttacks } from '../game/combatSystem'
import { tier1Items, createCardFromTemplate } from '../game/sampleData'

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
      
      // Process killed heroes (same logic as in BattlefieldView) - separate by player
      const processKilledHeroes = (
        originalBattlefield: typeof gameState.battlefieldA,
        updatedBattlefield: typeof gameState.battlefieldA,
        player1Base: Card[],
        player2Base: Card[],
        deathCooldowns: Record<string, number>
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
            }
          }
        })
        
        return { newP1Base, newP2Base, newCooldowns }
      }
      
      const { newP1Base: newP1BaseA, newP2Base: newP2BaseA, newCooldowns: newCooldownsA, blackHeroesDied: blackHeroesDiedA } = processKilledHeroes(
        gameState.battlefieldA,
        resultA.updatedBattlefield,
        gameState.player1Base,
        gameState.player2Base,
        metadata.deathCooldowns
      )
      
      const { newP1Base: newP1BaseB, newP2Base: newP2BaseB, newCooldowns: newCooldownsB, blackHeroesDied: blackHeroesDiedB } = processKilledHeroes(
        gameState.battlefieldB,
        resultB.updatedBattlefield,
        newP1BaseA,
        newP2BaseA,
        newCooldownsA
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
        let updatedP1RunePool = prev.metadata.player1RunePool
        let updatedP2RunePool = prev.metadata.player2RunePool
        
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
        
        return {
          ...prev,
          battlefieldA: resultA.updatedBattlefield,
          battlefieldB: resultB.updatedBattlefield,
          player1Base: newP1BaseB,
          player2Base: newP2BaseB,
          // Add drawn cards to hands
          player1Hand: [...(prev.player1Hand || []), ...allCardsToDraw.player1],
          player2Hand: [...(prev.player2Hand || []), ...allCardsToDraw.player2],
          metadata: {
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
          },
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
      
      // End turn - switch player and reset to play phase
      nextPlayer = player === 'player1' ? 'player2' : 'player1'
      nextPhase = 'play'
      shouldIncrementTurn = nextPlayer === 'player1'
      
      // Reset pass flags at start of new turn
      const resetPassFlags = true
      
      // Decrement cooldowns and move heroes from base to deployZone when cooldown expires
      setGameState(prev => {
        const processCooldowns = (player: 'player1' | 'player2') => {
          const base = prev[`${player}Base` as keyof typeof prev] as Card[]
          const deployZone = prev[`${player}DeployZone` as keyof typeof prev] as Card[]
          const cooldowns = { ...prev.metadata.deathCooldowns }
          
          const heroesToMove: Card[] = []
          const heroesToKeep: Card[] = []
          
          // Decrement all cooldowns and process heroes
          base.forEach(card => {
            if (card.cardType === 'hero') {
              const currentCooldown = cooldowns[card.id] || 0
              if (currentCooldown > 0) {
                // Decrement cooldown
                cooldowns[card.id] = currentCooldown - 1
              }
              
              const newCooldown = cooldowns[card.id] || 0
              if (newCooldown === 0) {
                // Cooldown expired - move to deployZone and heal to full
                const hero = card as import('../game/types').Hero
                heroesToMove.push({ 
                  ...hero, 
                  location: 'deployZone' as const,
                  currentHealth: hero.maxHealth, // Heal to full when ready to deploy
                })
                // Remove from cooldowns when moved to deployZone
                delete cooldowns[card.id]
              } else {
                // Still on cooldown - keep in base
                heroesToKeep.push(card)
              }
            } else {
              // Non-hero cards (artifacts) stay in base
              heroesToKeep.push(card)
            }
          })
          
          return {
            newBase: heroesToKeep,
            newDeployZone: [...deployZone, ...heroesToMove],
            newCooldowns: cooldowns,
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
          metadata: {
            ...prev.metadata,
            deathCooldowns: { ...p1Result.newCooldowns, ...p2Result.newCooldowns },
          },
        }
      })
      
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
      
      // Process saga artifacts: increment counters, create tokens, apply effects, destroy after Chapter 3
      const processSagaArtifacts = (
        playerBase: import('../game/types').Card[],
        player: 'player1' | 'player2',
        battlefields: { battlefieldA: typeof prev.battlefieldA, battlefieldB: typeof prev.battlefieldB }
      ): {
        updatedBase: import('../game/types').Card[]
        updatedBattlefields: { battlefieldA: typeof prev.battlefieldA, battlefieldB: typeof prev.battlefieldB }
      } => {
        let updatedBase = [...playerBase]
        let updatedBattlefieldA = { ...battlefields.battlefieldA }
        let updatedBattlefieldB = { ...battlefields.battlefieldB }
        
        const sagaArtifacts = updatedBase.filter(
          card => card.cardType === 'artifact' && 
          (card as import('../game/types').ArtifactCard).effectType === 'saga' &&
          card.owner === player
        ) as import('../game/types').ArtifactCard[]
        
        for (const artifact of sagaArtifacts) {
          const currentCounter = artifact.sagaCounters || 0
          const newCounter = currentCounter + 1
          
          // Update artifact with new counter
          updatedBase = updatedBase.map(card => 
            card.id === artifact.id 
              ? { ...card, sagaCounters: newCounter } as import('../game/types').ArtifactCard
              : card
          )
          
          // Destroy artifact after Chapter 3
          if (newCounter >= 3) {
            updatedBase = updatedBase.filter(card => card.id !== artifact.id)
          }
        }
        
        return { 
          updatedBase, 
          updatedBattlefields: { battlefieldA: updatedBattlefieldA, battlefieldB: updatedBattlefieldB }
        }
      }
      
      // Process sagas for player1
      const p1Saga = processSagaArtifacts(
        prev.player1Base, 
        'player1',
        { battlefieldA: battlefieldAWithCreeps, battlefieldB: battlefieldBWithCreeps }
      )
      
      // Process sagas for player2 (using updated battlefields from player1)
      const p2Saga = processSagaArtifacts(
        prev.player2Base,
        'player2',
        p1Saga.updatedBattlefields
      )
      
      // Final battlefields combine both players' saga effects
      const finalBattlefieldA = p2Saga.updatedBattlefields.battlefieldA
      const finalBattlefieldB = p2Saga.updatedBattlefields.battlefieldB
      
      // Final bases (player1 and player2 processed separately)
      const finalP1Base = p1Saga.updatedBase
      const finalP2Base = p2Saga.updatedBase
      
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
        player1Hand: prev.player1Hand,
        player2Hand: prev.player2Hand,
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
          player2RunePool: p2RuneResult.updatedPool
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

  const handleEndDeployPhase = useCallback(() => {
    setGameState(prev => {
      if (prev.metadata.currentPhase !== 'deploy') {
        return prev
      }
      
      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          currentPhase: 'play',
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



