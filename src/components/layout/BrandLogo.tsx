import Link from "next/link";

interface BrandLogoProps {
  inverted?: boolean;
  showText?: boolean;
}

export function BrandLogo({ inverted = false, showText = true }: BrandLogoProps) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4"
      aria-label="Kado Digital — Beranda"
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          x="2.5"
          y="7.5"
          width="23"
          height="18"
          rx="4.5"
          fill={inverted ? "#F8F7F4" : "#1B5E47"}
        />
        <path
          d="M4.5 10L14 17.2L23.5 10"
          stroke={inverted ? "#1B5E47" : "#F8F7F4"}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M25.5 3.5L26.6 6.4L29.5 7.5L26.6 8.6L25.5 11.5L24.4 8.6L21.5 7.5L24.4 6.4L25.5 3.5Z"
          fill="#D4A359"
        />
      </svg>
      {showText && (
        <span
          className={`text-[18px] font-bold tracking-[-0.03em] ${
            inverted ? "text-inverse" : "text-ink"
          }`}
        >
          Kado <span className={inverted ? "text-gold" : "text-emerald-brand"}>Digital</span>
        </span>
      )}
    </Link>
  );
}
