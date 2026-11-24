// Pola B: MCT-seeded GOA (Heuristic -> Metaheuristic sequential seeding)
// Canonical Minimum Completion Time (MCT) + Grasshopper Optimization Algorithm (Saremi et al., 2017)

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

export function evaluateContinuousPosition(pos, tasks, vmSpeeds) {
  const M = tasks.length;
  const K = vmSpeeds.length;
  const ready = new Array(K).fill(0);
  const assignment = new Array(M).fill(0);
  const schedule = [];

  for (let k = 0; k < M; k++) {
    const vmIdx = Math.min(K - 1, Math.max(0, Math.floor(pos[k])));
    const duration = tasks[k] / vmSpeeds[vmIdx];
    const start = ready[vmIdx];
    const end = start + duration;
    ready[vmIdx] = end;
    assignment[k] = vmIdx;
    schedule.push({ taskIdx: k, vmIdx, weight: tasks[k], start, end, duration });
  }

  return { assignment, makespan: Math.max(...ready), schedule, readyTimes: ready };
}

function goaSocialForce(r, f = 0.5, ls = 1.5) {
  return f * Math.exp(-r / ls) - Math.exp(-r);
}

function solveWithGOA({
  tasks,
  vmSpeeds,
  popSize = 24,
  maxIter = 80,
  cMax = 1.0,
  cMin = 0.00001,
  seedRatio = 0.3,
  mctAssignment = null,
  seed = 42
}) {
  const rng = createRng(seed);
  const M = tasks.length;
  const K = vmSpeeds.length;
  const lb = 0;
  const ub = K - 0.0001;
  const pSeed = mctAssignment && seedRatio > 0 ? Math.max(1, Math.round(popSize * seedRatio)) : 0;

  // Initialize population
  const pop = [];
  const fitness = [];
  for (let i = 0; i < popSize; i++) {
    const vec = new Array(M);
    if (i === 0 && pSeed > 0) {
      for (let d = 0; d < M; d++) vec[d] = mctAssignment[d] + 0.5;
    } else if (i < pSeed) {
      for (let d = 0; d < M; d++) {
        const jitter = (rng() - 0.5) * 1.1;
        vec[d] = Math.min(ub, Math.max(lb, mctAssignment[d] + 0.5 + jitter));
      }
    } else {
      for (let d = 0; d < M; d++) vec[d] = rng() * ub;
    }
    pop.push(vec);
    fitness.push(evaluateContinuousPosition(vec, tasks, vmSpeeds).makespan);
  }

  // Snapshot of initial fitnesses for visualization
  const initialFitness = [...fitness];

  let bestIdx = 0;
  for (let i = 1; i < popSize; i++) {
    if (fitness[i] < fitness[bestIdx]) bestIdx = i;
  }
  let target = [...pop[bestIdx]];
  let targetFit = fitness[bestIdx];

  const history = [targetFit];

  // ponytail: O(N^2 * M) per iter is fast for N <= 50, M <= 16 (<5ms total); switch to sampled pairs if N > 120
  for (let l = 1; l <= maxIter; l++) {
    const c = cMax - l * ((cMax - cMin) / maxIter);
    const nextPop = new Array(popSize);

    for (let i = 0; i < popSize; i++) {
      const nextVec = new Array(M);
      for (let d = 0; d < M; d++) {
        let socialSum = 0;
        for (let j = 0; j < popSize; j++) {
          if (i === j) continue;
          const diff = pop[j][d] - pop[i][d];
          const dist = Math.abs(diff);
          if (dist < 1e-9) continue;
          // Normalize pairwise distance into [1, 4] band for s(r)
          const rNorm = 1 + 3 * (dist / Math.max(1, K));
          socialSum += c * ((ub - lb) / 2) * goaSocialForce(rNorm) * (diff / dist);
        }
        // Small exploration nudge scaled by c so discrete scheduling can escape flat makespan plateaus
        const localStep = (rng() - 0.5) * c * 0.85;
        let val = c * socialSum + target[d] + localStep;
        if (val < lb) val = lb + rng() * 0.2;
        if (val > ub) val = ub - rng() * 0.2;
        nextVec[d] = val;
      }
      nextPop[i] = nextVec;
    }

    for (let i = 0; i < popSize; i++) {
      const ev = evaluateContinuousPosition(nextPop[i], tasks, vmSpeeds);
      pop[i] = nextPop[i];
      fitness[i] = ev.makespan;
      if (ev.makespan < targetFit) {
        targetFit = ev.makespan;
        target = [...nextPop[i]];
      }
    }
    history.push(targetFit);
  }

  const bestEval = evaluateContinuousPosition(target, tasks, vmSpeeds);
  return {
    bestMakespan: targetFit,
    bestSchedule: bestEval.schedule,
    bestAssignment: bestEval.assignment,
    readyTimes: bestEval.readyTimes,
    history,
    initialFitness,
    pSeed
  };
}

export function runPatternBSimulation(config) {
  const {
    tasks,
    vmSpeeds,
    popSize = 24,
    maxIter = 80,
    cMax = 1.0,
    cMin = 0.00001,
    seedRatio = 0.3,
    seed = 42
  } = config;

  const mctResult = runMCT(tasks, vmSpeeds);

  const mctGoa = solveWithGOA({
    tasks,
    vmSpeeds,
    popSize,
    maxIter,
    cMax,
    cMin,
    seedRatio,
    mctAssignment: mctResult.assignment,
    seed
  });

  const pureGoa = solveWithGOA({
    tasks,
    vmSpeeds,
    popSize,
    maxIter,
    cMax,
    cMin,
    seedRatio: 0,
    mctAssignment: null,
    seed
  });

  return { mctResult, mctGoa, pureGoa };
}
