// tests/browser_global_scope.test.js
// Automated test suite verifying that all non-module scripts in index.html
// parse and execute in a shared browser global scope without collision SyntaxErrors
// or missing identifier ReferenceErrors.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

test('Shared Browser Global Scope: Multi-script sequential execution without collisions', () => {
  const rootDir = path.resolve(__dirname, '..');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

  // Extract all script src tags from index.html in document load order
  const scriptRegex = /<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi;
  const scriptFiles = [];
  let match;
  while ((match = scriptRegex.exec(indexHtml)) !== null) {
    const src = match[1].split('?')[0];
    scriptFiles.push(src);
  }

  assert.ok(scriptFiles.length >= 20, 'Expected at least 20 scripts in index.html');

  // Build simulated browser DOM environment
  function createMockElement(tag = 'div') {
    const el = {
      tagName: tag.toUpperCase(),
      style: {
        setProperty() {},
        removeProperty() {},
        display: ''
      },
      classList: {
        _set: new Set(),
        add(cls) { this._set.add(cls); },
        remove(cls) { this._set.delete(cls); },
        contains(cls) { return this._set.has(cls); },
        toggle(cls, force) {
          if (force === undefined) {
            if (this._set.has(cls)) this._set.delete(cls); else this._set.add(cls);
          } else if (force) {
            this._set.add(cls);
          } else {
            this._set.delete(cls);
          }
        }
      },
      setAttribute() {},
      getAttribute() { return null; },
      hasAttribute() { return false; },
      removeAttribute() {},
      addEventListener() {},
      removeEventListener() {},
      appendChild(c) {
        this.childNodes.push(c);
        this.children.push(c);
        return c;
      },
      insertBefore(c) {
        this.childNodes.unshift(c);
        this.children.unshift(c);
        return c;
      },
      removeChild(c) {
        this.childNodes = this.childNodes.filter(n => n !== c);
        this.children = this.children.filter(n => n !== c);
        return c;
      },
      remove() {},
      replaceChild(c) { return c; },
      querySelectorAll() { return []; },
      querySelector() { return null; },
      getElementsByClassName() { return []; },
      childNodes: [],
      children: [],
      dataset: {},
      hidden: false,
      textContent: '',
      innerHTML: '',
      focus() {},
      blur() {},
      closest() { return null; },
      matches() { return false; },
      getBoundingClientRect() {
        return { top: 0, left: 0, bottom: 40, right: 120, width: 120, height: 40 };
      },
      getContext() {
        return new Proxy({}, {
          get(target, prop) {
            return () => {};
          }
        });
      }
    };
    return el;
  }

  const docEl = createMockElement('html');
  const bodyEl = createMockElement('body');
  const headEl = createMockElement('head');

  const elementsById = new Map();
  function getOrCreateElement(id) {
    if (!elementsById.has(id)) {
      const el = createMockElement('div');
      el.id = id;
      elementsById.set(id, el);
    }
    return elementsById.get(id);
  }

  const sandbox = {
    console: {
      log() {},
      info() {},
      warn() {},
      error() {},
      debug() {}
    },
    setTimeout: (cb) => { return 1; },
    clearTimeout: () => {},
    setInterval: () => { return 1; },
    clearInterval: () => {},
    requestAnimationFrame: () => { return 1; },
    cancelAnimationFrame: () => {},
    btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
    atob: (b64) => Buffer.from(b64, 'base64').toString('binary'),
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    navigator: { userAgent: 'BrowserSim/1.0', language: 'en-US' },
    location: {
      href: 'https://not-phana.github.io/PK-Khmer-Type/index.html',
      pathname: '/PK-Khmer-Type/index.html',
      origin: 'https://not-phana.github.io',
      search: '',
      protocol: 'https:'
    },
    localStorage: {
      _data: {},
      getItem(k) { return Object.prototype.hasOwnProperty.call(this._data, k) ? this._data[k] : null; },
      setItem(k, v) { this._data[k] = String(v); },
      removeItem(k) { delete this._data[k]; },
      clear() { this._data = {}; }
    },
    sessionStorage: {
      _data: {},
      getItem(k) { return Object.prototype.hasOwnProperty.call(this._data, k) ? this._data[k] : null; },
      setItem(k, v) { this._data[k] = String(v); },
      removeItem(k) { delete this._data[k]; },
      clear() { this._data = {}; }
    },
    AudioContext: class {
      createBuffer() { return { getChannelData: () => new Float32Array(100) }; }
      createBufferSource() { return { buffer: null, connect() {}, start() {}, stop() {}, disconnect() {} }; }
      createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} }, connect() {}, disconnect() {} }; }
      createBiquadFilter() { return { frequency: { setValueAtTime() {} }, connect() {}, disconnect() {} }; }
      createOscillator() { return { type: 'sine', frequency: { setValueAtTime() {} }, connect() {}, start() {}, stop() {}, disconnect() {} }; }
      get currentTime() { return 0; }
    },
    Event: class Event { constructor(type) { this.type = type; } },
    CustomEvent: class CustomEvent { constructor(type, init) { this.type = type; this.detail = init && init.detail; } },
    MutationObserver: class MutationObserver { constructor() {} observe() {} disconnect() {} takeRecords() { return []; } },
    ResizeObserver: class ResizeObserver { constructor() {} observe() {} unobserve() {} disconnect() {} },
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {},
    document: {
      documentElement: docEl,
      body: bodyEl,
      head: headEl,
      createElement: (tag) => {
        const el = createMockElement(tag);
        if (tag.toLowerCase() === 'canvas') {
          el.getContext = () => ({
            clearRect() {},
            beginPath() {},
            arc() {},
            fill() {},
            stroke() {},
            save() {},
            restore() {},
            scale() {}
          });
        }
        return el;
      },
      createElementNS: (ns, tag) => createMockElement(tag),
      createDocumentFragment: () => createMockElement('fragment'),
      getElementById: (id) => getOrCreateElement(id),
      querySelector: (sel) => {
        if (sel.startsWith('#')) return getOrCreateElement(sel.slice(1));
        return createMockElement('div');
      },
      querySelectorAll: () => [],
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {}
    }
  };

  sandbox.window = sandbox;
  sandbox.global = sandbox;
  sandbox.self = sandbox;
  sandbox.top = sandbox;
  sandbox.parent = sandbox;

  const context = vm.createContext(sandbox);

  // Execute all scripts in identical document order inside the single shared context
  const loadedScripts = [];
  for (const relPath of scriptFiles) {
    const fullPath = path.join(rootDir, relPath);
    if (!fs.existsSync(fullPath)) continue;
    const code = fs.readFileSync(fullPath, 'utf8');
    try {
      vm.runInContext(code, context, { filename: relPath });
      loadedScripts.push(relPath);
    } catch (err) {
      console.error('ERROR IN ' + relPath + ':\n', err);
      assert.fail(`Script execution failure in shared global scope: ${relPath} -> ${err.name}: ${err.message}`);
    }
  }

  assert.ok(loadedScripts.includes('js/typing.js'), 'js/typing.js must load');
  assert.ok(loadedScripts.includes('js/lessons.js'), 'js/lessons.js must load');
  assert.ok(loadedScripts.includes('js/quick_guide.js'), 'js/quick_guide.js must load');

  // Assert critical engine constants and functions exist on global/window
  assert.ok(sandbox.KHMER_COMPOUND_VOWELS, 'KHMER_COMPOUND_VOWELS must be defined');
  assert.equal(typeof sandbox.clearText, 'function', 'clearText must be defined as a function');
  assert.equal(typeof sandbox.insertText, 'function', 'insertText must be defined as a function');
  assert.equal(typeof sandbox.startLesson, 'function', 'startLesson must be defined as a function');
  assert.equal(typeof sandbox.switchLayout, 'function', 'switchLayout must be defined as a function');

  // Verify that calling startLesson does not throw ReferenceError: clearText is not defined
  assert.doesNotThrow(() => {
    sandbox.startLesson('nida_1');
  }, 'startLesson must execute cleanly without ReferenceError or TypeError');

  // Verify startLesson exit and teardown
  assert.doesNotThrow(() => {
    if (typeof sandbox.executeLessonExit === 'function') {
      sandbox.executeLessonExit();
    }
  }, 'executeLessonExit must execute cleanly without error');

  // Test Idempotency: Declaring KHMER_COMPOUND_VOWELS across multiple scripts must NOT throw SyntaxError
  assert.doesNotThrow(() => {
    vm.runInContext('var KHMER_COMPOUND_VOWELS = (typeof window !== "undefined" && window.KHMER_COMPOUND_VOWELS) || Object.freeze(["\\u17BB\\u17C6"]);', context);
    vm.runInContext('var KHMER_COMPOUND_MAP = (typeof window !== "undefined" && window.KHMER_COMPOUND_MAP) || Object.freeze({});', context);
  }, 'Declaring KHMER_COMPOUND_VOWELS across multiple scripts in shared global scope must never throw SyntaxError');

  // Test Defensive Fallback: If clearText is missing/undefined, startLesson still does not throw
  const savedClearText = sandbox.clearText;
  const savedWinClearText = sandbox.window.clearText;
  delete sandbox.clearText;
  delete sandbox.window.clearText;
  assert.doesNotThrow(() => {
    sandbox.startLesson('nida_1');
  }, 'startLesson must not crash even if clearText is temporarily undefined');
  sandbox.clearText = savedClearText;
  sandbox.window.clearText = savedWinClearText;

  // Verify Supabase setupMessage reflects offline/local storage mode
  assert.ok(sandbox.PKSupabaseConfig, 'PKSupabaseConfig must be defined on window');
  const setupError = sandbox.PKSupabaseConfig.getSupabaseSetupError();
  assert.match(setupError, /operating in offline\/local storage mode/, 'Supabase setup error must clearly inform user of offline mode');
});

test('Browser Global Isolation: completeLesson and getLearningOverview succeed when global is undefined', () => {
  const rootDir = path.resolve(__dirname, '..');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const scriptRegex = /<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi;
  const scriptFiles = [];
  let match;
  while ((match = scriptRegex.exec(indexHtml)) !== null) {
    scriptFiles.push(match[1].split('?')[0]);
  }

  function createMockElement(tag = 'div') {
    return {
      tagName: tag.toUpperCase(),
      style: { setProperty() {}, removeProperty() {}, display: '' },
      classList: {
        _set: new Set(),
        add(c) { this._set.add(c); },
        remove(c) { this._set.delete(c); },
        contains(c) { return this._set.has(c); },
        toggle(c) { if (this._set.has(c)) this._set.delete(c); else this._set.add(c); }
      },
      setAttribute() {},
      getAttribute() { return null; },
      hasAttribute() { return false; },
      removeAttribute() {},
      addEventListener() {},
      removeEventListener() {},
      appendChild(c) { return c; },
      insertBefore(c) { return c; },
      removeChild(c) { return c; },
      remove() {},
      querySelectorAll() { return []; },
      querySelector() { return null; },
      childNodes: [],
      children: [],
      dataset: {},
      hidden: false,
      textContent: '',
      innerHTML: '',
      focus() {},
      blur() {},
      closest() { return null; },
      matches() { return false; },
      getBoundingClientRect() { return { top: 0, left: 0, width: 100, height: 40 }; },
      getContext() {
        return new Proxy({}, {
          get() {
            return () => {};
          }
        });
      }
    };
  }

  const elementsMap = new Map();
  function getElem(id) {
    if (!elementsMap.has(id)) {
      const el = createMockElement('div');
      el.id = id;
      elementsMap.set(id, el);
    }
    return elementsMap.get(id);
  }

  const sandbox = {
    console: { log() {}, info() {}, warn() {}, error() {}, debug() {} },
    setTimeout: () => 1,
    clearTimeout: () => {},
    setInterval: () => 1,
    clearInterval: () => {},
    requestAnimationFrame: () => 1,
    cancelAnimationFrame: () => {},
    getComputedStyle: () => ({ getPropertyValue: () => '' }),
    btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
    atob: (b64) => Buffer.from(b64, 'base64').toString('binary'),
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    navigator: { userAgent: 'BrowserSim/1.0', language: 'en-US' },
    location: { href: 'http://localhost/index.html', pathname: '/index.html' },
    localStorage: { _d: {}, getItem(k) { return this._d[k] || null; }, setItem(k, v) { this._d[k] = String(v); }, removeItem(k) { delete this._d[k]; }, clear() { this._d = {}; } },
    sessionStorage: { _d: {}, getItem(k) { return this._d[k] || null; }, setItem(k, v) { this._d[k] = String(v); } },
    AudioContext: class {
      createBuffer() { return { getChannelData: () => new Float32Array(10) }; }
      createBufferSource() { return { buffer: null, connect() {}, start() {}, stop() {}, disconnect() {} }; }
      createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} }, connect() {}, disconnect() {} }; }
      createBiquadFilter() { return { frequency: { setValueAtTime() {} }, connect() {}, disconnect() {} }; }
      createOscillator() { return { type: 'sine', frequency: { setValueAtTime() {} }, connect() {}, start() {}, stop() {}, disconnect() {} }; }
      get currentTime() { return 0; }
    },
    Event: class { constructor(t) { this.type = t; } },
    CustomEvent: class { constructor(t, i) { this.type = t; this.detail = i && i.detail; } },
    MutationObserver: class { observe() {} disconnect() {} takeRecords() { return []; } },
    ResizeObserver: class { observe() {} disconnect() {} },
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {},
    document: {
      documentElement: createMockElement('html'),
      body: createMockElement('body'),
      head: createMockElement('head'),
      createElement: (t) => createMockElement(t),
      createElementNS: (ns, t) => createMockElement(t),
      createDocumentFragment: () => createMockElement('fragment'),
      getElementById: (id) => getElem(id),
      querySelector: (s) => (s && s.startsWith('#') ? getElem(s.slice(1)) : createMockElement('div')),
      querySelectorAll: () => [],
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {}
    }
  };

  sandbox.window = sandbox;
  // NOTE: In browser, window.global is undefined and global identifier is not declared!
  // Do NOT assign sandbox.global!

  const context = vm.createContext(sandbox);

  for (const relPath of scriptFiles) {
    const fullPath = path.join(rootDir, relPath);
    if (!fs.existsSync(fullPath)) continue;
    const srcCode = fs.readFileSync(fullPath, 'utf8');
    vm.runInContext(srcCode, context, { filename: relPath });
  }

  // 1. Verify getLearningOverview does not crash when global is undeclared
  assert.doesNotThrow(() => {
    const overview = sandbox.getLearningOverview('standard');
    assert.ok(overview, 'getLearningOverview must return an overview object');
  }, 'getLearningOverview must execute cleanly when global is undeclared in browser');

  // 2. Start a lesson, advance to the final keystroke, and complete it
  assert.doesNotThrow(() => {
    const firstLesson = (sandbox.LESSONS && sandbox.LESSONS[0]) || 'nida_1';
    sandbox.startLesson(firstLesson, true);
    assert.equal(sandbox.lessonActive, true, 'Lesson must be active after startLesson');
    // Simulate typing the final character
    sandbox.lessonIndex = sandbox.lessonChars.length;
    sandbox.completeLesson();
    assert.equal(sandbox.lessonActive, false, 'Lesson must be inactive after completeLesson');
  }, 'completeLesson must complete cleanly on the final keystroke without ReferenceError: global is not defined');
});
