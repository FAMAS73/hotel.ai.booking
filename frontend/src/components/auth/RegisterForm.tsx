/**
 * RegisterForm Component - Guest Account Registration
 *
 * Handles new user registration with email, password, name, and phone.
 * Similar to LoginForm but includes additional fields and password confirmation.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { GuestRegistration } from '@/types';

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function RegisterForm({ onSuccess, redirectTo = '/' }: RegisterFormProps) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState<GuestRegistration & { confirmPassword: string }>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.name || formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const { confirmPassword, ...registrationData } = formData;
      const authResponse = await register(registrationData);

      setAuth(authResponse.guest, authResponse.access_token);
      setFormData({ email: '', password: '', confirmPassword: '', name: '', phone: '' });

      if (onSuccess) onSuccess();
      router.push(redirectTo);
    } catch (err: any) {
      if (err.status === 409) {
        setError('Email already registered. Please login instead.');
      } else {
        setError(err.error || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="John Doe"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number (Optional)
            </label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+66 12 345 6789"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="At least 6 characters"
              disabled={isLoading}
              autoComplete="new-password"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Re-enter password"
              disabled={isLoading}
              autoComplete="new-password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
