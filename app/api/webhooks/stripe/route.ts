import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const metadata = session.metadata;

    if (metadata?.userId && metadata?.items) {
      try {
        const items = JSON.parse(metadata.items);

        await prisma.order.create({
          data: {
            userId: metadata.userId,
            status: "PROCESSING", 
            items: {
              create: items.map((item: any) => ({
                productId: item.id,
                quantity: item.qty,
              })),
            },
          },
        });
        
        for (const item of items) {
          await prisma.product.update({
            where: { id: item.id },
            data: {
              stock: {
                decrement: item.qty, 
              },
            },
          });
        }
        
        console.log("Order created and inventory updated successfully from Stripe Webhook!");
      } catch (error) {
        console.error("Database error during webhook processing:", error);
        return new NextResponse("Database Error", { status: 500 });
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}