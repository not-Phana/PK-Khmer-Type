const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// 1. Standard Curriculum Additions
const stdLevelsPath = path.join(ROOT, 'data/curriculum/standard/levels.json');
const stdLessonsPath = path.join(ROOT, 'data/curriculum/standard/lessons.json');
const stdExercisesPath = path.join(ROOT, 'data/curriculum/standard/exercises.json');

const stdLevels = JSON.parse(fs.readFileSync(stdLevelsPath, 'utf8'));
const stdLessons = JSON.parse(fs.readFileSync(stdLessonsPath, 'utf8'));
const stdExercises = JSON.parse(fs.readFileSync(stdExercisesPath, 'utf8'));

const stdL12 = stdLevels.levels.find(l => l.id === 'standard-L12');
if (!stdL12.lessons.includes('standard-L12-06')) {
  stdL12.lessons.push('standard-L12-06');
}

const existingStdIdx = stdLessons.lessons.findIndex(l => l.id === 'standard-L12-06');
const stdLessonObj = {
  id: 'standard-L12-06',
  level: 'standard-L12',
  order: 6,
  title: 'All Khmer Letters & Comprehensive Literature (អក្សរខ្មែរគ្រប់តួ)',
  titleKm: 'អក្សរខ្មែរគ្រប់តួ និង អក្សរសិល្ប៍ទូទៅ (គ្រប់ព្យញ្ជនៈ ស្រះ និងលេខ)',
  description: 'Master touch typing every Khmer consonant, vowel, independent vowel, coeng subscript, and numeral in classical literature.',
  objective: 'Type all Khmer letters with comprehensive fluency',
  type: 'drill',
  newKeys: [],
  requiredKeys: [],
  fingerFocus: [],
  difficulty: 10,
  accuracyTarget: 90,
  speedTarget: null,
  mistakeTolerance: 5,
  exerciseRefs: [
    'standard-L12-06-E01',
    'standard-L12-06-E02',
    'standard-L12-06-E03',
    'standard-L12-06-E04',
    'standard-L12-06-E05'
  ],
  unlockRequirements: { previousLesson: 'standard-L12-05' },
  timeLimit: 60
};

if (existingStdIdx >= 0) {
  stdLessons.lessons[existingStdIdx] = stdLessonObj;
} else {
  stdLessons.lessons.push(stdLessonObj);
}

stdExercises.exercises['standard-L12-06-E01'] = {
  type: 'drill',
  content: 'ក ខ គ ឃ ង ច ឆ ជ ឈ ញ ដ ឋ ឌ ឍ ណ ត ថ ទ ធ ន ប ផ ព ភ ម យ រ ល វ ស ហ ឡ អ តួ អក្សរ ទាំង ៣៣ តួ ក្នុង ភាសា ខ្មែរ ចងចាំ ច្បាស់។',
  description: 'ព្យញ្ជនៈទាំង ៣៣ តួ ពេញលេញ'
};
stdExercises.exercises['standard-L12-06-E02'] = {
  type: 'drill',
  content: 'តួ ស្រះ ទាំង ២២ តួ ា ិ ី ឹ ឺ ុ ូ ួ ើ ឿ ៀ េ ែ ៃ ោ ៅ ុំ ំ ះ ុះ េះ ោះ រួមទាំង ស្រះពេញតួ ឥ ឦ ឧ ឩ ឪ ឫ ឬ ឭ ឮ ឯ ឰ ឱ ឳ ពេញលេញ គ្រប់ តួ។',
  description: 'ស្រះ និងស្រះពេញតួ គ្រប់តួ'
};
stdExercises.exercises['standard-L12-06-E03'] = {
  type: 'drill',
  content: 'លេខ ខ្មែរ ១០ តួ ០ ១ ២ ៣ ៤ ៥ ៦ ៧ ៨ ៩ រួមផ្សំ ជាមួយ សញ្ញា ខណ្ឌ (។) បរិយោសាន (៕) និង លេខទោ (ៗ) ក្នុង សំណេរ ខ្មែរ។',
  description: 'លេខខ្មែរ និងសញ្ញាវណ្ណយុត្តិ'
};
stdExercises.exercises['standard-L12-06-E04'] = {
  type: 'drill',
  content: 'ពាក្យ ជើង អក្សរ ចម្រុះ កម្ពុជា រដ្ឋបាល អន្តរជាតិ បញ្ញវន្ត សង្គមវិទ្យា វប្បធម៌ សន្តិភាព អក្សរសាស្ត្រ ព្រះរាជាណាចក្រ កម្ពុជា។',
  description: 'ជើងព្យញ្ជនៈចម្រុះ និងពាក្យគន្លឹះ'
};
stdExercises.exercises['standard-L12-06-E05'] = {
  type: 'drill',
  content: 'អក្សរសិល្ប៍ ខ្មែរ មាន ប្រភព សម្បូរបែប ឆ្លុះបញ្ចាំង តម្លៃ សីលធម៌ គុណធម៌ សេចក្ដី ស្រឡាញ់ និង ចំណេះវិជ្ជា សម្រាប់ គ្រប់រូប ក្នុង សង្គម។',
  description: 'អត្ថបទអក្សរសិល្ប៍ស្ទាត់ជំនាញ'
};

fs.writeFileSync(stdLevelsPath, JSON.stringify(stdLevels, null, 2), 'utf8');
fs.writeFileSync(stdLessonsPath, JSON.stringify(stdLessons, null, 2), 'utf8');
fs.writeFileSync(stdExercisesPath, JSON.stringify(stdExercises, null, 2), 'utf8');
console.log('Standard updated: lessons =', stdLessons.lessons.length);

// 2. NiDA Curriculum Additions
const nidaLevelsPath = path.join(ROOT, 'data/curriculum/nida/levels.json');
const nidaLessonsPath = path.join(ROOT, 'data/curriculum/nida/lessons.json');
const nidaExercisesPath = path.join(ROOT, 'data/curriculum/nida/exercises.json');

const nidaLevels = JSON.parse(fs.readFileSync(nidaLevelsPath, 'utf8'));
const nidaLessons = JSON.parse(fs.readFileSync(nidaLessonsPath, 'utf8'));
const nidaExercises = JSON.parse(fs.readFileSync(nidaExercisesPath, 'utf8'));

const nidaL12 = nidaLevels.levels.find(l => l.id === 'nida-L12');
if (!nidaL12.lessons.includes('nida-L12-06')) {
  nidaL12.lessons.push('nida-L12-06');
}

const existingNidaIdx = nidaLessons.lessons.findIndex(l => l.id === 'nida-L12-06');
const nidaLessonObj = {
  id: 'nida-L12-06',
  level: 'nida-L12',
  order: 6,
  title: 'All Khmer Letters & Comprehensive Literature (អក្សរខ្មែរគ្រប់តួ)',
  titleKm: 'អក្សរខ្មែរគ្រប់តួ និង អក្សរសិល្ប៍ទូទៅ (គ្រប់ព្យញ្ជនៈ ស្រៈ ឲ ៊ និងលេខ)',
  description: 'Master touch typing every Khmer consonant, vowel, independent vowel including ឲ, shifter ៊, coeng subscript, and numeral.',
  objective: 'Type all Khmer letters with comprehensive fluency in NiDA',
  type: 'drill',
  newKeys: [],
  requiredKeys: [],
  fingerFocus: [],
  difficulty: 10,
  accuracyTarget: 90,
  speedTarget: null,
  mistakeTolerance: 5,
  exerciseRefs: [
    'nida-L12-06-E01',
    'nida-L12-06-E02',
    'nida-L12-06-E03',
    'nida-L12-06-E04',
    'nida-L12-06-E05'
  ],
  unlockRequirements: { previousLesson: 'nida-L12-05' },
  timeLimit: 60
};

if (existingNidaIdx >= 0) {
  nidaLessons.lessons[existingNidaIdx] = nidaLessonObj;
} else {
  nidaLessons.lessons.push(nidaLessonObj);
}

nidaExercises.exercises['nida-L12-06-E01'] = {
  type: 'drill',
  content: 'ក ខ គ ឃ ង ច ឆ ជ ឈ ញ ដ ឋ ឌ ឍ ណ ត ថ ទ ធ ន ប ផ ព ភ ម យ រ ល វ ស ហ ឡ អ តួ ព្យញ្ជនៈ ៣៣ តួ រួមទាំង តួ ឲ និង ត្រីស័ព្ទ ៊ ចងចាំ ឱ្យ ច្បាស់។',
  description: 'ព្យញ្ជនៈ ៣៣ តួ រួមទាំង ឲ និង ៊ ក្នុងប្លង់នីដា'
};
nidaExercises.exercises['nida-L12-06-E02'] = {
  type: 'drill',
  content: 'ស្រៈនិស្ស័យ ២២ តួ ា ិ ី ឹ ឺ ុ ូ ួ ើ ឿ ៀ េ ែ ៃ ោ ៅ ុំ ំ ះ ុះ េះ ោះ រួមទាំង ស្រៈពេញតួ ឥ ឦ ឧ ឩ ឪ ឫ ឬ ឭ ឮ ឯ ឰ ឱ ឳ ឲ គ្រប់ តួ។',
  description: 'ស្រៈនិស្ស័យ និងស្រៈពេញតួ គ្រប់តួ'
};
nidaExercises.exercises['nida-L12-06-E03'] = {
  type: 'drill',
  content: 'លេខ ខ្មែរ ១០ តួ ០ ១ ២ ៣ ៤ ៥ ៦ ៧ ៨ ៩ រួមផ្សំ ជាមួយ សញ្ញា ខណ្ឌ (។) បរិយោសាន (៕) និង លេខទោ (ៗ) លើ ក្តារចុច នីដា។',
  description: 'លេខខ្មែរ និងសញ្ញាវណ្ណយុត្តិ'
};
nidaExercises.exercises['nida-L12-06-E04'] = {
  type: 'drill',
  content: 'ពាក្យ ជើង ព្យញ្ជនៈ ចម្រុះ កម្ពុជា រដ្ឋបាល អន្តរជាតិ បញ្ញវន្ត សង្គមវិទ្យា វប្បធម៌ សន្តិភាព អក្សរសាស្ត្រ នីដា ខ្មែរ។',
  description: 'ជើងព្យញ្ជនៈចម្រុះ និងពាក្យគន្លឹះ'
};
nidaExercises.exercises['nida-L12-06-E05'] = {
  type: 'drill',
  content: 'អក្សរសិល្ប៍ ខ្មែរ មាន ប្រភព សម្បូរបែប ឆ្លុះបញ្ចាំង តម្លៃ សីលធម៌ គុណធម៌ សេចក្ដី ស្រឡាញ់ និង ចំណេះវិជ្ជា សម្រាប់ គ្រប់រូប ក្នុង សង្គម។',
  description: 'អត្ថបទអក្សរសិល្ប៍ស្ទាត់ជំនាញ'
};

fs.writeFileSync(nidaLevelsPath, JSON.stringify(nidaLevels, null, 2), 'utf8');
fs.writeFileSync(nidaLessonsPath, JSON.stringify(nidaLessons, null, 2), 'utf8');
fs.writeFileSync(nidaExercisesPath, JSON.stringify(nidaExercises, null, 2), 'utf8');
console.log('NiDA updated: lessons =', nidaLessons.lessons.length);

// 3. English Curriculum Additions
const enLevelsPath = path.join(ROOT, 'data/curriculum/english/levels.json');
const enLessonsPath = path.join(ROOT, 'data/curriculum/english/lessons.json');
const enExercisesPath = path.join(ROOT, 'data/curriculum/english/exercises.json');

const enLevels = JSON.parse(fs.readFileSync(enLevelsPath, 'utf8'));
const enLessons = JSON.parse(fs.readFileSync(enLessonsPath, 'utf8'));
const enExercises = JSON.parse(fs.readFileSync(enExercisesPath, 'utf8'));

const enL13 = enLevels.levels.find(l => l.id === 'en-L13');
if (!enL13.lessons.includes('en-L13-05')) enL13.lessons.push('en-L13-05');
if (!enL13.lessons.includes('en-L13-06')) enL13.lessons.push('en-L13-06');

const existingEn5Idx = enLessons.lessons.findIndex(l => l.id === 'en-L13-05');
const en5Obj = {
  id: 'en-L13-05',
  level: 'en-L13',
  order: 5,
  title: 'All-Letter Pangram Mastery (A-Z Every Letter)',
  titleKm: 'ស្ទាត់ជំនាញប្រយោគគ្រប់តួអក្សរ A-Z (Pangrams)',
  description: 'Type complete alphabet pangrams that exercise every single letter from A through Z, numerals, and punctuation in every exercise.',
  objective: 'Master all 26 English letters in rapid-flow pangrams',
  type: 'drill',
  newKeys: [],
  requiredKeys: [],
  fingerFocus: [],
  difficulty: 10,
  accuracyTarget: 90,
  speedTarget: null,
  mistakeTolerance: 5,
  exerciseRefs: [
    'en-L13-05-E01',
    'en-L13-05-E02',
    'en-L13-05-E03',
    'en-L13-05-E04',
    'en-L13-05-E05'
  ],
  unlockRequirements: { previousLesson: 'en-L13-04' },
  timeLimit: 60
};
if (existingEn5Idx >= 0) enLessons.lessons[existingEn5Idx] = en5Obj;
else enLessons.lessons.push(en5Obj);

const existingEn6Idx = enLessons.lessons.findIndex(l => l.id === 'en-L13-06');
const en6Obj = {
  id: 'en-L13-06',
  level: 'en-L13',
  order: 6,
  title: 'Grand Literature & Philosophical Texts (Learn More Mastery)',
  titleKm: 'អក្សរសិល្ប៍ទស្សនវិជ្ជា និងលំហាត់កម្រិតខ្ពស់',
  description: 'Extended literature and philosophical excerpts ensuring full-spectrum keyboard mastery across vocabulary, punctuation, and rhythm.',
  objective: 'Achieve complete keyboard fluency on long-form literature',
  type: 'drill',
  newKeys: [],
  requiredKeys: [],
  fingerFocus: [],
  difficulty: 10,
  accuracyTarget: 90,
  speedTarget: null,
  mistakeTolerance: 5,
  exerciseRefs: [
    'en-L13-06-E01',
    'en-L13-06-E02',
    'en-L13-06-E03',
    'en-L13-06-E04',
    'en-L13-06-E05'
  ],
  unlockRequirements: { previousLesson: 'en-L13-05' },
  timeLimit: 60
};
if (existingEn6Idx >= 0) enLessons.lessons[existingEn6Idx] = en6Obj;
else enLessons.lessons.push(en6Obj);

enExercises.exercises['en-L13-05-E01'] = {
  type: 'drill',
  content: 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen jugs. Sphinx of black quartz, judge my vow.',
  description: 'Classic alphabet pangrams round 1'
};
enExercises.exercises['en-L13-05-E02'] = {
  type: 'drill',
  content: 'How vexingly quick daft zebras jump! Bright vixens jump; dozy fowl quack. Jackdaws love my big sphinx of quartz.',
  description: 'Classic alphabet pangrams round 2'
};
enExercises.exercises['en-L13-05-E03'] = {
  type: 'drill',
  content: 'The five boxing wizards jump quickly. Waltz, bad nymph, for quick jigs vex! Glib jocks quiz nymph to vex dwarf.',
  description: 'Classic alphabet pangrams round 3'
};
enExercises.exercises['en-L13-05-E04'] = {
  type: 'drill',
  content: 'Cozy lummox gives smart squid who asks for job pen. Quick zephyrs blow, vexing Jim. Few quips mock the lazy jury.',
  description: 'Classic alphabet pangrams round 4'
};
enExercises.exercises['en-L13-05-E05'] = {
  type: 'drill',
  content: 'All 26 letters (A to Z) with numbers: The 5 quick brown foxes jumped over 12 lazy dogs at 3:45 PM on July 28!',
  description: 'Pangrams with numbers and punctuation'
};

enExercises.exercises['en-L13-06-E01'] = {
  type: 'drill',
  content: 'Knowledge is the foundation of progress. To master the keyboard is to unlock seamless expression of ideas and thoughts.',
  description: 'Philosophy of learning and expression'
};
enExercises.exercises['en-L13-06-E02'] = {
  type: 'drill',
  content: 'In the quiet expanse of Angkor temples, stone carvings whisper ancient tales of devotion, architecture, and harmony.',
  description: 'Cambodian cultural reflections'
};
enExercises.exercises['en-L13-06-E03'] = {
  type: 'drill',
  content: 'True mastery is not the absence of mistakes, but the calm ability to maintain accurate cadence and rhythmic focus.',
  description: 'Mindset and cadence in touch typing'
};
enExercises.exercises['en-L13-06-E04'] = {
  type: 'drill',
  content: 'With 222 lessons, every letter, symbol, and digit has been practiced. You now possess lifetime touch typing fluency!',
  description: 'Curriculum celebration and milestone'
};
enExercises.exercises['en-L13-06-E05'] = {
  type: 'drill',
  content: 'The art of typing is like music: each keystroke a distinct note, each sentence a melody flowing freely with speed.',
  description: 'Rhythmic flow and typing artistry'
};

fs.writeFileSync(enLevelsPath, JSON.stringify(enLevels, null, 2), 'utf8');
fs.writeFileSync(enLessonsPath, JSON.stringify(enLessons, null, 2), 'utf8');
fs.writeFileSync(enExercisesPath, JSON.stringify(enExercises, null, 2), 'utf8');
console.log('English updated: lessons =', enLessons.lessons.length);

const total = stdLessons.lessons.length + nidaLessons.lessons.length + enLessons.lessons.length;
console.log('GRAND TOTAL LESSONS ACROSS ALL 3 CURRICULA:', total);
