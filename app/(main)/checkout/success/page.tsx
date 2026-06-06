"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Clear the cart when they land on the success page
    if (sessionId) {
      clearCart();
    }
  }, [clearCart, sessionId]);

  if (!isMounted) return null;

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full text-center border-none shadow-none sm:border-solid sm:shadow-sm">
        <CardContent className="pt-10 pb-8 space-y-6 flex flex-col items-center">
          <CheckCircle className="h-20 w-20 text-green-500" />

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. We are processing your order right
              now.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 w-full">
            <Button className="flex-1" asChild>
              <Link href="/profile">View Orders</Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
