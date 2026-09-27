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
    <footer className="py-14 px-5 sm:px-8 border-t border-[#EDEAE2]/10 bg-[#131211]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Brand identity */}
        <div className="space-y-1">
          <div className="font-editorial text-2xl font-medium tracking-tight text-[#EDEAE2] flex items-center gap-2">
            <span>SYNTA</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E34A32]" />
          </div>
          <p className="font-editorial italic text-[15px] text-[#9E9A92]">
            Historias de otro origen.
          </p>
        </div>

        {/* Minimal links */}
        <nav
          aria-label="Enlaces secundarios del sitio"
          className="flex flex-wrap items-center gap-6 sm:gap-8 font-sans-ui text-[13px] text-[#9E9A92]"
        >
          <button
            onClick={onOpenManifesto}
            className="hover:text-[#EDEAE2] transition-colors focus:ring-1 focus:ring-[#E34A32] cursor-pointer p-1 rounded-[8px]"
          >
            Manifiesto
          </button>

          <button
            onClick={onOpenPrivacy}
            className="hover:text-[#EDEAE2] transition-colors focus:ring-1 focus:ring-[#E34A32] cursor-pointer p-1 rounded-[8px]"
          >
            Privacidad
          </button>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#EDEAE2] transition-colors focus:ring-1 focus:ring-[#E34A32] p-1 rounded-[8px]"
          >
            Instagram
          </a>

          <a
            href="mailto:contacto@synta.editorial"
            className="hover:text-[#EDEAE2] transition-colors focus:ring-1 focus:ring-[#E34A32] p-1 rounded-[8px]"
          >
            Contacto
          </a>
        </nav>

        {/* Copyright */}
        <div className="font-sans-ui text-[12px] text-[#6B6862]">
          © {new Date().getFullYear()} SYNTA Editorial.
        </div>
      </div>
    </footer>
  );
};
