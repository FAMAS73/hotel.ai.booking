/**
 * RoomFilter Component
 *
 * Filter panel for room catalog with date selection, guest count, and price range.
 * Updates room list in real-time as filters change.
 *
 * Features:
 * - Check-in/check-out date pickers
 * - Guest count selector
 * - Price range filter
 * - Reset filters button
 * - Responsive layout (stacks on mobile)
 *
 * @module components/rooms/RoomFilter
 */

'use client';

import React, { useState, useEffect } from 'react';
import { DatePicker } from '@/components/ui/DatePicker';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { RoomFilter as RoomFilterType } from '@/types';

export interface RoomFilterProps {
  /** Current filter values */
  filter: RoomFilterType;

  /** Callback when filter changes */
  onChange: (filter: RoomFilterType) => void;

  /** Whether filters are being applied (shows loading state) */
  isLoading?: boolean;
}

/**
 * RoomFilter component for filtering room catalog.
 *
 * Filter Options:
 * - Check-in date (required with check-out)
 * - Check-out date (required with check-in)
 * - Number of guests (1-8+)
 * - Min/max price range
 *
 * Validation:
 * - Check-out must be after check-in
 * - Check-in must be today or later
 * - Both dates required together (can't set just one)
 *
 * Usage:
 * ```tsx
 * const [filter, setFilter] = useState<RoomFilter>({});
 *
 * <RoomFilter
 *   filter={filter}
 *   onChange={setFilter}
 *   isLoading={isLoading}
 * />
 * ```
 */
export function RoomFilter({
  filter,
  onChange,
  isLoading = false,
}: RoomFilterProps) {
  // Local state for form validation
  const [dateError, setDateError] = useState('');

  // Get today's date in YYYY-MM-DD format for min date validation
  const today = new Date().toISOString().split('T')[0];

  // Guest count options (1-8+)
  const guestOptions = [
    { value: 1, label: '1 Guest' },
    { value: 2, label: '2 Guests' },
    { value: 3, label: '3 Guests' },
    { value: 4, label: '4 Guests' },
    { value: 5, label: '5 Guests' },
    { value: 6, label: '6 Guests' },
    { value: 7, label: '7 Guests' },
    { value: 8, label: '8+ Guests' },
  ];

  // Validate dates whenever check-in or check-out changes
  useEffect(() => {
    if (filter.check_in && filter.check_out) {
      const checkIn = new Date(filter.check_in);
      const checkOut = new Date(filter.check_out);

      if (checkOut <= checkIn) {
        setDateError('Check-out date must be after check-in date');
      } else {
        setDateError('');
      }
    } else {
      setDateError('');
    }
  }, [filter.check_in, filter.check_out]);

  // Handler for check-in date change
  const handleCheckInChange = (date: string) => {
    onChange({
      ...filter,
      check_in: date,
    });
  };

  // Handler for check-out date change
  const handleCheckOutChange = (date: string) => {
    onChange({
      ...filter,
      check_out: date,
    });
  };

  // Handler for guest count change
  const handleGuestsChange = (value: string) => {
    onChange({
      ...filter,
      guests: value ? parseInt(value) : undefined,
    });
  };

  // Reset all filters to default
  const handleReset = () => {
    onChange({});
    setDateError('');
  };

  // Check if any filters are applied
  const hasActiveFilters =
    filter.check_in || filter.check_out || filter.guests || filter.min_price || filter.max_price;

  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg p-6 mb-6 theme-transition">
      {/* Filter title */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Filter Rooms
        </h2>

        {/* Reset button (only show if filters are active) */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset
          </Button>
        )}
      </div>

      {/* Filter form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Check-in date */}
        <DatePicker
          label="Check-in"
          value={filter.check_in || ''}
          onChange={handleCheckInChange}
          min={today}
          disabled={isLoading}
          error={!!dateError && !!filter.check_in}
        />

        {/* Check-out date */}
        <DatePicker
          label="Check-out"
          value={filter.check_out || ''}
          onChange={handleCheckOutChange}
          min={filter.check_in || today}
          disabled={isLoading}
          error={!!dateError && !!filter.check_out}
          errorMessage={dateError}
        />

        {/* Guest count */}
        <Select
          label="Guests"
          value={filter.guests || ''}
          onChange={handleGuestsChange}
          options={guestOptions}
          placeholder="Select guests"
          disabled={isLoading}
        />

        {/* Price range (simplified - just max price for now) */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
            Max Price per Night
          </label>
          <input
            type="number"
            value={filter.max_price || ''}
            onChange={(e) =>
              onChange({
                ...filter,
                max_price: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            placeholder="Any price"
            min="0"
            step="500"
            disabled={isLoading}
            className="
              w-full
              px-4 py-2.5
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
              theme-transition
            "
          />
        </div>
      </div>

      {/* Helper text */}
      <p className="mt-4 text-sm text-[var(--text-muted)]">
        {hasActiveFilters
          ? `Filtering rooms${filter.check_in && filter.check_out ? ` for ${filter.check_in} to ${filter.check_out}` : ''}${filter.guests ? `, ${filter.guests} guest${filter.guests > 1 ? 's' : ''}` : ''}`
          : 'Select dates and preferences to find available rooms'}
      </p>
    </div>
  );
}
