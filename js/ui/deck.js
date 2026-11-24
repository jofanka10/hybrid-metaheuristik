// Card Wars 3D Tabletop Card-Deck Engine (v6)
// Features: Intro Stage before flipping Card I, 2-Phase Non-Mirrored Flip (zero backface bleed),
// 1-Color Unified Card Wars Deck, Fanned Hand, 9-Card Spread Modal, and Peek 3D Mode.

import { renderCardBackEmblem } from '../viz/svg-illustrator.js?v=7';

export const SLIDE_META = [
  {
    id: 'cover', num: '01', roman: 'I', suit: 'concept', suitSym: '◆', suitLabel: 'DEK PENGANTAR',
    shortTitle: '3 Simbol',
    title: 'Bagaimana Dua Algoritma Optimasi Bekerja Sama?',
    teaser: 'Tiga bentuk geometris (Kotak, Lingkaran, Corong) menjadi kunci memahami seluruh algoritma hybrid di dek ini.'
  },
  {
    id: 'intuition', num: '02', roman: 'II', suit: 'concept', suitSym: '◆', suitLabel: 'KONSEP PEMULA',
    shortTitle: 'Lembah Optimasi',
    title: 'Apa Itu Optimasi? Eksplorasi vs Eksploitasi',
    teaser: 'Bayangkan mencari lembah terdalam di bukit berkabut. Mengapa tebakan acak selalu terjebak di lubang dangkal?'
  },
  {
    id: 'taxonomy', num: '03', roman: 'III', suit: 'concept', suitSym: '◆', suitLabel: 'DUA POLA HYBRID',
    shortTitle: 'Estafet vs Tim',
    title: 'Mengapa Digabung? Pola B (Estafet) vs Pola C (Kerja Tim)',
    teaser: 'Menurut No Free Lunch Theorem, tidak ada satu algoritma terkuat untuk semua kasus. Bagaimana dua cara menggabungkannya?'
  },
  {
    id: 'mct-pso', num: '04', roman: 'IV', suit: 'mct', suitSym: '■', suitLabel: 'POLA B: MCT -> PSO',
    shortTitle: 'Pola B: MCT',
    title: 'Pola B: Susun Start Cerdas dengan MCT, Lalu Sempurnakan PSO',
    teaser: 'Bagaimana menyusun balok jadwal tugas ke mesin tercepat secara deterministik sebelum kawanan partikel PSO bekerja?'
  },
  {
    id: 'single-anatomy', num: '05', roman: 'V', suit: 'goa', suitSym: '●', suitLabel: 'GOA & ALO TUNGGAL',
    shortTitle: 'GOA & ALO',
    title: 'Mengenal Kawanan Belalang (GOA) & Corong Pasir (ALO)',
    teaser: 'Apa insting alami belalang dan undur-undur, dan celah apa yang muncul jika masing-masing bekerja sendirian?'
  },
  {
    id: 'hybrid-goa-alo', num: '06', roman: 'VI', suit: 'alo', suitSym: '▼', suitLabel: 'POLA C: HYBRID',
    shortTitle: 'Pivot L/2',
    title: 'Cara Hybrid GOA-ALO Saling Melengkapi & Pivot pada L/2',
    teaser: 'Mengapa mempercepat peluruhan parameter c menjadi separuh iterasi (L/2) menyelesaikan kelemahan GOA dan ALO?'
  },
  {
    id: 'lab-3d', num: '07', roman: 'VII', suit: 'goa', suitSym: '●', suitLabel: 'LAB SIMULASI 3D',
    shortTitle: 'Lab 3D & 2D',
    title: 'Uji Langsung: Laboratorium Simulasi 3D & 2D Interaktif',
    teaser: 'Ubah agen, iterasi, f, l, dan seed untuk menyaksikan Hybrid GOA-ALO menaklukkan lanskap multimodal secara live.'
  },
  {
    id: 'benchmarks', num: '08', roman: 'VIII', suit: 'alo', suitSym: '▼', suitLabel: 'BUKTI PAPER',
    shortTitle: 'Data Empiris',
    title: 'Bukti Empiris Paper Amaireh et al. (2023)',
    teaser: 'Seberapa kuat Hybrid GOA-ALO pada 32 fungsi klasik, CEC2015, dan sintesis antena nyata, serta apa trade-off waktunya?'
  },
  {
    id: 'synthesis', num: '09', roman: 'IX', suit: 'mct', suitSym: '■', suitLabel: 'KESIMPULAN',
    shortTitle: 'Pilih Pola',
    title: 'Kapan Memilih Pola B vs Pola C? & Daftar Pustaka',
    teaser: 'Cocokkan profil masalahmu di matriks keputusan untuk menentukan arsitektur hybrid paling tepat.'
  }
];

const STORAGE_KEY = 'soka_card_wars_opened_v6';

export function positionSlidingIndicator(container, activeBtn, indicator) {
  if (!container || !activeBtn || !indicator) return;
  const cRect = container.getBoundingClientRect();
  const bRect = activeBtn.getBoundingClientRect();
  indicator.style.width = `${bRect.width}px`;
  indicator.style.transform = `translateX(${bRect.left - cRect.left}px)`;
}

export class DeckController {
  constructor({ onSlideChange, onSpaceKey, onBeatNav, onPeekChange, onIntroChange } = {}) {
    this.slides = Array.from(document.querySelectorAll('.slide'));
    this.onSlideChange = onSlideChange;
    this.onSpaceKey = onSpaceKey;
    this.onBeatNav = onBeatNav;
    this.onPeekChange = onPeekChange;
    this.onIntroChange = onIntroChange;
    this.current = 0;
    this.isFaceDown = true;
    this.isIntro = true;
    this.spreadOpen = false;
    this.peekMode = false;
    this._flipTimer = null;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.openedCards = this._loadOpened();
    this._initUI();
    this._bindEvents();
    this._readInitialState();
  }

  _loadOpened() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
      if (Array.isArray(saved)) return new Set(saved);
    } catch {}
    return new Set();
  }

  _saveOpened() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(this.openedCards)));
    } catch {}
  }

  _initUI() {
    this.flipper = document.getElementById('card-flipper');
    this.cardBodyScroll = document.getElementById('card-body-scroll');
    this.frontPipSuit = document.getElementById('card-front-suit');
    this.frontPipNum = document.getElementById('card-front-num');
    this.frontPipRole = document.getElementById('card-front-role');
    this.flipToggleBtn = document.getElementById('card-flip-toggle');

    this.backEmblem = document.getElementById('card-back-emblem');
    this.backRole = document.getElementById('card-back-role');
    this.backTitle = document.getElementById('card-back-title');
    this.backTeaser = document.getElementById('card-back-teaser');
    this.backRevealBtn = document.getElementById('card-reveal-btn');

    this.hudCounter = document.getElementById('hud-opened-count');
    this.hudIntroBtn = document.getElementById('hud-intro-btn');
    this.hudPeekBtn = document.getElementById('hud-peek-btn');
    this.peekReturnBtn = document.getElementById('peek-return-btn');
    this.hudSpreadBtn = document.getElementById('hud-spread-btn');
    this.hudResetDeckBtn = document.getElementById('hud-reset-deck');
    this.hudRevealAllBtn = document.getElementById('hud-reveal-all');

    this.prevBtn = document.getElementById('hand-prev');
    this.nextBtn = document.getElementById('hand-next');
    this.handFan = document.getElementById('hand-fan');

    this.spreadModal = document.getElementById('table-spread-modal');
    this.spreadClose = document.getElementById('spread-close');
    this.spreadGrid = document.getElementById('spread-grid');

    this._renderHand();
    this._renderSpread();
  }

  _renderHand() {
    if (!this.handFan) return;
    const total = SLIDE_META.length;
    const mid = (total - 1) / 2;
    this.handFan.innerHTML = SLIDE_META.map((meta, idx) => {
      const opened = this.openedCards.has(idx);
      const rot = ((idx - mid) * 1.4).toFixed(1);
      // Unified 1-color deck emblem (gold on closed terracotta back, terracotta on opened parchment front)
      const pipColor = opened ? '#8C2D19' : '#FDE047';
      return `
        <button type="button" class="hand-card ${opened ? 'is-opened' : ''}" data-card-idx="${idx}"
                style="--fan-rot: ${rot}deg"
                aria-label="Kartu ${meta.roman}: ${meta.shortTitle} (${opened ? 'Terbuka' : 'Tertutup'})">
          <div class="hand-card-top">
            <span>${meta.roman}</span>
            <span style="color:${pipColor}">${meta.suitSym}</span>
          </div>
          <div class="hand-card-title">${meta.shortTitle}</div>
          <div class="hand-card-status">${opened ? 'TERBUKA' : 'TERTUTUP'}</div>
        </button>
      `;
    }).join('');

    this.handButtons = Array.from(this.handFan.querySelectorAll('.hand-card'));
    this.handButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.cardIdx);
        if (this.isIntro) this.setIntro(false, { silent: true });
        if (idx === this.current && this.isFaceDown) {
          this.revealCurrent();
        } else {
          this.selectCard(idx);
        }
      });
    });
  }

  _renderSpread() {
    if (!this.spreadGrid) return;
    this.spreadGrid.innerHTML = SLIDE_META.map((meta, idx) => {
      const opened = this.openedCards.has(idx);
      return `
        <button type="button" class="spread-card ${opened ? 'is-opened' : 'is-closed'}" data-spread-idx="${idx}">
          <div class="flex items-center justify-between font-mono-num text-[11px] font-bold">
            <span>KARTU ${meta.roman} (${meta.num})</span>
            <span>${meta.suitSym} ${opened ? 'TERBUKA' : 'TERTUTUP'}</span>
          </div>
          <div class="my-1.5">
            <div class="font-display font-bold text-[15px] leading-snug">${meta.title}</div>
            <p class="text-[12px] mt-1 mb-0" style="opacity:0.88">${meta.teaser}</p>
          </div>
          <div class="font-mono-num text-[10.5px] font-bold">
            ${opened ? 'Mainkan kartu ->' : 'Lempar & balik kartu ->'}
          </div>
        </button>
      `;
    }).join('');

    this.spreadGrid.querySelectorAll('[data-spread-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.spreadIdx);
        this.toggleSpread(false);
        if (this.isIntro) this.setIntro(false, { silent: true });
        this.selectCard(idx, { forceFaceDownFirst: !this.openedCards.has(idx) });
      });
    });
  }

  _syncHudAndHand() {
    if (this.hudCounter) this.hudCounter.textContent = `Kartu: ${this.openedCards.size} / ${SLIDE_META.length}`;
    this._renderHand();
    this._renderSpread();
    this.handButtons?.forEach((btn, i) => {
      if (!this.isIntro && i === this.current) btn.setAttribute('aria-current', 'step');
      else btn.removeAttribute('aria-current');
    });
    if (this.prevBtn) this.prevBtn.disabled = !this.isIntro && this.current === 0;
    if (this.nextBtn) this.nextBtn.disabled = !this.isIntro && this.current === SLIDE_META.length - 1;
  }

  setIntro(active, { silent = false } = {}) {
    this.isIntro = !!active;
    document.body.classList.toggle('is-intro', this.isIntro);
    this._syncHudAndHand();
    if (!silent) {
      this.onIntroChange && this.onIntroChange(this.isIntro);
    }
  }

  togglePeek(force = null) {
    const next = force !== null ? !!force : !this.peekMode;
    this.peekMode = next;
    document.body.classList.toggle('is-peeking-table', next);
    if (this.hudPeekBtn) {
      this.hudPeekBtn.textContent = next ? 'Kembali (T)' : 'Intip Meja 3D (T)';
    }
    this.onPeekChange && this.onPeekChange(next);
  }

  _bindEvents() {
    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());
    this.backRevealBtn?.addEventListener('click', () => this.revealCurrent());
    this.flipToggleBtn?.addEventListener('click', () => {
      const nextFaceDown = !this.isFaceDown;
      this.setFaceDown(nextFaceDown, { animate: true });
      this.onSlideChange && this.onSlideChange(this.current, SLIDE_META[this.current], nextFaceDown, false);
    });

    document.getElementById('card-back-face')?.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      this.revealCurrent();
    });

    this.hudIntroBtn?.addEventListener('click', () => {
      if (this.peekMode) this.togglePeek(false);
      if (this.spreadOpen) this.toggleSpread(false);
      this.setIntro(true);
    });

    this.hudPeekBtn?.addEventListener('click', () => this.togglePeek());
    this.peekReturnBtn?.addEventListener('click', () => this.togglePeek(false));
    this.hudSpreadBtn?.addEventListener('click', () => {
      if (this.peekMode) this.togglePeek(false);
      this.toggleSpread(!this.spreadOpen);
    });
    this.spreadClose?.addEventListener('click', () => this.toggleSpread(false));
    this.spreadModal?.addEventListener('click', (e) => {
      if (e.target === this.spreadModal) this.toggleSpread(false);
    });

    this.hudResetDeckBtn?.addEventListener('click', () => {
      if (this.peekMode) this.togglePeek(false);
      this.openedCards = new Set();
      this._saveOpened();
      this.setFaceDown(true, { animate: false });
      this.setIntro(true);
    });

    this.hudRevealAllBtn?.addEventListener('click', () => {
      if (this.peekMode) this.togglePeek(false);
      if (this.isIntro) this.setIntro(false, { silent: true });
      SLIDE_META.forEach((_m, i) => this.openedCards.add(i));
      this._saveOpened();
      this.setFaceDown(false, { animate: true });
      this._syncHudAndHand();
      this.onSlideChange && this.onSlideChange(this.current, SLIDE_META[this.current], false, false);
    });

    document.addEventListener('keydown', (e) => {
      const tag = document.activeElement?.tagName;
      const isEditing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

      if (e.key === 'Escape') {
        if (this.spreadOpen) { e.preventDefault(); this.toggleSpread(false); return; }
        if (this.peekMode) { e.preventDefault(); this.togglePeek(false); return; }
      }
      if (isEditing) return;

      if ((e.key === 't' || e.key === 'T') && !e.ctrlKey && !e.metaKey && !this.spreadOpen) {
        e.preventDefault();
        this.togglePeek();
      } else if ((e.key === 'g' || e.key === 'G') && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (this.peekMode) this.togglePeek(false);
        this.toggleSpread(!this.spreadOpen);
      } else if (this.isIntro && !this.spreadOpen && !this.peekMode && (e.key === 'Enter' || e.key === ' ')) {
        if (document.activeElement?.tagName !== 'BUTTON') {
          e.preventDefault();
          this.onSpaceKey && this.onSpaceKey();
        }
      } else if (e.key === 'Enter' && this.isFaceDown && !this.spreadOpen && !this.peekMode && !this.isIntro) {
        e.preventDefault();
        this.revealCurrent();
      } else if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !this.spreadOpen && !this.isIntro) {
        e.preventDefault();
        if (this.peekMode) this.togglePeek(false);
        if (this.isFaceDown) this.revealCurrent();
        else {
          this.setFaceDown(true, { animate: true });
          this.onSlideChange && this.onSlideChange(this.current, SLIDE_META[this.current], true, false);
        }
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        this.next();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        this.prev();
      } else if (e.key >= '1' && e.key <= '9' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        if (this.isIntro) this.setIntro(false, { silent: true });
        this.selectCard(Number(e.key) - 1);
      } else if ((e.key === 'n' || e.key === 'N') && !e.ctrlKey && !e.metaKey && !this.spreadOpen && !this.peekMode && !this.isIntro && !this.isFaceDown) {
        e.preventDefault();
        this.onBeatNav && this.onBeatNav(1);
      } else if ((e.key === 'b' || e.key === 'B') && !e.ctrlKey && !e.metaKey && !this.spreadOpen && !this.peekMode && !this.isIntro && !this.isFaceDown) {
        e.preventDefault();
        this.onBeatNav && this.onBeatNav(-1);
      } else if (e.key === ' ' && !this.spreadOpen && !this.peekMode && !this.isIntro && document.activeElement?.tagName !== 'BUTTON') {
        e.preventDefault();
        if (this.isFaceDown) this.revealCurrent();
        else this.onSpaceKey && this.onSpaceKey();
      }
    });

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      const idx = SLIDE_META.findIndex((m) => m.id === hash);
      if (idx >= 0) {
        this.setIntro(false, { silent: true });
        this.openedCards.add(idx);
        this._saveOpened();
        this.selectCard(idx, { updateHash: false, forceFaceDownFirst: false, animateDeal: false });
      }
    });
  }

  _readInitialState() {
    const hash = window.location.hash.replace('#', '');
    const idx = SLIDE_META.findIndex((m) => m.id === hash);
    if (idx >= 0) {
      // Direct hash link jumps directly to that card opened
      this.setIntro(false, { silent: true });
      this.openedCards.add(idx);
      this._saveOpened();
      this.selectCard(idx, { updateHash: false, forceFaceDownFirst: false, animateDeal: false });
    } else {
      // Fresh visit starts cleanly on Scene 0: Intro at 3D Table with Sir Pip BEFORE flipping any card!
      this.current = 0;
      this._prepareCardDOM(0);
      this.setFaceDown(true, { animate: false });
      this.setIntro(true);
    }
  }

  _prepareCardDOM(target) {
    const meta = SLIDE_META[target];
    this.slides.forEach((slide, i) => {
      const active = i === target;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    if (this.cardBodyScroll) this.cardBodyScroll.scrollTop = 0;

    if (this.frontPipSuit) this.frontPipSuit.textContent = meta.suitSym;
    if (this.frontPipNum) this.frontPipNum.textContent = `KARTU ${meta.roman} / IX`;
    if (this.frontPipRole) this.frontPipRole.textContent = meta.suitLabel;

    renderCardBackEmblem(this.backEmblem, { suit: meta.suit, roman: meta.roman });
    if (this.backRole) this.backRole.textContent = `KARTU ${meta.roman}  /  ${meta.suitLabel}`;
    if (this.backTitle) this.backTitle.textContent = meta.title;
    if (this.backTeaser) this.backTeaser.textContent = meta.teaser;
  }

  toggleSpread(open) {
    this.spreadOpen = open;
    if (!this.spreadModal) return;
    this.spreadModal.classList.toggle('is-open', open);
    this.hudSpreadBtn?.setAttribute('aria-expanded', String(open));
    if (open) {
      this._renderSpread();
      this.spreadClose?.focus();
    } else {
      this.hudSpreadBtn?.focus();
    }
  }

  // 2-Phase Non-Mirrored Card Flip: rotates to edge (86deg), swaps display:none, pops back (-86deg -> 0deg)
  setFaceDown(faceDown, { animate = false } = {}) {
    const changed = faceDown !== this.isFaceDown;
    this.isFaceDown = faceDown;
    if (this.flipToggleBtn) {
      this.flipToggleBtn.textContent = faceDown ? 'Buka Kartu (F)' : 'Balik Kartu (F)';
    }

    if (this._flipTimer) {
      clearTimeout(this._flipTimer);
      this._flipTimer = null;
    }

    if (!this.flipper) return;
    this.flipper.classList.remove('is-flipping-out', 'is-flipping-in');

    if (animate && changed && !this.prefersReducedMotion) {
      this.flipper.classList.add('is-flipping-out');
      this._flipTimer = setTimeout(() => {
        this._flipTimer = null;
        this.flipper.classList.remove('is-flipping-out');
        this.flipper.classList.toggle('is-facedown', faceDown);
        void this.flipper.offsetWidth;
        this.flipper.classList.add('is-flipping-in');
      }, 135);
    } else {
      this.flipper.classList.toggle('is-facedown', faceDown);
    }
  }

  revealCurrent() {
    if (this.peekMode) this.togglePeek(false);
    if (this.isIntro) this.setIntro(false, { silent: true });
    this.openedCards.add(this.current);
    this._saveOpened();
    this.setFaceDown(false, { animate: true });
    this._syncHudAndHand();
    this.onSlideChange && this.onSlideChange(this.current, SLIDE_META[this.current], false, false);
  }

  prev() {
    if (this.isIntro) {
      this.setIntro(false, { silent: true });
      this.selectCard(0, { forceFaceDownFirst: true });
      return;
    }
    if (this.current > 0) this.selectCard(this.current - 1);
  }

  next() {
    if (this.isIntro) {
      this.setIntro(false, { silent: true });
      this.selectCard(0, { forceFaceDownFirst: true });
      return;
    }
    if (this.current < SLIDE_META.length - 1) this.selectCard(this.current + 1);
  }

  goTo(index) {
    if (this.isIntro) this.setIntro(false, { silent: true });
    this.openedCards.add(index);
    this._saveOpened();
    this.selectCard(index, { forceFaceDownFirst: false, animateDeal: true });
  }

  selectCard(index, { updateHash = true, forceFaceDownFirst = null, animateDeal = true } = {}) {
    if (this.peekMode) this.togglePeek(false);
    if (this.isIntro) this.setIntro(false, { silent: true });
    const target = Math.max(0, Math.min(SLIDE_META.length - 1, index));
    const alreadyOpened = this.openedCards.has(target);
    const showBackFirst = forceFaceDownFirst !== null ? forceFaceDownFirst : !alreadyOpened;

    this.current = target;
    const meta = SLIDE_META[target];
    this._prepareCardDOM(target);

    if (showBackFirst) {
      this.setFaceDown(true, { animate: false });
    } else {
      this.setFaceDown(false, { animate: false });
    }

    if (animateDeal && !this.prefersReducedMotion && this.flipper) {
      this.flipper.classList.remove('is-dealing', 'is-flipping-in');
      void this.flipper.offsetWidth;
      this.flipper.classList.add('is-dealing');
    }

    if (updateHash && window.location.hash !== `#${meta.id}`) {
      history.replaceState(null, '', `#${meta.id}`);
    }

    this._syncHudAndHand();
    this.onSlideChange && this.onSlideChange(target, meta, showBackFirst, animateDeal);
  }
}
