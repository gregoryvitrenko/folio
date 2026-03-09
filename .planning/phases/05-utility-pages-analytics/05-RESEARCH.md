# Phase 5: Utility Pages + Analytics — Research

**Researched:** 2026-03-09
**Domain:** Tailwind CSS token migration (utility pages) + Vercel Analytics installation and custom event tracking
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| UTIL-01 | Archive page (`/archive`) applies design token system consistently | Audit complete: zinc palette violations catalogued, token replacements mapped |
| UTIL-02 | Firms page (`/firms`) applies design token system consistently | Audit complete: page heading badge is zinc; FirmsDirectory already stone-compliant |
| UTIL-03 | Quiz page (`/quiz`) applies design token system consistently | Audit complete: date nav list and heading badge use zinc/arbitrary values |
| UTIL-04 | Tests page (`/tests`) applies design token system consistently | Audit complete: stone palette already used; badge radius and arbitrary text sizes remain |
| UTIL-05 | Primers page (`/primers`) applies design token system consistently | Audit complete: stone palette already used; badge radius and arbitrary text sizes remain |
| ANLYT-01 | Vercel Analytics installed and active on production | `@vercel/analytics` not yet installed; full installation path documented |
| ANLYT-02 | Conversion funnel events tracked: free sign-up, upgrade page view, checkout click, subscription activation | All four event touchpoints identified; implementation path documented |
</phase_requirements>

---

## Summary

Phase 5 has two independent workstreams that can execute in parallel within the same deployment window: (1) migrating the five utility pages to the established token system, and (2) installing Vercel Analytics with conversion funnel event tracking.

The utility page migration is predominantly mechanical search-and-replace work. Two pages (`/archive` and `/quiz`) have the most violations — their list containers and nav cards use `rounded-xl`, `bg-zinc-900/50`, and `hover:bg-zinc-50` patterns that predate the design token system. Two pages (`/tests` and `/primers`) are already mostly stone-compliant but have badge radius (`rounded` instead of `rounded-chrome`) and arbitrary text size (`text-[13px]` instead of `text-caption`) violations. The Firms page has a single zinc badge and an unrelated `rounded-sm` on the disclaimer block.

Analytics is a clean three-step install: (1) `npm install @vercel/analytics`, (2) enable in Vercel dashboard, (3) add `<Analytics />` to `app/layout.tsx`. Custom conversion events fire client-side from `upgrade/page.tsx` and `success/page.tsx`. One important constraint: free sign-up tracking via Clerk's UI component is not directly hookable — the right approach is a `useEffect` on the sign-in/sign-up route that fires when the user transitions from signed-out to signed-in.

**Primary recommendation:** Run utility page migration plans first (UTIL-01 through UTIL-05), then analytics (ANLYT-01, ANLYT-02) as a final plan. The analytics component lives in `app/layout.tsx`, which does not touch any utility page file — the plans do not conflict.

---

## Page-by-Page Audit

This section is the core input for utility page task planning. Each violation is mapped to its token replacement.

### UTIL-01: `/archive/page.tsx`

**Violations found:**

| Location | Current class | Correct token/class |
|----------|--------------|-------------------|
| Page heading `h2` | `text-zinc-900 dark:text-zinc-50` | `text-stone-900 dark:text-stone-50` |
| Page heading `h2` | `text-lg font-bold` | `text-subheading font-bold` (18px, 500fw — add explicit `font-bold` since subheading is 500fw) |
| Count badge | `font-mono text-[10px]` | use `.section-label` class (bundles font-mono + text-label + tracking-widest + uppercase + stone colour) |
| Count badge | `text-zinc-400 dark:text-zinc-500 tracking-widest uppercase` | handled by `.section-label` |
| Count badge | `bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded` | `bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-chrome` |
| Month heading `h3` | `font-mono text-[10px] tracking-widest uppercase text-zinc-400 dark:text-zinc-500` | `.section-label` class |
| Date list container | `rounded-xl bg-white dark:bg-zinc-900` | `rounded-card bg-white dark:bg-stone-900` |
| Date list container | `border border-zinc-200 dark:border-zinc-800` | `border border-stone-200 dark:border-stone-800` |
| Date list container | `divide-y divide-zinc-100 dark:divide-zinc-800` | `divide-y divide-stone-100 dark:divide-stone-800` |
| Date row hover | `hover:bg-zinc-50 dark:hover:bg-zinc-800/50` | `hover:bg-stone-50 dark:hover:bg-stone-800/50` |
| Date row text | `text-zinc-900 dark:text-zinc-100` | `text-stone-900 dark:text-stone-100` |
| Date row hover text | `group-hover:text-zinc-700 dark:group-hover:text-zinc-50` | `group-hover:text-stone-700 dark:group-hover:text-stone-50` |
| ChevronRight | `text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400` | `text-stone-300 dark:text-stone-600 group-hover:text-stone-500 dark:group-hover:text-stone-400` |
| Empty state text | `text-zinc-500 dark:text-zinc-400` | `text-stone-500 dark:text-stone-400` |
| Empty state link | `text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300` | `text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300` |

**Today badge:** Keep emerald — it is a status colour, not a palette decision.

**Active date row:** `bg-zinc-50 dark:bg-zinc-800/30` → `bg-stone-50 dark:bg-stone-800/30`

---

### UTIL-02: `/firms/page.tsx`

**Violations found:**

| Location | Current class | Correct token/class |
|----------|--------------|-------------------|
| Count badge | `font-mono text-[10px] text-zinc-400 dark:text-zinc-500 tracking-widest uppercase` | `.section-label` class |
| Count badge | `bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded` | `bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-chrome` |
| Page heading `h2` | `text-zinc-400` (icon) | `text-stone-400` (icon already correct in firms page — verify) |
| Page heading `h2` | `text-zinc-900 dark:text-zinc-50` | `text-stone-900 dark:text-stone-50` |
| Page heading `h2` | `text-lg font-bold` | `text-subheading font-bold` |
| Disclaimer block | `rounded-sm` | `rounded-card` (nearest token for a flat editorial block) |

**Note:** `FirmsDirectory.tsx` is already stone-compliant — no changes needed there.

---

### UTIL-03: `/quiz/page.tsx`

**Violations found:**

| Location | Current class | Correct token/class |
|----------|--------------|-------------------|
| Page heading `h2` | `text-zinc-900 dark:text-zinc-50 text-lg font-bold` | `text-stone-900 dark:text-stone-50 text-subheading font-bold` |
| Page heading icon | `text-zinc-400` | `text-stone-400` |
| Count badge | `font-mono text-[10px] text-zinc-400 dark:text-zinc-500 tracking-widest uppercase bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded` | `.section-label bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-chrome` |
| Date nav section label `h3` | `font-mono text-[10px] tracking-widest uppercase text-zinc-400 dark:text-zinc-500` | `.section-label` |
| Date list container | `rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800` | `rounded-card bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800` |
| Active date row | `bg-zinc-50 dark:bg-zinc-800/30` | `bg-stone-50 dark:bg-stone-800/30` |
| Active date row text | `text-zinc-900 dark:text-zinc-100` | `text-stone-900 dark:text-stone-100` |
| Link row hover | `hover:bg-zinc-50 dark:hover:bg-zinc-800/50` | `hover:bg-stone-50 dark:hover:bg-stone-800/50` |
| Link row text | `text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-700 dark:group-hover:text-zinc-50` | `text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-stone-50` |
| ChevronRight | `text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400` | `text-stone-300 dark:text-stone-600 group-hover:text-stone-500 dark:group-hover:text-stone-400` |
| Empty state | `text-zinc-500 dark:text-zinc-400` / `text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300` | stone equivalents |

**Today badge:** Keep emerald.

**Note:** `QuizInterface` is a separate client component — not in scope for UTIL-03. If it has violations, they are a separate concern.

---

### UTIL-04: `/tests/page.tsx`

Tests page is already on stone palette. Remaining violations are smaller:

| Location | Current class | Correct token/class |
|----------|--------------|-------------------|
| Count badge | `rounded` (no token) | `rounded-chrome` |
| Body paragraphs | `text-[13px]` (arbitrary) | `text-caption` |

**No palette violations.** Only radius token and arbitrary text size.

---

### UTIL-05: `/primers/page.tsx`

Primers page is already on stone palette. Remaining violations match tests page:

| Location | Current class | Correct token/class |
|----------|--------------|-------------------|
| Count badge | `rounded` (no token) | `rounded-chrome` |
| Body paragraph | `text-[13px]` (arbitrary) | `text-caption` |

**No palette violations.** Only radius token and arbitrary text size.

---

## Standard Stack

### Core (Analytics)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@vercel/analytics` | latest (>=1.1.0) | Page view + custom event tracking | First-party Vercel package; zero config on Vercel Pro; included in Vercel Pro plan at no extra cost |

**Not needed for this phase:**
- `@vercel/speed-insights` — separate package for Core Web Vitals; out of scope
- Google Analytics / Plausible / PostHog — alternatives; decision is to use Vercel Analytics (already on Vercel Pro)

**Installation:**
```bash
npm install @vercel/analytics
```

### Token System (already installed — reference only)
All tokens established in Phase 1 are available:
- `text-subheading` — 18px, 500fw (use with explicit `font-bold` for page headings)
- `text-caption` — 13px (replaces `text-[13px]`, `text-sm`)
- `text-label` — 10px with letterSpacing (replaces `text-[10px]`)
- `.section-label` — component class bundling font-mono + text-label + tracking-widest + uppercase + text-stone-400
- `rounded-card` — 2px (editorial flat; replaces `rounded-xl` on content containers)
- `rounded-chrome` — 4px (replaces `rounded` or `rounded-xl` on badges/UI chrome)

---

## Architecture Patterns

### Pattern 1: Page Heading (established standard)

Every utility page should use this exact pattern:

```tsx
// Source: established in Phases 2-4, verified in archive/firms/quiz/tests/primers
<div className="flex items-center gap-3 mb-8">
  <IconName size={16} className="text-stone-400" />
  <h2 className="text-subheading font-bold text-stone-900 dark:text-stone-50 tracking-tight">
    Page Title
  </h2>
  <span className="section-label bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-chrome">
    {count} items
  </span>
</div>
```

**Why `font-bold` on `text-subheading`:** The `subheading` token has `fontWeight: '500'`. Page headings must be `700fw` (bold) per design principles. Explicit `font-bold` overrides the token weight — this is the established pattern from StoryCard headlines in Phase 3.

### Pattern 2: List Container (established standard)

```tsx
// Source: Archive page, Quiz date list — the correct stone-compliant version
<div className="rounded-card bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden divide-y divide-stone-100 dark:divide-stone-800">
  {/* rows */}
</div>
```

**Note:** `rounded-card` (2px) replaces the legacy `rounded-xl` on list containers. This is the editorial flat radius.

### Pattern 3: Clickable List Row (established standard)

```tsx
<Link
  href={href}
  className="flex items-center justify-between px-5 py-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors group"
>
  <span className="text-sm font-medium text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-stone-50">
    {label}
  </span>
  <ChevronRight size={14} className="text-stone-300 dark:text-stone-600 group-hover:text-stone-500 dark:group-hover:text-stone-400 transition-colors" />
</Link>
```

### Pattern 4: Section Label Heading

```tsx
// Source: globals.css .section-label + established in Phase 2
<h3 className="section-label mb-3">
  Section Name
</h3>
```

### Pattern 5: Vercel Analytics Installation (Next.js App Router)

```tsx
// Source: https://vercel.com/docs/analytics/quickstart — nextjs-app framework
// app/layout.tsx
import { Analytics } from '@vercel/analytics/next';

// Inside <body>:
<Analytics />
```

Add as a sibling to the existing children. Because `app/layout.tsx` already renders `<SiteFooter />` and `<ScrollToTop />` inside `<Providers>`, place `<Analytics />` after `<ScrollToTop />` as a direct child of `<body>`:

```tsx
<body className="...">
  <Providers>
    <main className="flex-1">
      {children}
    </main>
    <SiteFooter />
  </Providers>
  <ScrollToTop />
  <Analytics />   {/* add here — outside Providers, no theme/clerk dependency */}
</body>
```

### Pattern 6: Conversion Event Tracking

Client-side events via `track()` from `@vercel/analytics`:

```tsx
// Source: https://vercel.com/docs/analytics/custom-events
import { track } from '@vercel/analytics';

// Upgrade page view — fire once on mount
useEffect(() => {
  track('upgrade_view');
}, []);

// Checkout click — in handleUpgrade() before fetch
track('checkout_click');

// Subscription activated — in success page when verified becomes true
useEffect(() => {
  if (verified === true) {
    track('subscription_activated');
  }
}, [verified]);
```

**Free sign-up tracking:** Clerk's `<SignUp />` component does not expose an `onComplete` callback in the standard embed. The right approach for this project is to track sign-up on the `/sign-up` page using Clerk's `useUser()` hook — when `isSignedIn` transitions from `false` to `true` (after Clerk completes the flow), fire `track('free_signup')`. This requires the sign-up page to become a client component or add a thin client wrapper.

Alternative: track from the Clerk webhook. Not recommended here — it adds server-side complexity for a low-priority event, and the client-side approach is simpler and sufficient for funnel analytics.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Page view tracking | Custom script/beacon | `@vercel/analytics` `<Analytics />` | Handles SPA route changes, privacy compliance, bot filtering automatically |
| Event batching | Manual queue | `track()` function | Vercel handles batching, retry, deduplication |
| Analytics dashboard | Custom dashboard | Vercel Analytics dashboard | Already included in Pro plan |
| Conversion funnel visualization | Custom charts | Vercel Analytics Events panel | Filter by event name, drill into properties |

---

## Common Pitfalls

### Pitfall 1: `rounded-xl` on List Containers
**What goes wrong:** Leaving `rounded-xl` on the date list in Archive and Quiz pages — it reads as generic SaaS, not editorial.
**Why it happens:** The original code predates the token system.
**How to avoid:** Replace all `rounded-xl` on list/card containers with `rounded-card` (2px). Only use `rounded-xl` as a fallback if no token fits — but in this codebase, `rounded-card` is always the right choice for content containers.

### Pitfall 2: `section-label` vs manual mono classes
**What goes wrong:** Replacing `font-mono text-[10px] tracking-widest uppercase text-zinc-400` with the stone equivalent manually instead of using `.section-label`.
**Why it happens:** Not knowing the `.section-label` component class exists in `globals.css`.
**How to avoid:** Always use `.section-label` for this combination. It is the canonical class. Never combine `.section-label` with explicit `text-stone-400` — the colour is already encoded.

### Pitfall 3: Arbitrary text sizes remaining
**What goes wrong:** Leaving `text-[13px]` in tests and primers pages — it is the only remaining arbitrary value after migration.
**How to avoid:** Replace `text-[13px]` with `text-caption` in both body paragraphs. This is the established mapping from Phase 3.

### Pitfall 4: Analytics Component Placement
**What goes wrong:** Placing `<Analytics />` inside `<Providers>` (ThemeProvider / BookmarksProvider) — adds unnecessary re-render scope.
**How to avoid:** Place `<Analytics />` as a direct child of `<body>`, outside `<Providers>`. It is a script-injector, not a UI component. No theme or auth context required.

### Pitfall 5: Analytics Must Be Enabled in Vercel Dashboard First
**What goes wrong:** Installing the package and deploying without enabling Analytics in the Vercel project dashboard — the `/_vercel/insights/*` routes won't be active.
**How to avoid:** Step 1 is always: go to Vercel dashboard → project → Analytics → Enable. Do this before deploying the package change.

### Pitfall 6: Custom Events Are Pro-Only
**What goes wrong:** Custom events silently drop on the Hobby plan.
**Folio status:** Vercel Pro — custom events are included. No action needed.

### Pitfall 7: `track()` Is Client-Only
**What goes wrong:** Calling `track()` from `@vercel/analytics` in a Server Component — it throws.
**How to avoid:** The three conversion events (upgrade view, checkout click, subscription activated) all live in existing client components (`'use client'` files). No server-side tracking needed for this phase. If you ever need server-side tracking, import from `@vercel/analytics/server` instead.

### Pitfall 8: `text-subheading` fontWeight Override
**What goes wrong:** Using `text-subheading` alone for page headings — renders at 500fw, not 700fw.
**How to avoid:** Always pair `text-subheading font-bold` on page headings. This is the established pattern from StoryCard (Phase 3): token defines size and line-height, explicit `font-bold` overrides the token's default weight.

---

## Code Examples

### Verified: Correct Page Heading Pattern
```tsx
// Source: established pattern from Phase 2 Header + Phase 3 StoryCard
<div className="flex items-center gap-3 mb-8">
  <Calendar size={16} className="text-stone-400" />
  <h2 className="text-subheading font-bold text-stone-900 dark:text-stone-50 tracking-tight">
    Briefing Archive
  </h2>
  <span className="section-label bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-chrome">
    {dates.length} briefing{dates.length !== 1 ? 's' : ''}
  </span>
</div>
```

### Verified: Vercel Analytics Component (App Router)
```tsx
// Source: https://vercel.com/docs/analytics/quickstart (nextjs-app)
import { Analytics } from '@vercel/analytics/next';

// In body — outside Providers
<Analytics />
```

### Verified: Custom Event Tracking
```tsx
// Source: https://vercel.com/docs/analytics/custom-events
import { track } from '@vercel/analytics';

// Page view event (fires once on mount)
useEffect(() => {
  track('upgrade_view');
}, []);

// Button click event
async function handleUpgrade() {
  track('checkout_click');
  // ... existing fetch logic
}

// Conditional event (fires when condition becomes true)
useEffect(() => {
  if (verified === true) {
    track('subscription_activated');
  }
}, [verified]);
```

### Verified: Section Label (component class)
```tsx
// Source: globals.css — .section-label component class
// Correct:
<h3 className="section-label mb-3">Available</h3>
<span className="section-label bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-chrome">38 firms</span>

// Wrong (redundant colour):
<h3 className="section-label text-stone-400 mb-3">Available</h3>
```

---

## Analytics: Conversion Funnel Event Map

| Event Name | Fires When | Component | Implementation |
|------------|------------|-----------|----------------|
| `free_signup` | User completes Clerk sign-up | `app/sign-up/[[...sign-up]]/page.tsx` | `useUser()` hook — track on `isSignedIn` transition to `true` in a `useEffect`. Requires client wrapper. |
| `upgrade_view` | User lands on `/upgrade` page | `app/upgrade/page.tsx` | `useEffect(() => { track('upgrade_view'); }, [])` — already a client component |
| `checkout_click` | User clicks "Subscribe" CTA | `app/upgrade/page.tsx` — `handleUpgrade()` | Add `track('checkout_click')` before the `fetch('/api/stripe/checkout')` call |
| `subscription_activated` | Stripe webhook processed, success page confirms | `app/success/page.tsx` | `useEffect` on `verified` state — fire when `verified === true` |

**Sign-up tracking implementation detail:** The sign-up page (`app/sign-up/[[...sign-up]]/page.tsx`) is currently a Server Component (no `'use client'`). To track the sign-up event client-side, wrap the page in a thin client component that uses `useUser()`. The `<SignUp />` Clerk component does not expose `onComplete`. A client wrapper component is the minimal-touch approach.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `zinc-*` palette in utility pages | `stone-*` palette (content) + `zinc-*` (UI chrome only) | Established Phase 1 | Palette rule was defined but not yet applied to Archive/Quiz/Firms |
| `rounded-xl` on list containers | `rounded-card` (2px) | Established Phase 1-2 | All content containers should use flat editorial radius |
| `text-[10px] font-mono tracking-widest uppercase text-zinc-400` | `.section-label` class | Established Phase 1 | Single canonical class for all mono labels |
| `text-[13px]` arbitrary text | `text-caption` token | Established Phase 1 | Named semantic size; `text-[13px]` no longer acceptable in any component |
| No analytics | `@vercel/analytics` | This phase | Page views + conversion events observable in dashboard |

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — no test files, no jest/vitest config |
| Config file | None — see Wave 0 |
| Quick run command | `npm run lint` (ESLint via `next lint`) |
| Full suite command | `npm run build` (TypeScript + lint gate) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| UTIL-01 | Archive page uses stone palette and token classes | Visual / lint | `npm run lint` (catches TS errors, not class names) | ❌ no test file |
| UTIL-02 | Firms page badge and heading use tokens | Visual / lint | `npm run lint` | ❌ no test file |
| UTIL-03 | Quiz page list container and heading use tokens | Visual / lint | `npm run lint` | ❌ no test file |
| UTIL-04 | Tests page badge radius and caption size corrected | Visual / lint | `npm run lint` | ❌ no test file |
| UTIL-05 | Primers page badge radius and caption size corrected | Visual / lint | `npm run lint` | ❌ no test file |
| ANLYT-01 | `<Analytics />` in layout, page views recorded on production | Deploy + Vercel dashboard check | n/a — manual production check | ❌ no test file |
| ANLYT-02 | All four conversion events fire and appear in dashboard | Deploy + Vercel dashboard check | n/a — manual production check | ❌ no test file |

**Note:** This codebase has no automated test infrastructure. All UTIL requirements are verified visually (preview) and ANLYT requirements are verified by checking the Vercel Analytics dashboard after deployment. The lint + build gate is the only automated check.

### Sampling Rate
- **Per task commit:** `npm run lint` (catches TypeScript errors and ESLint violations)
- **Per wave merge:** `npm run build` (full TypeScript + lint)
- **Phase gate:** Production deploy + visual check of all 5 pages + Vercel Analytics dashboard confirmation

### Wave 0 Gaps
- No test infrastructure gaps — no framework to install. The verification strategy is lint + build + visual/dashboard checks as established in all prior phases.

---

## Plan Structure Recommendation

Given the two independent workstreams:

**Plan 05-01: Migrate Archive and Quiz pages (UTIL-01, UTIL-03)**
These two pages have the most violations and share identical list container patterns. Batching them reduces context switching.

**Plan 05-02: Migrate Firms, Tests, and Primers pages (UTIL-02, UTIL-04, UTIL-05)**
Firms has a single badge violation. Tests and Primers each have two violations (badge radius + text size). Low-touch, can be one plan.

**Plan 05-03: Install Vercel Analytics + conversion event tracking (ANLYT-01, ANLYT-02)**
Single plan: install package, add `<Analytics />` to layout, add `track()` calls to three existing client components, add client wrapper to sign-up page.

**Plan 05-04: Verification checkpoint**
Visual check of all 5 migrated pages + Vercel Analytics dashboard confirmation. Follows the Phase 4 pattern of a dedicated verification plan.

---

## Open Questions

1. **Sign-up page client wrapper scope**
   - What we know: `app/sign-up/[[...sign-up]]/page.tsx` is currently a Server Component; `useUser()` requires client context.
   - What's unclear: Whether adding `'use client'` to the sign-up page itself causes any Clerk rendering issues, or whether a thin wrapper component is safer.
   - Recommendation: Add `'use client'` directly to the sign-up page. It already renders a Clerk component (`<SignUp />`), so client-side rendering is already implied. If build fails, extract a `SignUpTracker` client component that uses `useUser()` and renders nothing.

2. **`QuizInterface` component violations**
   - What we know: `QuizInterface` is a large client component (`components/QuizInterface.tsx`) — not scanned in this research.
   - What's unclear: Whether it has zinc violations or arbitrary text sizes.
   - Recommendation: Planner should flag this as a potential scope expansion. Scan `QuizInterface.tsx` before writing UTIL-03 tasks. If it has violations, add a sub-task to the plan or create a UTIL-03b plan.

---

## Sources

### Primary (HIGH confidence)
- Direct source code audit — `/archive/page.tsx`, `/firms/page.tsx`, `/quiz/page.tsx`, `/tests/page.tsx`, `/primers/page.tsx`, `app/layout.tsx`, `app/upgrade/page.tsx`, `app/success/page.tsx`, `package.json`
- `tailwind.config.ts` — confirmed all token names and values
- `app/globals.css` — confirmed `.section-label` component class definition
- https://vercel.com/docs/analytics/quickstart — `<Analytics />` installation pattern for Next.js App Router (nextjs-app)
- https://vercel.com/docs/analytics/custom-events — `track()` function signature, client vs server import paths, limitations

### Secondary (MEDIUM confidence)
- Phase summaries 04-01 and 04-02 — confirmed established patterns and decisions that apply to this phase

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Utility page violations: HIGH — direct source code read, no inference
- Token replacement mapping: HIGH — tokens verified against tailwind.config.ts and globals.css
- Analytics install: HIGH — verified against official Vercel docs (fetched 2026-03-09)
- Custom event API: HIGH — verified against official Vercel docs (fetched 2026-03-09)
- Sign-up tracking approach: MEDIUM — Clerk's `useUser()` hook behaviour inferred; no direct test run

**Research date:** 2026-03-09
**Valid until:** 2026-04-09 (token system is stable; Vercel Analytics API is stable)
