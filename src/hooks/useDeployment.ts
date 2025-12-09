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
    
    // Turn 1 deployment sequence check (Artifact-style counter-deployment)
    let shouldSkipInitiativePass = false
    let newDeploymentPhase = metadata.turn1DeploymentPhase || 'p1_lane1'
    
    if (metadata.currentTurn === 1 && selectedCard.cardType === 'hero') {
      const deploymentPhase = metadata.turn1DeploymentPhase || 'p1_lane1'
      
      if (deploymentPhase === 'p1_lane1') {
        // Player 1 deploys hero to lane 1 (battlefieldA)
        if (selectedCard.owner !== 'player1') {
          alert('Player 1 must deploy first hero to lane 1 (Battlefield A)')
          return
        }
        if (location !== 'battlefieldA') {
          alert('Player 1 must deploy to lane 1 (Battlefield A) first')
          return
        }
        // After deployment, Player 2 can counter-deploy to lane 1
        newDeploymentPhase = 'p2_lane1'
      } else if (deploymentPhase === 'p2_lane1') {
        // Player 2 can counter-deploy to lane 1 (battlefieldA) OR pass
        // If deploying, must be to battlefieldA
        if (selectedCard.owner === 'player2' && location !== 'battlefieldA') {
          alert('Player 2 can only counter-deploy to lane 1 (Battlefield A) or pass')
          return
        }
        // If player 2 is deploying, move to next phase
        if (selectedCard.owner === 'player2') {
          newDeploymentPhase = 'p2_lane2'
        }
        // If player 1 tries to deploy (shouldn't happen), block it
        if (selectedCard.owner === 'player1') {
          alert('Player 2 can counter-deploy to lane 1 or pass')
          return
        }
      } else if (deploymentPhase === 'p2_lane2') {
        // Player 2 deploys hero to lane 2 (battlefieldB)
        if (selectedCard.owner !== 'player2') {
          alert('Player 2 must deploy hero to lane 2 (Battlefield B)')
          return
        }
        if (location !== 'battlefieldB') {
          alert('Player 2 must deploy to lane 2 (Battlefield B)')
          return
        }
        // After deployment, Player 1 can counter-deploy to lane 2
        newDeploymentPhase = 'p1_lane2'
      } else if (deploymentPhase === 'p1_lane2') {
        // Player 1 can counter-deploy to lane 2 (battlefieldB) OR pass
        // If deploying, must be to battlefieldB
        if (selectedCard.owner === 'player1' && location !== 'battlefieldB') {
          alert('Player 1 can only counter-deploy to lane 2 (Battlefield B) or pass')
          return
        }
        // If player 1 is deploying, deployment is complete
        if (selectedCard.owner === 'player1') {
          newDeploymentPhase = 'complete'
        }
        // If player 2 tries to deploy (shouldn't happen), block it
        if (selectedCard.owner === 'player2') {
          alert('Player 1 can counter-deploy to lane 2 or pass')
          return
        }
      } else if (deploymentPhase === 'complete') {
        // Turn 1 deployment complete - normal action rules apply
        // Check action
        if (metadata.actionPlayer !== selectedCard.owner) {
          alert('It\'s not your turn to act!')
          return
        }
      }
    } else {
      // Normal turn (not turn 1) - check action
      if (metadata.actionPlayer !== selectedCard.owner) {
        alert('It\'s not your turn to act!')
        return
      }
    }
    
    // Check if hero is on cooldown (cannot deploy if cooldown counter > 0)
    if (selectedCard.cardType === 'hero') {
      const cooldownCounter = metadata.deathCooldowns[selectedCard.id]
      if (cooldownCounter !== undefined && cooldownCounter > 0) {
        alert(`Hero is on cooldown! ${cooldownCounter} turn${cooldownCounter !== 1 ? 's' : ''} remaining.`)
        return
      }
    }
    
    // Check mana cost (spells don't cost mana to move to base, only when played)
    const isSpell = selectedCard.cardType === 'spell'
    const manaCost = selectedCard.manaCost || 0
    const playerMana = selectedCard.owner === 'player1' ? metadata.player1Mana : metadata.player2Mana
    
    // Only check mana for non-spells, or spells being deployed to battlefields (not base)
    if (!isSpell || location !== 'base') {
      if (manaCost > playerMana) {
        alert(`Not enough mana! Need ${manaCost}, have ${playerMana}`)
        return
      }
    }

    // Check if deploying to battlefield and slots are full
    if ((location === 'battlefieldA' || location === 'battlefieldB')) {
      const battlefield = location === 'battlefieldA' 
        ? gameState.battlefieldA[selectedCard.owner as 'player1' | 'player2']
        : gameState.battlefieldB[selectedCard.owner as 'player1' | 'player2']
      
      const availableSlots = getAvailableSlots(battlefield)
      
      if (selectedCard.cardType !== 'generic' && availableSlots <= 0 && !targetSlot) {
        alert('Battlefield is full! Maximum 4 slots.')
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
        
        // Deduct mana (spells don't cost mana to move to base, only when played)
        const manaKey = `${selectedCard.owner}Mana` as keyof GameMetadata
        const shouldDeductMana = !isSpell // Only deduct mana for non-spells
        
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
            ...(shouldDeductMana ? { [manaKey]: (prev.metadata[manaKey] as number) - manaCost } : {}),
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
        updatedMetadata.turn1DeploymentPhase = newDeploymentPhase
        
        // When deployment is complete, set action and initiative
        if (newDeploymentPhase === 'complete') {
          updatedMetadata.actionPlayer = 'player1' // Player 1 gets action after deployment
          updatedMetadata.initiativePlayer = 'player1' // Player 1 also gets initiative
        } else {
          // During deployment, no action/initiative (players are deploying, not acting)
          updatedMetadata.actionPlayer = null
          updatedMetadata.initiativePlayer = null
        }
      }
      
      // Handle action/initiative passing
      // During turn 1 deployment phase (before complete), don't pass action/initiative
      if (metadata.currentTurn === 1 && selectedCard.cardType === 'hero' && updatedMetadata.turn1DeploymentPhase !== 'complete') {
        // Still in deployment phase - action/initiative handled above
        updatedMetadata.player1Passed = false
        updatedMetadata.player2Passed = false
      } else {
        // Any action (deploy, spell, ability, etc.) passes BOTH action AND initiative to opponent
        // This includes: turn 1 after deployment complete, or any turn > 1
        const otherPlayer = prev.metadata.actionPlayer === 'player1' ? 'player2' : 'player1'
        updatedMetadata.actionPlayer = otherPlayer
        updatedMetadata.initiativePlayer = otherPlayer
        updatedMetadata.player1Passed = false
        updatedMetadata.player2Passed = false
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
    // Check action
    if (metadata.actionPlayer !== itemCard.owner) {
      alert('It\'s not your turn to act!')
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
      
      // Equipping an item is an action - pass both action AND initiative to opponent
      const otherPlayer = itemCard.owner === 'player1' ? 'player2' : 'player1'
      
      return {
        ...prev,
        [battlefieldId]: {
          ...prev[battlefieldId],
          [player]: updatedHeroes,
        },
        [`${itemCard.owner}Hand`]: updatedHand,
        metadata: {
          ...prev.metadata,
          actionPlayer: otherPlayer,
          initiativePlayer: otherPlayer,
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



