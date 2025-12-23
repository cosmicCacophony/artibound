import React, { useState } from 'react'
import { FinalDraftSelection, BaseCard, Color } from '../game/types'

interface DeckCuttingProps {
  player1Final: FinalDraftSelection
  player2Final: FinalDraftSelection
  onConfirm: (player1Cut: FinalDraftSelection, player2Cut: FinalDraftSelection) => void
}

const COLOR_MAP: Record<Color, string> = {
  red: '#d32f2f',
  blue: '#1976d2',
  white: '#f5f5f5',
  black: '#424242',
  green: '#388e3c',
}

const COLOR_LIGHT_MAP: Record<Color, string> = {
  red: '#ffebee',
  blue: '#e3f2fd',
  white: '#ffffff',
  black: '#fafafa',
  green: '#e8f5e9',
}

export default function DeckCutting({ player1Final, player2Final, onConfirm }: DeckCuttingProps) {
  const [activePlayer, setActivePlayer] = useState<'player1' | 'player2'>('player1')
  const [player1CutCards, setPlayer1CutCards] = useState<Set<string>>(new Set())
  const [player2CutCards, setPlayer2CutCards] = useState<Set<string>>(new Set())

  const CARDS_TO_CUT = 8

  const currentFinal = activePlayer === 'player1' ? player1Final : player2Final
  const currentCutCards = activePlayer === 'player1' ? player1CutCards : player2CutCards
  const setCurrentCutCards = activePlayer === 'player1' ? setPlayer1CutCards : setPlayer2CutCards

  const toggleCard = (cardId: string) => {
    const newSet = new Set(currentCutCards)
    if (newSet.has(cardId)) {
      newSet.delete(cardId)
    } else {
      if (newSet.size < CARDS_TO_CUT) {
        newSet.add(cardId)
      }
    }
    setCurrentCutCards(newSet)
  }

  const handleConfirm = () => {
    if (activePlayer === 'player1') {
      // Switch to player 2
      setActivePlayer('player2')
    } else {
      // Both players done, create cut decks
      const player1Cut: FinalDraftSelection = {
        ...player1Final,
        cards: player1Final.cards.filter(c => !player1CutCards.has(c.id)),
      }
      const player2Cut: FinalDraftSelection = {
        ...player2Final,
        cards: player2Final.cards.filter(c => !player2CutCards.has(c.id)),
      }
      onConfirm(player1Cut, player2Cut)
    }
  }

  const getColorStyles = (colors?: Color[]) => {
    if (!colors || colors.length === 0) {
      return {
        borderColor: '#757575',
        backgroundColor: '#fafafa',
        borderWidth: '2px',
      }
    } else if (colors.length === 1) {
      const color = colors[0]
      return {
        borderColor: COLOR_MAP[color],
        backgroundColor: COLOR_LIGHT_MAP[color],
        borderWidth: '3px',
      }
    } else {
      const primaryColor = colors[0]
      return {
        borderColor: COLOR_MAP[primaryColor],
        backgroundColor: COLOR_LIGHT_MAP[primaryColor],
        background: colors.length === 2
          ? `linear-gradient(to right, ${COLOR_LIGHT_MAP[colors[0]]} 50%, ${COLOR_LIGHT_MAP[colors[1]]} 50%)`
          : `linear-gradient(135deg, ${colors.map((c, i) => {
              const percent = (i / colors.length) * 100
              return `${COLOR_LIGHT_MAP[c]} ${percent}%`
            }).join(', ')})`,
        borderWidth: '3px',
      }
    }
  }

  const canConfirm = currentCutCards.size === CARDS_TO_CUT

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>Deck Cutting Phase</h1>
      <p>Remove {CARDS_TO_CUT} cards from each player's deck before starting the game.</p>

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
          Player 1 {player1CutCards.size === CARDS_TO_CUT ? '✓' : `(${player1CutCards.size}/${CARDS_TO_CUT})`}
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
          Player 2 {player2CutCards.size === CARDS_TO_CUT ? '✓' : `(${player2CutCards.size}/${CARDS_TO_CUT})`}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
          {activePlayer === 'player1' ? 'Player 1' : 'Player 2'}: Select {CARDS_TO_CUT} cards to remove
        </div>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
          Cards selected: {currentCutCards.size} / {CARDS_TO_CUT}
        </div>
        <button
          onClick={handleConfirm}
          disabled={!canConfirm}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: canConfirm ? (activePlayer === 'player1' ? '#4CAF50' : '#f44336') : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: canConfirm ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
          }}
        >
          {activePlayer === 'player1' ? 'Confirm Player 1 Cuts' : 'Confirm Player 2 Cuts & Start Game'}
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '12px',
        maxHeight: '600px',
        overflowY: 'auto',
        border: '1px solid #ccc',
        padding: '16px',
        borderRadius: '4px',
      }}>
        {currentFinal.cards.map(card => {
          const cardColors = card.colors || []
          const colorStyles = getColorStyles(cardColors)
          const isSelected = currentCutCards.has(card.id)
          
          return (
            <div
              key={card.id}
              onClick={() => toggleCard(card.id)}
              style={{
                padding: '12px',
                border: isSelected ? '3px solid #f44336' : `${colorStyles.borderWidth} solid ${colorStyles.borderColor}`,
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#ffebee' : (cardColors.length === 1 ? COLOR_LIGHT_MAP[cardColors[0]] : colorStyles.backgroundColor),
                background: isSelected ? undefined : (cardColors.length > 1 ? colorStyles.background : undefined),
                boxShadow: isSelected ? '0 4px 12px rgba(244, 67, 54, 0.3)' : (cardColors.length > 0 ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'),
                transition: 'all 0.2s',
                opacity: isSelected ? 0.7 : 1,
              }}
            >
              {cardColors.length > 0 && (
                <div style={{ 
                  display: 'flex', 
                  height: '4px', 
                  marginBottom: '6px',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  {cardColors.map((color, idx) => (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        backgroundColor: COLOR_MAP[color],
                        borderRight: idx < cardColors.length - 1 ? '1px solid rgba(255,255,255,0.3)' : 'none',
                      }}
                    />
                  ))}
                </div>
              )}
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{card.name}</div>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>{card.description}</div>
              {card.manaCost && (
                <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
                  {card.manaCost} Mana
                </div>
              )}
              {isSelected && (
                <div style={{ 
                  marginTop: '8px', 
                  fontSize: '12px', 
                  color: '#f44336', 
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                  REMOVE
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}


