"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, Send } from "lucide-react";

export function EcosystemSpotlightsSection() {
  const [guestName, setGuestName] = useState("Raka & Nadya");
  const [copiedLink, setCopiedLink] = useState(false);

  const safeGuest = guestName.trim() || "Sahabat Dekat";
  const generatedLink = `https://kadodigital.my.id/u/serene-garden?to=${encodeURIComponent(
    safeGuest
  )}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 1800);
    } catch {
      setCopiedLink(false);
    }
  };

  return (
    <section className="mx-auto max-w-[1240px] px-4 py-[72px] sm:px-6 lg:px-8 lg:py-[112px]">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold tracking-[0.14em] text-emerald-brand uppercase">
          Distribusi Personal &amp; Buku Tamu
        </span>
        <h2 className="mt-3 text-[30px] leading-[1.12] font-bold tracking-[-0.03em] text-ink text-balance sm:text-[42px]">
          Kirim sapaan yang terasa{" "}
          <span className="font-serif font-normal italic text-emerald-brand">pribadi</span>{" "}
          untuk setiap penerima.
        </h2>
      </div>

      <div className="mt-10">
        {/* Smart Kirim WhatsApp & Buku Tamu */}
        <article className="grid items-center gap-8 rounded-[24px] border border-hairline bg-surface p-6 sm:p-8 lg:grid-cols-12 lg:p-10">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-ink">
              <Send className="h-3.5 w-3.5 text-emerald-brand" />
              Smart Kirim WhatsApp + Buku Tamu
            </span>
            <h3 className="mt-4 text-[26px] leading-tight font-bold tracking-[-0.02em] text-ink text-balance sm:text-[30px]">
              Satu template, ratusan sapaan nama personal langsung di sampul.
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted text-pretty">
              Setiap pembelian sudah termasuk kuota Smart Kirim WA gratis. Kelola daftar tamu per
              grup (Keluarga, Kampus, Kantor), pantau konfirmasi hadir real-time, dan isi ulang kuota
              kapan saja dari dashboard.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/buat?mode=mandiri"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-emerald-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-hover"
              >
                Coba Generator Link
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-[20px] border border-hairline bg-subtle p-5 lg:col-span-6">
            <label htmlFor="guest-name-demo" className="block text-xs font-semibold text-ink">
              Coba ketik nama penerima / tamu:
            </label>
            <input
              id="guest-name-demo"
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Contoh: Raka & Nadya"
              className="mt-2 h-11 w-full rounded-[10px] border border-control bg-surface px-3.5 text-sm text-ink"
            />

            <div className="mt-4 rounded-xl border border-hairline bg-surface p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-muted uppercase">
                  Link Personal Terbentuk
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-emerald-brand"
                >
                  {copiedLink ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copiedLink ? "Tersalin" : "Salin"}
                </button>
              </div>
              <p className="mt-1.5 break-all text-xs font-mono text-emerald-brand">
                {generatedLink}
              </p>

              <div className="mt-3 rounded-lg border border-hairline bg-canvas p-3 text-xs leading-relaxed text-ink">
                “Halo <span className="font-semibold text-emerald-brand">{safeGuest}</span>, ada
                undangan &amp; kejutan khusus untukmu. Buka di link ini ya 🌿”
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
