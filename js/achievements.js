/* ============================================================
   PK Khmer Type — Achievements & Personal Milestones Engine
   ============================================================
   Zero-dependency, offline-first personal milestone system.
   Awards achievements based on genuine progress telemetry.
   Deduplicated, timestamped, persisted in localStorage.
   Strict Zero-Emoji Policy: 100% inline SVG vector geometry.
   ============================================================ */

(function(global){
  'use strict';

  const STORAGE_KEY = 'pk_achievements_v1';

  const MILESTONES = [
    {
      id: 'first_step',
      icon: 'check',
      titleEn: 'First Step',
      titleKm: 'ជំហានដំបូង',
      descEn: 'Complete your first typing lesson.',
      descKm: 'បញ្ចប់មេរៀនវាយអក្សរដំបូងរបស់អ្នក។',
      tier: 'bronze'
    },
    {
      id: 'flawless_scribe',
      icon: 'shield',
      titleEn: 'Flawless Scribe',
      titleKm: 'អ្នកចម្លងឥតខ្ចោះ',
      descEn: 'Achieve 100% accuracy on any lesson or typing test.',
      descKm: 'ទទួលបានសុក្រឹតភាព ១០០% លើមេរៀន ឬការធ្វើតេស្តណាមួយ។',
      tier: 'gold'
    },
    {
      id: 'dedicated_student',
      icon: 'scroll',
      titleEn: 'Dedicated Student',
      titleKm: 'សិស្សព្យាយាម',
      descEn: 'Complete 5 curriculum lessons.',
      descKm: 'បញ្ចប់មេរៀនចំនួន ៥ ក្នុងកម្មវិធីសិក្សា។',
      tier: 'bronze'
    },
    {
      id: 'steady_hands',
      icon: 'target',
      titleEn: 'Steady Hands',
      titleKm: 'ដៃនឹងធ្លឹង',
      descEn: 'Complete 10 curriculum lessons.',
      descKm: 'បញ្ចប់មេរៀនចំនួន ១០ ក្នុងកម្មវិធីសិក្សា។',
      tier: 'silver'
    },
    {
      id: 'tested_scribe',
      icon: 'zap',
      titleEn: 'Tested Scribe',
      titleKm: 'អ្នកវាយអក្សរឆ្លងកាត់តេស្ត',
      descEn: 'Complete an official assessment in the Typing Test Lab.',
      descKm: 'បញ្ចប់ការធ្វើតេស្តផ្លូវការក្នុងបន្ទប់ពិសោធន៍តេស្ត។',
      tier: 'bronze'
    },
    {
      id: 'speed_standard_25',
      icon: 'flag',
      titleEn: 'Angkor Flow',
      titleKm: 'ចង្វាក់អង្គរ',
      descEn: 'Reach 25+ WPM on the Khmer Standard layout.',
      descKm: 'ឈានដល់ល្បឿន ២៥+ WPM លើប្លង់ខ្មែរស្តង់ដារ។',
      tier: 'silver'
    },
    {
      id: 'speed_nida_25',
      icon: 'flag',
      titleEn: 'NiDA Flow',
      titleKm: 'ចង្វាក់និដា',
      descEn: 'Reach 25+ WPM on the Khmer NiDA layout.',
      descKm: 'ឈានដល់ល្បឿន ២៥+ WPM លើប្លង់ខ្មែរនិដា។',
      tier: 'silver'
    },
    {
      id: 'speed_english_40',
      icon: 'flag',
      titleEn: 'Swift QWERTY',
      titleKm: 'ល្បឿន QWERTY',
      descEn: 'Reach 40+ WPM on the English US layout.',
      descKm: 'ឈានដល់ល្បឿន ៤០+ WPM លើប្លង់ English (US)។',
      tier: 'silver'
    },
    {
      id: 'precision_master',
      icon: 'award',
      titleEn: 'Precision Master',
      titleKm: 'កំពូលអ្នកសុក្រឹត',
      descEn: 'Maintain 95%+ accuracy across 5 separate practice sessions.',
      descKm: 'រក្សាសុក្រឹតភាព ៩៥%+ ជាប់គ្នា ៥ វគ្គ។',
      tier: 'gold'
    },
    {
      id: 'stage_champion',
      icon: 'star',
      titleEn: 'Stage Champion',
      titleKm: 'ជើងឯកដំណាក់កាល',
      descEn: 'Complete all lessons within any curriculum stage.',
      descKm: 'បញ្ចប់មេរៀនទាំងអស់ក្នុងដំណាក់កាលសិក្សាណាមួយ។',
      tier: 'gold'
    },
    {
      id: 'weakness_conqueror',
      icon: 'sparkles',
      titleEn: 'Weakness Overcome',
      titleKm: 'ជ័យជម្នះលើចំណុចខ្សោយ',
      descEn: 'Raise a struggling key from below 80% to 92%+ in Adaptive Practice.',
      descKm: 'បង្កើនសុក្រឹតភាពលើគ្រាប់ចុចខ្សោយពីក្រោម ៨០% ដល់ ៩២%+។',
      tier: 'silver'
    },
    {
      id: 'curriculum_crafter',
      icon: 'edit',
      titleEn: 'Curriculum Crafter',
      titleKm: 'អ្នករៀបចំមេរៀន',
      descEn: 'Create and practice a custom typing lesson in the Studio.',
      descKm: 'បង្កើត និងហ្វឹកហាត់មេរៀនផ្ទាល់ខ្លួនក្នុងស្ទូឌីយោ។',
      tier: 'bronze'
    }
  ];

  /* Local State */
  let unlocked = {}; // id -> { unlockedAt: ISOString, metadata: {} }

  function loadState(){
    try {
      if(typeof localStorage === 'undefined') return;
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw){
        const parsed = JSON.parse(raw);
        if(parsed && typeof parsed === 'object'){
          delete parsed.__proto__;
          delete parsed.constructor;
          delete parsed.prototype;
          unlocked = parsed;
        }
      }
    } catch(_e){
      unlocked = {};
    }
  }

  function saveState(){
    try {
      if(typeof localStorage === 'undefined') return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
    } catch(_e){}
  }

  loadState();

  /* Award an achievement if not already earned */
  function award(id, meta = {}){
    if(unlocked[id]) return false; // Already unlocked

    const def = MILESTONES.find(m => m.id === id);
    if(!def) return false;

    unlocked[id] = {
      id: id,
      unlockedAt: new Date().toISOString(),
      meta: meta
    };
    saveState();

    // Trigger non-intrusive toast notification if UI available
    if(typeof global.showToast === 'function'){
      const isKm = typeof document !== 'undefined' && document.documentElement && document.documentElement.classList.contains('site-km-mode');
      const title = isKm ? `សមិទ្ធផល៖ ${def.titleKm}` : `Milestone: ${def.titleEn}`;
      const desc = isKm ? def.descKm : def.descEn;
      const iconSvg = typeof global.pkIcon === 'function' ? global.pkIcon(def.icon, 18) : null;
      global.showToast(iconSvg, title, desc);
    }

    return true;
  }

  /* Check achievements against a telemetry event */
  function check(event = {}){
    const newlyAwarded = [];

    // 1. First Lesson Completed & Lesson Counts
    if(event.type === 'lesson_completed'){
      if(award('first_step', { lessonId: event.lessonId })){
        newlyAwarded.push('first_step');
      }

      // Check total completed lessons across layouts
      let totalCompleted = 0;
      if(global.PK_PROGRESS && typeof global.PK_PROGRESS.getLearnerSummary === 'function'){
        ['standard', 'nida', 'english'].forEach(l => {
          const s = global.PK_PROGRESS.getLearnerSummary(l);
          if(s && s.lessons) totalCompleted += (s.lessons.completed || 0);
        });
      }
      if(totalCompleted >= 5 && award('dedicated_student', { totalCompleted })){
        newlyAwarded.push('dedicated_student');
      }
      if(totalCompleted >= 10 && award('steady_hands', { totalCompleted })){
        newlyAwarded.push('steady_hands');
      }

      // Check stage completion
      if(event.stageCompleted && award('stage_champion', { stageId: event.stageId })){
        newlyAwarded.push('stage_champion');
      }
    }

    // 2. Accuracy Milestones (100% accuracy)
    if(event.accuracy === 100 && (event.type === 'lesson_completed' || event.type === 'test_completed')){
      if(award('flawless_scribe', { mode: event.type, wpm: event.wpm })){
        newlyAwarded.push('flawless_scribe');
      }
    }

    // 3. Precision Master: 5 separate sessions >= 95% accuracy
    if(event.accuracy >= 95){
      let count = 0;
      try {
        count = parseInt(localStorage.getItem('pk_high_acc_session_count') || '0', 10) + 1;
        localStorage.setItem('pk_high_acc_session_count', String(count));
      } catch(_e){}
      if(count >= 5 && award('precision_master', { sessionCount: count })){
        newlyAwarded.push('precision_master');
      }
    }

    // 4. Typing Test Lab Assessment Completed
    if(event.type === 'test_completed'){
      if(award('tested_scribe', { testType: event.testType, wpm: event.wpm })){
        newlyAwarded.push('tested_scribe');
      }
    }

    // 5. Layout Speed Milestones
    if(typeof event.wpm === 'number'){
      const l = event.layoutId ? String(event.layoutId).toLowerCase() : '';
      if(l.includes('std') || l.includes('standard')){
        if(event.wpm >= 25 && award('speed_standard_25', { wpm: event.wpm })){
          newlyAwarded.push('speed_standard_25');
        }
      } else if(l.includes('nida')){
        if(event.wpm >= 25 && award('speed_nida_25', { wpm: event.wpm })){
          newlyAwarded.push('speed_nida_25');
        }
      } else if(l.includes('eng')){
        if(event.wpm >= 40 && award('speed_english_40', { wpm: event.wpm })){
          newlyAwarded.push('speed_english_40');
        }
      }
    }

    // 6. Weakness Overcome in Adaptive
    if(event.type === 'weakness_conquered'){
      if(award('weakness_conqueror', { unit: event.unit, newAccuracy: event.accuracy })){
        newlyAwarded.push('weakness_conqueror');
      }
    }

    // 7. Custom Lesson Practiced
    if(event.type === 'custom_lesson_practiced'){
      if(award('curriculum_crafter', { lessonId: event.lessonId })){
        newlyAwarded.push('curriculum_crafter');
      }
    }

    return newlyAwarded;
  }

  /* Query all achievements with live status */
  function getAll(){
    return MILESTONES.map(m => {
      const u = unlocked[m.id];
      return Object.assign({}, m, {
        isUnlocked: Boolean(u),
        unlockedAt: u ? u.unlockedAt : null
      });
    });
  }

  function getUnlockedCount(){
    return Object.keys(unlocked).length;
  }

  function isUnlocked(id){
    return Boolean(unlocked[id]);
  }

  function exportData(){
    return JSON.parse(JSON.stringify(unlocked));
  }

  function importData(data){
    if(!data || typeof data !== 'object') return false;
    delete data.__proto__;
    delete data.constructor;
    delete data.prototype;
    unlocked = Object.assign({}, unlocked, data);
    saveState();
    return true;
  }

  function reset(){
    unlocked = {};
    saveState();
    try {
      localStorage.removeItem('pk_high_acc_session_count');
    } catch(_e){}
  }

  const api = {
    MILESTONES,
    check,
    award,
    getAll,
    getUnlockedCount,
    isUnlocked,
    exportData,
    importData,
    reset,
    reload: loadState
  };

  if(typeof module !== 'undefined' && module.exports){
    module.exports = api;
  }
  global.PK_ACHIEVEMENTS = api;

})(typeof window !== 'undefined' ? window : global);
