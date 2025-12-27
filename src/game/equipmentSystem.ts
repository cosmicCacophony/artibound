import { ArtifactCard, GameState, PlayerId, GenericUnit, Hero } from './types'

/**
 * Equipment System - Handles equipment artifacts that can be attached to units
 * 
 * Equipment artifacts:
 * - Start in base like other artifacts
 * - Can be attached to units (heroes or generic units) for a mana cost
 * - Provide bonuses (attack, health, abilities) while attached
 * - Return to base when the unit dies
 * - Can be re-equipped to another unit for the equipCost
 */

/**
 * Check if an artifact is equipment
 */
export function isEquipment(artifact: ArtifactCard): boolean {
  return artifact.effectType === 'equipment'
}

/**
 * Check if equipment can be attached to a target unit
 */
export function canEquip(
  equipmentId: string,
  targetUnitId: string,
  gameState: GameState
): boolean {
  // Find the equipment
  const equipment = findArtifactInGame(equipmentId, gameState)
  if (!equipment || !isEquipment(equipment)) {
    return false
  }

  // Equipment must be in base (not already attached)
  if (equipment.attachedToUnitId) {
    return false
  }

  // Find the target unit
  const targetUnit = findUnitInGame(targetUnitId, gameState)
  if (!targetUnit) {
    return false
  }

  // Equipment and unit must have same owner
  if (equipment.owner !== targetUnit.owner) {
    return false
  }

  return true
}

/**
 * Attach equipment to a unit
 */
export function attachEquipment(
  equipmentId: string,
  targetUnitId: string,
  gameState: GameState
): GameState {
  if (!canEquip(equipmentId, targetUnitId, gameState)) {
    return gameState
  }

  const newState = { ...gameState }
  
  // Update equipment
  const equipment = findArtifactInBase(equipmentId, newState)
  if (equipment && isEquipment(equipment)) {
    equipment.attachedToUnitId = targetUnitId
  }

  // Update unit
  const unit = findUnitInGame(targetUnitId, newState)
  if (unit) {
    const attachedEquipment = unit.attachedEquipment || []
    unit.attachedEquipment = [...attachedEquipment, equipmentId]
  }

  return newState
}

/**
 * Detach equipment from a unit (returns equipment to base)
 */
export function detachEquipment(
  equipmentId: string,
  gameState: GameState
): GameState {
  const equipment = findArtifactInGame(equipmentId, gameState)
  if (!equipment || !isEquipment(equipment) || !equipment.attachedToUnitId) {
    return gameState
  }

  const newState = { ...gameState }
  const unitId = equipment.attachedToUnitId

  // Update equipment
  const updatedEquipment = findArtifactInBase(equipmentId, newState)
  if (updatedEquipment) {
    updatedEquipment.attachedToUnitId = undefined
  }

  // Update unit
  const unit = findUnitInGame(unitId, newState)
  if (unit && unit.attachedEquipment) {
    unit.attachedEquipment = unit.attachedEquipment.filter(id => id !== equipmentId)
  }

  return newState
}

/**
 * Return equipment to base when unit dies
 */
export function returnEquipmentToBase(
  equipmentId: string,
  gameState: GameState
): GameState {
  return detachEquipment(equipmentId, gameState)
}

/**
 * Return all equipment from a dead unit to base
 */
export function returnAllEquipmentFromUnit(
  unitId: string,
  gameState: GameState
): GameState {
  const unit = findUnitInGame(unitId, gameState)
  if (!unit || !unit.attachedEquipment || unit.attachedEquipment.length === 0) {
    return gameState
  }

  let newState = { ...gameState }
  
  // Detach all equipment
  for (const equipmentId of unit.attachedEquipment) {
    newState = detachEquipment(equipmentId, newState)
  }

  return newState
}

/**
 * Get all equipment bonuses for a unit
 */
export function getEquipmentBonuses(
  unitId: string,
  gameState: GameState
): { attack: number, health: number, maxHealth: number, abilities: string[] } {
  const unit = findUnitInGame(unitId, gameState)
  if (!unit || !unit.attachedEquipment || unit.attachedEquipment.length === 0) {
    return { attack: 0, health: 0, maxHealth: 0, abilities: [] }
  }

  let totalAttack = 0
  let totalHealth = 0
  let totalMaxHealth = 0
  const abilities: string[] = []

  for (const equipmentId of unit.attachedEquipment) {
    const equipment = findArtifactInBase(equipmentId, gameState)
    if (equipment && isEquipment(equipment) && equipment.equipmentBonuses) {
      totalAttack += equipment.equipmentBonuses.attack || 0
      totalHealth += equipment.equipmentBonuses.health || 0
      totalMaxHealth += equipment.equipmentBonuses.maxHealth || 0
      if (equipment.equipmentBonuses.abilities) {
        abilities.push(...equipment.equipmentBonuses.abilities)
      }
    }
  }

  return {
    attack: totalAttack,
    health: totalHealth,
    maxHealth: totalMaxHealth,
    abilities,
  }
}

/**
 * Calculate effective stats for a unit with equipment
 */
export function getEffectiveStatsWithEquipment(
  unit: GenericUnit | Hero,
  gameState: GameState
): { attack: number, health: number, maxHealth: number, abilities: string[] } {
  const bonuses = getEquipmentBonuses(unit.id, gameState)
  
  return {
    attack: unit.attack + bonuses.attack,
    health: unit.health + bonuses.health,
    maxHealth: unit.maxHealth + bonuses.maxHealth,
    abilities: bonuses.abilities,
  }
}

// Helper functions

function findArtifactInGame(artifactId: string, gameState: GameState): ArtifactCard | null {
  const p1Artifact = gameState.player1Base.find(c => c.id === artifactId && c.cardType === 'artifact')
  if (p1Artifact && p1Artifact.cardType === 'artifact') return p1Artifact as ArtifactCard

  const p2Artifact = gameState.player2Base.find(c => c.id === artifactId && c.cardType === 'artifact')
  if (p2Artifact && p2Artifact.cardType === 'artifact') return p2Artifact as ArtifactCard

  return null
}

function findArtifactInBase(artifactId: string, gameState: GameState): ArtifactCard | null {
  return findArtifactInGame(artifactId, gameState)
}

function findUnitInGame(unitId: string, gameState: GameState): (GenericUnit | Hero) | null {
  // Search in all locations
  const allCards = [
    ...gameState.player1Hand,
    ...gameState.player1Base,
    ...gameState.player1DeployZone,
    ...gameState.battlefieldA.player1,
    ...gameState.battlefieldB.player1,
    ...gameState.player2Hand,
    ...gameState.player2Base,
    ...gameState.player2DeployZone,
    ...gameState.battlefieldA.player2,
    ...gameState.battlefieldB.player2,
  ]

  const unit = allCards.find(c => c.id === unitId)
  if (unit && (unit.cardType === 'generic' || unit.cardType === 'hero')) {
    return unit as GenericUnit | Hero
  }

  return null
}



