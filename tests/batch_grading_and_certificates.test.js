import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Load custom lessons to test verifyStudentGradeSlip & batch logic
const customLessonsCode = fs.readFileSync(path.resolve('js/custom-lessons.js'), 'utf8');
const adaptiveVocabCode = fs.readFileSync(path.resolve('data/adaptive-vocab.js'), 'utf8');
const raceCode = fs.readFileSync(path.resolve('js/race.js'), 'utf8');

test('Feature 5: Temple Trial Dynamic Vocabulary Expansion', () => {
  // Test sandbox for race.js
  const mockWindow = {
    WORD_BANK: ['អាវ','តា','យាយ'],
    WORD_BANK_EN: ['cat','dog','sun'],
    localStorage: {
      getItem: () => '0',
      setItem: () => {}
    }
  };
  const mockDoc = {
    getElementById: () => null,
    querySelectorAll: () => []
  };

  const sandbox = {
    window: mockWindow,
    document: mockDoc,
    localStorage: mockWindow.localStorage,
    currentLayoutId: 'english',
    boardWrap: { classList: { add(){}, remove(){} } }
  };

  // Run adaptive-vocab first
  const runVocab = new Function('global', 'window', adaptiveVocabCode);
  runVocab(sandbox, mockWindow);

  assert.ok(Array.isArray(mockWindow.ENGLISH_ADAPTIVE_WORDS), 'English adaptive words loaded');
  assert.ok(mockWindow.ENGLISH_ADAPTIVE_WORDS.length > 500, 'English vocabulary pool has 500+ words');
  assert.ok(Array.isArray(mockWindow.KHMER_ADAPTIVE_WORDS), 'Khmer adaptive words loaded');
  assert.ok(mockWindow.KHMER_ADAPTIVE_WORDS.length > 200, 'Khmer vocabulary pool has 200+ words');

  // Run race.js
  const runRace = new Function('window', 'document', 'localStorage', 'currentLayoutId', 'boardWrap', raceCode);
  runRace(mockWindow, mockDoc, mockWindow.localStorage, 'english', sandbox.boardWrap);

  assert.ok(mockWindow.PK_TRIAL_BANK, 'PK_TRIAL_BANK exposed on window');
  
  // Test English Word Pool
  const enWords = mockWindow.PK_TRIAL_BANK.currentWordBank();
  assert.ok(enWords.length > 50, 'Dynamic English word bank provides 50+ words');
  // Check sanitization: no punctuation or trailing periods
  enWords.forEach(w => {
    assert.ok(!/[។,\.!?\s]/.test(w), `Word "${w}" should not contain punctuation`);
  });

  // Switch to Khmer layout and verify
  mockWindow.currentLayoutId = 'standard';
  const kmPool = mockWindow.PK_TRIAL_BANK.getSanitizedAdaptiveWords(mockWindow.KHMER_ADAPTIVE_WORDS, 2, 7);
  assert.ok(kmPool.length > 100, 'Khmer word pool has 100+ clean words');
  kmPool.forEach(w => {
    assert.ok(!/[។៕,\.!?\s]/.test(w), `Khmer word "${w}" must be clean of punctuation`);
    assert.ok(Array.from(w).length >= 2, `Word "${w}" should have at least 2 characters`);
  });
});

test('Feature 6: 1-Click Weak-Key Practice Button Markup and Trigger Integration', () => {
  const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf8');
  assert.ok(indexHtml.includes('id="weakKeysDrillBtn"'), 'index.html contains #weakKeysDrillBtn in toolbar');
  assert.ok(indexHtml.includes('weak-keys-drill-btn'), 'index.html applies .weak-keys-drill-btn class');
  assert.ok(!/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/u.test(indexHtml.slice(indexHtml.indexOf('weakKeysDrillBtn'), indexHtml.indexOf('weakKeysDrillBtn') + 300)), 'Zero-emoji compliance on weakKeysDrillBtn');

  // Verify review.js auto-wiring
  const reviewCode = fs.readFileSync(path.resolve('js/review.js'), 'utf8');
  assert.ok(reviewCode.includes('wireWeakKeysDrillTrigger'), 'review.js contains wireWeakKeysDrillTrigger');
  assert.ok(reviewCode.includes('startAdaptivePractice'), 'review.js triggers startAdaptivePractice on click');
});

test('Feature 1: Teacher Offline Batch Grading Workstation Aggregator', () => {
  // Setup sandbox with PK_CUSTOM_LESSONS
  const mockWindow = {
    addEventListener: () => {},
    localStorage: {
      getItem: () => null,
      setItem: () => {}
    }
  };
  const mockDoc = {
    readyState: 'complete',
    addEventListener: () => {},
    getElementById: () => null,
    querySelectorAll: () => []
  };
  const runCustomLessons = new Function('window', 'document', customLessonsCode);
  runCustomLessons(mockWindow, mockDoc);

  assert.ok(mockWindow.PK_CUSTOM_LESSONS, 'PK_CUSTOM_LESSONS initialized');

  // Create sample cohort slips
  function createSampleSlip(name, wpm, acc, passed, tampered = false) {
    const rawCheck = `${name}|Khmer Standard Layout|10|${acc}|2026-11-03T12:00:00.000Z`;
    let hash = 0x811c9dc5;
    for (let i = 0; i < rawCheck.length; i++) {
      hash ^= rawCheck.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }
    const checksum = 'PKG-' + (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');

    return {
      format: 'pkgrade',
      version: '1.0.0',
      issuedAt: '2026-11-03T12:00:00.000Z',
      studentName: name,
      courseId: 'standard',
      courseTitle: 'Khmer Standard Layout',
      summary: {
        totalLessons: 10,
        lessonsCompleted: passed ? 10 : 8,
        averageWpm: tampered ? wpm + 50 : wpm, // tampering WPM causes checksum mismatch
        averageAccuracy: acc,
        passed: passed
      },
      checksum: checksum
    };
  }

  const slip1 = createSampleSlip('Sophea Dara', 45, 96, true, false);
  const slip2 = createSampleSlip('Vanna Rath', 38, 92, true, false);
  const slip3 = createSampleSlip('Bopha Pich', 52, 98, true, false);
  const slipTampered = createSampleSlip('Kosal Chem', 25, 80, false, true);

  // Verification checks
  const res1 = mockWindow.PK_CUSTOM_LESSONS.verifyStudentGradeSlip(slip1);
  assert.equal(res1.valid, true, 'Slip 1 is valid');
  assert.equal(res1.studentName, 'Sophea Dara');

  const resTampered = mockWindow.PK_CUSTOM_LESSONS.verifyStudentGradeSlip(slipTampered);
  assert.equal(resTampered.valid, false, 'Tampered slip is flagged as invalid');
  assert.ok(resTampered.reason.includes('Checksum mismatch'), 'Checksum mismatch detected');

  // Aggregator logic verification
  const cohort = [slip1, slip2, slip3, slipTampered];
  let validCount = 0;
  let totalWpm = 0;
  let totalAcc = 0;
  let passedCount = 0;

  cohort.forEach(slip => {
    const v = mockWindow.PK_CUSTOM_LESSONS.verifyStudentGradeSlip(slip);
    if (v.valid) {
      validCount++;
      totalWpm += v.averageWpm;
      totalAcc += v.averageAccuracy;
      if (v.passed) passedCount++;
    }
  });

  assert.equal(validCount, 3, '3 out of 4 slips are authentic');
  assert.equal(Math.round(totalWpm / validCount), 45, 'Average WPM calculated accurately');
  assert.equal(Math.round(totalAcc / validCount), 95, 'Average Accuracy calculated accurately');
  assert.equal(passedCount, 3, '3 students met passing benchmark');
});

test('Feature 2: Printable Vector SVG Merit Certificate Generator Output', () => {
  // Load dashboard.html and check certificate template and logic
  const dashboardHtml = fs.readFileSync(path.resolve('dashboard.html'), 'utf8');
  assert.ok(dashboardHtml.includes('id="pane-classroom"'), 'dashboard.html contains pane-classroom');
  assert.ok(dashboardHtml.includes('id="tabClassroomBtn"'), 'dashboard.html contains tabClassroomBtn');
  assert.ok(dashboardHtml.includes('id="btnDownloadCertSvg"'), 'dashboard.html contains download SVG button');
  assert.ok(dashboardHtml.includes('id="btnPrintCertificate"'), 'dashboard.html contains print certificate button');

  // Check Zero-Emoji compliance on dashboard.html
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/u;
  const lines = dashboardHtml.split('\n');
  lines.forEach((line, i) => {
    assert.ok(!emojiRegex.test(line), `Emoji detected in dashboard.html line ${i + 1}: ${line.slice(0, 50)}`);
  });
});
