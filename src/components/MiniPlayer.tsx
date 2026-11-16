'use client';

import React, { useState } from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

export const MiniPlayer: React.FC = () => {
  const {
    manifest,
    currentChapter,
    currentChapterIndex,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    hasStartedAudio,
    isLoadingAudio,
    togglePlay,
    seekTo,
    skipSeconds,
    setSpeed,
    changeChapter,
    closePlayer,
  } = useAudioPlayer();

  const [showChapters, setShowChapters] = useState(false);

  if (!hasStartedAudio || !currentChapter || !manifest) {
    return null;
  }

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const cycleSpeed = () => {
    const speeds = [1.0, 1.2, 1.5, 0.8];
    const currentIdx = speeds.indexOf(playbackRate);
    const nextRate = speeds[(currentIdx + 1) % speeds.length];
    setSpeed(nextRate);
  };

  return (
    <aside
      aria-label="Reproductor de audio"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[440px] z-[60] bg-[#131211]/95 backdrop-blur-md border border-[#2A2724] rounded-[10px] shadow-2xl text-[#EDEAE2] overflow-visible transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
    >
      {/* Compact Chapter List Popover */}
      {showChapters && (
        <div
          role="region"
          aria-label="Capítulos del audiolibro"
          className="absolute bottom-full right-0 left-0 mb-2 bg-[#131211]/98 backdrop-blur-md border border-[#2A2724] rounded-[10px] shadow-2xl p-2 max-h-64 overflow-y-auto divide-y divide-[#2A2724]/70"
        >
          <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest text-[#9E9A92] flex items-center justify-between">
            <span>{manifest.title}</span>
            <span>{manifest.chapters.length} capítulos</span>
          </div>
          {manifest.chapters.map((ch, idx) => (
            <button
              key={ch.number}
              onClick={() => {
                changeChapter(idx, true);
                setShowChapters(false);
              }}
              className={`w-full py-2.5 px-3 rounded-[6px] flex items-center justify-between text-left transition-colors cursor-pointer ${
                idx === currentChapterIndex
                  ? 'bg-[#E34A32]/20 text-white font-semibold'
                  : 'text-[#9E9A92] hover:text-[#EDEAE2] hover:bg-[#1F1D1B]'
              }`}
            >
              <div className="flex items-baseline gap-2.5 min-w-0">
                <span className="font-mono text-[12px] text-[#E34A32] shrink-0">
                  {ch.number.toString().padStart(2, '0')}
                </span>
                <span className="font-editorial text-[16px] truncate">
                  {ch.title}
                </span>
              </div>
              <span className="font-mono text-[12px] text-[#9E9A92] shrink-0 ml-2">
                {ch.durationFormatted}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="rounded-[10px] overflow-hidden">
        {/* Interactive Top Scrubber Bar */}
        <div className="relative w-full h-1.5 bg-[#2A2724] group cursor-pointer">
          <div
            className="h-full bg-[#E34A32] transition-all duration-150 ease-out pointer-events-none"
            style={{ width: `${progressPercent}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            step="0.2"
            value={progressPercent}
            onChange={(e) => seekTo((parseFloat(e.target.value) / 100) * duration)}
            aria-label="Posición de reproducción"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="px-3.5 py-3 flex items-center justify-between gap-3">
          {/* Play / Pause Toggle Button */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
            className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-[8px] bg-white text-black hover:bg-[#E34A32] hover:text-white active:scale-[0.95] flex items-center justify-center transition-all duration-150 cursor-pointer shrink-0 focus:ring-2 focus:ring-[#E34A32] focus:outline-none"
          >
            {isLoadingAudio ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Chapter Title & Time (click to toggle chapter list) */}
          <button
            onClick={() => setShowChapters(!showChapters)}
            className="flex-1 min-w-0 text-left cursor-pointer group py-0.5"
            aria-label="Seleccionar capítulo"
            aria-expanded={showChapters}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-sans-ui text-[11px] font-mono tracking-widest uppercase text-[#E34A32] font-semibold">
                Cap. {currentChapter.number.toString().padStart(2, '0')}/{manifest.chapters.length.toString().padStart(2, '0')}
              </span>
              {isPlaying && (
                <span className="inline-flex items-end gap-[2px] h-3 px-0.5" aria-hidden="true" title="Audio activo">
                  <span className="w-[2px] bg-[#E34A32] rounded-full animate-wave-1" />
                  <span className="w-[2px] bg-[#E34A32] rounded-full animate-wave-2" />
                  <span className="w-[2px] bg-[#E34A32] rounded-full animate-wave-3" />
                </span>
              )}
              <span className="text-[#9E9A92] text-[11px]">·</span>
              <span className="font-sans-ui text-[11px] font-mono text-[#9E9A92]">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="font-editorial text-[16px] text-[#EDEAE2] truncate group-hover:text-white transition-colors flex items-center gap-1.5">
              <span className="truncate">{currentChapter.title}</span>
              <span className="text-[11px] text-[#9E9A92] font-sans-ui shrink-0">
                {showChapters ? '▾' : '▴'}
              </span>
            </div>
          </button>

          {/* Compact Controls: -15s, Speed, Close */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => skipSeconds(-15)}
              aria-label="Retroceder 15 segundos"
              title="-15s"
              className="hidden sm:flex min-w-[36px] min-h-[36px] w-9 h-9 rounded-[8px] text-[#9E9A92] hover:text-[#EDEAE2] hover:bg-[#2A2724]/60 items-center justify-center transition-colors cursor-pointer text-[11px] font-mono"
            >
              -15s
            </button>

            <button
              onClick={cycleSpeed}
              aria-label={`Velocidad de reproducción: ${playbackRate}x`}
              title="Cambiar velocidad"
              className="min-w-[40px] min-h-[36px] h-9 px-2 rounded-[8px] text-[#EDEAE2] hover:bg-[#2A2724]/70 border border-[#2A2724] flex items-center justify-center transition-colors cursor-pointer font-mono text-[12px]"
            >
              {playbackRate}x
            </button>

            <button
              onClick={closePlayer}
              aria-label="Cerrar reproductor"
              title="Cerrar reproductor"
              className="min-w-[36px] min-h-[36px] w-9 h-9 rounded-[8px] text-[#9E9A92] hover:text-white hover:bg-[#2A2724]/60 flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
