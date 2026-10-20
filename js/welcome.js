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
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, t);
      osc1.frequency.exponentialRampToValueAtTime(1760, t + 0.25);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1320, t);
      osc2.frequency.exponentialRampToValueAtTime(2640, t + 0.2);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.45);
      osc2.stop(t + 0.45);
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

    // Dynamic Celestial Lighting
    const ambientLight = new THREE.AmbientLight(0xfff6e0, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(4, 6, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffd166, 2.5);
    rimLight.position.set(-5, -4, 3);
    scene.add(rimLight);

    const needleGlowLight = new THREE.PointLight(0xffd166, 3.0, 7);
    scene.add(needleGlowLight);

    // Procedural High-Resolution Diamond Starburst Nova Texture Generator
    function createStarlightTexture(colorHex){
      const cv = document.createElement('canvas');
      cv.width = 256;
      cv.height = 256;
      const ctx = cv.getContext('2d');
      const cx = 128, cy = 128;

      // Radiant radial corona
      const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 115);
      radGrad.addColorStop(0, '#ffffff');
      radGrad.addColorStop(0.12, colorHex);
      radGrad.addColorStop(0.35, 'rgba(255, 209, 102, 0.40)');
      radGrad.addColorStop(0.68, 'rgba(255, 157, 46, 0.10)');
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, 256, 256);

      ctx.save();
      ctx.translate(cx, cy);

      // Primary Horizontal razor spike
      const hGrad = ctx.createLinearGradient(-120, 0, 120, 0);
      hGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      hGrad.addColorStop(0.5, '#ffffff');
      hGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = hGrad;
      ctx.beginPath();
      ctx.moveTo(-120, 0);
      ctx.quadraticCurveTo(0, -4.5, 120, 0);
      ctx.quadraticCurveTo(0, 4.5, -120, 0);
      ctx.fill();

      // Primary Vertical razor spike
      const vGrad = ctx.createLinearGradient(0, -120, 0, 120);
      vGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      vGrad.addColorStop(0.5, '#ffffff');
      vGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = vGrad;
      ctx.beginPath();
      ctx.moveTo(0, -120);
      ctx.quadraticCurveTo(-4.5, 0, 0, 120);
      ctx.quadraticCurveTo(4.5, 0, 0, -120);
      ctx.fill();

      // Secondary Diagonal diamond spikes
      ctx.rotate(Math.PI / 4);
      const dGrad = ctx.createLinearGradient(-55, 0, 55, 0);
      dGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      dGrad.addColorStop(0.5, '#fff6d0');
      dGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = dGrad;
      ctx.beginPath();
      ctx.moveTo(-55, 0);
      ctx.quadraticCurveTo(0, -3, 55, 0);
      ctx.quadraticCurveTo(0, 3, -55, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -55);
      ctx.quadraticCurveTo(-3, 0, 0, 55);
      ctx.quadraticCurveTo(3, 0, 0, -55);
      ctx.fill();

      ctx.restore();

      const tex = new THREE.CanvasTexture(cv);
      tex.needsUpdate = true;
      return tex;
    }

    const starTexGold = createStarlightTexture('#ffd166');
    const starTexCyan = createStarlightTexture('#67e8f9');

    // Root 3D Needle Lance Assembly
    const needleAssembly = new THREE.Group();
    scene.add(needleAssembly);

    // 1. Faceted Tapered Diamond Needle Spine
    const spineShape = new THREE.Shape();
    spineShape.moveTo(0, 5.0);          // Summit razor tip
    spineShape.lineTo(0.045, 3.2);      // Slender upper blade
    spineShape.lineTo(0.08, 1.6);       // Upper rib
    spineShape.lineTo(0.14, 0.4);       // Upper collar
    spineShape.lineTo(0.20, 0.0);       // Center waist
    spineShape.lineTo(0.14, -0.4);      // Lower collar
    spineShape.lineTo(0.08, -1.6);      // Lower rib
    spineShape.lineTo(0.045, -3.2);     // Slender lower blade
    spineShape.lineTo(0, -4.8);         // Tail razor tip
    // Left symmetry
    spineShape.lineTo(-0.045, -3.2);
    spineShape.lineTo(-0.08, -1.6);
    spineShape.lineTo(-0.14, -0.4);
    spineShape.lineTo(-0.20, 0.0);
    spineShape.lineTo(-0.14, 0.4);
    spineShape.lineTo(-0.08, 1.6);
    spineShape.lineTo(-0.045, 3.2);
    spineShape.closePath();

    const spineGeo = new THREE.ExtrudeGeometry(spineShape, {
      depth: 0.10,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.03,
      bevelThickness: 0.03
    });
    spineGeo.center();

    const spineMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.96,
      roughness: 0.08,
      emissive: 0xd4a017,
      emissiveIntensity: 0.45,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04
    });
    const spineMesh = new THREE.Mesh(spineGeo, spineMat);
    needleAssembly.add(spineMesh);

    // Glowing Spine Razor Contour Edges
    const spineEdges = new THREE.EdgesGeometry(spineGeo, 24);
    const spineEdgeMat = new THREE.LineBasicMaterial({
      color: 0xfff3a8,
      linewidth: 2,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending
    });
    const spineEdgeLine = new THREE.LineSegments(spineEdges, spineEdgeMat);
    needleAssembly.add(spineEdgeLine);

    // Glowing Laser Core Rod
    const coreRodGeo = new THREE.CylinderGeometry(0.02, 0.02, 9.8, 8);
    const coreRodMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const coreRodMesh = new THREE.Mesh(coreRodGeo, coreRodMat);
    needleAssembly.add(coreRodMesh);

    // 2. Prismatic Seraph Wing Blades (Replacing muddy brown plate)
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0.45);
    wingShape.lineTo(0.4, 0.40);
    wingShape.lineTo(0.9, 0.70); // Upper barb
    wingShape.lineTo(1.1, 0.42);
    wingShape.lineTo(1.8, 0.35);
    wingShape.lineTo(2.8, 0.0);  // Main horizontal razor wing tip
    wingShape.lineTo(1.8, -0.22);
    wingShape.lineTo(1.1, -0.28);
    wingShape.lineTo(0.8, -0.55); // Lower barb
    wingShape.lineTo(0.4, -0.35);
    wingShape.lineTo(0, -0.45);
    // Left symmetry
    wingShape.lineTo(-0.4, -0.35);
    wingShape.lineTo(-0.8, -0.55);
    wingShape.lineTo(-1.1, -0.28);
    wingShape.lineTo(-1.8, -0.22);
    wingShape.lineTo(-2.8, 0.0); // Left horizontal razor wing tip
    wingShape.lineTo(-1.8, 0.35);
    wingShape.lineTo(-1.1, 0.42);
    wingShape.lineTo(-0.9, 0.70);
    wingShape.lineTo(-0.4, 0.40);
    wingShape.closePath();

    const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.025,
      bevelThickness: 0.025
    });
    wingGeo.center();

    const wingMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a0f1d, // Deep cosmic midnight obsidian (no muddy brown)
      metalness: 0.92,
      roughness: 0.12,
      emissive: 0x301e05, // Rich golden-bronze internal reflection
      emissiveIntensity: 0.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });
    const wingMesh = new THREE.Mesh(wingGeo, wingMat);
    needleAssembly.add(wingMesh);

    // Glowing Golden Razor Wing Edges
    const wingEdges = new THREE.EdgesGeometry(wingGeo, 20);
    const wingEdgeMat = new THREE.LineBasicMaterial({
      color: 0xffd166,
      linewidth: 2,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const wingEdgeLine = new THREE.LineSegments(wingEdges, wingEdgeMat);
    needleAssembly.add(wingEdgeLine);

    // Inlaid Golden Chevron Energy Runes on Wings
    const rWingInlay = [
      new THREE.Vector3(0.3, 0.2, 0.06),
      new THREE.Vector3(0.8, 0.48, 0.06),
      new THREE.Vector3(1.0, 0.26, 0.06),
      new THREE.Vector3(1.7, 0.20, 0.06),
      new THREE.Vector3(2.5, 0.0, 0.06),
      new THREE.Vector3(1.6, -0.14, 0.06),
      new THREE.Vector3(0.9, -0.18, 0.06),
      new THREE.Vector3(0.6, -0.38, 0.06),
      new THREE.Vector3(0.3, -0.20, 0.06)
    ];
    const lWingInlay = rWingInlay.map(p => new THREE.Vector3(-p.x, p.y, p.z));

    const inlayMat = new THREE.LineBasicMaterial({
      color: 0xffd166,
      transparent: true,
      opacity: 0.82,
      blending: THREE.AdditiveBlending
    });
    const rWingLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(rWingInlay), inlayMat);
    const lWingLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(lWingInlay), inlayMat);
    needleAssembly.add(rWingLine);
    needleAssembly.add(lWingLine);

    // 3. Dual Counter-Rotating Astral Gimbal Energy Rings
    const ringGeo1 = new THREE.TorusGeometry(0.60, 0.016, 12, 48);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xffd166,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const gimbalRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    gimbalRing1.rotation.x = Math.PI / 3;
    needleAssembly.add(gimbalRing1);

    const ringGeo2 = new THREE.TorusGeometry(0.76, 0.014, 12, 48);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const gimbalRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    gimbalRing2.rotation.y = Math.PI / 4;
    needleAssembly.add(gimbalRing2);

    // Central Diamond Crystal Core
    const coreDiamondGeo = new THREE.OctahedronGeometry(0.24, 0);
    const coreDiamondMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xffd166,
      emissiveIntensity: 0.8,
      roughness: 0.05,
      metalness: 0.95,
      clearcoat: 1.0
    });
    const coreDiamond = new THREE.Mesh(coreDiamondGeo, coreDiamondMat);
    needleAssembly.add(coreDiamond);

    // 4. The 5 Pulsing Starlight Novas Along Axis (From User Drawing)
    const starSprites = [];
    const starGems = [];
    const starYPositions = [2.6, 1.3, 0.0, -1.3, -2.6];
    const starScales = [1.35, 1.65, 2.6, 1.65, 1.35];

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
        const gemGeo = new THREE.OctahedronGeometry(0.12, 0);
        const gemMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const gemMesh = new THREE.Mesh(gemGeo, gemMat);
        gemMesh.position.set(0, yPos, 0.08);
        needleAssembly.add(gemMesh);
        starGems.push(gemMesh);
      }
    });

    // Tail Star Flare at bottom tip
    const tailFlareMat = new THREE.SpriteMaterial({
      map: starTexGold,
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const tailFlare = new THREE.Sprite(tailFlareMat);
    tailFlare.position.set(0, -4.75, 0.1);
    tailFlare.scale.set(0.9, 0.9, 1);
    needleAssembly.add(tailFlare);

    // 5. Dual Dynamic Electrical Plasma Filaments
    const numSpinePoints = 24;
    const spineArcPositions = new Float32Array(numSpinePoints * 3);
    const spineArcGeo = new THREE.BufferGeometry();
    spineArcGeo.setAttribute('position', new THREE.BufferAttribute(spineArcPositions, 3));
    const spineArcMat = new THREE.LineBasicMaterial({
      color: 0xfff6d0,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const spineArcLine = new THREE.Line(spineArcGeo, spineArcMat);
    needleAssembly.add(spineArcLine);

    const numWingPoints = 12;
    const rWingArcGeo = new THREE.BufferGeometry();
    rWingArcGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(numWingPoints * 3), 3));
    const lWingArcGeo = new THREE.BufferGeometry();
    lWingArcGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(numWingPoints * 3), 3));
    const wingArcMat = new THREE.LineBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const rWingArcLine = new THREE.Line(rWingArcGeo, wingArcMat);
    const lWingArcLine = new THREE.Line(lWingArcGeo, wingArcMat);
    needleAssembly.add(rWingArcLine);
    needleAssembly.add(lWingArcLine);

    function updateArcs(time){
      // 1. Spine Lightning Arc
      const spineArr = spineArcGeo.attributes.position.array;
      for(let i = 0; i < numSpinePoints; i++){
        const t = i / (numSpinePoints - 1);
        const y = (t * 9.2) - 4.6;
        const jitterX = (Math.random() - 0.5) * 0.05;
        const jitterZ = (Math.random() - 0.5) * 0.05;
        spineArr[i * 3 + 0] = Math.sin(time * 12 + y * 5) * 0.05 + jitterX;
        spineArr[i * 3 + 1] = y;
        spineArr[i * 3 + 2] = Math.cos(time * 10 + y * 4) * 0.05 + 0.09 + jitterZ;
      }
      spineArcGeo.attributes.position.needsUpdate = true;

      // 2. Wing Sparks
      const rWingArr = rWingArcGeo.attributes.position.array;
      const lWingArr = lWingArcGeo.attributes.position.array;
      for(let i = 0; i < numWingPoints; i++){
        const t = i / (numWingPoints - 1);
        const rx = t * 2.7;
        const ry = Math.sin(t * Math.PI) * 0.22 + (Math.random() - 0.5) * 0.06;
        rWingArr[i * 3 + 0] = rx;
        rWingArr[i * 3 + 1] = ry;
        rWingArr[i * 3 + 2] = 0.06;

        lWingArr[i * 3 + 0] = -rx;
        lWingArr[i * 3 + 1] = ry;
        lWingArr[i * 3 + 2] = 0.06;
      }
      rWingArcGeo.attributes.position.needsUpdate = true;
      lWingArcGeo.attributes.position.needsUpdate = true;
    }

    // 6. Ambient Floating Stardust Field
    const dustCount = 36;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustVelocities = [];
    for(let i = 0; i < dustCount; i++){
      dustPositions[i * 3 + 0] = (Math.random() - 0.5) * 4.2;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 9.2;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
      dustVelocities.push({
        vy: Math.random() * 0.02 + 0.008,
        swayPhase: Math.random() * Math.PI * 2
      });
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffd166,
      size: 0.09,
      transparent: true,
      opacity: 0.70,
      blending: THREE.AdditiveBlending
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // Razor Tip Starlight Emitter (Direct Aiming Focus)
    const tipFlareMat = new THREE.SpriteMaterial({
      map: starTexGold,
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const tipFlare = new THREE.Sprite(tipFlareMat);
    tipFlare.position.set(0, 4.95, 0.1);
    tipFlare.scale.set(1.2, 1.2, 1);
    needleAssembly.add(tipFlare);

    // Needle Scale: Majestic prominent sizing (~310px tall in open hero column)
    const NEEDLE_SCALE = 0.55;
    needleAssembly.scale.set(NEEDLE_SCALE, NEEDLE_SCALE, NEEDLE_SCALE);

    // 7. Astral Nova Click Bursts (Supernova pulse + sparks, zero lingering rings)
    const shockwaves = [];
    const sparkParticles = [];

    function triggerShockwave(){
      needleAssembly.updateMatrixWorld(true);
      // Summit razor tip world coordinates
      const tipWorldPos = needleAssembly.localToWorld(new THREE.Vector3(0, 4.95, 0));

      // Expanding Starlight Burst Flare
      const burstMat = new THREE.SpriteMaterial({
        map: starTexGold,
        color: 0xffffff,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const burstSprite = new THREE.Sprite(burstMat);
      burstSprite.position.copy(tipWorldPos);
      burstSprite.scale.set(0.8, 0.8, 1);
      scene.add(burstSprite);
      shockwaves.push({ sprite: burstSprite, scale: 0.8, opacity: 1.0 });

      // Radiating Starlight Sparks
      const numSparks = 12;
      for(let i = 0; i < numSparks; i++){
        const angle = (i / numSparks) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 2.5 + 1.4;
        const sparkMat = new THREE.SpriteMaterial({
          map: starTexGold,
          color: Math.random() > 0.4 ? 0xffd166 : 0x7dd3fc,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const sparkSprite = new THREE.Sprite(sparkMat);
        sparkSprite.position.copy(tipWorldPos);
        sparkSprite.scale.set(0.35, 0.35, 1);
        scene.add(sparkSprite);
        sparkParticles.push({
          sprite: sparkSprite,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          vz: (Math.random() - 0.5) * 0.8,
          opacity: 1.0
        });
      }

      // Flash tip flare
      tipFlare.scale.set(2.4, 2.4, 1);

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

      // 1. Direct Aiming: The razor edge/tip points directly at the mouse cursor
      let dx = 0, dy = -150; // default points slightly up
      if(stage){
        const rect = stage.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        dx = mouse.clientX - centerX;
        dy = mouse.clientY - centerY;
      }

      // Smooth decay of horizontal velocity
      mouseVelocityX *= 0.88;

      const dist = Math.hypot(dx, dy);
      if(dist > 8){
        // Screen direction angle from needle center to cursor
        // dx is right (+X), -dy is up (+Y in Three.js coordinates)
        const screenAngle = Math.atan2(-dy, dx);
        // Razor edge/tip is modeled along +Y, so subtracting PI/2 aligns the sharp tip directly with the mouse vector
        const zRot = screenAngle - Math.PI / 2;

        // Dynamic banking into sharp turns for agile flight response
        const bankRoll = Math.max(-0.25, Math.min(0.25, -mouseVelocityX * 0.015));

        // Lean tip slightly towards camera (+Z) for authentic 3D lighting without flips across all 360 degrees
        const leanAmount = Math.min(0.24, 0.10 + (dist / (window.innerWidth || 1200)) * 0.18);
        const targetEuler = new THREE.Euler(leanAmount, bankRoll, zRot, 'ZXY');
        needleState.targetQuat.setFromEuler(targetEuler);
      }

      needleAssembly.quaternion.slerp(needleState.targetQuat, 0.11);

      // Subtle levitation float
      needleAssembly.position.y = Math.sin(time * 2.2) * 0.12;
      needleGlowLight.position.copy(needleAssembly.position);

      // 2. Pulse Novas with Harmonic Waves
      starSprites.forEach(item => {
        const p = 1.0 + Math.sin(time * 3.8 + item.phase) * 0.22;
        item.sprite.scale.set(item.baseScale * p, item.baseScale * p, 1);
      });

      // Rotate gimbal rings & core gems
      gimbalRing1.rotation.z += 0.022;
      gimbalRing1.rotation.x += 0.012;
      gimbalRing2.rotation.z -= 0.018;
      gimbalRing2.rotation.y += 0.015;
      coreDiamond.rotation.y += 0.028;
      coreDiamond.rotation.x += 0.014;

      starGems.forEach(gem => {
        gem.rotation.y += 0.03;
      });

      // 3. Electrical Filaments
      updateArcs(time);

      // 4. Update Ambient Stardust
      const dustArr = dustGeo.attributes.position.array;
      for(let i = 0; i < dustCount; i++){
        dustArr[i * 3 + 1] += dustVelocities[i].vy;
        dustArr[i * 3 + 0] += Math.sin(time * 1.5 + dustVelocities[i].swayPhase) * 0.005;
        if(dustArr[i * 3 + 1] > 4.6){
          dustArr[i * 3 + 1] = -4.6;
        }
      }
      dustGeo.attributes.position.needsUpdate = true;

      // 5. Update Shockwave Bursts
      for(let i = shockwaves.length - 1; i >= 0; i--){
        const sw = shockwaves[i];
        sw.scale += delta * 6.5;
        sw.opacity -= delta * 3.2;
        sw.sprite.scale.set(sw.scale, sw.scale, 1);
        sw.sprite.material.opacity = Math.max(0, sw.opacity);
        if(sw.opacity <= 0){
          scene.remove(sw.sprite);
          sw.sprite.material.dispose();
          shockwaves.splice(i, 1);
        }
      }

      // 6. Update Spark Particles
      for(let i = sparkParticles.length - 1; i >= 0; i--){
        const sp = sparkParticles[i];
        sp.sprite.position.x += sp.vx * delta;
        sp.sprite.position.y += sp.vy * delta;
        sp.sprite.position.z += sp.vz * delta;
        sp.opacity -= delta * 2.6;
        sp.sprite.material.opacity = Math.max(0, sp.opacity);
        const s = Math.max(0.05, 0.35 * sp.opacity);
        sp.sprite.scale.set(s, s, 1);
        if(sp.opacity <= 0){
          scene.remove(sp.sprite);
          sp.sprite.material.dispose();
          sparkParticles.splice(i, 1);
        }
      }

      // Relax Tip Flare
      if(tipFlare.scale.x > 1.2){
        const nextScale = Math.max(1.2, tipFlare.scale.x - delta * 3.5);
        tipFlare.scale.set(nextScale, nextScale, 1);
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

