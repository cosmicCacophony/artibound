import { BaseCard, Card, GameState, PendingEffect, PlayerId, SpellCard, TargetingContext, TokenDefinition } from './types'
import { createCardFromTemplate } from './sampleData'

interface ResolveSpellEffectInput {
  gameState: GameState
  spell: SpellCard
  owner: PlayerId
  targetId?: string
  casterHeroId?: string
}

interface ResolveSpellEffectResult {
  nextState: GameState
  pendingEffect: PendingEffect | null
}

export const getTemplateId = (cardId: string): string => {
  const ownerIndex = cardId.indexOf('-player1-')
  if (ownerIndex !== -1) {
    return cardId.slice(0, ownerIndex)
  }
  const ownerIndex2 = cardId.indexOf('-player2-')
  if (ownerIndex2 !== -1) {
    return cardId.slice(0, ownerIndex2)
  }
  return cardId
}

const getTargetingContextForSpell = (spell: SpellCard): TargetingContext | null => {
  const templateId = getTemplateId(spell.id)
  switch (templateId) {
    case 'black-sig-shadow-strike':
      return {
        targetType: 'unit',
        targetSide: 'enemy',
        maxHealth: 4,
      }
    case 'blue-spell-3u-bounce':
      return {
        targetType: 'unit',
        targetSide: 'any',
      }
    case 'ubg-spell-invulnerable-reflect':
      return {
        targetType: 'hero',
        targetSide: 'friendly',
      }
    case 'ubg-spell-aoe-6-distributed':
    case 'ubr-spell-exorcism':
      return {
        targetType: 'hero',
        targetSide: 'friendly',
      }
    default:
      return null
  }
}

export const buildTokenDefinitions = (spell: SpellCard): TokenDefinition[] => {
  const count = spell.effect.tokenCount || 0
  const tokenStats = spell.effect.tokenStats || { attack: spell.effect.tokenPower || 1, health: spell.effect.tokenHealth || 1 }
  const tokenType = spell.effect.tokenType || 'Token'
  const tokenName = `${tokenType.charAt(0).toUpperCase()}${tokenType.slice(1)} Token`
  const tokenKeywords = spell.effect.tokenKeywords || []
  const timestamp = Date.now()

  return Array.from({ length: count }, (_, index) => ({
    id: `${getTemplateId(spell.id)}-token-${timestamp}-${index}`,
    name: tokenName,
    attack: tokenStats.attack,
    health: tokenStats.health,
    keywords: tokenKeywords,
    tribe: spell.effect.tokenType,
  }))
}

const getAllCards = (state: GameState): Card[] => [
  ...state.player1Hand,
  ...state.player2Hand,
  ...state.player1Base,
  ...state.player2Base,
  ...state.player1DeployZone,
  ...state.player2DeployZone,
  ...state.battlefieldA.player1,
  ...state.battlefieldA.player2,
  ...state.battlefieldB.player1,
  ...state.battlefieldB.player2,
]

const findCardById = (state: GameState, cardId: string): Card | null =>
  getAllCards(state).find(card => card.id === cardId) || null

const findBattlefieldForCard = (state: GameState, cardId: string): 'battlefieldA' | 'battlefieldB' | null => {
  if (state.battlefieldA.player1.some(card => card.id === cardId) || state.battlefieldA.player2.some(card => card.id === cardId)) {
    return 'battlefieldA'
  }
  if (state.battlefieldB.player1.some(card => card.id === cardId) || state.battlefieldB.player2.some(card => card.id === cardId)) {
    return 'battlefieldB'
  }
  return null
}

const removeCardFromAllZones = (state: GameState, cardId: string): GameState => ({
  ...state,
  player1Hand: state.player1Hand.filter(card => card.id !== cardId),
  player2Hand: state.player2Hand.filter(card => card.id !== cardId),
  player1Base: state.player1Base.filter(card => card.id !== cardId),
  player2Base: state.player2Base.filter(card => card.id !== cardId),
  player1DeployZone: state.player1DeployZone.filter(card => card.id !== cardId),
  player2DeployZone: state.player2DeployZone.filter(card => card.id !== cardId),
  battlefieldA: {
    player1: state.battlefieldA.player1.filter(card => card.id !== cardId),
    player2: state.battlefieldA.player2.filter(card => card.id !== cardId),
  },
  battlefieldB: {
    player1: state.battlefieldB.player1.filter(card => card.id !== cardId),
    player2: state.battlefieldB.player2.filter(card => card.id !== cardId),
  },
})

const moveCardToBase = (state: GameState, card: Card): GameState => {
  const cleanedState = removeCardFromAllZones(state, card.id)
  const updatedCard: Card = {
    ...card,
    location: 'base',
    slot: undefined,
  }
  if (card.owner === 'player1') {
    return {
      ...cleanedState,
      player1Base: [...cleanedState.player1Base, updatedCard],
    }
  }
  return {
    ...cleanedState,
    player2Base: [...cleanedState.player2Base, updatedCard],
  }
}

const drawCards = (state: GameState, owner: PlayerId, count: number): GameState => {
  if (count <= 0) return state
  const libraryKey = owner === 'player1' ? 'player1Library' : 'player2Library'
  const library = (state[libraryKey] || []) as BaseCard[]
  if (library.length === 0) return state

  const drawCount = Math.min(count, library.length)
  const drawnTemplates = library.slice(0, drawCount)
  const remainingLibrary = library.slice(drawCount)
  const drawnCards = drawnTemplates.map(template => createCardFromTemplate(template, owner, 'hand'))

  if (owner === 'player1') {
    return {
      ...state,
      player1Hand: [...state.player1Hand, ...drawnCards],
      player1Library: remainingLibrary,
    }
  }
  return {
    ...state,
    player2Hand: [...state.player2Hand, ...drawnCards],
    player2Library: remainingLibrary,
  }
}

const applyDamageToTarget = (state: GameState, target: Card, damage: number): GameState => {
  if (!('currentHealth' in target)) return state
  const newHealth = (target.currentHealth || 0) - damage
  if (newHealth <= 0) {
    return removeCardFromAllZones(state, target.id)
  }

  const updateCard = (card: Card) =>
    card.id === target.id ? { ...card, currentHealth: newHealth } : card

  return {
    ...state,
    player1Hand: state.player1Hand.map(updateCard),
    player2Hand: state.player2Hand.map(updateCard),
    player1Base: state.player1Base.map(updateCard),
    player2Base: state.player2Base.map(updateCard),
    player1DeployZone: state.player1DeployZone.map(updateCard),
    player2DeployZone: state.player2DeployZone.map(updateCard),
    battlefieldA: {
      player1: state.battlefieldA.player1.map(updateCard),
      player2: state.battlefieldA.player2.map(updateCard),
    },
    battlefieldB: {
      player1: state.battlefieldB.player1.map(updateCard),
      player2: state.battlefieldB.player2.map(updateCard),
    },
  }
}

const applyDamageToOwnTowers = (state: GameState, owner: PlayerId, damage: number): GameState => {
  const towerAKey = owner === 'player1' ? 'towerA_player1_HP' : 'towerA_player2_HP'
  const towerBKey = owner === 'player1' ? 'towerB_player1_HP' : 'towerB_player2_HP'

  return {
    ...state,
    metadata: {
      ...state.metadata,
      [towerAKey]: Math.max(0, (state.metadata as any)[towerAKey] - damage),
      [towerBKey]: Math.max(0, (state.metadata as any)[towerBKey] - damage),
    },
  }
}

const applyDamageToTower = (state: GameState, battlefieldId: 'battlefieldA' | 'battlefieldB', owner: PlayerId, damage: number): GameState => {
  const towerKey = battlefieldId === 'battlefieldA'
    ? (owner === 'player1' ? 'towerA_player1_HP' : 'towerA_player2_HP')
    : (owner === 'player1' ? 'towerB_player1_HP' : 'towerB_player2_HP')

  return {
    ...state,
    metadata: {
      ...state.metadata,
      [towerKey]: Math.max(0, (state.metadata as any)[towerKey] - damage),
    },
  }
}

const applyBarrierToTarget = (state: GameState, target: Card): GameState => {
  return {
    ...state,
    metadata: {
      ...state.metadata,
      barrierUnits: {
        ...state.metadata.barrierUnits,
        [target.id]: state.metadata.currentTurn,
      },
    },
  }
}

export const isValidTargetForContext = (state: GameState, targetId: string, context: TargetingContext, owner: PlayerId): boolean => {
  const target = findCardById(state, targetId)
  if (!target) return false
  if (context.targetType === 'unit' && target.cardType === 'hero') return false
  if (context.targetType === 'hero' && target.cardType !== 'hero') return false

  if (context.targetSide === 'friendly' && target.owner !== owner) return false
  if (context.targetSide === 'enemy' && target.owner === owner) return false

  if (typeof context.minHealth === 'number' && 'currentHealth' in target) {
    if ((target.currentHealth || 0) < context.minHealth) return false
  }
  if (typeof context.maxHealth === 'number' && 'currentHealth' in target) {
    if ((target.currentHealth || 0) > context.maxHealth) return false
  }

  return true
}

export const resolveSpellEffect = ({
  gameState,
  spell,
  owner,
  targetId,
}: ResolveSpellEffectInput): ResolveSpellEffectResult => {
  const targetingContext = getTargetingContextForSpell(spell)

  const templateId = getTemplateId(spell.id)

  if (targetingContext && !targetId) {
    return {
      nextState: gameState,
      pendingEffect: {
        cardId: templateId,
        owner,
        effect: spell.effect,
        targeting: targetingContext,
        selectedTargetIds: [],
      },
    }
  }

  if (spell.effect.type === 'create_tokens' || spell.effect.type === 'tokenize') {
    const tokens = buildTokenDefinitions(spell)
    return {
      nextState: gameState,
      pendingEffect: {
        cardId: templateId,
        owner,
        effect: spell.effect,
        temporaryZone: {
          type: 'tokenize',
          title: 'Token Creation',
          description: 'Drag tokens onto the battlefield.',
          owner,
          tokens,
        },
      },
    }
  }

  if (targetingContext && targetId && !isValidTargetForContext(gameState, targetId, targetingContext, owner)) {
    return {
      nextState: gameState,
      pendingEffect: {
        cardId: templateId,
        owner,
        effect: spell.effect,
        targeting: targetingContext,
        selectedTargetIds: [],
      },
    }
  }

  let nextState = gameState

  if (spell.effect.type === 'draw_and_heal') {
    if (templateId === 'black-spell-3b-draw') {
      nextState = drawCards(nextState, owner, spell.effect.drawCount || 0)
      nextState = applyDamageToOwnTowers(nextState, owner, 1)
    } else {
      nextState = drawCards(nextState, owner, spell.effect.drawCount || 0)
      if (spell.effect.healAmount) {
        const nexusKey = owner === 'player1' ? 'player1NexusHP' : 'player2NexusHP'
        nextState = {
          ...nextState,
          metadata: {
            ...nextState.metadata,
            [nexusKey]: Math.max(0, (nextState.metadata as any)[nexusKey] + spell.effect.healAmount),
          },
        }
      }
    }
  }

  if (spell.effect.type === 'targeted_damage' && targetId) {
    const target = findCardById(nextState, targetId)
    if (target) {
      nextState = applyDamageToTarget(nextState, target, spell.effect.damage || 0)
    }
  }

  if (spell.effect.type === 'return_to_base' && targetId) {
    const target = findCardById(nextState, targetId)
    if (target) {
      nextState = moveCardToBase(nextState, target)
    }
  }

  if (spell.effect.type === 'conal_damage' && targetId) {
    const caster = findCardById(nextState, targetId)
    if (caster && caster.cardType === 'hero') {
      const battlefieldId = findBattlefieldForCard(nextState, caster.id)
      if (battlefieldId) {
        const enemyOwner: PlayerId = caster.owner === 'player1' ? 'player2' : 'player1'
        const enemyField = nextState[battlefieldId][enemyOwner]
        const slot = caster.slot || 0
        const targetSlots = [slot - 1, slot, slot + 1].filter(s => s >= 1 && s <= 5)
        const targets = enemyField.filter(card => targetSlots.includes(card.slot || 0) && 'currentHealth' in card)

        if (targets.length === 0) {
          nextState = applyDamageToTower(nextState, battlefieldId, enemyOwner, spell.effect.conalTotalDamage || 0)
        } else {
          const totalDamage = spell.effect.conalTotalDamage || 0
          const baseDamage = Math.floor(totalDamage / targets.length)
          let remainder = totalDamage % targets.length
          targets.forEach(target => {
            const damage = baseDamage + (remainder > 0 ? 1 : 0)
            if (remainder > 0) remainder -= 1
            nextState = applyDamageToTarget(nextState, target, damage)
          })
        }
      }
    }
  }

  if (templateId === 'ubg-spell-invulnerable-reflect' && targetId) {
    const target = findCardById(nextState, targetId)
    if (target) {
      nextState = applyBarrierToTarget(nextState, target)
    }
  }

  return { nextState, pendingEffect: null }
}
