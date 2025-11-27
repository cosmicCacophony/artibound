# How to Find Card Data Files on GitHub (Manual Navigation)

## Method 1: Navigate Through Directories (Web UI)

1. **Start at the repository root:**
   ```
   https://github.com/SteamDatabase/GameTracking-Artifact-Beta
   ```

2. **Click on the `game` folder** in the file list

3. **Click on the `dcg` folder** (Digital Card Game)

4. **Click on the `resource` folder** - This is where all the card data files are!

5. **You'll see files like:**
   - `card_set_01_english.txt` (231 KB) - Main card data
   - `card_set_00_english.txt` (10.58 KB)
   - `dcg_common_english.txt` (17.32 KB)
   - And many other language files

## Method 2: Use GitHub's Search Feature

1. **Go to the repository:**
   ```
   https://github.com/SteamDatabase/GameTracking-Artifact-Beta
   ```

2. **Click the search box** (or press `/` to focus it)

3. **Type:** `card_set_01_english.txt`

4. **GitHub will show you the file path:**
   ```
   game/dcg/resource/card_set_01_english.txt
   ```

5. **Click on it** to view the file

## Method 3: Use the "Go to file" Button

1. **In any GitHub repository page**, look for the **"Go to file"** button (or press `t`)

2. **Type:** `card_set_01_english.txt`

3. **GitHub will autocomplete and show you the file**

4. **Click to open it**

## Method 4: Direct URL Navigation

If you know the structure, you can navigate directly:

```
https://github.com/SteamDatabase/GameTracking-Artifact-Beta/tree/master/game/dcg/resource
```

## Why You Might Have Missed It

- The `cfg` directory (where you were looking) only has 1 file
- The `resource` directory has ~50+ files, but they're all visible in the web UI
- You just need to navigate one level deeper: `game/dcg/resource/` instead of `game/dcg/cfg/`

## Viewing Raw Files

To see the raw content (for copying/downloading):

1. **Click on any `.txt` file** (e.g., `card_set_01_english.txt`)

2. **Click the "Raw" button** (top right of the file view)

3. **Or use the direct raw URL:**
   ```
   https://raw.githubusercontent.com/SteamDatabase/GameTracking-Artifact-Beta/master/game/dcg/resource/card_set_01_english.txt
   ```

## Downloading Files

### Option 1: Raw URL + Browser
- Click "Raw" button on any file
- Right-click → "Save As" (or Cmd+S / Ctrl+S)

### Option 2: Command Line (curl/wget)
```bash
curl -O https://raw.githubusercontent.com/SteamDatabase/GameTracking-Artifact-Beta/master/game/dcg/resource/card_set_01_english.txt
```

### Option 3: Clone the Repository
```bash
git clone https://github.com/SteamDatabase/GameTracking-Artifact-Beta.git
cd GameTracking-Artifact-Beta/game/dcg/resource
```

## Finding Other Card-Related Files

### Card Effects:
```
game/dcg/pak01_dir/scripts/dota_card_game/card_effects.txt
```

### Card Sets:
```
game/dcg/pak01_dir/scripts/card_sets.txt
```

### Talker Scripts (Card Voice Lines):
```
game/dcg/pak01_dir/scripts/talker/set_1_card_response_rules/
```

## Tips for Manual Exploration

1. **Use the file tree sidebar** - It shows the full directory structure
2. **Look at file sizes** - Large files (200+ KB) are likely data files
3. **Check file extensions** - `.txt` files are often readable data
4. **Use GitHub search** - Search for keywords like "card", "ability", "hero"
5. **Check commit history** - See what files were changed recently

