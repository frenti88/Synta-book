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
  onOpenCommunity,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 380);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAction = () => {
    trackEvent(
      isUnlocked ? 'hero_read_click' : 'book_unlock_click',
      { location: 'header' }
    );
    if (scrolled) {
      onOpenUnlockOrRead();
    } else if (onOpenCommunity) {
      onOpenCommunity();
    } else {
      onOpenUnlockOrRead();
    }
  };

  const actionText = scrolled
    ? hasStartedReading
      ? 'Continuar leyendo'
      : 'Leer la primera historia'
    : 'Ser de los primeros';

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#131211]/90 backdrop-blur-md border-b border-[#EDEAE2]/10 shadow-[0_2px_16px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
      style={{ height: '68px' }}
    >
      <div className="max-w-6xl mx-auto h-full px-5 sm:px-8 flex items-center justify-between">
        {/* Wordmark */}
        <a
          href="#"
          className="group inline-flex items-center gap-2 focus:outline-none rounded-[8px]"
          aria-label="SYNTA Editorial - Inicio"
        >
          <span className="font-editorial text-2xl sm:text-[27px] font-semibold tracking-[-0.04em] text-[#EDEAE2] transition-colors">
            SYNTA
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E34A32] transform transition-transform group-hover:scale-125" />
        </a>

        {/* Right action button with 8px radius */}
        <button
          onClick={handleAction}
          className={`font-sans-ui text-[13px] sm:text-[14px] font-medium transition-all duration-200 min-h-[44px] px-3.5 sm:px-5 flex items-center justify-center rounded-[8px] focus:ring-2 focus:ring-[#E34A32] cursor-pointer ${
            scrolled
              ? 'bg-[#EDEAE2] text-[#131211] hover:bg-[#E34A32] hover:text-[#EDEAE2] shadow-sm'
              : 'text-[#EDEAE2] hover:text-[#E34A32] border border-transparent hover:border-[#EDEAE2]/10'
          }`}
        >
          {actionText}
        </button>
      </div>
    </header>
  );
};
