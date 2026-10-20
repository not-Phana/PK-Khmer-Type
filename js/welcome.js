/* PK Khmer Type — Welcome Experience Engine */
/* Interactive animations, Web Audio mechanical sound, typing theater & 3D tilt */

(function(){
  'use strict';

  /* ============================================================
     1. BILINGUAL DICTIONARY & LANGUAGE CONTROLLER
     ============================================================ */
  const I18N = {
    en: {
      brandTag: 'STUDIO // TYPING ACADEMY',
      launchStudio: 'Enter Studio',
      heroBadge: 'NEXT-GEN KHMER & ENGLISH TYPING STUDIO',
      titleP1: 'Welcome to',
      titleHighlight: 'PK Khmer Type',
      titleKm: 'សូមស្វាគមន៍មកកាន់ PK Khmer Type',
      heroSubtitle: 'Step into Cambodia’s premier mechanical touch typing studio. Master Khmer Standard, Official NiDA Unicode, and English QWERTY with biomechanical hand guidance, 276 mastery lessons, and authentic switch acoustics.',
      ctaPrimary: 'Start Learning Now',
      ctaGuide: 'Explore Keyboard Guide',
      demoTitle: 'Live Mechanical Typing Theater',
      demoSubtitle: 'Experience authentic tactile keypresses and responsive layout tracking.',
      demoBadge: 'LIVE SIMULATION',
      instructionText: 'Press any physical key on your keyboard to test the mechanical acoustics and switch travel:',
      pillarTag: 'STUDIO ARCHITECTURE',
      pillarHead: 'Crafted for Touch-Typing Mastery',
      p1Title: '3 Authentic Layouts',
      p1Desc: 'Master Khmer Standard, Official NiDA Unicode, and English (US) with full coverage of every letter, subscript Coeng ្, and diacritic.',
      p2Title: 'Biomechanical Hand Guides',
      p2Desc: 'Rest your fingers on home row tactile bumps (ថ/ញ & F/J) with real-time translucent hand guides showing exact finger ownership.',
      p3Title: '276 Mastery Lessons & Crafting',
      p3Desc: 'Structured curriculum across 40 levels from anchor keys to Grandmaster Vault, plus a personal Custom Lesson Crafting Studio.',
      p4Title: 'Procedural Mechanical Acoustics',
      p4Desc: 'Rich Topre and Cherry switch click feedback synthesized instantaneously in browser with zero audio asset lag.',
      pathwaysTag: 'CHOOSE YOUR PATHWAY',
      pathwaysHead: 'Begin Your Practice Today',
      path1Title: 'Complete Beginner Track',
      path1Desc: 'Start from Level 00 Anchor Keys and learn hand posture step-by-step.',
      path1Badge: 'Curriculum · Level 0',
      path2Title: 'Free-Typing Manuscript',
      path2Desc: 'Jump straight into an open typing canvas with live WPM and accuracy telemetry.',
      path2Badge: 'Free Typing Sandbox',
      path3Title: 'Craft Custom Lesson',
      path3Desc: 'Paste your own Cambodian text or poetry and create custom practice drills.',
      path3Badge: 'Custom Lesson Creator',
      path4Title: 'Interactive Anatomy Guide',
      path4Desc: 'Explore keycap anatomy, mechanical switches, and layer modifier chords.',
      path4Badge: 'Reference & Anatomy',
      ctaBannerHead: 'Ready to elevate your typing speed?',
      ctaBannerSub: 'Join thousands of students, scribes, and professionals typing Khmer with speed, precision, and confidence.',
      footerCreator: 'Created with pride for Cambodia by Phanna Kurosaki.',
      soundOn: 'Sound: On',
      soundOff: 'Sound: Muted',
      langBtn: 'ភាសាខ្មែរ',
      pointerBtnSmall: '3D Pointer: Small',
      pointerBtnCompass: '3D Pointer: Compass',
      pointerBtnOff: '3D Pointer: Off',
      navLessons: 'Curriculum',
      navCustom: 'Custom Studio',
      navGuide: 'Keyboard Guide',
      navDashboard: 'Dashboard'
    },
    km: {
      brandTag: 'ស្ទូឌីយោ // សាលាហ្វឹកហាត់វាយអក្សរ',
      launchStudio: 'ចូលស្ទូឌីយោ',
      heroBadge: 'ស្ទូឌីយោវាយអក្សរខ្មែរ និងអង់គ្លេសទំនើបបំផុត',
      titleP1: 'សូមស្វាគមន៍មកកាន់',
      titleHighlight: 'PK Khmer Type',
      titleKm: 'បណ្តុះបណ្តាលការវាយអក្សរខ្មែរ និងអង់គ្លេស',
      heroSubtitle: 'សូមស្វាគមន៍មកកាន់ស្ទូឌីយោវាយអក្សរក្តារចុចមេកានិចដំបូងគេបង្អស់នៅកម្ពុជា។ ហ្វឹកហាត់ក្តារចុចខ្មែរស្តង់ដារ និដា និងអង់គ្លេស ដោយមានការណែនាំម្រាមដៃ 3D មេរៀន ២៧៦ និងសំឡេងចុចក្តារចុចពិតប្រាកដ។',
      ctaPrimary: 'ចាប់ផ្តើមរៀនឥឡូវនេះ',
      ctaGuide: 'មើលសៀវភៅណែនាំក្តារចុច',
      demoTitle: 'ការបង្ហាញការវាយអក្សរផ្ទាល់',
      demoSubtitle: 'សាកល្បងចុចគ្រាប់ចុច និងមានអារម្មណ៍ពីចលនាក្តារចុចមេកានិចពិតៗ។',
      demoBadge: 'ការបង្ហាញបន្តផ្ទាល់',
      instructionText: 'សូមចុចគ្រាប់ចុចណាមួយនៅលើក្តារចុចពិតរបស់អ្នក ដើម្បីសាកល្បងសំឡេង និងចលនាគ្រាប់ចុច៖',
      pillarTag: 'លក្ខណៈពិសេសកម្រិតខ្ពស់',
      pillarHead: 'រចនាឡើងដើម្បីជំនាញវាយអក្សររហ័ស',
      p1Title: 'ប្លង់ក្តារចុចផ្លូវការ ៣',
      p1Desc: 'រៀនប្លង់ខ្មែរស្តង់ដារ ខ្មែរនិដា និងអង់គ្លេស ដោយរាប់បញ្ចូលគ្រប់តួអក្សរ ជើងអក្សរ ្ ស្រៈ និងវណ្ណយុត្តិទាំងអស់។',
      p2Title: 'ចលនាដៃ និងម្រាមដៃ 3D',
      p2Desc: 'ដាក់ម្រាមដៃលើគ្រាប់ចុចជួរដើម (ថ/ញ និង F/J) ដោយមានរូបភាពដៃ 3D បង្ហាញម្រាមដៃត្រូវចុចច្បាស់លាស់។',
      p3Title: '២៧៦ មេរៀន & បង្កើតមេរៀនផ្ទាល់ខ្លួន',
      p3Desc: 'កម្មវិធីសិក្សា ៤០ កម្រិត ចាប់ពីកម្រិតដំបូងដល់កម្រិតកំពូល ព្រមទាំងមានប្រព័ន្ធបង្កើតមេរៀនផ្ទាល់ខ្លួនយ៉ាងងាយស្រួល។',
      p4Title: 'សំឡេងចុចមេកានិចពិតៗ',
      p4Desc: 'សំឡេងកុងតាក់មេកានិច Topre និង Cherry កម្រិតខ្ពស់ សំយោគភ្លាមៗដោយគ្មានការយឺតយ៉ាវ។',
      pathwaysTag: 'ជ្រើសរើសផ្លូវចាប់ផ្តើមរបស់អ្នក',
      pathwaysHead: 'ចាប់ផ្តើមការហ្វឹកហាត់ថ្ងៃនេះ',
      path1Title: 'វគ្គសិក្សាសម្រាប់អ្នកទើបចាប់ផ្តើម',
      path1Desc: 'ចាប់ផ្តើមពីកម្រិត ០០ គ្រាប់ចុចជួរដើម និងការដាក់ម្រាមដៃមួយជំហានម្តងៗ។',
      path1Badge: 'កម្មវិធីសិក្សា · កម្រិត ០',
      path2Title: 'ការវាយអក្សរដោយសេរី',
      path2Desc: 'ចូលទៅកាន់ផ្ទាំងសរសេរអត្ថបទសេរីភ្លាមៗ ជាមួយនឹងការវាស់ល្បឿន WPM និងសុក្រឹតភាព។',
      path2Badge: 'កន្លែងវាយសេរី',
      path3Title: 'បង្កើតមេរៀនផ្ទាល់ខ្លួន',
      path3Desc: 'ចម្លងអត្ថបទ កំណាព្យ ឬឯកសាររបស់អ្នកមកបង្កើតជាមេរៀនហ្វឹកហាត់ផ្ទាល់ខ្លួន។',
      path3Badge: 'ឧបករណ៍បង្កើតមេរៀន',
      path4Title: 'មគ្គុទ្ទេសក៍កាយវិភាគវិទ្យាក្តារចុច',
      path4Desc: 'ស្វែងយល់អំពីរចនាសម្ព័ន្ធគ្រាប់ចុច កុងតាក់មេកានិច និងរបៀបចុចប្តូរស្រទាប់។',
      path4Badge: 'ឯកសារយោង & ណែនាំ',
      ctaBannerHead: 'តើអ្នកត្រៀមខ្លួនបង្កើនល្បឿនវាយអក្សរហើយឬនៅ?',
      ctaBannerSub: 'ចូលរួមជាមួយសិស្ស និស្សិត និងអ្នកជំនាញរាប់ពាន់នាក់ក្នុងការវាយអក្សរខ្មែរយ៉ាងរហ័ស ត្រឹមត្រូវ និងមានទំនុកចិត្ត។',
      footerCreator: 'បង្កើតឡើងដោយមោទនភាពសម្រាប់កម្ពុជា ដោយ ផាន់ណា គូរ៉ូសាគី (Phanna Kurosaki)។',
      soundOn: 'សំឡេង៖ បើក',
      soundOff: 'សំឡេង៖ បិទ',
      langBtn: 'English',
      pointerBtnSmall: 'ទ្រនិច 3D៖ តូច',
      pointerBtnCompass: 'ទ្រនិច 3D៖ ត្រីវិស័យ',
      pointerBtnOff: 'ទ្រនិច 3D៖ បិទ',
      navLessons: 'កម្មវិធីសិក្សា',
      navCustom: 'ស្ទូឌីយោផ្ទាល់ខ្លួន',
      navGuide: 'សៀវភៅណែនាំ',
      navDashboard: 'ផ្ទាំងព័ត៌មាន'
    }
  };

  let currentLang = 'en';
  try {
    const saved = localStorage.getItem('pk_welcome_lang') || localStorage.getItem('pk_lang');
    if(saved === 'km' || document.documentElement.classList.contains('site-km-mode')){
      currentLang = 'km';
    }
  } catch(_e){}

  function applyLanguage(lang){
    currentLang = lang;
    try {
      localStorage.setItem('pk_welcome_lang', lang);
      localStorage.setItem('pk_lang', lang);
    } catch(_e){}

    const dict = I18N[lang] || I18N.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if(dict[key]){
        el.textContent = dict[key];
      }
    });

    const langBtn = document.getElementById('langToggleBtn');
    if(langBtn){
      const label = langBtn.querySelector('.lang-btn-text');
      if(label) label.textContent = dict.langBtn;
    }

    if(lang === 'km'){
      document.documentElement.classList.add('site-km-mode');
    } else {
      document.documentElement.classList.remove('site-km-mode');
    }
  }

  /* ============================================================
     2. PROCEDURAL MECHANICAL AUDIO (WEB AUDIO API)
     ============================================================ */
  let audioCtx = null;
  let soundEnabled = true;

  try {
    const s = localStorage.getItem('pk_sound_enabled');
    if(s !== null) soundEnabled = s === 'true' || s === '1';
  } catch(_e){}

  function ensureAudio(){
    if(!audioCtx){
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if(AudioContext){
        audioCtx = new AudioContext();
      }
    }
    if(audioCtx && audioCtx.state === 'suspended'){
      audioCtx.resume();
    }
  }

  function playMechanicalSound(kind = 'down'){
    if(!soundEnabled) return;
    try {
      ensureAudio();
      if(!audioCtx) return;
      const t = audioCtx.currentTime;

      // Primary click transient
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(kind === 'down' ? 1800 : 2600, t);
      filter.Q.setValueAtTime(3.5, t);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(kind === 'down' ? 440 : 620, t);
      osc.frequency.exponentialRampToValueAtTime(kind === 'down' ? 90 : 140, t + 0.045);

      gain.gain.setValueAtTime(0.24, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.055);

      // Noise tactile bottom-out impulse
      if(kind === 'down'){
        const bufferSize = Math.floor(audioCtx.sampleRate * 0.02);
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for(let i = 0; i < bufferSize; i++){
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(3200, t);

        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.18, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

        whiteNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);

        whiteNoise.start(t);
        whiteNoise.stop(t + 0.035);
      }
    } catch(_e){}
  }

  function playCelestialChime(){
    if(!soundEnabled) return;
    try {
      ensureAudio();
      if(!audioCtx) return;
      const t = audioCtx.currentTime;

      // Celestial Pentatonic Frequencies (A5, C#6, E6, G#6, A6)
      const freqs = [880, 1108.73, 1318.51, 1661.22, 1760];
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.18, t);
      masterGain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
      masterGain.connect(audioCtx.destination);

      freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const voiceGain = audioCtx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.25);

        const vVol = 0.22 / (idx + 1);
        voiceGain.gain.setValueAtTime(vVol, t);
        voiceGain.gain.exponentialRampToValueAtTime(0.001, t + 0.55 + idx * 0.05);

        osc.connect(voiceGain);
        voiceGain.connect(masterGain);

        osc.start(t + idx * 0.015);
        osc.stop(t + 0.65);
      });
    } catch(_e){}
  }

  /* ============================================================
     3. STARRY AMBIENT CANVAS BACKGROUND
     ============================================================ */
  function initAmbientCanvas(){
    const canvas = document.getElementById('welcomeCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    function resize(){
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(75, Math.floor((width * height) / 18000));
      particles = [];
      for(let i = 0; i < count; i++){
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.8 + 0.6,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -Math.random() * 0.45 - 0.15,
          alpha: Math.random() * 0.6 + 0.2,
          color: Math.random() > 0.4 ? 'rgba(255, 209, 102,' : 'rgba(56, 189, 248,'
        });
      }
    }

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    resize();

    let animId = null;
    function render(){
      ctx.clearRect(0, 0, width, height);

      for(let i = 0; i < particles.length; i++){
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if(p.y < -10) p.y = height + 10;
        if(p.x < -10) p.x = width + 10;
        if(p.x > width + 10) p.x = -10;

        // Subtle mouse repulsion/attraction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if(dist < 120){
          p.x -= (dx / dist) * 0.6;
          p.y -= (dy / dist) * 0.6;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.shadowColor = p.color + '0.8)';
        ctx.shadowBlur = p.radius * 4;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    }

    render();
  }

  /* ============================================================
     4. LIVE TYPING THEATER SIMULATION
     ============================================================ */
  function initTypingTheater(){
    const textEl = document.getElementById('manuscriptLiveText');
    if(!textEl) return;

    const phrases = [
      { text: 'សូមស្វាគមន៍មកកាន់ PK Khmer Type', lang: 'km' },
      { text: 'Master Touch Typing, Key by Key', lang: 'en' },
      { text: 'កម្ពុជា ទឹកដីនៃអច្ឆរិយៈ', lang: 'km' },
      { text: 'Authentic Mechanical Keyboard Acoustics', lang: 'en' },
      { text: 'រៀនវាយអក្សរដោយទំនុកចិត្ត និងរហ័ស', lang: 'km' }
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let delay = 120;

    function step(){
      const cur = phrases[phraseIdx];
      const fullText = cur.text;

      if(isDeleting){
        charIdx--;
        delay = 45;
      } else {
        charIdx++;
        delay = 90 + Math.random() * 60;
        // Occasional light acoustic tick
        if(Math.random() > 0.4){
          playMechanicalSound('down');
        }
      }

      const displayed = fullText.slice(0, charIdx);
      textEl.textContent = displayed;

      // Synchronize virtual keycap bounce
      highlightActiveKey(fullText[charIdx - 1]);

      if(!isDeleting && charIdx === fullText.length){
        delay = 2400; // Pause at end of phrase
        isDeleting = true;
      } else if(isDeleting && charIdx === 0){
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        delay = 600;
      }

      setTimeout(step, delay);
    }

    setTimeout(step, 800);
  }

  function highlightActiveKey(ch){
    if(!ch) return;
    const caps = document.querySelectorAll('.mech-keycap');
    caps.forEach(cap => {
      const g = cap.getAttribute('data-glyph') || cap.getAttribute('data-code');
      if(g && g.toLowerCase() === ch.toLowerCase()){
        cap.classList.add('pressed');
        setTimeout(() => cap.classList.remove('pressed'), 140);
      }
    });
  }

  /* ============================================================
     5. INTERACTIVE TEST PRESS BENCH & EMBER FX
     ============================================================ */
  function initKeycapBench(){
    const bench = document.getElementById('keycapsBenchRow');
    const feedbackEl = document.getElementById('benchFeedbackChip');
    if(!bench) return;

    const keycaps = bench.querySelectorAll('.mech-keycap');

    keycaps.forEach(cap => {
      cap.addEventListener('pointerdown', (e) => {
        cap.classList.add('pressed');
        playMechanicalSound('down');
        spawnEmberBurst(e.clientX, e.clientY);
        updateFeedback(cap);
      });

      cap.addEventListener('pointerup', () => {
        cap.classList.remove('pressed');
        playMechanicalSound('up');
      });

      cap.addEventListener('pointerleave', () => {
        cap.classList.remove('pressed');
      });
    });

    // Global Key Listener for live physical keyboard testing
    window.addEventListener('keydown', (e) => {
      // Ignore if user is typing in form field
      if(e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if(e.repeat) return;

      const code = e.code;
      const key = e.key;

      playMechanicalSound('down');

      // Highlight matching keycap in bench if present
      const match = bench.querySelector(`[data-code="${code}"]`) || bench.querySelector(`[data-key="${key}"]`);
      if(match){
        match.classList.add('pressed');
        const rect = match.getBoundingClientRect();
        spawnEmberBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        updateFeedback(match);
      } else {
        // Universal feedback for any key pressed
        if(feedbackEl){
          feedbackEl.innerHTML = `<span>Key: <strong>${key === ' ' ? 'Space' : key}</strong> (${code}) &middot; Tactile Switch Response</span>`;
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if(e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      playMechanicalSound('up');
      const match = bench.querySelector(`[data-code="${e.code}"]`) || bench.querySelector(`[data-key="${e.key}"]`);
      if(match){
        match.classList.remove('pressed');
      }
    });

    function updateFeedback(cap){
      if(!feedbackEl) return;
      const name = cap.getAttribute('data-name') || cap.textContent.trim();
      const finger = cap.getAttribute('data-finger') || 'Index';
      const khmer = cap.getAttribute('data-glyph') || '';
      feedbackEl.innerHTML = `<span>Key: <strong>${name}</strong> ${khmer ? `(${khmer})` : ''} &middot; Finger: <strong>${finger}</strong></span>`;
    }
  }

  function spawnEmberBurst(x, y){
    const container = document.body;
    const count = 8;
    for(let i = 0; i < count; i++){
      const spark = document.createElement('div');
      spark.className = 'welcome-ember-particle';
      spark.style.left = x + 'px';
      spark.style.top = y + 'px';

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const velocity = Math.random() * 45 + 25;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;

      spark.style.setProperty('--vx', `${vx}px`);
      spark.style.setProperty('--vy', `${vy}px`);
      spark.style.setProperty('--color', Math.random() > 0.35 ? '#ffd166' : '#38bdf8');

      container.appendChild(spark);
      setTimeout(() => spark.remove(), 600);
    }
  }

  /* ============================================================
     6. 3D TILT EFFECT ON CARDS
     ============================================================ */
  function init3DTilt(){
    const cards = document.querySelectorAll('.pillar-card, .pathway-card');
    cards.forEach(card => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5.5;
        const rotateY = ((x - centerX) / centerX) * 5.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ============================================================
     6. PURE 3D CELESTIAL STARLIGHT LANCE (HERO RIGHT COLUMN)
     ============================================================ */
  function initCelestialStarlightPointer(){
    const stage = document.getElementById('hero3dStage');
    const canvas = document.getElementById('hero3DCanvas') || document.getElementById('celestialPointerCanvas');
    if(!canvas || typeof THREE === 'undefined') return;

    let stageWidth = stage ? stage.clientWidth : 520;
    let stageHeight = stage ? stage.clientHeight : 520;
    if(stageWidth < 100) stageWidth = 520;
    if(stageHeight < 100) stageHeight = 520;

    // Scene, Camera, Transparent High-Performance Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, stageWidth / stageHeight, 0.1, 100);
    camera.position.set(0, 0, 9.5);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(stageWidth, stageHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    // Dynamic Celestial Lighting (Warm Stellar Key + Deep Cosmic Rim + Core Pulsar Point)
    const ambientLight = new THREE.AmbientLight(0xfff8e7, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4, 7, 7);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffd166, 3.2);
    rimLight.position.set(-6, -4, 4);
    scene.add(rimLight);

    const cyanBackLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    cyanBackLight.position.set(3, -5, -4);
    scene.add(cyanBackLight);

    const needleGlowLight = new THREE.PointLight(0xffd166, 3.8, 8);
    scene.add(needleGlowLight);

    // Procedural High-Dynamic-Range 8-Point Diamond Starburst Nova Texture Generator (512x512)
    function createStarlightTexture(colorHex, secondaryHex){
      const cv = document.createElement('canvas');
      cv.width = 512;
      cv.height = 512;
      const ctx = cv.getContext('2d');
      const cx = 256, cy = 256;

      // Radiant radial corona
      const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 240);
      radGrad.addColorStop(0, '#ffffff');
      radGrad.addColorStop(0.08, colorHex);
      radGrad.addColorStop(0.25, secondaryHex || 'rgba(255, 209, 102, 0.45)');
      radGrad.addColorStop(0.55, 'rgba(255, 160, 32, 0.12)');
      radGrad.addColorStop(0.85, 'rgba(120, 60, 255, 0.03)');
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, 512, 512);

      ctx.save();
      ctx.translate(cx, cy);

      // Primary Horizontal razor spike
      const hGrad = ctx.createLinearGradient(-240, 0, 240, 0);
      hGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      hGrad.addColorStop(0.46, 'rgba(255, 245, 200, 0.85)');
      hGrad.addColorStop(0.5, '#ffffff');
      hGrad.addColorStop(0.54, 'rgba(255, 245, 200, 0.85)');
      hGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = hGrad;
      ctx.beginPath();
      ctx.moveTo(-240, 0);
      ctx.quadraticCurveTo(0, -9, 240, 0);
      ctx.quadraticCurveTo(0, 9, -240, 0);
      ctx.fill();

      // Primary Vertical razor spike
      const vGrad = ctx.createLinearGradient(0, -240, 0, 240);
      vGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      vGrad.addColorStop(0.46, 'rgba(255, 245, 200, 0.85)');
      vGrad.addColorStop(0.5, '#ffffff');
      vGrad.addColorStop(0.54, 'rgba(255, 245, 200, 0.85)');
      vGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = vGrad;
      ctx.beginPath();
      ctx.moveTo(0, -240);
      ctx.quadraticCurveTo(-9, 0, 0, 240);
      ctx.quadraticCurveTo(9, 0, 0, -240);
      ctx.fill();

      // Secondary 45-degree Diagonal diamond spikes
      ctx.rotate(Math.PI / 4);
      const dGrad = ctx.createLinearGradient(-130, 0, 130, 0);
      dGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      dGrad.addColorStop(0.5, '#ffffff');
      dGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = dGrad;
      ctx.beginPath();
      ctx.moveTo(-130, 0);
      ctx.quadraticCurveTo(0, -5, 130, 0);
      ctx.quadraticCurveTo(0, 5, -130, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -130);
      ctx.quadraticCurveTo(-5, 0, 0, 130);
      ctx.quadraticCurveTo(5, 0, 0, -130);
      ctx.fill();

      ctx.restore();

      const tex = new THREE.CanvasTexture(cv);
      tex.needsUpdate = true;
      return tex;
    }

    const starTexGold = createStarlightTexture('#ffd166', 'rgba(255, 209, 102, 0.50)');
    const starTexCyan = createStarlightTexture('#38bdf8', 'rgba(103, 232, 249, 0.50)');

    // Root 3D Needle Lance Assembly
    const needleAssembly = new THREE.Group();
    scene.add(needleAssembly);

    // 1. Faceted Tapered Double-Diamond Needle Spine
    const spineShape = new THREE.Shape();
    spineShape.moveTo(0, 5.2);          // Summit razor tip
    spineShape.lineTo(0.045, 3.4);      // Slender upper blade
    spineShape.lineTo(0.09, 1.8);       // Upper rib
    spineShape.lineTo(0.16, 0.45);      // Upper collar
    spineShape.lineTo(0.22, 0.0);       // Center waist
    spineShape.lineTo(0.16, -0.45);     // Lower collar
    spineShape.lineTo(0.09, -1.8);      // Lower rib
    spineShape.lineTo(0.045, -3.4);     // Slender lower blade
    spineShape.lineTo(0, -5.0);         // Tail razor tip
    // Left symmetry
    spineShape.lineTo(-0.045, -3.4);
    spineShape.lineTo(-0.09, -1.8);
    spineShape.lineTo(-0.16, -0.45);
    spineShape.lineTo(-0.22, 0.0);
    spineShape.lineTo(-0.16, 0.45);
    spineShape.lineTo(-0.09, 1.8);
    spineShape.lineTo(-0.045, 3.4);
    spineShape.closePath();

    const spineGeo = new THREE.ExtrudeGeometry(spineShape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.035,
      bevelThickness: 0.035
    });
    spineGeo.center();

    const spineMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0.08,
      emissive: 0xd4a017,
      emissiveIntensity: 0.55,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03
    });
    const spineMesh = new THREE.Mesh(spineGeo, spineMat);
    needleAssembly.add(spineMesh);

    // Glowing Spine Razor Contour Edges
    const spineEdges = new THREE.EdgesGeometry(spineGeo, 24);
    const spineEdgeMat = new THREE.LineBasicMaterial({
      color: 0xfff3a8,
      linewidth: 2,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const spineEdgeLine = new THREE.LineSegments(spineEdges, spineEdgeMat);
    needleAssembly.add(spineEdgeLine);

    // Glowing Central Laser Core Rod
    const coreRodGeo = new THREE.CylinderGeometry(0.022, 0.022, 10.2, 8);
    const coreRodMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const coreRodMesh = new THREE.Mesh(coreRodGeo, coreRodMat);
    needleAssembly.add(coreRodMesh);

    // 2. Multi-Tiered Seraph Wing Array (Obsidian Damascus Base + Crystalline Winglets)
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0.50);
    wingShape.lineTo(0.40, 0.42);
    wingShape.lineTo(0.95, 0.85); // Upper aggressive quill barb
    wingShape.lineTo(1.15, 0.45);
    wingShape.lineTo(1.85, 0.38); // Mid-wing stepped chevron
    wingShape.lineTo(3.05, 0.0);  // Main horizontal razor wing tip
    wingShape.lineTo(1.90, -0.25);
    wingShape.lineTo(1.20, -0.32);
    wingShape.lineTo(0.85, -0.65); // Lower swept-back stabilizer fin
    wingShape.lineTo(0.40, -0.40);
    wingShape.lineTo(0, -0.50);
    // Left symmetry
    wingShape.lineTo(-0.40, -0.40);
    wingShape.lineTo(-0.85, -0.65);
    wingShape.lineTo(-1.20, -0.32);
    wingShape.lineTo(-1.90, -0.25);
    wingShape.lineTo(-3.05, 0.0); // Left horizontal razor wing tip
    wingShape.lineTo(-1.85, 0.38);
    wingShape.lineTo(-1.15, 0.45);
    wingShape.lineTo(-0.95, 0.85);
    wingShape.lineTo(-0.40, 0.42);
    wingShape.closePath();

    const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
      depth: 0.10,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.03,
      bevelThickness: 0.03
    });
    wingGeo.center();

    // Vibrant Cosmic Obsidian Damascus: deep metallic navy base with rich molten gold reflections
    const wingMat = new THREE.MeshPhysicalMaterial({
      color: 0x141b2d,
      metalness: 0.95,
      roughness: 0.12,
      emissive: 0xc89618,
      emissiveIntensity: 0.58,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04
    });
    const wingMesh = new THREE.Mesh(wingGeo, wingMat);
    needleAssembly.add(wingMesh);

    // Glowing Golden Razor Wing Edges
    const wingEdges = new THREE.EdgesGeometry(wingGeo, 20);
    const wingEdgeMat = new THREE.LineBasicMaterial({
      color: 0xfff0a0,
      linewidth: 2,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const wingEdgeLine = new THREE.LineSegments(wingEdges, wingEdgeMat);
    needleAssembly.add(wingEdgeLine);

    // Floating Inner Crystalline Winglets (Seraph Astral Shards)
    const crystalWingShape = new THREE.Shape();
    crystalWingShape.moveTo(0.25, 0.30);
    crystalWingShape.lineTo(0.70, 0.55);
    crystalWingShape.lineTo(1.50, 0.22);
    crystalWingShape.lineTo(0.70, -0.22);
    crystalWingShape.lineTo(0.25, -0.15);
    crystalWingShape.closePath();

    const crystalWingGeo = new THREE.ExtrudeGeometry(crystalWingShape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02
    });
    crystalWingGeo.center();

    const crystalWingMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.15,
      roughness: 0.05,
      transmission: 0.55,
      emissive: 0xffe28a,
      emissiveIntensity: 0.85,
      transparent: true,
      opacity: 0.88
    });

    const rCrystalWing = new THREE.Mesh(crystalWingGeo, crystalWingMat);
    rCrystalWing.position.set(0.85, 0.12, 0.07);
    needleAssembly.add(rCrystalWing);

    const lCrystalWing = new THREE.Mesh(crystalWingGeo, crystalWingMat);
    lCrystalWing.position.set(-0.85, 0.12, 0.07);
    lCrystalWing.rotation.y = Math.PI;
    needleAssembly.add(lCrystalWing);

    // Inlaid Golden Chevron Constellation Runes on Wings
    const rWingInlay = [
      new THREE.Vector3(0.3, 0.22, 0.065),
      new THREE.Vector3(0.85, 0.55, 0.065),
      new THREE.Vector3(1.1, 0.30, 0.065),
      new THREE.Vector3(1.8, 0.24, 0.065),
      new THREE.Vector3(2.7, 0.0, 0.065),
      new THREE.Vector3(1.7, -0.16, 0.065),
      new THREE.Vector3(1.0, -0.20, 0.065),
      new THREE.Vector3(0.65, -0.42, 0.065),
      new THREE.Vector3(0.3, -0.22, 0.065)
    ];
    const lWingInlay = rWingInlay.map(p => new THREE.Vector3(-p.x, p.y, p.z));

    const inlayMat = new THREE.LineBasicMaterial({
      color: 0xfff6d0,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending
    });
    const rWingLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(rWingInlay), inlayMat);
    const lWingLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(lWingInlay), inlayMat);
    needleAssembly.add(rWingLine);
    needleAssembly.add(lWingLine);

    // Diamond Star Nodes on Wing Vertices (Wing Tips & Upper Barbs)
    const wingGemGeo = new THREE.OctahedronGeometry(0.13, 0);
    const wingGemMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const rTipGem = new THREE.Mesh(wingGemGeo, wingGemMat);
    rTipGem.position.set(3.05, 0, 0.08);
    const lTipGem = new THREE.Mesh(wingGemGeo, wingGemMat);
    lTipGem.position.set(-3.05, 0, 0.08);
    const rBarbGem = new THREE.Mesh(wingGemGeo, wingGemMat);
    rBarbGem.position.set(0.95, 0.85, 0.08);
    const lBarbGem = new THREE.Mesh(wingGemGeo, wingGemMat);
    lBarbGem.position.set(-0.95, 0.85, 0.08);
    needleAssembly.add(rTipGem);
    needleAssembly.add(lTipGem);
    needleAssembly.add(rBarbGem);
    needleAssembly.add(lBarbGem);

    // 3. Triple Concentric Counter-Rotating Celestial Astrolabe Gimbal Rings
    // Ring 1: Outer Golden Armillary Ring with 4 Cardinal Diamond Studs
    const ringGeo1 = new THREE.TorusGeometry(0.72, 0.018, 16, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xffd166,
      transparent: true,
      opacity: 0.90,
      blending: THREE.AdditiveBlending
    });
    const gimbalRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    gimbalRing1.rotation.x = Math.PI / 3;
    needleAssembly.add(gimbalRing1);

    // Cardinal Diamond Studs on Ring 1
    const studGeo = new THREE.OctahedronGeometry(0.065, 0);
    const studMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const studs = [];
    for(let i = 0; i < 4; i++){
      const angle = (i / 4) * Math.PI * 2;
      const stud = new THREE.Mesh(studGeo, studMat);
      stud.position.set(Math.cos(angle) * 0.72, Math.sin(angle) * 0.72, 0);
      gimbalRing1.add(stud);
      studs.push(stud);
    }

    // Ring 2: Middle Astral Cyan Plasma Ring
    const ringGeo2 = new THREE.TorusGeometry(0.90, 0.015, 16, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.80,
      blending: THREE.AdditiveBlending
    });
    const gimbalRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    gimbalRing2.rotation.y = Math.PI / 4;
    needleAssembly.add(gimbalRing2);

    // Ring 3: Inner White High-Speed Resonator Ring
    const ringGeo3 = new THREE.TorusGeometry(0.52, 0.013, 14, 48);
    const ringMat3 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const gimbalRing3 = new THREE.Mesh(ringGeo3, ringMat3);
    gimbalRing3.rotation.x = -Math.PI / 5;
    needleAssembly.add(gimbalRing3);

    // Central Dual-Nested Octahedron Diamond Crystal Core
    const innerDiamondGeo = new THREE.OctahedronGeometry(0.24, 0);
    const innerDiamondMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const innerDiamond = new THREE.Mesh(innerDiamondGeo, innerDiamondMat);

    const outerDiamondGeo = new THREE.OctahedronGeometry(0.36, 0);
    const outerDiamondMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xffd166,
      emissiveIntensity: 0.9,
      roughness: 0.04,
      metalness: 0.95,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.85
    });
    const outerDiamond = new THREE.Mesh(outerDiamondGeo, outerDiamondMat);
    outerDiamond.add(innerDiamond);
    needleAssembly.add(outerDiamond);

    // 4. The 5 Pulsing Starlight Novas Along Axis
    const starSprites = [];
    const starGems = [];
    const starYPositions = [2.7, 1.35, 0.0, -1.35, -2.7];
    const starScales = [1.45, 1.75, 2.9, 1.75, 1.45];

    starYPositions.forEach((yPos, idx) => {
      const mat = new THREE.SpriteMaterial({
        map: idx === 2 ? starTexGold : (idx % 2 === 0 ? starTexGold : starTexCyan),
        color: 0xffffff,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(0, yPos, 0.1);
      sprite.scale.set(starScales[idx], starScales[idx], 1);
      needleAssembly.add(sprite);
      starSprites.push({ sprite, baseScale: starScales[idx], phase: idx * 0.85 });

      if (idx !== 2) {
        const gemGeo = new THREE.OctahedronGeometry(0.13, 0);
        const gemMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const gemMesh = new THREE.Mesh(gemGeo, gemMat);
        gemMesh.position.set(0, yPos, 0.08);
        needleAssembly.add(gemMesh);
        starGems.push(gemMesh);
      }
    });

    // Summit Razor Tip Beacon Flare (Direct Aiming Focus)
    const tipFlareMat = new THREE.SpriteMaterial({
      map: starTexGold,
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const tipFlare = new THREE.Sprite(tipFlareMat);
    tipFlare.position.set(0, 5.15, 0.1);
    tipFlare.scale.set(1.3, 1.3, 1);
    needleAssembly.add(tipFlare);

    // Tail Counterweight Star Flare
    const tailFlareMat = new THREE.SpriteMaterial({
      map: starTexGold,
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const tailFlare = new THREE.Sprite(tailFlareMat);
    tailFlare.position.set(0, -4.95, 0.1);
    tailFlare.scale.set(1.0, 1.0, 1);
    needleAssembly.add(tailFlare);

    // 5. Orbiting Celestial Satellites (Starlight Motes)
    const motes = [
      { rx: 1.8, ry: 1.4, rz: 1.2, speed: 1.6, tilt: 0.6, angle: 0, color: 0xffd166 },
      { rx: 2.3, ry: 1.7, rz: 1.5, speed: -1.3, tilt: -0.7, angle: Math.PI * 0.5, color: 0x38bdf8 },
      { rx: 1.4, ry: 2.0, rz: 1.0, speed: 2.1, tilt: 1.3, angle: Math.PI, color: 0xffffff },
      { rx: 2.8, ry: 1.2, rz: 1.4, speed: -1.8, tilt: 0.3, angle: Math.PI * 1.5, color: 0xffe28a }
    ];
    motes.forEach(m => {
      const sMat = new THREE.SpriteMaterial({
        map: m.color === 0x38bdf8 ? starTexCyan : starTexGold,
        color: 0xffffff,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const sMesh = new THREE.Sprite(sMat);
      sMesh.scale.set(0.45, 0.45, 1);
      needleAssembly.add(sMesh);
      m.sprite = sMesh;
    });

    // 6. Dual Dynamic Electrical Plasma Filaments
    const numSpinePoints = 26;
    const spineArcPositions = new Float32Array(numSpinePoints * 3);
    const spineArcGeo = new THREE.BufferGeometry();
    spineArcGeo.setAttribute('position', new THREE.BufferAttribute(spineArcPositions, 3));
    const spineArcMat = new THREE.LineBasicMaterial({
      color: 0xfff6d0,
      transparent: true,
      opacity: 0.90,
      blending: THREE.AdditiveBlending
    });
    const spineArcLine = new THREE.Line(spineArcGeo, spineArcMat);
    needleAssembly.add(spineArcLine);

    const numWingPoints = 14;
    const rWingArcGeo = new THREE.BufferGeometry();
    rWingArcGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(numWingPoints * 3), 3));
    const lWingArcGeo = new THREE.BufferGeometry();
    lWingArcGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(numWingPoints * 3), 3));
    const wingArcMat = new THREE.LineBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const rWingArcLine = new THREE.Line(rWingArcGeo, wingArcMat);
    const lWingArcLine = new THREE.Line(lWingArcGeo, wingArcMat);
    needleAssembly.add(rWingArcLine);
    needleAssembly.add(lWingArcLine);

    function updateArcs(time){
      // Spine Lightning Arc
      const spineArr = spineArcGeo.attributes.position.array;
      for(let i = 0; i < numSpinePoints; i++){
        const t = i / (numSpinePoints - 1);
        const y = (t * 9.8) - 4.9;
        const jitterX = (Math.random() - 0.5) * 0.06;
        const jitterZ = (Math.random() - 0.5) * 0.06;
        spineArr[i * 3 + 0] = Math.sin(time * 14 + y * 5) * 0.06 + jitterX;
        spineArr[i * 3 + 1] = y;
        spineArr[i * 3 + 2] = Math.cos(time * 12 + y * 4) * 0.06 + 0.10 + jitterZ;
      }
      spineArcGeo.attributes.position.needsUpdate = true;

      // Wing Sparks
      const rWingArr = rWingArcGeo.attributes.position.array;
      const lWingArr = lWingArcGeo.attributes.position.array;
      for(let i = 0; i < numWingPoints; i++){
        const t = i / (numWingPoints - 1);
        const rx = t * 2.95;
        const ry = Math.sin(t * Math.PI) * 0.26 + (Math.random() - 0.5) * 0.07;
        rWingArr[i * 3 + 0] = rx;
        rWingArr[i * 3 + 1] = ry;
        rWingArr[i * 3 + 2] = 0.07;

        lWingArr[i * 3 + 0] = -rx;
        lWingArr[i * 3 + 1] = ry;
        lWingArr[i * 3 + 2] = 0.07;
      }
      rWingArcGeo.attributes.position.needsUpdate = true;
      lWingArcGeo.attributes.position.needsUpdate = true;
    }

    // 7. Ambient Floating Stardust Field
    const dustCount = 42;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustVelocities = [];
    for(let i = 0; i < dustCount; i++){
      dustPositions[i * 3 + 0] = (Math.random() - 0.5) * 4.6;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 9.8;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 2.6;
      dustVelocities.push({
        vy: Math.random() * 0.022 + 0.009,
        swayPhase: Math.random() * Math.PI * 2
      });
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffd166,
      size: 0.10,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // Needle Scale: Majestic prominent sizing (~320px tall in open hero column)
    const NEEDLE_SCALE = 0.56;
    needleAssembly.scale.set(NEEDLE_SCALE, NEEDLE_SCALE, NEEDLE_SCALE);

    // 8. Supernova Click Bursts (Dual concentric rings + radiant high-speed spark embers)
    const shockwaves = [];
    const sparkParticles = [];

    function triggerShockwave(){
      needleAssembly.updateMatrixWorld(true);
      const tipWorldPos = needleAssembly.localToWorld(new THREE.Vector3(0, 5.15, 0));
      const coreWorldPos = needleAssembly.localToWorld(new THREE.Vector3(0, 0, 0));

      // 1. Expanding Golden Wavefront Ring
      const burstMat1 = new THREE.SpriteMaterial({
        map: starTexGold,
        color: 0xffffff,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const burstSprite1 = new THREE.Sprite(burstMat1);
      burstSprite1.position.copy(tipWorldPos);
      burstSprite1.scale.set(0.9, 0.9, 1);
      scene.add(burstSprite1);
      shockwaves.push({ sprite: burstSprite1, scale: 0.9, opacity: 1.0, speed: 7.0 });

      // 2. Secondary Astral Cyan Refraction Ring from Core
      const burstMat2 = new THREE.SpriteMaterial({
        map: starTexCyan,
        color: 0xffffff,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const burstSprite2 = new THREE.Sprite(burstMat2);
      burstSprite2.position.copy(coreWorldPos);
      burstSprite2.scale.set(0.6, 0.6, 1);
      scene.add(burstSprite2);
      shockwaves.push({ sprite: burstSprite2, scale: 0.6, opacity: 0.9, speed: 5.5 });

      // 3. Radiating High-Speed Starlight Spark Embers
      const numSparks = 20;
      for(let i = 0; i < numSparks; i++){
        const angle = (i / numSparks) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 3.2 + 1.8;
        const sparkMat = new THREE.SpriteMaterial({
          map: Math.random() > 0.35 ? starTexGold : starTexCyan,
          color: 0xffffff,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const sparkSprite = new THREE.Sprite(sparkMat);
        sparkSprite.position.copy(tipWorldPos);
        sparkSprite.scale.set(0.38, 0.38, 1);
        scene.add(sparkSprite);
        sparkParticles.push({
          sprite: sparkSprite,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          vz: (Math.random() - 0.5) * 1.0,
          opacity: 1.0
        });
      }

      // Flash tip flare and core light
      tipFlare.scale.set(2.8, 2.8, 1);
      needleGlowLight.intensity = 7.0;

      playCelestialChime();
    }

    window.addEventListener('pointerdown', () => {
      triggerShockwave();
    });

    // Mouse Tracking across Window with Dynamic Velocity Banking
    const mouse = {
      clientX: window.innerWidth * 0.5,
      clientY: window.innerHeight * 0.35
    };

    let prevMouseX = window.innerWidth * 0.5;
    let mouseVelocityX = 0;

    const needleState = {
      targetQuat: new THREE.Quaternion(),
      upVec: new THREE.Vector3(0, 1, 0)
    };

    window.addEventListener('pointermove', (e) => {
      mouseVelocityX = e.clientX - prevMouseX;
      prevMouseX = e.clientX;
      mouse.clientX = e.clientX;
      mouse.clientY = e.clientY;
    }, { passive: true });

    // Responsive Stage Resize
    function handleResize(){
      if(!stage) return;
      const rect = stage.getBoundingClientRect();
      const w = rect.width || 520;
      const h = rect.height || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    window.addEventListener('resize', handleResize);

    // Animation & Real-Time Aiming Loop
    let clock = new THREE.Clock();

    function renderLoop(){
      requestAnimationFrame(renderLoop);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // 1. Direct Aiming: The razor tip points directly at the mouse cursor
      let dx = 0, dy = -150;
      if(stage){
        const rect = stage.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        dx = mouse.clientX - centerX;
        dy = mouse.clientY - centerY;
      }

      mouseVelocityX *= 0.88;

      const dist = Math.hypot(dx, dy);
      if(dist > 8){
        const screenAngle = Math.atan2(-dy, dx);
        const zRot = screenAngle - Math.PI / 2;
        const bankRoll = Math.max(-0.25, Math.min(0.25, -mouseVelocityX * 0.015));
        const leanAmount = Math.min(0.26, 0.10 + (dist / (window.innerWidth || 1200)) * 0.18);
        const targetEuler = new THREE.Euler(leanAmount, bankRoll, zRot, 'ZXY');
        needleState.targetQuat.setFromEuler(targetEuler);
      }

      needleAssembly.quaternion.slerp(needleState.targetQuat, 0.11);

      // Subtle levitation float
      needleAssembly.position.y = Math.sin(time * 2.2) * 0.12;
      needleGlowLight.position.copy(needleAssembly.position);

      // 2. Pulse Novas with Harmonic Waves & Shimmer Rotation
      starSprites.forEach(item => {
        const p = 1.0 + Math.sin(time * 3.8 + item.phase) * 0.22;
        item.sprite.scale.set(item.baseScale * p, item.baseScale * p, 1);
        item.sprite.material.rotation = Math.sin(time * 0.7 + item.phase) * 0.18;
      });

      // 3. Rotate Triple Gimbal Rings & Core Diamond
      gimbalRing1.rotation.z += 0.022;
      gimbalRing1.rotation.x += 0.012;
      gimbalRing2.rotation.z -= 0.018;
      gimbalRing2.rotation.y += 0.015;
      gimbalRing3.rotation.y += 0.035;
      gimbalRing3.rotation.x += 0.024;

      outerDiamond.rotation.y += 0.028;
      outerDiamond.rotation.x += 0.014;
      innerDiamond.rotation.z -= 0.040;

      starGems.forEach(gem => {
        gem.rotation.y += 0.032;
      });
      rTipGem.rotation.y += 0.03;
      lTipGem.rotation.y -= 0.03;
      rBarbGem.rotation.x += 0.03;
      lBarbGem.rotation.x -= 0.03;

      // 4. Update Orbiting Celestial Satellites (Starlight Motes)
      motes.forEach(m => {
        m.angle += m.speed * delta;
        const mx = Math.cos(m.angle) * m.rx;
        const my = Math.sin(m.angle) * Math.cos(m.tilt) * m.ry;
        const mz = Math.sin(m.angle) * Math.sin(m.tilt) * m.rz + 0.10;
        m.sprite.position.set(mx, my, mz);
      });

      // 5. Electrical Filaments
      updateArcs(time);

      // 6. Update Ambient Stardust
      const dustArr = dustGeo.attributes.position.array;
      for(let i = 0; i < dustCount; i++){
        dustArr[i * 3 + 1] += dustVelocities[i].vy;
        dustArr[i * 3 + 0] += Math.sin(time * 1.5 + dustVelocities[i].swayPhase) * 0.005;
        if(dustArr[i * 3 + 1] > 4.9){
          dustArr[i * 3 + 1] = -4.9;
        }
      }
      dustGeo.attributes.position.needsUpdate = true;

      // 7. Update Shockwave Bursts
      for(let i = shockwaves.length - 1; i >= 0; i--){
        const sw = shockwaves[i];
        sw.scale += delta * (sw.speed || 6.5);
        sw.opacity -= delta * 3.0;
        sw.sprite.scale.set(sw.scale, sw.scale, 1);
        sw.sprite.material.opacity = Math.max(0, sw.opacity);
        if(sw.opacity <= 0){
          scene.remove(sw.sprite);
          sw.sprite.material.dispose();
          shockwaves.splice(i, 1);
        }
      }

      // 8. Update Spark Particles
      for(let i = sparkParticles.length - 1; i >= 0; i--){
        const sp = sparkParticles[i];
        sp.sprite.position.x += sp.vx * delta;
        sp.sprite.position.y += sp.vy * delta;
        sp.sprite.position.z += sp.vz * delta;
        sp.opacity -= delta * 2.5;
        sp.sprite.material.opacity = Math.max(0, sp.opacity);
        const s = Math.max(0.05, 0.38 * sp.opacity);
        sp.sprite.scale.set(s, s, 1);
        if(sp.opacity <= 0){
          scene.remove(sp.sprite);
          sp.sprite.material.dispose();
          sparkParticles.splice(i, 1);
        }
      }

      // Relax Tip Flare & PointLight Intensity
      if(tipFlare.scale.x > 1.3){
        const nextScale = Math.max(1.3, tipFlare.scale.x - delta * 3.8);
        tipFlare.scale.set(nextScale, nextScale, 1);
      }
      if(needleGlowLight.intensity > 3.8){
        needleGlowLight.intensity = Math.max(3.8, needleGlowLight.intensity - delta * 6.0);
      }

      renderer.render(scene, camera);
    }

    renderLoop();
  }

  /* ============================================================
     7. UI EVENT HANDLERS & BOOTSTRAP
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Language switcher
    const langBtn = document.getElementById('langToggleBtn');
    if(langBtn){
      langBtn.addEventListener('click', () => {
        applyLanguage(currentLang === 'en' ? 'km' : 'en');
        playMechanicalSound('down');
      });
    }

    // 2. Audio toggle
    const audioBtn = document.getElementById('audioToggleBtn');
    if(audioBtn){
      const updateAudioUI = () => {
        if(soundEnabled){
          audioBtn.classList.add('active');
          audioBtn.setAttribute('title', 'Sound Muted');
        } else {
          audioBtn.classList.remove('active');
          audioBtn.setAttribute('title', 'Enable Sound');
        }
      };
      updateAudioUI();

      audioBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        try {
          localStorage.setItem('pk_sound_enabled', soundEnabled ? '1' : '0');
        } catch(_e){}
        updateAudioUI();
        if(soundEnabled){
          playMechanicalSound('down');
        }
      });
    }

    // 3. Initialize subsystems
    applyLanguage(currentLang);
    initAmbientCanvas();
    initTypingTheater();
    initKeycapBench();
    init3DTilt();
    initCelestialStarlightPointer();
  });
})();

