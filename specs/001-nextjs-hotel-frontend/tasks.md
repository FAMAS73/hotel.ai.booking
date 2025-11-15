# Tasks: Next.js Hotel Frontend Website

**Input**: Design documents from `/specs/001-nextjs-hotel-frontend/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: NOT REQUESTED in spec.md - no test tasks will be generated
**Organization**: Tasks grouped by user story for independent implementation

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Frontend project at repository root: `frontend/`
- Source files: `frontend/src/`
- Components: `frontend/src/components/`
- Pages: `frontend/src/app/`
- Paths shown use frontend/ prefix

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create frontend/ directory structure per implementation plan
- [ ] T002 Initialize Next.js 15 project with TypeScript in frontend/
- [ ] T003 [P] Install core dependencies (React 19, Tailwind CSS 4.x, Zustand, SWR, Radix UI)
- [ ] T004 [P] Configure TypeScript with strict mode in frontend/tsconfig.json
- [ ] T005 [P] Configure Tailwind CSS 4.x with dark mode support in frontend/tailwind.config.ts
- [ ] T006 [P] Configure ESLint and Prettier in frontend/.eslintrc.json and frontend/.prettierrc
- [ ] T007 [P] Create environment variables template in frontend/.env.example
- [ ] T008 [P] Configure Next.js standalone output mode in frontend/next.config.js
- [ ] T009 [P] Create Docker configuration in frontend/Dockerfile
- [ ] T010 [P] Create docker-compose.yml for local development with backend

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T011 Create TypeScript type definitions in frontend/src/types/index.ts (from data-model.md)
- [ ] T012 [P] Create base API client with JWT auth in frontend/src/lib/api/client.ts
- [ ] T013 [P] Create authStore in frontend/src/lib/stores/authStore.ts
- [ ] T014 [P] Create uiStore for modals/toasts in frontend/src/lib/stores/uiStore.ts
- [ ] T015 [P] Create useAuth hook in frontend/src/lib/hooks/useAuth.ts
- [ ] T016 [P] Create useTheme hook in frontend/src/lib/hooks/useTheme.ts
- [ ] T017 Create globals.css with CSS variables and Tailwind base in frontend/src/app/globals.css
- [ ] T018 Create root layout with theme provider in frontend/src/app/layout.tsx
- [ ] T019 [P] Create shared UI components: Button in frontend/src/components/ui/Button.tsx
- [ ] T020 [P] Create shared UI components: Card in frontend/src/components/ui/Card.tsx
- [ ] T021 [P] Create shared UI components: Modal in frontend/src/components/ui/Modal.tsx
- [ ] T022 [P] Create shared UI components: Input in frontend/src/components/ui/Input.tsx
- [ ] T023 [P] Create shared UI components: LoadingSpinner in frontend/src/components/ui/LoadingSpinner.tsx
- [ ] T024 [P] Create shared UI components: ErrorMessage in frontend/src/components/ui/ErrorMessage.tsx
- [ ] T025 Create Header component with navigation in frontend/src/components/layout/Header.tsx
- [ ] T026 Create Footer component in frontend/src/components/layout/Footer.tsx
- [ ] T027 Create ThemeToggle component in frontend/src/components/layout/ThemeToggle.tsx
- [ ] T028 Create utility functions (date, currency, validation) in frontend/src/lib/utils/

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Guest Chat Interaction (Priority: P1) 🎯 MVP

**Goal**: Guests interact with AI chatbot through ChatGPT-like interface for bookings, room info, and concierge

**Independent Test**: Open /chat page, send "What are my bookings?", verify AI response displays within 3 seconds

### Implementation for User Story 1

- [ ] T029 [P] [US1] Create Chat API client in frontend/src/lib/api/chat.ts
- [ ] T030 [P] [US1] Create chatStore for session/messages in frontend/src/lib/stores/chatStore.ts
- [ ] T031 [P] [US1] Create ChatMessage component in frontend/src/components/chat/ChatMessage.tsx
- [ ] T032 [P] [US1] Create TypingIndicator component in frontend/src/components/chat/TypingIndicator.tsx
- [ ] T033 [P] [US1] Create ChatInput component in frontend/src/components/chat/ChatInput.tsx
- [ ] T034 [US1] Create ChatInterface container component in frontend/src/components/chat/ChatInterface.tsx (integrates T031-T033)
- [ ] T035 [US1] Create chat page in frontend/src/app/chat/page.tsx
- [ ] T036 [US1] Add rich message formatting support (markdown, links) in ChatMessage component
- [ ] T037 [US1] Implement auto-scroll to latest message in ChatInterface
- [ ] T038 [US1] Add session management (new chat, load history) in ChatInterface
- [ ] T039 [US1] Add inline comments explaining chat logic per constitution principle I

**Checkpoint**: User Story 1 complete - chat interface fully functional and independently testable

---

## Phase 4: User Story 2 - Room Catalog Browsing (Priority: P1)

**Goal**: Guests browse rooms with filters, images, pricing, and availability

**Independent Test**: Navigate to /rooms, apply date filters, verify available rooms display with accurate pricing

### Implementation for User Story 2

- [ ] T040 [P] [US2] Create Room API client in frontend/src/lib/api/rooms.ts
- [ ] T041 [P] [US2] Create useRooms hook with SWR in frontend/src/lib/hooks/useRooms.ts
- [ ] T042 [P] [US2] Create DatePicker component in frontend/src/components/ui/DatePicker.tsx
- [ ] T043 [P] [US2] Create Select component in frontend/src/components/ui/Select.tsx
- [ ] T044 [P] [US2] Create AvailabilityBadge component in frontend/src/components/rooms/AvailabilityBadge.tsx
- [ ] T045 [P] [US2] Create RoomCard component in frontend/src/components/rooms/RoomCard.tsx
- [ ] T046 [US2] Create RoomFilter component in frontend/src/components/rooms/RoomFilter.tsx (uses T042, T043)
- [ ] T047 [P] [US2] Create RoomGallery component with lightbox in frontend/src/components/rooms/RoomGallery.tsx
- [ ] T048 [US2] Create RoomList container component in frontend/src/components/rooms/RoomList.tsx
- [ ] T049 [US2] Create rooms catalog page in frontend/src/app/rooms/page.tsx
- [ ] T050 [P] [US2] Create RoomDetails component in frontend/src/components/rooms/RoomDetails.tsx
- [ ] T051 [US2] Create room detail page in frontend/src/app/rooms/[id]/page.tsx
- [ ] T052 [US2] Add image optimization with Next.js Image component in RoomCard and RoomGallery
- [ ] T053 [US2] Implement responsive grid layout (1 col mobile, 3+ cols desktop) in RoomList
- [ ] T054 [US2] Add inline comments explaining room catalog logic per constitution

**Checkpoint**: User Story 2 complete - room catalog fully functional and independently testable

---

## Phase 5: User Story 5 - Guest Authentication (Priority: P3)

**Goal**: Guests register, login, manage profiles and booking history

**Independent Test**: Register new account, login, view booking history, update profile

**Note**: Moved before US3 and US4 because admin dashboard (US3) requires authentication

### Implementation for User Story 5

- [ ] T055 [P] [US5] Create Auth API client in frontend/src/lib/api/auth.ts
- [ ] T056 [P] [US5] Create LoginForm component in frontend/src/components/auth/LoginForm.tsx
- [ ] T057 [P] [US5] Create RegisterForm component in frontend/src/components/auth/RegisterForm.tsx
- [ ] T058 [P] [US5] Create ProtectedRoute wrapper in frontend/src/components/auth/ProtectedRoute.tsx
- [ ] T059 [US5] Create auth layout in frontend/src/app/auth/layout.tsx
- [ ] T060 [US5] Create login page in frontend/src/app/auth/login/page.tsx
- [ ] T061 [US5] Create register page in frontend/src/app/auth/register/page.tsx
- [ ] T062 [P] [US5] Create ProfileForm component in frontend/src/components/profile/ProfileForm.tsx
- [ ] T063 [P] [US5] Create BookingHistory component in frontend/src/components/profile/BookingHistory.tsx
- [ ] T064 [US5] Create profile page in frontend/src/app/profile/page.tsx
- [ ] T065 [US5] Implement JWT token management (httpOnly cookies or localStorage with warnings)
- [ ] T066 [US5] Add token refresh logic in API client
- [ ] T067 [US5] Implement route protection middleware in frontend/src/middleware.ts
- [ ] T068 [US5] Add inline comments explaining auth flow per constitution

**Checkpoint**: User Story 5 complete - authentication fully functional

---

## Phase 6: User Story 3 - Admin Dashboard (Priority: P2)

**Goal**: Hotel staff view booking data, occupancy stats, manage bookings for thesis demo

**Independent Test**: Login as admin, view dashboard stats, execute demo booking operations

**Depends on**: User Story 5 (authentication required for admin access)

### Implementation for User Story 3

- [ ] T069 [P] [US3] Create Bookings API client in frontend/src/lib/api/bookings.ts
- [ ] T070 [P] [US3] Create useBookings hook with SWR in frontend/src/lib/hooks/useBookings.ts
- [ ] T071 [P] [US3] Create useAdminDashboard hook in frontend/src/lib/hooks/useAdminDashboard.ts
- [ ] T072 [P] [US3] Create DashboardStats component in frontend/src/components/admin/DashboardStats.tsx
- [ ] T073 [P] [US3] Create OccupancyChart component in frontend/src/components/admin/OccupancyChart.tsx
- [ ] T074 [P] [US3] Create RevenueChart component in frontend/src/components/admin/RevenueChart.tsx
- [ ] T075 [P] [US3] Create BookingFilters component in frontend/src/components/admin/BookingFilters.tsx
- [ ] T076 [US3] Create BookingsTable component in frontend/src/components/admin/BookingsTable.tsx
- [ ] T077 [P] [US3] Create AdminSidebar navigation in frontend/src/components/layout/AdminSidebar.tsx
- [ ] T078 [US3] Create admin layout in frontend/src/app/admin/layout.tsx
- [ ] T079 [US3] Create admin dashboard page in frontend/src/app/admin/page.tsx
- [ ] T080 [US3] Create admin bookings page in frontend/src/app/admin/bookings/page.tsx
- [ ] T081 [US3] Implement real-time updates (5-second polling) in useAdminDashboard
- [ ] T082 [US3] Add booking management actions (view, cancel) in BookingsTable
- [ ] T083 [US3] Add export functionality (CSV) for booking data
- [ ] T084 [US3] Add inline comments explaining admin dashboard logic per constitution

**Checkpoint**: User Story 3 complete - admin dashboard fully functional

---

## Phase 7: User Story 4 - Theme and Accessibility (Priority: P2)

**Goal**: Light/dark themes with accessible colors (no purple), WCAG 2.1 AA compliance

**Independent Test**: Toggle theme on all pages, verify contrast ratios with accessibility tools

### Implementation for User Story 4

- [ ] T085 [P] [US4] Define color palette (blue/green/amber, no purple) in tailwind.config.ts
- [ ] T086 [P] [US4] Create CSS variable theme tokens in globals.css
- [ ] T087 [P] [US4] Implement dark mode using Tailwind data-theme attribute
- [ ] T088 [US4] Update ThemeToggle with smooth transition animation
- [ ] T089 [US4] Add system theme detection on first visit
- [ ] T090 [US4] Persist theme preference to localStorage
- [ ] T091 [US4] Update all components to support theme (audit chat, rooms, admin pages)
- [ ] T092 [US4] Add ARIA labels to all interactive elements across components
- [ ] T093 [US4] Implement keyboard navigation support in Modal, RoomGallery, ChatInterface
- [ ] T094 [US4] Ensure colorblind-friendly status indicators (use text/icons, not just color)
- [ ] T095 [US4] Verify WCAG AA contrast ratios (4.5:1 text, 3:1 large text) in both themes
- [ ] T096 [US4] Add skip-to-content links for screen readers
- [ ] T097 [US4] Add inline comments explaining accessibility implementations

**Checkpoint**: User Story 4 complete - themes and accessibility fully implemented

---

## Phase 8: Home Page and Navigation

**Purpose**: Landing page and overall site navigation

- [ ] T098 [P] Create HeroSection component in frontend/src/components/home/HeroSection.tsx
- [ ] T099 [P] Create QuickSearch widget in frontend/src/components/home/QuickSearch.tsx
- [ ] T100 [P] Create FeaturedRooms carousel in frontend/src/components/home/FeaturedRooms.tsx
- [ ] T101 [P] Create Amenities showcase in frontend/src/components/home/Amenities.tsx
- [ ] T102 Create home page in frontend/src/app/page.tsx (integrates T098-T101)
- [ ] T103 Update Header navigation with all routes
- [ ] T104 Create 404 page in frontend/src/app/not-found.tsx
- [ ] T105 Create unauthorized page in frontend/src/app/unauthorized/page.tsx

---

## Phase 9: Booking Flow Integration

**Purpose**: Complete booking creation flow

- [ ] T106 [P] Create bookingStore for multi-step flow in frontend/src/lib/stores/bookingStore.ts
- [ ] T107 [P] Create BookingForm component in frontend/src/components/bookings/BookingForm.tsx
- [ ] T108 [P] Create BookingCard component in frontend/src/components/bookings/BookingCard.tsx
- [ ] T109 [P] Create BookingDetailView component in frontend/src/components/bookings/BookingDetailView.tsx
- [ ] T110 [P] Create CancelBookingModal component in frontend/src/components/bookings/CancelBookingModal.tsx
- [ ] T111 Create bookings list page in frontend/src/app/bookings/page.tsx
- [ ] T112 Create booking detail page in frontend/src/app/bookings/[id]/page.tsx
- [ ] T113 Integrate BookingForm into room detail page (/rooms/[id])
- [ ] T114 Add booking flow state persistence to localStorage

---

## Phase 10: Image Management

**Purpose**: Hotel and room images for decoration

- [ ] T115 Create image directory structure in frontend/public/images/ (rooms/, lobby/, amenities/)
- [ ] T116 Add placeholder images for 5 room types (3-5 images each)
- [ ] T117 Add hotel lobby/exterior images
- [ ] T118 Add amenities images (pool, restaurant, spa)
- [ ] T119 Implement lazy loading with Next.js Image in all image components
- [ ] T120 Add alt text for all images per accessibility requirements

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and system-wide features

- [ ] T121 [P] Add loading states to all async operations (chat, rooms, bookings, admin)
- [ ] T122 [P] Add error boundaries for graceful error handling
- [ ] T123 [P] Create Toast notification system in frontend/src/components/ui/Toast.tsx
- [ ] T124 [P] Implement form validation across all forms (login, register, booking, profile)
- [ ] T125 Add SEO metadata to all pages (titles, descriptions, OG tags)
- [ ] T126 Optimize bundle size (check next.config.js, lazy load heavy components)
- [ ] T127 Add performance monitoring (Web Vitals logging)
- [ ] T128 Create system architecture diagram showing frontend-backend API connections (per FR-052)
- [ ] T129 Review all components for inline comment completeness (constitution principle I)
- [ ] T130 Create demo script for thesis presentation in quickstart.md
- [ ] T131 Run accessibility audit with axe-core on all pages
- [ ] T132 Final cross-browser testing (Chrome, Firefox, Safari, Edge)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - No other story dependencies
- **User Story 2 (Phase 4)**: Depends on Foundational - No other story dependencies
- **User Story 5 (Phase 5)**: Depends on Foundational - No other story dependencies
- **User Story 3 (Phase 6)**: Depends on Foundational AND User Story 5 (needs auth)
- **User Story 4 (Phase 7)**: Depends on Foundational - Applies to all pages
- **Home Page (Phase 8)**: Depends on Foundational and some story components
- **Booking Flow (Phase 9)**: Depends on US2 (rooms) and US5 (auth)
- **Images (Phase 10)**: Can proceed in parallel with any phase
- **Polish (Phase 11)**: Depends on all desired user stories complete

### User Story Dependencies

- **User Story 1 (Chat)**: Independent after Foundational ✓
- **User Story 2 (Rooms)**: Independent after Foundational ✓
- **User Story 5 (Auth)**: Independent after Foundational ✓
- **User Story 3 (Admin)**: Requires User Story 5 (auth) ⚠️
- **User Story 4 (Theme)**: Independent, but best after some pages exist ✓

### Recommended Execution Order

**Sequential (Single Developer)**:
1. Phase 1: Setup (T001-T010)
2. Phase 2: Foundational (T011-T028) 🚧 MUST COMPLETE BEFORE STORIES
3. Phase 3: User Story 1 - Chat (T029-T039) 🎯 MVP
4. Phase 4: User Story 2 - Rooms (T040-T054)
5. Phase 5: User Story 5 - Auth (T055-T068)
6. Phase 6: User Story 3 - Admin (T069-T084)
7. Phase 7: User Story 4 - Theme (T085-T097)
8. Phases 8-11: Remaining features and polish

**Parallel (Multiple Developers)**:
1. Complete Setup + Foundational together (T001-T028)
2. Once Foundational done, split stories:
   - Developer A: User Story 1 (Chat)
   - Developer B: User Story 2 (Rooms)
   - Developer C: User Story 5 (Auth)
3. After auth complete, Developer C tackles User Story 3 (Admin)
4. User Story 4 (Theme) can be done by any developer after pages exist

---

## Parallel Example: User Story 1 (Chat)

```bash
# Within User Story 1, these tasks can run in parallel:

Parallel Group 1 (different files, no dependencies):
- T029 [P] [US1] Create Chat API client
- T030 [P] [US1] Create chatStore
- T031 [P] [US1] Create ChatMessage component
- T032 [P] [US1] Create TypingIndicator component
- T033 [P] [US1] Create ChatInput component

Sequential After Group 1:
- T034 [US1] Create ChatInterface (needs T031-T033)
- T035 [US1] Create chat page (needs T034)
- T036 [US1] Add rich formatting (enhances T031)
- T037 [US1] Implement auto-scroll (enhances T034)
- T038 [US1] Add session management (enhances T034)
- T039 [US1] Add inline comments
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

**Goal**: Get chat interface working as quickly as possible for thesis demo

1. Complete Phase 1: Setup (T001-T010)
2. Complete Phase 2: Foundational (T011-T028) - CRITICAL
3. Complete Phase 3: User Story 1 (T029-T039)
4. **STOP and VALIDATE**: Test chat independently
5. Demo chat interface to advisor/thesis committee

**Benefits**:
- Earliest possible demonstration of core AI chatbot integration
- Validates frontend-backend connection
- Proves concept before investing in remaining features

### Incremental Delivery

**Iteration 1** (MVP - Weeks 1-2):
- Setup + Foundational → User Story 1 (Chat)
- Deploy → Demo

**Iteration 2** (Booking Core - Weeks 3-4):
- User Story 2 (Rooms) + User Story 5 (Auth)
- Deploy → Demo

**Iteration 3** (Admin Dashboard - Week 5):
- User Story 3 (Admin)
- Deploy → Demo

**Iteration 4** (Polish - Week 6):
- User Story 4 (Theme) + Home Page + Booking Flow + Images
- Final Polish
- Deploy → Final Demo

**Iteration 5** (Thesis Prep - Week 7):
- Create system architecture diagram (T128)
- Write demo script (T130)
- Accessibility audit (T131)
- Final testing (T132)

### Parallel Team Strategy

With 3 developers working simultaneously:

**Week 1**:
- All: Complete Setup + Foundational together (T001-T028)

**Week 2**:
- Dev A: User Story 1 - Chat (T029-T039)
- Dev B: User Story 2 - Rooms (T040-T054)
- Dev C: User Story 5 - Auth (T055-T068)

**Week 3**:
- Dev A: User Story 4 - Theme (T085-T097)
- Dev B: Home Page (T098-T105)
- Dev C: User Story 3 - Admin (T069-T084, requires auth from Week 2)

**Week 4**:
- Dev A: Booking Flow (T106-T114)
- Dev B: Images (T115-T120)
- Dev C: Polish (T121-T132)

**Result**: All features complete in 4 weeks instead of 7 weeks sequential

---

## Notes

- All tasks include exact file paths for clarity
- [P] tasks can run in parallel (different files, no blocking dependencies)
- [Story] labels map tasks to specific user stories for traceability
- Each user story is independently completable and testable
- Constitution compliance (inline comments, security, accessibility) built into tasks
- Tests NOT REQUESTED in spec.md - no test tasks generated
- Stop at any checkpoint to validate story independently before continuing
- Prioritize completing User Story 1 (Chat) as MVP before expanding scope

---

**Total Task Count**: 132 tasks
**User Story 1 (MVP)**: 11 tasks (T029-T039)
**Parallel Opportunities**: ~40-50 tasks marked [P] across all phases
**Estimated Timeline**: 6-7 weeks sequential, 3-4 weeks with 3 developers
