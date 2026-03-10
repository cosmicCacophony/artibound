import { useCallback } from 'react'
import { useGameContext } from '../context/GameContext'
import { Card, HeroAbility, Hero, PlayerId, BattlefieldId, GameMetadata } from '../game/types'

function findHeroLane(heroId: string, gameState: { battlefieldA: { player1: Card[], player2: Card[] }, battlefieldB: { player1: Card[], player2: Card[] } }): { battlefieldId: BattlefieldId, side: PlayerId } | null {
  for (const bfId of ['battlefieldA', 'battlefieldB'] as BattlefieldId[]) {
    for (const side of ['player1', 'player2'] as PlayerId[]) {
      if (gameState[bfId][side].some(c => c.id === heroId)) {
        return { battlefieldId: bfId, side }
      }
    }
  }
  return null
}

export function useHeroAbilities() {
  const { setGameState, gameState, metadata, pendingAbility, setPendingAbility } = useGameContext()

  const handleAbilityClick = useCallback((heroId: string, ability: HeroAbility, heroOwner: PlayerId) => {
    const playerMana = heroOwner === 'player1' ? metadata.player1Mana : metadata.player2Mana
    if (playerMana < ability.manaCost) {
      alert(`Not enough mana! Need ${ability.manaCost}, have ${playerMana}`)
      return
    }

    if (metadata.currentPhase !== 'play') {
      alert('Abilities can only be used during the play phase!')
      return
    }

    if (metadata.actionPlayer !== heroOwner) {
      alert(`It's not your turn to act!`)
      return
    }

    const lastUsedTurn = metadata.heroAbilityCooldowns[heroId] || 0
    if (lastUsedTurn > 0 && metadata.currentTurn - lastUsedTurn < ability.cooldown) {
      alert(`${ability.name} is on cooldown!`)
      return
    }

    const heroLane = findHeroLane(heroId, gameState)
    if (!heroLane) {
      alert('Hero not found on a battlefield!')
      return
    }

    if (ability.runeCost && ability.runeCost.length > 0) {
      const laneRunes = metadata.laneRunes?.[heroLane.battlefieldId]?.[heroOwner] || []
      for (const requiredColor of ability.runeCost) {
        if (!laneRunes.includes(requiredColor)) {
          alert(`Not enough ${requiredColor} runes in this lane!`)
          return
        }
      }
    }

    const needsTarget = ability.effectType === 'damage_target'
      || ability.effectType === 'steal_unit'
      || ability.effectType === 'buff_units'
      || ability.effectType === 'bounce_unit'

    if (needsTarget) {
      setPendingAbility({
        heroId,
        ability,
        owner: heroOwner,
        battlefieldId: heroLane.battlefieldId,
      })
      return
    }

    resolveImmediateAbility(heroId, ability, heroOwner, heroLane.battlefieldId)
  }, [metadata, gameState, setPendingAbility])

  const resolveImmediateAbility = useCallback((heroId: string, ability: HeroAbility, heroOwner: PlayerId, battlefieldId: BattlefieldId) => {
    const otherPlayer: PlayerId = heroOwner === 'player1' ? 'player2' : 'player1'
    const playerMana = heroOwner === 'player1' ? metadata.player1Mana : metadata.player2Mana
    const newMana = playerMana - ability.manaCost

    setGameState(prev => {
      const newState = { ...prev }
      const newMetadata: GameMetadata = {
        ...prev.metadata,
        [`${heroOwner}Mana`]: newMana,
        actionPlayer: otherPlayer,
        initiativePlayer: otherPlayer,
        heroAbilityCooldowns: {
          ...prev.metadata.heroAbilityCooldowns,
          [heroId]: prev.metadata.currentTurn,
        },
      }

      switch (ability.effectType) {
        case 'damage_tower_lane': {
          const towerKey = `tower${battlefieldId === 'battlefieldA' ? 'A' : 'B'}_${otherPlayer}_HP` as keyof GameMetadata
          const currentHP = prev.metadata[towerKey] as number
          ;(newMetadata as any)[towerKey] = Math.max(0, currentHP - (ability.effectValue || 0))
          break
        }

        case 'move_cross_battlefield': {
          const otherBf: BattlefieldId = battlefieldId === 'battlefieldA' ? 'battlefieldB' : 'battlefieldA'
          const currentLane = [...prev[battlefieldId][heroOwner]]
          const targetLane = [...prev[otherBf][heroOwner]]

          if (targetLane.length >= 5) {
            alert('No room in the other lane!')
            return prev
          }

          const heroIdx = currentLane.findIndex(c => c.id === heroId)
          if (heroIdx === -1) return prev

          const hero = { ...currentLane[heroIdx], location: otherBf as any }
          currentLane.splice(heroIdx, 1)
          targetLane.push(hero)

          newState[battlefieldId] = { ...prev[battlefieldId], [heroOwner]: currentLane }
          newState[otherBf] = { ...prev[otherBf], [heroOwner]: targetLane }
          break
        }

        case 'create_unit': {
          const lane = [...prev[battlefieldId][heroOwner]]
          if (lane.length >= 5) {
            alert('No room to spawn a unit!')
            return prev
          }

          const skeleton: Card = {
            id: `skeleton-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            name: 'Skeleton',
            description: 'Raised from the dead.',
            cardType: 'generic',
            colors: ['black'],
            attack: 2,
            health: 1,
            maxHealth: 1,
            currentHealth: 1,
            manaCost: 0,
            owner: heroOwner,
            location: battlefieldId,
            equippedItems: [],
          } as any

          lane.push(skeleton)
          newState[battlefieldId] = { ...prev[battlefieldId], [heroOwner]: lane }
          break
        }

        case 'heal_target': {
          const towerKey = `tower${battlefieldId === 'battlefieldA' ? 'A' : 'B'}_${heroOwner}_HP` as keyof GameMetadata
          const currentHP = prev.metadata[towerKey] as number
          ;(newMetadata as any)[towerKey] = Math.min(20, currentHP + (ability.effectValue || 0))
          break
        }

        default:
          break
      }

      newState.metadata = newMetadata
      return newState
    })
  }, [metadata, setGameState])

  const handleAbilityTargetClick = useCallback((targetCard: Card, clickedBattlefieldId: BattlefieldId) => {
    if (!pendingAbility) return

    const { heroId, ability, owner, battlefieldId } = pendingAbility

    if (clickedBattlefieldId !== battlefieldId) {
      alert('Target must be in the same lane as the hero!')
      setPendingAbility(null)
      return
    }

    const otherPlayer: PlayerId = owner === 'player1' ? 'player2' : 'player1'
    const playerMana = owner === 'player1' ? metadata.player1Mana : metadata.player2Mana
    const newMana = playerMana - ability.manaCost

    setGameState(prev => {
      const newState = { ...prev }
      const newMetadata: GameMetadata = {
        ...prev.metadata,
        [`${owner}Mana`]: newMana,
        actionPlayer: otherPlayer,
        initiativePlayer: otherPlayer,
        heroAbilityCooldowns: {
          ...prev.metadata.heroAbilityCooldowns,
          [heroId]: prev.metadata.currentTurn,
        },
      }

      switch (ability.effectType) {
        case 'damage_target': {
          if (targetCard.owner === owner) {
            alert('Must target an enemy unit!')
            return prev
          }

          const enemyLane = [...prev[battlefieldId][otherPlayer]]
          const targetIdx = enemyLane.findIndex(c => c.id === targetCard.id)
          if (targetIdx === -1) return prev

          const dmg = ability.effectValue || 0
          const target = { ...enemyLane[targetIdx] } as any
          target.currentHealth = (target.currentHealth || target.health) - dmg

          if (target.currentHealth <= 0) {
            enemyLane.splice(targetIdx, 1)
          } else {
            enemyLane[targetIdx] = target
          }

          newState[battlefieldId] = { ...prev[battlefieldId], [otherPlayer]: enemyLane }

          const heroLane = [...prev[battlefieldId][owner]]
          const heroIdx = heroLane.findIndex(c => c.id === heroId)
          if (heroIdx !== -1) {
            const hero = { ...heroLane[heroIdx] } as Hero
            hero.currentHealth = Math.min(hero.maxHealth, (hero.currentHealth || hero.health) + dmg)
            heroLane[heroIdx] = hero
          }
          newState[battlefieldId] = { ...newState[battlefieldId], [owner]: heroLane }
          break
        }

        case 'steal_unit': {
          if (targetCard.owner === owner || targetCard.cardType === 'hero') {
            alert('Must target an enemy non-hero unit!')
            return prev
          }

          const myLane = [...prev[battlefieldId][owner]]
          if (myLane.length >= 5) {
            alert('No room to steal a unit!')
            return prev
          }

          if (ability.runeCost && ability.runeCost.length > 0) {
            const laneRunes = [...(prev.metadata.laneRunes?.[battlefieldId]?.[owner] || [])]
            for (const requiredColor of ability.runeCost) {
              const idx = laneRunes.indexOf(requiredColor)
              if (idx === -1) {
                alert(`Not enough ${requiredColor} runes!`)
                return prev
              }
              laneRunes.splice(idx, 1)
            }
            newMetadata.laneRunes = {
              ...prev.metadata.laneRunes!,
              [battlefieldId]: {
                ...prev.metadata.laneRunes![battlefieldId],
                [owner]: laneRunes,
              },
            }
          }

          const enemyLane = [...prev[battlefieldId][otherPlayer]]
          const targetIdx = enemyLane.findIndex(c => c.id === targetCard.id)
          if (targetIdx === -1) return prev

          const stolenUnit = { ...enemyLane[targetIdx], owner: owner, location: battlefieldId } as any
          enemyLane.splice(targetIdx, 1)
          myLane.push(stolenUnit)

          newState[battlefieldId] = { [owner]: myLane, [otherPlayer]: enemyLane } as any
          break
        }

        case 'buff_units': {
          if (targetCard.owner !== owner || targetCard.cardType === 'hero') {
            alert('Must target a friendly non-hero unit!')
            return prev
          }

          const myLane = [...prev[battlefieldId][owner]]
          const targetIdx = myLane.findIndex(c => c.id === targetCard.id)
          if (targetIdx === -1) return prev

          const buffedUnit = { ...myLane[targetIdx] } as any
          const healthBuff = ability.effectValue || 0
          buffedUnit.maxHealth = (buffedUnit.maxHealth || buffedUnit.health) + healthBuff
          buffedUnit.currentHealth = (buffedUnit.currentHealth || buffedUnit.health) + healthBuff
          buffedUnit.health = buffedUnit.maxHealth
          myLane[targetIdx] = buffedUnit

          newState[battlefieldId] = { ...prev[battlefieldId], [owner]: myLane }
          break
        }

        case 'bounce_unit': {
          if (targetCard.owner === owner || targetCard.cardType === 'hero') {
            alert('Must target an enemy non-hero unit!')
            return prev
          }

          const enemyLane = [...prev[battlefieldId][otherPlayer]]
          const targetIdx = enemyLane.findIndex(c => c.id === targetCard.id)
          if (targetIdx === -1) return prev

          const bouncedUnit = { ...enemyLane[targetIdx], location: 'hand' } as Card
          enemyLane.splice(targetIdx, 1)

          const handKey = `${otherPlayer}Hand` as 'player1Hand' | 'player2Hand'
          newState[handKey] = [...prev[handKey], bouncedUnit]
          newState[battlefieldId] = { ...prev[battlefieldId], [otherPlayer]: enemyLane }
          break
        }

        default:
          break
      }

      newState.metadata = newMetadata
      return newState
    })

    setPendingAbility(null)
  }, [pendingAbility, metadata, setGameState, setPendingAbility])

  return {
    handleAbilityClick,
    handleAbilityTargetClick,
  }
}
