import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

test('Performance Optimization: keyCoordCache prevents forced layout thrashing', () => {
  const keyboardCode = fs.readFileSync(path.resolve('js/keyboard.js'), 'utf8');

  // Verify caching logic exists in code
  assert.match(keyboardCode, /let keyCoordCache = \{\};/);
  assert.match(keyboardCode, /function invalidateKeyCoordCache\(\)/);
  assert.match(keyboardCode, /keyCoordCache\[id\]/);

  // Set up mock DOM environment
  let gbcCallCount = 0;
  const mockKeyEl = {
    getBoundingClientRect() {
      gbcCallCount++;
      return { left: 100, top: 200, width: 40, height: 40, right: 140, bottom: 240 };
    }
  };

  const sandbox = {
    window: {
      addEventListener: () => {},
      removeEventListener: () => {},
      matchMedia: () => ({ matches: false })
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    matchMedia: () => ({ matches: false }),
    global: {},
    document: {
      documentElement: { classList: { contains: () => false, add: () => {}, remove: () => {} } },
      getElementById: () => null,
      createElement: () => ({ style: {}, appendChild: () => {}, classList: { add: () => {}, remove: () => {}, contains: () => false } }),
      createElementNS: () => ({ setAttribute: () => {}, appendChild: () => {}, dataset: {}, style: {}, classList: { add: () => {}, remove: () => {}, contains: () => false } }),
      querySelectorAll: () => []
    },
    SVGNS: 'http://www.w3.org/2000/svg',
    boardWrap: {
      getBoundingClientRect() {
        return { left: 0, top: 0, width: 800, height: 400, right: 800, bottom: 400 };
      }
    },
    handsOverlay: {
      setAttribute: () => {},
      classList: { add: () => {}, remove: () => {}, toggle: () => {} },
      style: {}
    },
    handGroupL: { appendChild: () => {} },
    handGroupR: { appendChild: () => {} },
    palmShapeL: { setAttribute: () => {} },
    palmShapeR: { setAttribute: () => {} },
    palmShadeL: { setAttribute: () => {} },
    palmShadeR: { setAttribute: () => {} },
    palmHiL: { setAttribute: () => {} },
    palmHiR: { setAttribute: () => {} },
    palmCoreL: { setAttribute: () => {} },
    palmCoreR: { setAttribute: () => {} },
    keyEls: {
      a: mockKeyEl,
      space: {
        getBoundingClientRect() {
          return { left: 200, top: 300, width: 300, height: 40, right: 500, bottom: 340 };
        }
      }
    },
    console,
    Math,
    Object,
    Array,
    Set,
    Map,
    Date
  };
  sandbox.window = sandbox;

  vm.createContext(sandbox);
  vm.runInContext(keyboardCode, sandbox);

  // Register mock key element and invalidate initial cache
  sandbox.setKeyElements({ a: mockKeyEl });
  sandbox.invalidateKeyCoordCache();

  // First call should query DOM and cache coordinates
  gbcCallCount = 0;
  const c1 = sandbox.keyCenter('a', { left: 0, top: 0 });
  assert.equal(gbcCallCount, 1);
  assert.equal(c1.x, 120);
  assert.equal(c1.y, 220);

  // Subsequent calls MUST use cache with 0 getBoundingClientRect calls
  const c2 = sandbox.keyCenter('a', { left: 0, top: 0 });
  const c3 = sandbox.keyCenter('a', { left: 0, top: 0 });
  assert.equal(gbcCallCount, 1, 'keyCenter should not call getBoundingClientRect on subsequent lookups');
  assert.deepEqual(c2, c1);
  assert.deepEqual(c3, c1);

  // Invalidate cache
  sandbox.invalidateKeyCoordCache();
  const c4 = sandbox.keyCenter('a', { left: 0, top: 0 });
  assert.equal(gbcCallCount, 2, 'invalidateKeyCoordCache should cause fresh measurement on next lookup');
  assert.deepEqual(c4, c1);
});

test('Performance Optimization: strikeFinger avoids forced synchronous reflow', () => {
  const keyboardCode = fs.readFileSync(path.resolve('js/keyboard.js'), 'utf8');

  // Verify getBoundingClientRect is NOT called in strikeFinger
  assert.doesNotMatch(keyboardCode, /void fe\.g\.getBoundingClientRect\(\)/, 'void fe.g.getBoundingClientRect() must be eliminated');
  assert.match(keyboardCode, /fe\.g\.getAnimations/, 'strikeFinger should use getAnimations for smooth restart');
});

test('Dead Code Elimination: Dead finger SVG nodes and per-frame mutations are removed', () => {
  const keyboardCode = fs.readFileSync(path.resolve('js/keyboard.js'), 'utf8');
  const keyboardCss = fs.readFileSync(path.resolve('css/keyboard.css'), 'utf8');

  // SVG elements should not be appended into finger group
  assert.doesNotMatch(keyboardCode, /g\.appendChild\(joint1\)/);
  assert.doesNotMatch(keyboardCode, /g\.appendChild\(shine\)/);
  assert.doesNotMatch(keyboardCode, /g\.appendChild\(energy\)/);
  assert.doesNotMatch(keyboardCode, /g\.appendChild\(nail\)/);

  // RenderFrame should not mutate dead attributes every frame
  assert.doesNotMatch(keyboardCode, /fe\.joint1\.setAttribute\('r', '0'\)/);
  assert.doesNotMatch(keyboardCode, /fe\.shine\.setAttribute\('d', ''\)/);
  assert.doesNotMatch(keyboardCode, /fe\.nail\.setAttribute\('d', ''\)/);

  // Dead CSS selectors in keyboard.css should be eliminated
  assert.doesNotMatch(keyboardCss, /\.hands-overlay \.target-reticle/);
  assert.doesNotMatch(keyboardCss, /\.hands-overlay \.finger-nail,/);
});

test('Performance Optimization: typing FX coordinate caching avoids layout recalculation', () => {
  const typingCode = fs.readFileSync(path.resolve('js/typing.js'), 'utf8');

  assert.match(typingCode, /let fxCoordCache = new WeakMap\(\);/);
  assert.match(typingCode, /fxCoordCache\.get\(el\)/);
  assert.match(typingCode, /fxCoordCache\.set\(el, cached\)/);
});

test('Performance Optimization: saveActiveLessonSession debounces disk serialization', () => {
  const lessonsCode = fs.readFileSync(path.resolve('js/lessons.js'), 'utf8');

  assert.match(lessonsCode, /let _activeLessonSaveTimer = null;/);
  assert.match(lessonsCode, /function _doSaveActiveLessonSession\(\)/);
  assert.match(lessonsCode, /saveActiveLessonSession\(immediate = false\)/);
  assert.match(lessonsCode, /saveActiveLessonSession\.flush/);
  assert.match(lessonsCode, /window\.addEventListener\('beforeunload', \(\) => saveActiveLessonSession\(true\)\)/);
});

test('Performance Optimization: smooth-cursor physicsStep pauses when idle', () => {
  const cursorCode = fs.readFileSync(path.resolve('js/smooth-cursor.js'), 'utf8');

  assert.match(cursorCode, /const arrowDist = Math\.hypot\(targetX - arrowX, targetY - arrowY\);/);
  assert.match(cursorCode, /const badgeDist = Math\.hypot\(badgeTargetX - badgeX, badgeTargetY - badgeY\);/);
  assert.match(cursorCode, /rafId = null;\s*return;/);
  assert.match(cursorCode, /startPhysicsLoop\(\);/);
});

test('Strict Zero-Emoji Policy: Verified across all modified files', () => {
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;
  const files = [
    'js/keyboard.js',
    'js/lessons.js',
    'js/typing.js',
    'js/smooth-cursor.js',
    'css/keyboard.css',
    'tests/performance_optimization_and_dead_code.test.js'
  ];

  for (const file of files) {
    const content = fs.readFileSync(path.resolve(file), 'utf8');
    const match = content.match(emojiRegex);
    assert.equal(match, null, `Forbidden Unicode emoji found in ${file}: ${match ? match[0] : ''}`);
  }
});
