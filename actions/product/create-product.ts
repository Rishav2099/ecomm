"use server";

import { productSchema, ProductSchemaType } from "@/lib/schemas/product-schema";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Product } from "@/generated/prisma/client";

export async function createProduct(values: unknown) {
  const parsed = productSchema.safeParse(values);

  if (!parsed.success) {
    return { error: "Invalid data" };
  }

  const { name, description, price, category, image } = parsed.data;

  await prisma.product.create({
    data: { name, description, price, category, image },
  });

  return { success: true };
}

export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({
      where: { id },
    });

    // Refresh the products list cache instantly
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw new Error("Could not delete product");
  }
}

export async function updateProduct(id: number, data: ProductSchemaType) {
  try {
    // Validate inputs server-side for security
    const validatedData = productSchema.parse(data);

    await prisma.product.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        category: validatedData.category,
        image: validatedData.image,
      },
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to update product:", error);
    throw new Error("Could not update product");
  }
}
