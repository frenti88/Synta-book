'use client';

import React, { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/analytics';

interface HeaderProps {
  onOpenUnlockOrRead: () => void;
  isUnlocked: boolean;
  hasStartedReading: boolean;
  onOpenCommunity?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenUnlockOrRead,
  isUnlocked,
  hasStartedReading,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAction = () => {
    trackEvent(
      isUnlocked ? 'hero_read_click' : 'book_unlock_click',
      { location: 'header' }
    );
    onOpenUnlockOrRead();
  };

  const actionText = hasStartedReading
    ? 'Continuar 001'
    : isUnlocked
    ? 'Leer 001'
    : 'Entrar';

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-black/95 backdrop-blur-md border-b border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.8)]'
          : 'bg-transparent'
      }`}
      style={{ minHeight: '74px' }}
    >
      <div className="max-w-6xl mx-auto h-full px-5 sm:px-8 py-3 flex items-center justify-between">
        {/* Wordmark and baseline emotional phrase - strictly left aligned */}
        <div className="flex flex-col justify-center text-left">
          <a
            href="#"
            className="group inline-flex items-center gap-2 focus:outline-none rounded-[8px]"
            aria-label="SYNTA - Historias de otro origen"
          >
            <span className="font-editorial text-2xl sm:text-[28px] font-semibold tracking-[-0.04em] text-white leading-none">
              SYNTA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E34A32] transform transition-transform group-hover:scale-125" />
          </a>
          <span className="font-editorial italic text-[16px] text-white tracking-wide mt-1 select-none">
            Historias de otro origen.
          </span>
        </div>

        {/* Right action button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleAction}
            className="font-sans-ui text-[16px] font-semibold transition-all duration-200 min-h-[46px] px-5 sm:px-6 flex items-center justify-center rounded-[8px] focus:ring-2 focus:ring-[#E34A32] cursor-pointer bg-white text-black hover:bg-[#E34A32] hover:text-white shadow-sm tracking-wide"
          >
            {actionText}
          </button>
        </div>
      </div>
    </header>
  );
};
