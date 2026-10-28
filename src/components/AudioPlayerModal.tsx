'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { BookCover } from './BookCover';

interface AudioPlayerModalProps {
  onOpenReaderAtChapter?: (chapterIndex: number) => void;
}

export const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({
  onOpenReaderAtChapter,
}) => {
  const {
    manifest,
    currentChapter,
    currentChapterIndex,
    availableVoices,
    selectedVoice,
    setVoice,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    isPlayerOpen,
    isLoadingAudio,
    togglePlay,
    seekTo,
    skipSeconds,
    setSpeed,
    changeChapter,
    closePlayer,
  } = useAudioPlayer();

  const [showChapters, setShowChapters] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus management and Escape key
  useEffect(() => {
    if (isPlayerOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        playButtonRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isPlayerOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlayerOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        closePlayer();
        return;
      }

      // Space for play/pause if not typing in an input
      if (e.key === ' ' && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        togglePlay();
        return;
      }

      // Arrows for seeking
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        skipSeconds(-15);
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        skipSeconds(15);
        return;
      }

      // Trap Tab
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closePlayer, isPlayerOpen, skipSeconds, togglePlay]);

  if (!isPlayerOpen || !currentChapter || !manifest) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const speeds = [0.8, 1.0, 1.2, 1.5, 1.75, 2.0];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seekTo((val / 100) * duration);
  };

  const handleSwitchToReader = () => {
    closePlayer();
    if (onOpenReaderAtChapter) {
      onOpenReaderAtChapter(currentChapterIndex);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Audiolibro de ${manifest.title} en la voz de NOMA`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={closePlayer}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Main Player Container */}
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#131211] text-[#EDEAE2] border border-[#2A2724] rounded-[8px] shadow-2xl overflow-y-auto z-10 p-5 sm:p-8 md:p-10 flex flex-col justify-between text-left selection:bg-[#E34A32]/40"
      >
        {/* Top Header Utility Bar */}
        <div className="flex items-center justify-between border-b border-[#2A2724] pb-4 mb-6 text-left">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-xl sm:text-2xl font-semibold tracking-tight text-[#EDEAE2]">
              SYNTA
            </span>
            <span className="w-2 h-2 rounded-full bg-[#E34A32]" />
            <span className="font-sans-ui text-[16px] tracking-[0.16em] uppercase text-[#9E9A92] ml-2 hidden sm:inline">
              Audiolibro Oficial
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Switch to text reading */}
            <button
              onClick={handleSwitchToReader}
              className="font-sans-ui text-[16px] text-[#EDEAE2] hover:text-white px-3 py-1.5 rounded-[8px] border border-[#2A2724] hover:border-[#EDEAE2] transition-colors cursor-pointer flex items-center gap-2 min-h-[44px]"
              aria-label="Cambiar a modo lectura de texto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="hidden sm:inline">Leer texto</span>
            </button>

            {/* Close / Minimize button */}
            <button
              onClick={closePlayer}
              aria-label="Cerrar reproductor de audiolibro"
              className="p-2 text-[#9E9A92] hover:text-[#EDEAE2] rounded-[8px] focus:ring-2 focus:ring-[#E34A32] cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Player Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center my-auto">
          {/* Left Column: Inaugural Cover Art */}
          <div className="md:col-span-5 flex justify-center md:justify-start">
            <div className="relative group">
              <BookCover size="reader" />
              <div
                className="pointer-events-none absolute -inset-4 bg-[#E34A32]/10 rounded-full blur-2xl opacity-60"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Right Column: Narrative Info & Controls */}
          <div className="md:col-span-7 flex flex-col justify-center text-left">
            {/* Series and Voice Credit */}
            <div className="flex flex-wrap items-center gap-2 mb-2 font-sans-ui text-[16px] tracking-[0.16em] uppercase text-[#9E9A92]">
              <span className="text-[#EDEAE2] font-semibold">{manifest.edition}</span>
              <span>·</span>
              <span>{manifest.author}</span>
            </div>

            {/* Book Title */}
            <h2 className="font-editorial text-[32px] sm:text-[40px] md:text-[44px] leading-[1.05] font-normal text-[#EDEAE2] mb-1 tracking-tight">
              {manifest.title}
            </h2>

            {/* Voice Statement & Feminine Voice Selector */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <span className="font-editorial italic text-[18px] sm:text-[20px] text-[#E34A32]">
                  Escuchar en la voz de NOMA
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#E34A32] bg-[#E34A32]/10 border border-[#E34A32]/30 px-2 py-0.5 rounded-[4px] font-semibold">
                  Voz femenina
                </span>
              </div>

              {/* Voice Selector Dropdown */}
              <div className="relative inline-block text-left">
                <button
                  onClick={() => setShowVoiceMenu(!showVoiceMenu)}
                  aria-label="Seleccionar registro de voz femenina de NOMA"
                  aria-expanded={showVoiceMenu}
                  className="font-sans-ui text-[13px] text-[#EDEAE2] bg-[#1C1A18] hover:bg-[#252320] border border-[#2A2724] hover:border-[#EDEAE2]/40 px-3 py-1.5 rounded-[8px] transition-colors cursor-pointer flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5 text-[#E34A32]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                  </svg>
                  <span className="font-medium">{selectedVoice.name}</span>
                  <span className="text-[#9E9A92] text-[12px] hidden sm:inline">· {selectedVoice.subtitle}</span>
                  <svg
                    className={`w-3.5 h-3.5 text-[#9E9A92] transition-transform ${showVoiceMenu ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showVoiceMenu && (
                  <div className="absolute left-0 top-10 w-72 sm:w-84 bg-[#171615] border border-[#2A2724] rounded-[8px] p-2 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[#9E9A92] border-b border-[#2A2724] mb-1.5 flex items-center justify-between">
                      <span>Registros Vocales de NOMA</span>
                      <span className="text-[#E34A32]">Femeninas</span>
                    </div>
                    <div className="space-y-1">
                      {availableVoices.map((voice) => (
                        <button
                          key={voice.id}
                          onClick={() => {
                            setVoice(voice.id);
                            setShowVoiceMenu(false);
                          }}
                          className={`w-full p-2.5 rounded-[6px] text-left transition-colors cursor-pointer flex flex-col gap-1 ${
                            voice.id === selectedVoice.id
                              ? 'bg-[#252320] text-white border border-[#E34A32]/60'
                              : 'text-[#EDEAE2] hover:bg-[#201E1C]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-sans-ui text-[14px] font-semibold text-[#EDEAE2]">
                              {voice.name}
                            </span>
                            <span className="text-[10px] font-mono text-[#E34A32] bg-[#E34A32]/15 px-1.5 py-0.5 rounded">
                              Femenina
                            </span>
                          </div>
                          <span className="text-[12px] font-editorial text-[#9E9A92] leading-snug">
                            {voice.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Current Chapter Badge */}
            <div className="bg-[#1C1A18] border border-[#2A2724] px-4 py-2.5 rounded-[8px] mb-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-sans-ui text-[14px] text-[#9E9A92] uppercase tracking-wider block font-medium">
                    Capítulo {currentChapter.number} de {manifest.chapters.length}
                  </span>
                  {isPlaying && (
                    <span className="inline-flex items-end gap-[3px] h-3.5 px-1" aria-hidden="true" title="Reproduciendo">
                      <span className="w-[2.5px] bg-[#E34A32] rounded-full animate-wave-1" />
                      <span className="w-[2.5px] bg-[#E34A32] rounded-full animate-wave-2" />
                      <span className="w-[2.5px] bg-[#E34A32] rounded-full animate-wave-3" />
                    </span>
                  )}
                </div>
                <span className="font-editorial text-[20px] sm:text-[22px] text-[#EDEAE2] block leading-tight font-normal">
                  {currentChapter.title}
                </span>
              </div>

              {/* Chapters list trigger */}
              <button
                onClick={() => setShowChapters(!showChapters)}
                className="font-sans-ui text-[16px] text-[#EDEAE2] hover:text-[#E34A32] px-3 py-1.5 rounded-[8px] border border-[#2A2724] transition-colors cursor-pointer min-h-[44px] flex items-center gap-1.5 active:scale-95"
                aria-label="Ver todos los capítulos"
                aria-expanded={showChapters}
              >
                <span>Índice</span>
                <span aria-hidden="true" className="text-[16px]">
                  {showChapters ? '↑' : '↓'}
                </span>
              </button>
            </div>

            {/* Collapsible Chapters Drawer */}
            {showChapters && (
              <div className="bg-[#171615] border border-[#2A2724] rounded-[8px] p-3 mb-6 max-h-52 overflow-y-auto divide-y divide-[#2A2724] animate-in fade-in zoom-in-95 duration-150">
                {manifest.chapters.map((ch, idx) => (
                  <button
                    key={ch.number}
                    onClick={() => {
                      changeChapter(idx, true);
                      setShowChapters(false);
                    }}
                    className={`w-full py-2.5 px-3 rounded-[8px] flex items-center justify-between text-left transition-colors cursor-pointer ${
                      idx === currentChapterIndex
                        ? 'bg-[#E34A32]/20 text-[#EDEAE2] font-semibold'
                        : 'text-[#9E9A92] hover:text-[#EDEAE2] hover:bg-[#1F1D1B]'
                    }`}
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-sans-ui text-[16px] font-mono text-[#9E9A92]">
                        {ch.number.toString().padStart(2, '0')}
                      </span>
                      <span className="font-editorial text-[18px]">
                        {ch.title}
                      </span>
                    </div>
                    <span className="font-sans-ui text-[16px] font-mono text-[#9E9A92]">
                      {ch.durationFormatted}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Audio Progress Scrubbing */}
            <div className="space-y-2 mb-6">
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progressPercent}
                  onChange={handleSliderChange}
                  aria-label="Progreso de reproducción del capítulo"
                  className="w-full h-2 bg-[#2A2724] rounded-[8px] appearance-none cursor-pointer accent-[#E34A32] focus:outline-none focus:ring-2 focus:ring-[#E34A32]"
                />
              </div>

              <div className="flex items-center justify-between font-sans-ui text-[16px] font-mono text-[#9E9A92]">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Audio Controls */}
            <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-6">
              {/* Skip backward -15s */}
              <button
                onClick={() => skipSeconds(-15)}
                aria-label="Retroceder 15 segundos"
                className="w-12 h-12 rounded-[8px] border border-[#2A2724] hover:border-[#EDEAE2] text-[#EDEAE2] flex items-center justify-center transition-all duration-150 active:scale-90 cursor-pointer focus:ring-2 focus:ring-[#E34A32]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
              </button>

              {/* Big Play / Pause */}
              <button
                ref={playButtonRef}
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pausar audiolibro' : 'Reproducir audiolibro'}
                className="w-16 h-16 rounded-[8px] bg-[#EDEAE2] text-[#131211] hover:bg-[#E34A32] hover:text-white active:scale-95 flex items-center justify-center transition-all duration-150 cursor-pointer shadow-lg focus:ring-2 focus:ring-[#E34A32]"
              >
                {isLoadingAudio ? (
                  <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : isPlaying ? (
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Skip forward +15s */}
              <button
                onClick={() => skipSeconds(15)}
                aria-label="Avanzar 15 segundos"
                className="w-12 h-12 rounded-[8px] border border-[#2A2724] hover:border-[#EDEAE2] text-[#EDEAE2] flex items-center justify-center transition-all duration-150 active:scale-90 cursor-pointer focus:ring-2 focus:ring-[#E34A32]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 005 8v8a1 1 0 001.6.8l5.334-4zM19.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.334-4z" />
                </svg>
              </button>

              {/* Playback speed selector */}
              <div className="relative">
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  aria-label="Seleccionar velocidad de reproducción"
                  aria-expanded={showSpeedMenu}
                  className="px-3.5 h-12 rounded-[8px] border border-[#2A2724] text-[#EDEAE2] font-sans-ui text-[16px] font-mono hover:border-[#EDEAE2] transition-colors cursor-pointer flex items-center gap-1 focus:ring-2 focus:ring-[#E34A32]"
                >
                  <span>{playbackRate}x</span>
                </button>

                {showSpeedMenu && (
                  <div className="absolute left-0 bottom-14 bg-[#171615] border border-[#2A2724] rounded-[8px] p-1.5 shadow-2xl z-20 w-24">
                    {speeds.map((rate) => (
                      <button
                        key={rate}
                        onClick={() => {
                          setSpeed(rate);
                          setShowSpeedMenu(false);
                        }}
                        className={`w-full py-1.5 px-2 text-[16px] font-sans-ui font-mono rounded-[8px] text-left transition-colors cursor-pointer ${
                          rate === playbackRate
                            ? 'bg-[#E34A32] text-white font-semibold'
                            : 'text-[#EDEAE2] hover:bg-[#2A2724]'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-4 border-t border-[#2A2724] flex flex-wrap items-center justify-between text-left font-sans-ui text-[16px] text-[#9E9A92]">
          <span>Audio oficial generado con Chatterbox Multilingual V3 · Voz de NOMA (Femenina)</span>
          <span className="text-[#EDEAE2]">SYNTA Editorial · 2026</span>
        </div>
      </div>
    </div>
  );
};
