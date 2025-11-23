import React, { useState } from 'react'
import { DraftState, Hero, BaseCard, BattlefieldDefinition, HEROES_REQUIRED, CARDS_REQUIRED } from '../game/types'

interface DraftSelectionProps {
  draftState: DraftState
  onFinalSelection: (player: 'player1' | 'player2', selection: {
    heroes: Hero[]
    cards: BaseCard[]
    battlefield: BattlefieldDefinition
  }) => void
  autoFillDefaults: (player: 'player1' | 'player2') => {
    heroes: Hero[]
    cards: BaseCard[]
    battlefield: BattlefieldDefinition
  }
}

export default function DraftSelection({ draftState, onFinalSelection, autoFillDefaults }: DraftSelectionProps) {
  const [activePlayer, setActivePlayer] = useState<'player1' | 'player2'>('player1')
  const [player1Selection, setPlayer1Selection] = useState<{
    heroes: Set<string>
    cards: Set<string>
    battlefield: string | null
  }>({
    heroes: new Set(),
    cards: new Set(),
    battlefield: null,
  })
  const [player2Selection, setPlayer2Selection] = useState<{
    heroes: Set<string>
    cards: Set<string>
    battlefield: string | null
  }>({
    heroes: new Set(),
    cards: new Set(),
    battlefield: null,
  })

  const player1Drafted = draftState.player1Drafted
  const player2Drafted = draftState.player2Drafted
  const currentDrafted = activePlayer === 'player1' ? player1Drafted : player2Drafted
  const currentSelection = activePlayer === 'player1' ? player1Selection : player2Selection
  const setCurrentSelection = activePlayer === 'player1' ? setPlayer1Selection : setPlayer2Selection

  const toggleHero = (heroId: string) => {
    const newSet = new Set(currentSelection.heroes)
    if (newSet.has(heroId)) {
      newSet.delete(heroId)
    } else {
      if (newSet.size < HEROES_REQUIRED) {
        newSet.add(heroId)
      }
    }
    setCurrentSelection({ ...currentSelection, heroes: newSet })
  }

  const toggleCard = (cardId: string) => {
    const newSet = new Set(currentSelection.cards)
    if (newSet.has(cardId)) {
      newSet.delete(cardId)
    } else {
      if (newSet.size < CARDS_REQUIRED) {
        newSet.add(cardId)
      }
    }
    setCurrentSelection({ ...currentSelection, cards: newSet })
  }

  const selectBattlefield = (battlefieldId: string) => {
    setCurrentSelection({ ...currentSelection, battlefield: battlefieldId })
  }

  const handleConfirm = (player: 'player1' | 'player2') => {
    const selection = player === 'player1' ? player1Selection : player2Selection
    const drafted = player === 'player1' ? player1Drafted : player2Drafted
    
    const selectedHeroes = drafted.heroes.filter(h => selection.heroes.has(h.id))
    const selectedCards = drafted.cards.filter(c => selection.cards.has(c.id))
    const selectedBattlefield = drafted.battlefields.find(b => b.id === selection.battlefield)

    if (selectedHeroes.length !== HEROES_REQUIRED) {
      alert(`Please select exactly ${HEROES_REQUIRED} heroes`)
      return
    }
    if (selectedCards.length !== CARDS_REQUIRED) {
      alert(`Please select exactly ${CARDS_REQUIRED} cards`)
      return
    }
    if (!selectedBattlefield) {
      alert('Please select a battlefield')
      return
    }

    onFinalSelection(player, {
      heroes: selectedHeroes,
      cards: selectedCards,
      battlefield: selectedBattlefield,
    })
  }

  const handleAutoFill = (player: 'player1' | 'player2') => {
    const autoFilled = autoFillDefaults(player)
    if (player === 'player1') {
      setPlayer1Selection({
        heroes: new Set(autoFilled.heroes.map(h => h.id)),
        cards: new Set(autoFilled.cards.map(c => c.id)),
        battlefield: autoFilled.battlefield.id,
      })
    } else {
      setPlayer2Selection({
        heroes: new Set(autoFilled.heroes.map(h => h.id)),
        cards: new Set(autoFilled.cards.map(c => c.id)),
        battlefield: autoFilled.battlefield.id,
      })
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>Final Selection Phase</h1>
      <p>Choose final decks for both players: {HEROES_REQUIRED} heroes, {CARDS_REQUIRED} cards, 1 battlefield each</p>

      {/* Player Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '2px solid #ccc' }}>
        <button
          onClick={() => setActivePlayer('player1')}
          style={{
            padding: '12px 24px',
            backgroundColor: activePlayer === 'player1' ? '#4CAF50' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Player 1 {draftState.player1Final ? '✓' : ''}
        </button>
        <button
          onClick={() => setActivePlayer('player2')}
          style={{
            padding: '12px 24px',
            backgroundColor: activePlayer === 'player2' ? '#f44336' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Player 2 {draftState.player2Final ? '✓' : ''}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => handleAutoFill(activePlayer)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '12px',
          }}
        >
          Auto-Fill Defaults for {activePlayer === 'player1' ? 'Player 1' : 'Player 2'}
        </button>
        <button
          onClick={() => handleConfirm(activePlayer)}
          disabled={activePlayer === 'player1' ? draftState.player1Final !== null : draftState.player2Final !== null}
          style={{
            padding: '8px 16px',
            backgroundColor: (activePlayer === 'player1' ? draftState.player1Final : draftState.player2Final) ? '#ccc' : (activePlayer === 'player1' ? '#4CAF50' : '#f44336'),
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (activePlayer === 'player1' ? draftState.player1Final : draftState.player2Final) ? 'not-allowed' : 'pointer',
          }}
        >
          {(activePlayer === 'player1' ? draftState.player1Final : draftState.player2Final) ? 'Selection Confirmed' : `Confirm ${activePlayer === 'player1' ? 'Player 1' : 'Player 2'} Selection`}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {/* Heroes */}
        <div>
          <h3>Heroes ({currentSelection.heroes.size} / {HEROES_REQUIRED})</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '12px', borderRadius: '4px' }}>
            {currentDrafted.heroes.map(hero => (
              <div
                key={hero.id}
                onClick={() => toggleHero(hero.id)}
                style={{
                  padding: '8px',
                  marginBottom: '8px',
                  border: currentSelection.heroes.has(hero.id) ? '2px solid #4CAF50' : '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: currentSelection.heroes.has(hero.id) ? '#E8F5E9' : '#fff',
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{hero.name}</div>
                <div style={{ fontSize: '12px' }}>{hero.description}</div>
              </div>
            ))}
            {currentDrafted.heroes.length === 0 && (
              <div style={{ color: '#999', fontStyle: 'italic' }}>No heroes drafted</div>
            )}
          </div>
        </div>

        {/* Cards */}
        <div>
          <h3>Cards ({currentSelection.cards.size} / {CARDS_REQUIRED})</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '12px', borderRadius: '4px' }}>
            {currentDrafted.cards.map(card => (
              <div
                key={card.id}
                onClick={() => toggleCard(card.id)}
                style={{
                  padding: '8px',
                  marginBottom: '8px',
                  border: currentSelection.cards.has(card.id) ? '2px solid #2196F3' : '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: currentSelection.cards.has(card.id) ? '#E3F2FD' : '#fff',
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{card.name}</div>
                <div style={{ fontSize: '12px' }}>{card.description}</div>
                {card.manaCost && (
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                    {card.manaCost} Mana
                  </div>
                )}
              </div>
            ))}
            {currentDrafted.cards.length === 0 && (
              <div style={{ color: '#999', fontStyle: 'italic' }}>No cards drafted</div>
            )}
          </div>
        </div>

        {/* Battlefields */}
        <div>
          <h3>Battlefield</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '12px', borderRadius: '4px' }}>
            {currentDrafted.battlefields.map(battlefield => (
              <div
                key={battlefield.id}
                onClick={() => selectBattlefield(battlefield.id)}
                style={{
                  padding: '8px',
                  marginBottom: '8px',
                  border: currentSelection.battlefield === battlefield.id ? '2px solid #9C27B0' : '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: currentSelection.battlefield === battlefield.id ? '#F3E5F5' : '#fff',
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#9C27B0' }}>{battlefield.name}</div>
                <div style={{ fontSize: '12px' }}>{battlefield.description}</div>
                <div style={{ fontSize: '11px', fontStyle: 'italic', marginTop: '4px' }}>
                  {battlefield.staticAbility}
                </div>
              </div>
            ))}
            {currentDrafted.battlefields.length === 0 && (
              <div style={{ color: '#999', fontStyle: 'italic' }}>No battlefields drafted</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

