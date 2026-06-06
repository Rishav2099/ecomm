"use client";

import { useCartStore } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createStripeSession } from "@/actions/order/stripe-checkout";

export default function CheckoutPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, clearCart } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Calculate totals
  const cartTotal = items.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0,
  );

  // If cart is empty, redirect back to home
  if (items.length === 0 && !isProcessing) {
    router.push("/");
    return null;
  }

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    const orderPayload = items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    try {
      const response = await createStripeSession(orderPayload);

      if (response.url) {
        // Redirect the user to Stripe's secure payment page!
        window.location.href = response.url;
      } else {
        toast.error(response.error || "Failed to initialize payment");
        setIsProcessing(false);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

      <form
        onSubmit={handleCheckout}
        className="grid lg:grid-cols-12 gap-8 items-start"
      >
        {/* Shipping Details */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" required disabled={isProcessing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" required disabled={isProcessing} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St"
                  required
                  disabled={isProcessing}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" required disabled={isProcessing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" required disabled={isProcessing} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg bg-muted/50 text-sm text-muted-foreground flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                This is a simulated checkout. Payment integration (e.g., Stripe,
                Razorpay) would go here. For now, simply submit to finalize the
                order.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Submit */}
        <div className="lg:col-span-5 sticky top-24">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Item List */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-muted-foreground truncate pr-4">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="font-medium whitespace-nowrap">
                      ₹{(Number(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between font-bold text-lg text-foreground">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>

              <Button
                type="submit"
                className="w-full mt-6"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
