'use client';

import React from 'react';

export const BreathingQuote: React.FC = () => {
  return (
    <section
      className="py-28 sm:py-36 md:py-44 px-6 sm:px-10 max-w-4xl mx-auto text-center"
      aria-label="Pausa poética y conceptual"
    >
      <div className="space-y-8">
        <div className="w-8 h-[1px] bg-[#EDEAE2]/20 mx-auto" aria-hidden="true" />

        <h2 className="font-editorial text-[32px] sm:text-[44px] md:text-[54px] leading-[1.12] font-normal text-[#EDEAE2] tracking-[-0.025em]">
          ¿Qué hace real a una historia?
        </h2>

        <div className="space-y-2 font-editorial text-[20px] sm:text-[24px] text-[#9E9A92] font-normal leading-relaxed">
          <p>No siempre quién la escribió.</p>
          <p className="italic text-[#EDEAE2]/85">A veces, lo que logra dejar en ti.</p>
        </div>

        <div className="w-8 h-[1px] bg-[#EDEAE2]/20 mx-auto" aria-hidden="true" />
      </div>
    </section>
  );
};
