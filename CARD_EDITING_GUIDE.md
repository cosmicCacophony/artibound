# Card Editing with Persistent Storage

## Overview

Card edits are now **automatically saved to localStorage** and will persist across app restarts! No database needed - everything is stored locally in your browser.

## How It Works

1. **Edit a card** using the Card Editor Modal (in-game) or by editing the TypeScript files
2. **Changes are saved** to localStorage automatically
3. **On app restart**, your edits are automatically loaded and applied
4. **Default values** are used for any properties you haven't edited

## Editing Cards

### Method 1: In-Game Editor (Recommended)

1. Open the Card Library view in-game
2. Click on any card to edit it
3. Make your changes (damage, mana cost, stats, etc.)
4. Click "Save Changes"
5. **Your edits are automatically saved to localStorage!**

### Method 2: Programmatic Editing

You can also edit cards programmatically:

```typescript
import { updateCard, updateSpell, updateHero } from './game/cardData'

// Update Fireball's damage to 10
updateSpell('ru-spell-2', {
  effect: {
    type: 'targeted_damage',
    damage: 10,  // Changed from 5
    affectsUnits: true,
    affectsHeroes: true,
  }
})

// Update a card's stats
updateCard('rw-token-2', {
  attack: 4,
  health: 4,
  manaCost: 3,
})
```

## Viewing Your Edits

Your edits are stored in browser localStorage under these keys:
- `artibound_edited_cards` - Card edits
- `artibound_edited_heroes` - Hero edits
- `artibound_edited_spells` - Spell edits
- `artibound_edited_battlefields` - Battlefield edits

You can view them in browser DevTools:
1. Open DevTools (F12)
2. Go to Application/Storage tab
3. Click "Local Storage"
4. Find the keys above

## Resetting Edits

### Reset a Single Card

```typescript
import { resetCard, resetSpell, resetHero } from './game/cardData'

// Reset Fireball to default
resetSpell('ru-spell-2')
```

### Reset All Edits

```typescript
import { clearAllOverrides } from './game/cardData'

// Clear all localStorage edits (returns to defaults)
clearAllOverrides()
```

Or manually in DevTools:
1. Open DevTools → Application → Local Storage
2. Delete the `artibound_edited_*` keys
3. Refresh the page

## Example: Editing Fireball

1. **Find Fireball's ID**: `ru-spell-2` (in `comprehensiveCardData.ts`)

2. **Edit in-game**:
   - Open Card Library
   - Find Fireball
   - Change damage from 5 to 10
   - Save

3. **Or edit programmatically**:
   ```typescript
   import { updateSpell } from './game/cardData'
   
   updateSpell('ru-spell-2', {
     effect: {
       type: 'targeted_damage',
       damage: 10,  // Your edit
       affectsUnits: true,
       affectsHeroes: true,
     }
   })
   ```

4. **Restart the app** - Fireball will still have 10 damage!

## Technical Details

- **Storage**: Browser localStorage (persists across sessions)
- **Format**: JSON (human-readable)
- **Scope**: Per-browser (edits are local to your browser)
- **Performance**: Edits are merged with defaults at runtime (very fast)
- **Backup**: You can export localStorage data to back up your edits

## Exporting/Backing Up Edits

To back up your edits:

```javascript
// In browser console
const edits = {
  cards: JSON.parse(localStorage.getItem('artibound_edited_cards') || '{}'),
  heroes: JSON.parse(localStorage.getItem('artibound_edited_heroes') || '{}'),
  spells: JSON.parse(localStorage.getItem('artibound_edited_spells') || '{}'),
  battlefields: JSON.parse(localStorage.getItem('artibound_edited_battlefields') || '{}'),
}
console.log(JSON.stringify(edits, null, 2))
// Copy the output and save it somewhere
```

## Notes

- Edits only override the properties you change (partial updates)
- Default values from `comprehensiveCardData.ts` are still the source of truth
- If you delete localStorage, all edits are lost (but defaults remain)
- Edits work with hot-reload - changes appear immediately
- Multiple edits to the same card are merged (last edit wins for each property)


