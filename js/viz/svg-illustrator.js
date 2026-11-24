// Custom 3-Layer Cartoon-Editorial Vector SVG Illustrator (Card Wars 3D + Shorts Deck v5)
// Suits & Shapes:
//   Square / Emerald (#0F766E)       = MCT Deterministik
//   Circle / Royal Cobalt (#1D4ED8)  = GOA Eksplorasi
//   Funnel & Diamond / Crimson (#B91C1C / #DC2626) = ALO Eksploitasi & Elite

import { socialForce, comfortZoneRadius } from '../algorithms/hybrid-goa-alo.js?v=7';

export const BUTLER_MOODS = ['greet', 'deal', 'point', 'think', 'aha', 'proud'];

// ============================================================================
// 2D SVG BUTLER "SIR PIP" (Used for Automatic 2D Fallback & Shorts Mood Badge)
// ============================================================================
export function renderButler2DSvg(container, { mood = 'greet', compact = false } = {}) {
  if (!container) return;
  const safeMood = BUTLER_MOODS.includes(mood) ? mood : 'greet';

  const eyesMap = {
    greet: `
      <path d="M 42 54 Q 47 47 52 54" fill="none" stroke="#1A1816" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M 68 54 Q 73 47 78 54" fill="none" stroke="#1A1816" stroke-width="3.2" stroke-linecap="round"/>
    `,
    deal: `
      <circle cx="47" cy="53" r="3.8" fill="#1A1816"/>
      <circle cx="73" cy="53" r="3.8" fill="#1A1816"/>
      <line x1="41" y1="45" x2="53" y2="48" stroke="#1A1816" stroke-width="2.6" stroke-linecap="round"/>
      <line x1="79" y1="45" x2="67" y2="48" stroke="#1A1816" stroke-width="2.6" stroke-linecap="round"/>
    `,
    point: `
      <circle cx="49" cy="53" r="3.8" fill="#1A1816"/>
      <circle cx="75" cy="53" r="3.8" fill="#1A1816"/>
      <circle cx="50.5" cy="51.5" r="1.2" fill="#FFFFFF"/>
      <circle cx="76.5" cy="51.5" r="1.2" fill="#FFFFFF"/>
    `,
    think: `
      <circle cx="47" cy="54" r="3.5" fill="#1A1816"/>
      <circle cx="73" cy="52" r="3.5" fill="#1A1816"/>
      <path d="M 41 46 Q 47 44 52 46" fill="none" stroke="#1A1816" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M 68 43 Q 73 39 79 44" fill="none" stroke="#1A1816" stroke-width="2.4" stroke-linecap="round"/>
    `,
    aha: `
      <circle cx="47" cy="52" r="4.6" fill="#1A1816"/>
      <circle cx="73" cy="52" r="4.6" fill="#1A1816"/>
      <circle cx="45.5" cy="50.5" r="1.7" fill="#FDE047"/>
      <circle cx="71.5" cy="50.5" r="1.7" fill="#FDE047"/>
    `,
    proud: `
      <path d="M 41 53 Q 47 46 53 53" fill="none" stroke="#1A1816" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M 67 53 Q 73 46 79 53" fill="none" stroke="#1A1816" stroke-width="3.2" stroke-linecap="round"/>
    `
  };

  const mouthMap = {
    greet: `<path d="M 49 66 Q 60 77 71 66 Z" fill="#1A1816" stroke="#1A1816" stroke-width="2" stroke-linejoin="round"/><path d="M 55 71 Q 60 74 65 71" fill="none" stroke="#F87171" stroke-width="2.2" stroke-linecap="round"/>`,
    deal: `<path d="M 50 67 Q 62 73 72 64" fill="none" stroke="#1A1816" stroke-width="3" stroke-linecap="round"/>`,
    point: `<ellipse cx="60" cy="68" rx="6.5" ry="5" fill="#1A1816"/><ellipse cx="60" cy="70" rx="3.4" ry="2" fill="#F87171"/>`,
    think: `<path d="M 52 69 Q 57 65 62 69 T 70 67" fill="none" stroke="#1A1816" stroke-width="2.8" stroke-linecap="round"/>`,
    aha: `<path d="M 48 64 Q 60 79 72 64 Z" fill="#1A1816" stroke="#1A1816" stroke-width="2"/><ellipse cx="60" cy="71" rx="5" ry="2.6" fill="#F87171"/>`,
    proud: `<path d="M 48 65 Q 60 76 72 65" fill="none" stroke="#1A1816" stroke-width="3.2" stroke-linecap="round"/>`
  };

  const badgeAccent =
    safeMood === 'aha'
      ? `<polygon points="103,18 106,25 113,26 107,31 109,38 103,34 97,38 99,31 93,26 100,25" fill="#FDE047" stroke="#1A1816" stroke-width="1.8"/>`
      : safeMood === 'think'
        ? `<text x="102" y="34" font-family="Fredoka, Syne, sans-serif" font-size="22" font-weight="700" fill="#FDE047" stroke="#1A1816" stroke-width="1.4">?</text>`
        : safeMood === 'deal'
          ? `<rect x="92" y="20" width="16" height="22" rx="3" transform="rotate(14 100 31)" fill="#F97316" stroke="#1A1816" stroke-width="2"/>`
          : '';

  const armRight =
    safeMood === 'point'
      ? `<path d="M 92 92 L 112 76" stroke="#1E293B" stroke-width="8" stroke-linecap="round"/><circle cx="113" cy="75" r="5" fill="#74D1B8" stroke="#1A1816" stroke-width="2"/>`
      : safeMood === 'greet' || safeMood === 'aha'
        ? `<path d="M 92 90 L 110 64" stroke="#1E293B" stroke-width="8" stroke-linecap="round"/><circle cx="111" cy="63" r="5" fill="#74D1B8" stroke="#1A1816" stroke-width="2"/>`
        : `<path d="M 92 92 Q 104 98 102 108" fill="none" stroke="#1E293B" stroke-width="8" stroke-linecap="round"/>`;

  const sizeClass = compact ? 'w-[52px] h-[52px] block' : 'w-[126px] h-[132px] block';

  container.innerHTML = `
    <svg viewBox="0 0 120 124" class="${sizeClass}" role="img" aria-label="Butler Sir Pip ekspresi ${safeMood}">
      <rect x="6" y="6" width="108" height="112" rx="18" fill="#E0F2FE" stroke="#1A1816" stroke-width="3"/>
      <g transform="rotate(-8 60 22)">
        <rect x="38" y="10" width="44" height="16" rx="5" fill="#1E293B" stroke="#1A1816" stroke-width="2.6"/>
        <rect x="38" y="21" width="44" height="5" fill="#FDE047" stroke="#1A1816" stroke-width="1.6"/>
        <rect x="31" y="25" width="58" height="5" rx="2.5" fill="#1E293B" stroke="#1A1816" stroke-width="2.4"/>
      </g>
      <path d="M 28 92 Q 16 98 18 108" fill="none" stroke="#1E293B" stroke-width="8" stroke-linecap="round"/>
      ${armRight}
      <rect x="24" y="28" width="72" height="82" rx="16" fill="#74D1B8" stroke="#1A1816" stroke-width="3"/>
      <rect x="32" y="36" width="56" height="44" rx="10" fill="#D5F5EA" stroke="#1A1816" stroke-width="2.2"/>
      <ellipse cx="40" cy="63" rx="4.5" ry="2.6" fill="#FDA4AF" opacity="0.8"/>
      <ellipse cx="80" cy="63" rx="4.5" ry="2.6" fill="#FDA4AF" opacity="0.8"/>
      ${eyesMap[safeMood]}
      ${mouthMap[safeMood]}
      <path d="M 24 84 L 96 84 L 96 98 Q 96 110 84 110 L 36 110 Q 24 110 24 98 Z" fill="#1E293B" stroke="#1A1816" stroke-width="2.8"/>
      <polygon points="48,84 72,84 60,106" fill="#FFFDF7" stroke="#1A1816" stroke-width="2"/>
      <polygon points="50,86 60,91 50,96" fill="#DC2626" stroke="#1A1816" stroke-width="1.8" stroke-linejoin="round"/>
      <polygon points="70,86 60,91 70,96" fill="#DC2626" stroke="#1A1816" stroke-width="1.8" stroke-linejoin="round"/>
      <circle cx="60" cy="91" r="3" fill="#FDE047" stroke="#1A1816" stroke-width="1.5"/>
      ${badgeAccent}
    </svg>
  `;
}

function sharedDefs(prefix) {
  return `
    <defs>
      <linearGradient id="${prefix}-goa-grad" x1="12%" y1="8%" x2="88%" y2="92%">
        <stop offset="0%" stop-color="#60A5FA"/>
        <stop offset="48%" stop-color="#1D4ED8"/>
        <stop offset="100%" stop-color="#1E3A8A"/>
      </linearGradient>
      <linearGradient id="${prefix}-goa-soft" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#93C5FD"/>
        <stop offset="100%" stop-color="#2563EB"/>
      </linearGradient>
      <linearGradient id="${prefix}-pso-grad" x1="12%" y1="8%" x2="88%" y2="92%">
        <stop offset="0%" stop-color="#A78BFA"/>
        <stop offset="50%" stop-color="#6D28D9"/>
        <stop offset="100%" stop-color="#4C1D95"/>
      </linearGradient>
      <radialGradient id="${prefix}-pso-rad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#6D28D9" stop-opacity="0.02"/>
        <stop offset="58%" stop-color="#6D28D9" stop-opacity="0.16"/>
        <stop offset="100%" stop-color="#6D28D9" stop-opacity="0.0"/>
      </radialGradient>
      <marker id="${prefix}-arrow-pso" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M 1 1.5 L 8.5 5 L 1 8.5 L 3 5 Z" fill="#6D28D9"/>
      </marker>
      <linearGradient id="${prefix}-mct-grad" x1="10%" y1="10%" x2="90%" y2="90%">
        <stop offset="0%" stop-color="#34D399"/>
        <stop offset="55%" stop-color="#0F6B56"/>
        <stop offset="100%" stop-color="#0B4F3F"/>
      </linearGradient>
      <linearGradient id="${prefix}-alo-grad" x1="15%" y1="10%" x2="85%" y2="90%">
        <stop offset="0%" stop-color="#F87171"/>
        <stop offset="55%" stop-color="#DC2626"/>
        <stop offset="100%" stop-color="#991B1B"/>
      </linearGradient>
      <linearGradient id="${prefix}-terrain-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#DBEAFE"/>
        <stop offset="58%" stop-color="#E7E1D3"/>
        <stop offset="100%" stop-color="#D6CEBC"/>
      </linearGradient>
      <linearGradient id="${prefix}-sand-slope" x1="10%" y1="0%" x2="90%" y2="100%">
        <stop offset="0%" stop-color="#FEE2E2"/>
        <stop offset="55%" stop-color="#FCA5A5"/>
        <stop offset="100%" stop-color="#DC2626" stop-opacity="0.78"/>
      </linearGradient>
      <radialGradient id="${prefix}-eye-glint" cx="32%" cy="28%" r="65%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="30%" stop-color="#DC2626"/>
        <stop offset="100%" stop-color="#121816"/>
      </radialGradient>
      <radialGradient id="${prefix}-attraction-rad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#1D4ED8" stop-opacity="0.02"/>
        <stop offset="58%" stop-color="#1D4ED8" stop-opacity="0.16"/>
        <stop offset="100%" stop-color="#1D4ED8" stop-opacity="0.0"/>
      </radialGradient>
      <pattern id="${prefix}-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(42)">
        <line x1="0" y1="0" x2="0" y2="7" stroke="#121816" stroke-width="0.7" stroke-opacity="0.12"/>
      </pattern>
      <pattern id="${prefix}-rose-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-42)">
        <line x1="0" y1="0" x2="0" y2="8" stroke="#B91C1C" stroke-width="0.85" stroke-opacity="0.24"/>
      </pattern>
      <pattern id="${prefix}-stipple" width="14" height="14" patternUnits="userSpaceOnUse">
        <circle cx="2.5" cy="3" r="0.8" fill="#121816" fill-opacity="0.15"/>
        <circle cx="9.5" cy="6" r="0.65" fill="#B91C1C" fill-opacity="0.22"/>
        <circle cx="5" cy="11" r="0.75" fill="#121816" fill-opacity="0.14"/>
        <circle cx="12" cy="12" r="0.6" fill="#424B47" fill-opacity="0.16"/>
      </pattern>
      <marker id="${prefix}-arrow-ink" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M 1 1.5 L 8.5 5 L 1 8.5 L 3 5 Z" fill="#121816"/>
      </marker>
      <marker id="${prefix}-arrow-goa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M 1 1.5 L 8.5 5 L 1 8.5 L 3 5 Z" fill="#1D4ED8"/>
      </marker>
      <marker id="${prefix}-arrow-alo" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M 1 1.5 L 8.5 5 L 1 8.5 L 3 5 Z" fill="#B91C1C"/>
      </marker>
      <marker id="${prefix}-arrow-mct" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M 1 1.5 L 8.5 5 L 1 8.5 L 3 5 Z" fill="#0F6B56"/>
      </marker>
      <filter id="${prefix}-lift" x="-8%" y="-8%" width="118%" height="122%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#121816" flood-opacity="0.10"/>
      </filter>
    </defs>
  `;
}

// ============================================================================
// UNIFIED 1-COLOR CARD WARS BACK EMBLEM SVG (Consistent Deck Back for All 9 Cards)
// ============================================================================
export function renderCardBackEmblem(container, { suit = 'concept', roman = 'I' } = {}) {
  if (!container) return;
  const miniGlyph =
    suit === 'mct' ? '■' : suit === 'goa' ? '●' : suit === 'alo' ? '▼' : '◆';

  container.innerHTML = `
    <svg viewBox="0 0 140 140" class="w-[96px] h-[96px] block" aria-hidden="true">
      <rect x="6" y="6" width="128" height="128" rx="18" fill="#6F2010" stroke="#FDE047" stroke-width="3.5"/>
      <rect x="15" y="15" width="110" height="110" rx="12" fill="none" stroke="rgba(253,224,71,0.45)" stroke-width="1.6" stroke-dasharray="5 4"/>
      <polygon points="70,24 112,70 70,116 28,70" fill="#8C2D19" stroke="#FDE047" stroke-width="3" stroke-linejoin="round"/>
      <text x="70" y="75" text-anchor="middle" font-family="Fredoka, Syne, sans-serif" font-size="26" font-weight="700" fill="#FFFDF7">${roman}</text>
      <text x="70" y="102" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="13" font-weight="700" fill="#FDE047">${miniGlyph}</text>
    </svg>
  `;
}

// ============================================================================
// CARD I HERO: Animated Geometric 3-Suit Story Stage
// ============================================================================
export function renderCoverStoryStage(container, { focus = 'all', phaseT = 0.65 } = {}) {
  if (!container) return;
  const p = 'covst';
  const opMct = focus === 'all' || focus === 'mct' ? 1 : 0.28;
  const opGoa = focus === 'all' || focus === 'goa' ? 1 : 0.28;
  const opAlo = focus === 'all' || focus === 'alo' ? 1 : 0.28;

  const slideX = phaseT * 92;
  const mctBlocks = [
    { x: 44 + slideX, y: 80, w: 62, h: 24, label: 'T1' },
    { x: 44 + slideX, y: 114, w: 82, h: 24, label: 'T2' },
    { x: 44 + slideX, y: 148, w: 50, h: 24, label: 'T3' },
    { x: 112 + slideX * 0.72, y: 80, w: 48, h: 24, label: 'T4' }
  ].map((b) => `
    <rect x="${b.x.toFixed(1)}" y="${b.y}" width="${b.w}" height="${b.h}" rx="5" fill="url(#${p}-mct-grad)" stroke="#121816" stroke-width="1.5"/>
    <text x="${(b.x + b.w / 2).toFixed(1)}" y="${b.y + 16}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="700" fill="#FFFFFF">${b.label}</text>
  `).join('');

  const gcx = 478;
  const gcy = 128;
  const goaCircles = [0, 52, 104, 156, 208, 260, 312].map((deg, idx) => {
    const rad = ((deg + phaseT * 28) * Math.PI) / 180;
    const baseR = idx % 2 === 0 ? 28 + phaseT * 30 : 84 - phaseT * 26;
    const x = gcx + Math.cos(rad) * baseR;
    const y = gcy + Math.sin(rad) * baseR * 0.76;
    return `
      <line x1="${gcx}" y1="${gcy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#1D4ED8" stroke-width="1" stroke-dasharray="3 3" opacity="0.45"/>
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8.5" fill="url(#${p}-goa-grad)" stroke="#121816" stroke-width="1.4"/>
    `;
  }).join('');

  const acx = 795;
  const shrink = 1 - phaseT * 0.65;
  const fl = acx - 95 * shrink;
  const fr = acx + 95 * shrink;
  const preyX = acx + 70 * shrink * Math.cos(phaseT * Math.PI * 3);
  const preyY = 70 + phaseT * 98;

  container.innerHTML = `
    <svg viewBox="0 0 960 236" class="w-full h-auto block" role="img" aria-label="Panggung animasi 3 simbol kartu: Kotak MCT, Lingkaran GOA, dan Corong ALO">
      ${sharedDefs(p)}

      <g opacity="${opMct}" style="transition: opacity 220ms ease;">
        <rect x="14" y="14" width="288" height="208" rx="12" fill="#E6F4F0" stroke="#0F6B56" stroke-width="${focus === 'mct' ? '2.4' : '1.3'}"/>
        <text x="32" y="38" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" fill="#0F6B56">SUIT KOTAK: MCT (START RAPI)</text>
        <text x="32" y="56" font-family="Plus Jakarta Sans, sans-serif" font-size="11.5" fill="#424B47">Balok tugas langsung masuk mesin tercepat</text>
        <line x1="32" y1="92" x2="282" y2="92" stroke="#0F6B56" stroke-opacity="0.22" stroke-width="2" stroke-dasharray="4 3"/>
        <line x1="32" y1="126" x2="282" y2="126" stroke="#0F6B56" stroke-opacity="0.22" stroke-width="2" stroke-dasharray="4 3"/>
        <line x1="32" y1="160" x2="282" y2="160" stroke="#0F6B56" stroke-opacity="0.22" stroke-width="2" stroke-dasharray="4 3"/>
        ${mctBlocks}
        <text x="32" y="206" font-family="JetBrains Mono, monospace" font-size="10" fill="#0F6B56">Aturan pasti satu arah -> X_MCT</text>
      </g>

      <path d="M 306 118 L 332 118" stroke="#121816" stroke-width="2" marker-end="url(#${p}-arrow-ink)"/>

      <g opacity="${opGoa}" style="transition: opacity 220ms ease;">
        <rect x="338" y="14" width="282" height="208" rx="12" fill="#EAF0FE" stroke="#1D4ED8" stroke-width="${focus === 'goa' ? '2.4' : '1.3'}"/>
        <text x="356" y="38" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" fill="#1D4ED8">SUIT LINGKARAN: GOA (JELAJAH)</text>
        <text x="356" y="56" font-family="Plus Jakarta Sans, sans-serif" font-size="11.5" fill="#424B47">Kawanan menyebar luas, dorong &amp; tarik</text>
        <circle cx="${gcx}" cy="${gcy}" r="56" fill="url(#${p}-attraction-rad)" stroke="#1D4ED8" stroke-width="1.6" stroke-dasharray="5 3"/>
        ${goaCircles}
        <circle cx="${gcx}" cy="${gcy}" r="11" fill="#FFFFFF" stroke="#1D4ED8" stroke-width="2.2"/>
        <text x="356" y="206" font-family="JetBrains Mono, monospace" font-size="10" fill="#1D4ED8">Eksplorasi global seluruh peta</text>
      </g>

      <path d="M 624 118 L 650 118" stroke="#121816" stroke-width="2" marker-end="url(#${p}-arrow-ink)"/>

      <g opacity="${opAlo}" style="transition: opacity 220ms ease;">
        <rect x="656" y="14" width="290" height="208" rx="12" fill="#FCEAEA" stroke="#B91C1C" stroke-width="${focus === 'alo' ? '2.4' : '1.3'}"/>
        <text x="674" y="38" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" fill="#B91C1C">SUIT CORONG: ALO (PRESISI)</text>
        <text x="674" y="56" font-family="Plus Jakarta Sans, sans-serif" font-size="11.5" fill="#424B47">Corong pasir menyempit mengunci target</text>
        <polygon points="${fl.toFixed(1)},74 ${fr.toFixed(1)},74 ${acx},186" fill="url(#${p}-sand-slope)" fill-opacity="0.48"/>
        <polygon points="${fl.toFixed(1)},74 ${fr.toFixed(1)},74 ${acx},186" fill="url(#${p}-stipple)"/>
        <line x1="${fl.toFixed(1)}" y1="74" x2="${acx}" y2="186" stroke="#B91C1C" stroke-width="1.75"/>
        <line x1="${fr.toFixed(1)}" y1="74" x2="${acx}" y2="186" stroke="#B91C1C" stroke-width="1.75"/>
        <circle cx="${preyX.toFixed(1)}" cy="${preyY.toFixed(1)}" r="7" fill="#1D4ED8" stroke="#FFFFFF" stroke-width="1.8"/>
        <polygon points="${acx},172 ${acx + 11},184 ${acx},196 ${acx - 11},184" fill="url(#${p}-alo-grad)" stroke="#121816" stroke-width="1.5"/>
        <text x="674" y="206" font-family="JetBrains Mono, monospace" font-size="10" fill="#B91C1C">Eksploitasi tajam -> Elite Global</text>
      </g>
    </svg>
  `;
}

// ============================================================================
// CARD II: GENERAL BEGINNER INTUITION STAGE (Animated Shapes Terrain)
// ============================================================================
export function renderIntuitionTerrain(container, { stage = 'random', phaseT = 0 } = {}) {
  if (!container) return;
  const p = 'int';
  const yCurve = (x) => {
    const u = (x - 30) / 500;
    const base = 115 + 32 * Math.sin(u * Math.PI * 2.1);
    const localTrap = 68 * Math.exp(-Math.pow((x - 150) / 58, 2));
    const globalValley = 118 * Math.exp(-Math.pow((x - 378) / 68, 2));
    return Math.min(242, Math.max(46, base + localTrap + globalValley - 26));
  };

  const curvePts = [];
  for (let x = 30; x <= 530; x += 6) curvePts.push(`${x},${yCurve(x).toFixed(1)}`);
  const terrainPath = `M 30 260 L ${curvePts.join(' L ')} L 530 260 Z`;
  const ridgePath = `M ${curvePts.join(' L ')}`;

  const startXs = [72, 118, 162, 224, 290, 446, 492];
  let agentsSvg = '';
  let overlaysSvg = '';

  if (stage === 'random') {
    const targetXs = [95, 138, 152, 166, 260, 432, 478];
    startXs.forEach((sx, i) => {
      const x = sx + (targetXs[i] - sx) * phaseT;
      const y = yCurve(x) - 10;
      const trapped = Math.abs(x - 150) < 35;
      agentsSvg += `
        <line x1="${x.toFixed(1)}" y1="44" x2="${x.toFixed(1)}" y2="${(y - 7).toFixed(1)}" stroke="#424B47" stroke-width="0.85" stroke-dasharray="3 3" opacity="0.45"/>
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7.5" fill="${trapped ? '#94A3B8' : '#1D4ED8'}" stroke="#121816" stroke-width="1.5"/>
      `;
    });
    overlaysSvg = `
      <rect x="104" y="40" width="92" height="24" rx="6" fill="#FCEAEA" stroke="#B91C1C" stroke-width="1.4"/>
      <text x="150" y="56" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#B91C1C">JEBAKAN LOKAL</text>
      <line x1="150" y1="64" x2="150" y2="152" stroke="#B91C1C" stroke-width="1.2" stroke-dasharray="3 3"/>
    `;
  } else if (stage === 'explore') {
    const spreadXs = [68, 134, 212, 296, 366, 434, 496];
    startXs.forEach((_sx, i) => {
      const wave = Math.sin(phaseT * Math.PI * 2 + i * 0.9) * 26;
      const x = Math.min(510, Math.max(50, spreadXs[i] + wave));
      const y = yCurve(x) - 14;
      agentsSvg += `
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="16" fill="#1D4ED8" fill-opacity="0.11" stroke="#1D4ED8" stroke-width="1" stroke-dasharray="3 2"/>
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7.5" fill="url(#${p}-goa-grad)" stroke="#121816" stroke-width="1.5"/>
      `;
    });
    overlaysSvg = `
      <path d="M 155 156 Q 266 36, 366 138" fill="none" stroke="#1D4ED8" stroke-width="2.2" stroke-dasharray="5 3" marker-end="url(#${p}-arrow-goa)"/>
      <rect x="192" y="32" width="152" height="24" rx="6" fill="#EAF0FE" stroke="#1D4ED8" stroke-width="1.4"/>
      <text x="268" y="48" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#1D4ED8">LOMPATAN EKSPLORASI</text>
    `;
  } else {
    const funnelHalf = 115 - phaseT * 78;
    const fxL = 378 - funnelHalf;
    const fxR = 378 + funnelHalf;
    overlaysSvg = `
      <polygon points="${fxL.toFixed(1)},56 ${fxR.toFixed(1)},56 378,224" fill="url(#${p}-sand-slope)" fill-opacity="0.38"/>
      <line x1="${fxL.toFixed(1)}" y1="56" x2="378" y2="224" stroke="#B91C1C" stroke-width="1.8" stroke-dasharray="4 3"/>
      <line x1="${fxR.toFixed(1)}" y1="56" x2="378" y2="224" stroke="#B91C1C" stroke-width="1.8" stroke-dasharray="4 3"/>
      <rect x="302" y="30" width="152" height="24" rx="6" fill="#FCEAEA" stroke="#B91C1C" stroke-width="1.4"/>
      <text x="378" y="46" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#B91C1C">CORONG EKSPLOITASI</text>
    `;
    const offsets = [-96, -64, -34, -12, 18, 52, 86];
    offsets.forEach((off, i) => {
      const shrink = 1 - phaseT * 0.84;
      const x = 378 + off * shrink;
      const y = yCurve(x) - 9;
      agentsSvg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="${i === 3 ? '#DC2626' : '#1D4ED8'}" stroke="#121816" stroke-width="1.5"/>`;
    });
  }

  const gy = yCurve(378);

  container.innerHTML = `
    <svg viewBox="0 0 560 278" class="w-full h-auto block" role="img" aria-label="Visualisasi bentuk geometris ruang pencarian optimasi">
      ${sharedDefs(p)}
      <defs>
        <clipPath id="${p}-terrain-clip"><path d="${terrainPath}"/></clipPath>
      </defs>

      <rect x="20" y="16" width="520" height="244" rx="8" fill="#FFFFFF" stroke="rgba(18,24,22,0.14)"/>
      <g stroke="rgba(18,24,22,0.06)" stroke-width="0.8">
        <line x1="20" y1="82" x2="540" y2="82"/>
        <line x1="20" y1="146" x2="540" y2="146"/>
        <line x1="20" y1="210" x2="540" y2="210"/>
      </g>

      <path d="${terrainPath}" fill="url(#${p}-terrain-grad)"/>
      <g clip-path="url(#${p}-terrain-clip)"><rect x="20" y="40" width="520" height="225" fill="url(#${p}-hatch)"/></g>
      <path d="${ridgePath}" fill="none" stroke="#121816" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"/>

      <polygon points="378,${(gy - 10).toFixed(1)} 388,${gy.toFixed(1)} 378,${(gy + 10).toFixed(1)} 368,${gy.toFixed(1)}"
               fill="url(#${p}-alo-grad)" stroke="#121816" stroke-width="1.5"/>

      ${overlaysSvg}
      ${agentsSvg}

      <g font-family="JetBrains Mono, monospace" font-size="10">
        <text x="150" y="250" text-anchor="middle" fill="#424B47">Optimum Lokal (Cukup Baik)</text>
        <text x="378" y="250" text-anchor="middle" font-weight="700" fill="#B91C1C">Optimum Global (Terbaik)</text>
      </g>
    </svg>
  `;
}

// ============================================================================
// ASSET 1: Spesimen Belalang GOA (svg-grasshopper-specimen)
// ============================================================================
export function renderGrasshopperSpecimen(container, { prefix = 'gh', legAngle = 0, showAnnotations = true } = {}) {
  if (!container) return;
  container.innerHTML = `
    <svg viewBox="0 0 540 264" class="w-full h-auto block" role="img" aria-label="Ilustrasi spesimen geometris belalang GOA">
      ${sharedDefs(prefix)}
      <defs>
        <linearGradient id="${prefix}-wing-fade-grad" x1="0%" y1="0%" x2="100%" y2="25%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
          <stop offset="72%" stop-color="#CBD5E1" stop-opacity="0.58"/>
          <stop offset="100%" stop-color="#1E293B" stop-opacity="0.12"/>
        </linearGradient>
        <mask id="${prefix}-wing-fade"><rect x="0" y="0" width="540" height="264" fill="url(#${prefix}-wing-fade-grad)"/></mask>
        <clipPath id="${prefix}-wing-clip"><path d="M 205 114 C 282 74, 396 68, 472 100 C 446 128, 355 146, 224 144 Z"/></clipPath>
        <clipPath id="${prefix}-thorax-clip"><path d="M 142 122 C 154 92, 205 86, 232 110 C 242 126, 228 154, 198 160 C 166 164, 138 148, 142 122 Z"/></clipPath>
      </defs>

      <g stroke="#424B47" stroke-width="0.75" stroke-dasharray="3 3" opacity="0.45">
        <line x1="28" y1="222" x2="512" y2="222"/>
        <line x1="88" y1="36" x2="88" y2="232"/>
        <line x1="472" y1="84" x2="472" y2="232"/>
      </g>

      <g filter="url(#${prefix}-lift)">
        <g stroke="#121816" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none">
          <path d="M 164 152 L 146 192 L 126 219 L 114 221"/>
          <path d="M 206 156 L 218 194 L 236 220 L 248 222"/>
        </g>

        <path d="M 222 128 C 282 124, 366 138, 434 162 C 414 180, 344 186, 236 168 Z"
              fill="url(#${prefix}-goa-soft)" stroke="#121816" stroke-width="1.75" stroke-linejoin="round"/>
        <path d="M 222 128 C 282 124, 366 138, 434 162 C 414 180, 344 186, 236 168 Z" fill="url(#${prefix}-hatch)"/>
        <g stroke="#121816" stroke-width="0.9" stroke-linecap="round" opacity="0.7" fill="none">
          <path d="M 268 130 C 266 148, 268 162, 274 172"/>
          <path d="M 304 135 C 301 152, 304 165, 310 175"/>
          <path d="M 340 142 C 337 157, 340 168, 346 176"/>
          <path d="M 374 149 C 371 161, 374 170, 380 175"/>
        </g>

        <g mask="url(#${prefix}-wing-fade)">
          <path d="M 205 114 C 282 74, 396 68, 472 100 C 446 128, 355 146, 224 144 Z"
                fill="url(#${prefix}-goa-soft)" fill-opacity="0.52" stroke="#121816" stroke-width="1.35" stroke-linejoin="round"/>
          <g clip-path="url(#${prefix}-wing-clip)" stroke="#121816" stroke-width="0.65" fill="none" opacity="0.55">
            <path d="M 208 118 C 280 92, 372 86, 464 102"/>
            <path d="M 212 128 C 292 108, 380 108, 452 114"/>
            <path d="M 220 138 C 298 126, 368 126, 428 126"/>
            <path d="M 266 92 L 284 140 M 310 84 L 328 138 M 356 80 L 372 134 M 404 86 L 414 128"/>
          </g>
        </g>

        <path d="M 142 122 C 154 92, 205 86, 232 110 C 242 126, 228 154, 198 160 C 166 164, 138 148, 142 122 Z"
              fill="url(#${prefix}-goa-grad)" stroke="#121816" stroke-width="1.75" stroke-linejoin="round"/>
        <g clip-path="url(#${prefix}-thorax-clip)">
          <path d="M 140 142 C 176 152, 212 146, 240 124 L 240 170 L 140 170 Z" fill="#121816" fill-opacity="0.22"/>
          <rect x="138" y="88" width="106" height="78" fill="url(#${prefix}-hatch)"/>
        </g>

        <path d="M 148 114 C 122 100, 96 112, 92 140 C 90 160, 108 174, 130 170 C 146 166, 154 148, 152 128 Z"
              fill="url(#${prefix}-goa-grad)" stroke="#121816" stroke-width="1.75" stroke-linejoin="round"/>
        <ellipse cx="116" cy="130" rx="11" ry="15" transform="rotate(-14 116 130)"
                 fill="url(#${prefix}-eye-glint)" stroke="#121816" stroke-width="1.35"/>
        <circle cx="112" cy="123" r="2.6" fill="#FFFFFF" opacity="0.9"/>
        <path d="M 103 112 C 84 78, 54 60, 24 54" fill="none" stroke="#121816" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M 110 108 C 98 72, 76 48, 48 32" fill="none" stroke="#121816" stroke-width="1.2" stroke-linecap="round"/>

        <g id="${prefix}-hind-leg" transform="rotate(${legAngle} 248 154)" style="transition: transform 280ms cubic-bezier(0.22,1,0.36,1);">
          <path d="M 232 158 C 254 110, 306 68, 344 64 C 350 72, 336 102, 294 144 C 268 168, 244 172, 232 158 Z"
                fill="url(#${prefix}-alo-grad)" stroke="#121816" stroke-width="1.75" stroke-linejoin="round"/>
          <g stroke="#121816" stroke-width="0.85" stroke-linecap="round" fill="none" opacity="0.6">
            <path d="M 262 142 L 274 128 L 266 118"/>
            <path d="M 282 124 L 294 110 L 286 100"/>
            <path d="M 302 106 L 314 92 L 306 84"/>
          </g>
          <path d="M 342 68 L 386 192 L 418 218 L 434 220" fill="none" stroke="#121816" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="343" cy="68" r="4" fill="#FFFFFF" stroke="#121816" stroke-width="1.5"/>
        </g>
      </g>

      ${showAnnotations ? `
      <g font-family="JetBrains Mono, monospace" font-size="10.5">
        <line x1="48" y1="32" x2="108" y2="24" stroke="#424B47" stroke-width="0.8" stroke-dasharray="2 2"/>
        <circle cx="108" cy="24" r="3" fill="#FFFFFF" stroke="#1D4ED8" stroke-width="1.5"/>
        <text x="116" y="27" fill="#121816">SENSOR JARAK TETANGGA</text>
        <line x1="372" y1="158" x2="438" y2="192" stroke="#424B47" stroke-width="0.8" stroke-dasharray="2 2"/>
        <circle cx="438" cy="192" r="3" fill="#FFFFFF" stroke="#B91C1C" stroke-width="1.5"/>
        <text x="348" y="208" fill="#B91C1C">LOMPATAN GAYA SOSIAL</text>
      </g>
      ` : ''}
    </svg>
  `;
}

// ============================================================================
// ASSET 2: Penampang Corong Pasir & Larva Antlion (svg-antlion-pit-cutaway)
// ============================================================================
export function renderAntlionPitCutaway(container, { progress = 0.35, w = 2, I = 35 } = {}) {
  if (!container) return;
  const p = 'alo';
  const shrink = Math.max(0.14, 1 - progress * 0.82);
  const cx = 260;
  const leftBound = cx - 155 * shrink;
  const rightBound = cx + 155 * shrink;
  const preyX = cx + 128 * shrink * Math.cos(progress * Math.PI * 3.6);
  const preyY = 74 + (1 - shrink) * 116;

  const pts = [];
  for (let k = 0; k <= 10; k++) {
    const frac = k / 10;
    const x = (cx + 152) - frac * (cx + 152 - preyX) + Math.sin(k * 2.1) * (10 * (1 - frac * 0.6));
    const y = 66 + frac * (preyY - 66) + Math.cos(k * 2.6) * 5;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  container.innerHTML = `
    <svg viewBox="0 0 520 286" class="w-full h-auto block" role="img" aria-label="Penampang corong pasir ALO dengan mangsa tergelincir">
      ${sharedDefs(p)}
      <defs>
        <clipPath id="${p}-soil-cross"><path d="M 32 72 L 100 72 L 260 206 L 420 72 L 488 72 L 488 260 L 32 260 Z"/></clipPath>
        <linearGradient id="${p}-pit-depth-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.92"/>
          <stop offset="68%" stop-color="#CBD5E1" stop-opacity="0.72"/>
          <stop offset="100%" stop-color="#1E293B" stop-opacity="0.35"/>
        </linearGradient>
        <mask id="${p}-pit-depth-mask"><rect x="0" y="0" width="520" height="286" fill="url(#${p}-pit-depth-grad)"/></mask>
        <linearGradient id="${p}-larva-bury" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="48%" stop-color="#94A3B8"/>
          <stop offset="100%" stop-color="#1E293B"/>
        </linearGradient>
        <mask id="${p}-larva-mask"><rect x="215" y="192" width="90" height="62" fill="url(#${p}-larva-bury)"/></mask>
      </defs>

      <rect x="32" y="24" width="456" height="236" rx="6" fill="#FFFFFF" stroke="rgba(18,24,22,0.14)" stroke-width="1"/>
      <rect x="${leftBound.toFixed(1)}" y="40" width="${(rightBound - leftBound).toFixed(1)}" height="172" fill="#DC2626" fill-opacity="0.09"/>
      <line x1="${leftBound.toFixed(1)}" y1="40" x2="${leftBound.toFixed(1)}" y2="212" stroke="#B91C1C" stroke-width="1.4" stroke-dasharray="4 3"/>
      <line x1="${rightBound.toFixed(1)}" y1="40" x2="${rightBound.toFixed(1)}" y2="212" stroke="#B91C1C" stroke-width="1.4" stroke-dasharray="4 3"/>

      <polygon points="100,72 260,206 420,72" fill="url(#${p}-sand-slope)" mask="url(#${p}-pit-depth-mask)"/>
      <polygon points="100,72 260,206 420,72" fill="url(#${p}-stipple)"/>

      <g clip-path="url(#${p}-soil-cross)">
        <rect x="32" y="72" width="456" height="188" fill="#EFE9DC"/>
        <rect x="32" y="148" width="456" height="112" fill="#DFD6C3"/>
        <rect x="32" y="72" width="456" height="188" fill="url(#${p}-hatch)"/>
        <rect x="32" y="72" width="456" height="188" fill="url(#${p}-stipple)"/>
      </g>

      <path d="M 32 72 L 100 72 L 260 206 L 420 72 L 488 72" fill="none" stroke="#121816" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>

      <g mask="url(#${p}-larva-mask)">
        <ellipse cx="260" cy="228" rx="22" ry="15" fill="url(#${p}-alo-grad)" stroke="#121816" stroke-width="1.5"/>
        <path d="M 244 226 L 276 226 M 246 234 L 274 234" stroke="#121816" stroke-width="0.9"/>
      </g>
      <g stroke="#121816" stroke-width="1.6" stroke-linecap="round" fill="none">
        <path d="M 251 215 C 244 202, 248 193, 256 196"/>
        <path d="M 269 215 C 276 202, 272 193, 264 196"/>
      </g>

      <polyline points="${pts.join(' ')}" fill="none" stroke="#1D4ED8" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round" marker-end="url(#${p}-arrow-goa)"/>
      <circle cx="${preyX.toFixed(1)}" cy="${preyY.toFixed(1)}" r="6" fill="#1D4ED8" stroke="#FFFFFF" stroke-width="1.6"/>

      <line x1="100" y1="52" x2="${leftBound.toFixed(1)}" y2="52" stroke="#B91C1C" stroke-width="1.35" marker-end="url(#${p}-arrow-alo)"/>
      <line x1="420" y1="52" x2="${rightBound.toFixed(1)}" y2="52" stroke="#B91C1C" stroke-width="1.35" marker-end="url(#${p}-arrow-alo)"/>

      <g font-family="JetBrains Mono, monospace" font-size="10.5">
        <text x="${Math.max(40, leftBound - 26).toFixed(1)}" y="35" fill="#B91C1C">c^t / I</text>
        <text x="${Math.min(448, rightBound - 16).toFixed(1)}" y="35" fill="#B91C1C">d^t / I</text>
        <text x="42" y="250" fill="#121816">CORONG ALO (t/T=${(progress * 100).toFixed(0)}%, w=${w}, I=${I >= 1000 ? I.toExponential(1) : I.toFixed(1)})</text>
        <circle cx="294" cy="222" r="3" fill="#FFFFFF" stroke="#B91C1C" stroke-width="1.4"/>
        <line x1="274" y1="222" x2="291" y2="222" stroke="#424B47" stroke-width="0.8" stroke-dasharray="2 2"/>
        <text x="302" y="226" fill="#121816">ELITE ANTLION</text>
      </g>
    </svg>
  `;
}

// ============================================================================
// ASSET 3: Medan Gaya Sosial GOA s(r) + Animated Swarm Circles
// ============================================================================
export function renderSocialForceField(container, { f = 0.5, l = 1.5, animPhase = 0 } = {}) {
  if (!container) return;
  const p = 'sff';
  const r0 = comfortZoneRadius(f, l);
  const cx = 165;
  const cy = 136;
  const scale = 28;
  const rComfortPx = r0 ? Math.min(104, Math.max(22, r0 * scale)) : 56;
  const rAttractPx = 112;

  let vectorsSvg = '';
  let swarmCircles = '';
  [0, 45, 90, 135, 180, 225, 270, 315].forEach((deg, idx) => {
    const rad = (deg * Math.PI) / 180;
    const isInner = idx % 2 === 0;
    const rBase = isInner ? Math.max(0.55, (r0 || 2.08) * 0.50) : Math.min(3.65, (r0 || 2.08) + 0.95);
    const val = socialForce(rBase, f, l);
    const targetR = r0 || 2.08;
    const rCurrent = rBase + (targetR - rBase) * animPhase;
    const curPx = Math.min(108, Math.max(16, rCurrent * scale));
    const len = Math.min(26, Math.max(8, Math.abs(val) * 58)) * (1 - animPhase * 0.65);
    const dir = val < 0 ? 1 : -1;
    const x1 = cx + Math.cos(rad) * curPx;
    const y1 = cy + Math.sin(rad) * curPx;
    const x2 = cx + Math.cos(rad) * (curPx + dir * len);
    const y2 = cy + Math.sin(rad) * (curPx + dir * len);
    const stroke = val < 0 ? '#B91C1C' : '#1D4ED8';
    const marker = val < 0 ? `url(#${p}-arrow-alo)` : `url(#${p}-arrow-goa)`;

    vectorsSvg += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" marker-end="${marker}"/>`;
    swarmCircles += `<circle cx="${x1.toFixed(1)}" cy="${y1.toFixed(1)}" r="4.8" fill="${val < 0 ? '#DC2626' : '#1D4ED8'}" stroke="#FFFFFF" stroke-width="1.3"/>`;
  });

  container.innerHTML = `
    <svg viewBox="0 0 330 274" class="w-full h-auto block" role="img" aria-label="Medan gaya sosial GOA dengan animasi agen menuju zona nyaman">
      ${sharedDefs(p)}
      <defs>
        <radialGradient id="${p}-ring-mask-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="78%" stop-color="#CBD5E1"/>
          <stop offset="100%" stop-color="#000000"/>
        </radialGradient>
        <mask id="${p}-outer-fade"><circle cx="${cx}" cy="${cy}" r="${rAttractPx}" fill="url(#${p}-ring-mask-grad)"/></mask>
      </defs>

      <circle cx="${cx}" cy="${cy}" r="${rAttractPx}" fill="url(#${p}-attraction-rad)" mask="url(#${p}-outer-fade)"/>
      <circle cx="${cx}" cy="${cy}" r="${rAttractPx}" fill="none" stroke="#1D4ED8" stroke-width="0.9" stroke-dasharray="3 3" opacity="0.6"/>
      <circle cx="${cx}" cy="${cy}" r="${rComfortPx.toFixed(1)}" fill="url(#${p}-rose-hatch)"/>
      <circle cx="${cx}" cy="${cy}" r="${rComfortPx.toFixed(1)}" fill="none" stroke="#121816" stroke-width="1.8"/>

      <g stroke="#424B47" stroke-width="0.7" stroke-dasharray="2 3" opacity="0.4">
        <line x1="${cx - 120}" y1="${cy}" x2="${cx + 120}" y2="${cy}"/>
        <line x1="${cx}" y1="${cy - 120}" x2="${cx}" y2="${cy + 120}"/>
      </g>

      ${vectorsSvg}
      ${swarmCircles}

      <circle cx="${cx}" cy="${cy}" r="8.5" fill="url(#${p}-goa-grad)" stroke="#121816" stroke-width="1.6"/>
      <circle cx="${cx - 2}" cy="${cy - 2}" r="2.3" fill="#FFFFFF" opacity="0.9"/>

      <g font-family="JetBrains Mono, monospace" font-size="9.8">
        <circle cx="16" cy="260" r="4" fill="url(#${p}-rose-hatch)" stroke="#B91C1C"/>
        <text x="24" y="263" fill="#B91C1C">Dorong s(r)&lt;0</text>
        <circle cx="122" cy="260" r="4" fill="#FFFFFF" stroke="#121816" stroke-width="1.5"/>
        <text x="131" y="263" fill="#121816">Nyaman r0=${r0 ? r0.toFixed(2) : 'N/A'}</text>
        <circle cx="238" cy="260" r="4" fill="#1D4ED8"/>
        <text x="247" y="263" fill="#1D4ED8">Tarik</text>
      </g>
    </svg>
  `;
}

// ============================================================================
// ASSET 4: Pipa Seeding MCT ke PSO + Step-by-Step Animated Task Placement
// ============================================================================
export function renderMctSeedingPipeline(container, { tasks, vmSpeeds, mctResult, mctPso, viewResult = null, viewLabel = '', visibleSteps = null } = {}) {
  if (!container || !mctResult) return;
  const view = viewResult || mctResult;
  const p = 'mct';
  const M = tasks.length;
  const K = vmSpeeds.length;
  const shown = visibleSteps === null ? M : Math.max(0, Math.min(M, visibleSteps));
  const maxTime = Math.max(1, mctResult.makespan, view.makespan);

  const taskSpacing = Math.min(20, 170 / Math.max(1, M));
  const taskStartY = 48 + (170 - (M - 1) * taskSpacing) / 2;
  const vmSpacing = Math.min(34, 158 / Math.max(1, K));
  const vmStartY = 54 + (158 - (K - 1) * vmSpacing) / 2;

  let splines = '';
  let taskNodes = '';
  view.schedule.forEach((item, idx) => {
    const ty = taskStartY + item.taskIdx * taskSpacing;
    const vy = vmStartY + item.vmIdx * vmSpacing;
    const isPlaced = idx < shown;
    const isLatest = idx === shown - 1 && shown < M;
    const sw = isLatest ? 2.8 : Math.min(2.4, Math.max(0.9, (item.duration / maxTime) * 4.2));
    if (isPlaced) {
      splines += `<path d="M 52 ${ty.toFixed(1)} C 96 ${ty.toFixed(1)}, 102 ${vy.toFixed(1)}, 134 ${vy.toFixed(1)}" fill="none" stroke="${isLatest ? '#B91C1C' : '#0F6B56'}" stroke-opacity="${isLatest ? '0.95' : '0.45'}" stroke-width="${sw.toFixed(2)}"/>`;
    }
    taskNodes += `<rect x="40" y="${(ty - 4.5).toFixed(1)}" width="9" height="9" rx="2" fill="${isLatest ? '#DC2626' : isPlaced ? '#0F6B56' : '#CBD5E1'}" stroke="#121816" stroke-width="0.9"/>`;
  });

  const ganttX = 160;
  const ganttW = 264;
  const barH = Math.min(22, Math.max(13, vmSpacing - 8));
  let vmLabels = '';
  let ganttBars = '';

  for (let j = 0; j < K; j++) {
    const vy = vmStartY + j * vmSpacing;
    vmLabels += `
      <rect x="135" y="${(vy - barH / 2).toFixed(1)}" width="21" height="${barH.toFixed(1)}" rx="4" fill="#EFE9DC" stroke="#121816" stroke-width="1"/>
      <text x="145.5" y="${(vy + 3.5).toFixed(1)}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#121816">V${j + 1}</text>
      <line x1="${ganttX}" y1="${vy.toFixed(1)}" x2="${ganttX + ganttW}" y2="${vy.toFixed(1)}" stroke="rgba(18,24,22,0.09)" stroke-width="0.75" stroke-dasharray="2 2"/>
    `;
  }

  let currentMakespan = 0;
  view.schedule.slice(0, shown).forEach((item, idx) => {
    if (item.end > currentMakespan) currentMakespan = item.end;
    const vy = vmStartY + item.vmIdx * vmSpacing;
    const bx = ganttX + (item.start / maxTime) * ganttW;
    const bw = Math.max(5, (item.duration / maxTime) * ganttW - 1.5);
    const isLatest = idx === shown - 1 && shown < M;
    const fill = isLatest ? `url(#${p}-alo-grad)` : item.taskIdx % 2 === 0 ? `url(#${p}-mct-grad)` : '#A7F3D0';
    const textFill = isLatest || item.taskIdx % 2 === 0 ? '#FFFFFF' : '#121816';
    ganttBars += `
      <g>
        <title>Tugas T${item.taskIdx + 1} (W=${item.weight}) -> VM V${item.vmIdx + 1}: ${item.start.toFixed(1)}s - ${item.end.toFixed(1)}s</title>
        <rect x="${bx.toFixed(1)}" y="${(vy - barH / 2).toFixed(1)}" width="${bw.toFixed(1)}" height="${barH.toFixed(1)}" rx="3"
              fill="${fill}" stroke="#121816" stroke-width="${isLatest ? '1.6' : '1'}"/>
        ${bw > 20 ? `<text x="${(bx + bw / 2).toFixed(1)}" y="${(vy + 3.5).toFixed(1)}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="600" fill="${textFill}">T${item.taskIdx + 1}</text>` : ''}
      </g>
    `;
  });

  const boxX = 472;
  const boxY = 48;
  const boxW = 142;
  const boxH = 166;
  const initFits = mctPso ? mctPso.initialFitness : [];
  const pSeed = mctPso ? mctPso.pSeed : 1;
  const injectedReady = shown >= M;
  let swarmDots = '';

  initFits.forEach((fit, idx) => {
    const isSeed = idx < pSeed;
    const angle = idx * 2.39996;
    const rad = isSeed ? 6 + (idx / Math.max(1, pSeed)) * 30 : 30 + ((idx * 17) % 44);
    const px = boxX + (isSeed ? 44 : 74) + Math.cos(angle) * rad * 0.85;
    const py = boxY + (isSeed ? 56 : 92) + Math.sin(angle) * rad * 0.72;
    const cx = Math.min(boxX + boxW - 10, Math.max(boxX + 10, px));
    const cy = Math.min(boxY + boxH - 12, Math.max(boxY + 12, py));
    const tip = `<title>Partikel #${idx + 1} (${isSeed ? 'seed MCT' : 'acak'}): makespan awal ${fit.toFixed(1)}s</title>`;
    if (idx === 0 && isSeed && injectedReady) {
      swarmDots += `
        <g>${tip}<rect x="${(cx - 8).toFixed(1)}" y="${(cy - 8).toFixed(1)}" width="16" height="16" rx="3" fill="#0F6B56" fill-opacity="0.22"/>
        <rect x="${(cx - 4.5).toFixed(1)}" y="${(cy - 4.5).toFixed(1)}" width="9" height="9" rx="2" fill="#0F6B56" stroke="#121816" stroke-width="1.3"/></g>
      `;
    } else if (isSeed && injectedReady) {
      swarmDots += `<g>${tip}<polygon points="${cx.toFixed(1)},${(cy - 4.6).toFixed(1)} ${(cx + 4.6).toFixed(1)},${cy.toFixed(1)} ${cx.toFixed(1)},${(cy + 4.6).toFixed(1)} ${(cx - 4.6).toFixed(1)},${cy.toFixed(1)}" fill="#6D28D9" stroke="#121816" stroke-width="0.9"/></g>`;
    } else {
      swarmDots += `<g>${tip}<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="2.8" fill="#64748B" fill-opacity="0.65"/></g>`;
    }
  });

  const msLineX = ganttX + (currentMakespan / maxTime) * ganttW;

  container.innerHTML = `
    <svg viewBox="0 0 630 240" class="w-full h-auto block" role="img" aria-label="Animasi langkah demi langkah balok tugas MCT masuk ke mesin tercepat lalu injeksi ke partikel PSO">
      ${sharedDefs(p)}

      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#424B47">
        <text x="16" y="22">1. BALOK TUGAS (${shown}/${M})</text>
        <text x="160" y="22">${viewResult ? `2. ${viewLabel} (K=${K})` : `2. MASUK MESIN TERCEPAT (K=${K} VM)`}</text>
        <text x="472" y="22">3. INJEKSI PSO (p=${pSeed}/${initFits.length})</text>
      </g>

      ${splines}
      ${taskNodes}
      <text x="45" y="230" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.2" fill="#424B47">Pilih min CT</text>

      <rect x="${ganttX}" y="38" width="${ganttW}" height="176" rx="6" fill="#FFFFFF" stroke="rgba(18,24,22,0.14)" stroke-width="1"/>
      ${vmLabels}
      ${ganttBars}
      ${shown > 0 ? `
        <line x1="${msLineX.toFixed(1)}" y1="34" x2="${msLineX.toFixed(1)}" y2="218" stroke="#B91C1C" stroke-width="1.7" stroke-dasharray="4 2"/>
        <text x="${ganttX + ganttW}" y="231" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#B91C1C">Makespan: ${currentMakespan.toFixed(1)}s</text>
      ` : `<text x="${ganttX + ganttW / 2}" y="132" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="12" fill="#424B47">Tekan Putar Animasi atau Langkah +1.</text>`}

      <path d="M 432 126 L 464 126" stroke="${injectedReady ? '#0F6B56' : '#94A3B8'}" stroke-width="2" marker-end="url(#${p}-arrow-mct)"/>
      <text x="448" y="117" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="${injectedReady ? '#0F6B56' : '#64748B'}">X_MCT</text>

      <rect x="${boxX}" y="${boxY}" width="${boxW}" height="${boxH}" rx="6" fill="#FFFFFF" stroke="#121816" stroke-width="1.2"/>
      <rect x="${boxX}" y="${boxY}" width="${boxW}" height="${boxH}" fill="url(#${p}-hatch)" opacity="0.45"/>
      ${swarmDots}
      <g font-family="JetBrains Mono, monospace" font-size="9" fill="#424B47">
        <rect x="476" y="222" width="7" height="7" rx="1.5" fill="#0F6B56" stroke="#121816" stroke-width="0.8"/>
        <text x="487" y="229" fill="#121816">X_MCT</text>
        <polygon points="536,222 540,226 536,230 532,226" fill="#6D28D9"/>
        <text x="544" y="229">Seed</text>
        <circle cx="578" cy="226" r="2.8" fill="#64748B"/>
        <text x="585" y="229">Acak</text>
      </g>
    </svg>
  `;
}

// ============================================================================
// ASSET 5: Skema Perbandingan Pola B (Estafet) vs Pola C (Kerja Tim)
// ============================================================================
export function renderHybridTaxonomy(container, { activePhase = 'all' } = {}) {
  if (!container) return;
  const p = 'tax';
  const opInit = activePhase === 'all' || activePhase === 'init' ? 1 : 0.25;
  const opExp = activePhase === 'all' || activePhase === 'explore' ? 1 : 0.25;
  const opExplt = activePhase === 'all' || activePhase === 'exploit' ? 1 : 0.25;

  container.innerHTML = `
    <svg viewBox="0 0 880 242" class="w-full h-auto block" role="img" aria-label="Skema perbandingan Pola B Estafet dan Pola C Kerja Tim">
      ${sharedDefs(p)}
      <defs><clipPath id="${p}-venn-clip"><circle cx="592" cy="130" r="62"/></clipPath></defs>

      <line x1="436" y1="16" x2="436" y2="228" stroke="rgba(18,24,22,0.14)" stroke-width="1" stroke-dasharray="4 4"/>

      <!-- POLA B -->
      <g>
        <text x="20" y="26" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" fill="#0F6B56">POLA B: MODEL ESTAFET (HEURISTIK -> METAHEURISTIK)</text>
        <g opacity="${opInit}" style="transition: opacity 220ms ease;">
          <rect x="24" y="74" width="136" height="106" rx="10" fill="url(#${p}-mct-grad)" stroke="#121816" stroke-width="1.75"/>
          <rect x="24" y="74" width="136" height="106" rx="10" fill="url(#${p}-hatch)"/>
          <text x="92" y="112" text-anchor="middle" font-family="Syne, sans-serif" font-size="15.5" font-weight="700" fill="#FFFFFF">MCT Greedy</text>
          <text x="92" y="133" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#D1FAE5">Langkah 1: Start Bagus</text>
          <text x="92" y="154" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#FFFFFF">Hasil: X_MCT</text>
        </g>

        <g opacity="${Math.max(opInit, opExp)}">
          <path d="M 166 127 L 228 127" stroke="#0F6B56" stroke-width="2.2" marker-end="url(#${p}-arrow-mct)"/>
          <text x="196" y="116" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="600" fill="#0F6B56">Estafet 1x</text>
        </g>

        <g opacity="${Math.max(opExp, opExplt)}" style="transition: opacity 220ms ease;">
          <ellipse cx="322" cy="127" rx="84" ry="56" fill="url(#${p}-pso-rad)" stroke="#6D28D9" stroke-width="1.8"/>
          <path d="M 272 91 A 68 42 0 0 1 378 100" fill="none" stroke="#6D28D9" stroke-width="1.5" marker-end="url(#${p}-arrow-pso)"/>
          <path d="M 374 162 A 68 42 0 0 1 268 154" fill="none" stroke="#6D28D9" stroke-width="1.5" marker-end="url(#${p}-arrow-pso)"/>
          <polygon points="388,127 394,121 400,127 394,133" fill="url(#${p}-pso-grad)" stroke="#121816" stroke-width="1.1"/>
          <text x="322" y="122" text-anchor="middle" font-family="Syne, sans-serif" font-size="14.5" font-weight="700" fill="#121816">Kawanan PSO</text>
          <text x="322" y="141" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#424B47">Langkah 2: Sempurnakan</text>
          <rect x="251" y="122" width="10" height="10" rx="2" fill="#0F6B56" stroke="#121816" stroke-width="1.1"/>
        </g>
        <text x="24" y="218" font-family="JetBrains Mono, monospace" font-size="10" fill="#424B47">Kotak MCT bekerja sekali di awal -> Berlian PSO melanjutkan.</text>
      </g>

      <!-- POLA C -->
      <g>
        <text x="462" y="26" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" fill="#B91C1C">POLA C: MODEL KERJA TIM (METAHEURISTIK + METAHEURISTIK)</text>

        <g opacity="${opExp}" style="transition: opacity 220ms ease;">
          <circle cx="592" cy="130" r="62" fill="#1D4ED8" fill-opacity="0.11" stroke="#1D4ED8" stroke-width="1.8"/>
          <text x="560" y="124" text-anchor="middle" font-family="Syne, sans-serif" font-size="14.5" font-weight="700" fill="#121816">GOA</text>
          <text x="560" y="142" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#1D4ED8">Cari Luas</text>
          <text x="560" y="156" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="#424B47">Eksplorasi</text>
        </g>

        <g opacity="${opExplt}" style="transition: opacity 220ms ease;">
          <circle cx="678" cy="130" r="62" fill="#DC2626" fill-opacity="0.11" stroke="#B91C1C" stroke-width="1.8"/>
          <text x="710" y="124" text-anchor="middle" font-family="Syne, sans-serif" font-size="14.5" font-weight="700" fill="#121816">ALO</text>
          <text x="710" y="142" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#B91C1C">Kunci Detail</text>
          <text x="710" y="156" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="#424B47">Eksploitasi</text>
        </g>

        <g clip-path="url(#${p}-venn-clip)" opacity="${Math.max(opExp, opExplt)}">
          <circle cx="678" cy="130" r="62" fill="url(#${p}-hatch)"/>
          <circle cx="678" cy="130" r="62" fill="#DC2626" fill-opacity="0.16"/>
        </g>

        <g opacity="${Math.max(opInit, Math.max(opExp, opExplt))}">
          <circle cx="635" cy="130" r="20" fill="#FFFFFF" stroke="#121816" stroke-width="1.6"/>
          <text x="635" y="127" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#121816">SELEKSI</text>
          <text x="635" y="138" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8" fill="#B91C1C">3-SAMPEL</text>

          <path d="M 744 130 L 788 130" stroke="#121816" stroke-width="1.6" marker-end="url(#${p}-arrow-ink)"/>
          <polygon points="822,106 848,130 822,154 796,130" fill="url(#${p}-alo-grad)" stroke="#121816" stroke-width="1.6"/>
          <text x="822" y="134" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" fill="#FFFFFF">ELITE</text>

          <g opacity="${opInit}">
            <path d="M 476 130 L 524 130" stroke="#424B47" stroke-width="1.4" marker-end="url(#${p}-arrow-ink)"/>
            <text x="498" y="120" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="#424B47">Init N</text>
          </g>
        </g>
        <text x="462" y="218" font-family="JetBrains Mono, monospace" font-size="10" fill="#424B47">GOA &amp; ALO saling berbagi informasi tiap iterasi hingga Elite.</text>
      </g>
    </svg>
  `;
}

// ============================================================================
// CARD VI INTERACTIVE FLOWCHART (Plain-Language + Exact Paper Eq.)
// ============================================================================
export const FLOWCHART_NODES = [
  {
    id: 'init',
    step: '01',
    title: 'Sebar Agen Awal & Cari Pimpinan',
    plain: 'Kita menyebar N belalang dan N perangkap antlion di peta pencarian. Titik yang nilainya paling bagus langsung diangkat jadi Elite (pimpinan sementara).',
    eq: 'Populasi Belalang X_i & Antlion A_j dalam [lb, ub]',
    why: 'Semua agen mulai dengan referensi tujuan yang jelas sejak iterasi pertama.'
  },
  {
    id: 'walk',
    step: '02',
    title: 'Langkah Acak & Corong Menyempit (ALO)',
    plain: 'Tiap agen melangkah acak di sekitar perangkap terpilih (Roulette Wheel) dan sekitar Elite. Makin tinggi iterasi, corong makin sempit agar langkah makin teliti.',
    eq: 'Eq. (1)-(5) & (11)-(12): c^t = c^t / I,  I = 10^w (t / T)',
    why: 'Menciptakan efek corong pasir sehingga agen tidak melompat jauh saat sudah dekat lembah terbaik.'
  },
  {
    id: 'social',
    step: '03',
    title: 'Dorong & Tarik Antar Agen (GOA)',
    plain: 'Agen yang terlalu berdekatan saling mendorong agar tidak menumpuk di satu lubang, sementara yang terlalu jauh saling menarik agar tetap bergerak bersama.',
    eq: 'Eq. (6)-(7): s(r) = f*exp(-r/l) - exp(-r)',
    why: 'Mencegah penyakit utama ALO (terjebak dini) karena kawanan terus menjaga keragaman peta.'
  },
  {
    id: 'modc',
    step: '04',
    title: 'Percepatan Pivot Eksploitasi di L/2',
    plain: 'Kunci inovasi paper: jika GOA asli butuh 100% iterasi untuk mengecilkan c, Hybrid menuntaskannya di 50% iterasi (L/2). Separuh waktu sisanya fokus memperhalus jawaban.',
    eq: 'Eq. (9) l <= L/2 linear ke c_min | Eq. (10) l > L/2 peluruhan eksponensial',
    why: 'Menyelesaikan penyakit utama GOA standar yang kehabisan iterasi untuk eksploitasi presisi.'
  },
  {
    id: 'matrix',
    step: '05',
    title: 'Seleksi Matriks 3-Kelompok (Sect. 4.7)',
    plain: 'Kandidat posisi dari GOA dan ALO digabung lalu diurutkan. Kita mengambil sebagian terbaik, rata-rata, dan terburuk agar tetap ada penjelajah cadangan.',
    eq: 'Gabung kandidat (Social + Roulette + Elite) -> Ambil Best + Mid + Worst = N',
    why: 'Menjaga keseimbangan: Best memperdalam akurasi, Worst menjaga peluang menemukan lembah baru.'
  },
  {
    id: 'catch',
    step: '06',
    title: 'Perbarui Perangkap & Simpan Elite',
    plain: 'Jika belalang menemukan titik lebih rendah dari antlion, posisi perangkap dipindah ke titik baru itu. Elite selalu diperbarui sampai iterasi L selesai.',
    eq: 'Eq. (13): Antlion_j = Grasshopper_i jika f(G_i) < f(A_j)',
    why: 'Menjamin jawaban terbaik yang pernah ditemukan tidak pernah mundur atau hilang.'
  }
];

export function renderHybridFlowchart(container, { selectedId = 'modc', onSelect } = {}) {
  if (!container) return;
  const p = 'flw';
  const coords = [
    { id: 'init', x: 14, y: 14, w: 210, h: 48 },
    { id: 'walk', x: 14, y: 84, w: 210, h: 52 },
    { id: 'social', x: 254, y: 84, w: 210, h: 52 },
    { id: 'modc', x: 254, y: 14, w: 210, h: 48 },
    { id: 'matrix', x: 108, y: 162, w: 262, h: 52 },
    { id: 'catch', x: 108, y: 236, w: 262, h: 48 }
  ];

  const nodesSvg = coords.map((box) => {
    const info = FLOWCHART_NODES.find((n) => n.id === box.id);
    const active = box.id === selectedId;
    const fill = active ? '#FCEAEA' : '#FFFFFF';
    const stroke = active ? '#B91C1C' : '#121816';
    const sw = active ? '2.2' : '1.2';
    return `
      <g class="flow-node" data-node-id="${box.id}" tabindex="0" role="button" aria-pressed="${active}">
        <rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
        <circle cx="${box.x + 14}" cy="${box.y + 16}" r="3.6" fill="${active ? '#DC2626' : '#FFFFFF'}" stroke="${active ? '#B91C1C' : '#1D4ED8'}" stroke-width="1.5"/>
        <text x="${box.x + 24}" y="${box.y + 19}" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" fill="${active ? '#B91C1C' : '#424B47'}">TAHAP ${info.step}</text>
        <text x="${box.x + 14}" y="${box.y + 37}" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#121816">${info.title}</text>
      </g>
    `;
  }).join('');

  container.innerHTML = `
    <svg viewBox="0 0 482 300" class="w-full h-auto block" role="group" aria-label="Flowchart interaktif 6 tahap Hybrid GOA-ALO">
      ${sharedDefs(p)}
      <g stroke="#121816" stroke-width="1.35" fill="none">
        <path d="M 119 62 L 119 80" marker-end="url(#${p}-arrow-ink)"/>
        <path d="M 224 38 L 250 38" marker-end="url(#${p}-arrow-ink)"/>
        <path d="M 359 62 L 359 80" stroke="#B91C1C" marker-end="url(#${p}-arrow-alo)"/>
        <path d="M 119 136 L 119 148 L 195 148 L 195 158" marker-end="url(#${p}-arrow-ink)"/>
        <path d="M 359 136 L 359 148 L 285 148 L 285 158" stroke="#1D4ED8" marker-end="url(#${p}-arrow-goa)"/>
        <path d="M 239 214 L 239 232" marker-end="url(#${p}-arrow-ink)"/>
        <path d="M 370 260 L 472 260 L 472 38 L 467 38" stroke="#424B47" stroke-dasharray="3 3" marker-end="url(#${p}-arrow-ink)"/>
      </g>
      <text x="466" y="198" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="9" fill="#424B47" transform="rotate(-90 466 198)">ULANGI l &lt; L</text>
      ${nodesSvg}
    </svg>
  `;

  container.querySelectorAll('.flow-node').forEach((el) => {
    const pick = () => onSelect && onSelect(el.dataset.nodeId);
    el.addEventListener('click', pick);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); }
    });
  });
}
