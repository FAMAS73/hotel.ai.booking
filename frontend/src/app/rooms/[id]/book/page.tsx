/**
 * Booking Page
 *
 * Complete booking flow with form, submission, and confirmation.
 * Integrates BookingForm component with API submission.
 *
 * Dynamic route: /rooms/[id]/book
 *
 * @module app/rooms/[id]/book/page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BookingForm } from '@/components/bookings/BookingForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useRoom } from '@/lib/hooks/useRooms';
import { useBookingStore } from '@/lib/stores/bookingStore';
import { createBooking } from '@/lib/api/bookings';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { BookingCreate } from '@/types';

interface BookingPageProps {
  params: {
    id: string;
  };
}

/**
 * Booking page component.
 *
 * User Flow (T065-T068):
 * 1. User clicks "Book Now" from room detail page
 * 2. Lands on /rooms/[id]/book
 * 3. Fills booking form (dates, guests, requests) - T066
 * 4. Reviews summary and submits - T067
 * 5. Backend creates booking
 * 6. Shows confirmation modal with booking details - T068
 * 7. Optionally redirects to profile/bookings
 */
export default function BookingPage({ params }: BookingPageProps) {
  const router = useRouter();
  const roomId = parseInt(params.id);

  // Fetch room details
  const { room, isLoading, error } = useRoom(roomId);

  // Booking store state
  const {
    formData,
    startBooking,
    setSubmitting,
    setCreatedBooking,
    setError,
    reset,
  } = useBookingStore();

  // Local state for confirmation modal
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Initialize booking when room loads
  useEffect(() => {
    if (room && !formData.room) {
      // Initialize with default dates (today + 1 day for check-in)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const checkIn = tomorrow.toISOString().split('T')[0];

      const dayAfter = new Date(tomorrow);
      dayAfter.setDate(dayAfter.getDate() + 1);
      const checkOut = dayAfter.toISOString().split('T')[0];

      startBooking(room, checkIn, checkOut, 2);
    }
  }, [room, formData.room, startBooking]);

  // Handle booking submission (T067)
  const handleSubmitBooking = async () => {
    if (!room || !formData.checkIn || !formData.checkOut) {
      setError('Missing required booking information');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Prepare booking data for API
      const bookingData: BookingCreate = {
        room_type: room.type,
        check_in: formData.checkIn,
        check_out: formData.checkOut,
        guests_count: formData.guestsCount,
        special_requests: formData.specialRequests || undefined,
      };

      // Submit booking to backend API
      const createdBooking = await createBooking(bookingData);

      // Store created booking in state
      setCreatedBooking(createdBooking);

      // Show confirmation modal (T068)
      setShowConfirmation(true);
    } catch (err: any) {
      console.error('Booking submission failed:', err);
      setError(err.message || 'Failed to create booking. Please try again.');
      setSubmitting(false);
    }
  };

  // Handle confirmation modal close
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    reset();
    router.push('/profile'); // Redirect to profile to view bookings
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-[var(--text-secondary)]">Loading booking form...</p>
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
              <ErrorMessage message="Failed to load room" error={error} />
            ) : (
              <ErrorMessage message="Room not found" />
            )}
            <Button
              variant="primary"
              onClick={() => router.push('/rooms')}
              className="mt-6"
            >
              Back to Rooms
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content">
        {/* Page header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-dark)] mb-4 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>

          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Book {room.name}
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Complete your reservation in just a few steps
          </p>
        </div>

        {/* Room summary card */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-6 mb-8 theme-transition">
          <div className="flex gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                {room.name}
              </h2>
              <p className="text-[var(--text-secondary)] mb-4">{room.type} Room</p>

              <div className="flex items-center gap-6 text-sm text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Up to {room.capacity} guests</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span>{room.size_sqm} m²</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatCurrency(room.base_price)}/night</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking form (T066) */}
        <div className="bg-[var(--bg-primary)] rounded-lg p-6 md:p-8 border border-[var(--border)]">
          <BookingForm
            room={room}
            onSubmit={handleSubmitBooking}
            isSubmitting={formData.room !== null && useBookingStore.getState().isSubmitting}
          />
        </div>

        {/* Error display */}
        {useBookingStore.getState().error && (
          <div className="mt-6">
            <ErrorMessage message={useBookingStore.getState().error!} />
          </div>
        )}
      </main>

      {/* Booking confirmation modal (T068) */}
      <Modal
        isOpen={showConfirmation}
        onClose={handleCloseConfirmation}
        title="Booking Confirmed!"
        size="md"
      >
        <div className="text-center py-6">
          {/* Success icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[var(--success-light)] mb-4">
            <svg className="h-8 w-8 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Your booking is confirmed!
          </h3>

          {useBookingStore.getState().createdBooking && (
            <div className="mt-6 bg-[var(--bg-secondary)] rounded-lg p-6 text-left">
              <p className="text-sm text-[var(--text-secondary)] mb-4">Booking Details:</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Booking ID:</span>
                  <span className="font-medium text-[var(--text-primary)]">
                    #{useBookingStore.getState().createdBooking!.id}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Room:</span>
                  <span className="font-medium text-[var(--text-primary)]">
                    {room.name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Check-in:</span>
                  <span className="font-medium text-[var(--text-primary)]">
                    {formatDate(formData.checkIn, 'MMM dd, yyyy')}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Check-out:</span>
                  <span className="font-medium text-[var(--text-primary)]">
                    {formatDate(formData.checkOut, 'MMM dd, yyyy')}
                  </span>
                </div>

                <div className="flex justify-between pt-3 border-t border-[var(--border)]">
                  <span className="text-[var(--text-secondary)]">Total:</span>
                  <span className="text-lg font-bold text-[var(--text-primary)]">
                    {formatCurrency(formData.totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <p className="mt-6 text-[var(--text-secondary)]">
            A confirmation email has been sent to your registered email address.
          </p>

          <div className="mt-8 flex gap-4">
            <Button
              variant="secondary"
              onClick={() => router.push('/rooms')}
              className="flex-1"
            >
              Browse More Rooms
            </Button>

            <Button
              variant="primary"
              onClick={handleCloseConfirmation}
              className="flex-1"
            >
              View My Bookings
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
