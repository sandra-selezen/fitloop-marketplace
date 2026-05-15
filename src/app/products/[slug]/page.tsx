import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  MapPin,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/server";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";

interface ProductDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface ProductImage {
  url: string;
  position: number;
}

interface ProductProfile {
  full_name: string | null;
  username: string | null;
  location: string | null;
}

interface ProductDetails {
  id: string;
  title: string;
  slug: string;
  description: string;
  brand: string;
  price: number;
  category: string;
  product_type: string;
  condition: string;
  size: string;
  color: string;
  gender: string;
  location: string;
  created_at: string;
  seller_id: string;
  profiles: ProductProfile | ProductProfile[] | null;
  product_images: ProductImage[];
}

export async function generateMetadata({
  params,
}: ProductDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("title, description")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!product) {
    return {
      title: "Product not found | FitLoop",
    };
  }

  return {
    title: `${product.title} | FitLoop`,
    description: product.description,
  };
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
        id,
        title,
        slug,
        description,
        brand,
        price,
        category,
        product_type,
        condition,
        size,
        color,
        gender,
        location,
        created_at,
        seller_id,
        profiles (
          full_name,
          username,
          location
        ),
        product_images (
          url,
          position
        )
      `,
    )
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (error || !product) {
    notFound();
  }

  const typedProduct = product as unknown as ProductDetails;

  const sortedImages = [...(typedProduct.product_images ?? [])].sort(
    (a, b) => a.position - b.position,
  );

  const mainImageUrl = sortedImages[0]?.url;

  const sellerProfile = Array.isArray(typedProduct.profiles)
    ? typedProduct.profiles[0]
    : typedProduct.profiles;

  const sellerName =
    sellerProfile?.full_name || sellerProfile?.username || "FitLoop seller";

  return (
    <div className="bg-background-soft">
      <section className="border-b border-border bg-white py-5">
        <Container>
          <Link
            href="/products"
            className="button-text inline-flex items-center gap-2 text-text-muted transition hover:text-brand"
          >
            <ArrowLeft size={17} />
            Back to products
          </Link>
        </Container>
      </section>

      <section className="py-8 lg:py-12">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-white">
                {mainImageUrl ? (
                  <Image
                    src={mainImageUrl}
                    alt={typedProduct.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center">
                    <p className="body-2 text-text-muted">No image available</p>
                  </div>
                )}

                <span className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-text-strong shadow-sm">
                  {formatProductType(typedProduct.product_type)}
                </span>
              </div>

              {sortedImages.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {sortedImages.slice(0, 3).map((image, index) => (
                    <div
                      key={`${image.url}-${index}`}
                      className="relative aspect-square overflow-hidden rounded-[20px] bg-white"
                    >
                      <Image
                        src={image.url}
                        alt={`${typedProduct.title} image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 33vw, 16vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="h-fit rounded-[32px] border border-border bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-28">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-background-soft px-3 py-1 text-xs font-medium text-text-primary">
                  {formatCategory(typedProduct.category)}
                </span>

                <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                  {formatCondition(typedProduct.condition)}
                </span>
              </div>

              <div className="mt-5">
                <p className="subtitle-2 text-text-muted">
                  {typedProduct.brand}
                </p>

                <h1 className="heading-1 mt-2 text-text-strong">
                  {typedProduct.title}
                </h1>

                <p className="mt-4 text-[32px] font-bold leading-[40px] text-text-black">
                  €{Number(typedProduct.price)}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <ProductInfo label="Size" value={typedProduct.size} />
                <ProductInfo label="Color" value={typedProduct.color} />
                <ProductInfo
                  label="Type"
                  value={formatProductType(typedProduct.product_type)}
                />
                <ProductInfo
                  label="Condition"
                  value={formatCondition(typedProduct.condition)}
                />
              </div>

              <div className="mt-6 flex items-center gap-2 text-text-muted">
                <MapPin size={18} />
                <span className="body-2">{typedProduct.location}</span>
              </div>

              <div className="mt-6 border-t border-border pt-6">
                <h2 className="subtitle-1 text-text-strong">Description</h2>

                <p className="body-2 mt-3 text-text-muted">
                  {typedProduct.description}
                </p>
              </div>

              <div className="mt-6 rounded-[24px] bg-background-soft p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="caption text-text-muted">Seller</p>

                    <h3 className="subtitle-1 mt-1 text-text-strong">
                      {sellerName}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-text-muted">
                      <span className="caption inline-flex items-center gap-1">
                        <Star size={14} className="fill-brand text-brand" />
                        New seller
                      </span>

                      <span className="caption">
                        Joined {formatDate(typedProduct.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex size-11 items-center justify-center rounded-full bg-white text-brand">
                    {sellerName.charAt(0)}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
                <AddToCartButton
                  product={{
                    id: typedProduct.id,
                    slug: typedProduct.slug,
                    title: typedProduct.title,
                    brand: typedProduct.brand,
                    price: Number(typedProduct.price),
                    image: mainImageUrl ?? "",
                    size: typedProduct.size,
                    condition: formatCondition(typedProduct.condition),
                  }}
                />

                <button
                  type="button"
                  className="button-text inline-flex h-12 items-center justify-center gap-2 rounded-button border border-border bg-white px-6 text-text-strong transition hover:border-brand hover:text-brand"
                >
                  <Heart size={18} />
                  Save
                </button>
              </div>

              <div className="mt-6 grid gap-3 border-t border-border pt-6">
                <TrustItem
                  icon={<ShieldCheck size={18} />}
                  title="Buyer protection"
                  description="Secure checkout flow and protected marketplace experience."
                />

                <TrustItem
                  icon={<Truck size={18} />}
                  title="Flexible delivery"
                  description="Delivery options can be confirmed with the seller."
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

interface ProductInfoProps {
  label: string;
  value?: string;
}

function ProductInfo({ label, value }: ProductInfoProps) {
  return (
    <div className="rounded-[20px] border border-border bg-white p-4">
      <p className="caption text-text-muted">{label}</p>
      <p className="subtitle-2 mt-1 text-text-strong">{value || "—"}</p>
    </div>
  );
}

interface TrustItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function TrustItem({ icon, title, description }: TrustItemProps) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-background-soft text-brand">
        {icon}
      </div>

      <div>
        <h3 className="subtitle-2 text-text-strong">{title}</h3>
        <p className="caption mt-1 text-text-muted">{description}</p>
      </div>
    </div>
  );
}

function formatCondition(condition: string) {
  return condition
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatCategory(category: string) {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatProductType(productType: string) {
  return productType === "pre_owned" ? "Pre-owned" : "New";
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
