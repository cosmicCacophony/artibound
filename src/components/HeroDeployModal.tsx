import { PlayerId, Hero, Card } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { HeroCard } from './HeroCard'

interface HeroDeployModalProps {
  player: PlayerId
  hero: Card
  onComplete: () => void
}

export function HeroDeployModal({ player, hero, onComplete }: HeroDeployModalProps) {
  const { setGameState } = useGameContext()

  const playerLabel = player === 'player1' ? 'Player 1 (RB)' : 'Player 2 (GW)'
  const heroData = hero as Hero
  const colorLabel = heroData.colors?.join('/') || 'colorless'

  const handleDeploy = (lane: 'battlefieldA' | 'battlefieldB') => {
    setGameState(prev => {
      const deployZoneKey = player === 'player1' ? 'player1DeployZone' : 'player2DeployZone'
      const updatedDeployZone = prev[deployZoneKey].filter(c => c.id !== hero.id)
      const deployedHero = { ...hero, location: lane } as Card

      const updatedLane = {
        ...prev[lane],
        [player]: [...prev[lane][player], deployedHero],
      }

      return {
        ...prev,
        [deployZoneKey]: updatedDeployZone,
        [lane]: updatedLane,
      }
    })

    onComplete()
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#2a2a2a',
        borderRadius: '12px',
        padding: '24px',
        border: '2px solid #555',
        maxWidth: '450px',
        width: '90%',
        textAlign: 'center',
      }}>
        <h2 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '18px' }}>
          Deploy Hero -- {playerLabel}
        </h2>
        <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 16px 0' }}>
          Choose which lane to deploy your <span style={{ color: '#ffd700', fontWeight: 'bold' }}>{colorLabel}</span> hero to.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <HeroCard card={hero} showStats={true} />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => handleDeploy('battlefieldA')}
            style={{
              padding: '12px 32px',
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Lane A
          </button>
          <button
            onClick={() => handleDeploy('battlefieldB')}
            style={{
              padding: '12px 32px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Lane B
          </button>
        </div>
      </div>
    </div>
  )
}
