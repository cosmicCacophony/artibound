import { useCallback } from 'react'
import { Card, Location, GenericUnit, GameMetadata, BATTLEFIELD_SLOT_LIMIT } from '../game/types'
import { useGameContext } from '../context/GameContext'

export function useDeployment() {
  const { gameState, setGameState, selectedCard, selectedCardId, setSelectedCardId, getAvailableSlots } = useGameContext()
  const metadata = gameState.metadata

  const handleDeploy = useCallback((location: Location, targetSlot?: number) => {
    if (!selectedCardId || !selectedCard) return
    
    // On turn 1, both players can deploy during play phase
    const isTurn1 = metadata.currentTurn === 1
    const isPlayPhase = metadata.currentPhase === 'play'
    const isOwnerTurn = selectedCard.owner === metadata.activePlayer
    
    // Allow deployment if:
    // - It's the owner's turn (normal case)
    // - OR it's turn 1 and play phase (both players can deploy)
    if (!isTurn1 && !isOwnerTurn) {
      alert("It's not your turn!")
      return
    }
    
    if (!isPlayPhase) {
      alert(`Cannot deploy during ${metadata.currentPhase} phase!`)
      return
    }
    
    // Check mana cost (heroes don't cost mana to deploy from base, cards from hand do)
    const isHero = selectedCard.cardType === 'hero'
    const isFromBase = selectedCard.location === 'base'
    const manaCost = (isHero && isFromBase) ? 0 : ('manaCost' in selectedCard ? (selectedCard as any).manaCost : 0)
    const playerMana = selectedCard.owner === 'player1' ? metadata.player1Mana : metadata.player2Mana
    
    if (manaCost > 0 && playerMana < manaCost) {
      alert(`Not enough mana! Need ${manaCost}, have ${playerMana}`)
      return
    }

    // Check if deploying to battlefield and slots are full
    if ((location === 'battlefieldA' || location === 'battlefieldB')) {
      const battlefield = location === 'battlefieldA' 
        ? gameState.battlefieldA[selectedCard.owner as 'player1' | 'player2']
        : gameState.battlefieldB[selectedCard.owner as 'player1' | 'player2']
      
      const availableSlots = getAvailableSlots(battlefield)
      
      if (selectedCard.cardType !== 'generic' && availableSlots <= 0 && !targetSlot) {
        alert('Battlefield is full! Maximum 5 slots.')
        return
      }

      // Handle generic unit stacking
      if (selectedCard.cardType === 'generic' && battlefield.length > 0 && !targetSlot) {
        // Try to stack with another generic unit
        const stackableGeneric = battlefield.find(c => 
          c.cardType === 'generic' && 
          !('stackedWith' in c && c.stackedWith) &&
          c.id !== selectedCard.id
        ) as GenericUnit | undefined

        if (stackableGeneric && selectedCard.cardType === 'generic') {
          // Stack the new card with existing generic
          const selectedGeneric = selectedCard as GenericUnit
          const newStackPower = (stackableGeneric.attack || 0) + (selectedGeneric.attack || 0)
          const newStackHealth = (stackableGeneric.health || 0) + (selectedGeneric.health || 0)

          setGameState(prev => {
            const newBattlefield = prev[location === 'battlefieldA' ? 'battlefieldA' : 'battlefieldB']
            const playerField = selectedCard.owner as 'player1' | 'player2'
            const playerManaKey = `${selectedCard.owner}Mana` as keyof GameMetadata
            
            return {
              ...prev,
              [location === 'battlefieldA' ? 'battlefieldA' : 'battlefieldB']: {
                ...newBattlefield,
                [playerField]: newBattlefield[playerField].map(c =>
                  c.id === stackableGeneric.id
                    ? { ...c, stackPower: newStackPower, stackHealth: newStackHealth, stackedWith: selectedCard.id } as GenericUnit
                    : c
                ).concat([{
                  ...selectedGeneric,
                  location,
                  stackedWith: stackableGeneric.id,
                  stackPower: newStackPower,
                  stackHealth: newStackHealth,
                }] as GenericUnit[]),
              },
              [`${selectedCard.owner}Hand`]: (prev[`${selectedCard.owner}Hand` as keyof typeof prev] as Card[])
                .filter((c: Card) => c.id !== selectedCard.id),
              [`${selectedCard.owner}Base`]: (prev[`${selectedCard.owner}Base` as keyof typeof prev] as Card[])
                .filter((c: Card) => c.id !== selectedCard.id),
              metadata: {
                ...prev.metadata,
                [playerManaKey]: Math.max(0, (prev.metadata[playerManaKey] as number) - manaCost),
              },
            }
          })
          setSelectedCardId(null)
          return
        }
      }
    }

    // Regular deployment
    setGameState(prev => {
      // Remove from current location
      const removeFromLocation = (cards: Card[]) => cards.filter(c => c.id !== selectedCardId)
      
      // Add to new location
      const playerManaKey = `${selectedCard.owner}Mana` as keyof GameMetadata
      if (location === 'base') {
        // Hero movement to base: 1 per turn, heals to full
        const isHero = selectedCard.cardType === 'hero'
        const movedToBaseKey = `${selectedCard.owner}MovedToBase` as keyof GameMetadata
        const hasMovedToBase = prev.metadata[movedToBaseKey] as boolean
        
        if (isHero && hasMovedToBase) {
          alert('You can only move one hero to base per turn!')
          return prev
        }
        
        // Heal hero to full health when moving to base
        const healedCard = isHero && 'maxHealth' in selectedCard
          ? { ...selectedCard, location, currentHealth: (selectedCard as any).maxHealth, slot: undefined }
          : { ...selectedCard, location, slot: undefined }
        
        return {
          ...prev,
          [`${selectedCard.owner}Hand`]: removeFromLocation(prev[`${selectedCard.owner}Hand` as keyof typeof prev] as Card[]),
          [`${selectedCard.owner}Base`]: [...prev[`${selectedCard.owner}Base` as keyof typeof prev] as Card[], healedCard],
          battlefieldA: {
            ...prev.battlefieldA,
            [selectedCard.owner]: removeFromLocation(prev.battlefieldA[selectedCard.owner as 'player1' | 'player2']),
          },
          battlefieldB: {
            ...prev.battlefieldB,
            [selectedCard.owner]: removeFromLocation(prev.battlefieldB[selectedCard.owner as 'player1' | 'player2']),
          },
          metadata: {
            ...prev.metadata,
            [playerManaKey]: Math.max(0, (prev.metadata[playerManaKey] as number) - manaCost),
            ...(isHero ? { [movedToBaseKey]: true } : {}),
          },
        }
      } else if (location === 'battlefieldA' || location === 'battlefieldB') {
        const battlefieldKey = location
        const battlefieldCards = prev[battlefieldKey][selectedCard.owner as 'player1' | 'player2']
        
        // Use provided slot or find first available slot (1-5)
        let finalTargetSlot = targetSlot
        if (!finalTargetSlot) {
          for (let i = 1; i <= 5; i++) {
            if (!battlefieldCards.some(c => c.slot === i)) {
              finalTargetSlot = i
              break
            }
          }
        }
        
        // If all slots full, don't deploy (unless moving from another battlefield - allow that)
        const isMovingFromBattlefield = selectedCard.location === 'battlefieldA' || selectedCard.location === 'battlefieldB'
        if (!finalTargetSlot && !isMovingFromBattlefield) {
          alert('Battlefield is full! Maximum 5 slots.')
          return prev
        }
        
        // If moving from another battlefield and no slot specified, reuse the slot or find a new one
        if (isMovingFromBattlefield && !finalTargetSlot) {
          finalTargetSlot = selectedCard.slot || 1 // Try to keep the same slot
        }
        
        // If target slot is occupied, swap positions
        if (finalTargetSlot) {
          const slotOccupied = battlefieldCards.some(c => c.id !== selectedCard.id && c.slot === finalTargetSlot)
          if (slotOccupied) {
            const otherCard = battlefieldCards.find(c => c.slot === finalTargetSlot)
            if (otherCard) {
              // Swap positions
              const otherBattlefieldKey = location === 'battlefieldA' ? 'battlefieldB' : 'battlefieldA'
              return {
                ...prev,
                [`${selectedCard.owner}Hand`]: removeFromLocation(prev[`${selectedCard.owner}Hand` as keyof typeof prev] as Card[]),
                [`${selectedCard.owner}Base`]: removeFromLocation(prev[`${selectedCard.owner}Base` as keyof typeof prev] as Card[]),
                [otherBattlefieldKey]: {
                  ...prev[otherBattlefieldKey],
                  [selectedCard.owner]: removeFromLocation(prev[otherBattlefieldKey][selectedCard.owner as 'player1' | 'player2']),
                },
                [battlefieldKey]: {
                  ...prev[battlefieldKey],
                  [selectedCard.owner]: prev[battlefieldKey][selectedCard.owner as 'player1' | 'player2']
                    .filter(c => c.id !== selectedCard.id && c.id !== otherCard.id)
                    .concat([
                      { ...selectedCard, location, slot: finalTargetSlot },
                      { ...otherCard, slot: selectedCard.slot || finalTargetSlot }
                    ])
                    .sort((a, b) => (a.slot || 0) - (b.slot || 0)),
                },
                metadata: {
                  ...prev.metadata,
                  [playerManaKey]: Math.max(0, (prev.metadata[playerManaKey] as number) - manaCost),
                },
              }
            }
          }
        }

        const playerManaKey = `${selectedCard.owner}Mana` as keyof GameMetadata
        const otherBattlefieldKey = location === 'battlefieldA' ? 'battlefieldB' : 'battlefieldA'
        
        return {
          ...prev,
          [`${selectedCard.owner}Hand`]: removeFromLocation(prev[`${selectedCard.owner}Hand` as keyof typeof prev] as Card[]),
          [`${selectedCard.owner}Base`]: removeFromLocation(prev[`${selectedCard.owner}Base` as keyof typeof prev] as Card[]),
          // Remove from the other battlefield if the card is moving from there
          [otherBattlefieldKey]: {
            ...prev[otherBattlefieldKey],
            [selectedCard.owner]: removeFromLocation(prev[otherBattlefieldKey][selectedCard.owner as 'player1' | 'player2']),
          },
          // Add to the target battlefield
          [battlefieldKey]: {
            ...prev[battlefieldKey],
            [selectedCard.owner]: [
              // Remove from this battlefield first (in case it's already here and we're just repositioning)
              ...prev[battlefieldKey][selectedCard.owner as 'player1' | 'player2'].filter(c => c.id !== selectedCard.id),
              { ...selectedCard, location, slot: finalTargetSlot || 1 }
            ].sort((a, b) => (a.slot || 0) - (b.slot || 0)),
          },
          metadata: {
            ...prev.metadata,
            [playerManaKey]: Math.max(0, (prev.metadata[playerManaKey] as number) - manaCost),
          },
        }
      }
      return prev
    })
    setSelectedCardId(null)
  }, [selectedCard, selectedCardId, gameState, metadata, getAvailableSlots, setGameState, setSelectedCardId])

  const handleChangeSlot = useCallback((card: Card, newSlot: number, location: 'battlefieldA' | 'battlefieldB') => {
    if (newSlot < 1 || newSlot > 5) return
    
    const player = card.owner
    setGameState(prev => {
      const battlefield = prev[location][player as 'player1' | 'player2']
      
      // Check if slot is already occupied
      const slotOccupied = battlefield.some(c => c.id !== card.id && c.slot === newSlot)
      if (slotOccupied) {
        // Swap positions if slot is occupied
        const otherCard = battlefield.find(c => c.slot === newSlot)
        if (otherCard) {
          return {
            ...prev,
            [location]: {
              ...prev[location],
              [player]: battlefield.map(c => {
                if (c.id === card.id) {
                  return { ...c, slot: newSlot }
                } else if (c.id === otherCard.id) {
                  return { ...c, slot: card.slot }
                }
                return c
              }),
            },
          }
        }
      }
      
      // Just move to new slot
      return {
        ...prev,
        [location]: {
          ...prev[location],
          [player]: battlefield.map(c =>
            c.id === card.id ? { ...c, slot: newSlot } : c
          ).sort((a, b) => (a.slot || 0) - (b.slot || 0)),
        },
      }
    })
  }, [setGameState])

  const handleRemoveFromBattlefield = useCallback((card: Card, location: 'battlefieldA' | 'battlefieldB') => {
    // If stacked, unstack it
    if (card.cardType === 'generic') {
      const genericCard = card as GenericUnit
      if (genericCard.stackedWith) {
        setGameState(prev => {
          const battlefield = prev[location][card.owner as 'player1' | 'player2']
          const otherCard = battlefield.find(c => 
            c.id === genericCard.stackedWith || 
            (c.cardType === 'generic' && (c as GenericUnit).stackedWith === card.id)
          )
          
          const updatedBattlefield = battlefield
            .filter(c => c.id !== card.id && c.id !== otherCard?.id)
            .map(c => {
              if (c.id === otherCard?.id && c.cardType === 'generic') {
                // Remove stacking info from the other card
                const { stackedWith, stackPower, stackHealth, ...rest } = c as GenericUnit
                return rest as GenericUnit
              }
              return c
            })

          // Create a clean version of the card without stacking
          const { stackedWith, stackPower, stackHealth, ...cleanCard } = genericCard
          
          return {
            ...prev,
            [location]: {
              ...prev[location],
              [card.owner]: updatedBattlefield,
            },
            [`${card.owner}Base`]: [...prev[`${card.owner}Base` as keyof typeof prev] as Card[], { ...cleanCard, location: 'base' }],
          }
        })
        return
      }
    }
    
    // Regular removal
    setGameState(prev => ({
      ...prev,
      [location]: {
        ...prev[location],
        [card.owner]: prev[location][card.owner as 'player1' | 'player2'].filter(c => c.id !== card.id),
      },
      [`${card.owner}Base`]: [...prev[`${card.owner}Base` as keyof typeof prev] as Card[], { ...card, location: 'base' }],
    }))
  }, [setGameState])

  return {
    handleDeploy,
    handleChangeSlot,
    handleRemoveFromBattlefield,
  }
}

