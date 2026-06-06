"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart";
import { toast } from "sonner"; // Assuming you are using sonner for toasts
import { Product } from "@/generated/prisma/client";

export function AddToCartButton({ product }: { product: Product }) {
  const cart = useCartStore();

  const handleAddToCart = () => {
    cart.addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Button 
      size="lg" 
      className="w-full sm:w-auto flex-1 h-14 text-lg"
      onClick={handleAddToCart}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      Add to Cart
    </Button>
  );
}