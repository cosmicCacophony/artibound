import { useState, useCallback } from 'react'
import {
  DraftState,
  DraftPack,
  DraftPick,
  DraftPoolItem,
  DraftPickType,
  PlayerId,
  Hero,
  BaseCard,
  BattlefieldDefinition,
  FinalDraftSelection,
  DraftedItems,
  HEROES_REQUIRED,
  CARDS_REQUIRED,
  BATTLEFIELDS_REQUIRED,
  Color,
  Archetype,
} from '../game/types'
import { generateAllDraftPacks, removeItemFromPack, isPackComplete, generateRandomPack, heroMatchesArchetype, cardMatchesArchetype, isHeroPickRound } from '../game/draftSystem'
import { defaultHeroes, defaultBattlefield, draftableHeroes } from '../game/draftData'
import { allCards, allSpells, allArtifacts, allBattlefields, allHeroes } from '../game/cardData'

// Check if a player has enough items to complete their deck
function hasEnoughItems(drafted: DraftedItems): boolean {
  return (
    drafted.heroes.length >= HEROES_REQUIRED &&
    drafted.cards.length >= CARDS_REQUIRED &&
    drafted.battlefields.length >= BATTLEFIELDS_REQUIRED
  )
}

// Import isHeroPickRound from draftSystem
import { generateAllDraftPacks, removeItemFromPack, isPackComplete, generateRandomPack, heroMatchesArchetype, cardMatchesArchetype, isHeroPickRound } from '../game/draftSystem'

// Get the pick pattern for a round
// Normal packs: 4 picks total, each player gets exactly 2 picks
// Hero packs: 2 picks total, each player gets exactly 1 pick
function getRoundPattern(roundNumber: number): {
  startingPlayer: PlayerId
  picks: { player: PlayerId; count: number }[]
  totalPicks: number
} {
  if (isHeroPickRound(roundNumber)) {
    // Hero pick round: P1 picks 1, then P2 picks 1
    return {
      startingPlayer: 'player1',
      picks: [
        { player: 'player1', count: 1 },
        { player: 'player2', count: 1 },
      ],
      totalPicks: 2,
    }
  } else {
    // Normal pick round: P1 picks 2, then P2 picks 2
    return {
      startingPlayer: 'player1',
      picks: [
        { player: 'player1', count: 2 },
        { player: 'player2', count: 2 },
      ],
      totalPicks: 4,
    }
  }
}

const initialDraftState = (): DraftState => {
  const initialPack = generateRandomPack(1)
  const round1Pattern = getRoundPattern(1)
  return {
    currentRound: 1,
    currentPack: initialPack,
    currentPicker: round1Pattern.startingPlayer,
    pickNumber: 0,
    picksRemainingThisTurn: round1Pattern.picks[0].count,
    roundPicksRemaining: round1Pattern.totalPicks,
    roundPattern: 0,
    player1Drafted: {
      heroes: [],
      cards: [],
      battlefields: [],
    },
    player2Drafted: {
      heroes: [],
      cards: [],
      battlefields: [],
    },
    player1Final: null,
    player2Final: null,
    isDraftComplete: false,
    isSelectionComplete: false,
  }
}

export function useDraft() {
  const [draftState, setDraftState] = useState<DraftState>(initialDraftState)

  // Get current pack
  const getCurrentPack = useCallback((): DraftPack | null => {
    return draftState.currentPack
  }, [draftState])

  // Make a pick
  const makePick = useCallback(
    (item: DraftPoolItem) => {
      const currentPack = getCurrentPack()
      if (!currentPack) return

      const pick: DraftPick = {
        pickNumber: draftState.pickNumber + 1,
        packNumber: draftState.currentRound,
        player: draftState.currentPicker,
        pickType: item.type,
        pick: item.item as Hero | BaseCard | BattlefieldDefinition,
        timestamp: Date.now(),
      }

      // Add to player's drafted items
      const playerKey = `${draftState.currentPicker}Drafted` as keyof DraftState
      const currentDrafted = draftState[playerKey] as DraftedItems
      const updatedDrafted: DraftedItems = {
        heroes: [...currentDrafted.heroes],
        cards: [...currentDrafted.cards],
        battlefields: [...currentDrafted.battlefields],
      }
      
      if (item.type === 'hero') {
        // Create a unique instance of the hero with a unique ID
        const heroTemplate = item.item as Hero
        const uniqueHero: Hero = {
          ...heroTemplate,
          id: `${heroTemplate.id}-${draftState.currentPicker}-pick-${draftState.pickNumber + 1}-${Date.now()}-${Math.random()}`,
        }
        updatedDrafted.heroes.push(uniqueHero)
        
        // Auto-add 2 copies of this hero's signature card
        if (heroTemplate.signatureCardId) {
          const sigCard = allCards.find(card => card.id === heroTemplate.signatureCardId)
            || allSpells.find(spell => spell.id === heroTemplate.signatureCardId)
          if (sigCard) {
            // Add 2 copies of the signature card
            updatedDrafted.cards.push(sigCard)
            updatedDrafted.cards.push(sigCard)
          }
        }
      } else if (item.type === 'card') {
        updatedDrafted.cards.push(item.item as BaseCard)
      } else if (item.type === 'battlefield') {
        updatedDrafted.battlefields.push(item.item as BattlefieldDefinition)
      }

      // Remove item from pack
      const updatedPack = removeItemFromPack(currentPack, item.id)
      updatedPack.picks.push(pick)

      // Calculate next state
      const picksRemainingThisTurn = draftState.picksRemainingThisTurn - 1
      const roundPicksRemaining = draftState.roundPicksRemaining - 1
      
      // Determine next picker and if we need a new round
      let nextPicker: PlayerId = draftState.currentPicker
      let nextPicksRemainingThisTurn = picksRemainingThisTurn
      let nextRoundPicksRemaining = roundPicksRemaining
      let nextRound = draftState.currentRound
      let nextPack: DraftPack | null = updatedPack
      let nextRoundPattern = draftState.roundPattern
      
      // Logic: Each player picks based on round type, then switch. After all picks done, new pack.
      if (picksRemainingThisTurn > 0) {
        // Same player continues with their remaining picks
      } else {
        // Current player's turn is done
        // Switch to the other player
        nextPicker = draftState.currentPicker === 'player1' ? 'player2' : 'player1'
        
        // If round is complete, start new round with new pack
        if (roundPicksRemaining <= 0) {
          nextRound = draftState.currentRound + 1
          const nextRoundPatternData = getRoundPattern(nextRound)
          nextRoundPattern = 0
          nextPicker = nextRoundPatternData.startingPlayer
          nextPicksRemainingThisTurn = nextRoundPatternData.picks[0].count // 1 for hero packs, 2 for normal packs
          nextRoundPicksRemaining = nextRoundPatternData.totalPicks // 2 for hero packs, 4 for normal packs
          nextPack = generateRandomPack(nextRound) // Generate new random pack (hero or normal)
        } else {
          // Get the next picker's count from the current round pattern
          const currentRoundPatternData = getRoundPattern(draftState.currentRound)
          const currentPickerIndex = currentRoundPatternData.picks.findIndex(p => p.player === draftState.currentPicker)
          const nextPickerIndex = currentPickerIndex + 1
          if (nextPickerIndex < currentRoundPatternData.picks.length) {
            nextPicksRemainingThisTurn = currentRoundPatternData.picks[nextPickerIndex].count
          } else {
            // Shouldn't happen, but fallback
            nextPicksRemainingThisTurn = 1
          }
        }
      }

      // Check if both players have enough items
      const player1HasEnough = hasEnoughItems(
        draftState.currentPicker === 'player1' ? updatedDrafted : draftState.player1Drafted
      )
      const player2HasEnough = hasEnoughItems(
        draftState.currentPicker === 'player2' ? updatedDrafted : draftState.player2Drafted
      )
      const draftComplete = player1HasEnough && player2HasEnough

      setDraftState(prev => {
        if (prev.currentPicker === 'player1') {
          return {
            ...prev,
            pickNumber: prev.pickNumber + 1,
            currentRound: nextRound,
            currentPack: nextPack,
            currentPicker: draftComplete ? prev.currentPicker : nextPicker,
            picksRemainingThisTurn: draftComplete ? prev.picksRemainingThisTurn : nextPicksRemainingThisTurn,
            roundPicksRemaining: draftComplete ? prev.roundPicksRemaining : nextRoundPicksRemaining,
            roundPattern: nextRoundPattern,
            player1Drafted: updatedDrafted,
            isDraftComplete: draftComplete,
          }
        } else {
          return {
            ...prev,
            pickNumber: prev.pickNumber + 1,
            currentRound: nextRound,
            currentPack: nextPack,
            currentPicker: draftComplete ? prev.currentPicker : nextPicker,
            picksRemainingThisTurn: draftComplete ? prev.picksRemainingThisTurn : nextPicksRemainingThisTurn,
            roundPicksRemaining: draftComplete ? prev.roundPicksRemaining : nextRoundPicksRemaining,
            roundPattern: nextRoundPattern,
            player2Drafted: updatedDrafted,
            isDraftComplete: draftComplete,
          }
        }
      })
    },
    [draftState, getCurrentPack]
  )

  // Make final selection (after draft is complete)
  const makeFinalSelection = useCallback(
    (
      player: PlayerId,
      selection: {
        heroes: Hero[]
        cards: BaseCard[]
        battlefield: BattlefieldDefinition
      }
    ) => {
      // Validate selection
      if (selection.heroes.length !== HEROES_REQUIRED) {
        throw new Error(`Must select exactly ${HEROES_REQUIRED} heroes`)
      }
      if (selection.cards.length !== CARDS_REQUIRED) {
        throw new Error(`Must select exactly ${CARDS_REQUIRED} cards`)
      }
      if (!selection.battlefield) {
        throw new Error('Must select exactly 1 battlefield')
      }

      const finalSelection: FinalDraftSelection = {
        heroes: selection.heroes,
        cards: selection.cards,
        battlefield: selection.battlefield,
      }

      setDraftState(prev => ({
        ...prev,
        [`${player}Final`]: finalSelection,
        isSelectionComplete:
          prev.player1Final !== null && prev.player2Final !== null,
      }))
    },
    []
  )

  // Auto-fill defaults if needed
  // This function should ONLY return items that were actually drafted
  // It does NOT add default items - those should be added via the UI
  const autoFillDefaults = useCallback(
    (player: PlayerId): FinalDraftSelection => {
      const drafted = draftState[`${player}Drafted`]
      
      // Select all available heroes (up to required amount)
      const selectedHeroes = drafted.heroes.slice(0, HEROES_REQUIRED)
      
      // Select all available cards (up to required amount)
      const selectedCards = drafted.cards.slice(0, CARDS_REQUIRED)
      
      // Select first available battlefield, or use default if none
      const selectedBattlefield = drafted.battlefields.length > 0 
        ? drafted.battlefields[0]
        : defaultBattlefield

      return {
        heroes: selectedHeroes,
        cards: selectedCards,
        battlefield: selectedBattlefield,
      }
    },
    [draftState]
  )

  // Auto-build complete decks: Assign archetypes and build decks automatically
  const autoBuildDecks = useCallback(() => {
    setDraftState(prevState => {
      // Assign RW to one player and UBG to the other (randomly)
      const archetypes: [Archetype, Archetype] = Math.random() > 0.5 
        ? ['rw-legion', 'ubg-control']
        : ['ubg-control', 'rw-legion']
      const player1Archetype = archetypes[0]
      const player2Archetype = archetypes[1]
      
      // Get heroes matching each player's archetype
      const player1HeroPool = allHeroes.filter(h => heroMatchesArchetype(h, [player1Archetype]))
      const player2HeroPool = allHeroes.filter(h => heroMatchesArchetype(h, [player2Archetype]))
      
      // Get cards matching each player's archetype (including spells and artifacts)
      // IMPORTANT: Filter strictly by archetype to prevent cross-contamination
      const allCardsAndSpells: BaseCard[] = [...allCards, ...allSpells, ...allArtifacts]
      const player1CardPool = allCardsAndSpells.filter(c => cardMatchesArchetype(c, [player1Archetype]))
      const player2CardPool = allCardsAndSpells.filter(c => cardMatchesArchetype(c, [player2Archetype]))
      
      // Get battlefields (allow any for now)
      const player1BattlefieldPool = allBattlefields
      const player2BattlefieldPool = allBattlefields
      
      // Shuffle and select
      const shuffle = <T>(arr: T[]): T[] => {
        const copy = [...arr]
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]]
        }
        return copy
      }
      
      // Select 4 heroes for each player (allow duplicates if not enough unique heroes)
      const player1Heroes: Hero[] = []
      const player2Heroes: Hero[] = []
      
      // Fill up to HEROES_REQUIRED, allowing duplicates if needed
      for (let i = 0; i < HEROES_REQUIRED; i++) {
        const p1Hero = player1HeroPool[i % player1HeroPool.length]
        const p2Hero = player2HeroPool[i % player2HeroPool.length]
        
        player1Heroes.push({
          ...p1Hero,
          id: `${p1Hero.id}-player1-auto-${Date.now()}-${i}-${Math.random()}`,
        } as Hero)
        
        player2Heroes.push({
          ...p2Hero,
          id: `${p2Hero.id}-player2-auto-${Date.now()}-${i}-${Math.random()}`,
        } as Hero)
      }
      
      // Select 12 cards for each player
      const player1Cards = shuffle(player1CardPool).slice(0, CARDS_REQUIRED)
      const player2Cards = shuffle(player2CardPool).slice(0, CARDS_REQUIRED)
      
      // Select 1 battlefield for each player
      const player1Battlefield = shuffle(player1BattlefieldPool)[0] || allBattlefields[0]
      const player2Battlefield = shuffle(player2BattlefieldPool)[0] || allBattlefields[0]
      
      // Create final selections
      const player1Final: FinalDraftSelection = {
        heroes: player1Heroes,
        cards: player1Cards,
        battlefield: player1Battlefield,
      }
      
      const player2Final: FinalDraftSelection = {
        heroes: player2Heroes,
        cards: player2Cards,
        battlefield: player2Battlefield,
      }
      
      return {
        ...prevState,
        player1Final,
        player2Final,
        isSelectionComplete: true,
        isDraftComplete: true,
      }
    })
  }, [])

  // Autodraft: Automatically pick random items until draft is complete
  const autoDraft = useCallback(() => {
    setDraftState(prevState => {
      let currentState = { ...prevState }
      const maxIterations = 1000 // Safety limit to prevent infinite loops
      let iterations = 0

      while (!currentState.isDraftComplete && iterations < maxIterations) {
        const currentPack = currentState.currentPack
        if (!currentPack || currentPack.remainingItems.length === 0) {
          // Generate new pack for next round
          const nextRound = currentState.currentRound + 1
          const nextRoundPatternData = getRoundPattern(nextRound)
          currentState = {
            ...currentState,
            currentRound: nextRound,
            currentPack: generateRandomPack(nextRound),
            roundPicksRemaining: nextRoundPatternData.totalPicks,
            picksRemainingThisTurn: nextRoundPatternData.picks[0].count,
            currentPicker: nextRoundPatternData.startingPlayer,
          }
          continue
        }

        // Pick a random item from remaining items
        const remainingItems = currentPack.remainingItems
        if (remainingItems.length === 0) {
          // Generate new pack
          const nextRound = currentState.currentRound + 1
          const nextRoundPatternData = getRoundPattern(nextRound)
          currentState = {
            ...currentState,
            currentRound: nextRound,
            currentPack: generateRandomPack(nextRound),
            roundPicksRemaining: nextRoundPatternData.totalPicks,
            picksRemainingThisTurn: nextRoundPatternData.picks[0].count,
            currentPicker: nextRoundPatternData.startingPlayer,
          }
          continue
        }

        const randomIndex = Math.floor(Math.random() * remainingItems.length)
        const randomItem = remainingItems[randomIndex]

        // Create a pick
        const pick: DraftPick = {
          pickNumber: currentState.pickNumber + 1,
          packNumber: currentState.currentRound,
          player: currentState.currentPicker,
          pickType: randomItem.type,
          pick: randomItem.item as Hero | BaseCard | BattlefieldDefinition,
          timestamp: Date.now(),
        }

        // Add to player's drafted items
        const playerKey = `${currentState.currentPicker}Drafted` as keyof DraftState
        const currentDrafted = currentState[playerKey] as DraftedItems
        const updatedDrafted: DraftedItems = {
          heroes: [...currentDrafted.heroes],
          cards: [...currentDrafted.cards],
          battlefields: [...currentDrafted.battlefields],
        }

        if (randomItem.type === 'hero') {
          // Create a unique instance of the hero with a unique ID
          const heroTemplate = randomItem.item as Hero
          const uniqueHero: Hero = {
            ...heroTemplate,
            id: `${heroTemplate.id}-${currentState.currentPicker}-pick-${currentState.pickNumber + 1}-${Date.now()}-${Math.random()}`,
          }
          updatedDrafted.heroes.push(uniqueHero)
          
          // Auto-add 2 copies of this hero's signature card
          if (heroTemplate.signatureCardId) {
            const sigCard = allCards.find(card => card.id === heroTemplate.signatureCardId) 
              || allSpells.find(spell => spell.id === heroTemplate.signatureCardId)
            if (sigCard) {
              // Add 2 copies of the signature card
              updatedDrafted.cards.push(sigCard)
              updatedDrafted.cards.push(sigCard)
            }
          }
        } else if (randomItem.type === 'card') {
          updatedDrafted.cards.push(randomItem.item as BaseCard)
        } else if (randomItem.type === 'battlefield') {
          updatedDrafted.battlefields.push(randomItem.item as BattlefieldDefinition)
        }

        // Remove item from pack
        const updatedPack = removeItemFromPack(currentPack, randomItem.id)
        updatedPack.picks.push(pick)

        // Calculate next state
        const picksRemainingThisTurn = currentState.picksRemainingThisTurn - 1
        const roundPicksRemaining = currentState.roundPicksRemaining - 1
        
        // Determine next picker and if we need a new round
        let nextPicker: PlayerId = currentState.currentPicker
        let nextPicksRemainingThisTurn = picksRemainingThisTurn
        let nextRoundPicksRemaining = roundPicksRemaining
        let nextRound = currentState.currentRound
        let nextPack: DraftPack | null = updatedPack
        let nextRoundPattern = currentState.roundPattern
        
        // Logic: Each player picks based on round type, then switch. After all picks done, new pack.
        if (picksRemainingThisTurn > 0) {
          // Same player continues with their remaining picks
        } else {
          // Current player's turn is done
          // Switch to the other player
          nextPicker = currentState.currentPicker === 'player1' ? 'player2' : 'player1'
          
          // If round is complete, start new round with new pack
          if (roundPicksRemaining <= 0) {
            nextRound = currentState.currentRound + 1
            const nextRoundPatternData = getRoundPattern(nextRound)
            nextRoundPattern = 0
            nextPicker = nextRoundPatternData.startingPlayer
            nextPicksRemainingThisTurn = nextRoundPatternData.picks[0].count
            nextRoundPicksRemaining = nextRoundPatternData.totalPicks
            nextPack = generateRandomPack(nextRound) // Generate new random pack (hero or normal)
          } else {
            // Get the next picker's count from the current round pattern
            const currentRoundPatternData = getRoundPattern(currentState.currentRound)
            const currentPickerIndex = currentRoundPatternData.picks.findIndex(p => p.player === currentState.currentPicker)
            const nextPickerIndex = currentPickerIndex + 1
            if (nextPickerIndex < currentRoundPatternData.picks.length) {
              nextPicksRemainingThisTurn = currentRoundPatternData.picks[nextPickerIndex].count
            } else {
              // Shouldn't happen, but fallback
              nextPicksRemainingThisTurn = 1
            }
          }
        }

        // Check if both players have enough items
        const player1HasEnough = hasEnoughItems(
          currentState.currentPicker === 'player1' ? updatedDrafted : currentState.player1Drafted
        )
        const player2HasEnough = hasEnoughItems(
          currentState.currentPicker === 'player2' ? updatedDrafted : currentState.player2Drafted
        )
        const draftComplete = player1HasEnough && player2HasEnough

        // Update state
        if (currentState.currentPicker === 'player1') {
          currentState = {
            ...currentState,
            pickNumber: currentState.pickNumber + 1,
            currentRound: nextRound,
            currentPack: nextPack,
            currentPicker: draftComplete ? currentState.currentPicker : nextPicker,
            picksRemainingThisTurn: draftComplete ? currentState.picksRemainingThisTurn : nextPicksRemainingThisTurn,
            roundPicksRemaining: draftComplete ? currentState.roundPicksRemaining : nextRoundPicksRemaining,
            roundPattern: nextRoundPattern,
            player1Drafted: updatedDrafted,
            isDraftComplete: draftComplete,
          }
        } else {
          currentState = {
            ...currentState,
            pickNumber: currentState.pickNumber + 1,
            currentRound: nextRound,
            currentPack: nextPack,
            currentPicker: draftComplete ? currentState.currentPicker : nextPicker,
            picksRemainingThisTurn: draftComplete ? currentState.picksRemainingThisTurn : nextPicksRemainingThisTurn,
            roundPicksRemaining: draftComplete ? currentState.roundPicksRemaining : nextRoundPicksRemaining,
            roundPattern: nextRoundPattern,
            player2Drafted: updatedDrafted,
            isDraftComplete: draftComplete,
          }
        }

        iterations++
      }

      // If draft completed, automatically build decks
      if (currentState.isDraftComplete && !currentState.isSelectionComplete) {
        // Detect each player's archetype from their drafted heroes
        const detectArchetype = (heroes: Hero[]): Archetype => {
          if (heroes.length === 0) return 'rw-legion' // Default
          
          let hasRed = false
          let hasWhite = false
          let hasBlue = false
          let hasBlack = false
          let hasGreen = false
          
          heroes.forEach(hero => {
            const colors = hero.colors || []
            if (colors.includes('red')) hasRed = true
            if (colors.includes('white')) hasWhite = true
            if (colors.includes('blue')) hasBlue = true
            if (colors.includes('black')) hasBlack = true
            if (colors.includes('green')) hasGreen = true
          })
          
          // RW: has red or white, but NOT green, blue, or black
          const isRW = (hasRed || hasWhite) && !hasGreen && !hasBlue && !hasBlack
          // UBG: has blue, black, or green, but NOT red or white
          const isUBG = (hasBlue || hasBlack || hasGreen) && !hasRed && !hasWhite
          
          if (isRW) return 'rw-legion'
          if (isUBG) return 'ubg-control'
          // Fallback: if mixed, use majority or default
          if (hasRed || hasWhite) return 'rw-legion'
          return 'ubg-control'
        }
        
        const player1Archetype = detectArchetype(currentState.player1Drafted.heroes)
        const player2Archetype = detectArchetype(currentState.player2Drafted.heroes)
        
        // Filter drafted cards by each player's archetype to prevent cross-archetype contamination
        const player1FilteredCards = currentState.player1Drafted.cards.filter(c => 
          cardMatchesArchetype(c, [player1Archetype])
        )
        const player2FilteredCards = currentState.player2Drafted.cards.filter(c => 
          cardMatchesArchetype(c, [player2Archetype])
        )
        
        // Shuffle and select from drafted items
        const shuffle = <T>(arr: T[]): T[] => {
          const copy = [...arr]
          for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]]
          }
          return copy
        }
        
        // Select from drafted heroes (already filtered by archetype)
        const player1Heroes = shuffle(currentState.player1Drafted.heroes).slice(0, HEROES_REQUIRED)
        const player2Heroes = shuffle(currentState.player2Drafted.heroes).slice(0, HEROES_REQUIRED)
        
        // Select from filtered cards (now properly filtered by archetype, includes signature cards)
        const player1Cards = shuffle(player1FilteredCards).slice(0, CARDS_REQUIRED)
        const player2Cards = shuffle(player2FilteredCards).slice(0, CARDS_REQUIRED)
        
        // Select from drafted battlefields
        const player1Battlefield = currentState.player1Drafted.battlefields[0] || allBattlefields[0]
        const player2Battlefield = currentState.player2Drafted.battlefields[0] || allBattlefields[0]
        
        // Create final selections
        const player1Final: FinalDraftSelection = {
          heroes: player1Heroes,
          cards: player1Cards,
          battlefield: player1Battlefield,
        }
        
        const player2Final: FinalDraftSelection = {
          heroes: player2Heroes,
          cards: player2Cards,
          battlefield: player2Battlefield,
        }
        
        currentState = {
          ...currentState,
          player1Final,
          player2Final,
          isSelectionComplete: true,
        }
      }

      return currentState
    })
  }, [])

  // Reset draft
  const resetDraft = useCallback(() => {
    setDraftState(initialDraftState())
  }, [])

  return {
    draftState,
    getCurrentPack,
    makePick,
    makeFinalSelection,
    autoFillDefaults,
    autoDraft,
    autoBuildDecks,
    resetDraft,
  }
}

