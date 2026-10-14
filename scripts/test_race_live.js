const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9227;
const userDataDir = path.join(os.tmpdir(), 'edge_race_test_' + Date.now());

const browserProcess = spawn(EDGE_PATH, [
  `--remote-debugging-port=${PORT}`,
  '--headless=new',
  `--user-data-dir=${userDataDir}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-gpu',
  '--window-size=1440,920',
  'about:blank'
], {
  detached: false,
  stdio: 'ignore'
});

async function waitForHttp(url, maxRetries = 25) {
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
            if (data.error) cb.reject(new Error(data.error.message || JSON.stringify(data.error)));
            else cb.resolve(data.result);
          }
        } catch (e) {}
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  try {
    const tabs = await waitForHttp(`http://127.0.0.1:${PORT}/json`);
    const pageTab = tabs.find(t => t.type === 'page');
    if (!pageTab) throw new Error('No page target found');

    const client = new CDPClient(pageTab.webSocketDebuggerUrl);
    await client.connect();
    await client.send('Page.enable');
    await client.send('DOM.enable');
    await client.send('Runtime.enable');

    client.ws.addEventListener('message', (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (data.method === 'Runtime.consoleAPICalled') {
          console.log('[Browser Console]', data.params.type, data.params.args.map(a => a.value || a.description).join(' '));
        } else if (data.method === 'Runtime.exceptionThrown') {
          console.error('[Browser Exception]', data.params.exceptionDetails);
        }
      } catch(e) {}
    });

    await client.send('Page.addScriptToEvaluateOnNewDocument', {
      source: `localStorage.setItem('khmerTutorialCompleted', 'true');`
    });

    console.log('Navigating to http://localhost:5174/index.html ...');
    await client.send('Page.navigate', { url: 'http://localhost:5174/index.html' });
    await new Promise(r => setTimeout(r, 2200));

    // Dismiss tutorial if still present
    await client.evaluate(`
      (function() {
        const overlay = document.getElementById('pkTutorialOverlay');
        if (overlay) overlay.remove();
        const card = document.getElementById('pkTutorialModalCard');
        if (card) card.remove();
      })()
    `);

    // 1. Click Typing Race Toggle
    console.log('Clicking Typing Race toggle...');
    const raceToggleRes = await client.evaluate(`
      (function() {
        const btn = document.getElementById('raceToggle');
        if (!btn) return { error: 'raceToggle not found' };
        btn.click();
        const panel = document.getElementById('racePanel');
        return {
          panelHidden: panel ? panel.hidden : null,
          panelDisplay: panel ? window.getComputedStyle(panel).display : null,
          raceMode: window.raceMode
        };
      })()
    `);
    console.log('Race Toggle Result:', raceToggleRes);

    // 2. Select AI Bot (e.g. Medium - Angkor AI 42 WPM)
    const selectBotRes = await client.evaluate(`
      (function() {
        const botBtn = document.querySelector('#raceAiOpponentRow button[data-ai-bot="medium"]');
        if (botBtn) botBtn.click();
        const diffBtn = document.querySelector('#raceDifficultyRow button[data-difficulty="easy"]');
        if (diffBtn) diffBtn.click();
        const lenBtn = document.querySelector('#raceLengthRow button[data-length="15"]');
        if (lenBtn) lenBtn.click();
        return {
          botPillChecked: botBtn ? botBtn.getAttribute('aria-checked') : null,
          diffChecked: diffBtn ? diffBtn.getAttribute('aria-checked') : null,
          lenChecked: lenBtn ? lenBtn.getAttribute('aria-checked') : null
        };
      })()
    `);
    console.log('Bot & Difficulty Selection Result:', selectBotRes);

    // Capture Race Setup Screenshot
    const setupShot = await client.send('Page.captureScreenshot', { format: 'png' });
    const setupPath = path.join('C:\\Users\\Kurosaki Kon\\.gemini\\antigravity\\brain\\9ef964bc-db6f-4cb5-9c9a-20b607235a59', 'race_setup_screen.png');
    fs.writeFileSync(setupPath, Buffer.from(setupShot.data, 'base64'));
    console.log('Race setup screenshot saved to:', setupPath);

    // 3. Start the Race
    console.log('Clicking Start Race...');
    const startRes = await client.evaluate(`
      (function() {
        const startBtn = document.getElementById('raceStartBtn');
        if (!startBtn) return { error: 'raceStartBtn not found' };
        startBtn.click();
        return {
          countingDown: window.raceCountingDown,
          raceActive: window.raceActive
        };
      })()
    `);
    console.log('Start Race Result:', startRes);

    // Capture Countdown Screenshot
    await new Promise(r => setTimeout(r, 700));
    const countdownShot = await client.send('Page.captureScreenshot', { format: 'png' });
    const countdownPath = path.join('C:\\Users\\Kurosaki Kon\\.gemini\\antigravity\\brain\\9ef964bc-db6f-4cb5-9c9a-20b607235a59', 'race_countdown_screen.png');
    fs.writeFileSync(countdownPath, Buffer.from(countdownShot.data, 'base64'));
    console.log('Race countdown screenshot saved to:', countdownPath);

    // Wait for countdown to finish (GO!)
    console.log('Waiting for countdown to finish...');
    await new Promise(r => setTimeout(r, 3200));

    const liveState = await client.evaluate(`
      (function() {
        return {
          raceActive: window.raceActive,
          raceCharsCount: window.raceChars ? window.raceChars.length : 0,
          raceCharsSample: window.raceChars ? window.raceChars.slice(0, 15).join('') : '',
          currentAiBot: window.currentAiBot,
          aiTargetWpm: window.aiTargetWpm,
          playerWpm: document.getElementById('raceWpmVal').textContent,
          playerPct: document.getElementById('raceTrackPct').textContent,
          aiPct: document.getElementById('raceTrackAiPct').textContent,
          leadBadge: document.getElementById('raceLeadBadge') ? document.getElementById('raceLeadBadge').className : null,
          leadText: document.getElementById('raceLeadText') ? document.getElementById('raceLeadText').textContent : null
        };
      })()
    `);
    console.log('Live Race State:', liveState);

    // 4. Simulate typing characters one by one with realistic delay
    console.log('Simulating typing 14 characters...');
    for (let c = 0; c < 14; c++) {
      await client.evaluate(`
        (function() {
          if (!window.raceActive || !window.raceChars) return;
          const charToType = window.raceChars[window.raceIndex];
          const stroke = { charProduced: charToType, id: window.raceKeyIds[window.raceIndex] };
          if (typeof window.raceHandleChar === 'function') {
            window.raceHandleChar(charToType, null, stroke);
          }
        })()
      `);
      await new Promise(r => setTimeout(r, 120));
    }

    const midRaceState = await client.evaluate(`
      (function() {
        return {
          raceIndex: window.raceIndex,
          correctTotal: window.raceCorrectTotal,
          mistakes: window.raceMistakes,
          playerWpm: document.getElementById('raceWpmVal').textContent,
          playerPct: document.getElementById('raceTrackPct').textContent,
          aiPct: document.getElementById('raceTrackAiPct').textContent,
          aiCharsTyped: window.aiCharsTyped,
          leadBadge: document.getElementById('raceLeadBadge') ? document.getElementById('raceLeadBadge').className : null,
          leadText: document.getElementById('raceLeadText') ? document.getElementById('raceLeadText').textContent : null,
          aiRacerName: document.getElementById('raceAiRacerName') ? document.getElementById('raceAiRacerName').textContent : null
        };
      })()
    `);
    console.log('Mid-Race State:', midRaceState);

    // Capture Race Live Screenshot
    const liveShot = await client.send('Page.captureScreenshot', { format: 'png' });
    const livePath = path.join('C:\\Users\\Kurosaki Kon\\.gemini\\antigravity\\brain\\9ef964bc-db6f-4cb5-9c9a-20b607235a59', 'race_live_screen.png');
    fs.writeFileSync(livePath, Buffer.from(liveShot.data, 'base64'));
    console.log('Race live screenshot saved to:', livePath);

    // 5. Let the race run until 15s limit or finish to verify the victory/defeat celebration
    console.log('Waiting for 15s race to complete...');
    await new Promise(r => setTimeout(r, 12000));

    const finalState = await client.evaluate(`
      (function() {
        const overlay = document.querySelector('.race-result-overlay');
        return {
          raceActive: window.raceActive,
          hasResultOverlay: Boolean(overlay),
          resultTitle: overlay ? overlay.querySelector('h2').textContent : null,
          resultDuel: overlay && overlay.querySelector('.race-duel-badge') ? overlay.querySelector('.race-duel-badge').textContent.trim() : null,
          statsGrid: overlay ? Array.from(overlay.querySelectorAll('.race-result-grid div')).map(d => d.textContent.trim()) : null
        };
      })()
    `);
    console.log('Final Result State:', finalState);

    // Capture Result Screenshot
    const resultShot = await client.send('Page.captureScreenshot', { format: 'png' });
    const resultPath = path.join('C:\\Users\\Kurosaki Kon\\.gemini\\antigravity\\brain\\9ef964bc-db6f-4cb5-9c9a-20b607235a59', 'race_result_screen.png');
    fs.writeFileSync(resultPath, Buffer.from(resultShot.data, 'base64'));
    console.log('Race result screenshot saved to:', resultPath);

    client.close();
  } catch (err) {
    console.error('Race test error:', err);
  } finally {
    try { browserProcess.kill('SIGKILL'); } catch (e) {}
    try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}
  }
}

run();
