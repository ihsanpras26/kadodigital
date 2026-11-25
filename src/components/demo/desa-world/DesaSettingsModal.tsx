"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import type { DesaTimeOfDay } from "@/data/desaWorldData";
import type { DesaMusicTrack } from "./audioEngine";
import { VillageCloseIcon, VillageTimeIcon } from "./DesaIcons";

interface DesaSettingsModalProps {
  themeSlug: string;
  musicEnabled: boolean;
  onToggleMusic: (enabled: boolean) => void;
  musicTrack: DesaMusicTrack;
  onChangeMusicTrack: (track: DesaMusicTrack) => void;
  sfxEnabled: boolean;
  onToggleSfx: (enabled: boolean) => void;
  timeOfDay: DesaTimeOfDay;
  onChangeTimeOfDay: (time: DesaTimeOfDay) => void;
  navSide: "left" | "right";
  onChangeNavSide: (side: "left" | "right") => void;
  navMode: "stick" | "dpad";
  onChangeNavMode: (mode: "stick" | "dpad") => void;
  showVirtualPadOnDesktop: boolean;
  onToggleVirtualPadOnDesktop: (show: boolean) => void;
  onReplayIntro?: () => void;
  onClose: () => void;
}

export function DesaSettingsModal({
  themeSlug,
  musicEnabled,
  onToggleMusic,
  musicTrack,
  onChangeMusicTrack,
  sfxEnabled,
  onToggleSfx,
  timeOfDay,
  onChangeTimeOfDay,
  navSide,
  onChangeNavSide,
  navMode,
  onChangeNavMode,
  showVirtualPadOnDesktop,
  onToggleVirtualPadOnDesktop,
  onReplayIntro,
  onClose,
}: DesaSettingsModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-[#15241B]/38 p-3 pt-16 sm:p-5 sm:pt-20"
      onClick={onClose}
    >
      <div
        className="desa-woven-pill relative w-full max-w-[340px] rounded-[22px] border border-[#C8B490] p-5 text-[#3E2B1E] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Pengaturan Tampilan & Audio"
      >
        <div className="flex items-start justify-between gap-2 border-b border-[#DED0B6] pb-3">
          <div>
            <p className="text-[11px] font-semibold tracking-wider text-[#2A5C45] uppercase">
              Pengaturan
            </p>
            <h3 className="desa-display mt-0.5 text-lg font-semibold text-[#3E2B1E]">
              Tampilan &amp; Audio
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pengaturan"
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#D4C2A3] bg-[#EFE5CE] text-[#3E2B1E] transition hover:bg-[#E4D4B5]"
          >
            <VillageCloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3.5 text-xs">
          {/* Musik */}
          <div>
            <p className="mb-1.5 font-semibold text-[#3E2B1E]">Musik Latar</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { val: true, label: "Aktif" },
                { val: false, label: "Nonaktif" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => onToggleMusic(opt.val)}
                  className={`min-h-[40px] rounded-[12px] border font-semibold transition ${
                    musicEnabled === opt.val
                      ? "border-[#2A5C45] bg-[#2A5C45] text-white"
                      : "border-[#D4C2A3] bg-[#FFFDF9] text-[#3E2B1E] hover:bg-[#EFE5CE]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Alunan Musik */}
          <div>
            <p className="mb-1.5 font-semibold text-[#3E2B1E]">Alunan Musik</p>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: "senja", label: "Senja" },
                  { id: "lelagon", label: "Lelagon" },
                  { id: "pagi", label: "Pagi" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onChangeMusicTrack(t.id)}
                  className={`min-h-[38px] rounded-[10px] border font-semibold transition ${
                    musicTrack === t.id
                      ? "border-[#2A5C45] bg-[#2A5C45] text-white"
                      : "border-[#D4C2A3] bg-[#FFFDF9] text-[#3E2B1E] hover:bg-[#EFE5CE]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Suara Alam & SFX */}
          <div>
            <p className="mb-1.5 font-semibold text-[#3E2B1E]">Suara Alam &amp; Efek</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { val: true, label: "Aktif" },
                { val: false, label: "Senyap" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => onToggleSfx(opt.val)}
                  className={`min-h-[40px] rounded-[12px] border font-semibold transition ${
                    sfxEnabled === opt.val
                      ? "border-[#2A5C45] bg-[#2A5C45] text-white"
                      : "border-[#D4C2A3] bg-[#FFFDF9] text-[#3E2B1E] hover:bg-[#EFE5CE]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Suasana Waktu */}
          <div>
            <p className="mb-1.5 font-semibold text-[#3E2B1E]">Waktu &amp; Cahaya</p>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: "pagi", label: "Pagi" },
                  { id: "sore", label: "Sore" },
                  { id: "malam", label: "Malam" },
                ] as const
              ).map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChangeTimeOfDay(id)}
                  className={`flex min-h-[40px] items-center justify-center gap-1 rounded-[12px] border font-semibold transition ${
                    timeOfDay === id
                      ? "border-[#2A5C45] bg-[#2A5C45] text-white"
                      : "border-[#D4C2A3] bg-[#FFFDF9] text-[#3E2B1E] hover:bg-[#EFE5CE]"
                  }`}
                >
                  <VillageTimeIcon time={id} className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Posisi & Model Kontrol */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <p className="mb-1.5 font-semibold text-[#3E2B1E]">Posisi Panel</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "left" as const, label: "Kiri" },
                  { id: "right" as const, label: "Kanan" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChangeNavSide(opt.id)}
                    className={`min-h-[38px] rounded-[10px] border font-semibold transition ${
                      navSide === opt.id
                        ? "border-[#2A5C45] bg-[#2A5C45] text-white"
                        : "border-[#D4C2A3] bg-[#FFFDF9] text-[#3E2B1E] hover:bg-[#EFE5CE]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 font-semibold text-[#3E2B1E]">Model Gerak</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "stick" as const, label: "Stick" },
                  { id: "dpad" as const, label: "Panah" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChangeNavMode(opt.id)}
                    className={`min-h-[38px] rounded-[10px] border font-semibold transition ${
                      navMode === opt.id
                        ? "border-[#2A5C45] bg-[#2A5C45] text-white"
                        : "border-[#D4C2A3] bg-[#FFFDF9] text-[#3E2B1E] hover:bg-[#EFE5CE]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Virtual Pad Desktop Toggle */}
          <div>
            <p className="mb-1.5 font-semibold text-[#3E2B1E]">Joystick di Desktop</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { val: false, label: "Otomatis (HP)" },
                { val: true, label: "Selalu Tampil" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => onToggleVirtualPadOnDesktop(opt.val)}
                  className={`min-h-[38px] rounded-[10px] border font-semibold transition ${
                    showVirtualPadOnDesktop === opt.val
                      ? "border-[#2A5C45] bg-[#2A5C45] text-white"
                      : "border-[#D4C2A3] bg-[#FFFDF9] text-[#3E2B1E] hover:bg-[#EFE5CE]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Replay Drone Intro */}
          {onReplayIntro && (
            <button
              type="button"
              onClick={onReplayIntro}
              className="flex min-h-[40px] w-full items-center justify-center gap-2 rounded-[12px] border border-[#C8B490] bg-[#EFE5CE]/80 font-semibold text-[#3E2B1E] transition hover:bg-[#E5D7B8]"
            >
              <Compass className="h-4 w-4 text-[#2A5C45]" aria-hidden="true" />
              Putar Ulang Drone View
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="mt-4 flex flex-col gap-2 border-t border-[#DED0B6] pt-4 text-xs font-semibold">
          <Link
            href={`/katalog/${themeSlug}`}
            className="inline-flex min-h-[42px] items-center justify-center rounded-[12px] border border-[#D4C2A3] bg-[#FFFDF9] text-[#3E2B1E] transition hover:bg-[#EFE5CE]"
          >
            Kembali ke Detail Tema
          </Link>
          <Link
            href={`/buat?tema=${themeSlug}`}
            className="inline-flex min-h-[44px] items-center justify-center rounded-[12px] bg-[#AD4B2C] text-white shadow-sm transition hover:bg-[#963C20]"
          >
            Pakai Tema Ini
          </Link>
        </div>
      </div>
    </div>
  );
}
