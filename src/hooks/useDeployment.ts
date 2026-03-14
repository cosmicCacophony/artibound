import { useCallback } from 'react'
import { Card, GenericUnit, Hero, Location, MAX_UNITS_PER_LANE, PlayerId, RuneColor, SpellCard } from '../game/types'
import { useGameContext } from '../context/GameContext'

function countRunes(runes: RuneColor[]): Record<RuneColor, number> {
  return runes.reduce<Record<RuneColor, number>>((acc, rune) => {
    acc[rune] = (acc[rune] || 0) + 1
    return acc
  }, {} as Record<RuneColor, number>)
}

function getAvailableRunes(gameState: ReturnType<typeof useGameContext>['gameState'], player: PlayerId): RuneColor[] {
  return [
    ...(gameState.metadata.laneRunes?.battlefieldA[player] || []),
    ...(gameState.metadata.temporaryRunes?.[player] || []),
  ]
}

function canPayRuneCost(card: Card, availableRunes: RuneColor[]): boolean {
  if (!card.runeCost || card.runeCost.length === 0) {
    return true
  }

  const available = countRunes(availableRunes)
  const required = countRunes(card.runeCost)
  return Object.entries(required).every(([color, count]) => (available[color as RuneColor] || 0) >= count)
}

function applyOnDeployEffect(field: Card[], player: PlayerId, sourceCard: Card): Card[] {
  if ((sourceCard.cardType !== 'hero' && sourceCard.cardType !== 'generic') || !sourceCard.onDeployEffect) {
    return field
  }

  const targetable = field.filter(card => {
    if (card.cardType !== 'hero' && card.cardType !== 'generic') {
      return false
    }
    return sourceCard.onDeployEffect?.target === 'friendly' ? card.owner === player : card.owner !== player
  }) as Array<Hero | GenericUnit>

  const target = targetable[0]
  if (!target) {
    return field
  }

  return field.map(card => {
    if (card.id !== target.id || (card.cardType !== 'hero' && card.cardType !== 'generic')) {
      return card
    }

    const current = card.statusEffects || { weak: 0, vulnerable: 0, strength: 0 }
    return {
      ...card,
      statusEffects: {
        ...current,
        [sourceCard.onDeployEffect!.status]: current[sourceCard.onDeployEffect!.status] + sourceCard.onDeployEffect!.amount,
      },
    }
  })
}

function sendHeroToCommandZone(gameState: ReturnType<typeof useGameContext>['gameState'], hero: Hero): ReturnType<typeof useGameContext>['gameState'] {
  const owner = hero.owner
  return {
    ...gameState,
    battlefieldA: {
      ...gameState.battlefieldA,
      [owner]: gameState.battlefieldA[owner].filter(card => card.id !== hero.id),
    },
    [`${owner}DeployZone`]: [
      ...(gameState[`${owner}DeployZone` as const] as Card[]),
      {
        ...hero,
        location: 'commandZone',
        currentHealth: hero.maxHealth,
        summoningSick: false,
        tapped: false,
      },
    ],
  } as typeof gameState
}

export function useDeployment() {
  const {
    gameState,
    setGameState,
    selectedCard,
    selectedCardId,
    setSelectedCardId,
  } = useGameContext()

  const metadata = gameState.metadata

  const handleDeploy = useCallback((location: Location, _unused?: number, cardOverride?: Card) => {
    const activeCard = cardOverride || selectedCard
    const activeCardId = cardOverride?.id || selectedCardId
    if (!activeCard || !activeCardId) return

    if (metadata.currentPhase !== 'play') {
      alert(`Cannot play cards during ${metadata.currentPhase} phase.`)
      return
    }

    if (location !== 'battlefieldA' && location !== 'base') {
      alert('The prototype only uses one lane.')
      return
    }

    if (metadata.actionPlayer && metadata.actionPlayer !== activeCard.owner) {
      alert('It is not your turn to act.')
      return
    }

    const player = activeCard.owner
    const manaKey = player === 'player1' ? 'player1Mana' : 'player2Mana'
    const playerMana = metadata[manaKey]

    if (activeCard.manaCost && activeCard.manaCost > playerMana) {
      alert(`Not enough mana. Need ${activeCard.manaCost}, have ${playerMana}.`)
      return
    }

    setGameState(prev => {
      const ownerField = prev.battlefieldA[player]
      const availableRunes = getAvailableRunes(prev, player)

      if (location === 'battlefieldA' && activeCard.cardType !== 'spell' && ownerField.length >= MAX_UNITS_PER_LANE) {
        alert('Lane is full.')
        return prev
      }

      if (!canPayRuneCost(activeCard, availableRunes)) {
        alert(`Not enough runes to play ${activeCard.name}.`)
        return prev
      }

      const updatedMana = (prev.metadata[manaKey] as number) - (activeCard.manaCost || 0)
      const updatedHand = prev[`${player}Hand` as const].filter(card => card.id !== activeCard.id)
      const updatedDeployZone = prev[`${player}DeployZone` as const].filter(card => card.id !== activeCard.id)
      const sourcePatch = activeCard.location === 'commandZone'
        ? { [`${player}DeployZone`]: updatedDeployZone }
        : { [`${player}Hand`]: updatedHand }

      if (location === 'battlefieldA' && (activeCard.cardType === 'generic' || activeCard.cardType === 'hero')) {
        const deployedCard: Card = {
          ...activeCard,
          location: 'battlefieldA',
          summoningSick: true,
          tapped: false,
        }

        return {
          ...prev,
          ...sourcePatch,
          battlefieldA: {
            ...prev.battlefieldA,
            [player]: applyOnDeployEffect(
              [...ownerField, deployedCard],
              player,
              deployedCard
            ),
          },
          metadata: {
            ...prev.metadata,
            [manaKey]: updatedMana,
          },
        }
      }

      if (location === 'base') {
        return {
          ...prev,
          battlefieldA: {
            ...prev.battlefieldA,
            [player]: ownerField.filter(card => card.id !== activeCard.id),
          },
          [`${player}Base`]: [
            ...(prev[`${player}Base` as const] as Card[]),
            { ...activeCard, location: 'base' as const },
          ],
        }
      }

      return prev
    })

    setSelectedCardId(null)
  }, [metadata, selectedCard, selectedCardId, setGameState, setSelectedCardId])

  const handleCastSpellOnTarget = useCallback((_targetCard: Card, battlefieldId: 'battlefieldA' | 'battlefieldB', spellOverride?: SpellCard) => {
    const spell = spellOverride || (selectedCard?.cardType === 'spell' ? selectedCard as SpellCard : null)
    const targetCard = _targetCard
    if (!spell || battlefieldId !== 'battlefieldA') return

    if (spell.effect.type !== 'targeted_damage') {
      return
    }

    setGameState(prev => {
      const player = spell.owner
      const manaKey = player === 'player1' ? 'player1Mana' : 'player2Mana'
      const targetOwner = targetCard.owner
      const damage = spell.effect.damage || 0
      const updatedMana = (prev.metadata[manaKey] as number) - (spell.manaCost || 0)
      const availableRunes = getAvailableRunes(prev, player)

      if ((spell.manaCost || 0) > (prev.metadata[manaKey] as number) || !canPayRuneCost(spell, availableRunes)) {
        return prev
      }

      const updatedBattlefieldCards = prev.battlefieldA[targetOwner].map(card => {
        if (card.id !== targetCard.id || (card.cardType !== 'hero' && card.cardType !== 'generic')) {
          return card
        }

        return {
          ...card,
          currentHealth: card.currentHealth - damage,
        }
      })

      let nextState = {
        ...prev,
        [`${player}Hand`]: prev[`${player}Hand` as const].filter(card => card.id !== spell.id),
        battlefieldA: {
          ...prev.battlefieldA,
          [targetOwner]: updatedBattlefieldCards.filter(card => {
            if (card.id !== targetCard.id || (card.cardType !== 'hero' && card.cardType !== 'generic')) {
              return true
            }
            return card.currentHealth > 0
          }),
        },
        metadata: {
          ...prev.metadata,
          [manaKey]: updatedMana,
        },
      } as typeof prev

      const updatedTarget = updatedBattlefieldCards.find(card => card.id === targetCard.id)
      if (updatedTarget && (updatedTarget.cardType === 'hero') && updatedTarget.currentHealth <= 0) {
        nextState = sendHeroToCommandZone(nextState, updatedTarget)
      }

      return nextState
    })

    setSelectedCardId(null)
  }, [selectedCard, setGameState, setSelectedCardId])

  const handlePlaySeal = useCallback((sealId: string, owner: PlayerId) => {
    setGameState(prev => {
      if (prev.metadata.activePlayer !== owner || prev.metadata.currentPhase !== 'play') {
        return prev
      }

      const manaKey = owner === 'player1' ? 'player1Mana' : 'player2Mana'
      const sealKey = owner === 'player1' ? 'player1Seals' : 'player2Seals'
      const seal = prev.metadata[sealKey].find(item => item.id === sealId)
      if (!seal || seal.inPlay || (seal.manaCost || 0) > (prev.metadata[manaKey] as number)) {
        return prev
      }

      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          [manaKey]: (prev.metadata[manaKey] as number) - (seal.manaCost || 0),
          [sealKey]: prev.metadata[sealKey].map(item => item.id === sealId ? { ...item, inPlay: true, tapped: false } : item),
        },
      }
    })
  }, [setGameState])

  const handleTapSeal = useCallback((sealId: string, owner: PlayerId) => {
    setGameState(prev => {
      if (prev.metadata.activePlayer !== owner || prev.metadata.currentPhase !== 'play') {
        return prev
      }

      const sealKey = owner === 'player1' ? 'player1Seals' : 'player2Seals'
      const seal = prev.metadata[sealKey].find(item => item.id === sealId)
      if (!seal || !seal.inPlay || seal.tapped) {
        return prev
      }

      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          [sealKey]: prev.metadata[sealKey].map(item => item.id === sealId ? { ...item, tapped: true } : item),
          temporaryRunes: {
            ...(prev.metadata.temporaryRunes || { player1: [], player2: [] }),
            [owner]: [...(prev.metadata.temporaryRunes?.[owner] || []), seal.color],
          },
        },
      }
    })
  }, [setGameState])

  const handleRemoveFromBattlefield = useCallback((card: Card, _location: 'battlefieldA' | 'battlefieldB') => {
    const owner = card.owner
    setGameState(prev => {
      if (card.cardType === 'hero') {
        return sendHeroToCommandZone(prev, card)
      }

      return {
        ...prev,
        battlefieldA: {
          ...prev.battlefieldA,
          [owner]: prev.battlefieldA[owner].filter(unit => unit.id !== card.id),
        },
      }
    })
  }, [setGameState])

  const handleEquipItem = useCallback((_target: Hero | GenericUnit, _itemCard: never, _battlefieldId: 'battlefieldA' | 'battlefieldB') => {
    alert('Equipment is disabled in the single-lane prototype.')
  }, [])

  return {
    handleDeploy,
    handleCastSpellOnTarget,
    handlePlaySeal,
    handleTapSeal,
    handleRemoveFromBattlefield,
    handleEquipItem,
  }
}
