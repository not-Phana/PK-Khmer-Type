/* =====================================================================
   PK Khmer Type — Smooth Theme-Adaptive Interactive Cursor
   Features:
   - Dynamic theme-adaptive arrow pointer (matches active theme/accent color)
   - Intelligent contextual capsule pill badge (shows "LESSONS" on lessons,
     "RACE" on typing race, "SETTINGS", "STATS", "3D HANDS", "KEY", etc.)
   - Contextual hover emergence: badge smoothly springs into view when hovering
     interactive elements and tucks away gracefully when idle
   - High-precision 60Hz-240Hz RAF physics loop with subpixel positioning
   - Organic spring trailing with velocity tilt and inertia damping
   - Hover scaling on interactive keys, buttons, links, and switches
   - Click compression snap feedback
   - Intelligent text-input passthrough (native I-beam over inputs/textareas)
   - Window boundary awareness (smooth fade on mouseleave / mouseenter)
   - Zero-lag performance mode and reduced-motion compliance
   - Strict Zero-Emoji Policy compliance (100% vector SVG & CSS)
   ===================================================================== */

(function (global) {
  'use strict';

  const STORAGE_KEY_ENABLED = 'khmerSmoothCursor';
  const STORAGE_KEY_COLOR = 'khmerCursorColor';
  const STORAGE_KEY_BADGE_MODE = 'khmerCursorBadgeMode';

  const PALETTES = {
    gold:     { accent: '#ff9d2e', bright: '#ffd166', glow: 'rgba(255, 209, 102, 0.42)', soft: 'rgba(255, 209, 102, 0.16)' },
    cyan:     { accent: '#0284c7', bright: '#38bdf8', glow: 'rgba(56, 189, 248, 0.42)',  soft: 'rgba(56, 189, 248, 0.16)' },
    jade:     { accent: '#3f9d6b', bright: '#5fd694', glow: 'rgba(95, 214, 148, 0.42)',  soft: 'rgba(95, 214, 148, 0.16)' },
    ruby:     { accent: '#e11d48', bright: '#ff5a70', glow: 'rgba(255, 90, 112, 0.45)',  soft: 'rgba(255, 90, 112, 0.16)' },
    sapphire: { accent: '#14b8a6', bright: '#2dd4a7', glow: 'rgba(45, 212, 167, 0.42)',  soft: 'rgba(45, 212, 167, 0.16)' },
    amethyst: { accent: '#9333ea', bright: '#c084fc', glow: 'rgba(192, 132, 252, 0.45)', soft: 'rgba(192, 132, 252, 0.16)' }
  };

  let isEnabled = true;
  let cursorColor = 'theme'; // 'theme' | 'gold' | 'cyan' | 'jade' | 'ruby' | 'sapphire' | 'amethyst'
  let badgeMode = 'hover';   // 'hover' (emerges on interactive elements) | 'always' (shows 'YOU' when idle)

  let layerEl = null;
  let arrowEl = null;
  let badgeEl = null;
  let badgeInnerEl = null;
  let dotEl = null;
  let labelEl = null;

  // Physics state
  let targetX = -100;
  let targetY = -100;
  let arrowX = -100;
  let arrowY = -100;
  let badgeX = -100;
  let badgeY = -100;
  let badgeVx = 0;
  let badgeVy = 0;

  let rafId = null;
  let isPointerInside = false;
  let isOverInput = false;
  let isInteractive = false;
  let isPressed = false;
  let hasMovedOnce = false;

  let activeLabel = 'YOU';
  let isBadgeVisible = false;

  function canRunCustomCursor() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false;
    const hasFinePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasFinePointer) return false;

    const rootCls = document.documentElement.classList;
    if (rootCls.contains('anim-mode-off') || rootCls.contains('performance-mode') || rootCls.contains('reduce-motion')) {
      return false;
    }
    return isEnabled;
  }

  function initStorage() {
    try {
      const savedEnabled = localStorage.getItem(STORAGE_KEY_ENABLED);
      isEnabled = savedEnabled === null ? true : (savedEnabled === '1' || savedEnabled === 'true');

      const savedColor = localStorage.getItem(STORAGE_KEY_COLOR);
      if (savedColor && (savedColor === 'theme' || PALETTES[savedColor])) {
        cursorColor = savedColor;
      } else {
        cursorColor = 'theme';
      }

      const savedMode = localStorage.getItem(STORAGE_KEY_BADGE_MODE);
      badgeMode = savedMode === 'always' ? 'always' : 'hover';
    } catch (_e) {
      isEnabled = true;
      cursorColor = 'theme';
      badgeMode = 'hover';
    }
  }

  function applyColorTheme() {
    if (!layerEl) return;
    if (cursorColor === 'theme' || !PALETTES[cursorColor]) {
      layerEl.removeAttribute('data-color-override');
      layerEl.style.removeProperty('--pyc-accent');
      layerEl.style.removeProperty('--pyc-bright');
      layerEl.style.removeProperty('--pyc-glow');
      layerEl.style.removeProperty('--pyc-soft');
    } else {
      const pal = PALETTES[cursorColor];
      layerEl.setAttribute('data-color-override', cursorColor);
      layerEl.style.setProperty('--pyc-accent', pal.accent);
      layerEl.style.setProperty('--pyc-bright', pal.bright);
      layerEl.style.setProperty('--pyc-glow', pal.glow);
      layerEl.style.setProperty('--pyc-soft', pal.soft);
    }
  }

  function buildDOM() {
    if (layerEl && document.body.contains(layerEl)) return;

    layerEl = document.createElement('div');
    layerEl.className = 'pk-you-cursor-layer pyc-hidden';
    layerEl.id = 'pkYouCursorLayer';
    layerEl.setAttribute('aria-hidden', 'true');

    // Theme-adaptive Arrow Pointer SVG
    arrowEl = document.createElement('div');
    arrowEl.className = 'pk-you-cursor-arrow';
    arrowEl.id = 'pkYouCursorArrow';
    arrowEl.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" class="pyc-svg-arrow" aria-hidden="true">
        <path d="M3.5 2.5 L9.5 19.5 L13.2 13.8 L19.5 10.2 Z" 
              class="pyc-arrow-path"
              stroke-width="1.8" 
              stroke-linejoin="round"
              stroke-linecap="round"/>
      </svg>
    `;

    // Context-Aware Pill Badge
    badgeEl = document.createElement('div');
    badgeEl.className = 'pk-you-cursor-badge';
    badgeEl.id = 'pkYouCursorBadge';

    badgeInnerEl = document.createElement('div');
    badgeInnerEl.className = 'pyc-badge-inner';

    dotEl = document.createElement('span');
    dotEl.className = 'pyc-dot';
    dotEl.setAttribute('aria-hidden', 'true');

    labelEl = document.createElement('span');
    labelEl.className = 'pyc-label';
    labelEl.textContent = 'YOU';

    badgeInnerEl.appendChild(dotEl);
    badgeInnerEl.appendChild(labelEl);
    badgeEl.appendChild(badgeInnerEl);

    layerEl.appendChild(arrowEl);
    layerEl.appendChild(badgeEl);

    document.body.appendChild(layerEl);
    applyColorTheme();
  }

  function setBadgeLabel(text) {
    if (!labelEl) return;
    const clean = String(text || '').trim().toUpperCase();
    if (activeLabel === clean) return;
    activeLabel = clean;
    labelEl.textContent = clean;
  }

  /* ---- Contextual Element Inspector for Smart Badge Display ---- */
  function resolveHoverLabel(el) {
    if (!el || !(el instanceof Element)) return null;

    // 1. Explicit data attribute override
    const explicit = el.closest('[data-cursor-label]');
    if (explicit && explicit.getAttribute('data-cursor-label')) {
      return explicit.getAttribute('data-cursor-label');
    }

    // 2. Lessons & Curriculum Sidebar / Cards / Nav
    if (el.closest('.lesson-card, .lesson-level-header, #lessonStrip, .lesson-strip-header, #topLearnMoreBtn, [data-lesson]')) {
      const card = el.closest('.lesson-card');
      if (card) {
        const num = card.getAttribute('data-lesson') || (card.querySelector('.lesson-card-num') && card.querySelector('.lesson-card-num').textContent.trim());
        if (num) return `LESSON ${num}`;
        return 'LESSONS';
      }
      const lvl = el.closest('.lesson-level-header');
      if (lvl) {
        const lnum = lvl.getAttribute('data-level');
        if (lnum) return `LEVEL ${lnum}`;
        return 'LESSONS';
      }
      return 'LESSONS';
    }

    // 3. Typing Race & Arena
    if (el.closest('#raceToggle, .race-toggle-btn, .race-modal, #raceScreen, .race-track, .race-card, .race-lane, #raceSetupModal')) {
      if (el.closest('.race-lane-user, .race-car-user')) return 'YOU';
      if (el.closest('#raceStartBtn, .race-start-btn')) return 'START RACE';
      if (el.closest('#raceRetryBtn')) return 'REMATCH';
      return 'TYPING RACE';
    }

    // 4. Adaptive Practice
    if (el.closest('.adaptive-sidebar-card, #adaptiveStartBtn, #lshAdaptiveBtn, .adaptive-panel, .adaptive-letter-strip')) {
      if (el.closest('#adaptiveStartBtn')) return 'TRAIN';
      return 'ADAPTIVE';
    }

    // 5. Temple Trial
    if (el.closest('#trialToggle, .trial-modal, .trial-card')) {
      return 'TEMPLE TRIAL';
    }

    // 6. Settings & Presets
    if (el.closest('#settingsOpenBtn, #settingsModal, .settings-modal')) {
      const cat = el.closest('.settings-cat-tab');
      if (cat && cat.textContent) return cat.textContent.trim();
      const preset = el.closest('.settings-preset-btn');
      if (preset && preset.textContent) return preset.textContent.trim();
      const row = el.closest('.settings-row');
      if (row) {
        const name = row.querySelector('.settings-row-name');
        if (name && name.textContent) return name.textContent.trim();
      }
      return 'SETTINGS';
    }

    // 7. Navigation Actions
    if (el.closest('#focusModeBtn')) return 'FOCUS';
    if (el.closest('#guideToggleBtn, #guideDock, .guide-dock')) return 'GUIDE';
    if (el.closest('#shortcutsOpenBtn')) return 'SHORTCUTS';
    if (el.closest('#statsOpenBtn, #profileStatsGrid, .stats-modal')) return 'STATISTICS';
    if (el.closest('#authOpenBtn')) return 'SIGN IN';
    if (el.closest('#authAccountChip, #authModal, #accountModal')) return 'ACCOUNT';
    if (el.closest('#topLangToggleBtn, #siteLangToggle')) return 'LANGUAGE';

    // 8. Toolbar Controls
    if (el.closest('#soundToggle')) return 'KEY SOUND';
    if (el.closest('#handsToggle')) return '3D HANDS';
    if (el.closest('#handsColorQuickBtn')) return 'HAND COLOR';
    if (el.closest('#cursorGuideToggle')) return 'INSPECTOR';
    if (el.closest('#ambienceToggle')) return 'AMBIENCE';

    // 9. Manuscript & Typing Workspace
    if (el.closest('#copyBtn')) return 'COPY';
    if (el.closest('#clearBtn')) return 'CLEAR';
    if (el.closest('.manuscript-label')) return 'WORKSPACE';

    // 10. Virtual Keyboard Keycaps
    const keyEl = el.closest('.key');
    if (keyEl) {
      const code = keyEl.getAttribute('data-code') || '';
      const keyId = keyEl.getAttribute('data-key') || '';
      if (code === 'Space' || keyId === 'space') return 'SPACE';
      if (code.includes('Shift') || keyId.startsWith('shift')) return 'SHIFT';
      if (code.includes('Control') || keyId.startsWith('ctrl')) return 'CTRL';
      if (keyId === 'altgr' || code === 'AltRight') return 'ALTGR';
      if (code.includes('Alt') || keyId === 'alt') return 'ALT';
      if (code === 'Enter' || keyId === 'enter') return 'ENTER';
      if (code === 'Backspace' || keyId === 'backspace') return 'BACKSPACE';
      if (code === 'Tab' || keyId === 'tab') return 'TAB';
      if (code === 'CapsLock' || keyId === 'caps') return 'CAPS LOCK';
      
      const charSpan = keyEl.querySelector('.key-main, .main-char, .char-main');
      const ch = (charSpan && charSpan.textContent.trim()) || keyEl.textContent.trim();
      if (ch && ch.length <= 3) return `KEY ${ch}`;
      return 'KEY';
    }

    // 11. Links & Documentation
    const link = el.closest('a[href]');
    if (link) {
      if (link.closest('.chassis-docs-btn') || link.href.includes('Documents')) return 'DOCUMENTS';
      if (link.closest('.chassis-3d-btn')) return '3D STUDIO';
      const text = link.textContent.trim();
      if (text && text.length <= 14) return text;
      return 'LINK';
    }

    // 12. Generic Interactive Buttons & Toggles
    const btn = el.closest('button, [role="button"], [role="tab"], .toggle-switch');
    if (btn) {
      if (btn.classList.contains('toggle-switch')) return 'TOGGLE';
      const aria = btn.getAttribute('aria-label');
      if (aria && aria.length <= 16 && !aria.includes('http')) {
        return aria.replace(/^toggle\s+/i, '').replace(/^open\s+/i, '').trim();
      }
      const title = btn.getAttribute('title');
      if (title && title.length <= 16) {
        return title.replace(/^toggle\s+/i, '').replace(/^open\s+/i, '').trim();
      }
      const text = (btn.innerText || btn.textContent || '').replace(/\s+/g, ' ').trim();
      if (text && text.length <= 14) {
        return text;
      }
      return 'SELECT';
    }

    return null;
  }

  function updateActiveClasses() {
    if (!layerEl) return;
    if (!canRunCustomCursor()) {
      document.body.classList.remove('pk-has-you-cursor');
      layerEl.classList.add('pyc-hidden');
      return;
    }

    document.body.classList.add('pk-has-you-cursor');
    if (isPointerInside && hasMovedOnce && !isOverInput) {
      layerEl.classList.remove('pyc-hidden');
    } else {
      layerEl.classList.add('pyc-hidden');
    }

    layerEl.classList.toggle('pyc-hovering', isInteractive);
    layerEl.classList.toggle('pyc-pressed', isPressed);
    layerEl.classList.toggle('pyc-over-input', isOverInput);
    layerEl.classList.toggle('pyc-badge-visible', isBadgeVisible);
  }

  /* ---- Ultra-Smooth Animation Loop (60Hz to 240Hz+) ---- */
  function physicsStep() {
    if (!canRunCustomCursor()) {
      if (layerEl) layerEl.classList.add('pyc-hidden');
      rafId = null;
      return;
    }

    // Arrow tracking: ultra-low-latency exponential decay for snappy responsiveness
    const arrowLerp = 0.65;
    arrowX += (targetX - arrowX) * arrowLerp;
    arrowY += (targetY - arrowY) * arrowLerp;

    // Badge anchor position: slight offset right and down from the arrow tip
    const badgeTargetX = targetX + 17;
    const badgeTargetY = targetY + 13;

    // Organic spring-damper physics for silky trailing badge motion
    const springK = 0.22;
    const damping = 0.72;

    badgeVx = (badgeVx + (badgeTargetX - badgeX) * springK) * damping;
    badgeVy = (badgeVy + (badgeTargetY - badgeY) * springK) * damping;

    badgeX += badgeVx;
    badgeY += badgeVy;

    // Velocity-based subtle dynamic tilt (-10 to +10 degrees)
    const tilt = Math.max(-10, Math.min(10, badgeVx * 0.45));
    const speed = Math.hypot(badgeVx, badgeVy);
    const stretch = Math.min(1.08, 1 + speed * 0.0022);

    // Apply hardware-accelerated transforms
    if (arrowEl) {
      arrowEl.style.transform = `translate3d(${arrowX.toFixed(2)}px, ${arrowY.toFixed(2)}px, 0)`;
    }
    if (badgeEl) {
      badgeEl.style.transform = `translate3d(${badgeX.toFixed(2)}px, ${badgeY.toFixed(2)}px, 0) rotate(${tilt.toFixed(2)}deg) scale(${stretch.toFixed(3)}, ${(2 - stretch).toFixed(3)})`;
    }

    rafId = requestAnimationFrame(physicsStep);
  }

  function startPhysicsLoop() {
    if (!rafId) {
      rafId = requestAnimationFrame(physicsStep);
    }
  }

  function handlePointerMove(e) {
    targetX = e.clientX;
    targetY = e.clientY;

    if (!hasMovedOnce) {
      hasMovedOnce = true;
      arrowX = targetX;
      arrowY = targetY;
      badgeX = targetX + 17;
      badgeY = targetY + 13;
    }

    isPointerInside = true;

    const t = e.target;
    if (t) {
      const isInput = Boolean(t.closest('input:not([type="button"]):not([type="submit"]):not([type="range"]), textarea, [contenteditable="true"]'));
      isOverInput = isInput;

      if (!isInput) {
        const detectedLabel = resolveHoverLabel(t);
        if (detectedLabel) {
          isInteractive = true;
          isBadgeVisible = true;
          setBadgeLabel(detectedLabel);
        } else {
          isInteractive = false;
          if (badgeMode === 'always') {
            isBadgeVisible = true;
            setBadgeLabel('YOU');
          } else {
            isBadgeVisible = false;
          }
        }
      } else {
        isInteractive = false;
        isBadgeVisible = false;
      }
    } else {
      isOverInput = false;
      isInteractive = false;
      isBadgeVisible = badgeMode === 'always';
      if (isBadgeVisible) setBadgeLabel('YOU');
    }

    updateActiveClasses();
    startPhysicsLoop();
  }

  function handlePointerDown(e) {
    if (e.button === 0) {
      isPressed = true;
      updateActiveClasses();
    }
  }

  function handlePointerUp() {
    isPressed = false;
    updateActiveClasses();
  }

  function handlePointerLeave() {
    isPointerInside = false;
    updateActiveClasses();
  }

  function handlePointerEnter(e) {
    isPointerInside = true;
    targetX = e.clientX;
    targetY = e.clientY;
    updateActiveClasses();
    startPhysicsLoop();
  }

  function setEnabled(enabled) {
    isEnabled = Boolean(enabled);
    try {
      localStorage.setItem(STORAGE_KEY_ENABLED, isEnabled ? '1' : '0');
    } catch (_e) {}

    updateActiveClasses();
    if (isEnabled) {
      startPhysicsLoop();
    }
  }

  function setColor(colorName) {
    cursorColor = (colorName && (colorName === 'theme' || PALETTES[colorName])) ? colorName : 'theme';
    try {
      localStorage.setItem(STORAGE_KEY_COLOR, cursorColor);
    } catch (_e) {}
    applyColorTheme();
  }

  function setBadgeMode(mode) {
    badgeMode = mode === 'always' ? 'always' : 'hover';
    try {
      localStorage.setItem(STORAGE_KEY_BADGE_MODE, badgeMode);
    } catch (_e) {}
    if (badgeMode === 'always' && !isOverInput && isPointerInside) {
      isBadgeVisible = true;
      if (!isInteractive) setBadgeLabel('YOU');
    }
    updateActiveClasses();
  }

  function init() {
    initStorage();
    buildDOM();

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave, { passive: true });
    document.addEventListener('mouseenter', handlePointerEnter, { passive: true });

    // React to theme / accent class changes dynamically
    const observer = new MutationObserver(() => {
      applyColorTheme();
      updateActiveClasses();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-accent-color'] });

    updateActiveClasses();
    if (canRunCustomCursor()) {
      startPhysicsLoop();
    }
  }

  global.PK_SMOOTH_CURSOR = {
    init,
    setEnabled,
    isEnabled: () => isEnabled,
    setColor,
    getColor: () => cursorColor,
    setBadgeMode,
    getBadgeMode: () => badgeMode,
    update: () => {
      applyColorTheme();
      updateActiveClasses();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : this);
