import Products from "@/components/products";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  // Await searchParams in Next.js 15+ (If using Next 14, remove await)
  const query = await searchParams;
  const searchQuery = query.q || "";

  // Dynamic Prisma query based on URL parameters
  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: searchQuery,
        mode: "insensitive", // Case-insensitive search
      },
      // You can add category filtering here too:
      // ...(query.category && { category: query.category }),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* ... Hero Section ... */}
      <section className="bg-muted/30 py-20 border-b">
        <div className="container mx-auto px-4 md:px-8 text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Welcome to the Store
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our latest collection of premium products. Fast shipping
            and the best quality guaranteed.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button size="lg" asChild>
              <Link href="#products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : "Featured Products"}
        </h2>

        {products.length === 0 ? (
          <p className="text-muted-foreground">No products found.</p>
        ) : (
          <Products products={products} />
        )}
      </section>
    </div>
  );
}
