"use server";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"; 
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";

export async function createOrder(
  cartItems: { productId: number; quantity: number }[],
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("You must be logged in to checkout.");
    }

    if (cartItems.length === 0) {
      throw new Error("Your cart is empty.");
    }

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });

    revalidatePath("/profile");

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Order creation failed:", error);
    return {
      success: false,
      error: error.message || "Failed to create order.",
    };
  }
}

