'use client';

import React, { useState } from 'react';
import { trackEvent, storeReaderData } from '@/lib/analytics';

export const CommunitySection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Introduce un correo electrónico válido.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/readers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          source: 'first_generation_cta',
          consent: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al unirse.');
      }

      const readerId = data.reader?.id || 'rdr_' + Date.now();
      storeReaderData(readerId, cleanEmail);

      trackEvent('email_submitted', {
        email: cleanEmail,
        source: 'community_first_generation',
      });

      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="comunidad"
      className="py-24 sm:py-36 px-5 sm:px-8 border-t border-white/20 bg-black relative text-left"
      aria-labelledby="community-title"
    >
      <div className="max-w-2xl mr-auto text-left">
        <div className="font-sans-ui text-[16px] tracking-[0.2em] uppercase text-white mb-4 font-semibold flex justify-start items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#E34A32]" />
          PRIMERA GENERACIÓN
        </div>

        <h3
          id="community-title"
          className="font-editorial text-[36px] sm:text-[48px] md:text-[54px] leading-[1.08] font-normal text-white mb-5 tracking-[-0.025em] text-left"
        >
          Lee antes que los demás.
        </h3>

        <p className="font-editorial text-[19px] sm:text-[22px] leading-[1.5] text-white mb-10 font-normal text-left">
          Una nueva historia aparecerá cuando esté lista.
          <br />
          Los primeros lectores tendrán acceso antes de su publicación abierta.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} noValidate className="max-w-xl text-left space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 text-left">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                aria-label="Correo para la primera generación SYNTA"
                required
                disabled={loading}
                className="flex-1 bg-black border border-white/30 text-white px-4 py-3.5 font-sans-ui text-[16px] placeholder:text-white/60 focus:outline-none focus:border-white transition-colors rounded-[8px]"
              />
              <button
                type="submit"
                disabled={loading}
                className="font-sans-ui text-[16px] font-semibold bg-white text-black hover:bg-[#E34A32] hover:text-white transition-colors duration-200 min-h-[52px] px-7 py-3.5 inline-flex items-center justify-center gap-2.5 rounded-[8px] cursor-pointer disabled:opacity-60 whitespace-nowrap"
              >
                {loading ? (
                  <span>Entrando...</span>
                ) : (
                  <>
                    <span>Entrar en la primera generación</span>
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </div>

            {errorMsg && (
              <p role="alert" className="font-sans-ui text-[16px] text-[#E34A32] text-left">
                {errorMsg}
              </p>
            )}

            <div className="font-sans-ui text-[16px] text-white pt-4 flex flex-wrap justify-start items-center gap-x-3 gap-y-1.5 text-left">
              <span>Historias nuevas.</span>
              <span className="opacity-60">·</span>
              <span>Accesos anticipados.</span>
              <span className="opacity-60">·</span>
              <span>Cartas de nuestros autores.</span>
              <span className="opacity-60">·</span>
              <span className="font-medium text-white">Nada más.</span>
            </div>
          </form>
        ) : (
          <div className="py-4 text-left animate-in fade-in duration-300">
            <div className="w-12 h-12 mb-4 rounded-[8px] border border-white/30 flex items-center justify-center text-[#E34A32] bg-white/5">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h4 className="font-editorial text-[26px] sm:text-[30px] text-white mb-2 text-left">
              Estás en la primera generación.
            </h4>
            <p className="font-editorial text-[18px] sm:text-[20px] text-white text-left">
              Recibirás las obras y avisos antes que nadie directamente en tu correo.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
