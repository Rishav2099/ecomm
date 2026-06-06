import EditProductForm from "@/components/admin/edit-product-form";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditPageProps) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id, 10);

  if (isNaN(productId)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Modify the properties and details of your inventory item.
        </p>
      </div>

      <EditProductForm initialData={product} />
    </div>
  );
}
