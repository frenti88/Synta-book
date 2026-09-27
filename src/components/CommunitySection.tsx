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
      className="py-28 sm:py-36 px-5 sm:px-8 border-t border-[#EDEAE2]/10 bg-[#181716]/60 relative"
      aria-labelledby="community-title"
    >
      <div className="max-w-2xl mx-auto text-center">
        <div className="font-sans-ui text-[12px] tracking-[0.24em] uppercase text-[#9E9A92] mb-4 font-semibold flex justify-center items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E34A32]" />
          PRIMERA GENERACIÓN
        </div>

        <h3
          id="community-title"
          className="font-editorial text-[38px] sm:text-[48px] md:text-[54px] leading-[1.08] font-normal text-[#EDEAE2] mb-5 tracking-[-0.025em]"
        >
          Lee antes que los demás.
        </h3>

        <p className="font-editorial text-[19px] sm:text-[22px] leading-[1.5] text-[#9E9A92] mb-10 font-normal">
          Una nueva historia aparecerá cuando esté lista.
          <br />
          Los primeros lectores tendrán acceso antes de su publicación abierta.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} noValidate className="max-w-md mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                aria-label="Correo para la primera generación SYNTA"
                required
                disabled={loading}
                className="flex-1 bg-[#1C1B1A] border border-[#EDEAE2]/20 text-[#EDEAE2] px-4 py-3.5 font-sans-ui text-[15px] placeholder:text-[#6B6862] focus:outline-none focus:border-[#EDEAE2] transition-colors rounded-[8px]"
              />
              <button
                type="submit"
                disabled={loading}
                className="font-sans-ui text-[14px] sm:text-[15px] font-medium bg-[#EDEAE2] text-[#131211] hover:bg-[#E34A32] hover:text-[#EDEAE2] transition-colors duration-200 min-h-[50px] px-6 py-3.5 inline-flex items-center justify-center gap-2 rounded-[8px] cursor-pointer disabled:opacity-60 whitespace-nowrap"
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
              <p role="alert" className="font-sans-ui text-[13px] text-[#E34A32] text-left">
                {errorMsg}
              </p>
            )}

            <div className="font-sans-ui text-[12px] sm:text-[13px] text-[#6B6862] pt-4 flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
              <span>Historias nuevas.</span>
              <span>Accesos anticipados.</span>
              <span>Cartas de nuestros autores.</span>
              <span className="text-[#9E9A92]">Nada más.</span>
            </div>
          </form>
        ) : (
          <div className="py-8 border border-[#EDEAE2]/15 bg-[#1C1B1A] px-8 rounded-[8px] animate-in fade-in duration-400">
            <p className="font-editorial text-[26px] sm:text-[30px] text-[#EDEAE2] mb-3 font-normal">
              Ya eres parte de la primera generación de lectores SYNTA.
            </p>
            <p className="font-editorial text-[18px] text-[#9E9A92]">
              Tu acceso está abierto. La siguiente historia te encontrará aquí primero.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
