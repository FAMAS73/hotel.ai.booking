/**
 * Authentication API Client
 *
 * Handles all authentication-related API calls:
 * - User registration
 * - Login/logout
 * - Token refresh
 * - Profile management
 *
 * Uses the base apiClient for HTTP requests with automatic token injection.
 * Tokens are managed via APIClient's setToken/clearToken methods.
 *
 * @module lib/api/auth
 */

import { apiClient } from './client';
import type {
  Guest,
  GuestProfile,
  GuestRegistration,
  GuestLogin,
} from '@/types';

/**
 * AuthResponse contains the JWT access token and user data returned on successful login/registration.
 */
export interface AuthResponse {
  access_token: string;
  token_type: string;
  guest: Guest;
}

/**
 * TokenRefreshResponse contains a new access token when refreshing authentication.
 */
export interface TokenRefreshResponse {
  access_token: string;
  token_type: string;
}

/**
 * Register a new guest account.
 *
 * Creates a new guest record in the database and returns authentication tokens.
 *
 * **Security Note (Thesis)**: Password is transmitted over HTTPS.
 * In production, consider additional password strength requirements.
 *
 * @param data - Registration details (email, password, name, phone)
 * @returns Authentication tokens and guest profile
 * @throws ApiError if email already exists or validation fails
 */
export async function register(data: GuestRegistration): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>('/api/auth/register', data);
}

/**
 * Login with email and password.
 *
 * Authenticates user credentials and returns JWT access token.
 * The token is automatically stored via apiClient.setToken() for subsequent requests.
 *
 * **Auth Flow (Thesis)**:
 * 1. Submit email/password to backend
 * 2. Backend validates credentials using bcrypt
 * 3. Backend generates JWT token
 * 4. Frontend stores token in localStorage (demo) or httpOnly cookie (production)
 * 5. Token is included in Authorization header for protected routes
 *
 * @param credentials - Email and password
 * @returns Authentication tokens and guest profile
 * @throws ApiError if credentials are invalid (401)
 */
export async function login(credentials: GuestLogin): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);

  // Store JWT token for subsequent authenticated requests
  // Note: apiClient.setToken() handles localStorage (demo mode) or cookies (production mode)
  apiClient.setToken(response.access_token);

  return response;
}

/**
 * Logout the current user.
 *
 * Clears the JWT token from storage and optionally notifies the backend.
 * The backend may maintain a token blacklist for enhanced security.
 *
 * **Security (Thesis)**: Logout only clears client-side token.
 * For production, implement server-side token revocation.
 *
 * @returns Success confirmation
 */
export async function logout(): Promise<void> {
  try {
    // Notify backend of logout (optional - for token blacklisting)
    await apiClient.post('/api/auth/logout');
  } catch (error) {
    // Continue logout even if API call fails (network error, etc.)
    console.warn('Logout API call failed, clearing local token anyway', error);
  } finally {
    // Clear token from localStorage/cookies
    apiClient.clearToken();
  }
}

/**
 * Refresh the access token using the refresh token.
 *
 * Called automatically by API client when a request returns 401 Unauthorized.
 * The refresh token is stored as an httpOnly cookie (production) or localStorage (demo).
 *
 * **Token Refresh Flow (Thesis)**:
 * 1. Access token expires (typically after 15-30 minutes)
 * 2. Protected route returns 401 Unauthorized
 * 3. API client intercepts 401 and calls refreshToken()
 * 4. Backend validates refresh token and issues new access token
 * 5. Original request is retried with new access token
 *
 * @returns New access token
 * @throws ApiError if refresh token is invalid or expired
 */
export async function refreshToken(): Promise<TokenRefreshResponse> {
  const response = await apiClient.post<TokenRefreshResponse>('/api/auth/refresh');

  // Store the new access token
  apiClient.setToken(response.access_token);

  return response;
}

/**
 * Get the current authenticated user's profile.
 *
 * Requires valid JWT token in Authorization header.
 * Used to verify authentication status on app initialization.
 *
 * @returns Current guest profile
 * @throws ApiError if not authenticated (401)
 */
export async function getCurrentUser(): Promise<Guest> {
  return apiClient.get<Guest>('/api/auth/me');
}

/**
 * Update the current user's profile.
 *
 * Allows changing name, phone, and other profile fields.
 * Email cannot be changed (it's the unique identifier).
 *
 * **Validation (Thesis)**: Backend enforces field constraints.
 * Frontend provides UX feedback for validation errors.
 *
 * @param updates - Profile fields to update (partial update supported)
 * @returns Updated guest profile
 * @throws ApiError if validation fails or not authenticated
 */
export async function updateProfile(updates: Partial<GuestProfile>): Promise<Guest> {
  return apiClient.patch<Guest>('/api/auth/me', updates);
}

/**
 * Change the current user's password.
 *
 * Requires current password for verification (security best practice).
 *
 * **Security (Thesis)**:
 * - Current password prevents unauthorized password changes if session is hijacked
 * - New password is hashed with bcrypt on backend
 * - All existing sessions are invalidated after password change
 *
 * @param currentPassword - User's current password
 * @param newPassword - New password to set
 * @throws ApiError if current password is incorrect (403)
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  return apiClient.post('/api/auth/change-password', {
    current_password: currentPassword,
    new_password: newPassword,
  });
}

/**
 * Request a password reset email.
 *
 * Sends an email with a time-limited reset token.
 * Does not reveal whether email exists (security best practice).
 *
 * **Security (Thesis)**:
 * - Always returns success, even for non-existent emails (prevents email enumeration)
 * - Reset tokens expire after 1 hour
 * - One-time use tokens (invalidated after password reset)
 *
 * @param email - Email address to send reset link to
 */
export async function requestPasswordReset(email: string): Promise<void> {
  return apiClient.post('/api/auth/forgot-password', { email });
}

/**
 * Reset password using token from email.
 *
 * @param token - Reset token from email link
 * @param newPassword - New password to set
 * @throws ApiError if token is invalid or expired
 */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  return apiClient.post('/api/auth/reset-password', {
    token,
    new_password: newPassword,
  });
}
