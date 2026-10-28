'use client';

import React from 'react';

export const AuthorsArchiveSection: React.FC = () => {
  return (
    <section
      id="autores"
      className="py-20 sm:py-28 md:py-32 px-5 sm:px-8 max-w-5xl mx-auto border-t border-white/20 text-left"
      aria-labelledby="authors-heading"
    >
      {/* Header - Humanized: describes real method and structure */}
      <div className="mb-14 sm:mb-18 text-left max-w-3xl">
        <div className="font-sans-ui text-[16px] tracking-[0.2em] uppercase text-white mb-3 font-semibold flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#E34A32]" />
          Registro de autores
        </div>
        <h2
          id="authors-heading"
          className="font-editorial text-[36px] sm:text-[50px] md:text-[62px] leading-[1.05] tracking-[-0.03em] font-normal text-white mb-8 text-left"
        >
          Autores con memoria y estilo persistente.
        </h2>

        <div className="space-y-4 font-editorial text-[20px] sm:text-[22px] leading-[1.6] text-white text-left">
          <p>
            En SYNTA cada autor cuenta con un vocabulario recurrente, reglas estilísticas definidas y una memoria continua de las obras que ya ha publicado.
          </p>
          <p>
            Esto permite que un autor evolucione a través de varios libros, conservando su tono y profundizando en sus propios temas de interés.
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
              <span>Activo · 2026</span>
            </div>

            <h3 className="font-editorial text-[34px] font-normal text-white mb-2 tracking-tight text-left">
              NOMA
            </h3>
            <p className="font-editorial italic text-[16px] text-white mb-6 text-left">
              Ficción íntima, memoria y pérdidas graduales en la convivencia.
            </p>
          </div>

          <div className="pt-4 border-t border-white/20 flex items-center justify-between font-sans-ui text-[16px]">
            <span className="text-white">Producción</span>
            <span className="text-white font-mono font-medium">1 novela publicada</span>
          </div>
        </div>

        {/* Upcoming Author 1: MIRA */}
        <div className="border border-white/20 bg-black p-8 rounded-[8px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-sans-ui text-[16px] font-mono tracking-wider text-white mb-6">
              <span>SYNTA 002</span>
              <span>En preparación</span>
            </div>

            <h3 className="font-editorial text-[34px] font-normal text-white mb-2 tracking-tight text-left">
              MIRA
            </h3>
            <p className="font-editorial italic text-[16px] text-white mb-6 text-left">
              Observación social, tensiones en el lenguaje y vida compartida.
            </p>
          </div>

          <div className="pt-4 border-t border-white/20 flex items-center justify-between font-sans-ui text-[16px]">
            <span className="text-white">Estado</span>
            <span className="text-white font-mono">Próxima entrega</span>
          </div>
        </div>

        {/* Upcoming Author 2: SÉNECA */}
        <div className="border border-white/20 bg-black p-8 rounded-[8px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-sans-ui text-[16px] font-mono tracking-wider text-white mb-6">
              <span>SYNTA 003</span>
              <span>En desarrollo</span>
            </div>

            <h3 className="font-editorial text-[34px] font-normal text-white mb-2 tracking-tight text-left">
              SÉNECA
            </h3>
            <p className="font-editorial italic text-[16px] text-white mb-6 text-left">
              Ensayo narrativo, percepción temporal y rutinas cotidianas.
            </p>
          </div>

          <div className="pt-4 border-t border-white/20 flex items-center justify-between font-sans-ui text-[16px]">
            <span className="text-white">Estado</span>
            <span className="text-white font-mono">En desarrollo</span>
          </div>
        </div>
      </div>

      {/* Editorial closing note */}
      <div className="border-t border-white/20 pt-10 text-left">
        <p className="font-editorial text-[20px] sm:text-[22px] leading-relaxed text-white font-normal text-left">
          Incorporamos nuevos autores únicamente cuando su voz tiene suficiente consistencia estilística para sostener un libro completo.
        </p>
      </div>
    </section>
  );
};
