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
      aria-label="Portada del libro: La casa que empezó a olvidarnos. Edición SYNTA 001"
      className={`relative select-none group transition-all duration-500 ease-out rounded-[8px] ${
        onClick ? 'cursor-pointer focus:ring-2 focus:ring-[#E34A32]' : ''
      } ${className}`}
      style={{
        transform: isHovered && onClick ? 'translateY(-6px) rotate(-0.5deg)' : 'translateY(0) rotate(0)',
      }}
    >
      {/* Book cover physical shadow with realistic book cloth texture and 8px radius */}
      <div
        className={`relative bg-[#1C1B1A] text-[#EDEAE2] border border-[#EDEAE2]/15 flex flex-col justify-between p-7 sm:p-9 shadow-[inset_4px_0_12px_rgba(0,0,0,0.7),0_20px_45px_rgba(0,0,0,0.65)] rounded-[8px] overflow-hidden ${
          isHero
            ? 'w-[270px] sm:w-[310px] md:w-[330px] aspect-[1/1.52]'
            : isFeature
            ? 'w-[260px] sm:w-[290px] aspect-[1/1.52]'
            : 'w-[180px] aspect-[1/1.52]'
        }`}
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 20%, rgba(237,234,226,0.03) 0%, transparent 60%)',
        }}
      >
        {/* Physical book spine shadow & hinge indentation */}
        <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-3 sm:left-4 w-[1px] bg-[#EDEAE2]/10 pointer-events-none" />

        {/* Top header identifier */}
        <div className="flex items-center justify-between text-[11px] tracking-[0.22em] uppercase font-sans-ui text-[#9E9A92]">
          <span className="font-semibold tracking-[0.25em] text-[#EDEAE2] flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[#E34A32]" />
            SYNTA 001
          </span>
          <span className="text-[10px] text-[#6B6862] tracking-widest font-mono">NOVELA BREVE</span>
        </div>

        {/* Main Typographic Title with minimal graphic anomaly */}
        <div className="my-auto pl-2">
          <div className="font-editorial text-[31px] sm:text-[36px] leading-[1.08] tracking-[-0.02em] font-normal uppercase text-[#EDEAE2]">
            <div className="transition-opacity duration-300">LA CASA</div>
            <div className="text-[#EDEAE2]/90">QUE EMPEZÓ</div>
            <div className="relative mt-1 inline-block">
              <span className="inline-block transform translate-x-1.5 transition-transform duration-500 group-hover:translate-x-3 text-[#EDEAE2]">
                A OLVI<span className="opacity-25 transition-opacity duration-700 group-hover:opacity-5">D</span>ARNOS
              </span>
              {/* Fine hairline trace indicating memory vanishing */}
              <div className="h-[1px] w-12 bg-[#E34A32] mt-2 opacity-85 rounded-[8px] transition-all duration-500 group-hover:w-16" />
            </div>
          </div>
        </div>

        {/* Bottom subtle metadata */}
        <div className="pt-4 border-t border-[#EDEAE2]/10 flex items-end justify-between font-sans-ui">
          <div className="text-[11px] leading-tight text-[#9E9A92]">
            <p className="font-medium text-[#EDEAE2] tracking-wide">PRIMERA HISTORIA</p>
            <p className="text-[10px] text-[#6B6862] tracking-wider mt-0.5">EDICIÓN DE ACCESO PREVIO</p>
          </div>
          <div className="text-[10px] font-mono tracking-wider text-[#6B6862]">
            2026
          </div>
        </div>
      </div>
    </div>
  );
};
