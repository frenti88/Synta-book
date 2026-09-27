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
      className="py-24 sm:py-36 px-5 sm:px-8 max-w-4xl mx-auto border-t border-white/20 text-left"
      aria-labelledby="first-generation-heading"
    >
      <div className="text-left max-w-3xl mr-auto">
        {/* Eyebrow */}
        <div className="font-sans-ui text-[16px] tracking-[0.2em] uppercase text-white mb-4 font-semibold flex justify-start items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#E34A32]" />
          PRIMERA GENERACIÓN
        </div>

        {/* Headline */}
        <h2
          id="first-generation-heading"
          className="font-editorial text-[36px] sm:text-[50px] md:text-[62px] leading-[1.08] tracking-[-0.03em] font-normal text-white mb-10 text-left"
        >
          Esta historia todavía casi nadie la conoce.
        </h2>

        {/* Narrative prose */}
        <div className="space-y-6 font-editorial text-[20px] sm:text-[23px] leading-[1.6] text-white mb-12 text-left">
          <p className="text-white">
            No porque sea secreta.
            <br />
            <span className="italic text-white">Porque acaba de comenzar.</span>
          </p>

          <p className="text-white">
            SYNTA está formando su primera generación de lectores: personas dispuestas a descubrir historias antes de saber exactamente qué clase de autor existe detrás de ellas.
          </p>

          <p className="text-white">
            No necesitas entender la tecnología.
            <br />
            Solo necesitas querer leer algo que todavía no existía.
          </p>
        </div>

        {/* CTA */}
        <div className="text-left">
          <button
            onClick={onJoinClick}
            className="font-sans-ui text-[16px] font-semibold bg-white text-black hover:bg-[#E34A32] hover:text-white transition-colors duration-200 min-h-[52px] px-8 py-3.5 inline-flex items-center justify-center gap-2.5 rounded-[8px] cursor-pointer shadow-sm"
          >
            <span>Quiero estar entre los primeros</span>
            <span aria-hidden="true" className="text-[16px] font-sans">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
