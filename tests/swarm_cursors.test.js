import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

test('Swarm Cursors 1.1: welcome.html includes swarm-cursors.js with auto-rebuild', () => {
  const html = fs.readFileSync(path.join(ROOT, 'welcome.html'), 'utf8');
  assert.match(html, /<script[^>]*src=["']js\/swarm-cursors\.js["'][^>]*data-trigger=["']auto["']/);
  assert.match(html, /<canvas\s+id=["']welcomeCanvas["'][^>]*data-swarm-ignore/);
});

test('Swarm Cursors 1.2: Strict Zero-Emoji compliance on js/swarm-cursors.js', () => {
  const code = fs.readFileSync(path.join(ROOT, 'js', 'swarm-cursors.js'), 'utf8');
  // Check for common emoji ranges via RegExp constructor
  const emojiRegex = new RegExp('[\\u{1F300}-\\u{1F5FF}\\u{1F600}-\\u{1F64F}\\u{1F680}-\\u{1F6FF}\\u{1F700}-\\u{1F77F}\\u{1F780}-\\u{1F7FF}\\u{1F800}-\\u{1F8FF}\\u{1F900}-\\u{1F9FF}\\u{1FA00}-\\u{1FA6F}\\u{1FA70}-\\u{1FAFF}\\u{2600}-\\u{26FF}\\u{2700}-\\u{27BF}]', 'u');
  assert.strictEqual(emojiRegex.test(code), false, 'js/swarm-cursors.js must not contain any emoji characters');
  assert.strictEqual(code.includes('\\u2715'), false, 'Unicode cross (U+2715) must be replaced by SVG');
});

test('Swarm Cursors 1.3: Auto configuration suppresses HUD and enables autoLive', () => {
  const code = fs.readFileSync(path.join(ROOT, 'js', 'swarm-cursors.js'), 'utf8');
  assert.match(code, /hud:\s*String\(_pick\("hud",\s*_trig\s*===\s*"auto"\s*\?\s*"false"\s*:\s*"true"\)\)/);
  assert.match(code, /autoLive:\s*String\(_pick\("autoLive",\s*_trig\s*===\s*"auto"\s*\?\s*"true"\s*:\s*"false"\)\)/);
  assert.match(code, /doneVisible\s*=\s*isAuto/);
  assert.match(code, /this\.destroy\(true\)/);
});
