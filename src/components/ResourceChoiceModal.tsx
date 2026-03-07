import { useState } from 'react'
import { PlayerId, RuneColor, Color, Hero, Card } from '../game/types'
import { useGameContext } from '../context/GameContext'

interface ResourceChoiceModalProps {
  player: PlayerId
  onComplete: () => void
}

const colorDisplay: Record<Color, { bg: string; text: string }> = {
  red: { bg: '#ef4444', text: '#ffffff' },
  white: { bg: '#f3f4f6', text: '#000000' },
  blue: { bg: '#3b82f6', text: '#ffffff' },
  black: { bg: '#1f2937', text: '#ffffff' },
  green: { bg: '#10b981', text: '#ffffff' },
}

const colorAbbreviation: Record<Color, string> = {
  red: 'R',
  white: 'W',
  blue: 'U',
  black: 'B',
  green: 'G',
}

type LaneChoice = { type: 'mana' } | { type: 'rune', color: RuneColor }

function getHeroColorsInLane(
  gameState: { battlefieldA: { player1: Card[], player2: Card[] }, battlefieldB: { player1: Card[], player2: Card[] } },
  battlefield: 'battlefieldA' | 'battlefieldB',
  player: PlayerId
): Color[] {
  const units = gameState[battlefield][player]
  const colors = new Set<Color>()
  for (const card of units) {
    if (card.cardType === 'hero') {
      const hero = card as Hero
      for (const c of hero.colors) {
        colors.add(c)
      }
    }
  }
  return Array.from(colors)
}

export function ResourceChoiceModal({ player, onComplete }: ResourceChoiceModalProps) {
  const { gameState, setGameState } = useGameContext()
  const [laneAChoice, setLaneAChoice] = useState<LaneChoice | null>(null)
  const [laneBChoice, setLaneBChoice] = useState<LaneChoice | null>(null)

  const laneAColors = getHeroColorsInLane(gameState, 'battlefieldA', player)
  const laneBColors = getHeroColorsInLane(gameState, 'battlefieldB', player)

  const allColors: Color[] = ['red', 'black', 'green', 'white', 'blue']

  const handleConfirm = () => {
    if (!laneAChoice || !laneBChoice) return

    setGameState(prev => {
      const manaKey = player === 'player1' ? 'player1Mana' : 'player2Mana'
      const maxManaKey = player === 'player1' ? 'player1MaxMana' : 'player2MaxMana'
      let manaGain = 0
      const newLaneRunes = prev.metadata.laneRunes ? { ...prev.metadata.laneRunes } : {
        battlefieldA: { player1: [] as RuneColor[], player2: [] as RuneColor[] },
        battlefieldB: { player1: [] as RuneColor[], player2: [] as RuneColor[] },
      }

      // Deep clone the lane runes
      newLaneRunes.battlefieldA = { ...newLaneRunes.battlefieldA }
      newLaneRunes.battlefieldB = { ...newLaneRunes.battlefieldB }
      newLaneRunes.battlefieldA[player] = [...newLaneRunes.battlefieldA[player]]
      newLaneRunes.battlefieldB[player] = [...newLaneRunes.battlefieldB[player]]

      if (laneAChoice.type === 'mana') {
        manaGain++
      } else {
        newLaneRunes.battlefieldA[player].push(laneAChoice.color)
      }

      if (laneBChoice.type === 'mana') {
        manaGain++
      } else {
        newLaneRunes.battlefieldB[player].push(laneBChoice.color)
      }

      const newResourceChoices = { ...(prev.metadata.resourceChoicesMade || { player1: false, player2: false }) }
      newResourceChoices[player] = true

      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          [manaKey]: (prev.metadata[manaKey] as number) + manaGain,
          [maxManaKey]: (prev.metadata[maxManaKey] as number) + manaGain,
          laneRunes: newLaneRunes,
          resourceChoicesMade: newResourceChoices,
        },
      }
    })

    onComplete()
  }

  const playerLabel = player === 'player1' ? 'Player 1 (BR)' : 'Player 2 (GWu)'

  const renderLaneChoice = (
    label: string,
    choice: LaneChoice | null,
    setChoice: (c: LaneChoice) => void,
    heroColors: Color[]
  ) => {
    const availableColors = heroColors.length > 0 ? heroColors : allColors

    return (
      <div style={{
        border: '1px solid #444',
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: '#1e1e1e',
        minWidth: '220px',
      }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ccc', marginBottom: '8px' }}>
          {label}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
          <button
            onClick={() => setChoice({ type: 'mana' })}
            style={{
              padding: '8px 12px',
              backgroundColor: choice?.type === 'mana' ? '#4CAF50' : '#333',
              color: 'white',
              border: choice?.type === 'mana' ? '2px solid #81C784' : '1px solid #555',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: choice?.type === 'mana' ? 'bold' : 'normal',
              fontSize: '13px',
            }}
          >
            +1 Mana
          </button>
          <div style={{ fontSize: '11px', color: '#888', textAlign: 'center' }}>or add a rune:</div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {availableColors.map(color => {
              const style = colorDisplay[color]
              const isSelected = choice?.type === 'rune' && choice.color === color
              return (
                <button
                  key={color}
                  onClick={() => setChoice({ type: 'rune', color })}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    backgroundColor: style.bg,
                    color: style.text,
                    border: isSelected ? '3px solid #ffd700' : '2px solid transparent',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    boxShadow: isSelected ? '0 0 8px #ffd700' : 'none',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.15s',
                  }}
                  title={`Add ${color} rune to this lane`}
                >
                  {colorAbbreviation[color]}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#2a2a2a',
        borderRadius: '12px',
        padding: '24px',
        border: '2px solid #555',
        maxWidth: '550px',
        width: '90%',
      }}>
        <h2 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '18px' }}>
          Resource Choices — {playerLabel}
        </h2>
        <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 16px 0' }}>
          Make two independent choices (one per lane). Each: +1 mana OR +1 permanent rune.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {renderLaneChoice('Lane A', laneAChoice, setLaneAChoice, laneAColors)}
          {renderLaneChoice('Lane B', laneBChoice, setLaneBChoice, laneBColors)}
        </div>
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button
            onClick={handleConfirm}
            disabled={!laneAChoice || !laneBChoice}
            style={{
              padding: '10px 32px',
              backgroundColor: laneAChoice && laneBChoice ? '#E91E63' : '#555',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: laneAChoice && laneBChoice ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Confirm Choices
          </button>
        </div>
      </div>
    </div>
  )
}
