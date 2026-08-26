'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  productId: string;
}

export function FavoriteButton({ productId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // TODO: implement actual favorite logic (e.g. save to localStorage or DB)
  };

  return (
    <button 
      onClick={toggleFavorite}
      className="absolute top-3 right-3 z-20 p-2 bg-background/80 hover:bg-background backdrop-blur-sm border rounded-full text-muted-foreground hover:text-red-500 transition-all duration-300 shadow-sm"
      aria-label="Favoritar"
    >
      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
    </button>
  );
}
