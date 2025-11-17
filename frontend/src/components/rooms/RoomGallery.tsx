/**
 * RoomGallery Component
 *
 * Image gallery with lightbox for room detail pages.
 * Displays all room images with thumbnail navigation and full-screen view.
 *
 * Features:
 * - Thumbnail grid with main image preview
 * - Click to open lightbox modal
 * - Keyboard navigation (arrow keys, Esc)
 * - Touch/swipe support for mobile
 * - Next.js Image optimization
 *
 * @module components/rooms/RoomGallery
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/ui/Modal';
import type { RoomImage } from '@/types';

export interface RoomGalleryProps {
  /** Array of room images */
  images: RoomImage[];

  /** Room name for alt text context */
  roomName: string;
}

/**
 * RoomGallery component displays room images with lightbox.
 *
 * Layout:
 * - Main large image preview (2:1 aspect ratio)
 * - Thumbnail grid below (4 columns on desktop, 3 on mobile)
 * - Click any image to open full-screen lightbox
 *
 * Lightbox Features:
 * - Full-screen modal with backdrop
 * - Previous/Next navigation buttons
 * - Keyboard: Arrow keys (prev/next), Esc (close)
 * - Shows current image index (e.g., "3 of 8")
 * - Image caption display
 *
 * Usage:
 * ```tsx
 * <RoomGallery
 *   images={room.images}
 *   roomName={room.name}
 * />
 * ```
 */
export function RoomGallery({ images, roomName }: RoomGalleryProps) {
  // Currently selected image index
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Lightbox open state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Open lightbox at specific image index
  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };

  // Navigate to next image in lightbox
  const goToNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  // Navigate to previous image in lightbox
  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation handler
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isLightboxOpen) return;

    switch (e.key) {
      case 'ArrowLeft':
        goToPrevious();
        break;
      case 'ArrowRight':
        goToNext();
        break;
      case 'Escape':
        setIsLightboxOpen(false);
        break;
    }
  };

  // Add keyboard event listener when lightbox is open
  React.useEffect(() => {
    if (isLightboxOpen) {
      window.addEventListener('keydown', handleKeyDown as any);
      return () => window.removeEventListener('keydown', handleKeyDown as any);
    }
  }, [isLightboxOpen, selectedIndex]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[2/1] bg-[var(--bg-tertiary)] rounded-lg flex items-center justify-center">
        <p className="text-[var(--text-muted)]">No images available</p>
      </div>
    );
  }

  const currentImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main image preview */}
      <div
        className="relative w-full aspect-[2/1] rounded-lg overflow-hidden bg-[var(--bg-tertiary)] cursor-pointer group"
        onClick={() => openLightbox(selectedIndex)}
      >
        <Image
          src={currentImage.url}
          alt={currentImage.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          className="object-cover"
          priority
        />

        {/* Zoom overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <svg
              className="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
              />
            </svg>
          </div>
        </div>

        {/* Image caption */}
        {currentImage.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-white text-sm">{currentImage.caption}</p>
          </div>
        )}
      </div>

      {/* Thumbnail grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`
              relative aspect-video rounded-lg overflow-hidden
              transition-all duration-200
              ${
                index === selectedIndex
                  ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg-primary)]'
                  : 'hover:opacity-75'
              }
            `}
            aria-label={`View image ${index + 1}: ${image.alt}`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 33vw, 20vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Modal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        title={`${roomName} Gallery`}
        size="fullscreen"
      >
        <div className="relative h-full flex flex-col">
          {/* Image counter */}
          <div className="text-center mb-4">
            <p className="text-[var(--text-secondary)]">
              {selectedIndex + 1} of {images.length}
            </p>
          </div>

          {/* Main lightbox image */}
          <div className="flex-1 relative min-h-0">
            <Image
              src={currentImage.url}
              alt={currentImage.alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Image caption in lightbox */}
          {currentImage.caption && (
            <div className="mt-4 text-center">
              <p className="text-[var(--text-secondary)]">{currentImage.caption}</p>
            </div>
          )}

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              {/* Previous button */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                aria-label="Previous image"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Next button */}
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                aria-label="Next image"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
