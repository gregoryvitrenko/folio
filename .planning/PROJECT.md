# Folio

## What This Is

Folio is a daily briefing tool for UK law students targeting Magic Circle and US firm training contracts. It delivers AI-generated news briefings, quizzes, firm interview packs, aptitude tests, and an audio podcast — all focused on commercial awareness. Subscription product at £4/month, built and marketed by the owner (LLB student).

## Core Value

Students who use Folio daily walk into TC interviews knowing what's happening in the market and how to talk about it — giving them a credible edge over unprepared candidates.

## Requirements

### Validated

- ✓ Daily briefing (8 stories, 8 topics) — v1
- ✓ Topic filter tabs — v1
- ✓ Full article view with analysis and talking points (premium) — v1
- ✓ Dark/light mode toggle — v1
- ✓ Archive (past briefings, premium) — v1
- ✓ Daily quiz (24 questions, cached, premium) — v1
- ✓ Quiz streak (daily 🔥) + deep practice (⚡) — v1
- ✓ Bookmarks + notes (server-side Redis, premium) — v1
- ✓ Podcast player (ElevenLabs Daniel voice, premium) — v1
- ✓ Firm profiles (38 firms) + interview packs (premium) — v1
- ✓ Sector primers (8 topics, premium) — v1
- ✓ Aptitude tests: Watson Glaser + SJT (premium) — v1
- ✓ Onboarding flow — v1
- ✓ User auth (Clerk) — v1
- ✓ Stripe subscription (£4/mo) + paywall — v1
- ✓ Welcome email (Resend) — v1
- ✓ Contextual upgrade nudges — v1
- ✓ Cron auto-generation (06:00 UTC daily) — v1

### Active

- [ ] Design lift — improve typography, spacing, and visual polish across all pages (keep newspaper/editorial direction, execute it properly)
- [ ] Logo/wordmark — proper brand mark, not just text
- [ ] Social proof — trust signals: student count, testimonials, or credibility cues
- [ ] Conversion feature — TBD once user base exists to identify the actual gap
- [ ] Site footer — links, legal, contact (backlog carry-over)
- [ ] Primers: sample interview Qs + answer skeletons (backlog carry-over)

### Out of Scope

- Multi-voice audio — multiplies ElevenLabs spend against 100k/month cap
- Native mobile app — web-first, no revenue to justify native yet
- Real-time features (live feed, push notifications) — complexity vs. value unclear
- Custom Clerk production instance — requires domain transfer off Cloudflare; dev keys work fine
- Vercel Blob audio caching — not yet set up; audio regenerates on each request (known issue)

## Context

- **Live product**: folioapp.co.uk, Vercel Pro. Auth (Clerk), payments (Stripe), Redis (Upstash), TTS (ElevenLabs) all active.
- **Launch promotion**: Free full access for first 15 days from launch date hardcoded in config. After that, free tier (headlines + excerpt only).
- **Infrastructure budget**: ~£34/month. Owner budget cap £50/month.
- **ElevenLabs**: 100k chars/month (Creator tier). Daniel voice only. Audio not yet cached (Vercel Blob not set up).
- **Cron generation**: max_tokens fix pushed (session 4) but not yet manually verified via Vercel "Run".
- **Hardcoded fallback**: app/api/generate/route.ts:16 has old ADMIN_USER_ID as fallback — needs cleanup.
- **Design direction confirmed**: newspaper/editorial feel (stone/zinc palette, serif headings). The direction is right, the execution needs lifting to feel premium.
- **Marketing channel**: LinkedIn, university law societies, peer networks.
- **No user data yet**: Not enough users to diagnose conversion gap — design lift is prerequisite for serious marketing.

## Constraints

- **Budget**: £50/month max infra. Services at free tier limits. No paid design tools.
- **ElevenLabs**: 100k chars/month hard cap. Audio generation must stay within budget.
- **Tech stack**: Next.js 15, React 19, TypeScript, Tailwind CSS. No stack changes.
- **Auth**: Clerk dev keys (proven-yak-30.clerk.accounts.dev). Production keys require domain transfer off Cloudflare.
- **Solo operator**: Owner handles dev, marketing, support. Solutions must be maintainable by one person.
- **No emojis in UI**: Design language is minimal, newspaper feel. No decorative emoji.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Newspaper/editorial direction for design | Matches the content (legal news briefings) and target audience (serious law students) | — Pending |
| Daniel voice only (ElevenLabs) | Multi-voice multiplies monthly spend against 100k cap | ✓ Good |
| Clerk dev keys (not production) | Cloudflare CNAME conflict blocks production instance; dev keys work without proxy | ✓ Good |
| Stone/zinc Tailwind palette | Content areas (stone) vs. UI chrome (zinc) — consistent with editorial feel | — Pending |
| Design lift before heavy marketing | Site must feel premium before driving paid signups | — Pending |
| Conversion feature deferred | No user data yet to identify actual friction point | — Pending |

---
*Last updated: 2026-03-09 after initialization*
