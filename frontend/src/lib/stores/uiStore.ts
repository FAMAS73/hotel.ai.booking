/**
 * UI Store using Zustand
 *
 * Manages:
 * - Modal state (open/close dialogs)
 * - Toast notifications (success, error, info, warning)
 * - Global loading overlays
 * - Sidebar state (open/closed for mobile)
 *
 * Centralized UI state management for better UX consistency.
 *
 * @module lib/stores/uiStore
 */

import { create } from 'zustand';

/**
 * Toast notification type
 */
export interface Toast {
  /** Unique identifier for the toast */
  id: string;

  /** Toast message */
  message: string;

  /** Toast type determines styling and icon */
  type: 'success' | 'error' | 'info' | 'warning';

  /** Duration in milliseconds before auto-dismiss (0 = no auto-dismiss) */
  duration: number;

  /** Timestamp when toast was created */
  timestamp: number;
}

/**
 * Modal state type
 */
export interface ModalState {
  /** Whether the modal is open */
  isOpen: boolean;

  /** Modal content identifier */
  content: string | null;

  /** Additional modal data */
  data?: any;
}

/**
 * UIState interface defines the shape of the UI store.
 */
interface UIState {
  // Modal state
  /** Currently active modal */
  modal: ModalState;

  /** Open a modal with optional data */
  openModal: (content: string, data?: any) => void;

  /** Close the current modal */
  closeModal: () => void;

  // Toast state
  /** Array of active toasts */
  toasts: Toast[];

  /** Add a toast notification */
  addToast: (message: string, type: Toast['type'], duration?: number) => void;

  /** Remove a specific toast */
  removeToast: (id: string) => void;

  /** Clear all toasts */
  clearToasts: () => void;

  // Convenience toast methods
  /** Show success toast */
  toast: {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
  };

  // Sidebar state (for mobile/tablet responsive navigation)
  /** Whether the sidebar is open */
  isSidebarOpen: boolean;

  /** Toggle sidebar open/closed */
  toggleSidebar: () => void;

  /** Set sidebar state explicitly */
  setSidebarOpen: (open: boolean) => void;

  // Global loading overlay
  /** Whether global loading overlay is shown */
  isLoading: boolean;

  /** Set global loading state */
  setLoading: (loading: boolean) => void;
}

/**
 * Generate unique ID for toasts.
 * Uses timestamp + random string for uniqueness.
 */
function generateToastId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * useUIStore hook provides access to UI state and actions.
 *
 * Features:
 * - Modal management for dialogs and confirmations
 * - Toast notification system with auto-dismiss
 * - Sidebar state for responsive navigation
 * - Global loading overlay for app-wide async operations
 *
 * Usage:
 * ```typescript
 * const { openModal, toast } = useUIStore();
 *
 * // Show success toast
 * toast.success('Booking created successfully!');
 *
 * // Open booking detail modal
 * openModal('booking-detail', { bookingId: 123 });
 * ```
 */
export const useUIStore = create<UIState>((set, get) => ({
  // Modal state
  modal: {
    isOpen: false,
    content: null,
    data: undefined,
  },

  /**
   * Open a modal with specified content identifier and optional data.
   *
   * Content identifiers should match modal component names:
   * - 'booking-detail'
   * - 'booking-cancel'
   * - 'room-detail'
   * - 'image-upload'
   * etc.
   */
  openModal: (content, data) => {
    set({
      modal: {
        isOpen: true,
        content,
        data,
      },
    });
  },

  /**
   * Close the currently open modal.
   * Clears content and data.
   */
  closeModal: () => {
    set({
      modal: {
        isOpen: false,
        content: null,
        data: undefined,
      },
    });
  },

  // Toast state
  toasts: [],

  /**
   * Add a toast notification.
   *
   * @param message - Toast message text
   * @param type - Toast type (success, error, info, warning)
   * @param duration - Auto-dismiss duration in ms (default: 5000, 0 = no auto-dismiss)
   */
  addToast: (message, type, duration = 5000) => {
    const id = generateToastId();
    const toast: Toast = {
      id,
      message,
      type,
      duration,
      timestamp: Date.now(),
    };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto-dismiss if duration > 0
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },

  /**
   * Remove a specific toast by ID.
   */
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  /**
   * Clear all active toasts.
   */
  clearToasts: () => {
    set({ toasts: [] });
  },

  // Convenience toast methods
  toast: {
    /**
     * Show success toast (green checkmark icon).
     */
    success: (message, duration) => {
      get().addToast(message, 'success', duration);
    },

    /**
     * Show error toast (red X icon).
     * Default duration: 7000ms (errors should be visible longer)
     */
    error: (message, duration = 7000) => {
      get().addToast(message, 'error', duration);
    },

    /**
     * Show info toast (blue info icon).
     */
    info: (message, duration) => {
      get().addToast(message, 'info', duration);
    },

    /**
     * Show warning toast (yellow warning icon).
     */
    warning: (message, duration = 6000) => {
      get().addToast(message, 'warning', duration);
    },
  },

  // Sidebar state
  isSidebarOpen: false,

  /**
   * Toggle sidebar open/closed state.
   * Used for mobile/tablet responsive navigation.
   */
  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  /**
   * Set sidebar state explicitly.
   * Useful for closing sidebar when navigating on mobile.
   */
  setSidebarOpen: (open) => {
    set({ isSidebarOpen: open });
  },

  // Global loading overlay
  isLoading: false,

  /**
   * Set global loading state.
   * Shows/hides full-screen loading overlay.
   * Use sparingly - prefer component-level loading states.
   */
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));

/**
 * Selectors for optimized component re-rendering.
 */
export const uiSelectors = {
  /** Select modal state */
  modal: (state: UIState) => state.modal,

  /** Select all toasts */
  toasts: (state: UIState) => state.toasts,

  /** Select sidebar state */
  isSidebarOpen: (state: UIState) => state.isSidebarOpen,

  /** Select global loading state */
  isLoading: (state: UIState) => state.isLoading,
};
