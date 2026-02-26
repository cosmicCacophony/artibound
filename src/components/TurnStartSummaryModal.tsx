import { TurnStartSummary } from '../game/types'

interface TurnStartSummaryModalProps {
  isOpen: boolean
  onClose: () => void
  summary: TurnStartSummary | null
}

function renderEventList(title: string, events: string[], isTemporary: boolean = false) {
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

export function TurnStartSummaryModal({ isOpen, onClose, summary }: TurnStartSummaryModalProps) {
  if (!isOpen || !summary) return null

  const p1 = summary.player1
  const p2 = summary.player2

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2500,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '20px',
          width: 'min(900px, 92vw)',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 4px 20px rgba(0,0,0,0.45)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ margin: 0 }}>Turn {summary.turn} Rune Summary</h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px 14px',
              border: 'none',
              backgroundColor: '#1976d2',
              color: '#fff',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Continue
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div style={{ background: '#f4f8ff', borderRadius: '8px', padding: '12px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '10px' }}>Player 1</h3>
            {renderEventList('Resonance Runes', p1.resonanceEvents)}
            {renderEventList('Trigger Runes', p1.triggerEvents)}
            {renderEventList('Seal Runes', p1.sealEvents)}
            {renderEventList('Temporary Runes', p1.temporaryEvents, true)}
            {renderEventList('Mirror Buffs', p1.mirrorBuffEvents)}
          </div>

          <div style={{ background: '#fff6f6', borderRadius: '8px', padding: '12px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '10px' }}>Player 2</h3>
            {renderEventList('Resonance Runes', p2.resonanceEvents)}
            {renderEventList('Trigger Runes', p2.triggerEvents)}
            {renderEventList('Seal Runes', p2.sealEvents)}
            {renderEventList('Temporary Runes', p2.temporaryEvents, true)}
            {renderEventList('Mirror Buffs', p2.mirrorBuffEvents)}
          </div>
        </div>
      </div>
    </div>
  )
}
