import React, { useState, useMemo } from 'react'
import { BaseCard, RunePool, RuneColor, Color } from '../game/types'
import { getAllAvailableRunes } from '../game/runeSystem'

interface GoldenRuneSelectorModalProps {
  card: BaseCard
  runePool: RunePool
  onConfirm: (selectedRunes: RuneColor[]) => void
  onCancel: () => void
}

export function GoldenRuneSelectorModal({
  card,
  runePool,
  onConfirm,
  onCancel,
}: GoldenRuneSelectorModalProps) {
  const requiredRunes = card.goldenRuneCost || 0
  const [selectedRunes, setSelectedRunes] = useState<RuneColor[]>([])

  // Get all available runes that match the card's color identity
  const availableRunes = useMemo(() => {
    const allRunes = getAllAvailableRunes(runePool)
    return allRunes.filter(rune => card.colors?.includes(rune as Color))
  }, [runePool, card.colors])

  // Count how many of each color are available
  const runeCounts = useMemo(() => {
    const counts: Record<RuneColor, number> = {
      red: 0,
      blue: 0,
      green: 0,
      white: 0,
      black: 0,
    }
    availableRunes.forEach(rune => {
      counts[rune] = (counts[rune] || 0) + 1
    })
    return counts
  }, [availableRunes])

  // Count how many of each color are selected
  const selectedCounts = useMemo(() => {
    const counts: Record<RuneColor, number> = {
      red: 0,
      blue: 0,
      green: 0,
      white: 0,
      black: 0,
    }
    selectedRunes.forEach(rune => {
      counts[rune] = (counts[rune] || 0) + 1
    })
    return counts
  }, [selectedRunes])

  const handleRuneClick = (rune: RuneColor) => {
    const currentCount = selectedCounts[rune] || 0
    const availableCount = runeCounts[rune] || 0

    if (currentCount < availableCount) {
      // Add this rune
      setSelectedRunes([...selectedRunes, rune])
    } else {
      // Remove this rune (if we have any selected)
      const index = selectedRunes.lastIndexOf(rune)
      if (index !== -1) {
        const newSelected = [...selectedRunes]
        newSelected.splice(index, 1)
        setSelectedRunes(newSelected)
      }
    }
  }

  const canConfirm = selectedRunes.length === requiredRunes

  const colorNames: Record<RuneColor, string> = {
    red: 'Red',
    blue: 'Blue',
    green: 'Green',
    white: 'White',
    black: 'Black',
  }

  const colorStyles: Record<RuneColor, { bg: string; border: string; text: string }> = {
    red: { bg: '#ffebee', border: '#f44336', text: '#c62828' },
    blue: { bg: '#e3f2fd', border: '#2196f3', text: '#1976d2' },
    green: { bg: '#e8f5e9', border: '#4caf50', text: '#2e7d32' },
    white: { bg: '#fff9e6', border: '#ffc107', text: '#f57c00' },
    black: { bg: '#f3e5f5', border: '#9c27b0', text: '#6a1b9a' },
  }

  const validColors = card.colors || []

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
        zIndex: 10000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel()
        }
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0, marginBottom: '16px' }}>
          Pay Golden Runes for {card.name}
        </h2>
        
        <p style={{ marginBottom: '16px', color: '#666' }}>
          Select {requiredRunes} rune{requiredRunes !== 1 ? 's' : ''} from the card's color identity:
          <strong> {validColors.join(', ').toUpperCase()}</strong>
        </p>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {validColors.map(color => {
              const rune = color as RuneColor
              const available = runeCounts[rune] || 0
              const selected = selectedCounts[rune] || 0
              const style = colorStyles[rune]
              
              return (
                <div
                  key={rune}
                  style={{
                    border: `2px solid ${style.border}`,
                    borderRadius: '8px',
                    padding: '12px',
                    backgroundColor: style.bg,
                    minWidth: '100px',
                    textAlign: 'center',
                    cursor: available > 0 ? 'pointer' : 'not-allowed',
                    opacity: available > 0 ? 1 : 0.5,
                    transform: selected > 0 ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s',
                    boxShadow: selected > 0 ? `0 4px 8px ${style.border}40` : 'none',
                  }}
                  onClick={() => available > 0 && handleRuneClick(rune)}
                >
                  <div style={{ 
                    fontWeight: 'bold', 
                    color: style.text,
                    marginBottom: '4px',
                  }}>
                    {colorNames[rune]}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    Available: {available}
                  </div>
                  {selected > 0 && (
                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold',
                      color: style.text,
                      marginTop: '4px',
                    }}>
                      Selected: {selected}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ 
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: canConfirm ? '#e8f5e9' : '#ffebee',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <strong>
            {selectedRunes.length} / {requiredRunes} runes selected
          </strong>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selectedRunes)}
            disabled={!canConfirm}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: canConfirm ? '#4caf50' : '#ccc',
              color: 'white',
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Confirm ({selectedRunes.length}/{requiredRunes})
          </button>
        </div>
      </div>
    </div>
  )
}

