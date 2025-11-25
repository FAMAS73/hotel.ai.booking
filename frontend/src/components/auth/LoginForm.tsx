/**
 * LoginForm Component
 *
 * Provides a form for guest authentication with email and password.
 * Includes validation, loading states, and error handling.
 *
 * **Auth Flow (Thesis Demonstration)**:
 * 1. User enters email/password credentials
 * 2. Form validates input (email format, password length)
 * 3. Submits credentials to backend via auth API
 * 4. Backend validates with bcrypt and returns JWT token
 * 5. Token is stored in localStorage (demo) or httpOnly cookie (production)
 * 6. authStore is updated with authenticated user data
 * 7. User is redirected to dashboard or original destination
 *
 * @module components/auth/LoginForm
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { GuestLogin } from '@/types';

/**
 * Props for LoginForm component
 */
interface LoginFormProps {
  /** Optional callback after successful login */
  onSuccess?: () => void;

  /** Redirect URL after login (defaults to '/') */
  redirectTo?: string;
}

/**
 * LoginForm renders an authentication form with email/password fields.
 *
 * **Features**:
 * - Client-side validation (email format, password length)
 * - Loading state during API call
 * - Error display for failed authentication
 * - Remember me functionality (future enhancement)
 * - Link to registration page
 *
 * **Security Notes (Thesis)**:
 * - Password is never stored in component state after submission
 * - HTTPS ensures credentials are encrypted in transit
 * - JWT token is stored securely via apiClient
 */
export function LoginForm({ onSuccess, redirectTo = '/' }: LoginFormProps) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Form state management
  const [formData, setFormData] = useState<GuestLogin>({
    email: '',
    password: '',
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Validates form data before submission.
   * Provides immediate feedback to user for common mistakes.
   *
   * @returns true if form is valid, false otherwise
   */
  const validateForm = (): boolean => {
    // Check if email is provided and has basic email format
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password minimum length check (matches backend requirement)
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    setError(null);
    return true;
  };

  /**
   * Handles form submission and authentication flow.
   *
   * **Authentication Process**:
   * 1. Validate form data client-side
   * 2. Call login API with credentials
   * 3. Backend verifies credentials with bcrypt
   * 4. Receive JWT token and user data
   * 5. Store token via apiClient.setToken()
   * 6. Update authStore with authenticated user
   * 7. Redirect to destination page
   *
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call authentication API
      // Token is automatically stored by the login() function via apiClient.setToken()
      const authResponse = await login(formData);

      // Update global auth state with authenticated user
      // This makes user data available throughout the application
      setAuth(authResponse.guest, authResponse.access_token);

      // Clear password from memory (security best practice)
      setFormData((prev) => ({ ...prev, password: '' }));

      // Execute success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Redirect to destination page
      router.push(redirectTo);
    } catch (err: any) {
      // Handle authentication errors
      // Backend returns 401 for invalid credentials
      if (err.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(err.error || 'Login failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles input field changes and updates form state.
   *
   * @param field - Field name to update
   * @param value - New field value
   */
  const handleInputChange = (field: keyof GuestLogin, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Sign In to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="guest@example.com"
              disabled={isLoading}
              autoComplete="email"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              autoComplete="current-password"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* Link to Registration */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Create Account
            </Link>
          </div>

          {/* Forgot Password Link (Future Enhancement) */}
          <div className="text-center">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </form>
      </div>

      {/* Demo Credentials (Thesis Demonstration Only) */}
      <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
          Demo Credentials:
        </p>
        <p className="text-xs text-blue-700 dark:text-blue-400">
          Email: guest@example.com
        </p>
        <p className="text-xs text-blue-700 dark:text-blue-400">
          Password: password123
        </p>
      </div>
    </div>
  );
}
