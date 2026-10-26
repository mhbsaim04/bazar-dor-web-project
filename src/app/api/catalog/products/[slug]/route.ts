import { NextResponse } from "next/server";
import { getProduct } from "@/lib/catalog";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const product = await getProduct(slug);
  if (!product) return NextResponse.json({ message: "পণ্যটি পাওয়া যায়নি" }, { status: 404 });
  return NextResponse.json({ data: product });
}
