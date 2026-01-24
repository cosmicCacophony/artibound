import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Card, GameState, AttackTarget, Item, BaseCard, PlayerId, Hero, BattlefieldDefinition, FinalDraftSelection, Color, HEROES_REQUIRED, CARDS_REQUIRED, ShopItem, Archetype, GameMetadata, PendingEffect, TemporaryZone } from '../game/types'
import { createInitialGameState, createCardLibrary, createGameStateFromDraft } from '../game/sampleData'
import { allCards, allSpells, allArtifacts, allBattlefields, allHeroes } from '../game/cardData'
import { ubHeroes } from '../game/comprehensiveCardData'
import { boss1ValiantLegion } from '../game/bossData'
import { heroMatchesArchetype, cardMatchesArchetype } from '../game/archetypeUtils'
import { saveDraft, getPreviousDraft } from '../game/draftStorage'

interface GameContextType {
  // Game State
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
  
  // UI State
  selectedCardId: string | null
  setSelectedCardId: (id: string | null) => void
  draggedCardId: string | null // Card currently being dragged
  setDraggedCardId: (id: string | null) => void
  itemShopPlayer: PlayerId | null // Which player's shop is open (null if closed)
  setItemShopPlayer: (player: PlayerId | null) => void
  itemShopItems: ShopItem[]
  setItemShopItems: (items: ShopItem[]) => void
  
  // Card Libraries
  player1SidebarCards: BaseCard[]
  setPlayer1SidebarCards: React.Dispatch<React.SetStateAction<BaseCard[]>>
  player2SidebarCards: BaseCard[]
  setPlayer2SidebarCards: React.Dispatch<React.SetStateAction<BaseCard[]>>
  
  // Archived Cards
  archivedCards: BaseCard[]
  setArchivedCards: React.Dispatch<React.SetStateAction<BaseCard[]>>
  
  // Card Library View
  showCardLibrary: boolean
  setShowCardLibrary: (show: boolean) => void
  
  // Combat Targets
  combatTargetsA: Map<string, AttackTarget>
  setCombatTargetsA: React.Dispatch<React.SetStateAction<Map<string, AttackTarget>>>
  combatTargetsB: Map<string, AttackTarget>
  setCombatTargetsB: React.Dispatch<React.SetStateAction<Map<string, AttackTarget>>>
  
  // Combat Summary Modal
  showCombatSummary: boolean
  setShowCombatSummary: (show: boolean) => void
  combatSummaryData: {
    battlefieldA: {
      name: string
      combatLog: any[]
      towerHP: { player1: number, player2: number }
      overflowDamage: { player1: number, player2: number }
    }
    battlefieldB: {
      name: string
      combatLog: any[]
      towerHP: { player1: number, player2: number }
      overflowDamage: { player1: number, player2: number }
    }
  } | null
  setCombatSummaryData: (data: any) => void

  // Pending effects (targeting or confirmation)
  pendingEffect: PendingEffect | null
  setPendingEffect: (effect: PendingEffect | null) => void
  temporaryZone: TemporaryZone | null
  setTemporaryZone: (zone: TemporaryZone | null) => void
  
  // Computed values
  selectedCard: Card | null
  metadata: GameMetadata
  activePlayer: PlayerId
  
  // Helper functions
  getAvailableSlots: (battlefield: Card[]) => number
  setActivePlayer: (player: PlayerId) => void
  initializeGameFromDraft: (player1Selection: FinalDraftSelection, player2Selection: FinalDraftSelection) => void
  initializeRandomGame: () => void
  initializeDraftGame: (player1Selection: FinalDraftSelection) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  // Initialize card libraries
  const player1CardLibrary = createCardLibrary('player1')
  const player2CardLibrary = createCardLibrary('player2')
  
  // Game state
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialState = createInitialGameState()
    return {
      ...initialState,
      cardLibrary: [],
    }
  })
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null)
  const [itemShopPlayer, setItemShopPlayer] = useState<PlayerId | null>(null)
  const [itemShopItems, setItemShopItems] = useState<ShopItem[]>([])
  
  // Card libraries
  const [player1SidebarCards, setPlayer1SidebarCards] = useState<BaseCard[]>(() => 
    player1CardLibrary.map(template => ({ ...template }))
  )
  const [player2SidebarCards, setPlayer2SidebarCards] = useState<BaseCard[]>(() => 
    player2CardLibrary.map(template => ({ ...template }))
  )
  
  // Archived cards
  const [archivedCards, setArchivedCards] = useState<BaseCard[]>([])
  
  // Card Library View
  const [showCardLibrary, setShowCardLibrary] = useState(false)
  
  // Combat targets
  const [combatTargetsA, setCombatTargetsA] = useState<Map<string, AttackTarget>>(new Map())
  const [combatTargetsB, setCombatTargetsB] = useState<Map<string, AttackTarget>>(new Map())
  
  // Combat Summary Modal
  const [showCombatSummary, setShowCombatSummary] = useState(false)
  const [combatSummaryData, setCombatSummaryData] = useState<{
    battlefieldA: {
      name: string
      combatLog: any[]
      towerHP: { player1: number, player2: number }
      overflowDamage: { player1: number, player2: number }
    }
    battlefieldB: {
      name: string
      combatLog: any[]
      towerHP: { player1: number, player2: number }
      overflowDamage: { player1: number, player2: number }
    }
  } | null>(null)
  const [pendingEffect, setPendingEffect] = useState<PendingEffect | null>(null)
  const [temporaryZone, setTemporaryZone] = useState<TemporaryZone | null>(null)
  
  // Computed values
  const metadata = gameState.metadata
  const activePlayer = metadata.activePlayer
  
  // Find selected card
  const selectedCard = selectedCardId
    ? [
        ...gameState.player1Hand,
        ...gameState.player2Hand,
        ...gameState.player1Base,
        ...gameState.player2Base,
        ...gameState.player1DeployZone,
        ...gameState.player2DeployZone,
        ...gameState.battlefieldA.player1,
        ...gameState.battlefieldA.player2,
        ...gameState.battlefieldB.player1,
        ...gameState.battlefieldB.player2,
      ].find(c => c.id === selectedCardId) || null
    : null
  
  // Helper function
  const getAvailableSlots = useCallback((battlefield: Card[]) => {
    const BATTLEFIELD_SLOT_LIMIT = 5
    const uniqueCards = battlefield.filter(card => 
      card.cardType !== 'generic' || !('stackedWith' in card && card.stackedWith)
    )
    return BATTLEFIELD_SLOT_LIMIT - uniqueCards.length
  }, [])
  
  const setActivePlayer = useCallback((player: PlayerId) => {
    setGameState(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        activePlayer: player,
      },
    }))
  }, [setGameState])

  const initializeGameFromDraft = useCallback((
    player1Selection: FinalDraftSelection,
    player2Selection: FinalDraftSelection
  ) => {
    const newGameState = createGameStateFromDraft(player1Selection, player2Selection)
    
    // Update game state with the new state from draft
    setGameState({
      ...newGameState,
      cardLibrary: newGameState.cardLibrary,
    })
    
    // Update card libraries with the remaining cards
    setPlayer1SidebarCards(newGameState.player1Library)
    setPlayer2SidebarCards(newGameState.player2Library)
  }, [setGameState, setPlayer1SidebarCards, setPlayer2SidebarCards])

  const initializeRandomGame = useCallback(() => {
    // Assign archetypes - one player gets UBG, the other gets boss Legion deck (AI-only)
    const useBossForPlayer2 = Math.random() > 0.5
    const player1Archetype: Archetype = 'ubg-control'
    const player2Archetype: Archetype = useBossForPlayer2 ? 'rw-legion' : 'ubg-control'
    
    // Handle player2: If Legion, use boss data (AI-only archetype)
    let player2Heroes: Hero[]
    let player2Cards: BaseCard[]
    
    if (player2Archetype === 'rw-legion') {
      // Use boss Legion deck for player2
      const boss = boss1ValiantLegion
      
      // Filter out undefined heroes and create hero instances
      player2Heroes = boss.heroes
        .filter((hero): hero is Omit<Hero, 'location' | 'owner'> => hero !== undefined)
        .map((hero, i) => ({
          ...hero,
          id: `${hero.id}-player2-${Date.now()}-${i}`,
          owner: 'player2' as const,
          location: 'base' as const,
        })) as Hero[]
      
      // Filter out undefined cards and combine boss cards
      player2Cards = [
        ...boss.units.filter((card): card is BaseCard => card !== undefined && card !== null),
        ...boss.spells.filter((card): card is BaseCard => card !== undefined && card !== null),
        ...boss.artifacts.filter((card): card is BaseCard => card !== undefined && card !== null),
      ]
    } else {
      // Normal deck building for non-Legion archetypes
      player2Heroes = []
      player2Cards = []
    }
    
    // Get heroes matching player1's archetype
    // For UBG, use only ubHeroes to ensure correct lineup (UG, G, B, U)
    let player1HeroPool: Omit<Hero, 'location' | 'owner'>[]
    
    if (player1Archetype === 'ubg-control') {
      player1HeroPool = ubHeroes
    } else {
      player1HeroPool = allHeroes.filter(h => heroMatchesArchetype(h, [player1Archetype]))
    }
    
    // Get cards matching player1's archetype (including spells and artifacts)
    const allCardsAndSpells: BaseCard[] = [...allCards, ...allSpells, ...allArtifacts]
    const player1CardPool = allCardsAndSpells.filter(c => cardMatchesArchetype(c, [player1Archetype]))
    
    // Get battlefields (allow any for now)
    const player1BattlefieldPool = allBattlefields
    const player2BattlefieldPool = allBattlefields
    
    // Random shuffle for variety in each game
    const randomShuffle = <T extends unknown>(arr: T[]): T[] => {
      const copy = [...arr]
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]]
      }
      return copy
    }
    
    // Build player1 deck (always UBG for now)
    const shuffledPlayer1HeroPool = randomShuffle(player1HeroPool)
    const player1Heroes: Hero[] = []
    
    // Fill up to HEROES_REQUIRED for player1
    for (let i = 0; i < HEROES_REQUIRED; i++) {
      const p1Hero = shuffledPlayer1HeroPool[i % shuffledPlayer1HeroPool.length]
      player1Heroes.push({
        ...p1Hero,
        id: `${p1Hero.id}-player1-${Date.now()}-${i}`,
      } as Hero)
    }
    
    // Build player2 deck if not using boss (i.e., if UBG)
    if (player2Archetype !== 'rw-legion') {
      // Normal deck building for player2
      let player2HeroPool: Omit<Hero, 'location' | 'owner'>[]
      if (player2Archetype === 'ubg-control') {
        player2HeroPool = ubHeroes
      } else {
        player2HeroPool = allHeroes.filter(h => heroMatchesArchetype(h, [player2Archetype]))
      }
      
      const shuffledPlayer2HeroPool = randomShuffle(player2HeroPool)
      player2Heroes = []
      
      for (let i = 0; i < HEROES_REQUIRED; i++) {
        const p2Hero = shuffledPlayer2HeroPool[i % shuffledPlayer2HeroPool.length]
        player2Heroes.push({
          ...p2Hero,
          id: `${p2Hero.id}-player2-${Date.now()}-${i}`,
        } as Hero)
      }
      
      const player2CardPool = allCardsAndSpells.filter(c => cardMatchesArchetype(c, [player2Archetype]))
      const ubgKeySpellIds = [
        'ubg-spell-exorcism',
        'rune-spell-dark-ritual',
        'rune-spell-seal-of-knowledge',
        'rune-spell-seal-of-darkness',
        'rune-spell-high-tide',
        'vrune-spell-damnation',
        'vrune-spell-necromantic-rite',
      ]
      
      const keySpellsForP2 = ubgKeySpellIds
        .map(id => allSpells.find(s => s.id === id))
        .filter(Boolean)
        .filter(c => cardMatchesArchetype(c, [player2Archetype])) as BaseCard[]
      
      const DRAFTED_CARDS_REQUIRED = 22
      let player2DraftedCards = [
        ...keySpellsForP2,
        ...randomShuffle(player2CardPool.filter(c => !ubgKeySpellIds.includes(c.id)))
      ].slice(0, DRAFTED_CARDS_REQUIRED)
      
      const player2SignatureCards: BaseCard[] = []
      for (const hero of player2Heroes) {
        if (hero.signatureCardId) {
          const sigCard = allCards.find(card => card.id === hero.signatureCardId)
            || allSpells.find(spell => spell.id === hero.signatureCardId)
          if (sigCard && cardMatchesArchetype(sigCard, [player2Archetype])) {
            player2SignatureCards.push(sigCard)
            player2SignatureCards.push(sigCard)
          }
        }
      }
      
      player2Cards = [...player2DraftedCards, ...player2SignatureCards]
    }
    
    // Build player1 deck
    const DRAFTED_CARDS_REQUIRED = 22
    const ubgKeySpellIds = [
      'ubg-spell-exorcism',
      'rune-spell-dark-ritual',
      'rune-spell-seal-of-knowledge',
      'rune-spell-seal-of-darkness',
      'rune-spell-high-tide',
      'vrune-spell-damnation',
      'vrune-spell-necromantic-rite',
    ]
    
    const keySpellsForP1 = ubgKeySpellIds
      .map(id => allSpells.find(s => s.id === id))
      .filter(Boolean)
      .filter(c => cardMatchesArchetype(c, [player1Archetype])) as BaseCard[]
    
    let player1DraftedCards = [
      ...keySpellsForP1,
      ...randomShuffle(player1CardPool.filter(c => !ubgKeySpellIds.includes(c.id)))
    ].slice(0, DRAFTED_CARDS_REQUIRED)
    
    const player1SignatureCards: BaseCard[] = []
    for (const hero of player1Heroes) {
      if (hero.signatureCardId) {
        const sigCard = allCards.find(card => card.id === hero.signatureCardId)
          || allSpells.find(spell => spell.id === hero.signatureCardId)
        if (sigCard && cardMatchesArchetype(sigCard, [player1Archetype])) {
          player1SignatureCards.push(sigCard)
          player1SignatureCards.push(sigCard)
        }
      }
    }
    
    const player1Cards = [...player1DraftedCards, ...player1SignatureCards]
    
    // Don't pass battlefields - createGameStateFromDraft will assign hardcoded ones based on archetype
    // RW always gets Training Grounds + War Camp
    // UBG always gets Arcane Nexus + Shadow Library
    
    // Create final selections (battlefield will be ignored, but required by type)
    const player1Selection: FinalDraftSelection = {
      heroes: player1Heroes,
      cards: player1Cards,
      battlefield: allBattlefields[0], // Placeholder, will be replaced by hardcoded ones
    }
    
    const player2Selection: FinalDraftSelection = {
      heroes: player2Heroes,
      cards: player2Cards,
      battlefield: allBattlefields[0], // Placeholder, will be replaced by hardcoded ones
    }
    
    // Initialize game from these selections
    initializeGameFromDraft(player1Selection, player2Selection)
  }, [initializeGameFromDraft])

  const initializeDraftGame = useCallback((player1Selection: FinalDraftSelection) => {
    const toTemplateId = (cardId: string) => {
      const player1Index = cardId.indexOf('-player1-')
      if (player1Index !== -1) {
        return cardId.slice(0, player1Index)
      }
      const player2Index = cardId.indexOf('-player2-')
      if (player2Index !== -1) {
        return cardId.slice(0, player2Index)
      }
      return cardId
    }

    const normalizeDraftSelection = (selection: FinalDraftSelection): FinalDraftSelection => ({
      ...selection,
      heroes: selection.heroes.map(hero => ({
        ...hero,
        id: toTemplateId(hero.id),
      })),
      cards: selection.cards.map(card => ({
        ...card,
        id: toTemplateId(card.id),
      })),
    })

    const normalizedPlayer1Selection = normalizeDraftSelection(player1Selection)
    // Save the current draft to localStorage (this will shift previous drafts)
    // After saving: current draft is at index 0, previous draft (if exists) is at index 1
    saveDraft(normalizedPlayer1Selection)
    
    // Get the previous draft (the one that was saved before this one, now at index 1)
    const previousDraft = getPreviousDraft()
    
    let player2Selection: FinalDraftSelection
    
    if (previousDraft) {
      // Use the previous draft as player2's deck (play against your last draft)
      player2Selection = normalizeDraftSelection(previousDraft)
    } else {
      // Fall back to boss Legion deck if no previous draft exists
      const boss = boss1ValiantLegion
      
      // Filter out undefined heroes and create hero instances
      const player2Heroes: Hero[] = boss.heroes
        .filter((hero): hero is Omit<Hero, 'location' | 'owner'> => hero !== undefined)
        .map((hero, i) => ({
          ...hero,
          id: `${hero.id}-player2-${Date.now()}-${i}`,
          owner: 'player2' as const,
          location: 'base' as const,
        })) as Hero[]
      
      // Filter out undefined cards and combine boss cards (units + spells + artifacts)
      const player2Cards: BaseCard[] = [
        ...boss.units.filter((card): card is BaseCard => card !== undefined && card !== null),
        ...boss.spells.filter((card): card is BaseCard => card !== undefined && card !== null),
        ...boss.artifacts.filter((card): card is BaseCard => card !== undefined && card !== null),
      ]
      
      // Create final selection for player2 (battlefield will be ignored, but required by type)
      player2Selection = {
        heroes: player2Heroes,
        cards: player2Cards,
        battlefield: allBattlefields[0], // Placeholder, will be replaced by hardcoded ones
      }
    }
    
    // Initialize game from player1's draft vs player2's deck (previous draft or RW Legion)
    initializeGameFromDraft(normalizedPlayer1Selection, player2Selection)
  }, [initializeGameFromDraft])

  const value: GameContextType = {
    gameState,
    setGameState,
    selectedCardId,
    setSelectedCardId,
    draggedCardId,
    setDraggedCardId,
    itemShopPlayer,
    setItemShopPlayer,
    itemShopItems,
    setItemShopItems,
    player1SidebarCards,
    setPlayer1SidebarCards,
    player2SidebarCards,
    setPlayer2SidebarCards,
    archivedCards,
    setArchivedCards,
    showCardLibrary,
    setShowCardLibrary,
    combatTargetsA,
    setCombatTargetsA,
    combatTargetsB,
    setCombatTargetsB,
    showCombatSummary,
    setShowCombatSummary,
    combatSummaryData,
    setCombatSummaryData,
    pendingEffect,
    setPendingEffect,
    temporaryZone,
    setTemporaryZone,
    selectedCard,
    metadata,
    activePlayer,
    getAvailableSlots,
    setActivePlayer,
    initializeGameFromDraft,
    initializeRandomGame,
    initializeDraftGame,
  }
  
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGameContext() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider')
  }
  return context
}

