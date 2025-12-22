import { RunePool, Color, Seal, PlayerId } from '../game/types'
import { useGameContext } from '../context/GameContext'

interface RunePoolDisplayProps {
  runePool: RunePool
  seals?: Seal[]
  playerName?: string
  player: PlayerId
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

export function RunePoolDisplay({ runePool, seals = [], playerName, player }: RunePoolDisplayProps) {
  const { setGameState } = useGameContext()
  
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
  
  // Count runes by color
  const permanentRunesByColor: Record<Color, number> = {
    red: 0,
    white: 0,
    blue: 0,
    black: 0,
    green: 0,
  }
  
  runePool.runes.forEach(rune => {
    permanentRunesByColor[rune] = (permanentRunesByColor[rune] || 0) + 1
  })
  
  const temporaryRunesByColor: Record<Color, number> = {
    red: 0,
    white: 0,
    blue: 0,
    black: 0,
    green: 0,
  }
  
  if (runePool.temporaryRunes) {
    runePool.temporaryRunes.forEach(rune => {
      temporaryRunesByColor[rune] = (temporaryRunesByColor[rune] || 0) + 1
    })
  }
  
  const allColors: Color[] = ['red', 'white', 'blue', 'black', 'green']
  
  const handleAdjustRune = (color: Color, amount: number, isTemporary: boolean) => {
    setGameState(prev => {
      const runePoolKey = `${player}RunePool` as keyof typeof prev.metadata
      const currentPool = prev.metadata[runePoolKey] as RunePool
      
      if (isTemporary) {
        const tempRunes = [...(currentPool.temporaryRunes || [])]
        if (amount > 0) {
          // Add runes
          for (let i = 0; i < amount; i++) {
            tempRunes.push(color)
          }
        } else {
          // Remove runes
          for (let i = 0; i < Math.abs(amount); i++) {
            const index = tempRunes.indexOf(color)
            if (index !== -1) {
              tempRunes.splice(index, 1)
            }
          }
        }
        return {
          ...prev,
          metadata: {
            ...prev.metadata,
            [runePoolKey]: {
              ...currentPool,
              temporaryRunes: tempRunes,
            },
          },
        }
      } else {
        const permanentRunes = [...currentPool.runes]
        if (amount > 0) {
          // Add runes
          for (let i = 0; i < amount; i++) {
            permanentRunes.push(color)
          }
        } else {
          // Remove runes
          for (let i = 0; i < Math.abs(amount); i++) {
            const index = permanentRunes.indexOf(color)
            if (index !== -1) {
              permanentRunes.splice(index, 1)
            }
          }
        }
        return {
          ...prev,
          metadata: {
            ...prev.metadata,
            [runePoolKey]: {
              ...currentPool,
              runes: permanentRunes,
            },
          },
        }
      }
    })
  }

  const totalCount = runePool.runes.length + (runePool.temporaryRunes?.length || 0)

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
      
      {/* Permanent Runes by Color */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '4px',
        marginBottom: (runePool.temporaryRunes?.length || 0) > 0 ? '8px' : '8px',
      }}>
        {allColors.map(color => {
          const count = permanentRunesByColor[color]
          if (count === 0 && temporaryRunesByColor[color] === 0) return null
          
          const colorStyle = colorDisplay[color]
          const tempCount = temporaryRunesByColor[color]
          
          return (
            <div key={color} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {/* Color Symbol with Count */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  backgroundColor: colorStyle.bg,
                  color: colorStyle.text,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  border: `2px solid ${colorStyle.bg}`,
                  position: 'relative',
                }}
                title={`${color} rune${count > 0 ? ' (permanent)' : ''}${tempCount > 0 ? ' + temporary' : ''}`}
              >
                {colorAbbreviation[color]}
                {count > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    backgroundColor: '#333',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    border: '1px solid #666',
                  }}>
                    {count}
                  </span>
                )}
              </div>
              
              {/* Temporary indicator if any */}
              {tempCount > 0 && (
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    backgroundColor: colorStyle.bg,
                    color: colorStyle.text,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    border: `2px dashed #ffd700`,
                    boxShadow: '0 0 4px #ffd700',
                    position: 'relative',
                  }}
                  title={`${tempCount} temporary ${color} rune(s)`}
                >
                  {colorAbbreviation[color]}
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    backgroundColor: '#ffd700',
                    color: '#000',
                    borderRadius: '50%',
                    width: '14px',
                    height: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9px',
                    border: '1px solid #333',
                  }}>
                    {tempCount}
                  </span>
                </div>
              )}
              
              {/* Adjustment Buttons */}
              <div style={{ display: 'flex', gap: '2px', marginLeft: 'auto' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAdjustRune(color, -1, false)
                  }}
                  style={{
                    padding: '2px 6px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '10px',
                    fontWeight: 'bold',
                  }}
                  title={`Remove 1 permanent ${color} rune`}
                >
                  -
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAdjustRune(color, 1, false)
                  }}
                  style={{
                    padding: '2px 6px',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '10px',
                    fontWeight: 'bold',
                  }}
                  title={`Add 1 permanent ${color} rune`}
                >
                  +
                </button>
              </div>
            </div>
          )
        })}
      </div>

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
        {(runePool.temporaryRunes?.length || 0) > 0 && (
          <span style={{ color: '#ffd700' }}>({runePool.temporaryRunes!.length} temp)</span>
        )}
      </div>
    </div>
  )
}
