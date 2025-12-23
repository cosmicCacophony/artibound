import React, { useState } from 'react'
import { useDraft } from '../hooks/useDraft'
import { DraftPoolItem, DraftPickType } from '../game/types'
import DraftPackComponent from './DraftPack'
import DraftPicks from './DraftPicks'
import DraftSelection from './DraftSelection'
import DeckCutting from './DeckCutting'
import { useGameContext } from '../context/GameContext'
import { isHeroPickRound } from '../game/draftSystem'

interface DraftViewProps {
  onStartGame?: () => void
}

export default function DraftView({ onStartGame }: DraftViewProps = {}) {
  const { draftState, getCurrentPack, makePick, makeFinalSelection, autoFillDefaults, autoDraft, autoBuildDecks, resetDraft } = useDraft()
  const { initializeGameFromDraft, initializeDraftGame } = useGameContext()
  const [selectedItem, setSelectedItem] = useState<DraftPoolItem | null>(null)
  const [showSelection, setShowSelection] = useState(false)
  const [isAutoDrafting, setIsAutoDrafting] = useState(false)

  const currentPack = getCurrentPack()
  const isPlayer1Turn = draftState.currentPicker === 'player1'
  const isHeroRound = isHeroPickRound(draftState.currentRound)
  const roundTotalPicks = isHeroRound ? 2 : 4

  const handleItemClick = (item: DraftPoolItem) => {
    // Allow selecting items for the current player's turn
    setSelectedItem(item)
  }

  const handlePick = () => {
    if (selectedItem) {
      makePick(selectedItem)
      setSelectedItem(null)
    }
  }

  const handleFinalSelection = (player: 'player1' | 'player2', selection: {
    heroes: any[]
    cards: any[]
    battlefield: any
  }) => {
    try {
      makeFinalSelection(player, selection)
      if (player === 'player2') {
        setShowSelection(false)
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Invalid selection')
    }
  }

  const handleAutoDraft = () => {
    if (draftState.isDraftComplete) {
      return
    }
    setIsAutoDrafting(true)
    // Use setTimeout to allow UI to update before running autodraft
    setTimeout(() => {
      autoDraft()
      setIsAutoDrafting(false)
    }, 10)
  }

  // Show selection phase if draft is complete
  if (draftState.isDraftComplete && !draftState.isSelectionComplete) {
    return (
      <DraftSelection
        draftState={draftState}
        onFinalSelection={handleFinalSelection}
        autoFillDefaults={autoFillDefaults}
      />
    )
  }

  // Show deck cutting phase if both players have made final selections
  const [cutDecks, setCutDecks] = useState<{ player1: any, player2: any } | null>(null)

  if (draftState.isSelectionComplete && !cutDecks) {
    const handleDeckCutting = (player1Cut: any, player2Cut: any) => {
      setCutDecks({ player1: player1Cut, player2: player2Cut })
    }

    if (draftState.player1Final && draftState.player2Final) {
      return (
        <DeckCutting
          player1Final={draftState.player1Final}
          player2Final={draftState.player2Final}
          onConfirm={handleDeckCutting}
        />
      )
    }
  }

  // Show completion screen if both players have made final selections and deck cutting is done
  if (draftState.isSelectionComplete && cutDecks) {
    const handleStartGame = () => {
      if (cutDecks.player1 && cutDecks.player2) {
        initializeGameFromDraft(cutDecks.player1, cutDecks.player2)
        if (onStartGame) {
          onStartGame()
        }
      }
    }

    const handleStartDraftGame = () => {
      // Use player1's draft selection (the human player)
      // Player2 will get the RW deck from "start random game"
      if (draftState.player1Final) {
        initializeDraftGame(draftState.player1Final)
        if (onStartGame) {
          onStartGame()
        }
      }
    }

    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Draft Complete!</h1>
        <p>Both players have made their final selections.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={handleStartGame}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Start PVP Game
          </button>
          <button
            onClick={handleStartDraftGame}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
            title="Start a game with your drafted deck vs the RW deck from 'Start Random Game'"
          >
            🎲 Start Draft Game
          </button>
          <button
            onClick={resetDraft}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Start New Draft
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1>Draft Phase</h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <strong>Round:</strong> {draftState.currentRound}
          </div>
          <div>
            <strong>Pick:</strong> {draftState.pickNumber}
          </div>
          <div>
            <strong>Round Picks Remaining:</strong> {draftState.roundPicksRemaining} / {roundTotalPicks}
          </div>
          <div style={{
            padding: '6px 12px',
            backgroundColor: isHeroRound ? '#9C27B0' : '#2196F3',
            color: 'white',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
          }}>
            {isHeroRound ? '🎯 Hero Pick Round' : '📦 Normal Pick Round'}
          </div>
          <div style={{
            padding: '8px 16px',
            backgroundColor: isPlayer1Turn ? '#4CAF50' : '#f44336',
            color: 'white',
            borderRadius: '4px',
            fontWeight: 'bold',
          }}>
            {isPlayer1Turn ? "Player 1's Turn" : "Player 2's Turn"}
            {draftState.picksRemainingThisTurn > 0 && (
              <span style={{ marginLeft: '8px', fontSize: '14px', opacity: 0.9 }}>
                ({draftState.picksRemainingThisTurn} pick{draftState.picksRemainingThisTurn !== 1 ? 's' : ''} remaining)
              </span>
            )}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            (You control both players)
          </div>
          {!draftState.isDraftComplete && (
            <button
              onClick={handleAutoDraft}
              disabled={isAutoDrafting}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                backgroundColor: isAutoDrafting ? '#ccc' : '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isAutoDrafting ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                marginLeft: 'auto',
              }}
              title="Automatically pick random cards for both players until draft is complete"
            >
              {isAutoDrafting ? 'Auto-drafting...' : '⚡ Auto-Draft'}
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Left: Current Pack */}
        <div>
          {currentPack && (
            <DraftPackComponent
              pack={currentPack}
              selectedItem={selectedItem}
              onItemClick={handleItemClick}
              isPlayer1Turn={isPlayer1Turn}
            />
          )}
          {selectedItem && (
            <button
              onClick={handlePick}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: isPlayer1Turn ? '#4CAF50' : '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Pick for {isPlayer1Turn ? 'Player 1' : 'Player 2'}
            </button>
          )}
        </div>

        {/* Right: Draft Picks */}
        <DraftPicks
          player1Drafted={draftState.player1Drafted}
          player2Drafted={draftState.player2Drafted}
        />
      </div>
    </div>
  )
}

