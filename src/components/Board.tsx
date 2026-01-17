import { useState } from 'react'
import { useGameContext } from '../context/GameContext'
import { PlayerArea } from './PlayerArea'
import { BattlefieldView } from './BattlefieldView'
import { ItemShopModal } from './ItemShopModal'
import { CardLibraryView } from './CardLibraryView'
import { CombatSummaryModal } from './CombatSummaryModal'
import { TopBar } from './TopBar'
import { resolveSimultaneousCombat } from '../game/combatSystem'
import { CombatPreviewOverlay } from './CombatPreviewOverlay'

export function Board() {
  const { 
    gameState,
    showCombatSummary,
    setShowCombatSummary,
    combatSummaryData,
    metadata,
    setGameState,
    setCombatSummaryData,
    selectedCardId,
  } = useGameContext()
  
  const [showDebug, setShowDebug] = useState(false)
  const [isOpponentExpanded, setIsOpponentExpanded] = useState(false)
  const [isPreviewActive, setIsPreviewActive] = useState(false)
  const [hoveredUnitId, setHoveredUnitId] = useState<string | null>(null)

  const handleResolveCombat = () => {
    if (!metadata.player1Passed || !metadata.player2Passed) {
      alert('Both players must pass before going to combat')
      return
    }

    const initialTowerHP = {
      towerA_player1: metadata.towerA_player1_HP,
      towerA_player2: metadata.towerA_player2_HP,
      towerB_player1: metadata.towerB_player1_HP,
      towerB_player2: metadata.towerB_player2_HP,
    }

    const initialTowerArmor = {
      towerA_player1: metadata.towerA_player1_Armor,
      towerA_player2: metadata.towerA_player2_Armor,
      towerB_player1: metadata.towerB_player1_Armor,
      towerB_player2: metadata.towerB_player2_Armor,
    }

    const resultA = resolveSimultaneousCombat(
      gameState.battlefieldA,
      'battlefieldA',
      initialTowerHP,
      metadata.stunnedHeroes || {},
      initialTowerArmor,
      gameState
    )

    const resultB = resolveSimultaneousCombat(
      gameState.battlefieldB,
      'battlefieldB',
      resultA.updatedTowerHP,
      metadata.stunnedHeroes || {},
      initialTowerArmor,
      gameState
    )

    const processKilledHeroes = (
      originalBattlefield: typeof gameState.battlefieldA,
      updatedBattlefield: typeof gameState.battlefieldA,
      player1Base: typeof gameState.player1Base,
      player2Base: typeof gameState.player2Base,
      deathCooldowns: Record<string, number>
    ) => {
      const newP1Base = [...player1Base]
      const newP2Base = [...player2Base]
      const newCooldowns = { ...deathCooldowns }

      originalBattlefield.player1.forEach(originalCard => {
        if (originalCard.cardType === 'hero') {
          const stillAlive = updatedBattlefield.player1.some(c => c.id === originalCard.id)
          if (!stillAlive) {
            const hero = originalCard
            newP1Base.push({
              ...hero,
              location: 'base' as const,
              currentHealth: 0,
              slot: undefined,
            })
            newCooldowns[hero.id] = 2
          }
        }
      })

      originalBattlefield.player2.forEach(originalCard => {
        if (originalCard.cardType === 'hero') {
          const stillAlive = updatedBattlefield.player2.some(c => c.id === originalCard.id)
          if (!stillAlive) {
            const hero = originalCard
            newP2Base.push({
              ...hero,
              location: 'base' as const,
              currentHealth: 0,
              slot: undefined,
            })
            newCooldowns[hero.id] = 2
          }
        }
      })

      return { newP1Base, newP2Base, newCooldowns }
    }

    const { newP1Base: newP1BaseA, newP2Base: newP2BaseA, newCooldowns: newCooldownsA } = processKilledHeroes(
      gameState.battlefieldA,
      resultA.updatedBattlefield,
      gameState.player1Base,
      gameState.player2Base,
      metadata.deathCooldowns
    )

    const { newP1Base: newP1BaseB, newP2Base: newP2BaseB, newCooldowns: newCooldownsB } = processKilledHeroes(
      gameState.battlefieldB,
      resultB.updatedBattlefield,
      newP1BaseA,
      newP2BaseA,
      newCooldownsA
    )

    const totalDamageToP1Nexus = resultA.overflowDamage.player2 + resultB.overflowDamage.player2
    const totalDamageToP2Nexus = resultA.overflowDamage.player1 + resultB.overflowDamage.player1

    setGameState(prev => {
      const newP1NexusHP = Math.max(0, prev.metadata.player1NexusHP - totalDamageToP1Nexus)
      const newP2NexusHP = Math.max(0, prev.metadata.player2NexusHP - totalDamageToP2Nexus)

      return {
        ...prev,
        battlefieldA: resultA.updatedBattlefield,
        battlefieldB: resultB.updatedBattlefield,
        player1Base: newP1BaseB,
        player2Base: newP2BaseB,
        metadata: {
          ...prev.metadata,
          towerA_player1_HP: resultA.updatedTowerHP.towerA_player1,
          towerA_player2_HP: resultA.updatedTowerHP.towerA_player2,
          towerB_player1_HP: resultB.updatedTowerHP.towerB_player1,
          towerB_player2_HP: resultB.updatedTowerHP.towerB_player2,
          player1NexusHP: newP1NexusHP,
          player2NexusHP: newP2NexusHP,
          deathCooldowns: newCooldownsB,
          player1Passed: false,
          player2Passed: false,
        },
      }
    })

    setCombatSummaryData({
      battlefieldA: {
        name: 'Battlefield A',
        combatLog: resultA.combatLog,
        towerHP: {
          player1: resultA.updatedTowerHP.towerA_player1,
          player2: resultA.updatedTowerHP.towerA_player2,
        },
        overflowDamage: resultA.overflowDamage,
      },
      battlefieldB: {
        name: 'Battlefield B',
        combatLog: resultB.combatLog,
        towerHP: {
          player1: resultB.updatedTowerHP.towerB_player1,
          player2: resultB.updatedTowerHP.towerB_player2,
        },
        overflowDamage: resultB.overflowDamage,
      },
    })
    setShowCombatSummary(true)
  }

  return (
    <div className="board-root">
      <TopBar
        showDebug={showDebug}
        onToggleDebug={() => setShowDebug(prev => !prev)}
        onResolveCombat={handleResolveCombat}
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
