'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/product';

const MAX_COMPARE = 4;

interface CompareStore {
  items: Product[];
  addItem: (product: Product) => boolean;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  isFull: () => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (get().items.length >= MAX_COMPARE) return false;
        if (get().isInCompare(product.id)) return true;
        set((state) => ({ items: [...state.items, product] }));
        return true;
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        }));
      },

      toggleItem: (product) => {
        if (get().isInCompare(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      isInCompare: (productId) =>
        get().items.some((i) => i.id === productId),

      clearCompare: () => set({ items: [] }),

      isFull: () => get().items.length >= MAX_COMPARE,
    }),
    {
      name: 'payperhub-compare',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
