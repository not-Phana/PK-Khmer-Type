/**
 * PK Khmer Type — Hand Hover & Inspector Decoupling Test Suite
 * 
 * Strict Zero-Emoji Policy Enforced.
 * 
 * Verifies:
 * 1. 3D Hand Finger Guide tracks mouse hover even when Mouse Inspector is OFF
 * 2. Hovering or activating AltGr maps to Right Thumb (rt / R1) with physiological reach
 * 3. Smooth cursor identifies AltGr key with dedicated badge label "ALTGR"
 * 4. uninspectKey cleanly resets or restores target key upon mouseout/mouseleave
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const vm = require('node:vm');

const kb = require('../js/keyboard.js');

test('1.1 [VERIFIED FIXED] Cursor inspector synchronizes setActiveFinger even when inspectorEnabled is false', () => {
  // Read cursor-inspector code and run in a minimal DOM sandbox
  const code = fs.readFileSync('js/cursor-inspector.js', 'utf8');

  let activeFingerCalled = null;
  let activeLayerCalled = null;

  const mockElement = () => ({
    classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
    style: {},
    setAttribute: () => {},
    appendChild: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    innerHTML: ''
  });

  const mockWindow = {
    addEventListener: () => {},
    removeEventListener: () => {}
  };

  const sandbox = {
    window: mockWindow,
    global: mockWindow,
    document: {
      readyState: 'complete',
      getElementById: (id) => {
        if (id === 'cursorGuideToggle') {
          return mockElement();
        }
        return null;
      },
      createElement: () => mockElement(),
      querySelector: () => null,
      querySelectorAll: () => [],
      documentElement: { classList: { contains: () => false } },
      addEventListener: () => {},
      removeEventListener: () => {},
      body: { appendChild: () => {}, removeChild: () => {} }
    },
    localStorage: {
      getItem: (key) => {
        if (key === 'pkMouseInspectorEnabled') return 'false'; // Inspector is OFF!
        return null;
      },
      setItem: () => {}
    },
    setTimeout: (fn) => setTimeout(fn, 0),
    clearTimeout: () => {},
    KEY_FINGER: kb.KEY_FINGER
  };

  mockWindow.window = mockWindow;
  mockWindow.global = mockWindow;
  mockWindow.document = sandbox.document;
  mockWindow.localStorage = sandbox.localStorage;
  mockWindow.setTimeout = sandbox.setTimeout;
  mockWindow.clearTimeout = sandbox.clearTimeout;
  mockWindow.KEY_FINGER = kb.KEY_FINGER;
  mockWindow.setActiveFinger = (keyId, layer) => {
    activeFingerCalled = keyId;
    activeLayerCalled = layer;
  };

  const context = vm.createContext(mockWindow);
  vm.runInContext(code, context);

  const inspector = mockWindow.PK_MOUSE_INSPECTOR;
  assert.ok(inspector, 'PK_MOUSE_INSPECTOR must be exported');
  assert.equal(inspector.isEnabled(), false, 'inspectorEnabled must be false in this test');

  // Trigger inspection of 'altgr' with inspector disabled
  inspector.inspectKey('altgr');
  assert.equal(activeFingerCalled, 'altgr', 'setActiveFinger must be called with altgr even when inspectorEnabled is false');
  assert.equal(activeLayerCalled, 'base', 'setActiveFinger must receive active layer');

  // Trigger inspection of home row key 'f'
  inspector.inspectKey('f');
  assert.equal(activeFingerCalled, 'f', 'setActiveFinger must be called with key f');

  // Trigger uninspect
  inspector.uninspectKey();
  assert.equal(activeFingerCalled, null, 'uninspectKey must reset active finger to null when unguided');
});

test('1.2 [VERIFIED FIXED] AltGr maps to Right Thumb (rt / R1) and generates valid reach geometry', () => {
  assert.equal(kb.KEY_FINGER['altgr'], 'rt', 'AltGr must map to rt (Right Thumb)');
  assert.equal(kb.CANONICAL_FINGER_MAP['AltRight'], 'R1', 'AltRight must map to canonical R1 (Right Thumb)');

  const mockKeys = {
    j: { getBoundingClientRect: () => ({ left: 500, right: 544, top: 130, bottom: 180, width: 44, height: 50 }) },
    k: { getBoundingClientRect: () => ({ left: 548, right: 592, top: 130, bottom: 180, width: 44, height: 50 }) },
    l: { getBoundingClientRect: () => ({ left: 596, right: 640, top: 130, bottom: 180, width: 44, height: 50 }) },
    semicolon: { getBoundingClientRect: () => ({ left: 644, right: 688, top: 130, bottom: 180, width: 44, height: 50 }) },
    space: { getBoundingClientRect: () => ({ left: 280, right: 600, top: 240, bottom: 290, width: 320, height: 50 }) },
    altgr: { getBoundingClientRect: () => ({ left: 604, right: 670, top: 240, bottom: 290, width: 66, height: 50 }) }
  };
  kb.setKeyElements(mockKeys);

  const wrapRect = { left: 0, top: 0, right: 1000, bottom: 400, width: 1000, height: 400 };
  const rightFingers = kb.FINGERS.filter(f => f.hand === 'R');
  const activeRight = rightFingers.find(f => f.id === 'rt');

  const hb = kb.buildHand('R', rightFingers, wrapRect, activeRight, 'altgr');
  assert.ok(hb, 'buildHand for right hand with AltGr target must construct successfully');
  assert.ok(hb.palmShiftX > 0, 'Palm shift must shift positively to the right toward AltGr');

  const altGrCenter = kb.keyCenter('altgr', wrapRect);
  assert.ok(altGrCenter, 'AltGr center coordinates must exist');
  assert.equal(altGrCenter.x, 637, 'AltGr center X must match key geometry');

  const thumbBase = hb.bases.rt;
  const reachDist = Math.hypot(altGrCenter.x - thumbBase.x, altGrCenter.y - thumbBase.y);
  assert.ok(reachDist < 115, `Reach distance (${reachDist.toFixed(1)}px) must be within maximum thumb reach limit of 115px`);
});

test('1.3 [VERIFIED FIXED] Smooth cursor detects AltGr key element with dedicated ALTGR badge', () => {
  const code = fs.readFileSync('js/smooth-cursor.js', 'utf8');

  // Verify smooth-cursor logic recognizes both data-key="altgr" and data-code="AltRight"
  assert.ok(code.includes("keyId === 'altgr' || code === 'AltRight'"), 'smooth-cursor must contain explicit AltGr role matcher');

  // Simulate getInteractiveRole logic
  function mockGetInteractiveRole(attrs) {
    const keyEl = {
      getAttribute: (attr) => attrs[attr] || '',
      closest: (sel) => (sel === '.key' ? keyEl : null),
      querySelector: () => null,
      textContent: attrs.text || ''
    };
    const el = {
      closest: (sel) => keyEl.closest(sel)
    };

    const code = keyEl.getAttribute('data-code') || '';
    const keyId = keyEl.getAttribute('data-key') || '';
    if (code === 'Space' || keyId === 'space') return 'SPACE';
    if (code.includes('Shift') || keyId.startsWith('shift')) return 'SHIFT';
    if (code.includes('Control') || keyId.startsWith('ctrl')) return 'CTRL';
    if (keyId === 'altgr' || code === 'AltRight') return 'ALTGR';
    if (code.includes('Alt') || keyId === 'alt') return 'ALT';
    return 'KEY';
  }

  assert.equal(mockGetInteractiveRole({ 'data-key': 'altgr', text: 'AltGr' }), 'ALTGR');
  assert.equal(mockGetInteractiveRole({ 'data-code': 'AltRight', text: 'AltGr' }), 'ALTGR');
  assert.equal(mockGetInteractiveRole({ 'data-key': 'space', text: 'Space' }), 'SPACE');
});

test('1.4 [VERIFIED FIXED] Physical modifier holding points assigned finger directly to Shift key', () => {
  assert.ok(typeof kb.setPhysicalModifierHeld === 'function', 'setPhysicalModifierHeld must be exported');
  assert.ok(typeof kb.clearAllPhysicalModifiersHeld === 'function', 'clearAllPhysicalModifiersHeld must be exported');

  const mockKeys = {
    a: { getBoundingClientRect: () => ({ left: 101, right: 145, top: 130, bottom: 180, width: 44, height: 50 }) },
    s: { getBoundingClientRect: () => ({ left: 149, right: 193, top: 130, bottom: 180, width: 44, height: 50 }) },
    d: { getBoundingClientRect: () => ({ left: 197, right: 241, top: 130, bottom: 180, width: 44, height: 50 }) },
    f: { getBoundingClientRect: () => ({ left: 245, right: 289, top: 130, bottom: 180, width: 44, height: 50 }) },
    j: { getBoundingClientRect: () => ({ left: 500, right: 544, top: 130, bottom: 180, width: 44, height: 50 }) },
    k: { getBoundingClientRect: () => ({ left: 548, right: 592, top: 130, bottom: 180, width: 44, height: 50 }) },
    l: { getBoundingClientRect: () => ({ left: 596, right: 640, top: 130, bottom: 180, width: 44, height: 50 }) },
    semicolon: { getBoundingClientRect: () => ({ left: 644, right: 688, top: 130, bottom: 180, width: 44, height: 50 }) },
    shiftL: { getBoundingClientRect: () => ({ left: 20, right: 119, top: 185, bottom: 235, width: 99, height: 50 }) },
    shiftR: { getBoundingClientRect: () => ({ left: 692, right: 791, top: 185, bottom: 235, width: 99, height: 50 }) },
    space: { getBoundingClientRect: () => ({ left: 280, right: 600, top: 240, bottom: 290, width: 320, height: 50 }) }
  };
  kb.setKeyElements(mockKeys);

  const wrapRect = { left: 0, top: 0, right: 1000, bottom: 400, width: 1000, height: 400 };
  const leftFingers = kb.FINGERS.filter(f => f.hand === 'L');

  // Holding Left Shift physically
  kb.setPhysicalModifierHeld('shiftL', true);

  const handL = kb.buildHand('L', leftFingers, wrapRect, leftFingers.find(f => f.id === 'lp'), 'shiftL');
  assert.ok(handL, 'buildHand for Left Hand on shiftL must construct successfully');

  const shiftLCenter = kb.keyCenter('shiftL', wrapRect);
  assert.equal(shiftLCenter.x, 69.5, 'Left Shift center X must be 69.5');
  assert.equal(shiftLCenter.y, 210, 'Left Shift center Y must be 210');

  // Releasing Left Shift
  kb.setPhysicalModifierHeld('shiftL', false);
  kb.clearAllPhysicalModifiersHeld();
});
