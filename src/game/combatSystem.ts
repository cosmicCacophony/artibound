import { Card, AttackTarget, AttackTargetType, Battlefield, PlayerId, GameMetadata } from './types'

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
  towerHP: { towerA_player1: number, towerA_player2: number, towerB_player1: number, towerB_player2: number },
  battlefieldId: 'battlefieldA' | 'battlefieldB',
  stunnedHeroes?: Record<string, boolean>,
  towerArmor?: { towerA_player1: number, towerA_player2: number, towerB_player1: number, towerB_player2: number }
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
      attackPower = isStunned ? 0 : getAttackPower(attacker, targetIsHero)
      
      // Calculate effective health (currentHealth + temporaryHP)
      const tempHP = (targetUnit.cardType === 'hero' || targetUnit.cardType === 'generic') && 'temporaryHP' in targetUnit
        ? (targetUnit.temporaryHP || 0)
        : 0
      const effectiveHealth = targetUnit.currentHealth + tempHP
      
      // Apply damage - temporary HP absorbs damage first
      const damageAfterTempHP = Math.max(0, attackPower - tempHP)
      const newHealth = Math.max(0, targetUnit.currentHealth - damageAfterTempHP)
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
      attackPower = isStunned ? 0 : getAttackPower(attacker, false) // No hero bonus vs towers
      
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
      attackPower = isStunned ? 0 : getAttackPower(attacker, false)
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
function getAttackPower(unit: Card, targetIsHero: boolean = false): number {
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
  towerArmor?: { towerA_player1: number, towerA_player2: number, towerB_player1: number, towerB_player2: number }
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
        towerArmor
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
        const attackPowerForTower = getAttackPower(attacker, false) // No hero bonus vs towers
        
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
  towerArmor?: { towerA_player1: number, towerA_player2: number, towerB_player1: number, towerB_player2: number }
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
    const p1AttackPower = p1Unit && !p1IsStunned ? getAttackPower(p1Unit, p1Target?.type === 'unit' && p1Target.targetId ? 
      currentBattlefield.player2.find(u => u.id === p1Target.targetId)?.cardType === 'hero' : false) : 0
    const p2AttackPower = p2Unit && !p2IsStunned ? getAttackPower(p2Unit, p2Target?.type === 'unit' && p2Target.targetId ? 
      currentBattlefield.player1.find(u => u.id === p2Target.targetId)?.cardType === 'hero' : false) : 0
    
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
        towerArmor
      )
      
      currentBattlefield = result.updatedBattlefield
      currentTowerHP = result.updatedTowerHP
      
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
        towerArmor
      )
      
      currentBattlefield = result.updatedBattlefield
      currentTowerHP = result.updatedTowerHP
      
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

