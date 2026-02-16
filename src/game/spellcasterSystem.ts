import { GameState, PlayerId, SpellCard, Hero, Location, Card } from './types'
import { drawCards } from './effectResolver'

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
  gameState: GameState,
  castLocation?: Location
): GameState {
  let newState = { ...gameState }

  // Increment spell counter
  if (player === 'player1') {
    newState.metadata.player1SpellsCastThisTurn++
  } else {
    newState.metadata.player2SpellsCastThisTurn++
  }

  const spellsCastThisTurn = player === 'player1'
    ? newState.metadata.player1SpellsCastThisTurn
    : newState.metadata.player2SpellsCastThisTurn

  // Trigger hero abilities (on_spell_cast triggers)
  newState = triggerSpellcastHeroAbilities(player, newState)
  // Trigger unit spell-synergy effects used by RB slice cards.
  newState = triggerSpellcastUnitEffects(player, newState)

  return newState
}

function triggerSpellcastUnitEffects(player: PlayerId, gameState: GameState): GameState {
  let newState = { ...gameState }
  const spellsCast =
    player === 'player1' ? newState.metadata.player1SpellsCastThisTurn : newState.metadata.player2SpellsCastThisTurn
  const enemy = player === 'player1' ? 'player2' : 'player1'

  const applyToLane = (lane: 'battlefieldA' | 'battlefieldB') => {
    const units = newState[lane][player].filter(card => card.cardType === 'generic')
    let laneState = newState
    for (const unit of units) {
      const specialEffects = (unit as any).specialEffects as string[] | undefined
      if (!specialEffects || specialEffects.length === 0) continue

      // Spell Fencer: +1 attack this turn whenever you cast a spell.
      if (unit.id.startsWith('rb-unit-spell-fencer')) {
        laneState = {
          ...laneState,
          [lane]: {
            ...laneState[lane],
            [player]: laneState[lane][player].map(card =>
              card.id === unit.id ? { ...card, temporaryAttack: (card as any).temporaryAttack + 1 || 1 } : card
            ),
          },
        }
      }

      // Velocity Enforcer: on 2nd spell each turn, deal 2 to enemy tower in this lane.
      if (specialEffects.includes('multispell_tower_damage') && spellsCast >= 2) {
        const towerKey =
          lane === 'battlefieldA'
            ? (enemy === 'player1' ? 'towerA_player1_HP' : 'towerA_player2_HP')
            : (enemy === 'player1' ? 'towerB_player1_HP' : 'towerB_player2_HP')
        laneState = {
          ...laneState,
          metadata: {
            ...laneState.metadata,
            [towerKey]: Math.max(0, (laneState.metadata[towerKey] as number) - 2),
          },
        }
      }
    }
    newState = laneState
  }

  applyToLane('battlefieldA')
  applyToLane('battlefieldB')
  return newState
}

/**
 * Trigger hero abilities that activate on spell cast
 * Handles mana restoration and other on-cast effects
 */
function triggerSpellcastHeroAbilities(
  player: PlayerId,
  gameState: GameState,
  castLocation?: Location
): GameState {
  let newState = { ...gameState }
  
  // Get player's heroes
  const playerBase = player === 'player1' ? newState.player1Base : newState.player2Base
  const playerDeployZone = player === 'player1' ? newState.player1DeployZone : newState.player2DeployZone
  const playerBfA = player === 'player1' ? newState.battlefieldA.player1 : newState.battlefieldA.player2
  const playerBfB = player === 'player1' ? newState.battlefieldB.player1 : newState.battlefieldB.player2
  
  const lane = castLocation === 'battlefieldA' || castLocation === 'battlefieldB'
    ? castLocation
    : null
  const allHeroes = (
    lane === 'battlefieldA'
      ? playerBfA
      : lane === 'battlefieldB'
        ? playerBfB
        : [
            ...playerBase,
            ...playerDeployZone,
            ...playerBfA,
            ...playerBfB,
          ]
  ).filter(card => card.cardType === 'hero') as Hero[]

  // Check for spellcast triggers
  for (const hero of allHeroes) {
    if (hero.ability && hero.ability.trigger === 'on_spell_cast') {
      const heroTemplateId = getTemplateId(hero.id)
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

      if (heroTemplateId === 'red-hero-spell-slinger' && lane) {
        newState = applyHeroTemporaryAttack(newState, hero.id, 2)
      }

      if (heroTemplateId === 'red-hero-pyromancer' && lane) {
        const opponent: PlayerId = player === 'player1' ? 'player2' : 'player1'
        newState = applyLaneTowerDamage(newState, lane, opponent, 1)
      }

      // Other on-cast effects can be added here
      // (e.g., tower armor, card draw, etc.)
    }
  }

  return newState
}

function triggerSpellcastUnitAbilities(
  player: PlayerId,
  gameState: GameState,
  spellsCastThisTurn: number
): GameState {
  let newState = { ...gameState }
  const opponent: PlayerId = player === 'player1' ? 'player2' : 'player1'

  newState = applyUnitTemporaryAttackByTemplate(newState, player, 'rb-unit-spell-fencer', 1)

  const towerBurnerDamage = countUnitsInLane(newState, player, 'battlefieldA', 'red-unit-tower-burner')
  if (towerBurnerDamage > 0) {
    newState = applyLaneTowerDamage(newState, 'battlefieldA', opponent, towerBurnerDamage)
  }
  const towerBurnerDamageB = countUnitsInLane(newState, player, 'battlefieldB', 'red-unit-tower-burner')
  if (towerBurnerDamageB > 0) {
    newState = applyLaneTowerDamage(newState, 'battlefieldB', opponent, towerBurnerDamageB)
  }

  if (spellsCastThisTurn === 2) {
    const velocityDamageA = countUnitsInLane(newState, player, 'battlefieldA', 'rb-unit-velocity-enforcer') * 2
    if (velocityDamageA > 0) {
      newState = applyLaneTowerDamage(newState, 'battlefieldA', opponent, velocityDamageA)
    }
    const velocityDamageB = countUnitsInLane(newState, player, 'battlefieldB', 'rb-unit-velocity-enforcer') * 2
    if (velocityDamageB > 0) {
      newState = applyLaneTowerDamage(newState, 'battlefieldB', opponent, velocityDamageB)
    }
  }

  return newState
}

function applySpellConditionalEffects(
  player: PlayerId,
  spellTemplateId: string,
  spell: SpellCard,
  gameState: GameState,
  spellsCastThisTurn: number
): GameState {
  let newState = { ...gameState }
  const manaKey = player === 'player1' ? 'player1Mana' : 'player2Mana'

  if (spellsCastThisTurn >= 2) {
    if (spellTemplateId === 'rb-spell-double-strike' || spellTemplateId === 'black-spell-execute-weakness') {
      newState = drawCards(newState, player, 1)
    }
    if (spellTemplateId === 'rb-spell-spell-storm' && spell.refundMana) {
      newState = {
        ...newState,
        metadata: {
          ...newState.metadata,
          [manaKey]: (newState.metadata as any)[manaKey] + spell.refundMana,
        },
      }
    }
    if (spellTemplateId === 'red-spell-quickfire-bolt') {
      newState = {
        ...newState,
        metadata: {
          ...newState.metadata,
          [manaKey]: (newState.metadata as any)[manaKey] + 1,
        },
      }
    }
  }

  return newState
}

function applyHeroTemporaryAttack(
  state: GameState,
  heroId: string,
  bonusAttack: number
): GameState {
  const applyToCards = (cards: Card[]) =>
    cards.map(card =>
      card.cardType !== 'hero' || card.id !== heroId
        ? card
        : {
            ...card,
            temporaryAttack: (card.temporaryAttack || 0) + bonusAttack,
          }
    )

  return {
    ...state,
    player1Base: applyToCards(state.player1Base),
    player2Base: applyToCards(state.player2Base),
    player1DeployZone: applyToCards(state.player1DeployZone),
    player2DeployZone: applyToCards(state.player2DeployZone),
    battlefieldA: {
      player1: applyToCards(state.battlefieldA.player1),
      player2: applyToCards(state.battlefieldA.player2),
    },
    battlefieldB: {
      player1: applyToCards(state.battlefieldB.player1),
      player2: applyToCards(state.battlefieldB.player2),
    },
  }
}

function applyUnitTemporaryAttackByTemplate(
  state: GameState,
  owner: PlayerId,
  templateId: string,
  bonusAttack: number
): GameState {
  const applyToCards = (cards: Card[]) =>
    cards.map(card =>
      card.owner === owner &&
      card.cardType === 'generic' &&
      getTemplateId(card.id) === templateId
        ? {
            ...card,
            temporaryAttack: (card.temporaryAttack || 0) + bonusAttack,
          }
        : card
    )

  return {
    ...state,
    battlefieldA: {
      player1: applyToCards(state.battlefieldA.player1),
      player2: applyToCards(state.battlefieldA.player2),
    },
    battlefieldB: {
      player1: applyToCards(state.battlefieldB.player1),
      player2: applyToCards(state.battlefieldB.player2),
    },
  }
}

function countUnitsInLane(
  state: GameState,
  owner: PlayerId,
  lane: 'battlefieldA' | 'battlefieldB',
  templateId: string
): number {
  const cards = state[lane][owner]
  return cards.filter(card => card.cardType === 'generic' && getTemplateId(card.id) === templateId).length
}

function applyLaneTowerDamage(
  state: GameState,
  battlefieldId: 'battlefieldA' | 'battlefieldB',
  owner: PlayerId,
  damage: number
): GameState {
  const towerKey = battlefieldId === 'battlefieldA'
    ? (owner === 'player1' ? 'towerA_player1_HP' : 'towerA_player2_HP')
    : (owner === 'player1' ? 'towerB_player1_HP' : 'towerB_player2_HP')

  return {
    ...state,
    metadata: {
      ...state.metadata,
      [towerKey]: Math.max(0, (state.metadata as any)[towerKey] - damage),
    },
  }
}

const getTemplateId = (cardId: string): string => {
  const ownerIndex = cardId.indexOf('-player1-')
  if (ownerIndex !== -1) {
    return cardId.slice(0, ownerIndex)
  }
  const ownerIndex2 = cardId.indexOf('-player2-')
  if (ownerIndex2 !== -1) {
    return cardId.slice(0, ownerIndex2)
  }
  return cardId
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




