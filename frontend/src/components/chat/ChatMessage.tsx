/**
 * ChatMessage Component
 *
 * Displays a single chat message with role-based styling.
 *
 * @module components/chat/ChatMessage
 */

'use client';

import React from 'react';
import type { ChatMessage as ChatMessageType } from '@/types';
import { formatDate } from '@/lib/utils';

export interface ChatMessageProps {
  /** Message data */
  message: ChatMessageType;
}

/**
 * ChatMessage component displays user or AI messages.
 *
 * Features:
 * - Different styling for user vs assistant messages
 * - Timestamp display
 * - Rich content rendering (markdown support future)
 * - Streaming indicator
 *
 * Usage:
 * ```tsx
 * <ChatMessage message={message} />
 * ```
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div
          className={`
            flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold
            ${
              isUser
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
            }
          `}
        >
          {isUser ? 'U' : 'AI'}
        </div>

        {/* Message bubble */}
        <div className="flex flex-col gap-1">
          <div
            className={`
              px-4 py-2 rounded-lg
              ${
                isUser
                  ? 'bg-[var(--chat-user-bg)] text-[var(--chat-user-text)]'
                  : 'bg-[var(--chat-assistant-bg)] text-[var(--chat-assistant-text)]'
              }
              theme-transition
            `}
          >
            {/* Message content */}
            <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>

            {/* Streaming indicator */}
            {message.is_streaming && (
              <div className="flex items-center gap-1 mt-2">
                <div className="h-1.5 w-1.5 bg-current rounded-full animate-pulse" />
                <div
                  className="h-1.5 w-1.5 bg-current rounded-full animate-pulse"
                  style={{ animationDelay: '0.2s' }}
                />
                <div
                  className="h-1.5 w-1.5 bg-current rounded-full animate-pulse"
                  style={{ animationDelay: '0.4s' }}
                />
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div
            className={`text-xs text-[var(--text-muted)] px-1 ${isUser ? 'text-right' : 'text-left'}`}
          >
            {formatDate(message.timestamp, 'h:mm a')}
          </div>
        </div>
      </div>
    </div>
  );
}
