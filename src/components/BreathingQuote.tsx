'use client';

import React from 'react';

export const BreathingQuote: React.FC = () => {
  return (
    <section
      className="py-24 sm:py-32 md:py-40 px-5 sm:px-8 md:px-12 max-w-4xl mx-auto text-left"
      aria-label="Pausa poética y conceptual"
    >
      <div className="space-y-8 text-left">
        <div className="w-12 h-[1px] bg-white/40 ml-0 mr-auto" aria-hidden="true" />

        <h2 className="font-editorial text-[32px] sm:text-[44px] md:text-[54px] leading-[1.12] font-normal text-white tracking-[-0.025em] text-left">
          ¿Qué hace real a una historia?
        </h2>

        <div className="space-y-3 font-editorial text-[20px] sm:text-[24px] text-white font-normal leading-relaxed text-left">
          <p>No siempre quién la escribió.</p>
          <p className="italic text-white font-normal">A veces, lo que logra dejar en ti.</p>
        </div>

        <div className="w-12 h-[1px] bg-white/40 ml-0 mr-auto" aria-hidden="true" />
      </div>
    </section>
  );
};
