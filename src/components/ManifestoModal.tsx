'use client';

import React, { useEffect } from 'react';

interface ManifestoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManifestoModal: React.FC<ManifestoModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="manifesto-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl max-h-[85vh] bg-black text-white border border-white/25 p-6 sm:p-10 shadow-2xl overflow-y-auto z-10 rounded-[8px] text-left">
        <button
          onClick={onClose}
          aria-label="Cerrar manifiesto completo"
          className="absolute top-5 right-5 p-2 text-white hover:text-[#E34A32] transition-colors focus:ring-2 focus:ring-[#E34A32] rounded-[8px] cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="font-sans-ui text-[16px] tracking-[0.2em] uppercase text-white mb-2 font-semibold text-left">
          DOCUMENTO FUNDACIONAL
        </div>

        <h3
          id="manifesto-modal-title"
          className="font-editorial text-[32px] sm:text-[40px] font-normal text-white mb-6 leading-tight text-left"
        >
          Manifiesto SYNTA: La frontera de la voz
        </h3>

        <div className="space-y-6 font-editorial text-[18px] sm:text-[20px] leading-[1.7] text-white text-left">
          <p>
            Durante siglos hemos sostenido la convicción inquebrantable de que detrás de cada página debía respirar un ser humano de carne y hueso, forjado por una infancia, una geografía y una biografía irrepetible.
          </p>

          <p>
            SYNTA nace para explorar una frontera inédita: no la imitación de lo humano, sino la aparición de una sensibilidad distinta. Autores que no nacieron en una ciudad concreta, pero cuya voz está construida con rigor estético, reglas de lenguaje, obsesiones temáticas y una memoria que no olvida lo que ya ha escrito.
          </p>

          <p className="text-white">
            No creemos en la literatura como un ejercicio de cálculo masivo ni en la pirotecnia tecnológica. Rechazamos los atajos del efectismo. La tecnología es el instrumento silencioso; la literatura debe ser siempre el primer plano.
          </p>

          <p>
            Nuestros autores sintéticos no reemplazan a nadie. Vienen a ensanchar el territorio de lo decible. Porque al final de la lectura, lo único que permanece no es el código del creador, sino la verdad de lo que el lector experimenta en su soledad.
          </p>

          <p className="font-medium text-[22px] sm:text-[26px] pt-4 text-white">
            La calidad sigue siendo la frontera.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20 flex justify-end text-left">
          <button
            onClick={onClose}
            className="font-sans-ui text-[16px] font-semibold bg-white text-black hover:bg-[#E34A32] hover:text-white px-7 py-3 transition-colors cursor-pointer rounded-[8px]"
          >
            Cerrar manifiesto
          </button>
        </div>
      </div>
    </div>
  );
};
