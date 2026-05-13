import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  MapPin,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";

import { mockProducts } from "@/constants/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Container } from "@/components/layout/Container";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";

interface ProductDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params;

  const product = mockProducts.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  const relatedProducts = mockProducts
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

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
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                <span className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-text-strong shadow-sm">
                  {product.productType}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {product.images.slice(0, 3).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative aspect-square overflow-hidden rounded-[20px] bg-white"
                  >
                    <Image
                      src={image}
                      alt={`${product.title} image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 33vw, 16vw"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="h-fit rounded-[32px] border border-border bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-28">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-background-soft px-3 py-1 text-xs font-medium text-text-primary">
                  {product.category}
                </span>

                <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                  {product.condition}
                </span>
              </div>

              <div className="mt-5">
                <p className="subtitle-2 text-text-muted">{product.brand}</p>

                <h1 className="heading-1 mt-2 text-text-strong">
                  {product.title}
                </h1>

                <p className="mt-4 text-[32px] font-bold leading-[40px] text-text-black">
                  €{product.price}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <ProductInfo label="Size" value={product.size} />
                <ProductInfo label="Color" value={product.color} />
                <ProductInfo label="Type" value={product.productType} />
                <ProductInfo label="Condition" value={product.condition} />
              </div>

              <div className="mt-6 flex items-center gap-2 text-text-muted">
                <MapPin size={18} />
                <span className="body-2">{product.location}</span>
              </div>

              <div className="mt-6 border-t border-border pt-6">
                <h2 className="subtitle-1 text-text-strong">Description</h2>

                <p className="body-2 mt-3 text-text-muted">
                  {product.description}
                </p>
              </div>

              <div className="mt-6 rounded-[24px] bg-background-soft p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="caption text-text-muted">Seller</p>

                    <h3 className="subtitle-1 mt-1 text-text-strong">
                      {product.seller.name}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-text-muted">
                      <span className="caption inline-flex items-center gap-1">
                        <Star size={14} className="fill-brand text-brand" />
                        {product.seller.rating}
                      </span>

                      <span className="caption">
                        {product.seller.listingsCount} listings
                      </span>
                    </div>
                  </div>

                  <div className="flex size-11 items-center justify-center rounded-full bg-white text-brand">
                    {product.seller.name.charAt(0)}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
                <AddToCartButton
                  product={{
                    id: product.id,
                    title: product.title,
                    brand: product.brand,
                    price: product.price,
                    image: product.image,
                    size: product.size,
                    condition: product.condition,
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

      <section className="bg-white py-12 lg:py-16">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="overline mb-2 text-brand">You may also like</p>
              <h2 className="heading-2 text-text-strong">Related products</h2>
            </div>

            <Link
              href="/products"
              className="button-text text-brand transition hover:text-brand-dark"
            >
              View all
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
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
