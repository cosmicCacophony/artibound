# Card Description Extraction Guide

## Quick Start

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Run the extraction script**:
   ```bash
   npm run extract-cards
   ```

The script will automatically:
- Load your existing `artifact-foundry-inspiration.json` file
- Identify cards that need descriptions (those marked as "Unknown")
- Extract descriptions from thinkArtifact.com
- Update the JSON file with extracted descriptions
- Save progress periodically (every 10 cards by default)

## What the Script Does

1. **Opens a browser** (headless by default) and navigates to thinkArtifact.com
2. **For each card needing extraction**:
   - Searches for the card by name
   - Clicks on the card to view details
   - Extracts the description, cost, and type
   - Updates the JSON file
3. **Saves progress** every 10 cards and at the end
4. **Shows a summary** with success/failure counts

## Configuration

Edit the `CONFIG` object in `scripts/extract-card-descriptions.ts`:

```typescript
const CONFIG = {
  baseUrl: 'https://thinkartifact.com',
  delayBetweenCards: 2000,      // 2 seconds between cards
  delayAfterSearch: 1000,       // 1 second after searching
  delayAfterClick: 2000,        // 2 seconds after clicking
  maxRetries: 3,                // Retry failed extractions 3 times
  saveInterval: 10,             // Save every 10 cards
  headless: true,               // Set to false to see the browser
};
```

## Monitoring Progress

The script outputs:
- Progress for each card: `[1/348] Extracting: "Card Name"`
- Success: `✅ Extracted: "Description..."`
- Warnings: `⚠️ Could not find...` or `⚠️ No description found...`
- Errors: `❌ Error extracting...`
- Final summary with statistics

## Stopping and Resuming

- You can stop the script at any time (Ctrl+C)
- Progress is saved periodically, so you won't lose work
- When you restart, the script will skip cards that already have descriptions
- Cards with "Unknown" or empty descriptions will be extracted

## Troubleshooting

### Browser doesn't launch
- Make sure Puppeteer is installed: `npm install puppeteer`
- On some systems, you may need to install Chromium dependencies

### Cards not found
- The website structure may have changed
- Check the selectors in the script (search for `ref="e71"` etc.)
- Try running with `headless: false` to see what's happening

### Rate limiting
- Increase `delayBetweenCards` if you're getting blocked
- The script already includes respectful delays

### Partial extraction
- The script saves progress, so you can resume
- Failed cards will be logged but won't stop the process
- Check the final summary to see which cards failed

## Current Status

- **Total cards**: 351
- **Extracted**: 3 (Shockwave, Duel, God's Strength)
- **Remaining**: 348

## Notes

- The script is designed to be respectful to the website with built-in delays
- Failed extractions are logged but don't stop the process
- You can run the script multiple times - it will only extract missing descriptions
- The script handles retries automatically for transient errors


