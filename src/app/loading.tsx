import { ProductGrid } from "@/components/product-grid";

export default function Loading() {
  return <main className="container route-main"><div className="loading-heading"><span className="skeleton skeleton-line skeleton-line-short" /><span className="skeleton skeleton-line" /></div><ProductGrid products={[]} loading skeletonCount={8} /></main>;
}
