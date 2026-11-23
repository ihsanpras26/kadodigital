import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CATALOG_THEMES, getThemeBySlug } from "@/data/catalog";
import { DemoExperienceClient } from "@/components/demo/DemoExperienceClient";

interface DemoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATALOG_THEMES.map((theme) => ({ slug: theme.slug }));
}

export async function generateMetadata({ params }: DemoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const theme = getThemeBySlug(slug);
  if (!theme) {
    return { title: "Demo Tidak Ditemukan" };
  }
  return {
    title: `Demo Interaktif — ${theme.name}`,
    description: theme.tagline,
    robots: { index: false, follow: false },
  };
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { slug } = await params;
  const theme = getThemeBySlug(slug);

  if (!theme) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center bg-canvas text-sm text-muted">
          Menyiapkan demo interaktif...
        </div>
      }
    >
      <DemoExperienceClient theme={theme} />
    </Suspense>
  );
}
