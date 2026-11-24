export type DesaMode = "wedding" | "kado";
export type DesaTimeOfDay = "pagi" | "sore" | "malam";
export type DesaStationId =
  | "surat"
  | "acara"
  | "ucapan"
  | "kado"
  | "cerita"
  | "galeri";

export interface DesaStationMeta {
  id: DesaStationId;
  dockLabel: string;
  markerLabel: string;
  ribbon: string;
  title: string;
  x: number;
  z: number;
  interactRadius: number;
}

export interface DesaNpcData {
  id: string;
  name: string;
  roleLabel: string;
  gender: "cewek" | "cowok";
  outfitColor: string;
  accentColor: string;
  hairColor: string;
  hatType: "sunhat" | "caping" | "floral" | "none";
  defaultWish: string;
  patrolPoints: { x: number; z: number }[];
}

export interface DesaWishItem {
  id: string;
  name: string;
  relation: string;
  status: "Hadir" | "Doa Restu" | "Ucapan";
  message: string;
  createdAt: string;
}

export interface DesaStoryChapter {
  id: string;
  year: string;
  title: string;
  description: string;
  image: string;
}

export interface DesaGalleryPhoto {
  id: string;
  title: string;
  caption: string;
  backNote: string;
  image: string;
}

export interface DesaQuizItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  correctFeedback: string;
  wrongFeedback: string;
}

export interface DesaWorldUiCopy {
  preloaderTitle: string;
  preloaderSubtitle: string;
  coverSubtitle: string;
  coverCta: string;
  pickerTitle: string;
  pickerSubtitle: string;
  pickerCta: string;
  pickerAttireFemale: string;
  pickerAttireMale: string;
  introEyebrow: string;
  introSubtitle: string;
  mapTitle: string;
  mapSubtitle: string;
  npcSectionLabel: string;
  progressTitle: string;
  journalTitle: string;
  journalButtonLabel: string;
  footerCaption: string;
  wishSuccessToast: string;
  wishFormSentNote: string;
  wishSectionTitle: string;
  galleryFooterLabel: string;
  icsDescription: string;
  icsFilename: string;
  qrPrefix: string;
}

export interface DesaCoupleProfile {
  groom: {
    fullName: string;
    parents: string;
  };
  bride: {
    fullName: string;
    parents: string;
  };
}

export interface DesaWorldPayload {
  mode: DesaMode;
  eyebrow: string;
  coverTag: string;
  monogram: string;
  namesLine: string;
  dateLine: string;
  shortDateLabel: string;
  defaultGuestName: string;
  gapuraTitle: string;
  gapuraSubtitle: string;
  coupleProfile?: DesaCoupleProfile;
  ui: DesaWorldUiCopy;
  stations: DesaStationMeta[];
  npcs: DesaNpcData[];
  initialWishes: DesaWishItem[];
  letter: {
    heading: string;
    paragraphs: string[];
    signOff: string;
    quote: string;
    targetIso?: string;
    daysTogether?: number;
    dresscodeTitle?: string;
    dresscodeNote?: string;
    dresscodeSwatches?: { label: string; hex: string }[];
  };
  eventInfo?: {
    venueName: string;
    venueAddress: string;
    mapsUrl: string;
    calendarStartIso: string;
    calendarEndIso: string;
    sessions: { title: string; date: string; time: string; place: string }[];
  };
  voiceNote?: {
    title: string;
    durationSec: number;
    senderLabel: string;
    transcript: string;
  };
  quiz?: DesaQuizItem[];
  gift: {
    heading: string;
    subtitle: string;
    accounts: { id: string; bank: string; number: string; owner: string; color: string }[];
    deliveryAddress: string;
    scratchPrompt: string;
    scratchSecretTitle: string;
    scratchSecretBody: string;
  };
  stories: DesaStoryChapter[];
  gallery: DesaGalleryPhoto[];
}

const WEDDING_STATIONS: DesaStationMeta[] = [
  {
    id: "surat",
    dockLabel: "Sambutan",
    markerLabel: "Sambutan",
    ribbon: "Undangan Pernikahan",
    title: "Walimatul Ursy",
    x: 3.2,
    z: 2.8,
    interactRadius: 2.3,
  },
  {
    id: "acara",
    dockLabel: "Akad & Resepsi",
    markerLabel: "Pendopo Pelaminan",
    ribbon: "Waktu & Tempat",
    title: "Rangkaian Acara",
    x: 5.1,
    z: -2.7,
    interactRadius: 3.1,
  },
  {
    id: "ucapan",
    dockLabel: "Ucapan & RSVP",
    markerLabel: "Buku Tamu & RSVP",
    ribbon: "Buku Tamu",
    title: "Doa Restu & Kehadiran",
    x: -1.9,
    z: 1.6,
    interactRadius: 2.3,
  },
  {
    id: "kado",
    dockLabel: "Tanda Kasih",
    markerLabel: "Tanda Kasih",
    ribbon: "Tanda Kasih",
    title: "Amplop Digital & Kado",
    x: 1.2,
    z: -2.2,
    interactRadius: 2.3,
  },
  {
    id: "cerita",
    dockLabel: "Kisah Kami",
    markerLabel: "Kisah Kami",
    ribbon: "Perjalanan Cinta",
    title: "Kisah Cinta Kami",
    x: -2.1,
    z: -2.9,
    interactRadius: 2.4,
  },
  {
    id: "galeri",
    dockLabel: "Galeri",
    markerLabel: "Galeri Momen",
    ribbon: "Album Pernikahan",
    title: "Galeri Momen",
    x: 6.4,
    z: 1.35,
    interactRadius: 2.3,
  },
];

const KADO_STATIONS: DesaStationMeta[] = [
  {
    id: "surat",
    dockLabel: "Surat Utama",
    markerLabel: "Kotak Surat",
    ribbon: "Kado Personal",
    title: "Sepucuk Surat Dari Hati",
    x: 3.2,
    z: 2.8,
    interactRadius: 2.3,
  },
  {
    id: "acara",
    dockLabel: "Pesan Suara",
    markerLabel: "Pendopo Suara",
    ribbon: "Rekaman Hangat",
    title: "Pesan Suara Spesial",
    x: 5.1,
    z: -2.7,
    interactRadius: 3.1,
  },
  {
    id: "ucapan",
    dockLabel: "Kuis Kenangan",
    markerLabel: "Bale Kuis",
    ribbon: "Tebak Momen",
    title: "Kuis Kenangan Kita",
    x: -1.9,
    z: 1.6,
    interactRadius: 2.3,
  },
  {
    id: "kado",
    dockLabel: "Kado Rahasia",
    markerLabel: "Meja Hadiah",
    ribbon: "Gosok & Buka",
    title: "Voucher Kejutan Untukmu",
    x: 1.2,
    z: -2.2,
    interactRadius: 2.3,
  },
  {
    id: "cerita",
    dockLabel: "Cerita Kita",
    markerLabel: "Papan Cerita",
    ribbon: "Album Waktu",
    title: "Bab Perjalanan Kita",
    x: -2.1,
    z: -2.9,
    interactRadius: 2.4,
  },
  {
    id: "galeri",
    dockLabel: "Galeri Foto",
    markerLabel: "Pigura Galeri",
    ribbon: "Foto & Catatan",
    title: "Galeri Balik Kartu",
    x: 6.4,
    z: 1.35,
    interactRadius: 2.3,
  },
];

const WEDDING_GUESTS: DesaNpcData[] = [
  {
    id: "npc-raka",
    name: "Bagus Pratama",
    roleLabel: "Sahabat Kampus",
    gender: "cowok",
    outfitColor: "#2D6A4F",
    accentColor: "#D4A359",
    hairColor: "#2B1E17",
    hatType: "none",
    defaultWish:
      "Selamat menempuh hidup baru, Raka & Nadya! Semoga rumah tangga kalian senantiasa dilimpahi ketenangan, cinta, dan keberkahan.",
    patrolPoints: [
      { x: 4.5, z: 3.4 },
      { x: 5.5, z: 1.1 },
    ],
  },
  {
    id: "npc-sari",
    name: "Sari Wulandari",
    roleLabel: "Sahabat Mempelai",
    gender: "cewek",
    outfitColor: "#B85D3B",
    accentColor: "#F4E5CE",
    hairColor: "#231712",
    hatType: "floral",
    defaultWish:
      "Bahagia sekali bisa hadir di hari istimewa kalian! Kedua mempelai sudah menanti di Pendopo Pelaminan, jangan lupa isi buku tamu ya.",
    patrolPoints: [
      { x: -1.1, z: 3.1 },
      { x: 0.4, z: 2.6 },
    ],
  },
  {
    id: "npc-dimas",
    name: "Dimas Mahendra",
    roleLabel: "Keluarga Mempelai",
    gender: "cowok",
    outfitColor: "#486B5A",
    accentColor: "#E8C37D",
    hairColor: "#1F1612",
    hatType: "none",
    defaultWish:
      "Doa restu kami selalu mengiringi langkah Raka & Nadya. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah selamanya.",
    patrolPoints: [
      { x: 2.6, z: -3.2 },
      { x: 3.4, z: -1.5 },
    ],
  },
];

const KADO_NPCS: DesaNpcData[] = [
  {
    id: "npc-bagus",
    name: "Bagus Pratama",
    roleLabel: "Sobat KKN",
    gender: "cowok",
    outfitColor: "#2D6A4F",
    accentColor: "#D4A359",
    hairColor: "#2B1E17",
    hatType: "caping",
    defaultWish:
      "Selamat merayakan dua tahun penuh cerita! Sudah coba mampir ke Bale Kuis buat ngetes ingatan belum?",
    patrolPoints: [
      { x: 4.5, z: 3.4 },
      { x: 5.5, z: 1.1 },
    ],
  },
  {
    id: "npc-sari",
    name: "Sari Wulandari",
    roleLabel: "Sahabat Dekat",
    gender: "cewek",
    outfitColor: "#B85D3B",
    accentColor: "#F4E5CE",
    hairColor: "#231712",
    hatType: "floral",
    defaultWish:
      "Ada pesan suara hangat yang menunggu di Pendopo Suara, dan jangan lupa gosok voucher rahasia di Meja Hadiah ya!",
    patrolPoints: [
      { x: -1.1, z: 3.1 },
      { x: 0.4, z: 2.6 },
    ],
  },
  {
    id: "npc-dimas",
    name: "Dimas Mahendra",
    roleLabel: "Penjaga Saung",
    gender: "cowok",
    outfitColor: "#486B5A",
    accentColor: "#E8C37D",
    hairColor: "#1F1612",
    hatType: "none",
    defaultWish:
      "Tip kecil: coba buka Pigura Galeri lalu ketuk tombol 'Balik kartu' di setiap foto untuk membaca catatan rahasianya.",
    patrolPoints: [
      { x: 2.6, z: -3.2 },
      { x: 3.4, z: -1.5 },
    ],
  },
];

const WEDDING_STORIES: DesaStoryChapter[] = [
  {
    id: "story-1",
    year: "2022 · Awal Pertemuan",
    title: "Pertemuan Pertama yang Hangat",
    description:
      "Berawal dari sebuah proyek kolaborasi di Yogyakarta. Obrolan sederhana seputar arsitektur dan kopi sore perlahan tumbuh menjadi rasa nyaman yang tak terduga.",
    image: "/themes/desa-asri/scene-1.png",
  },
  {
    id: "story-2",
    year: "2023 · Tumbuh Bersama",
    title: "Menyusuri Langkah Demi Langkah",
    description:
      "Melewati musim hujan dan kemarau bersama, belajar saling memahami di balik kesibukan masing-masing, serta merayakan pencapaian kecil dengan penuh syukur.",
    image: "/themes/desa-asri/scene-2.png",
  },
  {
    id: "story-3",
    year: "2024 · Restu Keluarga",
    title: "Silaturahmi Dua Keluarga",
    description:
      "Di bawah teduh pendopo kayu, kedua keluarga duduk bersua penuh kehangatan—membuka jalan dan merestui niat baik kami untuk melangkah ke jenjang lebih serius.",
    image: "/themes/desa-asri/scene-3.png",
  },
  {
    id: "story-4",
    year: "2025 · Khitbah & Lamaran",
    title: "Janji yang Diikat dengan Keyakinan",
    description:
      "Dengan mengucap basmalah di hadapan keluarga tercinta, kami mengikat janji pertunangan sebagai awal persiapan menuju kehidupan rumah tangga.",
    image: "/themes/desa-asri/scene-4.png",
  },
  {
    id: "story-5",
    year: "2026 · Menuju Hari Bahagia",
    title: "Menyiapkan Lembaran Baru",
    description:
      "Menyusun setiap detail hari pernikahan dengan penuh cinta, memohon kelancaran dan keberkahan untuk perjalanan hidup yang akan kami arungi berdua.",
    image: "/themes/desa-asri/scene-5.png",
  },
  {
    id: "story-6",
    year: "17 Okt 2027 · Hari Pernikahan",
    title: "Walimatul Ursy Raka & Nadya",
    description:
      "Kini tibalah saat yang kami nantikan. Kehadiran serta doa restu Bapak/Ibu/Saudara/i menjadi kebahagiaan tak ternilai di hari suci kami.",
    image: "/themes/desa-asri/scene-6.png",
  },
];

const WEDDING_GALLERY: DesaGalleryPhoto[] = [
  {
    id: "gal-1",
    title: "Fajar Terasering Pagi",
    caption: "Sesi prewedding pagi hari di tengah kabut tipis perbukitan.",
    backNote: "Momen di balik foto: kami tiba pukul lima pagi demi mengejar cahaya keemasan pertama sebelum akad impian kami terwujud.",
    image: "/themes/desa-asri/scene-1.png",
  },
  {
    id: "gal-2",
    title: "Senyum di Jembatan Taman",
    caption: "Ketenangan aliran air dan teduhnya pepohonan Nusantara.",
    backNote: "Di balik foto ini: pengingat bahwa rumah tangga adalah tentang berjalan beriringan melewati setiap arus kehidupan.",
    image: "/themes/desa-asri/scene-2.png",
  },
  {
    id: "gal-3",
    title: "Pelaminan Rangkaian Melati",
    caption: "Balutan busana adat Jawa klasik berhias ronce melati segar.",
    backNote: "Wangi melati putih selalu melambangkan ketulusan niat dan kesucian ikatan suci kami.",
    image: "/themes/desa-asri/scene-3.png",
  },
  {
    id: "gal-4",
    title: "Janji & Cincin Pernikahan",
    caption: "Detail undangan linen dan dua cangkir hangat penyambut pagi.",
    backNote: "Setiap detail hari bahagia ini kami rangkai sendiri dengan harapan dapat berbagi kehangatan bersama seluruh tamu.",
    image: "/themes/desa-asri/scene-4.png",
  },
  {
    id: "gal-5",
    title: "Lentera Senja Taman",
    caption: "Langkah tenang menyusuri jalan setapak di bawah cahaya temaram.",
    backNote: "Terima kasih untuk keluarga dan sahabat yang selalu menerangi jalan kami hingga hari pernikahan ini tiba.",
    image: "/themes/desa-asri/scene-5.png",
  },
  {
    id: "gal-6",
    title: "Malam Syukuran & Doa",
    caption: "Kehangatan cahaya lampu pendopo menyambut para tamu tercinta.",
    backNote: "Kehadiran serta doa restu Anda adalah kado terindah bagi perjalanan baru kami.",
    image: "/themes/desa-asri/scene-6.png",
  },
];

const KADO_STORIES: DesaStoryChapter[] = [
  {
    id: "story-1",
    year: "2022 · Pagi di Bukit",
    title: "Pertemuan Pertama di Tepi Sawah",
    description:
      "Berawal dari obrolan singkat sambil menunggu kabut pagi surut di kedai kopi. Dari cangkir pertama, percakapan sederhana terasa begitu akrab.",
    image: "/themes/desa-asri/scene-1.png",
  },
  {
    id: "story-2",
    year: "2023 · Tepi Sungai",
    title: "Menyusuri Jembatan Bambu Bersama",
    description:
      "Musim kemarau membawa perjalanan akhir pekan yang selalu kami rindukan: berhenti di jembatan kayu, mendengarkan gemericik air, dan menertawakan hal-hal kecil.",
    image: "/themes/desa-asri/scene-2.png",
  },
  {
    id: "story-3",
    year: "2024 · Pendopo Teduh",
    title: "Mengenal Keluarga & Tradisi",
    description:
      "Di bawah atap pendopo kayu berhias melati, dua keluarga duduk melingkar penuh syukur, merestui langkah yang lebih pasti.",
    image: "/themes/desa-asri/scene-3.png",
  },
  {
    id: "story-4",
    year: "2025 · Sepucuk Catatan",
    title: "Kopi Pagi & Surat-Surat Kecil",
    description:
      "Setiap hari jadi terasa spesial berkat catatan-catatan kecil di meja teras yang selalu mengingatkan untuk pulang dan beristirahat.",
    image: "/themes/desa-asri/scene-4.png",
  },
  {
    id: "story-5",
    year: "2026 · Senja Hangat",
    title: "Lentera di Sepanjang Jalan Pulang",
    description:
      "Menjelang petang di antara daun pisang dan pagar bambu, lentera hangat selalu menyala menjadi penanda arah pulang.",
    image: "/themes/desa-asri/scene-5.png",
  },
  {
    id: "story-6",
    year: "Hari Ini · Bab Baru",
    title: "Malam Syukur Penuh Cahaya",
    description:
      "Kini semua kenangan itu kami rangkai menjadi sebuah dunia kecil yang bisa kamu jelajahi, lengkap dengan doa dan harapan baik untuk masa depan.",
    image: "/themes/desa-asri/scene-6.png",
  },
];

const KADO_GALLERY: DesaGalleryPhoto[] = [
  {
    id: "gal-1",
    title: "Fajar Terasering Pagi",
    caption: "Pukul 06.15 WIB saat kabut masih menyelimuti pematang sawah.",
    backNote: "Di balik foto ini: kita nyaris ketinggalan matahari terbit karena berhenti beli pisang goreng hangat di warung pinggir jalan.",
    image: "/themes/desa-asri/scene-1.png",
  },
  {
    id: "gal-2",
    title: "Gemericik Sungai & Jembatan",
    caption: "Tempat paling sejuk untuk melepas penat di akhir pekan.",
    backNote: "Di balik foto ini: sepakat suatu hari ingin punya teras rumah menghadap aliran air jernih dan pepohonan rindang.",
    image: "/themes/desa-asri/scene-2.png",
  },
  {
    id: "gal-3",
    title: "Pendopo Rangkaian Melati",
    caption: "Nuansa kayu jati hangat dengan hiasan bunga kamboja dan melati.",
    backNote: "Di balik foto ini: wangi melati segar hari itu selalu jadi pengingat paling hangat tentang arti kesederhanaan.",
    image: "/themes/desa-asri/scene-3.png",
  },
  {
    id: "gal-4",
    title: "Meja Kopi & Surat Linen",
    caption: "Dua cangkir kopi tubruk dan catatan tulisan tangan favorit.",
    backNote: "Di balik foto ini: kamu menyimpan setiap potongan tiket kereta dan kertas struk kopi dari perjalanan pertama kita.",
    image: "/themes/desa-asri/scene-4.png",
  },
  {
    id: "gal-5",
    title: "Jalan Setapak Kunang-Kunang",
    caption: "Senja damai di antara rumpun bambu dan lentera taman.",
    backNote: "Di balik foto ini: berjalan pelan sepulang makan malam sambil menghitung kunang-kunang yang muncul di balik daun pisang.",
    image: "/themes/desa-asri/scene-5.png",
  },
  {
    id: "gal-6",
    title: "Malam Lentera Pendopo",
    caption: "Lampu temaram yang menghangatkan malam syukuran bersama.",
    backNote: "Terima kasih sudah hadir dan menjadi bagian paling berarti dari perjalanan panjang kami.",
    image: "/themes/desa-asri/scene-6.png",
  },
];

export function getDesaWorldPayload(mode: DesaMode): DesaWorldPayload {
  if (mode === "kado") {
    return {
      mode: "kado",
      eyebrow: "Kado Digital Interaktif",
      coverTag: "KADO SPESIAL",
      monogram: "R ♥ N",
      namesLine: "Untuk Nadya",
      dateLine: "2 TAHUN PENUH CERITA",
      shortDateLabel: "2 Tahun Bersama",
      defaultGuestName: "Nadya Aulia",
      gapuraTitle: "SAUNG KENANGAN",
      gapuraSubtitle: "Dua Tahun Penuh Cerita",
      ui: {
        preloaderTitle: "Memuat Saung Kenangan",
        preloaderSubtitle: "Menyiapkan ruang kenangan interaktif...",
        coverSubtitle:
          "Jelajahi setiap sudut untuk membuka surat, pesan suara, kuis kenangan, dan kejutan spesial.",
        coverCta: "Buka Kado",
        pickerTitle: "Pilih Karakter Penjelajah",
        pickerSubtitle: "Karakter ini akan menyusuri ruang kenangan bersamamu.",
        pickerCta: "Mulai Jelajahi",
        pickerAttireFemale: "Kebaya & Topi Anyam",
        pickerAttireMale: "Busana Nusantara",
        introEyebrow: "Kado Spesial",
        introSubtitle: "Menyapa setiap sudut kenangan indah kita",
        mapTitle: "Peta Lokasi",
        mapSubtitle: "Ketuk salah satu sudut untuk langsung berkunjung.",
        npcSectionLabel: "Sapa Sahabat",
        progressTitle: "Jejak Momen",
        journalTitle: "Jurnal Kenangan",
        journalButtonLabel: "Buka Jurnal",
        footerCaption: "Saung Kenangan",
        wishSuccessToast: "Catatan tersimpan di buku kenangan.",
        wishFormSentNote: "Catatanmu langsung tersimpan.",
        wishSectionTitle: "Catatan & Ucapan",
        galleryFooterLabel: "Album Kenangan",
        icsDescription: "Kado Digital Saung Kenangan - Kado Digital",
        icsFilename: "saung-kenangan.ics",
        qrPrefix: "KADODIGITAL|SAUNG-KENANGAN",
      },
      stations: KADO_STATIONS,
      npcs: KADO_NPCS,
      initialWishes: [
        {
          id: "w-1",
          name: "Bagus Pratama",
          relation: "Sobat KKN",
          status: "Ucapan",
          message:
            "Selamat ulang tahun dan anniversary ke-2! Semoga selalu akur dan terus bikin memori seru.",
          createdAt: "Baru saja",
        },
        {
          id: "w-2",
          name: "Sari Wulandari",
          relation: "Sahabat Dekat",
          status: "Ucapan",
          message:
            "Kalian pasangan paling hangat! Selamat membuka setiap sudut Saung Kenangan ini.",
          createdAt: "1 jam lalu",
        },
        {
          id: "w-3",
          name: "Dimas Mahendra",
          relation: "Penjaga Saung",
          status: "Ucapan",
          message:
            "Jangan lupa dengar pesan suaranya di Pendopo dan gosok hadiahnya di Meja Hadiah!",
          createdAt: "Kemarin",
        },
      ],
      letter: {
        heading: "731 Hari yang Terasa Seperti Pulang ke Rumah",
        paragraphs: [
          "Selamat merayakan dua tahun perjalanan kita, Nadya. Aku sengaja merangkai ruang kecil ini supaya kamu bisa berjalan santai mengunjungi setiap kenangan yang paling aku syukuri.",
          "Dari kopi pagi sebelum berangkat kerja sampai tawa kecil sepulang kehujanan di pinggir jalan, terima kasih sudah selalu menjadi tempat pulang yang paling tenang.",
          "Jelajahi seluruh sudutnya: mampir ke Pendopo untuk mendengar pesan suara, coba kuis singkat di Bale Kayu, lalu gosok kartu hadiah rahasia di Meja Hantaran ya.",
        ],
        signOff: "Dengan seluruh rasa syukur, Raka",
        quote:
          "Rumah bukan sekadar tempat di peta, melainkan rasa tenang setiap kali melangkah bersamamu.",
        daysTogether: 731,
        dresscodeTitle: "Palet Hari Spesial Kita",
        dresscodeNote: "Nuansa alam yang paling sering kamu pilih saat perjalanan bersama.",
        dresscodeSwatches: [
          { label: "Hijau Zamrud", hex: "#2D6A4F" },
          { label: "Terracotta", hex: "#B85D3B" },
          { label: "Krem Linen", hex: "#EADBC6" },
          { label: "Kayu Jati", hex: "#6B3A24" },
        ],
      },
      voiceNote: {
        title: "Pesan Suara Malam · Untuk Nadya (00:38)",
        durationSec: 38,
        senderLabel: "Rekaman suara hangat dari Raka",
        transcript:
          "Hai Nadya, kalau kamu sudah sampai di Pendopo ini berarti kamu berhasil nemuin pesanku. Terima kasih untuk dua tahun yang sabar, hangat, dan penuh kejutan kecil. Akhir pekan nanti kosongin jadwal ya, ada kejutan makan malam dan tiket liburan menunggumu di Meja Hadiah!",
      },
      quiz: [
        {
          id: "q-1",
          question: "Minuman wajib yang selalu kita pesan setiap berhenti di kedai pinggir sawah?",
          options: [
            "Kopi Tubruk Gula Aren & Pisang Goreng",
            "Teh Tarik Dingin & Donat Cokelat",
            "Matcha Latte Panas Tanpa Gula",
          ],
          correctIndex: 0,
          correctFeedback: "Tepat 100%! Aroma kopi gula aren plus pisang goreng hangat nggak tergantikan.",
          wrongFeedback: "Hampir! Jawabannya selalu Kopi Tubruk Gula Aren & Pisang Goreng.",
        },
        {
          id: "q-2",
          question: "Apa yang selalu kita cari tiap pulang melewati jalan setapak saat sore?",
          options: [
            "Lampu toko kelontong",
            "Kunang-kunang di balik daun pisang",
            "Tukang bakso keliling",
          ],
          correctIndex: 1,
          correctFeedback: "Benar sekali! Coba ubah Suasana jadi 'Malam' di menu Pengaturan untuk melihatnya.",
          wrongFeedback: "Dekat! Kita selalu semangat mencari kunang-kunang di balik daun pisang.",
        },
        {
          id: "q-3",
          question: "Tempat favorit mana yang ingin segera kita kunjungi akhir bulan ini?",
          options: [
            "Menginap di vila kayu tepi sawah Ubud",
            "Belanja di pusat perbelanjaan kota",
            "Nonton maraton film di rumah saja",
          ],
          correctIndex: 0,
          correctFeedback: "Betul! Sekarang waktunya jalan ke Meja Hadiah dan gosok vouchermu!",
          wrongFeedback: "Jawabannya menginap di vila kayu tepi sawah. Cek kejutannya di Meja Hadiah!",
        },
      ],
      gift: {
        heading: "Meja Hadiah & Kejutan",
        subtitle: "Gosok kartu daun emas di bawah ini untuk membuka hadiah utama ulang tahun & anniversary kita.",
        accounts: [],
        deliveryAddress: "Taman Kenangan, Pakem, Sleman, DI Yogyakarta",
        scratchPrompt: "Gosok perlahan lapisan daun emas ini untuk membuka hadiah utamamu",
        scratchSecretTitle: "Voucher Liburan 2 Malam: Kabin Bambu Tepi Sawah",
        scratchSecretBody:
          "Berlaku akhir pekan ini! Semua akomodasi, sarapan pinggir sungai, dan makan malam kunang-kunang sudah beres kuatur.",
      },
      stories: KADO_STORIES,
      gallery: KADO_GALLERY,
    };
  }

  return {
    mode: "wedding",
    eyebrow: "Undangan Pernikahan",
    coverTag: "SAVE THE DATE",
    monogram: "R & N",
    namesLine: "Raka & Nadya",
    dateLine: "MINGGU, 17 OKTOBER 2027",
    shortDateLabel: "17 Okt 2027",
    defaultGuestName: "Bapak/Ibu/Saudara/i",
    gapuraTitle: "RAKA & NADYA",
    gapuraSubtitle: "Minggu, 17 Oktober 2027",
    coupleProfile: {
      groom: {
        fullName: "Raka Pradipta, S.T.",
        parents: "Putra dari Bpk. Hendra Wijaya & Ibu Ratna Dewi",
      },
      bride: {
        fullName: "Nadya Aulia, S.Ars.",
        parents: "Putri dari Bpk. Surya Pratama & Ibu Lestari",
      },
    },
    ui: {
      preloaderTitle: "Memuat Undangan",
      preloaderSubtitle: "Menyiapkan Pendopo & ruang perayaan...",
      coverSubtitle:
        "Dengan penuh syukur, kami mengundang Bapak/Ibu/Saudara/i untuk merayakan momen bahagia pernikahan kami.",
      coverCta: "Buka Undangan",
      pickerTitle: "Pilih Karakter Tamu",
      pickerSubtitle: "Karakter pilihan Anda akan menyusuri pelataran pendopo menuju pelaminan.",
      pickerCta: "Masuk ke Acara",
      pickerAttireFemale: "Kebaya Tamu",
      pickerAttireMale: "Beskap & Topi",
      introEyebrow: "The Wedding Of",
      introSubtitle: "Selamat datang di perayaan pernikahan kami · Minggu, 17 Oktober 2027",
      mapTitle: "Denah Lokasi Acara",
      mapSubtitle: "Ketuk salah satu area untuk langsung menuju informasi acara.",
      npcSectionLabel: "Sapa Tamu & Keluarga",
      progressTitle: "Panduan Acara",
      journalTitle: "Buku Undangan",
      journalButtonLabel: "Buka Undangan",
      footerCaption: "Walimatul Ursy",
      wishSuccessToast: "Ucapan & konfirmasi kehadiran berhasil terkirim.",
      wishFormSentNote: "Terima kasih, ucapan dan konfirmasi Anda telah kami catat.",
      wishSectionTitle: "Ucapan & Doa Restu",
      galleryFooterLabel: "Album Prewedding",
      icsDescription: "Undangan Pernikahan Raka & Nadya - Kado Digital",
      icsFilename: "pernikahan-raka-nadya.ics",
      qrPrefix: "KADODIGITAL|WEDDING-RAKA-NADYA",
    },
    stations: WEDDING_STATIONS,
    npcs: WEDDING_GUESTS,
    initialWishes: [
      {
        id: "w-1",
        name: "Bagus Pratama",
        relation: "Sahabat Kampus",
        status: "Hadir",
        message:
          "Selamat menempuh hidup baru, Raka & Nadya! Semoga rumah tangganya selalu teduh, rukun, dan penuh keberkahan.",
        createdAt: "10 menit lalu",
      },
      {
        id: "w-2",
        name: "Sari Wulandari",
        relation: "Sahabat Mempelai",
        status: "Hadir",
        message:
          "Turut berbahagia dari lubuk hati terdalam. Sampai bertemu di Pendopo Taman Srikandi hari Minggu nanti!",
        createdAt: "2 jam lalu",
      },
      {
        id: "w-3",
        name: "Dimas Mahendra",
        relation: "Keluarga Mempelai",
        status: "Doa Restu",
        message:
          "Semoga menjadi keluarga yang sakinah, mawaddah, warahmah, serta senantiasa dilimpahi kebahagiaan bersama.",
        createdAt: "Kemarin",
      },
    ],
    letter: {
      heading: "Menghitung Hari Menuju Akad & Resepsi",
      paragraphs: [
        "Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan akad nikah serta resepsi pernikahan putra-putri kami.",
        "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.",
      ],
      signOff: "Hormat kami yang berbahagia, Keluarga Besar Raka & Nadya",
      quote:
        "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan pasangan hidup untukmu agar kamu cenderung dan merasa tenteram kepadanya.",
      targetIso: "2027-10-17T09:00:00+07:00",
      dresscodeTitle: "Busana & Palet Warna",
      dresscodeNote: "Kami menganjurkan busana bernuansa Nusantara yang elegan dan nyaman untuk acara taman & pendopo.",
      dresscodeSwatches: [
        { label: "Hijau Zamrud", hex: "#2D6A4F" },
        { label: "Terracotta", hex: "#B85D3B" },
        { label: "Krem Gading", hex: "#F4E5CE" },
        { label: "Cokelat Sogan", hex: "#6B3A24" },
      ],
    },
    eventInfo: {
      venueName: "Pendopo Taman Srikandi",
      venueAddress: "Jl. Kaliurang KM 14, Sleman, DI Yogyakarta",
      mapsUrl: "https://maps.google.com/?q=Sleman+Yogyakarta",
      calendarStartIso: "20271017T020000Z",
      calendarEndIso: "20271017T070000Z",
      sessions: [
        {
          title: "Akad Nikah & Ijab Qobul",
          date: "Minggu, 17 Oktober 2027",
          time: "08.00 – 10.00 WIB",
          place: "Joglo Utama Pendopo Taman Srikandi",
        },
        {
          title: "Resepsi Pernikahan · Sesi I",
          date: "Minggu, 17 Oktober 2027",
          time: "11.00 – 13.00 WIB",
          place: "Pelataran Taman & Pendopo Pelaminan",
        },
        {
          title: "Ramah Tamah Senja · Sesi II",
          date: "Minggu, 17 Oktober 2027",
          time: "13.30 – 15.30 WIB",
          place: "Pelataran Taman & Pendopo Pelaminan",
        },
      ],
    },
    gift: {
      heading: "Amplop Digital & Pengiriman Kado",
      subtitle:
        "Doa restu Bapak/Ibu/Saudara/i merupakan karunia terindah bagi kami. Bagi yang ingin mengirimkan tanda kasih, dapat melalui rekening berikut.",
      accounts: [
        {
          id: "acc-bca",
          bank: "Bank BCA",
          number: "8420 9123 48",
          owner: "Raka Pradipta",
          color: "#1B5E47",
        },
        {
          id: "acc-mandiri",
          bank: "Bank Mandiri",
          number: "1370 0098 2214 5",
          owner: "Nadya Aulia",
          color: "#B85D3B",
        },
        {
          id: "acc-dana",
          bank: "DANA",
          number: "0812 3456 7890",
          owner: "Raka Pradipta",
          color: "#2F6F8F",
        },
        {
          id: "acc-gopay",
          bank: "GoPay",
          number: "0812 9876 5432",
          owner: "Nadya Aulia",
          color: "#4C7A4E",
        },
      ],
      deliveryAddress:
        "Pendopo Taman Srikandi, Jl. Kaliurang KM 14, Sleman, DI Yogyakarta 55581",
      scratchPrompt: "Bingkisan ucapan terima kasih: gosok kartu emas di bawah untuk membuka pesan dari kedua mempelai.",
      scratchSecretTitle: "Terima Kasih dari Raka & Nadya",
      scratchSecretBody:
        "Kehadiran dan doa restu Anda menyempurnakan hari bahagia kami. Sampai berjumpa di pelaminan!",
    },
    stories: WEDDING_STORIES,
    gallery: WEDDING_GALLERY,
  };
}
