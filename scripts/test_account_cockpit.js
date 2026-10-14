const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9225;
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

    // 2. Open Account Panel with mock user and rich telemetry data
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

    // 3. Switch to Cloud Storage Vault tab
    console.log('Switching to Cloud Storage Vault tab...');
    await client.evaluate(`
      (function() {
        const vaultBtn = document.getElementById('accTabBtnVault');
        if (vaultBtn) vaultBtn.click();
        
        // Add sample cloud files to demonstrate the vault
        const filesList = document.getElementById('accCloudFilesList');
        const emptyEl = document.getElementById('accCloudFilesEmpty');
        if (emptyEl) emptyEl.style.display = 'none';

        const sampleFiles = [
          { name: 'pk_progress_backup_2026-10-14.json', size: '14.2 KB', date: 'Oct 14, 2026', type: 'Backup' },
          { name: 'avatar_cyber_gold_phanna.webp', size: '48.6 KB', date: 'Oct 12, 2026', type: 'Avatar' },
          { name: 'custom_typing_manuscript.txt', size: '6.8 KB', date: 'Oct 09, 2026', type: 'Document' }
        ];

        filesList.innerHTML = sampleFiles.map(f => \`
          <div class="acc-cloud-file-card" style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;margin-bottom:8px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <svg class="pk-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffd166" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <div>
                <div style="font-size:0.78rem;font-weight:600;color:#fff;">\${f.name}</div>
                <div style="font-size:0.65rem;color:#8da4d4;">\${f.size} · \${f.type} · \${f.date}</div>
              </div>
            </div>
            <div style="display:flex;gap:6px;">
              <button class="acc-vault-btn" style="padding:4px 8px;font-size:0.65rem;">Download</button>
              <button class="acc-vault-btn" style="padding:4px 8px;font-size:0.65rem;border-color:rgba(255,59,86,0.4);color:#fca5a5;">Delete</button>
            </div>
          </div>
        \`).join('');

        document.getElementById('accCloudVaultQuota').textContent = '3 Files · 69.6 KB';
      })()
    `);
    await new Promise(r => setTimeout(r, 600));

    // Capture Cloud Storage Vault Screenshot
    const vaultScreenshot = await client.send('Page.captureScreenshot', { format: 'png' });
    const vaultPath = path.join('C:\\Users\\Kurosaki Kon\\.gemini\\antigravity\\brain\\9ef964bc-db6f-4cb5-9c9a-20b607235a59', 'your_account_vault.png');
    fs.writeFileSync(vaultPath, Buffer.from(vaultScreenshot.data, 'base64'));
    console.log('Your Account Vault screenshot saved to:', vaultPath);

    // 4. Switch to Security & Session tab
    console.log('Switching to Security & Session tab...');
    await client.evaluate(`
      (function() {
        const secBtn = document.getElementById('accTabBtnSecurity');
        if (secBtn) secBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));

    // Capture Security & Session Screenshot
    const secScreenshot = await client.send('Page.captureScreenshot', { format: 'png' });
    const secPath = path.join('C:\\Users\\Kurosaki Kon\\.gemini\\antigravity\\brain\\9ef964bc-db6f-4cb5-9c9a-20b607235a59', 'your_account_security.png');
    fs.writeFileSync(secPath, Buffer.from(secScreenshot.data, 'base64'));
    console.log('Your Account Security screenshot saved to:', secPath);

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
