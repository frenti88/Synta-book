'use client';

import React from 'react';

export const AuthorsArchiveSection: React.FC = () => {
  return (
    <section
      id="autores"
      className="py-24 sm:py-36 px-5 sm:px-8 max-w-5xl mx-auto border-t border-[#EDEAE2]/10"
      aria-labelledby="authors-heading"
    >
      {/* Header */}
      <div className="mb-14 sm:mb-18 text-left max-w-3xl">
        <div className="font-sans-ui text-[12px] tracking-[0.24em] uppercase text-[#9E9A92] mb-3 font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E34A32]" />
          ARCHIVO DE AUTORES
        </div>
        <h2
          id="authors-heading"
          className="font-editorial text-[38px] sm:text-[50px] md:text-[62px] leading-[1.05] tracking-[-0.03em] font-normal text-[#EDEAE2] mb-8"
        >
          Autores que nunca nacieron.
        </h2>

        <div className="space-y-4 font-editorial text-[20px] sm:text-[22px] leading-[1.6] text-[#9E9A92]">
          <p>
            SYNTA no publica textos anónimos.
            <br />
            <span className="text-[#EDEAE2]">Publica identidades literarias.</span>
          </p>
          <p>
            Cada autor sintético posee memoria, obsesiones, un tono y una forma particular de escribir.
            <br />
            Algunos ya existen. Otros todavía no.
          </p>
        </div>
      </div>

      {/* Author cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
        {/* NOMA */}
        <div className="border border-[#EDEAE2]/15 bg-[#181716]/60 p-8 rounded-[8px] flex flex-col justify-between hover:border-[#EDEAE2]/30 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between font-sans-ui text-[11px] font-mono tracking-wider text-[#9E9A92] mb-6">
              <span className="text-[#EDEAE2] font-semibold">SYNTA 001</span>
              <span>Activo desde 2026</span>
            </div>

            <h3 className="font-editorial text-[32px] font-normal text-[#EDEAE2] mb-2 tracking-tight">
              NOMA
            </h3>
            <p className="font-editorial italic text-[16px] text-[#9E9A92] mb-6">
              Memoria · ausencia · relaciones
            </p>
          </div>

          <div className="pt-4 border-t border-[#EDEAE2]/10 flex items-center justify-between font-sans-ui text-[12px]">
            <span className="text-[#6B6862]">Producción</span>
            <span className="text-[#EDEAE2] font-mono">01 obra publicada</span>
          </div>
        </div>

        {/* Upcoming Author 1 */}
        <div className="border border-[#EDEAE2]/10 bg-[#181716]/20 p-8 rounded-[8px] flex flex-col justify-between opacity-60">
          <div>
            <div className="flex items-center justify-between font-sans-ui text-[11px] font-mono tracking-wider text-[#6B6862] mb-6">
              <span>SYNTA 002</span>
              <span>En definición</span>
            </div>

            <div className="font-editorial text-[28px] font-normal text-[#9E9A92] mb-2 tracking-widest select-none">
              — — — —
            </div>
            <p className="font-editorial italic text-[16px] text-[#6B6862] mb-6">
              Misterio · lenguaje · sombra
            </p>
          </div>

          <div className="pt-4 border-t border-[#EDEAE2]/10 flex items-center justify-between font-sans-ui text-[12px]">
            <span className="text-[#6B6862]">Estado</span>
            <span className="text-[#9E9A92] font-mono">Próximamente</span>
          </div>
        </div>

        {/* Upcoming Author 2 */}
        <div className="border border-[#EDEAE2]/10 bg-[#181716]/20 p-8 rounded-[8px] flex flex-col justify-between opacity-60">
          <div>
            <div className="flex items-center justify-between font-sans-ui text-[11px] font-mono tracking-wider text-[#6B6862] mb-6">
              <span>SYNTA 003</span>
              <span>En génesis</span>
            </div>

            <div className="font-editorial text-[28px] font-normal text-[#9E9A92] mb-2 tracking-widest select-none">
              — — — —
            </div>
            <p className="font-editorial italic text-[16px] text-[#6B6862] mb-6">
              Ensayo · tiempo · percepción
            </p>
          </div>

          <div className="pt-4 border-t border-[#EDEAE2]/10 flex items-center justify-between font-sans-ui text-[12px]">
            <span className="text-[#6B6862]">Estado</span>
            <span className="text-[#9E9A92] font-mono">Próximamente</span>
          </div>
        </div>
      </div>

      {/* Mandatory memorable ending phrase */}
      <div className="border-t border-[#EDEAE2]/10 pt-10 text-left sm:text-center">
        <p className="font-editorial text-[26px] sm:text-[34px] leading-tight text-[#EDEAE2] font-normal tracking-[-0.02em] italic">
          «No todos los autores de SYNTA existen todavía.»
        </p>
      </div>
    </section>
  );
};
