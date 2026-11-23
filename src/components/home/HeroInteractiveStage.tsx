"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Heart, Lock, RefreshCw, Sparkles } from "lucide-react";

type StagePresetKey = "anniversary" | "ulang-tahun" | "undangan";
type StageState = "idle" | "opening" | "revealed";

interface StagePreset {
  id: StagePresetKey;
  tabLabel: string;
  themeSlug: string;
  themeName: string;
  envelopeTitle: string;
  envelopeSubtitle: string;
  sealLabel: string;
  accent: string;
  surface: string;
  soft: string;
  dark: boolean;
  photoTitle: string;
  photoDate: string;
  backNote: string;
  mainMessage: string;
}

const STAGE_PRESETS: StagePreset[] = [
  {
    id: "anniversary",
    tabLabel: "Anniversary",
    themeSlug: "linen-letter",
    themeName: "Linen Letter",
    envelopeTitle: "Untuk Nadya, Tahun ke-2",
    envelopeSubtitle: "Dibuka pelan-pelan ya, ada 3 foto & pesan kecil.",
    sealLabel: "Buka contoh kado",
    accent: "#9E3B4B",
    surface: "#FBF5EE",
    soft: "#F2DFDB",
    dark: false,
    photoTitle: "Kopi Pagi di Braga",
    photoDate: "14 Februari 2025",
    backNote:
      "Waktu itu kita kehujanan 40 menit cuma gara-gara nyari es kopi susu. Terima kasih sudah selalu bikin hal biasa terasa paling spesial.",
    mainMessage: "Selamat 2 tahun tumbuh bareng, Nadya. Masih banyak kota yang mau kita datangi.",
  },
  {
    id: "ulang-tahun",
    tabLabel: "Ulang Tahun",
    themeSlug: "birthday-unwrapped",
    themeName: "Birthday Unwrapped",
    envelopeTitle: "Happy 24th, Raka!",
    envelopeSubtitle: "Tarik pita kado ini untuk lihat kartu & kuis seru.",
    sealLabel: "Buka contoh kado",
    accent: "#3D3BFF",
    surface: "#FFF9F2",
    soft: "#FFE8A3",
    dark: false,
    photoTitle: "Makan Malam Dadakan",
    photoDate: "20 Oktober 2026",
    backNote:
      "Catatan rahasia: voucher traktir ramen pilihan kamu sudah menunggu di bab terakhir demo penuh!",
    mainMessage: "Panjang umur, sehat terus, dan semoga tahun ini semua rencanamu kejadian satu per satu.",
  },
  {
    id: "undangan",
    tabLabel: "Undangan",
    themeSlug: "serene-garden",
    themeName: "Serene Garden",
    envelopeTitle: "The Wedding of Alya & Dimas",
    envelopeSubtitle: "Kepada Yth. Sahabat Dekat — Minggu, 14 Feb 2027",
    sealLabel: "Buka contoh undangan",
    accent: "#3F6B54",
    surface: "#FBFBF8",
    soft: "#E3ECE5",
    dark: false,
    photoTitle: "Bab 01 · Jakarta, 2022",
    photoDate: "Akad & Resepsi · 10.00 WIB",
    backNote:
      "Detail lokasi Google Maps, konfirmasi kehadiran RSVP, dan kartu check-in QR sudah siap di demo penuh.",
    mainMessage: "Merupakan kehormatan bagi kami apabila kamu berkenan hadir dan memberi doa restu.",
  },
];

interface HeroInteractiveStageProps {
  externalTriggerCount: number;
}

export function HeroInteractiveStage({ externalTriggerCount }: HeroInteractiveStageProps) {
  const [activeKey, setActiveKey] = useState<StagePresetKey>("anniversary");
  const [stageState, setStageState] = useState<StageState>("idle");
  const [flipped, setFlipped] = useState(false);

  const activePreset = STAGE_PRESETS.find((item) => item.id === activeKey) ?? STAGE_PRESETS[0];

  const triggerOpen = () => {
    if (stageState === "revealed") return;
    setStageState("opening");
    window.setTimeout(() => {
      setStageState("revealed");
    }, 520);
  };

  useEffect(() => {
    if (externalTriggerCount > 0) {
      setFlipped(false);
      setStageState("opening");
      const timer = window.setTimeout(() => {
        setStageState("revealed");
      }, 520);
      return () => window.clearTimeout(timer);
    }
  }, [externalTriggerCount]);

  const handleSelectTab = (key: StagePresetKey) => {
    setActiveKey(key);
    setStageState("idle");
    setFlipped(false);
  };

  const handleReplay = () => {
    setFlipped(false);
    setStageState("idle");
  };

  return (
    <div
      id="hero-demo-stage"
      className="rounded-[28px] border border-hairline bg-subtle p-4 shadow-[var(--shadow-stage)] sm:p-6"
    >
      {/* Top Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
        <div
          role="tablist"
          aria-label="Pilih contoh demo interaktif"
          className="inline-flex flex-wrap gap-1.5 rounded-full border border-hairline bg-surface p-1"
        >
          {STAGE_PRESETS.map((preset) => {
            const selected = preset.id === activeKey;
            return (
              <button
                key={preset.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => handleSelectTab(preset.id)}
                className={`min-h-[36px] rounded-full px-3.5 text-xs font-semibold transition-colors duration-150 sm:text-sm ${
                  selected
                    ? "bg-emerald-brand text-white"
                    : "text-muted hover:text-ink"
                }`}
              >
                {preset.tabLabel}
              </button>
            );
          })}
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted border border-hairline">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          Tema: {activePreset.themeName}
        </span>
      </div>

      {/* Product-Scoped Interactive Stage (uses theme's own colors) */}
      <div
        className="relative flex min-h-[380px] flex-col justify-between overflow-hidden rounded-[22px] border border-hairline p-5 transition-colors duration-300 sm:min-h-[410px] sm:p-7"
        style={{ backgroundColor: activePreset.surface }}
      >
        <div className="flex items-center justify-between text-xs font-medium text-[#52505A]">
          <span>Contoh Interaktif Langsung</span>
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: activePreset.soft, color: "#18181D" }}>
            <Lock className="h-3 w-3" />
            Privat · Tanpa Login
          </span>
        </div>

        {/* STATE 1 & 2: IDLE / OPENING ENVELOPE */}
        {stageState !== "revealed" && (
          <div className="my-auto flex flex-col items-center py-6 text-center">
            <div
              className={`relative w-full max-w-[330px] rounded-2xl border bg-white p-6 shadow-md transition-all duration-500 ${
                stageState === "opening" ? "-translate-y-3 scale-[1.02] opacity-80" : ""
              }`}
              style={{ borderColor: `${activePreset.accent}44` }}
            >
              {/* Envelope flap graphic */}
              <div
                className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm transition-transform duration-500 ${
                  stageState === "opening" ? "scale-110 rotate-12" : ""
                }`}
                style={{ backgroundColor: activePreset.accent }}
              >
                {activePreset.id === "anniversary" && <Heart className="h-5 w-5" />}
                {activePreset.id === "ulang-tahun" && <Sparkles className="h-5 w-5" />}
                {activePreset.id === "undangan" && <span>A&amp;D</span>}
              </div>

              <p
                className="text-xs font-semibold tracking-[0.14em] uppercase"
                style={{ color: activePreset.accent }}
              >
                {activePreset.tabLabel}
              </p>
              <h3 className="mt-2 font-editorial-alt text-2xl font-semibold text-[#18181E]">
                {activePreset.envelopeTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#575460]">
                {activePreset.envelopeSubtitle}
              </p>

              <button
                type="button"
                onClick={triggerOpen}
                disabled={stageState === "opening"}
                className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full px-5 text-sm font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.98]"
                style={{ backgroundColor: activePreset.accent }}
              >
                {stageState === "opening" ? "Membuka sampul..." : activePreset.sealLabel}
              </button>
            </div>
            <p className="mt-3 text-xs text-[#64606E]">
              Klik atau tekan Enter pada tombol di atas untuk mencoba interaksi buka kado.
            </p>
          </div>
        )}

        {/* STATE 3: REVEALED CARD WITH FLIP PHOTO */}
        {stageState === "revealed" && (
          <div className="my-auto grid items-center gap-5 py-3 sm:grid-cols-12">
            {/* Flip Photo Card */}
            <div className="sm:col-span-6">
              <div className="perspective-1000">
                <div
                  className={`preserve-3d relative min-h-[218px] w-full transition-transform duration-500 ${
                    flipped ? "rotate-y-180" : ""
                  }`}
                >
                  {/* Front */}
                  <div
                    className="backface-hidden absolute inset-0 flex flex-col justify-between rounded-2xl border bg-white p-4 shadow-sm"
                    style={{ borderColor: `${activePreset.accent}35` }}
                  >
                    <div
                      className="flex h-28 flex-col items-center justify-center rounded-xl p-3 text-center"
                      style={{ backgroundColor: activePreset.soft }}
                    >
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-[#4B4854]">
                        {activePreset.photoDate}
                      </span>
                      <p className="mt-1 font-editorial-alt text-xl font-semibold text-[#1A1821]">
                        {activePreset.photoTitle}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFlipped(true)}
                      className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-full border text-xs font-semibold transition-colors hover:bg-black/5"
                      style={{
                        borderColor: `${activePreset.accent}55`,
                        color: activePreset.accent,
                      }}
                    >
                      Balik foto untuk baca catatan →
                    </button>
                  </div>

                  {/* Back */}
                  <div
                    className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between rounded-2xl border p-4 shadow-sm"
                    style={{
                      backgroundColor: activePreset.soft,
                      borderColor: `${activePreset.accent}45`,
                    }}
                  >
                    <div>
                      <span
                        className="text-[11px] font-bold tracking-wider uppercase"
                        style={{ color: activePreset.accent }}
                      >
                        Catatan di balik foto
                      </span>
                      <p className="mt-2 text-sm leading-relaxed text-[#1B1922]">
                        “{activePreset.backNote}”
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFlipped(false)}
                      className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-full bg-white px-3 text-xs font-semibold text-[#1B1922] shadow-xs"
                    >
                      ← Lihat sisi depan foto
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Revealed Message */}
            <div className="flex flex-col justify-between sm:col-span-6">
              <div>
                <span
                  className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                  style={{ backgroundColor: activePreset.soft, color: "#18181D" }}
                >
                  Bab 1 Terbuka
                </span>
                <h3 className="mt-2 font-editorial-alt text-2xl leading-snug font-semibold text-[#18181E]">
                  {activePreset.envelopeTitle}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4F4B58]">
                  {activePreset.mainMessage}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Link
                  href={`/demo/${activePreset.themeSlug}`}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: activePreset.accent }}
                >
                  Buka demo penuh
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={handleReplay}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#D4CFC7] bg-white px-3.5 text-xs font-semibold text-[#18181E] hover:bg-[#F5F2EC]"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Ulangi
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-black/10 pt-3 text-xs text-[#5B5864]">
          <span>Tap, klik, atau keyboard support</span>
          <Link
            href={`/demo/${activePreset.themeSlug}`}
            className="font-semibold underline underline-offset-4 hover:text-[#18181E]"
          >
            Mainkan versi lengkap →
          </Link>
        </div>
      </div>
    </div>
  );
}
