"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Check,
  CheckSquare,
  Copy,
  Kanban,
  ListTodo,
  QrCode,
  Send,
} from "lucide-react";

type FilmFilter = "Warm Kodak" | "Fuji Soft" | "Noir B&W";
type PlannerTab = "checklist" | "timeline" | "kanban";

const FILM_STYLES: Record<FilmFilter, { bg: string; badge: string; tone: string }> = {
  "Warm Kodak": {
    bg: "linear-gradient(135deg, #F6E2C4 0%, #E7B882 100%)",
    badge: "Klasik Hangat · 35mm",
    tone: "#3B2818",
  },
  "Fuji Soft": {
    bg: "linear-gradient(135deg, #DCECE2 0%, #A9CBB9 100%)",
    badge: "Pastel Sejuk · 400H",
    tone: "#162A20",
  },
  "Noir B&W": {
    bg: "linear-gradient(135deg, #E2E2E2 0%, #8C8C94 100%)",
    badge: "Monokrom Kontras · Ilford",
    tone: "#141418",
  },
};

export function EcosystemSpotlightsSection() {
  const [filmFilter, setFilmFilter] = useState<FilmFilter>("Warm Kodak");
  const [plannerTab, setPlannerTab] = useState<PlannerTab>("checklist");
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

  const activeFilm = FILM_STYLES[filmFilter];

  return (
    <section className="mx-auto max-w-[1240px] px-4 py-[72px] sm:px-6 lg:px-8 lg:py-[112px]">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold tracking-[0.14em] text-emerald-brand uppercase">
          Ekosistem Pendukung Acara &amp; Kejutan
        </span>
        <h2 className="mt-3 text-[30px] leading-[1.12] font-bold tracking-[-0.03em] text-ink text-balance sm:text-[42px]">
          Alat lengkap sebelum, saat, dan sesudah{" "}
          <span className="font-serif font-normal italic text-emerald-brand">momen</span>{" "}
          berlangsung.
        </h2>
      </div>

      <div className="mt-10 space-y-8">
        {/* Spotlight 1: Lensa Momen (Guest Camera QR) */}
        <article className="grid items-center gap-8 rounded-[24px] border border-hairline bg-surface p-6 sm:p-8 lg:grid-cols-12 lg:p-10">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-ink">
              <Camera className="h-3.5 w-3.5 text-emerald-brand" />
              Lensa Momen · Guest Camera QR
            </span>
            <h3 className="mt-4 text-[26px] leading-tight font-bold tracking-[-0.02em] text-ink text-balance sm:text-[30px]">
              Tamu memotret dari browser tanpa install aplikasi.
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted text-pretty">
              Taruh kartu QR di meja pesta ulang tahun, anniversary dinner, atau resepsi. Tamu
              cukup scan, memotret dengan filter film analog pilihanmu, lalu seluruh galeri terbuka
              serentak setelah acara selesai dalam satu file ZIP.
            </p>
            <ol className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <li className="rounded-xl border border-hairline bg-canvas p-3">
                <span className="text-xs font-bold text-emerald-brand">01 · Buat Event</span>
                <p className="mt-0.5 text-xs text-muted">Atur kuota tamu, jam, &amp; filter film.</p>
              </li>
              <li className="rounded-xl border border-hairline bg-canvas p-3">
                <span className="text-xs font-bold text-emerald-brand">02 · Bagikan QR</span>
                <p className="mt-0.5 text-xs text-muted">Cetak kartu meja atau kirim link WA.</p>
              </li>
              <li className="rounded-xl border border-hairline bg-canvas p-3">
                <span className="text-xs font-bold text-emerald-brand">03 · Motret</span>
                <p className="mt-0.5 text-xs text-muted">Sensasi kamera film tanpa hapus ulang.</p>
              </li>
              <li className="rounded-xl border border-hairline bg-canvas p-3">
                <span className="text-xs font-bold text-emerald-brand">04 · Reveal ZIP</span>
                <p className="mt-0.5 text-xs text-muted">Galeri terbuka serentak &amp; unduh 1 klik.</p>
              </li>
            </ol>
            <div className="mt-6">
              <Link
                href="/katalog?lini=lensa-momen"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-emerald-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-hover"
              >
                Lihat Cara Kerja Lensa Momen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Interactive Filter Preview */}
          <div className="rounded-[20px] border border-hairline bg-subtle p-5 lg:col-span-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
              <span className="text-xs font-semibold text-ink">Simulasi Filter Lensa Momen</span>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(FILM_STYLES) as FilmFilter[]).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setFilmFilter(filter)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      filmFilter === filter
                        ? "bg-emerald-brand text-white"
                        : "bg-surface text-muted hover:text-ink border border-hairline"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="flex min-h-[240px] flex-col justify-between rounded-2xl border border-black/10 p-5 transition-all duration-300"
              style={{ background: activeFilm.bg, color: activeFilm.tone }}
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>{activeFilm.badge}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/75 px-2.5 py-0.5 text-[11px] text-[#18181D]">
                  <QrCode className="h-3 w-3" />
                  142 / 250 Foto
                </span>
              </div>
              <div className="my-4 rounded-xl border border-black/10 bg-white/70 p-4 backdrop-blur-xs">
                <p className="font-serif text-2xl italic text-[#18181D]">
                  “Dinner Ulang Tahun ke-24”
                </p>
                <p className="mt-1 text-xs text-[#44424C]">
                  Jepretan tersimpan langsung ke galeri acara · Reveal besok 09.00 WIB
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-medium">
                <span>Mode: Disposable Camera</span>
                <span>Unduh ZIP Siap</span>
              </div>
            </div>
          </div>
        </article>

        {/* Spotlight 2: Rencana Momen (Planner) */}
        <article className="grid items-center gap-8 rounded-[24px] border border-hairline bg-surface p-6 sm:p-8 lg:grid-cols-12 lg:p-10">
          {/* Interactive Planner Mockup on left */}
          <div className="order-2 rounded-[20px] border border-hairline bg-subtle p-5 lg:order-1 lg:col-span-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
              <span className="text-xs font-semibold text-ink">Preview Workspace Rencana Momen</span>
              <div className="inline-flex gap-1 rounded-full border border-hairline bg-surface p-1">
                <button
                  type="button"
                  onClick={() => setPlannerTab("checklist")}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                    plannerTab === "checklist" ? "bg-emerald-brand text-white" : "text-muted"
                  }`}
                >
                  <CheckSquare className="h-3 w-3" />
                  Checklist
                </button>
                <button
                  type="button"
                  onClick={() => setPlannerTab("timeline")}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                    plannerTab === "timeline" ? "bg-emerald-brand text-white" : "text-muted"
                  }`}
                >
                  <ListTodo className="h-3 w-3" />
                  Jadwal
                </button>
                <button
                  type="button"
                  onClick={() => setPlannerTab("kanban")}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                    plannerTab === "kanban" ? "bg-emerald-brand text-white" : "text-muted"
                  }`}
                >
                  <Kanban className="h-3 w-3" />
                  Kanban
                </button>
              </div>
            </div>

            <div className="min-h-[220px] rounded-2xl border border-hairline bg-surface p-5">
              {plannerTab === "checklist" && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-hairline pb-2.5">
                    <span className="text-sm font-semibold text-ink">Persiapan Kejutan &amp; Venue</span>
                    <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-emerald-brand tabular-nums">
                      3 / 4 Selesai
                    </span>
                  </div>
                  {[
                    { label: "Kumpulkan 16 foto favorit & voice note", done: true },
                    { label: "Booking meja makan malam & kue", done: true },
                    { label: "Jadwalkan rilis link Kado Digital 00.00 WIB", done: true },
                    { label: "Cetak kartu QR Lensa Momen untuk teman", done: false },
                  ].map((task) => (
                    <div
                      key={task.label}
                      className="flex items-center gap-2.5 rounded-xl border border-hairline bg-canvas px-3 py-2 text-xs"
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${
                          task.done
                            ? "bg-emerald-brand text-white"
                            : "border border-control bg-surface"
                        }`}
                      >
                        {task.done && <Check className="h-3 w-3" />}
                      </span>
                      <span className={task.done ? "text-muted line-through" : "font-medium text-ink"}>
                        {task.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {plannerTab === "timeline" && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-ink">Linimasa Menuju Hari-H</p>
                  {[
                    { time: "H-14", title: "Kirim Save The Date & kunci daftar tamu" },
                    { time: "H-7", title: "Finalisasi tema, musik, dan catatan foto" },
                    { time: "H-1", title: "Kirim link WA personal dengan ?to=Nama" },
                  ].map((row) => (
                    <div
                      key={row.time}
                      className="flex items-center gap-3 rounded-xl border border-hairline bg-canvas p-3"
                    >
                      <span className="rounded-lg bg-gold px-2.5 py-1 text-xs font-bold text-ink tabular-nums">
                        {row.time}
                      </span>
                      <span className="text-xs font-medium text-ink">{row.title}</span>
                    </div>
                  ))}
                </div>
              )}

              {plannerTab === "kanban" && (
                <div className="grid grid-cols-3 gap-2.5 text-xs">
                  {[
                    { col: "Rencana", items: ["Pilih buket", "Cetak QR"] },
                    { col: "Proses", items: ["Isi surat kado", "Cek RSVP"] },
                    { col: "Selesai", items: ["Booking venue", "Tema aktif"] },
                  ].map((col) => (
                    <div key={col.col} className="rounded-xl bg-canvas p-2.5 border border-hairline">
                      <p className="font-semibold text-ink">{col.col}</p>
                      <div className="mt-2 space-y-1.5">
                        {col.items.map((it) => (
                          <div key={it} className="rounded-lg border border-hairline bg-surface p-2 text-[11px] text-muted">
                            {it}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-ink border border-gold/40">
              Rencana Momen · Event &amp; Gift Planner
            </span>
            <h3 className="mt-4 text-[26px] leading-tight font-bold tracking-[-0.02em] text-ink text-balance sm:text-[30px]">
              Atur kejutan atau persiapan pernikahan dari H-90 sampai hari-H.
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted text-pretty">
              Tidak perlu lagi spreadsheet terpisah. Susun checklist tak terbatas, jadwal kalender,
              papan kanban tugas, hingga cloud drive dokumen vendor dalam satu tempat.
            </p>
            <p className="mt-3 text-sm font-medium text-ink">
              Gratis uji coba terbatas · Full unlock{" "}
              <span className="font-bold text-emerald-brand tabular-nums">Rp79.000</span>{" "}
              sekali bayar (Gratis di paket Signature &amp; Diamond).
            </p>
            <div className="mt-6">
              <Link
                href="/katalog?lini=rencana-momen"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-control/60 bg-surface px-5 text-sm font-semibold text-ink transition-colors hover:bg-subtle"
              >
                Eksplor Rencana Momen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </article>

        {/* Spotlight 3: Smart Kirim WhatsApp & Buku Tamu */}
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

              <div className="mt-3 rounded-lg bg-canvas p-3 text-xs leading-relaxed text-ink border border-hairline">
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
