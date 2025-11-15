/**
 * useAuth Hook for Authentication Operations
 *
 * Provides:
 * - Login/logout functionality
 * - Registration
 * - Profile management
 * - Auth state access
 *
 * Wraps authStore and API client for convenient auth operations.
 *
 * @module lib/hooks/useAuth
 */

'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { apiClient } from '@/lib/api/client';
import { useUIStore } from '@/lib/stores/uiStore';
import type { GuestLogin, GuestRegistration, AuthResponse, Guest } from '@/types';

/**
 * useAuth hook provides authentication operations and state.
 *
 * Features:
 * - Type-safe login/register/logout
 * - Automatic error handling with toast notifications
 * - Profile fetching and updates
 * - Loading states for async operations
 *
 * Usage:
 * ```typescript
 * const { guest, isAuthenticated, login, logout, isLoading } = useAuth();
 *
 * // Login
 * await login({ email: 'user@example.com', password: 'password' });
 *
 * // Check authentication
 * if (isAuthenticated) {
 *   // Render authenticated content
 * }
 * ```
 */
export function useAuth() {
  const router = useRouter();
  const toast = useUIStore((state) => state.toast);

  // Auth store state
  const {
    guest,
    isAuthenticated,
    isLoading,
    error,
    setGuest,
    setLoading,
    setError,
    logout: logoutStore,
    isAdmin: isAdminCheck,
  } = useAuthStore();

  /**
   * Login with email and password.
   *
   * On success:
   * - Stores JWT token (demo mode) or receives httpOnly cookie (production)
   * - Updates authStore with guest data
   * - Shows success toast
   * - Redirects to home page
   *
   * On failure:
   * - Shows error toast with message
   * - Returns false
   */
  const login = useCallback(
    async (credentials: GuestLogin): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        // Call login API endpoint
        const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);

        // Store token if provided (demo mode)
        if (response.access_token) {
          apiClient.setToken(response.access_token);
        }

        // Update auth store with guest data
        setGuest(response.guest);

        // Show success toast
        toast.success(`Welcome back, ${response.guest.name}!`);

        // Redirect based on role
        if (response.guest.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }

        return true;
      } catch (error: any) {
        const errorMessage = error.error || 'Login failed. Please check your credentials.';
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    },
    [setGuest, setLoading, setError, toast, router]
  );

  /**
   * Register a new guest account.
   *
   * On success:
   * - Creates account
   * - Automatically logs in
   * - Stores token and guest data
   * - Shows success toast
   * - Redirects to home page
   *
   * On failure:
   * - Shows error toast
   * - Returns false
   */
  const register = useCallback(
    async (data: GuestRegistration): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        // Call register API endpoint
        const response = await apiClient.post<AuthResponse>('/api/auth/register', data);

        // Store token if provided (demo mode)
        if (response.access_token) {
          apiClient.setToken(response.access_token);
        }

        // Update auth store with guest data
        setGuest(response.guest);

        // Show success toast
        toast.success(`Account created successfully! Welcome, ${response.guest.name}!`);

        // Redirect to home page
        router.push('/');

        return true;
      } catch (error: any) {
        const errorMessage = error.error || 'Registration failed. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    },
    [setGuest, setLoading, setError, toast, router]
  );

  /**
   * Logout the current user.
   *
   * - Calls logout API endpoint (invalidates token on backend)
   * - Clears token from localStorage (demo mode)
   * - Clears authStore state
   * - Shows success toast
   * - Redirects to home page
   */
  const logout = useCallback(async () => {
    setLoading(true);

    try {
      // Call logout API endpoint to invalidate token on backend
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      // Continue logout even if API call fails
      console.error('Logout API call failed:', error);
    }

    // Clear token from storage
    apiClient.clearToken();

    // Clear auth store
    logoutStore();

    // Show success toast
    toast.info('You have been logged out successfully.');

    // Redirect to home page
    router.push('/');
  }, [logoutStore, toast, router, setLoading]);

  /**
   * Fetch current user profile from backend.
   *
   * Used on app initialization to check for existing session.
   * Returns true if profile fetched successfully, false otherwise.
   */
  const fetchProfile = useCallback(async (): Promise<boolean> => {
    setLoading(true);

    try {
      const guest = await apiClient.get<Guest>('/api/auth/profile');
      setGuest(guest);
      return true;
    } catch (error) {
      // No valid session - clear any stale data
      apiClient.clearToken();
      setGuest(null);
      return false;
    }
  }, [setGuest, setLoading]);

  /**
   * Update guest profile information.
   *
   * @param updates - Partial guest data to update
   */
  const updateProfile = useCallback(
    async (updates: Partial<Guest>): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const updatedGuest = await apiClient.patch<Guest>('/api/auth/profile', updates);
        setGuest(updatedGuest);
        toast.success('Profile updated successfully!');
        return true;
      } catch (error: any) {
        const errorMessage = error.error || 'Failed to update profile.';
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    },
    [setGuest, setLoading, setError, toast]
  );

  /**
   * Check if current user has admin role.
   */
  const isAdmin = useCallback(() => {
    return isAdminCheck();
  }, [isAdminCheck]);

  /**
   * On component mount, attempt to fetch profile if not already loaded.
   * This ensures session continuity across page refreshes.
   */
  useEffect(() => {
    // Only fetch if we don't already have guest data and we're not currently loading
    if (!guest && !isLoading) {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  return {
    // State
    guest,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
    isAdmin,
  };
}
