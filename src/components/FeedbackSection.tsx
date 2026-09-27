'use client';

import React, { useState } from 'react';
import { trackEvent, getStoredReaderId } from '@/lib/analytics';

interface FeedbackSectionProps {
  storyId: string;
  onSubmitted?: () => void;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  storyId,
  onSubmitted,
}) => {
  const [rating, setRating] = useState<number | null>(null);
  const [readAgain, setReadAgain] = useState<'yes' | 'maybe' | 'no' | null>(null);
  const [perceptionChange, setPerceptionChange] = useState<'better' | 'same' | 'worse' | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRatingSelect = (val: number) => {
    setRating(val);
    trackEvent('feedback_started', { question: 'rating', val });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !readAgain || !perceptionChange) {
      setErrorMsg('Por favor selecciona una respuesta para las tres preguntas breves.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const readerId = getStoredReaderId() || 'anonymous_reader';

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reader_id: readerId,
          story_id: storyId,
          rating,
          read_again: readAgain,
          perception_change: perceptionChange,
          comment: comment.trim() || undefined,
        }),
      });

      trackEvent('feedback_submitted', {
        rating,
        read_again: readAgain,
        perception_change: perceptionChange,
        has_comment: Boolean(comment.trim()),
      });

      setSubmitted(true);
      if (onSubmitted) {
        onSubmitted();
      }
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="feedback-lector"
      className="py-16 sm:py-24 px-5 sm:px-8 max-w-2xl mr-auto border-t border-white/20 text-left"
      aria-labelledby="feedback-title"
    >
      {!submitted ? (
        <div className="text-left">
          <div className="text-left mb-10">
            <h3
              id="feedback-title"
              className="font-editorial text-[30px] sm:text-[36px] leading-[1.15] font-normal text-white mb-3 text-left"
            >
              Antes de irte, queremos saber algo.
            </h3>
            <p className="font-editorial text-[18px] text-white text-left">
              Tus respuestas dan forma a las siguientes obras de SYNTA.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10 text-left">
            {/* Question 1: Rating */}
            <fieldset className="space-y-3 text-left">
              <legend className="font-editorial text-[20px] text-white font-normal text-left">
                1. ¿Qué tanto te gustó la historia?
              </legend>
              <div className="flex items-center gap-2 sm:gap-3 text-left" role="radiogroup" aria-label="Calificación del 1 al 5">
                {[1, 2, 3, 4, 5].map((val) => {
                  const isSelected = rating === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleRatingSelect(val)}
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`${val} de 5`}
                      className={`flex-1 min-h-[48px] border font-sans-ui text-[16px] font-semibold transition-all duration-150 focus:ring-2 focus:ring-[#E34A32] cursor-pointer rounded-[8px] ${
                        isSelected
                          ? 'border-[#E34A32] bg-[#E34A32] text-white'
                          : 'border-white/30 bg-black text-white hover:border-white'
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Question 2: Read Again */}
            <fieldset className="space-y-3 text-left">
              <legend className="font-editorial text-[20px] text-white font-normal text-left">
                2. ¿Leerías otra historia de este autor?
              </legend>
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-left">
                {[
                  { id: 'yes', label: 'Sí' },
                  { id: 'maybe', label: 'Tal vez' },
                  { id: 'no', label: 'No' },
                ].map((opt) => {
                  const isSelected = readAgain === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setReadAgain(opt.id as 'yes' | 'maybe' | 'no')}
                      role="radio"
                      aria-checked={isSelected}
                      className={`min-h-[48px] border font-sans-ui text-[16px] font-medium transition-all duration-150 focus:ring-2 focus:ring-[#E34A32] cursor-pointer rounded-[8px] ${
                        isSelected
                          ? 'border-[#E34A32] bg-[#E34A32] text-white font-semibold'
                          : 'border-white/30 bg-black text-white hover:border-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Question 3: Perception change */}
            <fieldset className="space-y-3 text-left">
              <legend className="font-editorial text-[20px] text-white font-normal text-left">
                3. Saber que el autor no es humano, ¿cambió lo que sentiste al leer?
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-left">
                {[
                  { id: 'better', label: 'La hizo más interesante' },
                  { id: 'same', label: 'No cambió nada' },
                  { id: 'worse', label: 'Prefería no saberlo' },
                ].map((opt) => {
                  const isSelected = perceptionChange === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPerceptionChange(opt.id as 'better' | 'same' | 'worse')}
                      role="radio"
                      aria-checked={isSelected}
                      className={`min-h-[48px] px-4 border font-sans-ui text-[16px] font-medium transition-all duration-150 focus:ring-2 focus:ring-[#E34A32] cursor-pointer rounded-[8px] flex items-center justify-start text-left ${
                        isSelected
                          ? 'border-[#E34A32] bg-[#E34A32] text-white font-semibold'
                          : 'border-white/30 bg-black text-white hover:border-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Optional Comment */}
            <div className="space-y-2 text-left">
              <label
                htmlFor="feedback-comment"
                className="block font-sans-ui text-[16px] text-white text-left font-medium"
              >
                Algo que quieras dejar dicho (opcional)
              </label>
              <textarea
                id="feedback-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Una frase, una sensación, lo que se quedó contigo..."
                className="w-full bg-black border border-white/30 text-white p-3.5 font-sans-ui text-[16px] placeholder:text-white/60 focus:outline-none focus:border-white transition-colors rounded-[8px]"
              />
            </div>

            {errorMsg && (
              <p role="alert" className="font-sans-ui text-[16px] text-[#E34A32] text-left">
                {errorMsg}
              </p>
            )}

            <div className="text-left">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto font-sans-ui text-[16px] font-semibold bg-white text-black hover:bg-[#E34A32] hover:text-white transition-colors duration-200 min-h-[52px] px-8 py-3.5 inline-flex items-center justify-center gap-2 rounded-[8px] cursor-pointer disabled:opacity-60 shadow-sm"
              >
                {loading ? 'Enviando...' : 'Enviar respuestas →'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="py-6 text-left animate-in fade-in duration-300">
          <div className="w-12 h-12 mb-4 rounded-[8px] border border-white/30 flex items-center justify-center text-[#E34A32] bg-white/5">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h4 className="font-editorial text-[26px] sm:text-[30px] text-white mb-2 text-left">
            Gracias por leer y por responder.
          </h4>
          <p className="font-editorial text-[18px] sm:text-[20px] text-white text-left">
            Tus impresiones nos ayudan a construir las siguientes obras y autores sintéticos.
          </p>
        </div>
      )}
    </section>
  );
};
