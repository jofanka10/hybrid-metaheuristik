// Benchmark functions (Tables 4 & 5) and real empirical data (Tables 1, 2, 3, 6, 7, 9)
// Source: Amaireh, Al-Zoubi, & Dib (2023), Evolutionary Intelligence 16:1383-1422

export function createRng(seed = 42) {
  let s = (Number(seed) >>> 0) || 1;
  return function nextRandom() {
    s |= 0;
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const BENCHMARK_FUNCTIONS = {
  F1: {
    id: 'F1',
    name: 'F1 (Sphere, Unimodal)',
    category: 'Unimodal',
    formula: 'f(x) = x1^2 + x2^2',
    lb: -100,
    ub: 100,
    fMin: 0,
    opt: [0, 0],
    zScale: 1,
    evaluate(vec) {
      let sum = 0;
      for (let i = 0; i < vec.length; i++) sum += vec[i] * vec[i];
      return sum;
    }
  },
  F13: {
    id: 'F13',
    name: 'F13 (Rastrigin, Multimodal)',
    category: 'Multimodal',
    formula: 'f(x) = sum(x_i^2 - 10*cos(2*pi*x_i) + 10)',
    lb: -5.12,
    ub: 5.12,
    fMin: 0,
    opt: [0, 0],
    zScale: 1,
    evaluate(vec) {
      let sum = 0;
      for (let i = 0; i < vec.length; i++) {
        const x = vec[i];
        sum += x * x - 10 * Math.cos(2 * Math.PI * x) + 10;
      }
      return sum;
    }
  },
  F14: {
    id: 'F14',
    name: 'F14 (Ackley, Multimodal)',
    category: 'Multimodal',
    formula: 'f(x) = -20*exp(-0.2*sqrt(mean(x^2))) - exp(mean(cos(2*pi*x))) + 20 + e',
    lb: -32,
    ub: 32,
    fMin: 0,
    opt: [0, 0],
    zScale: 1,
    evaluate(vec) {
      const d = vec.length;
      let sumSq = 0;
      let sumCos = 0;
      for (let i = 0; i < d; i++) {
        sumSq += vec[i] * vec[i];
        sumCos += Math.cos(2 * Math.PI * vec[i]);
      }
      return -20 * Math.exp(-0.2 * Math.sqrt(sumSq / d)) - Math.exp(sumCos / d) + 20 + Math.E;
    }
  },
  F15: {
    id: 'F15',
    name: 'F15 (Griewank, Multimodal)',
    category: 'Multimodal',
    formula: 'f(x) = sum(x_i^2)/4000 - prod(cos(x_i/sqrt(i))) + 1',
    lb: -600,
    ub: 600,
    fMin: 0,
    opt: [0, 0],
    zScale: 1,
    evaluate(vec) {
      let sum = 0;
      let prod = 1;
      for (let i = 0; i < vec.length; i++) {
        sum += (vec[i] * vec[i]) / 4000;
        prod *= Math.cos(vec[i] / Math.sqrt(i + 1));
      }
      return sum - prod + 1;
    }
  },
  F31: {
    id: 'F31',
    name: 'F31 (Cosine Mixture, Multimodal)',
    category: 'Multimodal',
    formula: 'f(x) = x1^2 + x2^2 - cos(18*x1) - cos(18*x2)',
    lb: -1,
    ub: 1,
    fMin: -2,
    opt: [0, 0],
    zScale: 1,
    evaluate(vec) {
      let sum = 0;
      for (let i = 0; i < vec.length; i++) {
        const x = vec[i];
        sum += x * x - Math.cos(18 * x);
      }
      return sum;
    }
  }
};

// Exact empirical results extracted from Amaireh, Al-Zoubi, & Dib (2023)
export const PAPER_EMPIRICAL_DATA = {
  unimodal: {
    title: 'Benchmark Klasik Unimodal (F1-F11, Tabel 6)',
    subtitle: 'Total Rank lebih rendah berarti performa lebih unggul (40 agen, 30 run independen).',
    metricLabel: 'Total Rank',
    lowerIsBetter: true,
    rows: [
      { algo: 'Hybrid GOA-ALO', value: 15, highlight: 'hybrid', note: 'Peringkat #1 keseluruhan; F1 Mean 2.6959e-39; F11 = 0 pada semua 30 run.' },
      { algo: 'CS', value: 44, highlight: 'other', note: 'Peringkat #2 pada kelompok unimodal F1-F11.' },
      { algo: 'ALO', value: 63, highlight: 'alo', note: 'F1 Mean 1.8739e-06; eksploitasi kuat namun terjebak prematur pada beberapa fungsi.' },
      { algo: 'GOA', value: 70, highlight: 'goa', note: 'F1 Mean 1.0305; c linear standar membatasi presisi eksploitasi akhir.' },
      { algo: 'BBO', value: 75, highlight: 'other', note: 'Biogeography-Based Optimization (Tabel 6).' },
      { algo: 'ABC', value: 82, highlight: 'other', note: 'Artificial Bee Colony (Tabel 6).' },
      { algo: 'PSO', value: 147, highlight: 'other', note: 'Particle Swarm Optimization (Tabel 6).' },
      { algo: 'BA', value: 171, highlight: 'other', note: 'Bat Algorithm (Tabel 6).' }
    ],
    keyMetrics: [
      { label: 'Total Rank Hybrid', value: '15 (Peringkat #1)' },
      { label: 'Mean F1 Hybrid', value: '2.6959e-39' },
      { label: 'Mean F1 ALO / GOA', value: '1.8739e-06 / 1.0305' },
      { label: 'Hasil F11 (30 Run)', value: '0 (eksak semua run)' }
    ]
  },
  multimodal: {
    title: 'Benchmark Klasik Multimodal & Komposit (F12-F32, Tabel 7)',
    subtitle: 'Mengukur kemampuan menghindari jebakan optimum lokal (40 agen, 30 run independen).',
    metricLabel: 'Total Rank',
    lowerIsBetter: true,
    rows: [
      { algo: 'Hybrid GOA-ALO', value: 57, highlight: 'hybrid', note: 'Peringkat #1; F13 (Rastrigin) Mean = 0 (mencapai global optimum eksak).' },
      { algo: 'ABC', value: 70, highlight: 'other', note: 'Peringkat #2 pada kelompok multimodal F12-F32.' },
      { algo: 'CS', value: 73, highlight: 'other', note: 'Cuckoo Search (Tabel 7).' },
      { algo: 'BBO', value: 79, highlight: 'other', note: 'Biogeography-Based Optimization (Tabel 7).' },
      { algo: 'ALO', value: 111, highlight: 'alo', note: 'F13 (Rastrigin) Mean 71.1726; kehilangan keragaman populasi.' },
      { algo: 'GA', value: 129, highlight: 'other', note: 'Genetic Algorithm (Tabel 7).' },
      { algo: 'GOA', value: 140, highlight: 'goa', note: 'F13 (Rastrigin) Mean 89.0238.' },
      { algo: 'PSO', value: 168, highlight: 'other', note: 'Particle Swarm Optimization (Tabel 7).' },
      { algo: 'BA', value: 201, highlight: 'other', note: 'Bat Algorithm (Tabel 7).' }
    ],
    keyMetrics: [
      { label: 'Total Rank Hybrid', value: '57 (Peringkat #1)' },
      { label: 'Mean F13 Hybrid', value: '0 (Global Optimum)' },
      { label: 'Mean F13 ALO', value: '71.1726' },
      { label: 'Mean F13 GOA', value: '89.0238' }
    ]
  },
  cec2015: {
    title: '13 Fungsi Uji Standar CEC2015 (Tabel 9)',
    subtitle: 'Evaluasi fungsi shifted, rotated, dan komposit menantang (30 run independen).',
    metricLabel: 'Total Rank',
    lowerIsBetter: true,
    rows: [
      { algo: 'SPS-L-SHADE-EIG', value: 333, highlight: 'other', note: 'Peringkat #1 (pemenang khusus kompetisi CEC).' },
      { algo: 'Hybrid GOA-ALO', value: 402, highlight: 'hybrid', note: 'Peringkat #2 keseluruhan, unggul jauh atas GOA (513) dan ALO (570).' },
      { algo: 'SSA', value: 511, highlight: 'other', note: 'Salp Swarm Algorithm (Tabel 9).' },
      { algo: 'GOA', value: 513, highlight: 'goa', note: 'Grasshopper Optimization Algorithm tunggal.' },
      { algo: 'ALO', value: 570, highlight: 'alo', note: 'Ant Lion Optimizer tunggal.' },
      { algo: 'GWO', value: 634, highlight: 'other', note: 'Grey Wolf Optimizer (Tabel 9).' },
      { algo: 'WOA', value: 833, highlight: 'other', note: 'Whale Optimization Algorithm (Tabel 9).' },
      { algo: 'SCA', value: 877, highlight: 'other', note: 'Sine Cosine Algorithm (Tabel 9).' }
    ],
    keyMetrics: [
      { label: 'Posisi Hybrid', value: 'Rank 402 (#2 dari 8)' },
      { label: 'Selisih vs GOA', value: '111 poin lebih baik' },
      { label: 'Selisih vs ALO', value: '168 poin lebih baik' },
      { label: 'Pembanding #1', value: 'SPS-L-SHADE-EIG (333)' }
    ]
  },
  antenna: {
    title: 'Aplikasi Sintesis Antena Dunia Nyata (Tabel 1, 2, & 3)',
    subtitle: '32-Element LAA (null di 81 deg, 100 agen, 600 iter) & Non-uniform CCAA (500 iter).',
    metricLabel: 'Kedalaman Null LAA (dB, makin negatif makin dalam)',
    lowerIsBetter: true,
    rows: [
      { algo: 'Hybrid GOA-ALO', value: -147.91, highlight: 'hybrid', note: 'Null -147.91 dB, Max SLL -14.73 dB; CCAA Max SLL -31.84 dB (terbaik).' },
      { algo: 'ALO', value: -142.81, highlight: 'alo', note: 'Null -142.81 dB, Max SLL -14.27 dB; CCAA Max SLL -30.37 dB.' },
      { algo: 'GOA', value: -138.75, highlight: 'goa', note: 'Null -138.75 dB, Max SLL -9.09 dB.' },
      { algo: 'BBO', value: -109.60, highlight: 'other', note: 'Null -109.6 dB; CCAA Max SLL -29.61 dB.' },
      { algo: 'Taguchi', value: -78.33, highlight: 'other', note: 'Metode optimasi Taguchi (Tabel 1 & 2).' }
    ],
    keyMetrics: [
      { label: 'LAA Null / SLL Hybrid', value: '-147.91 dB / -14.73 dB' },
      { label: 'LAA 20-Run Mean / Std', value: '-186.8760 dB / 2.8925' },
      { label: 'CCAA Max SLL Hybrid', value: '-31.84 dB (Uniform -10.77 dB)' },
      { label: 'Trade-off CPU Time', value: 'Hybrid 213 s vs GOA 195 s vs ALO 67 s' }
    ]
  }
};
