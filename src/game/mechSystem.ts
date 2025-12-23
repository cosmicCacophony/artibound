import { GameState, PlayerId, GenericUnit, Hero, Card, Battlefield } from './types'

/**
 * Mech Tribal System
 * 
 * Handles mech tribal synergies where mechs provide mutual bonuses
 * Inspired by Riftbound mech mechanics
 * 
 * Key Features:
 * - Stat bonuses (+X/+X for each mech)
 * - Keyword grants (Shield, Overwhelm, Taunt)
 * - Cost reduction for other mechs
 * - ETB effects when played with other mechs
 */

/**
 * Check if a card is a mech
 */
export function isMech(card: Card): boolean {
  return card.cardType === 'generic' && 'isMech' in card && card.isMech === true
}

/**
 * Count mechs in a specific battlefield for a player
 */
export function countMechsInBattlefield(
  battlefield: Battlefield,
  player: PlayerId
): number {
  return battlefield[player].filter(card => isMech(card)).length
}

/**
 * Count total mechs across both battlefields for a player
 */
export function countTotalMechs(
  gameState: GameState,
  player: PlayerId
): number {
  const mechsInA = countMechsInBattlefield(gameState.battlefieldA, player)
  const mechsInB = countMechsInBattlefield(gameState.battlefieldB, player)
  return mechsInA + mechsInB
}

/**
 * Get all mech bonuses for a specific mech in a battlefield
 * Returns aggregated bonuses from all OTHER mechs (not including itself)
 */
export function getMechBonuses(
  mechId: string,
  battlefield: Battlefield,
  player: PlayerId
): {
  attackBonus: number
  healthBonus: number
  keywords: string[]
} {
  const mechs = battlefield[player].filter(card => 
    isMech(card) && card.id !== mechId
  )

  let totalAttackBonus = 0
  let totalHealthBonus = 0
  const keywords = new Set<string>()

  for (const mech of mechs) {
    if (mech.cardType === 'generic' && mech.mechSynergy) {
      if (mech.mechSynergy.attackBonus) {
        totalAttackBonus += mech.mechSynergy.attackBonus
      }
      if (mech.mechSynergy.healthBonus) {
        totalHealthBonus += mech.mechSynergy.healthBonus
      }
      if (mech.mechSynergy.grantKeyword) {
        keywords.add(mech.mechSynergy.grantKeyword)
      }
    }
  }

  return {
    attackBonus: totalAttackBonus,
    healthBonus: totalHealthBonus,
    keywords: Array.from(keywords)
  }
}

/**
 * Get mech cost reduction for a player
 * Aggregates cost reduction from all mechs across both battlefields
 */
export function getMechCostReduction(
  gameState: GameState,
  player: PlayerId
): number {
  let totalReduction = 0

  // Check both battlefields
  const allMechs = [
    ...gameState.battlefieldA[player],
    ...gameState.battlefieldB[player]
  ].filter(card => isMech(card))

  for (const mech of allMechs) {
    if (mech.cardType === 'generic' && mech.mechSynergy?.costReduction) {
      totalReduction += mech.mechSynergy.costReduction
    }
  }

  return totalReduction
}

/**
 * Calculate effective stats for a mech with all synergy bonuses applied
 */
export function getEffectiveStatsWithMechBonuses(
  unit: GenericUnit,
  battlefield: Battlefield,
  player: PlayerId
): { attack: number, health: number, maxHealth: number, keywords: string[] } {
  // Base stats
  let attack = unit.attack
  let health = unit.currentHealth
  let maxHealth = unit.maxHealth

  // Apply temporary bonuses (from other game effects)
  if (unit.temporaryAttack) {
    attack += unit.temporaryAttack
  }
  if (unit.temporaryHP) {
    health += unit.temporaryHP
  }

  // If not a mech, return base stats
  if (!unit.isMech) {
    return { attack, health, maxHealth, keywords: [] }
  }

  // Get mech bonuses
  const mechBonuses = getMechBonuses(unit.id, battlefield, player)

  // Apply mech bonuses
  attack += mechBonuses.attackBonus
  health += mechBonuses.healthBonus
  maxHealth += mechBonuses.healthBonus

  return {
    attack,
    health,
    maxHealth,
    keywords: mechBonuses.keywords
  }
}

/**
 * Check if a mech has a specific keyword from mech synergies
 */
export function mechHasKeyword(
  mechId: string,
  keyword: string,
  battlefield: Battlefield,
  player: PlayerId
): boolean {
  const bonuses = getMechBonuses(mechId, battlefield, player)
  return bonuses.keywords.includes(keyword)
}

/**
 * Get ETB effects that should trigger when a mech is played
 * Returns array of effects based on how many other mechs are in play
 */
export function getMechETBEffects(
  gameState: GameState,
  player: PlayerId,
  battlefieldId: 'battlefieldA' | 'battlefieldB'
): string[] {
  const battlefield = gameState[battlefieldId]
  const mechCount = countMechsInBattlefield(battlefield, player)
  
  // Only trigger ETB effects if there are other mechs already in play
  if (mechCount === 0) {
    return []
  }

  const effects: string[] = []
  const mechs = battlefield[player].filter(card => isMech(card))

  for (const mech of mechs) {
    if (mech.cardType === 'generic' && mech.mechSynergy?.etbEffect) {
      effects.push(mech.mechSynergy.etbEffect)
    }
  }

  return effects
}

/**
 * Apply mech bonuses to attack power calculation
 * Used during combat to calculate effective attack
 */
export function getAttackPowerWithMechBonus(
  unit: Card,
  battlefield: Battlefield,
  player: PlayerId
): number {
  let baseAttack = 0
  
  if ('attack' in unit) {
    baseAttack = unit.attack
  }

  // Add temporary attack bonus
  if ((unit.cardType === 'hero' || unit.cardType === 'generic') && 'temporaryAttack' in unit) {
    baseAttack += unit.temporaryAttack || 0
  }

  // If not a mech, return base attack
  if (!isMech(unit)) {
    return baseAttack
  }

  // Get mech attack bonuses
  const mechBonuses = getMechBonuses(unit.id, battlefield, player)
  return baseAttack + mechBonuses.attackBonus
}

/**
 * Apply mech bonuses to health calculation
 * Used during combat to calculate effective health
 */
export function getHealthWithMechBonus(
  unit: Card,
  battlefield: Battlefield,
  player: PlayerId
): { currentHealth: number, maxHealth: number } {
  let currentHealth = 0
  let maxHealth = 0

  if ('currentHealth' in unit && 'maxHealth' in unit) {
    currentHealth = unit.currentHealth
    maxHealth = unit.maxHealth
  }

  // Add temporary HP bonus
  if ((unit.cardType === 'hero' || unit.cardType === 'generic') && 'temporaryHP' in unit) {
    currentHealth += unit.temporaryHP || 0
  }

  // If not a mech, return base health
  if (!isMech(unit)) {
    return { currentHealth, maxHealth }
  }

  // Get mech health bonuses
  const mechBonuses = getMechBonuses(unit.id, battlefield, player)
  return {
    currentHealth: currentHealth + mechBonuses.healthBonus,
    maxHealth: maxHealth + mechBonuses.healthBonus
  }
}

/**
 * Get effective mana cost for a card with mech cost reduction
 * Only applies to mech cards
 */
export function getEffectiveMechCost(
  card: Card,
  gameState: GameState,
  player: PlayerId
): number {
  const baseCost = 'manaCost' in card ? (card.manaCost || 0) : 0
  
  // Only apply reduction if card is a mech
  if (!isMech(card)) {
    return baseCost
  }
  
  const reduction = getMechCostReduction(gameState, player)
  
  // Mech cost can't go below 0
  return Math.max(0, baseCost - reduction)
}

