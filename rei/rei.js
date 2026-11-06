/* PK Khmer Type Rei — Focused Traditional Typing Tutor Engine */
/* Strict Zero-Emoji Compliance: Pure SVG vector icons only */

(function () {
  'use strict';

  /* ============================================================
     1. Key Data & Layouts Definition
     ============================================================ */
  const KEY = (id, base, ctrl, altgr, shift) => ({ id, base, ctrl, altgr, shift, kind: 'glyph' });

  const ROW1 = [
    KEY('grave', '', '฿', '◎', ''),
    KEY('k1', '១', '₭', '1', '!'),
    KEY('k2', '២', '€', '2', 'ៗ'),
    KEY('k3', '៣', 'đ', '3', '"'),
    KEY('k4', '៤', '₣', '4', '៛'),
    KEY('k5', '៥', '¥', '5', '%'),
    KEY('k6', '៦', '', '6', '៍'),
    KEY('k7', '៧', '£', '7', '័'),
    KEY('k8', '៨', '', '8', '៏'),
    KEY('k9', '៩', '', '9', '៎'),
    KEY('k0', '០', '—', '0', '៌'),
    KEY('minus', '-', '•', '{', '_'),
    KEY('equal', '=', '', '}', '+'),
    { id: 'backspace', kind: 'mod', label: 'Backsp.', wide: 2 }
  ];

  const ROW2 = [
    { id: 'tab', kind: 'mod', label: 'Tab', wide: 1.5 },
    KEY('q', 'ឆ', '', '*', 'ឈ'),
    KEY('w', 'ឹ', '', '', 'ឺ'),
    KEY('e', 'េ', '', 'ឯ', 'ែ'),
    KEY('r', 'រ', '', 'ឫ', 'ឬ'),
    KEY('t', 'ត', '', 'ឰ', 'ទ'),
    KEY('y', 'យ', '', '', 'ួ'),
    KEY('u', 'ុ', '', 'ឧ', 'ូ'),
    KEY('i', 'ិ', '', 'ឦ', 'ី'),
    KEY('o', 'ោ', '', 'ឱ', 'ៅ'),
    KEY('p', 'ផ', '', 'ឳ', 'ភ'),
    KEY('bracketL', 'ៀ', '', '[', 'ឿ'),
    KEY('bracketR', 'ឪ', '', ']', 'ឧ'),
    KEY('backslash', '\\', '', '\\', '|')
  ];

  const ROW3 = [
    { id: 'caps', kind: 'mod', label: 'Caps', wide: 1.75 },
    KEY('a', 'ា', '', 'ឩ', 'ាំ'),
    KEY('s', 'ស', '', 'ស', 'ៃ'),
    KEY('d', 'ដ', '', 'ឌ', 'ឌ'),
    KEY('f', 'ថ', '', 'ធ', 'ឋ'),
    KEY('g', 'ង', '', 'ឝ', 'អ'),
    KEY('h', 'ហ', '', 'ះ', 'ះ'),
    KEY('j', 'ញ', '', '', 'ញ'),
    KEY('k', 'ក', '', 'គ', 'ខ'),
    KEY('l', 'ល', '', 'ឭ', 'ឡ'),
    KEY('semicolon', 'ើ', '', ';', 'ើ'),
    KEY('quote', '់', '', "'", '៉'),
    { id: 'enter', kind: 'mod', label: 'Enter', wide: 2.25 }
  ];

  const ROW4 = [
    { id: 'shiftL', kind: 'mod', label: 'Shift', wide: 2.25 },
    KEY('z', 'ឋ', '', 'ឍ', 'ឍ'),
    KEY('x', 'ខ', '', 'ឃ', 'ឃ'),
    KEY('c', 'ច', '', 'ជ', 'ជ'),
    KEY('v', 'វ', '', 'ឞ', 'វ'),
    KEY('b', 'ប', '', 'ព', 'ព'),
    KEY('n', 'ន', '', 'ណ', 'ណ'),
    KEY('m', 'ម', '', 'ម', 'ំ'),
    KEY('comma', 'ក', '', '<', 'គ'),
    KEY('period', '។', '', '>', '៕'),
    KEY('slash', '៊', '', '?', '៘'),
    { id: 'shiftR', kind: 'mod', label: 'Shift', wide: 2.75 }
  ];

  const ROW5 = [
    { id: 'ctrlL', kind: 'mod', label: 'Ctrl', wide: 1.5 },
    { id: 'alt', kind: 'mod', label: 'Alt', wide: 1.25 },
    { id: 'space', kind: 'mod', label: 'Spacebar', wide: 6.5 },
    { id: 'altgr', kind: 'mod', label: 'AltGr', wide: 1.25 },
    { id: 'ctrlR', kind: 'mod', label: 'Ctrl', wide: 1.5 }
  ];

  /* NiDA Layout */
  const ROW1_NIDA = [
    KEY('grave', '`', '', '', '~'),
    KEY('k1', '១', '', '1', '!'),
    KEY('k2', '២', '', '2', '@'),
    KEY('k3', '៣', '', '3', '#'),
    KEY('k4', '៤', '', '4', '$'),
    KEY('k5', '៥', '', '5', '%'),
    KEY('k6', '៦', '', '6', '^'),
    KEY('k7', '៧', '', '7', '&'),
    KEY('k8', '៨', '', '8', '*'),
    KEY('k9', '៩', '', '9', '('),
    KEY('k0', '០', '', '0', ')'),
    KEY('minus', '-', '', '', '_'),
    KEY('equal', '=', '', '', '+'),
    { id: 'backspace', kind: 'mod', label: 'Backsp.', wide: 2 }
  ];

  const ROW2_NIDA = [
    { id: 'tab', kind: 'mod', label: 'Tab', wide: 1.5 },
    KEY('q', 'ឆ', '', '', 'ឈ'),
    KEY('w', 'ឹ', '', '', 'ឺ'),
    KEY('e', 'េ', '', '', 'ែ'),
    KEY('r', 'រ', '', '', 'ឫ'),
    KEY('t', 'ត', '', '', 'ទ'),
    KEY('y', 'យ', '', '', 'ួ'),
    KEY('u', 'ុ', '', '', 'ូ'),
    KEY('i', 'ិ', '', '', 'ី'),
    KEY('o', 'ោ', '', '', 'ៅ'),
    KEY('p', 'ផ', '', '', 'ភ'),
    KEY('bracketL', 'ៀ', '', '[', '{'),
    KEY('bracketR', 'ឪ', '', ']', '}'),
    KEY('backslash', '\\', '', '\\', '|')
  ];

  const ROW3_NIDA = [
    { id: 'caps', kind: 'mod', label: 'Caps', wide: 1.75 },
    KEY('a', 'ា', '', '', 'ាំ'),
    KEY('s', 'ស', '', '', 'ៃ'),
    KEY('d', 'ដ', '', '', 'ឌ'),
    KEY('f', 'ថ', '', '', 'ធ'),
    KEY('g', 'ង', '', '', 'អ'),
    KEY('h', 'ហ', '', '', 'ះ'),
    KEY('j', 'ញ', '', '', 'ញ្ញ'),
    KEY('k', 'ក', '', '', 'ខ'),
    KEY('l', 'ល', '', '', 'ឡ'),
    KEY('semicolon', 'ើ', '', ';', ':'),
    KEY('quote', '់', '', "'", '"'),
    { id: 'enter', kind: 'mod', label: 'Enter', wide: 2.25 }
  ];

  const ROW4_NIDA = [
    { id: 'shiftL', kind: 'mod', label: 'Shift', wide: 2.25 },
    KEY('z', 'ឋ', '', '', 'ឍ'),
    KEY('x', 'ខ', '', '', 'ឃ'),
    KEY('c', 'ច', '', '', 'ជ'),
    KEY('v', 'វ', '', '', 'ឞ'),
    KEY('b', 'ប', '', '', 'ព'),
    KEY('n', 'ន', '', '', 'ណ'),
    KEY('m', 'ម', '', '', 'ំ'),
    KEY('comma', 'ក', '', '<', ','),
    KEY('period', '។', '', '>', '.'),
    KEY('slash', '៊', '', '?', '/'),
    { id: 'shiftR', kind: 'mod', label: 'Shift', wide: 2.75 }
  ];

  /* English Layout */
  const ROW1_EN = [
    KEY('grave', '`', '', '', '~'),
    KEY('k1', '1', '', '', '!'),
    KEY('k2', '2', '', '', '@'),
    KEY('k3', '3', '', '', '#'),
    KEY('k4', '4', '', '', '$'),
    KEY('k5', '5', '', '', '%'),
    KEY('k6', '6', '', '', '^'),
    KEY('k7', '7', '', '', '&'),
    KEY('k8', '8', '', '', '*'),
    KEY('k9', '9', '', '', '('),
    KEY('k0', '0', '', '', ')'),
    KEY('minus', '-', '', '', '_'),
    KEY('equal', '=', '', '', '+'),
    { id: 'backspace', kind: 'mod', label: 'Backsp.', wide: 2 }
  ];

  const ROW2_EN = [
    { id: 'tab', kind: 'mod', label: 'Tab', wide: 1.5 },
    KEY('q', 'q', '', '', 'Q'),
    KEY('w', 'w', '', '', 'W'),
    KEY('e', 'e', '', '', 'E'),
    KEY('r', 'r', '', '', 'R'),
    KEY('t', 't', '', '', 'T'),
    KEY('y', 'y', '', '', 'Y'),
    KEY('u', 'u', '', '', 'U'),
    KEY('i', 'i', '', '', 'I'),
    KEY('o', 'o', '', '', 'O'),
    KEY('p', 'p', '', '', 'P'),
    KEY('bracketL', '[', '', '', '{'),
    KEY('bracketR', ']', '', '', '}'),
    KEY('backslash', '\\', '', '', '|')
  ];

  const ROW3_EN = [
    { id: 'caps', kind: 'mod', label: 'Caps', wide: 1.75 },
    KEY('a', 'a', '', '', 'A'),
    KEY('s', 's', '', '', 'S'),
    KEY('d', 'd', '', '', 'D'),
    KEY('f', 'f', '', '', 'F'),
    KEY('g', 'g', '', '', 'G'),
    KEY('h', 'h', '', '', 'H'),
    KEY('j', 'j', '', '', 'J'),
    KEY('k', 'k', '', '', 'K'),
    KEY('l', 'l', '', '', 'L'),
    KEY('semicolon', ';', '', '', ':'),
    KEY('quote', "'", '', '', '"'),
    { id: 'enter', kind: 'mod', label: 'Enter', wide: 2.25 }
  ];

  const ROW4_EN = [
    { id: 'shiftL', kind: 'mod', label: 'Shift', wide: 2.25 },
    KEY('z', 'z', '', '', 'Z'),
    KEY('x', 'x', '', '', 'X'),
    KEY('c', 'c', '', '', 'C'),
    KEY('v', 'v', '', '', 'V'),
    KEY('b', 'b', '', '', 'B'),
    KEY('n', 'n', '', '', 'N'),
    KEY('m', 'm', '', '', 'M'),
    KEY('comma', ',', '', '', '<'),
    KEY('period', '.', '', '', '>'),
    KEY('slash', '/', '', '', '?'),
    { id: 'shiftR', kind: 'mod', label: 'Shift', wide: 2.75 }
  ];

  const LAYOUTS = {
    standard: {
      id: 'standard',
      label: 'Khmer Standard',
      labelKm: 'ខ្មែរ យូនីកូដ (Standard)',
      rows: [ROW1, ROW2, ROW3, ROW4, ROW5]
    },
    nida: {
      id: 'nida',
      label: 'Khmer NiDA',
      labelKm: 'ខ្មែរ នីដា (NiDA)',
      rows: [ROW1_NIDA, ROW2_NIDA, ROW3_NIDA, ROW4_NIDA, ROW5]
    },
    english: {
      id: 'english',
      label: 'English US',
      labelKm: 'អង់គ្លេស (US QWERTY)',
      rows: [ROW1_EN, ROW2_EN, ROW3_EN, ROW4_EN, ROW5]
    }
  };

  const CODE_MAP = {
    Backquote: 'grave', Digit1: 'k1', Digit2: 'k2', Digit3: 'k3', Digit4: 'k4', Digit5: 'k5',
    Digit6: 'k6', Digit7: 'k7', Digit8: 'k8', Digit9: 'k9', Digit0: 'k0',
    Minus: 'minus', Equal: 'equal', Backspace: 'backspace',
    Tab: 'tab', KeyQ: 'q', KeyW: 'w', KeyE: 'e', KeyR: 'r', KeyT: 't', KeyY: 'y', KeyU: 'u',
    KeyI: 'i', KeyO: 'o', KeyP: 'p', BracketLeft: 'bracketL', BracketRight: 'bracketR', Enter: 'enter',
    CapsLock: 'caps', KeyA: 'a', KeyS: 's', KeyD: 'd', KeyF: 'f', KeyG: 'g', KeyH: 'h', KeyJ: 'j',
    KeyK: 'k', KeyL: 'l', Semicolon: 'semicolon', Quote: 'quote', Backslash: 'backslash',
    ShiftLeft: 'shiftL', ShiftRight: 'shiftR', KeyZ: 'z', KeyX: 'x', KeyC: 'c', KeyV: 'v', KeyB: 'b',
    KeyN: 'n', KeyM: 'm', Comma: 'comma', Period: 'period', Slash: 'slash',
    ControlLeft: 'ctrlL', ControlRight: 'ctrlR', AltLeft: 'alt', Space: 'space', AltRight: 'altgr'
  };

  const KEY_FINGER = {
    grave: 'lp', k1: 'lp', k2: 'lr', k3: 'lm', k4: 'li', k5: 'li',
    k6: 'ri', k7: 'ri', k8: 'rm', k9: 'rr', k0: 'rp', minus: 'rp', equal: 'rp', backspace: 'rp',
    tab: 'lp', q: 'lp', w: 'lr', e: 'lm', r: 'li', t: 'li', y: 'ri', u: 'ri', i: 'rm', o: 'rr',
    p: 'rp', bracketL: 'rp', bracketR: 'rp', enter: 'rp',
    caps: 'lp', a: 'lp', s: 'lr', d: 'lm', f: 'li', g: 'li', h: 'ri', j: 'ri', k: 'rm', l: 'rr',
    semicolon: 'rp', quote: 'rp', backslash: 'rp',
    shiftL: 'lp', z: 'lp', x: 'lr', c: 'lm', v: 'li', b: 'li', n: 'ri', m: 'ri',
    comma: 'rm', period: 'rr', slash: 'rp', shiftR: 'rp',
    ctrlL: 'lp', alt: 'lt', space: 'rt', altgr: 'rt', ctrlR: 'rp'
  };

  const FINGER_NAMES = {
    lp: 'L.Pinky', lr: 'L.Ring', lm: 'L.Middle', li: 'L.Index', lt: 'L.Thumb',
    ri: 'R.Index', rm: 'R.Middle', rr: 'R.Ring', rp: 'R.Pinky', rt: 'R.Thumb'
  };

  /* ============================================================
     2. Web Audio Synthesizer (Zero Dependencies)
     ============================================================ */
  let audioCtx = null;
  let soundOn = true;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playClick(kind) {
    if (!soundOn) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const t = audioCtx.currentTime;
      const isDown = kind === 'down';

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isDown ? 280 : 340, t);
      osc.frequency.exponentialRampToValueAtTime(isDown ? 120 : 180, t + 0.04);

      gain.gain.setValueAtTime(isDown ? 0.35 : 0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.05);
    } catch (e) {
      // Audio playback failed gracefully
    }
  }

  /* ============================================================
     3. State Management & Local Storage
     ============================================================ */
  const STORAGE_THEME = 'pk_rei_theme';
  const STORAGE_LAYOUT = 'pk_rei_layout';
  const STORAGE_SOUND = 'pk_rei_sound';
  const STORAGE_PROGRESS = 'pk_rei_progress';

  let currentLayoutId = localStorage.getItem(STORAGE_LAYOUT) || 'standard';
  let isDarkMode = localStorage.getItem(STORAGE_THEME) !== 'light';
  soundOn = localStorage.getItem(STORAGE_SOUND) !== 'false';

  let userProgress = {};
  try {
    userProgress = JSON.parse(localStorage.getItem(STORAGE_PROGRESS) || '{}');
  } catch (e) {
    userProgress = {};
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(userProgress));
    } catch (e) {}
  }

  /* ============================================================
     4. Simplified Lesson Curriculum (7 Clear Units)
     ============================================================ */
  const STAGE_KEYS = [
    { id: 'stage-home', name: '1. Home Row', nameKm: '១. ជួរកណ្ដាល' },
    { id: 'stage-top', name: '2. Top Row', nameKm: '២. ជួរលើ' },
    { id: 'stage-bot', name: '3. Bottom Row', nameKm: '៣. ជួរក្រោម' },
    { id: 'stage-shift', name: '4. Shift & Caps', nameKm: '៤. អក្សរធំ និងស្រៈ' },
    { id: 'stage-sub', name: '5. Subscripts', nameKm: '៥. ជើងអក្សរ (Coeng)' },
    { id: 'stage-num', name: '6. Numbers & Symbols', nameKm: '៦. លេខ និងសញ្ញា' },
    { id: 'stage-words', name: '7. Sentences', nameKm: '៧. ពាក្យ និងប្រយោគ' }
  ];

  /* Built-in core curated lessons for Rei ensuring standalone zero-delay reliability */
  const BUILTIN_LESSONS = {
    standard: [
      { id: 'std-01', stage: 'stage-home', num: '01', title: 'Index Anchors: ថ & ញ (F & J)', titleKm: 'ចង្អុលដៃ៖ ថ និង ញ', keys: ['ថ', 'ញ'], drills: ['ថថ ញញ ថញ ញថ ថថថ ញញញ', 'ថ ញ ថ ញ ថញថ ញថញ ថថ ញញ'] },
      { id: 'std-02', stage: 'stage-home', num: '02', title: 'Middle Fingers: ដ & ក (D & K)', titleKm: 'កណ្ដាលដៃ៖ ដ និង ក', keys: ['ដ', 'ក'], drills: ['ដដ កក ដក កដ ដដដ កកក', 'ថដ ញក ដថ កញ ដកដ កដក'] },
      { id: 'std-03', stage: 'stage-home', num: '03', title: 'Ring Fingers: ស & ល (S & L)', titleKm: 'នាងដៃ៖ ស និង ល', keys: ['ស', 'ល'], drills: ['សស លល សល លស សសស លលល', 'សដថ លកញ សលដក ថញសល'] },
      { id: 'std-04', stage: 'stage-home', num: '04', title: 'Pinky Fingers: ា & ើ (A & ;)', titleKm: 'កូនដៃ៖ ា និង ើ', keys: ['ា', 'ើ'], drills: ['ាា ើើ ាើ ើា ាាា ើើើ', 'ាសដថ ើលកញ កា ដា សា លា'] },
      { id: 'std-05', stage: 'stage-home', num: '05', title: 'Home Reaches: ង & ហ (G & H)', titleKm: 'លាតដៃ៖ ង និង ហ', keys: ['ង', 'ហ'], drills: ['ងង ហហ ងហ ហង ងងង ហហហ', 'ដង កហ សង លហ ថង ញហ កាហ ដាហ'] },
      { id: 'std-06', stage: 'stage-top', num: '06', title: 'Top Vowels: ឹ & ិ (W & I)', titleKm: 'ស្រៈជួរលើ៖ ឹ និង ិ', keys: ['ឹ', 'ិ'], drills: ['ឹឹ ិិ ឹិ ិឹ ឹឹឹ ិិិ', 'កិ ដឹ សិ លឹ ហិ ងឹ កិដឹ សិលឹ'] },
      { id: 'std-07', stage: 'stage-top', num: '07', title: 'Top Vowels: េ & ុ (E & U)', titleKm: 'ស្រៈជួរលើ៖ េ និង ុ', keys: ['េ', 'ុ'], drills: ['េេ ុុ េុ ុេ េេេ ុុុ', 'កេ កុ ដេ ដុ សេ សុ លេ លុ'] },
      { id: 'std-08', stage: 'stage-top', num: '08', title: 'Top Consonants: រ & ត (R & T)', titleKm: 'ព្យញ្ជនៈជួរលើ៖ រ និង ត', keys: ['រ', 'ត'], drills: ['ររ តត រត តរ រររ តតត', 'តេ តា រា រេ កាត តារា រដូវ'] },
      { id: 'std-09', stage: 'stage-bot', num: '09', title: 'Bottom Consonants: ច & វ (C & V)', titleKm: 'ព្យញ្ជនៈជួរក្រោម៖ ច និង វ', keys: ['ច', 'វ'], drills: ['ចច វវ ចវ វច ចចច វវវ', 'ចា វា ចេ វេ ចុះ វាចា កាច'] },
      { id: 'std-10', stage: 'stage-bot', num: '10', title: 'Bottom Consonants: ប & ន (B & N)', titleKm: 'ព្យញ្ជនៈជួរក្រោម៖ ប និង ន', keys: ['ប', 'ន'], drills: ['បប នន បន នប បបប ននន', 'បាន បានជា នរណា បងប្អូន នគរ'] },
      { id: 'std-11', stage: 'stage-shift', num: '11', title: 'Shift Consonants: ខ & គ (Shift+X, Comma)', titleKm: 'អក្សរធំ៖ ខ និង គ', keys: ['ខ', 'គ'], drills: ['ខខ គគ ខគ គខ ខខខ គគគ', 'ខែ គោ ឃើញ គិត ខុស ត្រូវ'] },
      { id: 'std-12', stage: 'stage-sub', num: '12', title: 'Coeng Basics: ្ (Space in Standard)', titleKm: 'ជើងអក្សរមូលដ្ឋាន (Spacebar)', keys: ['្'], drills: ['ក្ក ខ្ខ ច្ច ដ្ដ ត្ម ក្ម', 'ខ្ញុំ ស្ដេច ស្មៅ ស្ដាប់ ក្ដី'] },
      { id: 'std-13', stage: 'stage-num', num: '13', title: 'Khmer Digits: ១ ២ ៣ ៤ ៥', titleKm: 'លេខខ្មែរ៖ ១ ២ ៣ ៤ ៥', keys: ['១', '២', '៣', '៤', '៥'], drills: ['១១ ២២ ៣៣ ៤៤ ៥៥', '១២ ៣៤ ៥១ ៤៣ ២៥ ១២៣៤៥'] },
      { id: 'std-14', stage: 'stage-words', num: '14', title: 'Cambodian Common Words', titleKm: 'ពាក្យខ្មែរទូទៅ', keys: ['ពាក្យ'], drills: ['កម្ពុជា សុខសប្បាយ រៀនវាយអក្សរ', 'ស្រឡាញ់ ជាតិ មាតុភូមិ ខ្មែររុងរឿង'] }
    ],
    nida: [
      { id: 'nida-01', stage: 'stage-home', num: '01', title: 'NiDA Anchors: ថ & ញ (F & J)', titleKm: 'នីដា ចង្អុលដៃ៖ ថ និង ញ', keys: ['ថ', 'ញ'], drills: ['ថថ ញញ ថញ ញថ ថថថ ញញញ', 'ថ ញ ថ ញ ថញថ ញថញ'] },
      { id: 'nida-02', stage: 'stage-home', num: '02', title: 'NiDA Middles: ដ & ក (D & K)', titleKm: 'នីដា កណ្ដាលដៃ៖ ដ និង ក', keys: ['ដ', 'ក'], drills: ['ដដ កក ដក កដ ដដដ កកក', 'ថដ ញក ដថ កញ'] },
      { id: 'nida-03', stage: 'stage-home', num: '03', title: 'NiDA Rings: ស & ល (S & L)', titleKm: 'នីដា នាងដៃ៖ ស និង ល', keys: ['ស', 'ល'], drills: ['សស លល សល លស សសស លលល', 'សដថ លកញ សលដក'] },
      { id: 'nida-04', stage: 'stage-top', num: '04', title: 'NiDA Top Vowels: ឹ & ិ (W & I)', titleKm: 'នីដា ស្រៈជួរលើ៖ ឹ និង ិ', keys: ['ឹ', 'ិ'], drills: ['ឹឹ ិិ ឹិ ិឹ ឹឹឹ ិិិ', 'កិ ដឹ សិ លឹ ហិ'] },
      { id: 'nida-05', stage: 'stage-bot', num: '05', title: 'NiDA Bottom: ប & ន (B & N)', titleKm: 'នីដា ជួរក្រោម៖ ប និង ន', keys: ['ប', 'ន'], drills: ['បប នន បន នប', 'បាន នរណា បងប្អូន'] },
      { id: 'nida-06', stage: 'stage-words', num: '06', title: 'NiDA Practical Phrases', titleKm: 'នីដា អនុវត្តពាក្យជាក់ស្ដែង', keys: ['ពាក្យ'], drills: ['សួស្ដី កម្ពុជា សុខសប្បាយ', 'រៀនវាយអក្សរខ្មែរ នីដា'] }
    ],
    english: [
      { id: 'en-01', stage: 'stage-home', num: '01', title: 'Home Row Anchors: F & J', titleKm: 'យុថ្កាចង្អុលដៃ F & J', keys: ['f', 'j'], drills: ['ff jj fj jf fff jjj', 'f j f j fjf jfj ff jj'] },
      { id: 'en-02', stage: 'stage-home', num: '02', title: 'Home Row Middles: D & K', titleKm: 'កណ្ដាលដៃ D & K', keys: ['d', 'k'], drills: ['dd kk dk kd ddd kkk', 'fd jk df kj dk dk fd jk'] },
      { id: 'en-03', stage: 'stage-home', num: '03', title: 'Home Row Rings: S & L', titleKm: 'នាងដៃ S & L', keys: ['s', 'l'], drills: ['ss ll sl ls sss lll', 'sdfl lkjs ask dad lads'] },
      { id: 'en-04', stage: 'stage-home', num: '04', title: 'Home Row Pinkies: A & ;', titleKm: 'កូនដៃ A & ;', keys: ['a', ';'], drills: ['aa ;; a; ;a aaa ;;;', 'all fall flask salads ask dad'] },
      { id: 'en-05', stage: 'stage-home', num: '05', title: 'Home Row Reaches: G & H', titleKm: 'លាតដៃ G & H', keys: ['g', 'h'], drills: ['gg hh gh hg ggg hhh', 'half glad flag dash flash glass'] },
      { id: 'en-06', stage: 'stage-top', num: '06', title: 'Top Row Vowels: E & I', titleKm: 'ស្រៈជួរលើ E & I', keys: ['e', 'i'], drills: ['ee ii ei ie eee iii', 'see like life file side ride feed'] },
      { id: 'en-07', stage: 'stage-top', num: '07', title: 'Top Row Vowels: R & U', titleKm: 'ស្រៈជួរលើ R & U', keys: ['r', 'u'], drills: ['rr uu ru ur rrr uuu', 'sure true rule user turn dark'] },
      { id: 'en-08', stage: 'stage-top', num: '08', title: 'Top Row Letters: T & Y', titleKm: 'អក្សរជួរលើ T & Y', keys: ['t', 'y'], drills: ['tt yy ty yt ttt yyy', 'they that stay city year duty'] },
      { id: 'en-09', stage: 'stage-bot', num: '09', title: 'Bottom Row: V & M', titleKm: 'ជួរក្រោម V & M', keys: ['v', 'm'], drills: ['vv mm vm mv vvv mmm', 'move live make must give come'] },
      { id: 'en-10', stage: 'stage-bot', num: '10', title: 'Bottom Row: C & N', titleKm: 'ជួរក្រោម C & N', keys: ['c', 'n'], drills: ['cc nn cn nc ccc nnn', 'clean nice can cat next rain'] },
      { id: 'en-11', stage: 'stage-shift', num: '11', title: 'Capital Letters (Shift Key)', titleKm: 'អក្សរធំ (Shift)', keys: ['Shift'], drills: ['Phnom Penh Cambodia Asia Khmer', 'The Quick Brown Fox Jumps Over'] },
      { id: 'en-12', stage: 'stage-num', num: '12', title: 'Numbers & Symbols: 1-0', titleKm: 'លេខ និងសញ្ញា', keys: ['1-0'], drills: ['12 34 56 78 90 2026', 'test: $100, 50%, #1 coder!'] },
      { id: 'en-13', stage: 'stage-words', num: '13', title: 'English Fluency & Speed', titleKm: 'ការអនុវត្តពាក្យ និងប្រយោគ', keys: ['Words'], drills: ['practice makes perfect touch typing', 'learn khmer and english typing with ease'] }
    ]
  };

  /* ============================================================
     5. Typing Engine & Session State
     ============================================================ */
  let activeLesson = null;
  let activeDrillIndex = 0;
  let targetString = '';
  let typedString = '';
  let startTime = 0;
  let totalErrors = 0;
  let activeStageId = 'stage-home';
  let isFreeTyping = false;

  /* DOM Element References */
  const elThemeBtn = document.getElementById('reiThemeToggle');
  const elSoundBtn = document.getElementById('reiSoundToggle');
  const elFocusBtn = document.getElementById('reiFocusToggle');
  const elLangBtn = document.getElementById('reiLangToggle');
  const elCurriculumTabs = document.getElementById('reiCurriculumTabs');
  const elStagesBar = document.getElementById('reiStagesBar');
  const elLessonGrid = document.getElementById('reiLessonGrid');
  const elFreeTypingBtn = document.getElementById('reiFreeTypingBtn');
  const elLessonHub = document.getElementById('reiLessonHub');
  const elPracticeDeck = document.getElementById('reiPracticeDeck');
  const elPromptLine = document.getElementById('reiPromptLine');
  const elPracticeStageTag = document.getElementById('reiPracticeStageTag');
  const elPracticeTitle = document.getElementById('reiPracticeTitle');
  const elDrillCounter = document.getElementById('reiDrillCounter');
  const elWpmVal = document.getElementById('reiWpmVal');
  const elAccVal = document.getElementById('reiAccVal');
  const elMistakesVal = document.getElementById('reiMistakesVal');
  const elProgressVal = document.getElementById('reiProgressVal');
  const elRestartBtn = document.getElementById('reiRestartBtn');
  const elExitBtn = document.getElementById('reiExitBtn');
  const elKeyboard = document.getElementById('reiKeyboard');
  const elModalBackdrop = document.getElementById('reiModalBackdrop');
  const elModalNextBtn = document.getElementById('reiModalNextBtn');
  const elModalRepeatBtn = document.getElementById('reiModalRepeatBtn');
  const elModalExitBtn = document.getElementById('reiModalExitBtn');
  const elStatCompleted = document.getElementById('reiStatCompleted');
  const elStatWpm = document.getElementById('reiStatWpm');
  const elStatAcc = document.getElementById('reiStatAcc');

  /* ============================================================
     6. Rendering & UI Updates
     ============================================================ */

  function applyTheme(isDark) {
    isDarkMode = isDark;
    document.documentElement.classList.toggle('theme-light', !isDark);
    localStorage.setItem(STORAGE_THEME, isDark ? 'dark' : 'light');
    if (elThemeBtn) {
      elThemeBtn.innerHTML = isDark
        ? `<svg class="rei-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> <span>Light</span>`
        : `<svg class="rei-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> <span>Dark</span>`;
    }
  }

  function updateSoundUI() {
    if (elSoundBtn) {
      elSoundBtn.innerHTML = soundOn
        ? `<svg class="rei-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> <span>Sound: ON</span>`
        : `<svg class="rei-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg> <span>Sound: OFF</span>`;
      elSoundBtn.classList.toggle('active', soundOn);
    }
  }

  function updateLangUI() {
    if (elLangBtn) {
      const cur = LAYOUTS[currentLayoutId] || LAYOUTS.standard;
      elLangBtn.innerHTML = `<svg class="rei-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg> <span>${cur.label}</span> <kbd class="rei-kbd">Alt+L</kbd>`;
    }
  }

  /* Render Virtual Keyboard */
  function renderKeyboard() {
    if (!elKeyboard) return;
    elKeyboard.innerHTML = '';
    const layout = LAYOUTS[currentLayoutId] || LAYOUTS.standard;

    layout.rows.forEach(rowDef => {
      const rowEl = document.createElement('div');
      rowEl.className = 'rei-kb-row';

      rowDef.forEach(k => {
        const keyEl = document.createElement('div');
        keyEl.className = 'rei-key';
        keyEl.dataset.key = k.id;
        const u = k.wide || (k.id === 'space' ? 6.5 : 1);
        keyEl.style.setProperty('--u', u);

        if (k.kind === 'mod') {
          keyEl.classList.add('mod');
          if (k.id === 'space') {
            keyEl.textContent = (currentLayoutId === 'standard') ? 'Spacebar (ជើង Coeng)' : 'Spacebar';
          } else {
            keyEl.textContent = k.label || k.id;
          }
        } else {
          keyEl.textContent = k.base || '';
          if (k.shift && k.shift !== k.base) {
            const sub = document.createElement('span');
            sub.className = 'rei-key-sub';
            sub.textContent = k.shift;
            keyEl.appendChild(sub);
          }
        }

        const fingerCode = KEY_FINGER[k.id];
        if (fingerCode && FINGER_NAMES[fingerCode]) {
          keyEl.dataset.finger = fingerCode;
        }

        rowEl.appendChild(keyEl);
      });

      elKeyboard.appendChild(rowEl);
    });
  }

  /* Render Curriculum Tabs & Stages */
  function renderCurriculumControls() {
    if (elCurriculumTabs) {
      elCurriculumTabs.innerHTML = '';
      Object.keys(LAYOUTS).forEach(lid => {
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.className = `rei-tab ${lid === currentLayoutId ? 'active' : ''}`;
        tab.textContent = LAYOUTS[lid].label;
        tab.addEventListener('click', () => {
          currentLayoutId = lid;
          localStorage.setItem(STORAGE_LAYOUT, lid);
          updateLangUI();
          renderCurriculumControls();
          renderStagesBar();
          renderLessonCards();
          renderKeyboard();
          highlightActiveKey();
        });
        elCurriculumTabs.appendChild(tab);
      });
    }
  }

  function renderStagesBar() {
    if (!elStagesBar) return;
    elStagesBar.innerHTML = '';
    STAGE_KEYS.forEach(st => {
      // Hide Subscripts stage if English layout
      if (currentLayoutId === 'english' && st.id === 'stage-sub') return;

      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `rei-stage-pill ${st.id === activeStageId ? 'active' : ''}`;
      pill.textContent = st.name;
      pill.addEventListener('click', () => {
        activeStageId = st.id;
        renderStagesBar();
        renderLessonCards();
      });
      elStagesBar.appendChild(pill);
    });
  }

  function renderLessonCards() {
    if (!elLessonGrid) return;
    elLessonGrid.innerHTML = '';

    const lessons = BUILTIN_LESSONS[currentLayoutId] || BUILTIN_LESSONS.standard;
    const stageLessons = lessons.filter(l => l.stage === activeStageId);

    if (stageLessons.length === 0) {
      elLessonGrid.innerHTML = `<div style="grid-column: 1/-1; padding: 24px; text-align: center; color: var(--rei-text-dim);">No lessons in this stage yet. Select another stage above.</div>`;
      return;
    }

    stageLessons.forEach(l => {
      const card = document.createElement('div');
      card.className = 'rei-lesson-card';
      if (activeLesson && activeLesson.id === l.id) {
        card.classList.add('active-lesson');
      }

      const rec = userProgress[l.id];
      const isDone = !!(rec && rec.completed);

      card.innerHTML = `
        <div class="rei-card-head">
          <span class="rei-card-num">LESSON ${l.num}</span>
          <span class="rei-card-status ${isDone ? 'completed' : ''}">
            ${isDone ? `<svg class="rei-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Done` : 'Ready'}
          </span>
        </div>
        <div class="rei-card-title">${l.title}</div>
        <div class="rei-card-keys">
          ${l.keys.map(k => `<span class="rei-key-chip">${k}</span>`).join('')}
        </div>
        <div class="rei-card-foot">
          <span class="rei-card-score">${isDone ? `${rec.wpm || 0} WPM · ${rec.acc || 0}% Acc` : 'Not started'}</span>
          <button type="button" class="rei-card-start-btn">
            <span>${isDone ? 'Practice' : 'Start'}</span>
            <svg class="rei-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      `;

      card.addEventListener('click', () => startLesson(l));
      elLessonGrid.appendChild(card);
    });

    updateOverviewStats();
  }

  function updateOverviewStats() {
    const lessons = BUILTIN_LESSONS[currentLayoutId] || BUILTIN_LESSONS.standard;
    let completedCount = 0;
    let totalWpm = 0;
    let totalAcc = 0;

    lessons.forEach(l => {
      const rec = userProgress[l.id];
      if (rec && rec.completed) {
        completedCount++;
        totalWpm += (rec.wpm || 0);
        totalAcc += (rec.acc || 0);
      }
    });

    if (elStatCompleted) elStatCompleted.textContent = `${completedCount} / ${lessons.length}`;
    if (elStatWpm) elStatWpm.textContent = `${completedCount > 0 ? Math.round(totalWpm / completedCount) : 0} WPM`;
    if (elStatAcc) elStatAcc.textContent = `${completedCount > 0 ? Math.round(totalAcc / completedCount) : 100}%`;
  }

  /* ============================================================
     7. Active Lesson Practice Logic
     ============================================================ */

  function startLesson(lesson) {
    activeLesson = lesson;
    activeDrillIndex = 0;
    isFreeTyping = false;
    loadDrill();

    if (elLessonHub) elLessonHub.hidden = true;
    if (elPracticeDeck) elPracticeDeck.hidden = false;
    renderLessonCards();
  }

  function exitLesson() {
    activeLesson = null;
    isFreeTyping = false;
    if (elPracticeDeck) elPracticeDeck.hidden = true;
    if (elLessonHub) elLessonHub.hidden = false;
    clearKeyHighlights();
    renderLessonCards();
  }

  function loadDrill() {
    if (!activeLesson) return;
    targetString = activeLesson.drills[activeDrillIndex] || '';
    typedString = '';
    startTime = 0;
    totalErrors = 0;

    if (elPracticeStageTag) {
      const st = STAGE_KEYS.find(s => s.id === activeLesson.stage);
      elPracticeStageTag.textContent = st ? st.name : 'Practice Drill';
    }
    if (elPracticeTitle) {
      elPracticeTitle.textContent = `Lesson ${activeLesson.num}: ${activeLesson.title}`;
    }
    if (elDrillCounter) {
      elDrillCounter.textContent = `Drill ${activeDrillIndex + 1} of ${activeLesson.drills.length}`;
    }

    updateTelemetry();
    renderPrompt();
    highlightActiveKey();
  }

  function renderPrompt() {
    if (!elPromptLine) return;
    elPromptLine.innerHTML = '';

    for (let i = 0; i < targetString.length; i++) {
      const span = document.createElement('span');
      span.className = 'rei-char';
      span.textContent = targetString[i];

      if (i < typedString.length) {
        if (typedString[i] === targetString[i]) {
          span.classList.add('correct');
        } else {
          span.classList.add('incorrect');
        }
      } else if (i === typedString.length) {
        span.classList.add('current');
      } else {
        span.classList.add('pending');
      }
      elPromptLine.appendChild(span);
    }
  }

  function updateTelemetry() {
    const elapsedMinutes = startTime ? (Date.now() - startTime) / 60000 : 0;
    const correctChars = typedString.split('').filter((c, i) => c === targetString[i]).length;
    const wpm = (elapsedMinutes > 0.02) ? Math.round((correctChars / 5) / elapsedMinutes) : 0;
    const totalTyped = typedString.length;
    const accuracy = (totalTyped > 0) ? Math.max(0, Math.round(((totalTyped - totalErrors) / totalTyped) * 100)) : 100;

    if (elWpmVal) elWpmVal.textContent = wpm;
    if (elAccVal) elAccVal.textContent = `${accuracy}%`;
    if (elMistakesVal) elMistakesVal.textContent = totalErrors;
    if (elProgressVal) elProgressVal.textContent = `${typedString.length} / ${targetString.length}`;
  }

  /* Virtual Key Highlighting */
  function clearKeyHighlights() {
    if (!elKeyboard) return;
    elKeyboard.querySelectorAll('.rei-key').forEach(k => {
      k.classList.remove('target-key', 'guide-key');
      const hint = k.querySelector('.rei-finger-hint');
      if (hint) hint.remove();
    });
  }

  function highlightActiveKey() {
    clearKeyHighlights();
    if (!activeLesson || typedString.length >= targetString.length) return;

    const charToType = targetString[typedString.length];
    const layout = LAYOUTS[currentLayoutId] || LAYOUTS.standard;

    let targetKeyId = null;
    let needsShift = false;
    let needsCoeng = false;

    // Standard layout Khmer spacebar Coeng
    if (currentLayoutId === 'standard' && charToType === '្') {
      targetKeyId = 'space';
      needsCoeng = true;
    } else if (charToType === ' ') {
      targetKeyId = 'space';
    } else {
      // Find key in rows
      for (const row of layout.rows) {
        for (const k of row) {
          if (k.base === charToType) {
            targetKeyId = k.id;
            break;
          } else if (k.shift === charToType) {
            targetKeyId = k.id;
            needsShift = true;
            break;
          }
        }
        if (targetKeyId) break;
      }
    }

    if (targetKeyId) {
      const keyEl = elKeyboard.querySelector(`.rei-key[data-key="${targetKeyId}"]`);
      if (keyEl) {
        keyEl.classList.add('target-key');
        const fingerCode = KEY_FINGER[targetKeyId];
        if (fingerCode && FINGER_NAMES[fingerCode]) {
          const hint = document.createElement('span');
          hint.className = 'rei-finger-hint';
          hint.textContent = FINGER_NAMES[fingerCode];
          keyEl.appendChild(hint);
        }
      }
    }

    if (needsShift) {
      const shiftEl = elKeyboard.querySelector('.rei-key[data-key="shiftL"]') || elKeyboard.querySelector('.rei-key[data-key="shiftR"]');
      if (shiftEl) shiftEl.classList.add('guide-key');
    }
    if (needsCoeng) {
      const spaceEl = elKeyboard.querySelector('.rei-key[data-key="space"]');
      if (spaceEl) spaceEl.classList.add('target-key');
    }
  }

  /* Physical Keyboard Input Event Handler */
  function handleKeyDown(e) {
    if (e.repeat && e.key !== 'Backspace') return;

    // Focus shortcut: Alt+F
    if (e.altKey && (e.key === 'f' || e.key === 'F')) {
      e.preventDefault();
      toggleFocusMode();
      return;
    }

    // Language shortcut: Alt+L
    if (e.altKey && (e.key === 'l' || e.key === 'L')) {
      e.preventDefault();
      cycleLayout();
      return;
    }

    // Exit practice with Escape
    if (e.key === 'Escape') {
      if (elModalBackdrop && !elModalBackdrop.hidden) {
        closeModal();
      } else if (activeLesson) {
        exitLesson();
      }
      return;
    }

    // Restart drill with Tab+Enter
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      if (activeLesson) loadDrill();
      return;
    }

    const keyId = CODE_MAP[e.code];
    if (keyId) {
      const keyEl = elKeyboard ? elKeyboard.querySelector(`.rei-key[data-key="${keyId}"]`) : null;
      if (keyEl) {
        keyEl.classList.add('pressed');
        setTimeout(() => keyEl.classList.remove('pressed'), 120);
      }
      playClick('down');
    }

    if (!activeLesson) return;

    // Handling Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (typedString.length > 0) {
        typedString = typedString.slice(0, -1);
        renderPrompt();
        updateTelemetry();
        highlightActiveKey();
      }
      return;
    }

    // Only process printable single character inputs or Space
    if (e.key.length === 1 || e.code === 'Space') {
      e.preventDefault();
      if (!startTime) startTime = Date.now();

      let inputChar = e.key;

      // When practicing on Standard Khmer, Spacebar outputs Coeng '្' if target is '្'
      if (currentLayoutId === 'standard' && e.code === 'Space' && targetString[typedString.length] === '្') {
        inputChar = '្';
      }

      // Check against target character
      const expectedChar = targetString[typedString.length];
      if (inputChar !== expectedChar) {
        totalErrors++;
      }

      typedString += inputChar;
      renderPrompt();
      updateTelemetry();
      highlightActiveKey();

      // Check if drill complete
      if (typedString.length >= targetString.length) {
        finishDrill();
      }
    }
  }

  function finishDrill() {
    clearKeyHighlights();
    activeDrillIndex++;

    if (activeDrillIndex < activeLesson.drills.length) {
      // Advance to next drill in same lesson
      setTimeout(() => loadDrill(), 400);
    } else {
      // Lesson complete!
      completeLesson();
    }
  }

  function completeLesson() {
    const elapsedMinutes = startTime ? (Date.now() - startTime) / 60000 : 0.05;
    const correctChars = typedString.split('').filter((c, i) => c === targetString[i]).length;
    const finalWpm = Math.max(1, Math.round((correctChars / 5) / elapsedMinutes));
    const finalAcc = Math.max(0, Math.round(((typedString.length - totalErrors) / typedString.length) * 100));

    // Save progress
    const prev = userProgress[activeLesson.id] || {};
    userProgress[activeLesson.id] = {
      completed: true,
      wpm: Math.max(prev.wpm || 0, finalWpm),
      acc: Math.max(prev.acc || 0, finalAcc),
      updatedAt: Date.now()
    };
    saveProgress();

    // Show completion modal
    if (elModalBackdrop) {
      const elModalWpm = document.getElementById('reiModalWpm');
      const elModalAcc = document.getElementById('reiModalAcc');
      const elModalTime = document.getElementById('reiModalTime');
      const elModalErrors = document.getElementById('reiModalErrors');

      if (elModalWpm) elModalWpm.textContent = finalWpm;
      if (elModalAcc) elModalAcc.textContent = `${finalAcc}%`;
      if (elModalTime) elModalTime.textContent = `${Math.round(elapsedMinutes * 60)}s`;
      if (elModalErrors) elModalErrors.textContent = totalErrors;

      elModalBackdrop.hidden = false;
      if (elModalNextBtn) elModalNextBtn.focus();
    }
  }

  function closeModal() {
    if (elModalBackdrop) elModalBackdrop.hidden = true;
    exitLesson();
  }

  function advanceToNextLesson() {
    if (elModalBackdrop) elModalBackdrop.hidden = true;
    const lessons = BUILTIN_LESSONS[currentLayoutId] || BUILTIN_LESSONS.standard;
    const currentIndex = lessons.findIndex(l => l.id === activeLesson.id);

    if (currentIndex >= 0 && currentIndex < lessons.length - 1) {
      startLesson(lessons[currentIndex + 1]);
    } else {
      exitLesson();
    }
  }

  function repeatCurrentLesson() {
    if (elModalBackdrop) elModalBackdrop.hidden = true;
    if (activeLesson) {
      activeDrillIndex = 0;
      loadDrill();
    }
  }

  function toggleFocusMode() {
    document.body.classList.toggle('focus-mode');
    if (elFocusBtn) {
      elFocusBtn.classList.toggle('active', document.body.classList.contains('focus-mode'));
    }
  }

  function cycleLayout() {
    const keys = Object.keys(LAYOUTS);
    const nextIdx = (keys.indexOf(currentLayoutId) + 1) % keys.length;
    currentLayoutId = keys[nextIdx];
    localStorage.setItem(STORAGE_LAYOUT, currentLayoutId);

    updateLangUI();
    renderCurriculumControls();
    renderStagesBar();
    renderLessonCards();
    renderKeyboard();
    highlightActiveKey();
  }

  /* ============================================================
     8. Initialization
     ============================================================ */
  function init() {
    applyTheme(isDarkMode);
    updateSoundUI();
    updateLangUI();
    renderCurriculumControls();
    renderStagesBar();
    renderLessonCards();
    renderKeyboard();

    // Event Listeners
    if (elThemeBtn) {
      elThemeBtn.addEventListener('click', () => applyTheme(!isDarkMode));
    }

    if (elSoundBtn) {
      elSoundBtn.addEventListener('click', () => {
        soundOn = !soundOn;
        localStorage.setItem(STORAGE_SOUND, soundOn ? 'true' : 'false');
        updateSoundUI();
        if (soundOn) playClick('down');
      });
    }

    if (elFocusBtn) {
      elFocusBtn.addEventListener('click', toggleFocusMode);
    }

    if (elLangBtn) {
      elLangBtn.addEventListener('click', cycleLayout);
    }

    if (elRestartBtn) {
      elRestartBtn.addEventListener('click', () => {
        if (activeLesson) loadDrill();
      });
    }

    if (elExitBtn) {
      elExitBtn.addEventListener('click', exitLesson);
    }

    if (elModalNextBtn) {
      elModalNextBtn.addEventListener('click', advanceToNextLesson);
    }

    if (elModalRepeatBtn) {
      elModalRepeatBtn.addEventListener('click', repeatCurrentLesson);
    }

    if (elModalExitBtn) {
      elModalExitBtn.addEventListener('click', closeModal);
    }

    if (elFreeTypingBtn) {
      elFreeTypingBtn.addEventListener('click', () => {
        isFreeTyping = true;
        activeLesson = {
          id: 'free-type',
          stage: 'stage-home',
          num: 'FT',
          title: 'Free Keyboard Practice',
          keys: ['Free'],
          drills: [
            currentLayoutId === 'english'
              ? 'the quick brown fox jumps over the lazy dog'
              : 'រៀនវាយអក្សរខ្មែរដោយរីករាយ និងភាពស្ទាត់ជំនាញ'
          ]
        };
        startLesson(activeLesson);
      });
    }

    window.addEventListener('keydown', handleKeyDown);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export minimal namespace for programmatic testing and verification
  window.PK_REI = {
    LAYOUTS,
    KEY_FINGER,
    BUILTIN_LESSONS,
    applyTheme,
    cycleLayout,
    startLesson,
    exitLesson,
    playClick
  };
})();
