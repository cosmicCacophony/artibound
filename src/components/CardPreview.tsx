import { BaseCard, Color } from '../game/types'
import { canAffordCard } from '../game/runeSystem'
import { useGameContext } from '../context/GameContext'

interface CardPreviewProps {
  card: BaseCard
}

export function CardPreview({ card }: CardPreviewProps) {
  const { metadata } = useGameContext()
  // Determine which player's rune pool to use (default to player1 for preview)
  const runePool = metadata.player1RunePool // Could be improved to detect owner
  const playerMana = metadata.player1Mana // Default to player1 for preview
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
  
  const getCardColorStyles = (colors?: Color[]) => {
    
    if (!colors || colors.length === 0) {
      return {
        borderColor: '#757575',
        backgroundColor: '#fafafa',
        borderWidth: '2px',
      }
    } else if (colors.length === 1) {
      return {
        borderColor: COLOR_MAP[colors[0]],
        backgroundColor: COLOR_LIGHT_MAP[colors[0]],
        borderWidth: '2px',
      }
    } else {
      // Multicolor - create gradient background with fallback backgroundColor
      const primaryColor = colors[0]
      return {
        borderColor: COLOR_MAP[primaryColor],
        backgroundColor: COLOR_LIGHT_MAP[primaryColor], // Fallback background color
        background: colors.length === 2
          ? `linear-gradient(to right, ${COLOR_LIGHT_MAP[colors[0]]} 50%, ${COLOR_LIGHT_MAP[colors[1]]} 50%)`
          : `linear-gradient(135deg, ${colors.map((c, i) => {
              const percent = (i / colors.length) * 100
              return `${COLOR_LIGHT_MAP[c]} ${percent}%`
            }).join(', ')})`,
        borderWidth: '2px',
      }
    }
  }

  const colorStyles = getCardColorStyles(card.colors)

  const hasStats = 'attack' in card && 'health' in card && 
    (card as any).attack !== undefined && (card as any).health !== undefined
  const attack = hasStats ? (card as any).attack : null
  const health = hasStats ? (card as any).health : null

  const cardColors = card.colors || []
  
  return (
    <div
      style={{
        border: `${colorStyles.borderWidth || '1px'} solid ${colorStyles.borderColor}`,
        borderRadius: '8px',
        padding: '12px',
        // For single-color cards: ONLY set backgroundColor, never set background property
        // For multicolor cards: set both backgroundColor (fallback) and background (gradient)
        ...(cardColors.length === 1 
          ? {
              backgroundColor: COLOR_LIGHT_MAP[cardColors[0]],
              // Explicitly don't set background property for single-color cards
            }
          : cardColors.length > 1
            ? {
                backgroundColor: COLOR_LIGHT_MAP[cardColors[0]], // Fallback
                background: colorStyles.background, // Gradient
              }
            : {
                backgroundColor: colorStyles.backgroundColor || '#fff',
              }),
        minWidth: '200px',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      {/* Color indicator bar at top */}
      {card.colors && card.colors.length > 0 && (
        <div style={{ 
          display: 'flex', 
          height: '6px', 
          marginBottom: '10px',
          borderRadius: '3px',
          overflow: 'hidden',
        }}>
          {card.colors.map((color, idx) => {
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
                  flex: 1,
                  backgroundColor: COLOR_MAP[color],
                  borderRight: idx < card.colors!.length - 1 ? '1px solid rgba(255,255,255,0.3)' : 'none',
                }}
                title={color}
              />
            )
          })}
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', color: '#666' }}>
          {card.cardType}
        </div>
        {/* Cost Display: Mana + Rune Requirements */}
        {card.manaCost !== undefined && (
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1976d2' }}>
            <span style={{ marginRight: '8px' }}>
              💎 {card.manaCost}
            </span>
            {card.colors && card.colors.length > 0 && (
              <span>
                {card.colors.map((color, idx) => (
                  <span key={idx} style={{ 
                    marginLeft: '4px',
                    color: COLOR_MAP[color],
                    fontWeight: 'bold',
                  }}>
                    ● {color.substring(0, 1).toUpperCase()}
                  </span>
                ))}
              </span>
            )}
            {canAffordCard(card, playerMana, runePool) ? (
              <span style={{ color: '#4caf50', marginLeft: '8px' }}>✓</span>
            ) : (
              <span style={{ color: '#f44336', marginLeft: '8px' }}>✗</span>
            )}
          </div>
        )}
      </div>
      
      <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>
        {card.name}
      </div>
      
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
        {card.description}
      </div>
      
      {hasStats && attack !== null && health !== null && (
        <div style={{ display: 'flex', gap: '12px', fontSize: '14px', marginTop: '8px', fontWeight: 'bold' }}>
          <span>⚔️ {attack}</span>
          <span>❤️ {health}</span>
        </div>
      )}
      
      {card.cardType === 'hero' && 'supportEffect' in card && (card as any).supportEffect && (
        <div style={{ fontSize: '11px', color: '#388e3c', marginTop: '8px', fontStyle: 'italic' }}>
          Support: {(card as any).supportEffect}
        </div>
      )}
      
      {card.cardType === 'signature' && 'effect' in card && (card as any).effect && (
        <div style={{ fontSize: '11px', color: '#9c27b0', marginTop: '8px', fontStyle: 'italic' }}>
          Effect: {(card as any).effect}
        </div>
      )}
      
      {/* Color labels */}
      {card.colors && card.colors.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase' }}>Colors:</span>
          {card.colors.map((color, idx) => {
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
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: COLOR_MAP[color],
                  border: '2px solid rgba(0,0,0,0.2)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
                title={color}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

