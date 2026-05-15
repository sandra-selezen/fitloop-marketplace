"use client";

import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import {
  productFilterCategories,
  productFilterSizes,
  productFilterTypes,
  productSortOptions,
} from "@/constants/products-filters";
import { cn } from "@/lib/utils";

export function ProductsMobileFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount = useMemo(() => {
    const keys = ["search", "category", "type", "size", "sort"];

    return keys.filter((key) => {
      if (key === "sort") {
        return searchParams.get(key) && searchParams.get(key) !== "newest";
      }

      return Boolean(searchParams.get(key));
    }).length;
  }, [searchParams]);

  const selectedCategory = searchParams.get("category");
  const selectedType = searchParams.get("type");
  const selectedSize = searchParams.get("size");
  const selectedSort = searchParams.get("sort") ?? "newest";

  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all" || value === "newest") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const clearFilters = () => {
    router.push(pathname);
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="button-text inline-flex h-11 items-center justify-center gap-2 rounded-button border border-border bg-white px-5 text-text-strong transition hover:border-brand hover:text-brand"
      >
        <SlidersHorizontal size={17} />
        Filters
        {activeFiltersCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-brand text-[10px] font-semibold text-white">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute inset-x-0 bottom-0 flex max-h-[86dvh] flex-col overflow-hidden rounded-t-[32px] bg-white shadow-2xl">
            <div className="shrink-0 border-b border-border px-5 pb-4 pt-4">
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="overline mb-2 text-brand">Shop filters</p>
                  <h2 className="heading-3 text-text-strong">
                    Refine products
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex size-10 items-center justify-center rounded-full bg-background-soft text-text-muted transition hover:text-brand"
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              </div>

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="button-text mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-button border border-border bg-white px-4 text-text-strong transition hover:border-brand hover:text-brand"
                >
                  <X size={15} />
                  Clear filters
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
              <div className="space-y-5">
                <MobileFilterGroup
                  title="Category"
                  options={productFilterCategories}
                  selectedValue={selectedCategory}
                  onSelect={(value) => updateParam("category", value)}
                />

                <MobileFilterGroup
                  title="Product type"
                  options={productFilterTypes}
                  selectedValue={selectedType}
                  onSelect={(value) => updateParam("type", value)}
                />

                <MobileFilterGroup
                  title="Size"
                  options={productFilterSizes.map((size) => ({
                    value: size,
                    label: size,
                  }))}
                  selectedValue={selectedSize}
                  onSelect={(value) => updateParam("size", value)}
                  defaultOpen={false}
                  grid
                />

                <MobileFilterGroup
                  title="Sort by"
                  options={productSortOptions}
                  selectedValue={selectedSort}
                  onSelect={(value) => updateParam("sort", value)}
                />
              </div>
            </div>

            <div className="shrink-0 border-t border-border bg-white px-5 py-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="button-text flex h-12 w-full items-center justify-center rounded-button bg-brand px-6 text-white transition hover:bg-brand-dark"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface MobileFilterGroupProps {
  title: string;
  options: readonly {
    value: string;
    label: string;
  }[];
  selectedValue: string | null;
  onSelect: (value?: string) => void;
  defaultOpen?: boolean;
  grid?: boolean;
}

function MobileFilterGroup({
  title,
  options,
  selectedValue,
  onSelect,
  defaultOpen = true,
  grid = false,
}: MobileFilterGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border pb-5 last:border-b-0 last:pb-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <h3 className="subtitle-2 text-text-strong">{title}</h3>

        <ChevronDown
          size={17}
          className={cn(
            "text-text-muted transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn("mt-3 gap-2", grid ? "grid grid-cols-3" : "space-y-2")}
        >
          <button
            type="button"
            onClick={() => onSelect(undefined)}
            className={cn(
              "body-2 flex w-full items-center rounded-xl px-3 py-2 text-left transition",
              !selectedValue
                ? "bg-brand text-white"
                : "text-text-primary hover:bg-background-soft hover:text-brand",
              grid && "justify-center text-center",
            )}
          >
            All
          </button>

          {options.map((option) => {
            const isActive = selectedValue === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelect(option.value)}
                className={cn(
                  "body-2 flex w-full items-center rounded-xl px-3 py-2 text-left transition",
                  isActive
                    ? "bg-brand text-white"
                    : "text-text-primary hover:bg-background-soft hover:text-brand",
                  grid && "justify-center text-center",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
