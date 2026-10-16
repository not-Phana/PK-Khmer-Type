/* ============================================================
   PK Khmer Type — Keyboard Layouts, Rendering & Kinematic Hands
   ============================================================ */

/* ---------- layout data ---------- */
const KEY = (id, base, ctrl, altgr, shift) => ({id, base, ctrl, altgr, shift, kind:'glyph'});

const ROW1 = [
  KEY('grave','','฿','◎',''),
  KEY('k1','១','₭','1','!'),
  KEY('k2','២','€','2','ៗ'),
  KEY('k3','៣','đ','3','"'),
  KEY('k4','៤','₣','4','៛'),
  KEY('k5','៥','¥','5','%'),
  KEY('k6','៦','','6','៍'),
  KEY('k7','៧','£','7','័'),
  KEY('k8','៨','','8','៏'),
  KEY('k9','៩','','9','៎'),
  KEY('k0','០','—','0','៌'),
  KEY('minus','-','•','{','_'),
  KEY('equal','=','','}','+'),
  {id:'backspace', kind:'mod', label:'Backsp.', wide:2},
];

const ROW2 = [
  {id:'tab', kind:'mod', label:'Tab', wide:1.5},
  KEY('q','ឆ','','*','ឈ'),
  KEY('w','ឹ','','','ឺ'),
  KEY('e','េ','','ឯ','ែ'),
  KEY('r','រ','','ឫ','ឬ'),
  KEY('t','ត','','ឦ','ទ'),
  KEY('y','យ','','','ួ'),
  KEY('u','ុ','','ឧ','ូ'),
  KEY('i','ិ','','ឥ','ី'),
  KEY('o','ោ','','ឱ','ៅ'),
  KEY('p','ផ','','ឳ','ភ'),
  KEY('bracketL','ើ','','[','ោះ'),
  KEY('bracketR','ឿ','',']','ៀ'),
  {...KEY('backslash','\\','/','៚','/'), wide:1.5},
];

const ROW3 = [
  {id:'caps', kind:'mod', label:'Caps', wide:1.75},
  KEY('a','ា','','ឩ','ៃ'),
  KEY('s','ស','','ឪ','ាំ'),
  KEY('d','ដ','','','ឌ'),
  KEY('f','ថ','','','ធ'),
  KEY('g','ង','','','ុះ'),
  KEY('h','ហ','','','៏'),
  KEY('j','ញ','','ឮ','ុំ'),
  KEY('k','ក','','ឭ','គ'),
  KEY('l','ល','','ឰ','ឡ'),
  KEY('semicolon','ះ',':',';','៖'),
  KEY('quote','់','«','៝','៉'),
  {id:'enter', kind:'mod', label:'Enter', wide:2.25},
];

const ROW4 = [
  {id:'shiftL', kind:'mod', label:'Shift', cls:'key-shift', wide:1.25},
  KEY('extra','','','',''),
  KEY('z','ឋ','','#','ឍ'),
  KEY('x','ខ','','@','ឃ'),
  KEY('c','ច','','&','ជ'),
  KEY('v','វ','','$','េះ'),
  KEY('b','ប','','%','ព'),
  KEY('n','ន','','(','ណ'),
  KEY('m','ម','’',')','ំ'),
  KEY('comma','អ','<','‹',','),
  KEY('period','។','>','›','.'),
  KEY('slash','','”','៕','?'),
  {id:'shiftR', kind:'mod', label:'Shift', cls:'key-shift', wide:2.75},
];

const ROW5 = [
  {id:'ctrlL', kind:'mod', label:'Ctrl', cls:'key-ctrl', wide:1.25},
  {id:'win', kind:'mod', label:'Win', cls:'key-win', wide:1.25},
  {id:'alt', kind:'mod', label:'Alt', wide:1.25},
  {id:'space', kind:'mod', label:'', cls:'space', wide:8.25},
  {id:'altgr', kind:'mod', label:'AltGr', cls:'key-altgr', wide:1.5},
  {id:'ctrlR', kind:'mod', label:'Ctrl', cls:'key-ctrl', wide:1.5},
];

/* ---------- Khmer NiDA layout data (official Windows Khmer NiDA mapping) ---------- */
const ROW1_NIDA = [
  KEY('grave','«','','‍','»'),
  KEY('k1','១','','‌','!'),
  KEY('k2','២','','@','ៗ'),
  KEY('k3','៣','','៑','"'),
  KEY('k4','៤','','$','៛'),
  KEY('k5','៥','','€','%'),
  KEY('k6','៦','','៙','៍'),
  KEY('k7','៧','','៚','័'),
  KEY('k8','៨','','*','៏'),
  KEY('k9','៩','','{','('),
  KEY('k0','០','','}',')'),
  KEY('minus','ឥ','','×','៌'),
  KEY('equal','ឲ','','៎','='),
  {id:'backspace', kind:'mod', label:'Backsp.', wide:2},
];

const ROW2_NIDA = [
  {id:'tab', kind:'mod', label:'Tab', wide:1.5},
  KEY('q','ឆ','','','ឈ'),
  KEY('w','ឹ','','','ឺ'),
  KEY('e','េ','','ឯ','ែ'),
  KEY('r','រ','','ឫ','ឬ'),
  KEY('t','ត','','','ទ'),
  KEY('y','យ','','','ួ'),
  KEY('u','ុ','','','ូ'),
  KEY('i','ិ','','ឦ','ី'),
  KEY('o','ោ','','ឱ','ៅ'),
  KEY('p','ផ','','ឰ','ភ'),
  KEY('bracketL','ៀ','','ឩ','ឿ'),
  KEY('bracketR','ឪ','','ឳ','ឧ'),
  {...KEY('backslash','ឮ','','\\','ឭ'), wide:1.5},
];

const ROW3_NIDA = [
  {id:'caps', kind:'mod', label:'Caps', wide:1.75},
  KEY('a','ា','','','ាំ'),
  KEY('s','ស','','','ៃ'),
  KEY('d','ដ','','','ឌ'),
  KEY('f','ថ','','','ធ'),
  KEY('g','ង','','','អ'),
  KEY('h','ហ','','','ះ'),
  KEY('j','្','','','ញ'),
  KEY('k','ក','','','គ'),
  KEY('l','ល','','','ឡ'),
  KEY('semicolon','ើ','','៖','ោះ'),
  KEY('quote','់','','ៈ','៉'),
  {id:'enter', kind:'mod', label:'Enter', wide:2.25},
];

const ROW4_NIDA = [
  {id:'shiftL', kind:'mod', label:'Shift', cls:'key-shift', wide:2.25},
  KEY('z','ឋ','','','ឍ'),
  KEY('x','ខ','','','ឃ'),
  KEY('c','ច','','','ជ'),
  KEY('v','វ','','','េះ'),
  KEY('b','ប','','','ព'),
  KEY('n','ន','','','ណ'),
  KEY('m','ម','','','ំ'),
  KEY('comma','ុំ','',',','ុះ'),
  KEY('period','។','','.','៕'),
  KEY('slash','៊','','/','?'),
  {id:'shiftR', kind:'mod', label:'Shift', cls:'key-shift', wide:2.75},
];

const ROW5_NIDA = [
  {id:'ctrlL', kind:'mod', label:'Ctrl', cls:'key-ctrl', wide:1.25},
  {id:'win', kind:'mod', label:'Win', cls:'key-win', wide:1.25},
  {id:'alt', kind:'mod', label:'Alt', wide:1.25},
  {id:'space', kind:'mod', label:'', cls:'space', wide:8.25},
  {id:'altgr', kind:'mod', label:'AltGr', cls:'key-altgr', wide:1.5},
  {id:'ctrlR', kind:'mod', label:'Ctrl', cls:'key-ctrl', wide:1.5},
];

/* ---------- English (US QWERTY) layout data ---------- */
const ROW1_EN = [
  KEY('grave','`','','','~'),
  KEY('k1','1','','','!'),
  KEY('k2','2','','','@'),
  KEY('k3','3','','','#'),
  KEY('k4','4','','','$'),
  KEY('k5','5','','','%'),
  KEY('k6','6','','','^'),
  KEY('k7','7','','','&'),
  KEY('k8','8','','','*'),
  KEY('k9','9','','','('),
  KEY('k0','0','','',')'),
  KEY('minus','-','','','_'),
  KEY('equal','=','','','+'),
  {id:'backspace', kind:'mod', label:'Backsp.', wide:2},
];

const ROW2_EN = [
  {id:'tab', kind:'mod', label:'Tab', wide:1.5},
  KEY('q','q','','','Q'),
  KEY('w','w','','','W'),
  KEY('e','e','','','E'),
  KEY('r','r','','','R'),
  KEY('t','t','','','T'),
  KEY('y','y','','','Y'),
  KEY('u','u','','','U'),
  KEY('i','i','','','I'),
  KEY('o','o','','','O'),
  KEY('p','p','','','P'),
  KEY('bracketL','[','','','{'),
  KEY('bracketR',']','','','}'),
  {...KEY('backslash','\\','','','|'), wide:1.5},
];

const ROW3_EN = [
  {id:'caps', kind:'mod', label:'Caps', wide:1.75},
  KEY('a','a','','','A'),
  KEY('s','s','','','S'),
  KEY('d','d','','','D'),
  KEY('f','f','','','F'),
  KEY('g','g','','','G'),
  KEY('h','h','','','H'),
  KEY('j','j','','','J'),
  KEY('k','k','','','K'),
  KEY('l','l','','','L'),
  KEY('semicolon',';','','',':'),
  KEY('quote','\'','','','"'),
  {id:'enter', kind:'mod', label:'Enter', wide:2.25},
];

const ROW4_EN = [
  {id:'shiftL', kind:'mod', label:'Shift', cls:'key-shift', wide:2.25},
  KEY('z','z','','','Z'),
  KEY('x','x','','','X'),
  KEY('c','c','','','C'),
  KEY('v','v','','','V'),
  KEY('b','b','','','B'),
  KEY('n','n','','','N'),
  KEY('m','m','','','M'),
  KEY('comma',',','','','<'),
  KEY('period','.','','','>'),
  KEY('slash','/','','','?'),
  {id:'shiftR', kind:'mod', label:'Shift', cls:'key-shift', wide:2.75},
];

const ROW5_EN = [
  {id:'ctrlL', kind:'mod', label:'Ctrl', cls:'key-ctrl', wide:1.25},
  {id:'win', kind:'mod', label:'Win', cls:'key-win', wide:1.25},
  {id:'alt', kind:'mod', label:'Alt', wide:1.25},
  {id:'space', kind:'mod', label:'', cls:'space', wide:8.25},
  {id:'altgr', kind:'mod', label:'AltGr', cls:'key-altgr', wide:1.5},
  {id:'ctrlR', kind:'mod', label:'Ctrl', cls:'key-ctrl', wide:1.5},
];

/* ---------- layout registry ---------- */
const LAYOUTS = {
  standard: {
    label: 'Khmer Keyboard Layout',
    rows: [ROW1, ROW2, ROW3, ROW4, ROW5],
    spaceMap: {base:'្', shift:' ', ctrl:'្', altgr:'្'},
    hasLessons: true,
    layerLabels: {base:'Base — Khmer', shift:'Shift — Voiced consonants', ctrl:'Ctrl — Currency & punctuation', altgr:'AltGr — Numerals & clusters'},
    layerLabelsKm: {base:'Base — ខ្មែរ', shift:'Shift — ព្យញ្ជនៈឃោសៈ', ctrl:'Ctrl — រូបិយប័ណ្ណ និងសញ្ញា', altgr:'AltGr — លេខ និងបណ្ដុំអក្សរ'},
  },
  nida: {
    label: 'Khmer NiDA Keyboard',
    rows: [ROW1_NIDA, ROW2_NIDA, ROW3_NIDA, ROW4_NIDA, ROW5_NIDA],
    spaceMap: {base:'\u200B', shift:' ', ctrl:' ', altgr:'\u00A0'},
    hasLessons: true,
    layerLabels: {base:'Base — Khmer', shift:'Shift — Marks & punctuation', ctrl:'Ctrl — (unused)', altgr:'AltGr — Symbols & vowels'},
    layerLabelsKm: {base:'Base — ខ្មែរ', shift:'Shift — សញ្ញា និងវណ្ណយុត្តិ', ctrl:'Ctrl — (មិនប្រើ)', altgr:'AltGr — និមិត្តសញ្ញា និងស្រៈ'},
  },
  english: {
    label: 'English (US)',
    rows: [ROW1_EN, ROW2_EN, ROW3_EN, ROW4_EN, ROW5_EN],
    spaceMap: {base:' ', shift:' ', ctrl:' ', altgr:' '},
    hasLessons: true,
    layerLabels: {base:'Base — lowercase', shift:'Shift — UPPERCASE & symbols', ctrl:'Ctrl — (unused)', altgr:'AltGr — (unused)'},
    layerLabelsKm: {base:'Base — អក្សរតូច', shift:'Shift — អក្សរធំ និងនិមិត្តសញ្ញា', ctrl:'Ctrl — (មិនប្រើ)', altgr:'AltGr — (មិនប្រើ)'},
  },
};
const LAYOUT_STORAGE_KEY = 'pk_active_layout';

let initialLayout = 'standard';
try {
  const sessionRaw = (typeof localStorage !== 'undefined') ? localStorage.getItem('pk_active_lesson_session') : null;
  if (sessionRaw) {
    const sObj = JSON.parse(sessionRaw);
    if (sObj && sObj.layoutId && LAYOUTS[sObj.layoutId]) {
      initialLayout = sObj.layoutId;
    }
  }
  if (initialLayout === 'standard' && typeof localStorage !== 'undefined') {
    const savedL = localStorage.getItem(LAYOUT_STORAGE_KEY) || localStorage.getItem('khmerActiveLayout');
    if (savedL && LAYOUTS[savedL]) initialLayout = savedL;
  }
} catch(e){}

let currentLayoutId = initialLayout;
if(typeof window !== 'undefined') window.currentLayoutId = currentLayoutId;
let ALL_ROWS = LAYOUTS[currentLayoutId].rows;

/* physical-keyboard code -> our key id */
const CODE_MAP = {
  Backquote:'grave', Digit1:'k1', Digit2:'k2', Digit3:'k3', Digit4:'k4', Digit5:'k5',
  Digit6:'k6', Digit7:'k7', Digit8:'k8', Digit9:'k9', Digit0:'k0',
  Minus:'minus', Equal:'equal', Backspace:'backspace',
  Tab:'tab', KeyQ:'q', KeyW:'w', KeyE:'e', KeyR:'r', KeyT:'t', KeyY:'y', KeyU:'u',
  KeyI:'i', KeyO:'o', KeyP:'p', BracketLeft:'bracketL', BracketRight:'bracketR', Enter:'enter',
  CapsLock:'caps', KeyA:'a', KeyS:'s', KeyD:'d', KeyF:'f', KeyG:'g', KeyH:'h', KeyJ:'j',
  KeyK:'k', KeyL:'l', Semicolon:'semicolon', Quote:'quote', Backslash:'backslash',
  ShiftLeft:'shiftL', ShiftRight:'shiftR', KeyZ:'z', KeyX:'x', KeyC:'c', KeyV:'v', KeyB:'b',
  KeyN:'n', KeyM:'m', Comma:'comma', Period:'period', Slash:'slash',
  ControlLeft:'ctrlL', ControlRight:'ctrlR', AltLeft:'alt', AltRight:'altgr', Space:'space',
  Escape:'escape', IntlBackslash:'extra', MetaLeft:'win', MetaRight:'win', OSLeft:'win', OSRight:'win', Delete:'delete',
  F1:'f1', F2:'f2', F3:'f3', F4:'f4', F5:'f5', F6:'f6', F7:'f7', F8:'f8', F9:'f9', F10:'f10', F11:'f11', F12:'f12'
};


const board = typeof document !== 'undefined' ? document.getElementById("keyboard") : null;
const boardWrap = typeof document !== 'undefined' ? document.getElementById("boardWrap") : null;
const layoutStrip = typeof document !== 'undefined' ? document.getElementById("layoutStrip") : null;

const TOOLTIP_TEXT = {
  ctrl: { title:"VK_CONTROL", body:"Ctrl key with Ctrl enabled.\nHold for shortcuts." },
  altgr:{ title:"VK_RMENU", body:"AltGr key with AltGr enabled.\nHold to type AltGr characters." },
  shift:{ title:"VK_SHIFT", body:"Shift key with Shift enabled.\nHold to type Shift characters." },
};

let hoverLayer = null;
let lockedLayer = null;
let physicalLayer = null;
let capsOn = false;
let keyEls = {};
let glyphData = {};

const KEY_FINGER = {
  grave:'lp', k1:'lp', k2:'lr', k3:'lm', k4:'li', k5:'li',
  k6:'ri', k7:'ri', k8:'rm', k9:'rr', k0:'rp', minus:'rp', equal:'rp', backspace:'rp',
  tab:'lp', q:'lp', w:'lr', e:'lm', r:'li', t:'li', y:'ri', u:'ri', i:'rm', o:'rr',
  p:'rp', bracketL:'rp', bracketR:'rp', enter:'rp',
  caps:'lp', a:'lp', s:'lr', d:'lm', f:'li', g:'li', h:'ri', j:'ri', k:'rm', l:'rr',
  semicolon:'rp', quote:'rp', backslash:'rp',
  shiftL:'lp', extra:'lp', z:'lp', x:'lr', c:'lm', v:'li', b:'li', n:'ri', m:'ri',
  comma:'rm', period:'rr', slash:'rp', shiftR:'rp',
  ctrlL:'lp', win:'lp', alt:'lt', space:'rt', altgr:'rt', ctrlR:'rp',
  escape:'lp', metaL:'lp', delete:'rp',
  f1:'lp', f2:'lr', f3:'lm', f4:'li', f5:'li',
  f6:'ri', f7:'ri', f8:'rm', f9:'rr', f10:'rp', f11:'rp', f12:'rp'
};
if(typeof window !== 'undefined') window.KEY_FINGER = KEY_FINGER;

const CANONICAL_FINGER_MAP = Object.freeze({
  // Left Pinky (L5)
  Backquote: 'L5', Digit1: 'L5', Escape: 'L5', F1: 'L5',
  Tab: 'L5', KeyQ: 'L5', CapsLock: 'L5', KeyA: 'L5',
  ShiftLeft: 'L5', IntlBackslash: 'L5', KeyZ: 'L5',
  ControlLeft: 'L5', MetaLeft: 'L5', MetaRight: 'L5', OSLeft: 'L5', OSRight: 'L5',

  // Left Ring (L4)
  Digit2: 'L4', F2: 'L4', KeyW: 'L4', KeyS: 'L4', KeyX: 'L4',

  // Left Middle (L3)
  Digit3: 'L3', F3: 'L3', KeyE: 'L3', KeyD: 'L3', KeyC: 'L3',

  // Left Index (L2)
  Digit4: 'L2', Digit5: 'L2', F4: 'L2', F5: 'L2',
  KeyR: 'L2', KeyT: 'L2', KeyF: 'L2', KeyG: 'L2',
  KeyV: 'L2', KeyB: 'L2',

  // Left Thumb (L1)
  AltLeft: 'L1',

  // Right Thumb (R1)
  AltRight: 'R1',
  Space: 'R1', // Default active thumb is R1 (configurable)

  // Right Index (R2)
  Digit6: 'R2', // Default R2 (configurable)
  Digit7: 'R2', F6: 'R2', F7: 'R2',
  KeyY: 'R2', KeyU: 'R2', KeyH: 'R2', KeyJ: 'R2',
  KeyN: 'R2', KeyM: 'R2',

  // Right Middle (R3)
  Digit8: 'R3', F8: 'R3', KeyI: 'R3', KeyK: 'R3', Comma: 'R3',

  // Right Ring (R4)
  Digit9: 'R4', F9: 'R4', KeyO: 'R4', KeyL: 'R4', Period: 'R4',

  // Right Pinky (R5)
  Digit0: 'R5', Minus: 'R5', Equal: 'R5', Backspace: 'R5',
  F10: 'R5', F11: 'R5', F12: 'R5',
  KeyP: 'R5', BracketLeft: 'R5', BracketRight: 'R5', Backslash: 'R5',
  Semicolon: 'R5', Quote: 'R5', Enter: 'R5',
  Slash: 'R5', ShiftRight: 'R5', ControlRight: 'R5',
  Delete: 'R5', ArrowUp: 'R5', ArrowDown: 'R5', ArrowLeft: 'R5', ArrowRight: 'R5'
});
if(typeof window !== 'undefined') window.CANONICAL_FINGER_MAP = CANONICAL_FINGER_MAP;

const FINGER_CODE_TO_CANONICAL = Object.freeze({
  lp: 'L5', lr: 'L4', lm: 'L3', li: 'L2', lt: 'L1',
  rt: 'R1', ri: 'R2', rm: 'R3', rr: 'R4', rp: 'R5'
});
if(typeof window !== 'undefined') window.FINGER_CODE_TO_CANONICAL = FINGER_CODE_TO_CANONICAL;

const CANONICAL_TO_FINGER_CODE = Object.freeze({
  L5: 'lp', L4: 'lr', L3: 'lm', L2: 'li', L1: 'lt',
  R1: 'rt', R2: 'ri', R3: 'rm', R4: 'rr', R5: 'rp'
});
if(typeof window !== 'undefined') window.CANONICAL_TO_FINGER_CODE = CANONICAL_TO_FINGER_CODE;

function toCanonicalFinger(id){
  if(!id) return null;
  if(CANONICAL_TO_FINGER_CODE[id]) return id;
  return FINGER_CODE_TO_CANONICAL[id] || null;
}
if(typeof window !== 'undefined') window.toCanonicalFinger = toCanonicalFinger;

function toLegacyFinger(id){
  if(!id) return null;
  if(FINGER_CODE_TO_CANONICAL[id]) return id;
  return CANONICAL_TO_FINGER_CODE[id] || null;
}
if(typeof window !== 'undefined') window.toLegacyFinger = toLegacyFinger;

const HAND_CONFIG = {
  sixKeyFinger: 'R2',      // 'R2' (default) | 'L2'
  keyBFinger: 'L2',        // 'L2' (default)
  spaceThumbMode: 'right', // 'right' (default) | 'left' | 'alternate'
  overlayMode: 'full',     // 'full' (default) | 'ghost' | 'hidden'
  handOpacity: 0.85,
  reducedMotion: false,
  lastKeystrokeHand: null
};
if(typeof window !== 'undefined') window.HAND_CONFIG = HAND_CONFIG;

const HAND_STATES = Object.freeze({
  ENTERING: 'entering',
  HOME_REST: 'home_rest',
  ANTICIPATION: 'anticipation',
  REACHING: 'reaching',
  PRESSING: 'pressing',
  HOLDING: 'holding',
  RELEASING: 'releasing',
  RETURNING: 'returning',
  PALM_GLIDE: 'palm_glide',
  CHORD_COORDINATION: 'chord_coordination'
});
if(typeof window !== 'undefined') window.HAND_STATES = HAND_STATES;

function getFingerForKey(codeOrId, options){
  const cfg = Object.assign({}, HAND_CONFIG, options || {});
  if(!codeOrId) return 'R1';

  let keyId = codeOrId;
  let code = null;

  if(CODE_MAP[codeOrId]){
    code = codeOrId;
    keyId = CODE_MAP[codeOrId];
  } else {
    for(const [c, id] of Object.entries(CODE_MAP)){
      if(id === keyId){ code = c; break; }
    }
  }

  // Pedagogical option: Digit6 ownership
  if(code === 'Digit6' || keyId === 'k6'){
    return cfg.sixKeyFinger || 'R2';
  }

  // Pedagogical option: KeyB ownership
  if(code === 'KeyB' || keyId === 'b'){
    return cfg.keyBFinger || 'L2';
  }

  // Pedagogical option: Spacebar active thumb
  if(code === 'Space' || keyId === 'space'){
    if(cfg.spaceThumbMode === 'left') return 'L1';
    if(cfg.spaceThumbMode === 'alternate'){
      return (cfg.lastKeystrokeHand === 'R') ? 'L1' : 'R1';
    }
    return 'R1';
  }

  // Canonical physical lookup
  if(code && CANONICAL_FINGER_MAP[code]){
    return CANONICAL_FINGER_MAP[code];
  }

  // Fallback to KEY_FINGER table
  const legacy = KEY_FINGER[keyId];
  if(legacy && FINGER_CODE_TO_CANONICAL[legacy]){
    return FINGER_CODE_TO_CANONICAL[legacy];
  }

  return 'R1';
}
if(typeof window !== 'undefined') window.getFingerForKey = getFingerForKey;

function resolveModifierChoreography(keyId, layer, options){
  if(!keyId || !layer || layer === 'base') return null;
  const cfg = Object.assign({}, HAND_CONFIG, options || {});
  const targetFinger = getFingerForKey(keyId, cfg);
  const targetLegacyFinger = toLegacyFinger(targetFinger);
  const isLeftHand = targetFinger.startsWith('L') || ['lp', 'lr', 'lm', 'li', 'lt'].includes(targetFinger);

  if(layer === 'shift'){
    if(keyId === 'shiftL' || keyId === 'shiftR') return null;
    if(keyId === 'space'){
      return {
        modifierKey: 'shiftL',
        modifierCode: 'ShiftLeft',
        modifierFinger: 'L5',
        modifierLegacyFinger: 'lp',
        fingerId: 'lp',
        targetKey: 'space',
        targetFinger: getFingerForKey('space', cfg),
        targetLegacyFinger: toLegacyFinger(getFingerForKey('space', cfg))
      };
    }
    // Opposite-Hand Rule:
    // Target on Left Hand -> ShiftRight (R5 / rp)
    // Target on Right Hand -> ShiftLeft (L5 / lp)
    const modifierKey = isLeftHand ? 'shiftR' : 'shiftL';
    const modifierCode = isLeftHand ? 'ShiftRight' : 'ShiftLeft';
    const modifierFinger = isLeftHand ? 'R5' : 'L5';
    const modifierLegacyFinger = isLeftHand ? 'rp' : 'lp';

    return {
      modifierKey,
      modifierCode,
      modifierFinger,
      modifierLegacyFinger,
      fingerId: modifierLegacyFinger,
      targetKey: keyId,
      targetFinger,
      targetLegacyFinger
    };
  }

  if(layer === 'altgr'){
    if(keyId === 'altgr') return null;
    return {
      modifierKey: 'altgr',
      modifierCode: 'AltRight',
      modifierFinger: 'R1',
      modifierLegacyFinger: 'rt',
      fingerId: 'rt',
      targetKey: keyId,
      targetFinger,
      targetLegacyFinger
    };
  }

  if(layer === 'ctrl'){
    if(keyId === 'ctrlL' || keyId === 'ctrlR') return null;
    const modifierKey = isLeftHand ? 'ctrlR' : 'ctrlL';
    const modifierCode = isLeftHand ? 'ControlRight' : 'ControlLeft';
    const modifierFinger = isLeftHand ? 'R5' : 'L5';
    const modifierLegacyFinger = isLeftHand ? 'rp' : 'lp';

    return {
      modifierKey,
      modifierCode,
      modifierFinger,
      modifierLegacyFinger,
      fingerId: modifierLegacyFinger,
      targetKey: keyId,
      targetFinger,
      targetLegacyFinger
    };
  }

  return null;
}
if(typeof window !== 'undefined') window.resolveModifierChoreography = resolveModifierChoreography;

function decomposeKhmerSequence(targetText, layoutId){
  const lid = layoutId || (typeof currentLayoutId !== 'undefined' ? currentLayoutId : 'nida');
  const table = (lid === 'nida') ? LAYOUTS.nida
              : (lid === 'english') ? LAYOUTS.english
              : LAYOUTS.standard;
  if(!targetText) return [];

  function findGlyph(ch){
    if(ch === ' ' || ch === '\u200B'){
      if(lid === 'english') return { id: 'space', layer: 'base', code: 'Space' };
      if(lid === 'nida'){
        return (ch === '\u200B')
          ? { id: 'space', layer: 'base', code: 'Space' }
          : { id: 'space', layer: 'shift', code: 'Space' };
      }
      return { id: 'space', layer: 'shift', code: 'Space' };
    }
    if(ch === '្' && lid === 'standard'){
      return { id: 'space', layer: 'base', code: 'Space' };
    }
    if(table && table.rows){
      for(const row of table.rows){
        for(const k of row){
          if(k.base === ch) return { id: k.id, layer: 'base', code: Object.keys(CODE_MAP).find(c=> CODE_MAP[c] === k.id) };
          if(k.shift === ch) return { id: k.id, layer: 'shift', code: Object.keys(CODE_MAP).find(c=> CODE_MAP[c] === k.id) };
          if(k.altgr === ch) return { id: k.id, layer: 'altgr', code: Object.keys(CODE_MAP).find(c=> CODE_MAP[c] === k.id) };
          if(k.ctrl === ch) return { id: k.id, layer: 'ctrl', code: Object.keys(CODE_MAP).find(c=> CODE_MAP[c] === k.id) };
        }
      }
    }
    return null;
  }

  const steps = [];
  const text = String(targetText);
  let i = 0;

  // Single-keystroke composite vowels on NiDA
  const NIDA_COMPOSITES = {
    '\u17B6\u17C6': { id: 'a', layer: 'shift', code: 'KeyA', desc: 'Composite Vowel ាំ (Shift+A)' },
    '\u17C4\u17C7': { id: 'semicolon', layer: 'shift', code: 'Semicolon', desc: 'Composite Vowel ោះ (Shift+;)' },
    '\u17C1\u17C7': { id: 'v', layer: 'shift', code: 'KeyV', desc: 'Composite Vowel េះ (Shift+V)' },
    '\u17BB\u17C6': { id: 'comma', layer: 'base', code: 'Comma', desc: 'Composite Vowel ុំ (Comma)' },
    '\u17BB\u17C7': { id: 'comma', layer: 'shift', code: 'Comma', desc: 'Composite Vowel ុះ (Shift+Comma)' },
  };

  while(i < text.length){
    if(lid === 'nida' && i + 1 < text.length){
      const two = text.slice(i, i + 2);
      if(NIDA_COMPOSITES[two]){
        const comp = NIDA_COMPOSITES[two];
        const finger = getFingerForKey(comp.id);
        const mod = resolveModifierChoreography(comp.id, comp.layer);
        steps.push({
          stepIndex: steps.length,
          char: two,
          keyId: comp.id,
          code: comp.code,
          layer: comp.layer,
          finger,
          legacyFinger: toLegacyFinger(finger),
          modifierInfo: mod,
          description: comp.desc
        });
        i += 2;
        continue;
      }
    }

    const ch = text[i];
    const loc = findGlyph(ch);
    if(loc){
      const finger = getFingerForKey(loc.id);
      const mod = resolveModifierChoreography(loc.id, loc.layer);
      steps.push({
        stepIndex: steps.length,
        char: ch,
        keyId: loc.id,
        code: loc.code || loc.id,
        layer: loc.layer,
        finger,
        legacyFinger: toLegacyFinger(finger),
        modifierInfo: mod,
        description: (ch === '្') ? 'Subscript Sign (Coeng) ្' : `Key ${loc.id}`
      });
    } else {
      steps.push({
        stepIndex: steps.length,
        char: ch,
        keyId: null,
        code: null,
        layer: 'base',
        finger: null,
        legacyFinger: null,
        modifierInfo: null,
        description: `Unmapped Character ${ch}`
      });
    }
    i++;
  }

  return steps;
}
if(typeof window !== 'undefined') window.decomposeKhmerSequence = decomposeKhmerSequence;

function buildBoard(){
  if(!board) return;
  board.innerHTML = '';
  keyEls = {};
  glyphData = {};
  if(typeof window !== 'undefined'){
    window.keyEls = keyEls;
    window.glyphData = glyphData;
  }
ALL_ROWS.forEach(rowDef=>{
  const rowEl = document.createElement('div');
  rowEl.className = 'row';
  rowDef.forEach(k=>{
    const el = document.createElement('div');
    el.className = 'key notranslate';
    el.setAttribute('translate', 'no');
    el.dataset.key = k.id;
    if(KEY_FINGER[k.id]){
      el.dataset.finger = KEY_FINGER[k.id];
      el.dataset.canonicalFinger = toCanonicalFinger(KEY_FINGER[k.id]);
    }
    if(k.id === 'altgr') el.dataset.code = 'AltRight';
    else if(k.id === 'space') el.dataset.code = 'Space';
    else if(k.id === 'alt') el.dataset.code = 'AltLeft';
    else if(k.id === 'ctrlL') el.dataset.code = 'ControlLeft';
    else if(k.id === 'ctrlR') el.dataset.code = 'ControlRight';
    else if(k.id === 'shiftL') el.dataset.code = 'ShiftLeft';
    else if(k.id === 'shiftR') el.dataset.code = 'ShiftRight';
    else if(k.id === 'enter') el.dataset.code = 'Enter';
    else if(k.id === 'backspace') el.dataset.code = 'Backspace';
    else if(k.id === 'tab') el.dataset.code = 'Tab';
    else if(k.id === 'caps') el.dataset.code = 'CapsLock';
    else if(k.id === 'extra') el.dataset.code = 'IntlBackslash';
    else if(k.id === 'win') el.dataset.code = 'MetaLeft';
    const u = k.wide || (k.id === 'space' ? 8.25 : 1);
    el.style.setProperty('--u', u);
    el.style.flexGrow = u;
    if(k.cls) el.classList.add(k.cls);
    keyEls[k.id] = el;

    if(k.kind === 'mod'){
      el.classList.add('label-key','mod');
      el.textContent = k.label;
      if(k.id === 'space'){
        el.classList.add('space');
        if(currentLayoutId === 'standard'){
          el.innerHTML = '<span class="space-glyph">្</span><span class="space-label">ជើង (Coeng)</span><span class="shift-badge">Space</span>';
        } else if(currentLayoutId === 'nida'){
          el.innerHTML = '<span class="space-glyph">␣</span><span class="space-label">ដកឃ្លា · Spacebar</span>';
        } else {
          el.innerHTML = '<span class="space-label">Space</span>';
        }
      } else if(k.id === 'win'){
        el.innerHTML = '<svg class="win-icon" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg><span>Win</span>';
      }
    } else {
      const g = document.createElement('span');
      g.className = 'glyph notranslate';
      g.setAttribute('translate', 'no');
      g.dataset.base = k.base;
      g.dataset.ctrl = k.ctrl;
      g.dataset.altgr = k.altgr;
      g.dataset.shift = k.shift || '';
      g.textContent = k.base;
      el.appendChild(g);
      glyphData[k.id] = {base:k.base, ctrl:k.ctrl, altgr:k.altgr, shift:k.shift || ''};
      if(!k.base) el.classList.add('empty');

      if(k.shift){
        const hint = document.createElement('span');
        hint.className = 'shift-badge notranslate';
        hint.setAttribute('translate', 'no');
        hint.textContent = k.shift;
        el.appendChild(hint);
      }
    }

    if(k.cls === 'key-ctrl' || k.cls === 'key-altgr' || k.cls === 'key-shift'){
      const layerName = k.cls === 'key-ctrl' ? 'ctrl' : (k.cls === 'key-altgr' ? 'altgr' : 'shift');
      const tipData = (TOOLTIP_TEXT && TOOLTIP_TEXT[layerName]) || { title: k.label || layerName, body: '' };
      const tip = document.createElement('div');
      tip.className = 'tooltip';
      tip.innerHTML = `<strong>${tipData.title || ''}</strong>${(tipData.body || '').replace(/\n/g,'<br>')}`;
      el.appendChild(tip);

      el.addEventListener('mouseenter', ()=>{
        tip.classList.add('show');
        if(!physicalLayer && !lockedLayer){
          hoverLayer = layerName;
          render();
        }
      });
      el.addEventListener('mouseleave', ()=>{
        tip.classList.remove('show');
        if(hoverLayer === layerName){
          hoverLayer = null;
          render();
        }
      });

      const activateModifier = (ev)=>{
        ev.preventDefault();
        physicalLayer = layerName;
        el.classList.add('pressed');
        setPhysicalModifierHeld(k.id, true);
        render();
        burst(el, ev);
        playClick('down');
      };
      const deactivateModifier = ()=>{
        if(physicalLayer === layerName){
          physicalLayer = null;
          el.classList.remove('pressed');
          setPhysicalModifierHeld(k.id, false);
          render();
          playClick('up');
        }
      };

      el.addEventListener('pointerdown', activateModifier);
      el.addEventListener('pointerup', deactivateModifier);
      el.addEventListener('pointerleave', deactivateModifier);
      el.addEventListener('pointercancel', deactivateModifier);
    } else {
      el.addEventListener('click', (ev)=>{
        typeKey(k.id, ev);
      });
    }

    rowEl.appendChild(el);
  });
  board.appendChild(rowEl);
});
}

function syncLayoutUI(id){
  const targetId = id || currentLayoutId;
  if(layoutStrip){
    layoutStrip.querySelectorAll('.layout-pill').forEach(p=>{
      const isActive = p.dataset.layout === targetId;
      p.classList.toggle('active', isActive);
      p.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }
  const chassisLabel = document.getElementById('chassisLayoutLabel');
  if(chassisLabel){
    const nameMap = { standard:'STANDARD', nida:'NiDA', english:'ENGLISH' };
    chassisLabel.textContent = nameMap[targetId] || (targetId ? targetId.toUpperCase() : 'STANDARD');
  }
  const isKm = document.documentElement.classList.contains('site-km-mode');
  const llEn = LAYOUTS[targetId] && LAYOUTS[targetId].layerLabels;
  const llKm = LAYOUTS[targetId] && LAYOUTS[targetId].layerLabelsKm;
  if(llEn){
    document.querySelectorAll('.layer-pill').forEach(p=>{
      const key = p.dataset.pill;
      if(llEn[key]) p.setAttribute('data-en', llEn[key]);
      if(llKm && llKm[key]) p.setAttribute('data-km', llKm[key]);
      const txt = (isKm && llKm && llKm[key]) ? llKm[key] : llEn[key];
      if(txt) p.textContent = txt;
    });
  }
  const lessonsAvailable = LAYOUTS[targetId] && LAYOUTS[targetId].hasLessons;
  const lsEl = typeof lessonStrip !== 'undefined' ? lessonStrip : document.getElementById('lessonStrip');
  if(lsEl) {
    lsEl.style.display = lessonsAvailable ? '' : 'none';
    if(lessonsAvailable) lsEl.hidden = false;
  }
  const ttEl = typeof trialToggle !== 'undefined' ? trialToggle : document.getElementById('trialToggle');
  if(ttEl) ttEl.style.display = lessonsAvailable ? '' : 'none';
  const rtEl = typeof raceToggle !== 'undefined' ? raceToggle : document.getElementById('raceToggle');
  if(rtEl) rtEl.style.display = lessonsAvailable ? '' : 'none';
  const lunEl = typeof lessonUnavailableNote !== 'undefined' ? lessonUnavailableNote : document.getElementById('lessonUnavailableNote');
  if(lunEl) lunEl.style.display = lessonsAvailable ? 'none' : '';
  if(typeof updateQuickGuide === 'function') updateQuickGuide();
  if(typeof window.syncSettingsLayoutChoiceUI === 'function'){
    window.syncSettingsLayoutChoiceUI(targetId);
  }
}
if(typeof window !== 'undefined'){
  window.syncLayoutUI = syncLayoutUI;
  window.switchLayout = switchLayout;
  window.setActiveLayout = function(id) { switchLayout(id, true); };
}

// Self-booting fallback so keyboard is guaranteed to render reliably
if(typeof document !== 'undefined'){
  if(document.readyState !== 'loading'){
    buildBoard();
    syncLayoutUI(currentLayoutId);
  } else {
    document.addEventListener('DOMContentLoaded', ()=>{
      if(board && board.children.length === 0) buildBoard();
      syncLayoutUI(currentLayoutId);
    });
  }
}


/* ---------- layout switching & sidebar guide sync ---------- */
function updateQuickGuide() {
  const leftHand = document.getElementById('guideLeftHand');
  const rightHand = document.getElementById('guideRightHand');
  const subscriptsSec = document.getElementById('guideSubscriptsSec');
  const typeSpaceKbd = document.getElementById('guideTypeSpaceKbd');
  const coengKeyWrap = document.getElementById('guideCoengKeyWrap');
  const cheatTitle = document.getElementById('guideCheatTitle');
  const layoutBadge = document.getElementById('guideLayoutBadge');
  const ruleRow1 = document.getElementById('guideRuleRow1');
  const ruleRow2 = document.getElementById('guideRuleRow2');
  const ruleRow3 = document.getElementById('guideRuleRow3');
  const ruleRow4 = document.getElementById('guideRuleRow4');
  const ruleLabel1 = document.getElementById('guideRuleLabel1');
  const ruleLabel2 = document.getElementById('guideRuleLabel2');
  const ruleLabel3 = document.getElementById('guideRuleLabel3');
  const ruleLabel4 = document.getElementById('guideRuleLabel4');
  const coengExample1 = document.getElementById('guideCoengExample1');
  const coengExample2 = document.getElementById('guideCoengExample2');
  const punctSample = document.getElementById('guidePunctSample');
  const isKm = document.documentElement.classList.contains('site-km-mode');

  if (!leftHand) return;

  if (currentLayoutId === 'english') {
    if(layoutBadge){
      layoutBadge.textContent = isKm ? 'អង់គ្លេស' : 'English';
      layoutBadge.className = 'gdh-badge badge-eng';
    }
    leftHand.innerHTML = `
      <div class="guide-mini-key gmk-pinky" title="Left Pinky (A)"><span class="km-ch" style="opacity:0">A</span><span class="en-ch">A</span></div>
      <div class="guide-mini-key gmk-ring" title="Left Ring (S)"><span class="km-ch" style="opacity:0">S</span><span class="en-ch">S</span></div>
      <div class="guide-mini-key gmk-middle" title="Left Middle (D)"><span class="km-ch" style="opacity:0">D</span><span class="en-ch">D</span></div>
      <div class="guide-mini-key gmk-index" title="Left Index Anchor (F)"><span class="km-ch" style="opacity:0">F</span><span class="en-ch">F</span></div>
    `;
    rightHand.innerHTML = `
      <div class="guide-mini-key gmk-index" title="Right Index Anchor (J)"><span class="km-ch" style="opacity:0">J</span><span class="en-ch">J</span></div>
      <div class="guide-mini-key gmk-middle" title="Right Middle (K)"><span class="km-ch" style="opacity:0">K</span><span class="en-ch">K</span></div>
      <div class="guide-mini-key gmk-ring" title="Right Ring (L)"><span class="km-ch" style="opacity:0">L</span><span class="en-ch">L</span></div>
      <div class="guide-mini-key gmk-pinky" title="Right Pinky (;)"><span class="km-ch" style="opacity:0">;</span><span class="en-ch">;</span></div>
    `;
    if(subscriptsSec) subscriptsSec.style.display = 'block';
    if(cheatTitle) cheatTitle.textContent = isKm ? 'គោលការណ៍វាយអក្សរអង់គ្លេស' : 'Touch Typing Principles';
    if(ruleLabel1) ruleLabel1.innerHTML = isKm ? 'ប្ដូរអក្សរធំ (Shift)' : 'Opposite Shift';
    if(coengExample1) coengExample1.innerHTML = '<kbd class="guide-kbd">Shift</kbd> (Opposite)';
    if(ruleLabel2) ruleLabel2.innerHTML = isKm ? 'គ្រាប់ចុចយុថ្កា' : 'Home Anchors';
    if(coengKeyWrap) coengKeyWrap.innerHTML = '<kbd class="guide-kbd">F</kbd> &amp; <kbd class="guide-kbd">J</kbd> (Bumps)';
    if(ruleLabel3) ruleLabel3.innerHTML = isKm ? 'សញ្ញាវណ្ណយុត្តិ' : 'Punctuation';
    if(coengExample2) coengExample2.innerHTML = '<kbd class="guide-kbd">,</kbd> Mid · <kbd class="guide-kbd">.</kbd> Ring';
    if(ruleRow4) ruleRow4.style.display = 'flex';
    if(ruleLabel4) ruleLabel4.innerHTML = isKm ? 'ឥរិយាបថដៃ' : 'Posture';
    if(punctSample) punctSample.innerHTML = 'Float wrists';
    if(typeSpaceKbd) typeSpaceKbd.textContent = 'Space';
  } else if (currentLayoutId === 'standard') {
    if(layoutBadge){
      layoutBadge.textContent = isKm ? 'ស្តង់ដារ' : 'Standard';
      layoutBadge.className = 'gdh-badge badge-std';
    }
    leftHand.innerHTML = `
      <div class="guide-mini-key gmk-pinky" title="Left Pinky (A)"><span class="km-ch">ា</span><span class="en-ch">A</span></div>
      <div class="guide-mini-key gmk-ring" title="Left Ring (S)"><span class="km-ch">ស</span><span class="en-ch">S</span></div>
      <div class="guide-mini-key gmk-middle" title="Left Middle (D)"><span class="km-ch">ដ</span><span class="en-ch">D</span></div>
      <div class="guide-mini-key gmk-index" title="Left Index Anchor (F)"><span class="km-ch">ថ</span><span class="en-ch">F</span></div>
    `;
    rightHand.innerHTML = `
      <div class="guide-mini-key gmk-index" title="Right Index Anchor (J)"><span class="km-ch">ញ</span><span class="en-ch">J</span></div>
      <div class="guide-mini-key gmk-middle" title="Right Middle (K)"><span class="km-ch">ក</span><span class="en-ch">K</span></div>
      <div class="guide-mini-key gmk-ring" title="Right Ring (L)"><span class="km-ch">ល</span><span class="en-ch">L</span></div>
      <div class="guide-mini-key gmk-pinky" title="Right Pinky (;)"><span class="km-ch">ះ</span><span class="en-ch">;</span></div>
    `;
    if(subscriptsSec) subscriptsSec.style.display = 'block';
    if(cheatTitle) cheatTitle.textContent = isKm ? 'ជើងអក្សរ & ក្បួនប្លង់ (ស្តង់ដារ)' : 'Subscripts & Rules (Standard)';
    if(ruleLabel1) ruleLabel1.innerHTML = isKm ? 'ក្បួន៖ <kbd class="guide-kbd">្</kbd> + ព្យញ្ជនៈ' : 'Rule: <kbd class="guide-kbd">្</kbd> + Consonant';
    if(coengExample1) coengExample1.innerHTML = 'ក + ្ + ក = ក្ក';
    if(ruleLabel2) ruleLabel2.innerHTML = isKm ? 'គ្រាប់ចុចជើង' : 'Coeng Key';
    if(coengKeyWrap) coengKeyWrap.innerHTML = '<kbd class="guide-kbd">Space</kbd> <span class="i18n-t" data-en="(Standard)" data-km="(ស្តង់ដារ)">' + (isKm ? '(ស្តង់ដារ)' : '(Standard)') + '</span>';
    if(ruleLabel3) ruleLabel3.innerHTML = isKm ? 'ឧទាហរណ៍' : 'Example';
    if(coengExample2) coengExample2.innerHTML = 'ស + ្ + ង = ស្ង';
    if(ruleRow4) ruleRow4.style.display = 'flex';
    if(ruleLabel4) ruleLabel4.innerHTML = isKm ? 'សញ្ញាខណ្ឌ (។)' : 'Khmer Khan (។)';
    if(punctSample) punctSample.innerHTML = '<kbd class="guide-kbd">.</kbd> (Period)';
    if(typeSpaceKbd) typeSpaceKbd.textContent = 'Shift + Space';
  } else if (currentLayoutId === 'nida') {
    if(layoutBadge){
      layoutBadge.textContent = 'NiDA';
      layoutBadge.className = 'gdh-badge badge-nida';
    }
    leftHand.innerHTML = `
      <div class="guide-mini-key gmk-pinky" title="Left Pinky (A)"><span class="km-ch">ា</span><span class="en-ch">A</span></div>
      <div class="guide-mini-key gmk-ring" title="Left Ring (S)"><span class="km-ch">ស</span><span class="en-ch">S</span></div>
      <div class="guide-mini-key gmk-middle" title="Left Middle (D)"><span class="km-ch">ដ</span><span class="en-ch">D</span></div>
      <div class="guide-mini-key gmk-index" title="Left Index Anchor (F)"><span class="km-ch">ថ</span><span class="en-ch">F</span></div>
    `;
    rightHand.innerHTML = `
      <div class="guide-mini-key gmk-index" title="Right Index Anchor (J)"><span class="km-ch">្</span><span class="en-ch">J</span></div>
      <div class="guide-mini-key gmk-middle" title="Right Middle (K)"><span class="km-ch">ក</span><span class="en-ch">K</span></div>
      <div class="guide-mini-key gmk-ring" title="Right Ring (L)"><span class="km-ch">ល</span><span class="en-ch">L</span></div>
      <div class="guide-mini-key gmk-pinky" title="Right Pinky (;)"><span class="km-ch">ើ</span><span class="en-ch">;</span></div>
    `;
    if(subscriptsSec) subscriptsSec.style.display = 'block';
    if(cheatTitle) cheatTitle.textContent = isKm ? 'ជើងអក្សរ & ក្បួនប្លង់ (NiDA)' : 'Subscripts & Rules (NiDA)';
    if(ruleLabel1) ruleLabel1.innerHTML = isKm ? 'ក្បួន៖ <kbd class="guide-kbd">្</kbd> + ព្យញ្ជនៈ' : 'Rule: <kbd class="guide-kbd">្</kbd> + Consonant';
    if(coengExample1) coengExample1.innerHTML = 'ក + ្ + ក = ក្ក';
    if(ruleLabel2) ruleLabel2.innerHTML = isKm ? 'គ្រាប់ចុចជើង' : 'Coeng Key';
    if(coengKeyWrap) coengKeyWrap.innerHTML = '<kbd class="guide-kbd">J</kbd> <span class="i18n-t" data-en="(NiDA)" data-km="(NiDA)">(NiDA)</span>';
    if(ruleLabel3) ruleLabel3.innerHTML = isKm ? 'ឧទាហរណ៍' : 'Example';
    if(coengExample2) coengExample2.innerHTML = 'ស + ្ + ង = ស្ង';
    if(ruleRow4) ruleRow4.style.display = 'flex';
    if(ruleLabel4) ruleLabel4.innerHTML = isKm ? 'ខណ្ឌ &amp; បរិយោសាន' : 'Khan &amp; Bariyosan';
    if(punctSample) punctSample.innerHTML = '<kbd class="guide-kbd">.</kbd> (។) · <kbd class="guide-kbd">Shift+.</kbd> (៕)';
    if(typeSpaceKbd) typeSpaceKbd.textContent = 'Space';
  }

  if(window.PKQuickGuide && typeof window.PKQuickGuide.updateLayout === 'function'){
    window.PKQuickGuide.updateLayout(currentLayoutId);
  }
}

function switchLayout(id, force = false){
  if(!LAYOUTS[id] || (id === currentLayoutId && !force)) return;
  const prevLayout = currentLayoutId;
  document.querySelectorAll('.lesson-complete-overlay').forEach(el => el.remove());
  if(typeof adaptiveActive !== 'undefined' && adaptiveActive && typeof PK_ADAPTIVE !== 'undefined' && typeof PK_ADAPTIVE.exitSession === 'function'){
    PK_ADAPTIVE.exitSession();
  }
  if(typeof suspendLessonForLayoutSwitch === 'function'){
    suspendLessonForLayoutSwitch(prevLayout);
  } else if(typeof executeLessonExit === 'function' && typeof lessonActive !== 'undefined' && lessonActive){
    executeLessonExit();
  }
  if(typeof trialActive !== 'undefined' && trialActive) stopTrial();
  if(typeof raceMode !== 'undefined' && raceMode) exitRaceMode();
  if(id !== 'nida' && typeof hideNidaSwitchHud === 'function') hideNidaSwitchHud();
  currentLayoutId = id;
  window.currentLayoutId = currentLayoutId;
  if(id === 'english'){
    const warnEl = document.getElementById('capsLockWarningHud');
    const chassisWarnEl = document.getElementById('chassisCapsWarn');
    if(warnEl){
      warnEl.hidden = true;
      warnEl.style.display = 'none';
    }
    if(chassisWarnEl){
      chassisWarnEl.hidden = true;
      chassisWarnEl.style.display = 'none';
    }
  }
  try {
    if(typeof localStorage !== 'undefined'){
      localStorage.setItem(LAYOUT_STORAGE_KEY, id);
      localStorage.setItem('khmerActiveLayout', id);
    }
  } catch(e){}
  if(typeof updateQuickGuide === 'function') updateQuickGuide();
  window.activeCourse = id;
  window.activeLayout = id;
  if(typeof PK_TRACKER !== 'undefined' && typeof PK_TRACKER.recordLayoutSwitch === 'function'){
    PK_TRACKER.recordLayoutSwitch(prevLayout, id);
  }
  ALL_ROWS = LAYOUTS[id].rows;
  if(typeof LESSON_SETS !== 'undefined'){
    LESSONS = LESSON_SETS[id] || LESSONS;
    if(typeof LEVEL_SETS !== 'undefined'){
      LEVELS = LEVEL_SETS[id] || LEVELS;
      if(typeof defaultCollapsedLevels === 'function') collapsedLevels = defaultCollapsedLevels();
    }
    if(typeof renderLessonStrip === 'function') renderLessonStrip();
    if(typeof updateMasteryStat === 'function') updateMasteryStat();
    if(typeof PK_ADAPTIVE !== 'undefined' && typeof PK_ADAPTIVE.updateSidebarCard === 'function'){
      PK_ADAPTIVE.updateSidebarCard(id);
    }
  }
  hoverLayer = null;
  lockedLayer = null;
  physicalLayer = null;
  capsOn = false;
  if(typeof clearText === 'function') clearText();
  else if(typeof window !== 'undefined' && typeof window.clearText === 'function') window.clearText();
  buildBoard();
  updateHandsOverlay();
  render();
  syncLayoutUI(id);
  if(typeof restoreLessonAfterLayoutSwitch === 'function'){
    restoreLessonAfterLayoutSwitch(id);
  }
}
if(layoutStrip){
  layoutStrip.querySelectorAll('.layout-pill[data-layout]').forEach(p=>{
    p.addEventListener('click', ()=> {
      switchLayout(p.dataset.layout);
      if(typeof playHolographicChime === 'function'){
        playHolographicChime(p.dataset.layout !== 'english');
      }
    });
  });
}


/* ---------- finger guide (illustrated translucent hands) ---------- */
if(typeof window !== 'undefined'){
  window.keyEls = keyEls;
  window.currentLayer = currentLayer;
  window.setActiveFinger = setActiveFinger;
  window.render = render;
  window.LAYOUTS = LAYOUTS;
  window.glyphData = glyphData;
}

const FINGERS = [
  {id:'lp', canonicalId:'L5', hand:'L', home:'a', kind:'pinky',  baseW:22.5, tipW:14.0, kDist:102, restLen:100, restAng:-0.08, archPull:0.22, archDy:12,  tipDy:7},
  {id:'lr', canonicalId:'L4', hand:'L', home:'s', kind:'ring',   baseW:24.5, tipW:15.0, kDist:108, restLen:106, restAng:-0.03, archPull:0.20, archDy:-2,  tipDy:0},
  {id:'lm', canonicalId:'L3', hand:'L', home:'d', kind:'middle', baseW:26.5, tipW:16.0, kDist:114, restLen:112, restAng:0.00,  archPull:0.18, archDy:-10, tipDy:-6},
  {id:'li', canonicalId:'L2', hand:'L', home:'f', kind:'index',  baseW:25.5, tipW:15.5, kDist:108, restLen:106, restAng:0.04,  archPull:0.20, archDy:-3,  tipDy:1},
  {id:'lt', canonicalId:'L1', hand:'L', home:'space', kind:'thumb', baseW:27.0, tipW:16.8, kDist:72, restLen:70, restAng:0.52, archPull:0, archDy:0, tipDy:0},
  {id:'rt', canonicalId:'R1', hand:'R', home:'space', kind:'thumb', baseW:27.0, tipW:16.8, kDist:72, restLen:70, restAng:-0.52, archPull:0, archDy:0, tipDy:0},
  {id:'ri', canonicalId:'R2', hand:'R', home:'j', kind:'index',  baseW:25.5, tipW:15.5, kDist:108, restLen:106, restAng:-0.04, archPull:0.20, archDy:-3,  tipDy:1},
  {id:'rm', canonicalId:'R3', hand:'R', home:'k', kind:'middle', baseW:26.5, tipW:16.0, kDist:114, restLen:112, restAng:0.00,  archPull:0.18, archDy:-10, tipDy:-6},
  {id:'rr', canonicalId:'R4', hand:'R', home:'l', kind:'ring',   baseW:24.5, tipW:15.0, kDist:108, restLen:106, restAng:0.03,  archPull:0.20, archDy:-2,  tipDy:0},
  {id:'rp', canonicalId:'R5', hand:'R', home:'semicolon', kind:'pinky', baseW:22.5, tipW:14.0, kDist:102, restLen:100, restAng:0.08, archPull:0.22, archDy:12, tipDy:7},
];
if(typeof window !== 'undefined') window.FINGERS = FINGERS;

const handsOverlay = typeof document !== 'undefined' ? document.getElementById('handsOverlay') : null;
const handsToggle = typeof document !== 'undefined' ? document.getElementById('handsToggle') : null;
let handsOn = true;
if(typeof window !== 'undefined') window.handsOn = handsOn;
const fingerEls = {}; // id -> {g, shape, shine, crease1, crease2, nail, tip}
if(typeof window !== 'undefined') window.fingerEls = fingerEls;

/* ---- svg geometry helpers ---- */
const SVGNS = 'http://www.w3.org/2000/svg';
function sub(a,b){ return {x:a.x-b.x, y:a.y-b.y}; }
function add(a,b){ return {x:a.x+b.x, y:a.y+b.y}; }
function scalePt(a,s){ return {x:a.x*s, y:a.y*s}; }
function dist(a,b){ return Math.hypot(a.x-b.x, a.y-b.y); }
function norm(v){ const l = Math.hypot(v.x,v.y) || 1; return {x:v.x/l, y:v.y/l}; }

/* quadratic bezier point + tangent (backward compatibility fallback) */
function qPoint(o,c,t,s){ const m=1-s; return { x:m*m*o.x+2*m*s*c.x+s*s*t.x, y:m*m*o.y+2*m*s*c.y+s*s*t.y }; }
function qTangent(o,c,t,s){ const m=1-s; return { x:2*m*(c.x-o.x)+2*s*(t.x-c.x), y:2*m*(c.y-o.y)+2*s*(t.y-c.y) }; }

/* cubic bezier point + tangent for natural 3-phalanx human finger curve */
function cPoint(p0, p1, p2, p3, s){
  const m = 1 - s;
  return {
    x: m*m*m * p0.x + 3*m*m*s * p1.x + 3*m*s*s * p2.x + s*s*s * p3.x,
    y: m*m*m * p0.y + 3*m*m*s * p1.y + 3*m*s*s * p2.y + s*s*s * p3.y
  };
}

function cTangent(p0, p1, p2, p3, s){
  const m = 1 - s;
  return {
    x: 3*m*m * (p1.x - p0.x) + 6*m*s * (p2.x - p1.x) + 3*s*s * (p3.x - p2.x),
    y: 3*m*m * (p1.y - p0.y) + 6*m*s * (p2.y - p1.y) + 3*s*s * (p3.y - p2.y)
  };
}

/* Biomechanically grounded finger curvature:
   Calculates natural resting dome posture, relaxed knuckle-to-pad transition,
   and individual finger flex angles */
function computeFingerControlPoints(p0, p3, kind, inward){
  const dx = p3.x - p0.x;
  const dy = p3.y - p0.y;
  const span = Math.hypot(dx, dy) || 1;
  const outward = -inward;

  let p1, p2;
  if(kind === 'thumb'){
    // Thumb: departs laterally from thenar CMC, curves inward along spacebar or flexes anatomically toward Alt/AltGr
    const isAdducting = (dx * inward) < 0;
    if(isAdducting){
      // Graceful flexed thumb reaching Alt/AltGr: natural anatomical MCP arch and soft descent onto keycap
      p1 = {
        x: p0.x + dx * 0.32 - inward * (span * 0.12),
        y: p0.y + dy * 0.30 - 10
      };
      p2 = {
        x: p0.x + dx * 0.70 - inward * (span * 0.05),
        y: p0.y + dy * 0.68 - 6
      };
    } else {
      // Natural resting or Spacebar sweep
      p1 = {
        x: p0.x + dx * 0.35 - inward * (span * 0.20),
        y: p0.y + dy * 0.38 - 5
      };
      p2 = {
        x: p0.x + dx * 0.72 - inward * (span * 0.08),
        y: p0.y + dy * 0.75 - 6
      };
    }
  } else if(kind === 'pinky'){
    // Pinky: natural outward convex curve along the lateral hand edge
    p1 = {
      x: p0.x + dx * 0.33 + outward * (span * 0.09),
      y: p0.y + dy * 0.36 - 6
    };
    p2 = {
      x: p0.x + dx * 0.72 + outward * (span * 0.04),
      y: p0.y + dy * 0.75 - 5
    };
  } else if(kind === 'ring'){
    // Ring finger: gentle outward bow, arching gracefully over PIP
    p1 = {
      x: p0.x + dx * 0.33 + outward * (span * 0.035),
      y: p0.y + dy * 0.36 - 7
    };
    p2 = {
      x: p0.x + dx * 0.72 + outward * (span * 0.015),
      y: p0.y + dy * 0.75 - 5
    };
  } else if(kind === 'middle'){
    // Middle finger: longest finger, highest crest at PIP joint, descends onto key
    p1 = {
      x: p0.x + dx * 0.33,
      y: p0.y + dy * 0.35 - 8
    };
    p2 = {
      x: p0.x + dx * 0.70,
      y: p0.y + dy * 0.74 - 6
    };
  } else {
    // Index finger: sweeps upward and curves inward toward keyboard center
    p1 = {
      x: p0.x + dx * 0.33 + inward * (span * 0.05),
      y: p0.y + dy * 0.36 - 7
    };
    p2 = {
      x: p0.x + dx * 0.72 + inward * (span * 0.02),
      y: p0.y + dy * 0.75 - 5
    };
  }
  return { p1, p2 };
}

/* Build a smooth tapered, sculpted human finger silhouette between origin and tip */
function fingerFrame(p0, p1, p2, p3, baseW, tipW, isThumb = false){
  // Handle 3-point fallback for backward compatibility
  if(typeof baseW === 'boolean' || arguments.length <= 6){
    const origin = p0, ctrl = p1, tip = p2;
    const bW = p3, tW = baseW;
    const thumb = Boolean(tipW);
    const midP1 = { x: origin.x + (ctrl.x - origin.x) * 0.65, y: origin.y + (ctrl.y - origin.y) * 0.65 };
    const midP2 = { x: tip.x + (ctrl.x - tip.x) * 0.65, y: tip.y + (ctrl.y - tip.y) * 0.65 };
    return fingerFrame(origin, midP1, midP2, tip, bW, tW, thumb);
  }

  const N = 20, left = [], right = [];
  for(let i = 0; i <= N; i++){
    const s = i / N;
    const pt = cPoint(p0, p1, p2, p3, s);
    const tan = cTangent(p0, p1, p2, p3, s);
    const l = Math.hypot(tan.x, tan.y) || 1;
    // Left-hand normal in screen coordinates (+X right, +Y down) so left[] is true screen-left of upward finger
    const nx = tan.y / l, ny = -tan.x / l;
    
    // Slender linear taper from knuckle baseW to fingertip tipW
    const wLinear = (1 - s) * baseW + s * tipW;
    let w = wLinear * 0.5;
    
    if(!isThumb){
      // Anatomical PIP joint swell (s ≈ 0.48)
      const pipSwell = 0.95 * Math.exp(-Math.pow((s - 0.48) / 0.10, 2));
      // Anatomical DIP joint swell (s ≈ 0.78)
      const dipSwell = 0.65 * Math.exp(-Math.pow((s - 0.78) / 0.08, 2));
      // Subtle shaft taper (s ≈ 0.26)
      const waistTaper = -0.40 * Math.exp(-Math.pow((s - 0.26) / 0.12, 2));
      w += pipSwell + dipSwell + waistTaper;
    } else {
      // Thumb MCP and IP joint swells
      const mcpSwell = 1.3 * Math.exp(-Math.pow((s - 0.34) / 0.18, 2));
      const ipSwell = 0.85 * Math.exp(-Math.pow((s - 0.68) / 0.12, 2));
      w += mcpSwell + ipSwell;
    }
    left.push({ x: pt.x + nx * w, y: pt.y + ny * w });
    right.push({ x: pt.x - nx * w, y: pt.y - ny * w });
  }
  const rawTipTan = cTangent(p0, p1, p2, p3, 1);
  const tipTanLen = Math.hypot(rawTipTan.x, rawTipTan.y) || 1;
  const tipTan = { x: rawTipTan.x / tipTanLen, y: rawTipTan.y / tipTanLen };
  return { left, right, p0, p1, p2, p3, origin: p0, tip: p3, tipTan, baseW, tipW, isThumb };
}

/* G1-continuous cubic Bezier fingertip pad cap between any two tip edges */
function tipCapBetween(fromPt, toPt, tipTan, tipW, isThumb = false){
  const capReach = tipW * (isThumb ? 0.52 : 0.55);
  const c1 = { x: fromPt.x + tipTan.x * capReach, y: fromPt.y + tipTan.y * capReach };
  const c2 = { x: toPt.x + tipTan.x * capReach, y: toPt.y + tipTan.y * capReach };
  return `C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${toPt.x.toFixed(1)} ${toPt.y.toFixed(1)} `;
}

/* Open-base finger path for active finger illumination (no circular seam across knuckle) */
function frameToPath(frame, baseW, tipW){
  const {left, right, tipTan, isThumb} = frame;
  const startIdx = isThumb ? 2 : 4;
  const n = left.length - 1;
  let d = `M ${left[startIdx].x.toFixed(1)} ${left[startIdx].y.toFixed(1)} `;
  for(let i = startIdx + 1; i <= n; i++) d += `L ${left[i].x.toFixed(1)} ${left[i].y.toFixed(1)} `;
  d += tipCapBetween(left[n], right[n], tipTan, tipW, isThumb);
  for(let i = n - 1; i >= startIdx; i--) d += `L ${right[i].x.toFixed(1)} ${right[i].y.toFixed(1)} `;
  return d;
}

/* Fingernail plate path — disabled to eliminate boxy fingernail artifacts and keep natural smooth fingertips */
function buildNailPath(frame){
  return '';
}

function creaseAt(frame, s){
  const { p0, p1, p2, p3, baseW, tipW } = frame;
  const pt = cPoint(p0, p1, p2, p3, s);
  const rawTan = cTangent(p0, p1, p2, p3, s);
  const len = Math.hypot(rawTan.x, rawTan.y) || 1;
  const tan = { x: rawTan.x / len, y: rawTan.y / len };
  const nx = -tan.y, ny = tan.x;
  const w = (baseW * (1 - s) + tipW * s) * 0.26;
  const pA = { x: pt.x - nx * w, y: pt.y - ny * w };
  const pB = { x: pt.x + nx * w, y: pt.y + ny * w };
  const cp = { x: pt.x - tan.x * 1.4, y: pt.y - tan.y * 1.4 };
  return `M ${pA.x.toFixed(1)} ${pA.y.toFixed(1)} Q ${cp.x.toFixed(1)} ${cp.y.toFixed(1)} ${pB.x.toFixed(1)} ${pB.y.toFixed(1)}`;
}

function pointAtFrame(frame, s){
  const i = Math.round(s * (frame.left.length - 1));
  const l = frame.left[i], r = frame.right[i];
  return { x: (l.x + r.x) * 0.5, y: (l.y + r.y) * 0.5 };
}

/* ---- Dynamic Hand Color Gradients Engine ---- */
const HAND_COLOR_PRESETS = {
  cyber: { name: "Cyber Cyan & Orchid", l: "#38bdf8", r: "#f472b6" },
  emerald: { name: "Amber & Emerald", l: "#fbbf24", r: "#34d399" },
  ruby: { name: "Ruby & Sapphire", l: "#fb7185", r: "#60a5fa" },
  sunset: { name: "Sunset & Violet", l: "#fb923c", r: "#a78bfa" },
  ghost: { name: "Frost Silver", l: "#94a3b8", r: "#e2e8f0" },
  match: { name: "Match Theme", l: null, r: null },
  custom: { name: "Custom Dual", l: "#38bdf8", r: "#f472b6" }
};

function hexToRgb(hex, fallback) {
  if (!hex || typeof hex !== 'string') return fallback || { r: 56, g: 189, b: 248 };
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  if (hex.length !== 6) return fallback || { r: 56, g: 189, b: 248 };
  const num = parseInt(hex, 16);
  if (isNaN(num)) return fallback || { r: 56, g: 189, b: 248 };
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r, g, b) {
  const clamp = v => Math.max(0, Math.min(255, Math.round(v)));
  return '#' + [clamp(r), clamp(g), clamp(b)].map(x => x.toString(16).padStart(2, '0')).join('');
}

function buildHandPalette(hex, fallbackHex) {
  const rgb = hexToRgb(hex, hexToRgb(fallbackHex));
  const r = rgb.r, g = rgb.g, b = rgb.b;
  return {
    hex: rgbToHex(r, g, b),
    dark: rgbToHex(r * 0.14, g * 0.14, b * 0.14),
    deep: rgbToHex(r * 0.38, g * 0.38, b * 0.38),
    mid: rgbToHex(r * 0.68, g * 0.68, b * 0.68),
    bright: rgbToHex(r, g, b),
    light: rgbToHex(r + (255 - r) * 0.75, g + (255 - g) * 0.75, b + (255 - b) * 0.75),
    glowRgba: `rgba(${r}, ${g}, ${b}, 0.90)`,
    strokeRgba: `rgba(${r}, ${g}, ${b}, 0.78)`,
    shadowRgba: `rgba(${r}, ${g}, ${b}, 0.38)`,
    nailFillRgba: `rgba(${r}, ${g}, ${b}, 0.28)`,
    tipFillRgba: `rgba(${r}, ${g}, ${b}, 0.70)`
  };
}

function getThemeMatchedColors() {
  const root = document.documentElement;
  if (root.classList.contains('theme-jungle')) {
    return { l: '#5fd694', r: '#8bf0b3' };
  } else if (root.classList.contains('theme-temple')) {
    return { l: '#ffd166', r: '#e0a838' };
  } else if (root.classList.contains('theme-moonlight')) {
    return { l: '#bfe0ff', r: '#7fb8ff' };
  } else if (root.classList.contains('theme-sunset')) {
    return { l: '#ff9a6c', r: '#ff6b6b' };
  } else if (root.classList.contains('theme-light')) {
    return { l: '#0284c7', r: '#7c3aed' };
  } else if (root.classList.contains('theme-sepia')) {
    return { l: '#b48342', r: '#c2593f' };
  }
  return { l: '#38bdf8', r: '#f472b6' };
}

const defs = typeof document !== 'undefined' && typeof SVGNS !== 'undefined' ? document.createElementNS(SVGNS, 'defs') : null;
if(defs) defs.id = 'handsDefs';

function updateHandsGradients(leftHex, rightHex) {
  const palL = buildHandPalette(leftHex, '#38bdf8');
  const palR = buildHandPalette(rightHex, '#f472b6');

  if(defs){
    defs.innerHTML = `
  <linearGradient id="fingerGrad" x1="0" y1="1" x2="0.2" y2="0">
    <stop offset="0%" stop-color="${palL.mid}" stop-opacity="0"/>
    <stop offset="35%" stop-color="${palL.mid}" stop-opacity="0.25"/>
    <stop offset="85%" stop-color="${palL.bright}" stop-opacity="0.52"/>
    <stop offset="100%" stop-color="${palL.light}" stop-opacity="0.75"/>
  </linearGradient>
  <linearGradient id="fingerGradR" x1="0" y1="1" x2="0.2" y2="0">
    <stop offset="0%" stop-color="${palR.mid}" stop-opacity="0"/>
    <stop offset="35%" stop-color="${palR.mid}" stop-opacity="0.25"/>
    <stop offset="85%" stop-color="${palR.bright}" stop-opacity="0.52"/>
    <stop offset="100%" stop-color="${palR.light}" stop-opacity="0.75"/>
  </linearGradient>
  <linearGradient id="fingerGradActive" x1="0" y1="1" x2="0.15" y2="0">
    <stop offset="0%" stop-color="${palL.deep}" stop-opacity="0"/>
    <stop offset="18%" stop-color="${palL.bright}" stop-opacity="0.72"/>
    <stop offset="60%" stop-color="${palL.bright}" stop-opacity="0.95"/>
    <stop offset="85%" stop-color="#ffd166" stop-opacity="0.98"/>
    <stop offset="100%" stop-color="#ffffff" stop-opacity="1"/>
  </linearGradient>
  <linearGradient id="fingerGradActiveR" x1="0" y1="1" x2="0.15" y2="0">
    <stop offset="0%" stop-color="${palR.deep}" stop-opacity="0"/>
    <stop offset="18%" stop-color="${palR.bright}" stop-opacity="0.72"/>
    <stop offset="60%" stop-color="${palR.bright}" stop-opacity="0.95"/>
    <stop offset="85%" stop-color="#ffd166" stop-opacity="0.98"/>
    <stop offset="100%" stop-color="#ffffff" stop-opacity="1"/>
  </linearGradient>
  <linearGradient id="palmGrad" x1="0" y1="1" x2="0.18" y2="0">
    <stop offset="0%" stop-color="${palL.light}" stop-opacity="0.42"/>
    <stop offset="7%" stop-color="${palL.dark}" stop-opacity="0.66"/>
    <stop offset="38%" stop-color="${palL.deep}" stop-opacity="0.78"/>
    <stop offset="70%" stop-color="${palL.mid}" stop-opacity="0.88"/>
    <stop offset="90%" stop-color="${palL.bright}" stop-opacity="0.95"/>
    <stop offset="100%" stop-color="${palL.light}" stop-opacity="0.98"/>
  </linearGradient>
  <linearGradient id="palmGradR" x1="0" y1="1" x2="0.18" y2="0">
    <stop offset="0%" stop-color="${palR.light}" stop-opacity="0.42"/>
    <stop offset="7%" stop-color="${palR.dark}" stop-opacity="0.66"/>
    <stop offset="38%" stop-color="${palR.deep}" stop-opacity="0.78"/>
    <stop offset="70%" stop-color="${palR.mid}" stop-opacity="0.88"/>
    <stop offset="90%" stop-color="${palR.bright}" stop-opacity="0.95"/>
    <stop offset="100%" stop-color="${palR.light}" stop-opacity="0.98"/>
  </linearGradient>
  <radialGradient id="palmHighlight" cx="50%" cy="45%" r="52%">
    <stop offset="0%" stop-color="${palL.light}" stop-opacity="0.55"/>
    <stop offset="50%" stop-color="${palL.bright}" stop-opacity="0.25"/>
    <stop offset="100%" stop-color="${palL.bright}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="palmHighlightR" cx="50%" cy="45%" r="52%">
    <stop offset="0%" stop-color="${palR.light}" stop-opacity="0.55"/>
    <stop offset="50%" stop-color="${palR.bright}" stop-opacity="0.25"/>
    <stop offset="100%" stop-color="${palR.bright}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="jointGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5"/>
    <stop offset="100%" stop-color="${palL.mid}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="jointGlowR" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5"/>
    <stop offset="100%" stop-color="${palR.mid}" stop-opacity="0"/>
  </radialGradient>
  <filter id="handShadow" x="-40%" y="-40%" width="180%" height="180%">
    <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000000" flood-opacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="${palL.bright}" flood-opacity="0.45"/>
    <feDropShadow dx="0" dy="8" stdDeviation="22" flood-color="${palL.mid}" flood-opacity="0.25"/>
  </filter>
  <filter id="handShadowR" x="-40%" y="-40%" width="180%" height="180%">
    <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000000" flood-opacity="0.55"/>
    <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="${palR.bright}" flood-opacity="0.45"/>
    <feDropShadow dx="0" dy="8" stdDeviation="22" flood-color="${palR.mid}" flood-opacity="0.25"/>
  </filter>
  `;
  }

  const r = typeof document !== 'undefined' ? document.documentElement : null;
  if(r && r.style){
    r.style.setProperty('--hand-l-hex', palL.hex);
    r.style.setProperty('--hand-l-stroke', palL.strokeRgba);
    r.style.setProperty('--hand-l-shadow', palL.shadowRgba);
    r.style.setProperty('--hand-l-shine', palL.light);
    r.style.setProperty('--hand-l-crease', palL.strokeRgba);
    r.style.setProperty('--hand-l-nail-fill', palL.nailFillRgba);
    r.style.setProperty('--hand-l-nail-stroke', palL.light);
    r.style.setProperty('--hand-l-tip-fill', palL.tipFillRgba);
    r.style.setProperty('--hand-l-tip-stroke', palL.light);
    r.style.setProperty('--hand-l-glow', palL.glowRgba);

    r.style.setProperty('--hand-r-hex', palR.hex);
    r.style.setProperty('--hand-r-stroke', palR.strokeRgba);
    r.style.setProperty('--hand-r-shadow', palR.shadowRgba);
    r.style.setProperty('--hand-r-shine', palR.light);
    r.style.setProperty('--hand-r-crease', palR.strokeRgba);
    r.style.setProperty('--hand-r-nail-fill', palR.nailFillRgba);
    r.style.setProperty('--hand-r-nail-stroke', palR.light);
    r.style.setProperty('--hand-r-tip-fill', palR.tipFillRgba);
    r.style.setProperty('--hand-r-tip-stroke', palR.light);
    r.style.setProperty('--hand-r-glow', palR.glowRgba);
  }
}

if(typeof window !== 'undefined'){
  window.PKHandsColor = {
    PRESETS: HAND_COLOR_PRESETS,
    applyHandColors: function(presetKey, customL, customR) {
      presetKey = presetKey || (function(){ try { return localStorage.getItem('khmerSettingHandColorPreset'); }catch(e){ return null; } })() || 'cyber';
      let l, r;
      if (presetKey === 'custom') {
        try {
          l = customL || localStorage.getItem('khmerSettingHandColorCustomL') || '#38bdf8';
          r = customR || localStorage.getItem('khmerSettingHandColorCustomR') || '#f472b6';
        } catch(e) {
          l = '#38bdf8'; r = '#f472b6';
        }
      } else if (presetKey === 'match') {
        const matched = getThemeMatchedColors();
        l = matched.l;
        r = matched.r;
      } else if (HAND_COLOR_PRESETS[presetKey]) {
        l = HAND_COLOR_PRESETS[presetKey].l;
        r = HAND_COLOR_PRESETS[presetKey].r;
      } else {
        l = '#38bdf8';
        r = '#f472b6';
        presetKey = 'cyber';
      }
      updateHandsGradients(l, r);
      try {
        localStorage.setItem('khmerSettingHandColorPreset', presetKey);
        if (customL) localStorage.setItem('khmerSettingHandColorCustomL', customL);
        if (customR) localStorage.setItem('khmerSettingHandColorCustomR', customR);
      } catch(e){}

      if(typeof document !== 'undefined' && typeof document.dispatchEvent === 'function' && typeof CustomEvent !== 'undefined'){
        document.dispatchEvent(new CustomEvent('pk-hand-colors-changed', {
          detail: { preset: presetKey, l, r }
        }));
      }
      return { preset: presetKey, l, r };
    },
    cycleNextPreset: function() {
      const keys = ['cyber', 'emerald', 'ruby', 'sunset', 'ghost', 'match'];
      let cur = 'cyber';
      try { cur = localStorage.getItem('khmerSettingHandColorPreset') || 'cyber'; } catch(e){}
      let idx = keys.indexOf(cur);
      if (idx === -1) idx = 0;
      const next = keys[(idx + 1) % keys.length];
      return this.applyHandColors(next);
    }
  };
}

if(handsOverlay && defs) handsOverlay.appendChild(defs);
if(typeof window !== 'undefined' && window.PKHandsColor) window.PKHandsColor.applyHandColors();

if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined' && document.documentElement) {
  const themeObserver = new MutationObserver(() => {
    try {
      if (localStorage.getItem('khmerSettingHandColorPreset') === 'match') {
        window.PKHandsColor.applyHandColors('match');
      }
    } catch(e){}
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

const handGroupL = typeof document !== 'undefined' && typeof SVGNS !== 'undefined' ? document.createElementNS(SVGNS,'g') : null;
if(handGroupL) handGroupL.setAttribute('class','hand-group side-l');
const handGroupR = typeof document !== 'undefined' && typeof SVGNS !== 'undefined' ? document.createElementNS(SVGNS,'g') : null;
if(handGroupR) handGroupR.setAttribute('class','hand-group side-r');
if(handsOverlay && handGroupL && handGroupR){
  handsOverlay.appendChild(handGroupL);
  handsOverlay.appendChild(handGroupR);
}

const palmShapeL = typeof document !== 'undefined' && typeof SVGNS !== 'undefined' ? document.createElementNS(SVGNS,'path') : null;
if(palmShapeL) palmShapeL.setAttribute('class','palm-shape');
const palmShadeL = typeof document !== 'undefined' && typeof SVGNS !== 'undefined' ? document.createElementNS(SVGNS,'path') : null;
if(palmShadeL) palmShadeL.setAttribute('class','palm-shade');
const palmHiL = typeof document !== 'undefined' && typeof SVGNS !== 'undefined' ? document.createElementNS(SVGNS,'ellipse') : null;
if(palmHiL) palmHiL.setAttribute('class','palm-highlight');
const palmCoreL = typeof document !== 'undefined' && typeof SVGNS !== 'undefined' ? document.createElementNS(SVGNS,'circle') : null;
if(palmCoreL){ palmCoreL.setAttribute('class','palm-core'); palmCoreL.setAttribute('r','5.5'); }

const palmShapeR = typeof document !== 'undefined' && typeof SVGNS !== 'undefined' ? document.createElementNS(SVGNS,'path') : null;
if(palmShapeR) palmShapeR.setAttribute('class','palm-shape');
const palmShadeR = typeof document !== 'undefined' && typeof SVGNS !== 'undefined' ? document.createElementNS(SVGNS,'path') : null;
if(palmShadeR) palmShadeR.setAttribute('class','palm-shade');
const palmHiR = typeof document !== 'undefined' && typeof SVGNS !== 'undefined' ? document.createElementNS(SVGNS,'ellipse') : null;
if(palmHiR) palmHiR.setAttribute('class','palm-highlight');
const palmCoreR = typeof document !== 'undefined' && typeof SVGNS !== 'undefined' ? document.createElementNS(SVGNS,'circle') : null;
if(palmCoreR){ palmCoreR.setAttribute('class','palm-core'); palmCoreR.setAttribute('r','5.5'); }

if(handGroupL && palmShapeL){
  handGroupL.appendChild(palmShapeL); handGroupL.appendChild(palmShadeL); handGroupL.appendChild(palmHiL); handGroupL.appendChild(palmCoreL);
}
if(handGroupR && palmShapeR){
  handGroupR.appendChild(palmShapeR); handGroupR.appendChild(palmShadeR); handGroupR.appendChild(palmHiR); handGroupR.appendChild(palmCoreR);
}

function createFingerElement(f){
  if(fingerEls[f.id]) return fingerEls[f.id];
  const g = document.createElementNS(SVGNS,'g');
  g.setAttribute('class','finger');
  if(!g.dataset) g.dataset = {};
  g.dataset.finger = f.id;
  g.dataset.canonicalFinger = f.canonicalId || toCanonicalFinger(f.id);
  const shape = document.createElementNS(SVGNS,'path'); shape.setAttribute('class','finger-shape');
  const crease1 = document.createElementNS(SVGNS,'path'); crease1.setAttribute('class','finger-crease');
  const joint1 = document.createElementNS(SVGNS,'circle'); joint1.setAttribute('class','finger-joint');
  const crease2 = document.createElementNS(SVGNS,'path'); crease2.setAttribute('class','finger-crease');
  const joint2 = document.createElementNS(SVGNS,'circle'); joint2.setAttribute('class','finger-joint');
  const shine = document.createElementNS(SVGNS,'path'); shine.setAttribute('class','finger-shine');
  const shine2 = document.createElementNS(SVGNS,'path'); shine2.setAttribute('class','finger-shine2');
  const energy = document.createElementNS(SVGNS,'path'); energy.setAttribute('class','finger-energy');
  const nail = document.createElementNS(SVGNS,'path'); nail.setAttribute('class','finger-nail');
  const impactRing = document.createElementNS(SVGNS,'circle'); impactRing.setAttribute('class','impact-ring'); impactRing.setAttribute('r','9');
  const impactRing2 = document.createElementNS(SVGNS,'circle'); impactRing2.setAttribute('class','impact-ring-2'); impactRing2.setAttribute('r','9');
  const impactSparks = document.createElementNS(SVGNS,'path');
  impactSparks.setAttribute('class','impact-sparks');
  impactSparks.setAttribute('d','M0 -12 L0 -7 M10.4 -6 L6.1 -3.5 M10.4 6 L6.1 3.5 M0 12 L0 7 M-10.4 6 L-6.1 3.5 M-10.4 -6 L-6.1 -3.5');
  const reticle = document.createElementNS(SVGNS,'path');
  reticle.setAttribute('class','target-reticle');
  reticle.setAttribute('d','M -11 -5 L -11 -11 L -5 -11 M 5 -11 L 11 -11 L 11 -5 M 11 5 L 11 11 L 5 11 M -5 11 L -11 11 L -11 5');
  const tip = document.createElementNS(SVGNS,'circle'); tip.setAttribute('class','finger-tip'); tip.setAttribute('r','5');
  g.appendChild(shape); g.appendChild(crease1); g.appendChild(joint1); g.appendChild(crease2); g.appendChild(joint2);
  g.appendChild(shine); g.appendChild(shine2); g.appendChild(energy); g.appendChild(nail); g.appendChild(impactRing); g.appendChild(impactRing2); g.appendChild(impactSparks); g.appendChild(reticle); g.appendChild(tip);
  (f.hand === 'L' ? handGroupL : handGroupR).appendChild(g);
  fingerEls[f.id] = {g, shape, crease1, crease2, joint1, joint2, shine, shine2, energy, nail, tip, impactRing, impactRing2, impactSparks, reticle};
  return fingerEls[f.id];
}
if(typeof window !== 'undefined') window.createFingerElement = createFingerElement;

if(typeof document !== 'undefined' && typeof SVGNS !== 'undefined' && handGroupL){
  FINGERS.forEach(createFingerElement);
}

let activeFinger = null;
let activeTargetKey = null;
let activeShiftFinger = null;
let activeShiftTargetKey = null;
const heldPhysicalModifiers = new Set();

function setPhysicalModifierHeld(keyId, isHeld){
  if(!keyId) return;
  if(isHeld){
    heldPhysicalModifiers.add(keyId);
    const fid = KEY_FINGER[keyId];
    if(fid){
      fingerBiomechanicalStates[fid] = HAND_STATES.HOLDING;
      const fe = fingerEls[fid];
      if(fe) fe.g.classList.add('pressed');
    }
  } else {
    heldPhysicalModifiers.delete(keyId);
    const fid = KEY_FINGER[keyId];
    if(fid){
      fingerBiomechanicalStates[fid] = HAND_STATES.RESTING;
      const fe = fingerEls[fid];
      if(fe) fe.g.classList.remove('pressed');
    }
  }
  updateHandsOverlay();
}
if(typeof window !== 'undefined') window.setPhysicalModifierHeld = setPhysicalModifierHeld;

function clearAllPhysicalModifiersHeld(){
  heldPhysicalModifiers.forEach(keyId => {
    const fid = KEY_FINGER[keyId];
    if(fid){
      fingerBiomechanicalStates[fid] = HAND_STATES.RESTING;
      const fe = fingerEls[fid];
      if(fe) fe.g.classList.remove('pressed');
    }
  });
  heldPhysicalModifiers.clear();
  updateHandsOverlay();
}
if(typeof window !== 'undefined') window.clearAllPhysicalModifiersHeld = clearAllPhysicalModifiersHeld;

function modifierInfoFor(keyId, layer){
  const mod = resolveModifierChoreography(keyId, layer);
  if(!mod) return null;
  return {
    fingerId: mod.modifierLegacyFinger,
    targetKey: mod.modifierKey,
    modifierCode: mod.modifierCode,
    modifierFinger: mod.modifierFinger,
    targetFinger: mod.targetFinger
  };
}
if(typeof window !== 'undefined') window.modifierInfoFor = modifierInfoFor;

function setKeyElements(els){
  if(!els) return;
  Object.assign(keyEls, els);
}
if(typeof window !== 'undefined') window.setKeyElements = setKeyElements;

function keyCenter(id, wrapRect){
  const el = keyEls[id] || (typeof window !== 'undefined' && window.keyEls && window.keyEls[id]) || (typeof global !== 'undefined' && global.keyEls && global.keyEls[id]);
  if(!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width/2 - wrapRect.left, y: r.top + r.height/2 - wrapRect.top };
}

function keyBounds(id, wrapRect){
  const el = keyEls[id] || (typeof window !== 'undefined' && window.keyEls && window.keyEls[id]) || (typeof global !== 'undefined' && global.keyEls && global.keyEls[id]);
  if(!el) return null;
  const r = el.getBoundingClientRect();
  return {
    left: r.left - wrapRect.left,
    right: r.right - wrapRect.left,
    top: r.top - wrapRect.top,
    bottom: r.bottom - wrapRect.top,
    width: r.width,
    height: r.height,
    cx: r.left + r.width/2 - wrapRect.left,
    cy: r.top + r.height/2 - wrapRect.top
  };
}

/* Kinematic Hand Builder:
   Computes natural anatomical proportions, compact metacarpal arch, and damped
   palm glide so the active finger articulates while non-active fingers stay anchored. */
function buildHand(hand, fingers, wrapRect, activeF, targetKey){
  const isLeft = hand === 'L';
  const inward = isLeft ? 1 : -1;

  // Defensive fallback: ensure right pinky is always anchored
  if(hand === 'R' && !fingers.some(f=> f.kind === 'pinky')){
    const rpDef = {id:'rp', canonicalId:'R5', hand:'R', home:'semicolon', kind:'pinky', baseW:22.5, tipW:14.0, archPull:0.22, archDy:12, tipDy:7, kDist:102, restLen:100, restAng:0.08};
    fingers.push(rpDef);
    if(!FINGERS.some(f=> f.id === 'rp')) FINGERS.push(rpDef);
  }

  const homes = {};
  fingers.forEach(f=>{
    if(f.kind === 'thumb') return;
    const c = keyCenter(f.home, wrapRect);
    if(c) homes[f.id] = c;
  });

  if(hand === 'R' && (!homes['rp'] || !fingers.some(f=> f.id === 'rp'))){
    const ring = fingers.find(f=> f.kind === 'ring');
    if(ring && homes[ring.id]){
      homes['rp'] = { x: homes[ring.id].x + 58, y: homes[ring.id].y };
    }
  }

  const order = ['pinky','ring','middle','index'].map(k=>fingers.find(f=>f.kind===k));
  if(order.some(f=> !f || !homes[f.id])) return null;

  // Dynamic Spacebar keycap geometry & bounds
  const spaceElForHand = keyEls['space'] || (typeof window !== 'undefined' && window.keyEls && window.keyEls['space']) || (typeof global !== 'undefined' && global.keyEls && global.keyEls['space']);
  let spaceBounds = null;
  let spaceCenter = null;
  if(spaceElForHand){
    const sr = spaceElForHand.getBoundingClientRect();
    if(sr.width > 0 && sr.height > 0){
      spaceBounds = {
        left: sr.left - wrapRect.left,
        right: sr.right - wrapRect.left,
        top: sr.top - wrapRect.top,
        bottom: sr.bottom - wrapRect.top,
        width: sr.width,
        height: sr.height
      };
      spaceCenter = {
        x: spaceBounds.left + spaceBounds.width * 0.5,
        y: spaceBounds.top + spaceBounds.height * 0.5
      };
    }
  }

  // Damped palm shift: applies for distant reaches (Backspace, Enter, Escape, outer numbers)
  // and natural whole-hand translation for thumb modifier reaches (Alt, AltGr)
  let palmShiftX = 0, palmShiftY = 0;
  if(activeF && activeF.kind !== 'thumb' && targetKey){
    const targetPt = keyCenter(targetKey, wrapRect);
    const homePt = keyCenter(activeF.home, wrapRect);
    if(targetPt && homePt){
      const reachDx = targetPt.x - homePt.x;
      const reachDy = targetPt.y - homePt.y;
      const isDistant = ['backspace', 'enter', 'grave', 'k1', 'k2', 'k3', 'k4', 'k5', 'k6', 'k7', 'k8', 'k9', 'k0', 'minus', 'equal', 'tab', 'escape', 'shiftL', 'shiftR'].includes(targetKey);
      const factorY = isDistant ? 0.30 : 0.12;
      const factorX = isDistant ? 0.26 : 0.10;
      palmShiftY = reachDy * factorY;
      palmShiftX = reachDx * factorX;
    }
  } else if(activeF && activeF.kind === 'thumb' && targetKey && targetKey !== 'space'){
    const targetPt = keyCenter(targetKey, wrapRect);
    if(targetPt){
      const naturalRestX = isLeft
        ? (spaceBounds ? spaceBounds.left + 24 : homes[order[3].id].x + 38)
        : (spaceBounds ? spaceBounds.right - 24 : homes[order[3].id].x - 38);
      const reachDx = targetPt.x - naturalRestX;
      const indexHomeY = homes[order[3].id] ? homes[order[3].id].y : 130;
      const reachDy = Math.max(0, targetPt.y - indexHomeY);
      // Biomechanical whole-hand glide: hand lowers and translates naturally toward Alt/AltGr
      palmShiftY = Math.max(14, reachDy * 0.35);
      const isOutwardReach = (reachDx * inward) < 0;
      palmShiftX = isOutwardReach ? (reachDx * 1.35) : (reachDx * 0.70);
    }
  }

  // Anatomical metacarpal knuckle arch at bottom row boundary for natural slender fingers
  const homeXs = order.map(f=> homes[f.id].x);
  const homeYs = order.map(f=> homes[f.id].y);
  const homeSpanCenterX = (homeXs[0] + homeXs[3]) * 0.5 + inward * 4;
  const homeAvgY = homeYs.reduce((a, b)=> a + b, 0) / 4;
  const palmArchBaseY = homeAvgY + 114;

  const baseKnuckles = {};
  order.forEach(f=>{
    const h = homes[f.id];
    const pull = typeof f.archPull === 'number' ? f.archPull : 0.20;
    const dy = typeof f.archDy === 'number' ? f.archDy : 0;
    const kx = h.x + (homeSpanCenterX - h.x) * pull + palmShiftX;
    const ky = palmArchBaseY + dy + palmShiftY;
    baseKnuckles[f.id] = { x: kx, y: ky };
  });

  const indexBase = baseKnuckles[order[3].id];

  // Resting thumb tip sits cleanly inside the Spacebar bounds,
  // completely clear of KeyV, KeyB, KeyN, and KeyM.
  let defaultThumbTip;
  if(spaceBounds && spaceCenter){
    const naturalX = indexBase.x + inward * 38;
    const clampedX = isLeft
      ? Math.max(spaceBounds.left + 24, Math.min(spaceCenter.x - 16, naturalX))
      : Math.min(spaceBounds.right - 24, Math.max(spaceCenter.x + 16, naturalX));
    defaultThumbTip = {
      x: clampedX,
      y: spaceBounds.top + spaceBounds.height * 0.46
    };
  } else {
    defaultThumbTip = {
      x: indexBase.x + inward * 38,
      y: palmArchBaseY + 18
    };
  }

  // Anatomical thumb CMC/thenar base: positioned at lower radial palm
  const thumbF = fingers.find(f=>f.kind==='thumb');
  const isModifierThumb = Boolean(activeF && activeF.kind === 'thumb' && targetKey && targetKey !== 'space');
  const thumbBase = {
    x: indexBase.x + (isModifierThumb ? -inward * 8 : inward * 14),
    y: palmArchBaseY + (isModifierThumb ? 24 : 36) + palmShiftY
  };
  baseKnuckles[thumbF.id] = thumbBase;

  return {
    bases: baseKnuckles,
    homes,
    order,
    thumbF,
    defaultThumbTip,
    spaceBounds,
    spaceCenter,
    palmShiftX,
    palmShiftY
  };
}

/* Generates a single unified, mirror-symmetric SVG contour tracing the entire human hand
   (pinky -> ring -> middle -> index -> purlicue web -> thumb -> radial wrist -> ulnar wrist) */
function buildUnifiedHandSVG(hand, order, thumbF, frames, bases){
  const isLeft = hand === 'L';
  const dir = isLeft ? 1 : -1;
  const n = (frames[order[0].id] && frames[order[0].id].left) ? frames[order[0].id].left.length - 1 : 20;

  const fingerList = order.map(f => {
    const fr = frames[f.id];
    return {
      f,
      fr,
      outerPts: isLeft ? fr.left : fr.right,
      innerPts: isLeft ? fr.right : fr.left
    };
  });

  const thumbFr = frames[thumbF.id];
  const idxInnerPt = fingerList[3].innerPts[4];
  // Dynamically resolve topological inner vs outer thumb contours based on proximity to index purlicue web
  const dLeftToIdx = Math.hypot(thumbFr.left[4].x - idxInnerPt.x, thumbFr.left[4].y - idxInnerPt.y);
  const dRightToIdx = Math.hypot(thumbFr.right[4].x - idxInnerPt.x, thumbFr.right[4].y - idxInnerPt.y);
  const thumbInnerPts = dLeftToIdx <= dRightToIdx ? thumbFr.left : thumbFr.right;
  const thumbOuterPts = dLeftToIdx <= dRightToIdx ? thumbFr.right : thumbFr.left;

  const pinkyBase = bases[order[0].id];
  const indexBase = bases[order[3].id];

  const cmds = [];
  const p0 = fingerList[0].outerPts[2];
  cmds.push(`M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)}`);

  for(let fIdx = 0; fIdx < 4; fIdx++){
    const curr = fingerList[fIdx];
    const { outerPts, innerPts, fr, f } = curr;
    const startI = (fIdx === 0) ? 2 : 4;
    for(let i = startI + 1; i <= n; i++){
      cmds.push(`L ${outerPts[i].x.toFixed(1)} ${outerPts[i].y.toFixed(1)}`);
    }
    cmds.push(tipCapBetween(outerPts[n], innerPts[n], fr.tipTan, f.tipW, false));

    const endI = 4;
    for(let i = n - 1; i >= endI; i--){
      cmds.push(`L ${innerPts[i].x.toFixed(1)} ${innerPts[i].y.toFixed(1)}`);
    }

    if(fIdx < 3){
      const next = fingerList[fIdx + 1];
      const nextStartI = 4;
      const pA = innerPts[endI];
      const pB = next.outerPts[nextStartI];
      const crotchDepth = 15.0;
      const midX = (pA.x + pB.x) * 0.5;
      const midY = Math.max(pA.y, pB.y) + crotchDepth;
      const wc1 = { x: pA.x + (midX - pA.x) * 0.35, y: midY };
      const wc2 = { x: pB.x - (pB.x - midX) * 0.35, y: midY };
      cmds.push(`C ${wc1.x.toFixed(1)} ${wc1.y.toFixed(1)} ${wc2.x.toFixed(1)} ${wc2.y.toFixed(1)} ${pB.x.toFixed(1)} ${pB.y.toFixed(1)}`);
    }
  }

  // Purlicue (thumb-index web): smooth U-saddle from index inner base to thumb inner edge
  const idxInnerEnd = fingerList[3].innerPts[4];
  const thumbInnerStartIdx = 8;
  const thumbInnerStart = thumbInnerPts[thumbInnerStartIdx];
  const webMidY = Math.max(idxInnerEnd.y, thumbInnerStart.y) + 7;
  const webC1 = { x: idxInnerEnd.x + dir * 2, y: webMidY - 2 };
  const webC2 = { x: thumbInnerStart.x - dir * 10, y: webMidY + 3 };
  cmds.push(`C ${webC1.x.toFixed(1)} ${webC1.y.toFixed(1)} ${webC2.x.toFixed(1)} ${webC2.y.toFixed(1)} ${thumbInnerStart.x.toFixed(1)} ${thumbInnerStart.y.toFixed(1)}`);

  // Thumb inner edge -> tip -> thumb outer edge (down to CMC joint)
  for(let i = thumbInnerStartIdx + 1; i <= n; i++){
    cmds.push(`L ${thumbInnerPts[i].x.toFixed(1)} ${thumbInnerPts[i].y.toFixed(1)}`);
  }
  cmds.push(tipCapBetween(thumbInnerPts[n], thumbOuterPts[n], thumbFr.tipTan, thumbF.tipW, true));

  const thumbOuterEndIdx = 2;
  for(let i = n - 1; i >= thumbOuterEndIdx; i--){
    cmds.push(`L ${thumbOuterPts[i].x.toFixed(1)} ${thumbOuterPts[i].y.toFixed(1)}`);
  }

  // Seamless transition from thumb CMC outer edge into wide anatomical wrist
  const thumbOuterBase = thumbOuterPts[thumbOuterEndIdx];
  const wristCenterX = (pinkyBase.x + indexBase.x) * 0.5 + dir * 4;
  const wristY = Math.max(indexBase.y + 98, bases[thumbF.id] ? bases[thumbF.id].y + 18 : indexBase.y + 98);

  const wristInner = { x: wristCenterX + dir * 48, y: wristY - 2 };
  const wristOuter = { x: wristCenterX - dir * 56, y: wristY };

  const radC1 = { x: thumbOuterBase.x - dir * 12, y: thumbOuterBase.y + 12 };
  const radC2 = { x: wristInner.x + dir * 8, y: wristInner.y - 12 };
  cmds.push(`C ${radC1.x.toFixed(1)} ${radC1.y.toFixed(1)} ${radC2.x.toFixed(1)} ${radC2.y.toFixed(1)} ${wristInner.x.toFixed(1)} ${wristInner.y.toFixed(1)}`);

  const wristCtrl1 = { x: wristInner.x - dir * 26, y: wristY + 8 };
  const wristCtrl2 = { x: wristOuter.x + dir * 26, y: wristY + 8 };
  cmds.push(`C ${wristCtrl1.x.toFixed(1)} ${wristCtrl1.y.toFixed(1)} ${wristCtrl2.x.toFixed(1)} ${wristCtrl2.y.toFixed(1)} ${wristOuter.x.toFixed(1)} ${wristOuter.y.toFixed(1)}`);

  const ulnC1 = { x: wristOuter.x - dir * 8, y: wristOuter.y - 28 };
  const ulnC2 = { x: p0.x - dir * 4, y: p0.y + 30 };
  cmds.push(`C ${ulnC1.x.toFixed(1)} ${ulnC1.y.toFixed(1)} ${ulnC2.x.toFixed(1)} ${ulnC2.y.toFixed(1)} ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} Z`);

  // Subtle dorsal extensor tendon lines
  const shadePath = [0, 1, 2, 3].map(idx => {
    const kb = bases[order[idx].id];
    const ex = kb.x + (wristCenterX - kb.x) * 0.44;
    const ey = kb.y + 44;
    return `M ${kb.x.toFixed(1)} ${(kb.y + 6).toFixed(1)} L ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  }).join(' ');

  const highlight = {
    cx: wristCenterX,
    cy: (pinkyBase.y + wristY) * 0.48,
    rx: 44,
    ry: 30
  };

  return {
    palmPath: cmds.join(' '),
    shadePath,
    highlight,
    core: { x: wristCenterX, y: (pinkyBase.y + wristY) * 0.52 }
  };
}

let handAnimFrame = null;
const currentFingerPositions = {}; // id -> { x, y }
const targetFingerPositions = {};  // id -> { x, y }
const fingerBiomechanicalStates = {}; // id -> state string

FINGERS.forEach(f => {
  fingerBiomechanicalStates[f.id] = HAND_STATES.HOME_REST;
});

function recalibrateCoordinates(){
  if(!boardWrap || !handsOverlay) return;
  const wrapRect = boardWrap.getBoundingClientRect();
  if(!wrapRect.width || !wrapRect.height) return;
  handsOverlay.setAttribute('viewBox', `0 0 ${wrapRect.width} ${wrapRect.height}`);
  handsOverlay.setAttribute('width', wrapRect.width);
  handsOverlay.setAttribute('height', wrapRect.height);
}

function updateHandsOverlay(){
  if(!handsOverlay) return;
  if(!handsOn || HAND_CONFIG.overlayMode === 'hidden'){
    handsOverlay.classList.add('hidden');
    handsOverlay.style.display = 'none';
    return;
  }
  handsOverlay.classList.remove('hidden');
  handsOverlay.style.display = '';
  handsOverlay.classList.toggle('mode-ghost', HAND_CONFIG.overlayMode === 'ghost');

  const wrapRect = boardWrap.getBoundingClientRect();
  if(!wrapRect.width || !wrapRect.height) return;
  handsOverlay.setAttribute('viewBox', `0 0 ${wrapRect.width} ${wrapRect.height}`);
  handsOverlay.setAttribute('width', wrapRect.width);
  handsOverlay.setAttribute('height', wrapRect.height);

  // Safeguard: guarantee right pinky is always present in FINGERS and DOM
  if(!FINGERS.some(f => f.id === 'rp')){
    const rpDef = {id:'rp', canonicalId:'R5', hand:'R', home:'semicolon', kind:'pinky', baseW:22.5, tipW:14.0, archPull:0.22, archDy:12, tipDy:7, kDist:102, restLen:100, restAng:0.08};
    FINGERS.push(rpDef);
  }
  if(!fingerEls['rp']){
    const rpDef = FINGERS.find(f => f.id === 'rp') || {id:'rp', canonicalId:'R5', hand:'R', home:'semicolon', kind:'pinky', baseW:22.5, tipW:14.0, archPull:0.22, archDy:12, tipDy:7, kDist:102, restLen:100, restAng:0.08};
    createFingerElement(rpDef);
  }

  const leftFingers = FINGERS.filter(f=>f.hand==='L');
  const rightFingers = FINGERS.filter(f=>f.hand==='R');

  // Check if a physical modifier key (Shift, AltGr, Alt, Ctrl) is currently held down
  const heldLeftMod = Array.from(heldPhysicalModifiers).find(k => KEY_FINGER[k] && KEY_FINGER[k].startsWith('l'));
  const heldRightMod = Array.from(heldPhysicalModifiers).find(k => KEY_FINGER[k] && KEY_FINGER[k].startsWith('r'));

  let activeLeft = null;
  let targetLeft = null;
  if(heldLeftMod){
    const fid = KEY_FINGER[heldLeftMod];
    activeLeft = leftFingers.find(f => f.id === fid);
    targetLeft = heldLeftMod;
  } else if(activeFinger && leftFingers.some(f => f.id === activeFinger)){
    activeLeft = leftFingers.find(f => f.id === activeFinger);
    targetLeft = activeTargetKey;
  } else if(activeShiftFinger && leftFingers.some(f => f.id === activeShiftFinger)){
    activeLeft = leftFingers.find(f => f.id === activeShiftFinger);
    targetLeft = activeShiftTargetKey;
  }

  let activeRight = null;
  let targetRight = null;
  if(heldRightMod){
    const fid = KEY_FINGER[heldRightMod];
    activeRight = rightFingers.find(f => f.id === fid);
    targetRight = heldRightMod;
  } else if(activeFinger && rightFingers.some(f => f.id === activeFinger)){
    activeRight = rightFingers.find(f => f.id === activeFinger);
    targetRight = activeTargetKey;
  } else if(activeShiftFinger && rightFingers.some(f => f.id === activeShiftFinger)){
    activeRight = rightFingers.find(f => f.id === activeShiftFinger);
    targetRight = activeShiftTargetKey;
  }

  const handL = buildHand('L', leftFingers, wrapRect, activeLeft, targetLeft);
  const handR = buildHand('R', rightFingers, wrapRect, activeRight, targetRight);

  // Compute target tip positions for each finger
  FINGERS.forEach(f=>{
    const hb = f.hand === 'L' ? handL : handR;
    if(!hb || !hb.bases[f.id]) return;
    const isLeftActive = f.hand === 'L' && activeLeft && activeLeft.id === f.id;
    const isRightActive = f.hand === 'R' && activeRight && activeRight.id === f.id;
    const isActive = Boolean(isLeftActive || isRightActive);
    const targetKey = f.hand === 'L' ? targetLeft : targetRight;

    let targetPt;
    if(f.kind === 'thumb'){
      if(isActive && targetKey && targetKey !== 'space'){
        const rawTip = keyCenter(targetKey, wrapRect);
        targetPt = rawTip ? { x: rawTip.x, y: rawTip.y } : hb.defaultThumbTip;
      } else {
        targetPt = hb.defaultThumbTip;
      }
    } else {
      const homeCenter = hb.homes[f.id] || keyCenter(f.home, wrapRect);
      // Non-active fingers remain anchored near their home keys, with natural translation when the hand moves
      const floatX = hb.palmShiftX ? hb.palmShiftX * 0.70 : 0;
      const floatY = hb.palmShiftY ? hb.palmShiftY * 0.50 : 0;
      const restTip = homeCenter
        ? { x: homeCenter.x + floatX, y: homeCenter.y + (f.tipDy || 0) + floatY }
        : { x: hb.bases[f.id].x, y: hb.bases[f.id].y - 74 };

      if(isActive && targetKey){
        const rawTarget = keyCenter(targetKey, wrapRect);
        targetPt = rawTarget ? { x: rawTarget.x, y: rawTarget.y + 2 } : restTip;
      } else {
        targetPt = restTip;
      }
    }

    targetFingerPositions[f.id] = targetPt;

    // Check reduced motion
    const prefersReducedMotion = HAND_CONFIG.reducedMotion ||
      (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    if(prefersReducedMotion || !currentFingerPositions[f.id]){
      currentFingerPositions[f.id] = { x: targetPt.x, y: targetPt.y };
    }

    // Update biomechanical state
    const isHeldMod = (f.hand === 'L' && heldLeftMod && activeLeft && activeLeft.id === f.id) ||
                      (f.hand === 'R' && heldRightMod && activeRight && activeRight.id === f.id);
    if(isHeldMod || (activeShiftFinger === f.id)){
      fingerBiomechanicalStates[f.id] = HAND_STATES.HOLDING;
    } else if((activeFinger === f.id)){
      fingerBiomechanicalStates[f.id] = HAND_STATES.REACHING;
    } else if(fingerBiomechanicalStates[f.id] !== HAND_STATES.PRESSING){
      fingerBiomechanicalStates[f.id] = HAND_STATES.HOME_REST;
    }
  });

  renderFrame(handL, handR, wrapRect);
}

function renderFrame(handL, handR, wrapRect){
  const framesL = {};
  const framesR = {};
  let needsAnim = false;

  const prefersReducedMotion = HAND_CONFIG.reducedMotion ||
    (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  FINGERS.forEach(f=>{
    const fe = fingerEls[f.id];
    const hb = f.hand === 'L' ? handL : handR;
    if(!fe || !hb || !hb.bases[f.id]) return;
    const origin = hb.bases[f.id];
    const isPrimary = activeFinger === f.id;
    const isShiftActive = activeShiftFinger === f.id;
    const isHeld = Boolean(heldPhysicalModifiers && Array.from(heldPhysicalModifiers).some(k => KEY_FINGER[k] === f.id));
    const isActive = isPrimary || isShiftActive || isHeld;
    const inward = f.hand === 'L' ? 1 : -1;

    let cur = currentFingerPositions[f.id];
    const target = targetFingerPositions[f.id] || cur;

    if(!prefersReducedMotion && cur && target){
      const dx = target.x - cur.x;
      const dy = target.y - cur.y;
      if(Math.abs(dx) > 0.4 || Math.abs(dy) > 0.4){
        cur.x += dx * 0.32;
        cur.y += dy * 0.32;
        needsAnim = true;
      } else {
        cur.x = target.x;
        cur.y = target.y;
      }
    } else if(target){
      cur = { x: target.x, y: target.y };
      currentFingerPositions[f.id] = cur;
    }

    let tip = cur ? { x: cur.x, y: cur.y } : (target || origin);

    // Physiological maximum reach limit
    const maxLen = f.kind === 'thumb' ? 115 : (f.kind === 'pinky' ? 185 : (f.kind === 'middle' ? 210 : 200));
    const d = dist(origin, tip);
    if(d > maxLen){
      const scale = maxLen / d;
      tip = { x: origin.x + (tip.x - origin.x) * scale, y: origin.y + (tip.y - origin.y) * scale };
    }

    const { p1, p2 } = computeFingerControlPoints(origin, tip, f.kind, inward);
    const frame = fingerFrame(origin, p1, p2, tip, f.baseW, f.tipW, f.kind === 'thumb');
    if(f.hand === 'L') framesL[f.id] = frame;
    else framesR[f.id] = frame;

    fe.shape.setAttribute('d', frameToPath(frame, f.baseW, f.tipW));

    if(f.kind === 'thumb'){
      fe.crease1.setAttribute('d', '');
      fe.crease2.setAttribute('d', '');
    } else {
      fe.crease1.setAttribute('d', creaseAt(frame, 0.49));
      fe.crease2.setAttribute('d', creaseAt(frame, 0.79));
    }
    fe.joint1.setAttribute('r', '0');
    fe.joint2.setAttribute('r', '0');

    fe.shine.setAttribute('d', '');
    fe.shine2.setAttribute('d', '');
    fe.energy.setAttribute('d', '');
    fe.nail.setAttribute('d', '');

    const padPt = cPoint(origin, p1, p2, tip, 0.94);
    fe.tip.setAttribute('cx', padPt.x.toFixed(1));
    fe.tip.setAttribute('cy', padPt.y.toFixed(1));
    fe.impactRing.setAttribute('cx', padPt.x.toFixed(1));
    fe.impactRing.setAttribute('cy', padPt.y.toFixed(1));
    fe.impactRing2.setAttribute('cx', padPt.x.toFixed(1));
    fe.impactRing2.setAttribute('cy', padPt.y.toFixed(1));
    fe.impactSparks.setAttribute('transform', `translate(${padPt.x.toFixed(1)} ${padPt.y.toFixed(1)})`);
    fe.reticle.setAttribute('transform', `translate(${padPt.x.toFixed(1)} ${padPt.y.toFixed(1)})`);
    fe.g.classList.toggle('active', isActive);
  });

  if(handL && Object.keys(framesL).length === 5){
    const svgL = buildUnifiedHandSVG('L', handL.order, handL.thumbF, framesL, handL.bases);
    palmShapeL.setAttribute('d', svgL.palmPath);
    palmShadeL.setAttribute('d', svgL.shadePath);
    palmHiL.setAttribute('cx', svgL.highlight.cx); palmHiL.setAttribute('cy', svgL.highlight.cy);
    palmHiL.setAttribute('rx', svgL.highlight.rx); palmHiL.setAttribute('ry', svgL.highlight.ry);
    palmCoreL.setAttribute('cx', svgL.core.x); palmCoreL.setAttribute('cy', svgL.core.y);
  }
  if(handR && Object.keys(framesR).length === 5){
    const svgR = buildUnifiedHandSVG('R', handR.order, handR.thumbF, framesR, handR.bases);
    palmShapeR.setAttribute('d', svgR.palmPath);
    palmShadeR.setAttribute('d', svgR.shadePath);
    palmHiR.setAttribute('cx', svgR.highlight.cx); palmHiR.setAttribute('cy', svgR.highlight.cy);
    palmHiR.setAttribute('rx', svgR.highlight.rx); palmHiR.setAttribute('ry', svgR.highlight.ry);
    palmCoreR.setAttribute('cx', svgR.core.x); palmCoreR.setAttribute('cy', svgR.core.y);
  }

  if(needsAnim && typeof window !== 'undefined' && window.requestAnimationFrame){
    if(handAnimFrame) cancelAnimationFrame(handAnimFrame);
    handAnimFrame = requestAnimationFrame(() => renderFrame(handL, handR, wrapRect));
  } else {
    handAnimFrame = null;
  }
}

function setActiveFinger(keyId, layer){
  activeFinger = keyId ? (KEY_FINGER[keyId] || null) : null;
  activeTargetKey = keyId;
  const lyr = layer || (keyId ? currentLayer() : null);
  const mod = modifierInfoFor(keyId, lyr);
  if(mod){
    activeShiftFinger = mod.fingerId;
    activeShiftTargetKey = mod.targetKey;
  } else {
    activeShiftFinger = null;
    activeShiftTargetKey = null;
  }
  updateHandsOverlay();
}

/* the instant a key is struck: flashes the finger and sends a bright
   expanding ring burst out from the fingertip */
function strikeFinger(fe){
  if(!fe || !handsOn) return;
  fe.g.classList.remove('struck');
  void fe.g.getBoundingClientRect(); // restart animation
  fe.g.classList.add('struck');
  fe.g.classList.add('pressed');
  clearTimeout(fe._strikeT1);
  fe._strikeT1 = setTimeout(()=> {
    fe.g.classList.remove('struck');
  }, 220);
}

/* fired the instant a key is struck */
let freeTypeFingerResetTimer = null;
function triggerFingerPress(keyId){
  if(!handsOn) return;
  const fid = keyId ? KEY_FINGER[keyId] : null;
  if(!fid) return;
  const lyr = currentLayer();

  const isGuidedSession = (typeof lessonActive !== 'undefined' && lessonActive) ||
                          (typeof raceActive !== 'undefined' && raceActive) ||
                          (typeof window !== 'undefined' && Boolean(window.adaptiveActive));
  const isModifier = ['shiftL', 'shiftR', 'ctrlL', 'ctrlR', 'alt', 'altgr', 'win'].includes(keyId);
  if(!isGuidedSession && !isModifier){
    setActiveFinger(keyId, lyr);
    clearTimeout(freeTypeFingerResetTimer);
    freeTypeFingerResetTimer = setTimeout(()=>{
      const stillUnguided = !(typeof lessonActive !== 'undefined' && lessonActive) &&
                            !(typeof raceActive !== 'undefined' && raceActive) &&
                            (typeof window !== 'undefined' ? !window.adaptiveActive : true);
      if(stillUnguided && activeTargetKey === keyId){
        setActiveFinger(null);
      }
    }, 650);
  }

  fingerBiomechanicalStates[fid] = HAND_STATES.PRESSING;
  strikeFinger(fingerEls[fid]);

  if(lyr && lyr !== 'base'){
    const mod = modifierInfoFor(keyId, lyr);
    if(mod && mod.fingerId && mod.fingerId !== fid){
      fingerBiomechanicalStates[mod.fingerId] = HAND_STATES.HOLDING;
      strikeFinger(fingerEls[mod.fingerId]);
    }
  }

  // Update last keystroke hand for alternating spacebar mode
  const fDef = FINGERS.find(f => f.id === fid);
  if(fDef){
    HAND_CONFIG.lastKeystrokeHand = fDef.hand;
  }
}
if(typeof window !== 'undefined') window.triggerFingerPress = triggerFingerPress;

function triggerFingerRelease(keyId){
  if(!handsOn) return;
  const fid = keyId ? KEY_FINGER[keyId] : null;
  if(!fid) return;
  const fe = fingerEls[fid];
  if(fe){
    fe.g.classList.remove('struck');
    fe.g.classList.remove('pressed');
  }
  fingerBiomechanicalStates[fid] = HAND_STATES.RELEASING;
  const el = keyEls[keyId];
  if(el){
    el.classList.remove('pressed');
  }
}
if(typeof window !== 'undefined') window.triggerFingerRelease = triggerFingerRelease;

if(typeof ResizeObserver !== 'undefined' && boardWrap){
  const ro = new ResizeObserver(()=>{
    recalibrateCoordinates();
    updateHandsOverlay();
  });
  ro.observe(boardWrap);
}

function syncHandsToggleUI(){
  if(!handsToggle) return;
  window.handsOn = handsOn;
  handsToggle.classList.toggle('on', handsOn);
  handsToggle.setAttribute('aria-pressed', handsOn ? 'true' : 'false');
  const isKm = document.documentElement.classList.contains('site-km-mode');
  const enText = 'Finger guide' + (handsOn ? '' : ' (off)');
  const kmText = 'មគ្គុទ្ទេសក៍ម្រាមដៃ' + (handsOn ? '' : ' (បិទ)');
  handsToggle.innerHTML = `${pkIcon('keyboard', 15)} <span class="i18n-t" data-en="${enText}" data-km="${kmText}">${isKm ? kmText : enText}</span>`;
  if(window.PKQuickGuide && typeof window.PKQuickGuide.updateToolStatuses === 'function'){
    window.PKQuickGuide.updateToolStatuses();
  }
}
if(typeof window !== 'undefined') window.syncHandsToggleUI = syncHandsToggleUI;

if(handsToggle){
  handsToggle.addEventListener('click', ()=>{
    handsOn = !handsOn;
    syncHandsToggleUI();
    updateHandsOverlay();
  });
}

if(typeof window !== 'undefined'){
  window.addEventListener('resize', updateHandsOverlay);
}


function currentLayer(){
  return physicalLayer || hoverLayer || lockedLayer || 'base';
}

let lastLayer;

function render(){
  const layer = currentLayer();
  lastLayer = layer;

  document.querySelectorAll('.glyph').forEach(g=>{
    const val = g.dataset[layer] !== undefined ? g.dataset[layer] : g.dataset.base;
    if(g.textContent !== val) g.textContent = val;
    g.parentElement.classList.toggle('empty', !val);
  });

  const spaceEl = keyEls['space'];
  if(spaceEl){
    if(currentLayoutId === 'standard'){
      if(layer === 'shift'){
        spaceEl.innerHTML = '<span class="space-glyph">␣</span><span class="space-label">ដកឃ្លា · Space</span>';
      } else {
        spaceEl.innerHTML = '<span class="space-glyph">្</span><span class="space-label">ជើង (Coeng)</span><span class="shift-badge">Space</span>';
      }
    } else if(currentLayoutId === 'nida'){
      if(layer === 'shift'){
        spaceEl.innerHTML = '<span class="space-glyph">␣</span><span class="space-label">ដកឃ្លា · Space</span>';
      } else {
        spaceEl.innerHTML = '<span class="space-glyph">␣</span><span class="space-label">ដកឃ្លា · Spacebar</span>';
      }
    } else {
      spaceEl.innerHTML = '<span class="space-label">Space</span>';
    }
  }

  boardWrap.classList.toggle('layer-ctrl', layer === 'ctrl');
  boardWrap.classList.toggle('layer-altgr', layer === 'altgr');
  boardWrap.classList.toggle('layer-shift', layer === 'shift');

  document.querySelectorAll('[data-pill]').forEach(p=>{
    p.classList.toggle('active', p.dataset.pill === layer);
  });

  document.querySelectorAll('.key-ctrl').forEach(el=> el.classList.toggle('locked', lockedLayer==='ctrl'));
  document.querySelectorAll('.key-altgr').forEach(el=> el.classList.toggle('locked', lockedLayer==='altgr'));
  document.querySelectorAll('.key-shift').forEach(el=> el.classList.toggle('locked', lockedLayer==='shift'));
}


function applyKeyboardData(data){
  if(!data) return;
  if(data.LAYOUTS) {
    Object.assign(LAYOUTS, data.LAYOUTS);
    ['standard', 'nida', 'english'].forEach(l => {
      if(LAYOUTS[l] && LAYOUTS[l].rows && LAYOUTS[l].rows[4]){
        const sp = LAYOUTS[l].rows[4].find(k => k.id === 'space');
        if(sp && !sp.wide) sp.wide = 8.25;
      }
    });
  }
  if(data.KEY_FINGER) Object.assign(KEY_FINGER, data.KEY_FINGER);
  if(data.CODE_MAP) Object.assign(CODE_MAP, data.CODE_MAP);
}
if(typeof window !== 'undefined'){
  window.renderHands = updateHandsOverlay;
  window.updateHandsOverlay = updateHandsOverlay;
}

if(typeof module !== 'undefined' && module.exports){
  module.exports = {
    LAYOUTS,
    CODE_MAP,
    KEY_FINGER,
    FINGERS,
    CANONICAL_FINGER_MAP,
    FINGER_CODE_TO_CANONICAL,
    CANONICAL_TO_FINGER_CODE,
    HAND_CONFIG,
    HAND_STATES,
    toCanonicalFinger,
    toLegacyFinger,
    getFingerForKey,
    resolveModifierChoreography,
    decomposeKhmerSequence,
    buildHand,
    keyCenter,
    keyBounds,
    updateHandsOverlay,
    setActiveFinger,
    triggerFingerPress,
    triggerFingerRelease,
    modifierInfoFor,
    setKeyElements,
    setPhysicalModifierHeld,
    clearAllPhysicalModifiersHeld,
    computeFingerControlPoints,
    fingerFrame,
    cPoint,
    cTangent
  };
}
