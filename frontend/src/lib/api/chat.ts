/**
 * Chat API Client
 *
 * Handles all chat-related API calls to the backend.
 *
 * @module lib/api/chat
 */

import { apiClient } from './client';
import type {
  ChatSession,
  ChatMessage,
  ChatMessageCreate,
  ChatResponse,
  PaginatedResponse,
} from '@/types';

/**
 * Send a message to the AI chatbot.
 *
 * @param messageData - Message content and optional session ID
 * @returns Chat response with session ID and AI message
 */
export async function sendMessage(messageData: ChatMessageCreate): Promise<ChatResponse> {
  return apiClient.post<ChatResponse>('/api/chat/send', messageData);
}

/**
 * Get all chat sessions for the current user.
 *
 * @param page - Page number (default: 1)
 * @param pageSize - Items per page (default: 20)
 * @returns Paginated list of chat sessions
 */
export async function getChatSessions(
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<ChatSession>> {
  return apiClient.get<PaginatedResponse<ChatSession>>(
    `/api/chat/sessions?page=${page}&page_size=${pageSize}`
  );
}

/**
 * Get a specific chat session by ID.
 *
 * @param sessionId - Chat session ID
 * @returns Chat session with all messages
 */
export async function getChatSession(sessionId: string): Promise<ChatSession> {
  return apiClient.get<ChatSession>(`/api/chat/sessions/${sessionId}`);
}

/**
 * Delete a chat session.
 *
 * @param sessionId - Chat session ID
 */
export async function deleteChatSession(sessionId: string): Promise<void> {
  return apiClient.delete<void>(`/api/chat/sessions/${sessionId}`);
}

/**
 * Update chat session title.
 *
 * @param sessionId - Chat session ID
 * @param title - New title
 */
export async function updateChatSessionTitle(
  sessionId: string,
  title: string
): Promise<ChatSession> {
  return apiClient.patch<ChatSession>(`/api/chat/sessions/${sessionId}`, { title });
}
