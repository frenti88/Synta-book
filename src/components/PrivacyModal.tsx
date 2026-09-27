'use client';

import React, { useEffect } from 'react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
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
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#181716] text-[#EDEAE2] border border-[#EDEAE2]/15 p-6 sm:p-10 shadow-2xl overflow-y-auto z-10 rounded-[8px]">
        <button
          onClick={onClose}
          aria-label="Cerrar política de privacidad"
          className="absolute top-5 right-5 p-2 text-[#9E9A92] hover:text-[#EDEAE2] transition-colors focus:ring-2 focus:ring-[#E34A32] rounded-[8px] cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="font-sans-ui text-[11px] tracking-[0.2em] uppercase text-[#9E9A92] mb-2">
          TRANSPARENCIA EDITORIAL
        </div>

        <h3
          id="privacy-modal-title"
          className="font-editorial text-[30px] sm:text-[36px] font-normal text-[#EDEAE2] mb-6"
        >
          Política de Privacidad y Tratamiento de Datos
        </h3>

        <div className="space-y-5 font-editorial text-[17px] leading-[1.65] text-[#EDEAE2]/90">
          <p>
            En <strong>SYNTA</strong> tratamos tu información personal con el mismo rigor y discreción con el que editamos cada una de nuestras obras.
          </p>

          <h4 className="font-sans-ui text-[14px] uppercase tracking-wider font-semibold text-[#EDEAE2] pt-2">
            1. Responsable del Tratamiento
          </h4>
          <p className="text-[16px] text-[#9E9A92]">
            SYNTA Editorial es el responsable del tratamiento de los datos recolectados a través de esta plataforma, en cumplimiento de la Ley 1581 de 2012 de la República de Colombia (Régimen General de Protección de Datos Personales / Habeas Data) y estándares internacionales de privacidad.
          </p>

          <h4 className="font-sans-ui text-[14px] uppercase tracking-wider font-semibold text-[#EDEAE2] pt-2">
            2. Qué datos recolectamos y para qué
          </h4>
          <p className="text-[16px] text-[#9E9A92]">
            Únicamente solicitamos tu <strong>correo electrónico</strong>. Lo utilizamos con tres propósitos exclusivos:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[16px] text-[#9E9A92]">
            <li>Habilitar de inmediato tu acceso de lectura a la primera historia.</li>
            <li>Enviarte notificaciones cuando un autor de SYNTA publique una nueva obra.</li>
            <li>Guardar de forma anónima tu avance de lectura para que puedas retomar la historia donde la dejaste.</li>
          </ul>

          <h4 className="font-sans-ui text-[14px] uppercase tracking-wider font-semibold text-[#EDEAE2] pt-2">
            3. Principio de Cero Venta de Datos
          </h4>
          <p className="text-[16px] text-[#9E9A92]">
            Nunca venderemos, alquilaremos ni compartiremos tu dirección de correo electrónico con terceros ni con redes publicitarias. No utilizamos dark patterns ni tácticas de spam.
          </p>

          <h4 className="font-sans-ui text-[14px] uppercase tracking-wider font-semibold text-[#EDEAE2] pt-2">
            4. Baja en Cualquier Momento
          </h4>
          <p className="text-[16px] text-[#9E9A92]">
            Puedes revocar tu autorización y solicitar la supresión de tu correo en cualquier momento mediante el enlace al pie de cada comunicación o escribiéndonos directamente a <a href="mailto:privacidad@synta.editorial" className="text-[#EDEAE2] underline rounded-[4px]">privacidad@synta.editorial</a>.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-[#EDEAE2]/10 flex justify-end">
          <button
            onClick={onClose}
            className="font-sans-ui text-[14px] font-medium bg-[#EDEAE2] text-[#131211] hover:bg-[#E34A32] hover:text-[#EDEAE2] px-6 py-2.5 transition-colors cursor-pointer rounded-[8px]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
