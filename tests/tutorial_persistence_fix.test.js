import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

function createMockSandbox(mockStorage = {}) {
  const sandbox = {
    window: { addEventListener: () => {}, removeEventListener: () => {} },
    document: {
      readyState: 'complete',
      body: { appendChild: () => {} },
      addEventListener: () => {},
      removeEventListener: () => {},
      documentElement: { classList: { contains: () => false, add: () => {}, remove: () => {} } },
      createElement: () => ({
        setAttribute: () => {},
        querySelector: () => null,
        querySelectorAll: () => [],
        style: {},
        classList: { add: () => {}, remove: () => {} }
      }),
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => []
    },
    localStorage: {
      length: Object.keys(mockStorage).length,
      key(i) { return Object.keys(mockStorage)[i]; },
      getItem(k) { return mockStorage[k] || null; },
      setItem(k, v) { mockStorage[k] = String(v); },
      removeItem(k) { delete mockStorage[k]; }
    },
    setTimeout: (fn) => fn(),
    console
  };
  sandbox.global = sandbox;
  sandbox.window.document = sandbox.document;
  return sandbox;
}

test('Tutorial Engine 1.1: hasUserProgress detects existing lesson completions across all storage vectors', () => {
  const tutCode = fs.readFileSync(path.resolve('js/tutorial.js'), 'utf8');

  assert.ok(tutCode.includes('hasUserProgress()'), 'tutorial.js must declare hasUserProgress()');
  assert.ok(tutCode.includes('khmerLessonBest_'), 'hasUserProgress must check khmerLessonBest_ storage keys');
  assert.ok(tutCode.includes('khmerProgress_v2'), 'hasUserProgress must check khmerProgress_v2 storage');

  const mockStorage = {
    'khmerLessonBest_standard-L00-01': JSON.stringify({ accuracy: 98, attempts: 1, mastered: true })
  };

  const sandbox = createMockSandbox(mockStorage);
  vm.createContext(sandbox);
  vm.runInContext(tutCode, sandbox);

  const engine = sandbox.global.PK_TUTORIAL || sandbox.window.PK_TUTORIAL;
  assert.ok(engine, 'PK_TUTORIAL engine must be initialized');
  assert.equal(engine.hasUserProgress(), true, 'Must detect user progress when khmerLessonBest exists');
  assert.equal(engine.isNewUser(), false, 'User with completed lessons must not be recognized as new user');
});

test('Tutorial Engine 1.2: init() auto-completes and refuses to resume onboarding when user has completed lessons', () => {
  const tutCode = fs.readFileSync(path.resolve('js/tutorial.js'), 'utf8');

  const mockStorage = {
    'khmerTutorialStep': 'lesson-track-progress',
    'khmerLessonBest_standard-L00-01': JSON.stringify({ accuracy: 100, attempts: 2, mastered: true }),
    'khmerLessonBest_standard-L00-02': JSON.stringify({ accuracy: 96, attempts: 1, mastered: true }),
    'khmerLessonBest_standard-L00-03': JSON.stringify({ accuracy: 95, attempts: 1, mastered: true })
  };

  let welcomeShown = false;
  let resumed = false;

  const sandbox = createMockSandbox(mockStorage);
  vm.createContext(sandbox);
  vm.runInContext(tutCode, sandbox);

  const engine = sandbox.global.PK_TUTORIAL || sandbox.window.PK_TUTORIAL;
  engine.showWelcome = () => { welcomeShown = true; };
  engine.resume = () => { resumed = true; };

  engine.init();

  assert.equal(resumed, false, 'Must NOT resume tutorial when user has completed lessons');
  assert.equal(welcomeShown, false, 'Must NOT show welcome when user has completed lessons');
  assert.equal(mockStorage['khmerTutorialCompleted'], '1', 'Must mark khmerTutorialCompleted = 1');
  assert.equal(mockStorage['khmerTutorialStep'], undefined, 'Must remove khmerTutorialStep from storage');
});

test('Tutorial Engine 1.3: skip() cleans up and writes both completion and skipped markers', () => {
  const tutCode = fs.readFileSync(path.resolve('js/tutorial.js'), 'utf8');

  const mockStorage = {
    'khmerTutorialStep': 'lesson-track-progress'
  };

  const sandbox = createMockSandbox(mockStorage);
  vm.createContext(sandbox);
  vm.runInContext(tutCode, sandbox);

  const engine = sandbox.global.PK_TUTORIAL || sandbox.window.PK_TUTORIAL;
  engine.skip();

  assert.equal(mockStorage['khmerTutorialSkipped'], '1', 'skip() must set khmerTutorialSkipped = 1');
  assert.equal(mockStorage['khmerTutorialCompleted'], '1', 'skip() must set khmerTutorialCompleted = 1');
  assert.equal(mockStorage['khmerTutorialStep'], undefined, 'skip() must purge khmerTutorialStep');
  assert.equal(engine.active, false, 'Engine must be inactive after skip()');
});

test('Tutorial Engine 1.4: Strict Zero-Emoji compliance on modified tutorial files', () => {
  const files = [
    'js/tutorial.js',
    'js/lessons.js',
    'tests/tutorial_persistence_fix.test.js'
  ];

  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;

  for (const rel of files) {
    const content = fs.readFileSync(path.resolve(rel), 'utf8');
    const match = content.match(emojiRegex);
    assert.strictEqual(match, null, `Strict Zero-Emoji Violation in ${rel}: found "${match ? match[0] : ''}"`);
  }
});
