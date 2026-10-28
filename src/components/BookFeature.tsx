'use client';

import React from 'react';
import { BookCover } from './BookCover';
import { trackEvent } from '@/lib/analytics';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

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
  const { openPlayer } = useAudioPlayer();

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
      : 'Leer esta novela'
    : 'Leer esta novela';

  return (
    <section
      id="primer-libro"
      className="py-28 sm:py-36 md:py-44 px-5 sm:px-8 border-y border-white/20 bg-black relative overflow-hidden"
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
            <span>Novela breve</span>
            <span className="opacity-60">·</span>
            <span>38 minutos</span>
          </div>

          {/* Book Title */}
          <h2
            id="book-feature-title"
            className="font-editorial text-[36px] sm:text-[48px] md:text-[54px] leading-[1.08] font-normal tracking-[-0.025em] text-white mb-5 text-left"
          >
            Todo lo que falta
          </h2>

          {/* Synopsis formatted as natural human prose */}
          <div className="space-y-4 font-editorial text-[19px] sm:text-[21px] leading-[1.6] text-white mb-8 font-normal max-w-xl text-left">
            <p>
              Una mañana de otoño, una fotografía desaparece de la pared del recibidor sin dejar rastro en el marco. Dos días después falta una taza de café, y poco después desaparecen las anotaciones compartidas en las libretas de la casa.
            </p>
            <p>
              Cuando Clara empieza a registrar los objetos que ya no están, descubre que el propio espacio en el que vive está retirando las huellas de su convivencia con Mateo.
            </p>
          </div>

          {/* Action & Microcopy */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-left">
            <button
              onClick={handleClick}
              className="group font-sans-ui text-[16px] font-semibold bg-white text-black hover:bg-[#E34A32] hover:text-white active:scale-[0.98] transition-all duration-200 min-h-[52px] px-8 py-3.5 inline-flex items-center justify-center gap-2.5 rounded-[8px] cursor-pointer shadow-sm"
            >
              <span>{buttonText}</span>
              <span aria-hidden="true" className="text-[16px] font-sans transform group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </button>

            <button
              onClick={() => {
                trackEvent('audio_bookfeature_click');
                openPlayer();
              }}
              aria-label="Escuchar en la voz de NOMA"
              className="group font-sans-ui text-[16px] font-medium border border-white/25 hover:border-white text-white hover:bg-white/10 active:scale-[0.98] transition-all duration-200 min-h-[52px] px-6 py-3.5 inline-flex items-center justify-center gap-2.5 rounded-[8px] cursor-pointer"
            >
              <svg className="w-4 h-4 text-[#E34A32] transform group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Escuchar en la voz de NOMA</span>
            </button>

            <span className="font-sans-ui text-[16px] text-white tracking-wide sm:ml-2">
              Edición inaugural · 2026
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
