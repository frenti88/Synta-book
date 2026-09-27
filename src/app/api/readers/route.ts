import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, source = 'landing_direct', consent = true } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Introduce un correo electrónico válido.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const now = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      // Upsert into Supabase
      const { data, error } = await supabase
        .from('readers')
        .upsert(
          {
            email: cleanEmail,
            source,
            consent,
            first_story_unlocked: true,
          },
          { onConflict: 'email' }
        )
        .select('id, email, created_at, first_story_unlocked')
        .single();

      if (error) {
        console.error('Supabase error inserting reader:', error);
      } else if (data) {
        return NextResponse.json({
          success: true,
          reader: data,
          message: 'Tu acceso está abierto.',
        });
      }
    }

    // Fallback: deterministic safe ID based on email or random UUID
    const fallbackId = 'rdr_' + Buffer.from(cleanEmail).toString('base64url').substring(0, 16);
    return NextResponse.json({
      success: true,
      reader: {
        id: fallbackId,
        email: cleanEmail,
        created_at: now,
        first_story_unlocked: true,
      },
      message: 'Tu acceso está abierto.',
    });
  } catch (error) {
    console.error('Error in /api/readers:', error);
    return NextResponse.json(
      { error: 'No pudimos registrar tu correo en este momento. Inténtalo de nuevo.' },
      { status: 500 }
    );
  }
}
