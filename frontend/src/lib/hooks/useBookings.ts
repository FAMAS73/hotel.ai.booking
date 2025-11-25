/**
 * useBookings Hook - Booking Data Management with SWR
 */

import useSWR from 'swr';
import { getBookings } from '@/lib/api/bookings';
import type { Booking } from '@/types';

export function useBookings() {
  const { data, error, isLoading, mutate } = useSWR<Booking[]>(
    '/api/bookings',
    getBookings,
    {
      refreshInterval: 5000, // Refresh every 5 seconds for real-time updates
      revalidateOnFocus: true,
    }
  );

  return {
    bookings: data,
    isLoading,
    isError: error,
    mutate,
  };
}
