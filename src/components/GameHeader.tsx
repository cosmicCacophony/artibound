import { useEffect } from 'react'
import { useGameContext } from '../context/GameContext'
import { useTurnManagement } from '../hooks/useTurnManagement'

export function GameHeader() {
  const { metadata, initializeRunePrototype } = useGameContext()
  const { handleNextPhase, handleNextTurn, handlePass, handleEndDeployPhase } = useTurnManagement()

  // Auto-trigger combat when both players pass during play phase
  useEffect(() => {
    if (!metadata.gameOver && metadata.currentPhase === 'play' && metadata.player1Passed && metadata.player2Passed) {
      handleNextPhase()
    }
  }, [metadata.gameOver, metadata.currentPhase, metadata.player1Passed, metadata.player2Passed, handleNextPhase])

  const isGameOver = !!metadata.gameOver

  const phaseLabel = metadata.currentPhase === 'resource' ? 'Resource'
    : metadata.currentPhase === 'deploy' ? 'Deploy'
    : metadata.currentPhase === 'play' ? 'Play'
    : metadata.currentPhase

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      padding: '12px 16px',
      backgroundColor: '#1a1a2e',
      borderRadius: '8px',
      color: 'white',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px' }}>Artibound</h2>
        <span style={{ fontSize: '13px', color: '#E91E63', fontWeight: 'bold' }}>
          RB vs GW Prototype
        </span>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {/* Action indicator */}
        {metadata.actionPlayer && (
          <div style={{
            padding: '6px 14px',
            backgroundColor: metadata.actionPlayer === 'player1' ? '#e53935' : '#1e88e5',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '13px',
          }}>
            Action: {metadata.actionPlayer === 'player1' ? 'P1 (RB)' : 'P2 (GW)'}
          </div>
        )}

        {/* Turn + Phase */}
        <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
          Turn {metadata.currentTurn} | {phaseLabel}
        </div>

        {/* Mana */}
        <div style={{ fontSize: '13px' }}>
          <span style={{ color: '#ef5350' }}>P1: {metadata.player1Mana}/{metadata.player1MaxMana}</span>
          {' | '}
          <span style={{ color: '#42a5f5' }}>P2: {metadata.player2Mana}/{metadata.player2MaxMana}</span>
        </div>

        {/* End Deploy Phase */}
        {metadata.currentPhase === 'deploy' && !isGameOver && (
          <button
            onClick={handleEndDeployPhase}
            style={{
              padding: '6px 14px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 'bold',
            }}
          >
            End Deploy
          </button>
        )}

        {/* Pass (play phase) */}
        {metadata.currentPhase === 'play' && metadata.actionPlayer && !isGameOver && (
          <button
            onClick={() => handlePass(metadata.actionPlayer!)}
            style={{
              padding: '6px 14px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 'bold',
            }}
          >
            Pass ({metadata.actionPlayer === 'player1' ? 'P1' : 'P2'})
          </button>
        )}

        {/* Next Turn */}
        <button
          onClick={handleNextTurn}
          disabled={isGameOver}
          style={{
            padding: '6px 14px',
            backgroundColor: isGameOver ? '#555' : '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 'bold',
          }}
        >
          Next Turn
        </button>

        {/* Force combat (debug) */}
        <button
          onClick={handleNextPhase}
          disabled={isGameOver}
          style={{
            padding: '6px 14px',
            backgroundColor: isGameOver ? '#555' : '#616161',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Force Combat
        </button>

        {/* Restart */}
        <button
          onClick={initializeRunePrototype}
          style={{
            padding: '6px 14px',
            backgroundColor: '#9c27b0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Restart
        </button>
      </div>
    </div>
  )
}
