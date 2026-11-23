"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Camera, Check, Download, QrCode, Sparkles } from "lucide-react";
import { buildWhatsAppUrl, formatRupiah } from "@/lib/format";

const GUEST_TIERS = [
  { count: 50, label: "50 Tamu", shots: "300 foto bersama", price: 79000 },
  { count: 100, label: "100 Tamu", shots: "600 foto bersama", price: 129000 },
  { count: 200, label: "200 Tamu", shots: "1.200 foto bersama", price: 199000 },
  { count: 350, label: "350 Tamu", shots: "2.200 foto bersama", price: 279000 },
];

const FILMS = [
  { id: "warm-kodak", name: "Warm Kodak 400", bg: "#F4DEC0", accent: "#A35A2A" },
  { id: "fuji-soft", name: "Fuji Pastel", bg: "#DCECE2", accent: "#215A41" },
  { id: "noir-mono", name: "Noir Monokrom", bg: "#E5E5E7", accent: "#1F1F24" },
  { id: "golden-flash", name: "Night Flash 90s", bg: "#F6E7B8", accent: "#7E4B18" },
];

export function LensaMomenConfigurator() {
  const [tierIndex, setTierIndex] = useState(1);
  const [selectedFilm, setSelectedFilm] = useState(FILMS[0].id);
  const [eventTitle, setEventTitle] = useState("Dinner Ulang Tahun ke-24");

  const tier = GUEST_TIERS[tierIndex] ?? GUEST_TIERS[1];
  const film = FILMS.find((f) => f.id === selectedFilm) ?? FILMS[0];

  return (
    <div className="space-y-10">
      <div className="grid gap-8 rounded-[24px] border border-hairline bg-surface p-6 sm:p-8 lg:grid-cols-12">
        {/* Left Controls */}
        <div className="lg:col-span-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-ink">
            <Camera className="h-3.5 w-3.5 text-emerald-brand" />
            Lensa Momen · Konfigurator Event
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Atur kamera tamu QR untuk acaramu.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
            Kuota foto bersifat bersama tanpa batas per tamu. Cocok untuk pesta ulang tahun,
            anniversary dinner, wisuda, hingga resepsi pernikahan.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="lensa-title" className="block text-sm font-semibold text-ink">
                Nama Acara
              </label>
              <input
                id="lensa-title"
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="mt-1.5 h-12 w-full rounded-[10px] border border-control bg-canvas px-3.5 text-sm text-ink"
              />
            </div>

            <div>
              <span className="block text-sm font-semibold text-ink">Perkiraan Jumlah Tamu</span>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {GUEST_TIERS.map((item, idx) => (
                  <button
                    key={item.count}
                    type="button"
                    onClick={() => setTierIndex(idx)}
                    className={`min-h-[44px] rounded-xl border px-3 py-2 text-center text-xs font-semibold transition-colors ${
                      tierIndex === idx
                        ? "border-emerald-brand bg-accent-soft text-emerald-brand"
                        : "border-hairline bg-canvas text-ink hover:bg-subtle"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-sm font-semibold text-ink">Pilih Filter Film Permanen</span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {FILMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedFilm(item.id)}
                    className={`flex min-h-[44px] items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold ${
                      selectedFilm === item.id
                        ? "border-emerald-brand bg-surface ring-1 ring-emerald-brand"
                        : "border-hairline bg-canvas hover:bg-subtle"
                    }`}
                  >
                    <span
                      className="h-4 w-4 shrink-0 rounded-full border border-black/15"
                      style={{ backgroundColor: item.bg }}
                    />
                    <span className="text-ink">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-hairline bg-canvas p-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-xs text-muted">Estimasi Paket ({tier.shots})</p>
                  <p className="text-2xl font-bold text-ink tabular-nums">
                    {formatRupiah(tier.price)}
                  </p>
                </div>
                <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">
                  Retensi Galeri 30 Hari
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2.5">
                <a
                  href={buildWhatsAppUrl(
                    `Halo Kado Digital, saya mau pesan Lensa Momen (${tier.label}, filter ${film.name}) untuk acara "${eventTitle}".`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-emerald-brand px-4 text-sm font-semibold text-white hover:bg-emerald-hover"
                >
                  Pesan Lensa Momen
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/buat?mode=mandiri"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-control/60 bg-surface px-4 text-sm font-semibold text-ink hover:bg-subtle"
                >
                  Gabung dengan Undangan
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview Card */}
        <div className="flex flex-col justify-between rounded-[20px] border border-hairline bg-subtle p-5 lg:col-span-6">
          <div className="flex items-center justify-between text-xs font-semibold text-muted">
            <span>Pratinjau Kartu Meja QR</span>
            <span>Tanpa Download Aplikasi</span>
          </div>

          <div className="mx-auto my-6 w-full max-w-[300px] rounded-[24px] border border-hairline bg-surface p-6 text-center shadow-md">
            <span
              className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold"
              style={{ backgroundColor: film.bg, color: film.accent }}
            >
              Filter: {film.name}
            </span>
            <h3 className="mt-3 font-serif text-2xl font-normal text-ink">
              {eventTitle || "Acara Spesial Kami"}
            </h3>
            <p className="mt-1 text-xs text-muted">
              Scan untuk memotret momen bersama ({tier.shots})
            </p>

            <div className="mx-auto my-5 flex h-36 w-36 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-brand/40 bg-canvas">
              <QrCode className="h-16 w-16 text-emerald-brand" strokeWidth={1.5} />
              <span className="mt-1 text-[10px] font-mono text-muted">QR EVENT READY</span>
            </div>

            <div className="space-y-1.5 text-left text-xs text-muted">
              <p className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-brand" />
                Buka langsung di kamera browser HP
              </p>
              <p className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-brand" />
                Semua hasil diungkap serentak &amp; unduh ZIP
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted border-t border-hairline pt-3">
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Bisa dipadukan dengan undangan &amp; kado
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-ink">
              <Download className="h-3.5 w-3.5" />
              Siap Cetak PDF
            </span>
          </div>
        </div>
      </div>

      {/* 4-step How it works */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          {
            step: "01",
            title: "Buat Event Kamu",
            desc: "Pilih jumlah tamu, tanggal, jam aktif, tema warna, dan filter film analog. Kuota dipakai bersama.",
          },
          {
            step: "02",
            title: "Bagikan Lewat QR",
            desc: "Unduh kartu meja QR siap cetak atau kirim link ke WhatsApp. Tamu langsung memotret tanpa daftar.",
          },
          {
            step: "03",
            title: "Motret Sepanjang Acara",
            desc: "Tamu menangkap momen jujur selama jam acara tanpa preview berlebihan atau hapus ulang.",
          },
          {
            step: "04",
            title: "Galeri Reveal & ZIP",
            desc: "Seluruh foto terbuka bersamaan di dashboard dan siap diunduh dalam satu arsip ZIP.",
          },
        ].map((item) => (
          <div key={item.step} className="rounded-2xl border border-hairline bg-surface p-5">
            <span className="font-serif text-3xl text-emerald-brand tabular-nums">{item.step}</span>
            <h3 className="mt-2 text-base font-semibold text-ink">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
