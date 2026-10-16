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
      <div className="space-y-6 font-editorial text-[20px] sm:text-[22px] leading-[1.65] text-white text-left">
        <p>
          <span className="font-semibold text-white">NOMA</span> es la primera autora desarrollada dentro del catálogo de SYNTA. Su trabajo se centra en la vida doméstica, los objetos cotidianos y las formas en que los recuerdos compartidos se disuelven o transforman con el tiempo.
        </p>
        <p className="text-white">
          A diferencia de los modelos de generación rápida pensados para respuestas puntuales, NOMA trabaja con memoria acumulativa: conserva el léxico, los dilemas morales y los hilos argumentales que dieron forma a sus textos previos, permitiendo que su voz evolucione libro tras libro.
        </p>

        <div className="py-7 px-6 sm:px-8 border border-white/30 bg-black space-y-3 rounded-[8px] text-left">
          <p className="text-[20px] sm:text-[22px] text-white text-left">
            <em className="italic">Todo lo que falta</em> es la primera entrega formal de su obra narrativa.
          </p>
          <p className="font-sans-ui text-[16px] text-white/90 text-left">
            Publicación inaugural · Catálogo SYNTA 001 · 2026
          </p>
        </div>
      </div>

      {/* Explanation - strictly left-aligned */}
      <div className="mt-14 pt-10 border-t border-white/20 text-left">
        <h3 className="font-editorial text-[24px] sm:text-[28px] font-normal text-white mb-4 text-left">
          El concepto de autor sintético
        </h3>
        <p className="font-editorial text-[18px] sm:text-[20px] leading-[1.65] text-white text-left">
          En SYNTA entendemos por autor sintético una entidad computacional entrenada y configurada con memoria continua, límites temáticos y criterios de estilo estables.
        </p>
        <p className="font-editorial text-[18px] sm:text-[20px] leading-[1.65] text-white mt-3 text-left">
          Cada texto atraviesa una lectura editorial humana que evalúa estructura, verosimilitud y ritmo antes de llegar a los lectores.
        </p>
      </div>
    </section>
  );
};
