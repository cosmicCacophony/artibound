# Hot Reload Guide - Editing Cards

## How It Works

With Vite, **Hot Module Replacement (HMR) is already enabled**! This means when you edit card data files, changes should automatically appear in your browser without a full page refresh.

## Editing Cards

### Option 1: Edit TypeScript Files Directly (Recommended)

1. **Find the card** you want to edit:
   - Most cards are in `src/game/comprehensiveCardData.ts`
   - Some test cards are in `src/game/sampleData.ts`

2. **Edit the card data**:
   ```typescript
   {
     id: 'ru-spell-2',
     name: 'Fireball',
     description: 'Deal 5 damage',
     cardType: 'spell',
     colors: ['red'],
     manaCost: 4,
     effect: {
       type: 'targeted_damage',
       damage: 5,  // ← Change this value
       affectsUnits: true,
       affectsHeroes: true,
     },
   }
   ```

3. **Save the file** - Vite will automatically:
   - Detect the change
   - Hot-reload the module
   - Update the browser (you'll see a brief update indicator)

### Option 2: Use the Card Editor Modal (In-Game)

The game already has a `CardEditorModal` component that lets you edit cards through the UI. This also supports hot-reload when changes are saved.

## Verifying Hot Reload Works

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Open the game** in your browser (usually `http://localhost:5173`)

3. **Edit a card** in `src/game/comprehensiveCardData.ts`:
   - Change Fireball's damage from 5 to 10
   - Save the file

4. **Watch the browser** - you should see:
   - A brief "HMR update" message in the console
   - The game state updates automatically
   - No page refresh needed!

## Troubleshooting

### If hot-reload isn't working:

1. **Check the browser console** for errors
2. **Check the terminal** where `npm run dev` is running
3. **Try a hard refresh**: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)
4. **Restart the dev server**: Stop it (`Ctrl+C`) and run `npm run dev` again

### Common Issues:

- **TypeScript errors**: Fix any syntax errors first - HMR won't work if the file has errors
- **Import cycles**: If you see "circular dependency" warnings, that might prevent HMR
- **Large files**: Very large files might take a moment to hot-reload

## Tips for Fast Iteration

1. **Keep the game open** while editing - you'll see changes instantly
2. **Use the browser's React DevTools** to inspect state changes
3. **Edit multiple cards** - all changes will hot-reload together
4. **Test in-game** - changes to card stats/effects will be immediately visible

## Example: Editing Fireball

1. Open `src/game/comprehensiveCardData.ts`
2. Find the Fireball card (around line 509)
3. Change `damage: 5` to `damage: 10`
4. Save the file
5. The change should appear in-game immediately!

The card will update in:
- Draft packs
- Card library
- Any games you start
- Card previews

No restart needed! 🎉


