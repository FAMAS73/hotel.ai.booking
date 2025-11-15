/**
 * LoadingSpinner Component
 *
 * Animated loading spinner for async operations.
 *
 * @module components/ui/LoadingSpinner
 */

'use client';

import React from 'react';

export interface LoadingSpinnerProps {
  /** Spinner size */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /** Optional loading text */
  text?: string;

  /** Center in container */
  center?: boolean;
}

/**
 * LoadingSpinner component shows animated loading indicator.
 *
 * Usage:
 * ```tsx
 * <LoadingSpinner size="lg" text="Loading..." />
 * ```
 */
export function LoadingSpinner({ size = 'md', text, center = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const spinner = (
    <div className={`inline-flex flex-col items-center gap-2 ${center ? 'justify-center' : ''}`}>
      <svg
        className={`animate-spin ${sizeClasses[size]} text-[var(--accent)]`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Loading"
        role="status"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && <p className="text-[var(--text-secondary)] text-sm">{text}</p>}
    </div>
  );

  if (center) {
    return <div className="flex items-center justify-center min-h-[200px] w-full">{spinner}</div>;
  }

  return spinner;
}
