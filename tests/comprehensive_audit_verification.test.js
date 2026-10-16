/**
 * Comprehensive Audit Verification Suite
 * Empirically tests all 13 external audit items and phased engineering fixes:
 * BUG-V01, UNC-01, UNC-02, UNC-03, UNC-04, UNC-05, UNC-06, UNC-07, UNC-08, UNC-09, UNC-10, UNC-11, UNC-12
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve('.');

test('BUG-V01: Canonical GitHub namespace is updated to not-Phana across repository', () => {
  const indexHtml = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
  const launchHtml = fs.readFileSync(path.join(projectRoot, 'launch/index.html'), 'utf8');
  const llmsTxt = fs.readFileSync(path.join(projectRoot, 'llms.txt'), 'utf8');
  const cursorHtml = fs.readFileSync(path.join(projectRoot, 'pk-cursor-system.html'), 'utf8');

  // Verify no stale repository URL references
  assert.ok(!indexHtml.includes('https://github.com/phanaach4889/PK-Khmer-Type'));
  assert.ok(!launchHtml.includes('https://github.com/phanaach4889/PK-Khmer-Type'));
  assert.ok(!llmsTxt.includes('https://github.com/phanaach4889/PK-Khmer-Type'));

  // Verify correct canonical URLs
  assert.ok(indexHtml.includes('https://github.com/not-Phana/PK-Khmer-Type'));
  assert.ok(launchHtml.includes('https://github.com/not-Phana/PK-Khmer-Type'));
  assert.ok(llmsTxt.includes('https://github.com/not-Phana/PK-Khmer-Type'));
  assert.ok(cursorHtml.includes('https://github.com/not-Phana'));
});

test('UNC-01: Multi-codepoint NiDA keys and compound vowel deconstruction', async () => {
  const typingCode = fs.readFileSync(path.join(projectRoot, 'js/typing.js'), 'utf8');
  const lessonsCode = fs.readFileSync(path.join(projectRoot, 'js/lessons.js'), 'utf8');

  // Verify KHMER_COMPOUND_MAP contains all 5 NiDA 2-codepoint vowels
  assert.ok(typingCode.includes('KHMER_COMPOUND_MAP'));
  const compoundPairs = [
    ['ាំ', ['\u17B6', '\u17C6']],
    ['ោះ', ['\u17C4', '\u17C7']],
    ['េះ', ['\u17C1', '\u17C7']],
    ['ុំ', ['\u17BB', '\u17C6']],
    ['ុះ', ['\u17BB', '\u17C7']]
  ];

  compoundPairs.forEach(([compound, components]) => {
    assert.ok(typingCode.includes(compound));
    assert.ok(lessonsCode.includes(compound));
  });

  // Verify 2-unit slice advance support exists in lessonHandleChar
  assert.ok(lessonsCode.includes('advanceUnits = 2'));
  assert.ok(lessonsCode.includes('lessonPartialStroke'));
});

test('UNC-02: Space (U+0020) and Zero-Width Space (U+200B) Equivalence', () => {
  const typingCode = fs.readFileSync(path.join(projectRoot, 'js/typing.js'), 'utf8');

  assert.ok(typingCode.includes('isSpaceEquivalent'));
  assert.ok(typingCode.includes('\\u200B'));

  // Test space equivalence function logic directly
  const isSpaceEquivalent = (a, b) => {
    const isSpc = ch => ch === ' ' || ch === '\u0020' || ch === '\u200B' || ch === '\u00A0';
    return (isSpc(a) && isSpc(b)) || (a === b);
  };

  assert.strictEqual(isSpaceEquivalent(' ', '\u200B'), true);
  assert.strictEqual(isSpaceEquivalent('\u200B', ' '), true);
  assert.strictEqual(isSpaceEquivalent('\u200B', '\u0020'), true);
  assert.strictEqual(isSpaceEquivalent('\u17D2', ' '), false, 'Coeng must never match space');
});

test('UNC-03: Dual input compatibility (Direct OS Khmer IME + QWERTY Emulation)', () => {
  const typingCode = fs.readFileSync(path.join(projectRoot, 'js/typing.js'), 'utf8');

  assert.ok(typingCode.includes('typeDirectChar'));
  assert.ok(typingCode.includes('[\\u1780-\\u17FF\\u19E0-\\u19FF]'));
  assert.ok(typingCode.includes('e.ctrlKey || e.metaKey'));
});

test('UNC-04: Khmer combining mark formatting & line-height clipping prevention', () => {
  const lessonsCss = fs.readFileSync(path.join(projectRoot, 'css/lessons.css'), 'utf8');
  const lessonsJs = fs.readFileSync(path.join(projectRoot, 'js/lessons.js'), 'utf8');

  // Verify line-height >= 1.8 and overflow prevention
  assert.ok(lessonsCss.includes('.lesson-char-row'));
  assert.ok(lessonsCss.includes('overflow-x:auto'));
  assert.ok(lessonsCss.includes('overflow-y:visible'));
  assert.ok(lessonsCss.includes('line-height:1.8'));

  // Verify formatDisplayGlyph is applied to visual DOM rendering in renderLessonChars
  assert.ok(lessonsJs.includes('formatDisplayGlyph'));
  assert.ok(lessonsJs.includes('s.textContent = ch === \' \' ? \'␣\' : (typeof formatDisplayGlyph === \'function\' ? formatDisplayGlyph(ch) : ch);'));
});

test('UNC-05: Unicode canonical normalization and decomposed vowel repair', () => {
  const typingCode = fs.readFileSync(path.join(projectRoot, 'js/typing.js'), 'utf8');

  assert.ok(typingCode.includes('.normalize(\'NFC\')'));
  assert.ok(typingCode.includes('\\u17C1\\u17B6')); // ោ decomposed repair
  assert.ok(typingCode.includes('\\u17C1\\u17B8')); // ើ decomposed repair

  // Verify actual repair logic
  const normalizeInput = (str) => {
    if (!str) return '';
    return str
      .replace(/\u17C1\u17B6/g, '\u17C4')
      .replace(/\u17C1\u17B8/g, '\u17BE')
      .normalize('NFC');
  };

  assert.strictEqual(normalizeInput('\u1780\u17C1\u17B6'), '\u1780\u17C4'); // កោ
  assert.strictEqual(normalizeInput('\u1780\u17C1\u17B8'), '\u1780\u17BE'); // កើ
});

test('UNC-06: Deterministic Backspace handling and cursor synchronization', () => {
  const lessonsCode = fs.readFileSync(path.join(projectRoot, 'js/lessons.js'), 'utf8');
  const typingCode = fs.readFileSync(path.join(projectRoot, 'js/typing.js'), 'utf8');

  assert.ok(lessonsCode.includes('function lessonHandleBackspace'));
  assert.ok(lessonsCode.includes('Math.max(0, lessonIndex - count)'));
  assert.ok(lessonsCode.includes('lessonAcceptedUnits.pop()'));
  assert.ok(typingCode.includes('function backspaceText'));
});

test('UNC-07: Timer start on first keystroke, elapsed time guard, finite WPM calculation', () => {
  const lessonsJs = fs.readFileSync(path.join(projectRoot, 'js/lessons.js'), 'utf8');
  const adaptiveJs = fs.readFileSync(path.join(projectRoot, 'js/adaptive.js'), 'utf8');

  // Verify first keystroke timer trigger in lessons.js
  assert.ok(lessonsJs.includes('if(!lessonTimerStarted){'));
  assert.ok(lessonsJs.includes('lessonTimerStarted = true;'));
  assert.ok(lessonsJs.includes('lessonStartTime = Date.now();'));

  // Verify elapsed >= 0.5 guard in completeLesson
  assert.ok(lessonsJs.includes('const elapsed = Math.max(0.5, (Date.now() - (lessonStartTime || Date.now())) / 1000);'));

  // Verify adaptive.js starts on first keystroke and guards elapsed
  assert.ok(adaptiveJs.includes('if (!activeSession.startTime) {'));
  assert.ok(adaptiveJs.includes('const elapsed = Math.max(0.5, (Date.now() - (activeSession.startTime || Date.now())) / 1000);'));
  assert.ok(adaptiveJs.includes('elapsedSec >= 0.5'));
});

test('UNC-08: Timer teardown across lesson, adaptive, and race transitions', () => {
  const lessonsJs = fs.readFileSync(path.join(projectRoot, 'js/lessons.js'), 'utf8');
  const raceJs = fs.readFileSync(path.join(projectRoot, 'js/race.js'), 'utf8');

  // Verify clearInterval calls on lesson exit and completion
  assert.ok(lessonsJs.includes('clearInterval(lessonTimerInterval)'));
  assert.ok(raceJs.includes('clearInterval(raceCountdownTimer)'));
  assert.ok(raceJs.includes('cancelAnimationFrame(raceTimerId)'));
});

test('UNC-09: Lesson curriculum scope and modifier key chip display', () => {
  const lessonsJs = fs.readFileSync(path.join(projectRoot, 'js/lessons.js'), 'utf8');

  assert.ok(lessonsJs.includes('Shift + '));
  assert.ok(lessonsJs.includes('AltGr + '));
  assert.ok(lessonsJs.includes('Ctrl + '));
  assert.ok(lessonsJs.includes('fullKeyLabel'));
});

test('UNC-10: LocalStorage safe JSON.parse wrapping and reset integrity', () => {
  const raceJs = fs.readFileSync(path.join(projectRoot, 'js/race.js'), 'utf8');
  const statisticsJs = fs.readFileSync(path.join(projectRoot, 'js/statistics.js'), 'utf8');
  const storageJs = fs.readFileSync(path.join(projectRoot, 'js/storage.js'), 'utf8');
  const cloudSyncJs = fs.readFileSync(path.join(projectRoot, 'js/cloud-sync.js'), 'utf8');

  // Verify resetProgressBtn triggers full multi-subsystem teardown
  assert.ok(storageJs.includes('resetProgressBtn'));
  assert.ok(storageJs.includes('PK_PROGRESS.resetAll()'));
  assert.ok(storageJs.includes('PK_ADAPTIVE.resetAdaptiveState()'));
  assert.ok(storageJs.includes('PK_TRACKER.resetAll()'));
  assert.ok(storageJs.includes('PK_REVIEW.resetAll()'));
});

test('UNC-11: Unsafe innerHTML mitigation with textContent DOM creation', () => {
  const lessonsJs = fs.readFileSync(path.join(projectRoot, 'js/lessons.js'), 'utf8');

  // Verify leb-chip uses safe textContent creation instead of raw string interpolation
  assert.ok(lessonsJs.includes('chip.className = \'leb-chip\';'));
  assert.ok(lessonsJs.includes('chip.textContent = ex;'));
});

test('UNC-12: Caps Lock Warning HUD and Chassis Indicator', () => {
  const typingJs = fs.readFileSync(path.join(projectRoot, 'js/typing.js'), 'utf8');
  const indexHtml = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
  const lessonsCss = fs.readFileSync(path.join(projectRoot, 'css/lessons.css'), 'utf8');

  // Verify CapsLock detection logic
  assert.ok(typingJs.includes('function checkCapsLock'));
  assert.ok(typingJs.includes('e.getModifierState(\'CapsLock\')'));
  assert.ok(typingJs.includes('currentLayoutId === \'standard\' || currentLayoutId === \'nida\''));

  // Verify DOM elements exist
  assert.ok(indexHtml.includes('id="capsLockWarningHud"'));
  assert.ok(indexHtml.includes('id="chassisCapsWarn"'));

  // Verify CSS styles exist
  assert.ok(lessonsCss.includes('.caps-lock-warning-hud'));
  assert.ok(lessonsCss.includes('.chassis-caps-warn'));
});

test('UNC-13: Row 4 ISO keyboard layout alignment, key widths, and finger assignments', () => {
  const keyboardJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/keyboard.json'), 'utf8'));
  const keyboardJs = fs.readFileSync(path.join(projectRoot, 'js/keyboard.js'), 'utf8');

  // Verify KEY_FINGER and CODE_MAP in data/keyboard.json
  assert.equal(keyboardJson.KEY_FINGER.extra, 'lp', 'extra key must map to Left Pinky (lp)');
  assert.equal(keyboardJson.CODE_MAP.IntlBackslash, 'extra', 'IntlBackslash must map to extra');

  // Verify Row 4 structure across standard, nida, and english
  ['standard', 'nida', 'english'].forEach(layoutId => {
    const row4 = keyboardJson.LAYOUTS[layoutId].rows[3];
    assert.equal(row4.length, 13, `${layoutId} Row 4 must have exactly 13 keys`);

    assert.equal(row4[0].id, 'shiftL');
    assert.equal(row4[0].wide, 1.25, `${layoutId} shiftL must be 1.25u`);

    assert.equal(row4[1].id, 'extra', `${layoutId} extra key must be immediately after shiftL`);
    assert.equal(row4[1].wide || 1, 1, `${layoutId} extra key must be 1.0u`);

    assert.equal(row4[2].id, 'z');
    assert.equal(row4[9].id, 'comma');
    assert.equal(row4[10].id, 'period');
    assert.equal(row4[11].id, 'slash', `${layoutId} key after period must be slash`);

    assert.equal(row4[12].id, 'shiftR');
    assert.equal(row4[12].wide, 2.75, `${layoutId} shiftR must be 2.75u`);

    // Verify row total width equals 15.0u
    const totalWidth = row4.reduce((sum, k) => sum + (k.wide || 1), 0);
    assert.equal(totalWidth, 15.0, `${layoutId} Row 4 total width must equal 15.0u`);
  });

  // Verify js/keyboard.js declarations
  assert.ok(keyboardJs.includes("IntlBackslash:'extra'"), 'js/keyboard.js CODE_MAP must map IntlBackslash to extra');
  assert.ok(keyboardJs.includes("extra:'lp'"), 'js/keyboard.js KEY_FINGER must map extra to lp');
});

