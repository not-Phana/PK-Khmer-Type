const fs = require('fs');
const path = require('path');

const { KHMER_BONUS_EXERCISES, ENGLISH_BONUS_EXERCISES } = require('../scratch/bonus_exercises_data.js');

const KHMER_LESSON_TITLES = [
  {
    order: 1,
    title: "Angkor Inscription & Royal Heritage",
    titleKm: "សិលាចារឹកអង្គរ និងកេរដំណែលបុរាណ",
    desc: "Master classical epigraphy passages recounting the construction and spiritual dedication of ancient Khmer temples.",
    obj: "Type ancient stone inscriptions with speed and precision"
  },
  {
    order: 2,
    title: "Reamker Epic Poetry",
    titleKm: "រឿងរាមកេរ្តិ៍ខ្មែរ - ឈុតមហិទ្ធិឫទ្ធិ",
    desc: "Type soaring poetic verses from the classical Khmer Ramayana depicting heroism, loyalty, and justice.",
    obj: "Type classical epic poetry with heroic fluency"
  },
  {
    order: 3,
    title: "Tum Teav Classical Romance",
    titleKm: "ទុំទាវ - កំណាព្យស្នេហាបុរាណ",
    desc: "Type famous 7-syllable verses from Venerable Som's Tum Teav, the pinnacle of 19th-century Khmer romance literature.",
    obj: "Master classical seven-syllable poetic meters"
  },
  {
    order: 4,
    title: "Ancestral Codes: Chbap Srey & Pros",
    titleKm: "ច្បាប់ស្រី និងច្បាប់ប្រុស - ពាក្យទូន្មានដូនតា",
    desc: "Type ancient moral instructions on etiquette, filial piety, respect for teachers, and noble conduct.",
    obj: "Type ancestral didactic literature with complete accuracy"
  },
  {
    order: 5,
    title: "Proverbs & Deep Wisdom",
    titleKm: "សុភាសិត និងទស្សនវិជ្ជាខ្មែរបុរាណ",
    desc: "Master the typing of profound Khmer proverbs containing rich metaphors, internal rhymes, and diacritical precision.",
    obj: "Achieve deep typographic rhythm on Khmer proverbs"
  },
  {
    order: 6,
    title: "Grandmaster Scribe Sprint",
    titleKm: "មហាអត្ថបទកំពូល - សម្ភោធជ័យជំនះ",
    desc: "The pinnacle test of Khmer touch-typing: full-length classical prose exercising all 33 consonants, vowels, and coeng subscripts.",
    obj: "Claim the title of Grandmaster Scribe with flawless stamina"
  }
];

const ENGLISH_LESSON_TITLES = [
  {
    order: 1,
    title: "The Odyssey & Ancient Homeric Epics",
    titleKm: "អក្សរសិល្ប៍ក្រិកបុរាណ — The Odyssey",
    desc: "Type timeless verses from Homer's Odyssey recounting courage, resourcefulness, and the voyage home.",
    obj: "Type epic classical poetry with rhythm and poise"
  },
  {
    order: 2,
    title: "Shakespearean Soliloquies & Drama",
    titleKm: "ល្ខោនបុរាណសេកស្ពៀ — Soliloquies",
    desc: "Type dramatic soliloquies from Hamlet, Macbeth, and As You Like It with exact typographic nuance.",
    obj: "Master theatrical syntax, archaic punctuation, and iambic verse"
  },
  {
    order: 3,
    title: "Philosophical Meditations of Marcus Aurelius",
    titleKm: "ទស្សនវិជ្ជាស្តូអ៊ីក — Marcus Aurelius",
    desc: "Reflect and type the stoic aphorisms of Roman Emperor Marcus Aurelius on reason, virtue, and peace of mind.",
    obj: "Type profound philosophical reflections fluidly"
  },
  {
    order: 4,
    title: "Universal Declaration of Human Rights",
    titleKm: "សេចក្តីប្រកាសជាសកលស្តីពីសិទ្ធិមនុស្ស",
    desc: "Type the monumental 1948 charter enshrining human dignity, liberty, and equal rights worldwide.",
    obj: "Master formal legal and human rights prose"
  },
  {
    order: 5,
    title: "Scientific Discoveries & Cosmos",
    titleKm: "វិទ្យាសាស្ត្រ និងចក្រវាល — Carl Sagan",
    desc: "Type Carl Sagan's poetic reflections on planetary stewardship, cosmic history, and the wonder of astronomy.",
    obj: "Type advanced scientific and lyrical prose at high speed"
  },
  {
    order: 6,
    title: "Grandmaster Scribe Ultimate Marathon",
    titleKm: "មហាអត្ថបទកំពូលស្មៀនអង់គ្លេស — Marathon",
    desc: "The ultimate endurance sprint for touch-typing masters: complex grammar, varied vocabulary, and maximum velocity.",
    obj: "Complete the Grandmaster English curriculum with flawless mastery"
  }
];

function updateCurriculum(layoutId) {
  const dir = path.join(__dirname, `../data/curriculum/${layoutId}`);
  const levelsFile = path.join(dir, 'levels.json');
  const lessonsFile = path.join(dir, 'lessons.json');
  const exercisesFile = path.join(dir, 'exercises.json');

  const levelsData = JSON.parse(fs.readFileSync(levelsFile, 'utf8'));
  const lessonsData = JSON.parse(fs.readFileSync(lessonsFile, 'utf8'));
  const exercisesData = JSON.parse(fs.readFileSync(exercisesFile, 'utf8'));

  const isKhmer = layoutId === 'standard' || layoutId === 'nida';
  const bonusLevelId = isKhmer ? `${layoutId}-L13` : 'en-L14';
  const prevLevelId = isKhmer ? `${layoutId}-L12` : 'en-L13';
  const lastBaseLessonId = isKhmer ? `${layoutId}-L12-06` : 'en-L13-06';
  const levelNum = isKhmer ? 13 : 14;

  const lessonTitles = isKhmer ? KHMER_LESSON_TITLES : ENGLISH_LESSON_TITLES;
  const bonusExDict = isKhmer ? KHMER_BONUS_EXERCISES : ENGLISH_BONUS_EXERCISES;

  // 1. Add exercises
  lessonTitles.forEach((lt, lIdx) => {
    const lessonNum = String(lt.order).padStart(2, '0');
    const lessonId = isKhmer ? `${layoutId}-L13-${lessonNum}` : `en-L14-${lessonNum}`;

    for (let eIdx = 1; eIdx <= 5; eIdx++) {
      const globalExNum = lIdx * 5 + eIdx;
      const exKeyInDict = 'E' + String(globalExNum).padStart(2, '0');
      const exId = `${lessonId}-E0${eIdx}`;
      const src = bonusExDict[exKeyInDict];
      if (src) {
        exercisesData.exercises[exId] = {
          type: src.type,
          content: src.content,
          description: src.description
        };
      }
    }
  });

  // 2. Add bonus lessons to lessons.json
  const bonusLessonIds = [];
  lessonTitles.forEach((lt, lIdx) => {
    const lessonNum = String(lt.order).padStart(2, '0');
    const lessonId = isKhmer ? `${layoutId}-L13-${lessonNum}` : `en-L14-${lessonNum}`;
    bonusLessonIds.push(lessonId);

    // Remove existing if already present (for idempotency)
    const existingIdx = lessonsData.lessons.findIndex(l => l.id === lessonId);
    if (existingIdx !== -1) {
      lessonsData.lessons.splice(existingIdx, 1);
    }

    const prevLessonId = lIdx === 0 ? lastBaseLessonId : (isKhmer ? `${layoutId}-L13-${String(lIdx).padStart(2, '0')}` : `en-L14-${String(lIdx).padStart(2, '0')}`);

    const exerciseRefs = [];
    for (let eIdx = 1; eIdx <= 5; eIdx++) {
      exerciseRefs.push(`${lessonId}-E0${eIdx}`);
    }

    const lessonObj = {
      id: lessonId,
      level: bonusLevelId,
      order: lt.order,
      isBonus: true,
      bonusIndex: lIdx,
      title: lt.title,
      titleKm: lt.titleKm,
      description: lt.desc,
      objective: lt.obj,
      type: "drill",
      newKeys: [],
      requiredKeys: [],
      fingerFocus: [],
      difficulty: 10,
      accuracyTarget: 92,
      speedTarget: null,
      mistakeTolerance: 4,
      exerciseRefs: exerciseRefs,
      unlockRequirements: {
        previousLesson: prevLessonId,
        requiresAll222: lIdx === 0
      },
      timeLimit: null
    };

    lessonsData.lessons.push(lessonObj);
  });

  // 3. Add Level to levels.json
  const existingLevelIdx = levelsData.levels.findIndex(l => l.id === bonusLevelId);
  if (existingLevelIdx !== -1) {
    levelsData.levels.splice(existingLevelIdx, 1);
  }

  const levelObj = {
    id: bonusLevelId,
    levelNumber: levelNum,
    isBonus: true,
    title: "Grandmaster Bonus Vault",
    titleKm: "កម្រិតពិសេស - បណ្ដុំអត្ថបទកំពូល",
    description: "Prestigious bonus challenges unlocked only after completing all 222 base lessons.",
    objective: isKhmer ? "Achieve ultimate mastery with ancient epics and classical literature" : "Type classical literature and philosophical masterpieces",
    lessons: bonusLessonIds,
    unlockRequirements: {
      previousLevel: prevLevelId,
      requiresAll222: true
    },
    completionRequirements: {
      allLessonsCompleted: true,
      minLevelAccuracy: 92
    }
  };

  levelsData.levels.push(levelObj);

  // Write back formatted JSON
  fs.writeFileSync(levelsFile, JSON.stringify(levelsData, null, 2) + '\n', 'utf8');
  fs.writeFileSync(lessonsFile, JSON.stringify(lessonsData, null, 2) + '\n', 'utf8');
  fs.writeFileSync(exercisesFile, JSON.stringify(exercisesData, null, 2) + '\n', 'utf8');

  console.log(`Updated ${layoutId}: added ${bonusLessonIds.length} bonus lessons to ${bonusLevelId}`);
}

['standard', 'nida', 'english'].forEach(updateCurriculum);
console.log('\nAll 3 curricula updated with Grandmaster Bonus Vaults!');
