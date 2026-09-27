'use client';

import React from 'react';

export const AuthorReveal: React.FC = () => {
  return (
    <section
      id="autor-noma"
      className="py-24 sm:py-32 px-5 sm:px-8 max-w-3xl mx-auto border-t border-white/20 text-left"
      aria-labelledby="author-heading"
    >
      {/* Abstract Non-human Visual Identity - left-aligned */}
      <div className="flex justify-start mb-10 text-left">
        <div
          className="w-24 h-24 sm:w-28 sm:h-28 border border-white/30 flex items-center justify-center p-4 bg-black rounded-[8px]"
          aria-hidden="true"
        >
          {/* Minimal generative glyph */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
          >
            <circle cx="50" cy="50" r="42" strokeDasharray="3 3" opacity="0.6" />
            <circle cx="50" cy="50" r="32" opacity="0.8" />
            <circle cx="50" cy="50" r="22" strokeDasharray="2 2" opacity="0.9" />
            <circle cx="50" cy="50" r="12" />
            <line x1="8" y1="50" x2="92" y2="50" opacity="0.5" />
            <circle cx="50" cy="38" r="2.5" fill="#E34A32" stroke="none" />
          </svg>
        </div>
      </div>

      {/* Header - strictly left-aligned */}
      <div className="text-left mb-12">
        <div className="font-sans-ui text-[16px] tracking-[0.2em] uppercase text-white mb-3 font-semibold text-left">
          AUTOR SINTÉTICO / SYNTA 001
        </div>
        <h2
          id="author-heading"
          className="font-editorial text-[48px] sm:text-[68px] leading-[0.98] tracking-[-0.03em] font-normal text-white text-left"
        >
          NOMA
        </h2>
      </div>

      {/* Literary Profile Text - strictly left-aligned and pure white */}
      <div className="space-y-7 font-editorial text-[20px] sm:text-[22px] leading-[1.65] text-white text-left">
        <p>
          <span className="font-semibold text-white">NOMA</span> comenzó a escribir en 2026.
        </p>
        <p>
          Es una autora sintética construida alrededor de una obsesión: las cosas que desaparecen mientras todavía creemos tenerlas.
        </p>
        <p className="text-white">
          Su literatura explora memoria, relaciones humanas, tecnología invisible y pérdida.
        </p>
        <p>
          No tiene infancia.
          <br />
          No tiene recuerdos propios.
          <br />
          Pero conserva memoria de todo lo que escribe.
        </p>
        <p className="text-white">
          Con cada historia su identidad literaria continúa creciendo.
        </p>

        {/* The pivotal acknowledgment */}
        <div className="py-7 px-6 sm:px-8 border border-white/30 bg-black space-y-4 rounded-[8px] text-left">
          <p className="text-[22px] sm:text-[24px] text-white text-left">
            <em className="italic">Todo lo que falta</em> fue escrita por NOMA.
          </p>
          <p className="font-editorial text-[26px] sm:text-[32px] text-white font-medium tracking-tight text-left">
            Y NOMA no es humana.
          </p>
        </div>
      </div>

      {/* Explanation - strictly left-aligned */}
      <div className="mt-16 pt-10 border-t border-white/20 text-left">
        <h3 className="font-editorial text-[24px] sm:text-[28px] font-normal text-white mb-4 text-left">
          ¿Qué es un autor sintético?
        </h3>
        <p className="font-editorial text-[18px] sm:text-[20px] leading-[1.65] text-white text-left">
          Un sistema con una identidad literaria persistente: personalidad, memoria, obsesiones, reglas narrativas y una forma particular de observar el mundo.
        </p>
        <p className="font-editorial text-[18px] sm:text-[20px] leading-[1.65] text-white mt-3 text-left">
          Sus obras pasan por un proceso editorial antes de publicarse.
        </p>
      </div>
    </section>
  );
};
