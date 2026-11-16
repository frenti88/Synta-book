'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  AudioChapter,
  AudiobookManifest,
  AudioProgressStorage,
} from '@/types/audio';
import { trackEvent } from '@/lib/analytics';

interface AudioPlayerContextType {
  manifest: AudiobookManifest | null;
  currentChapter: AudioChapter | null;
  currentChapterIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  hasStartedAudio: boolean;
  isPlayerOpen: boolean;
  isLoadingAudio: boolean;
  savedProgress: AudioProgressStorage | null;
  playAudio: () => Promise<void>;
  pauseAudio: () => void;
  togglePlay: () => void;
  seekTo: (seconds: number) => void;
  skipSeconds: (delta: number) => void;
  setSpeed: (rate: number) => void;
  changeChapter: (index: number, autoPlay?: boolean) => void;
  openPlayer: (targetChapterIndex?: number) => void;
  closePlayer: () => void;
  resumeSavedAudio: () => void;
}

const STORAGE_KEY = 'synta_audio_progress';

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined
);

// Fallback initial manifest while dynamic manifest loads
const DEFAULT_MANIFEST: AudiobookManifest = {
  id: 'synta-001',
  title: 'Todo lo que falta',
  author: 'NOMA',
  voice: 'Voz oficial · SYNTA',
  language: 'es',
  edition: 'SYNTA 001',
  totalDuration: 720,
  totalDurationFormatted: '12 min',
  chapters: [
    {
      number: 1,
      id: 'capitulo-1',
      title: 'El clavo de latón',
      src: '/audio/synta-001/chapter-01.mp3',
      duration: 122,
      durationFormatted: '02:02',
    },
    {
      number: 2,
      id: 'capitulo-2',
      title: 'La vajilla impar',
      src: '/audio/synta-001/chapter-02.mp3',
      duration: 137,
      durationFormatted: '02:17',
    },
    {
      number: 3,
      id: 'capitulo-3',
      title: 'El margen raspado',
      src: '/audio/synta-001/chapter-03.mp3',
      duration: 150,
      durationFormatted: '02:30',
    },
    {
      number: 4,
      id: 'capitulo-4',
      title: 'La resonancia y el peso',
      src: '/audio/synta-001/chapter-04.mp3',
      duration: 137,
      durationFormatted: '02:17',
    },
    {
      number: 5,
      id: 'capitulo-5',
      title: 'La cazadora doblada',
      src: '/audio/synta-001/chapter-05.mp3',
      duration: 120,
      durationFormatted: '02:00',
    },
    {
      number: 6,
      id: 'capitulo-6',
      title: 'El aire frío',
      src: '/audio/synta-001/chapter-06.mp3',
      duration: 70,
      durationFormatted: '01:10',
    },
  ],
};

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [manifest, setManifest] = useState<AudiobookManifest>(DEFAULT_MANIFEST);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(DEFAULT_MANIFEST.chapters[0].duration);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const [savedProgress, setSavedProgress] = useState<AudioProgressStorage | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastSavedTimeRef = useRef(0);
  const milestonesFiredRef = useRef<Record<string, boolean>>({});
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const manifestRef = useRef<AudiobookManifest>(manifest);
  const currentChapterIndexRef = useRef<number>(currentChapterIndex);
  const playbackRateRef = useRef<number>(playbackRate);
  const isPlayingRef = useRef<boolean>(isPlaying);

  useEffect(() => {
    manifestRef.current = manifest;
  }, [manifest]);

  useEffect(() => {
    currentChapterIndexRef.current = currentChapterIndex;
  }, [currentChapterIndex]);

  useEffect(() => {
    playbackRateRef.current = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // 1. Fetch live manifest from static json
  useEffect(() => {
    fetch('/audio/synta-001/manifest.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: AudiobookManifest | null) => {
        if (data && data.chapters && data.chapters.length > 0) {
          setManifest(data);
        }
      })
      .catch(() => {});
  }, []);

  // 2. Restore saved progress on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('synta_audio_voice');
      } catch {}
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: AudioProgressStorage = JSON.parse(stored);
          if (parsed && parsed.bookId === 'synta-001') {
            setSavedProgress(parsed);
            if (parsed.playbackRate) setPlaybackRate(parsed.playbackRate);
            if (
              parsed.chapterNumber >= 1 &&
              parsed.chapterNumber <= DEFAULT_MANIFEST.chapters.length
            ) {
              const idx = parsed.chapterNumber - 1;
              setCurrentChapterIndex(idx);
              currentChapterIndexRef.current = idx;
            }
          }
        }
      } catch {}
    }
  }, []);

  const currentChapter = manifest.chapters[currentChapterIndex] || manifest.chapters[0];

  const startPlaybackOnChapter = useCallback(
    async (index: number, seekSeconds?: number) => {
      const audio = audioRef.current;
      const chapters = manifestRef.current.chapters;
      const target = chapters[index];
      if (!audio || !target) return;

      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }

      setCurrentChapterIndex(index);
      currentChapterIndexRef.current = index;
      setHasStartedAudio(true);
      setIsLoadingAudio(true);

      const currentPath = audio.src
        ? new URL(audio.src, window.location.href).pathname
        : '';

      if (currentPath !== target.src) {
        audio.src = target.src;
        audio.load();
        setDuration(target.duration);
        setCurrentTime(seekSeconds ?? 0);
      }

      audio.playbackRate = playbackRateRef.current;

      if (typeof seekSeconds === 'number' && seekSeconds > 0) {
        const applySeek = () => {
          audio.currentTime = Math.min(seekSeconds, audio.duration || target.duration);
        };
        if (audio.readyState >= 1) {
          applySeek();
        } else {
          audio.addEventListener('loadedmetadata', applySeek, { once: true });
        }
      }

      try {
        await audio.play();
        setIsPlaying(true);
        setIsLoadingAudio(false);
        trackEvent('audio_play', {
          chapter: target.number,
          title: target.title,
        });
      } catch {
        setIsPlaying(false);
        setIsLoadingAudio(false);
      }
    },
    []
  );

  // 3. Initialize single persistent Audio element once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const initialChapter = manifestRef.current.chapters[currentChapterIndexRef.current];
    if (initialChapter) {
      audio.src = initialChapter.src;
    }

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsLoadingAudio(false);
    };

    const handleTimeUpdate = () => {
      const cur = audio.currentTime;
      setCurrentTime(cur);

      const chIdx = currentChapterIndexRef.current;
      const ch = manifestRef.current.chapters[chIdx];
      if (!ch) return;

      if (Math.abs(cur - lastSavedTimeRef.current) > 3) {
        lastSavedTimeRef.current = cur;
        const progressData: AudioProgressStorage = {
          bookId: 'synta-001',
          chapterNumber: chIdx + 1,
          currentTime: Math.round(cur),
          duration: Math.round(audio.duration || ch.duration),
          playbackRate: audio.playbackRate,
          updatedAt: Date.now(),
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
          setSavedProgress(progressData);
        } catch {}

        const pct = Math.round((cur / (audio.duration || ch.duration)) * 100);
        const milestoneKey = `ch${chIdx + 1}`;
        if (pct >= 25 && !milestonesFiredRef.current[`${milestoneKey}_25`]) {
          milestonesFiredRef.current[`${milestoneKey}_25`] = true;
          trackEvent('audio_25', { chapter: chIdx + 1 }, { oncePerSession: true });
        }
        if (pct >= 50 && !milestonesFiredRef.current[`${milestoneKey}_50`]) {
          milestonesFiredRef.current[`${milestoneKey}_50`] = true;
          trackEvent('audio_50', { chapter: chIdx + 1 }, { oncePerSession: true });
        }
        if (pct >= 75 && !milestonesFiredRef.current[`${milestoneKey}_75`]) {
          milestonesFiredRef.current[`${milestoneKey}_75`] = true;
          trackEvent('audio_75', { chapter: chIdx + 1 }, { oncePerSession: true });
        }
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setHasStartedAudio(true);
      setIsLoadingAudio(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      const chIdx = currentChapterIndexRef.current;
      const chapters = manifestRef.current.chapters;
      setIsPlaying(false);
      trackEvent('audio_complete', { chapter: chIdx + 1 });

      // Automatically continue narrating the remaining chapters with a 1.5s editorial pause
      if (chIdx < chapters.length - 1) {
        advanceTimerRef.current = setTimeout(() => {
          startPlaybackOnChapter(chIdx + 1, 0);
        }, 1500);
      }
    };

    const handleWaiting = () => {
      setIsLoadingAudio(true);
    };

    const handleCanPlay = () => {
      setIsLoadingAudio(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [startPlaybackOnChapter]);

  const playAudio = useCallback(async () => {
    await startPlaybackOnChapter(currentChapterIndexRef.current);
  }, [startPlaybackOnChapter]);

  const pauseAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    audio.pause();
    setIsPlaying(false);
    trackEvent('audio_pause', {
      chapter: currentChapterIndexRef.current + 1,
      currentTime: Math.round(audio.currentTime),
    });
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlayingRef.current) {
      pauseAudio();
    } else {
      playAudio();
    }
  }, [pauseAudio, playAudio]);

  const seekTo = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const ch = manifestRef.current.chapters[currentChapterIndexRef.current];
    const maxDur = audio.duration || ch?.duration || duration;
    audio.currentTime = Math.max(0, Math.min(seconds, maxDur));
    setCurrentTime(audio.currentTime);
  }, [duration]);

  const skipSeconds = useCallback(
    (delta: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      seekTo(audio.currentTime + delta);
    },
    [seekTo]
  );

  const setSpeed = useCallback((rate: number) => {
    setPlaybackRate(rate);
    playbackRateRef.current = rate;
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    trackEvent('audio_speed_change', { rate });
  }, []);

  const changeChapter = useCallback(
    (index: number, autoPlay: boolean = true) => {
      const chapters = manifestRef.current.chapters;
      if (index < 0 || index >= chapters.length) return;
      const target = chapters[index];
      trackEvent('audio_chapter_change', {
        chapter: target.number,
        title: target.title,
      });

      if (autoPlay || isPlayingRef.current) {
        startPlaybackOnChapter(index, 0);
      } else {
        setCurrentChapterIndex(index);
        currentChapterIndexRef.current = index;
        setCurrentTime(0);
        setDuration(target.duration);
        if (audioRef.current) {
          audioRef.current.src = target.src;
          audioRef.current.load();
        }
      }
    },
    [startPlaybackOnChapter]
  );

  // Direct playback on Listen button click — no blocking modal panel
  const openPlayer = useCallback(
    (targetChapterIndex?: number) => {
      if (typeof targetChapterIndex === 'number') {
        startPlaybackOnChapter(targetChapterIndex, 0);
        trackEvent('audio_open', { chapter: targetChapterIndex + 1 });
        return;
      }

      if (!hasStartedAudio && savedProgress) {
        const chIdx = Math.max(
          0,
          Math.min(savedProgress.chapterNumber - 1, manifestRef.current.chapters.length - 1)
        );
        startPlaybackOnChapter(chIdx, savedProgress.currentTime || 0);
        trackEvent('audio_resume', {
          chapter: savedProgress.chapterNumber,
          time: savedProgress.currentTime,
        });
        return;
      }

      startPlaybackOnChapter(currentChapterIndexRef.current);
      trackEvent('audio_open', { chapter: currentChapterIndexRef.current + 1 });
    },
    [hasStartedAudio, savedProgress, startPlaybackOnChapter]
  );

  const closePlayer = useCallback(() => {
    pauseAudio();
    setHasStartedAudio(false);
  }, [pauseAudio]);

  const resumeSavedAudio = useCallback(() => {
    openPlayer();
  }, [openPlayer]);

  // 4. Media Session API
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator) || !currentChapter) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: `${currentChapter.title} — Cap. ${currentChapter.number}`,
      artist: 'NOMA',
      album: 'Todo lo que falta — SYNTA 001',
      artwork: [
        {
          src: '/images/todo-lo-que-falta-cover.png',
          sizes: '768x1024',
          type: 'image/png',
        },
      ],
    });

    navigator.mediaSession.setActionHandler('play', () => playAudio());
    navigator.mediaSession.setActionHandler('pause', () => pauseAudio());
    navigator.mediaSession.setActionHandler('seekbackward', () => skipSeconds(-15));
    navigator.mediaSession.setActionHandler('seekforward', () => skipSeconds(15));
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      if (currentChapterIndexRef.current > 0) {
        changeChapter(currentChapterIndexRef.current - 1, true);
      }
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      if (currentChapterIndexRef.current < manifestRef.current.chapters.length - 1) {
        changeChapter(currentChapterIndexRef.current + 1, true);
      }
    });
  }, [currentChapter, playAudio, pauseAudio, skipSeconds, changeChapter]);

  return (
    <AudioPlayerContext.Provider
      value={{
        manifest,
        currentChapter,
        currentChapterIndex,
        isPlaying,
        currentTime,
        duration,
        playbackRate,
        hasStartedAudio,
        isPlayerOpen: hasStartedAudio,
        isLoadingAudio,
        savedProgress,
        playAudio,
        pauseAudio,
        togglePlay,
        seekTo,
        skipSeconds,
        setSpeed,
        changeChapter,
        openPlayer,
        closePlayer,
        resumeSavedAudio,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
