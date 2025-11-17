/**
 * Room API Client
 *
 * Handles all room catalog related API calls including:
 * - Fetching room list with filters
 * - Getting room details
 * - Checking availability
 *
 * @module lib/api/rooms
 */

import { apiClient } from './client';
import type { Room, RoomFilter, PaginatedResponse } from '@/types';

/**
 * Room list response with applied filters for transparency.
 * Shows what filters were actually used by the backend.
 */
export interface RoomListResponse {
  /** Array of room types matching the filter criteria */
  rooms: Room[];

  /** Echo back the filters that were applied on the backend */
  filters_applied: {
    check_in?: string;
    check_out?: string;
    guests?: number;
    min_price?: number;
    max_price?: number;
    amenities?: string[];
    room_types?: string[];
  };

  /** Total number of rooms matching filter (for pagination if needed) */
  total_count: number;
}

/**
 * Get list of all room types with optional filtering.
 *
 * Public endpoint - no authentication required.
 * Commonly used filters:
 * - check_in/check_out: Filter by availability for date range
 * - guests: Filter by room capacity
 * - min_price/max_price: Filter by price range
 *
 * @param filter - Optional room filter criteria
 * @returns Promise resolving to room list with applied filters
 *
 * @example
 * ```typescript
 * const { rooms } = await getRooms({
 *   check_in: '2025-03-15',
 *   check_out: '2025-03-18',
 *   guests: 2
 * });
 * ```
 */
export async function getRooms(filter?: RoomFilter): Promise<RoomListResponse> {
  // Build query parameters from filter object
  const params = new URLSearchParams();

  if (filter?.check_in) params.append('check_in', filter.check_in);
  if (filter?.check_out) params.append('check_out', filter.check_out);
  if (filter?.guests) params.append('guests', filter.guests.toString());
  if (filter?.min_price) params.append('min_price', filter.min_price.toString());
  if (filter?.max_price) params.append('max_price', filter.max_price.toString());
  if (filter?.amenities) {
    // Send amenities as comma-separated list
    params.append('amenities', filter.amenities.join(','));
  }
  if (filter?.room_types) {
    // Send room types as comma-separated list
    params.append('room_types', filter.room_types.join(','));
  }

  const queryString = params.toString();
  const url = queryString ? `/api/rooms?${queryString}` : '/api/rooms';

  return apiClient.get<RoomListResponse>(url);
}

/**
 * Get detailed information for a specific room type.
 *
 * Public endpoint - no authentication required.
 * Returns full room details including:
 * - Complete description and amenities
 * - All gallery images
 * - Real-time availability status
 *
 * @param id - Room type ID
 * @param filter - Optional date range to check availability
 * @returns Promise resolving to full room details
 *
 * @example
 * ```typescript
 * const room = await getRoom(1, {
 *   check_in: '2025-03-15',
 *   check_out: '2025-03-18'
 * });
 * console.log(room.availability_status); // 'Available' | 'Limited' | 'Sold Out'
 * ```
 */
export async function getRoom(id: number, filter?: RoomFilter): Promise<Room> {
  // Build query parameters for availability check
  const params = new URLSearchParams();

  if (filter?.check_in) params.append('check_in', filter.check_in);
  if (filter?.check_out) params.append('check_out', filter.check_out);

  const queryString = params.toString();
  const url = queryString ? `/api/rooms/${id}?${queryString}` : `/api/rooms/${id}`;

  return apiClient.get<Room>(url);
}

/**
 * Check room availability for specific dates without fetching full details.
 *
 * Lightweight endpoint for quick availability checks.
 * Used for real-time availability updates in booking flow.
 *
 * @param id - Room type ID
 * @param checkIn - Check-in date (ISO 8601)
 * @param checkOut - Check-out date (ISO 8601)
 * @returns Promise resolving to availability status and count
 *
 * @example
 * ```typescript
 * const { available, count } = await checkAvailability(1, '2025-03-15', '2025-03-18');
 * if (!available) {
 *   console.log('Room is sold out for these dates');
 * } else {
 *   console.log(`${count} rooms available`);
 * }
 * ```
 */
export async function checkAvailability(
  id: number,
  checkIn: string,
  checkOut: string
): Promise<{ available: boolean; count: number; status: Room['availability_status'] }> {
  const params = new URLSearchParams({
    check_in: checkIn,
    check_out: checkOut,
  });

  return apiClient.get<{ available: boolean; count: number; status: Room['availability_status'] }>(
    `/api/rooms/${id}/availability?${params}`
  );
}
