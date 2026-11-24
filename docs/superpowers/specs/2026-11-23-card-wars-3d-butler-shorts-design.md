# Spesifikasi Desain: Presentasi Hybrid Metaheuristik SOKA Bergaya *Card Wars* 3D + Butler 3D + Visualisasi *Shorts*

**Tanggal:** 2026-11-23  
**Workspace:** `d:\koleg-v2\Semester 5\SOKA\HTML-Pages-SOKA-Hybrid`  
**Status:** Menunggu tinjauan user sebelum penulisan rencana implementasi (`writing-plans`).

---

## 1. Tujuan & Kriteria Keberhasilan

Mengubah presentasi web akademik SOKA (9 kartu materi: pengantar pemula, Pola B MCT-seeded GOA, Pola C Hybrid GOA-ALO, Lab 3D, dan bukti empiris Amaireh et al. 2023) menjadi pengalaman interaktif bergaya **permainan kartu meja 3D (*Adventure Time: Card Wars*)** yang dipandu langsung oleh **1 karakter Butler 3D Toon-Shaded ("Sir Pip")** dengan ritme penjelasan **manual step-by-step ala video YouTube Shorts / TikTok**.

### Kriteria Keberhasilan
1. **Dunia 3D Layar Penuh:** Satu scene Three.js (`100vw x 100vh`) menampilkan latar pantai/langit kartun, meja kayu kuning-emas, papan duel 2 jalur, properti meja mini, Butler 3D Toon-Shaded dengan garis tepi hitam kartun, dan animasi kartu 3D terbang-balik saat berganti kartu.
2. **Ritme *Shorts* Manual Murni:** Setiap kartu terbagi menjadi 3-4 beat visual pendek dengan progress bar segmen di atas panggung, animasi shapes bergerak yang selalu hidup (loop halus), dan subtitle kinetik besar berkode warna. Perpindahan beat **hanya terjadi saat diklik atau ditekan tombol** agar tidak pernah mendahului presenter saat menjelaskan di kelas.
3. **Kejujuran Ilmiah & Simulator Utuh:** Seluruh mesin algoritma nyata (`benchmarks.js`, `mct-goa.js`, `hybrid-goa-alo.js`), simulator MCT-GOA, anatomi GOA/ALO, alur & pivot `L/2` Eq. (1)-(13), Lab 3D Three.js + fallback kontur 2D, data empiris eksak Tabel 1, 2, 3, 6, 7, 9 Amaireh et al. (2023), serta placeholder `[CITASI PAPER MCT-GOA MENYUSUL]` tetap utuh tanpa fabrikasi data.
4. **Stabilitas GPU & Aksesibilitas:** Tidak pernah ada 2 loop WebGL aktif bersamaan (World 3D otomatis *pause* saat Lab 3D Kartu VII aktif atau saat tab disembunyikan), tersedia fallback 2D SVG otomatis jika WebGL gagal, semua pasangan warna teks lolos WCAG AA (`>= 4.5:1`), dan nol karakter *em dash* (`R-02`).

---

## 2. Sistem Visual & Tipografi (*Adventure Time: Card Wars* Craft)

### Palet Warna Terverifikasi Kontras (WCAG AA)
- **Atmosfer Dunia 3D (Dekoratif):** Langit biru cerah (`#53B8F3` -> `#8DD3FA`), laut toska (`#1E88C7`), pasir hangat (`#F6DF98`), kayu meja kuning-emas (`#F2C94C` / `#C78A1F`), papan duel 2 jalur (`#2B6CB0` biru & `#B7791F` cokelat-emas).
- **Garis Tepi & Bayangan Kartun:** `#1A1816` (`2.5px-3px solid`, bayangan blok `4px 4px 0 #1A1816`).
- **Permukaan Panggung & Kartu Terbuka:** Kertas gading terang `#FFFDF7` dengan teks utama `#1A1816` (`~17.5:1`) dan teks sekunder `#4B4742` (`~9.1:1`).
- **Sisi Belakang Kartu Tertutup:** Slate-navy `#1F2937` dengan judul kuning emas `#FDE047` (`~11.8:1`) dan teks `#F8FAFC` (`~14.2:1`).
- **3 Suit Warna Konsisten (pada `#FFFDF7` & tombol putih):**
  - **MCT (Suit Kotak):** Emerald `#0F766E` (`~5.3:1`)
  - **GOA (Suit Lingkaran):** Cobalt `#1D4ED8` (`~6.5:1`)
  - **ALO (Suit Corong):** Crimson `#B91C1C` (`~6.3:1`)
- **Pita Subtitle Kinetik Butler:** Latar gelap `#1A1816` dengan teks `#FFFDF7` (`~17.5:1`) dan sorotan kata kunci terang: MCT `#5EEAD4` (`~12.4:1`), GOA `#93C5FD` (`~10.1:1`), ALO `#FCA5A5` (`~8.8:1`), Emas `#FDE047` (`~14.5:1`).

### Tipografi
- **Display & Subtitle Kinetik:** `Fredoka` (700) + `Syne` (800) untuk karakter kartun-editorial yang tebal dan langsung terbaca di proyektor.
- **Teks Penjelasan:** `Plus Jakarta Sans` (400/500/600/700).
- **Angka, Metrik, & Rumus:** `JetBrains Mono` (400/600/700).
- Semua aset lokal memakai query cache-busting `?v=5`.

---

## 3. Arsitektur Modul & Tanggung Jawab

| Modul | Status | Tanggung Jawab Tunggal | Ketergantungan |
|---|---|---|---|
| `js/algorithms/benchmarks.js` | Tetap | 32 benchmark + fungsi uji F1/F13 & tabel empiris Amaireh et al. (2023) | Tidak ada |
| `js/algorithms/mct-goa.js` | Tetap | Penjadwalan deterministik MCT + optimasi GOA | Tidak ada |
| `js/algorithms/hybrid-goa-alo.js` | Tetap | Mesin Hybrid GOA-ALO (Eq. 1-13, pivot `L/2`) | `benchmarks.js` |
| `js/viz/world-3d.js` | **Baru** | Dunia 3D Three.js layar penuh (`CardWarsWorld`): pantai, meja, papan, properti, Butler 3D "Sir Pip" (6 mood), kartu 3D terbang-balik, kamera 3 preset (`overview`, `focus`, `peek`), pause/resume WebGL, dan fallback 2D SVG otomatis | `three` (importmap), `svg-illustrator.js` |
| `js/ui/shorts-stage.js` | **Baru** | Mesin Beat *Shorts* manual (`ShortsStageController`) + data `CARD_BEATS` (9 kartu x 3-4 beat), progress bar segmen, subtitle kinetik berkode warna, tombol pindah beat & mode simulator | Tidak ada (pure DOM/state) |
| `js/viz/svg-illustrator.js` | Update | 5 ilustrasi shapes animasi + emblem belakang kartu + **baru:** `renderButler2DSvg(container, { mood })` untuk fallback 2D & lencana wajah Butler | Tidak ada |
| `js/viz/svg-charts.js` | Update | Grafik empiris & kurva `c`/`s(r)` selaras gaya kartun garis tegas | `benchmarks.js` |
| `js/viz/three-lab.js` | Update | Lab 3D Search Landscape & fallback 2D kontur Kartu VII + selaras palet `#FFFDF7` | `three`, `benchmarks.js` |
| `js/ui/deck.js` | Update | State 9 kartu (buka/tutup, `sessionStorage` v5, tangan 9 kartu bergaya *Card Wars*, modal Meja 9 Kartu, mode `Intip Meja 3D`) | `svg-illustrator.js` |
| `js/ui/controls.js` | Update | Orkestrator utama: menghubungkan `DeckController`, `CardWarsWorld`, `ShortsStageController`, animasi tiap beat, dan handoff pause/resume GPU saat Kartu VII Lab 3D berjalan | Semua modul UI & viz |

---

## 4. Desain Butler 3D ("Sir Pip") & Koreografi Kamera (`world-3d.js`)

### Konstruksi Geometri & Toon Outline
- Seluruh mesh utama memakai `THREE.MeshToonMaterial` dengan `DataTexture` 3-band *gradientMap* (flat cartoon shading) dipasangkan dengan helper `addToonOutline(mesh, thickness)` memakai `THREE.MeshBasicMaterial({ color: 0x1A1816, side: THREE.BackSide })`.
- **Tubuh Butler:** Kotak-bulat mint (`#7ED4BE`) berjas tuksedo navy (`#1F2937`), kemeja putih (`#FFFDF7`), dasi kupu merah (`#DC2626`), topi butler kecil miring bergaris emas (`#FDE047`), dua lengan artikulasi (kanan memegang kipas 3 kartu mini, kiri menunjuk papan tengah).
- **Wajah Dinamis (`CanvasTexture` `256x192`):** Ditempel pada bidang wajah depan, digambar ulang hanya saat kedipan mata berkala atau saat `setButlerMood(mood)` dipanggil.
- **6 State Pose & Ekspresi:**
  1. `greet`: Senyum lebar, lengan kanan melambai pelan, tubuh sedikit memantul.
  2. `deal`: Ayunan lengan melempar kartu 3D ke tengah meja + alis antusias.
  3. `point`: Tubuh condong ke papan tengah, lengan kiri menunjuk diorama, mata fokus ke papan.
  4. `think`: Kepala miring `12 deg`, alis terangkat satu, tangan dekat dagu (untuk membahas masalah/jebakan lokal).
  5. `aha`: Melonjak kecil + topi sedikit terangkat + mata berbinar (untuk momen kunci Pivot `L/2` dan kerjasama Hybrid).
  6. `proud`: Angguk mantap, kedua lengan terbuka bangga (untuk hasil tabel empiris & kesimpulan).

### Preset Kamera & Animasi Kartu 3D
- **`overview` (Kartu Tertutup):** Kamera di posisi rendah melintasi meja (`pos: [0, 3.1, 6.2]`, `lookAt: [0, 0.9, -0.4]`), memperlihatkan Butler 3D dan kartu 3D tertutup yang melayang berputar pelan di atas papan duel.
- **`focus` (Kartu Terbuka / Panggung *Shorts*):** Kamera bergeser mulus (*lerp*) agar Butler 3D tetap tampak jelas di kuadran atas-kiri layar sementara area tengah meja terbuka untuk panggung diorama *Shorts* dan simulator.
- **`peek` (Mode `Intip Meja 3D`, tombol `T`):** Panggung HTML disembunyikan sementara dengan transisi halus dan kamera sedikit mengorbit lembut memamerkan seluruh meja 3D, properti limun/dek, kartu 3D, dan Butler.
- **Animasi Lempar Kartu:** Saat berpindah kartu, `activeCardMesh` terbang melengkung dari posisi tangan Butler ke tengah papan, berputar pada sumbu Y, dan mendarat dengan guncangan kamera mikro teredam (dinonaktifkan jika `prefers-reduced-motion`).

---

## 5. Storyboard 9 Kartu x Beat *Shorts* (`shorts-stage.js`)

Setiap kartu memuat **3-4 beat manual** (total 34 beat). Pada beat bertipe `diorama`, panel difokuskan pada visualisasi shapes bergerak + subtitle kinetik besar Butler (kontrol berat & tabel disembunyikan sementara agar layar bersih ala Shorts). Pada beat bertipe `interactive` (atau kapan saja presenter menekan tombol tab **`Mode Simulator / Data`**), seluruh kontrol interaktif, rumus Eq. (1)-(13), dan grafik empiris tampil penuh.

| Kartu | Beat 1 (Hook) | Beat 2 (Visual Shapes) | Beat 3 (Momen "Aha!") | Beat 4 (Interaktif / Payoff) |
|---|---|---|---|---|
| **I. Pengantar** | `greet`: 3 bentuk rahasia di dek ini (`cover:all`) | `point`: Suit Kotak MCT menyusun start rapi (`cover:mct`) | `point`: Suit Lingkaran GOA menyisir peta (`cover:goa`) | `aha` (`interactive`): Suit Corong ALO + peta 9 kartu (`cover:alo`) |
| **II. Intuisi Pemula** | `think`: Mengapa tebakan acak selalu gagal? (`intuition:random`) | `point`: Eksplorasi menyisir bukit (`intuition:explore`) | `aha`: Eksploitasi menukik ke lembah terdalam (`intuition:exploit`) | `proud` (`interactive`): Putar ulang & uji 3 tahap bebas |
| **III. Taksonomi** | `think`: No Free Lunch, tak ada 1 algoritma sempurna (`taxonomy:all`) | `point`: Pola B = Estafet satu arah (`taxonomy:patternB`) | `aha`: Pola C = Kerja tim di tiap iterasi (`taxonomy:patternC`) | `proud` (`interactive`): Tabel perbandingan ilmiah Pola B vs C |
| **IV. Pola B: MCT -> GOA** | `think`: Masalah antrean tugas di banyak mesin (`mct:idle`) | `deal`: MCT menyusun balok ke mesin tercepat (`mct:animate`) | `aha`: GOA memoles jadwal lebih rendah lagi (`mct:compare`) | `proud` (`interactive`): **Simulator MCT-GOA vs Pure GOA** |
| **V. GOA & ALO Tunggal** | `point`: Insting dorong-tarik kawanan GOA (`single:goa`) | `point`: Jebakan corong pasir ALO (`single:alo`) | `think`: Celah kelemahan jika jalan sendiri (`single:flaw`) | `proud` (`interactive`): **Kontrol Interaktif GOA & ALO** |
| **VI. Pola C: Hybrid** | `deal`: Menggabungkan radar GOA + corong ALO (`hybrid:step1`) | `aha`: Rahasia **Pivot `L/2`** memotong peluruhan `c` (`hybrid:pivot`) | `point`: 6 langkah & Eq. (1)-(13) bekerja sinkron (`hybrid:step4`) | `proud` (`interactive`): **Alur 6 Langkah + Kurva `c` Live** |
| **VII. Lab 3D** | `deal`: Saatnya uji langsung di medan 3D berbukit (`lab:brief`) | `point`: Amati jalur Hybrid vs GOA vs ALO (`lab:preview`) | `aha` (`interactive`): **Lab Simulasi 3D Three.js & Kontur 2D** (World 3D auto-pause) | *(3 beat untuk kartu ini agar langsung masuk Lab)* |
| **VIII. Bukti Empiris** | `proud`: Skor menang pada 32 fungsi klasik (`bench:classical`) | `aha`: Ketangguhan CEC2015 & sintesis antena nyata (`bench:cec`) | `think`: Jujur soal harga waktu CPU (`213 s` vs `195 s` vs `67 s`) (`bench:cpu`) | `proud` (`interactive`): **Grafik Interaktif Tabel 1-9 Amaireh 2023** |
| **IX. Sintesis & Pustaka** | `point`: Aturan praktis memilih Pola B vs Pola C (`synth:rule`) | `aha` (`interactive`): **Matriks Keputusan Profil Masalah** | `proud` (`interactive`): Daftar Pustaka (`[CITASI PAPER MCT-GOA MENYUSUL]`) | *(3 beat penutup)* |

---

## 6. Kontrak Kontrol Keyboard & Error Handling

### Pintasan Keyboard (Tanpa Bentrok)
- `Enter` / `Space` (saat kartu tertutup): Buka kartu ke panggung.
- `Space` / `N` (saat kartu terbuka): Lanjut ke beat berikutnya (kecuali saat Kartu VII sedang di beat Lab 3D interaktif, di mana `Space` memutar/menjeda simulasi Lab 3D).
- `B`: Kembali ke beat sebelumnya.
- `ArrowLeft` / `ArrowRight`: Pindah kartu sebelumnya / berikutnya.
- `1`-`9`: Ambil kartu I sampai IX langsung.
- `F`: Balik kartu (tutup/buka).
- `T`: Toggle mode **`Intip Meja 3D`** (sembunyikan/tampilkan panggung di atas meja).
- `G`: Buka/tutup modal **Meja 9 Kartu**.
- `Esc`: Tutup modal Meja 9 Kartu atau keluar dari mode `Intip Meja 3D`.

### Penanganan Error & Performa
1. **WebGL tidak tersedia / gagal import Three.js / `webglcontextlost`:** `CardWarsWorld` otomatis memasang tampilan 2D SVG Card Wars (pantai, meja kayu, papan 2 jalur, dan Butler 2D SVG ekspresif) serta menampilkan status ringkas tanpa layar kosong.
2. **Handoff GPU Kartu VII:** Saat Kartu VII terbuka pada mode Lab 3D aktif, `controls.js` memanggil `world.pause()` dan membekukan frame 3D meja di belakang; begitu keluar dari Kartu VII atau beralih ke mode kontur 2D, `world.resume()` dipanggil kembali.
3. **Tab disembunyikan (`document.hidden`) & `prefers-reduced-motion`:** Semua loop `requestAnimationFrame` otomatis dihentikan sementara saat tab tidak terlihat; pengguna dengan preferensi gerak tereduksi mendapatkan transisi statis tanpa guncangan kamera atau pantulan cepat.

---

## 7. Rencana Verifikasi (`tests/verify-algorithms.mjs`)

1. Syntax check (`node --check`) pada seluruh 10 modul JS.
2. Seluruh uji matematika eksisting tetap lolos tanpa modifikasi (Eq. 9-12, konvergensi Hybrid pada F1 & F13, keunggulan seeding MCT vs random).
3. Validasi struktur `CARD_BEATS`: tepat 9 kartu, masing-masing 3-4 beat, setiap `mood` valid dalam 6 state Butler, dan setiap `mode` valid (`diorama` / `interactive`).
4. Uji render `renderButler2DSvg` untuk keenam mood (menghasilkan SVG valid dan unik per ekspresi).
5. Uji rasio kontras WCAG AA (`>= 4.5:1`) untuk seluruh pasangan warna palet *Card Wars* v5.
6. Audit statis zero em-dash (`\u2014`) di `index.html`, `css/atlas-theme.css`, seluruh berkas `js/**/*.js`, dan berkas spesifikasi ini.
