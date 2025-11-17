/**
 * Booking Store
 *
 * Zustand store for managing booking flow state across multi-step form.
 * Handles temporary booking data before submission to backend.
 *
 * Features:
 * - Multi-step booking wizard state
 * - Selected room and dates persistence
 * - Guest information collection
 * - Special requests storage
 * - Form validation state
 *
 * @module lib/stores/bookingStore
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Room, Booking, BookingCreate } from '@/types';

/**
 * Booking flow steps for wizard navigation.
 */
export type BookingStep = 'dates' | 'details' | 'review' | 'confirmation';

/**
 * Booking form state for multi-step wizard.
 * Stores all data collected during booking process.
 */
interface BookingFormData {
  /** Selected room for booking */
  room: Room | null;

  /** Check-in date (ISO 8601 date string) */
  checkIn: string;

  /** Check-out date (ISO 8601 date string) */
  checkOut: string;

  /** Number of guests */
  guestsCount: number;

  /** Special requests or notes */
  specialRequests: string;

  /** Calculated total nights */
  totalNights: number;

  /** Calculated total price */
  totalPrice: number;
}

/**
 * Booking store state interface.
 */
interface BookingState {
  /** Current step in booking wizard */
  currentStep: BookingStep;

  /** Booking form data */
  formData: BookingFormData;

  /** Whether booking submission is in progress */
  isSubmitting: boolean;

  /** Created booking after successful submission */
  createdBooking: Booking | null;

  /** Error message if booking failed */
  error: string | null;

  // Actions
  /** Set current wizard step */
  setStep: (step: BookingStep) => void;

  /** Initialize booking with room and dates */
  startBooking: (room: Room, checkIn: string, checkOut: string, guestsCount: number) => void;

  /** Update form data */
  updateFormData: (data: Partial<BookingFormData>) => void;

  /** Set special requests */
  setSpecialRequests: (requests: string) => void;

  /** Calculate total price based on nights */
  calculateTotal: () => void;

  /** Set submission loading state */
  setSubmitting: (submitting: boolean) => void;

  /** Set created booking after successful submission */
  setCreatedBooking: (booking: Booking) => void;

  /** Set error message */
  setError: (error: string | null) => void;

  /** Reset booking flow to initial state */
  reset: () => void;
}

/**
 * Initial form data state.
 */
const initialFormData: BookingFormData = {
  room: null,
  checkIn: '',
  checkOut: '',
  guestsCount: 1,
  specialRequests: '',
  totalNights: 0,
  totalPrice: 0,
};

/**
 * Booking store for managing booking flow state.
 *
 * Persisted to localStorage to maintain state across page refreshes
 * during the booking process. Auto-clears after 24 hours.
 *
 * Usage:
 * ```typescript
 * function BookingPage() {
 *   const {
 *     formData,
 *     currentStep,
 *     startBooking,
 *     setStep
 *   } = useBookingStore();
 *
 *   // Initialize booking
 *   startBooking(room, '2025-03-15', '2025-03-18', 2);
 *
 *   // Navigate steps
 *   setStep('details');
 * }
 * ```
 */
export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      currentStep: 'dates',
      formData: initialFormData,
      isSubmitting: false,
      createdBooking: null,
      error: null,

      setStep: (step) => set({ currentStep: step }),

      startBooking: (room, checkIn, checkOut, guestsCount) => {
        // Calculate number of nights between check-in and check-out
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
        const totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Calculate total price (base price × nights)
        const totalPrice = room.base_price * totalNights;

        set({
          formData: {
            room,
            checkIn,
            checkOut,
            guestsCount,
            specialRequests: '',
            totalNights,
            totalPrice,
          },
          currentStep: 'details',
          error: null,
        });
      },

      updateFormData: (data) => {
        set((state) => ({
          formData: { ...state.formData, ...data },
        }));

        // Recalculate total if dates or room changed
        if (data.checkIn || data.checkOut || data.room) {
          get().calculateTotal();
        }
      },

      setSpecialRequests: (requests) => {
        set((state) => ({
          formData: { ...state.formData, specialRequests: requests },
        }));
      },

      calculateTotal: () => {
        const { formData } = get();

        if (!formData.room || !formData.checkIn || !formData.checkOut) {
          return;
        }

        // Recalculate nights and price
        const checkInDate = new Date(formData.checkIn);
        const checkOutDate = new Date(formData.checkOut);
        const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
        const totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const totalPrice = formData.room.base_price * totalNights;

        set((state) => ({
          formData: {
            ...state.formData,
            totalNights,
            totalPrice,
          },
        }));
      },

      setSubmitting: (submitting) => set({ isSubmitting: submitting }),

      setCreatedBooking: (booking) =>
        set({
          createdBooking: booking,
          currentStep: 'confirmation',
          isSubmitting: false,
        }),

      setError: (error) => set({ error }),

      reset: () =>
        set({
          currentStep: 'dates',
          formData: initialFormData,
          isSubmitting: false,
          createdBooking: null,
          error: null,
        }),
    }),
    {
      name: 'booking-storage',
      // Only persist form data and current step (not submission state)
      partialize: (state) => ({
        currentStep: state.currentStep,
        formData: state.formData,
      }),
    }
  )
);
