// Script to extract Artifact Foundry card descriptions
// This script can be run in the browser console on thinkArtifact.com

async function extractCardDescriptions() {
  const cards = [];
  const cardNames = [
    "Shockwave", "Duel", "God's Strength", "Laguna Blade", "Annihilation",
    "Time of Triumph", "Double Edge", "Fighting Words", "Ice Shard",
    "Arc Bolt", "Cunning Plan", "Frostbite", "Light Strike Array",
    "Dragon Slave", "Mystic Flare", "Thundergod's Wrath", "Echo Slam",
    "Bolt of Damocles", "Slay", "Death Pulse", "Gank", "Assassinate",
    "Bronze Legionnaire", "Loyal Beast", "Shock Trooper", "Lancer Illusion",
    "Legion Standard Bearer", "Stonehall Elite", "Centaur Poacher",
    "Sapphire Archivist", "Spark Wraith", "Gold Elemental", "Wildwing",
    "Morphling Whelp", "Keenfolk Golem", "Sapphire Archon", "Thunderhide Pack"
  ];
  
  for (const cardName of cardNames) {
    try {
      // Search for the card
      const searchBox = document.querySelector('[ref="e71"]');
      if (searchBox) {
        searchBox.value = cardName;
        searchBox.dispatchEvent(new Event('input', { bubbles: true }));
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Click on the first matching card
      const cardLinks = Array.from(document.querySelectorAll('[cursor=pointer]'));
      const cardLink = cardLinks.find(link => {
        const text = link.textContent || '';
        return text.includes(cardName);
      });
      
      if (cardLink) {
        cardLink.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Extract description
        const descriptionElements = document.querySelectorAll('[ref="e2662"]');
        let description = '';
        if (descriptionElements.length > 0) {
          description = Array.from(descriptionElements)
            .map(el => el.textContent?.trim())
            .join(' ')
            .replace(/\s+/g, ' ');
        }
        
        // Extract cost
        const costElement = document.querySelector('[ref="e2657"]');
        let cost = null;
        if (costElement) {
          const costText = costElement.textContent?.trim();
          const costMatch = costText?.match(/^(\d+)$/);
          if (costMatch) cost = parseInt(costMatch[1]);
        }
        
        // Extract type
        const typeElement = document.querySelector('[ref="e84"]');
        const type = typeElement?.textContent?.trim() || '';
        
        cards.push({
          name: cardName,
          cost,
          type,
          description
        });
        
        console.log(`Extracted: ${cardName} - ${description.substring(0, 50)}...`);
      }
    } catch (error) {
      console.error(`Error extracting ${cardName}:`, error);
    }
  }
  
  return cards;
}

// Run the extraction
extractCardDescriptions().then(cards => {
  console.log('Extraction complete!');
  console.log(JSON.stringify(cards, null, 2));
});













