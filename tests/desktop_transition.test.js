// tests/desktop_transition.test.js
// Verification suite for Windows Virtual Desktop Cross-Document Transitions:
// @view-transition opt-in, reduced-motion opt-out, directional type routing,
// clickable hero edition switcher, render-blocking setup, and Zero-Emoji policy.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA70}-\u{1FAFF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;

test('Desktop Transition 1.1: css/desktop-transition.css configures @view-transition, reduced-motion opt-out, and directional keyframes', () => {
  const css = fs.readFileSync(path.join(rootDir, 'css/desktop-transition.css'), 'utf8');

  assert.match(css, /@view-transition\s*\{[\s\S]*?navigation:\s*auto\s*;/, 'Must opt in to @view-transition { navigation: auto; }');
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?@view-transition\s*\{[\s\S]*?navigation:\s*none\s*;/, 'Must disable @view-transition under prefers-reduced-motion: reduce');
  assert.ok(css.includes(':active-view-transition-type(desktop-next)'), 'Must handle desktop-next transition type');
  assert.ok(css.includes(':active-view-transition-type(desktop-prev)'), 'Must handle desktop-prev transition type');
  assert.ok(css.includes('@keyframes pkWinDesktopOutLeft'), 'Must define pkWinDesktopOutLeft keyframes');
  assert.ok(css.includes('@keyframes pkWinDesktopInRight'), 'Must define pkWinDesktopInRight keyframes');
  assert.ok(css.includes('@keyframes pkWinDesktopOutRight'), 'Must define pkWinDesktopOutRight keyframes');
  assert.ok(css.includes('@keyframes pkWinDesktopInLeft'), 'Must define pkWinDesktopInLeft keyframes');
  assert.ok(css.includes('pk-dt-leaving-next') && css.includes('pk-dt-entering-next'), 'Must provide progressive fallback transition classes');
});

test('Desktop Transition 1.2: js/desktop-transition.js resolves Windows Virtual Desktop switch direction across all workspace pages', () => {
  const jsCode = fs.readFileSync(path.join(rootDir, 'js/desktop-transition.js'), 'utf8');

  const sandbox = {
    URL,
    Date,
    setTimeout: () => 1,
    clearTimeout: () => {},
    matchMedia: () => ({ matches: false }),
    location: {
      href: 'https://not-phana.github.io/PK-Khmer-Type/index.html',
      pathname: '/PK-Khmer-Type/index.html',
      protocol: 'https:',
      origin: 'https://not-phana.github.io'
    },
    localStorage: { getItem: () => null, setItem: () => {} },
    sessionStorage: {
      _d: {},
      getItem(k) { return this._d[k] || null; },
      setItem(k, v) { this._d[k] = String(v); },
      removeItem(k) { delete this._d[k]; }
    },
    document: {
      documentElement: {
        classList: { contains: () => false, add: () => {}, remove: () => {} }
      },
      addEventListener: () => {}
    },
    addEventListener: () => {},
    removeEventListener: () => {}
  };
  sandbox.window = sandbox;

  vm.runInNewContext(jsCode, sandbox);
  const dt = sandbox.PKDesktopTransition;
  assert.ok(dt, 'window.PKDesktopTransition must be exposed');

  // Studio Pro <-> Rei directionality (root & /rei/ subdir)
  assert.equal(
    dt.resolveDesktopDirection('https://not-phana.github.io/PK-Khmer-Type/index.html', 'https://not-phana.github.io/PK-Khmer-Type/rei.html'),
    'desktop-next',
    'Studio Pro -> rei.html must slide forward (desktop-next)'
  );
  assert.equal(
    dt.resolveDesktopDirection('https://not-phana.github.io/PK-Khmer-Type/', 'https://not-phana.github.io/PK-Khmer-Type/rei/'),
    'desktop-next',
    'Root studio / -> /rei/ must slide forward (desktop-next)'
  );
  assert.equal(
    dt.resolveDesktopDirection('https://not-phana.github.io/PK-Khmer-Type/rei.html', 'https://not-phana.github.io/PK-Khmer-Type/index.html'),
    'desktop-prev',
    'rei.html -> Studio Pro must slide backward (desktop-prev)'
  );
  assert.equal(
    dt.resolveDesktopDirection('https://not-phana.github.io/PK-Khmer-Type/rei/index.html', 'https://not-phana.github.io/PK-Khmer-Type/index.html'),
    'desktop-prev',
    '/rei/index.html -> Studio Pro must slide backward (desktop-prev)'
  );

  // Welcome -> Studio Pro -> Dashboard -> Documents strip order
  assert.equal(
    dt.resolveDesktopDirection('https://not-phana.github.io/PK-Khmer-Type/welcome.html', 'https://not-phana.github.io/PK-Khmer-Type/index.html'),
    'desktop-next',
    'Welcome -> Studio Pro must slide forward (desktop-next)'
  );
  assert.equal(
    dt.resolveDesktopDirection('https://not-phana.github.io/PK-Khmer-Type/index.html', 'https://not-phana.github.io/PK-Khmer-Type/welcome.html'),
    'desktop-prev',
    'Studio Pro -> Welcome must slide backward (desktop-prev)'
  );
  assert.equal(
    dt.resolveDesktopDirection('https://not-phana.github.io/PK-Khmer-Type/dashboard.html', 'https://not-phana.github.io/PK-Khmer-Type/index.html'),
    'desktop-prev',
    'Dashboard -> Studio Pro must slide backward (desktop-prev)'
  );

  // Same page navigation should not trigger horizontal desktop slide
  assert.equal(
    dt.resolveDesktopDirection('https://not-phana.github.io/PK-Khmer-Type/index.html', 'https://not-phana.github.io/PK-Khmer-Type/index.html?lesson=nida_1'),
    null,
    'Same page query change must return null'
  );
});

test('Desktop Transition 1.3: HTML pages link desktop-transition CSS, blocking-render script, rel="expect", and clickable edition switcher', () => {
  const pages = [
    ['index.html', 'css/desktop-transition.css', 'js/desktop-transition.js', '#keyboard'],
    ['rei.html', 'css/desktop-transition.css', 'js/desktop-transition.js', '#keyboard'],
    ['rei/index.html', '../css/desktop-transition.css', '../js/desktop-transition.js', '#keyboard'],
    ['welcome.html', 'css/desktop-transition.css', 'js/desktop-transition.js', '#hero3dStage'],
    ['dashboard.html', 'css/desktop-transition.css', 'js/desktop-transition.js', '#spotlightCard'],
    ['Documents/index.html', '../css/desktop-transition.css', '../js/desktop-transition.js', '#docsSidebar'],
    ['launch/index.html', '../css/desktop-transition.css', '../js/desktop-transition.js', '#top'],
    ['motion-graphic.html', 'css/desktop-transition.css', 'js/desktop-transition.js', '#mgStageCard']
  ];

  for (const [file, cssHref, jsSrc, expectHref] of pages) {
    const html = fs.readFileSync(path.join(rootDir, file), 'utf8');
    assert.ok(html.includes('@view-transition { navigation: auto; }'), `${file} must inline immediate @view-transition opt-in`);
    assert.ok(html.includes(cssHref), `${file} must link ${cssHref}`);
    assert.ok(html.includes(jsSrc), `${file} must include ${jsSrc}`);
    assert.ok(html.includes(`blocking="render"`), `${file} must mark transition script/expect with blocking="render"`);
    assert.ok(html.includes(`rel="expect" href="${expectHref}"`), `${file} must include <link rel="expect" href="${expectHref}">`);
  }

  // Clickable edition switcher in hero <h1> & render-blocking app boot on main typing studios
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const reiHtml = fs.readFileSync(path.join(rootDir, 'rei.html'), 'utf8');
  const reiSubHtml = fs.readFileSync(path.join(rootDir, 'rei/index.html'), 'utf8');

  assert.match(indexHtml, /<script defer src="js\/app\.js\?v=98" blocking="render"><\/script>/, 'index.html must mark boot app.js blocking="render" in <head>');
  assert.match(reiHtml, /<script defer src="js\/app\.js\?v=98" blocking="render"><\/script>/, 'rei.html must mark boot app.js blocking="render" in <head>');
  assert.match(reiSubHtml, /<script defer src="\.\.\/js\/app\.js\?v=98" blocking="render"><\/script>/, 'rei/index.html must mark boot ../js/app.js blocking="render" in <head>');

  assert.match(indexHtml, /<a href="rei\.html"[^>]*id="heroEditionSwitch"/, 'index.html must expose clickable Studio Pro -> Rei switcher');
  assert.match(reiHtml, /<a href="index\.html"[^>]*id="heroEditionSwitch"/, 'rei.html must expose clickable Rei -> Studio Pro switcher');
  assert.match(reiSubHtml, /<a href="\.\.\/index\.html"[^>]*id="heroEditionSwitch"/, 'rei/index.html must expose clickable Rei -> ../index.html switcher');
});

test('Desktop Transition 1.4: Strict Zero-Emoji compliance across all transition files', () => {
  const files = [
    'css/desktop-transition.css',
    'js/desktop-transition.js',
    'css/base.css',
    'tests/desktop_transition.test.js'
  ];
  for (const f of files) {
    const content = fs.readFileSync(path.join(rootDir, f), 'utf8');
    const match = emojiRegex.exec(content);
    assert.equal(match, null, `Zero-Emoji violation in ${f}: ${match ? match[0] : ''}`);
  }
});
