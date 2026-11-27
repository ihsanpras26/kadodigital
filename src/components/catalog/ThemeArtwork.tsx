import type { ThemeItem } from "@/lib/schemas";
import { isDarkHex } from "@/lib/color";
import { getThemePreviewMeta } from "@/lib/themePreviewMeta";

interface ThemeArtworkProps {
  theme: ThemeItem;
  compact?: boolean;
  aspectClass?: string;
}

function MiniStatusBar({
  darkSurface = true,
  bgColor,
}: {
  darkSurface?: boolean;
  bgColor: string;
}) {
  const textTone = darkSurface ? "text-white/95" : "text-[#16201B]";
  const barTone = darkSurface ? "bg-white/90" : "bg-[#16201B]/85";

  return (
    <div
      className={`relative z-20 flex h-[17px] shrink-0 items-center justify-between px-2 text-[6.5px] font-semibold tracking-tight ${textTone} ${
        darkSurface ? "" : "border-b border-black/5"
      }`}
      style={{ backgroundColor: bgColor }}
    >
      <span className="tabular-nums leading-none">9:41</span>
      <span className="flex h-[6.5px] w-[26px] items-center justify-end rounded-full bg-[#07090C] px-1 ring-1 ring-white/10">
        <span className="h-[2.5px] w-[2.5px] rounded-full bg-[#1C2C4A]" />
      </span>
      <span className="flex items-center gap-[1.5px]">
        <span className={`h-[3.5px] w-[1.5px] rounded-full ${barTone}`} />
        <span className={`h-[4.5px] w-[1.5px] rounded-full ${barTone}`} />
        <span className={`h-[5.5px] w-[1.5px] rounded-full ${barTone}`} />
        <span
          className={`ml-0.5 flex h-[5.5px] w-[9px] items-center rounded-[1.5px] border p-[1px] ${
            darkSurface ? "border-white/75" : "border-[#16201B]/70"
          }`}
        >
          <span className={`h-full w-[75%] rounded-[1px] ${barTone}`} />
        </span>
      </span>
    </div>
  );
}

export function ThemeArtwork({
  theme,
  aspectClass = "aspect-[4/5]",
}: ThemeArtworkProps) {
  const { accent, base, soft } = theme.palette;
  const darkBase = isDarkHex(base);
  const spec = getThemePreviewMeta(theme);

  const isCelestial3d = theme.demoArchetype === "celestial-3d-wedding";
  const isDesa3d =
    theme.demoArchetype === "desa-3d-wedding" ||
    theme.demoArchetype === "desa-3d-kado";
  const isGacha = theme.demoArchetype === "gacha-struk";
  const darkStatusBar = darkBase || isCelestial3d || isDesa3d || isGacha;

  const statusBarBg = isCelestial3d
    ? "#080D24"
    : isGacha
      ? "#14100E"
      : isDesa3d
        ? "#142119"
        : theme.slug === "royal-sogan"
          ? "#EADBC0"
          : theme.slug === "minang-heritage"
            ? "#480D17"
            : theme.slug === "serene-garden"
              ? "#466658"
              : theme.slug === "atelier-noir"
                ? "#0E0F12"
                : base;

  const coverDarkStatus =
    darkStatusBar ||
    theme.slug === "minang-heritage" ||
    theme.slug === "serene-garden" ||
    theme.slug === "atelier-noir" ||
    theme.slug === "lumiere-motion" ||
    theme.slug === "island-hearth";

  const studioBg =
    isCelestial3d
      ? "radial-gradient(circle at 75% 20%, rgba(239,200,110,0.18) 0%, #12172B 68%, #0B0F1E 100%)"
      : isGacha
        ? "radial-gradient(circle at 75% 22%, rgba(214,165,75,0.22) 0%, #1D1512 65%, #120D0B 100%)"
        : darkBase
          ? `radial-gradient(circle at 75% 18%, ${accent}24 0%, #151926 70%, #0E111B 100%)`
          : `radial-gradient(circle at 75% 15%, ${soft} 0%, #EDEAE2 65%, #E4E0D6 100%)`;

  return (
    <div
      className={`relative flex w-full flex-col overflow-hidden rounded-[16px] border border-hairline/80 select-none ${aspectClass}`}
      style={{ background: studioBg }}
      aria-hidden="true"
    >
      {/* Top Bar Inside Card: Top-Left Safe Zone 100% Empty for ThemeCard Badge */}
      <div className="relative z-10 flex items-center justify-end px-3 pt-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider backdrop-blur-md ${
            isCelestial3d || isGacha || darkBase
              ? "border border-[#EFC86E]/40 bg-[#121626]/82 text-[#F7DC94]"
              : "border border-black/10 bg-[#FFFDF8]/88 text-ink"
          }`}
        >
          {spec.topTag}
        </span>
      </div>

      {/* Inveet-Style Dual-Screen Real Preview Stage */}
      <div className="relative z-10 flex flex-1 items-center justify-center gap-2.5 px-3 pt-6 pb-3.5">
        {/* LEFT DEVICE: Titanium iPhone Bezel Showing Real Cover Screen */}
        <div className="relative w-[48%] transition-transform duration-500 ease-out group-hover:-translate-y-1">
          {/* Side Hardware Buttons */}
          <span className="absolute top-[22%] -left-[2px] h-3.5 w-[2px] rounded-l-full bg-[#4B5261]" />
          <span className="absolute top-[33%] -left-[2px] h-5 w-[2px] rounded-l-full bg-[#4B5261]" />
          <span className="absolute top-[28%] -right-[2px] h-5 w-[2px] rounded-r-full bg-[#4B5261]" />

          <div className="aspect-[9/18.2] w-full rounded-[22px] bg-gradient-to-b from-[#343A46] via-[#171A21] to-[#0D0F14] p-[3.5px] ring-1 ring-white/25 shadow-[0_18px_32px_-12px_rgba(8,12,18,0.55)]">
            <div
              className="relative flex h-full w-full flex-col overflow-hidden rounded-[18.5px]"
              style={{ backgroundColor: statusBarBg }}
            >
              <MiniStatusBar
                darkSurface={coverDarkStatus}
                bgColor={statusBarBg}
              />

              <div className="relative flex-1 overflow-hidden">
                <img
                  src={`/themes/real-previews/${theme.slug}-cover.jpg`}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover object-top"
                />
              </div>

              <div className="pointer-events-none absolute right-0 bottom-1 left-0 z-20 flex justify-center">
                <span
                  className={`h-[2px] w-8 rounded-full ${
                    coverDarkStatus ? "bg-white/45" : "bg-[#18201B]/25"
                  }`}
                />
              </div>

              <div className="pointer-events-none absolute inset-0 z-20 rounded-[18.5px] bg-gradient-to-tr from-white/0 via-white/[0.03] to-white/12" />
            </div>
          </div>
        </div>

        {/* RIGHT CARD: Elevated Inside Real Demo View */}
        <div
          className={`relative aspect-[9/17] w-[46%] -translate-y-2 overflow-hidden rounded-[13px] border transition-transform duration-500 ease-out group-hover:-translate-y-3 ${
            darkBase || isCelestial3d || isGacha
              ? "border-white/20 shadow-[0_20px_36px_-14px_rgba(0,0,0,0.68)]"
              : "border-black/10 shadow-[0_20px_36px_-14px_rgba(16,22,20,0.34)]"
          }`}
        >
          <img
            src={`/themes/real-previews/${theme.slug}.jpg`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}
