"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowUpRight, RefreshCw, Sparkles } from "lucide-react";
import type { ThemeItem } from "@/lib/schemas";

const DesaAsriExperience = dynamic(
  () =>
    import("./desa-world/DesaAsriExperience").then(
      (mod) => mod.DesaAsriExperience,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#12261C] text-sm font-semibold text-[#F8F2E6]">
        Menyiapkan pengalaman interaktif 3D...
      </div>
    ),
  },
);

const GachaStrukExperience = dynamic(
  () =>
    import("./gacha-world/GachaStrukExperience").then(
      (mod) => mod.GachaStrukExperience,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#F4ECE0] text-sm font-semibold text-[#221914]">
        Menyiapkan mesin gacha &amp; printer struk...
      </div>
    ),
  },
);

const CelestialWeddingExperience = dynamic(
  () =>
    import("./celestial-world/CelestialWeddingExperience").then(
      (mod) => mod.CelestialWeddingExperience,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#080D24] text-sm font-semibold text-[#FAF6EE]">
        Menyiapkan Istana Awan 3D...
      </div>
    ),
  },
);
import { getDemoPayload } from "@/data/demoContent";
import { isDarkHex } from "@/lib/color";
import { EnvelopeCover } from "./modules/EnvelopeCover";
import { PassphraseGate } from "./modules/PassphraseGate";
import { FlipPhotoDeck } from "./modules/FlipPhotoDeck";
import { VoiceNotePlayer } from "./modules/VoiceNotePlayer";
import { MemoryQuiz } from "./modules/MemoryQuiz";
import { ScratchRevealCard } from "./modules/ScratchRevealCard";
import { WeddingEventModules } from "./modules/WeddingEventModules";

interface DemoExperienceClientProps {
  theme: ThemeItem;
}

const FONT_MOOD: Record<ThemeItem["typographyStyle"], string> = {
  "editorial-serif": "font-editorial-alt",
  "playful-display": "font-display-alt",
  "handwritten-warm": "font-hand",
  "nocturne-classic": "font-editorial-alt",
  "modern-clean": "font-sans",
  "nusantara-regal": "font-editorial-alt",
};

export function DemoExperienceClient({ theme }: DemoExperienceClientProps) {
  const isDesa3d =
    theme.demoArchetype === "desa-3d-wedding" ||
    theme.demoArchetype === "desa-3d-kado";

  const searchParams = useSearchParams();
  const guestName = searchParams.get("to");

  const payload = getDemoPayload(theme);
  const { accent, base, soft } = theme.palette;
  const darkBase = isDarkHex(base);
  const darkAccent = isDarkHex(accent);
  const inkOnBase = darkBase ? "#F7F4EC" : "#18181D";

  const [unlocked, setUnlocked] = useState(!payload.requiresPassphrase);
  const [opened, setOpened] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  if (isDesa3d) {
    return (
      <DesaAsriExperience
        theme={theme}
        mode={theme.demoArchetype === "desa-3d-kado" ? "kado" : "wedding"}
      />
    );
  }

  if (theme.demoArchetype === "gacha-struk") {
    return <GachaStrukExperience theme={theme} />;
  }

  if (theme.demoArchetype === "celestial-3d-wedding") {
    return <CelestialWeddingExperience theme={theme} />;
  }

  const headingFontClass = FONT_MOOD[theme.typographyStyle];

  return (
    <div
      data-product-theme={theme.slug}
      className="min-h-[100dvh]"
      style={{ backgroundColor: base, color: inkOnBase }}
    >
      {/* Persistent Slim Top Demo Bar */}
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/92 text-[#16201B] backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1040px] items-center justify-between gap-2 px-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <Link
              href={`/katalog/${theme.slug}`}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-[#E4E2DC] bg-[#F8F7F4] px-3 text-xs font-semibold text-[#16201B] hover:bg-[#EFECE5]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Kembali</span>
            </Link>
            <span className="truncate text-xs font-semibold">
              DEMO — {theme.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setReducedMotion((prev) => !prev)}
              aria-pressed={reducedMotion}
              className={`inline-flex h-9 items-center rounded-full border px-3 text-xs font-semibold ${
                reducedMotion
                  ? "border-[#1B5E47] bg-[#E6F2EC] text-[#1B5E47]"
                  : "border-[#E4E2DC] bg-white text-[#526058]"
              }`}
            >
              Kurangi gerakan
            </button>

            <Link
              href={`/buat?tema=${theme.slug}`}
              className="inline-flex h-9 items-center gap-1 rounded-full bg-[#1B5E47] px-3.5 text-xs font-semibold text-white hover:bg-[#144A37]"
            >
              Pakai Tema Ini
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Scoped Product Runtime */}
      {!unlocked && payload.requiresPassphrase && payload.passphraseCode ? (
        <PassphraseGate
          expectedCode={payload.passphraseCode}
          hint={payload.passphraseHint ?? "1402"}
          accent={accent}
          base={base}
          soft={soft}
          onUnlock={() => setUnlocked(true)}
        />
      ) : !opened ? (
        <EnvelopeCover
          theme={theme}
          guestName={guestName}
          eyebrow={payload.eyebrow}
          title={payload.coverTitle}
          subtitle={payload.coverSubtitle}
          reducedMotion={reducedMotion}
          onOpen={() => setOpened(true)}
          onSkip={() => setOpened(true)}
        />
      ) : (
        <main className="mx-auto max-w-[820px] space-y-10 px-4 py-10 sm:px-6 sm:py-14">
          {/* Chapter 1: Hero Letter */}
          <section
            className="rounded-[28px] border p-6 shadow-sm sm:p-10"
            style={{
              backgroundColor: darkBase ? soft : "#FFFFFF",
              borderColor: `${accent}3D`,
              color: inkOnBase,
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                style={{ backgroundColor: accent, color: darkAccent ? "#FFFFFF" : "#18181D" }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {payload.eyebrow}
              </span>

              {payload.daysTogether && (
                <span className="text-xs font-semibold opacity-80 tabular-nums">
                  {payload.daysTogether} Hari Bersama
                </span>
              )}
            </div>

            {guestName && (
              <p className="mt-4 text-sm font-semibold" style={{ color: accent }}>
                Teruntuk {guestName},
              </p>
            )}

            <h1 className={`mt-4 text-3xl leading-tight font-semibold sm:text-4xl ${headingFontClass}`}>
              {payload.letterTitle}
            </h1>

            <div className="mt-5 space-y-4 text-base leading-relaxed opacity-90">
              {payload.letterParagraphs.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>

            <p className="mt-6 text-sm font-semibold italic" style={{ color: accent }}>
              {payload.letterSignOff}
            </p>
          </section>

          {/* Chapter 2: Voice Note */}
          <section>
            <VoiceNotePlayer
              title={payload.voiceNoteTitle}
              durationSec={payload.voiceNoteDurationSec}
              transcript={payload.voiceNoteTranscript}
              accent={accent}
              soft={darkBase ? "#F1EFEA" : soft}
            />
          </section>

          {/* Chapter 3: Flip Photos */}
          <section className="space-y-4">
            <div>
              <h2 className={`text-2xl font-semibold sm:text-3xl ${headingFontClass}`}>
                Kenangan &amp; Catatan di Balik Foto
              </h2>
              <p className="mt-1 text-sm opacity-75">
                Ketuk tombol “Balik foto” di tiap kartu untuk membaca cerita tersembunyi.
              </p>
            </div>
            <FlipPhotoDeck
              photos={payload.photos}
              accent={accent}
              base={base}
              soft={soft}
              reducedMotion={reducedMotion}
            />
          </section>

          {/* Chapter 4: Optional Memory Quiz */}
          {payload.quiz && (
            <section>
              <MemoryQuiz
                questions={payload.quiz}
                accent={accent}
                soft={darkBase ? "#F3EFE8" : soft}
              />
            </section>
          )}

          {/* Chapter 5: Wedding / Event Modules OR Scratch Reveal */}
          {payload.eventDetails ? (
            <WeddingEventModules
              line={theme.line}
              eventDetails={payload.eventDetails}
              accent={accent}
              soft={darkBase ? "#F1EFEA" : soft}
            />
          ) : (
            <section>
              <ScratchRevealCard
                prompt={payload.scratchPrompt}
                secretTitle={payload.scratchSecretTitle}
                secretBody={payload.scratchSecretBody}
                accent={accent}
                soft={darkBase ? "#F7EBDD" : soft}
                reducedMotion={reducedMotion}
              />
            </section>
          )}

          {/* Quiet Replay & Brand Attribution Bar */}
          <footer className="flex flex-col items-center justify-between gap-4 border-t border-black/15 pt-8 text-center sm:flex-row sm:text-left">
            <button
              type="button"
              onClick={() => {
                setOpened(false);
                if (payload.requiresPassphrase) setUnlocked(false);
              }}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-current/25 px-4 text-xs font-semibold hover:opacity-80"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Ulangi dari awal
            </button>

            <Link
              href="/"
              className="text-xs opacity-70 hover:opacity-100 underline underline-offset-4"
            >
              Dirangkai dengan Kado Digital
            </Link>
          </footer>
        </main>
      )}
    </div>
  );
}
