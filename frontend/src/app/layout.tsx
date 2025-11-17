/**
 * Root Layout for Hotel AI Booking Chatbot Frontend
 *
 * Provides:
 * - HTML structure and metadata
 * - Global styles and theme variables
 * - Theme initialization script (prevents flash of unstyled content)
 * - Accessibility attributes
 *
 * This layout wraps all pages in the application.
 *
 * @module app/layout
 */

import type { Metadata, Viewport } from 'next';
import './globals.css';

/**
 * Metadata for SEO and social sharing.
 * Updated per FR-193 for professional thesis presentation.
 */
export const metadata: Metadata = {
  title: 'Hotel AI Booking Chatbot - Thailand Luxury Hotel',
  description:
    'Experience seamless hotel booking with our AI-powered chatbot. Book rooms, get concierge recommendations, and manage your stay at our Bangkok luxury hotel.',
  keywords: [
    'hotel booking',
    'AI chatbot',
    'Bangkok hotel',
    'luxury accommodation',
    'AI assistant',
    'hotel reservations',
  ],
  authors: [{ name: 'Hotel AI Chatbot Team' }],
  openGraph: {
    title: 'Hotel AI Booking Chatbot',
    description: 'Book your stay with our intelligent AI assistant',
    type: 'website',
    locale: 'en_US',
  },
};

/**
 * Viewport configuration for responsive design.
 * Separated from metadata per Next.js 15+ requirements.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

/**
 * Theme initialization script.
 * Runs before React hydration to prevent flash of unstyled content (FOUC).
 * Reads theme from localStorage and applies data-theme attribute immediately.
 */
const themeScript = `
  (function() {
    try {
      const stored = localStorage.getItem('hotel-theme-preference');
      if (stored) {
        const { theme } = JSON.parse(stored);
        if (theme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
          document.documentElement.classList.add('dark');
        } else if (theme === 'light') {
          document.documentElement.setAttribute('data-theme', 'light');
          document.documentElement.classList.remove('dark');
        } else if (theme === 'system') {
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
          if (isDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      } else {
        // Default to system theme
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        if (isDark) {
          document.documentElement.classList.add('dark');
        }
      }
    } catch (e) {
      // Fallback to light theme on error
      document.documentElement.setAttribute('data-theme', 'light');
    }
  })();
`;

/**
 * RootLayout component wraps all pages.
 *
 * Features:
 * - Theme initialization before React hydration (prevents FOUC)
 * - Accessibility attributes (lang, dir)
 * - Skip-to-content link for screen readers
 * - Suppresses hydration warnings for theme (expected behavior)
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Theme initialization script (runs before hydration) */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased theme-transition">
        {/* Skip to content link for screen readers (WCAG 2.1 AA) */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        {/* Main content wrapper */}
        <div id="root-layout">
          {children}
        </div>
      </body>
    </html>
  );
}
