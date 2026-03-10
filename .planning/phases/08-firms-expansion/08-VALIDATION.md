---
phase: 8
slug: firms-expansion
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-10
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript compiler (tsc) — no runtime test framework for lib/ data files |
| **Config file** | `tsconfig.json` |
| **Quick run command** | `npx tsc --noEmit` |
| **Full suite command** | `npx tsc --noEmit && npm run build` |
| **Estimated runtime** | ~15 seconds (tsc) / ~60 seconds (full build) |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit`
- **After every plan wave:** Run `npx tsc --noEmit && npm run build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 8-01-01 | 01 | 1 | FIRMS-01 | type check | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 8-01-02 | 01 | 1 | FIRMS-01 | type check | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 8-01-03 | 01 | 1 | FIRMS-01 | type check | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 8-01-04 | 01 | 1 | FIRMS-01 | type check | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 8-01-05 | 01 | 1 | FIRMS-01 | type check | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 8-01-06 | 01 | 1 | FIRMS-01 | type check | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 8-01-07 | 01 | 1 | FIRMS-01 | type check | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 8-01-08 | 01 | 1 | FIRMS-02 | type check | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 8-01-09 | 01 | 1 | FIRMS-02 | manual smoke | Check `/firms` page count badge ≥ 46 | N/A | ⬜ pending |
| 8-01-10 | 01 | 1 | FIRMS-02 | manual smoke | Visit each new `/firms/[slug]` — no 404, no layout break | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No new test files needed — TypeScript enforces `FirmProfile` interface at compile time.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| FIRMS.length ≥ 46 on /firms page | FIRMS-01 | Count is runtime data, not statically checkable | Visit `/firms` — check page heading badge shows 46+ |
| Each new slug renders without 404 | FIRMS-02 | Routing depends on Next.js dynamic segment | Visit `/firms/baker-mckenzie`, `/firms/jones-day`, `/firms/mayer-brown`, `/firms/dla-piper`, `/firms/eversheds-sutherland`, `/firms/cms`, `/firms/addleshaw-goddard`, `/firms/pinsent-masons` — confirm page loads with correct firm name |
| Salary/deadline data verified | FIRMS-02 | Data accuracy is editorial, not automatable | Cross-check NQ salary, TC salary, intake, deadline against The Trackr or firm recruitment pages before committing |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
