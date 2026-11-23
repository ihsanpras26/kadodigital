"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Play } from "lucide-react";
import { HeroInteractiveStage } from "./HeroInteractiveStage";

export function HeroSection() {
  const [triggerCount, setTriggerCount] = useState(0);

  const handleTryDemo = () => {
    setTriggerCount((prev) => prev + 1);
    const el = document.getElementById("hero-demo-stage");
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <section className="mx-auto max-w-[1240px] px-4 pt-8 pb-14 sm:px-6 lg:px-8 lg:pt-14 lg:pb-20">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Left Copy: 5 columns */}
        <div className="lg:col-span-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-accent-soft px-3.5 py-1.5 text-xs font-semibold tracking-wide text-ink">
            <span className="h-2 w-2 rounded-full bg-emerald-brand" aria-hidden="true" />
            Kado Interaktif &amp; Undangan Digital
          </span>

          <h1 className="mt-5 text-[40px] leading-[1.06] font-bold tracking-[-0.035em] text-ink text-balance sm:text-[52px] lg:text-[60px]">
            Cerita kamu, jadi{" "}
            <span className="font-serif font-normal italic text-emerald-brand">
              kejutan
            </span>{" "}
            yang tak terlupakan.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-[1.65] text-muted text-pretty sm:text-[18px]">
            Buat kado ucapan interaktif untuk anniversary &amp; ulang tahun—atau
            undangan digital modern untuk segala acara. Bisa rangkai sendiri dalam
            hitungan menit, atau serahkan terima beres ke tim kami.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleTryDemo}
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-emerald-brand px-6 text-[15px] font-semibold text-white transition-all duration-150 hover:-translate-y-0.5 hover:bg-emerald-hover active:scale-[0.98]"
            >
              <Play className="h-4 w-4 fill-current" />
              Coba Demo Interaktif
            </button>

            <Link
              href="/katalog"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-control/60 bg-surface px-6 text-[15px] font-semibold text-ink transition-colors duration-150 hover:border-ink hover:bg-subtle"
            >
              Jelajahi Katalog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2.5 text-sm font-medium text-muted">
            <li className="inline-flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-brand" strokeWidth={2.5} />
              Gratis coba 2 hari
            </li>
            <li className="inline-flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-brand" strokeWidth={2.5} />
              Bisa mandiri atau terima beres
            </li>
          </ul>
        </div>

        {/* Right Interactive Stage: 7 columns */}
        <div className="lg:col-span-7">
          <HeroInteractiveStage externalTriggerCount={triggerCount} />
        </div>
      </div>
    </section>
  );
}
