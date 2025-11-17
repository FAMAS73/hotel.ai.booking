/**
 * AvailabilityBadge Component
 *
 * Visual indicator for room availability status.
 * Displays colored badge with availability state (Available, Limited, Sold Out).
 *
 * Features:
 * - Color-coded status (green, yellow, red)
 * - Accessible text and ARIA labels
 * - Theme-aware styling
 * - Optional room count display
 *
 * @module components/rooms/AvailabilityBadge
 */

'use client';

import React from 'react';
import type { Room } from '@/types';

export interface AvailabilityBadgeProps {
  /** Availability status from Room entity */
  status: Room['availability_status'];

  /** Optional count of available rooms (shows "X rooms available") */
  count?: number;

  /** Size variant */
  size?: 'sm' | 'md' | 'lg';

  /** Whether to show the count alongside status */
  showCount?: boolean;
}

/**
 * AvailabilityBadge component displays room availability status.
 *
 * Color Coding:
 * - Available (Green): 3+ rooms available
 * - Limited (Yellow): 1-2 rooms available
 * - Sold Out (Red): 0 rooms available
 *
 * Usage:
 * ```tsx
 * <AvailabilityBadge status="Available" count={5} showCount />
 * // Displays: "Available • 5 rooms"
 *
 * <AvailabilityBadge status="Limited" count={1} />
 * // Displays: "Limited Availability"
 *
 * <AvailabilityBadge status="Sold Out" />
 * // Displays: "Sold Out"
 * ```
 */
export function AvailabilityBadge({
  status,
  count,
  size = 'md',
  showCount = false,
}: AvailabilityBadgeProps) {
  // Determine badge styling based on availability status
  const getStatusStyles = (): {
    bgColor: string;
    textColor: string;
    dotColor: string;
  } => {
    switch (status) {
      case 'Available':
        return {
          bgColor: 'bg-[var(--success-light)]',
          textColor: 'text-[var(--success)]',
          dotColor: 'bg-[var(--success)]',
        };
      case 'Limited':
        return {
          bgColor: 'bg-[var(--warning-light)]',
          textColor: 'text-[var(--warning)]',
          dotColor: 'bg-[var(--warning)]',
        };
      case 'Sold Out':
        return {
          bgColor: 'bg-[var(--error-light)]',
          textColor: 'text-[var(--error)]',
          dotColor: 'bg-[var(--error)]',
        };
      default:
        return {
          bgColor: 'bg-[var(--bg-tertiary)]',
          textColor: 'text-[var(--text-secondary)]',
          dotColor: 'bg-[var(--text-muted)]',
        };
    }
  };

  // Get size-specific styling
  const getSizeStyles = (): {
    padding: string;
    fontSize: string;
    dotSize: string;
  } => {
    switch (size) {
      case 'sm':
        return {
          padding: 'px-2 py-1',
          fontSize: 'text-xs',
          dotSize: 'h-1.5 w-1.5',
        };
      case 'lg':
        return {
          padding: 'px-4 py-2',
          fontSize: 'text-base',
          dotSize: 'h-3 w-3',
        };
      case 'md':
      default:
        return {
          padding: 'px-3 py-1.5',
          fontSize: 'text-sm',
          dotSize: 'h-2 w-2',
        };
    }
  };

  // Get display text based on status
  const getStatusText = (): string => {
    switch (status) {
      case 'Available':
        return 'Available';
      case 'Limited':
        return 'Limited Availability';
      case 'Sold Out':
        return 'Sold Out';
      default:
        return 'Unknown';
    }
  };

  const { bgColor, textColor, dotColor } = getStatusStyles();
  const { padding, fontSize, dotSize } = getSizeStyles();

  return (
    <div
      className={`
        inline-flex items-center gap-2
        ${padding}
        ${bgColor}
        ${textColor}
        ${fontSize}
        font-medium
        rounded-full
        theme-transition
      `}
      // Accessibility: Provide semantic meaning
      role="status"
      aria-label={`Availability: ${getStatusText()}${showCount && count !== undefined ? `, ${count} rooms` : ''}`}
    >
      {/* Status indicator dot */}
      <span
        className={`${dotSize} ${dotColor} rounded-full animate-pulse`}
        aria-hidden="true"
      />

      {/* Status text */}
      <span>{getStatusText()}</span>

      {/* Optional room count */}
      {showCount && count !== undefined && count > 0 && (
        <>
          <span aria-hidden="true">•</span>
          <span>
            {count} {count === 1 ? 'room' : 'rooms'}
          </span>
        </>
      )}
    </div>
  );
}
