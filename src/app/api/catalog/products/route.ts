import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category") || undefined;
  const products = await getProducts(category);
  return NextResponse.json({ data: products });
}
