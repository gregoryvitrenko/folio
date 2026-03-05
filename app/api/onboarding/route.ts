import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { setOnboarding, type OnboardingData, type OnboardingStage } from '@/lib/onboarding';

const VALID_STAGES: OnboardingStage[] = ['first-year', 'vs', 'tc'];

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const body = await req.json();
  const stage = body.stage as OnboardingStage;
  const targetFirms: string[] = Array.isArray(body.targetFirms)
    ? (body.targetFirms as string[]).slice(0, 5)
    : [];

  if (!VALID_STAGES.includes(stage)) {
    return NextResponse.json({ error: 'Invalid stage' }, { status: 400 });
  }

  const data: OnboardingData = {
    stage,
    targetFirms,
    completedAt: new Date().toISOString(),
  };

  await setOnboarding(userId, data);

  return NextResponse.json({ ok: true });
}
