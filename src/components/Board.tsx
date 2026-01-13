import { useGameContext } from '../context/GameContext'
import { GameHeader } from './GameHeader'
import { PlayerArea } from './PlayerArea'
import { BattlefieldView } from './BattlefieldView'
import { ItemShopModal } from './ItemShopModal'
import { CardLibraryView } from './CardLibraryView'
import { CombatSummaryModal } from './CombatSummaryModal'

export function Board() {
  const { 
    showCombatSummary,
    setShowCombatSummary,
    combatSummaryData,
  } = useGameContext()
  
  const { showCardLibrary, setShowCardLibrary } = useGameContext()

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', height: '100vh', overflow: 'hidden' }}>
      {/* Main Board */}
      <div style={{ flex: 1, padding: '0', overflowY: 'hidden', position: 'relative', minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <GameHeader />

        <ItemShopModal />
        <CardLibraryView />
        {combatSummaryData && (
          <CombatSummaryModal
            isOpen={showCombatSummary}
            onClose={() => setShowCombatSummary(false)}
            battlefieldA={combatSummaryData.battlefieldA}
            battlefieldB={combatSummaryData.battlefieldB}
          />
        )}

        {/* Floating Library Button */}
        <button
          onClick={() => setShowCardLibrary(!showCardLibrary)}
          style={{
            position: 'fixed',
            top: '4px',
            right: '4px',
            zIndex: 1000,
            padding: '4px 6px',
            backgroundColor: showCardLibrary ? '#4a90e2' : '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '2px',
            cursor: 'pointer',
            fontSize: '9px',
            fontWeight: 'bold',
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }}
          title="Toggle Card Library"
        >
          📚
        </button>

        {/* Player 2 Area (Top) - Zero spacing */}
        <div style={{ flexShrink: 0, marginBottom: '0' }}>
          <PlayerArea player="player2" />
        </div>

        {/* Battlefields (Middle) - Main Focus */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2px',
            marginBottom: '0',
            minHeight: 0,
            overflowY: 'auto',
            alignContent: 'start',
          }}
        >
          <div style={{ minHeight: 0 }}>
            <BattlefieldView battlefieldId="battlefieldA" />
          </div>
          <div style={{ minHeight: 0 }}>
            <BattlefieldView battlefieldId="battlefieldB" />
          </div>
        </div>

        {/* Player 1 Area (Bottom) - Zero spacing */}
        <div style={{ flexShrink: 0, marginTop: '0' }}>
          <PlayerArea player="player1" />
        </div>
      </div>
    </div>
  )
}
