#!/usr/bin/env python3
"""
Aggressive cleanup of all orphaned syntax
"""

import re

def aggressive_cleanup(content):
    """Remove all orphaned braces and comments"""
    lines = content.split('\n')
    result = []
    
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        
        # Pattern 1: Standalone opening brace followed by comment or another brace
        if stripped == '{':
            # Look ahead
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                # If next is a comment starting with // OR another { OR doesn't start with a property
                if (next_line.startswith('//') or 
                    next_line == '{' or
                    (next_line and not next_line.startswith('id:') and not next_line.startswith('name:') and
                     not next_line.startswith('description:') and not next_line.startswith('cardType:'))):
                    # Could be orphan
                    # But make sure it's not a valid array start
                    if i > 0:
                        prev_line = lines[i - 1].strip()
                        # If previous line ends with [ or = [ then this is valid
                        if prev_line.endswith('[') or prev_line.endswith('= ['):
                            result.append(line)
                            i += 1
                            continue
                    
                    # Check if next next line has id: (valid object)
                    if i + 2 < len(lines):
                        next_next = lines[i + 2].strip()
                        if next_next.startswith('id:'):
                            # Valid - the comment is before a real object
                            result.append(line)
                            i += 1
                            continue
                    
                    # Orphan - skip it
                    print(f"Removing orphaned brace at line {i+1}")
                    i += 1
                    continue
        
        # Pattern 2: Comments mentioning signature that aren't followed by valid code
        if '//  ' in stripped and 'signature' in stripped.lower():
            # Check what follows
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                if next_line == '{':
                    # Check if there's a valid id: after that
                    if i + 2 < len(lines):
                        next_next = lines[i + 2].strip()
                        if not next_next.startswith('id:'):
                            print(f"Removing orphaned signature comment at line {i+1}: {stripped[:60]}")
                            i += 1
                            continue
        
        # Pattern 3: Just a comment line saying "// More XXX" or similar followed by orphan brace
        if stripped.startswith('//') and i + 1 < len(lines):
            next_line = lines[i + 1].strip()
            if next_line == '{':
                # Check if this is really orphaned
                if i + 2 < len(lines):
                    next_next = lines[i + 2].strip()
                    if not next_next.startswith('id:') and next_next != '}':
                        print(f"Removing orphaned comment+brace at line {i+1}: {stripped[:60]}")
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
    
    new_content = aggressive_cleanup(content)
    
    print(f"\nNew line count: {len(new_content.splitlines())}")
    print(f"Removed: {len(content.splitlines()) - len(new_content.splitlines())} lines")
    
    print(f"\nWriting to {input_file}...")
    with open(input_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✓ Done!")

if __name__ == '__main__':
    main()


