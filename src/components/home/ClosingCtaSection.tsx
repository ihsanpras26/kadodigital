import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/format";

export function ClosingCtaSection() {
  return (
    <section className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div
        data-surface="dark"
        className="rounded-[28px] bg-dark px-6 py-12 text-inverse sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between lg:gap-12"
      >
        <div className="max-w-xl">
          <span className="inline-flex items-center rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">
            Siap dalam hitungan menit atau terima beres
          </span>
          <h2 className="mt-4 text-[30px] leading-[1.12] font-bold tracking-[-0.03em] text-inverse text-balance sm:text-[42px]">
            Siap bikin momen berikutnya terasa lebih{" "}
            <span className="font-serif font-normal italic text-gold">personal</span>?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-inverse-muted text-pretty">
            Mulai uji coba gratis 2 hari dengan editor mandiri, atau ceritakan momenmu kepada tim
            studio kami lewat WhatsApp.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
          <Link
            href="/buat?mode=mandiri"
            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-canvas px-6 text-[15px] font-semibold text-ink transition-transform hover:-translate-y-0.5"
          >
            Mulai Gratis Sekarang
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={buildWhatsAppUrl("Halo Kado Digital, saya mau tanya atau pesan mode Terima Beres.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-inverse-muted/40 px-6 text-[15px] font-semibold text-inverse transition-colors hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4" />
            Tanya via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
