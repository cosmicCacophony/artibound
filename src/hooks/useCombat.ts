import { useCallback } from 'react'
import { Card, AttackTarget, GameMetadata, BaseCard } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { getDefaultTargets, resolveCombat } from '../game/combatSystem'
import { createCardFromTemplate } from '../game/sampleData'
import { removeRunesFromHero } from '../game/runeSystem'

export function useCombat() {
  const { gameState, setGameState, combatTargetsA, setCombatTargetsA, combatTargetsB, setCombatTargetsB, player1SidebarCards, player2SidebarCards, setPlayer1SidebarCards, setPlayer2SidebarCards } = useGameContext()
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
        // Card Draw System: Opponent draws 1 card when a hero is killed
        const hero = card as import('../game/types').Hero
        
        // Draw a card for the opponent from their library
        const opponentLibrary = opponent === 'player1' ? player1SidebarCards : player2SidebarCards
        const setOpponentLibrary = opponent === 'player1' ? setPlayer1SidebarCards : setPlayer2SidebarCards
        
        let drawnCard: Card | null = null
        if (opponentLibrary.length > 0) {
          // Draw a random card from the library
          const randomIndex = Math.floor(Math.random() * opponentLibrary.length)
          const template = opponentLibrary[randomIndex]
          drawnCard = createCardFromTemplate(template, opponent, 'hand')
          
          // Remove from library
          setOpponentLibrary(prev => prev.filter((_, index) => index !== randomIndex))
        }
        
        setGameState(prev => {
          const removeFromLocation = (cards: Card[]) => cards.filter(c => c.id !== card.id)
          
          // Remove runes from the hero when it dies
          const runePoolKey = player === 'player1' ? 'player1RunePool' : 'player2RunePool'
          const updatedRunePool = removeRunesFromHero(hero, prev.metadata[runePoolKey])
          
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
            // Add drawn card to opponent's hand if one was drawn
            [`${opponent}Hand`]: drawnCard 
              ? [...(prev[`${opponent}Hand` as keyof typeof prev] as Card[]), drawnCard]
              : (prev[`${opponent}Hand` as keyof typeof prev] as Card[]),
            metadata: {
              ...prev.metadata,
              [runePoolKey]: updatedRunePool,
              deathCooldowns: {
                ...prev.metadata.deathCooldowns,
                [card.id]: 2, // Set cooldown counter to 2 (decreases by 1 each turn, prevents deployment for 1 full round)
              },
            },
          }
        })
      } else {
        // Generic unit dies - remove completely, track death cooldown
        // No card draw for killing units (only heroes)
        setGameState(prev => {
          return {
            ...prev,
            [location === 'battlefieldA' ? 'battlefieldA' : 'battlefieldB']: {
              ...prev[location === 'battlefieldA' ? 'battlefieldA' : 'battlefieldB'],
              [player]: prev[location === 'battlefieldA' ? 'battlefieldA' : 'battlefieldB'][player as 'player1' | 'player2'].filter(c => c.id !== card.id),
            },
            metadata: {
              ...prev.metadata,
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
  }, [setGameState, player1SidebarCards, player2SidebarCards, setPlayer1SidebarCards, setPlayer2SidebarCards])

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



