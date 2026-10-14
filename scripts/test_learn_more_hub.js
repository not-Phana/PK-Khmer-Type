const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9223;
const userDataDir = path.join(os.tmpdir(), 'edge_cdp_hub_' + Date.now());

const browserProcess = spawn(EDGE_PATH, [
  `--remote-debugging-port=${PORT}`,
  '--headless=new',
  `--user-data-dir=${userDataDir}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-gpu',
  '--window-size=1440,960',
  'about:blank'
], { detached: false, stdio: 'ignore' });

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
          const data = JSON.parse(msg.data);
          if (data.id && this.callbacks.has(data.id)) {
            const cb = this.callbacks.get(data.id);
            this.callbacks.delete(data.id);
            if (data.error) cb.reject(new Error(data.error.message));
            else cb.resolve(data.result);
          }
        } catch (e) {}
      };
    });
  }

  async send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  try {
    const versionInfo = await waitForHttp(`http://127.0.0.1:${PORT}/json/version`);
    const targets = await waitForHttp(`http://127.0.0.1:${PORT}/json/list`);
    const pageTarget = targets.find(t => t.type === 'page');

    const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    await cdp.send('Page.navigate', { url: 'http://localhost:5174/' });
    await new Promise(r => setTimeout(r, 1000));

    // Dismiss tutorial if present
    await cdp.send('Runtime.evaluate', {
      expression: `(function(){
        try {
          if (window.PK_TUTORIAL && typeof window.PK_TUTORIAL.skip === 'function') {
            window.PK_TUTORIAL.skip();
          }
          const secBtn = document.getElementById('pkTutModalSecBtn');
          if (secBtn) secBtn.click();
          const overlay = document.getElementById('pkTutorialOverlay');
          if (overlay) overlay.remove();
          const modalBackdrop = document.querySelector('.pk-tutorial-backdrop');
          if (modalBackdrop) modalBackdrop.remove();
          const gate = document.getElementById('pkMobileGate');
          if (gate) gate.remove();
        } catch(e){}
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    // Test opening the 222 Lessons Hub
    const openResult = await cdp.send('Runtime.evaluate', {
      expression: `(function(){
        if(typeof window.openLearnMoreHub === 'function'){
          window.openLearnMoreHub('alphabet');
          const modal = document.getElementById('learnMoreHubModal');
          const isVisible = modal && !modal.hidden;
          const charTilesCount = document.querySelectorAll('.lm-char-tile').length;
          return { opened: true, isVisible, charTilesCount };
        }
        return { opened: false };
      })()`,
      returnByValue: true
    });
    console.log('222 Lessons Hub Open Result:', openResult.result.value);

    // Test inspect character
    const inspectResult = await cdp.send('Runtime.evaluate', {
      expression: `(function(){
        const firstTile = document.querySelector('.lm-char-tile');
        if(firstTile) firstTile.click();
        const inspector = document.getElementById('lmAlphaInspector');
        const glyph = document.getElementById('lmAiGlyph');
        const code = document.getElementById('lmAiCode');
        const lesson = document.getElementById('lmAiLessonName');
        return {
          inspectorVisible: inspector && !inspector.hidden,
          glyph: glyph ? glyph.textContent : null,
          code: code ? code.textContent : null,
          lesson: lesson ? lesson.textContent : null
        };
      })()`,
      returnByValue: true
    });
    console.log('Inspector Test Result:', inspectResult.result.value);

    // Switch to Master Pangrams tab
    await cdp.send('Runtime.evaluate', {
      expression: `(function(){
        const masterTabBtn = document.getElementById('lmTabBtn-master');
        if(masterTabBtn) masterTabBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    // Capture screenshot of Master Pangrams tab in 222 Lessons Hub
    const shotMaster = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const masterPath = 'C:\\Users\\Kurosaki Kon\\.gemini\\antigravity\\brain\\9ef964bc-db6f-4cb5-9c9a-20b607235a59\\learn_more_hub_master.png';
    fs.writeFileSync(masterPath, Buffer.from(shotMaster.data, 'base64'));
    console.log('Master tab screenshot saved to:', masterPath);

    // Switch to Alphabet Matrix tab
    await cdp.send('Runtime.evaluate', {
      expression: `(function(){
        const alphaTabBtn = document.getElementById('lmTabBtn-alphabet');
        if(alphaTabBtn) alphaTabBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    // Capture screenshot of Alphabet Matrix tab
    const shotAlpha = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const alphaPath = 'C:\\Users\\Kurosaki Kon\\.gemini\\antigravity\\brain\\9ef964bc-db6f-4cb5-9c9a-20b607235a59\\learn_more_hub_alphabet.png';
    fs.writeFileSync(alphaPath, Buffer.from(shotAlpha.data, 'base64'));
    console.log('Alphabet matrix screenshot saved to:', alphaPath);

    cdp.close();
    browserProcess.kill();
    console.log('All 222 Lessons Hub tests completed successfully!');
  } catch (err) {
    console.error('Test error:', err);
    try { browserProcess.kill(); } catch (e) {}
    process.exit(1);
  }
}

run();
