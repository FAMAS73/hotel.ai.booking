/**
 * Bookings API Client
 *
 * Handles all booking-related API calls including:
 * - Creating new bookings
 * - Fetching booking history
 * - Updating booking details
 * - Cancelling bookings
 *
 * @module lib/api/bookings
 */

import { apiClient } from './client';
import type {
  Booking,
  BookingCreate,
  BookingUpdate,
  BookingCancellation,
  PaginatedResponse,
} from '@/types';

/**
 * Create a new booking.
 *
 * Requires authentication (JWT token).
 * Validates room availability for selected dates before creating booking.
 *
 * @param bookingData - Booking details (room, dates, guests, requests)
 * @returns Promise resolving to created booking with confirmation details
 *
 * @example
 * ```typescript
 * const booking = await createBooking({
 *   room_type: 'Deluxe',
 *   check_in: '2025-03-15',
 *   check_out: '2025-03-18',
 *   guests_count: 2,
 *   special_requests: 'Late check-in please'
 * });
 *
 * console.log(`Booking confirmed! ID: ${booking.id}`);
 * ```
 */
export async function createBooking(bookingData: BookingCreate): Promise<Booking> {
  return apiClient.post<Booking>('/api/bookings', bookingData);
}

/**
 * Get list of all bookings for the current authenticated user.
 *
 * Requires authentication.
 * Returns bookings in descending order (newest first).
 * Supports pagination for large booking histories.
 *
 * @param page - Page number (1-indexed)
 * @param pageSize - Number of bookings per page
 * @returns Promise resolving to paginated booking list
 *
 * @example
 * ```typescript
 * const { items, total, page } = await getBookings(1, 10);
 * console.log(`Showing ${items.length} of ${total} bookings`);
 * ```
 */
export async function getBookings(
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<Booking>> {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });

  return apiClient.get<PaginatedResponse<Booking>>(`/api/bookings?${params}`);
}

/**
 * Get details of a specific booking by ID.
 *
 * Requires authentication.
 * Only returns booking if it belongs to the authenticated user
 * (or if user is admin).
 *
 * @param id - Booking ID
 * @returns Promise resolving to booking details
 *
 * @example
 * ```typescript
 * const booking = await getBooking(123);
 * console.log(`Status: ${booking.status}`);
 * console.log(`Check-in: ${booking.check_in}`);
 * ```
 */
export async function getBooking(id: number): Promise<Booking> {
  return apiClient.get<Booking>(`/api/bookings/${id}`);
}

/**
 * Update booking details (special requests or status).
 *
 * Requires authentication.
 * Only the booking owner or admin can update bookings.
 * Some fields (dates, room type) cannot be updated after creation.
 *
 * @param id - Booking ID to update
 * @param updates - Fields to update
 * @returns Promise resolving to updated booking
 *
 * @example
 * ```typescript
 * const updated = await updateBooking(123, {
 *   special_requests: 'Changed to early check-in'
 * });
 * ```
 */
export async function updateBooking(id: number, updates: BookingUpdate): Promise<Booking> {
  return apiClient.patch<Booking>(`/api/bookings/${id}`, updates);
}

/**
 * Cancel an existing booking.
 *
 * Requires authentication.
 * Sets booking status to 'Cancelled' with cancellation reason.
 * May trigger refund based on cancellation policy.
 *
 * @param id - Booking ID to cancel
 * @param reason - Reason for cancellation
 * @returns Promise resolving to cancelled booking
 *
 * @example
 * ```typescript
 * await cancelBooking(123, 'Change of plans');
 * // Booking status is now 'Cancelled'
 * ```
 */
export async function cancelBooking(id: number, reason: string): Promise<Booking> {
  const cancellationData: BookingCancellation = {
    booking_id: id,
    cancellation_reason: reason,
  };

  return apiClient.post<Booking>(`/api/bookings/${id}/cancel`, cancellationData);
}

/**
 * Get all bookings for admin dashboard.
 *
 * Requires admin authentication.
 * Returns all bookings across all users with filtering options.
 *
 * @param filters - Optional filters (status, date range, etc.)
 * @param page - Page number
 * @param pageSize - Number of bookings per page
 * @returns Promise resolving to paginated booking list
 *
 * @example
 * ```typescript
 * // Admin: Get all pending bookings
 * const { items } = await getAllBookings({ status: 'Pending' }, 1, 20);
 * ```
 */
export async function getAllBookings(
  filters?: {
    status?: Booking['status'];
    start_date?: string;
    end_date?: string;
  },
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<Booking>> {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });

  if (filters?.status) params.append('status', filters.status);
  if (filters?.start_date) params.append('start_date', filters.start_date);
  if (filters?.end_date) params.append('end_date', filters.end_date);

  return apiClient.get<PaginatedResponse<Booking>>(`/api/admin/bookings?${params}`);
}
