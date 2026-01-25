import { useCallback } from 'react'
import { Card, Location, GenericUnit, GameMetadata, BATTLEFIELD_SLOT_LIMIT, Hero, ItemCard, BaseCard, SpellCard, PendingEffect } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { tier1Items } from '../game/sampleData'
import { canAffordCard, consumeRunesForCard, addRunesFromHero, removeRunesFromHero, addTemporaryRunes, consumeRunesForCardWithTracking } from '../game/runeSystem'
import { canPlayCardInLane } from '../game/colorSystem'
import { buildTokenDefinitions, getTemplateId, resolveSpellEffect } from '../game/effectResolver'

export function useDeployment() {
  const { gameState, setGameState, selectedCard, selectedCardId, setSelectedCardId, getAvailableSlots, setPendingEffect, setTemporaryZone } = useGameContext()
  const metadata = gameState.metadata

  const handleDeploy = useCallback((location: Location, targetSlot?: number) => {
    if (!selectedCardId || !selectedCard) return

    const removeFromLocation = (cards: Card[]) => cards.filter(c => c.id !== selectedCardId)
    
    const isPlayPhase = metadata.currentPhase === 'play'
    const isDeployPhase = metadata.currentPhase === 'deploy'
    
    // Deploy phase: only heroes can be deployed, and bouncing is allowed
    if (isDeployPhase) {
      let newDeploymentPhase = metadata.turn1DeploymentPhase || 'p1_lane1'

      if (selectedCard.cardType !== 'hero') {
        alert('Only heroes can be deployed during the deploy phase!')
        return
      }
      if (location !== 'battlefieldA' && location !== 'battlefieldB') {
        alert('Heroes must be deployed to a battlefield during deploy phase!')
        return
      }

      if (metadata.currentTurn === 1 && metadata.turn1DeploymentPhase !== 'complete') {
        const deploymentPhase = metadata.turn1DeploymentPhase || 'p1_lane1'

        if (deploymentPhase === 'p1_lane1') {
          if (selectedCard.owner !== 'player1') {
            alert('Player 1 must deploy first hero to lane 1 (Battlefield A)')
            return
          }
          if (location !== 'battlefieldA') {
            alert('Player 1 must deploy to lane 1 (Battlefield A) first')
            return
          }
          newDeploymentPhase = 'p2_lane1'
        } else if (deploymentPhase === 'p2_lane1') {
          if (selectedCard.owner === 'player2' && location !== 'battlefieldA') {
            alert('Player 2 can only counter-deploy to lane 1 (Battlefield A) or pass')
            return
          }
          if (selectedCard.owner === 'player2') {
            newDeploymentPhase = 'p2_lane2'
          }
          if (selectedCard.owner === 'player1') {
            alert('Player 2 can counter-deploy to lane 1 or pass')
            return
          }
        } else if (deploymentPhase === 'p2_lane2') {
          if (selectedCard.owner !== 'player2') {
            alert('Player 2 must deploy hero to lane 2 (Battlefield B)')
            return
          }
          if (location !== 'battlefieldB') {
            alert('Player 2 must deploy to lane 2 (Battlefield B)')
            return
          }
          newDeploymentPhase = 'p1_lane2'
        } else if (deploymentPhase === 'p1_lane2') {
          if (selectedCard.owner === 'player1' && location !== 'battlefieldB') {
            alert('Player 1 can only counter-deploy to lane 2 (Battlefield B) or pass')
            return
          }
          if (selectedCard.owner === 'player1') {
            newDeploymentPhase = 'complete'
          }
          if (selectedCard.owner === 'player2') {
            alert('Player 1 can counter-deploy to lane 2 or pass')
            return
          }
        }
      }

      // Check if hero is on cooldown
      const cooldownCounter = metadata.deathCooldowns[selectedCard.id]
      if (cooldownCounter !== undefined && cooldownCounter > 0) {
        alert(`Hero is on cooldown! ${cooldownCounter} turn${cooldownCounter !== 1 ? 's' : ''} remaining.`)
        return
      }
      
      // No turn 2 restriction - players can deploy any number of heroes
      
      // Handle deploy phase deployment with bounce mechanic
      setGameState(prev => {
        const battlefieldKey = location as 'battlefieldA' | 'battlefieldB'
        const playerKey = selectedCard.owner as 'player1' | 'player2'
        const battlefield = prev[battlefieldKey][playerKey]
        
        // Find slot - use target slot or first available
        let finalSlot = targetSlot
        if (!finalSlot) {
          for (let i = 1; i <= 5; i++) {
            if (!battlefield.some(c => c.slot === i)) {
              finalSlot = i
              break
            }
          }
        }
        if (!finalSlot) finalSlot = 1 // Default to slot 1 if all full (will bounce)
        
        // Check if there's an existing hero in this slot
        const existingHeroInSlot = battlefield.find(c => c.slot === finalSlot && c.cardType === 'hero') as Hero | undefined
        
        // Remove deploying hero from base or deploy zone
        const newBase = (prev[`${selectedCard.owner}Base` as keyof typeof prev] as Card[])
          .filter(c => c.id !== selectedCard.id)
        const newDeployZone = (prev[`${selectedCard.owner}DeployZone` as keyof typeof prev] as Card[])
          .filter(c => c.id !== selectedCard.id)
        
        // If there's an existing hero, bounce it to base with 1 cooldown
        let updatedBase = newBase
        let updatedCooldowns = { ...prev.metadata.deathCooldowns }
        let updatedRunePool = prev.metadata[`${selectedCard.owner}RunePool` as keyof typeof prev.metadata] as any
        
        if (existingHeroInSlot) {
          // Bounce the existing hero to base
          const bouncedHero = {
            ...existingHeroInSlot,
            location: 'base' as const,
            slot: undefined,
          }
          updatedBase = [...updatedBase, bouncedHero]
          // Add 1 turn cooldown to bounced hero
          updatedCooldowns[existingHeroInSlot.id] = 1
        }
        
        // Add runes from the deploying hero (if coming from base/deployZone, not already on battlefield)
        const wasOnBattlefield = selectedCard.location === 'battlefieldA' || selectedCard.location === 'battlefieldB'
        const isFromBaseOrDeployZone = selectedCard.location === 'base' || selectedCard.location === 'deployZone'
        if (!wasOnBattlefield && isFromBaseOrDeployZone && (selectedCard as Hero).colors) {
          const heroColors = (selectedCard as Hero).colors || []
          updatedRunePool = {
            runes: [...updatedRunePool.runes, ...heroColors],
          }
        }
        
        // Remove existing hero from battlefield if bounced, and remove the deploying hero from battlefield (if moving)
        const updatedBattlefield = battlefield
          .filter(c => c.id !== selectedCard.id && (existingHeroInSlot ? c.id !== existingHeroInSlot.id : true))
        
        // Add the deploying hero to the battlefield
        const deployedHero = {
          ...selectedCard,
          location: battlefieldKey,
          slot: finalSlot,
        }
        
        return {
          ...prev,
          [`${selectedCard.owner}Base`]: updatedBase,
          [`${selectedCard.owner}DeployZone`]: newDeployZone,
          [battlefieldKey]: {
            ...prev[battlefieldKey],
            [playerKey]: [...updatedBattlefield, deployedHero].sort((a, b) => (a.slot || 0) - (b.slot || 0)),
          },
          // Also remove from other battlefield if hero was there
          ...(selectedCard.location === 'battlefieldA' || selectedCard.location === 'battlefieldB' ? {
            [selectedCard.location]: {
              ...prev[selectedCard.location as 'battlefieldA' | 'battlefieldB'],
              [playerKey]: prev[selectedCard.location as 'battlefieldA' | 'battlefieldB'][playerKey]
                .filter(c => c.id !== selectedCard.id),
            },
          } : {}),
          metadata: {
            ...prev.metadata,
            deathCooldowns: updatedCooldowns,
            [`${selectedCard.owner}RunePool`]: updatedRunePool,
            // Increment heroes deployed counter (only counts if deploying from base/deployZone, not moving between battlefields)
            ...(selectedCard.location === 'base' || selectedCard.location === 'deployZone' ? {
              [`${selectedCard.owner}HeroesDeployedThisTurn`]: ((prev.metadata[`${selectedCard.owner}HeroesDeployedThisTurn` as keyof typeof prev.metadata] as number) || 0) + 1,
            } : {}),
            ...(metadata.currentTurn === 1 ? {
              turn1DeploymentPhase: newDeploymentPhase,
              activePlayer: newDeploymentPhase === 'p2_lane1' || newDeploymentPhase === 'p2_lane2' ? 'player2' : 'player1',
              ...(newDeploymentPhase === 'complete' ? {
                currentPhase: 'play',
                actionPlayer: 'player1',
                initiativePlayer: 'player1',
                activePlayer: 'player1',
              } : {}),
            } : {}),
          },
        }
      })
      
      setSelectedCardId(null)
      return
    }
    
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
    
    // Check costs (heroes don't cost runes - they GIVE runes when deployed)
    const isSpell = selectedCard.cardType === 'spell'
    const isHero = selectedCard.cardType === 'hero'
    const cardTemplate = selectedCard as BaseCard
    const playerMana = selectedCard.owner === 'player1' ? metadata.player1Mana : metadata.player2Mana
    const playerRunePool = selectedCard.owner === 'player1' ? metadata.player1RunePool : metadata.player2RunePool
    
    // Check costs for all non-heroes (including spells)
    // Heroes don't cost runes - they generate runes when deployed
    if (!isHero) {
      // Check mana cost
      if (cardTemplate.manaCost && cardTemplate.manaCost > playerMana) {
        alert(`Not enough mana! Need ${cardTemplate.manaCost}, have ${playerMana}`)
        return
      }
      
      // Check rune requirements (color requirements) - only for non-heroes
      if (!canAffordCard(cardTemplate, playerMana, playerRunePool)) {
        const missingRunes = cardTemplate.colors?.filter(color => {
          const available = playerRunePool.runes.filter(r => r === color).length
          return available === 0
        }) || []
        if (missingRunes.length > 0) {
          alert(`Missing required runes: ${missingRunes.join(', ')}`)
        } else {
          alert(`Cannot afford ${cardTemplate.name}`)
        }
        return
      }
    }

    // Spells can be cast onto a base without occupying a slot
    if (selectedCard.cardType === 'spell' && location === 'base') {
      setGameState(prev => {
        const runePoolKey = `${selectedCard.owner}RunePool` as keyof GameMetadata
        const manaKey = `${selectedCard.owner}Mana` as keyof GameMetadata
        let updatedRunePool = prev.metadata[runePoolKey] as any
        let updatedMana = prev.metadata[manaKey] as number

        if (cardTemplate.manaCost) {
          updatedMana = updatedMana - cardTemplate.manaCost
        }
        const { newPool } = consumeRunesForCardWithTracking(cardTemplate, updatedRunePool)
        updatedRunePool = newPool

        const otherPlayer = prev.metadata.actionPlayer === 'player1' ? 'player2' : 'player1'

        return {
          ...prev,
          [`${selectedCard.owner}Hand`]: removeFromLocation(prev[`${selectedCard.owner}Hand` as keyof typeof prev] as Card[]),
          [`${selectedCard.owner}Base`]: removeFromLocation(prev[`${selectedCard.owner}Base` as keyof typeof prev] as Card[]),
          [`${selectedCard.owner}DeployZone`]: removeFromLocation(prev[`${selectedCard.owner}DeployZone` as keyof typeof prev] as Card[]),
          metadata: {
            ...prev.metadata,
            [runePoolKey]: updatedRunePool,
            [manaKey]: updatedMana,
            actionPlayer: otherPlayer,
            initiativePlayer: otherPlayer,
            activePlayer: otherPlayer,
            player1Passed: false,
            player2Passed: false,
          },
        }
      })

      if (isPlayPhase) {
        const spellCard = selectedCard as SpellCard
        if (spellCard.effect.type === 'create_tokens' || spellCard.effect.type === 'tokenize') {
          const tokens = buildTokenDefinitions(spellCard)
          const templateId = getTemplateId(spellCard.id)
          const temporaryZone = {
            type: 'tokenize' as const,
            title: 'Token Creation',
            description: 'Drag tokens onto the battlefield.',
            owner: spellCard.owner,
            tokens,
          }
          setPendingEffect({
            cardId: templateId,
            owner: spellCard.owner,
            effect: spellCard.effect,
            temporaryZone,
          })
          setTemporaryZone(temporaryZone)
          setSelectedCardId(null)
          return
        }

        let pendingEffect: PendingEffect | null = null
        setGameState(prev => {
          const result = resolveSpellEffect({
            gameState: prev,
            spell: spellCard,
            owner: spellCard.owner,
          })
          pendingEffect = result.pendingEffect
          return result.nextState
        })
        setPendingEffect(pendingEffect)
        setTemporaryZone(pendingEffect?.temporaryZone || null)
      }

      setSelectedCardId(null)
      return
    }

    // Spells can be cast onto a battlefield without occupying a slot
    if (selectedCard.cardType === 'spell' && (location === 'battlefieldA' || location === 'battlefieldB')) {
      setGameState(prev => {
        const runePoolKey = `${selectedCard.owner}RunePool` as keyof GameMetadata
        const manaKey = `${selectedCard.owner}Mana` as keyof GameMetadata
        let updatedRunePool = prev.metadata[runePoolKey] as any
        let updatedMana = prev.metadata[manaKey] as number

        if (cardTemplate.manaCost) {
          updatedMana = updatedMana - cardTemplate.manaCost
        }
        const { newPool } = consumeRunesForCardWithTracking(cardTemplate, updatedRunePool)
        updatedRunePool = newPool

        const otherPlayer = prev.metadata.actionPlayer === 'player1' ? 'player2' : 'player1'

        return {
          ...prev,
          [`${selectedCard.owner}Hand`]: removeFromLocation(prev[`${selectedCard.owner}Hand` as keyof typeof prev] as Card[]),
          [`${selectedCard.owner}Base`]: removeFromLocation(prev[`${selectedCard.owner}Base` as keyof typeof prev] as Card[]),
          [`${selectedCard.owner}DeployZone`]: removeFromLocation(prev[`${selectedCard.owner}DeployZone` as keyof typeof prev] as Card[]),
          metadata: {
            ...prev.metadata,
            [runePoolKey]: updatedRunePool,
            [manaKey]: updatedMana,
            actionPlayer: otherPlayer,
            initiativePlayer: otherPlayer,
            activePlayer: otherPlayer,
            player1Passed: false,
            player2Passed: false,
          },
        }
      })

      if (isPlayPhase) {
        const spellCard = selectedCard as SpellCard
        if (spellCard.effect.type === 'create_tokens' || spellCard.effect.type === 'tokenize') {
          const tokens = buildTokenDefinitions(spellCard)
          const templateId = getTemplateId(spellCard.id)
          const temporaryZone = {
            type: 'tokenize' as const,
            title: 'Token Creation',
            description: 'Drag tokens onto the battlefield.',
            owner: spellCard.owner,
            tokens,
          }
          setPendingEffect({
            cardId: templateId,
            owner: spellCard.owner,
            effect: spellCard.effect,
            temporaryZone,
          })
          setTemporaryZone(temporaryZone)
          setSelectedCardId(null)
          return
        }

        let pendingEffect: PendingEffect | null = null
        setGameState(prev => {
          const result = resolveSpellEffect({
            gameState: prev,
            spell: spellCard,
            owner: spellCard.owner,
          })
          pendingEffect = result.pendingEffect
          return result.nextState
        })
        setPendingEffect(pendingEffect)
        setTemporaryZone(pendingEffect?.temporaryZone || null)
      }

      setSelectedCardId(null)
      return
    }

    // Check if deploying to battlefield and slots are full
    if ((location === 'battlefieldA' || location === 'battlefieldB')) {
      const battlefield = location === 'battlefieldA' 
        ? gameState.battlefieldA[selectedCard.owner as 'player1' | 'player2']
        : gameState.battlefieldB[selectedCard.owner as 'player1' | 'player2']
      
      // Check lane color requirements for non-hero cards
      if (!isHero && cardTemplate.colors && cardTemplate.colors.length > 0) {
        const laneHeroes = battlefield.filter(c => c.cardType === 'hero') as Hero[]
        if (!canPlayCardInLane(cardTemplate, laneHeroes)) {
          const heroColors = laneHeroes.flatMap(h => h.colors || [])
          alert(`Cannot play ${cardTemplate.name} here! Requires ${cardTemplate.colors.join('+')} hero(es), but lane has: ${heroColors.length > 0 ? heroColors.join(', ') : 'no heroes'}`)
          return
        }
      }
      
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
        
        // Handle runes and mana costs
        const runePoolKey = `${selectedCard.owner}RunePool` as keyof GameMetadata
        const manaKey = `${selectedCard.owner}Mana` as keyof GameMetadata
        const isHeroCard = selectedCard.cardType === 'hero'
        
        let updatedRunePool = prev.metadata[runePoolKey] as any
        let updatedMana = prev.metadata[manaKey] as number
        
        // Heroes don't cost runes - they GIVE runes when deployed
        // Bouncing heroes does NOT remove runes - bouncing should be strategic, not punishing
        // Non-hero cards (including spells): pay mana and consume runes
        if (!isHeroCard) {
          // Pay mana cost
          if (cardTemplate.manaCost) {
            updatedMana = updatedMana - cardTemplate.manaCost
          }
          // Consume runes for color requirements (only if consumesRunes: true)
          const { newPool, consumedColors } = consumeRunesForCardWithTracking(cardTemplate, updatedRunePool)
          updatedRunePool = newPool
          
          // Handle spell effects that add temporary runes (like Dark Ritual)
          if (cardTemplate.cardType === 'spell' && cardTemplate.effect) {
            const spellCard = cardTemplate as SpellCard
            const spellEffect = spellCard.effect
            
            if (spellEffect.type === 'add_temporary_runes' && spellEffect.runeColors) {
              updatedRunePool = addTemporaryRunes(updatedRunePool, spellEffect.runeColors as any)
            }
            
            // Handle mana refund for "free spells" (Urza block inspired)
            if (spellCard.refundMana && spellCard.refundMana > 0) {
              updatedMana = updatedMana + spellCard.refundMana
            }
          }
          
        }
        
        return {
          ...prev,
          [`${selectedCard.owner}Hand`]: removeFromLocation(prev[`${selectedCard.owner}Hand` as keyof typeof prev] as Card[]),
          [`${selectedCard.owner}Base`]: [...prev[`${selectedCard.owner}Base` as keyof typeof prev] as Card[], healedCard],
          [`${selectedCard.owner}DeployZone`]: removeFromLocation(prev[`${selectedCard.owner}DeployZone` as keyof typeof prev] as Card[]),
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
            ...(isHeroCard ? { [movedToBaseKey]: true } : {}),
            [runePoolKey]: updatedRunePool,
            ...(!isHeroCard ? { [manaKey]: updatedMana } : {}),
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
              const runePoolKey = `${selectedCard.owner}RunePool` as keyof GameMetadata
              const manaKey = `${selectedCard.owner}Mana` as keyof GameMetadata
              
              // Handle runes and mana
              let updatedRunePool = prev.metadata[runePoolKey] as any
              let updatedMana = prev.metadata[manaKey] as number
              const isHeroCard = selectedCard.cardType === 'hero'
              
        // If hero is deploying, add runes from that hero
        if (isHeroCard && (location === 'battlefieldA' || location === 'battlefieldB')) {
          // Hero is deploying - add runes from that hero
          // Find the card in previous state to check its actual location
          const prevCard = [...prev[`${selectedCard.owner}Hand` as keyof typeof prev] as Card[],
                            ...prev[`${selectedCard.owner}Base` as keyof typeof prev] as Card[],
                            ...prev.battlefieldA[selectedCard.owner as 'player1' | 'player2'],
                            ...prev.battlefieldB[selectedCard.owner as 'player1' | 'player2']]
                            .find(c => c.id === selectedCardId)
          // Check if hero was previously on a battlefield (if so, don't add runes again)
          const wasOnBattlefield = prevCard && (prevCard.location === 'battlefieldA' || prevCard.location === 'battlefieldB')
          if (!wasOnBattlefield) {
            // Hero is deploying for the first time (from base/hand) - add runes
            updatedRunePool = addRunesFromHero(selectedCard as Hero, updatedRunePool)
          }
        } else if (!isHeroCard) {
                // Non-hero cards (including spells): pay mana and consume runes
                // Pay mana cost
                if (cardTemplate.manaCost) {
                  updatedMana = updatedMana - cardTemplate.manaCost
                }
                // Consume runes for color requirements (only if consumesRunes: true)
                const { newPool, consumedColors } = consumeRunesForCardWithTracking(cardTemplate, updatedRunePool)
                updatedRunePool = newPool
                
                // Handle spell effects that add temporary runes (like Dark Ritual)
                if (cardTemplate.cardType === 'spell' && cardTemplate.effect) {
                  const spellCard = cardTemplate as SpellCard
                  const spellEffect = spellCard.effect
                  
                  if (spellEffect.type === 'add_temporary_runes' && spellEffect.runeColors) {
                    updatedRunePool = addTemporaryRunes(updatedRunePool, spellEffect.runeColors as any)
                  }
                  
                  // Handle mana refund for "free spells" (Urza block inspired)
                  if (spellCard.refundMana && spellCard.refundMana > 0) {
                    updatedMana = updatedMana + spellCard.refundMana
                  }
                }
                
              }
              
              return {
                ...prev,
                [`${selectedCard.owner}Hand`]: removeFromLocation(prev[`${selectedCard.owner}Hand` as keyof typeof prev] as Card[]),
                [`${selectedCard.owner}Base`]: removeFromLocation(prev[`${selectedCard.owner}Base` as keyof typeof prev] as Card[]),
                [`${selectedCard.owner}DeployZone`]: removeFromLocation(prev[`${selectedCard.owner}DeployZone` as keyof typeof prev] as Card[]),
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
                  [runePoolKey]: updatedRunePool,
                  ...(!isHeroCard ? { [manaKey]: updatedMana } : {}),
                },
              }
            }
          }
        }

        const otherBattlefieldKey = location === 'battlefieldA' ? 'battlefieldB' : 'battlefieldA'
        const runePoolKey = `${selectedCard.owner}RunePool` as keyof GameMetadata
        const manaKey = `${selectedCard.owner}Mana` as keyof GameMetadata
        
        // Pay mana and consume runes if needed
        let updatedRunePool = prev.metadata[runePoolKey] as any
        let updatedMana = prev.metadata[manaKey] as number
        
        // Check if this is a hero card
        const isHeroCard = selectedCard.cardType === 'hero'
        
        // Heroes don't cost mana or runes - they GIVE runes when deployed
        // Non-hero cards (including spells): pay mana and consume runes
        if (!isHeroCard) {
          // Pay mana cost
          if (cardTemplate.manaCost) {
            updatedMana = updatedMana - cardTemplate.manaCost
          }
          // Consume runes for color requirements (only if consumesRunes: true)
          const { newPool, consumedColors } = consumeRunesForCardWithTracking(cardTemplate, updatedRunePool)
          updatedRunePool = newPool
          
          // Handle spell effects that add temporary runes (like Dark Ritual)
          if (cardTemplate.cardType === 'spell' && cardTemplate.effect) {
            const spellCard = cardTemplate as SpellCard
            const spellEffect = spellCard.effect
            
            if (spellEffect.type === 'add_temporary_runes' && spellEffect.runeColors) {
              updatedRunePool = addTemporaryRunes(updatedRunePool, spellEffect.runeColors as any)
            }
            
            // Handle mana refund for "free spells" (Urza block inspired)
            if (spellCard.refundMana && spellCard.refundMana > 0) {
              updatedMana = updatedMana + spellCard.refundMana
            }
          }
          
        }
        
        // If hero is deploying to a battlefield, add runes from that hero
        if (isHeroCard && (location === 'battlefieldA' || location === 'battlefieldB')) {
          // Hero is deploying - add runes from that hero (one-time)
          // Find the card in previous state to check its actual location
          const prevCard = [...prev[`${selectedCard.owner}Hand` as keyof typeof prev] as Card[],
                            ...prev[`${selectedCard.owner}Base` as keyof typeof prev] as Card[],
                            ...prev[`${selectedCard.owner}DeployZone` as keyof typeof prev] as Card[],
                            ...prev.battlefieldA[selectedCard.owner as 'player1' | 'player2'],
                            ...prev.battlefieldB[selectedCard.owner as 'player1' | 'player2']]
                            .find(c => c.id === selectedCardId)
          // Check if hero was previously on a battlefield (if so, don't add runes again)
          const wasOnBattlefield = prevCard && (prevCard.location === 'battlefieldA' || prevCard.location === 'battlefieldB')
          if (!wasOnBattlefield) {
            // Hero is deploying for the first time (from base/deployZone/hand) - add runes
            updatedRunePool = addRunesFromHero(selectedCard as Hero, updatedRunePool)
          }
        }
        
        return {
          ...prev,
          [`${selectedCard.owner}Hand`]: removeFromLocation(prev[`${selectedCard.owner}Hand` as keyof typeof prev] as Card[]),
          [`${selectedCard.owner}Base`]: removeFromLocation(prev[`${selectedCard.owner}Base` as keyof typeof prev] as Card[]),
          [`${selectedCard.owner}DeployZone`]: removeFromLocation(prev[`${selectedCard.owner}DeployZone` as keyof typeof prev] as Card[]),
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
            [runePoolKey]: updatedRunePool,
            ...(!isHeroCard ? { [manaKey]: updatedMana } : {}),
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
      // During deploy phase, both players can deploy freely - don't pass action/initiative
      if (metadata.currentPhase === 'deploy') {
        updatedMetadata.player1Passed = false
        updatedMetadata.player2Passed = false
      } else if (metadata.currentTurn === 1 && selectedCard.cardType === 'hero' && updatedMetadata.turn1DeploymentPhase !== 'complete') {
        // Still in turn 1 deployment phase - action/initiative handled above
        updatedMetadata.player1Passed = false
        updatedMetadata.player2Passed = false
      } else {
        // Any action (deploy, spell, ability, etc.) passes BOTH action AND initiative to opponent
        // This includes: turn 1 after deployment complete, or any turn > 1
        const otherPlayer = prev.metadata.actionPlayer === 'player1' ? 'player2' : 'player1'
        updatedMetadata.actionPlayer = otherPlayer
        updatedMetadata.initiativePlayer = otherPlayer
        updatedMetadata.activePlayer = otherPlayer
        updatedMetadata.player1Passed = false
        updatedMetadata.player2Passed = false
      }

      if (metadata.currentPhase === 'deploy') {
        const canDeployHero = (playerId: 'player1' | 'player2') => {
          const base = prev[`${playerId}Base` as keyof typeof prev] as Card[]
          const deployZone = prev[`${playerId}DeployZone` as keyof typeof prev] as Card[]
          const cooldowns = prev.metadata.deathCooldowns || {}
          const baseHeroesReady = base.some(card => card.cardType === 'hero' && (cooldowns[card.id] || 0) === 0)
          const deployHeroesReady = deployZone.some(card => card.cardType === 'hero')
          return baseHeroesReady || deployHeroesReady
        }

        if (!canDeployHero('player1') && !canDeployHero('player2')) {
          updatedMetadata.currentPhase = 'play'
        }
      }
      
      return {
        ...prev,
        metadata: updatedMetadata,
      }
    })
    
    // Resolve spell effects after casting (play phase only)
    if (selectedCard.cardType === 'spell' && isPlayPhase) {
      const spellCard = selectedCard as SpellCard
      if (spellCard.effect.type === 'create_tokens' || spellCard.effect.type === 'tokenize') {
        const tokens = buildTokenDefinitions(spellCard)
        const templateId = getTemplateId(spellCard.id)
        const temporaryZone = {
          type: 'tokenize' as const,
          title: 'Token Creation',
          description: 'Drag tokens onto the battlefield.',
          owner: spellCard.owner,
          tokens,
        }
        setPendingEffect({
          cardId: templateId,
          owner: spellCard.owner,
          effect: spellCard.effect,
          temporaryZone,
        })
        setTemporaryZone(temporaryZone)
        setSelectedCardId(null)
        return
      }

      let pendingEffect: PendingEffect | null = null
      setGameState(prev => {
        const result = resolveSpellEffect({
          gameState: prev,
          spell: spellCard,
          owner: spellCard.owner,
        })
        pendingEffect = result.pendingEffect
        return result.nextState
      })
      setPendingEffect(pendingEffect)
      setTemporaryZone(pendingEffect?.temporaryZone || null)
    }

    setSelectedCardId(null)
  }, [selectedCard, selectedCardId, gameState, metadata, getAvailableSlots, setGameState, setSelectedCardId, setPendingEffect, setTemporaryZone])

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
    // Award gold to opponent when removing a generic unit (creep)
    const opponent = card.owner === 'player1' ? 'player2' : 'player1'
    
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
            metadata: {
              ...prev.metadata,
              // No card draw for manually removing units (only combat kills give card draw)
            },
          }
        })
        return
      }
    }
    
    // Regular removal - award gold to opponent if removing a generic unit or hero
    setGameState(prev => {
      const isHero = card.cardType === 'hero'
      const hero = isHero ? card as import('../game/types').Hero : null
      
      // When hero is removed, it counts as dying: set health to 0 and add 2-turn cooldown
      const cardToBase = isHero && hero
        ? {
            ...hero,
            location: 'base' as const,
            currentHealth: 0, // Dead - will heal to full in base after cooldown
            slot: undefined,
          }
        : { ...card, location: 'base' as const }
      
      const updatedDeathCooldowns = isHero && hero
        ? {
            ...prev.metadata.deathCooldowns,
            [card.id]: 2, // Set cooldown counter to 2 (decreases by 1 each turn, prevents deployment for 1 full round)
          }
        : prev.metadata.deathCooldowns
      
      // Remove runes from the hero when it's removed via X button (counts as death)
      const runePoolKey = card.owner === 'player1' ? 'player1RunePool' : 'player2RunePool'
      const updatedRunePool = isHero && hero 
        ? removeRunesFromHero(hero, prev.metadata[runePoolKey])
        : prev.metadata[runePoolKey]
      
      return {
        ...prev,
        [location]: {
          ...prev[location],
          [card.owner]: prev[location][card.owner as 'player1' | 'player2'].filter(c => c.id !== card.id),
        },
        [`${card.owner}Base`]: [...prev[`${card.owner}Base` as keyof typeof prev] as Card[], cardToBase],
        metadata: {
          ...prev.metadata,
          [runePoolKey]: updatedRunePool,
          // No card draw for manually removing units/heroes (only combat kills give card draw)
          deathCooldowns: updatedDeathCooldowns,
        },
      }
    })
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
      
      // Update the hero with the new item and immediately apply stat bonuses
      const updatedHeroes = updatedBattlefield[player].map(c => {
        if (c.id === hero.id && c.cardType === 'hero') {
          const currentItems = (c as Hero).equippedItems || []
          const newItems = [...currentItems, itemCard.itemId]
          
          // Calculate bonuses from the newly equipped item
          const attackBonus = item.attackBonus || 0
          const hpBonus = item.hpBonus || 0
          
          // Apply bonuses directly to current stats
          const newAttack = (c as Hero).attack + attackBonus
          const newMaxHealth = (c as Hero).maxHealth + hpBonus
          const newCurrentHealth = Math.max(1, (c as Hero).currentHealth + hpBonus) // Ensure at least 1 HP
          
          return {
            ...c,
            attack: newAttack,
            maxHealth: newMaxHealth,
            currentHealth: newCurrentHealth,
            equippedItems: newItems,
          } as Hero
        }
        return c
      })
      
      // Remove item from hand
      const updatedHand = (prev[`${itemCard.owner}Hand` as keyof typeof prev] as Card[])
        .filter(c => c.id !== itemCard.id)
      
      // Apply tower armor if item has tower_armor special effect
      let updatedMetadata = { ...prev.metadata }
      if (item.specialEffects?.includes('tower_armor') && item.armor) {
        const towerArmorKey = battlefieldId === 'battlefieldA'
          ? (player === 'player1' ? 'towerA_player1_Armor' : 'towerA_player2_Armor')
          : (player === 'player1' ? 'towerB_player1_Armor' : 'towerB_player2_Armor')
        updatedMetadata = {
          ...updatedMetadata,
          [towerArmorKey]: (updatedMetadata[towerArmorKey as keyof typeof updatedMetadata] as number) + item.armor,
        }
      }
      
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



