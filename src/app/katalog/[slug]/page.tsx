import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATALOG_THEMES, getThemeBySlug } from "@/data/catalog";
import { ThemeDetailClient } from "@/components/catalog/ThemeDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATALOG_THEMES.map((theme) => ({ slug: theme.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const theme = getThemeBySlug(slug);
  if (!theme) {
    return { title: "Tema Tidak Ditemukan" };
  }
  return {
    title: `${theme.name} — Katalog Tema`,
    description: theme.tagline,
  };
}

export default async function ThemeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const theme = getThemeBySlug(slug);

  if (!theme) {
    notFound();
  }

  const related = CATALOG_THEMES.filter(
    (item) => item.slug !== theme.slug && item.line === theme.line
  ).slice(0, 3);

  return <ThemeDetailClient theme={theme} related={related} />;
}
