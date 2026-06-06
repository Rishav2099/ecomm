"use client";

import { Product } from "@/generated/prisma/client";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AddToCartButton } from "./add-to-cart-button";

const Products = ({ products }: { products: Product[] }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2  lg:grid-cols-3">
      {products.map((product) => (
        <Card
          key={product.id}
          className="overflow-hidden py-0 transition-all hover:shadow-lg"
        >
          <div className="relative h-60 w-full">
            <Image
              src={product.image || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <CardHeader>
            <h2 className="text-xl font-semibold">{product.name}</h2>

            <p className="text-2xl font-bold text-primary">
              ₹{product.price.toString()}
            </p>
          </CardHeader>

          <CardContent>
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {product.description || "No description available."}
            </p>

            <div className="mt-4">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs">
                {product.category}
              </span>
            </div>
          </CardContent>

          <CardFooter className="flex gap-2">
            <AddToCartButton product={product} />

            <Button variant="outline" className="flex-1" asChild>
              {/* Route to the specific product ID */}
              <Link href={`/product/${product.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Products;
