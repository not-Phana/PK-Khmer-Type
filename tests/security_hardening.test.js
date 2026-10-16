// tests/security_hardening.test.js
// Verification suite for PK Khmer Type security hardening defenses:
// Content Security Policy (CSP), Referrer-Policy, nosniff, anti-clickjacking,
// XSS escaping, prototype pollution guards, URL sanitization, and Zero-Emoji compliance.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');

// Helper to extract a balanced function from source without fragile regular expressions
function extractFunction(source, functionName) {
  const startIdx = source.indexOf(`function ${functionName}(`);
  assert.ok(startIdx !== -1, `Function ${functionName} must be defined`);
  let depth = 0;
  let started = false;
  let endIdx = -1;
  for (let i = startIdx; i < source.length; i++) {
    if (source[i] === '{') {
      depth++;
      started = true;
    } else if (source[i] === '}') {
      depth--;
      if (started && depth === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }
  assert.ok(endIdx !== -1, `Could not parse boundaries for ${functionName}`);
  return source.slice(startIdx, endIdx);
}

test('Security 1.1: Content Security Policy (CSP) meta tag exists in all HTML entry points', () => {
  const htmlFiles = [
    'index.html',
    'launch/index.html',
    'Documents/index.html',
    'docs/index.html'
  ];

  htmlFiles.forEach((file) => {
    const filePath = path.join(rootDir, file);
    assert.ok(fs.existsSync(filePath), `HTML entry point must exist: ${file}`);
    const content = fs.readFileSync(filePath, 'utf8');

    assert.ok(
      content.includes('http-equiv="Content-Security-Policy"'),
      `File ${file} must include Content-Security-Policy meta tag`
    );
    assert.ok(
      content.includes("default-src 'self'"),
      `File ${file} must include default-src 'self' in CSP`
    );
    assert.ok(
      content.includes("object-src 'none'"),
      `File ${file} must include object-src 'none' in CSP`
    );
  });
});

test('Security 1.2: Referrer-Policy and nosniff headers exist across all HTML entry points', () => {
  const htmlFiles = [
    'index.html',
    'launch/index.html',
    'Documents/index.html',
    'docs/index.html'
  ];

  htmlFiles.forEach((file) => {
    const filePath = path.join(rootDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    assert.ok(
      content.includes('name="referrer"') && content.includes('strict-origin-when-cross-origin'),
      `File ${file} must enforce strict-origin-when-cross-origin referrer policy`
    );
    assert.ok(
      content.includes('http-equiv="X-Content-Type-Options"') && content.includes('nosniff'),
      `File ${file} must enforce X-Content-Type-Options: nosniff`
    );
  });
});

test('Security 1.3: Anti-clickjacking frame-busting defense in js/app.js', () => {
  const appCode = fs.readFileSync(path.join(rootDir, 'js/app.js'), 'utf8');

  assert.ok(
    appCode.includes('preventClickjacking') || appCode.includes('window.top !== window.self'),
    'js/app.js must provide frame-busting defense'
  );
  assert.ok(
    appCode.includes('document.documentElement.style.display = "none"') ||
    appCode.includes("document.documentElement.style.display = 'none'"),
    'js/app.js must conceal document if framed by untrusted cross-origin ancestor'
  );
});

test('Security 1.4: HTML escaping (escapeHtml) in js/storage.js escapes & < > " \' and neutralizes breakouts', () => {
  const storageCode = fs.readFileSync(path.join(rootDir, 'js/storage.js'), 'utf8');
  const fnCode = extractFunction(storageCode, 'escapeHtml');

  const sandbox = {};
  vm.runInNewContext(`${fnCode}; result = escapeHtml;`, sandbox);
  const escapeHtml = sandbox.result;

  assert.equal(escapeHtml('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
  assert.equal(escapeHtml('" onmouseover="alert(1)'), '&quot; onmouseover=&quot;alert(1)');
  assert.equal(escapeHtml("' onclick='bad()"), '&#39; onclick=&#39;bad()');
  assert.equal(escapeHtml('A & B'), 'A &amp; B');
  assert.equal(escapeHtml(null), '');
  assert.equal(escapeHtml(undefined), '');
});

test('Security 1.5: formatCloudFileInfo sanitizes rawName and smartTitle against XSS', () => {
  const storageCode = fs.readFileSync(path.join(rootDir, 'js/storage.js'), 'utf8');

  assert.ok(
    storageCode.includes('safeRawName: escapeHtml(rawName)'),
    'formatCloudFileInfo must sanitize safeRawName with escapeHtml'
  );
  assert.ok(
    storageCode.includes('safeTitle: escapeHtml(smartTitle)'),
    'formatCloudFileInfo must sanitize safeTitle with escapeHtml'
  );
  assert.ok(
    storageCode.includes('tagText: escapeHtml(tagText)'),
    'formatCloudFileInfo must sanitize tagText with escapeHtml'
  );
});

test('Security 1.6: Prototype pollution guards and size limits in importProgressInput (js/storage.js)', () => {
  const storageCode = fs.readFileSync(path.join(rootDir, 'js/storage.js'), 'utf8');

  assert.ok(
    storageCode.includes('__proto__') && storageCode.includes('constructor') && storageCode.includes('prototype'),
    'importProgressInput must explicitly check and reject __proto__, constructor, and prototype'
  );
  assert.ok(
    storageCode.includes('10 * 1024 * 1024'),
    'importProgressInput must reject files exceeding 10MB limit'
  );
  assert.ok(
    storageCode.includes('SAFE_PREFIXES') || storageCode.includes('startsWith'),
    'importProgressInput must enforce safe storage key prefixes'
  );
});

test('Security 1.7: Prototype pollution guards and lesson validation in restoreUserBackupSnapshot (js/cloud-sync.js)', () => {
  const cloudSyncCode = fs.readFileSync(path.join(rootDir, 'js/cloud-sync.js'), 'utf8');

  assert.ok(
    cloudSyncCode.includes('sk !== "__proto__"') &&
    cloudSyncCode.includes('sk !== "constructor"') &&
    cloudSyncCode.includes('ALLOWED_SETTING_KEYS.indexOf(sk) !== -1'),
    'restoreUserBackupSnapshot must filter settings through ALLOWED_SETTING_KEYS and reject prototype pollution'
  );
  assert.ok(
    cloudSyncCode.includes('lid !== "__proto__"') &&
    cloudSyncCode.includes('validateLessonId(lid)'),
    'restoreUserBackupSnapshot must validate lesson IDs via validateLessonId'
  );
});

test('Security 1.8: isSafeImageUrl in js/settings.js validates safe schemes and blocks malicious vectors', () => {
  const settingsCode = fs.readFileSync(path.join(rootDir, 'js/settings.js'), 'utf8');
  const fnCode = extractFunction(settingsCode, 'isSafeImageUrl');

  const sandbox = {
    window: { location: { origin: 'https://not-phana.github.io' } },
    URL: global.URL,
    console: console
  };

  vm.runInNewContext(`${fnCode}; result = isSafeImageUrl;`, sandbox);
  const isSafeImageUrl = sandbox.result;

  // Safe URLs
  assert.equal(isSafeImageUrl('https://images.unsplash.com/photo-test.jpg'), true);
  assert.equal(isSafeImageUrl('http://localhost:3000/assets/wallpaper.png'), true);
  assert.equal(isSafeImageUrl('assets/wallpapers/angkor.jpg'), true);
  assert.equal(isSafeImageUrl('./assets/wallpapers/angkor.jpg'), true);
  assert.equal(isSafeImageUrl('/assets/wallpapers/angkor.jpg'), true);
  assert.equal(isSafeImageUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY44YAAAAASUVORK5CYII='), true);

  // Unsafe / Malicious URLs
  assert.equal(isSafeImageUrl('javascript:alert(1)'), false);
  assert.equal(isSafeImageUrl('data:text/html,<script>alert(1)</script>'), false);
  assert.equal(isSafeImageUrl('https://evil.com/pic.jpg"); display:none; background:url("'), false);
  assert.equal(isSafeImageUrl("https://evil.com/pic.jpg');"), false);
  assert.equal(isSafeImageUrl('ftp://evil.com/pic.jpg'), false);
  assert.equal(isSafeImageUrl(''), false);
  assert.equal(isSafeImageUrl(null), false);
  assert.equal(isSafeImageUrl(undefined), false);
});

test('Security 1.9: Strict Zero-Emoji compliance across all modified and security-critical files', () => {
  const targetFiles = [
    'index.html',
    'launch/index.html',
    'Documents/index.html',
    'docs/index.html',
    'js/app.js',
    'js/storage.js',
    'js/settings.js',
    'js/cloud-sync.js',
    'tests/security_hardening.test.js'
  ];

  // Regex for Emoji characters (excluding standard Khmer Unicode ranges 1780-17FF, 19E0-19FF)
  const emojiPattern = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/u;

  targetFiles.forEach((file) => {
    const filePath = path.join(rootDir, file);
    assert.ok(fs.existsSync(filePath), `Target file must exist: ${file}`);
    const content = fs.readFileSync(filePath, 'utf8');
    const match = emojiPattern.exec(content);
    assert.equal(
      match,
      null,
      `File ${file} contains forbidden emoji character: ${match ? match[0] : ''}`
    );
  });
});
