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
          ? 'bg-[#131211]/90 backdrop-blur-md border-b border-[#EDEAE2]/10 shadow-[0_2px_16px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
      style={{ height: '70px' }}
    >
      <div className="max-w-6xl mx-auto h-full px-5 sm:px-8 flex items-center justify-between">
        {/* Wordmark and baseline emotional phrase */}
        <div className="flex flex-col justify-center">
          <a
            href="#"
            className="group inline-flex items-center gap-2 focus:outline-none rounded-[8px]"
            aria-label="SYNTA - Historias de otro origen"
          >
            <span className="font-editorial text-2xl sm:text-[27px] font-semibold tracking-[-0.04em] text-[#EDEAE2] leading-none">
              SYNTA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E34A32] transform transition-transform group-hover:scale-125" />
          </a>
          <span className="font-editorial italic text-[11px] sm:text-[12px] text-[#9E9A92] tracking-wide mt-0.5 select-none">
            Historias de otro origen.
          </span>
        </div>

        {/* Right action button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleAction}
            className="font-sans-ui text-[12px] sm:text-[13px] font-medium transition-all duration-200 min-h-[38px] sm:min-h-[42px] px-4 sm:px-5 flex items-center justify-center rounded-[8px] focus:ring-2 focus:ring-[#E34A32] cursor-pointer bg-[#EDEAE2] text-[#131211] hover:bg-[#E34A32] hover:text-[#EDEAE2] shadow-sm tracking-wide"
          >
            {actionText}
          </button>
        </div>
      </div>
    </header>
  );
};
