import { useGameContext } from '../context/GameContext'
import { useGamePersistence } from '../hooks/useGamePersistence'
import { useTurnManagement } from '../hooks/useTurnManagement'
import { getWinReasonLabel } from '../game/winCondition'

export function GameHeader() {
  const { metadata, activePlayer, setShowCardLibrary, setGameState } = useGameContext()
  const { savedStates, exportGameState, importGameState } = useGamePersistence()
  const { handleNextPhase, handleNextTurn, handlePass, handleEndDeployPhase } = useTurnManagement()
  const showDeployOwner = metadata.currentPhase !== 'deploy' || metadata.currentTurn === 1
  const activePlayerLabel = activePlayer === 'player1' ? 'P1' : 'P2'

  return (
    <div style={{ marginBottom: '20px' }}>
      {metadata.gameOver && metadata.winner && (
        <div
          style={{
            marginBottom: '12px',
            padding: '10px 14px',
            borderRadius: '6px',
            backgroundColor: metadata.winner === 'player1' ? '#ffebee' : '#e3f2fd',
            border: `2px solid ${metadata.winner === 'player1' ? '#d32f2f' : '#1976d2'}`,
            fontWeight: 'bold',
          }}
        >
          Winner: {metadata.winner === 'player1' ? 'Player 1' : 'Player 2'} - {getWinReasonLabel(metadata.winReason)}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1 style={{ margin: 0 }}>Artibound - Hero Card Game</h1>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {/* Action Display - Prominent */}
        {metadata.actionPlayer && (
          <div style={{ 
            fontSize: '9px', 
            fontWeight: 'bold',
            padding: '2px 4px',
            backgroundColor: metadata.actionPlayer === 'player1' ? '#f44336' : '#4a90e2',
            color: 'white',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}>
            <span style={{ fontSize: '10px' }}>🎯</span>
            {metadata.actionPlayer === 'player1' ? 'P1' : 'P2'}
          </div>
        )}
        {/* Initiative Display - Separate */}
        {metadata.initiativePlayer && (
          <div style={{ 
            fontSize: '9px', 
            fontWeight: 'bold',
            padding: '2px 4px',
            backgroundColor: metadata.initiativePlayer === 'player1' ? '#ff9800' : '#9c27b0',
            color: 'white',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}>
            <span style={{ fontSize: '10px' }}>⚡</span>
            {metadata.initiativePlayer === 'player1' ? 'P1' : 'P2'}
          </div>
        )}
        <div style={{ fontSize: '10px', fontWeight: 'bold' }}>
          {showDeployOwner ? `T${metadata.currentTurn} ${activePlayerLabel}` : `T${metadata.currentTurn}`}
        </div>
        <div style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'capitalize' }}>
          {metadata.currentPhase}
        </div>
        <div style={{ fontSize: '10px', fontWeight: 'bold' }}>
          P1:{metadata.player1Mana}/{metadata.player1MaxMana} P2:{metadata.player2Mana}/{metadata.player2MaxMana}
        </div>
        {/* End Deploy Phase Button - Show during deploy phase */}
        {metadata.currentPhase === 'deploy' && (
          <button
            onClick={handleEndDeployPhase}
            disabled={!!metadata.gameOver}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
            title="End deployment phase and begin play phase"
          >
            End Deploy Phase
          </button>
        )}
        <button
          onClick={handleNextTurn}
          disabled={!!metadata.gameOver}
          style={{
            padding: '2px 4px',
            backgroundColor: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '2px',
            cursor: 'pointer',
            fontSize: '9px',
            fontWeight: 'bold',
          }}
        >
          Turn
        </button>
        {/* Pass Button - Show during turn 1 deployment (counter-deployment) or play phase */}
        {metadata.currentTurn === 1 && metadata.turn1DeploymentPhase && metadata.turn1DeploymentPhase !== 'complete' && (
          (metadata.turn1DeploymentPhase === 'p2_lane1' || metadata.turn1DeploymentPhase === 'p1_lane2') && (
            <button
              onClick={() => handlePass(metadata.turn1DeploymentPhase === 'p2_lane1' ? 'player2' : 'player1')}
              disabled={!!metadata.gameOver}
              style={{
                padding: '2px 4px',
                backgroundColor: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
                fontSize: '9px',
                fontWeight: 'bold',
              }}
              title="Skip counter-deployment"
            >
              Pass
            </button>
          )
        )}
        {/* Pass Button - Show for whoever has action during play phase */}
        {metadata.currentPhase === 'play' && metadata.actionPlayer && 
         !(metadata.currentTurn === 1 && metadata.turn1DeploymentPhase && metadata.turn1DeploymentPhase !== 'complete') && (
          <button
            onClick={() => handlePass(metadata.actionPlayer!)}
            disabled={!!metadata.gameOver}
            style={{
              padding: '2px 4px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer',
              fontSize: '9px',
              fontWeight: 'bold',
            }}
            title="Pass"
          >
            Pass
          </button>
        )}
        <button
          onClick={handleNextPhase}
          disabled={!!metadata.gameOver}
          style={{
            padding: '2px 4px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '2px',
            cursor: 'pointer',
            fontSize: '9px',
          }}
        >
          Phase
        </button>
        <button
          onClick={exportGameState}
          style={{
            padding: '2px 4px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '2px',
            cursor: 'pointer',
            fontSize: '9px',
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
              padding: '2px',
              border: '1px solid #ddd',
              borderRadius: '2px',
              fontSize: '9px',
            }}
          >
            <option value="">Import...</option>
            {savedStates.map(state => (
              <option key={state.key} value={state.key}>{state.display}</option>
            ))}
          </select>
        )}
      </div>
    </div>
    </div>
  )
}

