import { useState, useEffect } from 'react'
import { BaseCard, CardType, Color } from '../game/types'
import { useGameContext } from '../context/GameContext'

interface CardEditorModalProps {
  card: BaseCard
  onSave: (updatedCard: BaseCard, archiveOld: boolean) => void
  onCancel: () => void
}

export function CardEditorModal({ card, onSave, onCancel }: CardEditorModalProps) {
  const { archivedCards, setArchivedCards, player1SidebarCards, setPlayer1SidebarCards, player2SidebarCards, setPlayer2SidebarCards } = useGameContext()
  
  const [formData, setFormData] = useState({
    name: card.name,
    description: card.description,
    cardType: card.cardType,
    manaCost: card.manaCost ?? '',
    attack: ('attack' in card ? (card as any).attack : '') as number | '',
    health: ('health' in card ? (card as any).health : '') as number | '',
    supportEffect: (card.cardType === 'hero' && 'supportEffect' in card ? (card as any).supportEffect : '') as string,
    effect: (card.cardType === 'signature' && 'effect' in card ? (card as any).effect : '') as string,
    baseBuff: (card.cardType === 'hybrid' && 'baseBuff' in card ? (card as any).baseBuff : '') as string,
    heroName: (card.cardType === 'signature' && 'heroName' in card ? (card as any).heroName : '') as string,
    colors: card.colors || [] as Color[],
  })
  
  const [archiveOld, setArchiveOld] = useState(false)

  const handleSave = () => {
    const updatedCard: BaseCard & Partial<any> = {
      ...card,
      name: formData.name.trim(),
      description: formData.description.trim(),
      cardType: formData.cardType,
      manaCost: formData.manaCost === '' ? undefined : Number(formData.manaCost),
      colors: formData.colors,
    }

    // Add type-specific fields
    if (formData.attack !== '') {
      updatedCard.attack = Number(formData.attack)
    }
    if (formData.health !== '') {
      updatedCard.health = Number(formData.health)
    }
    if (formData.cardType === 'hero' && formData.supportEffect) {
      updatedCard.supportEffect = formData.supportEffect.trim()
    }
    if (formData.cardType === 'signature') {
      if (formData.effect) {
        updatedCard.effect = formData.effect.trim()
      }
      if (formData.heroName) {
        updatedCard.heroName = formData.heroName.trim()
      }
    }
    if (formData.cardType === 'hybrid' && formData.baseBuff) {
      updatedCard.baseBuff = formData.baseBuff.trim()
    }

    onSave(updatedCard as BaseCard, archiveOld)
  }

  const toggleColor = (color: Color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color].slice(0, 3) // Max 3 colors
    }))
  }

  const allColors: Color[] = ['red', 'blue', 'white', 'black', 'green']
  const COLOR_MAP: Record<Color, string> = {
    red: '#d32f2f',
    blue: '#1976d2',
    white: '#f5f5f5',
    black: '#424242',
    green: '#388e3c',
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        border: '2px solid #4a90e2',
        borderRadius: '8px',
        padding: '24px',
        zIndex: 2000,
        minWidth: '500px',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <h2 style={{ marginTop: 0 }}>Edit Card: {card.name}</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Name */}
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
          />
        </div>

        {/* Card Type */}
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Card Type</label>
          <select
            value={formData.cardType}
            onChange={(e) => setFormData(prev => ({ ...prev, cardType: e.target.value as CardType }))}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="hero">Hero</option>
            <option value="signature">Signature</option>
            <option value="hybrid">Hybrid</option>
            <option value="generic">Generic</option>
            <option value="spell">Spell</option>
          </select>
        </div>

        {/* Mana Cost */}
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Mana Cost</label>
          <input
            type="number"
            value={formData.manaCost}
            onChange={(e) => setFormData(prev => ({ ...prev, manaCost: e.target.value === '' ? '' : Number(e.target.value) }))}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            placeholder="Leave empty for no cost"
          />
        </div>

        {/* Attack & Health (for units) */}
        {(formData.cardType === 'hero' || formData.cardType === 'signature' || formData.cardType === 'hybrid' || formData.cardType === 'generic') && (
          <>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Attack</label>
              <input
                type="number"
                value={formData.attack}
                onChange={(e) => setFormData(prev => ({ ...prev, attack: e.target.value === '' ? '' : Number(e.target.value) }))}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Health</label>
              <input
                type="number"
                value={formData.health}
                onChange={(e) => setFormData(prev => ({ ...prev, health: e.target.value === '' ? '' : Number(e.target.value) }))}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </>
        )}

        {/* Support Effect (Hero) */}
        {formData.cardType === 'hero' && (
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Support Effect</label>
            <input
              type="text"
              value={formData.supportEffect}
              onChange={(e) => setFormData(prev => ({ ...prev, supportEffect: e.target.value }))}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="e.g., Allies gain +1 attack"
            />
          </div>
        )}

        {/* Effect (Signature) */}
        {formData.cardType === 'signature' && (
          <>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Hero Name</label>
              <input
                type="text"
                value={formData.heroName}
                onChange={(e) => setFormData(prev => ({ ...prev, heroName: e.target.value }))}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder="Which hero this belongs to"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Effect</label>
              <input
                type="text"
                value={formData.effect}
                onChange={(e) => setFormData(prev => ({ ...prev, effect: e.target.value }))}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder="Special effect when played"
              />
            </div>
          </>
        )}

        {/* Base Buff (Hybrid) */}
        {formData.cardType === 'hybrid' && (
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Base Buff</label>
            <input
              type="text"
              value={formData.baseBuff}
              onChange={(e) => setFormData(prev => ({ ...prev, baseBuff: e.target.value }))}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="Effect when in base"
            />
          </div>
        )}

        {/* Colors */}
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Colors (Max 3)</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {allColors.map(color => (
              <label
                key={color}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px',
                  border: `2px solid ${formData.colors.includes(color) ? COLOR_MAP[color] : '#ddd'}`,
                  borderRadius: '4px',
                  backgroundColor: formData.colors.includes(color) ? COLOR_MAP[color] + '20' : '#fff',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.colors.includes(color)}
                  onChange={() => toggleColor(color)}
                  disabled={!formData.colors.includes(color) && formData.colors.length >= 3}
                />
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: COLOR_MAP[color],
                    border: '1px solid rgba(0,0,0,0.2)',
                  }}
                />
                <span style={{ textTransform: 'capitalize' }}>{color}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Archive Option */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={archiveOld}
              onChange={(e) => setArchiveOld(e.target.checked)}
            />
            <span>Archive old version (instead of deleting)</span>
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
        <button
          onClick={handleSave}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            flex: 1,
          }}
        >
          Save Changes
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            backgroundColor: '#9e9e9e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            flex: 1,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}



