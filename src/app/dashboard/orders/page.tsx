import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  PackageCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Orders | FitLoop",
  description: "Review your FitLoop marketplace orders.",
};

type DashboardOrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "completed"
  | "cancelled";

interface DashboardOrderItem {
  id: string;
  product_title: string;
  product_brand: string;
  product_image: string | null;
  product_size: string | null;
  product_condition: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
}

interface DashboardOrder {
  id: string;
  created_at: string;
  status: DashboardOrderStatus;
  payment_status: string;
  delivery_method: string;
  subtotal_amount: number;
  shipping_amount: number;
  total_amount: number;
  first_name: string;
  last_name: string;
  customer_email: string;
  city: string;
  country: string;
  order_items: DashboardOrderItem[];
}

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

export default async function DashboardOrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/dashboard/orders");
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        created_at,
        status,
        payment_status,
        delivery_method,
        subtotal_amount,
        shipping_amount,
        total_amount,
        first_name,
        last_name,
        customer_email,
        city,
        country,
        order_items (
          id,
          product_title,
          product_brand,
          product_image,
          product_size,
          product_condition,
          unit_price,
          quantity,
          total_price
        )
      `,
    )
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const typedOrders = (orders ?? []) as unknown as DashboardOrder[];
  const hasOrders = typedOrders.length > 0;

  const completedOrders = typedOrders.filter(
    (order) => order.status === "completed",
  ).length;

  const activeOrders = typedOrders.filter((order) =>
    ["pending", "paid", "shipped"].includes(order.status),
  ).length;

  const totalOrderValue = typedOrders
    .filter((order) => order.status !== "cancelled")
    .reduce((total, order) => total + Number(order.total_amount), 0);

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-border bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="overline mb-3 text-brand">Buyer dashboard</p>

            <h1 className="heading-1 text-text-strong">Orders</h1>

            <p className="body-2 mt-3 max-w-2xl text-text-muted">
              Track your checkout activity, delivery methods, and order history.
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
          value={`€${formatMoney(totalOrderValue)}`}
          description="Total value of non-cancelled orders"
        />
      </section>

      <section className="rounded-card border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="heading-3 text-text-strong">Recent orders</h2>
            <p className="body-2 mt-2 text-text-muted">
              These orders are loaded from Supabase and connected to your
              authenticated user account.
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
            {typedOrders.map((order) => (
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
  order: DashboardOrder;
}

function OrderCard({ order }: OrderCardProps) {
  const orderReference = order.id.slice(0, 8).toUpperCase();
  const buyerName = `${order.first_name} ${order.last_name}`;
  const itemsCount = order.order_items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <article className="rounded-[24px] border border-border bg-white p-4 transition hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
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
              {formatDate(order.created_at)}
            </span>
          </div>

          <h3 className="subtitle-1 mt-3 text-text-strong">
            Order #{orderReference}
          </h3>

          <p className="body-2 mt-1 text-text-muted">
            Buyer:{" "}
            <span className="font-medium text-text-primary">{buyerName}</span>
          </p>

          <p className="caption mt-1 text-text-muted">
            {order.city}, {order.country} · {order.customer_email}
          </p>

          <div className="mt-4 space-y-2">
            {order.order_items.map((item) => (
              <div key={item.id} className="caption text-text-muted">
                · {item.product_title}{" "}
                <span className="text-text-primary">× {item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:items-end">
          <div className="text-left lg:text-right">
            <p className="caption text-text-muted">Total</p>
            <p className="text-[24px] font-bold leading-8 text-text-strong">
              €{formatMoney(Number(order.total_amount))}
            </p>

            <p className="caption mt-1 text-text-muted">
              Shipping €{formatMoney(Number(order.shipping_amount))}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-text-muted lg:justify-end">
            <span className="caption inline-flex items-center gap-1.5">
              <PackageCheck size={14} />
              {itemsCount} {itemsCount === 1 ? "item" : "items"}
            </span>

            <span className="caption inline-flex items-center gap-1.5">
              <Truck size={14} />
              {formatDeliveryMethod(order.delivery_method)}
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
        Orders will appear here after you complete checkout.
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

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDeliveryMethod(method: string) {
  return method
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
