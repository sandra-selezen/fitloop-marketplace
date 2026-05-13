"use client";

import Link from "next/link";

import { useCartStore } from "@/features/cart/cart-store";

const SHIPPING_PRICE = 6;

export function CartSummary() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const subtotal = useCartStore((state) => state.getSubtotal());

  const shipping = subtotal > 0 ? SHIPPING_PRICE : 0;
  const total = subtotal + shipping;

  return (
    <aside className="h-fit rounded-card border border-border bg-white p-5 shadow-sm lg:sticky lg:top-28">
      <h2 className="heading-3 text-text-strong">Order summary</h2>

      <div className="mt-5 space-y-4 border-b border-border pb-5">
        <SummaryRow
          label={`Subtotal (${totalItems} items)`}
          value={`€${subtotal}`}
        />
        <SummaryRow label="Shipping" value={`€${shipping}`} />
      </div>

      <div className="flex items-center justify-between pt-5">
        <span className="subtitle-1 text-text-strong">Total</span>
        <span className="text-[28px] font-bold leading-[36px] text-text-black">
          €{total}
        </span>
      </div>

      <Link
        href="/checkout"
        className="button-text mt-6 flex h-12 items-center justify-center rounded-button bg-brand px-6 text-white transition hover:bg-brand-dark"
      >
        Continue to checkout
      </Link>

      <Link
        href="/products"
        className="button-text mt-3 flex h-12 items-center justify-center rounded-button border border-border bg-white px-6 text-text-strong transition hover:border-brand hover:text-brand"
      >
        Keep shopping
      </Link>

      <p className="caption mt-5 text-text-muted">
        Taxes and final delivery options will be calculated during checkout.
      </p>
    </aside>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="body-2 text-text-muted">{label}</span>
      <span className="subtitle-2 text-text-strong">{value}</span>
    </div>
  );
}
