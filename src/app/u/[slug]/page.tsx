import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getThemeBySlug } from "@/data/catalog";
import { CelestialWeddingExperience } from "@/components/demo/celestial-world/CelestialWeddingExperience";
import { readableCoupleFromSlug } from "@/components/demo/celestial-world/celestialShareCodec";

interface ExclusiveWeddingPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ExclusiveWeddingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const coupleName = readableCoupleFromSlug(slug);
  return {
    title: `Undangan Pernikahan 3D — ${coupleName}`,
    description: `Undangan pernikahan eksklusif Istana Awan 3D untuk merayakan hari bahagia ${coupleName}.`,
    robots: { index: false, follow: false },
  };
}

export default async function ExclusiveWeddingPage({
  params,
}: ExclusiveWeddingPageProps) {
  const { slug } = await params;
  const theme = getThemeBySlug("istana-awan");
  if (!theme) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center bg-[#080D24] text-sm font-medium text-[#FAF6EE]">
          Menyiapkan Istana Awan 3D...
        </div>
      }
    >
      <CelestialWeddingExperience
        theme={theme}
        exclusiveMode={true}
        slugHint={slug}
      />
    </Suspense>
  );
}
