"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/use-cart";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export function AddToCartButton({ product }: { product: any }) {
  // Prevent hydration mismatch since we are reading from local storage (Zustand persist)
  const [isMounted, setIsMounted] = useState(false);
  const { items, addItem, updateQuantity, removeItem } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Return a blank placeholder of the exact same size while loading
  if (!isMounted) return <div className="h-10 w-full" />; 

  // 1. Check if this specific product is already sitting in the cart
  const cartItem = items.find((item) => item.product.id === product.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  // 2. Check stock limitations
  const isOutOfStock = product.stock <= 0;
  const maxStockReached = currentQuantity >= product.stock;

  // --- Actions ---
  const handleInitialAdd = () => {
    if (isOutOfStock) return;
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const handleIncrease = () => {
    if (maxStockReached) return;
    updateQuantity(product.id, currentQuantity + 1);
  };

  const handleDecrease = () => {
    if (currentQuantity === 1) {
      removeItem(product.id);
      toast.info(`${product.name} removed from cart`);
    } else {
      updateQuantity(product.id, currentQuantity - 1);
    }
  };

  // --- Render States ---

  // State A: Out of stock (and not currently in the cart)
  if (isOutOfStock && currentQuantity === 0) {
    return (
      <Button className="w-full h-10" disabled variant="secondary">
        Out of Stock
      </Button>
    );
  }

  // State B: Item is ALREADY in the cart! Show the synced quantity controller
  if (currentQuantity > 0) {
    return (
      <div className="flex w-full items-center justify-between border rounded-md h-10 border-primary bg-primary/10 shrink-0 overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="h-full w-10 rounded-none hover:bg-primary/20 text-primary"
          onClick={handleDecrease}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <span className="text-sm font-bold w-full text-center text-primary">
          {currentQuantity} 
        </span>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-full w-10 rounded-none hover:bg-primary/20 text-primary disabled:opacity-50"
          onClick={handleIncrease}
          disabled={maxStockReached}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // State C: Default state (Not in cart yet)
  return (
    <Button onClick={handleInitialAdd} className="w-full h-10">
      <ShoppingCart className="h-4 w-4 mr-2 shrink-0" />
      Add to Cart
    </Button>
  );
}