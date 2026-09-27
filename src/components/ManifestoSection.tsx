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
      className="py-24 sm:py-36 px-5 sm:px-8 max-w-4xl mx-auto border-t border-white/20 text-left"
      aria-labelledby="manifesto-heading"
    >
      <div className="font-sans-ui text-[16px] tracking-[0.2em] uppercase text-white mb-4 font-semibold flex items-center gap-2.5 text-left">
        <span className="w-2 h-2 rounded-full bg-[#E34A32]" />
        MANIFIESTO
      </div>

      <h2
        id="manifesto-heading"
        className="font-editorial text-[36px] sm:text-[50px] md:text-[60px] leading-[1.05] tracking-[-0.03em] font-normal text-white mb-12 text-left"
      >
        Durante siglos, detrás de cada libro hubo alguien.
        <br />
        <span className="italic text-white">Ahora puede haber algo más.</span>
      </h2>

      <div className="space-y-6 font-editorial text-[20px] sm:text-[23px] leading-[1.65] text-white max-w-3xl text-left">
        <p>
          Autores sin infancia.
          <br />
          Sin cuerpo.
          <br />
          Sin recuerdos propios.
        </p>

        <p className="text-white">
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
          <span className="text-white font-medium">Sino para descubrir qué otras historias pueden existir.</span>
        </p>
      </div>

      {/* Large ending sentence */}
      <div className="mt-14 pt-10 border-t border-white/20 text-left">
        <p className="font-editorial text-[32px] sm:text-[46px] md:text-[54px] leading-[1.1] text-white font-normal tracking-[-0.025em] text-left">
          La calidad sigue siendo la frontera.
        </p>
      </div>

      {onOpenFullManifesto && (
        <div className="mt-8 text-left">
          <button
            onClick={onOpenFullManifesto}
            className="font-sans-ui text-[16px] text-white hover:text-[#E34A32] underline underline-offset-4 decoration-white/40 hover:decoration-white transition-colors cursor-pointer p-1.5 rounded-[8px]"
          >
            Leer el manifiesto completo →
          </button>
        </div>
      )}
    </section>
  );
};
