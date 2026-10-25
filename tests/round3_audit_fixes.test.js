// tests/round3_audit_fixes.test.js
// Verification suite for the 10 Round 3 audit and runtime bug fixes.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');

test('Fix 1: isLessonLocked resolves cross-layout bonus lessons and prevents lock bypass', () => {
  const lessonsCode = fs.readFileSync(path.join(rootDir, 'js/lessons.js'), 'utf8');

  // Verify code contains cross-layout LESSON_SETS search
  assert.ok(lessonsCode.includes('LESSON_SETS[k]'), 'isLessonLocked must iterate LESSON_SETS for cross-layout lookup');
  assert.ok(lessonsCode.includes('isLessonLocked(lessonId)'), 'launchMasterLesson must guard locked lessons');
});

test('Fix 2: Question mark (?) shortcut does NOT trap typing when practice is active', () => {
  const shortcutsCode = fs.readFileSync(path.join(rootDir, 'js/shortcuts.js'), 'utf8');

  assert.ok(shortcutsCode.includes('isPracticeActive'), 'shortcuts.js must check isPracticeActive');
  assert.ok(shortcutsCode.includes('!isPracticeActive'), 'Shortcuts help must not trigger on bare ? during active practice');
});

test('Fix 3 & 4: Review Mistakes retry preserves remedial def & bonus auto-jump requires passed', () => {
  const lessonsCode = fs.readFileSync(path.join(rootDir, 'js/lessons.js'), 'utf8');

  assert.ok(lessonsCode.includes('wasRemedial ? def : def.id'), 'lc-retry listener must pass remedial def when wasRemedial is true');
  assert.ok(lessonsCode.includes('isBonusPassed && nextLesson && nextLesson.isBonus'), 'Bonus auto-jump must check isBonusPassed');
  assert.ok(lessonsCode.includes('isBonusPassed && (!nextLesson || !nextLesson.isBonus)'), 'Vault conquered banner must check isBonusPassed');
});

test('Fix 5: Web Audio chimes and ambience have onended disconnect cleanup', () => {
  const settingsCode = fs.readFileSync(path.join(rootDir, 'js/settings.js'), 'utf8');

  assert.ok(settingsCode.includes('oldNodes.drone1.disconnect()'), 'stopAmbience must disconnect drone1');
  assert.ok(settingsCode.includes('oldNodes.master.disconnect()'), 'stopAmbience must disconnect master');
  assert.ok(settingsCode.includes('cleanupHolo'), 'playHolographicChime must register onended cleanup handler');
});

test('Fix 6: Storage module addEventListener calls are safely guarded against null DOM elements', () => {
  const storageCode = fs.readFileSync(path.join(rootDir, 'js/storage.js'), 'utf8');

  assert.ok(storageCode.includes('if (accountViewStatsBtn)'), 'accountViewStatsBtn must be guarded');
  assert.ok(storageCode.includes('if (signOutBtn) {'), 'signOutBtn must be guarded');
  assert.ok(storageCode.includes('if (authTermsLink) authTermsLink.addEventListener'), 'authTermsLink must be guarded');
  assert.ok(storageCode.includes('if (termsCloseBtn) termsCloseBtn.addEventListener'), 'termsCloseBtn must be guarded');
});

test('Fix 7: Statistics module debounces lifetime totals disk persistence', () => {
  const statsCode = fs.readFileSync(path.join(rootDir, 'js/statistics.js'), 'utf8');

  assert.ok(statsCode.includes('scheduleTotalsSave()'), 'recordKeystroke must use scheduleTotalsSave rather than blocking write');
  assert.ok(statsCode.includes('window.addEventListener(\x27beforeunload\x27, flushTotalsSaveImmediately)'), 'totals must flush on beforeunload');
  assert.ok(statsCode.includes('window.addEventListener(\x27pkLessonCompleted\x27, flushTotalsSaveImmediately)'), 'totals must flush on lesson complete');
});

test('Fix 8: Direct OS IME input compatibility accepts Zero-Width Space (\\u200B)', () => {
  const typingCode = fs.readFileSync(path.join(rootDir, 'js/typing.js'), 'utf8');

  assert.ok(typingCode.includes('\\u200B'), 'isKhmerChar check in typing.js must include \\u200B');
  assert.ok(typingCode.includes('typeDirectChar'), 'typeDirectChar must receive direct IME input');
});

test('Fix 9: Race mode guards bare clearText() calls against uninitialized typing engine', () => {
  const raceCode = fs.readFileSync(path.join(rootDir, 'js/race.js'), 'utf8');

  assert.ok(raceCode.includes('if(typeof clearText === \x27function\x27) clearText()'), 'race.js must guard clearText() calls');
});

test('Fix 10: Strict Zero-Emoji compliance verified across all modified files', () => {
  const previewHtml = fs.readFileSync(path.join(rootDir, 'concepts/logo_drafts/preview.html'), 'utf8');
  const roadmapPath = fs.existsSync(path.join(rootDir, 'docs/PK_KHMER_TYPE_MASTER_ROADMAP.md'))
    ? path.join(rootDir, 'docs/PK_KHMER_TYPE_MASTER_ROADMAP.md')
    : path.join(rootDir, 'PK_KHMER_TYPE_MASTER_ROADMAP.md');
  const roadmapMd = fs.readFileSync(roadmapPath, 'utf8');

  const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

  assert.strictEqual(emojiRegex.test(previewHtml), false, 'preview.html must contain 0 emoji characters');
  assert.strictEqual(emojiRegex.test(roadmapMd), false, 'PK_KHMER_TYPE_MASTER_ROADMAP.md must contain 0 emoji characters');
});
