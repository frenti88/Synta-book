'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Story } from '@/types';
import { trackEvent, getStoredReaderId } from '@/lib/analytics';
import { AuthorReveal } from './AuthorReveal';
import { FeedbackSection } from './FeedbackSection';
import { NextStorySection } from './NextStorySection';

interface ReaderProps {
  story: Story;
  isOpen: boolean;
  onClose: () => void;
}

type FontSize = 'sm' | 'base' | 'lg';

export const Reader: React.FC<ReaderProps> = ({ story, isOpen, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [fontSize, setFontSize] = useState<FontSize>('base');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showAuthorReveal, setShowAuthorReveal] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const readerContentRef = useRef<HTMLDivElement>(null);
  const authorRevealRef = useRef<HTMLDivElement>(null);
  const fontMenuRef = useRef<HTMLDivElement>(null);

  const milestonesRef = useRef({
    started: false,
    p25: false,
    p50: false,
    p75: false,
    completed: false,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('synta_reader_dark');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'true');
      } else {
        setIsDarkMode(true);
      }

      const savedSize = localStorage.getItem('synta_reader_font_size') as FontSize;
      if (savedSize && ['sm', 'base', 'lg'].includes(savedSize)) {
        setFontSize(savedSize);
      }
    }
  }, []);

  // Close font menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (fontMenuRef.current && !fontMenuRef.current.contains(e.target as Node)) {
        setShowFontMenu(false);
      }
    };
    if (showFontMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showFontMenu]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('synta_reader_dark', String(next));
      return next;
    });
  };

  const handleFontSizeChange = (size: FontSize) => {
    setFontSize(size);
    localStorage.setItem('synta_reader_font_size', size);
    setShowFontMenu(false);
  };

  const handleScroll = useCallback(() => {
    if (!containerRef.current || !readerContentRef.current) return;

    const container = containerRef.current;
    const content = readerContentRef.current;

    const scrollTop = container.scrollTop;
    const scrollHeight = content.offsetHeight - container.clientHeight;

    if (scrollHeight <= 0) return;

    const currentPercent = Math.min(
      100,
      Math.max(0, Math.round((scrollTop / scrollHeight) * 100))
    );

    setProgress(currentPercent);

    localStorage.setItem(`synta_progress_${story.id}`, String(currentPercent));
    localStorage.setItem(`synta_scroll_${story.id}`, String(scrollTop));

    if (!milestonesRef.current.started && currentPercent > 1) {
      milestonesRef.current.started = true;
      trackEvent('reader_started', { story_id: story.id });
    }
    if (!milestonesRef.current.p25 && currentPercent >= 25) {
      milestonesRef.current.p25 = true;
      trackEvent('reader_25', { story_id: story.id });
    }
    if (!milestonesRef.current.p50 && currentPercent >= 50) {
      milestonesRef.current.p50 = true;
      trackEvent('reader_50', { story_id: story.id });
    }
    if (!milestonesRef.current.p75 && currentPercent >= 75) {
      milestonesRef.current.p75 = true;
      trackEvent('reader_75', { story_id: story.id });
    }
    if (!milestonesRef.current.completed && currentPercent >= 98) {
      milestonesRef.current.completed = true;
      trackEvent('reader_completed', { story_id: story.id });
    }

    const readerId = getStoredReaderId();
    if (readerId && (currentPercent % 20 === 0 || currentPercent >= 99)) {
      fetch('/api/reading-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reader_id: readerId,
          story_id: story.id,
          progress: currentPercent,
        }),
      }).catch(() => {});
    }
  }, [story.id]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const timer = setTimeout(() => {
        const savedScroll = localStorage.getItem(`synta_scroll_${story.id}`);
        if (savedScroll && containerRef.current) {
          containerRef.current.scrollTop = Number(savedScroll);
        }
      }, 80);

      trackEvent('reader_started', { story_id: story.id, resume: true });

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, story.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleRevealAuthor = () => {
    setShowAuthorReveal(true);
    trackEvent('author_reveal_opened', { story_id: story.id });

    setTimeout(() => {
      authorRevealRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  if (!isOpen) return null;

  const paragraphSizeClass =
    fontSize === 'sm'
      ? 'text-[18px] sm:text-[19px] leading-[1.7]'
      : fontSize === 'lg'
      ? 'text-[22px] sm:text-[24px] leading-[1.8]'
      : 'text-[20px] sm:text-[21px] leading-[1.75]';

  const textColor = isDarkMode ? 'text-white' : 'text-[#171717]';
  const borderColor = isDarkMode ? 'border-white/20' : 'border-[#171717]/20';
  const buttonPrimary = isDarkMode
    ? 'bg-white text-black hover:bg-[#E34A32] hover:text-white'
    : 'bg-[#171717] text-white hover:bg-[#E34A32]';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Lector de ${story.title}`}
      className={`fixed inset-0 z-50 flex flex-col transition-colors duration-300 ${
        isDarkMode
          ? 'bg-black text-white'
          : 'bg-[#F4F1EA] text-[#171717]'
      }`}
    >
      {/* Minimal Sticky Top Header */}
      <header
        className={`sticky top-0 z-30 w-full px-4 sm:px-8 flex items-center justify-between border-b transition-colors duration-200 ${
          isDarkMode
            ? 'bg-black/95 backdrop-blur-md border-white/20'
            : 'bg-[#F4F1EA]/95 backdrop-blur-md border-[#171717]/15'
        }`}
        style={{ height: '62px' }}
      >
        <div className="flex items-center gap-2 text-left">
          <span className={`font-editorial text-[22px] font-semibold tracking-tight ${textColor}`}>
            SYNTA
          </span>
          <span className="w-2 h-2 rounded-full bg-[#E34A32]" />
        </div>

        <div className={`hidden sm:block font-editorial text-[16px] italic text-left truncate max-w-xs md:max-w-md ${textColor}`}>
          {story.title}
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className={`font-sans-ui text-[16px] font-mono tracking-wider ${textColor}`}>
            {progress}%
          </div>

          {/* Aa Font Size Control */}
          <div className="relative" ref={fontMenuRef}>
            <button
              onClick={() => setShowFontMenu(!showFontMenu)}
              aria-label="Ajustar tamaño de texto"
              aria-expanded={showFontMenu}
              className={`p-2 font-editorial font-bold text-[18px] transition-colors focus:ring-2 focus:ring-[#E34A32] rounded-[8px] cursor-pointer ${
                showFontMenu ? 'text-[#E34A32]' : `${textColor} hover:text-[#E34A32]`
              }`}
            >
              Aa
            </button>

            {showFontMenu && (
              <div
                className={`absolute right-0 top-12 w-48 py-2 border shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-150 rounded-[8px] overflow-hidden ${
                  isDarkMode
                    ? 'bg-black border-white/30 text-white'
                    : 'bg-[#EDE8DE] border-[#171717]/20 text-[#171717]'
                }`}
              >
                <div className={`px-4 py-1.5 font-sans-ui text-[16px] uppercase tracking-wider font-medium ${textColor}`}>
                  Tamaño de texto
                </div>
                <button
                  onClick={() => handleFontSizeChange('sm')}
                  className={`w-full text-left px-4 py-2.5 text-[16px] font-sans-ui transition-colors cursor-pointer flex items-center justify-between rounded-[8px] ${
                    fontSize === 'sm' ? 'text-[#E34A32] font-semibold' : `${textColor} ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}`
                  }`}
                >
                  <span>Pequeño</span>
                  <span className="text-[16px]">A-</span>
                </button>
                <button
                  onClick={() => handleFontSizeChange('base')}
                  className={`w-full text-left px-4 py-2.5 text-[16px] font-sans-ui transition-colors cursor-pointer flex items-center justify-between rounded-[8px] ${
                    fontSize === 'base' ? 'text-[#E34A32] font-semibold' : `${textColor} ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}`
                  }`}
                >
                  <span>Predeterminado</span>
                  <span className="text-[16px]">A</span>
                </button>
                <button
                  onClick={() => handleFontSizeChange('lg')}
                  className={`w-full text-left px-4 py-2.5 text-[16px] font-sans-ui transition-colors cursor-pointer flex items-center justify-between rounded-[8px] ${
                    fontSize === 'lg' ? 'text-[#E34A32] font-semibold' : `${textColor} ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}`
                  }`}
                >
                  <span>Grande</span>
                  <span className="text-[18px]">A+</span>
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? 'Cambiar a modo papel claro' : 'Cambiar a modo oscuro'}
            className={`p-2 transition-colors focus:ring-2 focus:ring-[#E34A32] rounded-[8px] cursor-pointer ${
              isDarkMode ? 'text-white hover:text-[#E34A32]' : 'text-[#171717] hover:text-[#E34A32]'
            }`}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {/* Close Reader */}
          <button
            onClick={onClose}
            aria-label="Cerrar lector"
            className={`p-2 transition-colors focus:ring-2 focus:ring-[#E34A32] rounded-[8px] cursor-pointer ${
              isDarkMode ? 'text-white hover:text-[#E34A32]' : 'text-[#171717] hover:text-[#E34A32]'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* Progress hairline indicator */}
      <div
        className="w-full h-[2px] bg-transparent"
        style={{
          background: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(23,23,23,0.12)',
        }}
      >
        <div
          className="h-full bg-[#E34A32] transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Scrollable Reader Column */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-5 sm:px-8 py-12 md:py-20"
      >
        <article
          ref={readerContentRef}
          className="max-w-[700px] mx-auto font-editorial text-left"
        >
          {/* Editorial Book Title Page - strictly left-aligned */}
          <header className={`mb-20 sm:mb-28 text-left pb-16 border-b ${borderColor}`}>
            <div className={`font-sans-ui text-[16px] tracking-[0.2em] uppercase mb-4 flex items-center justify-start gap-2.5 text-left ${textColor}`}>
              <span>{story.edition}</span>
              <span className="opacity-60">·</span>
              <span>{story.genre}</span>
            </div>

            <h1 className={`font-editorial text-[38px] sm:text-[52px] md:text-[60px] leading-[1.05] font-normal tracking-[-0.02em] mb-6 text-left ${textColor}`}>
              {story.title}
            </h1>

            <p className={`font-editorial italic text-[19px] sm:text-[22px] max-w-xl text-left ${textColor}`}>
              {story.synopsis}
            </p>
          </header>

          {/* Chapters loop - strictly left-aligned */}
          <div className="space-y-20 sm:space-y-28 text-left">
            {story.chapters.map((chapter) => (
              <section
                key={chapter.id}
                id={chapter.id}
                className="space-y-7 text-left"
                aria-labelledby={`heading-${chapter.id}`}
              >
                <div className="mb-10 text-left">
                  <span className={`font-sans-ui text-[16px] font-mono tracking-widest block mb-1 text-left ${textColor}`}>
                    {chapter.number}
                  </span>
                  <h2
                    id={`heading-${chapter.id}`}
                    className={`font-editorial text-[26px] sm:text-[32px] font-normal tracking-tight text-left ${textColor}`}
                  >
                    {chapter.title}
                  </h2>
                </div>

                {chapter.paragraphs.map((p, idx) => (
                  <p
                    key={idx}
                    className={`font-editorial font-normal ${paragraphSizeClass} tracking-normal text-left ${textColor}`}
                    style={{ textWrap: 'pretty' }}
                  >
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {/* Revelation Trigger Block - strictly left-aligned */}
          <div className={`mt-28 sm:mt-36 pt-16 border-t text-left ${borderColor}`}>
            <div className={`font-editorial text-[24px] sm:text-[28px] tracking-[0.3em] font-normal mb-8 text-left ${textColor}`}>
              FIN
            </div>

            <div className="my-8 h-12 flex items-center justify-start" aria-hidden="true">
              <span className={`w-16 h-[1px] ${isDarkMode ? 'bg-white/40' : 'bg-[#171717]/40'}`} />
            </div>

            <div className="space-y-6 text-left">
              <p className={`font-editorial text-[22px] sm:text-[26px] leading-[1.3] font-normal text-left ${textColor}`}>
                Nota sobre la autoría y el proceso de creación de esta obra.
              </p>

              {!showAuthorReveal ? (
                <button
                  onClick={handleRevealAuthor}
                  className={`font-sans-ui text-[16px] font-semibold transition-colors duration-200 min-h-[52px] px-8 py-3.5 inline-flex items-center justify-center gap-2.5 rounded-[8px] cursor-pointer shadow-sm ${buttonPrimary}`}
                >
                  <span>Leer nota sobre la autora</span>
                  <span aria-hidden="true" className="text-[16px] font-sans">
                    →
                  </span>
                </button>
              ) : null}
            </div>
          </div>

          {showAuthorReveal && (
            <div ref={authorRevealRef} className="animate-in fade-in slide-in-from-bottom-6 duration-500 text-left">
              <AuthorReveal isDarkMode={isDarkMode} />
              <FeedbackSection storyId={story.id} isDarkMode={isDarkMode} />
              <NextStorySection isDarkMode={isDarkMode} />
            </div>
          )}
        </article>
      </div>
    </div>
  );
};
