#!/usr/bin/env tsx
/**
 * Automated card description extractor for Artifact Foundry cards
 * Uses Puppeteer to scrape thinkArtifact.com and extract card descriptions
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Card {
  name: string;
  cost: number | null;
  type: string;
  color: string;
  description: string;
  designNotes?: string;
}

interface CardData {
  metadata: any;
  heroes: any[];
  cards: Card[];
}

// Configuration
const CONFIG = {
  baseUrl: 'https://thinkartifact.com',
  delayBetweenCards: 2000, // 2 seconds between card extractions
  delayAfterSearch: 1000, // 1 second after searching
  delayAfterClick: 2000, // 2 seconds after clicking a card
  maxRetries: 3,
  saveInterval: 10, // Save progress every N cards
  headless: true, // Set to false to see the browser
};

/**
 * Extract description for a single card
 */
async function extractCardDescription(
  page: Page,
  cardName: string,
  retryCount = 0
): Promise<{ description: string; cost: number | null; type: string } | null> {
  try {
    // Navigate to main page
    await page.goto(CONFIG.baseUrl, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(500);

    // Find and clear the search box
    const searchSelector = 'input[ref="e71"]';
    await page.waitForSelector(searchSelector, { timeout: 10000 });
    await page.click(searchSelector, { clickCount: 3 }); // Triple click to select all
    await page.type(searchSelector, cardName);
    await page.waitForTimeout(CONFIG.delayAfterSearch);

    // Find and click the card in the list
    // Cards are clickable elements with the card name
    const cardSelector = `[cursor=pointer]:has-text("${cardName}")`;
    
    try {
      await page.waitForSelector(cardSelector, { timeout: 5000 });
      await page.click(cardSelector);
    } catch (error) {
      // Try alternative: look for elements containing the card name
      const allClickable = await page.$$('[cursor=pointer]');
      let found = false;
      
      for (const element of allClickable) {
        const text = await page.evaluate((el) => el.textContent, element);
        if (text && text.includes(cardName) && text.length < 100) {
          await element.click();
          found = true;
          break;
        }
      }
      
      if (!found) {
        console.warn(`  ⚠️  Could not find clickable element for "${cardName}"`);
        return null;
      }
    }

    await page.waitForTimeout(CONFIG.delayAfterClick);

    // Extract card information
    const cardInfo = await page.evaluate(() => {
      const nameEl = document.querySelector('[ref="e82"]');
      const typeEl = document.querySelector('[ref="e84"]');
      const costEl = document.querySelector('[ref="e2677"]') || document.querySelector('[ref="e2670"]');
      
      // Try multiple selectors for description
      const descSelectors = [
        '[ref="e2674"]',
        '[ref="e2682"]',
        '[ref="e2662"]',
      ];
      
      let description = '';
      for (const selector of descSelectors) {
        const descEls = document.querySelectorAll(selector);
        if (descEls.length > 0) {
          description = Array.from(descEls)
            .map((el) => el.textContent?.trim() || '')
            .filter((text) => text.length > 0 && !text.match(/^(Previously|Changed to|Card art|Card text|Card thumbnail)/))
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
          if (description) break;
        }
      }

      const name = nameEl?.textContent?.trim() || '';
      const type = typeEl?.textContent?.trim() || '';
      const costText = costEl?.textContent?.trim() || '';
      const cost = costText ? parseInt(costText) : null;

      return { name, type, cost, description };
    });

    if (!cardInfo.description) {
      if (retryCount < CONFIG.maxRetries) {
        console.warn(`  ⚠️  No description found for "${cardName}", retrying... (${retryCount + 1}/${CONFIG.maxRetries})`);
        return extractCardDescription(page, cardName, retryCount + 1);
      }
      console.warn(`  ⚠️  Could not extract description for "${cardName}" after ${CONFIG.maxRetries} retries`);
      return { description: '', cost: cardInfo.cost, type: cardInfo.type };
    }

    return {
      description: cardInfo.description,
      cost: cardInfo.cost,
      type: cardInfo.type,
    };
  } catch (error) {
    console.error(`  ❌ Error extracting "${cardName}":`, error);
    if (retryCount < CONFIG.maxRetries) {
      console.log(`  🔄 Retrying... (${retryCount + 1}/${CONFIG.maxRetries})`);
      await page.waitForTimeout(2000);
      return extractCardDescription(page, cardName, retryCount + 1);
    }
    return null;
  }
}

/**
 * Load card data from JSON file
 */
async function loadCardData(): Promise<CardData> {
  const filePath = path.join(__dirname, '..', 'artifact-foundry-inspiration.json');
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Save card data to JSON file
 */
async function saveCardData(data: CardData): Promise<void> {
  const filePath = path.join(__dirname, '..', 'artifact-foundry-inspiration.json');
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Main extraction function
 */
async function main() {
  console.log('🚀 Starting card description extraction...\n');

  // Load existing data
  const cardData = await loadCardData();
  const cards = cardData.cards;

  // Filter cards that need descriptions
  const cardsToExtract = cards.filter(
    (card) =>
      !card.description ||
      card.description === 'Unknown' ||
      card.description.startsWith('Unknown -') ||
      card.description.trim() === ''
  );

  console.log(`📊 Total cards: ${cards.length}`);
  console.log(`📝 Cards needing extraction: ${cardsToExtract.length}`);
  console.log(`✅ Cards already extracted: ${cards.length - cardsToExtract.length}\n`);

  if (cardsToExtract.length === 0) {
    console.log('✨ All cards already have descriptions!');
    return;
  }

  // Launch browser
  console.log('🌐 Launching browser...');
  const browser = await puppeteer.launch({
    headless: CONFIG.headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  let extracted = 0;
  let failed = 0;
  const startTime = Date.now();

  try {
    for (let i = 0; i < cardsToExtract.length; i++) {
      const card = cardsToExtract[i];
      const progress = `[${i + 1}/${cardsToExtract.length}]`;
      
      console.log(`${progress} Extracting: "${card.name}" (${card.cost} cost, ${card.color})`);

      const result = await extractCardDescription(page, card.name);

      if (result && result.description) {
        // Find and update the card in the array
        const cardIndex = cards.findIndex((c) => c.name === card.name);
        if (cardIndex !== -1) {
          cards[cardIndex].description = result.description;
          if (result.cost !== null && cards[cardIndex].cost === null) {
            cards[cardIndex].cost = result.cost;
          }
          if (result.type && !cards[cardIndex].type) {
            cards[cardIndex].type = result.type;
          }
          extracted++;
          console.log(`  ✅ Extracted: "${result.description.substring(0, 60)}${result.description.length > 60 ? '...' : ''}"`);
        }
      } else {
        failed++;
        console.log(`  ❌ Failed to extract description`);
      }

      // Save progress periodically
      if ((i + 1) % CONFIG.saveInterval === 0) {
        cardData.cards = cards;
        await saveCardData(cardData);
        console.log(`\n💾 Progress saved (${extracted} extracted, ${failed} failed)\n`);
      }

      // Delay between cards to be respectful
      if (i < cardsToExtract.length - 1) {
        await page.waitForTimeout(CONFIG.delayBetweenCards);
      }
    }
  } catch (error) {
    console.error('❌ Fatal error during extraction:', error);
  } finally {
    // Final save
    cardData.cards = cards;
    await saveCardData(cardData);

    await browser.close();

    const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
    console.log('\n' + '='.repeat(60));
    console.log('📊 Extraction Summary:');
    console.log(`   ✅ Successfully extracted: ${extracted}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   ⏱️  Time elapsed: ${elapsed} minutes`);
    console.log('='.repeat(60));
  }
}

// Run the script
main().catch((error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

