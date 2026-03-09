# Phase 2: Shell - Research

**Researched:** 2026-03-09
**Domain:** Next.js 15 layout shell — Header token migration, SiteFooter completion, sticky-footer flex fix
**Confidence:** HIGH

## Summary

Phase 2 is a targeted refactor of two existing components: `Header.tsx` and `SiteFooter.tsx`. The work is well-scoped and low-risk. All Phase 1 design tokens are confirmed present in `tailwind.config.ts` and `globals.css` — the `text-display`, `text-label`, and `bg-paper` utilities are ready to use. No new dependencies are needed.

The Header requires three token substitutions: the Folio wordmark (`text-[32px] sm:text-[38px]` → `text-display`), the date label (`text-[11px]` → `text-label`), and the header/dropdown backgrounds (`bg-stone-50 dark:bg-stone-950` → `bg-paper dark:bg-paper`). The `NavDropdowns.tsx` panel background also needs the `bg-paper` migration.

The SiteFooter requires two new links (Feedback + LinkedIn) and a layout fix in `app/layout.tsx` to make `mt-auto` effective: `flex flex-col` must be added to the `<body>` tag, and `{children}` must be wrapped in an element with `flex-1`.

**Primary recommendation:** Make the three Header substitutions, add two footer links, and apply the `flex flex-col` / `flex-1` sticky-footer fix to `app/layout.tsx`. No architectural changes needed.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Footer links
- Feedback → `mailto:hello@folioapp.co.uk` (simple, no setup, direct)
- LinkedIn → `https://www.linkedin.com/in/gregory-vitrenko-7258a0350` (personal profile — used for Folio marketing)
- Keep existing: Terms → `/terms`, Privacy → `/privacy`, Contact → `mailto:hello@folioapp.co.uk`
- Final footer link order: Feedback · Terms · Privacy · Contact · LinkedIn

#### Footer sticky layout
- Body element needs `flex flex-col` added alongside existing `min-h-screen`
- The content wrapper (`{children}`) needs `flex-1` so the footer pins to the bottom on short pages
- The SiteFooter already has `mt-auto` — the flex fix makes it effective

#### Header token migration (SHELL-01)
- Date label (`text-[11px]` mono): migrate to `text-label` (10px) — stay within the editorial mono label pattern
- Folio wordmark text (`text-[32px] sm:text-[38px]`): use `text-display` (2.25rem / 36px) for both breakpoints — removes responsive arbitrary size, accepts the 2px delta from 38px. The FolioMark SVG logo stays as-is.
- Nav trigger labels (`text-[11px]`): migrate to `text-label` (10px)
- Header background: migrate `bg-stone-50 dark:bg-stone-950` to `bg-paper dark:bg-paper` — the paper token is warm white (hsl(40 20% 98%)) in light mode and warm dark (hsl(20 10% 6%)) in dark mode, visually near-identical to stone-50/950
- Preserve non-negotiables: thick top rule (3px bg-stone-900/stone-100), sticky positioning, the 3-column grid layout, border-b separator — do not touch these
- Nav dropdown panel: migrate `bg-stone-50 dark:bg-stone-950` to `bg-paper dark:bg-paper` for consistency

#### Mobile header date
- Keep `hidden sm:block` on the date label — mobile shows logo + auth only

#### What NOT to touch
- NavDropdowns logic (hover/click, groups, items) — Phase 3+ handles hover states
- The `hover:opacity-75` on the logo link — Phase 3 removes `hover:opacity-*` patterns
- Any page-level components or content cards
- `ThemeToggle`, `AuthButtons`, `FolioMark` component internals

### Claude's Discretion
- Date label: `text-label` (10px) is the right choice — matches the `.section-label` pattern already in `globals.css`
- Nav trigger labels: `text-label` (10px) — same reasoning, keeps mono label pattern consistent

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SHELL-01 | Header updated to use design tokens (typography, spacing) — preserve existing thick top rule and mono label pattern | Phase 1 tokens confirmed: `text-display`, `text-label`, `bg-paper` all exist in `tailwind.config.ts`. Exact class substitutions identified for each arbitrary value in `Header.tsx` and `NavDropdowns.tsx`. |
| SHELL-02 | Site footer implemented with links (feedback, terms/privacy, contact/LinkedIn) and consistent with design tokens | `SiteFooter.tsx` already has Terms/Privacy/Contact with correct token styling. Two new links (Feedback + LinkedIn) follow the identical class pattern. Sticky-footer fix (`flex flex-col` + `flex-1`) identified in `app/layout.tsx`. |
</phase_requirements>

---

## Standard Stack

### Core (all already installed — no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 3.4.19 | Utility classes + token system | Project-standard; Phase 1 tokens live in `tailwind.config.ts` |
| Next.js | ^15.5.12 | App Router layout (`app/layout.tsx`) | Project framework |
| React | ^19.0.0 | Component rendering | Project framework |

**Note:** The `tailwind-design-system` skill in `.claude/skills/` targets Tailwind v4 patterns (CSS `@theme` blocks). This project uses **Tailwind v3.4.19** with `tailwind.config.ts`. Ignore v4 patterns from that skill — all token work is done in `tailwind.config.ts` and `globals.css` as established in Phase 1.

### Token availability (confirmed from source)

| Token | Tailwind class | Value | Source |
|-------|---------------|-------|--------|
| display | `text-display` | 2.25rem / 36px, lh 1.2, fw 700 | `tailwind.config.ts` line 36 |
| label | `text-label` | 0.625rem / 10px, lh 1, ls 0.1em, fw 500 | `tailwind.config.ts` line 41 |
| paper | `bg-paper` | hsl(40 20% 98%) light / hsl(20 10% 6%) dark | `globals.css` lines 35, 81 |
| section-label | `.section-label` | `font-mono text-label tracking-widest uppercase text-stone-400` | `globals.css` lines 98-100 |

---

## Architecture Patterns

### Current layout structure (from `app/layout.tsx`)

```
<body className="bg-stone-50 dark:bg-stone-950 ... min-h-screen">
  <Providers>
    {children}          ← no flex-1, so footer floats
    <SiteFooter />      ← mt-auto has no effect without flex parent
  </Providers>
  <ScrollToTop />
</body>
```

### Required layout structure after Phase 2

```
<body className="bg-stone-50 dark:bg-stone-950 ... min-h-screen flex flex-col">
  <Providers className="flex-1 flex flex-col">  ← OR wrap children
    {children}
    <SiteFooter />      ← mt-auto now works
  </Providers>
  <ScrollToTop />
</body>
```

**Important detail:** `Providers` is a client component wrapper (`app/providers.tsx`). The cleanest approach — confirmed by the CONTEXT.md decision — is to add `flex flex-col` to `<body>` and wrap `{children}` in a `<main className="flex-1">` element inside layout.tsx. This keeps Providers unchanged and avoids passing className through a client boundary.

### Pattern: Inline token class substitution

All token migrations in this phase are class string substitutions — no component API changes, no new imports, no logic changes.

**Header.tsx substitutions:**

```tsx
// BEFORE (line 29)
<header className="sticky top-0 z-40 bg-stone-50 dark:bg-stone-950 border-b ...">

// AFTER
<header className="sticky top-0 z-40 bg-paper dark:bg-paper border-b ...">
```

```tsx
// BEFORE (line 37) — date label
<span className="hidden sm:block font-mono text-[11px] text-stone-400 ...">

// AFTER — use text-label (10px), keep tracking-wide
<span className="hidden sm:block font-mono text-label text-stone-400 ...">
```

```tsx
// BEFORE (line 42) — Folio wordmark
<h1 className="font-serif text-[32px] sm:text-[38px] font-bold tracking-tight ...">

// AFTER — text-display is 2.25rem/36px with font-weight 700 baked in
// Remove both arbitrary sizes and font-bold (bold is built into the token)
<h1 className="font-serif text-display tracking-tight ...">
```

**NavDropdowns.tsx substitutions:**

```tsx
// BEFORE — TRIGGER_CLS constant (line 50-51)
'flex items-center gap-1 px-5 py-2 text-[11px] font-sans font-semibold tracking-[0.1em] uppercase ...'

// AFTER — text-label replaces text-[11px]
'flex items-center gap-1 px-5 py-2 text-label font-sans font-semibold tracking-[0.1em] uppercase ...'
```

```tsx
// BEFORE — dropdown panel background (line 89)
"... bg-stone-50 dark:bg-stone-950 ..."

// AFTER
"... bg-paper dark:bg-paper ..."
```

**SiteFooter.tsx additions (new links):**

```tsx
// BEFORE nav (lines 14-33) — 3 links: Terms, Privacy, Contact
// AFTER — 5 links in order: Feedback, Terms, Privacy, Contact, LinkedIn

<nav className="flex items-center gap-6">
  <a
    href="mailto:hello@folioapp.co.uk"
    className="font-mono text-[10px] text-stone-400 dark:text-stone-600 hover:text-stone-700 dark:hover:text-stone-300 transition-colors tracking-wide"
  >
    Feedback
  </a>
  {/* existing Terms link */}
  {/* existing Privacy link */}
  {/* existing Contact link */}
  <a
    href="https://www.linkedin.com/in/gregory-vitrenko-7258a0350"
    target="_blank"
    rel="noopener noreferrer"
    className="font-mono text-[10px] text-stone-400 dark:text-stone-600 hover:text-stone-700 dark:hover:text-stone-300 transition-colors tracking-wide"
  >
    LinkedIn
  </a>
</nav>
```

**Note on footer typography:** The footer currently uses `font-mono text-[10px]` directly. This is functionally identical to `text-label` (0.625rem = 10px). Migrating footer link classes to `text-label` would be consistent with SHELL-01 token adoption and reduce arbitrary values. Claude's discretion — if the planner includes it, keep the same hover/color classes, just swap `text-[10px]` → `text-label`.

### Anti-Patterns to Avoid

- **Touching NavDropdowns logic:** Only the `TRIGGER_CLS` constant string and dropdown panel background need changing. Do not touch `useState`, `useEffect`, `onMouseEnter/Leave`, or click handlers.
- **Removing font-bold from wordmark separately:** `text-display` has `fontWeight: '700'` baked in via the config array format. Keeping an explicit `font-bold` alongside is harmless but redundant — removing it is clean.
- **Using `bg-paper` without dark variant:** The `paper` color token is a single CSS variable that switches via the `.dark` class in `globals.css`. Unlike `bg-stone-50`, you do NOT need `dark:bg-paper` — `bg-paper` already responds to dark mode. Write it as just `bg-paper`.
- **Wrapping Providers with className:** `Providers` is a client component that likely does not accept className. Wrap `{children}` in `<main className="flex-1">` inside layout.tsx instead.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sticky footer | Custom JS scroll detection | `flex flex-col min-h-screen` + `flex-1` | Pure CSS, zero JS, works at all viewport heights including 375px |
| Dark mode surface token | `bg-stone-50 dark:bg-stone-950` repeated | `bg-paper` (single class) | Token handles both modes via CSS custom property |
| 10px mono label | `text-[10px]` arbitrary | `text-label` | Named token, single source of truth, no magic numbers |

---

## Common Pitfalls

### Pitfall 1: `dark:bg-paper` is unnecessary and will produce incorrect results

**What goes wrong:** Writing `bg-paper dark:bg-paper` as a reflex pattern (copying the stone-50/stone-950 paired pattern).

**Why it happens:** The old pattern required explicit dark variant because stone-50 and stone-950 are two different color values. The `paper` token uses a single CSS variable (`--paper`) that changes its value under `.dark` via `globals.css`. Writing `dark:bg-paper` just repeats the same class with the same variable, which is harmless but unnecessary.

**How to avoid:** Use `bg-paper` alone. The CSS variable does the switching.

**Warning signs:** If you see `bg-paper dark:bg-paper` in a diff, the dark: prefix is redundant but not broken.

---

### Pitfall 2: `text-display` token includes font-weight — double declaration

**What goes wrong:** Keeping `font-bold` on the `<h1>` wordmark after migrating to `text-display`.

**Why it happens:** The original markup has `font-bold` as an explicit class. `text-display` is defined as `['2.25rem', { lineHeight: '1.2', fontWeight: '700' }]` — Tailwind outputs `font-weight: 700` directly in the `text-display` utility class.

**How to avoid:** Remove `font-bold` when migrating to `text-display`. The class is redundant; its presence doesn't break anything but leaves dead weight.

**Warning signs:** `font-bold text-display` in the same element's className.

---

### Pitfall 3: `flex-1` on Providers rather than children

**What goes wrong:** Passing `className="flex-1"` to the `<Providers>` component, which is a client component wrapper around `ThemeProvider` from `next-themes`. The component may not forward className to its root DOM element.

**Why it happens:** Providers looks like a container in the JSX tree so instinct is to flex it.

**How to avoid:** Wrap `{children}` in `<main className="flex-1">` directly in `app/layout.tsx`. This is pure HTML in a server component — no prop-forwarding required.

**Warning signs:** Footer not sticking to bottom on short pages despite `flex flex-col` being on body.

---

### Pitfall 4: `text-label` letterSpacing vs existing `tracking-wide`

**What goes wrong:** The `text-label` token sets `letterSpacing: '0.1em'` via the Tailwind config array format. If `tracking-wide` or `tracking-[0.15em]` is also present on the element, Tailwind's class cascade applies the last-declared winner — which depends on generated CSS order, not DOM order.

**Why it happens:** Some labels in the header use `tracking-wide` (0.025em) or `tracking-[0.15em]` alongside the old `text-[11px]`.

**How to avoid:** When migrating to `text-label`, audit the tracking classes on that element:
- If tracking matches or is intentionally different, keep the explicit `tracking-*` class (it will override the token's default).
- The `text-label` token letter-spacing (0.1em) is the target — remove `tracking-wide` if you want the token's value.
- For the "Archive Edition" mono label on line 56 of Header.tsx which uses `tracking-[0.15em]`, leave `tracking-[0.15em]` in place — it is an intentional editorial choice for that specific label.

---

## Code Examples

### Verified: `text-display` token definition
```typescript
// Source: tailwind.config.ts line 36
display: ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],  // 36px — page-level hero
```

### Verified: `text-label` token definition
```typescript
// Source: tailwind.config.ts line 41
label: ['0.625rem', { lineHeight: '1', letterSpacing: '0.1em', fontWeight: '500' }], // 10px — mono labels
```

### Verified: `bg-paper` token — single class, dark-mode-aware
```css
/* Source: globals.css lines 35 and 81 */
:root {
  --paper: hsl(40 20% 98%);   /* warm off-white — light mode */
}
.dark {
  --paper: hsl(20 10% 6%);    /* warm dark — dark mode */
}
```
```typescript
// Source: tailwind.config.ts line 109
paper: 'hsl(var(--paper))',  // warm page background, responds to dark mode
```

### Verified: `.section-label` utility class
```css
/* Source: globals.css lines 98-100 */
.section-label {
  @apply font-mono text-label tracking-widest uppercase text-stone-400 dark:text-stone-500;
}
```

### Verified: sticky-footer CSS pattern
```tsx
// Source: app/layout.tsx — current state (body line 58, Providers lines 59-62)
<body className="bg-stone-50 dark:bg-stone-950 ... min-h-screen ...">
  <Providers>
    {children}
    <SiteFooter />   // mt-auto on footer, no flex parent → doesn't pin
  </Providers>
  <ScrollToTop />
</body>

// Required state after Phase 2:
<body className="bg-stone-50 dark:bg-stone-950 ... min-h-screen flex flex-col">
  <Providers>
    <main className="flex-1">
      {children}
    </main>
    <SiteFooter />   // mt-auto now has a flex parent → pins to bottom
  </Providers>
  <ScrollToTop />
</body>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `text-[32px] sm:text-[38px]` | `text-display` | Phase 2 | Removes two arbitrary breakpoint values; accepts 2px delta at sm |
| `text-[11px]` for labels | `text-label` | Phase 2 | Named token; consistent 10px label system |
| `bg-stone-50 dark:bg-stone-950` | `bg-paper` | Phase 2 | Single dark-mode-aware token; removes paired classes |
| Footer: no Feedback or LinkedIn links | Footer: 5 links in order | Phase 2 | Completes priority backlog item |
| Body: no flex layout | Body: `flex flex-col`, children: `flex-1` | Phase 2 | Sticky footer works on short pages |

---

## Open Questions

1. **Should the `<main>` wrapper be added or should Providers get flex-1?**
   - What we know: Providers is a client component (`app/providers.tsx`) that wraps `next-themes` ThemeProvider. It likely renders a single child div or passes children through.
   - What's unclear: Whether Providers forwards className to its root element.
   - Recommendation: Use `<main className="flex-1">` in layout.tsx. Safe, explicit, no dependency on Providers internals. If `main` causes layout issues with the existing `<Header>` (which is rendered inside each page's own layout), verify that the main element doesn't add conflicting block context.

2. **Should footer `text-[10px]` classes also migrate to `text-label`?**
   - What we know: SHELL-01 scopes token migration to the Header. The footer uses `text-[10px]` directly, which equals the `text-label` token value.
   - What's unclear: Not explicitly required by SHELL-02 spec.
   - Recommendation: Include the migration in SiteFooter.tsx — it eliminates the last `text-[10px]` arbitrary values in the shell and is a 2-second change. Document it as a bonus consistency improvement.

---

## Validation Architecture

> `workflow.nyquist_validation` is `true` in `.planning/config.json` — this section is required.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None installed — no Jest, Vitest, or Playwright found |
| Config file | None — see Wave 0 |
| Quick run command | `npx tsc --noEmit` (TypeScript compile check) |
| Full suite command | `npm run build` (Next.js full production build) |

**Note:** This project has no automated test framework. The shell components are pure presentational React — no state logic, no async operations, no API calls. Validation relies on TypeScript compile + build verification plus manual visual checks.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SHELL-01 | Header renders with token classes (no TypeScript errors, no broken imports) | compile | `npx tsc --noEmit` | ✅ (tsconfig.json) |
| SHELL-01 | No arbitrary `text-[Npx]` values remain in Header.tsx / NavDropdowns.tsx | lint/search | `grep -r 'text-\[' components/Header.tsx components/NavDropdowns.tsx` | ✅ |
| SHELL-01 | `bg-paper` token resolves in build output | build | `npm run build` | ✅ |
| SHELL-02 | Footer renders 5 links with correct hrefs | manual-only | Visual check at 375px and 1280px | ❌ Wave 0 (no test file) |
| SHELL-02 | Footer does not overlap page content on short pages | manual-only | Resize browser to short viewport; confirm footer at bottom | ❌ manual |
| SHELL-02 | LinkedIn opens in new tab | manual-only | Click LinkedIn link, confirm new tab | ❌ manual |

### Sampling Rate

- **Per task commit:** `npx tsc --noEmit` — confirms no TypeScript regressions
- **Per wave merge:** `npm run build` — confirms Tailwind purge includes token classes and build succeeds
- **Phase gate:** `npm run build` green + manual visual check at 375px before `/gsd:verify-work`

### Wave 0 Gaps

- No automated test framework is needed for this phase — all behaviors are visual/structural and verified by TypeScript + build.
- The manual checks (footer pinning at 375px, LinkedIn new-tab) are fast enough to perform directly without automation scaffolding.

*(No Wave 0 test file creation required — existing TypeScript + Next.js build infrastructure covers the automatable requirements.)*

---

## Sources

### Primary (HIGH confidence)

- `/Users/gregoryvitrenko/Documents/Folio/tailwind.config.ts` — confirmed all token names and values (display, label, paper)
- `/Users/gregoryvitrenko/Documents/Folio/app/globals.css` — confirmed `--paper` CSS variable values for light/dark, `.section-label` utility
- `/Users/gregoryvitrenko/Documents/Folio/components/Header.tsx` — confirmed current arbitrary classes and structure
- `/Users/gregoryvitrenko/Documents/Folio/components/SiteFooter.tsx` — confirmed existing links and class patterns
- `/Users/gregoryvitrenko/Documents/Folio/components/NavDropdowns.tsx` — confirmed TRIGGER_CLS and dropdown panel background
- `/Users/gregoryvitrenko/Documents/Folio/app/layout.tsx` — confirmed body classes and Providers/children structure
- `/Users/gregoryvitrenko/Documents/Folio/.planning/phases/02-shell/02-CONTEXT.md` — locked decisions source

### Secondary (MEDIUM confidence)

- Tailwind CSS v3 font-size array format `[size, { lineHeight, fontWeight, letterSpacing }]` — confirmed by reading actual config output (node package version 3.4.19)

### Tertiary (LOW confidence)

- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all tokens read directly from source files
- Architecture: HIGH — current component structure fully inspected, substitutions are one-to-one class swaps
- Pitfalls: HIGH — derived from direct inspection of token definitions and component code

**Research date:** 2026-03-09
**Valid until:** 2026-04-09 (stable — no external dependencies, all tokens in-codebase)
