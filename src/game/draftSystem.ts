import {
  Hero,
  BaseCard,
  BattlefieldDefinition,
  DraftPack,
  DraftPoolItem,
  DraftPickType,
  Color,
  CARDS_PER_PACK,
  HEROES_PER_PACK,
  BATTLEFIELDS_PER_PACK,
  DRAFT_PACKS,
} from './types'
import {
  draftableHeroes,
  getAllDraftBattlefields,
} from './draftData'
// Import storage-aware versions for runtime use
import { allHeroes, allCards, allSpells } from './cardData'
// Import specific arrays for pack generation (these are used for filtering/selection logic)
import {
  rwCards,
  rgCards,
  ruCards,
  rbCards,
  gwCards,
  gbCards,
  guCards,
  ubCards,
  uwCards,
  rwSpells,
  ruSpells,
  rbSpells,
  gbSpells,
  guSpells,
  ubSpells,
  uwSpells,
} from './comprehensiveCardData'

// All available cards for draft pool
// Separate signature cards (those with sig- in ID) from generic cards
const allSignatureCards: BaseCard[] = allCards.filter(card => card.id.includes('sig-'))
const allGenericCards: BaseCard[] = allCards.filter(card => !card.id.includes('sig-'))
const allSpellCards: BaseCard[] = allSpells
// Multicolor cards are cards with 2+ colors
const allMulticolorCards: BaseCard[] = allCards.filter(card => card.colors && card.colors.length >= 2)

// Helper to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Select 3 heroes from different colors for a pack
function selectHeroesForPack(packNumber: number, allHeroes: Omit<Hero, 'location' | 'owner'>[]): Omit<Hero, 'location' | 'owner'>[] {
  const availableHeroes = [...allHeroes]
  const selected: Omit<Hero, 'location' | 'owner'>[] = []
  const usedColors = new Set<Color>()

  // Try to get heroes with different colors, but allow duplicates if needed
  while (selected.length < HEROES_PER_PACK && availableHeroes.length > 0) {
    const shuffled = shuffleArray(availableHeroes)
    // Prefer heroes with colors we haven't used yet
    const hero = shuffled.find(h => {
      const heroColor = h.colors[0] // Primary color
      return !usedColors.has(heroColor)
    }) || shuffled[0] // Fallback if all colors used

    if (hero) {
      selected.push(hero)
      hero.colors.forEach(c => usedColors.add(c))
      const index = availableHeroes.findIndex(h => h.id === hero.id)
      if (index !== -1) {
        availableHeroes.splice(index, 1)
      }
    } else {
      break
    }
  }

  return selected
}

// Select cards for a pack (mix of signature, generic, spell, multicolor)
function selectCardsForPack(): BaseCard[] {
  const selected: BaseCard[] = []
  
  // 4-6 signature cards
  const signaturePool = shuffleArray(allSignatureCards)
  selected.push(...signaturePool.slice(0, 4 + Math.floor(Math.random() * 3)))
  
  // 6-8 generic units
  const genericPool = shuffleArray(allGenericCards)
  selected.push(...genericPool.slice(0, 6 + Math.floor(Math.random() * 3)))
  
  // 2-3 spell cards
  const spellPool = shuffleArray(allSpellCards)
  selected.push(...spellPool.slice(0, 2 + Math.floor(Math.random() * 2)))
  
  // 1-2 multicolor cards (potential bombs)
  const multicolorCount = Math.random() > 0.4 ? 2 : 1 // 60% chance for 2, 40% for 1
  const multicolorPool = shuffleArray(allMulticolorCards)
  if (multicolorPool.length > 0) {
    selected.push(...multicolorPool.slice(0, multicolorCount))
  }
  
  // Trim to CARDS_PER_PACK (should be close to 15 already)
  const shuffled = shuffleArray(selected)
  return shuffled.slice(0, CARDS_PER_PACK)
}

// Select 3 battlefields for a pack
function selectBattlefieldsForPack(): BattlefieldDefinition[] {
  const allBattlefields = getAllDraftBattlefields()
  const shuffled = shuffleArray(allBattlefields)
  // Return 3 battlefields, or all available if less than 3
  return shuffled.slice(0, Math.min(BATTLEFIELDS_PER_PACK, shuffled.length))
}

// Convert items to DraftPoolItems
function createPoolItems(
  packNumber: number,
  heroes: Omit<Hero, 'location' | 'owner'>[],
  cards: BaseCard[],
  battlefields: BattlefieldDefinition[]
): DraftPoolItem[] {
  const items: DraftPoolItem[] = []

  heroes.forEach(hero => {
    items.push({
      id: `pack-${packNumber}-hero-${hero.id}`,
      type: 'hero' as DraftPickType,
      item: hero as Hero,
      packNumber,
    })
  })

  cards.forEach(card => {
    items.push({
      id: `pack-${packNumber}-card-${card.id}`,
      type: 'card' as DraftPickType,
      item: card,
      packNumber,
    })
  })

  battlefields.forEach(battlefield => {
    items.push({
      id: `pack-${packNumber}-battlefield-${battlefield.id}`,
      type: 'battlefield' as DraftPickType,
      item: battlefield,
      packNumber,
    })
  })

  return shuffleArray(items) // Shuffle so order isn't predictable
}

// Generate a single draft pack
export function generateDraftPack(packNumber: number): DraftPack {
  // Use all heroes from comprehensive data, not just draftableHeroes
  const heroes = selectHeroesForPack(packNumber, allHeroes)
  const cards = selectCardsForPack()
  const battlefields = selectBattlefieldsForPack()

  const poolItems = createPoolItems(packNumber, heroes, cards, battlefields)

  return {
    packNumber,
    heroes,
    cards,
    battlefields,
    remainingItems: poolItems,
    picks: [],
    isComplete: false,
  }
}

// Generate all draft packs
export function generateAllDraftPacks(): DraftPack[] {
  const packs: DraftPack[] = []
  for (let i = 1; i <= DRAFT_PACKS; i++) {
    packs.push(generateDraftPack(i))
  }
  return packs
}

// Generate a single random pack for the new round-based system
export function generateRandomPack(roundNumber: number): DraftPack {
  return generateDraftPack(roundNumber)
}

// Remove a picked item from pack's remaining items
export function removeItemFromPack(
  pack: DraftPack,
  itemId: string
): DraftPack {
  return {
    ...pack,
    remainingItems: pack.remainingItems.filter(item => item.id !== itemId),
  }
}

// Check if pack is complete (all items picked or pack is done)
export function isPackComplete(pack: DraftPack): boolean {
  return pack.remainingItems.length === 0 || pack.isComplete
}

