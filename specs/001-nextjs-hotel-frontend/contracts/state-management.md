# State Management Contract: Zustand Stores

**Feature**: Next.js Hotel Frontend Website
**Branch**: `001-nextjs-hotel-frontend`
**Created**: 2025-01-15
**Purpose**: Document Zustand store structures and state management patterns

## Overview

This contract defines all Zustand stores used for global state management in the Next.js frontend. Each store includes state shape, actions, selectors, and persistence configuration.

**State Management Strategy**:
- **Zustand**: Global application state (auth, bookings, cart)
- **React Context**: Theme preference only (minimal re-renders)
- **SWR**: Server state and caching (API data)
- **Local State**: Component-specific UI state (useState)

---

## Authentication Store

Manages user authentication state, tokens, and session.

**Location**: `lib/stores/authStore.ts`

### State Shape

```typescript
interface AuthState {
  // User data
  user: Guest | null;
  
  // Authentication status
  isAuthenticated: boolean;
  
  // JWT token (if not using httpOnly cookies)
  token: string | null;
  
  // Loading state
  isLoading: boolean;
  
  // Error state
  error: string | null;
}
```

### Actions

```typescript
interface AuthActions {
  /**
   * Login with email and password.
   * Sets user, token, and authentication status on success.
   */
  login: (credentials: GuestLogin) => Promise<void>;
  
  /**
   * Register a new account.
   * Automatically logs in the user on successful registration.
   */
  register: (data: GuestRegistration) => Promise<void>;
  
  /**
   * Logout the current user.
   * Clears user, token, and resets authentication status.
   */
  logout: () => Promise<void>;
  
  /**
   * Update user profile.
   * Merges new data with existing user object.
   */
  updateProfile: (updates: Partial<GuestProfile>) => Promise<void>;
  
  /**
   * Set authentication token.
   * Used by token refresh logic.
   */
  setToken: (token: string) => void;
  
  /**
   * Check if user has admin role.
   */
  isAdmin: () => boolean;
  
  /**
   * Clear error state.
   */
  clearError: () => void;
}
```

### Complete Store Definition

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Guest, GuestLogin, GuestRegistration, GuestProfile } from '@/types';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '@/lib/api/auth';

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      token: null,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiLogin(credentials);
          set({
            user: response.guest,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error.message || 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiRegister(data);
          set({
            user: response.guest,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error.message || 'Registration failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await apiLogout();
        } catch {
          // Continue logout even if API call fails
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      updateProfile: async (updates) => {
        const currentUser = get().user;
        if (!currentUser) throw new Error('No user logged in');
        
        set({ isLoading: true });
        try {
          // API call to update profile
          const updatedUser = await updateUserProfile(updates);
          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error.message || 'Profile update failed',
            isLoading: false,
          });
          throw error;
        }
      },

      setToken: (token) => {
        set({ token });
      },

      isAdmin: () => {
        const user = get().user;
        return user?.role === 'admin';
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        // Only persist user and token, not loading/error states
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

### Usage Examples

```typescript
// In a component
import { useAuthStore } from '@/lib/stores/authStore';

function LoginPage() {
  const { login, isLoading, error } = useAuthStore();
  
  const handleSubmit = async (credentials: GuestLogin) => {
    try {
      await login(credentials);
      router.push('/profile');
    } catch {
      // Error handled by store
    }
  };
  
  return <LoginForm onSubmit={handleSubmit} loading={isLoading} error={error} />;
}

// Selective subscription (prevents unnecessary re-renders)
function UserMenu() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  if (!user) return <LoginButton />;
  
  return (
    <div>
      <p>Welcome, {user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// Check admin role
function AdminDashboard() {
  const isAdmin = useAuthStore((state) => state.isAdmin());
  
  if (!isAdmin) {
    return <Redirect to="/unauthorized" />;
  }
  
  return <DashboardContent />;
}
```

---

## Booking Store

Manages booking flow state (date selection, room selection, cart).

**Location**: `lib/stores/bookingStore.ts`

### State Shape

```typescript
interface BookingState {
  // Selected dates for booking
  checkIn: Date | null;
  checkOut: Date | null;
  
  // Number of nights calculated from dates
  nights: number;
  
  // Number of guests
  guestCount: number;
  
  // Selected room for booking
  selectedRoom: Room | null;
  
  // Special requests
  specialRequests: string;
  
  // Booking flow step
  currentStep: 'dates' | 'rooms' | 'details' | 'confirm';
}
```

### Actions

```typescript
interface BookingActions {
  /**
   * Set check-in and check-out dates.
   * Automatically calculates number of nights.
   */
  setDates: (checkIn: Date, checkOut: Date) => void;
  
  /**
   * Set number of guests.
   */
  setGuestCount: (count: number) => void;
  
  /**
   * Select a room for booking.
   */
  selectRoom: (room: Room) => void;
  
  /**
   * Set special requests.
   */
  setSpecialRequests: (requests: string) => void;
  
  /**
   * Move to next step in booking flow.
   */
  nextStep: () => void;
  
  /**
   * Move to previous step in booking flow.
   */
  previousStep: () => void;
  
  /**
   * Submit booking.
   * Calls API and returns booking confirmation.
   */
  submitBooking: () => Promise<Booking>;
  
  /**
   * Reset booking state.
   * Clears all selections and returns to first step.
   */
  reset: () => void;
  
  /**
   * Get total price for current selection.
   */
  getTotalPrice: () => number;
  
  /**
   * Check if current step is valid.
   */
  canProceed: () => boolean;
}
```

### Complete Store Definition

```typescript
import { create } from 'zustand';
import { differenceInDays } from 'date-fns';
import type { Room, Booking, BookingCreate } from '@/types';
import { createBooking } from '@/lib/api/bookings';

type BookingStore = BookingState & BookingActions;

export const useBookingStore = create<BookingStore>((set, get) => ({
  // Initial state
  checkIn: null,
  checkOut: null,
  nights: 0,
  guestCount: 2,
  selectedRoom: null,
  specialRequests: '',
  currentStep: 'dates',

  // Actions
  setDates: (checkIn, checkOut) => {
    const nights = differenceInDays(checkOut, checkIn);
    set({ checkIn, checkOut, nights });
  },

  setGuestCount: (count) => {
    set({ guestCount: count });
  },

  selectRoom: (room) => {
    set({ selectedRoom: room });
  },

  setSpecialRequests: (requests) => {
    set({ specialRequests: requests });
  },

  nextStep: () => {
    const { currentStep } = get();
    const steps: BookingState['currentStep'][] = ['dates', 'rooms', 'details', 'confirm'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      set({ currentStep: steps[currentIndex + 1] });
    }
  },

  previousStep: () => {
    const { currentStep } = get();
    const steps: BookingState['currentStep'][] = ['dates', 'rooms', 'details', 'confirm'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      set({ currentStep: steps[currentIndex - 1] });
    }
  },

  submitBooking: async () => {
    const { checkIn, checkOut, guestCount, selectedRoom, specialRequests } = get();
    
    if (!checkIn || !checkOut || !selectedRoom) {
      throw new Error('Missing required booking information');
    }

    const bookingData: BookingCreate = {
      room_type: selectedRoom.type,
      check_in: checkIn.toISOString().split('T')[0],
      check_out: checkOut.toISOString().split('T')[0],
      guests_count: guestCount,
      special_requests: specialRequests || undefined,
    };

    const booking = await createBooking(bookingData);
    
    // Reset store after successful booking
    get().reset();
    
    return booking;
  },

  reset: () => {
    set({
      checkIn: null,
      checkOut: null,
      nights: 0,
      guestCount: 2,
      selectedRoom: null,
      specialRequests: '',
      currentStep: 'dates',
    });
  },

  getTotalPrice: () => {
    const { selectedRoom, nights } = get();
    if (!selectedRoom || nights === 0) return 0;
    return selectedRoom.base_price * nights;
  },

  canProceed: () => {
    const { currentStep, checkIn, checkOut, selectedRoom } = get();
    
    switch (currentStep) {
      case 'dates':
        return checkIn !== null && checkOut !== null;
      case 'rooms':
        return selectedRoom !== null;
      case 'details':
        return true; // Special requests are optional
      case 'confirm':
        return false; // Last step, can't proceed
      default:
        return false;
    }
  },
}));
```

### Usage Examples

```typescript
// In room catalog page
function RoomCatalogPage() {
  const { checkIn, checkOut, setDates } = useBookingStore();
  
  return (
    <div>
      <DateRangePicker
        checkIn={checkIn}
        checkOut={checkOut}
        onChange={(start, end) => setDates(start, end)}
      />
      <RoomList checkIn={checkIn} checkOut={checkOut} />
    </div>
  );
}

// In booking flow
function BookingFlow() {
  const {
    currentStep,
    selectedRoom,
    getTotalPrice,
    canProceed,
    nextStep,
    previousStep,
    submitBooking,
  } = useBookingStore();
  
  const handleNext = () => {
    if (canProceed()) {
      nextStep();
    }
  };
  
  const handleSubmit = async () => {
    try {
      const booking = await submitBooking();
      router.push(`/bookings/${booking.id}`);
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <div>
      {currentStep === 'dates' && <DateSelection />}
      {currentStep === 'rooms' && <RoomSelection />}
      {currentStep === 'details' && <BookingDetails />}
      {currentStep === 'confirm' && <BookingConfirmation />}
      
      <div>
        <p>Total: ฿{getTotalPrice().toLocaleString()}</p>
        {currentStep !== 'dates' && (
          <Button onClick={previousStep}>Back</Button>
        )}
        {currentStep !== 'confirm' ? (
          <Button onClick={handleNext} disabled={!canProceed()}>
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit}>Confirm Booking</Button>
        )}
      </div>
    </div>
  );
}
```

---

## Chat Store

Manages chat session state and message history.

**Location**: `lib/stores/chatStore.ts`

### State Shape

```typescript
interface ChatState {
  // Current active session
  currentSessionId: string | null;
  
  // All messages in current session
  messages: ChatMessage[];
  
  // Current input value
  input: string;
  
  // Loading state (AI is responding)
  isLoading: boolean;
  
  // Error state
  error: string | null;
  
  // Whether AI is typing (streaming response)
  isTyping: boolean;
}
```

### Actions

```typescript
interface ChatActions {
  /**
   * Load an existing session.
   * Fetches session history from API.
   */
  loadSession: (sessionId: string) => Promise<void>;
  
  /**
   * Start a new chat session.
   * Clears current messages and session ID.
   */
  startNewSession: () => void;
  
  /**
   * Update input value.
   */
  setInput: (input: string) => void;
  
  /**
   * Send message to AI.
   * Adds user message, calls API, adds AI response.
   */
  sendMessage: () => Promise<void>;
  
  /**
   * Clear error state.
   */
  clearError: () => void;
  
  /**
   * Delete a message (for error recovery).
   */
  deleteMessage: (messageId: string) => void;
}
```

### Complete Store Definition

```typescript
import { create } from 'zustand';
import type { ChatMessage, ChatSession } from '@/types';
import { sendMessage as apiSendMessage, getSession } from '@/lib/api/chat';

type ChatStore = ChatState & ChatActions;

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial state
  currentSessionId: null,
  messages: [],
  input: '',
  isLoading: false,
  error: null,
  isTyping: false,

  // Actions
  loadSession: async (sessionId) => {
    set({ isLoading: true, error: null });
    try {
      const session = await getSession(sessionId);
      set({
        currentSessionId: session.id,
        messages: session.messages,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.message || 'Failed to load session',
        isLoading: false,
      });
    }
  },

  startNewSession: () => {
    set({
      currentSessionId: null,
      messages: [],
      input: '',
      error: null,
    });
  },

  setInput: (input) => {
    set({ input });
  },

  sendMessage: async () => {
    const { input, currentSessionId, messages } = get();
    
    if (!input.trim()) return;

    // Add user message optimistically
    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      session_id: currentSessionId || '',
      role: 'user',
      content: input,
      content_type: 'text',
      timestamp: new Date().toISOString(),
    };

    set({
      messages: [...messages, userMessage],
      input: '',
      isLoading: true,
      isTyping: true,
      error: null,
    });

    try {
      const response = await apiSendMessage({
        session_id: currentSessionId,
        content: input,
      });

      set((state) => ({
        currentSessionId: response.session_id,
        messages: [
          ...state.messages.filter((m) => m.id !== userMessage.id),
          { ...userMessage, id: `user-${Date.now()}`, session_id: response.session_id },
          response.message,
        ],
        isLoading: false,
        isTyping: false,
      }));
    } catch (error) {
      // Remove optimistic user message on error
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== userMessage.id),
        error: error.message || 'Failed to send message',
        isLoading: false,
        isTyping: false,
      }));
    }
  },

  clearError: () => {
    set({ error: null });
  },

  deleteMessage: (messageId) => {
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== messageId),
    }));
  },
}));
```

### Usage Examples

```typescript
// In chat interface
function ChatInterface() {
  const {
    messages,
    input,
    isLoading,
    isTyping,
    error,
    setInput,
    sendMessage,
    startNewSession,
  } = useChatStore();
  
  const handleSend = async () => {
    await sendMessage();
  };
  
  return (
    <div>
      <button onClick={startNewSession}>New Chat</button>
      
      <div className="messages">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>
      
      {error && <ErrorMessage message={error} />}
      
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSend}
        disabled={isLoading}
      />
    </div>
  );
}

// Load previous session
function ChatHistory() {
  const loadSession = useChatStore((state) => state.loadSession);
  
  return (
    <div>
      {sessions.map((session) => (
        <button key={session.id} onClick={() => loadSession(session.id)}>
          {session.title}
        </button>
      ))}
    </div>
  );
}
```

---

## UI Store

Manages global UI state (modals, toasts, sidebar).

**Location**: `lib/stores/uiStore.ts`

### State Shape

```typescript
interface UIState {
  // Modal state
  modals: {
    roomDetails: { open: boolean; roomId: number | null };
    bookingConfirm: { open: boolean; bookingId: number | null };
    login: { open: boolean };
  };
  
  // Toast notifications
  toasts: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
  }>;
  
  // Mobile sidebar
  sidebarOpen: boolean;
}
```

### Actions

```typescript
interface UIActions {
  /**
   * Open a modal.
   */
  openModal: (modal: keyof UIState['modals'], data?: any) => void;
  
  /**
   * Close a modal.
   */
  closeModal: (modal: keyof UIState['modals']) => void;
  
  /**
   * Show a toast notification.
   */
  showToast: (message: string, type: UIState['toasts'][0]['type'], duration?: number) => void;
  
  /**
   * Dismiss a toast.
   */
  dismissToast: (id: string) => void;
  
  /**
   * Toggle sidebar.
   */
  toggleSidebar: () => void;
  
  /**
   * Close sidebar.
   */
  closeSidebar: () => void;
}
```

### Complete Store Definition

```typescript
import { create } from 'zustand';

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set, get) => ({
  // Initial state
  modals: {
    roomDetails: { open: false, roomId: null },
    bookingConfirm: { open: false, bookingId: null },
    login: { open: false },
  },
  toasts: [],
  sidebarOpen: false,

  // Actions
  openModal: (modal, data) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modal]: { open: true, ...data },
      },
    }));
  },

  closeModal: (modal) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modal]: { open: false, roomId: null, bookingId: null },
      },
    }));
  },

  showToast: (message, type, duration = 5000) => {
    const id = `toast-${Date.now()}`;
    const toast = { id, message, type, duration };
    
    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        get().dismissToast(id);
      }, duration);
    }
  },

  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  closeSidebar: () => {
    set({ sidebarOpen: false });
  },
}));
```

### Usage Examples

```typescript
// Show toast notification
function BookingSuccess() {
  const showToast = useUIStore((state) => state.showToast);
  
  useEffect(() => {
    showToast('Booking confirmed successfully!', 'success');
  }, []);
  
  return <ConfirmationPage />;
}

// Open modal
function RoomCard({ room }: { room: Room }) {
  const openModal = useUIStore((state) => state.openModal);
  
  return (
    <Card onClick={() => openModal('roomDetails', { roomId: room.id })}>
      <RoomCardContent room={room} />
    </Card>
  );
}

// Render modal
function RoomDetailsModal() {
  const { modals, closeModal } = useUIStore();
  const { roomDetails } = modals;
  
  if (!roomDetails.open || !roomDetails.roomId) return null;
  
  return (
    <Modal open={roomDetails.open} onClose={() => closeModal('roomDetails')}>
      <RoomDetails roomId={roomDetails.roomId} />
    </Modal>
  );
}
```

---

## Store Best Practices

### 1. Selective Subscriptions

Only subscribe to the specific state you need to prevent unnecessary re-renders:

```typescript
// ❌ Bad - subscribes to entire store
const store = useAuthStore();

// ✅ Good - subscribes only to user
const user = useAuthStore((state) => state.user);
```

### 2. Derived State

Use selectors for derived state instead of storing it:

```typescript
// ❌ Bad - storing derived state
const totalPrice = useBookingStore((state) => state.totalPrice);

// ✅ Good - computing on demand
const totalPrice = useBookingStore((state) => state.getTotalPrice());
```

### 3. Action Organization

Keep actions focused and composable:

```typescript
// ✅ Good - focused actions
setCheckIn(date);
setCheckOut(date);

// ❌ Bad - overly complex action
setBookingDetails({ checkIn, checkOut, guests, room, requests });
```

### 4. Error Handling

Always handle errors in actions and expose error state:

```typescript
try {
  await apiCall();
  set({ error: null });
} catch (error) {
  set({ error: error.message });
  throw error; // Re-throw for component handling
}
```

### 5. Persistence

Only persist non-sensitive data:

```typescript
persist(
  (set, get) => ({ /* store */ }),
  {
    name: 'storage-key',
    partialize: (state) => ({
      // ✅ OK to persist
      user: state.user,
      // ❌ Don't persist
      // token: state.token (use httpOnly cookies instead)
    }),
  }
)
```

---

**Contract Version**: 1.0.0
**Last Updated**: 2025-01-15
**Status**: Ready for implementation
