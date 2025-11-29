import { } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { useDeployment } from '../hooks/useDeployment'
import { useCombat } from '../hooks/useCombat'
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
  } = useGameContext()
  const { handleDeploy, handleChangeSlot, handleRemoveFromBattlefield, handleEquipItem } = useDeployment()
  const { handleDecreaseHealth, handleIncreaseHealth } = useCombat()

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

  // Get player battlefields (global bonuses apply to both lanes)
  const player1Battlefields = gameState.player1Battlefields || []
  const player2Battlefields = gameState.player2Battlefields || []

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
      (selectedCard.location === battlefieldId || selectedCard.location === 'battlefieldA' || selectedCard.location === 'battlefieldB' || selectedCard.location === 'hand' || selectedCard.location === 'base')
    
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
              showCombatControls={true}
              isDead={!!metadata.deathCooldowns[cardInSlot.id]}
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
          {/* Global Battlefield Bonuses */}
          {(player1Battlefields.length > 0 || player2Battlefields.length > 0) && (
            <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {player1Battlefields.length > 0 && (
                <div style={{ fontSize: '10px', color: '#f44336', lineHeight: '1.3' }}>
                  <strong>P1 Bonuses:</strong> {player1Battlefields.map((bf, idx) => (
                    <span key={bf.id}>
                      {idx > 0 && ' • '}
                      <span style={{ fontStyle: 'italic' }}>{bf.staticAbility}</span>
                    </span>
                  ))}
                </div>
              )}
              {player2Battlefields.length > 0 && (
                <div style={{ fontSize: '10px', color: '#4a90e2', lineHeight: '1.3' }}>
                  <strong>P2 Bonuses:</strong> {player2Battlefields.map((bf, idx) => (
                    <span key={bf.id}>
                      {idx > 0 && ' • '}
                      <span style={{ fontStyle: 'italic' }}>{bf.staticAbility}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
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
        {/* Go to Combat Button */}
        {metadata.currentPhase === 'play' && (
          <button
            onClick={() => {
              // Check if both players passed, if so resolve combat automatically
              if (metadata.player1Passed && metadata.player2Passed) {
                // Resolve simultaneous combat for both players
                const battlefield = gameState[battlefieldId]
                const initialTowerHP = {
                  towerA_player1: metadata.towerA_player1_HP,
                  towerA_player2: metadata.towerA_player2_HP,
                  towerB_player1: metadata.towerB_player1_HP,
                  towerB_player2: metadata.towerB_player2_HP,
                }
                
                // Resolve simultaneous combat (units in front attack each other)
                const combatResult = resolveSimultaneousCombat(
                  battlefield,
                  battlefieldId,
                  initialTowerHP
                )
                
                // Show combat results (before state update)
                if (combatResult.combatLog.length > 0) {
                  const logSummary = combatResult.combatLog.map(entry => 
                    `${entry.attackerName} → ${entry.targetName || 'Tower'}: ${entry.damage} damage${entry.killed ? ' (KILLED)' : ''}`
                  ).join('\n')
                  // Show alert after a brief delay to allow state update
                  setTimeout(() => {
                    alert(`Combat resolved for Battlefield ${battlefieldName}!\n\n${logSummary}\n\nYou can manually adjust health if needed (e.g., for spell effects not tracked).`)
                  }, 100)
                }
                
                // Apply combat results
                setGameState(prev => {
                  const towerKeyP1 = battlefieldId === 'battlefieldA' ? 'towerA_player1_HP' : 'towerB_player1_HP'
                  const towerKeyP2 = battlefieldId === 'battlefieldA' ? 'towerA_player2_HP' : 'towerB_player2_HP'
                  const towerKeyP1Result = battlefieldId === 'battlefieldA' ? 'towerA_player1' : 'towerB_player1'
                  const towerKeyP2Result = battlefieldId === 'battlefieldA' ? 'towerA_player2' : 'towerB_player2'
                  
                  // Find heroes that were killed (in original battlefield but not in updated)
                  const originalBattlefield = prev[battlefieldId]
                  const updatedBattlefield = combatResult.updatedBattlefield
                  
                  const killedHeroes: { hero: import('../game/types').Hero, player: 'player1' | 'player2' }[] = []
                  
                  // Check player 1 heroes
                  originalBattlefield.player1.forEach(originalCard => {
                    if (originalCard.cardType === 'hero') {
                      const stillAlive = updatedBattlefield.player1.some(c => c.id === originalCard.id)
                      if (!stillAlive) {
                        killedHeroes.push({ hero: originalCard as import('../game/types').Hero, player: 'player1' })
                      }
                    }
                  })
                  
                  // Check player 2 heroes
                  originalBattlefield.player2.forEach(originalCard => {
                    if (originalCard.cardType === 'hero') {
                      const stillAlive = updatedBattlefield.player2.some(c => c.id === originalCard.id)
                      if (!stillAlive) {
                        killedHeroes.push({ hero: originalCard as import('../game/types').Hero, player: 'player2' })
                      }
                    }
                  })
                  
                  // Move killed heroes to base with cooldown counter
                  const newPlayer1Base = [...prev.player1Base]
                  const newPlayer2Base = [...prev.player2Base]
                  const newDeathCooldowns = { ...prev.metadata.deathCooldowns }
                  
                  killedHeroes.forEach(({ hero, player }) => {
                    const heroInBase = {
                      ...hero,
                      location: 'base' as const,
                      currentHealth: 0, // Dead
                      slot: undefined,
                    }
                    
                    if (player === 'player1') {
                      newPlayer1Base.push(heroInBase)
                    } else {
                      newPlayer2Base.push(heroInBase)
                    }
                    
                    // Set cooldown counter to 2
                    newDeathCooldowns[hero.id] = 2
                  })
                  
                  return {
                    ...prev,
                    [battlefieldId]: combatResult.updatedBattlefield,
                    player1Base: newPlayer1Base,
                    player2Base: newPlayer2Base,
                    metadata: {
                      ...prev.metadata,
                      [towerKeyP1]: combatResult.updatedTowerHP[towerKeyP1Result],
                      [towerKeyP2]: combatResult.updatedTowerHP[towerKeyP2Result],
                      // Apply overflow damage to nexus
                      player1NexusHP: Math.max(0, prev.metadata.player1NexusHP - combatResult.overflowDamage.player1),
                      player2NexusHP: Math.max(0, prev.metadata.player2NexusHP - combatResult.overflowDamage.player2),
                      // Update death cooldowns
                      deathCooldowns: newDeathCooldowns,
                      // Reset pass flags
                      player1Passed: false,
                      player2Passed: false,
                      // Stay in play phase so players can adjust manually if needed
                      // (e.g., if a spell gave +1/+1 that wasn't tracked in the system)
                    },
                  }
                })
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
              ? `Resolve Combat for Battlefield ${battlefieldName} (units in front attack each other)`
              : 'Both players must pass before combat'}
          >
            Go to Combat {battlefieldName}
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

