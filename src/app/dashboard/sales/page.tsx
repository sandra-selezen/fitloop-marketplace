import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  PackageCheck,
  ShoppingBag,
  TrendingUp,
  UserRound,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sales | FitLoop",
  description: "Review products sold through your FitLoop listings.",
};

type SaleOrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "completed"
  | "cancelled";

interface SaleItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_title: string;
  product_brand: string;
  product_image: string | null;
  product_size: string | null;
  product_condition: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
  created_at: string;
  orders: {
    id: string;
    created_at: string;
    status: SaleOrderStatus;
    first_name: string;
    last_name: string;
    city: string;
    country: string;
  } | null;
}

const statusLabels: Record<SaleOrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusStyles: Record<SaleOrderStatus, string> = {
  pending: "bg-accent-peach/20 text-[#b85f1f]",
  paid: "bg-accent-blue/15 text-[#2677ad]",
  shipped: "bg-brand/10 text-brand",
  completed: "bg-accent-mint/15 text-[#16876f]",
  cancelled: "bg-background-soft text-text-muted",
};

export default async function DashboardSalesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/dashboard/sales");
  }

  const { data: sales, error } = await supabase
    .from("order_items")
    .select(
      `
        id,
        order_id,
        product_id,
        product_title,
        product_brand,
        product_image,
        product_size,
        product_condition,
        unit_price,
        quantity,
        total_price,
        created_at,
        orders (
          id,
          created_at,
          status,
          first_name,
          last_name,
          city,
          country
        )
      `,
    )
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const typedSales = (sales ?? []) as unknown as SaleItem[];

  const hasSales = typedSales.length > 0;

  const totalRevenue = typedSales
    .filter((sale) => sale.orders?.status !== "cancelled")
    .reduce((total, sale) => total + Number(sale.total_price), 0);

  const totalItemsSold = typedSales
    .filter((sale) => sale.orders?.status !== "cancelled")
    .reduce((total, sale) => total + sale.quantity, 0);

  const activeSales = typedSales.filter((sale) =>
    ["pending", "paid", "shipped"].includes(sale.orders?.status ?? ""),
  ).length;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-border bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="overline mb-3 text-brand">Seller dashboard</p>

            <h1 className="heading-1 text-text-strong">Sales</h1>

            <p className="body-2 mt-3 max-w-2xl text-text-muted">
              Track products purchased from your listings and review basic sales
              activity.
            </p>
          </div>

          <Link
            href="/dashboard/listings"
            className="button-text inline-flex h-12 w-fit items-center justify-center gap-2 rounded-button border border-border bg-white px-6 text-text-strong transition hover:border-brand hover:text-brand"
          >
            <ShoppingBag size={18} />
            My listings
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <SalesStatCard
          icon={<TrendingUp size={20} />}
          label="Revenue"
          value={`€${formatMoney(totalRevenue)}`}
          description="Total value from non-cancelled sales"
        />

        <SalesStatCard
          icon={<PackageCheck size={20} />}
          label="Items sold"
          value={String(totalItemsSold)}
          description="Total sold quantity"
        />

        <SalesStatCard
          icon={<ShoppingBag size={20} />}
          label="Active sales"
          value={String(activeSales)}
          description="Pending, paid, or shipped sales"
        />
      </section>

      <section className="rounded-card border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="heading-3 text-text-strong">Recent sales</h2>
          <p className="body-2 mt-2 text-text-muted">
            These sales are loaded from Supabase order items where you are the
            seller.
          </p>
        </div>

        {hasSales ? (
          <div className="space-y-4">
            {typedSales.map((sale) => (
              <SaleCard key={sale.id} sale={sale} />
            ))}
          </div>
        ) : (
          <EmptySales />
        )}
      </section>
    </div>
  );
}

interface SalesStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}

function SalesStatCard({
  icon,
  label,
  value,
  description,
}: SalesStatCardProps) {
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

interface SaleCardProps {
  sale: SaleItem;
}

function SaleCard({ sale }: SaleCardProps) {
  const orderStatus = sale.orders?.status ?? "paid";
  const orderReference = sale.order_id.slice(0, 8).toUpperCase();

  const buyerName = sale.orders
    ? `${sale.orders.first_name} ${sale.orders.last_name}`
    : "Buyer";

  return (
    <article className="grid gap-4 rounded-[24px] border border-border bg-white p-4 transition hover:shadow-md lg:grid-cols-[96px_1fr_auto] lg:items-center">
      <div className="relative aspect-square overflow-hidden rounded-[20px] bg-background-soft">
        {sale.product_image ? (
          <Image
            src={sale.product_image}
            alt={sale.product_title}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center">
            <p className="text-[10px] text-text-muted">No image</p>
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-[11px] font-semibold",
              statusStyles[orderStatus],
            )}
          >
            {statusLabels[orderStatus]}
          </span>

          <span className="caption inline-flex items-center gap-1.5 text-text-muted">
            <CalendarDays size={14} />
            {formatDate(sale.orders?.created_at ?? sale.created_at)}
          </span>
        </div>

        <p className="caption text-text-muted">{sale.product_brand}</p>

        <h3 className="subtitle-1 mt-1 line-clamp-1 text-text-strong">
          {sale.product_title}
        </h3>

        <p className="caption mt-2 text-text-muted">
          {sale.product_condition || "Condition"} · Size{" "}
          {sale.product_size || "—"} · Qty {sale.quantity}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-text-muted">
          <span className="caption inline-flex items-center gap-1.5">
            <UserRound size={14} />
            Buyer: {buyerName}
          </span>

          <span className="caption">Order #{orderReference}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end">
        <div className="text-left lg:text-right">
          <p className="caption text-text-muted">Sale total</p>
          <p className="text-[24px] font-bold leading-8 text-text-strong">
            €{formatMoney(Number(sale.total_price))}
          </p>
          <p className="caption mt-1 text-text-muted">
            €{formatMoney(Number(sale.unit_price))} each
          </p>
        </div>

        <Link
          href={`/dashboard/sales/${sale.order_id}`}
          className="button-text inline-flex h-10 w-fit items-center justify-center rounded-button border border-border bg-white px-4 text-text-strong transition hover:border-brand hover:text-brand"
        >
          View sale
        </Link>
      </div>
    </article>
  );
}

function EmptySales() {
  return (
    <div className="flex flex-col items-center rounded-[24px] border border-dashed border-border bg-background-soft px-6 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-white text-brand shadow-sm">
        <TrendingUp size={24} />
      </div>

      <h3 className="heading-3 mt-5 text-text-strong">No sales yet</h3>

      <p className="body-2 mt-2 max-w-md text-text-muted">
        Sales will appear here when buyers purchase products from your listings.
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

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}
