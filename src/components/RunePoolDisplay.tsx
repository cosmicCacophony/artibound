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

  const handleAddRune = (color: Color) => {
    handleAdjustRune(color, 1, false)
  }

  const handleRemoveRune = (color: Color, isTemporary: boolean) => {
    handleAdjustRune(color, -1, isTemporary)
  }

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
      
      {/* Color Symbols Row - Always show all 5 colors */}
      <div style={{ 
        display: 'flex', 
        gap: '4px',
        marginBottom: '8px',
        flexWrap: 'wrap',
      }}>
        {allColors.map(color => {
          const colorStyle = colorDisplay[color]
          const count = permanentRunesByColor[color]
          const tempCount = temporaryRunesByColor[color]
          const totalCount = count + tempCount
          
          return (
            <div
              key={color}
              onClick={(e) => {
                e.stopPropagation()
                handleAddRune(color)
              }}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '4px',
                backgroundColor: colorStyle.bg,
                color: colorStyle.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                border: `2px solid ${colorStyle.bg}`,
                cursor: 'pointer',
                transition: 'transform 0.1s',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
              title={`Click to add ${color} rune${totalCount > 0 ? ` (you have ${totalCount})` : ''}`}
            >
              {colorAbbreviation[color]}
              {totalCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
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
                  {totalCount}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Existing Runes - Clickable to remove */}
      {(runePool.runes.length > 0 || (runePool.temporaryRunes?.length || 0) > 0) && (
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '4px',
          marginBottom: '8px',
          paddingTop: '8px',
          borderTop: '1px solid #333',
        }}>
          {/* Permanent Runes */}
          {runePool.runes.map((rune, index) => {
            const colorStyle = colorDisplay[rune]
            return (
              <div
                key={`permanent-${rune}-${index}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveRune(rune, false)
                }}
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
                  cursor: 'pointer',
                  transition: 'transform 0.1s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)'
                  e.currentTarget.style.opacity = '0.8'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.opacity = '1'
                }}
                title={`Click to remove ${rune} rune`}
              >
                {colorAbbreviation[rune]}
              </div>
            )
          })}
          
          {/* Temporary Runes */}
          {runePool.temporaryRunes?.map((rune, index) => {
            const colorStyle = colorDisplay[rune]
            return (
              <div
                key={`temp-${rune}-${index}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveRune(rune, true)
                }}
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
                  border: `2px dashed #ffd700`,
                  boxShadow: '0 0 4px #ffd700',
                  cursor: 'pointer',
                  transition: 'transform 0.1s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)'
                  e.currentTarget.style.opacity = '0.8'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.opacity = '1'
                }}
                title={`Click to remove temporary ${rune} rune`}
              >
                {colorAbbreviation[rune]}
              </div>
            )
          })}
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
        {(runePool.temporaryRunes?.length || 0) > 0 && (
          <span style={{ color: '#ffd700' }}>({runePool.temporaryRunes!.length} temp)</span>
        )}
      </div>
    </div>
  )
}
