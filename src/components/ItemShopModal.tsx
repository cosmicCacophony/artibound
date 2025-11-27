import { useGameContext } from '../context/GameContext'
import { useItemShop } from '../hooks/useItemShop'
import { ShopItem, BattlefieldId } from '../game/types'

export function ItemShopModal() {
  const { showItemShop, setShowItemShop, itemShopItems, metadata, activePlayer } = useGameContext()
  const { handleBuyItem, handleUpgradeTier, handleSkipShop } = useItemShop()

  if (!showItemShop) return null

  const playerGold = activePlayer === 'player1' ? metadata.player1Gold : metadata.player2Gold
  const playerTier = activePlayer === 'player1' ? metadata.player1Tier : metadata.player2Tier

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        border: '2px solid #4a90e2',
        borderRadius: '8px',
        padding: '20px',
        zIndex: 1000,
        minWidth: '400px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <h2 style={{ marginTop: 0 }}>Item Shop - {activePlayer === 'player1' ? 'Player 1' : 'Player 2'}</h2>
      <div style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>
        Gold: {playerGold}
      </div>
      <div style={{ marginBottom: '15px' }}>
        {itemShopItems.map((shopItem: ShopItem, index: number) => {
          const isBuff = 'type' in shopItem && shopItem.type === 'battlefieldBuff'
          const itemId = isBuff ? `buff-${index}` : (shopItem as any).id
          
          return (
            <div
              key={itemId}
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '12px',
                marginBottom: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{shopItem.name}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{shopItem.description}</div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                    Cost: {shopItem.cost} gold
                  </div>
                  {isBuff && (
                    <div style={{ fontSize: '11px', color: '#4a90e2', marginTop: '4px', fontStyle: 'italic' }}>
                      Battlefield Buff - Select A or B when purchasing
                    </div>
                  )}
                </div>
                {!isBuff && (
                  <button
                    onClick={() => handleBuyItem(shopItem)}
                    disabled={playerGold < shopItem.cost}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: playerGold >= shopItem.cost ? '#4caf50' : '#ccc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: playerGold >= shopItem.cost ? 'pointer' : 'not-allowed',
                    }}
                  >
                    Buy ({shopItem.cost})
                  </button>
                )}
              </div>
              {isBuff && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleBuyItem(shopItem, undefined, 'battlefieldA')}
                    disabled={playerGold < shopItem.cost}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: playerGold >= shopItem.cost ? '#4caf50' : '#ccc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: playerGold >= shopItem.cost ? 'pointer' : 'not-allowed',
                      flex: 1,
                    }}
                  >
                    Buy for A ({shopItem.cost})
                  </button>
                  <button
                    onClick={() => handleBuyItem(shopItem, undefined, 'battlefieldB')}
                    disabled={playerGold < shopItem.cost}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: playerGold >= shopItem.cost ? '#4caf50' : '#ccc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: playerGold >= shopItem.cost ? 'pointer' : 'not-allowed',
                      flex: 1,
                    }}
                  >
                    Buy for B ({shopItem.cost})
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        {playerTier === 1 && (
          <button
            onClick={handleUpgradeTier}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            Upgrade to Tier 2
          </button>
        )}
        <button
          onClick={handleSkipShop}
          style={{
            padding: '8px 16px',
            backgroundColor: '#9e9e9e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            flex: 1,
          }}
        >
          Skip (+2 Gold)
        </button>
      </div>
    </div>
  )
}



