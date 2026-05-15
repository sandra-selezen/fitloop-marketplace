import Link from "next/link";
import { ArrowRight, PackagePlus, Search, ShoppingBag } from "lucide-react";

import { mockProducts } from "@/constants/products";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/layout/Container";
import {
  ProductCard,
  type ProductCardData,
} from "@/features/products/components/ProductCard";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
        id,
        title,
        slug,
        brand,
        price,
        product_type,
        condition,
        size,
        product_images (
          url,
          position
        )
      `,
    )
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    throw new Error(error.message);
  }

  const featuredProducts = (products ?? []) as ProductCardData[];
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

      <FeaturedProductsSection products={featuredProducts} />
    </>
  );
}

interface FeaturedProductsSectionProps {
  products: ProductCardData[];
}

function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  return (
    <section className="py-12 lg:py-16">
      <Container>
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="overline mb-3 text-brand">Featured listings</p>

            <h2 className="heading-1 text-text-strong">
              Recently added activewear
            </h2>

            <p className="body-1 mt-4 max-w-2xl text-text-muted">
              Discover fresh listings from the FitLoop marketplace — from
              training essentials to outdoor layers and sneakers.
            </p>
          </div>

          <Link
            href="/products"
            className="button-text inline-flex h-12 w-fit items-center justify-center gap-2 rounded-button border border-border bg-white px-6 text-text-strong transition hover:border-brand hover:text-brand"
          >
            View all products
            <ArrowRight size={17} />
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-[32px] border border-dashed border-border bg-white px-6 py-12 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand/10 text-brand">
              <ShoppingBag size={24} />
            </div>

            <h3 className="heading-3 mt-5 text-text-strong">No listings yet</h3>

            <p className="body-2 mx-auto mt-2 max-w-md text-text-muted">
              Active listings will appear here after sellers publish products.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/sell"
                className="button-text inline-flex h-12 items-center justify-center gap-2 rounded-button bg-brand px-6 text-white transition hover:bg-brand-dark"
              >
                <PackagePlus size={17} />
                Create listing
              </Link>

              <Link
                href="/products"
                className="button-text inline-flex h-12 items-center justify-center gap-2 rounded-button border border-border bg-white px-6 text-text-strong transition hover:border-brand hover:text-brand"
              >
                <Search size={17} />
                Browse products
              </Link>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
