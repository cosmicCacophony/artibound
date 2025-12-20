# Code Persistence & Regression Prevention Guide

## Problem Statement
Code changes verified during active testing (`npm run dev`) sometimes regress or aren't properly kept when starting a new session.

## Root Causes & Solutions

### 1. **AI-Assisted Edits Not Reading Full Context**
**Problem:** When AI makes edits, it may not read the entire file, leading to partial changes that conflict with existing code.

**Solution:**
- Always read the full file before making edits
- Use `read_file` with no offset/limit to get complete context
- Verify changes match the intended state after editing

**Best Practice:**
```typescript
// Before editing, always:
read_file({ target_file: "path/to/file.tsx" })

// Then make targeted edits with full context
```

### 2. **Vite Cache Issues**
**Problem:** Vite's HMR cache might serve stale versions of files.

**Solution:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
rm -rf dist

# Restart dev server
npm run dev
```

**Prevention:**
- Add to `.gitignore` (already present):
  - `node_modules/.vite`
  - `dist`

### 3. **Uncommitted Changes**
**Problem:** Changes exist only in working directory and might be lost.

**Solution:**
- **Commit frequently** - Even work-in-progress changes
- Use feature branches for experimental changes
- Consider using `git stash` for temporary changes

**Workflow:**
```bash
# After verifying changes work:
git add .
git commit -m "WIP: feature description"
```

### 4. **Editor Auto-Formatting Conflicts**
**Problem:** Editor auto-formatting might conflict with AI-generated code.

**Solution:**
- Configure consistent formatting rules
- Consider adding `.prettierrc` or `.editorconfig`
- Ensure AI respects existing formatting

### 5. **File Save Issues**
**Problem:** Files might not be saving properly.

**Solution:**
- Verify files are saved before closing editor
- Check file timestamps: `ls -lt src/**/*.tsx | head -10`
- Use `git status` to verify changes are detected

### 6. **Multiple Edit Sessions**
**Problem:** Changes from one session might conflict with another.

**Solution:**
- **Always start by reading current state:**
  ```bash
  git status  # See what changed
  git diff    # See actual changes
  ```
- **Verify file state before editing:**
  - Read the file completely
  - Understand current implementation
  - Make edits that preserve existing logic

## Recommended Workflow

### Before Starting Work
1. Check git status: `git status`
2. Review recent changes: `git log --oneline -5`
3. Read any files you'll be editing completely
4. Clear Vite cache if experiencing issues: `rm -rf node_modules/.vite`

### During Development
1. Make small, focused changes
2. Test immediately after each change
3. Commit frequently (even WIP commits)
4. Verify changes persist after restarting dev server

### After Making Changes
1. Verify files are saved
2. Check `git diff` to see actual changes
3. Test in browser (`npm run dev`)
4. Commit working changes: `git add . && git commit -m "description"`

### When AI Makes Changes
1. **Always request full file read first:**
   - "Read the entire file X before making changes"
   - "Show me the current state of file Y"

2. **Verify AI edits:**
   - Review the diff after AI makes changes
   - Test the changes immediately
   - If something breaks, revert and ask AI to re-read

3. **Be explicit about context:**
   - "Read the full file and understand the current implementation"
   - "Make sure to preserve existing logic in function X"

## Prevention Checklist

- [ ] Files are saved before closing editor
- [ ] Changes are committed to git
- [ ] Vite cache cleared if experiencing issues
- [ ] Full file context read before AI edits
- [ ] Changes tested in browser
- [ ] Git diff reviewed to verify actual changes
- [ ] No conflicting auto-formatters running

## Debugging Regressions

If changes regress:

1. **Check git history:**
   ```bash
   git log --oneline --all -10
   git diff HEAD~1  # Compare with previous commit
   ```

2. **Check file timestamps:**
   ```bash
   ls -lt src/**/*.tsx | head -10
   ```

3. **Verify file contents:**
   ```bash
   git diff path/to/file.tsx
   ```

4. **Clear all caches:**
   ```bash
   rm -rf node_modules/.vite dist
   npm run dev
   ```

5. **Check for auto-formatting:**
   - Review editor settings
   - Check for `.prettierrc`, `.editorconfig`
   - Verify no git hooks are running

## AI Assistant Best Practices

When making code changes, the AI should:

1. **Always read full files before editing:**
   - Use `read_file` without offset/limit
   - Understand complete context

2. **Make targeted, complete edits:**
   - Include sufficient context in `old_string`
   - Ensure `new_string` is complete and correct

3. **Verify after editing:**
   - Read the file back to confirm changes
   - Check for syntax errors
   - Ensure logic is preserved

4. **Respect existing code style:**
   - Match indentation
   - Match naming conventions
   - Preserve comments and structure

## Quick Fixes

### Clear All Caches
```bash
rm -rf node_modules/.vite dist
npm run dev
```

### Verify Current State
```bash
git status
git diff
ls -lt src/**/*.tsx | head -10
```

### Save and Commit
```bash
git add .
git commit -m "WIP: description of changes"
```

### Restore from Git
```bash
# If changes were lost, restore from last commit:
git checkout -- path/to/file.tsx

# Or restore all files:
git checkout -- .
```


