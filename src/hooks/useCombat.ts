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
                [card.id]: 2, // Set cooldown counter to 2 (decreases by 1 each turn, prevents deployment for 1 full round)
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
              // Opponent gets 2 gold for killing a creep (generic unit)
              [`${opponent}Gold`]: (prev.metadata[`${opponent}Gold` as keyof GameMetadata] as number) + 2,
              deathCooldowns: {
                ...prev.metadata.deathCooldowns,
                [card.id]: 2, // Set cooldown counter to 2 (decreases by 1 each turn, prevents deployment for 1 full round)
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
    
    const player = card.owner
    const isHeroOrGeneric = card.cardType === 'hero' || card.cardType === 'generic'
    const currentTempHP = isHeroOrGeneric && 'temporaryHP' in card ? (card.temporaryHP || 0) : 0
    
    setGameState(prev => {
      const updateCardInArray = (cards: Card[]): Card[] => 
        cards.map(c => {
          if (c.id === card.id) {
            // If at max health, add to temporary HP instead (allows overflow like mana)
            if (c.currentHealth >= c.maxHealth) {
              const newTempHP = currentTempHP + 1
              if (isHeroOrGeneric) {
                return { ...c, temporaryHP: newTempHP } as Card
              }
            } else {
              // Not at max yet, increase currentHealth
              return { ...c, currentHealth: c.currentHealth + 1 } as Card
            }
          }
          return c
        })

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
    
    const player = card.owner
    const isHeroOrGeneric = card.cardType === 'hero' || card.cardType === 'generic'
    const currentTempAttack = isHeroOrGeneric && 'temporaryAttack' in card ? (card.temporaryAttack || 0) : 0
    
    setGameState(prev => {
      const updateCardInArray = (cards: Card[]): Card[] => 
        cards.map(c => {
          if (c.id === card.id) {
            if (isHeroOrGeneric && currentTempAttack > 0) {
              // Decrease temporaryAttack first
              const newTempAttack = Math.max(0, currentTempAttack - 1)
              return { ...c, temporaryAttack: newTempAttack } as Card
            } else {
              // Decrease base attack if no temporaryAttack
              const newAttack = Math.max(0, c.attack - 1)
              return { ...c, attack: newAttack } as Card
            }
          }
          return c
        })

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
    
    const player = card.owner
    const isHeroOrGeneric = card.cardType === 'hero' || card.cardType === 'generic'
    const currentTempAttack = isHeroOrGeneric && 'temporaryAttack' in card ? (card.temporaryAttack || 0) : 0
    
    setGameState(prev => {
      const updateCardInArray = (cards: Card[]): Card[] => 
        cards.map(c => {
          if (c.id === card.id) {
            // Always add to temporaryAttack (allows overflow like mana/HP)
            if (isHeroOrGeneric) {
              const newTempAttack = currentTempAttack + 1
              return { ...c, temporaryAttack: newTempAttack } as Card
            } else {
              // For other card types, just increase base attack
              return { ...c, attack: c.attack + 1 } as Card
            }
          }
          return c
        })

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



