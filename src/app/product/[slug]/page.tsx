import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { getProduct } from "@/lib/catalog";
import { getServerSession } from "@/lib/server-auth";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `পণ্যের বিস্তারিত: ${slug}` };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const session = await getServerSession();
  if (!session) {
    redirect("/signin?notice=login-required");
  }
  return <ProductDetail product={product!} />;
}
