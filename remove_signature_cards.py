#!/usr/bin/env python3
"""
Script to remove signature cards from comprehensiveCardData.ts
Removes:
1. All card objects with id containing '-sig-'
2. All signatureCardId properties from hero objects
"""

import re
import sys

def remove_signature_cards(content):
    """Remove signature cards and signatureCardId properties."""
    
    # Split by lines for processing
    lines = content.split('\n')
    result_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Check if this is a signatureCardId line - remove it
        if re.search(r"signatureCardId:\s*['\"].*-sig-.*['\"],?", line):
            print(f"Removing signatureCardId at line {i+1}: {line.strip()}")
            i += 1
            continue
        
        # Check if we're starting a card object with -sig- in the id
        if re.search(r"id:\s*['\"].*-sig-.*['\"],?", line):
            print(f"Found signature card at line {i+1}: {line.strip()}")
            
            # Find the opening brace for this object (might be on previous line)
            start_idx = i
            brace_count = 0
            
            # Look backwards to find the opening brace
            for j in range(i-1, max(0, i-10), -1):
                if '{' in lines[j]:
                    start_idx = j
                    break
            
            # Now find the closing brace
            end_idx = i
            for j in range(start_idx, len(lines)):
                brace_count += lines[j].count('{') - lines[j].count('}')
                if brace_count == 0 and '}' in lines[j]:
                    end_idx = j
                    break
            
            # Check if there's a comma after the closing brace
            if end_idx + 1 < len(lines) and lines[end_idx].rstrip().endswith(','):
                # Brace has comma, good
                pass
            elif end_idx < len(lines) and '},' in lines[end_idx]:
                # Comma is on same line
                pass
            
            print(f"  Removing card from line {start_idx+1} to {end_idx+1}")
            
            # Add all lines before the object
            if start_idx > 0:
                for k in range(len(result_lines), start_idx):
                    if k < len(result_lines):
                        continue
                    result_lines.append(lines[k])
            
            # Skip to after the object
            i = end_idx + 1
            continue
        
        result_lines.append(line)
        i += 1
    
    return '\n'.join(result_lines)

def remove_signature_cards_v2(content):
    """
    More robust approach: use regex to match entire card objects
    """
    # Pattern to match a complete card object with -sig- in id
    # This matches:
    # {
    #   id: '...-sig-...',
    #   ... any content ...
    # },
    
    # First, remove signatureCardId properties
    content = re.sub(
        r'\s*signatureCardId:\s*[\'"][^\'"]*-sig-[^\'"]*[\'"],?\n',
        '',
        content
    )
    
    # Count removals
    sig_cards = re.findall(r"id:\s*['\"]([^'\"]*-sig-[^'\"]*)['\"]", content)
    print(f"Found {len(sig_cards)} signature cards to remove:")
    for card_id in sig_cards[:10]:  # Show first 10
        print(f"  - {card_id}")
    if len(sig_cards) > 10:
        print(f"  ... and {len(sig_cards) - 10} more")
    
    # Remove signature card objects
    # Match objects that have id with -sig-
    # This pattern matches: { ... id: 'xxx-sig-xxx' ... } with proper nesting
    def remove_sig_object(match):
        obj_content = match.group(0)
        # Check if this object has a -sig- id
        if re.search(r"id:\s*['\"][^'\"]*-sig-[^'\"]*['\"]", obj_content):
            return ''
        return obj_content
    
    # Match card objects more carefully
    # Look for pattern: { followed by properties, ending with },
    pattern = r'\{\s*\n\s*id:\s*[\'"]([^\'"]*-sig-[^\'"]*)[\'"][^}]*?\},?'
    
    # More robust: match multi-line objects
    # Start with { at start of line (with whitespace), find matching }
    lines = content.split('\n')
    result = []
    skip_until = -1
    
    for i, line in enumerate(lines):
        if i < skip_until:
            continue
            
        # Check if this line has id: '...-sig-...'
        id_match = re.search(r"id:\s*['\"]([^'\"]*-sig-[^'\"]*)['\"]", line)
        if id_match:
            sig_id = id_match.group(1)
            print(f"Removing signature card '{sig_id}' starting at line {i+1}")
            
            # Find the opening brace (search backwards)
            brace_start = i
            for j in range(i-1, max(0, i-5), -1):
                if '{' in lines[j] and not lines[j].strip().startswith('//'):
                    brace_start = j
                    break
            
            # Find matching closing brace
            brace_count = 0
            brace_end = i
            for j in range(brace_start, len(lines)):
                brace_count += lines[j].count('{') - lines[j].count('}')
                if brace_count == 0 and '}' in lines[j]:
                    brace_end = j
                    break
            
            # Skip these lines
            skip_until = brace_end + 1
            continue
        
        result.append(line)
    
    return '\n'.join(result)

def main():
    input_file = 'src/game/comprehensiveCardData.ts'
    
    print(f"Reading {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"Original file size: {len(content)} bytes")
    print(f"Original line count: {len(content.splitlines())}")
    
    print("\n" + "="*60)
    print("Removing signature cards...")
    print("="*60 + "\n")
    
    new_content = remove_signature_cards_v2(content)
    
    print(f"\nNew file size: {len(new_content)} bytes")
    print(f"New line count: {len(new_content.splitlines())}")
    print(f"Removed: {len(content) - len(new_content)} bytes")
    
    # Write output
    output_file = input_file
    print(f"\nWriting to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✓ Done!")
    return 0

if __name__ == '__main__':
    sys.exit(main())

