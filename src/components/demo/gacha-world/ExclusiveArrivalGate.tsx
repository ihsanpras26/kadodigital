"use client";

import { useEffect, useRef, useState } from "react";
import { Delete, Lock } from "lucide-react";
import type { GachaAudioEngine } from "./gachaAudioEngine";

interface ExclusiveArrivalGateProps {
  recipientName: string;
  senderName: string;
  dateLabel: string;
  pinCode?: string;
  pinHint?: string;
  exclusiveMode: boolean;
  audioEngine: GachaAudioEngine | null;
  onUnlockSuccess: () => void;
}

const KEYPAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

export function ExclusiveArrivalGate({
  recipientName,
  senderName,
  dateLabel,
  pinCode,
  pinHint,
  exclusiveMode,
  audioEngine,
  onUnlockSuccess,
}: ExclusiveArrivalGateProps) {
  const requiresPin = Boolean(pinCode && /^\d{4}$/.test(pinCode));
  const [pinPassed, setPinPassed] = useState(!requiresPin);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState(false);

  const [holdProgress, setHoldProgress] = useState(0);
  const [holdHint, setHoldHint] = useState(false);
  const holdRafRef = useRef(0);
  const holdingRef = useRef(false);
  const unlockedRef = useRef(false);

  // Sync pinPassed when composer updates PIN live in preview
  useEffect(() => {
    setPinPassed(!requiresPin);
    setEnteredPin("");
    setPinError(false);
  }, [requiresPin, pinCode]);

  const initials = `${senderName.trim().charAt(0).toUpperCase() || "K"}·${
    recipientName.trim().charAt(0).toUpperCase() || "D"
  }`;

  const handleDigit = (key: string) => {
    if (!pinCode || pinPassed) return;
    if (key === "del") {
      audioEngine?.playPinKey();
      setPinError(false);
      setEnteredPin((prev) => prev.slice(0, -1));
      return;
    }
    if (!/^\d$/.test(key) || enteredPin.length >= 4) return;

    audioEngine?.playPinKey();
    const next = enteredPin + key;
    setEnteredPin(next);

    if (next.length === 4) {
      if (next === pinCode) {
        audioEngine?.playPinUnlock();
        window.setTimeout(() => setPinPassed(true), 180);
      } else {
        setPinError(true);
        audioEngine?.playPinError();
        window.setTimeout(() => {
          setEnteredPin("");
          setPinError(false);
        }, 520);
      }
    }
  };

  // Keyboard digit entry when PIN stage is active
  useEffect(() => {
    if (pinPassed) return;
    const onKey = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) handleDigit(e.key);
      if (e.key === "Backspace") handleDigit("del");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const completeSealBreak = () => {
    if (unlockedRef.current) return;
    unlockedRef.current = true;
    holdingRef.current = false;
    cancelAnimationFrame(holdRafRef.current);
    audioEngine?.start();
    audioEngine?.playSealBreak();
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(24);
    }
    onUnlockSuccess();
  };

  const startHold = () => {
    if (!pinPassed || holdingRef.current || unlockedRef.current) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      completeSealBreak();
      return;
    }

    holdingRef.current = true;
    setHoldHint(false);
    audioEngine?.start();
    audioEngine?.playSealCharge();

    const startMs = performance.now();
    const durationMs = 780;

    const frame = (now: number) => {
      if (!holdingRef.current) return;
      const ratio = Math.min(1, (now - startMs) / durationMs);
      setHoldProgress(ratio);
      if (ratio >= 1) {
        completeSealBreak();
      } else {
        holdRafRef.current = requestAnimationFrame(frame);
      }
    };
    holdRafRef.current = requestAnimationFrame(frame);
  };

  const cancelHold = () => {
    if (!holdingRef.current || unlockedRef.current) return;
    holdingRef.current = false;
    cancelAnimationFrame(holdRafRef.current);
    if (holdProgress > 0.04 && holdProgress < 0.95) {
      setHoldHint(true);
    }
    setHoldProgress(0);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(holdRafRef.current);
  }, []);

  const ringCircumference = 2 * Math.PI * 44;
  const ringOffset = ringCircumference * (1 - holdProgress);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Titipan pribadi untuk ${recipientName}`}
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#0F0B09]/82 px-4 py-6 backdrop-blur-md"
    >
      <div className="gacha-cotton-card relative w-full max-w-[404px] rounded-[24px] px-6 py-7 text-center sm:px-7">
        {/* Top Envelope Corner Line Accents */}
        <p className="gacha-receipt-font text-[10px] font-bold tracking-[0.2em] text-[#7D5825] uppercase">
          TITIPAN KAPSUL PRIBADI
        </p>

        <h1 className="gacha-serif mt-2 text-3xl leading-[1.08] font-normal italic text-[#1B130F] sm:text-[38px]">
          Untuk {recipientName}
        </h1>

        <p className="mt-2 text-xs font-medium text-[#5C4633]">
          Disimpan oleh <strong className="font-semibold text-[#211813]">{senderName}</strong> ·{" "}
          {dateLabel}
        </p>

        <div className="mx-auto my-5 h-px w-24 bg-[#C8B294]" />

        {/* Stage 1: Optional 4-Digit Secret PIN Gate */}
        {!pinPassed ? (
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EFE4D1] px-3 py-1 text-[11px] font-semibold text-[#5C4633]">
              <Lock className="h-3 w-3 text-[#8C621B]" aria-hidden="true" />
              <span>Masukkan Kode Rahasia 4 Digit</span>
            </div>

            {pinHint && (
              <p className="mt-2.5 text-xs leading-relaxed text-[#5C4633]">
                Petunjuk: {pinHint}
              </p>
            )}

            {/* 4 Brass PIN Dots */}
            <div
              className={`mt-4 flex items-center justify-center gap-3 ${
                pinError ? "gacha-shake" : ""
              }`}
              aria-live="polite"
            >
              {[0, 1, 2, 3].map((idx) => {
                const filled = idx < enteredPin.length;
                return (
                  <span
                    key={idx}
                    className={`flex h-10 w-10 items-center justify-center rounded-[12px] border text-sm font-bold transition ${
                      pinError
                        ? "border-[#B83124] bg-[#FDECEA] text-[#942217]"
                        : filled
                          ? "border-[#8C621B] bg-[#211813] text-[#F0CB78]"
                          : "border-[#C8B294] bg-[#FAF4E8] text-[#8C6D46]"
                    }`}
                  >
                    {filled ? "•" : ""}
                  </span>
                );
              })}
            </div>

            {/* Tactile Number Pad */}
            <div className="mx-auto mt-4 grid max-w-[236px] grid-cols-3 gap-2">
              {KEYPAD_KEYS.map((key, idx) => {
                if (key === "") {
                  return <div key={`spacer-${idx}`} aria-hidden="true" />;
                }
                const isDel = key === "del";
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleDigit(key)}
                    aria-label={isDel ? "Hapus angka PIN" : `Angka ${key}`}
                    className="flex h-11 items-center justify-center rounded-[12px] border border-[#D4C0A3] bg-[#FFFDF9] font-mono text-sm font-bold text-[#211813] shadow-xs transition hover:bg-[#F3E9D7] active:translate-y-0.5"
                  >
                    {isDel ? <Delete className="h-4 w-4 text-[#6E5541]" /> : key}
                  </button>
                );
              })}
            </div>

            {!exclusiveMode && (
              <button
                type="button"
                onClick={() => setPinPassed(true)}
                className="mt-4 text-[11px] font-semibold text-[#7A5316] underline underline-offset-2"
              >
                Lewati PIN (Mode Pratinjau)
              </button>
            )}
          </div>
        ) : (
          /* Stage 2: Hold-to-Unseal Wax Seal */
          <div className="flex flex-col items-center">
            <p className="text-xs leading-relaxed text-[#5C4633]">
              Empat kapsul dan satu struk rahasia menunggumu di dalam. Tekan &amp; tahan segel
              lilin untuk membuka.
            </p>

            <div className="relative mt-5 flex h-28 w-28 items-center justify-center">
              {/* Circular Brass Progress Halo */}
              <svg
                viewBox="0 0 100 100"
                className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
                aria-hidden="true"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="rgba(140, 98, 27, 0.22)"
                  strokeWidth="3.5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="#B83124"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                />
              </svg>

              {/* Sculpted Tactile Wax Seal Button */}
              <button
                type="button"
                onPointerDown={startHold}
                onPointerUp={cancelHold}
                onPointerLeave={cancelHold}
                onPointerCancel={cancelHold}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    completeSealBreak();
                  }
                }}
                aria-label="Tekan dan tahan segel lilin untuk membuka kado"
                style={{
                  transform: `scale(${1 + holdProgress * 0.08})`,
                }}
                className="relative flex h-[78px] w-[78px] touch-none cursor-pointer items-center justify-center rounded-full border-2 border-[#E39D8F]/45 bg-gradient-to-br from-[#BD3527] via-[#961F15] to-[#6E120B] text-[#FAF2E4] shadow-[0_12px_24px_rgba(148,34,23,0.42),inset_0_2px_4px_rgba(255,215,200,0.3)] transition-transform duration-100 select-none"
              >
                <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full border border-[#F5D28C]/40">
                  <span className="gacha-serif text-lg font-semibold tracking-wider text-[#F7DFB0]">
                    {initials}
                  </span>
                </span>
              </button>
            </div>

            <p className="gacha-receipt-font mt-3 text-[10px] font-bold tracking-[0.14em] text-[#8C621B] uppercase">
              {holdProgress > 0.05
                ? "MEMBUKA SEGEL LILIN..."
                : holdHint
                  ? "TAHAN SEBENTAR SAMPAI PENUH"
                  : "TAHAN SEGEL UNTUK BUKA"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
