"use client";

import Link from "next/link";
import { ShoppingCart, User, Search, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/use-cart";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export function SiteNavbar() {
  const [isMounted, setIsMounted] = useState(false);
  const cartItems = useCartStore((state) => state.items);

  // Prevent hydration errors by waiting for mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate total items (sum of all quantities)
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
        >
          <Store className="h-6 w-6 text-primary" />
          <span>E-Comm</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <form action="/" className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              name="q"
              placeholder="Search products..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
            />
          </form>

          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {/* Only show the badge if mounted and there are items */}
              {isMounted && cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile" aria-label="Profile">
              <User className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
