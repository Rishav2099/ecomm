import { requireAuth } from "@/lib/auth-utils";
import CheckoutClient from "./checkout-client";

export default async function CheckoutPage() {
  // Secure server-side validation - redirects if not logged in
  await requireAuth();

  // If authenticated, render the interactive client form
  return <CheckoutClient />;
}