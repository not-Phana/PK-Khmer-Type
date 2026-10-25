/* ============================================================
   PK Khmer Type — Typing Test Lab Assessment System
   ============================================================
   Dedicated testing experience featuring 6 specialized test types:
   1. Quick Test (30s)
   2. Accuracy Test (60s, 98% target)
   3. Speed Test (60s sprint)
   4. Weak-Key Test (targeting identified struggling keys)
   5. Lesson Review Test (reviewing completed curriculum)
   6. Custom Text Test (learner-provided text with safe validation)
   
   Measures: WPM, CPM (Khmer Characters Per Minute), Accuracy.
   Strict Zero-Emoji Policy: Pure SVG vector icons and typography.
   ============================================================ */

(function(global){
  'use strict';

  const STORAGE_KEY = 'pk_test_results_v2';

  /* Verified Text Banks by Layout and Preset */
  const TEST_PRESET_TEXTS = {
    standard: {
      quick: 'កម្ពុជា ប្រទេសជាតិ សន្តិភាព សាមគ្គីភាព អភិវឌ្ឍន៍ វប្បធម៌ខ្មែរ រុងរឿង សុខដុមរមនា',
      accuracy: 'ព្រះរាជាណាចក្រកម្ពុជា ជាប្រទេសដែលមានប្រវត្តិសាស្ត្រយូរលង់ និងមានប្រាសាទអង្គរវត្តដ៏ល្បីល្បាញក្នុងពិភពលោក។ ប្រជាជនកម្ពុជាមានសាមគ្គីភាព និងស្រឡាញ់សន្តិភាព។',
      speed: 'យើងទាំងអស់គ្នាត្រូវរួមគ្នាថែរក្សាការពារវប្បធម៌ និងអក្សរសាស្ត្រជាតិឱ្យបានគង់វង្ស ដើម្បីអនាគតកូនចៅជំនាន់ក្រោយ។ ការរៀនវាយអក្សរខ្មែរជួយឱ្យការងារកាន់តែរហ័ស។',
      review: 'ដថ ងក ាិ ីើ សដ សាលា រៀន កូនសិស្ស គ្រូបង្រៀន សៀវភៅ ប៊ិច បន្ទាត់ ក្តារខៀន ថ្នាក់រៀន ចំណេះដឹង បញ្ញា ស្មារតី ឧស្សាហ៍ព្យាយាម ជោគជ័យ។'
    },
    nida: {
      quick: 'កម្ពុជា ប្រទេសជាតិ សន្តិភាព សាមគ្គីភាព អភិវឌ្ឍន៍ វប្បធម៌ខ្មែរ រុងរឿង សុខដុមរមនា',
      accuracy: 'ព្រះរាជាណាចក្រកម្ពុជា ជាប្រទេសដែលមានប្រវត្តិសាស្ត្រយូរលង់ និងមានប្រាសាទអង្គរវត្តដ៏ល្បីល្បាញក្នុងពិភពលោក។ ប្រជាជនកម្ពុជាមានសាមគ្គីភាព និងស្រឡាញ់សន្តិភាព។',
      speed: 'យើងទាំងអស់គ្នាត្រូវរួមគ្នាថែរក្សាការពារវប្បធម៌ និងអក្សរសាស្ត្រជាតិឱ្យបានគង់វង្ស ដើម្បីអនាគតកូនចៅជំនាន់ក្រោយ។ ការរៀនវាយអក្សរខ្មែរជួយឱ្យការងារកាន់តែរហ័ស។',
      review: 'ដថ ងក ាិ ីើ សដ សាលា រៀន កូនសិស្ស គ្រូបង្រៀន សៀវភៅ ប៊ិច បន្ទាត់ ក្តារខៀន ថ្នាក់រៀន ចំណេះដឹង បញ្ញា ស្មារតី ឧស្សាហ៍ព្យាយាម ជោគជ័យ។'
    },
    english: {
      quick: 'the quick brown fox jumps over the lazy dog while practicing touch typing with high accuracy and speed',
      accuracy: 'Mastering touch typing requires consistent rhythm, correct finger placement on the home row, and patient daily practice without looking down at the keyboard keys.',
      speed: 'Focus and steady flow enable great writers to transcribe their thoughts directly onto the screen with effortless speed, natural confidence, and remarkable precision.',
      review: 'all ask sad fall glad flash salad flask dark lead leaf seed ease call real self free late deal rate talk'
    }
  };

  /* Helper to normalize layout string */
  function normalizeLayout(id){
    if(!id) return 'standard';
    const s = String(id).toLowerCase();
    if(s.includes('eng')) return 'english';
    if(s.includes('nida')) return 'nida';
    return 'standard';
  }

  /* Split text into logical typing units */
  function getUnits(text, layoutId){
    if(typeof global.splitIntoTypingUnits === 'function'){
      return global.splitIntoTypingUnits(text, layoutId);
    }
    if(typeof window !== 'undefined' && typeof window.splitIntoTypingUnits === 'function'){
      return window.splitIntoTypingUnits(text, layoutId);
    }
    // Fallback grapheme splitting
    const arr = [];
    for(let i = 0; i < text.length; i++){
      arr.push(text[i]);
    }
    return arr;
  }

  /* Compare produced keystroke with expected unit */
  function matchesUnit(val, expected){
    if(typeof global.compareTypingSequence === 'function'){
      return global.compareTypingSequence(val, expected);
    }
    if(typeof window !== 'undefined' && typeof window.compareTypingSequence === 'function'){
      return window.compareTypingSequence(val, expected);
    }
    return val === expected;
  }

  /* Active Test State */
  let state = {
    active: false,
    preset: 'quick',
    layoutId: 'standard',
    durationSec: 30,
    targetAccuracy: 95,
    text: '',
    units: [],
    currentIndex: 0,
    keystrokesCorrect: 0,
    keystrokesIncorrect: 0,
    mistakeChars: {},
    startTime: 0,
    elapsedMs: 0,
    timerInterval: null,
    completed: false,
    result: null
  };

  /* Persistence: Load & Save completed test records */
  function loadResults(){
    try {
      if(typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch(_e){
      return [];
    }
  }

  function saveResult(res){
    try {
      if(typeof localStorage === 'undefined') return;
      const all = loadResults();
      all.unshift(res);
      // Keep most recent 50 test results
      if(all.length > 50) all.length = 50;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch(_e){}
  }

  /* Generate test content according to preset */
  function resolveTestText(preset, layoutId, customText = ''){
    const l = normalizeLayout(layoutId);

    if(preset === 'custom'){
      const sanitized = String(customText || '').trim();
      if(!sanitized || sanitized.length < 5){
        return {
          valid: false,
          errorEn: 'Custom text must be at least 5 characters.',
          errorKm: 'អត្ថបទផ្ទាល់ខ្លួនត្រូវមានយ៉ាងហោចណាស់ ៥ តួអក្សរ។',
          text: ''
        };
      }
      if(sanitized.length > 2500){
        return {
          valid: false,
          errorEn: 'Custom text exceeds maximum length of 2,500 characters.',
          errorKm: 'អត្ថបទផ្ទាល់ខ្លួនលើសពីប្រវែងអតិបរមា ២,៥០០ តួអក្សរ។',
          text: ''
        };
      }
      return { valid: true, text: sanitized };
    }

    if(preset === 'weak-key'){
      // Dynamically assemble a weak-key drill if telemetry available
      let weakKeys = [];
      if(global.PK_ADAPTIVE && typeof global.PK_ADAPTIVE.evaluateWeaknesses === 'function'){
        const w = global.PK_ADAPTIVE.evaluateWeaknesses(l);
        if(w && w.needsPractice && w.needsPractice.length > 0){
          weakKeys = w.needsPractice.slice(0, 5).map(x => x.unit);
        }
      }
      if(weakKeys.length > 0){
        // Generate words containing these weak keys from vocabulary
        let vocab = [];
        if(global.PK_ADAPTIVE && typeof global.PK_ADAPTIVE.getVocabList === 'function'){
          vocab = global.PK_ADAPTIVE.getVocabList(l) || [];
        }
        const filtered = vocab.filter(w => weakKeys.some(k => w.includes(k)));
        if(filtered.length >= 6){
          return { valid: true, text: filtered.slice(0, 16).join(' ') };
        }
      }
      // Fallback to standard accuracy passage if no weak keys identified yet
      return { valid: true, text: TEST_PRESET_TEXTS[l].accuracy };
    }

    const bank = TEST_PRESET_TEXTS[l] || TEST_PRESET_TEXTS.standard;
    const text = bank[preset] || bank.quick;
    return { valid: true, text };
  }

  /* Setup a test configuration */
  function setupTest(options = {}){
    const preset = options.preset || 'quick';
    const layoutId = normalizeLayout(options.layoutId || 'standard');
    const customText = options.customText || '';

    let durationSec = 30;
    let targetAccuracy = 95;

    if(preset === 'accuracy'){
      durationSec = 60;
      targetAccuracy = 98;
    } else if(preset === 'speed'){
      durationSec = 60;
      targetAccuracy = 92;
    } else if(preset === 'weak-key'){
      durationSec = 45;
      targetAccuracy = 94;
    } else if(preset === 'lesson-review'){
      durationSec = 60;
      targetAccuracy = 95;
    } else if(preset === 'custom'){
      durationSec = options.durationSec || 60;
      targetAccuracy = options.targetAccuracy || 95;
    }

    if(options.durationSec !== undefined) durationSec = options.durationSec;
    if(options.targetAccuracy !== undefined) targetAccuracy = options.targetAccuracy;

    const resolved = resolveTestText(preset, layoutId, customText);
    if(!resolved.valid){
      return { ok: false, errorEn: resolved.errorEn, errorKm: resolved.errorKm };
    }

    const units = getUnits(resolved.text, layoutId);

    state = {
      active: false,
      preset: preset,
      layoutId: layoutId,
      durationSec: durationSec,
      targetAccuracy: targetAccuracy,
      text: resolved.text,
      units: units,
      currentIndex: 0,
      keystrokesCorrect: 0,
      keystrokesIncorrect: 0,
      mistakeChars: {},
      startTime: 0,
      elapsedMs: 0,
      timerInterval: null,
      completed: false,
      result: null
    };

    return { ok: true, state };
  }

  /* Start test timer and live tracking */
  function startTest(){
    if(!state.units || state.units.length === 0) return false;
    state.active = true;
    state.completed = false;
    state.result = null;
    state.startTime = Date.now();
    state.currentIndex = 0;
    state.keystrokesCorrect = 0;
    state.keystrokesIncorrect = 0;
    state.mistakeChars = {};

    if(state.timerInterval) clearInterval(state.timerInterval);

    if(state.durationSec > 0){
      state.timerInterval = setInterval(() => {
        const elapsed = (Date.now() - state.startTime) / 1000;
        const timeLeft = Math.max(0, state.durationSec - elapsed);
        state.elapsedMs = (Date.now() - state.startTime);

        updateLiveHUD(timeLeft);

        if(timeLeft <= 0){
          finishTest(true);
        }
      }, 200);
    }

    renderActiveChars();
    updateLiveHUD(state.durationSec);
    return true;
  }

  /* Process typed character */
  function handleChar(ch){
    if(!state.active || state.completed) return false;

    if(!state.startTime || state.startTime === 0){
      state.startTime = Date.now();
    }

    if(state.currentIndex >= state.units.length){
      finishTest(true);
      return true;
    }

    const expected = state.units[state.currentIndex];
    const isCorrect = matchesUnit(ch, expected);

    if(isCorrect){
      state.keystrokesCorrect++;
      state.currentIndex++;
      if(state.currentIndex >= state.units.length){
        finishTest(true);
        return true;
      }
    } else {
      state.keystrokesIncorrect++;
      state.mistakeChars[expected] = (state.mistakeChars[expected] || 0) + 1;
    }

    renderActiveChars();
    const elapsed = state.startTime ? (Date.now() - state.startTime) / 1000 : 0;
    const timeLeft = state.durationSec > 0 ? Math.max(0, state.durationSec - elapsed) : 0;
    updateLiveHUD(timeLeft);

    return isCorrect;
  }

  /* Process Backspace */
  function handleBackspace(){
    if(!state.active || state.completed) return false;
    if(state.currentIndex > 0){
      state.currentIndex--;
      renderActiveChars();
      return true;
    }
    return false;
  }

  /* Conclude the test and compute definitive metrics */
  function finishTest(isNaturalCompletion = true){
    if(!state.active) return state.result;
    state.active = false;
    state.completed = true;

    if(state.timerInterval){
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }

    const totalTimeMs = Math.max(1000, state.startTime ? Date.now() - state.startTime : 1000);
    const elapsedMin = totalTimeMs / 60000;

    const totalAttempts = state.keystrokesCorrect + state.keystrokesIncorrect;
    const accuracy = totalAttempts > 0
      ? Math.min(100, Math.max(0, Math.round((state.keystrokesCorrect / totalAttempts) * 100)))
      : 100;

    // Khmer vs English formulas
    const isEnglish = state.layoutId === 'english';
    const cpm = Math.round(state.currentIndex / elapsedMin);
    const wpm = Math.round((state.currentIndex / 5) / elapsedMin);

    const goalMet = accuracy >= state.targetAccuracy;

    // Construct personalized advice based on real error observations
    let adviceEn = 'Steady rhythm and posture will continue to build your speed.';
    let adviceKm = 'ចង្វាក់ និងឥរិយាបថត្រឹមត្រូវនឹងជួយបង្កើនល្បឿនរបស់អ្នកបន្ថែមទៀត។';

    const mistakes = Object.keys(state.mistakeChars);
    if(mistakes.length > 0){
      const topMistakes = mistakes.sort((a,b) => state.mistakeChars[b] - state.mistakeChars[a]).slice(0, 3);
      adviceEn = `Recommended focus: Practice "${topMistakes.join(', ')}" in Adaptive Drills to eliminate repeat errors.`;
      adviceKm = `ការណែនាំ៖ ហ្វឹកហាត់លើ "${topMistakes.join(', ')}" ក្នុងការអនុវត្តបន្ស៊ាំ ដើម្បីកាត់បន្ថយកំហុសដដែលៗ។`;
    } else if(goalMet){
      adviceEn = 'Flawless accuracy achieved! You are ready for the next speed tier.';
      adviceKm = 'ទទួលបានសុក្រឹតភាពឥតខ្ចោះ! អ្នកបានត្រៀមខ្លួនសម្រាប់ល្បឿនបន្ទាប់។';
    }

    const result = {
      id: 'test_' + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      preset: state.preset,
      layoutId: state.layoutId,
      wpm: wpm,
      cpm: cpm,
      accuracy: accuracy,
      targetAccuracy: state.targetAccuracy,
      goalMet: goalMet,
      correctUnits: state.keystrokesCorrect,
      incorrectUnits: state.keystrokesIncorrect,
      totalUnits: state.units.length,
      typedUnits: state.currentIndex,
      timeElapsedSec: Math.round(totalTimeMs / 1000),
      isEnglish: isEnglish,
      topMistakes: mistakes,
      adviceEn: adviceEn,
      adviceKm: adviceKm
    };

    state.result = result;

    // Only persist naturally completed tests (discard aborted sessions)
    if(isNaturalCompletion && state.currentIndex >= 10){
      saveResult(result);

      // Trigger Achievements Engine
      if(global.PK_ACHIEVEMENTS && typeof global.PK_ACHIEVEMENTS.check === 'function'){
        global.PK_ACHIEVEMENTS.check({
          type: 'test_completed',
          testType: state.preset,
          layoutId: state.layoutId,
          wpm: wpm,
          cpm: cpm,
          accuracy: accuracy
        });
      }
    }

    renderResultsScreen(result);
    return result;
  }

  /* Cancel / Abort active test */
  function cancelTest(){
    if(state.timerInterval){
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
    state.active = false;
    state.completed = false;
  }

  /* DOM Renderers */
  function renderActiveChars(){
    if(typeof document === 'undefined') return;
    const row = document.getElementById('testLabCharRow');
    if(!row) return;

    row.innerHTML = '';
    const start = Math.max(0, state.currentIndex - 12);
    const end = Math.min(state.units.length, state.currentIndex + 28);

    for(let i = start; i < end; i++){
      const span = document.createElement('span');
      span.className = 'tl-char';
      if(i < state.currentIndex) span.classList.add('done');
      else if(i === state.currentIndex) span.classList.add('current');
      else span.classList.add('pending');

      const u = state.units[i];
      span.textContent = u === ' ' ? ' ' : u;
      if(u === ' ') span.classList.add('space');
      row.appendChild(span);
    }
  }

  function updateLiveHUD(timeLeftSec){
    if(typeof document === 'undefined') return;
    const timerEl = document.getElementById('testLabTimerVal');
    const wpmEl = document.getElementById('testLabWpmVal');
    const accEl = document.getElementById('testLabAccVal');
    const progEl = document.getElementById('testLabProgFill');

    if(timerEl){
      const mins = Math.floor(timeLeftSec / 60);
      const secs = Math.floor(timeLeftSec % 60);
      timerEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    const elapsedMin = state.startTime ? Math.max(0.01, (Date.now() - state.startTime) / 60000) : 0.01;
    const currentWpm = Math.round((state.currentIndex / 5) / elapsedMin);
    const totalAttempts = state.keystrokesCorrect + state.keystrokesIncorrect;
    const currentAcc = totalAttempts > 0 ? Math.round((state.keystrokesCorrect / totalAttempts) * 100) : 100;

    if(wpmEl) wpmEl.textContent = String(Math.max(0, currentWpm));
    if(accEl) accEl.textContent = `${Math.min(100, Math.max(0, currentAcc))}%`;

    if(progEl && state.units.length > 0){
      const pct = Math.min(100, Math.round((state.currentIndex / state.units.length) * 100));
      progEl.style.width = `${pct}%`;
    }
  }

  function renderResultsScreen(res){
    if(typeof document === 'undefined') return;
    const liveSec = document.getElementById('testLabLiveSection');
    const resultsSec = document.getElementById('testLabResultsSection');
    if(liveSec) liveSec.hidden = true;
    if(resultsSec) resultsSec.hidden = false;

    const wpmVal = document.getElementById('tlResWpm');
    const cpmVal = document.getElementById('tlResCpm');
    const accVal = document.getElementById('tlResAcc');
    const timeVal = document.getElementById('tlResTime');
    const goalBadge = document.getElementById('tlResGoalBadge');
    const adviceEl = document.getElementById('tlResAdvice');

    if(wpmVal) wpmVal.textContent = String(res.wpm);
    if(cpmVal) cpmVal.textContent = String(res.cpm);
    if(accVal) accVal.textContent = `${res.accuracy}%`;
    if(timeVal) timeVal.textContent = `${res.timeElapsedSec}s`;

    const isKm = document.documentElement && document.documentElement.classList.contains('site-km-mode');

    if(goalBadge){
      goalBadge.className = `tl-goal-badge ${res.goalMet ? 'passed' : 'failed'}`;
      goalBadge.textContent = res.goalMet
        ? (isKm ? `សម្រេចគោលដៅ (${res.targetAccuracy}%+)` : `Goal Met (${res.targetAccuracy}%+)`)
        : (isKm ? `មិនទាន់ដល់ (${res.targetAccuracy}%)` : `Target Missed (${res.targetAccuracy}%)`);
    }

    if(adviceEl){
      adviceEl.textContent = isKm ? res.adviceKm : res.adviceEn;
    }
  }

  
  /* UI Controller & Event Binding */
  function initTestLabUI(){
    if(typeof document === 'undefined') return;

    const modal = document.getElementById('testLabModal');
    const openBtn1 = document.getElementById('topTestLabBtn');
    const openBtn2 = document.getElementById('testLabToggle');
    const closeBtn = document.getElementById('testLabCloseBtn');
    const startBtn = document.getElementById('tlStartBtn');
    const cancelBtn = document.getElementById('tlCancelBtn');
    const retestBtn = document.getElementById('tlRetestBtn');
    const closeResultsBtn = document.getElementById('tlCloseResultsBtn');
    const customWrap = document.getElementById('tlCustomWrap');
    const customInput = document.getElementById('tlCustomTextInput');

    let selectedPreset = 'quick';
    let selectedDuration = 30;
    let selectedTargetAcc = 95;

    function openModal(){
      if(modal){
        modal.hidden = false;
        const setupSec = document.getElementById('testLabSetupSection');
        const liveSec = document.getElementById('testLabLiveSection');
        const resultsSec = document.getElementById('testLabResultsSection');
        if(setupSec) setupSec.hidden = false;
        if(liveSec) liveSec.hidden = true;
        if(resultsSec) resultsSec.hidden = true;
        if(closeBtn) closeBtn.focus();
      }
    }

    function closeModalHandler(){
      if(state.active){
        cancelTest();
      }
      if(typeof window !== 'undefined' && typeof window.closeModalAnimated === 'function' && modal){
        window.closeModalAnimated(modal);
      } else if(modal){
        modal.hidden = true;
      }
    }

    if(openBtn1) openBtn1.addEventListener('click', openModal);
    if(openBtn2) openBtn2.addEventListener('click', openModal);
    if(closeBtn) closeBtn.addEventListener('click', closeModalHandler);
    if(modal) modal.addEventListener('click', e => { if(e.target === modal) closeModalHandler(); });

    // Preset pills
    const presetPills = document.querySelectorAll('#tlPresetBar .tl-pill');
    presetPills.forEach(pill => {
      pill.addEventListener('click', () => {
        presetPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        selectedPreset = pill.getAttribute('data-preset') || 'quick';
        if(customWrap){
          customWrap.hidden = selectedPreset !== 'custom';
        }
      });
    });

    // Duration pills
    const durPills = document.querySelectorAll('#tlDurationBar .tl-pill');
    durPills.forEach(pill => {
      pill.addEventListener('click', () => {
        durPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        selectedDuration = parseInt(pill.getAttribute('data-duration') || '30', 10);
      });
    });

    // Accuracy pills
    const accPills = document.querySelectorAll('#tlAccBar .tl-pill');
    accPills.forEach(pill => {
      pill.addEventListener('click', () => {
        accPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        selectedTargetAcc = parseInt(pill.getAttribute('data-acc') || '95', 10);
      });
    });

    function launchSelectedTest(){
      if(typeof lessonActive !== 'undefined' && lessonActive && typeof stopLesson === 'function') stopLesson();
      if(typeof adaptiveActive !== 'undefined' && adaptiveActive && typeof stopAdaptive === 'function') stopAdaptive();
      if(typeof raceActive !== 'undefined' && raceActive && typeof stopRace === 'function') stopRace();
      if(typeof trialActive !== 'undefined' && trialActive && typeof stopTrial === 'function') stopTrial();

      const curLayout = (typeof currentLayoutId !== 'undefined' ? currentLayoutId : 'standard');
      const customText = (selectedPreset === 'custom' && customInput) ? customInput.value : '';

      const setupRes = setupTest(selectedPreset, curLayout, {
        durationSec: selectedDuration,
        targetAccuracy: selectedTargetAcc,
        customText: customText
      });

      if(!setupRes.ok){
        const isKm = document.documentElement && document.documentElement.classList.contains('site-km-mode');
        if(typeof showToast === 'function'){
          showToast(pkIcon('info', 18), 'Test Setup', isKm ? setupRes.errorKm : setupRes.errorEn);
        } else {
          alert(isKm ? setupRes.errorKm : setupRes.errorEn);
        }
        return;
      }

      const setupSec = document.getElementById('testLabSetupSection');
      const liveSec = document.getElementById('testLabLiveSection');
      const resultsSec = document.getElementById('testLabResultsSection');
      if(setupSec) setupSec.hidden = true;
      if(liveSec) liveSec.hidden = false;
      if(resultsSec) resultsSec.hidden = true;

      startTest();
    }

    if(startBtn) startBtn.addEventListener('click', launchSelectedTest);

    if(cancelBtn){
      cancelBtn.addEventListener('click', () => {
        cancelTest();
        const setupSec = document.getElementById('testLabSetupSection');
        const liveSec = document.getElementById('testLabLiveSection');
        if(setupSec) setupSec.hidden = false;
        if(liveSec) liveSec.hidden = true;
      });
    }

    if(retestBtn){
      retestBtn.addEventListener('click', () => {
        launchSelectedTest();
      });
    }

    if(closeResultsBtn){
      closeResultsBtn.addEventListener('click', () => {
        const setupSec = document.getElementById('testLabSetupSection');
        const resultsSec = document.getElementById('testLabResultsSection');
        if(setupSec) setupSec.hidden = false;
        if(resultsSec) resultsSec.hidden = true;
      });
    }
  }

  if(typeof document !== 'undefined'){
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', initTestLabUI);
    } else {
      initTestLabUI();
    }
  }


  const api = {
    TEST_PRESET_TEXTS,
    setupTest,
    startTest,
    handleChar,
    handleBackspace,
    finishTest,
    cancelTest,
    loadResults,
    saveResult,
    getState: () => state,
    isActive: () => state.active,
    resolveTestText,
    initTestLabUI
  };

  if(typeof module !== 'undefined' && module.exports){
    module.exports = api;
  }
  global.PK_TEST_LAB = api;

})(typeof window !== 'undefined' ? window : global);
