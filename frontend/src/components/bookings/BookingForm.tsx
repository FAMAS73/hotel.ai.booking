/**
 * BookingForm Component
 *
 * Multi-step booking form for creating room reservations.
 * Collects dates, guest count, and special requests.
 *
 * Features:
 * - Date selection with validation
 * - Guest count selector
 * - Special requests textarea
 * - Price calculation preview
 * - Form validation
 * - Loading states
 *
 * @module components/bookings/BookingForm
 */

'use client';

import React, { useState, useEffect } from 'react';
import { DatePicker } from '@/components/ui/DatePicker';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useBookingStore } from '@/lib/stores/bookingStore';
import { formatCurrency } from '@/lib/utils';
import type { Room } from '@/types';

export interface BookingFormProps {
  /** Room being booked */
  room: Room;

  /** Callback when booking is submitted */
  onSubmit: () => void;

  /** Whether submission is in progress */
  isSubmitting?: boolean;
}

/**
 * BookingForm component for creating bookings.
 *
 * Form Fields:
 * - Check-in date (required)
 * - Check-out date (required)
 * - Number of guests (required, max = room capacity)
 * - Special requests (optional)
 *
 * Validation:
 * - Check-in must be today or later
 * - Check-out must be after check-in
 * - Guests must not exceed room capacity
 * - Minimum 1 night stay
 *
 * Price Calculation:
 * - Displays nightly rate
 * - Shows total nights
 * - Calculates and displays total price
 * - Updates in real-time as dates change
 *
 * Usage:
 * ```tsx
 * <BookingForm
 *   room={room}
 *   onSubmit={handleBookingSubmit}
 *   isSubmitting={isSubmitting}
 * />
 * ```
 */
export function BookingForm({ room, onSubmit, isSubmitting = false }: BookingFormProps) {
  const { formData, updateFormData, setSpecialRequests } = useBookingStore();

  // Local validation state
  const [dateError, setDateError] = useState('');
  const [guestsError, setGuestsError] = useState('');

  // Get today's date for min validation
  const today = new Date().toISOString().split('T')[0];

  // Guest count options (1 to room capacity)
  const guestOptions = Array.from({ length: room.capacity }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} ${i + 1 === 1 ? 'Guest' : 'Guests'}`,
  }));

  // Validate dates whenever they change
  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);

      if (checkOut <= checkIn) {
        setDateError('Check-out must be at least 1 day after check-in');
      } else {
        setDateError('');
      }
    }
  }, [formData.checkIn, formData.checkOut]);

  // Validate guest count
  useEffect(() => {
    if (formData.guestsCount > room.capacity) {
      setGuestsError(`This room can accommodate maximum ${room.capacity} guests`);
    } else {
      setGuestsError('');
    }
  }, [formData.guestsCount, room.capacity]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submission
    if (!formData.checkIn || !formData.checkOut) {
      setDateError('Please select both check-in and check-out dates');
      return;
    }

    if (dateError || guestsError) {
      return;
    }

    onSubmit();
  };

  // Check if form is valid
  const isFormValid =
    formData.checkIn &&
    formData.checkOut &&
    formData.guestsCount > 0 &&
    !dateError &&
    !guestsError;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dates Section */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Select Dates
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePicker
            label="Check-in"
            value={formData.checkIn}
            onChange={(date) => updateFormData({ checkIn: date })}
            min={today}
            required
            error={!!dateError && !!formData.checkIn}
            disabled={isSubmitting}
          />

          <DatePicker
            label="Check-out"
            value={formData.checkOut}
            onChange={(date) => updateFormData({ checkOut: date })}
            min={formData.checkIn || today}
            required
            error={!!dateError && !!formData.checkOut}
            errorMessage={dateError}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Guests Section */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Number of Guests
        </h3>

        <Select
          label="Guests"
          value={formData.guestsCount}
          onChange={(value) => updateFormData({ guestsCount: parseInt(value) })}
          options={guestOptions}
          required
          error={!!guestsError}
          errorMessage={guestsError}
          disabled={isSubmitting}
        />
      </div>

      {/* Special Requests Section */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Special Requests (Optional)
        </h3>

        <textarea
          value={formData.specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Any special requests? (e.g., early check-in, high floor, etc.)"
          rows={4}
          maxLength={500}
          disabled={isSubmitting}
          className="
            w-full
            px-4 py-3
            bg-[var(--bg-primary)]
            border border-[var(--border)]
            rounded-lg
            text-[var(--text-primary)]
            placeholder:text-[var(--text-muted)]
            focus:outline-none
            focus:ring-2
            focus:ring-[var(--accent)]
            disabled:opacity-50
            disabled:cursor-not-allowed
            resize-none
            theme-transition
          "
        />

        {formData.specialRequests.length > 400 && (
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {formData.specialRequests.length}/500 characters
          </p>
        )}
      </div>

      {/* Price Summary */}
      {formData.totalNights > 0 && (
        <div className="bg-[var(--bg-secondary)] rounded-lg p-6 theme-transition">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Price Summary
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>
                {formatCurrency(room.base_price)} × {formData.totalNights}{' '}
                {formData.totalNights === 1 ? 'night' : 'nights'}
              </span>
              <span>{formatCurrency(formData.totalPrice)}</span>
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex justify-between items-center">
              <span className="text-lg font-semibold text-[var(--text-primary)]">Total</span>
              <span className="text-2xl font-bold text-[var(--text-primary)]">
                {formatCurrency(formData.totalPrice)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!isFormValid || isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Processing...' : 'Complete Booking'}
        </Button>
      </div>

      {/* Helper text */}
      <p className="text-sm text-[var(--text-muted)] text-center">
        By completing this booking, you agree to our terms and conditions.
      </p>
    </form>
  );
}
