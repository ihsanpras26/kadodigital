"use client";

import { useEffect, useState } from "react";
import { FileText, Pause, Play, Volume2 } from "lucide-react";
import { isDarkHex } from "@/lib/color";

interface VoiceNotePlayerProps {
  title: string;
  durationSec: number;
  transcript: string;
  accent: string;
  soft: string;
}

export function VoiceNotePlayer({
  title,
  durationSec,
  transcript,
  accent,
  soft,
}: VoiceNotePlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  const darkAccent = isDarkHex(accent);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setElapsed((prev) => {
        if (prev + 1 >= durationSec) {
          setPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [playing, durationSec]);

  const playSoftChime = () => {
    try {
      const AudioCtx = window.AudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.46);
    } catch {
      // Browser audio context blocked or unavailable; visual playback continues
    }
  };

  const handleTogglePlay = () => {
    if (!playing) {
      playSoftChime();
    }
    setPlaying((prev) => !prev);
  };

  const progress = Math.min(100, Math.round((elapsed / durationSec) * 100));
  const formattedTime = `00:${String(elapsed).padStart(2, "0")} / 00:${String(durationSec).padStart(
    2,
    "0"
  )}`;

  return (
    <div
      className="rounded-[20px] border p-5"
      style={{ backgroundColor: "#FFFFFF", borderColor: `${accent}3D`, color: "#18181D" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase" style={{ color: accent }}>
          <Volume2 className="h-4 w-4" />
          {title}
        </span>
        <span className="text-xs font-mono text-[#5B5864] tabular-nums">{formattedTime}</span>
      </div>

      <div className="mt-4 flex items-center gap-3.5">
        <button
          type="button"
          onClick={handleTogglePlay}
          aria-label={playing ? "Jeda rekaman suara" : "Putar rekaman suara"}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105"
          style={{ backgroundColor: accent, color: darkAccent ? "#FFFFFF" : "#18181D" }}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
        </button>

        <div className="flex-1">
          <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: soft }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: accent }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-[#5B5864]">
            {playing ? "Sedang memutar pesan suara..." : "Tekan play untuk mendengarkan (dimulai atas aksi kamu)"}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-black/10 pt-3">
        <button
          type="button"
          onClick={() => setShowTranscript((prev) => !prev)}
          aria-expanded={showTranscript}
          className="inline-flex items-center gap-1.5 text-xs font-semibold"
          style={{ color: accent }}
        >
          <FileText className="h-3.5 w-3.5" />
          {showTranscript ? "Sembunyikan transkrip teks" : "Baca transkrip suara"}
        </button>
        {showTranscript && (
          <p className="mt-2 rounded-xl p-3 text-sm leading-relaxed text-[#2A2832]" style={{ backgroundColor: soft }}>
            “{transcript}”
          </p>
        )}
      </div>
    </div>
  );
}
