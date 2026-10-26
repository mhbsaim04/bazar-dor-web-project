import type { Category, MarketPrice, PriceDirection, Product } from "@/lib/types";
import { slugify } from "@/lib/format";

type AnyRecord = Record<string, unknown>;

const DEFAULT_API = "https://openapi.programming-hero.com/api/bazardor";
const FALLBACK_1 = "https://api.api-store.workers.dev/api/bazardor";
const FALLBACK_2 = "https://api.abcz.workers.dev/api/bazardor";

export const DEMO_CATEGORIES: Category[] = [
  { id: "chal", slug: "chal", name: "চাল", emoji: "🍚" },
  { id: "dal", slug: "dal", name: "ডাল", emoji: "🫘" },
  { id: "tel", slug: "tel", name: "তেল", emoji: "🫙" },
  { id: "sobji", slug: "sobji", name: "সবজি", emoji: "🥬" },
  { id: "mach", slug: "mach", name: "মাছ", emoji: "🐟" },
  { id: "mangsho", slug: "mangsho", name: "মাংস", emoji: "🍗" },
  { id: "dim", slug: "dim", name: "ডিম", emoji: "🥚" },
];

const DEMO_PRODUCTS: Product[] = [
  demo("1", "স্বর্ণমাছি চাল", "chal", "প্রতি কেজি", 78, 72, 84, 2.1, "🍚", "সুগন্ধি স্বর্ণমাছি চালের খুচরা বাজারদর।"),
  demo("2", "মিনিকেট চাল", "chal", "প্রতি কেজি", 72, 68, 76, -1.4, "🍚", "পরিবারের দৈনন্দিন ব্যবহারের মিনিকেট চাল।"),
  demo("3", "মসুর ডাল", "dal", "প্রতি কেজি", 138, 128, 148, 3.2, "🫘", "দেশি ও আমদানি করা মসুর ডালের গড় দর।"),
  demo("4", "সয়াবিন তেল", "tel", "প্রতি লিটার", 172, 168, 180, 0, "🫙", "বোতলজাত সয়াবিন তেলের বাজারদর।"),
  demo("5", "আলু", "sobji", "প্রতি কেজি", 32, 28, 38, -2.9, "🥔", "দেশি আলুর পাইকারি ও খুচরা বাজারদর।"),
  demo("6", "পেঁয়াজ", "sobji", "প্রতি কেজি", 90, 80, 100, 4.6, "🧅", "দেশি পেঁয়াজের আনুমানিক বাজারদর।"),
  demo("7", "কাঁচা মরিচ", "sobji", "প্রতি কেজি", 120, 100, 140, 5.8, "🌶️", "কাঁচা মরিচের বাজারদর ও দৈনিক পরিবর্তন।"),
  demo("8", "ইলিশ মাছ", "mach", "প্রতি কেজি", 1850, 1600, 2200, 1.7, "🐟", "আকার ও প্রাপ্যতাভেদে ইলিশের দাম পরিবর্তিত হয়।"),
  demo("9", "ব্রয়লার মুরগি", "mangsho", "প্রতি কেজি", 195, 185, 205, -1.2, "🍗", "ব্রয়লার মুরগির আনুমানিক খুচরা মূল্য।"),
  demo("10", "ডিম", "dim", "প্রতি ডজন", 148, 140, 156, -0.8, "🥚", "ফার্মের মুরগির ডিমের ডজনপ্রতি দাম।"),
  demo("11", "রসুন", "sobji", "প্রতি কেজি", 160, 140, 180, 2.4, "🧄", "দেশি ও আমদানি করা রসুনের বাজারদর।"),
  demo("12", "আদা", "sobji", "প্রতি কেজি", 220, 200, 250, -3.1, "🫚", "আদার সরবরাহ ও মান অনুযায়ী দাম ওঠানামা করে।"),
  demo("13", "ছোলা", "dal", "প্রতি কেজি", 95, 85, 105, 0.7, "🫘", "ছোলার খুচরা বাজারদর।"),
  demo("14", "গরুর মাংস", "mangsho", "প্রতি কেজি", 780, 750, 820, 1.1, "🥩", "বাজার ও কাট অনুযায়ী গরুর মাংসের দর।"),
];

function demo(
  id: string,
  name: string,
  categorySlug: string,
  unit: string,
  price: number,
  minPrice: number,
  maxPrice: number,
  changePercent: number,
  emoji: string,
  description: string,
): Product {
  const category = DEMO_CATEGORIES.find((item) => item.slug === categorySlug);
  return {
    id,
    slug: id,
    name,
    description,
    category: category?.name ?? "অন্যান্য",
    categorySlug,
    unit,
    price,
    minPrice,
    maxPrice,
    averagePrice: Math.round((minPrice + maxPrice + price) / 3),
    changePercent,
    direction: directionFor(changePercent),
    emoji,
    isSampleData: true,
    marketPrices: [
      { marketName: "কারওয়ান বাজার", location: "ঢাকা", price: minPrice + Math.round((price - minPrice) * 0.35) },
      { marketName: "মোহাম্মদপুর কৃষি মার্কেট", location: "ঢাকা", price },
      { marketName: "চট্টগ্রাম রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: maxPrice - Math.round((maxPrice - price) * 0.3) },
    ],
  };
}

function isRecord(value: unknown): value is AnyRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function firstDefined(record: AnyRecord, keys: string[]): unknown {
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const normalized = value.replace(/[০-৯]/g, (digit) => String("০১২৩৪৫৬৭৮৯".indexOf(digit))).replace(/[^0-9.-]/g, "");
    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function stringValue(value: unknown, fallback = ""): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  return fallback;
}

function directionFor(value: number): PriceDirection {
  if (value > 0.04) return "up";
  if (value < -0.04) return "down";
  return "flat";
}

function emojiFor(name: string, category: string): string {
  const value = `${name} ${category}`.toLocaleLowerCase();
  if (value.includes("চাল") || value.includes("rice")) return "🍚";
  if (value.includes("ডাল") || value.includes("ছোলা") || value.includes("lentil")) return "🫘";
  if (value.includes("তেল") || value.includes("oil")) return "🫙";
  if (value.includes("আলু") || value.includes("potato")) return "🥔";
  if (value.includes("পেঁয়াজ") || value.includes("পেঁয়াজ") || value.includes("onion")) return "🧅";
  if (value.includes("মরিচ") || value.includes("chili")) return "🌶️";
  if (value.includes("মাছ") || value.includes("fish")) return "🐟";
  if (value.includes("মুরগি") || value.includes("মাংস") || value.includes("chicken")) return "🍗";
  if (value.includes("ডিম") || value.includes("egg")) return "🥚";
  if (value.includes("আদা") || value.includes("ginger")) return "🫚";
  if (value.includes("রসুন") || value.includes("garlic")) return "🧄";
  if (value.includes("সবজি") || value.includes("সব্জি")) return "🥬";
  return "🛒";
}

function resolveCategory(record: AnyRecord): { name: string; slug: string } {
  const rawCategory = firstDefined(record, ["category", "category_name", "categoryName", "category_title"]);
  if (isRecord(rawCategory)) {
    const name = stringValue(firstDefined(rawCategory, ["name", "title", "name_bn"]), "অন্যান্য");
    const slug = stringValue(firstDefined(rawCategory, ["slug", "id", "category_id"]), slugify(name));
    return { name, slug: slugify(slug) };
  }
  const nameOrSlug = stringValue(rawCategory, stringValue(firstDefined(record, ["category_slug", "categorySlug"]), "অন্যান্য"));
  const explicitSlug = stringValue(firstDefined(record, ["category_slug", "categorySlug"]), "");
  const known = DEMO_CATEGORIES.find((item) => item.slug === slugify(nameOrSlug) || item.name === nameOrSlug);
  return {
    name: known?.name ?? nameOrSlug,
    slug: slugify(explicitSlug || known?.slug || nameOrSlug),
  };
}

function normalizeMarketPrices(value: unknown): MarketPrice[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!isRecord(item)) return [];
    const price = toNumber(firstDefined(item, ["price", "current_price", "today_price", "amount"]), NaN);
    const marketName = stringValue(firstDefined(item, ["market_name", "marketName", "bazar", "name", "market"]), "স্থানীয় বাজার");
    if (!Number.isFinite(price)) return [];
    return [{
      marketName,
      location: stringValue(firstDefined(item, ["location", "district", "city"]), ""),
      price,
      updatedAt: stringValue(firstDefined(item, ["updated_at", "updatedAt", "date"]), ""),
    }];
  });
}

export function normalizeProduct(rawValue: unknown, index = 0): Product | null {
  if (!isRecord(rawValue)) return null;
  const raw = rawValue;
  const name = stringValue(firstDefined(raw, ["name", "name_bn", "product_name", "productName", "title", "bn_name"]), "").trim();
  if (!name) return null;

  const id = stringValue(firstDefined(raw, ["id", "_id", "product_id", "productId", "slug"]), String(index + 1));
  const slugValue = stringValue(firstDefined(raw, ["slug", "product_slug", "productSlug"]), id);
  const category = resolveCategory(raw);
  const currentPrice = toNumber(firstDefined(raw, ["current_price", "currentPrice", "today_price", "todayPrice", "price", "price_bdt", "average_price", "avg_price"]), 0);
  const minPrice = toNumber(firstDefined(raw, ["min_price", "minimum_price", "minPrice"]), currentPrice);
  const maxPrice = toNumber(firstDefined(raw, ["max_price", "maximum_price", "maxPrice"]), currentPrice);
  const averagePrice = toNumber(firstDefined(raw, ["average_price", "avg_price", "averagePrice"]), currentPrice || Math.round((minPrice + maxPrice) / 2));
  const rawChange = toNumber(firstDefined(raw, ["change_percent", "change_percentage", "price_change_percent", "price_change_percentage", "percentage_change", "priceChangePercent", "changePercent"]), NaN);
  const trendText = stringValue(firstDefined(raw, ["trend", "direction", "price_trend"]), "").toLowerCase();
  const changePercent = Number.isFinite(rawChange) ? rawChange : trendText.includes("up") || trendText.includes("increase") || trendText.includes("বৃদ্ধি") ? 1 : trendText.includes("down") || trendText.includes("decrease") || trendText.includes("কম") ? -1 : 0;
  const unit = stringValue(firstDefined(raw, ["unit", "unit_name", "measurement_unit", "unitName"]), "প্রতি কেজি");
  const description = stringValue(firstDefined(raw, ["description", "details", "summary", "short_description"]), `${name} এর আজকের আনুমানিক বাজারদর।`);
  const emoji = stringValue(firstDefined(raw, ["emoji", "icon", "symbol"]), emojiFor(name, category.name));
  const markets = normalizeMarketPrices(firstDefined(raw, ["market_prices", "marketPrices", "markets", "bazar_prices", "prices_by_market"]));

  return {
    id,
    slug: slugValue || id,
    name,
    description,
    category: category.name,
    categorySlug: category.slug || "other",
    unit,
    price: currentPrice,
    minPrice,
    maxPrice,
    averagePrice,
    changePercent,
    direction: directionFor(changePercent),
    emoji,
    isSampleData: false,
    marketPrices: markets.length ? markets : [
      { marketName: "স্থানীয় বাজার", price: currentPrice, location: "বাংলাদেশ" },
    ],
  };
}

function walkArray(payload: unknown, preferredKeys: string[], depth = 0): unknown[] | null {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload) || depth > 5) return null;
  for (const key of preferredKeys) {
    if (Array.isArray(payload[key])) return payload[key] as unknown[];
  }
  for (const key of ["data", "result", "results", "payload", "response"]) {
    if (payload[key] !== undefined) {
      const found = walkArray(payload[key], preferredKeys, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

function unwrapObject(payload: unknown, preferredKeys: string[], depth = 0): unknown {
  if (!isRecord(payload) || depth > 5) return payload;
  for (const key of preferredKeys) {
    const value = payload[key];
    if (isRecord(value)) return value;
  }
  for (const key of ["data", "result", "payload", "response", "product", "category"]) {
    if (payload[key] !== undefined) {
      const unwrapped = unwrapObject(payload[key], preferredKeys, depth + 1);
      if (unwrapped !== payload[key] || isRecord(unwrapped)) return unwrapped;
    }
  }
  return payload;
}

function apiBases(): string[] {
  return Array.from(new Set([
    process.env.BAZARDOR_API_BASE_URL || DEFAULT_API,
    process.env.BAZARDOR_API_FALLBACK_URL_1 || FALLBACK_1,
    process.env.BAZARDOR_API_FALLBACK_URL_2 || FALLBACK_2,
  ].map((base) => base.replace(/\/$/, ""))));
}

async function requestFromBases(path: string): Promise<unknown | null> {
  for (const base of apiBases()) {
    try {
      const response = await fetch(`${base}${path}`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(7000),
      });
      if (!response.ok) continue;
      return await response.json();
    } catch {
      // Try the next API mirror. Local demo data keeps the UI usable if all mirrors fail.
    }
  }
  return null;
}

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  const path = categorySlug ? `/products?category=${encodeURIComponent(categorySlug)}` : "/products";
  const payload = await requestFromBases(path);
  const rows = walkArray(payload, ["products", "items", "results", "data"]);
  let products = (rows ?? []).map((row, index) => normalizeProduct(row, index)).filter((item): item is Product => item !== null);
  if (!products.length) products = [...DEMO_PRODUCTS];
  if (categorySlug) {
    const normalized = slugify(categorySlug);
    const filtered = products.filter((product) => product.categorySlug === normalized || slugify(product.category) === normalized);
    if (filtered.length) products = filtered;
    else if (payload === null) products = DEMO_PRODUCTS.filter((product) => product.categorySlug === normalized);
  }
  return products;
}

export async function getProduct(slug: string): Promise<Product | null> {
  const payload = await requestFromBases(`/products/${encodeURIComponent(slug)}`);
  const candidate = unwrapObject(payload, ["product", "item"]);
  const normalized = normalizeProduct(candidate);
  if (normalized && (normalized.slug === slug || normalized.id === slug || isRecord(candidate))) return normalized;
  const allProducts = await getProducts();
  return allProducts.find((product) => product.slug === slug || product.id === slug || slugify(product.name) === slug) ?? null;
}

export async function getCategories(): Promise<Category[]> {
  const payload = await requestFromBases("/categories");
  const rows = walkArray(payload, ["categories", "items", "results", "data"]);
  const categories = (rows ?? []).flatMap((row, index): Category[] => {
    if (typeof row === "string") {
      const known = DEMO_CATEGORIES.find((item) => item.name === row || item.slug === slugify(row));
      return [{ id: known?.id ?? String(index + 1), slug: known?.slug ?? slugify(row), name: known?.name ?? row, emoji: known?.emoji ?? "🛒" }];
    }
    if (!isRecord(row)) return [];
    const name = stringValue(firstDefined(row, ["name", "name_bn", "category_name", "title"]), "");
    if (!name) return [];
    const explicitSlug = stringValue(firstDefined(row, ["slug", "category_slug", "id", "_id"]), slugify(name));
    const known = DEMO_CATEGORIES.find((item) => item.slug === slugify(explicitSlug) || item.name === name);
    return [{
      id: stringValue(firstDefined(row, ["id", "_id", "category_id"]), String(index + 1)),
      slug: slugify(explicitSlug),
      name,
      emoji: stringValue(firstDefined(row, ["emoji", "icon"]), known?.emoji ?? "🛒"),
      description: stringValue(firstDefined(row, ["description", "details"]), ""),
    }];
  });
  return categories.length ? categories : DEMO_CATEGORIES;
}

export async function getCategory(slug: string): Promise<Category | null> {
  const payload = await requestFromBases(`/categories/${encodeURIComponent(slug)}`);
  const candidate = unwrapObject(payload, ["category", "item"]);
  if (isRecord(candidate)) {
    const name = stringValue(firstDefined(candidate, ["name", "name_bn", "category_name", "title"]), "");
    if (name) {
      const categorySlug = stringValue(firstDefined(candidate, ["slug", "category_slug", "id"]), slug);
      const known = DEMO_CATEGORIES.find((item) => item.slug === slugify(categorySlug) || item.name === name);
      return {
        id: stringValue(firstDefined(candidate, ["id", "_id"]), slug),
        slug: slugify(categorySlug),
        name,
        emoji: stringValue(firstDefined(candidate, ["emoji", "icon"]), known?.emoji ?? "🛒"),
        description: stringValue(firstDefined(candidate, ["description", "details"]), ""),
      };
    }
  }
  return (await getCategories()).find((category) => category.slug === slug || slugify(category.name) === slug) ?? null;
}
