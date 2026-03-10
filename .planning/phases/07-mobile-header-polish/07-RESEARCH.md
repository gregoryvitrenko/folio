# Phase 7 Research: Mobile + Header Polish

## MOBILE-01 — Header scroll background (bg-paper transparency bug)

**Root cause:** `globals.css` defines `--paper` as the full HSL call:
```css
--paper: hsl(40 20% 98%);
```
But `tailwind.config.ts` wraps it again:
```ts
paper: 'hsl(var(--paper))'
```
This produces invalid CSS: `hsl(hsl(40 20% 98%))` — which browsers render as transparent. So `bg-paper` effectively has no background, meaning the header is see-through on all pages.

**Fix:** Change `globals.css` to store only the channel values (no `hsl()` wrapper):
```css
--paper: 40 20% 98%;
```
Then `hsl(var(--paper))` resolves to valid `hsl(40 20% 98%)`.

**Scope:** One line change in `globals.css`. No other files need to change.

---

## MOBILE-02 — Mobile navigation (hover-only, no hamburger, bad tap targets)

**Root cause (3 issues):**

1. **Touch devices ignore hover events** — nav dropdowns use `onMouseEnter`/`onMouseLeave` which don't fire on touch. Outside-click listener uses `mousedown` not `pointerdown` (misses touch).
2. **No hamburger / mobile menu** — five nav groups cannot fit in 343px of available width at 375px. There is no `flex md:hidden` hamburger button.
3. **Tap targets are ~26px tall** — minimum accessible touch target is 44px.

**Fix:**
- Add hamburger button (`flex md:hidden`) that toggles a mobile drawer
- Mobile drawer: flat link list (no dropdowns), 44px+ touch targets
- Desktop nav: `hidden md:flex` (unchanged)
- Switch outside-click listener from `mousedown` → `pointerdown`

**No new npm packages needed.** State-only with `useState`.

---

## MOBILE-03 — Story card overflow at 375px

**Root cause:** The grid is already correctly `grid-cols-1 lg:grid-cols-2`. The issue is CSS Grid's default `min-width: auto` — grid items won't shrink below their content's intrinsic width. Long unbreakable text (URLs, firm names) can push grid items wider than the viewport.

**Fix:** Add `min-w-0` to:
- The outer `<div>` wrapper in `StoryCard.tsx`
- The `<div id="story-...">` wrapper in `StoryGrid.tsx`

This overrides `min-width: auto` with `min-width: 0`, allowing the grid items to shrink correctly.

**Scope:** 2 files, 1 class addition each.

---

## Summary

| Requirement | Root Cause | Fix | Files |
|-------------|-----------|-----|-------|
| MOBILE-01 | `--paper` stored as full `hsl()` — double-wrapped | Remove `hsl()` wrapper from `globals.css` | `app/globals.css` |
| MOBILE-02 | Hover-only nav, no hamburger, 26px tap targets | Add hamburger + mobile drawer; switch to `pointerdown` | `components/Header.tsx`, `components/NavDropdowns.tsx` |
| MOBILE-03 | CSS Grid `min-width: auto` overflow | Add `min-w-0` to grid item wrappers | `components/StoryCard.tsx`, `components/StoryGrid.tsx` |

**No new npm packages required.**
