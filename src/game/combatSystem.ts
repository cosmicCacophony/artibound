import { Card, AttackTarget, Battlefield, PlayerId, GameState, GenericUnit, Hero, FormationTag, COMBAT_TOWER_DAMAGE } from './types'

/**
 * Multi-Round Autobattler Combat System
 *
 * Heroes sit in the backline as commanders, providing +1 attack per hero to lane units.
 * Units fight in simultaneous rounds until one side is eliminated.
 * The winning side deals flat 3 damage to the opposing tower.
 * If both sides are eliminated (tie), both towers take 3 damage.
 * After combat, if the losing side has no units, surviving units attack their hero once.
 *
 * Formation tags control targeting priority:
 *   - Frontline: attacks enemy frontline first, then lowest-health enemy
 *   - Default (no tag): must attack frontline first (frontline "guards"), then lowest-health
 *   - Ranged: targets non-frontline enemies first ("shoots over"), then any
 *   - Assassin: targets non-frontline enemies first (bypasses frontline to reach backline)
 */

const MAX_COMBAT_ROUNDS = 50

export interface CombatLogEntry {
  attackerId: string
  attackerName: string
  targetType: 'unit' | 'hero' | 'tower' | 'combat_win'
  targetId?: string
  targetName?: string
  damage: number
  killed?: boolean
  killedHero?: boolean
  formationTag?: FormationTag
  combatWinInfo?: {
    winningSide: PlayerId | 'tie'
    p1Survivors: number
    p2Survivors: number
    towerDamage: number
  }
}

export interface CombatRound {
  roundNumber: number
  phase: 'combat' | 'hero_attack' | 'outcome'
  entries: CombatLogEntry[]
}

export interface CombatOutcome {
  winner: PlayerId | 'tie' | 'empty'
  p1Survivors: number
  p2Survivors: number
  towerDamageDealt: number
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
 * Assassins now bypass frontline to target backline (no longer attack tower directly).
 */
function pickTarget(
  attacker: Card,
  enemyUnits: Card[],
): AttackTarget {
  const tag = getFormationTag(attacker)

  if (enemyUnits.length === 0) {
    return { type: 'unit' }
  }

  const enemyFrontline = enemyUnits.filter(u => getFormationTag(u) === 'frontline')
  const enemyNonFrontline = enemyUnits.filter(u => getFormationTag(u) !== 'frontline')

  // Assassins bypass frontline to target backline units
  if (tag === 'assassin') {
    if (enemyNonFrontline.length > 0) {
      const target = sortByLowestHealth(enemyNonFrontline)[0]
      return { type: 'unit', targetId: target.id }
    }
    const target = sortByLowestHealth(enemyUnits)[0]
    return { type: 'unit', targetId: target.id }
  }

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
 */
function computeAttacks(
  attackerUnits: Card[],
  enemyUnits: Card[],
): Array<{ attacker: Card; target: AttackTarget }> {
  const tagOrder: Array<FormationTag | undefined> = ['frontline', undefined, 'ranged', 'assassin']

  const sorted = [...attackerUnits].sort((a, b) => {
    const aIdx = tagOrder.indexOf(getFormationTag(a))
    const bIdx = tagOrder.indexOf(getFormationTag(b))
    return aIdx - bIdx
  })

  return sorted.map(attacker => ({
    attacker,
    target: pickTarget(attacker, enemyUnits),
  }))
}

type TowerHP = {
  towerA_player1: number
  towerA_player2: number
  towerB_player1: number
  towerB_player2: number
}

/**
 * Apply hero auras to lane units: each living hero provides +1 attack.
 */
function applyHeroAuras(heroes: Hero[], units: Card[]): Card[] {
  if (heroes.length === 0 || units.length === 0) return units
  const attackBonus = heroes.length
  return units.map(u => {
    if ('attack' in u && (u.cardType === 'generic' || u.cardType === 'signature' || u.cardType === 'hybrid')) {
      return {
        ...u,
        temporaryAttack: ((u as any).temporaryAttack || 0) + attackBonus,
      } as Card
    }
    return u
  })
}

/**
 * Apply damage from accumulated hits, remove dead units.
 */
function applyDamageToUnits(
  units: Card[],
  unitDamage: Record<string, number>,
  roundEntries: CombatLogEntry[],
): Card[] {
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

    if (newHealth <= 0) {
      roundEntries.forEach(entry => {
        if (entry.targetId === unit.id) {
          entry.killed = true
        }
      })
      return alive
    }

    const updated = { ...unit, currentHealth: newHealth } as any
    if (unit.cardType === 'hero' || unit.cardType === 'generic') {
      updated.temporaryHP = newTempHP
    }
    alive.push(updated)
    return alive
  }, [])
}

/**
 * Post-combat: surviving units attack the enemy hero once.
 * Returns updated heroes and the log entries.
 */
function attackEnemyHeroes(
  survivingUnits: Card[],
  enemyHeroes: Hero[],
): { updatedHeroes: Hero[]; entries: CombatLogEntry[] } {
  if (survivingUnits.length === 0 || enemyHeroes.length === 0) {
    return { updatedHeroes: enemyHeroes, entries: [] }
  }

  const entries: CombatLogEntry[] = []
  const heroDamage: Record<string, number> = {}

  for (const unit of survivingUnits) {
    const power = getAttackPower(unit)
    if (power <= 0) continue

    // All surviving units focus the first alive hero
    const targetHero = enemyHeroes.find(h => {
      const dmgSoFar = heroDamage[h.id] || 0
      return h.currentHealth - dmgSoFar > 0
    })
    if (!targetHero) break

    heroDamage[targetHero.id] = (heroDamage[targetHero.id] || 0) + power
    entries.push({
      attackerId: unit.id,
      attackerName: unit.name,
      targetType: 'hero',
      targetId: targetHero.id,
      targetName: targetHero.name,
      damage: power,
      formationTag: getFormationTag(unit),
    })
  }

  const updatedHeroes = enemyHeroes.map(hero => {
    const dmg = heroDamage[hero.id] || 0
    if (dmg <= 0) return hero
    const newHP = Math.max(0, hero.currentHealth - dmg)
    if (newHP <= 0) {
      entries.forEach(entry => {
        if (entry.targetId === hero.id) {
          entry.killed = true
          entry.killedHero = true
        }
      })
      return { ...hero, currentHealth: 0 }
    }
    return { ...hero, currentHealth: newHP }
  })

  return { updatedHeroes, entries }
}

/**
 * Resolve multi-round combat for a single lane.
 *
 * Heroes are separated as backline commanders (provide auras, can be attacked post-combat).
 * Units fight in simultaneous rounds until one side is eliminated.
 * Winning side deals flat 3 damage to the opposing tower.
 */
export function resolveSimultaneousCombat(
  battlefield: Battlefield,
  battlefieldId: 'battlefieldA' | 'battlefieldB',
  initialTowerHP: TowerHP,
  _stunnedHeroes?: Record<string, boolean>,
  towerArmor?: TowerHP,
  _gameState?: GameState
): {
  updatedBattlefield: Battlefield
  updatedTowerHP: TowerHP
  overflowDamage: { player1: number; player2: number }
  combatRounds: CombatRound[]
  outcome: CombatOutcome
} {
  const currentTowerHP = { ...initialTowerHP }
  const overflowDamage = { player1: 0, player2: 0 }
  const combatRounds: CombatRound[] = []

  // 1. Separate heroes (backline) from units (combatants)
  const p1Heroes = battlefield.player1.filter(u => u.cardType === 'hero' && 'currentHealth' in u) as Hero[]
  const p2Heroes = battlefield.player2.filter(u => u.cardType === 'hero' && 'currentHealth' in u) as Hero[]
  let p1Units: Card[] = battlefield.player1.filter(u => u.cardType !== 'hero' && 'currentHealth' in u)
  let p2Units: Card[] = battlefield.player2.filter(u => u.cardType !== 'hero' && 'currentHealth' in u)

  const p1HadUnits = p1Units.length > 0
  const p2HadUnits = p2Units.length > 0

  // 2. No units on either side: no combat
  if (!p1HadUnits && !p2HadUnits) {
    return {
      updatedBattlefield: {
        player1: [...p1Heroes],
        player2: [...p2Heroes],
      },
      updatedTowerHP: currentTowerHP,
      overflowDamage,
      combatRounds: [],
      outcome: { winner: 'empty', p1Survivors: 0, p2Survivors: 0, towerDamageDealt: 0 },
    }
  }

  // 3. Apply hero auras: each living hero gives +1 attack to all friendly units
  p1Units = applyHeroAuras(p1Heroes, p1Units)
  p2Units = applyHeroAuras(p2Heroes, p2Units)

  // 4. Multi-round combat loop
  let roundNumber = 0
  while (p1Units.length > 0 && p2Units.length > 0 && roundNumber < MAX_COMBAT_ROUNDS) {
    roundNumber++
    const roundEntries: CombatLogEntry[] = []
    const unitDamage: Record<string, number> = {}

    const p1Attacks = computeAttacks(p1Units, p2Units)
    const p2Attacks = computeAttacks(p2Units, p1Units)

    const processAttacks = (
      attacks: Array<{ attacker: Card; target: AttackTarget }>,
      enemyUnits: Card[],
    ) => {
      for (const { attacker, target } of attacks) {
        const power = getAttackPower(attacker)
        if (power <= 0) continue

        if (target.type === 'unit' && target.targetId) {
          unitDamage[target.targetId] = (unitDamage[target.targetId] || 0) + power
          const targetUnit = enemyUnits.find(u => u.id === target.targetId)
          roundEntries.push({
            attackerId: attacker.id,
            attackerName: attacker.name,
            targetType: 'unit',
            targetId: target.targetId,
            targetName: targetUnit?.name || 'Unknown',
            damage: power,
            formationTag: getFormationTag(attacker),
          })
        }
      }
    }

    processAttacks(p1Attacks, p2Units)
    processAttacks(p2Attacks, p1Units)

    // Safety: break if no damage dealt this round (prevent infinite loop)
    const totalDamage = Object.values(unitDamage).reduce((sum, d) => sum + d, 0)
    if (totalDamage === 0) break

    p1Units = applyDamageToUnits(p1Units, unitDamage, roundEntries)
    p2Units = applyDamageToUnits(p2Units, unitDamage, roundEntries)

    combatRounds.push({ roundNumber, phase: 'combat', entries: roundEntries })
  }

  // 5. Determine combat outcome
  const p1Survivors = p1Units.length
  const p2Survivors = p2Units.length
  let winner: PlayerId | 'tie' | 'empty'
  let towerDmg: number

  if (p1Survivors > 0 && p2Survivors === 0) {
    winner = 'player1'
    towerDmg = COMBAT_TOWER_DAMAGE
  } else if (p2Survivors > 0 && p1Survivors === 0) {
    winner = 'player2'
    towerDmg = COMBAT_TOWER_DAMAGE
  } else if (p1Survivors === 0 && p2Survivors === 0) {
    // Mutual destruction OR one side had no units to begin with
    if (p1HadUnits && p2HadUnits) {
      winner = 'tie'
      towerDmg = COMBAT_TOWER_DAMAGE
    } else if (p1HadUnits) {
      // P1 had units but P2 didn't -> P1 auto-wins but all P1 units somehow died? Shouldn't happen.
      winner = 'player1'
      towerDmg = COMBAT_TOWER_DAMAGE
    } else {
      winner = 'player2'
      towerDmg = COMBAT_TOWER_DAMAGE
    }
  } else {
    // Both still have units (safety break hit) - no decisive outcome
    winner = 'tie'
    towerDmg = 0
  }

  // 6. Post-combat hero attacks
  let updatedP1Heroes = [...p1Heroes]
  let updatedP2Heroes = [...p2Heroes]

  if (winner === 'player1' && p1Survivors > 0 && p2Heroes.length > 0) {
    const result = attackEnemyHeroes(p1Units, p2Heroes)
    updatedP2Heroes = result.updatedHeroes
    if (result.entries.length > 0) {
      combatRounds.push({
        roundNumber: combatRounds.length + 1,
        phase: 'hero_attack',
        entries: result.entries,
      })
    }
  } else if (winner === 'player2' && p2Survivors > 0 && p1Heroes.length > 0) {
    const result = attackEnemyHeroes(p2Units, p1Heroes)
    updatedP1Heroes = result.updatedHeroes
    if (result.entries.length > 0) {
      combatRounds.push({
        roundNumber: combatRounds.length + 1,
        phase: 'hero_attack',
        entries: result.entries,
      })
    }
  }

  // 7. Apply tower damage
  const towerDamage: Record<string, number> = {}
  if (winner === 'player1') {
    const towerKey = battlefieldId === 'battlefieldA' ? 'towerA_player2' : 'towerB_player2'
    towerDamage[towerKey] = towerDmg
  } else if (winner === 'player2') {
    const towerKey = battlefieldId === 'battlefieldA' ? 'towerA_player1' : 'towerB_player1'
    towerDamage[towerKey] = towerDmg
  } else if (winner === 'tie' && towerDmg > 0) {
    const p1TowerKey = battlefieldId === 'battlefieldA' ? 'towerA_player1' : 'towerB_player1'
    const p2TowerKey = battlefieldId === 'battlefieldA' ? 'towerA_player2' : 'towerB_player2'
    towerDamage[p1TowerKey] = towerDmg
    towerDamage[p2TowerKey] = towerDmg
  }

  for (const [towerKey, dmg] of Object.entries(towerDamage)) {
    const armor = towerArmor?.[towerKey as keyof TowerHP] || 0
    const dmgAfterArmor = Math.max(0, dmg - armor)
    const hpBefore = currentTowerHP[towerKey as keyof TowerHP]

    if (hpBefore <= 0) {
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

  // 8. Add outcome round to combat log
  const outcomeName = winner === 'tie'
    ? 'Mutual Destruction'
    : `${winner === 'player1' ? 'P1' : 'P2'} Victory`

  combatRounds.push({
    roundNumber: combatRounds.length + 1,
    phase: 'outcome',
    entries: [{
      attackerId: 'combat-outcome',
      attackerName: outcomeName,
      targetType: 'combat_win',
      damage: towerDmg,
      combatWinInfo: {
        winningSide: winner,
        p1Survivors,
        p2Survivors,
        towerDamage: towerDmg,
      },
    }],
  })

  // 9. Reconstruct battlefield: alive heroes + surviving units
  // Dead heroes (currentHealth <= 0) are excluded so processKilledHeroes detects them
  const aliveP1Heroes = updatedP1Heroes.filter(h => h.currentHealth > 0)
  const aliveP2Heroes = updatedP2Heroes.filter(h => h.currentHealth > 0)

  return {
    updatedBattlefield: {
      player1: [...aliveP1Heroes, ...p1Units],
      player2: [...aliveP2Heroes, ...p2Units],
    },
    updatedTowerHP: currentTowerHP,
    overflowDamage,
    combatRounds,
    outcome: {
      winner,
      p1Survivors,
      p2Survivors,
      towerDamageDealt: towerDmg,
    },
  }
}
