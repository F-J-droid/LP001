import { CartItem } from '../types';

export function getCartTotalQuantity(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
}

export function getCartPixTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    // If the item has a pixPrice, use it; otherwise fallback to unitPrice
    const effectivePrice = item.pixPrice ?? item.unitPrice;
    return total + (effectivePrice * item.quantity);
  }, 0);
}

export function getCartSavings(items: CartItem[]): number {
  const subtotal = getCartSubtotal(items);
  const pixTotal = getCartPixTotal(items);
  // Returns > 0 if there are actual savings via PIX for example
  return Math.max(0, subtotal - pixTotal);
}
