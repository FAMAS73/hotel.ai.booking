/**
 * useTheme Hook for Theme Management
 *
 * Provides:
 * - Light/dark/system theme switching
 * - Theme persistence to localStorage
 * - System theme detection
 * - Theme state access
 *
 * Manages theme state and applies changes to the DOM.
 *
 * @module lib/hooks/useTheme
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import type { ThemePreference } from '@/types';

/**
 * Theme type: light, dark, or follow system preference
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Resolved theme (actual theme applied): light or dark only
 */
export type ResolvedTheme = 'light' | 'dark';

/**
 * LocalStorage key for theme preference
 */
const THEME_STORAGE_KEY = 'hotel-theme-preference';

/**
 * Default theme from environment or 'system'
 */
const DEFAULT_THEME: Theme =
  (process.env.NEXT_PUBLIC_DEFAULT_THEME as Theme) || 'system';

/**
 * useTheme hook provides theme management functionality.
 *
 * Features:
 * - Automatic system theme detection
 * - Smooth theme transitions (300ms)
 * - Persistence to localStorage
 * - SSR-safe implementation
 *
 * Usage:
 * ```typescript
 * const { theme, resolvedTheme, setTheme } = useTheme();
 *
 * // Change theme
 * setTheme('dark');
 *
 * // Check resolved theme (actual theme applied)
 * if (resolvedTheme === 'dark') {
 *   // Dark theme specific logic
 * }
 * ```
 */
export function useTheme() {
  // Theme preference (can be 'system')
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

  // Resolved theme (actual theme applied: 'light' or 'dark')
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // System theme preference from OS
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('light');

  /**
   * Get theme preference from localStorage.
   * Returns stored theme or default if not found.
   */
  const getStoredTheme = useCallback((): Theme => {
    if (typeof window === 'undefined') return DEFAULT_THEME;

    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ThemePreference;
        return parsed.theme;
      }
    } catch (error) {
      console.error('Failed to read theme from localStorage:', error);
    }

    return DEFAULT_THEME;
  }, []);

  /**
   * Save theme preference to localStorage.
   */
  const saveTheme = useCallback((newTheme: Theme) => {
    if (typeof window === 'undefined') return;

    try {
      const preference: ThemePreference = {
        theme: newTheme,
        last_updated: new Date().toISOString(),
      };
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(preference));
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error);
    }
  }, []);

  /**
   * Detect system theme preference from OS.
   * Uses prefers-color-scheme media query.
   */
  const detectSystemTheme = useCallback((): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light';

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return darkModeQuery.matches ? 'dark' : 'light';
  }, []);

  /**
   * Apply theme to DOM by updating data-theme attribute.
   * This attribute is used in globals.css for theme-specific styles.
   *
   * @param appliedTheme - The resolved theme to apply ('light' or 'dark')
   */
  const applyTheme = useCallback((appliedTheme: ResolvedTheme) => {
    if (typeof window === 'undefined') return;

    // Apply data-theme attribute to document element
    // This is used by Tailwind CSS and custom CSS variables
    document.documentElement.setAttribute('data-theme', appliedTheme);

    // Also add/remove 'dark' class for Tailwind dark mode
    if (appliedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setResolvedTheme(appliedTheme);
  }, []);

  /**
   * Resolve theme preference to actual theme.
   * If theme is 'system', returns system theme. Otherwise, returns theme as-is.
   */
  const resolveTheme = useCallback(
    (themePreference: Theme): ResolvedTheme => {
      if (themePreference === 'system') {
        return systemTheme;
      }
      return themePreference as ResolvedTheme;
    },
    [systemTheme]
  );

  /**
   * Set theme preference and apply it.
   *
   * @param newTheme - Theme to set ('light', 'dark', or 'system')
   */
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      saveTheme(newTheme);

      const resolved = resolveTheme(newTheme);
      applyTheme(resolved);
    },
    [saveTheme, resolveTheme, applyTheme]
  );

  /**
   * Toggle between light and dark themes.
   * If current theme is 'system', switches to the opposite of system theme.
   */
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

  /**
   * Initialize theme on component mount.
   * - Detects system theme
   * - Loads theme from localStorage
   * - Applies resolved theme to DOM
   */
  useEffect(() => {
    // Detect system theme
    const detected = detectSystemTheme();
    setSystemTheme(detected);

    // Load stored theme
    const stored = getStoredTheme();
    setThemeState(stored);

    // Resolve and apply theme
    const resolved = stored === 'system' ? detected : (stored as ResolvedTheme);
    applyTheme(resolved);

    // Listen for system theme changes
    if (typeof window !== 'undefined') {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        const newSystemTheme = e.matches ? 'dark' : 'light';
        setSystemTheme(newSystemTheme);

        // If current theme is 'system', re-apply
        if (theme === 'system') {
          applyTheme(newSystemTheme);
        }
      };

      // Modern browsers
      darkModeQuery.addEventListener('change', handleSystemThemeChange);

      return () => {
        darkModeQuery.removeEventListener('change', handleSystemThemeChange);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  /**
   * Re-apply theme when theme preference changes.
   */
  useEffect(() => {
    const resolved = resolveTheme(theme);
    applyTheme(resolved);
  }, [theme, resolveTheme, applyTheme]);

  return {
    /** Current theme preference ('light', 'dark', or 'system') */
    theme,

    /** Resolved theme actually applied ('light' or 'dark') */
    resolvedTheme,

    /** System theme detected from OS */
    systemTheme,

    /** Set theme preference */
    setTheme,

    /** Toggle between light and dark */
    toggleTheme,
  };
}
