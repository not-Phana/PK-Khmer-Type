import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}]/u;

test('Engine Scope & Scale Matrix: Live Real-Time Telemetry Stream Deck Markup', () => {
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  const reiHtml = fs.readFileSync('rei.html', 'utf8');

  for (const [name, content] of [['index.html', indexHtml], ['rei.html', reiHtml]]) {
    assert.ok(content.includes('id="scaleTelemetryLiveDeck"'), `${name} missing #scaleTelemetryLiveDeck`);
    assert.ok(content.includes('id="scaleLiveFpsTicker"'), `${name} missing #scaleLiveFpsTicker`);
    assert.ok(content.includes('id="scaleLiveFpsVal"'), `${name} missing #scaleLiveFpsVal`);
    assert.ok(content.includes('id="scaleLiveLatencyVal"'), `${name} missing #scaleLiveLatencyVal`);
    assert.ok(content.includes('id="scaleLiveUptime"'), `${name} missing #scaleLiveUptime`);
    assert.ok(content.includes('id="scaleLiveMemory"'), `${name} missing #scaleLiveMemory`);
    assert.ok(content.includes('id="scaleLiveDomNodes"'), `${name} missing #scaleLiveDomNodes`);
    assert.ok(content.includes('id="scaleLiveTypingKeys"'), `${name} missing #scaleLiveTypingKeys`);
    assert.ok(content.includes('id="scaleLiveTypingSpeed"'), `${name} missing #scaleLiveTypingSpeed`);
    assert.ok(content.includes('id="scaleStatLoc"'), `${name} missing #scaleStatLoc`);
    assert.ok(content.includes('id="scaleStatLessons"'), `${name} missing #scaleStatLessons`);
    assert.ok(content.includes('id="scaleStatTests"'), `${name} missing #scaleStatTests`);
  }
});

test('Engine Scope & Scale Matrix: Telemetry JavaScript Engine Functions', () => {
  const settingsJs = fs.readFileSync('js/settings.js', 'utf8');

  assert.ok(settingsJs.includes('function startScaleLiveTelemetry('), 'js/settings.js missing startScaleLiveTelemetry');
  assert.ok(settingsJs.includes('function stopScaleLiveTelemetry('), 'js/settings.js missing stopScaleLiveTelemetry');
  assert.ok(settingsJs.includes('function updateScaleLiveTelemetry('), 'js/settings.js missing updateScaleLiveTelemetry');
  assert.ok(settingsJs.includes('function fpsLoop('), 'js/settings.js missing fpsLoop');
  assert.ok(settingsJs.includes('function countUpValue('), 'js/settings.js missing countUpValue');
  assert.ok(settingsJs.includes('window.startScaleLiveTelemetry = startScaleLiveTelemetry;'), 'js/settings.js not exporting startScaleLiveTelemetry');
  assert.ok(settingsJs.includes('window.stopScaleLiveTelemetry = stopScaleLiveTelemetry;'), 'js/settings.js not exporting stopScaleLiveTelemetry');
});

test('Engine Scope & Scale Matrix: Strict Zero-Emoji Compliance', () => {
  const filesToCheck = [
    'index.html',
    'rei.html',
    'js/settings.js',
    'css/lessons.css',
    'tests/scale_matrix_telemetry.test.js'
  ];

  for (const relPath of filesToCheck) {
    const content = fs.readFileSync(relPath, 'utf8');
    const match = content.match(emojiRegex);
    assert.equal(match, null, `Zero-Emoji violation in ${relPath}: ${match ? match[0] : ''}`);
  }
});
