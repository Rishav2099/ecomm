import Products from "@/components/products";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { SearchX } from "lucide-react";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const query = await searchParams;
  const searchQuery = query.q || "";

  // 1. Rename your variable slightly to indicate it's raw data from the DB
  const rawProducts = await prisma.product.findMany({
    where: {
      name: {
        contains: searchQuery,
        mode: "insensitive",
      },
      ...(query.category && { category: query.category }),
    },
    orderBy: { createdAt: "desc" },
  });

  // 2. Map over the results and convert the Decimal to a standard number
  const products = rawProducts.map((product) => ({
    ...product,
    price: Number(product.price),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden bg-background py-24 sm:py-32 border-b">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-muted/20 -z-10" />
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-background to-transparent -z-10" />

        <div className="container mx-auto px-4 md:px-8 text-center space-y-8">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight">
              <span className="text-foreground">Welcome to the </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Store
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Discover our latest collection of premium products. Fast shipping
              and the best quality guaranteed.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="h-12 px-8 text-md font-semibold"
              asChild
            >
              <Link href="#products">Shop Now</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-md font-semibold"
              asChild
            >
              <Link href="/profile">View Orders</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section
        id="products"
        className="container mx-auto px-4 md:px-8 py-16 sm:py-24"
      >
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold tracking-tight">
            {searchQuery
              ? `Search results for "${searchQuery}"`
              : "Featured Products"}
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border rounded-xl bg-muted/10 border-dashed">
            <SearchX className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold">No products found</h3>
            <p className="text-muted-foreground max-w-sm">
              We couldn't find anything matching "{searchQuery}". Try adjusting
              your search terms.
            </p>
          </div>
        ) : (
          <Products products={products} />
        )}
      </section>
    </div>
  );
}
