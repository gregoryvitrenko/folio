---
phase: 01-design-tokens
plan: 01
subsystem: ui
tags: [tailwind, css-variables, design-tokens, typography, border-radius]

# Dependency graph
requires: []
provides:
  - Named type scale: text-display (36px), text-heading (24px), text-subheading (18px), text-body (15px), text-caption (13px), text-label (10px)
  - Named radius tokens: rounded-card (2px), rounded-chrome (4px), rounded-pill (9999px), rounded-input (4px)
  - CSS custom property layer: --paper (light + dark), --radius-card, --radius-chrome, --radius-pill, --radius-input
  - Component class: .section-label (font-mono text-label tracking-widest uppercase stone-400)
  - bg-paper / text-paper color utilities (warm off-white, dark-aware)
affects: [02-shell, 03-content-surfaces, 04-conversion, 05-utility]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CSS-var-backed tokens: globals.css defines values, tailwind.config.ts consumes via var(--name) — single source of truth"
    - "theme.extend.fontSize for semantic type scale: preserves all Tailwind default text-* sizes"
    - "theme.extend.borderRadius with semantic names alongside existing shadcn lg/md/sm entries"

key-files:
  created: []
  modified:
    - tailwind.config.ts
    - app/globals.css

key-decisions:
  - "Reduced --radius from 0.5rem to 0.25rem — intentional flat editorial feel; rounded-sm now ~0px which is deliberate"
  - "Radius tokens use direct values (not calc chains) for predictability"
  - "paper color uses hsl(var(--paper)) pattern to respond to dark mode toggle"
  - ".section-label placed in @layer components after @layer utilities per Tailwind cascade order"

patterns-established:
  - "Token naming: semantic names (card, chrome, pill, input) not numeric (1, 2, 3)"
  - "Dark mode overrides: only --paper needs dark override; radius values are mode-invariant"
  - "No component files touched in token phase — pure config layer"

requirements-completed: [TOKENS-01, TOKENS-02, TOKENS-03]

# Metrics
duration: 4min
completed: 2026-03-09
---

# Phase 1 Plan 01: Design Tokens Summary

**Named type scale (display through label) + radius token system (card/chrome/pill/input) + --paper CSS var established in tailwind.config.ts and globals.css as additive token contract**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-09T21:11:04Z
- **Completed:** 2026-03-09T21:14:32Z
- **Tasks:** 5/5
- **Files modified:** 2

## Accomplishments

- Established named type scale (6 slots) in theme.extend.fontSize without replacing Tailwind defaults
- Added 4 semantic borderRadius tokens (card/chrome/pill/input) alongside existing shadcn lg/md/sm
- Created CSS custom property layer: --paper (warm off-white light, warm dark dark mode), 4 --radius-* vars
- Added .section-label component class that canonicalises the ~77 uses of font-mono text-[10px] tracking-widest uppercase text-stone-400 pattern
- Full npm run build passed (zero errors, one pre-existing ESLint warning in TestSession.tsx unrelated to this plan)

## Task Commits

Each task was committed atomically:

1. **Task 1-01-01: Update --radius and add --paper + --radius-* CSS vars to :root** - `308fad0` (chore)
2. **Task 1-01-02: Add --paper to .dark block** - `a7acb53` (chore)
3. **Task 1-01-03: Add semantic borderRadius tokens and paper color to tailwind.config.ts** - `859a520` (chore)
4. **Task 1-01-04: Add fontSize semantic type scale to tailwind.config.ts** - `b0f41d1` (chore)
5. **Task 1-01-05: Add .section-label component class to globals.css** - `8713d06` (chore)

## Files Created/Modified

- `tailwind.config.ts` - Added theme.extend.fontSize (6 semantic slots), theme.extend.borderRadius (card/chrome/pill/input), theme.extend.colors.paper
- `app/globals.css` - Changed --radius to 0.25rem, added --paper + --radius-* vars to :root, --paper dark override to .dark, @layer components block with .section-label

## Decisions Made

- Used `theme.extend.fontSize` (not `theme.fontSize`) to preserve all Tailwind default text-sm/text-base/text-lg etc. — critical since ~hundreds of components use default sizes
- Reduced `--radius` from 0.5rem to 0.25rem for editorial flat feel; `rounded-sm` now resolves to `calc(0.25rem - 4px)` = effectively 0px, which is intentional
- Radius tokens use direct values (0.125rem, 0.25rem, 9999px) not calc chains — more predictable, no cascading dependency on --radius
- `.section-label` uses `@apply text-label` (not `text-[10px]`) to prove the token integration works end-to-end

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `.section-label` does not appear in compiled CSS output because Tailwind purges unused classes — this is expected behavior. The class will be included in the build once downstream phases add `class="section-label"` to components. The `@layer components` definition is correct in globals.css.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Token contract is complete. All downstream phases (Shell, Content Surfaces, Conversion, Utility) can consume:
- `text-display`, `text-heading`, `text-subheading`, `text-body`, `text-caption`, `text-label`
- `rounded-card`, `rounded-chrome`, `rounded-pill`, `rounded-input`
- `bg-paper`, `text-paper`
- `class="section-label"` in any component

No blockers. Zero component files were touched — this phase was purely additive to the config layer.

---
*Phase: 01-design-tokens*
*Completed: 2026-03-09*
