// Crisp Cartoon-Editorial Scientific SVG Charts (Card Wars 3D + Shorts Deck v5)

import { socialForce, comfortZoneRadius, computeStandardC, computeHybridC } from '../algorithms/hybrid-goa-alo.js?v=7';
import { PAPER_EMPIRICAL_DATA } from '../algorithms/benchmarks.js?v=7';

function formatSci(val) {
  if (!Number.isFinite(val)) return 'N/A';
  if (val === 0) return '0';
  const abs = Math.abs(val);
  if (abs < 0.001 || abs >= 10000) return val.toExponential(2);
  return val.toFixed(abs < 1 ? 4 : 2);
}

export function renderSocialCurveChart(container, { f = 0.5, l = 1.5 } = {}) {
  if (!container) return;
  const W = 440;
  const H = 186;
  const pad = { t: 18, r: 18, b: 30, l: 42 };
  const pw = W - pad.l - pad.r;
  const ph = H - pad.t - pad.b;

  const rMin = 0;
  const rMax = 4.5;
  const yMin = -0.8;
  const yMax = 0.45;
  const xOf = (r) => pad.l + ((r - rMin) / (rMax - rMin)) * pw;
  const yOf = (y) => pad.t + ((yMax - Math.max(yMin, Math.min(yMax, y))) / (yMax - yMin)) * ph;

  const pts = [];
  for (let i = 0; i <= 90; i++) {
    const r = rMin + (i / 90) * (rMax - rMin);
    pts.push(`${xOf(r).toFixed(1)},${yOf(socialForce(r, f, l)).toFixed(1)}`);
  }

  const yZero = yOf(0);
  const r0 = comfortZoneRadius(f, l);
  const r0Visible = r0 && r0 >= rMin && r0 <= rMax;

  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="w-full h-auto block" role="img" aria-label="Kurva fungsi gaya sosial s(r)">
      <rect x="${pad.l}" y="${pad.t}" width="${pw}" height="${ph}" rx="4" fill="#FFFFFF" stroke="rgba(18,24,22,0.14)"/>
      <rect x="${pad.l}" y="${pad.t}" width="${pw}" height="${(yZero - pad.t).toFixed(1)}" fill="#1D4ED8" fill-opacity="0.06"/>
      <rect x="${pad.l}" y="${yZero.toFixed(1)}" width="${pw}" height="${(pad.t + ph - yZero).toFixed(1)}" fill="#DC2626" fill-opacity="0.06"/>

      <line x1="${pad.l}" y1="${yZero.toFixed(1)}" x2="${pad.l + pw}" y2="${yZero.toFixed(1)}" stroke="#121816" stroke-width="1" stroke-dasharray="3 3"/>
      <polyline points="${pts.join(' ')}" fill="none" stroke="#1D4ED8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

      ${r0Visible ? `
        <line x1="${xOf(r0).toFixed(1)}" y1="${pad.t}" x2="${xOf(r0).toFixed(1)}" y2="${pad.t + ph}" stroke="#B91C1C" stroke-width="1.3" stroke-dasharray="3 2"/>
        <circle cx="${xOf(r0).toFixed(1)}" cy="${yZero.toFixed(1)}" r="4.8" fill="#FFFFFF" stroke="#B91C1C" stroke-width="2"/>
        <text x="${Math.min(pad.l + pw - 92, xOf(r0) + 6).toFixed(1)}" y="${(pad.t + 14).toFixed(1)}" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#B91C1C">r0 = ${r0.toFixed(3)}</text>
      ` : ''}

      <g font-family="JetBrains Mono, monospace" font-size="9.5" fill="#424B47">
        <text x="${pad.l - 6}" y="${pad.t + 6}" text-anchor="end">+0.45</text>
        <text x="${pad.l - 6}" y="${yZero + 3}" text-anchor="end">0.0</text>
        <text x="${pad.l - 6}" y="${pad.t + ph}" text-anchor="end">-0.80</text>
        <text x="${pad.l}" y="${H - 8}">0</text>
        <text x="${xOf(2.0).toFixed(1)}" y="${H - 8}" text-anchor="middle">Jarak r = 2.0</text>
        <text x="${pad.l + pw}" y="${H - 8}" text-anchor="end">r = 4.5</text>
        <text x="${pad.l + pw - 4}" y="${pad.t + 13}" text-anchor="end" fill="#1D4ED8">Menarik s(r) &gt; 0</text>
        <text x="${pad.l + pw - 4}" y="${pad.t + ph - 6}" text-anchor="end" fill="#B91C1C">Mendorong s(r) &lt; 0</text>
      </g>
    </svg>
  `;
}

export function renderCDecayChart(container, { L = 200, cMax = 1.0, cMin = 0.00001 } = {}) {
  if (!container) return;
  const W = 460;
  const H = 212;
  const pad = { t: 22, r: 20, b: 34, l: 46 };
  const pw = W - pad.l - pad.r;
  const ph = H - pad.t - pad.b;

  const xOf = (iter) => pad.l + (iter / L) * pw;
  const yOf = (val) => pad.t + ((cMax - Math.max(0, Math.min(cMax, val))) / Math.max(1e-6, cMax)) * ph;

  const stdPts = [];
  const hybPts = [];
  for (let i = 0; i <= 100; i++) {
    const iter = (i / 100) * L;
    stdPts.push(`${xOf(iter).toFixed(1)},${yOf(computeStandardC(iter, L, cMax, cMin)).toFixed(1)}`);
    hybPts.push(`${xOf(iter).toFixed(1)},${yOf(computeHybridC(iter, L, cMax, cMin)).toFixed(1)}`);
  }

  const xHalf = xOf(L / 2);

  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="w-full h-auto block" role="img" aria-label="Perbandingan peluruhan parameter c GOA standar dan Hybrid GOA-ALO">
      <rect x="${pad.l}" y="${pad.t}" width="${pw}" height="${ph}" rx="4" fill="#FFFFFF" stroke="rgba(18,24,22,0.14)"/>
      <rect x="${pad.l}" y="${pad.t}" width="${(xHalf - pad.l).toFixed(1)}" height="${ph}" fill="#1D4ED8" fill-opacity="0.06"/>
      <rect x="${xHalf.toFixed(1)}" y="${pad.t}" width="${(pad.l + pw - xHalf).toFixed(1)}" height="${ph}" fill="#DC2626" fill-opacity="0.06"/>

      <line x1="${xHalf.toFixed(1)}" y1="${pad.t}" x2="${xHalf.toFixed(1)}" y2="${pad.t + ph}" stroke="#B91C1C" stroke-width="1.4" stroke-dasharray="4 3"/>

      <polyline points="${stdPts.join(' ')}" fill="none" stroke="#424B47" stroke-width="1.9" stroke-dasharray="5 4"/>
      <polyline points="${hybPts.join(' ')}" fill="none" stroke="#B91C1C" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${xHalf.toFixed(1)}" cy="${yOf(cMin).toFixed(1)}" r="4.8" fill="#FFFFFF" stroke="#B91C1C" stroke-width="2"/>

      <g font-family="JetBrains Mono, monospace" font-size="9.5" fill="#424B47">
        <text x="${pad.l + 6}" y="${pad.t + 14}" fill="#1D4ED8" font-weight="600">PARUH 1: CARI LUAS (Eq. 9)</text>
        <text x="${xHalf + 6}" y="${pad.t + 14}" fill="#B91C1C" font-weight="600">PARUH 2: KUNCI PRESISI (Eq. 10)</text>
        <text x="${pad.l - 6}" y="${pad.t + 5}" text-anchor="end">${cMax.toFixed(2)}</text>
        <text x="${pad.l - 6}" y="${pad.t + ph / 2 + 3}" text-anchor="end">${(cMax / 2).toFixed(2)}</text>
        <text x="${pad.l - 6}" y="${pad.t + ph}" text-anchor="end">0</text>
        <text x="${pad.l}" y="${H - 12}">l = 0</text>
        <text x="${xHalf.toFixed(1)}" y="${H - 12}" text-anchor="middle" fill="#B91C1C" font-weight="700">Pivot L/2 = ${Math.round(L / 2)}</text>
        <text x="${pad.l + pw}" y="${H - 12}" text-anchor="end">L = ${L}</text>
      </g>

      <g font-family="JetBrains Mono, monospace" font-size="9.5">
        <line x1="${pad.l}" y1="10" x2="${pad.l + 18}" y2="10" stroke="#B91C1C" stroke-width="2.5"/>
        <text x="${pad.l + 23}" y="13" fill="#121816">Hybrid c (Eq. 9-10)</text>
        <line x1="${pad.l + 165}" y1="10" x2="${pad.l + 183}" y2="10" stroke="#424B47" stroke-width="1.8" stroke-dasharray="5 3"/>
        <text x="${pad.l + 188}" y="13" fill="#424B47">GOA Standar (Eq. 8)</text>
      </g>
    </svg>
  `;
}

export function renderMctConvergenceChart(container, { mctHistory = [], pureHistory = [], mctBaseline = null, showPure = true, cursor = null } = {}) {
  if (!container || mctHistory.length === 0) return;
  const W = 630;
  const H = 160;
  const pad = { t: 24, r: 16, b: 26, l: 50 };
  const pw = W - pad.l - pad.r;
  const ph = H - pad.t - pad.b;

  const allVals = [...mctHistory, ...(showPure ? pureHistory : []), ...(mctBaseline !== null ? [mctBaseline] : [])];
  const yMax = Math.max(...allVals) * 1.04;
  const yMin = Math.min(...allVals) * 0.96;
  const ySpan = Math.max(1e-6, yMax - yMin);
  const maxL = Math.max(1, mctHistory.length - 1);
  const xOf = (idx) => pad.l + (idx / maxL) * pw;
  const yOf = (v) => pad.t + ((yMax - v) / ySpan) * ph;
  const toPoly = (arr) => arr.map((v, idx) => `${xOf(idx).toFixed(1)},${yOf(v).toFixed(1)}`).join(' ');

  const mctFinal = mctHistory[mctHistory.length - 1];
  const pureFinal = pureHistory[pureHistory.length - 1];
  const c = cursor === null ? null : Math.max(0, Math.min(maxL, cursor));

  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" data-w="${W}" data-pl="${pad.l}" data-pw="${pw}" data-maxl="${maxL}" class="w-full h-auto block" role="img" aria-label="Kurva penurunan Makespan MCT-seeded PSO dibanding PSO murni">
      <rect x="${pad.l}" y="${pad.t}" width="${pw}" height="${ph}" rx="4" fill="#FFFFFF" stroke="rgba(18,24,22,0.14)"/>
      <line x1="${pad.l}" y1="${pad.t + ph / 2}" x2="${pad.l + pw}" y2="${pad.t + ph / 2}" stroke="rgba(18,24,22,0.08)" stroke-dasharray="3 3"/>
      ${mctBaseline !== null ? `<line x1="${pad.l}" y1="${yOf(mctBaseline).toFixed(1)}" x2="${pad.l + pw}" y2="${yOf(mctBaseline).toFixed(1)}" stroke="#0F6B56" stroke-opacity="0.55" stroke-dasharray="2 4"/>
      <text x="${pad.l + pw - 4}" y="${(yOf(mctBaseline) - 4).toFixed(1)}" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="9" fill="#0F6B56">MCT ${mctBaseline.toFixed(1)}s</text>` : ''}

      ${showPure && pureHistory.length ? `<polyline points="${toPoly(pureHistory)}" fill="none" stroke="#64748B" stroke-width="1.9" stroke-dasharray="5 3"/>` : ''}
      <polyline points="${toPoly(mctHistory)}" fill="none" stroke="#6D28D9" stroke-width="2.6" stroke-linejoin="round"/>
      <rect x="${(pad.l - 4).toFixed(1)}" y="${(yOf(mctHistory[0]) - 4).toFixed(1)}" width="8" height="8" rx="2" fill="#0F6B56" stroke="#121816" stroke-width="1.1"/>

      ${c !== null ? `
        <line x1="${xOf(c).toFixed(1)}" y1="${pad.t}" x2="${xOf(c).toFixed(1)}" y2="${pad.t + ph}" stroke="#121816" stroke-width="1.2" stroke-dasharray="3 2"/>
        <circle cx="${xOf(c).toFixed(1)}" cy="${yOf(mctHistory[c]).toFixed(1)}" r="4.2" fill="#6D28D9" stroke="#FFFFFF" stroke-width="1.5"/>
        ${showPure && pureHistory.length ? `<circle cx="${xOf(c).toFixed(1)}" cy="${yOf(pureHistory[Math.min(c, pureHistory.length - 1)]).toFixed(1)}" r="3.6" fill="#64748B" stroke="#FFFFFF" stroke-width="1.5"/>` : ''}
        <text x="${xOf(c).toFixed(1)}" y="${H - 8}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" fill="#121816">t=${c}</text>` : ''}

      <g font-family="JetBrains Mono, monospace" font-size="9.5" fill="#424B47">
        <text x="${pad.l - 6}" y="${pad.t + 6}" text-anchor="end">${yMax.toFixed(1)}s</text>
        <text x="${pad.l - 6}" y="${pad.t + ph}" text-anchor="end">${yMin.toFixed(1)}s</text>
        <text x="${pad.l}" y="${H - 8}">${c === 0 ? '' : 'Iter 0'}</text>
        <text x="${pad.l + pw}" y="${H - 8}" text-anchor="end">${c === maxL ? '' : `Iter ${maxL}`}</text>
      </g>
      <g font-family="JetBrains Mono, monospace" font-size="10">
        <line x1="${pad.l}" y1="11" x2="${pad.l + 18}" y2="11" stroke="#6D28D9" stroke-width="2.6"/>
        <text x="${pad.l + 23}" y="14" fill="#121816" font-weight="600">MCT+PSO: ${mctFinal.toFixed(2)}s</text>
        ${showPure && pureHistory.length ? `
          <line x1="${pad.l + 184}" y1="11" x2="${pad.l + 202}" y2="11" stroke="#64748B" stroke-width="1.9" stroke-dasharray="4 3"/>
          <text x="${pad.l + 207}" y="14" fill="#424B47">PSO murni (acak): ${pureFinal.toFixed(2)}s</text>
        ` : ''}
      </g>
    </svg>
  `;
}

// Partikel gbest = matriks alokasi biner (baris = VM, kolom = tugas). Sel ungu = tugas yang dipindah PSO dari jadwal MCT.
export function renderPsoMatrix(container, { assignment = [], mctAssignment = [], K = 1 } = {}) {
  if (!container || assignment.length === 0) return;
  const M = assignment.length;
  const W = 630;
  const x0 = 38;
  const y0 = 18;
  const ch = 19;
  const cw = Math.min(30, Math.floor((W - x0 - 8) / M));
  const H = y0 + K * ch + 20;
  let cells = '';
  for (let j = 0; j < K; j++) {
    cells += `<text x="${x0 - 8}" y="${y0 + j * ch + 13}" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#424B47">V${j + 1}</text>`;
    for (let k = 0; k < M; k++) {
      const on = assignment[k] === j;
      const moved = on && mctAssignment[k] !== j;
      const wasMct = !on && mctAssignment[k] === j;
      const x = x0 + k * cw;
      const y = y0 + j * ch;
      cells += `<g><title>T${k + 1} -> V${assignment[k] + 1}${mctAssignment[k] !== assignment[k] ? ` (MCT: V${mctAssignment[k] + 1})` : ' (sama dengan MCT)'}</title>
        <rect class="pso-cell" x="${x + 1}" y="${y + 1}" width="${cw - 2}" height="${ch - 2}" rx="3" fill="${on ? (moved ? '#6D28D9' : '#0F6B56') : '#F5F1E6'}" stroke="${wasMct ? '#0F6B56' : 'rgba(18,24,22,0.14)'}" stroke-width="${wasMct ? 1.4 : 0.8}" ${wasMct ? 'stroke-dasharray="2 2"' : ''}/>
        <text x="${x + cw / 2}" y="${y + 13}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" font-weight="${on ? 700 : 400}" fill="${on ? '#FFFFFF' : 'rgba(18,24,22,0.35)'}">${on ? 1 : 0}</text></g>`;
    }
  }
  let heads = '';
  for (let k = 0; k < M; k++) heads += `<text x="${x0 + k * cw + cw / 2}" y="${y0 - 6}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="#424B47">T${k + 1}</text>`;
  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="w-full h-auto block" role="img" aria-label="Matriks alokasi biner partikel gbest PSO">
      ${heads}${cells}
      <g font-family="JetBrains Mono, monospace" font-size="9" fill="#424B47">
        <rect x="${x0}" y="${H - 12}" width="8" height="8" rx="2" fill="#0F6B56"/><text x="${x0 + 12}" y="${H - 5}">sama dengan MCT</text>
        <rect x="${x0 + 118}" y="${H - 12}" width="8" height="8" rx="2" fill="#6D28D9"/><text x="${x0 + 130}" y="${H - 5}">dipindah PSO</text>
        <rect x="${x0 + 214}" y="${H - 12}" width="8" height="8" rx="2" fill="#FFFFFF" stroke="#0F6B56" stroke-dasharray="2 2"/><text x="${x0 + 226}" y="${H - 5}">posisi lama MCT</text>
      </g>
    </svg>
  `;
}

export function renderLabConvergenceChart(container, { series = [], maxIter = 150 } = {}) {
  if (!container) return;
  const W = 580;
  const H = 128;
  const pad = { t: 20, r: 16, b: 22, l: 58 };
  const pw = W - pad.l - pad.r;
  const ph = H - pad.t - pad.b;

  const flat = series.flatMap((s) => s.values).filter(Number.isFinite);
  if (flat.length === 0) return;

  const rawMin = Math.min(...flat);
  const rawMax = Math.max(...flat);
  const useLog = rawMin >= 0 && rawMax > rawMin * 30 && rawMax > 1e-6;
  const mapYVal = (v) => (useLog ? Math.log10(Math.max(1e-12, v)) : v);

  const mapped = flat.map(mapYVal);
  const yMax = Math.max(...mapped);
  const yMin = Math.min(...mapped);
  const ySpan = Math.max(1e-6, yMax - yMin);

  const xOf = (idx) => pad.l + (idx / Math.max(1, maxIter)) * pw;
  const yOf = (v) => pad.t + ((yMax - mapYVal(v)) / ySpan) * ph;
  const xHalf = xOf(maxIter / 2);

  const linesSvg = series.map((s) => {
    const pts = s.values.map((v, i) => `${xOf(i).toFixed(1)},${yOf(v).toFixed(1)}`).join(' ');
    return `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="${s.width || 2}" ${s.dash ? `stroke-dasharray="${s.dash}"` : ''} stroke-linejoin="round"/>`;
  }).join('');

  let legendX = pad.l;
  const legendSvg = series.map((s) => {
    const last = s.values[s.values.length - 1];
    const label = `${s.label}: ${formatSci(last)}`;
    const out = `
      <line x1="${legendX}" y1="10" x2="${legendX + 14}" y2="10" stroke="${s.color}" stroke-width="2.2" ${s.dash ? `stroke-dasharray="${s.dash}"` : ''}/>
      <text x="${legendX + 18}" y="13" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#121816">${label}</text>
    `;
    legendX += Math.max(130, label.length * 6.3 + 28);
    return out;
  }).join('');

  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="w-full h-auto block" role="img" aria-label="Kurva konvergensi fitness real-time laboratorium simulasi">
      <rect x="${pad.l}" y="${pad.t}" width="${pw}" height="${ph}" rx="4" fill="#FFFFFF" stroke="rgba(18,24,22,0.14)"/>
      <line x1="${xHalf.toFixed(1)}" y1="${pad.t}" x2="${xHalf.toFixed(1)}" y2="${pad.t + ph}" stroke="#B91C1C" stroke-width="1" stroke-dasharray="3 3" opacity="0.7"/>
      ${linesSvg}
      ${legendSvg}
      <g font-family="JetBrains Mono, monospace" font-size="9" fill="#424B47">
        <text x="${pad.l - 5}" y="${pad.t + 6}" text-anchor="end">${formatSci(rawMax)}</text>
        <text x="${pad.l - 5}" y="${pad.t + ph}" text-anchor="end">${formatSci(rawMin)}</text>
        <text x="${pad.l}" y="${H - 6}">0${useLog ? ' (log10)' : ''}</text>
        <text x="${xHalf.toFixed(1)}" y="${H - 6}" text-anchor="middle" fill="#B91C1C">L/2</text>
        <text x="${pad.l + pw}" y="${H - 6}" text-anchor="end">L=${maxIter}</text>
      </g>
    </svg>
  `;
}

export function renderBenchmarkChart(container, { groupKey = 'unimodal', onFocusRow } = {}) {
  const group = PAPER_EMPIRICAL_DATA[groupKey] || PAPER_EMPIRICAL_DATA.unimodal;
  if (!container) return;
  const rows = group.rows;
  const W = 560;
  const rowH = 33;
  const pad = { t: 26, r: 78, b: 18, l: 140 };
  const H = pad.t + rows.length * rowH + pad.b;
  const pw = W - pad.l - pad.r;
  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.value)));

  const colorMap = {
    hybrid: '#B91C1C',
    goa: '#1D4ED8',
    alo: '#0F6B56',
    other: '#94A3B8'
  };

  const barsSvg = rows.map((row, idx) => {
    const y = pad.t + idx * rowH;
    const bw = Math.max(8, (Math.abs(row.value) / maxAbs) * pw);
    const fill = colorMap[row.highlight] || '#94A3B8';
    const isTop = row.highlight === 'hybrid';
    return `
      <g class="bench-bar-row" data-row-idx="${idx}" tabindex="0" role="button" aria-label="${row.algo}: ${row.value}. ${row.note}" style="cursor:pointer;">
        <rect x="4" y="${y + 1}" width="${W - 8}" height="${rowH - 4}" rx="4" fill="transparent"/>
        <text x="${pad.l - 10}" y="${y + 20}" text-anchor="end" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="${isTop ? '700' : '500'}" fill="${isTop ? '#121816' : '#424B47'}">${row.algo}</text>
        <rect x="${pad.l}" y="${y + 6}" width="${bw.toFixed(1)}" height="18" rx="4" fill="${fill}" stroke="#121816" stroke-width="${isTop ? '1.3' : '0.5'}"/>
        <text x="${(pad.l + bw + 8).toFixed(1)}" y="${y + 20}" font-family="JetBrains Mono, monospace" font-size="11.5" font-weight="${isTop ? '700' : '500'}" fill="${isTop ? '#B91C1C' : '#121816'}">${row.value}${groupKey === 'antenna' ? ' dB' : ''}</text>
      </g>
    `;
  }).join('');

  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="w-full h-auto block" role="img" aria-label="${group.title}">
      <text x="${pad.l}" y="15" font-family="JetBrains Mono, monospace" font-size="10" fill="#424B47">${group.metricLabel}</text>
      <line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${H - pad.b}" stroke="#121816" stroke-width="1.2"/>
      ${barsSvg}
    </svg>
  `;

  container.querySelectorAll('.bench-bar-row').forEach((el) => {
    const idx = Number(el.dataset.rowIdx);
    const trigger = () => onFocusRow && onFocusRow(rows[idx]);
    el.addEventListener('mouseenter', trigger);
    el.addEventListener('focus', trigger);
    el.addEventListener('click', trigger);
  });
}
