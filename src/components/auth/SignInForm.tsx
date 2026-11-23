"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export function SignInForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim().includes("@")) {
      setError("Masukkan nama panggilan dan alamat email yang valid.");
      return;
    }
    setError("");
    try {
      window.localStorage.setItem(
        "kado-digital-user",
        JSON.stringify({ name: name.trim(), email: email.trim() })
      );
    } catch {
      // Ignore storage failures
    }
    router.push("/buat?mode=mandiri");
  };

  return (
    <div className="mx-auto max-w-[460px] rounded-[24px] border border-hairline bg-surface p-7 shadow-[var(--shadow-card-hover)] sm:p-9">
      <span className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-emerald-brand">
        Trial Gratis 2 Hari · Tanpa Kartu Kredit
      </span>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Masuk ke Workspace Kado Digital
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Mulai rangkai kado interaktif atau undangan digital pertamamu, atau lanjutkan draft yang
        sudah tersimpan.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="auth-name" className="block text-xs font-semibold text-ink">
            Nama Panggilan Kamu
          </label>
          <input
            id="auth-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Dimas"
            className="mt-1.5 h-12 w-full rounded-[10px] border border-control bg-canvas px-3.5 text-sm text-ink"
          />
        </div>

        <div>
          <label htmlFor="auth-email" className="block text-xs font-semibold text-ink">
            Alamat Email
          </label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            className="mt-1.5 h-12 w-full rounded-[10px] border border-control bg-canvas px-3.5 text-sm text-ink"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-error/10 px-3.5 py-2.5 text-xs font-semibold text-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-brand text-sm font-semibold text-white transition-colors hover:bg-emerald-hover"
        >
          Masuk &amp; Buka Studio Editor
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <ul className="mt-6 space-y-2 border-t border-hairline pt-5 text-xs text-muted">
        <li className="flex items-center gap-2">
          <Check className="h-3.5 w-3.5 text-emerald-brand" />
          Draft tersimpan otomatis dan bisa diuji di preview HP
        </li>
        <li className="flex items-center gap-2">
          <Check className="h-3.5 w-3.5 text-emerald-brand" />
          Bisa beralih ke mode Terima Beres kapan saja
        </li>
      </ul>

      <p className="mt-4 text-center text-xs text-muted">
        Ingin dibantu tim studio langsung?{" "}
        <Link href="/buat?mode=terima-beres" className="font-semibold text-emerald-brand underline">
          Pesan Terima Beres →
        </Link>
      </p>
    </div>
  );
}
