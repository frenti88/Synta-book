#!/usr/bin/env python3
"""
SYNTA / NOMA Audiobook Pipeline — Manuscript Preprocessor
Parses the editorial manuscript, strips Markdown formatting, and segments
prose into natural phonetic speech chunks (180-320 characters) respecting
dialogues, sentences, and punctuation.
"""

import os
import re
import json
from pathlib import Path

def clean_text_for_speech(text: str) -> str:
    """Removes markdown symbols, internal metadata, and characters that shouldn't be read aloud."""
    # Remove markdown headers (#, ##)
    text = re.sub(r'^#+\s*', '', text, flags=re.MULTILINE)
    # Remove bold / italic markers (* or _)
    text = re.sub(r'[*_]{1,3}([^*_]+)[*_]{1,3}', r'\1', text)
    # Replace em-dashes used for dialogue with standard clean punctuation
    text = text.replace('—', '— ').replace('  ', ' ')
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def chunk_paragraph(para: str, min_chars: int = 160, target_chars: int = 260, max_chars: int = 340) -> list[str]:
    """Splits a paragraph into cohesive audio chunks respecting sentence boundaries."""
    para = clean_text_for_speech(para)
    if not para:
        return []
    
    if len(para) <= max_chars:
        return [para]

    # Split by major sentence terminators (. ! ? ; : and em-dashes)
    sentences = re.split(r'(?<=[.!?])\s+|(?<=;)\s+|(?<=—\s)', para)
    chunks = []
    current_chunk = ""

    for s in sentences:
        s = s.strip()
        if not s:
            continue

        if not current_chunk:
            current_chunk = s
        elif len(current_chunk) + len(s) + 1 <= target_chars:
            current_chunk += " " + s
        elif len(current_chunk) < min_chars and len(current_chunk) + len(s) + 1 <= max_chars:
            current_chunk += " " + s
        else:
            chunks.append(current_chunk)
            current_chunk = s

    if current_chunk:
        chunks.append(current_chunk)

    return chunks

def extract_chapters_from_manuscript(md_path: Path) -> list[dict]:
    """Extracts chapters and paragraphs from the markdown manuscript."""
    content = md_path.read_text(encoding='utf-8')
    # Split by level 2 headings: ## I. El clavo de latón
    chapter_blocks = re.split(r'\n##\s+', content)
    
    chapters = []
    for block in chapter_blocks[1:]:  # skip preamble
        lines = [l.strip() for l in block.split('\n') if l.strip()]
        if not lines:
            continue
            
        header = lines[0] # e.g. "I. El clavo de latón" or "01. El clavo de latón"
        header_parts = header.split('.', 1)
        num_str = header_parts[0].strip()
        title = header_parts[1].strip() if len(header_parts) > 1 else header

        paragraphs = []
        for line in lines[1:]:
            if line.startswith('---') or line.startswith('#'):
                continue
            paragraphs.append(line)

        chapters.append({
            "number": len(chapters) + 1,
            "num_label": num_str,
            "title": title,
            "paragraphs": paragraphs
        })
        
    return chapters

def prepare_book(book_id: str = "synta-001", base_dir: Path = None):
    if base_dir is None:
        base_dir = Path(__file__).resolve().parent.parent

    md_path = base_dir / "manuscripts" / f"{book_id}.md"
    if not md_path.exists():
        # Fallback to docs/
        md_path = base_dir.parent / "docs" / f"{book_id}-todo-lo-que-falta.md"
        
    if not md_path.exists():
        raise FileNotFoundError(f"Manuscript not found at {md_path}")

    chapters = extract_chapters_from_manuscript(md_path)
    print(f"📖 Loaded manuscript: {len(chapters)} chapters found.")

    prepared_chapters = []
    for ch in chapters:
        ch_chunks = []
        for p_idx, para in enumerate(ch["paragraphs"]):
            p_chunks = chunk_paragraph(para)
            for c_idx, c_text in enumerate(p_chunks):
                ch_chunks.append({
                    "id": f"p{p_idx+1:03d}-c{c_idx+1:02d}",
                    "para_idx": p_idx + 1,
                    "text": c_text,
                    "is_para_end": c_idx == len(p_chunks) - 1
                })
        
        prepared_chapters.append({
            "number": ch["number"],
            "title": ch["title"],
            "total_chunks": len(ch_chunks),
            "chunks": ch_chunks
        })
        print(f"  • Capítulo {ch['number']}: '{ch['title']}' → {len(ch_chunks)} chunks.")

    out_dir = base_dir / "generated" / book_id
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / "prepared_chunks.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(prepared_chapters, f, ensure_ascii=False, indent=2)

    print(f"✅ Prepared chunks saved to {out_file}")
    return prepared_chapters

if __name__ == "__main__":
    prepare_book()
