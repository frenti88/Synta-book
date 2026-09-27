import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reader_id, story_id, progress } = body;

    if (!story_id || typeof progress !== 'number') {
      return NextResponse.json({ error: 'Parámetros incompletos.' }, { status: 400 });
    }

    const clampedProgress = Math.min(100, Math.max(0, Math.round(progress * 100) / 100));
    const now = new Date().toISOString();

    if (isSupabaseConfigured && supabase && reader_id && !reader_id.startsWith('rdr_')) {
      const { error } = await supabase
        .from('reading_progress')
        .upsert(
          {
            reader_id,
            story_id,
            progress: clampedProgress,
            updated_at: now,
          },
          { onConflict: 'reader_id,story_id' }
        );

      if (error) {
        console.error('Supabase error saving reading progress:', error);
      }
    }

    return NextResponse.json({
      success: true,
      progress: clampedProgress,
      updated_at: now,
    });
  } catch (error) {
    console.error('Error in /api/reading-progress:', error);
    return NextResponse.json({ error: 'Error actualizando progreso.' }, { status: 500 });
  }
}
