'use client';

import React from 'react';

interface CatalogSectionProps {
  onOpenStory: () => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  onOpenStory,
}) => {
  const items = [
    {
      num: '001',
      title: 'Todo lo que falta',
      status: 'Disponible',
      isAvailable: true,
      author: 'NOMA',
    },
    {
      num: '002',
      title: '████████████████',
      status: 'Próximamente',
      isAvailable: false,
      author: 'En edición',
    },
    {
      num: '003',
      title: '███████████',
      status: 'En desarrollo',
      isAvailable: false,
      author: 'En génesis',
    },
    {
      num: '004',
      title: '██████████████',
      status: '—',
      isAvailable: false,
      author: '—',
    },
  ];

  return (
    <section
      id="catalogo"
      className="py-24 sm:py-36 px-5 sm:px-8 max-w-5xl mx-auto border-t border-white/20 text-left"
      aria-labelledby="catalog-heading"
    >
      {/* Editorial Headline */}
      <div className="mb-14 sm:mb-18 text-left">
        <div className="font-sans-ui text-[16px] tracking-[0.2em] uppercase text-white mb-3 font-semibold">
          CATÁLOGO NACIENTE
        </div>
        <h2
          id="catalog-heading"
          className="font-editorial text-[38px] sm:text-[50px] md:text-[62px] leading-[1.05] tracking-[-0.03em] font-normal text-white text-left"
        >
          Esto apenas comienza.
        </h2>
      </div>

      {/* Catalog items list */}
      <div className="divide-y divide-white/20 border-y border-white/20 text-left">
        {items.map((item) => (
          <div
            key={item.num}
            onClick={item.isAvailable ? onOpenStory : undefined}
            className={`py-6 sm:py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors rounded-[8px] px-3 -mx-3 ${
              item.isAvailable
                ? 'cursor-pointer hover:bg-white/5 group'
                : 'cursor-default'
            }`}
          >
            {/* Number and Title */}
            <div className="flex items-baseline gap-6 sm:gap-10 text-left">
              <span className="font-sans-ui text-[16px] font-mono tracking-wider text-white">
                {item.num}
              </span>
              <div className="text-left">
                <span
                  className={`font-editorial text-[22px] sm:text-[26px] leading-tight block ${
                    item.isAvailable
                      ? 'text-white group-hover:text-[#E34A32] transition-colors'
                      : 'text-white tracking-wider select-none'
                  }`}
                >
                  {item.title}
                </span>
                <span className="font-sans-ui text-[16px] uppercase tracking-wider text-white block mt-1">
                  {item.author}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 self-start sm:self-auto pl-12 sm:pl-0">
              {item.isAvailable ? (
                <span className="font-sans-ui text-[16px] font-medium tracking-wide text-white px-3.5 py-1.5 border border-white/30 rounded-[8px] bg-black group-hover:border-[#E34A32] transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E34A32]" />
                  {item.status}
                </span>
              ) : (
                <span className="font-sans-ui text-[16px] tracking-wide text-white px-3.5 py-1.5 font-mono border border-white/20 rounded-[8px] bg-black">
                  {item.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
