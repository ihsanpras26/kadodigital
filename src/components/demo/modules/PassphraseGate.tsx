"use client";

import { useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { isDarkHex } from "@/lib/color";

interface PassphraseGateProps {
  expectedCode: string;
  hint: string;
  accent: string;
  base: string;
  soft: string;
  onUnlock: () => void;
}

export function PassphraseGate({
  expectedCode,
  hint,
  accent,
  base,
  soft,
  onUnlock,
}: PassphraseGateProps) {
  const [inputCode, setInputCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [attempts, setAttempts] = useState(0);

  const darkBase = isDarkHex(base);
  const darkAccent = isDarkHex(accent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim() === expectedCode) {
      setErrorMsg("");
      onUnlock();
      return;
    }
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setErrorMsg(
      nextAttempts >= 3
        ? `Kode belum cocok (${nextAttempts}x percobaan). Petunjuk: ${hint}`
        : "Kode akses belum tepat. Coba periksa kembali."
    );
  };

  return (
    <div className="flex min-h-[calc(100dvh-56px)] items-center justify-center px-4 py-10">
      <div
        className="w-full max-w-md rounded-[24px] border p-7 text-center shadow-xl sm:p-9"
        style={{
          backgroundColor: darkBase ? soft : "#FFFFFF",
          borderColor: `${accent}55`,
          color: darkBase ? "#F7F4EC" : "#18181D",
        }}
      >
        <div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border"
          style={{ borderColor: accent, color: accent }}
        >
          <Lock className="h-5 w-5" />
        </div>

        <h1 className="mt-4 font-editorial-alt text-2xl font-semibold sm:text-3xl">
          Kado Ini Terkunci Kode Akses
        </h1>
        <p className="mt-2 text-sm opacity-80">
          Masukkan 4 digit kode rahasia untuk membuka halaman kado pribadi.
        </p>
        <p className="mt-1 text-xs font-semibold" style={{ color: accent }}>
          {hint}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <label htmlFor="passphrase-input" className="sr-only">
            Kode akses
          </label>
          <input
            id="passphrase-input"
            type="text"
            inputMode="numeric"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Ketik kode akses..."
            className="h-12 w-full rounded-xl border bg-white px-4 text-center font-mono text-base tracking-[0.25em] text-[#18181D]"
            style={{ borderColor: `${accent}66` }}
          />
          {errorMsg && (
            <p className="rounded-lg bg-[#B4233C]/15 px-3 py-2 text-xs font-medium text-[#FFB4BF]">
              {errorMsg}
            </p>
          )}
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition-transform hover:-translate-y-0.5"
            style={{
              backgroundColor: accent,
              color: darkAccent ? "#FFFFFF" : "#18181D",
            }}
          >
            <Unlock className="h-4 w-4" />
            Buka Kado
          </button>
        </form>
      </div>
    </div>
  );
}
