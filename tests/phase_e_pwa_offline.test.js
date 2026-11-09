// tests/phase_e_pwa_offline.test.js
// Phase E: Air-Gapped PWA, Service Worker & Offline Caching Automated Test Suite

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('Phase E: PWA Manifest - Standard metadata, display, and icon specifications', () => {
  const manifestPath = path.join(__dirname, '../manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'manifest.json must exist');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  assert.equal(manifest.name, 'PK Khmer Type', 'Manifest name must be PK Khmer Type');
  assert.equal(manifest.display, 'standalone', 'PWA display mode must be standalone');
  assert.equal(manifest.start_url, './index.html', 'start_url must point to ./index.html');
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 4, 'Manifest must provide multiple icon sizes');

  // Verify key icon assets exist on disk
  for (const icon of manifest.icons) {
    if (icon.src && !icon.src.startsWith('http')) {
      const iconPath = path.join(__dirname, '..', icon.src);
      assert.ok(fs.existsSync(iconPath), `Manifest icon asset "${icon.src}" must exist on disk`);
    }
  }
});

test('Phase E: Service Worker - sw.js syntax, precache assets, and offline strategies', () => {
  const swPath = path.join(__dirname, '../sw.js');
  assert.ok(fs.existsSync(swPath), 'sw.js must exist');
  const swCode = fs.readFileSync(swPath, 'utf8');

  // 1. Verify cache version
  assert.ok(swCode.includes('CACHE_VERSION = "pk-khmer-type-v99"'), 'sw.js must use v99 cache version');

  // 2. Verify critical shell precache assets
  const criticalAssets = [
    'index.html', 'dashboard.html', 'welcome.html', 'manifest.json',
    'css/base.css', 'css/keyboard.css', 'css/typing.css', 'css/lessons.css',
    'js/typing.js', 'js/keyboard.js', 'js/lessons.js', 'js/storage.js', 'js/adaptive.js',
    'js/welcome.js', 'js/swarm-cursors.js'
  ];
  for (const asset of criticalAssets) {
    assert.ok(swCode.includes(`"${asset}"`), `sw.js precache list must include "${asset}"`);
  }

  // 3. Verify event listeners for offline lifecycle
  assert.ok(swCode.includes('addEventListener("install"'), 'sw.js must handle install event');
  assert.ok(swCode.includes('addEventListener("activate"'), 'sw.js must handle activate event');
  assert.ok(swCode.includes('addEventListener("fetch"'), 'sw.js must handle fetch event');
  assert.ok(swCode.includes('cache: "no-cache"'), 'sw.js must revalidate same-origin assets cleanly on soft reload');

  // 4. Verify stale-while-revalidate and offline index.html fallback
  assert.ok(swCode.includes('caches.match("index.html")') || swCode.includes('caches.match("./index.html")'),
    'sw.js must provide fallback to cached index.html when offline');
});

test('Phase E: HTML Entry Points - Service worker registration in index.html and dashboard.html', () => {
  const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  assert.ok(indexHtml.includes("navigator.serviceWorker.register('./sw.js')"),
    'index.html must register ./sw.js service worker');

  const dashboardHtml = fs.readFileSync(path.join(__dirname, '../dashboard.html'), 'utf8');
  assert.ok(dashboardHtml.includes("navigator.serviceWorker.register('./sw.js')"),
    'dashboard.html must register ./sw.js service worker');
});
