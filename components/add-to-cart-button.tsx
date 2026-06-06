"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

// Ensure your type matches what you are passing in
export function AddToCartButton({ product }: { product: any }) {
  const { addItem } = useCartStore();

  // Check if stock is 0
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Button
      onClick={handleAddToCart}
      className="w-full"
      disabled={isOutOfStock}
      variant={isOutOfStock ? "secondary" : "default"}
    >
      {isOutOfStock ? (
        "Out of Stock"
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
