'use client';

import React, { useState, useEffect } from 'react';
import { firstStory } from '@/lib/story';
import { trackEvent, isStoryUnlocked } from '@/lib/analytics';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { BreathingQuote } from '@/components/BreathingQuote';
import { BookFeature } from '@/components/BookFeature';
import { FutureSection } from '@/components/FutureSection';
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
    // Record landing view
    trackEvent('landing_view', { path: '/' }, { oncePerSession: true });

    // Check existing unlock status & progress
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
      {/* Editorial Header */}
      <Header
        onOpenUnlockOrRead={handleOpenUnlockOrRead}
        isUnlocked={isUnlocked}
        hasStartedReading={hasStartedReading}
        onOpenCommunity={() => scrollToSection('comunidad')}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          onStartReading={handleOpenUnlockOrRead}
          onDiscoverClick={() => scrollToSection('primer-libro')}
          isUnlocked={isUnlocked}
          hasStartedReading={hasStartedReading}
        />

        {/* 2. Breathing Editorial Phrase */}
        <BreathingQuote />

        {/* 3. Book Presentation & Unlock Block */}
        <BookFeature
          onUnlockClick={handleOpenUnlockOrRead}
          isUnlocked={isUnlocked}
          hasStartedReading={hasStartedReading}
        />

        {/* 4. Future Section: Esto apenas comienza */}
        <FutureSection />

        {/* 5. Condensed Manifesto */}
        <ManifestoSection
          onOpenFullManifesto={() => setIsManifestoModalOpen(true)}
        />

        {/* 6. Community Signup */}
        <CommunitySection />
      </main>

      {/* Editorial Minimal Footer */}
      <Footer
        onOpenManifesto={() => setIsManifestoModalOpen(true)}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
      />

      {/* Modals & Reader Overlay */}
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
