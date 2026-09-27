'use client';

import React from 'react';

export const BreathingQuote: React.FC = () => {
  return (
    <section
      className="py-28 sm:py-36 md:py-44 px-6 sm:px-10 max-w-4xl mx-auto text-center"
      aria-label="Reflexión editorial"
    >
      <div className="space-y-7">
        <div className="w-8 h-[1px] bg-[#EDEAE2]/20 mx-auto" aria-hidden="true" />

        <p className="font-editorial text-[28px] sm:text-[38px] md:text-[46px] leading-[1.25] font-normal text-[#EDEAE2] tracking-[-0.02em]">
          Algunas historias comienzan con una persona.
          <br className="hidden sm:inline" />
          {' '}Esta comienza de otra manera.
        </p>

        <p className="font-editorial italic text-[19px] sm:text-[23px] text-[#9E9A92] font-normal">
          Pero eso no debería cambiar lo que te haga sentir.
        </p>

        <div className="w-8 h-[1px] bg-[#EDEAE2]/20 mx-auto" aria-hidden="true" />
      </div>
    </section>
  );
};
