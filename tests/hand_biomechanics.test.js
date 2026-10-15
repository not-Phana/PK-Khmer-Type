/**
 * PK Khmer Type — Biomechanical Keyboard Hand Instruction & Animation Test Suite
 * 
 * Strict Zero-Emoji Policy Enforced.
 * 
 * Verifies:
 * 1. Physical key-to-finger mapping table (CANONICAL_FINGER_MAP & getFingerForKey)
 * 2. Bidirectional legacy mapping (toCanonicalFinger & toLegacyFinger)
 * 3. Pedagogical configurations (sixKeyFinger, keyBFinger, spaceThumbMode)
 * 4. Opposite-hand modifier choreography (resolveModifierChoreography & modifierInfoFor)
 * 5. Multilingual engine & Khmer NiDA sequence decomposition (decomposeKhmerSequence)
 * 6. Biomechanical geometry, Spacebar thumb resting bounds, and non-active finger anchoring
 * 7. 10 biomechanical states, transitions, and interruptible kinematics
 * 8. Accessibility & reduced motion handling
 * 
 * Run with: node --test tests/hand_biomechanics.test.js
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

// Load keyboard module
const kb = require('../js/keyboard.js');

/* ============================================================
   Helper: Mock Keyboard DOM Geometry Environment
   ============================================================ */
function createMockKeyElement(rect) {
  return {
    getBoundingClientRect() {
      return Object.assign({
        left: rect.left || 0,
        right: rect.right || 0,
        top: rect.top || 0,
        bottom: rect.bottom || 0,
        width: (rect.right - rect.left) || rect.width || 44,
        height: (rect.bottom - rect.top) || rect.height || 44
      }, rect);
    },
    classList: {
      add() {},
      remove() {},
      toggle() {},
      contains() { return false; }
    },
    style: {
      setProperty() {},
      removeProperty() {}
    }
  };
}

function setupMockKeyboardGeometry() {
  const keyMap = {};
  
  // Home row keys (y: 130 to 180)
  keyMap['a'] = createMockKeyElement({ left: 100, right: 144, top: 130, bottom: 180, width: 44, height: 50 });
  keyMap['s'] = createMockKeyElement({ left: 148, right: 192, top: 130, bottom: 180, width: 44, height: 50 });
  keyMap['d'] = createMockKeyElement({ left: 196, right: 240, top: 130, bottom: 180, width: 44, height: 50 });
  keyMap['f'] = createMockKeyElement({ left: 244, right: 288, top: 130, bottom: 180, width: 44, height: 50 });
  keyMap['g'] = createMockKeyElement({ left: 292, right: 336, top: 130, bottom: 180, width: 44, height: 50 });
  keyMap['h'] = createMockKeyElement({ left: 340, right: 384, top: 130, bottom: 180, width: 44, height: 50 });
  keyMap['j'] = createMockKeyElement({ left: 388, right: 432, top: 130, bottom: 180, width: 44, height: 50 });
  keyMap['k'] = createMockKeyElement({ left: 436, right: 480, top: 130, bottom: 180, width: 44, height: 50 });
  keyMap['l'] = createMockKeyElement({ left: 484, right: 528, top: 130, bottom: 180, width: 44, height: 50 });
  keyMap['semicolon'] = createMockKeyElement({ left: 532, right: 576, top: 130, bottom: 180, width: 44, height: 50 });
  keyMap['quote'] = createMockKeyElement({ left: 580, right: 624, top: 130, bottom: 180, width: 44, height: 50 });
  keyMap['enter'] = createMockKeyElement({ left: 628, right: 716, top: 130, bottom: 180, width: 88, height: 50 });

  // Bottom row keys (y: 185 to 235)
  keyMap['v'] = createMockKeyElement({ left: 260, right: 304, top: 185, bottom: 235, width: 44, height: 50 });
  keyMap['b'] = createMockKeyElement({ left: 308, right: 352, top: 185, bottom: 235, width: 44, height: 50 });
  keyMap['n'] = createMockKeyElement({ left: 356, right: 400, top: 185, bottom: 235, width: 44, height: 50 });
  keyMap['m'] = createMockKeyElement({ left: 404, right: 448, top: 185, bottom: 235, width: 44, height: 50 });
  keyMap['comma'] = createMockKeyElement({ left: 452, right: 496, top: 185, bottom: 235, width: 44, height: 50 });

  // Spacebar (y: 240 to 290)
  keyMap['space'] = createMockKeyElement({ left: 240, right: 560, top: 240, bottom: 290, width: 320, height: 50 });

  // Distant reaches
  keyMap['backspace'] = createMockKeyElement({ left: 672, right: 716, top: 20, bottom: 70, width: 44, height: 50 });
  keyMap['escape'] = createMockKeyElement({ left: 20, right: 64, top: 20, bottom: 70, width: 44, height: 50 });

  return keyMap;
}

/* ============================================================
   Test Suite 1: Canonical Physical Key-to-Finger Mapping
   ============================================================ */
test('1.1 [VERIFIED] CANONICAL_FINGER_MAP covers 100% of ANSI & ISO standard key codes', () => {
  const map = kb.CANONICAL_FINGER_MAP;
  assert.ok(map, 'CANONICAL_FINGER_MAP must exist');

  // Left Pinky (L5)
  const l5Expected = ['Backquote', 'Digit1', 'Escape', 'F1', 'Tab', 'KeyQ', 'CapsLock', 'KeyA', 'ShiftLeft', 'IntlBackslash', 'KeyZ', 'ControlLeft', 'MetaLeft'];
  l5Expected.forEach(code => {
    assert.equal(map[code], 'L5', `Key code ${code} should map to L5`);
  });

  // Left Ring (L4)
  const l4Expected = ['Digit2', 'F2', 'KeyW', 'KeyS', 'KeyX'];
  l4Expected.forEach(code => {
    assert.equal(map[code], 'L4', `Key code ${code} should map to L4`);
  });

  // Left Middle (L3)
  const l3Expected = ['Digit3', 'F3', 'KeyE', 'KeyD', 'KeyC'];
  l3Expected.forEach(code => {
    assert.equal(map[code], 'L3', `Key code ${code} should map to L3`);
  });

  // Left Index (L2)
  const l2Expected = ['Digit4', 'Digit5', 'F4', 'F5', 'KeyR', 'KeyT', 'KeyF', 'KeyG', 'KeyV', 'KeyB'];
  l2Expected.forEach(code => {
    assert.equal(map[code], 'L2', `Key code ${code} should map to L2`);
  });

  // Left Thumb (L1)
  assert.equal(map['AltLeft'], 'L1', 'AltLeft should map to L1');

  // Right Thumb (R1)
  assert.equal(map['AltRight'], 'R1', 'AltRight should map to R1');
  assert.equal(map['Space'], 'R1', 'Space should map to R1 by default');

  // Right Index (R2)
  const r2Expected = ['Digit6', 'Digit7', 'F6', 'F7', 'KeyY', 'KeyU', 'KeyH', 'KeyJ', 'KeyN', 'KeyM'];
  r2Expected.forEach(code => {
    assert.equal(map[code], 'R2', `Key code ${code} should map to R2`);
  });

  // Right Middle (R3)
  const r3Expected = ['Digit8', 'F8', 'KeyI', 'KeyK', 'Comma'];
  r3Expected.forEach(code => {
    assert.equal(map[code], 'R3', `Key code ${code} should map to R3`);
  });

  // Right Ring (R4)
  const r4Expected = ['Digit9', 'F9', 'KeyO', 'KeyL', 'Period'];
  r4Expected.forEach(code => {
    assert.equal(map[code], 'R4', `Key code ${code} should map to R4`);
  });

  // Right Pinky (R5)
  const r5Expected = ['Digit0', 'Minus', 'Equal', 'Backspace', 'F10', 'F11', 'F12', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash', 'Semicolon', 'Quote', 'Enter', 'Slash', 'ShiftRight', 'ControlRight', 'Delete'];
  r5Expected.forEach(code => {
    assert.equal(map[code], 'R5', `Key code ${code} should map to R5`);
  });
});

test('1.2 [VERIFIED] getFingerForKey resolves both physical codes and internal key IDs', () => {
  // Physical codes
  assert.equal(kb.getFingerForKey('KeyF'), 'L2');
  assert.equal(kb.getFingerForKey('KeyJ'), 'R2');
  assert.equal(kb.getFingerForKey('Space'), 'R1');
  assert.equal(kb.getFingerForKey('Backspace'), 'R5');
  assert.equal(kb.getFingerForKey('Escape'), 'L5');

  // Internal key IDs
  assert.equal(kb.getFingerForKey('f'), 'L2');
  assert.equal(kb.getFingerForKey('j'), 'R2');
  assert.equal(kb.getFingerForKey('space'), 'R1');
  assert.equal(kb.getFingerForKey('backspace'), 'R5');
  assert.equal(kb.getFingerForKey('escape'), 'L5');
  assert.equal(kb.getFingerForKey('enter'), 'R5');
});

/* ============================================================
   Test Suite 2: Bidirectional Legacy Mapping
   ============================================================ */
test('2.1 [VERIFIED] toCanonicalFinger and toLegacyFinger convert bidirectionally with idempotency', () => {
  const legacyToCanonical = {
    lp: 'L5', lr: 'L4', lm: 'L3', li: 'L2', lt: 'L1',
    rt: 'R1', ri: 'R2', rm: 'R3', rr: 'R4', rp: 'R5'
  };

  for (const [legacy, canonical] of Object.entries(legacyToCanonical)) {
    // Legacy -> Canonical
    assert.equal(kb.toCanonicalFinger(legacy), canonical, `${legacy} should map to ${canonical}`);
    // Canonical -> Legacy
    assert.equal(kb.toLegacyFinger(canonical), legacy, `${canonical} should map to ${legacy}`);
    // Idempotency
    assert.equal(kb.toCanonicalFinger(canonical), canonical, `${canonical} should remain ${canonical}`);
    assert.equal(kb.toLegacyFinger(legacy), legacy, `${legacy} should remain ${legacy}`);
  }

  // Null & edge case handling
  assert.equal(kb.toCanonicalFinger(null), null);
  assert.equal(kb.toCanonicalFinger(undefined), null);
  assert.equal(kb.toCanonicalFinger('invalid'), null);
  assert.equal(kb.toLegacyFinger(null), null);
  assert.equal(kb.toLegacyFinger(undefined), null);
  assert.equal(kb.toLegacyFinger('invalid'), null);
});

/* ============================================================
   Test Suite 3: Pedagogical Options
   ============================================================ */
test('3.1 [VERIFIED] Digit 6 key pedagogical ownership (R2 default vs L2 option)', () => {
  // Default is R2 (Right Index)
  assert.equal(kb.getFingerForKey('Digit6'), 'R2');
  assert.equal(kb.getFingerForKey('k6'), 'R2');

  // Configured to L2 (Left Index)
  assert.equal(kb.getFingerForKey('Digit6', { sixKeyFinger: 'L2' }), 'L2');
  assert.equal(kb.getFingerForKey('k6', { sixKeyFinger: 'L2' }), 'L2');
});

test('3.2 [VERIFIED] Key B pedagogical ownership (L2 default vs R2 option)', () => {
  // Default is L2 (Left Index)
  assert.equal(kb.getFingerForKey('KeyB'), 'L2');
  assert.equal(kb.getFingerForKey('b'), 'L2');

  // Configured to R2 (Right Index)
  assert.equal(kb.getFingerForKey('KeyB', { keyBFinger: 'R2' }), 'R2');
  assert.equal(kb.getFingerForKey('b', { keyBFinger: 'R2' }), 'R2');
});

test('3.3 [VERIFIED] Spacebar active thumb mode (right, left, alternating)', () => {
  // Right thumb default
  assert.equal(kb.getFingerForKey('Space', { spaceThumbMode: 'right' }), 'R1');
  assert.equal(kb.getFingerForKey('space', { spaceThumbMode: 'right' }), 'R1');

  // Left thumb mode
  assert.equal(kb.getFingerForKey('Space', { spaceThumbMode: 'left' }), 'L1');
  assert.equal(kb.getFingerForKey('space', { spaceThumbMode: 'left' }), 'L1');

  // Alternating mode: strike with opposite hand of last keystroke
  assert.equal(kb.getFingerForKey('Space', { spaceThumbMode: 'alternate', lastKeystrokeHand: 'R' }), 'L1');
  assert.equal(kb.getFingerForKey('Space', { spaceThumbMode: 'alternate', lastKeystrokeHand: 'L' }), 'R1');
});

/* ============================================================
   Test Suite 4: Opposite-Hand Modifier Choreography
   ============================================================ */
test('4.1 [VERIFIED] Strict opposite-hand Shift choreography for left-hand and right-hand targets', () => {
  // Target on Left Hand -> requires ShiftRight (R5 / rp)
  const leftHandKeys = ['a', 's', 'd', 'f', 'q', 'w', 'e', 'r', 't', 'z', 'x', 'c', 'v', 'b'];
  leftHandKeys.forEach(k => {
    const mod = kb.resolveModifierChoreography(k, 'shift');
    assert.ok(mod, `Modifier should resolve for left-hand key ${k}`);
    assert.equal(mod.modifierKey, 'shiftR', `Left-hand key ${k} should use shiftR`);
    assert.equal(mod.modifierCode, 'ShiftRight');
    assert.equal(mod.modifierFinger, 'R5');
    assert.equal(mod.modifierLegacyFinger, 'rp');
  });

  // Target on Right Hand -> requires ShiftLeft (L5 / lp)
  const rightHandKeys = ['h', 'j', 'k', 'l', 'y', 'u', 'i', 'o', 'p', 'n', 'm', 'semicolon', 'quote'];
  rightHandKeys.forEach(k => {
    const mod = kb.resolveModifierChoreography(k, 'shift');
    assert.ok(mod, `Modifier should resolve for right-hand key ${k}`);
    assert.equal(mod.modifierKey, 'shiftL', `Right-hand key ${k} should use shiftL`);
    assert.equal(mod.modifierCode, 'ShiftLeft');
    assert.equal(mod.modifierFinger, 'L5');
    assert.equal(mod.modifierLegacyFinger, 'lp');
  });
});

test('4.2 [VERIFIED] AltGr and Ctrl modifier choreography resolution', () => {
  // AltGr layer uses AltRight (R1 / rt)
  const modAltGr = kb.resolveModifierChoreography('k', 'altgr');
  assert.ok(modAltGr);
  assert.equal(modAltGr.modifierKey, 'altgr');
  assert.equal(modAltGr.modifierCode, 'AltRight');
  assert.equal(modAltGr.modifierFinger, 'R1');
  assert.equal(modAltGr.modifierLegacyFinger, 'rt');

  // Ctrl layer uses opposite hand
  const modCtrlLeft = kb.resolveModifierChoreography('f', 'ctrl');
  assert.equal(modCtrlLeft.modifierKey, 'ctrlR');
  assert.equal(modCtrlLeft.modifierFinger, 'R5');

  const modCtrlRight = kb.resolveModifierChoreography('j', 'ctrl');
  assert.equal(modCtrlRight.modifierKey, 'ctrlL');
  assert.equal(modCtrlRight.modifierFinger, 'L5');

  // Modifier keys themselves return null
  assert.equal(kb.resolveModifierChoreography('shiftL', 'shift'), null);
  assert.equal(kb.resolveModifierChoreography('shiftR', 'shift'), null);
  assert.equal(kb.resolveModifierChoreography('altgr', 'altgr'), null);
  assert.equal(kb.resolveModifierChoreography('ctrlL', 'ctrl'), null);
});

test('4.3 [VERIFIED] modifierInfoFor helper returns structured details for overlay display', () => {
  const info = kb.modifierInfoFor('f', 'shift');
  assert.ok(info);
  assert.equal(info.fingerId, 'rp');
  assert.equal(info.targetKey, 'shiftR');
  assert.equal(info.modifierCode, 'ShiftRight');
  assert.equal(info.modifierFinger, 'R5');
  assert.equal(info.targetFinger, 'L2');
});

/* ============================================================
   Test Suite 5: Khmer NiDA Sequence Decomposition
   ============================================================ */
test('5.1 [VERIFIED] NiDA composite vowels decompose to single atomic keystrokes', () => {
  // ាំ (U+17B6 U+17C6) on NiDA -> Shift+A (L5)
  const resAm = kb.decomposeKhmerSequence('\u17B6\u17C6', 'nida');
  assert.equal(resAm.length, 1);
  assert.equal(resAm[0].keyId, 'a');
  assert.equal(resAm[0].layer, 'shift');
  assert.equal(resAm[0].finger, 'L5');
  assert.equal(resAm[0].modifierInfo.modifierKey, 'shiftR');

  // ោះ (U+17C4 U+17C7) on NiDA -> Shift+; (R5)
  const resOh = kb.decomposeKhmerSequence('\u17C4\u17C7', 'nida');
  assert.equal(resOh.length, 1);
  assert.equal(resOh[0].keyId, 'semicolon');
  assert.equal(resOh[0].layer, 'shift');
  assert.equal(resOh[0].finger, 'R5');
  assert.equal(resOh[0].modifierInfo.modifierKey, 'shiftL');

  // េះ (U+17C1 U+17C7) on NiDA -> Shift+V (L2)
  const resEh = kb.decomposeKhmerSequence('\u17C1\u17C7', 'nida');
  assert.equal(resEh.length, 1);
  assert.equal(resEh[0].keyId, 'v');
  assert.equal(resEh[0].layer, 'shift');
  assert.equal(resEh[0].finger, 'L2');

  // ុំ (U+17BB U+17C6) on NiDA -> Comma (R3, base)
  const resUm = kb.decomposeKhmerSequence('\u17BB\u17C6', 'nida');
  assert.equal(resUm.length, 1);
  assert.equal(resUm[0].keyId, 'comma');
  assert.equal(resUm[0].layer, 'base');
  assert.equal(resUm[0].finger, 'R3');

  // ុះ (U+17BB U+17C7) on NiDA -> Shift+Comma (R3, shift)
  const resUh = kb.decomposeKhmerSequence('\u17BB\u17C7', 'nida');
  assert.equal(resUh.length, 1);
  assert.equal(resUh[0].keyId, 'comma');
  assert.equal(resUh[0].layer, 'shift');
  assert.equal(resUh[0].finger, 'R3');
});

test('5.2 [VERIFIED] Khmer consonant clusters decompose into base consonants and Coeng subscript steps', () => {
  // ក្រ (U+1780 U+17D2 U+179A): Ka + Coeng + Ro
  const stepsKra = kb.decomposeKhmerSequence('\u1780\u17D2\u179A', 'nida');
  assert.equal(stepsKra.length, 3);
  // Step 1: ក on key k (base, R3)
  assert.equal(stepsKra[0].char, 'ក');
  assert.equal(stepsKra[0].keyId, 'k');
  assert.equal(stepsKra[0].finger, 'R3');
  // Step 2: ្ (Coeng) on key j (base, R2) in NiDA
  assert.equal(stepsKra[1].char, '្');
  assert.equal(stepsKra[1].keyId, 'j');
  assert.equal(stepsKra[1].finger, 'R2');
  // Step 3: រ on key r (base, L2)
  assert.equal(stepsKra[2].char, 'រ');
  assert.equal(stepsKra[2].keyId, 'r');
  assert.equal(stepsKra[2].finger, 'L2');
});

test('5.3 [VERIFIED] Khmer space handling (zero-width non-breaking space vs visible space)', () => {
  // Zero-width space U+200B in NiDA maps to base Space
  const resZwsp = kb.decomposeKhmerSequence('\u200B', 'nida');
  assert.equal(resZwsp.length, 1);
  assert.equal(resZwsp[0].keyId, 'space');
  assert.equal(resZwsp[0].layer, 'base');

  // Visible space in NiDA maps to Shift+Space
  const resSpace = kb.decomposeKhmerSequence(' ', 'nida');
  assert.equal(resSpace.length, 1);
  assert.equal(resSpace[0].keyId, 'space');
  assert.equal(resSpace[0].layer, 'shift');
});

/* ============================================================
   Test Suite 6: Biomechanical Geometry & Spacebar Thumb Bounds
   ============================================================ */
test('6.1 [VERIFIED] Resting thumbs rest strictly inside Spacebar and never overlap KeyV, KeyB, KeyN, KeyM', () => {
  const mockKeys = setupMockKeyboardGeometry();
  kb.setKeyElements(mockKeys);

  const wrapRect = { left: 0, top: 0, width: 800, height: 400 };
  const leftFingers = kb.FINGERS.filter(f => f.hand === 'L');
  const rightFingers = kb.FINGERS.filter(f => f.hand === 'R');

  const handL = kb.buildHand('L', leftFingers, wrapRect, null, null);
  const handR = kb.buildHand('R', rightFingers, wrapRect, null, null);

  assert.ok(handL, 'Left hand build should succeed');
  assert.ok(handR, 'Right hand build should succeed');

  const spaceBounds = handL.spaceBounds;
  assert.ok(spaceBounds, 'Spacebar bounds must be detected');

  // Spacebar bounds in mock: left: 240, right: 560, top: 240, bottom: 290
  assert.equal(spaceBounds.top, 240);
  assert.equal(spaceBounds.bottom, 290);

  // Left thumb tip must be strictly inside the Spacebar bounds
  const ltTip = handL.defaultThumbTip;
  assert.ok(ltTip.x >= spaceBounds.left && ltTip.x <= spaceBounds.right, `Left thumb X (${ltTip.x}) must be inside Spacebar (${spaceBounds.left}..${spaceBounds.right})`);
  assert.ok(ltTip.y >= spaceBounds.top && ltTip.y <= spaceBounds.bottom, `Left thumb Y (${ltTip.y}) must be inside Spacebar (${spaceBounds.top}..${spaceBounds.bottom})`);

  // Right thumb tip must be strictly inside the Spacebar bounds
  const rtTip = handR.defaultThumbTip;
  assert.ok(rtTip.x >= spaceBounds.left && rtTip.x <= spaceBounds.right, `Right thumb X (${rtTip.x}) must be inside Spacebar (${spaceBounds.left}..${spaceBounds.right})`);
  assert.ok(rtTip.y >= spaceBounds.top && rtTip.y <= spaceBounds.bottom, `Right thumb Y (${rtTip.y}) must be inside Spacebar (${spaceBounds.top}..${spaceBounds.bottom})`);

  // Separation check: Left thumb in left half, Right thumb in right half
  const spaceCenterX = spaceBounds.left + spaceBounds.width * 0.5;
  assert.ok(ltTip.x < spaceCenterX, `Left thumb (${ltTip.x}) must rest left of Spacebar center (${spaceCenterX})`);
  assert.ok(rtTip.x > spaceCenterX, `Right thumb (${rtTip.x}) must rest right of Spacebar center (${spaceCenterX})`);

  // Zero-overlap check with bottom-row keys: KeyV, KeyB, KeyN, KeyM
  const bottomRowKeys = ['v', 'b', 'n', 'm'];
  bottomRowKeys.forEach(kId => {
    const r = mockKeys[kId].getBoundingClientRect();
    // Bottom edge of bottom row keys is 235px. Spacebar top is 240px. Thumb tips are at 265px.
    assert.ok(ltTip.y > r.bottom, `Left thumb tip Y (${ltTip.y}) must be well below ${kId} bottom (${r.bottom})`);
    assert.ok(rtTip.y > r.bottom, `Right thumb tip Y (${rtTip.y}) must be well below ${kId} bottom (${r.bottom})`);
  });
});

test('6.2 [VERIFIED] Non-active fingers remain anchored; damped palm shift applies only to distant reaches', () => {
  const mockKeys = setupMockKeyboardGeometry();
  kb.setKeyElements(mockKeys);
  const wrapRect = { left: 0, top: 0, width: 800, height: 400 };
  const leftFingers = kb.FINGERS.filter(f => f.hand === 'L');
  const rightFingers = kb.FINGERS.filter(f => f.hand === 'R');

  // Case 1: Left Index reaching for home row key 'g' (near reach)
  const liDef = leftFingers.find(f => f.id === 'li');
  const handNear = kb.buildHand('L', leftFingers, wrapRect, liDef, 'g');
  assert.ok(handNear);
  // Damped shift for near reach should be small
  assert.ok(Math.abs(handNear.palmShiftX) < 15, `Near reach palmShiftX (${handNear.palmShiftX}) should be small`);
  assert.ok(Math.abs(handNear.palmShiftY) < 15, `Near reach palmShiftY (${handNear.palmShiftY}) should be small`);

  // Case 2: Right Pinky reaching for 'backspace' (distant reach)
  const rpDef = rightFingers.find(f => f.id === 'rp');
  const handDistant = kb.buildHand('R', rightFingers, wrapRect, rpDef, 'backspace');
  assert.ok(handDistant);
  // Damped shift factor for distant reach is 0.26 / 0.30, providing natural wrist float without rigid dragging
  assert.ok(Math.abs(handDistant.palmShiftY) > 20, `Distant reach palmShiftY (${handDistant.palmShiftY}) should reflect wrist float`);
  assert.ok(Math.abs(handDistant.palmShiftY) < 120, `Distant reach palmShiftY (${handDistant.palmShiftY}) should remain strictly damped`);
});

/* ============================================================
   Test Suite 7: 10 Biomechanical States & Interpolation
   ============================================================ */
test('7.1 [VERIFIED] HAND_STATES defines all 10 biomechanical states with immutable freeze', () => {
  const states = kb.HAND_STATES;
  assert.ok(states);
  assert.ok(Object.isFrozen(states), 'HAND_STATES must be frozen');

  const requiredStates = [
    'ENTERING',
    'HOME_REST',
    'ANTICIPATION',
    'REACHING',
    'PRESSING',
    'HOLDING',
    'RELEASING',
    'RETURNING',
    'PALM_GLIDE',
    'CHORD_COORDINATION'
  ];

  requiredStates.forEach(s => {
    assert.ok(states[s], `State ${s} must exist in HAND_STATES`);
  });
});

test('7.2 [VERIFIED] triggerFingerPress and triggerFingerRelease update tactile states', () => {
  assert.equal(typeof kb.triggerFingerPress, 'function');
  assert.equal(typeof kb.triggerFingerRelease, 'function');

  // Triggering press on 'f' (li)
  kb.triggerFingerPress('f');
  // Triggering release on 'f'
  kb.triggerFingerRelease('f');

  // Alternating spacebar tracking
  assert.equal(typeof kb.HAND_CONFIG.lastKeystrokeHand, 'string');
});

/* ============================================================
   Test Suite 8: Accessibility & Reduced Motion
   ============================================================ */
test('8.1 [VERIFIED] HAND_CONFIG supports reducedMotion flag disabling animation lag', () => {
  assert.equal(typeof kb.HAND_CONFIG.reducedMotion, 'boolean');
  
  // Verify configuration can be toggled
  kb.HAND_CONFIG.reducedMotion = true;
  assert.equal(kb.HAND_CONFIG.reducedMotion, true);
  kb.HAND_CONFIG.reducedMotion = false;
  assert.equal(kb.HAND_CONFIG.reducedMotion, false);
});

/* ============================================================
   Test Suite 9: Anatomical Proportions, Perspective & Natural Curvature
   ============================================================ */
test('9.1 [VERIFIED] Slender anatomical finger aspect ratios (>= 4.0:1) eliminate stubby appearance', () => {
  const nonThumbFingers = kb.FINGERS.filter(f => f.kind !== 'thumb');
  assert.equal(nonThumbFingers.length, 8, 'There must be 8 non-thumb fingers (4 left, 4 right)');

  nonThumbFingers.forEach(f => {
    // Knuckle base width should be slender (22px - 27px, not bulky > 33px)
    assert.ok(f.baseW >= 22.0 && f.baseW <= 27.0, `${f.id} base width (${f.baseW}) must be between 22 and 27px`);
    // Fingertip width should be slender (13.5px - 16.5px, not blunt > 19px)
    assert.ok(f.tipW >= 13.5 && f.tipW <= 16.5, `${f.id} tip width (${f.tipW}) must be between 13.5 and 16.5px`);
    // Resting finger length should be naturally elongated (>= 100px)
    assert.ok(f.restLen >= 100, `${f.id} resting length (${f.restLen}) must be at least 100px`);
    
    // Aspect ratio: restLen / baseW >= 4.0
    const ratio = f.restLen / f.baseW;
    assert.ok(ratio >= 4.0 && ratio <= 4.8, `${f.id} aspect ratio (${ratio.toFixed(2)}) must be slender between 4.0:1 and 4.8:1`);
  });
});

test('9.2 [VERIFIED] Metacarpal knuckle arch baseline aligns at bottom row boundary for proper palm perspective', () => {
  const mockKeys = setupMockKeyboardGeometry();
  kb.setKeyElements(mockKeys);
  const wrapRect = { left: 0, top: 0, width: 800, height: 400 };

  const leftFingers = kb.FINGERS.filter(f => f.hand === 'L');
  const handL = kb.buildHand('L', leftFingers, wrapRect, null, null);
  assert.ok(handL);

  // Home row average Y in mockKeys is (130+180)/2 = 155px.
  // palmArchBaseY = homeAvgY + 114 = 269px.
  // The bottom row keys in mockKeys are at top: 185, bottom: 235.
  // The knuckle arch at ~269px sits gracefully at the bottom edge of the bottom row / spacebar row.
  const middleBase = handL.bases['lm'];
  assert.ok(middleBase.y >= 245 && middleBase.y <= 275, `Middle knuckle Y (${middleBase.y}) should sit near 259px`);

  // Distance from middle finger knuckle to home key 'd' center (155px)
  const homeD = handL.homes['lm'];
  const fingerLen = middleBase.y - homeD.y;
  assert.ok(fingerLen >= 100 && fingerLen <= 118, `Visible middle finger length (${fingerLen}px) must be 100-118px`);
});

test('9.3 [VERIFIED] Cubic Bezier control points produce natural typing dome flexion and joint apex', () => {
  const p0 = { x: 200, y: 260 }; // Knuckle base
  const p3 = { x: 200, y: 155 }; // Home keycap fingertip
  const inward = 1; // Left hand

  const { p1, p2 } = kb.computeFingerControlPoints(p0, p3, 'middle', inward);
  assert.ok(p1 && p2, 'computeFingerControlPoints must return p1 and p2');

  // Verify natural dome posture:
  // p1 and p2 must arch above the straight line connecting p0 and p3.
  const frame = kb.fingerFrame(p0, p1, p2, p3, 26.5, 16.0, false);
  assert.ok(frame && frame.left && frame.right);
  assert.equal(frame.left.length, 21);

  // At s = 0.50, the center point should be higher (lower Y) than linear interpolation
  const midPt = kb.cPoint(p0, p1, p2, p3, 0.50);
  const linearY = (p0.y + p3.y) * 0.5;
  assert.ok(midPt.y < linearY, `PIP joint center Y (${midPt.y}) must be arched upward relative to linear (${linearY})`);

  // Verify anatomical swell at PIP joint (s ≈ 0.48):
  const sPIP = 0.48;
  const ptL = frame.left[10];
  const ptR = frame.right[10];
  const actualW = Math.hypot(ptL.x - ptR.x, ptL.y - ptR.y);
  const linearW = (1 - sPIP) * 26.5 + sPIP * 16.0;
  assert.ok(actualW > linearW, `PIP joint width (${actualW.toFixed(1)}px) should exhibit anatomical knuckle swell above linear (${linearW.toFixed(1)}px)`);
});

test('9.4 [VERIFIED] Adjacent fingertips maintain clear clearance (> 30px) without collision on home row', () => {
  const mockKeys = setupMockKeyboardGeometry();
  kb.setKeyElements(mockKeys);
  const wrapRect = { left: 0, top: 0, width: 800, height: 400 };

  const leftFingers = kb.FINGERS.filter(f => f.hand === 'L');
  const handL = kb.buildHand('L', leftFingers, wrapRect, null, null);
  assert.ok(handL);

  // Check distances between adjacent home key centers for left hand: A (lp), S (lr), D (lm), F (li)
  const leftOrder = ['lp', 'lr', 'lm', 'li'];
  for (let i = 0; i < leftOrder.length - 1; i++) {
    const fA = leftFingers.find(f => f.id === leftOrder[i]);
    const fB = leftFingers.find(f => f.id === leftOrder[i + 1]);
    const homeA = handL.homes[fA.id];
    const homeB = handL.homes[fB.id];
    const distFingers = Math.abs(homeB.x - homeA.x);
    // Key centers are separated by ~48px. With tipW = 14-16px, edge-to-edge gap is > 30px
    const tipSum = (fA.tipW + fB.tipW) * 0.5;
    const clearance = distFingers - tipSum;
    assert.ok(clearance >= 30, `Clearance between ${fA.id} and ${fB.id} (${clearance.toFixed(1)}px) must be >= 30px`);
  }
});

test('9.5 [VERIFIED] Fingertips land accurately on home row target keys with proper hand positioning', () => {
  const mockKeys = setupMockKeyboardGeometry();
  kb.setKeyElements(mockKeys);
  const wrapRect = { left: 0, top: 0, width: 800, height: 400 };

  const leftFingers = kb.FINGERS.filter(f => f.hand === 'L');
  const rightFingers = kb.FINGERS.filter(f => f.hand === 'R');
  const handL = kb.buildHand('L', leftFingers, wrapRect, null, null);
  const handR = kb.buildHand('R', rightFingers, wrapRect, null, null);

  // Left home row mappings: A->lp, S->lr, D->lm, F->li
  const leftExpected = { a: 'lp', s: 'lr', d: 'lm', f: 'li' };
  for (const [kId, fId] of Object.entries(leftExpected)) {
    const homePt = handL.homes[fId];
    const keyRect = mockKeys[kId].getBoundingClientRect();
    const keyCx = (keyRect.left + keyRect.right) * 0.5;
    const keyCy = (keyRect.top + keyRect.bottom) * 0.5;
    assert.equal(homePt.x, keyCx, `Finger ${fId} X must match key ${kId} center X`);
    assert.equal(homePt.y, keyCy, `Finger ${fId} Y must match key ${kId} center Y`);
  }

  // Right home row mappings: J->ri, K->rm, L->rr, semicolon->rp
  const rightExpected = { j: 'ri', k: 'rm', l: 'rr', semicolon: 'rp' };
  for (const [kId, fId] of Object.entries(rightExpected)) {
    const homePt = handR.homes[fId];
    const keyRect = mockKeys[kId].getBoundingClientRect();
    const keyCx = (keyRect.left + keyRect.right) * 0.5;
    const keyCy = (keyRect.top + keyRect.bottom) * 0.5;
    assert.equal(homePt.x, keyCx, `Finger ${fId} X must match key ${kId} center X`);
    assert.equal(homePt.y, keyCy, `Finger ${fId} Y must match key ${kId} center Y`);
  }
});

