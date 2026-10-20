<div align="center">

  <img src="logo.svg" alt="PK Khmer Type Crest" width="88" height="88" />

  # PK Khmer Type
  ### ក្តារចុចខ្មែរ PK — High-Performance Touch Typing Studio

  <p>
    <b>The definitive touch-typing tutor for Khmer Unicode (Standard &amp; NiDA) and English.</b><br />
    Built with pure vanilla web standards, real-time 3D kinematic hands, procedural mechanical audio, and a zero forced-reflow typing engine.
  </p>

  <p>
    <a href="https://not-phana.github.io/PK-Khmer-Type/">
      <img src="https://img.shields.io/badge/Launch_Studio-Live_Web_App-ffd166?style=for-the-badge&logo=googlechrome&logoColor=black" alt="Launch Studio" />
    </a>
    <a href="https://not-phana.github.io/PK-Khmer-Type/welcome.html">
      <img src="https://img.shields.io/badge/Welcome_Page-Bilingual_Guide-38bdf8?style=for-the-badge&logo=safari&logoColor=black" alt="Welcome Page" />
    </a>
    <a href="https://not-phana.github.io/PK-Khmer-Type/dashboard.html">
      <img src="https://img.shields.io/badge/Dashboard-Live_Telemetry-a78bfa?style=for-the-badge&logo=databricks&logoColor=white" alt="Live Telemetry Dashboard" />
    </a>
    <a href="https://not-phana.github.io/PK-Khmer-Type/Documents/">
      <img src="https://img.shields.io/badge/Documentation-3D_Mechanical-34d399?style=for-the-badge&logo=bookstack&logoColor=white" alt="Documentation" />
    </a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Version-v2.4.0--Beta-0a0d14?style=flat-square&logo=git&logoColor=ffd166" alt="Version 2.4.0 Beta" />
    <img src="https://img.shields.io/badge/Curriculum-276_Lessons_%2B_Custom_Hub-0a0d14?style=flat-square&logo=bookstack&logoColor=38bdf8" alt="276 Lessons" />
    <img src="https://img.shields.io/badge/Architecture-Zero--Reflow_60%2F120FPS-0a0d14?style=flat-square&logo=speedtest&logoColor=34d399" alt="Zero-Reflow 60/120 FPS" />
    <img src="https://img.shields.io/badge/Audio-Procedural_Web_Audio-0a0d14?style=flat-square&logo=w3c&logoColor=f43f5e" alt="Procedural Web Audio" />
    <img src="https://img.shields.io/badge/Offline-100%25_file%3A%2F%2F%2F-0a0d14?style=flat-square&logo=pwa&logoColor=c084fc" alt="100% Offline" />
    <img src="https://img.shields.io/badge/Design-Strict_Zero--Emoji-0a0d14?style=flat-square&logo=svg&logoColor=ffd166" alt="Strict Zero-Emoji" />
  </p>

  <br />

  <img src="assets/pk-canva-studio-home.png" alt="PK Khmer Type Studio Interface" width="960" />

</div>

---

## Why PK Khmer Type?

Typing Khmer abugida script should feel just as fluid, fast, and satisfying as typing English. 

Most typing trainers treat Khmer as an afterthought with clunky font rendering, inaccurate layout mapping, and slow browser performance. **PK Khmer Type** was engineered from scratch to fix this:

- **100% Vanilla Web Technologies**: Zero runtime frameworks, zero bloated dependencies, and zero build steps.
- **Hardware-Accurate Typing Physics**: Procedural switch audio and instant keystroke response with `< 0.05ms` input latency.
- **Biomechanical Kinematics**: Translucent anatomical hands that physically guide your fingers to the correct keys and simultaneous modifiers in real time.
- **Runs Everywhere**: Works online on GitHub Pages or 100% offline straight from your filesystem (`file:///`).

---

## Visual Showcase

<table>
  <tr>
    <td width="50%" valign="top">
      <h3 align="center">Real-Time Biomechanical Hand Guides</h3>
      <img src="assets/pk-canva-live-lesson.png" alt="Live Lesson Hand Biomechanics" width="100%" />
      <p align="center">
        <em>Anatomical hands dynamically track target keys and simultaneous modifiers (Shift, AltGr, Ctrl) with natural metacarpal arching and damped palm translation.</em>
      </p>
    </td>
    <td width="50%" valign="top">
      <h3 align="center">Custom Lessons Crafting Hub</h3>
      <img src="assets/pk-canva-custom-lessons.png" alt="Custom Lessons Crafting Hub" width="100%" />
      <p align="center">
        <em>Paste, edit, shuffle, repeat, and clean custom drills. Fully preserves complex Khmer Unicode (vowels, Coeng ្, diacritics) across browser refreshes.</em>
      </p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3 align="center">Cinematic Focus Mode</h3>
      <img src="assets/pk-canva-focus-mode.png" alt="Focus Mode" width="100%" />
      <p align="center">
        <em>Press <code>Alt + F</code> to hide all UI clutter, sidebars, and toolbars, centering the manuscript and keyboard for distraction-free typing.</em>
      </p>
    </td>
    <td width="50%" valign="top">
      <h3 align="center">Official Khmer NiDA &amp; Standard Layouts</h3>
      <img src="assets/pk-khmer-type-khmer-nida-keyboard-layout.png" alt="Khmer NiDA Keyboard Layout" width="100%" />
      <p align="center">
        <em>Full dynamic support for Khmer Standard, Official NiDA, and English QWERTY with instant <code>Alt + 1/2/3</code> switching and layer indicators.</em>
      </p>
    </td>
  </tr>
</table>

---

## Under the Hood: Engineering Highlights

### 1. Zero Forced-Reflow Engine
Keystroke handling runs in under **0.05 milliseconds**:
- **Geometry Caching (`keyCoordCache`)**: Keyboard coordinates are cached in memory and invalidated only upon window resize (`ResizeObserver`).
- **Non-Blocking Animations**: Key strikes trigger lightweight Web Animations API calls (`fe.g.getAnimations()`) instead of triggering layout thrashing via forced reflows.
- **WeakMap Particle Coordinates**: Canvas particle bursts resolve keycap centers without triggering DOM layout calculations.
- **Debounced Persistence**: Active lesson sessions serialize in background debounce timers (400ms) with synchronous flushes on page unload.

### 2. Procedural Web Audio Synthesizer
Zero audio asset downloads. Pure Web Audio API oscillators and filtered noise buffers simulate tactile mechanical switch profiles in real time:
- **Topre Thock**: Deep, rounded electro-capacitive thock.
- **Holy Panda**: Crisp, tactile bump with acoustic body resonance.
- **Cherry Blue**: Sharp, satisfying double-click snap.
- **Silent Linear**: Muted, cushioned bottom-out for quiet environments.
- **Temple Ambience**: Procedural white/pink noise synthesis evoking torchlit stone halls.

### 3. Strict Zero-Emoji Design Philosophy
Every visual badge, keyboard indicator, tooltip, button, and status icon is rendered as a clean, accessible **inline SVG vector icon** (`24x24` grid, `2.2px` stroke, `currentColor` theme inheritance). No emojis, no unicode font discrepancies, and zero resolution loss on 4K/retina displays.

---

## Mastering Khmer Script in 60 Seconds

Khmer is an **abugida** writing system where dependent vowels and subscripts attach around a base consonant:

### Rule 1: Always Type the Base Consonant First
Type the base consonant first, even if its vowel visually displays on the left, top, or bottom:
```
  Base Consonant  +  Dependent Vowel  =  Rendered Syllable
       ក (K)      +       េ (E)       =       កេ
```

### Rule 2: Typing Subscript Consonants (`ជើងអក្សរ` — Coeng `្`)
To stack a consonant beneath another consonant, press the layout's **Coeng key** before the second consonant:

| Keyboard Layout | Coeng Trigger Key | Keystroke Recipe | Result |
| :--- | :---: | :--- | :---: |
| **Khmer Standard** | `Space` | `ក` + `Space` + `ខ` | **ក្ខ** |
| **Khmer NiDA** | `J` (`្`) | `ក` + `J` + `ខ` | **ក្ខ** |

### Rule 3: Typing Visible Word Spaces
Because plain `Space` triggers Coeng (`្`) on Khmer Standard, press **`Shift + Space`** to insert a visible space between phrases or sentences.

### Rule 4: Dynamic Modifier Layers
Hover or hold modifier keys to preview all 4 active layers:
- **Base Layer**: Primary consonants and common dependent vowels.
- **Shift Layer**: Voiced consonants (`ឃោសៈ`), upper diacritics, and secondary vowels.
- **Ctrl Layer**: Currency symbols, Khmer independent vowels (`ស្រៈពេញតួ`), and punctuation.
- **AltGr Layer (Right Alt)**: Khmer numerals (`០–៩`), lunar calendar symbols, and sacred marks.

---

## Complete Curriculum Structure

PK Khmer Type features **276 total lessons** organized into progressive levels:

| Curriculum Track | Levels | Base Lessons | Bonus Vault | Total | Focus Progression |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Khmer Standard** | 16 | 77 | 18 | **96** | Home row anchors -> Consonants -> Vowels -> Coeng stacks -> Classic literature |
| **Khmer NiDA** | 16 | 77 | 18 | **96** | Official NiDA layout -> Vowel combinations -> Subscripts -> Scriptorium |
| **English (US)** | 16 | 68 | 18 | **84** | Home row -> Alpha reaches -> Numbers -> Symbols -> Homeric &amp; Shakespearean prose |
| **Total** | **48** | **222** | **54** | **276** | **Zero-to-fluent mastery across all three keyboard layouts** |

*Completing all 222 base lessons unlocks the golden **Grandmaster Bonus Vault (Level 222+)**, featuring 54 advanced endurance sprints across classical Cambodian literature, Pali-Sanskrit compounds, and speed texts.*

---

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Shift` + `Space` | Insert visible word/sentence space |
| `Alt` + `1` | Switch to **Khmer Standard Layout** |
| `Alt` + `2` | Switch to **Khmer NiDA Layout** |
| `Alt` + `3` | Switch to **English (US) QWERTY Layout** |
| `Alt` + `F` | Toggle **Cinematic Focus Mode** |
| `Alt` + `L` | Toggle **Language** (English &lt;--&gt; Khmer) |
| `Alt` + `M` | Toggle **Smart Mouse Cursor Inspector** |
| `Alt` + `S` | Open **Settings &amp; Theme Studio** |
| `?` | Open **Shortcuts Cheat Sheet** |
| `Esc` | Close active dialog / pause drill / exit Focus Mode |

---

## Quick Start (10 Seconds)

### Option A: Open Directly (Zero Installation)
Simply double-click **`index.html`** or **`welcome.html`** in any web browser (Chrome, Edge, Firefox, Safari, Brave). All 276 lessons, audio synthesizers, 3D hand guides, and themes run out of the box via `file:///`.

### Option B: Local Development Server

```bash
# Clone the repository
git clone https://github.com/not-Phana/PK-Khmer-Type.git
cd PK-Khmer-Type

# Start the local development server
npm run dev

# Or launch the lightweight built-in node server
node scripts/dev_server.js
```
Then open `http://localhost:5174/` in your browser.

### Automated Testing &amp; Curriculum Verification

```bash
# Run the complete test suite (136 unit and integration tests)
npm test

# Run curriculum progression audit across all 276 lessons
npm run validate

# Run the 64-check Round 2 audit verification suite
node scripts/verify_audit_fixes.js
```

---

## Project Structure

```text
.
├── index.html                      # Main typing studio shell
├── welcome.html                    # Bilingual interactive welcome experience
├── dashboard.html                  # Live mastery telemetry and per-key heatmap
├── manifest.json                   # PWA manifest
├── sw.js                           # Offline service worker
├── logo.svg                        # Vector brand crest
├── launch/                         # Product launch deck showcase
├── Documents/                      # Khmer script orthography and 3D keycap studio
├── css/
│   ├── base.css                    # Design tokens, themes, frosted glass, typography
│   ├── keyboard.css                # Keycaps, 3D hand overlays, and HUD styles
│   ├── typing.css                  # Prompt manuscript, character highlights, error shake
│   ├── lessons.css                 # Lesson docks, Grandmaster Vault, custom lesson UI
│   ├── settings.css                # Settings modal and theme toggles
│   ├── welcome.css                 # Welcome page animations and card layouts
│   └── responsive.css              # Responsive layout breakpoints
├── js/
│   ├── app.js                      # Application initialization and mode router
│   ├── keyboard.js                 # Layout rendering, zero-reflow keyCoordCache, hand kinematics
│   ├── typing.js                   # Keystroke engine, WeakMap FX caching, Web Audio synth
│   ├── lessons.js                  # 276-lesson curriculum runner, debounced active session save
│   ├── custom-lessons.js           # Custom lesson crafting, storage, and validation engine
│   ├── adaptive.js                 # Dynamic adaptive practice engine
│   ├── review.js                   # Spaced repetition and weak-key detector
│   ├── race.js                     # Typing race mode with bot pacers
│   ├── cursor-inspector.js         # Anchored cursor HUD and phonetic tooltip
│   ├── settings.js                 # Theme switcher and user preference manager
│   ├── statistics.js               # Lifetime analytics and WPM calculations
│   ├── smooth-cursor.js            # Smooth trailing cursor badge with idle sleep
│   ├── shortcuts.js                # Global keyboard shortcut registry
│   └── supabase-config.js          # Cloud backup and authentication client
├── data/
│   ├── keyboard.json               # Layout character maps for Standard, NiDA, English
│   ├── curriculum-data.js          # Pre-bundled 276-lesson curriculum
│   └── curriculum/                 # Raw JSON level and exercise definitions
└── scripts/
    ├── dev_server.js               # Local static HTTP dev server
    ├── validate_curriculum.js      # Curriculum integrity validator
    └── verify_audit_fixes.js       # 64-check audit verification suite
```

---

## Author &amp; License

Designed and built by **Phana Phley (Kon)** in Cambodia to make Khmer and English typing education modern, accessible, and fast for everyone.

Distributed under the **MIT License**. Contributions and feedback are warmly welcome.
