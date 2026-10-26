"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { getBanglaDate } from "@/lib/format";
import type { Category, Product } from "@/lib/types";
import Image from "next/image";

const FALLBACK_CATEGORIES: Category[] = [
  { id: "chal", slug: "chal", name: "চাল", emoji: "🍚" },
  { id: "dal", slug: "dal", name: "ডাল", emoji: "🫘" },
  { id: "tel", slug: "tel", name: "তেল", emoji: "🫙" },
  { id: "sobji", slug: "sobji", name: "সবজি", emoji: "🥬" },
  { id: "mach", slug: "mach", name: "মাছ", emoji: "🐟" },
  { id: "mangsho", slug: "mangsho", name: "মাংস", emoji: "🍗" },
];

function numberBn(value: number): string {
  return new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 1 }).format(value);
}

function directionLabel(product: Product): string {
  if (product.changePercent > 0) return `▲ ${numberBn(product.changePercent)}%`;
  if (product.changePercent < 0) return `▼ ${numberBn(Math.abs(product.changePercent))}%`;
  return "— ০.০%";
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [tickerProducts, setTickerProducts] = useState<Product[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dateLabel, setDateLabel] = useState("বাংলাদেশের বাজারদর");

  useEffect(() => {
    setDateLabel(getBanglaDate());
    let active = true;
    fetch("/api/catalog/categories")
      .then((response) => response.json())
      .then((payload: { data?: Category[] }) => {
        if (active && Array.isArray(payload.data) && payload.data.length) setCategories(payload.data.slice(0, 7));
      })
      .catch(() => undefined);
    fetch("/api/catalog/products")
      .then((response) => response.json())
      .then((payload: { data?: Product[] }) => {
        if (active && Array.isArray(payload.data)) setTickerProducts(payload.data.slice(0, 10));
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  async function handleSignOut() {
    setMobileMenuOpen(false);
    try {
      const result = await authClient.signOut();
      if (result.error) {
        toast.error(result.error.message || "সাইন আউট করা যায়নি");
        return;
      }
      toast.success("সফলভাবে সাইন আউট হয়েছে");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করার সময় সমস্যা হয়েছে");
    }
  }

  const repeatedTicker = [...tickerProducts, ...tickerProducts];

  return (
    <header className="site-header">
      <div className="container header-top">
        <Link href="/" className="brand" aria-label="বাজার দর হোম পেজ">
          <span className="brand-mark" aria-hidden="true"><Image src="/logo-icon.png" alt="logo-image" width={20}
        height={20}></Image></span>
          <span className="brand-copy">
            <span className="brand-name">বাজার দর<span className="brand-dot">।</span></span>
            <span className="brand-date">{dateLabel}</span>
          </span>
        </Link>

        <div className="header-tagline"><span className="status-dot" /> প্রতিদিনের বাজার, এক নজরে</div>

        <div className="auth-actions">
          {isPending ? <span className="auth-pending" aria-label="লোড হচ্ছে" /> : session?.user ? (
            <>
              <Link href="/profile" className="profile-link"><span className="avatar-small">{session.user.name?.slice(0, 1) || "ব্য"}</span><span className="profile-name">আমার প্রোফাইল</span></Link>
              <button type="button" className="button button-outline button-small" onClick={handleSignOut}>সাইন আউট</button>
            </>
          ) : (
            <>
              <Link className="button button-outline button-small" href="/signin">সাইন ইন</Link>
              <Link className="button button-primary button-small" href="/signup">সাইন আপ <span aria-hidden="true"></span></Link>
            </>
          )}
        </div>
        <button className="mobile-menu-toggle" type="button" aria-label="মেনু খুলুন" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}>
          <span /><span /><span />
        </button>
      </div>

      <div className={`nav-row ${mobileMenuOpen ? "nav-row-open" : ""}`}>
        <nav className="container category-nav" aria-label="পণ্য ক্যাটাগরি">
          <Link href="/#সব-পণ্য" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${pathname === "/" ? "nav-link-active" : ""}`}>সব পণ্য</Link>
          {categories.map((category) => {
            const active = pathname === `/category/${category.slug}`;
            return <Link key={category.id || category.slug} href={`/category/${category.slug}`} onClick={() => setMobileMenuOpen(false)} className={`nav-link ${active ? "nav-link-active" : ""}`}>{category.emoji} {category.name}</Link>;
          })}
          <div className="mobile-auth-nav">
            {session?.user ? <><Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="button button-outline">আমার প্রোফাইল</Link><button type="button" className="button button-primary" onClick={handleSignOut}>সাইন আউট</button></> : <><Link href="/signin" onClick={() => setMobileMenuOpen(false)} className="button button-outline">সাইন ইন</Link><Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="button button-primary">সাইন আপ</Link></>}
          </div>
        </nav>
      </div>

      <div className="ticker-wrap" aria-label="পণ্যের দামের পরিবর্তন">
        <div className="ticker-label"><span className="ticker-live-dot" /> লাইভ দর</div>
        <div className="ticker-viewport">
          {tickerProducts.length ? <div className="ticker-track">
            {repeatedTicker.map((product, index) => (
              <Link href={`/product/${product.slug}`} className="ticker-item" key={`${product.id}-${index}`}>
                <span className="ticker-emoji">{product.emoji}</span>
                <span className="ticker-product-name">{product.name}</span>
                <strong>{numberBn(product.price)} টাকা <span>/ {product.unit}</span></strong>
                <span className={`ticker-change ${product.direction}`}>{directionLabel(product)}</span>
              </Link>
            ))}
          </div> : <div className="ticker-static">আজকের দাম দেখুন • সর্বশেষ তথ্য জানতে পণ্য নির্বাচন করুন</div>}
        </div>
      </div>
    </header>
  );
}
