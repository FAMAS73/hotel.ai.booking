# API Client Contract: Backend Integration

**Feature**: Next.js Hotel Frontend Website
**Branch**: `001-nextjs-hotel-frontend`
**Created**: 2025-01-15
**Purpose**: Document all backend API endpoints consumed by the frontend

## Overview

This contract defines all REST API endpoints that the Next.js frontend will call on the FastAPI backend. Each endpoint includes the HTTP method, URL, request/response formats, authentication requirements, and error scenarios.

**Base URL**: Configured via `NEXT_PUBLIC_API_URL` environment variable
- Development: `http://localhost:8000`
- Production: Set via Docker environment

---

## Authentication Endpoints

### POST /api/auth/register

Create a new guest account.

**Authentication**: None required

**Request Body**:
```typescript
{
  email: string;        // Valid email format
  password: string;     // Minimum 8 characters
  name: string;         // Full name
  phone?: string;       // Optional phone number
}
```

**Success Response** (201 Created):
```typescript
{
  guest: Guest;
  access_token: string;      // JWT token (or set in httpOnly cookie)
  refresh_token: string;     // Refresh token (or set in httpOnly cookie)
  token_type: "Bearer";
  expires_in: number;        // Seconds until token expiry
}
```

**Error Responses**:
- `400 Bad Request`: Invalid email format, weak password, missing required fields
- `409 Conflict`: Email already registered

**Frontend Usage**:
```typescript
// lib/api/auth.ts
export async function register(data: GuestRegistration): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Include cookies
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw await response.json();
  }
  
  return response.json();
}
```

---

### POST /api/auth/login

Authenticate a guest and receive tokens.

**Authentication**: None required

**Request Body**:
```typescript
{
  email: string;
  password: string;
}
```

**Success Response** (200 OK):
```typescript
{
  guest: Guest;
  access_token: string;
  refresh_token: string;
  token_type: "Bearer";
  expires_in: number;
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid credentials
- `400 Bad Request`: Missing email or password

**Frontend Usage**:
```typescript
export async function login(data: GuestLogin): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw await response.json();
  }
  
  return response.json();
}
```

---

### POST /api/auth/logout

Invalidate current session and tokens.

**Authentication**: Required (Bearer token)

**Request Body**: None

**Success Response** (200 OK):
```typescript
{
  message: "Logged out successfully";
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or expired token

---

### POST /api/auth/refresh

Refresh access token using refresh token.

**Authentication**: Required (Refresh token in cookie or header)

**Request Body**: None (refresh token sent via httpOnly cookie)

**Success Response** (200 OK):
```typescript
{
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or expired refresh token

---

### GET /api/auth/profile

Get current authenticated guest profile.

**Authentication**: Required (Bearer token)

**Request Parameters**: None

**Success Response** (200 OK):
```typescript
{
  guest: Guest;
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or expired token

---

## Room Catalog Endpoints

### GET /api/rooms

Retrieve all room types with optional availability filtering.

**Authentication**: None required (public endpoint)

**Query Parameters**:
```typescript
{
  check_in?: string;      // ISO 8601 date (YYYY-MM-DD)
  check_out?: string;     // ISO 8601 date (YYYY-MM-DD)
  guests?: number;        // Number of guests (default: 2)
  min_price?: number;     // Minimum price per night
  max_price?: number;     // Maximum price per night
  amenities?: string[];   // Filter by amenities (comma-separated)
}
```

**Success Response** (200 OK):
```typescript
{
  rooms: Room[];
  filters_applied: {
    check_in?: string;
    check_out?: string;
    guests?: number;
    min_price?: number;
    max_price?: number;
    amenities?: string[];
  };
  total_count: number;
}
```

**Error Responses**:
- `400 Bad Request`: Invalid date format, check_in after check_out

**Frontend Usage**:
```typescript
// lib/hooks/useRooms.ts
export function useRooms(filter?: RoomFilter) {
  const params = new URLSearchParams();
  if (filter?.check_in) params.append('check_in', filter.check_in);
  if (filter?.check_out) params.append('check_out', filter.check_out);
  if (filter?.guests) params.append('guests', filter.guests.toString());
  
  const { data, error, isLoading } = useSWR(
    `/api/rooms?${params}`,
    fetcher,
    { refreshInterval: 30000 } // Refresh every 30s for availability
  );
  
  return { rooms: data?.rooms, isLoading, error };
}
```

---

### GET /api/rooms/:id

Get detailed information for a specific room type.

**Authentication**: None required

**Path Parameters**:
- `id`: Room type ID (number)

**Success Response** (200 OK):
```typescript
{
  room: Room;
  availability: {
    available_count: number;
    next_available_date?: string; // If currently sold out
  };
}
```

**Error Responses**:
- `404 Not Found`: Room type not found

---

## Booking Endpoints

### POST /api/bookings

Create a new booking.

**Authentication**: Required (Bearer token)

**Request Body**:
```typescript
{
  room_type: "Standard" | "Deluxe" | "Suite" | "Executive" | "Presidential";
  check_in: string;        // ISO 8601 date
  check_out: string;       // ISO 8601 date
  guests_count: number;
  special_requests?: string;
}
```

**Success Response** (201 Created):
```typescript
{
  booking: Booking;
  message: "Booking created successfully";
}
```

**Error Responses**:
- `400 Bad Request`: Invalid dates, guests exceed capacity, room unavailable
- `401 Unauthorized`: Not authenticated
- `409 Conflict`: Room not available for selected dates

**Frontend Usage**:
```typescript
export async function createBooking(data: BookingCreate): Promise<Booking> {
  const token = useAuthStore.getState().token;
  
  const response = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw await response.json();
  }
  
  const result = await response.json();
  return result.booking;
}
```

---

### GET /api/bookings

Get all bookings for the authenticated guest.

**Authentication**: Required (Bearer token)

**Query Parameters**:
```typescript
{
  status?: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  page?: number;           // Default: 1
  page_size?: number;      // Default: 20
  sort?: "date_asc" | "date_desc"; // Default: date_desc
}
```

**Success Response** (200 OK):
```typescript
{
  bookings: Booking[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated

---

### GET /api/bookings/:id

Get details for a specific booking.

**Authentication**: Required (Bearer token, must own booking or be admin)

**Path Parameters**:
- `id`: Booking ID (number)

**Success Response** (200 OK):
```typescript
{
  booking: Booking;
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Booking belongs to another guest
- `404 Not Found`: Booking not found

---

### POST /api/bookings/:id/cancel

Cancel an existing booking.

**Authentication**: Required (Bearer token, must own booking)

**Path Parameters**:
- `id`: Booking ID (number)

**Request Body**:
```typescript
{
  cancellation_reason: string;
}
```

**Success Response** (200 OK):
```typescript
{
  booking: Booking; // Updated booking with status "Cancelled"
  message: "Booking cancelled successfully";
}
```

**Error Responses**:
- `400 Bad Request`: Booking cannot be cancelled (already completed/cancelled)
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Booking belongs to another guest
- `404 Not Found`: Booking not found

---

## Chat Endpoints

### POST /api/chat/send

Send a message to the AI chatbot and receive a response.

**Authentication**: Optional (guest_id included if authenticated)

**Request Body**:
```typescript
{
  session_id?: string;    // Null to create new session
  content: string;        // User message
}
```

**Success Response** (200 OK):
```typescript
{
  session_id: string;
  message: ChatMessage;   // AI response
  session_created: boolean;
}
```

**Error Responses**:
- `400 Bad Request`: Empty message content
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: AI service unavailable

**Frontend Usage**:
```typescript
export async function sendMessage(data: ChatMessageCreate): Promise<ChatResponse> {
  const token = useAuthStore.getState().token;
  
  const response = await fetch(`${API_BASE_URL}/api/chat/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw await response.json();
  }
  
  return response.json();
}
```

---

### GET /api/chat/sessions

Get all chat sessions for authenticated guest.

**Authentication**: Required (Bearer token)

**Query Parameters**:
```typescript
{
  page?: number;        // Default: 1
  page_size?: number;   // Default: 20
}
```

**Success Response** (200 OK):
```typescript
{
  sessions: ChatSession[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated

---

### GET /api/chat/sessions/:id

Get all messages for a specific chat session.

**Authentication**: Required (Bearer token, must own session)

**Path Parameters**:
- `id`: Session ID (string/UUID)

**Success Response** (200 OK):
```typescript
{
  session: ChatSession;
  messages: ChatMessage[];
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Session belongs to another guest
- `404 Not Found`: Session not found

---

## Admin Dashboard Endpoints

### GET /api/admin/dashboard

Get dashboard statistics and metrics.

**Authentication**: Required (Bearer token, admin role only)

**Query Parameters**: None

**Success Response** (200 OK):
```typescript
{
  stats: AdminDashboardStats;
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin user

**Frontend Usage**:
```typescript
// lib/hooks/useAdminDashboard.ts
export function useAdminDashboard() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/admin/dashboard',
    authenticatedFetcher,
    {
      refreshInterval: 5000, // Poll every 5 seconds
      revalidateOnFocus: true,
    }
  );
  
  return {
    stats: data?.stats,
    isLoading,
    error,
    refresh: mutate, // Manual refresh
  };
}
```

---

### GET /api/admin/bookings

Get all bookings with admin filters.

**Authentication**: Required (Bearer token, admin role only)

**Query Parameters**:
```typescript
{
  status?: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  room_type?: "Standard" | "Deluxe" | "Suite" | "Executive" | "Presidential";
  start_date?: string;    // Filter by check-in date >= this
  end_date?: string;      // Filter by check-in date <= this
  search?: string;        // Search by guest name, email, or booking ID
  page?: number;
  page_size?: number;
  sort?: "date_asc" | "date_desc" | "amount_asc" | "amount_desc";
}
```

**Success Response** (200 OK):
```typescript
{
  bookings: Booking[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
  filters_applied: Record<string, unknown>;
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin user

---

### PUT /api/admin/bookings/:id

Update a booking (admin only).

**Authentication**: Required (Bearer token, admin role only)

**Path Parameters**:
- `id`: Booking ID (number)

**Request Body**:
```typescript
{
  status?: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  special_requests?: string;
  cancellation_reason?: string;
}
```

**Success Response** (200 OK):
```typescript
{
  booking: Booking;
  message: "Booking updated successfully";
}
```

**Error Responses**:
- `400 Bad Request`: Invalid status transition
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin user
- `404 Not Found`: Booking not found

---

## Error Response Format

All error responses follow a consistent format:

```typescript
{
  error: string;          // Human-readable error message
  code: string;           // Machine-readable error code (e.g., "INVALID_CREDENTIALS")
  status: number;         // HTTP status code
  details?: {             // Optional additional error details
    field?: string;       // Field that caused validation error
    constraint?: string;  // Constraint that was violated
  };
  timestamp: string;      // ISO 8601 timestamp
}
```

**Common Error Codes**:
- `UNAUTHORIZED`: Not authenticated or token expired
- `FORBIDDEN`: Authenticated but lacks permission
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Request validation failed
- `CONFLICT`: Resource conflict (e.g., email already exists)
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

---

## HTTP Client Configuration

### Base Configuration

```typescript
// lib/api/client.ts
import { useAuthStore } from '@/lib/stores/authStore';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Authenticated fetch wrapper that includes JWT token.
 */
export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = useAuthStore.getState().token;
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: 'include', // Include cookies for httpOnly tokens
  });
  
  // Handle 401 Unauthorized - attempt token refresh
  if (response.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      // Retry original request with new token
      return authenticatedFetch(endpoint, options);
    } else {
      // Refresh failed, logout user
      useAuthStore.getState().logout();
      throw new Error('Session expired, please login again');
    }
  }
  
  return response;
}

/**
 * Token refresh logic.
 */
async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      useAuthStore.getState().setToken(data.access_token);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * SWR fetcher with authentication.
 */
export async function swrFetcher<T>(url: string): Promise<T> {
  const response = await authenticatedFetch(url);
  
  if (!response.ok) {
    throw await response.json();
  }
  
  return response.json();
}
```

---

## Rate Limiting

All endpoints implement rate limiting to prevent abuse:

**Limits**:
- Authentication endpoints: 5 requests per minute per IP
- Chat endpoints: 20 messages per minute per session
- Booking creation: 10 requests per hour per user
- General API endpoints: 100 requests per minute per user

**Rate Limit Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642345678
```

**Rate Limit Exceeded Response** (429):
```typescript
{
  error: "Rate limit exceeded";
  code: "RATE_LIMIT_EXCEEDED";
  status: 429;
  details: {
    limit: 100;
    reset_at: "2025-01-15T12:00:00Z";
  };
}
```

---

## CORS Configuration

**Backend CORS Settings**:
```python
# Allows frontend to make requests from different origin
ALLOWED_ORIGINS = [
  "http://localhost:3000",  # Development
  "http://frontend:3000",   # Docker
  "https://hotel.example.com" # Production
]

ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
ALLOWED_HEADERS = ["Content-Type", "Authorization"]
ALLOW_CREDENTIALS = True  # For cookies
```

---

## Testing Endpoints

During development, use these strategies for testing API integration:

1. **Mock API Responses** (for offline development):
```typescript
// lib/api/__mocks__/rooms.ts
export const mockRooms: Room[] = [ /* mock data */ ];
```

2. **API Mocking with MSW** (Mock Service Worker):
```typescript
// tests/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/rooms', (req, res, ctx) => {
    return res(ctx.json({ rooms: mockRooms }));
  }),
];
```

3. **Swagger/OpenAPI Documentation**: Backend provides Swagger UI at `http://localhost:8000/docs` for manual testing

---

**Contract Version**: 1.0.0
**Last Updated**: 2025-01-15
**Status**: Ready for implementation
