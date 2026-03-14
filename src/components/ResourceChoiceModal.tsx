import { useMemo, useState } from 'react'
import { Card, Color, Hero, PlayerId, RuneColor } from '../game/types'
import { useGameContext } from '../context/GameContext'

interface ResourceChoiceModalProps {
  player: PlayerId
  onComplete: () => void
}

type PrimaryChoice = { type: 'mana' } | { type: 'rune'; color: RuneColor }

const colorDisplay: Record<Color, { bg: string; text: string; label: string }> = {
  red: { bg: '#ef4444', text: '#ffffff', label: 'R' },
  white: { bg: '#f3f4f6', text: '#111827', label: 'W' },
  blue: { bg: '#3b82f6', text: '#ffffff', label: 'U' },
  black: { bg: '#111827', text: '#ffffff', label: 'B' },
  green: { bg: '#10b981', text: '#ffffff', label: 'G' },
}

function getHeroColors(cards: Card[]): Color[] {
  const colors = new Set<Color>()
  cards.forEach(card => {
    if (card.cardType === 'hero') {
      ;(card as Hero).colors.forEach(color => colors.add(color))
    }
  })
  return Array.from(colors)
}

export function ResourceChoiceModal({ player, onComplete }: ResourceChoiceModalProps) {
  const { gameState, setGameState } = useGameContext()
  const [primaryChoice, setPrimaryChoice] = useState<PrimaryChoice | null>(null)

  const availableColors = useMemo(() => {
    const colors = new Set<Color>()
    getHeroColors(gameState.battlefieldA[player]).forEach(color => colors.add(color))
    getHeroColors(player === 'player1' ? gameState.player1DeployZone : gameState.player2DeployZone).forEach(color => colors.add(color))
    return Array.from(colors)
  }, [gameState.battlefieldA, gameState.player1DeployZone, gameState.player2DeployZone, player])

  const commandersInPlay = gameState.battlefieldA[player].filter(card => card.cardType === 'hero').length
  const maxManaKey = player === 'player1' ? 'player1MaxMana' : 'player2MaxMana'
  const manaKey = player === 'player1' ? 'player1Mana' : 'player2Mana'
  const currentMaxMana = gameState.metadata[maxManaKey]
  const canConfirm = primaryChoice !== null
  const runeChoiceRequiresSacrifice = primaryChoice?.type === 'rune' && commandersInPlay === 0

  const handleConfirm = () => {
    if (!canConfirm || !primaryChoice) return

    setGameState(prev => {
      const currentMana = prev.metadata[manaKey] as number
      const currentMax = prev.metadata[maxManaKey] as number
      const nextRunes = {
        ...(prev.metadata.laneRunes || {
          battlefieldA: { player1: [] as RuneColor[], player2: [] as RuneColor[] },
          battlefieldB: { player1: [] as RuneColor[], player2: [] as RuneColor[] },
        }),
      }

      let nextMana = currentMana
      let nextMaxMana = currentMax

      if (primaryChoice.type === 'mana') {
        nextMana += 1
        nextMaxMana += 1
      } else {
        nextRunes.battlefieldA[player] = [...nextRunes.battlefieldA[player], primaryChoice.color]
        if ((prev.battlefieldA[player].filter(card => card.cardType === 'hero').length) === 0) {
          nextMaxMana = Math.max(0, currentMax - 1)
          nextMana = Math.min(currentMana, nextMaxMana)
        }
      }

      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          [manaKey]: nextMana,
          [maxManaKey]: nextMaxMana,
          laneRunes: nextRunes,
          resourceChoicesMade: {
            ...(prev.metadata.resourceChoicesMade || { player1: false, player2: false }),
            [player]: true,
          },
          currentPhase: 'play',
          actionPlayer: player,
        },
      }
    })

    onComplete()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ width: 'min(560px, 92vw)', backgroundColor: '#1f2937', color: '#fff', borderRadius: '14px', padding: '24px', border: '1px solid #374151' }}>
        <h2 style={{ marginTop: 0, marginBottom: '8px' }}>Resource Choice</h2>
        <p style={{ marginTop: 0, marginBottom: '16px', color: '#cbd5e1', lineHeight: 1.5 }}>
          Choose either mana growth or a rune. If you do not control a commander yet, taking a rune permanently sacrifices one mana crystal.
        </p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setPrimaryChoice({ type: 'mana' })}
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              border: primaryChoice?.type === 'mana' ? '2px solid #93c5fd' : '1px solid #4b5563',
              backgroundColor: primaryChoice?.type === 'mana' ? '#1d4ed8' : '#111827',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            +1 Mana
          </button>
          {availableColors.map(color => {
            const display = colorDisplay[color]
            const selected = primaryChoice?.type === 'rune' && primaryChoice.color === color
            return (
              <button
                key={color}
                onClick={() => setPrimaryChoice({ type: 'rune', color })}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  border: selected ? '3px solid #fde68a' : '1px solid transparent',
                  backgroundColor: display.bg,
                  color: display.text,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
                title={`Add a ${color} rune`}
              >
                {display.label}
              </button>
            )
          })}
        </div>

        <div style={{ marginBottom: '18px', padding: '12px', borderRadius: '10px', backgroundColor: '#111827', border: '1px solid #374151', fontSize: '13px', color: '#cbd5e1' }}>
          <div>Commander colors: {availableColors.map(color => colorDisplay[color].label).join(' / ') || 'None'}</div>
          <div style={{ marginTop: '6px' }}>Commanders in play: {commandersInPlay}</div>
          {runeChoiceRequiresSacrifice && (
            <div style={{ marginTop: '6px', color: '#fde68a' }}>
              Warning: this rune choice will reduce your max mana from {currentMaxMana} to {Math.max(0, currentMaxMana - 1)}.
            </div>
          )}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!canConfirm}
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: canConfirm ? '#e11d48' : '#4b5563',
            color: '#fff',
            cursor: canConfirm ? 'pointer' : 'not-allowed',
            fontWeight: 700,
          }}
        >
          Confirm Choice
        </button>
      </div>
    </div>
  )
}
