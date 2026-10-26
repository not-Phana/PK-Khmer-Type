/**
 * PK Khmer Type — Automated Test Suite for Connection-Agnostic Offline Resilience
 * Run with: node --test tests/offline_resilience.test.js
 *
 * Validates:
 * 1. Offline Bridge (PKOfflineBridge) network state tracking and event reactions
 * 2. Local-first progress export and safe import (with prototype pollution defense)
 * 3. Service Worker (sw.js) precache manifest completeness and syntax validity
 * 4. Local Cambodian system font fallback stacks in CSS
 * 5. Topbar offline status pill and Offline Hub modal DOM accessibility
 * 6. Strict Zero-Emoji compliance across all offline assets
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');

/* ============================================================
   Mock LocalStorage Factory
   ============================================================ */
function createMockLocalStorage() {
  const map = new Map();
  return {
    getItem(k) {
      return map.has(String(k)) ? map.get(String(k)) : null;
    },
    setItem(k, v) {
      map.set(String(k), String(v));
    },
    removeItem(k) {
      map.delete(String(k));
    },
    clear() {
      map.clear();
    },
    get length() {
      return map.size;
    },
    key(idx) {
      return Array.from(map.keys())[idx] || null;
    }
  };
}

/* ============================================================
   1. Offline Bridge Module Tests
   ============================================================ */
test('1.1 PKOfflineBridge exports complete public API in Node and browser environments', () => {
  const PKOfflineBridge = require(path.join(ROOT, 'js', 'offline-bridge.js'));
  assert.ok(PKOfflineBridge, 'PKOfflineBridge should be defined');
  assert.equal(typeof PKOfflineBridge.isOnline, 'function');
  assert.equal(typeof PKOfflineBridge.getPendingQueueCount, 'function');
  assert.equal(typeof PKOfflineBridge.collectLocalDataBundle, 'function');
  assert.equal(typeof PKOfflineBridge.exportLocalBackup, 'function');
  assert.equal(typeof PKOfflineBridge.importLocalBackup, 'function');
  assert.equal(typeof PKOfflineBridge.handleOnline, 'function');
  assert.equal(typeof PKOfflineBridge.handleOffline, 'function');
});

test('1.2 PKOfflineBridge responds dynamically to online and offline transitions', () => {
  const PKOfflineBridge = require(path.join(ROOT, 'js', 'offline-bridge.js'));

  PKOfflineBridge.handleOffline();
  assert.equal(PKOfflineBridge.isOnline(), false, 'isOnline should be false after handleOffline()');

  PKOfflineBridge.handleOnline();
  assert.equal(PKOfflineBridge.isOnline(), true, 'isOnline should be true after handleOnline()');
});

test('1.3 PKOfflineBridge collects all local progress, custom lessons, and settings into backup bundle', () => {
  const mockStorage = createMockLocalStorage();
  mockStorage.setItem('khmerProgress_v2', JSON.stringify({ 'std_l1': { completed: true, bestWpm: 45 } }));
  mockStorage.setItem('khmerGlobalStats', JSON.stringify({ totalCharacters: 1200 }));
  mockStorage.setItem('khmerKeyLayout', 'nida');
  mockStorage.setItem('khmerTheme', 'sepia');

  // Run in sandboxed context with mock localStorage
  const bridgeCode = fs.readFileSync(path.join(ROOT, 'js', 'offline-bridge.js'), 'utf8');
  const sandbox = {
    module: { exports: {} },
    exports: {},
    localStorage: mockStorage,
    navigator: { onLine: false }
  };
  vm.createContext(sandbox);
  vm.runInContext(bridgeCode, sandbox);
  const sandboxedBridge = sandbox.module.exports;

  const bundle = sandboxedBridge.collectLocalDataBundle();
  assert.ok(bundle, 'Bundle should be returned');
  assert.equal(bundle.app, 'PK Khmer Type');
  assert.equal(bundle.version, '2.4.0-beta');
  assert.equal(bundle.offline, true);
  assert.ok(bundle.deviceData['khmerProgress_v2'], 'Should preserve khmerProgress_v2');
  assert.equal(bundle.deviceData['khmerProgress_v2'].std_l1.bestWpm, 45);
  assert.equal(bundle.deviceData['khmerKeyLayout'], 'nida');
  assert.equal(bundle.deviceData['khmerTheme'], 'sepia');
});

test('1.4 PKOfflineBridge.importLocalBackup restores data cleanly and blocks prototype pollution', () => {
  const mockStorage = createMockLocalStorage();
  const bridgeCode = fs.readFileSync(path.join(ROOT, 'js', 'offline-bridge.js'), 'utf8');
  const sandbox = {
    module: { exports: {} },
    exports: {},
    localStorage: mockStorage,
    navigator: { onLine: true }
  };
  vm.createContext(sandbox);
  vm.runInContext(bridgeCode, sandbox);
  const sandboxedBridge = sandbox.module.exports;

  // Valid backup
  const validPayload = JSON.stringify({
    app: 'PK Khmer Type',
    deviceData: {
      khmerKeyLayout: 'standard',
      khmerTrialBest: 120,
      khmerLessonBest_std_l1: 52
    }
  });

  const res = sandboxedBridge.importLocalBackup(validPayload);
  assert.equal(res.ok, true);
  assert.equal(res.restoredCount, 3);
  assert.equal(mockStorage.getItem('khmerKeyLayout'), 'standard');
  assert.equal(mockStorage.getItem('khmerTrialBest'), '120');

  // Security: Prototype pollution payload
  const maliciousPayload = '{"__proto__": {"admin": true}, "deviceData": {"hack": 1}}';
  const protoRes = sandboxedBridge.importLocalBackup(maliciousPayload);
  assert.equal(protoRes.ok, false, 'Should reject payload containing __proto__');

  // Malformed JSON
  const invalidJson = '{ not valid json }';
  const malformedRes = sandboxedBridge.importLocalBackup(invalidJson);
  assert.equal(malformedRes.ok, false, 'Should reject malformed JSON');
});

/* ============================================================
   2. Service Worker (sw.js) Precache Manifest & Syntax
   ============================================================ */
test('2.1 Service Worker sw.js exists, has valid syntax, and references versioned cache', () => {
  const swPath = path.join(ROOT, 'sw.js');
  assert.ok(fs.existsSync(swPath), 'sw.js must exist at root of workspace');

  const swContent = fs.readFileSync(swPath, 'utf8');
  assert.doesNotThrow(() => {
    new vm.Script(swContent);
  }, 'sw.js must be syntactically valid JavaScript');

  assert.ok(swContent.includes('CACHE_VERSION'), 'sw.js must declare a CACHE_VERSION');
  assert.ok(swContent.includes('FONT_CACHE'), 'sw.js must declare a dedicated font cache');
  assert.ok(swContent.includes('fonts.gstatic.com'), 'sw.js must intercept Google Font files');
  assert.ok(swContent.includes('supabase.co'), 'sw.js must bypass dynamic cloud sync endpoints');
});

test('2.2 Every precache asset listed in sw.js physically exists in the project', () => {
  const swContent = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  const precacheMatch = swContent.match(/PRECACHE_ASSETS\s*=\s*\[([\s\S]*?)\];/);
  assert.ok(precacheMatch, 'PRECACHE_ASSETS array must be found in sw.js');

  const listStr = precacheMatch[1];
  const items = listStr
    .split(',')
    .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
    .filter((s) => s.length > 0 && s !== './');

  assert.ok(items.length >= 40, `PRECACHE_ASSETS should contain at least 40 files (found ${items.length})`);

  const missingFiles = [];
  for (const item of items) {
    const cleanPath = item.split('?')[0];
    const fullPath = path.join(ROOT, cleanPath);
    if (!fs.existsSync(fullPath)) {
      missingFiles.push(item);
    }
  }

  assert.deepEqual(missingFiles, [], `All precached assets must exist on disk: ${missingFiles.join(', ')}`);
});

/* ============================================================
   3. Local Font Fallback Stacks in CSS
   ============================================================ */
test('3.1 css/base.css defines native Cambodian system font fallbacks in :root', () => {
  const baseCss = fs.readFileSync(path.join(ROOT, 'css', 'base.css'), 'utf8');

  assert.ok(baseCss.includes('--font-khmer'), 'css/base.css should declare --font-khmer in :root');
  assert.ok(baseCss.includes('Khmer OS Siemreap'), '--font-khmer must include Windows Khmer OS Siemreap');
  assert.ok(baseCss.includes('Noto Sans Khmer'), '--font-khmer must include Noto Sans Khmer');
  assert.ok(baseCss.includes('sans-serif'), '--font-khmer must end with generic sans-serif');
  assert.ok(baseCss.includes('--font-sans'), 'css/base.css should declare --font-sans in :root');
  assert.ok(baseCss.includes('--font-mono'), 'css/base.css should declare --font-mono in :root');
});

test('3.2 css/base.css contains complete styles for .pk-offline-pill and .pk-offline-card', () => {
  const baseCss = fs.readFileSync(path.join(ROOT, 'css', 'base.css'), 'utf8');

  assert.ok(baseCss.includes('.pk-offline-pill'), 'css/base.css must contain .pk-offline-pill');
  assert.ok(baseCss.includes('.pk-offline-pill.offline-active'), 'css/base.css must style offline-active state');
  assert.ok(baseCss.includes('.pk-offline-pill.online-restored'), 'css/base.css must style online-restored state');
  assert.ok(baseCss.includes('.pk-offline-card'), 'css/base.css must contain .pk-offline-card');
  assert.ok(baseCss.includes('.pk-offline-metrics-grid'), 'css/base.css must style metrics grid');
});

/* ============================================================
   4. DOM & CSP Verification Across HTML Entry Points
   ============================================================ */
test('4.1 index.html contains #pkOfflineIndicator, #pkOfflineModal, and includes offline-bridge.js', () => {
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

  assert.ok(indexHtml.includes('id="pkOfflineIndicator"'), 'index.html must include #pkOfflineIndicator button');
  assert.ok(indexHtml.includes('id="pkOfflineModal"'), 'index.html must include #pkOfflineModal dialog');
  assert.ok(indexHtml.includes('id="pkOfflineExportBtn"'), 'index.html must include #pkOfflineExportBtn');
  assert.ok(indexHtml.includes('id="pkOfflineImportBtn"'), 'index.html must include #pkOfflineImportBtn');
  assert.ok(indexHtml.includes('js/offline-bridge.js'), 'index.html must load js/offline-bridge.js');
  assert.ok(indexHtml.includes("worker-src 'self' blob:;"), 'index.html CSP must grant worker-src');
});

test('4.2 welcome.html and 404.html include worker-src CSP for Service Worker compatibility', () => {
  const welcomeHtml = fs.readFileSync(path.join(ROOT, 'welcome.html'), 'utf8');
  assert.ok(welcomeHtml.includes("worker-src 'self' blob:;"), 'welcome.html CSP must grant worker-src');

  const errorHtml = fs.readFileSync(path.join(ROOT, '404.html'), 'utf8');
  assert.ok(errorHtml.includes("worker-src 'self' blob:;"), '404.html CSP must grant worker-src');
});

test('4.3 GitHub Actions deploy workflow stages sw.js for deployment', () => {
  const deployYaml = fs.readFileSync(path.join(ROOT, '.github', 'workflows', 'deploy.yml'), 'utf8');
  assert.ok(deployYaml.includes('[ -f sw.js ] && cp sw.js _site/'), 'deploy.yml must stage sw.js to _site/');
  assert.ok(deployYaml.includes('[ -f sw.js ] && node --check sw.js'), 'deploy.yml must validate sw.js syntax');
});

/* ============================================================
   5. Strict Zero-Emoji Policy Across All Modified Files
   ============================================================ */
test('5.1 Strict Zero-Emoji Policy: Verified 0 Unicode emojis across all offline files', () => {
  const filesToCheck = [
    path.join(ROOT, 'sw.js'),
    path.join(ROOT, 'js', 'offline-bridge.js'),
    path.join(ROOT, 'js', 'storage.js'),
    path.join(ROOT, 'css', 'base.css'),
    path.join(ROOT, 'index.html'),
    path.join(ROOT, 'welcome.html'),
    path.join(ROOT, '404.html')
  ];

  // Comprehensive emoji regex matching pictographs, emoticons, symbols, transport, supplemental
  const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F1E6}-\u{1F1FF}]/u;

  for (const filePath of filesToCheck) {
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(EMOJI_REGEX);
      assert.equal(
        match,
        null,
        `Strict Zero-Emoji Violation in ${path.relative(ROOT, filePath)} line ${i + 1}: found "${match ? match[0] : ''}". Use inline SVG instead.`
      );
    }
  }
});
