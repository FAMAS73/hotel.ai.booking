/**
 * ProtectedRoute Component - Route Access Control
 *
 * Wraps pages that require authentication. Redirects unauthenticated users to login.
 * Supports role-based access control for admin-only pages.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
  redirectTo = '/auth/login'
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Wait for auth state to load
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated || !user) {
      const currentPath = window.location.pathname;
      const returnUrl = encodeURIComponent(currentPath);
      router.push(`${redirectTo}?returnUrl=${returnUrl}`);
      return;
    }

    // Check admin role if required
    if (requireAdmin && user.role !== 'admin') {
      router.push('/'); // Redirect non-admins to home
    }
  }, [isAuthenticated, user, isLoading, requireAdmin, redirectTo, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated || !user) {
    return null;
  }

  // Check admin access
  if (requireAdmin && user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
