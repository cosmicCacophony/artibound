import { useGameContext } from '../context/GameContext'
import { useItemShop } from '../hooks/useItemShop'
import { ShopItem, Item } from '../game/types'

export function ItemShopModal() {
  const { itemShopPlayer, setItemShopPlayer, itemShopItems, metadata } = useGameContext()
  const { handleBuyItem, adjustGold } = useItemShop()

  if (!itemShopPlayer) return null

  const playerGold = itemShopPlayer === 'player1' ? metadata.player1Gold : metadata.player2Gold
  const playerTier = itemShopPlayer === 'player1' ? metadata.player1Tier : metadata.player2Tier

  // Filter items by what player can afford
  const affordableItems = itemShopItems.filter(item => item.cost <= playerGold)
  const unaffordableItems = itemShopItems.filter(item => item.cost > playerGold)

  const handleClose = () => {
    setItemShopPlayer(null)
  }

  const handlePurchase = (shopItem: ShopItem) => {
    handleBuyItem(shopItem, itemShopPlayer)
  }

  // Render item as a card with yellow background
  const renderShopItem = (shopItem: ShopItem, index: number) => {
    const canAfford = shopItem.cost <= playerGold
    const item = shopItem as Item

    return (
      <div
        key={item.id}
        style={{
          backgroundColor: '#fff9c4', // Yellow background
          border: '2px solid #f9a825',
          borderRadius: '8px',
          padding: '12px',
          margin: '8px',
          minWidth: '200px',
          maxWidth: '250px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          opacity: canAfford ? 1 : 0.6,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontSize: '10px', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Item
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#f57c00' }}>
            💰 {shopItem.cost}
          </div>
        </div>

        {/* Name */}
        <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>
          {shopItem.name}
        </div>

        {/* Description */}
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px', minHeight: '40px' }}>
          {shopItem.description}
        </div>

        {/* Special effects for items */}
        {item.specialEffects && item.specialEffects.length > 0 && (
          <div style={{ fontSize: '11px', color: '#9c27b0', marginBottom: '8px', fontStyle: 'italic' }}>
            Effects: {item.specialEffects.join(', ')}
          </div>
        )}

        {/* Activated ability */}
        {item.hasActivatedAbility && item.activatedAbilityDescription && (
          <div style={{ fontSize: '11px', color: '#1976d2', marginBottom: '8px', fontStyle: 'italic' }}>
            ⚡ {item.activatedAbilityDescription}
          </div>
        )}

        {/* Stat bonuses for items */}
        {(item.attackBonus || item.hpBonus) && (
          <div style={{ fontSize: '12px', marginBottom: '8px', fontWeight: 'bold' }}>
            {item.attackBonus && <span>⚔️ +{item.attackBonus} </span>}
            {item.hpBonus && <span>❤️ +{item.hpBonus}</span>}
          </div>
        )}

        {/* Purchase buttons */}
        {canAfford ? (
          <button
            onClick={() => handlePurchase(shopItem)}
            style={{
              width: '100%',
              padding: '8px 12px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
              marginTop: '8px',
            }}
          >
            Buy Item
          </button>
        ) : (
          <div style={{
            padding: '8px 12px',
            backgroundColor: '#ccc',
            color: '#666',
            borderRadius: '4px',
            fontSize: '12px',
            textAlign: 'center',
            marginTop: '8px',
          }}>
            Cannot Afford
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        border: '3px solid #f9a825',
        borderRadius: '12px',
        padding: '20px',
        zIndex: 1000,
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ marginTop: 0, color: '#f57c00' }}>
          Item Shop - {itemShopPlayer === 'player1' ? 'Player 1' : 'Player 2'}
        </h2>
        <button
          onClick={handleClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#9e9e9e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Close
        </button>
      </div>

      {/* Gold display and adjustment */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '12px',
        backgroundColor: '#fff9c4',
        borderRadius: '8px',
        border: '2px solid #f9a825',
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f57c00' }}>
          Gold: {playerGold}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px' }}>Adjust:</span>
          <button
            onClick={() => adjustGold(itemShopPlayer, -1)}
            style={{
              padding: '4px 8px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            -1
          </button>
          <button
            onClick={() => adjustGold(itemShopPlayer, -5)}
            style={{
              padding: '4px 8px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            -5
          </button>
          <button
            onClick={() => adjustGold(itemShopPlayer, +1)}
            style={{
              padding: '4px 8px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            +1
          </button>
          <button
            onClick={() => adjustGold(itemShopPlayer, +5)}
            style={{
              padding: '4px 8px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            +5
          </button>
        </div>
      </div>

      {/* Tier display */}
      <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
        Tier: {playerTier}
      </div>

      {/* Affordable items */}
      {affordableItems.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#4caf50', marginBottom: '12px' }}>Available ({affordableItems.length})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {affordableItems.map((item, index) => renderShopItem(item, index))}
          </div>
        </div>
      )}

      {/* Unaffordable items (grayed out) */}
      {unaffordableItems.length > 0 && (
        <div>
          <h3 style={{ color: '#999', marginBottom: '12px' }}>Cannot Afford ({unaffordableItems.length})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {unaffordableItems.map((item, index) => renderShopItem(item, index + affordableItems.length))}
          </div>
        </div>
      )}

      {itemShopItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          No items available
        </div>
      )}
    </div>
  )
}
