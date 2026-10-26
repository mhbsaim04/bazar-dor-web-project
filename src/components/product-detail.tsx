import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatBanglaNumber } from "@/lib/format";
import { ChangeBadge } from "@/components/product-card";

export function ProductDetail({ product }: { product: Product }) {
  const marketPrices = product.marketPrices.length ? product.marketPrices : [{ marketName: "স্থানীয় বাজার", price: product.price, location: "বাংলাদেশ" }];
  return (
    <main className="container route-main product-detail-page">
      <div className="breadcrumbs"><Link href="/">হোম</Link><span>/</span><Link href={`/category/${product.categorySlug}`}>{product.category}</Link><span>/</span><span>{product.name}</span></div>
      {product.isSampleData}
      <section className="detail-summary-card">
        <div className="detail-product-heading">
          <div className="detail-emoji">{product.emoji}</div>
          <div><div className="detail-tags"><span>{product.category}</span><span>{product.unit}</span></div><h1>{product.name}</h1><p>{product.description}</p><div className="detail-updated"><span className="status-dot" /> আজকের বাজারদরের সারসংক্ষেপ</div></div>
        </div>
        <div className="detail-current-price"><span>আজকের গড় দাম</span><strong>{formatBanglaNumber(product.averagePrice || product.price, 2)} <small>টাকা</small></strong><ChangeBadge product={product} /><p>{product.unit}</p></div>
      </section>

      <section className="section-block detail-prices-section">
        <div className="section-heading-row"><div><p className="section-eyebrow">দামের সারাংশ</p><h2 className="section-title">আজকের মূল্য বিশ্লেষণ</h2><p className="section-subtitle">বিভিন্ন বাজারের দামের ভিত্তিতে সর্বনিম্ন, সর্বোচ্চ ও গড় মূল্য।</p></div></div>
        <div className="price-summary-grid">
          <div className="price-summary-item min-price"><span className="summary-icon">↓</span><span className="summary-label">সর্বনিম্ন দাম</span><strong>{formatBanglaNumber(product.minPrice || product.price, 2)} <small>টাকা</small></strong><span className="summary-note">বাজারের মধ্যে সর্বনিম্ন</span></div>
          <div className="price-summary-item max-price"><span className="summary-icon">↑</span><span className="summary-label">সর্বোচ্চ দাম</span><strong>{formatBanglaNumber(product.maxPrice || product.price, 2)} <small>টাকা</small></strong><span className="summary-note">বাজারের মধ্যে সর্বোচ্চ</span></div>
          <div className="price-summary-item avg-price"><span className="summary-icon">≈</span><span className="summary-label">গড় দাম</span><strong>{formatBanglaNumber(product.averagePrice || product.price, 2)} <small>টাকা</small></strong><span className="summary-note">সব বাজারের গড়</span></div>
        </div>
      </section>

      <section className="section-block market-table-section">
        <div className="section-heading-row"><div><p className="section-eyebrow">বাজারভিত্তিক তুলনা</p><h2 className="section-title">বাজারভিত্তিক আজকের দাম</h2><p className="section-subtitle">বাজারের অবস্থান অনুযায়ী দামের পার্থক্য দেখুন।</p></div><span className="market-count-pill">{formatBanglaNumber(marketPrices.length, 0)}টি বাজার</span></div>
        <div className="market-table-wrap"><table className="market-table"><thead><tr><th>বাজারের নাম</th><th>অবস্থান</th><th>আজকের দাম</th><th>দামের অবস্থা</th></tr></thead><tbody>{marketPrices.map((market, index) => <tr key={`${market.marketName}-${index}`}><td><span className="market-row-icon">⌖</span><strong>{market.marketName}</strong></td><td>{market.location || "বাংলাদেশ"}</td><td className="table-price">{formatBanglaNumber(market.price, 2)} টাকা</td><td><span className="market-status"><span /> আপডেটেড</span></td></tr>)}</tbody></table></div>
        <p className="market-disclaimer">দ্রষ্টব্য: বাজারভিত্তিক দাম সম্ভাব্য। স্থান, মান ও সরবরাহ অনুযায়ী প্রকৃত দাম ভিন্ন হতে পারে।</p>
      </section>
      <div className="detail-bottom-cta"><div><strong>আরও পণ্যের বাজারদর দেখুন</strong><p>প্রয়োজনীয় সব পণ্যের দাম এক জায়গায় তুলনা করুন।</p></div><Link href="/#সব-পণ্য" className="button button-primary">সব পণ্য দেখুন ↗</Link></div>
    </main>
  );
}
