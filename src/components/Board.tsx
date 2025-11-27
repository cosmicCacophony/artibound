import { useGameContext } from '../context/GameContext'
import { GameHeader } from './GameHeader'
import { PlayerArea } from './PlayerArea'
import { BattlefieldView } from './BattlefieldView'
import { ItemShopModal } from './ItemShopModal'
import { CardLibrarySidebar } from './CardLibrarySidebar'
import { CardLibraryView } from './CardLibraryView'

export function Board() {
  const { player1SidebarCards, setPlayer1SidebarCards, player2SidebarCards, setPlayer2SidebarCards } = useGameContext()
  
  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', height: '100vh' }}>
      {/* Left Sidebar - Player 1 */}
      <CardLibrarySidebar 
        player="player1" 
        cards={player1SidebarCards} 
        setCards={setPlayer1SidebarCards} 
      />

      {/* Main Board */}
      <div style={{ flex: 1, padding: '15px', overflowY: 'auto', position: 'relative', minWidth: 0 }}>
        <GameHeader />

        <ItemShopModal />
        <CardLibraryView />

        {/* Player 2 Area (Top) */}
        <PlayerArea player="player2" />

        {/* Battlefields (Middle) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '15px',
          }}
        >
          <BattlefieldView battlefieldId="battlefieldA" />
          <BattlefieldView battlefieldId="battlefieldB" />
        </div>

        {/* Player 1 Area (Bottom) */}
        <PlayerArea player="player1" />
      </div>

      {/* Right Sidebar - Player 2 */}
      <CardLibrarySidebar 
        player="player2" 
        cards={player2SidebarCards} 
        setCards={setPlayer2SidebarCards} 
      />
    </div>
  )
}
