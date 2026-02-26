import { CombatLogEntry } from '../game/combatSystem'
import { TurnStartSummary } from '../game/types'

interface CombatSummaryModalProps {
  isOpen: boolean
  onClose: () => void
  battlefieldA: {
    name: string
    combatLog: CombatLogEntry[]
    towerHP: { player1: number, player2: number }
    overflowDamage: { player1: number, player2: number }
  }
  battlefieldB: {
    name: string
    combatLog: CombatLogEntry[]
    towerHP: { player1: number, player2: number }
    overflowDamage: { player1: number, player2: number }
  }
  runeSummary?: TurnStartSummary | null
}

function renderRuneEventList(title: string, events: string[], isTemporary: boolean = false) {
  if (events.length === 0) return null
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ fontWeight: 600, fontSize: '12px', marginBottom: '4px' }}>
        {title} {isTemporary ? '(This Turn Only)' : '(Permanent)'}
      </div>
      {events.map((entry, index) => (
        <div key={`${title}-${index}`} style={{ fontSize: '12px', color: '#333', marginBottom: '2px' }}>
          - {entry}
        </div>
      ))}
    </div>
  )
}

export function CombatSummaryModal({ 
  isOpen, 
  onClose, 
  battlefieldA, 
  battlefieldB,
  runeSummary,
}: CombatSummaryModalProps) {
  if (!isOpen) return null

  const renderCombatLog = (log: CombatLogEntry[], battlefieldName: string) => {
    if (log.length === 0) {
      return (
        <div style={{ padding: '12px', color: '#666', fontStyle: 'italic' }}>
          No combat occurred on {battlefieldName}
        </div>
      )
    }

    return (
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {log.map((entry, index) => (
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
              {entry.attackerName} → {entry.targetName || 'Tower'}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {entry.damage} damage{entry.killed ? ' (KILLED)' : ''}
            </div>
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

        {/* Battlefield A */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#1976d2' }}>
            {battlefieldA.name}
          </h3>
          {renderCombatLog(battlefieldA.combatLog, battlefieldA.name)}
          
          {/* Tower HP */}
          <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Tower HP:</div>
            <div style={{ fontSize: '11px' }}>
              Player 1: {battlefieldA.towerHP.player1} / 20
              {battlefieldA.towerHP.player1 === 0 && <span style={{ color: '#f44336', marginLeft: '8px' }}>DESTROYED</span>}
            </div>
            <div style={{ fontSize: '11px' }}>
              Player 2: {battlefieldA.towerHP.player2} / 20
              {battlefieldA.towerHP.player2 === 0 && <span style={{ color: '#f44336', marginLeft: '8px' }}>DESTROYED</span>}
            </div>
            {(battlefieldA.overflowDamage.player1 > 0 || battlefieldA.overflowDamage.player2 > 0) && (
              <div style={{ fontSize: '11px', color: '#f44336', marginTop: '4px', fontWeight: 'bold' }}>
                Overflow Damage: P1: {battlefieldA.overflowDamage.player1}, P2: {battlefieldA.overflowDamage.player2}
              </div>
            )}
          </div>
        </div>

        {/* Battlefield B */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#1976d2' }}>
            {battlefieldB.name}
          </h3>
          {renderCombatLog(battlefieldB.combatLog, battlefieldB.name)}
          
          {/* Tower HP */}
          <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Tower HP:</div>
            <div style={{ fontSize: '11px' }}>
              Player 1: {battlefieldB.towerHP.player1} / 20
              {battlefieldB.towerHP.player1 === 0 && <span style={{ color: '#f44336', marginLeft: '8px' }}>DESTROYED</span>}
            </div>
            <div style={{ fontSize: '11px' }}>
              Player 2: {battlefieldB.towerHP.player2} / 20
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

        {/* Rune summary (combat + turn start in one modal) */}
        {runeSummary && (
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e0e0e0' }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#1976d2' }}>
              Turn {runeSummary.turn} Rune Summary
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ background: '#f4f8ff', borderRadius: '8px', padding: '12px' }}>
                <h4 style={{ marginTop: 0, marginBottom: '10px' }}>Player 1</h4>
                {renderRuneEventList('Resonance Runes', runeSummary.player1.resonanceEvents)}
                {renderRuneEventList('Trigger Runes', runeSummary.player1.triggerEvents)}
                {renderRuneEventList('Seal Runes', runeSummary.player1.sealEvents)}
                {renderRuneEventList('Temporary Runes', runeSummary.player1.temporaryEvents, true)}
                {renderRuneEventList('Mirror Buffs', runeSummary.player1.mirrorBuffEvents)}
              </div>
              <div style={{ background: '#fff6f6', borderRadius: '8px', padding: '12px' }}>
                <h4 style={{ marginTop: 0, marginBottom: '10px' }}>Player 2</h4>
                {renderRuneEventList('Resonance Runes', runeSummary.player2.resonanceEvents)}
                {renderRuneEventList('Trigger Runes', runeSummary.player2.triggerEvents)}
                {renderRuneEventList('Seal Runes', runeSummary.player2.sealEvents)}
                {renderRuneEventList('Temporary Runes', runeSummary.player2.temporaryEvents, true)}
                {renderRuneEventList('Mirror Buffs', runeSummary.player2.mirrorBuffEvents)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
















