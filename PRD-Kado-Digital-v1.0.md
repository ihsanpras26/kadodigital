# KADO DIGITAL

## Product Requirements Document

**Domain:** kadodigital.my.id  
**Versi:** 1.0 - Rancangan produk untuk validasi dan pengembangan  
**Tanggal acuan riset:** 18 Oktober 2026, Asia/Jakarta  
**Bahasa produk:** Bahasa Indonesia  
**Pemilik produk:** Founder Kado Digital  
**Pembaca:** Founder, product designer, developer, motion designer, dan operator layanan.

Dokumen ini merumuskan produk, brand, model bisnis, alur layanan, kebutuhan sistem, dan kriteria peluncuran Kado Digital. Keputusan yang ditandai **usulan** atau **hipotesis** belum merupakan keputusan bisnis yang disahkan. Harga, kapasitas, jadwal, dan target metrik adalah angka awal untuk diuji. Dokumen ini tidak menyatakan website telah dibangun atau domain telah dikonfigurasi.

## Ringkasan keputusan

Kado Digital adalah studio jasa pembuatan kado ucapan berbentuk website personal. Pelanggan membawa cerita, foto, dan pesan; tim merangkainya menjadi pengalaman dengan animasi, interaksi, dan kejutan yang dibagikan melalui satu link.

- **Pasar awal:** Gen Z dewasa, dengan kasus utama ulang tahun pasangan dan anniversary. Sahabat dan wisuda menjadi perluasan berikutnya.
- **Positioning:** kado digital yang dirancang berdasarkan cerita dan karakter penerimanya, dengan pengerjaan dibantu tim.
- **Model peluncuran:** jasa terkelola dengan koleksi desain siap dipersonalisasi; pesanan dan komunikasi dibantu WhatsApp, materi dikumpulkan melalui halaman aman.
- **Pembeda yang dibangun:** rangkaian kejutan personal, demonstrasi produk yang bisa dicoba, mutu gerakan dan interaksi, layanan yang jelas, dan koleksi yang diperbarui melalui proses terukur.
- **Arah brand usulan:** ekspresif dan hangat; identitas utama cobalt, cream, dan coral, dengan palet produk yang fleksibel.
- **MVP:** website penjualan, tiga demo desain, alur order dan pengumpulan materi, panel operator sederhana, preview privat, persetujuan versi, serta halaman kado penerima.
- **Harga uji:** Cerita Rp89.000, Kejutan Rp169.000, Signature mulai Rp349.000. Semuanya usulan, termasuk batas fitur dan SLA.
- **Prinsip kualitas:** semua paket mempunyai animasi dan interaksi; perbedaannya terletak pada kedalaman personalisasi, kapasitas konten, dan tenaga kreatif.

## Cara membaca

**Fakta brief** berasal dari pemilik produk. **Observasi** berasal dari halaman publik dengan nomor sumber [Sxx]. **Analisis** adalah interpretasi terhadap observasi. **Usulan** merupakan rancangan Kado Digital. **Hipotesis** memerlukan wawancara, eksperimen, atau data transaksi. P0 berarti wajib sebelum peluncuran berbayar; P1 berarti pengembangan setelah MVP stabil; P2 berarti opsi jangka lebih panjang.

# 01. Mandat produk dan batas keputusan

## 1.1 Fakta brief

Nama brand ditetapkan sebagai **Kado Digital**. Pemilik telah membeli domain **kadodigital.my.id**. Produk yang diinginkan adalah jasa pembuatan ucapan digital untuk ulang tahun, anniversary, dan momen lain. Target utama adalah Gen Z. Empat kekuatan yang harus terlihat adalah animasi, interaksi, kelengkapan fitur, serta desain yang relevan dan segar. Brand harus berkarakter, ekspresif, modern, dan estetik. Warna utama belum ditetapkan. Invitee.web.id dan Inveet.id menjadi referensi yang perlu dipelajari.

## 1.2 Interpretasi produk

Website mempunyai dua pengalaman utama: pembeli memilih serta memesan kado, dan penerima membuka hasil kadonya. Di belakang keduanya terdapat proses produksi yang harus dapat dijalankan operator secara konsisten. Kualitas pengalaman penerima menjadi bukti utama janji brand, sedangkan website penjualan membantu pembeli memahami hasil, harga, dan cara pengerjaan.

## 1.3 Asumsi operasional untuk PRD

| Area | Asumsi awal | Dampak bila berubah |
|---|---|---|
| Layanan | Tim mengerjakan personalisasi; pelanggan tidak mendesain sendiri | Builder mandiri memerlukan proyek terpisah |
| Tim | Satu founder/operator, dukungan desain atau development sesuai kebutuhan | Kapasitas dan SLA mengikuti jumlah tenaga |
| Pembeli | Segmen awal 18-28 tahun sebagai pilihan fokus, bukan batas definisi Gen Z | Perlu riset tambahan untuk segmen lebih muda atau lebih tua |
| Pembayaran | Verifikasi manual melalui kanal merchant resmi pada MVP | Otomatisasi gateway masuk P1 |
| Hosting | Halaman penerima memakai runtime bersama dan konten per order | Hindari pembuatan proyek hosting baru untuk tiap pelanggan |
| Masa aktif | 12 bulan sejak publikasi pertama untuk seluruh paket | Perpanjangan memerlukan harga dan alokasi biaya |
| Anggaran | Belum ditetapkan pemilik | Estimasi pengembangan dinyatakan sebagai rentang, bukan penawaran |

## 1.4 Tujuan dan non-tujuan

**Tujuan:** memudahkan orang membuat ucapan personal yang menarik dibuka; menghasilkan pesanan yang layak secara ekonomi; mempertahankan kualitas saat jumlah pesanan bertambah; membangun identitas yang bisa dikenali tanpa bergantung pada satu tren.

**Di luar MVP:** undangan pernikahan, daftar tamu dan RSVP acara, bulk WhatsApp, marketplace kreator, editor bebas drag-and-drop, aplikasi mobile, AI pembuat seluruh cerita tanpa review, perekaman reaksi penerima, serta katalog berisi puluhan desain sebelum desain awal terbukti.

## 1.5 Keberhasilan awal

MVP dianggap layak dilanjutkan ketika pelanggan dapat memahami produk melalui demo, membayar untuk hasil yang diterima, menyiapkan materi dengan bantuan yang wajar, dan menerima link sesuai janji pengerjaan. Keberhasilan tidak ditentukan hanya oleh jumlah animasi, jumlah fitur, atau kunjungan halaman.

# 02. Riset referensi dan pelajaran bisnis

## 2.1 Metode dan keterbatasan

Riset menggunakan halaman publik, katalog, halaman pendaftaran, serta informasi yang terindeks. Halaman Inveet dapat dibaca. Akses langsung Invitee mengalami timeout; observasinya bertumpu pada salinan halaman domain yang terindeks [S01]. Tidak ada transaksi, pendaftaran akun, penggunaan dashboard, pengujian keamanan, atau pengukuran performa kompetitor. Keberadaan fitur berarti fitur ditawarkan pada halaman publik, bukan keberhasilan fiturnya sudah diuji.

Invitee.web.id dipisahkan dari Invitee.site; informasi domain kedua tidak digunakan. Kedua referensi merupakan pembanding berdekatan dalam kategori undangan acara, sehingga harga mereka bukan bukti kesediaan membayar untuk kado personal. Statistik penjualan atau testimoni kompetitor tidak diperlakukan sebagai data independen.

## 2.2 Invitee.web.id: observasi publik

Invitee memosisikan produk sebagai platform pembuatan undangan online. Halaman publik menawarkan tema, musik, galeri, love story, peta, buku tamu, QR, amplop digital, dan WhatsApp blast. Paket wedding yang tertera: gratis 2 hari; Silver Rp99.000/10 hari; Gold Rp199.000/30 hari; Platinum Rp249.000/90 hari; Diamond Rp299.000/150 hari. Birthday dan beberapa event lain tercantum Rp149.000/30 hari; Save The Date Rp199.000/30 hari. Angka merupakan harga tampil/promosi saat sumber diakses, bukan hasil checkout. CTA daftar dan paket berjenjang menunjukkan pola platform dengan monetisasi per undangan; alur dashboard tidak diverifikasi. Terdapat ketidakkonsistenan antara klaim masa aktif selamanya dan durasi paket, serta jumlah tema/musik pada bagian berbeda. [S01]

**Pelajaran untuk Kado Digital - analisis:** buat hasil mudah dilihat sebelum order; gunakan paket yang bisa dibandingkan; tampilkan masa aktif, kapasitas konten, dan layanan secara konsisten di seluruh halaman. Katalog besar tidak menjadi prioritas sebelum mutu desain awal terbukti.

## 2.3 Inveet.id: observasi publik

Inveet menawarkan undangan pernikahan yang dibuat melalui alur daftar, pilih tema, isi data, dan bagikan link. Halaman utama menampilkan paket Bronze gratis/2 hari, Silver Rp79.000, Diamond Rp125.000, dan Sapphire Rp249.000 dengan pembayaran sekali. Fitur yang dipromosikan mencakup pengaturan desain, foto, musik, rekaman suara, pengelolaan tamu, RSVP, QR, privasi, dan fitur persiapan acara. Tema interaktif dan photobooth berada pada paket atas. Beberapa paket berbayar mengiklankan masa aktif tanpa batas. Semua ini adalah klaim produk publik, bukan hasil pengujian. [S02]

Katalognya membantu membandingkan kategori, palet, dan preview; akses paket juga terlihat pada tema. Jumlah katalog dapat berubah sehingga tidak dijadikan angka perencanaan. [S03] Halaman khusus game menunjukkan bahwa cerita dan eksplorasi interaktif sudah digunakan untuk undangan pernikahan. [S04] Halaman pendaftaran mengonfirmasi adanya titik masuk akun; kemampuan setelah login belum diuji. [S05]

**Pelajaran untuk Kado Digital - analisis:** perlihatkan pengalaman sebelum menjelaskan daftar fitur; bedakan tema berdasarkan suasana dan mekanik; bangun alur yang mudah dipahami dari HP; tempatkan kontrol akses sebagai kebutuhan produk sejak awal.

## 2.4 Hal positif dan adaptasinya

| Pelajaran | Adaptasi usulan Kado Digital | Kriteria pelaksanaan |
|---|---|---|
| Hasil dapat dipreview | Demo penuh dengan nama dan materi contoh | Bisa dimainkan tanpa login |
| Paket mudah dibandingkan | Tiga paket berbasis hasil dan tenaga personalisasi | Harga, batas, masa aktif, dan revisi terlihat bersama |
| Katalog membantu memilih | Filter momen, penerima, dan suasana | Demo, harga mulai, serta mekanik tampil di kartu |
| Pengalaman personal | Brief berisi cerita, kenangan, dan kebiasaan penerima | Minimal satu detail personal masuk ke hasil |
| Pengelolaan rapi | Satu order ID menghubungkan materi, pembayaran, dan versi | Informasi utama tidak hanya tersimpan di chat |
| Fitur pengalaman menarik | Pustaka animasi dan interaksi yang dapat digunakan ulang | Kualitas tetap konsisten antarorder |

Tabel di atas adalah keputusan adaptasi, bukan daftar fitur tambahan yang sudah dimiliki kompetitor.

## 2.5 Pemeriksaan kategori kado digital

HeyTML sudah menawarkan scrapbook interaktif dengan foto, pesan, musik, dan personalisasi. [S06] Abadikan menampilkan beberapa format hadiah digital, termasuk scrapbook, musik, dan perjalanan kenangan. [S07] Observasi ini cukup untuk menolak klaim bahwa scrapbook atau interaksi saja merupakan penemuan baru. Riset ini tidak memetakan seluruh pemain dan tidak membuktikan adanya ruang pasar tanpa pesaing.

**Kesimpulan strategi - inferensi:** ruang yang dapat diuji adalah layanan kreatif terkelola yang kuat dalam pengarahan cerita, kualitas pengalaman, dan kejelasan pengerjaan. Keunggulan harus dibuktikan melalui demo, hasil pelanggan, dan efisiensi produksi.

# 03. Positioning dan nilai yang ditawarkan

## 3.1 Pernyataan positioning

Untuk Gen Z yang ingin merayakan orang tersayang dengan ucapan personal, Kado Digital menyediakan jasa pembuatan website kado yang menggabungkan cerita, animasi, dan interaksi. Tim membantu merangkai materi menjadi rangkaian kejutan yang sesuai karakter penerima dan siap dibagikan melalui satu link.

## 3.2 Janji produk

**Cerita kamu, jadi kejutan mereka.**

Janji ini menghubungkan input pembeli dengan pengalaman penerima. Nama, foto, suara, dan kenangan harus terasa menyatu dalam desain. Pengalaman dapat menyenangkan, hangat, atau intim sesuai brief; produk tidak menjanjikan respons emosional tertentu dari seseorang.

## 3.3 Definisi empat core

| Core | Definisi produk | Standar minimum MVP |
|---|---|---|
| Full animation | Gerakan mendukung pembukaan, perpindahan, dan reveal | Opening, transisi bab, serta feedback tombol konsisten; tersedia mode gerak ringan |
| Full interaction | Penerima melakukan tindakan bermakna untuk menemukan konten | Minimal dua mekanik pada semua paket, dengan alternatif tap/keyboard |
| Full of features | Pustaka modul cukup kaya untuk berbagai cerita | Foto dan catatan, surat, audio, serta reveal; fitur dipilih sesuai paket dan brief |
| Fresh dan relevan | Koleksi berkembang melalui riset dan pengujian | Review koleksi bulanan; versi lama pelanggan tetap stabil |

Kalimat pemasaran harus menampilkan contoh konkret dari empat core. Klaim seperti semua fitur tersedia, selalu mengikuti semua tren, dan unlimited tidak digunakan tanpa batas operasional yang jelas.

## 3.4 Diferensiasi yang dapat dibuktikan

| Diferensiasi usulan | Bentuk produk dan layanan | Bukti yang harus tersedia |
|---|---|---|
| Cerita diarahkan | Brief pendek membantu memilih detail paling berarti | Contoh sebelum dan sesudah pengarahan cerita |
| Kejutan berurutan | Pembuka, kenangan, pesan, lalu penutup dirancang sebagai satu alur | Demo penuh yang bisa dijalankan |
| Interaksi sesuai hubungan | Pesan belakang foto, ungkapan khas, atau detail kenangan | Satu detail yang tidak bisa dipertukarkan begitu saja |
| Desain dengan karakter | Tiga keluarga visual dengan mekanik dan ritme berbeda | Perbandingan demo, bukan sekadar varian warna |
| Layanan jelas | Jadwal, materi, revisi, persetujuan, dan masa aktif terdokumentasi | Ringkasan order dan status yang dapat diakses pembeli |
| Kenangan dapat dikunjungi lagi | Replay dan susunan bab tetap mudah digunakan | Penerima bisa membuka ulang tanpa mengulang semua interaksi |

Keunggulan jangka panjang dibangun dari pustaka pengalaman, proses pengarahan cerita, sistem produksi, reputasi layanan, dan data penggunaan yang tidak memuat isi pribadi pelanggan. Efek visual individual mudah ditiru.

## 3.5 Pilihan pendekatan bisnis

| Pendekatan | Kelebihan | Konsekuensi | Keputusan |
|---|---|---|---|
| Jasa terkelola dengan desain terkurasi | Kualitas dapat diarahkan dan cepat belajar dari pelanggan | Membutuhkan kapasitas operator | Dipilih untuk MVP |
| Builder mandiri | Potensi skala lebih besar dan hasil instan | Editor, support, dan validasi konten lebih kompleks | Evaluasi setelah pola order terbukti |
| Studio custom penuh | Fleksibilitas dan nilai pesanan lebih tinggi | Waktu produksi dan ketidakpastian lebih besar | Paket terbatas dengan quotation |

# 04. Pengguna, masalah, dan pekerjaan yang ingin diselesaikan

## 4.1 Segmen awal

| Segmen hipotesis | Kebutuhan | Hambatan | Prioritas |
|---|---|---|---|
| Pasangan yang merayakan ulang tahun | Ucapan terasa diusahakan dan sesuai karakter | Sulit merangkai foto dan kata-kata | Utama |
| Pasangan anniversary atau LDR | Merangkum perjalanan dan merasa dekat | Kenangan tersebar; hadiah fisik tidak selalu praktis | Utama |
| Sahabat | Kejutan yang lucu, khas, dan mudah dibagikan | Desain romantis tidak cocok untuk semua hubungan | Perluasan |
| Keluarga atau wisuda | Ucapan hangat dan mudah dibuka | Penerima mungkin kurang familiar dengan interaksi | Perluasan |

Segmen di atas merupakan hipotesis dari brief, bukan hasil survei Gen Z. Wilayah layanan awal Indonesia dan bahasa utama Indonesia adalah pilihan operasional. Pelanggan boleh mengirim isi ucapan dalam bahasa lain selama layout serta QA mendukungnya.

## 4.2 Jobs to be done

- Ketika momen orang tersayang mendekat, saya ingin mengubah kenangan yang sudah saya punya menjadi hadiah personal, supaya usaha saya terasa dalam hasilnya.
- Ketika saya kesulitan menulis atau memilih desain, saya ingin mendapat arahan sederhana, supaya tidak berhenti sebelum memesan.
- Ketika saya menerima link kado, saya ingin langsung tahu cara membuka dan menikmatinya, supaya kejutan tidak berubah menjadi kebingungan.
- Ketika saya mengerjakan beberapa pesanan, saya ingin materi, versi, dan jadwal tersusun, supaya tidak tertukar atau terlambat.

## 4.3 Masalah yang perlu divalidasi

Pelanggan mungkin takut hasil terlihat generik, harga tidak sebanding dengan halaman yang diterima, foto pribadi tersebar, atau pengerjaan melewati tanggal penting. Mereka juga mungkin menunda pengumpulan bahan karena harus memilih terlalu banyak foto. Kebutuhan bantuan menulis dan minat terhadap minigame belum diketahui; jangan menganggap semua pembeli menginginkannya.

## 4.4 Prinsip pengalaman

Pengguna harus dapat memahami nilai produk dalam satu demo, memilih dengan sedikit keputusan, dan mengetahui langkah berikutnya pada setiap status. Penerima tetap dapat menikmati ucapan tanpa suara, tanpa kemampuan bermain game, dan tanpa membuat akun. Konten yang lebih personal lebih diutamakan daripada menambahkan interaksi yang tidak mendukung cerita.

# 05. Arah brand dan sistem visual

## 5.1 Karakter brand

**Ekspresif:** berani dalam tipografi, komposisi, dan gerakan. **Hangat:** menempatkan hubungan dan cerita sebagai pusat. **Modern:** rapi, responsif, dan konsisten. **Estetik:** setiap elemen mendukung satu arah visual yang jelas. **Membantu:** proses pemesanan terasa ringan dengan pilihan yang terarah.

Nama ditulis **Kado Digital** pada komunikasi utama. Domain ditulis **kadodigital.my.id**. Karena nama deskriptif, pengenalan brand perlu diperkuat lewat wordmark, gaya ilustrasi, gerakan pembukaan, dan suara penulisan yang konsisten. Kepemilikan domain tidak dianggap sebagai bukti pendaftaran merek; pemeriksaan nama/merek merupakan keputusan bisnis terpisah bila akan dilakukan.

## 5.2 Tiga rute warna usulan

| Rute | Warna | Karakter dan penggunaan |
|---|---|---|
| A. Cobalt Surprise | Cobalt #3D3BFF; Coral #FF6B5F; Butter #FFE8A3; Cream #FFF9F2; Ink #1B1830 | Ekspresif, jelas, dan fleksibel untuk berbagai hubungan. Rekomendasi identitas utama |
| B. Cherry Letter | Cherry #C52A49; Blush #FFD9E2; Cream #FFF7EF; Ink #291E29 | Intim dan hangat; cocok sebagai koleksi romantis |
| C. Fresh Orbit | Deep Green #185B45; Lime #D8F36A; Lilac #DFD0FF; Cream #FAF8EF; Ink #17231F | Playful dan berbeda; kandidat koleksi sahabat |

Pilihan ini adalah arah kreatif untuk diuji, bukan klaim warna yang sedang paling populer. Rute A direkomendasikan agar identitas utama tidak terlalu terikat pada romantisme atau satu gender. Palet tiap kado dapat berbeda selama kualitas dan penanda brand tetap konsisten.

## 5.3 Aturan rute A

- Gunakan cream sebagai ruang utama dan ink untuk teks panjang; cobalt mengarahkan tindakan utama.
- Coral dan butter memberi aksen kejutan pada ilustrasi, stiker, serta highlight; jangan menjadikan semua aksen warna tombol utama.
- Pilih satu keluarga sans yang mudah dibaca untuk UI; display yang lebih ekspresif hanya pada judul. Tulisan tangan dipakai sebagai aksen isi kado, bukan navigasi.
- Gunakan ikon dan ilustrasi dengan bentuk sederhana yang memiliki detail khas: lipatan pita, sudut kartu, atau kilau empat sisi. Konsep logo final dikerjakan setelah rute visual disepakati.
- Foto pelanggan tidak dipaksa mengikuti warna brand; crop dan layout harus menjaga wajah serta konteks foto.
- Target rasio kontras teks isi 4,5:1; pasangan warna final diperiksa sebelum UI disahkan. Warna bukan satu-satunya penanda status. [S11]

## 5.4 Bahasa komunikasi

Gunakan sapaan kamu dan dia secara natural, singkat, dan membantu. Pilih kalimat spesifik: kirim 8 foto favorit, pilih suasananya, lihat contoh kadonya. Hindari jargon desain pada alur pembeli serta janji seperti pasti bikin nangis, dijamin balikan, atau paling interaktif se-Indonesia.

Contoh pesan utama: **Cerita kamu, jadi kejutan mereka.** Penjelasan: **Kado website personal dengan animasi, foto, suara, dan kejutan yang bisa dibuka satu per satu. Kamu kirim ceritanya, kami bantu merangkainya.** Label CTA usulan: **Coba demo**, **Pilih kadonya**, **Tanya dulu**. Ini merupakan arah copy; pengujian pemahaman tetap diperlukan.

## 5.5 Sistem gerak brand

Gerakan khas berasal dari tindakan membuka: pita tertarik, kartu terangkat, surat terbuka, dan kenangan tersusun. Feedback UI ditargetkan 120-200 ms, transisi bab 250-450 ms, dan pembukaan khas 600-1.200 ms. Angka ini adalah spesifikasi kreatif awal. Tersedia tombol lewati pembukaan dan mode gerak ringan. Gerak tidak menghalangi tombol, membaca pesan, atau berpindah bab.

## 5.6 Menjaga desain tetap segar

Review referensi visual dilakukan dua minggu sekali; review performa koleksi dilakukan bulanan. Calon arah baru dinilai atas relevansi dengan hubungan/momen, kebaruan mekanik, kemudahan dibaca, biaya produksi, dan kelancaran di HP. Setiap arah diuji pada 5 calon pengguna sebelum masuk katalog. Rilis koleksi baru ditargetkan setiap 6-8 minggu setelah operasional stabil; frekuensi dikurangi bila kualitas atau kapasitas terganggu. Perubahan katalog tidak mengubah kado pelanggan yang sudah disetujui.

# 06. Koleksi produk dan pengalaman penerima

## 6.1 Tiga desain peluncuran

| Koleksi | Arah visual | Mekanik utama | Momen utama |
|---|---|---|---|
| Birthday Unwrapped | Pop editorial, bentuk kado, ilustrasi ekspresif | Buka pita, balik kartu foto, reveal pesan | Ulang tahun |
| Little Things | Scrapbook yang rapi, catatan tangan, potongan kenangan | Buka amplop, balik foto, buka catatan tersembunyi | Anniversary |
| After Hours | Komposisi sinematik, kontras lembut, foto dominan | Buka surat, jelajahi bab, reveal pesan | Anniversary atau ucapan personal |

Ini tiga keluarga layout yang benar-benar berbeda, dengan runtime modular yang sama. Semua tersedia pada paket Cerita dan Kejutan sesuai kapasitas paket. Pada Cerita, mekanik reveal tambahan dapat tampil sebagai tombol buka pesan; scratch khusus Kejutan dan Signature. Versi gerak ringan mempertahankan isi dan urutan cerita.

## 6.2 Alur dasar penerima

1. **Sampul aman:** nama panggilan pilihan dan tombol buka; tersedia pilihan suara. Pratinjau chat tidak membocorkan isi surat/foto pribadi.
2. **Pembukaan:** interaksi sederhana seperti menarik pita; tombol tap membuka hasil yang sama.
3. **Kenangan:** foto dan catatan pendek disusun dalam bab yang bisa dijelajahi ulang.
4. **Pesan utama:** surat personal dan audio opsional dengan transkrip; kontrol pemutaran selalu terlihat.
5. **Kejutan penutup:** pesan tersembunyi, ucapan akhir, atau janji sederhana yang memang ditulis pengirim.
6. **Replay:** penerima dapat kembali ke bab tertentu tanpa menyelesaikan semua interaksi lagi.

Target satu perjalanan utama 1-3 menit merupakan batas desain, bukan batas waktu membaca. Tidak ada hitungan mundur yang memaksa pengguna menutup cerita. Durasi aktual bergantung pada materi pelanggan.

## 6.3 Pedoman modul

| Modul | MVP | Batas dan fallback |
|---|---|---|
| Unboxing/amplop | P0 semua paket | Tap dan keyboard menggantikan drag |
| Foto dan catatan belakang | P0 semua paket | Tidak mengandalkan hover |
| Surat personal | P0 semua paket | Teks dapat dibaca utuh; animasi ketik bisa dilewati |
| Audio latar dan suara | P0 sesuai paket | Mulai lewat tindakan pengguna; tersedia tanpa suara |
| Scratch reveal | P0 Kejutan/Signature | Tombol buka langsung menghasilkan isi yang sama |
| Video | P0 Kejutan/Signature | Poster dan kontrol play; kegagalan tidak menutup bab lain |
| Countdown sebelum rilis | P0 sesuai brief | Kunci waktu diperiksa server; isi privat belum dikirim |
| Kuis personal | P1 | Bisa dilewati; salah jawaban tidak mengunci ucapan |
| Pesan teman bersama | P1 | Link kontribusi terpisah dan moderasi oleh pembeli |
| Simpan kenangan versi cetak | P1 | Ekspor statis; tidak dijanjikan sebagai salinan animasi |
| Dunia eksplorasi/3D khusus | P2 | Hanya setelah beban perangkat dan biaya terbukti layak |

# 07. Paket, pendapatan, dan ekonomi unit

## 7.1 Paket uji - seluruh angka adalah usulan

| Ketentuan | Cerita | Kejutan | Signature |
|---|---|---|---|
| Harga awal | Rp89.000 | Rp169.000 | Mulai Rp349.000 |
| Desain | Pilih tiga koleksi | Pilih tiga koleksi | Arah layout disesuaikan dari fondasi koleksi |
| Kapasitas foto | 8 | 16 | 24 |
| Jumlah bab maksimal | 3 | 5 | 7 |
| Mekanik | Opening + flip foto | Opening + flip + scratch | Tiga mekanik MVP dengan komposisi custom |
| Surat utama | 1, maksimal 600 kata | 1, maksimal 1.000 kata | Maksimal 2, total 1.500 kata |
| Rekaman suara | 1 x 60 detik | 2 x 90 detik | 3 x 90 detik |
| Video | Tidak termasuk | 1 x 60 detik | 1 x 120 detik |
| Audio latar | 1 pilihan berlisensi | 1 pilihan berlisensi | 1 pilihan berlisensi |
| Putaran revisi | 1 | 2 | 3 |
| Estimasi produksi | 2 hari kerja | 3 hari kerja | 5 hari kerja |
| Masa aktif | 12 bulan | 12 bulan | 12 bulan |

Semua paket mencakup link personal dengan token acak, privasi dasar, passphrase opsional, preview, QA, dan kontrol suara/gerak. Desain custom tidak berarti kode atau mekanik baru tanpa batas. Signature diberikan quotation tetap setelah brief; harga katalog merupakan harga mulai. Janji animasi dan interaksi berlaku pada setiap paket.

## 7.2 Ketentuan komersial

Jam layanan usulan Senin-Sabtu 09.00-17.00 WIB, di luar hari libur nasional. Satu hari kerja produksi didefinisikan sebagai satu hari operasional pada jam tersebut. Waktu produksi mulai setelah pembayaran terverifikasi, materi lengkap, dan brief disepakati. Antrean dan tanggal estimasi harus dikonfirmasi sebelum pembeli membayar. Respons layanan ditargetkan maksimal 8 jam operasional.

Cerita dan Kejutan dibayar penuh di awal. Signature memakai 50% uang muka setelah quotation disetujui dan 50% sebelum rilis. Semua perubahan di luar cakupan menghasilkan quotation tambahan yang harus disetujui sebelum dikerjakan. Tidak ada biaya tambahan otomatis.

Satu putaran revisi berarti satu daftar perubahan yang dikumpulkan pembeli, bukan satu pesan chat. Revisi mencakup teks, urutan foto, dan penyesuaian dalam desain yang dipilih. Mengganti keluarga desain setelah produksi berjalan adalah perubahan scope. Kesalahan operator atau kerusakan fungsi diperbaiki tanpa mengurangi kuota revisi. Permintaan preview dikumpulkan paling lambat 3 hari kalender setelah dikirim; tanpa jawaban, order ditahan dan tidak dianggap disetujui.

## 7.3 Pendapatan tambahan

Add-on usulan: tambahan 8 foto Rp25.000 dan satu putaran revisi Rp20.000, hanya jika layout serta jadwal mendukung. Pesanan cepat dikenai tambahan 50% setelah pengecekan kapasitas; durasi pasti tertulis dalam quotation. Perpanjangan 12 bulan Rp39.000 menjadi harga uji yang harus dievaluasi terhadap biaya penyimpanan dan support. Paket dasar tidak boleh kehilangan pengalaman utama agar upsell terasa diperlukan.

## 7.4 Simulasi kontribusi per order

Asumsi nilai waktu operator Rp30.000/jam. Waktu di bawah adalah total target pengerjaan, komunikasi, QA, dan revisi yang termasuk paket. Biaya langsung lain hanya alokasi variabel pembayaran/media/support; bukan tarif vendor yang sudah diverifikasi.

| Komponen | Cerita | Kejutan | Signature pada harga mulai |
|---|---|---|---|
| Pendapatan | Rp89.000 | Rp169.000 | Rp349.000 |
| Waktu target | 35 menit | 75 menit | 180 menit |
| Nilai tenaga | Rp17.500 | Rp37.500 | Rp90.000 |
| Biaya langsung lain | Rp8.000 | Rp12.000 | Rp20.000 |
| Kontribusi awal | Rp63.500 | Rp119.500 | Rp239.000 |
| Rasio kontribusi awal | 71,3% | 70,7% | 68,5% |

Kontribusi awal belum mengurangi akuisisi, pembuatan koleksi, biaya tetap, pajak, dan refund. Contoh Kejutan: biaya akuisisi Rp30.000 dan alokasi pembuatan koleksi Rp20.000/order menyisakan Rp69.500. Dengan biaya tetap ilustratif Rp500.000/bulan, dibutuhkan 8 order Kejutan untuk menutup biaya tetap tersebut. Ini simulasi keputusan, bukan proyeksi keuntungan. Beban revisi berlebih langsung mengubah hasil.

## 7.5 Kapasitas dan pembatalan

Dengan alokasi 15 jam per minggu dan cadangan operasional 30%, tersedia 630 menit produksi. Pada target 75 menit/order Kejutan, kapasitas awal sekitar 8 order/minggu. Penjualan harus dibatasi oleh menit kerja berbobot paket; delapan order Signature jelas membutuhkan kapasitas berbeda.

Usulan kebijakan: sebelum produksi, pembayaran dapat dikembalikan penuh; setelah produksi dimulai, penyelesaian mengikuti pekerjaan yang telah dikerjakan dan persetujuan yang terdokumentasi. Jika tim gagal memenuhi tanggal yang disepakati karena kendala internal, tawarkan jadwal baru atau refund atas bagian yang tidak terpenuhi. Ketentuan akhir harus ditampilkan sebelum pembayaran dan dikaji sebelum dipakai; rincian ini merupakan rancangan kebijakan layanan, bukan pendapat hukum.

# 08. Struktur website dan kebutuhan konten

## 8.1 Peta halaman

| Area | Halaman/rute usulan | Tujuan |
|---|---|---|
| Publik | / | Memahami produk, mencoba demo, memilih langkah berikutnya |
| Publik | /koleksi dan /koleksi/{slug} | Membandingkan desain, kapasitas, harga, dan preview |
| Publik | /demo/{slug} | Memainkan contoh penuh dengan data fiktif |
| Publik | /harga | Membandingkan paket dan syarat layanan |
| Publik | /cara-pesan | Memahami materi, proses, estimasi, dan revisi |
| Publik | /faq, /privasi, /ketentuan | Menjawab keberatan dan menjelaskan layanan |
| Pembeli | /pesan/{token} | Ringkasan order, upload materi, status, dan tindakan berikutnya |
| Pembeli | /preview/{token} | Meninjau versi dan memberi persetujuan eksplisit |
| Penerima | /k/{token-acak} | Membuka kado sesuai akses dan waktu rilis |
| Operator | /studio | Mengelola order, aset, paket, koleksi, serta publikasi |
| P1 | /ide-kado/{artikel} | Membantu pencarian berdasarkan momen dan kebutuhan |

Token pada rute contoh adalah identifier acak yang aman, bukan nama lengkap atau tanggal lahir. Slug singkat personal boleh menjadi alias jika tetap menggunakan kontrol akses yang sesuai. Pemisahan peran dan route wajib diuji, meskipun MVP dibangun dalam satu aplikasi.

## 8.2 Susunan halaman utama

| Bagian | Isi yang diperlukan | Tindakan utama |
|---|---|---|
| Hero | Nilai produk satu kalimat, contoh bergerak ringan, nama layanan jelas | Coba demo |
| Demo mini | Pengunjung membuka amplop/reveal dengan data contoh | Mainkan demo penuh |
| Pilih momen | Ulang tahun dan anniversary; kategori perluasan diberi status sesuai ketersediaan | Lihat koleksi relevan |
| Koleksi unggulan | Tiga desain, preview, momen, mekanik, dan harga mulai | Lihat detail |
| Kenapa personal | Contoh catatan, suara, dan detail kenangan | Lihat contoh hasil |
| Cara pesan | Pilih, kirim bahan, review, terima link | Mulai pesan |
| Paket | Harga, batas, revisi, waktu, serta masa aktif | Pilih paket |
| Bukti layanan | Hasil pelanggan berizin atau contoh fiktif berlabel | Lihat hasil |
| FAQ | Keamanan foto, lagu, waktu, revisi, masa aktif | Tanya dulu |
| Penutup | Ringkasan nilai dan CTA yang konsisten | Pilih kadonya |

Tombol pesan boleh tetap terlihat pada detail koleksi mobile, tetapi tidak menutup konten atau kontrol demo. Tidak memakai countdown diskon palsu, jumlah pengunjung rekaan, atau testimoni yang belum ada. Sebelum memiliki pelanggan, gunakan contoh produk dengan label demonstrasi.

## 8.3 Standar detail koleksi

Detail wajib memuat: hasil yang didapat, demo penuh, momen yang cocok, mekanik utama, konten yang dibutuhkan, kompatibilitas paket, harga mulai, perkiraan produksi, masa aktif, batas custom, dan CTA. Foto kartu, demo, serta hasil nyata harus berasal dari desain versi yang sama. Jika screenshot berisi fitur P1, tandai sebagai konsep dan jangan menawarkannya untuk order MVP.

## 8.4 Pemilihan desain

Filter awal cukup momen, penerima, dan suasana. Suasana memakai istilah yang mudah dipahami: ceria, manis, atau tenang. Penyortiran awal editorial; label paling populer baru digunakan setelah ada data yang cukup. Harga pada kartu berarti paket minimum yang benar-benar tersedia untuk desain tersebut.

## 8.5 Materi konten sebelum launch

Tiga demo lengkap dengan foto dan audio berlisensi; satu penjelasan proses; tiga detail paket; FAQ; ketentuan serta kebijakan privasi; panduan memilih foto; contoh brief yang baik; serta 6-9 video pendek produk untuk pemasaran. Materi pemasaran memakai contoh fiktif atau persetujuan publikasi terpisah dari pelanggan.

# 09. Alur pemesanan dan layanan

## 9.1 Alur pembeli

1. Pengunjung mencoba demo dan memilih koleksi serta paket.
2. Form singkat mengumpulkan nama panggilan pembeli, kontak, momen, tanggal dibutuhkan, serta pilihan desain. Sistem membuat order ID.
3. Ringkasan menampilkan harga, cakupan, antrean, tenggat materi, dan estimasi selesai. Pembeli bisa bertanya lewat WhatsApp dengan order ID yang sudah terisi.
4. Operator memastikan slot pengerjaan. Pembayaran hanya diminta setelah harga dan waktu dapat dipenuhi.
5. Pembeli membayar lewat kanal merchant yang disediakan. Operator memverifikasi penerimaan dana, bukan hanya gambar bukti transfer.
6. Pembeli menerima akses pengumpulan materi melalui halaman order. Foto, pesan, dan suara disimpan menurut order ID.
7. Operator menandai brief lengkap dan memulai produksi. Kekurangan materi ditampilkan sebagai checklist yang konkret.
8. Pembeli meninjau preview privat, mengirim daftar revisi, atau menyetujui versi tertentu.
9. Setelah persetujuan dan pembayaran penuh, operator memublikasikan atau menjadwalkan kado.
10. Pembeli menyalin link dan mengirimkannya sendiri kepada penerima. Sistem tidak otomatis mengirim pesan WhatsApp pada MVP.

Tombol WhatsApp membuka aplikasi pembeli dengan pesan awal; pembeli tetap menekan kirim. Materi besar tidak diminta dikirim ulang melalui chat jika sudah masuk ke halaman order.

## 9.2 Brief personalisasi

Form dibagi menjadi data dasar, cerita, media, dan pengaturan kejutan. Tiga pertanyaan cerita utama: apa yang sedang dirayakan, satu kenangan yang paling ingin dimasukkan, dan kalimat yang ingin disampaikan. Pertanyaan opsional: panggilan khas, inside joke, warna yang disukai, suasana, serta hal yang tidak boleh ditampilkan.

Pembeli dapat menyimpan draft dan kembali lagi. Validasi tidak mewajibkan cerita panjang; sistem memberi contoh isian dan batas konten sesuai paket. Nama lengkap, alamat rumah, tanggal lahir lengkap, atau informasi sensitif lain tidak diminta bila tidak diperlukan untuk kado.

## 9.3 Status order

| Status produksi | Pemicu masuk | Syarat keluar |
|---|---|---|
| Pertanyaan masuk | Form minat tersimpan | Scope dan slot diterima pembeli |
| Menunggu pembayaran | Ringkasan order telah disepakati | Pembayaran atau DP tervalidasi |
| Menunggu materi | Pembayaran cukup untuk memulai | Materi dan brief dinyatakan lengkap |
| Siap produksi | Semua prasyarat lengkap | Operator mulai pengerjaan |
| Dalam produksi | Versi kerja dibuat | QA internal lolos |
| Menunggu review | Preview versi tertentu dikirim | Ada persetujuan atau daftar revisi |
| Revisi | Perubahan dalam scope diterima | Versi baru lolos QA |
| Menunggu pelunasan | Versi disetujui tetapi saldo belum lunas | Penerimaan pelunasan terverifikasi |
| Siap rilis | Versi disetujui dan lunas | Publish langsung atau jadwal aktif |
| Terjadwal | Waktu rilis telah ditetapkan | Waktu tercapai dan prasyarat tetap valid |
| Aktif | Versi terbit tersedia untuk penerima | Masa aktif habis atau dicabut |
| Kedaluwarsa | Masa aktif berakhir | Diperpanjang atau penghapusan berjalan |
| Ditahan/dibatalkan | Masalah materi, kapasitas, atau permintaan pembeli | Penyelesaian terdokumentasi |

Status pembayaran terpisah: belum dibayar, menunggu verifikasi, DP terverifikasi, lunas, refund sebagian, refund penuh, atau kedaluwarsa. Satu status produksi tidak digunakan sebagai bukti pembayaran. Setiap perubahan penting menyimpan pelaku, waktu, dan alasan.

## 9.4 Aturan persetujuan dan rilis

Persetujuan memuat order ID, version ID, waktu, dan aktor pembeli. Teks persetujuan menjelaskan bahwa versi tersebut akan diterbitkan. Perubahan konten setelah disetujui membuat versi baru yang perlu disetujui lagi. Tidak ada persetujuan otomatis akibat pembeli diam. Jadwal tidak dapat melewati prasyarat lunas dan disetujui.

Tanggal rilis default menggunakan Asia/Jakarta, dengan zona waktu terlihat dan bisa dipilih jika penerima berada di zona lain. Sebelum rilis, server hanya mengirim sampul/countdown; konten privat serta URL media tidak dikirim ke browser. Penjadwalan mengatur kapan link bisa dibuka, bukan kapan pesan otomatis dikirim ke penerima.

## 9.5 Penanganan kondisi khusus

- **Materi terlambat:** estimasi berubah setelah operator memberi jadwal baru; jangan tetap menjanjikan tenggat awal.
- **Audio/video gagal:** bab lain tetap dapat dibaca, tersedia retry serta teks pendamping.
- **Pembayaran belum cocok:** tampilkan status menunggu verifikasi dan kontak bantuan; jangan meminta pembeli membayar ulang secara otomatis.
- **Salah materi setelah publish:** buat draft koreksi; versi aktif tetap tersedia sampai pengganti disetujui.
- **Penerima berganti perangkat:** passphrase dapat dipakai kembali; MVP tidak mengunci browser pertama.
- **Link tersebar:** pembeli dapat meminta pencabutan token dan penerbitan link baru.
- **Pesanan mepet:** tampilkan slot nyata; pesanan cepat hanya diterima setelah kapasitas dicek.

# 10. Kebutuhan fungsional dan acceptance criteria

## 10.1 Penjualan dan discovery

| ID | Prioritas | Kebutuhan | Kriteria penerimaan |
|---|---|---|---|
| FR-01 | P0 | Halaman utama menjelaskan layanan | Dalam uji pemahaman, 4 dari 5 peserta dapat menjelaskan produk dan langkah order tanpa dibantu |
| FR-02 | P0 | Katalog tiga koleksi | Filter dapat digabung/reset; keadaan tanpa hasil memberi jalan kembali |
| FR-03 | P0 | Detail koleksi dan harga konsisten | Paket, revisi, masa aktif, serta harga sama dengan ringkasan order |
| FR-04 | P0 | Demo interaktif publik | Tiga demo selesai dimainkan tanpa login dan tidak memakai data pelanggan |
| FR-05 | P0 | Form minat/order | Validasi kontak dan tanggal; submit ganda tidak membuat duplikat order yang sama |
| FR-06 | P0 | Hubungan ke WhatsApp | Tombol membawa order ID, paket, serta desain; tidak menyertakan token akses atau cerita pribadi di pesan awal |
| FR-07 | P0 | Slot dan estimasi | Order di luar kapasitas menampilkan tanggal tersedia atau status konsultasi, bukan janji instan |
| FR-08 | P1 | Konten panduan dan pencarian | Artikel membantu memilih momen dan mengarah ke demo yang relevan |

## 10.2 Order, materi, pembayaran, dan review

| ID | Prioritas | Kebutuhan | Kriteria penerimaan |
|---|---|---|---|
| FR-09 | P0 | Halaman order berakses privat | Pengguna tanpa token/sesi sah tidak dapat membaca kontak, status, maupun aset |
| FR-10 | P0 | Brief bertahap dan draft | Data tetap ada saat kembali; draft diberi waktu simpan terakhir dan tidak ditandai lengkap otomatis |
| FR-11 | P0 | Upload dengan batas paket | Tipe dan ukuran divalidasi server; progres, gagal, serta retry per file terlihat |
| FR-12 | P0 | Urutan dan catatan media | Pembeli dapat menentukan urutan; crop tidak mengubah file sumber secara destruktif |
| FR-13 | P0 | Ringkasan biaya | Total, DP/pelunasan, add-on, jadwal, dan ketentuan tersimpan sebagai snapshot order |
| FR-14 | P0 | Pembayaran manual | Operator mencocokkan transaksi diterima; perubahan status tercatat dan memerlukan referensi transaksi unik |
| FR-15 | P0 | Preview berversi | Preview tidak terindeks; version ID yang ditinjau dan watermark preview terlihat |
| FR-16 | P0 | Revisi terstruktur | Permintaan terikat versi; kuota hanya berkurang setelah operator menerima satu daftar perubahan |
| FR-17 | P0 | Persetujuan eksplisit | Persetujuan versi A tidak dapat menerbitkan versi B tanpa review ulang |
| FR-18 | P0 | Status dan tindakan berikutnya | Setiap status menunjukkan apa yang ditunggu dan siapa yang perlu bertindak |
| FR-19 | P1 | Pembayaran otomatis | Notifikasi tervalidasi, idempotent, dan direkonsiliasi; notifikasi ganda tidak membuat pembayaran ganda |
| FR-20 | P1 | Multi-kontributor | Kontributor hanya melihat area kirim miliknya; pembeli menyetujui kontribusi sebelum dipakai |

## 10.3 Runtime kado penerima

| ID | Prioritas | Kebutuhan | Kriteria penerimaan |
|---|---|---|---|
| FR-21 | P0 | Akses tanpa akun penerima | Link membuka sampul; passphrase hanya diminta jika diaktifkan pembeli |
| FR-22 | P0 | Opening dan feedback | Drag, tap, serta keyboard mencapai hasil yang sama; ada tombol lewati |
| FR-23 | P0 | Bab foto dan surat | Seluruh isi dapat dibaca pada layar 360 px tanpa scroll horizontal |
| FR-24 | P0 | Flip dan reveal | Instruksi terlihat; tidak bergantung pada hover; state dapat dipulihkan saat kembali |
| FR-25 | P0 | Scratch sesuai paket | Ada alternatif buka langsung; canvas gagal tidak mengunci konten |
| FR-26 | P0 | Audio terkontrol | Tidak mengasumsikan autoplay; tombol sesuai status play aktual; musik melemah/berhenti saat suara personal diputar |
| FR-27 | P0 | Video dan transkrip | Video memiliki poster dan kontrol; suara personal disertai teks; media gagal memberi retry |
| FR-28 | P0 | Rilis terjadwal | Mengubah jam perangkat tidak membuka isi lebih cepat; konten privat ditahan server |
| FR-29 | P0 | Replay dan navigasi | Penerima dapat kembali ke bab; reload tidak memaksa mengulang semua interaksi |
| FR-30 | P0 | Mode gerak ringan | Mengikuti preferensi OS dan kontrol halaman; seluruh konten tetap tersedia |
| FR-31 | P0 | Kondisi kedaluwarsa dan pencabutan | Halaman generik tampil tanpa membocorkan isi; token lama gagal setelah dicabut |
| FR-32 | P1 | Kuis personal | Jawaban salah tetap menyediakan lanjut; isi utama tidak menjadi hadiah yang terkunci permanen |

## 10.4 Operasional dan admin

| ID | Prioritas | Kebutuhan | Kriteria penerimaan |
|---|---|---|---|
| FR-33 | P0 | Panel operator terautentikasi | Login diwajibkan; akses publik ke rute admin ditolak; sesi dapat dicabut |
| FR-34 | P0 | Daftar dan detail order | Filter tenggat, status, paket, serta materi kurang; kontak dan versi terlihat dalam order yang tepat |
| FR-35 | P0 | Perakitan dari modul | Operator memilih modul dan mengisi konten; tidak perlu mengubah kode untuk order standar |
| FR-36 | P0 | Kontrol publish | Server menolak jika belum lunas, belum disetujui, atau ada media wajib gagal proses |
| FR-37 | P0 | Rollback versi | Versi stabil dapat dipulihkan; riwayat serta persetujuan tidak ditimpa |
| FR-38 | P0 | Pengelolaan koleksi | Harga, kapasitas, dan versi desain diperbarui tanpa mengubah order lama |
| FR-39 | P0 | Retensi dan permintaan hapus | Operator dapat mencabut akses dan memulai penghapusan; tindakan serta hasil tercatat |
| FR-40 | P0 | Pencatatan operasional | Waktu kerja, revisi, kendala, dan keterlambatan tercatat untuk evaluasi margin |
| FR-41 | P1 | Reminder dan perpanjangan | Reminder hanya pada kanal yang disetujui; tidak otomatis menagih atau memperpanjang |
| FR-42 | P2 | Builder pelanggan | Dikerjakan sebagai inisiatif tersendiri setelah kebutuhan dan ekonomi unit terbukti |

## 10.5 Dependensi utama

FR-13 dan FR-14 menjadi prasyarat kontrol pembayaran; FR-15 dan FR-17 menjadi prasyarat publish; FR-11 dan pemrosesan media menjadi prasyarat preview final; FR-36 dan FR-28 harus berbagi aturan kelayakan rilis. Setiap halaman penerima wajib menggunakan aturan akses yang sama untuk teks, media, dan API. Akses file langsung tidak boleh menjadi celah di luar kontrol halaman.

# 11. Data, arsitektur, dan pengelolaan versi

## 11.1 Pendekatan teknis

Gunakan satu aplikasi web dengan area pemasaran, portal pembeli, runtime penerima, dan panel operator. API/server menangani akses, order, pembayaran, publikasi, serta penjadwalan. Database relasional menyimpan metadata dan status. Object storage privat menyimpan materi; pekerjaan latar memproses media, pembersihan, dan jadwal. Konten per kado berupa konfigurasi terstruktur yang mengacu pada template serta modul berversi.

Pilihan framework dan penyedia hosting/database belum menjadi keputusan PRD. Tim dapat memilih stack yang paling dikuasai selama memenuhi kontrol akses, media, biaya, dan QA di dokumen ini. Proses pemrosesan video harus memakai lingkungan yang sesuai, tanpa menganggap runtime request ringan mampu mengerjakan transcoding besar.

## 11.2 Entitas minimum

| Entitas | Data utama | Hubungan dan aturan |
|---|---|---|
| Customer | ID, nama panggilan, kontak, preferensi komunikasi | Dapat memiliki beberapa order; kontak tidak masuk analitik publik |
| Order | ID, customer, paket snapshot, harga, status, tenggat | Sumber kebenaran biaya dan scope saat pesanan dibuat |
| Payment | Order ID, jumlah, status, referensi transaksi, verifier | Transaksi unik; riwayat refund tidak menghapus catatan pembayaran |
| Brief | Momen, hubungan, cerita, batasan, kelengkapan | Perubahan setelah produksi memerlukan pencatatan scope |
| MediaAsset | Owner/order, tipe, sumber, hasil olah, status, ukuran | Akses privat; materi tidak bisa dipakai order lain tanpa izin |
| TemplateVersion | Keluarga desain, versi, modul, status | Versi terbit tidak ditimpa; katalog bisa menunjuk versi baru |
| GiftVersion | Order, template version, konten, hasil QA | Immutable setelah persetujuan; koreksi membuat versi baru |
| Approval | Order, gift version, pembeli, waktu, bukti aksi | Berlaku hanya untuk versi yang disebut |
| Revision | Order, versi asal, daftar perubahan, status, kuota | Koreksi operator dipisahkan dari revisi pelanggan |
| Publication | Versi aktif, jadwal, zona waktu, aktif sampai | Hanya versi layak terbit; masa aktif dari publikasi pertama |
| AccessGrant | Peran, token hash, masa akses, pencabutan | Token pembeli, preview, dan penerima terpisah |
| AuditEvent | Pelaku, tindakan, target, waktu, alasan | Tidak mencatat isi surat atau token mentah |

## 11.3 Siklus versi

Konten dan desain disimpan terpisah. Order baru memakai template terkini; order lama tetap menunjuk versi yang telah disetujui. Preview, persetujuan, dan publication selalu mengacu pada satu GiftVersion. Rollback mengganti penunjuk versi aktif, bukan menghapus sejarah. Perbaikan keamanan dapat diterapkan dengan pemeriksaan kompatibilitas tanpa mengubah cerita pelanggan.

## 11.4 API konseptual

Kapabilitas yang diperlukan: membuat order secara idempotent; menyimpan brief; meminta akses upload; menyelesaikan serta memvalidasi upload; membuat preview; mencatat revisi dan approval; memverifikasi pembayaran oleh operator; menjadwalkan/publish; mencabut token; serta menjalankan penghapusan. Ini kontrak perilaku, bukan penetapan nama endpoint atau bahasa pemrograman.

Setiap operasi harus memeriksa peran dan kepemilikan order di server. Mengubah order ID, asset ID, atau version ID dalam request tidak boleh membuka data order lain. Secret admin, kredensial storage, dan kunci pembayaran tidak berada pada bundle browser.

## 11.5 Pemrosesan media

Usulan batas file sumber: foto JPG/PNG/WebP/HEIC maksimal 15 MB; audio MP3/M4A/WAV maksimal 30 MB; video MP4/MOV maksimal 150 MB. Sistem memeriksa isi file, ukuran, dan durasi di server. HEIC/MOV/WAV baru dicantumkan sebagai didukung setelah pipeline konversinya lulus uji; jika pipeline belum siap, UI membatasi format dan memberi bantuan konversi.

Foto dibuat dalam ukuran responsif dan metadata lokasi dihapus dari hasil publik. Sumber tetap privat selama retensi kerja. Audio serta video diturunkan ke profil playback yang terbukti pada perangkat QA. Upload tidak pernah langsung dianggap siap diputar. Status per file: diunggah, diperiksa, diproses, siap, atau gagal. Hasil gagal mempunyai alasan dan tindakan retry/ganti file.

## 11.6 Backup dan pemulihan

Usulan target pemulihan: kehilangan data maksimal 24 jam dan pemulihan layanan maksimal 8 jam untuk insiden besar. Jadwalkan backup harian, uji restore ke lingkungan terpisah sebelum launch, dan uji kembali setiap tiga bulan. Backup mengikuti jendela retensi yang ditetapkan; permintaan hapus segera mencabut akses aktif, sedangkan salinan backup kedaluwarsa mengikuti siklus retensi dan tidak dikembalikan ke produksi tanpa penerapan kembali daftar penghapusan.

# 12. Kualitas pengalaman, performa, dan akses

## 12.1 Target performa

| Area | Target usulan | Cara verifikasi |
|---|---|---|
| Core Web Vitals | LCP <=2,5 detik; INP <=200 ms; CLS <=0,1 pada p75 | Data lapangan dipisah mobile/desktop setelah volume cukup [S08] |
| Uji sebelum launch | Sampul dan tombol utama siap <=3 detik pada profil uji | Jaringan 4 Mbps, RTT 150 ms, perangkat Android 4 GB atau ekuivalen |
| Beban awal | Maksimal 1,5 MB kompresi sebelum interaksi pertama | Tidak memuat semua foto, audio, dan video di awal |
| Animasi | Target 60 fps; tidak ada macet >200 ms pada alur utama | Observasi dan profil runtime pada perangkat QA |
| Ketahanan | Media gagal tidak menggagalkan keseluruhan kado | Simulasi putus jaringan dan file hilang |
| Ketersediaan | SLO internal 99,5% per bulan | Monitor layanan dan pencatatan insiden; bukan jaminan kontraktual awal |

Ambang Core Web Vitals mengikuti dokumentasi Google; spesifikasi beban, perangkat, animasi, dan SLO adalah target internal Kado Digital. Uji lab tidak dinyatakan sebagai kelulusan INP lapangan. p75 baru dilaporkan jika sampel cukup; volume rendah diberi label data awal. [S08]

## 12.2 Aturan animasi dan suara

Prioritaskan transform dan opacity, hentikan animasi di luar layar, dan batasi partikel. Jangan memuat engine 3D besar untuk efek yang dapat dibuat lebih ringan. Interaksi menghasilkan feedback langsung sebelum media berat selesai dimuat.

Browser dapat membatasi autoplay bersuara; runtime memulai audio melalui tindakan pengguna, menangani kegagalan play, dan menampilkan status aktual. [S09] Pengguna bisa menikmati semua isi utama tanpa suara. Audio latar tidak menutupi rekaman suara. Sediakan teks/transkrip untuk pesan audio dan caption untuk video yang mengandung pesan penting.

## 12.3 Aksesibilitas

Target produk adalah praktik WCAG 2.2 AA yang relevan, dengan audit terpisah sebelum klaim kepatuhan. [S12] Navigasi dapat digunakan lewat keyboard, fokus terlihat, tombol mempunyai nama yang jelas, kontrol tidak hanya bergantung pada warna, dan ukuran target sentuh internal minimal 44 x 44 px bila memungkinkan. Urutan baca harus mengikuti cerita meskipun animasi dinonaktifkan.

Mode gerak ringan mengikuti preferensi perangkat dan kontrol halaman. Kemampuan menonaktifkan gerak non-esensial juga mengacu pada SC 2.3.3 yang berada pada level AAA; kebijakan ini dipilih sebagai standar produk tambahan dan tidak disamakan dengan persyaratan AA. [S10] Scratch, drag, dan halaman flip mempunyai alternatif sederhana yang menampilkan isi setara.

## 12.4 Privasi berdasarkan desain

- Semua kado memiliki token acak, noindex, dan tidak masuk sitemap. Hal ini mengurangi penemuan, tetapi tidak menjadikan link mustahil diteruskan.
- Passphrase opsional tersedia di semua paket. Nilainya disimpan sebagai hash; percobaan dibatasi. Tanpa passphrase, orang yang memegang link dapat membuka sesuai jadwal.
- Media dan teks hanya diberikan setelah pemeriksaan akses; URL aset tidak dibuka sebagai bucket publik. URL bertanda tangan bila dipakai mempunyai masa hidup terbatas.
- Gunakan kebijakan referrer yang membatasi kebocoran, hindari tracker pihak ketiga pada portal privat, dan bersihkan token serta teks pribadi dari log error.
- Sebelum rilis, countdown tidak disertai konten privat tersembunyi di HTML/JSON. Keamanan tidak mengandalkan tombol yang disembunyikan.
- Sampul chat default generik. Pembeli boleh memilih nama panggilan; foto pribadi atau isi surat tidak masuk preview sosial tanpa pilihan eksplisit.
- Izin pengerjaan dan izin publikasi portofolio merupakan pilihan berbeda; izin portofolio default tidak aktif.

Sistem tidak menjanjikan mencegah screenshot atau memastikan siapa yang benar-benar membuka link. Perekaman kamera, mikrofon, lokasi, dan reaksi penerima tidak termasuk MVP. Audio serta aset visual disediakan dari koleksi yang hak penggunaannya telah diperiksa; unggahan pelanggan memerlukan konfirmasi hak penggunaan dan review bila diragukan.

## 12.5 Retensi usulan

Materi sumber kerja disimpan sampai 30 hari setelah publikasi; hasil media terolah dan versi aktif tersedia sepanjang masa aktif 12 bulan. Pada masa aktif berakhir, halaman tidak lagi membuka cerita. Pelanggan diberi waktu 30 hari untuk memperpanjang sebelum media turunan dan konten dibersihkan. Preview yang tidak menjadi pesanan dibersihkan 30 hari setelah order dibatalkan. Backup bergulir maksimal 30 hari setelah penghapusan aktif. Metadata transaksi minimum mengikuti kebijakan administrasi yang disahkan sebelum launch dan disimpan terpisah dari isi kado.

Permintaan penghapusan sebelum masa aktif selesai dapat mencabut link segera setelah verifikasi pemilik. Penghapusan aktif ditargetkan maksimal 7 hari kalender, lalu backup kedaluwarsa dalam siklusnya. Perpanjangan dimulai setelah akhir masa aktif sebelumnya bila dilakukan dalam masa tenggang. Pengingat dikirim manual ke kanal pembeli yang disetujui; tidak ada debit berulang otomatis.

# 13. Pengukuran dan validasi produk

## 13.1 Metrik utama

**Metrik utama bisnis:** jumlah order berbayar yang diterbitkan tepat waktu dan lolos persetujuan pembeli per bulan. Suatu order dihitung sekali setelah lunas, versi disetujui, dan rilis sesuai tenggat terakhir yang disepakati sebelum produksi. Perubahan tenggat akibat tim harus tetap dicatat sebagai keterlambatan internal, bukan dipindahkan agar tampak tepat waktu.

**Penjaga kualitas:** kepuasan pembeli, keluhan fungsi penerima, waktu produksi, dan margin kontribusi. Completion penerima membantu menilai desain bila pengukuran diizinkan, tetapi tidak menggantikan mutu layanan atau penilaian pembeli.

## 13.2 Funnel dan definisi

| Metrik | Definisi | Target uji awal |
|---|---|---|
| Demo dimulai | Sesi publik unik yang melakukan interaksi pertama pada demo | Baseline 2 minggu, lalu evaluasi per sumber kunjungan |
| Demo selesai | Sesi demo yang mencapai bab penutup / sesi demo dimulai | >=60% setelah sekurangnya 50 sesi; hipotesis |
| Minat menjadi order lunas | Order yang lunas / pertanyaan berkualitas dengan scope dan tanggal yang sesuai | >=20% dari 30 pertanyaan pertama; hipotesis |
| Materi selesai | Order dibayar dengan brief lengkap dalam 48 jam kalender / order dibayar | >=70% pada pilot |
| Ketepatan waktu | Order terbit tepat waktu / order yang sudah jatuh tempo | >=90% pada 20 order pertama |
| Lolos review awal | Order disetujui tanpa revisi pelanggan / preview pertama yang direview | >=60%; koreksi operator tetap dicatat |
| Kepuasan pembeli | Rata-rata rating 1-5 setelah rilis | >=4,5 dengan minimal 15 jawaban; jumlah jawaban ditampilkan |
| Margin kontribusi awal | Pendapatan dikurangi nilai tenaga dan biaya variabel / pendapatan | >=60% sebelum akuisisi dan biaya tetap |
| Waktu produksi Kejutan | Median menit total operator per order | <=75 menit setelah 10 order Kejutan |
| Error penghalang | Laporan kegagalan yang menghalangi akses/isi utama | Nol yang belum terselesaikan sebelum perluasan promosi |

Target di atas merupakan hipotesis pengelolaan, bukan benchmark industri. Sampel kecil diperlakukan sebagai sinyal awal. Evaluasi mencatat sumber kunjungan, paket, koleksi, dan alasan batal agar keputusan tidak bergantung pada satu angka agregat.

## 13.3 Event minimum

Area publik: view_collection, start_demo, complete_demo, select_package, submit_inquiry, dan click_whatsapp. Area operasional: payment_verified, brief_complete, preview_ready, revision_requested, version_approved, gift_published, dan refund_recorded. Catat timestamp, campaign ID bila tersedia, koleksi, paket, dan identifier internal pseudonim; jangan merekam nama penerima, isi pesan, URL token, media, atau nomor kontak ke layanan analitik.

Pembukaan dan progres kado hanya diukur secara minimal jika kebijakan serta persetujuan mendukungnya; gunakan event seperti gift_started dan gift_completed tanpa identitas penerima atau sidik perangkat. Pemindaian preview oleh aplikasi chat tidak dihitung sebagai penerima membuka kado. Jangan mengklaim mengetahui siapa yang membuka atau membaca pesan.

## 13.4 Rencana riset awal

Wawancarai 8-12 calon pembeli dengan kombinasi ulang tahun, anniversary, dan kebutuhan sahabat. Tanyakan pengalaman membeli hadiah, tenggat, kesulitan menyiapkan bahan, budget nyata sebelumnya, serta kekhawatiran privasi. Minta mereka mencoba demo dan menjelaskan pemahamannya. Hindari pertanyaan yang hanya mengundang jawaban setuju seperti apakah desain ini bagus.

Lakukan uji tugas pada 5 pembeli untuk memilih desain dan mengirim materi, serta 5 penerima untuk membuka kado tanpa pengarahan. Ukur titik bingung, waktu menemukan tindakan pertama, dan mekanik yang dilewati. Setelah itu jalankan pilot berbayar terbatas 20 order dengan kapasitas yang diumumkan. Pembeli pilot mendapat informasi bahwa layanan sedang dalam tahap awal dan tetap memperoleh standar pengerjaan yang sama.

## 13.5 Eksperimen yang diprioritaskan

| Hipotesis | Uji | Keputusan yang berubah |
|---|---|---|
| Demo memperjelas nilai | Uji pemahaman hero dengan demo vs poster pada wawancara, lalu data publik | Posisi demo dan kebutuhan aset pemasaran |
| Pengarahan cerita layak dibayar | Bandingkan respons terhadap contoh generik dan contoh dengan detail kenangan | Kedalaman brief dan bantuan editorial |
| Tiga paket mudah dipahami | Minta peserta memilih sambil menjelaskan alasannya | Nama, batas, dan susunan paket |
| Harga Kejutan diterima | Tawarkan harga uji pada calon pembeli yang relevan; catat pembelian dan alasan batal | Harga, kapasitas, atau scope |
| Interaksi tertentu menambah nilai | Amati tiga demo dengan mekanik berbeda | Modul yang dipertahankan atau disederhanakan |

Jangan menyimpulkan sebab-akibat dari perbedaan conversion kecil tanpa volume yang memadai. Pada tahap awal, gunakan kombinasi perilaku nyata, alasan pelanggan, dan biaya produksi.

# 14. Strategi peluncuran dan akuisisi

## 14.1 Kanal awal

Mulai dari video pendek yang memperlihatkan produk dibuka, hasil demo yang bisa langsung dicoba, serta rekomendasi pelanggan yang berizin. TikTok, Instagram, dan WhatsApp menjadi kanal uji berdasarkan kecocokan format dan alur layanan; efektivitas kanal belum diasumsikan terbukti.

Setiap konten membawa satu konteks: ulang tahun pasangan, anniversary, atau ucapan untuk sahabat. Tampilkan satu interaksi dan detail personal yang menarik, lalu arahkan ke demo yang sama dengan konten tersebut. Hindari mengirim traffic ke katalog yang tidak sesuai contoh iklan.

## 14.2 Pesan dan bukti

Pesan utama menekankan cerita personal, kemudahan dibantu tim, serta hasil yang dapat dicoba. Bukti pemasaran berupa demo, proses singkat, detail karya, dan hasil berizin. Tidak menggunakan percakapan, foto, atau rekaman suara pelanggan sebagai konten secara otomatis. Testimoni ditampilkan apa adanya setelah mendapat izin dan tidak diberi metrik keberhasilan yang dibuat-buat.

## 14.3 SEO dasar

Halaman publik mempunyai judul, deskripsi, struktur heading, teks yang dapat dirayapi, dan gambar contoh dengan informasi yang tepat. Topik awal: kado digital ulang tahun, kado anniversary personal, ucapan untuk pasangan, dan kado sahabat. Ini kelompok intent yang diusulkan; volume pencarian dan tingkat persaingan belum diukur. Jangan mengklaim jaminan peringkat atau menduplikasi puluhan halaman momen tanpa konten berbeda.

Sitemap hanya memuat area publik. Halaman order, preview, dan kado privat memakai noindex serta kontrol akses yang sesuai. Rich metadata sosial untuk kado memakai sampul aman dan tidak boleh memasukkan isi privat.

## 14.4 Loop pembelian ulang

Setelah pesanan selesai, tawarkan penyimpanan tanggal momen berikutnya secara opsional. Pengingat hanya dikirim jika diminta melalui kanal yang disetujui. Program rekomendasi dapat diuji setelah layanan stabil dengan nilai manfaat dan syarat yang jelas. Jangan menambahkan CTA promosi mencolok di tengah surat pribadi penerima.

# 15. Roadmap, beban kerja, dan tanggung jawab

## 15.1 Rilis bertahap

| Tahap | Hasil | Gate sebelum lanjut |
|---|---|---|
| A. Validasi konsep | Wawancara, pilihan arah visual, demo alur pertama, batas harga | Produk dipahami; kebutuhan bantuan dan biaya dapat dijelaskan |
| B. Fondasi MVP | Model order, akses, upload, pembayaran manual, panel operator | Satu order contoh berjalan dari minat hingga preview |
| C. Pengalaman produk | Tiga koleksi, runtime, suara, video, mode gerak ringan | Semua demo dan fallback berfungsi pada perangkat QA |
| D. Layanan lengkap | Revisi, approval versi, penjadwalan, kedaluwarsa, penghapusan | Alur end-to-end dan kontrol akses lulus |
| E. Pilot berbayar | 20 order dengan pencatatan waktu, keluhan, serta margin | Kualitas dan kapasitas memenuhi target; masalah kritis selesai |
| F. Perluasan | Kuis, kontribusi teman, pembayaran otomatis, koleksi baru | Prioritas dipilih berdasarkan bukti pilot |

Tahap A-D diperkirakan membutuhkan 180-300 jam-orang untuk produk dan tiga koleksi, bergantung pada kemampuan tim serta komponen yang sudah tersedia. Dengan 15 jam/minggu, rentang kalender sekitar 12-20 minggu. Dengan kapasitas gabungan 30 jam/minggu, sekitar 6-10 minggu, di luar hambatan dan waktu respons riset. Ini estimasi perencanaan awal, bukan komitmen deadline. Estimasi diperbarui setelah prototype dan spike media bila diperlukan.

## 15.2 Urutan implementasi

Bangun satu alur vertikal Birthday Unwrapped sampai publish sebelum menggandakan koleksi. Setelah aturan order, akses, media, dan versi stabil, tambahkan dua keluarga desain. Penjadwalan, retensi, serta fallback harus selesai sebelum menerima pesanan yang mengandalkannya. Website penjualan dan copy paket diperiksa ulang setelah runtime final agar tidak menawarkan kemampuan yang belum tersedia.

## 15.3 Pembagian tanggung jawab

| Peran | Tanggung jawab |
|---|---|
| Founder/product owner | Keputusan harga, kapasitas, kebijakan, prioritas, dan penerimaan rilis |
| Product/brand designer | Sistem brand, koleksi, aksesibilitas desain, dan konsistensi pengalaman |
| Developer | Akses, data, media, runtime, versi, observabilitas, serta pemulihan |
| Operator/editor | Pemeriksaan brief, pengarahan cerita, produksi, QA order, dan komunikasi |
| Reviewer QA | Pengujian perangkat, status, isolasi order, serta approval/publish |

Satu orang boleh menjalankan beberapa peran. Untuk pembayaran dan publish, gunakan checklist terpisah agar pergantian konteks tidak membuat materi atau status tertukar. Catat keputusan agar pekerjaan tidak bergantung pada ingatan founder.

## 15.4 Prioritas setelah pilot

Otomatisasi pembayaran diprioritaskan bila verifikasi manual mulai menghambat. Kuis diprioritaskan bila demo menunjukkan minat serta penyelesaian yang baik. Kontribusi teman diprioritaskan bila permintaan kado kelompok muncul berulang. Builder mandiri hanya masuk evaluasi ketika pelanggan ingin mengedit sendiri, waktu operator menjadi hambatan utama, dan unit ekonomi mendukung biaya pembangunan editor.

# 16. Kriteria peluncuran dan skenario uji

## 16.1 Definition of ready

Sebelum development utama: arah visual pertama ditetapkan; alur satu kado disetujui sebagai contoh; batas paket dan kebijakan operasional dipilih; format media yang benar-benar didukung ditentukan; serta kapasitas developer/operator dialokasikan. PRD ini menjadi dasar pembahasan, bukan persetujuan otomatis atas seluruh usulan.

## 16.2 Definition of done MVP

Tiga koleksi dapat dipesan dan diproduksi; seluruh FR P0 terverifikasi; order, pembayaran, revisi, dan versi dapat ditelusuri; halaman kado dapat dibuka tanpa akun penerima; fallback animasi/audio/media berjalan; harga serta janji pemasaran konsisten; restore backup pernah diuji; domain dan HTTPS siap; serta operator mempunyai panduan pengerjaan satu order.

Tidak ada bug penghalang akses, kebocoran lintas order, rilis tanpa persetujuan/lunas, atau konten privat terbuka sebelum jadwal. Temuan kosmetik kecil boleh dicatat untuk perbaikan jika tidak merusak pengalaman atau janji layanan.

## 16.3 Matriks uji minimum

| Kelompok | Skenario | Hasil yang harus terjadi |
|---|---|---|
| Pembelian | Submit form dua kali karena koneksi lambat | Satu order; pengguna melihat status yang benar |
| Pembayaran | Bukti transfer ada tetapi transaksi belum masuk | Tetap menunggu verifikasi; tidak masuk produksi |
| Paket | Cerita mencoba mengunggah foto ke-9 | Ditolak dengan batas jelas atau pilihan add-on yang sah |
| Media | HEIC/MOV atau file rusak diunggah | Diproses jika didukung; selain itu ditolak dengan bantuan jelas |
| Review | Versi A disetujui, operator membuat B | B tidak terbit tanpa persetujuan baru |
| Jadwal | Jam perangkat dimajukan sebelum rilis | Isi privat tetap tidak tersedia |
| Akses | Token/asset ID order lain digunakan | Request ditolak; tidak ada metadata yang bocor |
| Pencabutan | Link dicabut lalu dibuka ulang | Halaman generik; sesi dan akses media terkait berakhir sesuai kebijakan |
| Interaksi | Scratch tidak tersedia atau pengguna memakai keyboard | Pesan tetap dapat dibuka melalui alternatif |
| Suara | Browser menolak play | Tombol play yang jujur tersedia; cerita tetap berjalan |
| Perangkat | Android kelas menengah, iPhone/Safari, desktop, dan browser dalam aplikasi chat | Alur selesai; jika perlu browser luar, instruksinya jelas |
| Aksesibilitas | Gerak ringan, zoom 200%, keyboard, pembaca layar dasar | Urutan baca dan tindakan utama dapat diakses |
| Kedaluwarsa | Masa aktif berakhir atau perpanjangan dilakukan | Status serta tanggal sesuai aturan; tidak ada tagihan otomatis |
| Operasional | Rollback dan restore backup dijalankan | Versi yang benar pulih; akses yang sudah dicabut tetap dicabut |

Versi browser target dicatat saat pengujian dan mencakup versi stabil saat itu serta satu versi sebelumnya bila tersedia untuk diuji. Satu uji awal memakai jaringan yang dibatasi sesuai profil performa. Catatan QA mencantumkan perangkat, browser, langkah, hasil, dan bukti tanpa menyimpan data pelanggan ke portofolio.

## 16.4 Checklist satu order sebelum dikirim

Periksa panggilan dan ejaan; foto serta urutannya; batas cerita dan layout; volume serta transkrip; interaksi dan fallback; tanggal serta zona waktu; versi persetujuan; pembayaran; masa aktif; akses; preview chat aman; dan link final. Operator membuka link sebagai penerima pada sesi terpisah sebelum menyerahkannya kepada pembeli.

# 17. Risiko, keputusan pemilik, dan pengendalian scope

## 17.1 Risiko utama

| Risiko | Sinyal awal | Respons yang direncanakan |
|---|---|---|
| Kado terlihat generik | Pelanggan meminta custom besar agar terasa personal | Perbaiki brief dan modul detail personal |
| Animasi memperlambat HP | Demo ditinggalkan saat loading atau perangkat panas | Kurangi beban awal, efek, dan media serentak |
| Revisi menghabiskan margin | Waktu aktual jauh di atas paket | Perjelas scope, contoh brief, dan definisi putaran revisi |
| Janji desain fresh sulit dipenuhi | Koleksi baru menumpuk tanpa QA | Kurangi frekuensi; prioritaskan rilis berkualitas |
| Materi pribadi terbuka | Akses media tidak mengikuti izin halaman | Tahan rilis; perbaiki kontrol server dan cabut akses |
| Janji masa aktif membebani bisnis | Biaya akumulatif melebihi kontribusi | Gunakan periode jelas dan evaluasi harga perpanjangan |
| Ketergantungan founder | Antrean tidak bergerak saat founder absen | SOP, konfigurasi modular, dan backup operator |
| Pembayaran harga rendah tidak menutup tenaga | Kontribusi turun setelah revisi/support | Naikkan harga atau sederhanakan scope berbasis data |

## 17.2 Keputusan yang perlu ditetapkan sebelum launch

| Keputusan | Default dalam PRD | Penentu akhir |
|---|---|---|
| Rute brand | Cobalt Surprise | Founder setelah uji visual |
| Paket dan harga | Rp89.000 / Rp169.000 / mulai Rp349.000 | Founder setelah simulasi dan penawaran pilot |
| Jam serta kapasitas | Senin-Sabtu, 09.00-17.00 WIB; 8 order Kejutan/minggu ekuivalen | Founder/operator |
| Cakupan custom | Signature dari fondasi modul; mekanik baru diquotation | Founder/designer |
| Pembayaran | Manual melalui merchant resmi; Signature DP 50% | Founder |
| Masa aktif/perpanjangan | 12 bulan; perpanjangan uji Rp39.000/12 bulan | Founder setelah biaya operasional diketahui |
| Retensi | Sumber 30 hari; konten aktif 12 bulan; masa tenggang 30 hari | Founder/developer sebelum kebijakan dipublikasikan |
| Stack dan anggaran | Satu aplikasi modular; vendor belum ditetapkan | Developer dan founder |

Default di atas membuat spesifikasi bisa ditinjau secara konkret. Bagian yang belum disahkan tidak boleh ditulis sebagai janji final di website publik. Perubahan harus dicatat pada riwayat revisi dokumen dan diperiksa dampaknya pada copy, formulir, data, QA, serta perhitungan biaya.

## 17.3 Batas perubahan

Usulan fitur baru harus menjelaskan siapa yang membutuhkannya, masalah yang diselesaikan, bukti permintaan, tambahan biaya produksi, dampak performa, dan kriteria selesai. Fitur tidak otomatis menjadi prioritas karena terlihat menarik di kompetitor. Jika memerlukan subsistem baru seperti builder bebas atau marketplace, buat PRD terpisah dengan batas dan dependensi yang jelas.

# 18. Daftar sumber dan catatan bukti

Semua sumber berikut adalah sumber primer dari pemilik layanan atau dokumentasi resmi. Waktu acuan riset mengikuti tanggal dokumen. Harga dan katalog dapat berubah. Deskripsi sumber adalah penunjuk bukti, bukan persetujuan atas seluruh klaim pemasaran situs.

| ID | Sumber | Penggunaan dan batas |
|---|---|---|
| S01 | [Invitee.web.id](https://invitee.web.id/) | Fitur, CTA, paket, dan harga tampil; dibaca melalui hasil indeks karena akses langsung timeout |
| S02 | [Inveet - halaman utama](https://inveet.id/) | Positioning, alur publik, paket, serta fitur yang dipromosikan |
| S03 | [Inveet - katalog tema](https://inveet.id/katalog-tema) | Kategori, palet, preview, dan penanda akses paket |
| S04 | [Inveet - undangan game interaktif](https://inveet.id/undangan-game-interaktif) | Bukti bahwa konsep eksplorasi/game sudah ditawarkan |
| S05 | [Inveet - pendaftaran](https://inveet.id/register) | Keberadaan titik masuk akun; dashboard tidak diuji |
| S06 | [HeyTML - Scrapbook](https://heytml.com/products/scrapbook) | Pembanding kategori kado dan scrapbook interaktif |
| S07 | [Abadikan - kado digital](https://abadikan.id/id/kado-digital) | Pembanding variasi hadiah digital personal |
| S08 | [Google - Web Vitals](https://web.dev/articles/vitals) | Ambang LCP, INP, CLS, p75, dan perbedaan uji lab/lapangan |
| S09 | [Chrome - Autoplay policy](https://developer.chrome.com/blog/autoplay/) | Perlunya interaksi dan penanganan kegagalan pemutaran bersuara |
| S10 | [W3C - Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) | Mode gerak ringan dan penjelasan status SC 2.3.3 level AAA |
| S11 | [W3C - Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | Acuan rasio kontras teks |
| S12 | [W3C - WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/) | Acuan audit aksesibilitas sesuai fungsi produk |

## 18.1 Hal yang belum dibuktikan riset ini

Kesediaan membayar pengguna Kado Digital, tingkat konversi setiap kanal, biaya akuisisi, volume pencarian, gaya visual yang paling disukai target, kecepatan produksi aktual, performa demo di perangkat target, serta efektivitas sistem internal kompetitor. Seluruh hal tersebut masuk rencana validasi; tidak diperlakukan sebagai temuan pasar yang sudah pasti.

## 18.2 Riwayat versi

**1.0:** brief awal, studi referensi publik, positioning, opsi brand, spesifikasi MVP, paket uji, alur layanan, kebutuhan fungsional, model data, kualitas, metrik, roadmap, dan kriteria launch. Perubahan berikutnya harus menyebut keputusan pemilik serta hasil validasi yang mendasarinya.
