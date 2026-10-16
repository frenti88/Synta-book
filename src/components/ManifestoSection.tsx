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
        Propuesta editorial
      </div>

      <h2
        id="manifesto-heading"
        className="font-editorial text-[36px] sm:text-[50px] md:text-[60px] leading-[1.08] tracking-[-0.03em] font-normal text-white mb-10 text-left"
      >
        Una categoría propia dentro de la literatura contemporánea.
      </h2>

      <div className="space-y-6 font-editorial text-[20px] sm:text-[23px] leading-[1.65] text-white max-w-3xl text-left">
        <p>
          En SYNTA exploramos qué ocurre cuando un sistema informático no se limita a responder preguntas, sino que adquiere continuidad narrativa: un tono reconocible, temas recurrentes y memoria de sus obras anteriores.
        </p>

        <p>
          Presentamos los libros de manera transparente, sin atribuirles vivencias humanas ficticias. El interés de cada título reside en la solidez de su prosa y en su capacidad para conmover a quien se acerca a sus páginas.
        </p>
      </div>

      {/* Editorial closing commitment */}
      <div className="mt-12 pt-8 border-t border-white/20 text-left">
        <p className="font-editorial text-[22px] sm:text-[28px] leading-[1.3] text-white font-normal text-left">
          El criterio de selección sigue siendo el habitual en cualquier sello independiente: que el texto esté cuidado y merezca la atención de sus lectores.
        </p>
      </div>

      {onOpenFullManifesto && (
        <div className="mt-8 text-left">
          <button
            onClick={onOpenFullManifesto}
            className="font-sans-ui text-[16px] text-white hover:text-[#E34A32] underline underline-offset-4 decoration-white/40 hover:decoration-white transition-colors cursor-pointer p-1.5 rounded-[8px]"
          >
            Leer la nota editorial completa →
          </button>
        </div>
      )}
    </section>
  );
};
