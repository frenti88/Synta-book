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
    : 'Leer Todo lo que falta';

  return (
    <section
      className="relative min-h-[calc(100vh-74px)] flex items-center justify-center pt-8 pb-16 px-5 sm:px-8 md:px-12 max-w-6xl mx-auto"
      aria-labelledby="hero-heading"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Monumental Typography, strictly left-aligned */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left order-1">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="font-sans-ui text-[16px] tracking-[0.2em] uppercase text-white font-semibold flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#E34A32]" />
              SYNTA / Catálogo 001
            </span>
          </div>

          {/* Headline - Humanized: direct, editorial, unpretentious */}
          <h1
            id="hero-heading"
            className="font-editorial text-[38px] sm:text-[54px] md:text-[72px] lg:text-[84px] xl:text-[90px] leading-[1.02] font-normal tracking-[-0.035em] text-white mb-7 text-left"
          >
            Literatura creada por autores sintéticos.
          </h1>

          {/* Subheadline - Humanized: states the facts clearly without breathless hype */}
          <p className="font-editorial text-[20px] sm:text-[23px] md:text-[25px] leading-[1.45] text-white max-w-xl mb-10 font-normal text-left">
            Publicamos obras de ficción escritas por sistemas con memoria, tono y reglas narrativas propias. Puedes leer nuestra primera novela breve directamente desde aquí.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 mb-8 text-left">
            <button
              onClick={handlePrimaryClick}
              className="font-sans-ui text-[16px] font-semibold bg-white text-black hover:bg-[#E34A32] hover:text-white transition-colors duration-200 min-h-[52px] px-8 py-3.5 inline-flex items-center justify-center gap-2.5 rounded-[8px] shadow-sm cursor-pointer"
            >
              <span>{primaryCtaText}</span>
              <span aria-hidden="true" className="text-[16px] font-sans">
                →
              </span>
            </button>

            <button
              onClick={onDiscoverClick}
              className="font-sans-ui text-[16px] text-white hover:text-[#E34A32] transition-colors duration-200 min-h-[48px] py-2 px-3 text-left underline underline-offset-4 decoration-white/40 hover:decoration-white rounded-[8px] cursor-pointer"
            >
              Conocer el proyecto ↓
            </button>
          </div>

          {/* Microcopy inferior */}
          <div className="font-sans-ui text-[16px] tracking-wide text-white flex flex-wrap items-center gap-2.5 text-left">
            <span>Novela breve</span>
            <span className="opacity-60">·</span>
            <span>38 minutos</span>
            <span className="opacity-60">·</span>
            <span>Acceso abierto</span>
          </div>
        </div>

        {/* Right Column: Inaugural Artifact Cover */}
        <div className="lg:col-span-5 flex justify-start lg:justify-end items-center order-2 mt-4 lg:mt-0">
          <div className="relative text-left">
            <BookCover size="hero" onClick={handlePrimaryClick} />
            <div className="mt-4 text-left">
              <span className="font-sans-ui text-[16px] tracking-[0.16em] uppercase text-white font-medium">
                Abrir la lectura
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
