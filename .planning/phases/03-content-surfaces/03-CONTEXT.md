# Phase 3: Content Surfaces - Context

**Gathered:** 2026-03-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Polish StoryCard, ArticleStory, and BriefingView — the three most-visited components in the product. Migrate to named type scale tokens, replace hover:opacity with semantic hover states, and establish typographic consistency. Phase 3 scope is limited to these three content-surface components. Utility pages, upgrade page, firm quiz, tests, and interview practice are out of scope and handled in Phases 4–5.

</domain>

<decisions>
## Implementation Decisions

### Card surface colour
- Story cards stay `bg-white dark:bg-stone-900` — the slight contrast against the warm `bg-paper` page background gives cards visual lift
- Switching to `bg-paper` would flatten the card-to-page depth relationship
- This is an intentional deviation from the shell token: cards are surfaces ON the page, not the page itself

### Card hover state (CONT-04)
- Add `hover:border-stone-300 dark:hover:border-stone-600` alongside the existing `hover:bg-stone-50 dark:hover:bg-stone-800/40`
- Subtle border shift — editorial tone, not aggressive UI feedback
- The `group-hover:underline` on the headline and `group-hover:text-stone-600` on "Read more" are already semantic and stay
- No hover:opacity on cards — that pattern is eliminated from these components

### Article type sizes
- Add a new `text-article` token at `1.75rem` (28px) with `leading-tight` for article-level headlines — sits between `text-heading` (24px) and `text-display` (36px)
- Article body summary (`text-[16px] leading-[1.75]`) stays at 16px — not forced to `text-body` (15px) because long-form reading copy needs the extra point; use `leading-[1.75]` (no token needed, Tailwind default `leading-7` ≈ this)
- StoryCard headline (`text-[19px] sm:text-[21px]`) → migrate to `text-subheading` (18px) — 1px delta acceptable, removes responsive pair and aligns to token

### Topic label pattern
- Both StoryCard and ArticleStory use `text-[10px] font-sans font-semibold tracking-[0.12em] uppercase` — migrate to `text-label` (10px) for the size, keep explicit `tracking-[0.12em]` (slightly tighter than the `.section-label` mono pattern which uses `tracking-widest`)
- Do NOT use `.section-label` class here — topic labels are sans-serif and use a different tracking value

### BriefingView section labels
- `text-[10px] tracking-widest uppercase text-stone-400` pattern → use `.section-label` class (established in Phase 1) — these are the mono section labels, not topic labels
- `text-[9px]` in the "Start here" callout spans → migrate to `text-label` (10px) — rounding up 1px, acceptable

### hover:opacity scope (CONT-04)
- Fix only StoryCard, ArticleStory, and BriefingView in Phase 3
- ~15 hover:opacity instances remain in FirmQuiz, TrackerDashboard, TestPractice, TestSession, InterviewPractice, LandingHero, AuthButtons, UpgradeBanner, Header logo — those are cleaned up in their respective phases (4 and 5)
- The Header logo `group-hover:opacity-75` (Phase 2 deferral) is resolved in Phase 3: replace with `group-hover:text-stone-600 dark:group-hover:text-stone-400` or similar semantic colour shift

### Claude's Discretion
- Exact line-height values for migrated type (stay close to existing where token doesn't specify)
- Whether to apply the `text-article` token to the ArticleStory `<h2>` responsive pair or use it as a single non-responsive value
- Exact BriefingView strapline token (`text-[13px]` → `text-caption` is 13px — direct match, Claude can apply directly)
- The `text-[11px]` talking point teaser and "Read more" text in StoryCard — round to `text-label` (10px) or keep at 11px with a note that it falls between tokens

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/StoryCard.tsx` — card component, fully built. Already has semantic bg hover (`hover:bg-stone-50 dark:hover:bg-stone-800/40`) and group-hover patterns. Needs: headline token migration, topic label token, excerpt token, border hover addition.
- `components/ArticleStory.tsx` — article view. Headline at `text-[26px] sm:text-[32px]`, summary at `text-[16px] leading-[1.75]`. Needs: headline → `text-article` (new token), topic label → `text-label`, summary → keep 16px.
- `components/BriefingView.tsx` — homepage container. Has `hover:opacity-80` on upgrade CTA button at line 111. Section labels use raw `text-[10px] tracking-widest uppercase`. Needs: section labels → `.section-label`, `text-[9px]` → `text-label`, button hover → bg shift.
- `tailwind.config.ts` — already has `fontSize` extend block from Phase 1. New `article` slot to be added here.
- `app/globals.css` — `.section-label` class already defined from Phase 1.

### Established Patterns
- Token migration pattern (from Phase 2): replace arbitrary `text-[Npx]` with named token, remove redundant `font-bold` if token bakes it in
- `bg-paper` is shell-only — content card surfaces intentionally stay `bg-white dark:bg-stone-900`
- Border pattern: `border-stone-200 dark:border-stone-800` at rest → `border-stone-300 dark:border-stone-600` on hover (new, established here)
- Button hover: `hover:bg-stone-700 dark:hover:bg-stone-300` (background shift, not opacity) — see ScrollToTop as existing example
- `TOPIC_STYLES` in `lib/types.ts` is untouched — topic dot/label colour classes are dynamically applied, do not modify

### Integration Points
- `tailwind.config.ts` `fontSize` extend: add `article: ['1.75rem', { lineHeight: '1.2', fontWeight: '700' }]`
- StoryCard is rendered inside StoryGrid → inside BriefingView — no prop API changes needed
- ArticleStory is rendered on `/story/[id]` page directly — no parent component changes needed
- Phase 1 `.section-label` class is available globally via `globals.css` — BriefingView can use it directly

</code_context>

<specifics>
## Specific Ideas

- Cards should feel like they sit ON the page, not merge with it — the white/paper contrast is intentional
- Hover on cards: understated. A reader scanning headlines shouldn't be distracted by heavy hover effects. Subtle border shift + bg shift is enough.
- Article reading experience: 16px body copy with generous line height is correct for long-form. Don't compress it to hit a token.

</specifics>

<deferred>
## Deferred Ideas

- hover:opacity cleanup in FirmQuiz, TrackerDashboard, TestPractice, TestSession, InterviewPractice — Phase 5 (Utility Pages)
- hover:opacity cleanup in LandingHero, AuthButtons, UpgradeBanner — Phase 4 (Conversion Surfaces)
- Header logo `group-hover:opacity-75` — resolve in Phase 3 (this was deferred from Phase 2 and is now in scope)

</deferred>

---

*Phase: 03-content-surfaces*
*Context gathered: 2026-03-09*
