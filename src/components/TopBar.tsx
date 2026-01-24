import { useGameContext } from '../context/GameContext'
import { useGamePersistence } from '../hooks/useGamePersistence'
import { useTurnManagement } from '../hooks/useTurnManagement'

interface TopBarProps {
  showDebug: boolean
  onToggleDebug: () => void
  onTogglePreview: () => void
  isPreviewActive: boolean
}

export function TopBar({
  showDebug,
  onToggleDebug,
  onTogglePreview,
  isPreviewActive,
}: TopBarProps) {
  const { metadata, activePlayer, showCardLibrary, setShowCardLibrary } = useGameContext()
  const { savedStates, exportGameState, importGameState } = useGamePersistence()
  const { handleNextPhase, handleNextTurn, handlePass, handleEndDeployPhase } = useTurnManagement()

  const passLabel = (() => {
    if (metadata.currentPhase !== 'play' || !metadata.actionPlayer) {
      return 'Pass'
    }
    const otherPassed = metadata.actionPlayer === 'player1'
      ? metadata.player2Passed
      : metadata.player1Passed
    return otherPassed ? 'Pass to Combat' : 'Pass'
  })()

  return (
    <div className="topbar">
      <div className="topbar__left">
        <div className="topbar__title">Artibound</div>
        <div className="topbar__pill">
          Turn {metadata.currentTurn}
        </div>
        <div className="topbar__pill topbar__pill--phase">
          {activePlayer === 'player1' ? 'P1' : 'P2'} {metadata.currentPhase}
        </div>
        {metadata.actionPlayer && (
          <div className={`topbar__pill ${metadata.actionPlayer === 'player1' ? 'topbar__pill--p1' : 'topbar__pill--p2'}`}>
            🎯 {metadata.actionPlayer === 'player1' ? 'P1' : 'P2'}
          </div>
        )}
        {metadata.initiativePlayer && (
          <div className={`topbar__pill ${metadata.initiativePlayer === 'player1' ? 'topbar__pill--p1' : 'topbar__pill--p2'}`}>
            ⚡ {metadata.initiativePlayer === 'player1' ? 'P1' : 'P2'}
          </div>
        )}
        <div className="topbar__resources">
          <span className="topbar__resource">P1 💎 {metadata.player1Mana}/{metadata.player1MaxMana}</span>
          <span className="topbar__resource">💰 {metadata.player1Gold}</span>
          <span className="topbar__resource">❤️ {metadata.player1NexusHP}</span>
        </div>
        <div className="topbar__resources">
          <span className="topbar__resource">P2 💎 {metadata.player2Mana}/{metadata.player2MaxMana}</span>
          <span className="topbar__resource">💰 {metadata.player2Gold}</span>
          <span className="topbar__resource">❤️ {metadata.player2NexusHP}</span>
        </div>
      </div>

      <div className="topbar__actions">
        <button className="topbar__button" onClick={onTogglePreview}>
          {isPreviewActive ? 'Exit Preview' : 'Preview'}
        </button>
        {metadata.currentTurn === 1 && metadata.turn1DeploymentPhase && metadata.turn1DeploymentPhase !== 'complete' && (
          (metadata.turn1DeploymentPhase === 'p2_lane1' || metadata.turn1DeploymentPhase === 'p1_lane2') && (
            <button
              className="topbar__button"
              onClick={() => handlePass(metadata.turn1DeploymentPhase === 'p2_lane1' ? 'player2' : 'player1')}
            >
              Pass
            </button>
          )
        )}
        {metadata.currentPhase === 'play' && metadata.actionPlayer &&
          !(metadata.currentTurn === 1 && metadata.turn1DeploymentPhase && metadata.turn1DeploymentPhase !== 'complete') && (
            <button className="topbar__button" onClick={() => handlePass(metadata.actionPlayer!)}>
              {passLabel}
            </button>
          )}
        <button className="topbar__button topbar__button--ghost" onClick={onToggleDebug}>
          {showDebug ? 'Hide Debug' : 'Debug'}
        </button>
      </div>

      {showDebug && (
        <div className="topbar__debug">
          {metadata.currentPhase === 'deploy' && (
            <button className="topbar__button" onClick={handleEndDeployPhase}>
              End Deploy
            </button>
          )}
          <button className="topbar__button" onClick={handleNextTurn}>
            Next Turn
          </button>
          <button className="topbar__button" onClick={handleNextPhase}>
            Next Phase
          </button>
          <button className="topbar__button" onClick={() => setShowCardLibrary(!showCardLibrary)}>
            {showCardLibrary ? 'Hide Library' : 'Show Library'}
          </button>
          <button className="topbar__button" onClick={exportGameState}>
            Export
          </button>
          {savedStates.length > 0 && (
            <select
              onChange={(e) => {
                if (e.target.value) importGameState(e.target.value)
              }}
              className="topbar__select"
            >
              <option value="">Import...</option>
              {savedStates.map(state => (
                <option key={state.key} value={state.key}>{state.display}</option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  )
}
