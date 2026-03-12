# Phase 13: Typography & Spacing - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Update the design system's type token values and apply the correct Playfair Display weight to all story-level headlines. Phase 13 delivers: (1) font weight correction on serif headlines, (2) type token size bumps for body and label, (3) spacing increases at grid and card level. No new font loading required — Playfair Display is already imported via `next/font/google` in `layout.tsx`, `--font-serif` is already set, and `font-serif` is already applied to StoryCard h2 (line 59) and ArticleStory h2 (line 53).

</domain>

<decisions>
## Implementation Decisions

### Serif headline reach
- **StoryCard h2**: already has `font-serif` — verify weight correction only
- **ArticleStory h2**: already has `font-serif text-article` — verify weight token is correct
- **Archive cards**: use the same StoryCard component — weight fix automatically applies
- **Page-level h1 headings** (e.g. "Today's Briefing"): NO — keep Inter. Playfair is for story-level headlines only
- **Section headers, primer/quiz headings**: NO — page chrome stays Inter
- **Boundary rule**: Playfair only for story headline content, never UI chrome

### Font weight
- StoryCard h2: `font-bold` → `font-semibold` (700 → 600) — 4 AIs flagged bold as "clumpy" for high-contrast serif at this size
- `text-article` token (ArticleStory): baked `fontWeight: '700'` → change to `'600'` in tailwind.config.ts
- `text-subheading` token (StoryCard uses this): baked `fontWeight: '500'` → this is already lighter; confirm whether `font-semibold` override on h2 is needed or if the token should be bumped to `'600'`

### Body size scope
- Global token change: `body` token `0.9375rem` (15px) → `1rem` (16px) in tailwind.config.ts
- This is intentional site-wide: quiz, firm packs, aptitude tests all benefit from 16px body text
- Article summary already uses hardcoded `text-[16px]` (ArticleStory line 58) — after token bump this becomes `text-body` semantically consistent

### Label size
- Global token change: `label` token `0.625rem` (10px) → `0.6875rem` (11px) in tailwind.config.ts
- `.section-label` class uses `text-label` — ripples automatically
- Topic chips, talking point teasers, firm tag chips also use `text-label` — 1px bump is acceptable across all

### Claude's Discretion
- Whether to update ArticleStory summary from `text-[16px]` to `text-body` after token bump (cosmetic cleanup, not required)
- Dark mode weight handling — if Playfair semibold appears too thin in dark mode, Claude may add `dark:font-medium` as a selective override
- Spacing amounts within the approved range (gap-y-6 to gap-y-8 for grid, +1 step for card internal spacing)

</decisions>

<specifics>
## Specific Ideas

- Playfair Display at semibold (600) not bold (700) — validated by Gemini in AI review: "high-contrast serifs look clumpy when too bold"
- After body token bump, ArticleStory summary (currently `text-[16px] leading-[1.75]`) should be left as-is — the hardcoded value already achieves the right reading rhythm; the cleanup to `text-body` is optional
- Spacing should feel generous like a broadsheet, not tight like a content aggregator

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `tailwind.config.ts` `fontSize` extend block: update `body`, `label`, `article` fontWeight values in place — no new keys needed
- `app/globals.css` `.section-label` class: uses `text-label` token — label size bump ripples here automatically, no edit needed
- `components/StoryCard.tsx` line 59: `font-bold` → `font-semibold` is a single class swap
- `components/ArticleStory.tsx` line 53: `text-article` — weight is baked in the token, no inline class needed

### Established Patterns
- Type token updates go in `tailwind.config.ts` `theme.extend.fontSize` — array format `[size, { lineHeight, fontWeight?, letterSpacing? }]`
- Font infrastructure: `layout.tsx` loads `Playfair_Display` with `variable: '--font-serif'`; `tailwind.config.ts` maps `var(--font-serif)` to `fontFamily.serif` — already complete
- Card spacing: `StoryCard` uses `mb-3` between elements (category label → headline → excerpt → firms → teaser → read more)
- Grid spacing: needs BriefingView / StoryGrid inspection to confirm current gap value

### Integration Points
- `tailwind.config.ts` token changes → all components using `text-body`, `text-label`, `text-article`, `text-subheading`
- `StoryCard.tsx` single class change: `font-bold` → `font-semibold` on h2
- BriefingView / StoryGrid: gap increase (gap-y-6 or gap-y-8 for the story card grid)
- `.section-label` in `globals.css`: no edit — ripples from token change

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 13-typography-spacing*
*Context gathered: 2026-03-12*
