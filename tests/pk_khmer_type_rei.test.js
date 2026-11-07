const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');

test('Rei Tutor: File Generation and Static Structure', () => {
  assert.ok(fs.existsSync(path.join(rootDir, 'rei/index.html')), 'rei/index.html must exist');
  assert.ok(fs.existsSync(path.join(rootDir, 'rei.html')), 'rei.html must exist');
  
  const reiContent = fs.readFileSync(path.join(rootDir, 'rei/index.html'), 'utf8');
  assert.ok(reiContent.includes('PK Khmer Type Rei'), 'Title must declare PK Khmer Type Rei');
  assert.ok(reiContent.includes('id="reiWallpaperBtn"'), 'Must include Wallpaper Studio launcher button');
  assert.ok(reiContent.includes('id="reiThemeToggleBtn"'), 'Must include Rei Theme Toggle button');
  assert.ok(reiContent.includes('id="reiStripStagesBar"'), 'Must include Easy Stage Navigation Bar');
  assert.ok(reiContent.includes('id="modalUploadWallpaperBtn"'), 'Must include Direct Custom Wallpaper Upload button');
  assert.ok(reiContent.includes('id="wallpaperModalResetBtn"'), 'Must include Wallpaper Reset button');
});

test('Rei Tutor: Strict Lesson Locking (No premature unlocks)', () => {
  const storage = {};
  const mockLocalStorage = {
    getItem: (k) => storage[k] || null,
    setItem: (k, v) => { storage[k] = String(v); },
    removeItem: (k) => { delete storage[k]; },
    clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
  };

  const kbData = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/keyboard.json'), 'utf8'));

  function createMockElement(id) {
    return {
      id: id || '',
      tagName: 'DIV',
      addEventListener: () => {},
      removeEventListener: () => {},
      appendChild: () => {},
      setAttribute: () => {},
      removeAttribute: () => {},
      getAttribute: () => null,
      focus: () => {},
      blur: () => {},
      style: {},
      classList: { contains: () => false, add: () => {}, remove: () => {}, toggle: () => {} },
      querySelector: () => null,
      querySelectorAll: () => []
    };
  }

  const sandbox = {
    window: {
      addEventListener: () => {},
      removeEventListener: () => {}
    },
    global: {},
    currentLayoutId: 'standard',
    pkIcon: () => '',
    document: {
      addEventListener: () => {},
      removeEventListener: () => {},
      createDocumentFragment: () => createMockElement(),
      documentElement: { classList: { contains: () => false, add: () => {}, remove: () => {} } },
      getElementById: (id) => createMockElement(id),
      querySelector: () => null,
      querySelectorAll: () => [],
      createElement: () => createMockElement()
    },
    localStorage: mockLocalStorage,
    console: console,
    ROW1: kbData.LAYOUTS.standard.rows[0],
    ROW2: kbData.LAYOUTS.standard.rows[1],
    ROW3: kbData.LAYOUTS.standard.rows[2],
    ROW4: kbData.LAYOUTS.standard.rows[3],
    ROW5: kbData.LAYOUTS.standard.rows[4] || [],
    ROW1_NIDA: kbData.LAYOUTS.nida.rows[0],
    ROW2_NIDA: kbData.LAYOUTS.nida.rows[1],
    ROW3_NIDA: kbData.LAYOUTS.nida.rows[2],
    ROW4_NIDA: kbData.LAYOUTS.nida.rows[3],
    ROW5_NIDA: kbData.LAYOUTS.nida.rows[4] || [],
    ROW1_EN: (kbData.LAYOUTS.english && kbData.LAYOUTS.english.rows[0]) || [],
    ROW2_EN: (kbData.LAYOUTS.english && kbData.LAYOUTS.english.rows[1]) || [],
    ROW3_EN: (kbData.LAYOUTS.english && kbData.LAYOUTS.english.rows[2]) || [],
    ROW4_EN: (kbData.LAYOUTS.english && kbData.LAYOUTS.english.rows[3]) || [],
    ROW5_EN: (kbData.LAYOUTS.english && kbData.LAYOUTS.english.rows[4]) || []
  };
  sandbox.window.document = sandbox.document;

  // Load curriculum data and lessons
  const currDataCode = fs.readFileSync(path.join(rootDir, 'data/curriculum-data.js'), 'utf8');
  vm.runInNewContext(currDataCode, sandbox);

  const lessonsCode = fs.readFileSync(path.join(rootDir, 'js/lessons.js'), 'utf8');
  vm.runInNewContext(`
    ${lessonsCode};
    result = { isLessonLocked, getLessonBest, LESSONS };
  `, sandbox);

  const { isLessonLocked, getLessonBest, LESSONS } = sandbox.result;

  // Lesson 1 should be unlocked initially
  const l1 = LESSONS[0];
  const l2 = LESSONS[1];
  assert.equal(isLessonLocked(l1.id), false, 'Lesson 1 must be unlocked by default');

  // Lesson 2 must be locked when user hasn't typed anything
  assert.equal(isLessonLocked(l2.id), true, 'Lesson 2 must remain locked when user has not typed lesson 1');

  // Simulate user merely starting lesson 1 (prog.started = true, but no attempts / no completed)
  sandbox.window.PK_PROGRESS = {
    getLessonProgress: (layout, id) => {
      if (String(id) === String(l1.id)) {
        return { started: true, completed: false, passed: false, totalAttempts: 0, bestAccuracy: 0 };
      }
      return null;
    }
  };

  // Lesson 2 must STILL be locked!
  assert.equal(isLessonLocked(l2.id), true, 'Lesson 2 must REMAIN locked when lesson 1 is merely started without typing');

  // Now simulate user actually finishing and passing lesson 1
  sandbox.window.PK_PROGRESS = {
    getLessonProgress: (layout, id) => {
      if (String(id) === String(l1.id)) {
        return { started: true, completed: true, passed: true, totalAttempts: 1, bestAccuracy: 95, masteryState: 'mastered' };
      }
      return null;
    }
  };

  // Now Lesson 2 must be unlocked!
  assert.equal(isLessonLocked(l2.id), false, 'Lesson 2 must unlock after completing lesson 1 with valid score');
});

test('Rei Tutor: Authentic Cambodia Wallpapers & Custom Upload Engine', () => {
  const settingsCode = fs.readFileSync(path.join(rootDir, 'js/settings.js'), 'utf8');
  
  // Verify Cambodia wallpapers
  assert.ok(settingsCode.includes('angkor-wat-sunrise.jpg'), 'Must include Angkor Wat Sunrise wallpaper');
  assert.ok(settingsCode.includes('bayon-stone-faces.jpg'), 'Must include Bayon Stone Faces wallpaper');
  assert.ok(settingsCode.includes('ta-prohm-roots.jpg'), 'Must include Ta Prohm Roots wallpaper');
  assert.ok(settingsCode.includes('angkor-wat-twilight.jpg'), 'Must include Angkor Wat Twilight wallpaper');
  assert.ok(settingsCode.includes('banteay-srei-carvings.jpg'), 'Must include Banteay Srei Carvings wallpaper');
  assert.ok(settingsCode.includes('cambodia-countryside.jpg'), 'Must include Cambodia Sugar Palms wallpaper');

  // Verify modal upload handler and reset handler exist
  assert.ok(settingsCode.includes('modalUploadWallpaperBtn'), 'Must support modal upload button');
  assert.ok(settingsCode.includes('modalWallpaperFileInput'), 'Must support modal file input');
  assert.ok(settingsCode.includes('wallpaperModalResetBtn'), 'Must support modal reset button');

  // Verify thumbnail normalization in gallery renderer
  assert.ok(settingsCode.includes('normalizeImageUrl(p.url)'), 'Wallpaper presets must normalize image URLs for thumbnails');

  // Verify files exist in rei/assets/wallpapers
  const wpDir = path.join(rootDir, 'rei/assets/wallpapers');
  assert.ok(fs.existsSync(wpDir), 'rei/assets/wallpapers must exist');
  const requiredWallpapers = [
    'angkor-wat-sunrise.jpg',
    'bayon-stone-faces.jpg',
    'ta-prohm-roots.jpg',
    'angkor-wat-twilight.jpg',
    'banteay-srei-carvings.jpg',
    'cambodia-countryside.jpg'
  ];
  requiredWallpapers.forEach(wp => {
    assert.ok(fs.existsSync(path.join(wpDir, wp)), `Wallpaper ${wp} must exist in rei/assets/wallpapers`);
  });
});

test('Rei Tutor: Pedagogical Aids - Stage Tips, Finger Reach HUD & Key Pulse', () => {
  const lessonsCode = fs.readFileSync(path.join(rootDir, 'js/lessons.js'), 'utf8');

  // Verify Stage tips exist for all 7 stages
  assert.ok(lessonsCode.includes('REI_STAGE_TIPS'), 'Must declare REI_STAGE_TIPS');
  const kmNumerals = ['១', '២', '៣', '៤', '៥', '៦', '៧'];
  for (let s = 1; s <= 7; s++) {
    assert.ok(lessonsCode.includes(`Stage ${s}`), `Must have Stage ${s} English guidance`);
    assert.ok(lessonsCode.includes(`វគ្គ ${kmNumerals[s - 1]}`), `Must have Stage ${s} Khmer guidance`);
  }

  // Verify Interactive Finger Reach HUD functions
  assert.ok(lessonsCode.includes('updateReiFingerReachGuide'), 'Must declare updateReiFingerReachGuide');
  assert.ok(lessonsCode.includes('updateReiStageTip'), 'Must declare updateReiStageTip');
  assert.ok(lessonsCode.includes('updateReiStageBadges'), 'Must declare updateReiStageBadges');

  // Verify CSS styles in Rei HTML
  const reiHtml = fs.readFileSync(path.join(rootDir, 'rei/index.html'), 'utf8');
  assert.ok(reiHtml.includes('rei-target-pulse'), 'Must include target key pulsing illumination animation');
  assert.ok(reiHtml.includes('rei-finger-reach-hud'), 'Must include Interactive Live Finger Reach Guidance HUD markup');
  assert.ok(reiHtml.includes('rei-stage-tip-banner'), 'Must include Stage Pedagogical Tip Banner markup');

  // Verify Finger Guide Stacking Context (Hands overlay must always be on top of target keys)
  const kbCss = fs.readFileSync(path.join(rootDir, 'css/keyboard.css'), 'utf8');
  const lessonsCss = fs.readFileSync(path.join(rootDir, 'css/lessons.css'), 'utf8');
  assert.match(kbCss, /\.hands-overlay\s*\{[^}]*z-index:\s*25/i, 'Hands overlay must have elevated z-index (25) to sit above all keys');
  assert.match(lessonsCss, /\.is-rei \.key\.lesson-target,\s*\.is-rei \.key\.active-target\s*\{[^}]*z-index:\s*4/i, 'Rei target keys must stay at z-index 4 under hands overlay');
  assert.match(reiHtml, /\.is-rei \.key\.lesson-target,\s*\.is-rei \.key\.active-target\s*\{[^}]*z-index:\s*4/i, 'Rei generated HTML target keys must stay at z-index 4 under hands overlay');
});

test('Rei Tutor: Stage Filtering, 3-Step Instruction Guide, and Accurate Home Row Drill Count (9 Drills, not 51)', () => {
  const lessonsCode = fs.readFileSync(path.join(rootDir, 'js/lessons.js'), 'utf8');
  assert.ok(lessonsCode.includes('REI_STAGE_CONFIG'), 'Must declare REI_STAGE_CONFIG');
  assert.ok(lessonsCode.includes('matchReiStageLevel'), 'Must declare matchReiStageLevel');

  // Verify Rei HTML includes 3-Step Guide and Stage bar with All option
  const reiHtml = fs.readFileSync(path.join(rootDir, 'rei/index.html'), 'utf8');
  assert.ok(reiHtml.includes('rei-how-to-use-guide'), 'Rei HTML must include 3-Step How-To-Use Guide');
  assert.ok(reiHtml.includes('rei-strip-stages-bar'), 'Rei HTML must include Stage Bar');
  assert.ok(reiHtml.includes('data-stage="all"'), 'Rei Stage Bar must support All Lessons view');

  // Load Curriculum and verify Stage 1 count
  const currDataCode = fs.readFileSync(path.join(rootDir, 'data/curriculum-data.js'), 'utf8');
  const kbData = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/keyboard.json'), 'utf8'));

  function createMockElement(id) {
    return {
      id: id || '',
      tagName: 'DIV',
      addEventListener: () => {},
      removeEventListener: () => {},
      appendChild: () => {},
      setAttribute: () => {},
      removeAttribute: () => {},
      replaceChildren: () => {},
      getAttribute: () => null,
      focus: () => {},
      blur: () => {},
      style: {},
      classList: { contains: () => false, add: () => {}, remove: () => {}, toggle: () => {} },
      querySelector: () => null,
      querySelectorAll: () => []
    };
  }

  const sandbox = {
    global: {},
    currentLayoutId: 'standard',
    pkIcon: () => '',
    window: { addEventListener: () => {}, removeEventListener: () => {} },
    document: {
      addEventListener: () => {},
      removeEventListener: () => {},
      createDocumentFragment: () => createMockElement(),
      documentElement: { classList: { contains: () => false, add: () => {}, remove: () => {} } },
      getElementById: (id) => createMockElement(id),
      querySelector: () => null,
      querySelectorAll: () => [],
      createElement: () => createMockElement()
    },
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    ROW1: kbData.LAYOUTS.standard.rows[0],
    ROW2: kbData.LAYOUTS.standard.rows[1],
    ROW3: kbData.LAYOUTS.standard.rows[2],
    ROW4: kbData.LAYOUTS.standard.rows[3],
    ROW5: kbData.LAYOUTS.standard.rows[4] || [],
    ROW1_NIDA: kbData.LAYOUTS.nida.rows[0],
    ROW2_NIDA: kbData.LAYOUTS.nida.rows[1],
    ROW3_NIDA: kbData.LAYOUTS.nida.rows[2],
    ROW4_NIDA: kbData.LAYOUTS.nida.rows[3],
    ROW5_NIDA: kbData.LAYOUTS.nida.rows[4] || [],
    ROW1_EN: (kbData.LAYOUTS.english && kbData.LAYOUTS.english.rows[0]) || [],
    ROW2_EN: (kbData.LAYOUTS.english && kbData.LAYOUTS.english.rows[1]) || [],
    ROW3_EN: (kbData.LAYOUTS.english && kbData.LAYOUTS.english.rows[2]) || [],
    ROW4_EN: (kbData.LAYOUTS.english && kbData.LAYOUTS.english.rows[3]) || [],
    ROW5_EN: (kbData.LAYOUTS.english && kbData.LAYOUTS.english.rows[4]) || []
  };
  sandbox.window.document = sandbox.document;

  vm.runInNewContext(currDataCode, sandbox);
  vm.runInNewContext(`
    ${lessonsCode}
    result = { REI_STAGE_CONFIG, matchReiStageLevel };
  `, sandbox);

  const { REI_STAGE_CONFIG, matchReiStageLevel } = sandbox.result;
  const CURRICULUM_DATA = sandbox.window.CURRICULUM_DATA || sandbox.global.CURRICULUM_DATA || sandbox.CURRICULUM_DATA;
  const stdStage1 = REI_STAGE_CONFIG[0];
  const stdLevels = CURRICULUM_DATA.standard.levels.filter(l => matchReiStageLevel(l.id, stdStage1));
  const stdCount = stdLevels.reduce((sum, l) => sum + l.lessons.length, 0);

  assert.equal(stdCount, 9, 'Khmer Standard Stage 1 (Home Row) must have exactly 9 drills (not 51!)');

  const enStage1 = REI_STAGE_CONFIG[0];
  const enLevels = CURRICULUM_DATA.english.levels.filter(l => matchReiStageLevel(l.id, enStage1));
  const enCount = enLevels.reduce((sum, l) => sum + l.lessons.length, 0);
  assert.equal(enCount, 8, 'English Stage 1 (Home Row) must have exactly 8 drills');
});

test('Rei Tutor: Stage Locking and Sequential Progression', () => {
  const currDataCode = fs.readFileSync(path.join(rootDir, 'data/curriculum-data.js'), 'utf8');
  const lessonsCode = fs.readFileSync(path.join(rootDir, 'js/lessons.js'), 'utf8');
  const kbData = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/keyboard.json'), 'utf8'));

  function createMockElement(id) {
    return {
      id: id || '',
      tagName: 'DIV',
      addEventListener: () => {},
      removeEventListener: () => {},
      appendChild: () => {},
      setAttribute: () => {},
      removeAttribute: () => {},
      getAttribute: () => null,
      focus: () => {},
      blur: () => {},
      style: {},
      classList: { contains: () => false, add: () => {}, remove: () => {}, toggle: () => {} },
      querySelector: () => null,
      querySelectorAll: () => []
    };
  }

  const sandbox = {
    window: { addEventListener: () => {}, removeEventListener: () => {} },
    global: {},
    currentLayoutId: 'standard',
    pkIcon: () => '',
    document: {
      addEventListener: () => {},
      removeEventListener: () => {},
      createDocumentFragment: () => createMockElement(),
      documentElement: { classList: { contains: () => false, add: () => {}, remove: () => {} } },
      getElementById: (id) => createMockElement(id),
      querySelector: () => null,
      querySelectorAll: () => [],
      createElement: () => createMockElement()
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    },
    console: console,
    ROW1: kbData.LAYOUTS.standard.rows[0],
    ROW2: kbData.LAYOUTS.standard.rows[1],
    ROW3: kbData.LAYOUTS.standard.rows[2],
    ROW4: kbData.LAYOUTS.standard.rows[3],
    ROW5: kbData.LAYOUTS.standard.rows[4] || [],
    ROW1_NIDA: kbData.LAYOUTS.nida.rows[0],
    ROW2_NIDA: kbData.LAYOUTS.nida.rows[1],
    ROW3_NIDA: kbData.LAYOUTS.nida.rows[2],
    ROW4_NIDA: kbData.LAYOUTS.nida.rows[3],
    ROW5_NIDA: kbData.LAYOUTS.nida.rows[4] || [],
    ROW1_EN: (kbData.LAYOUTS.english && kbData.LAYOUTS.english.rows[0]) || [],
    ROW2_EN: (kbData.LAYOUTS.english && kbData.LAYOUTS.english.rows[1]) || [],
    ROW3_EN: (kbData.LAYOUTS.english && kbData.LAYOUTS.english.rows[2]) || [],
    ROW4_EN: (kbData.LAYOUTS.english && kbData.LAYOUTS.english.rows[3]) || [],
    ROW5_EN: (kbData.LAYOUTS.english && kbData.LAYOUTS.english.rows[4]) || []
  };
  sandbox.window.document = sandbox.document;

  vm.runInNewContext(currDataCode, sandbox);
  vm.runInNewContext(`
    ${lessonsCode}
    result = { isReiStageLocked, isLessonLocked, REI_STAGE_CONFIG };
  `, sandbox);

  const { isReiStageLocked } = sandbox.result;

  // Stage 1 (Home Row) is unlocked by default
  assert.equal(isReiStageLocked(1), false, 'Stage 1 must be unlocked by default');
  assert.equal(isReiStageLocked('all'), false, 'All stage must be viewable');

  // Stage 2 (Top Row) must be LOCKED when user has not completed Stage 1!
  assert.equal(isReiStageLocked(2), true, 'Stage 2 must be locked when Stage 1 is incomplete');
  assert.equal(isReiStageLocked(3), true, 'Stage 3 must be locked when Stage 1 is incomplete');
});

test('Rei Tutor: Welcome Onboarding Track Selector Option', () => {
  const tutCode = fs.readFileSync(path.join(rootDir, 'js/tutorial.js'), 'utf8');
  const tutCss = fs.readFileSync(path.join(rootDir, 'css/tutorial.css'), 'utf8');

  // Verify track card and icon in tutorial.js
  assert.ok(tutCode.includes('data-track="rei"'), 'Must include data-track="rei" card in onboarding modal');
  assert.ok(tutCode.includes('id="pkTutTrackReiName"'), 'Must include id="pkTutTrackReiName" element');
  assert.ok(tutCode.includes('trackReiTitle'), 'Must include trackReiTitle in English and Khmer dictionaries');
  assert.ok(tutCode.includes("window.location.href = 'rei.html'"), 'Must direct to rei.html when Rei track is chosen');

  // Verify CSS styles
  assert.ok(tutCss.includes('.pk-tut-track-card.pk-tut-track-rei'), 'Must include CSS styling for Rei track card');
});

test('Rei Tutor: Hands Clearance & Layout Isolation (No overlap with Pro Tips or lower cards)', () => {
  const reiContent = fs.readFileSync(path.join(rootDir, 'rei.html'), 'utf8');
  const typingCss = fs.readFileSync(path.join(rootDir, 'css/typing.css'), 'utf8');
  const lessonsCss = fs.readFileSync(path.join(rootDir, 'css/lessons.css'), 'utf8');
  const kbCode = fs.readFileSync(path.join(rootDir, 'js/keyboard.js'), 'utf8');

  // 1. Rei board-wrap has generous clearance (155px) so wrists never overlap Pro Tips card
  assert.ok(reiContent.includes('margin: 0 auto 155px auto !important;'), 'Rei board-wrap must have 155px bottom margin for hands overlay');
  assert.ok(reiContent.includes('margin: 0 auto 24px auto !important;'), 'Rei board-wrap must collapse margin when hands are toggled off');

  // 2. typing.css default clearance
  assert.ok(typingCss.includes('margin: 0 auto 155px auto;'), 'Default board-wrap must provide 155px clearance for hands');
  assert.ok(typingCss.includes('margin-bottom: 24px !important;'), 'Default board-wrap must collapse when hands-hidden');

  // 3. lessons.css toolbar clearance
  assert.ok(lessonsCss.includes('margin:150px auto 0;'), 'Toolbar in Studio Pro must have 150px margin to avoid hand collision');

  // 4. keyboard.js dynamic state sync
  assert.ok(kbCode.includes("classList.add('hands-guide-off')"), 'keyboard.js must toggle hands-guide-off when hands hidden');
  assert.ok(kbCode.includes("classList.remove('hands-guide-off')"), 'keyboard.js must remove hands-guide-off when hands visible');
});

test('Focus Mode: Cool Ergonomic Cyber Lessons Bar (Available for Learning, No Squished Truncation)', () => {
  const baseCss = fs.readFileSync(path.join(rootDir, 'css/base.css'), 'utf8');
  const lessonsCss = fs.readFileSync(path.join(rootDir, 'css/lessons.css'), 'utf8');
  const reiHtml = fs.readFileSync(path.join(rootDir, 'rei.html'), 'utf8');

  // 1. base.css does not hide lessonStrip in focus-mode so learners can learn
  assert.ok(!baseCss.includes('html.focus-mode #lessonStrip'), 'base.css must not hide #lessonStrip in focus-mode');

  // 2. lessons.css must NOT force squished 226px or 258px docks
  assert.ok(!lessonsCss.includes('width: min(90vw, 258px) !important;'), 'lessons.css must not force 258px squished dock in focus-mode');
  assert.ok(!lessonsCss.includes('width: min(90vw, 226px) !important;'), 'lessons.css must not force 226px squished dock in focus-mode');

  // 3. lessons.css provides cool cyber focus dock with generous width
  assert.ok(lessonsCss.includes('html.focus-mode .lesson-strip'), 'lessons.css must style lesson strip in focus-mode');

  // 4. rei.html does not hide lesson strip in focus-mode
  assert.ok(!reiHtml.includes('html.focus-mode #lessonStrip,\n    html.focus-mode .lesson-strip,\n    html.focus-mode .is-rei #lessonStrip,\n    html.focus-mode .is-rei .lesson-strip {\n      display: none !important;'), 'rei.html must not hide lesson strip in focus-mode');
});

test('Rei Tutor: Strict Zero-Emoji Compliance', () => {
  const files = [
    'rei/index.html',
    'rei.html',
    'scripts/generate_rei.js',
    'js/lessons.js',
    'js/settings.js',
    'js/tutorial.js',
    'css/tutorial.css'
  ];

  const emojiPattern = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/u;

  files.forEach(file => {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
    const match = emojiPattern.exec(content);
    assert.equal(match, null, `File ${file} must have zero emojis, but found: ${match ? match[0] : ''}`);
  });
});
