import { useEffect, useState } from 'react'
import { useGameContext } from '../context/GameContext'
import { GameHeader } from './GameHeader'
import { PlayerArea } from './PlayerArea'
import { BattlefieldView } from './BattlefieldView'
import { CombatSummaryModal } from './CombatSummaryModal'
import { VictoryModal } from './VictoryModal'
import { ResourceChoiceModal } from './ResourceChoiceModal'
import { HeroDeployModal } from './HeroDeployModal'
import { getNextPhase } from '../game/turnStateMachine'
import { PlayerId, Card, Hero } from '../game/types'

type DeployStep = 'idle' | 'p1_choosing' | 'p2_choosing' | 'done'

export function Board() {
  const { 
    gameState,
    setGameState,
    showCombatSummary,
    setShowCombatSummary,
    combatSummaryData,
    metadata,
    initializeRunePrototype,
  } = useGameContext()

  const [deployStep, setDeployStep] = useState<DeployStep>('idle')

  const actionPlayer = metadata.actionPlayer
  const resourceChoices = metadata.resourceChoicesMade || { player1: false, player2: false }
  const showResourceModal = metadata.currentPhase === 'resource'
    && actionPlayer
    && !resourceChoices[actionPlayer]

  const isDeployPhase = metadata.currentPhase === 'deploy'
  const currentTurn = metadata.currentTurn

  const getDeployableHeroes = (player: PlayerId): Card[] => {
    const zone = player === 'player1' ? gameState.player1DeployZone : gameState.player2DeployZone
    return zone.filter(c => c.cardType === 'hero')
  }

  const p1Heroes = getDeployableHeroes('player1')
  const p2Heroes = getDeployableHeroes('player2')

  // Reset deployStep when we leave deploy phase
  useEffect(() => {
    if (!isDeployPhase && deployStep !== 'idle') {
      setDeployStep('idle')
    }
  }, [isDeployPhase, deployStep])

  // Main deploy phase controller
  useEffect(() => {
    if (!isDeployPhase || deployStep !== 'idle') return

    const p1Count = gameState.player1DeployZone.filter(c => c.cardType === 'hero').length
    const p2Count = gameState.player2DeployZone.filter(c => c.cardType === 'hero').length

    // No heroes to deploy -> skip to resource
    if (p1Count === 0 && p2Count === 0) {
      setDeployStep('done')
      return
    }

    // Turn 3+: auto-deploy all remaining heroes, then advance
    if (currentTurn >= 3) {
      setGameState(prev => {
        let newState = { ...prev }

        for (const player of ['player1', 'player2'] as const) {
          const deployZoneKey = player === 'player1' ? 'player1DeployZone' : 'player2DeployZone'
          const heroes = newState[deployZoneKey].filter(c => c.cardType === 'hero')

          for (const hero of heroes) {
            const heroCard = hero as Hero
            const secondaryColor = heroCard.colors?.[0]

            const laneAHasColor = newState.battlefieldA[player].some(c =>
              c.cardType === 'hero' && (c as Hero).colors?.includes(secondaryColor!)
            )
            const targetLane = laneAHasColor ? 'battlefieldB' : 'battlefieldA'
            const deployedHero = { ...hero, location: targetLane } as Card

            newState = {
              ...newState,
              [deployZoneKey]: newState[deployZoneKey].filter(c => c.id !== hero.id),
              [targetLane]: {
                ...newState[targetLane],
                [player]: [...newState[targetLane][player], deployedHero],
              },
            }
          }
        }

        const nextPhase = getNextPhase('deploy', 'END_DEPLOY', true)
        return {
          ...newState,
          metadata: { ...newState.metadata, currentPhase: nextPhase },
        }
      })
      setDeployStep('done')
      return
    }

    // Turn 2: start modal sequence
    if (p1Count > 0) {
      setDeployStep('p1_choosing')
    } else if (p2Count > 0) {
      setDeployStep('p2_choosing')
    } else {
      setDeployStep('done')
    }
  }, [isDeployPhase, currentTurn, deployStep, gameState.player1DeployZone, gameState.player2DeployZone, setGameState, gameState.battlefieldA, gameState.battlefieldB])

  // After turn 2 modal deployment completes, advance to resource
  useEffect(() => {
    if (!isDeployPhase || deployStep !== 'done') return

    const nextPhase = getNextPhase('deploy', 'END_DEPLOY', true)
    setGameState(prev => {
      if (prev.metadata.currentPhase !== 'deploy') return prev
      return {
        ...prev,
        metadata: { ...prev.metadata, currentPhase: nextPhase },
      }
    })
  }, [isDeployPhase, deployStep, setGameState])

  // Auto-advance from resource phase to play phase when both players have made choices
  useEffect(() => {
    if (metadata.currentPhase === 'resource' &&
        resourceChoices.player1 && resourceChoices.player2) {
      const nextPhase = getNextPhase('resource', 'RESOURCE_COMPLETE', true)
      setGameState(prev => ({
        ...prev,
        metadata: { ...prev.metadata, currentPhase: nextPhase },
      }))
    }
  }, [metadata.currentPhase, resourceChoices.player1, resourceChoices.player2, setGameState])

  // Determine which player's deploy modal to show (turn 2 only)
  let deployModalPlayer: PlayerId | null = null
  let deployModalHero: Card | null = null

  if (isDeployPhase && currentTurn === 2) {
    if (deployStep === 'p1_choosing' && p1Heroes.length > 0) {
      deployModalPlayer = 'player1'
      deployModalHero = p1Heroes[0]
    } else if (deployStep === 'p2_choosing' && p2Heroes.length > 0) {
      deployModalPlayer = 'player2'
      deployModalHero = p2Heroes[0]
    }
  }

  const handleDeployComplete = () => {
    if (deployStep === 'p1_choosing') {
      const p2Count = gameState.player2DeployZone.filter(c => c.cardType === 'hero').length
      if (p2Count > 0) {
        setDeployStep('p2_choosing')
      } else {
        setDeployStep('done')
      }
    } else if (deployStep === 'p2_choosing') {
      setDeployStep('done')
    }
  }
  
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', height: '100vh', padding: '15px', overflowY: 'auto' }}>
      <GameHeader />

      {/* Hero Deploy Modal (turn 2 - player choice) */}
      {deployModalPlayer && deployModalHero && (
        <HeroDeployModal
          player={deployModalPlayer}
          hero={deployModalHero}
          onComplete={handleDeployComplete}
        />
      )}

      {/* Resource Choice Modal */}
      {showResourceModal && actionPlayer && (
        <ResourceChoiceModal
          player={actionPlayer}
          onComplete={() => {
            const other = actionPlayer === 'player1' ? 'player2' : 'player1'
            if (!resourceChoices[other]) {
              setGameState(prev => ({
                ...prev,
                metadata: { ...prev.metadata, actionPlayer: other },
              }))
            }
          }}
        />
      )}

      {/* Combat Summary */}
      {combatSummaryData && (
        <CombatSummaryModal
          isOpen={showCombatSummary}
          onClose={() => setShowCombatSummary(false)}
          battlefieldA={combatSummaryData.battlefieldA}
          battlefieldB={combatSummaryData.battlefieldB}
        />
      )}

      {/* Victory Modal */}
      {metadata.gameOver && metadata.winner && (
        <VictoryModal
          isOpen={true}
          winner={metadata.winner}
          winReason={metadata.winReason || null}
          metadata={metadata}
          onRestart={initializeRunePrototype}
        />
      )}

      {/* Player 2 Area (Top) */}
      <PlayerArea player="player2" />

      {/* Lanes */}
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
  )
}
