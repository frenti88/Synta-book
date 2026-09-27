'use client';

import React, { useState } from 'react';
import Image from 'next/image';

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

  // Responsive container sizing matching editorial hierarchy
  const containerWidthClass = isHero
    ? 'w-[260px] sm:w-[305px] md:w-[335px]'
    : isFeature
    ? 'w-[250px] sm:w-[295px] md:w-[325px]'
    : 'w-[180px]';

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
      aria-label="Portada del libro Todo lo que falta por NOMA — SYNTA 001. Abrir lectura."
      className={`relative select-none group transition-all duration-500 ease-out rounded-[8px] ${
        onClick ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E34A32]' : ''
      } ${className}`}
      style={{
        transform: isHovered && onClick ? 'translateY(-8px) scale(1.015)' : 'translateY(0) scale(1)',
      }}
    >
      {/* Subtle ambient editorial glow behind the book when hovered */}
      <div
        className="pointer-events-none absolute -inset-6 bg-[#E34A32]/12 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"
        aria-hidden="true"
      />

      {/* Book Cover Frame & Image */}
      <div className={`relative ${containerWidthClass} transition-transform duration-500 ease-out`}>
        <Image
          src="/images/todo-lo-que-falta-cover.png"
          alt="Portada oficial de Todo lo que falta por NOMA — SYNTA 001"
          width={768}
          height={1024}
          priority={isHero}
          sizes="(max-width: 640px) 270px, (max-width: 1024px) 320px, 350px"
          className="w-full h-auto object-contain select-none drop-shadow-[0_18px_40px_rgba(0,0,0,0.85)] group-hover:drop-shadow-[0_28px_54px_rgba(0,0,0,0.95)] transition-all duration-500 rounded-[8px]"
        />
      </div>
    </div>
  );
};
