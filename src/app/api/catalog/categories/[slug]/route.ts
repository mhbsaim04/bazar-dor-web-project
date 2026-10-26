import { NextResponse } from "next/server";
import { getCategory, getProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const category = await getCategory(slug);
  if (!category) return NextResponse.json({ message: "ক্যাটাগরিটি পাওয়া যায়নি" }, { status: 404 });
  const products = await getProducts(category.slug);
  return NextResponse.json({ data: { category, products } });
}
