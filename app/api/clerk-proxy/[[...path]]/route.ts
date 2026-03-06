import { NextRequest } from 'next/server';

// Proxy all Clerk Frontend API requests through our domain to avoid
// Cloudflare cross-account conflict (both folioapp.co.uk and Clerk use Cloudflare).
// /__clerk/* is rewritten to /api/clerk-proxy/* by next.config.ts,
// then this route forwards to frontend-api.clerk.services.

const CLERK_API = 'https://frontend-api.clerk.services';

async function handler(request: NextRequest) {
  const url = new URL(request.url);
  const clerkPath = url.pathname.replace(/^\/api\/clerk-proxy/, '') || '/';
  const target = `${CLERK_API}${clerkPath}${url.search}`;

  const headers = new Headers(request.headers);
  headers.set('Clerk-Proxy-Url', `${url.origin}/__clerk`);
  headers.set('X-Forwarded-Host', url.host);
  headers.delete('host');

  const res = await fetch(target, {
    method: request.method,
    headers,
    body: request.method !== 'GET' && request.method !== 'HEAD'
      ? request.body
      : undefined,
    // @ts-expect-error -- duplex is required for streaming request bodies
    duplex: 'half',
    redirect: 'manual',
  });

  const responseHeaders = new Headers(res.headers);
  responseHeaders.delete('transfer-encoding');

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: responseHeaders,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
