/**
 * Chat Store using Zustand
 *
 * Manages:
 * - Active chat session
 * - Chat messages
 * - Typing/loading states
 * - Message history
 *
 * @module lib/stores/chatStore
 */

import { create } from 'zustand';
import type { ChatSession, ChatMessage } from '@/types';

/**
 * ChatState interface defines the shape of the chat store.
 */
interface ChatState {
  /** Current active session */
  currentSession: ChatSession | null;

  /** Messages in current session */
  messages: ChatMessage[];

  /** Whether AI is typing/generating response */
  isTyping: boolean;

  /** Whether loading session history */
  isLoading: boolean;

  /** Last error */
  error: string | null;

  // Actions
  /** Set current session */
  setCurrentSession: (session: ChatSession | null) => void;

  /** Add a message to current session */
  addMessage: (message: ChatMessage) => void;

  /** Update a specific message (for streaming) */
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;

  /** Set messages array */
  setMessages: (messages: ChatMessage[]) => void;

  /** Set typing state */
  setTyping: (isTyping: boolean) => void;

  /** Set loading state */
  setLoading: (isLoading: boolean) => void;

  /** Set error state */
  setError: (error: string | null) => void;

  /** Clear current session */
  clearSession: () => void;

  /** Reset store */
  reset: () => void;
}

/**
 * Initial state for the chat store.
 */
const initialState = {
  currentSession: null,
  messages: [],
  isTyping: false,
  isLoading: false,
  error: null,
};

/**
 * useChatStore hook provides access to chat state and actions.
 *
 * Features:
 * - Manages active chat session
 * - Tracks messages in real-time
 * - Handles typing indicators
 * - Supports message streaming updates
 *
 * Usage:
 * ```typescript
 * const { messages, addMessage, setTyping } = useChatStore();
 * ```
 */
export const useChatStore = create<ChatState>((set, get) => ({
  ...initialState,

  /**
   * Set the current active session.
   */
  setCurrentSession: (session) => {
    set({
      currentSession: session,
      messages: session?.messages || [],
      error: null,
    });
  },

  /**
   * Add a new message to the current session.
   * Appends to messages array.
   */
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  /**
   * Update a specific message by ID.
   * Used for streaming message updates.
   */
  updateMessage: (messageId, updates) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      ),
    }));
  },

  /**
   * Replace entire messages array.
   */
  setMessages: (messages) => {
    set({ messages });
  },

  /**
   * Set typing/generating state.
   * Shows typing indicator in UI.
   */
  setTyping: (isTyping) => {
    set({ isTyping });
  },

  /**
   * Set loading state for session operations.
   */
  setLoading: (isLoading) => {
    set({ isLoading });
  },

  /**
   * Set error message.
   */
  setError: (error) => {
    set({ error, isLoading: false, isTyping: false });
  },

  /**
   * Clear current session and messages.
   * Used when starting a new chat.
   */
  clearSession: () => {
    set({
      currentSession: null,
      messages: [],
      isTyping: false,
      error: null,
    });
  },

  /**
   * Reset entire store to initial state.
   */
  reset: () => {
    set(initialState);
  },
}));

/**
 * Selectors for optimized component re-rendering.
 */
export const chatSelectors = {
  /** Select current session */
  currentSession: (state: ChatState) => state.currentSession,

  /** Select messages */
  messages: (state: ChatState) => state.messages,

  /** Select typing state */
  isTyping: (state: ChatState) => state.isTyping,

  /** Select loading state */
  isLoading: (state: ChatState) => state.isLoading,

  /** Select error state */
  error: (state: ChatState) => state.error,

  /** Select message count */
  messageCount: (state: ChatState) => state.messages.length,

  /** Select last message */
  lastMessage: (state: ChatState) =>
    state.messages.length > 0 ? state.messages[state.messages.length - 1] : null,
};
