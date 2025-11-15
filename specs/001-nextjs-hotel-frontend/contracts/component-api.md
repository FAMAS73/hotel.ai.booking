# Component API Contract: Shared Components

**Feature**: Next.js Hotel Frontend Website
**Branch**: `001-nextjs-hotel-frontend`
**Created**: 2025-01-15
**Purpose**: Document public props and APIs for major shared components

## Overview

This contract defines the public APIs for all major shared components in the Next.js frontend. Each component includes prop types, usage examples, accessibility features, and styling customization options.

---

## Layout Components

### Header

Main navigation header with logo, navigation links, theme toggle, and user menu.

**Location**: `components/layout/Header.tsx`

**Props**:
```typescript
interface HeaderProps {
  /** Whether to show the header in transparent mode (for hero sections) */
  transparent?: boolean;
  
  /** Current active page for navigation highlighting */
  activePage?: 'home' | 'chat' | 'rooms' | 'admin' | 'profile';
  
  /** Custom CSS class name */
  className?: string;
}
```

**Usage Example**:
```tsx
import { Header } from '@/components/layout/Header';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header activePage="rooms" />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

**Features**:
- Responsive mobile menu (hamburger on small screens)
- Theme toggle button
- User authentication status display
- Logout functionality
- Sticky header on scroll
- ARIA landmarks and labels

**Accessibility**:
- `<nav>` with `aria-label="Main navigation"`
- Keyboard navigation with tab/arrow keys
- Focus indicators on all interactive elements
- Screen reader announcements for theme toggle

---

### Footer

Site footer with links, contact information, and social media.

**Location**: `components/layout/Footer.tsx`

**Props**:
```typescript
interface FooterProps {
  /** Whether to show simplified footer (e.g., on checkout pages) */
  simplified?: boolean;
  
  /** Custom CSS class name */
  className?: string;
}
```

**Usage Example**:
```tsx
import { Footer } from '@/components/layout/Footer';

<Footer />
```

**Features**:
- Hotel contact information
- Quick links (About, Rooms, Contact, Terms)
- Social media icons (if applicable)
- Copyright notice
- Responsive multi-column layout

**Accessibility**:
- `<footer>` with `aria-label="Site footer"`
- Proper heading hierarchy
- Descriptive link text

---

### ThemeToggle

Theme switcher button for light/dark mode.

**Location**: `components/layout/ThemeToggle.tsx`

**Props**:
```typescript
interface ThemeToggleProps {
  /** Button size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Show label text next to icon */
  showLabel?: boolean;
  
  /** Custom CSS class name */
  className?: string;
}
```

**Usage Example**:
```tsx
import { ThemeToggle } from '@/components/layout/ThemeToggle';

<ThemeToggle size="md" showLabel />
```

**Features**:
- Smooth theme transition (<300ms)
- Persists preference to localStorage
- Respects system theme on first visit
- Icon animation on toggle
- Sun icon for light mode, moon for dark mode

**Accessibility**:
- `aria-label="Toggle theme"` or `aria-label="Switch to dark mode"`
- `role="switch"` with `aria-checked` state
- Keyboard activation (Enter/Space)
- Screen reader announcement on theme change

---

## UI Components

### Button

Reusable button component with variants and states.

**Location**: `components/ui/Button.tsx`

**Props**:
```typescript
interface ButtonProps {
  /** Button content */
  children: React.ReactNode;
  
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Loading state (shows spinner) */
  loading?: boolean;
  
  /** Full width button */
  fullWidth?: boolean;
  
  /** Click handler */
  onClick?: () => void;
  
  /** HTML button type */
  type?: 'button' | 'submit' | 'reset';
  
  /** Accessible label (if children is icon only) */
  ariaLabel?: string;
  
  /** Custom CSS class name */
  className?: string;
}
```

**Usage Example**:
```tsx
import { Button } from '@/components/ui/Button';

<Button 
  variant="primary" 
  size="lg" 
  onClick={handleSubmit}
  loading={isSubmitting}
>
  Book Now
</Button>
```

**Variants**:
- `primary`: Blue background, white text (main CTAs)
- `secondary`: Gray background, dark text (secondary actions)
- `outline`: Transparent with border (tertiary actions)
- `ghost`: Transparent, no border (inline actions)
- `danger`: Red background, white text (destructive actions)

**Accessibility**:
- Keyboard focusable
- Focus ring indicator
- Disabled state (aria-disabled)
- Loading state (aria-busy)

---

### Card

Container component for content grouping.

**Location**: `components/ui/Card.tsx`

**Props**:
```typescript
interface CardProps {
  /** Card content */
  children: React.ReactNode;
  
  /** Whether card is clickable */
  clickable?: boolean;
  
  /** Click handler (if clickable) */
  onClick?: () => void;
  
  /** Whether to show hover effect */
  hover?: boolean;
  
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  
  /** Custom CSS class name */
  className?: string;
}
```

**Usage Example**:
```tsx
import { Card } from '@/components/ui/Card';

<Card hover clickable onClick={() => router.push('/room/1')}>
  <RoomCardContent room={room} />
</Card>
```

**Features**:
- Border radius and shadow
- Hover elevation effect
- Dark mode support
- Responsive padding

---

### Modal

Accessible modal dialog component.

**Location**: `components/ui/Modal.tsx`

**Props**:
```typescript
interface ModalProps {
  /** Whether modal is open */
  open: boolean;
  
  /** Close handler */
  onClose: () => void;
  
  /** Modal title */
  title: string;
  
  /** Modal content */
  children: React.ReactNode;
  
  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  
  /** Whether clicking backdrop closes modal */
  closeOnBackdropClick?: boolean;
  
  /** Whether pressing Escape closes modal */
  closeOnEscape?: boolean;
  
  /** Footer content (typically action buttons) */
  footer?: React.ReactNode;
  
  /** Custom CSS class name */
  className?: string;
}
```

**Usage Example**:
```tsx
import { Modal } from '@/components/ui/Modal';

<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Room Details"
  size="lg"
  footer={
    <>
      <Button variant="outline" onClick={onClose}>Close</Button>
      <Button variant="primary" onClick={handleBook}>Book Now</Button>
    </>
  }
>
  <RoomDetailContent room={room} />
</Modal>
```

**Features**:
- Focus trap (keyboard navigation stays within modal)
- Backdrop with blur effect
- Smooth enter/exit animations
- Scroll lock on body
- Restore focus on close

**Accessibility**:
- `role="dialog"` with `aria-modal="true"`
- `aria-labelledby` pointing to title
- Focus moves to modal on open
- Escape key closes modal
- Focus returns to trigger on close

---

### Input

Form input component with validation states.

**Location**: `components/ui/Input.tsx`

**Props**:
```typescript
interface InputProps {
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date';
  
  /** Input name */
  name: string;
  
  /** Input label */
  label: string;
  
  /** Input value */
  value: string | number;
  
  /** Change handler */
  onChange: (value: string) => void;
  
  /** Placeholder text */
  placeholder?: string;
  
  /** Whether field is required */
  required?: boolean;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Error message (shows error state) */
  error?: string;
  
  /** Helper text below input */
  helperText?: string;
  
  /** Left icon */
  leftIcon?: React.ReactNode;
  
  /** Right icon */
  rightIcon?: React.ReactNode;
  
  /** Auto-complete attribute */
  autoComplete?: string;
  
  /** Custom CSS class name */
  className?: string;
}
```

**Usage Example**:
```tsx
import { Input } from '@/components/ui/Input';

<Input
  type="email"
  name="email"
  label="Email Address"
  value={email}
  onChange={setEmail}
  required
  error={errors.email}
  autoComplete="email"
/>
```

**Features**:
- Label animation on focus
- Error state styling
- Required field indicator
- Icon support
- Dark mode support

**Accessibility**:
- Associated `<label>` element
- `aria-required` for required fields
- `aria-invalid` and `aria-describedby` for errors
- Clear focus indicators

---

### DatePicker

Date selection component for check-in/check-out dates.

**Location**: `components/ui/DatePicker.tsx`

**Props**:
```typescript
interface DatePickerProps {
  /** Selected date */
  value: Date | null;
  
  /** Change handler */
  onChange: (date: Date | null) => void;
  
  /** Input label */
  label: string;
  
  /** Minimum selectable date */
  minDate?: Date;
  
  /** Maximum selectable date */
  maxDate?: Date;
  
  /** Disabled dates */
  disabledDates?: Date[];
  
  /** Placeholder text */
  placeholder?: string;
  
  /** Whether field is required */
  required?: boolean;
  
  /** Error message */
  error?: string;
  
  /** Custom CSS class name */
  className?: string;
}
```

**Usage Example**:
```tsx
import { DatePicker } from '@/components/ui/DatePicker';

<DatePicker
  label="Check-in Date"
  value={checkIn}
  onChange={setCheckIn}
  minDate={new Date()}
  required
/>
```

**Features**:
- Calendar popup with month/year navigation
- Keyboard date entry
- Date range validation
- Disabled dates visualization
- Mobile-friendly touch interactions

**Accessibility**:
- Keyboard navigation (arrows, Enter, Escape)
- `role="dialog"` for calendar popup
- Date announcements for screen readers
- Focus management

---

## Room Catalog Components

### RoomCard

Displays a room type in the catalog grid.

**Location**: `components/rooms/RoomCard.tsx`

**Props**:
```typescript
interface RoomCardProps {
  /** Room data */
  room: Room;
  
  /** Whether to show availability badge */
  showAvailability?: boolean;
  
  /** Click handler */
  onClick?: () => void;
  
  /** Whether card is in loading state */
  loading?: boolean;
  
  /** Custom CSS class name */
  className?: string;
}
```

**Usage Example**:
```tsx
import { RoomCard } from '@/components/rooms/RoomCard';

<RoomCard
  room={room}
  showAvailability
  onClick={() => setSelectedRoom(room)}
/>
```

**Features**:
- Featured image with lazy loading
- Room name and description
- Price per night display
- Capacity and size
- Amenities icons (first 4)
- Availability badge
- Hover effect with elevation

**Accessibility**:
- Image alt text with room description
- Semantic heading for room name
- Keyboard accessible
- Focus indicators

---

### RoomFilter

Filter controls for room catalog.

**Location**: `components/rooms/RoomFilter.tsx`

**Props**:
```typescript
interface RoomFilterProps {
  /** Current filter values */
  filter: RoomFilter;
  
  /** Filter change handler */
  onChange: (filter: RoomFilter) => void;
  
  /** Whether to show advanced filters */
  showAdvanced?: boolean;
  
  /** Loading state */
  loading?: boolean;
  
  /** Custom CSS class name */
  className?: string;
}
```

**Usage Example**:
```tsx
import { RoomFilter } from '@/components/rooms/RoomFilter';

<RoomFilter
  filter={filter}
  onChange={setFilter}
  showAdvanced
/>
```

**Features**:
- Date range picker (check-in/out)
- Guest count selector
- Price range slider
- Amenities checkboxes
- Room type multi-select
- Clear filters button
- Apply filters button

---

### RoomGallery

Image gallery with lightbox for room photos.

**Location**: `components/rooms/RoomGallery.tsx`

**Props**:
```typescript
interface RoomGalleryProps {
  /** Array of room images */
  images: RoomImage[];
  
  /** Gallery title (for accessibility) */
  title: string;
  
  /** Initial image index to display */
  initialIndex?: number;
  
  /** Whether to show thumbnails */
  showThumbnails?: boolean;
  
  /** Custom CSS class name */
  className?: string;
}
```

**Usage Example**:
```tsx
import { RoomGallery } from '@/components/rooms/RoomGallery';

<RoomGallery
  images={room.images}
  title={`${room.name} Gallery`}
  showThumbnails
/>
```

**Features**:
- Full-screen lightbox view
- Image carousel navigation
- Thumbnail strip
- Zoom capability
- Swipe gestures on mobile
- Keyboard navigation (arrows, Escape)

**Accessibility**:
- Image alt text
- Navigation button labels
- Keyboard navigation
- Focus management in lightbox

---

## Chat Components

### ChatInterface

Main chat UI component (full-page).

**Location**: `components/chat/ChatInterface.tsx`

**Props**:
```typescript
interface ChatInterfaceProps {
  /** Initial session ID to load (optional) */
  sessionId?: string;
  
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  
  /** Custom CSS class name */
  className?: string;
}
```

**Usage Example**:
```tsx
import { ChatInterface } from '@/components/chat/ChatInterface';

export default function ChatPage() {
  const { isAuthenticated } = useAuthStore();
  
  return <ChatInterface isAuthenticated={isAuthenticated} />;
}
```

**Features**:
- Message history display
- Message input with send button
- Typing indicator
- Auto-scroll to latest message
- Session management (new chat, load previous)
- Rich message rendering (text, lists, embedded content)
- Error handling and retry

**Internal State**:
- Current session ID
- Messages array
- Input value
- Loading state
- Scroll position

---

### ChatMessage

Individual message bubble component.

**Location**: `components/chat/ChatMessage.tsx`

**Props**:
```typescript
interface ChatMessageProps {
  /** Message data */
  message: ChatMessage;
  
  /** Whether this is the user's message */
  isUser: boolean;
  
  /** Whether to show timestamp */
  showTimestamp?: boolean;
  
  /** Custom CSS class name */
  className?: string;
}
```

**Usage Example**:
```tsx
import { ChatMessage } from '@/components/chat/ChatMessage';

{messages.map((msg) => (
  <ChatMessage
    key={msg.id}
    message={msg}
    isUser={msg.role === 'user'}
    showTimestamp
  />
))}
```

**Features**:
- Different styling for user vs assistant messages
- Timestamp display
- Formatted content (markdown support)
- Rich content rendering (room cards, booking info)
- Copy message button
- Loading animation for streaming messages

---

### ChatInput

Message input field with send button.

**Location**: `components/chat/ChatInput.tsx`

**Props**:
```typescript
interface ChatInputProps {
  /** Current input value */
  value: string;
  
  /** Change handler */
  onChange: (value: string) => void;
  
  /** Submit handler */
  onSubmit: () => void;
  
  /** Disabled state (e.g., while sending) */
  disabled?: boolean;
  
  /** Placeholder text */
  placeholder?: string;
  
  /** Maximum character count */
  maxLength?: number;
  
  /** Custom CSS class name */
  className?: string;
}
```

**Usage Example**:
```tsx
import { ChatInput } from '@/components/chat/ChatInput';

<ChatInput
  value={input}
  onChange={setInput}
  onSubmit={handleSend}
  disabled={isSending}
  placeholder="Ask me about rooms, bookings, or Bangkok recommendations..."
  maxLength={1000}
/>
```

**Features**:
- Auto-resize textarea (grows with content)
- Send button (enabled when input is not empty)
- Enter to send, Shift+Enter for new line
- Character count indicator (near limit)
- Emoji picker (optional)

**Accessibility**:
- `aria-label="Message input"`
- Send button with descriptive label
- Keyboard shortcuts

---

## Admin Dashboard Components

### DashboardStats

Summary statistics cards.

**Location**: `components/admin/DashboardStats.tsx`

**Props**:
```typescript
interface DashboardStatsProps {
  /** Dashboard statistics data */
  stats: AdminDashboardStats;
  
  /** Loading state */
  loading?: boolean;
  
  /** Custom CSS class name */
  className?: string;
}
```

**Usage Example**:
```tsx
import { DashboardStats } from '@/components/admin/DashboardStats';

<DashboardStats stats={dashboardData.stats} loading={isLoading} />
```

**Features**:
- Grid of stat cards
- Icons for each metric
- Trend indicators (up/down)
- Skeleton loaders while loading
- Responsive layout

---

### BookingsTable

Table displaying all bookings with filters and actions.

**Location**: `components/admin/BookingsTable.tsx`

**Props**:
```typescript
interface BookingsTableProps {
  /** Bookings data */
  bookings: Booking[];
  
  /** Loading state */
  loading?: boolean;
  
  /** Pagination info */
  pagination: PaginatedResponse<Booking>['pagination'];
  
  /** Page change handler */
  onPageChange: (page: number) => void;
  
  /** Sort change handler */
  onSortChange: (sort: string) => void;
  
  /** View booking details handler */
  onViewDetails: (bookingId: number) => void;
  
  /** Cancel booking handler */
  onCancelBooking: (bookingId: number) => void;
  
  /** Custom CSS class name */
  className?: string;
}
```

**Usage Example**:
```tsx
import { BookingsTable } from '@/components/admin/BookingsTable';

<BookingsTable
  bookings={bookings}
  loading={isLoading}
  pagination={pagination}
  onPageChange={setPage}
  onSortChange={setSort}
  onViewDetails={handleViewDetails}
  onCancelBooking={handleCancel}
/>
```

**Features**:
- Sortable columns
- Pagination controls
- Status badges with colors
- Action buttons (View, Cancel)
- Empty state message
- Loading skeleton
- Responsive table (cards on mobile)

**Accessibility**:
- `<table>` with `<caption>`
- Column headers with sort controls
- Row selection with keyboard
- Action buttons with descriptive labels

---

### OccupancyChart

Line chart showing occupancy trends.

**Location**: `components/admin/OccupancyChart.tsx`

**Props**:
```typescript
interface OccupancyChartProps {
  /** Occupancy data points */
  data: OccupancyDataPoint[];
  
  /** Chart height in pixels */
  height?: number;
  
  /** Loading state */
  loading?: boolean;
  
  /** Custom CSS class name */
  className?: string;
}
```

**Usage Example**:
```tsx
import { OccupancyChart } from '@/components/admin/OccupancyChart';

<OccupancyChart
  data={stats.occupancy_trend}
  height={300}
  loading={isLoading}
/>
```

**Features**:
- Line chart with area fill
- Grid lines
- Tooltip on hover
- Responsive sizing
- Dark mode support
- Accessibility labels

---

## Authentication Components

### LoginForm

Login form with email/password fields.

**Location**: `components/auth/LoginForm.tsx`

**Props**:
```typescript
interface LoginFormProps {
  /** Submit handler */
  onSubmit: (credentials: GuestLogin) => Promise<void>;
  
  /** Redirect URL after successful login */
  redirectTo?: string;
  
  /** Custom CSS class name */
  className?: string;
}
```

**Usage Example**:
```tsx
import { LoginForm } from '@/components/auth/LoginForm';

<LoginForm
  onSubmit={handleLogin}
  redirectTo="/profile"
/>
```

**Features**:
- Email validation
- Password visibility toggle
- Remember me checkbox
- Form validation
- Error display
- Loading state

---

### RegisterForm

Registration form for new accounts.

**Location**: `components/auth/RegisterForm.tsx`

**Props**:
```typescript
interface RegisterFormProps {
  /** Submit handler */
  onSubmit: (data: GuestRegistration) => Promise<void>;
  
  /** Redirect URL after successful registration */
  redirectTo?: string;
  
  /** Custom CSS class name */
  className?: string;
}
```

**Usage Example**:
```tsx
import { RegisterForm } from '@/components/auth/RegisterForm';

<RegisterForm
  onSubmit={handleRegister}
  redirectTo="/chat"
/>
```

**Features**:
- Email, password, name, phone fields
- Password strength indicator
- Password confirmation field
- Terms acceptance checkbox
- Form validation
- Error display

---

## Styling and Theming

All components support theme customization via CSS variables:

```css
/* Light theme */
--color-bg-primary: rgb(255 255 255);
--color-text-primary: rgb(17 24 39);
--color-accent: rgb(37 99 235);

/* Dark theme */
.dark --color-bg-primary: rgb(17 24 39);
.dark --color-text-primary: rgb(243 244 246);
.dark --color-accent: rgb(96 165 250);
```

Components use Tailwind utility classes that reference these variables:
```tsx
<div className="bg-bg-primary text-text-primary">
```

---

## Component Testing

All components should be tested with:

```typescript
// Example test for Button component
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('is disabled when loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

**Contract Version**: 1.0.0
**Last Updated**: 2025-01-15
**Status**: Ready for implementation
