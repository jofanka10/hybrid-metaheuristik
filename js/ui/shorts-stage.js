// Manual Step-by-Step Shorts / TikTok Beat Engine (9 Cards x 3-4 Beats = 34 Beats)
// Pure manual advancement (never auto-advances during live lecture) while syncing live
// looping shape animations, kinetic color-coded Butler captions, and 3D Butler Sir Pip moods.

import { BUTLER_MOODS, renderButler2DSvg } from '../viz/svg-illustrator.js?v=7';

export const INTRO_BEATS = [
  {
    pill: 'INTRO 1 / 2 | SIR PIP MENYAPA',
    title: 'Selamat Datang di Meja Card Wars SOKA!',
    bodyHtml: 'Halo! Saya <span class="kw-gold">Sir Pip</span>, Butler meja strategi ini. Sebelum kita membalik kartu pertama, santai dulu: saya akan memandu kamu memahami <span class="kw-mct">MCT-PSO</span> dan <span class="kw-alo">Hybrid GOA-ALO</span> dari nol lewat animasi shapes singkat seperti video Shorts.',
    mood: 'greet',
    cta: 'Lanjut Intro ->'
  },
  {
    pill: 'INTRO 2 / 2 | ATURAN MAIN DEK',
    title: '9 Kartu di Meja, Kamu Pegang Kendali Penuh!',
    bodyHtml: 'Setiap kartu punya <span class="kw-goa">3-4 ketukan animasi Shorts manual</span> yang tidak akan loncat sendiri saat kamu bicara di kelas, plus simulator nyata &amp; data empiris <span class="kw-gold">Amaireh et al. (2023)</span>. Siap kita balik <span class="kw-alo">Kartu I</span>?',
    mood: 'deal',
    cta: 'Siapkan Kartu I ->'
  }
];

export const MOOD_LABELS = {
  greet: 'SIR PIP MENYAPA',
  deal: 'LEMPAR KARTU',
  point: 'LIHAT PAPAN',
  think: 'COBA PIKIRKAN',
  aha: 'MOMEN AHA!',
  proud: 'TERBUKTI!'
};

// 9 Cards, 34 Manual Beats matching Spec Section 5
export const CARD_BEATS = [
  // CARD I: PENGANTAR & 3 SUIT GEOMETRIS (4 beats)
  [
    {
      id: 'c1-hook',
      badge: 'HOOK',
      hook: '3 Bentuk Rahasia di Dek Hybrid Ini!',
      captionHtml: 'Halo! Saya <span class="kw-gold">Sir Pip</span>. Sebelum lihat rumus, cukup hafalkan 3 bentuk di papan: <span class="kw-mct">Kotak</span>, <span class="kw-goa">Lingkaran</span>, dan <span class="kw-alo">Corong</span>.',
      mood: 'greet',
      mode: 'diorama',
      action: 'cover:all'
    },
    {
      id: 'c1-mct',
      badge: 'SUIT 01',
      hook: 'Kotak Hijau = MCT (Start Rapi)',
      captionHtml: '<span class="kw-mct">MCT</span> menyusun balok tugas ke mesin tercepat satu per satu. Tanpa tebak acak, langsung dapat modal start bagus!',
      mood: 'point',
      mode: 'diorama',
      action: 'cover:mct'
    },
    {
      id: 'c1-goa',
      badge: 'SUIT 02',
      hook: 'Lingkaran Biru = GOA (Penjelajah Peta)',
      captionHtml: '<span class="kw-goa">GOA</span> meniru kawanan belalang yang saling dorong-tarik untuk menyisir seluruh peta luas tanpa cepat puas.',
      mood: 'point',
      mode: 'diorama',
      action: 'cover:goa'
    },
    {
      id: 'c1-alo',
      badge: 'SUIT 03 + PILIH',
      hook: 'Corong Merah = ALO (Pengunci Presisi)',
      captionHtml: '<span class="kw-alo">ALO</span> mempersempit corong pasir untuk mengunci jawaban terbaik. Klik suit di bawah atau lanjut ke <span class="kw-gold">Kartu II</span>!',
      mood: 'aha',
      mode: 'interactive',
      action: 'cover:alo'
    }
  ],

  // CARD II: INTUISI PEMULA (4 beats)
  [
    {
      id: 'c2-random',
      badge: 'MASALAH',
      hook: 'Kenapa Tebakan Acak Selalu Kalah?',
      captionHtml: 'Bayangkan cari lembah terdalam di bukit berkabut. Titik acak langsung puas di <span class="kw-alo">lubang dangkal (Optimum Lokal)</span>!',
      mood: 'think',
      mode: 'diorama',
      action: 'intuition:random'
    },
    {
      id: 'c2-explore',
      badge: 'EKSPLORASI',
      hook: 'Langkah 1: Sebar Kawanan Lewati Bukit!',
      captionHtml: 'Kawanan <span class="kw-goa">Eksplorasi</span> sengaja menjaga jarak agar melompat melewati bukit dan menemukan <span class="kw-gold">Lembah Global</span>.',
      mood: 'point',
      mode: 'diorama',
      action: 'intuition:explore'
    },
    {
      id: 'c2-exploit',
      badge: 'EKSPLOITASI',
      hook: 'Langkah 2: Persempit Corong ke Dasar!',
      captionHtml: 'Begitu lembah terdalam ketemu, <span class="kw-alo">Corong Eksploitasi</span> menyempit tajam supaya semua titik menukik presisi ke dasar.',
      mood: 'aha',
      mode: 'diorama',
      action: 'intuition:exploit'
    },
    {
      id: 'c2-try',
      badge: 'COBA SENDIRI',
      hook: 'Dua Peran Ini Harus Seimbang!',
      captionHtml: 'Terlalu luas = lambat presisi. Terlalu sempit = terjebak lubang salah. Silakan tekan tombol tahap di kanan untuk mengulang!',
      mood: 'proud',
      mode: 'interactive',
      action: 'intuition:exploit'
    }
  ],

  // CARD III: TAKSONOMI POLA B VS POLA C (4 beats)
  [
    {
      id: 'c3-nfl',
      badge: 'TEOREMA NFL',
      hook: 'Tidak Ada 1 Algoritma Terkuat untuk Semua!',
      captionHtml: 'Menurut <span class="kw-gold">No Free Lunch (1997)</span>, tiap metode punya celah. Solusinya? Gabungkan dua algoritma jadi <span class="kw-goa">Hybrid</span>!',
      mood: 'think',
      mode: 'diorama',
      action: 'taxonomy:all'
    },
    {
      id: 'c3-patb',
      badge: 'POLA B',
      hook: 'Pola B = Model Estafet (1 Arah)',
      captionHtml: '<span class="kw-mct">MCT</span> lari di awal menyusun jadwal rapi sekali jalan, lalu tongkat estafet diserahkan ke <span class="kw-pso">PSO</span> untuk dipoles.',
      mood: 'point',
      mode: 'diorama',
      action: 'taxonomy:init'
    },
    {
      id: 'c3-patc',
      badge: 'POLA C',
      hook: 'Pola C = Kerja Tim di Setiap Putaran!',
      captionHtml: 'Di <span class="kw-alo">Hybrid GOA-ALO</span>, kawanan <span class="kw-goa">GOA</span> dan corong <span class="kw-alo">ALO</span> saling bertukar posisi kandidat di setiap iterasi hingga mengunci Elite.',
      mood: 'aha',
      mode: 'diorama',
      action: 'taxonomy:exploit'
    },
    {
      id: 'c3-table',
      badge: 'PERBANDINGAN',
      hook: 'Bandingkan Detail Ilmiah Pola B vs Pola C',
      captionHtml: 'Gunakan tab fase di atas dan tabel perbandingan di bawah untuk melihat perbedaan domain, mekanisme, dan rujukan papernya.',
      mood: 'proud',
      mode: 'interactive',
      action: 'taxonomy:all'
    }
  ],

  // CARD IV: POLA B MCT-SEEDED PSO (4 beats)
  [
    {
      id: 'c4-problem',
      badge: 'STUDI KASUS',
      hook: 'Banyak Tugas, Mesin Kecepatannya Beda!',
      captionHtml: 'Kalau jadwal mesin ditebak acak, satu mesin bisa menumpuk parah sehingga waktu selesai total (<span class="kw-gold">Makespan</span>) membengkak.',
      mood: 'think',
      mode: 'diorama',
      action: 'mct:step0'
    },
    {
      id: 'c4-mct',
      badge: 'ATURAN MCT',
      hook: 'Masukkan Tiap Balok ke Mesin Paling Cepat Selesai!',
      captionHtml: 'Lihat animasi <span class="kw-mct">MCT</span>: setiap balok tugas masuk ke mesin dengan <code>CT = ready + W/S</code> terkecil. Langsung seimbang!',
      mood: 'deal',
      mode: 'diorama',
      action: 'mct:animate'
    },
    {
      id: 'c4-inject',
      badge: 'INJEKSI PSO',
      hook: 'Suntikkan Hasil MCT ke Partikel Awal PSO!',
      captionHtml: 'Jadwal <span class="kw-mct">X_MCT</span> disuntikkan sebagai posisi awal partikel <span class="kw-pso">PSO</span>. Sejak iterasi 0, gbest sudah sebagus MCT, jauh di depan start acak PSO murni!',
      mood: 'aha',
      mode: 'diorama',
      action: 'mct:full'
    },
    {
      id: 'c4-sim',
      badge: 'SIMULATOR NYATA',
      hook: 'Ubah Jumlah Tugas, Mesin, & Rasio Seeding!',
      captionHtml: 'Sekarang giliranmu! Geser parameter di panel kanan, lalu seret garis iterasi di grafik: bandingkan kurva ungu <span class="kw-pso">MCT+PSO</span> melawan garis abu <span class="kw-gold">PSO murni</span>.',
      mood: 'proud',
      mode: 'interactive',
      action: 'mct:full'
    }
  ],

  // CARD V: ANATOMI GOA & ALO TUNGGAL (4 beats)
  [
    {
      id: 'c5-goa',
      badge: 'INSTING GOA',
      hook: 'Belalang Punya Jarak Nyaman Sosial!',
      captionHtml: 'Di <span class="kw-goa">GOA</span>, terlalu dekat -> saling <span class="kw-alo">dorong</span>; terlalu jauh -> saling <span class="kw-goa">tarik</span> menuju radius nyaman <code>r0</code>. Hebat menyisir peta!',
      mood: 'point',
      mode: 'diorama',
      action: 'single:goa'
    },
    {
      id: 'c5-alo',
      badge: 'INSTING ALO',
      hook: 'Undur-Undur Menjebak Mangsa di Corong Pasir!',
      captionHtml: 'Di <span class="kw-alo">ALO</span>, makin besar progres <code>t/T</code>, tangga <code>w</code> mempersempit dinding corong <code>c^t/I</code> hingga mangsa meluncur ke Elite.',
      mood: 'point',
      mode: 'diorama',
      action: 'single:alo'
    },
    {
      id: 'c5-flaw',
      badge: 'CELAH TUNGGAL',
      hook: 'Kenapa Keduanya Masih Pincang Jika Sendiri?',
      captionHtml: '<span class="kw-goa">GOA</span> mengecilkan langkah terlalu lambat (kurang tajam). <span class="kw-alo">ALO</span> terlalu cepat mengerucut (rawan terjebak di lubang salah).',
      mood: 'think',
      mode: 'diorama',
      action: 'single:alo'
    },
    {
      id: 'c5-ctrl',
      badge: 'BEDAH PARAMETER',
      hook: 'Geser Parameter f, l, dan Progres Corong t/T!',
      captionHtml: 'Pilih tab <span class="kw-goa">GOA</span> atau <span class="kw-alo">ALO</span> di atas lalu ubah slider untuk melihat kurva <code>s(r)</code> dan rasio penyempitan <code>I</code> secara real-time.',
      mood: 'proud',
      mode: 'interactive',
      action: 'single:goa'
    }
  ],

  // CARD VI: POLA C HYBRID GOA-ALO & PIVOT L/2 (4 beats)
  [
    {
      id: 'c6-combine',
      badge: 'SOLUSI HYBRID',
      hook: 'Radar Luas GOA + Corong Tajam ALO!',
      captionHtml: '<span class="kw-gold">Amaireh et al. (2023)</span> menggabungkan gaya sosial <span class="kw-goa">GOA</span> dengan random-walk corong <span class="kw-alo">ALO</span> dalam satu putaran.',
      mood: 'deal',
      mode: 'diorama',
      action: 'hybrid:social'
    },
    {
      id: 'c6-pivot',
      badge: 'INOVASI KUNCI',
      hook: 'Rahasia Terbesar Paper: Pivot c di L/2!',
      captionHtml: 'Alih-alih meluruh sampai iterasi akhir <code>L</code>, Hybrid menurunkan <span class="kw-alo">c ke c_min tepat di separuh jalan (L/2)</span>. 50% sisa waktu penuh untuk presisi!',
      mood: 'aha',
      mode: 'diorama',
      action: 'hybrid:modc'
    },
    {
      id: 'c6-matrix',
      badge: 'SELEKSI 3-GRUP',
      hook: 'Kenapa Agen Terburuk Ikut Diambil Sedikit?',
      captionHtml: 'Di <span class="kw-gold">Tahap 05</span>, seleksi mengambil kandidat Terbaik, Menengah, dan sedikit Terburuk agar kawanan tetap punya penjelajah cadangan!',
      mood: 'point',
      mode: 'diorama',
      action: 'hybrid:matrix'
    },
    {
      id: 'c6-explore',
      badge: 'BEDAH EQ. 1-13',
      hook: 'Klik 6 Kotak Tahap & Geser Kurva Pivot L/2!',
      captionHtml: 'Klik tiap tahap di flowchart kiri untuk membaca bahasa awam + rumus persis paper, atau ubah <code>L</code> di grafik kanan.',
      mood: 'proud',
      mode: 'interactive',
      action: 'hybrid:modc'
    }
  ],

  // CARD VII: LAB SIMULASI 3D & 2D (3 beats -> rapid entry into 3D Lab!)
  [
    {
      id: 'c7-brief',
      badge: 'ARENA UJI 3D',
      hook: 'Saatnya Adu Langsung di Medan Berbukit!',
      captionHtml: 'Kita tantang <span class="kw-alo">Hybrid GOA-ALO</span> di fungsi multimodal <span class="kw-gold">Rastrigin (F13)</span> yang penuh puluhan lubang jebakan lokal.',
      mood: 'deal',
      mode: 'diorama',
      action: 'lab:brief'
    },
    {
      id: 'c7-preview',
      badge: 'CARA BACA',
      hook: 'Pilih Mode "Bandingkan Ketiganya"!',
      captionHtml: 'Perhatikan berlian merah (<span class="kw-alo">Elite</span>) dan kurva log di bawah: tepat setelah <span class="kw-gold">Pivot L/2</span>, Hybrid menukik jauh lebih dalam!',
      mood: 'point',
      mode: 'diorama',
      action: 'lab:compare'
    },
    {
      id: 'c7-live',
      badge: 'LAB 3D AKTIF',
      hook: 'Tekan Jalankan (Space) & Putar Medan 3D!',
      captionHtml: 'Meja 3D di belakang saya jeda sebentar supaya GPU fokus 100% ke <span class="kw-goa">Lab 3D</span>. Kamu juga bisa ganti ke <span class="kw-mct">2D Kontur</span>!',
      mood: 'aha',
      mode: 'interactive',
      action: 'lab:live'
    }
  ],

  // CARD VIII: BUKTI EMPIRIS AMAIREH ET AL. (2023) (4 beats)
  [
    {
      id: 'c8-classical',
      badge: 'TABEL 1 & 2',
      hook: 'Skor Total Rank #1 di 32 Fungsi Klasik!',
      captionHtml: 'Pada batang ini, <span class="kw-gold">lebih pendek = peringkat lebih baik</span>. <span class="kw-alo">Hybrid GOA-ALO</span> memuncaki Unimodal (15) & Multimodal (39)!',
      mood: 'proud',
      mode: 'diorama',
      action: 'bench:unimodal'
    },
    {
      id: 'c8-cec',
      badge: 'TABEL 3, 6, 7',
      hook: 'Tangguh di CEC2015 & Sintesis Antena Nyata!',
      captionHtml: 'Pada uji dunia nyata antena LAA 32-elemen, Hybrid menekan sidelobe lebih bersih (<span class="kw-alo">-35.99 dB</span>) dan konsisten menang uji Wilcoxon.',
      mood: 'aha',
      mode: 'diorama',
      action: 'bench:antenna'
    },
    {
      id: 'c8-cpu',
      badge: 'TRADE-OFF JUJUR',
      hook: 'Apa Harga yang Harus Dibayar? Waktu CPU!',
      captionHtml: 'Paper mencatat jujur: karena memanggil dua mesin, Hybrid butuh <span class="kw-alo">213 s</span> vs GOA <span class="kw-goa">195 s</span> dan ALO <span class="kw-mct">67 s</span>.',
      mood: 'think',
      mode: 'diorama',
      action: 'bench:antenna'
    },
    {
      id: 'c8-explore',
      badge: 'INSPEKSI DATA',
      hook: 'Klik Tab Benchmark & Sorot Setiap Batang!',
      captionHtml: 'Seluruh angka diambil persis dari Tabel 1, 2, 3, 6, 7, dan 9 <span class="kw-gold">Amaireh et al. (2023)</span>. Klik batang mana pun untuk detailnya.',
      mood: 'proud',
      mode: 'interactive',
      action: 'bench:multimodal'
    }
  ],

  // CARD IX: MATRIKS KEPUTUSAN & DAFTAR PUSTAKA (3 beats)
  [
    {
      id: 'c9-rule',
      badge: 'ATURAN PRAKTIS',
      hook: 'Jadi, Kapan Pilih Pola B vs Pola C?',
      captionHtml: 'Punya masalah <span class="kw-mct">jadwal diskrit + butuh cepat</span> -> pilih <span class="kw-mct">Pola B (MCT-PSO)</span>. Peta <span class="kw-alo">kontinu penuh bukit jebakan</span> -> pilih <span class="kw-alo">Pola C (Hybrid GOA-ALO)</span>!',
      mood: 'point',
      mode: 'diorama',
      action: 'synth:rule'
    },
    {
      id: 'c9-matrix',
      badge: 'MATRIKS PILIH',
      hook: 'Uji Profil Masalahmu di Matriks Keputusan!',
      captionHtml: 'Klik kombinasi domain, anggaran CPU, dan heuristik di kiri; kartu rekomendasi otomatis menyorot arsitektur terbaik.',
      mood: 'aha',
      mode: 'interactive',
      action: 'synth:matrix'
    },
    {
      id: 'c9-refs',
      badge: 'PENUTUP & PUSTAKA',
      hook: 'Semua Kartu Terbuka! Terima Kasih!',
      captionHtml: 'Seluruh rujukan ilmiah tercantum lengkap di kanan. Tekan <span class="kw-gold">T</span> kapan saja untuk memamerkan meja 3D penuh bersama saya!',
      mood: 'proud',
      mode: 'interactive',
      action: 'synth:refs'
    }
  ]
];

export class ShortsStageController {
  constructor({ onBeatChange, onNextCard, onRevealCard } = {}) {
    this.onBeatChange = onBeatChange;
    this.onNextCard = onNextCard;
    this.onRevealCard = onRevealCard;
    this.cardIdx = 0;
    this.beatIdx = 0;
    this.forceInteractive = false;
    this.isCardFaceDown = false;

    this.cardFrontFace = document.getElementById('card-front-face');
    this.progressBar = document.getElementById('shorts-progress-bar');
    this.beatCounter = document.getElementById('shorts-beat-counter');
    this.modeToggleBtn = document.getElementById('shorts-mode-toggle');
    this.butlerBadge = document.getElementById('butler-badge-svg');
    this.butlerMoodPill = document.getElementById('butler-mood-pill');
    this.hookEl = document.getElementById('butler-hook-text');
    this.captionEl = document.getElementById('butler-caption-text');
    this.captionInner = document.getElementById('butler-caption-inner');
    this.prevBtn = document.getElementById('beat-prev-btn');
    this.nextBtn = document.getElementById('beat-next-btn');

    this._bindEvents();
  }

  _bindEvents() {
    this.prevBtn?.addEventListener('click', () => {
      if (!this.isCardFaceDown) this.prevBeat();
    });
    this.nextBtn?.addEventListener('click', () => {
      if (this.isCardFaceDown) {
        this.onRevealCard && this.onRevealCard();
      } else {
        this.nextBeat();
      }
    });
    this.modeToggleBtn?.addEventListener('click', () => this.toggleInteractiveMode());
  }

  // Spoken Butler dialogue shown in his Comic Speech Bubble BEFORE the user flips a closed card!
  showClosedCardDialogue(meta) {
    this.isCardFaceDown = true;
    renderButler2DSvg(this.butlerBadge, { mood: 'deal', compact: true });
    if (this.butlerMoodPill) {
      this.butlerMoodPill.textContent = `KARTU ${meta.roman} TERTUTUP | SIR PIP`;
    }
    if (this.hookEl) {
      this.hookEl.textContent = `Kartu ${meta.roman} Siap Dibalik!`;
    }
    if (this.captionEl) {
      this.captionEl.innerHTML = `${meta.teaser} Klik kartunya di kanan atau tekan <span class="kw-gold">Balik Kartu</span>!`;
    }
    if (this.captionInner) {
      this.captionInner.classList.remove('is-pop');
      void this.captionInner.offsetWidth;
      this.captionInner.classList.add('is-pop');
    }
    if (this.prevBtn) this.prevBtn.disabled = true;
    if (this.nextBtn) {
      this.nextBtn.disabled = false;
      this.nextBtn.textContent = `Balik Kartu ${meta.roman} ->`;
    }
  }

  getBeats(cardIdx = this.cardIdx) {
    return CARD_BEATS[cardIdx] || CARD_BEATS[0];
  }

  getCurrentBeat() {
    const beats = this.getBeats();
    const raw = beats[this.beatIdx] || beats[0];
    return {
      ...raw,
      effectiveMode: this.forceInteractive ? 'interactive' : raw.mode,
      cardIdx: this.cardIdx,
      beatIdx: this.beatIdx,
      totalBeats: beats.length
    };
  }

  loadCard(cardIdx, { beatIdx = 0 } = {}) {
    this.isCardFaceDown = false;
    this.cardIdx = Math.max(0, Math.min(CARD_BEATS.length - 1, cardIdx));
    const beats = this.getBeats();
    this.beatIdx = Math.max(0, Math.min(beats.length - 1, beatIdx));
    this.forceInteractive = false;
    this._render();
    this._emit();
  }

  goToBeat(beatIdx) {
    const beats = this.getBeats();
    const clamped = Math.max(0, Math.min(beats.length - 1, beatIdx));
    this.beatIdx = clamped;
    this.forceInteractive = false;
    this._render();
    this._emit();
  }

  nextBeat() {
    const beats = this.getBeats();
    if (this.beatIdx < beats.length - 1) {
      this.goToBeat(this.beatIdx + 1);
    } else if (this.cardIdx < CARD_BEATS.length - 1) {
      this.onNextCard && this.onNextCard(this.cardIdx + 1);
    }
  }

  prevBeat() {
    if (this.beatIdx > 0) {
      this.goToBeat(this.beatIdx - 1);
    }
  }

  toggleInteractiveMode() {
    const beat = this.getCurrentBeat();
    if (beat.effectiveMode === 'interactive') {
      // If user clicked toggle while already on an interactive beat, jump back to Beat 1 diorama
      this.forceInteractive = false;
      if (beat.mode === 'interactive' && this.beatIdx > 0) {
        this.beatIdx = 0;
      }
    } else {
      this.forceInteractive = true;
    }
    this._render();
    this._emit();
  }

  _render() {
    const beats = this.getBeats();
    const beat = this.getCurrentBeat();
    const safeMood = BUTLER_MOODS.includes(beat.mood) ? beat.mood : 'greet';

    // Update progressive disclosure mode on card container
    if (this.cardFrontFace) {
      this.cardFrontFace.setAttribute('data-stage-mode', beat.effectiveMode);
    }

    // Render IG-Stories / Shorts Segmented Progress Bar
    if (this.progressBar) {
      this.progressBar.innerHTML = beats.map((b, i) => {
        const stateCls = i < this.beatIdx ? 'is-done' : i === this.beatIdx ? 'is-current' : '';
        return `
          <button type="button" class="shorts-seg ${stateCls}" data-beat-idx="${i}"
                  aria-label="Beat ${i + 1} dari ${beats.length}: ${b.hook}"
                  aria-current="${i === this.beatIdx ? 'step' : 'false'}">
            <span class="shorts-seg-fill"></span>
          </button>
        `;
      }).join('');

      this.progressBar.querySelectorAll('.shorts-seg').forEach((btn) => {
        btn.addEventListener('click', () => this.goToBeat(Number(btn.dataset.beatIdx)));
      });
    }

    if (this.beatCounter) {
      this.beatCounter.textContent = `BEAT ${this.beatIdx + 1} / ${beats.length}`;
    }

    if (this.modeToggleBtn) {
      const isInter = beat.effectiveMode === 'interactive';
      this.modeToggleBtn.textContent = isInter ? 'Fokus Diorama Shorts' : 'Buka Simulator / Data';
      this.modeToggleBtn.classList.toggle('btn-goa', !isInter);
      this.modeToggleBtn.classList.toggle('btn-gold', isInter);
    }

    // Render Sir Pip 2D Portrait Badge + Kinetic Subtitle Copy
    renderButler2DSvg(this.butlerBadge, { mood: safeMood, compact: true });
    if (this.butlerMoodPill) {
      this.butlerMoodPill.textContent = `${beat.badge} | ${MOOD_LABELS[safeMood] || 'SIR PIP'}`;
    }
    if (this.hookEl) this.hookEl.textContent = beat.hook;
    if (this.captionEl) this.captionEl.innerHTML = beat.captionHtml;

    // Retrigger crisp kinetic pop-in animation on beat change
    if (this.captionInner) {
      this.captionInner.classList.remove('is-pop');
      void this.captionInner.offsetWidth;
      this.captionInner.classList.add('is-pop');
    }

    if (this.prevBtn) {
      this.prevBtn.disabled = this.beatIdx === 0;
    }
    if (this.nextBtn) {
      const isLastBeat = this.beatIdx === beats.length - 1;
      const isLastCard = this.cardIdx === CARD_BEATS.length - 1;
      this.nextBtn.disabled = isLastBeat && isLastCard;
      this.nextBtn.textContent = isLastBeat && !isLastCard
        ? 'Ambil Kartu Berikutnya ->'
        : isLastBeat && isLastCard
          ? 'Selesai (Semua Kartu)'
          : 'Lanjut Beat ->';
    }
  }

  _emit() {
    this.onBeatChange && this.onBeatChange(this.getCurrentBeat());
  }
}
