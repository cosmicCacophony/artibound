import { useState } from 'react'
import { Board } from './components/Board.tsx'
import { GameProvider, useGameContext } from './context/GameContext'
import './App.css'

function AppContent() {
  const { initializePrototype } = useGameContext()
  const [started, setStarted] = useState(false)
  const startPrototype = () => {
    initializePrototype()
    setStarted(true)
  }

  if (!started) {
    return (
      <div className="App" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#1a1a2e', color: '#fff', padding: '32px', borderRadius: '16px', width: 'min(520px, 92vw)', textAlign: 'left' }}>
          <h1 style={{ marginTop: 0, marginBottom: '12px' }}>Artibound Prototype</h1>
          <p style={{ marginTop: 0, marginBottom: '20px', color: '#cbd5e1', lineHeight: 1.5 }}>
            Single-lane manual combat prototype with commander zones, rune scaling, attacker/blocker combat, and two focused deck identities.
          </p>
          <button
            onClick={startPrototype}
            style={{
              padding: '12px 18px',
              borderRadius: '10px',
              border: 'none',
              background: '#e11d48',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Start Prototype
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <Board />
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
