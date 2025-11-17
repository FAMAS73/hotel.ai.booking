import type { NextConfig } from "next";

/**
 * Next.js Configuration for Hotel AI Booking Chatbot Frontend
 *
 * Key configurations:
 * - Standalone output mode for Docker deployment (~100MB optimized build)
 * - Image optimization for hotel/room images
 * - Strict TypeScript mode
 * - API rewrites for backend integration
 *
 * @see https://nextjs.org/docs/app/api-reference/config/next-config-js
 */
const nextConfig: NextConfig = {
  // Enable standalone output mode for Docker deployment
  // This creates a minimal self-contained build in .next/standalone/
  output: 'standalone',

  // Image optimization configuration
  images: {
    // Allow images from backend API and public folder using secure remotePatterns
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/api/images/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
    // Optimize for hotel/room images (JPEG, PNG, WebP)
    formats: ['image/webp', 'image/avif'],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Image sizes for different breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // TypeScript configuration
  typescript: {
    // Strict type checking (fails build on type errors)
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
