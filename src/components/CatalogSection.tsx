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
      title: 'La casa que empezó a olvidarnos',
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
      className="py-24 sm:py-36 px-5 sm:px-8 max-w-5xl mx-auto border-t border-[#EDEAE2]/10"
      aria-labelledby="catalog-heading"
    >
      {/* Editorial Headline */}
      <div className="mb-14 sm:mb-18 text-left">
        <div className="font-sans-ui text-[12px] tracking-[0.22em] uppercase text-[#9E9A92] mb-3 font-semibold">
          CATÁLOGO NACIENTE
        </div>
        <h2
          id="catalog-heading"
          className="font-editorial text-[42px] sm:text-[54px] md:text-[66px] leading-[1.02] tracking-[-0.03em] font-normal text-[#EDEAE2]"
        >
          Esto apenas comienza.
        </h2>
      </div>

      {/* Catalog items list */}
      <div className="divide-y divide-[#EDEAE2]/10 border-y border-[#EDEAE2]/10">
        {items.map((item) => (
          <div
            key={item.num}
            onClick={item.isAvailable ? onOpenStory : undefined}
            className={`py-6 sm:py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors rounded-[8px] px-3 -mx-3 ${
              item.isAvailable
                ? 'cursor-pointer hover:bg-[#181716]/60 group'
                : 'opacity-55 cursor-default'
            }`}
          >
            {/* Number and Title */}
            <div className="flex items-baseline gap-6 sm:gap-10">
              <span className="font-sans-ui text-[14px] sm:text-[15px] font-mono tracking-wider text-[#9E9A92]">
                {item.num}
              </span>
              <div>
                <span
                  className={`font-editorial text-[22px] sm:text-[26px] leading-tight block ${
                    item.isAvailable
                      ? 'text-[#EDEAE2] group-hover:text-[#E34A32] transition-colors'
                      : 'text-[#9E9A92] tracking-wider select-none'
                  }`}
                >
                  {item.title}
                </span>
                <span className="font-sans-ui text-[11px] uppercase tracking-wider text-[#6B6862] block mt-1">
                  {item.author}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 self-start sm:self-auto pl-12 sm:pl-0">
              {item.isAvailable ? (
                <span className="font-sans-ui text-[12px] font-medium tracking-wide text-[#EDEAE2] px-3 py-1 border border-[#EDEAE2]/20 rounded-[8px] bg-[#181716] group-hover:border-[#E34A32] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E34A32]" />
                  {item.status}
                </span>
              ) : (
                <span className="font-sans-ui text-[12px] tracking-wide text-[#6B6862] px-3 py-1 font-mono">
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
