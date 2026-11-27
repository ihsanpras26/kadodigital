"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Disc3,
  Printer,
  SlidersHorizontal,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { ThemeItem } from "@/lib/schemas";
import { GachaAudioEngine } from "./gachaAudioEngine";
import {
  getGachaPayload,
  type GachaCapsuleItem,
  type GachaMode,
} from "./gachaData";
import {
  decodeGiftOverrides,
  readableNameFromSlug,
  type GachaCustomOverrides,
} from "./gachaShareCodec";
import { GachaDomePhysics, type MachinePhase } from "./GachaDomePhysics";
import { ExclusiveArrivalGate } from "./ExclusiveArrivalGate";
import { PersonalizeGiftDrawer } from "./PersonalizeGiftDrawer";
import { CapsuleOpenOverlay } from "./CapsuleOpenOverlay";
import { ThermalReceiptPrinter } from "./ThermalReceiptPrinter";

interface GachaStrukExperienceProps {
  theme: ThemeItem;
  exclusiveMode?: boolean;
  slugHint?: string;
}

export function GachaStrukExperience({
  theme,
  exclusiveMode = false,
  slugHint,
}: GachaStrukExperienceProps) {
  const searchParams = useSearchParams();
  const encodedParam = searchParams.get("g");
  const guestQuery = searchParams.get("to");
  const modeParam = searchParams.get("mode");
  const isEmbed = searchParams.get("embed") === "1";
  const startOpened = searchParams.get("open") === "1";
  const hideStudioChrome = exclusiveMode || isEmbed;

  const initialOverrides = useMemo<GachaCustomOverrides>(() => {
    const decoded = decodeGiftOverrides(encodedParam);
    if (decoded) {
      return {
        ...decoded,
        recipient:
          decoded.recipient ||
          (slugHint ? readableNameFromSlug(slugHint) : "Nadya Aulia"),
        sender: decoded.sender || "Raka Pratama",
      };
    }

    const fallbackMode: GachaMode =
      modeParam === "ultah" || modeParam === "sahabat" ? modeParam : "anniversary";
    const preset = getGachaPayload(fallbackMode);
    const polaroid = preset.capsules.find((c) => c.kind === "polaroid");
    const voice = preset.capsules.find((c) => c.kind === "voicenote");
    const voucher = preset.capsules.find((c) => c.kind === "voucher");

    return {
      mode: fallbackMode,
      recipient:
        guestQuery?.trim() ||
        (slugHint ? readableNameFromSlug(slugHint) : preset.defaultRecipient),
      sender: preset.senderName,
      dateLabel: preset.defaultDateLabel,
      pinCode: undefined,
      pinHint: preset.defaultPinHint,
      polaroidCaption: polaroid?.frontCaption,
      polaroidSecret: polaroid?.backNote,
      voiceMessage: voice ? voice.transcriptLines.join("\n") : undefined,
      voucherTitle: voucher?.voucherHeadline,
      voucherDetail: voucher?.voucherDetail,
    };
  }, [encodedParam, guestQuery, modeParam, slugHint]);

  const [overrides, setOverrides] = useState<GachaCustomOverrides>(initialOverrides);
  const [composerOpen, setComposerOpen] = useState(false);

  const payload = useMemo(
    () => getGachaPayload(overrides.mode, overrides),
    [overrides],
  );

  const recipientName = overrides.recipient.trim() || payload.defaultRecipient;
  const senderName = overrides.sender.trim() || payload.senderName;
  const displayDate = overrides.dateLabel?.trim() || payload.defaultDateLabel;

  const audioRef = useRef<GachaAudioEngine | null>(null);
  const timersRef = useRef<number[]>([]);

  const [unsealed, setUnsealed] = useState(startOpened);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [sfxEnabled, setSfxEnabled] = useState(true);

  const [machinePhase, setMachinePhase] = useState<MachinePhase>("idle");
  const [remainingCoins, setRemainingCoins] = useState(payload.capsules.length);
  const [collectedIds, setCollectedIds] = useState<string[]>([]);
  const [pendingCapsule, setPendingCapsule] = useState<GachaCapsuleItem | null>(null);
  const [overlayState, setOverlayState] = useState<{
    capsule: GachaCapsuleItem;
    skipCrackIntro: boolean;
  } | null>(null);
  const [printerOpen, setPrinterOpen] = useState(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const scheduleTimer = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
  }, []);

  useEffect(() => {
    const engine = new GachaAudioEngine();
    audioRef.current = engine;
    return () => {
      clearTimers();
      engine.dispose();
      audioRef.current = null;
    };
  }, [clearTimers]);

  const resetMachineState = useCallback(
    (nextMode: GachaMode) => {
      clearTimers();
      audioRef.current?.stopVoiceNoteClip();
      audioRef.current?.setMode(nextMode);
      const nextPayload = getGachaPayload(nextMode);
      setMachinePhase("idle");
      setRemainingCoins(nextPayload.capsules.length);
      setCollectedIds([]);
      setPendingCapsule(null);
      setOverlayState(null);
      setPrinterOpen(false);
    },
    [clearTimers],
  );

  const handleApplyOverrides = useCallback(
    (next: GachaCustomOverrides) => {
      setOverrides(next);
      resetMachineState(next.mode);
    },
    [resetMachineState],
  );

  const handleUnlockArrival = () => {
    audioRef.current?.start();
    audioRef.current?.setMode(overrides.mode);
    audioRef.current?.setMusicEnabled(musicEnabled);
    audioRef.current?.setSfxEnabled(sfxEnabled);
    setUnsealed(true);
  };

  const handleToggleMusic = () => {
    const next = !musicEnabled;
    setMusicEnabled(next);
    audioRef.current?.start();
    audioRef.current?.setMusicEnabled(next);
  };

  const handleToggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    audioRef.current?.setSfxEnabled(next);
    if (next) {
      audioRef.current?.playFlipCard();
    }
  };

  const handleInsertCoin = useCallback(() => {
    if (machinePhase !== "idle" || remainingCoins <= 0) return;
    audioRef.current?.start();
    audioRef.current?.playCoinInsert();
    setMachinePhase("inserting-coin");

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    scheduleTimer(() => {
      setMachinePhase("coin-ready");
    }, prefersReduced ? 180 : 480);
  }, [machinePhase, remainingCoins, scheduleTimer]);

  const handleStartCrank = useCallback(() => {
    if (machinePhase !== "coin-ready") return;
    const nextCapsule = payload.capsules[collectedIds.length];
    if (!nextCapsule) return;
    setPendingCapsule(nextCapsule);
    setRemainingCoins((c) => Math.max(0, c - 1));
    setMachinePhase("cranking");
  }, [machinePhase, payload.capsules, collectedIds.length]);

  const handleCrankComplete = useCallback(() => {
    setPendingCapsule((curPending) => {
      const cap = curPending ?? payload.capsules[collectedIds.length] ?? null;
      if (!curPending && cap) {
        setRemainingCoins((c) => Math.max(0, c - 1));
      }
      return cap;
    });

    setMachinePhase("dispensing");
    audioRef.current?.playChuteDrop();

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const dropMs = prefersReduced ? 200 : 480;

    scheduleTimer(() => {
      setMachinePhase("ready-to-crack");
    }, dropMs);
  }, [payload.capsules, collectedIds.length, scheduleTimer]);

  const handleCrackDispensed = useCallback(() => {
    if (machinePhase !== "ready-to-crack" || !pendingCapsule) return;
    setOverlayState({ capsule: pendingCapsule, skipCrackIntro: false });
  }, [machinePhase, pendingCapsule]);

  const handleFinishCapsule = useCallback(
    (capsuleId: string) => {
      setOverlayState(null);
      setCollectedIds((prev) => {
        const next = prev.includes(capsuleId) ? prev : [...prev, capsuleId];
        setPendingCapsule((curPending) => {
          if (curPending?.id === capsuleId) {
            setMachinePhase(
              next.length >= payload.capsules.length ? "all-done" : "idle",
            );
            return null;
          }
          return curPending;
        });
        return next;
      });
    },
    [payload.capsules.length],
  );

  const handleReopenFromShelf = (capsule: GachaCapsuleItem) => {
    if (!collectedIds.includes(capsule.id)) return;
    audioRef.current?.playFlipCard();
    setOverlayState({ capsule, skipCrackIntro: true });
  };

  const handleOpenPrinter = () => {
    if (collectedIds.length === 0) return;
    audioRef.current?.start();
    setPrinterOpen(true);
  };

  const allCollected = collectedIds.length >= payload.capsules.length;
  const collectedCapsules = useMemo(
    () => payload.capsules.filter((c) => collectedIds.includes(c.id)),
    [payload.capsules, collectedIds],
  );

  return (
    <div
      data-gacha-world={theme.slug}
      className="relative flex min-h-[100dvh] flex-col overflow-x-hidden"
    >
      {/* Whisper Minimal Floating Top Bar (zero SaaS chrome in exclusive recipient links!) */}
      <header className="relative z-30 mx-auto flex h-16 w-full max-w-[1040px] items-center justify-between gap-2 px-4 sm:px-6">
        {hideStudioChrome ? (
          <div className="min-w-0">
            <p className="gacha-serif truncate text-lg italic text-[#F7DFB0]">
              Untuk {recipientName}{" "}
              <span className="font-sans text-xs not-italic text-[#B8A187]">
                · dari {senderName}
              </span>
            </p>
          </div>
        ) : (
          <div className="flex min-w-0 items-center gap-2">
            <Link
              href={`/katalog/${theme.slug}`}
              aria-label="Kembali ke katalog"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-[#E8C16E]/25 bg-[#211813]/85 px-3 text-xs font-medium text-[#DFCEB2] transition hover:border-[#E8C16E]/55 hover:text-[#FAF4E8]"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Katalog</span>
            </Link>

            <button
              type="button"
              onClick={() => setComposerOpen(true)}
              className="gacha-brass-btn inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-xs font-bold"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Personalisasi &amp; Buat Link</span>
            </button>
          </div>
        )}

        {/* Quiet Tactile Audio Pills */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleToggleMusic}
            aria-pressed={musicEnabled}
            aria-label={musicEnabled ? "Matikan musik kafe" : "Nyalakan musik kafe"}
            className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition ${
              musicEnabled
                ? "border-[#2D6A4F] bg-[#1F4A37] text-[#F4FBF7]"
                : "border-[#E8C16E]/25 bg-[#211813]/80 text-[#B8A187]"
            }`}
          >
            <Disc3
              className={`h-3.5 w-3.5 ${musicEnabled && unsealed ? "gacha-reel-spinning" : ""}`}
              aria-hidden="true"
            />
            <span className="hidden sm:inline">Musik</span>
          </button>

          <button
            type="button"
            onClick={handleToggleSfx}
            aria-pressed={sfxEnabled}
            aria-label={sfxEnabled ? "Bisukan efek suara" : "Aktifkan efek suara"}
            className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition ${
              sfxEnabled
                ? "border-[#E8C16E]/35 bg-[#261D18] text-[#FAF4E8]"
                : "border-[#E8C16E]/20 bg-[#1B1411] text-[#8A7664]"
            }`}
          >
            {sfxEnabled ? (
              <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">SFX</span>
          </button>
        </div>
      </header>

      {/* Main Intimate Spotlight Desk */}
      <main className="mx-auto flex w-full max-w-[1000px] flex-1 flex-col justify-center px-4 pb-6 pt-1 sm:px-6">
        <div className="grid items-center gap-6 md:grid-cols-[336px_minmax(0,1fr)] md:gap-7 lg:grid-cols-[364px_minmax(0,1fr)] lg:gap-11">
          {/* LEFT: Sculpted Keepsake Gachapon & Draggable Brass Coin Tray */}
          <div className="flex flex-col items-center">
            <GachaDomePhysics
              badgeLabel={payload.machineBadge}
              phase={machinePhase}
              remainingCoins={remainingCoins}
              collectedIds={collectedIds}
              allCapsules={payload.capsules}
              activeCapsule={pendingCapsule}
              audioEngine={audioRef.current}
              onInsertCoin={handleInsertCoin}
              onStartCrank={handleStartCrank}
              onCrankComplete={handleCrankComplete}
              onCrackDispensed={handleCrackDispensed}
            />
          </div>

          {/* RIGHT: Intimate Dedication, Velvet Socket Tray & Thermal Receipt Printer */}
          <div className="flex flex-col gap-5">
            {/* Editorial Dedication Heading (no eyebrow slop!) */}
            <div className="px-1">
              <p className="gacha-receipt-font text-[10px] font-bold tracking-[0.18em] text-[#D6A54B] uppercase">
                {displayDate} · OLEH {senderName.toUpperCase()}
              </p>
              <h1 className="gacha-serif mt-2 text-3xl leading-[1.1] font-normal italic text-[#FAF4E8] sm:text-[40px]">
                {payload.welcomeTitle}
              </h1>
              <p className="mt-2.5 max-w-prose text-sm leading-relaxed text-[#D7C6B0]">
                {payload.welcomeSubtitle}
              </p>
            </div>

            {/* Recessed Velvet Collector Sockets */}
            <div className="gacha-velvet-panel rounded-[22px] p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="gacha-display text-base font-bold text-[#FAF4E8]">
                  Baki Koleksi Kapsul
                </h3>
                <span className="gacha-receipt-font text-[10px] font-bold text-[#E8C16E]">
                  {collectedIds.length === 0
                    ? `${payload.capsules.length} TERSEMBUNYI`
                    : "KETUK UNTUK BUKA ULANG"}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {payload.capsules.map((cap) => {
                  const unlocked = collectedIds.includes(cap.id);
                  return (
                    <button
                      key={cap.id}
                      type="button"
                      onClick={() => handleReopenFromShelf(cap)}
                      disabled={!unlocked}
                      className={`flex items-center gap-3 rounded-[16px] border p-3 text-left transition ${
                        unlocked
                          ? "cursor-pointer border-[#E8C16E]/45 bg-[#2A1F1A] shadow-md hover:-translate-y-0.5 hover:border-[#F7DC96]"
                          : "cursor-default border-dashed border-[#E8C16E]/18 bg-[#16110E]/75"
                      }`}
                    >
                      <span
                        className={`relative flex h-11 w-11 shrink-0 flex-col overflow-hidden rounded-full border ${
                          unlocked
                            ? "border-[#E8C16E] shadow-[0_4px_12px_rgba(0,0,0,0.45)]"
                            : "border-[#544034] opacity-40"
                        }`}
                      >
                        <span
                          className="h-1/2 w-full"
                          style={{
                            backgroundColor: unlocked ? cap.shellColor : "#362922",
                          }}
                        />
                        <span className="block h-[2px] w-full bg-[#C89436]" />
                        <span className="h-1/2 w-full bg-[#FAF4E8]" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="gacha-receipt-font text-[10px] font-bold text-[#D6A54B]">
                            {cap.serial}
                          </span>
                          <span className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#DFCEB2] uppercase">
                            {unlocked ? cap.rarityLabel : "Terkunci"}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs font-semibold text-[#FAF4E8]">
                          {unlocked ? cap.title : "Masih di dalam kubah"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Thermal Receipt Station Card */}
            <div className="gacha-velvet-panel rounded-[22px] p-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="gacha-receipt-font rounded border border-[#E8C16E]/45 bg-[#120E0C] px-2 py-0.5 text-[10px] font-bold text-[#E8C16E] uppercase">
                      MESIN STRUK THERMAL
                    </span>
                    {allCollected && (
                      <span className="gacha-receipt-font rounded bg-[#1F4A37] px-2 py-0.5 text-[10px] font-bold text-[#A3F0C1]">
                        SIAP CETAK
                      </span>
                    )}
                  </div>
                  <h3 className="gacha-display mt-2 text-lg font-bold text-[#FAF4E8]">
                    {allCollected
                      ? "Keempat kapsul terbuka, cetak struk kenanganmu"
                      : "Cetak struk rangkuman & poster Story 9:16"}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#C7B398]">
                    Struk berisi catatan momen pribadi, stempel merah lunas, dan gambar
                    poster 9:16 PNG siap disimpan.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenPrinter}
                  disabled={collectedIds.length === 0}
                  className={`inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-[14px] px-5 text-sm font-bold ${
                    allCollected
                      ? "gacha-brass-btn"
                      : "border border-[#E8C16E]/30 bg-[#241B17] text-[#DFCEB2] transition hover:border-[#E8C16E]/60 disabled:opacity-45"
                  }`}
                >
                  <Printer className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {allCollected ? "Cetak Struk" : `Pratinjau (${collectedIds.length}/4)`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Arrival Cotton Pass + PIN + Hold-to-Unseal Wax Seal */}
      {!unsealed && (
        <ExclusiveArrivalGate
          recipientName={recipientName}
          senderName={senderName}
          dateLabel={displayDate}
          pinCode={overrides.pinCode}
          pinHint={overrides.pinHint ?? payload.defaultPinHint}
          exclusiveMode={exclusiveMode}
          audioEngine={audioRef.current}
          onUnlockSuccess={handleUnlockArrival}
        />
      )}

      {/* Personalization Composer Drawer (hidden on exclusive /k/ links!) */}
      {!exclusiveMode && composerOpen && (
        <PersonalizeGiftDrawer
          currentOverrides={overrides}
          onApplyPreview={handleApplyOverrides}
          onClose={() => setComposerOpen(false)}
        />
      )}

      {/* Capsule Cracking + Reward Reveal Modal */}
      {overlayState && (
        <CapsuleOpenOverlay
          capsule={overlayState.capsule}
          skipCrackIntro={overlayState.skipCrackIntro}
          audioEngine={audioRef.current}
          onComplete={handleFinishCapsule}
        />
      )}

      {/* Live Thermal Receipt Printer Modal */}
      {printerOpen && (
        <ThermalReceiptPrinter
          payload={payload}
          recipientName={recipientName}
          collectedCapsules={collectedCapsules}
          audioEngine={audioRef.current}
          onClose={() => setPrinterOpen(false)}
          onReplayMachine={() => resetMachineState(overrides.mode)}
        />
      )}
    </div>
  );
}
