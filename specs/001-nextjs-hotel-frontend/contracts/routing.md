# Routing Contract: Next.js App Router

**Feature**: Next.js Hotel Frontend Website
**Branch**: `001-nextjs-hotel-frontend`
**Created**: 2025-01-15
**Purpose**: Document all routes, page components, layouts, and navigation structure

## Overview

This contract defines the complete routing structure using Next.js 15 App Router. All routes, their purposes, authentication requirements, and component hierarchies are documented.

**Routing Strategy**: File-system based routing with Next.js App Router

---

## Route Structure

### Public Routes

Routes accessible to all users without authentication.

#### `/` - Home / Landing Page

**File**: `app/page.tsx`

**Purpose**: Hotel landing page with hero section, featured rooms, and call-to-action.

**Layout**: Uses root layout with header and footer.

**Authentication**: Not required

**Props**: None (server component)

**Features**:
- Hero section with hotel image and tagline
- Quick date search widget
- Featured rooms carousel
- Amenities showcase
- Testimonials section
- Call-to-action for booking

**SEO Metadata**:
```typescript
export const metadata: Metadata = {
  title: 'Bangkok Hotel - Luxury Accommodation with AI Concierge',
  description: 'Experience world-class hospitality with our AI-powered concierge service. Book your stay in Bangkok today.',
  keywords: 'hotel, Bangkok, luxury, accommodation, AI concierge',
};
```

**Component Structure**:
```tsx
// app/page.tsx (Server Component)
import { HeroSection } from '@/components/home/HeroSection';
import { QuickSearch } from '@/components/home/QuickSearch';
import { FeaturedRooms } from '@/components/home/FeaturedRooms';
import { Amenities } from '@/components/home/Amenities';

export default async function HomePage() {
  // Fetch featured rooms on server
  const rooms = await fetch(`${API_URL}/api/rooms?featured=true`).then(r => r.json());
  
  return (
    <main>
      <HeroSection />
      <QuickSearch />
      <FeaturedRooms rooms={rooms} />
      <Amenities />
    </main>
  );
}
```

---

#### `/chat` - Chat Interface

**File**: `app/chat/page.tsx`

**Purpose**: Full-page AI chatbot interface for guest inquiries.

**Layout**: Uses root layout (header + footer)

**Authentication**: Optional (guest can chat anonymously, authenticated users get personalized responses)

**Props**: None

**Features**:
- ChatGPT-like full-page interface
- Message history
- Rich message formatting
- Session management
- New chat / load previous session

**Component Structure**:
```tsx
// app/chat/page.tsx (Client Component)
'use client';

import { ChatInterface } from '@/components/chat/ChatInterface';
import { useAuthStore } from '@/lib/stores/authStore';

export default function ChatPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  return (
    <main className="h-screen">
      <ChatInterface isAuthenticated={isAuthenticated} />
    </main>
  );
}
```

**URL Parameters**: None

**Search Params**: 
- `session` (optional): Load specific chat session by ID

---

#### `/rooms` - Room Catalog

**File**: `app/rooms/page.tsx`

**Purpose**: Browse all room types with filtering and availability.

**Layout**: Uses root layout

**Authentication**: Not required

**Props**: None

**Features**:
- Room grid/list display
- Filter sidebar (dates, guests, price, amenities)
- Availability status
- Sort options
- Responsive layout

**Component Structure**:
```tsx
// app/rooms/page.tsx (Server Component with Client filters)
import { RoomList } from '@/components/rooms/RoomList';
import { RoomFilter } from '@/components/rooms/RoomFilter';

export const metadata: Metadata = {
  title: 'Rooms & Suites - Bangkok Hotel',
  description: 'Explore our range of luxury rooms and suites, from Standard to Presidential.',
};

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Parse search params for filters
  const checkIn = searchParams.check_in as string | undefined;
  const checkOut = searchParams.check_out as string | undefined;
  const guests = searchParams.guests ? parseInt(searchParams.guests as string) : undefined;
  
  return (
    <main className="container mx-auto py-8">
      <h1>Rooms & Suites</h1>
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-3">
          <RoomFilter />
        </aside>
        <section className="col-span-9">
          <RoomList checkIn={checkIn} checkOut={checkOut} guests={guests} />
        </section>
      </div>
    </main>
  );
}
```

**Search Params**:
- `check_in`: ISO date string (YYYY-MM-DD)
- `check_out`: ISO date string (YYYY-MM-DD)
- `guests`: Number of guests
- `min_price`: Minimum price per night
- `max_price`: Maximum price per night
- `amenities`: Comma-separated amenity IDs

---

#### `/rooms/[id]` - Room Details

**File**: `app/rooms/[id]/page.tsx`

**Purpose**: Detailed view of a specific room type.

**Layout**: Uses root layout

**Authentication**: Not required

**Dynamic Segment**: `id` (room ID)

**Features**:
- Full room description
- Image gallery with lightbox
- Amenities list
- Pricing information
- Availability calendar
- Book Now CTA

**Component Structure**:
```tsx
// app/rooms/[id]/page.tsx (Server Component)
import { notFound } from 'next/navigation';
import { RoomGallery } from '@/components/rooms/RoomGallery';
import { RoomDetails } from '@/components/rooms/RoomDetails';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const room = await fetchRoom(params.id);
  
  return {
    title: `${room.name} - Bangkok Hotel`,
    description: room.description,
    openGraph: {
      images: [room.featured_image],
    },
  };
}

export default async function RoomDetailPage({ params }: { params: { id: string } }) {
  const room = await fetchRoom(params.id);
  
  if (!room) {
    notFound();
  }
  
  return (
    <main className="container mx-auto py-8">
      <RoomGallery images={room.images} title={room.name} />
      <RoomDetails room={room} />
    </main>
  );
}
```

---

### Protected Routes

Routes requiring authentication. Redirect to `/auth/login` if not authenticated.

#### `/profile` - User Profile

**File**: `app/profile/page.tsx`

**Purpose**: View and edit user profile, view booking history.

**Layout**: Uses root layout

**Authentication**: Required

**Features**:
- Profile information display
- Edit profile form
- Booking history list
- Logout button

**Component Structure**:
```tsx
// app/profile/page.tsx (Server Component)
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { BookingHistory } from '@/components/profile/BookingHistory';

export default async function ProfilePage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/auth/login?redirect=/profile');
  }
  
  return (
    <main className="container mx-auto py-8">
      <h1>My Profile</h1>
      <div className="grid grid-cols-2 gap-6">
        <section>
          <h2>Profile Information</h2>
          <ProfileForm user={session.user} />
        </section>
        <section>
          <h2>Booking History</h2>
          <BookingHistory userId={session.user.id} />
        </section>
      </div>
    </main>
  );
}
```

---

#### `/bookings` - My Bookings

**File**: `app/bookings/page.tsx`

**Purpose**: List all bookings for authenticated guest.

**Layout**: Uses root layout

**Authentication**: Required

**Features**:
- Bookings list with status
- Filter by status
- View booking details
- Cancel booking

**Component Structure**:
```tsx
// app/bookings/page.tsx (Client Component)
'use client';

import { useBookings } from '@/lib/hooks/useBookings';
import { BookingCard } from '@/components/bookings/BookingCard';

export default function BookingsPage() {
  const { bookings, isLoading, error } = useBookings();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <main className="container mx-auto py-8">
      <h1>My Bookings</h1>
      <div className="grid gap-4">
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </main>
  );
}
```

---

#### `/bookings/[id]` - Booking Details

**File**: `app/bookings/[id]/page.tsx`

**Purpose**: Detailed view of a specific booking.

**Layout**: Uses root layout

**Authentication**: Required (must own booking)

**Dynamic Segment**: `id` (booking ID)

**Features**:
- Complete booking information
- Guest details
- Room details
- Payment status
- Cancel booking button
- Special requests

**Component Structure**:
```tsx
// app/bookings/[id]/page.tsx (Server Component)
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';
import { fetchBooking } from '@/lib/api/bookings';
import { BookingDetailView } from '@/components/bookings/BookingDetailView';

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/auth/login');
  }
  
  const booking = await fetchBooking(params.id);
  
  // Check if user owns this booking
  if (booking.guest_id !== session.user.id && session.user.role !== 'admin') {
    redirect('/unauthorized');
  }
  
  return (
    <main className="container mx-auto py-8">
      <BookingDetailView booking={booking} />
    </main>
  );
}
```

---

### Admin Routes

Routes requiring admin role. Redirect to `/unauthorized` if not admin.

#### `/admin` - Admin Dashboard

**File**: `app/admin/page.tsx`

**Purpose**: Overview dashboard with statistics and metrics.

**Layout**: Uses admin layout (different header with admin nav)

**Authentication**: Required (admin role only)

**Features**:
- Summary statistics cards
- Occupancy chart
- Revenue chart
- Recent bookings table
- Real-time updates (5s polling)

**Component Structure**:
```tsx
// app/admin/page.tsx (Client Component)
'use client';

import { useAdminDashboard } from '@/lib/hooks/useAdminDashboard';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { OccupancyChart } from '@/components/admin/OccupancyChart';
import { RevenueChart } from '@/components/admin/RevenueChart';

export default function AdminDashboardPage() {
  const { stats, isLoading, error } = useAdminDashboard();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <main className="container mx-auto py-8">
      <h1>Dashboard</h1>
      <DashboardStats stats={stats} />
      <div className="grid grid-cols-2 gap-6 mt-8">
        <OccupancyChart data={stats.occupancy_trend} />
        <RevenueChart data={stats.revenue_trend} />
      </div>
    </main>
  );
}
```

---

#### `/admin/bookings` - Bookings Management

**File**: `app/admin/bookings/page.tsx`

**Purpose**: Manage all bookings (view, filter, update, cancel).

**Layout**: Uses admin layout

**Authentication**: Required (admin role only)

**Features**:
- Bookings table with filters
- Search by guest name/email
- Filter by status, room type, dates
- Sort by date/amount
- View/Edit/Cancel actions
- Pagination

**Component Structure**:
```tsx
// app/admin/bookings/page.tsx (Client Component)
'use client';

import { useState } from 'react';
import { useAdminBookings } from '@/lib/hooks/useAdminBookings';
import { BookingsTable } from '@/components/admin/BookingsTable';
import { BookingFilters } from '@/components/admin/BookingFilters';

export default function AdminBookingsPage() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  
  const { bookings, pagination, isLoading } = useAdminBookings({ ...filters, page });
  
  return (
    <main className="container mx-auto py-8">
      <h1>Bookings Management</h1>
      <BookingFilters filters={filters} onChange={setFilters} />
      <BookingsTable
        bookings={bookings}
        pagination={pagination}
        onPageChange={setPage}
        loading={isLoading}
      />
    </main>
  );
}
```

---

### Authentication Routes

Routes for login, registration, and password management.

#### `/auth/login` - Login Page

**File**: `app/auth/login/page.tsx`

**Purpose**: Guest login form.

**Layout**: Minimal layout (no header/footer, just logo)

**Authentication**: Redirects to home if already authenticated

**Features**:
- Email/password form
- Remember me checkbox
- Forgot password link
- Link to registration
- Social login (optional)

**Component Structure**:
```tsx
// app/auth/login/page.tsx (Client Component)
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push(redirectTo);
    return null;
  }
  
  const handleLogin = async (credentials: GuestLogin) => {
    await login(credentials);
    router.push(redirectTo);
  };
  
  return (
    <main className="flex items-center justify-center min-h-screen">
      <LoginForm onSubmit={handleLogin} />
    </main>
  );
}
```

**Search Params**:
- `redirect`: URL to redirect to after successful login

---

#### `/auth/register` - Registration Page

**File**: `app/auth/register/page.tsx`

**Purpose**: New guest registration form.

**Layout**: Minimal layout

**Authentication**: Redirects to home if already authenticated

**Features**:
- Email, password, name, phone fields
- Password strength indicator
- Terms acceptance
- Link to login

**Component Structure**:
```tsx
// app/auth/register/page.tsx (Client Component)
'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (isAuthenticated) {
    router.push('/');
    return null;
  }
  
  const handleRegister = async (data: GuestRegistration) => {
    await register(data);
    router.push('/chat'); // Redirect to chat after registration
  };
  
  return (
    <main className="flex items-center justify-center min-h-screen">
      <RegisterForm onSubmit={handleRegister} />
    </main>
  );
}
```

---

### Error & Utility Routes

#### `/unauthorized` - Unauthorized Access

**File**: `app/unauthorized/page.tsx`

**Purpose**: Error page for users attempting to access admin routes without permission.

**Layout**: Minimal layout

**Features**:
- Error message
- Link to login
- Link to home

---

#### `/404` - Not Found

**File**: `app/not-found.tsx`

**Purpose**: Custom 404 page.

**Layout**: Uses root layout

**Features**:
- Friendly error message
- Search widget
- Popular pages links
- Link to home

---

## Layouts

### Root Layout

**File**: `app/layout.tsx`

**Purpose**: Main layout for all public and protected routes.

**Features**:
- Header with navigation
- Footer
- Theme provider
- Toast notifications container
- Modals container

**Component Structure**:
```tsx
// app/layout.tsx
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ToastContainer } from '@/components/ui/ToastContainer';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Bangkok Hotel',
  description: 'Luxury hotel with AI-powered concierge',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

### Admin Layout

**File**: `app/admin/layout.tsx`

**Purpose**: Layout for admin routes with admin navigation.

**Features**:
- Admin header with admin nav links
- Sidebar navigation
- Role-based access control
- No footer (more workspace)

**Component Structure**:
```tsx
// app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  
  // Check if user is authenticated and has admin role
  if (!session || session.user.role !== 'admin') {
    redirect('/unauthorized');
  }
  
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader user={session.user} />
        <main className="flex-1 overflow-auto bg-bg-secondary p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

### Auth Layout

**File**: `app/auth/layout.tsx`

**Purpose**: Minimal layout for authentication pages.

**Features**:
- Logo only (centered)
- No header/footer
- Background pattern or image

**Component Structure**:
```tsx
// app/auth/layout.tsx
import { Logo } from '@/components/ui/Logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        {children}
      </div>
    </div>
  );
}
```

---

## Navigation

### Main Navigation Links

Displayed in the header for all users:

```typescript
const mainNavLinks = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/rooms', label: 'Rooms', icon: BedIcon },
  { href: '/chat', label: 'Chat', icon: MessageIcon },
];
```

### Authenticated User Links

Additional links for authenticated users:

```typescript
const authNavLinks = [
  { href: '/profile', label: 'Profile', icon: UserIcon },
  { href: '/bookings', label: 'My Bookings', icon: CalendarIcon },
];
```

### Admin Navigation Links

Links in admin sidebar:

```typescript
const adminNavLinks = [
  { href: '/admin', label: 'Dashboard', icon: DashboardIcon },
  { href: '/admin/bookings', label: 'Bookings', icon: BookIcon },
  { href: '/admin/rooms', label: 'Rooms', icon: BedIcon },
  { href: '/admin/guests', label: 'Guests', icon: UsersIcon },
];
```

---

## Middleware for Route Protection

**File**: `middleware.ts`

Protects routes and handles authentication checks:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookie
  const token = request.cookies.get('auth_token')?.value;
  
  // Protected routes
  const protectedRoutes = ['/profile', '/bookings'];
  const adminRoutes = ['/admin'];
  
  // Check if route is protected
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route));
  
  if (isProtected && !token) {
    // Redirect to login with return URL
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  if (isAdmin) {
    // Verify admin role (simplified - should validate JWT)
    // In production, decode JWT and check role
    if (!token) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/bookings/:path*', '/admin/:path*'],
};
```

---

## Route Parameters & Search Params

### Dynamic Routes

| Route | Parameter | Type | Description |
|-------|-----------|------|-------------|
| `/rooms/[id]` | `id` | number | Room type ID |
| `/bookings/[id]` | `id` | number | Booking ID |

### Search Parameters

| Route | Parameter | Type | Description |
|-------|-----------|------|-------------|
| `/rooms` | `check_in` | string (date) | Check-in date filter |
| `/rooms` | `check_out` | string (date) | Check-out date filter |
| `/rooms` | `guests` | number | Number of guests |
| `/chat` | `session` | string (UUID) | Load specific session |
| `/auth/login` | `redirect` | string (URL) | Post-login redirect |

---

## Programmatic Navigation

### Using Next.js Router

```typescript
'use client';

import { useRouter } from 'next/navigation';

function BookNowButton({ roomId }: { roomId: number }) {
  const router = useRouter();
  
  const handleClick = () => {
    // Navigate to room details
    router.push(`/rooms/${roomId}`);
    
    // Navigate with search params
    router.push(`/rooms?check_in=2025-02-01&check_out=2025-02-03`);
    
    // Go back
    router.back();
    
    // Refresh current route
    router.refresh();
  };
  
  return <button onClick={handleClick}>Book Now</button>;
}
```

### Using Link Component

```typescript
import Link from 'next/link';

function RoomCard({ room }: { room: Room }) {
  return (
    <Link href={`/rooms/${room.id}`}>
      <Card>
        <RoomCardContent room={room} />
      </Card>
    </Link>
  );
}
```

---

## SEO & Metadata

Each page exports metadata for SEO:

```typescript
// Static metadata
export const metadata: Metadata = {
  title: 'Rooms - Bangkok Hotel',
  description: 'Browse our luxury rooms and suites',
};

// Dynamic metadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const room = await fetchRoom(params.id);
  
  return {
    title: `${room.name} - Bangkok Hotel`,
    description: room.description,
    openGraph: {
      title: room.name,
      description: room.description,
      images: [room.featured_image],
    },
  };
}
```

---

**Contract Version**: 1.0.0
**Last Updated**: 2025-01-15
**Status**: Ready for implementation
