const fs = require('fs');

async function test() {
  const wsUrl = 'ws://localhost:9223/devtools/page/780C634D5C2A6E1411F79AE54BA4F3B8';
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

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

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      // Find all fixed/absolute elements with high z-index that might intercept pointer events
      const all = Array.from(document.querySelectorAll('*'));
      const fixedHigh = [];
      for (const el of all) {
        const st = window.getComputedStyle(el);
        if ((st.position === 'fixed' || st.position === 'absolute') && parseInt(st.zIndex || 0) > 50) {
          if (!el.hidden && st.display !== 'none' && st.visibility !== 'hidden' && st.pointerEvents !== 'none') {
            const r = el.getBoundingClientRect();
            if (r.width > 200 && r.height > 200) {
              fixedHigh.push({ id: el.id, cls: el.className, zIndex: st.zIndex, pos: st.position, w: r.width, h: r.height });
            }
          }
        }
      }
      return fixedHigh;
    })()`,
    returnByValue: true
  });

  console.log('Fixed high z-index elements:', res.result ? res.result.value : res);
  ws.close();
}

test().catch(console.error);
