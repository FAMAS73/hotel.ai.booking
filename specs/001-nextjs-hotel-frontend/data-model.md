# Data Model: Next.js Hotel Frontend Website

**Feature**: Next.js Hotel Frontend Website
**Branch**: `001-nextjs-hotel-frontend`
**Created**: 2025-01-15
**Purpose**: Define TypeScript interfaces for all frontend data entities

## Overview

This document defines all TypeScript interfaces and types used throughout the Next.js frontend application. These types ensure type safety, improve code clarity for thesis demonstration, and serve as contracts between components and API responses.

---

## Core Entities

### Guest (User)

Represents an authenticated guest or admin user with booking history and profile information.

```typescript
/**
 * Guest represents an authenticated user of the hotel booking system.
 * Used for both regular guests and admin users (distinguished by role).
 */
export interface Guest {
  /** Unique identifier for the guest */
  id: number;
  
  /** Guest's email address (used for login and communication) */
  email: string;
  
  /** Guest's full name */
  name: string;
  
  /** Guest's phone number (optional) */
  phone?: string;
  
  /** User role: 'guest' for regular users, 'admin' for dashboard access */
  role: 'guest' | 'admin';
  
  /** Total number of bookings made by this guest */
  booking_count: number;
  
  /** Whether the guest is currently authenticated in the session */
  is_authenticated: boolean;
  
  /** Account creation timestamp (ISO 8601) */
  created_at: string;
  
  /** Last login timestamp (ISO 8601) */
  last_login?: string;
}

/**
 * GuestProfile is a subset of Guest used for profile display and updates.
 * Does not include authentication status or timestamps.
 */
export interface GuestProfile {
  id: number;
  email: string;
  name: string;
  phone?: string;
  booking_count: number;
}

/**
 * GuestRegistration represents the data submitted when creating a new account.
 */
export interface GuestRegistration {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

/**
 * GuestLogin represents the credentials submitted for authentication.
 */
export interface GuestLogin {
  email: string;
  password: string;
}
```

---

### Room

Represents a hotel room type with availability, pricing, amenities, and images.

```typescript
/**
 * Room represents a room type in the hotel catalog.
 * Each room type (Standard, Deluxe, Suite, etc.) is a distinct record.
 */
export interface Room {
  /** Unique identifier for the room type */
  id: number;
  
  /** Room type category */
  type: 'Standard' | 'Deluxe' | 'Suite' | 'Executive' | 'Presidential';
  
  /** Display name for the room */
  name: string;
  
  /** Detailed description of the room */
  description: string;
  
  /** Base price per night in Thai Baht (THB) */
  base_price: number;
  
  /** Maximum number of guests allowed */
  capacity: number;
  
  /** Room size in square meters */
  size_sqm: number;
  
  /** List of amenities included with the room */
  amenities: RoomAmenity[];
  
  /** Array of image URLs for the room gallery */
  images: RoomImage[];
  
  /** Current availability status */
  availability_status: 'Available' | 'Limited' | 'Sold Out';
  
  /** Number of rooms of this type available for selected dates */
  available_count?: number;
  
  /** Featured image URL (primary image for catalog cards) */
  featured_image: string;
  
  /** BlurHash string for image placeholder while loading */
  blur_hash?: string;
}

/**
 * RoomAmenity represents a single amenity or feature of a room.
 */
export interface RoomAmenity {
  /** Amenity identifier */
  id: string;
  
  /** Display name for the amenity */
  name: string;
  
  /** Icon identifier (for mapping to icon components) */
  icon: string;
  
  /** Category for grouping amenities (e.g., 'Technology', 'Comfort') */
  category: 'Technology' | 'Comfort' | 'View' | 'Bathroom' | 'Entertainment' | 'Other';
}

/**
 * RoomImage represents a single image in a room's gallery.
 */
export interface RoomImage {
  /** Image URL path */
  url: string;
  
  /** Alt text for accessibility */
  alt: string;
  
  /** Caption or description of the image */
  caption?: string;
  
  /** Display order in gallery */
  order: number;
  
  /** Image dimensions for Next.js Image component */
  width: number;
  height: number;
}

/**
 * RoomFilter represents the filter criteria for room catalog searches.
 */
export interface RoomFilter {
  /** Check-in date (ISO 8601 date string) */
  check_in?: string;
  
  /** Check-out date (ISO 8601 date string) */
  check_out?: string;
  
  /** Number of guests */
  guests?: number;
  
  /** Minimum price per night */
  min_price?: number;
  
  /** Maximum price per night */
  max_price?: number;
  
  /** Required amenities (filter only rooms with ALL these amenities) */
  amenities?: string[];
  
  /** Room types to include */
  room_types?: Room['type'][];
}
```

---

### Booking

Represents a reservation made by a guest with dates, room type, pricing, and status.

```typescript
/**
 * Booking represents a hotel room reservation.
 * Used for guest booking history and admin dashboard management.
 */
export interface Booking {
  /** Unique booking identifier */
  id: number;
  
  /** Guest ID who made the booking */
  guest_id: number;
  
  /** Guest information (nested for display purposes) */
  guest: GuestProfile;
  
  /** Room type booked */
  room_type: Room['type'];
  
  /** Room details (nested for display purposes) */
  room: Partial<Room>;
  
  /** Check-in date (ISO 8601 date string) */
  check_in: string;
  
  /** Check-out date (ISO 8601 date string) */
  check_out: string;
  
  /** Number of nights (calculated from dates) */
  nights: number;
  
  /** Number of guests */
  guests_count: number;
  
  /** Base room price (price per night at time of booking) */
  room_price: number;
  
  /** Total booking amount in THB */
  total_amount: number;
  
  /** Booking status */
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  
  /** Special requests from guest */
  special_requests?: string;
  
  /** Cancellation reason (if status is 'Cancelled') */
  cancellation_reason?: string;
  
  /** Booking creation timestamp (ISO 8601) */
  created_at: string;
  
  /** Last update timestamp (ISO 8601) */
  updated_at: string;
  
  /** Payment status */
  payment_status: 'Pending' | 'Paid' | 'Refunded';
}

/**
 * BookingCreate represents the data required to create a new booking.
 */
export interface BookingCreate {
  room_type: Room['type'];
  check_in: string;
  check_out: string;
  guests_count: number;
  special_requests?: string;
}

/**
 * BookingUpdate represents fields that can be updated on an existing booking.
 */
export interface BookingUpdate {
  special_requests?: string;
  status?: Booking['status'];
  cancellation_reason?: string;
}

/**
 * BookingCancellation represents the data required to cancel a booking.
 */
export interface BookingCancellation {
  booking_id: number;
  cancellation_reason: string;
}
```

---

### Chat Session and Messages

Represents chat conversations between guests and the AI chatbot.

```typescript
/**
 * ChatSession represents a conversation instance between a guest and the AI.
 * Sessions maintain conversation history and context.
 */
export interface ChatSession {
  /** Unique session identifier */
  id: string;
  
  /** Guest ID (null for anonymous sessions) */
  guest_id?: number;
  
  /** Session title (auto-generated from first message or user-set) */
  title: string;
  
  /** All messages in the session */
  messages: ChatMessage[];
  
  /** Session creation timestamp (ISO 8601) */
  created_at: string;
  
  /** Last activity timestamp (ISO 8601) */
  last_activity: string;
  
  /** Whether the session is currently active */
  is_active: boolean;
  
  /** Total message count in session */
  message_count: number;
}

/**
 * ChatMessage represents a single message in a chat session.
 */
export interface ChatMessage {
  /** Unique message identifier */
  id: string;
  
  /** Session ID this message belongs to */
  session_id: string;
  
  /** Message sender role */
  role: 'user' | 'assistant' | 'system';
  
  /** Message content (plain text or formatted) */
  content: string;
  
  /** Rich content type (if message includes structured data) */
  content_type: 'text' | 'room_list' | 'booking_info' | 'error';
  
  /** Structured data for rich content rendering */
  metadata?: ChatMessageMetadata;
  
  /** Message creation timestamp (ISO 8601) */
  timestamp: string;
  
  /** Whether the message is being streamed (typing indicator) */
  is_streaming?: boolean;
}

/**
 * ChatMessageMetadata provides structured data for rich message rendering.
 */
export interface ChatMessageMetadata {
  /** Room information for room_list content type */
  rooms?: Partial<Room>[];
  
  /** Booking information for booking_info content type */
  booking?: Partial<Booking>;
  
  /** Error details for error content type */
  error?: {
    code: string;
    message: string;
  };
  
  /** Bangkok concierge recommendations */
  recommendations?: {
    name: string;
    category: string;
    description: string;
    location?: string;
  }[];
}

/**
 * ChatMessageCreate represents the data required to send a new message.
 */
export interface ChatMessageCreate {
  session_id?: string; // If null, creates new session
  content: string;
}

/**
 * ChatResponse represents the API response when sending a message.
 */
export interface ChatResponse {
  session_id: string;
  message: ChatMessage;
  session_created: boolean; // True if a new session was created
}
```

---

### Theme Preference

Represents user's visual theme preference (light or dark mode).

```typescript
/**
 * ThemePreference represents the user's visual theme choice.
 * Stored in localStorage for persistence across sessions.
 */
export interface ThemePreference {
  /** Theme mode */
  theme: 'light' | 'dark' | 'system';
  
  /** Last update timestamp (ISO 8601) */
  last_updated: string;
}

/**
 * ThemeConfig defines the color palette and styling for each theme mode.
 */
export interface ThemeConfig {
  mode: 'light' | 'dark';
  colors: {
    bg: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    accent: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    border: string;
  };
}
```

---

### Admin Dashboard Data

Represents metrics, statistics, and management data for the admin dashboard.

```typescript
/**
 * AdminDashboardStats represents the summary statistics shown on the dashboard.
 */
export interface AdminDashboardStats {
  /** Total number of bookings (all statuses) */
  total_bookings: number;
  
  /** Number of confirmed bookings */
  confirmed_bookings: number;
  
  /** Number of completed bookings */
  completed_bookings: number;
  
  /** Number of cancelled bookings */
  cancelled_bookings: number;
  
  /** Current occupancy rate (percentage) */
  occupancy_rate: number;
  
  /** Total revenue in THB */
  total_revenue: number;
  
  /** Revenue for current month */
  monthly_revenue: number;
  
  /** Average booking value */
  average_booking_value: number;
  
  /** Number of unique guests */
  unique_guests: number;
  
  /** Bookings by room type distribution */
  bookings_by_room_type: RoomTypeDistribution[];
  
  /** Recent bookings (last 10) */
  recent_bookings: Booking[];
  
  /** Occupancy trend over last 30 days */
  occupancy_trend: OccupancyDataPoint[];
  
  /** Revenue trend over last 12 months */
  revenue_trend: RevenueDataPoint[];
  
  /** Last updated timestamp (ISO 8601) */
  last_updated: string;
}

/**
 * RoomTypeDistribution represents booking count and revenue by room type.
 */
export interface RoomTypeDistribution {
  room_type: Room['type'];
  booking_count: number;
  revenue: number;
  percentage: number; // Percentage of total bookings
}

/**
 * OccupancyDataPoint represents occupancy rate for a specific date.
 */
export interface OccupancyDataPoint {
  date: string; // ISO 8601 date
  occupancy_rate: number; // Percentage
  rooms_occupied: number;
  rooms_total: number;
}

/**
 * RevenueDataPoint represents revenue for a specific period.
 */
export interface RevenueDataPoint {
  period: string; // 'YYYY-MM' for monthly data
  revenue: number; // Total revenue in THB
  booking_count: number;
}

/**
 * BookingTableRow represents a booking in the admin bookings table.
 * Extends Booking with additional display fields.
 */
export interface BookingTableRow extends Booking {
  /** Formatted check-in date (e.g., 'Jan 15, 2025') */
  formatted_check_in: string;
  
  /** Formatted check-out date */
  formatted_check_out: string;
  
  /** Formatted total amount (e.g., '฿12,500.00') */
  formatted_total: string;
  
  /** Status badge color */
  status_color: 'green' | 'blue' | 'gray' | 'red';
}
```

---

## API Response Types

### Generic API Responses

```typescript
/**
 * ApiResponse represents a successful API response.
 */
export interface ApiResponse<T> {
  /** Response data */
  data: T;
  
  /** Success message */
  message?: string;
  
  /** HTTP status code */
  status: number;
  
  /** Response timestamp (ISO 8601) */
  timestamp: string;
}

/**
 * ApiError represents an error response from the API.
 */
export interface ApiError {
  /** Error message */
  error: string;
  
  /** Error code */
  code: string;
  
  /** HTTP status code */
  status: number;
  
  /** Additional error details */
  details?: Record<string, unknown>;
  
  /** Error timestamp (ISO 8601) */
  timestamp: string;
}

/**
 * PaginatedResponse represents a paginated API response.
 */
export interface PaginatedResponse<T> {
  /** Array of items for current page */
  items: T[];
  
  /** Total number of items across all pages */
  total: number;
  
  /** Current page number (1-indexed) */
  page: number;
  
  /** Number of items per page */
  page_size: number;
  
  /** Total number of pages */
  total_pages: number;
  
  /** Whether there is a next page */
  has_next: boolean;
  
  /** Whether there is a previous page */
  has_previous: boolean;
}
```

### Authentication Responses

```typescript
/**
 * AuthResponse represents the response from login/register endpoints.
 */
export interface AuthResponse {
  /** Authenticated guest information */
  guest: Guest;
  
  /** JWT access token (may be in httpOnly cookie instead) */
  access_token?: string;
  
  /** JWT refresh token (may be in httpOnly cookie instead) */
  refresh_token?: string;
  
  /** Token type (always 'Bearer') */
  token_type: 'Bearer';
  
  /** Token expiry time in seconds */
  expires_in: number;
}

/**
 * TokenRefreshResponse represents the response from token refresh endpoint.
 */
export interface TokenRefreshResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
}
```

---

## Form Validation Types

```typescript
/**
 * ValidationError represents a validation error for a form field.
 */
export interface ValidationError {
  /** Field name that has the error */
  field: string;
  
  /** Error message */
  message: string;
  
  /** Validation rule that failed */
  rule: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
}

/**
 * FormState represents the state of a form during submission.
 */
export interface FormState<T> {
  /** Form field values */
  values: T;
  
  /** Validation errors (keyed by field name) */
  errors: Record<keyof T, string>;
  
  /** Whether the form is currently submitting */
  isSubmitting: boolean;
  
  /** Whether the form has been submitted at least once */
  isSubmitted: boolean;
  
  /** Whether the form is valid (no errors) */
  isValid: boolean;
}
```

---

## Utility Types

```typescript
/**
 * DateRange represents a date range selection.
 */
export interface DateRange {
  /** Start date (ISO 8601 date string) */
  start: string;
  
  /** End date (ISO 8601 date string) */
  end: string;
  
  /** Number of days in the range */
  days: number;
}

/**
 * SelectOption represents an option in a select/dropdown component.
 */
export interface SelectOption<T = string> {
  /** Display label */
  label: string;
  
  /** Option value */
  value: T;
  
  /** Whether the option is disabled */
  disabled?: boolean;
  
  /** Optional icon identifier */
  icon?: string;
}

/**
 * LoadingState represents the loading state for async operations.
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * AsyncState represents the full state of an async operation.
 */
export interface AsyncState<T> {
  /** Current state */
  status: LoadingState;
  
  /** Data (available when status is 'success') */
  data?: T;
  
  /** Error (available when status is 'error') */
  error?: ApiError;
  
  /** Whether the operation is currently loading */
  isLoading: boolean;
  
  /** Whether the operation succeeded */
  isSuccess: boolean;
  
  /** Whether the operation failed */
  isError: boolean;
}
```

---

## Type Guards

```typescript
/**
 * Type guard to check if a response is an ApiError.
 */
export function isApiError(response: unknown): response is ApiError {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    'code' in response &&
    'status' in response
  );
}

/**
 * Type guard to check if a guest has admin role.
 */
export function isAdmin(guest: Guest): boolean {
  return guest.role === 'admin';
}

/**
 * Type guard to check if a booking can be cancelled.
 */
export function isCancellable(booking: Booking): boolean {
  return booking.status === 'Confirmed' || booking.status === 'Pending';
}

/**
 * Type guard to check if a room is available.
 */
export function isRoomAvailable(room: Room): boolean {
  return room.availability_status === 'Available' || room.availability_status === 'Limited';
}
```

---

## Enums and Constants

```typescript
/**
 * RoomType enum for type-safe room type references.
 */
export enum RoomType {
  Standard = 'Standard',
  Deluxe = 'Deluxe',
  Suite = 'Suite',
  Executive = 'Executive',
  Presidential = 'Presidential',
}

/**
 * BookingStatus enum for type-safe status references.
 */
export enum BookingStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

/**
 * PaymentStatus enum for type-safe payment status references.
 */
export enum PaymentStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  Refunded = 'Refunded',
}

/**
 * UserRole enum for type-safe role references.
 */
export enum UserRole {
  Guest = 'guest',
  Admin = 'admin',
}

/**
 * API endpoint constants.
 */
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
  PROFILE: '/api/auth/profile',
  
  // Rooms
  ROOMS: '/api/rooms',
  ROOM_DETAIL: (id: number) => `/api/rooms/${id}`,
  
  // Bookings
  BOOKINGS: '/api/bookings',
  BOOKING_DETAIL: (id: number) => `/api/bookings/${id}`,
  BOOKING_CANCEL: (id: number) => `/api/bookings/${id}/cancel`,
  
  // Chat
  CHAT_SEND: '/api/chat/send',
  CHAT_SESSIONS: '/api/chat/sessions',
  CHAT_SESSION_DETAIL: (id: string) => `/api/chat/sessions/${id}`,
  
  // Admin
  ADMIN_DASHBOARD: '/api/admin/dashboard',
  ADMIN_BOOKINGS: '/api/admin/bookings',
} as const;
```

---

## Export All Types

```typescript
// Export all types from a central types/index.ts file
export type {
  // Core entities
  Guest,
  GuestProfile,
  GuestRegistration,
  GuestLogin,
  Room,
  RoomAmenity,
  RoomImage,
  RoomFilter,
  Booking,
  BookingCreate,
  BookingUpdate,
  BookingCancellation,
  ChatSession,
  ChatMessage,
  ChatMessageMetadata,
  ChatMessageCreate,
  ChatResponse,
  ThemePreference,
  ThemeConfig,
  AdminDashboardStats,
  RoomTypeDistribution,
  OccupancyDataPoint,
  RevenueDataPoint,
  BookingTableRow,
  
  // API responses
  ApiResponse,
  ApiError,
  PaginatedResponse,
  AuthResponse,
  TokenRefreshResponse,
  
  // Form validation
  ValidationError,
  FormState,
  
  // Utility types
  DateRange,
  SelectOption,
  LoadingState,
  AsyncState,
};

export {
  // Enums
  RoomType,
  BookingStatus,
  PaymentStatus,
  UserRole,
  
  // Constants
  API_ENDPOINTS,
  
  // Type guards
  isApiError,
  isAdmin,
  isCancellable,
  isRoomAvailable,
};
```

---

## Notes for Implementation

1. **TypeScript Strict Mode**: All interfaces assume `strict: true` in tsconfig.json
2. **Optional Fields**: Use `?` for optional fields; never use `| null` unless explicitly needed
3. **Dates**: Always use ISO 8601 string format for date fields, not Date objects
4. **Numbers**: Use `number` type for all numeric values (IDs, prices, counts)
5. **Enums**: Prefer string literal unions over enums for better type inference
6. **Null Safety**: Use optional chaining (`?.`) and nullish coalescing (`??`) throughout
7. **API Alignment**: All types align with backend API response structures
8. **Thesis Demonstration**: Inline comments explain purpose and usage for academic review

---

**Data Model Version**: 1.0.0
**Last Updated**: 2025-01-15
**Status**: Ready for implementation
