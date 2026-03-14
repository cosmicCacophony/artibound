import { PlayerId } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { useDeployment } from '../hooks/useDeployment'
import { HeroCard } from './HeroCard'

interface CommandZoneProps {
  player: PlayerId
}

export function CommandZone({ player }: CommandZoneProps) {
  const { gameState, metadata } = useGameContext()
  const { handleDeploy, handlePlaySeal } = useDeployment()
  const commanders = player === 'player1' ? gameState.player1DeployZone : gameState.player2DeployZone
  const seals = (player === 'player1' ? metadata.player1Seals : metadata.player2Seals).filter(seal => !seal.inPlay)
  const playerMana = player === 'player1' ? metadata.player1Mana : metadata.player2Mana
  const playerRunes = [
    ...(metadata.laneRunes?.battlefieldA[player] || []),
    ...(metadata.temporaryRunes?.[player] || []),
  ]
  const color = player === 'player1' ? '#ef4444' : '#22c55e'

  return (
    <div style={{ border: `1px solid ${color}55`, borderRadius: '12px', padding: '12px', backgroundColor: '#ffffff', marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ fontWeight: 700, color }}>
          {player === 'player1' ? 'Player 1 Command Zone' : 'Player 2 Command Zone'}
        </div>
        <div style={{ fontSize: '12px', color: '#475569' }}>
          Mana {playerMana} | Runes {playerRunes.join(', ') || 'none'}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {commanders.map(card => (
          <div key={card.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <HeroCard card={card} showStats={true} onClick={() => handleDeploy('battlefieldA', undefined, card)} />
            <div style={{ fontSize: '11px', color: '#475569', textAlign: 'center' }}>
              Cost: {card.manaCost || 0} mana {card.runeCost?.length ? `| ${card.runeCost.join(' ')}` : ''}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {seals.map(seal => (
          <button
            key={seal.id}
            onClick={() => handlePlaySeal(seal.id, player)}
            style={{
              padding: '8px 10px',
              borderRadius: '999px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '12px',
            }}
          >
            Play {seal.name} ({seal.manaCost || 2})
          </button>
        ))}
      </div>
    </div>
  )
}
