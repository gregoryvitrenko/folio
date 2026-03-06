import { NextRequest } from 'next/server';

// Proxy all Clerk Frontend API requests through our domain to avoid
// Cloudflare Error 1000 (cross-account CNAME conflict).
// Clerk SDK calls https://www.folioapp.co.uk/__clerk/* which this route
// forwards to https://frontend-api.clerk.services/*.

const CLERK_API = 'https://frontend-api.clerk.services';

async function handler(request: NextRequest) {
  const url = new URL(request.url);
  // Strip the /__clerk prefix to get the Clerk API path
  const clerkPath = url.pathname.replace(/^\/__clerk/, '') || '/';
  const target = `${CLERK_API}${clerkPath}${url.search}`;

  const headers = new Headers(request.headers);
  // Tell Clerk which proxy URL we're using
  headers.set('Clerk-Proxy-Url', 'https://www.folioapp.co.uk/__clerk');
  // Forward the original host for Clerk's domain matching
  headers.set('X-Forwarded-Host', url.host);
  // Remove host header so fetch uses the target's host
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

  // Forward the response back to the client
  const responseHeaders = new Headers(res.headers);
  // Remove transfer-encoding to avoid conflicts with Next.js
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
