---
phase: 31-complete-design-overhaul
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - components/TabBar.tsx
  - app/primers/page.tsx
  - app/tests/page.tsx
  - app/interview/page.tsx
  - app/quiz/practice/[topic]/page.tsx
autonomous: true
requirements:
  - POLISH-05
  - POLISH-03

must_haves:
  truths:
    - "Topic filter tabs show uppercase text only — no colored dot beside any topic name"
    - "Primers, tests, interview, and quiz practice page headings are horizontally centered"
    - "The 'By Practice Area' grid on the interview page has no colored dots beside topic labels"
  artifacts:
    - path: "components/TabBar.tsx"
      provides: "Topic filter tabs without colored dots"
    - path: "app/primers/page.tsx"
      provides: "Centered heading block"
    - path: "app/tests/page.tsx"
      provides: "Centered heading block"
    - path: "app/interview/page.tsx"
      provides: "Centered heading block, no colored dots in practice area grid"
    - path: "app/quiz/practice/[topic]/page.tsx"
      provides: "Centered heading block"
  key_links:
    - from: "components/TabBar.tsx"
      to: "TOPIC_STYLES[topic].dot"
      via: "span element removed"
      pattern: "w-1\\.5 h-1\\.5 rounded-full"
---

<objective>
Remove colored dots from topic filter tabs (POLISH-05) and add `text-center` to the heading blocks on four secondary pages (POLISH-03).

Purpose: Two low-risk, surgical changes with no logic impact — pure markup edits. Grouping them in one plan keeps context light.
Output: TabBar without dot spans; centered headings on primers, tests, interview, and quiz practice pages.
</objective>

<execution_context>
@/Users/gregoryvitrenko/.claude/get-shit-done/workflows/execute-plan.md
@/Users/gregoryvitrenko/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md

Key design tokens (from CLAUDE.md):
- `.section-label` — overline labels (font-mono uppercase tracking-widest)
- `rounded-card` (2px), `rounded-chrome` (4px)
- Stone palette for content, zinc for UI chrome
- NEVER start dev server — verify via `npx tsc --noEmit`
</context>

<interfaces>
<!-- From components/TabBar.tsx — current dot element to remove -->
```tsx
// Line 54 — DELETE this entire span:
<span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${styles.dot}`} />
// Also remove gap-1 from parent Link className (becomes no gap needed, but gap-1 is harmless — remove for cleanliness)
```

<!-- From app/primers/page.tsx — current heading block (lines 18-24) -->
```tsx
<div className="space-y-4 mb-12">
  <span className="text-[11px] uppercase tracking-[0.3em] font-semibold opacity-40 font-sans">
    Practice Area Primers
  </span>
  <h2 className="text-5xl font-serif">Topic Primers</h2>
  <p className="max-w-xl opacity-60 text-lg font-light">Eight areas. Essential for interviews.</p>
</div>
```

<!-- From app/tests/page.tsx — current heading block (lines 18-24) -->
```tsx
<div className="space-y-4 mb-12">
  <span className="text-[11px] uppercase tracking-[0.3em] font-semibold opacity-40 font-sans">
    Aptitude Preparation
  </span>
  <h2 className="text-5xl font-serif">Psychometric Tests</h2>
  <p className="max-w-xl opacity-60 text-lg font-light">Watson Glaser and SJT practice.</p>
</div>
```

<!-- From app/interview/page.tsx — current heading block (lines 57-63) -->
```tsx
<div className="space-y-4 mb-12">
  <span className="text-[11px] uppercase tracking-[0.3em] font-semibold opacity-40 font-sans">
    Interview Preparation
  </span>
  <h2 className="text-5xl font-serif">Practice Questions</h2>
  <p className="max-w-xl opacity-60 text-lg font-light">Drawn from firm packs and sector primers.</p>
</div>
```
<!-- interview/page.tsx also has colored dots in the "By Practice Area" grid at line 133:
     <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${styles.dot}`} />  — DELETE this too -->

<!-- From app/quiz/practice/[topic]/page.tsx — current heading block (lines 55-63) -->
```tsx
<div className="space-y-3 mb-12">
  <span className="section-label opacity-40">Deep Practice</span>
  <h2 className="text-5xl font-serif text-stone-900 dark:text-stone-50">{topicLabel}</h2>
  {practiceSet && (
    <p className="max-w-xl opacity-60 text-lg font-light font-sans">
      {practiceSet.questions.length} questions — updated weekly
    </p>
  )}
</div>
```
</interfaces>

<tasks>

<task type="auto">
  <name>Task 1: Remove colored dots from TabBar and interview page practice grid</name>
  <files>components/TabBar.tsx, app/interview/page.tsx</files>
  <action>
In `components/TabBar.tsx`:
- On line 48, change `flex items-center gap-1` to `flex items-center` (remove `gap-1` since there will be no dot)
- On line 54, delete the entire `<span>` element: `<span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${styles.dot}`} />`
- Result: each topic Link renders only the topic text, no dot preceding it

In `app/interview/page.tsx` (the "By Practice Area" grid, around line 133):
- Find the `<div className="flex items-center gap-2">` inside the primer Link cards
- Delete the `<span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${styles.dot}`} />` element
- Change the parent div from `gap-2` to `gap-0` or remove the wrapper div if it only existed to space the dot (keep the `section-label` span)
- Do NOT remove the `styles.label` color class from the category text — only the dot span

Do not change any routing, logic, or other styling.
  </action>
  <verify>
    <automated>cd /Users/gregoryvitrenko/Documents/Folio && npx tsc --noEmit 2>&1 | tail -20</automated>
  </verify>
  <done>No TypeScript errors. No `w-1.5 h-1.5 rounded-full` span exists in TabBar.tsx. No colored dot span exists in the practice area grid in interview/page.tsx.</done>
</task>

<task type="auto">
  <name>Task 2: Center heading blocks on primers, tests, interview, and quiz practice pages</name>
  <files>app/primers/page.tsx, app/tests/page.tsx, app/interview/page.tsx, app/quiz/practice/[topic]/page.tsx</files>
  <action>
Apply `text-center` to the heading wrapper div and remove the `max-w-xl` constraint from the description paragraph (centering works better without a left-aligned width cap) on each page. Exact changes:

**app/primers/page.tsx** (lines 18-24):
- Change `<div className="space-y-4 mb-12">` → `<div className="space-y-4 mb-12 text-center">`
- Change `<p className="max-w-xl opacity-60 text-lg font-light">` → `<p className="opacity-60 text-lg font-light">`

**app/tests/page.tsx** (lines 18-24):
- Change `<div className="space-y-4 mb-12">` → `<div className="space-y-4 mb-12 text-center">`
- Change `<p className="max-w-xl opacity-60 text-lg font-light">` → `<p className="opacity-60 text-lg font-light">`

**app/interview/page.tsx** (lines 57-63):
- Change `<div className="space-y-4 mb-12">` → `<div className="space-y-4 mb-12 text-center">`
- Change `<p className="max-w-xl opacity-60 text-lg font-light">` → `<p className="opacity-60 text-lg font-light">`

**app/quiz/practice/[topic]/page.tsx** (lines 55-63):
- Change `<div className="space-y-3 mb-12">` → `<div className="space-y-3 mb-12 text-center">`
- Change `<p className="max-w-xl opacity-60 text-lg font-light font-sans">` → `<p className="opacity-60 text-lg font-light font-sans">`

No other changes. Do not touch any other content on these pages.
  </action>
  <verify>
    <automated>cd /Users/gregoryvitrenko/Documents/Folio && npx tsc --noEmit 2>&1 | tail -20</automated>
  </verify>
  <done>No TypeScript errors. All four heading divs have `text-center` in their className. No `max-w-xl` on description paragraphs within those heading blocks.</done>
</task>

</tasks>

<verification>
`npx tsc --noEmit` passes with zero errors after both tasks. Grep confirms: no `w-1.5 h-1.5 rounded-full` in TabBar.tsx, and `text-center` present in heading divs of all four target pages.
</verification>

<success_criteria>
- Topic tabs render without colored dots — clean uppercase text only with bottom border on active
- Primers, tests, interview, and quiz practice headings are center-aligned
- Zero TypeScript errors introduced
</success_criteria>

<output>
After completion, create `.planning/phases/31-complete-design-overhaul/31-01-SUMMARY.md`
</output>

---
phase: 31-complete-design-overhaul
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - components/PrimerCard.tsx
autonomous: true
requirements:
  - POLISH-04

must_haves:
  truths:
    - "Primer cards show a plain text category chip with no colored icon or icon background"
    - "Primer cards show a clock icon and read time derived from primer.readTimeMinutes"
    - "Primer cards show the serif title, a thin horizontal divider, and a READ PRIMER arrow link text"
    - "Section count and interview Q count chips are gone from primer cards"
    - "Chevron arrow icon is gone from the card footer"
  artifacts:
    - path: "components/PrimerCard.tsx"
      provides: "Redesigned minimal primer card matching mockup"
  key_links:
    - from: "components/PrimerCard.tsx"
      to: "primer.readTimeMinutes"
      via: "Clock icon + text render"
      pattern: "readTimeMinutes"
---

<objective>
Redesign `PrimerCard.tsx` from its current icon-heavy, stat-heavy style to the minimal mockup: plain category chip, clock + read time, serif title, thin divider, "READ PRIMER ↗" link text (POLISH-04).

Purpose: The mockup primer card is cleaner and more editorial. The current card is cluttered with counts and a colored icon that conflict with the newspaper aesthetic.
Output: Updated `components/PrimerCard.tsx` with new minimal layout.
</objective>

<execution_context>
@/Users/gregoryvitrenko/.claude/get-shit-done/workflows/execute-plan.md
@/Users/gregoryvitrenko/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md

Key design tokens (from CLAUDE.md):
- `rounded-card` (2px) for cards — NOT `rounded-xl`
- `.section-label` for overline/category labels
- `text-caption` semantic token for small text
- Stone palette — white card background, stone borders
- No emojis. No colored icons in this redesign.
- NEVER start dev server — verify via `npx tsc --noEmit`
</context>

<interfaces>
<!-- Primer interface (from lib/types.ts and lib/primers-data.ts) -->
```typescript
export interface Primer {
  slug: string;
  category: TopicCategory;   // e.g. 'M&A', 'Capital Markets'
  title: string;
  strapline: string;
  readTimeMinutes: number;   // e.g. 12 — USE THIS for read time display
  sections: PrimerSection[];
  interviewQs?: PrimerInterviewQ[];
}
```

<!-- Current PrimerCard.tsx — full component to replace -->
The current card has:
1. Icon + colored category label row (lines 38-41) — REMOVE icon, keep category text only
2. Serif title h3 (lines 44-47) — KEEP, same styling
3. Strapline p (lines 50-51) — REMOVE (mockup doesn't show strapline)
4. Footer with section count + interview Q count + chevron (lines 54-66) — REPLACE entirely

<!-- Target structure (mockup) -->
```tsx
<Link href={`/primers/${primer.slug}`} className="block group">
  <article className="flex flex-col h-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-card px-5 pt-5 pb-5 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">

    {/* Category chip — text only, no icon, no color background */}
    <div className="mb-3">
      <span className="section-label text-stone-500 dark:text-stone-400">{primer.category}</span>
    </div>

    {/* Serif title */}
    <h3 className="font-serif text-[18px] font-bold leading-snug text-stone-900 dark:text-stone-50 tracking-tight group-hover:underline decoration-stone-400 dark:decoration-stone-500 underline-offset-2 mb-3">
      {primer.title}
    </h3>

    {/* Clock + read time */}
    <div className="flex items-center gap-1.5 text-caption text-stone-400 dark:text-stone-500 mb-4">
      <Clock size={12} />
      <span>{primer.readTimeMinutes} min read</span>
    </div>

    {/* Thin divider */}
    <div className="mt-auto pt-4 border-t border-stone-100 dark:border-stone-800">
      {/* READ PRIMER link text */}
      <span className="text-[11px] font-sans font-semibold tracking-[0.08em] uppercase text-stone-500 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-50 transition-colors">
        Read Primer ↗
      </span>
    </div>

  </article>
</Link>
```

Import: Replace `{ TrendingUp, BarChart2, Landmark, Zap, Scale, Gavel, Globe, Bot, ChevronRight }` with `{ Clock }` from lucide-react.
Remove: `TOPIC_ICONS` constant, `TOPIC_ICON_COLORS` constant, `Icon` and `iconColor` variables.
Remove: `import { TOPIC_STYLES } from '@/lib/types'` if no longer used (it won't be — the new design uses plain text with no color class).
</interfaces>

<tasks>

<task type="auto">
  <name>Task 1: Rewrite PrimerCard to minimal mockup layout</name>
  <files>components/PrimerCard.tsx</files>
  <action>
Replace the entire content of `components/PrimerCard.tsx` with the minimal mockup design:

1. **Imports**: Keep `React`, `Link`, `type Primer` from their current locations. Replace all lucide icon imports with `{ Clock }` only. Remove `import { TOPIC_STYLES } from '@/lib/types'` and `import type { TopicCategory } from '@/lib/types'` (keep `type Primer` import — `TopicCategory` is no longer needed).

2. **Remove constants**: Delete `TOPIC_ICONS` and `TOPIC_ICON_COLORS` record constants entirely.

3. **Component**: Rewrite the component body to use only `primer.category`, `primer.title`, `primer.readTimeMinutes`, and `primer.slug`. No `styles`, `Icon`, or `iconColor` variables.

4. **Card layout** (top to bottom):
   - Category chip: `<span className="section-label text-stone-500 dark:text-stone-400">{primer.category}</span>` wrapped in a `<div className="mb-3">`
   - Serif title: `<h3>` with same classes as current (font-serif, text-[18px], font-bold, leading-snug, group-hover:underline, etc.) — `mb-3` bottom margin
   - Read time row: `<div className="flex items-center gap-1.5 text-caption text-stone-400 dark:text-stone-500 mb-4">` containing `<Clock size={12} />` and `<span>{primer.readTimeMinutes} min read</span>`
   - Thin divider + link text: `<div className="mt-auto pt-4 border-t border-stone-100 dark:border-stone-800">` containing `<span className="text-[11px] font-sans font-semibold tracking-[0.08em] uppercase text-stone-500 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-50 transition-colors">Read Primer ↗</span>`

5. The outer `<article>` wrapper keeps its current classes: `flex flex-col h-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-card px-5 pt-5 pb-5 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors`

6. The `<Link>` wrapper keeps `block group`.

Do not change the file path or component name.
  </action>
  <verify>
    <automated>cd /Users/gregoryvitrenko/Documents/Folio && npx tsc --noEmit 2>&1 | tail -20</automated>
  </verify>
  <done>No TypeScript errors. PrimerCard.tsx has no reference to TOPIC_ICONS, TOPIC_ICON_COLORS, ChevronRight, or TOPIC_STYLES. It imports Clock from lucide-react. It renders primer.readTimeMinutes with a Clock icon.</done>
</task>

</tasks>

<verification>
`npx tsc --noEmit` passes. `grep -n "TOPIC_ICONS\|ChevronRight\|iconColor\|sections.length\|interviewQs.length" components/PrimerCard.tsx` returns nothing.
</verification>

<success_criteria>
- Primer cards render with: plain category chip, clock + read time, serif title, thin divider, "Read Primer ↗" text
- No colored icon, no section count, no interview Q count, no chevron
- TypeScript clean
</success_criteria>

<output>
After completion, create `.planning/phases/31-complete-design-overhaul/31-02-SUMMARY.md`
</output>

---
phase: 31-complete-design-overhaul
plan: 03
type: execute
wave: 1
depends_on: []
files_modified:
  - app/quiz/page.tsx
autonomous: true
requirements:
  - POLISH-01

must_haves:
  truths:
    - "Quiz page gamification stats strip is positioned at the top-right of the heading row, not below it"
    - "Start Daily Quiz button href is /quiz/[activeDate] — not a circular /quiz link"
    - "No archive date list exists anywhere on the quiz page"
    - "Daily briefing card uses bg-[#1B2333] dark navy background"
    - "Section headers use text-2xl font-serif italic style"
    - "Practice area cards have no colored dot elements"
  artifacts:
    - path: "app/quiz/page.tsx"
      provides: "Fully reworked quiz page matching mockup layout"
  key_links:
    - from: "app/quiz/page.tsx"
      to: "/quiz/[activeDate]"
      via: "Start Daily Quiz Link href"
      pattern: "href.*quiz.*activeDate"
---

<objective>
Verify and correct the quiz page against the POLISH-01 requirements. The current implementation already has most of the correct structure — this task audits each requirement and applies any remaining fixes (POLISH-01).

Purpose: The quiz page went through multiple iterations; some mockup gaps may already be resolved. Audit all six POLISH-01 criteria and fix any that remain outstanding.
Output: Confirmed or corrected `app/quiz/page.tsx` matching all POLISH-01 success criteria.
</objective>

<execution_context>
@/Users/gregoryvitrenko/.claude/get-shit-done/workflows/execute-plan.md
@/Users/gregoryvitrenko/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md

Key design tokens (from CLAUDE.md):
- `bg-[#1B2333]` — dark navy for the daily quiz card (NOT `#2D3436` charcoal)
- `.section-label` — overline labels
- `text-2xl font-serif italic` — section header style per spec
- `rounded-card` (2px), `rounded-chrome` (4px)
- NEVER start dev server — verify via `npx tsc --noEmit`
</context>

<interfaces>
<!-- Current quiz page structure (from app/quiz/page.tsx read above) -->

The current page already has:
- Heading row: `flex items-start justify-between gap-8 mb-12 flex-wrap` with heading left, statsStrip right — CORRECT
- Daily quiz card: `bg-[#1B2333]` — CORRECT
- Start Daily Quiz href: `/quiz/${activeDate}` — CORRECT
- No archive date list — CORRECT
- Section headers: `text-2xl font-serif italic` — CORRECT (lines 141, 184)
- Practice area cards: no colored dots — CORRECT (no dot span in the Link cards)

Remaining gap to check:
- The `statsStrip` is only rendered when `gamification` is non-null. When null (no data yet), the heading row still uses `flex items-start justify-between`. This is fine — the stats simply don't render.
- Verify there is no `dateList` or archive section — confirmed absent in current code.

If all criteria are already met, document this in the summary and make NO changes (or only remove any stale code if found).

If any gap is found during audit, fix it surgically. Do not rewrite working code.
</interfaces>

<tasks>

<task type="auto">
  <name>Task 1: Audit and fix any remaining POLISH-01 gaps in quiz page</name>
  <files>app/quiz/page.tsx</files>
  <action>
Read `app/quiz/page.tsx` carefully and verify each POLISH-01 criterion:

1. **Stats strip position**: Confirm `statsStrip` renders inside the `flex items-start justify-between` heading row div, on the right side (after the heading `<div>`). If it is below the heading div instead, move it inside the flex row.

2. **Start Daily Quiz href**: Confirm the Link href is `href={\`/quiz/${activeDate}\`}` — NOT `href="/quiz"`. If wrong, fix it.

3. **No archive date list**: Confirm there is no `<ul>` or date loop rendering past quiz dates. If present, remove it.

4. **Dark navy card**: Confirm the daily quiz card uses `bg-[#1B2333]`. If it uses `bg-[#2D3436]` or another value, change it to `bg-[#1B2333]`.

5. **Section headers**: Confirm both "Daily Briefing" and "Deep Practice" headings use `text-2xl font-serif italic`. If they use a different style, update them.

6. **No colored dots in practice cards**: Confirm the `DEEP_PRACTICE_TOPICS.map(...)` Link cards contain no `w-1.5 h-1.5 rounded-full` span. If present, remove it.

After the audit: if all 6 criteria are already correct (which the file read suggests they are), make zero changes and note "POLISH-01 already implemented" in the summary. If any fix is needed, apply it and re-run TypeScript.
  </action>
  <verify>
    <automated>cd /Users/gregoryvitrenko/Documents/Folio && npx tsc --noEmit 2>&1 | tail -20</automated>
  </verify>
  <done>No TypeScript errors. All 6 POLISH-01 criteria confirmed met (either already correct or fixed). Summary documents which criteria were already correct vs fixed.</done>
</task>

</tasks>

<verification>
`npx tsc --noEmit` passes. All 6 POLISH-01 criteria verified against the file content.
</verification>

<success_criteria>
- Stats strip in heading row top-right
- Start Daily Quiz links to `/quiz/[activeDate]`
- No archive date list on the page
- Dark navy `#1B2333` card
- Section headers `text-2xl font-serif italic`
- No colored dots in practice area cards
</success_criteria>

<output>
After completion, create `.planning/phases/31-complete-design-overhaul/31-03-SUMMARY.md`
</output>

---
phase: 31-complete-design-overhaul
plan: 04
type: execute
wave: 1
depends_on: []
files_modified:
  - components/BriefingView.tsx
  - app/firm-fit/page.tsx
autonomous: true
requirements:
  - POLISH-02
  - POLISH-06

must_haves:
  truths:
    - "A centered editorial masthead appears above the topic tabs on the briefing home page"
    - "The masthead shows 'LONDON EDITION' left-flanking text, large serif 'Folio' wordmark center, and 'VOL. 1 / NO. XX' right-flanking text"
    - "The Fit Assessment heading on /firm-fit is centered"
  artifacts:
    - path: "components/BriefingView.tsx"
      provides: "Editorial masthead above StoryGrid"
    - path: "app/firm-fit/page.tsx"
      provides: "Centered heading wrapper"
  key_links:
    - from: "components/BriefingView.tsx"
      to: "components/StoryGrid.tsx (TabBar inside)"
      via: "Masthead rendered immediately above <StoryGrid>"
      pattern: "LONDON EDITION"
---

<objective>
Add the centered editorial masthead above the topic tabs on the briefing home page (POLISH-02) and center the Fit Assessment page heading (POLISH-06).

Purpose: The masthead gives the home page its newspaper identity — "Folio" as a large serif wordmark flanked by dateline text. The firm-fit heading center-align is a one-line fix.
Output: Updated `components/BriefingView.tsx` with masthead; updated `app/firm-fit/page.tsx` with centered heading.
</objective>

<execution_context>
@/Users/gregoryvitrenko/.claude/get-shit-done/workflows/execute-plan.md
@/Users/gregoryvitrenko/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md

Key design tokens (from CLAUDE.md):
- `.section-label` — font-mono uppercase tracking-widest (use for flanking "LONDON EDITION" and "VOL." text)
- `font-serif` — Playfair Display for the "Folio" wordmark
- Stone palette — no bright colors in the masthead
- `rounded-card` (2px), `rounded-chrome` (4px)
- NEVER start dev server — verify via `npx tsc --noEmit`
</context>

<interfaces>
<!-- From components/BriefingView.tsx — insertion point -->
The masthead goes ABOVE the `<StoryGrid>` call (currently in a `<div className="mb-12">`).
Insert it between the "Start Here callouts" block and the story grid div.

<!-- Masthead structure -->
```tsx
{/* Editorial masthead — above topic tabs */}
<div className="flex items-center justify-between gap-4 py-5 mb-2 border-b border-stone-200 dark:border-stone-800">
  <span className="section-label text-stone-400 dark:text-stone-500 flex-shrink-0">London Edition</span>
  <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 text-center flex-1">
    Folio
  </h1>
  <span className="section-label text-stone-400 dark:text-stone-500 flex-shrink-0 text-right">
    Vol. 1 / No. {issueNumber}
  </span>
</div>
```

Issue number: derive from `briefing.date` — count days since launch date 2026-03-01 (a reasonable fixed launch reference). Use a simple calculation:
```tsx
const LAUNCH_DATE = new Date('2026-03-01');
const briefingDate = new Date(briefing.date);
const issueNumber = Math.max(1, Math.round((briefingDate.getTime() - LAUNCH_DATE.getTime()) / (1000 * 60 * 60 * 24)) + 1);
```

<!-- From app/firm-fit/page.tsx — current structure -->
The page renders only `<FirmQuiz />`. FirmQuiz is a full-page client component with its own header and centered `text-center` intro screen. The heading is already centered within FirmQuiz's IntroScreen (line 66: `<div className="w-full max-w-md text-center">`).

Therefore POLISH-06 is already implemented — FirmQuiz renders centered. Document this finding in the summary. No code change needed for firm-fit/page.tsx.
</interfaces>

<tasks>

<task type="auto">
  <name>Task 1: Add editorial masthead to BriefingView above StoryGrid</name>
  <files>components/BriefingView.tsx</files>
  <action>
In `components/BriefingView.tsx`, add the editorial masthead immediately before the `<div className="mb-12">` that wraps `<StoryGrid>`.

Exact placement: after the closing `</div>` of the "Start Here callouts" block (or after the strapline paragraph if no callouts block for subscribed users), and before `{/* Story grid with practice group tabs */}`.

Implement the issue number calculation at the top of the component function, after the props destructuring:
```tsx
const LAUNCH_DATE = new Date('2026-03-01');
const briefingDate = new Date(briefing.date);
const issueNumber = Math.max(1, Math.round((briefingDate.getTime() - LAUNCH_DATE.getTime()) / (1000 * 60 * 60 * 24)) + 1);
```

Masthead JSX to insert:
```tsx
{/* Editorial masthead */}
<div className="flex items-center justify-between gap-4 py-5 mb-2 border-b border-stone-200 dark:border-stone-800">
  <span className="section-label text-stone-400 dark:text-stone-500 flex-shrink-0">London Edition</span>
  <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 text-center flex-1">
    Folio
  </h1>
  <span className="section-label text-stone-400 dark:text-stone-500 flex-shrink-0 text-right">
    Vol. 1 / No. {issueNumber}
  </span>
</div>
```

No other changes to BriefingView. Do not touch the strapline, start-here callouts, SectorWatch, upgrade block, or footer.

Note: `BriefingView` is a server component (no 'use client' directive) — `new Date()` is fine here.
  </action>
  <verify>
    <automated>cd /Users/gregoryvitrenko/Documents/Folio && npx tsc --noEmit 2>&1 | tail -20</automated>
  </verify>
  <done>No TypeScript errors. BriefingView.tsx contains "London Edition" and "Vol. 1 / No." text. The masthead div with `flex items-center justify-between` appears before the story grid div.</done>
</task>

<task type="auto">
  <name>Task 2: Verify Fit Assessment heading alignment (POLISH-06)</name>
  <files>app/firm-fit/page.tsx</files>
  <action>
Read `app/firm-fit/page.tsx` and `components/FirmQuiz.tsx` (IntroScreen section, lines 40-120).

The FirmQuiz IntroScreen renders its intro heading inside `<div className="w-full max-w-md text-center">` (line 66 of FirmQuiz.tsx). This means the heading `<h2 className="font-serif text-3xl font-bold...">Which type of law firm suits you?</h2>` is already centered via `text-center` on the wrapper.

If this is confirmed, make NO changes to `app/firm-fit/page.tsx` — document "POLISH-06 already implemented" in the summary.

If for any reason the heading is NOT centered (e.g., a wrapper div outside FirmQuiz is overriding), wrap the FirmQuiz render in a centered container. But this should not be necessary based on the file read.
  </action>
  <verify>
    <automated>cd /Users/gregoryvitrenko/Documents/Folio && npx tsc --noEmit 2>&1 | tail -20</automated>
  </verify>
  <done>TypeScript passes. POLISH-06 status confirmed and documented (already centered or fixed if not).</done>
</task>

</tasks>

<verification>
`npx tsc --noEmit` passes. `grep -n "London Edition" components/BriefingView.tsx` returns a match. `grep -n "Vol. 1" components/BriefingView.tsx` returns a match.
</verification>

<success_criteria>
- Editorial masthead visible above topic tabs on home page with "London Edition", serif "Folio", and dynamic "Vol. 1 / No. XX"
- Fit Assessment heading confirmed centered (already was, or fixed)
- Zero TypeScript errors
</success_criteria>

<output>
After completion, create `.planning/phases/31-complete-design-overhaul/31-04-SUMMARY.md`
</output>
