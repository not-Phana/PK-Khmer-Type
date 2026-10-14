const fs = require('fs');

async function test() {
  const wsUrl = 'ws://localhost:9223/devtools/page/780C634D5C2A6E1411F79AE54BA4F3B8';
  const ws = new WebSocket(wsUrl);

  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = Math.floor(Math.random() * 100000);
      const listener = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === id) {
          ws.removeEventListener('message', listener);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', listener);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const logs = [];
  const errors = [];

  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      logs.push({ type: msg.params.type, text: msg.params.args.map(a => a.value || a.description).join(' ') });
    } else if (msg.method === 'Runtime.exceptionThrown') {
      errors.push(msg.params.exceptionDetails);
    }
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  errors.length = 0;
  logs.length = 0;
  await send('Page.reload', { ignoreCache: true });
  await new Promise((r) => setTimeout(r, 1500));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('live_screen.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved live_screen.png');

  // Check DOM state
  const state = await send('Runtime.evaluate', {
    expression: `(() => {
      const activeModals = Array.from(document.querySelectorAll('.modal, .pk-tutorial-wrapper, .tutorial-overlay')).filter(m => !m.hidden && window.getComputedStyle(m).display !== 'none').map(m => ({ id: m.id, cls: m.className, z: window.getComputedStyle(m).zIndex }));

      const lessonCards = document.querySelectorAll('.lesson-card');
      const lessonStrip = document.getElementById('lessonStrip');

      // Check keyEls and board
      const board = document.getElementById('board');
      const keyCount = document.querySelectorAll('.key').length;

      // Check if clicking works on lesson 1
      const firstCard = document.querySelector('.lesson-card');
      let cardClickResult = null;
      if (firstCard) {
        firstCard.click();
        cardClickResult = {
          lessonActive: window.lessonActive,
          currentLessonId: window.currentLesson?.id,
          lessonChars: window.lessonChars?.slice(0, 5)
        };
      }

      // Check if typing works
      let typeResult = null;
      if (window.lessonActive) {
        const ev = new KeyboardEvent('keydown', { code: 'KeyF', key: 'f', bubbles: true, cancelable: true });
        window.dispatchEvent(ev);
        typeResult = {
          newIndex: window.lessonIndex,
          mistakes: window.lessonMistakes,
          lessonActive: window.lessonActive
        };
      } else {
        // Free typing test
        const before = document.getElementById('output')?.textContent;
        const ev = new KeyboardEvent('keydown', { code: 'KeyF', key: 'f', bubbles: true, cancelable: true });
        window.dispatchEvent(ev);
        const after = document.getElementById('output')?.textContent;
        typeResult = { before, after };
      }

      return {
        activeModals,
        lessonCardsCount: lessonCards.length,
        hasStrip: !!lessonStrip,
        hasBoard: !!board,
        keyCount,
        cardClickResult,
        typeResult,
        consoleErrors: window.__errors || []
      };
    })()`,
    returnByValue: true
  });

  console.log('LIVE STATE:', JSON.stringify(state.result.value, null, 2));
  console.log('RUNTIME ERRORS:', errors);

  ws.close();
}

test().catch(console.error);
