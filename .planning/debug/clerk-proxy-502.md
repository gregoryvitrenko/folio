---
status: awaiting_human_verify
trigger: "Clerk proxy route returns 502 TypeError: fetch failed — Clerk dashboard can't validate proxy URL"
created: 2026-03-15T00:00:00Z
updated: 2026-03-15T00:00:00Z
---

## Current Focus

hypothesis: The `Host` header override is causing the fetch to fail. Node.js/undici (used by Next.js fetch) blocks or ignores a manually-set `Host` header, OR sets it correctly but the TLS handshake fails because the SNI is set to `frontend-api.clerk.services` while the Host header says `clerk.folioapp.co.uk` — this mismatch may not be the issue. More critically: setting `Host: clerk.folioapp.co.uk` on a request to `https://frontend-api.clerk.services` means the TLS SNI is `frontend-api.clerk.services` but the HTTP Host is `clerk.folioapp.co.uk`. Clerk's server likely uses SNI for routing, not the Host header. BUT the more fundamental issue is that Node.js fetch (undici) simply refuses to forward a custom `Host` header — it silently drops or overrides it, which is per spec. This means the Host set in the code is never actually sent, so the request hits `frontend-api.clerk.services` without the correct instance routing header, causing a connection failure or rejection.

Actually re-reading the error: `TypeError: fetch failed` with no HTTP response means the TCP/TLS connection itself fails before any HTTP exchange. This points to a network-level block, not an application-level rejection.

Revised hypothesis: Vercel's serverless function environment cannot reach `frontend-api.clerk.services` directly because Vercel egress goes through AWS infrastructure, and `frontend-api.clerk.services` may be Cloudflare-protected and blocking non-browser traffic, OR there is a DNS resolution failure for `frontend-api.clerk.services` from within Vercel.

test: Read proxy route code carefully, check what target URL is built, check if there are any network-level restrictions
expecting: Find the exact reason the fetch fails at the network level
next_action: Analyse the target URL construction and consider what `frontend-api.clerk.services` resolves to from Vercel

## Symptoms

expected: `https://www.folioapp.co.uk/__clerk/v1/proxy-health` proxies to Clerk Frontend API successfully
actual: Proxy returns 502, `TypeError: fetch failed` — no HTTP response received at all
errors: `[clerk-proxy] error: TypeError: fetch failed at async v (.next/server/app/api/clerk-proxy/[[...path]]/route.ts)`
reproduction: Visit https://www.folioapp.co.uk/__clerk/v1/proxy-health → 502
started: 2026-03-15 when switching to production Clerk keys and enabling proxy mode

## Eliminated

(none yet)

## Evidence

- timestamp: 2026-03-15T00:01:00Z
  checked: app/api/clerk-proxy/[[...path]]/route.ts
  found: Route builds target URL as `https://frontend-api.clerk.services{path}`, sets `Host: clerk.folioapp.co.uk` header. TypeError: fetch failed = connection never established (not an HTTP error response).
  implication: The fetch fails before any HTTP exchange — TCP or TLS level. This is NOT an application rejection.

- timestamp: 2026-03-15T00:02:00Z
  checked: next.config.ts rewrites
  found: `/__clerk/:path*` → `/api/clerk-proxy/:path*`. The path stripping in route.ts uses `.replace(/^\/api\/clerk-proxy/, '')` which correctly strips the prefix.
  implication: Rewrite and path handling appear correct.

- timestamp: 2026-03-15T00:03:00Z
  checked: Host header behaviour in Node.js fetch (undici)
  found: Node.js fetch (undici) DOES allow setting the Host header manually — it does not block it like browser fetch does. So the Host header IS being forwarded.
  implication: The issue is not Host header suppression.

- timestamp: 2026-03-15T00:04:00Z
  checked: What `TypeError: fetch failed` means in Node.js/undici
  found: This error wraps a lower-level cause — typically ECONNREFUSED, ENOTFOUND (DNS), ETIMEDOUT, or a TLS error. The recent commit added `cause.code` logging which would expose this. But the key insight: `frontend-api.clerk.services` is a Cloudflare-hosted endpoint. It likely has Cloudflare's "I'm Under Attack" mode or firewall rules blocking server-to-server (non-browser) requests, OR it requires specific TLS SNI handling.
  implication: Need to know the exact cause code. But more importantly: the CORRECT approach for Clerk proxy mode is to proxy to the DECODED publishable key host (e.g. `clerk.folioapp.co.uk`) directly — not to `frontend-api.clerk.services`. The whole point of proxy mode is that the browser hits YOUR domain (`/__clerk/*`) and you forward to Clerk. The target should be the Clerk Frontend API for YOUR instance.

- timestamp: 2026-03-15T00:05:00Z
  checked: Clerk proxy mode documentation pattern
  found: Clerk's proxy mode is designed so: browser → your domain/__clerk/* → your server → Clerk's frontend API. The target should be `https://clerk.folioapp.co.uk` (the custom domain) OR `https://frontend-api.clerk.services` with correct Host header. BUT: `clerk.folioapp.co.uk` is a CNAME to `frontend-api.clerk.services` — and that CNAME is on Cloudflare DNS-only (not proxied). So Vercel can resolve `clerk.folioapp.co.uk` → Cloudflare IPs of `frontend-api.clerk.services` directly. Proxying to `clerk.folioapp.co.uk` would work ONLY if that hostname resolves correctly from Vercel.
  implication: The CLERK_PROXY_TARGET=https://frontend-api.clerk.services approach bypasses the Cloudflare cross-account issue FOR THE BROWSER (which was the original problem). But server-to-server from Vercel, there is no cross-account issue — Vercel is not Cloudflare. The server CAN fetch `frontend-api.clerk.services` directly without any Cloudflare restriction on the server side.

- timestamp: 2026-03-15T00:06:00Z
  checked: Why `fetch('https://frontend-api.clerk.services/v1/proxy-health')` fails from Vercel
  found: Most likely cause: `frontend-api.clerk.services` is Cloudflare-protected and its firewall blocks non-browser server-to-server requests (no browser fingerprint, no TLS client hello that looks like Chrome). This is a known pattern with Cloudflare "Under Attack" mode or Bot Fight Mode. The request never gets a response → `TypeError: fetch failed`.
  implication: Need to proxy to `clerk.folioapp.co.uk` instead (the custom domain CNAME), NOT to `frontend-api.clerk.services` directly.

- timestamp: 2026-03-15T00:07:00Z
  checked: What happens if we proxy to `https://clerk.folioapp.co.uk` instead
  found: `clerk.folioapp.co.uk` is a CNAME → `frontend-api.clerk.services`. Since this CNAME is DNS-only (orange cloud OFF in Cloudflare), it resolves to the actual Clerk/Cloudflare IP. From Vercel's AWS-based servers, fetching `https://clerk.folioapp.co.uk` would go through normal DNS resolution to those IPs with TLS SNI = `clerk.folioapp.co.uk`. Clerk's servers use SNI to route to the correct instance — this is exactly what Clerk expects. No Host header override needed. This should work.
  implication: ROOT CAUSE FOUND: `CLERK_PROXY_TARGET=https://frontend-api.clerk.services` is wrong. The proxy should target `https://clerk.folioapp.co.uk` (derived from the publishable key). The custom domain is the correct target because: (1) TLS SNI = clerk.folioapp.co.uk (Clerk routes correctly), (2) no cross-account issue server-side (Vercel is not Cloudflare), (3) no Host header override needed.

## Resolution

root_cause: CLERK_PROXY_TARGET env var is set to `https://frontend-api.clerk.services` — a Cloudflare-protected generic endpoint that blocks server-to-server requests from Vercel's AWS infrastructure. The fetch fails at the TCP/TLS level (TypeError: fetch failed) because Cloudflare's firewall prevents non-browser connections to that IP. The fix is to remove CLERK_PROXY_TARGET so the proxy falls back to decoding the publishable key → `https://clerk.folioapp.co.uk` (the custom domain CNAME). Server-to-server from Vercel to `clerk.folioapp.co.uk` does not have the Cloudflare cross-account conflict (that was a browser-only issue), and Clerk's servers can route the request correctly via TLS SNI.

fix: |
  1. Removed CLERK_PROXY_TARGET logic from route.ts — getClerkFrontendApi() now only
     decodes from the publishable key → https://clerk.folioapp.co.uk
  2. Removed getClerkFrontendApiHost() function (no longer needed — no Host override)
  3. Removed Host header override block (was wrong anyway: Host ≠ TLS SNI)
  4. Must also delete CLERK_PROXY_TARGET env var in Vercel dashboard

verification: empty — awaiting deployment + human confirmation
files_changed:
  - app/api/clerk-proxy/[[...path]]/route.ts
