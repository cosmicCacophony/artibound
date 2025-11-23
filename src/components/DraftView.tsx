import React, { useState } from 'react'
import { useDraft } from '../hooks/useDraft'
import { DraftPoolItem, DraftPickType } from '../game/types'
import DraftPackComponent from './DraftPack'
import DraftPicks from './DraftPicks'
import DraftSelection from './DraftSelection'

export default function DraftView() {
  const { draftState, getCurrentPack, makePick, makeFinalSelection, autoFillDefaults, resetDraft } = useDraft()
  const [selectedItem, setSelectedItem] = useState<DraftPoolItem | null>(null)
  const [showSelection, setShowSelection] = useState(false)

  const currentPack = getCurrentPack()
  const isPlayer1Turn = draftState.currentPicker === 'player1'

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

  // Show completion screen if both players have made final selections
  if (draftState.isSelectionComplete) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Draft Complete!</h1>
        <p>Both players have made their final selections.</p>
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
            marginTop: '20px',
          }}
        >
          Start New Draft
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1>Draft Phase</h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div>
            <strong>Pack:</strong> {draftState.currentPack} / {draftState.packs.length}
          </div>
          <div>
            <strong>Pick:</strong> {draftState.pickNumber} / {draftState.packs.length * 7 * 2}
          </div>
          <div style={{
            padding: '8px 16px',
            backgroundColor: isPlayer1Turn ? '#4CAF50' : '#f44336',
            color: 'white',
            borderRadius: '4px',
            fontWeight: 'bold',
          }}>
            {isPlayer1Turn ? "Player 1's Turn" : "Player 2's Turn"}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            (You control both players)
          </div>
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

