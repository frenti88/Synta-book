'use client';

import React from 'react';

export const BreathingQuote: React.FC = () => {
  return (
    <section
      className="py-16 sm:py-24 md:py-28 px-5 sm:px-8 md:px-12 max-w-3xl mx-auto text-left"
      aria-label="Pausa editorial"
    >
      <div className="space-y-6 sm:space-y-8 text-left">
        <div className="w-12 h-[1px] bg-white/40 ml-0 mr-auto" aria-hidden="true" />

        <h2 className="font-editorial text-[32px] sm:text-[44px] md:text-[54px] leading-[1.15] font-normal text-white tracking-[-0.025em] text-left">
          Una historia se sostiene cuando es capaz de acompañar a quien la lee.
        </h2>

        <div className="space-y-3 font-editorial text-[20px] sm:text-[24px] text-white font-normal leading-relaxed text-left">
          <p>
            Elegimos publicar primero el texto y dejar que cada lector experimente la trama antes de detenerse en las decisiones de diseño del autor.
          </p>
        </div>

        <div className="w-12 h-[1px] bg-white/40 ml-0 mr-auto" aria-hidden="true" />
      </div>
    </section>
  );
};
