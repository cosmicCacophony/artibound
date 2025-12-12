import { useCallback } from 'react'
import { Card, AttackTarget, GameMetadata } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { getDefaultTargets, resolveCombat } from '../game/combatSystem'

export function useCombat() {
  const { gameState, setGameState, combatTargetsA, setCombatTargetsA, combatTargetsB, setCombatTargetsB } = useGameContext()
  const metadata = gameState.metadata

  const handleDecreaseHealth = useCallback((card: Card) => {
    if (!('currentHealth' in card)) return

    const newHealth = card.currentHealth - 1

    if (newHealth <= 0) {
      // Card dies - track death cooldown (1 round)
      const player = card.owner
      const opponent = player === 'player1' ? 'player2' : 'player1'
      const location = card.location

      if (card.cardType === 'hero') {
        // Hero dies - goes to base with death cooldown (1 round before can redeploy)
        // Gold System: Gold is awarded immediately on kill (5 for heroes, 2 for units)
        // Item Shop: Appears after combat phases (after both combatA and combatB)
        // TODO: Integrate battlefield gold-on-kill bonus (requires passing battlefield definition through combat system)
        const hero = card as import('../game/types').Hero
        setGameState(prev => {
          const removeFromLocation = (cards: Card[]) => cards.filter(c => c.id !== card.id)
          
          return {
            ...prev,
            [location === 'battlefieldA' ? 'battlefieldA' : 'battlefieldB']: {
              ...prev[location === 'battlefieldA' ? 'battlefieldA' : 'battlefieldB'],
              [player]: removeFromLocation(prev[location === 'battlefieldA' ? 'battlefieldA' : 'battlefieldB'][player as 'player1' | 'player2']),
            },
            [`${player}Base`]: [...prev[`${player}Base` as keyof typeof prev] as Card[], {
              ...hero,
              location: 'base',
              currentHealth: 0, // Dead - will heal to full in base after cooldown
              slot: undefined,
            }],
            metadata: {
              ...prev.metadata,
              // Opponent gets gold for killing the hero
              [`${opponent}Gold`]: (prev.metadata[`${opponent}Gold` as keyof GameMetadata] as number) + 5,
              deathCooldowns: {
                ...prev.metadata.deathCooldowns,
                [card.id]: 1, // Set cooldown counter to 1 (decreases by 1 each turn, can redeploy next turn)
              },
            },
          }
        })
      } else {
        // Generic unit dies - remove completely, track death cooldown
        // Gold System: Gold is awarded immediately on kill
        const opponent = player === 'player1' ? 'player2' : 'player1'
        setGameState(prev => {
          return {
            ...prev,
            [location === 'battlefieldA' ? 'battlefieldA' : 'battlefieldB']: {
              ...prev[location === 'battlefieldA' ? 'battlefieldA' : 'battlefieldB'],
              [player]: prev[location === 'battlefieldA' ? 'battlefieldA' : 'battlefieldB'][player as 'player1' | 'player2'].filter(c => c.id !== card.id),
            },
            metadata: {
              ...prev.metadata,
              // Opponent gets gold for killing the unit
              [`${opponent}Gold`]: (prev.metadata[`${opponent}Gold` as keyof GameMetadata] as number) + 2,
              deathCooldowns: {
                ...prev.metadata.deathCooldowns,
                [card.id]: 1, // Set cooldown counter to 1 (decreases by 1 each turn, can redeploy next turn)
              },
            },
          }
        })
      }
    } else {
      // Just decrease health
      const player = card.owner
      setGameState(prev => {
        const updateCardInArray = (cards: Card[]): Card[] => 
          cards.map(c => c.id === card.id ? { ...c, currentHealth: newHealth } as Card : c)

        return {
          ...prev,
          [`${player}Hand`]: updateCardInArray(prev[`${player}Hand` as keyof typeof prev] as Card[]),
          [`${player}Base`]: updateCardInArray(prev[`${player}Base` as keyof typeof prev] as Card[]),
          battlefieldA: {
            ...prev.battlefieldA,
            [player]: updateCardInArray(prev.battlefieldA[player as 'player1' | 'player2']),
          },
          battlefieldB: {
            ...prev.battlefieldB,
            [player]: updateCardInArray(prev.battlefieldB[player as 'player1' | 'player2']),
          },
        }
      })
    }
  }, [setGameState])

  const handleIncreaseHealth = useCallback((card: Card) => {
    if (!('currentHealth' in card) || !('maxHealth' in card)) return
    
    const newHealth = Math.min(card.currentHealth + 1, card.maxHealth)
    const player = card.owner
    
    setGameState(prev => {
      const updateCardInArray = (cards: Card[]): Card[] => 
        cards.map(c => c.id === card.id ? { ...c, currentHealth: newHealth } as Card : c)

      return {
        ...prev,
        [`${player}Hand`]: updateCardInArray(prev[`${player}Hand` as keyof typeof prev] as Card[]),
        [`${player}Base`]: updateCardInArray(prev[`${player}Base` as keyof typeof prev] as Card[]),
        battlefieldA: {
          ...prev.battlefieldA,
          [player]: updateCardInArray(prev.battlefieldA[player as 'player1' | 'player2']),
        },
        battlefieldB: {
          ...prev.battlefieldB,
          [player]: updateCardInArray(prev.battlefieldB[player as 'player1' | 'player2']),
        },
      }
    })
  }, [setGameState])

  const handleDecreaseAttack = useCallback((card: Card) => {
    if (!('attack' in card)) return
    
    const newAttack = Math.max(0, card.attack - 1)
    const player = card.owner
    
    setGameState(prev => {
      const updateCardInArray = (cards: Card[]): Card[] => 
        cards.map(c => c.id === card.id ? { ...c, attack: newAttack } as Card : c)

      return {
        ...prev,
        [`${player}Hand`]: updateCardInArray(prev[`${player}Hand` as keyof typeof prev] as Card[]),
        [`${player}Base`]: updateCardInArray(prev[`${player}Base` as keyof typeof prev] as Card[]),
        battlefieldA: {
          ...prev.battlefieldA,
          [player]: updateCardInArray(prev.battlefieldA[player as 'player1' | 'player2']),
        },
        battlefieldB: {
          ...prev.battlefieldB,
          [player]: updateCardInArray(prev.battlefieldB[player as 'player1' | 'player2']),
        },
      }
    })
  }, [setGameState])

  const handleIncreaseAttack = useCallback((card: Card) => {
    if (!('attack' in card)) return
    
    const newAttack = card.attack + 1
    const player = card.owner
    
    setGameState(prev => {
      const updateCardInArray = (cards: Card[]): Card[] => 
        cards.map(c => c.id === card.id ? { ...c, attack: newAttack } as Card : c)

      return {
        ...prev,
        [`${player}Hand`]: updateCardInArray(prev[`${player}Hand` as keyof typeof prev] as Card[]),
        [`${player}Base`]: updateCardInArray(prev[`${player}Base` as keyof typeof prev] as Card[]),
        battlefieldA: {
          ...prev.battlefieldA,
          [player]: updateCardInArray(prev.battlefieldA[player as 'player1' | 'player2']),
        },
        battlefieldB: {
          ...prev.battlefieldB,
          [player]: updateCardInArray(prev.battlefieldB[player as 'player1' | 'player2']),
        },
      }
    })
  }, [setGameState])

  return {
    handleDecreaseHealth,
    handleIncreaseHealth,
    handleDecreaseAttack,
    handleIncreaseAttack,
  }
}



