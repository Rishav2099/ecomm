"use client";

import { ShoppingCart, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/use-cart";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export function CartSheet() {
  // Prevent hydration mismatch errors by waiting for the component to mount
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeItem } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Calculate totals
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = items.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );

  return (
    <Sheet>
      {/* The Trigger: A button with a notification badge */}
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-in zoom-in">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      {/* The Slide-Out Panel */}
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Your Cart ({itemCount} items)</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 opacity-50" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4 border-b pb-4 last:border-0">
                <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border/50">
                  <Image
                    src={item.product.image || "/placeholder.png"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-medium line-clamp-1">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium whitespace-nowrap">
                      ₹{(Number(item.product.price) * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  
                  <div className="flex mt-2">
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-sm text-destructive hover:underline flex items-center gap-1 transition-all"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* The Footer */}
        {items.length > 0 && (
          <div className="border-t pt-6 space-y-4">
            <div className="flex justify-between font-medium text-lg">
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Shipping and taxes calculated at checkout.
            </p>
            {/* SheetTrigger wrapping the button closes the sheet when navigating away */}
            <SheetTrigger asChild>
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">Continue to Checkout</Link>
              </Button>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}