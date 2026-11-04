import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const smoothCursorCode = fs.readFileSync(path.resolve('js/smooth-cursor.js'), 'utf8');
const inspectorCode = fs.readFileSync(path.resolve('js/cursor-inspector.js'), 'utf8');
const keyboardCode = fs.readFileSync(path.resolve('js/keyboard.js'), 'utf8');

test('Smooth Cursor: isolates active glyph on keys without concatenating shift-badge into dual glyphs', () => {
  assert.ok(smoothCursorCode.includes('.querySelector(\'.glyph\')'), 'Queries active glyph element first');
  assert.ok(smoothCursorCode.includes('shift-badge'), 'Guards against shift-badge concatenation');

  class MockElement {
    constructor(tagName) {
      this.tagName = tagName;
      this.attributes = {};
    }
    getAttribute(name) { return this.attributes[name] || null; }
    setAttribute(name, val) { this.attributes[name] = val; }
    closest(selector) {
      if (selector === '.key') return this;
      return null;
    }
    querySelector(selector) {
      if (selector === '.glyph') return { textContent: '\\' };
      return null;
    }
    cloneNode() {
      return {
        querySelectorAll: () => [],
        textContent: '\\|'
      };
    }
  }

  const mockKeyEl = new MockElement('DIV');
  mockKeyEl.setAttribute('data-key', 'backslash');
  mockKeyEl.setAttribute('data-code', 'Backslash');
  mockKeyEl.textContent = '\\|';

  const fnMatch = smoothCursorCode.match(/function resolveHoverLabel\(el\)\s*\{[\s\S]*?\n  \}/);
  assert.ok(fnMatch, 'resolveHoverLabel function found in smooth-cursor.js');

  const testResolveLabel = new Function('el', 'Element', 'window', fnMatch[0] + '\nreturn resolveHoverLabel(el);');
  const label = testResolveLabel(mockKeyEl, MockElement, { glyphData: { backslash: { base: '\\', shift: '|' } }, currentLayer: () => 'base' });

  assert.equal(label, 'KEY \\', 'Label is "KEY \\" and NOT "KEY \\|"');
});

test('Cursor Inspector: ASCII punctuation dictionary correctly identifies backslash and symbols', () => {
  const mockDoc = {
    documentElement: { classList: { contains: () => false } },
    createElement: () => ({ setAttribute: () => {}, appendChild: () => {}, classList: { add: () => {}, remove: () => {} }, style: {} }),
    body: { appendChild: () => {} },
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => []
  };
  const mockWin = {
    addEventListener: () => {},
    localStorage: { getItem: () => 'true', setItem: () => {} },
    currentLayoutId: 'english',
    currentLayer: () => 'base'
  };

  const runInspector = new Function('window', 'document', inspectorCode);
  runInspector(mockWin, mockDoc);

  const inspector = mockWin.PK_MOUSE_INSPECTOR || mockWin.PKCursorInspector;
  assert.ok(inspector, 'PK_MOUSE_INSPECTOR is exposed on window');
  const info = inspector.getCharInfo('\\');
  assert.ok(info, 'CharInfo exists for backslash');
  assert.equal(info.nameEn, 'Backslash', 'English name is Backslash');
  assert.equal(info.type, 'Punctuation', 'Type is Punctuation');
  assert.ok(info.nameKm.includes('Backslash'), 'Khmer name contains Backslash reference');
});

test('Keyboard: Perimeter reach configuration includes backslash, equal, bracketR, and bracketL', () => {
  assert.ok(keyboardCode.includes("'backslash'"), 'backslash key is tracked');
  
  // Verify isPerimeterKey contains backslash, bracketR, bracketL, equal
  const perimeterMatch = keyboardCode.match(/const isPerimeterKey = \[([^\]]+)\]\.includes\(targetKey\);/);
  assert.ok(perimeterMatch, 'isPerimeterKey definition found');
  const keys = perimeterMatch[1];
  assert.ok(keys.includes('backslash'), 'isPerimeterKey includes backslash');
  assert.ok(keys.includes('bracketR'), 'isPerimeterKey includes bracketR');
  assert.ok(keys.includes('bracketL'), 'isPerimeterKey includes bracketL');
  assert.ok(keys.includes('equal'), 'isPerimeterKey includes equal');

  // Verify pinky maxReach accommodates perimeter keys without premature clamping
  const reachMatch = keyboardCode.match(/const maxReach = f\.kind === 'pinky'\s*\?\s*\(\(f\.restLen\s*\|\|\s*100\)\s*\*\s*([\d\.]+)\)/);
  assert.ok(reachMatch, 'maxReach formula found');
  const pinkyMultiplier = parseFloat(reachMatch[1]);
  assert.ok(pinkyMultiplier >= 1.75, 'Pinky reach multiplier is at least 1.75 (generous perimeter reach)');
});

test('Zero-Emoji Compliance on modified files', () => {
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  assert.ok(!emojiRegex.test(smoothCursorCode), 'js/smooth-cursor.js is 100% zero-emoji clean');
  assert.ok(!emojiRegex.test(inspectorCode), 'js/cursor-inspector.js is 100% zero-emoji clean');
  assert.ok(!emojiRegex.test(keyboardCode), 'js/keyboard.js is 100% zero-emoji clean');
});
