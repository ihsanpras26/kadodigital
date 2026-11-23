import { z } from "zod";

export const ProductLineSchema = z.enum([
  "kado-personal",
  "wedding",
  "save-the-date",
  "event-party",
  "lensa-momen",
  "rencana-momen",
]);

export type ProductLine = z.infer<typeof ProductLineSchema>;

export const ThemeColorTagSchema = z.enum([
  "emerald",
  "linen",
  "emas",
  "maroon",
  "hitam",
  "blush",
  "putih",
  "sage",
]);

export type ThemeColorTag = z.infer<typeof ThemeColorTagSchema>;

export const DemoArchetypeSchema = z.enum([
  "anniversary-letter",
  "birthday-unwrapped",
  "polaroid-memoir",
  "nocturne-keepsake",
  "wedding-modern",
  "wedding-adat",
  "save-the-date",
  "event-party",
  "desa-3d-wedding",
  "desa-3d-kado",
]);

export type DemoArchetype = z.infer<typeof DemoArchetypeSchema>;

export const ThemePaletteSchema = z.object({
  accent: z.string(),
  base: z.string(),
  soft: z.string(),
});

export const ThemeItemSchema = z.object({
  slug: z.string(),
  name: z.string(),
  line: ProductLineSchema,
  subCategory: z.string(),
  tagline: z.string(),
  story: z.string(),
  palette: ThemePaletteSchema,
  colorTags: z.array(ThemeColorTagSchema),
  recommendedPackages: z.array(z.string()),
  startingPrice: z.number().int().nonnegative(),
  mechanics: z.array(z.string()),
  features: z.array(z.string()),
  demoArchetype: DemoArchetypeSchema,
  typographyStyle: z.enum([
    "editorial-serif",
    "playful-display",
    "handwritten-warm",
    "nocturne-classic",
    "modern-clean",
    "nusantara-regal",
  ]),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  badge: z.string().optional(),
});

export type ThemeItem = z.infer<typeof ThemeItemSchema>;

export const PricingTierSchema = z.object({
  id: z.string(),
  tab: z.enum(["kado-personal", "wedding", "save-the-date", "event-party"]),
  name: z.string(),
  subtitle: z.string(),
  activePeriod: z.string(),
  price: z.number().int().nonnegative(),
  originalPrice: z.number().int().nonnegative().optional(),
  modeNote: z.string(),
  badge: z.string().optional(),
  highlighted: z.boolean().optional(),
  features: z.array(z.string()),
  ctaLabel: z.string(),
});

export type PricingTier = z.infer<typeof PricingTierSchema>;

export const GiftProjectDraftSchema = z.object({
  mode: z.enum(["mandiri", "terima-beres"]),
  themeSlug: z.string(),
  packageId: z.string(),
  moment: z.string(),
  recipientNickname: z.string(),
  senderName: z.string(),
  headline: z.string(),
  releaseDate: z.string(),
  releaseTimezone: z.enum(["WIB", "WITA", "WIT"]),
  letterBody: z.string(),
  photoCaptions: z.array(z.string()).length(3),
  mechanics: z.object({
    flipPhoto: z.boolean(),
    scratchReveal: z.boolean(),
    memoryQuiz: z.boolean(),
    passphraseLock: z.boolean(),
  }),
  passphraseHint: z.string(),
  passphraseCode: z.string(),
  scratchSecret: z.string(),
  conciergeStoryPoint1: z.string(),
  conciergeStoryPoint2: z.string(),
  conciergeInsideJoke: z.string(),
  conciergeExpress: z.boolean(),
  whatsappNumber: z.string(),
  lastSavedAt: z.string().optional(),
});

export type GiftProjectDraft = z.infer<typeof GiftProjectDraftSchema>;
