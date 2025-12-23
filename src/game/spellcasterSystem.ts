import { GameState, PlayerId, SpellCard, Hero } from './types'

/**
 * Spellcaster System - Handles spell synergies (cost reduction, mana restore, damage bonuses)
 * 
 * Spellcaster mechanics:
 * - Track spells cast each turn
 * - Trigger hero abilities when spells are cast
 * - Apply spell cost reductions from heroes
 * - Apply spell damage bonuses from heroes/artifacts
 * - Reset counters at end of turn
 */

/**
 * Called when a player casts a spell
 * Increments spell counter and triggers hero abilities
 */
export function onSpellCast(
  player: PlayerId,
  spell: SpellCard,
  gameState: GameState
): GameState {
  const newState = { ...gameState }

  // Increment spell counter
  if (player === 'player1') {
    newState.metadata.player1SpellsCastThisTurn++
  } else {
    newState.metadata.player2SpellsCastThisTurn++
  }

  // Trigger hero abilities (on_spell_cast triggers)
  newState = triggerSpellcastHeroAbilities(player, newState)

  return newState
}

/**
 * Trigger hero abilities that activate on spell cast
 * Handles mana restoration and other on-cast effects
 */
function triggerSpellcastHeroAbilities(
  player: PlayerId,
  gameState: GameState
): GameState {
  const newState = { ...gameState }
  
  // Get player's heroes
  const playerBase = player === 'player1' ? newState.player1Base : newState.player2Base
  const playerDeployZone = player === 'player1' ? newState.player1DeployZone : newState.player2DeployZone
  const playerBfA = player === 'player1' ? newState.battlefieldA.player1 : newState.battlefieldA.player2
  const playerBfB = player === 'player1' ? newState.battlefieldB.player1 : newState.battlefieldB.player2
  
  const allHeroes = [
    ...playerBase,
    ...playerDeployZone,
    ...playerBfA,
    ...playerBfB,
  ].filter(card => card.cardType === 'hero') as Hero[]

  // Check for spellcast triggers
  for (const hero of allHeroes) {
    if (hero.ability && hero.ability.trigger === 'on_spell_cast') {
      // Mana restoration (once per turn)
      if (hero.ability.manaRestore) {
        const spellsCast = player === 'player1' 
          ? newState.metadata.player1SpellsCastThisTurn
          : newState.metadata.player2SpellsCastThisTurn
        
        // Only restore on first spell
        if (spellsCast === 1) {
          if (player === 'player1') {
            newState.metadata.player1Mana = Math.min(
              newState.metadata.player1Mana + hero.ability.manaRestore,
              newState.metadata.player1MaxMana
            )
          } else {
            newState.metadata.player2Mana = Math.min(
              newState.metadata.player2Mana + hero.ability.manaRestore,
              newState.metadata.player2MaxMana
            )
          }
        }
      }

      // Other on-cast effects can be added here
      // (e.g., tower armor, card draw, etc.)
    }
  }

  return newState
}

/**
 * Get the total spell cost reduction for a player
 * Looks at all heroes with spell cost reduction abilities
 */
export function getSpellCostModifier(
  player: PlayerId,
  gameState: GameState
): number {
  // Get player's heroes
  const playerBase = player === 'player1' ? gameState.player1Base : gameState.player2Base
  const playerDeployZone = player === 'player1' ? gameState.player1DeployZone : gameState.player2DeployZone
  const playerBfA = player === 'player1' ? gameState.battlefieldA.player1 : gameState.battlefieldA.player2
  const playerBfB = player === 'player1' ? gameState.battlefieldB.player1 : gameState.battlefieldB.player2
  
  const allHeroes = [
    ...playerBase,
    ...playerDeployZone,
    ...playerBfA,
    ...playerBfB,
  ].filter(card => card.cardType === 'hero') as Hero[]

  let totalReduction = 0

  // Sum up spell cost reductions
  for (const hero of allHeroes) {
    if (hero.ability && hero.ability.spellCostReduction) {
      totalReduction += hero.ability.spellCostReduction
    }
  }

  return totalReduction
}

/**
 * Get the total spell damage bonus for a player
 * Looks at heroes and artifacts with spell damage bonuses
 */
export function getSpellDamageBonus(
  player: PlayerId,
  gameState: GameState
): number {
  // Get player's heroes
  const playerBase = player === 'player1' ? gameState.player1Base : gameState.player2Base
  const playerDeployZone = player === 'player1' ? gameState.player1DeployZone : gameState.player2DeployZone
  const playerBfA = player === 'player1' ? gameState.battlefieldA.player1 : gameState.battlefieldA.player2
  const playerBfB = player === 'player1' ? gameState.battlefieldB.player1 : gameState.battlefieldB.player2
  
  const allHeroes = [
    ...playerBase,
    ...playerDeployZone,
    ...playerBfA,
    ...playerBfB,
  ].filter(card => card.cardType === 'hero') as Hero[]

  let totalBonus = 0

  // Sum up spell damage bonuses from heroes
  for (const hero of allHeroes) {
    if (hero.ability && hero.ability.spellDamageBonus) {
      totalBonus += hero.ability.spellDamageBonus
    }
  }

  // Note: Artifact spell_amplifier effects are handled by the existing artifactSystem.ts
  // This function is specifically for hero-based bonuses

  return totalBonus
}

/**
 * Calculate effective spell cost after reductions
 */
export function getEffectiveSpellCost(
  spell: SpellCard,
  player: PlayerId,
  gameState: GameState
): number {
  const baseCost = spell.manaCost || 0
  const reduction = getSpellCostModifier(player, gameState)
  
  // Spell cost can't go below 0
  return Math.max(0, baseCost - reduction)
}

/**
 * Reset spell counters at end of turn
 */
export function resetSpellCounters(gameState: GameState): GameState {
  return {
    ...gameState,
    metadata: {
      ...gameState.metadata,
      player1SpellsCastThisTurn: 0,
      player2SpellsCastThisTurn: 0,
    },
  }
}

/**
 * Get the number of spells a player has cast this turn
 */
export function getSpellsCastThisTurn(
  player: PlayerId,
  gameState: GameState
): number {
  return player === 'player1'
    ? gameState.metadata.player1SpellsCastThisTurn
    : gameState.metadata.player2SpellsCastThisTurn
}

