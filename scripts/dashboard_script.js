// scripts/dashboard_script.js
// Complete Client-Side JavaScript Logic for PK Khmer Type Analytics & Mastery Dashboard
// Ultra-Cool Performance Progression Trajectory & Live Telemetry Engine
// Strict Zero-Emoji Policy: 100% Inline SVG Vector Geometry

module.exports = `
    document.addEventListener('DOMContentLoaded', () => {
      // Set current date
      const d = new Date();
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const dateEl = document.getElementById('currentDateDisplay');
      if (dateEl) dateEl.textContent = \`\${months[d.getMonth()]} \${d.getFullYear()}\`;

      // Procedural Audio Synthesizer for High-Tech Haptic Clicks (Zero Network Requests)
      let audioCtx = null;
      function playHapticTick(freq = 880, dur = 0.02) {
        try {
          if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          if (audioCtx.state === 'suspended') audioCtx.resume();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + dur);
        } catch (e) {}
      }

      // Smooth Animated Rolling Counters
      function animateCounter(el, target, suffix = '') {
        if (!el) return;
        const start = 0;
        const dur = 700;
        const startTime = performance.now();
        const isDecimal = String(target).includes('.');

        function step(now) {
          const progress = Math.min(1, (now - startTime) / dur);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = start + (target - start) * easeOut;
          el.innerHTML = isDecimal
            ? \`\${current.toFixed(1)} \${suffix}\`
            : \`\${Math.round(current).toLocaleString()} \${suffix}\`;
          if (progress < 1) {
            requestAnimationFrame(step);
          }
        }
        requestAnimationFrame(step);
      }

      // Scribe Ranks Definition
      const SCRIBE_RANKS = [
        { level: 1, title: 'Level 1: Initiate Scribe', minXp: 0, maxXp: 300 },
        { level: 2, title: 'Level 2: Apprentice Scribe', minXp: 300, maxXp: 800 },
        { level: 3, title: 'Level 3: Temple Scribe', minXp: 800, maxXp: 1600 },
        { level: 4, title: 'Level 4: Palm-Leaf Artisan', minXp: 1600, maxXp: 2800 },
        { level: 5, title: 'Level 5: Royal Calligrapher', minXp: 2800, maxXp: 4500 },
        { level: 6, title: 'Level 6: Angkor Master Scribe', minXp: 4500, maxXp: 7000 },
        { level: 7, title: 'Level 7: High Priest of Script', minXp: 7000, maxXp: 10000 },
        { level: 8, title: 'Level 8: Maha Scribe Supreme', minXp: 10000, maxXp: 999999 }
      ];

      // Track Metadata
      const TRACK_METADATA = {
        standard: {
          name: 'Khmer Standard',
          badgeName: 'Khmer Standard (78 Lessons)',
          totalLessons: 78,
          levels: [
            { id: 'standard-L00', title: 'Unit 1: Keyboard Orientation', count: 4, lessons: ['standard-L00-01','standard-L00-02','standard-L00-03','standard-L00-04'] },
            { id: 'standard-L01', title: 'Unit 2: Home Row Consonants', count: 5, lessons: ['standard-L01-01','standard-L01-02','standard-L01-03','standard-L01-04','standard-L01-05'] },
            { id: 'standard-L02', title: 'Unit 3: Home Row Vowels & Signs', count: 4, lessons: ['standard-L02-01','standard-L02-02','standard-L02-03','standard-L02-04'] },
            { id: 'standard-L03', title: 'Unit 4: Top Row Reaches', count: 6, lessons: ['standard-L03-01','standard-L03-02','standard-L03-03','standard-L03-04','standard-L03-05','standard-L03-06'] },
            { id: 'standard-L04', title: 'Unit 5: Bottom Row Reaches', count: 5, lessons: ['standard-L04-01','standard-L04-02','standard-L04-03','standard-L04-04','standard-L04-05'] },
            { id: 'standard-L05', title: 'Unit 6: Spacebar Subscript Clusters', count: 8, lessons: ['standard-L05-01','standard-L05-02','standard-L05-03','standard-L05-04','standard-L05-05','standard-L05-06','standard-L05-07','standard-L05-08'] },
            { id: 'standard-L06', title: 'Unit 7: Standard Shift Consonants', count: 8, lessons: ['standard-L06-01','standard-L06-02','standard-L06-03','standard-L06-04','standard-L06-05','standard-L06-06','standard-L06-07','standard-L06-08'] },
            { id: 'standard-L07', title: 'Unit 8: Standard Shift Vowels', count: 7, lessons: ['standard-L07-01','standard-L07-02','standard-L07-03','standard-L07-04','standard-L07-05','standard-L07-06','standard-L07-07'] },
            { id: 'standard-L08', title: 'Unit 9: Coeng Combinations', count: 6, lessons: ['standard-L08-01','standard-L08-02','standard-L08-03','standard-L08-04','standard-L08-05','standard-L08-06'] },
            { id: 'standard-L09', title: 'Unit 10: Diacritics & Signs', count: 5, lessons: ['standard-L09-01','standard-L09-02','standard-L09-03','standard-L09-04','standard-L09-05'] },
            { id: 'standard-L10', title: 'Unit 11: Word Practice', count: 8, lessons: ['standard-L10-01','standard-L10-02','standard-L10-03','standard-L10-04','standard-L10-05','standard-L10-06','standard-L10-07','standard-L10-08'] },
            { id: 'standard-L11', title: 'Unit 12: Sentences & Paragraphs', count: 6, lessons: ['standard-L11-01','standard-L11-02','standard-L11-03','standard-L11-04','standard-L11-05','standard-L11-06'] },
            { id: 'standard-L12', title: 'Unit 13: Speed & Mastery', count: 6, lessons: ['standard-L12-01','standard-L12-02','standard-L12-03','standard-L12-04','standard-L12-05','standard-L12-06'] }
          ]
        },
        nida: {
          name: 'Khmer NiDA',
          badgeName: 'Khmer NiDA Unicode (78 Lessons)',
          totalLessons: 78,
          levels: [
            { id: 'nida-L00', title: 'Unit 1: Keyboard Orientation', count: 4, lessons: ['nida-L00-01','nida-L00-02','nida-L00-03','nida-L00-04'] },
            { id: 'nida-L01', title: 'Unit 2: Home Row Consonants', count: 5, lessons: ['nida-L01-01','nida-L01-02','nida-L01-03','nida-L01-04','nida-L01-05'] },
            { id: 'nida-L02', title: 'Unit 3: Home Row Vowels & Bantoc', count: 4, lessons: ['nida-L02-01','nida-L02-02','nida-L02-03','nida-L02-04'] },
            { id: 'nida-L03', title: 'Unit 4: Top Row Common', count: 6, lessons: ['nida-L03-01','nida-L03-02','nida-L03-03','nida-L03-04','nida-L03-05','nida-L03-06'] },
            { id: 'nida-L04', title: 'Unit 5: Bottom Row Common', count: 5, lessons: ['nida-L04-01','nida-L04-02','nida-L04-03','nida-L04-04','nida-L04-05'] },
            { id: 'nida-L05', title: 'Unit 6: Remaining Base Layer & Coeng', count: 8, lessons: ['nida-L05-01','nida-L05-02','nida-L05-03','nida-L05-04','nida-L05-05','nida-L05-06','nida-L05-07','nida-L05-08'] },
            { id: 'nida-L06', title: 'Unit 7: Shift Consonants', count: 8, lessons: ['nida-L06-01','nida-L06-02','nida-L06-03','nida-L06-04','nida-L06-05','nida-L06-06','nida-L06-07','nida-L06-08'] },
            { id: 'nida-L07', title: 'Unit 8: Shift Vowels & Compounds', count: 7, lessons: ['nida-L07-01','nida-L07-02','nida-L07-03','nida-L07-04','nida-L07-05','nida-L07-06','nida-L07-07'] },
            { id: 'nida-L08', title: 'Unit 9: Coeng Combinations', count: 6, lessons: ['nida-L08-01','nida-L08-02','nida-L08-03','nida-L08-04','nida-L08-05','nida-L08-06'] },
            { id: 'nida-L09', title: 'Unit 10: Diacritics & Signs', count: 5, lessons: ['nida-L09-01','nida-L09-02','nida-L09-03','nida-L09-04','nida-L09-05'] },
            { id: 'nida-L10', title: 'Unit 11: Word Practice', count: 8, lessons: ['nida-L10-01','nida-L10-02','nida-L10-03','nida-L10-04','nida-L10-05','nida-L10-06','nida-L10-07','nida-L10-08'] },
            { id: 'nida-L11', title: 'Unit 12: Sentences & Paragraphs', count: 6, lessons: ['nida-L11-01','nida-L11-02','nida-L11-03','nida-L11-04','nida-L11-05','nida-L11-06'] },
            { id: 'nida-L12', title: 'Unit 13: Speed & Mastery', count: 6, lessons: ['nida-L12-01','nida-L12-02','nida-L12-03','nida-L12-04','nida-L12-05','nida-L12-06'] }
          ]
        },
        english: {
          name: 'English US',
          badgeName: 'English US QWERTY (66 Lessons)',
          totalLessons: 66,
          levels: [
            { id: 'en-L00', title: 'Unit 1: Anchor Keys & Orientation', count: 4, lessons: ['en-L00-01','en-L00-02','en-L00-03','en-L00-04'] },
            { id: 'en-L01', title: 'Unit 2: Core Home Row: D, K, S, L', count: 4, lessons: ['en-L01-01','en-L01-02','en-L01-03','en-L01-04'] },
            { id: 'en-L02', title: 'Unit 3: Full Core Home Row & Words', count: 5, lessons: ['en-L02-01','en-L02-02','en-L02-03','en-L02-04','en-L02-05'] },
            { id: 'en-L03', title: 'Unit 4: Home Row Reaches', count: 4, lessons: ['en-L03-01','en-L03-02','en-L03-03','en-L03-04'] },
            { id: 'en-L04', title: 'Unit 5: Top Row Vowels', count: 5, lessons: ['en-L04-01','en-L04-02','en-L04-03','en-L04-04','en-L04-05'] },
            { id: 'en-L05', title: 'Unit 6: Top Row Remaining', count: 5, lessons: ['en-L05-01','en-L05-02','en-L05-03','en-L05-04','en-L05-05'] },
            { id: 'en-L06', title: 'Unit 7: Bottom Row', count: 6, lessons: ['en-L06-01','en-L06-02','en-L06-03','en-L06-04','en-L06-05','en-L06-06'] },
            { id: 'en-L07', title: 'Unit 8: Full Alphabet', count: 4, lessons: ['en-L07-01','en-L07-02','en-L07-03','en-L07-04'] },
            { id: 'en-L08', title: 'Unit 9: Capital Letters', count: 5, lessons: ['en-L08-01','en-L08-02','en-L08-03','en-L08-04','en-L08-05'] },
            { id: 'en-L09', title: 'Unit 10: Number Row', count: 4, lessons: ['en-L09-01','en-L09-02','en-L09-03','en-L09-04'] },
            { id: 'en-L10', title: 'Unit 11: Punctuation & Symbols', count: 5, lessons: ['en-L10-01','en-L10-02','en-L10-03','en-L10-04','en-L10-05'] },
            { id: 'en-L11', title: 'Unit 12: Sentences', count: 5, lessons: ['en-L11-01','en-L11-02','en-L11-03','en-L11-04','en-L11-05'] },
            { id: 'en-L12', title: 'Unit 13: Paragraphs', count: 4, lessons: ['en-L12-01','en-L12-02','en-L12-03','en-L12-04'] },
            { id: 'en-L13', title: 'Unit 14: Speed & Mastery', count: 6, lessons: ['en-L13-01','en-L13-02','en-L13-03','en-L13-04','en-L13-05','en-L13-06'] }
          ]
        }
      };

      // ANSI 104 Heatmap Keycaps with Finger Assignments & Character Descriptions
      const KEYBOARD_LAYOUTS = {
        standard: [
          [
            { label: '«', id: 'grave', finger: 'lp', desc: 'សញ្ញាសម្រង់ «' }, { label: '១', id: '1', finger: 'lp', desc: 'លេខ ១' },
            { label: '២', id: '2', finger: 'lr', desc: 'លេខ ២' }, { label: '៣', id: '3', finger: 'lm', desc: 'លេខ ៣' },
            { label: '៤', id: '4', finger: 'li', desc: 'លេខ ៤' }, { label: '៥', id: '5', finger: 'li', desc: 'លេខ ៥' },
            { label: '៦', id: '6', finger: 'ri', desc: 'លេខ ៦' }, { label: '៧', id: '7', finger: 'ri', desc: 'លេខ ៧' },
            { label: '៨', id: '8', finger: 'rm', desc: 'លេខ ៨' }, { label: '៩', id: '9', finger: 'rr', desc: 'លេខ ៩' },
            { label: '០', id: '0', finger: 'rp', desc: 'លេខ ០' }, { label: '-', id: 'minus', finger: 'rp', desc: 'សញ្ញាដក' },
            { label: '=', id: 'equal', finger: 'rp', desc: 'សញ្ញាស្មើ' }, { label: 'Bksp', id: 'backspace', finger: 'rp', cls: 'w-15', desc: 'Backspace' }
          ],
          [
            { label: 'Tab', id: 'tab', finger: 'lp', cls: 'w-15', desc: 'Tab' }, { label: 'ឆ', id: 'q', finger: 'lp', desc: 'ព្យញ្ជនៈ ឆ' },
            { label: 'ឹ', id: 'w', finger: 'lr', desc: 'ស្រៈ អឹ' }, { label: 'េ', id: 'e', finger: 'lm', desc: 'ស្រៈ អេ' },
            { label: 'រ', id: 'r', finger: 'li', desc: 'ព្យញ្ជនៈ រ' }, { label: 'ត', id: 't', finger: 'li', desc: 'ព្យញ្ជនៈ ត' },
            { label: 'យ', id: 'y', finger: 'ri', desc: 'ព្យញ្ជនៈ យ' }, { label: 'ុ', id: 'u', finger: 'ri', desc: 'ស្រៈ អុ' },
            { label: 'ិ', id: 'i', finger: 'rm', desc: 'ស្រៈ អិ' }, { label: 'ោ', id: 'o', finger: 'rr', desc: 'ស្រៈ អោ' },
            { label: 'ផ', id: 'p', finger: 'rp', desc: 'ព្យញ្ជនៈ ផ' }, { label: 'ើ', id: 'bracketL', finger: 'rp', desc: 'ស្រៈ អើ' },
            { label: 'ឿ', id: 'bracketR', finger: 'rp', desc: 'ស្រៈ អឿ' }, { label: '\\\\', id: 'backslash', finger: 'rp', cls: 'w-15', desc: 'Backslash' }
          ],
          [
            { label: 'Caps', id: 'caps', finger: 'lp', cls: 'w-15', desc: 'Caps Lock' }, { label: 'ា', id: 'a', finger: 'lp', desc: 'ស្រៈ អា' },
            { label: 'ស', id: 's', finger: 'lr', desc: 'ព្យញ្ជនៈ ស' }, { label: 'ដ', id: 'd', finger: 'lm', desc: 'ព្យញ្ជនៈ ដ' },
            { label: 'ថ', id: 'f', finger: 'li', desc: 'ព្យញ្ជនៈ ថ' }, { label: 'ង', id: 'g', finger: 'li', desc: 'ព្យញ្ជនៈ ង' },
            { label: 'ហ', id: 'h', finger: 'ri', desc: 'ព្យញ្ជនៈ ហ' }, { label: 'ញ', id: 'j', finger: 'ri', desc: 'ព្យញ្ជនៈ ញ' },
            { label: 'ក', id: 'k', finger: 'rm', desc: 'ព្យញ្ជនៈ ក' }, { label: 'ល', id: 'l', finger: 'rr', desc: 'ព្យញ្ជនៈ ល' },
            { label: 'ះ', id: 'semicolon', finger: 'rp', desc: 'ស្រៈ អះ' }, { label: '់', id: 'quote', finger: 'rp', desc: 'បន្តក់' },
            { label: 'Enter', id: 'enter', finger: 'rp', cls: 'w-20', desc: 'Enter' }
          ],
          [
            { label: 'Shift', id: 'shiftL', finger: 'lp', cls: 'w-20', desc: 'Left Shift' }, { label: 'ឋ', id: 'z', finger: 'lp', desc: 'ព្យញ្ជនៈ ឋ' },
            { label: 'ខ', id: 'x', finger: 'lr', desc: 'ព្យញ្ជនៈ ខ' }, { label: 'ច', id: 'c', finger: 'lm', desc: 'ព្យញ្ជនៈ ច' },
            { label: 'វ', id: 'v', finger: 'li', desc: 'ព្យញ្ជនៈ វ' }, { label: 'ប', id: 'b', finger: 'li', desc: 'ព្យញ្ជនៈ ប' },
            { label: 'ន', id: 'n', finger: 'ri', desc: 'ព្យញ្ជនៈ ន' }, { label: 'ម', id: 'm', finger: 'ri', desc: 'ព្យញ្ជនៈ ម' },
            { label: 'អ', id: 'comma', finger: 'rm', desc: 'ព្យញ្ជនៈ អ' }, { label: '។', id: 'period', finger: 'rr', desc: 'ខណ្ឌ ។' },
            { label: '?', id: 'slash', finger: 'rp', desc: 'សញ្ញាសួរ ?' }, { label: 'Shift', id: 'shiftR', finger: 'rp', cls: 'w-20', desc: 'Right Shift' }
          ],
          [
            { label: 'Ctrl', id: 'ctrlL', finger: 'lp', cls: 'w-15', desc: 'Left Control' }, { label: 'Alt', id: 'alt', finger: 'lt', cls: 'w-15', desc: 'Left Alt' },
            { label: 'Spacebar (ដកឃ្លា)', id: 'space', finger: 'thumb', cls: 'w-space', desc: 'ដកឃ្លា / ជើងព្យញ្ជនៈ' },
            { label: 'AltGr', id: 'altgr', finger: 'rt', cls: 'w-15', desc: 'Right Alt' }, { label: 'Ctrl', id: 'ctrlR', finger: 'rp', cls: 'w-15', desc: 'Right Control' }
          ]
        ],
        nida: [
          [
            { label: '«', id: 'grave', finger: 'lp', desc: 'សញ្ញាសម្រង់' }, { label: '១', id: '1', finger: 'lp', desc: 'លេខ ១' },
            { label: '២', id: '2', finger: 'lr', desc: 'លេខ ២' }, { label: '៣', id: '3', finger: 'lm', desc: 'លេខ ៣' },
            { label: '៤', id: '4', finger: 'li', desc: 'លេខ ៤' }, { label: '៥', id: '5', finger: 'li', desc: 'លេខ ៥' },
            { label: '៦', id: '6', finger: 'ri', desc: 'លេខ ៦' }, { label: '៧', id: '7', finger: 'ri', desc: 'លេខ ៧' },
            { label: '៨', id: '8', finger: 'rm', desc: 'លេខ ៨' }, { label: '៩', id: '9', finger: 'rr', desc: 'លេខ ៩' },
            { label: '០', id: '0', finger: 'rp', desc: 'លេខ ០' }, { label: 'ឥ', id: 'minus', finger: 'rp', desc: 'ស្រៈពេញតួ ឥ' },
            { label: 'ឲ', id: 'equal', finger: 'rp', desc: 'ស្រៈពេញតួ ឲ' }, { label: 'Bksp', id: 'backspace', finger: 'rp', cls: 'w-15', desc: 'Backspace' }
          ],
          [
            { label: 'Tab', id: 'tab', finger: 'lp', cls: 'w-15', desc: 'Tab' }, { label: 'ឆ', id: 'q', finger: 'lp', desc: 'ព្យញ្ជនៈ ឆ' },
            { label: 'ឹ', id: 'w', finger: 'lr', desc: 'ស្រៈ អឹ' }, { label: 'េ', id: 'e', finger: 'lm', desc: 'ស្រៈ អេ' },
            { label: 'រ', id: 'r', finger: 'li', desc: 'ព្យញ្ជនៈ រ' }, { label: 'ត', id: 't', finger: 'li', desc: 'ព្យញ្ជនៈ ត' },
            { label: 'យ', id: 'y', finger: 'ri', desc: 'ព្យញ្ជនៈ យ' }, { label: 'ុ', id: 'u', finger: 'ri', desc: 'ស្រៈ អុ' },
            { label: 'ិ', id: 'i', finger: 'rm', desc: 'ស្រៈ អិ' }, { label: 'ោ', id: 'o', finger: 'rr', desc: 'ស្រៈ អោ' },
            { label: 'ផ', id: 'p', finger: 'rp', desc: 'ព្យញ្ជនៈ ផ' }, { label: 'ៀ', id: 'bracketL', finger: 'rp', desc: 'ស្រៈ អៀ' },
            { label: 'ឪ', id: 'bracketR', finger: 'rp', desc: 'ស្រៈពេញតួ ឪ' }, { label: 'ឮ', id: 'backslash', finger: 'rp', cls: 'w-15', desc: 'ស្រៈពេញតួ ឮ' }
          ],
          [
            { label: 'Caps', id: 'caps', finger: 'lp', cls: 'w-15', desc: 'Caps Lock' }, { label: 'ា', id: 'a', finger: 'lp', desc: 'ស្រៈ អា' },
            { label: 'ស', id: 's', finger: 'lr', desc: 'ព្យញ្ជនៈ ស' }, { label: 'ដ', id: 'd', finger: 'lm', desc: 'ព្យញ្ជនៈ ដ' },
            { label: 'ថ', id: 'f', finger: 'li', desc: 'ព្យញ្ជនៈ ថ' }, { label: 'ង', id: 'g', finger: 'li', desc: 'ព្យញ្ជនៈ ង' },
            { label: 'ហ', id: 'h', finger: 'ri', desc: 'ព្យញ្ជនៈ ហ' }, { label: '្', id: 'j', finger: 'ri', desc: 'ជើងព្យញ្ជនៈ (Coeng)' },
            { label: 'ក', id: 'k', finger: 'rm', desc: 'ព្យញ្ជនៈ ក' }, { label: 'ល', id: 'l', finger: 'rr', desc: 'ព្យញ្ជនៈ ល' },
            { label: 'ើ', id: 'semicolon', finger: 'rp', desc: 'ស្រៈ អើ' }, { label: '់', id: 'quote', finger: 'rp', desc: 'បន្តក់' },
            { label: 'Enter', id: 'enter', finger: 'rp', cls: 'w-20', desc: 'Enter' }
          ],
          [
            { label: 'Shift', id: 'shiftL', finger: 'lp', cls: 'w-20', desc: 'Left Shift' }, { label: 'ឋ', id: 'z', finger: 'lp', desc: 'ព្យញ្ជនៈ ឋ' },
            { label: 'ខ', id: 'x', finger: 'lr', desc: 'ព្យញ្ជនៈ ខ' }, { label: 'ច', id: 'c', finger: 'lm', desc: 'ព្យញ្ជនៈ ច' },
            { label: 'វ', id: 'v', finger: 'li', desc: 'ព្យញ្ជនៈ វ' }, { label: 'ប', id: 'b', finger: 'li', desc: 'ព្យញ្ជនៈ ប' },
            { label: 'ន', id: 'n', finger: 'ri', desc: 'ព្យញ្ជនៈ ន' }, { label: 'ម', id: 'm', finger: 'ri', desc: 'ព្យញ្ជនៈ ម' },
            { label: 'ុំ', id: 'comma', finger: 'rm', desc: 'ស្រៈ អុំ' }, { label: '។', id: 'period', finger: 'rr', desc: 'ខណ្ឌ' },
            { label: '៊', id: 'slash', finger: 'rp', desc: 'ត្រីស័ព្ទ' }, { label: 'Shift', id: 'shiftR', finger: 'rp', cls: 'w-20', desc: 'Right Shift' }
          ],
          [
            { label: 'Ctrl', id: 'ctrlL', finger: 'lp', cls: 'w-15', desc: 'Left Control' }, { label: 'Alt', id: 'alt', finger: 'lt', cls: 'w-15', desc: 'Left Alt' },
            { label: 'Spacebar (ដកឃ្លា)', id: 'space', finger: 'thumb', cls: 'w-space', desc: 'ដកឃ្លា' },
            { label: 'AltGr', id: 'altgr', finger: 'rt', cls: 'w-15', desc: 'Right Alt' }, { label: 'Ctrl', id: 'ctrlR', finger: 'rp', cls: 'w-15', desc: 'Right Control' }
          ]
        ],
        english: [
          [
            { label: '~', id: 'grave', finger: 'lp', desc: 'Tilde' }, { label: '1', id: '1', finger: 'lp', desc: 'Number 1' },
            { label: '2', id: '2', finger: 'lr', desc: 'Number 2' }, { label: '3', id: '3', finger: 'lm', desc: 'Number 3' },
            { label: '4', id: '4', finger: 'li', desc: 'Number 4' }, { label: '5', id: '5', finger: 'li', desc: 'Number 5' },
            { label: '6', id: '6', finger: 'ri', desc: 'Number 6' }, { label: '7', id: '7', finger: 'ri', desc: 'Number 7' },
            { label: '8', id: '8', finger: 'rm', desc: 'Number 8' }, { label: '9', id: '9', finger: 'rr', desc: 'Number 9' },
            { label: '0', id: '0', finger: 'rp', desc: 'Number 0' }, { label: '-', id: 'minus', finger: 'rp', desc: 'Hyphen' },
            { label: '=', id: 'equal', finger: 'rp', desc: 'Equals' }, { label: 'Bksp', id: 'backspace', finger: 'rp', cls: 'w-15', desc: 'Backspace' }
          ],
          [
            { label: 'Tab', id: 'tab', finger: 'lp', cls: 'w-15', desc: 'Tab' }, { label: 'Q', id: 'q', finger: 'lp', desc: 'Letter Q' },
            { label: 'W', id: 'w', finger: 'lr', desc: 'Letter W' }, { label: 'E', id: 'e', finger: 'lm', desc: 'Letter E' },
            { label: 'R', id: 'r', finger: 'li', desc: 'Letter R' }, { label: 'T', id: 't', finger: 'li', desc: 'Letter T' },
            { label: 'Y', id: 'y', finger: 'ri', desc: 'Letter Y' }, { label: 'U', id: 'u', finger: 'ri', desc: 'Letter U' },
            { label: 'I', id: 'i', finger: 'rm', desc: 'Letter I' }, { label: 'O', id: 'o', finger: 'rr', desc: 'Letter O' },
            { label: 'P', id: 'p', finger: 'rp', desc: 'Letter P' }, { label: '[', id: 'bracketL', finger: 'rp', desc: 'Bracket [' },
            { label: ']', id: 'bracketR', finger: 'rp', desc: 'Bracket ]' }, { label: '\\\\', id: 'backslash', finger: 'rp', cls: 'w-15', desc: 'Backslash' }
          ],
          [
            { label: 'Caps', id: 'caps', finger: 'lp', cls: 'w-15', desc: 'Caps Lock' }, { label: 'A', id: 'a', finger: 'lp', desc: 'Letter A' },
            { label: 'S', id: 's', finger: 'lr', desc: 'Letter S' }, { label: 'D', id: 'd', finger: 'lm', desc: 'Letter D' },
            { label: 'F', id: 'f', finger: 'li', desc: 'Letter F (Anchor)' }, { label: 'G', id: 'g', finger: 'li', desc: 'Letter G' },
            { label: 'H', id: 'h', finger: 'ri', desc: 'Letter H' }, { label: 'J', id: 'j', finger: 'ri', desc: 'Letter J (Anchor)' },
            { label: 'K', id: 'k', finger: 'rm', desc: 'Letter K' }, { label: 'L', id: 'l', finger: 'rr', desc: 'Letter L' },
            { label: ';', id: 'semicolon', finger: 'rp', desc: 'Semicolon' }, { label: "'", id: 'quote', finger: 'rp', desc: 'Quote' },
            { label: 'Enter', id: 'enter', finger: 'rp', cls: 'w-20', desc: 'Enter' }
          ],
          [
            { label: 'Shift', id: 'shiftL', finger: 'lp', cls: 'w-20', desc: 'Left Shift' }, { label: 'Z', id: 'z', finger: 'lp', desc: 'Letter Z' },
            { label: 'X', id: 'x', finger: 'lr', desc: 'Letter X' }, { label: 'C', id: 'c', finger: 'lm', desc: 'Letter C' },
            { label: 'V', id: 'v', finger: 'li', desc: 'Letter V' }, { label: 'B', id: 'b', finger: 'li', desc: 'Letter B' },
            { label: 'N', id: 'n', finger: 'ri', desc: 'Letter N' }, { label: 'M', id: 'm', finger: 'ri', desc: 'Letter M' },
            { label: ',', id: 'comma', finger: 'rm', desc: 'Comma' }, { label: '.', id: 'period', finger: 'rr', desc: 'Period' },
            { label: '/', id: 'slash', finger: 'rp', desc: 'Slash' }, { label: 'Shift', id: 'shiftR', finger: 'rp', cls: 'w-20', desc: 'Right Shift' }
          ],
          [
            { label: 'Ctrl', id: 'ctrlL', finger: 'lp', cls: 'w-15', desc: 'Left Control' }, { label: 'Alt', id: 'alt', finger: 'lt', cls: 'w-15', desc: 'Left Alt' },
            { label: 'Spacebar', id: 'space', finger: 'thumb', cls: 'w-space', desc: 'Spacebar' },
            { label: 'AltGr', id: 'altgr', finger: 'rt', cls: 'w-15', desc: 'Right Alt' }, { label: 'Ctrl', id: 'ctrlR', finger: 'rp', cls: 'w-15', desc: 'Right Control' }
          ]
        ]
      };

      const FINGER_DEFS = [
        { id: 'lp', name: 'L-Pinky' },
        { id: 'lr', name: 'L-Ring' },
        { id: 'lm', name: 'L-Mid' },
        { id: 'li', name: 'L-Idx' },
        { id: 'ri', name: 'R-Idx' },
        { id: 'rm', name: 'R-Mid' },
        { id: 'rr', name: 'R-Ring' },
        { id: 'rp', name: 'R-Pinky' }
      ];

      const FINGER_NAMES_MAP = {
        lp: 'Left Pinky',
        lr: 'Left Ring',
        lm: 'Left Middle',
        li: 'Left Index',
        thumb: 'Thumb',
        lt: 'Left Thumb',
        rt: 'Right Thumb',
        ri: 'Right Index',
        rm: 'Right Middle',
        rr: 'Right Ring',
        rp: 'Right Pinky'
      };

      let currentTrack = 'standard';
      let currentTimeframe = 'all';
      let demoModeActive = false;
      let activeDailyTarget = 500;
      let activeStreamMode = 'dual';

      // Safe LocalStorage Reader
      function readAllLocalStorage() {
        let progress = null, tracker = null, lessonStats = null, trialBest = 0, raceStats = null, authSession = null, adaptive = null, achievements = null;
        try {
          const rawP = localStorage.getItem('khmerProgress_v2');
          if (rawP) progress = JSON.parse(rawP);
        } catch (e) {}
        try {
          const rawT = localStorage.getItem('khmerTrackingData_v1');
          if (rawT) tracker = JSON.parse(rawT);
        } catch (e) {}
        try {
          const rawS = localStorage.getItem('khmerLessonStats');
          if (rawS) lessonStats = JSON.parse(rawS);
        } catch (e) {}
        try {
          trialBest = parseInt(localStorage.getItem('khmerTrialBest') || '0', 10) || 0;
        } catch (e) {}
        try {
          const rawR = localStorage.getItem('khmerRaceStats');
          if (rawR) raceStats = JSON.parse(rawR);
        } catch (e) {}
        try {
          const rawA = localStorage.getItem('khmerAuthSession');
          if (rawA) authSession = JSON.parse(rawA);
        } catch (e) {}
        try {
          const rawAd = localStorage.getItem('pk_adaptive_state_v1');
          if (rawAd) adaptive = JSON.parse(rawAd);
        } catch (e) {}
        try {
          const rawAch = localStorage.getItem('pk_achievements_v1');
          if (rawAch) achievements = JSON.parse(rawAch);
        } catch (e) {}

        return { progress, tracker, lessonStats, trialBest, raceStats, authSession, adaptive, achievements };
      }

      // Generate Rich Demo Telemetry for instant preview
      function getDemoTelemetry() {
        const now = Date.now();
        const demoSessions = [];
        const wpms = [26, 31, 35, 38, 42, 44, 46, 47, 51, 48, 52, 54, 53, 55, 58];
        const accs = [91, 93, 94, 95, 96, 95.5, 97, 98, 97.5, 98, 98.2, 99, 98.5, 99.2, 99.5];

        for (let i = 0; i < 15; i++) {
          const pastTime = now - (14 - i) * 86400000 + (i * 3600000);
          demoSessions.push({
            title: \`Lesson standard-L\${String(Math.floor(i / 2)).padStart(2, '0')}-0\${(i % 3) + 1}\`,
            track: 'Standard',
            layoutId: 'standard',
            acc: accs[i],
            wpm: wpms[i],
            durSec: 75 + (i * 5),
            timestamp: pastTime,
            passed: true
          });
        }

        const standardLessons = {};
        for (let u = 0; u < 4; u++) {
          const uid = \`standard-L\${String(u).padStart(2, '0')}\`;
          for (let l = 1; l <= 6; l++) {
            const lid = \`\${uid}-0\${l}\`;
            standardLessons[lid] = {
              completed: true,
              bestAccuracy: 95 + ((u + l) % 5),
              bestWpm: 35 + (u * 4) + l,
              totalTypingUnits: 140,
              totalMistakes: 2
            };
          }
        }

        return {
          totalKeys: 4850,
          speedWpm: 58,
          avgWpm: 48,
          accuracy: 96.8,
          completedLessons: 24,
          totalTimeSec: 8400,
          streak: { current: 5, best: 8 },
          sessions: demoSessions,
          standardLessons
        };
      }

      // Extract Sessions
      function extractAllSessions(storageData) {
        if (demoModeActive) return getDemoTelemetry().sessions;
        const sessions = [];
        const { progress, tracker } = storageData;

        if (progress && progress.history && Array.isArray(progress.history.recentCompletions)) {
          progress.history.recentCompletions.forEach(c => {
            if (!c) return;
            const lid = c.layout ? String(c.layout).toLowerCase() : 'standard';
            const normLayout = lid.includes('eng') ? 'english' : (lid.includes('nida') ? 'nida' : 'standard');
            const trackName = normLayout === 'standard' ? 'Standard' : (normLayout === 'nida' ? 'NiDA' : 'English');
            sessions.push({
              title: \`Lesson \${c.lessonId || 'Drill'}\`,
              track: trackName,
              layoutId: normLayout,
              acc: Math.min(100, Math.max(0, Number(c.accuracy) || 0)),
              wpm: Math.max(0, Number(c.wpm) || 0),
              durSec: Math.max(0, Number(c.timeSec) || 0),
              timestamp: c.timestamp || Date.now(),
              passed: c.passed !== false
            });
          });
        }

        if (progress && progress.courses) {
          Object.keys(progress.courses).forEach(cid => {
            const course = progress.courses[cid];
            if (course && course.lessons) {
              const normLayout = cid.includes('eng') ? 'english' : (cid.includes('nida') ? 'nida' : 'standard');
              const trackName = normLayout === 'standard' ? 'Standard' : (normLayout === 'nida' ? 'NiDA' : 'English');
              Object.keys(course.lessons).forEach(lid => {
                const l = course.lessons[lid];
                if (l && Array.isArray(l.recentAttempts)) {
                  l.recentAttempts.forEach(att => {
                    if (!att || !att.timestamp) return;
                    if (!sessions.some(s => Math.abs(s.timestamp - att.timestamp) < 1500)) {
                      sessions.push({
                        title: \`Lesson \${lid}\`,
                        track: trackName,
                        layoutId: normLayout,
                        acc: Math.min(100, Math.max(0, Number(att.accuracy) || 0)),
                        wpm: Math.max(0, Number(att.wpm) || 0),
                        durSec: Math.max(0, Number(att.timeSec) || 0),
                        timestamp: att.timestamp,
                        passed: att.passed !== false
                      });
                    }
                  });
                }
              });
            }
          });
        }

        if (tracker && Array.isArray(tracker.sessions)) {
          tracker.sessions.forEach(ts => {
            if (!ts || !ts.startTime) return;
            if (!sessions.some(s => Math.abs(s.timestamp - ts.startTime) < 2000)) {
              const lid = (ts.layoutsUsed && ts.layoutsUsed[0]) || 'standard';
              const normLayout = lid.includes('eng') ? 'english' : (lid.includes('nida') ? 'nida' : 'standard');
              const trackName = normLayout === 'standard' ? 'Standard' : (normLayout === 'nida' ? 'NiDA' : 'English');
              const title = (ts.lessonsPracticed && ts.lessonsPracticed[0]) ? \`Lesson \${ts.lessonsPracticed[0]}\` : 'Adaptive Practice';
              const totalUnits = (ts.totalCorrect || 0) + (ts.totalMistakes || 0);
              const acc = totalUnits > 0 ? Math.round((ts.totalCorrect / totalUnits) * 100) : 100;
              const durSec = Math.round((ts.activeTypingDurationMs || 0) / 1000);
              const mins = durSec / 60;
              const wpm = (mins > 0 && totalUnits > 0) ? Math.round((ts.totalCorrect / 5) / mins) : 0;
              sessions.push({
                title,
                track: trackName,
                layoutId: normLayout,
                acc,
                wpm,
                durSec,
                timestamp: ts.startTime,
                passed: acc >= 85
              });
            }
          });
        }

        sessions.sort((a, b) => b.timestamp - a.timestamp);
        return sessions;
      }

      // Calculate practice streak
      function calculateStreaks(timestamps) {
        if (!timestamps || !timestamps.length) return { current: 0, best: 0 };
        const uniqueDates = Array.from(new Set(timestamps.map(ts => {
          const dt = new Date(ts);
          return \`\${dt.getFullYear()}-\${String(dt.getMonth() + 1).padStart(2, '0')}-\${String(dt.getDate()).padStart(2, '0')}\`;
        }))).sort().reverse();

        if (!uniqueDates.length) return { current: 0, best: 0 };

        const today = new Date();
        const todayStr = \`\${today.getFullYear()}-\${String(today.getMonth() + 1).padStart(2, '0')}-\${String(today.getDate()).padStart(2, '0')}\`;
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = \`\${yesterday.getFullYear()}-\${String(yesterday.getMonth() + 1).padStart(2, '0')}-\${String(yesterday.getDate()).padStart(2, '0')}\`;

        let currentStreak = 0;
        const checkDate = uniqueDates[0] === todayStr ? today : (uniqueDates[0] === yesterdayStr ? yesterday : null);

        if (checkDate) {
          const cur = new Date(checkDate);
          while (true) {
            const curStr = \`\${cur.getFullYear()}-\${String(cur.getMonth() + 1).padStart(2, '0')}-\${String(cur.getDate()).padStart(2, '0')}\`;
            if (uniqueDates.includes(curStr)) {
              currentStreak++;
              cur.setDate(cur.getDate() - 1);
            } else {
              break;
            }
          }
        }

        let bestStreak = currentStreak;
        let running = 0;
        const ascDates = [...uniqueDates].sort();
        for (let i = 0; i < ascDates.length; i++) {
          if (i === 0) {
            running = 1;
          } else {
            const prev = new Date(ascDates[i - 1]);
            const curr = new Date(ascDates[i]);
            const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
              running++;
            } else if (diffDays > 1) {
              running = 1;
            }
          }
          if (running > bestStreak) bestStreak = running;
        }

        return { current: currentStreak, best: bestStreak };
      }

      // Scribe Level & XP Engine
      function computeScribeLevel(totalKeys, completedLessons, streakDays, flawlessLessons = 0) {
        const xp = Math.round((totalKeys * 0.1) + (completedLessons * 50) + (flawlessLessons * 25) + (streakDays * 30));
        let rank = SCRIBE_RANKS[0];
        for (let i = SCRIBE_RANKS.length - 1; i >= 0; i--) {
          if (xp >= SCRIBE_RANKS[i].minXp) {
            rank = SCRIBE_RANKS[i];
            break;
          }
        }
        const range = rank.maxXp - rank.minXp;
        const earnedInRange = xp - rank.minXp;
        const pct = Math.min(100, Math.max(0, Math.round((earnedInRange / range) * 100)));
        return { rank, xp, pct };
      }

      // Find next uncompleted lesson in track
      function findNextLesson(profile, course) {
        if (!course || !course.lessons) {
          return { id: profile.levels[0].lessons[0], unitTitle: profile.levels[0].title, isComplete: false };
        }
        for (const lv of profile.levels) {
          for (const lid of lv.lessons) {
            const l = course.lessons[lid];
            if (!l || !l.completed) {
              return { id: lid, unitTitle: lv.title, isComplete: false };
            }
          }
        }
        return { id: profile.levels[0].lessons[0], unitTitle: 'All Units Mastered!', isComplete: true };
      }

      // Check key stats in tracker and progress
      function getKeyStats(keyId, label, trackStats, courseKeys) {
        let stat = null;
        if (trackStats) {
          stat = trackStats[keyId] || trackStats[keyId.toLowerCase()] || trackStats[keyId.toUpperCase()] || (label ? trackStats[label] : null);
        }
        if (!stat && courseKeys) {
          stat = courseKeys[keyId] || courseKeys[keyId.toLowerCase()] || (label ? courseKeys[label] : null);
        }
        if (!stat || !stat.attempts || stat.attempts < 1) {
          return { attempts: 0, accuracy: null, tier: '', latency: null };
        }
        const acc = Math.round((stat.correct / stat.attempts) * 100);
        let tier = '';
        if (acc >= 95) tier = 'high';
        else if (acc >= 85) tier = 'mid';
        else tier = 'low';
        return {
          attempts: stat.attempts,
          accuracy: acc,
          tier: tier,
          latency: stat.avgResponseTimeMs ? Math.round(stat.avgResponseTimeMs) : null
        };
      }

      // Finger Workload & Hand Balance
      function getFingerWorkload(fingerStats, progressFingers) {
        let total = 0;
        const counts = {};
        FINGER_DEFS.forEach(f => {
          let attempts = 0;
          if (fingerStats && fingerStats[f.id]) attempts = fingerStats[f.id].attempts || 0;
          if (!attempts && progressFingers && progressFingers[f.id]) attempts = progressFingers[f.id].attempts || 0;
          counts[f.id] = attempts;
          total += attempts;
        });

        let leftHandAttempts = (counts['lp'] || 0) + (counts['lr'] || 0) + (counts['lm'] || 0) + (counts['li'] || 0);
        let rightHandAttempts = (counts['ri'] || 0) + (counts['rm'] || 0) + (counts['rr'] || 0) + (counts['rp'] || 0);
        let leftPct = total > 0 ? Math.round((leftHandAttempts / total) * 100) : 50;
        let rightPct = total > 0 ? (100 - leftPct) : 50;

        const fingerData = FINGER_DEFS.map(f => {
          const attempts = counts[f.id] || 0;
          const pct = total > 0 ? Math.round((attempts / total) * 100) : 0;
          const height = total > 0 ? Math.min(100, Math.max(6, Math.round(pct * 3.5))) : 0;
          let cls = '';
          if (pct >= 20) cls = 'gold';
          else if (pct >= 10) cls = 'emerald';
          return { id: f.id, name: f.name, pct, height, cls, attempts };
        });

        return { fingerData, leftPct, rightPct, total };
      }

      // Top Stumbling Keys Diagnostic
      function getWeakKeys(trackStats, courseKeys) {
        const merged = {};
        if (trackStats) {
          Object.entries(trackStats).forEach(([k, v]) => {
            if (v && v.attempts > 0) merged[k] = v;
          });
        }
        if (courseKeys) {
          Object.entries(courseKeys).forEach(([k, v]) => {
            if (v && v.attempts > 0 && !merged[k]) merged[k] = v;
          });
        }

        const list = [];
        Object.entries(merged).forEach(([keyId, stat]) => {
          if (!stat || stat.attempts < 2) return;
          const acc = stat.attempts > 0 ? Math.round((stat.correct / stat.attempts) * 100) : 100;
          if (acc < 92 || (stat.incorrect && stat.incorrect > 0)) {
            list.push({
              keyId,
              stat,
              acc,
              latency: stat.avgResponseTimeMs ? \`\${Math.round(stat.avgResponseTimeMs)}ms\` : '—'
            });
          }
        });

        list.sort((a, b) => a.acc - b.acc || (b.stat.incorrect || 0) - (a.stat.incorrect || 0));
        return list.slice(0, 4);
      }

      // Mathematical Natural Spline Curve Generator (Cubic Bezier Interpolation)
      function getSmoothSplinePath(points) {
        if (!points || points.length === 0) return '';
        if (points.length === 1) return \`M \${points[0].x.toFixed(1)} \${points[0].y.toFixed(1)}\`;
        if (points.length === 2) return \`M \${points[0].x.toFixed(1)} \${points[0].y.toFixed(1)} L \${points[1].x.toFixed(1)} \${points[1].y.toFixed(1)}\`;

        let d = \`M \${points[0].x.toFixed(1)} \${points[0].y.toFixed(1)}\`;
        for (let i = 0; i < points.length - 1; i++) {
          const p0 = i > 0 ? points[i - 1] : points[i];
          const p1 = points[i];
          const p2 = points[i + 1];
          const p3 = i < points.length - 2 ? points[i + 2] : p2;

          const cp1x = p1.x + (p2.x - p0.x) / 6;
          const cp1y = p1.y + (p2.y - p0.y) / 6;
          const cp2x = p2.x - (p3.x - p1.x) / 6;
          const cp2y = p2.y - (p3.y - p1.y) / 6;

          d += \` C \${cp1x.toFixed(1)} \${cp1y.toFixed(1)}, \${cp2x.toFixed(1)} \${cp2y.toFixed(1)}, \${p2.x.toFixed(1)} \${p2.y.toFixed(1)}\`;
        }
        return d;
      }

      function getSmoothAreaPath(points, bottomY) {
        if (!points || points.length === 0) return '';
        const spline = getSmoothSplinePath(points);
        const last = points[points.length - 1];
        const first = points[0];
        return \`\${spline} L \${last.x.toFixed(1)} \${bottomY} L \${first.x.toFixed(1)} \${bottomY} Z\`;
      }

      // Render Ultra-Cool Trajectory Chart
      function renderTrajectoryChart(sessions) {
        const svg = document.getElementById('perfChartSvg');
        const container = document.getElementById('chartContainer');
        if (!svg || !container) return;

        if (!sessions || sessions.length < 2) {
          svg.innerHTML = \`
            <text x="300" y="120" text-anchor="middle" fill="#64748b" font-size="12" font-family="'Inter', sans-serif">
              Complete lessons in the training room to generate your performance progression curve.
            </text>
          \`;
          return;
        }

        const data = [...sessions].reverse().slice(-16);
        const w = 600, h = 240, padL = 44, padR = 44, padT = 24, padB = 34;
        const chartW = w - padL - padR;
        const chartH = h - padT - padB;
        const bottomY = padT + chartH;

        const maxWpm = Math.max(...data.map(d => d.wpm), 60);
        const minAcc = 70; // Pin baseline accuracy scale to 70% for dramatic resolution

        const wpmPoints = [];
        const accPoints = [];

        data.forEach((d, idx) => {
          const x = padL + (idx / (data.length - 1)) * chartW;
          const yWpm = padT + chartH - (d.wpm / maxWpm) * chartH;
          const clampedAcc = Math.max(minAcc, Math.min(100, d.acc));
          const yAcc = padT + chartH - ((clampedAcc - minAcc) / (100 - minAcc)) * chartH;
          const prev = idx > 0 ? data[idx - 1] : null;
          const delta = prev ? (d.wpm - prev.wpm) : 0;

          wpmPoints.push({ x, y: yWpm, val: d.wpm, title: d.title, timestamp: d.timestamp, durSec: d.durSec, delta });
          accPoints.push({ x, y: yAcc, val: d.acc, title: d.title, timestamp: d.timestamp, durSec: d.durSec });
        });

        // Compute summary telemetry chips
        const peakWpm = Math.max(...data.map(d => d.wpm), 0);
        const avgWpm = Math.round(data.reduce((a, b) => a + b.wpm, 0) / data.length);
        const consistency = Math.round((data.reduce((a, b) => a + b.acc, 0) / data.length) * 10) / 10;
        const momentum = data.length >= 2
          ? Math.round(((data[data.length - 1].wpm - data[0].wpm) / Math.max(1, data[0].wpm)) * 100)
          : 0;

        const chipPeak = document.getElementById('chipPeakWpm');
        if (chipPeak) chipPeak.innerHTML = \`<svg class="svg-icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><span>Peak: <strong>\${peakWpm} WPM</strong></span>\`;

        const chipAvg = document.getElementById('chipAvgWpm');
        if (chipAvg) chipAvg.innerHTML = \`<svg class="svg-icon" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg><span>Avg: <strong>\${avgWpm} WPM</strong></span>\`;

        const chipMom = document.getElementById('chipMomentum');
        if (chipMom) chipMom.innerHTML = \`<svg class="svg-icon" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg><span>Momentum: <strong>\${momentum >= 0 ? '+' : ''}\${momentum}%</strong></span>\`;

        const chipCons = document.getElementById('chipConsistency');
        if (chipCons) chipCons.innerHTML = \`<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle></svg><span>Consistency: <strong>\${consistency}%</strong></span>\`;

        // Generate smooth splines
        const wpmSpline = getSmoothSplinePath(wpmPoints);
        const wpmArea = getSmoothAreaPath(wpmPoints, bottomY);
        const accSpline = getSmoothSplinePath(accPoints);
        const accArea = getSmoothAreaPath(accPoints, bottomY);

        // Benchmark lines: 40 WPM (Flow) and 95% Accuracy (Mastery)
        const y40Wpm = padT + chartH - (40 / maxWpm) * chartH;
        const y95Acc = padT + chartH - ((95 - minAcc) / (100 - minAcc)) * chartH;

        svg.innerHTML = \`
          <defs>
            <!-- Velocity Gold Area Gradient -->
            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ffd166" stop-opacity="0.38"/>
              <stop offset="40%" stop-color="#ffd166" stop-opacity="0.15"/>
              <stop offset="100%" stop-color="#ffd166" stop-opacity="0.0"/>
            </linearGradient>

            <!-- Precision Emerald Area Gradient -->
            <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#34d399" stop-opacity="0.32"/>
              <stop offset="50%" stop-color="#34d399" stop-opacity="0.12"/>
              <stop offset="100%" stop-color="#34d399" stop-opacity="0.0"/>
            </linearGradient>

            <!-- Glow Filters -->
            <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="glowEmerald" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <!-- Holographic Grid Background -->
          <line x1="\${padL}" y1="\${padT}" x2="\${w - padR}" y2="\${padT}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="3 3"/>
          <line x1="\${padL}" y1="\${padT + chartH * 0.33}" x2="\${w - padR}" y2="\${padT + chartH * 0.33}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="3 3"/>
          <line x1="\${padL}" y1="\${padT + chartH * 0.66}" x2="\${w - padR}" y2="\${padT + chartH * 0.66}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="3 3"/>
          <line x1="\${padL}" y1="\${bottomY}" x2="\${w - padR}" y2="\${bottomY}" stroke="rgba(255,255,255,0.12)"/>

          <!-- Vertical Session Grid Ticks -->
          \${wpmPoints.map(p => \`
            <line x1="\${p.x.toFixed(1)}" y1="\${padT}" x2="\${p.x.toFixed(1)}" y2="\${bottomY}" stroke="rgba(255,255,255,0.03)" stroke-dasharray="2 4"/>
          \`).join('')}

          <!-- Flow State Benchmark (40 WPM) -->
          \${(40 <= maxWpm) ? \`
            <line x1="\${padL}" y1="\${y40Wpm.toFixed(1)}" x2="\${w - padR}" y2="\${y40Wpm.toFixed(1)}" stroke="rgba(255,209,102,0.22)" stroke-dasharray="4 4"/>
            <text x="\${w - padR - 4}" y="\${(y40Wpm - 4).toFixed(1)}" text-anchor="end" fill="rgba(255,209,102,0.6)" font-size="9" font-family="'JetBrains Mono',monospace">40 WPM FLOW BENCHMARK</text>
          \` : ''}

          <!-- Mastery Barrier (95% Accuracy) -->
          <line x1="\${padL}" y1="\${y95Acc.toFixed(1)}" x2="\${w - padR}" y2="\${y95Acc.toFixed(1)}" stroke="rgba(52,211,153,0.22)" stroke-dasharray="4 4"/>
          <text x="\${padL + 6}" y="\${(y95Acc - 4).toFixed(1)}" fill="rgba(52,211,153,0.6)" font-size="9" font-family="'JetBrains Mono',monospace">95% PRECISION BARRIER</text>

          <!-- Left Axis Ticks (WPM) -->
          <text x="\${padL - 10}" y="\${padT + 4}" text-anchor="end" fill="#94a3b8" font-size="9" font-family="'JetBrains Mono',monospace">\${Math.round(maxWpm)}</text>
          <text x="\${padL - 10}" y="\${(padT + chartH * 0.5 + 3).toFixed(1)}" text-anchor="end" fill="#64748b" font-size="9" font-family="'JetBrains Mono',monospace">\${Math.round(maxWpm * 0.5)}</text>
          <text x="\${padL - 10}" y="\${bottomY + 3}" text-anchor="end" fill="#64748b" font-size="9" font-family="'JetBrains Mono',monospace">0</text>

          <!-- Right Axis Ticks (Accuracy) -->
          <text x="\${w - padR + 8}" y="\${padT + 4}" fill="#94a3b8" font-size="9" font-family="'JetBrains Mono',monospace">100%</text>
          <text x="\${w - padR + 8}" y="\${(padT + chartH * 0.5 + 3).toFixed(1)}" fill="#64748b" font-size="9" font-family="'JetBrains Mono',monospace">85%</text>
          <text x="\${w - padR + 8}" y="\${bottomY + 3}" fill="#64748b" font-size="9" font-family="'JetBrains Mono',monospace">70%</text>

          <!-- Area Fills -->
          <path id="svgAreaPrecision" class="area-precision" d="\${accArea}" style="display: \${activeStreamMode === 'velocity' ? 'none' : 'block'};"/>
          <path id="svgAreaVelocity" class="area-velocity" d="\${wpmArea}" style="display: \${activeStreamMode === 'precision' ? 'none' : 'block'};"/>

          <!-- Glowing Spline Strokes -->
          <path id="svgSplinePrecision" class="spline-precision" d="\${accSpline}" filter="url(#glowEmerald)" style="display: \${activeStreamMode === 'velocity' ? 'none' : 'block'};"/>
          <path id="svgSplineVelocity" class="spline-velocity" d="\${wpmSpline}" filter="url(#glowGold)" style="display: \${activeStreamMode === 'precision' ? 'none' : 'block'};"/>

          <!-- Pulsing Milestone Dots -->
          \${wpmPoints.map(p => \`
            <circle cx="\${p.x.toFixed(1)}" cy="\${p.y.toFixed(1)}" r="3" fill="#ffd166" stroke="#0e1320" stroke-width="1.5" style="display:\${activeStreamMode === 'precision' ? 'none' : 'block'};"/>
          \`).join('')}

          \${accPoints.map(p => \`
            <circle cx="\${p.x.toFixed(1)}" cy="\${p.y.toFixed(1)}" r="2.5" fill="#34d399" stroke="#0e1320" stroke-width="1.5" style="display:\${activeStreamMode === 'velocity' ? 'none' : 'block'};"/>
          \`).join('')}
        \`;

        // Interactive Laser Crosshair & Holographic HUD logic
        const laser = document.getElementById('chartLaserLine');
        const reticleGold = document.getElementById('chartReticleGold');
        const reticleEmerald = document.getElementById('chartReticleEmerald');
        const hud = document.getElementById('chartHologramHud');
        const hudTitle = document.getElementById('hudLessonTitle');
        const hudDate = document.getElementById('hudSessionDate');
        const hudSpeed = document.getElementById('hudSpeedVal');
        const hudAcc = document.getElementById('hudAccVal');
        const hudDelta = document.getElementById('hudDeltaVal');
        const hudDetails = document.getElementById('hudDurationStrokes');

        let lastHoverIdx = -1;

        container.onmousemove = (e) => {
          const rect = container.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const svgX = (mouseX / rect.width) * w;

          // Find closest point by X
          let closestIdx = 0;
          let minDiff = 99999;
          wpmPoints.forEach((p, idx) => {
            const diff = Math.abs(p.x - svgX);
            if (diff < minDiff) {
              minDiff = diff;
              closestIdx = idx;
            }
          });

          if (closestIdx !== lastHoverIdx) {
            lastHoverIdx = closestIdx;
            playHapticTick(900 + (closestIdx * 20), 0.015);
          }

          const ptWpm = wpmPoints[closestIdx];
          const ptAcc = accPoints[closestIdx];
          const pxRatio = rect.width / w;
          const pixelX = ptWpm.x * pxRatio;
          const pixelYWpm = ptWpm.y * (rect.height / h);
          const pixelYAcc = ptAcc.y * (rect.height / h);

          // Position Laser and Reticles
          if (laser) {
            laser.style.left = \`\${pixelX}px\`;
            laser.classList.add('active');
          }

          if (reticleGold) {
            reticleGold.style.left = \`\${pixelX}px\`;
            reticleGold.style.top = \`\${pixelYWpm}px\`;
            reticleGold.classList.toggle('active', activeStreamMode !== 'precision');
          }

          if (reticleEmerald) {
            reticleEmerald.style.left = \`\${pixelX}px\`;
            reticleEmerald.style.top = \`\${pixelYAcc}px\`;
            reticleEmerald.classList.toggle('active', activeStreamMode !== 'velocity');
          }

          // Populate HUD card
          if (hud) {
            const dateObj = new Date(ptWpm.timestamp);
            const dateStr = \`\${months[dateObj.getMonth()].slice(0, 3)} \${dateObj.getDate()}, \${String(dateObj.getHours()).padStart(2, '0')}:\${String(dateObj.getMinutes()).padStart(2, '0')}\`;
            if (hudTitle) hudTitle.textContent = ptWpm.title;
            if (hudDate) hudDate.textContent = dateStr;
            if (hudSpeed) hudSpeed.textContent = \`\${ptWpm.val} WPM\`;
            if (hudAcc) hudAcc.textContent = \`\${ptAcc.val}% Acc\`;

            if (hudDelta) {
              const dVal = ptWpm.delta;
              hudDelta.textContent = dVal >= 0 ? \`+\${dVal} WPM\` : \`\${dVal} WPM\`;
              hudDelta.className = dVal >= 0 ? 'hud-delta' : 'hud-delta down';
            }

            if (hudDetails) {
              const mins = Math.floor(ptWpm.durSec / 60);
              const secs = ptWpm.durSec % 60;
              hudDetails.textContent = \`\${String(mins).padStart(2, '0')}:\${String(secs).padStart(2, '0')} duration · \${Math.round(ptWpm.val * 5 * (ptWpm.durSec / 60))} Keystrokes\`;
            }

            // Clamp HUD to avoid screen overflow
            const hudClampX = Math.min(rect.width - 110, Math.max(110, pixelX));
            hud.style.left = \`\${hudClampX}px\`;
            hud.classList.add('active');
          }
        };

        container.onmouseleave = () => {
          if (laser) laser.classList.remove('active');
          if (reticleGold) reticleGold.classList.remove('active');
          if (reticleEmerald) reticleEmerald.classList.remove('active');
          if (hud) hud.classList.remove('active');
          lastHoverIdx = -1;
        };

        // Wire Stream Toggle Buttons
        const streamBtns = document.querySelectorAll('#chartStreamToggle .stream-toggle-btn');
        streamBtns.forEach(btn => {
          btn.onclick = () => {
            streamBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeStreamMode = btn.dataset.stream || 'dual';
            playHapticTick(1100, 0.02);
            renderTrajectoryChart(sessions);
          };
        });
      }

      // Render 30-Day Activity Punchcard Heatmap
      function renderPunchcard(sessions) {
        const grid = document.getElementById('punchcardGrid');
        if (!grid) return;

        const dayCounts = {};
        const now = new Date();
        const days = [];

        for (let i = 29; i >= 0; i--) {
          const dt = new Date(now);
          dt.setDate(dt.getDate() - i);
          const key = \`\${dt.getFullYear()}-\${String(dt.getMonth() + 1).padStart(2, '0')}-\${String(dt.getDate()).padStart(2, '0')}\`;
          dayCounts[key] = { strokes: 0, sessions: 0, date: key };
          days.push(key);
        }

        if (sessions) {
          sessions.forEach(s => {
            const dt = new Date(s.timestamp);
            const key = \`\${dt.getFullYear()}-\${String(dt.getMonth() + 1).padStart(2, '0')}-\${String(dt.getDate()).padStart(2, '0')}\`;
            if (dayCounts[key]) {
              dayCounts[key].sessions++;
              dayCounts[key].strokes += (s.keys || Math.round((s.wpm * 5) * (s.durSec / 60)) || 80);
            }
          });
        }

        let activeDaysCount = 0;
        grid.innerHTML = days.map(dKey => {
          const item = dayCounts[dKey];
          let lvl = '';
          if (item.strokes > 600) { lvl = 'lvl-4'; activeDaysCount++; }
          else if (item.strokes > 300) { lvl = 'lvl-3'; activeDaysCount++; }
          else if (item.strokes > 100) { lvl = 'lvl-2'; activeDaysCount++; }
          else if (item.strokes > 0) { lvl = 'lvl-1'; activeDaysCount++; }

          const tooltip = \`\${item.date}: \${item.strokes} keystrokes (\${item.sessions} sessions)\`;
          return \`<div class="punch-cell \${lvl}" title="\${tooltip}"></div>\`;
        }).join('');

        const badge = document.getElementById('punchcardBadge');
        if (badge) badge.textContent = \`\${activeDaysCount} / 30 Days\`;
      }

      // Render Milestone Achievements & Trophies
      function updateAchievements(telemetry) {
        const { allSessions, totalKeysAll, totalLessonsAll, streak, progress, lessonStats } = telemetry;
        const standardCourse = progress?.courses?.standard;
        const nidaCourse = progress?.courses?.nida;
        const englishCourse = progress?.courses?.english;

        const isLevelDone = (course, lessonIds) => {
          if (!course || !course.lessons) return false;
          return lessonIds.every(lid => course.lessons[lid] && course.lessons[lid].completed);
        };

        const stdL00 = ['standard-L00-01','standard-L00-02','standard-L00-03','standard-L00-04'];
        const stdL01 = ['standard-L01-01','standard-L01-02','standard-L01-03','standard-L01-04','standard-L01-05'];

        const maxStdWpm = Math.max(...(Object.values(standardCourse?.lessons || {}).map(l => l.bestWpm || 0)), (lessonStats?.bestWpm || 0), 0);
        const maxEngWpm = Math.max(...(Object.values(englishCourse?.lessons || {}).map(l => l.bestWpm || 0)), 0);

        const list = [
          {
            id: 'trophy-initiate',
            name: 'Initiate Scribe',
            desc: 'Complete your first typing lesson or log 25 keystrokes.',
            unlocked: totalKeysAll >= 25 || totalLessonsAll >= 1 || allSessions.length >= 1,
            progress: Math.min(100, Math.round((Math.max(totalKeysAll, allSessions.length * 25) / 25) * 100)),
            icon: '<polygon points="5 3 19 12 5 21 5 3"></polygon>'
          },
          {
            id: 'trophy-angkor',
            name: 'Angkor Foundation',
            desc: 'Complete Unit 1 &amp; Unit 2 of Khmer Home Row curriculum.',
            unlocked: isLevelDone(standardCourse, stdL00) || isLevelDone(standardCourse, stdL01),
            progress: isLevelDone(standardCourse, stdL00) ? 100 : 0,
            icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>'
          },
          {
            id: 'trophy-speed',
            name: 'Speed Artisan',
            desc: 'Sustain 40+ WPM velocity in Khmer Standard layout.',
            unlocked: maxStdWpm >= 40,
            progress: Math.min(100, Math.round((maxStdWpm / 40) * 100)),
            icon: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>'
          },
          {
            id: 'trophy-streak3',
            name: '3-Day Devotion',
            desc: 'Maintain a 3-day continuous daily practice streak.',
            unlocked: streak.current >= 3 || streak.best >= 3,
            progress: Math.min(100, Math.round((Math.max(streak.current, streak.best) / 3) * 100)),
            icon: '<path d="M12 2c1.5 3 4 5 4 9a6 6 0 1 1-12 0c0-4 2.5-6 4-9 1 2 2 3 4 0z"></path>'
          },
          {
            id: 'trophy-streak7',
            name: '7-Day Devotion',
            desc: 'Maintain a 7-day uninterrupted practice streak.',
            unlocked: streak.current >= 7 || streak.best >= 7,
            progress: Math.min(100, Math.round((Math.max(streak.current, streak.best) / 7) * 100)),
            icon: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>'
          },
          {
            id: 'trophy-flawless',
            name: 'Flawless Monk',
            desc: 'Finish an entire drill with 100.0% accuracy and zero typos.',
            unlocked: allSessions.some(s => s.acc === 100 && s.passed),
            progress: allSessions.some(s => s.acc === 100) ? 100 : 0,
            icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
          },
          {
            id: 'trophy-coeng',
            name: 'Coeng Conjoiner',
            desc: 'Successfully conjoin 50 subscript consonant combinations.',
            unlocked: totalKeysAll >= 200,
            progress: Math.min(100, Math.round((totalKeysAll / 200) * 100)),
            icon: '<polyline points="20 6 9 17 4 12"></polyline>'
          },
          {
            id: 'trophy-century',
            name: 'Century Scribe',
            desc: 'Surpass 70 WPM in the English US QWERTY curriculum.',
            unlocked: maxEngWpm >= 70,
            progress: Math.min(100, Math.round((maxEngWpm / 70) * 100)),
            icon: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>'
          },
          {
            id: 'trophy-millennium',
            name: 'Millennium Scribe',
            desc: 'Record 1,000 lifetime keystrokes across learning sessions.',
            unlocked: totalKeysAll >= 1000,
            progress: Math.min(100, Math.round((totalKeysAll / 1000) * 100)),
            icon: '<circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>'
          },
          {
            id: 'trophy-grand',
            name: 'Grand Scribe',
            desc: 'Record 5,000 keystrokes of diligent typing practice.',
            unlocked: totalKeysAll >= 5000,
            progress: Math.min(100, Math.round((totalKeysAll / 5000) * 100)),
            icon: '<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>'
          },
          {
            id: 'trophy-ergo',
            name: 'Ergonomic Virtuoso',
            desc: 'Achieve balanced left and right hand workload (45% - 55%).',
            unlocked: totalKeysAll >= 300,
            progress: Math.min(100, Math.round((totalKeysAll / 300) * 100)),
            icon: '<path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v3M14 9V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v7M10 11V5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v9M10 19H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h2"></path>'
          },
          {
            id: 'trophy-conqueror',
            name: 'Curriculum Conqueror',
            desc: 'Complete all 78 lessons in any Cambodian curriculum track.',
            unlocked: totalLessonsAll >= 78,
            progress: Math.min(100, Math.round((totalLessonsAll / 78) * 100)),
            icon: '<circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>'
          }
        ];

        const grid = document.getElementById('achievementsGrid');
        if (grid) {
          let unlockedCount = 0;
          grid.innerHTML = list.map(item => {
            if (item.unlocked) unlockedCount++;
            const statusCls = item.unlocked ? 'status-unlocked' : 'status-locked';
            const statusText = item.unlocked ? 'UNLOCKED' : 'LOCKED';
            return \`
              <div class="trophy-card \${item.unlocked ? 'unlocked' : ''}">
                <div class="trophy-head">
                  <div class="trophy-icon">
                    <svg class="svg-icon" viewBox="0 0 24 24">\${item.icon}</svg>
                  </div>
                  <span class="trophy-status \${statusCls}">\${statusText}</span>
                </div>
                <div class="trophy-name">\${item.name}</div>
                <div class="trophy-desc">\${item.desc}</div>
                <div class="trophy-meter-bg">
                  <div class="trophy-meter-fill" style="width:\${item.progress}%;"></div>
                </div>
              </div>
            \`;
          }).join('');

          const badge = document.getElementById('achievementsBadge');
          if (badge) badge.textContent = \`\${unlockedCount} / \${list.length} Unlocked\`;
        }
      }

      // Main Render Dashboard Execution
      function renderDashboard() {
        const storageData = readAllLocalStorage();
        const profile = TRACK_METADATA[currentTrack] || TRACK_METADATA.standard;
        const allSessions = extractAllSessions(storageData);

        const now = Date.now();
        const filteredSessions = allSessions.filter(s => {
          if (currentTimeframe === 'today') return s.timestamp >= now - 86400000;
          if (currentTimeframe === '7d') return s.timestamp >= now - 7 * 86400000;
          if (currentTimeframe === '30d') return s.timestamp >= now - 30 * 86400000;
          return true;
        });

        const trackSessions = filteredSessions.filter(s => s.layoutId === currentTrack);
        const course = storageData.progress?.courses?.[currentTrack];
        const allCourses = storageData.progress?.courses;

        let totalKeys = 0;
        let speedWpm = 0;
        let accuracy = 0;
        let completedLessons = 0;
        let totalTimeSec = 0;

        if (demoModeActive) {
          const demo = getDemoTelemetry();
          totalKeys = demo.totalKeys;
          speedWpm = demo.speedWpm;
          accuracy = demo.accuracy;
          completedLessons = demo.completedLessons;
          totalTimeSec = demo.totalTimeSec;
        } else {
          if (currentTimeframe === 'all') {
            if (course) {
              totalKeys = course.totalTypingUnits || 0;
              if (totalKeys === 0 && course.lessons) {
                totalKeys = Object.values(course.lessons).reduce((acc, l) => acc + (l.totalTypingUnits || 0), 0);
              }
              if (course.overallAccuracy > 0) accuracy = course.overallAccuracy;
              completedLessons = Object.values(course.lessons || {}).filter(l => l.completed).length;
              const lessonWpms = Object.values(course.lessons || {}).map(l => l.bestWpm || 0);
              if (lessonWpms.length > 0) speedWpm = Math.max(...lessonWpms, 0);

              if (!accuracy && course.lessons) {
                const completedList = Object.values(course.lessons).filter(l => l.completed && (l.bestAccuracy || l.accuracy));
                if (completedList.length > 0) {
                  const sum = completedList.reduce((acc, l) => acc + (l.bestAccuracy || l.accuracy || 0), 0);
                  accuracy = Math.round((sum / completedList.length) * 10) / 10;
                }
              }
            }

            if (totalKeys === 0 && storageData.tracker?.keyStats?.[currentTrack]) {
              totalKeys = Object.values(storageData.tracker.keyStats[currentTrack]).reduce((acc, k) => acc + (k.total || 0), 0);
            }

            if (trackSessions.length > 0) {
              if (totalKeys === 0) totalKeys = trackSessions.reduce((acc, s) => acc + (s.keys || Math.round((s.wpm * 5) * (s.durSec / 60))), 0);
              if (!accuracy) accuracy = Math.round((trackSessions.reduce((acc, s) => acc + s.acc, 0) / trackSessions.length) * 10) / 10;
              if (speedWpm === 0) speedWpm = Math.max(...trackSessions.map(s => s.wpm), 0);
              totalTimeSec = trackSessions.reduce((acc, s) => acc + s.durSec, 0);
            }

            if (totalKeys === 0 && currentTrack === 'standard' && storageData.lessonStats && storageData.lessonStats.keys > 0) {
              totalKeys = storageData.lessonStats.keys;
              accuracy = storageData.lessonStats.accuracy || 100;
              speedWpm = storageData.lessonStats.bestWpm || storageData.lessonStats.wpm || 0;
            }
          } else {
            if (trackSessions.length > 0) {
              accuracy = Math.round((trackSessions.reduce((acc, s) => acc + s.acc, 0) / trackSessions.length) * 10) / 10;
              speedWpm = Math.max(...trackSessions.map(s => s.wpm), 0);
              completedLessons = new Set(trackSessions.filter(s => s.passed).map(s => s.title)).size;
              totalKeys = trackSessions.reduce((acc, s) => acc + (s.keys || Math.round((s.wpm * 5) * (s.durSec / 60))), 0);
              totalTimeSec = trackSessions.reduce((acc, s) => acc + s.durSec, 0);
            }
          }
        }

        const streak = demoModeActive ? { current: 5, best: 8 } : calculateStreaks(allSessions.map(s => s.timestamp));

        // 1. Scribe Level & XP
        const { rank, xp, pct: xpPct } = computeScribeLevel(totalKeys, completedLessons, streak.current);
        const scribeTitleEl = document.getElementById('scribeLevelTitle');
        if (scribeTitleEl) scribeTitleEl.textContent = rank.title;
        const xpFill = document.getElementById('scribeXpBarFill');
        if (xpFill) xpFill.style.width = \`\${xpPct}%\`;
        const xpText = document.getElementById('scribeXpText');
        if (xpText) xpText.textContent = \`\${xp.toLocaleString()} XP\`;

        // 2. Next Recommended Lesson Spotlight
        const nextLesson = findNextLesson(profile, course);
        const spotlightTitle = document.getElementById('spotlightLessonTitle');
        if (spotlightTitle) spotlightTitle.textContent = \`\${nextLesson.unitTitle} · \${nextLesson.id}\`;
        const spotlightBtn = document.getElementById('btnSpotlightLaunch');
        if (spotlightBtn) {
          spotlightBtn.onclick = () => launchLesson(nextLesson.id, currentTrack);
        }
        const continueHdrBtn = document.getElementById('btnContinueLearningHeader');
        if (continueHdrBtn) {
          continueHdrBtn.onclick = () => launchLesson(nextLesson.id, currentTrack);
        }

        // 3. Daily Practice Goal Widget
        const todaySessions = allSessions.filter(s => s.timestamp >= now - 86400000);
        const todayStrokes = todaySessions.reduce((acc, s) => acc + (s.keys || Math.round((s.wpm * 5) * (s.durSec / 60)) || 80), 0);
        const todayKeyCountEl = document.getElementById('todayKeyCount');
        if (todayKeyCountEl) animateCounter(todayKeyCountEl, todayStrokes);
        const todayKeyTargetEl = document.getElementById('todayKeyTarget');
        if (todayKeyTargetEl) todayKeyTargetEl.textContent = activeDailyTarget.toLocaleString();

        const goalPct = Math.min(100, Math.round((todayStrokes / activeDailyTarget) * 100));
        const progressBar = document.getElementById('todayProgressBar');
        if (progressBar) progressBar.style.width = \`\${goalPct}%\`;

        const goalPctEl = document.getElementById('todayGoalPct');
        if (goalPctEl) goalPctEl.textContent = \`\${goalPct}% Goal Reached\`;

        const remStrokes = Math.max(0, activeDailyTarget - todayStrokes);
        const remEl = document.getElementById('todayRemainingStrokes');
        if (remEl) remEl.textContent = remStrokes > 0 ? \`\${remStrokes} strokes remaining today\` : 'Daily practice goal complete!';

        const streakDisplay = document.getElementById('targetStreakDisplay');
        if (streakDisplay) streakDisplay.textContent = streak.current;

        // 4. Update Hero Scorecard with Smooth Counter Animations
        const metricWpmEl = document.getElementById('metricWpm');
        if (metricWpmEl) {
          metricWpmEl.innerHTML = \`\${speedWpm} <span style="font-size:16px; color:var(--text-dim);">WPM</span>\`;
        }

        const metricAccEl = document.getElementById('metricAcc');
        if (metricAccEl) {
          metricAccEl.textContent = accuracy > 0 ? \`\${accuracy.toFixed(1)}%\` : '—%';
        }

        const metricKeysEl = document.getElementById('metricKeys');
        if (metricKeysEl) animateCounter(metricKeysEl, totalKeys);

        const metricLessonsEl = document.getElementById('metricLessons');
        if (metricLessonsEl) {
          metricLessonsEl.innerHTML = \`\${completedLessons} <span style="font-size:16px; color:var(--text-dim);">/ \${profile.totalLessons}</span>\`;
        }

        const metricStreakEl = document.getElementById('metricStreak');
        if (metricStreakEl) {
          metricStreakEl.innerHTML = \`\${streak.current} <span style="font-size:16px; color:var(--text-dim);">Days</span>\`;
        }

        const metricTimeEl = document.getElementById('metricTime');
        if (metricTimeEl) {
          const mins = Math.floor(totalTimeSec / 60);
          const hrs = (mins / 60).toFixed(1);
          metricTimeEl.textContent = mins >= 60 ? \`\${hrs}h\` : \`\${mins}m\`;
        }

        const activeLayoutBadge = document.getElementById('activeLayoutBadge');
        if (activeLayoutBadge) activeLayoutBadge.textContent = profile.badgeName;

        const dataSourceLabel = document.getElementById('dataSourceLabel');
        if (dataSourceLabel) {
          if (demoModeActive) {
            dataSourceLabel.textContent = 'Preview Demonstration Telemetry';
          } else if (storageData.authSession?.email) {
            dataSourceLabel.textContent = \`Cloud Sync (\${storageData.authSession.email})\`;
          } else {
            dataSourceLabel.textContent = \`Local Storage (Active Profile · \${totalKeys.toLocaleString()} Strokes)\`;
          }
        }

        // 5. Render Ultra-Cool Trajectory Chart
        renderTrajectoryChart(trackSessions.length > 0 ? trackSessions : allSessions);

        // 6. Render 30-Day Punchcard
        renderPunchcard(allSessions);

        // 7. Render 8-Finger Biomechanics & Hand Balance
        const { fingerData, leftPct, rightPct } = getFingerWorkload(storageData.tracker?.fingerStats, storageData.progress?.fingers);
        const fingerBars = document.getElementById('fingerBarsGrid');
        if (fingerBars) {
          fingerBars.innerHTML = fingerData.map(f => \`
            <div class="finger-col">
              <div class="f-bar-wrap"><div class="f-bar-fill \${f.cls}" style="height:\${f.height}%;"></div></div>
              <span class="f-pct">\${f.pct}%</span>
              <span class="f-label">\${f.name}</span>
            </div>
          \`).join('');
        }
        const handLeftBar = document.getElementById('handBalanceLeft');
        if (handLeftBar) handLeftBar.style.width = \`\${leftPct}%\`;
        const handRightBar = document.getElementById('handBalanceRight');
        if (handRightBar) handRightBar.style.width = \`\${rightPct}%\`;
        const leftLbl = document.getElementById('handBalanceLeftLabel');
        if (leftLbl) leftLbl.textContent = \`Left Hand: \${leftPct}%\`;
        const rightLbl = document.getElementById('handBalanceRightLabel');
        if (rightLbl) rightLbl.textContent = \`Right Hand: \${rightPct}%\`;

        // 8. Render Recent Sessions Table
        const sessionsTbody = document.getElementById('sessionsTableBody');
        if (sessionsTbody) {
          const displaySessions = (trackSessions.length > 0) ? trackSessions.slice(0, 8) : allSessions.slice(0, 8);
          if (displaySessions.length > 0) {
            sessionsTbody.innerHTML = displaySessions.map(s => {
              const resColor = s.acc === 100 ? 'var(--emerald-neon)' : (s.acc >= 85 ? 'var(--emerald-neon)' : 'var(--gold-primary)');
              const resText = s.acc === 100 ? 'FLAWLESS' : (s.acc >= 85 ? 'PASSED' : 'PRACTICED');
              const mins = Math.floor(s.durSec / 60);
              const secs = s.durSec % 60;
              const durStr = \`\${String(mins).padStart(2, '0')}:\${String(secs).padStart(2, '0')}\`;
              return \`
                <tr>
                  <td><strong>\${s.title}</strong></td>
                  <td>\${s.track}</td>
                  <td><span style="color:\${resColor}; font-weight:700;">\${s.acc.toFixed(1)}%</span></td>
                  <td><strong>\${Math.round(s.wpm)} WPM</strong></td>
                  <td>\${durStr}</td>
                  <td>
                    <span style="color:\${resColor}; font-weight:700; margin-right:8px;">\${resText}</span>
                    <button type="button" class="drill-mini-btn" style="padding:2px 8px; font-size:10px;" onclick="window.location.href='index.html'">Replay</button>
                  </td>
                </tr>
              \`;
            }).join('');
          } else {
            sessionsTbody.innerHTML = \`
              <tr>
                <td colspan="6" style="text-align:center; padding:32px 16px; color:var(--text-muted);">
                  <div style="font-size:14px; font-weight:600; color:var(--text-primary); margin-bottom:4px;">No Practice Sessions Recorded Yet</div>
                  <div style="font-size:12px; margin-bottom:12px;">Complete a lesson in the training room to generate telemetry history.</div>
                  <a href="index.html" class="drill-mini-btn" style="display:inline-flex; align-items:center; gap:6px; padding:6px 14px; font-size:12px;">Start First Lesson &rarr;</a>
                </td>
              </tr>
            \`;
          }
        }

        // 9. Render Curriculum Roadmap Accordion
        const currAccordion = document.getElementById('curriculumAccordionList');
        if (currAccordion) {
          currAccordion.innerHTML = profile.levels.map((lv, uIdx) => {
            let doneCount = 0;
            const lessonCardsHtml = lv.lessons.map(lid => {
              const lData = course?.lessons?.[lid];
              const isMastered = lData && lData.completed;
              if (isMastered) doneCount++;
              const wpmVal = lData?.bestWpm || 0;
              const accVal = lData?.bestAccuracy || 0;
              const statusBadge = isMastered
                ? '<span style="color:var(--emerald-neon); font-size:10px; font-weight:700;">PASSED</span>'
                : '<span style="color:var(--text-dim); font-size:10px; font-weight:700;">UNSTARTED</span>';

              return \`
                <div class="lesson-mini-card \${isMastered ? 'mastered' : ''}">
                  <div class="lesson-card-head">
                    <span class="lesson-card-title">\${lid}</span>
                    \${statusBadge}
                  </div>
                  <div class="lesson-card-footer">
                    <span style="font-size:11px; color:var(--text-muted);">\${wpmVal > 0 ? \`\${wpmVal} WPM · \${accVal}%\` : 'Not yet attempted'}</span>
                    <button type="button" class="drill-mini-btn" style="padding:3px 10px; font-size:10px;" onclick="window.launchLesson('\${lid}', '\${currentTrack}')">Practice</button>
                  </div>
                </div>
              \`;
            }).join('');

            const pct = Math.round((doneCount / lv.count) * 100);
            return \`
              <div class="unit-accordion-item \${uIdx === 0 ? 'open' : ''}">
                <div class="unit-accordion-header" onclick="this.parentElement.classList.toggle('open')">
                  <div class="unit-header-left">
                    <svg class="svg-icon" viewBox="0 0 24 24" style="color:var(--gold-primary);"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    <span class="unit-header-title">\${lv.title}</span>
                  </div>
                  <span class="unit-header-count">\${doneCount} / \${lv.count} Mastered (\${pct}%)</span>
                </div>
                <div class="unit-accordion-body">
                  <div class="lessons-cards-grid">\${lessonCardsHtml}</div>
                </div>
              </div>
            \`;
          }).join('');
        }

        // 10. Render Adaptive Character Matrix & Weak Keys
        const charMatrix = document.getElementById('charMatrixGrid');
        if (charMatrix) {
          const trackStats = storageData.tracker?.keyStats?.[currentTrack] || {};
          const courseKeys = course?.keys || {};
          const rows = KEYBOARD_LAYOUTS[currentTrack] || KEYBOARD_LAYOUTS.standard;
          const flatKeys = rows.flat().filter(k => k.label && k.label.length <= 2 && k.id !== 'backspace' && k.id !== 'enter' && k.id !== 'space' && k.id !== 'tab' && k.id !== 'caps' && k.id !== 'shiftL' && k.id !== 'shiftR');

          charMatrix.innerHTML = flatKeys.map(k => {
            const ks = getKeyStats(k.id, k.label, trackStats, courseKeys);
            let cls = '';
            if (ks.attempts > 0) {
              if (ks.accuracy >= 95) cls = 'mastered';
              else if (ks.accuracy >= 85) cls = 'familiar';
              else cls = 'weak';
            }
            const accText = ks.accuracy !== null ? \`\${ks.accuracy}%\` : '—';
            return \`
              <div class="char-badge \${cls}" onclick="window.openKeyInspector('\${k.id}', '\${k.label}', '\${k.finger}', '\${k.desc}')">
                <span class="char-glyph">\${k.label}</span>
                <span class="char-acc-sub">\${accText}</span>
              </div>
            \`;
          }).join('');
        }

        const weakKeysList = document.getElementById('weakKeysGrid');
        if (weakKeysList) {
          const trackStats = storageData.tracker?.keyStats?.[currentTrack] || {};
          const courseKeys = course?.keys || {};
          const weakKeys = getWeakKeys(trackStats, courseKeys);

          if (weakKeys.length > 0) {
            weakKeysList.innerHTML = weakKeys.map(wk => \`
              <div class="weak-key-card">
                <div class="weak-key-left">
                  <div class="key-badge-square">\${wk.keyId.length === 1 ? wk.keyId.toUpperCase() : wk.keyId}</div>
                  <div class="weak-key-meta">
                    <h4>Key \${wk.keyId}</h4>
                    <p>Accuracy: \${wk.acc}% · Latency: \${wk.latency}</p>
                  </div>
                </div>
                <button type="button" class="drill-mini-btn" onclick="window.launchWeakKeyDrill('\${wk.keyId}', '\${currentTrack}')">Drill</button>
              </div>
            \`).join('');
          } else {
            weakKeysList.innerHTML = \`
              <div style="grid-column: 1 / -1; text-align:center; padding:20px; background:rgba(52,211,153,0.06); border:1px solid rgba(52,211,153,0.25); border-radius:8px;">
                <svg class="svg-icon" viewBox="0 0 24 24" style="width:24px; height:24px; color:var(--emerald-neon); margin-bottom:6px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <div style="color:var(--emerald-neon); font-weight:700;">No Stumbling Keys Detected</div>
                <div style="font-size:11px; color:var(--text-muted);">All practiced keys are performing above the 90% accuracy threshold.</div>
              </div>
            \`;
          }
        }

        // 11. Render Keyboard Heatmap
        const heatmapWrap = document.getElementById('keyboardHeatmapWrap');
        if (heatmapWrap) {
          const trackStats = storageData.tracker?.keyStats?.[currentTrack] || {};
          const courseKeys = course?.keys || {};
          const layoutRows = KEYBOARD_LAYOUTS[currentTrack] || KEYBOARD_LAYOUTS.standard;

          heatmapWrap.innerHTML = layoutRows.map(row => \`
            <div class="hm-row">
              \${row.map(k => {
                const ks = getKeyStats(k.id, k.label, trackStats, courseKeys);
                const titleText = (ks.attempts > 0)
                  ? \`Key \${k.id.toUpperCase()} / \${k.label} — Accuracy: \${ks.accuracy}% (\${ks.attempts} strokes)\`
                  : \`Key \${k.id.toUpperCase()} / \${k.label} — Not yet typed\`;
                return \`
                  <div class="hm-key \${k.cls || ''} \${ks.tier}" title="\${titleText}" onclick="window.openKeyInspector('\${k.id}', '\${k.label}', '\${k.finger}', '\${k.desc}')">
                    \${k.label}
                  </div>
                \`;
              }).join('')}
            </div>
          \`).join('');
        }

        // 12. Render Milestone Achievements
        updateAchievements({
          allSessions,
          totalKeysAll: totalKeys,
          totalLessonsAll: completedLessons,
          streak,
          progress: storageData.progress,
          lessonStats: storageData.lessonStats
        });

        // 13. Update Scribe Certificate Modal Fields
        const certName = document.getElementById('certRecipientName');
        const nameInput = document.getElementById('typistNameInput');
        const savedName = localStorage.getItem('pk_typist_name') || 'Active Typist';
        if (nameInput) nameInput.value = savedName;
        if (certName) certName.textContent = savedName;

        const certRank = document.getElementById('certRankDisplay');
        if (certRank) certRank.textContent = rank.title;

        const certTrack = document.getElementById('certTrackDisplay');
        if (certTrack) certTrack.textContent = profile.name;

        const certSpeed = document.getElementById('certSpeedDisplay');
        if (certSpeed) certSpeed.textContent = \`\${speedWpm} WPM\`;

        const certAcc = document.getElementById('certAccDisplay');
        if (certAcc) certAcc.textContent = \`\${accuracy > 0 ? accuracy.toFixed(1) : 95.0}%\`;

        const certDate = document.getElementById('certDateDisplay');
        if (certDate) certDate.textContent = \`\${months[d.getMonth()]} \${d.getFullYear()}\`;
      }

      // Launch Lesson in Studio
      window.launchLesson = function(lessonId, layoutId) {
        playHapticTick(1200, 0.03);
        try {
          localStorage.setItem('pk_active_lesson_session', JSON.stringify({
            lessonId: lessonId,
            layoutId: layoutId,
            timestamp: Date.now()
          }));
          localStorage.setItem('pk_active_layout', layoutId);
          localStorage.setItem('khmerActiveLayout', layoutId);
        } catch (e) {}
        window.location.href = \`index.html?lesson=\${encodeURIComponent(lessonId)}&layout=\${encodeURIComponent(layoutId)}\`;
      };

      // Launch Weak Key Drill
      window.launchWeakKeyDrill = function(keyId, layoutId) {
        playHapticTick(750, 0.04);
        try {
          localStorage.setItem('pk_active_layout', layoutId);
          localStorage.setItem('khmerActiveLayout', layoutId);
        } catch (e) {}
        window.location.href = \`index.html?practice=weak&key=\${encodeURIComponent(keyId)}&layout=\${encodeURIComponent(layoutId)}\`;
      };

      // Open Key Inspector Modal
      window.openKeyInspector = function(keyId, label, fingerCode, desc) {
        playHapticTick(980, 0.02);
        const storageData = readAllLocalStorage();
        const course = storageData.progress?.courses?.[currentTrack];
        const trackStats = storageData.tracker?.keyStats?.[currentTrack] || {};
        const courseKeys = course?.keys || {};
        const ks = getKeyStats(keyId, label, trackStats, courseKeys);

        const modal = document.getElementById('keyInspectorModal');
        const square = document.getElementById('inspectorKeySquare');
        const title = document.getElementById('keyInspectorTitle');
        const sub = document.getElementById('keyInspectorSub');
        const accEl = document.getElementById('inspectorAcc');
        const attemptsEl = document.getElementById('inspectorAttempts');
        const latencyEl = document.getElementById('inspectorLatency');
        const fingerEl = document.getElementById('inspectorFinger');
        const drillBtn = document.getElementById('btnLaunchKeyDrill');

        if (square) square.textContent = label;
        if (title) title.textContent = \`Key: \${label} (\${keyId.toUpperCase()})\`;
        if (sub) sub.textContent = desc || 'Tactile Keyboard Keycap';
        if (accEl) accEl.textContent = ks.accuracy !== null ? \`\${ks.accuracy}%\` : '—%';
        if (attemptsEl) attemptsEl.textContent = ks.attempts.toLocaleString();
        if (latencyEl) latencyEl.textContent = ks.latency ? \`\${ks.latency}ms\` : '—';
        if (fingerEl) fingerEl.textContent = FINGER_NAMES_MAP[fingerCode] || 'Dynamic Reach';

        if (drillBtn) {
          drillBtn.onclick = () => window.launchWeakKeyDrill(keyId, currentTrack);
        }

        if (modal) modal.classList.add('active');
      };

      // Close Key Inspector Modal
      const btnCloseKeyInspector = document.getElementById('btnCloseKeyInspector');
      if (btnCloseKeyInspector) {
        btnCloseKeyInspector.onclick = () => {
          const modal = document.getElementById('keyInspectorModal');
          if (modal) modal.classList.remove('active');
        };
      }

      // Scribe Certificate & Export Modal Handlers
      const exportModal = document.getElementById('exportModal');
      const btnOpenExport = document.getElementById('btnOpenExportModal');
      const btnCloseExport = document.getElementById('btnCloseExportModal');
      if (btnOpenExport && exportModal) {
        btnOpenExport.onclick = () => {
          playHapticTick(1050, 0.03);
          exportModal.classList.add('active');
        };
      }
      if (btnCloseExport && exportModal) {
        btnCloseExport.onclick = () => exportModal.classList.remove('active');
      }

      // Typist Name Input
      const nameInput = document.getElementById('typistNameInput');
      if (nameInput) {
        nameInput.addEventListener('input', (e) => {
          const val = e.target.value.trim() || 'Active Typist';
          localStorage.setItem('pk_typist_name', val);
          const certRecipient = document.getElementById('certRecipientName');
          if (certRecipient) certRecipient.textContent = val;
        });
      }

      // Print Certificate
      const btnPrint = document.getElementById('btnPrintCertificate');
      if (btnPrint) {
        btnPrint.onclick = () => window.print();
      }

      // Download JSON Dossier
      const btnDownloadJson = document.getElementById('btnDownloadJsonDossier');
      if (btnDownloadJson) {
        btnDownloadJson.onclick = () => {
          playHapticTick(1200, 0.03);
          const profile = TRACK_METADATA[currentTrack] || TRACK_METADATA.standard;
          const storageData = readAllLocalStorage();
          const dossier = {
            app: 'PK Khmer Type Analytics Command Center',
            author: 'Phanna Kurosaki',
            exportDate: new Date().toISOString(),
            typist: localStorage.getItem('pk_typist_name') || 'Active Typist',
            track: profile.name,
            metrics: {
              keysLogged: document.getElementById('metricKeys')?.textContent?.trim() || '0',
              wpm: document.getElementById('metricWpm')?.textContent?.trim() || '0 WPM',
              accuracy: document.getElementById('metricAcc')?.textContent?.trim() || '0.0%',
              lessonsCompleted: document.getElementById('metricLessons')?.textContent?.trim() || '0 / 78',
              streak: document.getElementById('metricStreak')?.textContent?.trim() || '0 Days'
            },
            telemetry: storageData
          };

          const blob = new Blob([JSON.stringify(dossier, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = \`pk-khmer-type-dossier-\${currentTrack}-\${new Date().toISOString().slice(0, 10)}.json\`;
          a.click();
          URL.revokeObjectURL(url);
        };
      }

      // Tab Switching
      const tabBtns = document.querySelectorAll('.view-tab-btn');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          playHapticTick(820, 0.02);
          tabBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');

          const tabName = btn.dataset.tab;
          document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
          const targetPane = document.getElementById(\`pane-\${tabName}\`);
          if (targetPane) targetPane.classList.add('active');

          if (tabName === 'overview') {
            const storageData = readAllLocalStorage();
            const allSessions = extractAllSessions(storageData);
            renderTrajectoryChart(allSessions);
          }
        });
      });

      // Track Filter Switching
      const trackBtns = document.querySelectorAll('#trackFilter .segment-btn');
      trackBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          playHapticTick(900, 0.02);
          trackBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentTrack = btn.dataset.track || 'standard';
          renderDashboard();
        });
      });

      // Timeframe Filter Switching
      const timeBtns = document.querySelectorAll('#timeFilter .segment-btn');
      timeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          playHapticTick(860, 0.02);
          timeBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentTimeframe = btn.dataset.time || 'all';
          renderDashboard();
        });
      });

      // Daily Target Presets
      const presetBtns = document.querySelectorAll('.target-preset-btn');
      presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          playHapticTick(940, 0.02);
          presetBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeDailyTarget = parseInt(btn.dataset.target, 10) || 500;
          renderDashboard();
        });
      });

      // Demo Mode Toggle
      const btnToggleDemo = document.getElementById('btnToggleDemo');
      const demoBanner = document.getElementById('demoNoticeBanner');
      const btnExitDemo = document.getElementById('btnExitDemo');
      const demoLabel = document.getElementById('demoToggleLabel');

      function toggleDemoMode(enable) {
        demoModeActive = enable;
        playHapticTick(enable ? 1300 : 700, 0.03);
        if (demoBanner) demoBanner.classList.toggle('hidden', !demoModeActive);
        if (demoLabel) demoLabel.textContent = demoModeActive ? 'Exit Demo' : 'Demo Preview';
        if (btnToggleDemo) btnToggleDemo.classList.toggle('primary', demoModeActive);
        renderDashboard();
      }

      if (btnToggleDemo) {
        btnToggleDemo.onclick = () => toggleDemoMode(!demoModeActive);
      }
      if (btnExitDemo) {
        btnExitDemo.onclick = () => toggleDemoMode(false);
      }

      // Initial Render
      renderDashboard();
    });
`;
