import Link from "next/link";

import { mockProducts } from "@/constants/products";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/product/ProductCard";

export default function HomePage() {
  return (
    <>
      <section className="bg-background-soft py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-xl">
              <p className="overline mb-4 text-brand">Activewear marketplace</p>

              <h1 className="heading-1 text-text-strong sm:text-[48px] sm:leading-[58px]">
                Discover activewear that moves with you.
              </h1>

              <p className="body-1 mt-5 text-text-muted">
                Buy and sell new or pre-owned sports clothing, sneakers, and
                accessories from active people like you.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className="button-text inline-flex h-12 items-center justify-center rounded-button bg-brand px-6 text-white transition hover:bg-brand-dark"
                >
                  Start shopping
                </Link>

                <Link
                  href="/sell"
                  className="button-text inline-flex h-12 items-center justify-center rounded-button border border-border bg-white px-6 text-text-strong transition hover:border-brand hover:text-brand"
                >
                  Sell an item
                </Link>
              </div>
            </div>

            <div className="relative min-h-[360px] overflow-hidden rounded-[32px] bg-white p-4 shadow-xl">
              <div className="grid h-full grid-cols-2 gap-4">
                {mockProducts.slice(0, 4).map((product) => (
                  <div
                    key={product.id}
                    className="overflow-hidden rounded-[24px] bg-background-soft"
                  >
                    <div className="relative h-full min-h-[150px]">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="overline mb-2 text-brand">Fresh picks</p>
              <h2 className="heading-2 text-text-strong">New arrivals</h2>
            </div>

            <Link
              href="/products"
              className="button-text text-brand hover:text-brand-dark"
            >
              View all
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
