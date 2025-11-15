/**
 * Button Component
 *
 * Reusable button component with multiple variants and sizes.
 * Follows accessibility best practices with proper ARIA attributes.
 *
 * Features:
 * - Multiple variants: primary, secondary, success, error, warning, ghost
 * - Multiple sizes: sm, md, lg
 * - Loading state with spinner
 * - Disabled state
 * - Full width option
 * - Icon support
 *
 * @module components/ui/Button
 */

'use client';

import React from 'react';

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'ghost';

/**
 * Button size types
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button component props
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant style */
  variant?: ButtonVariant;

  /** Button size */
  size?: ButtonSize;

  /** Show loading spinner */
  isLoading?: boolean;

  /** Full width button */
  fullWidth?: boolean;

  /** Icon to display before text */
  icon?: React.ReactNode;

  /** Icon to display after text */
  iconRight?: React.ReactNode;

  /** Children (button text or content) */
  children?: React.ReactNode;
}

/**
 * Get CSS classes for button variant.
 * Uses CSS variables from globals.css for theme support.
 */
function getVariantClasses(variant: ButtonVariant): string {
  const baseClasses = 'theme-transition font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] focus:ring-[var(--accent)] disabled:bg-gray-400',
    secondary:
      'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-hover)] focus:ring-[var(--accent)] disabled:bg-gray-300',
    success:
      'bg-[var(--success)] text-white hover:bg-[var(--success-hover)] focus:ring-[var(--success)] disabled:bg-gray-400',
    error:
      'bg-[var(--error)] text-white hover:bg-[var(--error-hover)] focus:ring-[var(--error)] disabled:bg-gray-400',
    warning:
      'bg-[var(--warning)] text-white hover:bg-[var(--warning-hover)] focus:ring-[var(--warning)] disabled:bg-gray-400',
    ghost:
      'bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] focus:ring-[var(--accent)] disabled:text-gray-400',
  };

  return `${baseClasses} ${variantClasses[variant]}`;
}

/**
 * Get CSS classes for button size.
 */
function getSizeClasses(size: ButtonSize): string {
  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm rounded',
    md: 'px-4 py-2 text-base rounded-md',
    lg: 'px-6 py-3 text-lg rounded-lg',
  };

  return sizeClasses[size];
}

/**
 * Button component with variant styles and loading state.
 *
 * Usage:
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * <Button variant="success" size="lg" isLoading>
 *   Submitting...
 * </Button>
 *
 * <Button variant="ghost" icon={<IconTrash />}>
 *   Delete
 * </Button>
 * ```
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  icon,
  iconRight,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);
  const widthClass = fullWidth ? 'w-full' : '';

  // Disable button when loading
  const isDisabled = disabled || isLoading;

  return (
    <button
      type="button"
      className={`
        inline-flex items-center justify-center gap-2
        ${variantClasses}
        ${sizeClasses}
        ${widthClass}
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      disabled={isDisabled}
      aria-busy={isLoading}
      {...props}
    >
      {/* Loading spinner */}
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Left icon */}
      {!isLoading && icon && <span aria-hidden="true">{icon}</span>}

      {/* Button text */}
      {children}

      {/* Right icon */}
      {!isLoading && iconRight && <span aria-hidden="true">{iconRight}</span>}
    </button>
  );
}
