"use client";

import { useEffect, useState, Suspense } from "react";
import { useCartStore } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
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
    <Card className="max-w-md w-full text-center border-none shadow-none sm:border-solid sm:shadow-sm">
      <CardContent className="pt-10 pb-8 space-y-6 flex flex-col items-center">
        <CheckCircle className="h-20 w-20 text-green-500" />

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. We are processing your order right now.
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
  );
}

export default function SuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Verifying payment...</p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}