export type CelestialAtmosphere = "malam" | "senja" | "aurora";

export interface CelestialWeddingOverrides {
  groomName?: string;
  brideName?: string;
  dateDisplay?: string;
  isoDate?: string;
  venueName?: string;
  venueAddress?: string;
  akadTime?: string;
  resepsiTime?: string;
  openingQuote?: string;
  bankName?: string;
  bankNumber?: string;
  bankOwner?: string;
  atmosphere?: CelestialAtmosphere;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(token: string): Uint8Array {
  const padded = token.replace(/-/g, "+").replace(/_/g, "/");
  const mod = padded.length % 4;
  const normalized = mod === 0 ? padded : padded + "=".repeat(4 - mod);
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function encodeWeddingOverrides(overrides: CelestialWeddingOverrides): string {
  const compact: Record<string, string> = {};
  const map: [keyof CelestialWeddingOverrides, string][] = [
    ["groomName", "gr"],
    ["brideName", "br"],
    ["dateDisplay", "dd"],
    ["isoDate", "id"],
    ["venueName", "vn"],
    ["venueAddress", "va"],
    ["akadTime", "ak"],
    ["resepsiTime", "rs"],
    ["openingQuote", "oq"],
    ["bankName", "bn"],
    ["bankNumber", "bu"],
    ["bankOwner", "bo"],
    ["atmosphere", "at"],
  ];

  for (const [field, key] of map) {
    const val = overrides[field];
    if (typeof val === "string" && val.trim().length > 0) {
      compact[key] = val.trim();
    }
  }

  const json = JSON.stringify(compact);
  const bytes = new TextEncoder().encode(json);
  return bytesToBase64Url(bytes);
}

export function decodeWeddingOverrides(
  token: string | null | undefined,
): CelestialWeddingOverrides {
  if (!token || !token.trim()) return {};
  try {
    const bytes = base64UrlToBytes(token.trim());
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>;
    const pick = (k: string) =>
      typeof parsed[k] === "string" && parsed[k].trim().length > 0
        ? parsed[k].trim()
        : undefined;
    const at = pick("at");
    const atmosphere: CelestialAtmosphere | undefined =
      at === "malam" || at === "senja" || at === "aurora" ? at : undefined;

    return {
      groomName: pick("gr"),
      brideName: pick("br"),
      dateDisplay: pick("dd"),
      isoDate: pick("id"),
      venueName: pick("vn"),
      venueAddress: pick("va"),
      akadTime: pick("ak"),
      resepsiTime: pick("rs"),
      openingQuote: pick("oq"),
      bankName: pick("bn"),
      bankNumber: pick("bu"),
      bankOwner: pick("bo"),
      atmosphere,
    };
  } catch {
    return {};
  }
}

function firstWordSlug(name: string, fallback: string): string {
  const first = name.trim().split(/\s+/)[0] ?? "";
  const cleaned = first
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
  return cleaned || fallback;
}

export function slugifyCouple(groomName: string, brideName: string): string {
  const g = firstWordSlug(groomName, "raka");
  const b = firstWordSlug(brideName, "nadya");
  return `${g}-${b}`;
}

export function readableCoupleFromSlug(slug: string): string {
  const parts = slug
    .split("-")
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1));
  if (parts.length >= 2) return `${parts[0]} & ${parts[1]}`;
  if (parts.length === 1) return parts[0]!;
  return "Raka & Nadya";
}

export function buildExclusiveWeddingUrl(
  origin: string,
  overrides: CelestialWeddingOverrides,
  guestName?: string,
): string {
  const slug = slugifyCouple(overrides.groomName ?? "Raka", overrides.brideName ?? "Nadya");
  const params = new URLSearchParams();
  if (guestName && guestName.trim()) {
    params.set("to", guestName.trim());
  }
  const encoded = encodeWeddingOverrides(overrides);
  if (encoded && encoded !== "e30") {
    params.set("g", encoded);
  }
  const qs = params.toString();
  const base = origin ? origin.replace(/\/$/, "") : "";
  return `${base}/u/${slug}${qs ? `?${qs}` : ""}`;
}
