/* ============================================================
   PK Khmer Type — Custom Lessons Engine & Management Hub
   Allows learners to create, customize, organize, and practice
   tailored typing lessons for Khmer Standard, NiDA, and English.
   Zero-emoji compliant. Persisted via localStorage.
   ============================================================ */

(function(window, document){
  'use strict';

  const STORAGE_KEY_LESSONS = 'khmerCustomLessons_v1';
  const STORAGE_KEY_PROGRESS = 'khmerCustomProgress_v1';

  /* Safe HTML escaping */
  function escapeHtml(str){
    if(typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* Safe JSON parsing with prototype pollution defense */
  function safeJsonParse(raw, fallback){
    if(!raw || typeof raw !== 'string') return fallback;
    try {
      const parsed = JSON.parse(raw);
      if(parsed && typeof parsed === 'object'){
        delete parsed.__proto__;
        delete parsed.constructor;
        delete parsed.prototype;
      }
      return parsed || fallback;
    } catch(e){
      return fallback;
    }
  }

  /* Generate collision-resistant unique ID */
  function generateLessonId(){
    return 'cust_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  }

  /* ============================================================
     Curated Starter Templates Library
     Provides high-pedagogical-value foundations for instant crafting.
     ============================================================ */
  const STARTER_TEMPLATES = [
    {
      id: 'km-vowels-dep',
      category: 'khmer',
      titleEn: 'Khmer Dependent Vowels',
      titleKm: 'ស្រៈនិស្ស័យខ្មែរ',
      difficulty: 'beginner',
      targetLayout: 'standard',
      content: 'ា ិ ី ឹ ឺ ុ ូ ួ ើ ឿ ៀ េ ែ ៃ ោ ៅ ុំ ំ ាំ ះ ុះ េះ ោះ',
      descEn: 'Master all 23 Khmer dependent vowel signs and compound forms.',
      descKm: 'ហ្វឹកហាត់ស្រៈនិស្ស័យទាំង ២៣ រួមទាំងស្រៈផ្សំ។'
    },
    {
      id: 'km-consonants-all',
      category: 'khmer',
      titleEn: '33 Khmer Consonants',
      titleKm: 'ព្យញ្ជនៈខ្មែរទាំង ៣៣',
      difficulty: 'beginner',
      targetLayout: 'standard',
      content: 'ក ខ គ ឃ ង ច ឆ ជ ឈ ញ ដ ឋ ឌ ឍ ណ ត ថ ទ ធ ន ប ផ ព ភ ម យ រ ល វ ស ហ ឡ អ',
      descEn: 'Complete drill of all 33 base consonants across the home and reach rows.',
      descKm: 'ហ្វឹកហាត់ព្យញ្ជនៈគ្រឹះទាំង ៣៣ តួគ្រប់ជួរដៃ។'
    },
    {
      id: 'km-subscripts-coeng',
      category: 'khmer',
      titleEn: 'Essential Subscripts (Coeng)',
      titleKm: 'ជើងព្យញ្ជនៈសំខាន់ៗ',
      difficulty: 'intermediate',
      targetLayout: 'standard',
      content: 'ក្ក ក្ខ ក្គ ច្ច ឆ្ឆ ញ្ញ ដ្ឋ ឌ្ឍ ត្ត ថ្ថ ទ្ទ ធ្ធ ន្ន ប្បញ្ញ ផ្ផ ព្ព ភភ្ភ ម្ម យ្យ រ្រ ល្ល វ្វ ស្ស ហ្ហ',
      descEn: 'Subscript trigger practice with unshifted space (Coeng ្).',
      descKm: 'ហ្វឹកហាត់ចុចជើងព្យញ្ជនៈតាមរយៈសញ្ញាជើង (្)។'
    },
    {
      id: 'km-words-common',
      category: 'khmer',
      titleEn: 'Core Khmer Vocabulary',
      titleKm: 'ពាក្យខ្មែរទូទៅ',
      difficulty: 'intermediate',
      targetLayout: 'standard',
      content: 'កម្ពុជា សួស្តី អរគុណ សន្តិភាព សាលារៀន ចំណេះដឹង ការអាន វប្បធម៌ មិត្តភក្តិ គ្រួសារ',
      descEn: 'High-frequency Cambodian words for fluid daily writing.',
      descKm: 'ពាក្យប្រើប្រាស់ញឹកញាប់ក្នុងជីវភាពរស់នៅប្រចាំថ្ងៃ។'
    },
    {
      id: 'km-wisdom-quotes',
      category: 'khmer',
      titleEn: 'Khmer Proverbs & Wisdom',
      titleKm: 'សុភាសិត និងទស្សនវិជ្ជាខ្មែរ',
      difficulty: 'advanced',
      targetLayout: 'standard',
      content: 'ចេះមកពីរៀន មានមកពីរក ទឹកថ្លាឈ្វេង ត្រីកំភ្លាញហែល ស្រឡាញ់ខ្លួនឱ្យស្គាល់ខ្មាស់ ស្រឡាញ់ចាស់ឱ្យស្គាល់គុណ',
      descEn: 'Philosophical sentences and poetic proverbs to build flow.',
      descKm: 'ឃ្លាសុភាសិតបុរាណដើម្បីបង្កើនល្បឿន និងភាពរលូន។'
    },
    {
      id: 'en-top-words',
      category: 'english',
      titleEn: 'Top English Typing Words',
      titleKm: 'ពាក្យអង់គ្លេសទូទៅបំផុត',
      difficulty: 'beginner',
      targetLayout: 'english',
      content: 'the be to of and a in that have I it for not on with he as you do at this but his by from they we say her she',
      descEn: 'Most frequently typed English words for instant finger fluency.',
      descKm: 'ពាក្យអង់គ្លេសដែលវាយញឹកញាប់បំផុតដើម្បីបណ្តុះសាច់ដុំដៃ។'
    },
    {
      id: 'en-classic-pangram',
      category: 'english',
      titleEn: 'The Complete Alphabet Pangram',
      titleKm: 'ល្បះប្រជុំអក្សរអង់គ្លេសពេញលេញ (A-Z)',
      difficulty: 'intermediate',
      targetLayout: 'english',
      content: 'the quick brown fox jumps over the lazy dog pack my box with five dozen liquor jugs',
      descEn: 'Touches every letter from A to Z across physical key positions.',
      descKm: 'ហាត់គ្រប់តួអក្សរ A ដល់ Z ក្នុងឃ្លាតែមួយ។'
    },
    {
      id: 'en-coding-keywords',
      category: 'english',
      titleEn: 'Programming Keywords',
      titleKm: 'ពាក្យគន្លឹះសរសេរកូដ (Programming)',
      difficulty: 'advanced',
      targetLayout: 'english',
      content: 'const let function return async await import export default class if else switch case break true false null undefined',
      descEn: 'Modern JavaScript and TypeScript syntax tokens for developers.',
      descKm: 'ពាក្យគន្លឹះកូដកម្មវិធីសម្រាប់អ្នកសរសេរកម្មវិធី។'
    },
    {
      id: 'km-numbers-symbols',
      category: 'numbers',
      titleEn: 'Khmer Numbers & Punctuation',
      titleKm: 'លេខ និងសញ្ញាខណ្ឌខ្មែរ',
      difficulty: 'intermediate',
      targetLayout: 'standard',
      content: '០ ១ ២ ៣ ៤ ៥ ៦ ៧ ៨ ៩ ៛ ។ ៕ ៖ ៗ ៘',
      descEn: 'Khmer numerals, currency symbol, and cultural punctuation marks.',
      descKm: 'លេខខ្មែរ សញ្ញារូបិយប័ណ្ណរៀល និងវណ្ណយុត្តិខណ្ឌ។'
    }
  ];

  /* ============================================================
     Data Access & Persistence Layer
     ============================================================ */

  function loadLessonsRaw(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY_LESSONS);
      const parsed = safeJsonParse(raw, []);
      if(!Array.isArray(parsed)) return [];
      return parsed.map((item, idx) => ({
        id: String(item.id || ('cust_' + idx)),
        title: String(item.title || 'Untitled Custom Lesson').trim(),
        description: String(item.description || '').trim(),
        content: String(item.content || ''),
        difficulty: ['beginner', 'intermediate', 'advanced'].includes(item.difficulty) ? item.difficulty : 'beginner',
        targetLayout: ['standard', 'nida', 'english', 'any'].includes(item.targetLayout) ? item.targetLayout : 'any',
        order: typeof item.order === 'number' ? item.order : (idx + 1),
        createdAt: item.createdAt || Date.now(),
        updatedAt: item.updatedAt || Date.now()
      })).sort((a, b) => a.order - b.order);
    } catch(e){
      return [];
    }
  }

  function saveLessonsRaw(lessons){
    try {
      localStorage.setItem(STORAGE_KEY_LESSONS, JSON.stringify(lessons));
      window.dispatchEvent(new CustomEvent('pkCustomLessonsChanged', { detail: { count: lessons.length } }));
      return true;
    } catch(e){
      return false;
    }
  }

  function loadProgressRaw(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
      return safeJsonParse(raw, {});
    } catch(e){
      return {};
    }
  }

  function saveProgressRaw(progressMap){
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progressMap));
      window.dispatchEvent(new CustomEvent('pkCustomProgressChanged', { detail: progressMap }));
      return true;
    } catch(e){
      return false;
    }
  }

  /* ============================================================
     PK_CUSTOM_LESSONS Core API
     ============================================================ */

  const PK_CUSTOM_LESSONS = {
    templates: STARTER_TEMPLATES,

    getAll: function(){
      return loadLessonsRaw();
    },

    get: function(id){
      if(!id) return null;
      const list = loadLessonsRaw();
      return list.find(l => String(l.id) === String(id)) || null;
    },

    validate: function(data){
      const errors = [];
      const title = (data && typeof data.title === 'string') ? data.title.trim() : '';
      const content = (data && typeof data.content === 'string') ? data.content : '';

      if(!title){
        errors.push('Lesson title cannot be empty.');
      } else if(title.length > 80){
        errors.push('Lesson title cannot exceed 80 characters.');
      }

      if(!content || !content.trim()){
        errors.push('Practice content cannot be empty.');
      } else {
        const layout = data.targetLayout || 'standard';
        let units = [];
        if(typeof window.splitIntoTypingUnits === 'function'){
          units = window.splitIntoTypingUnits(content, layout);
        } else {
          units = Array.from(content);
        }
        if(!units || units.length === 0){
          errors.push('Practice content must contain at least one valid typing character.');
        }
      }

      return {
        valid: errors.length === 0,
        errors: errors
      };
    },

    create: function(lessonData){
      const val = this.validate(lessonData);
      if(!val.valid){
        throw new Error(val.errors.join(' '));
      }

      const list = loadLessonsRaw();
      const nextOrder = list.length > 0 ? Math.max(...list.map(l => l.order || 0)) + 1 : 1;
      const now = Date.now();

      const newLesson = {
        id: generateLessonId(),
        title: lessonData.title.trim(),
        description: (lessonData.description || '').trim(),
        content: lessonData.content, // Content is preserved exactly without alteration
        difficulty: ['beginner', 'intermediate', 'advanced'].includes(lessonData.difficulty) ? lessonData.difficulty : 'beginner',
        targetLayout: ['standard', 'nida', 'english', 'any'].includes(lessonData.targetLayout) ? lessonData.targetLayout : 'any',
        order: nextOrder,
        createdAt: now,
        updatedAt: now
      };

      list.push(newLesson);
      saveLessonsRaw(list);
      return newLesson;
    },

    update: function(id, patch){
      const list = loadLessonsRaw();
      const idx = list.findIndex(l => String(l.id) === String(id));
      if(idx === -1) return null;

      const merged = { ...list[idx], ...patch };
      const val = this.validate(merged);
      if(!val.valid){
        throw new Error(val.errors.join(' '));
      }

      merged.title = merged.title.trim();
      merged.description = (merged.description || '').trim();
      merged.updatedAt = Date.now();

      list[idx] = merged;
      saveLessonsRaw(list);
      return merged;
    },

    duplicate: function(id){
      const target = this.get(id);
      if(!target) return null;

      const isKm = document.documentElement.classList.contains('site-km-mode');
      const copySuffix = isKm ? ' (ចម្លង)' : ' (Copy)';
      const clonedTitle = (target.title + copySuffix).slice(0, 80);

      const list = loadLessonsRaw();
      const targetIdx = list.findIndex(l => String(l.id) === String(id));
      const now = Date.now();

      const clone = {
        ...target,
        id: generateLessonId(),
        title: clonedTitle,
        createdAt: now,
        updatedAt: now,
        order: target.order + 1
      };

      // Shift subsequent orders up by 1
      list.forEach(l => {
        if(l.order > target.order) l.order += 1;
      });

      if(targetIdx >= 0){
        list.splice(targetIdx + 1, 0, clone);
      } else {
        list.push(clone);
      }

      saveLessonsRaw(list);
      return clone;
    },

    delete: function(id){
      const list = loadLessonsRaw();
      const filtered = list.filter(l => String(l.id) !== String(id));
      if(filtered.length === list.length) return false;

      // Re-index order smoothly
      filtered.forEach((l, i) => { l.order = i + 1; });
      saveLessonsRaw(filtered);

      // Clean up progress entry for deleted lesson
      const prog = loadProgressRaw();
      if(prog[id]){
        delete prog[id];
        saveProgressRaw(prog);
      }

      return true;
    },

    reorder: function(id, direction){
      const list = loadLessonsRaw();
      const idx = list.findIndex(l => String(l.id) === String(id));
      if(idx === -1) return false;

      if(direction === 'up' && idx > 0){
        const temp = list[idx].order;
        list[idx].order = list[idx - 1].order;
        list[idx - 1].order = temp;
        const swap = list[idx];
        list[idx] = list[idx - 1];
        list[idx - 1] = swap;
      } else if(direction === 'down' && idx < list.length - 1){
        const temp = list[idx].order;
        list[idx].order = list[idx + 1].order;
        list[idx + 1].order = temp;
        const swap = list[idx];
        list[idx] = list[idx + 1];
        list[idx + 1] = swap;
      } else {
        return false;
      }

      // Ensure normalized sequential orders
      list.forEach((l, i) => { l.order = i + 1; });
      saveLessonsRaw(list);
      return true;
    },

    /* Progress Management */
    getProgress: function(id){
      if(!id) return null;
      const prog = loadProgressRaw();
      return prog[id] || {
        attempts: 0,
        completedCount: 0,
        bestAccuracy: 0,
        bestWpm: 0,
        lastPracticed: null
      };
    },

    recordAttempt: function(id, stats){
      if(!id || !stats) return null;
      const prog = loadProgressRaw();
      const cur = prog[id] || {
        attempts: 0,
        completedCount: 0,
        bestAccuracy: 0,
        bestWpm: 0,
        lastPracticed: null
      };

      const accuracy = typeof stats.accuracy === 'number' ? Math.max(0, Math.min(100, Math.round(stats.accuracy))) : 0;
      const wpm = typeof stats.wpm === 'number' ? Math.max(0, Math.min(180, Math.round(stats.wpm))) : 0;
      const passed = accuracy >= 80;

      cur.attempts = (cur.attempts || 0) + 1;
      if(passed) cur.completedCount = (cur.completedCount || 0) + 1;
      cur.bestAccuracy = Math.max(cur.bestAccuracy || 0, accuracy);
      cur.bestWpm = Math.max(cur.bestWpm || 0, wpm);
      cur.lastPracticed = Date.now();

      prog[id] = cur;
      saveProgressRaw(prog);
      return cur;
    },

    resetProgress: function(id){
      if(!id) return false;
      const prog = loadProgressRaw();
      if(prog[id]){
        delete prog[id];
        saveProgressRaw(prog);
      }
      return true;
    },

    resetAllProgress: function(){
      saveProgressRaw({});
      return true;
    },

    /* ============================================================
       Curriculum Runner Integration
       Adapts custom lesson into typing engine format compatible
       with startLesson(def, true).
       ============================================================ */
    toCurriculumLesson: function(lesson, activeLayout){
      if(!lesson) return null;
      const isKm = document.documentElement.classList.contains('site-km-mode');
      const targetLayout = (lesson.targetLayout && lesson.targetLayout !== 'any')
        ? lesson.targetLayout
        : (activeLayout || (typeof currentLayoutId !== 'undefined' ? currentLayoutId : 'standard'));

      return {
        id: lesson.id,
        level: 'custom',
        title: lesson.title,
        titleKm: lesson.title,
        subtitle: lesson.description || (isKm ? 'មេរៀនផ្ទាល់ខ្លួនរបស់អ្នក' : 'Your Custom Practice Lesson'),
        subtitleKm: lesson.description || 'មេរៀនផ្ទាល់ខ្លួនរបស់អ្នក',
        type: 'custom',
        isCustom: true,
        difficulty: lesson.difficulty || 'beginner',
        targetLayout: targetLayout,
        threshold: 80,
        generate: function(){
          const content = lesson.content || '';
          let units = [];
          if(typeof window.splitIntoTypingUnits === 'function'){
            units = window.splitIntoTypingUnits(content, targetLayout);
          } else {
            units = Array.from(content);
          }

          // Resolve keyboard table based on layout
          const table = (targetLayout === 'nida' && typeof KEY_BY_ID_NIDA !== 'undefined') ? KEY_BY_ID_NIDA
            : (targetLayout === 'english' && typeof KEY_BY_ID_EN !== 'undefined') ? KEY_BY_ID_EN
            : (typeof KEY_BY_ID !== 'undefined' ? KEY_BY_ID : null);

          const entries = units.map(unit => {
            let loc = null;
            if(typeof window.resolveCharLocation === 'function'){
              loc = window.resolveCharLocation(unit, table);
            }
            if(loc) return loc;
            if(unit === ' ' || unit === '\u200B'){
              return { id: 'space', layer: 'base', ch: unit };
            }
            // Graceful fallback for unmapped characters: allow typing via base layer space or direct key
            return { id: 'space', layer: 'base', ch: unit };
          });

          return {
            chars: entries.map(e => e.ch),
            layers: entries.map(e => e.layer),
            keyIds: entries.map(e => e.id),
            sections: [
              {
                id: 'sec_custom_' + lesson.id,
                type: 'custom-drill',
                title: lesson.title,
                startIndex: 0,
                endIndex: Math.max(0, entries.length - 1),
                totalUnits: entries.length
              }
            ]
          };
        }
      };
    },

    startPractice: function(id){
      const lesson = this.get(id);
      if(!lesson) return false;

      // Close open modals
      this.closeHub();
      this.closeEditor();

      // Check layout requirements
      if(lesson.targetLayout && lesson.targetLayout !== 'any'){
        if(typeof currentLayoutId !== 'undefined' && currentLayoutId !== lesson.targetLayout){
          if(typeof switchLayout === 'function'){
            switchLayout(lesson.targetLayout);
          }
        }
      }

      const activeLayout = typeof currentLayoutId !== 'undefined' ? currentLayoutId : 'standard';
      const curriculumDef = this.toCurriculumLesson(lesson, activeLayout);

      if(typeof startLesson === 'function'){
        startLesson(curriculumDef, true);
        return true;
      }
      return false;
    },

    /* ============================================================
       Crafting Utilities (Text transforms for effortless authoring)
       ============================================================ */
    tools: {
      repeat: function(text, times = 2){
        if(!text) return '';
        const trimmed = text.trim();
        const parts = [];
        for(let i = 0; i < times; i++) parts.push(trimmed);
        return parts.join(' ');
      },

      shuffleWords: function(text){
        if(!text) return '';
        const words = text.trim().split(/\s+/).filter(Boolean);
        for(let i = words.length - 1; i > 0; i--){
          const j = Math.floor(Math.random() * (i + 1));
          [words[i], words[j]] = [words[j], words[i]];
        }
        return words.join(' ');
      },

      addSpaces: function(text){
        if(!text) return '';
        let units = [];
        if(typeof window.splitIntoTypingUnits === 'function'){
          units = window.splitIntoTypingUnits(text, 'standard');
        } else {
          units = Array.from(text);
        }
        return units.filter(u => u.trim()).join(' ');
      },

      cleanSpaces: function(text){
        if(!text) return '';
        return text.replace(/\s+/g, ' ').trim();
      },

      calcMetrics: function(text, layoutId = 'standard'){
        if(!text) return { chars: 0, units: 0, words: 0, estSec: 0 };
        const rawChars = text.length;
        let units = [];
        if(typeof window.splitIntoTypingUnits === 'function'){
          units = window.splitIntoTypingUnits(text, layoutId);
        } else {
          units = Array.from(text);
        }
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        // Estimate typing time assuming ~30 WPM (2.5 units per second)
        const estSec = Math.max(1, Math.round(units.length / 2.5));
        return {
          chars: rawChars,
          units: units.length,
          words: words,
          estSec: estSec
        };
      }
    },

    /* ============================================================
       UI Management (Hub, Editor & Confirm Dialogs)
       ============================================================ */
    activeFilter: 'all',
    searchQuery: '',
    editingLessonId: null,

    openHub: function(){
      const modal = document.getElementById('customLessonsModal');
      if(!modal) return;
      modal.hidden = false;
      this.renderHub();
      const createBtn = document.getElementById('clHubNewBtn');
      if(createBtn) createBtn.focus();
    },

    closeHub: function(){
      const modal = document.getElementById('customLessonsModal');
      if(!modal) return;
      if(typeof window.closeModalAnimated === 'function'){
        window.closeModalAnimated(modal);
      } else {
        modal.hidden = true;
      }
    },

    renderHub: function(){
      const listEl = document.getElementById('clLessonList');
      const emptyEl = document.getElementById('clEmptyState');
      const countEl = document.getElementById('clHubCountBadge');
      if(!listEl) return;

      const all = this.getAll();
      if(countEl) countEl.textContent = String(all.length);

      let filtered = all;
      if(this.activeFilter && this.activeFilter !== 'all'){
        filtered = filtered.filter(l => l.difficulty === this.activeFilter);
      }
      if(this.searchQuery){
        const q = this.searchQuery.toLowerCase();
        filtered = filtered.filter(l => l.title.toLowerCase().includes(q) || l.content.toLowerCase().includes(q));
      }

      if(all.length === 0){
        listEl.innerHTML = '';
        listEl.hidden = true;
        if(emptyEl) emptyEl.hidden = false;
        return;
      }

      if(emptyEl) emptyEl.hidden = true;
      listEl.hidden = false;

      if(filtered.length === 0){
        const isKm = document.documentElement.classList.contains('site-km-mode');
        listEl.innerHTML = `
          <div class="cl-no-match">
            <svg class="pk-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <p class="i18n-t" data-en="No custom lessons match your search." data-km="មិនមានមេរៀនដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។">${isKm ? 'មិនមានមេរៀនដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។' : 'No custom lessons match your search.'}</p>
          </div>
        `;
        return;
      }

      const isKm = document.documentElement.classList.contains('site-km-mode');
      const html = filtered.map((lesson, idx) => {
        const prog = this.getProgress(lesson.id);
        const diffLabels = {
          beginner: { en: 'Beginner', km: 'ដំបូង' },
          intermediate: { en: 'Intermediate', km: 'មធ្យម' },
          advanced: { en: 'Advanced', km: 'កម្រិតខ្ពស់' }
        };
        const diffObj = diffLabels[lesson.difficulty] || diffLabels.beginner;
        const layoutLabels = {
          standard: { en: 'Khmer Standard', km: 'ខ្មែរស្តង់ដារ' },
          nida: { en: 'Khmer NiDA', km: 'ខ្មែរ និដា' },
          english: { en: 'English QWERTY', km: 'អង់គ្លេស QWERTY' },
          any: { en: 'Any Layout', km: 'គ្រប់ប្លង់' }
        };
        const layoutObj = layoutLabels[lesson.targetLayout] || layoutLabels.any;
        const metrics = this.tools.calcMetrics(lesson.content, lesson.targetLayout);

        return `
          <div class="cl-card" data-id="${escapeHtml(lesson.id)}">
            <div class="cl-card-header">
              <div class="cl-card-num">${String(lesson.order).padStart(2, '0')}</div>
              <div class="cl-card-main-meta">
                <h3 class="cl-card-title">${escapeHtml(lesson.title)}</h3>
                ${lesson.description ? `<p class="cl-card-desc">${escapeHtml(lesson.description)}</p>` : ''}
              </div>
              <div class="cl-card-badges">
                <span class="cl-diff-badge ${escapeHtml(lesson.difficulty)}">${isKm ? diffObj.km : diffObj.en}</span>
                <span class="cl-layout-badge">${isKm ? layoutObj.km : layoutObj.en}</span>
              </div>
            </div>

            <div class="cl-card-preview" title="Preview practice content">
              <code>${escapeHtml(lesson.content.slice(0, 110))}${lesson.content.length > 110 ? '…' : ''}</code>
            </div>

            <div class="cl-card-meta-row">
              <span class="cl-meta-item">
                <svg class="pk-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>~${metrics.estSec}${isKm ? 'វ' : 's'}</span>
              </span>
              <span class="cl-meta-item">
                <svg class="pk-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2.5"/><line x1="7" y1="16" x2="17" y2="16"/></svg>
                <span>${metrics.units} ${isKm ? 'តួវាយ' : 'units'}</span>
              </span>
              ${prog && prog.attempts > 0 ? `
              <span class="cl-meta-item gold" title="Best Speed">
                <svg class="pk-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <span>${prog.bestWpm} WPM</span>
              </span>
              <span class="cl-meta-item ${prog.bestAccuracy >= 80 ? 'green' : ''}" title="Best Accuracy">
                <svg class="pk-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                <span>${prog.bestAccuracy}%</span>
              </span>
              ` : `
              <span class="cl-meta-item muted">
                <span>${isKm ? 'មិនទាន់អនុវត្ត' : 'Unpracticed'}</span>
              </span>
              `}
            </div>

            <div class="cl-card-actions">
              <button type="button" class="cl-action-btn cl-play-btn" data-action="practice" title="Practice Lesson">
                <svg class="pk-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                <span class="i18n-t" data-en="Practice" data-km="អនុវត្ត">${isKm ? 'អនុវត្ត' : 'Practice'}</span>
              </button>

              <button type="button" class="cl-icon-btn" data-action="edit" title="Edit Lesson">
                <svg class="pk-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
              </button>

              <button type="button" class="cl-icon-btn" data-action="duplicate" title="Duplicate Lesson">
                <svg class="pk-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>

              <button type="button" class="cl-icon-btn" data-action="move-up" title="Move Up" ${idx === 0 ? 'disabled' : ''}>
                <svg class="pk-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
              </button>

              <button type="button" class="cl-icon-btn" data-action="move-down" title="Move Down" ${idx === filtered.length - 1 ? 'disabled' : ''}>
                <svg class="pk-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
              </button>

              ${prog && prog.attempts > 0 ? `
              <button type="button" class="cl-icon-btn" data-action="reset-progress" title="Reset Progress Stats">
                <svg class="pk-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
              ` : ''}

              <button type="button" class="cl-icon-btn danger" data-action="delete" title="Delete Lesson">
                <svg class="pk-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        `;
      }).join('');

      listEl.innerHTML = html;
    },

    openEditor: function(idOrNull, prefillData){
      const modal = document.getElementById('customLessonEditorModal');
      if(!modal) return;

      this.editingLessonId = idOrNull || null;
      const isKm = document.documentElement.classList.contains('site-km-mode');

      const titleHeader = document.getElementById('clEditorTitleHeading');
      const inputTitle = document.getElementById('clInputTitle');
      const inputDesc = document.getElementById('clInputDesc');
      const selectDiff = document.getElementById('clSelectDiff');
      const selectLayout = document.getElementById('clSelectLayout');
      const textContent = document.getElementById('clTextContent');
      const errBox = document.getElementById('clEditorErrors');

      if(errBox){
        errBox.textContent = '';
        errBox.hidden = true;
      }

      let data = {
        title: '',
        description: '',
        difficulty: 'beginner',
        targetLayout: 'standard',
        content: ''
      };

      if(idOrNull){
        const existing = this.get(idOrNull);
        if(existing) data = { ...existing };
        if(titleHeader) titleHeader.textContent = isKm ? 'កែសម្រួលមេរៀន' : 'Edit Custom Lesson';
      } else if(prefillData){
        data = { ...data, ...prefillData };
        if(titleHeader) titleHeader.textContent = isKm ? 'បង្កើតមេរៀនថ្មី' : 'Create Custom Lesson';
      } else {
        if(titleHeader) titleHeader.textContent = isKm ? 'បង្កើតមេរៀនថ្មី' : 'Create Custom Lesson';
      }

      if(inputTitle) inputTitle.value = data.title;
      if(inputDesc) inputDesc.value = data.description;
      if(selectDiff) selectDiff.value = data.difficulty;
      if(selectLayout) selectLayout.value = data.targetLayout;
      if(textContent) textContent.value = data.content;

      this.updateEditorTelemetry();

      modal.hidden = false;
      if(inputTitle) inputTitle.focus();
    },

    closeEditor: function(){
      const modal = document.getElementById('customLessonEditorModal');
      if(!modal) return;
      if(typeof window.closeModalAnimated === 'function'){
        window.closeModalAnimated(modal);
      } else {
        modal.hidden = true;
      }
      this.editingLessonId = null;
    },

    updateEditorTelemetry: function(){
      const textContent = document.getElementById('clTextContent');
      const selectLayout = document.getElementById('clSelectLayout');
      const text = textContent ? textContent.value : '';
      const layout = selectLayout ? selectLayout.value : 'standard';

      const metrics = this.tools.calcMetrics(text, layout);
      const isKm = document.documentElement.classList.contains('site-km-mode');

      const charVal = document.getElementById('clCountChars');
      const unitVal = document.getElementById('clCountUnits');
      const wordVal = document.getElementById('clCountWords');
      const timeVal = document.getElementById('clCountTime');

      if(charVal) charVal.textContent = String(metrics.chars);
      if(unitVal) unitVal.textContent = String(metrics.units);
      if(wordVal) wordVal.textContent = String(metrics.words);
      if(timeVal) timeVal.textContent = '~' + metrics.estSec + (isKm ? 'វ' : 's');
    },

    saveFromEditor: function(andPractice = false){
      const inputTitle = document.getElementById('clInputTitle');
      const inputDesc = document.getElementById('clInputDesc');
      const selectDiff = document.getElementById('clSelectDiff');
      const selectLayout = document.getElementById('clSelectLayout');
      const textContent = document.getElementById('clTextContent');
      const errBox = document.getElementById('clEditorErrors');

      const lessonData = {
        title: inputTitle ? inputTitle.value : '',
        description: inputDesc ? inputDesc.value : '',
        difficulty: selectDiff ? selectDiff.value : 'beginner',
        targetLayout: selectLayout ? selectLayout.value : 'standard',
        content: textContent ? textContent.value : ''
      };

      const val = this.validate(lessonData);
      if(!val.valid){
        if(errBox){
          errBox.textContent = val.errors.join(' ');
          errBox.hidden = false;
        }
        return null;
      }

      if(errBox){
        errBox.textContent = '';
        errBox.hidden = true;
      }

      let savedLesson = null;
      if(this.editingLessonId){
        savedLesson = this.update(this.editingLessonId, lessonData);
      } else {
        savedLesson = this.create(lessonData);
      }

      this.closeEditor();
      this.renderHub();

      if(andPractice && savedLesson){
        this.startPractice(savedLesson.id);
      } else {
        if(typeof showToast === 'function'){
          const isKm = document.documentElement.classList.contains('site-km-mode');
          showToast(
            pkIcon('check', 16),
            isKm ? 'បានរក្សាទុក' : 'Lesson Saved',
            isKm ? `មេរៀន "${savedLesson.title}" ត្រូវបានរក្សាទុកដោយជោគជ័យ។` : `"${savedLesson.title}" saved successfully.`
          );
        }
      }

      return savedLesson;
    },

    openConfirmModal: function(options){
      const modal = document.getElementById('customLessonConfirmModal');
      if(!modal) return;

      const titleEl = document.getElementById('clConfirmTitle');
      const descEl = document.getElementById('clConfirmDesc');
      const confirmBtn = document.getElementById('clConfirmSubmitBtn');

      if(titleEl) titleEl.textContent = options.title || 'Are you sure?';
      if(descEl) descEl.textContent = options.description || '';

      if(confirmBtn){
        confirmBtn.className = options.danger ? 'auth-submit-btn danger' : 'auth-submit-btn';
        confirmBtn.textContent = options.confirmText || 'Confirm';
        confirmBtn.onclick = () => {
          this.closeConfirmModal();
          if(typeof options.onConfirm === 'function') options.onConfirm();
        };
      }

      modal.hidden = false;
      if(confirmBtn) confirmBtn.focus();
    },

    closeConfirmModal: function(){
      const modal = document.getElementById('customLessonConfirmModal');
      if(!modal) return;
      if(typeof window.closeModalAnimated === 'function'){
        window.closeModalAnimated(modal);
      } else {
        modal.hidden = true;
      }
    },

    /* Wire all event handlers on initialization */
    initUI: function(){
      // Lesson Strip open button
      const openBtn = document.getElementById('lshCustomLessonsBtn');
      if(openBtn){
        openBtn.addEventListener('click', () => {
          this.openHub();
        });
      }

      // Hub Close button
      const hubCloseBtn = document.getElementById('clHubCloseBtn');
      if(hubCloseBtn){
        hubCloseBtn.addEventListener('click', () => {
          this.closeHub();
        });
      }

      // Hub backdrop click dismissal
      const hubModal = document.getElementById('customLessonsModal');
      if(hubModal){
        hubModal.addEventListener('click', (e) => {
          if(e.target === hubModal) this.closeHub();
        });
      }

      // Hub New Lesson button
      const hubNewBtn = document.getElementById('clHubNewBtn');
      if(hubNewBtn){
        hubNewBtn.addEventListener('click', () => {
          this.openEditor(null);
        });
      }

      // Empty State Create button
      const emptyCreateBtn = document.getElementById('clEmptyCreateBtn');
      if(emptyCreateBtn){
        emptyCreateBtn.addEventListener('click', () => {
          this.openEditor(null);
        });
      }

      // Hub Filter Pills
      const filterPills = document.querySelectorAll('.cl-filter-pill');
      filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
          filterPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.activeFilter = pill.getAttribute('data-filter') || 'all';
          this.renderHub();
        });
      });

      // Hub Search input
      const searchInput = document.getElementById('clSearchInput');
      if(searchInput){
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = (e.target.value || '').trim();
          this.renderHub();
        });
      }

      // Card actions event delegation
      const listEl = document.getElementById('clLessonList');
      if(listEl){
        listEl.addEventListener('click', (e) => {
          const btn = e.target.closest('button[data-action]');
          if(!btn) return;
          const card = btn.closest('.cl-card');
          if(!card) return;
          const id = card.getAttribute('data-id');
          if(!id) return;

          const action = btn.getAttribute('data-action');
          const isKm = document.documentElement.classList.contains('site-km-mode');
          const targetLesson = this.get(id);

          if(action === 'practice'){
            this.startPractice(id);
          } else if(action === 'edit'){
            this.openEditor(id);
          } else if(action === 'duplicate'){
            this.duplicate(id);
            this.renderHub();
            if(typeof showToast === 'function'){
              showToast(pkIcon('copy', 16), isKm ? 'បានចម្លង' : 'Duplicated', isKm ? 'បានបង្កើតច្បាប់ចម្លងនៃមេរៀន។' : 'Created a duplicate lesson.');
            }
          } else if(action === 'move-up'){
            this.reorder(id, 'up');
            this.renderHub();
          } else if(action === 'move-down'){
            this.reorder(id, 'down');
            this.renderHub();
          } else if(action === 'reset-progress'){
            this.openConfirmModal({
              title: isKm ? 'កំណត់ស្ថិតិឡើងវិញ?' : 'Reset Practice Stats?',
              description: isKm
                ? `តើអ្នកប្រាកដជាចង់កំណត់ស្ថិតិនៃ "${targetLesson?.title}" ឡើងវិញទេ? ខ្លឹមសារមេរៀននឹងមិនបាត់បង់ឡើយ។`
                : `Are you sure you want to reset stats for "${targetLesson?.title}"? Lesson content will not be deleted.`,
              confirmText: isKm ? 'កំណត់ឡើងវិញ' : 'Reset Stats',
              danger: false,
              onConfirm: () => {
                this.resetProgress(id);
                this.renderHub();
                if(typeof showToast === 'function'){
                  showToast(pkIcon('reset', 16), isKm ? 'បានកំណត់ឡើងវិញ' : 'Stats Reset', isKm ? 'ស្ថិតិមេរៀនត្រូវបានកំណត់ឡើងវិញ។' : 'Practice stats were reset.');
                }
              }
            });
          } else if(action === 'delete'){
            this.openConfirmModal({
              title: isKm ? 'លុបមេរៀននេះ?' : 'Delete Custom Lesson?',
              description: isKm
                ? `តើអ្នកប្រាកដជាចង់លុបមេរៀន "${targetLesson?.title}" ទេ? សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយបានឡើយ។`
                : `Are you sure you want to delete "${targetLesson?.title}"? This action cannot be undone.`,
              confirmText: isKm ? 'លុបចេញ' : 'Delete Lesson',
              danger: true,
              onConfirm: () => {
                this.delete(id);
                this.renderHub();
                if(typeof showToast === 'function'){
                  showToast(pkIcon('trash', 16), isKm ? 'បានលុប' : 'Deleted', isKm ? 'មេរៀនត្រូវបានលុបចេញ។' : 'Custom lesson was deleted.');
                }
              }
            });
          }
        });
      }

      // Editor Close button
      const editorCloseBtn = document.getElementById('clEditorCloseBtn');
      if(editorCloseBtn){
        editorCloseBtn.addEventListener('click', () => {
          this.closeEditor();
        });
      }

      const editorCancelBtn = document.getElementById('clEditorCancelBtn');
      if(editorCancelBtn){
        editorCancelBtn.addEventListener('click', () => {
          this.closeEditor();
        });
      }

      // Editor backdrop click dismissal
      const editorModal = document.getElementById('customLessonEditorModal');
      if(editorModal){
        editorModal.addEventListener('click', (e) => {
          if(e.target === editorModal) this.closeEditor();
        });
      }

      // Editor Save button
      const editorSaveBtn = document.getElementById('clEditorSaveBtn');
      if(editorSaveBtn){
        editorSaveBtn.addEventListener('click', () => {
          this.saveFromEditor(false);
        });
      }

      // Editor Save & Practice button
      const editorSavePracticeBtn = document.getElementById('clEditorSavePracticeBtn');
      if(editorSavePracticeBtn){
        editorSavePracticeBtn.addEventListener('click', () => {
          this.saveFromEditor(true);
        });
      }

      // Editor Content input telemetry listener
      const textContent = document.getElementById('clTextContent');
      if(textContent){
        textContent.addEventListener('input', () => {
          this.updateEditorTelemetry();
        });
      }

      const selectLayout = document.getElementById('clSelectLayout');
      if(selectLayout){
        selectLayout.addEventListener('change', () => {
          this.updateEditorTelemetry();
        });
      }

      // Crafting Starter Template Chips
      const templateHost = document.getElementById('clStarterChipsBar');
      if(templateHost){
        templateHost.innerHTML = STARTER_TEMPLATES.map(tpl => {
          return `
            <button type="button" class="cl-starter-chip" data-template-id="${escapeHtml(tpl.id)}" title="${escapeHtml(tpl.descEn)}">
              <svg class="pk-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span class="i18n-t" data-en="${escapeHtml(tpl.titleEn)}" data-km="${escapeHtml(tpl.titleKm)}">${escapeHtml(tpl.titleEn)}</span>
            </button>
          `;
        }).join('');

        templateHost.addEventListener('click', (e) => {
          const chip = e.target.closest('.cl-starter-chip');
          if(!chip) return;
          const tplId = chip.getAttribute('data-template-id');
          const tpl = STARTER_TEMPLATES.find(t => t.id === tplId);
          if(!tpl) return;

          const inputTitle = document.getElementById('clInputTitle');
          const inputDesc = document.getElementById('clInputDesc');
          const selectDiff = document.getElementById('clSelectDiff');
          const selectLayout = document.getElementById('clSelectLayout');
          const textContent = document.getElementById('clTextContent');
          const isKm = document.documentElement.classList.contains('site-km-mode');

          if(inputTitle && (!inputTitle.value || !inputTitle.value.trim())){
            inputTitle.value = isKm ? tpl.titleKm : tpl.titleEn;
          }
          if(inputDesc && (!inputDesc.value || !inputDesc.value.trim())){
            inputDesc.value = isKm ? tpl.descKm : tpl.descEn;
          }
          if(selectDiff) selectDiff.value = tpl.difficulty;
          if(selectLayout) selectLayout.value = tpl.targetLayout;

          if(textContent){
            if(!textContent.value.trim()){
              textContent.value = tpl.content;
            } else {
              textContent.value = (textContent.value.trim() + ' ' + tpl.content).trim();
            }
          }

          this.updateEditorTelemetry();
        });
      }

      // Quick Text Tools buttons
      const toolRepeat2x = document.getElementById('clToolRepeat2x');
      if(toolRepeat2x){
        toolRepeat2x.addEventListener('click', () => {
          if(!textContent) return;
          textContent.value = this.tools.repeat(textContent.value, 2);
          this.updateEditorTelemetry();
        });
      }

      const toolRepeat3x = document.getElementById('clToolRepeat3x');
      if(toolRepeat3x){
        toolRepeat3x.addEventListener('click', () => {
          if(!textContent) return;
          textContent.value = this.tools.repeat(textContent.value, 3);
          this.updateEditorTelemetry();
        });
      }

      const toolShuffle = document.getElementById('clToolShuffle');
      if(toolShuffle){
        toolShuffle.addEventListener('click', () => {
          if(!textContent) return;
          textContent.value = this.tools.shuffleWords(textContent.value);
          this.updateEditorTelemetry();
        });
      }

      const toolAddSpaces = document.getElementById('clToolAddSpaces');
      if(toolAddSpaces){
        toolAddSpaces.addEventListener('click', () => {
          if(!textContent) return;
          textContent.value = this.tools.addSpaces(textContent.value);
          this.updateEditorTelemetry();
        });
      }

      const toolCleanSpaces = document.getElementById('clToolCleanSpaces');
      if(toolCleanSpaces){
        toolCleanSpaces.addEventListener('click', () => {
          if(!textContent) return;
          textContent.value = this.tools.cleanSpaces(textContent.value);
          this.updateEditorTelemetry();
        });
      }

      // Confirm Modal Close & Cancel
      const confirmCloseBtn = document.getElementById('clConfirmCloseBtn');
      if(confirmCloseBtn){
        confirmCloseBtn.addEventListener('click', () => {
          this.closeConfirmModal();
        });
      }
      const confirmCancelBtn = document.getElementById('clConfirmCancelBtn');
      if(confirmCancelBtn){
        confirmCancelBtn.addEventListener('click', () => {
          this.closeConfirmModal();
        });
      }

      // Global Escape key support for custom modals
      window.addEventListener('keydown', (e) => {
        if(e.key === 'Escape'){
          const confirmModal = document.getElementById('customLessonConfirmModal');
          if(confirmModal && !confirmModal.hidden){
            e.preventDefault();
            this.closeConfirmModal();
            return;
          }
          const editorModal = document.getElementById('customLessonEditorModal');
          if(editorModal && !editorModal.hidden){
            e.preventDefault();
            this.closeEditor();
            return;
          }
          const hubModal = document.getElementById('customLessonsModal');
          if(hubModal && !hubModal.hidden){
            e.preventDefault();
            this.closeHub();
            return;
          }
        }
      });
    }
  };

  // Expose to window and global scope
  window.PK_CUSTOM_LESSONS = PK_CUSTOM_LESSONS;

  // Auto-init UI when DOM is ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', () => {
      PK_CUSTOM_LESSONS.initUI();
    });
  } else {
    PK_CUSTOM_LESSONS.initUI();
  }

})(typeof window !== 'undefined' ? window : this, typeof document !== 'undefined' ? document : {});
