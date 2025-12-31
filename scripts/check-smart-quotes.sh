#!/bin/bash
# Script to check for smart quotes in TypeScript files
# Usage: ./scripts/check-smart-quotes.sh

echo "Checking for smart quotes in TypeScript files..."

# Check for smart quotes (curly quotes)
SMART_QUOTES=$(grep -rn "[''""]" src/game/comprehensiveCardData.ts 2>/dev/null | grep -v "^Binary" | head -10)

if [ -n "$SMART_QUOTES" ]; then
  echo "❌ ERROR: Found smart quotes in comprehensiveCardData.ts:"
  echo "$SMART_QUOTES"
  echo ""
  echo "Please replace all smart quotes with straight quotes:"
  echo "  ' → '"
  echo "  ' → '"
  echo "  \" → \""
  echo "  \" → \""
  exit 1
else
  echo "✅ No smart quotes found!"
  exit 0
fi

