import { PlayerId, GameMetadata, TOWER_HP } from '../game/types'
import { MAX_TURNS } from '../game/winCondition'

interface VictoryModalProps {
  isOpen: boolean
  winner: PlayerId
  winReason: 'towers_destroyed' | 'turn_limit' | null
  metadata: GameMetadata
  onRestart: () => void
}

export function VictoryModal({ isOpen, winner, winReason, metadata, onRestart }: VictoryModalProps) {
  if (!isOpen) return null

  const winnerLabel = winner === 'player1' ? 'Player 1' : 'Player 2'
  const loser = winner === 'player1' ? 'player2' : 'player1'
  const loserLabel = loser === 'player1' ? 'Player 1' : 'Player 2'

  const totalDmg = metadata.totalTowerDamageDealt || { player1: 0, player2: 0 }

  const p1TowerAHp = metadata.towerA_player1_HP
  const p1TowerBHp = metadata.towerB_player1_HP
  const p2TowerAHp = metadata.towerA_player2_HP
  const p2TowerBHp = metadata.towerB_player2_HP

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000,
      }}
    >
      <div
        style={{
          backgroundColor: '#1a1a2e',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '480px',
          width: '90vw',
          textAlign: 'center',
          boxShadow: '0 0 60px rgba(255, 215, 0, 0.3)',
          border: '2px solid #ffd700',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>
          {winReason === 'towers_destroyed' ? '\u{1F3F0}' : '\u{23F0}'}
        </div>

        <h1 style={{
          margin: '0 0 8px 0',
          color: '#ffd700',
          fontSize: '28px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '2px',
        }}>
          {winnerLabel} Wins!
        </h1>

        <div style={{
          color: '#94a3b8',
          fontSize: '14px',
          marginBottom: '24px',
        }}>
          {winReason === 'towers_destroyed'
            ? `Both of ${loserLabel}'s towers destroyed`
            : `Turn limit reached (${MAX_TURNS} turns) — most tower damage wins`}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '24px',
        }}>
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: winner === 'player1' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(244, 67, 54, 0.1)',
            border: `1px solid ${winner === 'player1' ? '#4caf50' : '#f44336'}`,
          }}>
            <div style={{ color: '#e2e8f0', fontWeight: 700, marginBottom: '8px' }}>Player 1</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              Tower A: {p1TowerAHp}/{TOWER_HP}
              {p1TowerAHp <= 0 && <span style={{ color: '#f44336' }}> DESTROYED</span>}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              Tower B: {p1TowerBHp}/{TOWER_HP}
              {p1TowerBHp <= 0 && <span style={{ color: '#f44336' }}> DESTROYED</span>}
            </div>
            <div style={{ fontSize: '12px', color: '#ffd700', marginTop: '6px', fontWeight: 600 }}>
              Damage Dealt: {totalDmg.player1}
            </div>
          </div>

          <div style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: winner === 'player2' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(244, 67, 54, 0.1)',
            border: `1px solid ${winner === 'player2' ? '#4caf50' : '#f44336'}`,
          }}>
            <div style={{ color: '#e2e8f0', fontWeight: 700, marginBottom: '8px' }}>Player 2</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              Tower A: {p2TowerAHp}/{TOWER_HP}
              {p2TowerAHp <= 0 && <span style={{ color: '#f44336' }}> DESTROYED</span>}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              Tower B: {p2TowerBHp}/{TOWER_HP}
              {p2TowerBHp <= 0 && <span style={{ color: '#f44336' }}> DESTROYED</span>}
            </div>
            <div style={{ fontSize: '12px', color: '#ffd700', marginTop: '6px', fontWeight: 600 }}>
              Damage Dealt: {totalDmg.player2}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px' }}>
          Game ended on turn {metadata.currentTurn}
        </div>

        <button
          onClick={onRestart}
          style={{
            padding: '12px 32px',
            backgroundColor: '#ffd700',
            color: '#1a1a2e',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  )
}
