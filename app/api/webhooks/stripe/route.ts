import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    // 1. Verify the webhook signature to ensure the request is actually from Stripe
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // 2. Handle the specific event when a customer successfully pays
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // 3. Extract the metadata we passed in `createStripeSession`
    const metadata = session.metadata;

    if (metadata?.userId && metadata?.items) {
      try {
        const items = JSON.parse(metadata.items);

        // 4. Create the official Order in Prisma
        await prisma.order.create({
          data: {
            userId: metadata.userId,
            status: "PROCESSING", // Payment is secured, now admin must process it
            items: {
              create: items.map((item: any) => ({
                productId: item.id,
                quantity: item.qty,
              })),
            },
          },
        });
        
        console.log("Order created successfully from Stripe Webhook!");
      } catch (error) {
        console.error("Database error during webhook processing:", error);
        return new NextResponse("Database Error", { status: 500 });
      }
    }
  }

  // 5. Always return a 200 OK so Stripe knows we received the event
  return new NextResponse(null, { status: 200 });
}