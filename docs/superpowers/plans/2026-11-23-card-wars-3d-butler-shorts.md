# Card Wars 3D Tabletop, Butler 3D, & Manual Shorts Visualizer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the 9-card SOKA Hybrid Metaheuristic presentation into a full-viewport 3D *Adventure Time: Card Wars* tabletop world with a 3D Toon-Shaded Butler ("Sir Pip"), automatic 2D SVG fallback, and a manual step-by-step Shorts/TikTok beat visualizer preserving all real simulators and Amaireh et al. (2023) empirical data.

**Architecture:** One full-viewport Three.js scene (`js/viz/world-3d.js`) renders the cartoon sky/beach, yellow wooden tabletop, dual-lane playmat, tabletop props, 3D Toon-Shaded Butler with dynamic canvas facial expressions, and flying 3D card mesh; a pure-DOM manual beat controller (`js/ui/shorts-stage.js`) drives 34 looping shape-diorama and interactive-simulator beats across all 9 cards while synchronizing Butler moods and GPU pause/resume handoff with the existing Card VII 3D Search Landscape Lab (`js/viz/three-lab.js`).

**Tech Stack:** Vanilla ES Modules, Three.js `0.170.0` (existing CDN importmap, zero new packages), Tailwind Play CDN + custom CSS (`css/atlas-theme.css?v=5`), Google Fonts (`Fredoka`, `Syne`, `Plus Jakarta Sans`, `JetBrains Mono`), Node.js test verification (`tests/verify-algorithms.mjs`).

**Spec:** `docs/superpowers/specs/2026-11-23-card-wars-3d-butler-shorts-design.md`

## Global Constraints

- Zero new dependencies; reuse `three@0.170.0` importmap and all 3 untouched algorithm modules (`benchmarks.js`, `mct-goa.js`, `hybrid-goa-alo.js`).
- Zero em-dash characters (`\u2014`) across all HTML, CSS, JS, and markdown files (`R-02`).
- All text/background pairs must pass WCAG AA (`>= 4.5:1`) on Card Wars v5 palette (`#FFFDF7`, `#1A1816`, `#4B4742`, `#0F766E`, `#1D4ED8`, `#B91C1C`, `#1F2937`, `#FDE047`).
- Cache-bust every local CSS and JS module import with `?v=5`.
- Preserve all exact Amaireh et al. (2023) empirical numbers and `[CITASI PAPER MCT-GOA MENYUSUL]` explicit placeholder.
- Manual step-by-step beat advancement ONLY (never auto-advance beats during live class presentation), while shape dioramas loop smoothly within the active beat.

## Review Focus

1. **WebGL unavailability or mid-presentation `webglcontextlost`:** `CardWarsWorld` must seamlessly switch to `render2DFallbackWorld` (2D SVG Card Wars tabletop + animated 2D Sir Pip) without throwing or leaving a blank canvas.
2. **GPU contention when Card VII Lab 3D is open:** `controls.js` must pause `CardWarsWorld` RAF while Card VII WebGL Lab is active, and resume when leaving Card VII or switching Lab to 2D Contour.
3. **Keyboard shortcut collision on `Space`:** `Space` flips a face-down card open, advances beats in normal cards/diorama beats, and plays/pauses the 3D Lab ONLY when on Card VII's interactive Lab beat (while `N`/`B` always navigate beats).
4. **Looping animation memory/CPU leaks across beats:** Switching beats, switching cards, flipping face-down, peeking at the 3D table, or hiding the browser tab (`document.hidden`) must cancel all active beat RAF loops and intervals.
5. **Broken DOM ID references after shell restructure:** Static test must verify every `getElementById`, `bindRangePair`, and `bindSegmentedTabs` ID across `deck.js`, `controls.js`, `shorts-stage.js`, and `world-3d.js` exists in `index.html`.

---

### Task 1: 2D Butler SVG & Cartoon-Editorial Palette Alignment

**Files:**
- Modify: `js/viz/svg-illustrator.js`
- Modify: `js/viz/svg-charts.js`
- Modify: `js/viz/three-lab.js`

**Interfaces:**
- Consumes: `js/algorithms/hybrid-goa-alo.js?v=5`, `js/algorithms/benchmarks.js?v=5`
- Produces:
  - `BUTLER_MOODS` (`['greet', 'deal', 'point', 'think', 'aha', 'proud']`) exported from `js/viz/svg-illustrator.js`
  - `renderButler2DSvg(container, { mood, compact })` exported from `js/viz/svg-illustrator.js`
  - Updated `renderCardBackEmblem` + bold cartoon-ink palette (`#1A1816`, `#0F766E`, `#1D4ED8`, `#B91C1C`) across `svg-illustrator.js`, `svg-charts.js`, and `#FFFDF7` backdrop in `three-lab.js`.

- [ ] **Step 1:** Update ES module imports in `svg-illustrator.js`, `svg-charts.js`, and `three-lab.js` to `?v=5`, align ink/MCT colors to `#1A1816` / `#0F766E`, and set `three-lab.js` 3D background/fog to `0xFFFDF7`.
- [ ] **Step 2:** Export `BUTLER_MOODS` and implement `renderButler2DSvg(container, { mood = 'greet', compact = false })` in `js/viz/svg-illustrator.js` with 6 distinct cartoon facial/gesture expressions for Sir Pip, and upgrade `renderCardBackEmblem` to bold Card Wars cartoon outlines.
- [ ] **Step 3:** Verify syntax with `node --check` on all 3 modified visualization modules.

---

### Task 2: Full-Viewport 3D *Card Wars* World & 3D Toon Butler (`js/viz/world-3d.js`)

**Files:**
- Create: `js/viz/world-3d.js`

**Interfaces:**
- Consumes: `three` (importmap), `renderButler2DSvg` & `BUTLER_MOODS` from `./svg-illustrator.js?v=5`
- Produces:
  - `render2DFallbackWorld(container, { mood, suit, roman, faceDown })`
  - `class CardWarsWorld`:
    - `constructor({ webglContainer, fallbackContainer, onModeChange })`
    - `async init(prefer2D = false)`
    - `setButlerMood(mood)`
    - `setCameraMode(mode)` (`'overview' | 'focus' | 'peek'`)
    - `triggerCardDeal({ suit, roman, faceDown })`
    - `setCardFaceState({ suit, roman, faceDown })`
    - `pause()` / `resume()` / `resize()` / `set2DMode(use2D)` / `dispose()`

- [ ] **Step 1:** Implement `render2DFallbackWorld` rendering a crisp SVG Card Wars sunny beach, yellow wooden table, dual-lane board, miniature props, active 2D card badge, and animated Sir Pip 2D Butler.
- [ ] **Step 2:** Implement `CardWarsWorld` with Three.js 3-band toon `DataTexture`, `addToonOutline(mesh, scale)` inverted-hull outlines, sky/ocean/beach/rocks/grass environment, yellow wooden tabletop with flower decal canvas texture, dual-lane board, tabletop props (lemonade pitcher, deck box, mugs), articulated 3D Butler Sir Pip with dynamic `256x192` facial `CanvasTexture` + 6 mood animations + periodic blink, flying/flipping 3D playing card mesh with micro-shake, 3 smooth camera lerp presets, `webglcontextlost` fallback listener, and `pause()`/`resume()` GPU lifecycle.
- [ ] **Step 3:** Verify syntax with `node --check js/viz/world-3d.js`.

---

### Task 3: Manual Step-by-Step *Shorts/TikTok* Beat Engine (`js/ui/shorts-stage.js`)

**Files:**
- Create: `js/ui/shorts-stage.js`

**Interfaces:**
- Consumes: `BUTLER_MOODS`, `renderButler2DSvg` from `../viz/svg-illustrator.js?v=5`
- Produces:
  - `CARD_BEATS` (9 entries, 34 total beats matching Spec Section 5)
  - `class ShortsStageController`:
    - `constructor({ onBeatChange, onNextCard })`
    - `loadCard(cardIdx, { beatIdx = 0 } = {})`
    - `goToBeat(beatIdx)` / `nextBeat()` / `prevBeat()`
    - `jumpToInteractive()` / `toggleInteractiveMode()`
    - `getCurrentBeat()`

- [ ] **Step 1:** Author all 34 beats across 9 cards in `CARD_BEATS` with punchy Bahasa Indonesia hooks, color-coded kinetic caption HTML (`kw-mct`, `kw-goa`, `kw-alo`, `kw-gold`), valid `mood`, `mode` (`diorama` / `interactive`), and exact `action` cue strings.
- [ ] **Step 2:** Implement `ShortsStageController` rendering `#shorts-progress-bar` clickable segments, `#shorts-mode-toggle` pill, `#butler-badge-svg`, `#butler-mood-pill`, `#butler-hook-text`, `#butler-caption-text` with pop-in re-trigger animation, and `#beat-prev-btn` / `#beat-next-btn`.
- [ ] **Step 3:** Verify syntax with `node --check js/ui/shorts-stage.js`.

---

### Task 4: *Card Wars* CSS Theme & 3D Tabletop Stage HTML (`css/atlas-theme.css`, `index.html`)

**Files:**
- Modify: `css/atlas-theme.css`
- Modify: `index.html`

**Interfaces:**
- Consumes: Google Fonts (`Fredoka`, `Syne`, `Plus Jakarta Sans`, `JetBrains Mono`), `three@0.170.0` importmap
- Produces: Complete DOM anchors for `#world-3d-layer`, `#world-webgl-mount`, `#world-2d-fallback`, `#hud-peek-btn`, `#hud-render-toggle`, `#peek-return-bar`, `#shorts-progress-bar`, `#shorts-mode-toggle`, `#butler-caption-bar`, `#beat-prev-btn`, `#beat-next-btn`, `.interactive-only` progressive disclosure containers on all 9 slides, and Card Wars bold-outline CSS rules (`?v=5`).

- [ ] **Step 1:** Rewrite `css/atlas-theme.css` with Card Wars bold-outline aesthetic (`2.5px solid #1A1816`, solid comic shadows, WCAG AA palette, full-viewport `#world-3d-layer`, diorama vs interactive progressive disclosure via `data-stage-mode="diorama"`, peek-table state `body.is-peeking-table`, kinetic caption pop animation, Card Wars fanned hand, responsive mobile collapse, `prefers-reduced-motion`).
- [ ] **Step 2:** Update `index.html` with `Fredoka` font, `?v=5` links, `#world-3d-layer` background mount, top HUD controls (`Intip Meja 3D (T)`, `3D/2D`), Shorts progress header + kinetic Butler caption footer inside the front card face, and `.interactive-only` class markers on dense control/table sidebars while keeping every single simulator, equation, table, and citation ID intact.

---

### Task 5: Deck Navigation & Master Choreography (`js/ui/deck.js`, `js/ui/controls.js`)

**Files:**
- Modify: `js/ui/deck.js`
- Modify: `js/ui/controls.js`

**Interfaces:**
- Consumes: `CardWarsWorld`, `ShortsStageController`, `ThreeLabController`, all algorithm & SVG modules (`?v=5`)
- Produces: Synchronized card flipping, 3D card slam + camera lerp, manual step-by-step Shorts beats with continuous gentle looping shape animations per beat, smart `Space`/`N`/`B`/`T`/`F`/`G`/`Esc` keyboard routing, and GPU pause/resume handoff for Card VII Lab 3D.

- [ ] **Step 1:** Update `js/ui/deck.js` (`?v=5`, `soka_card_wars_opened_v5`) adding `peekMode` (`togglePeek`), `onBeatNav(dir)`, `onCardDeal`, and clean non-conflicting keyboard routing (`Enter`/`Space`/`N`/`B`/`T`/`F`/`G`/`Esc`/`1-9`/`Arrows`).
- [ ] **Step 2:** Update `js/ui/controls.js` (`?v=5`) wiring `CardWarsWorld`, `ShortsStageController`, continuous smooth looping beat animations (`startBeatLoop` / `stopAllBeatLoops`) for every diorama beat, immediate interactive triggers for simulator beats, GPU pause/resume handoff when Card VII WebGL Lab is active, and `document.hidden` cleanup.
- [ ] **Step 3:** Verify syntax with `node --check js/ui/deck.js` and `node --check js/ui/controls.js`.

---

### Task 6: Expanded Automated Verification Suite (`tests/verify-algorithms.mjs`)

**Files:**
- Modify: `tests/verify-algorithms.mjs`

**Interfaces:**
- Verifies all 10 JS modules, 34 Shorts beats, 6 Butler moods, 2D fallback renderer, all DOM ID references, WCAG AA contrast on Card Wars v5 palette, R-02 zero em-dash across code + docs, and all mathematical invariants.

- [ ] **Step 1:** Expand `tests/verify-algorithms.mjs` with tests covering Review Focus items 1-5 (`CARD_BEATS` schema & 34-beat integrity, `renderButler2DSvg` 6 moods, `render2DFallbackWorld`, DOM ID wiring across all 4 UI/world modules, Card Wars v5 WCAG AA contrast, and R-02 em-dash scan across all 10 JS + HTML + CSS + spec/plan docs).
- [ ] **Step 2:** Run `node --check` on all 10 JS modules and `node tests/verify-algorithms.mjs`, confirming 100% pass with exit code 0.
