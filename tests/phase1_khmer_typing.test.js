// tests/phase1_khmer_typing.test.js
// Automated test suite for Phase 1: Khmer Typing Engine, NiDA Mapping & Unicode Handling

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

// Mock browser environment for node testing
global.window = {
  addEventListener: () => {},
  document: {}
};
global.document = {
  activeElement: null,
  getElementById: () => null,
  addEventListener: () => {}
};

// Load typing.js
eval(fs.readFileSync(path.join(__dirname, '../js/typing.js'), 'utf8'));

// Load keyboard layout definitions
const kb = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/keyboard.json'), 'utf8'));

function buildKeyById(rows){
  const map = {};
  rows.forEach(row => row.forEach(k => { if(k.kind === 'glyph') map[k.id] = k; }));
  return map;
}

const KEY_BY_ID_NIDA = buildKeyById(kb.LAYOUTS.nida.rows);
const KEY_BY_ID_STD = buildKeyById(kb.LAYOUTS.standard.rows);

function spaceEntry(table){
  return { id: 'space', layer: 'shift', ch: ' ' };
}

function resolveCharLocation(ch, table){
  const src = table || KEY_BY_ID_STD;
  if(!src) return null;
  if(ch === ' ' || ch === '\u200B') return spaceEntry(src);
  if(ch === '្' && (src === KEY_BY_ID_STD || table === KEY_BY_ID_STD)){
    return { id: 'space', layer: 'base', ch: '្' };
  }
  for(const id in src){
    const k = src[id];
    if(k.base === ch) return {id, layer: 'base', ch};
    if(k.shift === ch) return {id, layer: 'shift', ch};
    if(k.ctrl === ch) return {id, layer: 'ctrl', ch};
    if(k.altgr === ch) return {id, layer: 'altgr', ch};
  }
  return null;
}

test('1.1 Unicode Normalization: canonical NFC and decomposed vowel repair', () => {
  assert.equal(normalizeInput(null), '');
  assert.equal(normalizeInput(undefined), '');
  // Decomposed ោ (\u17c1\u17b6) -> \u17c4
  assert.equal(normalizeInput('\u17C1\u17B6'), '\u17C4');
  // Decomposed ើ (\u17c1\u17b8) -> \u17be
  assert.equal(normalizeInput('\u17C1\u17B8'), '\u17BE');
  // Word level decomposed repair
  assert.equal(normalizeInput('ក\u17C1\u17B6'), 'កោ');
  assert.equal(normalizeInput('ក\u17C1\u17B8'), 'កើ');
  // Canonical NFC preserved
  assert.equal(normalizeInput('ខ្មែរ'), 'ខ្មែរ');
});

test('1.2 Space & Zero-Width Space Compatibility', () => {
  // Regular space vs ZWSP matches
  assert.equal(compareTypingSequence(' ', '\u200B'), true);
  assert.equal(compareTypingSequence('\u200B', ' '), true);
  assert.equal(compareTypingSequence(' ', ' '), true);
  assert.equal(compareTypingSequence('\u200B', '\u200B'), true);
  // Non-breaking space
  assert.equal(compareTypingSequence('\u00A0', ' '), true);
  assert.equal(compareTypingSequence(' ', '\u00A0'), true);
  // Coeng is strictly NOT a space
  assert.equal(compareTypingSequence('្', ' '), false);
  assert.equal(compareTypingSequence(' ', '្'), false);
  // Null or empty handling
  assert.equal(compareTypingSequence('', ' '), false);
  assert.equal(compareTypingSequence(' ', ''), false);
});

test('1.3 Multi-Codepoint NiDA 2-character compound vowels in splitIntoTypingUnits', () => {
  const sample = 'ខ្ញុំ កោះ ស្រេះ ឆ្នាំ ឃុំ ធុះ';
  const units = splitIntoTypingUnits(sample, 'nida');

  // Verify atomic compound units are preserved intact
  assert.ok(units.includes('\u17BB\u17C6'), 'Includes ុំ as single unit');
  assert.ok(units.includes('\u17C4\u17C7'), 'Includes ោះ as single unit');
  assert.ok(units.includes('\u17C1\u17C7'), 'Includes េះ as single unit');
  assert.ok(units.includes('\u17B6\u17C6'), 'Includes ាំ as single unit');
  assert.ok(units.includes('\u17BB\u17C7'), 'Includes ុះ as single unit');
});

test('1.4 NiDA Layout Mapping: 2-codepoint compound keys resolve accurately', () => {
  // Shift + A -> ាំ
  const aShift = resolveCharLocation('\u17B6\u17C6', KEY_BY_ID_NIDA);
  assert.deepEqual(aShift, { id: 'a', layer: 'shift', ch: 'ាំ' });

  // Shift + Semicolon -> ោះ
  const semiShift = resolveCharLocation('\u17C4\u17C7', KEY_BY_ID_NIDA);
  assert.deepEqual(semiShift, { id: 'semicolon', layer: 'shift', ch: 'ោះ' });

  // Shift + V -> េះ
  const vShift = resolveCharLocation('\u17C1\u17C7', KEY_BY_ID_NIDA);
  assert.deepEqual(vShift, { id: 'v', layer: 'shift', ch: 'េះ' });

  // Comma base -> ុំ
  const commaBase = resolveCharLocation('\u17BB\u17C6', KEY_BY_ID_NIDA);
  assert.deepEqual(commaBase, { id: 'comma', layer: 'base', ch: 'ុំ' });

  // Comma shift -> ុះ
  const commaShift = resolveCharLocation('\u17BB\u17C7', KEY_BY_ID_NIDA);
  assert.deepEqual(commaShift, { id: 'comma', layer: 'shift', ch: 'ុះ' });
});

test('1.5 Standard Layout Mapping: compound keys and Coeng space resolve accurately', () => {
  // Standard space unshifted -> ្
  const stdCoeng = resolveCharLocation('្', KEY_BY_ID_STD);
  assert.deepEqual(stdCoeng, { id: 'space', layer: 'base', ch: '្' });

  // Standard Shift+S -> ាំ
  const sShift = resolveCharLocation('\u17B6\u17C6', KEY_BY_ID_STD);
  assert.deepEqual(sShift, { id: 's', layer: 'shift', ch: 'ាំ' });

  // Standard Shift+[ -> ោះ
  const brShift = resolveCharLocation('\u17C4\u17C7', KEY_BY_ID_STD);
  assert.deepEqual(brShift, { id: 'bracketL', layer: 'shift', ch: 'ោះ' });
});

test('1.6 Compound Vowel Deconstruction mapping table integrity', () => {
  assert.ok(window.KHMER_COMPOUND_MAP, 'KHMER_COMPOUND_MAP exists');
  assert.deepEqual(window.KHMER_COMPOUND_MAP['\u17B6\u17C6'], ['\u17B6', '\u17C6']); // ាំ
  assert.deepEqual(window.KHMER_COMPOUND_MAP['\u17C4\u17C7'], ['\u17C4', '\u17C7']); // ោះ
  assert.deepEqual(window.KHMER_COMPOUND_MAP['\u17C1\u17C7'], ['\u17C1', '\u17C7']); // េះ
  assert.deepEqual(window.KHMER_COMPOUND_MAP['\u17BB\u17C6'], ['\u17BB', '\u17C6']); // ុំ
  assert.deepEqual(window.KHMER_COMPOUND_MAP['\u17BB\u17C7'], ['\u17BB', '\u17C7']); // ុះ
});

