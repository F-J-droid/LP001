'use client';

import { useCart } from '../context/cart-context';
import { getCartTotalQuantity } from '../utils/calculations';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export function CartButton() {
  const { state, setIsCartDrawerOpen, isHydrated } = useCart();
  
  if (!isHydrated) {
    return (
      <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold opacity-50 cursor-default">
        <ShoppingCart className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Carrinho</span>
      </Button>
    );
  }

  const totalItems = getCartTotalQuantity(state.items);

  return (
    <Button 
      size="sm" 
      className="bg-primary hover:bg-primary/90 text-white font-bold relative"
      onClick={() => setIsCartDrawerOpen(true)}
      aria-label={`Abrir carrinho com ${totalItems} itens`}
    >
      <ShoppingCart className="w-4 h-4 sm:mr-2" />
      <span className="hidden sm:inline">Carrinho</span>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
          {totalItems}
        </span>
      )}
    </Button>
  );
}
