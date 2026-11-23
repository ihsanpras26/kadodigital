"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  Clock,
  Copy,
  Eye,
  Lock,
  MessageCircle,
  Sparkles,
  Wand2,
} from "lucide-react";
import { CATALOG_THEMES } from "@/data/catalog";
import { PRICING_TIERS } from "@/data/pricing";
import { buildWhatsAppUrl, formatRupiah } from "@/lib/format";
import { GiftProjectDraftSchema, type GiftProjectDraft } from "@/lib/schemas";
import { isDarkHex } from "@/lib/color";

const DRAFT_STORAGE_KEY = "kado-digital-draft-v2";

const DEFAULT_DRAFT: GiftProjectDraft = {
  mode: "mandiri",
  themeSlug: "linen-letter",
  packageId: "kado-kejutan",
  moment: "Anniversary",
  recipientNickname: "Nadya",
  senderName: "Dimas",
  headline: "Dua Tahun & Setiap Kopi Pagi",
  releaseDate: "2026-12-14T00:00",
  releaseTimezone: "WIB",
  letterBody:
    "Terima kasih sudah selalu merayakan kemenangan kecilku dan menenangkan hari-hari yang berat. Buka foto di bawah buat baca catatan rahasianya ya.",
  photoCaptions: [
    "Kopi pertama di Braga saat hujan deras",
    "Kereta sore menuju Yogyakarta",
    "Makan malam merayakan langkah baru",
  ],
  mechanics: {
    flipPhoto: true,
    scratchReveal: true,
    memoryQuiz: false,
    passphraseLock: false,
  },
  passphraseHint: "Tanggal jadian (4 digit)",
  passphraseCode: "1402",
  scratchSecret: "Voucher traktir makan malam Sabtu jam 19.30 WIB!",
  conciergeStoryPoint1: "Awal ketemu pas hujan-hujanan di kedai kopi tahun 2024.",
  conciergeStoryPoint2: "Dia paling suka es kopi susu tanpa gula dan lagu indie sore.",
  conciergeInsideJoke: "Selalu debat 20 menit cuma buat milih tempat makan.",
  conciergeExpress: false,
  whatsappNumber: "",
};

function getConciergeAddonFee(packageId: string): number {
  if (packageId === "kado-signature" || packageId === "kado-trial" || packageId === "wedding-gratis") {
    return 0;
  }
  if (packageId === "kado-kejutan" || packageId.startsWith("wedding-")) {
    return 69000;
  }
  return 49000;
}

export function HybridStudioClient() {
  const searchParams = useSearchParams();
  const [draft, setDraft] = useState<GiftProjectDraft>(DEFAULT_DRAFT);
  const [hydrated, setHydrated] = useState(false);
  const [savedLabel, setSavedLabel] = useState("Draft siap disimpan otomatis");

  const [previewFlipped, setPreviewFlipped] = useState(false);
  const [previewScratched, setPreviewScratched] = useState(false);

  const [waGuestName, setWaGuestName] = useState("Nadya");
  const [copiedWaLink, setCopiedWaLink] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState<string | null>(null);

  // Hydrate from localStorage + URL overrides cleanly on client
  useEffect(() => {
    let nextDraft = { ...DEFAULT_DRAFT };

    try {
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const parsed = GiftProjectDraftSchema.safeParse(JSON.parse(raw));
        if (parsed.success) {
          nextDraft = parsed.data;
        }
      }
    } catch {
      // Ignore storage access errors
    }

    const temaParam = searchParams.get("tema");
    const modeParam = searchParams.get("mode");
    const paketParam = searchParams.get("paket");
    const expressParam = searchParams.get("express");

    if (temaParam && CATALOG_THEMES.some((t) => t.slug === temaParam)) {
      nextDraft.themeSlug = temaParam;
    }
    if (modeParam === "mandiri" || modeParam === "terima-beres") {
      nextDraft.mode = modeParam;
    }
    if (paketParam && PRICING_TIERS.some((p) => p.id === paketParam)) {
      nextDraft.packageId = paketParam;
      if (paketParam === "kado-signature") {
        nextDraft.mode = "terima-beres";
      }
    }
    if (expressParam === "1") {
      nextDraft.mode = "terima-beres";
      nextDraft.conciergeExpress = true;
    }

    setDraft(nextDraft);
    setHydrated(true);
  }, [searchParams]);

  // Autosave to localStorage after hydration
  useEffect(() => {
    if (!hydrated) return;
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
      window.localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({ ...draft, lastSavedAt: timeStr })
      );
      setSavedLabel(`Draft tersimpan otomatis pukul ${timeStr} WIB`);
    } catch {
      // Ignore quota errors
    }
  }, [draft, hydrated]);

  const selectedTheme = useMemo(
    () => CATALOG_THEMES.find((t) => t.slug === draft.themeSlug) ?? CATALOG_THEMES[0],
    [draft.themeSlug]
  );

  const selectedPackage = useMemo(
    () => PRICING_TIERS.find((p) => p.id === draft.packageId) ?? PRICING_TIERS[2],
    [draft.packageId]
  );

  const pricingBreakdown = useMemo(() => {
    const basePrice = selectedPackage.price;
    const conciergeFee =
      draft.mode === "terima-beres" ? getConciergeAddonFee(selectedPackage.id) : 0;
    const expressFee =
      draft.mode === "terima-beres" && draft.conciergeExpress
        ? Math.round((basePrice + conciergeFee) * 0.5)
        : 0;

    return {
      basePrice,
      conciergeFee,
      expressFee,
      total: basePrice + conciergeFee + expressFee,
    };
  }, [selectedPackage, draft.mode, draft.conciergeExpress]);

  const darkThemeBase = isDarkHex(selectedTheme.palette.base);
  const darkThemeAccent = isDarkHex(selectedTheme.palette.accent);
  const inkOnThemeBase = darkThemeBase ? "#F7F4EC" : "#18181D";

  const personalShareUrl = `https://kadodigital.my.id/k/${selectedTheme.slug}?to=${encodeURIComponent(
    waGuestName.trim() || draft.recipientNickname || "Kamu"
  )}`;

  const handleCopyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(personalShareUrl);
      setCopiedWaLink(true);
      window.setTimeout(() => setCopiedWaLink(false), 1800);
    } catch {
      setCopiedWaLink(false);
    }
  };

  const handleGenerateOrder = () => {
    const suffix = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedOrderId(`KD-2611-${suffix}`);
  };

  const conciergeWaHref = buildWhatsAppUrl(
    `Halo Studio Kado Digital, saya ingin konfirmasi order Terima Beres (${
      generatedOrderId ?? "KD-BARU"
    }).\nTema: ${selectedTheme.name}\nPaket: ${selectedPackage.name}\nExpress: ${
      draft.conciergeExpress ? "Ya (+50%)" : "Reguler"
    }\nEstimasi total: ${formatRupiah(pricingBreakdown.total)}`
  );

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      {/* Header + Mode Switcher */}
      <div className="flex flex-col justify-between gap-6 border-b border-hairline pb-7 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold tracking-[0.14em] text-emerald-brand uppercase">
            Studio Hybrid Kado Digital
          </span>
          <h1 className="mt-2 text-[32px] leading-tight font-bold tracking-[-0.03em] text-ink sm:text-[42px]">
            Susun sendiri atau serahkan{" "}
            <span className="font-serif font-normal italic text-emerald-brand">
              terima beres
            </span>
            .
          </h1>
          <p className="mt-2 text-sm text-muted sm:text-base">{savedLabel}</p>
        </div>

        <div
          role="tablist"
          aria-label="Pilih mode pengerjaan"
          className="inline-flex self-start rounded-full border border-hairline bg-surface p-1.5 shadow-xs"
        >
          <button
            type="button"
            role="tab"
            aria-selected={draft.mode === "mandiri"}
            onClick={() => setDraft((prev) => ({ ...prev, mode: "mandiri" }))}
            className={`min-h-[42px] rounded-full px-5 text-sm font-semibold transition-colors ${
              draft.mode === "mandiri"
                ? "bg-emerald-brand text-white"
                : "text-muted hover:text-ink"
            }`}
          >
            Buat Sendiri (Trial 2 Hari)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={draft.mode === "terima-beres"}
            onClick={() => setDraft((prev) => ({ ...prev, mode: "terima-beres" }))}
            className={`min-h-[42px] rounded-full px-5 text-sm font-semibold transition-colors ${
              draft.mode === "terima-beres"
                ? "bg-emerald-brand text-white"
                : "text-muted hover:text-ink"
            }`}
          >
            Terima Beres (Dibantu Tim)
          </button>
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-12">
        {/* LEFT COLUMN: FORM */}
        <div className="space-y-6 lg:col-span-7">
          {/* Shared Theme & Package Selection */}
          <section className="rounded-[20px] border border-hairline bg-surface p-6">
            <h2 className="text-lg font-bold text-ink">1. Pilih Tema &amp; Paket</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="builder-theme" className="block text-xs font-semibold text-ink">
                  Tema Desain
                </label>
                <select
                  id="builder-theme"
                  value={draft.themeSlug}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, themeSlug: e.target.value }))
                  }
                  className="mt-1.5 h-12 w-full rounded-[10px] border border-control bg-canvas px-3 text-sm text-ink"
                >
                  {CATALOG_THEMES.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name} ({item.subCategory})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="builder-package" className="block text-xs font-semibold text-ink">
                  Paket Pilihan
                </label>
                <select
                  id="builder-package"
                  value={draft.packageId}
                  onChange={(e) => {
                    const pkg = e.target.value;
                    setDraft((prev) => ({
                      ...prev,
                      packageId: pkg,
                      mode: pkg === "kado-signature" ? "terima-beres" : prev.mode,
                    }));
                  }}
                  className="mt-1.5 h-12 w-full rounded-[10px] border border-control bg-canvas px-3 text-sm text-ink"
                >
                  {PRICING_TIERS.map((tier) => (
                    <option key={tier.id} value={tier.id}>
                      {tier.name} — {formatRupiah(tier.price)} ({tier.activePeriod})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {draft.mode === "mandiri" ? (
            <>
              {/* Mandiri: Identity & Schedule */}
              <section className="rounded-[20px] border border-hairline bg-surface p-6">
                <h2 className="text-lg font-bold text-ink">
                  2. Sampul, Nama Panggilan, &amp; Jadwal Rilis
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="m-recipient" className="block text-xs font-semibold text-ink">
                      Nama Panggilan Penerima
                    </label>
                    <input
                      id="m-recipient"
                      type="text"
                      value={draft.recipientNickname}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, recipientNickname: e.target.value }))
                      }
                      className="mt-1.5 h-12 w-full rounded-[10px] border border-control bg-canvas px-3.5 text-sm text-ink"
                    />
                  </div>
                  <div>
                    <label htmlFor="m-sender" className="block text-xs font-semibold text-ink">
                      Nama Pengirim
                    </label>
                    <input
                      id="m-sender"
                      type="text"
                      value={draft.senderName}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, senderName: e.target.value }))
                      }
                      className="mt-1.5 h-12 w-full rounded-[10px] border border-control bg-canvas px-3.5 text-sm text-ink"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="m-headline" className="block text-xs font-semibold text-ink">
                      Judul Utama di Halaman Pertama
                    </label>
                    <input
                      id="m-headline"
                      type="text"
                      value={draft.headline}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, headline: e.target.value }))
                      }
                      className="mt-1.5 h-12 w-full rounded-[10px] border border-control bg-canvas px-3.5 text-sm text-ink"
                    />
                  </div>
                  <div>
                    <label htmlFor="m-date" className="block text-xs font-semibold text-ink">
                      Tanggal &amp; Jam Rilis Terjadwal
                    </label>
                    <input
                      id="m-date"
                      type="datetime-local"
                      value={draft.releaseDate}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, releaseDate: e.target.value }))
                      }
                      className="mt-1.5 h-12 w-full rounded-[10px] border border-control bg-canvas px-3.5 text-sm text-ink"
                    />
                  </div>
                  <div>
                    <label htmlFor="m-tz" className="block text-xs font-semibold text-ink">
                      Zona Waktu
                    </label>
                    <select
                      id="m-tz"
                      value={draft.releaseTimezone}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          releaseTimezone: e.target.value as "WIB" | "WITA" | "WIT",
                        }))
                      }
                      className="mt-1.5 h-12 w-full rounded-[10px] border border-control bg-canvas px-3 text-sm text-ink"
                    >
                      <option value="WIB">WIB (Jakarta / Barat)</option>
                      <option value="WITA">WITA (Bali / Tengah)</option>
                      <option value="WIT">WIT (Papua / Timur)</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Mandiri: Surat & 3 Catatan Foto */}
              <section className="rounded-[20px] border border-hairline bg-surface p-6">
                <h2 className="text-lg font-bold text-ink">
                  3. Surat Personal &amp; Catatan di Balik Foto
                </h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="m-letter" className="block text-xs font-semibold text-ink">
                      Isi Surat Utama
                    </label>
                    <textarea
                      id="m-letter"
                      rows={4}
                      value={draft.letterBody}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, letterBody: e.target.value }))
                      }
                      className="mt-1.5 w-full rounded-[10px] border border-control bg-canvas p-3.5 text-sm leading-relaxed text-ink"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <span className="block text-xs font-semibold text-ink">
                      3 Catatan Foto (Tampil saat foto dibalik)
                    </span>
                    {draft.photoCaptions.map((cap, idx) => (
                      <input
                        key={`cap-${idx + 1}`}
                        type="text"
                        aria-label={`Catatan foto ${idx + 1}`}
                        value={cap}
                        onChange={(e) => {
                          const updated: [string, string, string] = [
                            draft.photoCaptions[0],
                            draft.photoCaptions[1],
                            draft.photoCaptions[2],
                          ];
                          updated[idx] = e.target.value;
                          setDraft((prev) => ({ ...prev, photoCaptions: updated }));
                        }}
                        className="h-11 w-full rounded-[10px] border border-control/70 bg-canvas px-3.5 text-sm text-ink"
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* Mandiri: Mekanik Interaktif + Generator Link WA */}
              <section className="rounded-[20px] border border-hairline bg-surface p-6">
                <h2 className="text-lg font-bold text-ink">
                  4. Mekanik Interaktif &amp; Link Tamu WA
                </h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { key: "flipPhoto" as const, label: "Balik Foto (Flip Note)" },
                    { key: "scratchReveal" as const, label: "Gores Pesan (Scratch Reveal)" },
                    { key: "memoryQuiz" as const, label: "Kuis Kenangan 3 Soal" },
                    { key: "passphraseLock" as const, label: "Kunci Passphrase Rahasia" },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-hairline bg-canvas px-3.5 py-2 text-sm font-medium text-ink"
                    >
                      <input
                        type="checkbox"
                        checked={draft.mechanics[item.key]}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            mechanics: {
                              ...prev.mechanics,
                              [item.key]: e.target.checked,
                            },
                          }))
                        }
                        className="h-4 w-4 accent-emerald-brand"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>

                {draft.mechanics.scratchReveal && (
                  <div className="mt-4">
                    <label htmlFor="m-scratch" className="block text-xs font-semibold text-ink">
                      Pesan Rahasia di Balik Kartu Gores
                    </label>
                    <input
                      id="m-scratch"
                      type="text"
                      value={draft.scratchSecret}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, scratchSecret: e.target.value }))
                      }
                      className="mt-1.5 h-11 w-full rounded-[10px] border border-control bg-canvas px-3.5 text-sm text-ink"
                    />
                  </div>
                )}

                <div className="mt-5 rounded-xl border border-hairline bg-canvas p-4">
                  <label htmlFor="m-wa-guest" className="block text-xs font-semibold text-ink">
                    Generator Link Sapaan Personal WhatsApp (?to=Nama)
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input
                      id="m-wa-guest"
                      type="text"
                      value={waGuestName}
                      onChange={(e) => setWaGuestName(e.target.value)}
                      placeholder="Nama penerima/tamu..."
                      className="h-10 flex-1 rounded-lg border border-control/70 bg-surface px-3 text-sm text-ink"
                    />
                    <button
                      type="button"
                      onClick={handleCopyShareUrl}
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-emerald-brand px-3.5 text-xs font-semibold text-white"
                    >
                      {copiedWaLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedWaLink ? "Disalin" : "Salin Link"}
                    </button>
                  </div>
                  <p className="mt-2 break-all font-mono text-[11px] text-emerald-brand">
                    {personalShareUrl}
                  </p>
                </div>
              </section>
            </>
          ) : (
            /* TERIMA BERES: BRIEF STUDIO CONCIERGE */
            <section className="rounded-[20px] border border-hairline bg-surface p-6">
              <div className="flex items-center gap-2 text-emerald-brand">
                <Wand2 className="h-5 w-5" />
                <h2 className="text-lg font-bold text-ink">
                  2. Brief Personalisasi Studio (Terima Beres)
                </h2>
              </div>
              <p className="mt-1.5 text-sm text-muted">
                Cukup isi poin-poin singkat di bawah. Tim kami merangkai alur kalimat, crop wajah
                foto, dan menguji tampilan di HP sebelum kamu menyetujui preview final.
              </p>

              <div className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-sender" className="block text-xs font-semibold text-ink">
                      Nama Pengirim
                    </label>
                    <input
                      id="c-sender"
                      type="text"
                      value={draft.senderName}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, senderName: e.target.value }))
                      }
                      className="mt-1.5 h-12 w-full rounded-[10px] border border-control bg-canvas px-3.5 text-sm text-ink"
                    />
                  </div>
                  <div>
                    <label htmlFor="c-recipient" className="block text-xs font-semibold text-ink">
                      Nama Panggilan Penerima
                    </label>
                    <input
                      id="c-recipient"
                      type="text"
                      value={draft.recipientNickname}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, recipientNickname: e.target.value }))
                      }
                      className="mt-1.5 h-12 w-full rounded-[10px] border border-control bg-canvas px-3.5 text-sm text-ink"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="c-story-1" className="block text-xs font-semibold text-ink">
                    Pertanyaan 1: Momen apa yang sedang dirayakan &amp; bagaimana awalnya?
                  </label>
                  <textarea
                    id="c-story-1"
                    rows={2}
                    value={draft.conciergeStoryPoint1}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, conciergeStoryPoint1: e.target.value }))
                    }
                    className="mt-1.5 w-full rounded-[10px] border border-control bg-canvas p-3 text-sm text-ink"
                  />
                </div>

                <div>
                  <label htmlFor="c-story-2" className="block text-xs font-semibold text-ink">
                    Pertanyaan 2: Kebiasaan kecil atau hal yang paling kamu syukuri darinya
                  </label>
                  <textarea
                    id="c-story-2"
                    rows={2}
                    value={draft.conciergeStoryPoint2}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, conciergeStoryPoint2: e.target.value }))
                    }
                    className="mt-1.5 w-full rounded-[10px] border border-control bg-canvas p-3 text-sm text-ink"
                  />
                </div>

                <div>
                  <label htmlFor="c-joke" className="block text-xs font-semibold text-ink">
                    Pertanyaan 3: Inside joke / panggilan khas (opsional)
                  </label>
                  <input
                    id="c-joke"
                    type="text"
                    value={draft.conciergeInsideJoke}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, conciergeInsideJoke: e.target.value }))
                    }
                    className="mt-1.5 h-12 w-full rounded-[10px] border border-control bg-canvas px-3.5 text-sm text-ink"
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gold bg-gold-soft p-4">
                  <input
                    type="checkbox"
                    checked={draft.conciergeExpress}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, conciergeExpress: e.target.checked }))
                    }
                    className="mt-1 h-4 w-4 accent-emerald-brand"
                  />
                  <div>
                    <span className="flex items-center gap-1.5 text-sm font-bold text-ink">
                      <Clock className="h-4 w-4 text-emerald-brand" />
                      Tambah Express Same-Day (+50% dari total pesanan)
                    </span>
                    <p className="mt-0.5 text-xs text-muted">
                      Prioritas pengerjaan 6–12 jam kerja untuk kejutan mepet H-1 atau hari-H.
                    </p>
                  </div>
                </label>
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: LIVE PREVIEW (MANDIRI) OR ORDER SNAPSHOT (TERIMA BERES) */}
        <aside className="lg:sticky lg:top-24 lg:col-span-5">
          {draft.mode === "mandiri" ? (
            <div className="rounded-[24px] border border-hairline bg-surface p-5 shadow-[var(--shadow-stage)]">
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-brand">
                  <Eye className="h-4 w-4" />
                  Live Preview Real-Time
                </span>
                <span className="rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-semibold text-ink">
                  {selectedTheme.name}
                </span>
              </div>

              {/* Phone Frame Preview using Product Theme's own colors */}
              <div
                className="mt-4 overflow-hidden rounded-[22px] border border-hairline"
                style={{ backgroundColor: selectedTheme.palette.base, color: inkOnThemeBase }}
              >
                {/* Thin Non-Blocking Trial Banner */}
                <div className="bg-[#16201B] px-3 py-1.5 text-center text-[10px] font-semibold tracking-wider text-white uppercase">
                  PREVIEW TRIAL — BELUM DITERBITKAN
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between text-[11px] opacity-75">
                    <span>Untuk {draft.recipientNickname || "Kamu"}</span>
                    {draft.mechanics.passphraseLock && (
                      <span className="inline-flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Terkunci Kode
                      </span>
                    )}
                  </div>

                  <h3 className="font-editorial-alt text-2xl leading-tight font-semibold">
                    {draft.headline || "Judul Kejutan"}
                  </h3>

                  <p className="text-xs leading-relaxed opacity-85">
                    {draft.letterBody || "Isi surat personal akan tampil di sini..."}
                  </p>

                  <p
                    className="text-xs font-semibold italic"
                    style={{ color: selectedTheme.palette.accent }}
                  >
                    — {draft.senderName || "Pengirim"}
                  </p>

                  {draft.mechanics.flipPhoto && (
                    <button
                      type="button"
                      onClick={() => setPreviewFlipped((prev) => !prev)}
                      className="w-full rounded-xl border p-3.5 text-left transition-colors"
                      style={{
                        backgroundColor: previewFlipped
                          ? selectedTheme.palette.soft
                          : darkThemeBase
                          ? "#23253D"
                          : "#FFFFFF",
                        borderColor: `${selectedTheme.palette.accent}55`,
                        color: darkThemeBase && !previewFlipped ? "#F7F4EC" : "#18181D",
                      }}
                    >
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: selectedTheme.palette.accent }}
                      >
                        {previewFlipped ? "Catatan Balik Foto:" : "Kartu Foto 01 (Klik untuk balik):"}
                      </span>
                      <p className="mt-1 text-xs font-medium">
                        {draft.photoCaptions[0] || "Catatan kenangan pertama"}
                      </p>
                    </button>
                  )}

                  {draft.mechanics.scratchReveal && (
                    <button
                      type="button"
                      onClick={() => setPreviewScratched((prev) => !prev)}
                      className="w-full rounded-xl p-3.5 text-center text-xs font-semibold"
                      style={{
                        backgroundColor: previewScratched
                          ? selectedTheme.palette.soft
                          : "#D4A359",
                        color: "#18181D",
                      }}
                    >
                      {previewScratched
                        ? draft.scratchSecret
                        : "Klik untuk simulasi buka Scratch Reveal"}
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => setPublishModalOpen(true)}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-brand text-sm font-semibold text-white hover:bg-emerald-hover"
                >
                  Simpan &amp; Publikasikan ({formatRupiah(pricingBreakdown.total)})
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                <Link
                  href={`/demo/${selectedTheme.slug}`}
                  className="inline-flex h-10 w-full items-center justify-center rounded-full border border-hairline bg-canvas text-xs font-semibold text-ink hover:bg-subtle"
                >
                  Buka Demo Interaktif Penuh Tema Ini
                </Link>
              </div>
            </div>
          ) : (
            /* TERIMA BERES: ORDER SNAPSHOT & WHATSAPP HANDOFF */
            <div className="rounded-[24px] border border-hairline bg-surface p-6 shadow-[var(--shadow-stage)]">
              <div className="flex items-center justify-between border-b border-hairline pb-4">
                <h2 className="text-lg font-bold text-ink">Ringkasan Pesanan Terima Beres</h2>
                <span className="rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-semibold text-ink">
                  Studio Concierge
                </span>
              </div>

              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Tema Dipilih</dt>
                  <dd className="font-semibold text-ink">{selectedTheme.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Paket ({selectedPackage.activePeriod})</dt>
                  <dd className="font-semibold text-ink tabular-nums">
                    {selectedPackage.name} · {formatRupiah(pricingBreakdown.basePrice)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Jasa Terima Beres</dt>
                  <dd className="font-semibold text-ink tabular-nums">
                    {pricingBreakdown.conciergeFee === 0
                      ? "Termasuk Paket"
                      : formatRupiah(pricingBreakdown.conciergeFee)}
                  </dd>
                </div>
                {draft.conciergeExpress && (
                  <div className="flex justify-between text-emerald-brand">
                    <dt>Express Same-Day (+50%)</dt>
                    <dd className="font-semibold tabular-nums">
                      {formatRupiah(pricingBreakdown.expressFee)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-hairline pt-3 text-base font-bold text-ink">
                  <dt>Total Estimasi</dt>
                  <dd className="tabular-nums">{formatRupiah(pricingBreakdown.total)}</dd>
                </div>
              </dl>

              <div className="mt-5 rounded-xl border border-hairline bg-canvas p-4 text-xs leading-relaxed text-muted">
                <p className="font-semibold text-ink">Apa yang kamu dapat:</p>
                <ul className="mt-1.5 space-y-1">
                  <li>• Link preview berversi untuk kamu cek sebelum terbit</li>
                  <li>• Pengumpulan foto &amp; audio tetap diunggah aman via Order ID</li>
                  <li>• Pesan awal WhatsApp tidak membawa isi cerita pribadi</li>
                </ul>
              </div>

              {!generatedOrderId ? (
                <button
                  type="button"
                  onClick={handleGenerateOrder}
                  className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-brand text-sm font-semibold text-white hover:bg-emerald-hover"
                >
                  <Sparkles className="h-4 w-4" />
                  Buat Order ID &amp; Ringkasan
                </button>
              ) : (
                <div className="mt-5 space-y-3 rounded-2xl border border-emerald-brand/30 bg-accent-soft p-4">
                  <p className="text-xs font-semibold text-emerald-brand">
                    Order ID Siap: <span className="font-mono font-bold">{generatedOrderId}</span>
                  </p>
                  <a
                    href={conciergeWaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-brand text-sm font-semibold text-white hover:bg-emerald-hover"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Konfirmasi &amp; Kirim Order ID ke WhatsApp
                  </a>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* Mandiri Publish Summary Drawer/Modal */}
      {publishModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Konfirmasi publikasi proyek mandiri"
        >
          <div className="w-full max-w-md rounded-[24px] border border-hairline bg-surface p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-ink">Siap Aktifkan Proyekmu?</h2>
            <p className="mt-2 text-sm text-muted">
              Tema <strong>{selectedTheme.name}</strong> dengan paket{" "}
              <strong>{selectedPackage.name}</strong> ({selectedPackage.activePeriod}).
            </p>
            <div className="mt-4 rounded-xl border border-hairline bg-canvas p-4 text-sm">
              <div className="flex justify-between font-bold text-ink">
                <span>Total Paket</span>
                <span className="tabular-nums">{formatRupiah(pricingBreakdown.total)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">
                Draft kamu sudah tersimpan lokal di perangkat ini. Hubungi studio untuk aktivasi
                pembayaran atau mulai uji coba link sementara.
              </p>
            </div>
            <div className="mt-5 flex flex-col gap-2.5">
              <a
                href={buildWhatsAppUrl(
                  `Halo Kado Digital, saya mau mengaktifkan proyek Mandiri tema ${selectedTheme.name} paket ${selectedPackage.name} untuk "${draft.recipientNickname}".`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-emerald-brand text-sm font-semibold text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Lanjut Aktivasi via WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setPublishModalOpen(false)}
                className="inline-flex h-10 items-center justify-center rounded-full border border-hairline text-xs font-semibold text-ink hover:bg-subtle"
              >
                Kembali Mengedit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
