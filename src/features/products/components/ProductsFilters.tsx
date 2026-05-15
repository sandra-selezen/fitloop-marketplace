"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

import {
  productFilterCategories,
  productFilterSizes,
  productFilterTypes,
  productSortOptions,
} from "@/constants/products-filters";
import { cn } from "@/lib/utils";

export function ProductsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const selectedCategory = searchParams.get("category");
  const selectedType = searchParams.get("type");
  const selectedSize = searchParams.get("size");
  const selectedSort = searchParams.get("sort") ?? "newest";

  return (
    <aside className="hidden h-fit rounded-card border border-border bg-white p-5 shadow-sm lg:sticky lg:top-28 lg:block">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="subtitle-1 text-text-strong">Filters</h2>

        <button
          type="button"
          onClick={clearFilters}
          className="caption inline-flex items-center gap-1 text-text-muted transition hover:text-brand"
        >
          <X size={14} />
          Clear all
        </button>
      </div>

      <div className="space-y-6 pt-5">
        <FilterGroup
          title="Category"
          options={productFilterCategories}
          selectedValue={selectedCategory}
          onSelect={(value) => updateParam("category", value)}
        />

        <FilterGroup
          title="Product type"
          options={productFilterTypes}
          selectedValue={selectedType}
          onSelect={(value) => updateParam("type", value)}
        />

        <FilterGroup
          title="Size"
          options={productFilterSizes.map((size) => ({
            value: size,
            label: size,
          }))}
          selectedValue={selectedSize}
          onSelect={(value) => updateParam("size", value)}
          defaultOpen={false}
        />

        <FilterGroup
          title="Sort by"
          options={productSortOptions}
          selectedValue={selectedSort}
          onSelect={(value) => updateParam("sort", value)}
        />
      </div>
    </aside>
  );
}

interface FilterGroupProps {
  title: string;
  options: readonly {
    value: string;
    label: string;
  }[];
  selectedValue: string | null;
  onSelect: (value?: string) => void;
  defaultOpen?: boolean;
}

function FilterGroup({
  title,
  options,
  selectedValue,
  onSelect,
  defaultOpen = true,
}: FilterGroupProps) {
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
          className={`text-text-muted transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={() => onSelect(undefined)}
            className={cn(
              "body-2 flex w-full items-center rounded-xl px-3 py-2 text-left transition",
              !selectedValue
                ? "bg-brand text-white"
                : "text-text-primary hover:bg-background-soft hover:text-brand",
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
