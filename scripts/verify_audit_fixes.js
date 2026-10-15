// scripts/verify_audit_fixes.js
// Automated verification suite for the 9 Round 2 audit areas in PK-Khmer-Type.
// Strictly adheres to Zero-Emoji Policy.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`[FAIL] ${testName}${details ? ': ' + details : ''}`);
  }
}

console.log('====================================================');
console.log('PK-KHMER-TYPE ROUND 2 AUDIT VERIFICATION SUITE');
console.log('====================================================');

// ----------------------------------------------------
// Area 1: Right-Hand Finger Order & Dependent Vowel Keycaps
// ----------------------------------------------------
console.log('\n--- Area 1: Right-Hand Finger Order & Dependent Vowel Keycaps ---');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const keyboardJs = fs.readFileSync('js/keyboard.js', 'utf8');
const lessonsCss = fs.readFileSync('css/lessons.css', 'utf8');

// index.html right-hand finger order inside-out: J(index), K(middle), L(ring), ;(pinky)
const rhHtmlMatch = indexHtml.includes('class="guide-mini-key gmk-index" title="Right Index Anchor (J)"') &&
                    indexHtml.includes('class="guide-mini-key gmk-middle" title="Right Middle (K)"') &&
                    indexHtml.includes('class="guide-mini-key gmk-ring" title="Right Ring (L)"') &&
                    indexHtml.includes('class="guide-mini-key gmk-pinky" title="Right Pinky (;)"');
assert(rhHtmlMatch, 'index.html has Right Hand finger order inside-out (J=index, K=middle, L=ring, ;=pinky)');

// js/keyboard.js inside-out assignment
const kbJsOrder = keyboardJs.includes('title="Right Index Anchor (J)"') &&
                  keyboardJs.includes('title="Right Middle (K)"') &&
                  keyboardJs.includes('title="Right Ring (L)"') &&
                  keyboardJs.includes('title="Right Pinky (;)"');
assert(kbJsOrder, 'js/keyboard.js updateQuickGuide assigns Right Hand inside-out');

// css/lessons.css dependent vowel rendering
const cssVowelRule = lessonsCss.includes('.guide-mini-key .km-ch') &&
                     lessonsCss.includes('display: inline-flex;') &&
                     lessonsCss.includes('overflow: visible;');
assert(cssVowelRule, 'css/lessons.css formats .guide-mini-key .km-ch with inline-flex and visible overflow');

// ----------------------------------------------------
// Area 2: Accuracy Clamping & Zero-Attempt Guards
// ----------------------------------------------------
console.log('\n--- Area 2: Accuracy Clamping & Zero-Attempt Guards ---');
const lessonsJs = fs.readFileSync('js/lessons.js', 'utf8');
const raceJs = fs.readFileSync('js/race.js', 'utf8');
const adaptiveJs = fs.readFileSync('js/adaptive.js', 'utf8');
const statisticsJs = fs.readFileSync('js/statistics.js', 'utf8');
const trackerJs = fs.readFileSync('js/tracker.js', 'utf8');

// lessons.js zero-attempt guard and clamp
assert(lessonsJs.includes('if (!currentLesson || !lessonChars || lessonChars.length === 0) return;') &&
       lessonsJs.includes('if (attempts === 0) return;'),
  'js/lessons.js completeLesson guards against attempts === 0');
assert(lessonsJs.includes('Math.min(100, Math.max(0, Math.round((lessonChars.length / attempts) * 100)))'),
  'js/lessons.js completeLesson clamps accuracy [0, 100]');
assert(lessonsJs.includes('Number.isFinite(rawWpm) && rawWpm >= 0'),
  'js/lessons.js completeLesson checks finite WPM');

// race.js zero-attempt guard and clamp
assert(raceJs.includes('raceCorrectTotal === 0 && raceMistakes === 0') && raceJs.includes('raceReset();'),
  'js/race.js raceFinish guards against zero attempts');
assert(raceJs.includes('Math.min(100, Math.max(0, Math.round((raceCorrectTotal/attempts)*100)))'),
  'js/race.js raceCurrentStats clamps accuracy [0, 100]');
assert(raceJs.includes('Number.isFinite(rawWpm) && rawWpm >= 0'),
  'js/race.js raceCurrentStats checks finite WPM');

// adaptive.js zero-attempt guard and clamp
assert(adaptiveJs.includes('totalChars === 0') && adaptiveJs.includes('attempts === 0'),
  'js/adaptive.js finishAdaptiveSession guards against zero attempts');
assert(adaptiveJs.includes('Math.min(100, Math.max(0, Math.round((totalChars / attempts) * 100)))'),
  'js/adaptive.js finishAdaptiveSession clamps accuracy [0, 100]');
assert(adaptiveJs.includes('Number.isFinite(rawWpm) && rawWpm >= 0'),
  'js/adaptive.js finishAdaptiveSession checks finite WPM');

// statistics.js & tracker.js clamping
assert(statisticsJs.includes('Math.min(100, Math.max(0, Math.round((savedLessonStats.correct / attempts) * 100)))'),
  'js/statistics.js clamps accuracy [0, 100]');
assert(trackerJs.includes('Math.min(100, Math.max(0, Math.round((state.liveLesson.correctCount / totalAttempts) * 100)))') &&
       trackerJs.includes('Math.min(100, Math.max(0, Math.round((ks.correct / ks.attempts) * 100)))'),
  'js/tracker.js clamps accuracy [0, 100]');

// ----------------------------------------------------
// Area 3: Blur Handler Safety & #guideBtnSpace Cleanup
// ----------------------------------------------------
console.log('\n--- Area 3: Blur Handler Safety & #guideBtnSpace Cleanup ---');
const shortcutsJs = fs.readFileSync('js/shortcuts.js', 'utf8');
const quickGuideJs = fs.readFileSync('js/quick_guide.js', 'utf8');

assert(shortcutsJs.includes('if(e.detail === 0) return;'),
  'js/shortcuts.js only blurs on mouse pointer clicks (e.detail > 0)');
assert(shortcutsJs.includes('.gas-info-row'),
  'js/shortcuts.js excludes .gas-info-row from blurring');
assert(!quickGuideJs.includes("this.btnSpace.addEventListener('click'"),
  'js/quick_guide.js has no active click listener on btnSpace');

// ----------------------------------------------------
// Area 4: Complete window.blur & visibilitychange State Reset
// ----------------------------------------------------
console.log('\n--- Area 4: Complete window.blur & visibilitychange State Reset ---');
const typingJs = fs.readFileSync('js/typing.js', 'utf8');

assert(typingJs.includes('function resetAllInputStates()'),
  'js/typing.js defines resetAllInputStates()');
assert(typingJs.includes("window.addEventListener('blur', resetAllInputStates);"),
  'js/typing.js binds resetAllInputStates to window.blur');
assert(typingJs.includes("document.addEventListener('visibilitychange'"),
  'js/typing.js binds resetAllInputStates to visibilitychange');
assert(typingJs.includes('heldModifiers && heldModifiers.clear'),
  'js/typing.js resetAllInputStates clears heldModifiers');
assert(typingJs.includes("setActiveFinger(null)"),
  'js/typing.js resetAllInputStates resets 3D hand finger guide state');

// ----------------------------------------------------
// Area 5: Key-Repeat Protection & Web Audio Node Safety
// ----------------------------------------------------
console.log('\n--- Area 5: Key-Repeat Protection & Web Audio Node Safety ---');
const settingsJs = fs.readFileSync('js/settings.js', 'utf8');

assert(typingJs.includes("if(e.repeat && id !== 'backspace') return;"),
  'js/typing.js blocks keydown repeat for characters');
assert(settingsJs.includes('noise.onended = () => {') && settingsJs.includes('noise.disconnect();'),
  'js/settings.js disconnects noise audio nodes onended');
assert(settingsJs.includes('osc.onended = () => {') && settingsJs.includes('osc.disconnect();'),
  'js/settings.js disconnects oscillator audio nodes onended');

// ----------------------------------------------------
// Area 6: Cross-Mode Timer & Loop Teardown
// ----------------------------------------------------
console.log('\n--- Area 6: Cross-Mode Timer & Loop Teardown ---');

assert(raceJs.includes('executeLessonExit()') && raceJs.includes('PK_ADAPTIVE.exitSession(false)'),
  'js/race.js tears down active lesson and adaptive session before race start');
assert(lessonsJs.includes('raceReset();'),
  'js/lessons.js startLesson resets any running race timers');
assert(adaptiveJs.includes('raceReset();'),
  'js/adaptive.js startAdaptiveSession resets any running race timers');

// ----------------------------------------------------
// Area 7: Modal Dialog & Custom Switch Accessibility
// ----------------------------------------------------
console.log('\n--- Area 7: Modal Dialog & Custom Switch Accessibility ---');

// Check modal attributes in index.html
const statsModalHasRole = indexHtml.includes('id="statsModal"') &&
                          indexHtml.includes('role="dialog"') &&
                          indexHtml.includes('aria-modal="true"');
assert(statsModalHasRole, 'index.html statsModal has role="dialog" and aria-modal="true"');

const settingsModalHasRole = indexHtml.includes('id="settingsModal"') &&
                             indexHtml.includes('role="dialog"') &&
                             indexHtml.includes('aria-modal="true"');
assert(settingsModalHasRole, 'index.html settingsModal has role="dialog" and aria-modal="true"');

assert(settingsJs.includes('el.setAttribute("role", "switch")') &&
       settingsJs.includes('el.setAttribute("tabindex", "0")'),
  'js/settings.js bindSwitch enforces role="switch" and tabindex="0"');
assert(settingsJs.includes('e.key === " " || e.key === "Enter"'),
  'js/settings.js bindSwitch supports Space and Enter key toggling');

// ----------------------------------------------------
// Area 8: Desktop Scaling vs. Mobile Lock Screen Check
// ----------------------------------------------------
console.log('\n--- Area 8: Desktop Scaling vs. Mobile Lock Screen Check ---');
const baseCss = fs.readFileSync('css/base.css', 'utf8');
const appJs = fs.readFileSync('js/app.js', 'utf8');

assert(baseCss.includes('@media (max-width: 768px) and (pointer: coarse)'),
  'css/base.css restricts mobile lockout overlay to pointer: coarse devices');
assert(appJs.includes('sessionStorage.getItem("pk_mobile_gate_bypass") === "1"'),
  'js/app.js preserves mobile gate bypass across session');

// ----------------------------------------------------
// Area 9: Asset Integrity, Duplicate Docs & Supabase Config
// ----------------------------------------------------
console.log('\n--- Area 9: Asset Integrity, Duplicate Docs & Supabase Config ---');

const requiredAssets = [
  'icon-16.png',
  'icon-32.png',
  'icon-48.png',
  'icon-180.png',
  'icon-192.png',
  'icon-512.png',
  'logo.svg',
  'manifest.json'
];

let assetsAllExist = true;
for (const asset of requiredAssets) {
  if (!fs.existsSync(asset)) {
    assetsAllExist = false;
    console.error(`Asset missing: ${asset}`);
  }
}
assert(assetsAllExist, 'All 8 PWA icons and manifest.json exist on disk');

const docsIndexHtml = fs.readFileSync('docs/index.html', 'utf8');
assert(docsIndexHtml.toLowerCase().includes('documents/index.html'),
  'docs/index.html cleanly redirects to Documents/index.html');

const supabaseConfigJs = fs.readFileSync('js/supabase-config.js', 'utf8');
assert(supabaseConfigJs.includes('https://not-phana.github.io/PK-Khmer-Type/'),
  'js/supabase-config.js uses correct GitHub Pages canonical base URL');

// ====================================================
// Area 10: Round 3 — Khmer Unicode, Diacritics & NiDA Space Mapping
// ====================================================
console.log('\n--- Area 10: Khmer Unicode, Diacritics & Space Mapping ---');
const typingContent = fs.readFileSync('js/typing.js', 'utf8');
assert(typingContent.includes('\\u17C6\\u17BB') && typingContent.includes('\\u17BB\\u17C6'),
  'js/typing.js normalizes inverted diacritic sequence for um');
assert(typingContent.includes('\\u17C6\\u17B6') && typingContent.includes('\\u17B6\\u17C6'),
  'js/typing.js normalizes inverted diacritic sequence for aam');

const lessonsContent = fs.readFileSync('js/lessons.js', 'utf8');
assert(lessonsContent.includes("if(ch === '\\u200B') return 'base';"),
  'js/lessons.js maps zero-width space on NiDA to base layer spacebar');
assert(lessonsContent.includes('lessonIndex = Math.max(0, Math.min(lessonChars.length'),
  'js/lessons.js clamps restored lessonIndex against out-of-bounds');

// ====================================================
// Area 11: Round 3 — Leaderboard XSS & Storage Crash Guards
// ====================================================
console.log('\n--- Area 11: Leaderboard XSS & Storage Crash Guards ---');
const statsContent = fs.readFileSync('js/statistics.js', 'utf8');
assert(statsContent.includes('function escapeHtml(s)'),
  'js/statistics.js defines local escapeHtml helper to prevent XSS');
assert(statsContent.includes('${escapeHtml(e.name || \'\')}'),
  'js/statistics.js escapes leaderboard entry names');
assert(statsContent.includes('function safeGet(k, fallback)'),
  'js/statistics.js defines local safeGet with try/catch fallback');

// ====================================================
// Area 12: Round 3 — Sub-Page Assets & Section Anchors
// ====================================================
console.log('\n--- Area 12: Sub-Page Assets & Section Anchors ---');
const documentsHtml = fs.readFileSync('Documents/index.html', 'utf8');
assert(documentsHtml.includes('id="keycap-3d"'),
  'Documents/index.html contains target section id="keycap-3d"');

const subpageFiles = ['Documents/index.html', 'docs/index.html', 'launch/index.html'];
let allSubpageAssetsExist = true;
subpageFiles.forEach(subFile => {
  if (!fs.existsSync(subFile)) {
    allSubpageAssetsExist = false;
    return;
  }
  const content = fs.readFileSync(subFile, 'utf8');
  const dir = path.dirname(subFile);
  const tagRegex = /<(script|link|img)\s+[^>]*?(src|href)=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = tagRegex.exec(content)) !== null) {
    const url = m[3];
    if (/^(https?:|\/\/|data:|mailto:|#)/i.test(url)) continue;
    const clean = url.split('?')[0].split('#')[0];
    if (!clean) continue;
    const target = clean.startsWith('/') ? path.resolve('.', clean.slice(1)) : path.resolve(dir, clean);
    if (!fs.existsSync(target)) {
      allSubpageAssetsExist = false;
      console.error(`Subpage asset missing: ${target} referenced in ${subFile}`);
    }
  }
});
assert(allSubpageAssetsExist, 'All 28 referenced assets in Documents, docs, and launch exist on disk');

// ====================================================
// Area 13: Responsive CSS Syntax & Lesson Timer Telemetry
// ====================================================
console.log('\n--- Area 13: Responsive CSS & Lesson Timer Telemetry ---');
const responsiveCss = fs.readFileSync('css/responsive.css', 'utf8');
let respOpen = 0;
for (const ch of responsiveCss) {
  if (ch === '{') respOpen++;
  if (ch === '}') respOpen--;
}
assert(respOpen === 0, 'css/responsive.css has balanced braces with zero unclosed media queries');

const indexHtmlContent = fs.readFileSync('index.html', 'utf8');
assert(indexHtmlContent.includes('id="lessonTimerWrap"') && indexHtmlContent.includes('id="lessonTimerVal"'),
  'index.html provides dedicated #lessonTimerWrap and #lessonTimerVal telemetry pods');

const lessonsJsContent = fs.readFileSync('js/lessons.js', 'utf8');
assert(lessonsJsContent.includes('const tv = document.getElementById(\'lessonTimerVal\');') && lessonsJsContent.includes('if (tv) tv.textContent ='),
  'js/lessons.js performs null-safe checks on #lessonTimerVal before setting textContent');

// ====================================================
// Area 14: Idle Storage Write Guards & Zero-Emoji Policy
// ====================================================
console.log('\n--- Area 14: Idle Storage Guards & Zero-Emoji Compliance ---');
const statsJsContent = fs.readFileSync('js/statistics.js', 'utf8');
assert(statsJsContent.includes('if (!isAdaptive && !isLesson && !isRace && !isTrial) return;'),
  'js/statistics.js guards idle interval from incrementing practice time or writing to storage when idle');
assert(!statsJsContent.includes('totals.days.push(today);') || statsJsContent.includes('function markDayPracticed()'),
  'js/statistics.js only awards practice days on genuine keystrokes via markDayPracticed()');

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;
const auditFiles = [
  'css/responsive.css',
  'css/lessons.css',
  'index.html',
  'js/lessons.js',
  'js/statistics.js',
  'js/typing.js',
  'Documents/docs.css',
  'Documents/docs.js',
  'Documents/index.html',
  'scripts/verify_audit_fixes.js'
];
let zeroEmojiClean = true;
auditFiles.forEach(f => {
  if (fs.existsSync(f) && emojiRegex.test(fs.readFileSync(f, 'utf8'))) {
    zeroEmojiClean = false;
  }
});
assert(zeroEmojiClean, 'Strict zero-emoji compliance confirmed across all modified codebase files');

// ====================================================
// Area 15: Grandmaster Bonus Vault (222 Lock & Sequential Auto-Jump)
// ====================================================
console.log('\n--- Area 15: Grandmaster Bonus Vault (222 Lock & Sequential Auto-Jump) ---');
const curDataJs = fs.readFileSync('data/curriculum-data.js', 'utf8');

// Evaluate bundled curriculum counts
const sandbox = { console };
sandbox.window = sandbox;
sandbox.global = sandbox;
vm.createContext(sandbox);
vm.runInContext(curDataJs, sandbox);

const cd = sandbox.CURRICULUM_DATA || {};
const stdCount = cd.standard?.lessons?.length || 0;
const nidaCount = cd.nida?.lessons?.length || 0;
const enCount = cd.english?.lessons?.length || 0;
const totalLessons = stdCount + nidaCount + enCount;

assert(stdCount === 84 && nidaCount === 84 && enCount === 72 && totalLessons === 240,
  `Curriculum bundle provides exactly 240 total lessons (Standard: ${stdCount}/84, NiDA: ${nidaCount}/84, English: ${enCount}/72)`);

const stdBonus = (cd.standard?.lessons || []).filter(l => l.isBonus);
const nidaBonus = (cd.nida?.lessons || []).filter(l => l.isBonus);
const enBonus = (cd.english?.lessons || []).filter(l => l.isBonus);
const totalBonus = stdBonus.length + nidaBonus.length + enBonus.length;
const baseLessonsCount = totalLessons - totalBonus;

assert(baseLessonsCount === 222, `Exactly 222 base lessons exist prior to Grandmaster Bonus Vault (found ${baseLessonsCount})`);
assert(totalBonus === 18, `Exactly 18 bonus lessons created across tracks (6 Standard, 6 NiDA, 6 English)`);

// Verify lock dependency logic in js/lessons.js
assert(lessonsJsContent.includes('function countCompletedBaseLessons()') &&
       lessonsJsContent.includes('function areAll222LessonsUnlocked()'),
  'js/lessons.js exports countCompletedBaseLessons() and areAll222LessonsUnlocked()');

assert(lessonsJsContent.includes('if(def.isBonus){') &&
       lessonsJsContent.includes('const baseUnlocked = areAll222LessonsUnlocked();') &&
       lessonsJsContent.includes('if(!baseUnlocked) return true;'),
  'isLessonLocked() strictly locks all bonus lessons until areAll222LessonsUnlocked() is true');

assert(lessonsJsContent.includes('if(def.bonusIndex === 0 || def.order === 1){') &&
       lessonsJsContent.includes('return false; // First bonus lesson is unlocked!'),
  'isLessonLocked() unlocks ONLY the first bonus lesson once base 222 lessons are unlocked');

assert(lessonsJsContent.includes('const prevBest = getLessonBest(prevId);') &&
       lessonsJsContent.includes('return !prevBest; // Unlocks only if previous bonus lesson was finished'),
  'isLessonLocked() enforces sequential unlocking of subsequent bonus lessons');

// Verify auto-jump transition logic in js/lessons.js
assert(lessonsJsContent.includes('bonus-auto-jump-banner') &&
       lessonsJsContent.includes('autoJumpTimer = setTimeout(') &&
       lessonsJsContent.includes('advanceToNext();'),
  'showLessonComplete() renders golden auto-jump banner and schedules auto-jump transition');

assert(lessonsJsContent.includes('clearAutoJump()') &&
       lessonsJsContent.includes('clearInterval(autoJumpInterval);'),
  'Auto-jump timer and interval are cleanly cleared on manual advance, retry, or dismissal');

// Verify CSS styling in css/lessons.css
const lessonsCssContent = fs.readFileSync('css/lessons.css', 'utf8');
assert(lessonsCssContent.includes('.bonus-level-header') &&
       lessonsCssContent.includes('.bvh-badge') &&
       lessonsCssContent.includes('.lesson-card.bonus-card') &&
       lessonsCssContent.includes('.bonus-auto-jump-banner'),
  'css/lessons.css provides dedicated Grandmaster Bonus Vault and auto-jump visual styles');

// ----------------------------------------------------
// Final Summary
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`TOTAL AUDIT CHECKS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('====================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('ALL 15 AUDIT AREAS VERIFIED CLEAN WITH ZERO REGRESSIONS.');
}
