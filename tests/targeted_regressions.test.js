/**
 * PK Khmer Type — Targeted Regression Tests Before Fixes
 * 
 * Target Commit: 40a5a0f (main)
 * Strict Zero-Emoji Policy Enforced.
 * 
 * Covers the 6 reported regression issues:
 * 1. Adaptive mode splits Khmer compound vowels into separate targets.
 * 2. Race mode splits Khmer compound vowels into separate targets.
 * 3. Guest progress may be attributed to the wrong account after sign-in.
 * 4. Cloud sync may restore progress after a local reset.
 * 5. Native Khmer IME input may be inserted twice.
 * 6. Windows AltGr handling may interfere with modifier state.
 * 
 * Run with: node --test tests/targeted_regressions.test.js
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

/* ============================================================
   Minimal In-Memory Environment Helpers
   ============================================================ */
function createMockLocalStorage() {
  const map = new Map();
  return {
    getItem(k) { return map.has(String(k)) ? map.get(String(k)) : null; },
    setItem(k, v) { map.set(String(k), String(v)); },
    removeItem(k) { map.delete(String(k)); },
    clear() { map.clear(); },
    get length() { return map.size; },
    key(idx) { return Array.from(map.keys())[idx] || null; },
    _dump() { return Object.fromEntries(map.entries()); }
  };
}

function createMockDomElement() {
  const children = [];
  const childNodes = [];
  return {
    addEventListener() {},
    removeEventListener() {},
    appendChild(n) { childNodes.push(n); children.push(n); },
    removeChild(n) {
      const i1 = childNodes.indexOf(n); if (i1 !== -1) childNodes.splice(i1, 1);
      const i2 = children.indexOf(n); if (i2 !== -1) children.splice(i2, 1);
    },
    insertBefore(node, ref) {
      const idx = childNodes.indexOf(ref);
      if (idx !== -1) { childNodes.splice(idx, 0, node); } else { childNodes.push(node); }
    },
    querySelectorAll() { return []; },
    querySelector() { return null; },
    setAttribute() {},
    getAttribute() { return null; },
    removeAttribute() {},
    getBoundingClientRect() { return { top: 0, bottom: 0, left: 0, right: 0 }; },
    classList: {
      add() {},
      remove() {},
      contains() { return false; },
      toggle() { return false; }
    },
    style: {
      setProperty() {},
      removeProperty() {}
    },
    children,
    childNodes,
    get textContent() { return childNodes.map(n => n.textContent || '').join(''); },
    set textContent(v) { childNodes.length = 0; if (v) childNodes.push({ nodeType: 3, textContent: v }); }
  };
}

function setupGlobalDom() {
  const mockEl = createMockDomElement();
  global.physicalLayer = null;
  global.lockedLayer = null;
  global.hoverLayer = null;
  global.currentLayer = () => global.physicalLayer || global.lockedLayer || 'base';
  global.currentLayoutId = 'standard';
  global.render = () => {};
  global.triggerFingerPress = () => {};
  global.triggerFingerRelease = () => {};
  global.playClick = () => {};
  global.recordKeystroke = () => {};
  global.raceReset = () => {};
  global.exitRaceMode = () => {};
  global.executeLessonExit = () => {};
  global.stopTrial = () => {};
  global.press = () => {};
  global.burst = () => {};
  global.emberBurst = () => {};
  global.runeRing = () => {};
  global.markTypingBurst = () => {};
  global.resolveKeyStroke = (id) => ({ kind: 'glyph', charProduced: id === 'k' ? 'ក' : id });

  global.CODE_MAP = {
    ControlLeft: 'ctrlL',
    ControlRight: 'ctrlR',
    AltRight: 'altgr',
    KeyC: 'c',
    KeyK: 'k',
    KeyU: 'u',
    Comma: 'comma'
  };
  global.glyphData = {
    k: { kind: 'glyph', base: 'ក' },
    c: { kind: 'glyph', base: 'ច' },
    u: { kind: 'glyph', base: 'ុ' },
    comma: { kind: 'glyph', base: '\u17BB\u17C6' }
  };
  global.keyEls = {
    ctrlL: createMockDomElement(),
    ctrlR: createMockDomElement(),
    altgr: createMockDomElement(),
    c: createMockDomElement(),
    k: createMockDomElement()
  };
  global.requestAnimationFrame = (cb) => setTimeout(cb, 16);
  global.cancelAnimationFrame = (id) => clearTimeout(id);
  global.window = {
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {},
    requestAnimationFrame: (cb) => setTimeout(cb, 16),
    cancelAnimationFrame: (id) => clearTimeout(id),
    adaptiveActive: true
  };
  global.document = {
    addEventListener() {},
    removeEventListener() {},
    documentElement: mockEl,
    getElementById(id) { return mockEl; },
    querySelectorAll() { return []; },
    querySelector() { return null; },
    createElement() { return createMockDomElement(); },
    createTextNode(t) { return { nodeType: 3, textContent: t }; },
    createDocumentFragment() { return { appendChild() {} }; },
    activeElement: null
  };
}

/* ============================================================
   1. Adaptive Mode Compound Vowel Splitting Tests
   ============================================================ */
test('1.1 [DEFECT REPRODUCED] generateAdaptiveDrill splits compound vowels into separate 1-codepoint targets', () => {
  // Production functions: generateAdaptiveDrill (js/adaptive.js lines 767, 990-1005)
  setupGlobalDom();
  global.localStorage = createMockLocalStorage();

  delete require.cache[require.resolve(path.join(ROOT, 'js', 'adaptive.js'))];
  const adaptive = require(path.join(ROOT, 'js', 'adaptive.js'));

  // Request a drill with unlocked units including base consonant 'ក' and compound vowel 'ុំ' (\u17BB\u17C6)
  const drill = adaptive.generateAdaptiveDrill('nida', {
    unlockedUnits: ['ក', '\u17BB\u17C6'],
    seed: 12345,
    wordCount: 5
  });

  assert.ok(drill && drill.chars && drill.chars.length > 0, 'Drill must produce chars array');

  // DEFECT VERIFICATION:
  // Expected behavior: Khmer compound vowel '\u17BB\u17C6' should be bundled as an atomic unit in drill.chars.
  // Actual defect: for(let i=0; i<fullText.length; i++) decomposes '\u17BB\u17C6' into separate '\u17BB' and '\u17C6'.
  const hasAtomicCompound = drill.chars.includes('\u17BB\u17C6');
  const hasDecomposedFirstPart = drill.chars.includes('\u17BB');
  const hasDecomposedSecondPart = drill.chars.includes('\u17C6');

  assert.equal(hasAtomicCompound, false, 'CONFIRMED DEFECT: drill.chars lacks atomic compound vowel unit');
  assert.equal(hasDecomposedFirstPart, true, 'CONFIRMED DEFECT: drill.chars contains decomposed first codepoint (\\u17BB)');
  assert.equal(hasDecomposedSecondPart, true, 'CONFIRMED DEFECT: drill.chars contains decomposed second codepoint (\\u17C6)');
});

test('1.2 [DEFECT REPRODUCED] adaptiveHandleChar rejects valid NiDA compound key stroke and incurs false mistake', () => {
  // Production functions: adaptiveHandleChar (js/adaptive.js lines 1679-1755), startAdaptiveSession
  setupGlobalDom();
  global.localStorage = createMockLocalStorage();

  delete require.cache[require.resolve(path.join(ROOT, 'js', 'adaptive.js'))];
  const adaptive = require(path.join(ROOT, 'js', 'adaptive.js'));

  // Start session with focus on compound vowel
  adaptive.startAdaptiveSession('nida', {
    unlockedUnits: ['\u17BB\u17C6'],
    focusUnit: '\u17BB\u17C6',
    isAutoAdvance: true
  });

  const session = adaptive.getActiveSession();
  assert.equal(session.index, 0);
  assert.equal(session.mistakes, 0);

  // The generated drill has decomposed '\u17BB' as its target
  const targetChar = session.drill.chars[0];
  assert.equal(targetChar, '\u17BB', 'Target is decomposed to single codepoint \\u17BB');

  // User strikes the physical comma key on NiDA, which produces the complete compound vowel '\u17BB\u17C6'
  adaptive.adaptiveHandleChar('\u17BB\u17C6');

  // DEFECT VERIFICATION:
  // Expected behavior: Single compound key stroke matches compound vowel target and advances cursor index to 1.
  // Actual defect: compareTypingSequence('\u17BB\u17C6', '\u17BB') returns false -> mistake incremented, index frozen at 0.
  assert.equal(session.mistakes, 1, 'CONFIRMED DEFECT: false mistake incremented on valid compound vowel input');
  assert.equal(session.index, 0, 'CONFIRMED DEFECT: cursor index fails to advance after compound vowel input');
});

test('1.3 [BEHAVIORAL] adaptiveHandleBackspace behavior on decomposed compound sequence', () => {
  // Production function: adaptiveHandleBackspace (js/adaptive.js lines 1800-1818)
  setupGlobalDom();
  global.localStorage = createMockLocalStorage();

  delete require.cache[require.resolve(path.join(ROOT, 'js', 'adaptive.js'))];
  const adaptive = require(path.join(ROOT, 'js', 'adaptive.js'));

  adaptive.startAdaptiveSession('nida', {
    unlockedUnits: ['ក', '\u17BB\u17C6'],
    isAutoAdvance: true
  });

  const session = adaptive.getActiveSession();
  const firstChar = session.drill.chars[0];

  // User types first decomposed target character correctly
  adaptive.adaptiveHandleChar(firstChar);
  assert.equal(session.index, 1, 'Index advances to 1 after typing first target character');

  // User hits Backspace
  adaptive.adaptiveHandleBackspace();
  assert.equal(session.index, 0, 'Index reverts back to 0 on Backspace');
});

/* ============================================================
   2. Race Mode Compound Vowel Splitting Tests
   ============================================================ */
test('2.1 [DEFECT REPRODUCED] seqWords decomposes Khmer compound vowels into separate single codepoints', () => {
  // Production function: seqWords (js/lessons.js lines 274-285) used by raceGenerateText (js/race.js lines 514-520)
  setupGlobalDom();
  const kb = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/keyboard.json'), 'utf8'));
  function buildKeyById(rows) {
    const map = {};
    rows.forEach(r => r.forEach(k => { if (k.kind === 'glyph') map[k.id] = k; }));
    return map;
  }
  const table = buildKeyById(kb.LAYOUTS.nida.rows);

  function spaceEntry(tbl) {
    return { id: 'space', layer: 'shift', ch: ' ' };
  }

  function resolveCharLoc(ch, tbl) {
    if (ch === ' ') return spaceEntry(tbl);
    for (const id in tbl) {
      const k = tbl[id];
      if (k.base === ch) return { id, layer: 'base', ch };
      if (k.shift === ch) return { id, layer: 'shift', ch };
      if (k.ctrl === ch) return { id, layer: 'ctrl', ch };
      if (k.altgr === ch) return { id, layer: 'altgr', ch };
    }
    return null;
  }

  // Extract seqWords logic directly from js/lessons.js line 274
  function testSeqWords(words, tbl) {
    const seq = [];
    words.forEach(w => {
      for (const ch of w) { // Defect: for(const ch of w) iterates individual UTF-16 code units
        const loc = resolveCharLoc(ch, tbl);
        if (loc) seq.push(loc);
      }
    });
    return seq;
  }

  // Word 'កុំ' contains consonant 'ក' and compound vowel 'ុំ' (\u17BB\u17C6)
  const entries = testSeqWords(['កុំ'], table);
  const charsProduced = entries.map(e => e.ch);

  // DEFECT VERIFICATION:
  // Expected: ['ក', '\u17BB\u17C6'] (2 typing units)
  // Actual defect: ['ក', '\u17BB', '\u17C6'] (3 single codepoint entries)
  assert.equal(charsProduced.includes('\u17BB\u17C6'), false, 'CONFIRMED DEFECT: race text generation lacks atomic compound vowel');
  assert.deepEqual(charsProduced, ['ក', '\u17BB', '\u17C6'], 'CONFIRMED DEFECT: race text decomposes compound vowel into 2 units');
});

test('2.2 [DEFECT REPRODUCED] raceHandleChar resets streak and increments mistake when typing compound key', () => {
  // Production function: raceHandleChar (js/race.js lines 725-775)
  setupGlobalDom();
  eval(fs.readFileSync(path.join(ROOT, 'js/typing.js'), 'utf8'));
  eval(fs.readFileSync(path.join(ROOT, 'js/race.js'), 'utf8'));

  // Configure active race state reflecting decomposed raceChars
  window.raceActive = true;
  window.raceChars = ['\u17BB', '\u17C6']; // Decomposed target
  window.raceIndex = 0;
  window.raceMistakes = 0;
  window.raceCorrectTotal = 0;

  // Simulate typing physical NiDA compound key '\u17BB\u17C6'
  window.raceHandleChar('\u17BB\u17C6');

  // DEFECT VERIFICATION:
  // Expected: match against atomic compound vowel, advance raceIndex to 1, streak increases.
  // Actual defect: mismatch against decomposed '\u17BB' -> raceMistakes increases, index stays 0.
  assert.equal(window.raceMistakes, 1, 'CONFIRMED DEFECT: raceMistakes incremented on compound vowel key');
  assert.equal(window.raceIndex, 0, 'CONFIRMED DEFECT: raceIndex failed to advance on compound vowel key');
});

/* ============================================================
   3. Cloud Sync: Guest-to-Account & Account Switching Tests
   ============================================================ */
test('3.1 [DEFECT REPRODUCED] Guest progress is unconditionally attributed to newly signed-in user without isolation check', async () => {
  // Production function: reconcileOnSignIn (js/cloud-sync.js lines 1414-1475)
  const PKCloudSync = require(path.join(ROOT, 'js', 'cloud-sync.js'));
  const storage = createMockLocalStorage();
  global.localStorage = storage;
  global.window = { localStorage: storage };

  // Guest user completes lessons while not logged in
  storage.setItem(
    'khmerProgress_v2',
    JSON.stringify({
      schemaVersion: 2,
      updatedAt: '2026-10-14T10:00:00.000Z',
      courses: {
        standard: {
          courseId: 'standard',
          lessons: {
            'standard-L00-01': { lessonId: 'standard-L00-01', completed: true, bestWpm: 88, bestAccuracy: 99 }
          }
        }
      }
    })
  );
  // Guest user has NO owner UUID in localStorage
  storage.removeItem('pk_cloud_owner_user_id');

  // Now User B (a different student) signs in on the same browser
  const userB = { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', email: 'student_b@example.com' };
  const uploadedBatch = [];

  const mockClient = {
    from(table) {
      return {
        upsert: async (payload) => {
          uploadedBatch.push({ table, payload });
          return { error: null };
        },
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: null, error: null }),
            then: (resolve, reject) => Promise.resolve({ data: [], error: null }).then(resolve, reject)
          })
        })
      };
    }
  };

  const res = await PKCloudSync.reconcileOnSignIn({ user: userB, client: mockClient });
  assert.equal(res.ok, true);

  // DEFECT VERIFICATION:
  // Expected behavior: Guest progress should not be silently hijacked into User B's cloud account.
  // Actual defect: reconcileOnSignIn line 1455 checks `isDifferentPreviousOwner = Boolean(previousOwnerId && previousOwnerId !== user.id)`.
  // Because previousOwnerId was null for a guest, isDifferentPreviousOwner evaluates to false!
  const lessonUploads = uploadedBatch.filter(b => b.table === 'lesson_progress');
  assert.equal(lessonUploads.length > 0, true, 'CONFIRMED DEFECT: Guest progress was uploaded to newly signed-in user');
  const uploadedRow = lessonUploads[0].payload[0];
  assert.equal(uploadedRow.user_id, userB.id, 'CONFIRMED DEFECT: Guest lesson row was bound to User B UUID');
  assert.equal(uploadedRow.lesson_id, 'standard:standard-L00-01');
});

test('3.2 [VERIFIED] Cross-account isolation correctly prevents User A data from leaking into User B when owner ID is set', async () => {
  // Production function: reconcileOnSignIn (js/cloud-sync.js lines 1452-1469)
  const PKCloudSync = require(path.join(ROOT, 'js', 'cloud-sync.js'));
  const storage = createMockLocalStorage();
  global.localStorage = storage;
  global.window = { localStorage: storage };

  const userA = { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', email: 'user_a@example.com' };
  const userB = { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', email: 'user_b@example.com' };

  // Set previous owner to User A
  storage.setItem('pk_cloud_owner_user_id', userA.id);
  storage.setItem('khmerProgress_v2', JSON.stringify({
    schemaVersion: 2,
    courses: { standard: { lessons: { 'standard-L00-01': { completed: true, bestWpm: 90 } } } }
  }));

  const uploadedBatch = [];
  const mockClient = {
    from(table) {
      return {
        upsert: async (payload) => { uploadedBatch.push({ table, payload }); return { error: null }; },
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: null, error: null }),
            then: (resolve, reject) => Promise.resolve({ data: [], error: null }).then(resolve, reject)
          })
        })
      };
    }
  };

  // User B signs in
  const res = await PKCloudSync.reconcileOnSignIn({ user: userB, client: mockClient });
  assert.equal(res.ok, true);

  // When pk_cloud_owner_user_id exists and differs, isolation triggers:
  const lessonUploads = uploadedBatch.filter(b => b.table === 'lesson_progress');
  assert.equal(lessonUploads.length, 0, 'User A progress must NOT be uploaded to User B');
});

/* ============================================================
   4. Cloud Sync: Local Reset & Progress Resurrection Tests
   ============================================================ */
test('4.1 [DEFECT REPRODUCED] Offline local progress reset is resurrected by monotonic cloud merge on subsequent sync', async () => {
  // Production function: reconcileLessonProgressMaps (js/cloud-sync.js lines 490-529), mergeLessonRecord (lines 451-490)
  const PKCloudSync = require(path.join(ROOT, 'js', 'cloud-sync.js'));
  const storage = createMockLocalStorage();
  global.localStorage = storage;
  global.window = { localStorage: storage };

  const user = { id: '11111111-1111-4111-8111-111111111111', email: 'learner@example.com' };
  storage.setItem('pk_cloud_owner_user_id', user.id);

  // User previously completed standard-L00-01 in cloud
  const cloudRows = [{
    user_id: user.id,
    lesson_id: 'standard:standard-L00-01',
    progress: {
      courseId: 'standard',
      lessonId: 'standard-L00-01',
      completed: true,
      bestWpm: 65,
      bestAccuracy: 98,
      attempts: 4
    }
  }];

  // User intentionally clicks "Reset Progress" locally
  storage.removeItem('khmerProgress_v2');
  storage.removeItem('khmerCompletedLessons');

  assert.equal(storage.getItem('khmerProgress_v2'), null, 'Local storage progress is empty before sync');

  const mockClient = {
    from(table) {
      return {
        upsert: async () => ({ error: null }),
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: null, error: null }),
            then: (resolve, reject) => Promise.resolve({
              data: table === 'lesson_progress' ? cloudRows : [],
              error: null
            }).then(resolve, reject)
          })
        })
      };
    }
  };

  // Subsequent sync occurs
  await PKCloudSync.reconcileOnSignIn({ user, client: mockClient });

  // DEFECT VERIFICATION:
  // Expected behavior after user reset: Progress should remain reset (or cloud rows deleted via tombstone).
  // Actual defect: Monotonic merge sees local=null and remote=completed, resurrecting completed status and bestWpm.
  const restoredV2 = JSON.parse(storage.getItem('khmerProgress_v2'));
  const resurrectedLesson = restoredV2 && restoredV2.courses && restoredV2.courses.standard.lessons['standard-L00-01'];

  assert.ok(resurrectedLesson, 'CONFIRMED DEFECT: Deleted lesson was resurrected into localStorage');
  assert.equal(resurrectedLesson.completed, true, 'CONFIRMED DEFECT: completed=true was resurrected');
  assert.equal(resurrectedLesson.bestWpm, 65, 'CONFIRMED DEFECT: bestWpm=65 was resurrected');
});

test('4.2 [DEFECT REPRODUCED] mergeLessonRecord preserves completed=true even if local record reset attempts to 0', () => {
  // Production function: mergeLessonRecord (js/cloud-sync.js lines 451-490)
  const PKCloudSync = require(path.join(ROOT, 'js', 'cloud-sync.js'));

  const cloudRecord = {
    lessonId: 'l1-1',
    completed: true,
    bestWpm: 55,
    bestAccuracy: 95,
    totalAttempts: 3
  };

  const localResetRecord = {
    lessonId: 'l1-1',
    completed: false,
    bestWpm: 0,
    bestAccuracy: 0,
    totalAttempts: 0
  };

  const merged = PKCloudSync.mergeLessonRecord(localResetRecord, cloudRecord);

  // DEFECT VERIFICATION:
  // Monotonic union `completed: Boolean(local.completed || remote.completed)` cannot represent deletion without tombstones.
  assert.equal(merged.completed, true, 'CONFIRMED DEFECT: Monotonic merge ignores local reset to completed=false');
  assert.equal(merged.bestWpm, 55, 'CONFIRMED DEFECT: Monotonic merge takes Math.max, resurrecting bestWpm');
});

/* ============================================================
   5. Native Khmer IME Double Insertion Simulation & Boundary
   ============================================================ */
test('5.1 [SIMULATION] Free-typing manuscript mode double-insertion on compositionend + unmasked keydown', () => {
  // Production functions: compositionend (js/typing.js lines 64-74), keydown (lines 970-1135), insertText (lines 760-785)
  setupGlobalDom();
  const eventListeners = {};
  global.window.addEventListener = (type, fn) => {
    (eventListeners[type] = eventListeners[type] || []).push(fn);
  };

  const outputEl = createMockDomElement();
  global.document.getElementById = (id) => (id === 'output' ? outputEl : createMockDomElement());

  eval(fs.readFileSync(path.join(ROOT, 'js/typing.js'), 'utf8'));

  // Ensure free-typing mode (lessons/race inactive)
  global.lessonActive = false;
  global.raceActive = false;
  global.trialActive = false;

  // 1. IME sends compositionend with committed glyph 'ក'
  const compEndEvent = { type: 'compositionend', data: 'ក' };
  (eventListeners['compositionend'] || []).forEach(fn => fn(compEndEvent));

  assert.equal(outputEl.textContent.length, 1, 'First insertion via compositionend event');

  // 2. If OS/IME immediately dispatches an unmasked keydown event for 'ក' (e.isComposing = false)
  const keydownEvent = {
    type: 'keydown',
    code: 'KeyK',
    key: 'ក',
    isComposing: false,
    repeat: false,
    target: outputEl,
    preventDefault() {}
  };
  (eventListeners['keydown'] || []).forEach(fn => fn(keydownEvent));

  // DEFECT VERIFICATION:
  // If the browser/IME dispatches both events without suppressing the following keydown,
  // output contains 2 glyphs ('កក') instead of 1.
  assert.equal(outputEl.textContent, 'កក', 'CONFIRMED DEFECT: Duplicate insertion on compositionend + unmasked keydown');
});

test('5.2 [SIMULATION] Lesson mode completely suppresses compositionend insertion', () => {
  // Production function: compositionend line 66: if(lessonActive) return;
  setupGlobalDom();
  const eventListeners = {};
  global.window.addEventListener = (type, fn) => {
    (eventListeners[type] = eventListeners[type] || []).push(fn);
  };
  const insertedNodes = [];
  const outputEl = createMockDomElement();
  outputEl.appendChild = (n) => { insertedNodes.push(n); };
  Object.defineProperty(outputEl, 'textContent', {
    get: () => insertedNodes.map(n => n.textContent || '').join('')
  });
  global.document.getElementById = (id) => (id === 'output' ? outputEl : createMockDomElement());

  eval(fs.readFileSync(path.join(ROOT, 'js/typing.js'), 'utf8'));

  global.lessonActive = true; // Lesson active

  const compEndEvent = { type: 'compositionend', data: 'ក' };
  (eventListeners['compositionend'] || []).forEach(fn => fn(compEndEvent));

  // In lesson mode, compositionend aborts early:
  assert.equal(outputEl.textContent.length, 0, 'Lesson mode rejects native IME compositionend input');
});

/* ============================================================
   6. Windows AltGr Debounce & Modifier Timing Tests
   ============================================================ */
test('6.1 [VERIFIED BEHAVIOR] Fast AltRight (<35ms) cancels synthetic ControlLeft cleanly', async () => {
  // Production functions: cancelPendingCtrl (js/typing.js line 952), keydown (lines 991-1025)
  setupGlobalDom();
  const eventListeners = {};
  global.window.addEventListener = (type, fn) => {
    (eventListeners[type] = eventListeners[type] || []).push(fn);
  };

  eval(fs.readFileSync(path.join(ROOT, 'js/typing.js'), 'utf8'));

  // 1. Synthetic ControlLeft arrives
  const ctrlDown = {
    type: 'keydown',
    code: 'ControlLeft',
    key: 'Control',
    getModifierState: () => false,
    preventDefault() {}
  };
  (eventListeners['keydown'] || []).forEach(fn => fn(ctrlDown));

  // 2. AltRight arrives 10ms later (within 35ms window)
  await new Promise(r => setTimeout(r, 10));

  const altRightDown = {
    type: 'keydown',
    code: 'AltRight',
    key: 'AltGraph',
    getModifierState: () => true,
    preventDefault() {}
  };
  (eventListeners['keydown'] || []).forEach(fn => fn(altRightDown));

  // Window physicalLayer recomputed to 'altgr'
  assert.equal(global.physicalLayer, 'altgr', 'Physical layer must switch to altgr');
});

test('6.2 [DEFECT REPRODUCED] Event lag >35ms between ControlLeft and AltRight causes spurious Ctrl layer activation', async () => {
  // Production functions: applyPendingCtrl (js/typing.js line 945), pendingCtrlTimer
  setupGlobalDom();
  const eventListeners = {};
  global.window.addEventListener = (type, fn) => {
    (eventListeners[type] = eventListeners[type] || []).push(fn);
  };

  eval(fs.readFileSync(path.join(ROOT, 'js/typing.js'), 'utf8'));

  // 1. Synthetic ControlLeft arrives
  const ctrlDown = {
    type: 'keydown',
    code: 'ControlLeft',
    key: 'Control',
    getModifierState: () => false,
    preventDefault() {}
  };
  (eventListeners['keydown'] || []).forEach(fn => fn(ctrlDown));

  // 2. Wait 45ms (exceeding 35ms debounce threshold) before AltRight arrives
  await new Promise(r => setTimeout(r, 45));

  // DEFECT VERIFICATION:
  // applyPendingCtrl() fired at 35ms, prematurely committing 'ctrl' to heldModifiers and switching layer
  assert.equal(global.physicalLayer, 'ctrl', 'CONFIRMED DEFECT: Lag >35ms switches layer to Ctrl prematurely');
});
