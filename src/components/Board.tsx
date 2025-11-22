import { useState, useEffect } from 'react'
import { Card, Location, BATTLEFIELD_SLOT_LIMIT, GenericUnit, Item, GameMetadata, TurnPhase, AttackTarget } from '../game/types'
import { createInitialGameState, createCardLibrary, createCardFromTemplate, tier1Items } from '../game/sampleData'
import { getDefaultTargets, resolveCombat, getDefaultTarget } from '../game/combatSystem'
import { HeroCard } from './HeroCard'

export function Board() {
  // Separate card libraries for each player
  const player1CardLibrary = createCardLibrary('player1')
  const player2CardLibrary = createCardLibrary('player2')
  
  // Initialize sidebars with player-specific cards
  const [player1SidebarCards, setPlayer1SidebarCards] = useState<import('../game/types').BaseCard[]>(() => 
    player1CardLibrary.map(template => ({ ...template }))
  )
  const [player2SidebarCards, setPlayer2SidebarCards] = useState<import('../game/types').BaseCard[]>(() => 
    player2CardLibrary.map(template => ({ ...template }))
  )
  
  const [gameState, setGameState] = useState(createInitialGameState())
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [activePlayer, setActivePlayer] = useState<'player1' | 'player2'>('player1')
  const [showCreateCard, setShowCreateCard] = useState(false)
  const [showItemShop, setShowItemShop] = useState(false)
  const [itemShopItems, setItemShopItems] = useState<Item[]>([])
  const [savedStates, setSavedStates] = useState<Array<{ key: string, timestamp: number, display: string }>>([])
  const [newCardForm, setNewCardForm] = useState({
    name: '',
    description: '',
    cardType: 'generic' as import('../game/types').CardType,
    attack: '',
    health: '',
    ability: '',
  })
  
  // Combat target state - Map of unit ID -> AttackTarget
  const [combatTargetsA, setCombatTargetsA] = useState<Map<string, AttackTarget>>(new Map())
  const [combatTargetsB, setCombatTargetsB] = useState<Map<string, AttackTarget>>(new Map())

  // Sidebar cards - get based on active player
  const cardLibrary = activePlayer === 'player1' ? player1SidebarCards : player2SidebarCards
  const setSidebarCards = activePlayer === 'player1' ? setPlayer1SidebarCards : setPlayer2SidebarCards

  // Get cards for current view
  const player1Hand = gameState.player1Hand
  const player2Hand = gameState.player2Hand
  const player1Base = gameState.player1Base
  const player2Base = gameState.player2Base
  const battlefieldAP1 = gameState.battlefieldA.player1
  const battlefieldAP2 = gameState.battlefieldA.player2
  const battlefieldBP1 = gameState.battlefieldB.player1
  const battlefieldBP2 = gameState.battlefieldB.player2
  const metadata = gameState.metadata

  // Sync active player with metadata
  useEffect(() => {
    setActivePlayer(metadata.activePlayer)
  }, [metadata.activePlayer])

  // Load saved states on mount
  useEffect(() => {
    loadSavedStates()
  }, [])

  // Note: Item shop is now generated in handleEndTurn to ensure proper timing

  const selectedCard = selectedCardId
    ? [...player1Hand, ...player2Hand, ...player1Base, ...player2Base, 
       ...battlefieldAP1, ...battlefieldAP2, ...battlefieldBP1, ...battlefieldBP2]
        .find(c => c.id === selectedCardId)
    : null

  const getAvailableSlots = (battlefield: Card[]) => {
    // Count actual cards (not stacked ones count as 1)
    const uniqueCards = battlefield.filter(card => 
      card.cardType !== 'generic' || !('stackedWith' in card && (card as GenericUnit).stackedWith)
    )
    return BATTLEFIELD_SLOT_LIMIT - uniqueCards.length
  }

  const handleCardClick = (cardId: string) => {
    setSelectedCardId(selectedCardId === cardId ? null : cardId)
  }

  const handleAddToHand = (templateIndex: number, player: 'player1' | 'player2') => {
    const sidebar = player === 'player1' ? player1SidebarCards : player2SidebarCards
    const setSidebar = player === 'player1' ? setPlayer1SidebarCards : setPlayer2SidebarCards
    const template = sidebar[templateIndex]
    if (!template) return
    
    const newCard = createCardFromTemplate(template, player, 'hand')
    
    // Remove the card from the sidebar
    setSidebar(prev => prev.filter((_, index) => index !== templateIndex))
    
    setGameState(prev => ({
      ...prev,
      [`${player}Hand`]: [...prev[`${player}Hand` as keyof typeof prev] as Card[], newCard],
    }))
  }

  const handleDeleteFromSidebar = (templateIndex: number) => {
    setSidebarCards(prev => prev.filter((_, index) => index !== templateIndex))
  }

  const handleMoveCardToLibrary = (card: Card) => {
    // Create a template from the card - strip instance-specific fields
    const template: import('../game/types').BaseCard & Partial<{ attack: number, health: number, supportEffect?: string, effect?: string, baseBuff?: string, heroName?: string }> = {
      id: `custom-${Date.now()}-${Math.random()}`,
      name: card.name,
      description: card.description,
      cardType: card.cardType,
    }

    // Preserve stats and abilities based on card type
    if ('attack' in card && card.attack !== undefined) {
      template.attack = card.attack
    }
    if ('health' in card && card.health !== undefined) {
      template.health = card.health
    }
    if (card.cardType === 'hero' && 'supportEffect' in card && card.supportEffect) {
      template.supportEffect = card.supportEffect
    } else if (card.cardType === 'signature' && 'effect' in card && card.effect) {
      template.effect = card.effect
      if ('heroName' in card) {
        template.heroName = (card as any).heroName
      }
    } else if (card.cardType === 'hybrid' && 'baseBuff' in card && card.baseBuff) {
      template.baseBuff = card.baseBuff
    }
    
    // Add to sidebar at the bottom
    setSidebarCards(prev => [...prev, template as import('../game/types').BaseCard])
    
    // Remove from hand
    setGameState(prev => ({
      ...prev,
      [`${card.owner}Hand`]: (prev[`${card.owner}Hand` as keyof typeof prev] as Card[])
        .filter(c => c.id !== card.id),
    }))
    
    setSelectedCardId(null)
  }

  const handleCreateCard = () => {
    const { name, description, cardType, attack, health, ability } = newCardForm
    
    if (!name.trim()) {
      alert('Card name is required')
      return
    }

    const newCard: import('../game/types').BaseCard & Partial<{ attack: number, health: number, supportEffect?: string, effect?: string, baseBuff?: string }> = {
      id: `custom-${Date.now()}-${Math.random()}`,
      name: name.trim(),
      description: description.trim() || 'Custom card',
      cardType,
    }

    // Add stats - use 0 if not provided, or parse the value
    if (attack.trim() === '' || attack === null || attack === undefined) {
      newCard.attack = 0
    } else {
      newCard.attack = parseInt(attack) || 0
    }
    
    if (health.trim() === '' || health === null || health === undefined) {
      newCard.health = 0
    } else {
      newCard.health = parseInt(health) || 0
    }
    
    // Add ability/effect only if provided
    if (ability.trim()) {
      if (cardType === 'hero') {
        newCard.supportEffect = ability.trim()
      } else if (cardType === 'signature') {
        newCard.effect = ability.trim()
      } else if (cardType === 'hybrid') {
        newCard.baseBuff = ability.trim()
      }
    }

    // Add to sidebar
    setSidebarCards(prev => [...prev, newCard as import('../game/types').BaseCard])
    
    // Reset form
    setNewCardForm({
      name: '',
      description: '',
      cardType: 'generic',
      attack: '',
      health: '',
      ability: '',
    })
    setShowCreateCard(false)
  }

  const handleDeploy = (location: Location, targetSlot?: number) => {
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
  }

  // Change slot position for a card on battlefield
  const handleChangeSlot = (card: Card, newSlot: number, location: 'battlefieldA' | 'battlefieldB') => {
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
  }

  const handleRemoveFromBattlefield = (card: Card, location: 'battlefieldA' | 'battlefieldB') => {
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
  }

  // Item Shop Functions
  const generateItemShop = () => {
    const player = metadata.activePlayer
    const playerTier = player === 'player1' ? metadata.player1Tier : metadata.player2Tier
    const availableItems = tier1Items.filter(item => item.tier === playerTier)
    // Shuffle and pick 3 random items
    const shuffled = [...availableItems].sort(() => Math.random() - 0.5)
    setItemShopItems(shuffled.slice(0, 3))
  }

  const handleBuyItem = (item: Item, targetHeroId?: string) => {
    const player = metadata.activePlayer
    const currentGold = player === 'player1' ? metadata.player1Gold : metadata.player2Gold
    
    if (currentGold < item.cost) {
      alert(`Not enough gold! Need ${item.cost}, have ${currentGold}`)
      return
    }

    // If no target hero specified, find the first hero in hand or on battlefield
    if (!targetHeroId) {
      const heroes = [...gameState[`${player}Hand` as keyof typeof gameState] as Card[],
                      ...gameState.battlefieldA[player as 'player1' | 'player2'],
                      ...gameState.battlefieldB[player as 'player1' | 'player2']]
        .filter(c => c.cardType === 'hero')
      
      if (heroes.length === 0) {
        alert('No heroes available to equip item')
        return
      }
      targetHeroId = heroes[0].id
    }

    setGameState(prev => {
      const updateCard = (c: Card): Card => {
        if (c.id === targetHeroId && c.cardType === 'hero') {
          const hero = c as import('../game/types').Hero
          const equippedItems = hero.equippedItems || []
          const newAttack = hero.attack + (item.attackBonus || 0)
          const newMaxHealth = hero.maxHealth + (item.hpBonus || 0)
          const newCurrentHealth = hero.currentHealth + (item.hpBonus || 0)
          
          return {
            ...hero,
            attack: newAttack,
            maxHealth: newMaxHealth,
            currentHealth: newCurrentHealth,
            equippedItems: [...equippedItems, item.id],
          }
        }
        return c
      }

      return {
        ...prev,
        [`${player}Hand`]: (prev[`${player}Hand` as keyof typeof prev] as Card[]).map(updateCard),
        [`${player}Base`]: (prev[`${player}Base` as keyof typeof prev] as Card[]).map(updateCard),
        battlefieldA: {
          ...prev.battlefieldA,
          [player]: prev.battlefieldA[player as 'player1' | 'player2'].map(updateCard),
        },
        battlefieldB: {
          ...prev.battlefieldB,
          [player]: prev.battlefieldB[player as 'player1' | 'player2'].map(updateCard),
        },
        metadata: {
          ...prev.metadata,
          [`${player}Gold`]: (prev.metadata[`${player}Gold` as keyof GameMetadata] as number) - item.cost,
        },
      }
    })

    setShowItemShop(false)
  }

  const handleUpgradeTier = () => {
    const player = metadata.activePlayer
    setGameState(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [`${player}Tier`]: 2,
      },
    }))
    generateItemShop()
  }

  const handleSkipShop = () => {
    const player = metadata.activePlayer
    setGameState(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [`${player}Gold`]: (prev.metadata[`${player}Gold` as keyof GameMetadata] as number) + 2,
      },
    }))
    setShowItemShop(false)
  }

  // Initialize combat targets when entering combat phase
  useEffect(() => {
    if (metadata.currentPhase === 'combatA') {
      const defaults = getDefaultTargets(gameState.battlefieldA, metadata.activePlayer)
      setCombatTargetsA(new Map(defaults))
    } else if (metadata.currentPhase === 'combatB') {
      const defaults = getDefaultTargets(gameState.battlefieldB, metadata.activePlayer)
      setCombatTargetsB(new Map(defaults))
    }
  }, [metadata.currentPhase, metadata.activePlayer])

  // Turn Management - Phase system
  const handleNextPhase = () => {
    const player = metadata.activePlayer
    const currentPhase = metadata.currentPhase
    
    // Phase progression: play -> combatA -> adjust -> combatB -> play (next player)
    let nextPhase: TurnPhase = 'play'
    let nextPlayer: 'player1' | 'player2' = player
    let shouldIncrementTurn = false
    
    // When starting a new turn (play phase), reset movement flags and clear expired death cooldowns
    if (currentPhase === 'combatB') {
      // Next phase will be play for next player - reset movement flags
      setGameState(prev => {
        // Clear death cooldowns that are 1+ turns old (can redeploy now)
        const newDeathCooldowns: Record<string, number> = {}
        const currentTurn = prev.metadata.currentTurn
        Object.entries(prev.metadata.deathCooldowns).forEach(([cardId, turnDied]) => {
          // Keep cooldowns that are still active (died this turn or last turn)
          if (currentTurn - turnDied < 1) {
            newDeathCooldowns[cardId] = turnDied
          }
        })
        
        // Heal heroes in base that are no longer on death cooldown
        const healHeroInBase = (c: Card): Card => {
          if (c.cardType === 'hero' && c.location === 'base' && !newDeathCooldowns[c.id]) {
            const hero = c as import('../game/types').Hero
            if (hero.currentHealth < hero.maxHealth) {
              return { ...hero, currentHealth: hero.maxHealth }
            }
          }
          return c
        }
        
        return {
          ...prev,
          player1Base: prev.player1Base.map(healHeroInBase),
          player2Base: prev.player2Base.map(healHeroInBase),
          metadata: {
            ...prev.metadata,
            deathCooldowns: newDeathCooldowns,
            player1MovedToBase: false,
            player2MovedToBase: false,
          },
        }
      })
    }
    
    // Resolve combat before leaving combat phase
    if (currentPhase === 'combatA') {
      // Resolve combat for battlefield A
      const targets = combatTargetsA.size > 0 ? combatTargetsA : getDefaultTargets(gameState.battlefieldA, player)
      const result = resolveCombat(
        gameState.battlefieldA,
        'battlefieldA',
        targets,
        player,
        {
          towerA: metadata.towerA_HP,
          towerB: metadata.towerB_HP,
        }
      )
      
      // Apply combat results
      setGameState(prev => {
        const updatedState = {
          ...prev,
          battlefieldA: result.updatedBattlefield,
          metadata: {
            ...prev.metadata,
            towerA_HP: result.updatedTowerHP.towerA,
            // Apply overflow damage to nexus
            player2NexusHP: Math.max(0, prev.metadata.player2NexusHP - result.overflowDamage),
          },
        }
        return updatedState
      })
      
      nextPhase = 'adjust'
    } else if (currentPhase === 'adjust') {
      nextPhase = 'combatB'
    } else if (currentPhase === 'combatB') {
      // Resolve combat for battlefield B
      const targets = combatTargetsB.size > 0 ? combatTargetsB : getDefaultTargets(gameState.battlefieldB, player)
      const result = resolveCombat(
        gameState.battlefieldB,
        'battlefieldB',
        targets,
        player,
        {
          towerA: metadata.towerA_HP,
          towerB: metadata.towerB_HP,
        }
      )
      
      // Apply combat results
      setGameState(prev => {
        const updatedState = {
          ...prev,
          battlefieldB: result.updatedBattlefield,
          metadata: {
            ...prev.metadata,
            towerB_HP: result.updatedTowerHP.towerB,
            // Apply overflow damage to nexus
            player2NexusHP: Math.max(0, prev.metadata.player2NexusHP - result.overflowDamage),
          },
        }
        return updatedState
      })
      // End turn - switch player and reset to play phase
      nextPlayer = player === 'player1' ? 'player2' : 'player1'
      nextPhase = 'play'
      shouldIncrementTurn = nextPlayer === 'player1'
      
      // Regenerate mana for next player (+1 max mana, restore to max)
      const nextPlayerMaxMana = Math.min(
        (nextPlayer === 'player1' ? metadata.player1MaxMana : metadata.player2MaxMana) + 1,
        10 // Cap at 10
      )
      
      // Calculate gold per turn (base + items)
      const baseGoldPerTurn = 3
      let goldPerTurnFromItems = 0
      
      // Check all heroes for gold per turn items
      const allPlayerCards = [
        ...gameState[`${player}Hand` as keyof typeof gameState] as Card[],
        ...gameState.battlefieldA[player as 'player1' | 'player2'],
        ...gameState.battlefieldB[player as 'player1' | 'player2'],
      ]
      
      allPlayerCards.forEach(card => {
        if (card.cardType === 'hero') {
          const hero = card as import('../game/types').Hero
          const equippedItems = hero.equippedItems || []
          equippedItems.forEach(itemId => {
            const item = tier1Items.find(i => i.id === itemId)
            if (item && item.goldPerTurn) {
              goldPerTurnFromItems += item.goldPerTurn
            }
          })
        }
      })

      const totalGoldThisTurn = baseGoldPerTurn + goldPerTurnFromItems

      setGameState(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [`${player}Gold`]: (prev.metadata[`${player}Gold` as keyof GameMetadata] as number) + totalGoldThisTurn,
          currentTurn: prev.metadata.currentTurn + (shouldIncrementTurn ? 1 : 0),
          activePlayer: nextPlayer,
          currentPhase: nextPhase,
          [`${nextPlayer}MaxMana`]: nextPlayerMaxMana,
          [`${nextPlayer}Mana`]: nextPlayerMaxMana, // Restore to max
        },
      }))
      
      // Generate item shop for next player
      setTimeout(() => {
        const newPlayerTier = nextPlayer === 'player1' ? metadata.player1Tier : metadata.player2Tier
        const availableItems = tier1Items.filter(item => item.tier === newPlayerTier)
        const shuffled = [...availableItems].sort(() => Math.random() - 0.5)
        setItemShopItems(shuffled.slice(0, 3))
        setShowItemShop(true)
      }, 0)
      return
    }
    
    // Just advance phase
    setGameState(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        currentPhase: nextPhase,
      },
    }))
  }
  
  // Legacy handleEndTurn for compatibility
  const handleEndTurn = handleNextPhase

  // Toggle spell played state (for spells in base)
  const handleToggleSpellPlayed = (card: Card) => {
    if (card.cardType !== 'spell' || card.location !== 'base') return
    
    setGameState(prev => {
      const isCurrentlyPlayed = prev.metadata.playedSpells[card.id] || false
      const newPlayedSpells = { ...prev.metadata.playedSpells }
      
      if (isCurrentlyPlayed) {
        delete newPlayedSpells[card.id]
      } else {
        newPlayedSpells[card.id] = true
      }
      
      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          playedSpells: newPlayedSpells,
        },
      }
    })
  }

  // Increase health (for correcting mistakes)
  const handleIncreaseHealth = (card: Card) => {
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
  }

  // Combat Simulation
  const handleDecreaseHealth = (card: Card) => {
    if (!('currentHealth' in card)) return

    const newHealth = card.currentHealth - 1

    if (newHealth <= 0) {
      // Card dies - track death cooldown (1 round)
      const player = card.owner
      const location = card.location

      if (card.cardType === 'hero') {
        // Hero dies - goes to base with death cooldown (1 round before can redeploy)
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
              [`${player}Gold`]: (prev.metadata[`${player}Gold` as keyof GameMetadata] as number) + 5,
              deathCooldowns: {
                ...prev.metadata.deathCooldowns,
                [card.id]: prev.metadata.currentTurn, // Track turn they died
              },
            },
          }
        })
      } else {
        // Generic unit dies - remove completely, track death cooldown
        setGameState(prev => {
          return {
            ...prev,
            [location === 'battlefieldA' ? 'battlefieldA' : 'battlefieldB']: {
              ...prev[location === 'battlefieldA' ? 'battlefieldA' : 'battlefieldB'],
              [player]: prev[location === 'battlefieldA' ? 'battlefieldA' : 'battlefieldB'][player as 'player1' | 'player2'].filter(c => c.id !== card.id),
            },
            metadata: {
              ...prev.metadata,
              [`${player}Gold`]: (prev.metadata[`${player}Gold` as keyof GameMetadata] as number) + 2,
              deathCooldowns: {
                ...prev.metadata.deathCooldowns,
                [card.id]: prev.metadata.currentTurn, // Track turn they died
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
  }

  // Export/Import Functions
  const exportGameState = () => {
    const timestamp = Date.now()
    const exportData = {
      ...gameState,
      exportedAt: timestamp,
    }
    const key = `artibound_state_${timestamp}`
    localStorage.setItem(key, JSON.stringify(exportData))
    loadSavedStates()
    alert(`Game state exported! Timestamp: ${new Date(timestamp).toLocaleString()}`)
  }

  const importGameState = (key: string) => {
    const saved = localStorage.getItem(key)
    if (!saved) {
      alert('Saved state not found!')
      return
    }
    
    try {
      const imported = JSON.parse(saved)
      delete imported.exportedAt
      setGameState(imported as typeof gameState)
      setActivePlayer(imported.metadata.activePlayer)
      alert('Game state imported successfully!')
    } catch (e) {
      alert('Error importing game state!')
      console.error(e)
    }
  }

  const loadSavedStates = () => {
    const states: Array<{ key: string, timestamp: number, display: string }> = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('artibound_state_')) {
        const timestamp = parseInt(key.replace('artibound_state_', ''))
        states.push({
          key,
          timestamp,
          display: new Date(timestamp).toLocaleString(),
        })
      }
    }
    states.sort((a, b) => b.timestamp - a.timestamp)
    setSavedStates(states)
  }

  // Helper to get color styles for cards
  const getCardColorStyles = (colors?: import('../game/types').Color[]) => {
    const COLOR_MAP: Record<import('../game/types').Color, string> = {
      red: '#d32f2f',
      blue: '#1976d2',
      white: '#f5f5f5',
      black: '#424242',
      green: '#388e3c',
    }
    const COLOR_LIGHT_MAP: Record<import('../game/types').Color, string> = {
      red: '#ffebee',
      blue: '#e3f2fd',
      white: '#ffffff',
      black: '#fafafa',
      green: '#e8f5e9',
    }
    
    if (!colors || colors.length === 0) {
      return {
        borderColor: '#757575',
        backgroundColor: '#fafafa',
      }
    } else if (colors.length === 1) {
      return {
        borderColor: COLOR_MAP[colors[0]],
        backgroundColor: COLOR_LIGHT_MAP[colors[0]],
        borderWidth: '2px',
      }
    } else {
      // Multicolor
      return {
        borderColor: COLOR_MAP[colors[0]],
        background: colors.length === 2
          ? `linear-gradient(to right, ${COLOR_LIGHT_MAP[colors[0]]} 50%, ${COLOR_LIGHT_MAP[colors[1]]} 50%)`
          : undefined,
        backgroundColor: colors.length > 2 ? COLOR_LIGHT_MAP[colors[0]] : undefined,
        borderWidth: '2px',
      }
    }
  }

  // Helper function to render sidebar for a player
  const renderSidebar = (player: 'player1' | 'player2', cards: import('../game/types').BaseCard[], setCards: React.Dispatch<React.SetStateAction<import('../game/types').BaseCard[]>>) => {
    const playerColor = player === 'player1' ? '#f44336' : '#2196f3'
    const playerBgColor = player === 'player1' ? '#ffebee' : '#e3f2fd'
    const playerName = player === 'player1' ? 'Warrior' : 'Mage'
    
    return (
      <div
        style={{
          width: '200px',
          border: `2px solid ${playerColor}`,
          padding: '15px',
          overflowY: 'auto',
          backgroundColor: playerBgColor,
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: '16px', color: playerColor }}>
          {playerName} Library ({cards.length})
        </h2>
        <div style={{ marginBottom: '15px', fontSize: '11px', color: '#666' }}>
          Click a card to add to hand
        </div>
        
        {cards.map((template, index) => {
          const colorStyles = getCardColorStyles(template.colors)
          return (
          <div
            key={template.id || index}
            style={{
              border: `${colorStyles.borderWidth || '1px'} solid ${colorStyles.borderColor}`,
              borderRadius: '4px',
              padding: '6px',
              marginBottom: '6px',
              backgroundColor: colorStyles.backgroundColor,
              background: colorStyles.background,
              fontSize: '11px',
              position: 'relative',
            }}
          >
            <div
              onClick={() => handleAddToHand(index, player)}
              style={{
                cursor: 'pointer',
                paddingRight: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '10px', color: playerColor }}>
                  {template.cardType.toUpperCase()}
                </div>
                {/* Color indicators */}
                {template.colors && template.colors.length > 0 && (
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {template.colors.map((colorVal, idx) => {
                      const COLOR_MAP: Record<import('../game/types').Color, string> = {
                        red: '#d32f2f',
                        blue: '#1976d2',
                        white: '#f5f5f5',
                        black: '#424242',
                        green: '#388e3c',
                      }
                      return (
                        <div
                          key={idx}
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: COLOR_MAP[colorVal],
                            border: '1px solid rgba(0,0,0,0.2)',
                          }}
                          title={colorVal}
                        />
                      )
                    })}
                  </div>
                )}
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{template.name}</div>
              <div style={{ fontSize: '10px', color: '#666' }}>{template.description}</div>
              {template.manaCost !== undefined && (
                <div style={{ fontSize: '10px', color: '#1976d2', marginTop: '2px' }}>
                  💎 {template.manaCost}
                </div>
              )}
              {'attack' in template && 'health' in template && (
                <div style={{ fontSize: '10px', marginTop: '2px' }}>
                  ⚔️ {(template as { attack: number; health: number }).attack} ❤️ {(template as { attack: number; health: number }).health}
                </div>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (confirm(`Delete ${template.name} from library?`)) {
                  if (player === 'player1') {
                    setPlayer1SidebarCards(prev => prev.filter((_, i) => i !== index))
                  } else {
                    setPlayer2SidebarCards(prev => prev.filter((_, i) => i !== index))
                  }
                }
              }}
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                cursor: 'pointer',
                fontSize: '10px',
                lineHeight: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Delete card"
            >
              ×
            </button>
          </div>
          )
        })}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', height: '100vh' }}>
      {/* Left Sidebar - Player 1 (Warrior - Red) */}
      {renderSidebar('player1', player1SidebarCards, setPlayer1SidebarCards)}

      {/* Main Board */}
      <div style={{ flex: 1, padding: '15px', overflowY: 'auto', position: 'relative', minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0 }}>Artibound - Hero Card Game</h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
              Turn {metadata.currentTurn} - {metadata.activePlayer === 'player1' ? 'Player 1 (Warrior)' : 'Player 2 (Mage)'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'capitalize' }}>
              Phase: {metadata.currentPhase}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
              {metadata.activePlayer === 'player1' ? (
                <>Mana: {metadata.player1Mana}/{metadata.player1MaxMana}</>
              ) : (
                <>Mana: {metadata.player2Mana}/{metadata.player2MaxMana}</>
              )}
            </div>
            <button
              onClick={handleEndTurn}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Next Phase
            </button>
            <button
              onClick={exportGameState}
              style={{
                padding: '8px 16px',
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Export State
            </button>
            {savedStates.length > 0 && (
              <select
                onChange={(e) => {
                  if (e.target.value) importGameState(e.target.value)
                }}
                style={{
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              >
                <option value="">Import State...</option>
                {savedStates.map(state => (
                  <option key={state.key} value={state.key}>{state.display}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Item Shop Modal */}
        {showItemShop && (
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#fff',
              border: '2px solid #4a90e2',
              borderRadius: '8px',
              padding: '20px',
              zIndex: 1000,
              minWidth: '400px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <h2 style={{ marginTop: 0 }}>Item Shop - {metadata.activePlayer === 'player1' ? 'Player 1' : 'Player 2'}</h2>
            <div style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>
              Gold: {metadata.activePlayer === 'player1' ? metadata.player1Gold : metadata.player2Gold}
            </div>
            <div style={{ marginBottom: '15px' }}>
              {itemShopItems.map(item => (
                <div
                  key={item.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '12px',
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{item.description}</div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                      Cost: {item.cost} gold
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuyItem(item)}
                    disabled={(metadata.activePlayer === 'player1' ? metadata.player1Gold : metadata.player2Gold) < item.cost}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: (metadata.activePlayer === 'player1' ? metadata.player1Gold : metadata.player2Gold) >= item.cost ? '#4caf50' : '#ccc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: (metadata.activePlayer === 'player1' ? metadata.player1Gold : metadata.player2Gold) >= item.cost ? 'pointer' : 'not-allowed',
                    }}
                  >
                    Buy ({item.cost})
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {(metadata.activePlayer === 'player1' ? metadata.player1Tier : metadata.player2Tier) === 1 && (
                <button
                  onClick={handleUpgradeTier}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ff9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    flex: 1,
                  }}
                >
                  Upgrade to Tier 2
                </button>
              )}
              <button
                onClick={handleSkipShop}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#9e9e9e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  flex: 1,
                }}
              >
                Skip (+2 Gold)
              </button>
            </div>
          </div>
        )}

        {/* Player 2 Area (Top) - Mage (Blue) */}
        <div
          style={{
            border: '3px solid #2196f3',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            backgroundColor: '#e3f2fd',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ marginTop: 0, color: '#1976d2' }}>Player 2 - Mage</h2>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1976d2' }}>
                Mana: {metadata.player2Mana}/{metadata.player2MaxMana}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                Gold: {metadata.player2Gold}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#d32f2f' }}>
                Nexus: {metadata.player2NexusHP} HP
              </div>
            </div>
          </div>
          
          {/* Player 2 Base */}
          <div style={{ marginBottom: '20px' }}>
            <h3>Base ({player2Base.length})</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '60px' }}>
              {player2Base.length > 0 ? (
                player2Base.map(card => (
                  <HeroCard
                    key={card.id}
                    card={card}
                    onClick={() => handleCardClick(card.id)}
                    isSelected={selectedCardId === card.id}
                    showStats={false}
                    isDead={!!metadata.deathCooldowns[card.id]}
                    isPlayed={card.cardType === 'spell' && !!metadata.playedSpells[card.id]}
                    onTogglePlayed={card.cardType === 'spell' ? () => handleToggleSpellPlayed(card) : undefined}
                  />
                ))
              ) : (
                <p style={{ color: '#999' }}>Empty</p>
              )}
            </div>
          </div>

          {/* Player 2 Hand */}
          <div>
            <h3>Hand ({player2Hand.length})</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {player2Hand.length > 0 ? (
                player2Hand.map(card => (
                  <HeroCard
                    key={card.id}
                    card={card}
                    onClick={() => handleCardClick(card.id)}
                    isSelected={selectedCardId === card.id}
                    showStats={true}
                    isDead={!!metadata.deathCooldowns[card.id]}
                    isPlayed={card.cardType === 'spell' && card.location === 'base' && !!metadata.playedSpells[card.id]}
                    onTogglePlayed={card.cardType === 'spell' && card.location === 'base' ? () => handleToggleSpellPlayed(card) : undefined}
                  />
                ))
              ) : (
                <p style={{ color: '#999' }}>Empty</p>
              )}
            </div>
          </div>
        </div>

        {/* Battlefields (Middle) - Compact */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '15px',
          }}
        >
          {/* Battlefield A */}
          <div
            style={{
              border: '2px solid #4a90e2',
              borderRadius: '6px',
              padding: '12px',
              backgroundColor: '#e3f2fd',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>
                Battlefield A
                <span style={{ fontSize: '12px', fontWeight: 'normal', marginLeft: '8px', color: '#666' }}>
                  ({getAvailableSlots([...battlefieldAP1, ...battlefieldAP2])} slots)
                </span>
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#d32f2f' }}>
                  Tower: {metadata.towerA_HP} HP
                </div>
                <button
                  onClick={() => {
                    setGameState(prev => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        towerA_HP: Math.max(0, prev.metadata.towerA_HP - 1),
                      },
                    }))
                  }}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                  title="Deal 1 damage to Tower A"
                >
                  -1
                </button>
                <button
                  onClick={() => {
                    setGameState(prev => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        towerA_HP: Math.min(20, prev.metadata.towerA_HP + 1),
                      },
                    }))
                  }}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                  title="Heal 1 HP to Tower A"
                >
                  +1
                </button>
              </div>
            </div>
            
            {/* Player 2 side */}
            <div style={{ marginBottom: '12px' }}>
              <h4 style={{ fontSize: '12px', marginBottom: '6px' }}>Player 2</h4>
              {/* Slot positions 1-5 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '4px' }}>
                {[1, 2, 3, 4, 5].map(slotNum => {
                  const cardInSlot = battlefieldAP2.find(c => c.slot === slotNum)
                  const isSelected = selectedCard && selectedCard.id === cardInSlot?.id
                  const canMoveHere = selectedCard && selectedCard.owner === 'player2' && 
                    (selectedCard.location === 'battlefieldA' || selectedCard.location === 'battlefieldB' || selectedCard.location === 'hand' || selectedCard.location === 'base')
                  
                  return (
                    <div
                      key={slotNum}
                      style={{
                        minHeight: '100px',
                        border: canMoveHere ? '2px dashed #4a90e2' : '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '4px',
                        backgroundColor: canMoveHere ? '#e3f2fd' : '#f9f9f9',
                        position: 'relative',
                      }}
                      onClick={() => {
                        if (selectedCard && canMoveHere && selectedCard.owner === 'player2') {
                          if (selectedCard.location === 'battlefieldA') {
                            handleChangeSlot(selectedCard, slotNum, 'battlefieldA')
                          } else if (selectedCard.location === 'battlefieldB') {
                            // Move from B to A
                            handleDeploy('battlefieldA', slotNum)
                          } else {
                            // Deploy to A with specific slot
                            handleDeploy('battlefieldA', slotNum)
                          }
                        }
                      }}
                    >
                      <div style={{ fontSize: '10px', color: '#666', marginBottom: '2px' }}>Slot {slotNum}</div>
                      {cardInSlot ? (
                        <div style={{ transform: 'scale(0.85)', transformOrigin: 'top left' }}>
                          <HeroCard
                            card={cardInSlot}
                            onClick={() => handleCardClick(cardInSlot.id)}
                            isSelected={isSelected}
                            showStats={true}
                            onRemove={() => handleRemoveFromBattlefield(cardInSlot, 'battlefieldA')}
                            onDecreaseHealth={() => handleDecreaseHealth(cardInSlot)}
                            onIncreaseHealth={() => handleIncreaseHealth(cardInSlot)}
                            showCombatControls={true}
                            isDead={!!metadata.deathCooldowns[cardInSlot.id]}
                          />
                        </div>
                      ) : (
                        <div style={{ fontSize: '10px', color: '#ccc', textAlign: 'center', paddingTop: '20px' }}>
                          {canMoveHere ? 'Drop here' : 'Empty'}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Player 1 side */}
            <div>
              <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Player 1</h4>
              {/* Slot positions 1-5 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map(slotNum => {
                  const cardInSlot = battlefieldAP1.find(c => c.slot === slotNum)
                  const isSelected = selectedCard && selectedCard.id === cardInSlot?.id
                  const canMoveHere = selectedCard && selectedCard.owner === 'player1' && 
                    (selectedCard.location === 'battlefieldA' || selectedCard.location === 'battlefieldB' || selectedCard.location === 'hand' || selectedCard.location === 'base')
                  
                  return (
                    <div
                      key={slotNum}
                      style={{
                        minHeight: '100px',
                        border: canMoveHere ? '2px dashed #f44336' : '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '4px',
                        backgroundColor: canMoveHere ? '#ffebee' : '#f9f9f9',
                        position: 'relative',
                      }}
                      onClick={() => {
                        if (selectedCard && canMoveHere && selectedCard.owner === 'player1') {
                          if (selectedCard.location === 'battlefieldA') {
                            handleChangeSlot(selectedCard, slotNum, 'battlefieldA')
                          } else if (selectedCard.location === 'battlefieldB') {
                            // Move from B to A
                            handleDeploy('battlefieldA', slotNum)
                          } else {
                            // Deploy to A with specific slot
                            handleDeploy('battlefieldA', slotNum)
                          }
                        }
                      }}
                    >
                      <div style={{ fontSize: '10px', color: '#666', marginBottom: '2px' }}>Slot {slotNum}</div>
                      {cardInSlot ? (
                        <div style={{ transform: 'scale(0.85)', transformOrigin: 'top left' }}>
                          <HeroCard
                            card={cardInSlot}
                            onClick={() => handleCardClick(cardInSlot.id)}
                            isSelected={isSelected}
                            showStats={true}
                            onRemove={() => handleRemoveFromBattlefield(cardInSlot, 'battlefieldA')}
                            onDecreaseHealth={() => handleDecreaseHealth(cardInSlot)}
                            onIncreaseHealth={() => handleIncreaseHealth(cardInSlot)}
                            showCombatControls={true}
                            isDead={!!metadata.deathCooldowns[cardInSlot.id]}
                          />
                        </div>
                      ) : (
                        <div style={{ fontSize: '10px', color: '#ccc', textAlign: 'center', paddingTop: '20px' }}>
                          {canMoveHere ? 'Drop here' : 'Empty'}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {selectedCard && (
              <button
                onClick={() => handleDeploy('battlefieldA')}
                disabled={selectedCard && selectedCard.cardType !== 'generic' && getAvailableSlots(
                  selectedCard.owner === 'player1' ? battlefieldAP1 : battlefieldAP2
                ) <= 0}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#4a90e2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  opacity: selectedCard && selectedCard.cardType !== 'generic' && getAvailableSlots(
                    selectedCard.owner === 'player1' ? battlefieldAP1 : battlefieldAP2
                  ) <= 0 ? 0.5 : 1,
                }}
              >
                Deploy {selectedCard.name} to Lane A
              </button>
            )}
          </div>

          {/* Battlefield B */}
          <div
            style={{
              border: '2px solid #ff9800',
              borderRadius: '6px',
              padding: '12px',
              backgroundColor: '#fff3e0',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>
                Battlefield B
                <span style={{ fontSize: '12px', fontWeight: 'normal', marginLeft: '8px', color: '#666' }}>
                  ({getAvailableSlots([...battlefieldBP1, ...battlefieldBP2])} slots)
                </span>
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#d32f2f' }}>
                  Tower: {metadata.towerB_HP} HP
                </div>
                <button
                  onClick={() => {
                    setGameState(prev => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        towerB_HP: Math.max(0, prev.metadata.towerB_HP - 1),
                      },
                    }))
                  }}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                  title="Deal 1 damage to Tower B"
                >
                  -1
                </button>
                <button
                  onClick={() => {
                    setGameState(prev => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        towerB_HP: Math.min(20, prev.metadata.towerB_HP + 1),
                      },
                    }))
                  }}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                  title="Heal 1 HP to Tower B"
                >
                  +1
                </button>
              </div>
            </div>
            
            {/* Player 2 side */}
            <div style={{ marginBottom: '12px' }}>
              <h4 style={{ fontSize: '12px', marginBottom: '6px' }}>Player 2</h4>
              {/* Slot positions 1-5 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '4px' }}>
                {[1, 2, 3, 4, 5].map(slotNum => {
                  const cardInSlot = battlefieldBP2.find(c => c.slot === slotNum)
                  const isSelected = selectedCard && selectedCard.id === cardInSlot?.id
                  const canMoveHere = selectedCard && selectedCard.owner === 'player2' && 
                    (selectedCard.location === 'battlefieldA' || selectedCard.location === 'battlefieldB' || selectedCard.location === 'hand' || selectedCard.location === 'base')
                  
                  return (
                    <div
                      key={slotNum}
                      style={{
                        minHeight: '100px',
                        border: canMoveHere ? '2px dashed #4a90e2' : '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '4px',
                        backgroundColor: canMoveHere ? '#e3f2fd' : '#f9f9f9',
                        position: 'relative',
                      }}
                      onClick={() => {
                        if (selectedCard && canMoveHere && selectedCard.owner === 'player2') {
                          if (selectedCard.location === 'battlefieldB') {
                            handleChangeSlot(selectedCard, slotNum, 'battlefieldB')
                          } else if (selectedCard.location === 'battlefieldA') {
                            // Move from A to B
                            handleDeploy('battlefieldB', slotNum)
                          } else {
                            // Deploy to B with specific slot
                            handleDeploy('battlefieldB', slotNum)
                          }
                        }
                      }}
                    >
                      <div style={{ fontSize: '10px', color: '#666', marginBottom: '2px' }}>Slot {slotNum}</div>
                      {cardInSlot ? (
                        <div style={{ transform: 'scale(0.85)', transformOrigin: 'top left' }}>
                          <HeroCard
                            card={cardInSlot}
                            onClick={() => handleCardClick(cardInSlot.id)}
                            isSelected={isSelected}
                            showStats={true}
                            onRemove={() => handleRemoveFromBattlefield(cardInSlot, 'battlefieldB')}
                            onDecreaseHealth={() => handleDecreaseHealth(cardInSlot)}
                            onIncreaseHealth={() => handleIncreaseHealth(cardInSlot)}
                            showCombatControls={true}
                            isDead={!!metadata.deathCooldowns[cardInSlot.id]}
                          />
                        </div>
                      ) : (
                        <div style={{ fontSize: '10px', color: '#ccc', textAlign: 'center', paddingTop: '20px' }}>
                          {canMoveHere ? 'Drop here' : 'Empty'}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Player 1 side */}
            <div>
              <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Player 1</h4>
              {/* Slot positions 1-5 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map(slotNum => {
                  const cardInSlot = battlefieldBP1.find(c => c.slot === slotNum)
                  const isSelected = selectedCard && selectedCard.id === cardInSlot?.id
                  const canMoveHere = selectedCard && selectedCard.owner === 'player1' && 
                    (selectedCard.location === 'battlefieldA' || selectedCard.location === 'battlefieldB' || selectedCard.location === 'hand' || selectedCard.location === 'base')
                  
                  return (
                    <div
                      key={slotNum}
                      style={{
                        minHeight: '100px',
                        border: canMoveHere ? '2px dashed #f44336' : '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '4px',
                        backgroundColor: canMoveHere ? '#ffebee' : '#f9f9f9',
                        position: 'relative',
                      }}
                      onClick={() => {
                        if (selectedCard && canMoveHere && selectedCard.owner === 'player1') {
                          if (selectedCard.location === 'battlefieldB') {
                            handleChangeSlot(selectedCard, slotNum, 'battlefieldB')
                          } else if (selectedCard.location === 'battlefieldA') {
                            // Move from A to B
                            handleDeploy('battlefieldB', slotNum)
                          } else {
                            // Deploy to B with specific slot
                            handleDeploy('battlefieldB', slotNum)
                          }
                        }
                      }}
                    >
                      <div style={{ fontSize: '10px', color: '#666', marginBottom: '2px' }}>Slot {slotNum}</div>
                      {cardInSlot ? (
                        <div style={{ transform: 'scale(0.85)', transformOrigin: 'top left' }}>
                          <HeroCard
                            card={cardInSlot}
                            onClick={() => handleCardClick(cardInSlot.id)}
                            isSelected={isSelected}
                            showStats={true}
                            onRemove={() => handleRemoveFromBattlefield(cardInSlot, 'battlefieldB')}
                            onDecreaseHealth={() => handleDecreaseHealth(cardInSlot)}
                            onIncreaseHealth={() => handleIncreaseHealth(cardInSlot)}
                            showCombatControls={true}
                            isDead={!!metadata.deathCooldowns[cardInSlot.id]}
                          />
                        </div>
                      ) : (
                        <div style={{ fontSize: '10px', color: '#ccc', textAlign: 'center', paddingTop: '20px' }}>
                          {canMoveHere ? 'Drop here' : 'Empty'}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {selectedCard && (
              <button
                onClick={() => handleDeploy('battlefieldB')}
                disabled={selectedCard && selectedCard.cardType !== 'generic' && getAvailableSlots(
                  selectedCard.owner === 'player1' ? battlefieldBP1 : battlefieldBP2
                ) <= 0}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#ff9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  opacity: selectedCard && selectedCard.cardType !== 'generic' && getAvailableSlots(
                    selectedCard.owner === 'player1' ? battlefieldBP1 : battlefieldBP2
                  ) <= 0 ? 0.5 : 1,
                }}
              >
                Deploy {selectedCard.name} to Lane B
              </button>
            )}
          </div>
        </div>

        {/* Player 1 Area (Bottom) - Warrior (Red) */}
        <div
          style={{
            border: '3px solid #f44336',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#ffebee',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ marginTop: 0, color: '#c62828' }}>Player 1 - Warrior</h2>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#c62828' }}>
                Mana: {metadata.player1Mana}/{metadata.player1MaxMana}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                Gold: {metadata.player1Gold}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#d32f2f' }}>
                Nexus: {metadata.player1NexusHP} HP
              </div>
            </div>
          </div>

          {/* Player 1 Base */}
          <div style={{ marginBottom: '20px' }}>
            <h3>Base ({player1Base.length})</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '60px' }}>
              {player1Base.length > 0 ? (
                player1Base.map(card => (
                  <HeroCard
                    key={card.id}
                    card={card}
                    onClick={() => handleCardClick(card.id)}
                    isSelected={selectedCardId === card.id}
                    showStats={false}
                    isDead={!!metadata.deathCooldowns[card.id]}
                    isPlayed={card.cardType === 'spell' && !!metadata.playedSpells[card.id]}
                    onTogglePlayed={card.cardType === 'spell' ? () => handleToggleSpellPlayed(card) : undefined}
                  />
                ))
              ) : (
                <p style={{ color: '#999' }}>Empty</p>
              )}
            </div>
            {selectedCard && (
              <button
                onClick={() => handleDeploy('base')}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#4a90e2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Move {selectedCard.name} to Base
              </button>
            )}
          </div>

          {/* Player 1 Hand */}
          <div>
            <h3>Hand ({player1Hand.length})</h3>
            {selectedCard && (
              <div
                style={{
                  padding: '10px',
                  backgroundColor: '#fff9c4',
                  borderRadius: '4px',
                  marginBottom: '15px',
                }}
              >
                <strong>Selected: {selectedCard.name}</strong> - Choose a deployment location above
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {player1Hand.length > 0 ? (
                player1Hand.map(card => (
                  <HeroCard
                    key={card.id}
                    card={card}
                    onClick={() => handleCardClick(card.id)}
                    isSelected={selectedCardId === card.id}
                    showStats={true}
                    isDead={!!metadata.deathCooldowns[card.id]}
                    isPlayed={card.cardType === 'spell' && card.location === 'base' && !!metadata.playedSpells[card.id]}
                    onTogglePlayed={card.cardType === 'spell' && card.location === 'base' ? () => handleToggleSpellPlayed(card) : undefined}
                  />
                ))
              ) : (
                <p style={{ color: '#999' }}>Empty</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Player 2 (Mage - Blue) */}
      {renderSidebar('player2', player2SidebarCards, setPlayer2SidebarCards)}
    </div>
  )
}
