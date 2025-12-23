#!/usr/bin/env tsx
/**
 * Script to find card data files in the SteamDatabase GameTracking-Artifact-Beta repository
 * Uses GitHub API to search for files that might contain card data
 */

import * as https from 'https';

const REPO_OWNER = 'SteamDatabase';
const REPO_NAME = 'GameTracking-Artifact-Beta';
const BASE_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

interface GitHubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
}

/**
 * Get the tree structure for a path in the repository
 */
async function getTree(path: string = ''): Promise<GitHubTreeItem[]> {
  return new Promise((resolve, reject) => {
    const url = path
      ? `${BASE_URL}/git/trees/master:${path}?recursive=1`
      : `${BASE_URL}/git/trees/master?recursive=1`;

    https.get(
      url,
      {
        headers: {
          'User-Agent': 'Artibound-Card-Extractor',
          Accept: 'application/vnd.github.v3+json',
        },
      },
      (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const response: GitHubTreeResponse = JSON.parse(data);
              resolve(response.tree);
            } catch (error) {
              reject(new Error(`Failed to parse response: ${error}`));
            }
          } else {
            reject(new Error(`GitHub API error: ${res.statusCode} - ${data}`));
          }
        });
      }
    ).on('error', reject);
  });
}

/**
 * Search for files matching card-related patterns
 */
function findCardFiles(files: GitHubTreeItem[]): GitHubTreeItem[] {
  const cardKeywords = [
    'card',
    'ability',
    'hero',
    'spell',
    'creep',
    'dcg_',
    'carddef',
    'card_data',
    'abilities',
  ];

  return files.filter((file) => {
    const pathLower = file.path.toLowerCase();
    return (
      cardKeywords.some((keyword) => pathLower.includes(keyword)) &&
      (file.type === 'blob') &&
      (file.path.endsWith('.txt') ||
        file.path.endsWith('.lua') ||
        file.path.endsWith('.json') ||
        file.path.endsWith('.vdata_c') ||
        file.path.endsWith('.vdata'))
    );
  });
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Searching for card data files in GitHub repository...\n');
  console.log(`Repository: ${REPO_OWNER}/${REPO_NAME}\n`);

  try {
    // Search in game/dcg directory first (most likely location)
    console.log('📂 Searching in game/dcg directory...');
    const dcgFiles = await getTree('game/dcg');
    const dcgCardFiles = findCardFiles(dcgFiles);
    
    console.log(`Found ${dcgCardFiles.length} potential card files in game/dcg:\n`);
    dcgCardFiles.forEach((file) => {
      console.log(`  📄 ${file.path} (${file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'size unknown'})`);
    });

    // Also search in game/core (Lua files are common there)
    console.log('\n📂 Searching in game/core directory...');
    const coreFiles = await getTree('game/core');
    const coreCardFiles = findCardFiles(coreFiles);
    
    if (coreCardFiles.length > 0) {
      console.log(`Found ${coreCardFiles.length} potential card files in game/core:\n`);
      coreCardFiles.slice(0, 20).forEach((file) => {
        console.log(`  📄 ${file.path} (${file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'size unknown'})`);
      });
      if (coreCardFiles.length > 20) {
        console.log(`  ... and ${coreCardFiles.length - 20} more files`);
      }
    } else {
      console.log('  No card-related files found in game/core');
    }

    // Get raw file URLs
    console.log('\n📋 Raw file URLs (you can download these directly):\n');
    [...dcgCardFiles, ...coreCardFiles].slice(0, 10).forEach((file) => {
      const rawUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/master/${file.path}`;
      console.log(`  🔗 ${rawUrl}`);
    });

    console.log('\n✅ Search complete!');
    console.log('\n💡 Tip: You can download these files directly using the raw URLs above.');
    console.log('   Or use: curl -O <raw_url> to download a file');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();


















