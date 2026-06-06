"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProductStock(id: number, newStock: number) {
  try {
    await prisma.product.update({
      where: { id },
      data: { stock: newStock },
    });
    
    // Refresh the admin products page instantly
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to update stock:", error);
    return { success: false, error: "Failed to update stock" };
  }
}