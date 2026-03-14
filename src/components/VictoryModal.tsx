import { GameMetadata, PlayerId, PROTOTYPE_TOWER_HP, TOWER_HP } from '../game/types'
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

  const totalDmg = metadata.totalTowerDamageDealt || { player1: 0, player2: 0 }
  const isPrototype = !!metadata.isSingleLanePrototype
  const towerMaxHp = isPrototype ? PROTOTYPE_TOWER_HP : TOWER_HP

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
      <div style={{ backgroundColor: '#111827', borderRadius: '18px', padding: '36px', maxWidth: '520px', width: '92vw', textAlign: 'center', border: '2px solid #f59e0b', color: '#fff' }}>
        <h1 style={{ marginTop: 0, marginBottom: '10px' }}>
          {winner === 'player1' ? 'Player 1 Wins' : 'Player 2 Wins'}
        </h1>
        <p style={{ marginTop: 0, marginBottom: '24px', color: '#cbd5e1' }}>
          {winReason === 'towers_destroyed'
            ? (isPrototype ? 'Enemy tower destroyed.' : 'Enemy towers destroyed.')
            : `Turn limit reached (${MAX_TURNS} turns).`}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '22px' }}>
          <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#1f2937' }}>
            <div style={{ fontWeight: 700, marginBottom: '8px' }}>Player 1</div>
            <div style={{ fontSize: '13px', color: '#cbd5e1' }}>Tower: {metadata.towerA_player1_HP}/{towerMaxHp}</div>
            {!isPrototype && <div style={{ fontSize: '13px', color: '#cbd5e1' }}>Tower B: {metadata.towerB_player1_HP}/{TOWER_HP}</div>}
            <div style={{ fontSize: '13px', color: '#fde68a', marginTop: '8px' }}>Damage dealt: {totalDmg.player1}</div>
          </div>
          <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#1f2937' }}>
            <div style={{ fontWeight: 700, marginBottom: '8px' }}>Player 2</div>
            <div style={{ fontSize: '13px', color: '#cbd5e1' }}>Tower: {metadata.towerA_player2_HP}/{towerMaxHp}</div>
            {!isPrototype && <div style={{ fontSize: '13px', color: '#cbd5e1' }}>Tower B: {metadata.towerB_player2_HP}/{TOWER_HP}</div>}
            <div style={{ fontSize: '13px', color: '#fde68a', marginTop: '8px' }}>Damage dealt: {totalDmg.player2}</div>
          </div>
        </div>

        <button
          onClick={onRestart}
          style={{ padding: '12px 22px', borderRadius: '12px', border: 'none', backgroundColor: '#e11d48', color: '#fff', cursor: 'pointer', fontWeight: 700 }}
        >
          Play Again
        </button>
      </div>
    </div>
  )
}
