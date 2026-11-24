// Pola B: MCT-seeded PSO (Heuristic -> Metaheuristic sequential seeding)
// Minimum Completion Time (MCT) menginisialisasi Particle Swarm Optimization.
// Rujukan: Alsaidy, Abbood & Sahib (2020), J. King Saud Univ. - CIS, DOI 10.1016/j.jksuci.2020.11.002
// Partikel = matriks alokasi biner M x K (tiap tugas tepat satu VM); update = velocity PSO + argmax per baris tugas.

import { createRng } from './benchmarks.js';

export function generateWorkload(numTasks, preset = 'skewed', seed = 42) {
  const rng = createRng(seed);
  const weights = [];
  for (let i = 0; i < numTasks; i++) {
    if (preset === 'uniform') {
      weights.push(Math.round(28 + rng() * 14));
    } else if (preset === 'heavy-random') {
      weights.push(Math.round(15 + rng() * 85));
    } else {
      // skewed: mix of a few heavy tasks and several light tasks
      const heavy = i < Math.max(2, Math.floor(numTasks * 0.3));
      weights.push(heavy ? Math.round(70 + rng() * 50) : Math.round(12 + rng() * 24));
    }
  }
  return weights;
}

export function generateVmSpeeds(numVms) {
  // Heterogeneous compute speeds S_j
  const speeds = [];
  for (let j = 0; j < numVms; j++) {
    speeds.push(Number((1.0 + j * 0.45).toFixed(2)));
  }
  return speeds;
}

export function runMCT(tasks, vmSpeeds) {
  const M = tasks.length;
  const K = vmSpeeds.length;
  const ready = new Array(K).fill(0);
  const assignment = new Array(M).fill(0);
  const schedule = [];
  const matrixET = [];

  for (let k = 0; k < M; k++) {
    const etRow = [];
    let bestVm = 0;
    let bestCT = Infinity;
    for (let j = 0; j < K; j++) {
      const et = tasks[k] / vmSpeeds[j];
      etRow.push(et);
      const ct = ready[j] + et;
      if (ct < bestCT) {
        bestCT = ct;
        bestVm = j;
      }
    }
    matrixET.push(etRow);
    const start = ready[bestVm];
    const duration = etRow[bestVm];
    ready[bestVm] = bestCT;
    assignment[k] = bestVm;
    schedule.push({
      taskIdx: k,
      vmIdx: bestVm,
      weight: tasks[k],
      start,
      end: bestCT,
      duration
    });
  }

  const makespan = Math.max(...ready);
  return { assignment, makespan, schedule, readyTimes: ready, matrixET };
}

export function evaluateAssignment(assignment, tasks, vmSpeeds) {
  const M = tasks.length;
  const K = vmSpeeds.length;
  const ready = new Array(K).fill(0);
  const schedule = [];
  for (let k = 0; k < M; k++) {
    const vmIdx = assignment[k];
    const duration = tasks[k] / vmSpeeds[vmIdx];
    const start = ready[vmIdx];
    ready[vmIdx] = start + duration;
    schedule.push({ taskIdx: k, vmIdx, weight: tasks[k], start, end: ready[vmIdx], duration });
  }
  return { assignment: [...assignment], makespan: Math.max(...ready), schedule, readyTimes: ready };
}

function solveWithPSO({
  tasks,
  vmSpeeds,
  popSize = 70,
  maxIter = 100,
  wMax = 0.9,
  wMin = 0.2,
  c1 = 2,
  c2 = 2,
  vLim = 1,
  seedRatio = 1,
  mctAssignment = null,
  seed = 42
}) {
  const rng = createRng(seed);
  const M = tasks.length;
  const K = vmSpeeds.length;
  const pSeed = mctAssignment && seedRatio > 0 ? Math.max(1, Math.round(popSize * seedRatio)) : 0;
  const fitOf = (a) => evaluateAssignment(a, tasks, vmSpeeds).makespan;

  // Inisialisasi: partikel seeded = salinan X_MCT, sisanya acak. Velocity acak di [-vLim, vLim].
  const pos = [];
  const vel = [];
  const fit = [];
  for (let i = 0; i < popSize; i++) {
    const a = i < pSeed ? [...mctAssignment] : Array.from({ length: M }, () => Math.floor(rng() * K));
    pos.push(a);
    vel.push(Float64Array.from({ length: M * K }, () => (rng() * 2 - 1) * vLim));
    fit.push(fitOf(a));
  }
  const initialFitness = [...fit];
  const pbest = pos.map((a) => [...a]);
  const pbestFit = [...fit];
  let gIdx = 0;
  for (let i = 1; i < popSize; i++) if (fit[i] < fit[gIdx]) gIdx = i;
  let gbest = [...pos[gIdx]];
  let gbestFit = fit[gIdx];

  const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const history = [gbestFit];
  const meanHistory = [mean(fit)];
  const assignHistory = [[...gbest]];

  for (let t = 1; t <= maxIter; t++) {
    const w = wMax - (wMax - wMin) * (t / maxIter);
    for (let i = 0; i < popSize; i++) {
      const next = new Array(M);
      for (let k = 0; k < M; k++) {
        let bestJ = 0;
        let bestV = -Infinity;
        for (let j = 0; j < K; j++) {
          const idx = k * K + j;
          const x = pos[i][k] === j ? 1 : 0;
          const pb = pbest[i][k] === j ? 1 : 0;
          const gb = gbest[k] === j ? 1 : 0;
          let v = w * vel[i][idx] + c1 * rng() * (pb - x) + c2 * rng() * (gb - x);
          v = Math.max(-vLim, Math.min(vLim, v));
          vel[i][idx] = v;
          if (v > bestV) { bestV = v; bestJ = j; }
        }
        next[k] = bestJ; // binary PSO: elemen 1 di VM dengan velocity terbesar
      }
      pos[i] = next;
      fit[i] = fitOf(next);
      if (fit[i] < pbestFit[i]) { pbestFit[i] = fit[i]; pbest[i] = [...next]; }
    }
    for (let i = 0; i < popSize; i++) {
      if (pbestFit[i] < gbestFit) { gbestFit = pbestFit[i]; gbest = [...pbest[i]]; }
    }
    history.push(gbestFit);
    meanHistory.push(mean(fit));
    assignHistory.push([...gbest]);
  }

  const bestEval = evaluateAssignment(gbest, tasks, vmSpeeds);
  return {
    bestMakespan: gbestFit,
    bestSchedule: bestEval.schedule,
    bestAssignment: bestEval.assignment,
    readyTimes: bestEval.readyTimes,
    history,
    meanHistory,
    assignHistory,
    initialFitness,
    pSeed
  };
}

export function runPatternBSimulation(config) {
  const { tasks, vmSpeeds, seedRatio = 1, seed = 42, ...psoParams } = config;
  const mctResult = runMCT(tasks, vmSpeeds);
  const mctPso = solveWithPSO({ tasks, vmSpeeds, ...psoParams, seedRatio, mctAssignment: mctResult.assignment, seed });
  const purePso = solveWithPSO({ tasks, vmSpeeds, ...psoParams, seedRatio: 0, mctAssignment: null, seed });
  return { mctResult, mctPso, purePso };
}
