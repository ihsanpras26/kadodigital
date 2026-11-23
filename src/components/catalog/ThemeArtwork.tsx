import type { ThemeItem } from "@/lib/schemas";
import { isDarkHex } from "@/lib/color";

interface ThemeArtworkProps {
  theme: ThemeItem;
  compact?: boolean;
}

const TYPOGRAPHY_CLASS: Record<ThemeItem["typographyStyle"], string> = {
  "editorial-serif": "font-editorial-alt",
  "playful-display": "font-display-alt",
  "handwritten-warm": "font-hand",
  "nocturne-classic": "font-editorial-alt",
  "modern-clean": "font-sans",
  "nusantara-regal": "font-editorial-alt",
};

export function ThemeArtwork({ theme, compact = false }: ThemeArtworkProps) {
  const { accent, base, soft } = theme.palette;
  const darkBase = isDarkHex(base);
  const darkAccent = isDarkHex(accent);
  const inkOnBase = darkBase ? "#F7F4EC" : "#1B1921";
  const mutedOnBase = darkBase ? "rgba(247,244,236,0.68)" : "rgba(27,25,33,0.62)";
  const inkOnAccent = darkAccent ? "#FFFFFF" : "#18181D";
  const fontClass = TYPOGRAPHY_CLASS[theme.typographyStyle];

  return (
    <div
      className="relative aspect-[4/5] w-full overflow-hidden rounded-[16px] border border-hairline/70 select-none"
      style={{ backgroundColor: base, color: inkOnBase }}
      aria-hidden="true"
    >
      {/* Subtle geometric backdrop tailored by archetype */}
      {(theme.demoArchetype === "desa-3d-wedding" || theme.demoArchetype === "desa-3d-kado") && (
        <div className="relative flex h-full flex-col justify-between overflow-hidden p-4">
          <img
            src={
              theme.demoArchetype === "desa-3d-wedding"
                ? "/themes/desa-asri/scene-3.png"
                : "/themes/desa-asri/scene-1.png"
            }
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(19,38,30,0.42) 0%, rgba(19,38,30,0.12) 45%, rgba(28,16,10,0.72) 100%)",
            }}
          />

          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="rounded-full bg-[#2D6A4F]/95 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#F8F2E6] uppercase shadow-xs">
              3D Dunia Desa
            </span>
            <span className="rounded-full bg-[#F8F2E6]/95 px-2.5 py-0.5 text-[10px] font-semibold text-[#4B2616]">
              {theme.demoArchetype === "desa-3d-wedding" ? "Pendopo" : "Saung"}
            </span>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[202px] rounded-xl border-2 border-[#4B2616] bg-[#6B3A24] p-3 text-center shadow-md">
            <div className="rounded-lg border border-[#EADBC6]/35 bg-[#F8F2E6] px-3 py-2.5 text-[#3B1E11]">
              <p className="text-[9px] font-bold tracking-[0.18em] text-[#2D6A4F] uppercase">
                {theme.demoArchetype === "desa-3d-wedding" ? "Undangan 3D" : "Kado 3D"}
              </p>
              <p className={`mt-1 text-base leading-tight font-bold ${fontClass}`}>
                {theme.demoArchetype === "desa-3d-wedding" ? "Raka & Nadya" : "Untuk Nadya"}
              </p>
              <p className="mt-1 text-[10px] font-semibold text-[#79533D]">
                Jalan-jalan di Desa Asri →
              </p>
            </div>
          </div>

          <div className="relative z-10 text-center text-[11px] font-semibold text-[#F8F2E6] drop-shadow-xs">
            Sawah · Jembatan · Kunang-kunang
          </div>
        </div>
      )}

      {theme.demoArchetype === "anniversary-letter" && (
        <div className="flex h-full flex-col items-center justify-between p-5">
          <div className="flex w-full items-center justify-between text-[10px] tracking-[0.18em] uppercase" style={{ color: mutedOnBase }}>
            <span>{theme.subCategory}</span>
            <span>03 Bab</span>
          </div>

          {/* Stacked stationery cards + wax seal */}
          <div className="relative flex w-full max-w-[196px] flex-col items-center">
            <div
              className="absolute -top-3 -right-2 h-24 w-20 rotate-6 rounded-lg border shadow-xs"
              style={{ backgroundColor: soft, borderColor: `${accent}33` }}
            >
              <div className="m-2 h-14 rounded-sm opacity-60" style={{ backgroundColor: accent }} />
            </div>

            <div
              className="relative z-10 w-full rounded-xl border p-4 shadow-sm"
              style={{
                backgroundColor: darkBase ? "#23253D" : "#FFFFFF",
                borderColor: `${accent}2E`,
              }}
            >
              <p className="text-[10px] tracking-[0.14em] uppercase" style={{ color: accent }}>
                Untukmu
              </p>
              <p className={`mt-1 text-xl leading-tight font-semibold ${fontClass}`}>
                Dua Tahun &amp; Setiap Kopi Pagi
              </p>
              <div className="mt-3 flex items-center justify-between border-t pt-2.5" style={{ borderColor: `${accent}22` }}>
                <span className="text-[11px]" style={{ color: mutedOnBase }}>
                  Ketuk segel
                </span>
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold shadow-xs"
                  style={{ backgroundColor: accent, color: inkOnAccent }}
                >
                  KD
                </span>
              </div>
            </div>
          </div>

          <div
            className="rounded-full px-3 py-1 text-[11px] font-medium"
            style={{ backgroundColor: soft, color: darkBase ? "#F7F4EC" : "#1B1921" }}
          >
            Amplop · Flip Foto · Gores
          </div>
        </div>
      )}

      {theme.demoArchetype === "birthday-unwrapped" && (
        <div className="flex h-full flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase"
              style={{ backgroundColor: soft, color: "#1B1830" }}
            >
              {theme.subCategory}
            </span>
            <span className="h-3 w-3 rotate-45 rounded-[2px]" style={{ backgroundColor: accent }} />
          </div>

          <div className="relative mx-auto w-full max-w-[198px]">
            <div
              className="relative rounded-2xl border-2 p-4 shadow-sm"
              style={{ backgroundColor: "#FFFFFF", borderColor: accent }}
            >
              {/* Ribbon cross */}
              <div
                className="mx-auto mb-2.5 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                style={{ backgroundColor: accent, color: inkOnAccent }}
              >
                ★
              </div>
              <p className={`text-center text-lg leading-tight font-bold text-[#1B1830] ${fontClass}`}>
                Selamat Tambah Usia, Raka!
              </p>
              <p className="mt-1.5 text-center text-[11px] text-[#5B566E]">
                Tarik pita &amp; jawab 3 kuis seru
              </p>
              <div
                className="mt-3 rounded-full py-1.5 text-center text-[11px] font-semibold"
                style={{ backgroundColor: soft, color: "#1B1830" }}
              >
                Buka Kejutan →
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-1.5">
            <span className="h-2 w-6 rounded-full" style={{ backgroundColor: accent }} />
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: soft }} />
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent, opacity: 0.4 }} />
          </div>
        </div>
      )}

      {theme.demoArchetype === "polaroid-memoir" && (
        <div className="flex h-full flex-col justify-between p-5">
          <div className="flex items-center justify-between text-[10px] tracking-[0.14em] uppercase" style={{ color: mutedOnBase }}>
            <span>Polaroid Deck</span>
            <span>Sahabat</span>
          </div>

          <div className="relative mx-auto flex h-44 w-full max-w-[196px] items-center justify-center">
            <div
              className="absolute left-2 top-3 h-36 w-28 -rotate-6 rounded-lg border bg-white p-2 shadow-xs"
              style={{ borderColor: `${accent}30` }}
            >
              <div className="h-24 rounded-sm" style={{ backgroundColor: soft }} />
              <p className="mt-1.5 font-hand text-xs text-[#2B2623]">Kopi sore 2024</p>
            </div>
            <div
              className="relative z-10 ml-8 h-38 w-32 rotate-4 rounded-lg border bg-white p-2.5 shadow-sm"
              style={{ borderColor: `${accent}44` }}
            >
              <div
                className="mx-auto -mt-4 mb-1.5 h-3 w-12 rounded-xs opacity-85"
                style={{ backgroundColor: accent }}
              />
              <div className="flex h-22 items-center justify-center rounded-sm p-2 text-center" style={{ backgroundColor: soft }}>
                <span className="font-hand text-base font-bold text-[#2B2623]">
                  Balik buat baca catatan!
                </span>
              </div>
              <p className="mt-1.5 font-hand text-sm text-[#2B2623]">Tim Anti Wacana</p>
            </div>
          </div>

          <p className={`text-center text-base font-semibold ${fontClass}`} style={{ color: accent }}>
            8 foto + voice note geng
          </p>
        </div>
      )}

      {theme.demoArchetype === "nocturne-keepsake" && (
        <div className="flex h-full flex-col justify-between p-5">
          <div className="flex items-center justify-between text-[10px] tracking-[0.2em] uppercase" style={{ color: mutedOnBase }}>
            <span>00:00 WIB</span>
            <span>Terjadwal</span>
          </div>

          <div
            className="mx-auto flex w-full max-w-[192px] flex-col items-center rounded-t-full rounded-b-2xl border px-4 py-6 text-center"
            style={{ borderColor: `${accent}55`, backgroundColor: soft }}
          >
            <div
              className="mb-3 flex h-8 w-8 items-center justify-center rounded-full border text-xs"
              style={{ borderColor: accent, color: accent }}
            >
              ✦
            </div>
            <p className={`text-lg leading-snug italic ${fontClass}`} style={{ color: inkOnBase }}>
              Untuk kamu di kota seberang
            </p>
            <div
              className="mt-3 rounded-full border px-3 py-1 text-[10px] tracking-widest uppercase"
              style={{ borderColor: `${accent}66`, color: accent }}
            >
              Kode · ••••
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px]" style={{ color: mutedOnBase }}>
            <span>Surat Malam</span>
            <span>·</span>
            <span>Voice Note</span>
          </div>
        </div>
      )}

      {(theme.demoArchetype === "wedding-modern" || theme.demoArchetype === "wedding-adat") && (
        <div className="flex h-full flex-col items-center justify-between p-5 text-center">
          <div className="flex w-full items-center justify-between text-[10px] tracking-[0.16em] uppercase" style={{ color: mutedOnBase }}>
            <span>{theme.demoArchetype === "wedding-adat" ? "Adat Nusantara" : "The Wedding"}</span>
            <span>RSVP</span>
          </div>

          <div
            className={`flex w-full max-w-[188px] flex-col items-center border px-4 py-5 ${
              theme.demoArchetype === "wedding-adat"
                ? "rounded-xl border-double border-4"
                : "rounded-t-full rounded-b-xl"
            }`}
            style={{
              borderColor: `${accent}66`,
              backgroundColor: darkBase ? soft : "#FFFFFF",
            }}
          >
            {theme.demoArchetype === "wedding-adat" && (
              <span className="mb-1 text-xs" style={{ color: accent }}>
                ❖ ❖ ❖
              </span>
            )}
            <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: mutedOnBase }}>
              Walimatul Ursy
            </p>
            <p className={`mt-2 text-2xl leading-none font-medium ${fontClass}`} style={{ color: inkOnBase }}>
              Alya &amp; Dimas
            </p>
            <span className="my-2.5 h-px w-10" style={{ backgroundColor: accent }} />
            <p className="text-[11px] tabular-nums" style={{ color: mutedOnBase }}>
              14 · 02 · 2027
            </p>
            <div
              className="mt-3 rounded-full px-3 py-1 text-[10px] font-semibold"
              style={{ backgroundColor: accent, color: inkOnAccent }}
            >
              Buka Undangan
            </div>
          </div>

          <div className="text-[11px]" style={{ color: mutedOnBase }}>
            Maps · Amplop Digital · QR Check-in
          </div>
        </div>
      )}

      {theme.demoArchetype === "save-the-date" && (
        <div className="flex h-full flex-col items-center justify-between p-5 text-center">
          <span className="text-[10px] font-semibold tracking-[0.22em] uppercase" style={{ color: accent }}>
            Save The Date
          </span>
          <div
            className="w-full max-w-[186px] rounded-2xl border p-4"
            style={{ borderColor: `${accent}44`, backgroundColor: darkBase ? soft : "#FFFFFF" }}
          >
            <p className="text-[11px] uppercase tracking-widest" style={{ color: mutedOnBase }}>
              Kunci Tanggalnya
            </p>
            <p className={`mt-1 text-3xl font-bold tabular-nums ${fontClass}`} style={{ color: accent }}>
              22·08
            </p>
            <p className={`mt-1 text-base font-medium ${fontClass}`} style={{ color: inkOnBase }}>
              Nadia &amp; Farhan
            </p>
          </div>
          <div
            className="rounded-full px-3 py-1 text-[11px] font-medium"
            style={{ backgroundColor: soft, color: inkOnBase }}
          >
            + Simpan ke Kalender
          </div>
        </div>
      )}

      {theme.demoArchetype === "event-party" && (
        <div className="flex h-full flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
              style={{ backgroundColor: soft, color: inkOnBase }}
            >
              {theme.subCategory}
            </span>
            <span className="text-xs font-semibold" style={{ color: accent }}>
              RSVP
            </span>
          </div>

          <div
            className="mx-auto w-full max-w-[192px] rounded-2xl border p-4 text-center"
            style={{ backgroundColor: "#FFFFFF", borderColor: `${accent}3D` }}
          >
            <p className="text-[10px] tracking-[0.16em] uppercase text-[#66606D]">
              Kamu Diundang ke
            </p>
            <p className={`mt-1.5 text-lg leading-tight font-bold text-[#18181E] ${fontClass}`}>
              {theme.subCategory === "Wisuda" && "Syukuran Wisuda S.Kom"}
              {theme.subCategory === "Aqiqah" && "Tasyakuran Aqiqah Zayd"}
              {theme.subCategory === "Khitanan" && "Walimatul Khitan Rayyan"}
              {theme.subCategory === "Bukber" && "Bukber & Reuni 2027"}
              {theme.subCategory === "Hari Raya" && "Silaturahmi & Open House"}
              {theme.subCategory === "Birthday Party" && "Kezia's 23rd Dinner"}
            </p>
            <div
              className="mt-3 rounded-full py-1 text-[11px] font-semibold"
              style={{ backgroundColor: accent, color: inkOnAccent }}
            >
              Konfirmasi Hadir
            </div>
          </div>

          {!compact && (
            <div className="text-center text-[11px]" style={{ color: mutedOnBase }}>
              Peta Lokasi · Galeri · Ucapan Tamu
            </div>
          )}
        </div>
      )}
    </div>
  );
}
