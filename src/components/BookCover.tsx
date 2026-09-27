'use client';

import React, { useState } from 'react';

interface BookCoverProps {
  size?: 'hero' | 'feature' | 'reader';
  className?: string;
  onClick?: () => void;
}

export const BookCover: React.FC<BookCoverProps> = ({
  size = 'hero',
  className = '',
  onClick,
}) => {
  const isHero = size === 'hero';
  const isFeature = size === 'feature';
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label="Cubierta provisional de muestra editorial: Todo lo que falta por NOMA. SYNTA 001"
      className={`relative select-none group transition-all duration-500 ease-out rounded-[8px] ${
        onClick ? 'cursor-pointer focus:ring-2 focus:ring-[#E34A32]' : ''
      } ${className}`}
      style={{
        transform: isHovered && onClick ? 'translateY(-6px) rotate(-0.5deg)' : 'translateY(0) rotate(0)',
      }}
    >
      {/* Proof / Advance reading copy cover container */}
      <div
        className={`relative bg-[#191817] text-[#EDEAE2] border border-[#EDEAE2]/20 flex flex-col justify-between p-7 sm:p-9 shadow-[inset_4px_0_12px_rgba(0,0,0,0.7),0_20px_45px_rgba(0,0,0,0.65)] rounded-[8px] overflow-hidden ${
          isHero
            ? 'w-[270px] sm:w-[310px] md:w-[330px] aspect-[1/1.52]'
            : isFeature
            ? 'w-[260px] sm:w-[290px] aspect-[1/1.52]'
            : 'w-[180px] aspect-[1/1.52]'
        }`}
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 15%, rgba(237,234,226,0.035) 0%, transparent 70%)',
        }}
      >
        {/* Fine proof paper hinge and binding line */}
        <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-3 sm:left-4 w-[1px] bg-[#EDEAE2]/10 pointer-events-none" />

        {/* Top header identifier */}
        <div className="flex items-center justify-between font-sans-ui text-[11px] tracking-[0.22em] text-[#9E9A92] border-b border-[#EDEAE2]/10 pb-3">
          <span className="font-semibold tracking-[0.25em] text-[#EDEAE2] flex items-center gap-1.5 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E34A32]" />
            SYNTA 001
          </span>
          <span className="text-[9px] sm:text-[10px] text-[#6B6862] font-mono tracking-widest uppercase">
            GALERADA · MUESTRA
          </span>
        </div>

        {/* Central Typographic Composition in Sentence / Title Case */}
        <div className="my-auto pl-2 py-4">
          {/* Subtle proof label */}
          <div className="font-mono text-[9px] tracking-[0.28em] text-[#6B6862] uppercase mb-4 opacity-80">
            [ COPIA DE LECTURA ANTICIPADA ]
          </div>

          {/* Title: 'Todo lo que falta' - Newsreader serif, NOT all-caps */}
          <div className="font-editorial text-[34px] sm:text-[40px] md:text-[42px] leading-[1.08] font-normal tracking-[-0.025em] text-[#EDEAE2]">
            <span className="block">Todo</span>
            <span className="block text-[#EDEAE2]/85">lo que</span>
            {/* Subtle anomaly: faint ink interruption on the word 'falta' */}
            <span className="block relative inline-block mt-1">
              <span className="relative">
                fa<span className="opacity-35 transition-opacity duration-700 group-hover:opacity-10">l</span>ta
              </span>
              <span className="inline-block w-2 h-[1px] bg-[#E34A32] ml-2 mb-1.5 opacity-80" />
            </span>
          </div>

          {/* Editorial classification */}
          <div className="mt-5 text-[11px] font-sans-ui text-[#9E9A92] tracking-wider italic">
            Edición provisional no venal
          </div>
        </div>

        {/* Bottom Metadata: NOMA · Novela breve · 2026 */}
        <div className="pt-4 border-t border-[#EDEAE2]/10 flex flex-col gap-1.5 font-sans-ui">
          <div className="text-[12px] sm:text-[13px] tracking-wide text-[#EDEAE2] font-medium">
            NOMA · Novela breve · 2026
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#6B6862] font-mono tracking-wider">
            <span>TEXTO DE ENTRADA</span>
            <span>PRIMEROS LECTORES</span>
          </div>
        </div>
      </div>
    </div>
  );
};
