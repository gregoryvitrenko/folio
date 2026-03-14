import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { isSubscribed } from '@/lib/subscription';
import { checkRateLimit } from '@/lib/rate-limit';
import { getGamificationData, recordQuizCompletion } from '@/lib/quiz-gamification';

// ── Auth + subscription guard ──────────────────────────────────────────────────

async function getEffectiveUserId(): Promise<{ userId: string } | NextResponse> {
  const isDevPreview = process.env.PREVIEW_MODE === 'true';
  const { userId } = await auth();

  if (!isDevPreview) {
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const subscribed = await isSubscribed(userId);
    if (!subscribed) {
      return NextResponse.json({ error: 'Subscription required' }, { status: 403 });
    }
  }

  return { userId: userId ?? 'preview-dev' };
}

// ── GET /api/quiz/gamification ─────────────────────────────────────────────────
// Returns current XP, level, streak for the authenticated user.

export async function GET(): Promise<NextResponse> {
  const result = await getEffectiveUserId();
  if (result instanceof NextResponse) return result;
  const { userId } = result;

  const limited = await checkRateLimit(userId, 'quiz-gamification-get', 60, 3600);
  if (limited) return limited;

  const data = await getGamificationData(userId);
  return NextResponse.json(data);
}

// ── POST /api/quiz/gamification ────────────────────────────────────────────────
// Records a quiz completion and returns updated gamification state.
// Body: { type: 'daily' | 'practice', score: number, total: number, topic?: string }

export async function POST(request: NextRequest): Promise<NextResponse> {
  const result = await getEffectiveUserId();
  if (result instanceof NextResponse) return result;
  const { userId } = result;

  const limited = await checkRateLimit(userId, 'quiz-gamification-post', 30, 3600);
  if (limited) return limited;

  const body = await request.json().catch(() => ({})) as {
    type?: string;
    score?: number;
    total?: number;
    topic?: string;
  };

  if (body.type !== 'daily' && body.type !== 'practice') {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  // Default total to 1 if missing to avoid division by zero in XP calc
  const score = typeof body.score === 'number' ? body.score : 0;
  const total = typeof body.total === 'number' && body.total > 0 ? body.total : 1;

  const data = await recordQuizCompletion(
    userId,
    body.type as 'daily' | 'practice',
    score,
    total,
    body.topic,
  );
  return NextResponse.json(data);
}
