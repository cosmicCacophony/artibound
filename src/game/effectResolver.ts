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
    case 'black-spell-soul-siphon':
      return {
        targetType: 'any',
        targetSide: 'any',
      }
    case 'black-sig-shadow-strike':
      return {
        targetType: 'any',
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
      break
  }
  if (spell.name === 'Shadow Strike') {
    return {
      targetType: 'any',
      targetSide: 'enemy',
      maxHealth: 4,
    }
  }
  // Data-driven targeting based on spell.effect attributes
  if (spell.effect?.type === 'targeted_damage') {
    const hasDamage = (spell.effect.damage || 0) > 0
    const hasDebuff = (spell.effect.debuffAttack || 0) > 0
    const affectsUnits = Boolean(spell.effect.affectsUnits)
    const affectsHeroes = Boolean(spell.effect.affectsHeroes)
    
    // Spells with only towerDamage and no unit/hero targeting don't need targeting UI
    if (spell.effect.towerDamage && !affectsUnits && !affectsHeroes && !hasDamage && !hasDebuff) {
      return null
    }
    
    // Spells that affect units or heroes need targeting
    if ((hasDamage || hasDebuff) && (affectsUnits || affectsHeroes)) {
      return {
        targetType: affectsUnits && affectsHeroes ? 'any' : (affectsUnits ? 'unit' : 'hero'),
        targetSide: 'enemy',
        maxHealth: spell.effect.maxTargetHealth, // Optional health restriction
      }
    }
  }
  return null
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

export const drawCards = (state: GameState, owner: PlayerId, count: number): GameState => {
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
  console.log('[spell-damage] applyDamageToTarget', {
    targetName: target.name,
    targetId: target.id,
    targetType: target.cardType,
    targetOwner: target.owner,
    currentHealth: target.currentHealth,
    damage,
    newHealth,
    willDie: newHealth <= 0,
  })
  if (newHealth <= 0) {
    // Target is killed - remove from battlefield
    let nextState = removeCardFromAllZones(state, target.id)
    
    // If it's a hero, add to base with death cooldown
    if (target.cardType === 'hero') {
      const hero = target as import('./types').Hero
      const deadHero = {
        ...hero,
        location: 'base' as const,
        currentHealth: 0,
        slot: undefined,
      }
      
      // Add to owner's base and set cooldown
      if (hero.owner === 'player1') {
        nextState = {
          ...nextState,
          player1Base: [...nextState.player1Base, deadHero],
          metadata: {
            ...nextState.metadata,
            deathCooldowns: {
              ...nextState.metadata.deathCooldowns,
              [hero.id]: 2, // 2 turn cooldown
            },
          },
        }
      } else {
        nextState = {
          ...nextState,
          player2Base: [...nextState.player2Base, deadHero],
          metadata: {
            ...nextState.metadata,
            deathCooldowns: {
              ...nextState.metadata.deathCooldowns,
              [hero.id]: 2, // 2 turn cooldown
            },
          },
        }
      }
      
      // Remove runes from the hero's owner's pool
      // Note: We can't import removeRunesFromHero here due to circular deps,
      // so we'll handle rune removal inline
      const runePoolKey = hero.owner === 'player1' ? 'player1RunePool' : 'player2RunePool'
      const currentPool = nextState.metadata[runePoolKey] as import('./types').RunePool
      if (hero.colors && hero.colors.length > 0) {
        const newRunes = [...currentPool.runes]
        for (const color of hero.colors) {
          const index = newRunes.indexOf(color as import('./types').RuneColor)
          if (index !== -1) {
            newRunes.splice(index, 1)
          }
        }
        nextState = {
          ...nextState,
          metadata: {
            ...nextState.metadata,
            [runePoolKey]: {
              ...currentPool,
              runes: newRunes,
            },
          },
        }
      }
      console.log('[spell-damage] hero death processed', {
        heroName: hero.name,
        heroId: hero.id,
        heroOwner: hero.owner,
        addedToBase: hero.owner + 'Base',
        cooldownSet: 2,
        deathCooldowns: nextState.metadata.deathCooldowns,
      })
    }
    // For non-hero units (generic), just remove them completely
    return nextState
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

const applyDamageToOpponentTowers = (state: GameState, owner: PlayerId, damage: number): GameState => {
  const opponent: PlayerId = owner === 'player1' ? 'player2' : 'player1'
  return applyDamageToOwnTowers(state, opponent, damage)
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

const getBattlefieldCards = (state: GameState): Card[] => ([
  ...state.battlefieldA.player1,
  ...state.battlefieldA.player2,
  ...state.battlefieldB.player1,
  ...state.battlefieldB.player2,
])

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

const applyDebuffToTarget = (state: GameState, targetId: string, attackDebuff: number, healthDebuff: number): GameState => {
  const updateCard = (card: Card): Card => {
    if (card.id !== targetId) return card
    if (!('attack' in card)) return card
    const newAttack = Math.max(0, (card.attack || 0) - attackDebuff)
    const newHealth = 'currentHealth' in card ? Math.max(1, (card.currentHealth || 0) - healthDebuff) : undefined
    return {
      ...card,
      attack: newAttack,
      ...(newHealth !== undefined ? { currentHealth: newHealth } : {}),
    }
  }
  
  return {
    ...state,
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

export const isValidTargetForContext = (state: GameState, targetId: string, context: TargetingContext, owner: PlayerId): boolean => {
  const target = findCardById(state, targetId)
  if (!target) return false
  if (context.targetType === 'unit' && target.cardType === 'hero') return false
  if (context.targetType === 'hero' && target.cardType !== 'hero') return false
  if (context.targetType === 'any' && target.cardType !== 'hero' && target.cardType !== 'generic') return false

  if (context.targetSide === 'friendly' && target.owner !== owner) return false
  if (context.targetSide === 'enemy' && target.owner === owner) return false

  if (context.allowBattlefield && context.allowBattlefield !== 'any') {
    const targetBattlefield = findBattlefieldForCard(state, targetId)
    if (targetBattlefield !== context.allowBattlefield) return false
  }

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
  console.log('[spell-targeting] resolveSpellEffect', {
    spellId: spell.id,
    templateId,
    spellName: spell.name,
    effectType: spell.effect?.type,
    targetingContext,
  })

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

  // ========================================
  // DATA-DRIVEN EFFECT RESOLUTION
  // ========================================

  // Handle direct tower damage (non-targeted, hits opponent's towers)
  if (spell.effect.towerDamage) {
    nextState = applyDamageToOpponentTowers(nextState, owner, spell.effect.towerDamage)
  }

  // Handle card draw (generic - works for any spell with drawCount)
  if (spell.effect.drawCount && spell.effect.type !== 'draw_and_heal') {
    nextState = drawCards(nextState, owner, spell.effect.drawCount)
  }

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
      // Apply damage if present
      if (spell.effect.damage) {
        nextState = applyDamageToTarget(nextState, target, spell.effect.damage)
      }
      // Apply attack debuff if present
      if (spell.effect.debuffAttack) {
        nextState = applyDebuffToTarget(nextState, target.id, spell.effect.debuffAttack, 0)
      }
    }
  }

  if (spell.effect.type === 'aoe_damage') {
    const affectsUnits = Boolean(spell.effect.affectsUnits)
    const affectsHeroes = Boolean(spell.effect.affectsHeroes)
    const affectsOwn = spell.effect.affectsOwnUnits ?? true
    const affectsEnemy = spell.effect.affectsEnemyUnits ?? true
    const targets = getBattlefieldCards(nextState).filter(card => {
      if (!('currentHealth' in card)) return false
      if (card.cardType === 'hero' && !affectsHeroes) return false
      if (card.cardType !== 'hero' && !affectsUnits) return false
      if (card.owner === owner && !affectsOwn) return false
      if (card.owner !== owner && !affectsEnemy) return false
      return true
    }).map(card => card.id)

    targets.forEach(cardId => {
      const target = findCardById(nextState, cardId)
      if (target) {
        nextState = applyDamageToTarget(nextState, target, spell.effect.damage || 0)
      }
    })
    // Note: towerDamage for AOE spells is handled above in the generic towerDamage block
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
