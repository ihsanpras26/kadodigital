"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingWhatsApp } from "./FloatingWhatsApp";

export function ChromeShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isImmersiveRoute =
    pathname.startsWith("/demo/") ||
    pathname.startsWith("/k/") ||
    pathname.startsWith("/u/");

  if (isImmersiveRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
