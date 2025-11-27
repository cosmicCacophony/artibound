import { BaseCard, Color } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { useCardLibrary } from '../hooks/useCardLibrary'

interface CardLibrarySidebarProps {
  player: 'player1' | 'player2'
  cards: BaseCard[]
  setCards: React.Dispatch<React.SetStateAction<BaseCard[]>>
}

export function CardLibrarySidebar({ player, cards, setCards }: CardLibrarySidebarProps) {
  const { getAvailableSlots } = useGameContext()
  const { handleAddToHand } = useCardLibrary()
  
  const playerColor = player === 'player1' ? '#f44336' : '#2196f3'
  const playerBgColor = player === 'player1' ? '#ffebee' : '#e3f2fd'
  const playerName = player === 'player1' ? 'Warrior' : 'Mage'
  
  const getCardColorStyles = (colors?: Color[]) => {
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
    
    if (!colors || colors.length === 0) {
      return {
        borderColor: '#757575',
        backgroundColor: '#fafafa',
      }
    } else if (colors.length === 1) {
      return {
        borderColor: COLOR_MAP[colors[0]],
        backgroundColor: COLOR_LIGHT_MAP[colors[0]],
        borderWidth: '2px',
      }
    } else {
      // Multicolor
      return {
        borderColor: COLOR_MAP[colors[0]],
        background: colors.length === 2
          ? `linear-gradient(to right, ${COLOR_LIGHT_MAP[colors[0]]} 50%, ${COLOR_LIGHT_MAP[colors[1]]} 50%)`
          : undefined,
        backgroundColor: colors.length > 2 ? COLOR_LIGHT_MAP[colors[0]] : undefined,
        borderWidth: '2px',
      }
    }
  }

  return (
    <div
      style={{
        width: '200px',
        border: `2px solid ${playerColor}`,
        padding: '15px',
        overflowY: 'auto',
        backgroundColor: playerBgColor,
      }}
    >
      <h2 style={{ marginTop: 0, fontSize: '16px', color: playerColor }}>
        {playerName} Library ({cards.length})
      </h2>
      <div style={{ marginBottom: '15px', fontSize: '11px', color: '#666' }}>
        Click a card to add to hand
      </div>
      
      {cards.map((template, index) => {
        const colorStyles = getCardColorStyles(template.colors)
        return (
          <div
            key={template.id || index}
            style={{
              border: `${colorStyles.borderWidth || '1px'} solid ${colorStyles.borderColor}`,
              borderRadius: '4px',
              padding: '6px',
              marginBottom: '6px',
              backgroundColor: colorStyles.backgroundColor,
              background: colorStyles.background,
              fontSize: '11px',
              position: 'relative',
            }}
          >
            <div
              onClick={() => handleAddToHand(index, player)}
              style={{
                cursor: 'pointer',
                paddingRight: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '10px', color: playerColor }}>
                  {template.cardType.toUpperCase()}
                </div>
                {/* Color indicators */}
                {template.colors && template.colors.length > 0 && (
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {template.colors.map((colorVal, idx) => {
                      const COLOR_MAP: Record<Color, string> = {
                        red: '#d32f2f',
                        blue: '#1976d2',
                        white: '#f5f5f5',
                        black: '#424242',
                        green: '#388e3c',
                      }
                      return (
                        <div
                          key={idx}
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: COLOR_MAP[colorVal],
                            border: '1px solid rgba(0,0,0,0.2)',
                          }}
                          title={colorVal}
                        />
                      )
                    })}
                  </div>
                )}
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{template.name}</div>
              <div style={{ fontSize: '10px', color: '#666' }}>{template.description}</div>
              {template.manaCost !== undefined && (
                <div style={{ fontSize: '10px', color: '#1976d2', marginTop: '2px' }}>
                  💎 {template.manaCost}
                </div>
              )}
              {'attack' in template && 'health' in template && (
                <div style={{ fontSize: '10px', marginTop: '2px' }}>
                  ⚔️ {(template as { attack: number; health: number }).attack} ❤️ {(template as { attack: number; health: number }).health}
                </div>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (confirm(`Delete ${template.name} from library?`)) {
                  setCards(prev => prev.filter((_, i) => i !== index))
                }
              }}
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                cursor: 'pointer',
                fontSize: '10px',
                lineHeight: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Delete card"
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}



