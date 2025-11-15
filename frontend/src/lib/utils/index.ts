/**
 * Utility Functions for Hotel AI Booking Chatbot
 *
 * Provides:
 * - Date formatting and manipulation
 * - Currency formatting (Thai Baht)
 * - Form validation helpers
 * - String utilities
 *
 * @module lib/utils
 */

import { format, parseISO, differenceInDays, addDays, isAfter, isBefore } from 'date-fns';

// =============================================================================
// DATE UTILITIES
// =============================================================================

/**
 * Format ISO date string to readable format.
 *
 * @param isoDate - ISO 8601 date string
 * @param formatString - date-fns format string (default: 'MMM d, yyyy')
 * @returns Formatted date string
 *
 * @example
 * formatDate('2025-01-15') // "Jan 15, 2025"
 */
export function formatDate(isoDate: string, formatString: string = 'MMM d, yyyy'): string {
  try {
    return format(parseISO(isoDate), formatString);
  } catch (error) {
    console.error('Invalid date format:', isoDate, error);
    return isoDate;
  }
}

/**
 * Calculate number of nights between check-in and check-out dates.
 *
 * @param checkIn - Check-in date (ISO 8601)
 * @param checkOut - Check-out date (ISO 8601)
 * @returns Number of nights
 */
export function calculateNights(checkIn: string, checkOut: string): number {
  try {
    return differenceInDays(parseISO(checkOut), parseISO(checkIn));
  } catch (error) {
    console.error('Error calculating nights:', error);
    return 0;
  }
}

/**
 * Get today's date in ISO format (YYYY-MM-DD).
 */
export function getTodayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Get tomorrow's date in ISO format.
 */
export function getTomorrowISO(): string {
  return format(addDays(new Date(), 1), 'yyyy-MM-dd');
}

/**
 * Check if a date is in the past.
 */
export function isDatePast(isoDate: string): boolean {
  try {
    return isBefore(parseISO(isoDate), new Date());
  } catch (error) {
    return false;
  }
}

/**
 * Check if a date is in the future.
 */
export function isDateFuture(isoDate: string): boolean {
  try {
    return isAfter(parseISO(isoDate), new Date());
  } catch (error) {
    return false;
  }
}

// =============================================================================
// CURRENCY UTILITIES
// =============================================================================

/**
 * Format number as Thai Baht currency.
 *
 * @param amount - Amount in THB
 * @param includeSymbol - Whether to include ฿ symbol (default: true)
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(12500) // "฿12,500.00"
 * formatCurrency(12500, false) // "12,500.00"
 */
export function formatCurrency(amount: number, includeSymbol: boolean = true): string {
  const formatted = new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return includeSymbol ? `฿${formatted}` : formatted;
}

/**
 * Calculate total price for booking.
 *
 * @param pricePerNight - Room price per night
 * @param nights - Number of nights
 * @returns Total price
 */
export function calculateTotalPrice(pricePerNight: number, nights: number): number {
  return pricePerNight * nights;
}

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Validate email format.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Thai format).
 * Accepts: 0812345678, 081-234-5678, +66812345678
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+66|0)[0-9]{8,9}$/;
  const cleaned = phone.replace(/[-\s]/g, '');
  return phoneRegex.test(cleaned);
}

/**
 * Validate password strength.
 * Requires: min 8 characters, at least one letter and one number
 */
export function isValidPassword(password: string): boolean {
  if (password.length < 8) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLetter && hasNumber;
}

/**
 * Get password strength level.
 */
export function getPasswordStrength(
  password: string
): 'weak' | 'medium' | 'strong' | 'very-strong' {
  if (password.length < 8) return 'weak';

  let score = 0;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;

  if (score <= 2) return 'weak';
  if (score === 3) return 'medium';
  if (score === 4) return 'strong';
  return 'very-strong';
}

// =============================================================================
// STRING UTILITIES
// =============================================================================

/**
 * Capitalize first letter of string.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate string to specified length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Convert string to URL-friendly slug.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// =============================================================================
// NUMBER UTILITIES
// =============================================================================

/**
 * Clamp number between min and max values.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate random integer between min and max (inclusive).
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// =============================================================================
// OBJECT UTILITIES
// =============================================================================

/**
 * Deep clone an object.
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if object is empty.
 */
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

// =============================================================================
// CLASS NAME UTILITIES
// =============================================================================

/**
 * Conditionally join class names.
 *
 * @example
 * cn('base', isActive && 'active', 'extra') // "base active extra"
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
