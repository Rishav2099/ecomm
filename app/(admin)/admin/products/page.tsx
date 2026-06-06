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
import { Plus, Trash2, Edit } from "lucide-react";
import Link from "next/link";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your store inventory, pricing, and details.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Modern Data Container */}
      <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  No products found. Use the button above to add your first item.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">No img</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {product.name}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium capitalize border border-border">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    ${Number(product.price).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Edit Button */}
                      <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/admin/products/edit/${product.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      
                      {/* Delete Button Form wrapper for Server Actions */}
                      <form action={async () => {
                        "use server";
                        await deleteProduct(product.id);
                      }}>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-8 w-8 bg-destructive/10 hover:bg-destructive text-destructive hover:text-destructive-foreground transition-colors"
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
  );
}