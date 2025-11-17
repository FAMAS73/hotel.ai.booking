/**
 * TypingIndicator Component
 *
 * Shows animated typing indicator when AI is generating response.
 *
 * @module components/chat/TypingIndicator
 */

'use client';

import React from 'react';

/**
 * TypingIndicator component shows AI is typing.
 *
 * Features:
 * - Animated dots
 * - AI avatar
 * - Matches chat message styling
 *
 * Usage:
 * ```tsx
 * {isTyping && <TypingIndicator />}
 * ```
 */
export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4 animate-fade-in">
      <div className="flex gap-3 max-w-[80%]">
        {/* AI Avatar */}
        <div
          className="flex-shrink-0 h-8 w-8 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-primary)] flex items-center justify-center text-sm font-semibold"
        >
          AI
        </div>

        {/* Typing bubble */}
        <div className="bg-[var(--chat-assistant-bg)] text-[var(--chat-assistant-text)] px-4 py-3 rounded-lg theme-transition">
          <div className="flex items-center gap-1">
            <div
              className="h-2 w-2 bg-current rounded-full animate-pulse"
              style={{ animationDuration: '1s' }}
            />
            <div
              className="h-2 w-2 bg-current rounded-full animate-pulse"
              style={{ animationDuration: '1s', animationDelay: '0.2s' }}
            />
            <div
              className="h-2 w-2 bg-current rounded-full animate-pulse"
              style={{ animationDuration: '1s', animationDelay: '0.4s' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
