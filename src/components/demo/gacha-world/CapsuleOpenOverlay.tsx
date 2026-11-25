"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Pause, Play, RotateCw, X } from "lucide-react";
import { isDarkHex } from "@/lib/color";
import type { GachaAudioEngine } from "./gachaAudioEngine";
import type { GachaCapsuleItem } from "./gachaData";

interface CapsuleOpenOverlayProps {
  capsule: GachaCapsuleItem;
  skipCrackIntro?: boolean;
  audioEngine: GachaAudioEngine | null;
  onComplete: (capsuleId: string) => void;
}

type CrackStage = "wobble" | "split" | "reveal";

const CONFETTI_SPECS = [
  { angle: -72, dist: 120, color: "#B83124", shape: "circle" },
  { angle: -38, dist: 145, color: "#D6A54B", shape: "pill" },
  { angle: -12, dist: 118, color: "#2D6A4F", shape: "circle" },
  { angle: 18, dist: 142, color: "#325788", shape: "pill" },
  { angle: 48, dist: 128, color: "#B83124", shape: "circle" },
  { angle: 125, dist: 132, color: "#D6A54B", shape: "pill" },
  { angle: 158, dist: 120, color: "#2D6A4F", shape: "circle" },
  { angle: 205, dist: 138, color: "#F7DC96", shape: "pill" },
];

export function CapsuleOpenOverlay({
  capsule,
  skipCrackIntro = false,
  audioEngine,
  onComplete,
}: CapsuleOpenOverlayProps) {
  const [stage, setStage] = useState<CrackStage>(skipCrackIntro ? "reveal" : "wobble");
  const [flipped, setFlipped] = useState(false);

  const [playingVoice, setPlayingVoice] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(0);

  const [pickedIdx, setPickedIdx] = useState<number | null>(null);
  const [wrongMsg, setWrongMsg] = useState<string | null>(null);
  const [quizSolved, setQuizSolved] = useState(false);
  const [shakeIdx, setShakeIdx] = useState<number | null>(null);

  const scratchCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingScratchRef = useRef(false);
  const [scratchRevealed, setScratchRevealed] = useState(false);
  const [scratchPct, setScratchPct] = useState(0);

  useEffect(() => {
    if (skipCrackIntro) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      audioEngine?.playCapsuleCrack();
      setStage("reveal");
      return;
    }

    audioEngine?.playCapsuleWobble();
    const tSplit = window.setTimeout(() => {
      audioEngine?.playCapsuleCrack();
      setStage("split");
    }, 360);
    const tReveal = window.setTimeout(() => {
      setStage("reveal");
    }, 840);

    return () => {
      window.clearTimeout(tSplit);
      window.clearTimeout(tReveal);
    };
  }, [skipCrackIntro, audioEngine]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stage === "reveal") {
        audioEngine?.stopVoiceNoteClip();
        onComplete(capsule.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      audioEngine?.stopVoiceNoteClip();
    };
  }, [stage, audioEngine, capsule.id, onComplete]);

  useEffect(() => {
    if (capsule.kind !== "voucher" || stage !== "reveal" || scratchRevealed) return;
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 310;
    const h = 112;
    canvas.width = w;
    canvas.height = h;

    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#EBD083");
    g.addColorStop(0.5, "#C89436");
    g.addColorStop(1, "#F5DA92");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 65; i++) {
      ctx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,0.35)" : "rgba(110,75,15,0.22)";
      ctx.fillRect((i * 47) % w, (i * 29) % h, 4, 2);
    }

    ctx.fillStyle = "#2E1C06";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    ctx.fillText("GOSOK LAPISAN EMAS INI", w / 2, h / 2 + 4);
  }, [capsule.kind, stage, scratchRevealed]);

  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = scratchCanvasRef.current;
    if (!canvas || scratchRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    audioEngine?.playScratchTick();

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    let sampled = 0;
    for (let i = 3; i < data.length; i += 48) {
      sampled++;
      if (data[i] < 60) cleared++;
    }
    const pct = Math.round((cleared / Math.max(1, sampled)) * 100);
    setScratchPct(pct);
    if (pct >= 42) {
      setScratchRevealed(true);
      audioEngine?.playStampSlam();
    }
  };

  const handleToggleVoice = () => {
    if (capsule.kind !== "voicenote") return;
    if (playingVoice) {
      audioEngine?.stopVoiceNoteClip();
      setPlayingVoice(false);
    } else {
      setPlayingVoice(true);
      audioEngine?.playVoiceNoteClip(
        capsule.durationSec,
        (ratio) => setVoiceProgress(ratio),
        () => {
          setPlayingVoice(false);
          setVoiceProgress(1);
        },
      );
    }
  };

  const handleAnswerQuiz = (idx: number) => {
    if (capsule.kind !== "quiz" || quizSolved) return;
    setPickedIdx(idx);
    if (idx === capsule.correctIndex) {
      setWrongMsg(null);
      setQuizSolved(true);
      audioEngine?.playQuizCorrect();
    } else {
      setShakeIdx(idx);
      audioEngine?.playQuizWrong();
      const quip =
        capsule.wrongQuips[idx % capsule.wrongQuips.length] ??
        "Belum tepat, coba klik pilihan yang satunya.";
      setWrongMsg(quip);
      window.setTimeout(() => setShakeIdx(null), 400);
    }
  };

  const handleClose = () => {
    audioEngine?.stopVoiceNoteClip();
    onComplete(capsule.id);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Isi kapsul ${capsule.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0907]/78 px-4 py-6 backdrop-blur-sm"
    >
      {/* Stages A: Capsule Wobble & Shell Crack Split */}
      {stage !== "reveal" && (
        <div className="relative flex h-64 w-64 items-center justify-center">
          {stage === "split" &&
            CONFETTI_SPECS.map((c, idx) => (
              <span
                key={idx}
                aria-hidden="true"
                className="absolute block transition-all duration-500 ease-out"
                style={{
                  width: c.shape === "pill" ? 14 : 10,
                  height: c.shape === "pill" ? 6 : 10,
                  borderRadius: 999,
                  backgroundColor: c.color,
                  border: "1px solid rgba(255,244,214,0.45)",
                  transform: `translate(${Math.cos((c.angle * Math.PI) / 180) * c.dist}px, ${
                    Math.sin((c.angle * Math.PI) / 180) * c.dist
                  }px) rotate(${c.angle}deg)`,
                  opacity: 0,
                }}
              />
            ))}

          <div className={`relative h-32 w-32 ${stage === "wobble" ? "gacha-shake" : ""}`}>
            <div
              className="h-16 w-32 rounded-t-full border-2 border-b-[3px] border-[#D6A54B] shadow-2xl transition-all duration-300 ease-out"
              style={{
                backgroundColor: capsule.shellColor,
                transform:
                  stage === "split" ? "translate(-28px, -54px) rotate(-26deg)" : "none",
                opacity: stage === "split" ? 0 : 1,
              }}
            >
              <span className="mt-3 ml-5 block h-3 w-7 rounded-full bg-white/45" />
            </div>

            <div
              className="h-16 w-32 rounded-b-full border-2 border-t-0 border-[#C8B294] bg-[#FAF4E8] shadow-2xl transition-all duration-300 ease-out"
              style={{
                transform:
                  stage === "split" ? "translate(24px, 48px) rotate(22deg)" : "none",
                opacity: stage === "split" ? 0 : 1,
              }}
            />
          </div>
        </div>
      )}

      {/* Stage B: Tailored Cotton Keepsake Card Reveal */}
      {stage === "reveal" && (
        <div className="gacha-cotton-card relative w-full max-w-[430px] rounded-[24px] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span
                className="gacha-receipt-font inline-block rounded-full border border-[#221914]/25 px-2.5 py-0.5 text-[10px] font-bold uppercase"
                style={{
                  backgroundColor: capsule.shellColor,
                  color: isDarkHex(capsule.shellColor) ? "#FFFFFF" : "#211813",
                }}
              >
                Kapsul {capsule.serial} · {capsule.rarityLabel}
              </span>
              <h3 className="gacha-serif mt-2 text-2xl leading-tight font-semibold text-[#1B130F] sm:text-[26px]">
                {capsule.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Tutup kartu kapsul"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#C8B294] bg-[#EFE5D4] text-[#211813] transition hover:bg-[#E4D5BC]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* KIND 1: REAL 35MM ANALOG FILM POLAROID FLIP */}
          {capsule.kind === "polaroid" && (
            <div className="mt-4">
              <div
                className="relative mx-auto h-[278px] w-full"
                style={{ perspective: "1100px" }}
              >
                <div
                  className="relative h-full w-full transition-transform duration-500 ease-out"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* Front Film Polaroid */}
                  <div
                    className={`absolute inset-0 rounded-[16px] border border-[#C8B294] bg-[#FFFDF9] p-3 shadow-sm transition-opacity duration-200 ${
                      flipped ? "pointer-events-none opacity-0" : "opacity-100"
                    }`}
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <div className="relative h-[182px] overflow-hidden rounded-[10px] bg-[#1C1410]">
                      <img
                        src={capsule.photoUrl}
                        alt={capsule.title}
                        className="h-full w-full object-cover"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#18100C]/55 via-transparent to-transparent"
                      />
                      <span className="gacha-receipt-font absolute right-2.5 bottom-2.5 rounded bg-[#18100C]/85 px-2 py-0.5 text-[10px] font-bold text-[#F7D89C]">
                        {capsule.dateLabel}
                      </span>
                    </div>
                    <p className="gacha-hand mt-2.5 text-center text-[20px] leading-snug text-[#211813]">
                      {capsule.frontCaption}
                    </p>
                  </div>

                  {/* Back Secret Note */}
                  <div
                    className={`absolute inset-0 flex flex-col justify-between rounded-[16px] border border-[#C8B294] bg-[#FBF4E6] p-5 transition-opacity duration-200 ${
                      flipped ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div>
                      <p className="gacha-receipt-font text-[10px] font-bold tracking-wider text-[#8C621B] uppercase">
                        CATATAN DI BALIK FOTO
                      </p>
                      <p className="gacha-hand mt-3 text-[25px] leading-snug text-[#211813]">
                        &ldquo;{capsule.backNote}&rdquo;
                      </p>
                    </div>
                    <div className="flex items-center justify-between border-t border-dashed border-[#C8B294] pt-3">
                      <span className="gacha-receipt-font text-[10px] font-bold text-[#6E5541]">
                        {capsule.dateLabel}
                      </span>
                      <span className="gacha-receipt-font -rotate-6 rounded border border-[#B83124] px-2 py-0.5 text-[10px] font-bold text-[#B83124]">
                        TERSIMPAN
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  audioEngine?.playFlipCard();
                  setFlipped((f) => !f);
                }}
                className="mt-3.5 inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-[12px] border border-[#C8B294] bg-[#EFE5D4] px-4 text-xs font-bold text-[#211813] transition hover:bg-[#E4D5BC]"
              >
                <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{flipped ? "Lihat Foto Depan" : "Balik Foto untuk Baca Rahasia"}</span>
              </button>
            </div>
          )}

          {/* KIND 2: RETRO CASSETTE VOICE NOTE */}
          {capsule.kind === "voicenote" && (
            <div className="mt-4">
              <div className="rounded-[16px] border border-[#4D3A2D] bg-[#211813] p-3.5 text-[#FFFDF8]">
                <div className="rounded-[10px] border border-[#C8B294]/40 bg-[#FAF2E3] p-2.5 text-[#211813]">
                  <div className="flex items-center justify-between border-b-2 border-[#B83124] pb-1.5">
                    <span className="gacha-receipt-font text-[10px] font-bold tracking-wider uppercase">
                      {capsule.cassetteLabel}
                    </span>
                    <span className="gacha-receipt-font text-[10px] font-bold text-[#6E5541]">
                      00:{capsule.durationSec}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between gap-2 rounded-lg bg-[#1A130F] px-4 py-2.5">
                    {[0, 1].map((spool) => (
                      <div
                        key={spool}
                        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#DFCEB2] bg-[#362921] ${
                          playingVoice ? "gacha-reel-spinning" : ""
                        }`}
                      >
                        <span className="h-2.5 w-2.5 rounded-full border border-[#DFCEB2] bg-[#FAF4E8]" />
                      </div>
                    ))}

                    <div className="flex flex-1 items-center justify-center gap-1 px-2" aria-hidden="true">
                      {[14, 22, 12, 24, 16].map((h, i) => (
                        <span
                          key={i}
                          className="w-1.5 rounded-full bg-[#D6A54B] transition-all duration-150"
                          style={{
                            height: playingVoice
                              ? `${10 + ((Math.round(voiceProgress * 20) + i * 7) % 16)}px`
                              : `${Math.round(h * 0.45)}px`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    aria-label={playingVoice ? "Jeda kaset suara" : "Putar kaset suara"}
                    className="gacha-brass-btn flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  >
                    {playingVoice ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="ml-0.5 h-4 w-4" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-[#3D2E25]">
                      <div
                        className="h-full rounded-full bg-[#E8C16E] transition-all duration-100"
                        style={{ width: `${Math.round(voiceProgress * 100)}%` }}
                      />
                    </div>
                    <p className="gacha-receipt-font mt-1 text-[10px] text-[#DFCEB2]">
                      {playingVoice ? "MEMUTAR NADA & TRANSKRIP..." : "KETUK PLAY UNTUK DENGERIN"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 rounded-[14px] border border-[#C8B294]/60 bg-[#FAF2E3] p-3.5 text-[13px] leading-relaxed text-[#3E2B1E]">
                {capsule.transcriptLines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          )}

          {/* KIND 3: MINI INSIDE-JOKE QUIZ */}
          {capsule.kind === "quiz" && (
            <div className="mt-4">
              <div className="rounded-[16px] border border-[#C8B294] bg-[#FAF2E3] p-4">
                <p className="text-sm font-bold leading-snug text-[#211813]">
                  {capsule.question}
                </p>

                <div className="mt-3 space-y-2">
                  {capsule.options.map((opt, idx) => {
                    const isCorrect = idx === capsule.correctIndex;
                    const chosen = pickedIdx === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAnswerQuiz(idx)}
                        className={`w-full rounded-[12px] border px-3.5 py-2.5 text-left text-xs font-semibold transition ${
                          shakeIdx === idx ? "gacha-shake" : ""
                        } ${
                          quizSolved && isCorrect
                            ? "border-[#2D6A4F] bg-[#2D6A4F] text-white"
                            : chosen && !isCorrect
                              ? "border-[#B83124] bg-[#FDECEA] text-[#942217]"
                              : "border-[#D4C0A3] bg-[#FFFDF9] text-[#211813] hover:bg-[#F3E9D7]"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {wrongMsg && !quizSolved && (
                  <p className="mt-3 text-xs font-semibold text-[#942217]">
                    {wrongMsg}
                  </p>
                )}

                {quizSolved && (
                  <div className="mt-3 rounded-[12px] border border-[#2D6A4F]/35 bg-[#E6F1EA] p-3 text-xs leading-relaxed text-[#1B4332]">
                    <p className="font-bold">Benar!</p>
                    <p className="mt-1">{capsule.rewardNote}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* KIND 4: GOLD FOIL SCRATCH VOUCHER */}
          {capsule.kind === "voucher" && (
            <div className="mt-4 select-none">
              <div className="relative overflow-hidden rounded-[16px] border border-dashed border-[#8C6D46] bg-[#FAF2E3] p-4">
                <div className="flex items-center justify-between">
                  <span className="gacha-receipt-font text-[10px] font-bold tracking-wider text-[#6E5541] uppercase">
                    KUPON {capsule.voucherCode}
                  </span>
                  {scratchRevealed && (
                    <span className="gacha-stamp-slam gacha-receipt-font rounded border-2 border-[#C8281D] px-2 py-0.5 text-[10px] font-bold text-[#C8281D]">
                      TERKLAIM
                    </span>
                  )}
                </div>

                <div className="relative mt-2.5 flex min-h-[112px] flex-col justify-center rounded-[12px] border border-[#D4C0A3] bg-[#FFFDF9] p-3 text-center">
                  <p className="gacha-display text-base font-bold text-[#211813]">
                    {capsule.voucherHeadline}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#5C4633]">
                    {capsule.voucherDetail}
                  </p>
                  <p className="gacha-receipt-font mt-2 text-[10px] font-bold text-[#8C621B]">
                    Berlaku: {capsule.validUntil}
                  </p>

                  {!scratchRevealed && (
                    <canvas
                      ref={scratchCanvasRef}
                      onPointerDown={(e) => {
                        drawingScratchRef.current = true;
                        e.currentTarget.setPointerCapture(e.pointerId);
                        scratchAt(e.clientX, e.clientY);
                      }}
                      onPointerMove={(e) => {
                        if (!drawingScratchRef.current) return;
                        scratchAt(e.clientX, e.clientY);
                      }}
                      onPointerUp={() => {
                        drawingScratchRef.current = false;
                      }}
                      className="absolute inset-0 h-full w-full cursor-crosshair touch-none rounded-[12px]"
                      aria-label="Kanvas gosok kupon hadiah"
                    />
                  )}
                </div>

                {!scratchRevealed && (
                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <span className="gacha-receipt-font text-[10px] font-bold text-[#6E5541]">
                      TERGOSOK {scratchPct}%
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setScratchRevealed(true);
                        audioEngine?.playStampSlam();
                      }}
                      className="text-[11px] font-semibold text-[#942217] underline underline-offset-2"
                    >
                      Buka Langsung
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Save to Shelf Primary CTA */}
          <button
            type="button"
            onClick={handleClose}
            className="gacha-lacquer-btn mt-4 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-[14px] px-5 text-sm font-bold"
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            <span>Simpan ke Baki Koleksi</span>
          </button>
        </div>
      )}
    </div>
  );
}
