/**
 * Chat Page
 *
 * Full-page chat interface for AI chatbot interaction.
 *
 * @module app/chat/page
 */

import type { Metadata } from 'next';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { Header } from '@/components/layout/Header';

/**
 * Metadata for chat page SEO.
 */
export const metadata: Metadata = {
  title: 'Chat with AI - Hotel AI Booking Chatbot',
  description:
    'Chat with our AI assistant to book rooms, get recommendations, and manage your hotel stay.',
};

/**
 * Chat page component.
 *
 * Provides full-page ChatGPT-like chat interface as per FR-001.
 * Users can interact with AI for bookings, room info, and concierge services.
 */
export default function ChatPage() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
