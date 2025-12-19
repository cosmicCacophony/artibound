import { Card } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { useDeployment } from '../hooks/useDeployment'
import { useCombat } from '../hooks/useCombat'
import { useHeroAbilities } from '../hooks/useHeroAbilities'
import { useTurnManagement } from '../hooks/useTurnManagement'
import { HeroCard } from './HeroCard'
import { resolveSimultaneousCombat } from '../game/combatSystem'

interface BattlefieldViewProps {
  battlefieldId: 'battlefieldA' | 'battlefieldB'
}

export function BattlefieldView({ battlefieldId }: BattlefieldViewProps) {
  const { 
    gameState, 
    selectedCard, 
    selectedCardId, 
    setSelectedCardId, 
    metadata,
    getAvailableSlots,
    setGameState,
    setShowCombatSummary,
    setCombatSummaryData,
  } = useGameContext()
  const { handleDeploy, handleChangeSlot, handleRemoveFromBattlefield, handleEquipItem } = useDeployment()
  const { handleDecreaseHealth, handleIncreaseHealth, handleDecreaseAttack, handleIncreaseAttack } = useCombat()
  const { handleAbilityClick } = useHeroAbilities()
  const { handleToggleStun } = useTurnManagement()

  const battlefield = gameState[battlefieldId]
  const battlefieldAP1 = gameState.battlefieldA.player1
  const battlefieldAP2 = gameState.battlefieldA.player2
  const battlefieldBP1 = gameState.battlefieldB.player1
  const battlefieldBP2 = gameState.battlefieldB.player2
  
  const allCards = battlefieldId === 'battlefieldA' 
    ? [...battlefieldAP1, ...battlefieldAP2]
    : [...battlefieldBP1, ...battlefieldBP2]
  
  const towerP1HP = battlefieldId === 'battlefieldA' ? metadata.towerA_player1_HP : metadata.towerB_player1_HP
  const towerP2HP = battlefieldId === 'battlefieldA' ? metadata.towerA_player2_HP : metadata.towerB_player2_HP
  const borderColor = battlefieldId === 'battlefieldA' ? '#4a90e2' : '#ff9800'
  const bgColor = battlefieldId === 'battlefieldA' ? '#e3f2fd' : '#fff3e0'
  const battlefieldName = battlefieldId === 'battlefieldA' ? 'A' : 'B'

  const handleCardClick = (cardId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
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

  const renderSlot = (slotNum: number, player: 'player1' | 'player2') => {
    const cardInSlot = battlefield[player].find(c => c.slot === slotNum)
    const isSelected = selectedCard && selectedCard.id === cardInSlot?.id
    const canMoveHere = selectedCard && selectedCard.owner === player && 
      (selectedCard.location === battlefieldId || selectedCard.location === 'battlefieldA' || selectedCard.location === 'battlefieldB' || selectedCard.location === 'hand' || selectedCard.location === 'base' || selectedCard.location === 'deployZone')
    
    // Check if we can equip an item to a hero
    const canEquipItem = selectedCard && 
      selectedCard.cardType === 'item' && 
      selectedCard.owner === player &&
      cardInSlot && 
      cardInSlot.cardType === 'hero' &&
      cardInSlot.owner === player
    
    const playerColor = player === 'player1' ? '#f44336' : '#4a90e2'
    const playerBgColor = player === 'player1' ? '#ffebee' : '#e3f2fd'

    return (
      <div
        key={slotNum}
        style={{
          minHeight: '100px',
          border: (canMoveHere || canEquipItem) ? `2px dashed ${playerColor}` : '1px solid #ddd',
          borderRadius: '4px',
          padding: '4px',
          backgroundColor: (canMoveHere || canEquipItem) ? playerBgColor : '#f9f9f9',
          position: 'relative',
        }}
        onClick={() => {
          // Check if equipping item to hero
          if (canEquipItem && selectedCard && cardInSlot) {
            handleEquipItem(cardInSlot as import('../game/types').Hero, selectedCard as import('../game/types').ItemCard, battlefieldId)
            return
          }
          
          // Normal deployment logic
          if (selectedCard && canMoveHere && selectedCard.owner === player) {
            if (selectedCard.location === battlefieldId) {
              handleChangeSlot(selectedCard, slotNum, battlefieldId)
            } else if (selectedCard.location === 'battlefieldA' || selectedCard.location === 'battlefieldB') {
              // Move from other battlefield
              handleDeploy(battlefieldId, slotNum)
            } else {
              // Deploy to this battlefield with specific slot
              handleDeploy(battlefieldId, slotNum)
            }
          }
        }}
      >
        <div style={{ fontSize: '10px', color: '#666', marginBottom: '2px' }}>Slot {slotNum}</div>
        {cardInSlot ? (
          <div style={{ transform: 'scale(0.85)', transformOrigin: 'top left' }}>
            <HeroCard
              card={cardInSlot}
              onClick={(e) => handleCardClick(cardInSlot.id, e)}
              isSelected={isSelected}
              showStats={true}
              onRemove={() => handleRemoveFromBattlefield(cardInSlot, battlefieldId)}
              onDecreaseHealth={() => handleDecreaseHealth(cardInSlot)}
              onIncreaseHealth={() => handleIncreaseHealth(cardInSlot)}
              onDecreaseAttack={() => handleDecreaseAttack(cardInSlot)}
              onIncreaseAttack={() => handleIncreaseAttack(cardInSlot)}
              showCombatControls={true}
              isDead={!!metadata.deathCooldowns[cardInSlot.id]}
              isStunned={cardInSlot.cardType === 'hero' && Boolean(metadata.stunnedHeroes?.[cardInSlot.id])}
              onToggleStun={cardInSlot.cardType === 'hero' ? () => handleToggleStun(cardInSlot) : undefined}
              onAbilityClick={(heroId, ability) => handleAbilityClick(heroId, ability, cardInSlot.owner)}
            />
          </div>
        ) : (
          <div style={{ fontSize: '10px', color: '#ccc', textAlign: 'center', paddingTop: '20px' }}>
            {canEquipItem ? 'Equip Item' : canMoveHere ? 'Drop here' : 'Empty'}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        border: `2px solid ${borderColor}`,
        borderRadius: '6px',
        padding: '12px',
        backgroundColor: bgColor,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ marginTop: 0, fontSize: '16px' }}>
            Battlefield {battlefieldName}
            <span style={{ fontSize: '12px', fontWeight: 'normal', marginLeft: '8px', color: '#666' }}>
              ({getAvailableSlots(allCards)} slots)
            </span>
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#4a90e2' }}>
              P2 Tower: {towerP2HP} HP
            </div>
            <button
              onClick={() => handleTowerDamage(-1, 'player2')}
              style={{
                padding: '2px 6px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '10px',
              }}
              title={`Deal 1 damage to P2 Tower ${battlefieldName}`}
            >
              -1
            </button>
            <button
              onClick={() => handleTowerDamage(1, 'player2')}
              style={{
                padding: '2px 6px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '10px',
              }}
              title={`Heal 1 HP to P2 Tower ${battlefieldName}`}
            >
              +1
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#f44336' }}>
              P1 Tower: {towerP1HP} HP
            </div>
            <button
              onClick={() => handleTowerDamage(-1, 'player1')}
              style={{
                padding: '2px 6px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '10px',
              }}
              title={`Deal 1 damage to P1 Tower ${battlefieldName}`}
            >
              -1
            </button>
            <button
              onClick={() => handleTowerDamage(1, 'player1')}
              style={{
                padding: '2px 6px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '10px',
              }}
              title={`Heal 1 HP to P1 Tower ${battlefieldName}`}
            >
              +1
            </button>
          </div>
        </div>
        {/* Go to Combat Button - Resolves Both Battlefields Simultaneously */}
        {metadata.currentPhase === 'play' && battlefieldId === 'battlefieldA' && (
          <button
            onClick={() => {
              // Check if both players passed, if so resolve combat for both battlefields
              if (metadata.player1Passed && metadata.player2Passed) {
                // Resolve simultaneous combat for both battlefields
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
                
                // Resolve combat for both battlefields simultaneously
                const resultA = resolveSimultaneousCombat(
                  gameState.battlefieldA,
                  'battlefieldA',
                  initialTowerHP,
                  metadata.stunnedHeroes || {},
                  initialTowerArmor
                )
                
                const resultB = resolveSimultaneousCombat(
                  gameState.battlefieldB,
                  'battlefieldB',
                  resultA.updatedTowerHP,
                  metadata.stunnedHeroes || {},
                  initialTowerArmor
                )
                
                // Process killed heroes for both battlefields - separate by player
                const processKilledHeroes = (
                  originalBattlefield: typeof gameState.battlefieldA,
                  updatedBattlefield: typeof gameState.battlefieldA,
                  player1Base: Card[],
                  player2Base: Card[],
                  deathCooldowns: Record<string, number>,
                  goldRewards: { player1: number, player2: number }
                ) => {
                  const newP1Base = [...player1Base]
                  const newP2Base = [...player2Base]
                  const newCooldowns = { ...deathCooldowns }
                  
                  // Process player1 heroes
                  originalBattlefield.player1.forEach(originalCard => {
                    if (originalCard.cardType === 'hero') {
                      const stillAlive = updatedBattlefield.player1.some(c => c.id === originalCard.id)
                      if (!stillAlive) {
                        const hero = originalCard as import('../game/types').Hero
                        newP1Base.push({
                          ...hero,
                          location: 'base' as const,
                          currentHealth: 0,
                          slot: undefined,
                        })
                        newCooldowns[hero.id] = 2
                        // Opponent (player2) gets 5 gold for killing hero
                        goldRewards.player2 += 5
                      }
                    } else if (originalCard.cardType === 'generic') {
                      const stillAlive = updatedBattlefield.player1.some(c => c.id === originalCard.id)
                      if (!stillAlive) {
                        // Opponent (player2) gets 2 gold for killing a creep (generic unit)
                        goldRewards.player2 += 2
                      }
                    }
                  })
                  
                  // Process player2 heroes
                  originalBattlefield.player2.forEach(originalCard => {
                    if (originalCard.cardType === 'hero') {
                      const stillAlive = updatedBattlefield.player2.some(c => c.id === originalCard.id)
                      if (!stillAlive) {
                        const hero = originalCard as import('../game/types').Hero
                        newP2Base.push({
                          ...hero,
                          location: 'base' as const,
                          currentHealth: 0,
                          slot: undefined,
                        })
                        newCooldowns[hero.id] = 2
                        // Opponent (player1) gets 5 gold for killing hero
                        goldRewards.player1 += 5
                      }
                    } else if (originalCard.cardType === 'generic') {
                      const stillAlive = updatedBattlefield.player2.some(c => c.id === originalCard.id)
                      if (!stillAlive) {
                        // Opponent (player1) gets 2 gold for killing a creep (generic unit)
                        goldRewards.player1 += 2
                      }
                    }
                  })
                  
                  return { newP1Base, newP2Base, newCooldowns }
                }
                
                const goldRewards = { player1: 0, player2: 0 }
                const { newP1Base: newP1BaseA, newP2Base: newP2BaseA, newCooldowns: newCooldownsA } = processKilledHeroes(
                  gameState.battlefieldA,
                  resultA.updatedBattlefield,
                  gameState.player1Base,
                  gameState.player2Base,
                  metadata.deathCooldowns,
                  goldRewards
                )
                
                const { newP1Base: newP1BaseB, newP2Base: newP2BaseB, newCooldowns: newCooldownsB } = processKilledHeroes(
                  gameState.battlefieldB,
                  resultB.updatedBattlefield,
                  newP1BaseA,
                  newP2BaseA,
                  newCooldownsA,
                  goldRewards
                )
                
                // Apply combat results
                // Calculate total overflow damage TO each player's nexus
                // overflowDamage.player1 = damage dealt BY player1 (goes TO player2's nexus)
                // overflowDamage.player2 = damage dealt BY player2 (goes TO player1's nexus)
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
                      player1Gold: (prev.metadata.player1Gold as number) + goldRewards.player1,
                      player2Gold: (prev.metadata.player2Gold as number) + goldRewards.player2,
                      deathCooldowns: newCooldownsB,
                      player1Passed: false,
                      player2Passed: false,
                    },
                  }
                })
                
                // Show combat summary modal
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
              } else {
                alert('Both players must pass before going to combat')
              }
            }}
            disabled={!(metadata.player1Passed && metadata.player2Passed)}
            style={{
              padding: '8px 16px',
              backgroundColor: (metadata.player1Passed && metadata.player2Passed) ? '#4caf50' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (metadata.player1Passed && metadata.player2Passed) ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: 'bold',
              marginLeft: '12px',
            }}
            title={(metadata.player1Passed && metadata.player2Passed) 
              ? 'Resolve Combat for Both Battlefields (units in front attack each other simultaneously)'
              : 'Both players must pass before combat'}
          >
            ⚔️ Resolve Combat (Both Battlefields)
          </button>
        )}
      </div>
      
      {/* Player 2 side */}
      <div style={{ marginBottom: '12px' }}>
        <h4 style={{ fontSize: '12px', marginBottom: '6px' }}>Player 2</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '4px' }}>
          {[1, 2, 3, 4, 5].map(slotNum => renderSlot(slotNum, 'player2'))}
        </div>
      </div>

      {/* Player 1 side */}
      <div>
        <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Player 1</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
          {[1, 2, 3, 4, 5].map(slotNum => renderSlot(slotNum, 'player1'))}
        </div>
      </div>

      {selectedCard && (
        <button
          onClick={() => handleDeploy(battlefieldId)}
          disabled={selectedCard && selectedCard.cardType !== 'generic' && getAvailableSlots(
            selectedCard.owner === 'player1' ? battlefield[selectedCard.owner] : battlefield[selectedCard.owner]
          ) <= 0}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: borderColor,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: selectedCard && selectedCard.cardType !== 'generic' && getAvailableSlots(
              selectedCard.owner === 'player1' ? battlefield[selectedCard.owner] : battlefield[selectedCard.owner]
            ) <= 0 ? 0.5 : 1,
          }}
        >
          Deploy {selectedCard.name} to Lane {battlefieldName}
        </button>
      )}
    </div>
  )
}

