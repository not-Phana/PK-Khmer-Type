import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

test('Trajectory Chart Upgrade: Markup and Telemetry elements integrity', () => {
  const html = fs.readFileSync(path.join(rootDir, 'dashboard.html'), 'utf8');

  // Verify core container IDs and classes
  assert.ok(html.includes('class="dash-module chart-module"'), 'Chart module has updated class');
  assert.ok(html.includes('class="chart-cyber-beam"'), 'Cyber beam aura is present');
  assert.ok(html.includes('class="telemetry-live-pill"'), 'Live pacer telemetry indicator exists');
  assert.ok(html.includes('class="telemetry-radar-dot"'), 'Radar beacon dot exists');

  // Scope toggle buttons
  assert.ok(html.includes('id="chartScopeToggle"'), 'Chart session scope toggle exists');
  assert.ok(html.includes('data-scope="16"'), 'Scope 16 exists');
  assert.ok(html.includes('data-scope="32"'), 'Scope 32 exists');
  assert.ok(html.includes('data-scope="all"'), 'Scope ALL exists');

  // Stream toggle buttons
  assert.ok(html.includes('id="chartStreamToggle"'), 'Stream toggle container exists');
  assert.ok(html.includes('data-stream="dual"'), 'Dual stream button exists');
  assert.ok(html.includes('data-stream="velocity"'), 'Velocity stream button exists');
  assert.ok(html.includes('data-stream="precision"'), 'Precision stream button exists');

  // Tactical corner ticks
  assert.ok(html.includes('chart-corner-tick top-left'), 'Corner tick top-left exists');
  assert.ok(html.includes('chart-corner-tick top-right'), 'Corner tick top-right exists');
  assert.ok(html.includes('chart-corner-tick bottom-left'), 'Corner tick bottom-left exists');
  assert.ok(html.includes('chart-corner-tick bottom-right'), 'Corner tick bottom-right exists');

  // Dual laser and reticles
  assert.ok(html.includes('id="chartLaserLine"'), 'Vertical laser crosshair exists');
  assert.ok(html.includes('id="chartLaserHLine"'), 'Horizontal projector guide exists');
  assert.ok(html.includes('id="chartReticleGold"'), 'Gold reticle exists');
  assert.ok(html.includes('id="chartReticleEmerald"'), 'Emerald reticle exists');

  // Holographic HUD elements
  assert.ok(html.includes('id="chartHologramHud"'), 'Holographic HUD tooltip card exists');
  assert.ok(html.includes('id="hudTierPill"'), 'HUD tier pill exists');
  assert.ok(html.includes('id="hudAccBarFill"'), 'HUD accuracy meter bar exists');
  assert.ok(html.includes('id="hudCadence"'), 'HUD cadence KPS exists');

  // Peak milestone beacon in SVG logic
  assert.ok(html.includes('peak-milestone-beacon'), 'SVG renders PEAK milestone beacon');
  assert.ok(html.includes('cyberGridPattern'), 'Holographic cyber matrix pattern exists');
});

test('Zero-Emoji Compliance on Trajectory Chart', () => {
  const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const html = fs.readFileSync(path.join(rootDir, 'dashboard.html'), 'utf8');
  assert.equal(emojiRegex.test(html), false, 'dashboard.html must have zero emojis');
});
