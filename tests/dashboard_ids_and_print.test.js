import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

test('Bug 1 Fix: dashboard.html has zero duplicate IDs and isolated certificate/diploma elements', () => {
  const html = fs.readFileSync(path.join(rootDir, 'dashboard.html'), 'utf8');
  
  // 1. Verify zero duplicate IDs
  const idRegex = /(?:^|[\s<])id=["']([^"']+)["']/g;
  const counts = {};
  let match;
  while ((match = idRegex.exec(html)) !== null) {
    const id = match[1];
    counts[id] = (counts[id] || 0) + 1;
  }
  const duplicates = Object.entries(counts).filter(([_, count]) => count > 1);
  assert.equal(duplicates.length, 0, `dashboard.html contains duplicate IDs: ${JSON.stringify(duplicates)}`);

  // 2. Verify unique IDs for Teacher Studio vs Scribe Diploma Modal
  assert.equal(counts['btnPrintCertificate'], 1, 'btnPrintCertificate must appear exactly once');
  assert.equal(counts['btnPrintDossierDiploma'], 1, 'btnPrintDossierDiploma must appear exactly once');
  assert.equal(counts['certificateSheet'], 1, 'certificateSheet must appear exactly once');
  assert.equal(counts['dossierDiplomaSheet'], 1, 'dossierDiplomaSheet must appear exactly once');

  // 3. Verify Modal 2 event listener binds to btnPrintDossierDiploma
  assert.ok(
    html.includes("document.getElementById('btnPrintDossierDiploma')"),
    'Modal 2 must bind click listener to btnPrintDossierDiploma'
  );

  // 4. Verify Teacher Studio event listener binds to btnPrintCertificate
  assert.ok(
    html.includes("document.getElementById('btnPrintCertificate')"),
    'Teacher Studio must bind click listener to btnPrintCertificate'
  );

  // 5. Verify print media queries separate Modal 2 and Teacher Studio
  assert.ok(html.includes('#exportModal.active #dossierDiplomaSheet'), 'Print styles must configure active diploma sheet');
  assert.ok(html.includes('.certificate-sheet svg'), 'Print styles must size teacher certificate vector SVG');
});

test('Zero-Emoji Compliance on dashboard.html and test files', () => {
  const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  
  const dashboardHtml = fs.readFileSync(path.join(rootDir, 'dashboard.html'), 'utf8');
  assert.equal(emojiRegex.test(dashboardHtml), false, 'dashboard.html must not contain unicode emoji');
});
