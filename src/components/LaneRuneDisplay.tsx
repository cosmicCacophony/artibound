import { RuneColor, Color } from '../game/types'

interface LaneRuneDisplayProps {
  laneRunes: RuneColor[]
  laneName: string
}

const colorDisplay: Record<Color, { bg: string; text: string; emoji: string }> = {
  red: { bg: '#ef4444', text: '#ffffff', emoji: '🔴' },
  white: { bg: '#f3f4f6', text: '#000000', emoji: '⚪' },
  blue: { bg: '#3b82f6', text: '#ffffff', emoji: '🔵' },
  black: { bg: '#1f2937', text: '#ffffff', emoji: '⚫' },
  green: { bg: '#10b981', text: '#ffffff', emoji: '🟢' },
}

const colorAbbreviation: Record<Color, string> = {
  red: 'R',
  white: 'W',
  blue: 'U',
  black: 'B',
  green: 'G',
}

export function LaneRuneDisplay({ laneRunes, laneName }: LaneRuneDisplayProps) {
  if (laneRunes.length === 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '11px',
        color: '#666',
      }}>
        <span>{laneName}:</span>
        <span style={{ fontStyle: 'italic' }}>no runes</span>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    }}>
      <span style={{ fontSize: '11px', color: '#999', marginRight: '2px' }}>{laneName}:</span>
      {laneRunes.map((rune, index) => {
        const style = colorDisplay[rune]
        return (
          <div
            key={`${rune}-${index}`}
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              backgroundColor: style.bg,
              color: style.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 'bold',
              border: '1px solid rgba(255,255,255,0.3)',
              cursor: 'default',
            }}
            title={`${rune} rune (permanent)`}
          >
            {colorAbbreviation[rune]}
          </div>
        )
      })}
    </div>
  )
}
