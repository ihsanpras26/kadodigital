import { Layers, Lock, Sparkles, Users } from "lucide-react";

const PILLARS = [
  {
    icon: Layers,
    title: "4 Lini Momen Lengkap",
    detail: "Kado Personal, Wedding, Save The Date, hingga Event & Party dalam satu platform.",
  },
  {
    icon: Sparkles,
    title: "Interaksi Hidup di HP",
    detail: "Amplop pembuka, balik foto, gores pesan rahasia, kuis kenangan, hingga voice note.",
  },
  {
    icon: Users,
    title: "Mandiri atau Terima Beres",
    detail: "Rangkai sendiri secara instan di editor, atau biarkan tim studio merapikan untukmu.",
  },
  {
    icon: Lock,
    title: "Privasi & Rilis Terjadwal",
    detail: "Token acak noindex, passphrase opsional, dan kunci jam rilis akurat di server.",
  },
];

export function CapabilitiesStrip() {
  return (
    <section aria-label="Keunggulan utama platform" className="border-y border-hairline bg-surface">
      <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-emerald-brand">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-ink">{item.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted text-pretty">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
