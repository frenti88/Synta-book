'use client';

import React from 'react';

interface FirstGenerationSectionProps {
  onJoinClick: () => void;
}

export const FirstGenerationSection: React.FC<FirstGenerationSectionProps> = ({
  onJoinClick,
}) => {
  return (
    <section
      id="primera-generacion"
      className="py-24 sm:py-36 px-5 sm:px-8 max-w-4xl mx-auto border-t border-[#EDEAE2]/10"
      aria-labelledby="first-generation-heading"
    >
      <div className="text-left sm:text-center max-w-3xl mx-auto">
        {/* Eyebrow */}
        <div className="font-sans-ui text-[12px] tracking-[0.24em] uppercase text-[#9E9A92] mb-4 font-semibold flex sm:justify-center items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E34A32]" />
          PRIMERA GENERACIÓN
        </div>

        {/* Headline */}
        <h2
          id="first-generation-heading"
          className="font-editorial text-[38px] sm:text-[50px] md:text-[62px] leading-[1.05] tracking-[-0.03em] font-normal text-[#EDEAE2] mb-10"
        >
          Esta historia todavía casi nadie la conoce.
        </h2>

        {/* Narrative prose */}
        <div className="space-y-6 font-editorial text-[20px] sm:text-[23px] leading-[1.6] text-[#EDEAE2]/90 mb-12">
          <p className="text-[#EDEAE2]">
            No porque sea secreta.
            <br />
            <span className="italic text-[#9E9A92]">Porque acaba de comenzar.</span>
          </p>

          <p className="text-[#9E9A92]">
            SYNTA está formando su primera generación de lectores: personas dispuestas a descubrir historias antes de saber exactamente qué clase de autor existe detrás de ellas.
          </p>

          <p className="text-[#EDEAE2]/80">
            No necesitas entender la tecnología.
            <br />
            Solo necesitas querer leer algo que todavía no existía.
          </p>
        </div>

        {/* CTA */}
        <div>
          <button
            onClick={onJoinClick}
            className="font-sans-ui text-[15px] font-medium bg-[#EDEAE2] text-[#131211] hover:bg-[#E34A32] hover:text-[#EDEAE2] transition-colors duration-200 min-h-[50px] px-8 py-3.5 inline-flex items-center justify-center gap-2 rounded-[8px] cursor-pointer shadow-sm"
          >
            <span>Quiero estar entre los primeros</span>
            <span aria-hidden="true" className="text-[13px] font-sans">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
