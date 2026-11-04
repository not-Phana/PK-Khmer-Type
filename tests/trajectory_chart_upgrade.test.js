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

  // Tactical corner ticks on chart frame
  assert.ok(html.includes('chart-corner-tick top-left'), 'Corner tick top-left exists');
  assert.ok(html.includes('chart-corner-tick top-right'), 'Corner tick top-right exists');
  assert.ok(html.includes('chart-corner-tick bottom-left'), 'Corner tick bottom-left exists');
  assert.ok(html.includes('chart-corner-tick bottom-right'), 'Corner tick bottom-right exists');

  // Clean laser line and reticles (without clunky diamond blocks or outer rings)
  assert.ok(html.includes('id="chartLaserLine"'), 'Vertical laser crosshair exists');
  assert.ok(html.includes('id="chartLaserHLine"'), 'Horizontal projector guide exists');
  assert.ok(html.includes('id="chartReticleGold"'), 'Gold reticle exists');
  assert.ok(html.includes('id="chartReticleEmerald"'), 'Emerald reticle exists');
  assert.ok(!html.includes('laser-head top'), 'Laser head diamonds removed');
  assert.ok(!html.includes('reticle-pulse'), 'Bulky reticle pulse ring removed');

  // Holographic HUD clean structure (no corner glitches or title crowding)
  assert.ok(html.includes('id="chartHologramHud"'), 'Holographic HUD tooltip card exists');
  assert.ok(html.includes('id="hudLessonTitle"'), 'HUD title element exists');
  assert.ok(html.includes('id="hudSessionDate"'), 'HUD date element exists');
  assert.ok(html.includes('id="hudTierPill"'), 'HUD tier pill exists');
  assert.ok(html.includes('id="hudDurationStrokes"'), 'HUD duration and strokes exists');
  assert.ok(!html.includes('hud-corner-accent'), 'Glitchy corner accent brackets removed');

  // Peak milestone beacon in SVG logic
  assert.ok(html.includes('peak-milestone-beacon'), 'SVG renders PEAK milestone beacon');
  assert.ok(html.includes('cyberGridPattern'), 'Holographic cyber matrix pattern exists');
});

test('Trajectory Chart: Holographic HUD & Laser Crosshair Plot Boundary Containment', () => {
  const html = fs.readFileSync(path.join(rootDir, 'dashboard.html'), 'utf8');

  // Verify container overflow containment
  assert.ok(html.includes('.chart-container {') && html.includes('overflow: hidden;'), 'Chart container has overflow: hidden to prevent edge bleed');

  // Verify laser line dynamic height strictly bounded to plot area
  assert.ok(html.includes('laser.style.top = `${plotTop}px`'), 'Laser crosshair vertical top anchored to plotTop');
  assert.ok(html.includes('laser.style.height = `${plotBottom - plotTop}px`'), 'Laser crosshair height bounded exactly to plotBottom - plotTop');

  // Verify horizontal line start anchored to plotLeft
  assert.ok(html.includes('laserH.style.left = `${plotLeft}px`'), 'Laser horizontal projector starts at plotLeft');

  // Verify HUD horizontal clamping strictly within plotLeft and plotRight
  assert.ok(html.includes('Math.max(plotLeft + 4, Math.min(targetLeft, plotRight - hudWidth - 4))'), 'HUD tooltip horizontally clamped inside plot boundaries');

  // Verify HUD vertical flip to avoid curve occlusion
  assert.ok(html.includes('plotBottom - hudHeight - 6'), 'HUD flips to lower area when point is high');
  assert.ok(html.includes('plotTop + 6'), 'HUD flips to upper area when point is low');

  // Verify hover bounds suppression when cursor leaves the plot area
  assert.ok(html.includes('mouseX < plotLeft - 4 || mouseX > plotRight + 4'), 'Hover suppresses crosshair when outside plot horizontal bounds');
});

test('Zero-Emoji Compliance on Trajectory Chart', () => {
  const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const html = fs.readFileSync(path.join(rootDir, 'dashboard.html'), 'utf8');
  assert.equal(emojiRegex.test(html), false, 'dashboard.html must have zero emojis');
});
