const fs = require('fs');

console.log('=== AUDIT VERIFICATION ===');

// 1. Home row & finger guide
const indexHtml = fs.readFileSync('index.html', 'utf8');
const hasPinkyA = indexHtml.includes('title="Left Pinky (A)"');
const hasIndexF = indexHtml.includes('title="Left Index Anchor (F)"');
const hasIndexJ = indexHtml.includes('title="Right Index Anchor (J)"');
const hasPinkySemi = indexHtml.includes('title="Right Pinky (;)"');
console.log('1. Home Row & Finger Guide:', (hasPinkyA && hasIndexF && hasIndexJ && hasPinkySemi) ? 'PASS' : 'FAIL');

// 2. Canonical & Domain URLs
const canonicalOk = indexHtml.includes('<link rel="canonical" href="https://not-phana.github.io/PK-Khmer-Type/">');
const staleUrls = (indexHtml.match(/phanaach4889\.github\.io/g) || []).length;
console.log('2. Canonical & Domain URLs:', (canonicalOk && staleUrls === 0) ? 'PASS (0 stale URLs)' : 'FAIL');

// 3. Shortcuts Alt+H and Alt+S
const hasAltH = indexHtml.includes('<kbd class="guide-kbd">Alt + H</kbd>');
const hasAltS = indexHtml.includes('<kbd class="guide-kbd">Alt + S</kbd>');
console.log('3. Shortcuts Alt+H and Alt+S:', (hasAltH && hasAltS) ? 'PASS' : 'FAIL');

// 4. Dynamic Sidebar Updates
const kbJs = fs.readFileSync('js/keyboard.js', 'utf8');
const updatesBadge = kbJs.includes("layoutBadge.className = 'gdh-badge badge-eng'") && kbJs.includes("layoutBadge.className = 'gdh-badge badge-nida'");
const updatesRules = kbJs.includes("cheatTitle.textContent = isKm ? 'គោលការណ៍វាយអក្សរអង់គ្លេស' : 'Touch Typing Principles'");
console.log('4. Dynamic Sidebar Updates in JS:', (updatesBadge && updatesRules) ? 'PASS' : 'FAIL');

// 5. Accessibility & Focus Stealing
const spaceBtnSlice = indexHtml.substring(indexHtml.indexOf('id="guideBtnSpace"') - 40, indexHtml.indexOf('id="guideBtnSpace"') + 60);
const noRoleButton = !spaceBtnSlice.includes('role="button"') && !spaceBtnSlice.includes('tabindex');
const shortcutsJs = fs.readFileSync('js/shortcuts.js', 'utf8');
const hasBlurHandler = shortcutsJs.includes('.toolbar button, .guide-dock button, .guide-dock .gas-btn') && shortcutsJs.includes('btn.blur()');
console.log('5. Accessibility & Focus Stealing:', (noRoleButton && hasBlurHandler) ? 'PASS' : 'FAIL');

// Step 2: Engine Audit
const lessonsJs = fs.readFileSync('js/lessons.js', 'utf8');
const accuracySafe = lessonsJs.includes('attempts > 0 ? Math.round((lessonChars.length / attempts) * 100) : 100;');
const timerNullReset = lessonsJs.includes('lessonTimerInterval = null;');
const raceJs = fs.readFileSync('js/race.js', 'utf8');
const raceTimerSafe = raceJs.includes('clearInterval(raceCountdownTimer);') && raceJs.includes('raceCountdownTimer = null;');
const typingJs = fs.readFileSync('js/typing.js', 'utf8');
const blurComposingReset = typingJs.includes('isComposing = false;');
console.log('Step 2: Engine Audit (NaN guard, Timer cleanup, isComposing blur reset):',
  (accuracySafe && timerNullReset && raceTimerSafe && blurComposingReset) ? 'PASS' : 'FAIL'
);
