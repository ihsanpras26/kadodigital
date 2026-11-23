import type { ThemeItem } from "@/lib/schemas";

export interface DemoPhotoMemory {
  id: string;
  date: string;
  title: string;
  caption: string;
  backNote: string;
  tint: string;
}

export interface DemoQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  correctFeedback: string;
  wrongFeedback: string;
}

export interface DemoPayload {
  eyebrow: string;
  coverTitle: string;
  coverSubtitle: string;
  daysTogether?: number;
  letterTitle: string;
  letterParagraphs: string[];
  letterSignOff: string;
  voiceNoteTitle: string;
  voiceNoteDurationSec: number;
  voiceNoteTranscript: string;
  scratchPrompt: string;
  scratchSecretTitle: string;
  scratchSecretBody: string;
  photos: DemoPhotoMemory[];
  quiz?: DemoQuizQuestion[];
  requiresPassphrase?: boolean;
  passphraseCode?: string;
  passphraseHint?: string;
  eventDetails?: {
    coupleOrHost: string;
    dateDisplay: string;
    isoStart: string;
    isoEnd: string;
    venueName: string;
    venueAddress: string;
    mapsUrl: string;
    sessions: { title: string; time: string; place: string }[];
    loveStory: { year: string; title: string; story: string }[];
    bankAccount: { bank: string; number: string; owner: string };
    initialWishes: { id: string; name: string; status: string; message: string }[];
  };
}

export function getDemoPayload(theme: ThemeItem): DemoPayload {
  if (theme.line === "kado-personal") {
    if (theme.subCategory === "Ulang Tahun" || theme.subCategory === "Interaktif/Kuis") {
      return {
        eyebrow: "Edisi Ulang Tahun Interaktif",
        coverTitle: "Selamat Tambah Usia, Raka!",
        coverSubtitle:
          "Tarik pita di bawah untuk membuka 3 bab kejutan, kuis kecil, dan kartu hadiah rahasia.",
        letterTitle: "24 Tahun Versi Terbaikmu",
        letterParagraphs: [
          "Happy birthday, Raka! Tahun kemarin mungkin penuh lemburan dan drama kopi sore, tapi kamu berhasil melewati semuanya dengan kepala dingin.",
          "Di halaman kecil ini aku kumpulkan tiga momen favorit kita plus satu kuis ringan buat ngetes daya ingatmu. Buka pelan-pelan sampai halaman terakhir ya.",
        ],
        letterSignOff: "— Dari Nadya, partner cari makan malam dadakan",
        voiceNoteTitle: "Pesan Suara Tengah Malam (00:42)",
        voiceNoteDurationSec: 42,
        voiceNoteTranscript:
          "Hai Raka, selamat ulang tahun ke-24! Jangan lupa istirahat cukup minggu ini. Sabtu malam kosongin jadwal ya, ada tempat ramen baru yang kemarin kamu sebut.",
        scratchPrompt: "Gosok kartu emas ini untuk buka traktiranmu",
        scratchSecretTitle: "Voucher Traktir Ramen & Kopi!",
        scratchSecretBody:
          "Berlaku hari Sabtu pukul 19.00 WIB — tinggal pilih cabang favoritmu, semua aku yang bayar.",
        photos: [
          {
            id: "b1",
            date: "12 Maret 2025",
            title: "Kopi Pertama Setelah Sidang",
            caption: "Muka lega setelah berbulan-bulan revisi.",
            backNote:
              "Hari itu kamu bilang cuma mau tidur 12 jam. Nyatanya kita malah muter kota sampai jam 10 malam.",
            tint: "#FFE8A3",
          },
          {
            id: "b2",
            date: "04 Agustus 2025",
            title: "Konser Hujan-Hujanan",
            caption: "Jas hujan plastik warna biru paling legendaris.",
            backNote:
              "Suara serak dua hari, tapi lagu penutup malam itu masih jadi playlist wajib tiap perjalanan.",
            tint: "#FFD6CC",
          },
          {
            id: "b3",
            date: "19 Oktober 2026",
            title: "Sore di Rooftop",
            caption: "Foto candid sebelum lampu kota nyala.",
            backNote:
              "Terima kasih sudah selalu jadi tempat paling tenang buat cerita hal-hal paling random.",
            tint: "#DCE4FF",
          },
        ],
        quiz: [
          {
            id: "q1",
            question: "Minuman darurat yang selalu kamu pesan pas lagi kejar deadline?",
            options: ["Es Kopi Susu Gula Aren", "Matcha Latte Panas", "Teh Tarik Dingin"],
            correctIndex: 0,
            correctFeedback: "Tepat 100%! Nggak pernah meleset dari es kopi susu.",
            wrongFeedback: "Hampir! Jawabannya es kopi susu gula aren andalanmu.",
          },
          {
            id: "q2",
            question: "Di mana kita pertama kali kehujanan bareng sampai sepatu basah semua?",
            options: ["Jalan Braga", "Stasiun Sudirman", "Pasar Santa"],
            correctIndex: 0,
            correctFeedback: "Betul! Di Braga sambil nungguin hujan reda 40 menit.",
            wrongFeedback: "Coba ingat lagi—di Jalan Braga waktu cari kopi sore!",
          },
          {
            id: "q3",
            question: "Apa yang sudah menunggumu di akhir kartu kado ini?",
            options: ["Traktir Ramen Sabtu Malam", "PR Tambahan", "Link Rapat Pagi"],
            correctIndex: 0,
            correctFeedback: "Benar! Gores kartu di bawah untuk klaim kadonya.",
            wrongFeedback: "Haha bukan rapat dong—ada voucher traktir ramen di bawah!",
          },
        ],
      };
    }

    if (theme.subCategory === "Sahabat") {
      return {
        eyebrow: "Kado Persahabatan",
        coverTitle: "Untuk Sahabat Anti Wacana: Tania",
        coverSubtitle:
          "Kumpulan polaroid, catatan pinggir yang jujur, dan doa terbaik untuk langkah barumu.",
        letterTitle: "Terima Kasih Sudah Jadi Rumah Kedua",
        letterParagraphs: [
          "Tania, dari zaman bingung cari kelas pagi sampai sekarang masing-masing sibuk ngejar target kerja, kamu tetap orang pertama yang kutelpon kalau ada kabar baik maupun panik.",
          "Balik tiap foto polaroid di bawah buat baca cerita kecil di baliknya—sebagian isinya aib manis kita sendiri.",
        ],
        letterSignOff: "— Sahabatmu yang paling sering telat 10 menit, Sinta",
        voiceNoteTitle: "Ucapan Geng Anti Wacana (00:55)",
        voiceNoteDurationSec: 55,
        voiceNoteTranscript:
          "Taniaa! Selamat menempuh babak baru! Pokoknya se-sibuk apa pun nanti, jadwal ngopi bulanan tetap wajib jalan ya!",
        scratchPrompt: "Gosok stiker di bawah buat baca janji geng",
        scratchSecretTitle: "Tiket Staycation / Picnic Geng!",
        scratchSecretBody:
          "Dana patungan sudah aman—tinggal pilih tanggal kosongmu bulan depan!",
        photos: [
          {
            id: "p1",
            date: "Semester 3",
            title: "Kantin Belakang Kampus",
            caption: "Numpang Wi-Fi sambil ngerjain tugas mepet jam 23.59.",
            backNote:
              "Bukti nyata kita bertahan hidup berkat nasi goreng kantin dan tawa nggak masuk akal.",
            tint: "#F4DEC4",
          },
          {
            id: "p2",
            date: "Wisuda Day",
            title: "Buket Bunga Terberat",
            caption: "Akhirnya lulus barengan juga.",
            backNote:
              "Bangga banget lihat kamu melewati semua presentasi sampai akhirnya foto pakai toga.",
            tint: "#E8E3D5",
          },
          {
            id: "p3",
            date: "Akhir Pekan Lalu",
            title: "Foto Booth 4 Gaya",
            caption: "Gaya terakhir selalu berantakan.",
            backNote:
              "Jangan pernah berubah ya, tetap jadi Tania yang hangat dan apa adanya.",
            tint: "#F7DCD3",
          },
        ],
      };
    }

    // Anniversary / LDR / Bloom
    return {
      eyebrow:
        theme.slug === "nocturne-keepsake"
          ? "Edisi Tengah Malam · Pasangan LDR"
          : "Edisi Anniversary",
      coverTitle:
        theme.slug === "nocturne-keepsake"
          ? "Untuk Kamu di Kota Seberang"
          : "Untuk Nadya, Tahun ke-2",
      coverSubtitle:
        "Buka segel surat ini pelan-pelan. Ada 3 kenangan, pesan suara, dan kejutan kecil di ujung halaman.",
      daysTogether: 730,
      letterTitle: "Setiap Kilometer & Kopi Pagi",
      letterParagraphs: [
        "Rasanya baru kemarin kita duduk canggung di kedai kopi sudut jalan sambil pura-pura nggak grogi. Hari ini genap 730 hari kita berjalan berdampingan, belajar sabar, dan saling memahami.",
        "Terima kasih sudah selalu merayakan kemenangan kecilku dan menenangkan hari-hari yang berat. Semoga kejutan kecil ini membuatmu tersenyum saat membacanya.",
      ],
      letterSignOff: "— Dengan seluruh rasa hangat, Dimas",
      voiceNoteTitle: "Rekaman Suara Spesial (00:48)",
      voiceNoteDurationSec: 48,
      voiceNoteTranscript:
        "Hai sayang, happy anniversary yang kedua. Maaf kalau minggu ini aku sibuk banget, tapi aku sudah siapin satu kejutan kecil di kartu paling bawah. Jangan lupa dibalik semua fotonya ya.",
      scratchPrompt: "Usap / gosok area ini untuk membuka janji kejutan",
      scratchSecretTitle: "Undangan Makan Malam & Akhir Pekan!",
      scratchSecretBody:
        "Sabtu jam 19.30 WIB di tempat pertama kali kita ketemu. Pakai baju warna favoritmu ya.",
      requiresPassphrase: theme.slug === "nocturne-keepsake",
      passphraseCode: "1402",
      passphraseHint: "Gunakan kode demo: 1402",
      photos: [
        {
          id: "a1",
          date: "14 Februari 2025",
          title: "Kopi Pertama di Braga",
          caption: "Awal dari obrolan 3 jam tanpa sadar waktu.",
          backNote:
            "Di meja nomor 4 itulah aku pertama kali tahu kamu nggak suka kopi yang terlalu manis.",
          tint: "#F2DFDB",
        },
        {
          id: "a2",
          date: "22 September 2025",
          title: "Kereta Sore ke Yogyakarta",
          caption: "Perjalanan jauh pertama yang paling berkesan.",
          backNote:
            "Kita ketiduran bareng di gerbong 3, lalu makan gudeg tengah malam sambil ketawa.",
          tint: "#EFE5D6",
        },
        {
          id: "a3",
          date: "14 Februari 2026",
          title: "Hari Ini & Seterusnya",
          caption: "Masih banyak bab indah yang menunggu.",
          backNote:
            "Terima kasih sudah bertahan dan memilih kita, bahkan di hari-hari yang nggak mudah.",
          tint: "#E8ECE7",
        },
      ],
    };
  }

  // Wedding / Save The Date / Event & Party
  const isSaveTheDate = theme.line === "save-the-date";
  const isEvent = theme.line === "event-party";

  return {
    eyebrow: isSaveTheDate
      ? "Save The Date"
      : isEvent
      ? `Undangan ${theme.subCategory}`
      : "The Wedding Invitation",
    coverTitle: isEvent
      ? theme.subCategory === "Wisuda"
        ? "Syukuran Wisuda S.Kom — Raka"
        : theme.subCategory === "Aqiqah"
        ? "Tasyakuran Aqiqah — Zayd Alfarizqi"
        : theme.subCategory === "Khitanan"
        ? "Walimatul Khitan — Rayyan"
        : theme.subCategory === "Bukber"
        ? "Bukber & Reuni Angkatan 2022"
        : theme.subCategory === "Hari Raya"
        ? "Silaturahmi & Open House Keluarga"
        : "Kezia's 23rd Birthday Dinner"
      : "Alya & Dimas",
    coverSubtitle: isSaveTheDate
      ? "Kunci tanggal bahagia kami sebelum undangan resmi dibagikan — Minggu, 14 Februari 2027."
      : isEvent
      ? "Dengan penuh kebahagiaan, kami mengundang kehadiran dan doa terbaikmu pada momen istimewa ini."
      : "Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami mengundangmu hadir pada hari bahagia kami.",
    letterTitle: isEvent ? "Rangkaian Acara" : "Kisah & Undangan Kami",
    letterParagraphs: [
      isEvent
        ? "Kehadiranmu akan menjadi pelengkap kehangatan acara kami. Silakan konfirmasi kehadiran di buku tamu agar kami dapat menyiapkan tempat terbaik untukmu."
        : "Dari pertemuan sederhana di tahun 2022 hingga langkah serius menuju pelaminan, kehadiran dan doa restumu adalah hadiah terindah bagi kami berdua.",
    ],
    letterSignOff: isEvent ? "— Sampai jumpa di lokasi!" : "— Alya & Dimas beserta keluarga",
    voiceNoteTitle: "Pesan Sambutan Suara (00:30)",
    voiceNoteDurationSec: 30,
    voiceNoteTranscript:
      "Halo sahabat semua, terima kasih sudah membuka undangan ini. Jangan lupa konfirmasi kehadiran dan tulis ucapanmu di bawah ya!",
    scratchPrompt: "Ketuk atau gosok untuk info dresscode",
    scratchSecretTitle: "Dresscode: Earth Tone & Cream",
    scratchSecretBody: "Kenakan busana santai rapi bernuansa linen, sage, atau gading hangat.",
    photos: [
      {
        id: "w1",
        date: "2022",
        title: "Pertemuan Pertama",
        caption: "Jakarta Selatan",
        backNote: "Berawal dari proyek kolaborasi yang berlanjut jadi cerita panjang.",
        tint: theme.palette.soft,
      },
      {
        id: "w2",
        date: "2025",
        title: "Lamaran Keluarga",
        caption: "Bandung",
        backNote: "Momen hangat pertemuan dua keluarga di pagi hari.",
        tint: theme.palette.soft,
      },
      {
        id: "w3",
        date: "2027",
        title: "Menuju Hari-H",
        caption: "14 Februari 2027",
        backNote: "Mohon doa restu agar segala persiapan berjalan lancar.",
        tint: theme.palette.soft,
      },
    ],
    eventDetails: {
      coupleOrHost: isEvent ? "Keluarga & Sahabat" : "Alya & Dimas",
      dateDisplay: "Minggu, 14 Februari 2027 · 10.00 – 15.00 WIB",
      isoStart: "20270214T100000",
      isoEnd: "20270214T150000",
      venueName: "Pendopo Taman Kemang",
      venueAddress: "Jl. Kemang Selatan No. 28, Jakarta Selatan",
      mapsUrl: "https://maps.google.com/?q=Kemang+Jakarta+Selatan",
      sessions: isSaveTheDate
        ? [{ title: "Hari Bahagia (Save The Date)", time: "14 Februari 2027 · Jakarta", place: "Detail jam menyusul" }]
        : isEvent
        ? [
            { title: "Registrasi & Ramah Tamah", time: "18.30 – 19.15 WIB", place: "Ruang Teras Utama" },
            { title: "Acara Inti & Makan Malam", time: "19.15 – 21.30 WIB", place: "Pendopo Taman Kemang" },
          ]
        : [
            { title: "Akad Nikah", time: "09.00 – 10.30 WIB", place: "Paviliun Kaca Taman Kemang" },
            { title: "Resepsi Siang", time: "11.00 – 14.30 WIB", place: "Pendopo Utama Taman Kemang" },
          ],
      loveStory: [
        { year: "2022", title: "Awal Bertemu", story: "Dipertemukan dalam satu acara komunitas desain di Jakarta." },
        { year: "2024", title: "Melangkah Serius", story: "Memutuskan menyatukan visi dan mulai merencanakan masa depan bersama." },
        { year: "2027", title: "Hari Pernikahan", story: "Membuka lembaran baru di hadapan keluarga dan sahabat terdekat." },
      ],
      bankAccount: {
        bank: "BCA",
        number: "5210 8842 19",
        owner: "Alya Putri Rahmawati",
      },
      initialWishes: [
        {
          id: "wish-1",
          name: "Raka Pratama",
          status: "Hadir",
          message: "Selamat untuk kalian berdua! Pasti hadir dan siap meramaikan.",
        },
        {
          id: "wish-2",
          name: "Nadia Salsabila",
          status: "Hadir",
          message: "Turut berbahagia, semoga lancar sampai hari-H dan langgeng selalu.",
        },
      ],
    },
  };
}
