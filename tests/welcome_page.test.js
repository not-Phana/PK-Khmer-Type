// tests/welcome_page.test.js
// Verification suite for PK Khmer Type Welcome Page (welcome.html),
// CSS animations (css/welcome.css), interactive JavaScript engine (js/welcome.js),
// and bidirectional navigation linkage with index.html.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// Strict Zero-Emoji regular expression
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA70}-\u{1FAFF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;

test('Welcome 1.1: Files exist and are non-empty', () => {
  const files = ['welcome.html', 'css/welcome.css', 'js/welcome.js'];
  for (const f of files) {
    const fullPath = path.join(rootDir, f);
    assert.ok(fs.existsSync(fullPath), `File ${f} must exist`);
    const stat = fs.statSync(fullPath);
    assert.ok(stat.size > 200, `File ${f} must not be empty`);
  }
});

test('Welcome 1.2: Strict Zero-Emoji compliance across all Welcome files', () => {
  const files = ['welcome.html', 'css/welcome.css', 'js/welcome.js', 'tests/welcome_page.test.js'];
  for (const f of files) {
    const content = fs.readFileSync(path.join(rootDir, f), 'utf8');
    const match = emojiRegex.exec(content);
    assert.equal(
      match,
      null,
      `File ${f} must have zero emojis, but found: ${match ? match[0] : ''}`
    );
  }
});

test('Welcome 1.3: HTML markup structure, CSP, and meta headers', () => {
  const html = fs.readFileSync(path.join(rootDir, 'welcome.html'), 'utf8');

  // Security headers
  assert.ok(html.includes('http-equiv="Content-Security-Policy"'), 'Must have CSP meta tag');
  assert.ok(html.includes("default-src 'self'"), 'CSP must include default-src self');
  assert.ok(html.includes('name="referrer"'), 'Must include Referrer-Policy');
  assert.ok(html.includes('http-equiv="X-Content-Type-Options"'), 'Must include nosniff');

  // DOM core elements
  assert.ok(html.includes('id="welcomeCanvas"'), 'Must contain welcome canvas');
  assert.ok(html.includes('id="audioToggleBtn"'), 'Must contain audio toggle button');
  assert.ok(html.includes('id="langToggleBtn"'), 'Must contain language toggle button');
  assert.ok(html.includes('id="manuscriptLiveText"'), 'Must contain live manuscript text display');
  assert.ok(html.includes('id="keycapsBenchRow"'), 'Must contain 3D keycaps bench row');
  assert.ok(html.includes('id="benchFeedbackChip"'), 'Must contain bench feedback chip');

  // Mechanical keycaps in bench
  assert.ok(html.includes('data-code="KeyF"'), 'Bench must contain KeyF home anchor');
  assert.ok(html.includes('data-code="KeyJ"'), 'Bench must contain KeyJ home anchor');
  assert.ok(html.includes('data-code="Space"'), 'Bench must contain Spacebar');

  // Style and Script references
  assert.ok(html.includes('href="css/welcome.css"'), 'Must link css/welcome.css');
  assert.ok(html.includes('src="js/welcome.js"'), 'Must load js/welcome.js');
});

test('Welcome 1.4: JavaScript engine contains procedural audio, canvas particles, and bilingual dictionary', () => {
  const js = fs.readFileSync(path.join(rootDir, 'js/welcome.js'), 'utf8');

  // Procedural Web Audio switch synthesis
  assert.ok(js.includes('playMechanicalSound'), 'Must define playMechanicalSound synthesizer');
  assert.ok(js.includes('AudioContext') || js.includes('webkitAudioContext'), 'Must support Web Audio API');
  assert.ok(js.includes('createOscillator'), 'Must synthesize tones with oscillators');

  // Ambient Starfield Canvas
  assert.ok(js.includes('initAmbientCanvas'), 'Must define initAmbientCanvas');
  assert.ok(js.includes('requestAnimationFrame'), 'Must animate particles with rAF');

  // Live Typing Theater & Key Bench
  assert.ok(js.includes('initTypingTheater'), 'Must define initTypingTheater');
  assert.ok(js.includes('initKeycapBench'), 'Must define initKeycapBench');
  assert.ok(js.includes('keydown'), 'Must listen for physical keypresses');

  // 3D Tilt Card physics
  assert.ok(js.includes('init3DTilt'), 'Must define init3DTilt for 3D tilt');

  // Bilingual dictionary (EN and KM)
  assert.ok(js.includes('I18N'), 'Must define I18N dictionary');
  assert.ok(js.includes('applyLanguage'), 'Must provide language application');
  assert.ok(js.includes('brandTag'), 'Must translate brandTag');
  assert.ok(js.includes('launchStudio'), 'Must translate launchStudio');
});

test('Welcome 1.5: CSS features 3D transforms, keyframes, and reduced-motion overrides', () => {
  const css = fs.readFileSync(path.join(rootDir, 'css/welcome.css'), 'utf8');

  // Shimmer and animations
  assert.ok(css.includes('@keyframes shimmerFlow'), 'Must define shimmerFlow keyframe');
  assert.ok(css.includes('@keyframes cursorBlink'), 'Must define cursorBlink keyframe');
  assert.ok(css.includes('@keyframes soundWave'), 'Must define soundWave keyframe');

  // 3D Keycap modeling
  assert.ok(css.includes('.mech-keycap'), 'Must define .mech-keycap class');
  assert.ok(css.includes('.mech-keycap.pressed'), 'Must define .pressed active state');
  assert.ok(css.includes('.mech-keycap.bump::after'), 'Must define home row tactile bumps');

  // 3D Tilt cards
  assert.ok(css.includes('.pillar-card'), 'Must define .pillar-card class');
  assert.ok(css.includes('transform-style: preserve-3d') || css.includes('perspective:'), 'Must configure 3D transform space');

  // Accessibility: prefers-reduced-motion
  assert.ok(
    css.includes('@media (prefers-reduced-motion: reduce)'),
    'Must include prefers-reduced-motion accessibility overrides'
  );
});

test('Welcome 1.6: Bidirectional navigation linkage between index.html and welcome.html', () => {
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const welcomeHtml = fs.readFileSync(path.join(rootDir, 'welcome.html'), 'utf8');

  // index.html points to welcome.html
  assert.ok(indexHtml.includes('href="welcome.html"'), 'index.html must link to welcome.html');
  assert.ok(indexHtml.includes('id="topWelcomeBtn"'), 'index.html must have #topWelcomeBtn in command bar');
  assert.ok(indexHtml.includes('id="siteWelcomeFooterLink"'), 'index.html must have #siteWelcomeFooterLink in footer');

  // welcome.html points to index.html sections
  assert.ok(welcomeHtml.includes('href="index.html"'), 'welcome.html must link to index.html');
  assert.ok(welcomeHtml.includes('href="index.html#lessonStrip"'), 'welcome.html must link to lesson curriculum');
  assert.ok(welcomeHtml.includes('href="index.html?action=custom-lessons"'), 'welcome.html must link to custom lessons hub');
  assert.ok(welcomeHtml.includes('href="Documents/index.html"'), 'welcome.html must link to anatomy documentation');
});

test('Welcome 1.7: Small 3D Celestial Starlight Pointer exclusively in welcome.html', () => {
  const welcomeHtml = fs.readFileSync(path.join(rootDir, 'welcome.html'), 'utf8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const welcomeJs = fs.readFileSync(path.join(rootDir, 'js/welcome.js'), 'utf8');
  const welcomeCss = fs.readFileSync(path.join(rootDir, 'css/welcome.css'), 'utf8');

  // Must exist in welcome.html
  assert.ok(welcomeHtml.includes('id="hero3DCanvas"'), 'welcome.html must contain 3D hero canvas');
  assert.ok(welcomeHtml.includes('id="hero3dStage"'), 'welcome.html must contain 3D showcase stage');
  assert.ok(welcomeHtml.includes('src="Documents/three.min.js"'), 'welcome.html must load local Three.js engine');

  // Must NOT exist in index.html (exclusively in welcome.html)
  assert.ok(!indexHtml.includes('id="siteCelestialPointerLink"'), 'index.html must not contain celestial pointer link');
  assert.ok(!indexHtml.includes('celestial_starlight_pointer.html'), 'index.html must not link to celestial pointer page');

  // Welcome JS implementation
  assert.ok(welcomeJs.includes('initCelestialStarlightPointer'), 'js/welcome.js must implement initCelestialStarlightPointer');
  assert.ok(welcomeJs.includes('NEEDLE_SCALE'), 'js/welcome.js must configure needle scale');
  assert.ok(welcomeJs.includes('playCelestialChime'), 'js/welcome.js must provide crystalline chime synthesizer');

  // Welcome CSS styling
  assert.ok(welcomeCss.includes('.hero-3d-stage'), 'css/welcome.css must style .hero-3d-stage');
  assert.ok(welcomeCss.includes('.hero-3d-canvas'), 'css/welcome.css must style .hero-3d-canvas');
});


test('Welcome 1.8: Deployment workflow (.github/workflows/deploy.yml) stages welcome.html and static assets', () => {
  const workflowPath = path.join(rootDir, '.github', 'workflows', 'deploy.yml');
  assert.ok(fs.existsSync(workflowPath), 'deploy.yml must exist');
  const deployYaml = fs.readFileSync(workflowPath, 'utf8');

  // Must stage welcome.html either explicitly or via *.html wildcard
  const stagesWelcome = deployYaml.includes('welcome.html') || deployYaml.includes('*.html');
  assert.ok(stagesWelcome, 'deploy.yml must stage welcome.html into _site directory');

  // Must stage Documents directory containing three.min.js
  assert.ok(deployYaml.includes('Documents'), 'deploy.yml must stage Documents directory for three.min.js');
  // Must stage css and js directories
  assert.ok(deployYaml.includes('css'), 'deploy.yml must stage css directory');
  assert.ok(deployYaml.includes('js'), 'deploy.yml must stage js directory');
});
