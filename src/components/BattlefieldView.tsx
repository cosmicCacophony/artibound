import { useState } from 'react'
import { Card, Hero, HeroAbility, MAX_UNITS_PER_LANE } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { useDeployment } from '../hooks/useDeployment'
import { useCombat } from '../hooks/useCombat'
import { useHeroAbilities } from '../hooks/useHeroAbilities'
import { useTurnManagement } from '../hooks/useTurnManagement'
import { HeroCard } from './HeroCard'
import { HeroAbilityEditor } from './HeroAbilityEditor'
import { LaneRuneDisplay } from './LaneRuneDisplay'

interface BattlefieldViewProps {
  battlefieldId: 'battlefieldA' | 'battlefieldB'
}

export function BattlefieldView({ battlefieldId }: BattlefieldViewProps) {
  const { 
    gameState, 
    selectedCard, 
    selectedCardId, 
    setSelectedCardId,
    draggedCardId,
    setDraggedCardId,
    pendingAbility,
    setPendingAbility,
    metadata,
    getLaneCapacity,
    setGameState,
  } = useGameContext()
  const [editingHeroId, setEditingHeroId] = useState<string | null>(null)
  const { handleDeploy, handleCastSpellOnTarget, handleRemoveFromBattlefield, handleEquipItem } = useDeployment()
  const { handleDecreaseHealth, handleIncreaseHealth, handleDecreaseAttack, handleIncreaseAttack } = useCombat()
  const { handleAbilityClick, handleAbilityTargetClick } = useHeroAbilities()
  const { handleToggleStun } = useTurnManagement()

  const battlefield = gameState[battlefieldId]
  const towerP1HP = battlefieldId === 'battlefieldA' ? metadata.towerA_player1_HP : metadata.towerB_player1_HP
  const towerP2HP = battlefieldId === 'battlefieldA' ? metadata.towerA_player2_HP : metadata.towerB_player2_HP
  const borderColor = battlefieldId === 'battlefieldA' ? '#4a90e2' : '#ff9800'
  const bgColor = battlefieldId === 'battlefieldA' ? '#e3f2fd' : '#fff3e0'
  const battlefieldName = battlefieldId === 'battlefieldA' ? 'A' : 'B'

  const isTargetedDamageSpellSelected = Boolean(
    selectedCard &&
    selectedCard.cardType === 'spell' &&
    selectedCard.location === 'hand' &&
    'effect' in selectedCard &&
    selectedCard.effect &&
    ['damage', 'targeted_damage', 'damage_and_stun'].includes(
      (selectedCard as import('../game/types').SpellCard).effect.type
    )
  )

  const isItemSelected = Boolean(
    selectedCard &&
    selectedCard.cardType === 'item' &&
    selectedCard.location === 'hand'
  )

  const handleCardClick = (cardId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setSelectedCardId(selectedCardId === cardId ? null : cardId)
  }

  const handleTowerDamage = (amount: number, player: 'player1' | 'player2') => {
    const towerKey = battlefieldId === 'battlefieldA' 
      ? (player === 'player1' ? 'towerA_player1_HP' : 'towerA_player2_HP')
      : (player === 'player1' ? 'towerB_player1_HP' : 'towerB_player2_HP')
    setGameState(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [towerKey]: Math.max(0, Math.min(20, (prev.metadata[towerKey] as number) + amount)),
      },
    }))
  }

  const getTotalLanePower = (player: 'player1' | 'player2') => {
    return battlefield[player].reduce((total, card) => {
      if ('attack' in card) {
        let atk = (card as any).attack || 0
        if ((card.cardType === 'hero' || card.cardType === 'generic') && 'temporaryAttack' in card) {
          atk += (card as any).temporaryAttack || 0
        }
        return total + atk
      }
      return total
    }, 0)
  }

  const renderUnitCard = (card: Card, player: 'player1' | 'player2') => {
    const isSelected = selectedCardId === card.id
    const isAbilityTarget = (() => {
      if (!pendingAbility || pendingAbility.battlefieldId !== battlefieldId) return false
      const { ability, owner } = pendingAbility
      switch (ability.effectType) {
        case 'damage_target':
        case 'steal_unit':
        case 'bounce_unit':
          return card.owner !== owner && card.cardType !== 'hero'
            ? true
            : card.owner !== owner && ability.effectType === 'damage_target'
        case 'buff_units':
          return card.owner === owner && card.cardType !== 'hero'
        default:
          return false
      }
    })()
    const canClickCast = Boolean(isTargetedDamageSpellSelected && selectedCard && selectedCard.owner !== player)
    const canEquipItem = Boolean(
      isItemSelected && selectedCard && selectedCard.owner === player &&
      (card.cardType === 'hero' || card.cardType === 'generic')
    )

    return (
      <div
        key={card.id}
        style={{
          border: isAbilityTarget ? '2px dashed #ff6f00' : canClickCast ? '2px dashed #f44336' : canEquipItem ? '2px dashed #4caf50' : '1px solid transparent',
          borderRadius: '4px',
          background: isAbilityTarget ? '#fff8e1' : canEquipItem ? '#e8f5e9' : 'transparent',
          cursor: isAbilityTarget || canClickCast || canEquipItem ? 'pointer' : undefined,
        }}
        onClick={(e) => {
          if (isAbilityTarget && pendingAbility) {
            e.stopPropagation()
            handleAbilityTargetClick(card, battlefieldId)
            return
          }
          if (canClickCast && selectedCard) {
            e.stopPropagation()
            handleCastSpellOnTarget(card, battlefieldId)
            return
          }
          if (canEquipItem && selectedCard) {
            e.stopPropagation()
            handleEquipItem(
              card as Hero | import('../game/types').GenericUnit,
              selectedCard as import('../game/types').ItemCard,
              battlefieldId,
            )
            return
          }
        }}
      >
        <HeroCard
          card={card}
          onClick={(e) => {
            if (isAbilityTarget && pendingAbility) {
              e?.stopPropagation()
              handleAbilityTargetClick(card, battlefieldId)
              return
            }
            if (canClickCast && selectedCard) {
              e?.stopPropagation()
              handleCastSpellOnTarget(card, battlefieldId)
              return
            }
            handleCardClick(card.id, e)
          }}
          isSelected={isSelected}
          showStats={true}
          onRemove={() => handleRemoveFromBattlefield(card, battlefieldId)}
          onDecreaseHealth={() => handleDecreaseHealth(card)}
          onIncreaseHealth={() => handleIncreaseHealth(card)}
          onDecreaseAttack={() => handleDecreaseAttack(card)}
          onIncreaseAttack={() => handleIncreaseAttack(card)}
          showCombatControls={true}
          isDead={!!metadata.deathCooldowns[card.id]}
          isStunned={card.cardType === 'hero' && Boolean(metadata.stunnedHeroes?.[card.id])}
          onToggleStun={card.cardType === 'hero' ? () => handleToggleStun(card) : undefined}
          onAbilityClick={(heroId, ability) => handleAbilityClick(heroId, ability, card.owner)}
          onEditAbility={card.cardType === 'hero' ? (heroId) => setEditingHeroId(heroId) : undefined}
        />
      </div>
    )
  }

  const renderLaneSide = (player: 'player1' | 'player2') => {
    const allCards = battlefield[player]
    const heroes = allCards.filter(c => c.cardType === 'hero')
    const units = allCards.filter(c => c.cardType !== 'hero')
    const lanePower = getTotalLanePower(player)
    const playerColor = player === 'player1' ? '#f44336' : '#4a90e2'

    const draggedCard = draggedCardId ? 
      [...gameState.player1Hand, ...gameState.player2Hand, ...gameState.player1Base, ...gameState.player2Base, ...gameState.player1DeployZone, ...gameState.player2DeployZone, ...gameState.battlefieldA.player1, ...gameState.battlefieldA.player2, ...gameState.battlefieldB.player1, ...gameState.battlefieldB.player2].find(c => c.id === draggedCardId) :
      null

    const canDropHere = draggedCard && (
      (draggedCard.owner === player && (draggedCard.location === 'hand' || draggedCard.location === 'base' || draggedCard.location === 'deployZone' || draggedCard.location === battlefieldId || draggedCard.location === 'battlefieldA' || draggedCard.location === 'battlefieldB')) ||
      (draggedCard.cardType === 'spell' && draggedCard.location === 'hand' && draggedCard.owner !== player && ['damage', 'targeted_damage', 'damage_and_stun'].includes((draggedCard as any).effect?.type))
    )

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      let cardId = e.dataTransfer.getData('cardId') || e.dataTransfer.getData('text/plain')
      if (!cardId) return

      const allGameCards = [
        ...gameState.player1Hand, ...gameState.player2Hand,
        ...gameState.player1Base, ...gameState.player2Base,
        ...gameState.player1DeployZone, ...gameState.player2DeployZone,
        ...gameState.battlefieldA.player1, ...gameState.battlefieldA.player2,
        ...gameState.battlefieldB.player1, ...gameState.battlefieldB.player2,
      ]
      const droppedCard = allGameCards.find(c => c.id === cardId)
      if (!droppedCard) return

      if (droppedCard.cardType === 'item' && droppedCard.owner === player) {
        // Equip to the first available unit (hero or generic) in the lane
        const targetUnit = allCards.find(u => u.cardType === 'hero' || u.cardType === 'generic') as (Hero | import('../game/types').GenericUnit) | undefined
        if (targetUnit) {
          handleEquipItem(targetUnit, droppedCard as import('../game/types').ItemCard, battlefieldId)
          setDraggedCardId(null)
          return
        }
      }

      if (droppedCard.owner === player || (droppedCard.cardType === 'spell' && droppedCard.owner !== player)) {
        setDraggedCardId(null)
        handleDeploy(battlefieldId, undefined, droppedCard)
      }
    }

    return (
      <div style={{ marginBottom: player === 'player2' ? '8px' : 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <h4 style={{ fontSize: '12px', margin: 0, color: playerColor }}>
            {player === 'player1' ? 'Player 1' : 'Player 2'}
            <span style={{ fontWeight: 'normal', color: '#666', marginLeft: '6px' }}>
              ({allCards.length}/{MAX_UNITS_PER_LANE} | Units: {units.length} | Power: {lanePower})
            </span>
          </h4>
        </div>

        {/* Commander row: heroes as backline aura providers */}
        {heroes.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '6px',
            padding: '4px 6px',
            marginBottom: '4px',
            borderRadius: '4px',
            backgroundColor: `${playerColor}08`,
            border: `1px solid ${playerColor}30`,
            alignItems: 'flex-start',
          }}>
            <div style={{
              fontSize: '10px',
              fontWeight: 'bold',
              color: playerColor,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              padding: '4px 0',
              opacity: 0.7,
            }}>
              CMD
            </div>
            {heroes.map(card => (
              <div key={card.id} style={{ transform: 'scale(0.8)', transformOrigin: 'top left', width: '120px' }}>
                {renderUnitCard(card, player)}
              </div>
            ))}
          </div>
        )}

        {/* Unit row: frontline combatants */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            minHeight: '110px',
            padding: '6px',
            border: canDropHere ? `2px dashed ${playerColor}` : '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: canDropHere ? `${playerColor}10` : '#f9f9f9',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            transition: 'all 0.15s',
          }}
          onDragOver={(e) => {
            e.preventDefault()
            if (canDropHere) e.dataTransfer.dropEffect = 'move'
          }}
          onDrop={handleDrop}
          onClick={() => {
            if (selectedCard && selectedCard.owner === player && !isTargetedDamageSpellSelected) {
              handleDeploy(battlefieldId)
            }
          }}
        >
          {units.length > 0 ? (
            units.map(card => (
              <div key={card.id} style={{ transform: 'scale(0.85)', transformOrigin: 'top left', width: '130px' }}>
                {renderUnitCard(card, player)}
              </div>
            ))
          ) : (
            <div style={{ fontSize: '11px', color: '#bbb', textAlign: 'center', width: '100%', paddingTop: '40px' }}>
              {canDropHere ? 'Drop here to deploy' : 'Empty lane'}
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleSaveAbility = (heroId: string, ability: HeroAbility | undefined) => {
    setGameState(prev => {
      const findAndUpdateHero = (cards: Card[]): Card[] => {
        return cards.map(card => {
          if (card.id === heroId && card.cardType === 'hero') {
            return { ...card, ability } as Hero
          }
          return card
        })
      }
      return {
        ...prev,
        player1Hand: findAndUpdateHero(prev.player1Hand),
        player2Hand: findAndUpdateHero(prev.player2Hand),
        player1Base: findAndUpdateHero(prev.player1Base),
        player2Base: findAndUpdateHero(prev.player2Base),
        player1DeployZone: findAndUpdateHero(prev.player1DeployZone),
        player2DeployZone: findAndUpdateHero(prev.player2DeployZone),
        battlefieldA: {
          player1: findAndUpdateHero(prev.battlefieldA.player1),
          player2: findAndUpdateHero(prev.battlefieldA.player2),
        },
        battlefieldB: {
          player1: findAndUpdateHero(prev.battlefieldB.player1),
          player2: findAndUpdateHero(prev.battlefieldB.player2),
        },
      }
    })
    setEditingHeroId(null)
  }

  const editingHero = editingHeroId 
    ? [
        ...gameState.player1Hand, ...gameState.player2Hand,
        ...gameState.player1Base, ...gameState.player2Base,
        ...gameState.player1DeployZone, ...gameState.player2DeployZone,
        ...gameState.battlefieldA.player1, ...gameState.battlefieldA.player2,
        ...gameState.battlefieldB.player1, ...gameState.battlefieldB.player2,
      ].find(c => c.id === editingHeroId && c.cardType === 'hero') as Hero | undefined
    : undefined

  return (
    <>
      {editingHero && (
        <HeroAbilityEditor
          hero={editingHero}
          onSave={handleSaveAbility}
          onClose={() => setEditingHeroId(null)}
        />
      )}
      <div style={{
        border: `2px solid ${borderColor}`,
        borderRadius: '6px',
        padding: '12px',
        backgroundColor: bgColor,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ marginTop: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>Lane {battlefieldName}</span>
              {metadata.isRunePrototype && metadata.laneRunes && (
                <span style={{ display: 'flex', gap: '12px', fontSize: '11px' }}>
                  <LaneRuneDisplay laneRunes={metadata.laneRunes[battlefieldId].player1} laneName="P1" />
                  <LaneRuneDisplay laneRunes={metadata.laneRunes[battlefieldId].player2} laneName="P2" />
                </span>
              )}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#4a90e2' }}>
                P2 Tower: {towerP2HP} HP
              </div>
              <button onClick={() => handleTowerDamage(-1, 'player2')} style={{ padding: '2px 6px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>-1</button>
              <button onClick={() => handleTowerDamage(1, 'player2')} style={{ padding: '2px 6px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>+1</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#f44336' }}>
                P1 Tower: {towerP1HP} HP
              </div>
              <button onClick={() => handleTowerDamage(-1, 'player1')} style={{ padding: '2px 6px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>-1</button>
              <button onClick={() => handleTowerDamage(1, 'player1')} style={{ padding: '2px 6px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>+1</button>
            </div>
          </div>
        </div>

        {renderLaneSide('player2')}
        {renderLaneSide('player1')}

        {pendingAbility && pendingAbility.battlefieldId === battlefieldId && (
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#ff6f00', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Select a target for {pendingAbility.ability.name}.</span>
            <button onClick={() => setPendingAbility(null)} style={{ padding: '2px 8px', fontSize: '11px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: '#fff' }}>Cancel</button>
          </div>
        )}
        {isTargetedDamageSpellSelected && selectedCard && (
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#444', fontWeight: 600 }}>
            Select an enemy unit in this lane to cast {selectedCard.name}.
          </div>
        )}
        {selectedCard && !isTargetedDamageSpellSelected && (
          <button
            onClick={() => handleDeploy(battlefieldId)}
            disabled={selectedCard && selectedCard.cardType !== 'generic' && getLaneCapacity(
              battlefield[selectedCard.owner as 'player1' | 'player2']
            ) <= 0}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: borderColor,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: selectedCard && selectedCard.cardType !== 'generic' && getLaneCapacity(
                battlefield[selectedCard.owner as 'player1' | 'player2']
              ) <= 0 ? 0.5 : 1,
            }}
          >
            Deploy {selectedCard.name} to Lane {battlefieldName}
          </button>
        )}
      </div>
    </>
  )
}
