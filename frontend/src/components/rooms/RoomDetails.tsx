/**
 * RoomDetails Component
 *
 * Detailed view of a single room with full information, amenities, and booking CTA.
 * Used on room detail pages.
 *
 * Features:
 * - Full room description
 * - Amenities grouped by category
 * - Room specifications (size, capacity, bed type)
 * - Pricing information
 * - Availability status
 * - Book Now CTA button
 *
 * @module components/rooms/RoomDetails
 */

'use client';

import React from 'react';
import { AvailabilityBadge } from '@/components/rooms/AvailabilityBadge';
import { Button } from '@/components/ui/Button';
import type { Room } from '@/types';
import { formatCurrency } from '@/lib/utils';

export interface RoomDetailsProps {
  /** Room data to display */
  room: Room;

  /** Callback when Book Now button is clicked */
  onBookNow?: () => void;

  /** Whether booking is available */
  canBook?: boolean;
}

/**
 * RoomDetails component displays comprehensive room information.
 *
 * Layout Sections:
 * 1. Header: Room type, name, availability
 * 2. Specifications: Size, capacity, bed details
 * 3. Description: Full text description
 * 4. Amenities: Grouped by category with icons
 * 5. Pricing: Base price with Book Now CTA
 *
 * Usage:
 * ```tsx
 * <RoomDetails
 *   room={room}
 *   onBookNow={() => router.push(`/rooms/${room.id}/book`)}
 *   canBook={room.availability_status !== 'Sold Out'}
 * />
 * ```
 */
export function RoomDetails({ room, onBookNow, canBook = true }: RoomDetailsProps) {
  // Group amenities by category for organized display
  const amenitiesByCategory = room.amenities.reduce(
    (acc, amenity) => {
      if (!acc[amenity.category]) {
        acc[amenity.category] = [];
      }
      acc[amenity.category].push(amenity);
      return acc;
    },
    {} as Record<string, typeof room.amenities>
  );

  return (
    <div className="space-y-8">
      {/* Room header */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            {/* Room type badge */}
            <span className="inline-block px-3 py-1 text-sm font-medium text-[var(--accent)] bg-[var(--accent-light)] rounded-full mb-3">
              {room.type}
            </span>

            {/* Room name */}
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
              {room.name}
            </h1>
          </div>

          {/* Availability badge */}
          <AvailabilityBadge
            status={room.availability_status}
            count={room.available_count}
            size="lg"
            showCount={room.available_count !== undefined}
          />
        </div>
      </div>

      {/* Room specifications */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-[var(--border)]">
        {/* Room size */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <svg
              className="h-8 w-8 text-[var(--accent)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{room.size_sqm} m²</p>
          <p className="text-sm text-[var(--text-secondary)]">Room Size</p>
        </div>

        {/* Guest capacity */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <svg
              className="h-8 w-8 text-[var(--accent)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}
          </p>
          <p className="text-sm text-[var(--text-secondary)]">Max Capacity</p>
        </div>

        {/* Base price */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <svg
              className="h-8 w-8 text-[var(--accent)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {formatCurrency(room.base_price)}
          </p>
          <p className="text-sm text-[var(--text-secondary)]">Per Night</p>
        </div>

        {/* View type (from first amenity with View category if exists) */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <svg
              className="h-8 w-8 text-[var(--accent)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {amenitiesByCategory.View?.[0]?.name || 'City'}
          </p>
          <p className="text-sm text-[var(--text-secondary)]">View</p>
        </div>
      </div>

      {/* Room description */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">About This Room</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
          {room.description}
        </p>
      </div>

      {/* Amenities by category */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Room Amenities</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(amenitiesByCategory).map(([category, amenities]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-[var(--accent)] rounded-full" />
                {category}
              </h3>

              <ul className="space-y-2">
                {amenities.map((amenity) => (
                  <li
                    key={amenity.id}
                    className="flex items-center gap-3 text-[var(--text-secondary)]"
                  >
                    <svg
                      className="h-5 w-5 text-[var(--success)] flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{amenity.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Book Now CTA */}
      <div className="sticky bottom-0 bg-[var(--bg-primary)] border-t border-[var(--border)] p-6 -mx-6 md:-mx-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Starting from</p>
            <p className="text-3xl font-bold text-[var(--text-primary)]">
              {formatCurrency(room.base_price)}
              <span className="text-base font-normal text-[var(--text-secondary)]"> / night</span>
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={onBookNow}
            disabled={!canBook || room.availability_status === 'Sold Out'}
            className="w-full sm:w-auto"
          >
            {room.availability_status === 'Sold Out' ? 'Sold Out' : 'Book Now'}
          </Button>
        </div>
      </div>
    </div>
  );
}
