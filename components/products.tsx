"use client";

import { Product } from "@/generated/prisma/client";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AddToCartButton } from "./add-to-cart-button";

type SerializedProduct = Omit<Product, "price"> & { price: number };

const Products = ({ products }: { products: SerializedProduct[] }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
      {products.map((product) => (
        <Card
          key={product.id}
          className="group relative flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-border/50 py-0"
        >
          {/* THE MAGIC TRICK: This link stretches over the whole card */}
          <Link 
            href={`/product/${product.id}`} 
            className="absolute inset-0 z-10"
            aria-label={`View details for ${product.name}`}
          />

          {/* Image Container */}
          <div className="relative aspect-square w-full overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={product.image || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <CardHeader className="p-5 pb-3 flex-shrink-0">
            <div className="flex justify-between items-start gap-4">
              <h2 className="text-xl font-semibold leading-tight line-clamp-1">
                {product.name}
              </h2>
            </div>
            <p className="text-2xl font-bold text-primary tracking-tight">
              ₹{product.price.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </CardHeader>

          <CardContent className="flex flex-col flex-grow p-5 pt-0 space-y-4">
            <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
              {product.description || "No description available."}
            </p>

            <div className="mt-auto pt-2">
              <Badge variant="secondary" className="px-3 py-1 font-medium capitalize">
                {product.category}
              </Badge>
            </div>
          </CardContent>

          {/* UPDATED: Swapped 'grid' for 'flex flex-wrap'. 
            This allows the buttons to stack automatically ONLY when the card gets too narrow! 
          */}
          <CardFooter className="relative z-20 p-5 flex flex-wrap gap-2 flex-shrink-0">
            
            {/* flex-1 makes it stretch, min-w-[180px] ensures the quantity selector has room to breathe */}
            <div className="flex-1 min-w-[180px] [&>div]:w-full [&>button]:h-10 [&>button]:text-sm">
              {/* @ts-ignore */}
              <AddToCartButton product={product} />
            </div>

            {/* min-w-[100px] ensures this button doesn't get squished into nothing */}
            <Button variant="secondary" className="flex-1 min-w-[100px] h-10 text-sm">
              Details
            </Button>
            
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Products;