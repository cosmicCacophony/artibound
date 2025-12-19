#!/bin/bash
# Script to verify code changes are persisted correctly
# Usage: ./scripts/verify-changes.sh

set -e

echo "🔍 Verifying code changes persistence..."
echo ""

# Check git status
echo "📊 Git Status:"
git status --short
echo ""

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  You have uncommitted changes"
  echo "   Consider committing: git add . && git commit -m 'WIP: description'"
  echo ""
fi

# Check file timestamps (most recently modified)
echo "📅 Most recently modified source files:"
find src -name "*.ts" -o -name "*.tsx" | xargs ls -lt 2>/dev/null | head -10
echo ""

# Check Vite cache
if [ -d "node_modules/.vite" ]; then
  echo "🗑️  Vite cache exists (node_modules/.vite)"
  echo "   If experiencing issues, clear with: rm -rf node_modules/.vite"
  echo ""
fi

# Check for common issues
echo "✅ Verification complete"
echo ""
echo "💡 Tips:"
echo "   - Always commit working changes: git add . && git commit -m 'description'"
echo "   - Clear Vite cache if issues persist: rm -rf node_modules/.vite"
echo "   - Verify changes with: git diff"
echo "   - Test after each change: npm run dev"

