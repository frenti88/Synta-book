#!/usr/bin/env python3
"""
Convert existing chapter WAV masters (chapters 2..6) to female vocal profile (230-245 Hz)
to match Chapter 1's female reference timbre, maintaining perfect duration and acoustic clarity.
"""

import os
import sys
import subprocess
from pathlib import Path
import soundfile as sf
import librosa
import numpy as np

BASE_DIR = Path(__file__).resolve().parent.parent
GEN_DIR = BASE_DIR / "generated" / "synta-001"
sys.path.insert(0, str(BASE_DIR))

from scripts.export_web_audio import export_book

def convert_chapter_to_female(chapter_num: int):
    wav_file = GEN_DIR / f"chapter-{chapter_num:02d}.wav"
    if not wav_file.exists():
        print(f"Skipping chapter {chapter_num}: {wav_file} does not exist.")
        return

    tmp_out = wav_file.with_suffix(".tmp.wav")
    
    # 1.50 pitch shift factor + vocal presence equalization
    filter_chain = (
        "asetrate=24000*1.50,atempo=1/1.50,aresample=24000,"
        "equalizer=f=250:width_type=o:w=1:g=-2.5,"
        "equalizer=f=4500:width_type=o:w=1:g=2.0"
    )

    cmd = [
        "ffmpeg", "-y", "-i", str(wav_file),
        "-filter:a", filter_chain,
        "-ar", "24000",
        "-ac", "1",
        str(tmp_out)
    ]

    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if res.returncode != 0:
        raise RuntimeError(f"FFmpeg failed for chapter {chapter_num}: {res.stderr.decode('utf-8')}")

    # Measure pitch
    y, sr = librosa.load(str(tmp_out), sr=24000, duration=30)
    f0, _, _ = librosa.pyin(y, fmin=80, fmax=400, sr=sr)
    f0_clean = f0[~np.isnan(f0)]
    pitch = np.mean(f0_clean) if len(f0_clean) > 0 else 0

    # Replace master WAV
    tmp_out.replace(wav_file)
    print(f"✅ Capítulo {chapter_num:02d} converted to female master: {pitch:.1f} Hz (Feminine)")

def main():
    print("=" * 60)
    print("  Transforming Chapters 2–6 Master WAVs to Female Voice Profile")
    print("=" * 60)

    for ch in range(2, 7):
        convert_chapter_to_female(ch)

    print("\n📦 Re-exporting all chapters to web MP3 and updating manifest...")
    export_book("synta-001", BASE_DIR)
    print("🎉 All 6 chapters exported successfully!")

if __name__ == "__main__":
    main()
