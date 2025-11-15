/**
 * Footer Component
 *
 * Site footer with links, copyright, and information.
 *
 * @module components/layout/Footer
 */

'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Footer component provides site footer.
 *
 * Features:
 * - Quick links to important pages
 * - Copyright information
 * - Contact information
 * - Social links (placeholders for thesis demo)
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Rooms', href: '/rooms' },
      { label: 'Chat with AI', href: '/chat' },
      { label: 'Bookings', href: '/bookings' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  };

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)] theme-transition mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-[var(--accent)] rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold text-[var(--text-primary)]">Hotel AI</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] max-w-md">
              Experience luxury accommodation in Bangkok with our AI-powered booking assistant.
              Book your perfect room, get concierge recommendations, and enjoy seamless service.
            </p>
            <div className="mt-4">
              <p className="text-sm text-[var(--text-secondary)]">
                📍 Bangkok, Thailand
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                ✉️ info@hotelai.example.com
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                📞 +66 2 123 4567
              </p>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[var(--text-muted)]">
              © {currentYear} Hotel AI Booking Chatbot. Created for Computer Science Thesis
              Demonstration.
            </p>
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <span>Powered by</span>
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                Next.js
              </a>
              <span>•</span>
              <a
                href="https://www.nvidia.com/en-us/ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                NVIDIA AI
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
