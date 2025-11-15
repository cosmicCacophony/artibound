import { Card } from '../game/types'

interface HeroCardProps {
  card: Card
  onClick?: () => void
  isSelected?: boolean
  showStats?: boolean
  onRemove?: () => void // For removing from battlefields
}

export function HeroCard({ card, onClick, isSelected, showStats = true, onRemove }: HeroCardProps) {
  const getCardTypeColor = () => {
    switch (card.cardType) {
      case 'hero': return '#4a90e2'
      case 'signature': return '#9c27b0'
      case 'hybrid': return '#ff9800'
      case 'generic': return '#757575'
      default: return '#333'
    }
  }

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
    return 'health' in card ? card.health : 0
  }

  const isStacked = card.cardType === 'generic' && 'stackedWith' in card && card.stackedWith !== undefined

  return (
    <div
      onClick={onClick}
      className={`hero-card ${isSelected ? 'selected' : ''} ${isStacked ? 'stacked' : ''}`}
      style={{
        border: isSelected ? '3px solid #4a90e2' : `2px solid ${getCardTypeColor()}`,
        borderRadius: '8px',
        padding: '12px',
        margin: '8px',
        backgroundColor: isSelected ? '#e3f2fd' : isStacked ? '#f5f5f5' : '#fff',
        cursor: onClick ? 'pointer' : 'default',
        minWidth: '120px',
        maxWidth: '150px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s',
        position: 'relative',
      }}
    >
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
        fontSize: '10px', 
        color: getCardTypeColor(), 
        fontWeight: 'bold',
        marginBottom: '4px',
        textTransform: 'uppercase',
      }}>
        {card.cardType}
      </div>
      
      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>{card.name}</h3>
      <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>{card.description}</p>
      
      {showStats && (card.cardType === 'hero' || card.cardType === 'signature' || card.cardType === 'hybrid' || card.cardType === 'generic') && (
        <div style={{ marginTop: '8px', fontSize: '12px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span>⚔️ {getAttack()}</span>
            <span>❤️ {getHealth()}</span>
          </div>
          {isStacked && (
            <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
              (Stacked)
            </div>
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
    </div>
  )
}
