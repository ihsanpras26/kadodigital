"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface CelestialDialogueBoxProps {
  speakerName: string;
  roleLabel: string;
  message: string;
  isCouple?: boolean;
  onClose: () => void;
}

export function CelestialDialogueBox({
  speakerName,
  roleLabel,
  message,
  isCouple = false,
  onClose,
}: CelestialDialogueBoxProps) {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    setVisibleChars(0);
    const interval = window.setInterval(() => {
      setVisibleChars((prev) => {
        if (prev >= message.length) {
          window.clearInterval(interval);
          return prev;
        }
        return prev + 2;
      });
    }, 20);
    return () => window.clearInterval(interval);
  }, [message]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const done = visibleChars >= message.length;

  function handleClick() {
    if (!done) {
      setVisibleChars(message.length);
    } else {
      onClose();
    }
  }

  return (
    <div className="fixed right-3 bottom-20 z-40 w-[min(92vw,410px)] sm:right-5 sm:bottom-24">
      <button
        type="button"
        onClick={handleClick}
        className="celestial-glass flex w-full items-start gap-3.5 rounded-[22px] p-4 text-left transition hover:brightness-105 cursor-pointer"
      >
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
            isCouple
              ? "border-[#EFC86E] bg-gradient-to-br from-[#F5DA91] to-[#C79538] text-[#171107]"
              : "border-[#EFC86E]/40 bg-[#15204D] text-[#F7DC94]"
          }`}
        >
          <Sparkles className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="celestial-serif text-lg italic text-[#FAF6EE]">
              {speakerName}
            </span>
            <span className="celestial-mono text-[10px] text-[#EFC86E] uppercase">
              · {roleLabel}
            </span>
          </div>

          <p className="mt-1 min-h-[40px] text-xs leading-relaxed text-[#D0DBFA] sm:text-[13px]">
            {message.slice(0, visibleChars)}
          </p>

          <p className="mt-1.5 text-[10.5px] font-semibold text-[#F7DC94]">
            {done ? "Ketuk untuk tutup" : "Mengetik..."}
          </p>
        </div>
      </button>
    </div>
  );
}
