const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('Phase I: Standalone Bundler - Output artifact integrity and completeness', () => {
  const standalonePath = path.join(__dirname, '../dist/pk-khmer-type-standalone.html');
  assert.ok(fs.existsSync(standalonePath), 'dist/pk-khmer-type-standalone.html must exist');

  const content = fs.readFileSync(standalonePath, 'utf8');
  assert.ok(content.length > 2000000, 'Standalone HTML should be substantial (> 2MB)');

  // 1. No external or relative CSS stylesheet links remaining
  const cssLinkMatches = content.match(/<link\s+rel=["']stylesheet["'][^>]*href=["'](?!https:\/\/fonts\.)[^"']+\.css[^"']*["'][^>]*>/gi);
  assert.equal(cssLinkMatches, null, 'All relative stylesheets must be inlined');

  // 2. Inlined style tags present
  assert.ok(content.includes('<style data-source="css/base.css">'));
  assert.ok(content.includes('<style data-source="css/keyboard.css">'));
  assert.ok(content.includes('<style data-source="css/typing.css">'));
  assert.ok(content.includes('<style data-source="css/lessons.css">'));

  // 3. No external or relative deferred JS script tags remaining
  const scriptSrcMatches = content.match(/<script\s+defer\s+src=["'][^"']+\.js[^"']*["'][^>]*><\/script>/gi);
  assert.equal(scriptSrcMatches, null, 'All deferred script tags must be inlined');

  // 4. Inlined script blocks present
  assert.ok(content.includes('<script data-source="js/lessons.js">'));
  assert.ok(content.includes('<script data-source="js/keyboard.js">'));
  assert.ok(content.includes('<script data-source="js/custom-lessons.js">'));
  assert.ok(content.includes('<script data-source="js/race.js">'));

  // 5. Embedded offline datasets shim present
  assert.ok(content.includes('window.__PK_STANDALONE_OFFLINE = true;'));
  assert.ok(content.includes('window.__PK_EMBEDDED_KEYBOARD ='));
  assert.ok(content.includes('window.__PK_EMBEDDED_LITERATURE ='));

  // 6. Strict Zero-Emoji compliance
  const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  assert.equal(emojiRegex.test(content), false, 'Zero-Emoji violation in standalone bundle');
});
