import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

test('Trajectory Chart Remake: Esports Telemetry Deck & Real-Time Header HUD integrity', () => {
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

  // Clean laser line and reticles
  assert.ok(html.includes('id="chartLaserLine"'), 'Vertical laser crosshair exists');
  assert.ok(html.includes('id="chartLaserHLine"'), 'Horizontal projector guide exists');
  assert.ok(html.includes('id="chartReticleGold"'), 'Gold reticle exists');
  assert.ok(html.includes('id="chartReticleEmerald"'), 'Emerald reticle exists');

  // Real-Time Header HUD Telemetry Deck structure
  assert.ok(html.includes('id="chartTelemetryDeck"'), 'Real-time telemetry deck container exists');
  assert.ok(html.includes('id="telemetrySummaryView"'), 'Summary aggregate state view exists');
  assert.ok(html.includes('id="chartHologramHud"'), 'Holographic Header HUD inspector exists');
  assert.ok(html.includes('id="hudLessonTitle"'), 'HUD title element exists');
  assert.ok(html.includes('id="hudSessionDate"'), 'HUD date element exists');
  assert.ok(html.includes('id="hudTierPill"'), 'HUD tier pill exists');
  assert.ok(html.includes('id="hudDurationStrokes"'), 'HUD duration and strokes exists');
  assert.ok(html.includes('id="hudSpeedVal"'), 'HUD speed value element exists');
  assert.ok(html.includes('id="hudAccVal"'), 'HUD accuracy value element exists');
  assert.ok(html.includes('id="hudDeltaVal"'), 'HUD burst delta element exists');
  assert.ok(html.includes('id="hudCadence"'), 'HUD cadence element exists');

  // Peak milestone beacon & cyber matrix grid in SVG logic
  assert.ok(html.includes('peak-milestone-beacon'), 'SVG renders PEAK milestone beacon');
  assert.ok(html.includes('cyberGridPattern'), 'Holographic cyber matrix pattern exists');
});

test('Trajectory Chart Remake: 320px Canvas & Unobstructed Plot Area', () => {
  const html = fs.readFileSync(path.join(rootDir, 'dashboard.html'), 'utf8');

  // Verify 320px canvas dimensions and overflow containment
  assert.ok(html.includes('height: 320px;'), 'Chart container expanded to 320px for roomy curves');
  assert.ok(html.includes('viewBox="0 0 600 320"'), 'SVG viewBox set to 600x320');
  assert.ok(html.includes('overflow: hidden;'), 'Chart container has overflow: hidden');

  // Verify laser line dynamic height strictly bounded to plot area
  assert.ok(html.includes('laser.style.top = `${plotTop}px`'), 'Laser crosshair vertical top anchored to plotTop');
  assert.ok(html.includes('laser.style.height = `${plotBottom - plotTop}px`'), 'Laser crosshair height bounded exactly to plotBottom - plotTop');

  // Verify horizontal line start anchored to plotLeft
  assert.ok(html.includes('laserH.style.left = `${plotLeft}px`'), 'Laser horizontal projector starts at plotLeft');

  // Verify Real-Time Header HUD toggling (leaving waveform 100% unobstructed)
  assert.ok(html.includes("hud.classList.add('active')"), 'Header HUD activates on hover');
  assert.ok(html.includes("summaryDeck.classList.add('hidden')"), 'Summary view hides during active inspection');

  // Verify hover bounds suppression when cursor leaves the plot area
  assert.ok(html.includes('mouseX < plotLeft - 4 || mouseX > plotRight + 4'), 'Hover suppresses crosshair when outside plot horizontal bounds');
});

test('Zero-Emoji Compliance on Trajectory Chart', () => {
  const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const html = fs.readFileSync(path.join(rootDir, 'dashboard.html'), 'utf8');
  assert.equal(emojiRegex.test(html), false, 'dashboard.html must have zero emojis');
});
