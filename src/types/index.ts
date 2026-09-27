export interface Reader {
  id: string;
  email: string;
  created_at: string;
  source: string;
  consent: boolean;
  first_story_unlocked: boolean;
}

export interface ReadingProgress {
  reader_id: string;
  story_id: string;
  progress: number; // 0 to 100 percentage
  last_scroll_position?: number;
  updated_at: string;
}

export interface Feedback {
  reader_id: string;
  story_id: string;
  rating: number; // 1 to 5
  read_again: 'yes' | 'maybe' | 'no';
  perception_change: 'better' | 'same' | 'worse';
  comment?: string;
  created_at: string;
}

export type EventType =
  | 'landing_view'
  | 'hero_read_click'
  | 'book_unlock_click'
  | 'email_submitted'
  | 'reader_started'
  | 'reader_25'
  | 'reader_50'
  | 'reader_75'
  | 'reader_completed'
  | 'author_reveal_opened'
  | 'feedback_started'
  | 'feedback_submitted'
  | 'next_story_interest'
  | 'returning_reader';

export interface AnalyticsEvent {
  session_id: string;
  reader_id?: string;
  event: EventType;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface Chapter {
  id: string;
  number: string;
  title: string;
  paragraphs: string[];
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  edition: string;
  genre: string;
  readingTime: string;
  wordCount: number;
  synopsis: string;
  authorNoteHidden: string;
  chapters: Chapter[];
}
