import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}]/u;

test('Rei Theme Persistence: Early <head> initialization exists in index.html, rei.html, and rei/index.html', () => {
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  const reiHtml = fs.readFileSync('rei.html', 'utf8');
  const reiSubHtml = fs.readFileSync('rei/index.html', 'utf8');

  for (const [name, content] of [['index.html', indexHtml], ['rei.html', reiHtml], ['rei/index.html', reiSubHtml]]) {
    assert.ok(content.includes('savedThemeMode'), `${name} missing early savedThemeMode check in head`);
    assert.ok(content.includes("document.documentElement.classList.add('theme-light')"), `${name} missing early theme-light application`);
  }
});

test('Rei Theme Persistence: js/settings.js respects Rei theme and syncs bidirectional state', () => {
  const settingsJs = fs.readFileSync('js/settings.js', 'utf8');

  assert.ok(settingsJs.includes('window.__IS_REI__'), 'js/settings.js must check window.__IS_REI__');
  assert.ok(settingsJs.includes('pk_rei_theme'), 'js/settings.js must check and sync pk_rei_theme');
  assert.ok(settingsJs.includes('window.applyTheme = applyTheme;'), 'js/settings.js must export window.applyTheme');
});

test('Rei Theme Persistence: scripts/generate_rei.js binds synchronized storage and updateThemeUI handler', () => {
  const genScript = fs.readFileSync('scripts/generate_rei.js', 'utf8');

  assert.ok(genScript.includes('window.__updateReiThemeUI = updateThemeUI;'), 'Must export window.__updateReiThemeUI');
  assert.ok(genScript.includes("localStorage.setItem('pk_rei_theme', nextMode);"), 'Must save pk_rei_theme');
  assert.ok(genScript.includes("localStorage.setItem('khmerSettingTheme', nextMode);"), 'Must save khmerSettingTheme');
});

test('Rei Theme Persistence: Strict Zero-Emoji Compliance', () => {
  const testFile = fs.readFileSync('tests/rei_theme_persistence.test.js', 'utf8');
  assert.equal(testFile.match(emojiRegex), null, 'Zero-Emoji violation in tests/rei_theme_persistence.test.js');
});
