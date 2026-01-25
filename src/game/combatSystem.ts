import { Card, AttackTarget, AttackTargetType, Battlefield, PlayerId, GameMetadata, GameState, GenericUnit } from './types'

const LANE_MOMENTUM_THRESHOLD = 10
const LANE_MOMENTUM_ATTACK_BONUS = 1

function getLaneMomentumBonus(
  gameState: GameState | undefined,
  battlefieldId: 'battlefieldA' | 'battlefieldB',
  player: PlayerId
): number {
  const laneMomentum = gameState?.metadata?.laneMomentum
  if (!laneMomentum) return 0
  const totalDamage = laneMomentum[battlefieldId]?.[player] ?? 0
  return totalDamage >= LANE_MOMENTUM_THRESHOLD ? LANE_MOMENTUM_ATTACK_BONUS : 0
}

/**
 * Combat System - Handles all combat-related logic
 * 
 * Hybrid positional combat:
 * - Default: Units attack what's directly in front (same slot)
 * - If no unit in front, they attack the tower
 * - Player can override targets during combat phase
 */

/**
 * Calculate default target for a unit based on position
 */
export function getDefaultTarget(
  attacker: Card,
  attackerSlot: number,
  battlefield: Battlefield
): AttackTarget {
  // Find opponent
  const opponent = attacker.owner === 'player1' ? 'player2' : 'player1'
  const opponentUnits = battlefield[opponent]
  
  // Check if there's a unit directly in front (same slot)
  const unitInFront = opponentUnits.find(u => u.slot === attackerSlot)
  
  if (unitInFront) {
    return {
      type: 'unit',
      targetId: unitInFront.id,
      targetSlot: attackerSlot,
    }
  } else {
    // Assassinate: if no unit in front, target any enemy unit in this lane instead of tower
    if (attacker.assassinate) {
      const candidates = opponentUnits.filter(u => u.slot !== undefined)
      if (candidates.length > 0) {
        const sorted = [...candidates].sort((a, b) => {
          const aHealth = (a as GenericUnit).currentHealth ?? 0
          const bHealth = (b as GenericUnit).currentHealth ?? 0
          if (aHealth !== bHealth) return aHealth - bHealth
          return (a.slot || 0) - (b.slot || 0)
        })
        return {
          type: 'unit',
          targetId: sorted[0].id,
          targetSlot: sorted[0].slot,
        }
      }
    }
    // No unit in front, attack tower
    return {
      type: 'tower',
      targetSlot: attackerSlot,
    }
  }
}

/**
 * Get all default targets for all units on a battlefield
 */
export function getDefaultTargets(
  battlefield: Battlefield,
  attackingPlayer: PlayerId
): Map<string, AttackTarget> {
  const targets = new Map<string, AttackTarget>()
  const attackerUnits = battlefield[attackingPlayer].filter(u => u.slot !== undefined)
  
  attackerUnits.forEach(unit => {
    if (unit.slot !== undefined) {
      const target = getDefaultTarget(unit, unit.slot, battlefield)
      targets.set(unit.id, target)
    }
  })
  
  return targets
}

/**
 * Validate if a target can be selected for an attacker
 */
export function canTarget(
  attacker: Card,
  attackerSlot: number,
  target: AttackTarget,
  battlefield: Battlefield
): boolean {
  // Can always target tower
  if (target.type === 'tower') {
    return true
  }
  
  // For unit targets, must exist in opponent's field
  if (target.type === 'unit' && target.targetId) {
    const opponent = attacker.owner === 'player1' ? 'player2' : 'player1'
    const opponentUnits = battlefield[opponent]
    return opponentUnits.some(u => u.id === target.targetId)
  }
  
  return false
}

/**
 * Resolve combat for a single attack
 * Returns updated state without mutating inputs
 */
export function resolveAttack(
  attacker: Card,
  target: AttackTarget,
  battlefield: Battlefield,
  towerHP: { towerA_player1: number, towerA_player2: number, towerB_player1: number, towerB_player2: number },
  battlefieldId: 'battlefieldA' | 'battlefieldB',
  stunnedHeroes?: Record<string, boolean>,
  towerArmor?: { towerA_player1: number, towerA_player2: number, towerB_player1: number, towerB_player2: number },
  gameState?: GameState
): {
  updatedBattlefield: Battlefield
  updatedTowerHP: { towerA_player1: number, towerA_player2: number, towerB_player1: number, towerB_player2: number }
  damageDealt: number
  targetKilled: boolean
} {
  let updatedBattlefield = { ...battlefield }
  let updatedTowerHP = { ...towerHP }
  let damageDealt = 0
  let targetKilled = false
  let attackPower = 0
  
  // Check if attacker is stunned - if so, they deal 0 damage (but still receive damage)
  const isStunned = stunnedHeroes && attacker.cardType === 'hero' && stunnedHeroes[attacker.id]
  
  if (target.type === 'unit' && target.targetId) {
    // Attacking a unit
    const opponent = attacker.owner === 'player1' ? 'player2' : 'player1'
    const opponentUnits = battlefield[opponent]
    const targetUnit = opponentUnits.find(u => u.id === target.targetId)
    
    if (targetUnit && 'currentHealth' in targetUnit) {
      // Check if target is a hero for bonus damage
      const targetIsHero = targetUnit.cardType === 'hero'
      // If stunned, deal 0 damage; otherwise calculate normally
      if (isStunned) {
        attackPower = 0
      } else {
        attackPower = getAttackPower(attacker, gameState, battlefieldId, targetIsHero)
        attackPower += getLaneMomentumBonus(gameState, battlefieldId, attacker.owner)
        if (targetIsHero && attacker.cardType === 'hero' && 'bonusVsHeroes' in attacker && attacker.bonusVsHeroes) {
          attackPower += attacker.bonusVsHeroes
        }
        
        
      }
      
      // Calculate effective health (currentHealth + temporaryHP + tribe buff)
      const tempHP = (targetUnit.cardType === 'hero' || targetUnit.cardType === 'generic') && 'temporaryHP' in targetUnit
        ? (targetUnit.temporaryHP || 0)
        : 0
      const tribeBuff = getTribeBuff(
        gameState,
        battlefieldId,
        targetUnit.owner,
        (targetUnit as any).tribe,
        targetUnit.id
      )
      const buffHealth = tribeBuff.health
      const effectiveHealth = targetUnit.currentHealth + tempHP + buffHealth
      
      // Apply damage - temporary HP absorbs damage first
      const damageAfterTempHP = Math.max(0, attackPower - tempHP)
      const damageAfterBuff = Math.max(0, damageAfterTempHP - buffHealth)
      const newHealth = Math.max(0, targetUnit.currentHealth - damageAfterBuff)
      const newTempHP = Math.max(0, tempHP - attackPower)
      
      damageDealt = Math.min(attackPower, effectiveHealth)
      
      if (newHealth <= 0) {
        // Unit died
        targetKilled = true
        updatedBattlefield = {
          ...updatedBattlefield,
          [opponent]: opponentUnits.filter(u => u.id !== target.targetId),
        }
      } else {
        // Unit damaged but alive
        updatedBattlefield = {
          ...updatedBattlefield,
          [opponent]: opponentUnits.map(u => {
            if (u.id === target.targetId) {
              // Update health and temporary HP
              const updatedUnit = { ...u, currentHealth: newHealth }
              if ((u.cardType === 'hero' || u.cardType === 'generic') && 'temporaryHP' in u) {
                (updatedUnit as any).temporaryHP = newTempHP
              }
              return updatedUnit
            }
            return u
          }),
        }
      }
    }
  } else {
    // Attacking tower - determine which player's tower to attack
    const opponent = attacker.owner === 'player1' ? 'player2' : 'player1'
    const towerKey = battlefieldId === 'battlefieldA' 
      ? (opponent === 'player1' ? 'towerA_player1' : 'towerA_player2')
      : (opponent === 'player1' ? 'towerB_player1' : 'towerB_player2')
    const currentHP = towerHP[towerKey]
    
    // If tower is already dead, all damage goes to nexus (handled in combat resolution)
    // Otherwise, damage hits tower first (reduced by armor)
    if (currentHP > 0) {
      // If stunned, deal 0 damage; otherwise calculate normally
      if (isStunned) {
        attackPower = 0
      } else {
        attackPower = getAttackPower(attacker, gameState, battlefieldId, false) // No hero bonus vs towers
        attackPower += getLaneMomentumBonus(gameState, battlefieldId, attacker.owner)
        
        
      }
      
      // Apply tower armor (reduce damage by armor amount)
      const armor = towerArmor?.[towerKey] || 0
      const damageAfterArmor = Math.max(0, attackPower - armor)
      const newHP = Math.max(0, currentHP - damageAfterArmor)
      damageDealt = Math.min(damageAfterArmor, currentHP)
      
      updatedTowerHP = {
        ...updatedTowerHP,
        [towerKey]: newHP,
      }
    } else {
      // Tower already dead - all damage goes to nexus (will be handled in combat resolution)
      if (isStunned) {
        attackPower = 0
      } else {
        attackPower = getAttackPower(attacker, gameState, battlefieldId, false)
        attackPower += getLaneMomentumBonus(gameState, battlefieldId, attacker.owner)
        
        
      }
      damageDealt = 0 // No damage to tower (it's already dead)
    }
  }
  
  return {
    updatedBattlefield,
    updatedTowerHP,
    damageDealt,
    targetKilled,
  }
}

/**
 * Get attack power of a unit (handles stacked units, hero bonuses, and temporary attack)
 */
export function getTribeBuff(
  gameState: GameState | undefined,
  battlefieldId: 'battlefieldA' | 'battlefieldB',
  owner: PlayerId,
  tribe: string | undefined,
  targetCardId?: string
): { attack: number; health: number } {
  if (!gameState || !tribe) {
    return { attack: 0, health: 0 }
  }

  const sources: Card[] = [
    ...gameState[battlefieldId][owner],
  ] as Card[]

  return sources.reduce(
    (acc, card) => {
      const isInPlay = card.location === battlefieldId

      if (!isInPlay || !card.tribeBuff) {
        return acc
      }
      if (card.tribeBuff.tribe !== tribe) {
        return acc
      }
      if (card.tribeBuff.excludeSelf && targetCardId && card.id === targetCardId) {
        return acc
      }
      return {
        attack: acc.attack + card.tribeBuff.attack,
        health: acc.health + card.tribeBuff.health,
      }
    },
    { attack: 0, health: 0 }
  )
}

function getAttackPower(
  unit: Card,
  gameState: GameState | undefined,
  battlefieldId: 'battlefieldA' | 'battlefieldB',
  targetIsHero: boolean = false
): number {
  let baseAttack = 0
  if (unit.cardType === 'generic' && 'stackPower' in unit && unit.stackPower !== undefined) {
    baseAttack = unit.stackPower
  } else if ('attack' in unit) {
    baseAttack = unit.attack
  }
  
  // Add temporary attack bonus (if present)
  const tempAttack = (unit.cardType === 'hero' || unit.cardType === 'generic') && 'temporaryAttack' in unit
    ? (unit.temporaryAttack || 0)
    : 0
  baseAttack += tempAttack

  // Add tribe buff attack (if applicable)
  if ('tribe' in unit) {
    const tribeBuff = getTribeBuff(
      gameState,
      battlefieldId,
      unit.owner,
      (unit as any).tribe,
      unit.id
    )
    baseAttack += tribeBuff.attack
  }
  
  // Apply hero bonus vs heroes (e.g., assassins +3 vs heroes)
  if (targetIsHero && unit.cardType === 'hero' && 'bonusVsHeroes' in unit && unit.bonusVsHeroes) {
    return baseAttack + unit.bonusVsHeroes
  }
  
  return baseAttack
}

/**
 * Resolve all combat actions for a battlefield
 * Processes all attacks from the active player and returns updated game state
 * Note: Only the active player's units attack during their combat phase
 */
export function resolveCombat(
  battlefield: Battlefield,
  battlefieldId: 'battlefieldA' | 'battlefieldB',
  combatActions: Map<string, AttackTarget>, // Map of unit ID -> target (only active player's units)
  activePlayer: PlayerId,
  initialTowerHP: { towerA_player1: number, towerA_player2: number, towerB_player1: number, towerB_player2: number },
  stunnedHeroes?: Record<string, boolean>,
  towerArmor?: { towerA_player1: number, towerA_player2: number, towerB_player1: number, towerB_player2: number },
  gameState?: GameState
): {
  updatedBattlefield: Battlefield
  updatedTowerHP: { towerA_player1: number, towerA_player2: number, towerB_player1: number, towerB_player2: number }
  overflowDamage: number // Damage to nexus if tower is destroyed
  combatLog: CombatLogEntry[]
} {
  let currentBattlefield = { ...battlefield }
  let currentTowerHP = { ...initialTowerHP }
  let overflowDamage = 0
  const combatLog: CombatLogEntry[] = []
  
  // Only process attacks from active player
  const attackingUnits = battlefield[activePlayer].filter(u => u.slot !== undefined)
  
  // Process each attack sequentially
  attackingUnits.forEach(attacker => {
    const target = combatActions.get(attacker.id)
    if (target && attacker.slot !== undefined) {
      const result = resolveAttack(
        attacker,
        target,
        currentBattlefield,
        currentTowerHP,
        battlefieldId,
        stunnedHeroes,
        towerArmor,
        gameState
      )
      
      currentBattlefield = result.updatedBattlefield
      currentTowerHP = result.updatedTowerHP
      
      // Check for tower damage and overflow
      if (target.type === 'tower') {
        const opponent = activePlayer === 'player1' ? 'player2' : 'player1'
        const towerKey = battlefieldId === 'battlefieldA' 
          ? (opponent === 'player1' ? 'towerA_player1' : 'towerA_player2')
          : (opponent === 'player1' ? 'towerB_player1' : 'towerB_player2')
        const towerHPBefore = initialTowerHP[towerKey]
        const towerHPAfter = currentTowerHP[towerKey]
        const attackPowerForTower = getAttackPower(attacker, gameState, battlefieldId, false) // No hero bonus vs towers
        
        if (towerHPBefore > 0) {
          // Tower was alive - check if we destroyed it
          if (towerHPAfter === 0) {
            // Tower destroyed this attack - calculate overflow
            const totalOverflow = Math.max(0, attackPowerForTower - towerHPBefore)
            overflowDamage += totalOverflow
          }
          // If tower is still alive, no overflow (all damage went to tower)
        } else {
          // Tower was already dead - all damage goes to nexus
          overflowDamage += attackPowerForTower
        }
      }
      
      // Update combat log
      if (target.type === 'unit' && target.targetId) {
        const opponent = activePlayer === 'player1' ? 'player2' : 'player1'
        const targetUnit = battlefield[opponent].find(u => u.id === target.targetId)
        combatLog.push({
          attackerId: attacker.id,
          attackerName: attacker.name,
          targetType: 'unit',
          targetId: target.targetId,
          targetName: targetUnit?.name || 'Unknown',
          damage: result.damageDealt,
          killed: result.targetKilled,
        })
      } else {
        combatLog.push({
          attackerId: attacker.id,
          attackerName: attacker.name,
          targetType: 'tower',
          damage: result.damageDealt,
        })
      }
    }
  })
  
  return {
    updatedBattlefield: currentBattlefield,
    updatedTowerHP: currentTowerHP,
    overflowDamage,
    combatLog,
  }
}

/**
 * Combat log entry for displaying combat results
 */
export interface CombatLogEntry {
  attackerId: string
  attackerName: string
  targetType: 'unit' | 'tower'
  targetId?: string
  targetName?: string
  damage: number
  killed?: boolean
}

/**
 * Resolve simultaneous combat for both players
 * Units in front of each other attack simultaneously
 * Both units deal damage even if one dies (true simultaneous combat)
 */
export function resolveSimultaneousCombat(
  battlefield: Battlefield,
  battlefieldId: 'battlefieldA' | 'battlefieldB',
  initialTowerHP: { towerA_player1: number, towerA_player2: number, towerB_player1: number, towerB_player2: number },
  stunnedHeroes?: Record<string, boolean>,
  towerArmor?: { towerA_player1: number, towerA_player2: number, towerB_player1: number, towerB_player2: number },
  gameState?: GameState
): {
  updatedBattlefield: Battlefield
  updatedTowerHP: { towerA_player1: number, towerA_player2: number, towerB_player1: number, towerB_player2: number }
  overflowDamage: { player1: number, player2: number } // Overflow damage to nexus for each player
  combatLog: CombatLogEntry[]
} {
  let currentBattlefield = { ...battlefield }
  let currentTowerHP = { ...initialTowerHP }
  let overflowDamage = { player1: 0, player2: 0 }
  const combatLog: CombatLogEntry[] = []
  
  // Helper to check if tower is dead for a given battlefield and player
  const isTowerDead = (battlefieldId: 'battlefieldA' | 'battlefieldB', player: 'player1' | 'player2'): boolean => {
    const towerKey = battlefieldId === 'battlefieldA'
      ? (player === 'player1' ? 'towerA_player1' : 'towerA_player2')
      : (player === 'player1' ? 'towerB_player1' : 'towerB_player2')
    return currentTowerHP[towerKey] === 0
  }

  const applyCleaveDamage = (
    attacker: Card,
    attackerSlot: number,
    attackPower: number,
    opponent: PlayerId
  ) => {
    // Check if attacker has cleave
    const hasCleave = attacker.specialEffects?.includes('cleave') || false
    if (!hasCleave || attackPower <= 0) return

    const opponentUnits = currentBattlefield[opponent]
    const adjacentSlots = [attackerSlot - 1, attackerSlot + 1].filter(s => s >= 1 && s <= 5)
    
    for (const adjacentSlot of adjacentSlots) {
      const adjacentUnit = opponentUnits.find(u => u.slot === adjacentSlot)
      if (adjacentUnit && 'currentHealth' in adjacentUnit) {
        const tempHP = (adjacentUnit.cardType === 'hero' || adjacentUnit.cardType === 'generic') && 'temporaryHP' in adjacentUnit
          ? (adjacentUnit.temporaryHP || 0)
          : 0
        const tribeBuff = getTribeBuff(
          gameState,
          battlefieldId,
          adjacentUnit.owner,
          (adjacentUnit as any).tribe,
          adjacentUnit.id
        )
        const buffHealth = tribeBuff.health
        const effectiveHealth = adjacentUnit.currentHealth + tempHP + buffHealth
        const damageAfterTempHP = Math.max(0, attackPower - tempHP)
        const damageAfterBuff = Math.max(0, damageAfterTempHP - buffHealth)
        const newHealth = Math.max(0, adjacentUnit.currentHealth - damageAfterBuff)
        const newTempHP = Math.max(0, tempHP - attackPower)
        const killed = newHealth <= 0

        const updatedUnit = {
          ...adjacentUnit,
          currentHealth: newHealth,
          temporaryHP: newTempHP,
        }

        const updatedOpponentUnits = killed
          ? opponentUnits.filter(u => u.id !== adjacentUnit.id)
          : opponentUnits.map(u => (u.id === adjacentUnit.id ? updatedUnit : u))

        currentBattlefield = {
          ...currentBattlefield,
          [opponent]: updatedOpponentUnits,
        }

        combatLog.push({
          attackerId: attacker.id,
          attackerName: attacker.name,
          targetType: 'unit',
          targetId: adjacentUnit.id,
          targetName: adjacentUnit.name,
          damage: Math.min(attackPower, effectiveHealth),
          killed,
        })
      }
    }
  }

  const applyCrossStrike = (
    attacker: Card,
    slot: number,
    opponent: PlayerId,
    otherBattlefieldId: 'battlefieldA' | 'battlefieldB',
    damage: number
  ) => {
    if (damage <= 0 || !gameState) return
    const otherBattlefield = gameState[otherBattlefieldId]
    if (!otherBattlefield) return
    const targetUnit = otherBattlefield[opponent].find(u => u.slot === slot)

    if (targetUnit && 'currentHealth' in targetUnit) {
      const tempHP = (targetUnit.cardType === 'hero' || targetUnit.cardType === 'generic') && 'temporaryHP' in targetUnit
        ? (targetUnit.temporaryHP || 0)
        : 0
      const tribeBuff = getTribeBuff(
        gameState,
        otherBattlefieldId,
        targetUnit.owner,
        (targetUnit as any).tribe,
        targetUnit.id
      )
      const buffHealth = tribeBuff.health
      const effectiveHealth = targetUnit.currentHealth + tempHP + buffHealth
      const damageAfterTempHP = Math.max(0, damage - tempHP)
      const damageAfterBuff = Math.max(0, damageAfterTempHP - buffHealth)
      const newHealth = Math.max(0, targetUnit.currentHealth - damageAfterBuff)
      const newTempHP = Math.max(0, tempHP - damage)
      const killed = newHealth <= 0

      const updatedUnit = {
        ...targetUnit,
        currentHealth: newHealth,
        temporaryHP: newTempHP,
      }

      const updatedOpponentUnits = killed
        ? otherBattlefield[opponent].filter(u => u.id !== targetUnit.id)
        : otherBattlefield[opponent].map(u => (u.id === targetUnit.id ? updatedUnit : u))

      // Update the other battlefield in gameState directly
      if (gameState) {
        gameState[otherBattlefieldId] = {
          ...otherBattlefield,
          [opponent]: updatedOpponentUnits,
        }
      }

      combatLog.push({
        attackerId: attacker.id,
        attackerName: attacker.name,
        targetType: 'unit',
        targetId: targetUnit.id,
        targetName: targetUnit.name,
        damage: Math.min(damage, effectiveHealth),
        killed,
      })
      return
    }

    const towerKey = otherBattlefieldId === 'battlefieldA'
      ? (opponent === 'player1' ? 'towerA_player1' : 'towerA_player2')
      : (opponent === 'player1' ? 'towerB_player1' : 'towerB_player2')
    const towerHPBefore = currentTowerHP[towerKey]
    const armor = towerArmor?.[towerKey] || 0
    const damageAfterArmor = Math.max(0, damage - armor)
    const newTowerHP = Math.max(0, towerHPBefore - damageAfterArmor)

    if (towerHPBefore > 0 && newTowerHP === 0) {
      const overflow = Math.max(0, damageAfterArmor - towerHPBefore)
      overflowDamage[attacker.owner] += overflow
    } else if (towerHPBefore === 0) {
      overflowDamage[attacker.owner] += damageAfterArmor
    }

    currentTowerHP = {
      ...currentTowerHP,
      [towerKey]: newTowerHP,
    }

    combatLog.push({
      attackerId: attacker.id,
      attackerName: attacker.name,
      targetType: 'tower',
      damage: damageAfterArmor,
    })
  }
  
  // Get all units from both players with their slots
  const player1Units = battlefield.player1.filter(u => u.slot !== undefined)
  const player2Units = battlefield.player2.filter(u => u.slot !== undefined)
  
  // Process each slot (1-5) - both units attack simultaneously
  for (let slot = 1; slot <= 5; slot++) {
    const p1Unit = player1Units.find(u => u.slot === slot)
    const p2Unit = player2Units.find(u => u.slot === slot)
    
    // Calculate attacks for both units first (before applying damage)
    // If tower is dead, units still target tower (damage goes to nexus)
    const p1Target = p1Unit ? getDefaultTarget(p1Unit, slot, currentBattlefield) : null
    const p2Target = p2Unit ? getDefaultTarget(p2Unit, slot, currentBattlefield) : null
    
    // Calculate damage amounts (check for stun)
    const p1IsStunned = p1Unit && p1Unit.cardType === 'hero' && stunnedHeroes && stunnedHeroes[p1Unit.id]
    const p2IsStunned = p2Unit && p2Unit.cardType === 'hero' && stunnedHeroes && stunnedHeroes[p2Unit.id]
    // Calculate attack power
    let p1AttackPower = 0
    if (p1Unit && !p1IsStunned) {
      const targetIsHero = p1Target?.type === 'unit' && p1Target.targetId ? 
        currentBattlefield.player2.find(u => u.id === p1Target.targetId)?.cardType === 'hero' : false
      p1AttackPower = getAttackPower(p1Unit, gameState, battlefieldId, targetIsHero)
      p1AttackPower += getLaneMomentumBonus(gameState, battlefieldId, p1Unit.owner)
      if (targetIsHero && p1Unit.cardType === 'hero' && 'bonusVsHeroes' in p1Unit && p1Unit.bonusVsHeroes) {
        p1AttackPower += p1Unit.bonusVsHeroes
      }
      
    }
    let p2AttackPower = 0
    if (p2Unit && !p2IsStunned) {
      const targetIsHero = p2Target?.type === 'unit' && p2Target.targetId ? 
        currentBattlefield.player1.find(u => u.id === p2Target.targetId)?.cardType === 'hero' : false
      p2AttackPower = getAttackPower(p2Unit, gameState, battlefieldId, targetIsHero)
      p2AttackPower += getLaneMomentumBonus(gameState, battlefieldId, p2Unit.owner)
      if (targetIsHero && p2Unit.cardType === 'hero' && 'bonusVsHeroes' in p2Unit && p2Unit.bonusVsHeroes) {
        p2AttackPower += p2Unit.bonusVsHeroes
      }
      
    }
    
    // Apply Player 1's attack
    if (p1Unit && p1Target) {
      // Capture tower HP BEFORE this attack for overflow calculation
      let towerHPBeforeAttack = 0
      if (p1Target.type === 'tower') {
        const towerKey = battlefieldId === 'battlefieldA' 
          ? 'towerA_player2'
          : 'towerB_player2'
        towerHPBeforeAttack = currentTowerHP[towerKey]
      }
      
      const result = resolveAttack(
        p1Unit,
        p1Target,
        currentBattlefield,
        currentTowerHP,
        battlefieldId,
        stunnedHeroes,
        towerArmor,
        gameState
      )
      
      currentBattlefield = result.updatedBattlefield
      currentTowerHP = result.updatedTowerHP
      
      // Apply cleave damage to adjacent units
      if (!p1IsStunned) {
        applyCleaveDamage(p1Unit, slot, p1AttackPower, 'player2')
      }
      
      // Track overflow damage
      if (p1Target.type === 'tower') {
        const towerKey = battlefieldId === 'battlefieldA' 
          ? 'towerA_player2'
          : 'towerB_player2'
        const towerHPAfter = currentTowerHP[towerKey]
        
        if (towerHPBeforeAttack > 0) {
          // Tower was alive - check if we destroyed it
          if (towerHPAfter === 0) {
            // Tower destroyed this attack - calculate overflow
            const totalOverflow = Math.max(0, p1AttackPower - towerHPBeforeAttack)
            overflowDamage.player1 += totalOverflow
          }
          // If tower is still alive, no overflow (all damage went to tower)
        } else {
          // Tower was already dead - all damage goes to nexus
          overflowDamage.player1 += p1AttackPower
        }
      }

      // Cross-Strike: if attacking an empty slot, strike the mirrored slot on the other battlefield
      if (p1Target.type === 'tower' && !p1IsStunned && p1Unit.crossStrike) {
        const hadBlocker = battlefield.player2.some(u => u.slot === slot)
        if (!hadBlocker) {
          const otherBattlefieldId = battlefieldId === 'battlefieldA' ? 'battlefieldB' : 'battlefieldA'
          applyCrossStrike(p1Unit, slot, 'player2', otherBattlefieldId, p1Unit.crossStrike)
        }
      }
      
      // Log combat
      if (p1Target.type === 'unit' && p1Target.targetId) {
        const targetUnit = battlefield.player2.find(u => u.id === p1Target.targetId)
        combatLog.push({
          attackerId: p1Unit.id,
          attackerName: p1Unit.name,
          targetType: 'unit',
          targetId: p1Target.targetId,
          targetName: targetUnit?.name || 'Unknown',
          damage: result.damageDealt,
          killed: result.targetKilled,
        })
      } else {
        combatLog.push({
          attackerId: p1Unit.id,
          attackerName: p1Unit.name,
          targetType: 'tower',
          damage: result.damageDealt,
        })
      }
    }
    
    // Apply Player 2's attack (even if unit was killed by player 1, it still attacks)
    if (p2Unit && p2Target) {
      // For simultaneous combat, both units attack even if one dies
      // So we use the original battlefield state to find the target
      const originalTarget = battlefield.player1.find(u => 
        p2Target.type === 'unit' && p2Target.targetId && u.id === p2Target.targetId
      )
      
      // If attacking a unit that might be dead, check if it still exists
      if (p2Target.type === 'unit' && p2Target.targetId) {
        const targetStillExists = currentBattlefield.player1.some(u => u.id === p2Target.targetId)
        if (!targetStillExists && originalTarget) {
          // Target was killed by player 1, but player 2 still attacks (simultaneous)
          // In true simultaneous combat, both deal damage. For now, if target is dead, attack doesn't happen
          // This is a design decision - we could make it so damage is still dealt
        }
      }
      
      // Capture tower HP BEFORE this attack for overflow calculation
      let towerHPBeforeAttack = 0
      if (p2Target.type === 'tower') {
        const towerKey = battlefieldId === 'battlefieldA' 
          ? 'towerA_player1'
          : 'towerB_player1'
        towerHPBeforeAttack = currentTowerHP[towerKey]
      }
      
      const result = resolveAttack(
        p2Unit,
        p2Target,
        currentBattlefield,
        currentTowerHP,
        battlefieldId,
        stunnedHeroes,
        towerArmor,
        gameState
      )
      
      currentBattlefield = result.updatedBattlefield
      currentTowerHP = result.updatedTowerHP
      
      // Apply cleave damage to adjacent units
      if (!p2IsStunned) {
        applyCleaveDamage(p2Unit, slot, p2AttackPower, 'player1')
      }
      
      // Track overflow damage
      if (p2Target.type === 'tower') {
        const towerKey = battlefieldId === 'battlefieldA' 
          ? 'towerA_player1'
          : 'towerB_player1'
        const towerHPAfter = currentTowerHP[towerKey]
        
        if (towerHPBeforeAttack > 0) {
          // Tower was alive - check if we destroyed it
          if (towerHPAfter === 0) {
            // Tower destroyed this attack - calculate overflow
            const totalOverflow = Math.max(0, p2AttackPower - towerHPBeforeAttack)
            overflowDamage.player2 += totalOverflow
          }
          // If tower is still alive, no overflow (all damage went to tower)
        } else {
          // Tower was already dead - all damage goes to nexus
          overflowDamage.player2 += p2AttackPower
        }
      }

      // Cross-Strike: if attacking an empty slot, strike the mirrored slot on the other battlefield
      if (p2Target.type === 'tower' && !p2IsStunned && p2Unit.crossStrike) {
        const hadBlocker = battlefield.player1.some(u => u.slot === slot)
        if (!hadBlocker) {
          const otherBattlefieldId = battlefieldId === 'battlefieldA' ? 'battlefieldB' : 'battlefieldA'
          applyCrossStrike(p2Unit, slot, 'player1', otherBattlefieldId, p2Unit.crossStrike)
        }
      }
      
      // Log combat
      if (p2Target.type === 'unit' && p2Target.targetId) {
        const targetUnit = currentBattlefield.player1.find(u => u.id === p2Target.targetId) || 
                          battlefield.player1.find(u => u.id === p2Target.targetId)
        combatLog.push({
          attackerId: p2Unit.id,
          attackerName: p2Unit.name,
          targetType: 'unit',
          targetId: p2Target.targetId,
          targetName: targetUnit?.name || 'Unknown',
          damage: result.damageDealt,
          killed: result.targetKilled,
        })
      } else {
        combatLog.push({
          attackerId: p2Unit.id,
          attackerName: p2Unit.name,
          targetType: 'tower',
          damage: result.damageDealt,
        })
      }
    }
  }
  
  return {
    updatedBattlefield: currentBattlefield,
    updatedTowerHP: currentTowerHP,
    overflowDamage,
    combatLog,
  }
}


/**
 * Resolve ranged attacks from base/deploy zone
 * Ranged units deal damage evenly to both towers
 */
export function resolveRangedAttacks(
  gameState: GameState,
  initialTowerHP: { towerA_player1: number, towerA_player2: number, towerB_player1: number, towerB_player2: number },
  towerArmor?: { towerA_player1: number, towerA_player2: number, towerB_player1: number, towerB_player2: number }
): {
  updatedTowerHP: { towerA_player1: number, towerA_player2: number, towerB_player1: number, towerB_player2: number }
  overflowDamage: { player1: number, player2: number }
  combatLog: CombatLogEntry[]
} {
  let currentTowerHP = { ...initialTowerHP }
  let overflowDamage = { player1: 0, player2: 0 }
  const combatLog: CombatLogEntry[] = []
  
  // Get ranged units from base and deploy zone for both players
  const getRangedUnits = (player: PlayerId): GenericUnit[] => {
    const base = player === 'player1' ? gameState.player1Base : gameState.player2Base
    const deployZone = player === 'player1' ? gameState.player1DeployZone : gameState.player2DeployZone
    const allCards = [...base, ...deployZone]
    return allCards.filter(card => 
      card.cardType === 'generic' && 
      'rangedAttack' in card && 
      card.rangedAttack !== undefined &&
      card.rangedAttack > 0
    ) as GenericUnit[]
  }
  
  // Process ranged attacks for both players
  for (const player of ['player1', 'player2'] as PlayerId[]) {
    const rangedUnits = getRangedUnits(player)
    const opponent = player === 'player1' ? 'player2' : 'player1'
    
    for (const unit of rangedUnits) {
      if (!unit.rangedAttack) continue
      
      const damage = unit.rangedAttack
      // Split damage evenly: floor(damage/2) to each tower, remainder to first tower
      const damageToEach = Math.floor(damage / 2)
      const remainder = damage % 2
      
      // Damage to tower A
      const towerAKey = opponent === 'player1' ? 'towerA_player1' : 'towerA_player2'
      const towerAHPBefore = currentTowerHP[towerAKey]
      const armorA = towerArmor?.[towerAKey] || 0
      const damageAfterArmorA = Math.max(0, damageToEach + remainder - armorA)
      const newTowerAHP = Math.max(0, towerAHPBefore - damageAfterArmorA)
      
      if (towerAHPBefore > 0 && newTowerAHP === 0) {
        // Tower destroyed - calculate overflow
        const overflow = Math.max(0, damageToEach + remainder - towerAHPBefore)
        overflowDamage[player] += overflow
      } else if (towerAHPBefore === 0) {
        // Tower already dead - all damage goes to nexus
        overflowDamage[player] += damageToEach + remainder
      }
      
      currentTowerHP[towerAKey] = newTowerAHP
      
      // Damage to tower B
      const towerBKey = opponent === 'player1' ? 'towerB_player1' : 'towerB_player2'
      const towerBHPBefore = currentTowerHP[towerBKey]
      const armorB = towerArmor?.[towerBKey] || 0
      const damageAfterArmorB = Math.max(0, damageToEach - armorB)
      const newTowerBHP = Math.max(0, towerBHPBefore - damageAfterArmorB)
      
      if (towerBHPBefore > 0 && newTowerBHP === 0) {
        // Tower destroyed - calculate overflow
        const overflow = Math.max(0, damageToEach - towerBHPBefore)
        overflowDamage[player] += overflow
      } else if (towerBHPBefore === 0) {
        // Tower already dead - all damage goes to nexus
        overflowDamage[player] += damageToEach
      }
      
      currentTowerHP[towerBKey] = newTowerBHP
      
      // Log the ranged attack
      combatLog.push({
        attackerId: unit.id,
        attackerName: unit.name,
        targetType: 'tower',
        damage: damage,
      })
    }
  }
  
  return {
    updatedTowerHP: currentTowerHP,
    overflowDamage,
    combatLog,
  }
}
