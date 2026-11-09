import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const THEMES = ['dark', 'light', 'sepia', 'temple', 'moonlight', 'jungle', 'sunset', 'glass'];

test('Theme System 1.1: Core theme definitions exist in base.css, settings.css, lessons.css, and custom-lessons.css', () => {
  const baseCss = fs.readFileSync(path.resolve('css/base.css'), 'utf8');
  const settingsCss = fs.readFileSync(path.resolve('css/settings.css'), 'utf8');
  const lessonsCss = fs.readFileSync(path.resolve('css/lessons.css'), 'utf8');
  const customLessonsCss = fs.readFileSync(path.resolve('css/custom-lessons.css'), 'utf8');

  for (const th of ['light', 'sepia', 'temple', 'moonlight', 'jungle', 'sunset', 'glass']) {
    assert.ok(baseCss.includes(`theme-${th}`), `base.css should define styles for theme-${th}`);
    assert.ok(settingsCss.includes(`theme-${th}`), `settings.css should define styles for theme-${th}`);
    assert.ok(customLessonsCss.includes(`theme-${th}`), `custom-lessons.css should define styles for theme-${th}`);
  }

  // Ensure lessons.css has high-contrast target keys and flow banner for light & sepia
  assert.ok(lessonsCss.includes('.lesson-flow-banner'), 'lessons.css should style .lesson-flow-banner');
  assert.ok(lessonsCss.includes('.nk-keycap'), 'lessons.css should style .nk-keycap');
  assert.ok(lessonsCss.includes('html.theme-light .lesson-flow-banner'), 'lessons.css should style flow banner for light theme');
  assert.ok(lessonsCss.includes('html.theme-sepia .lesson-flow-banner'), 'lessons.css should style flow banner for sepia theme');
  assert.ok(lessonsCss.includes('html.theme-light .nk-keycap'), 'lessons.css should style target keycap for light theme');
  assert.ok(lessonsCss.includes('html.theme-sepia .nk-keycap'), 'lessons.css should style target keycap for sepia theme');
});

test('Theme System 1.2: Custom Lessons modal in custom-lessons.css uses adaptive variables and prevents dark leaks', () => {
  const customLessonsCss = fs.readFileSync(path.resolve('css/custom-lessons.css'), 'utf8');
  assert.ok(customLessonsCss.includes('--cl-modal-bg: #ffffff;'), 'Light theme should define pure white cl-modal-bg');
  assert.ok(customLessonsCss.includes('--cl-modal-bg: #faf5ec;'), 'Sepia theme should define sepia cl-modal-bg');
  assert.ok(customLessonsCss.includes('background-color: var(--cl-modal-bg) !important;'), 'cl-modal-card should enforce var(--cl-modal-bg)');
});

test('Theme System 1.3: Smoked Glass theme incorporates translucent dark surfaces and backdrop filters', () => {
  const baseCss = fs.readFileSync(path.resolve('css/base.css'), 'utf8');
  const welcomeCss = fs.readFileSync(path.resolve('css/welcome.css'), 'utf8');

  assert.ok(baseCss.includes('html.theme-glass'), 'base.css should define html.theme-glass');
  assert.ok(welcomeCss.includes('html.theme-glass'), 'welcome.css should define html.theme-glass');
  assert.ok(baseCss.includes('backdrop-filter: blur('), 'base.css glass theme should specify backdrop-filter blur');
});

test('Theme System 1.4: HTML targets feature early theme boot and theme synchronization', () => {
  const targets = [
    'index.html',
    'dashboard.html',
    'welcome.html',
    'launch/index.html',
    'Documents/index.html',
    'motion-graphic.html',
    '404.html'
  ];

  for (const rel of targets) {
    const html = fs.readFileSync(path.resolve(rel), 'utf8');
    assert.ok(
      html.includes('pkEarlyThemeBoot') ||
      html.includes('theme-light') ||
      html.includes('applyTheme') ||
      html.includes('ALL_CLASSES'),
      `${rel} should include theme boot script or theme class registry`
    );
  }
});

test('Theme System 1.5: Strict Zero-Emoji compliance across all theme-related sources', () => {
  const filesToCheck = [
    'css/base.css',
    'css/custom-lessons.css',
    'css/lessons.css',
    'css/settings.css',
    'css/welcome.css',
    'dashboard.html',
    'js/settings.js',
    'js/desktop-transition.js',
    'tests/all_themes_coverage.test.js'
  ];

  // Regex matching Unicode emoji ranges
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;

  for (const rel of filesToCheck) {
    const filePath = path.resolve(rel);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(emojiRegex);
    assert.strictEqual(
      match,
      null,
      `Strict Zero-Emoji Violation in ${rel}: found "${match ? match[0] : ''}"`
    );
  }
});
