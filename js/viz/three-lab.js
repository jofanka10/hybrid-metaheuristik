// Three.js 3D Search Landscape & Agent Lab (Card Wars Deck Card VII v5)
// Includes automatic & toggleable 2D Canvas Topographic Contour Heatmap fallback (R-27)
// Automatically pauses RAF when card is inactive or document.hidden === true

import { BENCHMARK_FUNCTIONS } from '../algorithms/benchmarks.js?v=7';

let threeModuleCache = null;

async function loadThreeModules() {
  if (threeModuleCache) return threeModuleCache;
  try {
    const [THREE, controlsMod] = await Promise.all([
      import('three'),
      import('three/addons/controls/OrbitControls.js')
    ]);
    threeModuleCache = { THREE, OrbitControls: controlsMod.OrbitControls };
    return threeModuleCache;
  } catch {
    return null;
  }
}

function checkWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
  } catch {
    return false;
  }
}

// Card-Linen Topographic Ramp: deep emerald valley (#0F5143) -> sage-sky (#6BA89B) -> ivory peaks (#EFE9DC)
function cardMapColorRGB(t) {
  const c = Math.max(0, Math.min(1, t));
  if (c < 0.45) {
    const u = c / 0.45;
    return [
      Math.round(15 + u * (107 - 15)),
      Math.round(81 + u * (168 - 81)),
      Math.round(67 + u * (155 - 67))
    ];
  }
  const u = (c - 0.45) / 0.55;
  return [
    Math.round(107 + u * (239 - 107)),
    Math.round(168 + u * (233 - 168)),
    Math.round(155 + u * (220 - 155))
  ];
}

function sampleSurfaceGrid(fn, segs = 96) {
  const N = segs + 1;
  const raw = new Float32Array(N * N);
  let minZ = Infinity;
  let maxZ = -Infinity;
  const span = fn.ub - fn.lb;

  for (let iy = 0; iy < N; iy++) {
    const x2 = fn.lb + (iy / segs) * span;
    for (let ix = 0; ix < N; ix++) {
      const x1 = fn.lb + (ix / segs) * span;
      const z = fn.evaluate([x1, x2]);
      raw[iy * N + ix] = z;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
  }

  const norm = new Float32Array(N * N);
  const zSpan = Math.max(1e-9, maxZ - minZ);
  for (let i = 0; i < raw.length; i++) norm[i] = Math.pow((raw[i] - minZ) / zSpan, 0.72);
  return { segs, N, norm, minZ, maxZ };
}

class Contour2DFallback {
  constructor(container) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
    this.ctx = this.canvas.getContext('2d');
    this.heatmapOffscreen = document.createElement('canvas');
    this.fn = BENCHMARK_FUNCTIONS.F13;
  }

  mount() {
    this.container.innerHTML = '';
    this.container.appendChild(this.canvas);
    this.resize();
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = Math.max(280, Math.floor(rect.width));
    this.height = Math.max(220, Math.floor(rect.height));
    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  setFunction(fn) {
    this.fn = fn;
    const grid = sampleSurfaceGrid(fn, 96);
    const size = grid.N;
    this.heatmapOffscreen.width = size;
    this.heatmapOffscreen.height = size;
    const octx = this.heatmapOffscreen.getContext('2d');
    const img = octx.createImageData(size, size);
    for (let i = 0; i < grid.norm.length; i++) {
      const t = grid.norm[i];
      const [r, g, b] = cardMapColorRGB(t);
      const iso = Math.abs((t * 12) - Math.round(t * 12)) < 0.042;
      img.data[i * 4] = iso ? 18 : r;
      img.data[i * 4 + 1] = iso ? 24 : g;
      img.data[i * 4 + 2] = iso ? 22 : b;
      img.data[i * 4 + 3] = iso ? 82 : 255;
    }
    octx.putImageData(img, 0, 0);
  }

  renderState(runners, layers) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.width || 540;
    const h = this.height || 280;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(this.heatmapOffscreen, 0, 0, w, h);

    const { lb, ub } = this.fn;
    const span = ub - lb;
    const px = (x) => ((x - lb) / span) * w;
    const py = (y) => ((y - lb) / span) * h;

    const ox = px(this.fn.opt[0]);
    const oy = py(this.fn.opt[1]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(ox, 0); ctx.lineTo(ox, h);
    ctx.moveTo(0, oy); ctx.lineTo(w, oy);
    ctx.stroke();
    ctx.setLineDash([]);

    const primary = runners[0];
    if (!primary) return;

    if (layers.trail && primary.searchHistory.length) {
      ctx.fillStyle = 'rgba(18, 24, 22, 0.24)';
      for (let i = 0; i < primary.searchHistory.length; i++) {
        const pt = primary.searchHistory[i];
        ctx.fillRect(px(pt[0]) - 1, py(pt[1]) - 1, 2, 2);
      }
    }

    if (layers.traps) {
      const tel = primary.getTelemetry();
      const radPx = Math.max(4, Math.min(w * 0.42, (tel.trapRadius / span) * w));
      ctx.strokeStyle = 'rgba(185, 28, 28, 0.65)';
      ctx.lineWidth = 1.25;
      for (let i = 0; i < Math.min(10, primary.antlions.length); i++) {
        ctx.beginPath();
        ctx.arc(px(primary.antlions[i][0]), py(primary.antlions[i][1]), radPx, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    if (layers.vectors) {
      ctx.strokeStyle = 'rgba(29, 78, 216, 0.72)';
      ctx.lineWidth = 1.1;
      for (let i = 0; i < primary.grasshoppers.length; i++) {
        const g = primary.grasshoppers[i];
        const v = primary.socialVectors[i] || [0, 0];
        const x1 = px(g[0]);
        const y1 = py(g[1]);
        const x2 = x1 + Math.max(-24, Math.min(24, (v[0] / span) * w * 1.4));
        const y2 = y1 + Math.max(-24, Math.min(24, (v[1] / span) * h * 1.4));
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }

    const colors = { hybrid: '#1D4ED8', goa: '#121816', alo: '#0F6B56' };
    runners.forEach((runner) => {
      ctx.fillStyle = colors[runner.mode] || '#1D4ED8';
      for (let i = 0; i < runner.grasshoppers.length; i++) {
        const g = runner.grasshoppers[i];
        ctx.beginPath();
        ctx.arc(px(g[0]), py(g[1]), 3.8, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    const ex = px(primary.elitePos[0]);
    const ey = py(primary.elitePos[1]);
    ctx.fillStyle = '#DC2626';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(ex, ey - 7.5);
    ctx.lineTo(ex + 7.5, ey);
    ctx.lineTo(ex, ey + 7.5);
    ctx.lineTo(ex - 7.5, ey);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  dispose() { this.container.innerHTML = ''; }
}

export class ThreeLabController {
  constructor(container, { onStateChange } = {}) {
    this.container = container;
    this.onStateChange = onStateChange;
    this.mode = 'loading';
    this.active = false;
    this.rafId = null;
    this.fn = BENCHMARK_FUNCTIONS.F13;
    this.surfaceSize = 14;
    this.maxHeight = 4.2;
    this.grid = null;
    this.lastRunners = [];
    this.lastLayers = { trail: true, vectors: false, traps: true };
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  async init(prefer2D = false) {
    this._emitState('loading', 'Menyiapkan lanskap fungsi topografi...');
    const hasWebGL = !prefer2D && checkWebGLAvailable();
    const mods = hasWebGL ? await loadThreeModules() : null;

    if (!mods) {
      this._initFallback(prefer2D ? 'Mode 2D Kontur Topografi aktif.' : 'WebGL tidak tersedia di browser ini. Beralih otomatis ke kanvas kontur topografi 2D.');
      return;
    }

    try {
      const { THREE, OrbitControls } = mods;
      this.THREE = THREE;
      this.container.innerHTML = '';

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xFFFDF7);
      this.scene.fog = new THREE.Fog(0xFFFDF7, 20, 44);

      const rect = this.container.getBoundingClientRect();
      const w = Math.max(280, rect.width);
      const h = Math.max(220, rect.height);

      this.camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
      this.camera.position.set(12.5, 11.2, 13.5);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.setSize(w, h);
      this.container.appendChild(this.renderer.domElement);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = !this.prefersReducedMotion;
      this.controls.dampingFactor = 0.08;
      this.controls.maxPolarAngle = Math.PI * 0.47;
      this.controls.minDistance = 7;
      this.controls.maxDistance = 30;

      this.scene.add(new THREE.AmbientLight(0xFFFFFF, 0.8));
      const dirLight = new THREE.DirectionalLight(0xFFFFFF, 0.85);
      dirLight.position.set(-10, 18, 10);
      this.scene.add(dirLight);

      const floorGrid = new THREE.GridHelper(this.surfaceSize, 14, 0x94A3B8, 0xDFD6C3);
      floorGrid.position.y = -0.04;
      this.scene.add(floorGrid);

      this.surfaceGroup = new THREE.Group();
      this.agentGroup = new THREE.Group();
      this.scene.add(this.surfaceGroup);
      this.scene.add(this.agentGroup);

      const agentGeo = new THREE.OctahedronGeometry(0.19, 0);
      agentGeo.scale(1, 1.45, 1);
      const agentMat = new THREE.MeshStandardMaterial({ color: 0x1D4ED8, roughness: 0.32, metalness: 0.08 });
      this.grasshopperMesh = new THREE.InstancedMesh(agentGeo, agentMat, 160);
      this.grasshopperMesh.count = 0;
      this.agentGroup.add(this.grasshopperMesh);

      const coneGeo = new THREE.ConeGeometry(0.42, 0.38, 16, 1, true);
      coneGeo.rotateX(Math.PI);
      const coneMat = new THREE.MeshBasicMaterial({ color: 0xDC2626, wireframe: true, transparent: true, opacity: 0.68 });
      this.trapMesh = new THREE.InstancedMesh(coneGeo, coneMat, 40);
      this.trapMesh.count = 0;
      this.agentGroup.add(this.trapMesh);

      this.eliteGroup = new THREE.Group();
      const eliteGeo = new THREE.OctahedronGeometry(0.34, 0);
      const eliteMat = new THREE.MeshStandardMaterial({ color: 0xDC2626, roughness: 0.25 });
      const eliteCore = new THREE.Mesh(eliteGeo, eliteMat);
      eliteCore.position.y = 0.62;
      const spireGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 2.3, 0)
      ]);
      const spire = new THREE.Line(spireGeo, new THREE.LineBasicMaterial({ color: 0xB91C1C }));
      this.eliteGroup.add(eliteCore, spire);
      this.agentGroup.add(this.eliteGroup);

      this.dropLines = new THREE.LineSegments(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({ color: 0x121816, transparent: true, opacity: 0.32 })
      );
      this.vectorLines = new THREE.LineSegments(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({ color: 0x1D4ED8, transparent: true, opacity: 0.8 })
      );
      this.trailPoints = new THREE.Points(
        new THREE.BufferGeometry(),
        new THREE.PointsMaterial({ color: 0x121816, size: 0.11, transparent: true, opacity: 0.36 })
      );
      this.agentGroup.add(this.dropLines, this.vectorLines, this.trailPoints);

      this.mode = 'webgl';
      this.setFunction(this.fn);
      this._emitState('webgl', 'Simulasi siap dijalankan. Sesuaikan parameter di panel kanan lalu tekan Jalankan.');
      this.renderOnce();
    } catch {
      this._initFallback('Inisialisasi WebGL gagal. Beralih otomatis ke kanvas kontur topografi 2D.');
    }
  }

  _initFallback(message) {
    this.disposeWebGL();
    this.fallback = new Contour2DFallback(this.container);
    this.fallback.mount();
    this.fallback.setFunction(this.fn);
    this.mode = 'fallback2d';
    this._emitState('fallback2d', message);
    if (this.lastRunners.length) this.fallback.renderState(this.lastRunners, this.lastLayers);
  }

  _emitState(mode, message) {
    if (this.onStateChange) this.onStateChange({ mode, message });
  }

  _worldCoords(x1, x2, zRaw) {
    const { lb, ub } = this.fn;
    const span = ub - lb;
    const wx = ((x1 - lb) / span - 0.5) * this.surfaceSize;
    const wz = ((x2 - lb) / span - 0.5) * this.surfaceSize;
    const zSpan = Math.max(1e-9, this.grid.maxZ - this.grid.minZ);
    const norm = Math.max(0, Math.min(1, (zRaw - this.grid.minZ) / zSpan));
    const wy = Math.pow(norm, 0.72) * this.maxHeight;
    return [wx, wy, wz];
  }

  setFunction(fn) {
    this.fn = fn;
    this.grid = sampleSurfaceGrid(fn, 96);

    if (this.mode === 'fallback2d' && this.fallback) {
      this.fallback.setFunction(fn);
      if (this.lastRunners.length) this.fallback.renderState(this.lastRunners, this.lastLayers);
      return;
    }

    if (this.mode !== 'webgl' || !this.THREE) return;
    const THREE = this.THREE;

    while (this.surfaceGroup.children.length) {
      const child = this.surfaceGroup.children.pop();
      child.geometry?.dispose();
      child.material?.dispose();
    }

    const segs = this.grid.segs;
    const geo = new THREE.PlaneGeometry(this.surfaceSize, this.surfaceSize, segs, segs);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    for (let i = 0; i < pos.count; i++) {
      const t = this.grid.norm[i];
      pos.setY(i, t * this.maxHeight);
      const [r, g, b] = cardMapColorRGB(t);
      colors[i * 3] = r / 255;
      colors[i * 3 + 1] = g / 255;
      colors[i * 3 + 2] = b / 255;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      vertexColors: true, roughness: 0.74, metalness: 0.02, side: THREE.DoubleSide
    }));
    const wire = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color: 0x121816, wireframe: true, transparent: true, opacity: 0.11
    }));
    wire.position.y = 0.015;

    this.surfaceGroup.add(mesh, wire);
    this.renderOnce();
  }

  updateAgents(runners, layers) {
    this.lastRunners = runners;
    this.lastLayers = layers;

    if (this.mode === 'fallback2d' && this.fallback) {
      this.fallback.renderState(runners, layers);
      return;
    }
    if (this.mode !== 'webgl' || !this.THREE || !runners.length) return;

    const THREE = this.THREE;
    const primary = runners[0];
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    const modeColors = { hybrid: 0x1D4ED8, goa: 0x121816, alo: 0x0F6B56 };

    let instanceIdx = 0;
    const dropPositions = [];
    runners.forEach((runner) => {
      color.setHex(modeColors[runner.mode] || 0x1D4ED8);
      for (let i = 0; i < runner.grasshoppers.length && instanceIdx < 160; i++) {
        const g = runner.grasshoppers[i];
        const [wx, wy, wz] = this._worldCoords(g[0], g[1] ?? 0, runner.grasshopperFit[i]);
        const hoverY = wy + 0.52;
        dummy.position.set(wx, hoverY, wz);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        this.grasshopperMesh.setMatrixAt(instanceIdx, dummy.matrix);
        this.grasshopperMesh.setColorAt(instanceIdx, color);
        dropPositions.push(wx, wy, wz, wx, hoverY - 0.18, wz);
        instanceIdx++;
      }
    });
    this.grasshopperMesh.count = instanceIdx;
    this.grasshopperMesh.instanceMatrix.needsUpdate = true;
    if (this.grasshopperMesh.instanceColor) this.grasshopperMesh.instanceColor.needsUpdate = true;

    this.dropLines.geometry.dispose();
    this.dropLines.geometry = new THREE.BufferGeometry();
    this.dropLines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(dropPositions, 3));

    if (layers.traps) {
      const tel = primary.getTelemetry();
      const span = this.fn.ub - this.fn.lb;
      const scaleR = Math.max(0.35, Math.min(3.5, (tel.trapRadius / span) * this.surfaceSize * 1.4));
      const count = Math.min(14, primary.antlions.length);
      for (let i = 0; i < count; i++) {
        const a = primary.antlions[i];
        const [wx, wy, wz] = this._worldCoords(a[0], a[1] ?? 0, primary.antlionFit[i]);
        dummy.position.set(wx, wy + 0.16, wz);
        dummy.scale.set(scaleR, 1, scaleR);
        dummy.updateMatrix();
        this.trapMesh.setMatrixAt(i, dummy.matrix);
      }
      this.trapMesh.count = count;
      this.trapMesh.instanceMatrix.needsUpdate = true;
    } else {
      this.trapMesh.count = 0;
    }

    const [ex, ey, ez] = this._worldCoords(primary.elitePos[0], primary.elitePos[1] ?? 0, primary.eliteFit);
    this.eliteGroup.position.set(ex, ey, ez);

    const vecPts = [];
    if (layers.vectors) {
      const span = this.fn.ub - this.fn.lb;
      for (let i = 0; i < primary.grasshoppers.length; i++) {
        const g = primary.grasshoppers[i];
        const v = primary.socialVectors[i] || [0, 0];
        const [wx, wy, wz] = this._worldCoords(g[0], g[1] ?? 0, primary.grasshopperFit[i]);
        const dx = Math.max(-1.6, Math.min(1.6, (v[0] / span) * this.surfaceSize * 1.8));
        const dz = Math.max(-1.6, Math.min(1.6, (v[1] / span) * this.surfaceSize * 1.8));
        vecPts.push(wx, wy + 0.52, wz, wx + dx, wy + 0.52, wz + dz);
      }
    }
    this.vectorLines.geometry.dispose();
    this.vectorLines.geometry = new THREE.BufferGeometry();
    this.vectorLines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vecPts, 3));

    const trailPts = [];
    if (layers.trail) {
      for (let i = 0; i < primary.searchHistory.length; i++) {
        const pt = primary.searchHistory[i];
        const [wx, wy, wz] = this._worldCoords(pt[0], pt[1], pt[2]);
        trailPts.push(wx, wy + 0.08, wz);
      }
    }
    this.trailPoints.geometry.dispose();
    this.trailPoints.geometry = new THREE.BufferGeometry();
    this.trailPoints.geometry.setAttribute('position', new THREE.Float32BufferAttribute(trailPts, 3));

    this.renderOnce();
  }

  resize() {
    if (this.mode === 'fallback2d' && this.fallback) {
      this.fallback.resize();
      if (this.lastRunners.length) this.fallback.renderState(this.lastRunners, this.lastLayers);
      return;
    }
    if (this.mode !== 'webgl' || !this.renderer || !this.camera) return;
    const rect = this.container.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) return;
    this.camera.aspect = rect.width / rect.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(rect.width, rect.height);
    this.renderOnce();
  }

  setActive(isActive) {
    this.active = isActive;
    if (isActive && !document.hidden) {
      this.resize();
      this._startLoop();
    } else {
      this._stopLoop();
    }
  }

  renderOnce() {
    if (this.mode === 'webgl' && this.renderer && this.scene && this.camera) {
      this.controls?.update();
      this.renderer.render(this.scene, this.camera);
    }
  }

  _startLoop() {
    if (this.rafId || this.mode !== 'webgl') return;
    const tick = () => {
      if (!this.active || document.hidden || this.mode !== 'webgl') {
        this.rafId = null;
        return;
      }
      this.controls?.update();
      this.renderer?.render(this.scene, this.camera);
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  _stopLoop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  disposeWebGL() {
    this._stopLoop();
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
  }
}
