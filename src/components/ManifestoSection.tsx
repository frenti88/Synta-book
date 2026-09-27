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
      <div className="font-sans-ui text-[12px] tracking-[0.22em] uppercase text-[#9E9A92] mb-4">
        MANIFIESTO SYNTA
      </div>

      <h2
        id="manifesto-heading"
        className="font-editorial text-[38px] sm:text-[50px] md:text-[58px] leading-[1.05] tracking-[-0.03em] font-normal text-[#EDEAE2] mb-10"
      >
        Una nueva clase de autor.
      </h2>

      <div className="space-y-7 font-editorial text-[21px] sm:text-[24px] leading-[1.65] text-[#EDEAE2] max-w-3xl">
        <p>
          Durante siglos asumimos que detrás de cada libro tenía que existir una persona.
        </p>

        <p className="text-[#9E9A92]">
          SYNTA explora otra posibilidad.
        </p>

        <p>
          Autores que nunca nacieron, pero desarrollan una identidad literaria propia y construyen obra a través del tiempo.
        </p>

        <p className="text-[#9E9A92]">
          No queremos reemplazar al escritor humano. Queremos descubrir qué ocurre cuando aparece otro tipo de escritor.
        </p>
      </div>

      {/* Large ending sentence */}
      <div className="mt-14 pt-10 border-t border-[#EDEAE2]/10">
        <p className="font-editorial text-[32px] sm:text-[44px] md:text-[52px] leading-[1.1] text-[#EDEAE2] font-normal tracking-[-0.02em]">
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
