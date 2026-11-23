import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/format";

export function FloatingWhatsApp() {
  return (
    <a
      href={buildWhatsAppUrl("Halo Kado Digital, saya mau tanya soal tema & paketnya.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Tanya tim Kado Digital via WhatsApp"
      className="fixed right-5 bottom-5 z-40 inline-flex h-12 items-center gap-2 rounded-full border border-emerald-pressed/20 bg-emerald-brand px-4 text-sm font-semibold text-white shadow-lg transition-transform duration-150 hover:-translate-y-0.5 hover:bg-emerald-hover"
    >
      <MessageCircle className="h-4 w-4 shrink-0" strokeWidth={2} />
      <span className="hidden sm:inline">Tanya Studio</span>
    </a>
  );
}
