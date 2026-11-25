import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getThemeBySlug } from "@/data/catalog";
import { GachaStrukExperience } from "@/components/demo/gacha-world/GachaStrukExperience";
import { readableNameFromSlug } from "@/components/demo/gacha-world/gachaShareCodec";

interface ExclusiveGiftPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ExclusiveGiftPageProps): Promise<Metadata> {
  const { slug } = await params;
  const readableName = readableNameFromSlug(slug);
  return {
    title: `Titipan Pribadi untuk ${readableName}`,
    description: "Sebuah kado kapsul rahasia dibuat khusus untukmu.",
    robots: { index: false, follow: false },
  };
}

export default async function ExclusiveGiftPage({
  params,
}: ExclusiveGiftPageProps) {
  const { slug } = await params;
  const theme = getThemeBySlug("kapsul-kenangan");
  if (!theme) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center bg-[#14100E] text-sm font-medium text-[#FAF4E8]">
          Menyiapkan titipan pribadimu...
        </div>
      }
    >
      <GachaStrukExperience theme={theme} exclusiveMode={true} slugHint={slug} />
    </Suspense>
  );
}
