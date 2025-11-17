/**
 * useRooms Hook
 *
 * Custom React hook for fetching and managing room data with SWR.
 * Provides automatic caching, revalidation, and real-time updates.
 *
 * Features:
 * - Automatic data fetching with SWR
 * - 30-second refresh interval for availability updates
 * - Built-in loading and error states
 * - Filter-based data fetching
 *
 * @module lib/hooks/useRooms
 */

'use client';

import useSWR from 'swr';
import { getRooms, getRoom } from '@/lib/api/rooms';
import type { Room, RoomFilter } from '@/types';
import type { RoomListResponse } from '@/lib/api/rooms';

/**
 * Hook for fetching list of rooms with optional filtering.
 *
 * Uses SWR for data fetching with the following benefits:
 * - Automatic caching of room data
 * - Revalidation on focus/reconnect
 * - 30-second refresh interval for real-time availability
 * - Optimistic UI updates
 *
 * @param filter - Optional filter criteria for room search
 * @returns Object containing rooms array, loading state, error, and refetch function
 *
 * @example
 * ```typescript
 * function RoomCatalog() {
 *   const { rooms, isLoading, error, mutate } = useRooms({
 *     check_in: '2025-03-15',
 *     check_out: '2025-03-18',
 *     guests: 2
 *   });
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage message="Failed to load rooms" />;
 *
 *   return <RoomList rooms={rooms} />;
 * }
 * ```
 */
export function useRooms(filter?: RoomFilter) {
  // Create a stable cache key that includes filter parameters
  // SWR will automatically deduplicate requests with the same key
  const cacheKey = filter
    ? [`/api/rooms`, JSON.stringify(filter)]
    : '/api/rooms';

  // SWR fetcher function that calls our API client
  // This function is only called when data needs to be fetched
  const fetcher = async () => {
    return getRooms(filter);
  };

  // useSWR hook configuration:
  // - key: Unique identifier for this data (used for caching)
  // - fetcher: Function to fetch the data
  // - options: SWR configuration
  const { data, error, isLoading, mutate } = useSWR<RoomListResponse>(
    cacheKey,
    fetcher,
    {
      // Refresh room availability every 30 seconds
      // This ensures users see up-to-date availability without manual refresh
      refreshInterval: 30000,

      // Revalidate when user refocuses the window
      // Useful when user switches back from another tab
      revalidateOnFocus: true,

      // Revalidate when network reconnects
      // Ensures data is fresh after connection loss
      revalidateOnReconnect: true,

      // Don't revalidate on mount if data exists
      // Prevents unnecessary API calls when component remounts
      revalidateIfStale: false,

      // Keep previous data while fetching new data
      // Provides smooth user experience without flickering
      keepPreviousData: true,
    }
  );

  return {
    /** Array of rooms matching the filter criteria */
    rooms: data?.rooms || [],

    /** Filters that were actually applied by the backend */
    filtersApplied: data?.filters_applied,

    /** Total number of matching rooms (for pagination) */
    totalCount: data?.total_count || 0,

    /** Whether the data is currently being fetched */
    isLoading,

    /** Error object if fetch failed, undefined otherwise */
    error,

    /** Function to manually trigger a refetch */
    refetch: mutate,
  };
}

/**
 * Hook for fetching details of a single room.
 *
 * Fetches complete room information including:
 * - Full description and amenities
 * - All gallery images
 * - Real-time availability for given dates
 *
 * @param id - Room type ID (null/undefined to skip fetch)
 * @param filter - Optional date range to check availability
 * @returns Object containing room data, loading state, error, and refetch function
 *
 * @example
 * ```typescript
 * function RoomDetailPage({ params }: { params: { id: string } }) {
 *   const { room, isLoading, error } = useRoom(
 *     parseInt(params.id),
 *     {
 *       check_in: '2025-03-15',
 *       check_out: '2025-03-18'
 *     }
 *   );
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage />;
 *   if (!room) return <NotFound />;
 *
 *   return <RoomDetails room={room} />;
 * }
 * ```
 */
export function useRoom(id: number | null | undefined, filter?: RoomFilter) {
  // Create cache key with room ID and optional filter
  const cacheKey = id
    ? filter
      ? [`/api/rooms/${id}`, JSON.stringify(filter)]
      : `/api/rooms/${id}`
    : null;

  // SWR fetcher function for single room
  const fetcher = async () => {
    if (!id) return null;
    return getRoom(id, filter);
  };

  const { data, error, isLoading, mutate } = useSWR<Room | null>(
    cacheKey,
    fetcher,
    {
      // Refresh availability every 30 seconds
      refreshInterval: 30000,

      // Revalidate on focus to ensure fresh data
      revalidateOnFocus: true,

      // Don't revalidate on mount if we have cached data
      revalidateIfStale: false,

      // Keep previous data while refetching
      keepPreviousData: true,
    }
  );

  return {
    /** Room details (null if not found or ID is null/undefined) */
    room: data || null,

    /** Whether the data is currently being fetched */
    isLoading,

    /** Error object if fetch failed */
    error,

    /** Function to manually trigger a refetch */
    refetch: mutate,
  };
}
