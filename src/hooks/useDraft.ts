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
} from '../game/types'
import { generateAllDraftPacks, removeItemFromPack, isPackComplete } from '../game/draftSystem'
import { defaultHeroes, defaultBattlefield } from '../game/draftData'

const initialDraftState = (): DraftState => {
  const packs = generateAllDraftPacks()
  return {
    currentPack: 1,
    currentPicker: 'player1',
    pickNumber: 0,
    picksRemainingThisTurn: 1, // Player 1 picks 1 first, then everyone picks 2
    packs,
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
    return draftState.packs.find(p => p.packNumber === draftState.currentPack) || null
  }, [draftState])

  // Make a pick
  const makePick = useCallback(
    (item: DraftPoolItem) => {
      const currentPack = getCurrentPack()
      if (!currentPack || currentPack.isComplete) return

      const pick: DraftPick = {
        pickNumber: draftState.pickNumber + 1,
        packNumber: draftState.currentPack,
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

      // Check if pack is complete
      const packComplete = isPackComplete(updatedPack)
      if (packComplete) {
        updatedPack.isComplete = true
      }

      // Update packs
      const updatedPacks = draftState.packs.map(p =>
        p.packNumber === draftState.currentPack ? updatedPack : p
      )

      // Determine next state
      const allPacksComplete = updatedPacks.every(p => p.isComplete)
      const picksRemaining = draftState.picksRemainingThisTurn - 1
      
      // If current player has picks remaining, stay with them
      // Otherwise, switch to next player
      let nextPicker: PlayerId = draftState.currentPicker
      let nextPicksRemaining = picksRemaining
      
      if (picksRemaining <= 0 && !allPacksComplete) {
        // Switch to next player
        nextPicker = draftState.currentPicker === 'player1' ? 'player2' : 'player1'
        // After first pick, everyone picks 2 at a time
        nextPicksRemaining = 2
      }
      
      const nextPack = allPacksComplete
        ? draftState.currentPack
        : packComplete
        ? draftState.currentPack + 1
        : draftState.currentPack

      setDraftState(prev => {
        if (prev.currentPicker === 'player1') {
          return {
            ...prev,
            pickNumber: prev.pickNumber + 1,
            currentPicker: allPacksComplete ? prev.currentPicker : nextPicker,
            picksRemainingThisTurn: allPacksComplete ? prev.picksRemainingThisTurn : nextPicksRemaining,
            currentPack: nextPack,
            packs: updatedPacks,
            player1Drafted: updatedDrafted,
            isDraftComplete: allPacksComplete,
          }
        } else {
          return {
            ...prev,
            pickNumber: prev.pickNumber + 1,
            currentPicker: allPacksComplete ? prev.currentPicker : nextPicker,
            picksRemainingThisTurn: allPacksComplete ? prev.picksRemainingThisTurn : nextPicksRemaining,
            currentPack: nextPack,
            packs: updatedPacks,
            player2Drafted: updatedDrafted,
            isDraftComplete: allPacksComplete,
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

      // Fill heroes if needed
      while (heroes.length < HEROES_REQUIRED) {
        if (heroes.length < HEROES_REQUIRED - defaultHeroes.disappointing.length) {
          // Use passable defaults first
          const passable = defaultHeroes.passable[heroes.length % defaultHeroes.passable.length]
          heroes.push(passable as Hero)
        } else {
          // Use disappointing defaults
          const disappointing =
            defaultHeroes.disappointing[
              (heroes.length - (HEROES_REQUIRED - defaultHeroes.disappointing.length)) %
                defaultHeroes.disappointing.length
            ]
          heroes.push(disappointing as Hero)
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
    resetDraft,
  }
}

