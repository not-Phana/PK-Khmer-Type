const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Helper to create a comprehensive mock DOM and window environment
function createMockWindow() {
  const store = {};
  const mockStorage = {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    key: (i) => Object.keys(store)[i] || null,
    get length() { return Object.keys(store).length; },
    _dump: () => ({ ...store })
  };

  const createDummyEl = () => ({
    addEventListener: () => {},
    removeEventListener: () => {},
    classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
    style: {},
    setAttribute: () => {},
    getAttribute: () => null,
    appendChild: () => {},
    removeChild: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 100 })
  });

  const dummyDocEl = createDummyEl();

  const win = {
    localStorage: mockStorage,
    location: { hash: '', href: '' },
    PK_STORAGE: null,
    PK_CUSTOM_LESSONS: null,
    PK_GHOST_PACER: null,
    crypto: {
      subtle: {
        digest: async (algo, data) => {
          const hash = crypto.createHash('sha256').update(data).digest();
          return hash.buffer;
        }
      }
    },
    addEventListener: () => {},
    document: {
      readyState: 'complete',
      documentElement: dummyDocEl,
      location: { hash: '', href: '' },
      addEventListener: () => {},
      getElementById: () => createDummyEl(),
      querySelector: () => createDummyEl(),
      querySelectorAll: () => []
    }
  };
  return win;
}

test('Phase F: Offline Classroom Course Packs - Export and Import validation', async () => {
  const customLessonsSrc = fs.readFileSync(path.join(__dirname, '../js/custom-lessons.js'), 'utf8');
  const win = createMockWindow();

  // Evaluate custom-lessons module in isolated function context
  const runModule = new Function('window', 'localStorage', 'document', customLessonsSrc);
  runModule(win, win.localStorage, win.document);

  assert.ok(win.PK_CUSTOM_LESSONS, 'PK_CUSTOM_LESSONS must be exposed');
  assert.equal(typeof win.PK_CUSTOM_LESSONS.exportCoursePack, 'function', 'exportCoursePack must exist');
  assert.equal(typeof win.PK_CUSTOM_LESSONS.importCoursePack, 'function', 'importCoursePack must exist');

  // Seed two custom lessons via official createLesson API
  const l1 = win.PK_CUSTOM_LESSONS.createLesson({
    title: 'Khmer Math Terms',
    description: 'Intro to arithmetic vocabulary',
    targetLayout: 'standard',
    difficulty: 'beginner',
    content: 'បូក ដក គុណ ចែក'
  });
  const l2 = win.PK_CUSTOM_LESSONS.createLesson({
    title: 'Cambodian Geography',
    description: 'Provinces and rivers',
    targetLayout: 'standard',
    difficulty: 'intermediate',
    content: 'ភ្នំពេញ សៀមរាប បាត់ដំបង កំពត'
  });
  assert.ok(l1 && l1.id, 'Lesson 1 created');
  assert.ok(l2 && l2.id, 'Lesson 2 created');

  // Export Course Pack
  const exp = win.PK_CUSTOM_LESSONS.exportCoursePack('Grade 7 Khmer Typing', 'Kurosaki');
  assert.equal(exp.ok, true, 'Export must succeed');
  const pack = exp.pack;

  assert.equal(pack.format, 'pkcourse', 'Bundle format must match pkcourse');
  assert.equal(pack.courseTitle, 'Grade 7 Khmer Typing');
  assert.equal(pack.author, 'Kurosaki');
  assert.ok(pack.lessonCount >= 2);
  assert.ok(Array.isArray(pack.lessons));

  // Clear storage and import Course Pack
  win.localStorage.clear();
  const imp = win.PK_CUSTOM_LESSONS.importCoursePack(exp.json);
  assert.equal(imp.ok, true, 'Import must succeed');
  assert.ok(imp.importedCount >= 2, 'Must import at least 2 lessons');

  // Verify stored lessons
  const stored = win.PK_CUSTOM_LESSONS.getAllLessons();
  assert.ok(stored.length >= 2, 'Stored lessons must be restored');
  assert.equal(stored.some(l => l.title === 'Khmer Math Terms'), true);
  assert.equal(stored.some(l => l.title === 'Cambodian Geography'), true);

  // Invalid pack rejection test
  const badImport = win.PK_CUSTOM_LESSONS.importCoursePack('{ "format": "invalid" }');
  assert.equal(badImport.ok, false, 'Invalid format must be rejected');
});

test('Phase F: Student Verifiable Grade Slips - Tamper-proof certificate verification', async () => {
  const customLessonsSrc = fs.readFileSync(path.join(__dirname, '../js/custom-lessons.js'), 'utf8');
  const win = createMockWindow();
  const runModule = new Function('window', 'localStorage', 'document', customLessonsSrc);
  runModule(win, win.localStorage, win.document);

  assert.equal(typeof win.PK_CUSTOM_LESSONS.generateStudentGradeSlip, 'function');
  assert.equal(typeof win.PK_CUSTOM_LESSONS.verifyStudentGradeSlip, 'function');

  // Create a lesson and record progress
  const l1 = win.PK_CUSTOM_LESSONS.createLesson({
    title: 'Typing Final Exam',
    description: 'Final evaluation',
    targetLayout: 'standard',
    difficulty: 'intermediate',
    content: 'កម្ពុជា ប្រទេសកំណើតនៃវប្បធម៌ខ្មែរ'
  });
  win.PK_CUSTOM_LESSONS.recordAttempt(l1.id, {
    wpm: 52,
    accuracy: 96.5,
    timeSpent: 35,
    passed: true
  });

  const gradeResult = win.PK_CUSTOM_LESSONS.generateStudentGradeSlip('Sok Dara', 'End of Term Assessment');
  assert.equal(gradeResult.ok, true);
  const slip = gradeResult.gradeSlip;

  assert.equal(slip.format, 'pkgrade');
  assert.equal(slip.studentName, 'Sok Dara');
  assert.equal(slip.courseTitle, 'End of Term Assessment');
  assert.ok(slip.checksum.startsWith('PKG-'), 'Checksum must start with PKG- prefix');
  assert.equal(slip.summary.lessonsCompleted >= 1, true);

  // Verify authentic slip
  const verif = win.PK_CUSTOM_LESSONS.verifyStudentGradeSlip(slip);
  assert.equal(verif.valid, true, 'Authentic slip must verify as valid');
  assert.equal(verif.studentName, 'Sok Dara');

  // Tamper test: Modify student name or summary and assert rejection
  const tamperedSlip = JSON.parse(JSON.stringify(slip));
  tamperedSlip.studentName = 'Impostor';
  const tamperVerif = win.PK_CUSTOM_LESSONS.verifyStudentGradeSlip(tamperedSlip);
  assert.equal(tamperVerif.valid, false, 'Tampered slip must be flagged invalid');
});

test('Phase G: Multi-Learner Local Profiles - Storage isolation and profile routing', async () => {
  const storageSrc = fs.readFileSync(path.join(__dirname, '../js/storage.js'), 'utf8');
  const win = createMockWindow();
  const runModule = new Function('window', 'localStorage', 'document', storageSrc);
  runModule(win, win.localStorage, win.document);

  assert.ok(win.PK_STORAGE, 'PK_STORAGE must be exported');
  assert.equal(typeof win.PK_STORAGE.listLocalProfiles, 'function');
  assert.equal(typeof win.PK_STORAGE.createLocalProfile, 'function');
  assert.equal(typeof win.PK_STORAGE.switchLocalProfile, 'function');
  assert.equal(typeof win.PK_STORAGE.deleteLocalProfile, 'function');

  // Initial state has default profile
  const initialProfiles = win.PK_STORAGE.listLocalProfiles();
  assert.ok(initialProfiles.length >= 1, 'Default profile must exist');
  assert.equal(initialProfiles[0].id, 'default');

  // Create student profiles
  const r1 = win.PK_STORAGE.createLocalProfile('Student Alice');
  const r2 = win.PK_STORAGE.createLocalProfile('Student Bob');
  assert.ok(r1.ok && r1.profile.id);
  assert.ok(r2.ok && r2.profile.id);

  const aliceId = r1.profile.id;
  const bobId = r2.profile.id;

  // Switch to Alice and save progress
  win.PK_STORAGE.switchLocalProfile(aliceId);
  assert.equal(win.PK_STORAGE.getActiveLocalProfile().id, aliceId);
  win.localStorage.setItem('khmerLessonProgress_standard', JSON.stringify({ 'standard-L01-01': { passed: true, wpm: 35 } }));

  // Switch to Bob and verify clean state
  win.PK_STORAGE.switchLocalProfile(bobId);
  assert.equal(win.PK_STORAGE.getActiveLocalProfile().id, bobId);
  const bobProgress = JSON.parse(win.localStorage.getItem('khmerLessonProgress_standard') || '{}');
  assert.deepEqual(bobProgress, {}, 'Bob progress must be isolated from Alice');

  // Save Bob progress
  win.localStorage.setItem('khmerLessonProgress_standard', JSON.stringify({ 'standard-L01-01': { passed: true, wpm: 20 } }));

  // Switch back to Alice and verify restoration
  win.PK_STORAGE.switchLocalProfile(aliceId);
  const aliceProgress = JSON.parse(win.localStorage.getItem('khmerLessonProgress_standard') || '{}');
  assert.equal(aliceProgress['standard-L01-01'].wpm, 35, 'Alice progress must be restored');

  // Delete Bob
  const delResult = win.PK_STORAGE.deleteLocalProfile(bobId);
  assert.equal(delResult.ok, true);
  const updatedList = win.PK_STORAGE.listLocalProfiles();
  assert.equal(updatedList.some(p => p.id === bobId), false);
});

test('Phase G: Offline Ghost Racers - Vector recording, telemetry export, and playback pacer', async () => {
  const raceSrc = fs.readFileSync(path.join(__dirname, '../js/race.js'), 'utf8');
  const win = createMockWindow();
  const runModule = new Function('window', 'localStorage', 'document', raceSrc);
  runModule(win, win.localStorage, win.document);

  assert.ok(win.PK_GHOST_PACER, 'PK_GHOST_PACER must be exported');
  assert.equal(typeof win.PK_GHOST_PACER.recordGhostKeystroke, 'function');
  assert.equal(typeof win.PK_GHOST_PACER.exportGhostVector, 'function');
  assert.equal(typeof win.PK_GHOST_PACER.importGhostVector, 'function');

  // Record a ghost race run
  win.PK_GHOST_PACER.recordGhostKeystroke(0, 0, false);
  win.PK_GHOST_PACER.recordGhostKeystroke(250, 1, false);
  win.PK_GHOST_PACER.recordGhostKeystroke(480, 2, false);
  win.PK_GHOST_PACER.recordGhostKeystroke(710, 3, true); // typo
  win.PK_GHOST_PACER.recordGhostKeystroke(920, 3, false);

  const ghostVector = win.PK_GHOST_PACER.exportGhostVector('SovereignGhost', 55);

  assert.equal(ghostVector.format, 'pkghost');
  assert.equal(ghostVector.player, 'SovereignGhost');
  assert.equal(ghostVector.wpm, 55);
  assert.ok(ghostVector.strokes.length >= 5);

  // Import vector into second session
  win.localStorage.clear();
  const importedGhost = win.PK_GHOST_PACER.importGhostVector(ghostVector);
  assert.equal(importedGhost.ok, true);
  assert.equal(importedGhost.player, 'SovereignGhost');
  assert.equal(importedGhost.wpm, 55);

  const activePacer = win.PK_GHOST_PACER.getActiveGhostPacer();
  assert.ok(activePacer, 'Active ghost pacer must be active');
  assert.equal(activePacer.player, 'SovereignGhost');
});

test('Phase H: Khmer Cultural Literature Vault - Catalog integrity and passage breadth', () => {
  const catalogPath = path.join(__dirname, '../data/literature/khmer_classics.json');
  assert.ok(fs.existsSync(catalogPath), 'Khmer classics catalog file must exist on disk');

  const raw = fs.readFileSync(catalogPath, 'utf8');
  const catalog = JSON.parse(raw);

  assert.equal(catalog.version, '1.0.0');
  assert.ok(Array.isArray(catalog.categories), 'Must contain categories array');
  assert.ok(catalog.categories.length >= 5, 'Must contain at least 5 classic literary categories');

  const titles = catalog.categories.map(c => c.id);
  assert.ok(titles.includes('reamker'), 'Reamker must be included');
  assert.ok(titles.includes('tum_teav'), 'Tum Teav must be included');
  assert.ok(titles.includes('chbap_srey'), 'Chbap Srey must be included');
  assert.ok(titles.includes('chbap_pros'), 'Chbap Pros must be included');
  assert.ok(titles.includes('constitution'), 'Cambodian Constitution must be included');

  // Verify passages
  catalog.categories.forEach(cat => {
    assert.ok(cat.titleKm, `Category ${cat.id} must have Khmer title`);
    assert.ok(cat.period, `Category ${cat.id} must have period`);
    assert.ok(Array.isArray(cat.passages) && cat.passages.length >= 1, `Category ${cat.id} must have passages`);
    cat.passages.forEach(p => {
      assert.ok(p.id, 'Passage must have id');
      assert.ok(p.title, 'Passage must have title');
      assert.ok(p.text && p.text.length >= 40, `Passage ${p.id} must have substantive text`);
    });
  });
});

test('Phases F, G, H: Strict Zero-Emoji compliance verification', () => {
  const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const filesToCheck = [
    'js/custom-lessons.js',
    'js/storage.js',
    'js/race.js',
    'data/literature/khmer_classics.json'
  ];

  filesToCheck.forEach(relPath => {
    const fullPath = path.join(__dirname, '..', relPath);
    const content = fs.readFileSync(fullPath, 'utf8');
    assert.equal(emojiRegex.test(content), false, `Emoji found in ${relPath}! Zero-Emoji policy strictly required.`);
  });
});
