export interface AudioVoice {
  id: string;
  name: string;
  subtitle: string;
  gender: 'female';
  description: string;
}

export interface AudioChapter {
  number: number;
  id: string;
  title: string;
  src: string;
  duration: number; // in seconds
  durationFormatted: string; // e.g. "06:32"
}

export interface AudiobookManifest {
  id: string;
  title: string;
  author: string;
  voice: string;
  language: string;
  edition: string;
  totalDuration: number;
  totalDurationFormatted: string;
  voices?: AudioVoice[];
  chapters: AudioChapter[];
}

export interface AudioProgressStorage {
  bookId: string;
  voiceId?: string;
  chapterNumber: number;
  currentTime: number;
  duration: number;
  playbackRate: number;
  updatedAt: number;
}
