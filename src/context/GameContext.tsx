import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Card, GameState, AttackTarget, Item, BaseCard, PlayerId, Hero, BattlefieldDefinition, FinalDraftSelection, Color, HEROES_REQUIRED, CARDS_REQUIRED } from '../game/types'
import { createInitialGameState, createCardLibrary, createGameStateFromDraft } from '../game/sampleData'
import { draftableHeroes } from '../game/draftData'
import { allCards, allSpells, allBattlefields } from '../game/cardData'

interface GameContextType {
  // Game State
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
  
  // UI State
  selectedCardId: string | null
  setSelectedCardId: (id: string | null) => void
  showItemShop: boolean
  setShowItemShop: (show: boolean) => void
  itemShopItems: Item[]
  setItemShopItems: (items: Item[]) => void
  
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
  
  // Computed values
  selectedCard: Card | null
  metadata: GameMetadata
  activePlayer: PlayerId
  
  // Helper functions
  getAvailableSlots: (battlefield: Card[]) => number
  setActivePlayer: (player: PlayerId) => void
  initializeGameFromDraft: (player1Selection: FinalDraftSelection, player2Selection: FinalDraftSelection) => void
  initializeRandomGame: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  // Initialize card libraries
  const player1CardLibrary = createCardLibrary('player1')
  const player2CardLibrary = createCardLibrary('player2')
  
  // Game state
  const [gameState, setGameState] = useState<GameState>(createInitialGameState())
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [showItemShop, setShowItemShop] = useState(false)
  const [itemShopItems, setItemShopItems] = useState<Item[]>([])
  
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
    // Randomly assign 2 colors to each player (different colors)
    const allColors: Color[] = ['red', 'blue', 'white', 'black', 'green']
    const shuffledColors = [...allColors].sort(() => Math.random() - 0.5)
    const player1Colors = shuffledColors.slice(0, 2)
    const player2Colors = shuffledColors.slice(2, 4)
    
    // Helper to filter by colors (card must have at least one of the colors)
    const matchesColors = (item: { colors?: Color[] }, colors: Color[]) => {
      if (!item.colors || item.colors.length === 0) return false
      return item.colors.some(c => colors.includes(c))
    }
    
    // Get heroes in player colors
    const player1HeroPool = draftableHeroes.filter(h => matchesColors(h, player1Colors))
    const player2HeroPool = draftableHeroes.filter(h => matchesColors(h, player2Colors))
    
    // Get cards in player colors (including spells)
    const allCardsAndSpells: BaseCard[] = [...allCards, ...allSpells]
    const player1CardPool = allCardsAndSpells.filter(c => matchesColors(c, player1Colors))
    const player2CardPool = allCardsAndSpells.filter(c => matchesColors(c, player2Colors))
    
    // Get battlefields (prefer ones matching colors, but allow any)
    const player1BattlefieldPool = allBattlefields.filter(b => 
      !b.colors || b.colors.length === 0 || matchesColors(b, player1Colors)
    )
    const player2BattlefieldPool = allBattlefields.filter(b => 
      !b.colors || b.colors.length === 0 || matchesColors(b, player2Colors)
    )
    
    // Shuffle and select
    const shuffle = <T>(arr: T[]): T[] => {
      const copy = [...arr]
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]]
      }
      return copy
    }
    
    // Select 4 heroes for each player
    const player1Heroes = shuffle(player1HeroPool).slice(0, HEROES_REQUIRED).map((hero, idx) => ({
      ...hero,
      id: `${hero.id}-player1-random-${Date.now()}-${idx}`,
    } as Hero))
    
    const player2Heroes = shuffle(player2HeroPool).slice(0, HEROES_REQUIRED).map((hero, idx) => ({
      ...hero,
      id: `${hero.id}-player2-random-${Date.now()}-${idx}`,
    } as Hero))
    
    // Select 12 cards for each player
    const player1Cards = shuffle(player1CardPool).slice(0, CARDS_REQUIRED)
    const player2Cards = shuffle(player2CardPool).slice(0, CARDS_REQUIRED)
    
    // Select 1 battlefield for each player
    const player1Battlefield = shuffle(player1BattlefieldPool)[0] || allBattlefields[0]
    const player2Battlefield = shuffle(player2BattlefieldPool)[0] || allBattlefields[0]
    
    // Create final selections
    const player1Selection: FinalDraftSelection = {
      heroes: player1Heroes,
      cards: player1Cards,
      battlefield: player1Battlefield,
    }
    
    const player2Selection: FinalDraftSelection = {
      heroes: player2Heroes,
      cards: player2Cards,
      battlefield: player2Battlefield,
    }
    
    // Initialize game from these selections
    initializeGameFromDraft(player1Selection, player2Selection)
  }, [initializeGameFromDraft])

  const value: GameContextType = {
    gameState,
    setGameState,
    selectedCardId,
    setSelectedCardId,
    showItemShop,
    setShowItemShop,
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
    selectedCard,
    metadata,
    activePlayer,
    getAvailableSlots,
    setActivePlayer,
    initializeGameFromDraft,
    initializeRandomGame,
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

