import { BaseCard, Color, Hero } from './types'
import { allArtifacts, allCards, allHeroes, allSpells } from './cardData'

export interface StockDeck {
  id: string
  name: string
  description: string
  archetype: string
  colors: Color[]
  heroes: Omit<Hero, 'location' | 'owner'>[]
  cards: BaseCard[]
}

const allBaseCards: BaseCard[] = [...allCards, ...allSpells, ...allArtifacts]

const getHeroById = (id: string): Omit<Hero, 'location' | 'owner'> => {
  const hero = allHeroes.find(candidate => candidate.id === id)
  if (!hero) {
    throw new Error(`Stock deck hero not found: ${id}`)
  }
  return hero
}

const getCardById = (id: string): BaseCard => {
  const card = allBaseCards.find(candidate => candidate.id === id)
  if (!card) {
    throw new Error(`Stock deck card not found: ${id}`)
  }
  return card
}

const heroes = (ids: string[]) => ids.map(getHeroById)
const cards = (ids: string[]) => ids.map(getCardById)

export const stockDecks: StockDeck[] = [
  {
    id: 'stock-br-aggro',
    name: 'BR Aggro',
    description: 'Fast spell-synergy aggro with assassinate/crossStrike threats.',
    archetype: 'guild-br',
    colors: ['red', 'black'],
    heroes: heroes([
      'red-hero-spell-slinger',
      'red-hero-pyromancer',
      'red-hero-cleaver',
      'black-hero-soul-reaper',
    ]),
    cards: cards([
      // Units
      'rb-unit-spell-fencer',
      'red-unit-tower-burner',
      'rb-unit-crossfire-raider',
      'rb-unit-gravebolt-stalker',
      'rb-unit-bloodstep-killer',
      'rb-unit-velocity-enforcer',
      'rb-unit-token-ritualist',
      'rb-unit-artifact-forger',
      // Spells
      'rb-spell-ruthless-strike',
      'rb-spell-spell-storm',
      'red-spell-quickfire-bolt',
      'rb-spell-double-strike',
      'black-spell-execute-weakness',
      'black-spell-weaken',
      'red-spell-flame-sweep',
      'rb-spell-dual-elimination',
      'black-sig-shadow-strike',
      'red-sig-fury-strike',
      // Artifacts
      'artifact-red-seal',
      'artifact-black-seal',
    ]),
  },
  {
    id: 'stock-ubr-grixis',
    name: 'UBR Grixis Control',
    description: 'AOE-heavy control with multispell payoffs and sweepers.',
    archetype: 'wedge-ubr',
    colors: ['blue', 'black', 'red'],
    heroes: heroes([
      'blue-hero-morgana-curser',
      'black-hero-night-harvester',
      'red-hero-spell-slinger',
      'red-hero-pyromancer',
    ]),
    cards: cards([
      // Units
      'ub-unit-voidline-arcanist',
      'ub-unit-hexblade-infiltrator',
      'ub-unit-spell-stunner',
      'ub-unit-spell-scribe',
      'ub-unit-multispell-enabler',
      'ubr-unit-grixis-titan',
      // Spells
      'ub-spell-void-cascade',
      'ub-spell-premium-removal',
      'ub-spell-conditional-removal',
      'ub-spell-midrange-aoe',
      'ub-spell-curse',
      'ub-spell-dismember',
      'ub-spell-spell-cascade',
      'blue-spell-thunderstorm',
      'black-spell-3b-draw',
      'red-spell-3r-removal',
      'black-spell-twin-strike',
      'black-spell-spread-plague',
      // Artifacts
      'blue-artifact-spell-book',
      'black-artifact-spell-velocity-tracker',
      'artifact-blue-seal',
      'artifact-black-seal',
    ]),
  },
  {
    id: 'stock-gr-midrange',
    name: 'GR Midrange',
    description: 'Mighty creature curve with fight spells and crossStrike threats.',
    archetype: 'guild-rg',
    colors: ['red', 'green'],
    heroes: heroes([
      'rg-hero-axe-warrior',
      'green-hero-mighty-champion',
      'red-hero-cleaver',
      'red-hero-spell-slinger',
    ]),
    cards: cards([
      // Units
      'red-unit-cleaving-warrior',
      'red-unit-cleaving-berserker',
      'rg-unit-rift-pouncer',
      'rg-unit-gutter-predator',
      'rg-unit-battle-tyrant',
      'rg-mighty-chieftain',
      'rg-mighty-warlord',
      'rg-mighty-herald',
      // Extra early curve copies
      'red-unit-cleaving-warrior',
      'red-unit-cleaving-berserker',
      'rg-unit-rift-pouncer',
      'rg-unit-gutter-predator',
      'rg-mighty-herald',
      // Spells
      'rg-fight-1',
      'rg-spell-mighty-strike',
      'rg-spell-overwhelming-force',
      'red-sig-fury-strike',
      'red-spell-3r-removal',
      // Artifacts
      'rg-artifact-cleave-aura',
      'green-artifact-mighty-tracker',
      'artifact-green-seal',
      'artifact-red-seal',
    ]),
  },
]

export const getStockDeckById = (id: string): StockDeck | undefined =>
  stockDecks.find(deck => deck.id === id)
