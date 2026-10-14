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
    activeElement: null,
    readyState: 'loading'
  };
  global.highlightedKeyId = null;
  global.pkIcon = () => '';
}

/* ============================================================
   1. Adaptive Mode Compound Vowel Splitting Tests
   ============================================================ */
test('1.1 [VERIFIED FIXED] generateAdaptiveDrill preserves atomic Khmer compound vowels as unified targets', () => {
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

  // Expected behavior: Khmer compound vowel '\u17BB\u17C6' is bundled as an atomic unit in drill.chars.
  const hasAtomicCompound = drill.chars.includes('\u17BB\u17C6');
  assert.equal(hasAtomicCompound, true, 'VERIFIED: drill.chars bundles atomic compound vowel unit');
});

test('1.2 [VERIFIED FIXED] adaptiveHandleChar accepts valid NiDA compound key stroke and advances cursor', () => {
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

  const targetChar = session.drill.chars[0];
  assert.equal(targetChar, '\u17BB\u17C6', 'Target is atomic compound vowel \\u17BB\\u17C6');

  // User strikes the physical comma key on NiDA, which produces the complete compound vowel '\u17BB\u17C6'
  adaptive.adaptiveHandleChar('\u17BB\u17C6');

  // Single compound key stroke matches compound vowel target and advances cursor index to 1.
  assert.equal(session.mistakes, 0, 'VERIFIED: zero false mistakes on valid compound vowel input');
  assert.equal(session.index, 1, 'VERIFIED: cursor advances after compound vowel input');
});

test('1.3 [VERIFIED BEHAVIOR] adaptiveHandleBackspace on atomic compound sequence reverts index cleanly', () => {
  // Production function: adaptiveHandleBackspace (js/adaptive.js lines 1800-1818)
  setupGlobalDom();
  global.localStorage = createMockLocalStorage();

  delete require.cache[require.resolve(path.join(ROOT, 'js', 'adaptive.js'))];
  const adaptive = require(path.join(ROOT, 'js', 'adaptive.js'));

  adaptive.startAdaptiveSession('nida', {
    unlockedUnits: ['\u17BB\u17C6'],
    focusUnit: '\u17BB\u17C6',
    isAutoAdvance: true
  });

  const session = adaptive.getActiveSession();
  const firstChar = session.drill.chars[0];
  assert.equal(firstChar, '\u17BB\u17C6');

  // User types atomic compound target character correctly
  adaptive.adaptiveHandleChar(firstChar);
  assert.equal(session.index, 1, 'Index advances to 1 after typing compound vowel');

  // User hits Backspace
  adaptive.adaptiveHandleBackspace();
  assert.equal(session.index, 0, 'Index reverts back to 0 on Backspace');
});

/* ============================================================
   2. Race Mode Compound Vowel Splitting Tests
   ============================================================ */
test('2.1 [VERIFIED FIXED] seqWords preserves Khmer compound vowels as unified typing units', () => {
  // Production function: seqWords (js/lessons.js) used by raceGenerateText (js/race.js)
  setupGlobalDom();
  const kb = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/keyboard.json'), 'utf8'));
  global.ROW1 = kb.LAYOUTS.standard.rows[0];
  global.ROW2 = kb.LAYOUTS.standard.rows[1];
  global.ROW3 = kb.LAYOUTS.standard.rows[2];
  global.ROW4 = kb.LAYOUTS.standard.rows[3];
  global.ROW5 = kb.LAYOUTS.standard.rows[4];
  global.ROW1_NIDA = kb.LAYOUTS.nida.rows[0];
  global.ROW2_NIDA = kb.LAYOUTS.nida.rows[1];
  global.ROW3_NIDA = kb.LAYOUTS.nida.rows[2];
  global.ROW4_NIDA = kb.LAYOUTS.nida.rows[3];
  global.ROW5_NIDA = kb.LAYOUTS.nida.rows[4];
  global.ROW1_EN = kb.LAYOUTS.english.rows[0];
  global.ROW2_EN = kb.LAYOUTS.english.rows[1];
  global.ROW3_EN = kb.LAYOUTS.english.rows[2];
  global.ROW4_EN = kb.LAYOUTS.english.rows[3];
  global.ROW5_EN = kb.LAYOUTS.english.rows[4];

  global.lessonActive = true;
  eval(fs.readFileSync(path.join(ROOT, 'js/typing.js'), 'utf8'));
  eval(fs.readFileSync(path.join(ROOT, 'js/lessons.js'), 'utf8'));

  function buildKeyById(rows) {
    const map = {};
    rows.forEach(r => r.forEach(k => { if (k.kind === 'glyph') map[k.id] = k; }));
    return map;
  }
  const table = buildKeyById(kb.LAYOUTS.nida.rows);

  const seqFn = (typeof seqWords === 'function') ? seqWords : (global.seqWords || window.seqWords);
  const entries = seqFn(['កុំ'], table, 'nida');
  const charsProduced = entries.map(e => e.ch);

  // Expected: atomic compound vowel '\u17BB\u17C6' remains intact in typing units
  assert.equal(charsProduced.includes('\u17BB\u17C6'), true, 'VERIFIED: race text generation preserves atomic compound vowel');
  assert.equal(charsProduced.includes('\u17BB'), false, 'VERIFIED: decomposed codepoint \\u17BB is not present in isolation');
  assert.equal(charsProduced.includes('\u17C6'), false, 'VERIFIED: decomposed codepoint \\u17C6 is not present in isolation');
});

test('2.2 [VERIFIED FIXED] raceHandleChar matches atomic compound key, maintains streak, and advances index', () => {
  // Production function: raceHandleChar (js/race.js lines 725-775)
  setupGlobalDom();
  eval(fs.readFileSync(path.join(ROOT, 'js/typing.js'), 'utf8'));
  eval(fs.readFileSync(path.join(ROOT, 'js/race.js'), 'utf8'));

  // Configure active race state reflecting atomic raceChars
  window.raceActive = true;
  window.raceChars = ['\u17BB\u17C6', ' '];
  window.raceIndex = 0;
  window.raceMistakes = 0;
  window.raceCorrectTotal = 0;

  // Simulate typing physical NiDA compound key '\u17BB\u17C6'
  window.raceHandleChar('\u17BB\u17C6');

  // Expected: match against atomic compound vowel, advance raceIndex to 1, zero mistakes
  assert.equal(window.raceMistakes, 0, 'VERIFIED: zero mistakes on compound vowel key');
  assert.equal(window.raceIndex, 1, 'VERIFIED: raceIndex advanced by 1 unit');
  assert.equal(window.raceCorrectTotal, 1, 'VERIFIED: correct total incremented');
});

/* ============================================================
   3. Cloud Sync: Guest-to-Account & Account Switching Tests
   ============================================================ */
test('3.1 [VERIFIED FIXED] Guest progress is isolated from established cloud accounts and promoted only for empty new accounts', async () => {
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
  storage.removeItem('pk_cloud_owner_user_id');

  // Case A: User B is an ESTABLISHED student with existing cloud records
  const userB = { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', email: 'student_b@example.com' };
  let uploadedBatchB = [];
  const existingCloudRows = [{
    user_id: userB.id,
    lesson_id: 'standard:standard-L01-01',
    progress: { lessonId: 'standard-L01-01', completed: true, bestWpm: 70 }
  }];

  const mockClientB = {
    from(table) {
      return {
        upsert: async (payload) => { uploadedBatchB.push({ table, payload }); return { error: null }; },
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: null, error: null }),
            then: (resolve, reject) => Promise.resolve({
              data: table === 'lesson_progress' ? existingCloudRows : [],
              error: null
            }).then(resolve, reject)
          })
        })
      };
    }
  };

  await PKCloudSync.reconcileOnSignIn({ user: userB, client: mockClientB });
  const lessonUploadsB = uploadedBatchB.filter(b => b.table === 'lesson_progress');
  assert.equal(lessonUploadsB.length, 0, 'VERIFIED: Guest progress is NOT uploaded to established cloud account');

  // Case B: User C is a FRESH student registering for the first time (empty cloud rows)
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
  storage.removeItem('pk_cloud_owner_user_id');

  const userC = { id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', email: 'fresh_student@example.com' };
  let uploadedBatchC = [];
  const mockClientC = {
    from(table) {
      return {
        upsert: async (payload) => { uploadedBatchC.push({ table, payload }); return { error: null }; },
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: null, error: null }),
            then: (resolve, reject) => Promise.resolve({ data: [], error: null }).then(resolve, reject)
          })
        })
      };
    }
  };

  await PKCloudSync.reconcileOnSignIn({ user: userC, client: mockClientC });
  const lessonUploadsC = uploadedBatchC.filter(b => b.table === 'lesson_progress');
  assert.equal(lessonUploadsC.length > 0, true, 'VERIFIED: Guest progress promoted into fresh new account');
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
test('4.1 [VERIFIED FIXED] Offline local progress reset writes tombstone preventing resurrection on sync', async () => {
  // Production function: reconcileLessonProgressMaps (js/cloud-sync.js), reconcileOnSignIn
  const PKCloudSync = require(path.join(ROOT, 'js', 'cloud-sync.js'));
  const storage = createMockLocalStorage();
  global.localStorage = storage;
  global.window = { localStorage: storage };

  const user = { id: '11111111-1111-4111-8111-111111111111', email: 'learner@example.com' };
  storage.setItem('pk_cloud_owner_user_id', user.id);

  // User previously completed standard-L00-01 in cloud at 08:00
  const cloudRows = [{
    user_id: user.id,
    lesson_id: 'standard:standard-L00-01',
    updated_at: '2026-10-14T08:00:00.000Z',
    progress: {
      courseId: 'standard',
      lessonId: 'standard-L00-01',
      completed: true,
      bestWpm: 65,
      bestAccuracy: 98,
      attempts: 4
    }
  }];

  // User intentionally clicks "Reset Progress" locally at 10:00, writing tombstone
  storage.removeItem('khmerProgress_v2');
  storage.removeItem('khmerCompletedLessons');
  const resetTimestamp = '2026-10-14T10:00:00.000Z';
  PKCloudSync.setLocalProgressResetAt(resetTimestamp);

  const deletedOperations = [];
  const mockClient = {
    from(table) {
      return {
        upsert: async () => ({ error: null }),
        delete: () => ({
          eq: () => ({
            lte: (col, val) => {
              deletedOperations.push({ table, col, val });
              return Promise.resolve({ error: null });
            }
          })
        }),
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

  // Progress remains reset because tombstone filtered out stale cloud records
  const restoredV2 = JSON.parse(storage.getItem('khmerProgress_v2'));
  const resurrectedLesson = restoredV2 && restoredV2.courses && restoredV2.courses.standard && restoredV2.courses.standard.lessons && restoredV2.courses.standard.lessons['standard-L00-01'];

  assert.equal(resurrectedLesson, undefined, 'VERIFIED: Reset lesson is not resurrected from stale cloud record');
  assert.equal(deletedOperations.length > 0, true, 'VERIFIED: Cloud sync issued delete for rows older than resetAt');
});

test('4.2 [VERIFIED FIXED] mergeLessonRecord honors explicit local reset to completed=false', () => {
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

  assert.equal(merged.completed, false, 'VERIFIED: Explicit local reset clears completed flag');
  assert.equal(merged.bestWpm, 0, 'VERIFIED: Explicit local reset clears bestWpm');
});

/* ============================================================
   5. Native Khmer IME Double Insertion Simulation & Boundary
   ============================================================ */
test('5.1 [VERIFIED FIXED] Trailing unmasked keydown within 40ms of compositionend is deduplicated in free-typing', () => {
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

  // 2. Browser immediately dispatches an unmasked trailing keydown event for 'ក' (e.isComposing = false)
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

  // Deduplication guard suppresses duplicate insertion within 40ms
  assert.equal(outputEl.textContent, 'ក', 'VERIFIED: Output retains exactly 1 glyph without duplicate insertion');
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

test('6.2 [VERIFIED FIXED] Windows AltGr getModifierState immediately switches layer to altgr without Ctrl flicker', async () => {
  // Production functions: applyPendingCtrl (js/typing.js), keydown (lines 1013-1029)
  setupGlobalDom();
  const eventListeners = {};
  global.window.addEventListener = (type, fn) => {
    (eventListeners[type] = eventListeners[type] || []).push(fn);
  };

  eval(fs.readFileSync(path.join(ROOT, 'js/typing.js'), 'utf8'));

  // Synthetic ControlLeft with AltGraph modifier state reported true by browser
  const ctrlDown = {
    type: 'keydown',
    code: 'ControlLeft',
    key: 'Control',
    getModifierState: (mod) => (mod === 'AltGraph'),
    preventDefault() {}
  };
  (eventListeners['keydown'] || []).forEach(fn => fn(ctrlDown));

  // Directly sets altgr without waiting for debounce timer and leaves ctrl unheld
  assert.equal(global.physicalLayer, 'altgr', 'VERIFIED: Immediately switches to altgr when getModifierState reports AltGraph');
  assert.notEqual(global.physicalLayer, 'ctrl', 'VERIFIED: ctrl layer is not active');
});
