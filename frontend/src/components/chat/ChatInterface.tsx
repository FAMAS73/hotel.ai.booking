/**
 * ChatInterface Component
 *
 * Main container for chat interface integrating all chat components.
 *
 * @module components/chat/ChatInterface
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage as ChatMessageComponent } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import { useChatStore } from '@/lib/stores/chatStore';
import { useUIStore } from '@/lib/stores/uiStore';
import { sendMessage as sendMessageAPI } from '@/lib/api/chat';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import type { ChatMessage } from '@/types';

/**
 * ChatInterface component provides full chat experience.
 *
 * Features:
 * - Message history display
 * - Auto-scroll to latest message
 * - Send messages to AI
 * - Typing indicators
 * - Error handling
 * - Session management
 *
 * Usage:
 * ```tsx
 * <ChatInterface />
 * ```
 */
export function ChatInterface() {
  const {
    currentSession,
    messages,
    isTyping,
    isLoading,
    error,
    addMessage,
    setTyping,
    setError,
    setCurrentSession,
  } = useChatStore();

  const toast = useUIStore((state) => state.toast);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  /**
   * Scroll to bottom of messages.
   * Only scrolls if autoScroll is enabled.
   */
  const scrollToBottom = () => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  /**
   * Handle sending a message.
   * Creates user message, sends to API, adds AI response.
   */
  const handleSendMessage = async (content: string) => {
    try {
      setError(null);

      // Create user message
      const userMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        session_id: currentSession?.id || '',
        role: 'user',
        content,
        content_type: 'text',
        timestamp: new Date().toISOString(),
      };

      // Add user message to UI immediately
      addMessage(userMessage);

      // Show typing indicator
      setTyping(true);

      // Send message to API
      const response = await sendMessageAPI({
        session_id: currentSession?.id,
        content,
      });

      // Hide typing indicator
      setTyping(false);

      // Add AI response to messages
      addMessage(response.message);

      // If new session was created, update current session
      if (response.session_created || !currentSession) {
        setCurrentSession({
          id: response.session_id,
          guest_id: undefined,
          title: content.substring(0, 50), // Use first message as title
          messages: [userMessage, response.message],
          created_at: new Date().toISOString(),
          last_activity: new Date().toISOString(),
          is_active: true,
          message_count: 2,
        });
      }
    } catch (error: any) {
      setTyping(false);
      const errorMessage = error.error || 'Failed to send message. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  /**
   * Handle starting a new chat session.
   */
  const handleNewChat = () => {
    setCurrentSession(null);
    setError(null);
  };

  /**
   * Detect if user has scrolled up (disable auto-scroll).
   */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom =
      Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 10;
    setAutoScroll(isAtBottom);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] theme-transition">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-[var(--border)] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Chat with AI</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Ask about rooms, bookings, or Bangkok recommendations
            </p>
          </div>

          {/* New chat button */}
          <button
            onClick={handleNewChat}
            className="px-4 py-2 text-sm font-medium text-[var(--accent)] hover:bg-[var(--bg-tertiary)] rounded-md transition-colors"
          >
            + New Chat
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto px-6 py-4"
        onScroll={handleScroll}
        id="main-content"
      >
        {isLoading ? (
          <LoadingSpinner size="lg" text="Loading chat..." center />
        ) : (
          <>
            {/* Welcome message */}
            {messages.length === 0 && !isTyping && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="h-16 w-16 bg-[var(--accent-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-8 w-8 text-[var(--accent)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                    Welcome to Hotel AI Assistant
                  </h2>
                  <p className="text-[var(--text-secondary)]">
                    Start a conversation by typing a message below. I can help you with:
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
                    <li>• Check room availability and pricing</li>
                    <li>• Manage your bookings</li>
                    <li>• Get Bangkok travel recommendations</li>
                    <li>• Answer questions about hotel amenities</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message) => (
              <ChatMessageComponent key={message.id} message={message} />
            ))}

            {/* Typing indicator */}
            {isTyping && <TypingIndicator />}

            {/* Error message */}
            {error && (
              <div className="mb-4">
                <ErrorMessage
                  message={error}
                  onRetry={() => setError(null)}
                />
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 border-t border-[var(--border)] px-6 py-4">
        <ChatInput onSend={handleSendMessage} disabled={isTyping || isLoading} />

        {/* Scroll to bottom button (if not auto-scrolling) */}
        {!autoScroll && messages.length > 0 && (
          <button
            onClick={scrollToBottom}
            className="mt-2 text-sm text-[var(--accent)] hover:underline"
          >
            ↓ Scroll to bottom
          </button>
        )}
      </div>
    </div>
  );
}
