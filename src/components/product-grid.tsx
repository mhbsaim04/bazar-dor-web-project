import type { Product } from "@/lib/types";
import { ProductCard, ProductCardSkeleton } from "@/components/product-card";

export function ProductGrid({ products, loading = false, skeletonCount = 8 }: { products: Product[]; loading?: boolean; skeletonCount?: number }) {
  if (loading) {
    return <div className="product-grid">{Array.from({ length: skeletonCount }).map((_, index) => <ProductCardSkeleton key={index} />)}</div>;
  }
  if (!products.length) {
    return <div className="empty-state">
      <span className="empty-state-emoji">🧺</span>
      <h3>এখানে কোনো পণ্য পাওয়া যায়নি</h3>
      <p>অন্য ক্যাটাগরি বেছে দেখুন অথবা সব পণ্য দেখুন।</p>
    </div>;
  }
  return <div className="product-grid">{products.map((product) => <ProductCard product={product} key={`${product.id}-${product.slug}`} />)}</div>;
}
