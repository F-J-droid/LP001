import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cartReducer } from './cart-context';
import { CartState, CartItem } from '../types';

describe('cartReducer', () => {
  const initialState: CartState = {
    version: 1,
    items: []
  };

  const mockItem: CartItem = {
    productId: '1',
    slug: 'pneu-1',
    brand: 'Brand',
    model: 'Model',
    imageUrl: '/img.png',
    width: 205,
    profile: 55,
    rim: 16,
    unitPrice: 500,
    quantity: 1,
    stockQuantity: 5
  };

  // Mock localStorage wrapper to avoid DOM exceptions in JSDom if needed
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  it('should add a new item', () => {
    const state = cartReducer(initialState, { type: 'ADD_ITEM', payload: mockItem });
    expect(state.items.length).toBe(1);
    expect(state.items[0].productId).toBe('1');
    expect(state.items[0].quantity).toBe(1);
  });

  it('should increment quantity if item already exists', () => {
    const state1 = cartReducer(initialState, { type: 'ADD_ITEM', payload: mockItem });
    const state2 = cartReducer(state1, { type: 'ADD_ITEM', payload: mockItem });
    expect(state2.items.length).toBe(1);
    expect(state2.items[0].quantity).toBe(2);
  });

  it('should respect stock limit when adding same item multiple times', () => {
    // mockItem has stockQuantity = 5
    let state = cartReducer(initialState, { type: 'ADD_ITEM', payload: { ...mockItem, quantity: 4 } });
    state = cartReducer(state, { type: 'ADD_ITEM', payload: { ...mockItem, quantity: 3 } });
    
    // 4 + 3 = 7, but stock is 5
    expect(state.items[0].quantity).toBe(5);
  });

  it('should remove item', () => {
    const state1 = cartReducer(initialState, { type: 'ADD_ITEM', payload: mockItem });
    const state2 = cartReducer(state1, { type: 'REMOVE_ITEM', payload: '1' });
    expect(state2.items.length).toBe(0);
  });

  it('should increment quantity', () => {
    const state1 = cartReducer(initialState, { type: 'ADD_ITEM', payload: mockItem });
    const state2 = cartReducer(state1, { type: 'INCREMENT', payload: '1' });
    expect(state2.items[0].quantity).toBe(2);
  });

  it('should decrement quantity but not below 1', () => {
    const state1 = cartReducer(initialState, { type: 'ADD_ITEM', payload: mockItem });
    const state2 = cartReducer(state1, { type: 'DECREMENT', payload: '1' });
    expect(state2.items[0].quantity).toBe(1); // Still 1
  });

  it('should update quantity explicitly and respect stock limit', () => {
    const state1 = cartReducer(initialState, { type: 'ADD_ITEM', payload: mockItem });
    const state2 = cartReducer(state1, { type: 'UPDATE_QUANTITY', payload: { productId: '1', quantity: 10 } });
    expect(state2.items[0].quantity).toBe(5); // Stock limit is 5
  });

  it('should clear cart', () => {
    const state1 = cartReducer(initialState, { type: 'ADD_ITEM', payload: mockItem });
    const state2 = cartReducer(state1, { type: 'CLEAR_CART' });
    expect(state2.items.length).toBe(0);
  });

  it('should hydrate cart', () => {
    const state = cartReducer(initialState, { type: 'HYDRATE_CART', payload: [mockItem] });
    expect(state.items.length).toBe(1);
    expect(state.items[0].productId).toBe('1');
  });
});
