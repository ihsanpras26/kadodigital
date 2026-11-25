import type { GachaCustomOverrides } from "./gachaShareCodec";

export type GachaMode = "anniversary" | "ultah" | "sahabat";

export type CapsuleKind = "polaroid" | "voicenote" | "quiz" | "voucher";

export type PolaroidSceneKind = "coffee-rain" | "rooftop-cake" | "warung-midnight";

export interface GachaPolaroidCapsule {
  id: string;
  kind: "polaroid";
  serial: string;
  shellColor: string;
  rarityLabel: string;
  title: string;
  dateLabel: string;
  sceneKind: PolaroidSceneKind;
  photoUrl: string;
  frontCaption: string;
  backNote: string;
}

export interface GachaVoiceCapsule {
  id: string;
  kind: "voicenote";
  serial: string;
  shellColor: string;
  rarityLabel: string;
  title: string;
  cassetteLabel: string;
  durationSec: number;
  transcriptLines: string[];
}

export interface GachaQuizCapsule {
  id: string;
  kind: "quiz";
  serial: string;
  shellColor: string;
  rarityLabel: string;
  title: string;
  question: string;
  options: string[];
  correctIndex: number;
  wrongQuips: string[];
  rewardNote: string;
}

export interface GachaVoucherCapsule {
  id: string;
  kind: "voucher";
  serial: string;
  shellColor: string;
  rarityLabel: string;
  title: string;
  voucherCode: string;
  voucherHeadline: string;
  voucherDetail: string;
  validUntil: string;
}

export type GachaCapsuleItem =
  | GachaPolaroidCapsule
  | GachaVoiceCapsule
  | GachaQuizCapsule
  | GachaVoucherCapsule;

export interface GachaReceiptLine {
  qty: string;
  label: string;
  value: string;
}

export interface GachaReceiptData {
  storeName: string;
  storeAddress: string;
  serialNo: string;
  cashier: string;
  items: GachaReceiptLine[];
  subtotalLabel: string;
  subtotalValue: string;
  taxLabel: string;
  taxValue: string;
  totalLabel: string;
  totalValue: string;
  changeLabel: string;
  changeValue: string;
  stampText: string;
  footerLine: string;
  barcodeCode: string;
}

export interface GachaWorldPayload {
  mode: GachaMode;
  modeLabel: string;
  machineBadge: string;
  welcomeEyebrow: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  defaultRecipient: string;
  senderName: string;
  defaultDateLabel: string;
  defaultPinHint: string;
  capsules: GachaCapsuleItem[];
  receipt: GachaReceiptData;
}

const PAYLOADS: Record<GachaMode, GachaWorldPayload> = {
  anniversary: {
    mode: "anniversary",
    modeLabel: "Anniversary",
    machineBadge: "MESIN NO. 01 · ANNIVERSARY",
    welcomeEyebrow: "Titipan Kapsul Pribadi",
    welcomeTitle: "Empat Kapsul yang Kusimpan Buatmu",
    welcomeSubtitle:
      "Seret koin kuningan ke dalam slot, putar tuas sampai berbunyi klik, lalu cetak struk kenangan kita.",
    defaultRecipient: "Nadya Aulia",
    senderName: "Raka Pratama",
    defaultDateLabel: "14 Feb 2026",
    defaultPinHint: "Tanggal & bulan kita jadian (4 digit, contoh 1402)",
    capsules: [
      {
        id: "anniv-1",
        kind: "polaroid",
        serial: "#01",
        shellColor: "#B83124",
        rarityLabel: "Kenangan",
        title: "Hujan Deras & Dua Es Kopi",
        dateLabel: "14 Feb 2025",
        sceneKind: "coffee-rain",
        photoUrl: "/themes/kapsul-kenangan/coffee-rain.jpg",
        frontCaption: "Berteduh di teras kedai sambil nunggu reda.",
        backNote:
          "Dari sore itu aku sadar, macet sama hujan nggak pernah kerasa nyebelin kalau pulangnya searah sama kamu.",
      },
      {
        id: "anniv-2",
        kind: "voicenote",
        serial: "#02",
        shellColor: "#2D6A4F",
        rarityLabel: "Suara",
        title: "Pesan Suara Jam 11 Malam",
        cassetteLabel: "SIDE A · BUAT KAMU DENGERIN",
        durationSec: 12,
        transcriptLines: [
          "Terima kasih ya sudah bertahan sama jadwal lemburku tahun ini.",
          "Maaf sering ketiduran sebelum filmnya habis.",
          "Tahun depan kita tambah lagi alasan buat jalan tanpa agenda.",
        ],
      },
      {
        id: "anniv-3",
        kind: "quiz",
        serial: "#03",
        shellColor: "#D6A54B",
        rarityLabel: "Tebak",
        title: "Tes Ingatan Kencan Pertama",
        question: "Waktu pertama kali makan malam bareng, siapa yang paling lama milih menu?",
        options: [
          "Jelas bukan aku",
          "Kamu sampai buka ulasan 10 menit",
          "Pelayannya sampai apal muka kita",
        ],
        correctIndex: 1,
        wrongQuips: [
          "Eits, masa lupa? Tombol ini cuma buat yang jujur.",
          "Hampir benar, tapi pelaku utamanya masih kamu.",
        ],
        rewardNote:
          "Ujung-ujungnya selalu balik pesan mie ayam pangsit juga, dan anehnya nggak pernah bosen sampai hari ini.",
      },
      {
        id: "anniv-4",
        kind: "voucher",
        serial: "#04",
        shellColor: "#325788",
        rarityLabel: "Spesial",
        title: "Tiket Bebas Wacana",
        voucherCode: "KDP-TRKT-2026",
        voucherHeadline: "Gratis Kencan Makan & Kopi Pilih Tempat",
        voucherDetail:
          "Berlaku 1x kapan saja. Saya tidak boleh jawab 'terserah' dan semua tagihan langsung lunas di kasir.",
        validUntil: "Seumur hidup (minimal akhir pekan ini)",
      },
    ],
    receipt: {
      storeName: "KEDAI KAPSUL KENANGAN",
      storeAddress: "MEJA SUDUT NO. 24 · SHIFT MALAM",
      serialNo: "INV-2026-ANNIV-01",
      cashier: "Raka Pratama",
      items: [
        { qty: "365x", label: "PAGI BERSAMA TANPA BOSAN", value: "GRATIS" },
        { qty: "42x", label: "DRAMA PILIH MAKAN MALAM", value: "SABAR" },
        { qty: "19x", label: "ES KOPI SUSU ANTAR DADAKAN", value: "BONUS" },
        { qty: "12x", label: "CURHAT LEWAT TENGAH MALAM", value: "IKHLAS" },
        { qty: "1x", label: "KENCAN PILIH TEMPAT SENDIRI", value: "KLAIM" },
      ],
      subtotalLabel: "SUBTOTAL MOMEN",
      subtotalValue: "730 HARI",
      taxLabel: "PAJAK RINDU",
      taxValue: "0% (SUBSIDI)",
      totalLabel: "TOTAL DIBAYAR",
      totalValue: "100% NIAT",
      changeLabel: "KEMBALIAN",
      changeValue: "RP 0",
      stampText: "LUNAS",
      footerLine: "Simpan struk ini. Tidak dapat ditukar dengan mantan.",
      barcodeCode: "KDP-ANV-730-2026",
    },
  },
  ultah: {
    mode: "ultah",
    modeLabel: "Ulang Tahun",
    machineBadge: "MESIN NO. 02 · ULANG TAHUN",
    welcomeEyebrow: "Arsip Ulang Tahun Khusus",
    welcomeTitle: "Putar Mesin, Klaim Traktiran",
    welcomeSubtitle:
      "Bukan kado biasa. Ada empat kapsul berisi bukti aib manis, doa, dan voucher yang harus kamu gosok.",
    defaultRecipient: "Budi Santoso",
    senderName: "Tim Hore",
    defaultDateLabel: "19 Okt 2026",
    defaultPinHint: "Tanggal & bulan ulang tahunmu (4 digit)",
    capsules: [
      {
        id: "ultah-1",
        kind: "polaroid",
        serial: "#01",
        shellColor: "#B83124",
        rarityLabel: "Kenangan",
        title: "Kue Rooftop Jam 12 Pas",
        dateLabel: "19 Okt 2025",
        sceneKind: "rooftop-cake",
        photoUrl: "/themes/kapsul-kenangan/rooftop-cake.jpg",
        frontCaption: "Lilin hampir padam kena angin tapi senyummu tetap nyala.",
        backNote:
          "Selamat tambah dewasa, meski tiap ditanya umur masih sering mikir dua detik sebelum jawab.",
      },
      {
        id: "ultah-2",
        kind: "voicenote",
        serial: "#02",
        shellColor: "#2D6A4F",
        rarityLabel: "Suara",
        title: "Kaset Doa Tengah Malam",
        cassetteLabel: "SIDE A · KHUSUS YANG ULTAH",
        durationSec: 12,
        transcriptLines: [
          "Semoga di usia baru ini kerjaan lancar dan badan makin fit.",
          "Jangan keseringan begadang ngulik proyek sampai jam tiga pagi.",
          "Minggu depan kosongin jadwal, jatah ramen traktiran menunggu.",
        ],
      },
      {
        id: "ultah-3",
        kind: "quiz",
        serial: "#03",
        shellColor: "#D6A54B",
        rarityLabel: "Tebak",
        title: "Fakta Penting Ulang Tahun",
        question: "Alasan paling klasik waktu kamu telat datang kumpul jam makan malam?",
        options: [
          "Sudah di jalan (padahal baru buka lemari)",
          "Macet total di simpang lima",
          "Ketiduran 5 menit kebablasan 1 jam",
        ],
        correctIndex: 0,
        wrongQuips: [
          "Halah, alasan klasik itu cuma di film. Coba tombol sebelah.",
          "Bukan itu! Ingat pesan WhatsApp kamu lima menit sebelum jam janjian.",
        ],
        rewardNote:
          "Tapi bagaimanapun telatnya, obrolan selalu nggak pernah garing kalau ada kamu di meja.",
      },
      {
        id: "ultah-4",
        kind: "voucher",
        serial: "#04",
        shellColor: "#325788",
        rarityLabel: "Spesial",
        title: "Kupon Ramen & Kopi Gratis",
        voucherCode: "HBD-RMN-2026",
        voucherHeadline: "1x Traktir Ramen Full Topping + Es Matcha",
        voucherDetail:
          "Tunjukkan struk lunas atau foto kupon ini sebelum akhir bulan buat pencairan langsung di tempat.",
        validUntil: "30 hari sejak kapsul dibuka",
      },
    ],
    receipt: {
      storeName: "TOKO KADO TAMBAH USIA",
      storeAddress: "JL. LILIN KE-25 · KASIR NOSTALGIA",
      serialNo: "INV-2026-HBD-25",
      cashier: "Tim Hore",
      items: [
        { qty: "1x", label: "NAIK LEVEL KE USIA BARU", value: "SAH" },
        { qty: "14x", label: "KEBOHONGAN 'OTW PADAHAL MANDI'", value: "DIMAAFIN" },
        { qty: "28x", label: "TEMAN LEMBUR & CARI MAKAN", value: "SOLID" },
        { qty: "100%", label: "DOA SEHAT & REZEKI LANCAR", value: "MASUK" },
        { qty: "1x", label: "VOUCHER RAMEN FULL TOPPING", value: "SIAP" },
      ],
      subtotalLabel: "TOTAL USIA BARU",
      subtotalValue: "+1 LEVEL",
      taxLabel: "PPN KEDEWASAAN",
      taxValue: "DITANGGUNG TEMAN",
      totalLabel: "TAGIHAN PESTA",
      totalValue: "LUNAS",
      changeLabel: "SISA KUOTA",
      changeValue: "UNLIMITED",
      stampText: "LUNAS",
      footerLine: "Wajib pamer struk ini pas ditagih traktiran.",
      barcodeCode: "KDP-HBD-025-2026",
    },
  },
  sahabat: {
    mode: "sahabat",
    modeLabel: "Sahabat",
    machineBadge: "MESIN NO. 03 · BESTIE EDITION",
    welcomeEyebrow: "Arsip Geng Nongkrong",
    welcomeTitle: "4 Kapsul Bukti Kita Pernah Akrab",
    welcomeSubtitle:
      "Putar tuas gacha untuk membuka arsip warung tengah malam, pesan suara, kuis jujur, dan traktiran.",
    defaultRecipient: "Tari Wulandari",
    senderName: "Geng Kopi",
    defaultDateLabel: "09 Nov 2026",
    defaultPinHint: "Tahun pertama kita nongkrong bareng (4 digit)",
    capsules: [
      {
        id: "bestie-1",
        kind: "polaroid",
        serial: "#01",
        shellColor: "#B83124",
        rarityLabel: "Kenangan",
        title: "Warung Tenda Jam 1 Pagi",
        dateLabel: "09 Nov 2025",
        sceneKind: "warung-midnight",
        photoUrl: "/themes/kapsul-kenangan/warung-midnight.jpg",
        frontCaption: "Niatnya bahas masa depan, ujungnya malah gosip resep mie goreng.",
        backNote:
          "Terima kasih selalu jadi orang pertama yang langsung angkat telepon tiap ada cerita dadakan.",
      },
      {
        id: "bestie-2",
        kind: "voicenote",
        serial: "#02",
        shellColor: "#2D6A4F",
        rarityLabel: "Suara",
        title: "Catatan Suara Dari Mejaku",
        cassetteLabel: "SIDE A · BESTIE UNFILTERED",
        durationSec: 12,
        transcriptLines: [
          "Walaupun sekarang kita sama-sama sibuk di kota yang beda,",
          "kursi kosong buat ngopi bareng tetap punya namamu di sana.",
          "Kabarin ya kalau minggu ini mampir, gorengan hangat siap menyambut.",
        ],
      },
      {
        id: "bestie-3",
        kind: "quiz",
        serial: "#03",
        shellColor: "#D6A54B",
        rarityLabel: "Tebak",
        title: "Audit Kejujuran Bestie",
        question: "Kalau bilang 'cuma nongkrong 1 jam ya', biasanya kita pulang jam berapa?",
        options: [
          "Tepat 60 menit sesuai janji",
          "Sampai lampu kafe dimatikan mas-masnya",
          "Tergantung baterai HP",
        ],
        correctIndex: 1,
        wrongQuips: [
          "Mustahil! Belum pernah kejadian sepanjang sejarah tongkrongan.",
          "HP boleh lowbat, tapi topik obrolan masih bersambung.",
        ],
        rewardNote:
          "Karena cuma sama kamu kita bisa bahas topik serius terus langsung ketawa lima detik kemudian.",
      },
      {
        id: "bestie-4",
        kind: "voucher",
        serial: "#04",
        shellColor: "#325788",
        rarityLabel: "Spesial",
        title: "Pass Darurat Anti Wacana",
        voucherCode: "BST-NGOP-2026",
        voucherHeadline: "Gratis Kopi Susu + Kentang Goreng Meja Tengah",
        voucherDetail:
          "Tidak ada alasan sibuk. Cukup kirim tangkapan layar struk ini buat kunci jadwal ngopi bareng.",
        validUntil: "Kapan pun baterai sosialmu penuh lagi",
      },
    ],
    receipt: {
      storeName: "KOPERASI SAHABAT SEJATI",
      storeAddress: "MEJA POJOK NO. 04 · ANTI WACANA",
      serialNo: "INV-2026-BEST-04",
      cashier: "Geng Kopi",
      items: [
        { qty: "88x", label: "BILANG 'OTW' DARI ATAS KASUR", value: "VALID" },
        { qty: "52x", label: "SESI CURHAT DADAKAN JAM 1", value: "GRATIS" },
        { qty: "24x", label: "FOTO AIB BELUM DIUPLOAD", value: "ARSIP" },
        { qty: "1x", label: "STATUS PERTEMANAN SEHAT", value: "AWET" },
        { qty: "1x", label: "TRAKTIRAN KOPI ANTI WACANA", value: "KLAIM" },
      ],
      subtotalLabel: "TOTAL OBROLAN",
      subtotalValue: "TANPA BATAS",
      taxLabel: "BIAYA DRAMA",
      taxValue: "RP 0",
      totalLabel: "HARGA SAHABAT",
      totalValue: "TIDAK DIJUAL",
      changeLabel: "KEWAJIBAN",
      changeValue: "WAJIB KETEMU",
      stampText: "LUNAS",
      footerLine: "Screenshot struk ini ke grup biar yang lain iri.",
      barcodeCode: "KDP-BST-404-2026",
    },
  },
};

export function getGachaPayload(
  mode: GachaMode,
  overrides?: Partial<GachaCustomOverrides> | null,
): GachaWorldPayload {
  const base = PAYLOADS[mode];
  if (!overrides) return base;

  const customRecipient = overrides.recipient?.trim() || base.defaultRecipient;
  const customSender = overrides.sender?.trim() || base.senderName;
  const customDate = overrides.dateLabel?.trim() || base.defaultDateLabel;
  const customPinHint = overrides.pinHint?.trim() || base.defaultPinHint;

  const voiceLines = overrides.voiceMessage
    ?.split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const capsules: GachaCapsuleItem[] = base.capsules.map((cap) => {
    if (cap.kind === "polaroid") {
      return {
        ...cap,
        dateLabel: customDate,
        frontCaption: overrides.polaroidCaption?.trim() || cap.frontCaption,
        backNote: overrides.polaroidSecret?.trim() || cap.backNote,
      };
    }
    if (cap.kind === "voicenote" && voiceLines && voiceLines.length > 0) {
      return {
        ...cap,
        transcriptLines: voiceLines,
      };
    }
    if (cap.kind === "voucher") {
      return {
        ...cap,
        voucherHeadline: overrides.voucherTitle?.trim() || cap.voucherHeadline,
        voucherDetail: overrides.voucherDetail?.trim() || cap.voucherDetail,
      };
    }
    return cap;
  });

  const updatedItems = base.receipt.items.map((item, idx) => {
    if (idx === base.receipt.items.length - 1 && overrides.voucherTitle?.trim()) {
      return {
        ...item,
        label: overrides.voucherTitle.trim().toUpperCase().slice(0, 32),
      };
    }
    return item;
  });

  return {
    ...base,
    defaultRecipient: customRecipient,
    senderName: customSender,
    defaultDateLabel: customDate,
    defaultPinHint: customPinHint,
    capsules,
    receipt: {
      ...base.receipt,
      cashier: customSender,
      serialNo: overrides.recipient?.trim()
        ? `${base.receipt.serialNo.slice(0, 12)}-${customRecipient
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .slice(0, 4) || "VIP"}`
        : base.receipt.serialNo,
      items: updatedItems,
    },
  };
}
