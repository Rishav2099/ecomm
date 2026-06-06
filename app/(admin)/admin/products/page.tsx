import { deleteProduct } from "@/actions/product/create-product";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { Plus, Trash2, Edit, PackageX } from "lucide-react";
import Link from "next/link";
import { StockUpdater } from "@/components/stock-updater";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your store inventory, pricing, and details.
          </p>
        </div>
        <Button className="w-full sm:w-auto" asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[600px] sm:min-w-full">
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[80px] sm:w-[100px] hidden sm:table-cell">
                  Image
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="text-center w-[100px]">Stock</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right w-[100px] sm:w-[120px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-16 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <PackageX className="h-8 w-8 text-muted-foreground/50" />
                      <p>No products found. Use the button above to add your first item.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="table-cell">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border shrink-0">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold">
                            No img
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="font-medium max-w-[140px] sm:max-w-[200px] truncate">
                      {product.name}
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium capitalize border border-border">
                        {product.category}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-center">
                        <StockUpdater
                          productId={product.id}
                          initialStock={product.stock}
                        />
                      </div>
                    </TableCell>

                    <TableCell className="text-right font-semibold text-foreground whitespace-nowrap">
                      ₹{Number(product.price).toFixed(2)}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          asChild
                        >
                          <Link href={`/admin/products/edit/${product.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>

                        <form
                          action={async () => {
                            "use server";
                            await deleteProduct(product.id);
                          }}
                        >
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 shrink-0 bg-destructive/10 hover:bg-destructive text-destructive hover:text-destructive-foreground transition-colors"
                            type="submit"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}