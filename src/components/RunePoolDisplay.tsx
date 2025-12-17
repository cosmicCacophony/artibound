import { RunePool, Color, Seal } from '../game/types'

interface RunePoolDisplayProps {
  runePool: RunePool
  seals?: Seal[]
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

export function RunePoolDisplay({ runePool, seals = [], playerName }: RunePoolDisplayProps) {
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
  
  const permanentCount = runePool.runes.length
  const temporaryCount = runePool.temporaryRunes?.length || 0
  const totalCount = permanentCount + temporaryCount

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
      
      {/* Permanent Runes */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '4px',
        marginBottom: temporaryCount > 0 ? '4px' : '8px',
      }}>
        {runePool.runes.map((rune, index) => {
          const color = colorDisplay[rune]
          
          return (
            <div
              key={`perm-${rune}-${index}`}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '4px',
                backgroundColor: color.bg,
                color: color.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 'bold',
                border: `2px solid ${color.bg}`,
                cursor: 'default',
              }}
              title={`${rune} rune (permanent)`}
            >
              {colorAbbreviation[rune]}
            </div>
          )
        })}
      </div>

      {/* Temporary Runes (with glow effect) */}
      {temporaryCount > 0 && (
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '4px',
          marginBottom: '8px',
        }}>
          {runePool.temporaryRunes!.map((rune, index) => {
            const color = colorDisplay[rune]
            
            return (
              <div
                key={`temp-${rune}-${index}`}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  backgroundColor: color.bg,
                  color: color.text,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  border: `2px dashed #ffd700`, // Gold dashed border for temporary
                  cursor: 'default',
                  boxShadow: '0 0 6px #ffd700', // Glow effect
                }}
                title={`${rune} rune (temporary - ends this turn)`}
              >
                {colorAbbreviation[rune]}
              </div>
            )
          })}
          <span style={{ 
            fontSize: '10px', 
            color: '#ffd700', 
            alignSelf: 'center',
            marginLeft: '4px',
          }}>
            temp
          </span>
        </div>
      )}

      {/* Seals */}
      {seals.length > 0 && (
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '4px',
          marginBottom: '8px',
          paddingTop: '4px',
          borderTop: '1px solid #333',
        }}>
          <span style={{ fontSize: '10px', color: '#999', marginRight: '4px', alignSelf: 'center' }}>
            Seals:
          </span>
          {seals.map((seal, index) => {
            const color = colorDisplay[seal.color]
            
            return (
              <div
                key={`seal-${seal.id}-${index}`}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%', // Circle for seals
                  backgroundColor: color.bg,
                  color: color.text,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  border: `2px solid #666`,
                  cursor: 'default',
                }}
                title={`${seal.name} - generates ${colorAbbreviation[seal.color]} each turn`}
              >
                {colorAbbreviation[seal.color]}
              </div>
            )
          })}
        </div>
      )}
      
      <div style={{ 
        fontSize: '11px', 
        color: '#999',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>Total: {totalCount} runes</span>
        {temporaryCount > 0 && (
          <span style={{ color: '#ffd700' }}>({temporaryCount} temp)</span>
        )}
      </div>
    </div>
  )
}
