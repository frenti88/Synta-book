'use client';

import React from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

export const MiniPlayer: React.FC = () => {
  const {
    currentChapter,
    isPlaying,
    currentTime,
    duration,
    isPlayerOpen,
    hasStartedAudio,
    isLoadingAudio,
    togglePlay,
    openPlayer,
    closePlayer,
  } = useAudioPlayer();

  if (!hasStartedAudio || isPlayerOpen || !currentChapter) {
    return null;
  }

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <aside
      aria-label="Reproductor de audio en miniatura"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[420px] z-40 bg-[#131211]/95 backdrop-blur-md border border-[#2A2724] rounded-[10px] shadow-2xl text-[#EDEAE2] overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
    >
      {/* Top Hairline Progress Bar */}
      <div className="w-full h-[2px] bg-[#2A2724]">
        <div
          className="h-full bg-[#E34A32] transition-all duration-150 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="px-4 py-3 flex items-center justify-between gap-3">
        {/* Play / Pause Toggle Button */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pausar audio de NOMA' : 'Reproducir audio de NOMA'}
          className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-[8px] bg-white text-black hover:bg-[#E34A32] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 focus:ring-2 focus:ring-[#E34A32] focus:outline-none"
        >
          {isLoadingAudio ? (
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
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

        {/* Chapter Title & Time */}
        <button
          onClick={() => openPlayer()}
          className="flex-1 min-w-0 text-left cursor-pointer group py-1"
          aria-label={`Abrir reproductor completo: Capítulo ${currentChapter.number}, ${currentChapter.title}`}
        >
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-sans-ui text-[11px] font-mono tracking-widest uppercase text-[#E34A32] font-semibold">
              Capítulo {currentChapter.number.toString().padStart(2, '0')}
            </span>
            <span className="text-[#9E9A92] text-[11px]">·</span>
            <span className="font-sans-ui text-[11px] font-mono text-[#9E9A92]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="font-editorial text-[16px] text-[#EDEAE2] truncate group-hover:text-white transition-colors">
            {currentChapter.title}
          </div>
        </button>

        {/* Action Buttons: Expand and Close */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => openPlayer()}
            aria-label="Maximizar reproductor de audio"
            className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-[8px] text-[#9E9A92] hover:text-[#EDEAE2] hover:bg-[#2A2724]/60 flex items-center justify-center transition-colors cursor-pointer focus:ring-2 focus:ring-[#E34A32] focus:outline-none"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};
