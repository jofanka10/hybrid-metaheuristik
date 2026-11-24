// Pola C: Hybrid GOA-ALO (Amaireh, Al-Zoubi, & Dib, 2023)
// Implements Eq. (1)-(13), modified c at L/2, staircase w & I, and 3-tier fitness matrix selection.
// Also provides pure GOA and pure ALO modes for real-time 3-way comparison.

import { BENCHMARK_FUNCTIONS, createRng } from './benchmarks.js';

// Eq. (6): Social interaction force s(r) = f * exp(-r/l) - exp(-r)
export function socialForce(r, f = 0.5, l = 1.5) {
  return f * Math.exp(-r / l) - Math.exp(-r);
}

// Comfortable zone root where s(r) = 0 -> r0 = (l * ln(1/f)) / (l - 1) when l != 1
export function comfortZoneRadius(f = 0.5, l = 1.5) {
  if (f <= 0 || Math.abs(l - 1) < 1e-6) return null;
  const r = (l * Math.log(1 / f)) / (l - 1);
  return Number.isFinite(r) && r > 0 ? r : null;
}

// Eq. (8): Standard GOA linear c decay
export function computeStandardC(iter, maxIter, cMax = 1.0, cMin = 0.00001) {
  const L = Math.max(1, maxIter);
  const l = Math.min(L, Math.max(0, iter));
  return Math.max(cMin, cMax - l * ((cMax - cMin) / L));
}

// Eq. (9) & (10): Modified Hybrid GOA-ALO c decay pivoting at L/2
export function computeHybridC(iter, maxIter, cMax = 1.0, cMin = 0.00001) {
  const L = Math.max(2, maxIter);
  const l = Math.min(L, Math.max(0, iter));
  const half = L / 2;
  if (l <= half) {
    return Math.max(cMin, cMax - l * ((cMax - cMin) / half));
  }
  // Safe exponent guard to avoid Infinity/NaN for l > 300 in IEEE-754 doubles
  const denom = l <= 300 ? L * Math.pow(10, l) : Infinity;
  return denom === Infinity ? 0 : (L - l + 1) * (cMin / denom);
}

// Eq. (12) / Fig. 3: Staircase w
export function computeW(iter, maxIter) {
  const ratio = iter / Math.max(1, maxIter);
  if (ratio > 0.95) return 6;
  if (ratio > 0.9) return 5;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.1) return 2;
  return 1;
}

// Eq. (11)-(12): Trap shrinking ratio I = 10^w * (t / T)
export function computeI(iter, maxIter) {
  if (iter <= 0) return 1;
  const w = computeW(iter, maxIter);
  const ratio = iter / Math.max(1, maxIter);
  return Math.max(1, Math.pow(10, w) * ratio);
}

// Eq. (1)-(5) & (11): Normalized cumulative random walk around an antlion
export function randomWalkAround(antlionPos, iter, maxIter, lb, ub, rng) {
  const I = computeI(iter, maxIter);
  const cBound = lb / I;
  const dBound = ub / I;
  const dim = antlionPos.length;
  const result = new Array(dim);

  // ponytail: cap walk sample horizon at 120 steps for 60fps interactive stepping; statistical min-max envelope matches full L
  const walkSteps = Math.max(20, Math.min(maxIter, 120));
  const targetStep = Math.max(1, Math.min(walkSteps, Math.round((iter / Math.max(1, maxIter)) * walkSteps)));

  for (let d = 0; d < dim; d++) {
    // Eq. (4)-(5): hypersphere around antlion
    const c_i = rng() < 0.5 ? antlionPos[d] + cBound : antlionPos[d] - cBound;
    const d_i = rng() < 0.5 ? antlionPos[d] + dBound : antlionPos[d] - dBound;
    const lo = Math.max(lb, Math.min(c_i, d_i));
    const hi = Math.min(ub, Math.max(c_i, d_i));

    // Eq. (1)-(2): cumulative random walk
    let acc = 0;
    let minW = 0;
    let maxW = 0;
    let valAtT = 0;
    for (let s = 1; s <= walkSteps; s++) {
      acc += rng() > 0.5 ? 1 : -1;
      if (acc < minW) minW = acc;
      if (acc > maxW) maxW = acc;
      if (s === targetStep) valAtT = acc;
    }

    // Eq. (3): min-max normalization into [lo, hi]
    const span = maxW - minW;
    const norm = span > 0 ? (valAtT - minW) / span : 0.5;
    const x = lo + norm * (hi - lo);
    result[d] = Math.min(ub, Math.max(lb, x));
  }
  return result;
}

// Minimization-safe Roulette Wheel selection (handles negative fitness like F31)
export function rouletteWheelSelect(fitnesses, rng) {
  const n = fitnesses.length;
  let minFit = Infinity;
  for (let i = 0; i < n; i++) {
    if (fitnesses[i] < minFit) minFit = fitnesses[i];
  }
  const weights = new Array(n);
  let total = 0;
  for (let i = 0; i < n; i++) {
    const shifted = fitnesses[i] - minFit;
    const w = 1 / (1 + shifted);
    weights[i] = w;
    total += w;
  }
  const pick = rng() * total;
  let acc = 0;
  for (let i = 0; i < n; i++) {
    acc += weights[i];
    if (acc >= pick) return i;
  }
  return n - 1;
}

function clampVec(vec, lb, ub) {
  return vec.map((v) => Math.min(ub, Math.max(lb, v)));
}

export class MetaheuristicRunner {
  constructor(options = {}) {
    this.configure(options);
  }

  configure(options = {}) {
    this.mode = options.mode || 'hybrid'; // 'hybrid' | 'goa' | 'alo'
    this.funcId = options.funcId || 'F13';
    this.fn = BENCHMARK_FUNCTIONS[this.funcId] || BENCHMARK_FUNCTIONS.F13;
    this.dim = options.dim || 2;
    this.popSize = Math.max(6, Math.min(120, Math.round(options.popSize || 40)));
    this.maxIter = Math.max(10, Math.min(1000, Math.round(options.maxIter || 150)));
    this.cMax = Number.isFinite(options.cMax) ? options.cMax : 1.0;
    this.cMin = Number.isFinite(options.cMin) ? options.cMin : 0.00001;
    this.fParam = Number.isFinite(options.fParam) ? options.fParam : 0.5;
    this.lParam = Number.isFinite(options.lParam) ? options.lParam : 1.5;
    this.seed = Number.isFinite(options.seed) ? options.seed : 42;
    this.reset();
  }

  reset() {
    this.rng = createRng(this.seed);
    this.iter = 0;
    const { lb, ub } = this.fn;
    const span = ub - lb;

    this.grasshoppers = [];
    this.grasshopperFit = [];
    this.antlions = [];
    this.antlionFit = [];
    this.socialVectors = [];
    this.searchHistory = [];

    for (let i = 0; i < this.popSize; i++) {
      const g = [];
      const a = [];
      for (let d = 0; d < this.dim; d++) {
        g.push(lb + this.rng() * span);
        a.push(lb + this.rng() * span);
      }
      this.grasshoppers.push(g);
      this.grasshopperFit.push(this.fn.evaluate(g));
      this.antlions.push(a);
      this.antlionFit.push(this.fn.evaluate(a));
      this.socialVectors.push(new Array(this.dim).fill(0));
    }

    this.elitePos = [...this.antlions[0]];
    this.eliteFit = this.antlionFit[0];
    this._refreshElite();

    this.convergence = [this.eliteFit];
    this.recordHistory();
  }

  _refreshElite() {
    for (let i = 0; i < this.popSize; i++) {
      if (this.antlionFit[i] < this.eliteFit) {
        this.eliteFit = this.antlionFit[i];
        this.elitePos = [...this.antlions[i]];
      }
      if (this.grasshopperFit[i] < this.eliteFit) {
        this.eliteFit = this.grasshopperFit[i];
        this.elitePos = [...this.grasshoppers[i]];
      }
    }
  }

  recordHistory() {
    // Store subset of points to keep memory bounded on long runs
    const stride = this.popSize > 45 ? 2 : 1;
    for (let i = 0; i < this.popSize; i += stride) {
      this.searchHistory.push([this.grasshoppers[i][0], this.grasshoppers[i][1] ?? 0, this.grasshopperFit[i]]);
    }
    if (this.searchHistory.length > 2400) {
      this.searchHistory.splice(0, this.searchHistory.length - 2400);
    }
  }

  _computeSocialMoves(cVal) {
    const { lb, ub } = this.fn;
    const span = ub - lb;
    const diag = Math.sqrt(this.dim) * span;
    const N = this.popSize;
    const results = new Array(N);

    for (let i = 0; i < N; i++) {
      const sum = new Array(this.dim).fill(0);
      for (let j = 0; j < N; j++) {
        if (i === j) continue;
        let sq = 0;
        for (let d = 0; d < this.dim; d++) {
          const diff = this.grasshoppers[j][d] - this.grasshoppers[i][d];
          sq += diff * diff;
        }
        const dist = Math.sqrt(sq);
        if (dist < 1e-12) continue;
        // Map distance into active social band [1, 4]
        const rNorm = 1 + 3 * Math.min(1, dist / Math.max(1e-9, diag));
        const sf = socialForce(rNorm, this.fParam, this.lParam);
        const factor = cVal * (span / 2) * sf;
        for (let d = 0; d < this.dim; d++) {
          sum[d] += factor * ((this.grasshoppers[j][d] - this.grasshoppers[i][d]) / dist);
        }
      }
      const move = sum.map((s) => (cVal * s) / Math.max(1, N - 1));
      this.socialVectors[i] = move;
      results[i] = clampVec(
        move.map((m, d) => m + this.elitePos[d]),
        lb,
        ub
      );
    }
    return results;
  }

  step() {
    if (this.iter >= this.maxIter) return this.getTelemetry();
    this.iter += 1;
    const { lb, ub } = this.fn;
    const N = this.popSize;

    if (this.mode === 'goa') {
      const cVal = computeStandardC(this.iter, this.maxIter, this.cMax, this.cMin);
      const nextPos = this._computeSocialMoves(cVal);
      for (let i = 0; i < N; i++) {
        this.grasshoppers[i] = nextPos[i];
        this.grasshopperFit[i] = this.fn.evaluate(nextPos[i]);
        this.antlions[i] = [...nextPos[i]];
        this.antlionFit[i] = this.grasshopperFit[i];
      }
      this._refreshElite();
    } else if (this.mode === 'alo') {
      for (let i = 0; i < N; i++) {
        const selIdx = rouletteWheelSelect(this.antlionFit, this.rng);
        const rA = randomWalkAround(this.antlions[selIdx], this.iter, this.maxIter, lb, ub, this.rng);
        const rE = randomWalkAround(this.elitePos, this.iter, this.maxIter, lb, ub, this.rng);
        const next = clampVec(rA.map((v, d) => (v + rE[d]) / 2), lb, ub);
        const fit = this.fn.evaluate(next);
        this.grasshoppers[i] = next;
        this.grasshopperFit[i] = fit;
        this.socialVectors[i] = new Array(this.dim).fill(0);
        // Eq. (13): Catching prey & rebuilding pit
        if (fit < this.antlionFit[i]) {
          this.antlions[i] = [...next];
          this.antlionFit[i] = fit;
        }
      }
      this._refreshElite();
    } else {
      // Hybrid GOA-ALO (Amaireh et al., 2023)
      const cVal = computeHybridC(this.iter, this.maxIter, this.cMax, this.cMin);
      const socialPos = this._computeSocialMoves(cVal);
      const pool = [];

      for (let i = 0; i < N; i++) {
        const selIdx = rouletteWheelSelect(this.antlionFit, this.rng);
        const rA = randomWalkAround(this.antlions[selIdx], this.iter, this.maxIter, lb, ub, this.rng);
        const rE = randomWalkAround(this.elitePos, this.iter, this.maxIter, lb, ub, this.rng);

        // Candidate 1: ALO funnel movement
        const aloCand = clampVec(rA.map((v, d) => (v + rE[d]) / 2), lb, ub);
        // Candidate 2: Social force + ALO coupled position
        const coupled = clampVec(
          socialPos[i].map((s, d) => (cVal > this.cMin * 2 ? (s + rA[d] + rE[d]) / 3 : 0.15 * s + 0.35 * rA[d] + 0.5 * rE[d])),
          lb,
          ub
        );

        pool.push({ pos: socialPos[i], fit: this.fn.evaluate(socialPos[i]) });
        pool.push({ pos: aloCand, fit: this.fn.evaluate(aloCand) });
        pool.push({ pos: coupled, fit: this.fn.evaluate(coupled) });
      }

      // Sect. 4.7: 3-tier fitness matrix selection (best exploitation, average mid, worst diversity)
      pool.sort((a, b) => a.fit - b.fit);
      const bestCount = Math.max(1, Math.round(N * 0.5));
      const midCount = Math.max(1, Math.round(N * 0.3));
      const worstCount = Math.max(0, N - bestCount - midCount);

      const selected = [];
      for (let k = 0; k < bestCount; k++) selected.push(pool[k]);
      const midStart = Math.max(bestCount, Math.floor((pool.length - midCount) / 2));
      for (let k = 0; k < midCount; k++) selected.push(pool[midStart + k]);
      const worstStart = Math.max(midStart + midCount, pool.length - worstCount);
      for (let k = 0; k < worstCount; k++) selected.push(pool[worstStart + k]);

      for (let i = 0; i < N; i++) {
        const item = selected[i] || pool[i];
        this.grasshoppers[i] = item.pos;
        this.grasshopperFit[i] = item.fit;
        // Eq. (13): Antlion catches fitter grasshopper & rebuilds pit
        if (item.fit < this.antlionFit[i]) {
          this.antlions[i] = [...item.pos];
          this.antlionFit[i] = item.fit;
        }
      }
      this._refreshElite();
    }

    this.convergence.push(this.eliteFit);
    this.recordHistory();
    return this.getTelemetry();
  }

  getTelemetry() {
    const cVal = this.mode === 'goa'
      ? computeStandardC(this.iter, this.maxIter, this.cMax, this.cMin)
      : computeHybridC(this.iter, this.maxIter, this.cMax, this.cMin);
    const w = computeW(this.iter, this.maxIter);
    const I = computeI(this.iter, this.maxIter);
    let sumFit = 0;
    for (let i = 0; i < this.grasshopperFit.length; i++) sumFit += this.grasshopperFit[i];
    const meanFit = sumFit / Math.max(1, this.grasshopperFit.length);
    const phase = this.iter === 0
      ? 'Siap (Idle)'
      : this.iter <= this.maxIter / 2
        ? 'Eksplorasi (l <= L/2)'
        : 'Eksploitasi Intensif (l > L/2)';
    const trapRadius = (this.fn.ub - this.fn.lb) / (2 * I);

    return {
      mode: this.mode,
      iter: this.iter,
      maxIter: this.maxIter,
      phase,
      c: cVal,
      w,
      I,
      trapRadius,
      elitePos: this.elitePos,
      eliteFit: this.eliteFit,
      meanFit,
      done: this.iter >= this.maxIter
    };
  }
}
