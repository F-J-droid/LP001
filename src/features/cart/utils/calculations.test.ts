import { describe, it, expect } from 'vitest';
import { getCartTotalQuantity, getCartSubtotal, getCartPixTotal, getCartSavings } from './calculations';
import { CartItem } from '../types';

describe('Cart Calculations', () => {
  const mockItems: CartItem[] = [
    {
      productId: '1',
      slug: 'pneu-1',
      brand: 'Michelin',
      model: 'Primacy 4',
      imageUrl: '/img.png',
      width: 205,
      profile: 55,
      rim: 16,
      unitPrice: 500,
      pixPrice: 450,
      quantity: 2, // 2 items
    },
    {
      productId: '2',
      slug: 'pneu-2',
      brand: 'Pirelli',
      model: 'P1',
      imageUrl: '/img.png',
      width: 175,
      profile: 70,
      rim: 14,
      unitPrice: 300,
      // No pixPrice
      quantity: 1, // 1 item
    }
  ];

  it('should calculate total quantity correctly', () => {
    expect(getCartTotalQuantity(mockItems)).toBe(3);
  });

  it('should calculate subtotal correctly', () => {
    // 2 * 500 = 1000
    // 1 * 300 = 300
    // Total = 1300
    expect(getCartSubtotal(mockItems)).toBe(1300);
  });

  it('should calculate PIX total correctly', () => {
    // 2 * 450 = 900
    // 1 * 300 = 300
    // Total = 1200
    expect(getCartPixTotal(mockItems)).toBe(1200);
  });

  it('should calculate savings correctly', () => {
    // 1300 - 1200 = 100
    expect(getCartSavings(mockItems)).toBe(100);
  });

  it('should return 0 for empty cart', () => {
    expect(getCartTotalQuantity([])).toBe(0);
    expect(getCartSubtotal([])).toBe(0);
    expect(getCartPixTotal([])).toBe(0);
    expect(getCartSavings([])).toBe(0);
  });
});
