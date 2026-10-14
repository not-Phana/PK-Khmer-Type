const fs = require('fs');

async function run() {
  const wsUrl = 'ws://localhost:9223/devtools/page/780C634D5C2A6E1411F79AE54BA4F3B8';
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let idCounter = 1;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = idCounter++;
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

  console.log('--- RELOADING PAGE ---');
  errors.length = 0;
  logs.length = 0;
  await send('Page.reload', { ignoreCache: true });
  await new Promise((r) => setTimeout(r, 2000));

  console.log('Page errors on load:', JSON.stringify(errors, null, 2));

  // Check state
  const evalRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const report = {};
      report.title = document.title;
      report.lessonStripCards = document.querySelectorAll('#lessonStrip .lesson-card').length;
      report.lessonActive = window.lessonActive;
      report.currentLesson = window.currentLesson ? window.currentLesson.id : null;
      report.layoutId = window.currentLayoutId;
      report.keysOnBoard = document.querySelectorAll('.key').length;

      // Check tutorial overlay
      const tutOverlay = document.getElementById('pkTutorialOverlay');
      report.tutOverlayVisible = tutOverlay ? !tutOverlay.hidden && window.getComputedStyle(tutOverlay).display !== 'none' : false;
      report.tutOverlayPointerEvents = tutOverlay ? window.getComputedStyle(tutOverlay).pointerEvents : null;

      // Check quick guide
      const qg = document.getElementById('guideDock');
      report.quickGuidePresent = !!qg;
      report.quickGuideVisible = qg ? !qg.hidden && window.getComputedStyle(qg).display !== 'none' : false;

      // Check hardware cursor style
      const cursorProp = window.getComputedStyle(document.body).cursor;
      report.bodyCursor = cursorProp;

      return report;
    })()`,
    returnByValue: true
  });

  console.log('Initial report:', evalRes.result ? evalRes.result.value : evalRes);

  // Test 1: Start lesson by clicking first lesson card
  const clickCardRes = await send('Runtime.evaluate', {
    expression: `(() => {
      // Dismiss welcome modal if showing
      if (window.PK_TUTORIAL && typeof window.PK_TUTORIAL.skip === 'function') {
        window.PK_TUTORIAL.skip();
      }

      const firstCard = document.querySelector('#lessonStrip .lesson-card:not(.locked)');
      if (!firstCard) return { success: false, reason: 'no card found' };
      firstCard.click();
      return {
        success: true,
        lessonActive: window.lessonActive,
        currentLessonId: window.currentLesson ? window.currentLesson.id : null,
        panelDisplay: window.getComputedStyle(document.getElementById('lessonPanel')).display,
        targetChar: window.lessonChars ? window.lessonChars[window.lessonIndex] : null,
        targetKeyId: window.lessonKeyIds ? window.lessonKeyIds[window.lessonIndex] : null,
        targetLayer: window.lessonLayers ? window.lessonLayers[window.lessonIndex] : null,
        charCount: window.lessonChars ? window.lessonChars.length : 0
      };
    })()`,
    returnByValue: true
  });
  console.log('Click first lesson card result:', clickCardRes.result ? clickCardRes.result.value : clickCardRes);

  // Test 2: Type matching character using physical keyboard
  const typeRes = await send('Runtime.evaluate', {
    expression: `(() => {
      if (!window.lessonActive || !window.lessonChars) return { success: false, reason: 'lesson not active' };
      const initialIdx = window.lessonIndex;
      const targetCh = window.lessonChars[initialIdx];
      const targetKeyId = window.lessonKeyIds[initialIdx];
      const targetLayer = window.lessonLayers[initialIdx];

      if (targetLayer === 'shift') {
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ShiftLeft', key: 'Shift', bubbles: true, cancelable: true }));
      }

      let code = 'Space';
      if (targetKeyId !== 'space') {
        code = Object.keys(CODE_MAP).find(c => CODE_MAP[c] === targetKeyId) || 'Key' + targetKeyId.toUpperCase();
      }

      window.dispatchEvent(new KeyboardEvent('keydown', { code, key: targetCh, shiftKey: targetLayer === 'shift', bubbles: true, cancelable: true }));

      if (targetLayer === 'shift') {
        window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ShiftLeft', key: 'Shift', bubbles: true, cancelable: true }));
      }

      return {
        success: true,
        targetCh,
        targetKeyId,
        targetLayer,
        code,
        initialIdx,
        newIdx: window.lessonIndex,
        advanced: window.lessonIndex > initialIdx,
        mistakes: window.lessonMistakes,
        active: window.lessonActive
      };
    })()`,
    returnByValue: true
  });
  console.log('Type physical key result:', typeRes.result ? typeRes.result.value : typeRes);

  // Test 3: Test on-screen keyboard click
  const clickKeyRes = await send('Runtime.evaluate', {
    expression: `(() => {
      if (!window.lessonActive || !window.lessonChars) return { success: false, reason: 'lesson not active' };
      const initialIdx = window.lessonIndex;
      const targetKeyId = window.lessonKeyIds[initialIdx];
      const targetLayer = window.lessonLayers[initialIdx];

      const keyEl = window.keyEls[targetKeyId];
      if (!keyEl) return { success: false, reason: 'no keyEl for ' + targetKeyId };

      if (targetLayer === 'shift') window.physicalLayer = 'shift';
      keyEl.click();
      if (targetLayer === 'shift') window.physicalLayer = null;

      return {
        success: true,
        targetKeyId,
        initialIdx,
        newIdx: window.lessonIndex,
        advanced: window.lessonIndex > initialIdx
      };
    })()`,
    returnByValue: true
  });
  console.log('Click on-screen key result:', clickKeyRes.result ? clickKeyRes.result.value : clickKeyRes);

  // Test 4: Test Backspace
  const backspaceRes = await send('Runtime.evaluate', {
    expression: `(() => {
      if (!window.lessonActive) return { success: false, reason: 'lesson not active' };
      const idxBefore = window.lessonIndex;
      typeKey('backspace');
      const idxAfter = window.lessonIndex;
      return {
        idxBefore,
        idxAfter,
        decremented: idxAfter === idxBefore - 1
      };
    })()`,
    returnByValue: true
  });
  console.log('Backspace test result:', backspaceRes.result ? backspaceRes.result.value : backspaceRes);

  // Test 5: Exit lesson and test Free Typing
  const exitRes = await send('Runtime.evaluate', {
    expression: `(() => {
      if (typeof executeLessonExit === 'function') executeLessonExit();
      const outBefore = document.getElementById('output') ? document.getElementById('output').textContent : '';
      typeKey('f');
      const outAfter = document.getElementById('output') ? document.getElementById('output').textContent : '';
      return {
        lessonActive: window.lessonActive,
        panelDisplay: window.getComputedStyle(document.getElementById('lessonPanel')).display,
        manuscriptDisplay: window.getComputedStyle(document.getElementById('manuscript')).display,
        outBefore,
        outAfter,
        typed: outAfter.length > outBefore.length
      };
    })()`,
    returnByValue: true
  });
  console.log('Exit lesson and free typing result:', exitRes.result ? exitRes.result.value : exitRes);

  // Test 6: Quick Guide minimize and expand toggle
  const guideToggleRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const qg = document.getElementById('guideDock');
      const minBtn = document.getElementById('guideMinBtn');
      if (!qg || !minBtn) return { success: false, reason: 'no guide or minBtn' };

      const initiallyMinimized = qg.classList.contains('minimized');
      minBtn.click();
      const afterFirstClick = qg.classList.contains('minimized');
      minBtn.click();
      const afterSecondClick = qg.classList.contains('minimized');

      return {
        success: true,
        initiallyMinimized,
        afterFirstClick,
        afterSecondClick,
        toggledCleanly: afterFirstClick !== initiallyMinimized && afterSecondClick === initiallyMinimized
      };
    })()`,
    returnByValue: true
  });
  console.log('Quick Guide minimize toggle result:', guideToggleRes.result ? guideToggleRes.result.value : guideToggleRes);

  console.log('Final errors encountered:', errors);
  ws.close();
}

run().catch(console.error);
