/**
 * ErrorMessage Component
 *
 * Displays error messages with consistent styling.
 *
 * @module components/ui/ErrorMessage
 */

'use client';

import React from 'react';

export interface ErrorMessageProps {
  /** Error message text */
  message: string;

  /** Optional error title */
  title?: string;

  /** Retry action */
  onRetry?: () => void;
}

/**
 * ErrorMessage component displays errors with optional retry.
 *
 * Usage:
 * ```tsx
 * <ErrorMessage
 *   title="Failed to load bookings"
 *   message="Unable to connect to the server"
 *   onRetry={handleRetry}
 * />
 * ```
 */
export function ErrorMessage({ message, title = 'Error', onRetry }: ErrorMessageProps) {
  return (
    <div
      className="bg-[var(--error-light)] border border-[var(--error)] rounded-md p-4"
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Error icon */}
        <svg
          className="h-5 w-5 text-[var(--error)] flex-shrink-0 mt-0.5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        {/* Error content */}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-[var(--error)]">{title}</h3>
          <p className="text-sm text-[var(--text-primary)] mt-1">{message}</p>

          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-sm font-medium text-[var(--error)] hover:underline focus:outline-none"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
