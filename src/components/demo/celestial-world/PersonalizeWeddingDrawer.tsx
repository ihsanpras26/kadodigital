"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, RotateCcw, Sparkles, X } from "lucide-react";
import {
  buildExclusiveWeddingUrl,
  slugifyCouple,
  type CelestialWeddingOverrides,
} from "./celestialShareCodec";

interface PersonalizeWeddingDrawerProps {
  open: boolean;
  overrides: CelestialWeddingOverrides;
  guestName: string;
  onChangeOverrides: (next: CelestialWeddingOverrides) => void;
  onChangeGuestName: (next: string) => void;
  onReset: () => void;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export function PersonalizeWeddingDrawer({
  open,
  overrides,
  guestName,
  onChangeOverrides,
  onChangeGuestName,
  onReset,
  onClose,
  onNotify,
}: PersonalizeWeddingDrawerProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!open) return null;

  const groom = overrides.groomName ?? "Raka Mahendra";
  const bride = overrides.brideName ?? "Nadya Larasati";
  const origin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const shareUrl = buildExclusiveWeddingUrl(origin, overrides, guestName);
  const relativeHref = buildExclusiveWeddingUrl("", overrides, guestName);
  const coupleSlug = slugifyCouple(groom, bride);

  function updateField<K extends keyof CelestialWeddingOverrides>(
    key: K,
    val: CelestialWeddingOverrides[K],
  ) {
    onChangeOverrides({
      ...overrides,
      [key]: val,
    });
  }

  function handleCopyLink() {
    void navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    onNotify("Link undangan tamu privat disalin!");
    window.setTimeout(() => setCopiedLink(false), 1800);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#040716]/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Personalisasi Undangan Istana Awan"
    >
      <aside
        className="celestial-glass flex h-full w-full max-w-[420px] flex-col overflow-hidden border-l border-[#EFC86E]/30 text-[#FAF6EE]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#EFC86E]/20 px-5 py-4">
          <div>
            <p className="celestial-mono text-[10px] font-bold tracking-[0.2em] text-[#EFC86E] uppercase">
              Studio Kado Digital
            </p>
            <h2 className="celestial-serif mt-0.5 text-2xl italic text-[#FAF6EE]">
              Personalisasi &amp; Buat Link
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup studio personalisasi"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#EFC86E]/30 bg-[#080D24] text-[#EFC86E] hover:bg-[#19234A] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[#C2CEF0]">Mempelai Pria</span>
              <input
                type="text"
                value={overrides.groomName ?? ""}
                placeholder="Raka Mahendra"
                onChange={(e) => updateField("groomName", e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-[#EFC86E]/25 bg-[#080D24] px-3 text-sm text-[#FAF6EE] placeholder:text-[#6676A4] focus:border-[#EFC86E] focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-[#C2CEF0]">Mempelai Wanita</span>
              <input
                type="text"
                value={overrides.brideName ?? ""}
                placeholder="Nadya Larasati"
                onChange={(e) => updateField("brideName", e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-[#EFC86E]/25 bg-[#080D24] px-3 text-sm text-[#FAF6EE] placeholder:text-[#6676A4] focus:border-[#EFC86E] focus:outline-none"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-[#C2CEF0]">Nama Tamu Undangan (?to=)</span>
            <input
              type="text"
              value={guestName}
              placeholder="Budi Santoso"
              onChange={(e) => onChangeGuestName(e.target.value)}
              className="mt-1 h-10 w-full rounded-xl border border-[#EFC86E]/25 bg-[#080D24] px-3 text-sm text-[#FAF6EE] placeholder:text-[#6676A4] focus:border-[#EFC86E] focus:outline-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[#C2CEF0]">Tanggal Acara</span>
              <input
                type="text"
                value={overrides.dateDisplay ?? ""}
                placeholder="Minggu, 18 Oktober 2026"
                onChange={(e) => updateField("dateDisplay", e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-[#EFC86E]/25 bg-[#080D24] px-3 text-sm text-[#FAF6EE] placeholder:text-[#6676A4] focus:border-[#EFC86E] focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-[#C2CEF0]">Jam Akad &amp; Resepsi</span>
              <input
                type="text"
                value={overrides.resepsiTime ?? ""}
                placeholder="18.30 — 21.30 WITA"
                onChange={(e) => updateField("resepsiTime", e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-[#EFC86E]/25 bg-[#080D24] px-3 text-sm text-[#FAF6EE] placeholder:text-[#6676A4] focus:border-[#EFC86E] focus:outline-none"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-[#C2CEF0]">Nama Lokasi / Gedung</span>
            <input
              type="text"
              value={overrides.venueName ?? ""}
              placeholder="Glass Pavilion, Uluwatu — Bali"
              onChange={(e) => updateField("venueName", e.target.value)}
              className="mt-1 h-10 w-full rounded-xl border border-[#EFC86E]/25 bg-[#080D24] px-3 text-sm text-[#FAF6EE] placeholder:text-[#6676A4] focus:border-[#EFC86E] focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-[#C2CEF0]">Alamat Lengkap Venue</span>
            <input
              type="text"
              value={overrides.venueAddress ?? ""}
              placeholder="Jl. Tebing Samudra No. 88, Bali"
              onChange={(e) => updateField("venueAddress", e.target.value)}
              className="mt-1 h-10 w-full rounded-xl border border-[#EFC86E]/25 bg-[#080D24] px-3 text-sm text-[#FAF6EE] placeholder:text-[#6676A4] focus:border-[#EFC86E] focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-[#C2CEF0]">Kutipan Pembuka</span>
            <textarea
              rows={2}
              value={overrides.openingQuote ?? ""}
              placeholder="Di antara ribuan bintang yang melintas di langit malam..."
              onChange={(e) => updateField("openingQuote", e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#EFC86E]/25 bg-[#080D24] p-3 text-sm text-[#FAF6EE] placeholder:text-[#6676A4] focus:border-[#EFC86E] focus:outline-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[#C2CEF0]">Bank Amplop Digital</span>
              <input
                type="text"
                value={overrides.bankName ?? ""}
                placeholder="Bank BCA"
                onChange={(e) => updateField("bankName", e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-[#EFC86E]/25 bg-[#080D24] px-3 text-sm text-[#FAF6EE] placeholder:text-[#6676A4] focus:border-[#EFC86E] focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-[#C2CEF0]">No. Rekening</span>
              <input
                type="text"
                value={overrides.bankNumber ?? ""}
                placeholder="5420 8891 26"
                onChange={(e) => updateField("bankNumber", e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-[#EFC86E]/25 bg-[#080D24] px-3 text-sm text-[#FAF6EE] placeholder:text-[#6676A4] focus:border-[#EFC86E] focus:outline-none"
              />
            </label>
          </div>
        </div>

        {/* Share Link Footer */}
        <div className="border-t border-[#EFC86E]/20 bg-[#080D24]/90 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="celestial-mono text-[#EFC86E]">
              /u/{coupleSlug}
            </span>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-[#A7B6E0] hover:text-white cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Default</span>
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border border-[#EFC86E]/40 bg-[#121A40] px-3 text-xs font-semibold text-[#FAF6EE] hover:bg-[#1B265C] cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#EFC86E]" />
                  <span>Disalin</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-[#EFC86E]" />
                  <span>Salin Link Tamu</span>
                </>
              )}
            </button>
            <Link
              href={relativeHref}
              prefetch={false}
              className="celestial-gold-btn inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-bold"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Buka Halaman Tamu</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
