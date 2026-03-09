---
phase: 1
slug: design-tokens
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-09
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript compiler + Next.js build |
| **Config file** | `tsconfig.json` / `next.config.ts` |
| **Quick run command** | `npx tsc --noEmit` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~30 seconds (tsc) / ~60 seconds (build) |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | TOKENS-01 | build | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 1-01-02 | 01 | 1 | TOKENS-01 | build | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 1-01-03 | 01 | 1 | TOKENS-02 | build | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 1-01-04 | 01 | 1 | TOKENS-02 | build | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 1-01-05 | 01 | 1 | TOKENS-03 | build | `npx tsc --noEmit` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. Phase 1 edits only `tailwind.config.ts` and `app/globals.css` — TypeScript type-checks and the Next.js build are sufficient automated gates. No test stubs required.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| No visible change on any rendered page | TOKENS-01, TOKENS-02, TOKENS-03 | CSS tokens are additive; only visual inspection confirms zero regression | Load `/` in dev — layout must be identical to pre-phase state |
| `--radius` drop to 0.25rem rounds down shadcn calc | TOKENS-01 | `calc(var(--radius) - 4px) = 0px` is intentional (flat editorial) but must not break shadcn components | Check shadcn Button, Badge, Input in dev — borders should render, not collapse |
| `.section-label` class applies correct styles | TOKENS-03 | Class is declared in `@layer components` — visual confirmation needed | Find any section label in dev, confirm 10px mono uppercase stone-400 appearance |

---

## Validation Sign-Off

- [ ] All tasks have automated TypeScript compile check
- [ ] Sampling continuity: every task runs `npx tsc --noEmit`
- [ ] Wave 0: N/A — existing infrastructure sufficient
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
