import { useCallback } from 'react'
import { useGameContext } from '../context/GameContext'
import { HeroAbility } from '../game/types'

export function useHeroAbilities() {
  const { setGameState, metadata } = useGameContext()

  const handleAbilityClick = useCallback((heroId: string, ability: HeroAbility, heroOwner: 'player1' | 'player2') => {
    // Check if player has enough mana
    const playerMana = heroOwner === 'player1' ? metadata.player1Mana : metadata.player2Mana
    if (playerMana < ability.manaCost) {
      alert(`Not enough mana! Need ${ability.manaCost}, have ${playerMana}`)
      return
    }

    // Check if player has initiative (only during play phase)
    if (metadata.currentPhase !== 'play') {
      alert('Abilities can only be used during the play phase!')
      return
    }

    if (metadata.actionPlayer !== heroOwner) {
      alert(`It's not your turn to act! ${heroOwner === 'player1' ? 'Player 2' : 'Player 1'} has the action.`)
      return
    }

    // Special handling for WB Life Channeler - check counters
    if (heroId === 'wb-hero-life-channeler' && ability.effectType === 'heal_target') {
      const currentCounters = metadata.heroCounters?.[heroId] || 0
      if (currentCounters < 5) {
        alert(`Not enough counters! Need 5, have ${currentCounters}`)
        return
      }
    }

    // Deduct mana and pass both action AND initiative to opponent
    const otherPlayer: 'player1' | 'player2' = heroOwner === 'player1' ? 'player2' : 'player1'
    const newMana = playerMana - ability.manaCost
    
    setGameState(prev => {
      const updates: Partial<GameMetadata> = {
        [`${heroOwner}Mana`]: newMana,
        // Casting passes BOTH action and initiative to opponent
        actionPlayer: otherPlayer,
        initiativePlayer: otherPlayer,
      }

      // Handle WB Life Channeler counter removal and healing
      if (heroId === 'wb-hero-life-channeler' && ability.effectType === 'heal_target') {
        const currentCounters = prev.metadata.heroCounters?.[heroId] || 0
        const newCounters = currentCounters - 5
        updates.heroCounters = {
          ...prev.metadata.heroCounters,
          [heroId]: Math.max(0, newCounters)
        }
        
        // Prompt for target (tower or unit)
        const targetType = confirm('Heal a tower? (OK = Tower, Cancel = Unit)') ? 'tower' : 'unit'
        if (targetType === 'tower') {
          const tower = confirm('Heal Tower A? (OK = A, Cancel = B)') ? 'A' : 'B'
          const towerKey = `tower${tower}_${heroOwner}_HP` as keyof GameMetadata
          const currentHP = prev.metadata[towerKey] as number
          updates[towerKey] = Math.min(20, currentHP + 5)
          console.log(`Life Channeler: Healed Tower ${tower} for 5 (removed 5 counters)`)
        } else {
          // Unit healing would need target selection - for now, just log
          console.log(`Life Channeler: Heal 5 to unit (removed 5 counters) - target selection not yet implemented`)
        }
      }

      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          ...updates,
        },
      }
    })

    // Note: Cooldown tracking will be handled by the user later
    console.log(`Used ${ability.name} from hero ${heroId}. Mana: ${newMana}, Initiative passed to ${otherPlayer}`)
  }, [metadata, setGameState])

  return {
    handleAbilityClick,
  }
}

