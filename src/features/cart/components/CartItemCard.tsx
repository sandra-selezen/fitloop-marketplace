"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { type CartItem, useCartStore } from "@/features/cart/cart-store";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const { product, quantity } = item;
  const totalPrice = product.price * quantity;

  return (
    <article className="grid gap-4 rounded-card border border-border bg-white p-4 shadow-sm sm:grid-cols-[140px_1fr]">
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-background-soft sm:aspect-square"
      >
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition duration-500 hover:scale-105"
          sizes="(max-width: 640px) 100vw, 140px"
        />
      </Link>

      <div className="flex flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="caption text-text-muted">{product.brand}</p>

            <Link href={`/products/${product.id}`}>
              <h2 className="subtitle-1 mt-1 text-text-strong transition hover:text-brand">
                {product.title}
              </h2>
            </Link>

            <p className="caption mt-2 text-text-muted">
              {product.condition} · Size {product.size}
            </p>
          </div>

          <button
            type="button"
            onClick={() => removeItem(product.id)}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background-soft text-text-muted transition hover:bg-error hover:text-white"
            aria-label="Remove item"
          >
            <Trash2 size={17} />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center rounded-button border border-border bg-white p-1">
            <button
              type="button"
              onClick={() => decreaseQuantity(product.id)}
              className="flex size-9 items-center justify-center rounded-full text-text-primary transition hover:bg-background-soft hover:text-brand"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>

            <span className="button-text min-w-8 text-center text-text-strong">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => increaseQuantity(product.id)}
              className="flex size-9 items-center justify-center rounded-full text-text-primary transition hover:bg-background-soft hover:text-brand"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="text-right">
            <p className="caption text-text-muted">Item total</p>
            <p className="subtitle-1 text-text-strong">€{totalPrice}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
