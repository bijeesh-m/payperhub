import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export interface WishlistState {
  items: Product[];
}

export interface CompareState {
  items: Product[];
  maxItems: number;
}
