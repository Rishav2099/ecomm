import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await the dynamic params (Required in Next.js 15)
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id, 10);

  // If the ID in the URL isn't a valid number, show a 404 page
  if (isNaN(productId)) {
    notFound();
  }

  // Fetch the specific product
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  // If the product doesn't exist in the database, show a 404 page
  if (!product) {
    notFound();
  }

  // Serialize the product to fix the Prisma Decimal issue
  const serializedProduct = {
    ...product,
    price: Number(product.price),
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-8 -ml-4 text-muted-foreground hover:text-foreground">
        <Link href="/#products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Store
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Left Column: Huge Product Image */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-muted border shadow-sm">
          <Image
            src={product.image || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
            priority // Loads this image immediately
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Right Column: Product Details & Actions */}
        <div className="flex flex-col space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="px-3 py-1 text-sm capitalize">
              {product.category}
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-primary">
              ₹{serializedProduct.price.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              {product.description || "No description available for this product."}
            </p>
          </div>

          {/* Checkout/Cart Action Area */}
          <div className="pt-6 border-t space-y-6">
            <div className="[&>button]:w-full [&>button]:h-14 [&>button]:text-lg">
              {/* @ts-ignore - Bypassing strictly typed Prisma Decimal warning */}
              <AddToCartButton product={serializedProduct} />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <span>Fast, free shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>Secure payments via Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}