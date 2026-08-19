export interface CartItem {
  productId: string;
  slug: string;
  brand: string;
  model: string;
  imageUrl: string;
  width: number;
  profile: number;
  rim: number;
  unitPrice: number;
  pixPrice?: number;
  quantity: number;
  stockQuantity?: number;
}

export interface CartState {
  version: number;
  items: CartItem[];
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'INCREMENT'; payload: string }
  | { type: 'DECREMENT'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE_CART'; payload: CartItem[] };

export interface CartStorageService {
  load(): CartState;
  save(state: CartState): void;
  clear(): void;
}
