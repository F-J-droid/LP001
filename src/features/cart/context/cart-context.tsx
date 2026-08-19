'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { CartState, CartAction, CartItem } from '../types';
import { localStorageCartStorage } from '../storage/local-storage';

const initialState: CartState = {
  version: 1,
  items: [],
};

export function cartReducer(state: CartState, action: CartAction): CartState {
  let newState: CartState;

  switch (action.type) {
    case 'HYDRATE_CART':
      newState = { ...state, items: action.payload };
      break;

    case 'ADD_ITEM': {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(i => i.productId === newItem.productId);

      if (existingItemIndex >= 0) {
        // Item exists, increment quantity
        const updatedItems = [...state.items];
        const existing = updatedItems[existingItemIndex];
        const newQty = existing.quantity + newItem.quantity;
        
        // Respect stock limit
        const finalQty = existing.stockQuantity !== undefined 
          ? Math.min(newQty, existing.stockQuantity) 
          : newQty;

        updatedItems[existingItemIndex] = { ...existing, quantity: finalQty };
        newState = { ...state, items: updatedItems };
      } else {
        // New item
        // Respect stock limit for the new item as well
        const initialQty = newItem.stockQuantity !== undefined
          ? Math.min(newItem.quantity, newItem.stockQuantity)
          : newItem.quantity;
          
        newState = { ...state, items: [...state.items, { ...newItem, quantity: initialQty }] };
      }
      break;
    }

    case 'REMOVE_ITEM':
      newState = {
        ...state,
        items: state.items.filter(i => i.productId !== action.payload),
      };
      break;

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      newState = {
        ...state,
        items: state.items.map(i => {
          if (i.productId === productId) {
            const finalQty = i.stockQuantity !== undefined 
              ? Math.min(Math.max(1, quantity), i.stockQuantity) 
              : Math.max(1, quantity);
            return { ...i, quantity: finalQty };
          }
          return i;
        })
      };
      break;
    }

    case 'INCREMENT':
      newState = {
        ...state,
        items: state.items.map(i => {
          if (i.productId === action.payload) {
            const finalQty = i.stockQuantity !== undefined 
              ? Math.min(i.quantity + 1, i.stockQuantity) 
              : i.quantity + 1;
            return { ...i, quantity: finalQty };
          }
          return i;
        })
      };
      break;

    case 'DECREMENT':
      newState = {
        ...state,
        items: state.items.map(i => {
          if (i.productId === action.payload) {
            return { ...i, quantity: Math.max(1, i.quantity - 1) };
          }
          return i;
        })
      };
      break;

    case 'CLEAR_CART':
      newState = { ...state, items: [] };
      break;

    default:
      return state;
  }

  // Save to storage on every state change (except hydrate)
  if (action.type !== 'HYDRATE_CART') {
    localStorageCartStorage.save(newState);
  }

  return newState;
}

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  isHydrated: boolean;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (isOpen: boolean) => void;
  addItem: (item: CartItem) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Hydrate cart from storage on mount (avoids SSR mismatch)
  useEffect(() => {
    const loadedState = localStorageCartStorage.load();
    if (loadedState.items.length > 0) {
      dispatch({ type: 'HYDRATE_CART', payload: loadedState.items });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    // Feedback is visual through drawer opening
    setIsCartDrawerOpen(true);
  };

  return (
    <CartContext.Provider value={{ 
      state, 
      dispatch, 
      isHydrated,
      isCartDrawerOpen,
      setIsCartDrawerOpen,
      addItem
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
