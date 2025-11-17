/**
 * ChatInput Component
 *
 * Text input for sending chat messages.
 *
 * @module components/chat/ChatInput
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export interface ChatInputProps {
  /** Callback when message is sent */
  onSend: (message: string) => void;

  /** Whether sending is disabled */
  disabled?: boolean;

  /** Placeholder text */
  placeholder?: string;
}

/**
 * ChatInput component for message input.
 *
 * Features:
 * - Auto-expanding textarea
 * - Send on Enter (Shift+Enter for newline)
 * - Disabled state while sending
 * - Character limit
 *
 * Usage:
 * ```tsx
 * <ChatInput
 *   onSend={handleSendMessage}
 *   disabled={isTyping}
 * />
 * ```
 */
export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Type your message...',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;

    onSend(trimmedMessage);
    setMessage('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      {/* Message textarea */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          maxLength={2000}
          className="
            w-full
            px-4 py-3
            bg-[var(--bg-primary)]
            border border-[var(--border)]
            rounded-lg
            text-[var(--text-primary)]
            placeholder:text-[var(--text-muted)]
            focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-none
            max-h-32
            theme-transition
          "
          aria-label="Chat message"
        />

        {/* Character count */}
        {message.length > 1800 && (
          <div className="absolute bottom-2 right-2 text-xs text-[var(--text-muted)]">
            {message.length}/2000
          </div>
        )}
      </div>

      {/* Send button */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={disabled || !message.trim()}
        aria-label="Send message"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </Button>
    </form>
  );
}
