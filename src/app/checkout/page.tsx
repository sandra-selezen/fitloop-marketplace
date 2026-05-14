import type { Metadata } from "next";

import { CheckoutView } from "@/features/checkout/components/CheckoutVew";

export const metadata: Metadata = {
  title: "Checkout | FitLoop",
  description: "Complete your FitLoop demo checkout.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
