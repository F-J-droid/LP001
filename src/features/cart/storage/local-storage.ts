import { CartState, CartStorageService } from '../types';

const CART_STORAGE_KEY = 'tirestore_cart';
const CART_VERSION = 1;

export const localStorageCartStorage: CartStorageService = {
  load(): CartState {
    if (typeof window === 'undefined') {
      return { version: CART_VERSION, items: [] };
    }
    
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      if (!data) {
        return { version: CART_VERSION, items: [] };
      }
      
      const parsed = JSON.parse(data);
      
      // Migration logic could go here if parsed.version !== CART_VERSION
      if (parsed.version !== CART_VERSION || !Array.isArray(parsed.items)) {
        return { version: CART_VERSION, items: [] };
      }
      
      return parsed as CartState;
    } catch (error) {
      console.error('Failed to parse cart storage:', error);
      return { version: CART_VERSION, items: [] };
    }
  },

  save(state: CartState): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear cart storage:', error);
    }
  }
};
