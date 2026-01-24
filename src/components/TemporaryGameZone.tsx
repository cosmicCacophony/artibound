import { TemporaryZone, TokenDefinition } from '../game/types'

interface TemporaryGameZoneProps {
  zone: TemporaryZone
  onConfirm: (selection?: string) => void
  onCancel: () => void
}

const renderToken = (token: TokenDefinition) => (
  <div
    key={token.id}
    style={{
      border: '1px solid #888',
      borderRadius: '6px',
      padding: '8px',
      minWidth: '90px',
      textAlign: 'center',
      backgroundColor: '#f5f5f5',
    }}
  >
    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{token.name}</div>
    <div style={{ fontSize: '12px', color: '#555' }}>
      {token.attack}/{token.health}
    </div>
    {token.keywords && token.keywords.length > 0 && (
      <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
        {token.keywords.join(', ')}
      </div>
    )}
  </div>
)

export function TemporaryGameZone({ zone, onConfirm, onCancel }: TemporaryGameZoneProps) {
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
          maxWidth: '680px',
          width: '90%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0 }}>{zone.title}</h2>
        <p style={{ color: '#666' }}>{zone.description}</p>

        {zone.type === 'tokenize' && zone.tokens && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
            {zone.tokens.map(renderToken)}
          </div>
        )}

        {zone.type === 'scry' && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              onClick={() => onConfirm('top')}
              style={{
                padding: '10px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#4caf50',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Keep on Top
            </button>
            <button
              onClick={() => onConfirm('bottom')}
              style={{
                padding: '10px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#1976d2',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Put on Bottom
            </button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
