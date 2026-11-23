import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogExplorer } from "@/components/catalog/CatalogExplorer";

export const metadata: Metadata = {
  title: "Katalog Tema & Produk Multi-Momen",
  description:
    "Jelajahi tema Kado Personal (Anniversary, Ulang Tahun, Sahabat), Wedding, Save The Date, Event & Party, Lensa Momen, dan Rencana Momen.",
};

function CatalogSkeleton() {
  return (
    <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-10 w-64 rounded-xl bg-subtle" />
      <div className="mt-4 h-5 w-96 rounded-lg bg-subtle" />
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {["sk1", "sk2", "sk3"].map((id) => (
          <div key={id} className="h-96 rounded-[20px] border border-hairline bg-surface p-4" />
        ))}
      </div>
    </div>
  );
}

export default function KatalogPage() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogExplorer />
    </Suspense>
  );
}
