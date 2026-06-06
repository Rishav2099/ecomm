import { requireAuth } from "@/lib/auth-utils";
import CheckoutClient from "./checkout-client";

export default async function CheckoutPage() {
  await requireAuth();

  return <CheckoutClient />;
}