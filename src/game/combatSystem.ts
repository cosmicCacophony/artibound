import { Card, AttackTarget, Battlefield, PlayerId, GameState, GenericUnit, Hero, FormationTag } from './types'

/**
 * Autobattler Combat System with Formation Tags
 *
 * Units in a lane have an optional formationTag: 'frontline' | 'ranged' | 'assassin' | undefined (default).
 * Combat resolves automatically per lane. Targeting priority:
 *   - Frontline: attacks enemy frontline first, then any enemy, then tower
 *   - Default (no tag): attacks any enemy (lowest health first), then tower
 *   - Ranged: attacks non-frontline enemies first ("shoots over"), then tower
 *   - Assassin: always attacks tower directly
 *
 * Enemies must attack frontline units first when they exist (frontline "guards" other units).
 * Both sides resolve simultaneously — all targets are computed before damage is applied.
 */

export interface CombatLogEntry {
  attackerId: string
  attackerName: string
  targetType: 'unit' | 'tower'
  targetId?: string
  targetName?: string
  damage: number
  killed?: boolean
  formationTag?: FormationTag
}

function getFormationTag(unit: Card): FormationTag | undefined {
  if (unit.cardType === 'hero' || unit.cardType === 'generic') {
    return (unit as Hero | GenericUnit).formationTag
  }
  return undefined
}

function getAttackPower(unit: Card): number {
  let baseAttack = 0
  if (unit.cardType === 'generic' && 'stackPower' in unit && (unit as GenericUnit).stackPower !== undefined) {
    baseAttack = (unit as GenericUnit).stackPower!
  } else if ('attack' in unit) {
    baseAttack = (unit as any).attack
  }

  const tempAttack = (unit.cardType === 'hero' || unit.cardType === 'generic') && 'temporaryAttack' in unit
    ? ((unit as any).temporaryAttack || 0)
    : 0
  return baseAttack + tempAttack
}

function getEffectiveHealth(unit: Card): number {
  if (!('currentHealth' in unit)) return 0
  const hp = (unit as any).currentHealth || 0
  const tempHP = (unit.cardType === 'hero' || unit.cardType === 'generic') && 'temporaryHP' in unit
    ? ((unit as any).temporaryHP || 0)
    : 0
  return hp + tempHP
}

function sortByLowestHealth(units: Card[]): Card[] {
  return [...units].sort((a, b) => getEffectiveHealth(a) - getEffectiveHealth(b))
}

/**
 * Determine what a unit attacks based on its formation tag and available enemies.
 */
function pickTarget(
  attacker: Card,
  enemyUnits: Card[],
  stunnedHeroes?: Record<string, boolean>
): AttackTarget {
  const tag = getFormationTag(attacker)
  const isStunned = attacker.cardType === 'hero' && stunnedHeroes?.[attacker.id]

  if (isStunned) {
    return { type: 'tower' }
  }

  if (tag === 'assassin') {
    return { type: 'tower' }
  }

  if (enemyUnits.length === 0) {
    return { type: 'tower' }
  }

  const enemyFrontline = enemyUnits.filter(u => getFormationTag(u) === 'frontline')
  const enemyNonFrontline = enemyUnits.filter(u => getFormationTag(u) !== 'frontline')

  if (tag === 'frontline') {
    if (enemyFrontline.length > 0) {
      const target = sortByLowestHealth(enemyFrontline)[0]
      return { type: 'unit', targetId: target.id }
    }
    const target = sortByLowestHealth(enemyUnits)[0]
    return { type: 'unit', targetId: target.id }
  }

  if (tag === 'ranged') {
    if (enemyNonFrontline.length > 0) {
      const target = sortByLowestHealth(enemyNonFrontline)[0]
      return { type: 'unit', targetId: target.id }
    }
    const target = sortByLowestHealth(enemyUnits)[0]
    return { type: 'unit', targetId: target.id }
  }

  // Default (no tag): must attack frontline first if any exist
  if (enemyFrontline.length > 0) {
    const target = sortByLowestHealth(enemyFrontline)[0]
    return { type: 'unit', targetId: target.id }
  }
  const target = sortByLowestHealth(enemyUnits)[0]
  return { type: 'unit', targetId: target.id }
}

/**
 * Compute all combat pairs for one side of a lane.
 * Returns a list of [attacker, target] pairs.
 */
function computeAttacks(
  attackerUnits: Card[],
  enemyUnits: Card[],
  stunnedHeroes?: Record<string, boolean>
): Array<{ attacker: Card; target: AttackTarget }> {
  const tagOrder: Array<FormationTag | undefined> = ['frontline', undefined, 'ranged', 'assassin']

  const sorted = [...attackerUnits].sort((a, b) => {
    const aIdx = tagOrder.indexOf(getFormationTag(a))
    const bIdx = tagOrder.indexOf(getFormationTag(b))
    return aIdx - bIdx
  })

  return sorted.map(attacker => ({
    attacker,
    target: pickTarget(attacker, enemyUnits, stunnedHeroes),
  }))
}

type TowerHP = {
  towerA_player1: number
  towerA_player2: number
  towerB_player1: number
  towerB_player2: number
}

/**
 * Resolve simultaneous combat for a single lane.
 * Both sides compute targets, then all damage is applied at once.
 */
export function resolveSimultaneousCombat(
  battlefield: Battlefield,
  battlefieldId: 'battlefieldA' | 'battlefieldB',
  initialTowerHP: TowerHP,
  stunnedHeroes?: Record<string, boolean>,
  towerArmor?: TowerHP,
  _gameState?: GameState
): {
  updatedBattlefield: Battlefield
  updatedTowerHP: TowerHP
  overflowDamage: { player1: number; player2: number }
  combatLog: CombatLogEntry[]
} {
  const combatLog: CombatLogEntry[] = []
  const currentTowerHP = { ...initialTowerHP }
  let overflowDamage = { player1: 0, player2: 0 }

  const p1Units = battlefield.player1.filter(u => 'currentHealth' in u)
  const p2Units = battlefield.player2.filter(u => 'currentHealth' in u)

  const p1Attacks = computeAttacks(p1Units, p2Units, stunnedHeroes)
  const p2Attacks = computeAttacks(p2Units, p1Units, stunnedHeroes)

  // Accumulate damage to each target before applying
  const unitDamage: Record<string, number> = {}
  const towerDamage: Record<string, number> = {} // towerKey -> damage

  const processSide = (
    attacks: Array<{ attacker: Card; target: AttackTarget }>,
    attackerPlayer: PlayerId
  ) => {
    const opponent = attackerPlayer === 'player1' ? 'player2' : 'player1'

    for (const { attacker, target } of attacks) {
      const isStunned = attacker.cardType === 'hero' && stunnedHeroes?.[attacker.id]
      const power = isStunned ? 0 : getAttackPower(attacker)

      if (power <= 0) continue

      if (target.type === 'unit' && target.targetId) {
        unitDamage[target.targetId] = (unitDamage[target.targetId] || 0) + power
        const targetUnit = (opponent === 'player1' ? p1Units : p2Units).find(u => u.id === target.targetId)
        combatLog.push({
          attackerId: attacker.id,
          attackerName: attacker.name,
          targetType: 'unit',
          targetId: target.targetId,
          targetName: targetUnit?.name || 'Unknown',
          damage: power,
          formationTag: getFormationTag(attacker),
        })
      } else {
        const towerKey = battlefieldId === 'battlefieldA'
          ? (opponent === 'player1' ? 'towerA_player1' : 'towerA_player2')
          : (opponent === 'player1' ? 'towerB_player1' : 'towerB_player2')

        towerDamage[towerKey] = (towerDamage[towerKey] || 0) + power
        combatLog.push({
          attackerId: attacker.id,
          attackerName: attacker.name,
          targetType: 'tower',
          damage: power,
          formationTag: getFormationTag(attacker),
        })
      }
    }
  }

  processSide(p1Attacks, 'player1')
  processSide(p2Attacks, 'player2')

  // Apply damage to units
  const applyDamageToUnits = (units: Card[]): Card[] => {
    return units.reduce<Card[]>((alive, unit) => {
      const dmg = unitDamage[unit.id] || 0
      if (dmg <= 0) {
        alive.push(unit)
        return alive
      }

      const tempHP = (unit.cardType === 'hero' || unit.cardType === 'generic') && 'temporaryHP' in unit
        ? ((unit as any).temporaryHP || 0)
        : 0
      const damageAfterTemp = Math.max(0, dmg - tempHP)
      const newHealth = Math.max(0, (unit as any).currentHealth - damageAfterTemp)
      const newTempHP = Math.max(0, tempHP - dmg)

      // Update kill status in combat log
      if (newHealth <= 0) {
        combatLog.forEach(entry => {
          if (entry.targetId === unit.id) entry.killed = true
        })
        return alive // unit is dead, don't add to alive list
      }

      const updated = { ...unit, currentHealth: newHealth } as any
      if (unit.cardType === 'hero' || unit.cardType === 'generic') {
        updated.temporaryHP = newTempHP
      }
      alive.push(updated)
      return alive
    }, [])
  }

  const updatedP1 = applyDamageToUnits(battlefield.player1)
  const updatedP2 = applyDamageToUnits(battlefield.player2)

  // Apply damage to towers
  for (const [towerKey, totalDmg] of Object.entries(towerDamage)) {
    const armor = towerArmor?.[towerKey as keyof TowerHP] || 0
    const dmgAfterArmor = Math.max(0, totalDmg - armor)
    const hpBefore = currentTowerHP[towerKey as keyof TowerHP]

    if (hpBefore <= 0) {
      // Tower already dead — all damage overflows to nexus
      const attacker = towerKey.includes('player1') ? 'player2' : 'player1'
      overflowDamage[attacker] += dmgAfterArmor
    } else {
      const newHP = Math.max(0, hpBefore - dmgAfterArmor)
      currentTowerHP[towerKey as keyof TowerHP] = newHP
      if (newHP === 0) {
        const overflow = Math.max(0, dmgAfterArmor - hpBefore)
        const attacker = towerKey.includes('player1') ? 'player2' : 'player1'
        overflowDamage[attacker] += overflow
      }
    }
  }

  return {
    updatedBattlefield: { player1: updatedP1, player2: updatedP2 },
    updatedTowerHP: currentTowerHP,
    overflowDamage,
    combatLog,
  }
}
