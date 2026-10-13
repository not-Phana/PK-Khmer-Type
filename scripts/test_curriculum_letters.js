const fs = require('fs');
const path = require('path');

global.window = { addEventListener: () => {} };
global.document = { activeElement: null, getElementById: () => null, addEventListener: () => {} };
eval(fs.readFileSync(path.join(__dirname, '../js/typing.js'), 'utf8'));

const kb = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/keyboard.json'), 'utf8'));

const KHMER_CONSONANTS = ['ក', 'ខ', 'គ', 'ឃ', 'ង', 'ច', 'ឆ', 'ជ', 'ឈ', 'ញ', 'ដ', 'ឋ', 'ឌ', 'ឍ', 'ណ', 'ត', 'ថ', 'ទ', 'ធ', 'ន', 'ប', 'ផ', 'ព', 'ភ', 'ម', 'យ', 'រ', 'ល', 'វ', 'ស', 'ហ', 'ឡ', 'អ'];
const KHMER_DEPENDENT_VOWELS = ['ា', 'ិ', 'ី', 'ឹ', 'ឺ', 'ុ', 'ូ', 'ួ', 'ើ', 'ឿ', 'ៀ', 'េ', 'ែ', 'ៃ', 'ោ', 'ៅ', 'ុំ', 'ំ', 'ះ', 'ុះ', 'េះ', 'ោះ'];
const KHMER_INDEPENDENT_VOWELS = ['ឥ', 'ឦ', 'ឧ', 'ឩ', 'ឪ', 'ឫ', 'ឬ', 'ឭ', 'ឮ', 'ឯ', 'ឰ', 'ឱ', 'ឳ', 'ឲ'];
const KHMER_DIACRITICS = ['់', '៉', '៊', '៍', '័', '៏', '៌', '៎', 'ៗ', '៖', '។', '៕', '៛'];
const KHMER_NUMBERS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

function getKeyboardCharacters(layoutId) {
  const layout = kb.LAYOUTS[layoutId];
  if (!layout) return { base: [], shift: [], altgr: [], all: [] };
  const base = new Set();
  const shift = new Set();
  const altgr = new Set();
  const all = new Set();

  layout.rows.forEach(row => {
    row.forEach(k => {
      if (k.kind === 'glyph') {
        if (k.base) { base.add(k.base); all.add(k.base); }
        if (k.shift) { shift.add(k.shift); all.add(k.shift); }
        if (k.altgr) { altgr.add(k.altgr); all.add(k.altgr); }
      }
    });
  });

  return {
    base: Array.from(base),
    shift: Array.from(shift),
    altgr: Array.from(altgr),
    all: Array.from(all)
  };
}

const layouts = ['standard', 'nida', 'english'];

console.log('======================================================================');
console.log('COMPREHENSIVE AUDIT: EVERY LESSON & EVERY LETTER / KEY INCLUSION');
console.log('======================================================================\n');

let totalErrors = 0;

layouts.forEach(layoutId => {
  console.log(`\n--------------------------------------------------`);
  console.log(`ANALYZING [${layoutId.toUpperCase()}] CURRICULUM`);
  console.log(`--------------------------------------------------`);

  const levelsPath = path.join(__dirname, `../data/curriculum/${layoutId}/levels.json`);
  const lessonsPath = path.join(__dirname, `../data/curriculum/${layoutId}/lessons.json`);
  const exercisesPath = path.join(__dirname, `../data/curriculum/${layoutId}/exercises.json`);

  const levels = JSON.parse(fs.readFileSync(levelsPath, 'utf8')).levels;
  const lessons = JSON.parse(fs.readFileSync(lessonsPath, 'utf8')).lessons;
  const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf8')).exercises;

  const kbChars = getKeyboardCharacters(layoutId);
  console.log(`Keyboard glyphs defined in layout: ${kbChars.all.length} (Base: ${kbChars.base.length}, Shift: ${kbChars.shift.length}, AltGr: ${kbChars.altgr.length})`);

  const charsPracticedInCurriculum = new Set();
  const charFirstSeenLesson = new Map();
  let emptyLessons = 0;
  let missingNewKeysInLesson = 0;

  lessons.forEach((l, lIdx) => {
    const refs = l.exerciseRefs || l.exercises || [];
    let lessonText = '';
    refs.forEach(eid => {
      const ex = exercises[eid];
      if (ex && ex.content) {
        lessonText += (Array.isArray(ex.content) ? ex.content.join(' ') : ex.content) + ' ';
      }
    });

    const units = splitIntoTypingUnits(lessonText, layoutId);
    if (units.length === 0) {
      console.error(`  [ERROR] Lesson ${l.id} (${l.title}) has 0 typing units (EMPTY)!`);
      emptyLessons++;
      totalErrors++;
    }

    units.forEach(u => {
      if (!charsPracticedInCurriculum.has(u)) {
        charsPracticedInCurriculum.add(u);
        charFirstSeenLesson.set(u, l.id);
      }
    });

    // Check if declared newKeys are actually practiced in this lesson
    if (l.newKeys && Array.isArray(l.newKeys)) {
      l.newKeys.forEach(k => {
        const expectedChar = k.char;
        if (expectedChar && !units.includes(expectedChar)) {
          console.warn(`  [WARN] Lesson ${l.id} introduces '${expectedChar}' (${k.keyId}, layer: ${k.layer}) but '${expectedChar}' is NOT present in its exercise units!`);
          missingNewKeysInLesson++;
        }
      });
    }
  });

  console.log(`Total lessons: ${lessons.length}`);
  console.log(`Total unique characters practiced across all lessons: ${charsPracticedInCurriculum.size}`);
  console.log(`Empty lessons: ${emptyLessons}`);
  console.log(`Introduced keys missing from their own lesson exercises: ${missingNewKeysInLesson}`);

  // Linguistic Checks
  if (layoutId === 'english') {
    const lower = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const digits = '0123456789'.split('');
    const symbols = '!@#$%^&*()_+-=[]{}|;:\'",.<>/?`~\\'.split('');

    const missingLower = lower.filter(c => !charsPracticedInCurriculum.has(c));
    const missingUpper = upper.filter(c => !charsPracticedInCurriculum.has(c));
    const missingDigits = digits.filter(c => !charsPracticedInCurriculum.has(c));
    const missingSymbols = symbols.filter(c => !charsPracticedInCurriculum.has(c));

    console.log(`\n  English Alphabet & Character Coverage:`);
    console.log(`    - Lowercase a-z (26): ${26 - missingLower.length}/26 included ${missingLower.length > 0 ? `(Missing: ${missingLower.join(' ')})` : '[ALL INCLUDED]'}`);
    console.log(`    - Uppercase A-Z (26): ${26 - missingUpper.length}/26 included ${missingUpper.length > 0 ? `(Missing: ${missingUpper.join(' ')})` : '[ALL INCLUDED]'}`);
    console.log(`    - Digits 0-9 (10):    ${10 - missingDigits.length}/10 included ${missingDigits.length > 0 ? `(Missing: ${missingDigits.join(' ')})` : '[ALL INCLUDED]'}`);
    console.log(`    - Symbols (32):       ${symbols.length - missingSymbols.length}/${symbols.length} included ${missingSymbols.length > 0 ? `(Missing: ${missingSymbols.join(' ')})` : '[ALL INCLUDED]'}`);

    if (missingLower.length > 0 || missingUpper.length > 0 || missingDigits.length > 0) {
      totalErrors++;
    }
  } else {
    // Khmer checks
    const missingConsonants = KHMER_CONSONANTS.filter(c => !charsPracticedInCurriculum.has(c));
    const missingVowels = KHMER_DEPENDENT_VOWELS.filter(c => !charsPracticedInCurriculum.has(c));
    const missingIndep = KHMER_INDEPENDENT_VOWELS.filter(c => !charsPracticedInCurriculum.has(c));
    const missingDiacritics = KHMER_DIACRITICS.filter(c => !charsPracticedInCurriculum.has(c));
    const missingNumbers = KHMER_NUMBERS.filter(c => !charsPracticedInCurriculum.has(c));
    const hasCoeng = charsPracticedInCurriculum.has('្');

    console.log(`\n  Khmer Script Category Coverage:`);
    console.log(`    - Consonants (33):           ${33 - missingConsonants.length}/33 included ${missingConsonants.length > 0 ? `(Missing: ${missingConsonants.join(' ')})` : '[ALL INCLUDED]'}`);
    console.log(`    - Dependent Vowels (22):     ${KHMER_DEPENDENT_VOWELS.length - missingVowels.length}/${KHMER_DEPENDENT_VOWELS.length} included ${missingVowels.length > 0 ? `(Missing: ${missingVowels.join(' ')})` : '[ALL INCLUDED]'}`);
    console.log(`    - Independent Vowels (14):   ${KHMER_INDEPENDENT_VOWELS.length - missingIndep.length}/${KHMER_INDEPENDENT_VOWELS.length} included ${missingIndep.length > 0 ? `(Missing: ${missingIndep.join(' ')})` : '[ALL INCLUDED]'}`);
    console.log(`    - Diacritics & Signs (13):   ${KHMER_DIACRITICS.length - missingDiacritics.length}/${KHMER_DIACRITICS.length} included ${missingDiacritics.length > 0 ? `(Missing: ${missingDiacritics.join(' ')})` : '[ALL INCLUDED]'}`);
    console.log(`    - Khmer Numerals ០-៩ (10):   ${10 - missingNumbers.length}/10 included ${missingNumbers.length > 0 ? `(Missing: ${missingNumbers.join(' ')})` : '[ALL INCLUDED]'}`);
    console.log(`    - Subscript Coeng ្:          ${hasCoeng ? '[INCLUDED]' : '[MISSING]'}`);

    // Check keyboard glyphs vs curriculum
    const missingKbGlyphs = kbChars.all.filter(c => !charsPracticedInCurriculum.has(c) && c !== ' ' && c !== '◎');
    console.log(`    - Uncovered Keyboard Layout Glyphs: ${missingKbGlyphs.length === 0 ? 'None [100% of layout glyphs covered]' : missingKbGlyphs.join(' ')}`);

    if (missingConsonants.length > 0 || missingVowels.length > 0 || missingNumbers.length > 0 || !hasCoeng) {
      totalErrors++;
    }
  }
});

console.log(`\n======================================================================`);
if (totalErrors === 0) {
  console.log(`AUDIT PASSED: All lessons are verified, and all required letters are fully included!`);
} else {
  console.log(`AUDIT FAILED: ${totalErrors} issue(s) detected.`);
}
console.log(`======================================================================\n`);

