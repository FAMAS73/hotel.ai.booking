/**
 * Next.js Middleware for Route Protection
 *
 * Runs on the Edge runtime before pages are rendered.
 * Protects routes that require authentication or specific roles.
 *
 * **Middleware Execution Flow (Thesis)**:
 * 1. Request comes in for a protected route
 * 2. Middleware checks for JWT token in cookies/localStorage
 * 3. If no token, redirect to login with returnUrl
 * 4. If token exists, allow request to continue
 * 5. Client-side ProtectedRoute component performs additional validation
 *
 * **Security Notes**:
 * - Middleware runs on Edge runtime (cannot access Node.js APIs)
 * - Token validation happens on client-side (ProtectedRoute component)
 * - For production, implement server-side token validation
 *
 * @module middleware
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Routes that require authentication.
 * Add new protected routes to this array.
 */
const PROTECTED_ROUTES = [
  '/profile',
  '/admin',
];

/**
 * Routes that require admin role.
 * Subset of PROTECTED_ROUTES with additional role restriction.
 */
const ADMIN_ROUTES = [
  '/admin',
];

/**
 * Routes that should redirect to home if user is already authenticated.
 * Prevents authenticated users from accessing login/register pages.
 */
const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
];

/**
 * Middleware function that protects routes based on authentication status.
 *
 * **Implementation Notes (Thesis)**:
 * - Currently checks for token presence only (demo mode)
 * - Production should validate token signature and expiry on server-side
 * - Edge runtime limitations prevent full JWT verification here
 *
 * @param request - Incoming request object
 * @returns NextResponse (allow, redirect, or modify request)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route requires protection
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = ADMIN_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Get authentication token from cookies (production) or check request headers (demo)
  // Note: localStorage is not accessible in middleware (Edge runtime)
  const token = request.cookies.get('auth_token')?.value;

  // Protect routes that require authentication
  if (isProtectedRoute && !token) {
    // Redirect to login with return URL
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && token) {
    // User is already logged in, redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  }

  // For admin routes, we can't verify role here (Edge runtime limitation)
  // Role verification happens in ProtectedRoute component on client-side
  // Production should use server-side rendering with role validation

  // Allow request to continue
  return NextResponse.next();
}

/**
 * Middleware configuration.
 * Specifies which routes this middleware should run on.
 *
 * **Matcher Patterns**:
 * - Includes all protected routes and auth routes
 * - Excludes static files (_next/static, images, etc.)
 * - Excludes API routes (they have their own authentication)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder
     * - API routes (have their own auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
