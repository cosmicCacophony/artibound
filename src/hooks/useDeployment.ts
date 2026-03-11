import { useCallback } from 'react'
import { Card, Location, GenericUnit, GameMetadata, MAX_UNITS_PER_LANE, Hero, ItemCard, BaseCard, SpellCard } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { createCardFromTemplate, tier1Items } from '../game/sampleData'
import { canAffordCard } from '../game/runeSystem'
import { canPlayCardInLane } from '../game/colorSystem'
import { applyRuneScalingToSpell, applyRuneScalingToUnit } from '../game/runePrototypeData'

export function useDeployment() {
  const {
    gameState,
    setGameState,
    selectedCard,
    selectedCardId,
    setSelectedCardId,
    player1SidebarCards,
    player2SidebarCards,
    setPlayer1SidebarCards,
    setPlayer2SidebarCards,
  } = useGameContext()
  const metadata = gameState.metadata

  const handleDeploy = useCallback((location: Location, _unused?: number, cardOverride?: Card) => {
    const activeCard = cardOverride || selectedCard
    const activeCardId = cardOverride?.id || selectedCardId
    if (!activeCardId || !activeCard) return
    
    const isPlayPhase = metadata.currentPhase === 'play'
    const isDeployPhase = metadata.currentPhase === 'deploy'
    
    // Deploy phase: only heroes can be deployed, and bouncing is allowed
    if (isDeployPhase) {
      if (activeCard.cardType !== 'hero') {
        alert('Only heroes can be deployed during the deploy phase!')
        return
      }
      if (location !== 'battlefieldA' && location !== 'battlefieldB') {
        alert('Heroes must be deployed to a battlefield during deploy phase!')
        return
      }
      // Check if hero is on cooldown
      const cooldownCounter = metadata.deathCooldowns[activeCard.id]
      if (cooldownCounter !== undefined && cooldownCounter > 0) {
        alert(`Hero is on cooldown! ${cooldownCounter} turn${cooldownCounter !== 1 ? 's' : ''} remaining.`)
        return
      }
      
      // Deploy phase cap: each player can deploy one new hero per turn (from base/deploy zone)
      if (activeCard.location === 'base' || activeCard.location === 'deployZone') {
        const deployedKey = `${activeCard.owner}HeroesDeployedThisTurn` as keyof GameMetadata
        const deployedThisTurn = (metadata[deployedKey] as number) || 0
        if (deployedThisTurn >= 1) {
          alert(`Only one hero can be deployed by ${activeCard.owner === 'player1' ? 'Player 1' : 'Player 2'} during deploy phase.`)
          return
        }
      }
      
      // Handle deploy phase deployment
      setGameState(prev => {
        const battlefieldKey = location as 'battlefieldA' | 'battlefieldB'
        const playerKey = activeCard.owner as 'player1' | 'player2'
        const battlefield = prev[battlefieldKey][playerKey]
        
        if (battlefield.length >= MAX_UNITS_PER_LANE) {
          return prev
        }
        
        // Remove deploying hero from base or deploy zone
        const newBase = (prev[`${activeCard.owner}Base` as keyof typeof prev] as Card[])
          .filter(c => c.id !== activeCard.id)
        const newDeployZone = (prev[`${activeCard.owner}DeployZone` as keyof typeof prev] as Card[])
          .filter(c => c.id !== activeCard.id)
        
        // Remove the deploying hero from battlefield (if moving between battlefields)
        const updatedBattlefield = battlefield.filter(c => c.id !== activeCard.id)
        
        const deployedHero = {
          ...activeCard,
          location: battlefieldKey,
        }
        
        return {
          ...prev,
          [`${activeCard.owner}Base`]: newBase,
          [`${activeCard.owner}DeployZone`]: newDeployZone,
          [battlefieldKey]: {
            ...prev[battlefieldKey],
            [playerKey]: [...updatedBattlefield, deployedHero],
          },
          // Also remove from other battlefield if hero was there
          ...(activeCard.location === 'battlefieldA' || activeCard.location === 'battlefieldB' ? {
            [activeCard.location]: {
              ...prev[activeCard.location as 'battlefieldA' | 'battlefieldB'],
              [playerKey]: prev[activeCard.location as 'battlefieldA' | 'battlefieldB'][playerKey]
                .filter(c => c.id !== activeCard.id),
            },
          } : {}),
          metadata: {
            ...prev.metadata,
            ...(activeCard.location === 'base' || activeCard.location === 'deployZone' ? {
              [`${activeCard.owner}HeroesDeployedThisTurn`]: ((prev.metadata[`${activeCard.owner}HeroesDeployedThisTurn` as keyof typeof prev.metadata] as number) || 0) + 1,
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
    
    if (metadata.currentTurn === 1 && activeCard.cardType === 'hero') {
      const deploymentPhase = metadata.turn1DeploymentPhase || 'p1_lane1'
      
      if (deploymentPhase === 'p1_lane1') {
        // Player 1 deploys hero to lane 1 (battlefieldA)
        if (activeCard.owner !== 'player1') {
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
        if (activeCard.owner === 'player2' && location !== 'battlefieldA') {
          alert('Player 2 can only counter-deploy to lane 1 (Battlefield A) or pass')
          return
        }
        // If player 2 is deploying, move to next phase
        if (activeCard.owner === 'player2') {
          newDeploymentPhase = 'p2_lane2'
        }
        // If player 1 tries to deploy (shouldn't happen), block it
        if (activeCard.owner === 'player1') {
          alert('Player 2 can counter-deploy to lane 1 or pass')
          return
        }
      } else if (deploymentPhase === 'p2_lane2') {
        // Player 2 deploys hero to lane 2 (battlefieldB)
        if (activeCard.owner !== 'player2') {
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
        if (activeCard.owner === 'player1' && location !== 'battlefieldB') {
          alert('Player 1 can only counter-deploy to lane 2 (Battlefield B) or pass')
          return
        }
        // If player 1 is deploying, deployment is complete
        if (activeCard.owner === 'player1') {
          newDeploymentPhase = 'complete'
        }
        // If player 2 tries to deploy (shouldn't happen), block it
        if (activeCard.owner === 'player2') {
          alert('Player 1 can counter-deploy to lane 2 or pass')
          return
        }
      } else if (deploymentPhase === 'complete') {
        // Turn 1 deployment complete - normal action rules apply
        // Check action
        if (metadata.actionPlayer !== activeCard.owner) {
          alert('It\'s not your turn to act!')
          return
        }
      }
    } else {
      // Normal turn (not turn 1) - check action
      if (metadata.actionPlayer !== activeCard.owner) {
        alert('It\'s not your turn to act!')
        return
      }
    }
    
    // Check if hero is on cooldown (cannot deploy if cooldown counter > 0)
    if (activeCard.cardType === 'hero') {
      const cooldownCounter = metadata.deathCooldowns[activeCard.id]
      if (cooldownCounter !== undefined && cooldownCounter > 0) {
        alert(`Hero is on cooldown! ${cooldownCounter} turn${cooldownCounter !== 1 ? 's' : ''} remaining.`)
        return
      }
    }

    // Prototype hero progression:
    // - Turn 2: each player can deploy only 1 new hero (their 3rd)
    // - Turn 3: each player can deploy only 1 new hero (their 4th)
    // - Turn 4+: no per-turn cap (cooldown still applies)
    if (
      activeCard.cardType === 'hero' &&
      (activeCard.location === 'deployZone' || activeCard.location === 'base') &&
      metadata.currentTurn >= 2 &&
      metadata.currentTurn <= 3
    ) {
      const deployedKey = `${activeCard.owner}HeroesDeployedThisTurn` as keyof GameMetadata
      const deployedThisTurn = (metadata[deployedKey] as number) || 0
      if (deployedThisTurn >= 1) {
        alert(`Only one new hero can be deployed by ${activeCard.owner === 'player1' ? 'Player 1' : 'Player 2'} on turn ${metadata.currentTurn}.`)
        return
      }
    }
    
    const isSpell = activeCard.cardType === 'spell'
    const isHero = activeCard.cardType === 'hero'
    const cardTemplate = activeCard as BaseCard
    const playerMana = activeCard.owner === 'player1' ? metadata.player1Mana : metadata.player2Mana
    
    // Check mana cost for non-heroes
    if (!isHero && (!isSpell || location !== 'base')) {
      if (cardTemplate.manaCost && cardTemplate.manaCost > playerMana) {
        alert(`Not enough mana! Need ${cardTemplate.manaCost}, have ${playerMana}`)
        return
      }
    }

    // Check if deploying to battlefield and slots are full
    if ((location === 'battlefieldA' || location === 'battlefieldB')) {
      const battlefield = location === 'battlefieldA' 
        ? gameState.battlefieldA[activeCard.owner as 'player1' | 'player2']
        : gameState.battlefieldB[activeCard.owner as 'player1' | 'player2']
      
      // Check lane color requirements for non-hero cards
      if (!isHero && cardTemplate.colors && cardTemplate.colors.length > 0) {
        const laneHeroes = battlefield.filter(c => c.cardType === 'hero') as Hero[]
        if (!canPlayCardInLane(cardTemplate, laneHeroes)) {
          const heroColors = laneHeroes.flatMap(h => h.colors || [])
          alert(`Cannot play ${cardTemplate.name} here! Requires ${cardTemplate.colors.join('+')} hero(es), but lane has: ${heroColors.length > 0 ? heroColors.join(', ') : 'no heroes'}`)
          return
        }
      }
      
      if (activeCard.cardType !== 'generic' && battlefield.length >= MAX_UNITS_PER_LANE) {
        alert('Battlefield is full! Maximum ' + MAX_UNITS_PER_LANE + ' units per lane.')
        return
      }

      // Handle generic unit stacking
      if (activeCard.cardType === 'generic' && battlefield.length > 0) {
        // Try to stack with another generic unit
        const stackableGeneric = battlefield.find(c => 
          c.cardType === 'generic' && 
          !('stackedWith' in c && c.stackedWith) &&
          c.id !== activeCard.id
        ) as GenericUnit | undefined

        if (stackableGeneric && activeCard.cardType === 'generic') {
          // Stack the new card with existing generic
          const selectedGeneric = activeCard as GenericUnit
          const newStackPower = (stackableGeneric.attack || 0) + (selectedGeneric.attack || 0)
          const newStackHealth = (stackableGeneric.health || 0) + (selectedGeneric.health || 0)

          setGameState(prev => {
            const newBattlefield = prev[location === 'battlefieldA' ? 'battlefieldA' : 'battlefieldB']
            const playerField = activeCard.owner as 'player1' | 'player2'
            
            return {
              ...prev,
              [location === 'battlefieldA' ? 'battlefieldA' : 'battlefieldB']: {
                ...newBattlefield,
                [playerField]: newBattlefield[playerField].map(c =>
                  c.id === stackableGeneric.id
                    ? { ...c, stackPower: newStackPower, stackHealth: newStackHealth, stackedWith: activeCard.id } as GenericUnit
                    : c
                ).concat([{
                  ...selectedGeneric,
                  location,
                  stackedWith: stackableGeneric.id,
                  stackPower: newStackPower,
                  stackHealth: newStackHealth,
                }] as GenericUnit[]),
              },
              [`${activeCard.owner}Hand`]: (prev[`${activeCard.owner}Hand` as keyof typeof prev] as Card[])
                .filter((c: Card) => c.id !== activeCard.id),
              [`${activeCard.owner}Base`]: (prev[`${activeCard.owner}Base` as keyof typeof prev] as Card[])
                .filter((c: Card) => c.id !== activeCard.id),
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
      const removeFromLocation = (cards: Card[]) => cards.filter(c => c.id !== activeCardId)
      
      // Add to new location
      if (location === 'base') {
        // Hero movement to base: 1 per turn, heals to full
        const isHero = activeCard.cardType === 'hero'
        const movedToBaseKey = `${activeCard.owner}MovedToBase` as keyof GameMetadata
        const hasMovedToBase = prev.metadata[movedToBaseKey] as boolean
        
        if (isHero && hasMovedToBase) {
          alert('You can only move one hero to base per turn!')
          return prev
        }
        
        // Heal hero to full health when moving to base
        const healedCard = isHero && 'maxHealth' in activeCard
          ? { ...activeCard, location, currentHealth: (activeCard as any).maxHealth }
          : { ...activeCard, location }
        
        const manaKey = `${activeCard.owner}Mana` as keyof GameMetadata
        const isHeroCard = activeCard.cardType === 'hero'
        
        let updatedMana = prev.metadata[manaKey] as number
        
        if (!isHeroCard) {
          if (cardTemplate.manaCost) {
            updatedMana = updatedMana - cardTemplate.manaCost
          }
          
          if (cardTemplate.cardType === 'spell' && cardTemplate.effect) {
            const spellCard = cardTemplate as SpellCard
            if (spellCard.refundMana && spellCard.refundMana > 0) {
              updatedMana = updatedMana + spellCard.refundMana
            }
          }
        }
        
        return {
          ...prev,
          [`${activeCard.owner}Hand`]: removeFromLocation(prev[`${activeCard.owner}Hand` as keyof typeof prev] as Card[]),
          [`${activeCard.owner}Base`]: [...prev[`${activeCard.owner}Base` as keyof typeof prev] as Card[], healedCard],
          [`${activeCard.owner}DeployZone`]: removeFromLocation(prev[`${activeCard.owner}DeployZone` as keyof typeof prev] as Card[]),
          battlefieldA: {
            ...prev.battlefieldA,
            [activeCard.owner]: removeFromLocation(prev.battlefieldA[activeCard.owner as 'player1' | 'player2']),
          },
          battlefieldB: {
            ...prev.battlefieldB,
            [activeCard.owner]: removeFromLocation(prev.battlefieldB[activeCard.owner as 'player1' | 'player2']),
          },
          metadata: {
            ...prev.metadata,
            ...(isHeroCard ? { [movedToBaseKey]: true } : {}),
            ...(!isHeroCard ? { [manaKey]: updatedMana } : {}),
          },
        }
      } else if (location === 'battlefieldA' || location === 'battlefieldB') {
        const battlefieldKey = location
        const battlefield = prev[battlefieldKey][activeCard.owner as 'player1' | 'player2']
        
        const isMovingFromBattlefield = activeCard.location === 'battlefieldA' || activeCard.location === 'battlefieldB'
        if (battlefield.length >= MAX_UNITS_PER_LANE && !isMovingFromBattlefield) {
          alert('Battlefield is full! Maximum ' + MAX_UNITS_PER_LANE + ' units per lane.')
          return prev
        }

        const otherBattlefieldKey = location === 'battlefieldA' ? 'battlefieldB' : 'battlefieldA'
        const manaKey = `${activeCard.owner}Mana` as keyof GameMetadata
        
        let updatedMana = prev.metadata[manaKey] as number
        
        const isHeroCard = activeCard.cardType === 'hero'
        
        if (!isHeroCard) {
          if (cardTemplate.manaCost) {
            updatedMana = updatedMana - cardTemplate.manaCost
          }
          
          if (cardTemplate.cardType === 'spell' && cardTemplate.effect) {
            const spellCard = cardTemplate as SpellCard
            if (spellCard.refundMana && spellCard.refundMana > 0) {
              updatedMana = updatedMana + spellCard.refundMana
            }
          }
        }
        
        return {
          ...prev,
          [`${activeCard.owner}Hand`]: removeFromLocation(prev[`${activeCard.owner}Hand` as keyof typeof prev] as Card[]),
          [`${activeCard.owner}Base`]: removeFromLocation(prev[`${activeCard.owner}Base` as keyof typeof prev] as Card[]),
          [`${activeCard.owner}DeployZone`]: removeFromLocation(prev[`${activeCard.owner}DeployZone` as keyof typeof prev] as Card[]),
          [otherBattlefieldKey]: {
            ...prev[otherBattlefieldKey],
            [activeCard.owner]: removeFromLocation(prev[otherBattlefieldKey][activeCard.owner as 'player1' | 'player2']),
          },
          [battlefieldKey]: {
            ...prev[battlefieldKey],
            [activeCard.owner]: [
              ...prev[battlefieldKey][activeCard.owner as 'player1' | 'player2'].filter(c => c.id !== activeCard.id),
              (() => {
                let deployedCard = { ...activeCard, location }
                if (prev.metadata.isRunePrototype && prev.metadata.laneRunes && activeCard.cardType === 'generic') {
                  const laneRunes = prev.metadata.laneRunes[battlefieldKey as 'battlefieldA' | 'battlefieldB'][activeCard.owner as 'player1' | 'player2']
                  const unit = activeCard as GenericUnit
                  if (unit.runeScaling) {
                    const scaled = applyRuneScalingToUnit(unit, laneRunes)
                    deployedCard = { ...deployedCard, attack: scaled.attack, health: scaled.health, maxHealth: scaled.maxHealth, currentHealth: scaled.currentHealth } as any
                  }
                }
                return deployedCard
              })()
            ],
          },
          metadata: {
            ...prev.metadata,
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
      if (metadata.currentTurn === 1 && activeCard.cardType === 'hero') {
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
      if (metadata.currentTurn === 1 && activeCard.cardType === 'hero' && updatedMetadata.turn1DeploymentPhase !== 'complete') {
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
    
    // Prototype spell draw/heal handling (e.g., Tidecall) when cast from hand
    if (activeCard.cardType === 'spell' && activeCard.location === 'hand') {
      const spell = activeCard as SpellCard
      const effect = spell.effect
      const owner = activeCard.owner as 'player1' | 'player2'

      let drawCount = effect.type === 'draw_and_heal' ? (effect.drawCount || 0) : 0
      let healAmount = effect.type === 'draw_and_heal' ? (effect.healAmount || 0) : 0

      if (metadata.isRunePrototype && (location === 'battlefieldA' || location === 'battlefieldB')) {
        const laneRunes = metadata.laneRunes?.[location]?.[owner] || []
        const scaled = applyRuneScalingToSpell(spell, laneRunes)
        drawCount += scaled.drawCards
        healAmount += scaled.healTower
      }

      if (drawCount > 0) {
        const sidebar = owner === 'player1' ? player1SidebarCards : player2SidebarCards
        const templatesToDraw = sidebar.slice(0, drawCount)
        const remaining = sidebar.slice(templatesToDraw.length)
        const drawnCards = templatesToDraw.map(template => createCardFromTemplate(template, owner, 'hand'))

        if (owner === 'player1') {
          setPlayer1SidebarCards(remaining)
        } else {
          setPlayer2SidebarCards(remaining)
        }

        if (drawnCards.length > 0 || healAmount !== 0) {
          setGameState(prev => {
            const handKey = `${owner}Hand` as keyof typeof prev
            const updatedHand = [...(prev[handKey] as Card[]), ...drawnCards]

            if (location === 'battlefieldA') {
              const towerKey = owner === 'player1' ? 'towerA_player1_HP' : 'towerA_player2_HP'
              return {
                ...prev,
                [handKey]: updatedHand,
                metadata: {
                  ...prev.metadata,
                  [towerKey]: Math.min(30, (prev.metadata[towerKey as keyof GameMetadata] as number) + healAmount),
                },
              }
            }

            if (location === 'battlefieldB') {
              const towerKey = owner === 'player1' ? 'towerB_player1_HP' : 'towerB_player2_HP'
              return {
                ...prev,
                [handKey]: updatedHand,
                metadata: {
                  ...prev.metadata,
                  [towerKey]: Math.min(30, (prev.metadata[towerKey as keyof GameMetadata] as number) + healAmount),
                },
              }
            }

            return {
              ...prev,
              [handKey]: updatedHand,
            }
          })
        }
      }
    }

    setSelectedCardId(null)
  }, [selectedCard, selectedCardId, gameState, metadata, setGameState, setSelectedCardId, player1SidebarCards, player2SidebarCards, setPlayer1SidebarCards, setPlayer2SidebarCards])

  const handleCastSpellOnTarget = useCallback((
    targetCard: Card,
    battlefieldId: 'battlefieldA' | 'battlefieldB',
    spellOverride?: SpellCard
  ) => {
    const spell = spellOverride || (selectedCard?.cardType === 'spell' ? (selectedCard as SpellCard) : null)
    if (!spell) return
    if (spell.location !== 'hand') return
    if (metadata.currentPhase !== 'play') {
      alert(`Cannot cast spells during ${metadata.currentPhase} phase!`)
      return
    }
    const owner = spell.owner as 'player1' | 'player2'
    const opponent = owner === 'player1' ? 'player2' : 'player1'
    if (metadata.actionPlayer && metadata.actionPlayer !== owner) {
      alert("It's not your turn to act!")
      return
    }

    const effect = spell.effect
    const isDamageSpell = effect.type === 'damage' || effect.type === 'targeted_damage' || effect.type === 'damage_and_stun'
    const isBuffSpell = effect.type === 'buff'

    if (isBuffSpell && targetCard.owner !== owner) {
      alert('Buff spells must target a friendly unit.')
      return
    }
    if (isDamageSpell && targetCard.owner !== opponent) {
      alert('Damage spells must target an enemy unit.')
      return
    }
    if (!isDamageSpell && !isBuffSpell) {
      alert('This spell type is not target-cast in prototype mode yet.')
      return
    }

    const playerMana = owner === 'player1' ? metadata.player1Mana : metadata.player2Mana
    if (!canAffordCard(spell, playerMana)) {
      alert('Cannot afford this spell.')
      return
    }

    let damage = effect.damage || 0
    let attackBuff = effect.attackBuff || 0
    let healthBuff = effect.healthBuff || 0
    if (metadata.isRunePrototype) {
      const laneRunes = metadata.laneRunes?.[battlefieldId]?.[owner] || []
      const scaled = applyRuneScalingToSpell(spell, laneRunes)
      damage += scaled.damage
      attackBuff = scaled.attackBuff
      healthBuff = scaled.healthBuff
    }

    setGameState(prev => {
      const handKey = `${owner}Hand` as keyof typeof prev
      const manaKey = `${owner}Mana` as keyof GameMetadata

      const battlefield = prev[battlefieldId]
      const ownerField = battlefield[owner]
      const opponentField = battlefield[opponent]

      let updatedMana = prev.metadata[manaKey] as number
      if (spell.manaCost) {
        updatedMana -= spell.manaCost
      }
      if (spell.refundMana && spell.refundMana > 0) {
        updatedMana += spell.refundMana
      }

      // Handle buff spell targeting friendly units
      if (isBuffSpell) {
        const targetInOwnerField = ownerField.find(c => c.id === targetCard.id)
        if (!targetInOwnerField) return prev

        const updatedOwnerField = ownerField.map(card => {
          if (card.id !== targetCard.id) return card
          if (card.cardType === 'hero') {
            const hero = card as Hero
            return {
              ...hero,
              attack: hero.attack + attackBuff,
              health: hero.health + healthBuff,
              maxHealth: hero.maxHealth + healthBuff,
              currentHealth: hero.currentHealth + healthBuff,
            }
          } else if (card.cardType === 'generic') {
            const unit = card as GenericUnit
            return {
              ...unit,
              attack: unit.attack + attackBuff,
              health: unit.health + healthBuff,
              maxHealth: unit.maxHealth + healthBuff,
              currentHealth: unit.currentHealth + healthBuff,
            }
          }
          return card
        })

        const otherPlayer = prev.metadata.actionPlayer === 'player1' ? 'player2' : 'player1'
        return {
          ...prev,
          [handKey]: (prev[handKey] as Card[]).filter(c => c.id !== spell.id),
          [battlefieldId]: {
            ...battlefield,
            [owner]: updatedOwnerField,
            [opponent]: opponentField,
          },
          metadata: {
            ...prev.metadata,
            [manaKey]: updatedMana,
            actionPlayer: otherPlayer,
            initiativePlayer: otherPlayer,
            player1Passed: false,
            player2Passed: false,
          },
        }
      }

      // Handle damage spell targeting enemy units
      const targetInLane = opponentField.find(c => c.id === targetCard.id)
      if (!targetInLane) {
        return prev
      }

      const nextOpponentField: Card[] = []
      const baseAdditions: Card[] = []
      const updatedDeathCooldowns = { ...prev.metadata.deathCooldowns }

      opponentField.forEach(card => {
        if (card.id !== targetCard.id) {
          nextOpponentField.push(card)
          return
        }

        if (card.cardType === 'hero') {
          const hero = card as Hero
          const remainingHP = hero.currentHealth - damage
          if (remainingHP > 0) {
            nextOpponentField.push({ ...hero, currentHealth: remainingHP })
          } else {
            baseAdditions.push({
              ...hero,
              location: 'base' as const,
              currentHealth: 0,
            })
            updatedDeathCooldowns[hero.id] = 2
          }
        } else if (card.cardType === 'generic') {
          const unit = card as GenericUnit
          const remainingHP = unit.currentHealth - damage
          if (remainingHP > 0) {
            nextOpponentField.push({ ...unit, currentHealth: remainingHP })
          }
        } else {
          nextOpponentField.push(card)
        }
      })

      const otherPlayer = prev.metadata.actionPlayer === 'player1' ? 'player2' : 'player1'
      const nextStunnedHeroes = { ...(prev.metadata.stunnedHeroes || {}) }
      if (effect.type === 'damage_and_stun' && targetInLane.cardType === 'hero') {
        nextStunnedHeroes[targetInLane.id] = true
      }

      return {
        ...prev,
        [handKey]: (prev[handKey] as Card[]).filter(c => c.id !== spell.id),
        [`${opponent}Base`]: [...(prev[`${opponent}Base` as keyof typeof prev] as Card[]), ...baseAdditions],
        [battlefieldId]: {
          ...battlefield,
          [owner]: ownerField,
          [opponent]: nextOpponentField,
        },
        metadata: {
          ...prev.metadata,
          [manaKey]: updatedMana,
          deathCooldowns: updatedDeathCooldowns,
          stunnedHeroes: nextStunnedHeroes,
          actionPlayer: otherPlayer,
          initiativePlayer: otherPlayer,
          player1Passed: false,
          player2Passed: false,
        },
      }
    })

    setSelectedCardId(null)
  }, [selectedCard, metadata, setGameState, setSelectedCardId])

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
            currentHealth: 0,
          }
        : { ...card, location: 'base' as const }
      
      const updatedDeathCooldowns = isHero && hero
        ? {
            ...prev.metadata.deathCooldowns,
            [card.id]: 2,
          }
        : prev.metadata.deathCooldowns
      
      return {
        ...prev,
        [location]: {
          ...prev[location],
          [card.owner]: prev[location][card.owner as 'player1' | 'player2'].filter(c => c.id !== card.id),
        },
        [`${card.owner}Base`]: [...prev[`${card.owner}Base` as keyof typeof prev] as Card[], cardToBase],
        metadata: {
          ...prev.metadata,
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
    handleCastSpellOnTarget,
    handleRemoveFromBattlefield,
    handleEquipItem,
  }
}



