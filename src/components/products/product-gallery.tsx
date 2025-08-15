'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ShopifyImage } from '@/types/shopify';

interface ProductGalleryProps {
  images: ShopifyImage[];
  productTitle: string;
  className?: string;
}

export function ProductGallery({ images, productTitle, className }: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!images.length) {
    return (
      <div className={cn("aspect-square bg-muted rounded-lg flex items-center justify-center", className)}>
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  const activeImage = images[activeImageIndex];

  const goToPrevious = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setActiveImageIndex(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  };

  return (
    <div className={cn("space-y-4", className)} onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted group">
        <Image
          src={activeImage.url}
          alt={activeImage.altText || productTitle}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-sm px-2 py-1 rounded">
            {activeImageIndex + 1} / {images.length}
          </div>
        )}

        {/* Expand Button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => {
            // TODO: Implement lightbox/modal for full-screen view
            window.open(activeImage.url, '_blank');
          }}
          aria-label="View full size"
        >
          <Expand className="h-4 w-4" />
        </Button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative aspect-square w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all hover:opacity-75",
                activeImageIndex === index
                  ? "border-primary"
                  : "border-transparent"
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.altText || `${productTitle} image ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Dot Indicators for mobile */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 sm:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                activeImageIndex === index
                  ? "bg-primary"
                  : "bg-muted-foreground/30"
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}