/**
 * Home Page
 *
 * Landing page for Hotel AI Booking Chatbot.
 *
 * @module app/page
 */

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

/**
 * Home page component.
 *
 * Features:
 * - Hero section with call-to-action
 * - Feature highlights
 * - Quick links to chat and rooms
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1" id="main-content">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
              Welcome to Hotel AI Booking Chatbot
            </h1>
            <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-3xl mx-auto">
              Experience luxury accommodation in Bangkok with our AI-powered booking assistant.
              Chat with our AI to book rooms, get concierge recommendations, and manage your stay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <Button variant="primary" size="lg">
                  Chat with AI Assistant
                </Button>
              </Link>
              <Link href="/rooms">
                <Button variant="secondary" size="lg">
                  Browse Rooms
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-12">
              What Our AI Can Help You With
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card hoverable>
                <div className="text-center">
                  <div className="h-12 w-12 bg-[var(--accent-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-6 w-6 text-[var(--accent)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                    Room Booking
                  </h3>
                  <p className="text-[var(--text-secondary)]">
                    Check availability, compare room types, and book your perfect accommodation
                    instantly through our AI chat.
                  </p>
                </div>
              </Card>

              <Card hoverable>
                <div className="text-center">
                  <div className="h-12 w-12 bg-[var(--success-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-6 w-6 text-[var(--success)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                    Booking Management
                  </h3>
                  <p className="text-[var(--text-secondary)]">
                    View your booking history, modify reservations, and manage cancellations with
                    ease.
                  </p>
                </div>
              </Card>

              <Card hoverable>
                <div className="text-center">
                  <div className="h-12 w-12 bg-[var(--warning-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-6 w-6 text-[var(--warning)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                    Bangkok Concierge
                  </h3>
                  <p className="text-[var(--text-secondary)]">
                    Get personalized recommendations for attractions, restaurants, and activities
                    in Bangkok.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[var(--bg-secondary)] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
              Ready to Experience AI-Powered Hospitality?
            </h2>
            <p className="text-lg text-[var(--text-secondary)] mb-8">
              Start chatting with our AI assistant now or browse our available rooms.
            </p>
            <Link href="/chat">
              <Button variant="primary" size="lg">
                Start Chatting
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
