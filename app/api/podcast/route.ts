import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getBriefing, getTodayDate } from '@/lib/storage';
import { isValidDate } from '@/lib/security';
import { getCachedScript, generateAndSavePodcastScript } from '@/lib/podcast';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    console.warn('[podcast] POST — unauthenticated request rejected');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const rawDate = body.date ?? getTodayDate();
  const targetDate = isValidDate(rawDate) ? rawDate : getTodayDate();
  const hasElevenLabs = !!process.env.ELEVENLABS_API_KEY;

  // ── Return cached script immediately — no Claude call, no ElevenLabs charge ──
  const cached = getCachedScript(targetDate);
  if (cached) {
    return NextResponse.json({ script: cached, hasElevenLabs });
  }

  const briefing = await getBriefing(targetDate);
  if (!briefing) {
    return NextResponse.json({ error: 'No briefing found for this date' }, { status: 404 });
  }

  try {
    const script = await generateAndSavePodcastScript(briefing);
    return NextResponse.json({ script, hasElevenLabs });
  } catch (err) {
    console.error('[podcast] generation error:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    if (msg.includes('ANTHROPIC_API_KEY')) {
      return NextResponse.json({ error: 'Podcast generation is currently unavailable.' }, { status: 500 });
    }
    return NextResponse.json({ error: `Script generation failed: ${msg}` }, { status: 502 });
  }
}
