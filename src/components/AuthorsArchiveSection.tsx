'use client';

import React from 'react';

export const AuthorsArchiveSection: React.FC = () => {
  return (
    <section
      id="autores"
      className="py-24 sm:py-36 px-5 sm:px-8 max-w-5xl mx-auto border-t border-white/20 text-left"
      aria-labelledby="authors-heading"
    >
      {/* Header */}
      <div className="mb-14 sm:mb-18 text-left max-w-3xl">
        <div className="font-sans-ui text-[16px] tracking-[0.2em] uppercase text-white mb-3 font-semibold flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#E34A32]" />
          ARCHIVO DE AUTORES
        </div>
        <h2
          id="authors-heading"
          className="font-editorial text-[36px] sm:text-[50px] md:text-[62px] leading-[1.05] tracking-[-0.03em] font-normal text-white mb-8 text-left"
        >
          Autores que nunca nacieron.
        </h2>

        <div className="space-y-4 font-editorial text-[20px] sm:text-[22px] leading-[1.6] text-white text-left">
          <p>
            SYNTA no publica textos anónimos.
            <br />
            <span className="text-white font-medium">Publica identidades literarias.</span>
          </p>
          <p>
            Cada autor sintético posee memoria, obsesiones, un tono y una forma particular de escribir.
            <br />
            Algunos ya existen. Otros todavía no.
          </p>
        </div>
      </div>

      {/* Author cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16 text-left">
        {/* NOMA */}
        <div className="border border-white/25 bg-black p-8 rounded-[8px] flex flex-col justify-between hover:border-white/50 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between font-sans-ui text-[16px] font-mono tracking-wider text-white mb-6">
              <span className="text-white font-semibold">SYNTA 001</span>
              <span>Activo 2026</span>
            </div>

            <h3 className="font-editorial text-[34px] font-normal text-white mb-2 tracking-tight text-left">
              NOMA
            </h3>
            <p className="font-editorial italic text-[16px] text-white mb-6 text-left">
              Memoria · ausencia · relaciones
            </p>
          </div>

          <div className="pt-4 border-t border-white/20 flex items-center justify-between font-sans-ui text-[16px]">
            <span className="text-white">Producción</span>
            <span className="text-white font-mono font-medium">01 obra</span>
          </div>
        </div>

        {/* Upcoming Author 1 */}
        <div className="border border-white/20 bg-black p-8 rounded-[8px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-sans-ui text-[16px] font-mono tracking-wider text-white mb-6">
              <span>SYNTA 002</span>
              <span>En definición</span>
            </div>

            <div className="font-editorial text-[28px] font-normal text-white mb-2 tracking-widest select-none text-left">
              — — — —
            </div>
            <p className="font-editorial italic text-[16px] text-white mb-6 text-left">
              Misterio · lenguaje · sombra
            </p>
          </div>

          <div className="pt-4 border-t border-white/20 flex items-center justify-between font-sans-ui text-[16px]">
            <span className="text-white">Estado</span>
            <span className="text-white font-mono">Próximamente</span>
          </div>
        </div>

        {/* Upcoming Author 2 */}
        <div className="border border-white/20 bg-black p-8 rounded-[8px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-sans-ui text-[16px] font-mono tracking-wider text-white mb-6">
              <span>SYNTA 003</span>
              <span>En génesis</span>
            </div>

            <div className="font-editorial text-[28px] font-normal text-white mb-2 tracking-widest select-none text-left">
              — — — —
            </div>
            <p className="font-editorial italic text-[16px] text-white mb-6 text-left">
              Ensayo · tiempo · percepción
            </p>
          </div>

          <div className="pt-4 border-t border-white/20 flex items-center justify-between font-sans-ui text-[16px]">
            <span className="text-white">Estado</span>
            <span className="text-white font-mono">Próximamente</span>
          </div>
        </div>
      </div>

      {/* Mandatory memorable ending phrase - strictly left-aligned */}
      <div className="border-t border-white/20 pt-10 text-left">
        <p className="font-editorial text-[26px] sm:text-[34px] leading-tight text-white font-normal tracking-[-0.02em] italic text-left">
          «No todos los autores de SYNTA existen todavía.»
        </p>
      </div>
    </section>
  );
};
