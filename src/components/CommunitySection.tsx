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
          source: 'community_footer_block',
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
        source: 'community_section',
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
      className="py-24 sm:py-32 px-5 sm:px-8 border-t border-[#EDEAE2]/10 bg-[#181716]/60"
      aria-labelledby="community-title"
    >
      <div className="max-w-2xl mx-auto text-center">
        <div className="font-sans-ui text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-[#9E9A92] mb-3">
          PRIMEROS LECTORES
        </div>

        <h3
          id="community-title"
          className="font-editorial text-[36px] sm:text-[46px] leading-[1.08] font-normal text-[#EDEAE2] mb-4 tracking-[-0.02em]"
        >
          Sé de los primeros en leer lo que viene.
        </h3>

        <p className="font-editorial text-[19px] sm:text-[21px] leading-[1.5] text-[#9E9A92] mb-10 font-normal">
          Estamos formando la primera comunidad de lectores de SYNTA.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} noValidate className="max-w-md mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                aria-label="Correo para la comunidad SYNTA"
                required
                disabled={loading}
                className="flex-1 bg-[#1C1B1A] border border-[#EDEAE2]/20 text-[#EDEAE2] px-4 py-3.5 font-sans-ui text-[15px] placeholder:text-[#6B6862] focus:outline-none focus:border-[#EDEAE2] transition-colors rounded-[8px]"
              />
              <button
                type="submit"
                disabled={loading}
                className="font-sans-ui text-[15px] font-medium bg-[#EDEAE2] text-[#131211] hover:bg-[#E34A32] hover:text-[#EDEAE2] transition-colors duration-200 min-h-[50px] px-7 py-3.5 inline-flex items-center justify-center gap-2 rounded-[8px] cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span>Entrando...</span>
                ) : (
                  <>
                    <span>Entrar a SYNTA</span>
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

            <p className="font-sans-ui text-[12px] sm:text-[13px] text-[#6B6862] pt-2">
              Historias nuevas. Lanzamientos. Accesos anticipados. Sin ruido.
            </p>
          </form>
        ) : (
          <div className="py-6 border border-[#EDEAE2]/15 bg-[#1C1B1A] px-8 rounded-[8px] animate-in fade-in duration-300">
            <p className="font-editorial text-[24px] sm:text-[28px] text-[#EDEAE2] mb-2 font-normal">
              Tu acceso está abierto.
            </p>
            <p className="font-editorial text-[17px] text-[#9E9A92]">
              Recibirás cada nueva obra y lanzamiento directamente en tu bandeja.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
