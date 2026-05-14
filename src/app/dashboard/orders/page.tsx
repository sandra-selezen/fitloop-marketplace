import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  PackageCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import {
  dashboardOrders,
  type DashboardOrderStatus,
} from "@/features/dashboard/dashboard-orders";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Orders | FitLoop",
  description: "Review your FitLoop marketplace orders.",
};

const statusLabels: Record<DashboardOrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusStyles: Record<DashboardOrderStatus, string> = {
  pending: "bg-accent-peach/20 text-[#b85f1f]",
  paid: "bg-accent-blue/15 text-[#2677ad]",
  shipped: "bg-brand/10 text-brand",
  completed: "bg-accent-mint/15 text-[#16876f]",
  cancelled: "bg-background-soft text-text-muted",
};

export default function DashboardOrdersPage() {
  const hasOrders = dashboardOrders.length > 0;

  const completedOrders = dashboardOrders.filter(
    (order) => order.status === "completed",
  ).length;

  const activeOrders = dashboardOrders.filter((order) =>
    ["pending", "paid", "shipped"].includes(order.status),
  ).length;

  const totalRevenue = dashboardOrders
    .filter((order) => order.status !== "cancelled")
    .reduce((total, order) => total + order.total, 0);

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-border bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="overline mb-3 text-brand">Seller dashboard</p>

            <h1 className="heading-1 text-text-strong">Orders</h1>

            <p className="body-2 mt-3 max-w-2xl text-text-muted">
              Track buyer orders, payment states, delivery methods, and recent
              marketplace activity.
            </p>
          </div>

          <Link
            href="/products"
            className="button-text inline-flex h-12 w-fit items-center justify-center gap-2 rounded-button border border-border bg-white px-6 text-text-strong transition hover:border-brand hover:text-brand"
          >
            <ShoppingBag size={18} />
            Browse products
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <OrderStatCard
          icon={<ClipboardList size={20} />}
          label="Active orders"
          value={String(activeOrders)}
          description="Pending, paid, or shipped orders"
        />

        <OrderStatCard
          icon={<PackageCheck size={20} />}
          label="Completed"
          value={String(completedOrders)}
          description="Orders successfully completed"
        />

        <OrderStatCard
          icon={<ShoppingBag size={20} />}
          label="Order value"
          value={`€${totalRevenue}`}
          description="Mock revenue from non-cancelled orders"
        />
      </section>

      <section className="rounded-card border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="heading-3 text-text-strong">Recent orders</h2>
            <p className="body-2 mt-2 text-text-muted">
              These are mock orders for now. Later, they’ll come from the
              Supabase orders table and be connected to checkout.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <StatusFilter label="All" active />
            <StatusFilter label="Paid" />
            <StatusFilter label="Shipped" />
            <StatusFilter label="Completed" />
          </div>
        </div>

        {hasOrders ? (
          <div className="space-y-4">
            {dashboardOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <EmptyOrders />
        )}
      </section>
    </div>
  );
}

interface OrderStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}

function OrderStatCard({
  icon,
  label,
  value,
  description,
}: OrderStatCardProps) {
  return (
    <article className="rounded-card border border-border bg-white p-5 shadow-sm">
      <div className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-brand">
        {icon}
      </div>

      <p className="caption mt-4 text-text-muted">{label}</p>

      <p className="mt-2 text-[32px] font-bold leading-[40px] text-text-strong">
        {value}
      </p>

      <p className="caption mt-2 text-text-muted">{description}</p>
    </article>
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

interface OrderCardProps {
  order: (typeof dashboardOrders)[number];
}

function OrderCard({ order }: OrderCardProps) {
  return (
    <article className="rounded-[24px] border border-border bg-white p-4 transition hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-semibold",
                statusStyles[order.status],
              )}
            >
              {statusLabels[order.status]}
            </span>

            <span className="caption inline-flex items-center gap-1.5 text-text-muted">
              <CalendarDays size={14} />
              {formatDate(order.date)}
            </span>
          </div>

          <h3 className="subtitle-1 mt-3 text-text-strong">
            Order #{order.id}
          </h3>

          <p className="body-2 mt-1 text-text-muted">
            Buyer:{" "}
            <span className="font-medium text-text-primary">
              {order.customerName}
            </span>
          </p>

          <div className="mt-4 space-y-2">
            {order.items.map((item) => (
              <p key={item} className="caption text-text-muted">
                · {item}
              </p>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:items-end">
          <div className="text-left lg:text-right">
            <p className="caption text-text-muted">Total</p>
            <p className="text-[24px] font-bold leading-8 text-text-strong">
              €{order.total}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-text-muted">
            <span className="caption inline-flex items-center gap-1.5">
              <PackageCheck size={14} />
              {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
            </span>

            <span className="caption inline-flex items-center gap-1.5">
              <Truck size={14} />
              {order.deliveryMethod}
            </span>
          </div>

          <Link
            href={`/dashboard/orders/${order.id}`}
            className="button-text inline-flex h-10 w-fit items-center justify-center gap-1 rounded-button border border-border bg-white px-4 text-text-strong transition hover:border-brand hover:text-brand"
          >
            View details
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function EmptyOrders() {
  return (
    <div className="flex flex-col items-center rounded-[24px] border border-dashed border-border bg-background-soft px-6 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-white text-brand shadow-sm">
        <ClipboardList size={24} />
      </div>

      <h3 className="heading-3 mt-5 text-text-strong">No orders yet</h3>

      <p className="body-2 mt-2 max-w-md text-text-muted">
        Orders will appear here after buyers complete checkout.
      </p>

      <Link
        href="/products"
        className="button-text mt-6 inline-flex h-12 items-center justify-center rounded-button bg-brand px-6 text-white transition hover:bg-brand-dark"
      >
        Browse products
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
