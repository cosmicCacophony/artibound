import { Hero, BattlefieldDefinition, BaseCard, Color } from './types'
import { allHeroes, allBattlefields } from './cardData'

// Default Heroes (used if player doesn't draft 4 heroes)
// Use first heroes from allHeroes as fallback (players should always draft 4, but this is a safety net)
export const defaultHeroes: {
  passable: Omit<Hero, 'location' | 'owner'>[]
  disappointing: Omit<Hero, 'location' | 'owner'>[]
} = {
  passable: allHeroes.slice(0, 2), // First 2 as passable
  disappointing: allHeroes.slice(2, 4), // Next 2 as disappointing
}

// Default Battlefield (used if player doesn't draft a battlefield)
export const defaultBattlefield: BattlefieldDefinition = {
  id: 'default-neutral-ground',
  name: 'Neutral Ground',
  description: 'A basic battlefield with no special properties',
  colors: [],
  staticAbility: 'No special ability',
  staticAbilityId: 'none',
}

// Draftable Heroes Pool
// Use all heroes from comprehensive data (excluding defaults which are used as fallback)
export const draftableHeroes: Omit<Hero, 'location' | 'owner'>[] = allHeroes.filter(
  hero => !hero.id.includes('default-')
)

// Helper to get all available heroes for draft (draftable + defaults for fallback)
export function getAllDraftHeroes(): Omit<Hero, 'location' | 'owner'>[] {
  return [...draftableHeroes, ...defaultHeroes.passable, ...defaultHeroes.disappointing]
}

// Helper to get all available battlefields for draft
export function getAllDraftBattlefields(): BattlefieldDefinition[] {
  return allBattlefields
}

