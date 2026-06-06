import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PaginationControls({
  currentPage,
  totalPages,
  searchQuery,
}: {
  currentPage: number;
  totalPages: number;
  searchQuery?: string;
}) {
  // If there's only 1 page of products, don't show the buttons at all
  if (totalPages <= 1) return null;

  // Helper to generate the exact URL for the next/prev pages
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    params.set("page", page.toString());
    
    // Add #products so the page doesn't scroll all the way up to the Hero section
    return `/?${params.toString()}#products`;
  };

  return (
    <div className="flex items-center justify-center gap-4 pt-10 mt-10 border-t border-border/50">
      <Button
        variant="outline"
        disabled={currentPage <= 1}
        asChild={currentPage > 1}
      >
        {currentPage > 1 ? (
          <Link href={createPageUrl(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Link>
        ) : (
          <>
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </>
        )}
      </Button>

      <span className="text-sm font-medium text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        disabled={currentPage >= totalPages}
        asChild={currentPage < totalPages}
      >
        {currentPage < totalPages ? (
          <Link href={createPageUrl(currentPage + 1)}>
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </Link>
        ) : (
          <>
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}