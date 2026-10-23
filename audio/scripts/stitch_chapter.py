#!/usr/bin/env python3
"""
SYNTA / NOMA Audiobook Pipeline — Chapter Stitcher
Combines individual chunk WAVs into a master continuous chapter WAV,
inserting nuanced editorial pauses (paragraphs, dialogues, scene ends)
and preventing clipping.
"""

import os
import json
import random
import numpy as np
import soundfile as sf
from pathlib import Path

def generate_silence(duration_ms: float, sample_rate: int = 24000) -> np.ndarray:
    """Generates an array of absolute silence of given duration in milliseconds."""
    num_samples = int((duration_ms / 1000.0) * sample_rate)
    return np.zeros(num_samples, dtype=np.float32)

def stitch_chapter(book_id: str, chapter_num: int, base_dir: Path = None) -> Path:
    if base_dir is None:
        base_dir = Path(__file__).resolve().parent.parent

    gen_dir = base_dir / "generated" / book_id
    chunks_meta_file = gen_dir / "prepared_chunks.json"
    if not chunks_meta_file.exists():
        raise FileNotFoundError(f"Missing prepared_chunks.json at {chunks_meta_file}")

    with open(chunks_meta_file, "r", encoding="utf-8") as f:
        chapters = json.load(f)

    chapter_data = next((c for c in chapters if c["number"] == chapter_num), None)
    if not chapter_data:
        raise ValueError(f"Chapter {chapter_num} not found in manuscript")

    ch_dir = gen_dir / f"chapter-{chapter_num:02d}"
    if not ch_dir.exists():
        raise FileNotFoundError(f"Chapter directory {ch_dir} does not exist.")

    audio_segments = []
    sample_rate = 24000
    total_samples = 0

    chunks = chapter_data["chunks"]
    print(f"🧵 Stitching Capítulo {chapter_num} ({len(chunks)} chunks)...")

    # Initial breath before chapter begins (~400 ms)
    audio_segments.append(generate_silence(400, sample_rate))

    for idx, chunk in enumerate(chunks):
        chunk_file = ch_dir / f"chunk-{idx+1:03d}.wav"
        if not chunk_file.exists():
            print(f"  ⚠️ Warning: chunk file missing {chunk_file.name}, inserting silence placeholder.")
            data = generate_silence(2000, sample_rate)
            sr = sample_rate
        else:
            data, sr = sf.read(str(chunk_file))
            if data.ndim > 1:
                data = data[:, 0] # mono
            data = data.astype(np.float32)
            sample_rate = sr

        audio_segments.append(data)

        # Determine pause duration after this chunk
        if idx == len(chunks) - 1:
            # End of chapter: 2000-2400 ms
            pause_ms = random.uniform(2000, 2400)
        elif chunk.get("is_para_end", False):
            # End of paragraph: 480-620 ms
            pause_ms = random.uniform(480, 620)
        else:
            # Intra-paragraph sentence break: 180-260 ms
            pause_ms = random.uniform(180, 260)

        audio_segments.append(generate_silence(pause_ms, sample_rate))

    # Concatenate all segments
    master_audio = np.concatenate(audio_segments)

    # Normalize to prevent digital clipping (-1.0 dB peak)
    max_amp = np.max(np.abs(master_audio))
    if max_amp > 0:
        target_peak = 0.891  # -1.0 dB
        if max_amp > target_peak:
            master_audio = master_audio * (target_peak / max_amp)

    out_master_wav = gen_dir / f"chapter-{chapter_num:02d}.wav"
    sf.write(str(out_master_wav), master_audio, sample_rate)

    duration_sec = len(master_audio) / sample_rate
    mins = int(duration_sec // 60)
    secs = int(duration_sec % 60)
    print(f"✅ Stitched master: {out_master_wav.name} [{mins:02d}:{secs:02d}] ({duration_sec:.2f}s)")
    return out_master_wav

if __name__ == "__main__":
    import sys
    ch_num = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    stitch_chapter("synta-001", ch_num)
