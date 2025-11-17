/**
 * RoomCard Component
 *
 * Displays room information in a card format for the room catalog grid.
 * Shows room image, name, price, capacity, and availability status.
 *
 * Features:
 * - Next.js Image optimization
 * - Click to navigate to room details
 * - Hover effects
 * - Availability badge
 * - Responsive design
 *
 * @module components/rooms/RoomCard
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { AvailabilityBadge } from '@/components/rooms/AvailabilityBadge';
import type { Room } from '@/types';
import { formatCurrency } from '@/lib/utils';

export interface RoomCardProps {
  /** Room data to display */
  room: Room;

  /** Whether to show availability badge */
  showAvailability?: boolean;

  /** Additional CSS classes */
  className?: string;
}

/**
 * RoomCard component displays room summary in catalog grid.
 *
 * Card Layout:
 * - Featured image (16:9 aspect ratio)
 * - Room type and name
 * - Price per night
 * - Capacity and size
 * - Availability badge (if enabled)
 * - Amenities preview (first 3)
 *
 * Usage:
 * ```tsx
 * <RoomCard
 *   room={room}
 *   showAvailability={true}
 * />
 * ```
 */
export function RoomCard({
  room,
  showAvailability = true,
  className = '',
}: RoomCardProps) {
  return (
    <Link href={`/rooms/${room.id}`} className="group">
      <Card
        hoverable
        className={`overflow-hidden h-full flex flex-col ${className}`}
      >
        {/* Room image */}
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-[var(--bg-tertiary)]">
          <Image
            src={room.featured_image}
            alt={`${room.name} - ${room.type} room`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={false}
          />

          {/* Availability badge overlay */}
          {showAvailability && (
            <div className="absolute top-3 right-3">
              <AvailabilityBadge
                status={room.availability_status}
                count={room.available_count}
                size="sm"
              />
            </div>
          )}
        </div>

        {/* Room information */}
        <div className="flex-1 flex flex-col p-4">
          {/* Room type badge */}
          <div className="mb-2">
            <span className="inline-block px-2 py-1 text-xs font-medium text-[var(--accent)] bg-[var(--accent-light)] rounded">
              {room.type}
            </span>
          </div>

          {/* Room name */}
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent)] transition-colors">
            {room.name}
          </h3>

          {/* Room description (truncated) */}
          <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
            {room.description}
          </p>

          {/* Room details grid */}
          <div className="flex items-center gap-4 mb-3 text-sm text-[var(--text-secondary)]">
            {/* Capacity */}
            <div className="flex items-center gap-1">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>{room.capacity} guests</span>
            </div>

            {/* Size */}
            <div className="flex items-center gap-1">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
              <span>{room.size_sqm} m²</span>
            </div>
          </div>

          {/* Amenities preview */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {room.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity.id}
                className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-1 rounded"
              >
                {amenity.name}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-1 rounded">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>

          {/* Spacer to push price to bottom */}
          <div className="flex-1" />

          {/* Price and CTA */}
          <div className="flex items-end justify-between pt-3 border-t border-[var(--border)]">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">From</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {formatCurrency(room.base_price)}
              </p>
              <p className="text-xs text-[var(--text-muted)]">per night</p>
            </div>

            {/* View details arrow */}
            <div className="text-[var(--accent)] group-hover:translate-x-1 transition-transform">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
