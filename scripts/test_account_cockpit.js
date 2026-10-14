const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9226;
const userDataDir = path.join(os.tmpdir(), 'edge_account_test_' + Date.now());

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

    console.log('Navigating to http://localhost:5174/index.html ...');
    await client.send('Page.navigate', { url: 'http://localhost:5174/index.html' });
    await new Promise(r => setTimeout(r, 2200));

    // Dismiss tutorial if present
    await client.evaluate(`
      (function() {
        localStorage.setItem('khmerTutorialCompleted', 'true');
        const tutCard = document.getElementById('pkTutorialModalCard');
        if (tutCard) tutCard.remove();
        const tutBack = document.querySelector('.pk-tutorial-backdrop, #pkTutorialBackdrop');
        if (tutBack) tutBack.remove();
        if (window.PK_TUTORIAL) {
          try { window.PK_TUTORIAL.dismiss(); } catch (e) {}
        }
      })()
    `);

    // 1. Verify workspace scrollbar styling
    const scrollbarStyles = await client.evaluate(`
      (function() {
        return {
          windowScrollY: window.scrollY,
          bodyOverflow: getComputedStyle(document.body).overflow,
          htmlOverflow: getComputedStyle(document.documentElement).overflow
        };
      })()
    `);
    console.log('Scrollbar styles check:', scrollbarStyles);

    // Capture clean workspace screenshot
    const wsScreenshot = await client.send('Page.captureScreenshot', { format: 'png' });
    const wsArtifactPath = path.join('C:\\Users\\Kurosaki Kon\\.gemini\\antigravity\\brain\\9ef964bc-db6f-4cb5-9c9a-20b607235a59', 'workspace_clean_scrollbar.png');
    fs.writeFileSync(wsArtifactPath, Buffer.from(wsScreenshot.data, 'base64'));
    console.log('Clean workspace screenshot saved to:', wsArtifactPath);

    // 2. Open Sign In modal
    console.log('Opening Sign In modal...');
    await client.evaluate(`
      (function() {
        const authBtn = document.getElementById('authOpenBtn');
        if (authBtn) authBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));

    const signInScreenshot = await client.send('Page.captureScreenshot', { format: 'png' });
    const signInPath = path.join('C:\\Users\\Kurosaki Kon\\.gemini\\antigravity\\brain\\9ef964bc-db6f-4cb5-9c9a-20b607235a59', 'auth_signin_modal.png');
    fs.writeFileSync(signInPath, Buffer.from(signInScreenshot.data, 'base64'));
    console.log('Sign In screenshot saved to:', signInPath);

    // 3. Switch to Sign Up modal
    console.log('Switching to Sign Up modal...');
    await client.evaluate(`
      (function() {
        const signUpTab = document.getElementById('authTabSignUp');
        if (signUpTab) signUpTab.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));

    const signUpScreenshot = await client.send('Page.captureScreenshot', { format: 'png' });
    const signUpPath = path.join('C:\\Users\\Kurosaki Kon\\.gemini\\antigravity\\brain\\9ef964bc-db6f-4cb5-9c9a-20b607235a59', 'auth_signup_modal.png');
    fs.writeFileSync(signUpPath, Buffer.from(signUpScreenshot.data, 'base64'));
    console.log('Sign Up screenshot saved to:', signUpPath);

    // 4. Open Account Panel with mock user and rich telemetry data
    console.log('Opening Your Account panel with luxury telemetry...');
    const modalOpened = await client.evaluate(`
      (function() {
        const mockUser = {
          id: 'usr_test_pk_4889',
          username: 'Phanna Kurosaki',
          email: 'phanna@pk-khmer-type.dev',
          createdAt: '2026-01-15T08:00:00Z',
          avatar: ''
        };

        window.getAccountSnapshot = function() {
          return {
            lessonsMastered: 48,
            totalLessons: 77,
            bestWpm: 92,
            streak: 14,
            trialBest: 88,
            raceBestWpm: 95,
            accuracy: 99,
            totalChars: 38450,
            practiceMinutes: 420,
            daysPracticed: 28
          };
        };

        const authModal = document.getElementById('authModal');
        const accountPanel = document.getElementById('accountPanel');
        const signInForm = document.getElementById('signInForm');
        const signUpForm = document.getElementById('signUpForm');
        const authCard = authModal ? authModal.querySelector('.auth-card') : null;

        if (authCard) {
          authCard.classList.add('is-account');
        }

        // Show panel
        [signInForm, signUpForm].forEach(f => { if (f) f.hidden = true; });
        if (accountPanel) accountPanel.hidden = false;
        if (authModal) authModal.hidden = false;

        const authTabs = document.getElementById('authTabs');
        if (authTabs) authTabs.hidden = true;

        const authModalTitleText = document.getElementById('authModalTitleText');
        if (authModalTitleText) authModalTitleText.textContent = 'Your Account';

        // Trigger populate
        document.getElementById('authAccountName').textContent = mockUser.username;
        document.getElementById('authAccountEmail').textContent = mockUser.email;
        document.getElementById('authAccountJoined').textContent = 'Jan 15, 2026';
        document.getElementById('authAccountRank').textContent = 'Grand Master';
        document.getElementById('accXpFill').style.width = '78%';
        document.getElementById('accXpLabel').innerHTML = '48 mastered — <b>29</b> more to Legend Scribe';

        // Overview stats grid
        const grid = document.getElementById('accountStatsGrid');
        const snap = window.getAccountSnapshot();
        const tiles = [
          ['scroll', snap.lessonsMastered + '/' + snap.totalLessons, 'Lessons Mastered'],
          ['zap', snap.bestWpm + ' WPM', 'Best WPM'],
          ['flame', snap.streak + ' Days', 'Day Streak'],
          ['castle', snap.trialBest + ' WPM', 'Temple Trial Best'],
          ['flag', snap.raceBestWpm + ' WPM', 'Race Best WPM'],
          ['target', snap.accuracy + '%', 'Avg Accuracy'],
          ['edit', snap.totalChars.toLocaleString(), 'Total Characters'],
          ['timer', snap.practiceMinutes + 'm', 'Practice Time'],
          ['calendar', snap.daysPracticed + ' Days', 'Days Practiced']
        ];
        
        function makeIcon(name) {
          return '<svg class="pk-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>';
        }

        grid.innerHTML = tiles.map(([icon, val, label]) => \`
          <div class="stat-tile">
            <div class="stat-tile-icon">\${makeIcon(icon)}</div>
            <div class="stat-tile-val">\${val}</div>
            <div class="stat-tile-label">\${label}</div>
          </div>
        \`).join('');

        // Switch to overview tab
        const tabBtn = document.getElementById('accTabBtnOverview');
        if (tabBtn) tabBtn.click();

        return {
          isOpen: !authModal.hidden,
          isAccountPanelVisible: !accountPanel.hidden,
          user: mockUser.username
        };
      })()
    `);
    console.log('Account panel opened result:', modalOpened);
    await new Promise(r => setTimeout(r, 600));

    // Capture Overview & Stats Screenshot
    const overviewScreenshot = await client.send('Page.captureScreenshot', { format: 'png' });
    const overviewPath = path.join('C:\\Users\\Kurosaki Kon\\.gemini\\antigravity\\brain\\9ef964bc-db6f-4cb5-9c9a-20b607235a59', 'your_account_overview.png');
    fs.writeFileSync(overviewPath, Buffer.from(overviewScreenshot.data, 'base64'));
    console.log('Your Account Overview screenshot saved to:', overviewPath);

    client.close();
    console.log('All screenshots captured successfully!');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    try { browserProcess.kill('SIGKILL'); } catch (e) {}
    try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}
  }
}

run();
