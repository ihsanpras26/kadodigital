"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type WorkMode = "mandiri" | "terima-beres";

const FLOWS: Record<
  WorkMode,
  {
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
    steps: { num: string; title: string; body: string }[];
  }
> = {
  mandiri: {
    subtitle: "Cocok jika kamu suka mengatur sendiri dan butuh link langsung aktif seketika.",
    ctaLabel: "Mulai Buat Sendiri (Gratis 2 Hari)",
    ctaHref: "/buat?mode=mandiri",
    steps: [
      {
        num: "01",
        title: "Pilih Tema & Mulai Trial",
        body: "Telusuri koleksi Kado Personal, Wedding, atau Event. Langsung buka editor tanpa kartu kredit.",
      },
      {
        num: "02",
        title: "Isi Cerita & Lihat Live Preview",
        body: "Unggah foto, tulis pesan di balik foto, pilih musik latar, dan atur interaksi kuis atau scratch.",
      },
      {
        num: "03",
        title: "Aktifkan & Bagikan Link",
        body: "Pilih paket yang pas, atur jadwal rilis atau kirim link personal ke WhatsApp dalam hitungan menit.",
      },
    ],
  },
  "terima-beres": {
    subtitle: "Cocok jika waktumu terbatas atau ingin tulisan, crop foto, & pacing dirapikan studio.",
    ctaLabel: "Pesan Mode Terima Beres",
    ctaHref: "/buat?mode=terima-beres",
    steps: [
      {
        num: "01",
        title: "Pilih Desain & Kirim Poin Cerita",
        body: "Pilih tema dan paket, lalu unggah foto mentah beserta poin kenangan di portal brief yang aman.",
      },
      {
        num: "02",
        title: "Studio Merangkai & Uji Lintas HP",
        body: "Tim merapikan teks, menjaga crop wajah, menyusun animasi, dan mengirim link preview berversi.",
      },
      {
        num: "03",
        title: "Review, Setujui, & Siap Kejutan",
        body: "Minta revisi bila perlu atau tekan setuju. Kado langsung rilis atau terkunci sampai jam kejutanmu.",
      },
    ],
  },
};

export function HowItWorksSection() {
  const [mode, setMode] = useState<WorkMode>("mandiri");
  const current = FLOWS[mode];

  return (
    <section className="border-y border-hairline bg-surface py-[72px] lg:py-[112px]">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <span className="text-xs font-semibold tracking-[0.14em] text-emerald-brand uppercase">
              Cara Kerja Hybrid
            </span>
            <h2 className="mt-3 text-[30px] leading-[1.12] font-bold tracking-[-0.03em] text-ink text-balance sm:text-[42px]">
              Mau rangkai sendiri atau{" "}
              <span className="font-serif font-normal italic text-emerald-brand">
                terima beres
              </span>
              , keduanya sama rapi.
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Pilih cara pengerjaan"
            className="inline-flex self-start rounded-full border border-hairline bg-subtle p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "mandiri"}
              onClick={() => setMode("mandiri")}
              className={`min-h-[40px] rounded-full px-4 text-sm font-semibold transition-colors ${
                mode === "mandiri" ? "bg-emerald-brand text-white" : "text-muted hover:text-ink"
              }`}
            >
              Buat Sendiri (Instan)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "terima-beres"}
              onClick={() => setMode("terima-beres")}
              className={`min-h-[40px] rounded-full px-4 text-sm font-semibold transition-colors ${
                mode === "terima-beres" ? "bg-emerald-brand text-white" : "text-muted hover:text-ink"
              }`}
            >
              Terima Beres (Dibantu Tim)
            </button>
          </div>
        </div>

        <p className="mt-4 text-[15px] text-muted">{current.subtitle}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {current.steps.map((step) => (
            <div
              key={step.num}
              className="flex flex-col rounded-[20px] border border-hairline bg-canvas p-6 sm:p-7"
            >
              <span className="font-serif text-4xl leading-none text-emerald-brand tabular-nums">
                {step.num}
              </span>
              <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted text-pretty">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-start">
          <Link
            href={current.ctaHref}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-emerald-brand px-6 text-[15px] font-semibold text-white transition-colors hover:bg-emerald-hover"
          >
            {current.ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
