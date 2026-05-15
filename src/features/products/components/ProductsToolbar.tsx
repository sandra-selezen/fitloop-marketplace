"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { productSortOptions } from "@/constants/products-filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductsMobileFilters } from "./ProductsMobileFilters";

interface ProductsToolbarProps {
  productsCount: number;
}

export function ProductsToolbar({ productsCount }: ProductsToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";

  const activeFiltersCount = useMemo(() => {
    const keys = ["search", "category", "type", "size", "sort"];

    return keys.filter((key) => {
      if (key === "sort") {
        return searchParams.get(key) && searchParams.get(key) !== "newest";
      }

      return Boolean(searchParams.get(key));
    }).length;
  }, [searchParams]);

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

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const selectedSort = searchParams.get("sort") ?? "newest";

  return (
    <div className="mb-6 space-y-4">
      <div className="grid gap-4 rounded-card border border-border bg-white p-4 shadow-sm xl:grid-cols-[minmax(320px,1fr)_auto_auto] xl:items-center">
        <SearchForm
          key={currentSearch}
          initialSearch={currentSearch}
          onSearch={(value) => updateParam("search", value)}
          onClearSearch={clearSearch}
        />

        <p className="body-2 whitespace-nowrap text-text-muted">
          Showing{" "}
          <span className="font-semibold text-text-strong">
            {productsCount}
          </span>{" "}
          products
        </p>

        <Select
          value={selectedSort}
          onValueChange={(value) => updateParam("sort", value)}
        >
          <SelectTrigger className="h-11 w-full rounded-button border-border bg-white px-4 text-sm font-medium text-text-strong shadow-none focus:ring-2 focus:ring-brand/15 sm:w-[220px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent className="overflow-hidden rounded-[20px] border border-border bg-white p-1 shadow-xl">
            {productSortOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="cursor-pointer rounded-xl px-3 py-2.5 text-sm text-text-strong focus:bg-background-soft focus:text-brand"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-3 lg:hidden">
        <ProductsMobileFilters />

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="button-text inline-flex h-11 items-center justify-center gap-2 rounded-button border border-border bg-white px-5 text-text-strong transition hover:border-brand hover:text-brand"
          >
            <X size={16} />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

interface SearchFormProps {
  initialSearch: string;
  onSearch: (value?: string) => void;
  onClearSearch: () => void;
}

function SearchForm({
  initialSearch,
  onSearch,
  onClearSearch,
}: SearchFormProps) {
  const [searchValue, setSearchValue] = useState(initialSearch);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = searchValue.trim();
    onSearch(trimmed || undefined);
  };

  return (
    <form onSubmit={handleSearchSubmit} className="relative min-w-0">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
      />

      <input
        type="search"
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        placeholder="Search by product or brand"
        className="h-12 w-full rounded-button border border-border bg-background-soft pl-11 pr-11 text-sm outline-none transition placeholder:text-text-muted focus:border-brand focus:bg-white"
      />

      {searchValue && (
        <button
          type="button"
          onClick={onClearSearch}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-brand"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}
