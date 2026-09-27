import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    let body;
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const text = await request.text();
      body = JSON.parse(text || '{}');
    }

    const { session_id, reader_id, event, metadata = {}, created_at } = body;

    if (!session_id || !event) {
      return NextResponse.json({ error: 'Evento inválido.' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      const validReaderId =
        reader_id && !reader_id.startsWith('rdr_') ? reader_id : null;

      await supabase.from('events').insert({
        session_id,
        reader_id: validReaderId,
        event,
        metadata,
        created_at: created_at || new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in /api/events:', error);
    return NextResponse.json({ error: 'Error registrando evento.' }, { status: 500 });
  }
}
