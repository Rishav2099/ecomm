"use client";

import Link from "next/link";
import { User, Search, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartSheet } from "./cart-sheet";

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
        >
          <Store className="h-6 w-6 text-primary" />
          <span>E-Comm</span>
        </Link>

        {/* Right Side Navigation */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Search Bar (Hidden on tiny screens) */}
          <form action="/" className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              name="q"
              placeholder="Search products..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
            />
          </form>

          <CartSheet />

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