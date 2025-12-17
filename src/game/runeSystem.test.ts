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
} from './runeSystem'
import { Hero, RunePool, BaseCard } from './types'

// Helper to create a mock hero
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

// Helper to create a mock spell card
function createMockSpell(
  colors: ('red' | 'blue' | 'white' | 'black' | 'green')[],
  manaCost: number,
  consumesRunes: boolean = false
): BaseCard {
  return {
    id: 'test-spell',
    name: 'Test Spell',
    description: 'A test spell',
    cardType: 'spell',
    colors,
    manaCost,
    consumesRunes,
  }
}

// Helper to create a mock generic unit
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
    consumesRunes: false, // Generic units don't consume runes
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
    describe('mana checks', () => {
      it('returns false if not enough mana', () => {
        const pool: RunePool = { runes: ['blue', 'black', 'green'], temporaryRunes: [] }
        const spell = createMockSpell(['blue'], 5, true)
        
        expect(canAffordCard(spell, 4, pool)).toBe(false)
      })

      it('returns true if enough mana', () => {
        const pool: RunePool = { runes: ['blue'], temporaryRunes: [] }
        const spell = createMockSpell(['blue'], 5, true)
        
        expect(canAffordCard(spell, 5, pool)).toBe(true)
      })
    })

    describe('rune checks for consumesRunes cards', () => {
      it('returns false if missing required runes', () => {
        const pool: RunePool = { runes: ['blue', 'black'], temporaryRunes: [] }
        const spell = createMockSpell(['blue', 'black', 'green'], 7, true)
        
        expect(canAffordCard(spell, 10, pool)).toBe(false)
      })

      it('returns true if all required runes present', () => {
        const pool: RunePool = { runes: ['blue', 'black', 'green'], temporaryRunes: [] }
        const spell = createMockSpell(['blue', 'black', 'green'], 7, true)
        
        expect(canAffordCard(spell, 10, pool)).toBe(true)
      })

      it('handles duplicate rune requirements', () => {
        // If a spell requires 2 blue runes
        const pool: RunePool = { runes: ['blue'], temporaryRunes: [] }
        const spell = createMockSpell(['blue', 'blue'], 4, true)
        
        expect(canAffordCard(spell, 10, pool)).toBe(false)
      })

      it('allows card if pool has multiple of same color', () => {
        const pool: RunePool = { runes: ['blue', 'blue'], temporaryRunes: [] }
        const spell = createMockSpell(['blue', 'blue'], 4, true)
        
        expect(canAffordCard(spell, 10, pool)).toBe(true)
      })
    })

    describe('generic cards (consumesRunes: false)', () => {
      it('does not check runes for generic units', () => {
        const pool: RunePool = { runes: [], temporaryRunes: [] } // Empty pool
        const unit = createMockGenericUnit(['blue', 'black'], 4)
        
        // Should pass because generic units don't consume runes
        expect(canAffordCard(unit, 10, pool)).toBe(true)
      })

      it('still checks mana for generic units', () => {
        const pool: RunePool = { runes: [], temporaryRunes: [] }
        const unit = createMockGenericUnit(['blue'], 5)
        
        expect(canAffordCard(unit, 4, pool)).toBe(false)
        expect(canAffordCard(unit, 5, pool)).toBe(true)
      })
    })
  })

  describe('consumeRunesForCard', () => {
    it('consumes runes for cards with consumesRunes: true', () => {
      const pool: RunePool = { runes: ['blue', 'black', 'green'], temporaryRunes: [] }
      const spell = createMockSpell(['blue', 'green'], 5, true)
      
      const newPool = consumeRunesForCard(spell, pool)
      
      expect(newPool.runes).toEqual(['black'])
    })

    it('does not consume runes for cards with consumesRunes: false', () => {
      const pool: RunePool = { runes: ['blue', 'black', 'green'], temporaryRunes: [] }
      const unit = createMockGenericUnit(['blue', 'black'], 4)
      
      const newPool = consumeRunesForCard(unit, pool)
      
      expect(newPool.runes).toEqual(['blue', 'black', 'green'])
    })

    it('does not consume runes for spells without consumesRunes flag', () => {
      const pool: RunePool = { runes: ['blue', 'black'], temporaryRunes: [] }
      const spell = createMockSpell(['blue'], 3, false) // Generic spell
      
      const newPool = consumeRunesForCard(spell, pool)
      
      expect(newPool.runes).toEqual(['blue', 'black'])
    })

    it('handles consuming multiple runes of same color', () => {
      const pool: RunePool = { runes: ['blue', 'blue', 'black'], temporaryRunes: [] }
      const spell = createMockSpell(['blue', 'blue'], 4, true)
      
      const newPool = consumeRunesForCard(spell, pool)
      
      expect(newPool.runes).toEqual(['black'])
    })
  })

  describe('getMissingRunes', () => {
    it('returns empty array if all runes present', () => {
      const pool: RunePool = { runes: ['blue', 'black', 'green'], temporaryRunes: [] }
      const spell = createMockSpell(['blue', 'black'], 5, true)
      
      expect(getMissingRunes(spell, pool)).toEqual([])
    })

    it('returns missing colors', () => {
      const pool: RunePool = { runes: ['blue'], temporaryRunes: [] }
      const spell = createMockSpell(['blue', 'black', 'green'], 7, true)
      
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

  describe('Exorcism scenario (UBG spell)', () => {
    it('can cast Exorcism with UBG runes available', () => {
      const pool: RunePool = { runes: ['blue', 'black', 'green'], temporaryRunes: [] }
      const exorcism: BaseCard = {
        id: 'ubg-spell-exorcism',
        name: 'Exorcism',
        description: 'Deal 12 total damage',
        cardType: 'spell',
        colors: ['blue', 'black', 'green'],
        consumesRunes: true,
        manaCost: 7,
      }
      
      expect(canAffordCard(exorcism, 7, pool)).toBe(true)
    })

    it('cannot cast Exorcism with only UB runes', () => {
      const pool: RunePool = { runes: ['blue', 'black'], temporaryRunes: [] }
      const exorcism: BaseCard = {
        id: 'ubg-spell-exorcism',
        name: 'Exorcism',
        description: 'Deal 12 total damage',
        cardType: 'spell',
        colors: ['blue', 'black', 'green'],
        consumesRunes: true,
        manaCost: 7,
      }
      
      expect(canAffordCard(exorcism, 7, pool)).toBe(false)
    })

    it('consuming Exorcism removes UBG from pool', () => {
      const pool: RunePool = { runes: ['blue', 'black', 'green', 'green'], temporaryRunes: [] }
      const exorcism: BaseCard = {
        id: 'ubg-spell-exorcism',
        name: 'Exorcism',
        description: 'Deal 12 total damage',
        cardType: 'spell',
        colors: ['blue', 'black', 'green'],
        consumesRunes: true,
        manaCost: 7,
      }
      
      const newPool = consumeRunesForCard(exorcism, pool)
      
      expect(newPool.runes).toEqual(['green']) // Only one green remains
    })
  })
})

