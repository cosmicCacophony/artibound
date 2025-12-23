/**
 * Export Verification Script
 * 
 * Checks that all imported exports actually exist in their source files.
 * Run with: npx tsx scripts/check-exports.ts
 * 
 * This helps catch missing exports before runtime errors occur.
 */

import * as fs from 'fs'
import * as path from 'path'

interface ImportInfo {
  file: string
  importPath: string
  exports: string[]
}

// Map of import paths to their actual file paths
const fileMap: Record<string, string> = {
  '../game/types': 'src/game/types.ts',
  '../game/sampleData': 'src/game/sampleData.ts',
  '../game/cardData': 'src/game/cardData.ts',
  '../game/comprehensiveCardData': 'src/game/comprehensiveCardData.ts',
  '../game/draftData': 'src/game/draftData.ts',
  '../game/draftSystem': 'src/game/draftSystem.ts',
  '../game/combatSystem': 'src/game/combatSystem.ts',
  './types': 'src/game/types.ts',
  './sampleData': 'src/game/sampleData.ts',
  './cardData': 'src/game/cardData.ts',
  './comprehensiveCardData': 'src/game/comprehensiveCardData.ts',
  './draftData': 'src/game/draftData.ts',
  './draftSystem': 'src/game/draftSystem.ts',
  './combatSystem': 'src/game/combatSystem.ts',
}

// Extract imports from a file
function extractImports(filePath: string): ImportInfo[] {
  const content = fs.readFileSync(filePath, 'utf8')
  const imports: ImportInfo[] = []
  
  // Match: import { ... } from 'path' or import ... from 'path'
  const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+))*)\s+from\s+['"]([^'"]+)['"]/g
  
  let match
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1]
    const importStatement = match[0]
    
    // Only check game/ imports
    if (!importPath.includes('game/')) continue
    
    // Extract export names from import statement
    const exportNames: string[] = []
    
    // Match named imports: { export1, export2, ... }
    const namedImportRegex = /\{([^}]+)\}/g
    const namedMatch = namedImportRegex.exec(importStatement)
    if (namedMatch) {
      const exports = namedMatch[1]
      // Split by comma and extract names (handle as aliases)
      exports.split(',').forEach(exp => {
        const trimmed = exp.trim()
        // Handle "name as alias" -> extract "name"
        const name = trimmed.split(/\s+as\s+/)[0].trim()
        if (name) exportNames.push(name)
      })
    } else if (importStatement.includes('* as')) {
      // Default import with namespace - skip for now
      continue
    } else {
      // Default import - extract the name
      const defaultMatch = importStatement.match(/import\s+(\w+)\s+from/)
      if (defaultMatch) {
        exportNames.push(defaultMatch[1])
      }
    }
    
    if (exportNames.length > 0) {
      imports.push({
        file: filePath,
        importPath,
        exports: exportNames,
      })
    }
  }
  
  return imports
}

// Check if an export exists in a file
function exportExists(filePath: string, exportName: string): boolean {
  if (!fs.existsSync(filePath)) return false
  
  const content = fs.readFileSync(filePath, 'utf8')
  
  // Check for various export patterns
  const patterns = [
    // export const/function/type/interface/class ExportName
    new RegExp(`export\\s+(const|function|type|interface|class|enum)\\s+${exportName}\\b`),
    // export { ExportName, ... }
    new RegExp(`export\\s*\\{[^}]*\\b${exportName}\\b[^}]*\\}`),
    // export default ExportName
    new RegExp(`export\\s+default\\s+${exportName}\\b`),
  ]
  
  return patterns.some(pattern => pattern.test(content))
}

// Main function
function main() {
  const srcDir = path.join(process.cwd(), 'src')
  const allFiles: string[] = []
  
  // Find all .ts and .tsx files
  function findFiles(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory() && entry.name !== 'node_modules') {
        findFiles(fullPath)
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        allFiles.push(fullPath)
      }
    }
  }
  
  findFiles(srcDir)
  
  // Collect all imports
  const allImports: ImportInfo[] = []
  for (const file of allFiles) {
    allImports.push(...extractImports(file))
  }
  
  // Group by import path
  const importsByPath = new Map<string, Set<string>>()
  for (const imp of allImports) {
    const key = imp.importPath
    if (!importsByPath.has(key)) {
      importsByPath.set(key, new Set())
    }
    imp.exports.forEach(exp => importsByPath.get(key)!.add(exp))
  }
  
  // Check each import path
  const missing: Array<{ importPath: string; exportName: string; file: string }> = []
  
  for (const [importPath, exports] of importsByPath.entries()) {
    const actualFile = fileMap[importPath]
    if (!actualFile) {
      console.log(`⚠️  Unknown import path: ${importPath}`)
      continue
    }
    
    const filePath = path.join(process.cwd(), actualFile)
    
    for (const exportName of exports) {
      if (!exportExists(filePath, exportName)) {
        // Find which file imports it
        const importingFile = allImports.find(imp => 
          imp.importPath === importPath && imp.exports.includes(exportName)
        )?.file || 'unknown'
        
        missing.push({
          importPath,
          exportName,
          file: path.relative(process.cwd(), importingFile),
        })
      }
    }
  }
  
  // Report results
  if (missing.length > 0) {
    console.log('\n❌ Missing exports found:\n')
    const grouped = new Map<string, Array<{ exportName: string; file: string }>>()
    
    for (const { importPath, exportName, file } of missing) {
      if (!grouped.has(importPath)) {
        grouped.set(importPath, [])
      }
      grouped.get(importPath)!.push({ exportName, file })
    }
    
    for (const [importPath, items] of grouped.entries()) {
      const actualFile = fileMap[importPath]
      console.log(`  ${importPath} (${actualFile}):`)
      for (const { exportName, file } of items) {
        console.log(`    - ${exportName} (imported by ${file})`)
      }
      console.log()
    }
    
    process.exit(1)
  } else {
    console.log('✅ All exports verified!')
    process.exit(0)
  }
}

main()











