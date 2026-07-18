import type { NextConfig } from "next";
import { dirname } from "path";
import { fileURLToPath } from "url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: projectRoot,
  // Production builds should not fail on lint/type-check — those run in local dev/CI.
  // (Avoids env-specific issues like a missing @types stub or eslint flat-config mismatch.)
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Canonical host: 301 www -> apex so search engines don't see duplicate content.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.trustqualitydesign.com' }],
        destination: 'https://trustqualitydesign.com/:path*',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'demoview.space',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.demoview.space',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
