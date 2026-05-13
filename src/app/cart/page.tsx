import type { Metadata } from "next";
import { CartView } from "@/features/cart/components/CartView";

export const metadata: Metadata = {
  title: "Cart | FitLoop",
  description: "Review your FitLoop cart before checkout.",
};

export default function CartPage() {
  return <CartView />;
}
