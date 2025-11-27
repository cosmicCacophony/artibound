import { useState } from 'react'
import { Board } from './components/Board'
import DraftView from './components/DraftView'
import { GameProvider, useGameContext } from './context/GameContext'
import './App.css'

function AppContent() {
  const [view, setView] = useState<'game' | 'draft'>('draft')
  const { initializeRandomGame } = useGameContext()

  const handleStartRandomGame = () => {
    initializeRandomGame()
    setView('game')
  }

  return (
    <div className="App">
      <div style={{ padding: '20px', borderBottom: '1px solid #ccc', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          onClick={() => setView('draft')}
          style={{
            padding: '8px 16px',
            backgroundColor: view === 'draft' ? '#2196F3' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Draft
        </button>
        <button
          onClick={() => setView('game')}
          style={{
            padding: '8px 16px',
            backgroundColor: view === 'game' ? '#2196F3' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Game
        </button>
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={handleStartRandomGame}
            style={{
              padding: '8px 16px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
            title="Start a game with randomly generated decks (for quick testing)"
          >
            🎲 Start Random Game
          </button>
        </div>
      </div>
      {view === 'draft' ? (
        <DraftView onStartGame={() => setView('game')} />
      ) : (
        <Board />
      )}
    </div>
  )
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}

export default App

