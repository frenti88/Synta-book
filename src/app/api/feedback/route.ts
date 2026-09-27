import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reader_id, story_id, rating, read_again, perception_change, comment } = body;

    if (!story_id || !rating || !read_again || !perception_change) {
      return NextResponse.json(
        { error: 'Por favor responde las preguntas principales de la reacción.' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    if (isSupabaseConfigured && supabase && reader_id && !reader_id.startsWith('rdr_')) {
      const { error } = await supabase.from('feedback').insert({
        reader_id,
        story_id,
        rating: Number(rating),
        read_again,
        perception_change,
        comment: comment || null,
        created_at: now,
      });

      if (error) {
        console.error('Supabase error inserting feedback:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Gracias por ser uno de los primeros lectores de SYNTA.',
    });
  } catch (error) {
    console.error('Error in /api/feedback:', error);
    return NextResponse.json(
      { error: 'No se pudo guardar la reacción.' },
      { status: 500 }
    );
  }
}
