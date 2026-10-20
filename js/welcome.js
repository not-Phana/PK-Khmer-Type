/* PK Khmer Type — Welcome Experience Engine */
/* Interactive animations, Web Audio mechanical sound, typing theater & 3D tilt */

(function(){
  'use strict';

  /* ============================================================
     1. BILINGUAL DICTIONARY & LANGUAGE CONTROLLER
     ============================================================ */
  const I18N = {
    en: {
      brandTag: 'TOUCH-TYPING FOR CAMBODIA',
      launchStudio: 'Enter Studio',
      heroBadge: 'FREE TOUCH-TYPING TUTOR · KHMER & ENGLISH',
      titleP1: 'Master Touch-Typing with',
      titleHighlight: 'PK Khmer Type',
      titleKm: 'សូមស្វាគមន៍មកកាន់ PK Khmer Type',
      heroSubtitle: 'Learn to type Khmer fluently and accurately. Master Khmer Standard, Official NiDA Unicode, and English QWERTY with guided home-row lessons, tactile switch acoustics, and natural finger guides.',
      ctaPrimary: 'Start Learning Now',
      ctaGuide: 'Explore Keyboard Guide',
      demoTitle: 'Interactive Keyboard & Sound Preview',
      demoSubtitle: 'Press any key on your physical keyboard to hear authentic mechanical switch clicks.',
      demoBadge: 'INTERACTIVE PREVIEW',
      instructionText: 'Press any key on your keyboard to test mechanical acoustics and key travel:',
      pillarTag: 'DESIGNED WITH CARE',
      pillarHead: 'Why Typists Choose PK Khmer Type',
      p1Title: '3 Complete Layouts',
      p1Desc: 'Master Khmer Standard, Official NiDA Unicode, and English (US) with full coverage of consonants, vowels, subscript Coeng ្, and numbers.',
      p2Title: 'Natural Finger Placement',
      p2Desc: 'Rest your index fingers on tactile homing bumps (ថ/ញ & F/J) with real-time hand guides that show which finger to use for every letter.',
      p3Title: '276 Guided Lessons',
      p3Desc: 'From your first two anchor keys to full literature and custom lesson crafting. Practice at your own pace without pressure.',
      p4Title: 'Tactile Mechanical Acoustics',
      p4Desc: 'Hear satisfying click and thock acoustic feedback synthesized in your browser with zero audio lag.',
      pathwaysTag: 'CHOOSE WHERE TO START',
      pathwaysHead: 'Start Your Practice Session',
      path1Title: 'Beginner Curriculum',
      path1Desc: 'Start from Level 00 anchor keys and build finger muscle memory step by step.',
      path1Badge: 'Curriculum · Level 0',
      path2Title: 'Free-Typing Mode',
      path2Desc: 'Type freely with live speed (WPM) and accuracy tracking without time limits.',
      path2Badge: 'Free Typing Sandbox',
      path3Title: 'Custom Lesson Studio',
      path3Desc: 'Paste your own articles, songs, or study notes to create customized drills.',
      path3Badge: 'Custom Lesson Creator',
      path4Title: 'Keyboard Guide & Keymaps',
      path4Desc: 'Explore keycap diagrams, modifier combinations, and Khmer typing rules.',
      path4Badge: 'Reference & Guide',
      ctaBannerHead: 'Ready to type Khmer with confidence?',
      ctaBannerSub: 'Join students, teachers, writers, and typists across Cambodia mastering touch typing every day.',
      footerCreator: 'Designed and built with care for Cambodia by Phanna Kurosaki.',
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
      brandTag: 'ហ្វឹកហាត់វាយអក្សរខ្មែរ',
      launchStudio: 'ចូលស្ទូឌីយោ',
      heroBadge: 'កម្មវិធីរៀនវាយអក្សរខ្មែរ និងអង់គ្លេសឥតគិតថ្លៃ',
      titleP1: 'សូមស្វាគមន៍មកកាន់',
      titleHighlight: 'PK Khmer Type',
      titleKm: 'បណ្តុះបណ្តាលការវាយអក្សរខ្មែរ និងអង់គ្លេស',
      heroSubtitle: 'រៀនវាយអក្សរខ្មែរឱ្យបានស្ទាត់ជំនាញ និងត្រឹមត្រូវ។ ហ្វឹកហាត់ប្លង់ខ្មែរស្តង់ដារ និដា និងអង់គ្លេស ជាមួយមេរៀនជាជំហានៗ សំឡេងគ្រាប់ចុចមេកានិច និងការណែនាំម្រាមដៃពិតប្រាកដ។',
      ctaPrimary: 'ចាប់ផ្តើមរៀនឥឡូវនេះ',
      ctaGuide: 'មើលសៀវភៅណែនាំក្តារចុច',
      demoTitle: 'សាកល្បងចុចក្តារចុច និងស្តាប់សំឡេង',
      demoSubtitle: 'ចុចគ្រាប់ចុចណាមួយលើក្តារចុចពិតរបស់អ្នក ដើម្បីស្តាប់សំឡេងកុងតាក់មេកានិចពិតៗ។',
      demoBadge: 'សាកល្បងចុចផ្ទាល់',
      instructionText: 'សូមចុចគ្រាប់ចុចណាមួយនៅលើក្តារចុចពិតរបស់អ្នក ដើម្បីសាកល្បងសំឡេង និងចលនាគ្រាប់ចុច៖',
      pillarTag: 'រៀបចំឡើងដោយយកចិត្តទុកដាក់',
      pillarHead: 'លក្ខណៈពិសេសដែលជួយអ្នករៀនបានលឿន',
      p1Title: 'ប្លង់ក្តារចុចផ្លូវការ ៣',
      p1Desc: 'រៀនប្លង់ខ្មែរស្តង់ដារ ខ្មែរនិដា និងអង់គ្លេស ដោយរាប់បញ្ចូលគ្រប់តួអក្សរ ជើងអក្សរ ្ ស្រៈ និងវណ្ណយុត្តិទាំងអស់។',
      p2Title: 'ការដាក់ម្រាមដៃបានត្រឹមត្រូវ',
      p2Desc: 'ដាក់ម្រាមដៃលើគ្រាប់ចុចជួរដើម (ថ/ញ និង F/J) ដោយមានរូបភាពដៃ 3D បង្ហាញម្រាមដៃត្រូវចុចច្បាស់លាស់។',
      p3Title: '២៧៦ មេរៀនជាជំហានៗ',
      p3Desc: 'កម្មវិធីសិក្សា ៤០ កម្រិត ចាប់ពីកម្រិតដំបូងដល់កម្រិតខ្ពស់ ព្រមទាំងមានប្រព័ន្ធបង្កើតមេរៀនផ្ទាល់ខ្លួនយ៉ាងងាយស្រួល។',
      p4Title: 'សំឡេងចុចមេកានិចពិតៗ',
      p4Desc: 'សំឡេងកុងតាក់មេកានិច Topre និង Cherry កម្រិតខ្ពស់ សំយោគភ្លាមៗដោយគ្មានការយឺតយ៉ាវ។',
      pathwaysTag: 'ជ្រើសរើសចំណុចចាប់ផ្តើម',
      pathwaysHead: 'ចាប់ផ្តើមការហ្វឹកហាត់របស់អ្នក',
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
      footerCreator: 'រចនា និងបង្កើតឡើងដោយយកចិត្តទុកដាក់សម្រាប់កម្ពុជា ដោយ ផាន់ណា គូរ៉ូសាគី (Phanna Kurosaki)។',
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

    let stageWidth = stage ? stage.clientWidth : 480;
    let stageHeight = stage ? stage.clientHeight : 480;
    if(stageWidth < 100) stageWidth = 480;
    if(stageHeight < 100) stageHeight = 480;

    // Scene, Camera, Transparent High-Performance Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, stageWidth / stageHeight, 0.1, 100);
    camera.position.set(0, 0, 9.2);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(stageWidth, stageHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    // Warm, Natural Studio & Sunlight Lighting (Human Masterpiece Lighting)
    const ambientLight = new THREE.AmbientLight(0xfffbeb, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(4, 6, 7);
    scene.add(keyLight);

    const warmFillLight = new THREE.DirectionalLight(0xfef3c7, 1.3);
    warmFillLight.position.set(-5, -3, 3);
    scene.add(warmFillLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 1.6);
    rimLight.position.set(0, -6, 4);
    scene.add(rimLight);

    const needleGlowLight = new THREE.PointLight(0xffd166, 2.2, 7);
    scene.add(needleGlowLight);

    // Subtle, Elegant Horological Glint Texture
    function createStarlightTexture(colorHex){
      const cv = document.createElement('canvas');
      cv.width = 256;
      cv.height = 256;
      const ctx = cv.getContext('2d');
      const cx = 128, cy = 128;

      // Warm radial aura
      const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 110);
      radGrad.addColorStop(0, '#ffffff');
      radGrad.addColorStop(0.15, colorHex);
      radGrad.addColorStop(0.40, 'rgba(245, 158, 11, 0.25)');
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, 256, 256);

      ctx.save();
      ctx.translate(cx, cy);

      // Slender horizontal lens flare
      const hGrad = ctx.createLinearGradient(-110, 0, 110, 0);
      hGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      hGrad.addColorStop(0.5, '#ffffff');
      hGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = hGrad;
      ctx.beginPath();
      ctx.moveTo(-110, 0);
      ctx.quadraticCurveTo(0, -4, 110, 0);
      ctx.quadraticCurveTo(0, 4, -110, 0);
      ctx.fill();

      // Slender vertical lens flare
      const vGrad = ctx.createLinearGradient(0, -110, 0, 110);
      vGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      vGrad.addColorStop(0.5, '#ffffff');
      vGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = vGrad;
      ctx.beginPath();
      ctx.moveTo(0, -110);
      ctx.quadraticCurveTo(-4, 0, 0, 110);
      ctx.quadraticCurveTo(4, 0, 0, -110);
      ctx.fill();

      ctx.restore();

      const tex = new THREE.CanvasTexture(cv);
      tex.needsUpdate = true;
      return tex;
    }

    const starTexGold = createStarlightTexture('#fbbf24');

    // Root 3D Needle Lance Assembly (Artisan Horological Drafting Stylus)
    const needleAssembly = new THREE.Group();
    scene.add(needleAssembly);

    // 1. Slender Precision Stylus Spine (Brushed Champagne Brass)
    const spineShape = new THREE.Shape();
    spineShape.moveTo(0, 4.8);          // Precision stylus tip
    spineShape.lineTo(0.04, 3.2);       // Slender upper stem
    spineShape.lineTo(0.08, 1.6);       // Tapered collar
    spineShape.lineTo(0.14, 0.4);       // Upper hub
    spineShape.lineTo(0.18, 0.0);       // Center waist
    spineShape.lineTo(0.14, -0.4);      // Lower hub
    spineShape.lineTo(0.08, -1.6);      // Lower stem
    spineShape.lineTo(0.04, -3.2);      // Slender lower stem
    spineShape.lineTo(0, -4.6);         // Counter-weighted tail tip
    // Left symmetry
    spineShape.lineTo(-0.04, -3.2);
    spineShape.lineTo(-0.08, -1.6);
    spineShape.lineTo(-0.14, -0.4);
    spineShape.lineTo(-0.18, 0.0);
    spineShape.lineTo(-0.14, 0.4);
    spineShape.lineTo(-0.08, 1.6);
    spineShape.lineTo(-0.04, 3.2);
    spineShape.closePath();

    const spineGeo = new THREE.ExtrudeGeometry(spineShape, {
      depth: 0.10,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.03,
      bevelThickness: 0.03
    });
    spineGeo.center();

    // Brushed champagne satin brass material
    const spineMat = new THREE.MeshPhysicalMaterial({
      color: 0xfef3c7,
      metalness: 0.88,
      roughness: 0.22,
      emissive: 0xb45309,
      emissiveIntensity: 0.35,
      clearcoat: 0.5,
      clearcoatRoughness: 0.08
    });
    const spineMesh = new THREE.Mesh(spineGeo, spineMat);
    needleAssembly.add(spineMesh);

    // Fine Polished Chamfer Wireframe Line
    const spineEdges = new THREE.EdgesGeometry(spineGeo, 24);
    const spineEdgeMat = new THREE.LineBasicMaterial({
      color: 0xffedd5,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85
    });
    const spineEdgeLine = new THREE.LineSegments(spineEdges, spineEdgeMat);
    needleAssembly.add(spineEdgeLine);

    // 2. Sculpted Openwork Horological Wings (Inspired by Antique Astrolabe Indicators)
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0.45);
    wingShape.bezierCurveTo(0.5, 0.40, 1.2, 0.60, 2.5, 0.0);   // Graceful outer sweep
    wingShape.bezierCurveTo(1.4, -0.45, 0.6, -0.35, 0, -0.45); // Return sweep
    // Left wing
    wingShape.bezierCurveTo(-0.6, -0.35, -1.4, -0.45, -2.5, 0.0);
    wingShape.bezierCurveTo(-1.2, 0.60, -0.5, 0.40, 0, 0.45);
    wingShape.closePath();

    // Openwork teardrop holes inside each wing
    const rHole = new THREE.Path();
    rHole.moveTo(0.5, 0.12);
    rHole.bezierCurveTo(0.9, 0.22, 1.6, 0.10, 1.9, 0.0);
    rHole.bezierCurveTo(1.5, -0.10, 0.9, -0.12, 0.5, -0.05);
    rHole.closePath();
    wingShape.holes.push(rHole);

    const lHole = new THREE.Path();
    lHole.moveTo(-0.5, 0.12);
    lHole.bezierCurveTo(-0.9, 0.22, -1.6, 0.10, -1.9, 0.0);
    lHole.bezierCurveTo(-1.5, -0.10, -0.9, -0.12, -0.5, -0.05);
    lHole.closePath();
    wingShape.holes.push(lHole);

    const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.025,
      bevelThickness: 0.025
    });
    wingGeo.center();

    // Deep polished obsidian titanium with warm amber inner tone
    const wingMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      metalness: 0.90,
      roughness: 0.16,
      emissive: 0x451a03,
      emissiveIntensity: 0.25,
      clearcoat: 0.8,
      clearcoatRoughness: 0.05
    });
    const wingMesh = new THREE.Mesh(wingGeo, wingMat);
    needleAssembly.add(wingMesh);

    // Warm Golden Bevel Contour
    const wingEdges = new THREE.EdgesGeometry(wingGeo, 20);
    const wingEdgeMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.90
    });
    const wingEdgeLine = new THREE.LineSegments(wingEdges, wingEdgeMat);
    needleAssembly.add(wingEdgeLine);

    // 3. Central Horological Ruby Pivot Jewel in Polished Bezel Setting
    // Bezel Setting (Gold Ring)
    const bezelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.14, 32);
    const bezelMat = new THREE.MeshPhysicalMaterial({
      color: 0xfde68a,
      metalness: 0.92,
      roughness: 0.15,
      clearcoat: 1.0
    });
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.rotation.x = Math.PI / 2;
    needleAssembly.add(bezel);

    // Cabochon Ruby Jewel Pivot
    const rubyGeo = new THREE.SphereGeometry(0.22, 32, 16);
    const rubyMat = new THREE.MeshPhysicalMaterial({
      color: 0xdc2626,
      emissive: 0x991b1b,
      emissiveIntensity: 0.45,
      roughness: 0.06,
      metalness: 0.10,
      transmission: 0.65,
      clearcoat: 1.0
    });
    const rubyJewel = new THREE.Mesh(rubyGeo, rubyMat);
    rubyJewel.scale.set(1, 1, 0.45);
    needleAssembly.add(rubyJewel);

    // 4. Satin Brass Astrolabe Balance Ring with 4 Cardinal Markers
    const astrolabeRingGeo = new THREE.TorusGeometry(0.78, 0.016, 16, 64);
    const astrolabeRingMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.22,
      clearcoat: 0.4
    });
    const astrolabeRing = new THREE.Mesh(astrolabeRingGeo, astrolabeRingMat);
    astrolabeRing.rotation.x = Math.PI / 4;
    needleAssembly.add(astrolabeRing);

    // 4 Cardinal Studs on Ring
    const studGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 16);
    const studMat = new THREE.MeshPhysicalMaterial({
      color: 0xfef3c7,
      metalness: 0.95,
      roughness: 0.1
    });
    for(let i = 0; i < 4; i++){
      const angle = (i / 4) * Math.PI * 2;
      const stud = new THREE.Mesh(studGeo, studMat);
      stud.position.set(Math.cos(angle) * 0.78, Math.sin(angle) * 0.78, 0);
      stud.rotation.z = angle;
      astrolabeRing.add(stud);
    }

    // 5. Stylus Tip Glint (Direct Aiming Focus)
    const tipFlareMat = new THREE.SpriteMaterial({
      map: starTexGold,
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const tipFlare = new THREE.Sprite(tipFlareMat);
    tipFlare.position.set(0, 4.8, 0.1);
    tipFlare.scale.set(1.1, 1.1, 1);
    needleAssembly.add(tipFlare);

    // Counter-weight Tail Glint
    const tailFlareMat = new THREE.SpriteMaterial({
      map: starTexGold,
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const tailFlare = new THREE.Sprite(tailFlareMat);
    tailFlare.position.set(0, -4.6, 0.1);
    tailFlare.scale.set(0.85, 0.85, 1);
    needleAssembly.add(tailFlare);

    // Needle Scale: Majestic prominent sizing (~300px tall in open hero column)
    const NEEDLE_SCALE = 0.55;
    needleAssembly.scale.set(NEEDLE_SCALE, NEEDLE_SCALE, NEEDLE_SCALE);

    // 6. Tactile Click Wave (Gentle warm ripple, zero violent explosions)
    const ripples = [];

    function triggerShockwave(){
      needleAssembly.updateMatrixWorld(true);
      const tipWorldPos = needleAssembly.localToWorld(new THREE.Vector3(0, 4.8, 0));

      const ringGeo = new THREE.RingGeometry(0.15, 0.25, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const mesh = new THREE.Mesh(ringGeo, ringMat);
      mesh.position.copy(tipWorldPos);
      mesh.quaternion.copy(needleAssembly.quaternion);
      scene.add(mesh);

      ripples.push({ mesh, scale: 1, opacity: 0.85 });

      // Gentle tip glint pulse
      tipFlare.scale.set(1.9, 1.9, 1);
      needleGlowLight.intensity = 3.8;

      playCelestialChime();
    }

    window.addEventListener('pointerdown', () => {
      triggerShockwave();
    });

    // Mouse Tracking across Window with Natural Mechanical Weight & Inertia
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
      const w = rect.width || 480;
      const h = rect.height || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    window.addEventListener('resize', handleResize);

    // Animation & Real-Time Aiming Loop (Fluid, Weighted Mechanical Precision)
    let clock = new THREE.Clock();

    function renderLoop(){
      requestAnimationFrame(renderLoop);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // 1. Direct Aiming: The stylus tip points smoothly toward the mouse cursor
      let dx = 0, dy = -140;
      if(stage){
        const rect = stage.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        dx = mouse.clientX - centerX;
        dy = mouse.clientY - centerY;
      }

      mouseVelocityX *= 0.90;

      const dist = Math.hypot(dx, dy);
      if(dist > 8){
        const screenAngle = Math.atan2(-dy, dx);
        const zRot = screenAngle - Math.PI / 2;
        const bankRoll = Math.max(-0.20, Math.min(0.20, -mouseVelocityX * 0.012));
        const leanAmount = Math.min(0.22, 0.08 + (dist / (window.innerWidth || 1200)) * 0.15);
        const targetEuler = new THREE.Euler(leanAmount, bankRoll, zRot, 'ZXY');
        needleState.targetQuat.setFromEuler(targetEuler);
      }

      needleAssembly.quaternion.slerp(needleState.targetQuat, 0.08);

      // Gentle levitation breathing
      needleAssembly.position.y = Math.sin(time * 1.6) * 0.08;
      needleGlowLight.position.copy(needleAssembly.position);

      // Smooth slow rotation of the astrolabe brass ring
      astrolabeRing.rotation.z += 0.008;

      // Relax Tip Flare & Light Intensity smoothly
      if(tipFlare.scale.x > 1.1){
        const nextScale = Math.max(1.1, tipFlare.scale.x - delta * 2.8);
        tipFlare.scale.set(nextScale, nextScale, 1);
      }
      if(needleGlowLight.intensity > 2.2){
        needleGlowLight.intensity = Math.max(2.2, needleGlowLight.intensity - delta * 3.5);
      }

      // 2. Update Click Ripples
      for(let i = ripples.length - 1; i >= 0; i--){
        const r = ripples[i];
        r.scale += delta * 4.2;
        r.opacity -= delta * 1.8;
        r.mesh.scale.set(r.scale, r.scale, r.scale);
        r.mesh.material.opacity = Math.max(0, r.opacity);
        if(r.opacity <= 0){
          scene.remove(r.mesh);
          r.mesh.geometry.dispose();
          r.mesh.material.dispose();
          ripples.splice(i, 1);
        }
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

