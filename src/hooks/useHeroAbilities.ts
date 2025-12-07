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

    // Deduct mana and pass both action AND initiative to opponent
    const otherPlayer: 'player1' | 'player2' = heroOwner === 'player1' ? 'player2' : 'player1'
    const newMana = playerMana - ability.manaCost
    
    setGameState(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [`${heroOwner}Mana`]: newMana,
        // Casting passes BOTH action and initiative to opponent
        actionPlayer: otherPlayer,
        initiativePlayer: otherPlayer,
      },
    }))

    // Note: Cooldown tracking will be handled by the user later
    console.log(`Used ${ability.name} from hero ${heroId}. Mana: ${newMana}, Initiative passed to ${otherPlayer}`)
  }, [metadata, setGameState])

  return {
    handleAbilityClick,
  }
}

