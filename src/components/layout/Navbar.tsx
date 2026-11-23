"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, X } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { buildWhatsAppUrl } from "@/lib/format";

const NAV_LINKS = [
  { href: "/katalog", label: "Produk & Tema" },
  { href: "/#fitur", label: "Fitur" },
  { href: "/#harga", label: "Harga" },
  { href: "/layanan", label: "Layanan" },
  { href: "/blog", label: "Inspirasi" },
];

export function Navbar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;

    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [drawerOpen]);

  const closeDrawer = () => {
    setDrawerOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-canvas/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:h-[72px] lg:px-8">
        <BrandLogo />

        <nav aria-label="Navigasi utama" className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((item) => {
            const isActive =
              item.href !== "/#fitur" &&
              item.href !== "/#harga" &&
              pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap text-[15px] font-medium tracking-[-0.01em] transition-colors duration-150 ${
                  isActive
                    ? "text-emerald-brand font-semibold"
                    : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <a
            href={buildWhatsAppUrl("Halo Kado Digital, saya mau tanya soal kado interaktif / undangan digital.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Konsultasi via WhatsApp"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-surface text-ink transition-colors duration-150 hover:border-control hover:bg-subtle"
          >
            <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </a>

          <Link
            href="/masuk"
            className="inline-flex h-11 items-center whitespace-nowrap rounded-full px-4 text-[15px] font-semibold text-ink transition-colors duration-150 hover:bg-subtle"
          >
            Masuk
          </Link>

          <Link
            href="/buat"
            className="inline-flex h-11 items-center whitespace-nowrap rounded-full bg-emerald-brand px-5 text-[15px] font-semibold text-white transition-all duration-150 hover:bg-emerald-hover active:scale-[0.98]"
          >
            Buat Sekarang
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/buat"
            className="inline-flex h-10 items-center rounded-full bg-emerald-brand px-4 text-sm font-semibold text-white"
          >
            Buat
          </Link>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Buka menu navigasi"
            aria-expanded={drawerOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-surface text-ink"
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi mobile"
        >
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs"
            onClick={closeDrawer}
          />
          <div className="fixed inset-y-0 right-0 flex w-full max-w-xs flex-col border-l border-hairline bg-canvas p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-hairline pb-4">
              <BrandLogo />
              <button
                ref={closeRef}
                type="button"
                onClick={closeDrawer}
                aria-label="Tutup menu navigasi"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-surface text-ink"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <nav aria-label="Menu mobile" className="mt-6 flex flex-1 flex-col gap-2">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className="flex min-h-[44px] items-center rounded-xl px-3.5 text-base font-medium text-ink transition-colors hover:bg-subtle"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/masuk"
                onClick={() => setDrawerOpen(false)}
                className="flex min-h-[44px] items-center rounded-xl px-3.5 text-base font-medium text-ink transition-colors hover:bg-subtle"
              >
                Masuk / Daftar Trial
              </Link>
            </nav>

            <div className="mt-auto space-y-2.5 border-t border-hairline pt-4">
              <Link
                href="/buat"
                onClick={() => setDrawerOpen(false)}
                className="flex h-12 w-full items-center justify-center rounded-full bg-emerald-brand text-[15px] font-semibold text-white"
              >
                Buat Sekarang
              </Link>
              <a
                href={buildWhatsAppUrl("Halo Kado Digital, saya mau tanya sebelum pesan.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-hairline bg-surface text-[15px] font-semibold text-ink"
              >
                <MessageCircle className="h-4 w-4 text-emerald-brand" />
                Tanya via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
