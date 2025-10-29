#!/usr/bin/env python3
"""
Batch OCR cleaning using Claude API
Sends file in batches for intelligent OCR correction
"""

import os
import sys
import time
from anthropic import Anthropic

# Default Configuration
DEFAULT_INPUT_FILE = "/Users/v/solomonresearch/spezi01/Laws/raw/raw_gaiusinstitutiile.txt"
DEFAULT_OUTPUT_FILE = "/Users/v/solomonresearch/spezi01/Laws/gaiusinstitutiile.txt"
BATCH_SIZE = 2000  # lines per batch
API_KEY = os.environ.get("ANTHROPIC_API_KEY")

# Allow override via command line arguments
INPUT_FILE = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('-') else DEFAULT_INPUT_FILE
OUTPUT_FILE = sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].startswith('-') else DEFAULT_OUTPUT_FILE

# OCR cleaning prompt
CLEANING_PROMPT = """You are an expert OCR text cleaner for Romanian language historical legal texts.

Clean this OCR text from Gaius' Institutiile (Roman law text in Romanian translation). Fix:

1. **Romanian diacritics errors**:
   - $ → ș (dollar sign misread as ș)
   - à → ă
   - ì → î
   - (; → ț
   - fji, sji, iji, jji → și
   - (!i, (ia → ți, ția

2. **Common OCR character mistakes**:
   - l (lowercase L) vs I (uppercase i) vs 1 (digit)
   - 0 (zero) vs O (letter O)
   - Remove stray punctuation artifacts
   - Fix spacing issues

3. **Romanian word corrections**:
   - dupà → după
   - càtre → către
   - pìnà → până
   - fàrà → fără
   - existà → există
   - trebuìe → trebuie
   - Bucurestii → București
   - Bucurejti → București

4. **Formatting**:
   - Keep paragraph structure
   - Preserve section markers (§)
   - Keep page numbers if they're part of citations
   - Remove standalone page numbers on their own lines
   - Preserve indentation for structure
   - Keep all Latin legal terms unchanged (e.g., "in iure cessio", "ius gentium")

5. **DO NOT change**:
   - Latin phrases and legal terms
   - Citation formats (D, Art., §)
   - Proper names (Gaius, Pomponius, etc.)
   - Roman numerals in titles

Return ONLY the cleaned text, no explanations or comments."""

def read_file_in_batches(filepath, batch_size):
    """Generator that yields batches of lines from file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        batch = []
        for line in f:
            batch.append(line)
            if len(batch) >= batch_size:
                yield batch
                batch = []
        if batch:  # Don't forget the last batch
            yield batch

def count_total_lines(filepath):
    """Count total lines in file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return sum(1 for _ in f)

def clean_batch_with_claude(client, text_batch, batch_num, total_batches):
    """Send batch to Claude API for cleaning"""
    batch_text = ''.join(text_batch)

    print(f"\n{'='*60}")
    print(f"📤 Batch {batch_num}/{total_batches}")
    print(f"   Lines: {len(text_batch)}")
    print(f"   Characters: {len(batch_text):,}")
    print(f"   Sending to Claude API...")

    try:
        start_time = time.time()

        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=16000,
            temperature=0,
            messages=[
                {
                    "role": "user",
                    "content": f"{CLEANING_PROMPT}\n\n---TEXT TO CLEAN---\n\n{batch_text}"
                }
            ]
        )

        elapsed = time.time() - start_time
        cleaned_text = message.content[0].text

        print(f"   ✓ Cleaned in {elapsed:.1f}s")
        print(f"   Input tokens: {message.usage.input_tokens:,}")
        print(f"   Output tokens: {message.usage.output_tokens:,}")

        return cleaned_text

    except Exception as e:
        print(f"   ✗ ERROR: {str(e)}")
        print(f"   Returning original text for this batch")
        return batch_text

def main():
    """Main processing function"""

    # Check API key
    if not API_KEY:
        print("❌ ERROR: ANTHROPIC_API_KEY environment variable not set")
        print("   Set it with: export ANTHROPIC_API_KEY='your-key-here'")
        sys.exit(1)

    # Initialize client
    client = Anthropic(api_key=API_KEY)

    # Count total lines
    print(f"📖 Analyzing file: {INPUT_FILE}")
    total_lines = count_total_lines(INPUT_FILE)
    total_batches = (total_lines + BATCH_SIZE - 1) // BATCH_SIZE

    print(f"   Total lines: {total_lines:,}")
    print(f"   Batch size: {BATCH_SIZE:,} lines")
    print(f"   Total batches: {total_batches}")
    print(f"   Output file: {OUTPUT_FILE}")

    # Check for --auto flag to skip confirmation
    auto_start = '--auto' in sys.argv or '-y' in sys.argv

    if not auto_start:
        # Confirm start
        print(f"\n{'='*60}")
        response = input("⚡ Start processing? (y/n): ").strip().lower()
        if response != 'y':
            print("Cancelled.")
            sys.exit(0)
    else:
        print(f"\n{'='*60}")
        print("⚡ Auto-start mode enabled")

    # Process batches
    print(f"\n🚀 Starting OCR cleaning with Claude API...")

    # Clear output file
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("")

    lines_processed = 0
    batch_num = 0

    for batch in read_file_in_batches(INPUT_FILE, BATCH_SIZE):
        batch_num += 1
        lines_processed += len(batch)
        progress_pct = (lines_processed / total_lines) * 100

        # Clean batch with Claude
        cleaned_text = clean_batch_with_claude(client, batch, batch_num, total_batches)

        # Append to output file
        with open(OUTPUT_FILE, 'a', encoding='utf-8') as f:
            f.write(cleaned_text)
            if not cleaned_text.endswith('\n'):
                f.write('\n')

        # Show progress
        print(f"   💾 Saved to output file")
        print(f"   📊 Progress: {lines_processed:,}/{total_lines:,} lines ({progress_pct:.1f}%)")

        # Rate limiting pause (be nice to API)
        if batch_num < total_batches:
            print(f"   ⏸️  Pausing 2s before next batch...")
            time.sleep(2)

    # Final summary
    print(f"\n{'='*60}")
    print(f"✅ COMPLETE!")
    print(f"   Processed: {lines_processed:,} lines in {total_batches} batches")
    print(f"   Output: {OUTPUT_FILE}")

    # Show file size
    output_size = os.path.getsize(OUTPUT_FILE)
    input_size = os.path.getsize(INPUT_FILE)
    print(f"   Input size: {input_size:,} bytes")
    print(f"   Output size: {output_size:,} bytes")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    main()
