import { useGameContext } from '../context/GameContext'
import { useGamePersistence } from '../hooks/useGamePersistence'
import { useTurnManagement } from '../hooks/useTurnManagement'

export function GameHeader() {
  const { metadata, activePlayer, setShowCardLibrary, setGameState } = useGameContext()
  const { savedStates, exportGameState, importGameState } = useGamePersistence()
  const { handleNextPhase, handleNextTurn, handlePass, handleEndDeployPhase } = useTurnManagement()

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexShrink: 0 }}>
      <h1 style={{ margin: 0, fontSize: '18px' }}>Artibound</h1>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', fontSize: '11px' }}>
        {/* Action Display - Prominent */}
        {metadata.actionPlayer && (
          <div style={{ 
            fontSize: '11px', 
            fontWeight: 'bold',
            padding: '4px 8px',
            backgroundColor: metadata.actionPlayer === 'player1' ? '#f44336' : '#4a90e2',
            color: 'white',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ fontSize: '12px' }}>🎯</span>
            {metadata.actionPlayer === 'player1' ? 'P1' : 'P2'}
          </div>
        )}
        {/* Initiative Display - Separate */}
        {metadata.initiativePlayer && (
          <div style={{ 
            fontSize: '11px', 
            fontWeight: 'bold',
            padding: '4px 8px',
            backgroundColor: metadata.initiativePlayer === 'player1' ? '#ff9800' : '#9c27b0',
            color: 'white',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ fontSize: '12px' }}>⚡</span>
            {metadata.initiativePlayer === 'player1' ? 'P1' : 'P2'}
          </div>
        )}
        <div style={{ fontSize: '11px', fontWeight: 'bold' }}>
          T{metadata.currentTurn} {activePlayer === 'player1' ? 'P1' : 'P2'}
        </div>
        <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'capitalize' }}>
          {metadata.currentPhase}
        </div>
        <div style={{ fontSize: '11px', fontWeight: 'bold' }}>
          P1: {metadata.player1Mana}/{metadata.player1MaxMana} | P2: {metadata.player2Mana}/{metadata.player2MaxMana}
        </div>
        {/* End Deploy Phase Button - Show during deploy phase */}
        {metadata.currentPhase === 'deploy' && (
        <button
          onClick={handleEndDeployPhase}
          style={{
            padding: '4px 8px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold',
          }}
          title="End deployment phase and begin play phase"
        >
          End Deploy
        </button>
        )}
        <button
          onClick={handleNextTurn}
          style={{
            padding: '4px 8px',
            backgroundColor: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold',
          }}
        >
          Next Turn
        </button>
        {/* Pass Button - Show during turn 1 deployment (counter-deployment) or play phase */}
        {metadata.currentTurn === 1 && metadata.turn1DeploymentPhase && metadata.turn1DeploymentPhase !== 'complete' && (
          (metadata.turn1DeploymentPhase === 'p2_lane1' || metadata.turn1DeploymentPhase === 'p1_lane2') && (
            <button
              onClick={() => handlePass(metadata.turn1DeploymentPhase === 'p2_lane1' ? 'player2' : 'player1')}
              style={{
                padding: '4px 8px',
                backgroundColor: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'bold',
              }}
              title={`${metadata.turn1DeploymentPhase === 'p2_lane1' ? 'Player 2' : 'Player 1'} - Skip counter-deployment`}
            >
              Pass ({metadata.turn1DeploymentPhase === 'p2_lane1' ? 'P2' : 'P1'})
            </button>
          )
        )}
        {/* Pass Button - Show for whoever has action during play phase */}
        {metadata.currentPhase === 'play' && metadata.actionPlayer && 
         !(metadata.currentTurn === 1 && metadata.turn1DeploymentPhase && metadata.turn1DeploymentPhase !== 'complete') && (
          <button
            onClick={() => handlePass(metadata.actionPlayer!)}
            style={{
              padding: '4px 8px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 'bold',
            }}
            title={`${metadata.actionPlayer === 'player1' ? 'Player 1' : 'Player 2'} - Pass without action (retain initiative for next turn, or go to combat if both passed)`}
          >
            Pass ({metadata.actionPlayer === 'player1' ? 'P1' : 'P2'})
          </button>
        )}
        <button
          onClick={handleNextPhase}
          style={{
            padding: '4px 8px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
          }}
        >
          Next Phase
        </button>
        <button
          onClick={exportGameState}
          style={{
            padding: '4px 8px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
          }}
        >
          Export
        </button>
        {savedStates.length > 0 && (
          <select
            onChange={(e) => {
              if (e.target.value) importGameState(e.target.value)
            }}
            style={{
              padding: '4px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '11px',
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

