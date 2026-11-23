import type { SVGProps } from "react";
import type { DesaStationId, DesaTimeOfDay } from "@/data/desaWorldData";

type IconProps = SVGProps<SVGSVGElement>;

export function VillageTimeIcon({
  time,
  ...props
}: IconProps & { time: DesaTimeOfDay }) {
  if (time === "malam") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
        <path d="M20 14.2A8.5 8.5 0 0 1 9.8 4a7.5 7.5 0 1 0 10.2 10.2Z" />
        <path d="M16.5 4.5v2M15.5 5.5h2" />
      </svg>
    );
  }
  if (time === "sore") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
        <circle cx="12" cy="12" r="4.5" fill="currentColor" fillOpacity="0.18" />
        <path d="M12 2.5v2.5M12 19v2.5M4.5 12H2M22 12h-2.5M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="12" cy="13" r="4" />
      <path d="M12 4v2.5M5.8 7.3l1.7 1.7M18.2 7.3l-1.7 1.7M3 17h18" />
    </svg>
  );
}

export function VillageMapIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M3.5 6.5 9 4l6 2.5 5.5-2.5v13.5L15 20l-6-2.5L3.5 20V6.5Z" />
      <path d="M9 4v13.5M15 6.5V20" />
    </svg>
  );
}

export function VillageJournalIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M6.5 4h11A1.5 1.5 0 0 1 19 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-11A2.5 2.5 0 0 1 4 17.5v-11A2.5 2.5 0 0 1 6.5 4Z" />
      <path d="M8 4v16M11.5 9h4M11.5 13h3" />
    </svg>
  );
}

export function VillageSoundIcon({
  muted = false,
  ...props
}: IconProps & { muted?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M11 5 6 9H3.5v6H6l5 4V5Z" />
      {muted ? (
        <path d="m16 9.5 4.5 5m0-5L16 14.5" />
      ) : (
        <>
          <path d="M15.5 8.8a4.5 4.5 0 0 1 0 6.4" />
          <path d="M18.3 6.3a8 8 0 0 1 0 11.4" />
        </>
      )}
    </svg>
  );
}

export function VillageGearIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.2a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.2a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.2a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.2a1.6 1.6 0 0 0-1.4.9Z" />
    </svg>
  );
}

export function VillageStationIcon({
  id,
  ...props
}: IconProps & { id: DesaStationId }) {
  switch (id) {
    case "surat":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
          <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
          <path d="m4.5 7 7.5 5.5L19.5 7" />
        </svg>
      );
    case "acara":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
          <path d="M12 3 8 8.5H3.5l2 2.5h13l2-2.5H16L12 3Z" />
          <path d="M6.5 11v7M17.5 11v7M4 18h16M9.5 18v-3.5h5V18" />
        </svg>
      );
    case "ucapan":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
          <path d="M5 19.5V5.5A1.5 1.5 0 0 1 6.5 4H18a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5H8.5L5 19.5Z" />
          <path d="M8.5 8.5h7M8.5 12h4.5" />
        </svg>
      );
    case "kado":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
          <rect x="4" y="9" width="16" height="11" rx="2" />
          <path d="M3 9h18M12 9v11M12 9c-1.5 0-3.5-1-3.5-2.6a1.9 1.9 0 0 1 3.5-1.1 1.9 1.9 0 0 1 3.5 1.1C15.5 8 13.5 9 12 9Z" />
        </svg>
      );
    case "cerita":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
          <path d="M5.5 5h12A1.5 1.5 0 0 1 19 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-12A2 2 0 0 1 3.5 17V7A2 2 0 0 1 5.5 5Z" />
          <path d="M8 5v14M11 9.5h5M11 13h4" />
        </svg>
      );
    case "galeri":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
          <rect x="3.5" y="5" width="17" height="14" rx="2" />
          <circle cx="9" cy="10" r="1.4" />
          <path d="m6 16.5 4.2-4 3 2.7 2.4-2.1 2.4 3.4" />
        </svg>
      );
  }
}

export function VillageCloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}
