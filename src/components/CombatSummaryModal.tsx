import { CombatLogEntry } from '../game/combatSystem'
import { RuneColor } from '../game/types'

export interface HeroDeathInfo {
  heroName: string
  heroId: string
  owner: 'player1' | 'player2'
  runesLost: RuneColor[]
}

export interface LaneCombatData {
  name: string
  combatLog: CombatLogEntry[]
  towerHP: { player1: number, player2: number }
  overflowDamage: { player1: number, player2: number }
  heroDeaths?: HeroDeathInfo[]
}

interface CombatSummaryModalProps {
  isOpen: boolean
  onClose: () => void
  battlefieldA: LaneCombatData
  battlefieldB: LaneCombatData
}

export function CombatSummaryModal({ 
  isOpen, 
  onClose, 
  battlefieldA, 
  battlefieldB 
}: CombatSummaryModalProps) {
  if (!isOpen) return null

  const tagIcon = (tag?: string) => {
    if (!tag) return ''
    switch (tag) {
      case 'frontline': return '🛡'
      case 'ranged': return '🏹'
      case 'assassin': return '🗡'
      default: return ''
    }
  }

  const runeColorEmoji: Record<string, string> = {
    red: '🔴', blue: '🔵', white: '⚪', black: '⚫', green: '🟢',
  }

  const renderCombatLog = (log: CombatLogEntry[], battlefieldName: string, heroDeaths?: HeroDeathInfo[]) => {
    if (log.length === 0) {
      return (
        <div style={{ padding: '12px', color: '#666', fontStyle: 'italic' }}>
          No combat occurred in {battlefieldName}
        </div>
      )
    }

    const unitEntries = log.filter(e => e.targetType !== 'combat_win')
    const combatWinEntry = log.find(e => e.targetType === 'combat_win')

    return (
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {unitEntries.map((entry, index) => (
          <div
            key={index}
            style={{
              padding: '8px',
              marginBottom: '4px',
              backgroundColor: entry.killed ? '#ffebee' : '#f5f5f5',
              borderRadius: '4px',
              borderLeft: entry.killed ? '3px solid #f44336' : '3px solid #4caf50',
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
              {tagIcon(entry.formationTag)} {entry.attackerName} → {entry.targetName || 'Tower'}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {entry.damage} damage
              {entry.killed ? ' — KILLED' : ''}
              {entry.formationTag === 'assassin' && entry.targetType === 'tower' ? ' (bypassed units)' : ''}
              {entry.formationTag === 'ranged' && entry.targetType === 'unit' ? ' (shot over frontline)' : ''}
            </div>
          </div>
        ))}

        {combatWinEntry && combatWinEntry.combatWinInfo && (
          <div
            style={{
              padding: '10px',
              marginTop: '8px',
              backgroundColor: '#fff3e0',
              borderRadius: '6px',
              border: '2px solid #ff9800',
            }}
          >
            <div style={{ fontWeight: 'bold', color: '#e65100', marginBottom: '4px', fontSize: '13px' }}>
              {combatWinEntry.combatWinInfo.winningSide === 'player1' ? 'P1' : 'P2'} wins combat!
            </div>
            <div style={{ fontSize: '12px', color: '#bf360c' }}>
              {combatWinEntry.combatWinInfo.winnerSurvivors} vs {combatWinEntry.combatWinInfo.loserSurvivors} survivors
              — {combatWinEntry.damage} tower damage to {combatWinEntry.combatWinInfo.winningSide === 'player1' ? 'P2' : 'P1'}
            </div>
          </div>
        )}

        {!combatWinEntry && unitEntries.length > 0 && (
          <div
            style={{
              padding: '8px',
              marginTop: '8px',
              backgroundColor: '#e8eaf6',
              borderRadius: '4px',
              textAlign: 'center',
              color: '#5c6bc0',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            Draw — equal survivors, no tower damage
          </div>
        )}

        {heroDeaths && heroDeaths.length > 0 && heroDeaths.map((death, i) => (
          <div
            key={i}
            style={{
              padding: '10px',
              marginTop: '8px',
              backgroundColor: '#1a1a2e',
              borderRadius: '6px',
              border: '2px solid #d32f2f',
            }}
          >
            <div style={{ fontWeight: 'bold', color: '#ef5350', fontSize: '13px', marginBottom: '4px' }}>
              HERO KILLED — {death.heroName} ({death.owner === 'player1' ? 'P1' : 'P2'})
            </div>
            <div style={{ fontSize: '11px', color: '#90a4ae' }}>
              2-turn cooldown before redeployment
            </div>
            {death.runesLost.length > 0 && (
              <div style={{ fontSize: '12px', color: '#ffab40', marginTop: '4px', fontWeight: 600 }}>
                Runes lost: {death.runesLost.map(r => runeColorEmoji[r] || r).join(' ')}
              </div>
            )}
          </div>
        ))}
      </div>
    )
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
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#d32f2f' }}>⚔️ Combat Summary</h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#9e9e9e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Close
          </button>
        </div>

        {/* Lane A */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#1976d2' }}>
            Lane A
          </h3>
          {renderCombatLog(battlefieldA.combatLog, battlefieldA.name, battlefieldA.heroDeaths)}
          
          {/* Tower HP */}
          <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Tower HP:</div>
            <div style={{ fontSize: '11px' }}>
              Player 1: {battlefieldA.towerHP.player1} / 15
              {battlefieldA.towerHP.player1 === 0 && <span style={{ color: '#f44336', marginLeft: '8px' }}>DESTROYED</span>}
            </div>
            <div style={{ fontSize: '11px' }}>
              Player 2: {battlefieldA.towerHP.player2} / 15
              {battlefieldA.towerHP.player2 === 0 && <span style={{ color: '#f44336', marginLeft: '8px' }}>DESTROYED</span>}
            </div>
            {(battlefieldA.overflowDamage.player1 > 0 || battlefieldA.overflowDamage.player2 > 0) && (
              <div style={{ fontSize: '11px', color: '#f44336', marginTop: '4px', fontWeight: 'bold' }}>
                Overflow Damage: P1: {battlefieldA.overflowDamage.player1}, P2: {battlefieldA.overflowDamage.player2}
              </div>
            )}
          </div>
        </div>

        {/* Lane B */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#1976d2' }}>
            Lane B
          </h3>
          {renderCombatLog(battlefieldB.combatLog, battlefieldB.name, battlefieldB.heroDeaths)}
          
          {/* Tower HP */}
          <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Tower HP:</div>
            <div style={{ fontSize: '11px' }}>
              Player 1: {battlefieldB.towerHP.player1} / 15
              {battlefieldB.towerHP.player1 === 0 && <span style={{ color: '#f44336', marginLeft: '8px' }}>DESTROYED</span>}
            </div>
            <div style={{ fontSize: '11px' }}>
              Player 2: {battlefieldB.towerHP.player2} / 15
              {battlefieldB.towerHP.player2 === 0 && <span style={{ color: '#f44336', marginLeft: '8px' }}>DESTROYED</span>}
            </div>
            {(battlefieldB.overflowDamage.player1 > 0 || battlefieldB.overflowDamage.player2 > 0) && (
              <div style={{ fontSize: '11px', color: '#f44336', marginTop: '4px', fontWeight: 'bold' }}>
                Overflow Damage: P1: {battlefieldB.overflowDamage.player1}, P2: {battlefieldB.overflowDamage.player2}
              </div>
            )}
          </div>
        </div>

        {/* Total Overflow Damage */}
        {(battlefieldA.overflowDamage.player1 + battlefieldB.overflowDamage.player1 > 0 ||
          battlefieldA.overflowDamage.player2 + battlefieldB.overflowDamage.player2 > 0) && (
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#ffebee', 
            borderRadius: '4px',
            border: '2px solid #f44336',
            marginTop: '16px'
          }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#d32f2f', marginBottom: '4px' }}>
              Total Nexus Damage:
            </div>
            <div style={{ fontSize: '12px' }}>
              Player 1 Nexus: -{battlefieldA.overflowDamage.player1 + battlefieldB.overflowDamage.player1} HP
            </div>
            <div style={{ fontSize: '12px' }}>
              Player 2 Nexus: -{battlefieldA.overflowDamage.player2 + battlefieldB.overflowDamage.player2} HP
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
















