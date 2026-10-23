#!/usr/bin/env python3
"""
SYNTA / NOMA Audiobook Pipeline — Master Generation CLI
Generates audiobooks using Resemble AI Chatterbox Multilingual V3 in Spanish.
Features automatic hardware selection (CUDA/MPS/CPU), seed stabilization,
intelligent chunking, voice prompt referencing with fallback, chapter stitching,
and web MP3 exporting.
"""

import os
import sys
import json
import random
import argparse
from pathlib import Path

# Add project root to path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from scripts.prepare_manuscript import prepare_book
from scripts.stitch_chapter import stitch_chapter
from scripts.export_web_audio import export_book

def select_device(preferred: str = None) -> str:
    """Selects the optimal hardware device: CUDA -> MPS (Apple Silicon) -> CPU fallback."""
    import torch
    if preferred:
        return preferred
    if torch.cuda.is_available():
        return "cuda"
    if torch.backends.mps.is_available():
        return "mps"
    return "cpu"

def load_voice_config(base_dir: Path, voice_name: str = "noma") -> dict:
    """Loads voice hyperparameters from audio/config/noma.json."""
    cfg_file = base_dir / "config" / f"{voice_name}.json"
    if cfg_file.exists():
        with open(cfg_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "voice_id": "NOMA",
        "language": "es",
        "exaggeration": 0.55,
        "cfg_weight": 0.35,
        "temperature": 0.7,
        "seed": 1706
    }

def resolve_voice_reference(base_dir: Path, custom_voice: str = None, voice_name: str = "noma") -> str | None:
    """Checks for reference audio prompt file."""
    if custom_voice:
        p = Path(custom_voice)
        if p.exists():
            return str(p)
        print(f"⚠️ Specified voice prompt {custom_voice} not found.")

    default_ref = base_dir / "voices" / voice_name / "reference.wav"
    if default_ref.exists():
        print(f"🎙️ Using NOMA reference voice prompt: {default_ref.name}")
        return str(default_ref)

    # Alternate location
    flat_ref = base_dir / "voices" / f"{voice_name}-reference.wav"
    if flat_ref.exists():
        print(f"🎙️ Using NOMA reference voice prompt: {flat_ref.name}")
        return str(flat_ref)

    print("ℹ️ NOMA reference voice not found. Using default Chatterbox voice.")
    return None

def main():
    parser = argparse.ArgumentParser(description="SYNTA / NOMA Audiobook Generation Engine (Chatterbox)")
    parser.add_argument("--book", type=str, default="synta-001", help="Book identifier (e.g. synta-001)")
    parser.add_argument("--chapter", type=int, default=None, help="Specific chapter number to generate (1-based)")
    parser.add_argument("--voice", type=str, default=None, help="Path to reference audio prompt WAV file")
    parser.add_argument("--device", type=str, default=None, help="Compute device: cuda | mps | cpu")
    parser.add_argument("--force", action="store_true", help="Force regeneration of existing chunk files")
    parser.add_argument("--skip-generation", action="store_true", help="Skip TTS generation and only run stitch + export")

    args = parser.parse_args()

    device = select_device(args.device)
    print("=" * 65)
    print("  SYNTA — Editorial Audio Pipeline (NOMA / Chatterbox)")
    print(f"  Book:   {args.book}")
    print(f"  Device: Using device: {device}")
    print("=" * 65)

    # 1. Prepare and chunk manuscript
    chapters = prepare_book(args.book, BASE_DIR)

    # 2. Voice configuration and reference prompt
    voice_cfg = load_voice_config(BASE_DIR, "noma")
    ref_voice_path = resolve_voice_reference(BASE_DIR, args.voice, "noma")

    # Target chapters
    target_chapters = [c for c in chapters if args.chapter is None or c["number"] == args.chapter]
    if not target_chapters:
        print(f"❌ Error: Chapter {args.chapter} not found in manuscript.")
        sys.exit(1)

    model = None
    if not args.skip_generation:
        import torch
        import torchaudio as ta
        from chatterbox import ChatterboxMultilingualTTS

        # Set deterministic seeds
        seed = voice_cfg.get("seed", 1706)
        torch.manual_seed(seed)
        random.seed(seed)
        if torch.cuda.is_available():
            torch.cuda.manual_seed_all(seed)

        print("\n⏳ Loading ChatterboxMultilingualTTS (v3) into memory...")
        model = ChatterboxMultilingualTTS.from_pretrained(device=device)
        print("✅ Model loaded successfully.\n")

    qa_report = []

    # 3. Generate chunk WAVs
    gen_dir = BASE_DIR / "generated" / args.book

    for ch in target_chapters:
        ch_num = ch["number"]
        ch_title = ch["title"]
        chunks = ch["chunks"]
        ch_dir = gen_dir / f"chapter-{ch_num:02d}"
        ch_dir.mkdir(parents=True, exist_ok=True)

        print(f"🎬 Processing Capítulo {ch_num:02d}: '{ch_title}' ({len(chunks)} chunks)")

        chunks_generated = 0
        chunks_reused = 0

        for idx, chunk in enumerate(chunks):
            chunk_file = ch_dir / f"chunk-{idx+1:03d}.wav"
            
            if chunk_file.exists() and not args.force:
                chunks_reused += 1
                continue

            if args.skip_generation:
                continue

            # Run synthesis with Chatterbox
            print(f"   [{idx+1:02d}/{len(chunks):02d}] Synthesizing: \"{chunk['text'][:42]}...\"")
            wav = model.generate(
                text=chunk["text"],
                language_id=voice_cfg.get("language", "es"),
                audio_prompt_path=ref_voice_path,
                exaggeration=voice_cfg.get("exaggeration", 0.55),
                cfg_weight=voice_cfg.get("cfg_weight", 0.35),
                temperature=voice_cfg.get("temperature", 0.7),
                repetition_penalty=voice_cfg.get("repetition_penalty", 2.0)
            )

            # Ensure 2D tensor (channels, samples)
            if wav.ndim == 1:
                wav = wav.unsqueeze(0)
            elif wav.ndim == 3:
                wav = wav.squeeze(0)

            # Move to CPU for saving
            wav = wav.detach().cpu()
            ta.save(str(chunk_file), wav, model.sr)
            chunks_generated += 1

        print(f"   Chunks generated: {chunks_generated}, Reused: {chunks_reused}")

        # 4. Stitch chapter
        master_wav = stitch_chapter(args.book, ch_num, BASE_DIR)

        import soundfile as sf
        info = sf.info(str(master_wav))
        duration_sec = info.duration
        mins = int(duration_sec // 60)
        secs = int(duration_sec % 60)

        qa_report.append({
            "chapter": ch_num,
            "title": ch_title,
            "duration": f"{mins:02d}:{secs:02d}",
            "duration_sec": round(duration_sec, 1),
            "chunks": len(chunks),
            "status": "OK" if duration_sec > 10 else "CHECK"
        })

    # 5. Export web audio (MP3s + manifest.json)
    export_book(args.book, BASE_DIR)

    # 6. Print Quality Assurance Report
    print("\n" + "=" * 65)
    print("  AUDIOBOOK QA INSPECTION REPORT — NOMA")
    print("=" * 65)
    for rep in qa_report:
        print(f"  Capítulo {rep['chapter']:02d}: {rep['title']:<28} | Duración: {rep['duration']} | Chunks: {rep['chunks']:<2} | Status: {rep['status']}")
    print("=" * 65 + "\n")

if __name__ == "__main__":
    main()
