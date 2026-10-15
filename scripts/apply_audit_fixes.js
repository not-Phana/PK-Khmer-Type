/**
 * scripts/apply_audit_fixes.js
 * Applies minimal, surgical fixes for all 10 verified audit issues.
 */
const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, searchStr, replaceStr, label) {
  const fullPath = path.resolve(__dirname, '..', filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  const isCrlf = content.includes('\r\n');
  const normContent = content.replace(/\r\n/g, '\n');
  const normSearch = searchStr.replace(/\r\n/g, '\n');
  const normReplace = replaceStr.replace(/\r\n/g, '\n');

  if (normContent.includes(normReplace)) {
    console.log(`[ALREADY APPLIED] ${label} -> ${filePath}`);
    return;
  }

  if (!normContent.includes(normSearch)) {
    throw new Error(`Failed to find target for [${label}] in ${filePath}`);
  }

  const updatedNorm = normContent.replace(normSearch, normReplace);
  const finalContent = isCrlf ? updatedNorm.replace(/\n/g, '\r\n') : updatedNorm;
  fs.writeFileSync(fullPath, finalContent, 'utf8');
  console.log(`[APPLIED] ${label} -> ${filePath}`);
}

console.log('=== APPLYING SURGICAL AUDIT FIXES ===\n');

// ----------------------------------------------------------------------------
// Item 1: isLessonLocked cross-layout resolution & launchMasterLesson lock check
// ----------------------------------------------------------------------------
replaceInFile(
  'js/lessons.js',
  `function isLessonLocked(id){
  if(!LESSONS || !LESSONS.length) return false;
  const idx = LESSONS.findIndex(l => String(l.id) === String(id));
  if(idx < 0) return false;
  const def = LESSONS[idx];
  if(!def) return false;

  // Bonus lessons locking rule:
  // Must unlock all 222 base lessons before the Grandmaster Bonus Vault opens.
  if(def.isBonus){
    const baseUnlocked = areAll222LessonsUnlocked();
    if(!baseUnlocked) return true; // Locked until all 222 base lessons are unlocked!

    // When all 222 base lessons are unlocked, unlock ONLY the first bonus lesson!
    if(def.bonusIndex === 0){
      return false; // First bonus lesson is unlocked!
    }

    // Subsequent bonus lessons unlock sequentially only after completing the previous bonus lesson
    const prevReqId = def.unlockRequirements && def.unlockRequirements.previousLesson;
    const prevId = prevReqId || (idx > 0 ? LESSONS[idx - 1].id : null);
    if(!prevId) return false;
    const prevBest = getLessonBest(prevId);
    return !prevBest; // Unlocks only if previous bonus lesson was finished
  }

  if(idx === 0) return false;
  if(allLessonsUnlocked) return false;
  const prevReqId = def.unlockRequirements && def.unlockRequirements.previousLesson;
  const prevId = prevReqId || (idx > 0 ? LESSONS[idx - 1].id : null);
  if(!prevId) return false;
  const prevBest = getLessonBest(prevId);
  return !prevBest; // any completed attempt on the previous lesson unlocks the next one
}`,
  `function isLessonLocked(id){
  let list = LESSONS;
  let idx = (list && list.length) ? list.findIndex(l => String(l.id) === String(id)) : -1;
  if(idx < 0 && typeof LESSON_SETS !== 'undefined' && LESSON_SETS){
    for(const k of Object.keys(LESSON_SETS)){
      const subList = LESSON_SETS[k];
      if(Array.isArray(subList)){
        const found = subList.findIndex(l => String(l.id) === String(id));
        if(found >= 0){
          list = subList;
          idx = found;
          break;
        }
      }
    }
  }
  if(!list || idx < 0) return false;
  const def = list[idx];
  if(!def) return false;

  // Bonus lessons locking rule:
  // Must unlock all 222 base lessons before the Grandmaster Bonus Vault opens.
  if(def.isBonus){
    const baseUnlocked = areAll222LessonsUnlocked();
    if(!baseUnlocked) return true; // Locked until all 222 base lessons are unlocked!

    // When all 222 base lessons are unlocked, unlock ONLY the first bonus lesson!
    if(def.bonusIndex === 0){
      return false; // First bonus lesson is unlocked!
    }

    // Subsequent bonus lessons unlock sequentially only after completing the previous bonus lesson
    const prevReqId = def.unlockRequirements && def.unlockRequirements.previousLesson;
    const prevId = prevReqId || (idx > 0 ? list[idx - 1].id : null);
    if(!prevId) return false;
    const prevBest = getLessonBest(prevId);
    return !prevBest; // Unlocks only if previous bonus lesson was finished
  }

  if(idx === 0) return false;
  if(allLessonsUnlocked) return false;
  const prevReqId = def.unlockRequirements && def.unlockRequirements.previousLesson;
  const prevId = prevReqId || (idx > 0 ? list[idx - 1].id : null);
  if(!prevId) return false;
  const prevBest = getLessonBest(prevId);
  return !prevBest; // any completed attempt on the previous lesson unlocks the next one
}`,
  'Item 1: isLessonLocked cross-layout resolution'
);

replaceInFile(
  'js/lessons.js',
  `  window.launchMasterLesson = function(lessonId, layoutId) {
    if(layoutId && typeof switchLayout === 'function' && currentLayoutId !== layoutId) {
      switchLayout(layoutId);
    }`,
  `  window.launchMasterLesson = function(lessonId, layoutId) {
    if(isLessonLocked(lessonId)) {
      if(typeof showToast === 'function') {
        const isKm = document.documentElement.classList.contains('site-km-mode');
        showToast(
          pkIcon('lock', 16),
          isKm ? 'វគ្គនេះជាប់សោ' : 'Lesson Locked',
          isKm ? 'សូមបញ្ចប់មេរៀនគ្រឹះទាំង ២២២ ជាមុនសិន។' : 'Complete all 222 base lessons to unlock the Grandmaster Vault.'
        );
      }
      return;
    }
    if(layoutId && typeof switchLayout === 'function' && currentLayoutId !== layoutId) {
      switchLayout(layoutId);
    }`,
  'Item 1: launchMasterLesson lock check'
);

// ----------------------------------------------------------------------------
// Item 2: Question Mark Shortcut Traps English Typing Practice
// ----------------------------------------------------------------------------
replaceInFile(
  'js/shortcuts.js',
  `    if(isTextInput) return;

    // Shortcuts Cheat Sheet (? or Ctrl+/ or F1)
    if(e.key === '?' || (e.ctrlKey && e.key === '/') || e.key === 'F1'){
      e.preventDefault();
      toggleShortcutsModal();
      return;
    }`,
  `    if(isTextInput) return;

    const isPracticeActive = (typeof lessonActive !== 'undefined' && lessonActive) ||
      (typeof adaptiveActive !== 'undefined' && adaptiveActive) ||
      (typeof raceMode !== 'undefined' && raceMode) ||
      (typeof trialActive !== 'undefined' && trialActive);

    // Shortcuts Cheat Sheet: Ctrl+/ or F1 anywhere, or '?' only when not in active practice
    const isShortcutHelp = (e.ctrlKey && e.key === '/') || e.key === 'F1' || (e.key === '?' && !isPracticeActive && !e.ctrlKey && !e.altKey && !e.metaKey);
    if(isShortcutHelp){
      e.preventDefault();
      toggleShortcutsModal();
      return;
    }`,
  'Item 2: Question mark shortcut trap fix'
);

// ----------------------------------------------------------------------------
// Item 3: "Review Mistakes" Retry Button Inoperative
// Item 4: Bonus Lesson Auto-Jump Triggers on FAILED Lessons
// ----------------------------------------------------------------------------
replaceInFile(
  'js/lessons.js',
  `  remedialActive = false;

  document.body.appendChild(overlay);`,
  `  const wasRemedial = remedialActive;
  remedialActive = false;

  document.body.appendChild(overlay);`,
  'Item 3: Capture wasRemedial in showLessonComplete'
);

replaceInFile(
  'js/lessons.js',
  `  const retryBtn = overlay.querySelector('.lc-retry');
  if(retryBtn){
    retryBtn.addEventListener('click', ()=>{
      dismissOverlay();
      startLesson(remedialActive ? def : def.id);
    });
  }`,
  `  const retryBtn = overlay.querySelector('.lc-retry');
  if(retryBtn){
    retryBtn.addEventListener('click', ()=>{
      dismissOverlay();
      startLesson(wasRemedial ? def : def.id);
    });
  }`,
  'Item 3: Pass wasRemedial in lc-retry listener'
);

replaceInFile(
  'js/lessons.js',
  `  // Grandmaster Bonus Auto-Jump:
  // If the completed lesson was a bonus lesson and a subsequent bonus lesson exists,
  // display the golden auto-jump banner and smoothly jump directly to that lesson.
  if(def && def.isBonus && nextLesson && nextLesson.isBonus){`,
  `  // Grandmaster Bonus Auto-Jump:
  // If the completed lesson was a bonus lesson, passed threshold, and subsequent bonus lesson exists,
  // display the golden auto-jump banner and smoothly jump directly to that lesson.
  const bonusThreshold = (def && def.threshold) || 85;
  const isBonusPassed = accuracy >= bonusThreshold;
  if(def && def.isBonus && isBonusPassed && nextLesson && nextLesson.isBonus){`,
  'Item 4: Bonus Auto-Jump condition requires passed'
);

replaceInFile(
  'js/lessons.js',
  `  } else if(def && def.isBonus && (!nextLesson || !nextLesson.isBonus)){`,
  `  } else if(def && def.isBonus && isBonusPassed && (!nextLesson || !nextLesson.isBonus)){`,
  'Item 4: Grandmaster Vault Conquered banner requires passed'
);

// ----------------------------------------------------------------------------
// Item 5: Web Audio Node Memory Leaks in Chimes and Ambience
// ----------------------------------------------------------------------------
replaceInFile(
  'js/settings.js',
  `function stopAmbience() {
  if (!ambienceNodes) return;
  try {
    const t = audioCtx.currentTime;
    ambienceNodes.master.gain.linearRampToValueAtTime(0, t + 0.5);
    const oldNodes = ambienceNodes;
    ambienceNodes = null;
    setTimeout(() => {
      try {
        oldNodes.drone1.stop();
        oldNodes.drone2.stop();
        oldNodes.lfo.stop();
      } catch (e) {}
    }, 550);
  } catch (e) {
    ambienceNodes = null;
  }
}`,
  `function stopAmbience() {
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
}`,
  'Item 5: Disconnect ambience nodes on stopAmbience'
);

replaceInFile(
  'js/settings.js',
  `      gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.07 + 0.5);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t + i * 0.07);
      osc.stop(t + i * 0.07 + 0.55);`,
  `      gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.07 + 0.5);
      osc.connect(gain).connect(audioCtx.destination);
      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch (_e) {}
      };
      osc.start(t + i * 0.07);
      osc.stop(t + i * 0.07 + 0.55);`,
  'Item 5: playChime onended audio node disconnect'
);

replaceInFile(
  'js/settings.js',
  `      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.22);
      osc2.stop(now + 0.22);`,
  `      osc1.connect(gain);
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
      osc2.stop(now + 0.22);`,
  'Item 5: playHolographicChime onended cleanup'
);

// ----------------------------------------------------------------------------
// Item 6: Unguarded addEventListener Calls in Storage Module
// ----------------------------------------------------------------------------
replaceInFile(
  'js/storage.js',
  `  document.getElementById('accountViewStatsBtn').addEventListener('click', () => {
    authModal.hidden = true;
    const btn = document.getElementById('statsOpenBtn');
    if (btn) btn.click();
  });
  document.getElementById('accountSettingsBtn').addEventListener('click', () => {
    authModal.hidden = true;
    const btn = document.getElementById('settingsOpenBtn');
    if (btn) btn.click();
  });

  authOpenBtn.addEventListener('click', openAccountModal);
  authAccountChip.addEventListener('click', openAccountModal);
  if (cloudSyncStatusBadge) {
    cloudSyncStatusBadge.addEventListener('click', openAccountModal);
  }

  function closeAuthModal() {
    closeModalAnimated(authModal);
  }
  authCloseBtn.addEventListener('click', closeAuthModal);
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) closeAuthModal();
  });
  authModal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAuthModal();
  });

  document.getElementById('gotoSignUpBtn').addEventListener('click', () => showAuthPanel(signUpForm, 'Sign Up'));
  document.getElementById('gotoSignInBtn').addEventListener('click', () => showAuthPanel(signInForm, 'Sign In'));
  document.getElementById('forgotPasswordLink').addEventListener('click', () => showAuthPanel(forgotForm, 'Reset Password'));
  document.getElementById('backToSignInBtn').addEventListener('click', () => showAuthPanel(signInForm, 'Sign In'));`,
  `  const accountViewStatsBtn = document.getElementById('accountViewStatsBtn');
  if (accountViewStatsBtn) {
    accountViewStatsBtn.addEventListener('click', () => {
      authModal.hidden = true;
      const btn = document.getElementById('statsOpenBtn');
      if (btn) btn.click();
    });
  }
  const accountSettingsBtn = document.getElementById('accountSettingsBtn');
  if (accountSettingsBtn) {
    accountSettingsBtn.addEventListener('click', () => {
      authModal.hidden = true;
      const btn = document.getElementById('settingsOpenBtn');
      if (btn) btn.click();
    });
  }

  if (authOpenBtn) authOpenBtn.addEventListener('click', openAccountModal);
  if (authAccountChip) authAccountChip.addEventListener('click', openAccountModal);
  if (cloudSyncStatusBadge) {
    cloudSyncStatusBadge.addEventListener('click', openAccountModal);
  }

  function closeAuthModal() {
    closeModalAnimated(authModal);
  }
  if (authCloseBtn) authCloseBtn.addEventListener('click', closeAuthModal);
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) closeAuthModal();
    });
    authModal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAuthModal();
    });
  }

  const gotoSignUpBtn = document.getElementById('gotoSignUpBtn');
  if (gotoSignUpBtn) gotoSignUpBtn.addEventListener('click', () => showAuthPanel(signUpForm, 'Sign Up'));
  const gotoSignInBtn = document.getElementById('gotoSignInBtn');
  if (gotoSignInBtn) gotoSignInBtn.addEventListener('click', () => showAuthPanel(signInForm, 'Sign In'));
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  if (forgotPasswordLink) forgotPasswordLink.addEventListener('click', () => showAuthPanel(forgotForm, 'Reset Password'));
  const backToSignInBtn = document.getElementById('backToSignInBtn');
  if (backToSignInBtn) backToSignInBtn.addEventListener('click', () => showAuthPanel(signInForm, 'Sign In'));`,
  'Item 6: Guard account modal buttons in storage.js'
);

replaceInFile(
  'js/storage.js',
  `  /* ---------- Sign Out ---------- */
  document.getElementById('signOutBtn').addEventListener('click', async () => {
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) signOutBtn.disabled = true;`,
  `  /* ---------- Sign Out ---------- */
  const signOutBtn = document.getElementById('signOutBtn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', async () => {
      signOutBtn.disabled = true;`,
  'Item 6: Guard signOutBtn listener in storage.js'
);

replaceInFile(
  'js/storage.js',
  `    try {
      sessionStorage.setItem(
        'khmerPostAuthToast',
        JSON.stringify({
          icon: pkIcon('user', 18),
          title: 'Signed Out',
          sub: 'Your progress is safely synced to the cloud.'
        })
      );
    } catch (e) {}
    location.reload();
  });`,
  `    try {
      sessionStorage.setItem(
        'khmerPostAuthToast',
        JSON.stringify({
          icon: pkIcon('user', 18),
          title: 'Signed Out',
          sub: 'Your progress is safely synced to the cloud.'
        })
      );
    } catch (e) {}
    location.reload();
    });
  }`,
  'Item 6: Close signOutBtn guard block in storage.js'
);

replaceInFile(
  'js/storage.js',
  `  /* ---------- Terms & Conditions Modal ---------- */
  const termsModal = document.getElementById('termsModal');
  const termsCloseBtn = document.getElementById('termsCloseBtn');
  const termsAckBtn = document.getElementById('termsAckBtn');
  function openTermsModal() {
    termsModal.hidden = false;
    requestAnimationFrame(() => termsAckBtn.focus());
  }
  function closeTermsModal() {
    closeModalAnimated(termsModal);
  }
  document.getElementById('authTermsLink').addEventListener('click', openTermsModal);
  termsCloseBtn.addEventListener('click', closeTermsModal);
  termsAckBtn.addEventListener('click', () => {
    document.getElementById('signUpTerms').checked = true;
    closeTermsModal();
  });
  termsModal.addEventListener('click', (e) => {
    if (e.target === termsModal) closeTermsModal();
  });
  termsModal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTermsModal();
  });`,
  `  /* ---------- Terms & Conditions Modal ---------- */
  const termsModal = document.getElementById('termsModal');
  const termsCloseBtn = document.getElementById('termsCloseBtn');
  const termsAckBtn = document.getElementById('termsAckBtn');
  function openTermsModal() {
    if (termsModal) {
      termsModal.hidden = false;
      if (termsAckBtn) requestAnimationFrame(() => termsAckBtn.focus());
    }
  }
  function closeTermsModal() {
    if (termsModal) closeModalAnimated(termsModal);
  }
  const authTermsLink = document.getElementById('authTermsLink');
  if (authTermsLink) authTermsLink.addEventListener('click', openTermsModal);
  if (termsCloseBtn) termsCloseBtn.addEventListener('click', closeTermsModal);
  if (termsAckBtn) {
    termsAckBtn.addEventListener('click', () => {
      const signUpTerms = document.getElementById('signUpTerms');
      if (signUpTerms) signUpTerms.checked = true;
      closeTermsModal();
    });
  }
  if (termsModal) {
    termsModal.addEventListener('click', (e) => {
      if (e.target === termsModal) closeTermsModal();
    });
    termsModal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeTermsModal();
    });
  }`,
  'Item 6: Guard terms modal buttons in storage.js'
);

// ----------------------------------------------------------------------------
// Item 7: Double Synchronous localStorage Writes on Every Keystroke
// ----------------------------------------------------------------------------
replaceInFile(
  'js/statistics.js',
  `  const origRecordKeystroke = recordKeystroke;
  recordKeystroke = function(correct){
    const isAdaptiveActive = (typeof PK_ADAPTIVE !== 'undefined' && typeof PK_ADAPTIVE.isActive === 'function' && PK_ADAPTIVE.isActive());
    if((typeof lessonActive === 'undefined' || !lessonActive) && !isAdaptiveActive) return;
    origRecordKeystroke(correct);
    markDayPracticed();
    totals.keys = savedLessonStats.keys;
    totals.correct = savedLessonStats.correct;
    const wpmNow = parseInt(statWpmEl.textContent, 10) || 0;
    if(wpmNow > totals.bestWpm) totals.bestWpm = wpmNow;
    safeSet(LS.totals, JSON.stringify(totals));
  };`,
  `  let totalsSaveTimer = null;
  function scheduleTotalsSave(){
    if(!totalsSaveTimer){
      totalsSaveTimer = setTimeout(() => {
        totalsSaveTimer = null;
        safeSet(LS.totals, JSON.stringify(totals));
      }, 1000);
    }
  }
  function flushTotalsSaveImmediately(){
    if(totalsSaveTimer){
      clearTimeout(totalsSaveTimer);
      totalsSaveTimer = null;
    }
    safeSet(LS.totals, JSON.stringify(totals));
  }
  if(typeof window !== 'undefined'){
    window.addEventListener('beforeunload', flushTotalsSaveImmediately);
    window.addEventListener('pkLessonCompleted', flushTotalsSaveImmediately);
  }

  const origRecordKeystroke = recordKeystroke;
  recordKeystroke = function(correct){
    const isAdaptiveActive = (typeof PK_ADAPTIVE !== 'undefined' && typeof PK_ADAPTIVE.isActive === 'function' && PK_ADAPTIVE.isActive());
    if((typeof lessonActive === 'undefined' || !lessonActive) && !isAdaptiveActive) return;
    origRecordKeystroke(correct);
    markDayPracticed();
    totals.keys = savedLessonStats.keys;
    totals.correct = savedLessonStats.correct;
    const wpmNow = parseInt(statWpmEl.textContent, 10) || 0;
    if(wpmNow > totals.bestWpm) totals.bestWpm = wpmNow;
    scheduleTotalsSave();
  };`,
  'Item 7: Debounce totals disk persistence in statistics.js'
);

// ----------------------------------------------------------------------------
// Item 8: Zero-Width Space (\u200B) in Native Khmer IME Range
// ----------------------------------------------------------------------------
replaceInFile(
  'js/typing.js',
  String.raw`  // Dual Input Compatibility:
  // 1. If event.key is already in the Khmer Unicode range, process it directly without double-mapping event.code
  const isKhmerChar = e.key && /[\u1780-\u17FF\u19E0-\u19FF]/.test(e.key);`,
  String.raw`  // Dual Input Compatibility:
  // 1. If event.key is already in the Khmer Unicode range, process it directly without double-mapping event.code
  const isKhmerChar = e.key && /[\u1780-\u17FF\u19E0-\u19FF\u200B]/.test(e.key);`,
  'Item 8: Add U+200B to native IME range in typing.js'
);

// ----------------------------------------------------------------------------
// Item 9: Bare clearText() Calls in Race Mode
// ----------------------------------------------------------------------------
replaceInFile(
  'js/race.js',
  `  clearText();
  newTrialWord();`,
  `  if(typeof clearText === 'function') clearText();
  else if(typeof window !== 'undefined' && typeof window.clearText === 'function') window.clearText();
  newTrialWord();`,
  'Item 9: Guard clearText in startTrial'
);

replaceInFile(
  'js/race.js',
  `      setTimeout(()=>{ clearText(); newTrialWord(); }, 950);`,
  `      setTimeout(()=>{
        if(typeof clearText === 'function') clearText();
        else if(typeof window !== 'undefined' && typeof window.clearText === 'function') window.clearText();
        newTrialWord();
      }, 950);`,
  'Item 9: Guard clearText in trial input callback'
);

// ----------------------------------------------------------------------------
// Item 10: Strict Zero-Emoji Rule Audit
// ----------------------------------------------------------------------------
replaceInFile(
  'concepts/logo_drafts/preview.html',
  `<button class="btn" onclick="document.body.classList.toggle('light-mode')">\u{1F313} Toggle Light / Dark Mode</button>`,
  `<button class="btn" onclick="document.body.classList.toggle('light-mode')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20Z" fill="currentColor"/></svg> Toggle Light / Dark Mode</button>`,
  'Item 10: Replace emoji with inline SVG in preview.html'
);

replaceInFile(
  'PK_KHMER_TYPE_MASTER_ROADMAP.md',
  `subgraph BASELINE ["\u{1F3C1} COMPLETED FOUNDATION (PHASES 1–9)"]`,
  `subgraph BASELINE ["[MILESTONE] COMPLETED FOUNDATION (PHASES 1–9)"]`,
  'Item 10: Replace emoji in roadmap diagram'
);

replaceInFile(
  'PK_KHMER_TYPE_MASTER_ROADMAP.md',
  `SIGN_OFF["\u{1F3C6} PK Khmer Type Production Ready"]:::done`,
  `SIGN_OFF["[ACHIEVEMENT] PK Khmer Type Production Ready"]:::done`,
  'Item 10: Replace trophy emoji in roadmap diagram'
);

console.log('\n=== ALL 10 ITEMS APPLIED CLEANLY ===');
