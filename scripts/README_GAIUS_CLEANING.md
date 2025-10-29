# Gaius Institutiile OCR Cleaning Script

## Overview
Batch processing script that uses Claude API to intelligently clean OCR errors from the Gaius Institutiile Romanian translation.

## Features
- **Batch processing**: 2,000 lines per batch (8 batches total)
- **Real-time progress**: Shows percentage, tokens used, time per batch
- **Incremental saving**: Appends each cleaned batch to output file
- **Error recovery**: Falls back to original text if API fails
- **Romanian-aware**: Fixes diacritics and language-specific OCR errors

## Prerequisites

1. **Python 3.7+** with anthropic library (✓ already installed)
2. **Anthropic API Key** (required)

## Setup

### Set your API key:
```bash
export ANTHROPIC_API_KEY='your-api-key-here'
```

Or add to your `~/.zshrc` or `~/.bashrc`:
```bash
echo 'export ANTHROPIC_API_KEY="your-api-key-here"' >> ~/.zshrc
source ~/.zshrc
```

## Usage

```bash
cd /Users/v/solomonresearch/spezi01
python3 scripts/batch_clean_gaius_ai.py
```

## What the script does:

1. **Analyzes file**: 16,458 lines → 8 batches
2. **Sends to Claude**: Each batch (~2000 lines) with OCR cleaning instructions
3. **Shows progress**:
   ```
   ============================================================
   📤 Batch 1/8
      Lines: 2000
      Characters: 154,621
      Sending to Claude API...
      ✓ Cleaned in 12.3s
      Input tokens: 45,234
      Output tokens: 43,891
      💾 Saved to output file
      📊 Progress: 2,000/16,458 lines (12.2%)
      ⏸️  Pausing 2s before next batch...
   ```
4. **Appends to output**: Each cleaned batch added to `/Laws/gaiusinstitutiile.txt`
5. **Final summary**: Total lines, file sizes, completion status

## Input/Output

- **Input**: `/Laws/raw/raw_gaiusinstitutiile.txt` (1.3MB, with OCR errors)
- **Output**: `/Laws/gaiusinstitutiile.txt` (cleaned, ready for web)

## Cost Estimate

- **Model**: Claude Sonnet 4 (2025-05-14)
- **Estimated tokens**: ~290K input + ~280K output
- **Approximate cost**: $2-4 USD total (8 batches)
- **Time**: ~2-3 minutes total processing

## What gets fixed:

### Romanian Diacritics
- `$` → `ș` (dollar sign misread)
- `à` → `ă`
- `ì` → `î`
- `(;` → `ț`
- `fji, sji` → `și`

### Common Words
- `dupà` → `după`
- `pìnà` → `până`
- `fàrà` → `fără`
- `Bucurestii` → `București`

### Formatting
- Removes standalone page numbers
- Fixes excessive whitespace
- Preserves Latin legal terms
- Keeps section markers (§)

## Safety Features

- **Rate limiting**: 2 second pause between batches
- **Error handling**: Falls back to original if API fails
- **Incremental saving**: Won't lose progress if interrupted
- **Zero temperature**: Consistent, deterministic corrections

## Monitoring

Watch progress in real-time:
- Batch number (1/8, 2/8, etc.)
- Lines processed
- Percentage complete
- Token usage per batch
- Time per batch

## After Completion

The cleaned file will be ready to:
1. Copy to `client/public/gaiusinstitutiile.txt`
2. Load in Dashboard like Codul Civil/Penal
3. Use as learning material in the app
