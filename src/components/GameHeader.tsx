import { useGameContext } from '../context/GameContext'
import { useGamePersistence } from '../hooks/useGamePersistence'
import { useTurnManagement } from '../hooks/useTurnManagement'

export function GameHeader() {
  const { metadata, activePlayer, setShowCardLibrary, setGameState } = useGameContext()
  const { savedStates, exportGameState, importGameState } = useGamePersistence()
  const { handleNextPhase, handleNextTurn, handlePass } = useTurnManagement()

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h1 style={{ margin: 0 }}>Artibound - Hero Card Game</h1>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {/* Action Display - Prominent */}
        {metadata.actionPlayer && (
          <div style={{ 
            fontSize: '16px', 
            fontWeight: 'bold',
            padding: '8px 16px',
            backgroundColor: metadata.actionPlayer === 'player1' ? '#f44336' : '#4a90e2',
            color: 'white',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '20px' }}>🎯</span>
            Action: {metadata.actionPlayer === 'player1' ? 'Player 1' : 'Player 2'}
          </div>
        )}
        {/* Initiative Display - Separate */}
        {metadata.initiativePlayer && (
          <div style={{ 
            fontSize: '14px', 
            fontWeight: 'bold',
            padding: '6px 12px',
            backgroundColor: metadata.initiativePlayer === 'player1' ? '#ff9800' : '#9c27b0',
            color: 'white',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ fontSize: '16px' }}>⚡</span>
            Initiative: {metadata.initiativePlayer === 'player1' ? 'P1' : 'P2'}
          </div>
        )}
        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
          Turn {metadata.currentTurn} - {activePlayer === 'player1' ? 'Player 1' : 'Player 2'}
        </div>
        <div style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'capitalize' }}>
          Phase: {metadata.currentPhase}
          {metadata.currentTurn === 1 && metadata.turn1DeploymentPhase && metadata.turn1DeploymentPhase !== 'complete' && (
            <span style={{ marginLeft: '8px', color: '#ff9800' }}>
              (Deployment: {metadata.turn1DeploymentPhase === 'p1_lane1' ? 'P1 → Lane 1' :
                            metadata.turn1DeploymentPhase === 'p2_lane1' ? 'P2 → Lane 1 (counter)' :
                            metadata.turn1DeploymentPhase === 'p2_lane2' ? 'P2 → Lane 2' :
                            'P1 → Lane 2 (counter)'})
            </span>
          )}
        </div>
        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
          P1 Mana: {metadata.player1Mana}/{metadata.player1MaxMana}
          {metadata.player1Mana > metadata.player1MaxMana && ` (+${metadata.player1Mana - metadata.player1MaxMana})`}
          {' | '}
          P2 Mana: {metadata.player2Mana}/{metadata.player2MaxMana}
          {metadata.player2Mana > metadata.player2MaxMana && ` (+${metadata.player2Mana - metadata.player2MaxMana})`}
        </div>
        <button
          onClick={handleNextTurn}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
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
                padding: '8px 16px',
                backgroundColor: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
              title={`${metadata.turn1DeploymentPhase === 'p2_lane1' ? 'Player 2' : 'Player 1'} - Skip counter-deployment`}
            >
              Pass Counter-Deploy ({metadata.turn1DeploymentPhase === 'p2_lane1' ? 'P2' : 'P1'})
            </button>
          )
        )}
        {/* Pass Button - Show for whoever has action during play phase */}
        {metadata.currentPhase === 'play' && metadata.actionPlayer && 
         !(metadata.currentTurn === 1 && metadata.turn1DeploymentPhase && metadata.turn1DeploymentPhase !== 'complete') && (
          <button
            onClick={() => handlePass(metadata.actionPlayer!)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
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
          onClick={() => setShowCardLibrary(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#9c27b0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Card Library
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

