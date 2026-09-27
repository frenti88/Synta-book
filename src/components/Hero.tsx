'use client';

import React from 'react';
import { BookCover } from './BookCover';
import { trackEvent } from '@/lib/analytics';

interface HeroProps {
  onStartReading: () => void;
  onDiscoverClick: () => void;
  isUnlocked: boolean;
  hasStartedReading: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onStartReading,
  onDiscoverClick,
  isUnlocked,
  hasStartedReading,
}) => {
  const handlePrimaryClick = () => {
    trackEvent('hero_read_click', {
      is_unlocked: isUnlocked,
      has_started: hasStartedReading,
    });
    onStartReading();
  };

  const primaryCtaText = hasStartedReading
    ? 'Continuar leyendo'
    : 'Leer la primera historia';

  return (
    <section
      className="relative min-h-[calc(100vh-68px)] flex items-center justify-center pt-8 pb-16 px-5 sm:px-8 md:px-12 max-w-6xl mx-auto"
      aria-labelledby="hero-heading"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Editorial Typography */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left order-1">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="font-sans-ui text-[12px] sm:text-[13px] tracking-[0.24em] uppercase text-[#9E9A92] font-medium">
              SYNTA / LITERATURA SINTÉTICA
            </span>
          </div>

          {/* Headline */}
          <h1
            id="hero-heading"
            className="font-editorial text-[46px] sm:text-[56px] md:text-[76px] lg:text-[90px] xl:text-[98px] leading-[0.98] font-normal tracking-[-0.03em] text-[#EDEAE2] mb-7"
          >
            ¿Qué hace real a una historia?
          </h1>

          {/* Supporting Copy */}
          <p className="font-editorial text-[21px] sm:text-[24px] md:text-[26px] leading-[1.35] text-[#9E9A92] max-w-xl mb-10 font-normal">
            Lee nuestra primera obra antes de conocer a su autor.
          </p>

          {/* Action Row with 8px radius */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 mb-8">
            <button
              onClick={handlePrimaryClick}
              className="font-sans-ui text-[15px] sm:text-[16px] font-medium bg-[#EDEAE2] text-[#131211] hover:bg-[#E34A32] hover:text-[#EDEAE2] transition-colors duration-200 min-h-[50px] px-8 py-3.5 inline-flex items-center justify-center gap-2 rounded-[8px] shadow-sm cursor-pointer"
            >
              <span>{primaryCtaText}</span>
              <span aria-hidden="true" className="text-[13px] font-sans">
                →
              </span>
            </button>

            <button
              onClick={onDiscoverClick}
              className="font-sans-ui text-[14px] text-[#9E9A92] hover:text-[#EDEAE2] transition-colors duration-200 min-h-[44px] py-2 px-3 text-left sm:text-center underline underline-offset-4 decoration-[#EDEAE2]/20 hover:decoration-[#EDEAE2] rounded-[8px] cursor-pointer"
            >
              Descubrir SYNTA ↓
            </button>
          </div>

          {/* Subtext info */}
          <div className="font-sans-ui text-[12px] sm:text-[13px] tracking-wide text-[#6B6862] flex flex-wrap items-center gap-2">
            <span>Acceso anticipado</span>
            <span className="opacity-40">·</span>
            <span>Lectura breve</span>
            <span className="opacity-40">·</span>
            <span>Sin registro complejo</span>
          </div>
        </div>

        {/* Right Column: Book Cover Presentation */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end items-center order-2 mt-4 lg:mt-0">
          <div className="relative transform hover:translate-y-[-4px] transition-transform duration-300 ease-out rounded-[8px]">
            <BookCover size="hero" onClick={handlePrimaryClick} />
            <div className="mt-4 text-center">
              <span className="font-sans-ui text-[11px] uppercase tracking-[0.2em] text-[#6B6862]">
                Toca para abrir la obra
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
