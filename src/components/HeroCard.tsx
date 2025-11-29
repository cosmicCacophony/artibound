import { Card, Color } from '../game/types'
import { tier1Items } from '../game/sampleData'

interface HeroCardProps {
  card: Card
  onClick?: (e?: React.MouseEvent) => void
  isSelected?: boolean
  showStats?: boolean
  onRemove?: () => void // For removing from battlefields
  onDecreaseHealth?: () => void // For combat simulation
  onIncreaseHealth?: () => void // For correcting mistakes
  showCombatControls?: boolean // Show decrease/increase health buttons
  isDead?: boolean // Show death cooldown overlay (black X)
  cooldownCounter?: number // Cooldown counter value (2, 1, or undefined if ready)
  isPlayed?: boolean // Show played overlay (black X) for any card in base
  onTogglePlayed?: () => void // Toggle played state for any card
}

// Color palette mapping
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

export function HeroCard({ card, onClick, isSelected, showStats = true, onRemove, onDecreaseHealth, onIncreaseHealth, showCombatControls = false, isDead = false, cooldownCounter, isPlayed = false, onTogglePlayed }: HeroCardProps) {
  // Get card colors
  const cardColors: Color[] = 'colors' in card && card.colors ? card.colors : []
  
  // Get color styling based on card colors
  const getColorStyles = () => {
    // Items have yellow background
    if (card.cardType === 'item') {
      return {
        borderColor: '#f9a825',
        backgroundColor: '#fff9c4',
        borderStyle: 'solid' as const,
        borderWidth: '3px',
      }
    }
    if (cardColors.length === 0) {
      // Colorless card - gray border
      return {
        borderColor: '#757575',
        backgroundColor: '#fafafa',
        borderStyle: 'solid' as const,
      }
    } else if (cardColors.length === 1) {
      // Single color - use that color
      const color = cardColors[0]
      return {
        borderColor: COLOR_MAP[color],
        backgroundColor: COLOR_LIGHT_MAP[color],
        borderStyle: 'solid' as const,
        borderWidth: '3px',
      }
    } else {
      // Multicolor - create gradient border effect
      // We'll use a background gradient and a solid border
      const gradientColors = cardColors.map(c => COLOR_MAP[c]).join(', ')
      return {
        borderColor: COLOR_MAP[cardColors[0]], // Primary color border
        background: cardColors.length === 2 
          ? `linear-gradient(to right, ${COLOR_LIGHT_MAP[cardColors[0]]} 50%, ${COLOR_LIGHT_MAP[cardColors[1]]} 50%)`
          : `linear-gradient(135deg, ${cardColors.map((c, i) => {
              const percent = (i / cardColors.length) * 100
              return `${COLOR_LIGHT_MAP[c]} ${percent}%`
            }).join(', ')})`,
        borderStyle: 'solid' as const,
        borderWidth: '3px',
      }
    }
  }

  const getCardTypeColor = () => {
    switch (card.cardType) {
      case 'hero': return '#4a90e2'
      case 'signature': return '#9c27b0'
      case 'hybrid': return '#ff9800'
      case 'generic': return '#757575'
      case 'spell': return '#9c27b0'
      case 'item': return '#f57c00'
      default: return '#333'
    }
  }

  const colorStyles = getColorStyles()

  const getAttack = () => {
    if (card.cardType === 'generic' && 'stackPower' in card && card.stackPower !== undefined) {
      return card.stackPower
    }
    return 'attack' in card ? card.attack : 0
  }

  const getHealth = () => {
    if (card.cardType === 'generic' && 'stackHealth' in card && card.stackHealth !== undefined) {
      return card.stackHealth
    }
    // Use currentHealth if available (for combat simulation), otherwise use health
    if ('currentHealth' in card && card.currentHealth !== undefined) {
      return card.currentHealth
    }
    return 'health' in card ? card.health : 0
  }

  const getMaxHealth = () => {
    if (card.cardType === 'generic' && 'stackHealth' in card && card.stackHealth !== undefined) {
      return card.stackHealth
    }
    if ('maxHealth' in card && card.maxHealth !== undefined) {
      return card.maxHealth
    }
    return 'health' in card ? card.health : 0
  }

  const isStacked = card.cardType === 'generic' && 'stackedWith' in card && card.stackedWith !== undefined

  const getSpellEffectDescription = (effect: import('../game/types').SpellEffect): string => {
    switch (effect.type) {
      case 'damage':
        return `Deal ${effect.damage} damage`
      case 'targeted_damage':
        return `Deal ${effect.damage} damage to target`
      case 'aoe_damage':
        return `Deal ${effect.damage} damage to ${effect.targetCount || 3} targets`
      case 'adjacent_damage':
        return `Deal ${effect.damage} damage to ${effect.adjacentCount || 3} adjacent units`
      case 'all_units_damage':
        return `Deal ${effect.damage} damage to all units`
      case 'board_wipe':
        return `Destroy all ${effect.affectsOwnUnits ? 'units' : 'enemy units'}`
      default:
        return 'Spell effect'
    }
  }

  return (
    <div
      onClick={(e) => {
        if (onClick) {
          onClick(e)
        }
      }}
      className={`hero-card ${isSelected ? 'selected' : ''} ${isStacked ? 'stacked' : ''}`}
      style={{
        border: isSelected 
          ? `3px solid #4a90e2` 
          : `${colorStyles.borderWidth || '2px'} ${colorStyles.borderStyle} ${colorStyles.borderColor}`,
        borderRadius: '8px',
        padding: '12px',
        margin: '8px',
        background: isSelected ? '#e3f2fd' : isStacked ? '#f5f5f5' : (colorStyles.background || colorStyles.backgroundColor || '#fff'),
        backgroundColor: colorStyles.backgroundColor ? colorStyles.backgroundColor : undefined,
        cursor: onClick ? 'pointer' : 'default',
        minWidth: '120px',
        maxWidth: '150px',
        boxShadow: isSelected ? '0 4px 8px rgba(74, 144, 226, 0.4)' : '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Color indicator bar at top for multicolor */}
      {cardColors.length > 1 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: cardColors.length === 2
              ? `linear-gradient(to right, ${COLOR_MAP[cardColors[0]]} 50%, ${COLOR_MAP[cardColors[1]]} 50%)`
              : `linear-gradient(to right, ${cardColors.map((c, i) => {
                  const percent = ((i + 1) / cardColors.length) * 100
                  return `${COLOR_MAP[c]} ${i === 0 ? 0 : ((i / cardColors.length) * 100)}% ${percent}%`
                }).join(', ')})`,
          }}
        />
      )}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            cursor: 'pointer',
            fontSize: '12px',
            lineHeight: '1',
          }}
        >
          ×
        </button>
      )}
      
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '4px',
        marginTop: cardColors.length > 1 ? '4px' : '0',
      }}>
        <div style={{ 
          fontSize: '10px', 
          color: getCardTypeColor(), 
          fontWeight: 'bold',
          textTransform: 'uppercase',
        }}>
          {card.cardType}
        </div>
        {/* Color indicators */}
        {cardColors.length > 0 && (
          <div style={{ display: 'flex', gap: '2px' }}>
            {cardColors.map((colorVal, idx) => (
              <div
                key={idx}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: COLOR_MAP[colorVal],
                  border: '1px solid rgba(0,0,0,0.2)',
                }}
                title={colorVal}
              />
            ))}
          </div>
        )}
      </div>
      
      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>{card.name}</h3>
      <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>{card.description}</p>
      
      {showStats && (card.cardType === 'hero' || card.cardType === 'signature' || card.cardType === 'hybrid' || card.cardType === 'generic') && (
        <div style={{ marginTop: '8px', fontSize: '12px' }}>
          {'manaCost' in card && card.manaCost !== undefined && (
            <div style={{ fontSize: '11px', color: '#1976d2', marginBottom: '4px', fontWeight: 'bold' }}>
              💎 {card.manaCost}
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span>⚔️ {getAttack()}</span>
            <span>❤️ {getHealth()}{getMaxHealth() !== getHealth() ? `/${getMaxHealth()}` : ''}</span>
            {showCombatControls && (
              <div style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
                {onDecreaseHealth && getHealth() > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDecreaseHealth()
                    }}
                    style={{
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '10px',
                      cursor: 'pointer',
                    }}
                    title="Decrease health (simulate damage)"
                  >
                    -1
                  </button>
                )}
                {onIncreaseHealth && getHealth() < getMaxHealth() && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onIncreaseHealth()
                    }}
                    style={{
                      background: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '10px',
                      cursor: 'pointer',
                    }}
                    title="Increase health (correct mistake)"
                  >
                    +1
                  </button>
                )}
              </div>
            )}
          </div>
          {isStacked && (
            <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
              (Stacked)
            </div>
          )}
        </div>
      )}
      
      {card.cardType === 'spell' && 'effect' in card && (
        <div style={{ marginTop: '8px', fontSize: '12px' }}>
          {'manaCost' in card && card.manaCost !== undefined && (
            <div style={{ fontSize: '11px', color: '#1976d2', marginBottom: '4px', fontWeight: 'bold' }}>
              💎 {card.manaCost}
            </div>
          )}
          <div style={{ fontSize: '11px', color: '#9c27b0', marginTop: '4px' }}>
            ✨ {getSpellEffectDescription((card as import('../game/types').SpellCard).effect)}
          </div>
          {(card as import('../game/types').SpellCard).initiative && (
            <div style={{ fontSize: '10px', color: '#ff9800', marginTop: '2px' }}>
              ⚡ Initiative
            </div>
          )}
          {card.location === 'base' && onTogglePlayed && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onTogglePlayed()
              }}
              style={{
                marginTop: '4px',
                padding: '2px 6px',
                background: isPlayed ? '#4caf50' : '#9e9e9e',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '10px',
                cursor: 'pointer',
              }}
              title={isPlayed ? 'Mark as not played' : 'Mark as played'}
            >
              {isPlayed ? '✓ Played' : 'Mark Played'}
            </button>
          )}
        </div>
      )}
      
      {card.cardType === 'hero' && 'supportEffect' in card && (card as import('../game/types').Hero).supportEffect && (
        <div style={{ marginTop: '4px', fontSize: '11px', color: '#2196f3' }}>
          🛡️ {(card as import('../game/types').Hero).supportEffect}
        </div>
      )}
      
      {card.cardType === 'signature' && 'effect' in card && (card as import('../game/types').SignatureCard).effect && (
        <div style={{ marginTop: '4px', fontSize: '11px', color: '#9c27b0' }}>
          ✨ {(card as import('../game/types').SignatureCard).effect}
        </div>
      )}
      
      {card.cardType === 'hybrid' && 'baseBuff' in card && (card as import('../game/types').HybridCard).baseBuff && (
        <div style={{ marginTop: '4px', fontSize: '11px', color: '#ff9800' }}>
          {card.location === 'base' ? `🏰 ${(card as import('../game/types').HybridCard).baseBuff}` : '⚔️ Battlefield: Combat unit'}
        </div>
      )}
      
      {card.cardType === 'item' && 'itemId' in card && (
        <div style={{ marginTop: '8px', fontSize: '12px' }}>
          {(() => {
            const itemCard = card as import('../game/types').ItemCard
            const item = tier1Items.find(i => i.id === itemCard.itemId)
            if (!item) return null
            return (
              <>
                {(item.attackBonus || item.hpBonus) && (
                  <div style={{ fontSize: '12px', marginBottom: '4px', fontWeight: 'bold' }}>
                    {item.attackBonus && <span>⚔️ +{item.attackBonus} </span>}
                    {item.hpBonus && <span>❤️ +{item.hpBonus}</span>}
                  </div>
                )}
                {item.specialEffects && item.specialEffects.length > 0 && (
                  <div style={{ fontSize: '11px', color: '#9c27b0', marginTop: '4px', fontStyle: 'italic' }}>
                    Effects: {item.specialEffects.join(', ')}
                  </div>
                )}
                {item.hasActivatedAbility && item.activatedAbilityDescription && (
                  <div style={{ fontSize: '11px', color: '#1976d2', marginTop: '4px', fontStyle: 'italic' }}>
                    ⚡ {item.activatedAbilityDescription}
                  </div>
                )}
                <div style={{ fontSize: '10px', color: '#f57c00', marginTop: '4px', fontWeight: 'bold' }}>
                  💰 Cost: {item.cost} gold
                </div>
              </>
            )
          })()}
        </div>
      )}
      
      {/* Cooldown counter display (for heroes in base) */}
      {cooldownCounter !== undefined && cooldownCounter > 0 && card.cardType === 'hero' && card.location === 'base' && (
        <div
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            backgroundColor: 'rgba(255, 0, 0, 0.9)',
            color: 'white',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            zIndex: 11,
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
          title={`Cooldown: ${cooldownCounter} turn${cooldownCounter !== 1 ? 's' : ''} remaining`}
        >
          {cooldownCounter}
        </div>
      )}
      
      {/* Death cooldown overlay - black X */}
      {isDead && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            borderRadius: '4px',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              color: '#fff',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            ✕
          </div>
        </div>
      )}
      
      {/* Played card overlay - black X (for any card in base) */}
      {isPlayed && card.location === 'base' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            borderRadius: '4px',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              color: '#fff',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            ✕
          </div>
        </div>
      )}
    </div>
  )
}
