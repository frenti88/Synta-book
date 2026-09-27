'use client';

import React from 'react';

export const FutureSection: React.FC = () => {
  return (
    <section
      id="lo-que-viene"
      className="py-24 sm:py-32 px-5 sm:px-8 max-w-6xl mx-auto border-t border-[#EDEAE2]/10"
      aria-labelledby="future-heading"
    >
      {/* Editorial Headline */}
      <div className="mb-16 sm:mb-20">
        <div className="font-sans-ui text-[12px] tracking-[0.22em] uppercase text-[#9E9A92] mb-3">
          PANORAMA EDITORIAL
        </div>
        <h2
          id="future-heading"
          className="font-editorial text-[42px] sm:text-[54px] md:text-[64px] leading-[1.02] tracking-[-0.03em] font-normal text-[#EDEAE2]"
        >
          Esto apenas comienza.
        </h2>
      </div>

      {/* 3 Large Typographic Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Block 1: Nuevos autores */}
        <div className="border border-[#EDEAE2]/10 bg-[#181716]/40 p-8 sm:p-9 rounded-[8px] flex flex-col justify-between hover:border-[#EDEAE2]/20 transition-all duration-300">
          <div>
            <div className="font-sans-ui text-[11px] font-mono tracking-widest text-[#6B6862] mb-5 flex items-center justify-between">
              <span>01 / VOCES</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E34A32]/60" />
            </div>
            <h3 className="font-editorial text-[26px] sm:text-[30px] leading-[1.15] font-normal text-[#EDEAE2] mb-4">
              Nuevos autores
            </h3>
            <p className="font-editorial text-[17px] sm:text-[18px] leading-[1.65] text-[#9E9A92]">
              Identidades literarias distintas. Cada autor tendrá su propia personalidad, memoria, obsesiones y forma de escribir.
            </p>
          </div>
        </div>

        {/* Block 2: Nuevas historias */}
        <div className="border border-[#EDEAE2]/10 bg-[#181716]/40 p-8 sm:p-9 rounded-[8px] flex flex-col justify-between hover:border-[#EDEAE2]/20 transition-all duration-300">
          <div>
            <div className="font-sans-ui text-[11px] font-mono tracking-widest text-[#6B6862] mb-5 flex items-center justify-between">
              <span>02 / GÉNEROS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E34A32]/60" />
            </div>
            <h3 className="font-editorial text-[26px] sm:text-[30px] leading-[1.15] font-normal text-[#EDEAE2] mb-4">
              Nuevas historias
            </h3>
            <p className="font-editorial text-[17px] sm:text-[18px] leading-[1.65] text-[#9E9A92]">
              Ficción, misterio, romance, terror, ensayo y formas que todavía no tienen nombre.
            </p>
          </div>
        </div>

        {/* Block 3: Nuevas formas de leer */}
        <div className="border border-[#EDEAE2]/10 bg-[#181716]/40 p-8 sm:p-9 rounded-[8px] flex flex-col justify-between hover:border-[#EDEAE2]/20 transition-all duration-300">
          <div>
            <div className="font-sans-ui text-[11px] font-mono tracking-widest text-[#6B6862] mb-5 flex items-center justify-between">
              <span>03 / FORMATOS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E34A32]/60" />
            </div>
            <h3 className="font-editorial text-[26px] sm:text-[30px] leading-[1.15] font-normal text-[#EDEAE2] mb-4">
              Nuevas formas de leer
            </h3>
            <p className="font-editorial text-[17px] sm:text-[18px] leading-[1.65] text-[#9E9A92]">
              Texto primero. Después voz, audio y ediciones físicas de archivo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
