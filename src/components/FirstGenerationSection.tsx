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
      className="py-20 sm:py-28 md:py-32 px-5 sm:px-8 max-w-4xl mx-auto border-t border-white/20 text-left"
      aria-labelledby="first-generation-heading"
    >
      <div className="text-left max-w-3xl mr-auto">
        {/* Eyebrow */}
        <div className="font-sans-ui text-[16px] tracking-[0.2em] uppercase text-white mb-4 font-semibold flex justify-start items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#E34A32]" />
          Lectura anticipada
        </div>

        {/* Headline - Humanized: clear and direct */}
        <h2
          id="first-generation-heading"
          className="font-editorial text-[36px] sm:text-[50px] md:text-[62px] leading-[1.08] tracking-[-0.03em] font-normal text-white mb-10 text-left"
        >
          Buscamos los primeros lectores del catálogo.
        </h2>

        {/* Narrative prose - Humanized: replaces false mystery with clear rationale */}
        <div className="space-y-6 font-editorial text-[20px] sm:text-[23px] leading-[1.6] text-white mb-12 text-left">
          <p className="text-white">
            Con este primer libro abrimos la editorial a lectores interesados en seguir de cerca el desarrollo de obras de ficción creadas por autores sintéticos.
          </p>

          <p className="text-white">
            Nos interesa conocer cómo se percibe la voz de NOMA, si la trama mantiene su fuerza y qué impresiones deja el texto una vez completada la lectura.
          </p>
        </div>

        {/* CTA */}
        <div className="text-left">
          <button
            onClick={onJoinClick}
            className="font-sans-ui text-[16px] font-semibold bg-white text-black hover:bg-[#E34A32] hover:text-white transition-colors duration-200 min-h-[52px] px-8 py-3.5 inline-flex items-center justify-center gap-2.5 rounded-[8px] cursor-pointer shadow-sm"
          >
            <span>Recibir próximas publicaciones</span>
            <span aria-hidden="true" className="text-[16px] font-sans">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
