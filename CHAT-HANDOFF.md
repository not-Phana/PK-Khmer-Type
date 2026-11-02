# PK Khmer Type — Chat Handoff & Context Transfer

This document provides a complete, authoritative handoff of the project state, architectural decisions, completed work, verified facts, and immediate next steps for continuing development in a new chat session.

---

## 1. Project Overview

- **Project Name**: `pk-khmer-type` (PK Khmer Type / ក្តារចុចខ្មែរ PK)
- **Current Version**: `2.4.0-beta`
- **Founder & Maintainer**: Phanna Kurosaki
- **Repository Remote**: `https://github.com/not-Phana/PK-Khmer-Type.git`
- **Application Purpose**: Free, interactive 10-finger mechanical touch-typing web studio for Cambodian (Khmer Standard, Official Khmer NiDA) and English (US QWERTY) keyboards, featuring real-time biomechanical 3D hand visualizers, adaptive weak-key analysis, multiplayer/bot typing races, test lab certification, and optional Supabase cloud synchronization with local-first offline fallback.
- **Architectural Foundation**:
  - **Runtime Framework**: Vanilla Web Standards (HTML5, pure Modular CSS, Vanilla ES Modules and IIFE scripts). No React, Vue, Angular, or Svelte dependencies.
  - **Styling Architecture**: Pure Modular CSS with centralized CSS Custom Properties (`:root` in `css/base.css`, 9,200+ lines) alongside feature stylesheets (`css/lessons.css`, `css/keyboard.css`, `css/settings.css`, `css/welcome.css`).
  - **Build & Dev Tooling**: Vite runner with base path `base: '/PK-Khmer-Type/'`, `scripts/generate_supabase_config.js` for environment injection, and native Node.js test runner (`node --test tests/*.test.js`).
  - **Storage & Cloud Model**: Local-first storage (`localStorage`) as the authoritative source of truth, augmented by an offline queue (`pk_offline_queue_v1`) and optional `@supabase/supabase-js` (v2.117.3) cloud synchronization with JSON backup export and import.
- **Directory Layout**:
  - `index.html`: Main touch-typing training room, virtual keyboard, and lesson workbench.
  - `dashboard.html`: Analytics suite, Performance Progression Trajectory chart, 30-day activity punchcard, scribe ranks, and mastery certificates.
  - `welcome.html`: Interactive tactile acoustic keyboard switch soundboard and curriculum orientation.
  - `DESIGN.md`: Approved design system documentation covering tokens, color palettes, typography, spacing, component patterns, and evidence markers.
  - `css/`: Modular stylesheets (`base.css`, `lessons.css`, `keyboard.css`, `settings.css`, `welcome.css`).
  - `js/`: Application modules (`app.js`, `keyboard.js`, `typing.js`, `lessons.js`, `adaptive.js`, `race.js`, `storage.js`, `cloud-sync.js`, `cursor-inspector.js`, `quick_guide.js`, `analytics.js`).
  - `data/characters/`: Authentic Khmer Unicode character databases, ligature mappings, and audio maps.
  - `scripts/`: Validation scripts (`validate_curriculum.js`, `generate_supabase_config.js`).
  - `tests/`: Comprehensive test suite (159 passing unit tests).

---

## 2. Decisions and Agreements

1. **Strict Zero-Emoji Policy**:
   - Explicit user rule: Never use emoji characters (e.g. Unicode glyphs) anywhere in HTML, CSS, JavaScript, tutorial strings, status badges, commit messages, documentation, or model responses.
   - All visual status badges, indicators, buttons, and chips must use crisp inline `<svg>` vector icons (`stroke="currentColor"`, `stroke-width="2.2"`, `stroke-linecap="round"`, `stroke-linejoin="round"`) or clean text labels.
2. **Vanilla Web Standards Preservation**:
   - Agreed to maintain pure vanilla web standards. Rejected refactoring to SPA frameworks (React/Vue/Svelte) to eliminate bundle overhead and keep keystroke input latency at sub-millisecond levels.
3. **Local-First, Cloud-Optional Data Contract**:
   - `localStorage` is the authoritative offline source of truth.
   - Network connectivity drops must never interrupt or degrade practice sessions.
   - Offline operations queue (`pk_offline_queue_v1`) synchronizes with Supabase upon reconnection.
   - User-facing manual JSON export and import guarantees zero data lock-in.
4. **Performance & Lag Prevention Architecture**:
   - Prohibited forced synchronous reflows inside input hot-paths (e.g. avoided `offsetWidth`/`offsetHeight` reads during keystroke rendering).
   - Applied CSS layout deferral via `content-visibility: auto; contain-intrinsic-size: auto 64px;` across heavy list items (`.lesson-card`, `.stat-tile`, `.race-lb-row`).
   - Removed GPU-intensive backdrop blur filters when operating under minimal or performance modes.
5. **Chart Tooltip Positioning Model**:
   - In `dashboard.html`, rejected positioning the floating hologram HUD outside or above the chart container.
   - Set `.chart-hologram-hud` at `top: 10px;` inside `.chart-container` with dynamic horizontal flipping: left of laser line when cursor is on the right half (`transform: translateX(-100%)`), and right of laser line when on the left half (`transform: translateX(0)`), with horizontal margin boundary clamping.
6. **Hand Kinematics & Reach Limits**:
   - Finger tip coordinates are bounded by natural anatomical extension limits (`maxReach = restLen * 1.45`).
   - Palm and wrist translation factors for top-row and distant keys were increased (`factorY = 0.58; factorX = 0.40;`) to allow the whole hand to glide toward the number row rather than over-extending fingers.

---

## 3. Verified Facts and User-Provided Information

### Verified in Codebase and Runtime
- **Unit Tests**: 159 tests passing in `tests/*.test.js` via `npm test` with 0 failures.
- **Curriculum Coverage**: 276 total lessons across 3 tracks (96 Khmer Standard, 96 Khmer NiDA, 84 English). Passed all structural, prerequisite, and length checks via `npm run validate`.
- **Git Branch & Status**: On branch `main`. Clean working tree. 4 local commits ahead of `origin/main`.
- **Remote URL**: `https://github.com/not-Phana/PK-Khmer-Type.git`.
- **GitHub Push Permission Block**: Attempting `git push origin main` failed with:
  `remote: Permission to not-Phana/PK-Khmer-Type.git denied to phanakurosaki12.`
  `fatal: unable to access 'https://github.com/not-Phana/PK-Khmer-Type.git/': The requested URL returned error: 403`
  - Cause: The local Windows credential helper currently authenticates as `phanakurosaki12` rather than the repository owner `not-Phana`.
- **Design System Document**: `DESIGN.md` exists at the root, capturing verified design tokens, component classes, evidence markers (`[V]`, `[P]`, `[U]`), and layout guidelines.
- **Vite Configuration**: `vite.config.js` sets base path to `/PK-Khmer-Type/` and injects `window.__PK_VITE_ENV__`.

---

## 4. Work Completed

### 1. Dashboard Chart Tooltip Overhaul (`dashboard.html`)
- **Positioning**: Replaced broken `bottom: calc(100% - 15px);` with `top: 10px;`, preventing the tooltip card from pushing into `.chart-top-bar` and obscuring stream toggle buttons (`Dual Stream`, `Velocity Wave`, `Precision Wave`).
- **Dynamic Laser Tracking**: Implemented dynamic side-flipping so the tooltip sits on the opposite side of the cursor crosshair without covering reticles or bleeding off the chart edge.
- **Text Wrapping & Title Formatting**: Added `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;` to `.hud-title`. Raw slug identifiers like `adaptive-stage-5` are now cleanly rendered as `Adaptive Stage 5`.
- **Duration Precision**: Formatted duration seconds using `Math.round()` to prevent floating-point strings like `00:34.746 duration`.

### 2. Biomechanical Finger Geometry & Hand Overlay (`js/keyboard.js`)
- **Anatomical Extension Clamping**: Added `maxReach` clamp to prevent unnatural rubber-band stretching when striking distant keys.
- **Vertical Clamping**: Constrained `tPt.y` within `[12px, wrapRect.height - 10px]` to prevent fingertips from shooting into header stats.
- **Smooth Number Row Reaching**: Enhanced wrist glide factors (`factorY = 0.58; factorX = 0.40;`) for distant keys (`grave`, `k1`-`k0`, `minus`, `equal`, `backspace`).
- **Scroll Synchronization**: Attached a debounced passive window `scroll` listener to invalidate stale key coordinate caches when scrolling.

### 3. Performance & Lag Reduction
- Eliminated synchronous layout thrashing in `js/quick_guide.js` and `js/typing.js`.
- Throttled custom cursor animations and paused physics loops when idle or in minimal mode.
- Deployed `content-visibility: auto` across offscreen lesson tiles and cards in `css/base.css`.

### 4. Offline Fallback & Cloud Sync
- Built offline queue and export/import functionality in `js/cloud-sync.js` and `js/storage.js`.

### 5. Documentation
- Saved complete `DESIGN.md` design system documentation at repository root.
- Overhauled `README.md` with full architecture, layout tables, and abugida typing mechanics.

---

## 5. Current State and Progress

- **Working Directory**: `e:\PK-Khmer-Type-main\PK-Khmer-Type-main`
- **Current Git Branch**: `main`
- **Unpushed Commits on `main`**:
  - `cdebea1`: `fix(dashboard): resolve chart tooltip boundary clipping, header overlap, and text wrapping`
  - `88a77fb`: `feat(dashboard): polish performance progression trajectory with cyber-spline curves, laser crosshairs, and live telemetry chips`
  - `21cc228`: `feat(dashboard): enhance analytics and learning tracking with scribe ranks, activity calendar, velocity charts, and certificate`
  - `995b206`: `docs(readme): overhaul documentation with comprehensive architecture, abugida formula, and verified file tree`
- **Working Tree**: Completely clean, all automated tests passing.
- **Application State**: Fully operational. Typing lessons, adaptive practice, typing races, sound synthesizer, 3D hand visualizers, and dashboard charts render cleanly without visual clipping or runtime errors.

---

## 6. Remaining Work

1. **Resolve Git Upstream Authorization (Priority 1)**:
   - Update Windows Git Credential Manager or configure an SSH key for GitHub account `not-Phana` to push the 4 unpushed commits (`cdebea1`, `88a77fb`, `21cc228`, `995b206`) to `origin main`.
2. **Cross-Browser Verification of Hand Overlay (Priority 2)**:
   - Verify the hand overlay across various viewport scaling factors and high-DPI displays to ensure the new `ResizeObserver` and `scroll` listener maintain alignment under all zoom levels.
3. **PWA Offline Service Worker Caching Review (Priority 3)**:
   - Audit cache versioning in `sw.js` to confirm newly added dashboard and styling updates are cached for offline practice without stale asset collisions.

---

## 7. Important Warnings and Things to Preserve

- **Do Not Break Zero-Emoji Policy**: Under no circumstances should Unicode emoji icons be introduced into HTML, CSS, JavaScript, markdown documentation, or commit messages. Crisp inline SVG icons must always be used.
- **Do Not Revert Coordinate Clamping**: In `js/keyboard.js`, keep the `maxReach` clamping and the passive scroll listener intact. Without them, finger visualizers will shoot into header bars or stretch excessively.
- **Preserve Unicode Character Mapping Tables**: Do not alter `data/characters/khmer.json`, NiDA compound vowel deconstruction tables, or Zero-Width Space (`\u200B`) logic in `js/typing.js` as they govern authentic Khmer keyboard input.
- **Preserve CSS Performance Optimizations**: Keep `content-visibility: auto; contain-intrinsic-size: auto 64px;` in `css/base.css` to prevent lag when rendering 270+ lesson cards.
- **Documentation Only for this Turn**: Do not modify application code, run installs, or push during this handoff step.

---

## 8. Immediate Next Step

**Starting Point for the Next Chat Session**:
1. Check GitHub push credentials to resolve the HTTP 403 authorization error for repository `not-Phana/PK-Khmer-Type`:
   ```bash
   git push origin main
   ```
2. Once credentials are authenticated for `not-Phana`, push the 4 local commits to update the live GitHub repository and trigger the deployment workflow.

