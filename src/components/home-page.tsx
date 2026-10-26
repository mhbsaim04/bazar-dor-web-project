"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ProductGrid } from "@/components/product-grid";
import { formatBanglaNumber } from "@/lib/format";
import type { Product } from "@/lib/types";

function TrendingSection({ title, subtitle, products, direction }: { title: string; subtitle: string; products: Product[]; direction: "up" | "down" }) {
  return (
    <section className="section-block trending-section">
      <div className="section-heading-row">
        <div>
          <p className="section-eyebrow">আজকের বাজার</p>
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>
        <span className={`trend-heading-icon ${direction}`}>{direction === "up" ? "↗" : "↘"}</span>
      </div>
      {products.length ? <div className="product-grid trending-grid">{products.slice(0, 6).map((product) => (
        <Link href={`/product/${encodeURIComponent(product.slug)}`} className="trend-card" key={product.id}>
          <span className="trend-card-emoji">{product.emoji}</span>
          <span className="trend-card-copy"><strong>{product.name}</strong><small>{product.unit}</small><b>{formatBanglaNumber(product.price, 2)} টাকা</b></span>
          <span className={`change-badge ${product.direction}`}>{direction === "up" ? "▲" : "▼"} {formatBanglaNumber(Math.abs(product.changePercent), 1)}%</span>
        </Link>
      ))}</div> : <div className="inline-empty">এই মুহূর্তে উল্লেখযোগ্য কোনো পরিবর্তনের তথ্য নেই।</div>}
    </section>
  );
}

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/catalog/products", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Products request failed");
        return response.json() as Promise<{ data?: Product[] }>;
      })
      .then((payload) => {
        if (active) setProducts(Array.isArray(payload.data) ? payload.data : []);
      })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const risers = useMemo(() => [...products].filter((product) => product.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent), [products]);
  const fallers = useMemo(() => [...products].filter((product) => product.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent), [products]);

  return (
    <main>
      <section className="hero-section">
        <div className="container hero-inner">
          <div className="hero-copy">
            <div className="hero-eyebrow"><span className="eyebrow-sparkle">✳</span> বাংলাদেশের নিত্যপণ্যের ডিজিটাল বাজার</div>
            <h1>বাজারের সঠিক দর,<br /><span>আপনার হাতের নাগালে।</span></h1>
            <p className="hero-description">চাল, ডাল, তেল, মাছ কিংবা সবজি—প্রয়োজনীয় পণ্যের দাম জানুন এক জায়গায়। বাজারে যাওয়ার আগেই থাকুন আপডেট।</p>
            <div className="hero-actions">
              <a href="#সব-পণ্য" className="button button-primary button-large">সব পণ্যের দাম দেখুন <span aria-hidden="true">↓</span></a>
              <span className="hero-note"><span className="hero-note-icon">✓</span> সহজ • স্বচ্ছ • প্রতিদিনের তথ্য</span>
            </div>
            <div className="hero-stat-row">
              <div className="hero-stat"><strong>নিত্যদিন</strong><span>আপডেটেড বাজারদর</span></div>
              <span className="stat-divider" />
              <div className="hero-stat"><strong>এক নজরে</strong><span>দামের ওঠানামা</span></div>
              <span className="stat-divider" />
              <div className="hero-stat"><strong>সহজ তথ্য</strong><span>সবার জন্য</span></div>
            </div>
          </div>
          <div className="hero-art-column" aria-label="বাজারের পণ্যের ছবি যোগ করার স্থান">
            <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
            <div className="hero-art-card">
              <span className="hero-art-kicker">আজকের বাজার</span>
              <div className="hero-art-emoji-row"><span>🥬</span><span>🍅</span><span>🥔</span></div>
              <div className="hero-art-emoji-row hero-art-emoji-row-lower"><span>🍚</span><span>🧅</span><span>🥚</span></div>
              <div className="hero-art-caption"><span className="art-caption-dot" /><span>সাশ্রয়ী বাজারের তথ্য</span></div>
              <div className="hero-art-image-note">আপনার ব্যানার ইমেজ এখানে যোগ করুন</div>
            </div>
            <div className="floating-price-card floating-price-card-one"><span>🥔</span><div><small>আলু</small><strong>৩২ টাকা <em>▼ ২.৯%</em></strong></div></div>
            <div className="floating-price-card floating-price-card-two"><span>🍚</span><div><small>চাল</small><strong>৭৮ টাকা <em className="up-text">▲ ২.১%</em></strong></div></div>
            <span className="hero-decoration-dot dot-one" /><span className="hero-decoration-dot dot-two" />
          </div>
        </div>
        <div className="hero-bottom-strip"><div className="container hero-bottom-content"><span>✳ আজকের বাজারদর</span><span>প্রয়োজনীয় পণ্যের দাম সহজে জানুন</span><span>✳ স্বচ্ছ বাজার তথ্য</span><span>প্রতিদিনের দামের তুলনা</span></div></div>
      </section>

      <div className="container page-content">
        <TrendingSection title="আজ দাম বেড়েছে ▲" subtitle="যেসব পণ্যের দামে আজ ঊর্ধ্বগতি দেখা যাচ্ছে" products={risers} direction="up" />
        <TrendingSection title="আজ দাম কমেছে ▼" subtitle="দাম কমেছে যেসব নিত্যপ্রয়োজনীয় পণ্যের" products={fallers} direction="down" />

        <section className="section-block all-products-section" id="সব-পণ্য">
          <div className="section-heading-row all-products-heading">
            <div>
              <p className="section-eyebrow">বাজার আপনার হাতেই</p>
              <h2 className="section-title">সব পণ্য, সব দর</h2>
              <p className="section-subtitle">আপনার প্রয়োজনীয় পণ্যটি বেছে নিয়ে দেখুন আজকের দাম ও বাজারভিত্তিক তুলনা।</p>
            </div>
            <span className="product-count">{loading ? "..." : `${formatBanglaNumber(products.length, 0)}টি পণ্য`}</span>
          </div>
          {error ? <div className="api-warning"><span>ⓘ</span> তথ্য লোড করা যায়নি। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।</div> : null}
          {!loading && !error && products.some((product) => product.isSampleData) ? <div className="api-warning"><span>ⓘ</span> লাইভ API এই মুহূর্তে পাওয়া যাচ্ছে না—এখানে নমুনা দাম দেখানো হচ্ছে, এগুলোকে লাইভ বাজারদর হিসেবে ধরবেন না।</div> : null}
          <ProductGrid products={products} loading={loading} skeletonCount={8} />
          {!loading && products.length > 0 ? <div className="all-products-bottom"><span>আপনি দেখছেন {formatBanglaNumber(products.length, 0)}টি পণ্য</span><span>দাম বাজার ও সময়ভেদে পরিবর্তিত হতে পারে</span></div> : null}
        </section>
      </div>
    </main>
  );
}
