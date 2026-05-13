"use client";

import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { type CartProduct, useCartStore } from "@/features/cart/cart-store";

interface AddToCartButtonProps {
  product: CartProduct;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product);
    toast.success("Added to cart");
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className="button-text inline-flex h-12 items-center justify-center gap-2 rounded-button bg-brand px-6 text-white transition hover:bg-brand-dark"
    >
      <ShoppingBag size={18} />
      Add to cart
    </button>
  );
}
