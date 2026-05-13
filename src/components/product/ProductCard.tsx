import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    brand: string;
    price: number;
    category: string;
    productType: string;
    condition: string;
    size: string;
    image: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-card border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-4/5 overflow-hidden bg-background-soft">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />

          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-text-primary shadow-sm">
            {product.productType}
          </span>
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="caption text-text-muted">{product.brand}</p>
            <Link href={`/products/${product.id}`}>
              <h3 className="subtitle-2 mt-1 line-clamp-2 text-text-strong transition hover:text-brand">
                {product.title}
              </h3>
            </Link>
          </div>

          <button
            type="button"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background-soft text-text-primary transition hover:bg-brand hover:text-white"
            aria-label="Add to favorites"
          >
            <Heart size={17} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="caption text-text-muted">
            {product.condition} · Size {product.size}
          </div>

          <p className="subtitle-2 text-text-strong">€{product.price}</p>
        </div>
      </div>
    </article>
  );
}
