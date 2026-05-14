import type { Metadata } from "next";

import { CreateListingView } from "@/features/products/components/CreateListingView";

export const metadata: Metadata = {
  title: "Sell an item | FitLoop",
  description: "Create a new activewear listing on FitLoop.",
};

export default function SellPage() {
  return <CreateListingView />;
}
