/**
 * Input Component
 *
 * Form input component with label, error states, and validation.
 *
 * @module components/ui/Input
 */

'use client';

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Input label */
  label?: string;

  /** Error message */
  error?: string;

  /** Helper text */
  helperText?: string;

  /** Full width input */
  fullWidth?: boolean;
}

/**
 * Input component for forms.
 *
 * Usage:
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="your@email.com"
 *   error={errors.email}
 * />
 * ```
 */
export function Input({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substring(7)}`;
  const hasError = Boolean(error);

  return (
    <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--text-primary)] theme-transition"
        >
          {label}
          {props.required && <span className="text-[var(--error)] ml-1">*</span>}
        </label>
      )}

      <input
        id={inputId}
        className={`
          px-3 py-2
          bg-[var(--bg-primary)]
          border
          ${hasError ? 'border-[var(--error)] focus:ring-[var(--error)]' : 'border-[var(--border)] focus:ring-[var(--accent)]'}
          rounded-md
          text-[var(--text-primary)]
          placeholder:text-[var(--text-muted)]
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:opacity-50 disabled:cursor-not-allowed
          theme-transition
          ${className}
        `}
        aria-invalid={hasError}
        aria-describedby={
          error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
        }
        {...props}
      />

      {error && (
        <p id={`${inputId}-error`} className="text-sm text-[var(--error)]" role="alert">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p id={`${inputId}-helper`} className="text-sm text-[var(--text-muted)]">
          {helperText}
        </p>
      )}
    </div>
  );
}
