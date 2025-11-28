/**
 * Card Storage System
 * 
 * Allows editing cards and persisting changes to localStorage.
 * Changes persist across app restarts.
 */

import { Hero, BaseCard, GenericUnit, SpellCard, BattlefieldDefinition } from './types'
import { allHeroes, allCards, allSpells, allBattlefields } from './comprehensiveCardData'

const STORAGE_KEY_CARDS = 'artibound_edited_cards'
const STORAGE_KEY_HEROES = 'artibound_edited_heroes'
const STORAGE_KEY_SPELLS = 'artibound_edited_spells'
const STORAGE_KEY_BATTLEFIELDS = 'artibound_edited_battlefields'

/**
 * Get all cards with localStorage overrides applied
 */
export function getCardsWithOverrides(): Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] {
  const defaultCards = allCards
  const overrides = getCardOverrides()
  
  return defaultCards.map(card => {
    const override = overrides[card.id]
    return override ? { ...card, ...override } : card
  })
}

/**
 * Get all heroes with localStorage overrides applied
 */
export function getHeroesWithOverrides(): Omit<Hero, 'location' | 'owner'>[] {
  const defaultHeroes = allHeroes
  const overrides = getHeroOverrides()
  
  return defaultHeroes.map(hero => {
    const override = overrides[hero.id]
    return override ? { ...hero, ...override } : hero
  })
}

/**
 * Get all spells with localStorage overrides applied
 */
export function getSpellsWithOverrides(): Omit<SpellCard, 'location' | 'owner'>[] {
  const defaultSpells = allSpells
  const overrides = getSpellOverrides()
  
  return defaultSpells.map(spell => {
    const override = overrides[spell.id]
    return override ? { ...spell, ...override } : spell
  })
}

/**
 * Get all battlefields with localStorage overrides applied
 */
export function getBattlefieldsWithOverrides(): BattlefieldDefinition[] {
  const defaultBattlefields = allBattlefields
  const overrides = getBattlefieldOverrides()
  
  return defaultBattlefields.map(battlefield => {
    const override = overrides[battlefield.id]
    return override ? { ...battlefield, ...override } : battlefield
  })
}

/**
 * Update a card and save to localStorage
 */
export function updateCard(cardId: string, updates: Partial<Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>>): void {
  const overrides = getCardOverrides()
  overrides[cardId] = { ...overrides[cardId], ...updates }
  saveCardOverrides(overrides)
}

/**
 * Update a hero and save to localStorage
 */
export function updateHero(heroId: string, updates: Partial<Omit<Hero, 'location' | 'owner'>>): void {
  const overrides = getHeroOverrides()
  overrides[heroId] = { ...overrides[heroId], ...updates }
  saveHeroOverrides(overrides)
}

/**
 * Update a spell and save to localStorage
 */
export function updateSpell(spellId: string, updates: Partial<Omit<SpellCard, 'location' | 'owner'>>): void {
  const overrides = getSpellOverrides()
  overrides[spellId] = { ...overrides[spellId], ...updates }
  saveSpellOverrides(overrides)
}

/**
 * Update a battlefield and save to localStorage
 */
export function updateBattlefield(battlefieldId: string, updates: Partial<BattlefieldDefinition>): void {
  const overrides = getBattlefieldOverrides()
  overrides[battlefieldId] = { ...overrides[battlefieldId], ...updates }
  saveBattlefieldOverrides(overrides)
}

/**
 * Reset a card to its default value (remove from localStorage)
 */
export function resetCard(cardId: string): void {
  const overrides = getCardOverrides()
  delete overrides[cardId]
  saveCardOverrides(overrides)
}

/**
 * Reset a hero to its default value
 */
export function resetHero(heroId: string): void {
  const overrides = getHeroOverrides()
  delete overrides[heroId]
  saveHeroOverrides(overrides)
}

/**
 * Reset a spell to its default value
 */
export function resetSpell(spellId: string): void {
  const overrides = getSpellOverrides()
  delete overrides[spellId]
  saveSpellOverrides(overrides)
}

/**
 * Reset a battlefield to its default value
 */
export function resetBattlefield(battlefieldId: string): void {
  const overrides = getBattlefieldOverrides()
  delete overrides[battlefieldId]
  saveBattlefieldOverrides(overrides)
}

/**
 * Clear all card overrides (reset everything to defaults)
 */
export function clearAllOverrides(): void {
  localStorage.removeItem(STORAGE_KEY_CARDS)
  localStorage.removeItem(STORAGE_KEY_HEROES)
  localStorage.removeItem(STORAGE_KEY_SPELLS)
  localStorage.removeItem(STORAGE_KEY_BATTLEFIELDS)
}

// Internal helper functions

function getCardOverrides(): Record<string, Partial<Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>>> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CARDS)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveCardOverrides(overrides: Record<string, Partial<Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>>>): void {
  try {
    localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(overrides))
  } catch (error) {
    console.error('Failed to save card overrides:', error)
  }
}

function getHeroOverrides(): Record<string, Partial<Omit<Hero, 'location' | 'owner'>>> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_HEROES)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveHeroOverrides(overrides: Record<string, Partial<Omit<Hero, 'location' | 'owner'>>>): void {
  try {
    localStorage.setItem(STORAGE_KEY_HEROES, JSON.stringify(overrides))
  } catch (error) {
    console.error('Failed to save hero overrides:', error)
  }
}

function getSpellOverrides(): Record<string, Partial<Omit<SpellCard, 'location' | 'owner'>>> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_SPELLS)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveSpellOverrides(overrides: Record<string, Partial<Omit<SpellCard, 'location' | 'owner'>>>): void {
  try {
    localStorage.setItem(STORAGE_KEY_SPELLS, JSON.stringify(overrides))
  } catch (error) {
    console.error('Failed to save spell overrides:', error)
  }
}

function getBattlefieldOverrides(): Record<string, Partial<BattlefieldDefinition>> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_BATTLEFIELDS)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveBattlefieldOverrides(overrides: Record<string, Partial<BattlefieldDefinition>>): void {
  try {
    localStorage.setItem(STORAGE_KEY_BATTLEFIELDS, JSON.stringify(overrides))
  } catch (error) {
    console.error('Failed to save battlefield overrides:', error)
  }
}


