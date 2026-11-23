import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { BRAND_CONTACT, buildWhatsAppUrl } from "@/lib/format";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <BrandLogo />
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted text-pretty">
              Platform kado ucapan interaktif untuk anniversary & ulang tahun, serta undangan digital modern. Bisa rangkai sendiri atau terima beres dibantu tim studio.
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              <a
                href={buildWhatsAppUrl("Halo Kado Digital, saya mau bertanya.")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Kado Digital"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-surface text-ink transition-colors hover:border-emerald-brand hover:text-emerald-brand"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={BRAND_CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Kado Digital"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-surface text-ink transition-colors hover:border-emerald-brand hover:text-emerald-brand"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href={`mailto:${BRAND_CONTACT.email}`}
                aria-label="Email Kado Digital"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-surface text-ink transition-colors hover:border-emerald-brand hover:text-emerald-brand"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold tracking-wide text-ink uppercase">
              Lini Produk
            </h3>
            <ul className="mt-4 space-y-2.5 text-[15px] text-muted">
              <li>
                <Link href="/katalog?lini=kado-personal" className="hover:text-emerald-brand">
                  Kado Personal Interaktif
                </Link>
              </li>
              <li>
                <Link href="/katalog?lini=wedding" className="hover:text-emerald-brand">
                  Undangan Wedding
                </Link>
              </li>
              <li>
                <Link href="/katalog?lini=save-the-date" className="hover:text-emerald-brand">
                  Save The Date
                </Link>
              </li>
              <li>
                <Link href="/katalog?lini=event-party" className="hover:text-emerald-brand">
                  Event & Party
                </Link>
              </li>
              <li>
                <Link href="/katalog?lini=lensa-momen" className="hover:text-emerald-brand">
                  Lensa Momen (Guest Cam)
                </Link>
              </li>
              <li>
                <Link href="/katalog?lini=rencana-momen" className="hover:text-emerald-brand">
                  Rencana Momen (Planner)
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold tracking-wide text-ink uppercase">
              Platform & Layanan
            </h3>
            <ul className="mt-4 space-y-2.5 text-[15px] text-muted">
              <li>
                <Link href="/buat?mode=mandiri" className="hover:text-emerald-brand">
                  Buat Sendiri (Trial 2 Hari)
                </Link>
              </li>
              <li>
                <Link href="/buat?mode=terima-beres" className="hover:text-emerald-brand">
                  Pesan Terima Beres
                </Link>
              </li>
              <li>
                <Link href="/#harga" className="hover:text-emerald-brand">
                  Paket & Harga
                </Link>
              </li>
              <li>
                <Link href="/layanan" className="hover:text-emerald-brand">
                  Layanan & Add-on Studio
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-emerald-brand">
                  Inspirasi & Panduan
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold tracking-wide text-ink uppercase">
              Kontak & Legal
            </h3>
            <ul className="mt-4 space-y-2.5 text-[15px] text-muted">
              <li className="tabular-nums">{BRAND_CONTACT.whatsappDisplay}</li>
              <li>{BRAND_CONTACT.email}</li>
              <li className="pt-2">
                <Link href="/privasi" className="hover:text-emerald-brand">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/ketentuan" className="hover:text-emerald-brand">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-hairline pt-6 text-xs text-muted sm:flex-row sm:items-center">
          <p>© 2026 Kado Digital ({BRAND_CONTACT.domain}). Seluruh hak cipta dilindungi.</p>
          <p>Jam operasional studio: Senin–Sabtu, 09.00–17.00 WIB.</p>
        </div>
      </div>
    </footer>
  );
}
