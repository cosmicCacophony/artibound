import { useGameContext } from '../context/GameContext'
import { useGamePersistence } from '../hooks/useGamePersistence'
import { useTurnManagement } from '../hooks/useTurnManagement'

export function GameHeader() {
  const { metadata, activePlayer } = useGameContext()
  const { savedStates, exportGameState, importGameState } = useGamePersistence()
  const { handleNextPhase } = useTurnManagement()

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h1 style={{ margin: 0 }}>Artibound - Hero Card Game</h1>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
          Turn {metadata.currentTurn} - {activePlayer === 'player1' ? 'Player 1 (Warrior)' : 'Player 2 (Mage)'}
        </div>
        <div style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'capitalize' }}>
          Phase: {metadata.currentPhase}
        </div>
        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
          {activePlayer === 'player1' ? (
            <>Mana: {metadata.player1Mana}/{metadata.player1MaxMana}</>
          ) : (
            <>Mana: {metadata.player2Mana}/{metadata.player2MaxMana}</>
          )}
        </div>
        <button
          onClick={handleNextPhase}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Next Phase
        </button>
        <button
          onClick={exportGameState}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Export State
        </button>
        {savedStates.length > 0 && (
          <select
            onChange={(e) => {
              if (e.target.value) importGameState(e.target.value)
            }}
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            <option value="">Import State...</option>
            {savedStates.map(state => (
              <option key={state.key} value={state.key}>{state.display}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}

