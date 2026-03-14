import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Card, GameState, BaseCard, PlayerId, GameMetadata, HeroAbility } from '../game/types'
import { createManualPrototypeGameState } from '../game/sampleData'

export interface PendingAbility {
  heroId: string
  ability: HeroAbility
  owner: PlayerId
  battlefieldId: 'battlefieldA' | 'battlefieldB'
}

interface GameContextType {
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>

  selectedCardId: string | null
  setSelectedCardId: (id: string | null) => void
  draggedCardId: string | null
  setDraggedCardId: (id: string | null) => void
  pendingAbility: PendingAbility | null
  setPendingAbility: (pending: PendingAbility | null) => void

  player1SidebarCards: BaseCard[]
  setPlayer1SidebarCards: React.Dispatch<React.SetStateAction<BaseCard[]>>
  player2SidebarCards: BaseCard[]
  setPlayer2SidebarCards: React.Dispatch<React.SetStateAction<BaseCard[]>>

  showCombatSummary: boolean
  setShowCombatSummary: (show: boolean) => void
  combatSummaryData: {
    battlefieldA: import('../components/CombatSummaryModal').LaneCombatData
    battlefieldB: import('../components/CombatSummaryModal').LaneCombatData
  } | null
  setCombatSummaryData: (data: any) => void

  selectedCard: Card | null
  metadata: GameMetadata
  activePlayer: PlayerId

  getLaneCapacity: (battlefield: Card[]) => number
  setActivePlayer: (player: PlayerId) => void
  initializeRunePrototype: () => void
  initializePrototype: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

function createEmptyGameState(): GameState {
  const proto = createManualPrototypeGameState()
  return {
    player1Hand: proto.player1Hand,
    player2Hand: proto.player2Hand,
    player1Base: proto.player1Base,
    player2Base: proto.player2Base,
    player1DeployZone: proto.player1DeployZone,
    player2DeployZone: proto.player2DeployZone,
    battlefieldA: proto.battlefieldA,
    battlefieldB: proto.battlefieldB,
    cardLibrary: [],
    metadata: proto.metadata,
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(createEmptyGameState)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null)
  const [pendingAbility, setPendingAbility] = useState<PendingAbility | null>(null)

  const [player1SidebarCards, setPlayer1SidebarCards] = useState<BaseCard[]>([])
  const [player2SidebarCards, setPlayer2SidebarCards] = useState<BaseCard[]>([])

  const [showCombatSummary, setShowCombatSummary] = useState(false)
  const [combatSummaryData, setCombatSummaryData] = useState<GameContextType['combatSummaryData']>(null)

  const metadata = gameState.metadata
  const activePlayer = metadata.activePlayer

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

  const getLaneCapacity = useCallback((battlefield: Card[]) => {
    return 5 - battlefield.length
  }, [])

  const setActivePlayer = useCallback((player: PlayerId) => {
    setGameState(prev => ({
      ...prev,
      metadata: { ...prev.metadata, activePlayer: player },
    }))
  }, [setGameState])

  const initializeRunePrototype = useCallback(() => {
    const protoState = createManualPrototypeGameState()
    setGameState({
      player1Hand: protoState.player1Hand,
      player2Hand: protoState.player2Hand,
      player1Base: protoState.player1Base,
      player2Base: protoState.player2Base,
      player1DeployZone: protoState.player1DeployZone,
      player2DeployZone: protoState.player2DeployZone,
      battlefieldA: protoState.battlefieldA,
      battlefieldB: protoState.battlefieldB,
      cardLibrary: [],
      metadata: protoState.metadata,
    })
    setPlayer1SidebarCards(protoState.player1Library as BaseCard[])
    setPlayer2SidebarCards(protoState.player2Library as BaseCard[])
    setSelectedCardId(null)
    setPendingAbility(null)
    setCombatSummaryData(null)
    setShowCombatSummary(false)
  }, [setGameState])

  const initializePrototype = initializeRunePrototype

  const value: GameContextType = {
    gameState,
    setGameState,
    selectedCardId,
    setSelectedCardId,
    draggedCardId,
    setDraggedCardId,
    pendingAbility,
    setPendingAbility,
    player1SidebarCards,
    setPlayer1SidebarCards,
    player2SidebarCards,
    setPlayer2SidebarCards,
    showCombatSummary,
    setShowCombatSummary,
    combatSummaryData,
    setCombatSummaryData,
    selectedCard,
    metadata,
    activePlayer,
    getLaneCapacity,
    setActivePlayer,
    initializeRunePrototype,
    initializePrototype,
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
