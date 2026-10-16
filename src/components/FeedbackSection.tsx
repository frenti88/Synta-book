'use client';

import React, { useState } from 'react';
import { trackEvent, getStoredReaderId } from '@/lib/analytics';

interface FeedbackSectionProps {
  storyId: string;
  onSubmitted?: () => void;
  isDarkMode?: boolean;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  storyId,
  onSubmitted,
  isDarkMode = true,
}) => {
  const [rating, setRating] = useState<number | null>(null);
  const [readAgain, setReadAgain] = useState<'yes' | 'maybe' | 'no' | null>(null);
  const [perceptionChange, setPerceptionChange] = useState<'better' | 'same' | 'worse' | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const textColor = isDarkMode ? 'text-white' : 'text-[#171717]';
  const borderColor = isDarkMode ? 'border-white/20' : 'border-[#171717]/20';
  const btnBorder = isDarkMode ? 'border-white/30' : 'border-[#171717]/25';
  const btnBg = isDarkMode ? 'bg-black' : 'bg-[#EDE8DE]';
  const btnHover = isDarkMode ? 'hover:border-white' : 'hover:border-[#171717]';
  const submitBtn = isDarkMode
    ? 'bg-white text-black hover:bg-[#E34A32] hover:text-white'
    : 'bg-[#171717] text-white hover:bg-[#E34A32]';
  const inputBg = isDarkMode
    ? 'bg-black border-white/30 text-white placeholder:text-white/60 focus:border-white'
    : 'bg-[#EDE8DE] border-[#171717]/25 text-[#171717] placeholder:text-[#171717]/60 focus:border-[#171717]';

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
      className={`py-16 sm:py-24 px-5 sm:px-8 max-w-2xl mr-auto border-t text-left ${borderColor}`}
      aria-labelledby="feedback-title"
    >
      {!submitted ? (
        <div className="text-left">
          <div className="text-left mb-10">
            <h3
              id="feedback-title"
              className={`font-editorial text-[30px] sm:text-[36px] leading-[1.15] font-normal mb-3 text-left ${textColor}`}
            >
              Tu opinión como lector
            </h3>
            <p className={`font-editorial text-[18px] text-left ${textColor}`}>
              Tus impresiones nos permiten evaluar la recepción de esta primera entrega.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10 text-left">
            {/* Question 1: Rating */}
            <fieldset className="space-y-3 text-left">
              <legend className={`font-editorial text-[20px] font-normal text-left ${textColor}`}>
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
                          : `${btnBorder} ${btnBg} ${textColor} ${btnHover}`
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
              <legend className={`font-editorial text-[20px] font-normal text-left ${textColor}`}>
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
                          : `${btnBorder} ${btnBg} ${textColor} ${btnHover}`
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
              <legend className={`font-editorial text-[20px] font-normal text-left ${textColor}`}>
                3. ¿Influyó en tu lectura saber que la obra fue escrita por una autora sintética?
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-left">
                {[
                  { id: 'better', label: 'Hizo la lectura más interesante' },
                  { id: 'same', label: 'No influyó' },
                  { id: 'worse', label: 'Habría preferido no saberlo' },
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
                          : `${btnBorder} ${btnBg} ${textColor} ${btnHover}`
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
                className={`block font-sans-ui text-[16px] text-left font-medium ${textColor}`}
              >
                Algo que quieras dejar dicho (opcional)
              </label>
              <textarea
                id="feedback-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Una frase, una sensación, lo que se quedó contigo..."
                className={`w-full p-3.5 font-sans-ui text-[16px] focus:outline-none transition-colors rounded-[8px] ${inputBg}`}
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
                className={`w-full sm:w-auto font-sans-ui text-[16px] font-semibold transition-colors duration-200 min-h-[52px] px-8 py-3.5 inline-flex items-center justify-center gap-2 rounded-[8px] cursor-pointer disabled:opacity-60 shadow-sm ${submitBtn}`}
              >
                {loading ? 'Enviando...' : 'Enviar respuestas →'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="py-6 text-left animate-in fade-in duration-300">
          <div className={`w-12 h-12 mb-4 rounded-[8px] border flex items-center justify-center text-[#E34A32] ${btnBorder} ${btnBg}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h4 className={`font-editorial text-[26px] sm:text-[30px] mb-2 text-left ${textColor}`}>
            Gracias por tu tiempo y por compartir tu lectura.
          </h4>
          <p className={`font-editorial text-[18px] sm:text-[20px] text-left ${textColor}`}>
            Tus comentarios serán tenidos en cuenta para las siguientes ediciones del catálogo.
          </p>
        </div>
      )}
    </section>
  );
};
