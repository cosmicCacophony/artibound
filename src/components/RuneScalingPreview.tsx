import { RuneScalingTier, RuneColor, Color } from '../game/types'
import { meetsRuneRequirement } from '../game/runePrototypeData'

interface RuneScalingPreviewProps {
  runeScaling: RuneScalingTier[]
  baseAttack?: number
  baseHealth?: number
  baseSpellEffect?: string
  cardType: 'generic' | 'spell'
  laneRunes: {
    battlefieldA: RuneColor[]
    battlefieldB: RuneColor[]
  }
}

const RUNE_COLORS: Record<Color, { bg: string; border: string; abbrev: string }> = {
  red: { bg: '#ef4444', border: '#dc2626', abbrev: 'R' },
  white: { bg: '#e5e7eb', border: '#9ca3af', abbrev: 'W' },
  blue: { bg: '#3b82f6', border: '#2563eb', abbrev: 'U' },
  black: { bg: '#374151', border: '#1f2937', abbrev: 'B' },
  green: { bg: '#10b981', border: '#059669', abbrev: 'G' },
}

function RuneDot({ color }: { color: RuneColor }) {
  const style = RUNE_COLORS[color]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        backgroundColor: style.bg,
        border: `1.5px solid ${style.border}`,
        color: color === 'white' ? '#374151' : '#fff',
        fontSize: '9px',
        fontWeight: 700,
        lineHeight: 1,
      }}
      title={color}
    >
      {style.abbrev}
    </span>
  )
}

function LaneActiveTag({ label, isActive }: { label: string; isActive: boolean }) {
  return (
    <span
      style={{
        fontSize: '9px',
        fontWeight: 600,
        padding: '1px 5px',
        borderRadius: '3px',
        backgroundColor: isActive ? '#dcfce7' : '#f3f4f6',
        color: isActive ? '#166534' : '#9ca3af',
        border: `1px solid ${isActive ? '#86efac' : '#e5e7eb'}`,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

export function RuneScalingPreview({
  runeScaling,
  baseAttack,
  baseHealth,
  baseSpellEffect,
  cardType,
  laneRunes,
}: RuneScalingPreviewProps) {
  const getActiveTierForLane = (laneRuneList: RuneColor[]): number => {
    for (let i = runeScaling.length - 1; i >= 0; i--) {
      if (meetsRuneRequirement(laneRuneList, runeScaling[i].runeRequirement)) return i
    }
    return -1
  }

  const activeTierA = getActiveTierForLane(laneRunes.battlefieldA)
  const activeTierB = getActiveTierForLane(laneRunes.battlefieldB)

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: '8px',
        backgroundColor: '#1a1a2e',
        color: '#e2e8f0',
        borderRadius: '8px',
        padding: '12px 14px',
        minWidth: '220px',
        maxWidth: '280px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)',
        zIndex: 1000,
        fontSize: '12px',
        pointerEvents: 'none',
      }}
    >
      <div style={{
        fontSize: '10px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: '#94a3b8',
        marginBottom: '8px',
      }}>
        Rune Scaling
      </div>

      {/* Base tier */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 8px',
          borderRadius: '4px',
          marginBottom: '4px',
          backgroundColor: (activeTierA < 0 || activeTierB < 0) ? 'rgba(255,255,255,0.06)' : 'transparent',
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: '#64748b', fontSize: '10px', fontStyle: 'italic', minWidth: '60px' }}>No runes</span>
          <span style={{ fontWeight: 600 }}>
            {cardType === 'generic'
              ? `⚔️${baseAttack} ❤️${baseHealth}`
              : baseSpellEffect || '—'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '3px' }}>
          {activeTierA < 0 && <LaneActiveTag label="A" isActive />}
          {activeTierB < 0 && <LaneActiveTag label="B" isActive />}
        </div>
      </div>

      {/* Scaling tiers */}
      {runeScaling.map((tier, idx) => {
        const isActiveInA = activeTierA === idx
        const isActiveInB = activeTierB === idx
        const isHighlighted = isActiveInA || isActiveInB

        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 8px',
              borderRadius: '4px',
              marginBottom: idx < runeScaling.length - 1 ? '4px' : 0,
              backgroundColor: isHighlighted ? 'rgba(255,255,255,0.06)' : 'transparent',
              borderLeft: isHighlighted ? '2px solid #34d399' : '2px solid transparent',
            }}
          >
            <div style={{ display: 'flex', gap: '2px', minWidth: '60px' }}>
              {tier.runeRequirement.map((rune, rIdx) => (
                <RuneDot key={rIdx} color={rune} />
              ))}
            </div>
            <div style={{ flex: 1, fontWeight: 600, whiteSpace: 'nowrap' }}>
              {cardType === 'generic'
                ? `⚔️${(baseAttack || 0) + (tier.attackBonus || 0)} ❤️${(baseHealth || 0) + (tier.healthBonus || 0)}`
                : tier.description}
            </div>
            <div style={{ display: 'flex', gap: '3px' }}>
              {isActiveInA && <LaneActiveTag label="A" isActive />}
              {isActiveInB && <LaneActiveTag label="B" isActive />}
            </div>
          </div>
        )
      })}

      {/* Tooltip arrow */}
      <div
        style={{
          position: 'absolute',
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          width: '12px',
          height: '12px',
          backgroundColor: '#1a1a2e',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      />
    </div>
  )
}
