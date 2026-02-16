import { Card, GameMetadata, GameState, GenericUnit, PlayerId, SpellCard } from './types'
import { createCardFromTemplate } from './sampleData'
import { onSpellCast } from './spellcasterSystem'

type BattlefieldId = 'battlefieldA' | 'battlefieldB'

export interface TargetOption {
  id: string
  label: string
}

function opponentOf(player: PlayerId): PlayerId {
  return player === 'player1' ? 'player2' : 'player1'
}

function laneTowerKey(lane: BattlefieldId, player: PlayerId): keyof GameMetadata {
  if (lane === 'battlefieldA') {
    return player === 'player1' ? 'towerA_player1_HP' : 'towerA_player2_HP'
  }
  return player === 'player1' ? 'towerB_player1_HP' : 'towerB_player2_HP'
}

function collectBattlefieldCards(state: GameState): Card[] {
  return [
    ...state.battlefieldA.player1,
    ...state.battlefieldA.player2,
    ...state.battlefieldB.player1,
    ...state.battlefieldB.player2,
  ]
}

function collectLaneCards(state: GameState, lane: BattlefieldId, player: PlayerId): Card[] {
  return [...state[lane][player]]
}

function updateCardInBattlefields(state: GameState, cardId: string, updater: (card: Card) => Card | null): GameState {
  const applyToLane = (lane: BattlefieldId, player: PlayerId) => {
    const cards = state[lane][player]
    let changed = false
    const next = cards
      .map(card => {
        if (card.id !== cardId) return card
        changed = true
        return updater(card)
      })
      .filter(Boolean) as Card[]
    return { changed, next }
  }

  const a1 = applyToLane('battlefieldA', 'player1')
  const a2 = applyToLane('battlefieldA', 'player2')
  const b1 = applyToLane('battlefieldB', 'player1')
  const b2 = applyToLane('battlefieldB', 'player2')
  if (!a1.changed && !a2.changed && !b1.changed && !b2.changed) return state

  return {
    ...state,
    battlefieldA: {
      player1: a1.next,
      player2: a2.next,
    },
    battlefieldB: {
      player1: b1.next,
      player2: b2.next,
    },
  }
}

function moveDeadHeroToBase(state: GameState, hero: Card): GameState {
  const owner = hero.owner
  const baseKey = owner === 'player1' ? 'player1Base' : 'player2Base'
  return {
    ...state,
    [baseKey]: [
      ...(state[baseKey] as Card[]),
      {
        ...hero,
        location: 'base',
        currentHealth: 0,
        slot: undefined,
      },
    ],
    metadata: {
      ...state.metadata,
      deathCooldowns: {
        ...state.metadata.deathCooldowns,
        [hero.id]: 2,
      },
    },
  }
}

function applyDamageToCard(state: GameState, cardId: string, amount: number): GameState {
  if (amount <= 0) return state
  const cards = collectBattlefieldCards(state)
  const target = cards.find(c => c.id === cardId)
  if (!target || !('currentHealth' in target)) return state
  const nextHP = (target.currentHealth || 0) - amount

  if (nextHP > 0) {
    return updateCardInBattlefields(state, cardId, card => ({ ...card, currentHealth: nextHP }))
  }

  let nextState = updateCardInBattlefields(state, cardId, () => null)
  if (target.cardType === 'hero') {
    nextState = moveDeadHeroToBase(nextState, target)
  }
  return nextState
}

function addTemporaryAttack(state: GameState, cardId: string, delta: number): GameState {
  return updateCardInBattlefields(state, cardId, card => {
    if (card.cardType !== 'hero' && card.cardType !== 'generic') return card
    const current = card.temporaryAttack || 0
    return { ...card, temporaryAttack: current + delta }
  })
}

function addTemporaryStatsToLane(
  state: GameState,
  lane: BattlefieldId,
  player: PlayerId,
  attack: number,
  health: number
): GameState {
  const targetCards = state[lane][player].filter(c => c.cardType === 'hero' || c.cardType === 'generic')
  let next = state
  for (const card of targetCards) {
    next = updateCardInBattlefields(next, card.id, c => {
      if (c.cardType !== 'hero' && c.cardType !== 'generic') return c
      return {
        ...c,
        temporaryAttack: (c.temporaryAttack || 0) + attack,
        temporaryHP: (c.temporaryHP || 0) + health,
      }
    })
  }
  return next
}

function drawCards(state: GameState, owner: PlayerId, count: number): GameState {
  if (!count || count <= 0) return state
  const handKey = owner === 'player1' ? 'player1Hand' : 'player2Hand'
  const libraryKey = owner === 'player1' ? 'player1Library' : 'player2Library'
  const library = ((state as any)[libraryKey] || []) as any[]
  if (library.length === 0) return state

  const drawnTemplates = library.slice(0, count)
  const remainingLibrary = library.slice(count)
  const drawnCards = drawnTemplates.map(template => createCardFromTemplate(template, owner, 'hand'))

  return {
    ...state,
    [handKey]: [...(state[handKey] as Card[]), ...drawnCards],
    [libraryKey]: remainingLibrary,
  } as GameState
}

function applyTowerDamage(state: GameState, owner: PlayerId, amount: number, lane?: BattlefieldId): GameState {
  if (amount <= 0) return state
  const enemy = opponentOf(owner)
  const lanes: BattlefieldId[] = lane ? [lane] : ['battlefieldA', 'battlefieldB']
  let next = state
  for (const currentLane of lanes) {
    const key = laneTowerKey(currentLane, enemy)
    next = {
      ...next,
      metadata: {
        ...next.metadata,
        [key]: Math.max(0, (next.metadata[key] as number) - amount),
      },
    }
  }
  return next
}

function firstOpenSlot(cards: Card[]): number | null {
  for (let slot = 1; slot <= 5; slot++) {
    if (!cards.some(c => c.slot === slot)) return slot
  }
  return null
}

function spawnToken(state: GameState, owner: PlayerId, lane: BattlefieldId, attack: number, health: number, tokenType?: string): GameState {
  const laneCards = state[lane][owner]
  const slot = firstOpenSlot(laneCards)
  if (!slot) return state

  const token: GenericUnit = {
    id: `token-${owner}-${lane}-${Date.now()}-${Math.random()}`,
    name: tokenType ? `${tokenType} Token` : 'Token',
    description: `${tokenType || 'Generic'} token`,
    cardType: 'generic',
    colors: [],
    manaCost: 0,
    attack,
    health,
    maxHealth: health,
    currentHealth: health,
    location: lane,
    owner,
    slot,
  }

  return {
    ...state,
    [lane]: {
      ...state[lane],
      [owner]: [...laneCards, token].sort((a, b) => (a.slot || 0) - (b.slot || 0)),
    },
  }
}

function createTokenInHand(state: GameState, owner: PlayerId, attack: number, health: number, tokenType?: string): GameState {
  const handKey = owner === 'player1' ? 'player1Hand' : 'player2Hand'
  const token: GenericUnit = {
    id: `token-hand-${owner}-${Date.now()}-${Math.random()}`,
    name: tokenType ? `${tokenType} Token` : 'Token',
    description: `${tokenType || 'Generic'} token`,
    cardType: 'generic',
    colors: [],
    manaCost: 0,
    attack,
    health,
    maxHealth: health,
    currentHealth: health,
    location: 'hand',
    owner,
  }
  return {
    ...state,
    [handKey]: [...(state[handKey] as Card[]), token as Card],
  } as GameState
}

function eligibleTargetCards(state: GameState, owner: PlayerId, spell: SpellCard): Card[] {
  const enemy = opponentOf(owner)
  const cards = collectBattlefieldCards(state).filter(card => card.owner === enemy)
  const affectsHeroes = spell.effect.affectsHeroes ?? true
  const affectsUnits = spell.effect.affectsUnits ?? true
  const maxHp = spell.effect.maxTargetHealth

  return cards.filter(card => {
    if (card.cardType === 'hero' && !affectsHeroes) return false
    if (card.cardType === 'generic' && !affectsUnits) return false
    if (card.cardType !== 'hero' && card.cardType !== 'generic') return false
    if (maxHp !== undefined && 'currentHealth' in card && (card.currentHealth || 0) > maxHp) return false
    return true
  })
}

export function getSpellTargetOptions(
  state: GameState,
  spell: SpellCard,
  owner: PlayerId,
  lane: BattlefieldId
): TargetOption[] {
  const enemy = opponentOf(owner)
  const options: TargetOption[] = []
  const targetableCards = eligibleTargetCards(state, owner, spell)
  for (const card of targetableCards) {
    options.push({
      id: card.id,
      label: `${card.name} (${card.owner}, HP ${(card as any).currentHealth ?? '-'})`,
    })
  }

  const canTargetTower =
    spell.effect.canTargetTowers ||
    spell.id === 'red-spell-quickfire-bolt' ||
    spell.description.toLowerCase().includes('tower')
  if (canTargetTower) {
    options.push({
      id: `tower:${enemy}:${lane}`,
      label: `Enemy tower (${lane})`,
    })
  }
  return options
}

export function requiresTargets(spell: SpellCard): boolean {
  if (spell.effect.type === 'create_tokens' || spell.effect.type === 'tokenize') return false
  if (spell.effect.type === 'aoe_damage' || spell.effect.type === 'all_units_damage') return false
  if (spell.effect.towerDamage && !(spell.effect.affectsHeroes || spell.effect.affectsUnits)) return false
  return spell.effect.type === 'targeted_damage' || spell.effect.type === 'multi_target_damage'
}

export function maxTargetCount(spell: SpellCard): number {
  if (spell.effect.type === 'multi_target_damage') return spell.effect.maxTargets || 1
  return 1
}

function applyCardSpecificSpellRules(state: GameState, spell: SpellCard, owner: PlayerId, lane: BattlefieldId): GameState {
  let next = state
  const myLaneCards = collectLaneCards(next, lane, owner)

  switch (spell.id) {
    case 'rw-spell-into-the-fray': {
      const first = myLaneCards.find(c => c.cardType === 'hero' || c.cardType === 'generic')
      if (first) {
        next = updateCardInBattlefields(next, first.id, card => {
          if (card.cardType !== 'hero' && card.cardType !== 'generic') return card
          return {
            ...card,
            temporaryAttack: (card.temporaryAttack || 0) + 3,
            temporaryHP: (card.temporaryHP || 0) + 3,
          }
        })
      }
      break
    }
    case 'rw-spell-fighting-words':
      {
        const first = myLaneCards.find(c => c.cardType === 'hero' || c.cardType === 'generic')
        if (first) next = addTemporaryAttack(next, first.id, 3)
      }
      break
    case 'rw-spell-battle-cry':
      next = addTemporaryStatsToLane(next, lane, owner, 1, 0)
      break
    case 'rw-spell-rally-legion':
      next = addTemporaryStatsToLane(next, lane, owner, 2, 2)
      break
    case 'rw-spell-war-banner': {
      const legionCount = myLaneCards.filter(c => c.name.toLowerCase().includes('legion')).length
      const bonus = legionCount >= 3 ? 2 : 1
      next = addTemporaryStatsToLane(next, lane, owner, bonus, 0)
      break
    }
    case 'vrune-spell-wrath-of-legion':
      next = addTemporaryStatsToLane(next, 'battlefieldA', owner, 3, 3)
      next = addTemporaryStatsToLane(next, 'battlefieldB', owner, 3, 3)
      break
    default:
      break
  }
  return next
}

export function resolveSpellCast(
  state: GameState,
  spell: SpellCard,
  owner: PlayerId,
  lane: BattlefieldId,
  targetIds: string[]
): GameState {
  console.log('[spell-resolve] cast', {
    spellId: spell.id,
    owner,
    lane,
    targets: targetIds,
    effectType: spell.effect.type,
  })
  let next = state
  const enemy = opponentOf(owner)
  const effect = spell.effect

  if (effect.type === 'targeted_damage') {
    const target = targetIds[0]
    if (target) {
      if (target.startsWith('tower:')) {
        next = applyTowerDamage(next, owner, effect.damage || 0, lane)
      } else {
        next = applyDamageToCard(next, target, effect.damage || 0)
        if (effect.debuffAttack) {
          next = addTemporaryAttack(next, target, -Math.abs(effect.debuffAttack))
        }
      }
    }
  }

  if (effect.type === 'multi_target_damage') {
    const uniqueTargets = [...new Set(targetIds)]
    for (const target of uniqueTargets) {
      if (target.startsWith('tower:')) {
        next = applyTowerDamage(next, owner, effect.damage || 0, lane)
      } else {
        next = applyDamageToCard(next, target, effect.damage || 0)
      }
    }
  }

  if (effect.type === 'aoe_damage' || effect.type === 'all_units_damage') {
    const enemyCards = collectBattlefieldCards(next).filter(card => card.owner === enemy)
    for (const card of enemyCards) {
      if (card.cardType === 'hero' || card.cardType === 'generic') {
        next = applyDamageToCard(next, card.id, effect.damage || 0)
      }
    }
  }

  if (effect.type === 'create_tokens' || effect.type === 'tokenize') {
    const count = effect.tokenCount || 0
    const attack = effect.tokenStats?.attack ?? 1
    const health = effect.tokenStats?.health ?? 1
    for (let i = 0; i < count; i++) {
      next = createTokenInHand(next, owner, attack, health, effect.tokenType)
    }
  }

  if (effect.towerDamage) {
    next = applyTowerDamage(next, owner, effect.towerDamage)
  }

  const spellCountThisTurn =
    owner === 'player1' ? next.metadata.player1SpellsCastThisTurn + 1 : next.metadata.player2SpellsCastThisTurn + 1
  const isMultiSpell = spellCountThisTurn >= 2

  if (spell.id === 'rb-spell-double-strike' || spell.id === 'black-spell-execute-weakness') {
    if (isMultiSpell && effect.drawCount) {
      next = drawCards(next, owner, effect.drawCount)
    }
  } else if (effect.drawCount) {
    next = drawCards(next, owner, effect.drawCount)
  }

  if (spell.id === 'rb-spell-spell-storm' && isMultiSpell && spell.refundMana) {
    const manaKey = owner === 'player1' ? 'player1Mana' : 'player2Mana'
    next = {
      ...next,
      metadata: {
        ...next.metadata,
        [manaKey]: (next.metadata[manaKey] as number) + spell.refundMana,
      },
    }
  }

  next = applyCardSpecificSpellRules(next, spell, owner, lane)
  next = onSpellCast(owner, spell, next)
  console.log('[spell-resolve] done', {
    spellId: spell.id,
    owner,
    p1TowerA: next.metadata.towerA_player1_HP,
    p2TowerA: next.metadata.towerA_player2_HP,
    p1TowerB: next.metadata.towerB_player1_HP,
    p2TowerB: next.metadata.towerB_player2_HP,
  })
  return next
}
