import type { Metadata } from "next";
import { CategoryPageClient } from "@/components/category-page-client";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `ক্যাটাগরি: ${slug}` };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  return <CategoryPageClient slug={slug} />;
}
