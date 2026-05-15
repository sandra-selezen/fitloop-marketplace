import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Edit3, Eye, Heart, PackagePlus } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { ListingActions } from "@/features/dashboard/components/ListingActions";
import { DeleteListingDialog } from "@/features/dashboard/components/DeleteListingDialog";

export const metadata: Metadata = {
  title: "My listings | FitLoop",
  description: "Manage your FitLoop product listings.",
};

type DashboardListingStatus = "active" | "draft" | "sold" | "archived";

interface ProductImage {
  url: string;
  position: number;
}

interface DashboardListing {
  id: string;
  title: string;
  slug: string;
  brand: string;
  price: number;
  size: string;
  condition: string;
  status: DashboardListingStatus;
  created_at: string;
  product_images: ProductImage[];
}

const statusStyles: Record<DashboardListingStatus, string> = {
  active: "bg-accent-mint/15 text-[#16876f]",
  draft: "bg-accent-peach/20 text-[#b85f1f]",
  sold: "bg-brand/10 text-brand",
  archived: "bg-background-soft text-text-muted",
};

const statusLabels: Record<DashboardListingStatus, string> = {
  active: "Active",
  draft: "Draft",
  sold: "Sold",
  archived: "Archived",
};

export default async function DashboardListingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/dashboard/listings");
  }

  const { data: listings, error } = await supabase
    .from("products")
    .select(
      `
        id,
        title,
        slug,
        brand,
        price,
        size,
        condition,
        status,
        created_at,
        product_images (
          url,
          position
        )
      `,
    )
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const typedListings = (listings ?? []) as DashboardListing[];
  const hasListings = typedListings.length > 0;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-border bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="overline mb-3 text-brand">Seller dashboard</p>

            <h1 className="heading-1 text-text-strong">My listings</h1>

            <p className="body-2 mt-3 max-w-2xl text-text-muted">
              Manage your activewear listings, review drafts, and track basic
              marketplace activity.
            </p>
          </div>

          <Link
            href="/sell"
            className="button-text inline-flex h-12 w-fit items-center justify-center gap-2 rounded-button bg-brand px-6 text-white transition hover:bg-brand-dark"
          >
            <PackagePlus size={18} />
            Create listing
          </Link>
        </div>
      </section>

      <section className="rounded-card border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="heading-3 text-text-strong">Listings overview</h2>
            <p className="body-2 mt-2 text-text-muted">
              These listings are loaded from Supabase and connected to your
              authenticated user account.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <StatusFilter label="All" active />
            <StatusFilter label="Active" />
            <StatusFilter label="Draft" />
            <StatusFilter label="Sold" />
          </div>
        </div>

        {hasListings ? (
          <div className="space-y-4">
            {typedListings.map((listing) => (
              <ListingRow key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <EmptyListings />
        )}
      </section>
    </div>
  );
}

interface StatusFilterProps {
  label: string;
  active?: boolean;
}

function StatusFilter({ label, active }: StatusFilterProps) {
  return (
    <button
      type="button"
      className={cn(
        "button-text rounded-button border px-4 py-2 transition",
        active
          ? "border-brand bg-brand text-white"
          : "border-border bg-white text-text-primary hover:border-brand hover:text-brand",
      )}
    >
      {label}
    </button>
  );
}

interface ListingRowProps {
  listing: DashboardListing;
}

function ListingRow({ listing }: ListingRowProps) {
  const sortedImages = [...(listing.product_images ?? [])].sort(
    (a, b) => a.position - b.position,
  );

  const mainImageUrl = sortedImages[0]?.url;

  return (
    <article className="grid gap-4 rounded-[24px] border border-border bg-white p-4 transition hover:shadow-md lg:grid-cols-[120px_1fr_auto] lg:items-center">
      <Link
        href={`/products/${listing.slug}`}
        className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-background-soft lg:aspect-square"
      >
        {mainImageUrl ? (
          <Image
            src={mainImageUrl}
            alt={listing.title}
            fill
            className="object-cover transition duration-500 hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 120px"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center">
            <p className="caption text-text-muted">No image</p>
          </div>
        )}
      </Link>

      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-[11px] font-semibold",
              statusStyles[listing.status],
            )}
          >
            {statusLabels[listing.status]}
          </span>

          <span className="caption text-text-muted">
            Created {formatDate(listing.created_at)}
          </span>
        </div>

        <p className="caption text-text-muted">{listing.brand}</p>

        <Link href={`/products/${listing.slug}`}>
          <h3 className="subtitle-1 mt-1 line-clamp-1 text-text-strong transition hover:text-brand">
            {listing.title}
          </h3>
        </Link>

        <p className="caption mt-2 text-text-muted">
          {formatCondition(listing.condition)} · Size {listing.size}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-text-muted">
          <span className="caption inline-flex items-center gap-1.5">
            <Eye size={14} />0 views
          </span>

          <span className="caption inline-flex items-center gap-1.5">
            <Heart size={14} />0 saves
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end">
        <p className="text-[24px] font-bold leading-8 text-text-strong">
          €{Number(listing.price)}
        </p>

        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/listings/${listing.id}/edit`}
            className="button-text inline-flex h-10 items-center justify-center gap-2 rounded-button border border-border bg-white px-4 text-text-strong transition hover:border-brand hover:text-brand"
          >
            <Edit3 size={16} />
            Edit
          </Link>

          <ListingActions listingId={listing.id} status={listing.status} />

          <DeleteListingDialog
            listingId={listing.id}
            listingTitle={listing.title}
          />
        </div>
      </div>
    </article>
  );
}

function EmptyListings() {
  return (
    <div className="flex flex-col items-center rounded-[24px] border border-dashed border-border bg-background-soft px-6 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-white text-brand shadow-sm">
        <PackagePlus size={24} />
      </div>

      <h3 className="heading-3 mt-5 text-text-strong">No listings yet</h3>

      <p className="body-2 mt-2 max-w-md text-text-muted">
        Create your first activewear listing and it will appear here.
      </p>

      <Link
        href="/sell"
        className="button-text mt-6 inline-flex h-12 items-center justify-center rounded-button bg-brand px-6 text-white transition hover:bg-brand-dark"
      >
        Create listing
      </Link>
    </div>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatCondition(condition: string) {
  return condition
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
