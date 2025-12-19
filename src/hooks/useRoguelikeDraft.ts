import { useState, useCallback, useMemo } from 'react'
import {
  RoguelikeDraftState,
  RoguelikePack,
  RoguelikeDraftItem,
  RoguelikeDraftItemType,
  ROGUELIKE_TOTAL_PACKS,
  ROGUELIKE_HERO_PICK_PACKS,
  ROGUELIKE_PICKS_PER_MIXED_PACK,
} from '../game/roguelikeTypes'
import {
  generatePack,
  isDraftComplete,
  updatePlayerColors,
} from '../game/roguelikeDraft'
import { Hero, ArtifactCard, SpellCard, GenericUnit } from '../game/types'

// Generate initial draft state with first pack
function createInitialDraftState(): RoguelikeDraftState {
  const initialPack = generatePack(1, [], [])
  return {
    currentPack: 1,
    phase: 'heroPick',
    heroPickNumber: 1,
    currentPackData: initialPack,
    draftedHeroes: [],
    draftedArtifacts: [],
    draftedSpells: [],
    draftedUnits: [],
    picksRemainingThisPack: 1, // Hero picks: pick 1
    totalPicks: 0,
    playerColors: [],
    isComplete: false,
  }
}

export function useRoguelikeDraft() {
  const [draftState, setDraftState] = useState<RoguelikeDraftState>(createInitialDraftState)

  // Get current pack data
  const currentPack = useMemo(() => {
    if (!draftState.currentPackData) {
      // Generate pack if not already generated
      const pack = generatePack(
        draftState.currentPack,
        draftState.playerColors,
        draftState.draftedHeroes
      )
      return pack
    }
    return draftState.currentPackData
  }, [draftState.currentPack, draftState.currentPackData, draftState.playerColors, draftState.draftedHeroes])

  // Determine if current pack is a hero pick
  const isHeroPick = useMemo(() => {
    return ROGUELIKE_HERO_PICK_PACKS.includes(draftState.currentPack)
  }, [draftState.currentPack])

  // Determine current phase
  const currentPhase = useMemo(() => {
    return isHeroPick ? 'heroPick' : 'mixedPack'
  }, [isHeroPick])

  // Get hero pick number (1-4)
  const heroPickNumber = useMemo(() => {
    if (!isHeroPick) return null
    const index = ROGUELIKE_HERO_PICK_PACKS.indexOf(draftState.currentPack)
    return (index + 1) as 1 | 2 | 3 | 4
  }, [isHeroPick, draftState.currentPack])

  // Make a pick
  const makePick = useCallback((item: RoguelikeDraftItem) => {
    setDraftState(prev => {
      // Determine item type
      let itemType: RoguelikeDraftItemType
      if (item.cardType === 'hero') {
        itemType = 'hero'
      } else if (item.cardType === 'artifact') {
        itemType = 'artifact'
      } else if (item.cardType === 'spell') {
        itemType = 'spell'
      } else {
        itemType = 'unit'
      }

      // Add to appropriate array
      const newDraftedHeroes = itemType === 'hero' 
        ? [...prev.draftedHeroes, item as Hero]
        : prev.draftedHeroes
      
      const newDraftedArtifacts = itemType === 'artifact'
        ? [...prev.draftedArtifacts, item as ArtifactCard]
        : prev.draftedArtifacts
      
      const newDraftedSpells = itemType === 'spell'
        ? [...prev.draftedSpells, item as SpellCard]
        : prev.draftedSpells
      
      const newDraftedUnits = itemType === 'unit'
        ? [...prev.draftedUnits, item as GenericUnit]
        : prev.draftedUnits

      // Update player colors
      const newPlayerColors = updatePlayerColors(newDraftedHeroes)

      // Update picks remaining
      const newPicksRemaining = prev.picksRemainingThisPack - 1
      const newTotalPicks = prev.totalPicks + 1

      // Check if pack is complete
      const packComplete = newPicksRemaining <= 0

      // Move to next pack if current pack is complete
      let nextPack = prev.currentPack
      let nextPackData: RoguelikePack | null = null
      let nextPhase: 'heroPick' | 'mixedPack' = prev.phase
      let nextHeroPickNumber: 1 | 2 | 3 | 4 | null = prev.heroPickNumber
      let nextPicksRemaining = newPicksRemaining

      if (packComplete && prev.currentPack < ROGUELIKE_TOTAL_PACKS) {
        // Move to next pack
        nextPack = prev.currentPack + 1
        const isNextHeroPick = ROGUELIKE_HERO_PICK_PACKS.includes(nextPack)
        nextPhase = isNextHeroPick ? 'heroPick' : 'mixedPack'
        
        if (isNextHeroPick) {
          const index = ROGUELIKE_HERO_PICK_PACKS.indexOf(nextPack)
          nextHeroPickNumber = (index + 1) as 1 | 2 | 3 | 4
          nextPicksRemaining = 1 // Hero picks: pick 1
        } else {
          nextHeroPickNumber = null
          nextPicksRemaining = ROGUELIKE_PICKS_PER_MIXED_PACK // Mixed packs: pick 2
        }

        // Generate next pack
        nextPackData = generatePack(nextPack, newPlayerColors, newDraftedHeroes)
      }

      // Check if draft is complete
      const newState: RoguelikeDraftState = {
        currentPack: nextPack,
        phase: nextPhase,
        heroPickNumber: nextHeroPickNumber,
        currentPackData: nextPackData || prev.currentPackData,
        draftedHeroes: newDraftedHeroes,
        draftedArtifacts: newDraftedArtifacts,
        draftedSpells: newDraftedSpells,
        draftedUnits: newDraftedUnits,
        picksRemainingThisPack: nextPicksRemaining,
        totalPicks: newTotalPicks,
        playerColors: newPlayerColors,
        isComplete: false, // Will check below
      }

      // Check completion
      newState.isComplete = isDraftComplete(newState)

      return newState
    })
  }, [])

  // Reset draft
  const resetDraft = useCallback(() => {
    setDraftState(createInitialDraftState())
  }, [])

  // Get draft summary
  const getDraftSummary = useCallback(() => {
    const totalCards = 
      draftState.draftedArtifacts.length +
      draftState.draftedSpells.length +
      draftState.draftedUnits.length
    
    return {
      heroes: draftState.draftedHeroes.length,
      cards: totalCards,
      colors: draftState.playerColors,
      isComplete: draftState.isComplete,
    }
  }, [draftState])

  return {
    draftState,
    currentPack,
    isHeroPick,
    currentPhase,
    heroPickNumber,
    makePick,
    resetDraft,
    getDraftSummary,
  }
}

