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

  await send('Page.enable');
  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Page.reload', { ignoreCache: true });
  await new Promise((r) => setTimeout(r, 1500));

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      // Trigger tutorial step 1
      window.PK_TUTORIAL.start(true);
      window.PK_TUTORIAL.goToStep('lessons-sidebar');

      // Now find a lesson card
      const card = document.querySelector('.lesson-card');
      if (!card) return { error: 'no card' };
      card.scrollIntoView({ block: 'center', inline: 'center' });
      const rect = card.getBoundingClientRect();
      const elAtPoint = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);

      return {
        cardTagName: card.tagName,
        cardClass: card.className,
        rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
        elAtPointTagName: elAtPoint ? elAtPoint.tagName : null,
        elAtPointClass: elAtPoint ? elAtPoint.className : null,
        elAtPointId: elAtPoint ? elAtPoint.id : null,
        isSame: elAtPoint === card || (card && card.contains(elAtPoint))
      };
    })()`,
    returnByValue: true
  });

  console.log('Element from point during tutorial:', res.result.value);
  ws.close();
}

test().catch(console.error);
