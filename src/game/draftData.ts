import { Hero, BattlefieldDefinition, BaseCard, Color } from './types'
import { allHeroes, allBattlefields } from './cardData'

// Default Heroes (used if player doesn't draft 4 heroes)
// Specific default heroes with defined abilities for each color
export const defaultHeroes: {
  passable: Omit<Hero, 'location' | 'owner'>[]
  disappointing: Omit<Hero, 'location' | 'owner'>[]
} = {
  passable: [
    // Blue Default Hero - 2 round cooldown, pay 1 to draw a card
    {
      id: 'default-blue-hero',
      name: 'Arcane Scholar',
      description: 'Default blue hero. Pay 1 mana to draw a card.',
      cardType: 'hero',
      colors: ['blue'],
      attack: 3,
      health: 8,
      maxHealth: 8,
      currentHealth: 8,
      supportEffect: 'Draw cards to maintain advantage',
      signatureCardId: undefined,
      equippedItems: [],
      ability: {
        name: 'Arcane Insight',
        description: 'Pay 1 mana to draw a card.',
        manaCost: 1,
        cooldown: 2,
        effectType: 'draw_card',
        effectValue: 1, // Draw 1 card
      },
    },
    // Black Default Hero - Add a B rune when it dies
    {
      id: 'default-black-hero',
      name: 'Dark Apprentice',
      description: 'Default black hero. When this hero dies, add a B rune to your rune pool.',
      cardType: 'hero',
      colors: ['black'],
      attack: 3,
      health: 8,
      maxHealth: 8,
      currentHealth: 8,
      supportEffect: 'Adds B rune on death',
      signatureCardId: undefined,
      equippedItems: [],
      // Note: Death effect handled in combat system - adds B rune when hero dies
    },
  ],
  disappointing: [
    // Red Default Hero - 3 round cooldown, deal 2 damage to all enemies in front/adjacent
    {
      id: 'default-red-hero',
      name: 'Fire Warrior',
      description: 'Default red hero. Deal 2 damage to all enemies in front and adjacent.',
      cardType: 'hero',
      colors: ['red'],
      attack: 4,
      health: 9,
      maxHealth: 9,
      currentHealth: 9,
      supportEffect: 'Burns enemies in front',
      signatureCardId: undefined,
      equippedItems: [],
      ability: {
        name: 'Flame Burst',
        description: 'Deal 2 damage to all enemies in front and adjacent.',
        manaCost: 1,
        cooldown: 3,
        effectType: 'damage_target',
        effectValue: 2, // 2 damage
      },
    },
    // White Default Hero - Give all units +0/+2
    {
      id: 'default-white-hero',
      name: 'Divine Protector',
      description: 'Default white hero. All your units gain +0/+2.',
      cardType: 'hero',
      colors: ['white'],
      attack: 3,
      health: 10,
      maxHealth: 10,
      currentHealth: 10,
      supportEffect: 'All your units gain +0/+2',
      signatureCardId: undefined,
      equippedItems: [],
      ability: {
        name: 'Divine Shield',
        description: 'All your units gain +0/+2.',
        manaCost: 1,
        cooldown: 2,
        effectType: 'buff_units',
        effectValue: 2, // +0/+2 (toughness only)
      },
    },
    // Green Default Hero - 2 round cooldown, create a 2/2 token
    {
      id: 'default-green-hero',
      name: 'Nature Caller',
      description: 'Default green hero. Create a 2/2 token.',
      cardType: 'hero',
      colors: ['green'],
      attack: 3,
      health: 9,
      maxHealth: 9,
      currentHealth: 9,
      supportEffect: 'Creates tokens',
      signatureCardId: undefined,
      equippedItems: [],
      ability: {
        name: 'Summon Beast',
        description: 'Create a 2/2 token.',
        manaCost: 1,
        cooldown: 2,
        effectType: 'create_unit',
        effectValue: 2, // 2/2 token (attack/health)
      },
    },
  ],
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

