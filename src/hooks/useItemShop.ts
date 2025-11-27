import { useCallback } from 'react'
import { Item, Card, GameMetadata, ShopItem, BattlefieldBuff, BattlefieldId } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { tier1Items } from '../game/sampleData'

export function useItemShop() {
  const { gameState, setGameState, setShowItemShop, setItemShopItems } = useGameContext()
  const metadata = gameState.metadata

  const generateItemShop = useCallback(() => {
    const player = metadata.activePlayer
    const playerTier = player === 'player1' ? metadata.player1Tier : metadata.player2Tier
    const availableItems = tier1Items.filter(item => item.tier === playerTier)
    // Shuffle and pick 3 random items
    const shuffled = [...availableItems].sort(() => Math.random() - 0.5)
    setItemShopItems(shuffled.slice(0, 3))
  }, [metadata.activePlayer, metadata.player1Tier, metadata.player2Tier, setItemShopItems])

  const handleBuyItem = useCallback((shopItem: ShopItem, targetHeroId?: string, battlefieldId?: BattlefieldId) => {
    const player = metadata.activePlayer
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
      
      setShowItemShop(false)
      return
    }
    
    // It's a regular item
    const item = shopItem as Item
    if (currentGold < item.cost) {
      alert(`Not enough gold! Need ${item.cost}, have ${currentGold}`)
      return
    }

    // If no target hero specified, find the first hero in hand or on battlefield
    if (!targetHeroId) {
      const heroes = [...gameState[`${player}Hand` as keyof typeof gameState] as Card[],
                      ...gameState.battlefieldA[player as 'player1' | 'player2'],
                      ...gameState.battlefieldB[player as 'player1' | 'player2']]
        .filter(c => c.cardType === 'hero')
      
      if (heroes.length === 0) {
        alert('No heroes available to equip item')
        return
      }
      targetHeroId = heroes[0].id
    }

    setGameState(prev => {
      const updateCard = (c: Card): Card => {
        if (c.id === targetHeroId && c.cardType === 'hero') {
          const hero = c as import('../game/types').Hero
          const equippedItems = hero.equippedItems || []
          const newAttack = hero.attack + (item.attackBonus || 0)
          const newMaxHealth = hero.maxHealth + (item.hpBonus || 0)
          const newCurrentHealth = hero.currentHealth + (item.hpBonus || 0)
          
          return {
            ...hero,
            attack: newAttack,
            maxHealth: newMaxHealth,
            currentHealth: newCurrentHealth,
            equippedItems: [...equippedItems, item.id],
          }
        }
        return c
      }

      return {
        ...prev,
        [`${player}Hand`]: (prev[`${player}Hand` as keyof typeof prev] as Card[]).map(updateCard),
        [`${player}Base`]: (prev[`${player}Base` as keyof typeof prev] as Card[]).map(updateCard),
        battlefieldA: {
          ...prev.battlefieldA,
          [player]: prev.battlefieldA[player as 'player1' | 'player2'].map(updateCard),
        },
        battlefieldB: {
          ...prev.battlefieldB,
          [player]: prev.battlefieldB[player as 'player1' | 'player2'].map(updateCard),
        },
        metadata: {
          ...prev.metadata,
          [`${player}Gold`]: (prev.metadata[`${player}Gold` as keyof GameMetadata] as number) - item.cost,
        },
      }
    })

    setShowItemShop(false)
  }, [gameState, metadata, setGameState, setShowItemShop])

  const handleUpgradeTier = useCallback(() => {
    const player = metadata.activePlayer
    setGameState(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [`${player}Tier`]: 2,
      },
    }))
    generateItemShop()
  }, [metadata.activePlayer, setGameState, generateItemShop])

  const handleSkipShop = useCallback(() => {
    const player = metadata.activePlayer
    setGameState(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [`${player}Gold`]: (prev.metadata[`${player}Gold` as keyof GameMetadata] as number) + 2,
      },
    }))
    setShowItemShop(false)
  }, [metadata.activePlayer, setGameState, setShowItemShop])

  return {
    generateItemShop,
    handleBuyItem,
    handleUpgradeTier,
    handleSkipShop,
  }
}



