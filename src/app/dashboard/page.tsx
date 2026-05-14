import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, PackagePlus, ShoppingBag, Sparkles } from "lucide-react";

import { dashboardStats } from "@/constants/dashboard";

export const metadata: Metadata = {
  title: "Dashboard | FitLoop",
  description: "Manage your FitLoop listings, orders, and account.",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[32px] border border-border bg-white p-6 shadow-sm lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="overline mb-3 text-brand">Welcome back</p>

            <h1 className="heading-1 text-text-strong">
              Manage your FitLoop activity
            </h1>

            <p className="body-1 mt-4 max-w-2xl text-text-muted">
              Track your listings, review orders, and continue building your
              activewear marketplace presence.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sell"
                className="button-text inline-flex h-12 items-center justify-center gap-2 rounded-button bg-brand px-6 text-white transition hover:bg-brand-dark"
              >
                <PackagePlus size={18} />
                Create listing
              </Link>

              <Link
                href="/products"
                className="button-text inline-flex h-12 items-center justify-center gap-2 rounded-button border border-border bg-white px-6 text-text-strong transition hover:border-brand hover:text-brand"
              >
                <ShoppingBag size={18} />
                Browse products
              </Link>
            </div>
          </div>

          <div className="hidden size-28 items-center justify-center rounded-full bg-brand/10 text-brand lg:flex">
            <Sparkles size={42} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-card border border-border bg-white p-5 shadow-sm"
          >
            <p className="caption text-text-muted">{stat.label}</p>

            <p className="mt-3 text-[32px] font-bold leading-[40px] text-text-strong">
              {stat.value}
            </p>

            <p className="caption mt-2 text-text-muted">{stat.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-card border border-border bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="overline mb-2 text-brand">Listings</p>
              <h2 className="heading-3 text-text-strong">Recent activity</h2>
            </div>

            <Link
              href="/dashboard/listings"
              className="button-text inline-flex items-center gap-1 text-brand transition hover:text-brand-dark"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="space-y-3">
            <ActivityItem
              title="Nike Dri-FIT Training Hoodie"
              meta="Active listing · €68"
              status="Active"
            />
            <ActivityItem
              title="Adidas Ultraboost Running Shoes"
              meta="Draft listing · Missing photos"
              status="Draft"
            />
            <ActivityItem
              title="The North Face Wind Jacket"
              meta="Sold item · €95"
              status="Sold"
            />
          </div>
        </div>

        <div className="rounded-card border border-border bg-white p-5 shadow-sm sm:p-6">
          <p className="overline mb-2 text-brand">Next steps</p>
          <h2 className="heading-3 text-text-strong">Improve your shop</h2>

          <div className="mt-5 space-y-4">
            <ChecklistItem label="Add clear photos to every listing" />
            <ChecklistItem label="Keep product condition accurate" />
            <ChecklistItem label="Respond quickly to buyer activity" />
          </div>
        </div>
      </section>
    </div>
  );
}

interface ActivityItemProps {
  title: string;
  meta: string;
  status: "Active" | "Draft" | "Sold";
}

function ActivityItem({ title, meta, status }: ActivityItemProps) {
  const statusClassName = {
    Active: "bg-accent-mint/15 text-accent-mint",
    Draft: "bg-accent-peach/20 text-[#b85f1f]",
    Sold: "bg-brand/10 text-brand",
  }[status];

  return (
    <div className="flex items-center justify-between gap-4 rounded-[20px] border border-border bg-white p-4">
      <div>
        <h3 className="subtitle-2 text-text-strong">{title}</h3>
        <p className="caption mt-1 text-text-muted">{meta}</p>
      </div>

      <span
        className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${statusClassName}`}
      >
        {status}
      </span>
    </div>
  );
}

interface ChecklistItemProps {
  label: string;
}

function ChecklistItem({ label }: ChecklistItemProps) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 size-2 shrink-0 rounded-full bg-brand" />
      <p className="body-2 text-text-primary">{label}</p>
    </div>
  );
}
