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
    dockLabel: "Surat buat kamu",
    markerLabel: "Surat buat kamu",
    ribbon: "Undangan Pernikahan",
    title: "Menghitung Hari Bahagia",
    x: 3.4,
    z: 2.2,
    interactRadius: 2.3,
  },
  {
    id: "acara",
    dockLabel: "Acara",
    markerLabel: "Pendopo Acara",
    ribbon: "Jadwal & Lokasi",
    title: "Rangkaian Acara",
    x: 6.2,
    z: -3.6,
    interactRadius: 2.7,
  },
  {
    id: "ucapan",
    dockLabel: "Ucapan & RSVP",
    markerLabel: "Ucapan & RSVP",
    ribbon: "Buku Tamu",
    title: "Doa Restu & Konfirmasi",
    x: -2.0,
    z: 1.5,
    interactRadius: 2.3,
  },
  {
    id: "kado",
    dockLabel: "Kado",
    markerLabel: "Meja Hantaran",
    ribbon: "Tanda Kasih",
    title: "Amplop & Hadiah Digital",
    x: 1.8,
    z: -2.4,
    interactRadius: 2.3,
  },
  {
    id: "cerita",
    dockLabel: "Cerita Kami",
    markerLabel: "Papan Cerita",
    ribbon: "Perjalanan",
    title: "Jejak Cerita Kami",
    x: -3.2,
    z: -2.8,
    interactRadius: 2.3,
  },
  {
    id: "galeri",
    dockLabel: "Galeri",
    markerLabel: "Pigura Galeri",
    ribbon: "Album Desa",
    title: "Galeri Momen",
    x: 6.8,
    z: 2.6,
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
    x: 3.4,
    z: 2.2,
    interactRadius: 2.3,
  },
  {
    id: "acara",
    dockLabel: "Pesan Suara",
    markerLabel: "Pendopo Suara",
    ribbon: "Rekaman Hangat",
    title: "Pesan Suara Spesial",
    x: 6.2,
    z: -3.6,
    interactRadius: 2.7,
  },
  {
    id: "ucapan",
    dockLabel: "Kuis Kenangan",
    markerLabel: "Bale Kuis",
    ribbon: "Tebak Momen",
    title: "Kuis Kenangan Kita",
    x: -2.0,
    z: 1.5,
    interactRadius: 2.3,
  },
  {
    id: "kado",
    dockLabel: "Kado Rahasia",
    markerLabel: "Meja Hadiah",
    ribbon: "Gosok & Buka",
    title: "Voucher Kejutan Untukmu",
    x: 1.8,
    z: -2.4,
    interactRadius: 2.3,
  },
  {
    id: "cerita",
    dockLabel: "Cerita Kita",
    markerLabel: "Papan Cerita",
    ribbon: "Album Waktu",
    title: "Bab Perjalanan Kita",
    x: -3.2,
    z: -2.8,
    interactRadius: 2.3,
  },
  {
    id: "galeri",
    dockLabel: "Galeri Foto",
    markerLabel: "Pigura Galeri",
    ribbon: "Foto & Catatan",
    title: "Galeri Balik Kartu",
    x: 6.8,
    z: 2.6,
    interactRadius: 2.3,
  },
];

const VILLAGE_NPCS: DesaNpcData[] = [
  {
    id: "npc-raka",
    name: "Bagus Pratama",
    roleLabel: "Sahabat Kampus",
    gender: "cowok",
    outfitColor: "#2D6A4F",
    accentColor: "#D4A359",
    hairColor: "#2B1E17",
    hatType: "caping",
    defaultWish:
      "Selamat menempuh hidup baru, Raka & Nadya! Semoga rumah tangganya selalu teduh dan penuh tawa seperti pagi di desa ini.",
    patrolPoints: [
      { x: 4.5, z: 3.4 },
      { x: 5.5, z: 1.1 },
    ],
  },
  {
    id: "npc-sari",
    name: "Sari Wulandari",
    roleLabel: "Tetangga Desa",
    gender: "cewek",
    outfitColor: "#B85D3B",
    accentColor: "#F4E5CE",
    hairColor: "#231712",
    hatType: "floral",
    defaultWish:
      "Senang sekali melihat kalian merayakan momen ini di Desa Asri. Jangan lupa mampir ke Pendopo dan isi buku tamu ya!",
    patrolPoints: [
      { x: -1.1, z: 3.1 },
      { x: 0.4, z: 2.6 },
    ],
  },
  {
    id: "npc-dimas",
    name: "Dimas Mahendra",
    roleLabel: "Keluarga Dekat",
    gender: "cowok",
    outfitColor: "#486B5A",
    accentColor: "#E8C37D",
    hairColor: "#1F1612",
    hatType: "none",
    defaultWish:
      "Doa terbaik selalu menyertai setiap langkah kalian berdua. Coba klik suasana Malam di tombol Pengaturan untuk melihat kunang-kunang!",
    patrolPoints: [
      { x: 3.2, z: -3.2 },
      { x: 4.8, z: -2.0 },
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
      { x: 3.2, z: -3.2 },
      { x: 4.8, z: -2.0 },
    ],
  },
];

const SHARED_STORIES: DesaStoryChapter[] = [
  {
    id: "story-1",
    year: "2022 · Pagi di Bukit",
    title: "Pertemuan Pertama di Tepi Sawah",
    description:
      "Berawal dari obrolan singkat sambil menunggu kabut pagi surut di kedai kopi desa. Dari cangkir pertama, percakapan sederhana terasa begitu akrab.",
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
    year: "2026 · Senja Desa",
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
      "Kini semua kenangan itu kami rangkai menjadi sebuah desa kecil yang bisa kamu jelajahi, lengkap dengan doa dan harapan baik untuk masa depan.",
    image: "/themes/desa-asri/scene-6.png",
  },
];

const SHARED_GALLERY: DesaGalleryPhoto[] = [
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
      dateLine: "2 TAHUN PENUH CERITA · DESA ASRI",
      shortDateLabel: "2 Tahun Bersama",
      defaultGuestName: "Nadya Aulia",
      gapuraTitle: "SAUNG KENANGAN",
      gapuraSubtitle: "Dua Tahun Penuh Cerita",
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
          "Selamat merayakan dua tahun perjalanan kita, Nadya. Aku sengaja membangun desa kecil ini supaya kamu bisa berjalan santai mengunjungi setiap kenangan yang paling aku syukuri.",
          "Dari kopi pagi sebelum berangkat kerja sampai tawa kecil sepulang kehujanan di pinggir jalan, terima kasih sudah selalu menjadi tempat pulang yang paling tenang.",
          "Jelajahi seluruh sudut desa: mampir ke Pendopo untuk mendengar pesan suara, coba kuis singkat di Bale Kayu, lalu gosok kartu hadiah rahasia di Meja Hantaran ya.",
        ],
        signOff: "Dengan seluruh rasa syukur, Raka",
        quote:
          "Rumah bukan sekadar tempat di peta, melainkan rasa tenang setiap kali melangkah bersamamu.",
        daysTogether: 731,
        dresscodeTitle: "Palet Hari Spesial Kita",
        dresscodeNote: "Nuansa alam yang paling sering kamu pilih saat perjalanan bersama.",
        dresscodeSwatches: [
          { label: "Hijau Sawah", hex: "#2D6A4F" },
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
          "Hai Nadya, kalau kamu sudah sampai di Pendopo Desa ini berarti kamu berhasil nemuin pesanku. Terima kasih untuk dua tahun yang sabar, hangat, dan penuh kejutan kecil. Akhir pekan nanti kosongin jadwal ya, ada kejutan makan malam dan tiket liburan menunggumu di Meja Hadiah!",
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
          question: "Apa yang selalu kita cari tiap pulang melewati jalan desa saat sore?",
          options: [
            "Lampu toko kelontong",
            "Kunang-kunang di balik daun pisang",
            "Tukang bakso keliling",
          ],
          correctIndex: 1,
          correctFeedback: "Benar sekali! Coba ubah Suasana Desa jadi 'Malam' di menu Pengaturan untuk melihatnya.",
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
        deliveryAddress: "Saung Tepi Sawah, Pakem, Sleman, DI Yogyakarta",
        scratchPrompt: "Gosok perlahan lapisan daun emas ini untuk membuka hadiah utamamu",
        scratchSecretTitle: "Voucher Liburan 2 Malam: Kabin Bambu Tepi Sawah",
        scratchSecretBody:
          "Berlaku akhir pekan ini! Semua akomodasi, sarapan pinggir sungai, dan makan malam kunang-kunang sudah beres kuatur.",
      },
      stories: SHARED_STORIES,
      gallery: SHARED_GALLERY,
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
    gapuraSubtitle: "17 Oktober 2027 · Desa Asri",
    stations: WEDDING_STATIONS,
    npcs: VILLAGE_NPCS,
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
        relation: "Tetangga Desa",
        status: "Hadir",
        message:
          "Turut berbahagia dari lubuk hati terdalam. Sampai bertemu di Pendopo Griya Asri hari Minggu nanti!",
        createdAt: "2 jam lalu",
      },
      {
        id: "w-3",
        name: "Dimas Mahendra",
        relation: "Keluarga Dekat",
        status: "Doa Restu",
        message:
          "Semoga menjadi keluarga yang sakinah, mawaddah, warahmah, dan selalu hangat seperti suasana desa ini.",
        createdAt: "Kemarin",
      },
    ],
    letter: {
      heading: "Menghitung Hari Menuju Akad & Resepsi",
      paragraphs: [
        "Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan syukuran pernikahan kami di tengah suasana asri pedesaan.",
        "Merupakan suatu kehormatan dan kebahagiaan apabila Bapak/Ibu/Saudara/i berkenan hadir, berjalan santai menyapa kenangan kami di desa kecil ini, serta memberikan doa restu.",
      ],
      signOff: "Hormat kami yang berbahagia, Keluarga Besar Raka & Nadya",
      quote:
        "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan pasangan hidup untukmu agar kamu cenderung dan merasa tenteram kepadanya.",
      targetIso: "2027-10-17T09:00:00+07:00",
      dresscodeTitle: "Busana & Palet Warna",
      dresscodeNote: "Kami menganjurkan busana bernuansa alam Nusantara yang nyaman untuk acara taman & pendopo.",
      dresscodeSwatches: [
        { label: "Hijau Daun", hex: "#2D6A4F" },
        { label: "Terracotta", hex: "#B85D3B" },
        { label: "Krem Gading", hex: "#F4E5CE" },
        { label: "Cokelat Sogan", hex: "#6B3A24" },
      ],
    },
    eventInfo: {
      venueName: "Pendopo Griya Asri Pakem",
      venueAddress: "Jl. Kaliurang KM 17, Tepi Sawah Pakem, Sleman, Yogyakarta",
      mapsUrl: "https://maps.google.com/?q=Pakem+Sleman+Yogyakarta",
      calendarStartIso: "20271017T020000Z",
      calendarEndIso: "20271017T070000Z",
      sessions: [
        {
          title: "Akad Nikah & Ijab Qobul",
          date: "Minggu, 17 Oktober 2027",
          time: "08.00 – 10.00 WIB",
          place: "Joglo Utama Pendopo Griya Asri",
        },
        {
          title: "Resepsi Tepi Sawah · Sesi I",
          date: "Minggu, 17 Oktober 2027",
          time: "11.00 – 13.00 WIB",
          place: "Pelataran Taman & Pendopo Asri",
        },
        {
          title: "Ramah Tamah Senja · Sesi II",
          date: "Minggu, 17 Oktober 2027",
          time: "13.30 – 15.30 WIB",
          place: "Pelataran Taman & Pendopo Asri",
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
        "Pendopo Griya Asri, Jl. Kaliurang KM 17, Pakem, Sleman, DI Yogyakarta 55582",
      scratchPrompt: "Bonus untuk tamu yang mampir: gosok kartu kecil di bawah untuk pantun & pesan spesial!",
      scratchSecretTitle: "Pantun Hangat dari Pengantin",
      scratchSecretBody:
        "Pergi ke desa memetik melati, langit sore berwarna jingga. Terima kasih sudah singgah kemari, doa terbaikmu sangat berharga!",
    },
    stories: SHARED_STORIES,
    gallery: SHARED_GALLERY,
  };
}
