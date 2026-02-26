import { Card, Color, GameMetadata, GameState, Hero, HeroRuneTriggerType, PlayerId, RuneColor, RunePool } from './types'

const triggerByColor: Record<Color, HeroRuneTriggerType> = {
  red: 'red_tower_damage',
  blue: 'blue_spell_cast',
  black: 'black_lane_death',
  green: 'green_friendly_deploy',
  white: 'white_friendly_survive_combat',
}

function getHeroTriggerColor(hero: Hero): Color {
  return hero.colors?.[0] || 'red'
}

export function getHeroRuneTrigger(hero: Hero): HeroRuneTriggerType {
  if (hero.runeTrigger) {
    return hero.runeTrigger
  }
  return triggerByColor[getHeroTriggerColor(hero)]
}

export function addRunes(pool: RunePool, colors: RuneColor[]): RunePool {
  return {
    ...pool,
    runes: [...pool.runes, ...colors],
  }
}

export function grantSeedRunes(
  hero: Hero,
  pool: RunePool,
  heroSeedRunesGranted: Record<string, boolean>
): { updatedPool: RunePool; updatedSeedFlags: Record<string, boolean>; granted: boolean } {
  if (heroSeedRunesGranted[hero.id]) {
    return {
      updatedPool: pool,
      updatedSeedFlags: heroSeedRunesGranted,
      granted: false,
    }
  }

  const runeColors = (hero.colors || []) as RuneColor[]
  return {
    updatedPool: addRunes(pool, runeColors),
    updatedSeedFlags: {
      ...heroSeedRunesGranted,
      [hero.id]: true,
    },
    granted: runeColors.length > 0,
  }
}

export function canHeroTriggerRune(hero: Hero, metadata: GameMetadata): boolean {
  return (metadata.heroRuneTriggersThisTurn?.[hero.id] || 0) < 1
}

export function grantHeroTriggerRune(
  hero: Hero,
  pool: RunePool,
  metadata: GameMetadata,
  preferredColor?: RuneColor
): { updatedPool: RunePool; updatedTriggerState: Record<string, number>; granted: boolean } {
  if (!canHeroTriggerRune(hero, metadata)) {
    return {
      updatedPool: pool,
      updatedTriggerState: metadata.heroRuneTriggersThisTurn || {},
      granted: false,
    }
  }

  const fallback = (hero.colors?.[0] || 'red') as RuneColor
  const runeToAdd = preferredColor && hero.colors?.includes(preferredColor) ? preferredColor : fallback

  return {
    updatedPool: addRunes(pool, [runeToAdd]),
    updatedTriggerState: {
      ...(metadata.heroRuneTriggersThisTurn || {}),
      [hero.id]: (metadata.heroRuneTriggersThisTurn?.[hero.id] || 0) + 1,
    },
    granted: true,
  }
}

function getLaneHeroes(gameState: GameState, player: PlayerId, battlefieldId: 'battlefieldA' | 'battlefieldB'): Hero[] {
  return gameState[battlefieldId][player].filter(c => c.cardType === 'hero') as Hero[]
}

export function applyBlueSpellTrigger(
  gameState: GameState,
  metadata: GameMetadata,
  owner: PlayerId,
  runePool: RunePool
): { updatedPool: RunePool; updatedTriggerState: Record<string, number> } {
  const deployedHeroes = [
    ...getLaneHeroes(gameState, owner, 'battlefieldA'),
    ...getLaneHeroes(gameState, owner, 'battlefieldB'),
  ]

  let updatedPool = runePool
  let updatedTriggerState = metadata.heroRuneTriggersThisTurn || {}

  for (const hero of deployedHeroes) {
    if (getHeroRuneTrigger(hero) !== 'blue_spell_cast') continue
    const triggerResult = grantHeroTriggerRune(
      hero,
      updatedPool,
      { ...metadata, heroRuneTriggersThisTurn: updatedTriggerState } as GameMetadata,
      'blue'
    )
    updatedPool = triggerResult.updatedPool
    updatedTriggerState = triggerResult.updatedTriggerState
  }

  return { updatedPool, updatedTriggerState }
}

export function getMirrorPartnerSlot(slot: number): number {
  return 6 - slot
}

export function getMirroredHeroSlots(gameState: GameState, player: PlayerId): number[] {
  const laneBSlots = new Set(
    getLaneHeroes(gameState, player, 'battlefieldB')
      .map(hero => hero.slot)
      .filter((slot): slot is number => slot !== undefined)
  )

  return getLaneHeroes(gameState, player, 'battlefieldA')
    .map(hero => hero.slot)
    .filter((slot): slot is number => slot !== undefined)
    .filter(slot => laneBSlots.has(getMirrorPartnerSlot(slot)))
}

export function getMirroredHeroRuneColors(gameState: GameState, player: PlayerId): RuneColor[] {
  const laneBBySlot = new Map<number, Hero>(
    getLaneHeroes(gameState, player, 'battlefieldB')
      .filter(hero => hero.slot !== undefined)
      .map(hero => [hero.slot as number, hero])
  )
  const runeColors: RuneColor[] = []

  getLaneHeroes(gameState, player, 'battlefieldA').forEach(heroA => {
    if (heroA.slot === undefined) return
    const heroB = laneBBySlot.get(getMirrorPartnerSlot(heroA.slot))
    if (!heroB) return

    const colorA = heroA.colors?.[0] as RuneColor | undefined
    const colorB = heroB.colors?.[0] as RuneColor | undefined
    if (colorA) runeColors.push(colorA)
    if (colorB) runeColors.push(colorB)
  })

  return runeColors
}

export function applyMirrorResonanceBuffs(gameState: GameState): GameState {
  const buffHeroes = (cards: Card[], mirroredSlots: Set<number>) =>
    cards.map(card => {
      if (card.cardType !== 'hero' || card.slot === undefined || !mirroredSlots.has(card.slot)) {
        return card
      }
      return {
        ...card,
        temporaryAttack: (card.temporaryAttack || 0) + 1,
        temporaryHP: (card.temporaryHP || 0) + 1,
      }
    })

  const p1MirroredA = new Set(getMirroredHeroSlots(gameState, 'player1'))
  const p2MirroredA = new Set(getMirroredHeroSlots(gameState, 'player2'))
  const p1MirroredB = new Set(Array.from(p1MirroredA).map(getMirrorPartnerSlot))
  const p2MirroredB = new Set(Array.from(p2MirroredA).map(getMirrorPartnerSlot))

  return {
    ...gameState,
    battlefieldA: {
      player1: buffHeroes(gameState.battlefieldA.player1, p1MirroredA),
      player2: buffHeroes(gameState.battlefieldA.player2, p2MirroredA),
    },
    battlefieldB: {
      player1: buffHeroes(gameState.battlefieldB.player1, p1MirroredB),
      player2: buffHeroes(gameState.battlefieldB.player2, p2MirroredB),
    },
  }
}
