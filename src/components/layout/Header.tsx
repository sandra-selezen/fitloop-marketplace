import Link from "next/link";
import { Heart, ShoppingBag, User } from "lucide-react";

import { mainNavLinks } from "@/constants/navigation";
import { Container } from "./Container";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <Container>
        <div className="flex h-20 items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
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

          <div className="flex items-center gap-3">
            <Link
              href="/favorites"
              className="hidden size-10 items-center justify-center rounded-full bg-background-soft text-text-primary transition hover:text-brand sm:flex"
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
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-brand text-[10px] font-semibold text-white">
                0
              </span>
            </Link>

            <Link
              href="/auth/login"
              className="hidden size-10 items-center justify-center rounded-full bg-text-strong text-white transition hover:bg-brand md:flex"
              aria-label="Account"
            >
              <User size={18} />
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
