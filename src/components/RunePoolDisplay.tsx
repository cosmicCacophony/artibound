import { RunePool, Color } from '../game/types'

interface RunePoolDisplayProps {
  runePool: RunePool
  playerName?: string
}

const colorAbbreviation: Record<Color, string> = {
  red: 'R',
  white: 'W',
  blue: 'U',
  black: 'B',
  green: 'G',
}

const colorDisplay: Record<Color, { bg: string; text: string }> = {
  red: { bg: '#ef4444', text: '#ffffff' },
  white: { bg: '#f3f4f6', text: '#000000' },
  blue: { bg: '#3b82f6', text: '#ffffff' },
  black: { bg: '#1f2937', text: '#ffffff' },
  green: { bg: '#10b981', text: '#ffffff' },
}

export function RunePoolDisplay({ runePool, playerName }: RunePoolDisplayProps) {
  // Safety check: if runePool is undefined, show empty state
  if (!runePool || !runePool.runes) {
    return (
      <div style={{ 
        padding: '8px', 
        backgroundColor: '#1a1a1a', 
        borderRadius: '8px',
        border: '1px solid #333',
        minWidth: '200px',
      }}>
        {playerName && (
          <div style={{ 
            fontSize: '12px', 
            color: '#999', 
            marginBottom: '8px',
            fontWeight: 'bold',
          }}>
            {playerName} Runes
          </div>
        )}
        <div style={{ fontSize: '11px', color: '#999' }}>
          No runes available
        </div>
      </div>
    )
  }
  
  const availableCount = runePool.runes.length

  return (
    <div style={{ 
      padding: '8px', 
      backgroundColor: '#1a1a1a', 
      borderRadius: '8px',
      border: '1px solid #333',
      minWidth: '200px',
    }}>
      {playerName && (
        <div style={{ 
          fontSize: '12px', 
          color: '#999', 
          marginBottom: '8px',
          fontWeight: 'bold',
        }}>
          {playerName} Runes
        </div>
      )}
      
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '4px',
        marginBottom: '8px',
      }}>
        {runePool.runes.map((rune, index) => {
          const color = colorDisplay[rune]
          
          return (
            <div
              key={`${rune}-${index}`}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                backgroundColor: color.bg,
                color: color.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                border: `2px solid ${color.bg}`,
                cursor: 'default',
              }}
              title={`${rune} rune`}
            >
              {colorAbbreviation[rune]}
            </div>
          )
        })}
      </div>
      
      <div style={{ 
        fontSize: '11px', 
        color: '#999',
      }}>
        Total: {availableCount} runes
      </div>
    </div>
  )
}

