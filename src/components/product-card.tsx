import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatBanglaNumber } from "@/lib/format";

export function ChangeBadge({ product }: { product: Product }) {
  const value = formatBanglaNumber(Math.abs(product.changePercent), 1);
  const label = product.direction === "up" ? `▲ ${value}%` : product.direction === "down" ? `▼ ${value}%` : "— ০.০%";
  return <span className={`change-badge ${product.direction}`}>{label}</span>;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${encodeURIComponent(product.slug)}`} className="product-card">
      <div className="product-card-top">
        <div className="product-emoji-tile" aria-hidden="true">{product.emoji}</div>
        <span className="product-category-chip">{product.category}</span>
      </div>
      <div className="product-card-info">
        <h3>{product.name}</h3>
        <p className="product-unit">{product.unit}</p>
      </div>
      <div className="product-price-footer">
        <div>
          <span className="price-caption">আজকের দাম</span>
          <p className="product-price">{formatBanglaNumber(product.price, 2)} <span>টাকা</span></p>
        </div>
        <ChangeBadge product={product} />
      </div>
      <span className="card-arrow" aria-hidden="true">↗</span>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="product-card skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-emoji" />
      <div className="skeleton skeleton-line skeleton-line-short" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line skeleton-line-medium" />
      <div className="skeleton skeleton-price" />
    </div>
  );
}
