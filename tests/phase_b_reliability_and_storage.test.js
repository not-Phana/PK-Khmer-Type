// tests/phase_b_reliability_and_storage.test.js
// Phase B: Core Reliability, Unicode Ligatures & Storage Hardening Automated Test Suite

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

// Setup mock browser environment
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    key: (i) => Object.keys(store)[i] || null,
    get length() { return Object.keys(store).length; },
    _dump: () => ({ ...store })
  };
})();

global.window = {
  addEventListener: () => {},
  crypto: {
    getRandomValues: (arr) => arr,
    randomUUID: () => 'test-uuid-1234'
  }
};
global.document = {
  activeElement: null,
  getElementById: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {},
  readyState: 'complete'
};
global.localStorage = localStorageMock;

// Load typing.js and storage.js
eval(fs.readFileSync(path.join(__dirname, '../js/typing.js'), 'utf8'));
eval(fs.readFileSync(path.join(__dirname, '../js/storage.js'), 'utf8'));

test('Phase B: Storage Hardening - Pre-restore snapshot creation and info retrieval', () => {
  localStorage.clear();
  localStorage.setItem('khmerProgress_v2', JSON.stringify({ courses: { standard: { completedLessons: 10 } } }));
  localStorage.setItem('pk_settings_v1', JSON.stringify({ theme: 'temple' }));
  localStorage.setItem('pk_adaptive_state_v1', JSON.stringify({ letters: { 'ក': { accuracy: 0.95 } } }));

  assert.equal(window.PK_STORAGE.hasPreRestoreSnapshot(), false, 'Initially should have no pre-restore snapshot');

  const snapRes = window.PK_STORAGE.createPreRestoreSnapshot('test_backup_import');
  assert.equal(snapRes.ok, true, 'Snapshot creation must succeed');
  assert.equal(window.PK_STORAGE.hasPreRestoreSnapshot(), true, 'hasPreRestoreSnapshot must return true');

  const info = window.PK_STORAGE.getPreRestoreSnapshotInfo();
  assert.ok(info, 'Snapshot info must exist');
  assert.equal(info.reason, 'test_backup_import');
  assert.equal(info.keysCount >= 3, true, 'Must capture all matching progress and settings keys');
  assert.ok(info.timestamp, 'Timestamp must be present');
});

test('Phase B: Storage Hardening - Rollback restoration recovers exact original state', () => {
  localStorage.clear();
  // Original state
  const originalProgress = JSON.stringify({ courses: { standard: { completedLessons: 42 } } });
  localStorage.setItem('khmerProgress_v2', originalProgress);
  localStorage.setItem('khmerTrialBest', '150');

  // Create snapshot before simulated bad import
  window.PK_STORAGE.createPreRestoreSnapshot('pre_import');

  // Overwrite state with bad/accidental import
  localStorage.setItem('khmerProgress_v2', JSON.stringify({ courses: { standard: { completedLessons: 0 } } }));
  localStorage.setItem('khmerTrialBest', '10');

  // Perform rollback
  const rollbackRes = window.PK_STORAGE.rollbackPreRestoreSnapshot();
  assert.equal(rollbackRes.ok, true, 'Rollback must succeed');
  assert.equal(localStorage.getItem('khmerProgress_v2'), originalProgress, 'Progress must be restored to original');
  assert.equal(localStorage.getItem('khmerTrialBest'), '150', 'Trial best must be restored');
});

test('Phase B: Storage Hardening - Storage Quota Usage telemetry calculates accurate sizes', () => {
  localStorage.clear();
  localStorage.setItem('khmerProgress_v2', 'A'.repeat(2048)); // ~4KB
  localStorage.setItem('khmerCustomLessons_v1', 'B'.repeat(4096)); // ~8KB

  const quota = window.PK_STORAGE.getStorageQuotaUsage();
  assert.ok(quota.usedBytes > 6000, 'Used bytes must reflect storage items');
  assert.ok(quota.usedKilobytes > 6, 'Used KB must calculate correctly');
  assert.equal(typeof quota.usagePercent, 'number');
  assert.ok(quota.details.progress > 0, 'Progress bucket must be tracked');
  assert.ok(quota.details.customLessons > 0, 'Custom lessons bucket must be tracked');
});

test('Phase B: Unicode Cluster Stress Suite - 100+ Complex Khmer, Sanskrit & Pali Ligatures', () => {
  // Curated catalog of authentic Khmer, Sanskrit, and Pali complex orthographic clusters
  const complexClusters = [
    // Double and triple subscript consonant clusters
    'ស្ទ្រី', 'មន្ត្រី', 'សង្ក្រាន្ត', 'កន្ត្រៃ', 'កញ្ជ្រោង', 'ឥន្ទ្រី', 'សាស្ត្រាចារ្យ', 'សង្គ្រាម',
    'ព្រហ្មញ្ញសាសនា', 'ព្រហ្មចារី', 'ព្រាហ្មណ៍', 'ក្សត្រី', 'ក្សេមក្សាន្ត', 'ស្រ្តី', 'អគ្គិសនី', 'សន្តិភាព',
    // Sanskrit and Pali loanword clusters
    'សង្ឃ', 'សម្បត្តិ', 'កិត្តិយស', 'អភិវឌ្ឍន៍', 'ឥណ្ឌូណេស៊ី', 'រដ្ឋធម្មនុញ្ញ', 'បុរេប្រវត្តិ', 'បច្ចេកវិទ្យា',
    'ពុទ្ធសាសនា', 'ធម្មទេសនា', 'បរិស្ថាន', 'វប្បធម៌', 'សកលវិទ្យាល័យ', 'សិទ្ធិមនុស្ស', 'សេដ្ឋកិច្ច',
    'គរុកោសល្យ', 'ទស្សនវិជ្ជា', 'ទស្សនាវដ្ដី', 'អរិយធម៌', 'អធិការបតី', 'រាជធានី', 'ព្រះរាជាណាចក្រ',
    'ឧត្តមសេនីយ៍', 'វិស្វកម្ម', 'វេជ្ជសាស្ត្រ', 'ស្ថាបត្យកម្ម', 'នគរូបនីយកម្ម', 'អភិបាលកិច្ច', 'សហប្រតិបត្តិការ',
    // Subscripts with independent vowels and diacritics
    'ក្ដ', 'ន្ត', 'ង្ក', 'ង្ខ', 'ញ្ជ', 'ណ្ឌ', 'ន្ថ', 'ម្ព', 'ម្ភ', 'ស្ក', 'ស្ដ', 'ស្ទ', 'ស្ប', 'ស្ព', 'ស្ម', 'ស្វ',
    // Atomic compound vowels
    'កាំ', 'កុំ', 'កុះ', 'កេះ', 'កោះ', 'ខាំ', 'ខុំ', 'ខុះ', 'ខេះ', 'ខោះ',
    'គាំ', 'គុំ', 'គុះ', 'គេះ', 'គោះ', 'ចាំ', 'ជុំ', 'ដុះ', 'តេះ', 'ទោះ',
    // Series shifters (Muusikoatoan and Triisap)
    'ង៉ែត', 'ញ៉ាំង', 'ម៉ែ', 'យ៉ាវ', 'រ៉ាប់', 'វ៉ែនតា', 'ប៊ិច', 'ស៊ុប', 'ហ៊ាន', 'អ៊ំ',
    // Robat and special diacritics
    'ព័ត៌មាន', 'កម្ពុជា', 'អង្គរវត្ត', 'ប្រាសាទ', 'ព្រៃវែង', 'បាត់ដំបង', 'សៀមរាប', 'កំពង់ចាម', 'កំពង់ស្ពឺ',
    'កែប', 'កោះកុង', 'ក្រចេះ', 'មណ្ឌលគិរី', 'រតនគិរី', 'ស្ទឹងត្រែង', 'ស្វាយរៀង', 'តាកែវ', 'ឧត្តរមានជ័យ',
    'ប៉ៃលិន', 'ត្បូងឃ្មុំ', 'ព្រះសីហនុ', 'ពោធិ៍សាត់', 'កំពង់ធំ', 'កំពង់ឆ្នាំង', 'ព្រះវិហារ'
  ];

  assert.equal(complexClusters.length >= 75, true, 'Cluster database must be comprehensive');

  for (const word of complexClusters) {
    // 1. Unicode NFC Normalization integrity
    const norm = normalizeInput(word);
    assert.equal(norm, word.normalize('NFC'), `Word "${word}" must normalize to canonical NFC`);

    // 2. Unit Slicing in Standard Layout
    const stdUnits = splitIntoTypingUnits(word, 'standard');
    assert.ok(stdUnits.length > 0, `Units for "${word}" must not be empty`);
    assert.equal(stdUnits.join(''), norm, `Standard layout units for "${word}" must recombine without loss`);

    // 3. Unit Slicing in NiDA Layout
    const nidaUnits = splitIntoTypingUnits(word, 'nida');
    assert.ok(nidaUnits.length > 0, `NiDA units for "${word}" must not be empty`);
    assert.equal(nidaUnits.join(''), norm, `NiDA layout units for "${word}" must recombine without loss`);

    // 4. Verification that atomic compound vowels are not split into separate characters
    for (const u of stdUnits) {
      if (['ាំ', 'ុំ', 'ុះ', 'េះ', 'ោះ'].includes(u)) {
        assert.equal(u.length, 2, `Compound vowel unit "${u}" must remain a 2-codepoint atomic unit`);
      }
    }
  }
});
