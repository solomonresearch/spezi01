#!/usr/bin/env python3
"""
Clean OCR errors from Gaius Institutiile raw text file.
Fixes Romanian diacritics and common OCR mistakes.
"""

import re
import sys

def clean_ocr_text(text):
    """Apply systematic OCR error corrections"""

    # Common OCR character replacements for Romanian diacritics
    replacements = {
        # Romanian specific characters
        '$': 'ș',  # $ is commonly misread și
        'à': 'ă',
        'ì': 'î',
        'è': 'e',

        # Common OCR mistakes with Romanian letters
        '(;': 'ț',
        '(ia': 'ția',
        'fji': 'și',
        'sji': 'și',
        'iji': 'și',
        'jji': 'și',
        'cìnd': 'când',
        'Bucurestii': 'București',
        'Bucurejti': 'București',

        # Spacing issues
        ' si ': ' și ',
        ' ti ': ' ți ',

        # Common word corrections
        'dupà': 'după',
        'càtre': 'către',
        'càci': 'căci',
        'càror': 'căror',
        'càrui': 'cărui',
        'fàrà': 'fără',
        'pìnà': 'până',
        'pinà': 'până',
        'trebuìe': 'trebuie',
        'existà': 'există',
        'Romei': 'Romei',

        # Fix parentheses with semicolons
        '(;i': 'ți',
        '(ie': 'țe',
        '(ii': 'ții',
    }

    # Apply replacements
    for old, new in replacements.items():
        text = text.replace(old, new)

    # Fix specific patterns with regex
    # Fix 'j' that should be 'ș' in common contexts
    text = re.sub(r'\bsj\b', 'și', text)
    text = re.sub(r'\bcj\b', 'că', text)

    # Fix standalone page numbers (single digits or numbers on their own line)
    # Keep only substantial content
    text = re.sub(r'^\s*\d+\s*$', '', text, flags=re.MULTILINE)

    # Fix excessive whitespace
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' {2,}', ' ', text)

    return text

def process_file(input_path, output_path):
    """Read, clean, and write the file"""
    print(f"Reading from: {input_path}")

    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            content = f.read()

        print(f"Original size: {len(content)} characters, {len(content.splitlines())} lines")

        # Clean the content
        cleaned = clean_ocr_text(content)

        print(f"Cleaned size: {len(cleaned)} characters, {len(cleaned.splitlines())} lines")

        # Write output
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(cleaned)

        print(f"✓ Written to: {output_path}")
        return True

    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    input_file = "/Users/v/solomonresearch/spezi01/Laws/raw/raw_gaiusinstitutiile.txt"
    output_file = "/Users/v/solomonresearch/spezi01/Laws/gaiusinstitutiile.txt"

    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    if len(sys.argv) > 2:
        output_file = sys.argv[2]

    success = process_file(input_file, output_file)
    sys.exit(0 if success else 1)
