# Bug Fix: temporaryRunes Not Iterable

> **Date:** 2025-12-25  
> **Severity:** High (Crash)  
> **Status:** Fixed ✅  

---

## Issue

**Error:**
```
Uncaught TypeError: pool.temporaryRunes is not iterable
    at getAllAvailableRunes (runeSystem.ts:148:34)
    at canAffordCard (runeSystem.ts:180:26)
```

**Trigger:** Occurred when casting cards (Berserker, Holy Sentinel) that require rune checks.

**Root Cause:** `RunePool.temporaryRunes` was sometimes undefined, but the code tried to spread it without defensive checks.

---

## Fix Applied

### Changes to `src/game/runeSystem.ts`

**1. `getAllAvailableRunes()` - Line 148:**
```typescript
// Before:
return [...pool.runes, ...pool.temporaryRunes]

// After:
return [...pool.runes, ...(pool.temporaryRunes || [])]
```

**2. `getAvailableRuneCount()` - Line 337:**
```typescript
// Before:
return pool.runes.length + pool.temporaryRunes.length

// After:
return pool.runes.length + (pool.temporaryRunes?.length || 0)
```

**3. `getTemporaryRuneCount()` - Line 344:**
```typescript
// Before:
return pool.temporaryRunes.length

// After:
return pool.temporaryRunes?.length || 0
```

**Note:** `consumeRunesForCard()` and `consumeRunes()` already had defensive checks (lines 237, 270), so no changes needed.

---

## Why This Happened

**Type Definition:**
```typescript
export interface RunePool {
  runes: RuneColor[]
  temporaryRunes: RuneColor[] // Should always be an array
}
```

**Issue:** TypeScript interface defines `temporaryRunes` as required, but at runtime some `RunePool` objects might not have it initialized.

**Possible Sources:**
1. Old game state from localStorage (before `temporaryRunes` existed)
2. Partial object creation during state updates
3. Missing initialization in some code path

---

## Testing

✅ **All 31 rune system tests passed**

```bash
npm test -- runeSystem.test.ts
✓ src/game/runeSystem.test.ts (31 tests) 5ms
```

---

## Prevention

**Defensive Programming Applied:**
- All functions that access `temporaryRunes` now use optional chaining (`?.`) or default values (`|| []`)
- This prevents crashes even if the property is undefined

**Alternative Fix (Not Chosen):**
- Could make `temporaryRunes` optional in the type definition: `temporaryRunes?: RuneColor[]`
- But keeping it required in types + defensive runtime checks is better (catches bugs at development time)

---

## Related Code

**All places where `RunePool` is created:** (All properly initialize `temporaryRunes`)
- `src/game/runeSystem.ts:18` - `createEmptyRunePool()`
- `src/game/runeSystem.ts:42` - `createRunePool()`
- `src/game/sampleData.ts:1736-1737` - Game initialization
- `src/game/sampleData.ts:1969-1970` - Game initialization

**All functions accessing `temporaryRunes`:**
- ✅ `getAllAvailableRunes()` - Fixed
- ✅ `addTemporaryRunes()` - Already had safety check
- ✅ `clearTemporaryRunes()` - Safe (creates new object)
- ✅ `consumeRunesForCard()` - Already had safety check
- ✅ `consumeRunes()` - Already had safety check
- ✅ `getAvailableRuneCount()` - Fixed
- ✅ `getTemporaryRuneCount()` - Fixed

---

## Impact

**Before Fix:** Game crashed when trying to cast cards with rune requirements

**After Fix:** Game handles undefined `temporaryRunes` gracefully

**User Experience:** No more crashes when casting Holy Sentinel, Berserker, or any rune-consuming cards

---

## Lessons Learned

1. **Defensive programming matters** - Even with TypeScript, runtime data can be incomplete
2. **Spread operator pitfalls** - `...(arr || [])` is safer than `...arr` for potentially undefined arrays
3. **Optional chaining** - Use `?.` for array/object properties that might be missing
4. **Test coverage** - Having 31 rune system tests helped verify the fix didn't break anything

---

## Related Issues

This fix prevents similar issues with other array properties in `RunePool`:
- `runes` array is always initialized (safer)
- `temporaryRunes` now has defensive checks everywhere

If we add more optional properties to game state objects, remember to:
1. Use optional chaining (`?.`)
2. Provide default values (`|| []`, `|| 0`)
3. Test with incomplete/old state data


