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
} from '../game/types'
import { generateAllDraftPacks, removeItemFromPack, isPackComplete, generateRandomPack } from '../game/draftSystem'
import { defaultHeroes, defaultBattlefield } from '../game/draftData'

// Check if a player has enough items to complete their deck
function hasEnoughItems(drafted: DraftedItems): boolean {
  return (
    drafted.heroes.length >= HEROES_REQUIRED &&
    drafted.cards.length >= CARDS_REQUIRED &&
    drafted.battlefields.length >= BATTLEFIELDS_REQUIRED
  )
}

// Get the pick pattern for a round
// Each pack: 4 picks total, each player gets exactly 2 picks
// Simple pattern: P1 picks 2, P2 picks 2, then new pack
function getRoundPattern(roundNumber: number): {
  startingPlayer: PlayerId
  picks: { player: PlayerId; count: number }[]
  totalPicks: number
} {
  // Always: P1 picks 2, then P2 picks 2
  return {
    startingPlayer: 'player1',
    picks: [
      { player: 'player1', count: 2 },
      { player: 'player2', count: 2 },
    ],
    totalPicks: 4,
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
        updatedDrafted.heroes.push(item.item as Hero)
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
      
      // Simple logic: Each player picks 2, then switch. After 4 picks total, new pack.
      if (picksRemainingThisTurn > 0) {
        // Same player continues with their remaining picks
      } else {
        // Current player's turn is done (they've picked their 2)
        // Switch to the other player
        nextPicker = draftState.currentPicker === 'player1' ? 'player2' : 'player1'
        nextPicksRemainingThisTurn = 2 // Other player gets 2 picks
        
        // If round is complete (4 picks done), start new round with new pack
        if (roundPicksRemaining <= 0) {
          nextRound = draftState.currentRound + 1
          const nextRoundPatternData = getRoundPattern(nextRound)
          nextRoundPattern = 0 // Always same pattern now
          nextPicker = nextRoundPatternData.startingPlayer // Always P1 starts
          nextPicksRemainingThisTurn = nextRoundPatternData.picks[0].count // Always 2
          nextRoundPicksRemaining = nextRoundPatternData.totalPicks // Always 4
          nextPack = generateRandomPack(nextRound) // Generate new random pack
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
  const autoFillDefaults = useCallback(
    (player: PlayerId): FinalDraftSelection => {
      const drafted = draftState[`${player}Drafted`]
      const heroes = [...drafted.heroes]
      const cards = [...drafted.cards]
      const battlefields = [...drafted.battlefields]

      // Fill heroes if needed - use default heroes for each color
      const defaultHeroColors: Color[] = ['red', 'blue', 'white', 'black', 'green']
      while (heroes.length < HEROES_REQUIRED) {
        const colorIndex = heroes.length % defaultHeroColors.length
        const color = defaultHeroColors[colorIndex]
        const defaultHeroTemplate = defaultHeroes.passable.find(h => h.colors[0] === color) ||
          defaultHeroes.disappointing.find(h => h.colors[0] === color)
        
        if (defaultHeroTemplate) {
          // Create a proper Hero instance with location and owner
          const defaultHero: Hero = {
            ...defaultHeroTemplate,
            id: `default-${player}-${color}-${Date.now()}-${heroes.length}`,
            location: 'hand',
            owner: player,
          }
          heroes.push(defaultHero)
        } else {
          // Fallback to first available default hero
          const fallback = defaultHeroes.passable[0] || defaultHeroes.disappointing[0]
          if (fallback) {
            const defaultHero: Hero = {
              ...fallback,
              id: `default-${player}-fallback-${Date.now()}-${heroes.length}`,
              location: 'hand',
              owner: player,
            }
            heroes.push(defaultHero)
          }
          break // Prevent infinite loop
        }
      }

      // Fill cards if needed (basic 2/2 for 3 mana)
      while (cards.length < CARDS_REQUIRED) {
        cards.push({
          id: `default-card-${cards.length}`,
          name: 'Basic Unit',
          description: 'A basic unit',
          cardType: 'generic',
          manaCost: 3,
          colors: [],
        } as BaseCard)
      }

      // Fill battlefield if needed
      if (battlefields.length === 0) {
        battlefields.push(defaultBattlefield)
      }

      return {
        heroes: heroes.slice(0, HEROES_REQUIRED),
        cards: cards.slice(0, CARDS_REQUIRED),
        battlefield: battlefields[0],
      }
    },
    [draftState]
  )

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
          currentState = {
            ...currentState,
            currentRound: nextRound,
            currentPack: generateRandomPack(nextRound),
            roundPicksRemaining: 4,
            picksRemainingThisTurn: currentState.currentPicker === 'player1' ? 2 : 2,
          }
          continue
        }

        // Pick a random item from remaining items
        const remainingItems = currentPack.remainingItems
        if (remainingItems.length === 0) {
          // Generate new pack
          const nextRound = currentState.currentRound + 1
          currentState = {
            ...currentState,
            currentRound: nextRound,
            currentPack: generateRandomPack(nextRound),
            roundPicksRemaining: 4,
            picksRemainingThisTurn: 2,
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
          updatedDrafted.heroes.push(randomItem.item as Hero)
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
        
        // Simple logic: Each player picks 2, then switch. After 4 picks total, new pack.
        if (picksRemainingThisTurn > 0) {
          // Same player continues with their remaining picks
        } else {
          // Current player's turn is done (they've picked their 2)
          // Switch to the other player
          nextPicker = currentState.currentPicker === 'player1' ? 'player2' : 'player1'
          nextPicksRemainingThisTurn = 2 // Other player gets 2 picks
          
          // If round is complete (4 picks done), start new round with new pack
          if (roundPicksRemaining <= 0) {
            nextRound = currentState.currentRound + 1
            const nextRoundPatternData = getRoundPattern(nextRound)
            nextRoundPattern = 0 // Always same pattern now
            nextPicker = nextRoundPatternData.startingPlayer // Always P1 starts
            nextPicksRemainingThisTurn = nextRoundPatternData.picks[0].count // Always 2
            nextRoundPicksRemaining = nextRoundPatternData.totalPicks // Always 4
            nextPack = generateRandomPack(nextRound) // Generate new random pack
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
    resetDraft,
  }
}

