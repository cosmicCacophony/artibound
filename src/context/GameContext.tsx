import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Card, GameState, AttackTarget, Item, BaseCard, PlayerId } from '../game/types'
import { createInitialGameState, createCardLibrary } from '../game/sampleData'

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
    combatTargetsA,
    setCombatTargetsA,
    combatTargetsB,
    setCombatTargetsB,
    selectedCard,
    metadata,
    activePlayer,
    getAvailableSlots,
    setActivePlayer,
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

