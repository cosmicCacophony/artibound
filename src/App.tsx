import { useState } from 'react'
import { Board } from './components/Board'
import { RoguelikeDraftView } from './components/RoguelikeDraftView'
import { HeroBrowserView } from './components/HeroBrowserView'
import { GameProvider, useGameContext } from './context/GameContext'
import './App.css'

function AppContent() {
  const [view, setView] = useState<'game' | 'roguelike' | 'heroes'>('roguelike')
  const { initializeRandomGame } = useGameContext()

  const handleStartRandomGame = () => {
    initializeRandomGame()
    setView('game')
  }

  return (
    <div className="App">
      <div style={{ padding: '20px', borderBottom: '1px solid #ccc', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          onClick={() => setView('roguelike')}
          style={{
            padding: '8px 16px',
            backgroundColor: view === 'roguelike' ? '#2196F3' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Roguelike Draft
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
        <button
          onClick={() => setView('heroes')}
          style={{
            padding: '8px 16px',
            backgroundColor: view === 'heroes' ? '#9C27B0' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          📖 Browse Heroes
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
      {view === 'roguelike' ? (
        <RoguelikeDraftView onStartGame={() => setView('game')} />
      ) : view === 'heroes' ? (
        <HeroBrowserView onClose={() => setView('roguelike')} />
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

