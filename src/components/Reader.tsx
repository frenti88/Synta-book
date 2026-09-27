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
      ? 'text-[18px] sm:text-[19px] leading-[1.65]'
      : fontSize === 'lg'
      ? 'text-[22px] sm:text-[24px] leading-[1.75]'
      : 'text-[20px] sm:text-[21px] leading-[1.7]';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Lector de ${story.title}`}
      className={`fixed inset-0 z-50 flex flex-col transition-colors duration-300 ${
        isDarkMode
          ? 'bg-[#131211] text-[#EDEAE2]'
          : 'bg-[#F4F1EA] text-[#121212]'
      }`}
    >
      {/* Minimal Sticky Top Header */}
      <header
        className={`sticky top-0 z-30 w-full px-4 sm:px-8 flex items-center justify-between border-b transition-colors duration-200 ${
          isDarkMode
            ? 'bg-[#131211]/90 backdrop-blur-md border-[#EDEAE2]/10'
            : 'bg-[#F4F1EA]/90 backdrop-blur-md border-[#121212]/10'
        }`}
        style={{ height: '58px' }}
      >
        <div className="flex items-center gap-2">
          <span className="font-editorial text-[20px] font-semibold tracking-tight">
            SYNTA
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E34A32]" />
        </div>

        <div className="hidden sm:block font-editorial text-[15px] italic text-center truncate max-w-xs md:max-w-md opacity-80">
          {story.title}
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="font-sans-ui text-[12px] font-mono tracking-wider opacity-70">
            {progress}%
          </div>

          {/* Aa Font Size Control with 8px radius and outside click detection */}
          <div className="relative" ref={fontMenuRef}>
            <button
              onClick={() => setShowFontMenu(!showFontMenu)}
              aria-label="Ajustar tamaño de texto"
              aria-expanded={showFontMenu}
              className={`p-1.5 font-editorial font-bold text-[16px] transition-colors focus:ring-1 focus:ring-[#E34A32] rounded-[8px] cursor-pointer ${
                showFontMenu ? 'text-[#E34A32]' : 'opacity-80 hover:opacity-100'
              }`}
            >
              Aa
            </button>

            {showFontMenu && (
              <div
                className={`absolute right-0 top-10 w-44 py-2 border shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-150 rounded-[8px] overflow-hidden ${
                  isDarkMode
                    ? 'bg-[#1A1918] border-[#EDEAE2]/15 text-[#EDEAE2]'
                    : 'bg-[#F4F1EA] border-[#121212]/15 text-[#121212]'
                }`}
              >
                <div className="px-3 py-1 font-sans-ui text-[11px] uppercase tracking-wider opacity-60">
                  Tamaño de texto
                </div>
                <button
                  onClick={() => handleFontSizeChange('sm')}
                  className={`w-full text-left px-3 py-2 text-[13px] font-sans-ui transition-colors cursor-pointer flex items-center justify-between rounded-[8px] ${
                    fontSize === 'sm' ? 'text-[#E34A32] font-semibold' : 'hover:opacity-75'
                  }`}
                >
                  <span>Pequeño</span>
                  <span className="text-[12px]">A-</span>
                </button>
                <button
                  onClick={() => handleFontSizeChange('base')}
                  className={`w-full text-left px-3 py-2 text-[14px] font-sans-ui transition-colors cursor-pointer flex items-center justify-between rounded-[8px] ${
                    fontSize === 'base' ? 'text-[#E34A32] font-semibold' : 'hover:opacity-75'
                  }`}
                >
                  <span>Predeterminado</span>
                  <span className="text-[14px]">A</span>
                </button>
                <button
                  onClick={() => handleFontSizeChange('lg')}
                  className={`w-full text-left px-3 py-2 text-[15px] font-sans-ui transition-colors cursor-pointer flex items-center justify-between rounded-[8px] ${
                    fontSize === 'lg' ? 'text-[#E34A32] font-semibold' : 'hover:opacity-75'
                  }`}
                >
                  <span>Grande</span>
                  <span className="text-[16px]">A+</span>
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle with 8px radius */}
          <button
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? 'Cambiar a modo papel claro' : 'Cambiar a modo oscuro'}
            className="p-1.5 opacity-80 hover:opacity-100 transition-opacity focus:ring-1 focus:ring-[#E34A32] rounded-[8px] cursor-pointer"
          >
            {isDarkMode ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.7}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.7}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {/* Close Reader with 8px radius */}
          <button
            onClick={onClose}
            aria-label="Cerrar lector"
            className="p-1.5 opacity-80 hover:opacity-100 transition-opacity focus:ring-1 focus:ring-[#E34A32] rounded-[8px] cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* Progress hairline indicator */}
      <div
        className="w-full h-[2px] bg-transparent"
        style={{
          background: isDarkMode ? 'rgba(237,234,226,0.06)' : 'rgba(18,18,18,0.06)',
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
          className="max-w-[680px] mx-auto font-editorial text-left"
        >
          {/* Editorial Book Title Page */}
          <header className="mb-20 sm:mb-28 text-center pb-16 border-b border-current/10">
            <div className="font-sans-ui text-[11px] sm:text-[12px] tracking-[0.24em] uppercase opacity-60 mb-4 flex items-center justify-center gap-2">
              <span>{story.edition}</span>
              <span className="opacity-40">·</span>
              <span>{story.genre}</span>
            </div>

            <h1 className="font-editorial text-[40px] sm:text-[52px] md:text-[58px] leading-[1.05] font-normal tracking-[-0.02em] mb-6">
              {story.title}
            </h1>

            <p className="font-editorial italic text-[18px] sm:text-[20px] opacity-75 max-w-md mx-auto">
              {story.synopsis}
            </p>
          </header>

          {/* Chapters loop */}
          <div className="space-y-20 sm:space-y-28">
            {story.chapters.map((chapter) => (
              <section
                key={chapter.id}
                id={chapter.id}
                className="space-y-7"
                aria-labelledby={`heading-${chapter.id}`}
              >
                <div className="mb-10 text-center sm:text-left">
                  <span className="font-sans-ui text-[11px] font-mono tracking-widest opacity-50 block mb-1">
                    {chapter.number}
                  </span>
                  <h2
                    id={`heading-${chapter.id}`}
                    className="font-editorial text-[26px] sm:text-[30px] font-normal tracking-tight"
                  >
                    {chapter.title}
                  </h2>
                </div>

                {chapter.paragraphs.map((p, idx) => (
                  <p
                    key={idx}
                    className={`font-editorial font-normal ${paragraphSizeClass} tracking-normal text-justify`}
                    style={{ textWrap: 'pretty' }}
                  >
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {/* Revelation Trigger Block */}
          <div className="mt-28 sm:mt-36 pt-16 border-t border-current/10 text-center">
            <div className="font-editorial text-[24px] sm:text-[28px] tracking-[0.3em] font-normal mb-10 opacity-70">
              FIN
            </div>

            <div className="my-10 h-12 flex items-center justify-center opacity-30" aria-hidden="true">
              <span className="w-12 h-[1px] bg-current" />
            </div>

            <div className="space-y-6">
              <p className="font-editorial text-[22px] sm:text-[26px] leading-[1.3] font-normal">
                Ahora puedes conocer a quien escribió esta historia.
              </p>

              {!showAuthorReveal ? (
                <button
                  onClick={handleRevealAuthor}
                  className="font-sans-ui text-[15px] font-medium bg-[#EDEAE2] text-[#131211] hover:bg-[#E34A32] hover:text-[#EDEAE2] transition-colors duration-200 min-h-[50px] px-8 py-3.5 inline-flex items-center justify-center gap-2 rounded-[8px] cursor-pointer shadow-sm"
                >
                  <span>Conocer al autor</span>
                  <span aria-hidden="true">→</span>
                </button>
              ) : null}
            </div>
          </div>

          {showAuthorReveal && (
            <div ref={authorRevealRef} className="animate-in fade-in slide-in-from-bottom-6 duration-500">
              <AuthorReveal />
              <FeedbackSection storyId={story.id} />
              <NextStorySection />
            </div>
          )}
        </article>
      </div>
    </div>
  );
};
