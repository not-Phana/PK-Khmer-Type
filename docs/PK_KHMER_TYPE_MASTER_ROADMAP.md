# PK KHMER TYPE — MASTER DEVELOPMENT ROADMAP & ARCHITECTURAL MAP
**Target Codebase:** PK Khmer Type (`idk`)  
**Document Status:** ACTIVE MASTER ROADMAP — SINGLE SOURCE OF TRUTH  
**Current Milestone:** PHASE 15 COMPLETED (Sovereign Air-Gapped Foundation Shipped & Verified with 180 Tests)  
**File Name:** `PK_KHMER_TYPE_MASTER_ROADMAP.md`  

---

## 1. PROJECT STATUS OVERVIEW

PK Khmer Type is an offline-first, high-precision Khmer and English touch-typing trainer. Following the completion of the sovereign local-first evolution and master verification suite, the core foundation, adaptive syllable generator, checkpoint gates, classroom tools, offline profiles, and single-file standalone distribution are fully completed across 180 automated tests.

### Status Key:
- `[COMPLETED]`: Fully implemented, verified with tests, and active in the repository.
- `[PARTIALLY COMPLETE]`: Baseline infrastructure or logic exists, but requires expansion or tightening.
- `[NEXT]`: The immediate upcoming phase to be implemented.
- `[PLANNED]`: Designed and scheduled in the master roadmap.
- `[VALIDATION]`: Formal verification gate requiring automated pass before advancing.
- `[BLOCKED]`: Waiting on a prerequisite phase.

### Subsystem Health & Status Summary:
| Subsystem | Status | Current Baseline | What Remains |
| :--- | :---: | :--- | :--- |
| **Curriculum Data** | `[COMPLETED]` | 40 levels, 218 lessons, 664 exercises, 20,798 units across English, NiDA, Standard. Zero lessons below 80 units. | All 3 layouts fully hydrated and active. |
| **Curriculum Bundler & Validator** | `[COMPLETED]` | `validate_curriculum.js` & `bundle_curricula.js` enforce 0 progression violations and 0 broken links. | Continuous execution in CI/validation gates. |
| **Runtime Lesson Engine** | `[COMPLETED]` | `js/lessons.js` hydrates all 3 layouts with hard $\ge 90\%$ accuracy checkpoint gating. | Core progression fully enforced. |
| **Typing Engine Core** | `[COMPLETED]` | Unicode NFC normalization, IME composition handling, multi-codepoint unit slicing, backspace stack. | Audio profile customization & sound latency tuning. |
| **Real-Time Keystroke Tracker** | `[COMPLETED]` | `js/tracker.js` (`PK_TRACKER`) zero-latency logging per key, finger, unit, layout, and active session. | Kinematic finger distance & ergonomics calculation. |
| **Review Engine Core** | `[COMPLETED]` | `js/review.js` (`PK_REVIEW`) character catalog, confusion matrix, staleness detection, candidate queue. | Connecting candidate queue to 1-click targeted drill UI button. |
| **Adaptive Practice (English)** | `[COMPLETED]` | Keybr-style letter progress bars, dynamic percentages (+2%/+3% correct, -1%..-4% wrong), 2,143 words. | Production ready. |
| **Adaptive Practice (Khmer)** | `[COMPLETED]` | Phonotactically safe syllable generator adhering to A/O consonant series harmony and Chuon Nath subscript rules in `js/adaptive.js`. | Production ready; zero locked-character leakage. |
| **Practice Modes (Trial & Race)** | `[PARTIALLY COMPLETE]` | `js/race.js` has live track, local leaderboard, Ghost Pacer vectors (`.pkghost`), Temple Trial streaks. | Expand Temple Trial word bank dynamically; add weak-key launcher. |
| **Progress & Account Persistence** | `[COMPLETED]` | Multi-learner local profile switcher (`pk_profile_store_*`), pre-restore rollback snapshot (`pk_pre_restore_snapshot`). | Optional 4-digit PIN lock for shared school PCs. |
| **Offline Classroom Tools** | `[COMPLETED]` | `.pkcourse` course pack exporter/importer, `.pkgrade` verifiable student receipts with SHA-256 checksums in `js/custom-lessons.js`. | Teacher batch grading dropzone matrix in `dashboard.html`. |
| **Air-Gapped PWA & Standalone** | `[COMPLETED]` | Cache-first Service Worker (`sw.js` v91) + Standalone single-file HTML compiler (`scripts/bundle_single_file.js` -> 3.36 MB). | Production ready; cold offline execution verified. |
| **Localization & i18n** | `[PARTIALLY COMPLETE]` | `data/shared/i18n.json` exists; header and settings toggle English/Khmer. | 100% translation coverage for lesson cards, badges, and modals. |

---

## 2. THE MASTER ARCHITECTURE & DEVELOPMENT MAP

The following master map depicts the entire PK Khmer Type learning system from the completed Phase 9 baseline to total project completion:

```mermaid
flowchart TD
    classDef done fill:#1b3d2f,stroke:#2dd4a7,stroke-width:2px,color:#fff;
    classDef partial fill:#3d361b,stroke:#ffd166,stroke-width:2px,color:#fff;
    classDef next fill:#3d1b33,stroke:#ff5a70,stroke-width:3px,color:#fff;
    classDef planned fill:#1a2238,stroke:#4fe8ff,stroke-width:2px,color:#fff;
    classDef gate fill:#2c1b4d,stroke:#a06bff,stroke-width:2px,stroke-dasharray: 5 5,color:#fff;

    %% COMPLETED BASELINE
    subgraph BASELINE ["[MILESTONE] COMPLETED FOUNDATION (PHASES 1–10, 12, 14–15)"]
        P1_P2["Phase 1 & 2: Validator & Bundler Normalization"]:::done
        P3_P5["Phases 3–5: 218 Lessons Built (EN, NiDA, STD)"]:::done
        P6_P7["Phases 6 & 7: Runtime Hydration & Progress Isolation"]:::done
        P8_P9["Phases 8 & 9: Automated Coverage & Headless Browser Hydration"]:::done
        P10_DONE["Phase 10: Checkpoints, Hard Gates (≥90%) & Timers"]:::done
        P12_DONE["Phase 12: Khmer Adaptive Engine & Phonotactic Syllables"]:::done
        P14_DONE["Phase 14: Comprehensive 180-Test Verification Suite"]:::done
        P15_DONE["Phase 15: Air-Gapped PWA & Standalone Single-File Release"]:::done
        ENG_CORE["Typing Engine Core (NFC, IME, Backspace Stack)"]:::done
        TRACKER["Real-Time Keystroke Tracker (PK_TRACKER)"]:::done
        ADAPT_EN["Adaptive Practice for English (Keybr-style HUD)"]:::done
    end

    %% CRITICAL PATH & ACTIVE BACKLOG
    BASELINE --> PHASE11_SUB
    BASELINE --> PHASE13_SUB

    subgraph PHASE11_SUB ["PHASE 11: PRACTICE SYSTEM EXPANSION (ACTIVE BACKLOG)"]
        PHASE11["Phase 11: Temple Trial & Practice Expansion"]:::next
        TRIAL_EXP["Temple Trial Expansion (Dynamic Vocab from 384+ Words)"]:::planned
        RACE_EXP["Typing Race Text Engine (Multi-tier Literature Texts)"]:::planned
        REVIEW_UI["Targeted Weak-Key Drill Launcher (Connecting PK_REVIEW)"]:::planned
        PHASE11 --> TRIAL_EXP
        PHASE11 --> RACE_EXP
        PHASE11 --> REVIEW_UI
    end

    subgraph PHASE13_SUB ["PHASE 13: LOCALIZATION & SENSORY POLISH (ACTIVE BACKLOG)"]
        PHASE13["Phase 13: Complete i18n & Sensory/A11y Refinement"]:::planned
        I18N_FULL["Full Dual-Language Coverage (All 218 Lessons & Modals)"]:::planned
        AUDIO_PROFILE["Sound Engine Customization (Mechanical, Thock, Typewriter)"]:::planned
        A11Y_FOCUS["Accessibility, High-Contrast & Focus Mode Hardening"]:::planned
        PHASE13 --> I18N_FULL
        PHASE13 --> AUDIO_PROFILE
        PHASE13 --> A11Y_FOCUS
    end

    subgraph SOVEREIGN_BACKLOG ["SOVEREIGN INNOVATION BACKLOG"]
        BATCH_GRADE["Teacher Offline Batch Grading Workstation (dashboard.html)"]:::planned
        CERT_SVG["Printable Vector SVG Merit Certificates"]:::planned
        BIOMECH["Kinematic Biomechanics & Ergonomics Engine"]:::planned
        PIN_SEC["Offline 4-Digit PIN Security for Local Profiles"]:::planned
    end
```
```

---

## 3. MAJOR WORK AREAS & SUBSYSTEM DEEP DIVES

### A. Curriculum Subsystem
- **Current Baseline:** Complete 3-layout structure (English US, Khmer NiDA, Khmer Standard) totaling 218 lessons.
- **Physical Key Differentiation:**
  - *Standard Layout:* Spacebar base layer triggers Coeng (`្`), Shift+Space triggers word space, Semicolon triggers `ះ`.
  - *NiDA Layout:* `Shift + J` triggers Coeng (`្`), Base Space triggers ZWSP, Shift+Space triggers visible word space.
  - *English Layout:* Standard QWERTY home-row outward progression.
- **Planned Work:**
  - Enforce checkpoint accuracy gates ($\ge 90\%$) preventing unearned advancement.
  - Audit spaced review density to guarantee that at least $25\%$ of exercises in every level re-drill older keys.
  - Activate timed challenges (Level 12 / 13) with live countdown timers and WPM thresholds.

### B. Khmer NiDA & Standard Orthography Engine
- **Unicode Typing Order:** Strictly enforces **Consonant $\rightarrow$ Coeng $\rightarrow$ Subscript $\rightarrow$ Vowel**.
- **Compound Vowels:** Dedicated compound keys (`ាំ`, `ុំ`, `ុះ`, `េះ`, `ោះ`) taught as single atomic keystrokes.
- **Planned Work:**
  - Rare/Complex cluster validation (triple clusters like `ស្ទ្រី`, Sanskrit/Pali loans `សង្ឃ`, `សម្បត្តិ`, `កិត្តិយស`).
  - Intuitive visual correction hints when a user attempts to type left-side vowels (`េ`, `ែ`) before the consonant.

### C. Practice & Review Systems
- **Temple Trial (`trialPanel`):**
  - Current state: Hardcoded 9 Khmer words and 20 English words.
  - Planned expansion: Dynamically draw from `data/adaptive-vocab.js` and `data/typing-content.json` filtered by learner unlock level.
- **Typing Race (`racePanel`):**
  - Current state: Basic timer with local leaderboard.
  - Planned expansion: Multi-tier text bank (Easy, Medium, Hard, Expert) with culturally rich literature, proverbs, and historical passages.
- **Targeted Review (`js/review.js`):**
  - Current state: Generates confusion pairs, slow keys, and staleness rankings.
  - Planned expansion: Dedicated UI button to launch ad-hoc reinforcement sessions directly from `PK_REVIEW` candidate queue.

### D. Adaptive Practice System
- **Current State:** English is fully realized with dynamic letter progress bars (+2%/+3% correct, -1%..-4% mistakes), Keybr-style UI, and 2,143 dictionary words.
- **The Complete Adaptive Loop:**
  ```text
  Lesson Keystroke Telemetry (PK_TRACKER)
               │
               ▼
  Performance Evaluator (Accuracy, Error Clusters, Latency)
               │
               ▼
  Weak Area Detection (Error Rate >15% or Latency >2x Avg)
               │
               ▼
  Dynamic Word / Syllable Selector (65% Target Focus / 35% Maintenance)
               │
               ▼
  Target Word Stream Rendering (Interactive HUD)
               │
               ▼
  Before vs. After Delta Evaluation (Δ% Accuracy)
               │
               ▼
  Persistent State Update (pk_adaptive_state_v1)
  ```
- **Planned Work:** Extend dynamic cluster generator to Khmer NiDA and Standard layouts, ensuring zero locked-letter leakage while respecting Khmer phonotactics.

### E. Progress & Data Layer
- **Persistence:** LocalStorage key `khmerProgressData_v2` with layout isolation (`state.courses = { standard, nida, english }`).
- **Telemetry:** `PK_TRACKER` records attempts, errors, finger latency, and backspace counts.
- **Planned Work:**
  - Add structured historical attempt logging (date, lessonId, accuracy, WPM) for the Statistics dashboard.
  - Automated integrity check and fallback repair for corrupted storage states.

### F. Typing Engine & Sensory Feedback
- **Engine Core:** Multi-codepoint unit slicing (`splitIntoTypingUnits`), NFC normalization, IME awareness, Backspace history stack.
- **Sensory Systems:** Web Audio API key clicks, dynamic hands guide overlay, next-key glow, ember particle bursts.
- **Planned Work:**
  - Sound profile selector (Mechanical Blue, Linear Red, Deep Thock, Vintage Typewriter).
  - Keyboard-only navigation mode for 100% mouse-free operation.

### G. UI / UX & Localization
- **Design Foundation:** High-contrast dark theme with Temple, Moonlight, Jungle, Sunset, and Sepia variants.
- **Planned Work:**
  - Dual-language translation (`data/shared/i18n.json`) applied across all 218 lesson cards, badge tooltips, and modal descriptions.
  - Accessibility audit: Screen reader ARIA live-regions for error feedback, focus trap on open modals, and high-contrast color validation.

---

## 4. DETAILED SPECIFICATION OF FUTURE PHASES

```text
================================================================================
PHASE 10: CHECKPOINTS, GATEKEEPING & SPACED REVIEW AUDIT
================================================================================
Status:       [COMPLETED]
Dependencies: Phase 9 (Completed)
Files:        js/lessons.js, js/progress.js, data/curriculum/*

Goal:
Enforce true pedagogical gatekeeping across the 218 lessons and verify spaced
review distribution so learners do not advance without demonstrating accuracy.

Delivered & Verified:
1. Checkpoint Gatekeeping: Hard ≥90% accuracy barrier enforced in js/lessons.js.
2. Timed Challenge Mechanics: 1-minute and 3-minute countdown timers in Test Lab.
3. Spaced Review Audit: Verified review distribution across all 40 levels.

Validation:
Verified in tests/phase_d_checkpoints_and_lab.test.js with 100% pass rate.
```

```text
================================================================================
PHASE 11: PRACTICE SYSTEM EXPANSION (TEMPLE TRIAL & TYPING RACE)
================================================================================
Status:       [ACTIVE BACKLOG]
Dependencies: Phase 10
Files:        js/race.js, data/typing-content.json, data/shared/race-config.json

Goal:
Transform Temple Trial and Typing Race from basic stubs into rich, layout-aware
practice modes with extensive vocabularies and authentic texts.

Why It Exists:
Temple Trial currently has only 9 Khmer words and 20 English words. Typing Race
lacks multi-tier literary content and layout-aware difficulty scaling.

Main Work:
1. Temple Trial Vocabulary Expansion:
   - Expand word pools to 500+ authentic Khmer words and 1,000+ English words
     drawn from adaptive vocabulary banks.
   - Filter words based on the learner's unlocked keys in the active layout.
2. Typing Race Text Engine:
   - Populate Easy, Medium, Hard, and Expert categories with authentic Khmer
     literature, proverbs, historical narratives, and English classic prose.
   - Integrate scoring formula from data/shared/race-config.json (netWPM * acc^2.2).
3. Targeted Review Drill Launcher:
   - Connect js/review.js candidate queue to a 1-click "Targeted Drill" button.

Expected Result:
Temple Trial provides endless varied practice; Typing Race features authentic,
challenging texts across 4 difficulties; targeted review is instantly accessible.

Validation:
Unit tests confirming zero locked-letter leakage in Temple Trial; live Chrome
test completing a 30s race and saving scores to local leaderboard.
```

```text
================================================================================
PHASE 12: KHMER ADAPTIVE SYLLABLE ENGINE & LAYOUT ISOLATION
================================================================================
Status:       [COMPLETED]
Dependencies: Phase 10, Phase 11
Files:        js/adaptive.js, data/adaptive-vocab.js

Goal:
Bring full Khmer adaptive learning parity to match the English Keybr-style
trainer, supporting Khmer orthography and layout-specific mechanics.

Delivered & Verified:
1. Grapheme Cluster Syllable Generator: Built phonotactic Khmer syllable generator
   respecting consonant series harmony (A vs O) and Chuon Nath subscript rules.
2. Standard Layout Spacebar Coeng Adaptation: Thumb Spacebar coeng support verified.
3. NiDA Layout Shift+J Adaptation: Shift+J subscript sequences verified.
4. Granular Letter Progress UI for Khmer: Horizontal progress strip verified.

Validation:
Verified in tests/phase_c_khmer_adaptive.test.js with 100% pass rate.
```

```text
================================================================================
PHASE 13: FULL i18n LOCALIZATION & SENSORY/A11Y POLISH
================================================================================
Status:       [ACTIVE BACKLOG]
Dependencies: Phase 11, Phase 12
Files:        data/shared/i18n.json, js/app.js, css/*.css, index.html

Goal:
Deliver complete dual-language (Khmer / English) localization and refine sensory
and accessibility features for all user tiers.

Why It Exists:
The app is founded in Cambodia for Khmer and international learners. Every UI
element, lesson card, and feedback message must be fluently available in both languages.

Main Work:
1. 100% i18n Translation Coverage:
   - Localize all 218 lesson titles, level titles, objectives, and exercise
     descriptions into both Khmer and English.
   - Ensure dynamic string replacement when toggling language (Alt+L).
2. Audio Profile Engine:
   - Implement audio synthesizers/samples for distinct key profiles: Mechanical
     Clicky (Blue), Smooth Linear (Red), Deep Thock, and Antique Typewriter.
3. Accessibility & Focus Mode:
   - Implement ARIA live regions announcing typing errors for screen readers.
   - Enforce modal focus traps and Esc-key dismissals.
   - Refine Focus Mode (Alt+F) to dim distractions with smooth transitions.

Expected Result:
Instantaneous, flawless switching between Khmer and English UI; satisfying,
customizable tactile audio; full accessibility compliance.

Validation:
Lighthouse accessibility score ≥95; automated check confirming 0 missing
translation keys in data/shared/i18n.json.
```

```text
================================================================================
PHASE 14: COMPREHENSIVE VERIFICATION & CROSS-BROWSER REGRESSION
================================================================================
Status:       [COMPLETED]
Dependencies: Phases 10–13
Files:        tests/*.test.js, scripts/validate_curriculum.js

Goal:
Execute an exhaustive automated test battery covering every lesson, subsystem,
and edge case across major browser runtimes.

Delivered & Verified:
1. 180 automated unit and integration tests passing with 0 failures across all suites.
2. Full Khmer orthography verification: complex clusters, Robat, Bantoc, Coeng.
3. Storage quota resilience, snapshot rollback, and cross-account isolation tested.

Validation:
Verified via `npm test` (180 passing tests, 0 failures).
```

```text
================================================================================
PHASE 15: RELEASE CANDIDATE AUDIT & FINAL DELIVERY
================================================================================
Status:       [COMPLETED]
Dependencies: Phase 14
Files:        README.md, manifest.json, sw.js, scripts/bundle_single_file.js

Goal:
Package the completed PK Khmer Type learning system for production release,
verifying offline PWA readiness and documenting the codebase.

Delivered & Verified:
1. Cache-first Service Worker (`sw.js` v91) precaching static assets for cold offline launch.
2. Standalone single-file HTML compiler (`scripts/bundle_single_file.js` -> 3.36 MB bundle).
3. Verifiable student grade slips (`.pkgrade`) and classroom course packs (`.pkcourse`).
4. Strict Zero-Emoji compliance verified across all code and documentation.

Validation:
Verified in tests/phase_e_pwa_offline.test.js and tests/phase_i_standalone_bundler.test.js.
```

```text
================================================================================
SOVEREIGN INNOVATION BACKLOG (REMAINING ARCHITECTURAL PLANS)
================================================================================
1. Teacher Offline Batch Grading Workstation (dashboard.html):
   - Multi-file drag-and-drop dropzone in dashboard.html accepting 40-50 student
     .pkgrade.json slips at once.
   - Validates SHA-256 checksums and renders instant offline gradebook matrix.
2. Printable Vector SVG Merit Certificates:
   - Pure client-side generation of high-resolution, vector-crisp achievement
     certificates (Apprentice 20 WPM, Scribe 40 WPM, Master 60 WPM).
3. Kinematic Biomechanics & Ergonomics Engine:
   - Real-time finger travel distance in meters based on 19.05 mm ANSI key pitch.
   - Hand equilibrium indicator (left vs right ratio) and SFB stress alerts.
4. Offline 4-Digit PIN Security for Local Profiles:
   - Optional PIN protection preventing shared-PC overwrites in school computer labs.
5. Temple Trial Dynamic Vocabulary Expansion:
   - Dynamic word stream from 384+ Khmer words filtered by unlocked keys.
6. Direct Weak-Key Targeted Drill Launcher:
   - 1-click button connecting PK_REVIEW candidate queue to immediate remedial drill.
```

---

## 5. DEPENDENCY GRAPH & EXECUTION SEQUENCING

```mermaid
flowchart TD
    %% Baseline
    P9["Phase 9 Complete\n(Curriculum Hydrated & Tested)"]
    
    %% Milestone 1: Curriculum Integrity
    P10["Phase 10: Checkpoints, Gates & Spaced Review"]
    P9 --> P10
    
    %% Milestone 2: Practice & Adaptive (Parallel Tracks)
    P11["Phase 11: Practice System Expansion\n(Temple Trial & Race Text Engine)"]
    P12["Phase 12: Khmer Adaptive Engine\n(Syllable Generator & Cluster Physics)"]
    
    P10 --> P11
    P10 --> P12
    
    %% Milestone 3: Sensory & Localization
    P13["Phase 13: Full i18n Localization\n& Sensory/A11y Polish"]
    P11 --> P13
    P12 --> P13
    
    %% Milestone 4: Comprehensive QA
    P14["Phase 14: Comprehensive Verification\n& Full Regression Battery"]
    P13 --> P14
    
    %% Milestone 5: Delivery
    P15["Phase 15: Final Release Audit\n& System Sign-Off"]
    P14 --> P15
```

### Critical Path:
$$\text{Phase 9 (Done)} \longrightarrow \text{Phase 10 (Checkpoints)} \longrightarrow \text{Phase 12 (Khmer Adaptive)} \longrightarrow \text{Phase 13 (i18n & UX)} \longrightarrow \text{Phase 14 (Full Testing)} \longrightarrow \text{Phase 15 (Sign-Off)}$$

### Parallel Opportunities:
- **Phase 11 (Practice Expansion)** can be developed concurrently with **Phase 12 (Khmer Adaptive Engine)**, as Temple Trial/Race content is decoupled from the adaptive algorithm.
- **Audio profile customization (Phase 13)** can be implemented in parallel with **i18n text translation**.

---

## 6. CONNECTIONS TO EXISTING PLANNING DOCUMENTS

To preserve architectural continuity, this master roadmap incorporates and supersedes previous individual planning notes while maintaining links to existing project files:

| Existing Plan / Spec | File Location | How It Connects to Master Roadmap | Action |
| :--- | :--- | :--- | :--- |
| **Lesson Overhaul Master Plan** | `lesson_overhaul_plan.md` | Single source of truth for curriculum structure, 218 lesson specs, 10-stage pedagogy, and keyboard physics comparison. | **CONTINUE FROM EXISTING PLAN** (Phases 10–12 directly continue from here) |
| **Implementation Tasks Baseline** | `task.md` | Tracks foundational phases (Phases 2–7.9) including tracking (`PK_TRACKER`), review rules, and lesson strip fixes. | **ARCHIVED RECORD OF WORK** (Incorporated into Phase 1–9 baseline) |
| **Phase 7 Progress Spec** | `implementation_plan.md` | Architectural blueprint for character mastery classification (`locked` $\to$ `learning` $\to$ `proficient` $\to$ `mastered`). | **SUBSYSTEM SPEC** (Governs `js/review.js` candidate queues in Phase 11) |
| **Phase 8 Adaptive Practice Report** | `walkthrough.md` | Detailed report on adaptive practice architecture, dynamic percentage formula, Keybr-style UI, and word generator. | **SUBSYSTEM SPEC** (Governs Phase 12 Khmer adaptive expansion) |
| **Data Models & Characters** | `data/characters/*.json` | Character catalogs, key assignments, and unicode codepoint mappings. | **DATA ASSETS** (Referenced continuously) |
| **Curriculum Data Sources** | `data/curriculum/*/*.json` | Raw levels, lessons, and exercises partitioned by layout. | **DATA ASSETS** (Directly audited in Phase 10) |

---

## 7. DEFINITION OF A COMPLETED LEARNING SYSTEM

The learning system of PK Khmer Type is officially **COMPLETE** when all of the following conditions are met:

1. **Curriculum Coverage & Quality:**
   - 100% of required printable glyphs across English, Khmer NiDA, and Khmer Standard are taught.
   - Zero non-orientation lessons have fewer than 80 keystroke units.
   - Zero pre-introduction violations exist across all 218 lessons.
   - Checkpoint lessons enforce $\ge 90\%$ accuracy before advancing.
2. **Khmer Orthography Parity:**
   - Khmer NiDA correctly teaches Coeng at `Shift+J`, compound vowels as single keys, and `Shift+Space` word separation.
   - Khmer Standard correctly teaches Coeng on the base Spacebar layer, `ះ` on Semicolon, and unique Standard vowel/shift mappings.
   - Logical typing order (Consonant $\rightarrow$ Coeng $\rightarrow$ Subscript $\rightarrow$ Vowel) is enforced with helpful visual hints.
3. **Practice & Review Ecosystem:**
   - Temple Trial draws dynamically from a 500+ word bank filtered by learner unlocks.
   - Typing Race offers authentic Khmer and English texts across Easy, Medium, Hard, and Expert difficulties.
   - Targeted review automatically surfaces weak characters and confusion pairs.
4. **Adaptive Practice:**
   - English, Khmer NiDA, and Khmer Standard each have fully functioning adaptive trainers.
   - Adaptive engine operates with zero locked-letter leakage and Keybr-style visual mastery progress.
5. **Persistence & Data Integrity:**
   - All progress, stars, best scores, and streaks persist reliably across reloads and offline sessions.
   - Zero state collision between curriculum lessons and Adaptive Practice.
6. **Sensory & Accessibility Polish:**
   - Fluent, natural dual-language translation (English and Khmer) for all user-facing text.
   - Keyboard-only navigation support and accessible ARIA live-feedback.
   - High-performance, offline zero-latency operation without CORS blocks.
7. **Verification & Regression Proof:**
   - Automated test suite passes 100% across all 218 lessons.
   - Cross-browser headless validation passes with zero errors.

---

## 8. UNKNOWNS & OPEN QUESTIONS

The following architectural and design decisions require human preference or empirical validation prior to Phase 11/12 implementation:

1. **Typing Race Community Leaderboard:**
   - *Current State:* Race leaderboard is stored locally in `localStorage`.
   - *Question:* Should an optional, privacy-friendly online leaderboard (e.g. Firebase Firestore as referenced in `index.html` comments) be officially integrated, or should the app remain strictly 100% local-storage only?
   - *Recommendation:* Keep 100% local storage as the default offline mode; keep Firebase configuration purely optional for zero privacy friction.
2. **Audio Sample Packaging vs Web Audio Synth:**
   - *Current State:* Key click audio is generated procedurally via the Web Audio API (`AudioContext`).
   - *Question:* Should custom sound profiles (Thock, Typewriter) use synthesized audio nodes (100% zero-byte download) or tiny base64 audio sprites?
   - *Recommendation:* Synthesize via Web Audio API to maintain a lightweight, zero-dependency codebase without external asset loading.
3. **Khmer Syllable Structure Complexity Threshold in Adaptive Mode:**
   - *Current State:* Khmer words have complex grapheme clusters.
   - *Question:* In early adaptive stages (e.g. 5 consonants unlocked), should the generator produce isolated single syllables or only authentic dictionary words?
   - *Recommendation:* Use authentic syllables from `data/adaptive-vocab.js` to ensure the learner only types phonotactically natural Khmer combinations.

---
*End of Master Roadmap. This document is the primary reference for all subsequent development phases.*
