import { Battlefield, Card, GenericUnit, Hero, PlayerId } from './types'

type CombatCard = Hero | GenericUnit

export interface CombatLogEntry {
  attackerId: string
  attackerName: string
  targetType: 'unit' | 'hero' | 'tower' | 'combat_win'
  targetId?: string
  targetName?: string
  damage: number
  killed?: boolean
  note?: string
}

export interface CombatRound {
  roundNumber: number
  phase: 'first_strike' | 'combat' | 'outcome'
  entries: CombatLogEntry[]
}

export interface CombatOutcome {
  winner: PlayerId | 'tie' | 'empty'
  p1Survivors: number
  p2Survivors: number
  towerDamageDealt: number
}

export interface ManualCombatResult {
  updatedBattlefield: Battlefield
  defeatedCards: { player1: CombatCard[]; player2: CombatCard[] }
  combatRounds: CombatRound[]
  outcome: CombatOutcome
  towerDamage: { player1: number; player2: number }
}

interface StrikeResult {
  source: CombatCard
  target: CombatCard
  actualDamage: number
  killed: boolean
  nextTarget: CombatCard | null
  overflowTowerDamage: number
}

function isCombatCard(card: Card): card is CombatCard {
  return card.cardType === 'hero' || card.cardType === 'generic'
}

function hasKeyword(card: CombatCard, keyword: 'firstStrike' | 'deathtouch' | 'trample' | 'vigilance'): boolean {
  return Boolean(card.keywords?.includes(keyword))
}

function getStatusValue(card: CombatCard, key: 'weak' | 'vulnerable' | 'strength'): number {
  return card.statusEffects?.[key] || 0
}

function getEffectiveAttack(card: CombatCard): number {
  const baseAttack = card.attack + (card.temporaryAttack || 0)
  return Math.max(0, baseAttack + getStatusValue(card, 'strength') - getStatusValue(card, 'weak'))
}

function getEffectiveHealth(card: CombatCard): number {
  return card.currentHealth + (card.temporaryHP || 0)
}

function applyDamage(target: CombatCard, rawDamage: number, source: CombatCard): StrikeResult {
  const vulnerableBonus = getStatusValue(target, 'vulnerable')
  const armor = target.armor || 0
  const damageAfterArmor = Math.max(0, rawDamage + vulnerableBonus - armor)
  const damageToHealth = Math.max(0, damageAfterArmor - (target.temporaryHP || 0))
  const nextTemporaryHP = Math.max(0, (target.temporaryHP || 0) - damageAfterArmor)
  const nextHealth = target.currentHealth - damageToHealth
  const lethalByDeathtouch = hasKeyword(source, 'deathtouch') && rawDamage > 0
  const killed = lethalByDeathtouch || nextHealth <= 0

  const remainingHealthBeforeHit = getEffectiveHealth(target)
  const overflowTowerDamage = hasKeyword(source, 'trample')
    ? Math.max(0, damageAfterArmor - remainingHealthBeforeHit)
    : 0

  return {
    source,
    target,
    actualDamage: damageAfterArmor,
    killed,
    nextTarget: killed
      ? null
      : {
          ...target,
          currentHealth: nextHealth,
          temporaryHP: nextTemporaryHP,
        },
    overflowTowerDamage,
  }
}

function createOutcomeRound(
  winner: PlayerId | 'tie' | 'empty',
  towerDamageDealt: number,
  p1Survivors: number,
  p2Survivors: number
): CombatRound {
  return {
    roundNumber: 3,
    phase: 'outcome',
    entries: [
      {
        attackerId: 'combat',
        attackerName: 'Combat',
        targetType: 'combat_win',
        damage: towerDamageDealt,
        note: `Winner: ${winner} | Survivors P1 ${p1Survivors} / P2 ${p2Survivors}`,
      },
    ],
  }
}

export function resolveManualCombat(args: {
  battlefield: Battlefield
  attackingPlayer: PlayerId
  declaredAttackers: string[]
  blockerAssignments: Record<string, string>
}): ManualCombatResult {
  const { battlefield, attackingPlayer, declaredAttackers, blockerAssignments } = args
  const defendingPlayer: PlayerId = attackingPlayer === 'player1' ? 'player2' : 'player1'
  const attackerSide = battlefield[attackingPlayer].filter(isCombatCard)
  const defenderSide = battlefield[defendingPlayer].filter(isCombatCard)
  const byId = new Map<string, CombatCard>([...attackerSide, ...defenderSide].map(card => [card.id, { ...card }]))
  const deadIds = new Set<string>()
  const towerDamage = { player1: 0, player2: 0 }
  const combatRounds: CombatRound[] = []
  const firstStrikeEntries: CombatLogEntry[] = []
  const combatEntries: CombatLogEntry[] = []

  const blockerByAttacker = Object.entries(blockerAssignments).reduce<Record<string, string>>((acc, [blockerId, attackerId]) => {
    acc[attackerId] = blockerId
    return acc
  }, {})

  for (const attackerId of declaredAttackers) {
    const attacker = byId.get(attackerId)
    if (!attacker || deadIds.has(attackerId)) {
      continue
    }

    const blockerId = blockerByAttacker[attackerId]
    const blocker = blockerId ? byId.get(blockerId) : null

    if (!blocker || deadIds.has(blocker.id)) {
      const damage = getEffectiveAttack(attacker)
      towerDamage[defendingPlayer] += damage
      combatEntries.push({
        attackerId: attacker.id,
        attackerName: attacker.name,
        targetType: 'tower',
        targetName: defendingPlayer === 'player1' ? 'Player 1 Tower' : 'Player 2 Tower',
        damage,
        note: 'Unblocked',
      })
      continue
    }

    let nextAttacker = attacker
    let nextBlocker = blocker
    let overflowDamage = 0
    const attackerHasFirstStrike = hasKeyword(nextAttacker, 'firstStrike')
    const blockerHasFirstStrike = hasKeyword(nextBlocker, 'firstStrike')

    if (attackerHasFirstStrike || blockerHasFirstStrike) {
      const attackerStrike = attackerHasFirstStrike ? applyDamage(nextBlocker, getEffectiveAttack(nextAttacker), nextAttacker) : null
      const blockerStrike = blockerHasFirstStrike ? applyDamage(nextAttacker, getEffectiveAttack(nextBlocker), nextBlocker) : null

      if (attackerStrike) {
        overflowDamage += attackerStrike.overflowTowerDamage
        firstStrikeEntries.push({
          attackerId: nextAttacker.id,
          attackerName: nextAttacker.name,
          targetType: nextBlocker.cardType === 'hero' ? 'hero' : 'unit',
          targetId: nextBlocker.id,
          targetName: nextBlocker.name,
          damage: attackerStrike.actualDamage,
          killed: attackerStrike.killed,
          note: 'First Strike',
        })
      }

      if (blockerStrike) {
        firstStrikeEntries.push({
          attackerId: nextBlocker.id,
          attackerName: nextBlocker.name,
          targetType: nextAttacker.cardType === 'hero' ? 'hero' : 'unit',
          targetId: nextAttacker.id,
          targetName: nextAttacker.name,
          damage: blockerStrike.actualDamage,
          killed: blockerStrike.killed,
          note: 'First Strike',
        })
      }

      if (attackerStrike?.killed) {
        deadIds.add(nextBlocker.id)
      } else if (attackerStrike?.nextTarget) {
        nextBlocker = attackerStrike.nextTarget
        byId.set(nextBlocker.id, nextBlocker)
      }

      if (blockerStrike?.killed) {
        deadIds.add(nextAttacker.id)
      } else if (blockerStrike?.nextTarget) {
        nextAttacker = blockerStrike.nextTarget
        byId.set(nextAttacker.id, nextAttacker)
      }
    }

    if (!deadIds.has(nextAttacker.id) && !deadIds.has(nextBlocker.id)) {
      const attackerStrike = !attackerHasFirstStrike ? applyDamage(nextBlocker, getEffectiveAttack(nextAttacker), nextAttacker) : null
      const blockerStrike = !blockerHasFirstStrike ? applyDamage(nextAttacker, getEffectiveAttack(nextBlocker), nextBlocker) : null

      if (attackerStrike) {
        overflowDamage += attackerStrike.overflowTowerDamage
        combatEntries.push({
          attackerId: nextAttacker.id,
          attackerName: nextAttacker.name,
          targetType: nextBlocker.cardType === 'hero' ? 'hero' : 'unit',
          targetId: nextBlocker.id,
          targetName: nextBlocker.name,
          damage: attackerStrike.actualDamage,
          killed: attackerStrike.killed,
        })
      }

      if (blockerStrike) {
        combatEntries.push({
          attackerId: nextBlocker.id,
          attackerName: nextBlocker.name,
          targetType: nextAttacker.cardType === 'hero' ? 'hero' : 'unit',
          targetId: nextAttacker.id,
          targetName: nextAttacker.name,
          damage: blockerStrike.actualDamage,
          killed: blockerStrike.killed,
        })
      }

      if (attackerStrike?.killed) {
        deadIds.add(nextBlocker.id)
      } else if (attackerStrike?.nextTarget) {
        nextBlocker = attackerStrike.nextTarget
        byId.set(nextBlocker.id, nextBlocker)
      }

      if (blockerStrike?.killed) {
        deadIds.add(nextAttacker.id)
      } else if (blockerStrike?.nextTarget) {
        nextAttacker = blockerStrike.nextTarget
        byId.set(nextAttacker.id, nextAttacker)
      }
    }

    if (overflowDamage > 0) {
      towerDamage[defendingPlayer] += overflowDamage
      combatEntries.push({
        attackerId: nextAttacker.id,
        attackerName: nextAttacker.name,
        targetType: 'tower',
        targetName: defendingPlayer === 'player1' ? 'Player 1 Tower' : 'Player 2 Tower',
        damage: overflowDamage,
        note: 'Trample',
      })
    }
  }

  if (firstStrikeEntries.length > 0) {
    combatRounds.push({ roundNumber: 1, phase: 'first_strike', entries: firstStrikeEntries })
  }
  if (combatEntries.length > 0) {
    combatRounds.push({ roundNumber: firstStrikeEntries.length > 0 ? 2 : 1, phase: 'combat', entries: combatEntries })
  }

  const updatedBattlefield: Battlefield = {
    player1: battlefield.player1
      .filter(card => !deadIds.has(card.id))
      .map(card => (isCombatCard(card) ? (byId.get(card.id) || card) : card)),
    player2: battlefield.player2
      .filter(card => !deadIds.has(card.id))
      .map(card => (isCombatCard(card) ? (byId.get(card.id) || card) : card)),
  }

  const defeatedCards = {
    player1: battlefield.player1.filter(isCombatCard).filter(card => deadIds.has(card.id)),
    player2: battlefield.player2.filter(isCombatCard).filter(card => deadIds.has(card.id)),
  }

  const p1Survivors = updatedBattlefield.player1.filter(isCombatCard).length
  const p2Survivors = updatedBattlefield.player2.filter(isCombatCard).length
  const towerDamageDealt = attackingPlayer === 'player1' ? towerDamage.player2 : towerDamage.player1
  const winner: PlayerId | 'tie' | 'empty' = towerDamageDealt > 0
    ? attackingPlayer
    : p1Survivors === p2Survivors
      ? 'tie'
      : p1Survivors > p2Survivors
        ? 'player1'
        : 'player2'

  combatRounds.push(createOutcomeRound(winner, towerDamageDealt, p1Survivors, p2Survivors))

  return {
    updatedBattlefield,
    defeatedCards,
    combatRounds,
    outcome: {
      winner,
      p1Survivors,
      p2Survivors,
      towerDamageDealt,
    },
    towerDamage,
  }
}
