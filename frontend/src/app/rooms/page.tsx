/**
 * Rooms Catalog Page
 *
 * Browse all available room types with filtering options.
 * Main page for User Story 2 - Room Catalog Browsing.
 *
 * @module app/rooms/page
 */

'use client';

import React, { useState } from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RoomFilter } from '@/components/rooms/RoomFilter';
import { RoomList } from '@/components/rooms/RoomList';
import { useRooms } from '@/lib/hooks/useRooms';
import type { RoomFilter as RoomFilterType } from '@/types';

/**
 * Rooms catalog page component.
 *
 * Features (per FR-002 requirements):
 * - Filter rooms by check-in/check-out dates
 * - Filter by guest count
 * - Filter by price range
 * - Real-time availability updates (30s refresh via SWR)
 * - Responsive grid layout (1-3+ columns)
 * - Click room card to view details
 *
 * User Flow:
 * 1. User lands on /rooms page
 * 2. Optionally sets filters (dates, guests, price)
 * 3. Views filtered rooms in grid
 * 4. Clicks room card to go to /rooms/[id]
 */
export default function RoomsPage() {
  // Filter state managed in this component
  // This allows URL query params integration in future if needed
  const [filter, setFilter] = useState<RoomFilterType>({});

  // Fetch rooms with current filter using SWR hook
  // Automatically refetches every 30s for availability updates
  const { rooms, isLoading, error } = useRooms(filter);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
            Our Rooms
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Discover luxury accommodation in the heart of Bangkok. From cozy Standard rooms to
            opulent Presidential suites, we have the perfect space for your stay.
          </p>
        </div>

        {/* Filter panel */}
        <RoomFilter filter={filter} onChange={setFilter} isLoading={isLoading} />

        {/* Room grid */}
        <RoomList
          rooms={rooms}
          isLoading={isLoading}
          error={error}
          showAvailability={!!filter.check_in && !!filter.check_out}
        />
      </main>

      <Footer />
    </div>
  );
}
