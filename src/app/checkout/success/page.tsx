import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Order confirmed | FitLoop",
  description: "Your FitLoop order has been confirmed.",
};

interface CheckoutSuccessPageProps {
  searchParams: Promise<{
    order?: string;
  }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { order } = await searchParams;
  const shortOrderId = order ? order.slice(0, 8).toUpperCase() : null;

  return (
    <section className="bg-background-soft py-12 lg:py-16">
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center rounded-[32px] border border-border bg-white px-6 py-14 text-center shadow-sm">
          <div className="flex size-20 items-center justify-center rounded-full bg-accent-mint/15 text-accent-mint">
            <CheckCircle2 size={36} />
          </div>

          <p className="overline mt-8 text-brand">Order confirmed</p>

          <h1 className="heading-1 mt-3 text-text-strong">
            Thank you for your order
          </h1>

          <p className="body-1 mt-4 max-w-xl text-text-muted">
            Your demo checkout was completed successfully. The order was saved
            to Supabase and can be viewed in your dashboard.
          </p>

          {shortOrderId && (
            <div className="mt-6 rounded-[24px] border border-border bg-background-soft px-5 py-4">
              <p className="caption text-text-muted">Order reference</p>
              <p className="subtitle-1 mt-1 text-text-strong">
                #{shortOrderId}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/orders"
              className="button-text inline-flex h-12 items-center justify-center rounded-button bg-brand px-6 text-white transition hover:bg-brand-dark"
            >
              View orders
            </Link>

            <Link
              href="/products"
              className="button-text inline-flex h-12 items-center justify-center rounded-button border border-border bg-white px-6 text-text-strong transition hover:border-brand hover:text-brand"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
