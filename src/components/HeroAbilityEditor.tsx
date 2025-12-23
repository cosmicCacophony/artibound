import React, { useState } from 'react'
import { Hero, HeroAbility, HeroAbilityEffectType } from '../game/types'

interface HeroAbilityEditorProps {
  hero: Hero
  onSave: (heroId: string, ability: HeroAbility) => void
  onClose: () => void
}

const ABILITY_EFFECT_TYPES: HeroAbilityEffectType[] = [
  'buff_units',
  'damage_target',
  'draw_card',
  'heal_target',
  'move_hero',
  'create_unit',
  'steal_unit',
  'move_cross_battlefield',
  'rune_to_damage',
  'sacrifice_unit',
  'custom',
]

export function HeroAbilityEditor({ hero, onSave, onClose }: HeroAbilityEditorProps) {
  const [name, setName] = useState(hero.ability?.name || '')
  const [description, setDescription] = useState(hero.ability?.description || '')
  const [manaCost, setManaCost] = useState(hero.ability?.manaCost?.toString() || '1')
  const [cooldown, setCooldown] = useState(hero.ability?.cooldown?.toString() || '2')
  const [effectType, setEffectType] = useState(hero.ability?.effectType || 'custom')
  const [effectValue, setEffectValue] = useState(hero.ability?.effectValue?.toString() || '0')

  const handleSave = () => {
    if (!name.trim() || !description.trim()) {
      alert('Name and description are required')
      return
    }
    const ability: HeroAbility = {
      name: name.trim(),
      description: description.trim(),
      manaCost: parseInt(manaCost) || 1,
      cooldown: parseInt(cooldown) || 2,
      effectType: effectType as HeroAbilityEffectType,
      effectValue: parseInt(effectValue) || 0,
    }
    onSave(hero.id, ability)
    onClose()
  }

  const handleRemove = () => {
    if (confirm('Remove this ability?')) {
      onSave(hero.id, undefined as any)
      onClose()
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>
          Edit Ability: {hero.name}
        </h2>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
            }}
            placeholder="Ability name"
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
              minHeight: '80px',
              resize: 'vertical',
            }}
            placeholder="Ability description"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
              Mana Cost
            </label>
            <input
              type="number"
              value={manaCost}
              onChange={(e) => setManaCost(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
              min="0"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
              Cooldown
            </label>
            <input
              type="number"
              value={cooldown}
              onChange={(e) => setCooldown(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
              min="0"
            />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            Effect Type
          </label>
          <select
            value={effectType}
            onChange={(e) => setEffectType(e.target.value as HeroAbilityEffectType)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            {ABILITY_EFFECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            Effect Value
          </label>
          <input
            type="number"
            value={effectValue}
            onChange={(e) => setEffectValue(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
            }}
            placeholder="0"
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button
            onClick={handleRemove}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Remove Ability
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#9e9e9e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Cancel
          </button>
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
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

