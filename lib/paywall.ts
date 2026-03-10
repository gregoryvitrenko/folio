import { auth } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isSubscribed } from './subscription';

// ─── PREVIEW_MODE safety guard ─────────────────────────────────────────────────
// PREVIEW_MODE=true is a dev-only bypass that makes all paywall checks return
// 'subscribed'. If this ever reaches production, EVERY USER gets full access.
// This guard throws loudly at startup rather than silently bypassing the paywall.
function assertPreviewModeIsSafe(): void {
  if (
    process.env.PREVIEW_MODE === 'true' &&
    process.env.NODE_ENV === 'production'
  ) {
    // Throw rather than silently continue — this is a critical misconfiguration.
    throw new Error(
      '[paywall] FATAL: PREVIEW_MODE=true is set in a production environment. ' +
      'This bypasses ALL subscription checks and gives every user full access. ' +
      'Remove PREVIEW_MODE from your Vercel environment variables immediately.'
    );
  }
}

// Call at the top of any premium server page.
// Redirects to /sign-up if unauthenticated, /upgrade if not subscribed.
export async function requireSubscription() {
  assertPreviewModeIsSafe();
  if (process.env.PREVIEW_MODE === 'true') return; // dev-only bypass (safe: guard above ran)
  // Launch / free-period bypass — set FREE_ACCESS=true in Vercel env vars to open everything up.
  // Delete the env var (or set to anything other than 'true') to re-enable the paywall instantly.
  if (process.env.FREE_ACCESS === 'true') return;
  // Temporary review bypass — cookie set by middleware when ?review_key=SECRET is visited
  const cookieStore = await cookies();
  if (cookieStore.get('folio-review-access')?.value === '1') return;
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-up');
  }
  // Admin bypass — ADMIN_USER_ID always has full access
  if (userId === process.env.ADMIN_USER_ID) return;
  const subscribed = await isSubscribed(userId);
  if (!subscribed) {
    redirect('/upgrade');
  }
}

// Use this when you want to conditionally render content rather than redirect.
export async function getSubscriptionStatus(): Promise<'subscribed' | 'free' | 'unauthenticated'> {
  assertPreviewModeIsSafe();
  if (process.env.PREVIEW_MODE === 'true') return 'subscribed'; // dev-only bypass (safe: guard above ran)
  if (process.env.FREE_ACCESS === 'true') return 'subscribed';
  const cookieStore = await cookies();
  if (cookieStore.get('folio-review-access')?.value === '1') return 'subscribed';
  const { userId } = await auth();
  if (!userId) return 'unauthenticated';
  // Admin bypass
  if (userId === process.env.ADMIN_USER_ID) return 'subscribed';
  const subscribed = await isSubscribed(userId);
  return subscribed ? 'subscribed' : 'free';
}
