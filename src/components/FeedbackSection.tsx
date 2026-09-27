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
      className="py-16 sm:py-24 px-5 sm:px-8 max-w-2xl mx-auto border-t border-[#EDEAE2]/10"
      aria-labelledby="feedback-title"
    >
      {!submitted ? (
        <div>
          <div className="text-center mb-10">
            <h3
              id="feedback-title"
              className="font-editorial text-[30px] sm:text-[36px] leading-[1.15] font-normal text-[#EDEAE2] mb-3"
            >
              Antes de irte, queremos saber algo.
            </h3>
            <p className="font-editorial text-[18px] text-[#9E9A92]">
              Tus respuestas dan forma a las siguientes obras de SYNTA.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Question 1: Rating with 8px radius */}
            <fieldset className="space-y-3">
              <legend className="font-editorial text-[20px] text-[#EDEAE2] font-normal">
                1. ¿Qué tanto te gustó la historia?
              </legend>
              <div className="flex items-center gap-2 sm:gap-3" role="radiogroup" aria-label="Calificación del 1 al 5">
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
                      className={`flex-1 min-h-[46px] border font-sans-ui text-[15px] font-medium transition-all duration-150 focus:ring-2 focus:ring-[#E34A32] cursor-pointer rounded-[8px] ${
                        isSelected
                          ? 'bg-[#EDEAE2] text-[#131211] border-[#EDEAE2]'
                          : 'bg-[#1C1B1A] text-[#EDEAE2] border-[#EDEAE2]/20 hover:border-[#EDEAE2]'
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between font-sans-ui text-[11px] text-[#6B6862] px-1">
                <span>Poco</span>
                <span>Mucho</span>
              </div>
            </fieldset>

            {/* Question 2: Read again with 8px radius */}
            <fieldset className="space-y-3">
              <legend className="font-editorial text-[20px] text-[#EDEAE2] font-normal">
                2. ¿Leerías otra historia de NOMA?
              </legend>
              <div className="grid grid-cols-3 gap-2 sm:gap-3" role="radiogroup">
                {[
                  { key: 'yes', label: 'Sí' },
                  { key: 'maybe', label: 'Tal vez' },
                  { key: 'no', label: 'No' },
                ].map(({ key, label }) => {
                  const isSelected = readAgain === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setReadAgain(key as 'yes' | 'maybe' | 'no')}
                      role="radio"
                      aria-checked={isSelected}
                      className={`min-h-[46px] border font-sans-ui text-[14px] font-medium transition-all duration-150 focus:ring-2 focus:ring-[#E34A32] cursor-pointer rounded-[8px] ${
                        isSelected
                          ? 'bg-[#EDEAE2] text-[#131211] border-[#EDEAE2]'
                          : 'bg-[#1C1B1A] text-[#EDEAE2] border-[#EDEAE2]/20 hover:border-[#EDEAE2]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Question 3: Perception change with 8px radius */}
            <fieldset className="space-y-3">
              <legend className="font-editorial text-[20px] text-[#EDEAE2] font-normal">
                3. Ahora que sabes quién la escribió, ¿cambió tu percepción de la historia?
              </legend>
              <div className="grid grid-cols-3 gap-2 sm:gap-3" role="radiogroup">
                {[
                  { key: 'better', label: 'Mejoró' },
                  { key: 'same', label: 'Sigue igual' },
                  { key: 'worse', label: 'Empeoró' },
                ].map(({ key, label }) => {
                  const isSelected = perceptionChange === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPerceptionChange(key as 'better' | 'same' | 'worse')}
                      role="radio"
                      aria-checked={isSelected}
                      className={`min-h-[46px] border font-sans-ui text-[14px] font-medium transition-all duration-150 focus:ring-2 focus:ring-[#E34A32] cursor-pointer rounded-[8px] ${
                        isSelected
                          ? 'bg-[#EDEAE2] text-[#131211] border-[#EDEAE2]'
                          : 'bg-[#1C1B1A] text-[#EDEAE2] border-[#EDEAE2]/20 hover:border-[#EDEAE2]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Optional question with 8px radius */}
            <div className="space-y-2">
              <label
                htmlFor="feedback-comment"
                className="block font-editorial text-[20px] text-[#EDEAE2] font-normal"
              >
                ¿Qué te dejó la historia?{' '}
                <span className="text-[14px] font-sans-ui text-[#6B6862] font-normal">
                  (Opcional)
                </span>
              </label>
              <textarea
                id="feedback-comment"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Sensaciones, imágenes que perduran, o cualquier reflexión..."
                className="w-full bg-[#1C1B1A] border border-[#EDEAE2]/15 text-[#EDEAE2] p-4 font-sans-ui text-[15px] placeholder:text-[#6B6862] focus:outline-none focus:border-[#EDEAE2] focus:bg-[#222120] transition-all rounded-[8px] resize-y"
              />
            </div>

            {errorMsg && (
              <p role="alert" className="font-sans-ui text-[13px] text-[#E34A32]">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-sans-ui text-[15px] font-medium bg-[#EDEAE2] text-[#131211] hover:bg-[#E34A32] hover:text-[#EDEAE2] transition-colors duration-200 min-h-[50px] px-8 py-3.5 flex items-center justify-center gap-2 rounded-[8px] cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <span>Guardando reacción...</span>
              ) : (
                <>
                  <span>Enviar mi reacción</span>
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Thank you state with 8px radius */
        <div className="text-center py-8 px-6 border border-[#EDEAE2]/15 bg-[#1C1B1A] rounded-[8px] animate-in fade-in duration-300">
          <p className="font-editorial text-[26px] sm:text-[32px] text-[#EDEAE2] mb-3">
            Gracias por ser uno de los primeros lectores de SYNTA.
          </p>
          <p className="font-editorial text-[18px] text-[#9E9A92]">
            Tu perspectiva es fundamental en la construcción de esta nueva categoría.
          </p>
        </div>
      )}
    </section>
  );
};
