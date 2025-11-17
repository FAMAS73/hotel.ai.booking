/**
 * Room Detail Page
 *
 * Detailed view of a single room with gallery, amenities, and booking option.
 * Dynamic route: /rooms/[id]
 *
 * @module app/rooms/[id]/page
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RoomGallery } from '@/components/rooms/RoomGallery';
import { RoomDetails } from '@/components/rooms/RoomDetails';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/Button';
import { useRoom } from '@/lib/hooks/useRooms';

interface RoomDetailPageProps {
  params: {
    id: string;
  };
}

/**
 * Room detail page component.
 *
 * Features (per FR-002 requirements):
 * - Full room gallery with lightbox
 * - Complete room description
 * - Amenities grouped by category
 * - Room specifications (size, capacity, price)
 * - Real-time availability status
 * - Book Now button (navigates to booking flow)
 * - Back to catalog link
 *
 * User Flow:
 * 1. User clicks room card from /rooms catalog
 * 2. Lands on /rooms/[id] with full details
 * 3. Views gallery, reads description, checks amenities
 * 4. Clicks "Book Now" to start booking flow
 */
export default function RoomDetailPage({ params }: RoomDetailPageProps) {
  const router = useRouter();
  const roomId = parseInt(params.id);

  // Fetch room details using SWR hook
  // TODO: Add date filter from URL query params for availability check
  const { room, isLoading, error } = useRoom(roomId);

  // Handle Book Now click - navigate to booking page
  // TODO: T065 - This will be integrated with booking flow
  const handleBookNow = () => {
    // For now, navigate to a placeholder booking page
    // Will be replaced with actual booking flow in T065
    router.push(`/rooms/${roomId}/book`);
  };

  // Handle back to catalog
  const handleBackToCatalog = () => {
    router.push('/rooms');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-[var(--text-secondary)]">Loading room details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state or room not found
  if (error || !room) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="max-w-md text-center">
            {error ? (
              <ErrorMessage message="Failed to load room details" error={error} />
            ) : (
              <>
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
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                  Room Not Found
                </h1>
                <p className="text-[var(--text-secondary)] mb-6">
                  The room you're looking for doesn't exist or has been removed.
                </p>
                <Button variant="primary" onClick={handleBackToCatalog}>
                  Back to Rooms
                </Button>
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Success state - display room details
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1" id="main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back to catalog link */}
          <button
            onClick={handleBackToCatalog}
            className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-dark)] mb-6 transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Back to All Rooms</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left column: Image gallery */}
            <div>
              <RoomGallery images={room.images} roomName={room.name} />
            </div>

            {/* Right column: Room details */}
            <div>
              <RoomDetails
                room={room}
                onBookNow={handleBookNow}
                canBook={room.availability_status !== 'Sold Out'}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
