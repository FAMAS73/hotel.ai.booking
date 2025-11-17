/**
 * DatePicker Component
 *
 * Accessible date input component for selecting check-in/check-out dates.
 * Uses native HTML date input for best browser compatibility.
 *
 * Features:
 * - Native date picker UI (varies by browser)
 * - Min/max date validation
 * - Disabled state support
 * - Error state styling
 * - Accessible labels and ARIA attributes
 *
 * @module components/ui/DatePicker
 */

'use client';

import React from 'react';

export interface DatePickerProps {
  /** Current selected date value (ISO 8601 date string: YYYY-MM-DD) */
  value: string;

  /** Callback fired when date changes */
  onChange: (date: string) => void;

  /** Label text displayed above the input */
  label: string;

  /** Minimum selectable date (ISO 8601 date string) */
  min?: string;

  /** Maximum selectable date (ISO 8601 date string) */
  max?: string;

  /** Whether the input is disabled */
  disabled?: boolean;

  /** Whether the input has an error */
  error?: boolean;

  /** Error message to display below input */
  errorMessage?: string;

  /** Unique ID for the input (auto-generated if not provided) */
  id?: string;

  /** Whether this field is required */
  required?: boolean;

  /** Placeholder text when no date is selected */
  placeholder?: string;
}

/**
 * DatePicker component for date selection.
 *
 * Uses native HTML5 date input for optimal UX:
 * - iOS/Android: Native mobile date picker
 * - Desktop: Browser-specific calendar UI
 * - Fallback: Text input for older browsers
 *
 * Usage:
 * ```tsx
 * const [checkIn, setCheckIn] = useState('');
 *
 * <DatePicker
 *   label="Check-in Date"
 *   value={checkIn}
 *   onChange={setCheckIn}
 *   min={new Date().toISOString().split('T')[0]}
 *   required
 * />
 * ```
 */
export function DatePicker({
  value,
  onChange,
  label,
  min,
  max,
  disabled = false,
  error = false,
  errorMessage,
  id,
  required = false,
  placeholder,
}: DatePickerProps) {
  // Generate unique ID if not provided (for label association)
  const inputId = id || `datepicker-${React.useId()}`;

  return (
    <div className="w-full">
      {/* Label with required indicator */}
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
      >
        {label}
        {required && <span className="text-[var(--error)] ml-1">*</span>}
      </label>

      {/* Date input field */}
      <input
        type="date"
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        aria-invalid={error}
        aria-describedby={error && errorMessage ? `${inputId}-error` : undefined}
        className={`
          w-full
          px-4 py-2.5
          bg-[var(--bg-primary)]
          border
          rounded-lg
          text-[var(--text-primary)]
          placeholder:text-[var(--text-muted)]
          focus:outline-none
          focus:ring-2
          disabled:opacity-50
          disabled:cursor-not-allowed
          theme-transition
          ${
            error
              ? 'border-[var(--error)] focus:ring-[var(--error)]'
              : 'border-[var(--border)] focus:ring-[var(--accent)]'
          }
        `}
      />

      {/* Error message */}
      {error && errorMessage && (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-sm text-[var(--error)]"
          role="alert"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
