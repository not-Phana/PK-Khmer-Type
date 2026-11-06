/* ============================================================
   PK Khmer Type — Settings & Studio Command Center
   Themes, Mechanical Audio Profiles, 3D Hands, Cursor HUD,
   Practice Rules, Accessibility, Presets & Self-Healing
   ============================================================ */

const LS = Object.assign(window.LS || {}, {
  theme: "khmerSettingTheme",
  performanceMode: "khmerSettingPerformanceMode",
  animationMode: "khmerSettingAnimationMode",
  reducedMotion: "khmerSettingReducedMotion",
  largeText: "khmerSettingLargeText",
  sound: "khmerSettingSound",
  hands: "khmerSettingHands",
  handsOpacity: "khmerSettingHandsOpacity",
  handColorPreset: "khmerSettingHandColorPreset",
  handColorCustomL: "khmerSettingHandColorCustomL",
  handColorCustomR: "khmerSettingHandColorCustomR",
  accent: "khmerSettingAccent",
  khmerFont: "khmerSettingKhmerFont",
  shiftPreview: "khmerSettingShiftPreview",
  keyHighlight: "khmerSettingKeyHighlight",
  highContrast: "khmerSettingHighContrast",
  compactKeys: "khmerSettingCompactKeys",
  keyFx: "khmerSettingKeyFx",
  motes: "khmerSettingMotes",
  torches: "khmerSettingTorches",
  scanlines: "khmerSettingScanlines",
  focusMode: "khmerSettingFocusMode",
  sideDocks: "khmerSettingSideDocks",
  dyslexiaSpacing: "khmerSettingDyslexiaSpacing",
  switchProfile: "khmerSettingSwitchProfile",
  soundVolume: "khmerSettingSoundVolume",
  chime: "khmerSettingChime",
  ambienceVolume: "khmerSettingAmbienceVolume",
  reticle: "khmerSettingReticle",
  shockwave: "khmerSettingShockwave",
  layerHover: "khmerSettingLayerHover",
  strictMode: "khmerSettingStrictMode",
  autoAdvance: "khmerSettingAutoAdvance",
  liveStatsHud: "khmerSettingLiveStatsHud",
  targetWpm: "khmerSettingTargetWpm",
  wallpaperBlur: "khmerCustomWallpaperBlur",
  borderRadius: "khmerSettingBorderRadius",
  totals: "khmerGlobalStats"
});
window.LS = LS;

function safeGet(k, fallback) {
  try {
    const v = localStorage.getItem(k);
    return v === null ? fallback : v;
  } catch (e) {
    return fallback;
  }
}
function safeSet(k, v) {
  try {
    localStorage.setItem(k, v);
    if (typeof window !== "undefined" && window.PKCloudSync && !window.__isApplyingCloudSettings) {
      if (typeof window.PKCloudSync.recordLocalSettingTimestamp === "function") {
        window.PKCloudSync.recordLocalSettingTimestamp(k);
      }
      if (typeof window.PKCloudSync.queueSettingsSync === "function") {
        window.PKCloudSync.queueSettingsSync();
      }
    }
  } catch (e) {}
}

/* ---------- 0. Fortress Self-Healing (CSS + Right Hand + Modal DOM) ---------- */
function ensureSettingsStylesheet() {
  if (!document.querySelector('link[href*="css/settings.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/settings.css?v=46";
    document.head.appendChild(link);
  }
}

function healBothHandsOverlay() {
  try {
    if (typeof FINGERS !== "undefined" && Array.isArray(FINGERS)) {
      const rpDef = { id: "rp", hand: "R", home: "semicolon", kind: "pinky", baseW: 12.5, tipW: 7.5, kDist: 68, restLen: 52, restAng: 0.10 };
      const existingIdx = FINGERS.findIndex((f) => f && f.id === "rp");
      if (existingIdx === -1) {
        FINGERS.push(rpDef);
      } else if (!FINGERS[existingIdx].kind) {
        FINGERS[existingIdx] = rpDef;
      }
      if (typeof fingerEls !== "undefined" && !fingerEls["rp"] && typeof createFingerElement === "function") {
        createFingerElement(rpDef);
      }
      if (typeof updateHandsOverlay === "function") {
        updateHandsOverlay();
      }
    }
    if (typeof render === "function") {
      render();
    }
  } catch (e) {}
}

function ensureUpgradedSettingsModalDOM() {
  const modal = document.getElementById("settingsModal");
  if (!modal || document.getElementById("settingsCategoryTabs")) return;

  // Preserve existing DOM buttons that storage.js already attached listeners to
  const existingExportBtn = document.getElementById("exportProgressBtn");
  const existingImportBtn = document.getElementById("importProgressBtn");
  const existingImportInput = document.getElementById("importProgressInput");
  const existingResetBtn = document.getElementById("resetProgressBtn");

  modal.innerHTML = `
  <div class="modal-card settings-modal-card">
    <div class="settings-header-wrap">
      <div class="settings-header-top">
        <div class="settings-title-group">
          <div class="settings-icon-badge" aria-hidden="true">
            <svg class="pk-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </div>
          <h2 id="settingsModalTitle"><span class="i18n-t" data-en="Settings &amp; Studio" data-km="ការកំណត់ និងស្ទូឌីយោ">Settings &amp; Studio</span> <span class="km-sub">ការកំណត់</span></h2>
          <span class="settings-count-pill" id="settingsActiveCatCount">33 Controls</span>
          <button type="button" class="settings-version-pill" id="settingsVersionPill" title="PK Khmer Type v2.4 Beta Studio · Click to view Release Info" aria-label="Version 2.4 Beta Release Info">
            <span class="ver-live-dot" aria-hidden="true"></span>
            <span>v2.4 Beta Studio</span>
          </button>
        </div>
        <button class="modal-close" id="settingsCloseBtn" aria-label="Close settings">${typeof pkIcon === 'function' ? pkIcon('close', 16) : '<svg class="pk-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'}</button>
      </div>
      <div class="settings-tools-row">
        <div class="settings-search-box">
          <svg class="pk-icon settings-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="settingsSearchInput" class="settings-search-input" placeholder="Search settings (e.g. sound, hands, theme, font, cursor, lessons)..." autocomplete="off" spellcheck="false">
          <button type="button" id="settingsSearchClear" class="settings-search-clear" aria-label="Clear search" hidden>${typeof pkIcon === 'function' ? pkIcon('close', 13) : '<svg class="pk-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'}</button>
        </div>
        <div class="settings-presets-bar">
          <span class="preset-chip-label">Presets:</span>
          <button type="button" class="settings-preset-btn" data-preset="default">Default</button>
          <button type="button" class="settings-preset-btn" data-preset="pro">Pro Typist</button>
          <button type="button" class="settings-preset-btn" data-preset="immersion">Full Immersion</button>
          <button type="button" class="settings-preset-btn" data-preset="performance">Battery Saver</button>
        </div>
      </div>
    </div>
    <div class="settings-tabs-wrap">
      <button type="button" class="settings-tabs-arrow left" id="settingsTabsScrollLeft" aria-label="Scroll categories left" title="Scroll categories left">
        <svg class="pk-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="settings-tabs-scroll" id="settingsCategoryTabs" role="tablist">
        <button type="button" class="settings-cat-tab active" data-cat="all" role="tab" aria-selected="true">All Settings</button>
        <button type="button" class="settings-cat-tab" data-cat="general" role="tab" aria-selected="false">General &amp; Layout</button>
        <button type="button" class="settings-cat-tab" data-cat="keyboard" role="tab" aria-selected="false">Hands &amp; Cursor</button>
        <button type="button" class="settings-cat-tab" data-cat="audio" role="tab" aria-selected="false">Sound &amp; Audio</button>
        <button type="button" class="settings-cat-tab" data-cat="typing" role="tab" aria-selected="false">Typing &amp; Lessons</button>
        <button type="button" class="settings-cat-tab" data-cat="appearance" role="tab" aria-selected="false">Appearance &amp; Themes</button>
        <button type="button" class="settings-cat-tab" data-cat="immersion" role="tab" aria-selected="false">Immersion &amp; FX</button>
        <button type="button" class="settings-cat-tab" data-cat="a11y" role="tab" aria-selected="false">Accessibility</button>
        <button type="button" class="settings-cat-tab" data-cat="data" role="tab" aria-selected="false">Data &amp; Backup</button>
      </div>
      <button type="button" class="settings-tabs-arrow right" id="settingsTabsScrollRight" aria-label="Scroll categories right" title="Scroll right">
        <svg class="pk-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
    <div class="settings-body-scroll" id="settingsBodyScroll">
      <div class="settings-section" data-cat-section="general">
        <div class="settings-section-header"><h3 class="settings-section-title">General, Layout &amp; Language</h3><span class="settings-section-count">3 settings</span></div>
        <div class="settings-row" data-search="keyboard layout khmer standard nida english qwerty unicode">
          <div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Active Keyboard Layout</span><span class="settings-row-km">ប្លង់ក្តារចុច</span></div><div class="settings-row-desc">Switch the active keyboard mapping and lesson curriculum immediately.</div></div>
          <div class="settings-row-control"><div class="settings-choice" id="settingsLayoutChoice"><button type="button" data-layout-set="standard" class="active">Khmer Standard</button><button type="button" data-layout-set="nida">Khmer NiDA</button><button type="button" data-layout-set="english">English (US)</button></div></div>
        </div>
        <div class="settings-row" data-search="language translate khmer english ui interface ភាសាខ្មែរ">
          <div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Interface Language</span><span class="settings-row-km">ភាសា</span></div><div class="settings-row-desc">Translate menus, buttons, and lesson guides between English and Khmer (Alt+L).</div></div>
          <div class="settings-row-control"><div class="settings-choice" id="settingsLangChoice"><button type="button" data-lang-set="en" class="active">English</button><button type="button" data-lang-set="km">ភាសាខ្មែរ (Khmer)</button></div></div>
        </div>
        <div class="settings-row" data-search="quick links documents 3d mechanical studio shortcuts statistics tutorial onboarding guide">
          <div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Studio &amp; Reference Tools</span><span class="settings-row-km">ឧបករណ៍ជំនួយ</span></div><div class="settings-row-desc">Jump directly to documentation, 3D mechanical viewer, shortcuts, statistics, or restart the tutorial.</div></div>
          <div class="settings-row-control"><div class="settings-quick-links"><button type="button" class="settings-action-pill" id="settingsRestartTutorialBtn">Onboarding Tutorial</button><button type="button" class="settings-action-pill" id="settingsOpenShortcutsBtn">Shortcuts</button><button type="button" class="settings-action-pill" id="settingsOpenStatsBtn">Statistics</button><a href="Documents/index.html" class="settings-action-pill">PK Documents</a><a href="Documents/index.html#keycap-3d" class="settings-action-pill">3D Studio</a></div></div>
        </div>
      </div>

      <div class="settings-section" data-cat-section="keyboard">
        <div class="settings-section-header"><h3 class="settings-section-title">3D Hands, Keyboard &amp; Smart Cursor</h3><span class="settings-section-count">12 settings</span></div>
        <div class="settings-row" data-search="smooth interactive you cursor pointer mouse custom arrow badge glow lessons"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Smooth Interactive Cursor</span><span class="settings-row-km">កណ្ដុរឆ្លាតវៃ "YOU"</span></div><div class="settings-row-desc">Glowing pointer with silky spring physics and smart contextual badge (shows "LESSONS" on lessons, etc.).</div></div><div class="settings-row-control"><div class="toggle-switch on" id="settingsSmoothCursorToggle" role="switch" aria-checked="true" tabindex="0"></div></div></div>
        <div class="settings-row settings-row-stacked" data-search="cursor color theme match gold cyan jade ruby sapphire amethyst pointer badge"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Cursor Theme &amp; Accent Color</span><span class="settings-row-km">ពណ៌កណ្ដុរតាម Theme</span></div><div class="settings-row-desc">Match the cursor arrow, pill badge, and glow with your active theme and accent, or lock to a chosen color.</div></div><div class="settings-row-control"><div class="settings-choice" id="cursorColorChoice"><button type="button" data-cursor-color="theme" class="active"><span style="display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px;background:var(--gold,#ff9d2e)"></span> Match Theme</button><button type="button" data-cursor-color="gold"><span style="display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px;background:#ff9d2e"></span> Gold</button><button type="button" data-cursor-color="cyan"><span style="display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px;background:#38bdf8"></span> Cyan</button><button type="button" data-cursor-color="jade"><span style="display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px;background:#3f9d6b"></span> Jade</button><button type="button" data-cursor-color="ruby"><span style="display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px;background:#e11d48"></span> Ruby</button><button type="button" data-cursor-color="sapphire"><span style="display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px;background:#14b8a6"></span> Sapphire</button><button type="button" data-cursor-color="amethyst"><span style="display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px;background:#9333ea"></span> Amethyst</button></div></div></div>
        <div class="settings-row" data-search="finger guide 3d hands kinematic left right hand"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">3D Kinematic Finger Guide</span><span class="settings-row-km">មគ្គុទ្ទេសក៍ដៃ</span></div><div class="settings-row-desc">Display translucent left and right hands that reach to each target key.</div></div><div class="settings-row-control"><div class="toggle-switch on" id="settingsHandsToggle" role="switch" aria-checked="true" tabindex="0"></div></div></div>
        <div class="settings-row" data-search="hand opacity transparency alpha see through"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">3D Hand Opacity</span><span class="settings-row-km">កម្រិតថ្លានៃដៃ</span></div><div class="settings-row-desc">Control how solid or see-through the 3D hands appear over the keycaps.</div></div><div class="settings-row-control"><div class="settings-slider-wrap"><input type="range" id="handsOpacitySlider" min="15" max="100" value="44"><span class="settings-slider-badge" id="handsOpacityValue">44%</span></div></div></div>
        <div class="settings-row settings-row-stacked" data-search="hand color hand colors finger colors left hand right hand palette cyber cyan orchid emerald amber ruby sapphire sunset monochrome ghost theme match custom"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">3D Hand Color Scheme</span><span class="settings-row-km">ពណ៌នៃដៃ 3D</span></div><div class="settings-row-desc">Customize the left and right hand colors across curated palettes, match the active keyboard theme, or pick individual colors.</div></div><div class="settings-row-control"><div class="settings-choice settings-choice-hand-colors" id="handColorChoice"><button type="button" data-hand-color="cyber" class="active"><span class="hand-color-swatch-duo"><span style="background:#38bdf8"></span><span style="background:#f472b6"></span></span> Cyber Cyan &amp; Orchid</button><button type="button" data-hand-color="emerald"><span class="hand-color-swatch-duo"><span style="background:#fbbf24"></span><span style="background:#34d399"></span></span> Amber &amp; Emerald</button><button type="button" data-hand-color="ruby"><span class="hand-color-swatch-duo"><span style="background:#fb7185"></span><span style="background:#60a5fa"></span></span> Ruby &amp; Sapphire</button><button type="button" data-hand-color="sunset"><span class="hand-color-swatch-duo"><span style="background:#fb923c"></span><span style="background:#a78bfa"></span></span> Sunset &amp; Violet</button><button type="button" data-hand-color="ghost"><span class="hand-color-swatch-duo"><span style="background:#94a3b8"></span><span style="background:#e2e8f0"></span></span> Frost Silver</button><button type="button" data-hand-color="match"><span class="hand-color-swatch-duo"><span class="swatch-match-l"></span><span class="swatch-match-r"></span></span> Match Theme</button><button type="button" data-hand-color="custom"><span class="hand-color-swatch-duo"><span class="swatch-custom-l" id="handCustomSwatchL" style="background:#38bdf8"></span><span class="swatch-custom-r" id="handCustomSwatchR" style="background:#f472b6"></span></span> Custom Dual Colors</button></div><div class="hand-custom-color-pickers" id="handCustomPickers" hidden><div class="hand-color-picker-item"><label for="handColorPickerL"><span class="hand-picker-dot" id="handPickerDotL" style="background:#38bdf8"></span> Left Hand</label><div class="color-input-wrap"><input type="color" id="handColorPickerL" value="#38bdf8"><span class="color-hex-val" id="handColorHexL">#38bdf8</span></div></div><div class="hand-color-picker-item"><label for="handColorPickerR"><span class="hand-picker-dot" id="handPickerDotR" style="background:#f472b6"></span> Right Hand</label><div class="color-input-wrap"><input type="color" id="handColorPickerR" value="#f472b6"><span class="color-hex-val" id="handColorHexR">#f472b6</span></div></div></div></div></div>
        <div class="settings-row" data-search="mouse cursor inspector hud tooltip character hover pronunciation"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Smart Mouse Cursor Inspector</span><span class="settings-row-km">ឧបករណ៍ពិនិត្យម៉ៅ</span></div><div class="settings-row-desc">Show character details, keystroke recipes, and sound when hovering keys or text (Alt+M).</div></div><div class="settings-row-control"><div class="toggle-switch on" id="settingsMouseInspectorToggle" role="switch" aria-checked="true" tabindex="0"></div></div></div>
        <div class="settings-row" data-search="click shockwave ripple ring mouse"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Mouse Click Shockwaves</span><span class="settings-row-km">រលកពេលចុចម៉ៅ</span></div><div class="settings-row-desc">Emit expanding ripple shockwaves on mouse clicks.</div></div><div class="settings-row-control"><div class="toggle-switch on" id="settingsShockwaveToggle" role="switch" aria-checked="true" tabindex="0"></div></div></div>
        <div class="settings-row" data-search="hover layer preview shift ctrl altgr pointer"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Hover Layer Auto-Preview</span><span class="settings-row-km">មើលស្រទាប់ពេលដាក់ម៉ៅ</span></div><div class="settings-row-desc">Rest your pointer on Shift, Ctrl, or AltGr to preview that layer on the board.</div></div><div class="settings-row-control"><div class="toggle-switch on" id="settingsLayerHoverToggle" role="switch" aria-checked="true" tabindex="0"></div></div></div>
        <div class="settings-row" data-search="shift key preview corner badge symbol"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Shift-key Corner Previews</span><span class="settings-row-km">សញ្ញា Shift លើគ្រាប់ចុច</span></div><div class="settings-row-desc">Display secondary shifted characters in the top-right corner of every keycap.</div></div><div class="settings-row-control"><div class="toggle-switch on" id="shiftPreviewToggle" role="switch" aria-checked="true" tabindex="0"></div></div></div>
        <div class="settings-row" data-search="highlight next key target glow pulse lesson"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Highlight Next Target Key</span><span class="settings-row-km">បន្លិចគ្រាប់ចុច</span></div><div class="settings-row-desc">Glow and pulse the required target key and modifier during practice drills.</div></div><div class="settings-row-control"><div class="toggle-switch on" id="keyHighlightToggle" role="switch" aria-checked="true" tabindex="0"></div></div></div>
        <div class="settings-row" data-search="key press effects ripple spark burst animation"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Key Press Spark Effects</span><span class="settings-row-km">បែបផែនចុច</span></div><div class="settings-row-desc">Trigger impact ripples and spark bursts on every keystroke.</div></div><div class="settings-row-control"><div class="toggle-switch on" id="keyFxToggle" role="switch" aria-checked="true" tabindex="0"></div></div></div>
        <div class="settings-row" data-search="compact keyboard small tight size"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Compact Keyboard Proportions</span><span class="settings-row-km">ក្តារចុចតូច</span></div><div class="settings-row-desc">Reduce keycap padding and gap for a tighter mechanical footprint.</div></div><div class="settings-row-control"><div class="toggle-switch" id="compactKeysToggle" role="switch" aria-checked="false" tabindex="0"></div></div></div>
      </div>

      <div class="settings-section" data-cat-section="audio">
        <div class="settings-section-header"><h3 class="settings-section-title">Sound &amp; Mechanical Audio Engine</h3><span class="settings-section-count">6 settings</span></div>
        <div class="settings-row" data-search="sound effects audio click keystroke mute"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Mechanical Key Sound</span><span class="settings-row-km">សំឡេងគ្រាប់ចុច</span></div><div class="settings-row-desc">Synthesize real-time mechanical switch acoustics when typing.</div></div><div class="settings-row-control"><div class="toggle-switch on" id="settingsSoundToggle" role="switch" aria-checked="true" tabindex="0"></div></div></div>
        <div class="settings-row settings-row-stacked settings-row-switches" data-search="switch profile sound tactile brown clicky blue red thock typewriter silent"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Mechanical Switch Profile</span><span class="settings-row-km">ប្រភេទសំឡេងស្វ៊ីច</span></div><div class="settings-row-desc">Select your switch acoustic signature (click any switch to audition its sound).</div></div><div class="settings-row-control"><div class="settings-choice" id="switchProfileChoice"><button type="button" data-switch="brown" class="active">Tactile Brown</button><button type="button" data-switch="blue">Clicky Blue</button><button type="button" data-switch="red">Thocky Red</button><button type="button" data-switch="typewriter">Typewriter</button><button type="button" data-switch="silent">Silent Soft</button></div></div></div>
        <div class="settings-row" data-search="sound volume loudness key click level"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Key Sound Volume</span><span class="settings-row-km">កម្រិតសំឡេងគ្រាប់ចុច</span></div><div class="settings-row-desc">Adjust master volume for mechanical switch clicks and chimes.</div></div><div class="settings-row-control"><div class="settings-slider-wrap"><input type="range" id="soundVolumeSlider" min="10" max="100" value="80"><span class="settings-slider-badge" id="soundVolumeValue">80%</span></div></div></div>
        <div class="settings-row" data-search="completion chime bell milestone lesson pass sound"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Completion &amp; Milestone Chimes</span><span class="settings-row-km">សំឡេងជោគជ័យ</span></div><div class="settings-row-desc">Play harmonic celebration chimes when completing a drill or mastering a lesson.</div></div><div class="settings-row-control"><div class="toggle-switch on" id="settingsChimeToggle" role="switch" aria-checked="true" tabindex="0"></div></div></div>
        <div class="settings-row" data-search="temple ambience drone background music relax meditation"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Temple Ambience Drone</span><span class="settings-row-km">សំឡេងបរិយាកាសប្រាសាទ</span></div><div class="settings-row-desc">Play a warm, meditative harmonic temple drone in the background.</div></div><div class="settings-row-control"><div class="toggle-switch" id="settingsAmbienceToggle" role="switch" aria-checked="false" tabindex="0"></div></div></div>
        <div class="settings-row" data-search="ambience volume drone loudness level"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Ambience Volume</span><span class="settings-row-km">កម្រិតសំឡេងបរិយាកាស</span></div><div class="settings-row-desc">Adjust the background temple ambience drone level.</div></div><div class="settings-row-control"><div class="settings-slider-wrap"><input type="range" id="ambienceVolumeSlider" min="10" max="100" value="50"><span class="settings-slider-badge" id="ambienceVolumeValue">50%</span></div></div></div>
      </div>

      <div class="settings-section" data-cat-section="typing">
        <div class="settings-section-header"><h3 class="settings-section-title">Typing, Lessons &amp; Practice</h3><span class="settings-section-count">6 settings</span></div>
        <div class="settings-row" data-search="unlock all lessons sandbox free practice 276 levels"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Unlock All Lessons (Sandbox Mode)</span><span class="settings-row-km">បើកមេរៀនទាំងអស់</span></div><div class="settings-row-desc">Unlock all 276 lessons across every curriculum (222 base + 54 bonus vault) so you can jump freely.</div></div><div class="settings-row-control"><div class="toggle-switch" id="unlockAllLessonsToggle" role="switch" aria-checked="false" tabindex="0"></div></div></div>
        <div class="settings-row" data-search="preview grandmaster vault bonus lessons 222 unlock"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Preview Grandmaster Vault (Unlock 222 Base Requirement)</span><span class="settings-row-km">ដោះសោឃ្លាំងមេរៀនពិសេស</span></div><div class="settings-row-desc">Instantly unlock the 222 base lesson prerequisite to test and practice all 54 Grandmaster Bonus drills.</div></div><div class="settings-row-control"><div class="toggle-switch" id="previewBonusVaultToggle" role="switch" aria-checked="false" tabindex="0"></div></div></div>
        <div class="settings-row" data-search="strict mistake mode stop on error accuracy"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Strict Mistake Mode (Stop on Error)</span><span class="settings-row-km">តម្រូវឱ្យវាយត្រូវមុនទៅមុខ</span></div><div class="settings-row-desc">Require typing the exact target character before the prompt cursor advances.</div></div><div class="settings-row-control"><div class="toggle-switch on" id="strictModeToggle" role="switch" aria-checked="true" tabindex="0"></div></div></div>
        <div class="settings-row" data-search="auto advance next exercise drill lesson"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Auto-Advance Next Exercise</span><span class="settings-row-km">បន្តលំហាត់បន្ទាប់ស្វ័យប្រវត្តិ</span></div><div class="settings-row-desc">Automatically advance to the next drill step upon finishing an exercise.</div></div><div class="settings-row-control"><div class="toggle-switch on" id="autoAdvanceToggle" role="switch" aria-checked="true" tabindex="0"></div></div></div>
        <div class="settings-row" data-search="live speed wpm accuracy counter hud stats"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Show Live Speed &amp; Accuracy Counters</span><span class="settings-row-km">បង្ហាញល្បឿន និងភាពត្រឹមត្រូវផ្ទាល់</span></div><div class="settings-row-desc">Display real-time WPM and accuracy telemetry while practicing.</div></div><div class="settings-row-control"><div class="toggle-switch on" id="liveStatsHudToggle" role="switch" aria-checked="true" tabindex="0"></div></div></div>
        <div class="settings-row" data-search="target wpm goal speed benchmark"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Personal Target WPM Goal</span><span class="settings-row-km">គោលដៅល្បឿន WPM</span></div><div class="settings-row-desc">Set your personal words-per-minute speed goal for practice sessions.</div></div><div class="settings-row-control"><div class="settings-slider-wrap"><input type="range" id="targetWpmSlider" min="15" max="120" step="5" value="40"><span class="settings-slider-badge" id="targetWpmValue">40 WPM</span></div></div></div>
      </div>

      <div class="settings-section" data-cat-section="appearance">
        <div class="settings-section-header"><h3 class="settings-section-title">Appearance, Themes &amp; Wallpaper</h3><span class="settings-section-count">8 settings</span></div>
        <div class="settings-row settings-row-stacked settings-row-theme" data-search="theme glass transparent dark temple moonlight jungle sunset sepia light system color"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Studio Color Theme</span><span class="settings-row-km">ស្បែកកម្មវិធី</span></div><div class="settings-row-desc">Select the overall atmosphere and lighting palette.</div></div><div class="settings-row-control"><div class="settings-choice" id="themeChoice"><button type="button" data-theme="glass"><span class="theme-dot glass"></span>Transparent Glass</button><button type="button" data-theme="dark" class="active"><span class="theme-dot dark"></span>Dark</button><button type="button" data-theme="temple"><span class="theme-dot temple"></span>Temple</button><button type="button" data-theme="moonlight"><span class="theme-dot moonlight"></span>Moonlight</button><button type="button" data-theme="jungle"><span class="theme-dot jungle"></span>Jungle</button><button type="button" data-theme="sunset"><span class="theme-dot sunset"></span>Sunset</button><button type="button" data-theme="sepia"><span class="theme-dot sepia"></span>Sepia</button><button type="button" data-theme="light"><span class="theme-dot light"></span>Light</button><button type="button" data-theme="system"><span class="theme-dot system"></span>System</button></div></div></div>
        <div class="settings-row" data-search="accent color gold jade sapphire ruby cyan amethyst"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Primary Accent Color</span><span class="settings-row-km">ពណ៌លេចធ្លោ</span></div><div class="settings-row-desc">Choose the highlight glow color for active keys, badges, and buttons.</div></div><div class="settings-row-control"><div class="settings-choice accent-choice" id="accentChoice"><button type="button" data-accent="gold" class="active" style="--sw:#ffd166" aria-label="Gold accent"></button><button type="button" data-accent="jade" style="--sw:#5fd694" aria-label="Jade accent"></button><button type="button" data-accent="sapphire" style="--sw:#2dd4a7" aria-label="Sapphire accent"></button><button type="button" data-accent="ruby" style="--sw:#ff5a70" aria-label="Ruby accent"></button><button type="button" data-accent="cyan" style="--sw:#38bdf8" aria-label="Cyber Cyan accent"></button><button type="button" data-accent="amethyst" style="--sw:#c084fc" aria-label="Amethyst accent"></button></div></div></div>
        <div class="settings-row" data-search="khmer font family kantumruy noto sans serif typography"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Khmer Script Font Family</span><span class="settings-row-km">ពុម្ពអក្សរខ្មែរ</span></div><div class="settings-row-desc">Choose the Khmer typeface for keycaps, HUD cards, and typing prompts.</div></div><div class="settings-row-control"><div class="settings-choice" id="khmerFontChoice"><button type="button" data-kfont="kantumruy" class="active">Kantumruy Pro</button><button type="button" data-kfont="noto-sans">Noto Sans Khmer</button><button type="button" data-kfont="noto-serif">Noto Serif Khmer</button></div></div></div>
        <div class="settings-row" data-search="larger text font size big scale zoom"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Larger Text &amp; Key Glyphs</span><span class="settings-row-km">អក្សរធំ</span></div><div class="settings-row-desc">Increase font size across keycaps, reading prompts, and menus.</div></div><div class="settings-row-control"><div class="toggle-switch" id="largeTextToggle" role="switch" aria-checked="false" tabindex="0"></div></div></div>
        <div class="settings-row wallpaper-settings-row" data-search="custom wallpaper background image photo url upload"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Custom Background Wallpaper</span><span class="settings-row-km">រូបភាពផ្ទៃក្រោយ</span></div><div class="settings-row-desc">Upload local artwork or add a custom image URL with live HUD preview &amp; curated studio themes.</div><div class="active-wallpaper-chip" id="activeWallpaperChip" style="display:none;"><div class="active-wallpaper-thumb" id="activeWallpaperThumb"></div><div class="active-wallpaper-meta"><span class="active-wallpaper-status"><span class="active-wallpaper-dot"></span> Active Wallpaper</span><span class="active-wallpaper-label" id="activeWallpaperLabel">Custom Backdrop</span></div></div></div><div class="settings-row-control"><div class="wallpaper-actions"><input type="file" id="wallpaperFileInput" accept="image/*" style="display:none;"><button type="button" class="wallpaper-btn" id="uploadWallpaperBtn" title="Choose local image file">Upload Image</button><button type="button" class="wallpaper-btn wallpaper-btn-highlight" id="urlWallpaperBtn" title="Open Custom Wallpaper Studio &amp; URL Gallery"><svg class="pk-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> Add via URL / Gallery</button><button type="button" class="wallpaper-btn danger" id="removeWallpaperBtn" style="display:none;" title="Remove custom wallpaper">Remove</button></div></div></div>
        <div class="settings-row wallpaper-dim-row" id="wallpaperDimControl" style="display:none;" data-search="wallpaper dimming brightness dark"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Wallpaper Dimming</span></div><div class="settings-row-desc">Darken the custom wallpaper so the keyboard stays crisp.</div></div><div class="settings-row-control"><div class="settings-slider-wrap"><input type="range" id="wallpaperDimSlider" min="15" max="90" value="65"><span class="settings-slider-badge" id="wallpaperDimValue">65%</span></div></div></div>
        <div class="settings-row" data-search="wallpaper blur glass backdrop"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Backdrop Glass Blur</span><span class="settings-row-km">កម្រិតព្រាលផ្ទៃក្រោយ</span></div><div class="settings-row-desc">Apply soft optical depth-of-field blur to custom wallpapers.</div></div><div class="settings-row-control"><div class="settings-slider-wrap"><input type="range" id="wallpaperBlurSlider" min="0" max="24" value="0"><span class="settings-slider-badge" id="wallpaperBlurValue">0px</span></div></div></div>
        <div class="settings-row" data-search="border radius corner curve rounded sharp rounded corners curvature 0px 6px 9px 14px 20px"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Interface Corner Radius</span><span class="settings-row-km">កម្រិតកោងជ្រុង</span></div><div class="settings-row-desc">Customize the border radius across all cards, sidebars, search bars, and buttons.</div></div><div class="settings-row-control"><div class="settings-slider-wrap"><input type="range" id="borderRadiusSlider" min="0" max="32" value="9" step="1" aria-label="Interface Corner Radius"><span class="settings-slider-badge" id="borderRadiusValue">9px</span></div><div class="settings-choice radius-choice" id="radiusPresetChoice" style="margin-top:8px;"><button type="button" data-radius="0" title="Sharp 90-degree square corners">0px</button><button type="button" data-radius="6" title="Sleek IDE / Antigravity subtle curve">6px</button><button type="button" data-radius="9" class="active" title="Default modern rounded curve">9px</button><button type="button" data-radius="14" title="Smooth organic curve">14px</button><button type="button" data-radius="20" title="Pill capsule shape">20px</button></div><div class="radius-live-preview" id="radiusLivePreview" style="margin-top:10px; padding:8px 12px; background:rgba(255,209,102,0.06); border:1px solid rgba(255,209,102,0.3); display:flex; align-items:center; justify-content:space-between; gap:10px;"><span style="font-size:0.75rem; color:var(--ink-dim, #94a3b8); font-weight:600;">Live Preview</span><span class="radius-live-badge" style="font-size:0.76rem; font-weight:700; color:var(--gold-bright, #ffd166); padding:2px 8px; background:rgba(255,209,102,0.14); border:1px solid rgba(255,209,102,0.35); border-radius:inherit;" id="radiusLiveBadge">9px</span></div></div></div>
      </div>

      <div class="settings-section" data-cat-section="immersion">
        <div class="settings-section-header"><h3 class="settings-section-title">Immersion, Atmosphere &amp; Panels</h3><span class="settings-section-count">5 settings</span></div>
        <div class="settings-row" data-search="focus mode zen distraction free hide panels"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Focus Mode</span><span class="settings-row-km">របៀបផ្តោត</span></div><div class="settings-row-desc">Dim headers and sidebars so only the keyboard and typing prompt remain (Alt+F).</div></div><div class="settings-row-control"><div class="toggle-switch" id="focusModeToggle" role="switch" aria-checked="false" tabindex="0"></div></div></div>
        <div class="settings-row" data-search="side docks panels quick guide lessons sidebar"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Show Side Reference Docks</span><span class="settings-row-km">បង្ហាញផ្ទាំងសងខាង</span></div><div class="settings-row-desc">Display the Quick Guide (left) and Lessons Navigator (right) side panels.</div></div><div class="settings-row-control"><div class="toggle-switch on" id="sideDocksToggle" role="switch" aria-checked="true" tabindex="0"></div></div></div>
        <div class="settings-row" data-search="ember particles ambient motes floating dust"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Floating Ember Particles</span><span class="settings-row-km">ភាគល្អិតពន្លឺ</span></div><div class="settings-row-desc">Render drifting ambient light motes across the backdrop.</div></div><div class="settings-row-control"><div class="toggle-switch" id="motesToggle" role="switch" aria-checked="false" tabindex="0"></div></div></div>
        <div class="settings-row" data-search="torch flames fire temple light"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Temple Torch Flames</span><span class="settings-row-km">អណ្តាតភ្លើង</span></div><div class="settings-row-desc">Display warm flickering torchlight along the sides of the screen.</div></div><div class="settings-row-control"><div class="toggle-switch" id="torchesToggle" role="switch" aria-checked="false" tabindex="0"></div></div></div>
        <div class="settings-row" data-search="scanline overlay crt holographic retro"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Holographic Scanline Overlay</span><span class="settings-row-km">បន្ទាត់ស្កេន</span></div><div class="settings-row-desc">Add a subtle cybernetic CRT scanline texture across the viewport.</div></div><div class="settings-row-control"><div class="toggle-switch" id="scanlinesToggle" role="switch" aria-checked="false" tabindex="0"></div></div></div>
      </div>

      <div class="settings-section" data-cat-section="a11y">
        <div class="settings-section-header"><h3 class="settings-section-title">Performance &amp; Accessibility</h3><span class="settings-section-count">5 settings</span></div>
        <div class="settings-row" data-search="performance mode reduced motion speed fast zero lag lightweight disable animations effects"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Performance / Reduced Motion Mode</span><span class="settings-row-km">ដំណើរការខ្ពស់ / កាត់បន្ថយចលនា</span></div><div class="settings-row-desc">Prioritize maximum speed and responsiveness. Disables all non-essential animations, transitions, glowing effects, and background particles for instant responsiveness.</div></div><div class="settings-row-control"><div class="toggle-switch" id="performanceModeToggle" role="switch" aria-checked="false" tabindex="0"></div></div></div>
        <div class="settings-row" data-search="animation animations motion lag speed control effects fast performance zero lag"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Animation &amp; Motion Control</span><span class="settings-row-km">គ្រប់គ្រងចលនា</span></div><div class="settings-row-desc">Fine-tune motion density across Full, Minimal, or Off (Zero Lag).</div></div><div class="settings-row-control"><div class="settings-choice" id="animationModeChoice"><button type="button" data-anim-mode="full" class="active">Full</button><button type="button" data-anim-mode="minimal">Minimal</button><button type="button" data-anim-mode="off">Off (Zero Lag)</button></div></div></div>
        <div class="settings-row" data-search="reduced motion animations disable smooth" style="display:none;"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Reduced Motion</span><span class="settings-row-km">កាត់បន្ថយចលនា</span></div><div class="settings-row-desc">Minimize animations, floating effects, and camera transitions.</div></div><div class="settings-row-control"><div class="toggle-switch" id="reducedMotionToggle" role="switch" aria-checked="false" tabindex="0"></div></div></div>
        <div class="settings-row" data-search="high contrast borders visibility sharp"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">High Contrast Mode</span><span class="settings-row-km">កម្រិតពណ៌ខ្ពស់</span></div><div class="settings-row-desc">Strengthen keycap borders, text contrast, and button outlines.</div></div><div class="settings-row-control"><div class="toggle-switch" id="highContrastToggle" role="switch" aria-checked="false" tabindex="0"></div></div></div>
        <div class="settings-row" data-search="dyslexia wide letter spacing prompt readability"><div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Wide Prompt Character Spacing</span><span class="settings-row-km">គម្លាតអក្សរទូលាយ</span></div><div class="settings-row-desc">Add generous horizontal spacing between characters in lesson prompts for easier reading.</div></div><div class="settings-row-control"><div class="toggle-switch" id="dyslexiaSpacingToggle" role="switch" aria-checked="false" tabindex="0"></div></div></div>
      </div>

      <div class="settings-section" data-cat-section="data">
        <div class="settings-section-header"><h3 class="settings-section-title">Progress Data, Backup &amp; Reset</h3><span class="settings-section-count">Storage &amp; Backup</span></div>
        <div class="settings-storage-card" data-search="storage progress stats keys typed lessons mastered">
          <div class="settings-storage-grid">
            <div class="settings-storage-stat"><span class="settings-stat-label">Total Keys Typed</span><span class="settings-stat-val" id="settingsStatKeys">0</span></div>
            <div class="settings-storage-stat"><span class="settings-stat-label">Lessons Mastered</span><span class="settings-stat-val" id="settingsStatMastered">0 / 77</span></div>
            <div class="settings-storage-stat"><span class="settings-stat-label">Best Speed</span><span class="settings-stat-val" id="settingsStatBestWpm">0 WPM</span></div>
            <div class="settings-storage-stat"><span class="settings-stat-label">Local Storage</span><span class="settings-stat-val" id="settingsStatStorage">0 KB</span></div>
          </div>
        </div>
        <div class="settings-row" data-search="export import backup json save restore file">
          <div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name">Backup &amp; Restore Progress (.json)</span><span class="settings-row-km">បម្រុងទុក និងទាញយកទិន្នន័យ</span></div><div class="settings-row-desc">Download a portable JSON backup of your progress and settings, or restore from a file.</div></div>
          <div class="settings-row-control" id="settingsBackupBtnSlot"></div>
        </div>
        <div class="settings-row" data-search="reset all progress delete clear lessons stats danger">
          <div class="settings-row-info"><div class="settings-row-title-line"><span class="settings-row-name" style="color:#f87171;">Reset All Typing Progress</span><span class="settings-row-km">លុបវឌ្ឍនភាពទាំងអស់</span></div><div class="settings-row-desc">Permanently erase all completed lessons, WPM records, and history.</div></div>
          <div class="settings-row-control" id="settingsResetBtnSlot"></div>
        </div>
      </div>

      <div class="settings-empty-search" id="settingsEmptySearch" hidden>
        No settings found matching "<strong id="settingsSearchTerm"></strong>". Try searching for <em>sound</em>, <em>hands</em>, <em>theme</em>, <em>cursor</em>, or <em>lessons</em>.
      </div>
    </div>
    <div class="settings-footer-wrap">
      <div class="settings-footer-left">All changes apply immediately and save automatically.</div>
      <div class="settings-footer-actions">
        <button type="button" class="settings-btn-ghost" id="resetPreferencesBtn">Reset Default Settings</button>
        <button type="button" class="settings-btn-primary" id="settingsDoneBtn">Done</button>
      </div>
    </div>
  </div>`;

  const backupSlot = document.getElementById("settingsBackupBtnSlot");
  if (backupSlot) {
    if (existingExportBtn) backupSlot.appendChild(existingExportBtn);
    if (existingImportBtn) backupSlot.appendChild(existingImportBtn);
    if (existingImportInput) backupSlot.appendChild(existingImportInput);
  }
  const resetSlot = document.getElementById("settingsResetBtnSlot");
  if (resetSlot && existingResetBtn) {
    existingResetBtn.style.width = "auto";
    existingResetBtn.style.margin = "0";
    existingResetBtn.style.padding = "8px 14px";
    resetSlot.appendChild(existingResetBtn);
  }
}

/* ---------- temple confirm dialog (replaces native confirm()) ---------- */
function templeConfirm(message, opts) {
  opts = opts || {};
  const backdrop = document.getElementById("templeConfirmModal");
  const titleEl = document.getElementById("templeConfirmTitle");
  const msgEl = document.getElementById("templeConfirmMsg");
  const iconEl = document.getElementById("templeConfirmIcon");
  const okBtn = document.getElementById("templeConfirmOkBtn");
  const cancelBtn = document.getElementById("templeConfirmCancelBtn");

  if (!backdrop || !okBtn || !cancelBtn) {
    return Promise.resolve(window.confirm(message));
  }

  titleEl.textContent = opts.title || "Are you sure?";
  msgEl.textContent = message;
  iconEl.innerHTML = opts.icon || (opts.danger ? pkIcon("alert", 24) : pkIcon("settings", 24));
  okBtn.textContent = opts.confirmLabel || (opts.danger ? "Yes, continue" : "Continue");
  cancelBtn.textContent = opts.cancelLabel || "Cancel";
  backdrop.classList.toggle("is-danger", !!opts.danger);

  return new Promise((resolve) => {
    let settled = false;
    function close(result) {
      if (settled) return;
      settled = true;
      okBtn.removeEventListener("click", onOk);
      cancelBtn.removeEventListener("click", onCancel);
      backdrop.removeEventListener("click", onBackdrop);
      document.removeEventListener("keydown", onKey);
      if (typeof window.closeModalAnimated === "function") {
        window.closeModalAnimated(backdrop, () => resolve(result));
      } else {
        backdrop.hidden = true;
        resolve(result);
      }
    }
    function onOk() { close(true); }
    function onCancel() { close(false); }
    function onBackdrop(e) { if (e.target === backdrop) close(false); }
    function onKey(e) {
      if (e.key === "Escape") close(false);
      if (e.key === "Enter") close(true);
    }
    okBtn.addEventListener("click", onOk);
    cancelBtn.addEventListener("click", onCancel);
    backdrop.addEventListener("click", onBackdrop);
    document.addEventListener("keydown", onKey);
    backdrop.hidden = false;
    requestAnimationFrame(() => cancelBtn.focus());
  });
}

/* ---------- Audio Engine: Multi-Switch Profiles, Volume, Chimes & Ambience ---------- */
let audioCtx = null;
let noiseBuffer = null;
let soundOn = safeGet(LS.sound, "1") !== "0";
let chimeOn = safeGet(LS.chime, "1") !== "0";
let switchProfile = safeGet(LS.switchProfile, "brown");
let soundVolumePct = parseInt(safeGet(LS.soundVolume, "80"), 10) || 80;
let ambienceVolumePct = parseInt(safeGet(LS.ambienceVolume, "50"), 10) || 50;
let ambienceOn = false;
let ambienceNodes = null;
const ambienceToggle = document.getElementById("ambienceToggle");

let audioMasterCompressor = null;
let audioMasterGain = null;

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (!noiseBuffer && audioCtx) {
    const len = Math.floor(audioCtx.sampleRate * 0.15);
    noiseBuffer = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      const pink = b0 + b1 + b2 + white * 0.5362;
      const decay = Math.pow(1 - (i / len), 1.4);
      data[i] = pink * 0.32 * decay;
    }
  }
  if (!audioMasterGain && audioCtx) {
    try {
      audioMasterGain = audioCtx.createGain();
      audioMasterGain.gain.setValueAtTime(1.45, audioCtx.currentTime);

      audioMasterCompressor = audioCtx.createDynamicsCompressor();
      audioMasterCompressor.threshold.setValueAtTime(-14, audioCtx.currentTime);
      audioMasterCompressor.knee.setValueAtTime(6, audioCtx.currentTime);
      audioMasterCompressor.ratio.setValueAtTime(3.5, audioCtx.currentTime);
      audioMasterCompressor.attack.setValueAtTime(0.001, audioCtx.currentTime);
      audioMasterCompressor.release.setValueAtTime(0.05, audioCtx.currentTime);

      audioMasterGain.connect(audioMasterCompressor);
      audioMasterCompressor.connect(audioCtx.destination);
    } catch (e) {
      audioMasterGain = null;
      audioMasterCompressor = null;
    }
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
}

function startAmbience() {
  try {
    ensureAudio();
    const t = audioCtx.currentTime;
    const master = audioCtx.createGain();
    const targetGain = 0.08 * (ambienceVolumePct / 100);
    master.gain.setValueAtTime(0, t);
    master.gain.linearRampToValueAtTime(targetGain, t + 1.0);
    master.connect(audioCtx.destination);

    const drone1 = audioCtx.createOscillator();
    drone1.type = "sine";
    drone1.frequency.setValueAtTime(98, t);
    const drone2 = audioCtx.createOscillator();
    drone2.type = "sine";
    drone2.frequency.setValueAtTime(147.5, t);
    const lfo = audioCtx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.08, t);
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(0.015 * (ambienceVolumePct / 100), t);
    lfo.connect(lfoGain).connect(master.gain);

    drone1.connect(master);
    drone2.connect(master);
    drone1.start(t);
    drone2.start(t);
    lfo.start(t);
    ambienceNodes = { master, drone1, drone2, lfo };
  } catch (e) {}
}

function stopAmbience() {
  if (!ambienceNodes) return;
  try {
    const t = audioCtx.currentTime;
    ambienceNodes.master.gain.linearRampToValueAtTime(0, t + 0.5);
    const oldNodes = ambienceNodes;
    ambienceNodes = null;
    setTimeout(() => {
      try {
        if (oldNodes.drone1) { oldNodes.drone1.stop(); oldNodes.drone1.disconnect(); }
        if (oldNodes.drone2) { oldNodes.drone2.stop(); oldNodes.drone2.disconnect(); }
        if (oldNodes.lfo) { oldNodes.lfo.stop(); oldNodes.lfo.disconnect(); }
        if (oldNodes.lfoGain) oldNodes.lfoGain.disconnect();
        if (oldNodes.master) oldNodes.master.disconnect();
      } catch (e) {}
    }, 550);
  } catch (e) {
    ambienceNodes = null;
  }
}

function syncAmbienceUI() {
  if (ambienceToggle) {
    ambienceToggle.classList.toggle("on", ambienceOn);
    ambienceToggle.innerHTML = pkIcon("castle", 15) + " " + (ambienceOn ? "Ambience on" : "Temple ambience");
  }
  const settingsAmbienceToggle = document.getElementById("settingsAmbienceToggle");
  if (settingsAmbienceToggle) {
    settingsAmbienceToggle.classList.toggle("on", ambienceOn);
    settingsAmbienceToggle.setAttribute("aria-checked", String(ambienceOn));
  }
}

if (ambienceToggle) {
  ambienceToggle.addEventListener("click", () => {
    ambienceOn = !ambienceOn;
    if (ambienceOn) startAmbience();
    else stopAmbience();
    syncAmbienceUI();
  });
}

function playChime() {
  if (!soundOn || !chimeOn) return;
  try {
    ensureAudio();
    const t = audioCtx.currentTime;
    const volScale = Math.max(0.1, soundVolumePct / 100);
    [660, 880, 1320].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + i * 0.07);
      gain.gain.setValueAtTime(0.0001, t + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.12 * volScale, t + i * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.07 + 0.5);
      osc.connect(gain).connect(audioCtx.destination);
      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch (_e) {}
      };
      osc.start(t + i * 0.07);
      osc.stop(t + i * 0.07 + 0.55);
    });
  } catch (e) {}
}

function playClick(kind) {
  if (!soundOn) return;
  try {
    ensureAudio();
    const t = audioCtx.currentTime;
    const vol = Math.max(0.15, (soundVolumePct / 100)) * 1.6;
    const isDown = kind === "down";

    // Switch acoustic profile parameters — tuned for rich presence, loud tactile feedback, and authentic mechanical feel
    const profiles = {
      brown: {
        filterType: "bandpass",
        filterFreq: isDown ? 2200 : 2800,
        filterQ: 2.2,
        noiseAmp: isDown ? 0.78 : 0.46,
        noiseDecay: 0.048,
        bodyFreq: isDown ? 210 : 270,
        bodyEndFreq: isDown ? 135 : 175,
        bodyAmp: isDown ? 0.60 : 0.34,
        bodyType: "triangle",
        decay: 0.075
      },
      blue: {
        filterType: "bandpass",
        filterFreq: isDown ? 3400 : 4200,
        filterQ: 3.6,
        noiseAmp: isDown ? 0.98 : 0.62,
        noiseDecay: 0.044,
        bodyFreq: isDown ? 520 : 640,
        bodyEndFreq: isDown ? 380 : 460,
        bodyAmp: isDown ? 0.55 : 0.32,
        bodyType: "sawtooth",
        decay: 0.065
      },
      red: {
        filterType: "lowpass",
        filterFreq: isDown ? 1400 : 1800,
        filterQ: 1.8,
        noiseAmp: isDown ? 0.72 : 0.42,
        noiseDecay: 0.062,
        bodyFreq: isDown ? 165 : 205,
        bodyEndFreq: isDown ? 85 : 110,
        bodyAmp: isDown ? 0.82 : 0.48,
        bodyType: "sine",
        decay: 0.105
      },
      typewriter: {
        filterType: "bandpass",
        filterFreq: isDown ? 2600 : 3200,
        filterQ: 2.4,
        noiseAmp: isDown ? 1.08 : 0.68,
        noiseDecay: 0.068,
        bodyFreq: isDown ? 340 : 430,
        bodyEndFreq: isDown ? 200 : 260,
        bodyAmp: isDown ? 0.68 : 0.40,
        bodyType: "sawtooth",
        decay: 0.090
      },
      silent: {
        filterType: "lowpass",
        filterFreq: isDown ? 1150 : 1450,
        filterQ: 1.2,
        noiseAmp: isDown ? 0.52 : 0.30,
        noiseDecay: 0.052,
        bodyFreq: isDown ? 140 : 170,
        bodyEndFreq: isDown ? 90 : 115,
        bodyAmp: isDown ? 0.52 : 0.28,
        bodyType: "sine",
        decay: 0.068
      }
    };
    const p = profiles[switchProfile] || profiles.brown;
    const dest = audioMasterGain || audioCtx.destination;

    // Transient mechanical impact noise
    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = p.filterType;
    noiseFilter.frequency.setValueAtTime(p.filterFreq, t);
    if (p.filterQ) noiseFilter.Q.setValueAtTime(p.filterQ, t);
    const noiseGain = audioCtx.createGain();
    const actualNoiseAmp = Math.min(1.6, p.noiseAmp * vol);
    noiseGain.gain.setValueAtTime(actualNoiseAmp, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + p.noiseDecay);
    noise.connect(noiseFilter).connect(noiseGain).connect(dest);
    noise.onended = () => {
      try {
        noise.disconnect();
        noiseFilter.disconnect();
        noiseGain.disconnect();
      } catch (_e) {}
    };
    noise.start(t);
    noise.stop(t + p.noiseDecay + 0.015);

    // Resonant mechanical body tone
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = p.bodyType;
    const startFreq = p.bodyFreq + (Math.random() * 14 - 7);
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, p.bodyEndFreq || (startFreq * 0.6)), t + p.decay);
    const actualBodyAmp = Math.min(1.6, p.bodyAmp * vol);
    gain.gain.setValueAtTime(actualBodyAmp, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + p.decay + 0.018);
    osc.connect(gain).connect(dest);
    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch (_e) {}
    };
    osc.start(t);
    osc.stop(t + p.decay + 0.025);
  } catch (e) {}
}

if (typeof soundToggle !== "undefined" && soundToggle) {
  soundToggle.classList.toggle("on", soundOn);
  soundToggle.innerHTML = (soundOn ? pkIcon("volume", 15) : pkIcon("volume-mute", 15)) + " Key sound";
  soundToggle.addEventListener("click", () => {
    soundOn = !soundOn;
    safeSet(LS.sound, soundOn ? "1" : "0");
    soundToggle.classList.toggle("on", soundOn);
    soundToggle.innerHTML = (soundOn ? pkIcon("volume", 15) : pkIcon("volume-mute", 15)) + " Key sound";
    if (soundOn) playClick("down");
  });
}

/* ---------- Settings & Studio Command Center Initialization ---------- */
function initSettingsToggles() {
  ensureSettingsStylesheet();
  ensureUpgradedSettingsModalDOM();
  healBothHandsOverlay();
  setTimeout(healBothHandsOverlay, 350);

  function bindSwitch(el, onToggle) {
    if (!el) return;
    if (!el.hasAttribute("role")) el.setAttribute("role", "switch");
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
    el.addEventListener("click", () => onToggle(!el.classList.contains("on")));
    el.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        onToggle(!el.classList.contains("on"));
      }
    });
  }

  function setSwitchUI(el, on) {
    if (!el) return;
    el.classList.toggle("on", !!on);
    el.setAttribute("aria-checked", String(!!on));
  }

  /* ---------- 1. Category Tabs & Real-Time Search Filter ---------- */
  const catTabs = document.querySelectorAll("#settingsCategoryTabs .settings-cat-tab");
  const sections = document.querySelectorAll("#settingsBodyScroll .settings-section");
  const searchInput = document.getElementById("settingsSearchInput");
  const searchClear = document.getElementById("settingsSearchClear");
  const emptySearch = document.getElementById("settingsEmptySearch");
  const searchTermEl = document.getElementById("settingsSearchTerm");
  const activeCatCountEl = document.getElementById("settingsActiveCatCount");
  const tabsScrollEl = document.getElementById("settingsCategoryTabs");
  const tabScrollLeftBtn = document.getElementById("settingsTabsScrollLeft");
  const tabScrollRightBtn = document.getElementById("settingsTabsScrollRight");
  let activeCategory = "all";

  function updateTabsScrollArrows() {
    if (!tabsScrollEl) return;
    const maxScroll = tabsScrollEl.scrollWidth - tabsScrollEl.clientWidth;
    if (tabScrollLeftBtn) {
      tabScrollLeftBtn.disabled = tabsScrollEl.scrollLeft <= 4;
    }
    if (tabScrollRightBtn) {
      tabScrollRightBtn.disabled = tabsScrollEl.scrollLeft >= maxScroll - 4;
    }
  }

  if (tabsScrollEl) {
    // Mouse wheel horizontal scrolling
    tabsScrollEl.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        tabsScrollEl.scrollLeft += e.deltaY;
        updateTabsScrollArrows();
      }
    }, { passive: false });

    // Click and drag horizontal panning
    let isMouseDown = false;
    let startX = 0;
    let scrollStart = 0;

    tabsScrollEl.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      isMouseDown = true;
      startX = e.pageX;
      scrollStart = tabsScrollEl.scrollLeft;
      tabsScrollEl.classList.add("is-dragging");
    });

    window.addEventListener("mousemove", (e) => {
      if (!isMouseDown || !tabsScrollEl) return;
      const walk = e.pageX - startX;
      tabsScrollEl.scrollLeft = scrollStart - walk;
      updateTabsScrollArrows();
    });

    window.addEventListener("mouseup", () => {
      if (!isMouseDown) return;
      isMouseDown = false;
      if (tabsScrollEl) {
        tabsScrollEl.classList.remove("is-dragging");
        updateTabsScrollArrows();
      }
    });

    // Left and right arrow buttons
    if (tabScrollLeftBtn) {
      tabScrollLeftBtn.addEventListener("click", () => {
        tabsScrollEl.scrollBy({ left: -220, behavior: "smooth" });
        setTimeout(updateTabsScrollArrows, 250);
      });
    }
    if (tabScrollRightBtn) {
      tabScrollRightBtn.addEventListener("click", () => {
        tabsScrollEl.scrollBy({ left: 220, behavior: "smooth" });
        setTimeout(updateTabsScrollArrows, 250);
      });
    }

    tabsScrollEl.addEventListener("scroll", updateTabsScrollArrows, { passive: true });
    setTimeout(updateTabsScrollArrows, 100);
  }

  function filterSettingsView() {
    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    if (searchClear) searchClear.hidden = !query;

    let totalVisibleRows = 0;

    sections.forEach((sec) => {
      const cat = sec.getAttribute("data-cat-section");
      const catMatches = query ? true : (activeCategory === "all" || activeCategory === cat);
      if (!catMatches) {
        sec.hidden = true;
        return;
      }

      const rows = sec.querySelectorAll(".settings-row");
      let visibleInSec = 0;
      rows.forEach((row) => {
        if (row.id === "wallpaperDimControl" && !document.body.classList.contains("has-custom-wallpaper")) {
          row.hidden = true;
          return;
        }
        if (!query) {
          row.hidden = false;
          visibleInSec++;
        } else {
          const hay = ((row.getAttribute("data-search") || "") + " " + row.textContent).toLowerCase();
          const match = hay.includes(query);
          row.hidden = !match;
          if (match) visibleInSec++;
        }
      });

      sec.hidden = visibleInSec === 0;
      totalVisibleRows += visibleInSec;
    });

    if (emptySearch) {
      emptySearch.hidden = !(query && totalVisibleRows === 0);
      if (searchTermEl) searchTermEl.textContent = query;
    }
    if (activeCatCountEl) {
      const isKm = document.documentElement.classList.contains("site-km-mode");
      const enTxt = totalVisibleRows + (totalVisibleRows === 1 ? " Control" : " Controls");
      const kmTxt = totalVisibleRows + " ការគ្រប់គ្រង";
      activeCatCountEl.setAttribute("data-en", enTxt);
      activeCatCountEl.setAttribute("data-km", kmTxt);
      activeCatCountEl.textContent = isKm ? kmTxt : enTxt;
    }
  }

  catTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activeCategory = tab.getAttribute("data-cat") || "all";
      catTabs.forEach((t) => {
        const isAct = t === tab;
        t.classList.toggle("active", isAct);
        t.setAttribute("aria-selected", String(isAct));
      });
      tab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      setTimeout(updateTabsScrollArrows, 300);
      if (searchInput && searchInput.value) {
        searchInput.value = "";
      }
      filterSettingsView();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", filterSettingsView);
  }
  if (searchClear && searchInput) {
    searchClear.addEventListener("click", () => {
      searchInput.value = "";
      filterSettingsView();
      searchInput.focus();
    });
  }

  /* ---------- 2. General: Keyboard Layout & Interface Language ---------- */
  const layoutChoiceBtns = document.querySelectorAll("#settingsLayoutChoice button");
  function getActiveLayoutId() {
    if (typeof window !== "undefined" && window.currentLayoutId) return window.currentLayoutId;
    if (typeof currentLayoutId !== "undefined" && currentLayoutId) return currentLayoutId;
    try {
      return localStorage.getItem("khmerActiveLayout") || localStorage.getItem("pk_active_layout") || "standard";
    } catch (e) {
      return "standard";
    }
  }

  function syncLayoutChoiceUI(layoutId) {
    const cur = layoutId || getActiveLayoutId();
    const btns = document.querySelectorAll("#settingsLayoutChoice button");
    btns.forEach((b) => {
      const match = (b.dataset.layoutSet || b.getAttribute("data-layout-set")) === cur;
      b.classList.toggle("active", match);
      b.setAttribute("aria-selected", match ? "true" : "false");
    });
  }
  window.syncSettingsLayoutChoiceUI = syncLayoutChoiceUI;

  layoutChoiceBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      const targetLayout = btn.dataset.layoutSet || btn.getAttribute("data-layout-set");
      if (!targetLayout) return;
      if (typeof switchLayout === "function") {
        switchLayout(targetLayout, true);
      } else if (typeof window.switchLayout === "function") {
        window.switchLayout(targetLayout, true);
      } else if (typeof window.setActiveLayout === "function") {
        window.setActiveLayout(targetLayout);
      }
      const topBtn = document.querySelector(`.layout-strip .layout-pill[data-layout="${targetLayout}"]`);
      if (topBtn && !topBtn.classList.contains("active")) {
        topBtn.click();
      }
      syncLayoutChoiceUI(targetLayout);
      if (typeof healBothHandsOverlay === "function") {
        setTimeout(healBothHandsOverlay, 60);
      }
    });
  });
  syncLayoutChoiceUI();

  const langChoiceBtns = document.querySelectorAll("#settingsLangChoice button");
  function syncLangChoiceUI() {
    const isKm = document.documentElement.classList.contains("site-km-mode");
    const cur = isKm ? "km" : "en";
    langChoiceBtns.forEach((b) => b.classList.toggle("active", b.dataset.langSet === cur));
  }
  langChoiceBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetLang = btn.dataset.langSet;
      try { localStorage.setItem("kk_site_lang", targetLang); } catch (e) {}
      if (typeof window.applySiteLanguage === "function") {
        window.applySiteLanguage(targetLang);
      }
      syncLangChoiceUI();
    });
  });
  syncLangChoiceUI();

  // Studio & Reference Quick Action buttons
  const openShortcutsBtn = document.getElementById("settingsOpenShortcutsBtn");
  const openStatsBtn = document.getElementById("settingsOpenStatsBtn");
  if (openShortcutsBtn) {
    openShortcutsBtn.addEventListener("click", () => {
      const settingsModal = document.getElementById("settingsModal");
      if (settingsModal) settingsModal.hidden = true;
      const scBtn = document.getElementById("shortcutsOpenBtn");
      const scModal = document.getElementById("shortcutsModal");
      if (scBtn) scBtn.click();
      else if (scModal) scModal.hidden = false;
    });
  }
  if (openStatsBtn) {
    openStatsBtn.addEventListener("click", () => {
      const settingsModal = document.getElementById("settingsModal");
      if (settingsModal) settingsModal.hidden = true;
      const stBtn = document.getElementById("statsOpenBtn");
      if (stBtn) stBtn.click();
    });
  }
  const restartTutBtn = document.getElementById("settingsRestartTutorialBtn");
  if (restartTutBtn) {
    restartTutBtn.addEventListener("click", () => {
      const settingsModal = document.getElementById("settingsModal");
      if (settingsModal) settingsModal.hidden = true;
      if (window.PK_TUTORIAL && typeof window.PK_TUTORIAL.start === "function") {
        window.PK_TUTORIAL.start(true);
      }
    });
  }

  /* ---------- 3. Appearance: Theme, Accent, Font, Text Scale & Wallpaper ---------- */
  const THEME_WAVE_PALETTES = {
    glass:     { color: "#67e8f9", glow: "rgba(103, 232, 249, 0.45)" },
    dark:      { color: "#38bdf8", glow: "rgba(56, 189, 248, 0.40)" },
    temple:    { color: "#ff9d2e", glow: "rgba(255, 157, 46, 0.45)" },
    moonlight: { color: "#60a5fa", glow: "rgba(96, 165, 250, 0.48)" },
    jungle:    { color: "#34d399", glow: "rgba(52, 211, 153, 0.44)" },
    sunset:    { color: "#f472b6", glow: "rgba(244, 114, 182, 0.45)" },
    sepia:     { color: "#e6b88a", glow: "rgba(212, 163, 115, 0.44)" },
    light:     { color: "#38bdf8", glow: "rgba(148, 163, 184, 0.40)" },
    system:    { color: "#a78bfa", glow: "rgba(167, 139, 250, 0.44)" }
  };

  function spawnChoiceButtonRipple(btn, evt) {
    if (!btn || document.documentElement.classList.contains("performance-mode") || document.documentElement.classList.contains("reduced-motion") || document.documentElement.classList.contains("anim-mode-off")) return;
    try {
      const rect = btn.getBoundingClientRect();
      const x = (evt && evt.clientX) ? (evt.clientX - rect.left) : (rect.width / 2);
      const y = (evt && evt.clientY) ? (evt.clientY - rect.top) : (rect.height / 2);
      const ripple = document.createElement("span");
      ripple.className = "theme-click-ripple";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      btn.appendChild(ripple);
      setTimeout(() => { if (ripple.parentNode) ripple.parentNode.removeChild(ripple); }, 620);

      btn.classList.remove("theme-btn-pop");
      void btn.offsetWidth;
      btn.classList.add("theme-btn-pop");
      setTimeout(() => btn.classList.remove("theme-btn-pop"), 520);
    } catch (err) {}
  }

  function triggerThemeTransitionFX(btn, mode, evt) {
    spawnChoiceButtonRipple(btn, evt);
    if (document.documentElement.classList.contains("performance-mode") || document.documentElement.classList.contains("reduced-motion") || document.documentElement.classList.contains("anim-mode-off")) return;
    try {
      const pal = THEME_WAVE_PALETTES[mode] || THEME_WAVE_PALETTES.dark;
      const parentRow = btn ? btn.closest(".settings-row") : null;
      if (parentRow) {
        parentRow.style.setProperty("--row-flash-color", pal.color);
        parentRow.style.setProperty("--row-flash-glow", pal.glow);
        parentRow.classList.remove("theme-row-flash");
        void parentRow.offsetWidth;
        parentRow.classList.add("theme-row-flash");
        setTimeout(() => parentRow.classList.remove("theme-row-flash"), 650);
      }

      let overlay = document.getElementById("pkThemeWaveOverlay");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "pkThemeWaveOverlay";
        overlay.className = "pk-theme-wave-overlay";
        document.body.appendChild(overlay);
      }
      const rect = btn ? btn.getBoundingClientRect() : null;
      const cx = (evt && evt.clientX) ? evt.clientX : (rect ? (rect.left + rect.width / 2) : (window.innerWidth / 2));
      const cy = (evt && evt.clientY) ? evt.clientY : (rect ? (rect.top + rect.height / 2) : (window.innerHeight / 2));
      const ring = document.createElement("div");
      ring.className = "pk-theme-wave-ring";
      ring.style.setProperty("--wave-x", cx + "px");
      ring.style.setProperty("--wave-y", cy + "px");
      ring.style.setProperty("--wave-color", pal.glow);
      overlay.appendChild(ring);
      setTimeout(() => { if (ring.parentNode) ring.parentNode.removeChild(ring); }, 720);
    } catch (err) {}
  }

  document.querySelectorAll("#settingsBodyScroll .settings-choice button").forEach((choiceBtn) => {
    if (!choiceBtn.closest("#themeChoice")) {
      choiceBtn.addEventListener("click", (e) => spawnChoiceButtonRipple(choiceBtn, e));
    }
  });

  const THEME_DEFAULT_ACCENT = {
    dark: "gold",
    temple: "gold",
    sepia: "gold",
    jungle: "jade",
    moonlight: "cyan",
    glass: "cyan",
    light: "cyan",
    sunset: "ruby"
  };

  const ACCENTS = {
    gold:     { gold: "#ff9d2e", bright: "#ffd166", ink: "#1a1106", glow: "rgba(255, 209, 102, 0.42)", soft: "rgba(255, 209, 102, 0.16)", border: "rgba(255, 209, 102, 0.36)" },
    jade:     { gold: "#3f9d6b", bright: "#5fd694", ink: "#061a10", glow: "rgba(95, 214, 148, 0.42)",  soft: "rgba(95, 214, 148, 0.16)",  border: "rgba(95, 214, 148, 0.36)" },
    sapphire: { gold: "#14b8a6", bright: "#2dd4a7", ink: "#041e19", glow: "rgba(45, 212, 167, 0.42)",  soft: "rgba(45, 212, 167, 0.16)",  border: "rgba(45, 212, 167, 0.36)" },
    ruby:     { gold: "#e11d48", bright: "#ff5a70", ink: "#ffffff", glow: "rgba(255, 90, 112, 0.45)",  soft: "rgba(255, 90, 112, 0.16)",  border: "rgba(255, 90, 112, 0.38)" },
    cyan:     { gold: "#0284c7", bright: "#38bdf8", ink: "#041628", glow: "rgba(56, 189, 248, 0.42)",  soft: "rgba(56, 189, 248, 0.16)",  border: "rgba(56, 189, 248, 0.36)" },
    amethyst: { gold: "#9333ea", bright: "#c084fc", ink: "#160726", glow: "rgba(192, 132, 252, 0.45)", soft: "rgba(192, 132, 252, 0.16)", border: "rgba(192, 132, 252, 0.38)" }
  };

  const accentButtons = document.querySelectorAll("#accentChoice button");
  function applyAccent(name) {
    const key = ACCENTS[name] ? name : "gold";
    const a = ACCENTS[key];
    const root = document.documentElement;
    root.setAttribute("data-accent-color", key);
    root.style.setProperty("--gold", a.gold);
    root.style.setProperty("--gold-bright", a.bright);
    root.style.setProperty("--accent-ink", a.ink);
    root.style.setProperty("--accent-glow", a.glow);
    root.style.setProperty("--accent-soft", a.soft);
    root.style.setProperty("--accent-border", a.border);
    accentButtons.forEach((b) => {
      const isAct = b.dataset.accent === key;
      b.classList.toggle("active", isAct);
      b.setAttribute("aria-pressed", isAct ? "true" : "false");
    });
    safeSet(LS.accent, key);
    try {
      if (localStorage.getItem("khmerSettingHandColorPreset") === "match" && window.PKHandsColor && typeof window.PKHandsColor.applyHandColors === "function") {
        window.PKHandsColor.applyHandColors("match");
      }
    } catch (e) {}
  }

  const themeButtons = document.querySelectorAll("#themeChoice button");
  function applyTheme(mode, syncThemeAccent) {
    const sysDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const effective = mode === "system" ? (sysDark ? "dark" : "light") : mode;
    document.documentElement.classList.toggle("theme-light", effective === "light");
    document.documentElement.classList.toggle("theme-temple", effective === "temple");
    document.documentElement.classList.toggle("theme-moonlight", effective === "moonlight");
    document.documentElement.classList.toggle("theme-jungle", effective === "jungle");
    document.documentElement.classList.toggle("theme-sunset", effective === "sunset");
    document.documentElement.classList.toggle("theme-sepia", effective === "sepia");
    document.documentElement.classList.toggle("theme-glass", effective === "glass");
    themeButtons.forEach((b) => b.classList.toggle("active", b.dataset.theme === mode));
    safeSet(LS.theme, mode);
    if (syncThemeAccent && THEME_DEFAULT_ACCENT[effective]) {
      applyAccent(THEME_DEFAULT_ACCENT[effective]);
    }
  }
  themeButtons.forEach((b) => {
    b.addEventListener("click", (e) => {
      applyTheme(b.dataset.theme, false);
      triggerThemeTransitionFX(b, b.dataset.theme, e);
      if (soundOn) playClick("down");
    });
  });
  applyTheme(safeGet(LS.theme, "dark"), false);

  accentButtons.forEach((b) => {
    b.addEventListener("click", (e) => {
      applyAccent(b.dataset.accent);
      triggerThemeTransitionFX(b, b.dataset.accent, e);
      if (soundOn) playClick("down");
    });
  });
  applyAccent(safeGet(LS.accent, "gold"));

  // Khmer Script Font Family
  const khmerFontBtns = document.querySelectorAll("#khmerFontChoice button");
  const KHMER_FONT_MAP = {
    "kantumruy": "'Kantumruy Pro', 'Khmer OS Battambang', 'Noto Sans Khmer', sans-serif",
    "noto-sans": "'Noto Sans Khmer', 'Khmer OS Battambang', sans-serif",
    "noto-serif": "'Noto Serif Khmer', 'Khmer OS Battambang', serif"
  };
  function applyKhmerFont(fontKey) {
    fontKey = fontKey || "kantumruy";
    document.documentElement.setAttribute("data-khmer-font", fontKey);
    const fontVal = KHMER_FONT_MAP[fontKey] || KHMER_FONT_MAP.kantumruy;
    document.documentElement.style.setProperty("--khmer-font", fontVal);
    khmerFontBtns.forEach((b) => b.classList.toggle("active", b.dataset.kfont === fontKey));
    safeSet(LS.khmerFont, fontKey);
  }
  khmerFontBtns.forEach((b) => b.addEventListener("click", () => applyKhmerFont(b.dataset.kfont)));
  applyKhmerFont(safeGet(LS.khmerFont, "kantumruy"));

  // Custom Wallpaper + Dimming + Glass Blur
  const customWallpaperLayer = document.getElementById("customWallpaperLayer");
  const uploadWallpaperBtn = document.getElementById("uploadWallpaperBtn");
  const urlWallpaperBtn = document.getElementById("urlWallpaperBtn");
  const wallpaperFileInput = document.getElementById("wallpaperFileInput");
  const removeWallpaperBtn = document.getElementById("removeWallpaperBtn");
  const wallpaperDimControl = document.getElementById("wallpaperDimControl");
  const wallpaperDimSlider = document.getElementById("wallpaperDimSlider");
  const wallpaperDimValue = document.getElementById("wallpaperDimValue");
  const wallpaperBlurSlider = document.getElementById("wallpaperBlurSlider");
  const wallpaperBlurValue = document.getElementById("wallpaperBlurValue");

  const WALLPAPER_KEY = "khmerCustomWallpaper";
  const WALLPAPER_DIM_KEY = "khmerCustomWallpaperDim";

  function applyWallpaperBlur(px) {
    px = Math.max(0, Math.min(24, parseInt(px, 10) || 0));
    document.documentElement.style.setProperty("--wallpaper-blur", px + "px");
    if (customWallpaperLayer) {
      customWallpaperLayer.style.filter = px > 0 ? `blur(${px}px)` : "";
    }
    if (wallpaperBlurSlider) wallpaperBlurSlider.value = px;
    if (wallpaperBlurValue) wallpaperBlurValue.textContent = px + "px";
    safeSet(LS.wallpaperBlur, String(px));
  }
  if (wallpaperBlurSlider) {
    wallpaperBlurSlider.addEventListener("input", () => applyWallpaperBlur(wallpaperBlurSlider.value));
  }
  applyWallpaperBlur(safeGet(LS.wallpaperBlur, "0"));

  // Interface Corner Radius (Custom Border Radius)
  const borderRadiusSlider = document.getElementById("borderRadiusSlider");
  const borderRadiusValue = document.getElementById("borderRadiusValue");
  const radiusLivePreview = document.getElementById("radiusLivePreview");
  const radiusLiveBadge = document.getElementById("radiusLiveBadge");
  const radiusPresetBtns = document.querySelectorAll("#radiusPresetChoice button");

  function applyBorderRadius(px, save = true) {
    px = Math.max(0, Math.min(32, parseInt(px, 10) || 0));
    document.documentElement.style.setProperty("--radius", px + "px");
    document.documentElement.style.setProperty("--radius-xs", Math.max(0, px - 6) + "px");
    document.documentElement.style.setProperty("--radius-sm", Math.max(0, px - 3) + "px");
    document.documentElement.style.setProperty("--radius-md", px + "px");
    document.documentElement.style.setProperty("--radius-lg", (px + 3) + "px");
    document.documentElement.style.setProperty("--radius-xl", (px + 6) + "px");
    document.documentElement.style.setProperty("--radius-pill", (px === 0 ? "0px" : Math.max(px, 16) + "px"));
    document.documentElement.style.setProperty("--border-radius", px + "px");
    document.documentElement.style.setProperty("--app-radius", px + "px");

    const oldSt = document.getElementById("pkCustomBorderRadiusStyle");
    const newSt = document.createElement("style");
    newSt.id = "pkCustomBorderRadiusStyle";
    const extraSharp = px === 0 ? ".toggle-switch, .toggle-switch::after, input[type=\"checkbox\"] { border-radius: 0px !important; }" : "";
    newSt.textContent = ":root {" +
      "--radius: " + px + "px !important;" +
      "--radius-xs: " + Math.max(0, px - 6) + "px !important;" +
      "--radius-sm: " + Math.max(0, px - 3) + "px !important;" +
      "--radius-md: " + px + "px !important;" +
      "--radius-lg: " + (px + 3) + "px !important;" +
      "--radius-xl: " + (px + 6) + "px !important;" +
      "--radius-pill: " + (px === 0 ? "0px" : Math.max(px, 16) + "px") + " !important;" +
      "--border-radius: " + px + "px !important;" +
      "--app-radius: " + px + "px !important;" +
      "}" +
      "*:not(html):not(body):not(canvas):not(svg):not(path):not(circle):not(line):not(polyline):not(rect):not(polygon):not(defs):not(linearGradient):not(stop):not(.modal-backdrop):not(.modal):not(.custom-wallpaper-layer):not(.custom-wallpaper-dim):not(.horizon):not(.focus-screen-ripple):not(.motes):not(.scanline-overlay):not(.toast-stack):not([class*=\"dot\"]):not([class*=\"avatar\"]):not([class*=\"orb\"]):not([class*=\"circle\"]):not([class*=\"flame\"]):not(.swatch-quick-l):not(.swatch-quick-r):not(.site-lang-toggle-icon):not(.pk-cmb-av) {" +
      "border-radius: " + px + "px !important;" +
      "}" +
      ".lesson-strip-header, .guide-dock-header, .modal-header, [class*=\"-modal-header\"], [class*=\"-dock-header\"], [class*=\"-strip-header\"] {" +
      "border-radius: " + px + "px " + px + "px 0 0 !important;" +
      "}" +
      ".modal-footer, [class*=\"-modal-footer\"], [class*=\"-dock-footer\"] {" +
      "border-radius: 0 0 " + px + "px " + px + "px !important;" +
      "}" +
      "::-webkit-scrollbar-thumb, ::-webkit-scrollbar-track {" +
      "border-radius: " + px + "px !important;" +
      "}" +
      extraSharp;

    if (oldSt) {
      if (typeof oldSt.replaceWith === "function") {
        oldSt.replaceWith(newSt);
      } else if (oldSt.parentNode && typeof oldSt.parentNode.replaceChild === "function") {
        oldSt.parentNode.replaceChild(newSt, oldSt);
      } else {
        if (typeof oldSt.remove === "function") oldSt.remove();
        if (document.head && typeof document.head.appendChild === "function") {
          document.head.appendChild(newSt);
        }
      }
    } else if (document.head && typeof document.head.appendChild === "function") {
      document.head.appendChild(newSt);
    }

    const slider = document.getElementById("borderRadiusSlider");
    const badge = document.getElementById("borderRadiusValue");
    const preview = document.getElementById("radiusLivePreview");
    const badgePreview = document.getElementById("radiusLiveBadge");
    const presets = document.querySelectorAll("#radiusPresetChoice button");

    if (slider && parseInt(slider.value, 10) !== px) slider.value = px;
    if (badge) badge.textContent = px + "px";
    if (preview) preview.style.borderRadius = px + "px";
    if (badgePreview) badgePreview.textContent = px + "px";

    presets.forEach((b) => {
      b.classList.toggle("active", parseInt(b.dataset.radius, 10) === px);
    });

    if (save) {
      safeSet(LS.borderRadius, String(px));
    }
  }
  window.applyBorderRadius = applyBorderRadius;

  if (borderRadiusSlider) {
    borderRadiusSlider.addEventListener("input", () => applyBorderRadius(borderRadiusSlider.value));
    borderRadiusSlider.addEventListener("change", () => applyBorderRadius(borderRadiusSlider.value));
  }

  radiusPresetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = parseInt(btn.dataset.radius, 10) || 0;
      applyBorderRadius(r);
    });
  });

  applyBorderRadius(safeGet(LS.borderRadius, "9"), false);

  function isSafeImageUrl(url) {
    if (!url || typeof url !== "string") return false;
    var trimmed = url.trim();
    if (trimmed.length === 0) return false;
    if (/^data:image\/(png|jpe?g|webp|gif|bmp);base64,[A-Za-z0-9+/=]+$/i.test(trimmed)) {
      return trimmed.length <= 15 * 1024 * 1024;
    }
    if (trimmed.length > 4096) return false;
    if (/^blob:[a-zA-Z0-9-.:/]+$/i.test(trimmed)) {
      return true;
    }
    if (/^(\/|\.\/|\.\.\/|assets\/)/i.test(trimmed)) {
      return !/[<>"'()\\]/.test(trimmed);
    }
    try {
      var base = (typeof window !== "undefined" && window.location && window.location.origin) ? window.location.origin : "http://localhost";
      var parsed = new URL(trimmed, base);
      if (parsed.protocol === "https:" || parsed.protocol === "http:") {
        return !/[<>"'()\\]/.test(trimmed);
      }
    } catch (_e) {
      return false;
    }
    return false;
  }
  if (typeof window !== "undefined") {
    window.isSafeImageUrl = isSafeImageUrl;
  }

  function normalizeImageUrl(url) {
    if (!url || typeof url !== "string") return "";
    var t = url.trim();
    if (!t) return "";
    var isSubdir = typeof window !== "undefined" && (
      window.__IS_REI_SUBDIR__ === true ||
      (window.location && (window.location.pathname.includes('/rei/') || window.location.pathname.endsWith('/rei')))
    );
    if (isSubdir && t.startsWith("assets/wallpapers/")) {
      t = "../" + t;
    }
    if (/^(https?:\/\/|data:|blob:|\/|\.\/|\.\.\/|assets\/)/i.test(t)) {
      return t;
    }
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\//.test(t)) {
      return "https://" + t;
    }
    return t;
  }

  function syncActiveWallpaperChip(url) {
    const chip = document.getElementById("activeWallpaperChip");
    const thumb = document.getElementById("activeWallpaperThumb");
    const label = document.getElementById("activeWallpaperLabel");
    if (!chip) return;
    if (!url) {
      chip.style.display = "none";
      return;
    }
    chip.style.display = "flex";
    if (thumb) thumb.style.backgroundImage = 'url("' + normalizeImageUrl(url).replace(/["'\\]/g, "") + '")';
    if (label) {
      const matched = (typeof WALLPAPER_PRESETS !== "undefined") && WALLPAPER_PRESETS.find(p => p.url === url || normalizeImageUrl(p.url) === normalizeImageUrl(url));
      const isKm = document.documentElement.classList.contains("site-km-mode");
      if (matched) {
        label.textContent = isKm && matched.nameKm ? matched.nameKm : matched.name;
      } else if (url.startsWith("data:")) {
        label.textContent = "Uploaded Artwork";
      } else if (url.startsWith("blob:")) {
        label.textContent = "Local Session";
      } else if (url.includes("unsplash.com")) {
        label.textContent = "Unsplash Studio";
      } else if (url.includes("assets/")) {
        label.textContent = "Khmer Heritage";
      } else {
        try {
          var parsed = new URL(url);
          label.textContent = parsed.hostname.replace(/^www\./, "");
        } catch (_e) {
          label.textContent = "Custom Backdrop";
        }
      }
    }
  }

  function applyWallpaper(url, dimPct) {
    if (!url) return;
    const cwLayer = document.getElementById("customWallpaperLayer");
    if (!cwLayer) return;
    const normUrl = normalizeImageUrl(url);
    if (!isSafeImageUrl(normUrl)) {
      console.warn("PK Khmer Type: Rejected unsafe wallpaper URL.");
      return;
    }
    dimPct = dimPct !== undefined ? dimPct : (parseInt(safeGet(WALLPAPER_DIM_KEY, "65"), 10) || 65);
    var sanitizedUrl = normUrl.replace(/["'\\]/g, "");
    cwLayer.style.backgroundImage = 'url("' + sanitizedUrl + '")';
    document.documentElement.style.setProperty("--wallpaper-dim", (dimPct / 100).toString());
    document.body.classList.add("has-custom-wallpaper");

    const remBtn = document.getElementById("removeWallpaperBtn");
    const dimCtrl = document.getElementById("wallpaperDimControl");
    const dimSlider = document.getElementById("wallpaperDimSlider");
    const dimVal = document.getElementById("wallpaperDimValue");
    if (remBtn) remBtn.style.display = "inline-flex";
    if (dimCtrl) {
      dimCtrl.style.display = "flex";
      dimCtrl.hidden = false;
    }
    if (dimSlider) dimSlider.value = dimPct;
    if (dimVal) dimVal.textContent = dimPct + "%";

    syncActiveWallpaperChip(sanitizedUrl);
  }

  function removeWallpaper() {
    const oldCloudFileId = safeGet("khmerCustomWallpaperFileId", "");
    try { localStorage.removeItem(WALLPAPER_KEY); } catch (e) {}
    try { localStorage.removeItem(WALLPAPER_DIM_KEY); } catch (e) {}
    try { localStorage.removeItem("khmerCustomWallpaperUrl"); } catch (e) {}
    try { localStorage.removeItem("khmerCustomWallpaperFileId"); } catch (e) {}
    if (window.PKCloudSync) {
      if (typeof window.PKCloudSync.deleteLocalFileCache === "function") {
        window.PKCloudSync.deleteLocalFileCache("custom_wallpaper");
      }
      if (oldCloudFileId && typeof window.PKCloudSync.deleteUserFile === "function") {
        window.PKCloudSync.deleteUserFile(oldCloudFileId).catch(() => {});
      }
      if (typeof window.PKCloudSync.queueSettingsSync === "function") {
        window.PKCloudSync.queueSettingsSync();
      }
    }
    document.body.classList.remove("has-custom-wallpaper");
    const cwLayer = document.getElementById("customWallpaperLayer");
    if (cwLayer) cwLayer.style.backgroundImage = "";
    const remBtn = document.getElementById("removeWallpaperBtn");
    const dimCtrl = document.getElementById("wallpaperDimControl");
    const fileInput = document.getElementById("wallpaperFileInput");
    if (remBtn) remBtn.style.display = "none";
    if (dimCtrl) dimCtrl.style.display = "none";
    if (fileInput) fileInput.value = "";
    syncActiveWallpaperChip("");
    if (typeof showToast === "function") showToast(pkIcon("reset", 18), "Wallpaper removed", "Restored default background.");
  }

  if (uploadWallpaperBtn && wallpaperFileInput) {
    uploadWallpaperBtn.addEventListener("click", () => wallpaperFileInput.click());
    wallpaperFileInput.addEventListener("change", () => {
      const file = wallpaperFileInput.files && wallpaperFileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1920;
          let w = img.width, h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
            else { w = Math.round((w * maxDim) / h); h = maxDim; }
          }
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          safeSet(WALLPAPER_KEY, dataUrl);
          applyWallpaper(dataUrl);
          if (window.PKCloudSync && typeof window.PKCloudSync.saveLocalFileCache === "function") {
            window.PKCloudSync.saveLocalFileCache("custom_wallpaper", { dataUrl: dataUrl, mimeType: "image/jpeg" });
          }
          if (canvas.toBlob && window.PKCloudSync && typeof window.PKCloudSync.uploadUserFile === "function") {
            canvas.toBlob(async (blob) => {
              if (!blob) return;
              try {
                const uploaded = await window.PKCloudSync.uploadUserFile(blob, {
                  fileName: (file.name || "wallpaper.jpg").replace(/\.[^.]+$/, "") + ".jpg",
                  mimeType: "image/jpeg",
                  sizeBytes: blob.size,
                  category: "wallpaper"
                });
                if (uploaded && uploaded.id) {
                  safeSet("khmerCustomWallpaperFileId", uploaded.id);
                }
              } catch (_upErr) {}
            }, "image/jpeg", 0.85);
          }
          if (typeof showToast === "function") showToast(pkIcon("check", 18), "Wallpaper applied", "Custom background updated.");
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /* ================= Custom Wallpaper Studio & Gallery Modal Controller ================= */
  const WALLPAPER_PRESETS = [
    {
      id: "angkor-sunrise",
      name: "Angkor Wat Sunrise",
      nameKm: "អង្គរវត្ត ពេលព្រលឹម",
      tag: "Khmer Heritage",
      tagKm: "បេតិកភណ្ឌខ្មែរ",
      url: "assets/wallpapers/angkor-wat-sunrise.jpg"
    },
    {
      id: "bayon-faces",
      name: "Bayon Smiling Faces",
      nameKm: "ប្រាសាទបាយ័ន ថ្មញញឹម",
      tag: "Angkor Thom",
      tagKm: "អង្គរធំ",
      url: "assets/wallpapers/bayon-stone-faces.jpg"
    },
    {
      id: "ta-prohm-roots",
      name: "Ta Prohm Sanctuary",
      nameKm: "ប្រាសាទតាព្រហ្ម ឫសឈើបុរាណ",
      tag: "Jungle Temple",
      tagKm: "ប្រាសាទព្រៃព្រឹក្សា",
      url: "assets/wallpapers/ta-prohm-roots.jpg"
    },
    {
      id: "angkor-twilight",
      name: "Angkor Wat Twilight",
      nameKm: "អង្គរវត្ត ពេលអស្តង្គត",
      tag: "Sunset Reflection",
      tagKm: "ស្រមោលឆ្លុះទឹក",
      url: "assets/wallpapers/angkor-wat-twilight.jpg"
    },
    {
      id: "banteay-srei",
      name: "Banteay Srei Carvings",
      nameKm: "បន្ទាយស្រី ក្បូរក្បាច់បុរាណ",
      tag: "Pink Sandstone",
      tagKm: "ថ្មភក់ពណ៌ផ្កាឈូក",
      url: "assets/wallpapers/banteay-srei-carvings.jpg"
    },
    {
      id: "cambodia-countryside",
      name: "Cambodia Sugar Palms",
      nameKm: "វាលស្រែ និងដើមត្នោតខ្មែរ",
      tag: "Countryside",
      tagKm: "ទេសភាពស្រុកស្រែ",
      url: "assets/wallpapers/cambodia-countryside.jpg"
    },
    {
      id: "neo-tokyo",
      name: "Cyber Neo-Tokyo",
      nameKm: "ស៊ីប័រ ណេអូតូក្យូ",
      tag: "Cyberpunk",
      tagKm: "ស៊ីប័រភាំង",
      url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80"
    },
    {
      id: "lofi-night",
      name: "Lo-Fi Midnight",
      nameKm: "រាត្រី ឡូហ្វៃ",
      tag: "Anime Night",
      tagKm: "រាត្រីស្ងប់ស្ងាត់",
      url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80"
    },
    {
      id: "synthwave",
      name: "Retro Synthwave",
      nameKm: "ស៊ីនវ៉េវ បែបបុរាណ",
      tag: "80s Neon",
      tagKm: "ពន្លឺណេអុង ៨០",
      url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80"
    },
    {
      id: "obsidian-circuit",
      name: "Obsidian Circuit",
      nameKm: "សៀគ្វី អប់ស៊ីឌៀន",
      tag: "Tech Minimal",
      tagKm: "បច្ចេកវិទ្យា",
      url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80"
    },
    {
      id: "dark-slate",
      name: "Dark Slate Glass",
      nameKm: "កញ្ចក់ ស្លេតងងឹត",
      tag: "Atmospheric",
      tagKm: "បរិយាកាស",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80"
    },
    {
      id: "nebula-space",
      name: "Deep Cosmic Nebula",
      nameKm: "អ័ព្ទលំហ ណេប៊ូឡា",
      tag: "Astronomy",
      tagKm: "តារាសាស្ត្រ",
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80"
    }
  ];

  let wpPreviewDebounceTimer = null;
  let activeWpPresetId = null;

  function renderWallpaperGallery() {
    const grid = document.getElementById("wallpaperGalleryGrid");
    if (!grid || grid.children.length > 0) return;
    const isKm = document.documentElement.classList.contains("site-km-mode");
    const currentWp = safeGet("khmerCustomWallpaperUrl", "") || safeGet(WALLPAPER_KEY, "");
    grid.innerHTML = WALLPAPER_PRESETS.map((p) => {
      const isCur = currentWp === p.url || (currentWp && normalizeImageUrl(currentWp) === normalizeImageUrl(p.url));
      const displayName = isKm && p.nameKm ? p.nameKm : p.name;
      const displayTag = isKm && p.tagKm ? p.tagKm : p.tag;
      const thumbUrl = normalizeImageUrl(p.url);
      const isLocalWp = p.url && p.url.startsWith("assets/wallpapers/");
      const canonicalWebUrl = isLocalWp ? ("https://not-phana.github.io/PK-Khmer-Type/" + p.url) : thumbUrl;
      return `<button type="button" class="wallpaper-gallery-card wallpaper-gallery-item${isCur ? ' active' : ''}" data-preset-id="${p.id}" data-preset-url="${p.url}" data-web-url="${canonicalWebUrl}" title="${isKm ? 'ចុចដើម្បីមើលសាកល្បង · ចុច២ដងដើម្បីប្រើប្រាស់' : 'Click to preview · Double-click to apply'}">
        <div class="wallpaper-gallery-thumb" style="background-image:url('${thumbUrl}')">
          <img class="wallpaper-gallery-img" src="${thumbUrl}" onerror="if(!this.dataset.fallbackTried){this.dataset.fallbackTried='1'; this.src='${canonicalWebUrl}'; this.parentElement.style.backgroundImage='url(\\'${canonicalWebUrl}\\')';}" alt="${displayName}" loading="lazy" aria-hidden="true">
          <span class="wallpaper-gallery-badge">${displayTag}</span>
        </div>
        <div class="wallpaper-gallery-name">${displayName}</div>
      </button>`;
    }).join("");

    grid.addEventListener("click", (e) => {
      const item = e.target.closest(".wallpaper-gallery-item");
      if (!item) return;
      const url = item.dataset.presetUrl;
      const id = item.dataset.presetId;
      activeWpPresetId = id;
      grid.querySelectorAll(".wallpaper-gallery-item").forEach((el) => el.classList.toggle("active", el === item));
      const input = document.getElementById("wallpaperUrlInput");
      if (input) {
        input.value = url;
        const clearBtn = document.getElementById("wallpaperClearUrlBtn");
        if (clearBtn) clearBtn.style.display = "inline-flex";
      }
      updateWallpaperStagePreview(url);
    });

    grid.addEventListener("dblclick", (e) => {
      const item = e.target.closest(".wallpaper-gallery-item");
      if (!item) return;
      const url = item.dataset.presetUrl;
      const dimSlider = document.getElementById("wallpaperTuneDimSlider");
      const blurSlider = document.getElementById("wallpaperTuneBlurSlider");
      const dimVal = dimSlider ? parseInt(dimSlider.value, 10) : 65;
      const blurVal = blurSlider ? parseInt(blurSlider.value, 10) : 0;
      commitWallpaperApply(url, dimVal, blurVal);
    });
  }

  function updateWallpaperStagePreview(rawUrl) {
    const previewBg = document.getElementById("wallpaperPreviewBg");
    const previewDim = document.getElementById("wallpaperPreviewDim");
    const statusPill = document.getElementById("wallpaperStatusPill");
    const statusText = document.getElementById("wallpaperStatusText");
    const metaBadge = document.getElementById("wallpaperMetaBadge");
    const dimSlider = document.getElementById("wallpaperTuneDimSlider");
    const blurSlider = document.getElementById("wallpaperTuneBlurSlider");

    const normUrl = normalizeImageUrl(rawUrl);
    const dimVal = dimSlider ? parseInt(dimSlider.value, 10) || 65 : 65;
    const blurVal = blurSlider ? parseInt(blurSlider.value, 10) || 0 : 0;

    if (previewDim) previewDim.style.background = "rgba(5, 7, 13, " + (dimVal / 100) + ")";

    if (!normUrl) {
      if (previewBg) {
        previewBg.style.backgroundImage = "";
        previewBg.style.filter = "";
      }
      if (statusText) statusText.textContent = "Enter URL or pick a preset";
      if (metaBadge) metaBadge.textContent = "Waiting for URL...";
      if (statusPill) statusPill.className = "wallpaper-status-pill";
      return;
    }

    if (!isSafeImageUrl(normUrl)) {
      if (statusText) statusText.textContent = "Invalid or restricted URL";
      if (metaBadge) metaBadge.textContent = "RESTRICTED";
      if (statusPill) statusPill.className = "wallpaper-status-pill error";
      return;
    }

    if (statusText) statusText.textContent = "Testing & loading image...";
    if (statusPill) statusPill.className = "wallpaper-status-pill loading";

    const sanitized = normUrl.replace(/["'\\]/g, "");
    const img = new Image();
    img.onload = () => {
      if (previewBg) {
        previewBg.style.backgroundImage = 'url("' + sanitized + '")';
        previewBg.style.filter = blurVal > 0 ? `blur(${blurVal}px)` : "";
      }
      const dimTxt = img.naturalWidth + " × " + img.naturalHeight + " PX";
      if (statusText) statusText.textContent = dimTxt + " · READY";
      if (metaBadge) metaBadge.textContent = dimTxt;
      if (statusPill) statusPill.className = "wallpaper-status-pill ready";
    };
    img.onerror = () => {
      if (!img.dataset.fallbackTried && (sanitized.startsWith("assets/wallpapers/") || sanitized.startsWith("../assets/wallpapers/"))) {
        img.dataset.fallbackTried = "1";
        const cleanAsset = sanitized.replace(/^(\.\.\/)+/, '');
        const fallbackWeb = "https://not-phana.github.io/PK-Khmer-Type/" + cleanAsset;
        img.src = fallbackWeb;
        return;
      }
      if (previewBg) {
        previewBg.style.backgroundImage = 'url("' + sanitized + '")';
        previewBg.style.filter = blurVal > 0 ? `blur(${blurVal}px)` : "";
      }
      if (statusText) statusText.textContent = "Previewing (CORS-restricted or offline)";
      if (metaBadge) metaBadge.textContent = "EXTERNAL IMAGE";
      if (statusPill) statusPill.className = "wallpaper-status-pill";
    };
    img.src = sanitized;
  }

  function commitWallpaperApply(urlOverride, dimOverride, blurOverride) {
    const input = document.getElementById("wallpaperUrlInput");
    const dimSlider = document.getElementById("wallpaperTuneDimSlider");
    const blurSlider = document.getElementById("wallpaperTuneBlurSlider");

    const rawUrl = urlOverride !== undefined ? urlOverride : (input ? input.value : "");
    const normUrl = normalizeImageUrl(rawUrl);

    if (!normUrl || !normUrl.trim()) {
      if (typeof showToast === "function") {
        showToast(pkIcon("zap", 18), "No Image URL", "Please enter an image URL or choose a preset.");
      }
      return;
    }

    if (!isSafeImageUrl(normUrl)) {
      if (typeof showToast === "function") {
        showToast(pkIcon("zap", 18), "Invalid Image URL", "Only HTTP, HTTPS, and safe local assets are permitted.");
      } else {
        alert("Invalid image URL. Only HTTP and HTTPS URLs are permitted.");
      }
      return;
    }

    const cleanUrl = normUrl.trim();
    const finalDim = dimOverride !== undefined ? dimOverride : (dimSlider ? parseInt(dimSlider.value, 10) || 65 : 65);
    const finalBlur = blurOverride !== undefined ? blurOverride : (blurSlider ? parseInt(blurSlider.value, 10) || 0 : 0);

    safeSet(WALLPAPER_KEY, cleanUrl);
    safeSet("khmerCustomWallpaperUrl", cleanUrl);
    safeSet(WALLPAPER_DIM_KEY, String(finalDim));
    safeSet(LS.wallpaperBlur, String(finalBlur));

    applyWallpaper(cleanUrl, finalDim);
    applyWallpaperBlur(finalBlur);

    closeWallpaperUrlModal();

    if (typeof showToast === "function") {
      showToast(pkIcon("check", 18), "Wallpaper Applied", "Custom studio backdrop is now live.");
    }
  }

  function openWallpaperUrlModal() {
    const modal = document.getElementById("wallpaperUrlModal");
    if (!modal) return;

    renderWallpaperGallery();

    const input = document.getElementById("wallpaperUrlInput");
    const clearBtn = document.getElementById("wallpaperClearUrlBtn");
    const dimSlider = document.getElementById("wallpaperTuneDimSlider");
    const dimVal = document.getElementById("wallpaperTuneDimVal");
    const blurSlider = document.getElementById("wallpaperTuneBlurSlider");
    const blurVal = document.getElementById("wallpaperTuneBlurVal");

    const curDim = parseInt(safeGet(WALLPAPER_DIM_KEY, "65"), 10) || 65;
    const curBlur = parseInt(safeGet(LS.wallpaperBlur, "0"), 10) || 0;

    if (dimSlider) dimSlider.value = curDim;
    if (dimVal) dimVal.textContent = curDim + "%";
    if (blurSlider) blurSlider.value = curBlur;
    if (blurVal) blurVal.textContent = curBlur + "px";

    const currentWp = safeGet("khmerCustomWallpaperUrl", "") || safeGet(WALLPAPER_KEY, "");
    if (input) {
      if (currentWp.startsWith("data:")) {
        input.value = "";
        input.placeholder = "Active: Uploaded local artwork";
      } else {
        input.value = currentWp;
        input.placeholder = "https://images.unsplash.com/... or paste image URL";
      }
      if (clearBtn) clearBtn.style.display = input.value ? "inline-flex" : "none";
    }

    updateWallpaperStagePreview(currentWp.startsWith("data:") ? currentWp : (input ? input.value : ""));

    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("visible"));
  }

  function closeWallpaperUrlModal() {
    const modal = document.getElementById("wallpaperUrlModal");
    if (!modal) return;
    if (typeof window.closeModalAnimated === "function") {
      window.closeModalAnimated(modal);
    } else {
      modal.classList.remove("visible");
      modal.hidden = true;
    }
  }

  if (typeof window !== "undefined") {
    window.openWallpaperUrlModal = openWallpaperUrlModal;
    window.closeWallpaperUrlModal = closeWallpaperUrlModal;
  }

  if (urlWallpaperBtn) {
    urlWallpaperBtn.addEventListener("click", openWallpaperUrlModal);
  }
  const wpModalCloseBtn = document.getElementById("wallpaperModalCloseBtn");
  if (wpModalCloseBtn) wpModalCloseBtn.addEventListener("click", closeWallpaperUrlModal);
  const wpModalCancelBtn = document.getElementById("wallpaperModalCancelBtn");
  if (wpModalCancelBtn) wpModalCancelBtn.addEventListener("click", closeWallpaperUrlModal);

  const wpModal = document.getElementById("wallpaperUrlModal");
  if (wpModal) {
    wpModal.addEventListener("click", (e) => {
      if (e.target === wpModal) closeWallpaperUrlModal();
    });
  }

  const wpUrlInput = document.getElementById("wallpaperUrlInput");
  const wpClearBtn = document.getElementById("wallpaperClearUrlBtn");
  const wpPasteBtn = document.getElementById("wallpaperPasteBtn");
  const wpApplyBtn = document.getElementById("wallpaperApplyBtn");
  const wpModalApplyBtn = document.getElementById("wallpaperModalApplyBtn");

  if (wpUrlInput) {
    wpUrlInput.addEventListener("input", () => {
      if (wpClearBtn) wpClearBtn.style.display = wpUrlInput.value ? "inline-flex" : "none";
      clearTimeout(wpPreviewDebounceTimer);
      wpPreviewDebounceTimer = setTimeout(() => {
        updateWallpaperStagePreview(wpUrlInput.value);
      }, 250);
    });
    wpUrlInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        commitWallpaperApply();
      }
    });
  }

  if (wpPasteBtn && wpUrlInput) {
    wpPasteBtn.addEventListener("click", async () => {
      try {
        if (navigator.clipboard && typeof navigator.clipboard.readText === "function") {
          const text = await navigator.clipboard.readText();
          if (text && text.trim()) {
            wpUrlInput.value = text.trim();
            if (wpClearBtn) wpClearBtn.style.display = "inline-flex";
            updateWallpaperStagePreview(text.trim());
          }
        }
      } catch (_clipErr) {
        wpUrlInput.focus();
      }
    });
  }

  if (wpClearBtn && wpUrlInput) {
    wpClearBtn.addEventListener("click", () => {
      wpUrlInput.value = "";
      wpClearBtn.style.display = "none";
      updateWallpaperStagePreview("");
      wpUrlInput.focus();
    });
  }

  if (wpApplyBtn) wpApplyBtn.addEventListener("click", () => commitWallpaperApply());
  if (wpModalApplyBtn) wpModalApplyBtn.addEventListener("click", () => commitWallpaperApply());

  const wpTuneDimSlider = document.getElementById("wallpaperTuneDimSlider");
  const wpTuneDimVal = document.getElementById("wallpaperTuneDimVal");
  if (wpTuneDimSlider) {
    wpTuneDimSlider.addEventListener("input", () => {
      const val = parseInt(wpTuneDimSlider.value, 10) || 65;
      if (wpTuneDimVal) wpTuneDimVal.textContent = val + "%";
      const previewDim = document.getElementById("wallpaperPreviewDim");
      if (previewDim) previewDim.style.background = "rgba(5, 7, 13, " + (val / 100) + ")";
    });
  }

  const wpTuneBlurSlider = document.getElementById("wallpaperTuneBlurSlider");
  const wpTuneBlurVal = document.getElementById("wallpaperTuneBlurVal");
  if (wpTuneBlurSlider) {
    wpTuneBlurSlider.addEventListener("input", () => {
      const val = parseInt(wpTuneBlurSlider.value, 10) || 0;
      if (wpTuneBlurVal) wpTuneBlurVal.textContent = val + "px";
      const previewBg = document.getElementById("wallpaperPreviewBg");
      if (previewBg) previewBg.style.filter = val > 0 ? `blur(${val}px)` : "";
    });
  }

  const wpTuneResetBtn = document.getElementById("wallpaperTuneResetBtn");
  if (wpTuneResetBtn) {
    wpTuneResetBtn.addEventListener("click", () => {
      if (wpTuneDimSlider) wpTuneDimSlider.value = 65;
      if (wpTuneDimVal) wpTuneDimVal.textContent = "65%";
      if (wpTuneBlurSlider) wpTuneBlurSlider.value = 0;
      if (wpTuneBlurVal) wpTuneBlurVal.textContent = "0px";
      const previewDim = document.getElementById("wallpaperPreviewDim");
      if (previewDim) previewDim.style.background = "rgba(5, 7, 13, 0.65)";
      const previewBg = document.getElementById("wallpaperPreviewBg");
      if (previewBg) previewBg.style.filter = "";
    });
  }

  // Modal Direct File Upload & Reset Handlers
  const modalUploadBtn = document.getElementById("modalUploadWallpaperBtn");
  const modalFileInput = document.getElementById("modalWallpaperFileInput");
  if (modalUploadBtn && modalFileInput) {
    modalUploadBtn.addEventListener("click", () => modalFileInput.click());
    modalFileInput.addEventListener("change", () => {
      const file = modalFileInput.files && modalFileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1920;
          let w = img.width, h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
            else { w = Math.round((w * maxDim) / h); h = maxDim; }
          }
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          const input = document.getElementById("wallpaperUrlInput");
          if (input) {
            input.value = dataUrl;
            const clearBtn = document.getElementById("wallpaperClearUrlBtn");
            if (clearBtn) clearBtn.style.display = "inline-flex";
          }
          updateWallpaperStagePreview(dataUrl);
          const dimSlider = document.getElementById("wallpaperTuneDimSlider");
          const blurSlider = document.getElementById("wallpaperTuneBlurSlider");
          const finalDim = dimSlider ? parseInt(dimSlider.value, 10) || 65 : 65;
          const finalBlur = blurSlider ? parseInt(blurSlider.value, 10) || 0 : 0;
          commitWallpaperApply(dataUrl, finalDim, finalBlur);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  const modalResetBtn = document.getElementById("wallpaperModalResetBtn");
  if (modalResetBtn) {
    modalResetBtn.addEventListener("click", () => {
      removeWallpaper();
      closeWallpaperUrlModal();
    });
  }

  if (removeWallpaperBtn) removeWallpaperBtn.addEventListener("click", removeWallpaper);
  if (wallpaperDimSlider) {
    wallpaperDimSlider.addEventListener("input", () => {
      const val = parseInt(wallpaperDimSlider.value, 10) || 65;
      document.documentElement.style.setProperty("--wallpaper-dim", (val / 100).toString());
      if (wallpaperDimValue) wallpaperDimValue.textContent = val + "%";
      safeSet(WALLPAPER_DIM_KEY, String(val));
    });
  }

  const savedWallpaper = safeGet(WALLPAPER_KEY, null) || safeGet("khmerCustomWallpaperUrl", null);
  if (savedWallpaper) {
    applyWallpaper(savedWallpaper, parseInt(safeGet(WALLPAPER_DIM_KEY, "65"), 10));
  } else if (window.PKCloudSync && typeof window.PKCloudSync.getLocalFileCache === "function") {
    window.PKCloudSync.getLocalFileCache("custom_wallpaper").then((cached) => {
      if (cached && cached.dataUrl) {
        applyWallpaper(cached.dataUrl, parseInt(safeGet(WALLPAPER_DIM_KEY, "65"), 10));
      }
    }).catch(() => {});
  }

  window.addEventListener("pkCloudSettingsApplied", async () => {
    window.__isApplyingCloudSettings = true;
    try {
      applyTheme(safeGet(LS.theme, "dark"), false);
      applyAccent(safeGet(LS.accent, "gold"));
      applyKhmerFont(safeGet(LS.khmerFont, "kantumruy"));
      applyWallpaperBlur(safeGet(LS.wallpaperBlur, "0"));
      applyBorderRadius(safeGet(LS.borderRadius, "9"), false);
      applyHandsOpacity(safeGet(LS.handsOpacity, "44"));
      if (window.PKHandsColor) {
        const res = window.PKHandsColor.applyHandColors();
        syncHandColorUI(res.preset, res.l, res.r);
      }
      const wpUrl = safeGet("khmerCustomWallpaperUrl", "");
      const wpFileId = safeGet("khmerCustomWallpaperFileId", "");
      if (wpUrl) {
        applyWallpaper(wpUrl, parseInt(safeGet(WALLPAPER_DIM_KEY, "65"), 10));
      } else if (wpFileId && window.PKCloudSync && typeof window.PKCloudSync.downloadUserFile === "function") {
        try {
          const dl = await window.PKCloudSync.downloadUserFile(wpFileId);
          if (dl && dl.blob) {
            const reader = new FileReader();
            reader.onload = () => {
              const dUrl = reader.result;
              if (typeof dUrl === "string") {
                try { localStorage.setItem(WALLPAPER_KEY, dUrl); } catch (_e) {}
                if (window.PKCloudSync && typeof window.PKCloudSync.saveLocalFileCache === "function") {
                  window.PKCloudSync.saveLocalFileCache("custom_wallpaper", { dataUrl: dUrl, mimeType: dl.metadata.mime_type || "image/jpeg" });
                }
                applyWallpaper(dUrl, parseInt(safeGet(WALLPAPER_DIM_KEY, "65"), 10));
              }
            };
            reader.readAsDataURL(dl.blob);
          }
        } catch (_dlErr) {}
      }
    } finally {
      window.__isApplyingCloudSettings = false;
    }
  });

  /* ---------- 4. 3D Hands, Keyboard & Smart Mouse Cursor ---------- */
  const handsOpacitySlider = document.getElementById("handsOpacitySlider");
  const handsOpacityValue = document.getElementById("handsOpacityValue");
  function applyHandsOpacity(pct) {
    pct = Math.max(15, Math.min(100, parseInt(pct, 10) || 44));
    document.documentElement.style.setProperty("--hands-opacity", (pct / 100).toFixed(2));
    const overlayEl = document.getElementById("handsOverlay");
    if (overlayEl) overlayEl.style.removeProperty("opacity");
    if (handsOpacitySlider) handsOpacitySlider.value = pct;
    if (handsOpacityValue) handsOpacityValue.textContent = pct + "%";
    safeSet(LS.handsOpacity, String(pct));
  }
  if (handsOpacitySlider) {
    handsOpacitySlider.addEventListener("input", () => applyHandsOpacity(handsOpacitySlider.value));
  }
  applyHandsOpacity(safeGet(LS.handsOpacity, "44"));

  /* --- 3D Hand Color Scheme & Custom Pickers --- */
  const handColorChoice = document.getElementById("handColorChoice");
  const handCustomPickers = document.getElementById("handCustomPickers");
  const handColorPickerL = document.getElementById("handColorPickerL");
  const handColorPickerR = document.getElementById("handColorPickerR");
  const handPickerDotL = document.getElementById("handPickerDotL");
  const handPickerDotR = document.getElementById("handPickerDotR");
  const handColorHexL = document.getElementById("handColorHexL");
  const handColorHexR = document.getElementById("handColorHexR");
  const handCustomSwatchL = document.getElementById("handCustomSwatchL");
  const handCustomSwatchR = document.getElementById("handCustomSwatchR");
  const quickSwatchL = document.getElementById("quickSwatchL");
  const quickSwatchR = document.getElementById("quickSwatchR");
  const handsColorQuickBtn = document.getElementById("handsColorQuickBtn");

  function showHandColorToast(name) {
    const stack = document.getElementById("toastStack");
    if (!stack) return;
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `<span class="toast-icon">${typeof pkIcon === 'function' ? pkIcon('palette', 18) : ''}</span><div><div class="toast-title">Hand Colors</div><div class="toast-sub">${name}</div></div>`;
    stack.appendChild(t);
    setTimeout(() => t.classList.add("visible"), 20);
    setTimeout(() => {
      t.classList.remove("visible");
      setTimeout(() => t.remove(), 400);
    }, 2200);
  }

  function syncHandColorUI(preset, customL, customR) {
    preset = preset || safeGet(LS.handColorPreset, "cyber");
    customL = customL || safeGet(LS.handColorCustomL, "#38bdf8");
    customR = customR || safeGet(LS.handColorCustomR, "#f472b6");

    if (handColorChoice) {
      handColorChoice.querySelectorAll("button[data-hand-color]").forEach(b => {
        b.classList.toggle("active", b.dataset.handColor === preset);
      });
    }
    if (handCustomPickers) {
      handCustomPickers.hidden = preset !== "custom";
    }
    if (handColorPickerL) handColorPickerL.value = customL;
    if (handColorPickerR) handColorPickerR.value = customR;
    if (handPickerDotL) handPickerDotL.style.background = customL;
    if (handPickerDotR) handPickerDotR.style.background = customR;
    if (handColorHexL) handColorHexL.textContent = customL;
    if (handColorHexR) handColorHexR.textContent = customR;
    if (handCustomSwatchL) handCustomSwatchL.style.background = customL;
    if (handCustomSwatchR) handCustomSwatchR.style.background = customR;

    const curHexL = getComputedStyle(document.documentElement).getPropertyValue("--hand-l-hex").trim() || customL;
    const curHexR = getComputedStyle(document.documentElement).getPropertyValue("--hand-r-hex").trim() || customR;
    if (quickSwatchL) quickSwatchL.style.background = curHexL;
    if (quickSwatchR) quickSwatchR.style.background = curHexR;
  }

  if (handColorChoice) {
    handColorChoice.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-hand-color]");
      if (!btn) return;
      const preset = btn.dataset.handColor;
      if (window.PKHandsColor) {
        const valL = handColorPickerL ? handColorPickerL.value : null;
        const valR = handColorPickerR ? handColorPickerR.value : null;
        const res = window.PKHandsColor.applyHandColors(preset, valL, valR);
        syncHandColorUI(res.preset, res.l, res.r);
        const name = (window.PKHandsColor.PRESETS[res.preset] && window.PKHandsColor.PRESETS[res.preset].name) || res.preset;
        showHandColorToast(name);
      }
    });
  }

  function handleCustomColorInput() {
    const valL = handColorPickerL ? handColorPickerL.value : "#38bdf8";
    const valR = handColorPickerR ? handColorPickerR.value : "#f472b6";
    if (window.PKHandsColor) {
      window.PKHandsColor.applyHandColors("custom", valL, valR);
    }
    syncHandColorUI("custom", valL, valR);
  }

  if (handColorPickerL) handColorPickerL.addEventListener("input", handleCustomColorInput);
  if (handColorPickerR) handColorPickerR.addEventListener("input", handleCustomColorInput);

  if (handsColorQuickBtn) {
    handsColorQuickBtn.addEventListener("click", () => {
      if (window.PKHandsColor) {
        const res = window.PKHandsColor.cycleNextPreset();
        syncHandColorUI(res.preset, res.l, res.r);
        const name = (window.PKHandsColor.PRESETS[res.preset] && window.PKHandsColor.PRESETS[res.preset].name) || res.preset;
        showHandColorToast(name);
      }
    });
  }

  document.addEventListener("pk-hand-colors-changed", (e) => {
    const d = e.detail || {};
    syncHandColorUI(d.preset, d.l, d.r);
  });

  setTimeout(() => {
    if (window.PKHandsColor) {
      const res = window.PKHandsColor.applyHandColors();
      syncHandColorUI(res.preset, res.l, res.r);
    } else {
      syncHandColorUI();
    }
  }, 60);

  // Smooth Interactive Cursor Toggle
  const settingsSmoothCursorToggle = document.getElementById("settingsSmoothCursorToggle");
  function applySmoothCursor(on) {
    if (window.PK_SMOOTH_CURSOR && typeof window.PK_SMOOTH_CURSOR.setEnabled === "function") {
      window.PK_SMOOTH_CURSOR.setEnabled(on);
    } else {
      safeSet("khmerSmoothCursor", on ? "1" : "0");
    }
    setSwitchUI(settingsSmoothCursorToggle, on);
  }
  bindSwitch(settingsSmoothCursorToggle, applySmoothCursor);
  setSwitchUI(settingsSmoothCursorToggle, safeGet("khmerSmoothCursor", "1") !== "0");

  // Cursor Theme Color Choice
  const cursorColorBtns = document.querySelectorAll("#cursorColorChoice button");
  function applyCursorColor(colorName) {
    const valid = colorName || "theme";
    if (window.PK_SMOOTH_CURSOR && typeof window.PK_SMOOTH_CURSOR.setColor === "function") {
      window.PK_SMOOTH_CURSOR.setColor(valid);
    }
    cursorColorBtns.forEach((b) => {
      const isAct = b.dataset.cursorColor === valid;
      b.classList.toggle("active", isAct);
      b.setAttribute("aria-pressed", isAct ? "true" : "false");
    });
    safeSet("khmerCursorColor", valid);
  }
  cursorColorBtns.forEach((b) => {
    b.addEventListener("click", () => {
      applyCursorColor(b.dataset.cursorColor);
      if (typeof soundOn !== "undefined" && soundOn && typeof playClick === "function") playClick("down");
    });
  });
  applyCursorColor(safeGet("khmerCursorColor", "theme"));

  // Smart Mouse Cursor Inspector toggle
  const settingsMouseInspectorToggle = document.getElementById("settingsMouseInspectorToggle");
  function applyMouseInspector(on) {
    if (window.PKCursorInspector && typeof window.PKCursorInspector.setEnabled === "function") {
      window.PKCursorInspector.setEnabled(on);
    } else {
      safeSet("khmerCursorInspector", on ? "1" : "0");
    }
    setSwitchUI(settingsMouseInspectorToggle, on);
  }
  bindSwitch(settingsMouseInspectorToggle, applyMouseInspector);
  setSwitchUI(settingsMouseInspectorToggle, safeGet("khmerCursorInspector", "1") !== "0");

  // Precision Cursor Reticle (Permanently disabled per user preference)
  const settingsReticleToggle = document.getElementById("settingsReticleToggle");
  function applyReticle(_on) {
    document.documentElement.classList.add("hide-cursor-reticle");
    if (settingsReticleToggle) setSwitchUI(settingsReticleToggle, false);
    safeSet(LS.reticle, "0");
  }
  if (settingsReticleToggle) bindSwitch(settingsReticleToggle, applyReticle);
  applyReticle(false);

  // Mouse Click Shockwaves
  const settingsShockwaveToggle = document.getElementById("settingsShockwaveToggle");
  function applyShockwave(on) {
    document.documentElement.classList.toggle("hide-cursor-shockwave", !on);
    setSwitchUI(settingsShockwaveToggle, on);
    safeSet(LS.shockwave, on ? "1" : "0");
  }
  bindSwitch(settingsShockwaveToggle, applyShockwave);
  applyShockwave(safeGet(LS.shockwave, "1") === "1");

  // Hover Layer Auto-Preview
  const settingsLayerHoverToggle = document.getElementById("settingsLayerHoverToggle");
  function applyLayerHover(on) {
    window.PKDisableLayerHover = !on;
    setSwitchUI(settingsLayerHoverToggle, on);
    safeSet(LS.layerHover, on ? "1" : "0");
  }
  bindSwitch(settingsLayerHoverToggle, applyLayerHover);
  applyLayerHover(safeGet(LS.layerHover, "1") === "1");

  // Shift-key corner preview
  const shiftPreviewToggle = document.getElementById("shiftPreviewToggle");
  function applyShiftPreview(on) {
    document.documentElement.classList.toggle("hide-shift-badges", !on);
    setSwitchUI(shiftPreviewToggle, on);
    safeSet(LS.shiftPreview, on ? "1" : "0");
  }
  bindSwitch(shiftPreviewToggle, applyShiftPreview);
  applyShiftPreview(safeGet(LS.shiftPreview, "1") === "1");

  // Highlight Next Target Key
  const keyHighlightToggle = document.getElementById("keyHighlightToggle");
  function applyKeyHighlight(on) {
    document.documentElement.classList.toggle("hide-key-highlight", !on);
    setSwitchUI(keyHighlightToggle, on);
    safeSet(LS.keyHighlight, on ? "1" : "0");
  }
  bindSwitch(keyHighlightToggle, applyKeyHighlight);
  applyKeyHighlight(safeGet(LS.keyHighlight, "1") === "1");

  // Compact Keyboard Proportions
  const compactKeysToggle = document.getElementById("compactKeysToggle");
  function applyCompactKeys(on) {
    document.documentElement.classList.toggle("compact-keys", on);
    setSwitchUI(compactKeysToggle, on);
    safeSet(LS.compactKeys, on ? "1" : "0");
    setTimeout(healBothHandsOverlay, 50);
  }
  bindSwitch(compactKeysToggle, applyCompactKeys);
  applyCompactKeys(safeGet(LS.compactKeys, "0") === "1");

  // Key Press Spark Effects
  const keyFxToggle = document.getElementById("keyFxToggle");
  function applyKeyFx(on) {
    document.documentElement.classList.toggle("hide-key-fx", !on);
    setSwitchUI(keyFxToggle, on);
    safeSet(LS.keyFx, on ? "1" : "0");
  }
  bindSwitch(keyFxToggle, applyKeyFx);
  applyKeyFx(safeGet(LS.keyFx, "1") === "1");

  /* ---------- 5. Sound & Mechanical Audio Engine Controls ---------- */
  const switchBtns = document.querySelectorAll("#switchProfileChoice button");
  function applySwitchProfile(profile, audition) {
    switchProfile = profile || "brown";
    switchBtns.forEach((b) => b.classList.toggle("active", b.dataset.switch === switchProfile));
    safeSet(LS.switchProfile, switchProfile);
    if (audition) {
      if (!soundOn) {
        soundOn = true;
        safeSet(LS.sound, "1");
        if (typeof soundToggle !== "undefined" && soundToggle) {
          soundToggle.classList.add("on");
          soundToggle.innerHTML = pkIcon("volume", 15) + " Key sound";
        }
        if (typeof syncSettingsMirrors === "function") syncSettingsMirrors();
      }
      playClick("down");
    }
  }
  switchBtns.forEach((b) => b.addEventListener("click", () => applySwitchProfile(b.dataset.switch, true)));
  applySwitchProfile(safeGet(LS.switchProfile, "brown"), false);

  const soundVolumeSlider = document.getElementById("soundVolumeSlider");
  const soundVolumeValue = document.getElementById("soundVolumeValue");
  function applySoundVolume(pct) {
    soundVolumePct = Math.max(10, Math.min(100, parseInt(pct, 10) || 80));
    if (soundVolumeSlider) soundVolumeSlider.value = soundVolumePct;
    if (soundVolumeValue) soundVolumeValue.textContent = soundVolumePct + "%";
    safeSet(LS.soundVolume, String(soundVolumePct));
  }
  if (soundVolumeSlider) {
    soundVolumeSlider.addEventListener("input", () => applySoundVolume(soundVolumeSlider.value));
    soundVolumeSlider.addEventListener("change", () => { if (soundOn) playClick("down"); });
  }
  applySoundVolume(safeGet(LS.soundVolume, "80"));

  const settingsChimeToggle = document.getElementById("settingsChimeToggle");
  function applyChime(on) {
    chimeOn = !!on;
    setSwitchUI(settingsChimeToggle, chimeOn);
    safeSet(LS.chime, chimeOn ? "1" : "0");
    if (chimeOn && soundOn) playChime();
  }
  bindSwitch(settingsChimeToggle, (on) => applyChime(on));
  setSwitchUI(settingsChimeToggle, safeGet(LS.chime, "1") !== "0");

  const settingsAmbienceToggle = document.getElementById("settingsAmbienceToggle");
  bindSwitch(settingsAmbienceToggle, (on) => {
    ambienceOn = !!on;
    if (ambienceOn) startAmbience();
    else stopAmbience();
    syncAmbienceUI();
  });
  syncAmbienceUI();

  const ambienceVolumeSlider = document.getElementById("ambienceVolumeSlider");
  const ambienceVolumeValue = document.getElementById("ambienceVolumeValue");
  function applyAmbienceVolume(pct) {
    ambienceVolumePct = Math.max(10, Math.min(100, parseInt(pct, 10) || 50));
    if (ambienceVolumeSlider) ambienceVolumeSlider.value = ambienceVolumePct;
    if (ambienceVolumeValue) ambienceVolumeValue.textContent = ambienceVolumePct + "%";
    safeSet(LS.ambienceVolume, String(ambienceVolumePct));
    if (ambienceNodes && audioCtx) {
      ambienceNodes.master.gain.setTargetAtTime(0.08 * (ambienceVolumePct / 100), audioCtx.currentTime, 0.15);
    }
  }
  if (ambienceVolumeSlider) {
    ambienceVolumeSlider.addEventListener("input", () => applyAmbienceVolume(ambienceVolumeSlider.value));
  }
  applyAmbienceVolume(safeGet(LS.ambienceVolume, "50"));

  /* ---------- 6. Typing, Lessons & Practice Controls ---------- */
  const unlockAllLessonsToggle = document.getElementById("unlockAllLessonsToggle");
  function applyUnlockAllLessons(on) {
    setSwitchUI(unlockAllLessonsToggle, on);
    safeSet("pk_unlock_all_lessons", on ? "1" : "0");
    safeSet("khmerUnlockAll", on ? "1" : "0");
    if (typeof allLessonsUnlocked !== "undefined") {
      allLessonsUnlocked = !!on;
    }
    window.allLessonsUnlocked = !!on;
    if (typeof renderLessonStrip === "function") renderLessonStrip();
  }
  bindSwitch(unlockAllLessonsToggle, (on) => {
    applyUnlockAllLessons(on);
    if (typeof showToast === "function") {
      showToast(pkIcon("trophy", 18), on ? "All 77 Lessons Unlocked" : "Standard Progression Restored", on ? "Sandbox Mode active — jump to any lesson freely." : "Lessons unlock sequentially as you master them.");
    }
  });
  const initialUnlockAll = safeGet("khmerUnlockAll", safeGet("pk_unlock_all_lessons", "0")) === "1";
  setSwitchUI(unlockAllLessonsToggle, initialUnlockAll);

  const previewBonusVaultToggle = document.getElementById("previewBonusVaultToggle");
  function applyPreviewBonusVault(on) {
    setSwitchUI(previewBonusVaultToggle, on);
    safeSet("khmerUnlock222Vault", on ? "1" : "0");
    if (typeof renderLessonStrip === "function") renderLessonStrip();
    if (typeof window.renderHubVault === "function") window.renderHubVault();
  }
  bindSwitch(previewBonusVaultToggle, (on) => {
    applyPreviewBonusVault(on);
    if (typeof showToast === "function") {
      showToast(pkIcon("trophy", 18), on ? "Grandmaster Vault Preview Active" : "Base Lesson Prerequisite Restored", on ? "All 54 bonus drills unlocked for preview & testing." : "Bonus drills require completing all 222 base lessons.");
    }
  });
  const initialPreviewBonusVault = safeGet("khmerUnlock222Vault", "0") === "1";
  setSwitchUI(previewBonusVaultToggle, initialPreviewBonusVault);

  const strictModeToggle = document.getElementById("strictModeToggle");
  function applyStrictMode(on) {
    window.PKStrictMistakeMode = !!on;
    setSwitchUI(strictModeToggle, on);
    safeSet(LS.strictMode, on ? "1" : "0");
  }
  bindSwitch(strictModeToggle, applyStrictMode);
  applyStrictMode(safeGet(LS.strictMode, "1") === "1");

  const autoAdvanceToggle = document.getElementById("autoAdvanceToggle");
  function applyAutoAdvance(on) {
    window.PKAutoAdvanceExercise = !!on;
    setSwitchUI(autoAdvanceToggle, on);
    safeSet(LS.autoAdvance, on ? "1" : "0");
  }
  bindSwitch(autoAdvanceToggle, applyAutoAdvance);
  applyAutoAdvance(safeGet(LS.autoAdvance, "1") === "1");

  const liveStatsHudToggle = document.getElementById("liveStatsHudToggle");
  function applyLiveStatsHud(on) {
    document.documentElement.classList.toggle("hide-live-stats", !on);
    setSwitchUI(liveStatsHudToggle, on);
    safeSet(LS.liveStatsHud, on ? "1" : "0");
  }
  bindSwitch(liveStatsHudToggle, applyLiveStatsHud);
  applyLiveStatsHud(safeGet(LS.liveStatsHud, "1") === "1");

  const targetWpmSlider = document.getElementById("targetWpmSlider");
  const targetWpmValue = document.getElementById("targetWpmValue");
  function applyTargetWpm(wpm) {
    wpm = Math.max(15, Math.min(120, parseInt(wpm, 10) || 40));
    window.PKTargetWpmGoal = wpm;
    if (targetWpmSlider) targetWpmSlider.value = wpm;
    if (targetWpmValue) targetWpmValue.textContent = wpm + " WPM";
    safeSet(LS.targetWpm, String(wpm));
  }
  if (targetWpmSlider) {
    targetWpmSlider.addEventListener("input", () => applyTargetWpm(targetWpmSlider.value));
  }
  applyTargetWpm(safeGet(LS.targetWpm, "40"));

  /* ---------- 7. Immersion, Atmosphere & Accessibility ---------- */
  const sideDocksToggle = document.getElementById("sideDocksToggle");
  function applySideDocks(on) {
    document.documentElement.classList.toggle("hide-side-docks", !on);
    setSwitchUI(sideDocksToggle, on);
    safeSet(LS.sideDocks, on ? "1" : "0");
  }
  bindSwitch(sideDocksToggle, applySideDocks);
  applySideDocks(safeGet(LS.sideDocks, "1") === "1");

  const motesToggle = document.getElementById("motesToggle");
  function applyMotes(on) {
    document.documentElement.classList.toggle("hide-motes", !on);
    setSwitchUI(motesToggle, on);
    safeSet(LS.motes, on ? "1" : "0");
  }
  bindSwitch(motesToggle, applyMotes);
  applyMotes(safeGet(LS.motes, "0") === "1");

  const torchesToggle = document.getElementById("torchesToggle");
  function applyTorches(on) {
    document.documentElement.classList.toggle("hide-torches", !on);
    setSwitchUI(torchesToggle, on);
    safeSet(LS.torches, on ? "1" : "0");
  }
  bindSwitch(torchesToggle, applyTorches);
  applyTorches(safeGet(LS.torches, "0") === "1");

  const scanlinesToggle = document.getElementById("scanlinesToggle");
  function applyScanlines(on) {
    document.documentElement.classList.toggle("scanlines-on", on);
    setSwitchUI(scanlinesToggle, on);
    safeSet(LS.scanlines, on ? "1" : "0");
  }
  bindSwitch(scanlinesToggle, applyScanlines);
  applyScanlines(safeGet(LS.scanlines, "0") === "1");

  const performanceModeToggle = document.getElementById("performanceModeToggle");
  const reducedMotionToggle = document.getElementById("reducedMotionToggle");

  function applyPerformanceMode(on, save = true) {
    const isPerf = !!on;
    document.documentElement.classList.toggle("performance-mode", isPerf);
    document.documentElement.classList.toggle("anim-mode-off", isPerf);
    document.documentElement.classList.toggle("reduce-motion", isPerf);
    document.documentElement.classList.toggle("reduced-motion", isPerf);
    document.documentElement.classList.toggle("motion-override", true);

    if (isPerf) {
      document.documentElement.classList.remove("anim-mode-full", "anim-mode-minimal");
      document.documentElement.classList.add("hide-key-fx", "hide-motes", "hide-cursor-shockwave");

      // Cancel any active animation frame on canvas and wipe buffer
      if (typeof window.cancelAnimationFrame === "function" && window.fxAnimId) {
        window.cancelAnimationFrame(window.fxAnimId);
        window.fxAnimId = null;
      }
      const canvas = document.getElementById("fxCanvas");
      if (canvas && canvas.getContext) {
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      // Remove motes children to eliminate running CSS animations
      const motesEl = document.getElementById("motes");
      if (motesEl) motesEl.innerHTML = "";
    } else {
      document.documentElement.classList.remove("anim-mode-off", "anim-mode-minimal");
      document.documentElement.classList.add("anim-mode-full");
      document.documentElement.classList.toggle("hide-key-fx", safeGet(LS.keyFx, "1") !== "1");
      document.documentElement.classList.toggle("hide-motes", safeGet(LS.motes, "0") !== "1");
      document.documentElement.classList.toggle("hide-cursor-shockwave", safeGet(LS.shockwave, "1") !== "1");
    }

    if (performanceModeToggle) setSwitchUI(performanceModeToggle, isPerf);
    if (reducedMotionToggle) setSwitchUI(reducedMotionToggle, isPerf);

    document.querySelectorAll("#animationModeChoice button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.animMode === (isPerf ? "off" : "full"));
    });

    window.__PERFORMANCE_MODE = isPerf;
    window.__ANIMATION_MODE = isPerf ? "off" : "full";

    if (save) {
      safeSet(LS.performanceMode, isPerf ? "1" : "0");
      safeSet(LS.reducedMotion, isPerf ? "1" : "0");
      safeSet(LS.animationMode, isPerf ? "off" : "full");
    }
  }
  window.applyPerformanceMode = applyPerformanceMode;

  function applyAnimationMode(mode, save = true) {
    if (mode === "off") {
      applyPerformanceMode(true, save);
      return;
    }
    if (mode === "full") {
      applyPerformanceMode(false, save);
      return;
    }
    // mode === "minimal"
    document.documentElement.classList.remove("performance-mode", "anim-mode-off", "anim-mode-full", "reduce-motion", "reduced-motion");
    document.documentElement.classList.add("anim-mode-minimal", "hide-key-fx", "hide-motes", "hide-cursor-shockwave");

    // Cancel running canvas animation frame loops immediately to free GPU/CPU
    if (typeof window.cancelAnimationFrame === "function" && window.fxAnimId) {
      window.cancelAnimationFrame(window.fxAnimId);
      window.fxAnimId = null;
    }
    const canvas = document.getElementById("fxCanvas");
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    // Remove motes children to eliminate running CSS background animations
    const motesEl = document.getElementById("motes");
    if (motesEl) motesEl.innerHTML = "";

    if (performanceModeToggle) setSwitchUI(performanceModeToggle, false);
    if (reducedMotionToggle) setSwitchUI(reducedMotionToggle, false);
    document.querySelectorAll("#animationModeChoice button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.animMode === "minimal");
    });
    window.__PERFORMANCE_MODE = false;
    window.__ANIMATION_MODE = "minimal";
    if (save) {
      safeSet(LS.performanceMode, "0");
      safeSet(LS.reducedMotion, "0");
      safeSet(LS.animationMode, "minimal");
    }
  }
  window.applyAnimationMode = applyAnimationMode;

  bindSwitch(performanceModeToggle, (on) => applyPerformanceMode(on));
  if (reducedMotionToggle) bindSwitch(reducedMotionToggle, (on) => applyPerformanceMode(on));

  document.addEventListener("click", (e) => {
    const btn = e.target.closest && e.target.closest("#animationModeChoice button");
    if (btn && btn.dataset.animMode) {
      applyAnimationMode(btn.dataset.animMode);
    }
  });

  const initialPerf = safeGet(LS.performanceMode, null);
  const initialAnim = safeGet(LS.animationMode, null);
  const initialReduced = safeGet(LS.reducedMotion, null);

  let startPerf = false;
  if (initialPerf !== null) {
    startPerf = (initialPerf === "1");
  } else if (initialAnim !== null) {
    startPerf = (initialAnim === "off");
  } else if (initialReduced !== null) {
    startPerf = (initialReduced === "1");
  }

  if (startPerf) {
    applyPerformanceMode(true, false);
  } else if (initialAnim === "full") {
    applyPerformanceMode(false, false);
  } else {
    // Default for new visitors: Minimal mode (gentle animations without heavy particles)
    applyAnimationMode("minimal", false);
  }

  const highContrastToggle = document.getElementById("highContrastToggle");
  function applyHighContrast(on) {
    document.documentElement.classList.toggle("high-contrast", on);
    setSwitchUI(highContrastToggle, on);
    safeSet(LS.highContrast, on ? "1" : "0");
  }
  bindSwitch(highContrastToggle, applyHighContrast);
  applyHighContrast(safeGet(LS.highContrast, "0") === "1");

  const largeTextToggle = document.getElementById("largeTextToggle");
  function applyLargeText(on) {
    document.documentElement.classList.toggle("large-text", on);
    setSwitchUI(largeTextToggle, on);
    safeSet(LS.largeText, on ? "1" : "0");
  }
  bindSwitch(largeTextToggle, applyLargeText);
  applyLargeText(safeGet(LS.largeText, "0") === "1");

  const dyslexiaSpacingToggle = document.getElementById("dyslexiaSpacingToggle");
  function applyDyslexiaSpacing(on) {
    document.documentElement.classList.toggle("wide-prompt-spacing", on);
    setSwitchUI(dyslexiaSpacingToggle, on);
    safeSet(LS.dyslexiaSpacing, on ? "1" : "0");
  }
  bindSwitch(dyslexiaSpacingToggle, applyDyslexiaSpacing);
  applyDyslexiaSpacing(safeGet(LS.dyslexiaSpacing, "0") === "1");

  /* ---------- 8. Focus Mode ---------- */
  const focusModeToggle = document.getElementById("focusModeToggle");
  const focusModeBtn = document.getElementById("focusModeBtn");

  window.applyFocusMode = applyFocusMode;
  function applyFocusMode(on) {
    document.documentElement.classList.toggle("focus-mode", on);
    setSwitchUI(focusModeToggle, on);
    if (focusModeBtn) {
      focusModeBtn.classList.toggle("active", on);
      focusModeBtn.setAttribute("aria-pressed", String(on));
      const textSpan = focusModeBtn.querySelector(".focus-btn-text");
      const isKm = document.documentElement.classList.contains("site-km-mode");
      if (textSpan) {
        if (on) {
          textSpan.setAttribute("data-en", "Exit Focus");
          textSpan.setAttribute("data-km", "ចាកចេញពីផ្ដោត");
          textSpan.textContent = isKm ? "ចាកចេញពីផ្ដោត" : "Exit Focus";
        } else {
          textSpan.setAttribute("data-en", "Focus");
          textSpan.setAttribute("data-km", "ផ្ដោត");
          textSpan.textContent = isKm ? "ផ្ដោត" : "Focus";
        }
      }
    }
    if (on) {
      const ls = document.getElementById("lessonStrip");
      if (ls) ls.classList.remove("expanded");
    }
    requestAnimationFrame(() => {
      if (typeof window.updateHandsOverlay === "function") {
        window.updateHandsOverlay();
      } else if (typeof window.render === "function") {
        window.render();
      }
      window.dispatchEvent(new Event("resize"));
    });
    safeSet(LS.focusMode, on ? "1" : "0");
  }
  bindSwitch(focusModeToggle, applyFocusMode);

  if (focusModeBtn) {
    focusModeBtn.addEventListener("click", () => {
      const willBeOn = !document.documentElement.classList.contains("focus-mode");
      applyFocusMode(willBeOn);
      if (typeof showToast === "function") {
        if (willBeOn) showToast(pkIcon("zap", 18), "Focus Mode Active", "Distractions hidden. Press Esc or Alt+F anytime to exit.");
        else showToast(pkIcon("eye", 18), "Focus Mode Off", "Interface restored.");
      }
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.documentElement.classList.contains("focus-mode")) {
      const anyModalOpen = document.querySelector(".modal-backdrop:not([hidden])");
      if (!anyModalOpen) applyFocusMode(false);
    } else if (e.altKey && (e.key === "f" || e.key === "F")) {
      e.preventDefault();
      applyFocusMode(!document.documentElement.classList.contains("focus-mode"));
    }
  });
  applyFocusMode(safeGet(LS.focusMode, "0") === "1");

  /* ---------- 9. Mirror Sound & Finger-Guide Toggles ---------- */
  const settingsSoundToggle = document.getElementById("settingsSoundToggle");
  const settingsHandsToggle = document.getElementById("settingsHandsToggle");
  function syncSettingsMirrors() {
    if (settingsSoundToggle && typeof soundToggle !== "undefined" && soundToggle) {
      setSwitchUI(settingsSoundToggle, soundToggle.classList.contains("on"));
    }
    if (settingsHandsToggle && typeof handsToggle !== "undefined" && handsToggle) {
      setSwitchUI(settingsHandsToggle, handsToggle.classList.contains("on"));
    }
    if (settingsMouseInspectorToggle && window.PKCursorInspector && typeof window.PKCursorInspector.isEnabled === "function") {
      setSwitchUI(settingsMouseInspectorToggle, window.PKCursorInspector.isEnabled());
    }
    if (settingsSmoothCursorToggle && window.PK_SMOOTH_CURSOR && typeof window.PK_SMOOTH_CURSOR.isEnabled === "function") {
      setSwitchUI(settingsSmoothCursorToggle, window.PK_SMOOTH_CURSOR.isEnabled());
    }
    if (window.PK_SMOOTH_CURSOR && typeof window.PK_SMOOTH_CURSOR.getColor === "function") {
      const c = window.PK_SMOOTH_CURSOR.getColor();
      cursorColorBtns.forEach((b) => b.classList.toggle("active", b.dataset.cursorColor === c));
    }
    syncLayoutChoiceUI();
    syncLangChoiceUI();
    syncAmbienceUI();
  }
  if (settingsSoundToggle && typeof soundToggle !== "undefined" && soundToggle) {
    settingsSoundToggle.addEventListener("click", () => {
      soundToggle.click();
      syncSettingsMirrors();
    });
    soundToggle.addEventListener("click", syncSettingsMirrors);
  }
  if (settingsHandsToggle && typeof handsToggle !== "undefined" && handsToggle) {
    settingsHandsToggle.addEventListener("click", () => {
      handsToggle.click();
      syncSettingsMirrors();
    });
    handsToggle.addEventListener("click", syncSettingsMirrors);
  }
  syncSettingsMirrors();

  /* ---------- 10. One-Click Studio Presets ---------- */
  const presetBtns = document.querySelectorAll(".settings-preset-btn");
  function applyStudioPreset(presetName) {
    presetBtns.forEach((b) => b.classList.toggle("active", b.dataset.preset === presetName));
    if (presetName === "default") {
      applyBorderRadius(9);
      applyTheme("dark");
      applyAccent("gold");
      applyCursorColor("theme");
      applyKhmerFont("kantumruy");
      applyLargeText(false);
      applyCompactKeys(false);
      applyHandsOpacity(44);
      if (typeof handsToggle !== "undefined" && handsToggle && !handsToggle.classList.contains("on")) handsToggle.click();
      if (typeof soundToggle !== "undefined" && soundToggle && !soundToggle.classList.contains("on")) soundToggle.click();
      applySwitchProfile("brown", false);
      applySoundVolume(80);
      applySmoothCursor(true);
      applyMouseInspector(true);
      applyReticle(false);
      applyShockwave(true);
      applyLayerHover(true);
      applyShiftPreview(true);
      applyKeyHighlight(true);
      applyKeyFx(true);
      applySideDocks(true);
      applyMotes(true);
      applyTorches(true);
      applyScanlines(false);
      applyFocusMode(false);
      applyAnimationMode("full");
      applyHighContrast(false);
      applyDyslexiaSpacing(false);
    } else if (presetName === "pro") {
      applyBorderRadius(6);
      applyTheme("moonlight");
      applyAccent("cyan");
      applyCompactKeys(true);
      applyHandsOpacity(40);
      applySwitchProfile("red", true);
      applyAnimationMode("minimal");
      applyTorches(false);
      applyScanlines(false);
      applyReticle(false);
      applyShockwave(false);
      applyTargetWpm(75);
    } else if (presetName === "immersion") {
      applyBorderRadius(9);
      applyTheme("temple");
      applyAccent("gold");
      applyCompactKeys(false);
      applyHandsOpacity(90);
      if (typeof handsToggle !== "undefined" && handsToggle && !handsToggle.classList.contains("on")) handsToggle.click();
      if (typeof soundToggle !== "undefined" && soundToggle && !soundToggle.classList.contains("on")) soundToggle.click();
      applySwitchProfile("brown", true);
      applyAnimationMode("full");
      applyTorches(true);
      applyScanlines(true);
      applySmoothCursor(true);
      applyMouseInspector(true);
      applyReticle(false);
      applyShockwave(true);
      if (!ambienceOn) { ambienceOn = true; startAmbience(); syncAmbienceUI(); }
    } else if (presetName === "performance") {
      applyBorderRadius(6);
      applyAnimationMode("off");
      applyTorches(false);
      applyScanlines(false);
      applyReticle(false);
      applyShockwave(false);
      applySmoothCursor(false);
      if (ambienceOn) { ambienceOn = false; stopAmbience(); syncAmbienceUI(); }
    }
    syncSettingsMirrors();
    if (typeof showToast === "function") {
      const labels = { default: "Default Studio", pro: "Pro Typist", immersion: "Full Immersion", performance: "Battery Saver" };
      showToast(pkIcon("sliders", 18), (labels[presetName] || "Preset") + " Applied", "All studio preferences updated.");
    }
  }
  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => applyStudioPreset(btn.dataset.preset));
  });

  // Reset Default Settings button (keeps typing progress safe!)
  const resetPreferencesBtn = document.getElementById("resetPreferencesBtn");
  if (resetPreferencesBtn) {
    resetPreferencesBtn.addEventListener("click", async () => {
      const ok = await templeConfirm(
        "Reset all visual, audio, hand, and cursor settings back to their defaults? Your lesson progress and WPM records will NOT be deleted.",
        { title: "Reset Default Settings?", confirmLabel: "Reset Settings", cancelLabel: "Cancel" }
      );
      if (!ok) return;
      removeWallpaper();
      applyWallpaperBlur(0);
      applyUnlockAllLessons(false);
      applyStrictMode(true);
      applyAutoAdvance(true);
      applyLiveStatsHud(true);
      applyTargetWpm(40);
      if (window.PKHandsColor) {
        window.PKHandsColor.applyHandColors("cyber", "#38bdf8", "#f472b6");
      }
      applyStudioPreset("default");
    });
  }

  /* ---------- 11. Live Storage & Progress Overview Card ---------- */
  function updateSettingsStorageStats() {
    try {
      const keysEl = document.getElementById("settingsStatKeys");
      const masteredEl = document.getElementById("settingsStatMastered");
      const bestWpmEl = document.getElementById("settingsStatBestWpm");
      const storageEl = document.getElementById("settingsStatStorage");

      const statsRaw = JSON.parse(safeGet(LS.totals, "{}") || "{}");
      const lessonStatsRaw = JSON.parse(safeGet("khmerLessonStats", "{}") || "{}");
      const memLessonStats = (typeof window.savedLessonStats === "object" && window.savedLessonStats) ? window.savedLessonStats : {};

      let progressUnits = 0;
      let progressBestWpm = 0;
      const masteredSet = new Set();

      if (window.PK_PROGRESS && typeof window.PK_PROGRESS.exportData === "function") {
        const exp = window.PK_PROGRESS.exportData();
        const courses = (exp && exp.courses) || {};
        Object.values(courses).forEach((course) => {
          if (!course) return;
          progressUnits += Number(course.totalTypingUnits || 0);
          const lessonsObj = course.lessons || {};
          Object.entries(lessonsObj).forEach(([lid, rec]) => {
            if (!rec) return;
            if (Number(rec.bestWpm || 0) > progressBestWpm) {
              progressBestWpm = Number(rec.bestWpm || 0);
            }
            if (rec.masteryState === "mastered" || (rec.completed && Number(rec.bestAccuracy || 0) >= 85)) {
              masteredSet.add(String(lid));
            }
          });
        });
      }

      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i) || "";
        if (k.startsWith("khmerLessonBest_")) {
          const lid = k.replace("khmerLessonBest_", "");
          try {
            const b = JSON.parse(localStorage.getItem(k) || "null");
            if (b && (b.mastered || Number(b.accuracy || 0) >= 85)) {
              masteredSet.add(String(lid));
            }
          } catch (_) {}
        }
      }

      if (typeof LESSONS !== "undefined" && Array.isArray(LESSONS) && typeof getLessonBest === "function") {
        LESSONS.forEach((l) => {
          if (!l || !l.id) return;
          const b = getLessonBest(l.id);
          if (b && (b.mastered || Number(b.accuracy || 0) >= 85)) {
            masteredSet.add(String(l.id));
          }
        });
      }

      const totalKeys = Math.max(
        Number(statsRaw.keys || 0),
        Number(statsRaw.totalKeys || 0),
        Number(lessonStatsRaw.keys || 0),
        Number(memLessonStats.keys || 0),
        progressUnits
      );

      const bestWpm = Math.round(Math.max(
        Number(statsRaw.bestWpm || 0),
        Number(lessonStatsRaw.bestWpm || 0),
        Number(lessonStatsRaw.wpm || 0),
        Number(memLessonStats.bestWpm || 0),
        Number(memLessonStats.wpm || 0),
        progressBestWpm
      ));

      let totalLessonsCount = 77;
      if (typeof CURRICULUM_BUNDLE === "object" && CURRICULUM_BUNDLE) {
        let sum = 0;
        ["standard", "nida", "english"].forEach((cid) => {
          if (CURRICULUM_BUNDLE[cid] && Array.isArray(CURRICULUM_BUNDLE[cid].lessons)) {
            sum += CURRICULUM_BUNDLE[cid].lessons.length;
          }
        });
        if (sum > 0) totalLessonsCount = sum;
      }

      if (keysEl) keysEl.textContent = totalKeys.toLocaleString();
      if (bestWpmEl) bestWpmEl.textContent = bestWpm + " WPM";
      if (masteredEl) masteredEl.textContent = masteredSet.size + " / " + totalLessonsCount;

      let bytes = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i) || "";
        const v = localStorage.getItem(k) || "";
        bytes += (k.length + v.length) * 2;
      }
      if (storageEl) storageEl.textContent = Math.max(1, Math.round(bytes / 1024)) + " KB";
    } catch (e) {}
  }
  window.updateSettingsStorageStats = updateSettingsStorageStats;
  updateSettingsStorageStats();

  /* ---------- 12. Settings Modal Open / Close ---------- */
  const settingsModal = document.getElementById("settingsModal");
  const settingsOpenBtn = document.getElementById("settingsOpenBtn");
  const settingsCloseBtn = document.getElementById("settingsCloseBtn");
  const settingsDoneBtn = document.getElementById("settingsDoneBtn");

  function openSettingsModal() {
    syncSettingsMirrors();
    updateSettingsStorageStats();
    filterSettingsView();
    if (settingsModal) {
      settingsModal.hidden = false;
      if (typeof updateTabsScrollArrows === "function") {
        setTimeout(updateTabsScrollArrows, 50);
      }
      if (settingsCloseBtn) settingsCloseBtn.focus();
    }
  }
  function closeSettingsModal() {
    if (typeof window.closeModalAnimated === "function" && settingsModal) {
      window.closeModalAnimated(settingsModal);
    } else if (settingsModal) {
      settingsModal.hidden = true;
    }
  }

  if (settingsOpenBtn) settingsOpenBtn.addEventListener("click", openSettingsModal);
  if (settingsCloseBtn) settingsCloseBtn.addEventListener("click", closeSettingsModal);
  if (settingsDoneBtn) settingsDoneBtn.addEventListener("click", closeSettingsModal);
  if (settingsModal) {
    settingsModal.addEventListener("click", (e) => {
      if (e.target === settingsModal) closeSettingsModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (typeof statsModal !== "undefined" && statsModal) statsModal.hidden = true;
      closeSettingsModal();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSettingsToggles);
} else {
  initSettingsToggles();
}

/* ---------- Site Language I18N & Developer Note Modal ---------- */
(function () {
  var LANG_KEY = "kk_site_lang";
  function safeGetLang(k, fb) {
    try {
      var v = localStorage.getItem(k);
      return v === null ? fb : v;
    } catch (e) {
      return fb;
    }
  }
  function safeSetLang(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch (e) {}
  }

  var toggleBtn = document.getElementById("siteLangToggle");
  var toggleLabel = document.getElementById("siteLangToggleLabel");
  var topToggleBtn = document.getElementById("topLangToggleBtn");
  var topToggleLabel = document.getElementById("topLangToggleLabel");

  function applyLang(lang) {
    var isKm = lang === "km";
    document.documentElement.setAttribute("lang", isKm ? "km" : "en");
    document.documentElement.classList.toggle("site-km-mode", isKm);

    var nodes = document.querySelectorAll(".i18n-t");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var text = el.getAttribute(isKm ? "data-km" : "data-en");
      if (text !== null) {
        var svgChild = el.querySelector(":scope > svg");
        if (svgChild && text.indexOf("<svg") === -1) {
          var svgHtml = svgChild.outerHTML;
          el.innerHTML = svgHtml + " " + text;
        } else {
          el.innerHTML = text;
        }
      }
      if (isKm) {
        el.setAttribute("lang", "km");
      } else {
        el.removeAttribute("lang");
      }
    }

    var phNodes = document.querySelectorAll(".i18n-ph");
    for (var j = 0; j < phNodes.length; j++) {
      var phEl = phNodes[j];
      var phText = phEl.getAttribute(isKm ? "data-km" : "data-en");
      if (phText !== null) {
        phEl.setAttribute("placeholder", phText);
      }
    }

    if (toggleBtn) toggleBtn.setAttribute("aria-pressed", String(isKm));
    if (toggleLabel) toggleLabel.textContent = isKm ? "Translate back to English" : "Translate to Khmer";
    if (toggleBtn) toggleBtn.setAttribute("aria-label", isKm ? "Translate back to English" : "Translate site to Khmer");

    if (topToggleBtn) {
      topToggleBtn.setAttribute("aria-pressed", String(isKm));
      topToggleBtn.setAttribute("aria-label", isKm ? "Translate back to English" : "Translate English to Khmer");
      topToggleBtn.setAttribute("title", isKm ? "Translate back to English (Alt+L)" : "Translate English to Khmer (Alt+L)");
      topToggleBtn.classList.toggle("active", isKm);
    }
    if (topToggleLabel) {
      topToggleLabel.textContent = isKm ? "Translate to English" : "Translate to Khmer";
    }

    var badgeEn = document.getElementById("topLangBadgeEn");
    var badgeKm = document.getElementById("topLangBadgeKm");
    if (badgeEn) badgeEn.classList.toggle("active", !isKm);
    if (badgeKm) badgeKm.classList.toggle("active", isKm);

    var langChoiceBtns = document.querySelectorAll("#settingsLangChoice button");
    langChoiceBtns.forEach(function (b) {
      b.classList.toggle("active", b.dataset.langSet === (isKm ? "km" : "en"));
    });

    // Refresh dynamic UI components when language changes
    try {
      if (typeof syncLayoutUI === "function" && typeof currentLayoutId !== "undefined") {
        syncLayoutUI(currentLayoutId);
      }
      if (window.PKQuickGuide && typeof window.PKQuickGuide.refreshLang === "function") {
        window.PKQuickGuide.refreshLang();
      }
      if (window.PKCursorInspector && typeof window.PKCursorInspector.refreshLang === "function") {
        window.PKCursorInspector.refreshLang();
      }
      if (typeof renderLessonStrip === "function") {
        renderLessonStrip();
      }
      if (typeof renderLessonMeta === "function" && typeof activeLessonKey !== "undefined" && activeLessonKey && typeof LESSONS !== "undefined" && LESSONS[activeLessonKey]) {
        renderLessonMeta(LESSONS[activeLessonKey]);
      }
      if (window.PK_ADAPTIVE && typeof window.PK_ADAPTIVE.refreshLang === "function") {
        window.PK_ADAPTIVE.refreshLang();
      }
      if (typeof updateRaceSetupBest === "function") {
        updateRaceSetupBest();
      }
      if (typeof renderRaceLeaderboard === "function") {
        renderRaceLeaderboard();
      }
      if (typeof refreshProfileUI === "function") {
        refreshProfileUI();
      }
      if (typeof renderStats === "function" && typeof statsModal !== "undefined" && statsModal && !statsModal.hidden) {
        renderStats();
      }
      if (window.PK_TUTORIAL && typeof window.PK_TUTORIAL.refreshLang === "function") {
        window.PK_TUTORIAL.refreshLang();
      }
      window.dispatchEvent(new CustomEvent("pkLanguageChanged", { detail: { lang: lang, isKm: isKm } }));
    } catch (e) {}
  }

  var langHudTimer = null;
  function showHolographicLangHud(isKm) {
    try {
      var hud = document.getElementById("pkLangHud");
      if (!hud) {
        hud = document.createElement("div");
        hud.id = "pkLangHud";
        hud.className = "pk-lang-hud";
        hud.setAttribute("role", "status");
        hud.setAttribute("aria-live", "polite");
        document.body.appendChild(hud);
      }

      var sparkSvg = '<svg class="pk-icon pk-lang-hud-spark" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14"/></svg>';
      var arrowSvg = '<svg class="pk-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

      hud.className = "pk-lang-hud " + (isKm ? "hud-km" : "hud-en");
      hud.innerHTML = [
        '<div class="pk-lang-hud-inner">',
          '<div class="pk-lang-hud-visual">',
            '<span class="pk-lang-hud-prev">' + (isKm ? 'EN' : 'KM') + '</span>',
            '<span class="pk-lang-hud-arrow">' + arrowSvg + '</span>',
            '<span class="pk-lang-hud-pill">' + (isKm ? 'ភាសាខ្មែរ' : 'English') + '</span>',
            '<span class="pk-lang-hud-spark-wrap">' + sparkSvg + '</span>',
          '</div>',
          '<div class="pk-lang-hud-meta">',
            '<span class="pk-lang-hud-title">' + (isKm ? 'បកប្រែជាភាសាខ្មែរ (Khmer Active)' : 'Translated to English') + '</span>',
            '<span class="pk-lang-hud-hint"><kbd>Alt+L</kbd> ' + (isKm ? 'ប្តូរមកវិញ' : 'to switch back') + '</span>',
          '</div>',
        '</div>'
      ].join('');

      void hud.offsetWidth;
      hud.classList.add("show");

      if (langHudTimer) clearTimeout(langHudTimer);
      langHudTimer = setTimeout(function () {
        hud.classList.remove("show");
      }, 1900);
    } catch (e) {}
  }

  function playHolographicChime(isKm) {
    try {
      var ctx = window.audioCtx || (window.AudioContext ? new (window.AudioContext || window.webkitAudioContext)() : null);
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();
      var now = ctx.currentTime;
      var osc1 = ctx.createOscillator();
      var osc2 = ctx.createOscillator();
      var gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "triangle";

      if (isKm) {
        osc1.frequency.setValueAtTime(523.25, now);
        osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.11);
        osc2.frequency.setValueAtTime(261.63, now);
        osc2.frequency.exponentialRampToValueAtTime(392.00, now + 0.11);
      } else {
        osc1.frequency.setValueAtTime(783.99, now);
        osc1.frequency.exponentialRampToValueAtTime(523.25, now + 0.11);
        osc2.frequency.setValueAtTime(392.00, now);
        osc2.frequency.exponentialRampToValueAtTime(261.63, now + 0.11);
      }

      gain.gain.setValueAtTime(0.065, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.20);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      let stoppedCount = 0;
      const cleanupHolo = () => {
        stoppedCount++;
        if (stoppedCount >= 2) {
          try {
            osc1.disconnect();
            osc2.disconnect();
            gain.disconnect();
          } catch (_e) {}
        }
      };
      osc1.onended = cleanupHolo;
      osc2.onended = cleanupHolo;

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.22);
      osc2.stop(now + 0.22);
    } catch (e) {}
  }

  function toggleSiteLanguage() {
    var next = document.documentElement.classList.contains("site-km-mode") ? "en" : "km";
    safeSetLang(LANG_KEY, next);
    applyLang(next);
    var isNowKm = next === "km";

    playHolographicChime(isNowKm);
    showHolographicLangHud(isNowKm);

    var topBtn = document.getElementById("topLangToggleBtn");
    if (topBtn) {
      topBtn.classList.add("lang-switch-flare");
      setTimeout(function () { topBtn.classList.remove("lang-switch-flare"); }, 400);
    }

    try {
      if (typeof showToast === "function") {
        showToast(
          typeof pkIcon === "function" ? pkIcon("globe", 18) : "",
          isNowKm ? "បកប្រែជាភាសាខ្មែររួចរាល់" : "Translated to English",
          isNowKm ? "ចុច Alt+L ឬប៊ូតុងដើម្បីប្តូរមកភាសាអង់គ្លេសវិញ" : "Switched to English. Press Alt+L to translate to Khmer anytime."
        );
      }
    } catch (e) {}
  }

  var startLang = safeGetLang(LANG_KEY, "en");
  applyLang(startLang);

  if (toggleBtn) toggleBtn.addEventListener("click", toggleSiteLanguage);
  if (topToggleBtn) topToggleBtn.addEventListener("click", toggleSiteLanguage);
  window.applySiteLanguage = applyLang;
  window.toggleSiteLanguage = toggleSiteLanguage;

  /* ---------- developer note modal ---------- */
  var devNoteModal = document.getElementById("devNoteModal");
  var devNoteBtn = document.getElementById("siteDevNoteBtn");
  var devNoteCloseBtn = document.getElementById("devNoteCloseBtn");
  var devNoteCloseBtn2 = document.getElementById("devNoteCloseBtn2");
  function openDevNote() {
    if (!devNoteModal) return;
    devNoteModal.hidden = false;
    if (devNoteCloseBtn) devNoteCloseBtn.focus();
  }
  function closeDevNote() {
    if (typeof window.closeModalAnimated === "function" && devNoteModal) {
      window.closeModalAnimated(devNoteModal);
    } else if (devNoteModal) {
      devNoteModal.hidden = true;
    }
  }
  if (devNoteBtn) devNoteBtn.addEventListener("click", openDevNote);
  if (devNoteCloseBtn) devNoteCloseBtn.addEventListener("click", closeDevNote);
  if (devNoteCloseBtn2) devNoteCloseBtn2.addEventListener("click", closeDevNote);
  if (devNoteModal) {
    devNoteModal.addEventListener("click", function (e) {
      if (e.target === devNoteModal) closeDevNote();
    });
    devNoteModal.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDevNote();
    });
  }

  /* ---------- collaborators & statutory legal ledger modal ---------- */
  var collabModal = document.getElementById("pkCollaboratorsModal");
  var collabMiniBtn = document.getElementById("pkCollabMiniBoxBtn");
  var collabCloseBtn = document.getElementById("pkCollabCloseBtn");
  var collabFilterBar = document.getElementById("pkCollabFilterBar");
  var collabGrid = document.getElementById("pkCollabGrid");
  var collabJumpLegalBtn = document.getElementById("pkCollabJumpLegalBtn");
  var collabLegalSection = document.getElementById("pkCollabLegalLedger");
  var currentCollabId = "kon-kurosaki";

  var COLLAB_AUDIT_DATA = {
    "kon-kurosaki": {
      name: "Phana Kurosaki (@Kon-Kurosaki)",
      avatar: "assets/avatar-kon-kurosaki.jpg",
      model: "Biological Neural Network",
      status: "ONLINE // ACTIVE",
      badge: "HUMAN CREATOR (CORE DECISION MAKER)",
      url: "https://github.com/Kon-Kurosaki",
      linkLabel: "Open @Kon-Kurosaki",
      recorded: "167 Commits recorded",
      pair: "Veasna TEP (@veasnawt) & Phana (@not-Phana)",
      desc: "Primary human architect of PK Khmer Type with 167+ verified commits. Designs the 222-lesson Khmer Standard, Khmer NiDA, and English QWERTY curriculum (with 100% full alphabet coverage), 3D anatomical hand kinematics, audio synthesis engine, and studio UI.",
      chips: [
        "167+ verified commits on PK Khmer Type",
        "Tactile typing engine & 222 interactive lessons (every letter included)",
        "Full-stack architecture & reactive telemetry"
      ]
    },
    "veasnawt": {
      name: "Veasna TEP (@veasnawt)",
      avatar: "assets/avatar-veasnawt.png",
      model: "Biological Neural Network",
      status: "ONLINE // MENTOR",
      badge: "HUMAN ARCHITECT & SENIOR MENTOR",
      url: "https://github.com/veasnawt",
      linkLabel: "Open @veasnawt",
      recorded: "Senior Mentor & Advisor",
      pair: "Phana Kurosaki (@Kon-Kurosaki)",
      desc: "Revered senior engineering mentor, teacher, and pedagogical guide to Phana Kurosaki. Provides architectural counsel, high-level code guidance, and modern JavaScript engineering mastery that elevates the entire PK Studio ecosystem.",
      chips: [
        "Senior engineering mentorship & architectural counsel",
        "Full-stack JavaScript mastery & educational pedagogy",
        "Guiding mentor behind PK Studio standards & continuous growth"
      ]
    },
    "phanaach4889": {
      name: "Phana (@not-Phana)",
      avatar: "assets/avatar-not-phana.jpg",
      model: "Biological Neural Network",
      status: "ONLINE // SYNCED",
      badge: "HUMAN CREATOR (CORE DECISION MAKER)",
      url: "https://github.com/not-Phana",
      linkLabel: "Open @not-Phana",
      recorded: "30 Commits recorded",
      pair: "Phana Kurosaki (@Kon-Kurosaki)",
      desc: "Official repository owner of not-Phana/PK-Khmer-Type and PK Studio ecosystems with 30+ verified commits. Directs public releases, documentation, and web hosting.",
      chips: [
        "30+ verified commits & repository owner",
        "Public GitHub Pages deployment & domain ops",
        "Ecosystem integration and community tools"
      ]
    },
    "not-Phana": {
      name: "Phana (@not-Phana)",
      avatar: "assets/avatar-not-phana.jpg",
      model: "Biological Neural Network",
      status: "ONLINE // SYNCED",
      badge: "HUMAN CREATOR (CORE DECISION MAKER)",
      url: "https://github.com/not-Phana",
      linkLabel: "Open @not-Phana",
      recorded: "30 Commits recorded",
      pair: "Phana Kurosaki (@Kon-Kurosaki)",
      desc: "Official repository owner of not-Phana/PK-Khmer-Type and PK Studio ecosystems with 30+ verified commits. Directs public releases, documentation, and web hosting.",
      chips: [
        "30+ verified commits & repository owner",
        "Public GitHub Pages deployment & domain ops",
        "Ecosystem integration and community tools"
      ]
    },
    "antigravity": {
      name: "Antigravity (@gemini-code-assist)",
      avatar: "assets/contributor-antigravity.png",
      model: "Google DeepMind / Antigravity Agent",
      status: "AUTONOMOUS // ACTIVE",
      badge: "AUTONOMOUS AGENT (TERMINAL & TOOL EXECUTION)",
      url: "https://github.com/apps/gemini-code-assist",
      linkLabel: "Open @gemini-code-assist",
      recorded: "1 Commit recorded",
      pair: "Gemini (Conversational Chatbot)",
      desc: "Autonomous coding agent designed by Google DeepMind. Unlike standard conversational chatbots, Antigravity executes shell commands, inspects live browser viewports via CDP, refactors source trees, and verifies builds autonomously.",
      chips: [
        "1 verified commit on PK Khmer Type",
        "Headless Edge CDP visual verification engine",
        "Precision cursor vector physics & live terminal execution"
      ]
    },
    "claude-code": {
      name: "Claude Code (@claude)",
      avatar: "assets/contributor-claude-code.svg",
      model: "Claude Code CLI // Future Incubation Slot",
      status: "STANDBY // QUEUED FOR FUTURE V3.0",
      badge: "FUTURE AUTONOMOUS AGENT (RESERVED PIPELINE SLOT)",
      url: "https://github.com/claude",
      linkLabel: "Open @claude",
      recorded: "Queued for Future Use",
      pair: "Claude (Active Conversational Chatbot)",
      desc: "Reserved autonomous CLI agent slot for future PK Khmer Type engineering phases. Not currently used in active development — pre-configured in the studio architecture for upcoming terminal refactoring, AST audits, and V3.0 expansion.",
      chips: [
        "Status: Not Used Yet — Reserved for Future V3.0 Pipeline",
        "Planned Scope: CLI Code Operations & AST Refactoring",
        "Pre-Configured: Official @claude Git Provenance Slot Ready"
      ]
    },
    "codex": {
      name: "Codex (@chatgpt-codex-connector)",
      avatar: "assets/contributor-codex.svg",
      model: "OpenAI Codex Engine",
      status: "AUTONOMOUS // STANDBY",
      badge: "AUTONOMOUS AGENT (TERMINAL & TOOL EXECUTION)",
      url: "https://github.com/apps/chatgpt-codex-connector",
      linkLabel: "Open @chatgpt-codex-connector",
      recorded: "1 Commit recorded",
      pair: "ChatGPT (Conversational Chatbot)",
      desc: "Autonomous code generation and execution engine from OpenAI. Connects programmatic pipelines, parses intricate Unicode Khmer keystroke stacking, and generates algorithmic scaffolding rather than mere conversational text.",
      chips: [
        "1 verified commit on PK Khmer Type",
        "Khmer NiDA character stacking tables & unicode maps",
        "Rapid prototype scaffolding & algorithmic compilation"
      ]
    },
    "gemini": {
      name: "Gemini (@google-gemini)",
      avatar: "assets/contributor-gemini.png",
      model: "Gemini 2.5 Advanced Web UI",
      status: "ONLINE // READY",
      badge: "CONVERSATIONAL CHATBOT (WEB & PROMPT INTERFACE)",
      url: "https://gemini.google.com/",
      linkLabel: "Open @google-gemini",
      recorded: "Ideation Chat recorded",
      pair: "Antigravity (Autonomous Agent)",
      desc: "Conversational multimodal chatbot interface by Google. Used in the early creative stages for rapid brainstorming, prompt refinement, and architecture discussions before agentic terminal execution.",
      chips: [
        "Initial feature ideation & natural language prompt drafts",
        "Multimodal layout analysis & creative critique",
        "Conversational dialogue companion to Antigravity"
      ]
    },
    "claude": {
      name: "Claude (@anthropic-claude)",
      avatar: "assets/contributor-claude.png",
      model: "Claude.ai Web Interface",
      status: "ONLINE // READY",
      badge: "CONVERSATIONAL CHATBOT (WEB & PROMPT INTERFACE)",
      url: "https://claude.ai/",
      linkLabel: "Open @anthropic-claude",
      recorded: "Dialogue Chat recorded",
      pair: "Claude Code (Future CLI Agent Slot)",
      desc: "Conversational chat assistant by Anthropic. Engaged for high-level philosophical discussions, Classical Greek Delphic maxim curation, and stylistic prose refining.",
      chips: [
        "Delphic maxims philosophical narrative exploration",
        "Khmer pedagogical prose styling and curation",
        "Paired with reserved Claude Code future CLI slot"
      ]
    },
    "chatgpt": {
      name: "ChatGPT (@openai-chatgpt)",
      avatar: "assets/contributor-chatgpt.png",
      model: "ChatGPT Plus / GPT-4o Web UI",
      status: "ONLINE // STANDBY",
      badge: "CONVERSATIONAL CHATBOT (WEB & PROMPT INTERFACE)",
      url: "https://chatgpt.com/",
      linkLabel: "Open @openai-chatgpt",
      recorded: "Research Chat recorded",
      pair: "Codex (Autonomous Agent)",
      desc: "Conversational web chatbot by OpenAI. Employed for quick inquiries, documentation queries, and exploratory idea exchanges prior to algorithmic synthesis in the Codex pipeline.",
      chips: [
        "Rapid exploration of keyboard layout specifications",
        "Markdown documentation drafting and phrasing ideas",
        "Conversational dialogue companion to Codex"
      ]
    }
  };

  function selectCollaboratorLog(collabId) {
    var info = COLLAB_AUDIT_DATA[collabId];
    var gridEl = collabGrid || document.getElementById("pkCollabGrid");
    if (!info || !gridEl) return;
    currentCollabId = collabId;
    var cards = gridEl.querySelectorAll(".pk-collab-card");
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var isMatch = card.getAttribute("data-collab-id") === collabId;
      card.classList.toggle("is-inspecting", isMatch);
      var btn = card.querySelector(".pk-cc-log-btn");
      if (btn) {
        btn.classList.toggle("is-active", isMatch);
        var defaultLabel = card.classList.contains("pk-collab-card-future") ? "VIEW SLOT" : "VIEW LOG";
        btn.textContent = isMatch ? "INSPECTING" : defaultLabel;
      }
    }
    var ciAvatar = document.getElementById("pkCiAvatarImg");
    var ciModel = document.getElementById("pkCiModel");
    var ciStatus = document.getElementById("pkCiStatus");
    var ciName = document.getElementById("pkCiName");
    var ciBadge = document.getElementById("pkCiBadge");
    var ciLink = document.getElementById("pkCiLink");
    var ciLinkLabel = document.getElementById("pkCiLinkLabel");
    var ciRecorded = document.getElementById("pkCiRecorded");
    var ciPair = document.getElementById("pkCiPair");
    var ciDesc = document.getElementById("pkCiDesc");
    var ciMeta = document.getElementById("pkCiMeta");

    if (ciAvatar && info.avatar) ciAvatar.src = info.avatar;
    if (ciModel && info.model) ciModel.textContent = "CONTRIBUTOR INSPECTION // " + info.model;
    if (ciStatus && info.status) ciStatus.textContent = "STATUS: " + info.status;
    if (ciName) ciName.textContent = info.name;
    if (ciBadge) ciBadge.textContent = info.badge;
    if (ciPair && info.pair) ciPair.textContent = info.pair;
    if (ciRecorded && info.recorded) ciRecorded.textContent = info.recorded;
    if (ciLink) {
      ciLink.href = info.url;
      if (ciLinkLabel) ciLinkLabel.textContent = info.linkLabel;
    }
    if (ciDesc) ciDesc.textContent = info.desc;
    if (ciMeta && Array.isArray(info.chips)) {
      var checkSvg = '<svg class="pk-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
      ciMeta.innerHTML = info.chips.map(function (c) {
        var safe = c.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return '<span class="pk-ci-chip">' + checkSvg + "<span>" + safe + "</span></span>";
      }).join("");
    }
  }

  function filterPkCollaborators(tier, clickedBtn) {
    var filterBarEl = collabFilterBar || document.getElementById("pkCollabFilterBar");
    var gridEl = collabGrid || document.getElementById("pkCollabGrid");
    if (!gridEl) return;
    var targetTier = tier || "all";
    if (filterBarEl) {
      var allBtns = filterBarEl.querySelectorAll(".pk-collab-filter-btn[data-collab-filter]");
      for (var i = 0; i < allBtns.length; i++) {
        var b = allBtns[i];
        var isAct = clickedBtn ? b === clickedBtn : b.getAttribute("data-collab-filter") === targetTier;
        b.classList.toggle("active", isAct);
        b.setAttribute("aria-selected", isAct ? "true" : "false");
      }
    }
    var cards = gridEl.querySelectorAll(".pk-collab-card");
    var firstVisibleId = null;
    var currentStillVisible = false;
    for (var j = 0; j < cards.length; j++) {
      var card = cards[j];
      var cardTier = card.getAttribute("data-collab-tier");
      var cardId = card.getAttribute("data-collab-id");
      var show = targetTier === "all" || cardTier === targetTier;
      card.hidden = !show;
      card.classList.toggle("is-filtered-out", !show);
      card.style.display = show ? "" : "none";
      if (show) {
        if (!firstVisibleId) firstVisibleId = cardId;
        if (cardId === currentCollabId) currentStillVisible = true;
      }
    }
    if (!currentStillVisible && firstVisibleId) {
      selectCollaboratorLog(firstVisibleId);
    }
  }

  function setPkLegalLedgerMode(mode, clickedBtn) {
    var m = mode || "both";
    var modeBar = document.getElementById("pkLlModeBar");
    if (modeBar) {
      var btns = modeBar.querySelectorAll(".pk-ll-mode-btn");
      for (var i = 0; i < btns.length; i++) {
        var active = clickedBtn ? btns[i] === clickedBtn : btns[i].getAttribute("data-ll-mode") === m;
        btns[i].classList.toggle("active", active);
      }
    }
    var techSec = document.getElementById("pkLlTechSection");
    var legalSec = document.getElementById("pkLlLegalSection");
    if (techSec) techSec.hidden = !(m === "tech" || m === "both");
    if (legalSec) legalSec.hidden = !(m === "legal" || m === "both");
  }

  function togglePkLegalProvisions(btn) {
    if (!btn) return;
    var clause = btn.closest(".pk-ll-clause");
    if (!clause) return;
    var drawer = clause.querySelector(".pk-ll-prov-drawer");
    if (!drawer) return;
    var count = drawer.querySelectorAll(".pk-ll-prov-item").length;
    var willOpen = drawer.hidden;
    drawer.hidden = !willOpen;
    btn.textContent = willOpen ? "- Hide Full Provisions" : "+ View Full Provisions (" + count + ")";
  }

  function openCollaboratorsModal() {
    var modalEl = collabModal || document.getElementById("pkCollaboratorsModal");
    if (!modalEl) return;
    modalEl.hidden = false;
    var closeEl = collabCloseBtn || document.getElementById("pkCollabCloseBtn");
    if (closeEl) closeEl.focus();
  }

  function closeCollaboratorsModal() {
    var modalEl = collabModal || document.getElementById("pkCollaboratorsModal");
    if (typeof window.closeModalAnimated === "function" && modalEl) {
      window.closeModalAnimated(modalEl);
    } else if (modalEl) {
      modalEl.hidden = true;
    }
  }

  window.openCollaboratorsModal = openCollaboratorsModal;
  window.closeCollaboratorsModal = closeCollaboratorsModal;
  window.selectPkCollaborator = selectCollaboratorLog;
  window.filterPkCollaborators = filterPkCollaborators;
  window.setPkLegalLedgerMode = setPkLegalLedgerMode;
  window.togglePkLegalProvisions = togglePkLegalProvisions;

  if (collabMiniBtn) collabMiniBtn.addEventListener("click", openCollaboratorsModal);
  if (collabCloseBtn) collabCloseBtn.addEventListener("click", closeCollaboratorsModal);

  if (collabModal) {
    collabModal.addEventListener("click", function (e) {
      if (e.target === collabModal) closeCollaboratorsModal();
    });
    collabModal.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeCollaboratorsModal();
    });
  }

  if (collabFilterBar) {
    collabFilterBar.addEventListener("click", function (e) {
      var filterBtn = e.target.closest(".pk-collab-filter-btn[data-collab-filter]");
      if (!filterBtn) return;
      var tier = filterBtn.getAttribute("data-collab-filter") || "all";
      filterPkCollaborators(tier, filterBtn);
    });
  }

  if (collabJumpLegalBtn && collabLegalSection) {
    collabJumpLegalBtn.addEventListener("click", function () {
      collabLegalSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (collabGrid) {
    collabGrid.addEventListener("click", function (e) {
      if (e.target.closest("a.pk-cc-handle")) return;
      var card = e.target.closest(".pk-collab-card");
      if (!card) return;
      var collabId = card.getAttribute("data-collab-id");
      if (collabId) selectCollaboratorLog(collabId);
    });
    collabGrid.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        if (e.target.closest("a.pk-cc-handle")) return;
        var card = e.target.closest(".pk-collab-card");
        if (!card) return;
        e.preventDefault();
        var collabId = card.getAttribute("data-collab-id");
        if (collabId) selectCollaboratorLog(collabId);
      }
    });
  }

  /* ---------- version 2.4 release showcase modal ---------- */
  var versionModal = document.getElementById("versionModal");
  var versionModalCloseBtn = document.getElementById("versionModalCloseBtn");
  var versionModalAckBtn = document.getElementById("versionModalAckBtn");

  function openVersionModal() {
    if (!versionModal) return;
    versionModal.hidden = false;
    if (versionModalAckBtn) versionModalAckBtn.focus();
  }

  function closeVersionModal() {
    if (typeof window.closeModalAnimated === "function" && versionModal) {
      window.closeModalAnimated(versionModal);
    } else if (versionModal) {
      versionModal.hidden = true;
    }
  }

  window.openVersionModal = openVersionModal;

  // Project Scale & Architecture Telemetry Modal Handlers
  var projectScaleModal = document.getElementById("projectScaleModal");
  var projectScaleCloseBtn = document.getElementById("projectScaleCloseBtn");
  var projectScaleAckBtn = document.getElementById("projectScaleAckBtn");

  function openProjectScaleModal() {
    if (!projectScaleModal) projectScaleModal = document.getElementById("projectScaleModal");
    if (!projectScaleModal) return;
    projectScaleModal.hidden = false;
    if (projectScaleAckBtn) projectScaleAckBtn.focus();
  }

  function closeProjectScaleModal() {
    if (!projectScaleModal) projectScaleModal = document.getElementById("projectScaleModal");
    if (typeof window.closeModalAnimated === "function" && projectScaleModal) {
      window.closeModalAnimated(projectScaleModal);
    } else if (projectScaleModal) {
      projectScaleModal.hidden = true;
    }
  }

  window.openProjectScaleModal = openProjectScaleModal;

  // ============================================================
  // Touch-Typing & Khmer Mastery Tips Modal & Rotating Pro-Tips
  // ============================================================
  var masteryTipsModal = document.getElementById("masteryTipsModal");
  var masteryTipsCloseBtn = document.getElementById("masteryTipsCloseBtn");
  var masteryTipsAckBtn = document.getElementById("masteryTipsAckBtn");

  function openMasteryTipsModal() {
    if (!masteryTipsModal) masteryTipsModal = document.getElementById("masteryTipsModal");
    if (!masteryTipsModal) return;
    masteryTipsModal.hidden = false;
    if (masteryTipsAckBtn) masteryTipsAckBtn.focus();
  }

  function closeMasteryTipsModal() {
    if (!masteryTipsModal) masteryTipsModal = document.getElementById("masteryTipsModal");
    if (typeof window.closeModalAnimated === "function" && masteryTipsModal) {
      window.closeModalAnimated(masteryTipsModal);
    } else if (masteryTipsModal) {
      masteryTipsModal.hidden = true;
    }
  }

  window.openMasteryTipsModal = openMasteryTipsModal;
  window.closeMasteryTipsModal = closeMasteryTipsModal;

  if (masteryTipsCloseBtn) masteryTipsCloseBtn.addEventListener("click", closeMasteryTipsModal);
  if (masteryTipsAckBtn) masteryTipsAckBtn.addEventListener("click", closeMasteryTipsModal);

  if (masteryTipsModal) {
    masteryTipsModal.addEventListener("click", function (e) {
      if (e.target === masteryTipsModal) closeMasteryTipsModal();
    });
    masteryTipsModal.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMasteryTipsModal();
    });

    // Category Tab Switching
    masteryTipsModal.querySelectorAll(".tips-tab-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var targetId = "tipsPanel-" + btn.getAttribute("data-tips-target");
        masteryTipsModal.querySelectorAll(".tips-tab-btn").forEach(function (b) {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        masteryTipsModal.querySelectorAll(".tips-category-panel").forEach(function (p) {
          p.classList.remove("active");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        var panel = document.getElementById(targetId);
        if (panel) panel.classList.add("active");
      });
    });
  }

  // Rotating Pro-Tip Ticker Engine
  var PRO_TIPS_ROTATION = [
    {
      en: "To type a Khmer subscript (ជើង), press <kbd>Space</kbd> then the consonant in Standard, or <kbd>J</kbd> then the consonant in NiDA.",
      km: "ដើម្បីវាយជើងអក្សរខ្មែរ សូមចុច <kbd>Space</kbd> រួចចុចព្យញ្ជនៈ (ស្តង់ដារ) ឬ <kbd>J</kbd> រួចចុចព្យញ្ជនៈ (NiDA)។"
    },
    {
      en: "Press <kbd>Alt+F</kbd> anytime to activate Zen Focus Mode — enlarging the keyboard and silencing distractions.",
      km: "ចុច <kbd>Alt+F</kbd> គ្រប់ពេលដើម្បីបើកមុខងារផ្ដោតអារម្មណ៍ (Focus Mode) និងពង្រីកក្តារចុច។"
    },
    {
      en: "Rest your index fingers on the tactile bumps of <kbd>F</kbd> and <kbd>J</kbd> without looking down.",
      km: "ដាក់ម្រាមចង្អុលដៃលើគន្លឹះរលាក់ <kbd>F</kbd> និង <kbd>J</kbd> ដោយមិនបាច់មើលក្តារចុចឡើយ។"
    },
    {
      en: "Press <kbd>Alt+L</kbd> to instantly translate the entire interface between English and Khmer.",
      km: "ចុច <kbd>Alt+L</kbd> ដើម្បីប្តូរភាសាចំណុចប្រទាក់រវាងភាសាអង់គ្លេស និងខ្មែរភ្លាមៗ។"
    },
    {
      en: "Type dependent vowels AFTER their base consonants (e.g. type <kbd>ត</kbd> + <kbd>ែ</kbd> for <b>តែ</b>).",
      km: "វាយស្រៈនិស្ស័យបន្ទាប់ពីព្យញ្ជនៈជានិច្ច (ឧ. វាយ <kbd>ត</kbd> + <kbd>ែ</kbd> ដើម្បីបាន <b>តែ</b>)។"
    },
    {
      en: "Aim for &ge;95% accuracy before speeding up. Smooth rhythm builds permanent muscle memory.",
      km: "ផ្តោតលើភាពត្រឹមត្រូវ &ge;៩៥% មុននឹងបង្កើនល្បឿន។ ចង្វាក់ស្មើគ្នានាំឱ្យចងចាំបានយូរអង្វែង។"
    },
    {
      en: "Hit <kbd>.</kbd> (period) to output the Khmer Khan (<b>។</b>), or <kbd>Shift+.</kbd> for Bariyoosan (<b>៕</b>).",
      km: "ចុច <kbd>.</kbd> ដើម្បីវាយសញ្ញាខណ្ឌ (<b>។</b>) ឬ <kbd>Shift+.</kbd> សម្រាប់សញ្ញាបរិយោសាន (<b>៕</b>)។"
    }
  ];
  var currentTipIndex = 0;

  function cycleNextProTip() {
    var contentEl = document.getElementById("proTipContent");
    if (!contentEl) return;
    currentTipIndex = (currentTipIndex + 1) % PRO_TIPS_ROTATION.length;
    var tip = PRO_TIPS_ROTATION[currentTipIndex];
    var isKm = document.documentElement.getAttribute("lang") === "km";
    contentEl.setAttribute("data-en", tip.en);
    contentEl.setAttribute("data-km", tip.km);
    contentEl.innerHTML = isKm ? tip.km : tip.en;
  }

  var proTipCycleBtn = document.getElementById("proTipCycleBtn");
  if (proTipCycleBtn) proTipCycleBtn.addEventListener("click", cycleNextProTip);

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("#tipsModalBtn, #tipsModalBtnRei, #proTipOpenBtn, #proTipOpenAllBtn, .tips-modal-btn, .pro-tip-tag, .pro-tip-all-btn");
    if (trigger) {
      e.preventDefault();
      e.stopPropagation();
      openMasteryTipsModal();
    }
  });

  // Universal Alt+T Shortcut
  window.addEventListener("keydown", function (e) {
    if (e.altKey && (e.key === "t" || e.key === "T" || e.code === "KeyT")) {
      // Don't intercept if modifier state is AltGraph
      if (e.getModifierState && e.getModifierState("AltGraph")) return;
      e.preventDefault();
      e.stopPropagation();
      if (!masteryTipsModal || masteryTipsModal.hidden) {
        openMasteryTipsModal();
      } else {
        closeMasteryTipsModal();
      }
    }
  }, true);

  window.closeProjectScaleModal = closeProjectScaleModal;

  if (projectScaleCloseBtn) projectScaleCloseBtn.addEventListener("click", closeProjectScaleModal);
  if (projectScaleAckBtn) projectScaleAckBtn.addEventListener("click", closeProjectScaleModal);

  if (projectScaleModal) {
    projectScaleModal.addEventListener("click", function (e) {
      if (e.target === projectScaleModal) closeProjectScaleModal();
    });
    projectScaleModal.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeProjectScaleModal();
    });
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("#projectScaleBtn, #projectScaleBtnRei, #versionModalTelemetryBtn, .chassis-scale-btn, .rei-scale-btn, .version-action-scale-btn");
    if (trigger) {
      e.preventDefault();
      e.stopPropagation();
      openProjectScaleModal();
    }
  });

  window.closeVersionModal = closeVersionModal;

  if (versionModalCloseBtn) versionModalCloseBtn.addEventListener("click", closeVersionModal);
  if (versionModalAckBtn) versionModalAckBtn.addEventListener("click", closeVersionModal);

  if (versionModal) {
    versionModal.addEventListener("click", function (e) {
      if (e.target === versionModal) closeVersionModal();
    });
    versionModal.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeVersionModal();
    });
  }

  // Click listeners for all version badges across the studio
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("#heroVersionTag, #chassisVersionBadge, #settingsVersionPill, #footerVersionTag, .hero-version-tag, .chassis-version-badge, .settings-version-pill, .site-footer-version-tag");
    if (trigger) {
      e.preventDefault();
      e.stopPropagation();
      openVersionModal();
    }
  });
})();
