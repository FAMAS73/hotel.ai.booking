/**
 * Header Component
 *
 * Main navigation header with logo, nav links, theme toggle, and auth state.
 *
 * @module components/layout/Header
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';

/**
 * Header component provides main navigation.
 *
 * Features:
 * - Responsive navigation menu
 * - Active link highlighting
 * - Theme toggle
 * - Authentication state display
 * - Mobile menu (hamburger)
 */
export function Header() {
  const pathname = usePathname();
  const { guest, isAuthenticated, logout, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/rooms', label: 'Rooms' },
    { href: '/chat', label: 'Chat with AI' },
    ...(isAuthenticated ? [{ href: '/bookings', label: 'My Bookings' }] : []),
    ...(isAdmin() ? [{ href: '/admin', label: 'Dashboard' }] : []),
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-primary)] border-b border-[var(--border)] theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 bg-[var(--accent)] rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-bold text-[var(--text-primary)]">Hotel AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  text-sm font-medium transition-colors
                  ${
                    isActive(link.href)
                      ? 'text-[var(--accent)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Auth buttons */}
            {isAuthenticated && guest ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-[var(--text-secondary)]">
                  Welcome, {guest.name}
                </span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border)]">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      isActive(link.href)
                        ? 'bg-[var(--accent-light)] text-[var(--accent)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile auth actions */}
              <div className="pt-3 border-t border-[var(--border)] mt-2">
                {isAuthenticated && guest ? (
                  <div className="flex flex-col gap-2">
                    <span className="px-3 text-sm text-[var(--text-secondary)]">
                      {guest.email}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" fullWidth>
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="primary" size="sm" fullWidth>
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
