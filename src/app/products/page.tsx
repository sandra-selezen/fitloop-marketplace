import { Search, SlidersHorizontal } from "lucide-react";

import { categories, mockProducts, sizes } from "@/constants/products";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/product/ProductCard";

const productTypes = ["All", "New", "Pre-owned"];

export default function ProductsPage() {
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

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="button-text inline-flex h-11 items-center justify-center gap-2 rounded-button border border-border bg-white px-5 text-text-strong transition hover:border-brand hover:text-brand lg:hidden"
              >
                <SlidersHorizontal size={17} />
                Filters
              </button>

              <select className="h-11 rounded-button border border-border bg-white px-5 text-sm font-medium text-text-strong outline-none transition focus:border-brand">
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-8 lg:py-10">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="hidden h-fit rounded-card border border-border bg-white p-5 lg:block">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="subtitle-1 text-text-strong">Filters</h2>
                <button
                  type="button"
                  className="caption text-text-muted transition hover:text-brand"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-6 pt-5">
                <FilterGroup title="Category" options={categories} />
                <FilterGroup title="Product type" options={productTypes} />
                <FilterGroup title="Size" options={sizes} />

                <div>
                  <h3 className="subtitle-2 mb-3 text-text-strong">
                    Price range
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      className="h-10 rounded-xl border border-border px-3 text-sm outline-none transition placeholder:text-text-muted focus:border-brand"
                    />

                    <input
                      type="number"
                      placeholder="Max"
                      className="h-10 rounded-xl border border-border px-3 text-sm outline-none transition placeholder:text-text-muted focus:border-brand"
                    />
                  </div>
                </div>
              </div>
            </aside>

            <div>
              <div className="mb-6 flex flex-col gap-4 rounded-card border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-md">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                  />

                  <input
                    type="search"
                    placeholder="Search by product, brand, or category"
                    className="h-12 w-full rounded-button border border-border bg-background-soft pl-11 pr-4 text-sm outline-none transition placeholder:text-text-muted focus:border-brand focus:bg-white"
                  />
                </div>

                <p className="body-2 shrink-0 text-text-muted">
                  Showing{" "}
                  <span className="font-semibold text-text-strong">
                    {mockProducts.length}
                  </span>{" "}
                  products
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {mockProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

interface FilterGroupProps {
  title: string;
  options: string[];
}

function FilterGroup({ title, options }: FilterGroupProps) {
  return (
    <div>
      <h3 className="subtitle-2 mb-3 text-text-strong">{title}</h3>

      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-background-soft"
          >
            <input
              type="checkbox"
              className="size-4 rounded border-border accent-brand"
            />
            <span className="body-2 text-text-primary">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
