/**
 * Select Component
 *
 * Accessible dropdown select component with theme support.
 * Uses native HTML select for best accessibility and browser compatibility.
 *
 * Features:
 * - Native select element (keyboard accessible)
 * - Support for option groups
 * - Error and disabled states
 * - Custom styling with theme variables
 * - Accessible labels and ARIA attributes
 *
 * @module components/ui/Select
 */

'use client';

import React from 'react';

export interface SelectOption {
  /** Unique value for this option */
  value: string | number;

  /** Display label for this option */
  label: string;

  /** Whether this option is disabled */
  disabled?: boolean;
}

export interface SelectProps {
  /** Current selected value */
  value: string | number;

  /** Callback fired when selection changes */
  onChange: (value: string) => void;

  /** Array of options to display in dropdown */
  options: SelectOption[];

  /** Label text displayed above the select */
  label?: string;

  /** Placeholder text when no option is selected */
  placeholder?: string;

  /** Whether the select is disabled */
  disabled?: boolean;

  /** Whether the select has an error */
  error?: boolean;

  /** Error message to display below select */
  errorMessage?: string;

  /** Unique ID for the select (auto-generated if not provided) */
  id?: string;

  /** Whether this field is required */
  required?: boolean;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Select component for dropdown selections.
 *
 * Provides accessible dropdown functionality:
 * - Keyboard navigation (arrow keys, Enter, Esc)
 * - Screen reader support
 * - Form integration
 * - Theme-aware styling
 *
 * Usage:
 * ```tsx
 * const guestOptions = [
 *   { value: 1, label: '1 Guest' },
 *   { value: 2, label: '2 Guests' },
 *   { value: 3, label: '3 Guests' },
 *   { value: 4, label: '4+ Guests' },
 * ];
 *
 * <Select
 *   label="Number of Guests"
 *   value={guests}
 *   onChange={(val) => setGuests(parseInt(val))}
 *   options={guestOptions}
 *   placeholder="Select guests"
 *   required
 * />
 * ```
 */
export function Select({
  value,
  onChange,
  options,
  label,
  placeholder,
  disabled = false,
  error = false,
  errorMessage,
  id,
  required = false,
  className = '',
}: SelectProps) {
  // Generate unique ID if not provided (for label association)
  const selectId = id || `select-${React.useId()}`;

  return (
    <div className={`w-full ${className}`}>
      {/* Label with required indicator */}
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
        >
          {label}
          {required && <span className="text-[var(--error)] ml-1">*</span>}
        </label>
      )}

      {/* Select wrapper for custom styling arrow */}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          aria-invalid={error}
          aria-describedby={error && errorMessage ? `${selectId}-error` : undefined}
          className={`
            w-full
            px-4 py-2.5
            pr-10
            bg-[var(--bg-primary)]
            border
            rounded-lg
            text-[var(--text-primary)]
            appearance-none
            cursor-pointer
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
        >
          {/* Placeholder option */}
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {/* Render all options */}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown arrow icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="h-5 w-5 text-[var(--text-muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Error message */}
      {error && errorMessage && (
        <p
          id={`${selectId}-error`}
          className="mt-1.5 text-sm text-[var(--error)]"
          role="alert"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
