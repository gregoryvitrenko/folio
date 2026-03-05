import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { listBriefings, getBriefing } from '@/lib/storage';
import { sendWeeklyDigest, type DigestStory } from '@/lib/email';

export const maxDuration = 300; // 5 min — sending to many recipients

// ── Auth: cron secret ────────────────────────────────────────────────────────

function isAuthorised(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get('authorization');
  return auth === `Bearer ${secret}`;
}

// ── GET: Vercel cron-triggered weekly digest ─────────────────────────────────

export async function GET(req: NextRequest) {
  if (!isAuthorised(req)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  // ── 1. Collect this week's stories ──────────────────────────────────────

  const allDates = await listBriefings();
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const recentDates = allDates
    .filter((d) => new Date(d) >= weekAgo)
    .sort((a, b) => a.localeCompare(b));

  if (recentDates.length === 0) {
    return NextResponse.json({ sent: 0, note: 'No briefings this week' });
  }

  // Build digest stories: pick 1 top story per day (first story = most important)
  const digestStories: DigestStory[] = [];
  for (const date of recentDates) {
    const briefing = await getBriefing(date);
    if (!briefing) continue;
    // Take up to 2 stories per day to fill the digest (max ~14 stories for 7 days)
    for (const story of briefing.stories.slice(0, 2)) {
      digestStories.push({
        headline: story.headline,
        topic: story.topic,
        summary: story.summary,
        date: briefing.date,
      });
    }
  }

  // Cap at 10 stories max (enough for a scannable email)
  const topStories = digestStories.slice(0, 10);

  // Week label: "24 Feb – 2 Mar 2026"
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const weekLabel = `${fmt(weekAgo)} – ${fmt(now)} ${now.getFullYear()}`;

  // ── 2. Get active subscribers from Stripe ───────────────────────────────

  const stripe = new Stripe(stripeKey);
  const emails: string[] = [];

  let hasMore = true;
  let startingAfter: string | undefined;

  while (hasMore) {
    const params: Stripe.SubscriptionListParams = {
      status: 'active',
      limit: 100,
      expand: ['data.customer'],
    };
    if (startingAfter) params.starting_after = startingAfter;

    const subs = await stripe.subscriptions.list(params);

    for (const sub of subs.data) {
      const customer = sub.customer as Stripe.Customer;
      if (customer?.email) {
        emails.push(customer.email);
      }
    }

    hasMore = subs.has_more;
    if (subs.data.length > 0) {
      startingAfter = subs.data[subs.data.length - 1].id;
    }
  }

  if (emails.length === 0) {
    return NextResponse.json({ sent: 0, note: 'No active subscribers' });
  }

  // ── 3. Send digest to each subscriber ───────────────────────────────────

  let sent = 0;
  let failed = 0;

  // Resend free tier: 100/day. Batch with small delay to avoid rate limits.
  for (const email of emails) {
    const result = await sendWeeklyDigest(email, topStories, weekLabel);
    if (result.success) {
      sent++;
    } else {
      failed++;
    }

    // 100ms delay between sends to respect rate limits
    if (emails.length > 10) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  console.log(`[digest] Weekly digest sent: ${sent} ok, ${failed} failed (${emails.length} total subscribers)`);

  return NextResponse.json({ sent, failed, total: emails.length });
}
