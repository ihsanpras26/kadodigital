import type {
  CelestialAtmosphere,
  CelestialWeddingOverrides,
} from "./celestialShareCodec";

export type { CelestialAtmosphere, CelestialWeddingOverrides };

export type CelestialStationId =
  | "gerbang"
  | "altar"
  | "kisah"
  | "galeri"
  | "bintang";

export interface CelestialWishItem {
  id: string;
  name: string;
  attendance: "Hadir" | "Doa dari Jauh" | "Masih Ragu";
  message: string;
  timestamp: string;
}

export interface CelestialStationMeta {
  id: CelestialStationId;
  shortLabel: string;
  title: string;
  subtitle: string;
  position: [number, number, number];
  spawnPos: [number, number, number];
  cameraPos: [number, number, number];
  targetPos: [number, number, number];
}

export type CelestialNpcAccessory =
  | "wings"
  | "tiara"
  | "camera"
  | "starhat"
  | "floral";

export interface CelestialNpcData {
  id: string;
  name: string;
  roleLabel: string;
  gender: "cewek" | "cowok";
  position: [number, number, number];
  rotationY: number;
  outfitColor: string;
  accentColor: string;
  hairColor: string;
  accessory: CelestialNpcAccessory;
  dialogue: string;
}

export interface CelestialStoryChapter {
  chapter: string;
  year: string;
  title: string;
  excerpt: string;
}

export interface CelestialGalleryPhoto {
  id: string;
  src: string;
  title: string;
  dateLabel: string;
  caption: string;
}

export interface CelestialWeddingPayload {
  groomName: string;
  groomShort: string;
  groomParents: string;
  brideName: string;
  brideShort: string;
  brideParents: string;
  coupleDisplay: string;
  initials: string;
  dateDisplay: string;
  isoDate: string;
  akadTime: string;
  resepsiTime: string;
  venueName: string;
  venueAddress: string;
  mapsUrl: string;
  openingQuote: string;
  coupleGreeting: string;
  atmosphere: CelestialAtmosphere;
  bankAccount: {
    bank: string;
    number: string;
    owner: string;
  };
  storyChapters: CelestialStoryChapter[];
  photos: CelestialGalleryPhoto[];
  initialWishes: CelestialWishItem[];
}

export const CELESTIAL_STATIONS: CelestialStationMeta[] = [
  {
    id: "gerbang",
    shortLabel: "Gerbang",
    title: "Dermaga & Gerbang Bintang",
    subtitle: "Sambutan mempelai & undangan kehormatan",
    position: [0, 0.45, 12.2],
    spawnPos: [0, 0.45, 11.1],
    cameraPos: [0, 3.8, 18.2],
    targetPos: [0, 1.8, 12.2],
  },
  {
    id: "altar",
    shortLabel: "Altar",
    title: "Istana Kubah Emas",
    subtitle: "Pelaminan, jadwal sakral, countdown & kartu Story 9:16",
    position: [0, 0.45, 0],
    spawnPos: [0, 0.45, 2.35],
    cameraPos: [4.2, 4.4, 7.6],
    targetPos: [0, 1.8, -0.8],
  },
  {
    id: "kisah",
    shortLabel: "Kisah",
    title: "Pulau Memori Barat",
    subtitle: "Taman sakura cahaya & empat musim pertemuan",
    position: [-11.0, 0.45, -0.8],
    spawnPos: [-9.2, 0.45, -0.8],
    cameraPos: [-14.2, 5.2, 5.6],
    targetPos: [-11.0, 1.8, -0.8],
  },
  {
    id: "galeri",
    shortLabel: "Galeri",
    title: "Pulau Galeri Timur",
    subtitle: "Kolonade marmer & potret prewedding senja",
    position: [11.0, 0.45, -0.8],
    spawnPos: [9.2, 0.45, -0.8],
    cameraPos: [14.2, 5.2, 5.6],
    targetPos: [11.0, 1.8, -0.8],
  },
  {
    id: "bintang",
    shortLabel: "Bintang Doa",
    title: "Observatorium Doa",
    subtitle: "Lepas bintang harapan, RSVP, QR & amplop",
    position: [0, 0.45, -11.2],
    spawnPos: [0, 0.45, -9.2],
    cameraPos: [-4.6, 5.4, -16.8],
    targetPos: [0, 2.0, -11.2],
  },
];

export const CELESTIAL_NPCS: CelestialNpcData[] = [
  {
    id: "peri-gerbang",
    name: "Aurelia",
    roleLabel: "Peri Penjaga Gerbang",
    gender: "cewek",
    position: [2.05, 0.45, 11.4],
    rotationY: -0.75,
    outfitColor: "#d9c2f0",
    accentColor: "#efc86e",
    hairColor: "#46315e",
    accessory: "wings",
    dialogue:
      "Selamat datang di atas awan! Silakan melangkah melewati jembatan bintang menuju Istana Altar, atau sapa teman-teman di setiap pulau.",
  },
  {
    id: "pagar-ayu",
    name: "Laras",
    roleLabel: "Pagar Ayu Istana",
    gender: "cewek",
    position: [-2.35, 0.45, 3.65],
    rotationY: 0.45,
    outfitColor: "#f0dcc0",
    accentColor: "#e6b85c",
    hairColor: "#2d1c16",
    accessory: "tiara",
    dialogue:
      "Pengantin sudah menanti di pelaminan tengah kubah. Jangan lupa abadikan momen di Pulau Galeri Timur atau kirim doa di utara ya!",
  },
  {
    id: "sahabat-kisah",
    name: "Dinda",
    roleLabel: "Sahabat Mempelai",
    gender: "cewek",
    position: [-9.9, 0.45, 0.85],
    rotationY: 0.9,
    outfitColor: "#f2c1d1",
    accentColor: "#efc86e",
    hairColor: "#3d2219",
    accessory: "floral",
    dialogue:
      "Di taman sakura ini tersimpan 4 bab perjalanan cinta mereka sejak 2021. Klik ikon Kisah atau kristal bercahaya untuk membacanya!",
  },
  {
    id: "fotografer",
    name: "Bimo",
    roleLabel: "Fotografer Awan",
    gender: "cowok",
    position: [9.8, 0.45, 0.95],
    rotationY: -0.85,
    outfitColor: "#1b2954",
    accentColor: "#efc86e",
    hairColor: "#221814",
    accessory: "camera",
    dialogue:
      "Cahaya senja dan bintang malam di pulau ini sempurna untuk memotret potret prewedding! Silakan klik bingkai galeri untuk memperbesar foto.",
  },
  {
    id: "penjaga-bintang",
    name: "Pak Damar",
    roleLabel: "Penjaga Observatorium",
    gender: "cowok",
    position: [-1.85, 0.45, -10.3],
    rotationY: 0.55,
    outfitColor: "#21325e",
    accentColor: "#efc86e",
    hairColor: "#4f4a54",
    accessory: "starhat",
    dialogue:
      "Setiap doa yang kamu tulis di air mancur bintang ini akan menjelma menjadi cahaya yang terus mengorbit di langit Istana Awan!",
  },
];

function extractFirstName(full: string, fallback: string): string {
  const first = full.trim().split(/\s+/)[0];
  return first && first.length > 0 ? first : fallback;
}

export function getCelestialPayload(
  overrides: CelestialWeddingOverrides = {},
): CelestialWeddingPayload {
  const groomName = overrides.groomName?.trim() || "Raka Mahendra";
  const brideName = overrides.brideName?.trim() || "Nadya Larasati";
  const groomShort = extractFirstName(groomName, "Raka");
  const brideShort = extractFirstName(brideName, "Nadya");

  const dateDisplay = overrides.dateDisplay?.trim() || "Minggu, 18 Oktober 2026";
  const isoDate = overrides.isoDate?.trim() || "2026-10-18T09:00:00+08:00";
  const akadTime = overrides.akadTime?.trim() || "09.00 — 10.30 WITA";
  const resepsiTime = overrides.resepsiTime?.trim() || "18.30 — 21.30 WITA";
  const venueName = overrides.venueName?.trim() || "Glass Pavilion, Uluwatu — Bali";
  const venueAddress =
    overrides.venueAddress?.trim() ||
    "Jl. Tebing Samudra No. 88, Pecatu, Uluwatu, Bali";

  const openingQuote =
    overrides.openingQuote?.trim() ||
    "Di antara ribuan bintang yang melintas di langit malam, doa kami selalu bermuara pada satu pelabuhan yang sama.";

  const bank = overrides.bankName?.trim() || "Bank BCA";
  const number = overrides.bankNumber?.trim() || "5420 8891 26";
  const owner =
    overrides.bankOwner?.trim() ||
    `${groomShort} ${groomName.split(/\s+/)[1] ?? "Mahendra"} & ${brideShort}`;

  return {
    groomName,
    groomShort,
    groomParents: "Putra pertama Bpk. Hendra Mahendra & Ibu Sekar Wijaya",
    brideName,
    brideShort,
    brideParents: "Putri kedua Bpk. Aditya Pratama & Ibu Ratna Kusuma",
    coupleDisplay: `${groomShort} & ${brideShort}`,
    initials: `${groomShort.charAt(0).toUpperCase()} & ${brideShort.charAt(0).toUpperCase()}`,
    dateDisplay,
    isoDate,
    akadTime,
    resepsiTime,
    venueName,
    venueAddress,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueName + " " + venueAddress)}`,
    openingQuote,
    coupleGreeting: `Terima kasih sudah hadir di Istana Awan kami! Doa dan kehadiranmu pada ${dateDisplay} menjadi bintang terindah di hari bahagia ${groomShort} & ${brideShort}.`,
    atmosphere: overrides.atmosphere ?? "malam",
    bankAccount: {
      bank,
      number,
      owner,
    },
    storyChapters: [
      {
        chapter: "Bab I",
        year: "2021",
        title: "Bertemu di Senja Kampus",
        excerpt:
          "Dua meja sudut perpustakaan dan secangkir kopi hujan pertama menjadi awal percakapan yang tak pernah benar-benar selesai.",
      },
      {
        chapter: "Bab II",
        year: "2023",
        title: "Meniti Musim Jarak",
        excerpt:
          "Delapan belas bulan saling menunggu di layar telepon mengajarkan bahwa jarak hanya menguji seberapa jernih arah pulang kami.",
      },
      {
        chapter: "Bab III",
        year: "2025",
        title: "Janji di Atas Awan",
        excerpt:
          "Di bawah langit malam Bali yang tenang, satu pertanyaan sederhana dijawab dengan tangis haru dan cincin pertama.",
      },
      {
        chapter: "Bab IV",
        year: "2026",
        title: "Istana Awan Selamanya",
        excerpt:
          "Kini kami mengundang sahabat dan keluarga menyaksikan janji suci untuk melangkah beriringan menuju babak baru.",
      },
    ],
    photos: [
      {
        id: "balcony",
        src: "/themes/istana-awan/prewed-balcony.jpg",
        title: "Balkon Di Atas Awan",
        dateLabel: "Senja · Uluwatu",
        caption: "Menatap lautan awan berdua sebelum malam menjemput janji suci.",
      },
      {
        id: "rings",
        src: "/themes/istana-awan/prewed-rings.jpg",
        title: "Dua Lingkar Pusaka",
        dateLabel: "Simbol Ikrar",
        caption: "Dua lingkar emas yang mengikat nama kami dalam satu orbit yang tenang.",
      },
      {
        id: "lanterns",
        src: "/themes/istana-awan/prewed-lanterns.jpg",
        title: "Paviliun Lentera Bintang",
        dateLabel: "Malam Resepsi",
        caption: "Tempat ratusan doa tamu akan menyala menjadi gugus bintang malam ini.",
      },
    ],
    initialWishes: [
      {
        id: "w-1",
        name: "Tante Sari & Om Bima",
        attendance: "Hadir",
        message: `Selamat menempuh hidup baru ${groomShort} & ${brideShort}, semoga rumah tangga selalu hangat seperti cahaya istana malam ini.`,
        timestamp: "2 jam lalu",
      },
      {
        id: "w-2",
        name: "Dimas Pratama",
        attendance: "Hadir",
        message: "Dari meja tugas akhir sampai altar pelaminan! Turut bahagia setinggi langit untuk kalian berdua.",
        timestamp: "5 jam lalu",
      },
      {
        id: "w-3",
        name: "Nadine Putri",
        attendance: "Doa dari Jauh",
        message: "Bintang doaku kutitipkan dari Melbourne ya. Semoga selalu penuh tawa dan saling menjaga.",
        timestamp: "Kemarin",
      },
      {
        id: "w-4",
        name: "Reza & Fira",
        attendance: "Hadir",
        message: "Undangan 3D-nya magis banget! Sampai ketemu di Uluwatu minggu depan.",
        timestamp: "2 hari lalu",
      },
      {
        id: "w-5",
        name: "Ayu Lestari",
        attendance: "Hadir",
        message: "Barakallahulakuma, semoga menjadi pasangan sehidup sesurga.",
        timestamp: "3 hari lalu",
      },
    ],
  };
}
