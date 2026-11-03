// tests/phase_d_checkpoints_and_lab.test.js
// Phase D: Checkpoint Gatekeeping & Test Lab Literature Expansion Automated Test Suite

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

// Mock browser environment
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    key: (i) => Object.keys(store)[i] || null,
    get length() { return Object.keys(store).length; }
  };
})();

global.window = {
  addEventListener: () => {},
  document: {
    addEventListener: () => {},
    getElementById: () => null,
    querySelectorAll: () => []
  }
};
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

global.document = {
  addEventListener: () => {},
  removeEventListener: () => {},
  createDocumentFragment: () => mockEl(),
  documentElement: {
    classList: {
      contains: () => false,
      add: () => {},
      remove: () => {}
    }
  },
  getElementById: (id) => mockEl(id),
  querySelector: () => null,
  querySelectorAll: () => [],
  createElement: () => mockEl()
};
global.window.document = global.document;
global.localStorage = localStorageMock;

// Load keyboard definitions required by lessons.js
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
global.pkIcon = () => '<svg></svg>';

// Load curricula data & engines
global.CURRICULUM_DATA = {
  standard: JSON.parse(fs.readFileSync(path.join(__dirname, '../data/curriculum/standard/lessons.json'), 'utf8')),
  nida: JSON.parse(fs.readFileSync(path.join(__dirname, '../data/curriculum/nida/lessons.json'), 'utf8')),
  english: JSON.parse(fs.readFileSync(path.join(__dirname, '../data/curriculum/english/lessons.json'), 'utf8'))
};

eval('var currentLayoutId = "standard";\n' + fs.readFileSync(path.join(__dirname, '../js/lessons.js'), 'utf8'));
eval(fs.readFileSync(path.join(__dirname, '../js/test-lab.js'), 'utf8'));

test('Phase D: Checkpoint Gatekeeping - Stage boundary detection identifies stage transitions', () => {
  const stdLessons = global.CURRICULUM_DATA.standard.lessons;
  assert.ok(stdLessons.length > 50, 'Standard lessons must be loaded');

  // Intra-stage lesson transition (e.g. standard-L00-01 to standard-L00-02)
  const intraStage = window.isStageBoundaryCheckpoint('standard-L00-01', 'standard-L00-02', stdLessons);
  assert.equal(intraStage, false, 'Transitions within the same stage should not be stage boundary checkpoints');

  // Inter-stage transition (Stage 1 ends at standard-L01-08, Stage 2 begins at standard-L02-01)
  const l01Last = stdLessons.filter(l => l.level === 'standard-L01').pop();
  const l02First = stdLessons.find(l => l.level === 'standard-L02');
  assert.ok(l01Last && l02First, 'L01 and L02 lessons must be found');

  const interStage = window.isStageBoundaryCheckpoint(l01Last.id, l02First.id, stdLessons);
  assert.equal(interStage, true, 'Transition between Stage 1 and Stage 2 must be identified as stage boundary checkpoint');
});

test('Phase D: Checkpoint Gatekeeping - Stage N+1 remains locked if Stage N checkpoint accuracy is < 90%', () => {
  localStorage.clear();
  const stdLessons = global.CURRICULUM_DATA.standard.lessons;
  const l01Last = stdLessons.filter(l => l.level === 'standard-L01').pop();
  const l02First = stdLessons.find(l => l.level === 'standard-L02');

  // Set best score on checkpoint to 82% accuracy (< 90%)
  localStorage.setItem(`khmerLessonBest_${l01Last.id}`, JSON.stringify({
    accuracy: 82,
    time: 45,
    attempts: 1,
    mastered: false
  }));

  // isLessonLocked on L02 first lesson should be TRUE (locked)
  const locked = window.isLessonLocked(l02First.id);
  assert.equal(locked, true, 'Stage 2 first lesson MUST remain locked when checkpoint accuracy is 82% (< 90%)');
});

test('Phase D: Checkpoint Gatekeeping - Stage N+1 unlocks immediately when Stage N checkpoint reaches >= 90%', () => {
  localStorage.clear();
  const stdLessons = global.CURRICULUM_DATA.standard.lessons;
  const l01Last = stdLessons.filter(l => l.level === 'standard-L01').pop();
  const l02First = stdLessons.find(l => l.level === 'standard-L02');

  // Set best score on checkpoint to 93% accuracy (>= 90%)
  localStorage.setItem(`khmerLessonBest_${l01Last.id}`, JSON.stringify({
    accuracy: 93,
    time: 38,
    attempts: 2,
    mastered: true
  }));

  // isLessonLocked on L02 first lesson should now be FALSE (unlocked)
  const locked = window.isLessonLocked(l02First.id);
  assert.equal(locked, false, 'Stage 2 first lesson MUST unlock when checkpoint accuracy reaches 93% (>= 90%)');
});

test('Phase D: Test Lab Literature & Sprints - Preset setup produces authentic texts and timed intervals', () => {
  // Test Literature preset
  const litSetup = window.PK_TEST_LAB.setupTest({ preset: 'literature', layoutId: 'standard' });
  assert.equal(litSetup.ok, true, 'Literature test setup must succeed');
  const activeState = window.PK_TEST_LAB.getState();
  assert.equal(activeState.durationSec, 120, 'Literature test duration should be 120s');
  assert.equal(activeState.targetAccuracy, 95, 'Literature test target accuracy should be 95%');
  assert.ok(activeState.text.includes('រឿងទុំទាវ') || activeState.text.includes('រាមកេរ្តិ៍'),
    'Literature test must contain classical Khmer literary references');

  // Test 1-Minute Sprint preset
  const sprint1m = window.PK_TEST_LAB.setupTest({ preset: 'sprint-1m', layoutId: 'standard' });
  assert.equal(sprint1m.ok, true, '1-minute sprint setup must succeed');
  assert.equal(window.PK_TEST_LAB.getState().durationSec, 60, '1-minute sprint duration should be 60s');

  // Test 3-Minute Sprint preset
  const sprint3m = window.PK_TEST_LAB.setupTest({ preset: 'sprint-3m', layoutId: 'english' });
  assert.equal(sprint3m.ok, true, '3-minute sprint setup must succeed');
  assert.equal(window.PK_TEST_LAB.getState().durationSec, 180, '3-minute sprint duration should be 180s');
});
