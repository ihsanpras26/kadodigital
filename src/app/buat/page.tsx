import type { Metadata } from "next";
import { Suspense } from "react";
import { HybridStudioClient } from "@/components/builder/HybridStudioClient";

export const metadata: Metadata = {
  title: "Buat Kado & Undangan — Mode Mandiri atau Terima Beres",
  description:
    "Pilih mode Buat Sendiri dengan live preview instan atau mode Terima Beres dibantu tim studio Kado Digital.",
};

export default function BuatPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1240px] px-4 py-14 text-sm text-muted sm:px-6 lg:px-8">
          Memuat studio editor Kado Digital...
        </div>
      }
    >
      <HybridStudioClient />
    </Suspense>
  );
}
