import { useState } from 'react'
import { Board } from './components/Board'
import DraftView from './components/DraftView'
import { GameProvider } from './context/GameContext'
import './App.css'

function App() {
  const [view, setView] = useState<'game' | 'draft'>('draft')

  return (
    <div className="App">
      <div style={{ padding: '20px', borderBottom: '1px solid #ccc', display: 'flex', gap: '12px' }}>
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
      </div>
      {view === 'draft' ? (
        <GameProvider>
          <DraftView />
        </GameProvider>
      ) : (
        <Board />
      )}
    </div>
  )
}

export default App

