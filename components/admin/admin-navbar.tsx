"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Menu, 
  Store 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
];

export function AdminNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8 flex h-14 items-center">
        <div className="flex w-full items-center justify-between">
          
          <div className="flex items-center gap-4 md:gap-8">
            
            {/* Mobile Hamburger Menu (Hidden on md+) */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                {/* Title for screen readers (required by Shadcn accessibility) */}
                <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
                
                <div className="flex items-center space-x-2 border-b pb-6 pt-2">
                  <Store className="h-5 w-5 text-primary" />
                  <span className="font-bold">Store Admin</span>
                </div>
                
                <nav className="flex flex-col gap-2 mt-6">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)} // Close menu on click
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                          isActive 
                            ? "bg-secondary text-foreground" 
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Brand Logo/Name */}
            <Link href="/admin" className="flex items-center space-x-2">
              <Store className="h-5 w-5 text-primary hidden sm:block" />
              <span className="font-bold sm:inline-block tracking-tight">
                Store Admin
              </span>
            </Link>
            
            {/* Desktop Navigation (Hidden on sm-) */}
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "transition-colors hover:text-foreground/80 flex items-center gap-2",
                      isActive ? "text-foreground" : "text-foreground/60"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
             <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
               Admin
             </span>
          </div>

        </div>
      </div>
    </header>
  );
}