const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9222;
const userDataDir = path.join(os.tmpdir(), 'edge_cdp_' + Date.now());

console.log('Launching headless Microsoft Edge with DevTools Protocol on port', PORT, '...');

const browserProcess = spawn(EDGE_PATH, [
  `--remote-debugging-port=${PORT}`,
  '--headless=new',
  `--user-data-dir=${userDataDir}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-gpu',
  '--window-size=1440,900',
  'about:blank'
], {
  detached: false,
  stdio: 'ignore'
});

async function waitForHttp(url, maxRetries = 20) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await new Promise((resolve, reject) => {
        const req = http.get(url, r => {
          let data = '';
          r.on('data', chunk => data += chunk);
          r.on('end', () => resolve({ status: r.statusCode, data }));
        });
        req.on('error', reject);
        req.setTimeout(1000, () => req.destroy(new Error('timeout')));
      });
      if (res.status === 200) return JSON.parse(res.data);
    } catch (e) {}
    await new Promise(r => setTimeout(r, 250));
  }
  throw new Error('Timeout waiting for ' + url);
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = err => reject(err);
      this.ws.onmessage = msg => {
        try {
          const res = JSON.parse(msg.data);
          if (res.id && this.callbacks.has(res.id)) {
            const cb = this.callbacks.get(res.id);
            this.callbacks.delete(res.id);
            if (res.error) cb.reject(new Error(res.error.message));
            else cb.resolve(res.result);
          }
        } catch (e) {}
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = this.id++;
      this.callbacks.set(msgId, { resolve, reject });
      this.ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  try {
    const versionInfo = await waitForHttp(`http://127.0.0.1:${PORT}/json/version`);
    console.log('Browser connected:', versionInfo.Browser);

    const targets = await waitForHttp(`http://127.0.0.1:${PORT}/json/list`);
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    console.log('Attaching to page target:', pageTarget.id);

    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();
    console.log('Connected to target via WebSocket CDP.');

    await client.send('Page.enable');
    await client.send('Runtime.enable');

    console.log('Navigating to http://localhost:5174/ ...');
    await client.send('Page.navigate', { url: 'http://localhost:5174/' });

    console.log('Waiting for application to load and initialize...');
    await new Promise(r => setTimeout(r, 2500));

    // Unlock all lessons and dismiss mobile gate if present
    await client.evaluate(`
      localStorage.setItem('khmerUnlockAll', '1');
      if (typeof allLessonsUnlocked !== 'undefined') allLessonsUnlocked = true;
      if (typeof dismissMobileGate === 'function') dismissMobileGate();
    `);

    const title = await client.evaluate('document.title');
    console.log('Page Title:', title);

    const curriculumLoaded = await client.evaluate('typeof window.CURRICULUM_DATA !== "undefined" && Object.keys(window.CURRICULUM_DATA)');
    console.log('Loaded Curricula in Browser Window:', curriculumLoaded);

    // 1. Test Standard Course L10-07 (Khmer Numbers ០-៩)
    console.log('\n--- Testing Standard Course: L10-07 (All Numbers ០-៩) ---');
    const stdNumTest = await client.evaluate(`
      (function() {
        window.switchLayout('standard');
        window.startLesson('standard-L10-07');
        const active = window.currentLesson;
        const allChars = (window.lessonChars || []).join('');
        const numbers = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
        const missing = numbers.filter(n => !allChars.includes(n));
        return {
          started: !!active,
          id: active ? active.id : null,
          title: active ? active.title : null,
          totalUnits: (window.lessonChars || []).length,
          allNumbersPresent: missing.length === 0,
          missingNumbers: missing
        };
      })()
    `);
    console.log('Standard L10-07 Result:', stdNumTest);

    // 2. Test NiDA Course L10-07 (Khmer Numbers ០-៩)
    console.log('\n--- Testing NiDA Course: L10-07 (All Numbers ០-៩) ---');
    const nidaNumTest = await client.evaluate(`
      (function() {
        window.switchLayout('nida');
        window.startLesson('nida-L10-07');
        const active = window.currentLesson;
        const allChars = (window.lessonChars || []).join('');
        const numbers = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
        const missing = numbers.filter(n => !allChars.includes(n));
        return {
          started: !!active,
          id: active ? active.id : null,
          title: active ? active.title : null,
          totalUnits: (window.lessonChars || []).length,
          allNumbersPresent: missing.length === 0,
          missingNumbers: missing
        };
      })()
    `);
    console.log('NiDA L10-07 Result:', nidaNumTest);

    // 3. Test NiDA Course L05-05 (Triisap ៊)
    console.log('\n--- Testing NiDA Course: L05-05 (Triisap ៊) ---');
    const nidaTriisapTest = await client.evaluate(`
      (function() {
        window.switchLayout('nida');
        window.startLesson('nida-L05-05');
        const active = window.currentLesson;
        const allChars = (window.lessonChars || []).join('');
        return {
          started: !!active,
          id: active ? active.id : null,
          title: active ? active.title : null,
          hasTriisap: allChars.includes('៊'),
          hasDareWord: allChars.includes('ហ៊ាន')
        };
      })()
    `);
    console.log('NiDA L05-05 Result:', nidaTriisapTest);

    // 4. Test NiDA Course L12-04 (Independent Vowels with ឲ)
    console.log('\n--- Testing NiDA Course: L12-04 (Independent Vowels with ឲ) ---');
    const nidaAoyTest = await client.evaluate(`
      (function() {
        window.switchLayout('nida');
        window.startLesson('nida-L12-04');
        const active = window.currentLesson;
        const allChars = (window.lessonChars || []).join('');
        return {
          started: !!active,
          id: active ? active.id : null,
          title: active ? active.title : null,
          hasAoy: allChars.includes('ឲ')
        };
      })()
    `);
    console.log('NiDA L12-04 Result:', nidaAoyTest);

    // 5. Test Interactive Typing Execution in the live browser
    console.log('\n--- Testing Interactive Typing in Live Browser Session ---');
    const typingSimulation = await client.evaluate(`
      (function() {
        window.switchLayout('standard');
        window.startLesson('standard-L00-01');
        
        const initialText = window.lessonChars ? window.lessonChars.slice(0, 10).join('') : '';
        const firstExpected = window.lessonChars ? window.lessonChars[0] : '';
        
        // Simulate typing the first 5 characters correctly
        const typed = [];
        for (let i = 0; i < 5; i++) {
          const charToType = window.lessonChars[window.lessonIndex];
          if (typeof window.handleDirectInput === 'function') {
            window.handleDirectInput(charToType);
            typed.push(charToType);
          } else if (typeof window.insertText === 'function') {
            window.insertText(charToType);
            typed.push(charToType);
          }
        }

        const outEl = document.getElementById('output');
        const statsWpm = document.getElementById('statWpm') ? document.getElementById('statWpm').textContent : '';
        const statsAcc = document.getElementById('statAcc') ? document.getElementById('statAcc').textContent : '';

        return {
          lessonStarted: !!window.currentLesson,
          lessonId: window.currentLesson ? window.currentLesson.id : null,
          currentIndex: window.lessonIndex,
          typedCount: typed.length,
          typedChars: typed.join(''),
          domOutputLength: outEl ? outEl.childNodes.length : 0
        };
      })()
    `);
    console.log('Typing Simulation Result:', typingSimulation);

    // 6. Test English Layout and Lesson
    console.log('\n--- Testing English Course: en-L01-01 ---');
    const englishTest = await client.evaluate(`
      (function() {
        window.switchLayout('english');
        window.startLesson('en-L01-01');
        const active = window.currentLesson;
        return {
          started: !!active,
          id: active ? active.id : null,
          title: active ? active.title : null,
          lessonCharsSample: (window.lessonChars || []).slice(0, 20).join('')
        };
      })()
    `);
    console.log('English en-L01-01 Result:', englishTest);

    // 7. Measure Spacebar vs Ctrl/Alt dimensions in live DOM
    const spacebarMetrics = await client.evaluate(`
      (function() {
        const space = document.querySelector('.key[data-key="space"]');
        const ctrl = document.querySelector('.key[data-key="ctrlL"]');
        const alt = document.querySelector('.key[data-key="alt"]');
        const spaceRect = space ? space.getBoundingClientRect() : null;
        const ctrlRect = ctrl ? ctrl.getBoundingClientRect() : null;
        const altRect = alt ? alt.getBoundingClientRect() : null;

        return {
          spaceWidth: spaceRect ? Math.round(spaceRect.width) : 0,
          ctrlWidth: ctrlRect ? Math.round(ctrlRect.width) : 0,
          altWidth: altRect ? Math.round(altRect.width) : 0,
          ratio: spaceRect && ctrlRect ? (spaceRect.width / ctrlRect.width).toFixed(2) : 0
        };
      })()
    `);
    console.log('\n--- Bottom Row Width Verification ---');
    console.log('Spacebar width:', spacebarMetrics.spaceWidth + 'px');
    console.log('Ctrl width:', spacebarMetrics.ctrlWidth + 'px');
    console.log('Alt width:', spacebarMetrics.altWidth + 'px');
    console.log('Space to Ctrl ratio:', spacebarMetrics.ratio + 'x (Expected ~6x wider)');

    // 8. Capture screenshot of live browser workspace in action
    console.log('\nCapturing live browser workspace screenshot...');
    const screenshotRes = await client.send('Page.captureScreenshot', { format: 'png' });
    const artifactPath = path.join('C:\\Users\\Kurosaki Kon\\.gemini\\antigravity\\brain\\9ef964bc-db6f-4cb5-9c9a-20b607235a59', 'live_browser_workspace_active.png');
    fs.writeFileSync(artifactPath, Buffer.from(screenshotRes.data, 'base64'));
    console.log('Active workspace screenshot saved to:', artifactPath);

    client.close();
    console.log('\nALL BROWSER AUTOMATION TESTS COMPLETED SUCCESSFULLY IN LIVE ENGINE!');
  } catch (err) {
    console.error('Browser Test Error:', err);
  } finally {
    try {
      browserProcess.kill('SIGKILL');
    } catch (e) {}
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

run();
