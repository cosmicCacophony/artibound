import { useCallback } from 'react'
import { Item, Card, GameMetadata, ShopItem, BattlefieldBuff, BattlefieldId, PlayerId, ItemCard } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { tier1Items, battlefieldBuffTemplates } from '../game/sampleData'

export function useItemShop() {
  const { gameState, setGameState, setItemShopItems } = useGameContext()
  const metadata = gameState.metadata

  const generateItemShop = useCallback((player: PlayerId) => {
    const playerTier = player === 'player1' ? metadata.player1Tier : metadata.player2Tier
    // Show ALL available items and buffs, not just random ones
    const availableItems = tier1Items.filter(item => item.tier <= playerTier) // Show tier 1 and tier 2 if player has tier 2
    const availableBuffs = battlefieldBuffTemplates.map(buff => ({ ...buff, type: 'battlefieldBuff' as const }))
    
    const shopItems: ShopItem[] = [
      ...availableItems,
      ...availableBuffs,
    ]
    
    setItemShopItems(shopItems)
  }, [metadata.player1Tier, metadata.player2Tier, setItemShopItems])

  const handleBuyItem = useCallback((shopItem: ShopItem, player: PlayerId, battlefieldId?: BattlefieldId) => {
    const currentGold = player === 'player1' ? metadata.player1Gold : metadata.player2Gold
    
    // Check if it's a battlefield buff
    if ('type' in shopItem && shopItem.type === 'battlefieldBuff') {
      if (!battlefieldId) {
        // Prompt user to select battlefield
        const selected = prompt('Select battlefield: A or B?')
        if (selected?.toUpperCase() === 'A') {
          battlefieldId = 'battlefieldA'
        } else if (selected?.toUpperCase() === 'B') {
          battlefieldId = 'battlefieldB'
        } else {
          return // User cancelled
        }
      }
      
      if (currentGold < shopItem.cost) {
        alert(`Not enough gold! Need ${shopItem.cost}, have ${currentGold}`)
        return
      }
      
      // Create the battlefield buff
      const buff: BattlefieldBuff = {
        id: `buff-${player}-${battlefieldId}-${Date.now()}-${Math.random()}`,
        name: shopItem.name,
        description: shopItem.description,
        cost: shopItem.cost,
        battlefieldId,
        playerId: player,
        effectType: shopItem.effectType,
        effectValue: shopItem.effectValue,
      }
      
      setGameState(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [`${player}Gold`]: (prev.metadata[`${player}Gold` as keyof GameMetadata] as number) - shopItem.cost,
          [`${player}BattlefieldBuffs`]: [
            ...(prev.metadata[`${player}BattlefieldBuffs` as keyof GameMetadata] as BattlefieldBuff[]),
            buff,
          ],
        },
      }))
      
      // Don't close shop after purchase - allow multiple purchases
      return
    }
    
    // It's a regular item - add it to player's hand
    const item = shopItem as Item
    if (currentGold < item.cost) {
      alert(`Not enough gold! Need ${item.cost}, have ${currentGold}`)
      return
    }

    // Create an ItemCard to add to hand
    const itemCard: ItemCard = {
      id: `item-${item.id}-${player}-${Date.now()}-${Math.random()}`,
      name: item.name,
      description: item.description,
      cardType: 'item',
      itemId: item.id,
      location: 'hand',
      owner: player,
    }

    setGameState(prev => ({
      ...prev,
      [`${player}Hand`]: [...(prev[`${player}Hand` as keyof typeof prev] as Card[]), itemCard],
      metadata: {
        ...prev.metadata,
        [`${player}Gold`]: (prev.metadata[`${player}Gold` as keyof GameMetadata] as number) - item.cost,
      },
    }))
    // Don't close shop after purchase - allow multiple purchases
  }, [gameState, metadata, setGameState])

  const handleUpgradeTier = useCallback((player: PlayerId) => {
    setGameState(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [`${player}Tier`]: 2,
      },
    }))
    generateItemShop(player)
  }, [setGameState, generateItemShop])

  const adjustGold = useCallback((player: PlayerId, amount: number) => {
    setGameState(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [`${player}Gold`]: Math.max(0, (prev.metadata[`${player}Gold` as keyof GameMetadata] as number) + amount),
      },
    }))
  }, [setGameState])

  return {
    generateItemShop,
    handleBuyItem,
    handleUpgradeTier,
    adjustGold,
  }
}



