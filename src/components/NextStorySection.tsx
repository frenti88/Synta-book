'use client';

import React, { useState } from 'react';
import { trackEvent, getStoredReaderId, getStoredReaderEmail } from '@/lib/analytics';

interface NextStorySectionProps {
  isDarkMode?: boolean;
}

export const NextStorySection: React.FC<NextStorySectionProps> = ({ isDarkMode = true }) => {
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  const textColor = isDarkMode ? 'text-white' : 'text-[#171717]';
  const textMuted = isDarkMode ? 'text-white/80' : 'text-[#171717]/80';
  const borderColor = isDarkMode ? 'border-white/20' : 'border-[#171717]/20';
  const boxBorder = isDarkMode ? 'border-white/30' : 'border-[#171717]/30';
  const boxBg = isDarkMode ? 'bg-black' : 'bg-[#EDE8DE]';
  const submitBtn = isDarkMode
    ? 'bg-white text-black hover:bg-[#E34A32] hover:text-white'
    : 'bg-[#171717] text-white hover:bg-[#E34A32]';

  const handleInterest = async () => {
    setLoading(true);
    const readerId = getStoredReaderId();
    const readerEmail = getStoredReaderEmail();

    try {
      await fetch('/api/next-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reader_id: readerId,
          email: readerEmail,
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
        <div className="text-left">
          <button
            onClick={handleInterest}
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
        </div>
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
