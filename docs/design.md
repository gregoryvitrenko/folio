# Folio Design Spec

Stack: Next.js 15 App Router, React 19, Tailwind CSS 3 (stone/zinc palette), shadcn/ui. Every component and page must strictly follow this spec. When code conflicts, treat the spec as authoritative and propose refactors. Do not invent new colors, radii, fonts, sizes, or spacing. Reference this file in all frontend tasks.

---

## Fonts

Three fonts only. Never use system-ui or fallbacks directly.

| Role | Family | Tailwind class |
|------|--------|----------------|
| Headings, brand, article titles | Playfair Display | `font-serif` |
| Body copy, nav, UI | Inter | `font-sans` |
| Labels, metadata, dates | JetBrains Mono | `font-mono` |

**Ban:** Arbitrary font classes. Always use these three.

---

## Type Scale

Use semantic tokens. Ban raw pixels like `text-[13px]`, `text-[10px]` — replace all violations with this scale.

| Token | Size | Weight | Use |
|-------|------|--------|-----|
| `text-display` | 36px | bold | Hero headline only |
| `text-heading` | 24px | semibold | H1/H2 section headings |
| `text-subheading` | 18px | medium | H3, card titles |
| `text-article` | 28px | bold | Article page headline |
| `text-body` | 15px | normal | Paragraphs |
| `text-caption` | 13px | normal | Secondary text, excerpts |
| `text-label` | 10px | semibold | Labels, badges — always with `font-mono` or `font-sans font-semibold uppercase tracking-widest` |

**Ban:** Arbitrary sizes. Always use tokens.

---

## Colors

Stone/zinc base. Use named roles. Topic accents only for dots/labels — never in layouts.

| Role | Light | Dark | Use |
|------|-------|------|-----|
| Page bg | `bg-stone-50` | `dark:bg-stone-950` | Full page |
| Surface/card | `bg-white` | `dark:bg-stone-900` | Cards, sections |
| Header/paper | `bg-paper` | `dark:bg-paper` | Nav, headers |
| Border | `border-stone-200` | `dark:border-stone-800` | Edges |
| Divider | `divide-stone-100` | `dark:divide-stone-800` | Lists |
| Text primary | `text-stone-900` | `dark:text-stone-100` | Main copy |
| Text secondary | `text-stone-500` | `dark:text-stone-400` | Subtext |
| Text muted | `text-stone-400` | `dark:text-stone-500` | Labels |
| Chip bg | `bg-stone-100` | `dark:bg-stone-800` | Tags |
| CTA primary | `bg-stone-900 hover:bg-stone-800` | `dark:bg-stone-100 dark:hover:bg-stone-200` | Main buttons |
| CTA text | `text-stone-50` | `dark:text-stone-900` | CTA text |

### Topic accent colors (dots/labels only — never layouts)

| Topic | Dot | Label |
|-------|-----|-------|
| M&A | `bg-blue-700 dark:bg-blue-400` | `text-blue-800 dark:text-blue-300` |
| Capital Markets | `bg-violet-700 dark:bg-violet-400` | `text-violet-800 dark:text-violet-300` |
| Banking & Finance | `bg-orange-700 dark:bg-orange-400` | `text-orange-800 dark:text-orange-300` |
| Energy & Tech | `bg-emerald-700 dark:bg-emerald-400` | `text-emerald-800 dark:text-emerald-300` |
| Regulation | `bg-amber-700 dark:bg-amber-400` | `text-amber-800 dark:text-amber-300` |
| Disputes | `bg-rose-700 dark:bg-rose-400` | `text-rose-800 dark:text-rose-300` |
| International | `bg-teal-700 dark:bg-teal-400` | `text-teal-800 dark:text-teal-300` |
| AI & Law | `bg-indigo-700 dark:bg-indigo-400` | `text-indigo-800 dark:text-indigo-300` |

**Ban:** New colors. Zinc in content areas (chrome/nav only). No emojis.

---

## Radius

Semantic tokens only. Never use `rounded-sm`, `rounded-xl`, `rounded-lg`, `rounded-md` directly on new components — always use the named tokens.

| Token | Value | Use |
|-------|-------|-----|
| `rounded-card` | 2px | Cards, sections, panels — nearly flat, editorial |
| `rounded-chrome` | 4px | Buttons, inputs, chips |
| `rounded-pill` | 9999px | Tags, badges with pill shape |

**Ban:** `rounded-xl`. Migrate all existing violations to tokens.

---

## Layout

- Every page wrapper: `max-w-5xl mx-auto px-4 sm:px-6 lg:px-8`
- Standard page padding: `py-8 lg:py-12`
- Major section gap: `mb-8 lg:mb-12`
- Card internal padding: `p-6`
- Grid gap: `gap-4 lg:gap-6`

### Thick top rule (mandatory on all top-level page headers)

```tsx
<div className="h-[3px] bg-stone-900 dark:bg-stone-100" />
```

---

## Components

Use these exact structures. Extend via props only — do not invent variants.

### Section label

```tsx
<span className="section-label">Category</span>
```
Defined in `globals.css`: `font-mono text-label tracking-widest uppercase text-stone-400 dark:text-stone-500`

### Page heading

```tsx
<div className="flex items-center gap-3 mb-6">
  <Icon size={16} className="text-stone-400" />
  <h2 className="text-subheading font-bold tracking-tight text-stone-900 dark:text-stone-50">Title</h2>
  <span className="section-label px-2 py-0.5 rounded-chrome bg-stone-100 dark:bg-stone-800">Count</span>
</div>
```

### Section divider

```tsx
<div className="flex items-center gap-4 mb-6">
  <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
  <span className="section-label flex-shrink-0">Label</span>
  <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
</div>
```

### Content card

```tsx
<div className="rounded-card bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 hover:bg-stone-50 dark:hover:bg-stone-800/40 hover:border-stone-300 transition-all duration-200">
```

### Chip / tag

```tsx
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-chrome bg-stone-100 dark:bg-stone-800 text-label border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400">
```

### Primary CTA button

```tsx
<button className="inline-flex items-center gap-2 px-6 py-3 rounded-chrome bg-stone-900 dark:bg-stone-100 text-caption font-medium text-stone-50 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 transition-all duration-200">
```

### Callout / info box

```tsx
<div className="flex items-start gap-3 rounded-card bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 p-4">
  <Icon size={14} className="mt-0.5 shrink-0 text-stone-400 dark:text-stone-500" />
  <p className="text-caption leading-relaxed text-stone-500 dark:text-stone-400">Content</p>
</div>
```

---

## Do / Don't

**Do:**
- Use semantic tokens everywhere (`text-caption`, `rounded-card`, `rounded-chrome`)
- Apply `.section-label` utility to all overline/category labels
- Use `max-w-5xl mx-auto px-4 sm:px-6 lg:px-8` on every page wrapper
- Add `transition-all duration-200` to all interactive cards and buttons
- Use `font-serif` for headings, `font-sans` for body/UI, `font-mono` for labels/metadata

**Don't:**
- Raw pixel font sizes (`text-[13px]` → `text-caption`; `text-[10px]` → `text-label`)
- `rounded-sm` or `rounded-xl` — migrate to `rounded-card` or `rounded-chrome`
- Arbitrary colors or spacing outside the tokens above
- Zinc in content areas (chrome/nav only)
- Shadows heavier than `shadow-md`
- Emojis anywhere in the UI

---

## Prompt template (for design tasks with visual references)

Use this when giving Claude a screenshot from Mobbin, 21st.dev, or Google Stitch:

```
Remake this [page/component] using the attached screenshot as a layout reference.

STRICTLY follow docs/design.md:
- Colors: only named roles (no new colors)
- Type: semantic tokens only (no text-[13px] etc.)
- Radius: rounded-card for cards, rounded-chrome for buttons/chips

Make it:
- Mobile-first, compact
- Stone/zinc palette, Playfair serif for headings
- Include the thick top rule and .section-label on all overlines

Avoid:
- rounded-xl or rounded-sm
- Arbitrary spacing or pixel values
- Emojis or gradients
- Zinc in content areas

Output: complete Next.js component using shadcn/ui primitives.
```
