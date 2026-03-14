import { useCallback } from 'react'
import { Card, GameMetadata, Hero, PlayerId, Seal } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { resolveManualCombat } from '../game/combatSystem'
import { createCardFromTemplate } from '../game/sampleData'
import { checkWinCondition } from '../game/winCondition'

function getRandomCards(pool: Card[], owner: PlayerId, count: number): Card[] {
  return Array.from({ length: count }, () => {
    const template = pool[Math.floor(Math.random() * pool.length)]
    return createCardFromTemplate(template, owner, 'hand')
  })
}

function clearTemporaryTurnState(cards: Card[], owner: PlayerId, nextActivePlayer: PlayerId): Card[] {
  return cards.map(card => {
    if (card.cardType !== 'hero' && card.cardType !== 'generic') {
      return card
    }

    return {
      ...card,
      temporaryAttack: 0,
      temporaryHP: 0,
      tapped: owner === nextActivePlayer ? false : card.tapped,
      summoningSick: owner === nextActivePlayer ? false : card.summoningSick,
    }
  })
}

function untapSeals(seals: Seal[]): Seal[] {
  return seals.map(seal => ({ ...seal, tapped: false }))
}

function isHero(card: Card): card is Hero {
  return card.cardType === 'hero'
}

export function useTurnManagement() {
  const {
    gameState,
    setGameState,
    setShowCombatSummary,
    setCombatSummaryData,
    player1SidebarCards,
    player2SidebarCards,
  } = useGameContext()

  const metadata = gameState.metadata

  const handleEndTurn = useCallback(() => {
    setGameState(prev => {
      const nextActivePlayer: PlayerId = prev.metadata.activePlayer === 'player1' ? 'player2' : 'player1'
      const nextPlayerHandKey = nextActivePlayer === 'player1' ? 'player1Hand' : 'player2Hand'
      const nextPlayerManaKey = nextActivePlayer === 'player1' ? 'player1Mana' : 'player2Mana'
      const nextPlayerMaxManaKey = nextActivePlayer === 'player1' ? 'player1MaxMana' : 'player2MaxMana'
      const nextDraws = getRandomCards(
        (nextActivePlayer === 'player1' ? player1SidebarCards : player2SidebarCards) as Card[],
        nextActivePlayer,
        2
      )

      return {
        ...prev,
        [nextPlayerHandKey]: [...(prev[nextPlayerHandKey] as Card[]), ...nextDraws],
        battlefieldA: {
          player1: clearTemporaryTurnState(prev.battlefieldA.player1, 'player1', nextActivePlayer),
          player2: clearTemporaryTurnState(prev.battlefieldA.player2, 'player2', nextActivePlayer),
        },
        metadata: {
          ...prev.metadata,
          currentTurn: prev.metadata.currentTurn + 1,
          activePlayer: nextActivePlayer,
          actionPlayer: nextActivePlayer,
          initiativePlayer: nextActivePlayer,
          currentPhase: 'resource',
          [nextPlayerManaKey]: prev.metadata[nextPlayerMaxManaKey] as number,
          player1Seals: nextActivePlayer === 'player1' ? untapSeals(prev.metadata.player1Seals) : prev.metadata.player1Seals,
          player2Seals: nextActivePlayer === 'player2' ? untapSeals(prev.metadata.player2Seals) : prev.metadata.player2Seals,
          resourceChoicesMade: {
            ...(prev.metadata.resourceChoicesMade || { player1: false, player2: false }),
            [nextActivePlayer]: false,
          },
          temporaryRunes: { player1: [], player2: [] },
          declaredAttackers: [],
          blockerAssignments: {},
          selectedBlockerId: null,
          player1Passed: false,
          player2Passed: false,
        },
      }
    })
  }, [player1SidebarCards, player2SidebarCards, setGameState])

  const handleStartCombat = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        currentPhase: 'declare_attackers',
        actionPlayer: prev.metadata.activePlayer,
        declaredAttackers: [],
        blockerAssignments: {},
        selectedBlockerId: null,
      },
    }))
  }, [setGameState])

  const handleDeclareAttacker = useCallback((cardId: string) => {
    setGameState(prev => {
      const attacker = prev.battlefieldA[prev.metadata.activePlayer].find(card => card.id === cardId)
      if (!attacker || (attacker.cardType !== 'hero' && attacker.cardType !== 'generic')) {
        return prev
      }

      if (attacker.summoningSick || attacker.tapped) {
        return prev
      }

      const current = prev.metadata.declaredAttackers || []
      const nextAttackers = current.includes(cardId)
        ? current.filter(id => id !== cardId)
        : [...current, cardId]

      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          declaredAttackers: nextAttackers,
        },
      }
    })
  }, [setGameState])

  const handleConfirmAttackers = useCallback(() => {
    setGameState(prev => {
      const activePlayer = prev.metadata.activePlayer
      const defendingPlayer = activePlayer === 'player1' ? 'player2' : 'player1'
      const declaredAttackers = prev.metadata.declaredAttackers || []

      return {
        ...prev,
        battlefieldA: {
          ...prev.battlefieldA,
          [activePlayer]: prev.battlefieldA[activePlayer].map(card => {
            if (!declaredAttackers.includes(card.id) || (card.cardType !== 'hero' && card.cardType !== 'generic')) {
              return card
            }

            return {
              ...card,
              tapped: card.keywords?.includes('vigilance') ? card.tapped : true,
            }
          }),
        },
        metadata: {
          ...prev.metadata,
          currentPhase: 'declare_blockers',
          actionPlayer: defendingPlayer,
          blockerAssignments: {},
          selectedBlockerId: null,
        },
      }
    })
  }, [setGameState])

  const handleSelectBlocker = useCallback((cardId: string) => {
    setGameState(prev => {
      const blocker = prev.battlefieldA[prev.metadata.actionPlayer || prev.metadata.activePlayer].find(card => card.id === cardId)
      if (!blocker || blocker.cardType !== 'hero' && blocker.cardType !== 'generic') {
        return prev
      }

      if (blocker.tapped) {
        return prev
      }

      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          selectedBlockerId: prev.metadata.selectedBlockerId === cardId ? null : cardId,
        },
      }
    })
  }, [setGameState])

  const handleAssignBlocker = useCallback((attackerId: string) => {
    setGameState(prev => {
      const selectedBlockerId = prev.metadata.selectedBlockerId
      if (!selectedBlockerId) {
        return prev
      }

      const nextAssignments = { ...(prev.metadata.blockerAssignments || {}) }
      Object.keys(nextAssignments).forEach(blockerId => {
        if (blockerId === selectedBlockerId || nextAssignments[blockerId] === attackerId) {
          delete nextAssignments[blockerId]
        }
      })
      nextAssignments[selectedBlockerId] = attackerId

      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          blockerAssignments: nextAssignments,
          selectedBlockerId: null,
        },
      }
    })
  }, [setGameState])

  const handleConfirmBlockers = useCallback(() => {
    const combatResult = resolveManualCombat({
      battlefield: gameState.battlefieldA,
      attackingPlayer: metadata.activePlayer,
      declaredAttackers: metadata.declaredAttackers || [],
      blockerAssignments: metadata.blockerAssignments || {},
    })

    const nextTowerHP = {
      player1: Math.max(0, metadata.towerA_player1_HP - combatResult.towerDamage.player1),
      player2: Math.max(0, metadata.towerA_player2_HP - combatResult.towerDamage.player2),
    }

    setCombatSummaryData({
      battlefieldA: {
        name: 'Battlefield',
        combatRounds: combatResult.combatRounds,
        outcome: combatResult.outcome,
        towerHP: nextTowerHP,
        overflowDamage: { player1: 0, player2: 0 },
        heroDeaths: [
          ...combatResult.defeatedCards.player1.filter(isHero).map(hero => ({ heroName: hero.name, heroId: hero.id, owner: 'player1' as const, runesLost: [] })),
          ...combatResult.defeatedCards.player2.filter(isHero).map(hero => ({ heroName: hero.name, heroId: hero.id, owner: 'player2' as const, runesLost: [] })),
        ],
      },
      battlefieldB: {
        name: 'Unused',
        combatRounds: [],
        outcome: { winner: 'empty', p1Survivors: 0, p2Survivors: 0, towerDamageDealt: 0 },
        towerHP: { player1: 0, player2: 0 },
        overflowDamage: { player1: 0, player2: 0 },
        heroDeaths: [],
      },
    })
    setShowCombatSummary(true)

    setGameState(prev => {
      const returnHeroToCommandZone = (hero: Hero): Hero => ({
        ...hero,
        currentHealth: hero.maxHealth,
        temporaryAttack: 0,
        temporaryHP: 0,
        tapped: false,
        summoningSick: false,
        location: 'commandZone',
      })

      const defeatedP1Heroes = combatResult.defeatedCards.player1.filter(isHero).map(returnHeroToCommandZone)
      const defeatedP2Heroes = combatResult.defeatedCards.player2.filter(isHero).map(returnHeroToCommandZone)
      const updatedMetadata: GameMetadata = {
        ...prev.metadata,
        currentPhase: 'resolve_combat',
        towerA_player1_HP: nextTowerHP.player1,
        towerA_player2_HP: nextTowerHP.player2,
        totalTowerDamageDealt: {
          player1: (prev.metadata.totalTowerDamageDealt?.player1 || 0) + combatResult.towerDamage.player2,
          player2: (prev.metadata.totalTowerDamageDealt?.player2 || 0) + combatResult.towerDamage.player1,
        },
        declaredAttackers: [],
        blockerAssignments: {},
        selectedBlockerId: null,
      }

      const winResult = checkWinCondition(updatedMetadata)
      if (winResult.gameOver) {
        updatedMetadata.gameOver = true
        updatedMetadata.winner = winResult.winner
        updatedMetadata.winReason = winResult.winReason
      }

      return {
        ...prev,
        battlefieldA: {
          player1: combatResult.updatedBattlefield.player1,
          player2: combatResult.updatedBattlefield.player2,
        },
        player1DeployZone: [...prev.player1DeployZone, ...defeatedP1Heroes],
        player2DeployZone: [...prev.player2DeployZone, ...defeatedP2Heroes],
        metadata: updatedMetadata,
      }
    })

    if (!nextTowerHP.player1 || !nextTowerHP.player2) {
      return
    }

    handleEndTurn()
  }, [
    gameState.battlefieldA,
    handleEndTurn,
    metadata.activePlayer,
    metadata.blockerAssignments,
    metadata.declaredAttackers,
    metadata.towerA_player1_HP,
    metadata.towerA_player2_HP,
    setCombatSummaryData,
    setGameState,
    setShowCombatSummary,
  ])

  const handleSkipCombat = useCallback(() => {
    handleEndTurn()
  }, [handleEndTurn])

  const handleNextPhase = useCallback(() => {
    if (metadata.currentPhase === 'play') {
      handleStartCombat()
    } else if (metadata.currentPhase === 'declare_attackers') {
      handleConfirmAttackers()
    } else if (metadata.currentPhase === 'declare_blockers') {
      handleConfirmBlockers()
    }
  }, [handleConfirmAttackers, handleConfirmBlockers, handleStartCombat, metadata.currentPhase])

  const handleToggleSpellPlayed = useCallback((card: Card) => {
    if (card.location !== 'base') return

    setGameState(prev => {
      const playedSpells = { ...prev.metadata.playedSpells }
      if (playedSpells[card.id]) {
        delete playedSpells[card.id]
      } else {
        playedSpells[card.id] = true
      }

      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          playedSpells,
        },
      }
    })
  }, [setGameState])

  const handleSpawnCreep = useCallback((_battlefieldId: 'battlefieldA' | 'battlefieldB', _player: 'player1' | 'player2') => {
    return
  }, [])

  const handleToggleStun = useCallback((hero: Card) => {
    if (hero.cardType !== 'hero') return

    setGameState(prev => {
      const stunnedHeroes = { ...(prev.metadata.stunnedHeroes || {}) }
      if (stunnedHeroes[hero.id]) {
        delete stunnedHeroes[hero.id]
      } else {
        stunnedHeroes[hero.id] = true
      }

      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          stunnedHeroes,
        },
      }
    })
  }, [setGameState])

  const handleNextTurn = useCallback(() => {
    handleEndTurn()
  }, [handleEndTurn])

  const handlePass = useCallback((player: PlayerId) => {
    setGameState(prev => {
      const otherPlayer = player === 'player1' ? 'player2' : 'player1'
      const playerPassedKey = player === 'player1' ? 'player1Passed' : 'player2Passed'
      const otherPlayerPassed = player === 'player1' ? prev.metadata.player2Passed : prev.metadata.player1Passed

      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          [playerPassedKey]: true,
          actionPlayer: otherPlayerPassed ? player : otherPlayer,
        },
      }
    })
  }, [setGameState])

  const handleEndDeployPhase = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        currentPhase: 'resource',
      },
    }))
  }, [setGameState])

  return {
    handleNextPhase,
    handleNextTurn,
    handleEndTurn,
    handleStartCombat,
    handleDeclareAttacker,
    handleConfirmAttackers,
    handleSelectBlocker,
    handleAssignBlocker,
    handleConfirmBlockers,
    handleSkipCombat,
    handleToggleSpellPlayed,
    handleToggleStun,
    handlePass,
    handleEndDeployPhase,
    handleSpawnCreep,
  }
}
