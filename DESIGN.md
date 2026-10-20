---
title: "PK Khmer Type — Design System & Architecture Guide"
project: "pk-khmer-type"
version: "2.4.0-beta"
application_type: "Interactive Cambodian (Khmer Standard, Khmer NiDA) and English touch-typing web studio"
framework: "Vanilla Web Standards (HTML5, CSS3, Vanilla ES Modules / IIFE scripts)"
build_tool: "Vite (v5/v6 runner)"
styling_architecture: "Pure Modular CSS with centralized CSS Custom Properties (:root in css/base.css)"
tailwind_installed: false
css_preprocessor: "none"
evidence_markers:
  V: "Verified in the inspected source"
  P: "Proposed but not implemented (requires explicit approval)"
  U: "Unknown or not verifiable from the supplied evidence"
inspected_files:
  - "package.json"
  - "vite.config.js"
  - "css/base.css"
  - "css/lessons.css"
  - "index.html"
---

# PK Khmer Type — Design System (`DESIGN.md`)

> **Evidence Legend**
> - **`[V]` Verified**: Extracted directly from the inspected repository source files.
> - **`[P]` Proposed**: Recommended improvement not yet implemented; requires explicit approval before modifying any code.
> - **`[U]` Unknown**: Not verifiable from the supplied audit excerpt; must be verified in source before changing.

---

## 1. Project Overview

### 1.1 Identity & Architecture
- **`[V]` Project Name**: `pk-khmer-type`
- **`[V]` Current Version**: `2.4.0-beta`
- **`[V]` Description**: PK Khmer Type — Interactive Cambodian (Khmer Standard, Khmer NiDA) & English Touch-Typing Studio with Supabase Cloud Sync.
- **`[V]` Runtime Framework**: Vanilla Web Standards (HTML5, CSS3, Vanilla ES Modules / IIFE scripts). No React, Vue, Svelte, or Angular dependencies exist.
- **`[V]` Styling Architecture**: Pure Modular CSS with centralized CSS Custom Properties (`:root` variables) defined in `css/base.css` (9,278 lines, 301 KB) alongside feature stylesheets such as `css/lessons.css`.
- **`[V]` Zero Utility/Preprocessor Dependencies**: No Tailwind CSS, UnoCSS, PostCSS config (`postcss.config.js`), Tailwind config (`tailwind.config.js`), SASS, LESS, or `globals.css` file exists in the repository.
- **`[V]` Client Dependencies**: `@supabase/supabase-js` (`^2.117.3`) for optional local-first cloud backup and authentication.
- **`[V]` Build & Verification Tooling**:
  - `npm run dev`: `node scripts/generate_supabase_config.js && vite`
  - `npm run build`: `node scripts/generate_supabase_config.js`
  - `npm test`: `node --test tests/*.test.js`
  - `npm run validate`: `node scripts/validate_curriculum.js`
- **`[V]` Vite Configuration (`vite.config.js`)**:
  - Public base path: `base: '/PK-Khmer-Type/'`
  - Custom HTML plugin: `pk-inject-vite-env` injects `window.__PK_VITE_ENV__` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) into `</head>`.

### 1.2 Inspected Source Inventory

| Relative Path | Verified Role in Audit | Status |
| :--- | :--- | :--- |
| `package.json` | Project metadata, scripts, `@supabase/supabase-js` dependency, absence of CSS frameworks. | `[V]` |
| `vite.config.js` | Base path (`/PK-Khmer-Type/`) and `pk-inject-vite-env` HTML transform plugin. | `[V]` |
| `css/base.css` | Global `:root` token dictionary, reset, scrollbars, themes, `.top-actions`, `.modal-backdrop`/`.modal-card`, `.auth-*`. | `[V]` (Partial: lines 1–73, 2432–2520, 2946–3025, 3578–3632, 3790–3845) |
| `css/lessons.css` | Practice session cards, `.stat-pod` telemetry components, accuracy/WPM/streak grading. | `[V]` (Partial: lines 2043–2102) |
| `index.html` | Google Fonts declarations, bilingual `.i18n-t` DOM structure, and shared component markup. | `[V]` (Partial: lines 258, 465–505, 772–779, 1795–1836, 2534–2565) |

---

## 2. Design Tokens: Colors, Typography, Spacing, Radii

### 2.1 Color Tokens

#### Core Dark Theme (`:root` in `css/base.css`) `[V]`

| CSS Custom Property | Value | Verified Role | Status |
| :--- | :--- | :--- | :--- |
| `--ink` | `#fff6e8` | Primary typography and heading color | `[V]` |
| `--ink-dim` | `#d9c6a3` | Secondary / muted typography label color | `[V]` |
| `--ink-on-accent` | `#241405` | Dark contrast text on gold/accent surfaces | `[V]` |
| `--stone-edge` | `#05070d` | Deepest canvas background & vignette edge | `[V]` |
| `--stone-1` | `#11131f` | Primary surface gradient bottom stop | `[V]` |
| `--stone-2` | `#161a2b` | Elevated card background top stop | `[V]` |
| `--stone-3` | `#1e2338` | Card border outline | `[V]` |
| `--gold` | `#ff9d2e` | Deep amber / brand gold | `[V]` |
| `--gold-bright` | `#ffd166` | Primary vibrant gold interactive glow & icon tint | `[V]` |
| `--temple-blue` | `#2dd4a7` | Success / emerald indicator | `[V]` |
| `--temple-red` | `#ff3b56` | Error / danger indicator | `[V]` |
| `--tooltip-bg` | `#150d08` | Tooltip surface background | `[V]` |
| `--tooltip-border` | `#ffd166` | Tooltip border accent | `[V]` |
| `--tooltip-ink` | `#fff3e0` | Tooltip text color | `[V]` |

#### Futuristic Accent & Glass Variables (`:root` in `css/base.css`) `[V]`

| CSS Custom Property | Value | Verified Note | Status |
| :--- | :--- | :--- | :--- |
| `--fx-cyan` | `#ffd166` | Mapped to bright gold hex in `:root` | `[V]` |
| `--fx-violet` | `#ff9d2e` | Mapped to deep amber/gold hex in `:root` | `[V]` |
| `--fx-pink` | `#ff3b56` | Mapped to temple red/rose hex in `:root` | `[V]` |
| `--fx-glow-cyan` | `rgba(255, 209, 102, 0.55)` | Warm gold glow | `[V]` |
| `--fx-glow-violet` | `rgba(255, 157, 46, 0.5)` | Deep amber glow | `[V]` |
| `--fx-ink` | `#fff6e8` | Matches `--ink` | `[V]` |
| `--fx-ink-dim` | `#d9c6a3` | Matches `--ink-dim` | `[V]` |
| `--fx-glass` | `rgba(14, 17, 32, 0.6)` | Primary frosted glass fill | `[V]` |
| `--fx-glass-2` | `rgba(20, 24, 44, 0.5)` | Secondary frosted glass fill | `[V]` |
| `--fx-border` | `rgba(180, 220, 255, 0.2)` | Translucent cool-tinted glass border | `[V]` |

#### Hardcoded Component & Telemetry Colors `[V]`

| Context / Selector | Value | Usage | Status |
| :--- | :--- | :--- | :--- |
| `html` background | `#05060d` | Root document canvas fallback | `[V]` |
| `body` base gradient midpoint | `#0a0c18` | `linear-gradient(180deg, #05070d 0%, #0a0c18 55%, #05070d 100%)` | `[V]` |
| `.top-actions` surface | `rgba(10, 14, 26, 0.72)` | Floating toolbar glass background | `[V]` |
| `.top-actions button:hover .pk-icon` | `#ffe8a3` | Hovered toolbar SVG icon tint | `[V]` |
| `.stat-pod-acc .stat-pod-icon`, `b.grade-emerald` | `#34d399` | Accuracy icon & high accuracy emerald grade (`text-shadow: 0 0 10px rgba(52,211,153,0.5)`) | `[V]` |
| `.stat-pod-acc b.grade-gold`, `.stat-pod-streak` | `#ffd166` | Medium accuracy gold grade & streak counter (`text-shadow: 0 0 10px rgba(255,209,102,0.4)`) | `[V]` |
| `.stat-pod-acc b.grade-rose` | `#fb7185` | Low accuracy rose grade (`text-shadow: 0 0 10px rgba(251,113,133,0.5)`) | `[V]` |
| `.stat-pod-wpm .stat-pod-icon`, `.stat-pod-num` | `#38bdf8` | WPM sky-blue telemetry color (`text-shadow: 0 0 10px rgba(56,189,248,0.4)`) | `[V]` |
| `.auth-submit-btn` gradient midpoint | `#a0e8ff` | `linear-gradient(135deg, var(--fx-cyan) 0%, #a0e8ff 45%, var(--fx-violet) 100%)` | `[V]` |

#### Alternate Theme Palettes (`css/base.css`)

| Theme Class on `<html>` | Surfaces | Typography | Accents | Status |
| :--- | :--- | :--- | :--- | :--- |
| `html.theme-light` | `#f8fafc`, `#ffffff`, `#f1f5f9` | `#0f172a` (primary slate), `#475569` (muted slate) | `#d97706` (amber), `#059669` (emerald), `#e11d48` (rose) | `[V]` |
| `html.theme-sepia` | `#fdfbf7`, `#f4ede2`, `#e3d5be` | `#2c1b0c` (teakwood ink), `#5c4228` (warm brown) | `#b45309` (warm amber), `#15803d` (forest green) | `[V]` |
| `html.theme-temple` | Not in audit excerpt | Not in audit excerpt | Not in audit excerpt | `[U]` |
| `html.theme-moonlight` | Not in audit excerpt | Not in audit excerpt | Not in audit excerpt | `[U]` |
| `html.theme-jungle` | Not in audit excerpt | Not in audit excerpt | Not in audit excerpt | `[U]` |
| `html.theme-sunset` | Not in audit excerpt | Not in audit excerpt | Not in audit excerpt | `[U]` |
| `html.theme-glass` | Not in audit excerpt | Not in audit excerpt | Not in audit excerpt | `[U]` |

---

## 2. Design Tokens: Colors, Typography, Spacing, Radii

### 2.2 Typography & Fonts

#### Font Families (Declared in `index.html`, line 258) `[V]`

| Font Family Stack | Verified Weights | Verified Domain Usage | Status |
| :--- | :--- | :--- | :--- |
| `'JetBrains Mono', monospace` | `400`, `500`, `600` (and `700` in `.stat-pod-num`) | Default `body` font, typing practice characters, numbers, WPM/accuracy counters, keyboard labels. | `[V]` |
| `'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | `400`, `500`, `600`, `700` | UI buttons, top navigation items, `.stat-pod-title` labels, tabs, form headers, and text inputs. | `[V]` |
| `'Kantumruy Pro', sans-serif` | `400`, `500`, `600`, `700` | Primary Khmer body and UI translation text (`.i18n-t[data-km]`). | `[V]` |
| `'Noto Serif Khmer', serif` | `400`, `600`, `700` | Classical Khmer literature excerpts, cultural headers, and legal statutes. | `[V]` |
| `'Orbitron', sans-serif` | `500`, `600`, `700`, `800` | Large display scores, race timers, and brand badge highlights. | `[V]` |
| `'Cormorant Garamond', serif` | `500`, `600` (italics) | Classical manuscript quotes and founder dedication bylines. | `[V]` |

#### Verified Type Scale & Letter Spacing `[V]`
- **`[V]` Root Base Size**: `font-size: 16px` on `:root`.
- **`[V]` Telemetry Micro-Label (`.stat-pod-title`)**: `0.56rem`, `font-weight: 700`, `letter-spacing: 0.06em`, `text-transform: uppercase`, `line-height: 1.15`.
- **`[V]` Top Command Button (`.top-actions button, .top-actions a.top-action-btn`)**: `0.74rem`, `font-weight: 600`, `letter-spacing: 0.015em`, `text-transform: none`.
- **`[V]` Auth Primary Submit Button (`.auth-submit-btn`)**: `0.8rem`, `font-weight: 700`, `letter-spacing: 0.09em`, `text-transform: uppercase`.
- **`[V]` Telemetry Counter Value (`.stat-pod-num`)**: `0.84rem`, `font-weight: 700`, `line-height: 1.15`.
- **`[V]` Auth Input Field (`.auth-field input`)**: `0.85rem`.
- **`[U]` Global Heading Scale (`h1`–`h6`)**: Exact `rem`/`px` sizes for headings (`h1`, `h2#statsModalTitle`, etc.) are not included in the inspected CSS excerpts.

---

### 2.3 Spacing

- **`[V]` Architecture**: No `--space-*` custom properties exist in `:root`. Spacing uses explicit pixel values per component.
- **`[V]` Verified Component Spacing Values**:
  - `body` padding: `86px 20px 70px` (reserves `86px` top clearance for floating `.top-actions` and header elements).
  - Background grid cadence: `42px 42px` (`linear-gradient` grid lines on `body`).
  - `.top-actions`: `top: 14px; right: 20px; padding: 4px 6px; gap: 6px`.
  - `.top-actions-group`: `gap: 4px`.
  - `.top-actions-divider`: `width: 1px; height: 18px; margin: 0 2px`.
  - `.top-actions button`: `padding: 0 10px; min-height: 32px; height: 32px; gap: 6px`.
  - `.modal-backdrop`: `padding: 20px`.
  - `.modal-card`: `padding: 22px 24px 26px`.
  - `.stat-pod`: `padding: 6px 12px; gap: 8px`.
  - `.auth-field input`: `padding: 12px 14px`.
  - `.auth-submit-btn`: `padding: 13px; gap: 8px; margin-top: 4px`.

---

### 2.4 Border Radii `[V]`

| Radius Value | Verified Component / Element Target | Status |
| :--- | :--- | :--- |
| `1px` – `2px` | Micro chips, `.top-actions-divider` (`1px`) | `[V]` |
| `4px` – `6px` | Action badges, shortcut `<kbd>` (`.focus-kbd-badge`) | `[V]` |
| `8px` | Command bar buttons (`.top-actions button`, `a.top-action-btn`) | `[V]` |
| `10px` | Telemetry pods (`.stat-pod`), secondary toolbar items | `[V]` |
| `12px` | Top navigation capsule (`.top-actions`), text/email/password inputs (`.auth-field input`) | `[V]` |
| `14px` | Primary action buttons (`.auth-submit-btn`), tab containers | `[V]` |
| `18px` – `20px` | Modal dialog cards (`.modal-card` uses `18px`), surface panels | `[V]` |
| `999px` | Pill badges, scrollbar thumb (`::-webkit-scrollbar-thumb`) | `[V]` |

---

### 2.5 Elevation, Shadows & Glass Filters `[V]`

| Surface | Verified `box-shadow` | Verified `backdrop-filter` | Status |
| :--- | :--- | :--- | :--- |
| `.top-actions` | `0 14px 34px -8px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.12)` | `blur(20px) saturate(160%)` | `[V]` |
| `.top-actions button` (resting) | `0 1px 3px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.06)` | None | `[V]` |
| `.top-actions button:hover` | `0 4px 12px rgba(0, 0, 0, 0.35), 0 0 12px rgba(255, 209, 102, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.18)` | None | `[V]` |
| `.modal-backdrop` | None | `blur(18px) saturate(180%)` | `[V]` |
| `.modal-card` | `0 35px 80px -15px rgba(0,0,0,0.85), 0 0 45px rgba(255,209,102,0.12), inset 0 1px 0 rgba(255,255,255,0.12)` | None | `[V]` |
| `.stat-pod` | `inset 0 1px 0 rgba(255, 255, 255, 0.04)` | None | `[V]` |
| `.auth-field input` | Resting: none; Focus: `0 0 0 3px rgba(255,209,102,0.1), 0 0 20px rgba(255,209,102,0.12), inset 0 1px 0 rgba(255,255,255,0.04)` | `blur(8px)` | `[V]` |
| `.auth-submit-btn` | `0 0 22px rgba(255,209,102,0.35), 0 4px 18px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.3)` | None | `[V]` |

---

## 3. Component Rules and Existing Patterns

### 3.1 Global Architectural Patterns `[V]`
1. **Strict Zero-Emoji Policy `[V]`**:
   - Unicode emoji characters are strictly forbidden across all HTML, CSS, JS, and documentation.
   - All icons must use inline `<svg class="pk-icon">` (or `.stat-pod-icon`) with `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2.2"` (or `2` / `2.4` where verified), `stroke-linecap="round"`, `stroke-linejoin="round"`, and `aria-hidden="true"`.
2. **Bilingual Microcopy Pattern (`.i18n-t`) `[V]`**:
   - Every user-facing text node must carry the `.i18n-t` class with both `data-en="..."` and `data-km="..."` attributes, with English text as the default inner text.
3. **Local-First Theme Cascade `[V]`**:
   - Themes apply via root classes on `<html>` (`theme-light`, `theme-sepia`, `theme-temple`, `theme-moonlight`, `theme-jungle`, `theme-sunset`, `theme-glass`).
   - Preferences persist in `localStorage` under keys `khmerTheme`, `khmerSettingAnimationMode`, and `khmerSettingReducedMotion`.
4. **Multi-Layer Frosted Glass Depth `[V]`**:
   - Floating HUDs, command bars, and modal backdrops combine translucent dark fills (`rgba(10, 14, 26, 0.72)` or `rgba(9, 10, 16, 0.78)`), `1px` specular borders (`rgba(255, 255, 255, 0.08)`–`0.1`), `inset 0 1px 0` top highlights, and `backdrop-filter: blur(...) saturate(...)` (always paired with `-webkit-backdrop-filter`).

### 3.2 Studio Command Bar (`.top-actions`) `[V]`
- **Container**: `<div class="top-actions" role="toolbar" aria-label="Studio Command Bar">` positioned at `position: absolute; top: 14px; right: 20px; z-index: 40`.
- **Grouping**: Child buttons are grouped inside `<div class="top-actions-group" role="group" aria-label="...">` separated by `<div class="top-actions-divider" aria-hidden="true"></div>`.
- **Button Anatomy**:
  - Height locked to `32px` (`min-height: 32px`), `padding: 0 10px`, `border-radius: 8px`, `gap: 6px`.
  - Contains a `14x14` `.pk-icon` SVG (`color: var(--gold-bright, #ffd166)`, `filter: drop-shadow(0 0 5px rgba(255, 209, 102, 0.25))`), a `.i18n-t` label `<span>`, and optional `<kbd class="focus-kbd-badge">`.
  - **Transform Lock**: `.top-actions`, its buttons, and `.pk-icon` enforce `transform: none !important` across resting, `:hover`, and `:active` states to prevent jitter in the command bar.

### 3.3 Modal Backdrop & Dialog System (`.modal-backdrop` / `.modal-card`) `[V]`
- **Backdrop**: `<div class="modal-backdrop" id="..." hidden role="dialog" aria-modal="true" aria-labelledby="...">`
  - Uses `position: fixed; inset: 0; z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px`.
  - Visibility is toggled via the native HTML `hidden` attribute (`.modal-backdrop[hidden] { display: none; }`).
  - Background pairs a radial gold ambient glow (`radial-gradient(ellipse 70vw 60vh at 50% 45%, rgba(255,209,102,0.12), transparent 75%)`) over `rgba(9, 10, 16, 0.78)`.
- **Card**: `<div class="modal-card ...">`
  - Dimensions: `width: min(92vw, 560px); max-height: 88vh; overflow-y: auto; overflow-x: hidden`.
  - Surface: `background: linear-gradient(180deg, var(--stone-2), var(--stone-1)); border: 1px solid var(--stone-3); border-radius: 18px; padding: 22px 24px 26px`.
  - Header structure uses `.modal-top` containing `<h2 id="...">` (with a `20x20` `.pk-icon` glyph and `.i18n-t` title) and `<button class="modal-close" aria-label="...">` with a `16x16` close `.pk-icon` (`stroke-width="2.4"`).

### 3.4 Live Practice Stat Pods (`.stat-pod`) `[V]`
- **Container**: Grouped inside `.lesson-stats`. Each pod uses `<div class="stat-pod stat-pod-{type}" title="...">`.
- **Anatomy**:
  - `14x14` `<svg class="stat-pod-icon">` + `<div class="stat-pod-body">` stacking `<span class="stat-pod-title i18n-t">` over `<b class="stat-pod-num">`.
  - Surface: `background: rgba(0, 0, 0, 0.42); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 6px 12px; gap: 8px`.
- **Telemetry Semantic Subclasses**:
  - `.stat-pod-acc`: Icon `#34d399`; dynamic value classes `.grade-emerald` (`#34d399`), `.grade-gold` (`#ffd166`), `.grade-rose` (`#fb7185`).
  - `.stat-pod-wpm`: Icon and number `#38bdf8`.
  - `.stat-pod-streak`: Icon and number `#ffd166`.

### 3.5 Authentication Form & Glow Button (`.auth-*`) `[V]`
- **Tabs (`.auth-tabs`)**: `role="tablist"` with `<button type="button" class="auth-tab [active] i18n-t" role="tab" aria-selected="true|false">` and an animated `<span class="auth-tab-thumb" aria-hidden="true"></span>`.
- **Form Fields (`.auth-field`)**:
  - Contains a `.i18n-t` `<label>`, `.auth-input-wrap` (housing `.auth-input-icon` with a `14x14` `.pk-icon` and the `<input>`), and `<p class="auth-field-error" role="alert"></p>`.
  - Error state applies `.has-error` to `.auth-field`, shifting input border to `rgba(255, 59, 86, 0.55)` and background to `rgba(255, 59, 86, 0.04)`.
- **Primary Glow Submit Button (`.auth-submit-btn`)**:
  - Full-width (`width: 100%`), `padding: 13px`, `border-radius: 14px`, dark text `color: #241405` (`--ink-on-accent`), `background: linear-gradient(135deg, var(--fx-cyan) 0%, #a0e8ff 45%, var(--fx-violet) 100%)`.

---

## 4. Layout and Responsive Behavior

### 4.1 Document & Canvas Layout `[V]`
- **Global Box Model**: `* { box-sizing: border-box; }`
- **Root Canvas (`html`)**: `background: #05060d; scroll-behavior: smooth;`
- **Body Layout (`body`)**:
  - Flex column centered container: `display: flex; flex-direction: column; align-items: center; min-height: 100vh; overflow-x: hidden; margin: 0; padding: 86px 20px 70px; position: relative;`
  - Multi-layered ambient background combining 3 radial gradients (`rgba(255,157,46,0.18)`, `rgba(255,209,102,0.13)`, `rgba(255,59,86,0.10)`), a `42px x 42px` gold wireframe grid (`rgba(255,209,102,0.05)`), and a vertical dark stone base gradient.
- **Vignette Overlay (`body::before`)**:
  - `position: fixed; inset: 0; pointer-events: none; z-index: 0;`
  - Applies `radial-gradient(ellipse 80vw 60vh at 50% 40%, transparent 40%, #05070d 100%)`.

### 4.2 Scrollbar Architecture `[V]`
- Firefox/Standard: `scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.18) transparent;`
- WebKit (`::-webkit-scrollbar`): `width: 6px; height: 6px;`, buttons hidden (`display: none !important; width: 0 !important; height: 0 !important;`), transparent track/corner, pill thumb (`border-radius: 999px; background: rgba(255,255,255,0.18)`) with gold hover (`rgba(255,209,102,0.45)`) and active (`rgba(255,209,102,0.7)`) states.

### 4.3 Z-Index Scale `[V]`
- `z-index: 0` — `body::before` ambient vignette overlay
- `z-index: 40` — `.top-actions` studio command bar
- `z-index: 2000` — `.modal-backdrop` dialog overlay

### 4.4 Responsive Sizing & Breakpoints
- **`[V]` Fluid Modal Sizing**: `.modal-card` uses intrinsic viewport clamping (`width: min(92vw, 560px); max-height: 88vh;`) with `20px` backdrop padding.
- **`[V]` Toolbar Wrapping**: `.top-actions` sets `flex-wrap: nowrap`, and `.top-actions-group` sets `flex-shrink: 0`.
- **`[U]` Media Query Breakpoints**: Specific `@media (max-width: ...)` rules across the remaining uninspected lines of `css/base.css` and `css/lessons.css` are not included in the supplied audit report and must be inspected before modifying responsive layouts.

---

## 5. Interactive States

### 5.1 Timing & Easing Tokens `[V]`
- **Standard Micro-Interaction Transition**: `0.18s ease` or `0.2s ease` (explicitly listed per property or `all .18s ease` on `.stat-pod`).
- **Modal Backdrop Entrance**: `modal-backdrop-spring-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards`.
- **Modal Card 3D Spring Entrance**: `modal-card-spring-in 0.42s cubic-bezier(0.16, 1, 0.3, 1) both` (animates `perspective(1200px)` from `translateY(38px) scale(0.88) rotateX(5deg)` through a `64%` overshoot `translateY(-3px) scale(1.018) rotateX(-0.6deg)` and `84%` settle to `translateY(0) scale(1) rotateX(0deg)`).
- **Tab Sliding Thumb**: `cubic-bezier(0.2, 0.85, 0.3, 1.05)` (`320ms`).

### 5.2 Component State Matrix `[V]`

| Component | Resting State | `:hover` State | `:active` / `:focus` / Error State | Status |
| :--- | :--- | :--- | :--- | :--- |
| `.top-actions button`, `a.top-action-btn` | `color: var(--ink-dim, #cbd5e1)`, `bg: rgba(255,255,255,0.035)`, `border: rgba(255,255,255,0.08)`, `transform: none !important` | `color: #ffffff`, `border-color: rgba(255,209,102,0.45)`, gold gradient bg, gold glow shadow, icon `#ffe8a3`, `transform: none !important` | `:active`: `bg: rgba(255,209,102,0.2)`, tight shadow, `transform: none !important`. Toggle active uses `.active` + `aria-pressed="true"`. | `[V]` |
| `.stat-pod` | `bg: rgba(0,0,0,0.42)`, `border: rgba(255,255,255,0.08)`, icon `scale(1)` | `bg: rgba(0,0,0,0.55)`, `border-color: rgba(255,255,255,0.16)`, `.stat-pod-icon` scales to `transform: scale(1.1)` | Dynamic telemetry grading via `.grade-emerald`, `.grade-gold`, `.grade-rose` on `<b>` | `[V]` |
| `.auth-field input` | `bg: rgba(14,17,32,0.6)`, `border: rgba(255,255,255,0.1)`, placeholder `rgba(217,198,163,0.4)` | Inherits default | `:focus`: `outline: none`, `border-color: rgba(255,209,102,0.55)`, `bg: rgba(255,209,102,0.04)`, `3px` gold ring + `20px` glow, `transform: translateY(-1px)`. `.has-error input`: `border-color: rgba(255,59,86,0.55)`, `bg: rgba(255,59,86,0.04)` | `[V]` |
| `.auth-submit-btn` | Gradient fill, `22px` gold glow shadow, `transform: none` | `38px` gold glow shadow, `transform: translateY(-2px)`, `filter: brightness(1.06)` | `:active`: `transform: translateY(0) scale(0.98)`, reduced `16px` glow shadow | `[V]` |

---

## 6. Accessibility Requirements

### 6.1 Verified Accessibility Implementation `[V]`
- **Semantic Landmark & Widget Roles**:
  - Command bar uses `role="toolbar" aria-label="Studio Command Bar"` with nested `role="group" aria-label="..."`.
  - Modals use `role="dialog" aria-modal="true" aria-labelledby="..."` and native `hidden` attribute toggling.
  - Auth switcher uses `role="tablist"`, `role="tab"`, and `aria-selected="true|false"`.
  - Toggle buttons maintain `aria-pressed="true|false"` (e.g., `#guideToggleBtn`).
  - Dialog trigger buttons declare `aria-haspopup="dialog"` (e.g., `#shortcutsOpenBtn`).
  - Form field validation errors use `<p class="auth-field-error" role="alert"></p>`.
- **Icon & Decorative Hiding**:
  - All decorative `<svg class="pk-icon">`, `<svg class="stat-pod-icon">`, `.top-actions-divider`, and `.auth-tab-thumb` elements carry `aria-hidden="true"`.
  - Icon-only buttons (such as `.modal-close`) provide explicit `aria-label` attributes (`aria-label="Close statistics"`).
- **Reduced Motion Compliance**:
  - Animations and transforms are globally guarded by `html.reduce-motion`, `html.reduced-motion`, and `@media (prefers-reduced-motion: reduce)`, which zero out transforms and animations.
  - User motion preferences are persisted in `localStorage` (`khmerSettingAnimationMode`, `khmerSettingReducedMotion`).

### 6.2 Unverified Accessibility Details `[U]`
- **`[U]` Global `:focus-visible` Policy**: `.auth-field input:focus` replaces the default outline with a custom gold box-shadow ring (`0 0 0 3px rgba(255,209,102,0.1)`), but global `:focus-visible` rules for buttons and links across the rest of `css/base.css` were not included in the audit excerpt.

---

## 7. Anti-Slop Constraints

Future contributors and AI coding agents must strictly obey these negative constraints:

1. **NO Emojis Anywhere (`[V]`)**: Never insert Unicode emojis (e.g., target, fire, trophy, sparkles, flags) in HTML, CSS pseudo-elements, JS strings, or markdown UI copy. Always use inline `<svg class="pk-icon">` with `stroke="currentColor"`, `stroke-width="2.2"`, `stroke-linecap="round"`, and `stroke-linejoin="round"`.
2. **NO Tailwind or External CSS Frameworks (`[V]`)**: Never write Tailwind utility classes (`flex`, `px-4`, `bg-slate-900`, `rounded-lg`, etc.) or install Tailwind, PostCSS, Bootstrap, or CSS-in-JS libraries.
3. **NO Unlocalized UI Copy (`[V]`)**: Never add hardcoded English-only user-facing text in HTML. Every label, button, title, or subtitle must include class `i18n-t` with accurate `data-en` and `data-km` attributes.
4. **NO Generic SaaS Color Palettes (`[V]`)**: Do not introduce generic blue/indigo/violet SaaS gradients (`#6366f1`, `#8b5cf6`). Respect the dark stone (`--stone-1` through `--stone-edge`) and warm Angkor gold (`--gold`, `--gold-bright`) palette. Note that even `--fx-cyan` (`#ffd166`) and `--fx-violet` (`#ff9d2e`) resolve to warm gold/amber in `:root`.
5. **NO Transform Jitter on Command Bar Controls (`[V]`)**: Never add hover scale or vertical translation (`translateY`) to `.top-actions` or its child buttons/icons; `transform: none !important` is intentionally enforced there.
6. **NO Obtrusive Scrollbars (`[V]`)**: Do not add glowing scrollbar thumbs at rest or visible scrollbar arrow buttons; keep the discreet `6px` pill scrollbar.
7. **NO Framework Migrations (`[V]`)**: Do not introduce React, Vue, Svelte, JSX, or TypeScript build steps. Maintain Vanilla HTML5, modular CSS, and Vanilla ES Modules / IIFE scripts.

---

## 8. Rules for Future AI Coding Agents

When implementing UI features or styling updates in `pk-khmer-type`:

1. **Check `:root` Tokens First**: Reuse existing custom properties from `css/base.css` (`--ink`, `--ink-dim`, `--stone-1`, `--stone-2`, `--stone-3`, `--stone-edge`, `--gold`, `--gold-bright`, `--temple-blue`, `--temple-red`, `--fx-glass`, `--fx-border`, etc.) before writing raw hex/rgba values.
2. **Match Font Stack to Role**:
   - Use `'Space Grotesk', -apple-system, sans-serif` for UI controls, buttons, tabs, form fields, and micro-labels.
   - Use `'JetBrains Mono', monospace` for body defaults, typing prompts, keycaps, and live numeric telemetry (`.stat-pod-num`).
   - Use `'Kantumruy Pro', sans-serif` and `'Noto Serif Khmer', serif` for Khmer script contexts.
   - Use `'Orbitron', sans-serif` only for large display scores, race timers, and brand badges.
3. **Always Pair WebKit Backdrop Prefixes**: Whenever applying `backdrop-filter`, always declare `-webkit-backdrop-filter` with the identical value on the line immediately preceding or following it.
4. **Preserve Bilingual DOM Bindings**: Keep `<span class="i18n-t" data-en="..." data-km="...">...</span>` intact when editing buttons, headers, or form labels.
5. **Respect Reduced Motion**: Any new keyframe animation or `transform` transition must respect `html.reduce-motion`, `html.reduced-motion`, and `@media (prefers-reduced-motion: reduce)`.
6. **Verify Uninspected Rules Before Editing**: Because `css/base.css` is 9,278 lines and `css/lessons.css` is over 2,100 lines, always read the target section of the stylesheet before adding or modifying selectors to avoid selector collisions.
7. **Run Validation Scripts**: After permitted code changes, verify using `npm test` (`node --test tests/*.test.js`) and `npm run validate` (`node scripts/validate_curriculum.js`).

---

## 9. Known Inconsistencies and Proposed Improvements

> **Important Boundary**: Subsection 9.1 documents facts verified in the audit (`[V]`). Subsection 9.2 lists proposed improvements (`[P]`) that **have not been implemented** and **require explicit user approval** before any code is modified.

### 9.1 Known Inconsistencies Observed in Audit `[V]`
1. **Misleading `--fx-*` Token Names in `:root` `[V]`**:
   - In `css/base.css`, `--fx-cyan` is assigned `#ffd166` (bright gold), `--fx-violet` is assigned `#ff9d2e` (amber gold), `--fx-glow-cyan` is `rgba(255, 209, 102, 0.55)`, and `--fx-glow-violet` is `rgba(255, 157, 46, 0.5)`. Agents reading only the variable name (`--fx-cyan`) without checking `:root` may falsely assume the color is cyan.
2. **Hardcoded Telemetry & Accent Hex Values Outside `:root` `[V]`**:
   - `css/lessons.css` uses hardcoded hex and RGBA values for telemetry grading (`#34d399`, `#fb7185`, `#38bdf8`) instead of `:root` custom properties.
   - `.auth-submit-btn` uses a hardcoded `#a0e8ff` sky-blue midpoint stop between `var(--fx-cyan)` and `var(--fx-violet)`.
   - `.top-actions button` uses a cool slate fallback `var(--ink-dim, #cbd5e1)` even though `--ink-dim` is warm parchment (`#d9c6a3`).
3. **Redundant Fallback Expression in `vite.config.js` `[V]`**:
   - Lines 4–5 of `vite.config.js` contain duplicate expressions: `env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL || ''` and `env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY` (line 4 repeats `env.VITE_SUPABASE_URL` instead of falling back to `process.env.VITE_SUPABASE_URL`).
4. **Monolithic Global Stylesheet (`css/base.css`) `[V]`**:
   - `css/base.css` spans 9,278 lines (301 KB), combining `:root` tokens, resets, theme overrides, navigation, modals, and auth forms in a single file.

### 9.2 Proposed Improvements (Not Implemented — Awaiting Approval) `[P]`
1. **`[P]` Document or Alias Telemetry Tokens in `:root`**:
   - Add semantic telemetry custom properties (e.g., `--telemetry-emerald: #34d399`, `--telemetry-rose: #fb7185`, `--telemetry-sky: #38bdf8`) in `css/base.css` and reference them in `css/lessons.css`.
2. **`[P]` Audit Remaining Theme Palettes**:
   - Extract the exact token overrides for `html.theme-temple`, `html.theme-moonlight`, `html.theme-jungle`, `html.theme-sunset`, and `html.theme-glass` from `css/base.css` to complete the theme token table in Section 2.1 (currently marked `[U]`).
3. **`[P]` Audit Global Heading Scale, Breakpoints, and `:focus-visible` Rules**:
   - Inspect `css/base.css` for `h1`–`h6` sizing, `@media` responsive breakpoints, and keyboard `:focus-visible` styles to replace `[U]` markers in Sections 2.2, 4.4, and 6.2.
4. **`[P]` Fix Typo in `vite.config.js` Environment Fallback**:
   - Update `const supabaseUrl = env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL || ''` to `const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''` to match `supabaseAnonKey`.
