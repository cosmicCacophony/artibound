#!/usr/bin/env python3
"""
Script to extract all Artifact Foundry card descriptions from thinkArtifact.com
This script uses Selenium to navigate the site and extract card data.
"""

import json
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

def extract_card_description(driver, card_name):
    """Extract description for a single card"""
    try:
        # Clear search and search for card
        search_box = driver.find_element(By.CSS_SELECTOR, '[ref="e71"]')
        search_box.clear()
        search_box.send_keys(card_name)
        time.sleep(0.5)
        
        # Click on the card (first clickable element with card name)
        # This is a simplified approach - may need refinement
        card_links = driver.find_elements(By.CSS_SELECTOR, '[cursor=pointer]')
        for link in card_links:
            if card_name.lower() in link.text.lower():
                link.click()
                time.sleep(1)
                break
        
        # Extract description
        description_elements = driver.find_elements(By.CSS_SELECTOR, '[ref="e2682"]')
        if not description_elements:
            description_elements = driver.find_elements(By.CSS_SELECTOR, '[ref="e2662"]')
        
        description = ''
        if description_elements:
            description = ' '.join([el.text.strip() for el in description_elements if el.text.strip()])
        
        # Extract cost
        cost_elements = driver.find_elements(By.CSS_SELECTOR, '[ref="e2677"]')
        if not cost_elements:
            cost_elements = driver.find_elements(By.CSS_SELECTOR, '[ref="e2657"]')
        
        cost = None
        if cost_elements:
            cost_text = cost_elements[0].text.strip()
            try:
                cost = int(cost_text)
            except:
                pass
        
        # Extract type
        type_element = driver.find_element(By.CSS_SELECTOR, '[ref="e84"]')
        card_type = type_element.text.strip() if type_element else ''
        
        return {
            'name': card_name,
            'cost': cost,
            'type': card_type,
            'description': description
        }
    except Exception as e:
        print(f"Error extracting {card_name}: {e}")
        return None

def main():
    # Card list from previous extraction
    cards_to_extract = [
        # Add all 351 card names here
    ]
    
    # This would require Selenium setup
    # For now, this is a template script
    print("This script requires Selenium setup to run automatically.")
    print("Manual extraction may be more reliable for this website.")

if __name__ == "__main__":
    main()





