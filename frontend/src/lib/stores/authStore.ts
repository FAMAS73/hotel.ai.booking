/**
 * Authentication Store using Zustand
 *
 * Manages:
 * - User authentication state (logged in/out)
 * - Guest profile information
 * - Login/logout operations
 * - Token management
 *
 * Used throughout the application for auth-dependent features.
 *
 * @module lib/stores/authStore
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Guest } from '@/types';

/**
 * AuthState interface defines the shape of the authentication store.
 */
interface AuthState {
  /** Currently authenticated guest (null if not logged in) */
  guest: Guest | null;

  /** Whether the user is authenticated */
  isAuthenticated: boolean;

  /** Whether the initial auth check is in progress (on app load) */
  isLoading: boolean;

  /** Last authentication error */
  error: string | null;

  // Actions
  /** Set the authenticated guest */
  setGuest: (guest: Guest | null) => void;

  /** Set loading state */
  setLoading: (loading: boolean) => void;

  /** Set error state */
  setError: (error: string | null) => void;

  /** Logout the current user */
  logout: () => void;

  /** Check if user has admin role */
  isAdmin: () => boolean;

  /** Reset store to initial state */
  reset: () => void;
}

/**
 * Initial state for the auth store.
 */
const initialState = {
  guest: null,
  isAuthenticated: false,
  isLoading: true, // Start as loading to check for existing session
  error: null,
};

/**
 * useAuthStore hook provides access to authentication state and actions.
 *
 * Features:
 * - Persists guest data to localStorage for session continuity
 * - Provides type-safe access to guest information
 * - Includes utility methods for role checking
 *
 * Usage:
 * ```typescript
 * const { guest, isAuthenticated, setGuest, logout } = useAuthStore();
 * ```
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * Set the authenticated guest.
       * Automatically updates isAuthenticated based on guest presence.
       */
      setGuest: (guest) => {
        set({
          guest,
          isAuthenticated: guest !== null,
          error: null,
          isLoading: false,
        });
      },

      /**
       * Set loading state during authentication operations.
       */
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      /**
       * Set error message for authentication failures.
       */
      setError: (error) => {
        set({ error, isLoading: false });
      },

      /**
       * Logout the current user.
       * Clears guest data and resets authentication state.
       */
      logout: () => {
        set({
          guest: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
        });
      },

      /**
       * Check if the current guest has admin role.
       * Returns false if no guest is authenticated.
       */
      isAdmin: () => {
        const { guest } = get();
        return guest?.role === 'admin';
      },

      /**
       * Reset the store to initial state.
       * Useful for testing or after logout.
       */
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'hotel-auth-storage', // localStorage key
      // Only persist guest data, not loading/error states
      partialize: (state) => ({
        guest: state.guest,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * Selectors for optimized component re-rendering.
 * Use these to subscribe to specific parts of the auth state.
 */
export const authSelectors = {
  /** Select only the guest object */
  guest: (state: AuthState) => state.guest,

  /** Select only the authentication status */
  isAuthenticated: (state: AuthState) => state.isAuthenticated,

  /** Select only the loading state */
  isLoading: (state: AuthState) => state.isLoading,

  /** Select only the error state */
  error: (state: AuthState) => state.error,

  /** Select guest email (or empty string) */
  guestEmail: (state: AuthState) => state.guest?.email ?? '',

  /** Select guest name (or empty string) */
  guestName: (state: AuthState) => state.guest?.name ?? '',

  /** Select guest role */
  guestRole: (state: AuthState) => state.guest?.role ?? 'guest',
};
