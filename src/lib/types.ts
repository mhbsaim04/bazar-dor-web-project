export type PriceDirection = "up" | "down" | "flat";

export interface MarketPrice {
  marketName: string;
  price: number;
  location?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  unit: string;
  price: number;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  changePercent: number;
  direction: PriceDirection;
  emoji: string;
  marketPrices: MarketPrice[];
  isSampleData?: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  description?: string;
}
