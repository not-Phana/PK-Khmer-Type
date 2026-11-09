import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

test('Swarm Cursors 1.1: welcome.html includes swarm-cursors.js with auto-rebuild and cache-busting query', () => {
  const html = fs.readFileSync(path.join(ROOT, 'welcome.html'), 'utf8');
  assert.match(html, /<script[^>]*src=["']js\/swarm-cursors\.js\?v=\d+["'][^>]*data-trigger=["']auto["']/);
  assert.match(html, /href=["']css\/welcome\.css\?v=\d+["']/);
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

test('Swarm Cursors 1.4: Overflow clipping applies to pseudo-elements (prevents offscreen button sheen leak)', () => {
  const code = fs.readFileSync(path.join(ROOT, 'js', 'swarm-cursors.js'), 'utf8');
  assert.match(code, /pctx\s*=\s*\{\s*\.\.\.kctx,\s*layer,\s*clip:\s*isScroller\s*\?\s*clip\s*:\s*kidClip\s*\}/);
  assert.match(code, /inter\.r\s*-\s*inter\.l\s*<\s*0\.5\s*\|\|\s*inter\.b\s*-\s*inter\.t\s*<\s*0\.5/);
  const welcomeCss = fs.readFileSync(path.join(ROOT, 'css', 'welcome.css'), 'utf8');
  assert.match(welcomeCss, /\.hero-main-cta::before\s*\{[^}]*opacity:\s*0;/s);
});

test('Swarm Cursors 1.5: Text-clipped gradient backgrounds are skipped in emitBox and preserved on clones', () => {
  const code = fs.readFileSync(path.join(ROOT, 'js', 'swarm-cursors.js'), 'utf8');
  assert.match(code, /isTextClip\s*=\s*cs\.webkitBackgroundClip\s*===\s*"text"\s*\|\|\s*cs\.backgroundClip\s*===\s*"text"/);
  assert.match(code, /\(bgi\s*!==\s*"none"\s*&&\s*!isTextClip\)/);
});

test('Swarm Cursors 1.6: 3D hero WebGL canvas preserves drawing buffer for swarm snapshot capture', () => {
  const welcomeJs = fs.readFileSync(path.join(ROOT, 'js', 'welcome.js'), 'utf8');
  assert.match(welcomeJs, /new THREE\.WebGLRenderer\(\{[\s\S]*?preserveDrawingBuffer:\s*true/);
  const swarmJs = fs.readFileSync(path.join(ROOT, 'js', 'swarm-cursors.js'), 'utf8');
  assert.match(swarmJs, /d\[i\]\s*\+\s*d\[i\s*\+\s*1\]\s*\+\s*d\[i\s*\+\s*2\]\s*\+\s*d\[i\s*\+\s*3\]/);
});
