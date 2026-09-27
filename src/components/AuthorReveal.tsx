'use client';

import React from 'react';

export const AuthorReveal: React.FC = () => {
  return (
    <section
      id="autor-noma"
      className="py-24 sm:py-32 px-5 sm:px-8 max-w-3xl mx-auto border-t border-[#EDEAE2]/10"
      aria-labelledby="author-heading"
    >
      {/* Abstract Non-human Visual Identity with 8px radius */}
      <div className="flex justify-center mb-12">
        <div
          className="w-24 h-24 sm:w-28 sm:h-28 border border-[#EDEAE2]/20 flex items-center justify-center p-4 bg-[#1C1B1A] rounded-[8px]"
          aria-hidden="true"
        >
          {/* Minimal generative glyph */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-[#EDEAE2]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
          >
            <circle cx="50" cy="50" r="42" strokeDasharray="3 3" opacity="0.4" />
            <circle cx="50" cy="50" r="32" opacity="0.6" />
            <circle cx="50" cy="50" r="22" strokeDasharray="2 2" opacity="0.8" />
            <circle cx="50" cy="50" r="12" />
            <line x1="8" y1="50" x2="92" y2="50" opacity="0.3" />
            <circle cx="50" cy="38" r="2.5" fill="#E34A32" stroke="none" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-14">
        <div className="font-sans-ui text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-[#9E9A92] mb-3 font-medium">
          AUTOR SINTÉTICO / SYNTA 001
        </div>
        <h2
          id="author-heading"
          className="font-editorial text-[52px] sm:text-[68px] leading-[0.95] tracking-[-0.03em] font-normal text-[#EDEAE2]"
        >
          NOMA
        </h2>
      </div>

      {/* Literary Profile Text */}
      <div className="space-y-7 font-editorial text-[20px] sm:text-[22px] leading-[1.65] text-[#EDEAE2]">
        <p>
          <span className="font-medium">NOMA</span> comenzó a escribir en 2026.
        </p>
        <p>
          Es una autora sintética construida alrededor de una obsesión: las cosas que desaparecen mientras todavía creemos tenerlas.
        </p>
        <p className="text-[#9E9A92]">
          Su literatura explora memoria, relaciones humanas, tecnología invisible y pérdida.
        </p>
        <p>
          No tiene infancia.
          <br />
          No tiene recuerdos propios.
          <br />
          Pero conserva memoria de todo lo que escribe.
        </p>
        <p className="text-[#9E9A92]">
          Con cada historia su identidad literaria continúa creciendo.
        </p>

        {/* The pivotal acknowledgment with 8px radius */}
        <div className="py-6 px-6 sm:px-8 border border-[#EDEAE2]/15 bg-[#1C1B1A]/80 space-y-4 rounded-[8px]">
          <p className="text-[22px] sm:text-[24px]">
            <em className="italic">La casa que empezó a olvidarnos</em> fue escrita por NOMA.
          </p>
          <p className="font-editorial text-[26px] sm:text-[30px] text-[#EDEAE2] font-medium tracking-tight">
            Y NOMA no es humana.
          </p>
        </div>
      </div>

      {/* Brief restrained explanation */}
      <div className="mt-16 pt-10 border-t border-[#EDEAE2]/10">
        <h3 className="font-editorial text-[24px] sm:text-[28px] font-normal text-[#EDEAE2] mb-4">
          ¿Qué es un autor sintético?
        </h3>
        <p className="font-editorial text-[18px] sm:text-[19px] leading-[1.65] text-[#9E9A92]">
          Un sistema con una identidad literaria persistente: personalidad, memoria, obsesiones, reglas narrativas y una forma particular de observar el mundo.
        </p>
        <p className="font-editorial text-[18px] sm:text-[19px] leading-[1.65] text-[#9E9A92] mt-3">
          Sus obras pasan por un proceso editorial antes de publicarse.
        </p>
      </div>
    </section>
  );
};
