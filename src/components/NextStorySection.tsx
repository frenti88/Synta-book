'use client';

import React, { useState } from 'react';
import { trackEvent, getStoredReaderId, getStoredReaderEmail } from '@/lib/analytics';

export const NextStorySection: React.FC = () => {
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

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
      className="py-20 sm:py-28 px-5 sm:px-8 max-w-2xl mx-auto text-center border-t border-[#EDEAE2]/10"
      aria-labelledby="next-story-title"
    >
      <div className="font-sans-ui text-[11px] sm:text-[12px] tracking-[0.2em] uppercase text-[#9E9A92] mb-3">
        LO QUE VIENE
      </div>

      <h3
        id="next-story-title"
        className="font-editorial text-[36px] sm:text-[44px] leading-[1.1] font-normal text-[#EDEAE2] mb-5"
      >
        Esta fue solo la primera.
      </h3>

      <div className="space-y-3 font-editorial text-[19px] sm:text-[21px] leading-[1.6] text-[#9E9A92] max-w-xl mx-auto mb-9">
        <p>NOMA seguirá escribiendo. Y no estará sola.</p>
        <p>
          SYNTA está construyendo una nueva generación de autores y nuevas formas de literatura.
        </p>
      </div>

      {!registered ? (
        <button
          onClick={handleInterest}
          disabled={loading}
          className="font-sans-ui text-[15px] font-medium bg-[#EDEAE2] text-[#131211] hover:bg-[#E34A32] hover:text-[#EDEAE2] transition-colors duration-200 min-h-[50px] px-8 py-3.5 inline-flex items-center justify-center gap-2 rounded-[8px] cursor-pointer disabled:opacity-60 shadow-sm"
        >
          {loading ? (
            <span>Registrando...</span>
          ) : (
            <>
              <span>Quiero leer la próxima</span>
              <span aria-hidden="true">→</span>
            </>
          )}
        </button>
      ) : (
        <div className="inline-flex items-center gap-2.5 px-6 py-3 border border-[#EDEAE2]/20 bg-[#1C1B1A] rounded-[8px] animate-in fade-in duration-300">
          <span className="w-2 h-2 rounded-full bg-[#E34A32]" />
          <span className="font-editorial text-[20px] text-[#EDEAE2] font-medium">
            Estás dentro.
          </span>
        </div>
      )}
    </section>
  );
};
