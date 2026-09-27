'use client';

import React from 'react';

interface FooterProps {
  onOpenManifesto: () => void;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenManifesto,
  onOpenPrivacy,
}) => {
  return (
    <footer className="py-16 px-5 sm:px-8 border-t border-white/20 bg-black text-left">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-left">
        {/* Brand identity - left-aligned */}
        <div className="space-y-1.5 text-left">
          <div className="font-editorial text-2xl sm:text-[28px] font-medium tracking-tight text-white flex items-center gap-2 text-left">
            <span>SYNTA</span>
            <span className="w-2 h-2 rounded-full bg-[#E34A32]" />
          </div>
          <p className="font-editorial italic text-[16px] text-white text-left">
            Historias de otro origen.
          </p>
        </div>

        {/* Minimal links */}
        <nav
          aria-label="Enlaces secundarios del sitio"
          className="flex flex-wrap items-center gap-6 sm:gap-8 font-sans-ui text-[16px] text-white text-left"
        >
          <button
            onClick={onOpenManifesto}
            className="hover:text-[#E34A32] transition-colors focus:ring-1 focus:ring-[#E34A32] cursor-pointer p-1 rounded-[8px]"
          >
            Manifiesto
          </button>

          <button
            onClick={onOpenPrivacy}
            className="hover:text-[#E34A32] transition-colors focus:ring-1 focus:ring-[#E34A32] cursor-pointer p-1 rounded-[8px]"
          >
            Privacidad
          </button>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#E34A32] transition-colors focus:ring-1 focus:ring-[#E34A32] p-1 rounded-[8px]"
          >
            Instagram
          </a>

          <a
            href="mailto:contacto@synta.editorial"
            className="hover:text-[#E34A32] transition-colors focus:ring-1 focus:ring-[#E34A32] p-1 rounded-[8px]"
          >
            Contacto
          </a>
        </nav>

        {/* Copyright */}
        <div className="font-sans-ui text-[16px] text-white text-left">
          © {new Date().getFullYear()} SYNTA Editorial.
        </div>
      </div>
    </footer>
  );
};
