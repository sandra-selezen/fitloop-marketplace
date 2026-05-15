import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

interface SalesOrderDetailsPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

type OrderStatus = "pending" | "paid" | "shipped" | "completed" | "cancelled";

interface SaleOrderItem {
  id: string;
  product_id: string | null;
  seller_id: string | null;
  product_title: string;
  product_brand: string;
  product_image: string | null;
  product_size: string | null;
  product_condition: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
}

interface SaleOrderDetails {
  id: string;
  created_at: string;
  status: OrderStatus;
  payment_status: string;

  customer_email: string;
  customer_phone: string;

  first_name: string;
  last_name: string;
  country: string;
  city: string;
  address: string;
  postal_code: string;

  delivery_method: string;

  order_items: SaleOrderItem[];
}

export const metadata: Metadata = {
  title: "Sale details | FitLoop",
  description: "View sale details for your FitLoop listing.",
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-accent-peach/20 text-[#b85f1f]",
  paid: "bg-accent-blue/15 text-[#2677ad]",
  shipped: "bg-brand/10 text-brand",
  completed: "bg-accent-mint/15 text-[#16876f]",
  cancelled: "bg-background-soft text-text-muted",
};

export default async function SalesOrderDetailsPage({
  params,
}: SalesOrderDetailsPageProps) {
  const { orderId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?next=/dashboard/sales/${orderId}`);
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        created_at,
        status,
        payment_status,
        customer_email,
        customer_phone,
        first_name,
        last_name,
        country,
        city,
        address,
        postal_code,
        delivery_method,
        order_items (
          id,
          product_id,
          seller_id,
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
    .eq("id", orderId)
    .single();

  if (error || !order) {
    notFound();
  }

  const typedOrder = order as unknown as SaleOrderDetails;

  const sellerItems = typedOrder.order_items.filter(
    (item) => item.seller_id === user.id,
  );

  if (sellerItems.length === 0) {
    notFound();
  }

  const orderReference = typedOrder.id.slice(0, 8).toUpperCase();
  const buyerName = `${typedOrder.first_name} ${typedOrder.last_name}`;

  const sellerSubtotal = sellerItems.reduce(
    (total, item) => total + Number(item.total_price),
    0,
  );

  const itemsCount = sellerItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-border bg-white p-6 shadow-sm lg:p-8">
        <Link
          href="/dashboard/sales"
          className="button-text mb-5 inline-flex items-center gap-2 text-text-muted transition hover:text-brand"
        >
          <ArrowLeft size={17} />
          Back to sales
        </Link>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="overline mb-3 text-brand">Sale details</p>

            <h1 className="heading-1 text-text-strong">
              Sale from order #{orderReference}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-semibold",
                  statusStyles[typedOrder.status],
                )}
              >
                {statusLabels[typedOrder.status]}
              </span>

              <span className="caption inline-flex items-center gap-1.5 text-text-muted">
                <CalendarDays size={14} />
                {formatDate(typedOrder.created_at)}
              </span>

              <span className="caption inline-flex items-center gap-1.5 text-text-muted">
                <PackageCheck size={14} />
                {itemsCount} {itemsCount === 1 ? "item" : "items"} sold
              </span>
            </div>
          </div>

          <div className="rounded-[24px] bg-background-soft px-5 py-4 lg:text-right">
            <p className="caption text-text-muted">Your sale total</p>
            <p className="text-[28px] font-bold leading-[36px] text-text-strong">
              €{formatMoney(sellerSubtotal)}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-card border border-border bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="heading-3 text-text-strong">Sold items</h2>
              <p className="body-2 mt-2 text-text-muted">
                These are the products from this order that belong to your
                listings.
              </p>
            </div>

            <div className="space-y-4">
              {sellerItems.map((item) => (
                <SaleItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>

          <section className="rounded-card border border-border bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="heading-3 text-text-strong">Buyer information</h2>
              <p className="body-2 mt-2 text-text-muted">
                Contact and delivery information for this sale.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <InfoCard
                icon={<UserRound size={18} />}
                label="Buyer"
                value={buyerName}
              />

              <InfoCard
                icon={<Truck size={18} />}
                label="Delivery method"
                value={formatDeliveryMethod(typedOrder.delivery_method)}
              />

              <InfoCard
                icon={<Mail size={18} />}
                label="Email"
                value={typedOrder.customer_email}
              />

              <InfoCard
                icon={<Phone size={18} />}
                label="Phone"
                value={typedOrder.customer_phone}
              />

              <div className="lg:col-span-2">
                <InfoCard
                  icon={<MapPin size={18} />}
                  label="Delivery address"
                  value={`${typedOrder.address}, ${typedOrder.city}, ${typedOrder.postal_code}, ${typedOrder.country}`}
                />
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-card border border-border bg-white p-5 shadow-sm lg:sticky lg:top-28">
          <p className="overline mb-2 text-brand">Seller summary</p>
          <h2 className="heading-3 text-text-strong">Sale summary</h2>

          <div className="mt-5 space-y-4 border-b border-border pb-5">
            <SummaryRow label="Order" value={`#${orderReference}`} />
            <SummaryRow label="Buyer" value={buyerName} />
            <SummaryRow
              label="Status"
              value={statusLabels[typedOrder.status]}
            />
            <SummaryRow
              label="Payment"
              value={formatPaymentStatus(typedOrder.payment_status)}
            />
          </div>

          <div className="mt-5 space-y-3 border-b border-border pb-5">
            <SummaryRow label="Sold items" value={String(itemsCount)} />
            <SummaryRow
              label="Your subtotal"
              value={`€${formatMoney(sellerSubtotal)}`}
            />
          </div>

          <div className="flex items-center justify-between pt-5">
            <span className="subtitle-1 text-text-strong">Your total</span>
            <span className="text-[28px] font-bold leading-[36px] text-text-black">
              €{formatMoney(sellerSubtotal)}
            </span>
          </div>

          <div className="mt-6 rounded-[24px] bg-background-soft p-4">
            <div className="flex gap-3">
              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-brand">
                <ShoppingBag size={18} />
              </div>

              <div>
                <h3 className="subtitle-2 text-text-strong">
                  Seller-only view
                </h3>
                <p className="caption mt-1 text-text-muted">
                  This page only shows items from this order that belong to your
                  seller account.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

interface SaleItemCardProps {
  item: SaleOrderItem;
}

function SaleItemCard({ item }: SaleItemCardProps) {
  return (
    <article className="grid gap-4 rounded-[24px] border border-border bg-white p-4 sm:grid-cols-[88px_1fr_auto] sm:items-center">
      <div className="relative aspect-square overflow-hidden rounded-[18px] bg-background-soft">
        {item.product_image ? (
          <Image
            src={item.product_image}
            alt={item.product_title}
            fill
            className="object-cover"
            sizes="88px"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center">
            <p className="text-[10px] text-text-muted">No image</p>
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="caption text-text-muted">{item.product_brand}</p>

        <h3 className="subtitle-2 mt-1 line-clamp-2 text-text-strong">
          {item.product_title}
        </h3>

        <p className="caption mt-2 text-text-muted">
          {item.product_condition || "Condition"} · Size{" "}
          {item.product_size || "—"} · Qty {item.quantity}
        </p>
      </div>

      <div className="text-left sm:text-right">
        <p className="subtitle-2 text-text-strong">
          €{formatMoney(Number(item.total_price))}
        </p>

        <p className="caption mt-1 text-text-muted">
          €{formatMoney(Number(item.unit_price))} each
        </p>
      </div>
    </article>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <div className="min-w-0 rounded-[24px] border border-border bg-white p-4">
      <div className="flex gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background-soft text-brand">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="caption text-text-muted">{label}</p>
          <p className="body-2 mt-1 break-words text-text-strong">{value}</p>
        </div>
      </div>
    </div>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="body-2 text-text-muted">{label}</span>
      <span className="subtitle-2 text-right text-text-strong">{value}</span>
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

function formatPaymentStatus(status: string) {
  if (status === "demo_paid") {
    return "Demo paid";
  }

  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
