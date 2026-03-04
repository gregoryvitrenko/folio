import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateBriefing } from '@/lib/generate';
import { saveBriefing, getBriefing, getTodayDate } from '@/lib/storage';

export const maxDuration = 300; // 5-minute timeout for generation

function isCronAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  // Fail-closed: if CRON_SECRET is not configured, deny all cron requests.
  // This prevents unauthenticated access to expensive AI generation in any environment.
  if (!cronSecret) {
    console.error('[generate] CRON_SECRET is not set — cron access denied. Set CRON_SECRET in .env.local and Vercel environment variables.');
    return false;
  }
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${cronSecret}`;
}

async function handleGenerate(request: NextRequest, force = false) {
  const today = getTodayDate();

  if (!force) {
    const existing = await getBriefing(today);
    if (existing) {
      return NextResponse.json({
        message: 'Briefing already exists for today',
        date: today,
        skipped: true,
      });
    }
  }

  try {
    const briefing = await generateBriefing();
    await saveBriefing(briefing);

    return NextResponse.json({
      message: 'Briefing generated successfully',
      date: briefing.date,
      storyCount: briefing.stories.length,
    });
  } catch (error) {
    console.error('[generate] Error:', error);
    return NextResponse.json({ error: 'Briefing generation failed. Check server logs for details.' }, { status: 500 });
  }
}

// Vercel cron calls GET — protected by CRON_SECRET
export async function GET(request: NextRequest) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return handleGenerate(request);
}

// Manual UI trigger uses POST — requires a signed-in Clerk session.
// Pass ?force=true to regenerate even if today's briefing already exists.
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const force = request.nextUrl.searchParams.get('force') === 'true';
  return handleGenerate(request, force);
}
