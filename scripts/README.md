# Card Extraction Scripts

## extract-card-descriptions.ts

Automated script to extract card descriptions from thinkArtifact.com using Puppeteer.

### Setup

1. Install dependencies:
```bash
npm install
```

2. Run the extraction script:
```bash
npm run extract-cards
```

### Configuration

Edit the `CONFIG` object in `extract-card-descriptions.ts` to customize:

- `delayBetweenCards`: Delay in milliseconds between card extractions (default: 2000ms)
- `delayAfterSearch`: Delay after searching for a card (default: 1000ms)
- `delayAfterClick`: Delay after clicking a card (default: 2000ms)
- `maxRetries`: Maximum retry attempts for failed extractions (default: 3)
- `saveInterval`: Save progress every N cards (default: 10)
- `headless`: Run browser in headless mode (default: true, set to false to see browser)

### How it works

1. Loads the existing `artifact-foundry-inspiration.json` file
2. Identifies cards that need descriptions (those with "Unknown" or empty descriptions)
3. For each card:
   - Navigates to thinkArtifact.com
   - Searches for the card name
   - Clicks on the card
   - Extracts the description, cost, and type
   - Updates the JSON file
4. Saves progress periodically and at the end

### Progress Tracking

The script will:
- Show progress for each card being extracted
- Save progress every N cards (configurable)
- Display a summary at the end with success/failure counts
- Handle errors gracefully with retry logic

### Notes

- The script is respectful with delays between requests
- Failed extractions are logged but don't stop the process
- You can stop and restart the script - it will skip cards that already have descriptions








