/**
 * Card Component
 *
 * Container component for content with consistent styling.
 * Provides elevation, padding, and border styles.
 *
 * @module components/ui/Card
 */

'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';

  /** Whether the card is clickable/hoverable */
  hoverable?: boolean;

  /** Children content */
  children: React.ReactNode;
}

/**
 * Card component for content containers.
 *
 * Usage:
 * ```tsx
 * <Card>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </Card>
 * ```
 */
export function Card({
  padding = 'md',
  hoverable = false,
  children,
  className = '',
  ...props
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={`
        bg-[var(--bg-primary)]
        border border-[var(--border)]
        rounded-lg
        shadow-sm
        theme-transition
        ${paddingClasses[padding]}
        ${hoverable ? 'hover:shadow-md hover:border-[var(--border-hover)] cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
