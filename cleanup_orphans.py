#!/usr/bin/env python3
"""
Cleanup orphaned braces and comments after signature card removal
"""

import re

def cleanup_orphans(content):
    """Remove orphaned opening braces and their comments"""
    lines = content.split('\n')
    result = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Check for orphaned opening brace (just a { with maybe whitespace)
        if re.match(r'^\s*\{\s*$', line):
            # Check if next line is also a comment or opening brace (orphan pattern)
            if i + 1 < len(lines):
                next_line = lines[i + 1]
                # If next line is a comment or another brace or valid code, check context
                if (re.match(r'^\s*//.*$', next_line) or 
                    re.match(r'^\s*\{\s*$', next_line) or
                    re.match(r'^\s*id:', next_line)):
                    # This might be an orphan - look back to see if there's a comment right before
                    if i > 0 and re.match(r'^\s*//.*signature.*$', lines[i-1]):
                        # Remove the comment and the brace
                        print(f"Removing orphaned brace at line {i+1} (after signature comment)")
                        result.pop()  # Remove the comment we just added
                        i += 1
                        continue
                    elif re.match(r'^\s*\{\s*$', next_line):
                        # Two braces in a row - likely orphan
                        print(f"Removing orphaned brace at line {i+1} (duplicate brace)")
                        i += 1
                        continue
        
        # Check for standalone signature comments followed by braces
        if re.match(r'^\s*//.*signature.*$', line, re.IGNORECASE):
            if i + 1 < len(lines) and re.match(r'^\s*\{\s*$', lines[i + 1]):
                if i + 2 < len(lines) and (re.match(r'^\s*//.*$', lines[i + 2]) or 
                                           re.match(r'^\s*\{\s*$', lines[i + 2]) or
                                           not re.match(r'^\s*id:', lines[i + 2])):
                    # Orphaned signature comment + brace
                    print(f"Removing orphaned signature comment at line {i+1}: {line.strip()}")
                    i += 2  # Skip comment and brace
                    continue
        
        result.append(line)
        i += 1
    
    return '\n'.join(result)

def main():
    input_file = 'src/game/comprehensiveCardData.ts'
    
    print(f"Reading {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"Original line count: {len(content.splitlines())}\n")
    
    new_content = cleanup_orphans(content)
    
    print(f"\nNew line count: {len(new_content.splitlines())}")
    print(f"Removed: {len(content.splitlines()) - len(new_content.splitlines())} lines")
    
    print(f"\nWriting to {input_file}...")
    with open(input_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✓ Done!")

if __name__ == '__main__':
    main()

