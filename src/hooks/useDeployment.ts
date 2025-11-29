import { useCallback } from 'react'
import { Card, Location, GenericUnit, GameMetadata, BATTLEFIELD_SLOT_LIMIT, Hero, ItemCard } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { tier1Items } from '../game/sampleData'

export function useDeployment() {
  const { gameState, setGameState, selectedCard, selectedCardId, setSelectedCardId, getAvailableSlots } = useGameContext()
  const metadata = gameState.metadata

  const handleDeploy = useCallback((location: Location, targetSlot?: number) => {
    if (!selectedCardId || !selectedCard) return
    
    const isPlayPhase = metadata.currentPhase === 'play'
    
    if (!isPlayPhase) {
      alert(`Cannot deploy during ${metadata.currentPhase} phase!`)
      return
    }
    
    // Turn 1 deployment sequence check
    let shouldSkipInitiativePass = false
    let newDeploymentPhase = metadata.turn1DeploymentPhase || 'initial'
    
    if (metadata.currentTurn === 1 && selectedCard.cardType === 'hero') {
      const deploymentPhase = metadata.turn1DeploymentPhase || 'initial'
      
      if (deploymentPhase === 'initial') {
        // Player A (player1) deploys first hero
        if (selectedCard.owner !== 'player1') {
          alert('Player 1 must deploy first hero on turn 1')
          return
        }
        // After deployment, move to playerB phase
        newDeploymentPhase = 'playerB'
        // Initiative will be passed at the end, but we'll handle it there
      } else if (deploymentPhase === 'playerB') {
        // Player B deploys first hero
        if (selectedCard.owner !== 'player2') {
          alert('Player 2 must deploy first hero on turn 1')
          return
        }
        // After deployment, move to secret phase
        newDeploymentPhase = 'secret'
        shouldSkipInitiativePass = true // Don't pass initiative during secret phase
      } else if (deploymentPhase === 'secret') {
        // Both players deploy secretly - no initiative check, no passing
        shouldSkipInitiativePass = true
        // We'll check hero count in the final state update after deployment happens
      } else if (deploymentPhase === 'complete') {
        // Turn 1 deployment complete - normal initiative rules apply
        // Check initiative
        if (metadata.initiativePlayer !== selectedCard.owner) {
          alert('You do not have initiative!')
          return
        }
      }
    } else {
      // Normal turn (not turn 1) - check initiative
      if (metadata.initiativePlayer !== selectedCard.owner) {
        alert('You do not have initiative!')
        return
      }
    }
    
    // Check mana cost
    const manaCost = selectedCard.manaCost || 0
    const playerMana = selectedCard.owner === 'player1' ? metadata.player1Mana : metadata.player2Mana
    
    if (manaCost > playerMana) {
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
        
        // Deduct mana
        const manaKey = `${selectedCard.owner}Mana` as keyof GameMetadata
        
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
            ...(isHero ? { [movedToBaseKey]: true } : {}),
            [manaKey]: (prev.metadata[manaKey] as number) - manaCost,
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
              const manaKey = `${selectedCard.owner}Mana` as keyof GameMetadata
              
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
                  [manaKey]: (prev.metadata[manaKey] as number) - manaCost,
                },
              }
            }
          }
        }

        const otherBattlefieldKey = location === 'battlefieldA' ? 'battlefieldB' : 'battlefieldA'
        const manaKey = `${selectedCard.owner}Mana` as keyof GameMetadata
        
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
            [manaKey]: (prev.metadata[manaKey] as number) - manaCost,
          },
        }
      }
      return prev
    })
    
    // Handle initiative passing and turn 1 deployment phase updates
    setGameState(prev => {
      const updatedMetadata = { ...prev.metadata }
      
      // Update turn 1 deployment phase if needed
      if (metadata.currentTurn === 1 && selectedCard.cardType === 'hero') {
        // If we're in secret phase, check if both players have deployed 2 heroes now
        if (newDeploymentPhase === 'secret') {
          // Count heroes AFTER this deployment (using prev state which includes the new deployment)
          const player1HeroesDeployed = [
            ...prev.battlefieldA.player1,
            ...prev.battlefieldB.player1,
          ].filter(c => c.cardType === 'hero').length
          const player2HeroesDeployed = [
            ...prev.battlefieldA.player2,
            ...prev.battlefieldB.player2,
          ].filter(c => c.cardType === 'hero').length
          
          // Check if both have deployed 2 heroes
          if (player1HeroesDeployed >= 2 && player2HeroesDeployed >= 2) {
            // Both players have deployed 2 heroes - complete turn 1 deployment
            updatedMetadata.turn1DeploymentPhase = 'complete'
            updatedMetadata.initiativePlayer = 'player1' // Player 1 gets initiative after deployment
          } else {
            // Still in secret phase
            updatedMetadata.turn1DeploymentPhase = 'secret'
            updatedMetadata.initiativePlayer = null // Keep initiative null during secret phase
          }
        } else {
          updatedMetadata.turn1DeploymentPhase = newDeploymentPhase
        }
      }
      
      // Handle initiative passing
      if (shouldSkipInitiativePass) {
        // During secret deployment, initiative is already handled above
        if (newDeploymentPhase !== 'secret') {
          if (newDeploymentPhase === 'complete') {
            // Turn 1 deployment complete - Player 1 gets initiative (already set above)
          }
        }
        // Reset pass flags
        updatedMetadata.player1Passed = false
        updatedMetadata.player2Passed = false
      } else if (metadata.currentTurn === 1 && newDeploymentPhase === 'playerB') {
        // After Player 1 deploys, pass initiative to Player 2
        updatedMetadata.initiativePlayer = 'player2'
        updatedMetadata.player1Passed = false
        updatedMetadata.player2Passed = false
      } else if (metadata.currentTurn > 1 || (metadata.currentTurn === 1 && updatedMetadata.turn1DeploymentPhase === 'complete')) {
        // Normal turn or turn 1 complete - pass initiative to opponent after deployment
        // Only if we're not in secret phase
        if (updatedMetadata.turn1DeploymentPhase !== 'secret') {
          updatedMetadata.initiativePlayer = prev.metadata.initiativePlayer === 'player1' ? 'player2' : 'player1'
          updatedMetadata.player1Passed = false
          updatedMetadata.player2Passed = false
        }
      }
      
      return {
        ...prev,
        metadata: updatedMetadata,
      }
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

  const handleEquipItem = useCallback((hero: Hero, itemCard: ItemCard, battlefieldId: 'battlefieldA' | 'battlefieldB') => {
    // Check initiative
    if (metadata.initiativePlayer !== itemCard.owner) {
      alert('You do not have initiative!')
      return
    }
    
    // Items cost 0 mana (no mana check needed)
    // Items can only be equipped to heroes (not units)
    if (hero.cardType !== 'hero') {
      alert('Items can only be equipped to heroes!')
      return
    }
    
    // Get the item template
    const item = tier1Items.find(i => i.id === itemCard.itemId)
    if (!item) {
      alert('Item not found!')
      return
    }
    
    // Equip the item to the hero
    setGameState(prev => {
      const updatedBattlefield = prev[battlefieldId]
      const player = hero.owner as 'player1' | 'player2'
      
      // Update the hero with the new item
      const updatedHeroes = updatedBattlefield[player].map(c => {
        if (c.id === hero.id && c.cardType === 'hero') {
          const currentItems = (c as Hero).equippedItems || []
          return {
            ...c,
            equippedItems: [...currentItems, itemCard.itemId],
          } as Hero
        }
        return c
      })
      
      // Remove item from hand
      const updatedHand = (prev[`${itemCard.owner}Hand` as keyof typeof prev] as Card[])
        .filter(c => c.id !== itemCard.id)
      
      // Pass initiative to opponent
      const newInitiativePlayer = prev.metadata.initiativePlayer === 'player1' ? 'player2' : 'player1'
      
      return {
        ...prev,
        [battlefieldId]: {
          ...prev[battlefieldId],
          [player]: updatedHeroes,
        },
        [`${itemCard.owner}Hand`]: updatedHand,
        metadata: {
          ...prev.metadata,
          initiativePlayer: newInitiativePlayer,
          // Reset pass flags when an action is taken
          player1Passed: false,
          player2Passed: false,
        },
      }
    })
    
    setSelectedCardId(null)
  }, [metadata, setGameState, setSelectedCardId])

  return {
    handleDeploy,
    handleChangeSlot,
    handleRemoveFromBattlefield,
    handleEquipItem,
  }
}



