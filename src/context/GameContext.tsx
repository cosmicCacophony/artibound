import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Card, GameState, AttackTarget, Item, BaseCard, PlayerId, Hero, BattlefieldDefinition, FinalDraftSelection, Color, HEROES_REQUIRED, CARDS_REQUIRED, ShopItem, Archetype, GameMetadata } from '../game/types'
import { createInitialGameState, createCardLibrary, createGameStateFromDraft } from '../game/sampleData'
import { draftableHeroes } from '../game/draftData'
import { allCards, allSpells, allBattlefields, allHeroes } from '../game/cardData'
import { heroMatchesArchetype, cardMatchesArchetype } from '../game/draftSystem'

interface GameContextType {
  // Game State
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
  
  // UI State
  selectedCardId: string | null
  setSelectedCardId: (id: string | null) => void
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
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialState = createInitialGameState()
    return {
      ...initialState,
      cardLibrary: [],
      player1Battlefields: initialState.player1Battlefields,
      player2Battlefields: initialState.player2Battlefields,
    }
  })
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
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
      player1Battlefields: newGameState.player1Battlefields,
      player2Battlefields: newGameState.player2Battlefields,
    })
    
    // Update card libraries with the remaining cards
    setPlayer1SidebarCards(newGameState.player1Library)
    setPlayer2SidebarCards(newGameState.player2Library)
  }, [setGameState, setPlayer1SidebarCards, setPlayer2SidebarCards])

  const initializeRandomGame = useCallback(() => {
    // Assign RW to one player and UB to the other (randomly)
    const archetypes: [Archetype, Archetype] = Math.random() > 0.5 
      ? ['rw-legion', 'ub-control']
      : ['ub-control', 'rw-legion']
    const player1Archetype = archetypes[0]
    const player2Archetype = archetypes[1]
    
    // Get heroes matching each player's archetype
    const player1HeroPool = allHeroes.filter(h => heroMatchesArchetype(h, [player1Archetype]))
    const player2HeroPool = allHeroes.filter(h => heroMatchesArchetype(h, [player2Archetype]))
    
    // Get cards matching each player's archetype (including spells)
    const allCardsAndSpells: BaseCard[] = [...allCards, ...allSpells]
    const player1CardPool = allCardsAndSpells.filter(c => cardMatchesArchetype(c, [player1Archetype]))
    const player2CardPool = allCardsAndSpells.filter(c => cardMatchesArchetype(c, [player2Archetype]))
    
    // Get battlefields (allow any for now)
    const player1BattlefieldPool = allBattlefields
    const player2BattlefieldPool = allBattlefields
    
    // Shuffle and select
    const shuffle = <T extends unknown>(arr: T[]): T[] => {
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
        id: `${p1Hero.id}-player1-random-${Date.now()}-${i}-${Math.random()}`,
      } as Hero)
      
      player2Heroes.push({
        ...p2Hero,
        id: `${p2Hero.id}-player2-random-${Date.now()}-${i}-${Math.random()}`,
      } as Hero)
    }
    
    // Select 12 cards for each player (signature cards will be auto-added)
    const DRAFTED_CARDS_REQUIRED = 12
    const player1DraftedCards = shuffle(player1CardPool).slice(0, DRAFTED_CARDS_REQUIRED)
    const player2DraftedCards = shuffle(player2CardPool).slice(0, DRAFTED_CARDS_REQUIRED)
    
    // Add 2 copies of each hero's signature card (4 heroes × 2 copies = 8 signature cards)
    const player1SignatureCards: BaseCard[] = []
    const player2SignatureCards: BaseCard[] = []
    
    for (const hero of player1Heroes) {
      if (hero.signatureCardId) {
        const sigCard = allCards.find(card => card.id === hero.signatureCardId)
          || allSpells.find(spell => spell.id === hero.signatureCardId)
        if (sigCard) {
          // Add 2 copies
          player1SignatureCards.push(sigCard)
          player1SignatureCards.push(sigCard)
        }
      }
    }
    
    for (const hero of player2Heroes) {
      if (hero.signatureCardId) {
        const sigCard = allCards.find(card => card.id === hero.signatureCardId)
          || allSpells.find(spell => spell.id === hero.signatureCardId)
        if (sigCard) {
          // Add 2 copies
          player2SignatureCards.push(sigCard)
          player2SignatureCards.push(sigCard)
        }
      }
    }
    
    // Combine drafted cards + signature cards (12 + 8 = 20 total)
    const player1Cards = [...player1DraftedCards, ...player1SignatureCards]
    const player2Cards = [...player2DraftedCards, ...player2SignatureCards]
    
    // Don't pass battlefields - createGameStateFromDraft will assign hardcoded ones based on archetype
    // RW always gets Training Grounds + War Camp
    // UB always gets Arcane Nexus + Shadow Library
    
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

  const value: GameContextType = {
    gameState,
    setGameState,
    selectedCardId,
    setSelectedCardId,
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

