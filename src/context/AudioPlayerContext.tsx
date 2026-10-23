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
  AudioVoice,
} from '@/types/audio';
import { trackEvent } from '@/lib/analytics';

export const NOMA_FEMININE_VOICES: AudioVoice[] = [
  {
    id: 'noma-intima',
    name: 'NOMA · Íntima',
    subtitle: 'Voz femenina oficial',
    gender: 'female',
    description: 'Voz femenina adulta, sobria y reflexiva. Creada para la intimidad, la ausencia y la memoria.',
  },
  {
    id: 'noma-serena',
    name: 'NOMA · Serena',
    subtitle: 'Voz femenina pausada',
    gender: 'female',
    description: 'Cadencia dilatada y lectura reposada, con silencios amplificados para una escucha meditativa.',
  },
  {
    id: 'noma-calida',
    name: 'NOMA · Cálida',
    subtitle: 'Voz femenina natural',
    gender: 'female',
    description: 'Tono femenino suave, natural y de articulación limpia, cercano y reconfortante.',
  },
];

interface AudioPlayerContextType {
  manifest: AudiobookManifest | null;
  currentChapter: AudioChapter | null;
  currentChapterIndex: number;
  availableVoices: AudioVoice[];
  selectedVoice: AudioVoice;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  isPlayerOpen: boolean;
  hasStartedAudio: boolean;
  savedProgress: AudioProgressStorage | null;
  isLoadingAudio: boolean;
  playAudio: () => Promise<void>;
  pauseAudio: () => void;
  togglePlay: () => void;
  seekTo: (seconds: number) => void;
  skipSeconds: (delta: number) => void;
  setSpeed: (rate: number) => void;
  setVoice: (voiceId: string) => void;
  changeChapter: (index: number, autoPlay?: boolean) => void;
  openPlayer: (targetChapterIndex?: number) => void;
  closePlayer: () => void;
  resumeSavedAudio: () => void;
}

const STORAGE_KEY = 'synta_audio_progress';
const VOICE_STORAGE_KEY = 'synta_audio_voice';

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined
);

// Fallback initial manifest while dynamic manifest loads
const DEFAULT_MANIFEST: AudiobookManifest = {
  id: 'synta-001',
  title: 'Todo lo que falta',
  author: 'NOMA',
  voice: 'NOMA (Femenina)',
  language: 'es',
  edition: 'SYNTA 001',
  totalDuration: 2280,
  totalDurationFormatted: '38 min',
  voices: NOMA_FEMININE_VOICES,
  chapters: [
    {
      number: 1,
      id: 'capitulo-1',
      title: 'El clavo de latón',
      src: '/audio/synta-001/chapter-01.mp3',
      duration: 385,
      durationFormatted: '06:25',
    },
    {
      number: 2,
      id: 'capitulo-2',
      title: 'La vajilla impar',
      src: '/audio/synta-001/chapter-02.mp3',
      duration: 410,
      durationFormatted: '06:50',
    },
    {
      number: 3,
      id: 'capitulo-3',
      title: 'El margen raspado',
      src: '/audio/synta-001/chapter-03.mp3',
      duration: 440,
      durationFormatted: '07:20',
    },
    {
      number: 4,
      id: 'capitulo-4',
      title: 'La resonancia y el peso',
      src: '/audio/synta-001/chapter-04.mp3',
      duration: 365,
      durationFormatted: '06:05',
    },
    {
      number: 5,
      id: 'capitulo-5',
      title: 'La cazadora doblada',
      src: '/audio/synta-001/chapter-05.mp3',
      duration: 395,
      durationFormatted: '06:35',
    },
    {
      number: 6,
      id: 'capitulo-6',
      title: 'El aire frío',
      src: '/audio/synta-001/chapter-06.mp3',
      duration: 285,
      durationFormatted: '04:45',
    },
  ],
};

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [manifest, setManifest] = useState<AudiobookManifest>(DEFAULT_MANIFEST);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('noma-intima');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(DEFAULT_MANIFEST.chapters[0].duration);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const [savedProgress, setSavedProgress] = useState<AudioProgressStorage | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastSavedTimeRef = useRef(0);
  const milestonesFiredRef = useRef<Record<string, boolean>>({});

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

  // 2. Restore saved progress and voice on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedVoice = localStorage.getItem(VOICE_STORAGE_KEY);
        if (storedVoice) {
          setSelectedVoiceId(storedVoice);
        }

        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: AudioProgressStorage = JSON.parse(stored);
          if (parsed && parsed.bookId === 'synta-001') {
            setSavedProgress(parsed);
            if (parsed.voiceId) setSelectedVoiceId(parsed.voiceId);
            if (parsed.playbackRate) setPlaybackRate(parsed.playbackRate);
            if (
              parsed.chapterNumber >= 1 &&
              parsed.chapterNumber <= DEFAULT_MANIFEST.chapters.length
            ) {
              setCurrentChapterIndex(parsed.chapterNumber - 1);
            }
          }
        }
      } catch {}
    }
  }, []);

  const availableVoices =
    manifest.voices && manifest.voices.length > 0
      ? manifest.voices
      : NOMA_FEMININE_VOICES;

  const selectedVoice =
    availableVoices.find((v) => v.id === selectedVoiceId) || availableVoices[0];

  const setVoice = useCallback((voiceId: string) => {
    setSelectedVoiceId(voiceId);
    try {
      localStorage.setItem(VOICE_STORAGE_KEY, voiceId);
    } catch {}
    trackEvent('audio_voice_change', { voice_id: voiceId });
  }, []);

  const currentChapter = manifest.chapters[currentChapterIndex] || manifest.chapters[0];

  // 3. Initialize audio element
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsLoadingAudio(false);
    };

    const handleTimeUpdate = () => {
      const cur = audio.currentTime;
      setCurrentTime(cur);

      // Throttled persistence every 3 seconds
      if (Math.abs(cur - lastSavedTimeRef.current) > 3) {
        lastSavedTimeRef.current = cur;
        const progressData: AudioProgressStorage = {
          bookId: 'synta-001',
          chapterNumber: currentChapterIndex + 1,
          currentTime: Math.round(cur),
          duration: Math.round(audio.duration || currentChapter.duration),
          playbackRate: audio.playbackRate,
          updatedAt: Date.now(),
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
          setSavedProgress(progressData);
        } catch {}

        // Check milestones: 25%, 50%, 75%
        const pct = Math.round((cur / (audio.duration || currentChapter.duration)) * 100);
        const milestoneKey = `ch${currentChapterIndex + 1}`;
        if (pct >= 25 && !milestonesFiredRef.current[`${milestoneKey}_25`]) {
          milestonesFiredRef.current[`${milestoneKey}_25`] = true;
          trackEvent('audio_25', { chapter: currentChapterIndex + 1 }, { oncePerSession: true });
        }
        if (pct >= 50 && !milestonesFiredRef.current[`${milestoneKey}_50`]) {
          milestonesFiredRef.current[`${milestoneKey}_50`] = true;
          trackEvent('audio_50', { chapter: currentChapterIndex + 1 }, { oncePerSession: true });
        }
        if (pct >= 75 && !milestonesFiredRef.current[`${milestoneKey}_75`]) {
          milestonesFiredRef.current[`${milestoneKey}_75`] = true;
          trackEvent('audio_75', { chapter: currentChapterIndex + 1 }, { oncePerSession: true });
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
      setIsPlaying(false);
      trackEvent('audio_complete', { chapter: currentChapterIndex + 1 });

      // If next chapter exists, advance seamlessly with 1.8s breath
      if (currentChapterIndex < manifest.chapters.length - 1) {
        setTimeout(() => {
          changeChapter(currentChapterIndex + 1, true);
        }, 1800);
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
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentChapterIndex, manifest.chapters.length]);

  // 4. Update audio src when chapter changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentChapter) return;

    const currentSrc = audio.src ? new URL(audio.src, window.location.href).pathname : '';
    if (currentSrc !== currentChapter.src) {
      audio.src = currentChapter.src;
      audio.playbackRate = playbackRate;
      setDuration(currentChapter.duration);
      setCurrentTime(0);
    }
  }, [currentChapter, playbackRate]);

  // 5. Media Session API
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

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

    navigator.mediaSession.setActionHandler('play', () => {
      playAudio();
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      pauseAudio();
    });
    navigator.mediaSession.setActionHandler('seekbackward', () => {
      skipSeconds(-15);
    });
    navigator.mediaSession.setActionHandler('seekforward', () => {
      skipSeconds(15);
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      if (currentChapterIndex > 0) {
        changeChapter(currentChapterIndex - 1, true);
      }
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      if (currentChapterIndex < manifest.chapters.length - 1) {
        changeChapter(currentChapterIndex + 1, true);
      }
    });
  }, [currentChapter, currentChapterIndex, manifest.chapters.length]);

  const playAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      setIsLoadingAudio(true);
      await audio.play();
      setIsPlaying(true);
      setHasStartedAudio(true);
      trackEvent('audio_play', {
        chapter: currentChapterIndex + 1,
        title: currentChapter.title,
      });
    } catch {
      setIsPlaying(false);
      setIsLoadingAudio(false);
    }
  }, [currentChapter, currentChapterIndex]);

  const pauseAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
    trackEvent('audio_pause', {
      chapter: currentChapterIndex + 1,
      currentTime: Math.round(audio.currentTime),
    });
  }, [currentChapterIndex]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }, [isPlaying, pauseAudio, playAudio]);

  const seekTo = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(seconds, audio.duration || duration));
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
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    trackEvent('audio_speed_change', { rate });
  }, []);

  const changeChapter = useCallback(
    (index: number, autoPlay: boolean = false) => {
      if (index < 0 || index >= manifest.chapters.length) return;
      setCurrentChapterIndex(index);
      setCurrentTime(0);

      const target = manifest.chapters[index];
      trackEvent('audio_chapter_change', {
        chapter: target.number,
        title: target.title,
      });

      if (autoPlay || isPlaying) {
        setTimeout(() => {
          playAudio();
        }, 100);
      }
    },
    [isPlaying, manifest.chapters, playAudio]
  );

  const openPlayer = useCallback(
    (targetChapterIndex?: number) => {
      if (typeof targetChapterIndex === 'number') {
        changeChapter(targetChapterIndex, false);
      }
      setIsPlayerOpen(true);
      trackEvent('audio_open', {
        chapter: (targetChapterIndex ?? currentChapterIndex) + 1,
      });
    },
    [changeChapter, currentChapterIndex]
  );

  const closePlayer = useCallback(() => {
    setIsPlayerOpen(false);
  }, []);

  const resumeSavedAudio = useCallback(() => {
    if (!savedProgress) {
      openPlayer(0);
      playAudio();
      return;
    }

    const chIdx = Math.max(
      0,
      Math.min(savedProgress.chapterNumber - 1, manifest.chapters.length - 1)
    );
    setCurrentChapterIndex(chIdx);
    openPlayer(chIdx);

    setTimeout(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = savedProgress.currentTime || 0;
        playAudio();
        trackEvent('audio_resume', {
          chapter: savedProgress.chapterNumber,
          time: savedProgress.currentTime,
        });
      }
    }, 150);
  }, [manifest.chapters.length, openPlayer, playAudio, savedProgress]);

  return (
    <AudioPlayerContext.Provider
      value={{
        manifest,
        currentChapter,
        currentChapterIndex,
        availableVoices,
        selectedVoice,
        isPlaying,
        currentTime,
        duration,
        playbackRate,
        isPlayerOpen,
        hasStartedAudio,
        savedProgress,
        isLoadingAudio,
        playAudio,
        pauseAudio,
        togglePlay,
        seekTo,
        skipSeconds,
        setSpeed,
        setVoice,
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
