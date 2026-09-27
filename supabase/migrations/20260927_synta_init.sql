-- SYNTA Database Schema Initialization
-- Tables: readers, reading_progress, feedback, events

-- 1. READERS TABLE
CREATE TABLE IF NOT EXISTS public.readers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  source TEXT NOT NULL DEFAULT 'landing_direct',
  consent BOOLEAN NOT NULL DEFAULT true,
  first_story_unlocked BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_readers_email ON public.readers(email);

-- 2. READING PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reader_id UUID NOT NULL REFERENCES public.readers(id) ON DELETE CASCADE,
  story_id TEXT NOT NULL,
  progress NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_reader_story UNIQUE (reader_id, story_id)
);

CREATE INDEX IF NOT EXISTS idx_reading_progress_reader ON public.reading_progress(reader_id);

-- 3. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reader_id UUID NOT NULL REFERENCES public.readers(id) ON DELETE CASCADE,
  story_id TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  read_again TEXT NOT NULL CHECK (read_again IN ('yes', 'maybe', 'no')),
  perception_change TEXT NOT NULL CHECK (perception_change IN ('better', 'same', 'worse')),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_feedback_reader ON public.feedback(reader_id);

-- 4. EVENTS TABLE (Analytics)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  reader_id UUID REFERENCES public.readers(id) ON DELETE SET NULL,
  event TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_events_session ON public.events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_name ON public.events(event);
CREATE INDEX IF NOT EXISTS idx_events_created ON public.events(created_at);

-- Row Level Security (RLS) setup
ALTER TABLE public.readers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Anonymous write policies for landing readers
CREATE POLICY "Allow public insert to readers" ON public.readers
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public select own reader" ON public.readers
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public insert and update progress" ON public.reading_progress
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public insert to feedback" ON public.feedback
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public insert to events" ON public.events
  FOR INSERT TO anon, authenticated WITH CHECK (true);
