import Link from "next/link";
import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/layout/Container";
import { ProductsFilters } from "@/features/products/components/ProductsFilters";
import { ProductsToolbar } from "@/features/products/components/ProductsToolbar";
import { ProductCard, ProductCardData } from "@/features/products/components/ProductCard";

export const metadata: Metadata = {
  title: "Products | FitLoop",
  description:
    "Browse activewear, sneakers, and sports accessories on FitLoop.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    type?: string;
    size?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const search = params.search?.trim();
  const category = params.category;
  const productType = params.type;
  const size = params.size;
  const sort = params.sort ?? "newest";

  let query = supabase
    .from("products")
    .select(
      `
        id,
        title,
        slug,
        brand,
        price,
        category,
        product_type,
        condition,
        size,
        product_images (
          url,
          position
        )
      `,
    )
    .eq("status", "active");

  if (search) {
    query = query.or(`title.ilike.%${search}%,brand.ilike.%${search}%`);
  }

  if (category) {
    query = query.eq("category", category);
  }

  if (productType) {
    query = query.eq("product_type", productType);
  }

  if (size) {
    query = query.eq("size", size);
  }

  if (sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (sort === "price_desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: products, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const typedProducts = (products ?? []) as ProductCardData[];

  return (
    <div className="bg-background-soft">
      <section className="border-b border-border bg-white py-10">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="overline mb-3 text-brand">Shop activewear</p>

              <h1 className="heading-1 text-text-strong">
                Discover new and pre-owned activewear
              </h1>

              <p className="body-1 mt-4 max-w-2xl text-text-muted">
                Browse sports clothing, sneakers, and accessories from sellers
                around the community.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-8 lg:py-10">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <ProductsFilters />

            <div className="min-w-0">
              <ProductsToolbar productsCount={typedProducts.length} />

              {typedProducts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {typedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <EmptyProducts />
              )}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

function EmptyProducts() {
  return (
    <div className="flex flex-col items-center rounded-[24px] border border-dashed border-border bg-white px-6 py-12 text-center">
      <h3 className="heading-3 text-text-strong">No products found</h3>

      <p className="body-2 mt-2 max-w-md text-text-muted">
        Try changing your filters or search query.
      </p>

      <Link
        href="/products"
        className="button-text mt-6 inline-flex h-12 items-center justify-center rounded-button bg-brand px-6 text-white transition hover:bg-brand-dark"
      >
        Clear filters
      </Link>
    </div>
  );
}
