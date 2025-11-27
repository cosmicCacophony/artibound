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
import {
  allHeroes,
  allCards,
  allSpells,
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

// Select 2 heroes from different colors for a pack
function selectHeroesForPack(packNumber: number, allHeroes: Omit<Hero, 'location' | 'owner'>[]): Omit<Hero, 'location' | 'owner'>[] {
  const availableHeroes = [...allHeroes]
  const selected: Omit<Hero, 'location' | 'owner'>[] = []
  const usedColors = new Set<Color>()

  // Ensure we get 2 different colors
  while (selected.length < HEROES_PER_PACK && availableHeroes.length > 0) {
    const shuffled = shuffleArray(availableHeroes)
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
  
  // 2-3 signature cards
  const signaturePool = shuffleArray(allSignatureCards)
  selected.push(...signaturePool.slice(0, 2 + Math.floor(Math.random() * 2)))
  
  // 3-4 generic units
  const genericPool = shuffleArray(allGenericCards)
  selected.push(...genericPool.slice(0, 3 + Math.floor(Math.random() * 2)))
  
  // 1-2 spell cards
  const spellPool = shuffleArray(allSpellCards)
  selected.push(...spellPool.slice(0, 1 + Math.floor(Math.random() * 2)))
  
  // 0-1 multicolor cards (potential bombs)
  if (Math.random() > 0.3) { // 70% chance
    const multicolorPool = shuffleArray(allMulticolorCards)
    if (multicolorPool.length > 0) {
      selected.push(multicolorPool[0])
    }
  }
  
  // Trim to CARDS_PER_PACK
  return shuffleArray(selected).slice(0, CARDS_PER_PACK)
}

// Select 1 battlefield for a pack
function selectBattlefieldForPack(): BattlefieldDefinition {
  const allBattlefields = getAllDraftBattlefields()
  const shuffled = shuffleArray(allBattlefields)
  return shuffled[0]
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
  const battlefields = [selectBattlefieldForPack()]

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

