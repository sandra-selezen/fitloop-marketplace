"use client";

import Link from "next/link";
import { Heart, Menu, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";

import { mainNavLinks } from "@/constants/navigation";
import { cn } from "@/lib/utils/cn";
import { useCartStore } from "@/features/cart/cart-store";
import { Container } from "./Container";

export function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <Container>
        <div className="flex h-20 items-center justify-between gap-6">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={handleCloseMenu}
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-brand text-white">
              F
            </div>
            <span className="heading-4 text-text-strong">FitLoop</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="body-2 text-text-primary transition hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/favorites"
              className="flex size-10 items-center justify-center rounded-full bg-background-soft text-text-primary transition hover:text-brand"
              aria-label="Favorites"
            >
              <Heart size={18} />
            </Link>

            <Link
              href="/cart"
              className="relative flex size-10 items-center justify-center rounded-full bg-background-soft text-text-primary transition hover:text-brand"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              {hasHydrated && totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-brand text-[10px] font-semibold text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              href="/auth/login"
              className="flex size-10 items-center justify-center rounded-full bg-text-strong text-white transition hover:bg-brand"
              aria-label="Account"
            >
              <User size={18} />
            </Link>
          </div>

          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full bg-background-soft text-text-strong transition hover:text-brand md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </Container>

      <div
        className={cn(
          "absolute left-0 top-full w-full overflow-hidden border-t border-border bg-white shadow-xl transition-all duration-300 md:hidden",
          isMenuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <div className="min-h-0">
          <Container>
            <div className="space-y-6 py-6">
              <nav className="grid gap-2">
                {mainNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleCloseMenu}
                    className="body-2 rounded-2xl px-4 py-3 text-text-primary transition hover:bg-background-soft hover:text-brand"
                  >
                    {link.label}
                  </Link>
                ))}

                <Link
                  href="/favorites"
                  onClick={handleCloseMenu}
                  className="body-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-text-primary transition hover:bg-background-soft hover:text-brand"
                >
                  <Heart size={18} />
                  Favorites
                </Link>

                <Link
                  href="/cart"
                  onClick={handleCloseMenu}
                  className="body-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-text-primary transition hover:bg-background-soft hover:text-brand"
                >
                  <ShoppingBag size={18} />
                  Cart
                </Link>

                <Link
                  href="/auth/login"
                  onClick={handleCloseMenu}
                  className="body-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-text-primary transition hover:bg-background-soft hover:text-brand"
                >
                  <User size={18} />
                  Account
                </Link>
              </nav>

              <Link
                href="/sell"
                onClick={handleCloseMenu}
                className="button-text flex h-12 items-center justify-center rounded-button bg-brand px-6 text-white transition hover:bg-brand-dark"
              >
                Sell an item
              </Link>
            </div>
          </Container>
        </div>
      </div>
    </header>
  );
}
