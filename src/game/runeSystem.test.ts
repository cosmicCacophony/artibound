import { describe, it, expect } from 'vitest'
import {
  createRunePool,
  addRunesFromHero,
  removeRunesFromHero,
  canAffordCard,
  consumeRunesForCard,
  getMissingRunes,
  getAvailableRunesByColor,
  getAvailableRuneCount,
  addTemporaryRunes,
} from './runeSystem'
import { Hero, RunePool, BaseCard } from './types'

function createMockHero(colors: ('red' | 'blue' | 'white' | 'black' | 'green')[]): Hero {
  return {
    id: 'test-hero',
    name: 'Test Hero',
    description: 'A test hero',
    cardType: 'hero',
    colors,
    attack: 5,
    health: 10,
    maxHealth: 10,
    currentHealth: 10,
    location: 'base',
    owner: 'player1',
    equippedItems: [],
  }
}

function createMockSpell(
  colors: ('red' | 'blue' | 'white' | 'black' | 'green')[],
  manaCost: number,
): BaseCard {
  return {
    id: 'test-spell',
    name: 'Test Spell',
    description: 'A test spell',
    cardType: 'spell',
    colors,
    manaCost,
  }
}

function createMockGenericUnit(
  colors: ('red' | 'blue' | 'white' | 'black' | 'green')[],
  manaCost: number
): BaseCard {
  return {
    id: 'test-unit',
    name: 'Test Unit',
    description: 'A test unit',
    cardType: 'generic',
    colors,
    manaCost,
  }
}

describe('Rune System', () => {
  describe('createRunePool', () => {
    it('creates empty pool from no heroes', () => {
      const pool = createRunePool([])
      expect(pool.runes).toEqual([])
    })

    it('creates pool with single color hero', () => {
      const hero = createMockHero(['blue'])
      const pool = createRunePool([hero])
      expect(pool.runes).toEqual(['blue'])
    })

    it('creates pool with dual color hero', () => {
      const hero = createMockHero(['blue', 'black'])
      const pool = createRunePool([hero])
      expect(pool.runes).toContain('blue')
      expect(pool.runes).toContain('black')
      expect(pool.runes.length).toBe(2)
    })

    it('creates pool with triple color hero', () => {
      const hero = createMockHero(['blue', 'black', 'green'])
      const pool = createRunePool([hero])
      expect(pool.runes).toContain('blue')
      expect(pool.runes).toContain('black')
      expect(pool.runes).toContain('green')
      expect(pool.runes.length).toBe(3)
    })

    it('creates pool from multiple heroes', () => {
      const hero1 = createMockHero(['blue', 'black'])
      const hero2 = createMockHero(['green'])
      const pool = createRunePool([hero1, hero2])
      expect(pool.runes).toContain('blue')
      expect(pool.runes).toContain('black')
      expect(pool.runes).toContain('green')
      expect(pool.runes.length).toBe(3)
    })
  })

  describe('addRunesFromHero', () => {
    it('adds runes from hero to existing pool', () => {
      const initialPool: RunePool = { runes: ['blue'], temporaryRunes: [] }
      const hero = createMockHero(['black', 'green'])
      const newPool = addRunesFromHero(hero, initialPool)
      
      expect(newPool.runes).toContain('blue')
      expect(newPool.runes).toContain('black')
      expect(newPool.runes).toContain('green')
      expect(newPool.runes.length).toBe(3)
    })
  })

  describe('removeRunesFromHero', () => {
    it('removes runes from pool when hero is removed', () => {
      const pool: RunePool = { runes: ['blue', 'black', 'green'], temporaryRunes: [] }
      const hero = createMockHero(['black'])
      const newPool = removeRunesFromHero(hero, pool)
      
      expect(newPool.runes).toContain('blue')
      expect(newPool.runes).toContain('green')
      expect(newPool.runes).not.toContain('black')
      expect(newPool.runes.length).toBe(2)
    })

    it('only removes one instance of each color', () => {
      const pool: RunePool = { runes: ['blue', 'blue', 'black'], temporaryRunes: [] }
      const hero = createMockHero(['blue'])
      const newPool = removeRunesFromHero(hero, pool)
      
      expect(newPool.runes.filter(r => r === 'blue').length).toBe(1)
      expect(newPool.runes.length).toBe(2)
    })
  })

  describe('canAffordCard', () => {
    it('returns false if not enough mana', () => {
      const spell = createMockSpell(['blue'], 5)
      expect(canAffordCard(spell, 4)).toBe(false)
    })

    it('returns true if enough mana', () => {
      const spell = createMockSpell(['blue'], 5)
      expect(canAffordCard(spell, 5)).toBe(true)
    })

    it('returns true for zero-cost cards', () => {
      const unit = createMockGenericUnit([], 0)
      expect(canAffordCard(unit, 0)).toBe(true)
    })

    it('does not check runes (mana-only check)', () => {
      const spell = createMockSpell(['blue', 'black', 'green'], 7)
      expect(canAffordCard(spell, 10)).toBe(true)
    })
  })

  describe('consumeRunesForCard', () => {
    it('is a no-op - returns pool unchanged', () => {
      const pool: RunePool = { runes: ['blue', 'black', 'green'], temporaryRunes: [] }
      const spell = createMockSpell(['blue', 'green'], 5)
      
      const newPool = consumeRunesForCard(spell, pool)
      expect(newPool).toBe(pool)
    })
  })

  describe('getMissingRunes', () => {
    it('returns empty array if all runes present', () => {
      const pool: RunePool = { runes: ['blue', 'black', 'green'], temporaryRunes: [] }
      const spell = createMockSpell(['blue', 'black'], 5)
      
      expect(getMissingRunes(spell, pool)).toEqual([])
    })

    it('returns missing colors', () => {
      const pool: RunePool = { runes: ['blue'], temporaryRunes: [] }
      const spell = createMockSpell(['blue', 'black', 'green'], 7)
      
      const missing = getMissingRunes(spell, pool)
      expect(missing).toContain('black')
      expect(missing).toContain('green')
      expect(missing.length).toBe(2)
    })
  })

  describe('getAvailableRunesByColor', () => {
    it('counts runes by color correctly', () => {
      const pool: RunePool = { runes: ['blue', 'blue', 'black', 'green', 'green', 'green'], temporaryRunes: [] }
      
      const counts = getAvailableRunesByColor(pool)
      
      expect(counts.blue).toBe(2)
      expect(counts.black).toBe(1)
      expect(counts.green).toBe(3)
      expect(counts.red).toBe(0)
      expect(counts.white).toBe(0)
    })
  })

  describe('getAvailableRuneCount', () => {
    it('returns total rune count', () => {
      const pool: RunePool = { runes: ['blue', 'black', 'green'], temporaryRunes: [] }
      expect(getAvailableRuneCount(pool)).toBe(3)
    })

    it('returns 0 for empty pool', () => {
      const pool: RunePool = { runes: [], temporaryRunes: [] }
      expect(getAvailableRuneCount(pool)).toBe(0)
    })
  })

  describe('Temporary Runes', () => {
    it('adds temporary runes to pool', () => {
      const initialPool: RunePool = { runes: ['black', 'black'], temporaryRunes: [] }
      const pool = addTemporaryRunes(initialPool, ['black', 'black', 'black'])
      
      expect(pool.runes).toEqual(['black', 'black'])
      expect(pool.temporaryRunes).toEqual(['black', 'black', 'black'])
    })

    it('includes temporary runes in available count', () => {
      const pool: RunePool = { runes: ['black'], temporaryRunes: ['black', 'black'] }
      expect(getAvailableRuneCount(pool)).toBe(3)
    })
  })
})
