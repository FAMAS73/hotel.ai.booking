# Tasks: Next.js Hotel Frontend Website

**Input**: Design documents from `/specs/001-nextjs-hotel-frontend/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: REQUESTED - Live testing tasks included for each user story checkpoint
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

- [X] T001 Create frontend/ directory structure per implementation plan
- [X] T002 Initialize Next.js 15 project with TypeScript in frontend/
- [X] T003 [P] Install core dependencies (React 19, Tailwind CSS 4.x, Zustand, SWR, Radix UI)
- [X] T004 [P] Configure TypeScript with strict mode in frontend/tsconfig.json
- [X] T005 [P] Configure Tailwind CSS 4.x with dark mode support in frontend/tailwind.config.ts
- [X] T006 [P] Configure ESLint and Prettier in frontend/.eslintrc.json and frontend/.prettierrc
- [X] T007 [P] Create environment variables template in frontend/.env.example
- [X] T008 [P] Configure Next.js standalone output mode in frontend/next.config.js
- [X] T009 [P] Create Docker configuration in frontend/Dockerfile
- [X] T010 [P] Create docker-compose.yml for local development with backend

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T011 Create TypeScript type definitions in frontend/src/types/index.ts (from data-model.md)
- [X] T012 [P] Create base API client with JWT auth in frontend/src/lib/api/client.ts
- [X] T013 [P] Create authStore in frontend/src/lib/stores/authStore.ts
- [X] T014 [P] Create uiStore for modals/toasts in frontend/src/lib/stores/uiStore.ts
- [X] T015 [P] Create useAuth hook in frontend/src/lib/hooks/useAuth.ts
- [X] T016 [P] Create useTheme hook in frontend/src/lib/hooks/useTheme.ts
- [X] T017 Create globals.css with CSS variables and Tailwind base in frontend/src/app/globals.css
- [X] T018 Create root layout with theme provider in frontend/src/app/layout.tsx
- [X] T019 [P] Create shared UI components: Button in frontend/src/components/ui/Button.tsx
- [X] T020 [P] Create shared UI components: Card in frontend/src/components/ui/Card.tsx
- [X] T021 [P] Create shared UI components: Modal in frontend/src/components/ui/Modal.tsx
- [X] T022 [P] Create shared UI components: Input in frontend/src/components/ui/Input.tsx
- [X] T023 [P] Create shared UI components: LoadingSpinner in frontend/src/components/ui/LoadingSpinner.tsx
- [X] T024 [P] Create shared UI components: ErrorMessage in frontend/src/components/ui/ErrorMessage.tsx
- [X] T025 Create Header component with navigation in frontend/src/components/layout/Header.tsx
- [X] T026 Create Footer component in frontend/src/components/layout/Footer.tsx
- [X] T027 Create ThemeToggle component in frontend/src/components/layout/ThemeToggle.tsx
- [X] T028 Create utility functions (date, currency, validation) in frontend/src/lib/utils/

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Guest Chat Interaction (Priority: P1) 🎯 MVP

**Goal**: Guests interact with AI chatbot through ChatGPT-like interface for bookings, room info, and concierge

**Independent Test**: Open /chat page, send "What are my bookings?", verify AI response displays within 3 seconds

### Implementation for User Story 1

- [X] T029 [P] [US1] Create Chat API client in frontend/src/lib/api/chat.ts
- [X] T030 [P] [US1] Create chatStore for session/messages in frontend/src/lib/stores/chatStore.ts
- [X] T031 [P] [US1] Create ChatMessage component in frontend/src/components/chat/ChatMessage.tsx
- [X] T032 [P] [US1] Create TypingIndicator component in frontend/src/components/chat/TypingIndicator.tsx
- [X] T033 [P] [US1] Create ChatInput component in frontend/src/components/chat/ChatInput.tsx
- [X] T034 [US1] Create ChatInterface container component in frontend/src/components/chat/ChatInterface.tsx (integrates T031-T033)
- [X] T035 [US1] Create chat page in frontend/src/app/chat/page.tsx
- [X] T036 [US1] Add rich message formatting support (markdown, links) in ChatMessage component
- [X] T037 [US1] Implement auto-scroll to latest message in ChatInterface
- [X] T038 [US1] Add session management (new chat, load history) in ChatInterface
- [X] T039 [US1] Add inline comments explaining chat logic per constitution principle I

### Testing for User Story 1

- [X] T040 [US1] Test live chat: Send message "What are my bookings?" and verify AI response
- [ ] T041 [US1] Test live chat: Ask about room types and verify AI provides room information
- [ ] T042 [US1] Test live chat: Ask about Bangkok attractions and verify concierge responses
- [ ] T043 [US1] Test chat session persistence: Refresh page and verify conversation history loads
- [ ] T044 [US1] Test new chat session: Create new chat and verify previous messages archived
- [ ] T045 [US1] Test typing indicator: Verify animation appears while waiting for AI response
- [ ] T046 [US1] Test auto-scroll: Send multiple messages and verify scroll to latest works

**Checkpoint**: User Story 1 complete - chat interface fully functional and independently testable with live AI interaction

---

## Phase 4: User Story 2 - Room Catalog Browsing (Priority: P1)

**Goal**: Guests browse rooms with filters, images, pricing, and availability

**Independent Test**: Navigate to /rooms, apply date filters, verify available rooms display with accurate pricing

### Implementation for User Story 2

- [X] T047 [P] [US2] Create Room API client in frontend/src/lib/api/rooms.ts
- [X] T048 [P] [US2] Create useRooms hook with SWR in frontend/src/lib/hooks/useRooms.ts
- [X] T049 [P] [US2] Create DatePicker component in frontend/src/components/ui/DatePicker.tsx
- [X] T050 [P] [US2] Create Select component in frontend/src/components/ui/Select.tsx
- [X] T051 [P] [US2] Create AvailabilityBadge component in frontend/src/components/rooms/AvailabilityBadge.tsx
- [X] T052 [P] [US2] Create RoomCard component in frontend/src/components/rooms/RoomCard.tsx
- [X] T053 [US2] Create RoomFilter component in frontend/src/components/rooms/RoomFilter.tsx (uses T049, T050)
- [X] T054 [P] [US2] Create RoomGallery component with lightbox in frontend/src/components/rooms/RoomGallery.tsx
- [X] T055 [US2] Create RoomList container component in frontend/src/components/rooms/RoomList.tsx
- [X] T056 [US2] Create rooms catalog page in frontend/src/app/rooms/page.tsx
- [X] T057 [P] [US2] Create RoomDetails component in frontend/src/components/rooms/RoomDetails.tsx
- [X] T058 [US2] Create room detail page in frontend/src/app/rooms/[id]/page.tsx
- [X] T059 [US2] Add image optimization with Next.js Image component in RoomCard and RoomGallery
- [X] T060 [US2] Implement responsive grid layout (1 col mobile, 3+ cols desktop) in RoomList
- [X] T061 [US2] Add inline comments explaining room catalog logic per constitution

### Booking Flow Integration for User Story 2

- [ ] T062 [P] [US2] Create bookingStore for multi-step flow in frontend/src/lib/stores/bookingStore.ts
- [ ] T063 [P] [US2] Create Bookings API client in frontend/src/lib/api/bookings.ts
- [ ] T064 [P] [US2] Create BookingForm component in frontend/src/components/bookings/BookingForm.tsx
- [ ] T065 [US2] Integrate BookingForm into room detail page (/rooms/[id]) with "Book Now" button
- [ ] T066 [US2] Add booking confirmation flow (select dates, guests, special requests)
- [ ] T067 [US2] Add booking submission to backend API with loading/error states
- [ ] T068 [US2] Add booking success modal with confirmation details

### Testing for User Story 2

- [ ] T069 [US2] Test room catalog: Navigate to /rooms and verify all 5 room types display
- [ ] T070 [US2] Test date filtering: Select check-in/out dates and verify availability updates
- [ ] T071 [US2] Test guest count filter: Change guest count and verify room capacity filtering
- [ ] T072 [US2] Test room card click: Click on room card and verify detail page opens
- [ ] T073 [US2] Test image gallery: Click through room images and verify lightbox works
- [ ] T074 [US2] Test booking flow: Click "Book Now", fill form, and submit booking
- [ ] T075 [US2] Test booking API: Verify booking created in backend database
- [ ] T076 [US2] Test booking validation: Try invalid dates and verify error messages
- [ ] T077 [US2] Test responsive layout: Verify grid layout on mobile (1 col) and desktop (3 cols)

**Checkpoint**: User Story 2 complete - room catalog and booking flow fully functional with live testing

---

## Phase 5: User Story 5 - Guest Authentication (Priority: P3)

**Goal**: Guests register, login, manage profiles and booking history

**Independent Test**: Register new account, login, view booking history, update profile

**Note**: Moved before US3 and US4 because admin dashboard (US3) requires authentication

### Implementation for User Story 5

- [ ] T078 [P] [US5] Create Auth API client in frontend/src/lib/api/auth.ts
- [ ] T079 [P] [US5] Create LoginForm component in frontend/src/components/auth/LoginForm.tsx
- [ ] T080 [P] [US5] Create RegisterForm component in frontend/src/components/auth/RegisterForm.tsx
- [ ] T081 [P] [US5] Create ProtectedRoute wrapper in frontend/src/components/auth/ProtectedRoute.tsx
- [ ] T082 [US5] Create auth layout in frontend/src/app/auth/layout.tsx
- [ ] T083 [US5] Create login page in frontend/src/app/auth/login/page.tsx
- [ ] T084 [US5] Create register page in frontend/src/app/auth/register/page.tsx
- [ ] T085 [P] [US5] Create ProfileForm component in frontend/src/components/profile/ProfileForm.tsx
- [ ] T086 [P] [US5] Create BookingHistory component in frontend/src/components/profile/BookingHistory.tsx
- [ ] T087 [US5] Create profile page in frontend/src/app/profile/page.tsx
- [ ] T088 [US5] Implement JWT token management (httpOnly cookies or localStorage with warnings)
- [ ] T089 [US5] Add token refresh logic in API client
- [ ] T090 [US5] Implement route protection middleware in frontend/src/middleware.ts
- [ ] T091 [US5] Add inline comments explaining auth flow per constitution

### Testing for User Story 5

- [ ] T092 [US5] Test registration: Register new account with lightningboat24@gmail.com test variant
- [ ] T093 [US5] Test login: Login with test credentials and verify JWT token received
- [ ] T094 [US5] Test user session: Verify logged-in state persists across page refreshes
- [ ] T095 [US5] Test protected routes: Try accessing /profile without login and verify redirect
- [ ] T096 [US5] Test booking history: Login and verify bookings display in profile
- [ ] T097 [US5] Test profile update: Edit profile information and verify changes saved
- [ ] T098 [US5] Test logout: Logout and verify session cleared, redirect to home
- [ ] T099 [US5] Test token expiry: Wait for token expiry and verify auto-refresh or re-login prompt

**Checkpoint**: User Story 5 complete - authentication fully functional with live session testing

---

## Phase 6: User Story 3 - Admin Dashboard (Priority: P2)

**Goal**: Hotel staff view booking data, occupancy stats, manage bookings, upload room images

**Independent Test**: Login as admin, view dashboard stats, execute demo booking operations, upload room images

**Depends on**: User Story 5 (authentication required for admin access)

### Implementation for User Story 3

- [ ] T100 [P] [US3] Create useBookings hook with SWR in frontend/src/lib/hooks/useBookings.ts
- [ ] T101 [P] [US3] Create useAdminDashboard hook in frontend/src/lib/hooks/useAdminDashboard.ts
- [ ] T102 [P] [US3] Create DashboardStats component in frontend/src/components/admin/DashboardStats.tsx
- [ ] T103 [P] [US3] Create OccupancyChart component in frontend/src/components/admin/OccupancyChart.tsx
- [ ] T104 [P] [US3] Create RevenueChart component in frontend/src/components/admin/RevenueChart.tsx
- [ ] T105 [P] [US3] Create BookingFilters component in frontend/src/components/admin/BookingFilters.tsx
- [ ] T106 [US3] Create BookingsTable component in frontend/src/components/admin/BookingsTable.tsx
- [ ] T107 [P] [US3] Create AdminSidebar navigation in frontend/src/components/layout/AdminSidebar.tsx
- [ ] T108 [US3] Create admin layout in frontend/src/app/admin/layout.tsx
- [ ] T109 [US3] Create admin dashboard page in frontend/src/app/admin/page.tsx
- [ ] T110 [US3] Create admin bookings page in frontend/src/app/admin/bookings/page.tsx
- [ ] T111 [US3] Implement real-time updates (5-second polling) in useAdminDashboard
- [ ] T112 [US3] Add booking management actions (view, cancel) in BookingsTable
- [ ] T113 [US3] Add export functionality (CSV) for booking data

### Image Upload and Management for User Story 3

- [ ] T114 [P] [US3] Create ImageUpload component in frontend/src/components/admin/ImageUpload.tsx
- [ ] T115 [P] [US3] Create RoomImageManager component in frontend/src/components/admin/RoomImageManager.tsx
- [ ] T116 [US3] Create room images management page in frontend/src/app/admin/rooms/images/page.tsx
- [ ] T117 [US3] Implement image upload API endpoint (multipart/form-data) in backend integration
- [ ] T118 [US3] Add image preview before upload in ImageUpload component
- [ ] T119 [US3] Implement drag-and-drop image upload in ImageUpload component
- [ ] T120 [US3] Add image validation (file type, size limits) in ImageUpload
- [ ] T121 [US3] Map uploaded images to room_id in database via API
- [ ] T122 [US3] Display existing room images with edit/delete options in RoomImageManager
- [ ] T123 [US3] Add image ordering/sorting for room galleries in RoomImageManager
- [ ] T124 [US3] Implement image optimization on upload (resize, compress, WebP conversion)
- [ ] T125 [US3] Add inline comments explaining image upload logic per constitution

### Testing for User Story 3

- [ ] T126 [US3] Test admin login: Login with admin credentials and verify dashboard access
- [ ] T127 [US3] Test dashboard stats: Verify occupancy rate, total bookings, revenue display correctly
- [ ] T128 [US3] Test bookings table: Verify all bookings display with guest info, dates, status
- [ ] T129 [US3] Test booking filters: Filter by status (Confirmed, Cancelled) and date range
- [ ] T130 [US3] Test booking search: Search by guest name and verify results
- [ ] T131 [US3] Test booking cancellation: Cancel a test booking and verify status updates
- [ ] T132 [US3] Test real-time updates: Create booking via API and verify dashboard updates within 5s
- [ ] T133 [US3] Test CSV export: Export bookings and verify CSV file downloads correctly
- [ ] T134 [US3] Test image upload: Upload room images (JPEG, PNG, WebP) and verify success
- [ ] T135 [US3] Test image to room mapping: Upload image for room_id=1 (Standard) and verify association
- [ ] T136 [US3] Test image preview: Verify uploaded images display in room catalog immediately
- [ ] T137 [US3] Test image validation: Try uploading invalid file types and verify error messages
- [ ] T138 [US3] Test image deletion: Delete a room image and verify removal from gallery
- [ ] T139 [US3] Test multiple images: Upload 5 images for one room and verify all display in gallery

**Checkpoint**: User Story 3 complete - admin dashboard and image management fully functional with live testing

---

## Phase 7: User Story 4 - Theme and Accessibility (Priority: P2)

**Goal**: Light/dark themes with accessible colors (no purple), WCAG 2.1 AA compliance

**Independent Test**: Toggle theme on all pages, verify contrast ratios with accessibility tools

### Implementation for User Story 4

- [ ] T140 [P] [US4] Define color palette (blue/green/amber, no purple) in tailwind.config.ts
- [ ] T141 [P] [US4] Create CSS variable theme tokens in globals.css
- [ ] T142 [P] [US4] Implement dark mode using Tailwind data-theme attribute
- [ ] T143 [US4] Update ThemeToggle with smooth transition animation
- [ ] T144 [US4] Add system theme detection on first visit
- [ ] T145 [US4] Persist theme preference to localStorage
- [ ] T146 [US4] Update all components to support theme (audit chat, rooms, admin pages)
- [ ] T147 [US4] Add ARIA labels to all interactive elements across components
- [ ] T148 [US4] Implement keyboard navigation support in Modal, RoomGallery, ChatInterface
- [ ] T149 [US4] Ensure colorblind-friendly status indicators (use text/icons, not just color)
- [ ] T150 [US4] Verify WCAG AA contrast ratios (4.5:1 text, 3:1 large text) in both themes
- [ ] T151 [US4] Add skip-to-content links for screen readers
- [ ] T152 [US4] Add inline comments explaining accessibility implementations

### Testing for User Story 4

- [ ] T153 [US4] Test theme toggle: Click theme button and verify smooth transition (<300ms)
- [ ] T154 [US4] Test light theme: Verify all pages readable with sufficient contrast
- [ ] T155 [US4] Test dark theme: Verify all pages readable with high-contrast colors
- [ ] T156 [US4] Test system theme: Set OS to dark mode and verify site follows
- [ ] T157 [US4] Test theme persistence: Toggle theme, refresh page, verify preference saved
- [ ] T158 [US4] Test keyboard navigation: Navigate entire site using only Tab/Enter/Escape keys
- [ ] T159 [US4] Test screen reader: Use NVDA/VoiceOver and verify all content accessible
- [ ] T160 [US4] Test contrast ratios: Run axe DevTools and verify WCAG AA compliance
- [ ] T161 [US4] Test colorblind mode: Use colorblind simulator and verify status indicators clear

**Checkpoint**: User Story 4 complete - themes and accessibility fully implemented with comprehensive testing

---

## Phase 8: Home Page and Navigation

**Purpose**: Landing page and overall site navigation

- [ ] T162 [P] Create HeroSection component in frontend/src/components/home/HeroSection.tsx
- [ ] T163 [P] Create QuickSearch widget in frontend/src/components/home/QuickSearch.tsx
- [ ] T164 [P] Create FeaturedRooms carousel in frontend/src/components/home/FeaturedRooms.tsx
- [ ] T165 [P] Create Amenities showcase in frontend/src/components/home/Amenities.tsx
- [ ] T166 Create home page in frontend/src/app/page.tsx (integrates T162-T165)
- [ ] T167 Update Header navigation with all routes
- [ ] T168 Create 404 page in frontend/src/app/not-found.tsx
- [ ] T169 Create unauthorized page in frontend/src/app/unauthorized/page.tsx

### Testing for Home Page

- [ ] T170 Test home page: Verify hero section, quick search, featured rooms display
- [ ] T171 Test quick search: Enter dates and verify redirect to rooms catalog
- [ ] T172 Test navigation: Click all header links and verify page navigation works
- [ ] T173 Test 404 page: Navigate to invalid URL and verify custom 404 displays

---

## Phase 9: Booking Management

**Purpose**: View and manage existing bookings

- [ ] T174 [P] Create BookingCard component in frontend/src/components/bookings/BookingCard.tsx
- [ ] T175 [P] Create BookingDetailView component in frontend/src/components/bookings/BookingDetailView.tsx
- [ ] T176 [P] Create CancelBookingModal component in frontend/src/components/bookings/CancelBookingModal.tsx
- [ ] T177 Create bookings list page in frontend/src/app/bookings/page.tsx
- [ ] T178 Create booking detail page in frontend/src/app/bookings/[id]/page.tsx
- [ ] T179 Add booking cancellation flow in CancelBookingModal

### Testing for Booking Management

- [ ] T180 Test my bookings: Login and verify user's bookings display
- [ ] T181 Test booking detail: Click on booking and verify full details shown
- [ ] T182 Test booking cancellation: Cancel a future booking and verify status updated

---

## Phase 10: Image Assets

**Purpose**: Hotel and room images for decoration (non-uploaded images)

- [ ] T183 Create image directory structure in frontend/public/images/ (rooms/, lobby/, amenities/)
- [ ] T184 Add placeholder images for 5 room types (3-5 images each as defaults)
- [ ] T185 Add hotel lobby/exterior images
- [ ] T186 Add amenities images (pool, restaurant, spa)
- [ ] T187 Implement lazy loading with Next.js Image in all image components
- [ ] T188 Add alt text for all images per accessibility requirements

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and system-wide features

- [ ] T189 [P] Add loading states to all async operations (chat, rooms, bookings, admin)
- [ ] T190 [P] Add error boundaries for graceful error handling
- [ ] T191 [P] Create Toast notification system in frontend/src/components/ui/Toast.tsx
- [ ] T192 [P] Implement form validation across all forms (login, register, booking, profile)
- [ ] T193 Add SEO metadata to all pages (titles, descriptions, OG tags)
- [ ] T194 Optimize bundle size (check next.config.js, lazy load heavy components)
- [ ] T195 Add performance monitoring (Web Vitals logging)
- [ ] T196 Create system architecture diagram showing frontend-backend API connections (per FR-052)
- [ ] T197 Review all components for inline comment completeness (constitution principle I)
- [ ] T198 Create demo script for thesis presentation in quickstart.md
- [ ] T199 Run accessibility audit with axe-core on all pages
- [ ] T200 Final cross-browser testing (Chrome, Firefox, Safari, Edge)

### Final Integration Testing

- [ ] T201 End-to-end test: Complete user journey from home → browse rooms → book → login → view booking
- [ ] T202 End-to-end test: Admin workflow from login → view dashboard → upload images → manage bookings
- [ ] T203 End-to-end test: Chat integration from any page → ask question → receive AI response
- [ ] T204 Performance test: Verify LCP <2.5s, FID <100ms, CLS <0.1 on all pages
- [ ] T205 Security test: Verify XSS prevention, CSRF protection, JWT validation
- [ ] T206 Mobile test: Verify all features work on mobile devices (320px-767px)

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
- **Booking Management (Phase 9)**: Depends on US2 (rooms) and US5 (auth)
- **Images (Phase 10)**: Can proceed in parallel with any phase
- **Polish (Phase 11)**: Depends on all desired user stories complete

### User Story Dependencies

- **User Story 1 (Chat)**: Independent after Foundational ✓
- **User Story 2 (Rooms + Booking)**: Independent after Foundational ✓
- **User Story 5 (Auth)**: Independent after Foundational ✓
- **User Story 3 (Admin + Image Upload)**: Requires User Story 5 (auth) ⚠️
- **User Story 4 (Theme)**: Independent, but best after some pages exist ✓

### Recommended Execution Order

**Sequential (Single Developer)**:
1. Phase 1: Setup (T001-T010)
2. Phase 2: Foundational (T011-T028) 🚧 MUST COMPLETE BEFORE STORIES
3. Phase 3: User Story 1 - Chat (T029-T046) 🎯 MVP with live testing
4. Phase 4: User Story 2 - Rooms + Booking (T047-T077) with live testing
5. Phase 5: User Story 5 - Auth (T078-T099) with session testing
6. Phase 6: User Story 3 - Admin + Images (T100-T139) with upload testing
7. Phase 7: User Story 4 - Theme (T140-T161) with accessibility testing
8. Phases 8-11: Home, Booking Management, Images, Polish, Final Testing

**Parallel (Multiple Developers)**:
1. Complete Setup + Foundational together (T001-T028)
2. Once Foundational done, split stories:
   - Developer A: User Story 1 (Chat) + Testing
   - Developer B: User Story 2 (Rooms + Booking) + Testing
   - Developer C: User Story 5 (Auth) + Testing
3. After auth complete, Developer C tackles User Story 3 (Admin + Images)
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

Live Testing (sequential after implementation):
- T040 [US1] Test live chat with AI
- T041 [US1] Test room type queries
- T042 [US1] Test concierge responses
- T043 [US1] Test session persistence
- T044 [US1] Test new session creation
- T045 [US1] Test typing indicator
- T046 [US1] Test auto-scroll behavior
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

**Goal**: Get chat interface working with live AI as quickly as possible

1. Complete Phase 1: Setup (T001-T010) - 2-3 days
2. Complete Phase 2: Foundational (T011-T028) - 5-7 days
3. Complete Phase 3: User Story 1 (T029-T046) - 5-7 days with testing
4. **STOP and VALIDATE**: Live test chat with AI, demonstrate to advisor

**Total**: 2-3 weeks to working AI chat with live testing

### Incremental Delivery

**Iteration 1** (MVP - Weeks 1-3):
- Setup + Foundational → User Story 1 (Chat) with live testing
- Deploy → Demo AI interaction

**Iteration 2** (Booking Core - Weeks 4-5):
- User Story 2 (Rooms + Booking) with click and booking testing
- User Story 5 (Auth) with login and session testing
- Deploy → Demo complete booking flow

**Iteration 3** (Admin & Images - Week 6):
- User Story 3 (Admin + Image Upload) with upload and mapping testing
- Deploy → Demo admin capabilities

**Iteration 4** (Polish - Week 7):
- User Story 4 (Theme) with accessibility testing
- Home Page + Booking Management + Images
- Final Polish + Architecture Diagram
- Deploy → Final Demo

### Parallel Team Strategy

With 3 developers working simultaneously:

**Week 1**: All devs complete Setup + Foundational together (T001-T028)

**Week 2**: Split user stories with testing
- Dev A: User Story 1 - Chat (T029-T046) + live AI testing
- Dev B: User Story 2 - Rooms/Booking (T047-T077) + booking testing
- Dev C: User Story 5 - Auth (T078-T099) + session testing

**Week 3**: Continue features
- Dev A: User Story 4 - Theme (T140-T161) + accessibility testing
- Dev B: Home Page (T162-T173)
- Dev C: User Story 3 - Admin/Images (T100-T139) + upload testing

**Week 4**: Final features and testing
- Dev A: Booking Management (T174-T182)
- Dev B: Images (T183-T188)
- Dev C: Polish + Final Testing (T189-T206)

**Result**: All features complete with comprehensive testing in 4 weeks instead of 7 weeks sequential

---

## Notes

- All tasks include exact file paths for clarity
- [P] tasks can run in parallel (different files, no blocking dependencies)
- [Story] labels map tasks to specific user stories for traceability
- Each user story includes mandatory live testing tasks at checkpoints
- Image upload functionality added to User Story 3 (Admin) with testing
- Constitution compliance (inline comments, security, accessibility) built into tasks
- Stop at any checkpoint to validate story independently before continuing
- Prioritize completing User Story 1 (Chat) as MVP with live AI testing before expanding scope

---

**Total Task Count**: 206 tasks (74 new tasks added for testing and image upload)
**User Story 1 (MVP)**: 18 tasks (T029-T046) including 7 live testing tasks
**User Story 2 (Rooms + Booking)**: 33 tasks (T047-T077) including 9 testing tasks
**User Story 5 (Auth)**: 22 tasks (T078-T099) including 8 testing tasks
**User Story 3 (Admin + Images)**: 40 tasks (T100-T139) including 14 testing and 12 image upload tasks
**Parallel Opportunities**: ~45-55 tasks marked [P] across all phases
**Estimated Timeline**: 7-8 weeks sequential, 4 weeks with 3 developers
