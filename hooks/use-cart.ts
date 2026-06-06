import { Product } from "@/generated/prisma/client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.product.id === product.id);

        if (existingItem) {
          // If it exists, just increase the quantity
          set({
            items: currentItems.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          // Otherwise, add the new item
          set({ items: [...currentItems, { product, quantity }] });
        }
      },

      removeItem: (productId: number) => {
        set({
          items: [...get().items.filter((i) => i.product.id !== productId)],
        });
      },

      updateQuantity: (productId: number, quantity: number) => {
        set({
          items: get().items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "ecomm-cart-storage", // The name of the key in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);