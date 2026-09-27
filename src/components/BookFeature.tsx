'use client';

import React from 'react';
import { BookCover } from './BookCover';
import { trackEvent } from '@/lib/analytics';

interface BookFeatureProps {
  onUnlockClick: () => void;
  isUnlocked: boolean;
  hasStartedReading: boolean;
}

export const BookFeature: React.FC<BookFeatureProps> = ({
  onUnlockClick,
  isUnlocked,
  hasStartedReading,
}) => {
  const handleClick = () => {
    trackEvent('book_unlock_click', {
      source: 'book_feature_block',
      is_unlocked: isUnlocked,
    });
    onUnlockClick();
  };

  const buttonText = isUnlocked
    ? hasStartedReading
      ? 'Continuar leyendo'
      : 'Entrar en la historia'
    : 'Entrar en la historia';

  return (
    <section
      id="primer-libro"
      className="py-24 sm:py-36 px-5 sm:px-8 border-y border-white/20 bg-black relative overflow-hidden"
      aria-labelledby="book-feature-title"
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
        {/* Cover presentation as inaugural artifact - left-aligned on mobile */}
        <div className="md:col-span-5 flex justify-start md:justify-center text-left">
          <BookCover size="feature" onClick={handleClick} />
        </div>

        {/* Book Details - strictly left-aligned */}
        <div className="md:col-span-7 flex flex-col justify-center text-left">
          {/* Monumental Editorial Number */}
          <div className="font-editorial text-[64px] sm:text-[84px] leading-none font-normal text-white/20 select-none -mb-3 tracking-tighter text-left">
            001
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2.5 text-[16px] font-sans-ui tracking-wide text-white mb-3 text-left">
            <span className="font-semibold text-white">SYNTA 001</span>
            <span className="opacity-60">·</span>
            <span>NOMA</span>
            <span className="opacity-60">·</span>
            <span>38 min</span>
            <span className="opacity-60">·</span>
            <span>Ficción especulativa íntima</span>
          </div>

          {/* Book Title */}
          <h2
            id="book-feature-title"
            className="font-editorial text-[36px] sm:text-[48px] md:text-[54px] leading-[1.08] font-normal tracking-[-0.025em] text-white mb-5 text-left"
          >
            Todo lo que falta
          </h2>

          {/* Synopsis formatted with poetic cadence */}
          <div className="space-y-3 font-editorial text-[19px] sm:text-[21px] leading-[1.6] text-white mb-6 font-normal max-w-xl text-left">
            <p>
              Primero desapareció una fotografía.
              <br />
              Después una taza.
              <br />
              Después un nombre.
            </p>
            <p className="text-white">
              Cuando Clara empezó a escribir todo lo que faltaba, encontró en su lista algo que no recordaba haber perdido.
            </p>
          </div>

          {/* Themes tag list */}
          <div className="flex flex-wrap items-center gap-2 text-[16px] font-sans-ui text-white mb-8 text-left">
            <span className="font-semibold text-white">Temas:</span>
            <span>ausencia</span>
            <span>·</span>
            <span>memoria</span>
            <span>·</span>
            <span>vínculos</span>
            <span>·</span>
            <span>pérdida</span>
            <span>·</span>
            <span>percepción</span>
            <span>·</span>
            <span>intimidad</span>
          </div>

          {/* Action & Microcopy */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-left">
            <button
              onClick={handleClick}
              className="font-sans-ui text-[16px] font-semibold bg-white text-black hover:bg-[#E34A32] hover:text-white transition-colors duration-200 min-h-[52px] px-8 py-3.5 inline-flex items-center justify-center gap-2.5 rounded-[8px] cursor-pointer shadow-sm"
            >
              <span>{buttonText}</span>
              <span aria-hidden="true" className="text-[16px] font-sans">
                →
              </span>
            </button>

            <span className="font-sans-ui text-[16px] text-white tracking-wide sm:ml-2">
              Primera obra publicada por SYNTA · 2026
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
