# Phase 12: Digest Compliance + Improvements - Research

**Researched:** 2026-03-11
**Domain:** Email compliance (GDPR/PECR), HMAC token security, referral systems, Stripe coupons, Claude Haiku subject line generation
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**1. Unsubscribe UX**
- Flow: Instant one-click unsubscribe. `GET /api/unsubscribe?token=X` immediately sets `email-opt-out:{userId}` in Redis and renders a branded confirmation page.
- No confirmation step — GDPR Article 7(3) requires withdrawal of consent to be as easy as giving it.
- Token security: HMAC-signed token using `CRON_SECRET` as the signing key. URL format: `/api/unsubscribe?uid={userId}&sig={hmac(userId, CRON_SECRET)}`.
- Confirmation page: Branded with Folio header/footer and stone palette. Shows "You've been unsubscribed" message. No re-subscribe link needed.
- Implementation: `app/unsubscribe/page.tsx` reads query params, validates HMAC, sets Redis key, renders confirmation. `app/api/unsubscribe/route.ts` handles Redis write and redirects to the page.
- Key decision: opt-out keyed by email (not userId) — simpler because the digest route already has emails from Stripe. Redis key: `email-opt-out:{email}`.
- Email headers: Add `List-Unsubscribe` and `List-Unsubscribe-Post` headers via Resend API `headers` parameter.
- Footer update: Replace current "Manage your subscription from account settings" with "Unsubscribe from this digest" link pointing to the signed unsubscribe URL.

**2. Subject Line Strategy**
- Style: Claude-generated editorial hooks. One punchy sentence, max 60 chars.
- Generation: During digest cron, call Claude Haiku with 10 story headlines, ask for one email subject line.
- Example output: "CMA blocked another deal. Here's what it means for your interviews."
- Fallback: If Haiku call fails, fall back to `"{top headline} + {N-1} more stories"`.
- Model: `claude-haiku-4-5-20251001`.

**3. Referral System**
- Referral link format: `https://www.folioapp.co.uk/?ref={referralCode}` where referralCode is 8-char alphanumeric per user.
- Storage keys: `referral:{referralCode}` → userId; `referral-count:{userId}` → integer; `referred-by:{newUserId}` → referrerUserId; `referral-code:{userId}` → code.
- Code generation: lazy, generated on first request.
- Trigger: new user becomes paying Stripe subscriber AND has `referred-by` key — checked in `checkout.session.completed` webhook handler.
- Reward: free month per 3 successful referrals. When `referral-count:{userId}` hits multiple of 3, create Stripe coupon (100% off, 1 month, single-use) and apply to referrer's subscription.
- Referral tracking: `?ref=X` visit stores code in cookie (`folio-ref`, 30-day expiry). On Stripe checkout completion, read cookie and record referral.
- Email CTA placement: After stories, before footer. User's unique referral link with copy "Share Folio with a friend. Get a free month when 3 friends subscribe."

**4. Digest Story De-duplication**
- Check `story.firms[]` overlap: 2+ shared firms = duplicate, keep the more recent one.

### Claude's Discretion

None specified — all decisions locked.

### Deferred Ideas (OUT OF SCOPE)
- Referral dashboard page (`/referrals`) — email CTA is sufficient for launch.
- Resend free tier hard-cap at 90/day — not blocking (subscriber count is low), add when approaching 80 subscribers.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DIGEST-01 | Sunday 08:00 UTC digest email sent to subscribers via existing Resend cron — activated and verified working | Cron already in vercel.json; digest route exists but needs opt-out check, subject line generation, referral code lookup |
| DIGEST-02 | Digest emails include `List-Unsubscribe` header and a working unsubscribe endpoint (UK PECR/GDPR compliance) | Resend v6.9.3 `headers` param confirmed; HMAC via Node crypto; Redis opt-out key pattern established |
| DIGEST-03 | Digest subject lines and content improved for open rates; viral/referral CTA included | Claude Haiku pattern established in lib/quiz.ts; Stripe coupon creation via stripe.coupons.create(); referral Redis keys documented |
</phase_requirements>

---

## Summary

Phase 12 builds on a largely complete foundation. The weekly digest cron fires at 08:00 UTC every Sunday (already in `vercel.json`), and the `app/api/digest/route.ts` + `lib/email.ts` template are already built. What is missing is: (1) GDPR-required unsubscribe mechanism, (2) editorial subject lines via Haiku, and (3) a referral system with Stripe coupon rewards.

The unsubscribe flow is the highest-priority piece — it must ship with the digest activation, never after. The HMAC pattern (Node's built-in `crypto` module, no extra package) is clean and uses the existing `CRON_SECRET` env var. The Redis opt-out key `email-opt-out:{email}` integrates naturally with the existing digest route which already fetches emails from Stripe customer data.

The referral system is the most complex new piece. It requires a new `lib/referral.ts` module, a cookie set during site visits (middleware or layout), referral tracking in the Stripe webhook on `checkout.session.completed`, and Stripe coupon creation via `stripe.coupons.create()` + `stripe.subscriptions.update()`. The Stripe SDK v20.4.0 in the project fully supports this pattern.

**Primary recommendation:** Implement in three waves: Wave 1 — unsubscribe endpoint + List-Unsubscribe header (DIGEST-02). Wave 2 — editorial subject lines + story de-duplication (DIGEST-01/03 improvements). Wave 3 — referral system + digest CTA (DIGEST-03 referral).

---

## Standard Stack

### Core (already installed — no new packages needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `resend` | 6.9.3 | Email sending with `List-Unsubscribe` headers | Already in use; `headers` param confirmed in source |
| `stripe` | 20.4.0 | Coupon creation + subscription update for referral reward | Already in use; `stripe.coupons.create()` + `stripe.subscriptions.update()` |
| `@anthropic-ai/sdk` | 0.78.0 | Claude Haiku subject line generation | Pattern established in lib/quiz.ts |
| `@upstash/redis` | 1.34.3 | Opt-out flag storage, referral tracking | Already in use; dual-backend pattern in storage.ts |
| Node.js `crypto` | built-in | HMAC signing for unsubscribe tokens | No npm package needed; `crypto.createHmac('sha256', secret)` |

**Installation:** No new packages required.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Node `crypto` for HMAC | `jsonwebtoken` or `jose` | crypto is built-in, zero dep, sufficient for this use case |
| `email-opt-out:{email}` key | `email-opt-out:{userId}` | email is simpler — digest route has emails from Stripe, not userIds |
| Stripe coupons for referral reward | Credit notes or invoice adjustments | Coupons are the standard Stripe mechanism for subscription discounts |

---

## Architecture Patterns

### Recommended File Structure for New Files

```
app/
├── unsubscribe/
│   └── page.tsx             # Server component: validate HMAC, set Redis, render confirmation
app/api/
├── unsubscribe/
│   └── route.ts             # GET: validate HMAC, set email-opt-out:{email} in Redis, redirect
lib/
└── referral.ts              # generateReferralCode(), getReferralCode(), recordReferral(), checkReward()
```

### Pattern 1: HMAC-Signed Unsubscribe Token

**What:** Signed URL prevents third parties from unsubscribing arbitrary users by guessing userIds.
**When to use:** Any action URL sent in email that modifies user state.
**Implementation:**

```typescript
// Source: Node.js built-in crypto — no import needed beyond: import crypto from 'crypto'
import crypto from 'crypto';

export function signUnsubscribeToken(email: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(email)
    .digest('hex');
}

export function verifyUnsubscribeToken(email: string, sig: string, secret: string): boolean {
  const expected = signUnsubscribeToken(email, secret);
  // Constant-time comparison prevents timing attacks
  return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
}

// URL format in digest email footer:
// /api/unsubscribe?email={encodeURIComponent(email)}&sig={sig}
```

**Critical:** Use `crypto.timingSafeEqual` to prevent timing attacks. Both buffers must be the same length — if `sig` is malformed (wrong hex length), `timingSafeEqual` throws. Wrap in try/catch and return false on error.

**Note on CONTEXT.md vs implementation:** CONTEXT.md documents the token as `uid={userId}&sig={hmac(userId)}` but the locked decision for the Redis key is `email-opt-out:{email}`. Using email as the HMAC input is consistent with keying by email. Planner should use email as the signed value.

### Pattern 2: Resend `List-Unsubscribe` Headers

**What:** RFC 2369 / RFC 8058 headers that email clients (Gmail, Apple Mail, Outlook) surface as native unsubscribe buttons.
**When to use:** Every commercial/marketing email. PECR legal requirement for UK bulk email.

```typescript
// Source: Resend v6.9.3 — lib/email.ts sendWeeklyDigest()
const { error } = await resend.emails.send({
  from: FROM,
  to,
  subject,
  html: digestHtml(stories, siteUrl, weekLabel, unsubscribeUrl, referralLink),
  headers: {
    'List-Unsubscribe': `<${unsubscribeUrl}>, <mailto:hello@folioapp.co.uk?subject=unsubscribe>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  },
});
```

**`List-Unsubscribe-Post` is required for Gmail one-click compliance** (RFC 8058). Without it, Gmail may not show the one-click unsubscribe button even if `List-Unsubscribe` is present.

### Pattern 3: Referral Cookie Tracking

**What:** Store referral code in cookie on site visit, read it at checkout completion.
**When to use:** Referral tracking where the referral event (visit) and the conversion event (purchase) are in different requests.

The cookie must be set at the page level (not middleware) to avoid running on every request. The correct place is in the root layout or a client component that reads the URL params:

```typescript
// In a client component mounted in app/layout.tsx or app/page.tsx
// (server component version using searchParams is also viable)
'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function ReferralTracker() {
  const searchParams = useSearchParams();
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      // 30-day expiry; SameSite=Lax for cross-site navigation
      document.cookie = `folio-ref=${ref}; max-age=${30 * 24 * 3600}; path=/; SameSite=Lax`;
    }
  }, [searchParams]);
  return null;
}
```

**Alternatively:** Set the cookie server-side in a route handler or middleware when `?ref=` is detected. The client component approach avoids middleware complexity.

### Pattern 4: Stripe Coupon + Subscription Update

**What:** Create a single-use 100%-off one-month coupon and apply it to the referrer's subscription.

```typescript
// Source: Stripe SDK v20.4.0 types — stripe.coupons.create()
const coupon = await stripe.coupons.create({
  percent_off: 100,
  duration: 'once',           // applies to one billing cycle only
  max_redemptions: 1,         // single-use
  name: 'Referral reward — 1 free month',
});

// Apply to the referrer's existing subscription
// Requires knowing the subscription ID — look it up from Redis: subscription:{userId}
await stripe.subscriptions.update(subscriptionId, {
  discounts: [{ coupon: coupon.id }],
});
```

**Important:** `stripe.subscriptions.update` with `discounts` array applies the coupon. The older `coupon` param at the top level of update params is deprecated in Stripe API v2023-10-16+. Use `discounts: [{ coupon: coupon.id }]`.

### Pattern 5: Claude Haiku Subject Line

**What:** One Haiku call with the week's headlines to generate an editorial subject line.

```typescript
// Source: lib/quiz.ts pattern
import Anthropic from '@anthropic-ai/sdk';

async function generateSubjectLine(headlines: string[]): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const anthropic = new Anthropic({ apiKey });
  try {
    const completion = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: `You are writing an email subject line for a weekly legal news digest aimed at UK law students.

These are this week's top stories:
${headlines.map((h, i) => `${i + 1}. ${h}`).join('\n')}

Write ONE email subject line that:
- Is under 60 characters
- Sounds editorial, not automated
- Makes the reader want to open it
- References the most compelling story
- Example style: "CMA blocked another deal. Here's what it means for your interviews."

Return only the subject line text, no quotes or explanation.`,
      }],
    });
    const text = completion.content[0]?.type === 'text' ? completion.content[0].text.trim() : null;
    return text && text.length <= 80 ? text : null; // 80-char safety margin
  } catch {
    return null; // fallback to template
  }
}
```

### Anti-Patterns to Avoid

- **Setting `email-opt-out` by userId in digest route:** The digest route only has emails from Stripe, not userIds. Keying by email is the correct decision.
- **Redirecting to unsubscribe page from the API route:** The `app/unsubscribe/page.tsx` should do the Redis write directly (as a server component), not via a redirect from an API route. This avoids double-handling and keeps the logic in one place. The CONTEXT.md mentions both — the simpler approach is the page doing the work.
- **Applying coupon to customer instead of subscription:** `stripe.customers.update(customerId, { coupon })` applies to all future invoices. `stripe.subscriptions.update(subId, { discounts: [{ coupon }] })` applies only to that subscription. Use the subscription-level approach.
- **Creating a new coupon on every webhook event:** Webhook can fire multiple times (retries). Guard with the existing Redis idempotency pattern (`stripe-event:{eventId}`) — already in the webhook handler.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Timing-safe string comparison | String equality `===` | `crypto.timingSafeEqual()` | Prevents timing attacks on HMAC verification |
| Referral code uniqueness | UUID/nanoid | 8-char alphanumeric from `crypto.randomBytes(4).toString('hex')` | Built-in, no package, sufficient entropy for this scale |
| Stripe discount application | Custom billing logic | `stripe.subscriptions.update()` with `discounts` | Stripe handles proration, invoice generation, renewal |
| Email unsubscribe header format | Custom header construction | Follow RFC 2369/8058 spec exactly | Malformed headers silently ignored by email clients |

**Key insight:** All tooling is already in the project. This phase is wiring together existing patterns, not adding new technology.

---

## Common Pitfalls

### Pitfall 1: Forgetting `List-Unsubscribe-Post` Header
**What goes wrong:** Gmail doesn't show one-click unsubscribe button.
**Why it happens:** `List-Unsubscribe` (RFC 2369) alone isn't enough for Gmail. `List-Unsubscribe-Post` (RFC 8058) is required to confirm the endpoint supports POST-based one-click unsubscribe.
**How to avoid:** Always include both headers together.
**Warning signs:** Gmail shows "Report spam" but no unsubscribe option in the three-dot menu.

### Pitfall 2: HMAC Buffer Length Mismatch in timingSafeEqual
**What goes wrong:** `crypto.timingSafeEqual` throws `RangeError: Input buffers must have the same byte length` when sig param is malformed.
**Why it happens:** An attacker or bot sends a garbage `sig` query param that isn't 64 hex characters (32 bytes).
**How to avoid:** Wrap in try/catch; return `false` on any error. Validate sig is exactly 64 hex chars before calling `timingSafeEqual`.

### Pitfall 3: Double-Counting Referrals on Webhook Retries
**What goes wrong:** Stripe retries a webhook event → referral counted twice → referrer gets two reward coupons.
**Why it happens:** The existing webhook idempotency guard (`stripe-event:{eventId}`) prevents duplicate processing of the same event, but the referral-specific logic must also be inside that guard.
**How to avoid:** The referral check must happen inside the existing `switch` on `checkout.session.completed` — which is already guarded by `markEventProcessed()`. No additional guard needed as long as referral code runs inside that handler.

### Pitfall 4: Cookie Not Present at Checkout Completion
**What goes wrong:** `folio-ref` cookie is missing when the Stripe webhook fires (server-side, no cookies).
**Why it happens:** Cookies are browser-only; the Stripe webhook `checkout.session.completed` fires server-to-server with no cookie context.
**How to avoid:** The referral cookie must be embedded in the Stripe checkout session metadata at session creation time. In `app/api/stripe/checkout/route.ts`, read the `folio-ref` cookie at checkout session creation and store it in `session.metadata.referralCode`. The webhook then reads from `session.metadata.referralCode`, not from cookies.

This is the **critical design point** the CONTEXT.md alludes to but doesn't spell out mechanically. The flow:
1. User visits `/?ref=ABC123` → `folio-ref=ABC123` cookie set
2. User clicks upgrade → `POST /api/stripe/checkout` → reads `folio-ref` cookie (available here — this is a browser request) → passes as `metadata.referralCode` in `checkout.sessions.create()`
3. Stripe webhook fires → reads `session.metadata.referralCode` → records referral

### Pitfall 5: `encodeURIComponent` on Email in Unsubscribe URL
**What goes wrong:** Emails with `+` signs (valid in email addresses) are decoded as spaces by some HTTP stacks.
**Why it happens:** `+` is a legacy URL encoding for space in query params.
**How to avoid:** Always use `encodeURIComponent(email)` when building the unsubscribe URL. On the receiving side, read via `new URL(req.url).searchParams.get('email')` which handles decoding correctly.

---

## Code Examples

### Unsubscribe URL Builder (for lib/email.ts)

```typescript
// Source: Node.js crypto (built-in)
import crypto from 'crypto';

export function buildUnsubscribeUrl(email: string, siteUrl: string): string {
  const secret = process.env.CRON_SECRET ?? '';
  const sig = crypto.createHmac('sha256', secret).update(email).digest('hex');
  return `${siteUrl}/api/unsubscribe?email=${encodeURIComponent(email)}&sig=${sig}`;
}
```

### Unsubscribe API Route (app/api/unsubscribe/route.ts)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function getRedis() {
  const { Redis } = require('@upstash/redis');
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const sig = searchParams.get('sig');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.folioapp.co.uk';

  if (!email || !sig || sig.length !== 64) {
    return NextResponse.redirect(`${siteUrl}/unsubscribe?error=invalid`);
  }

  const secret = process.env.CRON_SECRET ?? '';
  const expected = crypto.createHmac('sha256', secret).update(email).digest('hex');

  let valid = false;
  try {
    valid = crypto.timingSafeEqual(
      Buffer.from(sig, 'hex'),
      Buffer.from(expected, 'hex'),
    );
  } catch {
    valid = false;
  }

  if (!valid) {
    return NextResponse.redirect(`${siteUrl}/unsubscribe?error=invalid`);
  }

  // Set opt-out — no TTL (permanent until re-subscribe)
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = getRedis();
    await redis.set(`email-opt-out:${email.toLowerCase()}`, '1');
  }

  return NextResponse.redirect(`${siteUrl}/unsubscribe?success=1`);
}
```

### Opt-Out Check in Digest Route

```typescript
// In app/api/digest/route.ts, before sending each email:
async function isOptedOut(email: string): Promise<boolean> {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return false; // dev: no Redis, never block
  }
  const { Redis } = require('@upstash/redis');
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  const val = await redis.get(`email-opt-out:${email.toLowerCase()}`);
  return val !== null;
}
```

### Referral Code Generation (lib/referral.ts skeleton)

```typescript
import crypto from 'crypto';

function getRedis() { /* same as other lib files */ }
function useRedis(): boolean { /* same */ }

export function generateCode(): string {
  return crypto.randomBytes(4).toString('hex'); // 8 hex chars
}

export async function getOrCreateReferralCode(userId: string): Promise<string> {
  if (useRedis()) {
    const redis = getRedis();
    const existing = await redis.get(`referral-code:${userId}`);
    if (existing) return existing as string;
    const code = generateCode();
    await redis.set(`referral-code:${userId}`, code);
    await redis.set(`referral:${code}`, userId);
    return code;
  }
  // dev fallback: deterministic code (no side effects)
  return crypto.createHash('sha256').update(userId).digest('hex').slice(0, 8);
}

export async function recordReferral(
  newUserId: string,
  referralCode: string,
): Promise<void> {
  if (!useRedis()) return;
  const redis = getRedis();
  const referrerId = await redis.get(`referral:${referralCode}`);
  if (!referrerId || referrerId === newUserId) return; // self-referral guard
  // NX: only record if not already referred (prevents double-counting)
  const set = await redis.set(`referred-by:${newUserId}`, referrerId, { nx: true });
  if (!set) return; // already recorded
  const newCount = await redis.incr(`referral-count:${referrerId as string}`);
  // Check reward threshold: free month per 3 referrals
  if (newCount % 3 === 0) {
    // trigger reward — see checkAndApplyReward()
  }
}
```

### Stripe Coupon Application

```typescript
// Source: Stripe SDK v20.4.0 — confirmed via types/SubscriptionsResource.d.ts
async function applyFreeMonthCoupon(stripe: Stripe, subscriptionId: string): Promise<void> {
  const coupon = await stripe.coupons.create({
    percent_off: 100,
    duration: 'once',
    max_redemptions: 1,
    name: 'Referral reward — 1 free month',
  });
  await stripe.subscriptions.update(subscriptionId, {
    discounts: [{ coupon: coupon.id }],
  });
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `coupon` top-level param in `stripe.subscriptions.update()` | `discounts: [{ coupon }]` | Stripe API 2023-10-16 | Old param still works on old API versions but deprecated |
| `List-Unsubscribe` only | `List-Unsubscribe` + `List-Unsubscribe-Post` | RFC 8058 (2018), Gmail enforcement 2024 | Gmail bulk sender requirements (>5k/day) require both; good practice at any volume |

**Deprecated/outdated in project context:**
- Current digest footer says "Manage your subscription from account settings" — this is vague and non-compliant. Must be replaced with a literal unsubscribe link.
- Current `sendWeeklyDigest()` signature takes `(to, stories, weekLabel)` — must be extended to accept `unsubscribeUrl` and `referralLink` params.

---

## Open Questions

1. **Unsubscribe page — server component or client component?**
   - What we know: The page reads query params, validates HMAC, sets Redis, renders branded UI.
   - What's unclear: In Next.js 15 App Router, `searchParams` in server components are async. The Redis write can happen in a server action or directly in the page server component.
   - Recommendation: Use a server component page. Read `searchParams` (async in Next.js 15: `const { email, sig } = await searchParams`), validate, write Redis, render result. Avoids client-side flash.

2. **Where to set `folio-ref` cookie — client or server?**
   - What we know: CONTEXT.md says "when a user visits with `?ref=X`, store in cookie". The checkout route reads it.
   - What's unclear: Client-side `document.cookie` setting requires a `useClient` component (adds a bundle hit). Server-side via middleware adds complexity.
   - Recommendation: Client component `<ReferralTracker />` in root layout. Simple, works, negligible bundle impact. Reads `useSearchParams()`, sets cookie if `ref` param present.

3. **Does the digest route need `userId` to look up referral codes, or just `email`?**
   - What we know: The digest route fetches emails from Stripe active subscriptions (expanded customer). It does NOT have userIds unless it looks them up via `stripe-customer:{customerId}` → userId mapping (available via `getUserIdByCustomer()` in lib/subscription.ts).
   - What's unclear: Whether adding a `getUserIdByCustomer` lookup per subscriber for referral codes is acceptably fast.
   - Recommendation: Add the userId lookup per subscriber — it's a single Redis GET per email, and the digest already accepts 100ms delay between sends. No performance concern at current subscriber scale.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None installed — no test runner in package.json |
| Config file | None — Wave 0 gap |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DIGEST-01 | Digest cron fires and sends to active subscribers | manual-only | Verify by checking real subscriber inbox at 08:00 UTC Sunday | N/A |
| DIGEST-02 | Unsubscribe endpoint validates HMAC and sets opt-out | unit (if framework installed) | N/A — no test runner | Wave 0 gap |
| DIGEST-02 | Opted-out email is skipped in digest send loop | unit | N/A | Wave 0 gap |
| DIGEST-02 | `List-Unsubscribe` header present in sent email | manual-only | Check email headers via Resend dashboard / Gmail "View original" | N/A |
| DIGEST-03 | Subject line is editorial (Claude-generated) on success | manual-only | Verify in Resend logs | N/A |
| DIGEST-03 | Fallback subject line used when Haiku fails | unit | N/A | Wave 0 gap |
| DIGEST-03 | Referral CTA renders in email with correct link | manual-only | Check email rendering | N/A |

**Note:** No test framework is installed in this project. All automated verification is via production smoke tests and Resend dashboard inspection. This is consistent with the codebase's current approach.

### Wave 0 Gaps

- No test framework — acceptable given project stage, but means all DIGEST-02 correctness must be verified via manual testing on production (Resend dashboard + real inbox check).
- Production smoke test checklist (must be run after deploy):
  1. `GET /api/unsubscribe?email=test@test.com&sig=invalidsig` → redirects to `/unsubscribe?error=invalid`
  2. `GET /api/unsubscribe?email={real_email}&sig={valid_hmac}` → redirects to `/unsubscribe?success=1`, Redis key `email-opt-out:{email}` exists
  3. Visit `/?ref=TESTCODE` → `folio-ref` cookie set in browser
  4. Check next digest email (or trigger manual send) → opted-out email absent from send log
  5. Digest subject line in Resend logs is editorial (not date format)

---

## Sources

### Primary (HIGH confidence)
- `lib/email.ts` (read directly) — current digest template, `sendWeeklyDigest()` signature
- `app/api/digest/route.ts` (read directly) — existing digest cron handler, Stripe subscriber fetch pattern
- `app/api/stripe/webhook/route.ts` (read directly) — `checkout.session.completed` handler, idempotency pattern
- `app/api/stripe/checkout/route.ts` (read directly) — checkout session creation, `clerkUserId` metadata pattern
- `lib/subscription.ts` (read directly) — `getUserIdByCustomer()`, `stripe-customer:{customerId}` key confirmed
- `/node_modules/resend/dist/index.cjs` (read directly) — confirms `headers: email.headers` passed through in v6.9.3
- `/node_modules/stripe/types/SubscriptionsResource.d.ts` (read directly) — confirms `discounts: [{ coupon }]` param
- `/node_modules/stripe/types/Coupons.d.ts` (read directly) — confirms `stripe.coupons.create()` with `percent_off`, `duration`, `max_redemptions`
- Node.js `crypto` module — built-in, `createHmac`, `timingSafeEqual` — no external verification needed
- `vercel.json` (read directly) — confirms digest cron at `"0 8 * * 0"` (08:00 UTC Sunday) already configured

### Secondary (MEDIUM confidence)
- RFC 2369 (List-Unsubscribe) and RFC 8058 (List-Unsubscribe-Post / one-click) — standard email compliance specs; `List-Unsubscribe-Post: List-Unsubscribe=One-Click` is the required value per RFC 8058
- Gmail bulk sender requirements 2024 — require both headers for senders over 5k/day; best practice at any volume

### Tertiary (LOW confidence — note for validation)
- Stripe `discounts` vs `coupon` param deprecation timeline — confirmed by types but exact API version cutoff not verified against Stripe changelog. The `stripe` SDK v20.4.0 in this project uses the new `discounts` array form, so this is safe.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already in project, verified from source
- Architecture: HIGH — patterns derived directly from existing codebase conventions
- Pitfalls: HIGH — derived from code reading (webhook idempotency, cookie timing, HMAC length)
- Referral system complexity: MEDIUM — Stripe coupon API verified from types; live behavior on billing cycles not tested

**Research date:** 2026-03-11
**Valid until:** 2026-04-11 (stable stack, no fast-moving deps)
