import { useState } from 'react'
import { useGameContext } from '../context/GameContext'
import { PlayerArea } from './PlayerArea'
import { BattlefieldView } from './BattlefieldView'
import { ItemShopModal } from './ItemShopModal'
import { CardLibraryView } from './CardLibraryView'
import { CombatSummaryModal } from './CombatSummaryModal'
import { TopBar } from './TopBar'
import { CombatPreviewOverlay } from './CombatPreviewOverlay'

export function Board() {
  const { 
    gameState,
    showCombatSummary,
    setShowCombatSummary,
    combatSummaryData,
    selectedCardId,
  } = useGameContext()
  
  const [showDebug, setShowDebug] = useState(false)
  const [isOpponentExpanded, setIsOpponentExpanded] = useState(false)
  const [isPreviewActive, setIsPreviewActive] = useState(false)
  const [hoveredUnitId, setHoveredUnitId] = useState<string | null>(null)

  return (
    <div className="board-root">
      <TopBar
        showDebug={showDebug}
        onToggleDebug={() => setShowDebug(prev => !prev)}
        onTogglePreview={() => setIsPreviewActive(prev => !prev)}
        isPreviewActive={isPreviewActive}
      />

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

      <div
        className={`player-zone player-zone--opponent ${isOpponentExpanded ? 'player-zone--expanded' : 'player-zone--collapsed'}`}
        onMouseEnter={() => setIsOpponentExpanded(true)}
        onMouseLeave={() => setIsOpponentExpanded(false)}
      >
        <PlayerArea player="player2" mode={isOpponentExpanded ? 'expanded' : 'collapsed'} showDebugControls={showDebug} />
      </div>

      <div className="battlefield-arena">
        <CombatPreviewOverlay
          gameState={gameState}
          hoveredUnitId={hoveredUnitId}
          selectedUnitId={selectedCardId}
          isPreviewActive={isPreviewActive}
        />
        <div className="battlefield-grid">
          <BattlefieldView
            battlefieldId="battlefieldA"
            showDebugControls={showDebug}
            onHoverUnit={setHoveredUnitId}
          />
          <BattlefieldView
            battlefieldId="battlefieldB"
            showDebugControls={showDebug}
            onHoverUnit={setHoveredUnitId}
          />
        </div>
      </div>

      <div className="player-zone player-zone--self">
        <PlayerArea player="player1" mode="expanded" showDebugControls={showDebug} />
      </div>
    </div>
  )
}
