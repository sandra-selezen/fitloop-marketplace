import Image from "next/image";
import Link from "next/link";

interface ProductImage {
  url: string;
  position: number;
}

export interface ProductCardData {
  id: string;
  title: string;
  slug: string;
  brand: string;
  price: number;
  product_type: string;
  condition: string;
  size: string;
  product_images: ProductImage[];
}

interface ProductCardProps {
  product: ProductCardData;
}

export function ProductCard({ product }: ProductCardProps) {
  const sortedImages = [...(product.product_images ?? [])].sort(
    (a, b) => a.position - b.position,
  );

  const mainImageUrl = sortedImages[0]?.url;

  return (
    <article className="group overflow-hidden rounded-card border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-background-soft">
          {mainImageUrl ? (
            <Image
              src={mainImageUrl}
              alt={product.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center">
              <p className="caption text-text-muted">No image</p>
            </div>
          )}

          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-text-primary shadow-sm">
            {formatProductType(product.product_type)}
          </span>
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <div>
          <p className="caption text-text-muted">{product.brand}</p>

          <Link href={`/products/${product.slug}`}>
            <h3 className="subtitle-2 mt-1 line-clamp-2 text-text-strong transition hover:text-brand">
              {product.title}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="caption text-text-muted">
            {formatCondition(product.condition)} · Size {product.size}
          </div>

          <p className="subtitle-2 text-text-strong">
            €{Number(product.price)}
          </p>
        </div>
      </div>
    </article>
  );
}

function formatCondition(condition: string) {
  return condition
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatProductType(productType: string) {
  return productType === "pre_owned" ? "Pre-owned" : "New";
}
