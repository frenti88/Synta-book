'use client';

import React, { useState, useEffect } from 'react';
import { trackEvent, getStoredReaderId, getStoredReaderEmail, storeReaderData } from '@/lib/analytics';

interface NextStorySectionProps {
  isDarkMode?: boolean;
}

export const NextStorySection: React.FC<NextStorySectionProps> = ({ isDarkMode = true }) => {
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingEmail, setExistingEmail] = useState<string | null>(null);
  const [inputEmail, setInputEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const textColor = isDarkMode ? 'text-white' : 'text-[#171717]';
  const textMuted = isDarkMode ? 'text-white/80' : 'text-[#171717]/80';
  const borderColor = isDarkMode ? 'border-white/20' : 'border-[#171717]/20';
  const boxBorder = isDarkMode ? 'border-white/30' : 'border-[#171717]/30';
  const boxBg = isDarkMode ? 'bg-black' : 'bg-[#EDE8DE]';
  const submitBtn = isDarkMode
    ? 'bg-white text-black hover:bg-[#E34A32] hover:text-white'
    : 'bg-[#171717] text-white hover:bg-[#E34A32]';
  const inputBg = isDarkMode
    ? 'bg-black border-white/30 text-white placeholder:text-white/60 focus:border-white'
    : 'bg-[#EDE8DE] border-[#171717]/25 text-[#171717] placeholder:text-[#171717]/60 focus:border-[#171717]';

  useEffect(() => {
    const email = getStoredReaderEmail();
    if (email) {
      setExistingEmail(email);
    }
  }, []);

  const handleInterest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const targetEmail = existingEmail || inputEmail.trim().toLowerCase();

    if (!targetEmail || !targetEmail.includes('@') || !targetEmail.includes('.')) {
      setErrorMsg('Por favor introduce un correo válido para enviarte el aviso.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    let readerId = getStoredReaderId();
    if (!readerId) {
      readerId = 'rdr_' + Date.now();
    }

    storeReaderData(readerId, targetEmail);
    setExistingEmail(targetEmail);

    try {
      await fetch('/api/next-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reader_id: readerId,
          email: targetEmail,
          author_interested: 'NOMA',
        }),
      });

      trackEvent('next_story_interest', {
        reader_id: readerId,
        author: 'NOMA',
      });
      setRegistered(true);
    } catch {
      setRegistered(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`py-20 sm:py-28 px-5 sm:px-8 max-w-2xl mr-auto text-left border-t ${borderColor}`}
      aria-labelledby="next-story-title"
    >
      <div className={`font-sans-ui text-[16px] tracking-[0.2em] uppercase mb-3 font-semibold text-left ${textColor}`}>
        PRÓXIMAS PUBLICACIONES
      </div>

      <h3
        id="next-story-title"
        className={`font-editorial text-[32px] sm:text-[40px] leading-[1.15] font-normal mb-4 text-left ${textColor}`}
      >
        Nuevas entregas del catálogo
      </h3>

      <div className={`space-y-3 font-editorial text-[18px] sm:text-[20px] leading-[1.6] max-w-xl mb-8 text-left ${textColor}`}>
        <p>
          El trabajo de NOMA continuará con una segunda novela breve. En paralelo, preparamos las primeras publicaciones de MIRA y SÉNECA.
        </p>
        <p className={textMuted}>
          Si deseas recibir una notificación cuando el siguiente título esté disponible para lectura, confirma tu interés a continuación.
        </p>
      </div>

      {!registered ? (
        existingEmail ? (
          <div className="text-left">
            <button
              onClick={() => handleInterest()}
              disabled={loading}
              className={`font-sans-ui text-[16px] font-semibold transition-colors duration-200 min-h-[52px] px-8 py-3.5 inline-flex items-center justify-center gap-2.5 rounded-[8px] cursor-pointer disabled:opacity-60 shadow-sm ${submitBtn}`}
            >
              {loading ? (
                <span>Registrando confirmación...</span>
              ) : (
                <>
                  <span>Recibir aviso del próximo libro</span>
                  <span aria-hidden="true" className="text-[16px] font-sans">
                    →
                  </span>
                </>
              )}
            </button>
            <p className={`font-sans-ui text-[16px] mt-3 text-left ${textMuted}`}>
              Te avisaremos a: {existingEmail}
            </p>
          </div>
        ) : (
          <form onSubmit={handleInterest} className="space-y-3 max-w-md text-left">
            <label
              htmlFor="next-story-email"
              className={`block font-sans-ui text-[16px] font-medium text-left ${textColor}`}
            >
              Tu correo para recibir el aviso
            </label>
            <div className="flex flex-col sm:flex-row gap-3 text-left">
              <input
                id="next-story-email"
                type="email"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
                required
                aria-label="Correo electrónico para recibir el aviso del próximo libro"
                className={`flex-1 p-3.5 font-sans-ui text-[16px] focus:outline-none transition-colors rounded-[8px] border ${inputBg}`}
              />
              <button
                type="submit"
                disabled={loading}
                className={`font-sans-ui text-[16px] font-semibold transition-colors duration-200 min-h-[52px] px-7 py-3.5 inline-flex items-center justify-center gap-2 rounded-[8px] cursor-pointer disabled:opacity-60 shadow-sm whitespace-nowrap ${submitBtn}`}
              >
                {loading ? 'Registrando...' : 'Recibir aviso →'}
              </button>
            </div>
            {errorMsg && (
              <p role="alert" className="font-sans-ui text-[16px] text-[#E34A32] text-left">
                {errorMsg}
              </p>
            )}
          </form>
        )
      ) : (
        <div className={`inline-flex items-center gap-2.5 px-6 py-3 border rounded-[8px] animate-in fade-in duration-300 text-left ${boxBorder} ${boxBg}`}>
          <span className="w-2.5 h-2.5 rounded-full bg-[#E34A32]" />
          <span className={`font-editorial text-[18px] sm:text-[20px] font-medium text-left ${textColor}`}>
            Aviso confirmado. Te escribiremos con el siguiente lanzamiento.
          </span>
        </div>
      )}
    </section>
  );
};
