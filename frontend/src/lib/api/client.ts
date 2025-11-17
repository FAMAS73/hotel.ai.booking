/**
 * Base API Client for Hotel AI Booking Chatbot
 *
 * Provides:
 * - Centralized HTTP client with JWT authentication
 * - Request/response interceptors for token management
 * - Error handling and logging
 * - Type-safe API calls
 *
 * Uses axios for HTTP requests with automatic token injection from localStorage (demo mode)
 * or httpOnly cookies (production mode).
 *
 * @module lib/api/client
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import type { ApiError, ApiResponse } from '@/types';

/**
 * Base URL for API requests.
 * Configured via NEXT_PUBLIC_API_URL environment variable.
 * Defaults to http://localhost:8000 for local development.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Authentication mode: 'demo' uses localStorage, 'production' uses httpOnly cookies
 */
const AUTH_MODE = process.env.NEXT_PUBLIC_AUTH_MODE || 'demo';

/**
 * Debug mode for verbose logging
 */
const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

/**
 * APIClient class provides a configured axios instance with authentication and error handling.
 *
 * Features:
 * - Automatic JWT token injection from localStorage (demo) or cookies (production)
 * - Request/response logging in debug mode
 * - Error transformation to ApiError type
 * - Token refresh on 401 Unauthorized responses
 */
class APIClient {
  private client: AxiosInstance;

  constructor() {
    // Create axios instance with default configuration
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // 30 second timeout for AI chatbot responses
      headers: {
        'Content-Type': 'application/json',
      },
      // Include credentials for httpOnly cookie authentication
      withCredentials: AUTH_MODE === 'production',
    });

    // Setup request interceptor for authentication
    this.setupRequestInterceptor();

    // Setup response interceptor for error handling
    this.setupResponseInterceptor();
  }

  /**
   * Request interceptor adds JWT token to Authorization header.
   *
   * In demo mode, reads token from localStorage.
   * In production mode, token is sent automatically via httpOnly cookies.
   */
  private setupRequestInterceptor(): void {
    this.client.interceptors.request.use(
      (config) => {
        // Debug logging
        if (DEBUG_MODE) {
          console.log('[API Request]', config.method?.toUpperCase(), config.url);
        }

        // In demo mode, inject token from localStorage
        if (AUTH_MODE === 'demo') {
          const token = this.getTokenFromStorage();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        // Production mode uses httpOnly cookies (no manual token injection needed)

        return config;
      },
      (error) => {
        if (DEBUG_MODE) {
          console.error('[API Request Error]', error);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Response interceptor handles errors and transforms responses.
   *
   * - Logs responses in debug mode
   * - Transforms API errors to ApiError type
   * - Handles 401 Unauthorized with token refresh attempt
   */
  private setupResponseInterceptor(): void {
    this.client.interceptors.response.use(
      (response) => {
        // Debug logging
        if (DEBUG_MODE) {
          console.log('[API Response]', response.status, response.config.url);
        }
        return response;
      },
      async (error: AxiosError) => {
        // Debug logging
        if (DEBUG_MODE) {
          console.error('[API Error]', error.response?.status, error.config?.url, error.message);
        }

        // Handle 401 Unauthorized - attempt token refresh
        if (error.response?.status === 401 && !error.config?.url?.includes('/auth/refresh')) {
          const refreshed = await this.refreshToken();
          if (refreshed && error.config) {
            // Retry original request with new token
            return this.client.request(error.config);
          }
        }

        // Transform axios error to ApiError
        const apiError = this.transformError(error);
        return Promise.reject(apiError);
      }
    );
  }

  /**
   * Retrieves JWT token from localStorage (demo mode only).
   *
   * ⚠️ Security Warning: localStorage is vulnerable to XSS attacks.
   * This is acceptable for thesis demonstration but should use httpOnly cookies in production.
   */
  private getTokenFromStorage(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  /**
   * Stores JWT token in localStorage (demo mode only).
   */
  public setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
    if (DEBUG_MODE) {
      console.log('[Auth] Token stored in localStorage (demo mode)');
    }
  }

  /**
   * Removes JWT token from localStorage (demo mode only).
   */
  public clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    if (DEBUG_MODE) {
      console.log('[Auth] Token cleared from localStorage');
    }
  }

  /**
   * Attempts to refresh the access token using the refresh token.
   *
   * Returns true if refresh succeeded, false otherwise.
   */
  private async refreshToken(): Promise<boolean> {
    try {
      // Call refresh endpoint (backend handles refresh token from cookie or request body)
      const response = await this.client.post('/api/auth/refresh');

      if (response.data.access_token) {
        // Store new access token
        this.setToken(response.data.access_token);
        return true;
      }

      return false;
    } catch (error) {
      if (DEBUG_MODE) {
        console.error('[Auth] Token refresh failed', error);
      }
      // Clear invalid tokens
      this.clearToken();
      return false;
    }
  }

  /**
   * Transforms axios error to ApiError type for consistent error handling.
   */
  private transformError(error: AxiosError): ApiError {
    // If response has API error format, use it
    if (error.response?.data && typeof error.response.data === 'object') {
      const data = error.response.data as any;
      if (data.error && data.code) {
        return data as ApiError;
      }
    }

    // Otherwise, create generic ApiError
    return {
      error: error.message || 'An unexpected error occurred',
      code: error.code || 'UNKNOWN_ERROR',
      status: error.response?.status || 500,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Generic GET request
   */
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * Generic POST request
   */
  public async post<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * Generic PUT request
   */
  public async put<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * Generic PATCH request
   */
  public async patch<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * Generic DELETE request
   */
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * Upload file with multipart/form-data (for room image uploads)
   */
  public async uploadFile<T>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  }

  /**
   * Get raw axios instance for advanced use cases
   */
  public getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export class for testing
export { APIClient };
