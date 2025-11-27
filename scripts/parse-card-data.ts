#!/usr/bin/env tsx
/**
 * Script to download and parse card data from GitHub repository
 * Extracts card names and descriptions from the English card set file
 */

import * as https from 'https';
import * as fs from 'fs/promises';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CARD_DATA_URL =
  'https://raw.githubusercontent.com/SteamDatabase/GameTracking-Artifact-Beta/master/game/dcg/resource/card_set_01_english.txt';

interface CardData {
  id: string;
  name: string;
  description: string;
}

/**
 * Download file from URL
 */
function downloadFile(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download: ${res.statusCode}`));
        return;
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    }).on('error', reject);
  });
}

/**
 * Clean HTML tags and special formatting from card text
 */
function cleanCardText(text: string): string {
  if (!text) return '';

  // Remove HTML tags first
  let cleaned = text.replace(/<[^>]*>/g, '');

  // Replace special glyphs and formatting
  cleaned = cleaned
    .replace(/&#9632;/g, '■') // Cooldown symbol
    .replace(/&#9633;/g, '▣') // Charge symbol
    .replace(/&#9634;/g, '▢') // Quickcast symbol
    .replace(/&#9635;/g, '▥') // Attack symbol
    .replace(/&#9636;/g, '▦') // Armor symbol
    .replace(/&#9637;/g, '▧') // Health symbol
    .replace(/\[g:\d+\[([^\]]+)\]\]/g, '$1') // Remove game glossary references, keep content
    .replace(/\[color:[^\]]+\]/g, '') // Remove color tags
    .replace(/\[abilityname\[([^\]]+)\]\]/g, '$1: ') // Convert ability names
    .replace(/\[activatedability\[([^\]]*)\]\]/g, '$1') // Remove activated ability wrapper
    .replace(/\[color:ability\[([^\]]+)\]\]/g, '$1') // Remove ability color wrapper
    .replace(/\[color:quick\[([^\]]+)\]\]/g, '$1') // Remove quick color wrapper
    .replace(/\[color:play_effect\[([^\]]+)\]\]/g, '$1') // Remove play effect wrapper
    .replace(/\[color:attribute_glyph\[([^\]]*)\]\]/g, '$1') // Remove attribute glyph wrapper
    .replace(/\{s:thisCardName\}/g, 'this card')
    .replace(/\{s:parentCardName\}/g, 'this card')
    .replace(/\{s:thisCardName\}/g, 'this card')
    .replace(/\[\[([^\]]+)\]\]/g, '$1') // Remove double bracket card references
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/\n/g, ' ')
    // Clean up multiple brackets and empty brackets
    .replace(/\[\]/g, '')
    .replace(/\[\[/g, '[')
    .replace(/\]\]/g, ']')
    .replace(/\]\s*\]/g, ']')
    .replace(/\[\s*\[/g, '[')
    // Clean up whitespace
    .replace(/\s+/g, ' ')
    .replace(/\s*:\s*/g, ': ')
    .replace(/\s*,\s*/g, ', ')
    .trim();

  return cleaned;
}

/**
 * Parse the card data file
 */
function parseCardData(content: string): CardData[] {
  const cards: Map<string, CardData> = new Map();

  // Match CardName_XXXXX and CardText_XXXXX patterns
  const namePattern = /"CardName_(\d+)"\s+"([^"]+)"/g;
  const textPattern = /"CardText_(\d+)"\s+"([^"]*)"/g;

  // Extract card names
  let match;
  while ((match = namePattern.exec(content)) !== null) {
    const [, id, name] = match;
    if (!cards.has(id)) {
      cards.set(id, { id, name: name.trim(), description: '' });
    } else {
      // Update if we have a better name (English version)
      const existing = cards.get(id)!;
      if (name.includes('_English') || !existing.name.includes('_English')) {
        existing.name = name.replace(/_English$/, '').trim();
      }
    }
  }

  // Extract card descriptions
  while ((match = textPattern.exec(content)) !== null) {
    const [, id, text] = match;
    if (cards.has(id)) {
      const card = cards.get(id)!;
      // Only set description if it's not empty and not already set
      if (text && (!card.description || text.length > card.description.length)) {
        card.description = cleanCardText(text);
      }
    } else {
      // Create new card if we found text but no name
      cards.set(id, { id, name: `Card_${id}`, description: cleanCardText(text) });
    }
  }

  return Array.from(cards.values())
    .filter((card) => card.name && !card.name.match(/^Card_\d+$/)) // Filter out unnamed cards
    .sort((a, b) => parseInt(a.id) - parseInt(b.id));
}

/**
 * Update the inspiration JSON file with extracted card data
 */
async function updateInspirationFile(cards: CardData[]): Promise<void> {
  const filePath = path.join(__dirname, '..', 'artifact-foundry-inspiration.json');
  const content = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(content);

  // Create a map of existing cards by name for quick lookup
  const existingCardsMap = new Map(
    data.cards.map((card: any) => [card.name.toLowerCase(), card])
  );

  let updated = 0;
  let added = 0;

  // Update existing cards or add new ones
  for (const card of cards) {
    const existingCard = existingCardsMap.get(card.name.toLowerCase());
    if (existingCard) {
      // Update description if it's missing or marked as unknown
      if (
        !existingCard.description ||
        existingCard.description === 'Unknown' ||
        existingCard.description.startsWith('Unknown -')
      ) {
        existingCard.description = card.description;
        updated++;
      }
    } else {
      // Add new card
      data.cards.push({
        name: card.name,
        cost: null, // We don't have cost info from this file
        type: 'Unknown',
        color: 'Unknown',
        description: card.description,
        designNotes: 'Extracted from GitHub repository',
      });
      added++;
    }
  }

  // Update metadata
  data.metadata.extractionStatus = `Extracted from GitHub - ${updated} updated, ${added} added`;
  data.metadata.lastExtractionDate = new Date().toISOString().split('T')[0];

  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

  console.log(`\n✅ Updated inspiration file:`);
  console.log(`   📝 Updated: ${updated} cards`);
  console.log(`   ➕ Added: ${added} new cards`);
}

/**
 * Main function
 */
async function main() {
  console.log('📥 Downloading card data from GitHub...\n');

  try {
    const content = await downloadFile(CARD_DATA_URL);
    console.log(`✅ Downloaded ${(content.length / 1024).toFixed(2)} KB of data\n`);

    console.log('🔍 Parsing card data...');
    const cards = parseCardData(content);
    console.log(`✅ Found ${cards.length} cards\n`);

    // Show sample
    console.log('📋 Sample cards:');
    cards.slice(0, 5).forEach((card) => {
      console.log(`\n   ${card.name} (ID: ${card.id})`);
      console.log(`   ${card.description.substring(0, 100)}${card.description.length > 100 ? '...' : ''}`);
    });

    console.log('\n💾 Updating inspiration file...');
    await updateInspirationFile(cards);

    console.log('\n✨ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();

