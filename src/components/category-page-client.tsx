"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ProductGrid } from "@/components/product-grid";
import type { Category, Product } from "@/lib/types";

interface CategoryPayload {
  data?: { category?: Category; products?: Product[] };
}

export function CategoryPageClient({ slug }: { slug: string }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [sort, setSort] = useState("default");

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/catalog/categories/${encodeURIComponent(slug)}`, { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json() as CategoryPayload;
        if (!response.ok || !payload.data?.category) throw new Error("Category not found");
        return payload;
      })
      .then((payload) => {
        if (!active || !payload.data) return;
        setCategory(payload.data.category ?? null);
        setProducts(Array.isArray(payload.data.products) ? payload.data.products : []);
        setNotFound(false);
      })
      .catch(() => { if (active) { setCategory(null); setProducts([]); setNotFound(true); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sort === "low-high") list.sort((a, b) => a.price - b.price);
    if (sort === "high-low") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, sort]);

  if (notFound) {
    return <main className="container route-main"><div className="not-found-card"><span className="not-found-code">৪০৪</span><span className="not-found-emoji">🧺</span><h1>ক্যাটাগরিটি খুঁজে পাওয়া যায়নি</h1><p>এই নামে কোনো ক্যাটাগরি নেই, অথবা এটি সরিয়ে ফেলা হয়েছে।</p><Link href="/" className="button button-primary button-large">হোম পেজে ফিরে যান ↗</Link></div></main>;
  }

  return (
    <main className="container route-main category-page">
      <div className="breadcrumbs"><Link href="/">হোম</Link><span>/</span><span>{category?.name ?? "ক্যাটাগরি"}</span></div>
      <section className="category-hero">
        <div className="category-icon-large">{category?.emoji ?? "🛒"}</div>
        <div className="category-title-wrap"><p className="section-eyebrow">ক্যাটাগরি অনুযায়ী বাজারদর</p><h1>{category?.name ?? "পণ্য ক্যাটাগরি"}</h1><p>{category?.description || "এই ক্যাটাগরির পণ্যগুলোর আজকের দাম ও দামের পরিবর্তন এক জায়গায় দেখুন।"}</p></div>
        <div className="category-product-count"><strong>{loading ? "…" : new Intl.NumberFormat("bn-BD").format(products.length)}</strong><span>টি পণ্য</span></div>
      </section>
      <div className="list-toolbar"><div><h2>এই ক্যাটাগরির পণ্য</h2><p>দাম তুলনা করে আপনার প্রয়োজনীয় পণ্যটি বেছে নিন।</p></div><label className="sort-select-wrap"><span>সাজান:</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="পণ্যের দাম অনুযায়ী সাজান"><option value="default">ডিফল্ট</option><option value="low-high">দাম: কম থেকে বেশি</option><option value="high-low">দাম: বেশি থেকে কম</option></select><span className="sort-chevron">⌄</span></label></div>
      {!loading && products.some((product) => product.isSampleData) ? <div className="api-warning"><span>ⓘ</span> লাইভ API পাওয়া যায়নি। নিচে নমুনা দাম দেখানো হচ্ছে।</div> : null}
      <ProductGrid products={sortedProducts} loading={loading} skeletonCount={6} />
    </main>
  );
}
