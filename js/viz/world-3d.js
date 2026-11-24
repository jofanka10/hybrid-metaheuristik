// Full-Viewport 3D Adventure Time: Card Wars Tabletop World & 3D Toon Butler ("Sir Pip")
// Single Three.js WebGL scene with inverted-hull toon outlines, dynamic canvas facial expressions,
// flying 3D card deal animation, smooth 3-preset camera lerp, GPU pause/resume handoff for Card VII,
// and automatic 2D Cartoon SVG fallback when WebGL is unavailable or lost.

import { BUTLER_MOODS, renderButler2DSvg } from './svg-illustrator.js?v=7';

let cachedThree = null;

async function loadThree() {
  if (cachedThree) return cachedThree;
  try {
    cachedThree = await import('three');
    return cachedThree;
  } catch {
    return null;
  }
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

const SUIT_COLOR_MAP = {
  mct: '#0F766E',
  goa: '#1D4ED8',
  alo: '#B91C1C',
  concept: '#D97706'
};

// ============================================================================
// AUTOMATIC 2D CARTOON SVG CARD WARS TABLETOP + BUTLER FALLBACK
// ============================================================================
export function render2DFallbackWorld(container, { mood = 'greet', suit = 'concept', roman = 'I', faceDown = false } = {}) {
  if (!container) return;
  const accent = SUIT_COLOR_MAP[suit] || '#D97706';
  const safeMood = BUTLER_MOODS.includes(mood) ? mood : 'greet';

  container.innerHTML = `
    <div class="world-2d-stage" data-mood="${safeMood}">
      <svg viewBox="0 0 1440 820" preserveAspectRatio="xMidYMid slice" class="w-full h-full block" role="img" aria-label="Panggung meja Card Wars 2D fallback dengan Butler Sir Pip">
        <defs>
          <linearGradient id="cw2d-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#48B2F2"/>
            <stop offset="100%" stop-color="#9BE3FF"/>
          </linearGradient>
          <linearGradient id="cw2d-sea" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1E88C7"/>
            <stop offset="100%" stop-color="#2CA4D8"/>
          </linearGradient>
        </defs>

        <!-- Sunny Cartoon Sky + Soft Clouds -->
        <rect x="0" y="0" width="1440" height="390" fill="url(#cw2d-sky)"/>
        <g fill="#FFFFFF" opacity="0.82">
          <ellipse cx="220" cy="110" rx="74" ry="26"/>
          <ellipse cx="268" cy="100" rx="52" ry="24"/>
          <ellipse cx="1160" cy="128" rx="88" ry="28"/>
          <ellipse cx="1220" cy="116" rx="56" ry="22"/>
        </g>

        <!-- Distant Islands & Sea -->
        <path d="M 960 322 Q 1030 238 1110 322 Z" fill="#5D7D7E" stroke="#1A1816" stroke-width="3"/>
        <path d="M 1180 322 Q 1235 262 1295 322 Z" fill="#6F948D" stroke="#1A1816" stroke-width="3"/>
        <rect x="0" y="320" width="1440" height="86" fill="url(#cw2d-sea)" stroke="#1A1816" stroke-width="3"/>
        <line x1="0" y1="406" x2="1440" y2="406" stroke="#E0F7FF" stroke-width="7"/>

        <!-- Warm Sandy Beach -->
        <rect x="0" y="406" width="1440" height="414" fill="#F6DF98"/>
        <g fill="#1F9D68" stroke="#1A1816" stroke-width="2.5" stroke-linejoin="round">
          <path d="M 290 424 L 280 390 L 298 412 L 306 382 L 315 412 L 330 392 L 322 424 Z"/>
          <path d="M 1120 434 L 1112 402 L 1128 422 L 1138 394 L 1146 422 L 1160 404 L 1152 434 Z"/>
        </g>

        <!-- Stacked Tire Pedestal -->
        <ellipse cx="720" cy="744" rx="190" ry="38" fill="rgba(26,24,22,0.18)"/>
        <rect x="572" y="618" width="296" height="122" rx="22" fill="#2E3B37" stroke="#1A1816" stroke-width="5"/>
        <line x1="572" y1="678" x2="868" y2="678" stroke="#1A1816" stroke-width="5"/>

        <!-- Yellow Card Wars Wooden Tabletop -->
        <polygon points="210,434 1230,434 1345,634 95,634" fill="#F2C94C" stroke="#1A1816" stroke-width="5" stroke-linejoin="round"/>
        <rect x="95" y="634" width="1250" height="24" rx="4" fill="#C78A1F" stroke="#1A1816" stroke-width="5"/>

        <!-- Dual-Lane Card Wars Board -->
        <polygon points="480,468 720,468 720,598 430,598" fill="#2B6CB0" stroke="#1A1816" stroke-width="4"/>
        <polygon points="720,468 960,468 1010,598 720,598" fill="#B7791F" stroke="#1A1816" stroke-width="4"/>

        <!-- Lemonade Pitcher & Deck Box Props on Far Edge -->
        <g stroke="#1A1816" stroke-width="3.2" stroke-linejoin="round">
          <rect x="615" y="346" width="66" height="86" rx="12" fill="#FEF08A"/>
          <path d="M 681 364 C 704 364 704 408 681 408" fill="none" stroke="#1A1816" stroke-width="5"/>
          <circle cx="672" cy="348" r="14" fill="#FACC15"/>
          <rect x="815" y="376" width="76" height="56" rx="6" fill="#C49A6C"/>
          <rect x="920" y="388" width="38" height="44" rx="6" fill="#FFFFFF"/>
        </g>

        <!-- Active 2D Card Resting on Center Playmat (Unified Card Wars Deck Color) -->
        <g transform="translate(720 532) rotate(-3)">
          <rect x="-46" y="-56" width="92" height="112" rx="10" fill="${faceDown ? '#8C2D19' : '#FFFDF7'}" stroke="#1A1816" stroke-width="4"/>
          <rect x="-36" y="-46" width="72" height="92" rx="6" fill="none" stroke="${faceDown ? '#FDE047' : '#8C2D19'}" stroke-width="3"/>
          <text x="0" y="10" text-anchor="middle" font-family="Fredoka, Syne, sans-serif" font-size="30" font-weight="700" fill="${faceDown ? '#FDE047' : '#1A1816'}">${roman}</text>
        </g>
      </svg>

      <!-- 2D Sir Pip Butler Seated at Upper-Left of Table -->
      <div class="world-2d-butler" id="world-2d-butler-mount"></div>
    </div>
  `;

  const mount = container.querySelector('#world-2d-butler-mount');
  renderButler2DSvg(mount, { mood: safeMood, compact: false });
}

// ============================================================================
// THREE.JS HELPERS: 3-BAND TOON GRADIENT, OUTLINES & CANVAS TEXTURES
// ============================================================================
function createToonGradientMap(THREE) {
  const data = new Uint8Array([155, 222, 255]);
  const tex = new THREE.DataTexture(data, 3, 1, THREE.RedFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

function addToonOutline(THREE, mesh, thickness = 1.06) {
  const mat = new THREE.MeshBasicMaterial({ color: 0x1A1816, side: THREE.BackSide });
  const outline = new THREE.Mesh(mesh.geometry, mat);
  outline.scale.setScalar(thickness);
  mesh.add(outline);
  return outline;
}

function createSkyTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#3EA8EF');
  grad.addColorStop(0.58, '#7FD7FC');
  grad.addColorStop(1, '#BCEEFF');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Soft stylized Adventure Time clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  const drawCloud = (cx, cy, s) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 24 * s, 0, Math.PI * 2);
    ctx.arc(cx + 26 * s, cy - 6 * s, 28 * s, 0, Math.PI * 2);
    ctx.arc(cx + 54 * s, cy, 22 * s, 0, Math.PI * 2);
    ctx.fill();
  };
  drawCloud(78, 96, 1.0);
  drawCloud(360, 128, 1.15);
  drawCloud(215, 62, 0.72);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createTabletopTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#F4CA4C';
  ctx.fillRect(0, 0, 512, 256);

  // Subtle wood plank seams
  ctx.strokeStyle = 'rgba(176, 122, 20, 0.35)';
  ctx.lineWidth = 3;
  for (let y = 32; y < 256; y += 44) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Stylized warm flower decals inspired by Adventure Time: Card Wars beach table
  const drawFlower = (cx, cy, r) => {
    ctx.fillStyle = 'rgba(222, 162, 34, 0.48)';
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5;
      ctx.beginPath();
      ctx.ellipse(cx + Math.cos(a) * r * 0.7, cy + Math.sin(a) * r * 0.7, r * 0.45, r * 0.32, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#F8DE7E';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.34, 0, Math.PI * 2);
    ctx.fill();
  };
  drawFlower(78, 134, 34);
  drawFlower(432, 146, 36);
  drawFlower(122, 54, 20);
  drawFlower(396, 62, 22);

  // Bold outer table border
  ctx.strokeStyle = '#1A1816';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 502, 246);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createBoardLaneTexture(THREE, bgHex, lineHex) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = lineHex;
  ctx.lineWidth = 4;
  for (let i = 64; i < 256; i += 64) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke();
  }
  ctx.strokeStyle = '#1A1816';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 246, 246);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function drawButlerFaceCanvas(ctx, mood, blinking) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Mint-cream face screen panel
  ctx.fillStyle = '#D7F5EA';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#1A1816';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, W - 10, H - 10);

  // Soft rosy cheeks
  ctx.fillStyle = 'rgba(251, 113, 133, 0.55)';
  ctx.beginPath(); ctx.ellipse(54, 118, 17, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(202, 118, 17, 10, 0, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = '#1A1816';
  ctx.fillStyle = '#1A1816';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Eyes
  if (blinking) {
    ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(64, 82); ctx.lineTo(94, 82); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(162, 82); ctx.lineTo(192, 82); ctx.stroke();
  } else if (mood === 'greet' || mood === 'proud') {
    ctx.lineWidth = 9;
    ctx.beginPath(); ctx.arc(80, 90, 16, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    ctx.beginPath(); ctx.arc(176, 90, 16, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  } else if (mood === 'aha') {
    ctx.beginPath(); ctx.arc(80, 82, 15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(176, 82, 15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FDE047';
    ctx.beginPath(); ctx.arc(74, 75, 5.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(170, 75, 5.5, 0, Math.PI * 2); ctx.fill();
  } else {
    const lookShift = mood === 'point' ? 7 : 0;
    ctx.beginPath(); ctx.arc(80 + lookShift, 84, 12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(176 + lookShift, 84, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath(); ctx.arc(84 + lookShift, 79, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(180 + lookShift, 79, 4, 0, Math.PI * 2); ctx.fill();

    // Eyebrows for deal / think
    ctx.lineWidth = 7;
    if (mood === 'deal') {
      ctx.beginPath(); ctx.moveTo(58, 56); ctx.lineTo(98, 66); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(198, 56); ctx.lineTo(158, 66); ctx.stroke();
    } else if (mood === 'think') {
      ctx.beginPath(); ctx.moveTo(60, 62); ctx.lineTo(96, 60); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(160, 56); ctx.quadraticCurveTo(176, 44, 196, 58); ctx.stroke();
    }
  }

  // Mouth
  ctx.fillStyle = '#1A1816';
  ctx.strokeStyle = '#1A1816';
  ctx.lineWidth = 8;
  if (mood === 'greet' || mood === 'aha') {
    ctx.beginPath();
    ctx.moveTo(92, 124);
    ctx.quadraticCurveTo(128, mood === 'aha' ? 172 : 162, 164, 124);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FB7185';
    ctx.beginPath();
    ctx.ellipse(128, 144, 18, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (mood === 'point') {
    ctx.beginPath(); ctx.ellipse(128, 134, 20, 15, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FB7185';
    ctx.beginPath(); ctx.ellipse(128, 140, 10, 6, 0, 0, Math.PI * 2); ctx.fill();
  } else if (mood === 'think') {
    ctx.beginPath();
    ctx.moveTo(98, 136);
    ctx.quadraticCurveTo(114, 124, 128, 136);
    ctx.quadraticCurveTo(142, 148, 158, 132);
    ctx.stroke();
  } else if (mood === 'deal') {
    ctx.beginPath();
    ctx.moveTo(96, 132);
    ctx.quadraticCurveTo(132, 148, 164, 122);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(92, 126);
    ctx.quadraticCurveTo(128, 156, 164, 126);
    ctx.stroke();
  }
}

function drawPlayingCardTexture(ctx, { suit = 'concept', roman = 'I', isBack = false }) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const unifiedBack = '#8C2D19';
  const unifiedTrim = '#FDE047';

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = isBack ? unifiedBack : '#FFFDF7';
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = '#1A1816';
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, W - 14, H - 14);

  ctx.strokeStyle = isBack ? unifiedTrim : unifiedBack;
  ctx.lineWidth = 8;
  ctx.strokeRect(24, 24, W - 48, H - 48);

  // Unified crest diamond on back, clean suit emblem on front
  ctx.fillStyle = isBack ? unifiedTrim : unifiedBack;
  ctx.beginPath();
  if (isBack) {
    ctx.moveTo(W / 2, H / 2 - 68);
    ctx.lineTo(W / 2 + 52, H / 2 - 14);
    ctx.lineTo(W / 2, H / 2 + 40);
    ctx.lineTo(W / 2 - 52, H / 2 - 14);
    ctx.closePath();
    ctx.fill();
  } else if (suit === 'mct') {
    ctx.fillRect(W / 2 - 42, H / 2 - 58, 84, 84);
  } else if (suit === 'goa') {
    ctx.arc(W / 2, H / 2 - 16, 46, 0, Math.PI * 2);
    ctx.fill();
  } else if (suit === 'alo') {
    ctx.moveTo(W / 2 - 52, H / 2 - 52);
    ctx.lineTo(W / 2 + 52, H / 2 - 52);
    ctx.lineTo(W / 2, H / 2 + 44);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.moveTo(W / 2, H / 2 - 64);
    ctx.lineTo(W / 2 + 48, H / 2 - 16);
    ctx.lineTo(W / 2, H / 2 + 32);
    ctx.lineTo(W / 2 - 48, H / 2 - 16);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = isBack ? unifiedBack : '#FFFDF7';
  ctx.font = '700 44px Fredoka, Syne, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(roman, W / 2, H / 2 - 15);

  ctx.fillStyle = isBack ? unifiedTrim : '#1A1816';
  ctx.font = '700 22px JetBrains Mono, monospace';
  ctx.fillText(isBack ? 'DEK SOKA' : `KARTU ${roman}`, W / 2, H - 52);
}

// ============================================================================
// MAIN FULL-VIEWPORT 3D CARD WARS WORLD CLASS
// ============================================================================
export class CardWarsWorld {
  constructor({ webglContainer, fallbackContainer, onModeChange } = {}) {
    this.webglContainer = webglContainer;
    this.fallbackContainer = fallbackContainer;
    this.onModeChange = onModeChange;
    this.mode = 'loading'; // 'webgl' | '2d'
    this.paused = false;
    this.rafId = null;
    this.clockStart = performance.now();
    this.mood = 'greet';
    this.cameraMode = 'focus'; // 'overview' | 'focus' | 'peek'
    this.cardState = { suit: 'concept', roman: 'I', faceDown: false };
    this.prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Deal flight animation state
    this.dealAnim = { active: false, t: 1 };
    this.shakeAmp = 0;
    this.blinkTimer = 0;
    this.isBlinking = false;
    this.mouseNdc = { x: 0, y: 0 };

    // Smooth camera lerp targets (starts in heroic intro angle looking across table at Sir Pip)
    this.cameraMode = 'intro';
    this.camTargetPos = { x: 0.15, y: 2.55, z: 5.55 };
    this.camTargetLook = { x: -0.45, y: 0.90, z: -0.60 };
    this.camCurrentLook = { x: -0.45, y: 0.90, z: -0.60 };
  }

  async init(prefer2D = false) {
    const canWebGL = !prefer2D && hasWebGL();
    const THREE = canWebGL ? await loadThree() : null;

    if (!THREE || !this.webglContainer) {
      this._activate2DFallback();
      return;
    }

    try {
      this.THREE = THREE;
      this.webglContainer.innerHTML = '';
      if (this.fallbackContainer) this.fallbackContainer.classList.add('hidden');
      this.webglContainer.classList.remove('hidden');

      const w = Math.max(320, window.innerWidth);
      const h = Math.max(240, window.innerHeight);

      this.scene = new THREE.Scene();
      this.scene.background = createSkyTexture(THREE);

      this.camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 120);
      this.camera.position.set(this.camTargetPos.x, this.camTargetPos.y, this.camTargetPos.z);
      this.camera.lookAt(this.camCurrentLook.x, this.camCurrentLook.y, this.camCurrentLook.z);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      this.renderer.setSize(w, h);
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.webglContainer.appendChild(this.renderer.domElement);

      // Graceful WebGL context loss fallback
      this.renderer.domElement.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        this._activate2DFallback();
      });

      this.gradMap = createToonGradientMap(THREE);
      this._setupLights();
      this._buildEnvironment();
      this._buildCardWarsTable();
      this._buildButlerSirPip();
      this._buildActiveCardAndParticles();

      this.mode = 'webgl';
      this.onModeChange && this.onModeChange('webgl');

      window.addEventListener('mousemove', this._onMouseMove, { passive: true });
      this._startLoop();
    } catch {
      this._activate2DFallback();
    }
  }

  _onMouseMove = (e) => {
    this.mouseNdc.x = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
    this.mouseNdc.y = (e.clientY / Math.max(1, window.innerHeight)) * 2 - 1;
  };

  _toonMat(hex) {
    return new this.THREE.MeshToonMaterial({ color: hex, gradientMap: this.gradMap });
  }

  _setupLights() {
    const THREE = this.THREE;
    const amb = new THREE.AmbientLight(0xFFFDF5, 1.15);
    this.scene.add(amb);

    const sun = new THREE.DirectionalLight(0xFFF8DC, 1.65);
    sun.position.set(6, 11, 7);
    this.scene.add(sun);

    const rim = new THREE.DirectionalLight(0x7DD3FC, 0.55);
    rim.position.set(-7, 5, -5);
    this.scene.add(rim);
  }

  _buildEnvironment() {
    const THREE = this.THREE;

    // Sandy beach floor
    const sand = new THREE.Mesh(new THREE.PlaneGeometry(70, 34), this._toonMat(0xF6DF98));
    sand.rotation.x = -Math.PI / 2;
    sand.position.set(0, -1.55, 2);
    this.scene.add(sand);

    // Distant calm ocean strip
    const sea = new THREE.Mesh(new THREE.PlaneGeometry(90, 26), this._toonMat(0x1E88C7));
    sea.rotation.x = -Math.PI / 2;
    sea.position.set(0, -1.52, -23);
    this.scene.add(sea);

    // Foam shoreline band
    const foam = new THREE.Mesh(new THREE.PlaneGeometry(90, 0.9), new THREE.MeshBasicMaterial({ color: 0xE0F7FF }));
    foam.rotation.x = -Math.PI / 2;
    foam.position.set(0, -1.50, -10.1);
    this.scene.add(foam);

    // 3 Cartoon Distant Island Rocks
    [
      { x: -7.5, z: -15.5, r: 2.3, h: 2.4, c: 0x5D7D7E },
      { x: 5.8, z: -16.8, r: 2.7, h: 2.8, c: 0x678B87 },
      { x: 9.8, z: -14.4, r: 1.7, h: 1.9, c: 0x587778 }
    ].forEach((rock) => {
      const m = new THREE.Mesh(new THREE.ConeGeometry(rock.r, rock.h, 6), this._toonMat(rock.c));
      m.position.set(rock.x, -1.52 + rock.h * 0.42, rock.z);
      addToonOutline(THREE, m, 1.045);
      this.scene.add(m);
    });

    // Stylized emerald grass tufts on beach
    const grassGeo = new THREE.ConeGeometry(0.16, 0.62, 4);
    const grassMat = this._toonMat(0x1E9E66);
    [[-4.2, -5.8], [-3.8, -5.5], [4.1, -6.1], [4.5, -5.7], [-1.6, -6.5], [2.4, -6.3]].forEach(([gx, gz]) => {
      const blade = new THREE.Mesh(grassGeo, grassMat);
      blade.position.set(gx, -1.25, gz);
      blade.rotation.z = (gx % 2) * 0.14;
      addToonOutline(THREE, blade, 1.09);
      this.scene.add(blade);
    });
  }

  _buildCardWarsTable() {
    const THREE = this.THREE;
    const tableGroup = new THREE.Group();

    // Stacked dark charcoal/teal tire pedestal (inspired by Card Wars beach table)
    const tireMat = this._toonMat(0x2E3B37);
    for (let i = 0; i < 2; i++) {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.48, 0.72, 18), tireMat);
      tire.position.set(0, -1.16 + i * 0.70, -0.35);
      addToonOutline(THREE, tire, 1.04);
      tableGroup.add(tire);
    }

    // Main Yellow-Gold Card Wars Wooden Tabletop
    const topTex = createTabletopTexture(THREE);
    const edgeMat = this._toonMat(0xC78A1F);
    const topMat = new THREE.MeshToonMaterial({ map: topTex, gradientMap: this.gradMap });
    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(6.8, 0.28, 3.65),
      [edgeMat, edgeMat, topMat, edgeMat, edgeMat, edgeMat]
    );
    tableTop.position.set(0, 0.04, -0.35);
    addToonOutline(THREE, tableTop, 1.018);
    tableGroup.add(tableTop);

    // Dual-Lane Card Wars Battle Board on Tabletop
    const blueLane = new THREE.Mesh(
      new THREE.BoxGeometry(1.56, 0.06, 1.72),
      new THREE.MeshToonMaterial({ map: createBoardLaneTexture(THREE, '#2B6CB0', '#60A5FA'), gradientMap: this.gradMap })
    );
    blueLane.position.set(-0.79, 0.21, -0.25);
    tableGroup.add(blueLane);

    const amberLane = new THREE.Mesh(
      new THREE.BoxGeometry(1.56, 0.06, 1.72),
      new THREE.MeshToonMaterial({ map: createBoardLaneTexture(THREE, '#B7791F', '#F6AD55'), gradientMap: this.gradMap })
    );
    amberLane.position.set(0.79, 0.21, -0.25);
    tableGroup.add(amberLane);

    // Far-Edge Props: Lemonade Pitcher, Card Box, 2 Miniature Mugs
    // 1. Lemonade Pitcher
    const pitcherGroup = new THREE.Group();
    const pitcherBody = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.76, 12), this._toonMat(0xFEF08A));
    pitcherBody.position.y = 0.38;
    addToonOutline(THREE, pitcherBody, 1.07);
    pitcherGroup.add(pitcherBody);
    const lemon = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.05, 10), this._toonMat(0xFACC15));
    lemon.rotation.z = Math.PI / 3;
    lemon.position.set(0.24, 0.76, 0.04);
    addToonOutline(THREE, lemon, 1.1);
    pitcherGroup.add(lemon);
    pitcherGroup.position.set(-0.45, 0.18, -1.65);
    tableGroup.add(pitcherGroup);

    // 2. Deck Storage Box
    const deckBox = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.42, 0.48), this._toonMat(0xC49A6C));
    deckBox.position.set(0.85, 0.39, -1.65);
    deckBox.rotation.y = -0.14;
    addToonOutline(THREE, deckBox, 1.06);
    tableGroup.add(deckBox);

    // 3. Two Tiny Cartoon Mugs
    const mug1 = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.15, 0.32, 10), this._toonMat(0xFFFDF7));
    mug1.position.set(1.62, 0.34, -1.58);
    addToonOutline(THREE, mug1, 1.08);
    tableGroup.add(mug1);

    const mug2 = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.15, 0.32, 10), this._toonMat(0xFDE68A));
    mug2.position.set(2.05, 0.34, -1.52);
    addToonOutline(THREE, mug2, 1.08);
    tableGroup.add(mug2);

    this.scene.add(tableGroup);
  }

  _buildButlerSirPip() {
    const THREE = this.THREE;
    this.butlerRoot = new THREE.Group();
    // Seated clearly across the far-left edge of the table so visible even while Shorts stage is open!
    this.butlerRoot.position.set(-2.42, 0.22, -1.58);
    this.butlerRoot.rotation.y = 0.42;

    // Chair seat under Butler
    const stool = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.16, 0.9), this._toonMat(0xF1F5F9));
    stool.position.set(0, -0.12, -0.12);
    addToonOutline(THREE, stool, 1.05);
    this.butlerRoot.add(stool);

    this.butlerUpper = new THREE.Group();
    this.butlerRoot.add(this.butlerUpper);

    // Rounded BMO x Peppermint Butler Body Block (Mint-Teal)
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.12, 1.38, 0.78), this._toonMat(0x74D1B8));
    body.position.set(0, 0.74, 0);
    addToonOutline(THREE, body, 1.055);
    this.butlerUpper.add(body);

    // Dynamic 2D Facial Expression Plate on Front of Head
    this.faceCanvas = document.createElement('canvas');
    this.faceCanvas.width = 256;
    this.faceCanvas.height = 192;
    this.faceCtx = this.faceCanvas.getContext('2d');
    drawButlerFaceCanvas(this.faceCtx, this.mood, false);
    this.faceTex = new THREE.CanvasTexture(this.faceCanvas);
    this.faceTex.colorSpace = THREE.SRGBColorSpace;

    const facePlate = new THREE.Mesh(
      new THREE.PlaneGeometry(0.92, 0.68),
      new THREE.MeshBasicMaterial({ map: this.faceTex })
    );
    facePlate.position.set(0, 0.98, 0.402);
    this.butlerUpper.add(facePlate);

    // Tailored Navy Tuxedo Vest + Crisp White Shirt Front + Crimson Bow Tie
    const tux = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.56, 0.82), this._toonMat(0x1E293B));
    tux.position.set(0, 0.30, 0);
    addToonOutline(THREE, tux, 1.045);
    this.butlerUpper.add(tux);

    const shirt = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.44), new THREE.MeshBasicMaterial({ color: 0xFFFDF7 }));
    shirt.position.set(0, 0.34, 0.418);
    this.butlerUpper.add(shirt);

    const bowLeft = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.22, 4), this._toonMat(0xDC2626));
    bowLeft.rotation.z = -Math.PI / 2;
    bowLeft.position.set(-0.11, 0.50, 0.44);
    addToonOutline(THREE, bowLeft, 1.12);
    this.butlerUpper.add(bowLeft);

    const bowRight = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.22, 4), this._toonMat(0xDC2626));
    bowRight.rotation.z = Math.PI / 2;
    bowRight.position.set(0.11, 0.50, 0.44);
    addToonOutline(THREE, bowRight, 1.12);
    this.butlerUpper.add(bowRight);

    const bowPin = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), this._toonMat(0xFDE047));
    bowPin.position.set(0, 0.50, 0.46);
    this.butlerUpper.add(bowPin);

    // Jaunty Tilted Miniature Butler Cap
    this.butlerCap = new THREE.Group();
    const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.35, 0.34, 12), this._toonMat(0x1E293B));
    capTop.position.y = 0.20;
    addToonOutline(THREE, capTop, 1.08);
    this.butlerCap.add(capTop);

    const capBand = new THREE.Mesh(new THREE.CylinderGeometry(0.355, 0.36, 0.08, 12), this._toonMat(0xFDE047));
    capBand.position.y = 0.08;
    this.butlerCap.add(capBand);

    const capBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.05, 14), this._toonMat(0x1E293B));
    capBrim.position.y = 0.03;
    addToonOutline(THREE, capBrim, 1.07);
    this.butlerCap.add(capBrim);

    this.butlerCap.position.set(-0.08, 1.44, 0.02);
    this.butlerCap.rotation.z = 0.16;
    this.butlerUpper.add(this.butlerCap);

    // Articulated Left Arm (Gestures toward board: point / aha / think / greet)
    this.leftArmPivot = new THREE.Group();
    this.leftArmPivot.position.set(0.62, 0.58, 0.06);
    const lArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.68, 8), this._toonMat(0x1E293B));
    lArmMesh.position.set(0.24, -0.06, 0.12);
    lArmMesh.rotation.z = Math.PI / 2.6;
    addToonOutline(THREE, lArmMesh, 1.12);
    this.leftArmPivot.add(lArmMesh);
    const lHand = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), this._toonMat(0x74D1B8));
    lHand.position.set(0.54, -0.14, 0.22);
    addToonOutline(THREE, lHand, 1.12);
    this.leftArmPivot.add(lHand);
    this.butlerUpper.add(this.leftArmPivot);

    // Articulated Right Arm (Holds 3 Mini Card Wars Cards & Swings on Card Deal!)
    this.rightArmPivot = new THREE.Group();
    this.rightArmPivot.position.set(-0.62, 0.56, 0.08);
    const rArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.64, 8), this._toonMat(0x1E293B));
    rArmMesh.position.set(-0.18, -0.04, 0.20);
    rArmMesh.rotation.x = Math.PI / 3;
    addToonOutline(THREE, rArmMesh, 1.12);
    this.rightArmPivot.add(rArmMesh);

    const miniHandGroup = new THREE.Group();
    miniHandGroup.position.set(-0.22, 0.04, 0.46);
    [-0.24, 0, 0.24].forEach((rot, i) => {
      const miniCard = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.34, 0.02),
        this._toonMat(i === 1 ? 0xFDE047 : 0xF97316)
      );
      miniCard.position.set(rot * 0.45, Math.abs(rot) * -0.06, i * 0.025);
      miniCard.rotation.z = -rot;
      addToonOutline(THREE, miniCard, 1.09);
      miniHandGroup.add(miniCard);
    });
    this.rightArmPivot.add(miniHandGroup);
    this.butlerUpper.add(this.rightArmPivot);

    this.scene.add(this.butlerRoot);
  }

  _buildActiveCardAndParticles() {
    const THREE = this.THREE;
    this.cardFrontCanvas = document.createElement('canvas');
    this.cardFrontCanvas.width = 256;
    this.cardFrontCanvas.height = 352;
    this.cardFrontCtx = this.cardFrontCanvas.getContext('2d');

    this.cardBackCanvas = document.createElement('canvas');
    this.cardBackCanvas.width = 256;
    this.cardBackCanvas.height = 352;
    this.cardBackCtx = this.cardBackCanvas.getContext('2d');

    this.cardFrontTex = new THREE.CanvasTexture(this.cardFrontCanvas);
    this.cardFrontTex.colorSpace = THREE.SRGBColorSpace;
    this.cardBackTex = new THREE.CanvasTexture(this.cardBackCanvas);
    this.cardBackTex.colorSpace = THREE.SRGBColorSpace;

    // Build active 3D playing card as Group of core slab + 2 non-mirrored front/back planes
    // Verified by 3D rotation matrix: front plane faces +Y, back plane uses Rx(+pi/2)*Rz(pi)
    // so flipping card around Z by Math.PI lands back face right-side-up with zero left-right mirror.
    this.activeCardMesh = new THREE.Group();
    const cardCore = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.032, 1.34), this._toonMat(0x1A1816));
    this.activeCardMesh.add(cardCore);

    const frontPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.96, 1.32),
      new THREE.MeshBasicMaterial({ map: this.cardFrontTex })
    );
    frontPlane.rotation.x = -Math.PI / 2;
    frontPlane.position.y = 0.018;
    this.activeCardMesh.add(frontPlane);

    const backPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.96, 1.32),
      new THREE.MeshBasicMaterial({ map: this.cardBackTex })
    );
    backPlane.rotation.set(Math.PI / 2, 0, Math.PI);
    backPlane.position.y = -0.018;
    this.activeCardMesh.add(backPlane);

    this.activeCardMesh.position.set(0.05, 0.30, -0.25);
    this.scene.add(this.activeCardMesh);

    // 8 Cartoon Burst Particles when card slams onto board
    this.particles = [];
    const pGeo = new THREE.OctahedronGeometry(0.075, 0);
    for (let i = 0; i < 8; i++) {
      const pMesh = new THREE.Mesh(pGeo, new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xFDE047 : 0xFFFFFF }));
      pMesh.visible = false;
      this.scene.add(pMesh);
      this.particles.push({ mesh: pMesh, vx: 0, vy: 0, vz: 0, life: 0 });
    }

    this._redrawActiveCard();
  }

  _redrawActiveCard() {
    if (!this.cardFrontCtx || !this.cardBackCtx) return;
    drawPlayingCardTexture(this.cardFrontCtx, { ...this.cardState, isBack: false });
    drawPlayingCardTexture(this.cardBackCtx, { ...this.cardState, isBack: true });
    this.cardFrontTex.needsUpdate = true;
    this.cardBackTex.needsUpdate = true;
  }

  _spawnCardBurst() {
    if (this.prefersReducedMotion || !this.particles) return;
    this.particles.forEach((p, idx) => {
      const ang = (idx / this.particles.length) * Math.PI * 2;
      p.mesh.position.set(0.05, 0.34, -0.25);
      p.vx = Math.cos(ang) * 0.065;
      p.vy = 0.065 + (idx % 3) * 0.015;
      p.vz = Math.sin(ang) * 0.065;
      p.life = 1.0;
      p.mesh.visible = true;
    });
  }

  _activate2DFallback() {
    this._stopLoop();
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    if (this.webglContainer) {
      this.webglContainer.innerHTML = '';
      this.webglContainer.classList.add('hidden');
    }
    if (this.fallbackContainer) {
      this.fallbackContainer.classList.remove('hidden');
      render2DFallbackWorld(this.fallbackContainer, { mood: this.mood, ...this.cardState });
    }
    this.mode = '2d';
    this.onModeChange && this.onModeChange('2d');
  }

  setButlerMood(mood) {
    const safeMood = BUTLER_MOODS.includes(mood) ? mood : 'greet';
    this.mood = safeMood;
    if (this.mode === 'webgl' && this.faceCtx) {
      drawButlerFaceCanvas(this.faceCtx, safeMood, this.isBlinking);
      this.faceTex.needsUpdate = true;
    } else if (this.mode === '2d' && this.fallbackContainer) {
      render2DFallbackWorld(this.fallbackContainer, { mood: safeMood, ...this.cardState });
    }
  }

  setCameraMode(mode) {
    this.cameraMode = mode;
    if (mode === 'intro' || mode === 'overview') {
      this.camTargetPos = { x: 0.15, y: 2.55, z: 5.55 };
      this.camTargetLook = { x: -0.45, y: 0.90, z: -0.60 };
    } else if (mode === 'peek') {
      this.camTargetPos = { x: 0.0, y: 2.50, z: 5.35 };
      this.camTargetLook = { x: -0.25, y: 0.80, z: -0.50 };
    } else {
      // 'focus': frames Sir Pip cleanly in upper-left 0%-25% (y=14%-48%) directly above his Comic Speech Bubble
      this.camTargetPos = { x: 1.95, y: 2.95, z: 6.15 };
      this.camTargetLook = { x: 1.25, y: 0.12, z: -0.45 };
    }
  }

  setCardFaceState({ suit, roman, faceDown }) {
    this.cardState = {
      suit: suit || this.cardState.suit,
      roman: roman || this.cardState.roman,
      faceDown: !!faceDown
    };
    if (this.mode === 'webgl') this._redrawActiveCard();
    else if (this.mode === '2d' && this.fallbackContainer) {
      render2DFallbackWorld(this.fallbackContainer, { mood: this.mood, ...this.cardState });
    }
  }

  triggerCardDeal({ suit, roman, faceDown }) {
    this.setCardFaceState({ suit, roman, faceDown });
    if (this.mode === 'webgl') {
      this.dealAnim = { active: !this.prefersReducedMotion, t: this.prefersReducedMotion ? 1 : 0 };
      if (!this.prefersReducedMotion) this.shakeAmp = 0.09;
      this._spawnCardBurst();
    }
  }

  async set2DMode(use2D) {
    if (use2D) {
      this._activate2DFallback();
    } else {
      await this.init(false);
    }
  }

  pause() {
    this.paused = true;
    this._stopLoop();
  }

  resume() {
    this.paused = false;
    if (this.mode === 'webgl') this._startLoop();
  }

  resize() {
    if (!this.renderer || !this.camera) return;
    const w = Math.max(320, window.innerWidth);
    const h = Math.max(240, window.innerHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  _startLoop() {
    if (this.rafId || this.paused || this.mode !== 'webgl') return;
    const tick = (now) => {
      if (this.paused || this.mode !== 'webgl') { this.rafId = null; return; }
      this.rafId = requestAnimationFrame(tick);
      this._stepFrame((now - this.clockStart) / 1000);
      this.renderer.render(this.scene, this.camera);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  _stopLoop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  _stepFrame(elapsed) {
    // 1. Periodic natural eye blink
    const blinkCycle = elapsed % 3.4;
    const wantBlink = !this.prefersReducedMotion && blinkCycle > 3.24;
    if (wantBlink !== this.isBlinking && this.faceCtx) {
      this.isBlinking = wantBlink;
      drawButlerFaceCanvas(this.faceCtx, this.mood, wantBlink);
      this.faceTex.needsUpdate = true;
    }

    // 2. Butler idle breathing + mood pose choreography
    if (this.butlerUpper) {
      const bob = this.prefersReducedMotion ? 0 : Math.sin(elapsed * 2.4) * 0.045;
      const ahaJump = this.mood === 'aha' && !this.prefersReducedMotion ? Math.abs(Math.sin(elapsed * 5.2)) * 0.14 : 0;
      this.butlerUpper.position.y = bob + ahaJump;

      const targetRotZ = this.mood === 'think' ? 0.18 : this.mood === 'point' ? -0.08 : 0;
      this.butlerUpper.rotation.z += (targetRotZ - this.butlerUpper.rotation.z) * 0.10;

      const mouseLookY = this.prefersReducedMotion ? 0 : this.mouseNdc.x * 0.12;
      const baseYaw = this.mood === 'point' ? 0.56 : 0.42;
      this.butlerRoot.rotation.y += (baseYaw + mouseLookY - this.butlerRoot.rotation.y) * 0.08;

      if (this.butlerCap) {
        this.butlerCap.position.y = 1.44 + (this.mood === 'aha' ? ahaJump * 0.45 : 0);
      }

      if (this.leftArmPivot) {
        const wave = !this.prefersReducedMotion && (this.mood === 'greet' || this.mood === 'aha')
          ? Math.sin(elapsed * 6.5) * 0.25 : 0;
        const targetLArmZ =
          this.mood === 'point' ? 0.26
            : this.mood === 'aha' || this.mood === 'greet' ? 0.85 + wave
              : this.mood === 'proud' ? 0.48
                : this.mood === 'think' ? 0.58 : -0.18;
        this.leftArmPivot.rotation.z += (targetLArmZ - this.leftArmPivot.rotation.z) * 0.12;
      }

      if (this.rightArmPivot) {
        const dealSwing = this.dealAnim.active ? Math.sin(this.dealAnim.t * Math.PI) * 1.15 : 0;
        const targetRArmX = (this.mood === 'deal' ? -0.35 : 0) - dealSwing;
        this.rightArmPivot.rotation.x += (targetRArmX - this.rightArmPivot.rotation.x) * 0.16;
      }
    }

    // 3. Flying / Slamming Active 3D Card Mesh
    if (this.activeCardMesh) {
      const targetFlipZ = this.cardState.faceDown ? Math.PI : 0;
      if (this.dealAnim.active) {
        this.dealAnim.t = Math.min(1, this.dealAnim.t + 0.055);
        const u = 1 - Math.pow(1 - this.dealAnim.t, 3);
        this.activeCardMesh.position.x = -1.9 + (0.05 - -1.9) * u;
        this.activeCardMesh.position.z = -1.3 + (-0.25 - -1.3) * u;
        this.activeCardMesh.position.y = 0.30 + Math.sin(this.dealAnim.t * Math.PI) * 1.15;
        this.activeCardMesh.rotation.z = targetFlipZ + (1 - u) * Math.PI * 2;
        if (this.dealAnim.t >= 1) this.dealAnim.active = false;
      } else {
        const hoverY = this.cardState.faceDown && !this.prefersReducedMotion
          ? 0.48 + Math.sin(elapsed * 2.6) * 0.08 : 0.28;
        this.activeCardMesh.position.y += (hoverY - this.activeCardMesh.position.y) * 0.12;
        this.activeCardMesh.rotation.z += (targetFlipZ - this.activeCardMesh.rotation.z) * 0.14;
        this.activeCardMesh.rotation.y = this.cardState.faceDown && !this.prefersReducedMotion
          ? Math.sin(elapsed * 1.2) * 0.18 : 0.04;
      }
    }

    // 4. Card Slam Burst Particles
    if (this.particles) {
      this.particles.forEach((p) => {
        if (p.life <= 0) return;
        p.life -= 0.04;
        p.vy -= 0.004;
        p.mesh.position.x += p.vx;
        p.mesh.position.y += p.vy;
        p.mesh.position.z += p.vz;
        p.mesh.rotation.x += 0.18;
        p.mesh.scale.setScalar(Math.max(0.01, p.life));
        if (p.life <= 0) p.mesh.visible = false;
      });
    }

    // 5. Smooth Camera Lerp + Subtle Peek Orbit + Damped Deal Micro-Shake
    const peekOffsetX = this.cameraMode === 'peek' && !this.prefersReducedMotion ? Math.sin(elapsed * 0.55) * 1.15 : 0;
    const parallaxX = this.prefersReducedMotion ? 0 : this.mouseNdc.x * 0.16;
    const parallaxY = this.prefersReducedMotion ? 0 : -this.mouseNdc.y * 0.08;

    this.shakeAmp *= 0.86;
    const shakeY = this.shakeAmp > 0.002 ? Math.sin(elapsed * 55) * this.shakeAmp : 0;

    const tx = this.camTargetPos.x + peekOffsetX + parallaxX;
    const ty = this.camTargetPos.y + parallaxY + shakeY;
    const tz = this.camTargetPos.z;

    this.camera.position.x += (tx - this.camera.position.x) * 0.08;
    this.camera.position.y += (ty - this.camera.position.y) * 0.08;
    this.camera.position.z += (tz - this.camera.position.z) * 0.08;

    this.camCurrentLook.x += (this.camTargetLook.x - this.camCurrentLook.x) * 0.08;
    this.camCurrentLook.y += (this.camTargetLook.y - this.camCurrentLook.y) * 0.08;
    this.camCurrentLook.z += (this.camTargetLook.z - this.camCurrentLook.z) * 0.08;
    this.camera.lookAt(this.camCurrentLook.x, this.camCurrentLook.y, this.camCurrentLook.z);
  }

  dispose() {
    this._stopLoop();
    window.removeEventListener('mousemove', this._onMouseMove);
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
  }
}
