import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/add-to-cart-button";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id, 10);

  if (isNaN(productId)) return notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) return notFound();

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
      <Button variant="ghost" asChild className="mb-6 -ml-4">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Store
        </Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Product Image */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden border bg-muted">
          <Image
            src={product.image || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-4 capitalize">{product.category}</Badge>
            <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-3xl font-bold text-primary mt-4">
               ₹{Number(product.price).toFixed(2)}
            </p>
          </div>

          <div className="prose prose-sm sm:prose dark:prose-invert">
            <p className="text-muted-foreground leading-relaxed">
              {product.description || "No description provided for this item."}
            </p>
          </div>

          <div className="pt-6 border-t flex flex-col sm:flex-row gap-4">
              <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}