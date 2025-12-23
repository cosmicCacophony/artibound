import { GameState, PlayerId, BaseCard, GenericUnit, Color, CardType } from './types'

/**
 * Evolve System - Handles diversity-based evolution mechanics
 * 
 * Evolve mechanics:
 * - Track colors and card types played each turn
 * - Check if units meet evolve thresholds
 * - Apply evolve bonuses when thresholds are met
 * - Reset tracking at end of turn
 * 
 * Inspired by Legends of Runeterra's evolution system
 */

/**
 * Track a card being played (updates diversity counters)
 */
export function trackCardPlayed(
  card: BaseCard,
  player: PlayerId,
  gameState: GameState
): GameState {
  const newState = { ...gameState }

  // Track colors
  if (card.colors && card.colors.length > 0) {
    const colorsPlayed = player === 'player1'
      ? newState.metadata.player1ColorsPlayedThisTurn
      : newState.metadata.player2ColorsPlayedThisTurn

    // Add unique colors
    const uniqueColors = new Set([...colorsPlayed, ...card.colors])
    
    if (player === 'player1') {
      newState.metadata.player1ColorsPlayedThisTurn = Array.from(uniqueColors)
    } else {
      newState.metadata.player2ColorsPlayedThisTurn = Array.from(uniqueColors)
    }
  }

  // Track card types
  const typesPlayed = player === 'player1'
    ? newState.metadata.player1CardTypesPlayedThisTurn
    : newState.metadata.player2CardTypesPlayedThisTurn

  if (!typesPlayed.includes(card.cardType)) {
    if (player === 'player1') {
      newState.metadata.player1CardTypesPlayedThisTurn = [...typesPlayed, card.cardType]
    } else {
      newState.metadata.player2CardTypesPlayedThisTurn = [...typesPlayed, card.cardType]
    }
  }

  return newState
}

/**
 * Check if a unit meets its evolve threshold
 */
export function meetsEvolveThreshold(
  unit: GenericUnit,
  player: PlayerId,
  gameState: GameState
): boolean {
  if (!unit.evolveThreshold) {
    return false
  }

  const colorsPlayed = player === 'player1'
    ? gameState.metadata.player1ColorsPlayedThisTurn
    : gameState.metadata.player2ColorsPlayedThisTurn

  return colorsPlayed.length >= unit.evolveThreshold
}

/**
 * Check evolve thresholds for all player's units and apply bonuses
 */
export function checkEvolveThresholds(
  player: PlayerId,
  gameState: GameState
): GameState {
  let newState = { ...gameState }

  // Get all player's units
  const playerBfA = player === 'player1' ? newState.battlefieldA.player1 : newState.battlefieldA.player2
  const playerBfB = player === 'player1' ? newState.battlefieldB.player1 : newState.battlefieldB.player2
  const playerDeployZone = player === 'player1' ? newState.player1DeployZone : newState.player2DeployZone

  const allUnits = [
    ...playerBfA,
    ...playerBfB,
    ...playerDeployZone,
  ].filter(card => card.cardType === 'generic') as GenericUnit[]

  // Check each unit
  for (const unit of allUnits) {
    if (unit.evolveThreshold && !unit.isEvolved && meetsEvolveThreshold(unit, player, newState)) {
      newState = applyEvolveBonuses(unit.id, newState)
    }
  }

  return newState
}

/**
 * Apply evolve bonuses to a unit
 */
export function applyEvolveBonuses(
  unitId: string,
  gameState: GameState
): GameState {
  const unit = findUnitInGame(unitId, gameState)
  if (!unit || !unit.evolveBonus || unit.isEvolved) {
    return gameState
  }

  const newState = { ...gameState }
  const updatedUnit = findUnitInGame(unitId, newState)
  
  if (updatedUnit && updatedUnit.evolveBonus) {
    // Apply stat bonuses
    if (updatedUnit.evolveBonus.attack) {
      updatedUnit.attack += updatedUnit.evolveBonus.attack
    }
    if (updatedUnit.evolveBonus.health) {
      updatedUnit.health += updatedUnit.evolveBonus.health
      updatedUnit.maxHealth += updatedUnit.evolveBonus.health
      updatedUnit.currentHealth += updatedUnit.evolveBonus.health
    }

    // Mark as evolved
    updatedUnit.isEvolved = true

    // Note: Ability bonuses (like cleave, taunt) would need to be handled
    // by the combat/ability system when checking for those keywords
  }

  return newState
}

/**
 * Reset diversity tracking at end of turn
 */
export function resetDiversityTracking(gameState: GameState): GameState {
  return {
    ...gameState,
    metadata: {
      ...gameState.metadata,
      player1ColorsPlayedThisTurn: [],
      player2ColorsPlayedThisTurn: [],
      player1CardTypesPlayedThisTurn: [],
      player2CardTypesPlayedThisTurn: [],
    },
  }
}

/**
 * Reset evolved status on all units (called at end of turn)
 */
export function resetEvolvedStatus(gameState: GameState): GameState {
  const newState = { ...gameState }

  // Reset all units in all locations
  const allLocations = [
    newState.player1DeployZone,
    newState.player2DeployZone,
    newState.battlefieldA.player1,
    newState.battlefieldA.player2,
    newState.battlefieldB.player1,
    newState.battlefieldB.player2,
  ]

  for (const location of allLocations) {
    for (const card of location) {
      if (card.cardType === 'generic') {
        const unit = card as GenericUnit
        if (unit.isEvolved) {
          unit.isEvolved = false
        }
      }
    }
  }

  return newState
}

/**
 * Get the number of unique colors played this turn
 */
export function getColorsPlayedCount(
  player: PlayerId,
  gameState: GameState
): number {
  const colorsPlayed = player === 'player1'
    ? gameState.metadata.player1ColorsPlayedThisTurn
    : gameState.metadata.player2ColorsPlayedThisTurn

  return colorsPlayed.length
}

/**
 * Get the number of unique card types played this turn
 */
export function getCardTypesPlayedCount(
  player: PlayerId,
  gameState: GameState
): number {
  const typesPlayed = player === 'player1'
    ? gameState.metadata.player1CardTypesPlayedThisTurn
    : gameState.metadata.player2CardTypesPlayedThisTurn

  return typesPlayed.length
}

/**
 * Check if a unit has evolved abilities (for combat/ability checks)
 */
export function hasEvolvedAbility(
  unit: GenericUnit,
  ability: string
): boolean {
  if (!unit.isEvolved || !unit.evolveBonus || !unit.evolveBonus.abilities) {
    return false
  }

  return unit.evolveBonus.abilities.some(a => 
    a.toLowerCase().includes(ability.toLowerCase())
  )
}

// Helper functions

function findUnitInGame(unitId: string, gameState: GameState): GenericUnit | null {
  // Search in all locations
  const allCards = [
    ...gameState.player1DeployZone,
    ...gameState.battlefieldA.player1,
    ...gameState.battlefieldB.player1,
    ...gameState.player2DeployZone,
    ...gameState.battlefieldA.player2,
    ...gameState.battlefieldB.player2,
  ]

  const unit = allCards.find(c => c.id === unitId)
  if (unit && unit.cardType === 'generic') {
    return unit as GenericUnit
  }

  return null
}

