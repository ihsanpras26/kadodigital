"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Copy, Sparkles, X } from "lucide-react";
import type { GachaMode } from "./gachaData";
import { getGachaPayload } from "./gachaData";
import {
  buildExclusiveGiftUrl,
  encodeGiftOverrides,
  slugifyRecipient,
  type GachaCustomOverrides,
} from "./gachaShareCodec";

interface PersonalizeGiftDrawerProps {
  currentOverrides: GachaCustomOverrides;
  onApplyPreview: (next: GachaCustomOverrides) => void;
  onClose: () => void;
}

const MODES: { id: GachaMode; label: string }[] = [
  { id: "anniversary", label: "Anniversary" },
  { id: "ultah", label: "Ulang Tahun" },
  { id: "sahabat", label: "Sahabat" },
];

export function PersonalizeGiftDrawer({
  currentOverrides,
  onApplyPreview,
  onClose,
}: PersonalizeGiftDrawerProps) {
  const [form, setForm] = useState<GachaCustomOverrides>(currentOverrides);
  const [origin, setOrigin] = useState("https://kadodigital.my.id");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSwitchMode = (nextMode: GachaMode) => {
    const preset = getGachaPayload(nextMode);
    const polaroid = preset.capsules.find((c) => c.kind === "polaroid");
    const voice = preset.capsules.find((c) => c.kind === "voicenote");
    const voucher = preset.capsules.find((c) => c.kind === "voucher");

    setForm((prev) => ({
      ...prev,
      mode: nextMode,
      recipient: preset.defaultRecipient,
      sender: preset.senderName,
      dateLabel: preset.defaultDateLabel,
      pinHint: preset.defaultPinHint,
      polaroidCaption: polaroid?.frontCaption ?? prev.polaroidCaption,
      polaroidSecret: polaroid?.backNote ?? prev.polaroidSecret,
      voiceMessage: voice ? voice.transcriptLines.join("\n") : prev.voiceMessage,
      voucherTitle: voucher?.voucherHeadline ?? prev.voucherTitle,
      voucherDetail: voucher?.voucherDetail ?? prev.voucherDetail,
    }));
  };

  const normalizedForm: GachaCustomOverrides = {
    ...form,
    recipient: form.recipient.trim() || "Nadya",
    sender: form.sender.trim() || "Raka",
  };

  const fullUrl = buildExclusiveGiftUrl(origin, normalizedForm);
  const relativeRecipientHref = `/k/${slugifyRecipient(
    normalizedForm.recipient,
  )}?g=${encodeURIComponent(encodeGiftOverrides(normalizedForm))}`;

  const handleCopy = async () => {
    onApplyPreview(normalizedForm);
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Clipboard denied cleanly
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Personalisasi Kado & Buat Link Eksklusif"
      className="fixed inset-0 z-50 flex justify-end bg-[#0F0B09]/72 backdrop-blur-xs"
    >
      <div className="gacha-scroll-dark flex h-full w-full max-w-[460px] flex-col overflow-y-auto border-l border-[#E8C16E]/25 bg-[#1B1411] p-5 text-[#F6EFE2] shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3 border-b border-[#E8C16E]/15 pb-4">
          <div>
            <p className="gacha-receipt-font text-[10px] font-bold tracking-[0.18em] text-[#E8C16E] uppercase">
              STUDIO PERSONALISASI KADO
            </p>
            <h2 className="gacha-serif mt-1 text-2xl font-normal italic text-[#FAF4E8]">
              Racik Link Pribadi Untuknya
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panel personalisasi"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8C16E]/30 bg-[#261D18] text-[#FAF4E8] hover:bg-[#322620]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="mt-5 space-y-4 text-xs">
          {/* Occasion Switcher */}
          <div>
            <span className="gacha-receipt-font block text-[10px] font-bold tracking-wider text-[#C7B398] uppercase">
              PILIH NUANSA ACARA
            </span>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {MODES.map((m) => {
                const active = form.mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSwitchMode(m.id)}
                    className={`min-h-[38px] rounded-[10px] border text-xs font-semibold transition ${
                      active
                        ? "border-[#E8C16E] bg-[#942217] text-white"
                        : "border-[#E8C16E]/20 bg-[#241B17] text-[#DFCEB2] hover:border-[#E8C16E]/45"
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recipient & Sender */}
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="gacha-receipt-font block text-[10px] font-bold text-[#C7B398] uppercase">
                Untuk (Penerima)
              </span>
              <input
                type="text"
                value={form.recipient}
                onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                placeholder="Nama pasangan / sahabat"
                className="mt-1.5 h-10 w-full rounded-[10px] border border-[#E8C16E]/25 bg-[#120E0C] px-3 text-xs text-[#FAF4E8] placeholder:text-[#7D6957]"
              />
            </label>

            <label className="block">
              <span className="gacha-receipt-font block text-[10px] font-bold text-[#C7B398] uppercase">
                Dari (Pengirim)
              </span>
              <input
                type="text"
                value={form.sender}
                onChange={(e) => setForm({ ...form, sender: e.target.value })}
                placeholder="Namamu"
                className="mt-1.5 h-10 w-full rounded-[10px] border border-[#E8C16E]/25 bg-[#120E0C] px-3 text-xs text-[#FAF4E8] placeholder:text-[#7D6957]"
              />
            </label>
          </div>

          {/* Date & Secret 4-digit PIN */}
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="gacha-receipt-font block text-[10px] font-bold text-[#C7B398] uppercase">
                Tanggal Momen
              </span>
              <input
                type="text"
                value={form.dateLabel ?? ""}
                onChange={(e) => setForm({ ...form, dateLabel: e.target.value })}
                placeholder="14 Feb 2026"
                className="mt-1.5 h-10 w-full rounded-[10px] border border-[#E8C16E]/25 bg-[#120E0C] px-3 text-xs text-[#FAF4E8] placeholder:text-[#7D6957]"
              />
            </label>

            <label className="block">
              <span className="gacha-receipt-font block text-[10px] font-bold text-[#C7B398] uppercase">
                PIN 4 Digit (Opsional)
              </span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={form.pinCode ?? ""}
                onChange={(e) =>
                  setForm({ ...form, pinCode: e.target.value.replace(/\D/g, "").slice(0, 4) })
                }
                placeholder="Contoh: 1402"
                className="mt-1.5 h-10 w-full rounded-[10px] border border-[#E8C16E]/25 bg-[#120E0C] px-3 font-mono text-xs text-[#FAF4E8] placeholder:text-[#7D6957]"
              />
            </label>
          </div>

          {form.pinCode && form.pinCode.length > 0 && (
            <label className="block">
              <span className="gacha-receipt-font block text-[10px] font-bold text-[#C7B398] uppercase">
                Petunjuk Kode Rahasia
              </span>
              <input
                type="text"
                value={form.pinHint ?? ""}
                onChange={(e) => setForm({ ...form, pinHint: e.target.value })}
                placeholder="Contoh: Tanggal jadian kita (DDMM)"
                className="mt-1.5 h-10 w-full rounded-[10px] border border-[#E8C16E]/25 bg-[#120E0C] px-3 text-xs text-[#FAF4E8] placeholder:text-[#7D6957]"
              />
            </label>
          )}

          {/* Polaroid Caption & Secret Note */}
          <label className="block">
            <span className="gacha-receipt-font block text-[10px] font-bold text-[#C7B398] uppercase">
              Catatan Rahasia di Balik Polaroid (#01)
            </span>
            <textarea
              rows={2}
              value={form.polaroidSecret ?? ""}
              onChange={(e) => setForm({ ...form, polaroidSecret: e.target.value })}
              className="mt-1.5 w-full rounded-[10px] border border-[#E8C16E]/25 bg-[#120E0C] p-3 text-xs leading-relaxed text-[#FAF4E8] placeholder:text-[#7D6957]"
            />
          </label>

          {/* Voice Note Transcript */}
          <label className="block">
            <span className="gacha-receipt-font block text-[10px] font-bold text-[#C7B398] uppercase">
              Isi Pesan Kaset Suara (#02)
            </span>
            <textarea
              rows={3}
              value={form.voiceMessage ?? ""}
              onChange={(e) => setForm({ ...form, voiceMessage: e.target.value })}
              className="mt-1.5 w-full rounded-[10px] border border-[#E8C16E]/25 bg-[#120E0C] p-3 text-xs leading-relaxed text-[#FAF4E8] placeholder:text-[#7D6957]"
            />
          </label>

          {/* Voucher Title & Detail */}
          <label className="block">
            <span className="gacha-receipt-font block text-[10px] font-bold text-[#C7B398] uppercase">
              Hadiah Kupon Gosok (#04)
            </span>
            <input
              type="text"
              value={form.voucherTitle ?? ""}
              onChange={(e) => setForm({ ...form, voucherTitle: e.target.value })}
              className="mt-1.5 h-10 w-full rounded-[10px] border border-[#E8C16E]/25 bg-[#120E0C] px-3 text-xs text-[#FAF4E8]"
            />
          </label>

          <label className="block">
            <span className="gacha-receipt-font block text-[10px] font-bold text-[#C7B398] uppercase">
              Syarat Santai Kupon
            </span>
            <input
              type="text"
              value={form.voucherDetail ?? ""}
              onChange={(e) => setForm({ ...form, voucherDetail: e.target.value })}
              className="mt-1.5 h-10 w-full rounded-[10px] border border-[#E8C16E]/25 bg-[#120E0C] px-3 text-xs text-[#FAF4E8]"
            />
          </label>
        </div>

        {/* Live Exclusive Link Output */}
        <div className="mt-6 rounded-[14px] border border-[#E8C16E]/30 bg-[#120E0C] p-3.5">
          <p className="gacha-receipt-font text-[10px] font-bold text-[#E8C16E] uppercase">
            LINK KHUSUS PENERIMA (BEBAS NAVIGASI TOKO)
          </p>
          <p className="mt-1.5 truncate font-mono text-[11px] text-[#DFCEB2]">
            {fullUrl}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2.5 pb-2">
          <Link
            href={relativeRecipientHref}
            prefetch={false}
            className="gacha-brass-btn inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-[12px] px-4 text-sm font-bold"
          >
            <span>Buka Halaman Penerima</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-[11px] border border-[#E8C16E]/35 bg-[#241B17] px-3 text-xs font-semibold text-[#FAF4E8] hover:bg-[#2F231E]"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#7AE0A3]" aria-hidden="true" />
                  <span>Link Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Salin Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onApplyPreview(normalizedForm);
                onClose();
              }}
              className="gacha-lacquer-btn inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-[11px] px-3 text-xs font-semibold"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Terapkan Pratinjau</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
