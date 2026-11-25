import type { GachaMode } from "./gachaData";

export interface GachaCustomOverrides {
  mode: GachaMode;
  recipient: string;
  sender: string;
  dateLabel?: string;
  pinCode?: string;
  pinHint?: string;
  polaroidCaption?: string;
  polaroidSecret?: string;
  voiceMessage?: string;
  voucherTitle?: string;
  voucherDetail?: string;
}

const VALID_MODES: readonly GachaMode[] = ["anniversary", "ultah", "sahabat"];

function toBase64Url(utf8Bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(token: string): Uint8Array {
  const normalized = token.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  const binary = atob(normalized + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function encodeGiftOverrides(data: GachaCustomOverrides): string {
  const clean: Record<string, string> = {
    m: data.mode,
    r: data.recipient.trim(),
    s: data.sender.trim(),
  };
  if (data.dateLabel?.trim()) clean.d = data.dateLabel.trim();
  if (data.pinCode?.trim() && /^\d{4}$/.test(data.pinCode.trim())) {
    clean.p = data.pinCode.trim();
  }
  if (data.pinHint?.trim()) clean.h = data.pinHint.trim();
  if (data.polaroidCaption?.trim()) clean.pc = data.polaroidCaption.trim();
  if (data.polaroidSecret?.trim()) clean.ps = data.polaroidSecret.trim();
  if (data.voiceMessage?.trim()) clean.vm = data.voiceMessage.trim();
  if (data.voucherTitle?.trim()) clean.vt = data.voucherTitle.trim();
  if (data.voucherDetail?.trim()) clean.vd = data.voucherDetail.trim();

  const json = JSON.stringify(clean);
  const bytes = new TextEncoder().encode(json);
  return toBase64Url(bytes);
}

export function decodeGiftOverrides(raw: string | null): GachaCustomOverrides | null {
  if (!raw || !raw.trim()) return null;
  try {
    const bytes = fromBase64Url(raw.trim());
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return null;

    const rawMode = typeof parsed.m === "string" ? parsed.m : "anniversary";
    const mode: GachaMode = VALID_MODES.includes(rawMode as GachaMode)
      ? (rawMode as GachaMode)
      : "anniversary";

    const pickStr = (k: string, maxLen: number): string | undefined => {
      const val = parsed[k];
      if (typeof val !== "string") return undefined;
      const trimmed = val.trim();
      return trimmed ? trimmed.slice(0, maxLen) : undefined;
    };

    const rawPin = pickStr("p", 4);
    const pinCode = rawPin && /^\d{4}$/.test(rawPin) ? rawPin : undefined;

    return {
      mode,
      recipient: pickStr("r", 64) ?? "",
      sender: pickStr("s", 64) ?? "",
      dateLabel: pickStr("d", 40),
      pinCode,
      pinHint: pickStr("h", 90),
      polaroidCaption: pickStr("pc", 140),
      polaroidSecret: pickStr("ps", 260),
      voiceMessage: pickStr("vm", 380),
      voucherTitle: pickStr("vt", 100),
      voucherDetail: pickStr("vd", 240),
    };
  } catch {
    return null;
  }
}

export function slugifyRecipient(name: string): string {
  const clean = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return clean || "spesial";
}

export function readableNameFromSlug(slug: string): string {
  try {
    const decoded = decodeURIComponent(slug);
    const words = decoded
      .split("-")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1));
    return words.length > 0 ? words.join(" ") : "Kamu";
  } catch {
    return "Kamu";
  }
}

export function buildExclusiveGiftUrl(
  origin: string,
  overrides: GachaCustomOverrides,
): string {
  const slug = slugifyRecipient(overrides.recipient || "spesial");
  const token = encodeGiftOverrides(overrides);
  const safeOrigin = origin.replace(/\/+$/, "");
  return `${safeOrigin}/k/${slug}?g=${encodeURIComponent(token)}`;
}
