#!/usr/bin/env python3
"""
SYNTA / NOMA Audiobook Pipeline — Web Audio Exporter
Encodes master chapter WAVs to high-fidelity 160 kbps web MP3s via FFmpeg,
measures exact durations, and outputs production manifest files for the Next.js player.
"""

import os
import sys
import json
import shutil
import subprocess
from pathlib import Path
import soundfile as sf

def find_ffmpeg() -> str:
    """Locates the ffmpeg executable."""
    for candidate in ["/opt/homebrew/bin/ffmpeg", "/usr/local/bin/ffmpeg", "ffmpeg"]:
        path = shutil.which(candidate)
        if path:
            return path
    raise RuntimeError("FFmpeg executable not found. Please install ffmpeg.")

def export_chapter_mp3(wav_path: Path, mp3_path: Path, bitrate: str = "160k") -> float:
    """Converts a WAV master to an optimized web MP3 using ffmpeg and returns duration in seconds."""
    ffmpeg = find_ffmpeg()
    mp3_path.parent.mkdir(parents=True, exist_ok=True)
    
    cmd = [
        ffmpeg,
        "-y",
        "-i", str(wav_path),
        "-codec:a", "libmp3lame",
        "-b:a", bitrate,
        "-ar", "24000",
        "-ac", "1",
        str(mp3_path)
    ]
    
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if res.returncode != 0:
        raise RuntimeError(f"FFmpeg conversion failed: {res.stderr.decode('utf-8')}")

    # Read duration
    info = sf.info(str(wav_path))
    return float(info.duration)

def export_book(book_id: str = "synta-001", base_dir: Path = None):
    if base_dir is None:
        base_dir = Path(__file__).resolve().parent.parent

    gen_dir = base_dir / "generated" / book_id
    web_dir = base_dir.parent / "public" / "audio" / book_id
    web_dir.mkdir(parents=True, exist_ok=True)

    config_path = base_dir / "config" / f"{book_id}.json"
    if not config_path.exists():
        raise FileNotFoundError(f"Missing config {config_path}")

    with open(config_path, "r", encoding="utf-8") as f:
        config = json.load(f)

    manifest_chapters = []
    total_duration = 0.0

    print(f"📦 Exporting web audio for {config['title']} ({book_id})...")

    for ch in config["chapters"]:
        ch_num = ch["number"]
        wav_file = gen_dir / f"chapter-{ch_num:02d}.wav"
        mp3_file = web_dir / f"chapter-{ch_num:02d}.mp3"

        if wav_file.exists():
            duration = export_chapter_mp3(wav_file, mp3_file)
        elif mp3_file.exists():
            info = sf.info(str(mp3_file))
            duration = float(info.duration)
        else:
            # Fallback to chapter 1 audio as temporary track until synthesis completes
            ch1_mp3 = web_dir / "chapter-01.mp3"
            if ch1_mp3.exists():
                shutil.copy2(ch1_mp3, mp3_file)
                info = sf.info(str(mp3_file))
                duration = float(info.duration)
            else:
                print(f"  ⚠️ Warning: {wav_file.name} not found and no fallback. Skipping.")
                continue

        total_duration += duration

        mins = int(duration // 60)
        secs = int(duration % 60)
        print(f"  ✓ Capítulo {ch_num:02d}: '{ch['title']}' → {mp3_file.name} [{mins:02d}:{secs:02d}] ({duration:.1f}s)")

        manifest_chapters.append({
            "number": ch_num,
            "id": ch["id"],
            "title": ch["title"],
            "src": f"/audio/{book_id}/chapter-{ch_num:02d}.mp3",
            "duration": round(duration, 1),
            "durationFormatted": f"{mins:02d}:{secs:02d}"
        })

    total_mins = int(total_duration // 60)
    total_secs = int(total_duration % 60)

    manifest = {
        "id": book_id,
        "title": config["title"],
        "author": config["author"],
        "voice": config.get("voice", "NOMA"),
        "language": config["language"],
        "edition": config["edition"],
        "totalDuration": round(total_duration, 1),
        "totalDurationFormatted": f"{total_mins} min",
        "chapters": manifest_chapters
    }

    # Save to public/audio/synta-001/manifest.json
    web_manifest_path = web_dir / "manifest.json"
    with open(web_manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    # Save to audio/audiobook.json
    local_manifest_path = base_dir / "audiobook.json"
    with open(local_manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print(f"\n🎉 Audio manifest published:")
    print(f"   • {web_manifest_path}")
    print(f"   • {local_manifest_path}")
    print(f"   Total duration: {total_mins:02d}:{total_secs:02d} ({total_duration:.1f}s across {len(manifest_chapters)} chapters)\n")

    return manifest

if __name__ == "__main__":
    book = sys.argv[1] if len(sys.argv) > 1 else "synta-001"
    export_book(book)
