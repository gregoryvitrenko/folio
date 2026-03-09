# Phase 4: Conversion Surfaces - Research

**Researched:** 2026-03-09
**Domain:** React/Tailwind UI polish — copy rewrite, palette migration, token alignment, social proof markup
**Confidence:** HIGH

## Summary

Phase 4 is a narrowly scoped, surgical UI polish pass on exactly two files: `app/upgrade/page.tsx` and `components/LandingHero.tsx`. No new libraries, no new routes, no schema changes. All tokens required already exist from Phases 1–3. The work is: replace zinc with stone, apply existing text/radius tokens in place of arbitrary values, rewrite six feature copy strings to outcome framing, add a two-element social proof block, fix two CTA hover states, add `<SiteFooter />` to the upgrade page.

The primary research finding is that this phase is fully self-contained in the existing token system. Every token the planner needs (`text-label`, `text-caption`, `text-article`, `rounded-card`, `rounded-chrome`, `.section-label`, `hover:bg-stone-700 dark:hover:bg-stone-300`) is confirmed present and in active use in Phase 3 components.

One material discrepancy was found between CONTEXT.md and the actual code: CONTEXT.md states that `.section-label` "doesn't prescribe colour" and instructs applying `text-stone-400 dark:text-stone-500` alongside the class. In fact, `globals.css:99` shows `.section-label { @apply font-mono text-label tracking-widest uppercase text-stone-400 dark:text-stone-500; }` — the class already includes those exact colours. The planner should apply `.section-label` alone on the "Premium" label and the LandingHero top label (dropping the redundant inline colour utilities), except in the one case in BriefingView where `.section-label text-stone-400 dark:text-stone-600` is used with a *different* dark shade — in Phase 4 the default dark shade is correct.

**Primary recommendation:** Apply changes in a single wave per file. Upgrade page first (larger change set), LandingHero second (smaller). No config changes needed; no new dependencies.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Zinc to stone palette migration (CONV-01)
- ALL zinc instances in `upgrade/page.tsx` migrate to stone equivalents, one-for-one:
  - `text-zinc-*` → `text-stone-*`
  - `bg-zinc-*` → `bg-stone-*`
  - `border-zinc-*` → `border-stone-*`
  - `divide-zinc-*` → `divide-stone-*`
  - `dark:bg-zinc-*` → `dark:bg-stone-*` etc.
- `rounded-xl` → `rounded-card` on the features card and free-tier note
- `rounded-xl` → `rounded-chrome` on the CTA button
- The custom header and its minimal structure stay — it's intentionally stripped of nav to keep the funnel clean
- `bg-stone-50 dark:bg-stone-950` on the page wrapper is correct and already matches (top-level div was already stone, only inner elements were zinc)

#### Arbitrary text sizes to tokens (CONV-01, part of palette cleanup)
- `text-[10px] tracking-widest uppercase` (Premium label) → apply `.section-label` class
- `text-[14px]` (tagline, CTA button text) → `text-caption`
- `text-[13px]` (feature items) → `text-caption`
- `text-[12px]` (free tier note, back link, error) → `text-label`
- `text-[11px]` (reassurance below CTA) → `text-label`
- `h2 text-3xl` (£4/month heading) → `text-article` (28px — 2px delta acceptable, closest token without adding one)
- `hover:opacity-75` on header logo → `hover:text-stone-600 dark:hover:text-stone-400 transition-colors`

#### Outcome-framed copy (CONV-02)
Replace `PREMIUM_FEATURES` array with:
```ts
const PREMIUM_FEATURES = [
  'Walk into interviews with a point of view — full analysis and structured talking points for every deal',
  'Lock in the facts — 24 daily quiz questions keep your recall interview-sharp',
  'Know your target firms cold — interview packs with practice Qs and "why this firm?" angles for 38 firms',
  'Speak the language of deals — sector primers covering M&A, Capital Markets, Disputes & more',
  'Stay informed on the commute — audio briefing keeps you ahead without adding desk time',
  'Build your knowledge base — full archive and bookmarks for structured, long-term prep',
];
```
Tagline under £4/month stays as-is.

#### Social proof slots (CONV-03)
- Add between features card and free-tier note
- Student count badge: `<p>` with `.section-label` class — "Join 200+ law students"
- Testimonial quote: blockquote-style with quote in `text-caption italic` and attribution in `text-label`
- Container: `text-center mb-6` — no border, no card wrapper
- Mark testimonial with `{/* TODO: replace with real testimonial */}`

#### CTA hover state (CONV-01 + CONV-04)
- Upgrade page CTA: `hover:opacity-80 transition-opacity` → `hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors`
- LandingHero CTA: `hover:opacity-80 transition-opacity` → `hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors`

#### LandingHero CTA radius (CONV-04)
- CTA `<Link>`: `rounded-xl` → `rounded-chrome`
- Stage selector buttons: `rounded-lg` → `rounded-chrome`
- Personalised recommendation panel: `rounded-xl` → `rounded-card`
- Links inside recommendation: `rounded-lg` → `rounded-chrome`
- `text-[13px]` instances → `text-caption`
- Top label `font-mono text-[10px] tracking-widest uppercase text-stone-400` → `.section-label text-stone-400 dark:text-stone-500`
- Hero headline `text-3xl sm:text-4xl` — leave as responsive pair

#### Page structure
- Keep custom minimal header on upgrade page
- Add `<SiteFooter />` to upgrade page as last child of `min-h-screen flex flex-col` div (after `</main>`)
- LandingHero is a component, no structural changes needed

### Claude's Discretion
- Exact blockquote markup and spacing for social proof (keep simple — `<blockquote>` or `<div>` with italic `<p>`)
- Whether to use `leading-relaxed` or `leading-[1.65]` on testimonial text
- Exact placeholder testimonial copy (mark with `{/* TODO: replace with real testimonial */}`)

### Deferred Ideas (OUT OF SCOPE)
- hover:opacity cleanup in FirmQuiz, TrackerDashboard, TestPractice, TestSession, InterviewPractice — Phase 5
- hover:opacity cleanup in AuthButtons, UpgradeBanner, other shell components — Phase 5
- Real testimonial copy sourcing — product/marketing task
- Animated social proof (live subscriber count) — out of scope
- Upgrade page A/B testing — out of scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONV-01 | Upgrade page palette aligned from `zinc-*` to `stone-*` to match the rest of the product | All zinc class instances in upgrade/page.tsx are catalogued below with exact replacements. Token map fully verified against tailwind.config.ts and globals.css. |
| CONV-02 | Upgrade page copy rewritten — outcome-framed ("walk into interviews knowing the market") not capability-framed ("get access to the quiz") | New PREMIUM_FEATURES array specified verbatim in CONTEXT.md. No research ambiguity. |
| CONV-03 | Social proof slots added to upgrade page (placeholders for student count + testimonials) | Markup pattern recommended: `<div className="text-center mb-6">` wrapper, `.section-label` for count badge, `text-caption italic` for quote text, `text-label` for attribution. |
| CONV-04 | LandingHero CTA border radius corrected to match token system (currently `rounded-xl`) | `rounded-chrome` (4px, `var(--radius-chrome)`) is the correct button token. Confirmed in tailwind.config.ts borderRadius extension. All LandingHero radius instances catalogued below. |
</phase_requirements>

---

## Standard Stack

### Core (no new installs required)
| Token/Class | Source | Purpose | Status |
|-------------|--------|---------|--------|
| `text-label` | tailwind.config.ts | 10px mono labels | Already defined |
| `text-caption` | tailwind.config.ts | 13px secondary text | Already defined |
| `text-article` | tailwind.config.ts | 28px article-level headline | Already defined |
| `rounded-card` | tailwind.config.ts + globals.css | 2px editorial card radius | Already defined |
| `rounded-chrome` | tailwind.config.ts + globals.css | 4px button/chrome radius | Already defined |
| `.section-label` | app/globals.css:98–100 | Mono uppercase label class (includes font-mono + text-label + tracking-widest + uppercase + text-stone-400 dark:text-stone-500) | Already defined |
| `hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors` | Phase 3 (BriefingView, StoryGrid, ScrollToTop, PodcastPlayer) | Button hover pattern | Established standard |
| `hover:text-stone-600 dark:hover:text-stone-400 transition-colors` | Phase 3 (Header.tsx) | Logo/link hover pattern | Established standard |

**Installation:** None required. All tokens and classes are live.

---

## Architecture Patterns

### Upgrade Page: Change Inventory

The full set of changes to `app/upgrade/page.tsx` (verified by reading the file):

**Header logo (line 49):**
```tsx
// Before
<h1 className="font-serif text-[22px] sm:text-[28px] font-bold tracking-tight text-stone-900 dark:text-stone-50 hover:opacity-75 transition-opacity">

// After — keep responsive font pair (no clean token for this range), fix hover only
<h1 className="font-serif text-[22px] sm:text-[28px] font-bold tracking-tight text-stone-900 dark:text-stone-50 hover:text-stone-600 dark:hover:text-stone-400 transition-colors">
```

**Premium label (line 61):**
```tsx
// Before
<p className="font-mono text-[10px] tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mb-3">

// After — .section-label already includes text-stone-400 dark:text-stone-500
<p className="section-label mb-3">
```

**£4/month heading (line 64):**
```tsx
// Before
<h2 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-2">

// After — text-article is 28px/700fw; explicit font-serif + tracking-tight still needed
<h2 className="font-serif text-article tracking-tight text-stone-900 dark:text-stone-50 mb-2">
```

**Tagline (line 67):**
```tsx
// Before
<p className="text-[14px] text-zinc-500 dark:text-zinc-400">

// After — text-caption is 13px (closest token; 1px delta acceptable per CONTEXT.md)
<p className="text-caption text-stone-500 dark:text-stone-400">
```

**Features card (line 73):**
```tsx
// Before
<div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800 mb-6">

// After
<div className="rounded-card bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden divide-y divide-stone-100 dark:divide-stone-800 mb-6">
```

**Feature items (line 77):**
```tsx
// Before
<span className="text-[13px] text-zinc-700 dark:text-zinc-300">{feature}</span>

// After
<span className="text-caption text-stone-700 dark:text-stone-300">{feature}</span>
```

**Social proof block — NEW (insert after features card div, before free-tier note):**
```tsx
{/* Social proof */}
<div className="text-center mb-6">
  <p className="section-label mb-3">Join 200+ law students{/* TODO: update with real count */}</p>
  <blockquote>
    <p className="text-caption italic text-stone-600 dark:text-stone-400 leading-relaxed mb-1">
      {/* TODO: replace with real testimonial */}
      &ldquo;Folio is the only prep tool I actually open every morning — the talking points are sharp enough to use straight in interviews.&rdquo;
    </p>
    <cite className="text-label text-stone-400 dark:text-stone-500 not-italic">— LLB student, University of Bristol</cite>
  </blockquote>
</div>
```

**Free-tier note (line 83):**
```tsx
// Before
<div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 px-5 py-4 mb-6">
  <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
    <span className="font-medium text-zinc-700 dark:text-zinc-300">Free tier:</span> ...
  </p>
</div>

// After
<div className="rounded-card bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 px-5 py-4 mb-6">
  <p className="text-label text-stone-500 dark:text-stone-400">
    <span className="font-medium text-stone-700 dark:text-stone-300">Free tier:</span> ...
  </p>
</div>
```

**Error message (line 90):**
```tsx
// Before
<p className="text-[12px] font-mono text-rose-500 dark:text-rose-400 mb-4 text-center">

// After
<p className="text-label font-mono text-rose-500 dark:text-rose-400 mb-4 text-center">
```

**CTA button (line 99):**
```tsx
// Before
<button ... className="w-full py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 text-[14px] font-sans font-medium hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">

// After
<button ... className="w-full py-3 rounded-chrome bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-caption font-sans font-medium hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
```

**Reassurance text (line 104):**
```tsx
// Before
<p className="text-center text-[11px] text-zinc-400 dark:text-zinc-500 mt-4">

// After
<p className="text-center text-label text-stone-400 dark:text-stone-500 mt-4">
```

**Back link (line 109):**
```tsx
// Before
<Link href="/" className="text-[12px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">

// After
<Link href="/" className="text-label text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors">
```

**SiteFooter addition:** Add `import { SiteFooter } from '@/components/SiteFooter';` and render `<SiteFooter />` as last child of the outer `min-h-screen flex flex-col` div (after `</main>`).

---

### LandingHero: Change Inventory

The full set of changes to `components/LandingHero.tsx` (verified by reading the file):

**Top label (line 55):**
```tsx
// Before
<p className="font-mono text-[10px] tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-4">

// After — .section-label already encodes text-stone-400 dark:text-stone-500
<p className="section-label mb-4">
```

**Stage selector buttons (line 73):**
```tsx
// Before — rounded-lg in both states
className={`px-4 py-2 rounded-lg text-[13px] font-medium border transition-all ${...}`}

// After — rounded-chrome, text-caption
className={`px-4 py-2 rounded-chrome text-caption font-medium border transition-all ${...}`}
```

**Recommendation panel (line 86):**
```tsx
// Before
<div className="mb-6 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">

// After
<div className="mb-6 p-4 rounded-card bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
```

**Recommendation heading + description (lines 87–91):**
```tsx
// Before — text-[13px] both
<p className="text-[13px] font-semibold text-stone-800 dark:text-stone-200 mb-1">
<p className="text-[13px] text-stone-500 dark:text-stone-400 mb-3">

// After — text-caption both
<p className="text-caption font-semibold text-stone-800 dark:text-stone-200 mb-1">
<p className="text-caption text-stone-500 dark:text-stone-400 mb-3">
```

**Recommendation links (line 98):**
```tsx
// Before
className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[12px] font-medium text-stone-700 dark:text-stone-300 hover:border-stone-400 dark:hover:border-stone-500 transition-colors"

// After — rounded-chrome, text-label
className="flex items-center gap-1.5 px-3 py-1.5 rounded-chrome bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-label font-medium text-stone-700 dark:text-stone-300 hover:border-stone-400 dark:hover:border-stone-500 transition-colors"
```

**CTA Link (line 112):**
```tsx
// Before
className="inline-block px-6 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-[14px] font-medium hover:opacity-80 transition-opacity"

// After — rounded-chrome, text-caption, hover fix
className="inline-block px-6 py-2.5 rounded-chrome bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-caption font-medium hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors"
```

**Hero headline (line 60):** Leave `text-3xl sm:text-4xl` as the responsive pair — no clean single token mapping exists (30/36px span straddles `text-heading` 24px and `text-article` 28px).

**Aside note on `text-[12px]` free tier hint (line 116):** This is `text-[12px]` which maps to `text-label` (10px). However, the line renders "Headlines & summaries below are always free." — a secondary descriptor, not a mono label. The 2px difference is acceptable; `text-label` is correct per the token decision in CONTEXT.md. Alternatively this could stay as `text-[12px]` since it's outside the locked decision list. Planner should use `text-label` for consistency.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Social proof markup | Custom component | Plain `<div>` + `<blockquote>` | One-off UI, no reuse, no complexity |
| Button hover states | Custom JS hover | Tailwind `hover:bg-*` utilities | Already established pattern across codebase |
| Dark mode colour switching | Manual JS | Tailwind `dark:` prefix | Already used everywhere in this codebase |
| Radius tokens | Hardcoded px values | `rounded-card` / `rounded-chrome` | Tokens already defined, single source of truth |

---

## Common Pitfalls

### Pitfall 1: Applying colour alongside `.section-label` unnecessarily
**What goes wrong:** CONTEXT.md says `.section-label` "doesn't prescribe colour" and suggests adding `text-stone-400 dark:text-stone-500` alongside the class. In reality, `globals.css:99` already applies these exact colours inside the class. Adding them again creates redundant but harmless duplicates, or could be confusing.
**How to avoid:** Apply `.section-label` alone. Only override colour if a non-default shade is needed (as in `components/BriefingView.tsx:128` which uses `section-label text-stone-400 dark:text-stone-600` with a darker `stone-600` dark shade).
**Warning signs:** Any `section-label text-stone-400 dark:text-stone-500` combination in the output is redundant.

### Pitfall 2: Forgetting `font-serif` + `tracking-tight` on £4/month heading
**What goes wrong:** `text-article` token sets size (28px) and weight (700) but NOT font-family or letter-spacing. The heading uses `font-serif tracking-tight`. Both must be preserved explicitly.
**How to avoid:** The after pattern is `font-serif text-article tracking-tight` — all three classes.

### Pitfall 3: Missing the `flex flex-col` requirement for SiteFooter
**What goes wrong:** `SiteFooter` uses `mt-auto` for sticky positioning, which requires the parent to be `flex flex-col`. The upgrade page outer div already has `min-h-screen flex flex-col` — this is correct. The footer must be placed as a direct child of this div, not inside `<main>`.
**How to avoid:** Render `<SiteFooter />` after `</main>` and before the closing `</div>` of the outermost container.

### Pitfall 4: Stripe checkout smoke test skipped
**What goes wrong:** Any deploy touching `/upgrade` requires end-to-end Stripe checkout verification. Even purely cosmetic changes need this check because React client components can break on SSR hydration mismatches.
**How to avoid:** Per STATE.md: "Any deploy touching `/upgrade` requires end-to-end Stripe checkout smoke test in incognito."

### Pitfall 5: `rounded-lg` vs `rounded-chrome` confusion
**What goes wrong:** `rounded-lg` in this project maps to `var(--radius)` = 0.25rem (4px) because `--radius` was reduced in Phase 1. So `rounded-lg` and `rounded-chrome` currently produce the same visual result (both 4px). However, `rounded-chrome` is the semantic token and the locked decision — use it for correctness and future-proofing.
**How to avoid:** Use `rounded-chrome` for all button/chrome elements, not `rounded-lg`, regardless of current visual parity.

---

## Code Examples

### Social proof block (recommended markup)
```tsx
{/* Social proof */}
<div className="text-center mb-6">
  <p className="section-label mb-3">
    Join 200+ law students{/* TODO: update with real count when available */}
  </p>
  <blockquote>
    <p className="text-caption italic text-stone-600 dark:text-stone-400 leading-relaxed mb-1">
      {/* TODO: replace with real testimonial */}
      &ldquo;Folio is the only prep tool I actually open every morning — the talking points are sharp enough to use straight in interviews.&rdquo;
    </p>
    <cite className="text-label text-stone-400 dark:text-stone-500 not-italic">
      — LLB student, University of Bristol
    </cite>
  </blockquote>
</div>
```
Source: CONTEXT.md decisions + established `.section-label` / `text-caption` / `text-label` patterns

### Button hover (established Phase 3 standard)
```tsx
// Dark-background primary CTA button
className="... bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors"
```
Source: `components/BriefingView.tsx:111`, `components/StoryGrid.tsx:35`, `components/ScrollToTop.tsx:23`

### Logo/link hover (established Phase 3 standard)
```tsx
// Wordmark or header link
className="... hover:text-stone-600 dark:hover:text-stone-400 transition-colors"
```
Source: Phase 3 Header.tsx fix, referenced in STATE.md accumulated context

### SiteFooter placement
```tsx
// app/upgrade/page.tsx — outer structure
<div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col">
  <header>...</header>
  <main className="flex-1 ...">...</main>
  <SiteFooter />   {/* After </main>, before closing </div> */}
</div>
```
Source: Phase 2 sticky footer pattern — `body flex flex-col + main flex-1 + footer mt-auto` (STATE.md)

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `hover:opacity-80` on buttons | `hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors` | Phase 3 | Semantic, not cosmetic hover — conveys affordance via colour not translucency |
| Arbitrary `text-[Npx]` values | Named tokens (`text-label`, `text-caption`, etc.) | Phase 1 | Single source of truth for type scale |
| `rounded-xl` everywhere | `rounded-card` (2px) for cards, `rounded-chrome` (4px) for buttons | Phase 1 | Design register: editorial flatness, not app-rounded |
| `zinc-*` palette in upgrade page | `stone-*` palette | Phase 4 (this phase) | Consistency with rest of product |

---

## Open Questions

1. **Testimonial copy authenticity**
   - What we know: No real testimonials exist yet. CONTEXT.md says use placeholder with TODO comment.
   - What's unclear: Whether the planner should invent a plausible placeholder or use an obviously-placeholder string like "Testimonial from a law student".
   - Recommendation: Use a plausible placeholder that reads naturally and is clearly marked with `{/* TODO: replace with real testimonial */}`. A realistic placeholder is more useful for design review than a lorem ipsum variant.

2. **`text-[12px]` on LandingHero free-tier hint (line 116)**
   - What we know: CONTEXT.md only specifies `text-[13px]` → `text-caption` for LandingHero. The `text-[12px]` on the free-tier hint line is not listed.
   - What's unclear: Whether this should be migrated to `text-label` (10px) or left as `text-[12px]`.
   - Recommendation: Migrate to `text-label` for consistency with CONTEXT.md's token migration intent; the 2px difference is within the "acceptable delta" precedent set for other sizes.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — no jest.config, vitest.config, pytest.ini, or test/ directory found |
| Config file | None |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONV-01 | All zinc classes replaced with stone equivalents in upgrade/page.tsx | manual-only | grep zinc app/upgrade/page.tsx (should return nothing) | N/A |
| CONV-02 | PREMIUM_FEATURES array contains outcome-framed copy | manual-only | Code review — verify first word of each feature is outcome-leading | N/A |
| CONV-03 | Social proof block appears between features card and free-tier note | manual-only | Visual inspection in browser | N/A |
| CONV-04 | LandingHero CTA and stage buttons use rounded-chrome (not rounded-xl/rounded-lg) | manual-only | grep `rounded-xl\|rounded-lg` components/LandingHero.tsx | N/A |

**Note on automation:** These are CSS/copy changes. The most effective verification is visual inspection in browser (light + dark mode) + grep-based absence checks for the removed values. No unit test framework is present in this project. The planner should include explicit grep checks as post-task verification steps.

### Sampling Rate
- **Per task commit:** `grep -n "zinc\|rounded-xl\|hover:opacity" app/upgrade/page.tsx components/LandingHero.tsx` — should return zero matches
- **Per wave merge:** Visual browser check at 375px (mobile) and 1280px (desktop) in both light and dark mode
- **Phase gate:** Stripe checkout smoke test in incognito before marking phase complete

### Wave 0 Gaps
None — no test framework setup needed. Verification is grep + visual.

---

## Sources

### Primary (HIGH confidence)
- `/Users/gregoryvitrenko/Documents/Folio/app/upgrade/page.tsx` — full current source, all 118 lines read
- `/Users/gregoryvitrenko/Documents/Folio/components/LandingHero.tsx` — full current source, all 124 lines read
- `/Users/gregoryvitrenko/Documents/Folio/app/globals.css` — confirmed `.section-label` definition (line 98–100)
- `/Users/gregoryvitrenko/Documents/Folio/tailwind.config.ts` — confirmed all tokens (text-label, text-caption, text-article, rounded-card, rounded-chrome)
- `/Users/gregoryvitrenko/Documents/Folio/.planning/phases/04-conversion-surfaces/04-CONTEXT.md` — locked decisions and discretion areas

### Secondary (MEDIUM confidence)
- grep results: `hover:bg-stone-700` across codebase — confirmed in 9 production component files, validating the pattern is the established standard
- grep results: `.section-label` usage in `components/BriefingView.tsx` — confirmed correct usage pattern in real component

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all tokens and classes verified by reading live source files
- Architecture/change inventory: HIGH — every before/after line derived from actual file content
- Pitfalls: HIGH — discovered by cross-referencing CONTEXT.md claims against live globals.css

**Research date:** 2026-03-09
**Valid until:** 2026-04-09 (stable; tokens won't change between now and execution)
