// Master Interactive Controller: Card Wars 3D World + Sir Pip Intro & Comic Dialogue + Manual Shorts (v6)

import { BENCHMARK_FUNCTIONS, PAPER_EMPIRICAL_DATA } from '../algorithms/benchmarks.js?v=7';
import { generateWorkload, generateVmSpeeds, runPatternBSimulation, evaluateAssignment } from '../algorithms/mct-pso.js?v=7';
import {
  MetaheuristicRunner,
  comfortZoneRadius,
  computeStandardC,
  computeHybridC,
  computeW,
  computeI
} from '../algorithms/hybrid-goa-alo.js?v=7';
import {
  renderButler2DSvg,
  renderCoverStoryStage,
  renderIntuitionTerrain,
  renderGrasshopperSpecimen,
  renderAntlionPitCutaway,
  renderSocialForceField,
  renderMctSeedingPipeline,
  renderHybridTaxonomy,
  renderHybridFlowchart,
  FLOWCHART_NODES
} from '../viz/svg-illustrator.js?v=7';
import {
  renderSocialCurveChart,
  renderCDecayChart,
  renderMctConvergenceChart,
  renderPsoMatrix,
  renderLabConvergenceChart,
  renderBenchmarkChart
} from '../viz/svg-charts.js?v=7';
import { ThreeLabController } from '../viz/three-lab.js?v=7';
import { CardWarsWorld } from '../viz/world-3d.js?v=7';
import { ShortsStageController, INTRO_BEATS } from './shorts-stage.js?v=7';
import { DeckController, SLIDE_META, positionSlidingIndicator } from './deck.js?v=7';

function bindRangePair(baseId, { min, max, onChange }) {
  const rangeEl = document.getElementById(`${baseId}-range`);
  const numEl = document.getElementById(`${baseId}-num`);
  if (!rangeEl || !numEl) return { get: () => min, set: () => {} };

  const clamp = (raw) => {
    const v = Number(raw);
    if (!Number.isFinite(v)) return Number(rangeEl.value);
    return Math.min(max, Math.max(min, v));
  };

  rangeEl.addEventListener('input', () => {
    const v = clamp(rangeEl.value);
    numEl.value = String(v);
    onChange && onChange(v);
  });

  numEl.addEventListener('change', () => {
    const v = clamp(numEl.value);
    numEl.value = String(v);
    rangeEl.value = String(Math.min(Number(rangeEl.max), Math.max(Number(rangeEl.min), v)));
    onChange && onChange(v);
  });

  return {
    get: () => clamp(numEl.value),
    set: (v) => {
      const clamped = clamp(v);
      numEl.value = String(clamped);
      rangeEl.value = String(Math.min(Number(rangeEl.max), Math.max(Number(rangeEl.min), clamped)));
    }
  };
}

function bindSegmentedTabs(containerId, onSelect) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return () => {};
  const indicator = wrap.querySelector('.seg-indicator');
  const tabs = Array.from(wrap.querySelectorAll('.seg-tab'));

  const activate = (val, silent = false) => {
    const activeBtn = tabs.find((b) => b.dataset.value === val) || tabs[0];
    tabs.forEach((b) => {
      const isSel = b === activeBtn;
      b.setAttribute('aria-selected', String(isSel));
      b.classList.toggle('is-selected', isSel);
    });
    requestAnimationFrame(() => positionSlidingIndicator(wrap, activeBtn, indicator));
    if (!silent && onSelect) onSelect(activeBtn.dataset.value);
  };

  tabs.forEach((btn) => btn.addEventListener('click', () => activate(btn.dataset.value)));
  window.addEventListener('resize', () => {
    const activeBtn = tabs.find((b) => b.classList.contains('is-selected')) || tabs[0];
    positionSlidingIndicator(wrap, activeBtn, indicator);
  });

  activate(tabs[0]?.dataset.value, true);
  return activate;
}

function formatNum(val) {
  if (!Number.isFinite(val)) return 'N/A';
  if (val === 0) return '0';
  const abs = Math.abs(val);
  if (abs < 0.0001 || abs >= 10000) return val.toExponential(3);
  return val.toFixed(abs < 1 ? 5 : 2);
}

const INTUITION_COPY = {
  random: {
    heading: 'Tahap 1: Jika Hanya Menebak Acak',
    body: 'Jika beberapa penjelajah dijatuhkan acak tanpa koordinasi, sebagian besar langsung puas dan terjebak di lubang dangkal (Optimum Lokal) tanpa sadar ada lembah yang jauh lebih dalam di sebelah kanan.'
  },
  explore: {
    heading: 'Tahap 2: Eksplorasi (Menyebar Luas ala GOA)',
    body: 'Penjelajah (lingkaran biru) saling memberi jarak dan melompat melintasi bukit. Fase Eksplorasi memetakan wilayah luas agar lembah terdalam (Optimum Global) berhasil terlihat.'
  },
  exploit: {
    heading: 'Tahap 3: Eksploitasi (Mengerucut Presisi ala ALO)',
    body: 'Begitu wilayah lembah terdalam ditemukan, area pencarian dipersempit seperti corong pasir (segitiga merah) sehingga semua titik meluncur halus menuju dasar terbaik.'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- FULL-VIEWPORT 3D CARD WARS WORLD + SIR PIP BUTLER ---
  const hudRenderToggle = document.getElementById('hud-render-toggle');
  const world = new CardWarsWorld({
    webglContainer: document.getElementById('world-webgl-mount'),
    fallbackContainer: document.getElementById('world-2d-fallback'),
    onModeChange(mode) {
      if (hudRenderToggle) {
        hudRenderToggle.textContent = mode === 'webgl' ? 'Meja: 3D' : 'Meja: 2D';
      }
    }
  });
  world.init(false).then(() => syncWorldGpuState());

  hudRenderToggle?.addEventListener('click', () => {
    world.set2DMode(world.mode === 'webgl');
  });

  // --- LIVE LOOPING BEAT ANIMATION REGISTRY (Auto-cleaned on every beat/card/tab switch) ---
  let beatLoopRaf = null;
  let beatLoopTimer = null;

  function stopBeatLoop() {
    if (beatLoopRaf) { cancelAnimationFrame(beatLoopRaf); beatLoopRaf = null; }
    if (beatLoopTimer) { clearInterval(beatLoopTimer); beatLoopTimer = null; }
  }

  function startRafLoop(renderFn, periodMs = 2800) {
    stopBeatLoop();
    if (prefersReducedMotion) {
      renderFn(0.75);
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const cyc = ((now - start) % periodMs) / periodMs;
      // Smooth ping-pong [0.12 .. 0.96] so shapes breathe & glide gently without jarring reset
      const smooth = 0.5 - 0.5 * Math.cos(cyc * Math.PI * 2);
      renderFn(0.12 + smooth * 0.84);
      beatLoopRaf = requestAnimationFrame(tick);
    };
    beatLoopRaf = requestAnimationFrame(tick);
  }

  // --- CARD I: COVER 3-SUIT SHAPE THEATER ---
  let coverFocus = 'all';
  function setCoverFocus(focus = 'all', loop = true) {
    coverFocus = focus;
    document.querySelectorAll('.cover-chapter-btn').forEach((btn) => {
      const active = btn.dataset.focus === focus;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    const el = document.getElementById('cover-story-svg');
    if (loop) {
      startRafLoop((phaseT) => renderCoverStoryStage(el, { focus, phaseT }), 3200);
    } else {
      renderCoverStoryStage(el, { focus, phaseT: 0.72 });
    }
  }

  document.querySelectorAll('.cover-chapter-btn').forEach((btn) => {
    btn.addEventListener('click', () => setCoverFocus(btn.dataset.focus, true));
  });
  document.getElementById('cover-replay-btn')?.addEventListener('click', () => setCoverFocus(coverFocus, true));

  // --- CARD II: BEGINNER INTUITION ---
  let intuitionStage = 'random';
  let intuitionSeqTimer = null;

  function stopIntuitionSeq() {
    if (intuitionSeqTimer) { clearTimeout(intuitionSeqTimer); intuitionSeqTimer = null; }
  }

  function setIntuitionStage(stage, loop = true) {
    stopIntuitionSeq();
    intuitionStage = stage;
    document.querySelectorAll('.stage-step-btn').forEach((btn) => {
      const active = btn.dataset.stage === stage;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    const copy = INTUITION_COPY[stage] || INTUITION_COPY.random;
    document.getElementById('intuition-explain-title').textContent = copy.heading;
    document.getElementById('intuition-explain-body').textContent = copy.body;

    const targetEl = document.getElementById('intuition-terrain-svg');
    if (loop) {
      startRafLoop((phaseT) => renderIntuitionTerrain(targetEl, { stage, phaseT }), 2800);
    } else {
      renderIntuitionTerrain(targetEl, { stage, phaseT: 1 });
    }
  }

  document.querySelectorAll('.stage-step-btn').forEach((btn) => {
    btn.addEventListener('click', () => setIntuitionStage(btn.dataset.stage, true));
  });
  document.getElementById('intuition-replay-btn')?.addEventListener('click', () => {
    setIntuitionStage('random', true);
    intuitionSeqTimer = setTimeout(() => {
      setIntuitionStage('explore', true);
      intuitionSeqTimer = setTimeout(() => setIntuitionStage('exploit', true), 2000);
    }, 2000);
  });
  renderIntuitionTerrain(document.getElementById('intuition-terrain-svg'), { stage: 'random', phaseT: 0.8 });

  // --- CARD III: TAXONOMY ---
  const taxSvg = document.getElementById('tax-svg');
  renderHybridTaxonomy(taxSvg, { activePhase: 'all' });
  const syncTaxTabs = bindSegmentedTabs('tax-tabs', (phase) => renderHybridTaxonomy(taxSvg, { activePhase: phase }));

  // --- CARD IV: POLA B (MCT-SEEDED PSO) ---
  const mctWeightsInput = document.getElementById('mct-weights');
  const mctPresetSelect = document.getElementById('mct-preset');
  const mctComparePure = document.getElementById('mct-compare-pure');
  const psoIterRange = document.getElementById('pso-iter-range');
  const psoIterReadout = document.getElementById('pso-iter-readout');
  const convEl = document.getElementById('mct-conv-svg');
  let latestMctContext = null;
  let latestPso = null;
  let mctShownSteps = null;
  let psoIter = 0;
  let mctViewMode = 'mct';
  let psoPlayTimer = null;

  function stopPsoPlay() {
    clearInterval(psoPlayTimer);
    psoPlayTimer = null;
    const b = document.getElementById('pso-iter-play');
    if (b) b.textContent = 'Putar Iterasi PSO';
  }

  function stopMctStepAnim() {
    stopBeatLoop();
    const playBtn = document.getElementById('mct-anim-play');
    if (playBtn) playBtn.textContent = 'Putar Animasi MCT';
  }

  const mctM = bindRangePair('mct-M', { min: 4, max: 16, onChange: () => { syncWorkloadInput(); runCardIV(); } });
  const mctK = bindRangePair('mct-K', { min: 2, max: 6, onChange: () => runCardIV() });
  const mctSeedRatio = bindRangePair('mct-seed-ratio', { min: 10, max: 100, onChange: () => runCardIV() });
  const mctN = bindRangePair('mct-N', { min: 10, max: 100, onChange: () => runCardIV() });
  const mctL = bindRangePair('mct-L', { min: 20, max: 200, onChange: () => runCardIV() });
  const mctWmax = bindRangePair('mct-wmax', { min: 0.5, max: 1.0, onChange: () => runCardIV() });
  const mctWmin = bindRangePair('mct-wmin', { min: 0.1, max: 0.6, onChange: () => runCardIV() });
  const mctC1 = bindRangePair('mct-c1', { min: 0.5, max: 3.0, onChange: () => runCardIV() });
  const mctC2 = bindRangePair('mct-c2', { min: 0.5, max: 3.0, onChange: () => runCardIV() });

  function syncWorkloadInput() {
    mctWeightsInput.value = generateWorkload(mctM.get(), mctPresetSelect.value, 42).join(', ');
  }

  function parseWeights() {
    const raw = mctWeightsInput.value.split(',').map((s) => Number(s.trim())).filter((v) => Number.isFinite(v) && v > 0);
    return raw.length >= 2 ? raw.slice(0, 16) : generateWorkload(mctM.get(), mctPresetSelect.value, 42);
  }

  function redrawMctPipeline() {
    if (!latestMctContext) return;
    renderMctSeedingPipeline(document.getElementById('mct-pipeline-svg'), { ...latestMctContext, visibleSteps: mctShownSteps });
  }

  function startMctLoopAnim(loopForever = true) {
    if (!latestMctContext) return;
    stopBeatLoop();
    const total = latestMctContext.tasks.length;
    if (prefersReducedMotion) {
      mctShownSteps = total;
      redrawMctPipeline();
      return;
    }
    mctShownSteps = 0;
    redrawMctPipeline();
    const playBtn = document.getElementById('mct-anim-play');
    if (playBtn) playBtn.textContent = 'Jeda Animasi';
    let pauseTicks = 0;
    beatLoopTimer = setInterval(() => {
      if (mctShownSteps < total) {
        mctShownSteps += 1;
        redrawMctPipeline();
      } else if (loopForever) {
        pauseTicks += 1;
        if (pauseTicks >= 4) {
          pauseTicks = 0;
          mctShownSteps = 0;
          redrawMctPipeline();
        }
      } else {
        stopMctStepAnim();
      }
    }, 380);
  }

  // Gambar ulang semua panel yang bergantung pada iterasi t dan tab jadwal.
  function paintCardIV() {
    if (!latestPso) return;
    const { tasks, vmSpeeds, mctResult, mctPso, purePso } = latestPso;
    const t = Math.max(0, Math.min(mctPso.history.length - 1, psoIter));
    const showPure = mctComparePure.checked;
    const gAssign = mctPso.assignHistory[t];
    latestMctContext = {
      tasks, vmSpeeds, mctResult, mctPso,
      viewResult: mctViewMode === 'pso' ? evaluateAssignment(gAssign, tasks, vmSpeeds) : null,
      viewLabel: `GBEST PSO t=${t}`
    };
    redrawMctPipeline();
    renderMctConvergenceChart(convEl, {
      mctHistory: mctPso.history,
      pureHistory: purePso.history,
      mctBaseline: mctResult.makespan,
      showPure,
      cursor: t
    });
    renderPsoMatrix(document.getElementById('pso-matrix-svg'), { assignment: gAssign, mctAssignment: mctResult.assignment, K: vmSpeeds.length });
    psoIterReadout.textContent = `t = ${t} | MCT+PSO ${mctPso.history[t].toFixed(2)} s` + (showPure ? ` | PSO ${purePso.history[Math.min(t, purePso.history.length - 1)].toFixed(2)} s` : '');
    if (psoIterRange.value !== String(t)) psoIterRange.value = String(t);
  }

  function runCardIV() {
    stopMctStepAnim();
    stopPsoPlay();
    const tasks = parseWeights();
    const vmSpeeds = generateVmSpeeds(mctK.get());
    const wMax = mctWmax.get();
    const result = runPatternBSimulation({
      tasks, vmSpeeds,
      popSize: mctN.get(), maxIter: mctL.get(),
      wMax, wMin: Math.min(mctWmin.get(), wMax),
      c1: mctC1.get(), c2: mctC2.get(),
      seedRatio: mctSeedRatio.get() / 100, seed: 42
    });

    latestPso = { tasks, vmSpeeds, ...result };
    mctShownSteps = tasks.length;
    psoIterRange.max = String(result.mctPso.history.length - 1);
    psoIter = result.mctPso.history.length - 1;
    paintCardIV();

    document.getElementById('mct-metric-init').textContent = `${result.mctResult.makespan.toFixed(2)} s`;
    document.getElementById('mct-metric-best').textContent = `${result.mctPso.bestMakespan.toFixed(2)} s`;
    document.getElementById('mct-metric-pure').textContent = `${result.purePso.bestMakespan.toFixed(2)} s`;
    const diff = result.purePso.bestMakespan - result.mctPso.bestMakespan;
    document.getElementById('mct-metric-gain').textContent = diff >= 0 ? `-${diff.toFixed(2)} s lebih cepat` : `+${Math.abs(diff).toFixed(2)} s`;
  }

  // Interaksi iterasi: geser slider, arahkan pointer ke grafik, atau putar otomatis.
  psoIterRange?.addEventListener('input', () => { stopPsoPlay(); psoIter = Number(psoIterRange.value); paintCardIV(); });
  const scrubFromChart = (e) => {
    const svg = convEl?.querySelector('svg');
    if (!svg || !latestPso) return;
    const r = svg.getBoundingClientRect();
    const vx = ((e.clientX - r.left) / r.width) * Number(svg.dataset.w);
    stopPsoPlay();
    psoIter = Math.max(0, Math.min(Number(svg.dataset.maxl), Math.round(((vx - Number(svg.dataset.pl)) / Number(svg.dataset.pw)) * Number(svg.dataset.maxl))));
    paintCardIV();
  };
  convEl?.addEventListener('pointermove', scrubFromChart);
  convEl?.addEventListener('pointerdown', scrubFromChart);
  document.getElementById('pso-iter-play')?.addEventListener('click', () => {
    if (psoPlayTimer) { stopPsoPlay(); return; }
    if (!latestPso) return;
    const last = latestPso.mctPso.history.length - 1;
    if (prefersReducedMotion) { psoIter = last; paintCardIV(); return; }
    if (psoIter >= last) psoIter = 0;
    document.getElementById('pso-iter-play').textContent = 'Jeda Iterasi';
    psoPlayTimer = setInterval(() => {
      psoIter += 1;
      paintCardIV();
      if (psoIter >= last) stopPsoPlay();
    }, 70);
  });
  bindSegmentedTabs('mct-view-tabs', (mode) => {
    mctViewMode = mode;
    if (latestPso) mctShownSteps = latestPso.tasks.length;
    paintCardIV();
  });

  document.getElementById('mct-anim-play')?.addEventListener('click', () => {
    if (beatLoopTimer) stopMctStepAnim();
    else startMctLoopAnim(false);
  });

  document.getElementById('mct-anim-step')?.addEventListener('click', () => {
    if (!latestMctContext) return;
    stopMctStepAnim();
    const total = latestMctContext.tasks.length;
    mctShownSteps = mctShownSteps >= total ? 1 : mctShownSteps + 1;
    redrawMctPipeline();
  });

  mctPresetSelect?.addEventListener('change', () => { syncWorkloadInput(); runCardIV(); });
  mctWeightsInput?.addEventListener('change', () => runCardIV());
  mctComparePure?.addEventListener('change', () => paintCardIV());
  document.getElementById('mct-run-btn')?.addEventListener('click', () => runCardIV());
  document.getElementById('mct-reset-btn')?.addEventListener('click', () => {
    mctM.set(10); mctK.set(3); mctSeedRatio.set(100); mctN.set(70); mctL.set(100); mctWmax.set(0.9); mctWmin.set(0.2); mctC1.set(2.0); mctC2.set(2.0);
    mctPresetSelect.value = 'skewed';
    mctComparePure.checked = true;
    syncWorkloadInput();
    runCardIV();
  });
  syncWorkloadInput();
  runCardIV();

  // --- CARD V: SINGLE ANATOMY (GOA & ALO) ---
  const anatGoaPanel = document.getElementById('anat-panel-goa');
  const anatAloPanel = document.getElementById('anat-panel-alo');

  function setAnatTabVisual(tab) {
    const isGoa = tab === 'goa';
    anatGoaPanel?.classList.toggle('hidden', !isGoa);
    anatAloPanel?.classList.toggle('hidden', isGoa);
  }

  const syncAnatTabs = bindSegmentedTabs('anat-tabs', (tab) => {
    stopBeatLoop();
    setAnatTabVisual(tab);
    if (tab === 'goa') startRafLoop((p) => updateCardVA(p), 2600);
    else startAloLoop(true);
  });

  const anatF = bindRangePair('anat-f', { min: 0.1, max: 1.5, onChange: () => { stopBeatLoop(); updateCardVA(0); } });
  const anatL = bindRangePair('anat-l', { min: 0.5, max: 3.0, onChange: () => { stopBeatLoop(); updateCardVA(0); } });

  function updateCardVA(animPhase = 0) {
    const f = anatF.get();
    const l = anatL.get();
    const r0 = comfortZoneRadius(f, l);
    const legAngle = Math.round((f - 0.5) * -18 + (l - 1.5) * 6 - animPhase * 12);
    renderGrasshopperSpecimen(document.getElementById('anat-grasshopper-svg'), { prefix: 'a5g', legAngle, showAnnotations: false });
    renderSocialForceField(document.getElementById('anat-social-field-svg'), { f, l, animPhase });
    renderSocialCurveChart(document.getElementById('anat-social-curve-svg'), { f, l });
    document.getElementById('anat-r0-readout').textContent = r0 ? `r0 = ${r0.toFixed(3)}` : 'Tidak ada akar (l = 1 / f >= 1)';
  }
  updateCardVA(0);

  document.getElementById('anat-goa-play')?.addEventListener('click', () => {
    startRafLoop((p) => updateCardVA(p), 2200);
  });

  const anatProg = bindRangePair('anat-progress', { min: 0, max: 100, onChange: () => { stopBeatLoop(); updateCardVB(); } });
  function updateCardVB() {
    const pct = anatProg.get();
    const progress = pct / 100;
    const T = 100;
    const t = Math.max(0, Math.round(progress * T));
    const w = computeW(t, T);
    const I = computeI(t, T);
    renderAntlionPitCutaway(document.getElementById('anat-pit-svg'), { progress, w, I });
    document.getElementById('anat-w-readout').textContent = `w = ${w}`;
    document.getElementById('anat-i-readout').textContent = I >= 1000 ? I.toExponential(2) : I.toFixed(2);
    document.getElementById('anat-shrink-readout').textContent = `${(100 / Math.max(1, I)).toFixed(I > 100 ? 4 : 2)}%`;
  }
  updateCardVB();

  function startAloLoop(loopForever = true) {
    stopBeatLoop();
    if (prefersReducedMotion) { anatProg.set(55); updateCardVB(); return; }
    const btn = document.getElementById('anat-alo-play');
    if (btn) btn.textContent = 'Jeda Gerak Corong';
    beatLoopTimer = setInterval(() => {
      const cur = anatProg.get();
      const next = cur >= 96 ? (loopForever ? 8 : 96) : cur + 2;
      anatProg.set(next);
      updateCardVB();
      if (!loopForever && next >= 96) {
        stopBeatLoop();
        if (btn) btn.textContent = 'Putar Mangsa Tergelincir';
      }
    }, 75);
  }

  document.getElementById('anat-alo-play')?.addEventListener('click', () => {
    if (beatLoopTimer) {
      stopBeatLoop();
      document.getElementById('anat-alo-play').textContent = 'Putar Mangsa Tergelincir';
    } else {
      startAloLoop(false);
    }
  });

  // --- CARD VI: HYBRID FLOWCHART & MODIFIED c CURVE ---
  function updateFlowchart(nodeId) {
    renderHybridFlowchart(document.getElementById('flow-svg'), { selectedId: nodeId, onSelect: updateFlowchart });
    const info = FLOWCHART_NODES.find((n) => n.id === nodeId) || FLOWCHART_NODES[0];
    document.getElementById('flow-detail-step').textContent = `TAHAP ${info.step}`;
    document.getElementById('flow-detail-title').textContent = info.title;
    document.getElementById('flow-detail-plain').textContent = info.plain;
    document.getElementById('flow-detail-eq').textContent = info.eq;
    document.getElementById('flow-detail-why').textContent = info.why;
  }
  updateFlowchart('modc');

  const cL = bindRangePair('c-L', { min: 50, max: 1000, onChange: () => updateCardVICurve() });
  const cMax = bindRangePair('c-max', { min: 0.5, max: 2.0, onChange: () => updateCardVICurve() });
  const cMin = bindRangePair('c-min', { min: 0.00001, max: 0.01, onChange: () => updateCardVICurve() });

  function updateCardVICurve() {
    const L = cL.get();
    const cmx = cMax.get();
    const cmn = cMin.get();
    renderCDecayChart(document.getElementById('c-decay-svg'), { L, cMax: cmx, cMin: cmn });
    const half = Math.round(L / 2);
    document.getElementById('c-half-std').textContent = formatNum(computeStandardC(half, L, cmx, cmn));
    document.getElementById('c-half-hyb').textContent = formatNum(computeHybridC(half, L, cmx, cmn));
  }
  updateCardVICurve();

  // --- CARD VII: THREE.JS 3D LAB ---
  let labMode = 'hybrid';
  let labPlaying = false;
  let labTimer = null;
  let prefer2D = false;
  let labRunners = [];

  const labBanner = document.getElementById('lab-state-banner');
  const labBannerText = document.getElementById('lab-state-text');
  const labPlayBtn = document.getElementById('lab-play-btn');
  const labToggleRenderBtn = document.getElementById('lab-toggle-render');
  const labFuncSelect = document.getElementById('lab-func');
  const labSeedInput = document.getElementById('lab-seed');
  const layerTrail = document.getElementById('lab-layer-trail');
  const layerVectors = document.getElementById('lab-layer-vectors');
  const layerTraps = document.getElementById('lab-layer-traps');

  const labN = bindRangePair('lab-N', { min: 10, max: 80, onChange: () => resetLab() });
  const labL = bindRangePair('lab-L', { min: 40, max: 1000, onChange: () => resetLab() });
  const labCmax = bindRangePair('lab-cmax', { min: 0.5, max: 2.0, onChange: () => resetLab() });
  const labCmin = bindRangePair('lab-cmin', { min: 0.00001, max: 0.05, onChange: () => resetLab() });
  const labF = bindRangePair('lab-f', { min: 0.1, max: 1.5, onChange: () => resetLab() });
  const labLParam = bindRangePair('lab-l', { min: 0.5, max: 3.0, onChange: () => resetLab() });
  const labSpeed = bindRangePair('lab-speed', { min: 1, max: 10, onChange: () => {} });

  const labController = new ThreeLabController(document.getElementById('lab-canvas-mount'), {
    onStateChange({ mode, message }) {
      if (labBannerText) labBannerText.textContent = message;
      if (labBanner) labBanner.classList.remove('is-hidden');
      if (labToggleRenderBtn) labToggleRenderBtn.textContent = mode === 'webgl' ? 'Ganti ke 2D Kontur' : 'Coba 3D WebGL';
      syncWorldGpuState();
    }
  });

  function getLayers() {
    return { trail: !!layerTrail?.checked, vectors: !!layerVectors?.checked, traps: !!layerTraps?.checked };
  }

  function buildLabConfig(mode) {
    return {
      mode, funcId: labFuncSelect?.value || 'F13',
      popSize: labN.get(), maxIter: labL.get(),
      cMax: labCmax.get(), cMin: labCmin.get(),
      fParam: labF.get(), lParam: labLParam.get(),
      seed: Number(labSeedInput?.value) || 42
    };
  }

  function updateLabReadouts() {
    const primary = labRunners[0];
    if (!primary) return;
    const tel = primary.getTelemetry();
    document.getElementById('tel-iter').textContent = `${tel.iter} / ${tel.maxIter}`;
    document.getElementById('tel-phase').textContent = tel.phase;
    document.getElementById('tel-c').textContent = formatNum(tel.c);
    document.getElementById('tel-wi').textContent = `w=${tel.w} | I=${tel.I >= 1000 ? tel.I.toExponential(1) : tel.I.toFixed(1)}`;
    document.getElementById('tel-elite-pos').textContent = `(${tel.elitePos[0].toFixed(3)}, ${(tel.elitePos[1] ?? 0).toFixed(3)})`;
    document.getElementById('tel-elite-fit').textContent = formatNum(tel.eliteFit);
    document.getElementById('tel-mean-fit').textContent = formatNum(tel.meanFit);

    const seriesMeta = {
      hybrid: { label: 'Hybrid GOA-ALO', color: '#B91C1C', width: 2.6 },
      goa: { label: 'GOA Murni', color: '#1D4ED8', width: 2.0, dash: '5 3' },
      alo: { label: 'ALO Murni', color: '#0F766E', width: 1.9, dash: '2 2' }
    };
    renderLabConvergenceChart(document.getElementById('lab-conv-svg'), {
      series: labRunners.map((r) => ({ ...seriesMeta[r.mode], values: r.convergence })),
      maxIter: tel.maxIter
    });
  }

  function resetLab() {
    stopLab();
    const fn = BENCHMARK_FUNCTIONS[labFuncSelect?.value || 'F13'] || BENCHMARK_FUNCTIONS.F13;
    const modes = labMode === 'compare' ? ['hybrid', 'goa', 'alo'] : [labMode];
    labRunners = modes.map((m) => new MetaheuristicRunner(buildLabConfig(m)));
    labController.setFunction(fn);
    labController.updateAgents(labRunners, getLayers());
    updateLabReadouts();
    if (labBanner && labBannerText) {
      labBannerText.textContent = 'Simulasi siap dijalankan. Tekan Jalankan (Space) atau ubah parameter.';
      labBanner.classList.remove('is-hidden');
    }
  }

  function stepLab(steps = 1) {
    if (!labRunners.length) return;
    if (labBanner) labBanner.classList.add('is-hidden');
    for (let s = 0; s < steps; s++) {
      labRunners.forEach((r) => { if (r.iter < r.maxIter) r.step(); });
    }
    labController.updateAgents(labRunners, getLayers());
    updateLabReadouts();
    if (labRunners.every((r) => r.iter >= r.maxIter)) stopLab();
  }

  function startLab() {
    if (labRunners.every((r) => r.iter >= r.maxIter)) resetLab();
    labPlaying = true;
    if (labPlayBtn) labPlayBtn.textContent = 'Jeda (Space)';
    const loopTick = () => {
      if (!labPlaying) return;
      const spd = labSpeed.get();
      stepLab(spd >= 8 ? 3 : spd >= 5 ? 2 : 1);
      labTimer = setTimeout(loopTick, Math.max(24, Math.round(220 / spd)));
    };
    loopTick();
  }

  function stopLab() {
    labPlaying = false;
    if (labTimer) { clearTimeout(labTimer); labTimer = null; }
    if (labPlayBtn) labPlayBtn.textContent = 'Jalankan (Space)';
  }

  function toggleLabPlay() {
    if (labPlaying) stopLab();
    else startLab();
  }

  const syncLabModeTabs = bindSegmentedTabs('lab-mode-tabs', (val) => { labMode = val; resetLab(); });
  labFuncSelect?.addEventListener('change', () => resetLab());
  labSeedInput?.addEventListener('change', () => resetLab());
  [layerTrail, layerVectors, layerTraps].forEach((cb) => {
    cb?.addEventListener('change', () => labController.updateAgents(labRunners, getLayers()));
  });
  labPlayBtn?.addEventListener('click', () => toggleLabPlay());
  document.getElementById('lab-step-btn')?.addEventListener('click', () => { stopLab(); stepLab(1); });
  document.getElementById('lab-reset-btn')?.addEventListener('click', () => resetLab());
  document.getElementById('lab-preset-paper-btn')?.addEventListener('click', () => {
    labN.set(40); labL.set(1000); labCmax.set(1.0); labCmin.set(0.00001); labF.set(0.5); labLParam.set(1.5);
    resetLab();
  });
  document.getElementById('lab-reseed-btn')?.addEventListener('click', () => {
    if (labSeedInput) labSeedInput.value = String(Math.floor(1 + Math.random() * 9999));
    resetLab();
  });
  labToggleRenderBtn?.addEventListener('click', async () => {
    prefer2D = labController.mode === 'webgl';
    await labController.init(prefer2D);
    labController.setFunction(BENCHMARK_FUNCTIONS[labFuncSelect?.value || 'F13']);
    labController.updateAgents(labRunners, getLayers());
    syncWorldGpuState();
  });
  labController.init(false).then(() => resetLab());

  // --- CARD VIII: EMPIRICAL BENCHMARKS ---
  function renderCardVIII(groupKey) {
    const group = PAPER_EMPIRICAL_DATA[groupKey] || PAPER_EMPIRICAL_DATA.unimodal;
    document.getElementById('bench-title').textContent = group.title;
    document.getElementById('bench-subtitle').textContent = group.subtitle;
    const showRow = (row) => {
      document.getElementById('bench-tooltip-algo').textContent = row.algo;
      document.getElementById('bench-tooltip-val').textContent = `${row.value}${groupKey === 'antenna' ? ' dB' : ''}`;
      document.getElementById('bench-tooltip-note').textContent = row.note;
    };
    renderBenchmarkChart(document.getElementById('bench-chart-svg'), { groupKey, onFocusRow: showRow });
    showRow(group.rows[0]);

    const metricsWrap = document.getElementById('bench-key-metrics');
    if (metricsWrap) {
      metricsWrap.innerHTML = group.keyMetrics.map((m) => `
        <div class="telemetry-cell">
          <span class="telemetry-k">${m.label}</span>
          <span class="telemetry-v">${m.value}</span>
        </div>
      `).join('');
    }
  }
  const syncBenchTabs = bindSegmentedTabs('bench-tabs', (key) => renderCardVIII(key));
  renderCardVIII('unimodal');

  // --- CARD IX: DECISION MATRIX ---
  const decisionState = { domain: 'discrete', budget: 'tight', prior: 'heuristic' };
  function updateDecisionMatrix() {
    let scoreB = 0;
    let scoreC = 0;
    if (decisionState.domain === 'discrete') scoreB += 2; else scoreC += 2;
    if (decisionState.budget === 'tight') scoreB += 1; else scoreC += 1;
    if (decisionState.prior === 'heuristic') scoreB += 1; else scoreC += 1;

    document.getElementById('dec-card-b')?.classList.toggle('is-recommended-mct', scoreB >= scoreC);
    document.getElementById('dec-card-c')?.classList.toggle('is-recommended-alo', scoreC >= scoreB);

    const sumEl = document.getElementById('dec-summary');
    if (sumEl) {
      if (scoreB > scoreC) {
        sumEl.textContent = 'Pilihan paling tepat: Pola B (MCT-seeded PSO). Untuk penjadwalan diskrit dengan heuristik cepat, MCT langsung memberi start rapi dengan overhead ringan.';
      } else if (scoreC > scoreB) {
        sumEl.textContent = 'Pilihan paling tepat: Pola C (Hybrid GOA-ALO). Untuk peta pencarian kontinu multimodal, kerja tim GOA + ALO dan pivot c di L/2 memberi peluang tertinggi menyentuh optimum global.';
      } else {
        sumEl.textContent = 'Profil seimbang: pilih Pola B bila kecepatan CPU lebih utama, atau Pola C bila akurasi global lebih diprioritaskan dibanding biaya CPU (213 s vs 67 s pada uji antena LAA).';
      }
    }
  }

  document.querySelectorAll('.decision-opt').forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      decisionState[group] = btn.dataset.value;
      document.querySelectorAll(`.decision-opt[data-group="${group}"]`).forEach((b) => {
        const active = b === btn;
        b.setAttribute('aria-pressed', String(active));
        b.classList.toggle('btn-goa', active);
      });
      updateDecisionMatrix();
    });
  });
  updateDecisionMatrix();

  // --- SCENE 0: INTRO CONTROLLER (BEFORE FLIPPING CARD I) ---
  let introStep = 0;
  const introBadge = document.getElementById('intro-butler-badge');
  const introMoodPill = document.getElementById('intro-mood-pill');
  const introTitle = document.getElementById('intro-title');
  const introBody = document.getElementById('intro-body');
  const introNextBtn = document.getElementById('intro-next-btn');
  const introSkipBtn = document.getElementById('intro-skip-btn');
  const introDots = Array.from(document.querySelectorAll('#intro-step-dots .intro-dot'));

  function renderIntroStep(stepIdx = 0) {
    introStep = Math.max(0, Math.min(INTRO_BEATS.length - 1, stepIdx));
    const item = INTRO_BEATS[introStep];
    renderButler2DSvg(introBadge, { mood: item.mood, compact: true });
    if (introMoodPill) introMoodPill.textContent = item.pill;
    if (introTitle) introTitle.textContent = item.title;
    if (introBody) introBody.innerHTML = item.bodyHtml;
    if (introNextBtn) introNextBtn.textContent = item.cta;
    introDots.forEach((d, i) => d.classList.toggle('is-active', i <= introStep));
    world.setCameraMode('intro');
    world.setButlerMood(item.mood);
    world.setCardFaceState({ suit: 'concept', roman: 'I', faceDown: true });
  }

  function advanceIntro() {
    if (introStep < INTRO_BEATS.length - 1) {
      renderIntroStep(introStep + 1);
    } else {
      // Transition cleanly from Intro -> Card I face-down on table ready for the user to flip!
      deck.setIntro(false, { silent: true });
      deck.selectCard(0, { forceFaceDownFirst: true, animateDeal: true });
    }
  }

  introNextBtn?.addEventListener('click', () => advanceIntro());
  introSkipBtn?.addEventListener('click', () => {
    deck.setIntro(false, { silent: true });
    deck.selectCard(0, { forceFaceDownFirst: true, animateDeal: true });
  });

  // --- GPU HANDOFF ORCHESTRATOR (Only ONE WebGL loop runs at a time!) ---
  let deck = null;
  let shorts = null;

  function syncWorldGpuState() {
    if (!deck || !shorts) return;
    const onCardVIIOpen = !deck.isIntro && deck.current === 6 && !deck.isFaceDown && !deck.peekMode;
    const labNeedsWebGL = onCardVIIOpen && labController.mode === 'webgl';

    labController.setActive(!document.hidden && onCardVIIOpen);
    if (!onCardVIIOpen && labPlaying) stopLab();

    if (document.hidden || labNeedsWebGL) {
      world.pause();
    } else {
      world.resume();
    }
  }

  // --- MANUAL STEP-BY-STEP SHORTS STAGE CONTROLLER ---
  shorts = new ShortsStageController({
    onBeatChange(beat) {
      stopBeatLoop();
      stopIntuitionSeq();
      world.setButlerMood(beat.mood);

      const [domain, sub] = (beat.action || '').split(':');

      if (domain === 'cover') {
        setCoverFocus(sub || 'all', true);
      } else if (domain === 'intuition') {
        setIntuitionStage(sub || 'random', true);
      } else if (domain === 'taxonomy') {
        const phase = sub || 'all';
        renderHybridTaxonomy(taxSvg, { activePhase: phase });
        requestAnimationFrame(() => syncTaxTabs(phase, true));
      } else if (domain === 'mct') {
        if (sub === 'step0') {
          mctShownSteps = 2;
          redrawMctPipeline();
        } else if (sub === 'animate') {
          startMctLoopAnim(true);
        } else {
          mctShownSteps = latestMctContext ? latestMctContext.tasks.length : 10;
          redrawMctPipeline();
        }
      } else if (domain === 'single') {
        const tab = sub === 'alo' ? 'alo' : 'goa';
        setAnatTabVisual(tab);
        requestAnimationFrame(() => syncAnatTabs(tab, true));
        if (tab === 'goa') startRafLoop((p) => updateCardVA(p), 2600);
        else startAloLoop(true);
      } else if (domain === 'hybrid') {
        updateFlowchart(sub || 'modc');
        updateCardVICurve();
      } else if (domain === 'lab') {
        if (sub === 'compare') {
          labMode = 'compare';
          resetLab();
        }
        requestAnimationFrame(() => {
          syncLabModeTabs(labMode, true);
          labController.resize();
        });
      } else if (domain === 'bench') {
        const group = sub || 'unimodal';
        renderCardVIII(group);
        requestAnimationFrame(() => syncBenchTabs(group, true));
      } else if (domain === 'synth') {
        updateDecisionMatrix();
      }

      syncWorldGpuState();
    },
    onNextCard(nextIdx) {
      deck?.selectCard(nextIdx);
    },
    onRevealCard() {
      deck?.revealCurrent();
    }
  });

  // --- DECK CONTROLLER ---
  deck = new DeckController({
    onIntroChange(active) {
      if (active) {
        stopBeatLoop();
        stopIntuitionSeq();
        renderIntroStep(0);
        syncWorldGpuState();
      }
    },
    onSlideChange(idx, meta, isFaceDown, isDeal) {
      stopBeatLoop();
      stopIntuitionSeq();

      if (isDeal) {
        world.triggerCardDeal({ suit: meta.suit, roman: meta.roman, faceDown: isFaceDown });
      } else {
        world.setCardFaceState({ suit: meta.suit, roman: meta.roman, faceDown: isFaceDown });
      }

      // Keep Sir Pip cleanly framed in upper-left above his Comic Speech Bubble on both closed & opened cards
      world.setCameraMode('focus');

      if (isFaceDown) {
        world.setButlerMood('deal');
        shorts.showClosedCardDialogue(meta);
        syncWorldGpuState();
      } else {
        shorts.loadCard(idx, { beatIdx: 0 });
      }
    },
    onSpaceKey() {
      if (deck.isIntro) {
        advanceIntro();
        return;
      }
      const beat = shorts.getCurrentBeat();
      if (deck.current === 6 && beat.effectiveMode === 'interactive') {
        toggleLabPlay();
      } else {
        shorts.nextBeat();
      }
    },
    onBeatNav(dir) {
      if (dir > 0) shorts.nextBeat();
      else shorts.prevBeat();
    },
    onPeekChange(peeking) {
      if (peeking) {
        stopBeatLoop();
        world.setCameraMode('peek');
        world.setButlerMood('greet');
      } else if (deck.isIntro) {
        renderIntroStep(introStep);
      } else {
        world.setCameraMode('focus');
        if (deck.isFaceDown) {
          world.setButlerMood('deal');
        } else {
          const curBeat = shorts.getCurrentBeat();
          world.setButlerMood(curBeat.mood);
          shorts.goToBeat(curBeat.beatIdx);
        }
      }
      syncWorldGpuState();
    }
  });

  document.getElementById('btn-start-deck')?.addEventListener('click', () => deck.selectCard(1));
  document.getElementById('btn-jump-lab')?.addEventListener('click', () => {
    deck.goTo(6);
    shorts.goToBeat(2);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopBeatLoop();
      stopIntuitionSeq();
      if (labPlaying) stopLab();
    }
    syncWorldGpuState();
  });

  window.addEventListener('resize', () => {
    world.resize();
    labController.resize();
  });

  // Sync initial startup view (Intro or direct #hash card)
  if (deck.isIntro) {
    renderIntroStep(0);
  } else {
    const initMeta = SLIDE_META[deck.current] || SLIDE_META[0];
    world.setCardFaceState({ suit: initMeta.suit, roman: initMeta.roman, faceDown: deck.isFaceDown });
  }
  syncWorldGpuState();
});
