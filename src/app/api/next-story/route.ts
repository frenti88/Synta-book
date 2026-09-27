import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reader_id, email, author_interested = 'NOMA' } = body;

    const now = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      await supabase.from('events').insert({
        session_id: 'next_story_intent_' + Date.now(),
        reader_id: reader_id && !reader_id.startsWith('rdr_') ? reader_id : null,
        event: 'next_story_interest',
        metadata: { email, author: author_interested },
        created_at: now,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Estás dentro.',
    });
  } catch (error) {
    console.error('Error in /api/next-story:', error);
    return NextResponse.json({ error: 'Error registrando interés.' }, { status: 500 });
  }
}
