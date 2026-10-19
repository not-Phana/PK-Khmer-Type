var WORD_BANK = window.WORD_BANK || ['អាវ','តា','យាយ','មាន','ខាន','បាន','ចាន','តារា','កាច'];
var WORD_BANK_EN = window.WORD_BANK_EN || ['cat','dog','sun','run','desk','lamp','fish','bird','tree','king','fast','slow','jump','walk','hand','word','type','game','song','play'];
window.WORD_BANK = WORD_BANK;
window.WORD_BANK_EN = WORD_BANK_EN;
var collapsedLevels = null;
/* ============================================================
   PK Khmer Type — Structured Lessons, Levels & Remedial Drills
   ============================================================ */

const STANDARD_ROWS = [ROW1, ROW2, ROW3, ROW4, ROW5];
const KEY_BY_ID = {};
STANDARD_ROWS.forEach(row=> row.forEach(k=>{ if(k.kind==='glyph') KEY_BY_ID[k.id] = k; }));

/* Parallel key tables for the NiDA and English layouts, used to build
   their own (home-row-focused) lesson courses further below. */
function buildKeyById(rows){
  const map = {};
  rows.forEach(row=> row.forEach(k=>{ if(k.kind==='glyph') map[k.id] = k; }));
  return map;
}
const KEY_BY_ID_NIDA = buildKeyById([ROW1_NIDA, ROW2_NIDA, ROW3_NIDA, ROW4_NIDA, ROW5_NIDA]);
const KEY_BY_ID_EN = buildKeyById([ROW1_EN, ROW2_EN, ROW3_EN, ROW4_EN, ROW5_EN]);

function charFor(id, layer){
  if(id === 'space') return 'Space';
  const table = (currentLayoutId==='nida') ? KEY_BY_ID_NIDA
    : (currentLayoutId==='english') ? KEY_BY_ID_EN
    : KEY_BY_ID;
  const k = table[id];
  if(!k) return '';
  const lyr = layer || 'base';
  const v = k[lyr];
  return (v !== undefined && v !== '') ? v : (k.base || '');
}

function formatDisplayGlyph(ch){
  if(!ch) return '';
  if(ch === ' ') return 'Space';
  const code = ch.codePointAt(0);
  // Khmer combining marks (Coeng 0x17D2, vowels 0x17B4-0x17BD, diacritics 0x17C6-0x17D3)
  // Need a base dotted circle (◌ U+25CC) so they render legibly instead of collapsing into a dot
  if((code >= 0x17B4 && code <= 0x17D3) || code === 0x17DD){
    return '\u25CC' + ch;
  }
  return ch;
}

const FINGER_LABELS = {
  lp:'Left Pinky', lr:'Left Ring', lm:'Left Middle', li:'Left Index',
  ri:'Right Index', rm:'Right Middle', rr:'Right Ring', rp:'Right Pinky',
  lt:'Left Thumb', rt:'Right Thumb'
};
const FINGER_LABELS_KM = {
  lp:'ម្រាមកូនឆ្វេង', lr:'ម្រាមនាងឆ្វេង', lm:'ម្រាមកណ្ដាលឆ្វេង', li:'ម្រាមចង្អុលឆ្វេង',
  ri:'ម្រាមចង្អុលស្ដាំ', rm:'ម្រាមកណ្ដាលស្ដាំ', rr:'ម្រាមនាងស្ដាំ', rp:'ម្រាមកូនស្ដាំ',
  lt:'មេដៃឆ្វេង', rt:'មេដៃស្ដាំ'
};
function fingerLabel(id){
  const isKm = typeof document !== 'undefined' && document.documentElement.classList.contains('site-km-mode');
  const fid = KEY_FINGER[id];
  if(isKm && FINGER_LABELS_KM[fid]) return FINGER_LABELS_KM[fid];
  return FINGER_LABELS[fid] || '';
}

const KEY_LABELS = {
  semicolon:';', quote:"'", backslash:'\\', comma:',', period:'.', slash:'/',
  grave:'`', minus:'-', equal:'=', bracketL:'[', bracketR:']', space:'Space'
};
function keyLabel(id){
  if(id === 'space') return 'Space';
  if(KEY_LABELS[id]) return KEY_LABELS[id];
  if(/^k\d$/.test(id)) return id.slice(1);
  return id.toUpperCase();
}

/* Return required space layer: 'base' on English and NiDA ZWSP (\u200B), 'shift' on Standard / visible space */
function spaceLayerFor(table, ch){
  if(typeof currentLayoutId !== 'undefined' && currentLayoutId === 'english') return 'base';
  if(table && table === KEY_BY_ID_EN) return 'base';
  if((typeof currentLayoutId !== 'undefined' && currentLayoutId === 'nida') || (table && table === KEY_BY_ID_NIDA)){
    if(ch === '\u200B') return 'base';
    return 'shift';
  }
  return 'shift';
}
function spaceEntry(table, ch = ' '){
  return { id: 'space', layer: spaceLayerFor(table, ch), ch: ch };
}

/* entry = one drillable {key id, layer, character} triple.
   Reads from `table` when given (used for the NiDA/English home-row
   courses further below), falling back to the standard Khmer table. */
function entriesFromIds(ids, layer, table){
  const src = table || KEY_BY_ID;
  return ids.map(id=> {
    if(id === 'space') return spaceEntry(table);
    const k = src[id];
    const v = k ? k[layer] : undefined;
    const ch = (v !== undefined && v !== '') ? v : '';
    return {id, layer, ch};
  }).filter(e=> e.ch);
}
function resolveCharLocation(ch, table){
  const src = table || ((typeof currentLayoutId !== 'undefined' && currentLayoutId==='nida') ? KEY_BY_ID_NIDA
    : (typeof currentLayoutId !== 'undefined' && currentLayoutId==='english') ? KEY_BY_ID_EN
    : KEY_BY_ID);
  if(!src) return null;
  if(ch === ' ' || ch === '\u200B') return spaceEntry(src, ch);
  if(ch === '្' && (src === KEY_BY_ID || (typeof currentLayoutId !== 'undefined' && currentLayoutId === 'standard'))){
    return { id: 'space', layer: 'base', ch: '្' };
  }
  for(const id in src){
    const k = src[id];
    if(k.base===ch) return {id, layer:'base', ch};
    if(k.shift===ch) return {id, layer:'shift', ch};
    if(k.ctrl===ch) return {id, layer:'ctrl', ch};
    if(k.altgr===ch) return {id, layer:'altgr', ch};
  }
  return null;
}
if(typeof window !== 'undefined'){
  window.resolveCharLocation = resolveCharLocation;
}
function materialize(entries, sections){
  return {
    chars: entries.map(e=> e.ch),
    layers: entries.map(e=> e.layer),
    keyIds: entries.map(e=> e.id),
    sections: sections || [
      { id: 'sec_1', type: 'drill', title: 'Exercise 1', startIndex: 0, endIndex: Math.max(0, entries.length - 1), totalUnits: entries.length }
    ]
  };
}
function pickRandom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function shuffled(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

/* ---- exercise generators (operate on arrays of entries) ---- */

/* Introduce new keys strictly within their allowed content.
   If lesson examples are specified, LESSON EXAMPLES is the source of truth:
   content is generated strictly and exclusively from those example tokens.
   Never introduces or mixes characters from prior or unrelated lessons. */
function seqIntro(newEntries, priorEntries, opts={}){
  const soloReps = opts.soloReps ?? 4;
  const examples = opts.examples || [];
  const seq = [];
  const table = opts.table;

  const pushToken = (tok) => {
    for(const ch of tok){
      if(ch === ' '){
        seq.push(spaceEntry(table));
      } else {
        const loc = resolveCharLocation(ch, table);
        if(loc) seq.push(loc);
        else seq.push({ id: ch, layer: 'base', ch: ch });
      }
    }
  };

  // If examples are provided, strictly generate practice content from examples only
  if(examples && examples.length){
    // Pattern 1: Direct sequence (e.g. aa ;;)
    examples.forEach(ex => {
      pushToken(ex);
      seq.push(spaceEntry(table));
    });

    // Pattern 2: Doubled pairs (e.g. aa aa ;; ;;)
    examples.forEach(ex => {
      pushToken(ex);
      seq.push(spaceEntry(table));
      pushToken(ex);
      seq.push(spaceEntry(table));
    });

    // Pattern 3: Varied / reversed / alternating combinations (e.g. ;; aa ;; aa)
    if(examples.length >= 2){
      const rev = examples.slice().reverse();
      for(let r=0; r<2; r++){
        rev.forEach(ex => {
          pushToken(ex);
          seq.push(spaceEntry(table));
        });
      }
      for(let r=0; r<2; r++){
        examples.forEach(ex => {
          pushToken(ex);
          seq.push(spaceEntry(table));
        });
      }
    } else {
      for(let r=0; r<4; r++){
        pushToken(examples[0]);
        seq.push(spaceEntry(table));
      }
    }

    while(seq.length && seq[seq.length-1].ch === ' ') seq.pop();
    return seq;
  }

  // Fallback when no examples are provided: practice solely the new entries
  newEntries.forEach(e=>{
    for(let r=0;r<soloReps;r++) seq.push(e);
    seq.push(spaceEntry(table));
  });

  if(newEntries.length >= 2){
    for(let r=0;r<2;r++){
      newEntries.forEach(e=> seq.push(e));
      seq.push(spaceEntry(table));
    }
    newEntries.forEach(e=>{
      seq.push(e); seq.push(e);
      seq.push(spaceEntry(table));
    });
  }

  while(seq.length && seq[seq.length-1].ch === ' ') seq.pop();
  return seq;
}

/* Fixed-length combinations repeated `count` times with spaced rhythm.
   When examples are provided, repetition is kept strictly within the examples. */
function seqCombo(pool, comboLen, count, examples){
  const seq = [];
  if(examples && examples.length){
    const pushToken = (tok) => {
      for(const ch of tok){
        if(ch === ' ') seq.push(spaceEntry());
        else {
          const loc = resolveCharLocation(ch);
          if(loc) seq.push(loc);
        }
      }
    };
    const repeats = Math.max(2, Math.floor(count / examples.length));
    for(let i=0; i<repeats; i++){
      examples.forEach(ex => {
        pushToken(ex);
        seq.push(spaceEntry());
      });
    }
    while(seq.length && seq[seq.length-1].ch === ' ') seq.pop();
    return seq;
  }
  for(let i=0;i<count;i++){
    for(let c=0;c<comboLen;c++) seq.push(pickRandom(pool));
    seq.push(spaceEntry());
  }
  while(seq.length && seq[seq.length-1].ch === ' ') seq.pop();
  return seq;
}

/* Randomized drill/review/test sequence with natural spaced 2-3 character syllables. */
function seqRandom(pool, length){
  const seq = []; let lastCh = null;
  let wordLen = 0;
  let targetChunk = 2 + (Math.random() > 0.5 ? 1 : 0);
  for(let i=0;i<length;i++){
    let e, tries=0;
    do{ e = pickRandom(pool); tries++; } while(e.ch===lastCh && pool.length>1 && tries<10);
    lastCh = e.ch;
    seq.push(e);
    wordLen++;
    if(wordLen >= targetChunk && i < length - 1){
      seq.push(spaceEntry());
      wordLen = 0;
      targetChunk = 2 + (Math.random() > 0.5 ? 1 : 0);
    }
  }
  while(seq.length && seq[seq.length-1].ch === ' ') seq.pop();
  return seq;
}

function getTypingUnits(text, layoutId) {
  if (typeof splitIntoTypingUnits === 'function') {
    return splitIntoTypingUnits(text, layoutId);
  }
  if (typeof window !== 'undefined' && typeof window.splitIntoTypingUnits === 'function') {
    return window.splitIntoTypingUnits(text, layoutId);
  }
  if (typeof global !== 'undefined' && typeof global.splitIntoTypingUnits === 'function') {
    return global.splitIntoTypingUnits(text, layoutId);
  }
  if (!text) return [];
  const compoundList = (typeof KHMER_COMPOUND_VOWELS !== 'undefined')
    ? KHMER_COMPOUND_VOWELS
    : ((typeof window !== 'undefined' && window.KHMER_COMPOUND_VOWELS) || (typeof global !== 'undefined' && global.KHMER_COMPOUND_VOWELS) || ['\u17BB\u17C6', '\u17BB\u17C7', '\u17B6\u17C6', '\u17C1\u17C7', '\u17C4\u17C7']);
  const normFn = (typeof normalizeInput === 'function')
    ? normalizeInput
    : (typeof window !== 'undefined' && typeof window.normalizeInput === 'function' ? window.normalizeInput : (typeof global !== 'undefined' && typeof global.normalizeInput === 'function' ? global.normalizeInput : null));
  const normalized = normFn ? normFn(text) : String(text).normalize('NFD');
  const units = [];
  let i = 0;
  while (i < normalized.length) {
    if ((layoutId === 'nida' || layoutId === 'standard') && i + 1 < normalized.length) {
      const pair = normalized.slice(i, i + 2);
      if (compoundList.includes(pair)) {
        units.push(pair);
        i += 2;
        continue;
      }
    }
    const code = normalized.codePointAt(i);
    const ch = String.fromCodePoint(code);
    units.push(ch);
    i += ch.length;
  }
  return units;
}

function seqWords(words, table, layoutId){
  const seq = [];
  const layout = layoutId || ((table === KEY_BY_ID_NIDA || (typeof currentLayoutId !== 'undefined' && currentLayoutId === 'nida')) ? 'nida'
               : (table === KEY_BY_ID_EN || (typeof currentLayoutId !== 'undefined' && currentLayoutId === 'english')) ? 'english'
               : 'standard');
  shuffled(words).forEach(w=>{
    const units = getTypingUnits(w, layout);
    for(const u of units){
      const loc = resolveCharLocation(u, table);
      if(loc) seq.push(loc);
    }
    seq.push(spaceEntry(table));
  });
  while(seq.length && seq[seq.length-1].ch === ' ') seq.pop();
  return seq;
}
if(typeof window !== 'undefined') window.seqWords = seqWords;
if(typeof global !== 'undefined') global.seqWords = seqWords;

/* Intelligent mistake review: pairs each missed character with contrasting context keys.
   Never produces consecutive identical letters (e.g. never 'កក' or 'ក ក ក').
   Generates rhythmic, bite-sized Khmer syllables (2-3 chars) for maximum muscle memory. */
function seqReviewMistakes(missedEntries){
  if(!missedEntries || !missedEntries.length) return [];
  // Filter out any empty or whitespace entries
  const valid = missedEntries.filter(m => m && m.ch && m.ch.trim() !== '');
  const targets = valid.length ? valid : missedEntries;
  if(!targets.length) return [];

  const seq = [];
  function addWord(arr){
    if(!arr || !arr.length) return;
    for(let i=0; i<arr.length; i++){
      const item = arr[i];
      if(!item || !item.ch) continue;
      seq.push(item);
    }
    seq.push(spaceEntry());
  }

  if(targets.length === 1){
    const m = targets[0];
    // Rhythmic cadence drills exclusively on the single missed character
    addWord([m, m, m]);
    addWord([m]);
    addWord([m, m]);
    addWord([m, m, m]);
    addWord([m, m]);
    addWord([m]);
    addWord([m, m]);
    addWord([m, m, m]);
    addWord([m]);
    addWord([m, m]);
    addWord([m, m, m, m]);
    addWord([m, m]);
    addWord([m]);
  } else if(targets.length === 2){
    const m1 = targets[0];
    const m2 = targets[1];
    // Focused combinations purely between the two missed keys
    addWord([m1, m1, m1]);
    addWord([m2, m2, m2]);
    addWord([m1, m2]);
    addWord([m2, m1]);
    addWord([m1, m1, m2]);
    addWord([m2, m2, m1]);
    addWord([m1, m2, m1]);
    addWord([m2, m1, m2]);
    addWord([m1, m2]);
    addWord([m2, m1]);
    addWord([m1, m1]);
    addWord([m2, m2]);
    addWord([m1, m2, m1, m2]);
  } else {
    // 3 or more missed characters: isolated bursts followed by pure combinations
    targets.forEach(m => {
      addWord([m, m, m]);
    });
    for(let i = 0; i < targets.length; i++){
      const m1 = targets[i];
      const m2 = targets[(i + 1) % targets.length];
      addWord([m1, m2]);
      addWord([m2, m1]);
    }
    for(let i = 0; i < targets.length; i++){
      const m1 = targets[i];
      const m2 = targets[(i + 1) % targets.length];
      const m3 = targets[(i + 2) % targets.length];
      addWord([m1, m2, m3]);
    }
    for(let i = 0; i < targets.length; i++){
      const m1 = targets[i];
      const m2 = targets[(i + 1) % targets.length];
      addWord([m1, m1, m2]);
      addWord([m2, m2, m1]);
    }
  }

  while(seq.length && seq[seq.length-1].ch === ' ') seq.pop();
  return seq;
}

let LEVELS_STANDARD = [
  {id:1, title:'Level 1 · Home Row Basics'},
  {id:2, title:'Level 2 · Home Row Combinations'},
  {id:3, title:'Level 3 · Home Row + Shift'},
  {id:4, title:'Level 4 · Remaining Consonants'},
  {id:5, title:'Level 5 · Vowels & Signs'},
  {id:6, title:'Level 6 · Khmer Numerals'},
  {id:7, title:'Level 7 · Ctrl / AltGr Layers'},
  {id:8, title:'Level 8 · Full Keyboard & Mastery'},
];

let LEVELS_NIDA = [
  {id:1, title:'Level 1 · Beginner: Consonants & Core Vowels'},
  {id:2, title:'Level 2 · Intermediate: Subscripts (Coeng J)'},
  {id:3, title:'Level 3 · Advanced: Independent Vowels & Signs'},
  {id:4, title:'Level 4 · Master: Numerals & Fluid Prose'},
];

let LEVELS_ENGLISH = [
  {id:1, title:'Level 1 · Home Row Basics'},
  {id:2, title:'Level 2 · Home Row Combinations'},
  {id:3, title:'Level 3 · Top Row Reach'},
  {id:4, title:'Level 4 · Bottom Row Reach'},
  {id:5, title:'Level 5 · Shift Layer & Punctuation'},
  {id:6, title:'Level 6 · Full Keyboard Sentences'},
  {id:9, title:'Level 4 · Word Practice'},
];

window.LEVEL_SETS = LEVEL_SETS = {
  standard: LEVELS_STANDARD,
  nida: LEVELS_NIDA,
  english: LEVELS_ENGLISH,
};

window.LEVELS = LEVELS = LEVEL_SETS[currentLayoutId] || LEVELS_STANDARD;

function buildCourse(){
  const lessons = [];
  let nextId = 1;
  let pool = [];

  function addLesson(level, type, title, subtitle, generateFn, opts={}){
    const id = nextId++;
    const defaultThreshold = type==='test' ? 90 : type==='review' ? 88 : 85;
    lessons.push({
      id, level, type, title, subtitle,
      layer: opts.newLayer || 'base',
      threshold: opts.threshold ?? defaultThreshold,
      newIds: opts.newIds || [],
      newLayer: opts.newLayer || 'base',
      examples: opts.examples || [],
      generate: generateFn,
    });
    return id;
  }
  const modLabel = {base:'No modifier', shift:'Hold Shift', ctrl:'Hold Ctrl', altgr:'Hold AltGr'};

  /* ===== LEVEL 1 — Home Row Basics (Lessons 1-8) =====
     Starts strictly with Anchor Keys F & J (ថ & ញ). No G (ង) or H (ហ) until later! */

  // Lesson 1: Index Anchors F & J (Left Index = ថ, Right Index = ញ)
  {
    const ids = ['f', 'j'];
    const ex = ['ថ ថ', 'ញ ញ', 'ថថ ញញ', 'ថញ ញថ'];
    addLesson(1, 'intro', 'Home Row — Index Anchors (F & J)', 'Left Index F (ថ) · Right Index J (ញ)',
      ()=> materialize(seqIntro(entriesFromIds(ids,'base'), [], {soloReps:4, examples:ex})),
      {newIds:ids, newLayer:'base', examples:ex});
    pool = pool.concat(entriesFromIds(ids,'base'));
  }

  // Lesson 2: Middle Fingers D & K (Left Middle = ដ, Right Middle = ក)
  {
    const ids = ['d', 'k'];
    const ex = ['ដ ដ', 'ក ក', 'ដដ កក', 'ដក', 'កដ'];
    const priorSnap = pool.slice();
    addLesson(1, 'intro', 'Home Row — Middle Fingers (D & K)', 'Left Middle D (ដ) · Right Middle K (ក)',
      ()=> materialize(seqIntro(entriesFromIds(ids,'base'), priorSnap, {soloReps:4, examples:ex})),
      {newIds:ids, newLayer:'base', examples:ex});
    pool = pool.concat(entriesFromIds(ids,'base'));
  }

  // Lesson 3: 4 Keys Combined (F, J, D, K)
  {
    const ids = ['f', 'j', 'd', 'k'];
    const ex = ['ថដ', 'ញក', 'ដក', 'ថញ', 'កក', 'ដដ'];
    const snap = pool.slice();
    addLesson(1, 'combo', 'Home Row — 4 Keys Combined', 'Index & Middle Anchors · ថ ញ ដ ក',
      ()=> materialize(seqCombo(snap, 2, 8, ex)),
      {newIds:ids, newLayer:'base', examples:ex});
  }

  // Lesson 4: Index Reach G & H (Left Reach = ង, Right Reach = ហ)
  {
    const ids = ['g', 'h'];
    const ex = ['ង ង', 'ហ ហ', 'ថង', 'ញហ', 'ងហ', 'ហង'];
    const priorSnap = pool.slice();
    addLesson(1, 'intro', 'Home Row — Index Reach (G & H)', 'Left Reach G (ង) · Right Reach H (ហ)',
      ()=> materialize(seqIntro(entriesFromIds(ids,'base'), priorSnap, {soloReps:4, examples:ex})),
      {newIds:ids, newLayer:'base', examples:ex});
    pool = pool.concat(entriesFromIds(ids,'base'));
  }

  // Lesson 5: Center 6 Keys Combined (F, J, D, K, G, H)
  {
    const ids = ['g', 'h', 'f', 'j', 'd', 'k'];
    const ex = ['កក', 'ដក', 'ងហ', 'កង', 'ដង', 'ហង'];
    const snap = pool.slice();
    addLesson(1, 'combo', 'Home Row — Center 6 Keys', 'All Index & Middle Keys · ថ ញ ដ ក ង ហ',
      ()=> materialize(seqCombo(snap, 2, 9, ex)),
      {newIds:ids, newLayer:'base', examples:ex});
  }

  // Lesson 6: Ring Fingers S & L (Left Ring = ស, Right Ring = ល)
  {
    const ids = ['s', 'l'];
    const ex = ['ស ស', 'ល ល', 'សល', 'សក', 'លក', 'ហល'];
    const priorSnap = pool.slice();
    addLesson(1, 'intro', 'Home Row — Ring Fingers (S & L)', 'Left Ring S (ស) · Right Ring L (ល)',
      ()=> materialize(seqIntro(entriesFromIds(ids,'base'), priorSnap, {soloReps:4, examples:ex})),
      {newIds:ids, newLayer:'base', examples:ex});
    pool = pool.concat(entriesFromIds(ids,'base'));
  }

  // Lesson 7: Pinky Fingers & Vowel A (A, ;, ')
  {
    const ids = ['a', 'semicolon', 'quote'];
    const ex = ['កា', 'សា', 'ដា', 'លះ', 'សះ', 'កះ'];
    const priorSnap = pool.slice();
    addLesson(1, 'intro', "Home Row — Pinky Keys & Vowel A", "Left Pinky A (ា) · Right Pinky ; (ះ) & ' (់)",
      ()=> materialize(seqIntro(entriesFromIds(ids,'base'), priorSnap, {soloReps:4, examples:ex})),
      {newIds:ids, newLayer:'base', examples:ex});
    pool = pool.concat(entriesFromIds(ids,'base'));
  }

  // Lesson 8: Home Row Words — First real Khmer words entirely from Home Row!
  {
    const ids = ['f','j','d','k','g','h','s','l','a','semicolon','quote'];
    const ex = ['សាលា', 'កាក់', 'ដាក់', 'ហាល', 'កាល', 'ដក', 'កក', 'កា', 'សា'];
    addLesson(1, 'words', 'Home Row Words — Complete Home Row', 'Real Khmer words from Home Row keys',
      ()=> materialize(seqWords(ex)),
      {newIds:ids, newLayer:'base', examples:ex});
  }

  /* ===== LEVEL 2 — Home Row Combinations & Speed ===== */
  {
    const snap = pool.slice();
    const ex2 = ['កា', 'ដក', 'សា', 'លក', 'ថញ', 'ងហ'];
    addLesson(2,'combo','Two-Character Combos','Pairs drawn from the Home Row',
      ()=> materialize(seqCombo(snap, 2, 12, ex2)), {examples:ex2});

    const ex3 = ['កាក់', 'ដាក់', 'ហាល', 'កាល', 'ងាក'];
    addLesson(2,'combo','Three-Character Syllables','Triples and syllables from Home Row',
      ()=> materialize(seqCombo(snap, 3, 10, ex3)), {examples:ex3});

    const ex4 = ['សាលា', 'កកកក', 'ហាលកាល', 'ដកដាក់'];
    addLesson(2,'combo','Four-Character Flow','Four-character groups and words',
      ()=> materialize(seqCombo(snap, 4, 8, ex4)), {examples:ex4});

    const exWords = ['សាលា', 'កាក់', 'ដាក់', 'ហាល', 'កាល', 'ដក', 'កក', 'សះ', 'លះ'];
    addLesson(2,'words','Home Row Words Drill','Real Khmer vocabulary, typed from memory',
      ()=> materialize(seqWords(exWords)), {examples:exWords});

    addLesson(2,'review','Random Home Row Drill','Fully randomized order across all home keys',
      ()=> materialize(seqRandom(snap, 28)), {examples:['ថ', 'ញ', 'ដ', 'ក', 'ង', 'ហ', 'ស', 'ល']});

    addLesson(2,'test','Home Row Speed Test','Type as fast and accurately as you can',
      ()=> materialize(seqRandom(snap, 32)), {threshold:90, examples:['កាក់', 'ដាក់', 'សាលា', 'ហាល']});
  }

  /* ===== LEVEL 3 — Home Row + Shift ===== */
  const homeShiftGroups = [
    {label:'Index Anchors (F & J)', ids:['f','j'], ex:['ធ ធ', 'ុំ ុំ', 'ធុំ']},
    {label:'Middle Fingers (D & K)', ids:['d','k'], ex:['ឌ ឌ', 'គ គ', 'គក', 'ឌក']},
    {label:'Index Reach (G & H)', ids:['g','h'], ex:['ុះ ុះ', '៏ ៏']},
    {label:'Ring Fingers (S & L)', ids:['s','l'], ex:['ាំ ាំ', 'ឡ ឡ', 'ឡា']},
    {label:'Pinky Fingers (A, ;, \')', ids:['a','semicolon','quote'], ex:['ៃ ៃ', '៖ ៖', '៉ ៉', 'ដៃ']},
  ];
  homeShiftGroups.forEach(grp=>{
    const priorSnap = pool.slice();
    addLesson(3,'intro', `Home Row Shift — ${grp.label}`, `${modLabel.shift} · ${grp.ids.map(keyLabel).join(' ')}`,
      ()=> materialize(seqIntro(entriesFromIds(grp.ids,'shift'), priorSnap, {soloReps:4, examples:grp.ex})),
      {newIds:grp.ids, newLayer:'shift', examples:grp.ex});
    pool = pool.concat(entriesFromIds(grp.ids,'shift'));
  });
  {
    const snap = pool.slice();
    addLesson(3,'combo','Home Row + Shift Mix','Base and Shift characters mixed together',
      ()=> materialize(seqRandom(snap, 24)), {examples:['ធំ', 'គក', 'ឡា', 'ដៃ']});
    addLesson(3,'combo','Shift Combinations','Short combos using Shift characters',
      ()=> materialize(seqCombo(snap, 2, 10, ['ធុំ', 'គក'])), {examples:['ធុំ', 'គក']});
    addLesson(3,'test','Home Row + Shift Test','Accuracy test across Base and Shift',
      ()=> materialize(seqRandom(snap, 30)), {threshold:90, examples:['ធ', 'គ', 'ឌ', 'ឡ', 'ៃ']});
  }

  /* ===== LEVEL 4 — Remaining Consonants ===== */
  const remConsonantGroups = [
    {label:'Top Left (Q, T, Y)', ids:['q','t','y'], ex:['ឈ', 'ទ', 'យ', 'យាយ']},
    {label:'Top Right (P, R, Z)', ids:['p','r','z'], ex:['ផ', 'រ', 'ឋ', 'រាជា']},
    {label:'Bottom Left (X, C, V)', ids:['x','c','v'], ex:['ខ', 'ច', 'វ', 'ខាន', 'ចាន']},
    {label:'Bottom Right (B, N, M, ,)', ids:['b','n','m','comma'], ex:['ប', 'ន', 'ម', 'អ', 'មាន', 'បាន']},
  ];
  remConsonantGroups.forEach((grp, gi)=>{
    const priorSnap = pool.slice();
    addLesson(4,'intro', `Consonants: ${grp.label}`, `${modLabel.base} · ${grp.ids.map(keyLabel).join(' ')}`,
      ()=> materialize(seqIntro(entriesFromIds(grp.ids,'base'), priorSnap, {soloReps:4, examples:grp.ex})),
      {newIds:grp.ids, newLayer:'base', examples:grp.ex});
    pool = pool.concat(entriesFromIds(grp.ids,'base'));
    const snap2 = pool.slice();
    addLesson(4,'combo', `Consonants ${gi+1} — Mixed Practice`, 'New characters mixed with everything learned',
      ()=> materialize(seqRandom(snap2, 20)), {examples:grp.ex});
  });

  /* ===== LEVEL 5 — Vowels & Signs ===== */
  const vowelGroups = [
    {label:'Vowels I & W (ិ & ឹ)', ids:['i','w'], ex:['តិច', 'ទឹក']},
    {label:'Vowels U & E (ុ & េ)', ids:['u','e'], ex:['ទុក', 'ដេក']},
    {label:'Vowels O & Brackets (ោ & ៀ / ឿ)', ids:['o','bracketL','bracketR'], ex:['គោ', 'រៀន']},
  ];
  vowelGroups.forEach((grp, gi)=>{
    let priorSnap = pool.slice();
    addLesson(5,'intro', `Vowels: ${grp.label}`, `${modLabel.base} · ${grp.ids.map(keyLabel).join(' ')}`,
      ()=> materialize(seqIntro(entriesFromIds(grp.ids,'base'), priorSnap, {soloReps:4, examples:grp.ex})),
      {newIds:grp.ids, newLayer:'base', examples:grp.ex});
    pool = pool.concat(entriesFromIds(grp.ids,'base'));

    priorSnap = pool.slice();
    const shiftEntries = entriesFromIds(grp.ids,'shift');
    if(shiftEntries.length){
      addLesson(5,'intro', `Vowels: ${grp.label} (Shift)`, `${modLabel.shift} · ${grp.ids.map(keyLabel).join(' ')}`,
        ()=> materialize(seqIntro(shiftEntries, priorSnap, {soloReps:4, examples:grp.ex})),
        {newIds:grp.ids, newLayer:'shift', examples:grp.ex});
      pool = pool.concat(shiftEntries);
    }
  });
  {
    const snap = pool.slice();
    addLesson(5,'combo','Vowels & Signs — Mixed Practice','Mixed with everything learned so far',
      ()=> materialize(seqRandom(snap, 26)), {examples:['ទឹក', 'ដេក', 'រៀន', 'មាន']});
    addLesson(5,'review','Review — Vowels & Signs','Only previously learned characters',
      ()=> materialize(seqRandom(snap, 28)), {examples:['ទឹក', 'រៀន', 'គោ']});
    addLesson(5,'test','Vowel & Sign Test','All vowels and signs learned so far',
      ()=> materialize(seqRandom(snap, 32)), {threshold:90, examples:['ទឹក', 'រៀន', 'គោ', 'ដេក']});
  }

  /* ===== LEVEL 6 — Khmer Numerals ===== */
  const numeralIds = ['k1','k2','k3','k4','k5','k6','k7','k8','k9','k0'];
  const numeralSteps = [
    {count:2, ex:['១', '២', '១២']},
    {count:4, ex:['៣', '៤', '៣៤', '១២៣']},
    {count:6, ex:['៥', '៦', '៥៦', '២០២៦']},
    {count:8, ex:['៧', '៨', '៧៨']},
    {count:10, ex:['៩', '០', '១០០', '២០២៦']},
  ];
  let taughtCount = 0;
  numeralSteps.forEach(step=>{
    const newIds = numeralIds.slice(taughtCount, step.count);
    const priorSnap = pool.slice();
    const isLast = step.count===10;
    const label = isLast ? 'All Numerals (១-០)' : `Numerals: ${step.count} Digits`;
    addLesson(6, isLast ? 'test' : 'intro', label,
      newIds.length ? `${modLabel.base} · ${newIds.map(keyLabel).join(' ')}` : 'The complete numeral set',
      ()=> materialize(seqIntro(entriesFromIds(newIds,'base'), priorSnap, {soloReps:4, mixWithPrior: taughtCount ? 6 : 0, examples:step.ex})),
      {newIds, newLayer:'base', threshold: isLast ? 90 : 85, examples:step.ex});
    pool = pool.concat(entriesFromIds(newIds,'base'));
    taughtCount = step.count;
  });

  /* ===== LEVEL 7 — Ctrl / AltGr Layers ===== */
  const ctrlIds = ['grave','k1','k2','k3','k4','k5','k7','k0','minus','semicolon','quote','backslash','m','comma','period','slash'];
  const ctrlChunks = [
    {name:'Ctrl Basics', ids:ctrlIds.slice(0,6), ex:['« »', '–']},
    {name:'Ctrl Practice', ids:ctrlIds.slice(6,11), ex:['៖', '’']},
    {name:'Ctrl Mixed Practice', ids:ctrlIds.slice(11), ex:['”', '…']},
  ];
  ctrlChunks.forEach(chunk=>{
    const priorSnap = pool.slice();
    addLesson(7,'intro', chunk.name, `${modLabel.ctrl} · ${chunk.ids.map(keyLabel).join(' ')}`,
      ()=> materialize(seqIntro(entriesFromIds(chunk.ids,'ctrl'), priorSnap, {soloReps:4, examples:chunk.ex})),
      {newIds:chunk.ids, newLayer:'ctrl', examples:chunk.ex});
    pool = pool.concat(entriesFromIds(chunk.ids,'ctrl'));
  });
  const altgrIds = ['e','r','t','u','i','o','p','a','s','j','k','l','quote','backslash'];
  const altgrChunks = [
    {name:'AltGr Basics', ids:altgrIds.slice(0,5), ex:['៛', '៚']},
    {name:'AltGr Practice', ids:altgrIds.slice(5,10), ex:['ឮ', 'ឭ']},
    {name:'AltGr Mixed Practice', ids:altgrIds.slice(10), ex:['ឰ', 'ឪ']},
  ];
  altgrChunks.forEach(chunk=>{
    const priorSnap = pool.slice();
    addLesson(7,'intro', chunk.name, `${modLabel.altgr} · ${chunk.ids.map(keyLabel).join(' ')}`,
      ()=> materialize(seqIntro(entriesFromIds(chunk.ids,'altgr'), priorSnap, {soloReps:4, examples:chunk.ex})),
      {newIds:chunk.ids, newLayer:'altgr', examples:chunk.ex});
    pool = pool.concat(entriesFromIds(chunk.ids,'altgr'));
  });
  {
    const ctrlAltgrPool = entriesFromIds(ctrlIds,'ctrl').concat(entriesFromIds(altgrIds,'altgr'));
    addLesson(7,'test','Ctrl + AltGr Review','Mixed Ctrl and AltGr characters',
      ()=> materialize(seqRandom(ctrlAltgrPool, 24)), {threshold:88, examples:['៛', '៚', 'ឮ', 'ឭ']});
  }

  /* ===== LEVEL 8 — Full Keyboard & Mastery ===== */
  {
    const fullWords = ['អាវ','តា','យាយ','មាន','ខាន','បាន','ចាន','តារា','កាច','សាលា','ទឹក','រៀន'];
    addLesson(8,'words','Word Practice','Real Khmer words, typed from memory',
      ()=> materialize(seqWords(fullWords)), {examples:fullWords.slice(0, 5)});

    const fullPool = pool.slice();
    addLesson(8,'combo','Full Keyboard — Warm-up','Random characters across the whole keyboard',
      ()=> materialize(seqRandom(fullPool, 28)), {examples:['សាលា', 'កាក់', 'ទឹក']});
    addLesson(8,'combo','Full Keyboard — Combos','Longer combinations across every layer',
      ()=> materialize(seqCombo(fullPool, 4, 8, ['សាលា', 'កាក់'])), {examples:['សាលា', 'កាក់']});

    const homeRowIds = ['f','j','d','k','g','h','s','l','a','semicolon','quote'];
    addLesson(8,'test','Home Row Test','Final test — Home Row only',
      ()=> materialize(seqRandom(entriesFromIds(homeRowIds,'base'), 26)), {threshold:92, examples:['កាក់', 'សាលា', 'ដាក់']});
    addLesson(8,'test','Home Row + Shift Test','Final test — Home Row, Base + Shift',
      ()=> materialize(seqRandom(fullPool.filter(e=> homeRowIds.includes(e.id)), 28)), {threshold:92, examples:['ធ', 'ុំ', 'ឌ', 'គ']});
    addLesson(8,'test','Khmer Character Test','Final test — all consonants & vowels',
      ()=> materialize(seqRandom(fullPool.filter(e=> e.layer==='base'||e.layer==='shift'), 32)), {threshold:90, examples:['រៀន', 'ទឹក', 'សាលា']});
    addLesson(8,'test','Khmer Numeral Test','Final test — all numerals',
      ()=> materialize(seqRandom(entriesFromIds(numeralIds,'base'), 22)), {threshold:92, examples:['១២៣', '២០២៦']});
    addLesson(8,'test','Full Keyboard Test','Final test — every layer combined',
      ()=> materialize(seqRandom(fullPool, 36)), {threshold:90, examples:['សាលា', '១២៣', '៛']});
    addLesson(8,'test','Final Khmer Typing Test','The ultimate test — words, then the full keyboard',
      ()=> materialize(seqWords(fullWords).concat(seqRandom(fullPool, 18))), {threshold:90, examples:['សាលា', 'ទឹក', 'រៀន']});
  }

  return lessons;
}

/* Home-row-only course reused for NiDA and English layouts */
function buildHomeRowCourse(table, idOffset, wordBank){
  const lessons = [];
  let nextId = idOffset + 1;
  let pool = [];

  function addLesson(level, type, title, subtitle, generateFn, opts={}){
    const id = nextId++;
    const defaultThreshold = type==='test' ? 90 : type==='review' ? 88 : 85;
    lessons.push({
      id, level, type, title, subtitle,
      layer: opts.newLayer || 'base',
      threshold: opts.threshold ?? defaultThreshold,
      newIds: opts.newIds || [],
      newLayer: opts.newLayer || 'base',
      examples: opts.examples || [],
      generate: generateFn,
    });
    return id;
  }
  const modLabel = {base:'No modifier', shift:'Hold Shift'};

  // 1. F & J
  {
    const ids = ['f', 'j'];
    const ex = entriesFromIds(ids, 'base', table).map(e=> e.ch + e.ch);
    addLesson(1, 'intro', 'Home Row — Index Anchors (F & J)', `${modLabel.base} · ${ids.map(keyLabel).join(' ')}`,
      ()=> materialize(seqIntro(entriesFromIds(ids,'base',table), [], {soloReps:4, examples:ex, table})),
      {newIds:ids, newLayer:'base', examples:ex});
    pool = pool.concat(entriesFromIds(ids,'base',table));
  }
  // 2. D & K
  {
    const ids = ['d', 'k'];
    const ex = entriesFromIds(ids, 'base', table).map(e=> e.ch + e.ch);
    addLesson(1, 'intro', 'Home Row — Middle Fingers (D & K)', `${modLabel.base} · ${ids.map(keyLabel).join(' ')}`,
      ()=> materialize(seqIntro(entriesFromIds(ids,'base',table), [], {soloReps:4, examples:ex, table})),
      {newIds:ids, newLayer:'base', examples:ex});
    pool = pool.concat(entriesFromIds(ids,'base',table));
  }
  // 3. F, J, D, K Combos
  {
    const ids = ['f', 'j', 'd', 'k'];
    const snap = pool.slice();
    addLesson(1, 'combo', 'Home Row — 4 Keys Combined', 'Index & Middle · F J D K',
      ()=> materialize(seqCombo(snap, 2, 8)),
      {newIds:ids, newLayer:'base', examples:[]});
  }
  // 4. S & L
  {
    const ids = ['s', 'l'];
    const ex = entriesFromIds(ids, 'base', table).map(e=> e.ch + e.ch);
    addLesson(1, 'intro', 'Home Row — Ring Fingers (S & L)', `${modLabel.base} · ${ids.map(keyLabel).join(' ')}`,
      ()=> materialize(seqIntro(entriesFromIds(ids,'base',table), [], {soloReps:4, examples:ex, table})),
      {newIds:ids, newLayer:'base', examples:ex});
    pool = pool.concat(entriesFromIds(ids,'base',table));
  }
  // 5. Pinkies A & ;
  {
    const ids = ['a', 'semicolon'];
    const ex = entriesFromIds(ids, 'base', table).map(e=> e.ch + e.ch);
    addLesson(1, 'intro', 'Home Row — Pinky Fingers (A & ;)', `${modLabel.base} · ${ids.map(keyLabel).join(' ')}`,
      ()=> materialize(seqIntro(entriesFromIds(ids,'base',table), [], {soloReps:4, examples:ex, table})),
      {newIds:ids, newLayer:'base', examples:ex});
    pool = pool.concat(entriesFromIds(ids,'base',table));
  }
  // 6. Core 8-Key Combos
  {
    const ids = ['a', 's', 'd', 'f', 'j', 'k', 'l', 'semicolon'];
    const snap = pool.slice();
    addLesson(1, 'combo', 'Home Row — 8 Core Keys Combined', 'Pinkies to Anchors · A S D F J K L ;',
      ()=> materialize(seqCombo(snap, 2, 8)),
      {newIds:ids, newLayer:'base', examples:[]});
  }
  // 7. G & H (Index Reaches from Anchors)
  {
    const ids = ['g', 'h'];
    const ex = entriesFromIds(ids, 'base', table).map(e=> e.ch + e.ch);
    addLesson(2, 'intro', 'Home Row — Index Reach (G & H)', `${modLabel.base} · ${ids.map(keyLabel).join(' ')}`,
      ()=> materialize(seqIntro(entriesFromIds(ids,'base',table), [], {soloReps:4, examples:ex, table})),
      {newIds:ids, newLayer:'base', examples:ex});
    pool = pool.concat(entriesFromIds(ids,'base',table));
  }

  // Level 2 Combos & Tests
  {
    const snap = pool.slice();
    addLesson(2,'combo','Two-Character Combos','Pairs drawn from the Home Row', ()=> materialize(seqCombo(snap, 2, 12)));
    addLesson(2,'combo','Three-Character Combos','Triples drawn from the Home Row', ()=> materialize(seqCombo(snap, 3, 10)));
    addLesson(2,'review','Random Home Row Drill','Fully randomized order', ()=> materialize(seqRandom(snap, 28)));
    addLesson(2,'test','Home Row Speed Test','Type as fast and accurately as you can', ()=> materialize(seqRandom(snap, 32)), {threshold:90});
  }

  // Level 3 Shift
  const shiftEntries = entriesFromIds(['f','j','d','k','g','h','s','l','a','semicolon'], 'shift', table);
  if(shiftEntries.length){
    const priorSnap = pool.slice();
    addLesson(3, 'intro', 'Home Row Shift', 'Hold Shift · Home row keys',
      ()=> materialize(seqIntro(shiftEntries, priorSnap, {soloReps:4, table})),
      {newIds:shiftEntries.map(e=>e.id), newLayer:'shift'});
    pool = pool.concat(shiftEntries);
    const snap = pool.slice();
    addLesson(3,'test','Home Row + Shift Test','Accuracy test across Base and Shift', ()=> materialize(seqRandom(snap, 30)), {threshold:90});
  }

  // Words
  if(wordBank && wordBank.length){
    addLesson(9,'words','Word Practice','Real words, typed from memory', ()=> materialize(seqWords(wordBank, table)), {examples:wordBank.slice(0,4)});
  }

  return lessons;
}

/* Complete, pedagogical 4-level Khmer NiDA typing course */
function buildNidaCourse(){
  const lessons = [];
  let nextId = 10001;
  const table = KEY_BY_ID_NIDA;

  function addLesson(level, type, title, subtitle, generateFn, opts={}){
    const id = nextId++;
    const defaultThreshold = type==='test' ? 90 : type==='review' ? 88 : 85;
    lessons.push({
      id, level, type, title, subtitle,
      layer: opts.newLayer || 'base',
      threshold: opts.threshold ?? defaultThreshold,
      newIds: opts.newIds || [],
      newLayer: opts.newLayer || 'base',
      examples: opts.examples || [],
      generate: generateFn,
    });
    return id;
  }

  /* ===== LEVEL 1: Beginner — Foundation & Home Row ===== */

  // Lesson 10001 (Level 1, intro): Home Row Consonant Anchors
  {
    const ids = ['k', 'j', 'd', 'f', 'g', 'h', 'l', 's'];
    const ex = ['កក', 'គក', 'ដក', 'ថក', 'ធរ', 'សស', 'ហល', 'អក', 'ញញ'];
    addLesson(1, 'intro', 'Home Row — Consonant Anchors', 'K, J, D, F, H, L, S, G & Shift Consonants',
      () => materialize(seqWords(ex, table)),
      { newIds: ids, newLayer: 'base', examples: ex });
  }

  // Lesson 10002 (Level 1, intro): Home Row Vowels & Syllables
  {
    const ids = ['a', 'semicolon', 'quote', 'h'];
    const ex = ['កា', 'គា', 'ដា', 'ថាំ', 'សៃ', 'ដើ', 'គោះ', 'ដាក់', 'កាក់', 'សះ'];
    addLesson(1, 'intro', 'Home Row — Vowels & Syllables', 'ា, ាំ, ៃ, ើ, ោះ, ់, ះ',
      () => materialize(seqWords(ex, table)),
      { newIds: ids, newLayer: 'base', examples: ex });
  }

  // Lesson 10003 (Level 1, intro): Top Row Consonants & Core Vowels
  {
    const ids = ['t', 'r', 'y', 'u', 'i', 'o', 'e', 'w', 'q', 'p'];
    const ex = ['ទៅ', 'មក', 'រត់', 'យូរ', 'ទិញ', 'ពីរ', 'ដេក', 'ដែក', 'កូន', 'ដើរ', 'ឆាប់', 'ភ្នំ'];
    addLesson(1, 'intro', 'Top Row — Consonants & Core Vowels', 'T, R, Y, U, I, O, E, W, Q, P & Vowels',
      () => materialize(seqWords(ex, table)),
      { newIds: ids, newLayer: 'base', examples: ex });
  }

  // Lesson 10004 (Level 1, review): Bottom Row Consonants & Nasals
  {
    const ids = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
    const ex = ['បង', 'ពូ', 'ជន', 'ចៅ', 'ខំ', 'វា', 'ចេក', 'ពាន', 'មាត់', 'ចំណី', 'ពិភព'];
    addLesson(1, 'review', 'Bottom Row — Consonants & Nasals', 'Z, X, C, V, B, N, M & Syllable Review',
      () => materialize(seqWords(ex, table)),
      { newIds: ids, newLayer: 'base', examples: ex });
  }

  /* ===== LEVEL 2: Intermediate — Subscripts & Coeng J System ===== */

  // Lesson 10005 (Level 2, intro): Subscripts — Coeng Key (J = ្)
  {
    const ids = ['j'];
    const ex = ['ត្រី', 'ក្រៅ', 'ខ្លា', 'ឆ្កែ', 'ផ្លូវ', 'ម្ហូប', 'ស្ងួត', 'ក្បាល'];
    addLesson(2, 'intro', 'Subscripts — Coeng Key (J = ្)', 'Base Consonant + J (្) + Subscript',
      () => materialize(seqWords(ex, table)),
      { newIds: ids, newLayer: 'base', examples: ex });
  }

  // Lesson 10006 (Level 2, combo): Subscripts — Shifted Consonants
  {
    const ids = ['j', 'k', 'x', 'c', 't', 'f', 'p', 'g'];
    const ex = ['ស្គាល់', 'ស្អាត', 'កម្ពុជា', 'បញ្ជី', 'សង្ឃ', 'សម្បត្តិ', 'បន្ទប់'];
    addLesson(2, 'combo', 'Subscripts — Shifted Consonants', 'J (្) followed by Shifted Consonants (្គ, ្ឃ, ្ជ, ្ទ, ្ធ, ្ភ, ្អ)',
      () => materialize(seqWords(ex, table)),
      { newIds: ids, newLayer: 'base', examples: ex });
  }

  // Lesson 10007 (Level 2, words): Subscripts — Complex Vowels
  {
    const ids = ['bracketL', 'y', 'v', 'o'];
    const ex = ['ត្រៀម', 'ខ្មៅ', 'ឆ្លើយ', 'ភ្លើង', 'ជ្រៅ', 'ក្មេង', 'ស្លៀក', 'ព្រៃ', 'ជ្រឿន', 'ព្រួយ'];
    addLesson(2, 'words', 'Subscripts — Complex Vowels', 'Sequential Typing: Consonant + Coeng + Vowel',
      () => materialize(seqWords(ex, table)),
      { newIds: ids, newLayer: 'base', examples: ex });
  }

  // Lesson 10008 (Level 2, test): Advanced Subscript Clusters
  {
    const ex = ['សង្គ្រាម', 'កន្ត្រៃ', 'អន្តរជាតិ', 'មន្ត្រី', 'សាស្ត្រា', 'កណ្តុរ', 'សម្ព័ន្ធ'];
    addLesson(2, 'test', 'Advanced Subscript Clusters', 'Multi-Tier Clusters & Compound Orthography',
      () => materialize(seqWords(ex, table)),
      { examples: ex, threshold: 90 });
  }

  /* ===== LEVEL 3: Advanced — Independent Vowels & Diacritics ===== */

  // Lesson 10009 (Level 3, intro): Independent Vowels (ស្រៈពេញតួ)
  {
    const ids = ['minus', 'equal', 'bracketR', 'backslash'];
    const ex = ['ឥឡូវ', 'ឪពុក', 'ឲ្យ', 'ឧត្តម', 'ឱកាស', 'ឯកសារ', 'ឬស្សី', 'ឮសូរ'];
    addLesson(3, 'intro', 'Independent Vowels (ស្រៈពេញតួ)', 'ឥ, ឲ, ឪ, ឧ, ឯ, ឱ, ឦ, ឫ, ឬ, ឮ, ឭ',
      () => materialize(seqWords(ex, table)),
      { newIds: ids, newLayer: 'base', examples: ex });
  }

  // Lesson 10010 (Level 3, intro): Consonant Shifters (មូសិកទន្ត & ត្រីស័ព្ទ)
  {
    const ids = ['quote', 'slash'];
    const ex = ['ប៉ា', 'ម៉ាក់', 'ស៊ុប', 'ហ៊ាន', 'ប៉ះ', 'ម៉ោង', 'ស៊ី', 'ហ៊ីង'];
    addLesson(3, 'intro', 'Consonant Shifters & Registers', 'Muusikatoan (Shift+\') & Triisap (/)',
      () => materialize(seqWords(ex, table)),
      { newIds: ids, newLayer: 'shift', examples: ex });
  }

  // Lesson 10011 (Level 3, combo): Diacritical Marks & Tone Signs
  {
    const ids = ['k6', 'k7', 'k8', 'minus', 'quote'];
    const ex = ['ទូរស័ព្ទ', 'អាទិត្យ', 'ដ៏ល្អ', 'ព័ត៌មាន', 'សព្វថ្ងៃ', 'ប្រយ័ត្ន'];
    addLesson(3, 'combo', 'Diacritical Marks & Tone Signs', 'Tandakhât (៍), Samiyok Sanna (័), Asda (៏), Robat (៌)',
      () => materialize(seqWords(ex, table)),
      { newIds: ids, newLayer: 'shift', examples: ex });
  }

  // Lesson 10012 (Level 3, test): Advanced Vocabulary & Diacritic Mastery
  {
    const ex = ['ឯកឧត្តម', 'ព័ត៌មានវិទ្យា', 'ទូរស័ព្ទដៃ', 'ថ្ងៃអាទិត្យ', 'ស៊ុបមាន់', 'ប៉ះពាល់', 'ប្រយ័ត្នប្រយែង'];
    addLesson(3, 'test', 'Advanced Vocabulary & Diacritic Mastery', 'Integrating Shifters, Signs & Independent Vowels',
      () => materialize(seqWords(ex, table)),
      { examples: ex, threshold: 90 });
  }

  /* ===== LEVEL 4: Master — Numerals, Punctuation & Fluency ===== */

  // Lesson 10013 (Level 4, intro): Khmer Numerals & Symbols
  {
    const ids = ['k1', 'k2', 'k3', 'k4', 'k5', 'k6', 'k7', 'k8', 'k9', 'k0'];
    const ex = ['១២៣៤៥', '៦៧៨៩០', '៥០០០៛', '២៥០០០៛', 'ផ្សេងៗ', 'ញឹកៗ', 'តិចៗ', '២០២៦'];
    addLesson(4, 'intro', 'Khmer Numerals & Symbols', '១ ២ ៣ ៤ ៥ ៦ ៧ ៨ ៩ ០ & ៛, ៗ',
      () => materialize(seqWords(ex, table)),
      { newIds: ids, newLayer: 'base', examples: ex });
  }

  // Lesson 10014 (Level 4, combo): Khmer Punctuation & Quotations
  {
    const ids = ['period', 'grave', 'semicolon'];
    const ex = ['«ចំណេះវិជ្ជាជាទ្រព្យ»។', 'សួស្តី! តើសុខសប្បាយទេ?', 'ភ្នំពេញ៖ រាជធានីនៃកម្ពុជា។'];
    addLesson(4, 'combo', 'Khmer Punctuation & Quotations', 'Khan (.), Bariyoosan (Shift+.), Quotes (« »), Colon (៖)',
      () => materialize(seqWords(ex, table)),
      { newIds: ids, newLayer: 'base', examples: ex });
  }

  // Lesson 10015 (Level 4, words): Fluent Practical Sentences
  {
    const ex = [
      'ខ្ញុំរៀនវាយអក្សរខ្មែរលើកុំព្យូទ័រ។',
      'ភាសាខ្មែរមានអក្សរស្រស់ស្អាតណាស់។',
      'សាលារៀននៅជិតផ្ទះរបស់ខ្ញុំ។',
      'យើងទាំងអស់គ្នាស្រឡាញ់ប្រទេសកម្ពុជា។'
    ];
    addLesson(4, 'words', 'Fluent Practical Sentences', 'Everyday Khmer Prose & Proper Spacing',
      () => materialize(seqWords(ex, table)),
      { examples: ex });
  }

  // Lesson 10016 (Level 4, test): Comprehensive Khmer NiDA Speed & Mastery Test
  {
    const ex = [
      'ភាសាខ្មែរជាភាសាផ្លូវការនៃព្រះរាជាណាចក្រកម្ពុជា។',
      'ការហ្វឹកហាត់វាយអក្សរលើក្តារចុចនីដាជួយឱ្យយើងវាយបានរហ័សនិងត្រឹមត្រូវ។',
      'ចូរអង្គុយឱ្យត្រង់ខ្លួន ហើយដាក់ម្រាមដៃលើជួរដេកដើមជានិច្ច។'
    ];
    addLesson(4, 'test', 'Comprehensive Khmer NiDA Mastery Test', 'Full Keyboard Navigation, Accuracy & Speed',
      () => materialize(seqWords(ex, table)),
      { examples: ex, threshold: 92 });
  }

  return lessons;
}

function createLessonModel(rawLesson, exercisesMap, layoutId, levelObj){
  let newIds = [];
  let newLayer = 'base';
  if(Array.isArray(rawLesson.newKeys)){
    newIds = rawLesson.newKeys.map(k => (typeof k === 'string' ? k : (k.keyId || ''))).filter(Boolean);
    if(rawLesson.newKeys[0] && typeof rawLesson.newKeys[0] === 'object' && rawLesson.newKeys[0].layer){
      newLayer = rawLesson.newKeys[0].layer;
    }
  }

  const refs = rawLesson.exerciseRefs || rawLesson.exercises || [];
  const hasExplicitExamples = Array.isArray(rawLesson.examples) && rawLesson.examples.length > 0;
  const examples = hasExplicitExamples ? rawLesson.examples.slice() : [];

  const threshold = rawLesson.accuracyTarget
    || (rawLesson.masteryCriteria && rawLesson.masteryCriteria.accuracy)
    || rawLesson.threshold
    || 85;

  return {
    id: rawLesson.id,
    level: rawLesson.level,
    title: rawLesson.title,
    titleKm: rawLesson.titleKm || rawLesson.title,
    subtitle: rawLesson.subtitle || rawLesson.description || (levelObj ? levelObj.title : ''),
    type: rawLesson.type || 'drill',
    threshold: threshold,
    newKeys: Array.isArray(rawLesson.newKeys) ? rawLesson.newKeys.slice() : [],
    newIds: newIds,
    newLayer: newLayer,
    layoutId: layoutId,
    examples: examples,
    hasExplicitExamples: hasExplicitExamples,
    unlockRequirements: rawLesson.unlockRequirements || null,
    generate: function(){
      const currentTable = (layoutId === 'nida') ? KEY_BY_ID_NIDA
        : (layoutId === 'english') ? KEY_BY_ID_EN
        : KEY_BY_ID;
      const entries = [];
      const sections = [];
      let unitOffset = 0;

      // When explicit examples are defined, LESSON EXAMPLES is the strict source of truth.
      // Every character generated must strictly be among the characters in examples.
      let allowedChars = null;
      if(hasExplicitExamples && examples.length){
        allowedChars = new Set();
        examples.forEach(ex => {
          for(const ch of String(ex)) allowedChars.add(ch);
        });
        allowedChars.add(' ');
      }

      refs.forEach((eid, idx) => {
        const ex = exercisesMap[eid];
        if(!ex || !ex.content) return;
        let rawContent = Array.isArray(ex.content) ? ex.content.join(' ') : ex.content;
        if(!rawContent) return;

        // If explicit examples govern this lesson, filter out unauthorized words
        if(allowedChars){
          const validWords = rawContent.split(/\s+/).filter(w => {
            if(!w) return false;
            for(const c of w){
              if(!allowedChars.has(c)) return false;
            }
            return true;
          });
          if(validWords.length > 0){
            rawContent = validWords.join(' ');
          } else {
            // Generate rhythmic combinations strictly from examples
            const exList = examples;
            const chunks = [];
            chunks.push(exList.join(' '));
            chunks.push(exList.map(x => `${x} ${x}`).join(' '));
            if(exList.length >= 2){
              chunks.push(exList.slice().reverse().join(' '));
              chunks.push(exList.join(' '));
            } else {
              chunks.push(exList[0] + ' ' + exList[0]);
            }
            rawContent = chunks.join(' ');
          }
        }

        const units = (typeof splitIntoTypingUnits === 'function')
          ? splitIntoTypingUnits(rawContent, layoutId)
          : rawContent.split('');

        if(!units.length) return;
        if(entries.length > 0 && entries[entries.length - 1].ch !== ' ' && units[0] !== ' '){
          entries.push(spaceEntry(currentTable));
          unitOffset++;
        }
        const start = unitOffset;

        for(let i=0; i<units.length; i++){
          const u = units[i];
          const loc = resolveCharLocation(u, currentTable);
          if(loc){
            entries.push(loc);
          } else {
            entries.push({ id: 'space', layer: 'base', ch: u });
          }
          unitOffset++;
        }

        const end = Math.max(start, unitOffset - 1);
        sections.push({
          id: eid,
          type: ex.type || 'drill',
          title: ex.title || (ex.type ? ex.type.toUpperCase() : `Exercise ${idx + 1}`),
          startIndex: start,
          endIndex: end,
          totalUnits: (end - start + 1)
        });
      });

      if(!entries.length){
        const fallbackText = Array.isArray(examples) ? examples.join(' ') : (typeof examples === 'string' ? examples : '');
        if(fallbackText){
          const units = (typeof splitIntoTypingUnits === 'function')
            ? splitIntoTypingUnits(fallbackText, layoutId)
            : fallbackText.split('');
          for(let i=0; i<units.length; i++){
            const u = units[i];
            const loc = resolveCharLocation(u, currentTable);
            entries.push(loc || { id: 'space', layer: 'base', ch: u });
          }
          sections.push({
            id: rawLesson.id + '-main',
            type: rawLesson.type || 'drill',
            title: rawLesson.title || 'Main Drill',
            startIndex: 0,
            endIndex: Math.max(0, entries.length - 1),
            totalUnits: entries.length
          });
        }
      }

      return materialize(entries, sections);
    }
  };
}

let LESSONS_STANDARD = buildCourse();
let LESSONS_NIDA = buildNidaCourse();
let LESSONS_ENGLISH = buildHomeRowCourse(KEY_BY_ID_EN, 20000, WORD_BANK_EN);
window.LESSON_SETS = LESSON_SETS = { standard: LESSONS_STANDARD, nida: LESSONS_NIDA, english: LESSONS_ENGLISH };
window.LESSONS = LESSONS = LESSON_SETS[currentLayoutId] || LESSONS_STANDARD;

function initCurriculumFromData(layoutId, levelsData, lessonsData, exercisesData){
  if(!levelsData || !lessonsData || !exercisesData) return null;
  const exMap = Array.isArray(exercisesData)
    ? exercisesData.reduce((acc, ex)=>{ acc[ex.id] = ex; return acc; }, {})
    : exercisesData;

  const lvlMap = {};
  levelsData.forEach(lvl => lvlMap[lvl.id] = lvl);

  const compiledLessons = lessonsData.map(l => createLessonModel(l, exMap, layoutId, lvlMap[l.level]));

  if(layoutId === 'standard'){
    LEVELS_STANDARD.length = 0;
    LEVELS_STANDARD.push(...levelsData);
    LESSONS_STANDARD.length = 0;
    LESSONS_STANDARD.push(...compiledLessons);
    LESSON_SETS.standard = LESSONS_STANDARD;
    LEVEL_SETS.standard = LEVELS_STANDARD;
  } else if(layoutId === 'nida'){
    LEVELS_NIDA.length = 0;
    LEVELS_NIDA.push(...levelsData);
    LESSONS_NIDA.length = 0;
    LESSONS_NIDA.push(...compiledLessons);
    LESSON_SETS.nida = LESSONS_NIDA;
    LEVEL_SETS.nida = LEVELS_NIDA;
  } else if(layoutId === 'english'){
    LEVELS_ENGLISH.length = 0;
    LEVELS_ENGLISH.push(...levelsData);
    LESSONS_ENGLISH.length = 0;
    LESSONS_ENGLISH.push(...compiledLessons);
    LESSON_SETS.english = LESSONS_ENGLISH;
    LEVEL_SETS.english = LEVELS_ENGLISH;
  }

  if(currentLayoutId === layoutId){
    window.LESSONS = LESSONS = LESSON_SETS[layoutId];
    window.LEVELS = LEVELS = LEVEL_SETS[layoutId];
    if(typeof defaultCollapsedLevels === 'function') collapsedLevels = defaultCollapsedLevels();
    if(typeof lessonStrip !== 'undefined' && lessonStrip && typeof renderLessonStrip === 'function') renderLessonStrip();
    if(typeof updateMasteryStat === 'function') updateMasteryStat();
  }

  window.TOTAL_LESSONS_ALL_LAYOUTS = TOTAL_LESSONS_ALL_LAYOUTS =
    (LESSON_SETS.standard ? LESSON_SETS.standard.length : 0) +
    (LESSON_SETS.nida ? LESSON_SETS.nida.length : 0) +
    (LESSON_SETS.english ? LESSON_SETS.english.length : 0);

  return compiledLessons;
}

function initCurriculumFromBundle(){
  const cData = (typeof window !== 'undefined' && window.CURRICULUM_DATA)
    ? window.CURRICULUM_DATA
    : (typeof global !== 'undefined' && global.CURRICULUM_DATA)
    ? global.CURRICULUM_DATA
    : null;
  if(!cData) return;
  if(cData.standard){
    initCurriculumFromData('standard', cData.standard.levels, cData.standard.lessons, cData.standard.exercises);
  }
  if(cData.nida){
    initCurriculumFromData('nida', cData.nida.levels, cData.nida.lessons, cData.nida.exercises);
  }
  if(cData.english){
    initCurriculumFromData('english', cData.english.levels, cData.english.lessons, cData.english.exercises);
  }
}

async function loadAllCurricula(){
  try {
    const fetchCurriculum = async (layout) => {
      const [lvRes, lsRes, exRes] = await Promise.all([
        fetch(`data/curriculum/${layout}/levels.json`).catch(()=>null),
        fetch(`data/curriculum/${layout}/lessons.json`).catch(()=>null),
        fetch(`data/curriculum/${layout}/exercises.json`).catch(()=>null)
      ]);
      if(lvRes && lvRes.ok && lsRes && lsRes.ok && exRes && exRes.ok){
        const [levels, lessons, exercises] = await Promise.all([
          lvRes.json(), lsRes.json(), exRes.json()
        ]);
        initCurriculumFromData(layout, levels, lessons, exercises);
      }
    };
    await Promise.all([fetchCurriculum('standard'), fetchCurriculum('nida'), fetchCurriculum('english')]);
    if(typeof restoreSavedLessonSession === 'function' && !lessonActive){
      restoreSavedLessonSession();
    }
  } catch(err){
    console.warn('loadAllCurricula fallback to bundled data:', err);
  }
}
window.initCurriculumFromData = initCurriculumFromData;
window.initCurriculumFromBundle = initCurriculumFromBundle;
window.loadAllCurricula = loadAllCurricula;

/* Total lesson count across every layout's course — used for stats
   like "Lessons Crafted" that should reflect everything on the site,
   not just whichever layout happens to be selected right now. */
window.TOTAL_LESSONS_ALL_LAYOUTS = TOTAL_LESSONS_ALL_LAYOUTS = (LESSON_SETS.standard ? LESSON_SETS.standard.length : 0) + (LESSON_SETS.nida ? LESSON_SETS.nida.length : 0) + (LESSON_SETS.english ? LESSON_SETS.english.length : 0);


let lessonActive = false;
let currentLesson = null;
let lessonChars = [];
let lessonLayers = [];
let lessonKeyIds = [];
let lessonIndex = 0;
let lessonMistakes = 0;
let lessonMistakeChars = {};   // ch -> count of mistakes this attempt, for adaptive drilling + Review Mistakes
let lessonAcceptedUnits = [];  // Stack of accepted {index, val, expected} units for reliable Backspace
let lessonPartialStroke = null; // Partial keystroke state for multi-step compound vowels
let lessonStartTime = 0;
let lessonTimerStarted = false;
let lessonTimerInterval = null;
let lessonTimeLeft = 0;
let lessonHasTimer = false;
let lessonExtendedOnce = false; // adaptive: only auto-extend a lesson once per attempt
let remedialActive = false;    // true while running an ad-hoc "Review Mistakes" drill

const COURSE_LESSON_STATES = {
  standard: null,
  nida: null,
  english: null
};

function suspendLessonForLayoutSwitch(prevLayout){
  if(!lessonActive || !currentLesson) return;
  document.querySelectorAll('.lesson-complete-overlay').forEach(el => el.remove());

  COURSE_LESSON_STATES[prevLayout] = {
    lesson: currentLesson,
    chars: lessonChars,
    layers: lessonLayers,
    keyIds: lessonKeyIds,
    sections: lessonSections,
    index: lessonIndex,
    mistakes: lessonMistakes,
    mistakeChars: Object.assign({}, lessonMistakeChars),
    acceptedUnits: Array.from(lessonAcceptedUnits),
    remedialActive: remedialActive,
    startTime: lessonStartTime,
    activeTime: (typeof PK_TRACKER !== 'undefined' && typeof PK_TRACKER.getLiveLessonMetrics === 'function')
      ? (PK_TRACKER.getLiveLessonMetrics()?.activeTimeSec || 0)
      : 0,
    layoutId: prevLayout
  };

  lessonActive = false;
  currentLesson = null;
  remedialActive = false;
  if(lessonPanel) lessonPanel.hidden = true;
  const mStash = document.getElementById('manuscript'); if(mStash) mStash.hidden = false;
  if(highlightedKeyId && keyEls[highlightedKeyId]){
    keyEls[highlightedKeyId].classList.remove('lesson-target');
  }
  highlightedKeyId = null;
  if(highlightedModifierKeyId && keyEls[highlightedModifierKeyId]){
    keyEls[highlightedModifierKeyId].classList.remove('modifier-target');
  }
  highlightedModifierKeyId = null;
  if(typeof setActiveFinger === 'function') setActiveFinger(null);
}

function restoreLessonAfterLayoutSwitch(newLayout){
  const saved = COURSE_LESSON_STATES[newLayout];
  if(!saved || !saved.lesson) return false;
  if(!saved.remedialActive && typeof isLessonLocked === 'function' && isLessonLocked(saved.lesson.id)){
    COURSE_LESSON_STATES[newLayout] = null;
    return false;
  }

  currentLesson = saved.lesson;
  lessonChars = saved.chars;
  lessonLayers = saved.layers;
  lessonKeyIds = saved.keyIds;
  lessonSections = saved.sections || [];
  lessonIndex = Math.max(0, Math.min(lessonChars.length, (typeof saved.index === 'number') ? saved.index : 0));
  lessonMistakes = saved.mistakes;
  lessonMistakeChars = saved.mistakeChars || {};
  lessonAcceptedUnits = saved.acceptedUnits || [];
  remedialActive = saved.remedialActive || false;
  lessonStartTime = saved.startTime;
  lessonActive = true;

  if(lessonTitleEl) lessonTitleEl.textContent = currentLesson.title;
  renderLessonMeta(currentLesson);
  if(lessonPanel) lessonPanel.hidden = false;
  const mRestore = document.getElementById('manuscript'); if(mRestore) mRestore.hidden = true;
  if(lessonStrip){
    lessonStrip.hidden = false;
    renderLessonStrip();
  }
  renderLessonChars();
  updateLessonProgress();
  updateLessonKeyHighlight();
  return true;
}

function resetAllCourseLessonStates(){
  COURSE_LESSON_STATES.standard = null;
  COURSE_LESSON_STATES.nida = null;
  COURSE_LESSON_STATES.english = null;
  clearActiveLessonSession();
  if(typeof document !== 'undefined'){
    document.querySelectorAll('.lesson-complete-overlay').forEach(el => el.remove());
  }
  if(lessonActive || currentLesson){
    executeLessonExit();
  }
}

/* ============================================================
   Persistent Active Lesson Session across page refreshes
   ============================================================ */
const ACTIVE_LESSON_KEY = 'pk_active_lesson_session';

function saveActiveLessonSession(){
  if(typeof window !== 'undefined' && window.__isResettingProgress) {
    return;
  }
  if(!lessonActive || !currentLesson || currentLesson.id === -1) {
    return;
  }
  if(!remedialActive && typeof isLessonLocked === 'function' && isLessonLocked(currentLesson.id)) {
    clearActiveLessonSession();
    return;
  }
  try {
    if(typeof localStorage === 'undefined') return;
    const session = {
      layoutId: currentLayoutId,
      lessonId: currentLesson.id,
      index: lessonIndex,
      mistakes: lessonMistakes,
      mistakeChars: lessonMistakeChars ? Object.assign({}, lessonMistakeChars) : {},
      acceptedUnits: lessonAcceptedUnits ? Array.from(lessonAcceptedUnits) : [],
      startTime: lessonStartTime,
      timeLeft: (lessonHasTimer && typeof lessonTimeLeft === 'number') ? lessonTimeLeft : null,
      chars: lessonChars || [],
      layers: lessonLayers || [],
      keyIds: lessonKeyIds || [],
      sections: lessonSections || [],
      remedialActive: remedialActive,
      timestamp: Date.now()
    };
    localStorage.setItem(ACTIVE_LESSON_KEY, JSON.stringify(session));
  } catch(e){}
}

function clearActiveLessonSession(){
  try {
    if(typeof localStorage !== 'undefined'){
      localStorage.removeItem(ACTIVE_LESSON_KEY);
    }
  } catch(e){}
}

function restoreSavedLessonSession(){
  let session = null;
  try {
    if(typeof localStorage === 'undefined') return false;
    const raw = localStorage.getItem(ACTIVE_LESSON_KEY);
    if(raw) session = JSON.parse(raw);
  } catch(e){
    return false;
  }
  if(!session || !session.lessonId) return false;

  const targetLayout = session.layoutId || currentLayoutId;

  if(targetLayout !== currentLayoutId && typeof switchLayout === 'function'){
    switchLayout(targetLayout, true);
  }

  const list = (typeof LESSON_SETS !== 'undefined' && LESSON_SETS[targetLayout])
    ? LESSON_SETS[targetLayout]
    : LESSONS;
  if(!list || !list.length) return false;

  const def = list.find(l => String(l.id) === String(session.lessonId));
  if(!def) return false;

  if(!session.remedialActive && typeof isLessonLocked === 'function' && isLessonLocked(def.id)){
    clearActiveLessonSession();
    return false;
  }

  currentLesson = def;
  if(!def.layoutId) def.layoutId = targetLayout;
  remedialActive = !!session.remedialActive;
  isStripExpanded = false;

  if(session.chars && session.chars.length){
    lessonChars = session.chars;
    lessonLayers = session.layers || [];
    lessonKeyIds = session.keyIds || [];
    lessonSections = session.sections || [];
  } else {
    const gen = def.generate();
    lessonChars = gen.chars;
    lessonLayers = gen.layers;
    lessonKeyIds = gen.keyIds;
    lessonSections = gen.sections || [];
  }

  if(session.index >= lessonChars.length){
    clearActiveLessonSession();
    return false;
  }

  lessonIndex = Math.min(lessonChars.length, Math.max(0, session.index || 0));
  lessonMistakes = session.mistakes || 0;
  lessonMistakeChars = session.mistakeChars || {};
  lessonAcceptedUnits = session.acceptedUnits || [];
  lessonStartTime = session.startTime || Date.now();
  lessonActive = true;

  if (lessonTimerInterval) clearInterval(lessonTimerInterval);
  if (currentLesson && currentLesson.timeLimit) {
    lessonHasTimer = true;
    lessonTimeLeft = (typeof session.timeLeft === 'number' && session.timeLeft > 0)
      ? session.timeLeft
      : currentLesson.timeLimit;
    lessonTimerInterval = setInterval(() => {
      if (!lessonActive) return;
      lessonTimeLeft--;
      updateLessonProgress();
      if (lessonTimeLeft <= 0) {
        clearInterval(lessonTimerInterval);
        completeLesson();
      }
    }, 1000);
  } else {
    lessonHasTimer = false;
  }

  if(lessonTitleEl) lessonTitleEl.textContent = def.title;
  renderLessonMeta(def);
  if(lessonPanel) lessonPanel.hidden = false;
  const mElSaved = document.getElementById('manuscript'); if(mElSaved) mElSaved.hidden = true;
  if(lessonStrip){
    lessonStrip.hidden = false;
    if(collapsedLevels && def.level){
      LEVELS.forEach(l => {
        if(String(l.id) !== String(def.level)) collapsedLevels.add(String(l.id));
        else collapsedLevels.delete(String(l.id));
      });
    }
    renderLessonStrip();
    setTimeout(()=>{
      const activeCard = lessonStrip.querySelector(`.lesson-card[data-lesson="${def.id}"]`);
      const stripBody = lessonStrip.querySelector('.lesson-strip-body');
      if(activeCard && stripBody){
        const cardTop = activeCard.offsetTop - stripBody.offsetTop;
        const targetStripY = Math.max(0, cardTop - (stripBody.clientHeight / 2) + (activeCard.offsetHeight / 2));
        stripBody.scrollTo({ top: targetStripY, behavior: 'smooth' });
      }
      if(typeof scrollToLessonStage === 'function') scrollToLessonStage();
    }, 120);
  }

  if(typeof insertText === 'function' && lessonAcceptedUnits.length > 0){
    const typedText = lessonAcceptedUnits.map(u => u.val).join('');
    const outputEl = document.getElementById('output');
    if(outputEl) outputEl.textContent = typedText;
  }

  renderLessonChars();
  updateLessonProgress();
  updateLessonKeyHighlight();
  if(typeof scrollToLessonStage === 'function') scrollToLessonStage();

  if(typeof PK_TRACKER !== 'undefined' && typeof PK_TRACKER.recordLessonStart === 'function'){
    PK_TRACKER.recordLessonStart({
      layout: targetLayout,
      lessonId: def.id,
      totalUnits: lessonChars.length,
      lessonChars: lessonChars,
      sections: lessonSections
    });
  }

  return true;
}

window.saveActiveLessonSession = saveActiveLessonSession;
window.clearActiveLessonSession = clearActiveLessonSession;
window.restoreSavedLessonSession = restoreSavedLessonSession;

if(typeof window !== 'undefined'){
  window.addEventListener('beforeunload', ()=>{
    if(typeof lessonActive !== 'undefined' && lessonActive && currentLesson){
      saveActiveLessonSession();
    }
  });
}

const lessonStrip = document.getElementById('lessonStrip');
const lessonPanel = document.getElementById('lessonPanel');
const lessonUnavailableNote = document.getElementById('lessonUnavailableNote');
const lessonTitleEl = document.getElementById('lessonTitle');
const lessonMetaBadgeEl = document.getElementById('lessonMetaBadge');
const lessonMetaBestEl = document.getElementById('lessonMetaBest');
const lessonNewKeysEl = document.getElementById('lessonNewKeys');
const lessonProgressValEl = document.getElementById('lessonProgressVal');
const lessonTotalValEl = document.getElementById('lessonTotalVal');
const lessonProgressFillEl = document.getElementById('lessonProgressFill');
const lessonCharRowEl = document.getElementById('lessonCharRow');
const lessonAccValEl = document.getElementById('lessonAccVal');
const lessonMistakesValEl = document.getElementById('lessonMistakesVal');
const lessonWpmValEl = document.getElementById('lessonWpmVal');
const lessonStreakValEl = document.getElementById('lessonStreakVal');
const lessonBackspacesValEl = document.getElementById('lessonBackspacesVal');
const lessonLiveHintEl = document.getElementById('lessonLiveHint');
const lessonExitBtn = document.getElementById('lessonExitBtn');
let lessonSections = [];

function lessonBestKey(id){ return 'khmerLessonBest_' + id; }

function getLessonBest(id){
  const progressApi = (typeof window !== 'undefined' && window.PK_PROGRESS) || (typeof global !== 'undefined' && global.PK_PROGRESS);
  if(progressApi && typeof progressApi.getLessonProgress === 'function'){
    const cLayout = (typeof currentLayoutId !== 'undefined') ? currentLayoutId : 'nida';
    const prog = progressApi.getLessonProgress(cLayout, id);
    if(prog && (prog.started || prog.completed || prog.totalAttempts > 0)){
      return {
        accuracy: prog.bestAccuracy,
        time: prog.bestAttempt ? prog.bestAttempt.timeSec : 0,
        attempts: prog.totalAttempts,
        mastered: prog.masteryState === 'mastered'
      };
    }
  }
  try{ return JSON.parse(localStorage.getItem(lessonBestKey(id)) || 'null'); }
  catch(e){ return null; }
}

let allLessonsUnlocked = false;
try{ allLessonsUnlocked = localStorage.getItem('khmerUnlockAll') === '1'; }catch(e){}

function countCompletedBaseLessons(){
  let completed = 0;
  const layouts = ['standard', 'nida', 'english'];
  layouts.forEach(layout => {
    let list = (typeof LESSON_SETS !== 'undefined' && LESSON_SETS[layout]) ? LESSON_SETS[layout] : null;
    if(!list || !list.length){
      if(layout === 'standard' && typeof LESSONS_STANDARD !== 'undefined') list = LESSONS_STANDARD;
      else if(layout === 'nida' && typeof LESSONS_NIDA !== 'undefined') list = LESSONS_NIDA;
      else if(layout === 'english' && typeof LESSONS_ENGLISH !== 'undefined') list = LESSONS_ENGLISH;
    }
    if(Array.isArray(list)){
      list.forEach(def => {
        if(!def.isBonus && getLessonBest(def.id)){
          completed++;
        }
      });
    }
  });
  return completed;
}
window.countCompletedBaseLessons = countCompletedBaseLessons;

function areAll222LessonsUnlocked(){
  if(allLessonsUnlocked) return true;
  try {
    if (localStorage.getItem('khmerUnlock222Vault') === '1') return true;
  } catch(e) {}
  return countCompletedBaseLessons() >= 222;
}
window.areAll222LessonsUnlocked = areAll222LessonsUnlocked;

function isLessonLocked(id){
  let list = LESSONS;
  let idx = (list && list.length) ? list.findIndex(l => String(l.id) === String(id)) : -1;
  if(idx < 0 && typeof LESSON_SETS !== 'undefined' && LESSON_SETS){
    for(const k of Object.keys(LESSON_SETS)){
      const subList = LESSON_SETS[k];
      if(Array.isArray(subList)){
        const found = subList.findIndex(l => String(l.id) === String(id));
        if(found >= 0){
          list = subList;
          idx = found;
          break;
        }
      }
    }
  }
  if(!list || idx < 0) return false;
  const def = list[idx];
  if(!def) return false;

  // Bonus lessons locking rule:
  // Must unlock all 222 base lessons before the Grandmaster Bonus Vault opens.
  if(def.isBonus){
    const baseUnlocked = areAll222LessonsUnlocked();
    if(!baseUnlocked) return true; // Locked until all 222 base lessons are unlocked!

    // When all 222 base lessons are unlocked, unlock ONLY the first bonus lesson!
    if(def.bonusIndex === 0){
      return false; // First bonus lesson is unlocked!
    }

    // Subsequent bonus lessons unlock sequentially only after completing the previous bonus lesson
    const prevReqId = def.unlockRequirements && def.unlockRequirements.previousLesson;
    const prevId = prevReqId || (idx > 0 ? list[idx - 1].id : null);
    if(!prevId) return false;
    const prevBest = getLessonBest(prevId);
    return !prevBest; // Unlocks only if previous bonus lesson was finished
  }

  if(idx === 0) return false;
  if(allLessonsUnlocked) return false;
  const prevReqId = def.unlockRequirements && def.unlockRequirements.previousLesson;
  const prevId = prevReqId || (idx > 0 ? list[idx - 1].id : null);
  if(!prevId) return false;
  const prevBest = getLessonBest(prevId);
  return !prevBest; // any completed attempt on the previous lesson unlocks the next one
}
window.isLessonLocked = isLessonLocked;
window.getLessonBest = getLessonBest;

function toggleAllLessonsUnlocked(){
  allLessonsUnlocked = !allLessonsUnlocked;
  try{ localStorage.setItem('khmerUnlockAll', allLessonsUnlocked ? '1' : '0'); }catch(e){}
  if(!allLessonsUnlocked && currentLesson && !remedialActive && isLessonLocked(currentLesson.id)){
    collapsedLevels = null;
    executeLessonExit();
  } else {
    renderLessonStrip();
  }
  if(allLessonsUnlocked){
    const logoEl = document.getElementById('siteLogo');
    const rect = logoEl ? logoEl.getBoundingClientRect() : (boardWrap || document.body).getBoundingClientRect();
    if(typeof confettiBurst === 'function'){
      confettiBurst(rect.left + rect.width/2, rect.top + rect.height/2, 42);
    }
    if(typeof playChime === 'function') playChime();
    showToast(pkIcon('unlock', 20), 'Master Unlock', `All ${LESSONS.length} lessons unlocked!`);
  } else {
    showToast(pkIcon('lock', 20), 'Progress Locked', 'Normal lesson progression restored');
  }
}

(function setupHiddenUnlock(){
  let logoTaps = 0;
  let logoTimer = null;
  const logoEl = document.getElementById('siteLogo') || document.querySelector('.site-crest-icon');
  if(logoEl){
    logoEl.addEventListener('click', ()=>{
      logoTaps++;
      clearTimeout(logoTimer);
      if(logoTaps >= 5){
        logoTaps = 0;
        toggleAllLessonsUnlocked();
      } else {
        logoTimer = setTimeout(()=>{ logoTaps = 0; }, 2500);
      }
    });
  }

  // Secret code: typing "pkunlock" on physical keyboard anywhere
  let codeBuffer = '';
  const SECRET = 'pkunlock';
  window.addEventListener('keydown', (e)=>{
    const t = e.target;
    if(t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if(!e.key || e.key.length !== 1) return;
    codeBuffer = (codeBuffer + e.key.toLowerCase()).slice(-SECRET.length);
    if(codeBuffer === SECRET){
      codeBuffer = '';
      toggleAllLessonsUnlocked();
    }
  });
})();

/* Build the lesson-strip cards fresh from LESSONS + localStorage progress.
   Called on load and after every completed lesson. Levels are collapsible
   accordion sections so the whole list isn't overwhelming at once. */
// collapsedLevels defined at top of module // Set of level ids currently collapsed; null = not yet initialized
function defaultCollapsedLevels(){
  const s = new Set(LEVELS.map(l => String(l.id)));
  if(currentLesson && currentLesson.level){
    s.delete(String(currentLesson.level));
  } else if(LEVELS.length > 0){
    s.delete(String(LEVELS[0].id)); // Level 1 open by default for immediate beginner access
  }
  return s;
}

function autoAdvanceLevelAccordion(completedDef){
  if(!completedDef) return;
  if(!collapsedLevels) collapsedLevels = defaultCollapsedLevels();
  const currentLv = String(completedDef.level);
  const levelLessons = LESSONS.filter(l => String(l.level) === currentLv);
  const allFinished = levelLessons.length > 0 && levelLessons.every(l => !!getLessonBest(l.id));
  if(allFinished){
    // Current level is completed! Collapse current level and open the next level!
    const curIdx = LEVELS.findIndex(l => String(l.id) === currentLv);
    if(curIdx >= 0 && curIdx < LEVELS.length - 1){
      const nextLvObj = LEVELS[curIdx + 1];
      const nextLv = String(nextLvObj.id);
      collapsedLevels.add(currentLv);    // Close completed level
      if(!nextLvObj.isBonus || areAll222LessonsUnlocked()){
        collapsedLevels.delete(nextLv);  // Open next level
      }
    }
  } else {
    // Current level still has lessons, keep it open
    collapsedLevels.delete(currentLv);
  }
}
let isStripExpanded = false; // Starts in compact 1-column view ("not too big, just can see the level")

function renderLessonStrip(){
  if(!lessonStrip) return;
  try {
    if(!Array.isArray(LESSONS) || LESSONS.length === 0){
      if(typeof LESSONS_STANDARD !== 'undefined' && Array.isArray(LESSONS_STANDARD) && LESSONS_STANDARD.length){
        LESSONS = LESSONS_STANDARD;
      } else if(typeof LESSON_SETS !== 'undefined' && LESSON_SETS.standard && LESSON_SETS.standard.length){
        LESSONS = LESSON_SETS.standard;
      }
    }
    if(!Array.isArray(LESSONS) || LESSONS.length === 0){
      lessonStrip.removeAttribute('hidden');
      lessonStrip.hidden = false;
      return;
    }
    if(currentLesson && !remedialActive && isLessonLocked(currentLesson.id)){
      collapsedLevels = null;
      executeLessonExit();
      return;
    }
    if(!collapsedLevels) collapsedLevels = defaultCollapsedLevels();

    const frag = document.createDocumentFragment();

    let masteredCount = 0;
    LESSONS.forEach(l => { const b = getLessonBest(l.id); if(b && b.mastered) masteredCount++; });

    const isKm = document.documentElement.classList.contains('site-km-mode');

    const topBar = document.createElement('div');
    topBar.className = 'lesson-strip-header';
    topBar.innerHTML = `
      <span class="lsh-title">${pkIcon('book', 14)} <span class="i18n-t" data-en="LESSONS" data-km="មេរៀន">LESSONS</span></span>
      <div class="lsh-actions">
        <button type="button" class="lsh-custom-btn" id="lshCustomLessonsBtn" title="${isKm ? 'មេរៀនផ្ទាល់ខ្លួន (បង្កើត និងហ្វឹកហាត់)' : 'Custom Lessons (Create & Practice)'}" aria-label="Custom Lessons">
          ${pkIcon('edit', 12)} <span class="i18n-t" data-en="Custom" data-km="ផ្ទាល់ខ្លួន">Custom</span>
        </button>
        <button type="button" class="lsh-adaptive-btn" id="lshAdaptiveBtn" title="Start Adaptive Practice" aria-label="Start Adaptive Practice">
          ${pkIcon('refresh', 12)} <span class="i18n-t" data-en="Adaptive" data-km="ការអនុវត្តបន្ស៊ាំ">Adaptive</span>
        </button>
        <span class="lsh-badge" title="${masteredCount}/${LESSONS.length} ${isKm ? 'មេរៀនបានស្ទាត់' : 'Lessons Mastered'}"><span class="lsh-badge-num">${masteredCount}/${LESSONS.length}</span> <span class="lsh-badge-txt"><span class="i18n-t" data-en="Mastered" data-km="ស្ទាត់">Mastered</span></span></span>
        <button type="button" class="lsh-expand-btn" id="lshExpandBtn" title="${isStripExpanded ? 'Compact sidebar (1 column)' : 'Expand sidebar (2 columns)'}" aria-label="Toggle sidebar width">
          ${pkIcon(isStripExpanded ? 'collapse' : 'expand', 12)}
        </button>
      </div>
    `;
    frag.appendChild(topBar);

    const searchPlaceholder = isKm ? "ស្វែងរកមេរៀន អក្សរ..." : "Search lessons, letters...";
    
    const searchBar = document.createElement('div');
    searchBar.className = 'lesson-strip-search';
    searchBar.innerHTML = `
      <div class="lss-input-wrap">
        <svg class="pk-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" id="lessonSearchInput" class="i18n-ph" data-en="Search lessons, letters..." data-km="ស្វែងរកមេរៀន អក្សរ..." placeholder="${searchPlaceholder}" autocomplete="off">
      </div>
    `;
    frag.appendChild(searchBar);

    const hubBannerWrap = document.createElement('div');
    hubBannerWrap.className = 'lesson-strip-hub-banner-wrap';
    hubBannerWrap.innerHTML = `
      <button type="button" class="lsh-hub-banner" id="lshHubBanner" title="${isKm ? 'ស្វែងយល់បន្ថែមអំពី ២២២ មេរៀន និងតួអក្សរគ្រប់ទម្រង់' : 'Explore 222 Handcrafted Lessons & 100% Alphabet Coverage (Every Letter Included)'}">
        <div class="lsh-hb-left">
          <span class="lsh-hb-badge">
            <svg class="pk-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span>222</span>
          </span>
          <div class="lsh-hb-text">
            <span class="lsh-hb-title i18n-t" data-en="222 Lessons · All Letters" data-km="២២២ មេរៀន · គ្រប់តួអក្សរ">222 Lessons · All Letters</span>
            <span class="lsh-hb-sub i18n-t" data-en="Every Letter Included · Learn More" data-km="រួមបញ្ចូលគ្រប់តួអក្សរ · ស្វែងយល់បន្ថែម">Every Letter Included · Learn More</span>
          </div>
        </div>
        <svg class="pk-icon lsh-hb-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    `;
    frag.appendChild(hubBannerWrap);

    const adaptiveCard = document.createElement('div');
    adaptiveCard.className = 'adaptive-sidebar-card';
    adaptiveCard.id = 'adaptiveSidebarCard';
    const sAdaptive = (typeof PK_ADAPTIVE !== 'undefined' && typeof PK_ADAPTIVE.loadAdaptiveState === 'function')
      ? PK_ADAPTIVE.loadAdaptiveState(currentLayoutId)
      : null;
    const activeSub = sAdaptive
      ? (isKm ? `ដំណាក់កាល ${sAdaptive.stage} · ${sAdaptive.unlockedUnits.slice(0, 6).map(u=>u.toUpperCase()).join(' ')}${sAdaptive.unlockedUnits.length > 6 ? ' +' + (sAdaptive.unlockedUnits.length - 6) : ''}` : `Stage ${sAdaptive.stage} · ${sAdaptive.unlockedUnits.slice(0, 6).map(u=>u.toUpperCase()).join(' ')}${sAdaptive.unlockedUnits.length > 6 ? ' +' + (sAdaptive.unlockedUnits.length - 6) : ''}`)
      : (isKm ? 'ការហ្វឹកហាត់អក្សរគោលដៅ' : 'Targeted letters practice');
    adaptiveCard.innerHTML = `
      <div class="asc-left">
        <div class="asc-title">
          <svg class="pk-icon asc-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          <span class="i18n-t" data-en="Adaptive Practice" data-km="ការអនុវត្តបន្ស៊ាំ">Adaptive Practice</span>
        </div>
        <div class="asc-sub" id="adaptiveSidebarSub">${activeSub}</div>
      </div>
      <button type="button" class="asc-btn" id="adaptiveStartBtn">
        <span class="i18n-t" data-en="Train" data-km="ហាត់">Train</span>
      </button>
    `;
    const bodyEl = document.createElement('div');
    bodyEl.className = 'lesson-strip-body';
    bodyEl.id = 'lessonStripBody';
    
    const customCard = document.createElement('div');
    customCard.className = 'custom-sidebar-card';
    customCard.id = 'customSidebarCard';
    customCard.innerHTML = `
      <div class="csc-left">
        <div class="csc-title">
          ${pkIcon('edit', 13)}
          <span class="i18n-t" data-en="Custom Lessons" data-km="មេរៀនផ្ទាល់ខ្លួន">Custom Lessons</span>
        </div>
        <div class="csc-sub" id="customSidebarSub">${isKm ? 'បង្កើត ឬហ្វឹកហាត់មេរៀនផ្ទាល់ខ្លួន' : 'Craft & practice your own drills'}</div>
      </div>
      <button type="button" class="csc-btn" id="customSidebarBtn">
        <span class="i18n-t" data-en="Craft" data-km="បង្កើត">Craft</span>
      </button>
    `;
    bodyEl.appendChild(customCard);
    bodyEl.appendChild(adaptiveCard);

    let lastLevel = null;
    let listEl = null;
    LESSONS.forEach((def, idx)=>{
      if(def.level !== lastLevel){
        const lv = LEVELS.find(l=> String(l.id) === String(def.level));
        const collapsed = collapsedLevels.has(String(def.level));
        const isBonusLevel = !!(lv && lv.isBonus);
        const header = document.createElement('div');
        header.className = 'lesson-level-header' + (isBonusLevel ? ' bonus-level-header' : '') + (collapsed ? ' collapsed' : '');
        header.dataset.level = String(def.level);

        let bonusBadgeHtml = '';
        if(isBonusLevel){
          const baseCount = countCompletedBaseLessons();
          const baseUnlocked = areAll222LessonsUnlocked();
          if(!baseUnlocked){
            bonusBadgeHtml = `<span class="bvh-badge locked" title="${baseCount}/222 Base Lessons Completed">${pkIcon('lock', 10)} <span>${baseCount}/222</span></span>`;
          } else {
            bonusBadgeHtml = `<span class="bvh-badge unlocked" title="Grandmaster Vault Unlocked">${pkIcon('award', 10)} <span>VAULT</span></span>`;
          }
        }

        header.innerHTML = `
          <div class="llh-left">
            <span class="llh-chevron">${pkIcon(collapsed ? 'arrow-right' : 'arrow-down', 11)}</span>
            <span>${lv ? (isKm && lv.titleKm ? lv.titleKm : lv.title) : (isKm ? `កម្រិត ${def.level}` : `Level ${def.level}`)}</span>
          </div>
          ${bonusBadgeHtml}
        `;
        bodyEl.appendChild(header);
        listEl = document.createElement('div');
        listEl.className = 'lesson-level-list' + (isBonusLevel ? ' bonus-level-list' : '') + (collapsed ? ' collapsed' : '');
        bodyEl.appendChild(listEl);
        lastLevel = def.level;
      }
      const isBonusCard = !!def.isBonus;
      const card = document.createElement('div');
      const locked = isLessonLocked(def.id);
      card.className = 'lesson-card' + (isBonusCard ? ' bonus-card' : '') + (locked ? ' locked' : '') + (currentLesson && currentLesson.id===def.id ? ' active' : '');
      card.dataset.lesson = def.id;

      const examplesHtml = def.examples && def.examples.length
        ? `<div class="lesson-card-examples"><span class="lce-lbl">${isKm ? 'ឧទាហរណ៍៖' : 'Ex:'}</span> ${def.examples.slice(0, 3).map(ex=>`<span class="lce-chip">${ex}</span>`).join(' ')}</div>`
        : '';

      const best = getLessonBest(def.id);
      const statusHtml = best
        ? `<span class="lesson-card-best ${best.mastered?'mastered':''}">${best.mastered ? pkIcon('star', 12) + ' ' : ''}${best.accuracy}%</span>`
        : locked ? `<span class="lesson-card-lock">${pkIcon('lock', 12)}</span>` : '';

      const bonusTag = isBonusCard ? `<span class="lesson-card-bonus-tag">${pkIcon('award', 10)} <span>BONUS</span></span>` : '';
      const numLabel = isBonusCard ? `B${String((def.bonusIndex !== undefined ? def.bonusIndex + 1 : def.order) || 1).padStart(2,'0')}` : String(idx+1).padStart(2,'0');

      card.innerHTML = `
        <div class="lesson-card-num">${numLabel}</div>
        <div class="lesson-card-info">
          <div class="lesson-card-head">
            <span class="lesson-card-title">${def.title}</span>
            <span class="lesson-card-type type-${def.type}">${def.type}</span>
            ${bonusTag}
            ${statusHtml}
          </div>
          <div class="lesson-card-sub">${def.subtitle}</div>
          ${examplesHtml}
        </div>
      `;
      listEl.appendChild(card);
    });

    frag.appendChild(bodyEl);
    lessonStrip.replaceChildren(frag);
    lessonStrip.removeAttribute('hidden');
    lessonStrip.hidden = false;
    lessonStrip.classList.remove('minimized');
    lessonStrip.classList.toggle('expanded', isStripExpanded);

    if(typeof updateMasteryStat === 'function') updateMasteryStat();
  } catch(err){
    console.error('renderLessonStrip error:', err);
    lessonStrip.removeAttribute('hidden');
    lessonStrip.hidden = false;
  }
}

lessonStrip.addEventListener('input', (e)=>{
  if(e.target.id === 'lessonSearchInput') {
    const term = e.target.value.toLowerCase().trim();
    const levelHeaders = lessonStrip.querySelectorAll('.lesson-level-header');
    const levelLists = lessonStrip.querySelectorAll('.lesson-level-list');
    
    levelLists.forEach((list, idx) => {
      const header = levelHeaders[idx];
      if(!header) return;
      const headerMatches = header.textContent.toLowerCase().includes(term);
      const cards = list.querySelectorAll('.lesson-card');
      let visibleCount = 0;
      
      cards.forEach(card => {
        const cardMatches = card.textContent.toLowerCase().includes(term);
        if(headerMatches || cardMatches) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });
      
      if(visibleCount === 0) {
        header.style.display = 'none';
        list.style.display = 'none';
      } else {
        header.style.display = '';
        list.style.display = '';
        if(term.length > 0) {
          list.classList.remove('collapsed');
          header.classList.remove('collapsed');
          const chevron = header.querySelector('.llh-chevron');
          if(chevron) chevron.innerHTML = typeof pkIcon === 'function' ? pkIcon('arrow-down', 11) : '';
        }
      }
    });
  }
});

/* Toggle a level section open/closed, toggle 1-col/2-col expand, or start lesson */
lessonStrip.addEventListener('click', (e)=>{
  e.stopPropagation();

  // If clicked custom lessons button or custom sidebar card
  const customBtn = e.target.closest('#lshCustomLessonsBtn, #customSidebarBtn, #customSidebarCard');
  if(customBtn){
    if(typeof PK_CUSTOM_LESSONS !== 'undefined' && typeof PK_CUSTOM_LESSONS.openHub === 'function'){
      PK_CUSTOM_LESSONS.openHub();
    }
    return;
  }

  // If clicked adaptive practice button or sidebar card
  const adaptiveBtn = e.target.closest('#lshAdaptiveBtn, #adaptiveStartBtn, #adaptiveSidebarCard');
  if(adaptiveBtn){
    if(typeof PK_ADAPTIVE !== 'undefined' && typeof PK_ADAPTIVE.startAdaptiveSession === 'function'){
      isStripExpanded = false;
      PK_ADAPTIVE.startAdaptiveSession(currentLayoutId);
      return;
    }
    if(typeof PK_REVIEW !== 'undefined' && typeof PK_REVIEW.generateReviewDrill === 'function'){
      const drill = PK_REVIEW.generateReviewDrill(currentLayoutId);
      if(drill){
        isStripExpanded = false;
        startLesson(drill);
        if(typeof showToast === 'function'){
          showToast(pkIcon('refresh', 16), 'Adaptive Practice', drill.reason || 'Personalized review drill started!');
        }
      } else if(typeof showToast === 'function'){
        showToast(pkIcon('check', 16), 'Adaptive Practice', 'No weak targets found! Excellent work.');
      }
    }
    return;
  }

  // If clicked 222 Lessons Hub Banner
  const hubBanner = e.target.closest('#lshHubBanner');
  if(hubBanner){
    if(typeof openLearnMoreHub === 'function') openLearnMoreHub();
    return;
  }

  // If clicked expand/compact toggle button
  const expandBtn = e.target.closest('#lshExpandBtn');
  if(expandBtn){
    isStripExpanded = !isStripExpanded;
    // If expanding to 2 columns and all levels are collapsed, open the first level
    if(isStripExpanded && collapsedLevels.size === LEVELS.length){
      collapsedLevels.delete(String(LEVELS[0].id));
    }
    renderLessonStrip();
    return;
  }

  // If clicked level accordion header
  const header = e.target.closest('.lesson-level-header');
  if(header){
    const level = String(header.dataset.level);
    if(collapsedLevels.has(level)){
      collapsedLevels.delete(level);
      const openLevelsCount = LEVELS.filter(l => !collapsedLevels.has(String(l.id))).length;
      if(openLevelsCount > 1){
        isStripExpanded = true;
      }
    } else {
      collapsedLevels.add(level);
    }
    renderLessonStrip();
    return;
  }

  // If clicked lesson card
  const card = e.target.closest('.lesson-card');
  if(!card) return;
  const id = card.dataset.lesson;
  if(isLessonLocked(id)){
    const def = LESSONS.find(l => String(l.id) === String(id));
    if(def && def.isBonus){
      const completed = countCompletedBaseLessons();
      const isKm = document.documentElement.classList.contains('site-km-mode');
      if(!areAll222LessonsUnlocked()){
        const msgEn = `Grandmaster Vault is locked. Complete all 222 base lessons to open (${completed}/222 finished).`;
        const msgKm = `ឃ្លាំងមេរៀនពិសេសត្រូវបានចាក់សោ។ សូមបញ្ចប់ ២២២ មេរៀនមូលដ្ឋានជាមុនសិន (${completed}/២២២ បានបញ្ចប់)។`;
        if(typeof showToast === 'function'){
          showToast(pkIcon('lock', 16), isKm ? 'មេរៀនពិសេសជាប់សោ' : 'Bonus Lesson Locked', isKm ? msgKm : msgEn);
        }
      } else {
        const msgEn = `Bonus lessons unlock sequentially. Finish the previous bonus lesson first!`;
        const msgKm = `មេរៀនពិសេសដោះសោតាមលំដាប់លំដោយ។ សូមបញ្ចប់មេរៀនពិសេសមុនជាមុនសិន!`;
        if(typeof showToast === 'function'){
          showToast(pkIcon('lock', 16), isKm ? 'មេរៀនបន្ទាប់ជាប់សោ' : 'Sequential Unlock', isKm ? msgKm : msgEn);
        }
      }
    }
    return;
  }
  if(lessonActive && currentLesson && String(currentLesson.id) === String(id)){
    scrollToLessonStage();
    return;
  }

  isStripExpanded = false; // Make it small when clicking on lessons
  startLesson(id);
});

/* When clicking somewhere NOT on the bar ("click something else"), make the sidebar small */
document.addEventListener('click', (e)=>{
  if(!lessonStrip) return;
  if(e.composedPath && e.composedPath().includes(lessonStrip)) return;
  if(e.target && e.target.closest && e.target.closest('#lessonStrip')) return;

  const openCount = collapsedLevels ? LEVELS.filter(l => !collapsedLevels.has(String(l.id))).length : 1;
  if(!isStripExpanded && openCount <= 1) return;

  isStripExpanded = false;
  if(collapsedLevels){
    const keepLv = currentLesson ? String(currentLesson.level) : (LEVELS.length ? String(LEVELS[0].id) : '1');
    collapsedLevels = new Set(LEVELS.map(l => String(l.id)));
    collapsedLevels.delete(keepLv);
    renderLessonStrip();
  }
});

function renderLessonMeta(def){
  const isKm = document.documentElement.classList.contains('site-km-mode');
  const levelObj = LEVELS.find(l => l.id === def.level);
  const levelTitle = levelObj ? (isKm && levelObj.titleKm ? levelObj.titleKm : levelObj.title) : (isKm ? `កម្រិត ${def.level}` : `Level ${def.level}`);
  lessonMetaBadgeEl.textContent = `${levelTitle} · ${(def.type || 'drill').toUpperCase()}`;
  lessonMetaBadgeEl.className = 'lesson-meta-badge' + (def.type==='review' || def.type==='test' || def.type==='words' ? ' badge-'+def.type : '');
  const best = getLessonBest(def.id);
  lessonMetaBestEl.textContent = best
    ? (isKm ? `ល្អបំផុត ${best.accuracy}% ក្នុង ${best.time.toFixed(1)}វ · ការសាកល្បង ${best.attempts||1}` : `Best ${best.accuracy}% in ${best.time.toFixed(1)}s · Attempts ${best.attempts||1}`)
    : (isKm ? 'មិនទាន់បានសាកល្បងនៅឡើយ' : 'Not attempted yet');

  if(def.newIds && def.newIds.length){
    lessonNewKeysEl.hidden = false;
    const targetLabel = isKm ? 'គ្រាប់ចុចគោលដៅ' : 'Target Keys';
    const targetIconSvg = '<svg class="pk-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>';
    lessonNewKeysEl.innerHTML = `<div class="lesson-newkeys-header"><span class="lesson-newkeys-label">${targetIconSvg} ${targetLabel}</span></div><div class="lesson-newkeys-grid">` + def.newIds.map(id=>{
      const layer = def.newLayer || def.layer || 'base';
      let ch = (def.newChars && def.newChars[id]) || charFor(id, layer);
      if(!ch) ch = charFor(id, 'base') || charFor(id, 'shift') || '';
      const displayChar = formatDisplayGlyph(ch) || keyLabel(id);
      const fid = (typeof KEY_FINGER !== 'undefined' && KEY_FINGER[id]) ? KEY_FINGER[id] : '';
      const isAnchorKey = (id === 'f' || id === 'j');
      let modPrefix = '';
      if(layer === 'shift'){
        modPrefix = 'Shift + ';
      } else if(layer === 'altgr'){
        modPrefix = 'AltGr + ';
      } else if(layer === 'ctrl'){
        modPrefix = 'Ctrl + ';
      }
      const fullKeyLabel = `${modPrefix}${keyLabel(id)}`;
      return `<div class="lesson-newkey-chip" data-finger="${fid}" title="${fullKeyLabel} — ${fingerLabel(id)}">
        <div class="nk-keycap">
          <span class="nk-char">${displayChar}</span>
          ${isAnchorKey ? '<span class="nk-homing-bump" title="Tactile Homing Bar"></span>' : ''}
        </div>
        <div class="nk-key-details">
          <span class="nk-keyid">${fullKeyLabel}</span>
          <span class="nk-finger-badge finger-${fid}">${fingerLabel(id)}</span>
        </div>
      </div>`;
    }).join('') + `</div>`;
  } else {
    lessonNewKeysEl.hidden = true;
    lessonNewKeysEl.innerHTML = '';
  }

  let exEl = document.getElementById('lessonExamplesBanner');
  if(!exEl){
    exEl = document.createElement('div');
    exEl.id = 'lessonExamplesBanner';
    exEl.className = 'lesson-examples-banner';
    lessonNewKeysEl.parentNode.insertBefore(exEl, lessonNewKeysEl.nextSibling);
  }
  if(def.examples && def.examples.length){
    // Flatten and split in case examples are space-separated strings or arrays
    const rawList = Array.isArray(def.examples) ? def.examples : [def.examples];
    const tokens = [];
    rawList.forEach(item => {
      if(typeof item === 'string'){
        const parts = item.trim().split(/[\s,]+/).filter(Boolean);
        parts.forEach(p => {
          if(!tokens.includes(p)) tokens.push(p);
        });
      }
    });

    if(tokens.length){
      exEl.hidden = false;
      const isKm = document.documentElement.classList.contains('site-km-mode');
      const labelText = isKm ? 'គំរូវាយ៖' : 'Lesson Examples:';
      const iconSvg = typeof pkIcon === 'function' ? pkIcon('book', 13) : '';
      exEl.innerHTML = `
        <span class="leb-label i18n-t" data-en="Lesson Examples:" data-km="គំរូវាយ៖">${iconSvg} ${labelText}</span>
        <div class="leb-chips"></div>
      `;
      const chipsWrap = exEl.querySelector('.leb-chips');
      if(chipsWrap){
        tokens.slice(0, 10).forEach(ex => {
          const chip = document.createElement('span');
          chip.className = 'leb-chip';
          chip.textContent = ex;
          chipsWrap.appendChild(chip);
        });
      }
    } else {
      exEl.hidden = true;
      exEl.innerHTML = '';
    }
  } else {
    exEl.hidden = true;
    exEl.innerHTML = '';
  }
}

function renderLessonChars(){
  lessonCharRowEl.innerHTML = '';
  const start = Math.max(0, lessonIndex - 2);
  const end = Math.min(lessonChars.length, start + 10);
  for(let i=start;i<end;i++){
    const s = document.createElement('span');
    const ch = lessonChars[i];
    s.className = 'lc-char' + (i < lessonIndex ? ' done' : (i === lessonIndex ? ' current' : '')) + (ch === ' ' ? ' lc-space' : '');
    const keyId = lessonKeyIds && lessonKeyIds[i];
    const fid = (keyId && typeof KEY_FINGER !== 'undefined' && KEY_FINGER[keyId]) ? KEY_FINGER[keyId] : '';
    if(fid && ch !== ' ') s.dataset.finger = fid;
    s.textContent = ch === ' ' ? '␣' : (typeof formatDisplayGlyph === 'function' ? formatDisplayGlyph(ch) : ch);
    lessonCharRowEl.appendChild(s);
  }
  updateLessonKeyHighlight();
}

let highlightedKeyId = null;
let highlightedModifierKeyId = null;
function updateLessonKeyHighlight(){
  if(highlightedKeyId && keyEls[highlightedKeyId]){
    keyEls[highlightedKeyId].classList.remove('lesson-target');
  }
  if(highlightedModifierKeyId && keyEls[highlightedModifierKeyId]){
    keyEls[highlightedModifierKeyId].classList.remove('modifier-target');
  }
  highlightedKeyId = null;
  highlightedModifierKeyId = null;

  if(!lessonActive || !currentLesson){ setActiveFinger(null); return; }
  if(lessonIndex >= lessonChars.length){ setActiveFinger(null); return; }
  const id = lessonKeyIds[lessonIndex];
  const layer = lessonLayers[lessonIndex] || currentLesson.layer || 'base';
  if(id && keyEls[id]){
    highlightedKeyId = id;
    keyEls[id].classList.add('lesson-target');
  }
  if(typeof modifierInfoFor === 'function'){
    const mod = modifierInfoFor(id, layer);
    if(mod && mod.targetKey && keyEls[mod.targetKey]){
      highlightedModifierKeyId = mod.targetKey;
      keyEls[mod.targetKey].classList.add('modifier-target');
    }
  }
  setActiveFinger(id, layer);
}
window.updateLessonKeyHighlight = updateLessonKeyHighlight;
window.highlightLessonTarget = updateLessonKeyHighlight;

function updateLessonProgress(){
  const tw = document.getElementById('lessonTimerWrap');
  const tv = document.getElementById('lessonTimerVal');
  if (lessonHasTimer && tw) {
    tw.style.display = 'inline-flex';
    if (tv) tv.textContent = Math.floor(lessonTimeLeft/60) + ':' + String(lessonTimeLeft%60).padStart(2, '0');
  } else if (tw) {
    tw.style.display = 'none';
  }
  lessonProgressValEl.textContent = lessonIndex;
  lessonTotalValEl.textContent = lessonChars.length;
  lessonProgressFillEl.style.width = (lessonChars.length > 0 ? (lessonIndex/lessonChars.length*100) : 0) + '%';
  const attempts = lessonIndex + lessonMistakes;
  const accuracy = attempts > 0 ? Math.min(100, Math.max(0, Math.round((lessonIndex/attempts)*100))) : 100;
  lessonAccValEl.textContent = accuracy + '%';
  lessonMistakesValEl.textContent = lessonMistakes;

  // Visual grade styling for accuracy pod
  if(lessonAccValEl){
    lessonAccValEl.classList.remove('grade-emerald', 'grade-gold', 'grade-rose');
    if(accuracy >= 98) lessonAccValEl.classList.add('grade-emerald');
    else if(accuracy >= 90) lessonAccValEl.classList.add('grade-gold');
    else lessonAccValEl.classList.add('grade-rose');
  }

  // Real-time tracking & learner feedback updates
  if(typeof PK_TRACKER !== 'undefined' && typeof PK_TRACKER.getLiveLessonMetrics === 'function'){
    const live = PK_TRACKER.getLiveLessonMetrics();
    if(live){
      if(lessonWpmValEl) lessonWpmValEl.textContent = live.wpm || 0;
      if(lessonStreakValEl) lessonStreakValEl.textContent = live.currentStreak || 0;
      if(lessonBackspacesValEl) lessonBackspacesValEl.textContent = live.backspaceCount || 0;

      // Real-time subtle hint (only when repeated evidence exists)
      const hint = (typeof PK_FEEDBACK !== 'undefined' && typeof PK_FEEDBACK.getRealTimeHint === 'function')
        ? PK_FEEDBACK.getRealTimeHint(live)
        : live.liveHint;

      if(lessonLiveHintEl){
        if(hint){
          lessonLiveHintEl.textContent = hint;
          lessonLiveHintEl.hidden = false;
        } else {
          lessonLiveHintEl.hidden = true;
        }
      }
    }
  }

  // Dynamic Flow / Combo Gauge updates
  const flowBanner = document.getElementById('lessonFlowBanner');
  const flowFill = document.getElementById('lessonFlowFill');
  const flowText = document.getElementById('lessonFlowText');
  const flowSub = document.getElementById('lessonFlowSub');
  if(flowBanner && flowFill && flowText){
    const streak = parseInt((lessonStreakValEl ? lessonStreakValEl.textContent : '0') || '0', 10);
    const isKm = document.documentElement.classList.contains('site-km-mode');
    if(streak >= 35){
      flowBanner.setAttribute('data-flow', 'transcendent');
      flowFill.style.width = '100%';
      flowText.textContent = isKm ? `ត្រាស់ដឹង x${streak}` : `TRANSCENDENT x${streak}`;
      if(flowSub) flowSub.textContent = isKm ? 'ភាពស្ទាត់ជំនាញកំពូល! រលូនឥតខ្ចោះ' : 'Sacred mastery achieved! Flawless rhythm.';
    } else if(streak >= 20){
      flowBanner.setAttribute('data-flow', 'gold');
      flowFill.style.width = '85%';
      flowText.textContent = isKm ? `ចូលដល់កម្រិតខ្ពស់ x${streak}` : `IN THE ZONE x${streak}`;
      if(flowSub) flowSub.textContent = isKm ? 'ល្បឿន និងភាពសុក្រឹតអស្ចារ្យ!' : 'Blazing speed & surgical accuracy!';
    } else if(streak >= 10){
      flowBanner.setAttribute('data-flow', 'cyan');
      flowFill.style.width = '60%';
      flowText.textContent = isKm ? `រលូនឥតខ្ចោះ x${streak}` : `FLOWING x${streak}`;
      if(flowSub) flowSub.textContent = isKm ? 'ការចងចាំសាច់ដុំកំពុងដំណើរការ!' : 'Muscle memory unlocked! Keep rhythm.';
    } else if(streak >= 5){
      flowBanner.setAttribute('data-flow', 'bronze');
      flowFill.style.width = '35%';
      flowText.textContent = isKm ? `បន្តបន្ទាប់ x${streak}` : `COMBO x${streak}`;
      if(flowSub) flowSub.textContent = isKm ? 'ចង្វាក់ល្អ! បន្តទៅមុខទៀត' : 'Steady rhythm! Keep the combo alive.';
    } else {
      flowBanner.setAttribute('data-flow', 'ready');
      flowFill.style.width = (attempts > 0 ? '12%' : '0%');
      flowText.textContent = isKm ? 'រួចរាល់សម្រាប់វាយ' : 'READY TO TYPE';
      if(flowSub) flowSub.textContent = isKm ? 'រក្សាចង្វាក់ដើម្បីបង្កើន Flow Multiplier' : 'Maintain rhythm for Flow Multiplier';
    }
  }
}

/* Accepts either a lesson id from LESSONS, or a transient ad-hoc lesson
   definition object (used by "Review Mistakes" — never saved to the
   course list or to localStorage). */
function startLesson(idOrDef, allowDirectPractice = false){
  if(document.activeElement && typeof document.activeElement.blur === 'function'){
    document.activeElement.blur();
  }
  if(typeof trialActive !== 'undefined' && trialActive && typeof stopTrial === 'function') stopTrial();
  if(typeof raceReset === 'function') raceReset();
  if(typeof raceMode !== 'undefined' && raceMode && typeof exitRaceMode === 'function') exitRaceMode();
  if(typeof window !== 'undefined' && window.adaptiveActive && typeof PK_ADAPTIVE !== 'undefined' && typeof PK_ADAPTIVE.exitSession === 'function'){
    PK_ADAPTIVE.exitSession(false);
  }
  const def = (typeof idOrDef === 'object') ? idOrDef : LESSONS.find(l=> String(l.id) === String(idOrDef));
  if(!def) return;
  if(!def.isRemedial && !allowDirectPractice && isLessonLocked(def.id)) return;

  if(currentLayoutId && COURSE_LESSON_STATES[currentLayoutId]){
    COURSE_LESSON_STATES[currentLayoutId] = null;
  }
  currentLesson = def;
  if(!def.layoutId) def.layoutId = currentLayoutId;
  remedialActive = !!def.isRemedial;
  isStripExpanded = false; // Make it small when starting a lesson
  if(collapsedLevels && def.level){
    // Keep only the active lesson's level open
    LEVELS.forEach(l => {
      if(String(l.id) !== String(def.level)) collapsedLevels.add(String(l.id));
      else collapsedLevels.delete(String(l.id));
    });
  }
  const gen = def.generate();
  lessonChars = gen.chars;
  lessonLayers = gen.layers;
  lessonKeyIds = gen.keyIds;
  lessonSections = gen.sections || [];
  lessonIndex = 0;
  lessonMistakes = 0;
  lessonMistakeChars = {};
  lessonAcceptedUnits = [];
  lessonPartialStroke = null;
  lessonExtendedOnce = false;
  lessonStartTime = 0;
  lessonTimerStarted = false;
  if (lessonTimerInterval) {
    clearInterval(lessonTimerInterval);
    lessonTimerInterval = null;
  }
  if (currentLesson && currentLesson.timeLimit) {
    lessonHasTimer = true;
    lessonTimeLeft = currentLesson.timeLimit;
  } else {
    lessonHasTimer = false;
    lessonTimeLeft = 0;
  }
  lessonActive = true;

  if(typeof PK_TRACKER !== 'undefined' && typeof PK_TRACKER.recordLessonStart === 'function'){
    PK_TRACKER.recordLessonStart({
      layout: currentLayoutId,
      lessonId: def.id,
      totalUnits: lessonChars.length,
      lessonChars: lessonChars,
      sections: lessonSections
    });
  }

  lockedLayer = null;
  hoverLayer = null;
  render();

  lessonTitleEl.textContent = def.title;
  renderLessonMeta(def);
  lessonPanel.hidden = false;
  const mEl = document.getElementById('manuscript'); if(mEl) mEl.hidden = true;
  if(lessonStrip){
    lessonStrip.hidden = false;
    renderLessonStrip();
  }
  if(typeof clearText === 'function'){ clearText(); } else if(typeof window !== 'undefined' && typeof window.clearText === 'function'){ window.clearText(); }
  renderLessonChars();
  updateLessonProgress();
  const audioBtn = document.getElementById('lessonAudioQuickBtn');
  const mainSound = document.getElementById('soundToggle');
  if(audioBtn && mainSound){
    audioBtn.classList.toggle('active', mainSound.classList.contains('on'));
  }
  saveActiveLessonSession();
  scrollToLessonStage();
}

function scrollToLessonStage(){
  const doScroll = ()=>{
    if(!lessonPanel || lessonPanel.hidden || !boardWrap) return;
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const vh = window.innerHeight || document.documentElement.clientHeight || 800;
    const boardRect = boardWrap.getBoundingClientRect();
    const boardBottom = currentScrollY + boardRect.bottom;
    const metaEl = lessonPanel.querySelector('.lesson-meta-row') || lessonPanel;
    const metaTop = currentScrollY + metaEl.getBoundingClientRect().top;
    const targetY = Math.max(0, Math.max(metaTop - 8, boardBottom - vh + 12));
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };
  requestAnimationFrame(doScroll);
  setTimeout(doScroll, 80);
}
window.scrollToLessonStage = scrollToLessonStage;

function executeLessonExit(){
  if (lessonTimerInterval) {
    clearInterval(lessonTimerInterval);
    lessonTimerInterval = null;
  }
  if(typeof PK_TRACKER !== 'undefined' && typeof PK_TRACKER.recordLessonExit === 'function'){
    PK_TRACKER.recordLessonExit({
      layout: currentLayoutId,
      lessonId: currentLesson ? currentLesson.id : null
    });
  }
  if(currentLayoutId && COURSE_LESSON_STATES[currentLayoutId]){
    COURSE_LESSON_STATES[currentLayoutId] = null;
  }
  clearActiveLessonSession();
  lessonActive = false;
  currentLesson = null;
  remedialActive = false;
  lessonAcceptedUnits = [];
  lessonPartialStroke = null;
  lessonPanel.hidden = true;
  const mElExit = document.getElementById('manuscript'); if(mElExit) mElExit.hidden = false;
  if(lessonStrip) lessonStrip.hidden = false;
  lockedLayer = null;
  render();
  if(highlightedKeyId && keyEls[highlightedKeyId]){
    keyEls[highlightedKeyId].classList.remove('lesson-target');
  }
  highlightedKeyId = null;
  if(highlightedModifierKeyId && keyEls[highlightedModifierKeyId]){
    keyEls[highlightedModifierKeyId].classList.remove('modifier-target');
  }
  highlightedModifierKeyId = null;
  renderLessonStrip();
}

function showIncompleteLesson(){
  document.querySelectorAll('.lesson-complete-overlay').forEach(el => el.remove());
  if(!currentLesson){
    executeLessonExit();
    return;
  }
  const def = currentLesson;
  let incSummary = null;
  if(typeof PK_FEEDBACK !== 'undefined' && typeof PK_TRACKER !== 'undefined'){
    const liveMetrics = PK_TRACKER.getLiveLessonMetrics();
    incSummary = PK_FEEDBACK.analyzeIncompleteLesson(liveMetrics, def, currentLayoutId);
  }
  if(!incSummary || typeof PK_FEEDBACK.buildIncompleteLessonHtml !== 'function'){
    executeLessonExit();
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'lesson-complete-overlay';
  overlay.innerHTML = PK_FEEDBACK.buildIncompleteLessonHtml(incSummary, def);
  document.body.appendChild(overlay);

  function cleanup(){
    window.removeEventListener('keydown', keyHandler);
    if(overlay.classList.contains('is-closing')) return;
    overlay.classList.add('is-closing');
    setTimeout(() => overlay.remove(), 220);
  }

  const keyHandler = (e)=>{
    if(e.key === 'Escape'){
      e.preventDefault();
      cleanup();
    }
  };
  window.addEventListener('keydown', keyHandler);

  const resumeBtn = overlay.querySelector('.lc-resume');
  if(resumeBtn){
    resumeBtn.addEventListener('click', ()=>{
      cleanup();
      scrollToLessonStage();
    });
  }

  const retryBtn = overlay.querySelector('.lc-retry');
  if(retryBtn){
    retryBtn.addEventListener('click', ()=>{
      cleanup();
      startLesson(remedialActive ? def : def.id);
    });
  }

  const exitConfirmBtn = overlay.querySelector('.lc-exit-confirm');
  if(exitConfirmBtn){
    exitConfirmBtn.addEventListener('click', ()=>{
      cleanup();
      executeLessonExit();
    });
  }
}

function exitLesson(forceImmediate){
  if(forceImmediate === true || !lessonActive || lessonIndex === 0 || lessonIndex >= lessonChars.length){
    executeLessonExit();
    return;
  }
  showIncompleteLesson();
}
window.exitLesson = exitLesson;
window.showIncompleteLesson = showIncompleteLesson;
window.executeLessonExit = executeLessonExit;
window.startLesson = startLesson;
window.suspendLessonForLayoutSwitch = suspendLessonForLayoutSwitch;
window.restoreLessonAfterLayoutSwitch = restoreLessonAfterLayoutSwitch;
window.resetAllCourseLessonStates = resetAllCourseLessonStates;
window.COURSE_LESSON_STATES = COURSE_LESSON_STATES;
window.lessonHandleChar = lessonHandleChar;
window.lessonHandleBackspace = lessonHandleBackspace;
try {
  Object.defineProperty(window, 'lessonActive', { get: () => lessonActive, set: (v) => { lessonActive = v; }, configurable: true });
  Object.defineProperty(window, 'lessonChars', { get: () => lessonChars, set: (v) => { lessonChars = v; }, configurable: true });
  Object.defineProperty(window, 'lessonIndex', { get: () => lessonIndex, set: (v) => { lessonIndex = v; }, configurable: true });
  Object.defineProperty(window, 'lessonKeyIds', { get: () => lessonKeyIds, set: (v) => { lessonKeyIds = v; }, configurable: true });
  Object.defineProperty(window, 'lessonLayers', { get: () => lessonLayers, set: (v) => { lessonLayers = v; }, configurable: true });
  Object.defineProperty(window, 'currentLesson', { get: () => currentLesson, set: (v) => { currentLesson = v; }, configurable: true });
} catch(e){}
lessonExitBtn.addEventListener('click', ()=> exitLesson(false));

const lessonQuickRestartBtn = document.getElementById('lessonQuickRestartBtn');
if(lessonQuickRestartBtn){
  lessonQuickRestartBtn.addEventListener('click', () => {
    if(typeof currentLesson !== 'undefined' && currentLesson){
      startLesson(currentLesson);
      if(typeof showToast === 'function'){
        const iconSvg = typeof pkIcon === 'function' ? pkIcon('reset', 16) : '';
        showToast(iconSvg, 'Drill Restarted', 'Restarted lesson from beginning.');
      }
    }
  });
}

const lessonAudioQuickBtn = document.getElementById('lessonAudioQuickBtn');
if(lessonAudioQuickBtn){
  lessonAudioQuickBtn.addEventListener('click', () => {
    const mainSoundToggle = document.getElementById('soundToggle');
    if(mainSoundToggle){
      mainSoundToggle.click();
      const isSoundOn = mainSoundToggle.classList.contains('on');
      lessonAudioQuickBtn.classList.toggle('active', isSoundOn);
    }
  });
}

/* Adaptive difficulty: mistake tracking without jarring mid-lesson duplicate spam.
   Mistakes are tracked in lessonMistakeChars and fed directly into the dedicated,
   context-aware "Review Mistakes" drill upon lesson completion. */
function adaptiveReinforce(ch){
  // Deliberately no mid-stream duplicate injections to prevent repetitive letter stutter.
}
/* Lesson length is governed by the structured 5-stage curriculum progression
   (short -> a little longer -> longer -> kinda long -> very long) rather than
   appending random characters mid-attempt. */
function adaptiveExtend(){
  // Deliberately no mid-stream random character injection.
}

function lessonHandleChar(val, el, stroke){
  if(!lessonActive || !val) return;
  if(currentLesson && !remedialActive && isLessonLocked(currentLesson.id)){
    collapsedLevels = null;
    executeLessonExit();
    return;
  }
  if(lessonIndex >= lessonChars.length) return;
  const expected = lessonChars[lessonIndex];
  if(!expected) return;

  if(!lessonTimerStarted){
    lessonTimerStarted = true;
    lessonStartTime = Date.now();
    if(lessonHasTimer){
      if(lessonTimerInterval) clearInterval(lessonTimerInterval);
      lessonTimerInterval = setInterval(() => {
        if (!lessonActive) return;
        lessonTimeLeft--;
        updateLessonProgress();
        if (lessonTimeLeft <= 0) {
          clearInterval(lessonTimerInterval);
          lessonTimerInterval = null;
          completeLesson();
        }
      }, 1000);
    }
  }

  let isMatch = (typeof compareTypingSequence === 'function')
    ? compareTypingSequence(val, expected)
    : (val === expected);
  let advanceUnits = 1;
  let acceptedVal = val;
  let acceptedExpected = expected;

  // Multi-codepoint NiDA support:
  // 1. Single atomic keystroke matches a 2-unit slice in target text (e.g. user typed atomic ាំ, target has ា + ំ)
  if(!isMatch && (lessonIndex + 1 < lessonChars.length)){
    const nextPair = expected + lessonChars[lessonIndex + 1];
    if(typeof compareTypingSequence === 'function' && compareTypingSequence(val, nextPair)){
      isMatch = true;
      advanceUnits = 2;
      acceptedExpected = nextPair;
    }
  }

  // 2. Sequential typing support for compound vowels:
  // If expected is a 2-codepoint compound vowel (e.g. ាំ) and user typed the first component (ា)
  const compoundPair = (typeof KHMER_COMPOUND_MAP !== 'undefined') ? KHMER_COMPOUND_MAP[expected] : null;
  if(!isMatch && compoundPair && !lessonPartialStroke){
    if(typeof compareTypingSequence === 'function' && compareTypingSequence(val, compoundPair[0])){
      lessonPartialStroke = {
        baseExpected: expected,
        firstVal: val,
        secondExpected: compoundPair[1]
      };
      if(typeof insertText === 'function'){ insertText(val); } else if(typeof window !== 'undefined' && typeof window.insertText === 'function'){ window.insertText(val); }
      recordKeystroke(true);
      if(el){ el.classList.add('correct'); setTimeout(()=> el.classList.remove('correct'), 260); }
      emberBurst(el, null, 4, null);
      runeRing(el);
      // Highlight the second required component
      const secondLoc = (typeof resolveCharLocation === 'function') ? resolveCharLocation(compoundPair[1]) : null;
      if(secondLoc && keyEls[secondLoc.id]){
        if(highlightedKeyId && keyEls[highlightedKeyId]) keyEls[highlightedKeyId].classList.remove('lesson-target');
        highlightedKeyId = secondLoc.id;
        keyEls[secondLoc.id].classList.add('lesson-target');
        if(typeof modifierInfoFor === 'function'){
          const mod = modifierInfoFor(secondLoc.id, secondLoc.layer);
          if(mod && mod.targetKey && keyEls[mod.targetKey]){
            if(highlightedModifierKeyId && keyEls[highlightedModifierKeyId]) keyEls[highlightedModifierKeyId].classList.remove('modifier-target');
            highlightedModifierKeyId = mod.targetKey;
            keyEls[mod.targetKey].classList.add('modifier-target');
          }
        }
        if(typeof setActiveFinger === 'function') setActiveFinger(secondLoc.id, secondLoc.layer);
      }
      return;
    }
  }

  // If completing a partial compound stroke
  if(lessonPartialStroke){
    if(typeof compareTypingSequence === 'function' && compareTypingSequence(val, lessonPartialStroke.secondExpected)){
      isMatch = true;
      acceptedVal = lessonPartialStroke.firstVal + val;
      acceptedExpected = lessonPartialStroke.baseExpected;
      advanceUnits = 1;
      lessonPartialStroke = null;
    } else {
      lessonPartialStroke = null;
      isMatch = false;
    }
  }

  const curSection = lessonSections.find(s => lessonIndex >= s.startIndex && lessonIndex <= s.endIndex);
  const curExId = curSection ? curSection.id : null;

  // Hook real-time tracker
  if(typeof PK_TRACKER !== 'undefined' && typeof PK_TRACKER.recordTypingUnit === 'function'){
    PK_TRACKER.recordTypingUnit({
      layout: currentLayoutId,
      lessonId: currentLesson ? currentLesson.id : null,
      exerciseId: curExId,
      unitIndex: lessonIndex,
      expected: acceptedExpected,
      produced: acceptedVal,
      correct: isMatch,
      strokeKeyId: stroke ? stroke.id : null,
      strokeLayer: stroke ? stroke.layer : null,
      expectedKeyId: lessonKeyIds[lessonIndex],
      expectedLayer: lessonLayers[lessonIndex]
    });
  }

  if(isMatch){
    lessonAcceptedUnits.push({
      index: lessonIndex,
      count: advanceUnits,
      val: acceptedVal,
      expected: acceptedExpected
    });
    if(typeof insertText === 'function'){ insertText(val); } else if(typeof window !== 'undefined' && typeof window.insertText === 'function'){ window.insertText(val); }
    recordKeystroke(true);
    lessonIndex += advanceUnits;
    if(el){ el.classList.add('correct'); setTimeout(()=> el.classList.remove('correct'), 260); }
    emberBurst(el, null, 5, null);
    runeRing(el);
    adaptiveExtend();
    if(lessonIndex >= lessonChars.length){
      completeLesson();
    } else {
      renderLessonChars();
      updateLessonProgress();
      saveActiveLessonSession();
    }
  } else {
    lessonMistakes++;
    lessonMistakeChars[expected] = (lessonMistakeChars[expected]||0) + 1;
    recordKeystroke(false);
    adaptiveReinforce(expected);
    updateLessonProgress();
    saveActiveLessonSession();
    if(el){ el.classList.add('wrong'); setTimeout(()=> el.classList.remove('wrong'), 300); }
    const cur = lessonCharRowEl.querySelector('.lc-char.current');
    if(cur){ cur.classList.add('shake'); setTimeout(()=> cur.classList.remove('shake'), 300); }
  }
}

function lessonHandleBackspace(){
  if(!lessonActive) return;

  if(lessonPartialStroke){
    if(typeof backspaceText === 'function'){
      backspaceText(lessonPartialStroke.firstVal);
    }
    lessonPartialStroke = null;
    updateLessonProgress();
    renderLessonChars();
    updateLessonKeyHighlight();
    return;
  }

  if(lessonIndex <= 0 || !lessonAcceptedUnits.length) return;

  const lastUnit = lessonAcceptedUnits.pop();
  if(!lastUnit) return;
  const count = lastUnit.count || 1;

  if(typeof PK_TRACKER !== 'undefined' && typeof PK_TRACKER.recordBackspace === 'function'){
    PK_TRACKER.recordBackspace({
      layout: currentLayoutId,
      lessonId: currentLesson ? currentLesson.id : null,
      unitIndex: Math.max(0, lessonIndex - count),
      poppedUnit: lastUnit.expected
    });
  }

  lessonIndex = Math.max(0, lessonIndex - count);

  if(typeof backspaceText === 'function'){
    backspaceText(lastUnit.val);
  }

  if(typeof recordLessonBackspace === 'function'){
    recordLessonBackspace();
  }

  updateLessonProgress();
  renderLessonChars();
  updateLessonKeyHighlight();
  saveActiveLessonSession();
}

function completeLesson(){
  if (lessonTimerInterval) {
    clearInterval(lessonTimerInterval);
    lessonTimerInterval = null;
  }
  if (!currentLesson || !lessonChars || lessonChars.length === 0) return;
  const attempts = lessonChars.length + lessonMistakes;
  if (attempts === 0) return;
  const elapsed = Math.max(0.5, (Date.now() - (lessonStartTime || Date.now())) / 1000);
  const accuracy = attempts > 0 && lessonChars.length > 0 ? Math.min(100, Math.max(0, Math.round((lessonChars.length / attempts) * 100))) : 0;
  const def = currentLesson;
  const id = def.id;
  const mistakeChars = Object.keys(lessonMistakeChars);

  let isNewBest = false;
  let bestRecord = null;
  if(def.isCustom && typeof PK_CUSTOM_LESSONS !== 'undefined' && typeof PK_CUSTOM_LESSONS.recordAttempt === 'function'){
    const custProg = PK_CUSTOM_LESSONS.recordAttempt(def.id, {
      accuracy: accuracy,
      wpm: lessonWpm,
      timeSec: elapsed,
      mistakes: lessonMistakes
    });
    if(custProg){
      isNewBest = custProg.bestAccuracy === accuracy || custProg.bestWpm === lessonWpm;
    }
  } else if(!remedialActive && !def.isCustom){
    const prevBest = getLessonBest(id);
    const mastered = accuracy >= (def.threshold || 85);
    bestRecord = {
      accuracy: prevBest ? Math.max(prevBest.accuracy, accuracy) : accuracy,
      time: (!prevBest || accuracy >= prevBest.accuracy) ? elapsed : prevBest.time,
      attempts: (prevBest ? prevBest.attempts : 0) + 1,
      mastered: (prevBest && prevBest.mastered) || mastered,
    };
    isNewBest = !prevBest || accuracy > prevBest.accuracy || (accuracy === prevBest.accuracy && elapsed < prevBest.time);
    try{ localStorage.setItem(lessonBestKey(id), JSON.stringify(bestRecord)); }catch(e){}
  }

  // Update persistent lesson WPM upon completion
  const rawWpm = (elapsed > 0 && Number.isFinite(elapsed)) ? (lessonChars.length / 5) / (elapsed / 60) : 0;
  const lessonWpm = (Number.isFinite(rawWpm) && rawWpm >= 0) ? Math.min(180, Math.max(0, Math.round(rawWpm))) : 0;
  if(lessonWpm > 0 && typeof savedLessonStats !== 'undefined'){
    savedLessonStats.wpm = lessonWpm;
    if(lessonWpm > (savedLessonStats.bestWpm || 0)){
      savedLessonStats.bestWpm = lessonWpm;
    }
    if(typeof saveLessonStats === 'function') saveLessonStats();
    if(typeof updateLessonStatsUI === 'function') updateLessonStatsUI();
  }

  if(typeof PK_TRACKER !== 'undefined' && typeof PK_TRACKER.recordLessonComplete === 'function'){
    PK_TRACKER.recordLessonComplete({
      layout: currentLayoutId,
      lessonId: id,
      accuracy: accuracy,
      time: elapsed,
      wpm: lessonWpm,
      mistakes: lessonMistakes
    });
  }

  // Phase 7 Persistent Progress Tracking
  if(!def.isCustom && typeof PK_PROGRESS !== 'undefined' && typeof PK_PROGRESS.recordLessonAttempt === 'function'){
    const attemptRes = PK_PROGRESS.recordLessonAttempt({
      layoutId: currentLayoutId,
      lessonId: id,
      levelId: def.level,
      accuracy: accuracy,
      wpm: lessonWpm,
      timeSec: elapsed,
      mistakes: lessonMistakes,
      corrections: (typeof lessonAcceptedUnits !== 'undefined' && lessonAcceptedUnits) ? lessonAcceptedUnits.length : 0,
      units: lessonChars.length,
      threshold: def.threshold || 85,
      sections: lessonSections
    });
    if(attemptRes && attemptRes.isNewBestAccuracy){
      isNewBest = true;
    }
  }

  // Phase 8 Adaptive Review Session Completion
  if(remedialActive && def && def.beforeStats && typeof PK_REVIEW !== 'undefined' && typeof PK_REVIEW.completeReviewSession === 'function'){
    const revResult = PK_REVIEW.completeReviewSession(currentLayoutId, def, {
      accuracy: accuracy,
      wpm: lessonWpm,
      timeSec: elapsed,
      mistakes: lessonMistakes
    });
    if(revResult && revResult.message && typeof showToast === 'function'){
      showToast(pkIcon('zap', 20), 'Review Complete', revResult.message);
    }
  }

  /* Clean completion without particle burst spam */
  const rect = (boardWrap || document.body).getBoundingClientRect();
  playChime();
  confettiBurst(rect.left + rect.width/2, rect.top + rect.height*0.3, accuracy === 100 ? 34 : 22);

  clearActiveLessonSession();
  lessonActive = false;
  lessonPanel.hidden = true;
  const mElComplete = document.getElementById('manuscript'); if(mElComplete) mElComplete.hidden = false;
  if(lessonStrip) lessonStrip.hidden = false;
  lockedLayer = null;
  render();
  if(highlightedKeyId && keyEls[highlightedKeyId]){
    keyEls[highlightedKeyId].classList.remove('lesson-target');
  }
  highlightedKeyId = null;
  if(highlightedModifierKeyId && keyEls[highlightedModifierKeyId]){
    keyEls[highlightedModifierKeyId].classList.remove('modifier-target');
  }
  highlightedModifierKeyId = null;
  if(!remedialActive){
    autoAdvanceLevelAccordion(def);
    renderLessonStrip();
    if(accuracy === 100) achievementOnce('perfect-'+id, pkIcon('diamond', 20), 'Flawless!', def.title + ' with 100% accuracy');
  } else {
    renderLessonStrip();
  }

  try {
    window.dispatchEvent(new CustomEvent('pkLessonCompleted', { detail: { lesson: def, accuracy, elapsed, isNewBest } }));
  } catch(e){}

  // Trigger Grandmaster Vault 222-completion celebratory fanfare
  if(!def.isBonus && countCompletedBaseLessons() >= 222){
    try {
      if(!localStorage.getItem('khmerVaultCelebrated')){
        localStorage.setItem('khmerVaultCelebrated', '1');
        if(typeof showGrandmasterVaultFanfareModal === 'function'){
          setTimeout(() => showGrandmasterVaultFanfareModal(), 900);
        }
      }
    } catch(e){}
  }

  showLessonComplete(def, accuracy, elapsed, isNewBest, mistakeChars);
}

function showLessonComplete(def, accuracy, elapsed, isNewBest, mistakeChars){
  document.querySelectorAll('.lesson-complete-overlay').forEach(el => el.remove());
  if(currentLayoutId && COURSE_LESSON_STATES[currentLayoutId]){
    COURSE_LESSON_STATES[currentLayoutId] = null;
  }
  const overlay = document.createElement('div');
  overlay.className = 'lesson-complete-overlay';

  const curIdx = LESSONS.findIndex(l => String(l.id) === String(def.id));
  const nextLesson = (!remedialActive && curIdx >= 0 && curIdx < LESSONS.length - 1) ? LESSONS[curIdx + 1] : null;
  const prevLesson = (!remedialActive && curIdx > 0) ? LESSONS[curIdx - 1] : null;

  let feedbackSummary = null;
  if(typeof PK_FEEDBACK !== 'undefined' && typeof PK_TRACKER !== 'undefined'){
    const liveMetrics = PK_TRACKER.getLiveLessonMetrics();
    feedbackSummary = PK_FEEDBACK.analyzeLesson(liveMetrics, def, currentLayoutId);
  }

  if(feedbackSummary && typeof PK_FEEDBACK.buildPostLessonCardHtml === 'function'){
    overlay.innerHTML = PK_FEEDBACK.buildPostLessonCardHtml(feedbackSummary, def, isNewBest, prevLesson, nextLesson);
  } else {
    const isKm = document.documentElement.classList.contains('site-km-mode');
    const timeStr = elapsed.toFixed(1) + (isKm ? 'វ' : 's');
    const threshold = def.threshold || 85;
    const failed = accuracy < threshold;
    const headingEn = remedialActive ? 'Mistake Drill Complete'
      : failed ? 'Keep Practicing'
      : (isNewBest ? 'New Personal Best!' : 'Lesson Complete');
    const headingKm = remedialActive ? 'បានបញ្ចប់ការហ្វឹកហាត់កំហុស'
      : failed ? 'បន្តការហ្វឹកហាត់'
      : (isNewBest ? 'កំណត់ត្រាល្អបំផុតថ្មី!' : 'បញ្ចប់មេរៀន');
    const badgeIcon = remedialActive ? pkIcon('target', 32)
      : failed ? pkIcon('reset', 32)
      : accuracy === 100 ? pkIcon('diamond', 32)
      : isNewBest ? pkIcon('zap', 32)
      : pkIcon('star', 32);

    const titleEn = def?.title || 'Lesson';
    const titleKm = def?.titleKm || def?.title || 'មេរៀន';

    overlay.innerHTML = `
      <div class="lesson-complete-card">
        <div class="lc-badge-halo"><div class="lc-badge">${badgeIcon}</div></div>
        <h2 class="i18n-t" data-en="${headingEn}" data-km="${headingKm}">${isKm ? headingKm : headingEn}</h2>
        <p class="i18n-t" data-en="${titleEn}" data-km="${titleKm}">${isKm ? titleKm : titleEn}</p>
        <div class="lc-divider"><span>◆</span></div>
        <div class="lc-stat-row">
          <div class="lc-ring-wrap">
            <div class="lc-ring" style="--pct:0"><b>0%</b></div>
            <span class="lc-ring-label i18n-t" data-en="Accuracy" data-km="សុក្រឹតភាព">${isKm ? 'សុក្រឹតភាព' : 'Accuracy'}</span>
          </div>
          <div class="lc-stat"><b class="lc-time">0.0s</b><span class="i18n-t" data-en="Time" data-km="រយៈពេល">${isKm ? 'រយៈពេល' : 'Time'}</span></div>
        </div>
        ${(mistakeChars && mistakeChars.length && !remedialActive) ? `
        <div class="lc-mistakes-preview">
          <span class="lc-mistakes-title i18n-t" data-en="Keys To Practice" data-km="គ្រាប់ចុចត្រូវហ្វឹកហាត់">${isKm ? 'គ្រាប់ចុចត្រូវហ្វឹកហាត់' : 'Keys To Practice'}</span>
          <div class="lc-mistake-chips">
            ${mistakeChars.map(ch => {
              const count = lessonMistakeChars[ch] || 1;
              return `<span class="lc-mistake-chip"><b>${ch}</b><small>${count}×</small></span>`;
            }).join('')}
          </div>
        </div>` : ''}
        ${(typeof renderLessonControlsHtml === 'function')
          ? renderLessonControlsHtml('completed', {
              mistakes: (mistakeChars && mistakeChars.length && !remedialActive) ? mistakeChars.length : 0,
              prevLesson: prevLesson,
              nextLesson: nextLesson,
              isRemedial: remedialActive
            })
          : `
          <div class="lesson-complete-actions">
            ${(mistakeChars && mistakeChars.length && !remedialActive) ? `<button type="button" class="lc-mistakes primary">${pkIcon('target', 14)} <span class="i18n-t" data-en="Review Mistakes" data-km="ពិនិត្យកំហុស">${isKm ? 'ពិនិត្យកំហុស' : 'Review Mistakes'}</span></button>` : ''}
            ${(prevLesson) ? `<button type="button" class="lc-prev">${pkIcon('arrow-left', 14)} <span class="i18n-t" data-en="Previous" data-km="ថយក្រោយ">${isKm ? 'ថយក្រោយ' : 'Previous'}</span></button>` : ''}
            <button type="button" class="lc-retry">${pkIcon('reset', 14)} <span class="i18n-t" data-en="Retry" data-km="ព្យាយាមម្តងទៀត">${isKm ? 'ព្យាយាមម្តងទៀត' : 'Retry'}</span></button>
            ${nextLesson ? `<button type="button" class="lc-next${((!mistakeChars || !mistakeChars.length) ? ' primary' : '')}"><span class="i18n-t" data-en="Next Lesson" data-km="មេរៀនបន្ទាប់">${isKm ? 'មេរៀនបន្ទាប់' : 'Next Lesson'}</span> ${pkIcon('arrow-right', 14)}</button>` : `<button type="button" class="lc-close primary"><span class="i18n-t" data-en="Close" data-km="បិទ">${isKm ? 'បិទ' : 'Close'}</span></button>`}
            ${nextLesson ? `<button type="button" class="lc-close"><span class="i18n-t" data-en="Close" data-km="បិទ">${isKm ? 'បិទ' : 'Close'}</span></button>` : ''}
          </div>`
        }
      </div>`;
  }

  const wasRemedial = remedialActive;
  remedialActive = false;

  document.body.appendChild(overlay);
  if(typeof confettiBurst === 'function'){
    confettiBurst(window.innerWidth / 2, window.innerHeight * 0.38, accuracy === 100 ? 55 : (isNewBest ? 45 : 30));
  }

  /* drifting embers inside the card */
  const emberHost = overlay.querySelector('.lesson-complete-card');
  if(emberHost){
    const emberCount = 10;
    for(let i=0;i<emberCount;i++){
      const p = document.createElement('div');
      p.className = 'lc-particle';
      p.style.left = (6 + Math.random()*88) + '%';
      p.style.animationDuration = (3.2 + Math.random()*2.4) + 's';
      p.style.animationDelay = (Math.random()*4) + 's';
      emberHost.appendChild(p);
    }
  }

  /* count up the accuracy ring + time if fallback ring exists */
  const ringEl = overlay.querySelector('.lc-ring');
  if(ringEl){
    const ringValEl = ringEl.querySelector('b');
    const timeEl = overlay.querySelector('.lc-time');
    const countStart = performance.now();
    const countDuration = 900;
    function stepCount(now){
      const t = Math.min(1, (now - countStart) / countDuration);
      const eased = 1 - Math.pow(1 - t, 3);
      const curAcc = Math.round(accuracy * eased);
      ringEl.style.setProperty('--pct', curAcc);
      if(ringValEl) ringValEl.textContent = curAcc + '%';
      if(timeEl) timeEl.textContent = (elapsed * eased).toFixed(1) + 's';
      if(t < 1) requestAnimationFrame(stepCount);
    }
    requestAnimationFrame(stepCount);
  }

  let keyHandler = null;
  let autoJumpTimer = null;
  let autoJumpInterval = null;

  function clearAutoJump(){
    if(autoJumpTimer){ clearTimeout(autoJumpTimer); autoJumpTimer = null; }
    if(autoJumpInterval){ clearInterval(autoJumpInterval); autoJumpInterval = null; }
  }

  function advanceToNext(){
    clearAutoJump();
    if(keyHandler){ window.removeEventListener('keydown', keyHandler); keyHandler = null; }
    overlay.remove();
    if(nextLesson){
      startLesson(nextLesson.id);
    }
  }

  function dismissOverlay(){
    clearAutoJump();
    if(keyHandler){ window.removeEventListener('keydown', keyHandler); keyHandler = null; }
    if(overlay.classList.contains('is-closing')) return;
    overlay.classList.add('is-closing');
    let settled = false;
    const finalize = () => {
      if(settled) return;
      settled = true;
      overlay.remove();
      if(lessonStrip){
        lessonStrip.hidden = false;
        renderLessonStrip();
      }
    };
    overlay.addEventListener('animationend', (e)=>{
      if(e.target === overlay) finalize();
    }, { once: true });
    setTimeout(finalize, 230);
  }

  // Grandmaster Bonus Auto-Jump:
  // If the completed lesson was a bonus lesson, passed threshold, and subsequent bonus lesson exists,
  // display the golden auto-jump banner and smoothly jump directly to that lesson.
  const bonusThreshold = (def && def.threshold) || 85;
  const isBonusPassed = accuracy >= bonusThreshold;
  if(def && def.isBonus && isBonusPassed && nextLesson && nextLesson.isBonus){
    const cardEl = overlay.querySelector('.lesson-complete-card');
    if(cardEl){
      const isKm = document.documentElement.classList.contains('site-km-mode');
      const banner = document.createElement('div');
      banner.className = 'bonus-auto-jump-banner';
      const jumpTitle = isKm ? 'ដោះសោវគ្គពិសេសបន្ទាប់!' : 'Next Bonus Lesson Unlocked!';
      const targetTitle = isKm ? (nextLesson.titleKm || nextLesson.title) : nextLesson.title;
      const jumpDesc = isKm
        ? `កំពុងផ្លាស់ប្តូរទៅ៖ ${targetTitle} ក្នុងរយៈពេល <b class="baj-sec">2</b>វ...`
        : `Auto-jumping to: ${targetTitle} in <b class="baj-sec">2</b>s...`;
      const btnLabel = isKm ? 'ចូលរៀនភ្លាមៗ' : 'Jump Now';

      banner.innerHTML = `
        <div class="baj-icon">
          <svg class="pk-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        </div>
        <div class="baj-content">
          <div class="baj-title">${jumpTitle}</div>
          <div class="baj-desc">${jumpDesc}</div>
        </div>
        <button type="button" class="baj-jump-btn">${btnLabel} ${pkIcon('arrow-right', 13)}</button>
      `;

      const actionsEl = cardEl.querySelector('.lesson-complete-actions');
      if(actionsEl){
        cardEl.insertBefore(banner, actionsEl);
      } else {
        cardEl.appendChild(banner);
      }

      const jumpBtn = banner.querySelector('.baj-jump-btn');
      if(jumpBtn){
        jumpBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          advanceToNext();
        });
      }

      let secLeft = 2;
      const secEl = banner.querySelector('.baj-sec');
      autoJumpInterval = setInterval(() => {
        secLeft--;
        if(secEl) secEl.textContent = String(Math.max(0, secLeft));
        if(secLeft <= 0){
          clearInterval(autoJumpInterval);
          autoJumpInterval = null;
        }
      }, 1000);

      autoJumpTimer = setTimeout(() => {
        advanceToNext();
      }, 2000);
    }
  } else if(def && def.isCustom){
    const cardEl = overlay.querySelector('.lesson-complete-card');
    if(cardEl){
      const isKm = document.documentElement.classList.contains('site-km-mode');
      const actionsEl = cardEl.querySelector('.lesson-complete-actions');
      if(actionsEl){
        actionsEl.innerHTML = `
          <button type="button" class="lc-custom-hub primary">${pkIcon('book', 14)} <span class="i18n-t" data-en="Custom Lessons" data-km="មេរៀនផ្ទាល់ខ្លួន">${isKm ? 'មេរៀនផ្ទាល់ខ្លួន' : 'Custom Lessons'}</span></button>
          <button type="button" class="lc-retry">${pkIcon('reset', 14)} <span class="i18n-t" data-en="Retry" data-km="ព្យាយាមម្តងទៀត">${isKm ? 'ព្យាយាមម្តងទៀត' : 'Retry'}</span></button>
          <button type="button" class="lc-close"><span class="i18n-t" data-en="Close" data-km="បិទ">${isKm ? 'បិទ' : 'Close'}</span></button>
        `;
        const hubBtn = actionsEl.querySelector('.lc-custom-hub');
        if(hubBtn){
          hubBtn.addEventListener('click', () => {
            dismissOverlay();
            if(typeof PK_CUSTOM_LESSONS !== 'undefined' && typeof PK_CUSTOM_LESSONS.openHub === 'function'){
              PK_CUSTOM_LESSONS.openHub();
            }
          });
        }
      }
    }
  } else if(def && !def.isCustom && (countCompletedBaseLessons() >= 222 || !nextLesson)){
    const cardEl = overlay.querySelector('.lesson-complete-card');
    if(cardEl && !cardEl.querySelector('.custom-lesson-complete-cta')){
      const isKm = document.documentElement.classList.contains('site-km-mode');
      const cta = document.createElement('div');
      cta.className = 'custom-lesson-complete-cta';
      cta.innerHTML = `
        <div class="cl-cta-icon" aria-hidden="true">
          <svg class="pk-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </div>
        <div class="cl-cta-text">
          <div class="cl-cta-title i18n-t" data-en="Craft Your Own Lessons" data-km="បង្កើតមេរៀនផ្ទាល់ខ្លួនរបស់អ្នក">${isKm ? 'បង្កើតមេរៀនផ្ទាល់ខ្លួនរបស់អ្នក' : 'Craft Your Own Lessons'}</div>
          <div class="cl-cta-desc i18n-t" data-en="Create customized practice drills with your own words or text." data-km="បង្កើតលំហាត់វាយអក្សរផ្ទាល់ខ្លួនដោយប្រើពាក្យ ឬអត្ថបទដែលអ្នកចង់បាន។">${isKm ? 'បង្កើតលំហាត់វាយអក្សរផ្ទាល់ខ្លួនដោយប្រើពាក្យ ឬអត្ថបទដែលអ្នកចង់បាន។' : 'Create customized practice drills with your own words or text.'}</div>
        </div>
        <button type="button" class="cl-cta-btn" id="clCompleteCtaBtn"><span class="i18n-t" data-en="Create Lesson" data-km="បង្កើតមេរៀន">${isKm ? 'បង្កើតមេរៀន' : 'Create Lesson'}</span></button>
      `;
      const actionsEl = cardEl.querySelector('.lesson-complete-actions');
      if(actionsEl) cardEl.insertBefore(cta, actionsEl);
      else cardEl.appendChild(cta);

      const ctaBtn = cta.querySelector('#clCompleteCtaBtn');
      if(ctaBtn){
        ctaBtn.addEventListener('click', () => {
          dismissOverlay();
          if(typeof PK_CUSTOM_LESSONS !== 'undefined' && typeof PK_CUSTOM_LESSONS.openEditor === 'function'){
            PK_CUSTOM_LESSONS.openEditor(null);
          }
        });
      }
    }
  } else if(def && def.isBonus && isBonusPassed && (!nextLesson || !nextLesson.isBonus)){
    const cardEl = overlay.querySelector('.lesson-complete-card');
    if(cardEl){
      const isKm = document.documentElement.classList.contains('site-km-mode');
      const banner = document.createElement('div');
      banner.className = 'bonus-auto-jump-banner vault-conquered';
      const grandTitle = isKm ? 'បានបញ្ចប់ឃ្លាំងមេរៀនពិសេសទាំងស្រុង!' : 'Grandmaster Vault Conquered!';
      const grandDesc = isKm
        ? 'អ្នកបានឆ្លងកាត់គ្រប់មេរៀនពិសេសទាំងអស់ក្នុងកម្រិតកំពូលនេះ!'
        : 'You have mastered every single bonus challenge in this layout!';
      banner.innerHTML = `
        <div class="baj-icon">
          <svg class="pk-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
        </div>
        <div class="baj-content">
          <div class="baj-title">${grandTitle}</div>
          <div class="baj-desc">${grandDesc}</div>
        </div>
      `;
      const actionsEl = cardEl.querySelector('.lesson-complete-actions');
      if(actionsEl){
        cardEl.insertBefore(banner, actionsEl);
      } else {
        cardEl.appendChild(banner);
      }
    }
  }

  keyHandler = (e)=>{
    if(e.key === 'Escape'){
      e.preventDefault();
      dismissOverlay();
    } else if(nextLesson && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight')){
      e.preventDefault();
      advanceToNext();
    }
  };
  window.addEventListener('keydown', keyHandler);

  const retryBtn = overlay.querySelector('.lc-retry');
  if(retryBtn){
    retryBtn.addEventListener('click', ()=>{
      dismissOverlay();
      if(def.isCustom && typeof PK_CUSTOM_LESSONS !== 'undefined' && typeof PK_CUSTOM_LESSONS.startPractice === 'function'){
        PK_CUSTOM_LESSONS.startPractice(def.id);
      } else {
        startLesson(wasRemedial ? def : def.id);
      }
    });
  }
  const nextBtn = overlay.querySelector('.lc-next');
  if(nextBtn) nextBtn.addEventListener('click', ()=>{ advanceToNext(); });
  const prevBtn = overlay.querySelector('.lc-prev');
  if(prevBtn) prevBtn.addEventListener('click', ()=>{ dismissOverlay(); startLesson(prevLesson.id); });
  const mistakesBtn = overlay.querySelector('.lc-mistakes');
  if(mistakesBtn){
    mistakesBtn.addEventListener('click', ()=>{
      dismissOverlay();
      const rawMistakeList = (mistakeChars && mistakeChars.length) ? mistakeChars : Object.keys(lessonMistakeChars);
      
      const entries = rawMistakeList.map(resolveCharLocation).filter(Boolean);
      if(!entries.length) return;
      
      const isKm = document.documentElement.classList.contains('site-km-mode');
      const mistakeStr = rawMistakeList.join(' ');
      const title = isKm ? `រំលឹកកំហុស — ${def.title}` : `Review Mistakes — ${def.title}`;
      const subtitle = isKm ? `ហ្វឹកហាត់លើគ្រាប់ចុចខុស៖ ${mistakeStr}` : `Targeted practice on missed keys: ${mistakeStr}`;
      
      startLesson({
        id: -1,
        level: def.level,
        type: 'review',
        isRemedial: true,
        title: title,
        subtitle: subtitle,
        layer: entries[0].layer,
        newLayer: entries[0].layer,
        newChars: entries.reduce((acc, e) => { acc[e.id] = e.ch; return acc; }, {}),
        threshold: 0,
        newIds: entries.map(e => e.id),
        generate: () => materialize(seqReviewMistakes(entries)),
      });
    });
  }
  const closeBtns = overlay.querySelectorAll('.lc-close');
  closeBtns.forEach(btn => btn.addEventListener('click', ()=>{ dismissOverlay(); }));
}

// Immediately hydrate with bundled curriculum data if available
initCurriculumFromBundle();

if(typeof restoreSavedLessonSession === 'function'){
  restoreSavedLessonSession();
}

if(document.readyState !== 'loading'){
  if(!lessonActive) renderLessonStrip();
} else {
  document.addEventListener('DOMContentLoaded', ()=>{
    if(typeof restoreSavedLessonSession === 'function' && !lessonActive){
      restoreSavedLessonSession();
    }
    if(lessonStrip && lessonStrip.children.length === 0) renderLessonStrip();
  });
}

/* ---------- ripple burst ---------- */

function applyLessonsData(data){
  if(!data) return;
  if(data.LEVELS && Array.isArray(data.LEVELS)) LEVELS.length = 0, LEVELS.push(...data.LEVELS);
  if(data.LESSONS_STANDARD) LESSONS_STANDARD.length = 0, LESSONS_STANDARD.push(...data.LESSONS_STANDARD);
  if(data.LESSONS_NIDA) LESSONS_NIDA.length = 0, LESSONS_NIDA.push(...data.LESSONS_NIDA);
  if(data.LESSONS_ENGLISH) LESSONS_ENGLISH.length = 0, LESSONS_ENGLISH.push(...data.LESSONS_ENGLISH);
  if(data.LEVELS && Array.isArray(data.LEVELS)) LEVELS_STANDARD.length = 0, LEVELS_STANDARD.push(...data.LEVELS);
  if(data.LEVELS_NIDA && Array.isArray(data.LEVELS_NIDA)) LEVELS_NIDA.length = 0, LEVELS_NIDA.push(...data.LEVELS_NIDA);
  if(data.LEVELS_ENGLISH && Array.isArray(data.LEVELS_ENGLISH)) LEVELS_ENGLISH.length = 0, LEVELS_ENGLISH.push(...data.LEVELS_ENGLISH);
  if(data.LESSONS_STANDARD && Array.isArray(data.LESSONS_STANDARD)) LESSONS_STANDARD.length = 0, LESSONS_STANDARD.push(...data.LESSONS_STANDARD);
  if(data.LESSONS_NIDA && Array.isArray(data.LESSONS_NIDA)) LESSONS_NIDA.length = 0, LESSONS_NIDA.push(...data.LESSONS_NIDA);
  if(data.LESSONS_ENGLISH && Array.isArray(data.LESSONS_ENGLISH)) LESSONS_ENGLISH.length = 0, LESSONS_ENGLISH.push(...data.LESSONS_ENGLISH);
  if(typeof LEVEL_SETS !== 'undefined') window.LEVELS = LEVELS = LEVEL_SETS[currentLayoutId] || LEVELS_STANDARD;
  if(typeof LESSON_SETS !== 'undefined') window.LESSONS = LESSONS = LESSON_SETS[currentLayoutId] || LESSONS_STANDARD;
  if(typeof renderLessonStrip === "function") renderLessonStrip();
  if(typeof updateMasteryStat === "function") updateMasteryStat();
}

/* ==========================================================================
   222 MASTER LESSONS & ALPHABET COVERAGE HUB CONTROLLER
   ========================================================================== */

(function initLearnMoreHubModule(){
  const KHMER_CONSONANTS = ['ក','ខ','គ','ឃ','ង','ច','ឆ','ជ','ឈ','ញ','ដ','ឋ','ឌ','ឍ','ណ','ត','ថ','ទ','ធ','ន','ប','ផ','ព','ភ','ម','យ','រ','ល','វ','ស','ហ','ឡ','អ'];
  const KHMER_DEP_VOWELS = ['ា','ិ','ី','ឹ','ឺ','ុ','ូ','ួ','ើ','ឿ','ៀ','េ','ែ','ៃ','ោ','ៅ','ុំ','ំ','ះ','ុះ','េះ','ោះ'];
  const KHMER_INDEP_VOWELS = ['ឥ','ឦ','ឧ','ឩ','ឪ','ឫ','ឬ','ឭ','ឮ','ឯ','ឰ','ឱ','ឳ','ឲ'];
  const KHMER_DIACRITICS = ['់','៉','៊','៍','័','៏','៌','៎','ៗ','៖','។','៕','៛'];
  const KHMER_NUMBERS = ['០','១','២','៣','៤','៥','៦','៧','៨','៩'];
  const EN_LOWER = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const EN_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const EN_DIGITS = '0123456789'.split('');

  let hubActiveTrack = 'standard';
  let hubAlphaScope = 'all';
  let selectedInspectorChar = null;
  let hubInitialized = false;

  function getHubModal() {
    return document.getElementById('learnMoreHubModal');
  }

  function getCharLessonsMap(preferredLayout) {
    const map = new Map();
    const cData = (typeof window !== 'undefined' && window.CURRICULUM_DATA)
      ? window.CURRICULUM_DATA
      : (typeof global !== 'undefined' && global.CURRICULUM_DATA)
      ? global.CURRICULUM_DATA
      : null;

    const tracks = (preferredLayout === 'nida')
      ? ['nida', 'standard', 'english']
      : (preferredLayout === 'english')
      ? ['english', 'standard', 'nida']
      : ['standard', 'nida', 'english'];

    tracks.forEach(track => {
      if (cData && cData[track] && Array.isArray(cData[track].lessons)) {
        cData[track].lessons.forEach(l => {
          if (l.newKeys && Array.isArray(l.newKeys)) {
            l.newKeys.forEach(k => {
              if (k && k.char && !map.has(k.char)) {
                map.set(k.char, { lessonId: l.id, title: l.title, titleKm: l.titleKm || l.title, layoutId: track });
              }
            });
          }
        });
      }
      const runtimeList = (typeof LESSON_SETS !== 'undefined' && LESSON_SETS[track])
        ? LESSON_SETS[track]
        : (track === 'standard' ? LESSONS_STANDARD : track === 'nida' ? LESSONS_NIDA : LESSONS_ENGLISH);
      if (Array.isArray(runtimeList)) {
        runtimeList.forEach(l => {
          if (l.newKeys && Array.isArray(l.newKeys)) {
            l.newKeys.forEach(k => {
              if (k && k.char && !map.has(k.char)) {
                map.set(k.char, { lessonId: l.id, title: l.title, titleKm: l.titleKm || l.title, layoutId: track });
              }
            });
          }
        });
      }
    });

    return map;
  }

  function findLessonForChar(ch, layoutHint) {
    const prefLayout = layoutHint || (typeof currentLayoutId !== 'undefined' ? currentLayoutId : 'standard');
    const map = getCharLessonsMap(prefLayout);
    if(map.has(ch)) return map.get(ch);
    // English uppercase letters fallback to Shift / capital lesson
    if(/^[A-Z]$/.test(ch)) {
      return { lessonId: 'en-L08-01', title: `Shift Key & Capitals (${ch})`, titleKm: `គ្រាប់ចុច Shift និងអក្សរធំ (${ch})`, layoutId: 'english' };
    }
    if(/^[a-z0-9]$/i.test(ch)) {
      return { lessonId: 'en-L01-01', title: 'Home Row Index Anchors (F & J)', titleKm: 'គ្រាប់ចុចយុថ្កា (F & J)', layoutId: 'english' };
    }
    return { lessonId: 'standard-L00-02', title: 'Right Middle Anchor ក (K)', titleKm: 'ក (K)', layoutId: 'standard' };
  }

  function getUnicodeCodePoint(ch) {
    if(!ch) return '';
    return 'U+' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
  }

  function inspectChar(ch, category, layoutHint) {
    selectedInspectorChar = ch;
    const inspectorEl = document.getElementById('lmAlphaInspector');
    if(!inspectorEl) return;
    inspectorEl.hidden = false;

    const glyphEl = document.getElementById('lmAiGlyph');
    const nameEl = document.getElementById('lmAiName');
    const codeEl = document.getElementById('lmAiCode');
    const catEl = document.getElementById('lmAiCategory');
    const lessonEl = document.getElementById('lmAiLessonName');
    const launchBtn = document.getElementById('lmAiLaunchBtn');

    if(glyphEl) glyphEl.textContent = ch;
    if(codeEl) codeEl.textContent = getUnicodeCodePoint(ch);
    if(catEl) catEl.textContent = category || 'Khmer Letter';

    const lessonInfo = findLessonForChar(ch, layoutHint);
    const isKm = document.documentElement.classList.contains('site-km-mode');
    const displayTitle = (isKm && lessonInfo.titleKm) ? lessonInfo.titleKm : lessonInfo.title;

    if(nameEl) {
      nameEl.textContent = `${category || 'Character'}: ${ch}`;
    }
    if(lessonEl) {
      lessonEl.textContent = `${lessonInfo.lessonId} (${displayTitle})`;
    }

    if(launchBtn) {
      launchBtn.onclick = function() {
        window.launchMasterLesson(lessonInfo.lessonId, lessonInfo.layoutId || layoutHint || 'standard');
      };
    }

    // Highlight selected tile
    document.querySelectorAll('.lm-char-tile').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-char') === ch);
    });
  }

  function renderAlphabetMatrix(scope) {
    const container = document.getElementById('lmAlphaGrids');
    if(!container) return;
    scope = scope || hubAlphaScope || 'all';
    container.innerHTML = '';

    const isKm = document.documentElement.classList.contains('site-km-mode');

    const sections = [];
    if(scope === 'all' || scope === 'khmer'){
      sections.push(
        { title: isKm ? 'ព្យញ្ជនៈ ៣៣ តួ (Consonants)' : '33 Khmer Consonants (ព្យញ្ជនៈ)', badge: '33/33 Included · 100%', chars: KHMER_CONSONANTS, cat: 'Consonant', layout: 'standard' },
        { title: isKm ? 'ស្រៈនិស្ស័យ ២២ តួ (Dependent Vowels)' : '22 Dependent Vowels (ស្រៈនិស្ស័យ)', badge: '22/22 Included · 100%', chars: KHMER_DEP_VOWELS, cat: 'Dependent Vowel', layout: 'standard' },
        { title: isKm ? 'ស្រៈពេញតួ ១៤ តួ (Independent Vowels)' : '14 Independent Vowels (ស្រៈពេញតួ)', badge: '14/14 Included · 100%', chars: KHMER_INDEP_VOWELS, cat: 'Independent Vowel', layout: 'nida' },
        { title: isKm ? 'វណ្ណយុត្តិ និងសញ្ញា (Diacritics & Punctuation)' : 'Diacritics & Punctuation (វណ្ណយុត្តិ)', badge: '13/13 Included · 100%', chars: KHMER_DIACRITICS, cat: 'Diacritic', layout: 'standard' },
        { title: isKm ? 'លេខខ្មែរ ០-៩ (Khmer Numerals)' : 'Khmer Numerals ០-៩ (លេខខ្មែរ)', badge: '10/10 Included · 100%', chars: KHMER_NUMBERS, cat: 'Khmer Numeral', layout: 'standard' }
      );
    }
    if(scope === 'all' || scope === 'english'){
      sections.push(
        { title: isKm ? 'អក្សរឡាតាំងតូច a-z (English Lowercase)' : 'English Lowercase (a-z)', badge: '26/26 Included · 100%', chars: EN_LOWER, cat: 'English Lowercase', layout: 'english' },
        { title: isKm ? 'អក្សរឡាតាំងធំ A-Z (English Uppercase)' : 'English Uppercase (A-Z)', badge: '26/26 Included · 100%', chars: EN_UPPER, cat: 'English Uppercase', layout: 'english' },
        { title: isKm ? 'លេខសកល 0-9 (English Digits)' : 'English Digits (0-9)', badge: '10/10 Included · 100%', chars: EN_DIGITS, cat: 'English Digit', layout: 'english' }
      );
    }

    sections.forEach(sec => {
      const secEl = document.createElement('section');
      secEl.className = 'lm-alpha-section';
      secEl.innerHTML = `
        <div class="lm-alpha-sec-header">
          <span class="lm-alpha-sec-title">${sec.title}</span>
          <span class="lm-alpha-sec-badge">${sec.badge}</span>
        </div>
        <div class="lm-char-grid"></div>
      `;
      const grid = secEl.querySelector('.lm-char-grid');
      sec.chars.forEach(ch => {
        const tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'lm-char-tile';
        tile.setAttribute('data-char', ch);
        tile.setAttribute('title', `${ch} (${getUnicodeCodePoint(ch)}) — Click to inspect`);
        tile.innerHTML = `<span>${ch}</span><span class="lm-char-dot" aria-hidden="true"></span>`;
        tile.onclick = () => inspectChar(ch, sec.cat, sec.layout);
        grid.appendChild(tile);
      });
      container.appendChild(secEl);
    });

    // Auto-inspect first consonant if none selected
    if(!selectedInspectorChar && KHMER_CONSONANTS.length > 0){
      inspectChar(KHMER_CONSONANTS[0], 'Consonant', 'standard');
    }
  }

  function renderHubLessons(track, query) {
    const container = document.getElementById('lmBrowseLessonsContainer');
    if(!container) return;
    track = track || hubActiveTrack || 'standard';
    query = (query || '').toLowerCase().trim();

    let lessonsList = LESSONS_STANDARD;
    if(track === 'nida') lessonsList = LESSONS_NIDA;
    if(track === 'english') lessonsList = LESSONS_ENGLISH;

    if(!lessonsList || !Array.isArray(lessonsList) || lessonsList.length === 0){
      container.innerHTML = '<div style="padding:20px;text-align:center;color:#94a3b8;">Loading curriculum data...</div>';
      return;
    }

    const filtered = lessonsList.filter(l => {
      if(!query) return true;
      const t = (l.title || '').toLowerCase();
      const tKm = (l.titleKm || '').toLowerCase();
      const id = (l.id || '').toLowerCase();
      const keys = (l.newKeys || []).map(k => k.char || '').join('').toLowerCase();
      return t.includes(query) || tKm.includes(query) || id.includes(query) || keys.includes(query);
    });

    if(filtered.length === 0){
      container.innerHTML = '<div style="padding:24px;text-align:center;color:#94a3b8;">No matching lessons found for your query.</div>';
      return;
    }

    const isKm = document.documentElement.classList.contains('site-km-mode');
    container.innerHTML = '';

    filtered.forEach(l => {
      const card = document.createElement('article');
      card.className = 'lm-lesson-item';
      const titleDisplay = (isKm && l.titleKm) ? l.titleKm : l.title;
      const keysHtml = (l.newKeys && l.newKeys.length > 0)
        ? l.newKeys.slice(0, 6).map(k => `<span class="lm-li-key-badge">${k.char || k.keyId}</span>`).join('')
        : `<span style="font-size:0.68rem;color:#94a3b8;">Practice drill</span>`;

      card.innerHTML = `
        <div class="lm-li-top">
          <span class="lm-li-code">${l.id}</span>
          <span class="lm-li-units">${l.level ? 'Level ' + l.level : ''} · ${(l.type || 'drill').toUpperCase()}</span>
        </div>
        <div class="lm-li-title">${titleDisplay}</div>
        <div class="lm-li-keys">${keysHtml}</div>
        <button type="button" class="lm-li-launch-btn">
          <svg class="pk-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span class="i18n-t" data-en="Start Lesson" data-km="ចូលរៀន">Start Lesson</span>
        </button>
      `;

      card.querySelector('.lm-li-launch-btn').onclick = function() {
        window.launchMasterLesson(l.id, track);
      };

      container.appendChild(card);
    });
  }

  function setupHubEvents() {
    if(hubInitialized) return;
    hubInitialized = true;

    const modal = getHubModal();
    const tabCustom = document.getElementById('lmTabBtn-custom');
    if(tabCustom){
      tabCustom.onclick = function() {
        closeLearnMoreHub();
        if(typeof PK_CUSTOM_LESSONS !== 'undefined' && typeof PK_CUSTOM_LESSONS.openHub === 'function'){
          PK_CUSTOM_LESSONS.openHub();
        }
      };
    }
    const closeBtn = document.getElementById('learnMoreHubCloseBtn');
    const doneBtn = document.getElementById('learnMoreHubDoneBtn');
    const topBtn = document.getElementById('topLearnMoreBtn');

    if(closeBtn) closeBtn.onclick = closeLearnMoreHub;
    if(doneBtn) doneBtn.onclick = closeLearnMoreHub;
    if(topBtn) topBtn.onclick = () => openLearnMoreHub('alphabet');

    if(modal) {
      modal.onclick = (e) => {
        if(e.target === modal) closeLearnMoreHub();
      };
      modal.addEventListener('keydown', (e) => {
        if(e.key === 'Escape') closeLearnMoreHub();
      });
    }

    // Tab buttons
    const tabAlphabet = document.getElementById('lmTabBtn-alphabet');
    const tabLessons = document.getElementById('lmTabBtn-lessons');
    const tabMaster = document.getElementById('lmTabBtn-master');
    const tabVault = document.getElementById('lmTabBtn-vault');

    const panelAlphabet = document.getElementById('lmPanel-alphabet');
    const panelLessons = document.getElementById('lmPanel-lessons');
    const panelMaster = document.getElementById('lmPanel-master');
    const panelVault = document.getElementById('lmPanel-vault');

    function switchTab(tabId) {
      const tabs = [tabAlphabet, tabLessons, tabMaster, tabVault];
      const panels = [panelAlphabet, panelLessons, panelMaster, panelVault];

      tabs.forEach(t => { if(t) t.classList.remove('active'), t.setAttribute('aria-selected', 'false'); });
      panels.forEach(p => { if(p) p.classList.remove('active'), p.hidden = true; });

      if(tabId === 'alphabet') {
        if(tabAlphabet) tabAlphabet.classList.add('active'), tabAlphabet.setAttribute('aria-selected', 'true');
        if(panelAlphabet) panelAlphabet.classList.add('active'), panelAlphabet.hidden = false;
        renderAlphabetMatrix();
      } else if(tabId === 'lessons') {
        if(tabLessons) tabLessons.classList.add('active'), tabLessons.setAttribute('aria-selected', 'true');
        if(panelLessons) panelLessons.classList.add('active'), panelLessons.hidden = false;
        renderHubLessons();
      } else if(tabId === 'master') {
        if(tabMaster) tabMaster.classList.add('active'), tabMaster.setAttribute('aria-selected', 'true');
        if(panelMaster) panelMaster.classList.add('active'), panelMaster.hidden = false;
      } else if(tabId === 'vault') {
        if(tabVault) tabVault.classList.add('active'), tabVault.setAttribute('aria-selected', 'true');
        if(panelVault) panelVault.classList.add('active'), panelVault.hidden = false;
        renderHubVault();
      }
    }

    if(tabAlphabet) tabAlphabet.onclick = () => switchTab('alphabet');
    if(tabLessons) tabLessons.onclick = () => switchTab('lessons');
    if(tabMaster) tabMaster.onclick = () => switchTab('master');
    if(tabVault) tabVault.onclick = () => switchTab('vault');

    // Layout pills in alphabet matrix
    const alphaPillGroup = document.getElementById('lmAlphaLayoutSelector');
    if(alphaPillGroup) {
      alphaPillGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('.lm-alpha-pill-btn');
        if(!btn) return;
        alphaPillGroup.querySelectorAll('.lm-alpha-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        hubAlphaScope = btn.getAttribute('data-alpha-layout') || 'all';
        renderAlphabetMatrix(hubAlphaScope);
      });
    }

    // Track pills in Browse Lessons
    const browsePillGroup = document.getElementById('lmBrowseTrackPills');
    if(browsePillGroup) {
      browsePillGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('.lm-track-pill');
        if(!btn) return;
        browsePillGroup.querySelectorAll('.lm-track-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        hubActiveTrack = btn.getAttribute('data-track') || 'standard';
        const searchInput = document.getElementById('lmHubLessonSearch');
        renderHubLessons(hubActiveTrack, searchInput ? searchInput.value : '');
      });
    }

    // Live search input in Browse Lessons
    const searchInput = document.getElementById('lmHubLessonSearch');
    if(searchInput) {
      let debounceTimer = null;
      searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          renderHubLessons(hubActiveTrack, searchInput.value);
        }, 150);
      });
    }
  }

  function renderHubVault() {
    const progressCard = document.getElementById('lmVaultProgressCard');
    const tiersGrid = document.getElementById('lmVaultTiersGrid');
    if (!progressCard || !tiersGrid) return;

    const completed = countCompletedBaseLessons();
    const isUnlocked = areAll222LessonsUnlocked();
    const isPreview = (function(){
      try { return localStorage.getItem('khmerUnlock222Vault') === '1'; }catch(e){ return false; }
    })();
    const isKm = document.documentElement.classList.contains('site-km-mode');
    const pct = Math.min(100, Math.round((completed / 222) * 100));

    progressCard.innerHTML = `
      <div class="lm-vp-top">
        <div class="lm-vp-status ${isUnlocked ? 'unlocked' : 'locked'}">
          <svg class="pk-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${isUnlocked ? '<polyline points="20 6 9 17 4 12"/>' : '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'}</svg>
          <span>${isUnlocked ? (isPreview ? (isKm ? 'បានបើកការមើលសាកល្បង' : 'PREVIEW MODE ACTIVE // ALL DRILLS UNLOCKED') : (isKm ? 'បានដោះសោស្ថាពរ' : 'GRANDMASTER VAULT UNLOCKED')) : (isKm ? 'ជាប់សោ // តម្រូវឱ្យចប់ ២២២ មេរៀនមូលដ្ឋាន' : 'LOCKED // 222 BASE LESSONS PREREQUISITE')}</span>
        </div>
        <div class="lm-vp-count">
          <span class="lm-vp-num">${completed}</span><span class="lm-vp-max"> / 222</span>
          <span class="lm-vp-lbl">${isKm ? 'មេរៀនមូលដ្ឋាន' : 'Core Lessons Completed'}</span>
        </div>
      </div>
      <div class="lm-vp-meter-track" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
        <div class="lm-vp-meter-fill ${isUnlocked ? 'complete' : ''}" style="width: ${pct}%;"></div>
      </div>
      <div class="lm-vp-footer">
        <div class="lm-vp-hint ${isUnlocked ? 'unlocked' : ''}">
          ${isUnlocked
            ? `<svg class="pk-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> <span>${isKm ? 'ដំណាក់កាលទាំង ៣ ត្រូវបានបើកដំណើរការ។ មេរៀននីមួយៗដោះសោបន្តបន្ទាប់គ្នា!' : 'All 3 Grandmaster tiers active. Lessons unlock sequentially as you conquer each drill!'}</span>`
            : `<span>${isKm ? `នៅសល់ ${Math.max(0, 222 - completed)} មេរៀនទៀតដើម្បីដោះសោ ឬបើកការមើលសាកល្បងភ្លាមៗ៖` : `${Math.max(0, 222 - completed)} lessons remaining to unlock naturally, or test immediately via Preview:`}</span>`}
        </div>
        <button type="button" class="lm-vp-preview-toggle-btn" id="lmVaultPreviewToggleBtn">
          <svg class="pk-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          <span>${isPreview ? (isKm ? 'បិទការមើលសាកល្បង' : 'Disable Preview Mode') : (isKm ? 'បើកការមើលសាកល្បង' : 'Preview Grandmaster Vault')}</span>
        </button>
      </div>
    `;

    const toggleBtn = progressCard.querySelector('#lmVaultPreviewToggleBtn');
    if (toggleBtn) {
      toggleBtn.onclick = function() {
        const nextState = !isPreview;
        try { localStorage.setItem('khmerUnlock222Vault', nextState ? '1' : '0'); } catch(e){}
        const settingsSwitch = document.getElementById('previewBonusVaultToggle');
        if (settingsSwitch && typeof setSwitchUI === 'function') setSwitchUI(settingsSwitch, nextState);
        if (typeof renderLessonStrip === 'function') renderLessonStrip();
        renderHubVault();
        if (typeof showToast === 'function') {
          showToast(pkIcon('trophy', 18), nextState ? 'Grandmaster Vault Preview Active' : 'Prerequisite Restored', nextState ? 'All 54 bonus drills unlocked for preview & testing.' : 'Bonus drills require completing all 222 base lessons.');
        }
      };
    }

    const tiers = [
      {
        tierNum: 1,
        titleEn: 'Tier 1: Speed Acceleration & Pro Stamina',
        titleKm: 'ដំណាក់កាលទី ១៖ ល្បឿនលឿន & ការស៊ូទ្រាំកម្រិតខ្ពស់',
        descEn: 'High-cadence rhythmic bursts and stamina endurance drills across 18 specialized lessons (Levels 13/14).',
        descKm: 'លំហាត់បង្កើនចង្វាក់វាយល្បឿនលឿន និងការស៊ូទ្រាំសាច់ដុំម្រាមដៃក្នុង ១៨ មេរៀន (កម្រិត ១៣/១៤)។',
        tracks: [
          { trackId: 'standard', name: 'Khmer Standard', levelId: 'standard-L13' },
          { trackId: 'nida', name: 'Khmer NiDA', levelId: 'nida-L13' },
          { trackId: 'english', name: 'English QWERTY', levelId: 'en-L14' }
        ]
      },
      {
        tierNum: 2,
        titleEn: 'Tier 2: Royal Court Chronicles, Epics & Classical Poetry',
        titleKm: 'ដំណាក់កាលទី ២៖ រាជពង្សាវតារ អក្សរសិល្ប៍បុរាណ & កាព្យ',
        descEn: 'Master intricate Cambodian royal vocabulary, Reamker classical epics, and poetic meter across 18 lessons (Levels 14/15).',
        descKm: 'ហាត់វាយពាក្យរាជសព្ទ វណ្ណកម្មរឿងរាមកេរ្តិ៍ និងកម្រងកាព្យបុរាណក្នុង ១៨ មេរៀន (កម្រិត ១៤/១៥)។',
        tracks: [
          { trackId: 'standard', name: 'Khmer Standard', levelId: 'standard-L14' },
          { trackId: 'nida', name: 'Khmer NiDA', levelId: 'nida-L14' },
          { trackId: 'english', name: 'English QWERTY', levelId: 'en-L15' }
        ]
      },
      {
        tierNum: 3,
        titleEn: 'Tier 3: Diplomatic Treaties, Constitutional Law & Philosophy',
        titleKm: 'ដំណាក់កាលទី ៣៖ សន្ធិសញ្ញាការទូត ច្បាប់រដ្ឋធម្មនុញ្ញ & ទស្សនវិជ្ជា',
        descEn: 'The ultimate professional typing challenge: formal legal statutes, national constitution clauses, and philosophical essays across 18 lessons (Levels 15/16).',
        descKm: 'ការប្រកួតប្រជែងវាយអត្ថបទផ្លូវការកំពូល៖ បទប្បញ្ញត្តិច្បាប់ រដ្ឋធម្មនុញ្ញជាតិ និងទស្សនវិជ្ជាសកលក្នុង ១៨ មេរៀន (កម្រិត ១៥/១៦)។',
        tracks: [
          { trackId: 'standard', name: 'Khmer Standard', levelId: 'standard-L15' },
          { trackId: 'nida', name: 'Khmer NiDA', levelId: 'nida-L15' },
          { trackId: 'english', name: 'English QWERTY', levelId: 'en-L16' }
        ]
      }
    ];

    tiersGrid.innerHTML = '';

    tiers.forEach(tier => {
      const tierCard = document.createElement('article');
      tierCard.className = 'lm-vault-tier-card';

      let lessonsHtml = '';
      tier.tracks.forEach(trackGroup => {
        let list = (typeof LESSON_SETS !== 'undefined' && LESSON_SETS[trackGroup.trackId]) ? LESSON_SETS[trackGroup.trackId] : null;
        if (!list || !list.length) {
          if (trackGroup.trackId === 'standard' && typeof LESSONS_STANDARD !== 'undefined') list = LESSONS_STANDARD;
          else if (trackGroup.trackId === 'nida' && typeof LESSONS_NIDA !== 'undefined') list = LESSONS_NIDA;
          else if (trackGroup.trackId === 'english' && typeof LESSONS_ENGLISH !== 'undefined') list = LESSONS_ENGLISH;
        }

        const tierLessons = Array.isArray(list) ? list.filter(l => l.level === trackGroup.levelId) : [];
        if (tierLessons.length > 0) {
          lessonsHtml += `<div class="lm-vt-track-header"><span class="lm-vt-track-pill ${trackGroup.trackId}">${trackGroup.name} (${tierLessons.length})</span></div><div class="lm-vt-lessons-row-group">`;
          tierLessons.forEach(l => {
            const best = getLessonBest(l.id);
            const locked = isLessonLocked(l.id);
            const statusIcon = best && best.mastered
              ? `<svg class="pk-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5fd694" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`
              : locked
              ? `<svg class="pk-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
              : `<svg class="pk-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffd166" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;

            const title = (isKm && l.titleKm) ? l.titleKm : l.title;
            lessonsHtml += `
              <div class="lm-vt-lesson-row ${locked ? 'locked' : 'unlocked'} ${best && best.mastered ? 'mastered' : ''}">
                <div class="lm-vt-lr-left">
                  <span class="lm-vt-lr-status">${statusIcon}</span>
                  <span class="lm-vt-lr-code">${l.id}</span>
                  <span class="lm-vt-lr-title">${title}</span>
                </div>
                <div class="lm-vt-lr-right">
                  ${best ? `<span class="lm-vt-lr-score">${best.accuracy}%</span>` : ''}
                  <button type="button" class="lm-vt-lr-launch-btn" ${locked ? 'disabled' : ''} onclick="window.launchMasterLesson('${l.id}', '${trackGroup.trackId}')">
                    <svg class="pk-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    <span>${locked ? (isKm ? 'ជាប់សោ' : 'Locked') : (isKm ? 'ចាប់ផ្តើម' : 'Start')}</span>
                  </button>
                </div>
              </div>
            `;
          });
          lessonsHtml += `</div>`;
        }
      });

      tierCard.innerHTML = `
        <div class="lm-vt-header">
          <div class="lm-vt-eyebrow">
            <span class="lm-vt-tier-badge">TIER ${tier.tierNum} // 18 DRILLS</span>
          </div>
          <h4 class="lm-vt-title">${isKm ? tier.titleKm : tier.titleEn}</h4>
          <p class="lm-vt-desc">${isKm ? tier.descKm : tier.descEn}</p>
        </div>
        <div class="lm-vt-body">
          ${lessonsHtml}
        </div>
      `;

      tiersGrid.appendChild(tierCard);
    });
  }
  window.renderHubVault = renderHubVault;

  function showGrandmasterVaultFanfareModal() {
    const modal = document.getElementById('grandmasterFanfareModal');
    if (!modal) return;
    modal.hidden = false;
    const countEl = document.getElementById('gmFanfareBaseCount');
    if (countEl) countEl.textContent = `${countCompletedBaseLessons()} / 222`;

    const enterBtn = document.getElementById('enterGrandmasterVaultBtn');
    const closeBtn = document.getElementById('closeGrandmasterFanfareBtn');
    const customBtn = document.getElementById('gmCreateCustomBtn');

    if (customBtn) {
      customBtn.onclick = function() {
        closeGrandmasterFanfareModal();
        if (typeof PK_CUSTOM_LESSONS !== 'undefined' && typeof PK_CUSTOM_LESSONS.openHub === 'function') {
          PK_CUSTOM_LESSONS.openHub();
        }
      };
    }

    if (enterBtn) {
      enterBtn.onclick = function() {
        closeGrandmasterFanfareModal();
        openLearnMoreHub('vault');
      };
    }
    if (closeBtn) {
      closeBtn.onclick = closeGrandmasterFanfareModal;
    }
    modal.onclick = function(e) {
      if (e.target === modal) closeGrandmasterFanfareModal();
    };

    if (typeof playChime === 'function') playChime();
    if (typeof confettiBurst === 'function') {
      confettiBurst(window.innerWidth / 2, window.innerHeight * 0.35, 45);
    }
  }

  function closeGrandmasterFanfareModal() {
    const modal = document.getElementById('grandmasterFanfareModal');
    if (!modal) return;
    if (typeof window.closeModalAnimated === 'function') {
      window.closeModalAnimated(modal);
    } else {
      modal.hidden = true;
    }
  }

  window.showGrandmasterVaultFanfareModal = showGrandmasterVaultFanfareModal;
  window.closeGrandmasterFanfareModal = closeGrandmasterFanfareModal;

  function openLearnMoreHub(initialTab) {
    const modal = getHubModal();
    if(!modal) return;
    setupHubEvents();

    initialTab = initialTab || 'alphabet';
    modal.hidden = false;

    // Switch tab
    const tabAlphabet = document.getElementById('lmTabBtn-alphabet');
    const tabLessons = document.getElementById('lmTabBtn-lessons');
    const tabMaster = document.getElementById('lmTabBtn-master');
    const tabVault = document.getElementById('lmTabBtn-vault');
    const panelAlphabet = document.getElementById('lmPanel-alphabet');
    const panelLessons = document.getElementById('lmPanel-lessons');
    const panelMaster = document.getElementById('lmPanel-master');
    const panelVault = document.getElementById('lmPanel-vault');

    [tabAlphabet, tabLessons, tabMaster, tabVault].forEach(t => { if(t) t.classList.remove('active'); });
    [panelAlphabet, panelLessons, panelMaster, panelVault].forEach(p => { if(p) p.classList.remove('active'), p.hidden = true; });

    if(initialTab === 'lessons') {
      if(tabLessons) tabLessons.classList.add('active');
      if(panelLessons) panelLessons.classList.add('active'), panelLessons.hidden = false;
      renderHubLessons();
    } else if(initialTab === 'master') {
      if(tabMaster) tabMaster.classList.add('active');
      if(panelMaster) panelMaster.classList.add('active'), panelMaster.hidden = false;
    } else if(initialTab === 'vault') {
      if(tabVault) tabVault.classList.add('active');
      if(panelVault) panelVault.classList.add('active'), panelVault.hidden = false;
      renderHubVault();
    } else {
      if(tabAlphabet) tabAlphabet.classList.add('active');
      if(panelAlphabet) panelAlphabet.classList.add('active'), panelAlphabet.hidden = false;
      renderAlphabetMatrix();
    }

    const closeBtn = document.getElementById('learnMoreHubCloseBtn');
    if(closeBtn) closeBtn.focus();
  }

  function closeLearnMoreHub() {
    const modal = getHubModal();
    if(!modal) return;
    if(typeof window.closeModalAnimated === 'function') {
      window.closeModalAnimated(modal);
    } else {
      modal.hidden = true;
    }
  }

  window.openLearnMoreHub = openLearnMoreHub;
  window.closeLearnMoreHub = closeLearnMoreHub;

  window.launchMasterLesson = function(lessonId, layoutId) {
    if(isLessonLocked(lessonId)) {
      if(typeof showToast === 'function') {
        const isKm = document.documentElement.classList.contains('site-km-mode');
        showToast(
          pkIcon('lock', 16),
          isKm ? 'វគ្គនេះជាប់សោ' : 'Lesson Locked',
          isKm ? 'សូមបញ្ចប់មេរៀនគ្រឹះទាំង ២២២ ជាមុនសិន។' : 'Complete all 222 base lessons to unlock the Grandmaster Vault.'
        );
      }
      return;
    }
    if(layoutId && typeof switchLayout === 'function' && currentLayoutId !== layoutId) {
      switchLayout(layoutId);
    }

    if(typeof renderLessonStrip === 'function') {
      renderLessonStrip();
    }
    closeLearnMoreHub();

    setTimeout(() => {
      if(typeof startLesson === 'function') {
        startLesson(lessonId, true);
      }
      const board = document.getElementById('boardWrap') || document.body;
      if(board && typeof board.focus === 'function') board.focus();
    }, 120);
  };

  // Wire up top button on page load
  if(document.readyState !== 'loading') {
    setupHubEvents();
  } else {
    document.addEventListener('DOMContentLoaded', setupHubEvents);
  }
})();
