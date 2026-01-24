import { TemporaryZone, TokenDefinition } from '../game/types'

interface TemporaryGameZoneProps {
  zone: TemporaryZone
  onConfirm: (selection?: string) => void
  onCancel: () => void
}

  const renderToken = (token: TokenDefinition, owner: string) => (
  <div
    key={token.id}
    style={{
      border: '1px solid #888',
      borderRadius: '6px',
      padding: '8px',
      minWidth: '90px',
      textAlign: 'center',
      backgroundColor: '#f5f5f5',
      cursor: 'grab',
    }}
    draggable
    onDragStart={(e) => {
      const payload = JSON.stringify({ ...token, owner })
      e.dataTransfer.setData('tokenData', payload)
      e.dataTransfer.setData('text/token', payload)
      e.dataTransfer.setData('text/plain', `token:${payload}`)
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.dropEffect = 'move'
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
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        pointerEvents: 'none',
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
          pointerEvents: 'auto',
        }}
      >
        <h2 style={{ marginTop: 0 }}>{zone.title}</h2>
        <p style={{ color: '#666' }}>{zone.description}</p>

        {zone.type === 'tokenize' && zone.tokens && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
            {zone.tokens.map(token => renderToken(token, zone.owner))}
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
