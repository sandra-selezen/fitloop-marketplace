"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useCartStore } from "@/features/cart/cart-store";
import { Container } from "@/components/layout/Container";
import { CartItemCard } from "./CartItemCard";
import { CartSummary } from "./CartSummary";

export function CartView() {
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const clearCart = useCartStore((state) => state.clearCart);

  if (!hasHydrated) {
    return (
      <section className="bg-background-soft py-10 lg:py-14">
        <Container>
          <div className="rounded-card border border-border bg-white p-6">
            <div className="h-7 w-40 animate-pulse rounded-full bg-background-soft" />
            <div className="mt-6 space-y-4">
              <div className="h-28 animate-pulse rounded-[24px] bg-background-soft" />
              <div className="h-28 animate-pulse rounded-[24px] bg-background-soft" />
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="bg-background-soft py-12 lg:py-16">
        <Container>
          <div className="mx-auto flex max-w-xl flex-col items-center rounded-[32px] border border-border bg-white px-6 py-14 text-center shadow-sm">
            <div className="flex size-16 items-center justify-center rounded-full bg-brand/10 text-brand">
              <ShoppingBag size={28} />
            </div>

            <h1 className="heading-2 mt-6 text-text-strong">
              Your cart is empty
            </h1>

            <p className="body-2 mt-3 max-w-md text-text-muted">
              Looks like you haven’t added anything yet. Explore activewear,
              sneakers, and accessories to find your next favorite item.
            </p>

            <Link
              href="/products"
              className="button-text mt-8 inline-flex h-12 items-center justify-center rounded-button bg-brand px-6 text-white transition hover:bg-brand-dark"
            >
              Start shopping
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-background-soft py-10 lg:py-14">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="overline mb-2 text-brand">Shopping cart</p>
            <h1 className="heading-1 text-text-strong">Your cart</h1>
            <p className="body-2 mt-3 text-text-muted">
              Review your selected items before moving to checkout.
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="button-text w-fit rounded-button border border-border bg-white px-5 py-2.5 text-text-strong transition hover:border-brand hover:text-brand"
          >
            Clear cart
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItemCard key={item.product.id} item={item} />
            ))}
          </div>

          <CartSummary />
        </div>
      </Container>
    </section>
  );
}
