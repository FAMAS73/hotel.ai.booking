# Implementation Plan: Next.js Hotel Frontend Website

**Branch**: `001-nextjs-hotel-frontend` | **Date**: 2025-01-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-nextjs-hotel-frontend/spec.md`

## Summary

Build a comprehensive Next.js 15 frontend website for the hotel booking system with AI chatbot integration. The application features a ChatGPT-like chat interface, room catalog with availability filtering, admin dashboard for booking management, and full theme support (light/dark modes with no purple colors). Technical approach uses Next.js App Router for server-side rendering, Zustand for state management, Tailwind CSS for styling, and Docker for deployment. All code includes inline comments for thesis demonstration, with WCAG 2.1 AA accessibility compliance.

**Key Technologies**: Next.js 15 (App Router), TypeScript 5.x, Tailwind CSS 4.x, Zustand, SWR, Radix UI, Docker

---

## Technical Context

**Language/Version**: Next.js 15.x (latest stable), TypeScript 5.x, Node.js 20+

**Primary Dependencies**:
- **Framework**: Next.js 15.x, React 19.x
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x, PostCSS, Autoprefixer
- **State Management**: Zustand 5.x (global state), React Context (theme only)
- **Data Fetching**: SWR 2.x (server state caching)
- **UI Components**: Radix UI (accessible primitives)
- **Date Handling**: date-fns 3.x
- **HTTP Client**: Native fetch API
- **Testing**: Jest 29.x, React Testing Library 14.x, Playwright 1.40+
- **Code Quality**: ESLint 8.x, Prettier 3.x
- **Security**: DOMPurify 3.x (XSS prevention)

**Storage**:
- **Browser localStorage**: Theme preference, demo auth tokens (with security warnings)
- **httpOnly Cookies**: JWT tokens (production, set by backend)
- **SWR Cache**: API response caching (in-memory)
- **Backend PostgreSQL**: All persistent data via API (rooms, bookings, users, chat sessions)

**Testing**:
- **Unit Tests**: Jest + React Testing Library for component testing
- **Integration Tests**: Playwright for E2E user flows
- **Accessibility Tests**: axe-core via Playwright for WCAG compliance
- **Visual Tests**: Playwright screenshots for UI regression
- **Manual Testing**: Screen readers (NVDA, VoiceOver), keyboard navigation

**Target Platform**: 
- **Browsers**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Devices**: Desktop (1920px+), Tablet (768px-1024px), Mobile (320px-767px)
- **Screen Readers**: NVDA (Windows), JAWS (Windows), VoiceOver (macOS/iOS)
- **Deployment**: Docker container (Next.js standalone mode), Linux server

**Project Type**: Web application (frontend separate from existing backend)

**Performance Goals**:
- **LCP (Largest Contentful Paint)**: <2.5s for room catalog page
- **FID (First Input Delay)**: <100ms for all interactions
- **CLS (Cumulative Layout Shift)**: <0.1 (stable layouts)
- **Bundle Size**: <150KB initial JavaScript (gzipped)
- **API Response Time**: <500ms with SWR caching
- **Theme Toggle**: <300ms smooth transition
- **Image Load**: Lazy loading with Next.js Image, WebP/AVIF optimization

**Constraints**:
- **WCAG 2.1 AA Compliance**: Mandatory for thesis demonstration
- **No Purple Colors**: Constitution requirement, use blue/green/amber palette
- **Docker Deployment**: Must run in container alongside FastAPI backend
- **Inline Documentation**: All components require explanatory comments for thesis
- **Security-First**: XSS prevention, CSRF protection, JWT validation
- **Browser Support**: No IE11 support, ES6+ required
- **Offline Support**: Not required (assumes stable network)
- **Real Payment**: Out of scope, mock only

**Scale/Scope**:
- **Concurrent Users**: 100 simultaneous users (thesis demo scale)
- **Bookings Display**: 50+ bookings in admin dashboard
- **Chat History**: Up to 100 messages per session
- **Room Types**: 5 room categories (Standard, Deluxe, Suite, Executive, Presidential)
- **Pages**: 5 main pages + auth pages + admin pages (~10-12 total routes)
- **Components**: ~40-50 reusable components
- **API Endpoints**: ~15-20 backend endpoints consumed

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Principle I: Code-First Documentation

**Status**: COMPLIANT

- All components will include inline comments explaining purpose, props, state management
- API integration functions will document request/response structures
- Complex logic (state management, data fetching, authentication) will have "why" comments
- TypeScript interfaces serve as self-documenting contracts
- No external documentation beyond code comments (quickstart.md is for development setup only)

**Example**:
```typescript
/**
 * BookingStore manages the multi-step booking flow state.
 * Tracks selected dates, room, guest count, and special requests.
 * Persists to localStorage to survive page refreshes during booking.
 * 
 * Why Zustand: Avoids prop drilling, better performance than Context for global state.
 */
export const useBookingStore = create<BookingStore>((set, get) => ({ ... }));
```

---

### ✅ Principle II: Commit and Push to Main

**Status**: COMPLIANT

- Direct commits to main branch (001-nextjs-hotel-frontend branch serves as main for this feature)
- Each commit includes clear message explaining what changed and why
- Commit format: `[component]: Brief description` with detailed body
- Push after each working feature completion
- No feature branches for thesis development

**Commit Example**:
```
[components/chat]: Implement ChatInterface with message history

- Created ChatInterface component with full-page layout
- Integrated with backend /api/chat/send endpoint
- Added typing indicator during AI response
- Implemented auto-scroll to latest message
- Added session management (new chat, load previous)

Demonstrates React hooks, API integration, and state management
for thesis presentation.

🤖 Generated with Claude Code
```

---

### ✅ Principle III: No Unsolicited Documentation

**Status**: COMPLIANT

- No README.md, design docs, or architecture PDFs created beyond this plan
- quickstart.md is for development setup only (explicitly requested in workflow)
- All documentation lives in code comments
- System architecture will be diagram in thesis presentation, not separate document

---

### ✅ Principle IV: Security-First Implementation

**Status**: COMPLIANT

- **XSS Prevention**: React auto-escaping + DOMPurify for rich content
- **CSRF Protection**: CSRF tokens for state-changing operations
- **JWT Storage**: httpOnly cookies (production), localStorage with warnings (demo)
- **Input Validation**: Client-side validation + backend validation
- **Authorization**: Protected routes, admin role checks
- **Secrets Management**: Environment variables, no hardcoded credentials
- **CORS**: Backend CORS properly configured for frontend origin

**Security Implementation**:
```typescript
// WARNING: localStorage used for thesis demonstration only
// Production deployment MUST use httpOnly cookies to prevent XSS attacks
if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
  localStorage.setItem('demo_token', token);
  console.warn('Using localStorage for token - DEMO MODE ONLY');
}
```

---

### ✅ Principle V: Incremental AI Conversion

**Status**: NOT APPLICABLE

This principle applies to backend AI blueprint conversion. Frontend is new development, not conversion.

---

### ✅ Principle VI: Working Demonstrations Required

**Status**: COMPLIANT

- Full E2E test suite demonstrates all major features
- Playwright tests serve as executable demos
- Demo data seeded in backend for consistent demonstrations
- Docker compose brings up full working system
- quickstart.md includes "Thesis Demonstration Checklist" and demo script

**Demo Scenarios**:
1. Chat interaction: Send message, receive AI response (3 seconds)
2. Room catalog: Filter by dates, view availability (<2 seconds load)
3. Theme switching: Toggle light/dark mode (<300ms transition)
4. Admin dashboard: View real-time booking data (5-second refresh)
5. Booking flow: Select room, fill details, confirm booking
6. Authentication: Login, view profile, logout

---

### Technical Standards Compliance

#### ✅ Frontend Stack Requirements

- **Next.js**: Latest stable (15.x) ✓
- **TypeScript**: For type safety and code clarity ✓
- **Styling**: Tailwind CSS (chosen for rapid development) ✓
- **State Management**: Zustand (lightweight, performant) ✓
- **HTTP Client**: fetch API (native, no extra dependencies) ✓

#### ✅ Code Quality Standards

- **TypeScript**: Strict mode, type hints for all functions ✓
- **React Best Practices**: Functional components, hooks, no class components ✓
- **ESLint + Prettier**: Configured for consistency ✓
- **Error Handling**: Try-catch, error boundaries, loading states ✓
- **Environment Variables**: All config externalized ✓

#### ✅ Testing Requirements

- **Component Tests**: Jest + React Testing Library ✓
- **E2E Tests**: Playwright for user flows ✓
- **Accessibility Tests**: axe-core integration ✓
- **Executable**: npm test, npm run test:e2e ✓

---

## Project Structure

### Documentation (this feature)

```text
specs/001-nextjs-hotel-frontend/
├── plan.md              # This file (completed by /speckit.plan)
├── spec.md              # Feature specification (input)
├── research.md          # Phase 0 output: Technology research and decisions
├── data-model.md        # Phase 1 output: TypeScript interfaces
├── quickstart.md        # Phase 1 output: Developer setup guide
├── contracts/           # Phase 1 output: API and component contracts
│   ├── api-client.md       # Backend API endpoint documentation
│   ├── component-api.md    # Shared component props and APIs
│   ├── state-management.md # Zustand store structures
│   └── routing.md          # Next.js App Router routes and navigation
└── tasks.md             # Phase 2 output: NOT created by /speckit.plan
                         # Will be created by /speckit.tasks command
```

---

### Source Code (repository root)

```text
frontend/                           # Next.js application root
├── src/
│   ├── app/                        # Next.js 15 App Router
│   │   ├── layout.tsx                 # Root layout (header, footer, theme)
│   │   ├── page.tsx                   # Home/landing page (hero, quick search)
│   │   ├── globals.css                # Global styles with CSS variables
│   │   ├── chat/
│   │   │   └── page.tsx               # Full-page chat interface
│   │   ├── rooms/
│   │   │   ├── page.tsx               # Room catalog with filters
│   │   │   └── [id]/
│   │   │       └── page.tsx           # Room detail page
│   │   ├── bookings/
│   │   │   ├── page.tsx               # My bookings list
│   │   │   └── [id]/
│   │   │       └── page.tsx           # Booking detail view
│   │   ├── profile/
│   │   │   └── page.tsx               # User profile and settings
│   │   ├── auth/
│   │   │   ├── layout.tsx             # Auth layout (minimal)
│   │   │   ├── login/
│   │   │   │   └── page.tsx           # Login form
│   │   │   └── register/
│   │   │       └── page.tsx           # Registration form
│   │   ├── admin/
│   │   │   ├── layout.tsx             # Admin layout (sidebar)
│   │   │   ├── page.tsx               # Admin dashboard
│   │   │   └── bookings/
│   │   │       └── page.tsx           # Bookings management
│   │   ├── unauthorized/
│   │   │   └── page.tsx               # Unauthorized access error
│   │   └── not-found.tsx              # Custom 404 page
│   │
│   ├── components/                 # React components
│   │   ├── layout/                    # Layout components
│   │   │   ├── Header.tsx             # Main navigation header
│   │   │   ├── Footer.tsx             # Site footer
│   │   │   ├── ThemeToggle.tsx        # Dark/light mode toggle
│   │   │   └── AdminSidebar.tsx       # Admin navigation sidebar
│   │   ├── ui/                        # Shared UI components
│   │   │   ├── Button.tsx             # Button with variants
│   │   │   ├── Card.tsx               # Content card container
│   │   │   ├── Modal.tsx              # Accessible modal dialog
│   │   │   ├── Input.tsx              # Form input with validation
│   │   │   ├── DatePicker.tsx         # Date selection component
│   │   │   ├── Select.tsx             # Dropdown select
│   │   │   ├── Checkbox.tsx           # Checkbox input
│   │   │   ├── LoadingSpinner.tsx     # Loading indicator
│   │   │   ├── ErrorMessage.tsx       # Error display
│   │   │   ├── Toast.tsx              # Toast notification
│   │   │   └── ToastContainer.tsx     # Toast manager
│   │   ├── chat/                      # Chat interface components
│   │   │   ├── ChatInterface.tsx      # Main chat container
│   │   │   ├── ChatMessage.tsx        # Individual message bubble
│   │   │   ├── ChatInput.tsx          # Message input field
│   │   │   ├── TypingIndicator.tsx    # AI typing animation
│   │   │   └── SessionList.tsx        # Previous sessions sidebar
│   │   ├── rooms/                     # Room catalog components
│   │   │   ├── RoomList.tsx           # Room grid/list display
│   │   │   ├── RoomCard.tsx           # Room card in catalog
│   │   │   ├── RoomFilter.tsx         # Filter sidebar
│   │   │   ├── RoomGallery.tsx        # Image gallery with lightbox
│   │   │   ├── RoomDetails.tsx        # Room detail view
│   │   │   └── AvailabilityBadge.tsx  # Availability indicator
│   │   ├── bookings/                  # Booking components
│   │   │   ├── BookingCard.tsx        # Booking summary card
│   │   │   ├── BookingDetailView.tsx  # Booking detail display
│   │   │   ├── BookingForm.tsx        # Booking creation form
│   │   │   └── CancelBookingModal.tsx # Cancellation modal
│   │   ├── admin/                     # Admin dashboard components
│   │   │   ├── DashboardStats.tsx     # Statistics cards
│   │   │   ├── BookingsTable.tsx      # Bookings table with actions
│   │   │   ├── OccupancyChart.tsx     # Occupancy line chart
│   │   │   ├── RevenueChart.tsx       # Revenue bar chart
│   │   │   └── BookingFilters.tsx     # Admin filter controls
│   │   ├── auth/                      # Authentication components
│   │   │   ├── LoginForm.tsx          # Login form
│   │   │   ├── RegisterForm.tsx       # Registration form
│   │   │   └── ProtectedRoute.tsx     # Auth guard wrapper
│   │   ├── home/                      # Home page components
│   │   │   ├── HeroSection.tsx        # Hero with CTA
│   │   │   ├── QuickSearch.tsx        # Quick date search widget
│   │   │   ├── FeaturedRooms.tsx      # Featured rooms carousel
│   │   │   └── Amenities.tsx          # Amenities showcase
│   │   └── profile/                   # Profile components
│   │       ├── ProfileForm.tsx        # Profile edit form
│   │       └── BookingHistory.tsx     # User booking list
│   │
│   ├── lib/                        # Utility libraries
│   │   ├── api/                       # API client functions
│   │   │   ├── client.ts              # Base fetch wrapper with auth
│   │   │   ├── auth.ts                # Authentication endpoints
│   │   │   ├── rooms.ts               # Room catalog endpoints
│   │   │   ├── bookings.ts            # Booking endpoints
│   │   │   └── chat.ts                # Chat endpoints
│   │   ├── stores/                    # Zustand stores
│   │   │   ├── authStore.ts           # Authentication state
│   │   │   ├── bookingStore.ts        # Booking flow state
│   │   │   ├── chatStore.ts           # Chat session state
│   │   │   └── uiStore.ts             # UI state (modals, toasts)
│   │   ├── hooks/                     # Custom React hooks
│   │   │   ├── useRooms.ts            # SWR hook for rooms
│   │   │   ├── useBookings.ts         # SWR hook for bookings
│   │   │   ├── useAdminDashboard.ts   # SWR hook for dashboard
│   │   │   ├── useAuth.ts             # Auth helper hook
│   │   │   └── useTheme.ts            # Theme management hook
│   │   └── utils/                     # Utility functions
│   │       ├── date.ts                # Date formatting helpers
│   │       ├── currency.ts            # Currency formatting
│   │       ├── validation.ts          # Form validation rules
│   │       └── cn.ts                  # Tailwind class name merger
│   │
│   ├── types/                      # TypeScript type definitions
│   │   └── index.ts                   # All type exports (from data-model.md)
│   │
│   └── styles/                     # Global styles
│       └── globals.css                # Tailwind base, CSS variables, theme
│
├── public/                         # Static assets
│   ├── images/
│   │   ├── rooms/                     # Room images by type
│   │   │   ├── standard/
│   │   │   │   ├── main.jpg
│   │   │   │   ├── gallery-1.jpg
│   │   │   │   └── gallery-2.jpg
│   │   │   ├── deluxe/
│   │   │   ├── suite/
│   │   │   ├── executive/
│   │   │   └── presidential/
│   │   ├── lobby/                     # Hotel lobby/exterior
│   │   │   ├── exterior.jpg
│   │   │   └── interior.jpg
│   │   └── amenities/                 # Amenities images
│   │       ├── pool.jpg
│   │       ├── restaurant.jpg
│   │       └── spa.jpg
│   ├── logo.svg                       # Hotel logo
│   └── favicon.ico                    # Site favicon
│
├── tests/                          # Test files
│   ├── components/                    # Component unit tests
│   │   ├── ui/
│   │   │   ├── Button.test.tsx
│   │   │   └── Modal.test.tsx
│   │   └── chat/
│   │       └── ChatMessage.test.tsx
│   ├── integration/                   # Integration tests
│   │   └── booking-flow.test.ts
│   ├── e2e/                           # Playwright E2E tests
│   │   ├── chat.spec.ts
│   │   ├── room-catalog.spec.ts
│   │   ├── booking-flow.spec.ts
│   │   └── admin-dashboard.spec.ts
│   └── a11y/                          # Accessibility tests
│       ├── home.spec.ts
│       └── chat.spec.ts
│
├── Dockerfile                      # Multi-stage Docker build
├── .dockerignore                   # Docker build exclusions
├── docker-compose.yml              # Local development with backend
├── next.config.js                  # Next.js configuration (standalone output)
├── tailwind.config.ts              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── tsconfig.json                   # TypeScript configuration
├── jest.config.js                  # Jest configuration
├── jest.setup.js                   # Jest setup file
├── playwright.config.ts            # Playwright configuration
├── .eslintrc.json                  # ESLint configuration
├── .prettierrc                     # Prettier configuration
├── .env.local                      # Environment variables (not committed)
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies and scripts
└── package-lock.json               # Dependency lock file
```

---

**Structure Decision**: 

This is a **web application** structure with frontend separate from existing backend. The frontend follows Next.js 15 App Router conventions with file-system based routing.

**Key Decisions**:

1. **App Router over Pages Router**: Modern Next.js approach with better performance, streaming, and server components support

2. **Separate `components/` directory**: Organized by feature domain (chat, rooms, admin) rather than component type for better scalability

3. **Zustand stores in `lib/stores/`**: Global state management separated from components

4. **API client in `lib/api/`**: Centralized API integration with consistent error handling

5. **Types in single `types/index.ts`**: Central type definitions exported from one location for easy imports

6. **Tests mirror `src/` structure**: Easy to locate tests for each component

7. **Public images organized by category**: Rooms, lobby, amenities folders for thesis demonstration

8. **Docker deployment**: Standalone mode for small production image (~100MB vs 1GB+)

This structure supports the thesis demonstration requirements with clear separation of concerns, inline documentation, and maintainable code organization.

---

## Complexity Tracking

**No violations requiring justification.**

All constitution principles are compliant. The frontend application follows established patterns, uses standard technologies, and maintains simplicity appropriate for thesis demonstration scope.

---

**Plan Version**: 1.0.0
**Status**: Ready for task generation (/speckit.tasks)
**Next Command**: `/speckit.tasks`
