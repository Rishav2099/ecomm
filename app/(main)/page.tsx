import Products from "@/components/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { SearchX, SlidersHorizontal } from "lucide-react";
import { PaginationControls } from "@/components/pagination-controls";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const query = await searchParams;
  const searchQuery = query.q || "";
  const activeCategory = query.category || "";
  const currentPage = Number(query.page) || 1;

  // 1. Fetch all unique categories dynamically from your database for the filter bar
  const uniqueCategoriesResult = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
  });
  const categories = uniqueCategoriesResult.map((p) => p.category);

  // 2. Build the dynamic database query filter
  const whereClause = {
    name: {
      contains: searchQuery,
      mode: "insensitive" as const,
    },
    ...(activeCategory && { category: activeCategory }),
  };

  // 3. Run both queries simultaneously (Products + Count)
  const [rawProducts, totalProducts] = await prisma.$transaction([
    prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE,
    }),
    prisma.product.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);

  // Convert Decimals to numbers for the Client Component
  const products = rawProducts.map((product) => ({
    ...product,
    price: Number(product.price),
  }));

  // Helper function to build category filter links while preserving search queries
  const getCategoryLink = (categoryName: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (categoryName) params.set("category", categoryName);
    // Reset back to page 1 when changing categories
    return `/?${params.toString()}#products`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden bg-background py-24 sm:py-32 border-b">
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
            <Button size="lg" className="h-12 px-8 text-md font-semibold" asChild>
              <Link href="#products">Shop Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-md font-semibold" asChild>
              <Link href="/profile">View Orders</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Products Section */}
      <section id="products" className="container mx-auto px-4 md:px-8 py-16 sm:py-24 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold tracking-tight">
            {searchQuery
              ? `Search results for "${searchQuery}"`
              : "Featured Products"}
          </h2>

          {/* NEW: Dynamic Category Filter Bar Component */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filter by Category:</span>
            </div>
            
            {/* Scrollable container on mobile devices */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none">
              {/* "All Products" Pill Button */}
              <Link href={getCategoryLink("")}>
                <Badge
                  variant={activeCategory === "" ? "default" : "secondary"}
                  className={cn(
                    "px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full cursor-pointer transition-all border border-transparent shadow-sm",
                    activeCategory === "" 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : "hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground"
                  )}
                >
                  All Collection
                </Badge>
              </Link>

              {/* Dynamic Database Category Pills */}
              {categories.map((category) => {
                const isSelected = activeCategory.toLowerCase() === category.toLowerCase();
                return (
                  <Link key={category} href={getCategoryLink(category)}>
                    <Badge
                      variant={isSelected ? "default" : "secondary"}
                      className={cn(
                        "px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full capitalize cursor-pointer transition-all border border-transparent shadow-sm",
                        isSelected
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {category}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Layout Handling */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border rounded-xl bg-muted/10 border-dashed">
            <SearchX className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold">No products found</h3>
            <p className="text-muted-foreground max-w-sm">
              We couldn't find anything matching your filters. Try selecting another category or resetting your search.
            </p>
            {activeCategory && (
              <Button variant="link" asChild>
                <Link href={getCategoryLink("")}>Clear Filter</Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            <Products products={products} />
            
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              searchQuery={searchQuery}
            />
          </>
        )}
      </section>
    </div>
  );
}