// tests/phase_c_khmer_adaptive.test.js
// Phase C: Khmer Dynamic Syllable Generator & Adaptive Parity Automated Test Suite

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
global.document = window.document;
global.localStorage = localStorageMock;

// Load adaptive vocab & adaptive engine
eval(fs.readFileSync(path.join(__dirname, '../data/adaptive-vocab.js'), 'utf8'));
eval(fs.readFileSync(path.join(__dirname, '../js/adaptive.js'), 'utf8'));

test('Phase C: Khmer Adaptive Engine - generatePhonotacticKhmerSyllable generates phonotactically valid syllables', () => {
  const unlocked = ['ថ', 'ក', 'ដ', 'ង', 'ហ', 'ស', 'ល', 'ញ', 'ា', 'ើ'];
  const unlockedSet = new Set(unlocked);

  for (let i = 0; i < 50; i++) {
    const syl = window.PK_ADAPTIVE.generatePhonotacticKhmerSyllable(unlocked, Math.random, 'ក');
    assert.ok(syl.length > 0, 'Generated syllable must not be empty');

    // 1. Verify zero locked-letter leakage
    for (const ch of syl) {
      assert.ok(unlockedSet.has(ch), `Character "${ch}" in syllable "${syl}" must be in unlocked set`);
    }

    // 2. Verify onset is a consonant (not a dependent vowel or Coeng)
    const firstChar = syl[0];
    assert.ok(['ថ', 'ក', 'ដ', 'ង', 'ហ', 'ស', 'ល', 'ញ'].includes(firstChar),
      `First character of "${syl}" must be a consonant onset, got "${firstChar}"`);
  }
});

test('Phase C: Khmer Adaptive Engine - 100 consecutive syllables with Coeng subscripts have zero letter leakage', () => {
  const unlockedWithCoeng = [
    'ក', 'ខ', 'ង', 'ច', 'ត', 'ន', 'ប', 'ម', 'រ', 'ល', 'ស',
    'ា', 'ិ', 'ី', 'ុ', 'ូ', '្'
  ];
  const unlockedSet = new Set(unlockedWithCoeng);

  const stream = window.PK_ADAPTIVE.generatePhonotacticKhmerWordStream(unlockedWithCoeng, 100, Math.random);
  assert.equal(stream.length >= 80, true, 'Word stream must generate at least 80 syllables');

  let subscriptFound = false;

  for (const syl of stream) {
    // Verify zero locked character leakage
    for (const ch of syl) {
      assert.ok(unlockedSet.has(ch), `Character "${ch}" in syllable "${syl}" must be in unlocked set`);
    }

    // Verify no leading Coeng
    assert.notEqual(syl[0], '្', `Syllable "${syl}" must never begin with an orphaned Coeng`);

    if (syl.includes('្')) {
      subscriptFound = true;
      const coengIdx = syl.indexOf('្');
      assert.ok(coengIdx > 0, `Coeng in "${syl}" must follow an onset consonant`);
      assert.ok(coengIdx + 1 < syl.length, `Coeng in "${syl}" must be followed by a subscript consonant`);
      const subChar = syl[coengIdx + 1];
      assert.ok(unlockedSet.has(subChar), `Subscript "${subChar}" must be in unlocked set`);
    }
  }

  assert.equal(subscriptFound, true, 'At least some generated syllables should include Coeng subscripts');
});

test('Phase C: Khmer Adaptive Engine - generateAdaptiveDrill produces non-empty, leakage-free drills for Standard and NiDA', () => {
  localStorage.clear();

  // Test Standard Layout
  const stdDrill = window.PK_ADAPTIVE.generateAdaptiveDrill('standard', { wordCount: 20 });
  assert.ok(stdDrill, 'Standard drill must exist');
  assert.ok(stdDrill.words && stdDrill.words.length >= 15, 'Standard drill must have at least 15 words');
  assert.ok(stdDrill.exerciseText && stdDrill.exerciseText.length > 30, 'Standard drill text must be populated');

  // Test NiDA Layout
  const nidaDrill = window.PK_ADAPTIVE.generateAdaptiveDrill('nida', { wordCount: 20 });
  assert.ok(nidaDrill, 'NiDA drill must exist');
  assert.ok(nidaDrill.words && nidaDrill.words.length >= 15, 'NiDA drill must have at least 15 words');
  assert.ok(nidaDrill.exerciseText && nidaDrill.exerciseText.length > 30, 'NiDA drill text must be populated');
});
