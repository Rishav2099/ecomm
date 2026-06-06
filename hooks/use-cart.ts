import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  product: any;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  // Updated addItem to accept a quantity parameter
  addItem: (product: any, quantity?: number) => void;
  removeItem: (productId: number) => void;
  // NEW: Function to handle + / - buttons
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.product.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),

      // NEW: Updates the specific item's quantity, or removes it if quantity hits 0
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((item) => item.product.id !== productId)
            : state.items.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
              ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    { name: "cart-storage" }
  )
);