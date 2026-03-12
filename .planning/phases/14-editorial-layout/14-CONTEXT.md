# Phase 14: Editorial Layout - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Restructure the home briefing view so that stories display in a newspaper-style hierarchy: a dominant lead story (story[0]) at the top, two secondary stories (stories[1-2]) in a side-by-side row below it, a visual divider, then the remaining stories (stories[3+]) in the existing 2-column grid. This replaces the current flat 8-card grid with editorial hierarchy. No new data sources, no API changes — pure layout restructuring of StoryGrid.

</domain>

<decisions>
## Implementation Decisions

### Lead story presentation
- Story[0] renders full-width (spans both grid columns on desktop) with a larger headline using `text-article` token (28px Playfair Display semibold) instead of the standard `text-subheading` (18px)
- Full summary visible on the lead card (no line-clamp truncation)
- Same StoryCard component with a `featured` variant prop, OR a separate lead section in StoryGrid — Claude decides the cleanest approach
- Lead card should feel like a newspaper front-page lede: the story that announces "this is today's top item"

### Secondary story row
- Stories[1] and [2] render in a 2-column row between the lead and the divider
- Same StoryCard size/format as the remaining grid cards — the distinction is positional (they're above the divider), not visual
- No special styling on secondary cards — their elevated position relative to the grid is enough hierarchy

### Divider
- A clean horizontal rule between the featured section (lead + secondary) and the remaining grid (stories[3+])
- Style consistent with the existing "Bigger Picture" divider pattern in BriefingView: `h-px bg-stone-200 dark:bg-stone-800`
- No label text on the divider — just a clean visual break

### Mobile behaviour
- On mobile (< lg breakpoint), ALL stories render as same-sized StoryCards in a single column — no lead story visual distinction
- The editorial hierarchy (lead dominance, secondary row) only appears on lg+ screens
- No divider on mobile — keep the current seamless single-column card flow as-is
- The mid-grid nudge positioning stays as currently implemented on mobile

### Claude's Discretion
- Whether to use a `featured` variant prop on StoryCard or render the lead story as a separate section in StoryGrid
- Tablet breakpoint for the secondary 2-column row (md or lg — pick what looks best)
- Mid-grid upgrade nudge placement — either after the divider or after card 4 overall, whichever flows better
- Exact spacing between lead card, secondary row, divider, and remaining grid
- Whether lead story shows the talking point teaser (it's long-form — might not need the hook)

</decisions>

<specifics>
## Specific Ideas

- ChatGPT's AI review said the lead story pattern makes the briefing feel like a "curated daily edition" instead of a flat card feed — that's the goal
- The lead story headline should use Playfair Display at the `text-article` size (28px) — the same token used on the full article page, creating visual continuity between the card and the article
- "Broadsheet, not content aggregator" — the layout should feel like opening a newspaper where the top story is immediately clear

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/StoryCard.tsx` — current card component, no variant prop. Would need a `featured?: boolean` prop to render larger headline + full summary, OR the lead section could be separate JSX in StoryGrid
- `components/StoryGrid.tsx` — currently renders all stories in flat `grid grid-cols-1 lg:grid-cols-2 gap-6` with MidGridNudge after index 3. This is the primary file to restructure.
- `components/BriefingView.tsx` — wraps StoryGrid. Has the "Bigger Picture" divider pattern (lines 62-68) that can be reused for the featured/grid divider
- `tailwind.config.ts` — `text-article` token at 28px/semibold available for lead headline; `text-subheading` at 18px for standard cards

### Established Patterns
- Divider pattern: `<div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />` (BriefingView line 63)
- Card surfaces: `bg-white dark:bg-stone-900` with border, never `bg-paper` (Phase 3 decision)
- Grid responsive: `grid-cols-1 lg:grid-cols-2` is the established breakpoint for 2-column
- Stories array: `briefing.stories` is always ordered — story[0] is the lead by convention

### Integration Points
- `StoryGrid` receives `stories`, `date`, `subscribed` — no parent changes needed in BriefingView
- MidGridNudge (`!subscribed && i === NUDGE_AFTER`) currently tied to index 3 — needs adjustment for new layout
- TabBar renders above the grid — stays in place, unaffected by layout restructuring
- Archive pages at `/archive/[date]` also use StoryGrid — the editorial layout should only apply to the main briefing, OR archive can inherit it (Claude decides based on implementation simplicity)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 14-editorial-layout*
*Context gathered: 2026-03-12*
