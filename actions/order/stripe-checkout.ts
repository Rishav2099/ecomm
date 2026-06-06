"use server";

import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const domainURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function createStripeSession(cartItems: any[]) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const productIds = cartItems.map((item) => item.productId);

  const realProducts = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const line_items = cartItems.map((cartItem) => {
    const realProduct = realProducts.find((p) => p.id === cartItem.productId);

    if (!realProduct) {
      throw new Error(`Product with ID ${cartItem.productId} not found.`);
    }

    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: realProduct.name,
          images: [realProduct.image || ""],
        },
        unit_amount: Math.round(Number(realProduct.price) * 100),
      },
      quantity: cartItem.quantity,
    };
  });

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${domainURL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domainURL}/cart`,
    metadata: {
      userId: session.user.id,
      items: JSON.stringify(
        cartItems.map((i) => ({ id: i.productId, qty: i.quantity })),
      ),
    },
  });

  return { url: stripeSession.url };
}