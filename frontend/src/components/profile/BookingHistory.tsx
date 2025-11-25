/**
 * BookingHistory Component - Display User's Past Bookings
 */

'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import { getBookings } from '@/lib/api/bookings';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import type { Booking } from '@/types';

export function BookingHistory() {
  const { data: bookings, error, isLoading } = useSWR<Booking[]>(
    '/api/bookings',
    () => getBookings()
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message="Failed to load booking history" />;
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No bookings yet</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Start by browsing our rooms
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Your Bookings</h3>
      {bookings.map((booking) => (
        <Card key={booking.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">Room #{booking.room_id}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(booking.check_in_date)} - {formatDate(booking.check_out_date)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {booking.num_guests} guest{booking.num_guests > 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatCurrency(booking.total_price)}</p>
              <p className="text-xs text-gray-500">{booking.status}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
