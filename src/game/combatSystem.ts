import { Card, AttackTarget, AttackTargetType, Battlefield, PlayerId, TOWER_HP } from './types'

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
  towerHP: { towerA: number, towerB: number },
  battlefieldId: 'battlefieldA' | 'battlefieldB'
): {
  updatedBattlefield: Battlefield
  updatedTowerHP: { towerA: number, towerB: number }
  damageDealt: number
  targetKilled: boolean
} {
  const attackPower = getAttackPower(attacker)
  let updatedBattlefield = { ...battlefield }
  let updatedTowerHP = { ...towerHP }
  let damageDealt = 0
  let targetKilled = false
  
  if (target.type === 'unit' && target.targetId) {
    // Attacking a unit
    const opponent = attacker.owner === 'player1' ? 'player2' : 'player1'
    const opponentUnits = battlefield[opponent]
    const targetUnit = opponentUnits.find(u => u.id === target.targetId)
    
    if (targetUnit && 'currentHealth' in targetUnit) {
      const newHealth = Math.max(0, targetUnit.currentHealth - attackPower)
      damageDealt = Math.min(attackPower, targetUnit.currentHealth)
      
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
          [opponent]: opponentUnits.map(u =>
            u.id === target.targetId
              ? { ...u, currentHealth: newHealth }
              : u
          ),
        }
      }
    }
  } else {
    // Attacking tower
    const towerKey = battlefieldId === 'battlefieldA' ? 'towerA' : 'towerB'
    const currentHP = towerHP[towerKey]
    const newHP = Math.max(0, currentHP - attackPower)
    damageDealt = Math.min(attackPower, currentHP)
    
    updatedTowerHP = {
      ...updatedTowerHP,
      [towerKey]: newHP,
    }
    
    // If tower dies, overflow damage goes to nexus
    if (newHP === 0 && damageDealt < attackPower) {
      const overflowDamage = attackPower - damageDealt
      // We'll handle nexus damage separately in the main combat resolution
      // This keeps the function focused
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
 * Get attack power of a unit (handles stacked units)
 */
function getAttackPower(unit: Card): number {
  if (unit.cardType === 'generic' && 'stackPower' in unit && unit.stackPower !== undefined) {
    return unit.stackPower
  }
  return 'attack' in unit ? unit.attack : 0
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
  initialTowerHP: { towerA: number, towerB: number }
): {
  updatedBattlefield: Battlefield
  updatedTowerHP: { towerA: number, towerB: number }
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
        battlefieldId
      )
      
      currentBattlefield = result.updatedBattlefield
      currentTowerHP = result.updatedTowerHP
      
      // Check for tower overflow damage
      if (target.type === 'tower') {
        const towerKey = battlefieldId === 'battlefieldA' ? 'towerA' : 'towerB'
        const towerWasDestroyed = initialTowerHP[towerKey] > 0 && currentTowerHP[towerKey] === 0
        if (towerWasDestroyed) {
          // Calculate overflow: if we dealt more damage than the tower had HP
          const towerHPBefore = initialTowerHP[towerKey]
          const attackPower = getAttackPower(attacker)
          const overflow = Math.max(0, attackPower - towerHPBefore)
          overflowDamage += overflow
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

