"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users } from "lucide-react";
import { cn } from "@/lib/utils"; // Standard Shadcn utility

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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex w-full items-center justify-between">
          {/* Brand & Links */}
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/admin" className="flex items-center space-x-2">
              <span className="font-bold sm:inline-block">Maa Kali Admin</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              {navItems.map((item) => {
                // Determine if the link is active
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "transition-colors hover:text-foreground/80 flex items-center gap-2",
                      isActive ? "text-foreground" : "text-foreground/60",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Optional: Add a User Nav Dropdown or Theme Toggle here later */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Admin Mode</span>
          </div>
        </div>
      </div>
    </header>
  );
}
