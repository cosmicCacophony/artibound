import { useGameContext } from '../context/GameContext'
import { useTurnManagement } from '../hooks/useTurnManagement'

export function GameHeader() {
  const { metadata, initializePrototype } = useGameContext()
  const { handleStartCombat, handleConfirmAttackers, handleConfirmBlockers, handleSkipCombat, handleEndTurn } = useTurnManagement()
  const p1Runes = [
    ...(metadata.laneRunes?.battlefieldA.player1 || []),
    ...(metadata.temporaryRunes?.player1 || []),
  ]
  const p2Runes = [
    ...(metadata.laneRunes?.battlefieldA.player2 || []),
    ...(metadata.temporaryRunes?.player2 || []),
  ]

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '14px 18px', backgroundColor: '#111827', color: '#fff', borderRadius: '12px' }}>
      <div>
        <h2 style={{ margin: 0 }}>Artibound</h2>
        <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px' }}>
          Single-lane prototype | Turn {metadata.currentTurn} | {metadata.currentPhase}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <div style={{ fontSize: '13px', fontWeight: 700 }}>
          <span style={{ color: '#ef4444' }}>P1 {metadata.player1Mana}/{metadata.player1MaxMana} | {p1Runes.join(', ') || 'no runes'}</span>
          {' | '}
          <span style={{ color: '#86efac' }}>P2 {metadata.player2Mana}/{metadata.player2MaxMana} | {p2Runes.join(', ') || 'no runes'}</span>
        </div>

        {metadata.actionPlayer && (
          <div style={{ fontSize: '13px', fontWeight: 700, padding: '8px 10px', borderRadius: '999px', backgroundColor: metadata.actionPlayer === 'player1' ? '#7f1d1d' : '#1d4ed8' }}>
            Action: {metadata.actionPlayer === 'player1' ? 'P1' : 'P2'}
          </div>
        )}

        {metadata.currentPhase === 'play' && !metadata.gameOver && (
          <button
            onClick={handleStartCombat}
            style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', backgroundColor: '#f59e0b', color: '#111827', cursor: 'pointer', fontWeight: 700 }}
          >
            Declare Attacks
          </button>
        )}

        {metadata.currentPhase === 'declare_attackers' && !metadata.gameOver && (
          <button
            onClick={handleConfirmAttackers}
            style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', backgroundColor: '#f59e0b', color: '#111827', cursor: 'pointer', fontWeight: 700 }}
          >
            Confirm Attackers
          </button>
        )}

        {metadata.currentPhase === 'declare_blockers' && !metadata.gameOver && (
          <button
            onClick={handleConfirmBlockers}
            style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', backgroundColor: '#8b5cf6', color: '#fff', cursor: 'pointer', fontWeight: 700 }}
          >
            Confirm Blockers
          </button>
        )}

        <button
          onClick={handleSkipCombat}
          style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', backgroundColor: '#475569', color: '#fff', cursor: 'pointer', fontWeight: 700 }}
        >
          Skip Combat
        </button>

        <button
          onClick={handleEndTurn}
          style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', backgroundColor: '#334155', color: '#fff', cursor: 'pointer', fontWeight: 700 }}
        >
          End Turn
        </button>

        <button
          onClick={initializePrototype}
          style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', backgroundColor: '#e11d48', color: '#fff', cursor: 'pointer', fontWeight: 700 }}
        >
          Restart
        </button>
      </div>
    </div>
  )
}
