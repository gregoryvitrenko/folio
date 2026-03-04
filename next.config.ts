import type { NextConfig } from 'next';

const securityHeaders = [
  // Prevent browsers from MIME-sniffing the content type
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Block the page from being embedded in an iframe (clickjacking protection)
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Enable browser's built-in XSS filter (legacy browsers)
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Control referrer information sent with requests
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Enforce HTTPS for 1 year; include subdomains
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  // Restrict browser feature access
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
];

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
