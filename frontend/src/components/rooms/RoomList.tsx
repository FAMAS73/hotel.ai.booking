/**
 * RoomList Component
 *
 * Container component that displays a grid of RoomCard components.
 * Handles loading states, empty states, and responsive grid layout.
 *
 * Features:
 * - Responsive grid (1 col mobile, 2 col tablet, 3+ col desktop)
 * - Loading skeleton placeholders
 * - Empty state message
 * - Error state handling
 *
 * @module components/rooms/RoomList
 */

'use client';

import React from 'react';
import { RoomCard } from '@/components/rooms/RoomCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import type { Room } from '@/types';

export interface RoomListProps {
  /** Array of rooms to display */
  rooms: Room[];

  /** Whether rooms are currently loading */
  isLoading?: boolean;

  /** Error message if loading failed */
  error?: Error | null;

  /** Whether to show availability badges on cards */
  showAvailability?: boolean;

  /** Message to show when no rooms match filters */
  emptyMessage?: string;
}

/**
 * RoomList component displays rooms in a responsive grid.
 *
 * Grid Layout (per T060 requirements):
 * - Mobile (< 768px): 1 column
 * - Tablet (768px - 1024px): 2 columns
 * - Desktop (> 1024px): 3 columns
 * - Large desktop (> 1536px): 4 columns
 *
 * States:
 * - Loading: Shows skeleton placeholders
 * - Error: Shows error message with retry option
 * - Empty: Shows "no rooms found" message
 * - Success: Shows room cards in grid
 *
 * Usage:
 * ```tsx
 * const { rooms, isLoading, error } = useRooms(filter);
 *
 * <RoomList
 *   rooms={rooms}
 *   isLoading={isLoading}
 *   error={error}
 *   showAvailability={true}
 * />
 * ```
 */
export function RoomList({
  rooms,
  isLoading = false,
  error = null,
  showAvailability = true,
  emptyMessage = 'No rooms found matching your criteria. Try adjusting your filters.',
}: RoomListProps) {
  // Loading state - show skeleton placeholders
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-[var(--text-secondary)]">Loading rooms...</span>
        </div>

        {/* Loading skeleton grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden animate-pulse"
            >
              {/* Image skeleton */}
              <div className="w-full aspect-[16/9] bg-[var(--bg-tertiary)]" />

              {/* Content skeleton */}
              <div className="p-4 space-y-3">
                <div className="h-4 bg-[var(--bg-tertiary)] rounded w-1/4" />
                <div className="h-6 bg-[var(--bg-tertiary)] rounded w-3/4" />
                <div className="h-4 bg-[var(--bg-tertiary)] rounded w-full" />
                <div className="h-4 bg-[var(--bg-tertiary)] rounded w-2/3" />
                <div className="pt-3 flex justify-between">
                  <div className="h-8 bg-[var(--bg-tertiary)] rounded w-1/3" />
                  <div className="h-6 w-6 bg-[var(--bg-tertiary)] rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-12">
        <ErrorMessage
          message="Failed to load rooms. Please try again."
          error={error}
        />
      </div>
    );
  }

  // Empty state - no rooms match filter
  if (!rooms || rooms.length === 0) {
    return (
      <div className="py-16 text-center">
        <svg
          className="mx-auto h-16 w-16 text-[var(--text-muted)] mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
          No Rooms Found
        </h3>
        <p className="text-[var(--text-secondary)] max-w-md mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  // Success state - display room grid
  return (
    <div>
      {/* Result count */}
      <div className="mb-6">
        <p className="text-sm text-[var(--text-secondary)]">
          Showing <span className="font-medium text-[var(--text-primary)]">{rooms.length}</span>{' '}
          {rooms.length === 1 ? 'room' : 'rooms'}
        </p>
      </div>

      {/* Room grid - T060: Responsive layout per requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            showAvailability={showAvailability}
          />
        ))}
      </div>
    </div>
  );
}
