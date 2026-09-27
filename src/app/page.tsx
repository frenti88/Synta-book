'use client';

import React, { useState, useEffect } from 'react';
import { firstStory } from '@/lib/story';
import { trackEvent, isStoryUnlocked } from '@/lib/analytics';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { BreathingQuote } from '@/components/BreathingQuote';
import { BookFeature } from '@/components/BookFeature';
import { FirstGenerationSection } from '@/components/FirstGenerationSection';
import { CatalogSection } from '@/components/CatalogSection';
import { AuthorsArchiveSection } from '@/components/AuthorsArchiveSection';
import { ManifestoSection } from '@/components/ManifestoSection';
import { CommunitySection } from '@/components/CommunitySection';
import { Footer } from '@/components/Footer';
import { UnlockDrawer } from '@/components/UnlockDrawer';
import { Reader } from '@/components/Reader';
import { PrivacyModal } from '@/components/PrivacyModal';
import { ManifestoModal } from '@/components/ManifestoModal';

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasStartedReading, setHasStartedReading] = useState(false);
  const [isUnlockDrawerOpen, setIsUnlockDrawerOpen] = useState(false);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isManifestoModalOpen, setIsManifestoModalOpen] = useState(false);

  useEffect(() => {
    trackEvent('landing_view', { path: '/' }, { oncePerSession: true });

    if (typeof window !== 'undefined') {
      const unlocked = isStoryUnlocked();
      setIsUnlocked(unlocked);

      const savedScroll = localStorage.getItem(`synta_scroll_${firstStory.id}`);
      if (savedScroll && Number(savedScroll) > 50) {
        setHasStartedReading(true);
        trackEvent('returning_reader', { story_id: firstStory.id }, { oncePerSession: true });
      }
    }
  }, []);

  const handleOpenUnlockOrRead = () => {
    if (isUnlocked) {
      setIsReaderOpen(true);
    } else {
      setIsUnlockDrawerOpen(true);
    }
  };

  const handleUnlockSuccess = () => {
    setIsUnlocked(true);
    setIsUnlockDrawerOpen(false);
    setIsReaderOpen(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#131211] text-[#EDEAE2] flex flex-col font-sans-ui selection:bg-[#E34A32]/30 selection:text-[#EDEAE2]">
      {/* 1. Minimal Header */}
      <Header
        onOpenUnlockOrRead={handleOpenUnlockOrRead}
        isUnlocked={isUnlocked}
        hasStartedReading={hasStartedReading}
        onOpenCommunity={() => scrollToSection('comunidad')}
      />

      {/* Main Narrative Journey */}
      <main id="main-content" className="flex-1">
        {/* 2. Hero: Estás llegando al comienzo de algo */}
        <Hero
          onStartReading={handleOpenUnlockOrRead}
          onDiscoverClick={() => scrollToSection('primer-libro')}
          isUnlocked={isUnlocked}
          hasStartedReading={hasStartedReading}
        />

        {/* 3. Pausa poética: ¿Qué hace real a una historia? */}
        <BreathingQuote />

        {/* 4. Objeto Inaugural 001: Todo lo que falta */}
        <BookFeature
          onUnlockClick={handleOpenUnlockOrRead}
          isUnlocked={isUnlocked}
          hasStartedReading={hasStartedReading}
        />

        {/* 5. Primera Generación: Esta historia todavía casi nadie la conoce */}
        <FirstGenerationSection
          onJoinClick={() => scrollToSection('comunidad')}
        />

        {/* 6. Catálogo Naciente: Esto apenas comienza (001, 002, 003, 004) */}
        <CatalogSection onOpenStory={handleOpenUnlockOrRead} />

        {/* 7. Archivo de Autores: Autores que nunca nacieron */}
        <AuthorsArchiveSection />

        {/* 8. Manifiesto Reducido: Durante siglos, detrás de cada libro hubo alguien */}
        <ManifestoSection
          onOpenFullManifesto={() => setIsManifestoModalOpen(true)}
        />

        {/* 9. Comunidad Final: Lee antes que los demás */}
        <CommunitySection />
      </main>

      {/* 10. Minimal Footer */}
      <Footer
        onOpenManifesto={() => setIsManifestoModalOpen(true)}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
      />

      {/* Modals & Reading Engine */}
      <UnlockDrawer
        isOpen={isUnlockDrawerOpen}
        onClose={() => setIsUnlockDrawerOpen(false)}
        onSuccessUnlock={handleUnlockSuccess}
      />

      <Reader
        story={firstStory}
        isOpen={isReaderOpen}
        onClose={() => {
          setIsReaderOpen(false);
          if (typeof window !== 'undefined') {
            const savedScroll = localStorage.getItem(`synta_scroll_${firstStory.id}`);
            if (savedScroll && Number(savedScroll) > 50) {
              setHasStartedReading(true);
            }
          }
        }}
      />

      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <ManifestoModal
        isOpen={isManifestoModalOpen}
        onClose={() => setIsManifestoModalOpen(false)}
      />
    </div>
  );
}
