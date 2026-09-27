'use client';

import React, { useState, useEffect, useRef } from 'react';
import { trackEvent, storeReaderData } from '@/lib/analytics';

interface UnlockDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessUnlock: () => void;
}

export const UnlockDrawer: React.FC<UnlockDrawerProps> = ({
  isOpen,
  onClose,
  onSuccessUnlock,
}) => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUnlockedState, setIsUnlockedState] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
      setErrorMsg(null);
      setIsUnlockedState(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Por favor introduce una dirección de correo válida.');
      return;
    }

    if (!consent) {
      setErrorMsg('Debes aceptar recibir la historia y avisos de nuevas obras.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/readers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          source: 'unlock_drawer',
          consent: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Ocurrió un error al procesar tu solicitud.');
      }

      const readerId = data.reader?.id || 'rdr_' + Date.now();
      storeReaderData(readerId, cleanEmail);

      trackEvent('email_submitted', { email: cleanEmail });

      setTimeout(() => {
        setLoading(false);
        setIsUnlockedState(true);
      }, 450);
    } catch (err: unknown) {
      setLoading(false);
      const message = err instanceof Error ? err.message : 'No pudimos registrar tu correo. Inténtalo de nuevo.';
      setErrorMsg(message);
    }
  };

  const handleStartReading = () => {
    trackEvent('reader_started', { trigger: 'unlock_modal' });
    onSuccessUnlock();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="unlock-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-xs transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        ref={drawerRef}
        className="relative w-full sm:max-w-lg bg-black text-white border-t sm:border border-white/20 p-7 sm:p-10 shadow-2xl z-10 animate-in fade-in slide-in-from-bottom-4 duration-300 rounded-t-[12px] sm:rounded-[8px] text-left"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Cerrar ventana de desbloqueo"
          className="absolute top-5 right-5 p-2 text-white hover:text-[#E34A32] transition-colors focus:ring-2 focus:ring-[#E34A32] rounded-[8px] cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isUnlockedState ? (
          <div className="text-left">
            <div className="font-sans-ui text-[16px] tracking-[0.2em] uppercase text-white mb-3 font-semibold flex items-center gap-2 text-left">
              <span className="w-2 h-2 rounded-full bg-[#E34A32]" />
              SYNTA 001 · PRIMEROS LECTORES
            </div>

            <h3
              id="unlock-title"
              className="font-editorial text-[32px] sm:text-[38px] leading-[1.1] font-normal text-white mb-4 text-left"
            >
              Antes de entrar
            </h3>

            <p className="font-editorial text-[18px] sm:text-[20px] leading-[1.5] text-white mb-8 font-normal text-left">
              Estamos reuniendo a la primera generación de lectores de SYNTA. Déjanos tu correo y esta historia será tuya.
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-5 text-left">
              <div>
                <label
                  htmlFor="reader-email-input"
                  className="block font-sans-ui text-[16px] tracking-wide text-white mb-2 font-medium text-left"
                >
                  Tu correo electrónico
                </label>
                <input
                  ref={inputRef}
                  id="reader-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="w-full bg-black border border-white/30 text-white px-4 py-3.5 font-sans-ui text-[16px] placeholder:text-white/60 focus:outline-none focus:border-white focus:bg-white/5 transition-all disabled:opacity-50 rounded-[8px]"
                />
              </div>

              {/* Consent checkbox */}
              <div className="flex items-start gap-3 pt-1 text-left">
                <input
                  id="privacy-consent-checkbox"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded-[4px] accent-[#E34A32] cursor-pointer"
                />
                <label
                  htmlFor="privacy-consent-checkbox"
                  className="font-sans-ui text-[16px] leading-relaxed text-white cursor-pointer select-none text-left"
                >
                  Acepto recibir esta obra y avisos cuando exista una nueva historia de SYNTA. Puedes salir cuando quieras con un solo clic.
                </label>
              </div>

              {errorMsg && (
                <p role="alert" className="font-sans-ui text-[16px] text-[#E34A32] text-left">
                  {errorMsg}
                </p>
              )}

              {/* CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full font-sans-ui text-[16px] font-semibold bg-white text-black hover:bg-[#E34A32] hover:text-white transition-colors duration-200 min-h-[52px] px-6 py-3.5 flex items-center justify-center gap-2 rounded-[8px] cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span>Abriendo acceso...</span>
                ) : (
                  <>
                    <span>Abrir la historia</span>
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/20 text-left">
              <p className="font-sans-ui text-[16px] text-white text-left">
                Sin contraseñas. Sin formularios largos. Solo literatura.
              </p>
            </div>
          </div>
        ) : (
          /* Success state - strictly left-aligned */
          <div className="text-left py-4 animate-in fade-in zoom-in-95 duration-400">
            <div className="w-12 h-12 mb-5 rounded-[8px] border border-white/30 flex items-center justify-center text-[#E34A32] bg-white/5">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>

            <div className="font-sans-ui text-[16px] tracking-[0.2em] uppercase text-white mb-2 font-semibold text-left">
              PRIMERA GENERACIÓN
            </div>

            <h3 className="font-editorial text-[30px] sm:text-[36px] leading-[1.15] font-normal text-white mb-3 text-left">
              Ya eres parte de la primera generación de lectores SYNTA.
            </h3>

            <p className="font-editorial text-[18px] sm:text-[20px] leading-[1.5] text-white mb-8 font-normal text-left">
              Tu acceso está abierto. Todo lo que falta ya te espera.
            </p>

            <button
              onClick={handleStartReading}
              autoFocus
              className="w-full font-sans-ui text-[16px] font-semibold bg-white text-black hover:bg-[#E34A32] hover:text-white transition-colors duration-200 min-h-[52px] px-8 py-3.5 flex items-center justify-center gap-2 rounded-[8px] cursor-pointer"
            >
              <span>Comenzar a leer</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
