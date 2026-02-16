import { Hero, GenericUnit, SpellCard, ArtifactCard, Color } from './types'
import { rwHeroes, rwCards, rwSpells, rwArtifacts, allSpells } from './comprehensiveCardData'

/**
 * Boss Definition
 * 
 * Each boss has:
 * - A curated deck optimized for their strategy
 * - Simple AI rules (no complex decision-making needed)
 * - Optional buffs (if needed, but RW might not need them)
 */
export interface Boss {
  id: string
  name: string
  description: string
  archetype: string
  colors: Color[]
  
  // Deck composition
  heroes: Omit<Hero, 'location' | 'owner'>[]
  artifacts: Omit<ArtifactCard, 'location' | 'owner'>[]
  spells: Omit<SpellCard, 'location' | 'owner'>[]
  units: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[]
  
  // Optional buffs (if needed for difficulty)
  buffs?: {
    startingMana?: number // Default: 3
    towerHP?: number // Default: 20
    cardPower?: number // +X/+X to all units (default: 0)
  }
  
  // AI behavior hints (simple rules)
  aiStrategy: {
    priority: string[] // What to prioritize (e.g., ['play_artifacts', 'go_wide', 'attack_towers'])
    aggression: 'low' | 'medium' | 'high' // How aggressive
    runeUsage: 'simple' | 'moderate' | 'complex' // Rune management complexity
  }
}

/**
 * Boss 1: Valiant Legion (RW Go-Wide)
 * 
 * Strategy: Go-wide with Legion tokens, artifact synergies, and team buffs
 * 
 * Why this works well for AI:
 * - Simple gameplan: Play artifacts → Generate tokens → Buff team → Attack
 * - Clear priorities: Artifacts first, then tokens, then buffs
 * - No complex decisions: Just play cards on curve and attack
 * - Well-balanced deck: Good mix of early, mid, late game
 * 
 * AI Rules (Simple):
 * 1. Play artifacts early (War Banner, rune generators)
 * 2. Generate tokens when you have runes (Legion Call, Rally the Troops)
 * 3. Play units on curve (Legion Champion, Legion Archers)
 * 4. Use buff spells when you have multiple units
 * 5. Attack towers when safe (prioritize units that can't be blocked)
 */
export const boss1ValiantLegion: Boss = {
  id: 'boss-1-valiant-legion',
  name: 'Valiant Legion',
  description: 'A disciplined commander leading a go-wide strategy with Legion tokens and artifact synergies.',
  archetype: 'rw-go-wide',
  colors: ['red', 'white'],
  
  // 4 Heroes - Legion leaders + cleave control
  heroes: [
    rwHeroes.find(h => h.id === 'rw-hero-commander')!, // Legion Commander
    rwHeroes.find(h => h.id === 'rw-hero-captain')!, // Legion Commander (duplicate)
    rwHeroes.find(h => h.id === 'red-hero-cleaver')!, // Cleave Warrior
    rwHeroes.find(h => h.id === 'red-hero-cleaver')!, // Cleave Warrior (duplicate)
  ],
  
  // 4 Artifacts - Core synergies
  artifacts: [
    // Existing RW artifact set
    rwArtifacts.find(a => a.id === 'rw-artifact-legion-standard')!,
    rwArtifacts.find(a => a.id === 'rw-artifact-rally-banner')!,
    rwArtifacts.find(a => a.id === 'rw-artifact-glorious-banner')!,
    rwArtifacts.find(a => a.id === 'rw-artifact-legion-barracks')!,
  ],
  
  // 7 Spells - Token generators and buffs
  spells: [
    // Token Generators (Core Strategy)
    rwSpells.find(s => s.id === 'rw-spell-legion-call')!, // 3RW: Two 2/2 tokens
    rwSpells.find(s => s.id === 'rw-spell-rally-troops')!, // 2RW: One 2/2 token
    rwSpells.find(s => s.id === 'rw-spell-rapid-deployment')!, // 2RW: Two 1/1 tokens
    
    // Buff Spells
    rwSpells.find(s => s.id === 'rw-spell-rally-banner')!, // 4RW: +1/+1 to all, draw
    rwSpells.find(s => s.id === 'rw-spell-into-the-fray')!, // 2RW: +3/+3 to target
    
    // Finisher
    allSpells.find(s => s.id === 'vrune-spell-wrath-of-legion')!, // 5RRW: +3/+3 to all
    
    // Utility
    rwSpells.find(s => s.id === 'rw-spell-fighting-words')!, // 1R: +3 attack to target
  ],
  
  // 9 Units - Legion synergy and curve
  units: [
    // Early Game (2-3 mana)
    rwCards.find(u => u.id === 'rw-unit-legion-vanguard')!, // 4RW: token support
    rwCards.find(u => u.id === 'rw-unit-legion-archers')!, // 3RW: Ranged pressure
    
    // Mid Game (4 mana)
    rwCards.find(u => u.id === 'rw-legion-champion')!, // 4RW: Legion synergy
    rwCards.find(u => u.id === 'rw-unit-legion-vanguard')!, // 4RW: token support
    
    // Late Game (5 mana)
    rwCards.find(u => u.id === 'rw-unit-legion-general')!, // 5RW: +2/+2 to Legion
    
    // Additional pressure
    rwCards.find(u => u.id === 'rw-unit-legion-archers')!, // 3RW: Duplicate for consistency
    rwCards.find(u => u.id === 'rw-legion-champion')!, // 4RW: Duplicate for consistency
    rwCards.find(u => u.id === 'rw-unit-legion-vanguard')!, // 4RW: Duplicate for consistency
    rwCards.find(u => u.id === 'rw-unit-legion-general')!, // 5RW: Duplicate for consistency
  ],
  
  // No buffs needed - deck is strong enough with optimal composition
  buffs: {
    startingMana: 3, // Normal
    towerHP: 20, // Normal
    cardPower: 0, // No stat buffs needed
  },
  
  // Simple AI strategy
  aiStrategy: {
    priority: [
      'play_artifacts_early', // War Banner first for synergy
      'generate_tokens', // Use token spells when you have runes
      'play_units_on_curve', // Legion units for synergy
      'buff_when_wide', // Use buff spells when you have 3+ units
      'attack_towers', // Prioritize tower damage
    ],
    aggression: 'high', // Aggressive go-wide strategy
    runeUsage: 'simple', // Simple: Just use runes for token spells
  },
}

/**
 * Export all bosses
 */
export const allBosses: Boss[] = [
  boss1ValiantLegion,
]

/**
 * Get boss by ID
 */
export function getBossById(id: string): Boss | undefined {
  return allBosses.find(boss => boss.id === id)
}

/**
 * Get boss deck summary (for UI display)
 */
export function getBossDeckSummary(boss: Boss): {
  totalCards: number
  heroes: number
  artifacts: number
  spells: number
  units: number
  colors: Color[]
} {
  return {
    totalCards: boss.heroes.length + boss.artifacts.length + boss.spells.length + boss.units.length,
    heroes: boss.heroes.length,
    artifacts: boss.artifacts.length,
    spells: boss.spells.length,
    units: boss.units.length,
    colors: boss.colors,
  }
}

