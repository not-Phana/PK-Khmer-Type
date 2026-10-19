// tests/custom_lessons.test.js
// Automated verification suite for PK Khmer Type Custom Lessons Feature.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');

// Helper to simulate browser context with localStorage, DOM, and typing engine
function createBrowserEnvironment() {
  const store = {};
  const mockLocalStorage = {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
  };

  const sandbox = {
    console: console,
    Date: Date,
    Math: Math,
    JSON: JSON,
    Array: Array,
    String: String,
    Number: Number,
    Object: Object,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval
  };

  sandbox.window = sandbox;
  sandbox.global = sandbox;
  sandbox.addEventListener = () => {};
  sandbox.removeEventListener = () => {};
  sandbox.localStorage = mockLocalStorage;
  sandbox.document = {
    documentElement: {
      classList: {
        contains: (cls) => false,
        add: () => {},
        remove: () => {}
      }
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    getElementById: () => null,
    querySelectorAll: () => []
  };
  sandbox.CustomEvent = function(name, opts) {
    this.name = name;
    this.detail = opts ? opts.detail : null;
  };
  sandbox.dispatchEvent = () => {};

  vm.createContext(sandbox);

  // Load typing engine dependencies (splitIntoTypingUnits, normalizeInput, KHMER_COMPOUND_VOWELS)
  const typingCode = fs.readFileSync(path.join(rootDir, 'js/typing.js'), 'utf8');
  vm.runInContext(typingCode, sandbox);

  // Load custom lessons engine
  const customLessonsCode = fs.readFileSync(path.join(rootDir, 'js/custom-lessons.js'), 'utf8');
  vm.runInContext(customLessonsCode, sandbox);

  return sandbox;
}

test('Custom Lessons: Module exposes complete public API', () => {
  const env = createBrowserEnvironment();
  const api = env.window.PK_CUSTOM_LESSONS;

  assert.ok(api, 'PK_CUSTOM_LESSONS must be defined on window');
  assert.equal(typeof api.getAll, 'function');
  assert.equal(typeof api.get, 'function');
  assert.equal(typeof api.create, 'function');
  assert.equal(typeof api.update, 'function');
  assert.equal(typeof api.duplicate, 'function');
  assert.equal(typeof api.delete, 'function');
  assert.equal(typeof api.reorder, 'function');
  assert.equal(typeof api.getProgress, 'function');
  assert.equal(typeof api.recordAttempt, 'function');
  assert.equal(typeof api.resetProgress, 'function');
  assert.equal(typeof api.validate, 'function');
  assert.equal(typeof api.toCurriculumLesson, 'function');
  assert.equal(typeof api.startPractice, 'function');
  assert.ok(Array.isArray(api.templates), 'Starter templates must be an array');
  assert.ok(api.tools && typeof api.tools.repeat === 'function');
  assert.ok(api.tools && typeof api.tools.shuffleWords === 'function');
  assert.ok(api.tools && typeof api.tools.addSpaces === 'function');
  assert.ok(api.tools && typeof api.tools.cleanSpaces === 'function');
});

test('Custom Lessons: Validation enforces non-empty title, content, and valid units', () => {
  const env = createBrowserEnvironment();
  const api = env.window.PK_CUSTOM_LESSONS;

  // Empty title
  const valNoTitle = api.validate({ title: '', content: 'កខគ' });
  assert.equal(valNoTitle.valid, false);
  assert.ok(valNoTitle.errors.some(e => e.includes('title')));

  // Title exceeding 80 chars
  const longTitle = 'A'.repeat(85);
  const valLongTitle = api.validate({ title: longTitle, content: 'កខគ' });
  assert.equal(valLongTitle.valid, false);
  assert.ok(valLongTitle.errors.some(e => e.includes('exceed 80')));

  // Empty content
  const valNoContent = api.validate({ title: 'My Lesson', content: '   ' });
  assert.equal(valNoContent.valid, false);
  assert.ok(valNoContent.errors.some(e => e.includes('content')));

  // Valid lesson
  const valGood = api.validate({ title: 'Vowel Drills', content: 'ា ិ ី ឹ ឺ' });
  assert.equal(valGood.valid, true);
  assert.equal(valGood.errors.length, 0);
});

test('Custom Lessons: CRUD operations and persistent storage in khmerCustomLessons_v1', () => {
  const env = createBrowserEnvironment();
  const api = env.window.PK_CUSTOM_LESSONS;

  assert.equal(api.getAll().length, 0, 'Initially empty list');

  // Create Lesson 1
  const l1 = api.create({
    title: 'Consonant Anchors',
    description: 'Drill on F and J keys',
    content: 'ថ ញ ដ ក',
    difficulty: 'beginner',
    targetLayout: 'standard'
  });

  assert.ok(l1.id && l1.id.startsWith('cust_'));
  assert.equal(l1.title, 'Consonant Anchors');
  assert.equal(l1.order, 1);

  // Verify storage key isolation (must not use khmerProgress_v2)
  const storedLessonsRaw = env.localStorage.getItem('khmerCustomLessons_v1');
  assert.ok(storedLessonsRaw, 'Must persist in khmerCustomLessons_v1');
  assert.equal(env.localStorage.getItem('khmerProgress_v2'), null, 'Must NOT touch official khmerProgress_v2');

  // Create Lesson 2
  const l2 = api.create({
    title: 'English Pangrams',
    content: 'the quick brown fox jumps over the lazy dog',
    difficulty: 'intermediate',
    targetLayout: 'english'
  });
  assert.equal(l2.order, 2);

  const all = api.getAll();
  assert.equal(all.length, 2);
  assert.equal(api.get(l1.id).title, 'Consonant Anchors');

  // Update Lesson 1
  const updatedL1 = api.update(l1.id, { title: 'Master Consonant Anchors' });
  assert.equal(updatedL1.title, 'Master Consonant Anchors');
  assert.equal(api.get(l1.id).title, 'Master Consonant Anchors');

  // Duplicate Lesson 1
  const copyL1 = api.duplicate(l1.id);
  assert.ok(copyL1.id !== l1.id);
  assert.ok(copyL1.title.includes('Master Consonant Anchors'));
  assert.equal(copyL1.content, l1.content);
  assert.equal(api.getAll().length, 3);

  // Delete Lesson 2
  const deleted = api.delete(l2.id);
  assert.equal(deleted, true);
  assert.equal(api.get(l2.id), null);
  assert.equal(api.getAll().length, 2);
});

test('Custom Lessons: Reordering updates lesson sequence accurately', () => {
  const env = createBrowserEnvironment();
  const api = env.window.PK_CUSTOM_LESSONS;

  const a = api.create({ title: 'Lesson A', content: 'aaa' });
  const b = api.create({ title: 'Lesson B', content: 'bbb' });
  const c = api.create({ title: 'Lesson C', content: 'ccc' });

  let list = api.getAll();
  assert.equal(list[0].id, a.id);
  assert.equal(list[1].id, b.id);
  assert.equal(list[2].id, c.id);

  // Move Lesson B up
  api.reorder(b.id, 'up');
  list = api.getAll();
  assert.equal(list[0].id, b.id);
  assert.equal(list[1].id, a.id);
  assert.equal(list[2].id, c.id);
  assert.equal(list[0].order, 1);
  assert.equal(list[1].order, 2);

  // Move Lesson B down
  api.reorder(b.id, 'down');
  list = api.getAll();
  assert.equal(list[0].id, a.id);
  assert.equal(list[1].id, b.id);
  assert.equal(list[2].id, c.id);
});

test('Custom Lessons: Exact preservation of Khmer Unicode (Vowels, Coeng ្, Diacritics)', () => {
  const env = createBrowserEnvironment();
  const api = env.window.PK_CUSTOM_LESSONS;

  // Complex Khmer string with subscripts, compound vowels, and diacritics
  const rawKhmer = 'កម្ពុជា សួស្តី អរគុណ ស្រឡាញ់ សាលារៀន ត្រីកំភ្លាញហែល ខ្ញុំ ញុំា ោះ';
  const lesson = api.create({
    title: 'Khmer Complex Unicode Drill',
    content: rawKhmer
  });

  const retrieved = api.get(lesson.id);
  assert.equal(retrieved.content, rawKhmer, 'Content must match character-by-character without alteration');

  // Verify stored in localStorage matches exactly
  const storedJson = JSON.parse(env.localStorage.getItem('khmerCustomLessons_v1'));
  assert.equal(storedJson[0].content, rawKhmer);
});

test('Custom Lessons: Crafting Starter Templates Library validation', () => {
  const env = createBrowserEnvironment();
  const api = env.window.PK_CUSTOM_LESSONS;

  assert.ok(api.templates.length >= 8, 'Must provide at least 8 rich starter templates');

  api.templates.forEach(tpl => {
    assert.ok(tpl.id, 'Template must have ID');
    assert.ok(tpl.titleEn && tpl.titleKm, 'Template must have bilingual titles');
    assert.ok(tpl.content && tpl.content.trim().length > 0, 'Template must have content');
    assert.ok(['beginner', 'intermediate', 'advanced'].includes(tpl.difficulty));
    assert.ok(['standard', 'nida', 'english', 'any'].includes(tpl.targetLayout));

    // Content must produce valid typing units
    const units = env.window.splitIntoTypingUnits(tpl.content, tpl.targetLayout);
    assert.ok(units.length > 0, `Template ${tpl.id} must yield typing units`);
  });
});

test('Custom Lessons: Crafting Text Tools (repeat, shuffle, addSpaces, cleanSpaces, calcMetrics)', () => {
  const env = createBrowserEnvironment();
  const tools = env.window.PK_CUSTOM_LESSONS.tools;

  // Repeat
  assert.equal(tools.repeat('ក ខ គ', 2), 'ក ខ គ ក ខ គ');
  assert.equal(tools.repeat('apple', 3), 'apple apple apple');

  // Clean Spaces
  assert.equal(tools.cleanSpaces('  ក    ខ   គ  '), 'ក ខ គ');

  // Add Spaces
  const spaced = tools.addSpaces('កខគ');
  assert.equal(spaced, 'ក ខ គ');

  // Shuffle Words preserves words
  const wordsOriginal = 'កម្ពុជា សួស្តី អរគុណ សន្តិភាព';
  const shuffled = tools.shuffleWords(wordsOriginal);
  const origSet = new Set(wordsOriginal.split(' '));
  const shufSet = new Set(shuffled.split(' '));
  assert.equal(shufSet.size, origSet.size);
  origSet.forEach(w => assert.ok(shufSet.has(w)));

  // calcMetrics
  const metrics = tools.calcMetrics('កម្ពុជា សួស្តី', 'standard');
  assert.ok(metrics.chars > 0);
  assert.ok(metrics.units > 0);
  assert.equal(metrics.words, 2);
  assert.ok(metrics.estSec >= 1);
});

test('Custom Lessons: Progress tracking and resetProgress without deleting lesson', () => {
  const env = createBrowserEnvironment();
  const api = env.window.PK_CUSTOM_LESSONS;

  const lesson = api.create({
    title: 'Speed Drill',
    content: 'the quick brown fox'
  });

  // Initial progress is zeroed
  const initialProg = api.getProgress(lesson.id);
  assert.equal(initialProg.attempts, 0);
  assert.equal(initialProg.bestWpm, 0);

  // Record attempt 1
  api.recordAttempt(lesson.id, {
    accuracy: 90,
    wpm: 45,
    timeSec: 12,
    mistakes: 2
  });

  let curProg = api.getProgress(lesson.id);
  assert.equal(curProg.attempts, 1);
  assert.equal(curProg.completedCount, 1);
  assert.equal(curProg.bestAccuracy, 90);
  assert.equal(curProg.bestWpm, 45);

  // Record attempt 2 (higher speed)
  api.recordAttempt(lesson.id, {
    accuracy: 95,
    wpm: 60,
    timeSec: 10,
    mistakes: 1
  });

  curProg = api.getProgress(lesson.id);
  assert.equal(curProg.attempts, 2);
  assert.equal(curProg.bestAccuracy, 95);
  assert.equal(curProg.bestWpm, 60);

  // Reset progress for this lesson
  api.resetProgress(lesson.id);
  const resetProg = api.getProgress(lesson.id);
  assert.equal(resetProg.attempts, 0);
  assert.equal(resetProg.bestWpm, 0);

  // Lesson itself must still exist!
  assert.ok(api.get(lesson.id) !== null, 'Lesson content must remain intact after progress reset');
});

test('Custom Lessons: toCurriculumLesson produces valid definition compatible with startLesson', () => {
  const env = createBrowserEnvironment();
  const api = env.window.PK_CUSTOM_LESSONS;

  const customLesson = api.create({
    title: 'NiDA Vowel Mastery',
    content: 'ាំ ុំ ោះ ា ិ',
    targetLayout: 'nida',
    difficulty: 'intermediate'
  });

  const curDef = api.toCurriculumLesson(customLesson, 'nida');
  assert.equal(curDef.id, customLesson.id);
  assert.equal(curDef.title, 'NiDA Vowel Mastery');
  assert.equal(curDef.isCustom, true);
  assert.equal(curDef.type, 'custom');
  assert.equal(typeof curDef.generate, 'function');

  const generated = curDef.generate();
  assert.ok(Array.isArray(generated.chars));
  assert.ok(Array.isArray(generated.layers));
  assert.ok(Array.isArray(generated.keyIds));
  assert.ok(Array.isArray(generated.sections));
  assert.equal(generated.chars.length, generated.layers.length);
  assert.equal(generated.chars.length, generated.keyIds.length);
  assert.ok(generated.chars.length > 0);
  assert.equal(generated.sections[0].totalUnits, generated.chars.length);
});

test('Custom Lessons: UI markup in index.html contains accessible buttons and dialogs', () => {
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

  // Lesson Strip header button
  assert.ok(indexHtml.includes('id="lshCustomLessonsBtn"'), 'lshCustomLessonsBtn must exist in index.html');
  assert.ok(indexHtml.includes('css/custom-lessons.css'), 'custom-lessons.css must be linked');
  assert.ok(indexHtml.includes('js/custom-lessons.js'), 'custom-lessons.js must be loaded');

  // Modals
  assert.ok(indexHtml.includes('id="customLessonsModal"'), 'customLessonsModal must exist');
  assert.ok(indexHtml.includes('id="customLessonEditorModal"'), 'customLessonEditorModal must exist');
  assert.ok(indexHtml.includes('id="customLessonConfirmModal"'), 'customLessonConfirmModal must exist');

  // Grandmaster fanfare CTA
  assert.ok(indexHtml.includes('id="gmCreateCustomBtn"'), 'gmCreateCustomBtn must exist in fanfare modal');
});

test('Custom Lessons: Strict Zero-Emoji compliance across all custom lesson files', () => {
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;
  const filesToCheck = [
    'js/custom-lessons.js',
    'css/custom-lessons.css',
    'tests/custom_lessons.test.js'
  ];

  filesToCheck.forEach(file => {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
    assert.equal(emojiRegex.test(content), false, `File ${file} must have zero emojis`);
  });
});
