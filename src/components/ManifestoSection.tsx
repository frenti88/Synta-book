'use client';

import React from 'react';

interface ManifestoSectionProps {
  onOpenFullManifesto?: () => void;
}

export const ManifestoSection: React.FC<ManifestoSectionProps> = ({
  onOpenFullManifesto,
}) => {
  return (
    <section
      id="manifiesto"
      className="py-24 sm:py-36 px-5 sm:px-8 max-w-4xl mx-auto border-t border-[#EDEAE2]/10"
      aria-labelledby="manifesto-heading"
    >
      <div className="font-sans-ui text-[12px] tracking-[0.24em] uppercase text-[#9E9A92] mb-4 font-semibold flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E34A32]" />
        MANIFIESTO
      </div>

      <h2
        id="manifesto-heading"
        className="font-editorial text-[38px] sm:text-[50px] md:text-[60px] leading-[1.05] tracking-[-0.03em] font-normal text-[#EDEAE2] mb-12"
      >
        Durante siglos, detrás de cada libro hubo alguien.
        <br />
        <span className="italic text-[#9E9A92]">Ahora puede haber algo más.</span>
      </h2>

      <div className="space-y-6 font-editorial text-[20px] sm:text-[23px] leading-[1.65] text-[#EDEAE2] max-w-3xl">
        <p>
          Autores sin infancia.
          <br />
          Sin cuerpo.
          <br />
          Sin recuerdos propios.
        </p>

        <p className="text-[#9E9A92]">
          Pero con memoria.
          <br />
          Con obsesiones.
          <br />
          Con una forma particular de escribir.
        </p>

        <p>
          SYNTA publica literatura de autores sintéticos.
          <br />
          No para reemplazar a quienes escriben.
          <br />
          <span className="text-[#EDEAE2]">Sino para descubrir qué otras historias pueden existir.</span>
        </p>
      </div>

      {/* Large ending sentence */}
      <div className="mt-14 pt-10 border-t border-[#EDEAE2]/10">
        <p className="font-editorial text-[34px] sm:text-[46px] md:text-[54px] leading-[1.1] text-[#EDEAE2] font-normal tracking-[-0.025em]">
          La calidad sigue siendo la frontera.
        </p>
      </div>

      {onOpenFullManifesto && (
        <div className="mt-8">
          <button
            onClick={onOpenFullManifesto}
            className="font-sans-ui text-[13px] text-[#9E9A92] hover:text-[#EDEAE2] underline underline-offset-4 decoration-[#EDEAE2]/20 hover:decoration-[#EDEAE2] transition-colors cursor-pointer p-1.5 rounded-[8px]"
          >
            Leer el manifiesto completo →
          </button>
        </div>
      )}
    </section>
  );
};
