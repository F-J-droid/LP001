'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col md:flex-row-reverse gap-4">
      {/* Main Image */}
      <div className="flex-1 bg-white rounded-2xl border border-muted flex items-center justify-center p-8 aspect-square relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-gray-50">
        <div className="relative w-full h-full transition-transform duration-500 ease-out hover:scale-110">
          <Image 
            src={images[activeIndex]} 
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain drop-shadow-xl"
          />
        </div>
        
        {/* Mobile indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 md:hidden">
          {images.map((_, i) => (
            <button 
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'}`}
              aria-label={`Ver imagem ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails (Desktop side, Mobile below) */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide shrink-0">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`relative w-20 h-20 md:w-24 md:h-24 bg-white rounded-xl border-2 transition-all flex items-center justify-center p-2 shrink-0 ${
              i === activeIndex ? 'border-primary shadow-md' : 'border-muted hover:border-primary/50'
            }`}
            aria-label={`Selecionar imagem ${i + 1}`}
          >
            <Image 
              src={img} 
              alt={`${alt} thumbnail ${i + 1}`}
              fill
              sizes="96px"
              className="object-contain p-2 drop-shadow-sm"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
