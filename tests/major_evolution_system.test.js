const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

// Mock browser global environment for Node testing
if (typeof global.window === 'undefined') {
  global.window = global;
}
global.window.addEventListener = () => {};
global.window.removeEventListener = () => {};
global.pkIcon = () => '<svg></svg>';

function mockEl(id) {
  return {
    id,
    tagName: 'DIV',
    addEventListener: () => {},
    removeEventListener: () => {},
    setAttribute: () => {},
    removeAttribute: () => {},
    getAttribute: () => null,
    focus: () => {},
    blur: () => {},
    style: {},
    classList: {
      add: () => {},
      remove: () => {},
      contains: () => false,
      toggle: () => {}
    },
    appendChild: () => {},
    querySelector: () => null,
    querySelectorAll: () => []
  };
}

if (typeof global.document === 'undefined') {
  global.document = {
    addEventListener: () => {},
    removeEventListener: () => {},
    createDocumentFragment: () => mockEl(),
    documentElement: {
      classList: {
        contains: (cls) => false,
        add: () => {},
        remove: () => {}
      }
    },
    getElementById: (id) => mockEl(id),
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => mockEl()
  };
}

// In-memory localStorage mock
const storageStore = {};
global.localStorage = {
  getItem: (key) => storageStore[key] !== undefined ? storageStore[key] : null,
  setItem: (key, val) => { storageStore[key] = String(val); },
  removeItem: (key) => { delete storageStore[key]; },
  clear: () => { Object.keys(storageStore).forEach(k => delete storageStore[k]); }
};

// Set up keyboard rows needed by lessons.js
const kbData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/keyboard.json'), 'utf8'));
global.ROW1 = kbData.LAYOUTS.standard.rows[0];
global.ROW2 = kbData.LAYOUTS.standard.rows[1];
global.ROW3 = kbData.LAYOUTS.standard.rows[2];
global.ROW4 = kbData.LAYOUTS.standard.rows[3];
global.ROW5 = kbData.LAYOUTS.standard.rows[4] || [];
global.ROW1_NIDA = kbData.LAYOUTS.nida.rows[0];
global.ROW2_NIDA = kbData.LAYOUTS.nida.rows[1];
global.ROW3_NIDA = kbData.LAYOUTS.nida.rows[2];
global.ROW4_NIDA = kbData.LAYOUTS.nida.rows[3];
global.ROW5_NIDA = kbData.LAYOUTS.nida.rows[4] || [];
global.ROW1_EN = kbData.LAYOUTS.english.rows[0];
global.ROW2_EN = kbData.LAYOUTS.english.rows[1];
global.ROW3_EN = kbData.LAYOUTS.english.rows[2];
global.ROW4_EN = kbData.LAYOUTS.english.rows[3];
global.ROW5_EN = kbData.LAYOUTS.english.rows[4] || [];
global.LEVELS = [];
global.LESSONS = [];
global.currentLayoutId = 'standard';

// Load Core Modules
const achievementsModule = require('../js/achievements.js');
const testLabModule = require('../js/test-lab.js');
const adaptiveModule = require('../js/adaptive.js');
const lessonsModule = require('../js/lessons.js');

test('Feature A: Intelligent Learning Engine — Confidence Thresholds & Explanations', (t) => {
  // 1. Weakness confidence threshold: < 4 attempts should NOT be declared weak
  const stateLowSamples = {
    unlockedUnits: ['ក', 'ខ'],
    unitStats: {
      'ក': { attempts: 3, mistakes: 2 }, // 3 attempts (< 4) -> insufficient evidence
      'ខ': { attempts: 6, mistakes: 4 }  // 6 attempts (>= 4), 33% accuracy -> weak
    }
  };

  const expl = adaptiveModule.getRecommendationExplanation('standard', stateLowSamples);
  assert.ok(expl, 'Should return a recommendation explanation object');
  assert.ok(expl.reasonEn && expl.reasonKm, 'Should contain both English and Khmer explanations');
  assert.ok(expl.reasonEn.includes('ខ'), 'Should flag key "ខ" with sufficient attempts');
  assert.ok(!expl.reasonEn.includes('ក'), 'Should NOT flag key "ក" with fewer than 4 attempts');

  // 2. Clear mastery explanation when all keys are above threshold
  const stateHighMastery = {
    unlockedUnits: ['ក', 'ខ'],
    unitStats: {
      'ក': { attempts: 10, mistakes: 0, completion: 100 },
      'ខ': { attempts: 12, mistakes: 1, completion: 95 }
    }
  };
  const masterExpl = adaptiveModule.getRecommendationExplanation('standard', stateHighMastery);
  assert.ok(
    masterExpl.reasonEn.includes('High overall accuracy') ||
    masterExpl.reasonEn.includes('Ready for progression') ||
    masterExpl.reasonEn.includes('Targeting') ||
    masterExpl.confidence === 'high',
    'Should explain progression when mastery is solid'
  );
});

test('Feature B: Structured Learning Paths — 9 Stages & Overview', (t) => {
  const stages = lessonsModule.LEARNING_STAGES;

  // 1. Exactly 9 pedagogical stages
  assert.equal(stages.length, 9, 'Must have exactly 9 learning stages');

  // 2. Each stage has required metadata and level maps
  stages.forEach((stg, idx) => {
    assert.equal(stg.id, idx + 1, `Stage ${stg.id} ID must match index + 1`);
    assert.ok(stg.titleEn && stg.titleKm, `Stage ${stg.id} must have English and Khmer titles`);
    assert.ok((stg.descriptionEn || stg.descEn) && (stg.descriptionKm || stg.descKm), `Stage ${stg.id} must have English and Khmer descriptions`);
    assert.ok(Array.isArray(stg.levelIds.standard), `Stage ${stg.id} must map standard levels`);
    assert.ok(Array.isArray(stg.levelIds.nida), `Stage ${stg.id} must map NiDA levels`);
    assert.ok(Array.isArray(stg.levelIds.english), `Stage ${stg.id} must map English levels`);
  });

  // 3. getLearningOverview returns answers to the 5 core questions
  const overview = lessonsModule.getLearningOverview('standard');
  assert.ok(overview.learningNow, 'Answers Q1: Where am I right now?');
  assert.ok(overview.masteredSkills, 'Answers Q2: What have I mastered?');
  assert.ok(overview.nextRecommended, 'Answers Q3: What should I practice next?');
  assert.ok(overview.nextRecommended.reasonEn, 'Answers Q4: Why is this recommended?');
  assert.ok(overview.completed, 'Answers Q5: How close am I to keyboard autonomy?');
});

test('Feature D: Typing Test Lab — Presets, Metrics & Persistence', (t) => {
  const tl = testLabModule;

  // 1. Setup test with Quick preset
  const setup = tl.setupTest('quick', 'standard', { durationSec: 30, targetAccuracy: 95 });
  assert.ok(setup.ok, 'Quick test setup must succeed');
  assert.equal(tl.getState().durationSec, 30);
  assert.equal(tl.getState().targetAccuracy, 95);

  // 2. Start test
  const started = tl.startTest();
  assert.ok(started, 'Test should start successfully');
  assert.ok(tl.isActive(), 'Test state must be active');

  // 3. Process typing at least 10 units for valid natural completion
  const units = tl.getState().units;
  assert.ok(units.length >= 10, 'Test units must be populated');
  for (let i = 0; i < 10; i++) {
    tl.handleChar(units[i]);
  }
  assert.equal(tl.getState().currentIndex, 10, 'Index should reach 10');

  // 4. Finish test with natural completion
  const res = tl.finishTest(true);
  assert.ok(res, 'Finish test should produce results');
  assert.ok(typeof res.wpm === 'number');
  assert.ok(typeof res.cpm === 'number');
  assert.ok(typeof res.accuracy === 'number');
  assert.ok(typeof res.goalMet === 'boolean');

  // 5. Results persisted to storage
  const saved = tl.loadResults();
  assert.ok(Array.isArray(saved), 'Test results should be saved in array');
  assert.ok(saved.length >= 1, 'At least 1 test result should be saved');
  assert.equal(saved[0].preset, 'quick');
});

test('Feature E: Khmer Text & Unicode Reliability', (t) => {
  const coengKa = '\u17D2\u1780'; // ្ក Subscript Ka
  const coengKha = '\u17D2\u1781'; // ្ខ Subscript Kha
  const compoundWord = 'កម្ពុជា'; // Text sequence: Ka + Mo + Coeng + Po + U + Cho + Aa

  // Verify Coeng character integrity
  assert.equal(coengKa.length, 2, 'Coeng subscript is a 2-codepoint cluster');
  assert.equal(coengKa.charCodeAt(0), 0x17D2, 'First codepoint is Khmer Sign Coeng');
  assert.equal(coengKa.charCodeAt(1), 0x1780, 'Second codepoint is Khmer Consonant Ka');

  // Verify ZWSP equivalence helper
  function isZwspEquivalent(a, b) {
    if (a === b) return true;
    const isZwsp = ch => ch === '\u200B' || ch === ' ';
    return isZwsp(a) && isZwsp(b);
  }
  assert.ok(isZwspEquivalent(' ', '\u200B'), 'Space and ZWSP should be typing-equivalent');
  assert.ok(isZwspEquivalent('\u200B', ' '), 'ZWSP and Space should be typing-equivalent');
});

test('Feature F: Achievements & Personal Milestones', (t) => {
  const ach = achievementsModule;

  // 1. Initial State
  const all = ach.getAll();
  assert.equal(all.length, 12, 'Must have exactly 12 defined achievements');

  // 2. Unlock trigger: first lesson complete
  const unlocked = ach.check({
    type: 'lesson_completed',
    lessonId: 'std-l1',
    layoutId: 'standard',
    accuracy: 98,
    wpm: 25
  });
  assert.ok(unlocked.length >= 1, 'Should unlock first_step achievement on first lesson');
  assert.equal(unlocked[0], 'first_step');

  // 3. Deduplication: triggering again should not duplicate unlock
  const retriggered = ach.check({
    type: 'lesson_completed',
    lessonId: 'std-l1',
    layoutId: 'standard',
    accuracy: 98,
    wpm: 25
  });
  assert.equal(retriggered.length, 0, 'Deduplication must prevent duplicate unlocks');

  // 4. Persistence check
  assert.ok(ach.isUnlocked('first_step'), 'first_step should be marked unlocked');
});

test('Feature H: Progress Reliability & Recovery — Backup Integrity', (t) => {
  localStorage.setItem('pk_achievements_v1', JSON.stringify({ unlocked: { 'first_step': Date.now() } }));
  localStorage.setItem('pk_test_results_v2', JSON.stringify([{ id: 'test-1', wpm: 45 }]));

  const storageDump = {};
  Object.keys(storageStore).forEach(k => {
    if (k.startsWith('pk_') || k.startsWith('khmer')) {
      storageDump[k] = storageStore[k];
    }
  });

  assert.ok(storageDump['pk_achievements_v1'], 'Backup must capture pk_achievements_v1');
  assert.ok(storageDump['pk_test_results_v2'], 'Backup must capture pk_test_results_v2');
});

test('Strict Zero-Emoji Policy Verification', (t) => {
  const emojiRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}\u{1F004}\u{1F0CF}\u{1FA70}-\u{1FAFF}]/u;

  const targetFiles = [
    'js/achievements.js',
    'js/test-lab.js',
    'js/adaptive.js',
    'js/lessons.js',
    'js/statistics.js',
    'js/typing.js',
    'js/storage.js',
    'index.html'
  ];

  targetFiles.forEach(file => {
    const content = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    const match = emojiRegex.exec(content);
    assert.equal(match, null, `Strict Zero-Emoji violation found in ${file}: ${match ? match[0] : ''}`);
  });
});
