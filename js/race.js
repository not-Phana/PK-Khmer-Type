/* ============================================================
   PK Khmer Type — Temple Trial & Typing Race Modes
   ============================================================ */

/* ---------- temple trial ---------- */
var WORD_BANK = window.WORD_BANK || ['អាវ','តា','យាយ','មាន','ខាន','បាន','ចាន','តារា','កាច'];
/* English word pool, used in place of WORD_BANK whenever the English
   (US) layout is selected — Temple Trial and the Typing Race should
   drill the language that's actually on the keys, not always Khmer. */
var WORD_BANK_EN = window.WORD_BANK_EN || ['cat','dog','sun','run','desk','lamp','fish','bird','tree','king','fast','slow','jump','walk','hand','word','type','game','song','play'];
function currentWordBank(){
  return currentLayoutId === 'english' ? WORD_BANK_EN : WORD_BANK;
}
let trialActive = false;
let trialWordChars = [];
let trialIndex = 0;
let streak = 0;
let best = 0;
try{ best = parseInt(localStorage.getItem('khmerTrialBest') || '0', 10) || 0; }catch(e){}

const trialPanel = document.getElementById('trialPanel');
const trialWordEl = document.getElementById('trialWord');
const streakValEl = document.getElementById('streakVal');
const bestValEl = document.getElementById('bestVal');
const trialToggle = document.getElementById('trialToggle');

function updateStatsDisplay(){
  streakValEl.textContent = streak;
  bestValEl.textContent = best;
  boardWrap.classList.remove('heat-1','heat-2','heat-3');
  if(streak >= 10) boardWrap.classList.add('heat-3');
  else if(streak >= 6) boardWrap.classList.add('heat-2');
  else if(streak >= 3) boardWrap.classList.add('heat-1');
}

function pickWord(){
  const bank = currentWordBank();
  const prev = trialWordChars.join('');
  let w;
  do{ w = bank[Math.floor(Math.random()*bank.length)]; } while(bank.length > 1 && w === prev);
  return w;
}

function renderTrialWord(){
  trialWordEl.innerHTML = '';
  trialWordChars.forEach((ch,i)=>{
    const s = document.createElement('span');
    s.className = 'tw-char' + (i < trialIndex ? ' done' : (i === trialIndex ? ' current' : ''));
    s.textContent = ch;
    trialWordEl.appendChild(s);
  });
}

function newTrialWord(){
  trialWordChars = Array.from(pickWord());
  trialIndex = 0;
  renderTrialWord();
}

function startTrial(){
  if(typeof lessonActive !== 'undefined' && lessonActive) exitLesson();
  if(typeof raceMode !== 'undefined' && raceMode) exitRaceMode();
  if(typeof window !== 'undefined' && window.adaptiveActive && typeof PK_ADAPTIVE !== 'undefined' && typeof PK_ADAPTIVE.exitSession === 'function'){
    PK_ADAPTIVE.exitSession(false);
  }
  trialActive = true;
  trialPanel.hidden = false;
  boardWrap.classList.add('trial-active');
  trialToggle.classList.add('on');
  clearText();
  newTrialWord();
  updateStatsDisplay();
}
function stopTrial(){
  trialActive = false;
  trialPanel.hidden = true;
  boardWrap.classList.remove('trial-active');
  trialToggle.classList.remove('on');
}
trialToggle.addEventListener('click', ()=>{
  if(trialActive) stopTrial(); else startTrial();
});

function celebrateWord(){
  const rect = boardWrap.getBoundingClientRect();
  const bursts = streak >= 10 ? 7 : (streak >= 6 ? 6 : 4);
  const color = heatColor();
  for(let i=0;i<bursts;i++){
    setTimeout(()=> emberBurst(boardWrap, {
      clientX: rect.left + rect.width*(0.25 + Math.random()*0.5),
      clientY: rect.top + rect.height*(0.3 + Math.random()*0.3)
    }, 10, color), i*80);
  }
  playChime();
}


function trialHandleChar(val, el){
  if(!trialActive || !val) return;
  const expected = trialWordChars[trialIndex];
  const isMatch = (typeof compareTypingSequence === 'function')
    ? compareTypingSequence(val, expected)
    : (val === expected);
  if(isMatch){
    insertText(val);
    recordKeystroke(true);
    trialIndex++;
    if(el){ el.classList.add('correct'); setTimeout(()=> el.classList.remove('correct'), 260); }
    emberBurst(el, null, 6, heatColor());
    runeRing(el);
    renderTrialWord();
    if(trialIndex >= trialWordChars.length){
      streak++;
      let isNewBest = false;
      if(streak > best){
        best = streak;
        isNewBest = true;
        try{ localStorage.setItem('khmerTrialBest', String(best)); }catch(e){}
      }
      updateStatsDisplay();
      checkStreakAchievement(streak);
      celebrateWord();
      if(streak > 0 && streak % 5 === 0 && typeof streakCelebrationBurst === 'function'){
        streakCelebrationBurst(streak >= 10 ? 36 : 22, el);
      }
      if(isNewBest && streak > 1) triggerRecordCelebration();
      setTimeout(()=>{ clearText(); newTrialWord(); }, 950);
    }
  } else {
    streak = 0;
    recordKeystroke(false);
    updateStatsDisplay();
    if(el){ el.classList.add('wrong'); setTimeout(()=> el.classList.remove('wrong'), 300); }
    const cur = trialWordEl.querySelector('.tw-char.current');
    if(cur){ cur.classList.add('shake'); setTimeout(()=> cur.classList.remove('shake'), 300); }
  }
}

/* ---------- lesson course generator ----------
   Everything below reads characters straight from the standard-layout
   KEY() definitions above (ROW1..ROW5) — the single source of truth for
   the keyboard mapping. No Khmer glyphs are invented here; we only decide
   *which keys*, in *what order*, and *how many at once* to teach. */


const RACE_DIFFICULTIES = ['easy','medium','hard','expert','nightmare'];
const RACE_LENGTHS = ['15','30','60','text'];

const racePanel = document.getElementById('racePanel');
const raceSetupEl = document.getElementById('raceSetup');
const raceLiveEl = document.getElementById('raceLive');
const raceToggle = document.getElementById('raceToggle');
const raceDifficultyRow = document.getElementById('raceDifficultyRow');
const raceLengthRow = document.getElementById('raceLengthRow');
const raceSetupBestEl = document.getElementById('raceSetupBest');
const raceStartBtn = document.getElementById('raceStartBtn');
const raceDifficultyLabelEl = document.getElementById('raceDifficultyLabel');
const raceWpmValEl = document.getElementById('raceWpmVal');
const raceAccValEl = document.getElementById('raceAccVal');
const raceTimeValEl = document.getElementById('raceTimeVal');
const raceMistakesValEl = document.getElementById('raceMistakesVal');
const raceTrackFillEl = document.getElementById('raceTrackFill');
const raceTrackPctEl = document.getElementById('raceTrackPct');
const raceTrackAiFillEl = document.getElementById('raceTrackAiFill');
const raceTrackAiPctEl = document.getElementById('raceTrackAiPct');
const raceAiRacerNameEl = document.getElementById('raceAiRacerName');
const racePlayerTagLabelEl = document.getElementById('racePlayerTagLabel');
const raceAiOpponentRow = document.getElementById('raceAiOpponentRow');
const raceTextEl = document.getElementById('raceText');
const raceCountdownEl = document.getElementById('raceCountdown');
const raceExitLiveBtn = document.getElementById('raceExitLiveBtn');
const raceNameInput = document.getElementById('raceNameInput');
const raceLeaderboardBtn = document.getElementById('raceLeaderboardBtn');
const raceLeaderboardBackBtn = document.getElementById('raceLeaderboardBackBtn');
const raceLeaderboardPanel = document.getElementById('raceLeaderboardPanel');
const raceLbDifficultyTabs = document.getElementById('raceLbDifficultyTabs');
const raceLbLengthTabs = document.getElementById('raceLbLengthTabs');
const raceLbList = document.getElementById('raceLbList');

let raceMode = false;          // true whenever the race panel is open (setup or live)
let raceActive = false;        // true only during live typing (countdown finished, not yet complete)
let raceCountingDown = false;
let raceDifficulty = 'easy';
let raceLength = '30';
let raceAiBotChoice = 'auto';  // 'auto' | 'easy' | 'medium' | 'hard' | 'expert' | 'nightmare'
let currentAiBot = null;
let aiTargetWpm = 30;
let aiCharsTyped = 0;
let aiFinished = false;
let aiFinishTime = 0;
let aiKeyTimestamps = [];

const AI_BOTS = {
  easy: {
    key: 'easy',
    name: 'Scribe Bot',
    nameKm: 'រ៉ូបូតស្មៀន',
    title: 'Novice Scribe',
    baseWpm: 22,
    spread: 3,
    variance: 0.12,
    badgeColor: '#38bdf8'
  },
  medium: {
    key: 'medium',
    name: 'Angkor AI',
    nameKm: 'អង្គរ AI',
    title: 'Angkor Apprentice',
    baseWpm: 42,
    spread: 4,
    variance: 0.08,
    badgeColor: '#34d399'
  },
  hard: {
    key: 'hard',
    name: 'Preah Khan AI',
    nameKm: 'ព្រះខ័ន AI',
    title: 'Temple Guardian',
    baseWpm: 65,
    spread: 5,
    variance: 0.06,
    badgeColor: '#f59e0b'
  },
  expert: {
    key: 'expert',
    name: 'Naga Grandmaster',
    nameKm: 'មហាចារ្យនាគ',
    title: 'Naga Grandmaster',
    baseWpm: 88,
    spread: 6,
    variance: 0.04,
    badgeColor: '#a855f7'
  },
  nightmare: {
    key: 'nightmare',
    name: 'Cyber Garuda Titan',
    nameKm: 'គ្រុឌស៊ីប័រ',
    title: 'Cyber Garuda Titan',
    baseWpm: 115,
    spread: 8,
    variance: 0.03,
    badgeColor: '#f43f5e'
  },
  novice: {
    key: 'easy',
    name: 'Scribe Bot',
    nameKm: 'រ៉ូបូតស្មៀន',
    title: 'Novice Scribe',
    baseWpm: 22,
    spread: 3,
    variance: 0.12,
    badgeColor: '#38bdf8'
  },
  skilled: {
    key: 'medium',
    name: 'Angkor AI',
    nameKm: 'អង្គរ AI',
    title: 'Angkor Apprentice',
    baseWpm: 42,
    spread: 4,
    variance: 0.08,
    badgeColor: '#34d399'
  },
  master: {
    key: 'expert',
    name: 'Naga Grandmaster',
    nameKm: 'មហាចារ្យនាគ',
    title: 'Naga Grandmaster',
    baseWpm: 88,
    spread: 6,
    variance: 0.04,
    badgeColor: '#a855f7'
  }
};

function generateAiTimings(chars, targetWpm, varianceFactor){
  const totalChars = chars.length;
  if(!totalChars) return [];
  const charsPerSec = (targetWpm * 5) / 60;
  const avgSecPerChar = 1 / charsPerSec;
  const rawIntervals = [];

  for(let i = 0; i < totalChars; i++){
    const ch = chars[i];
    let interval = avgSecPerChar;
    // Word boundary pause (spaces take ~40% longer for humans)
    if(ch === ' '){
      interval *= 1.4;
    } else if(ch === '\u17D2' || ch === '​' || 'ឥឦឧឩឪឫឬឭឮឯឰឱឲឳ'.includes(ch)){
      interval *= 1.25;
    }
    const jitter = (Math.random() - 0.5) * 2 * (varianceFactor || 0.08);
    interval = Math.max(0.04, interval * (1 + jitter));
    rawIntervals.push(interval);
  }

  const targetTotalDuration = totalChars * avgSecPerChar;
  const currentTotal = rawIntervals.reduce((a, b) => a + b, 0);
  const scale = targetTotalDuration / Math.max(0.01, currentTotal);

  const timestamps = [];
  let cum = 0;
  for(let i = 0; i < totalChars; i++){
    cum += rawIntervals[i] * scale;
    timestamps.push(cum);
  }
  return timestamps;
}

let raceChars = [];            // characters to type, drawn from the same KEY_BY_ID/word data as lessons
let raceLayers = [];
let raceKeyIds = [];
let raceIndex = 0;
let raceMistakes = 0;
let raceCorrectTotal = 0;
let raceStartTime = 0;
let raceTimerId = null;
let raceCountdownTimer = null;
let raceTimeLimitId = null;
let raceLastStreakCorrect = 0;
let raceLbDifficulty = 'easy';
let raceLbLength = '30';


/* racer nickname — pre-filled from the site's local profile name (if set),
   overridable per race, remembered for next time */
function getRaceName(){
  let name = '';
  try{ name = (raceNameInput.value || '').trim(); }catch(e){}
  if(name) return name.slice(0, 18);
  try{
    const p = JSON.parse(localStorage.getItem('khmerProfile') || 'null');
    if(p && p.name) return String(p.name).trim().slice(0, 18);
  }catch(e){}
  try{
    const saved = localStorage.getItem('khmerRaceLastName');
    if(saved) return saved.slice(0, 18);
  }catch(e){}
  return 'Racer';
}
function initRaceNameInput(){
  let prefill = '';
  try{ prefill = localStorage.getItem('khmerRaceLastName') || ''; }catch(e){}
  if(!prefill){
    try{
      const p = JSON.parse(localStorage.getItem('khmerProfile') || 'null');
      if(p && p.name) prefill = p.name;
    }catch(e){}
  }
  raceNameInput.value = prefill;
}
function saveRaceName(name){
  try{ localStorage.setItem('khmerRaceLastName', name); }catch(e){}
}

/* leaderboard — stored per difficulty+length key, each entry keyed by
   nickname (case-insensitive), keeping every racer's own best score */
function raceLeaderboardKey(difficulty, length){
  const cap = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  return 'khmerRaceLeaderboard' + cap + (length === 'text' ? 'Text' : length);
}
function loadRaceLeaderboard(difficulty, length){
  try{
    const raw = localStorage.getItem(raceLeaderboardKey(difficulty, length));
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  }catch(e){ return []; }
}
function saveRaceLeaderboard(difficulty, length, list){
  try{ localStorage.setItem(raceLeaderboardKey(difficulty, length), JSON.stringify(list)); }catch(e){}
}
/* Records this run's score into the leaderboard for its difficulty+length.
   Each nickname keeps only their own best entry (case-insensitive match). */
function submitRaceToLeaderboard(name, difficulty, length, {wpm, accuracy, score}){
  const list = loadRaceLeaderboard(difficulty, length);
  const key = name.toLowerCase();
  const existingIdx = list.findIndex(e=> e.name.toLowerCase() === key);
  if(existingIdx === -1){
    list.push({name, wpm, accuracy, score});
  } else if(score > list[existingIdx].score){
    list[existingIdx] = {name, wpm, accuracy, score};
  }
  list.sort((a,b)=> b.score - a.score);
  saveRaceLeaderboard(difficulty, length, list.slice(0, 50));
}

function raceLengthLabel(length){
  return length === 'text' ? 'Full Text' : length + 's';
}

function renderRaceLeaderboard(){
  setRacePill(raceLbDifficultyTabs, 'lbDifficulty', raceLbDifficulty);
  setRacePill(raceLbLengthTabs, 'lbLength', raceLbLength);
  const list = loadRaceLeaderboard(raceLbDifficulty, raceLbLength);
  const isKm = typeof document !== 'undefined' && document.documentElement.classList.contains('site-km-mode');
  if(!list.length){
    const diffKm = { easy: 'ងាយស្រួល', medium: 'មធ្យម', hard: 'ពិបាក', expert: 'ជំនាញ', nightmare: 'ល្បឿនកំពូល' }[raceLbDifficulty] || raceLbDifficulty;
    const diffLabel = isKm ? diffKm : (raceLbDifficulty.charAt(0).toUpperCase() + raceLbDifficulty.slice(1));
    const emptyMsg = isKm
      ? `មិនទាន់មានអ្នកប្រណាំងសម្រាប់ ${diffLabel} · ${raceLengthLabel(raceLbLength)} នៅឡើយទេ។ ចាប់ផ្តើមមុនគេ!`
      : `No racers yet for ${diffLabel} · ${raceLengthLabel(raceLbLength)}. Be the first!`;
    raceLbList.innerHTML = `<li class="race-lb-empty">${emptyMsg}</li>`;
    return;
  }
  raceLbList.innerHTML = list.map((e,i)=>
    `<li class="race-lb-row${i===0 ? ' rank-1' : ''}" style="animation-delay:${i*35}ms">
      <span class="race-lb-rank">${i===0 ? pkIcon('crown', 14) : i===1 ? pkIcon('award', 14) : i===2 ? pkIcon('star', 14) : (i+1)}</span>
      <span class="race-lb-name">${escapeHtml(e.name)}</span>
      <span class="race-lb-score"><b>${e.score}</b> · ${e.wpm} WPM · ${e.accuracy}%</span>
    </li>`
  ).join('');
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, ch=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

raceLbDifficultyTabs.querySelectorAll('.race-pill').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    raceLbDifficulty = btn.dataset.lbDifficulty;
    renderRaceLeaderboard();
  });
});
raceLbLengthTabs.querySelectorAll('.race-pill').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    raceLbLength = btn.dataset.lbLength;
    renderRaceLeaderboard();
  });
});
raceLeaderboardBtn.addEventListener('click', ()=>{
  raceLbDifficulty = raceDifficulty;
  raceLbLength = raceLength === 'text' ? 'text' : raceLength;
  raceSetupEl.hidden = true;
  raceLeaderboardPanel.hidden = false;
  renderRaceLeaderboard();
});
raceLeaderboardBackBtn.addEventListener('click', ()=>{
  raceLeaderboardPanel.hidden = true;
  raceSetupEl.hidden = false;
});

function raceBestKey(difficulty, length){
  const cap = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  return 'khmerRaceBest' + cap + (length === 'text' ? 'Text' : length);
}
function getRaceBest(difficulty, length){
  try{
    const raw = localStorage.getItem(raceBestKey(difficulty, length));
    return raw ? JSON.parse(raw) : null;
  }catch(e){ return null; }
}
function saveRaceBest(difficulty, length, record){
  try{ localStorage.setItem(raceBestKey(difficulty, length), JSON.stringify(record)); }catch(e){}
}

/* Build a race text pool for a given difficulty from the same character
   data every lesson draws from (KEY_BY_ID via entriesFromIds), plus the
   shared WORD_BANK for word-based difficulties — no separate data source. */
function raceHomeRowIds(){
  return ['f','g','h','j','d','k','s','l','a','semicolon','quote'];
}
/* The key table + word bank the race pulls from depends entirely on
   the layout currently selected in the layout strip, so the Khmer
   Keyboard Layout, Khmer NiDA Keyboard, and English ⇄ Khmer each
   produce genuinely different race text — not the same Khmer
   paragraph rendered on three different key pictures. */
function raceKeyTable(){
  return (currentLayoutId==='nida') ? KEY_BY_ID_NIDA
    : (currentLayoutId==='english') ? KEY_BY_ID_EN
    : KEY_BY_ID;
}
function raceBuildEntries(difficulty){
  const home = raceHomeRowIds();
  const table = raceKeyTable();
  const bank = currentWordBank();
  if(difficulty === 'easy'){
    // short words + simple home-row characters
    const words = seqWords(bank.slice(0, Math.max(3, Math.ceil(bank.length/2))), table);
    return words.length ? words : seqRandom(entriesFromIds(home,'base',table), 20);
  }
  if(difficulty === 'medium'){
    const words = seqWords(bank, table);
    const extra = seqRandom(entriesFromIds(home,'base',table).concat(entriesFromIds(home,'shift',table)), 16);
    return words.concat(extra);
  }
  if(difficulty === 'hard'){
    const allBaseShift = Object.keys(table)
      .map(id=> [entriesFromIds([id],'base',table)[0], entriesFromIds([id],'shift',table)[0]])
      .flat().filter(Boolean);
    return seqWords(bank, table).concat(seqRandom(allBaseShift, 40));
  }
  if(difficulty === 'expert'){
    const allLayers = ['base','shift','ctrl','altgr'];
    const fullPool = [];
    Object.keys(table).forEach(id=>{
      allLayers.forEach(layer=>{
        const e = entriesFromIds([id], layer, table)[0];
        if(e) fullPool.push(e);
      });
    });
    return seqWords(bank, table).concat(seqRandom(fullPool, 60));
  }
  // nightmare — intense sprint across all layers with rich words
  const allLayers = ['base','shift','ctrl','altgr'];
  const fullPool = [];
  Object.keys(table).forEach(id=>{
    allLayers.forEach(layer=>{
      const e = entriesFromIds([id], layer, table)[0];
      if(e) fullPool.push(e);
    });
  });
  return seqWords(bank, table).concat(seqRandom(fullPool, 90));
}

function raceGenerateText(){
  const table = raceKeyTable();
  const entries = raceBuildEntries(raceDifficulty);
  const m = materialize(entries.length ? entries : seqRandom(entriesFromIds(raceHomeRowIds(),'base',table), 20));
  raceChars = m.chars;
  raceLayers = m.layers;
  raceKeyIds = m.keyIds;
}

function raceScore(wpm, accuracy, mistakes){
  // accuracy dominates: a fast, sloppy race must never outscore a
  // slightly slower, accurate one.
  const accFactor = Math.pow(accuracy/100, 2.2);
  const raw = wpm * accFactor - mistakes * 0.5;
  return Math.max(0, Math.round(raw));
}

function updateRaceSetupBest(){
  const isKm = typeof document !== 'undefined' && document.documentElement.classList.contains('site-km-mode');
  const rec = getRaceBest(raceDifficulty, raceLength);
  raceSetupBestEl.textContent = rec
    ? (isKm ? `ល្អបំផុត — WPM ${rec.wpm} · សុក្រឹតភាព ${rec.accuracy}% · ពិន្ទុ ${rec.score}` : `Best — WPM ${rec.wpm} · Accuracy ${rec.accuracy}% · Score ${rec.score}`)
    : (isKm ? 'មិនទាន់មានកំណត់ត្រាសម្រាប់កម្រិត និងប្រវែងនេះនៅឡើយទេ' : 'No record yet for this difficulty & length');
}

function setRacePill(row, attr, value){
  row.querySelectorAll('.race-pill').forEach(btn=>{
    const on = btn.dataset[attr] === value;
    btn.setAttribute('aria-checked', on ? 'true' : 'false');
  });
}

raceDifficultyRow.querySelectorAll('.race-pill').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    raceDifficulty = btn.dataset.difficulty;
    setRacePill(raceDifficultyRow, 'difficulty', raceDifficulty);
    updateRaceSetupBest();
  });
});
raceLengthRow.querySelectorAll('.race-pill').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    raceLength = btn.dataset.length;
    setRacePill(raceLengthRow, 'length', raceLength);
    updateRaceSetupBest();
  });
});
if(raceAiOpponentRow){
  raceAiOpponentRow.querySelectorAll('.race-pill').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      raceAiBotChoice = btn.dataset.aiBot;
      setRacePill(raceAiOpponentRow, 'aiBot', raceAiBotChoice);
    });
  });
}


function raceRenderText(){
  raceTextEl.innerHTML = '';
  raceChars.forEach((ch,i)=>{
    const s = document.createElement('span');
    s.className = 'race-char' + (i < raceIndex ? ' correct' : (i === raceIndex ? ' current' : ''));
    s.textContent = ch;
    raceTextEl.appendChild(s);
  });
}

let raceHighlightedModifierKeyId = null;
function raceUpdateKeyHighlight(){
  if(highlightedKeyId && keyEls[highlightedKeyId]){
    keyEls[highlightedKeyId].classList.remove('lesson-target');
  }
  if(raceHighlightedModifierKeyId && keyEls[raceHighlightedModifierKeyId]){
    keyEls[raceHighlightedModifierKeyId].classList.remove('modifier-target');
  }
  highlightedKeyId = null;
  raceHighlightedModifierKeyId = null;
  if(!raceActive || raceIndex >= raceKeyIds.length){ if(typeof setActiveFinger === 'function') setActiveFinger(null); return; }
  const id = raceKeyIds[raceIndex];
  const layer = raceLayers[raceIndex] || 'base';
  if(id && keyEls[id]){
    highlightedKeyId = id;
    keyEls[id].classList.add('lesson-target');
  }
  if(typeof modifierInfoFor === 'function'){
    const mod = modifierInfoFor(id, layer);
    if(mod && mod.targetKey && keyEls[mod.targetKey]){
      raceHighlightedModifierKeyId = mod.targetKey;
      keyEls[mod.targetKey].classList.add('modifier-target');
    }
  }
  if(typeof setActiveFinger === 'function') setActiveFinger(id, layer);
}
window.raceUpdateKeyHighlight = raceUpdateKeyHighlight;
window.updateRaceKeyHighlight = raceUpdateKeyHighlight;
window.highlightRaceTarget = raceUpdateKeyHighlight;

function raceElapsedSeconds(){
  if(!raceStartTime || !raceActive) return 0;
  return Math.max(0, (Date.now() - raceStartTime) / 1000);
}

function raceCurrentStats(){
  const attempts = raceCorrectTotal + raceMistakes;
  const accuracy = attempts > 0 ? Math.min(100, Math.max(0, Math.round((raceCorrectTotal/attempts)*100))) : 100;
  const minutes = Math.max(raceElapsedSeconds()/60, 1/600);
  const rawWpm = (raceCorrectTotal/5)/minutes;
  const wpm = (Number.isFinite(rawWpm) && rawWpm >= 0) ? Math.min(250, Math.max(0, Math.round(rawWpm))) : 0;
  return {accuracy, wpm};
}

function raceUpdateHud(){
  const {accuracy, wpm} = raceCurrentStats();
  raceWpmValEl.textContent = wpm;
  raceAccValEl.textContent = accuracy + '%';
  raceTimeValEl.textContent = raceElapsedSeconds().toFixed(1) + 's';
  raceMistakesValEl.textContent = raceMistakes;
  const pct = raceChars.length ? Math.min(100, Math.round((raceIndex/raceChars.length)*100)) : 0;
  raceTrackFillEl.style.width = pct + '%';
  raceTrackPctEl.textContent = pct + '%';
  raceTrackFillEl.classList.toggle('race-fast', wpm >= 40);

  // Compute and render AI opponent progress
  if(currentAiBot && raceChars.length){
    const elapsed = raceElapsedSeconds();
    if(aiKeyTimestamps && aiKeyTimestamps.length){
      let count = 0;
      while(count < aiKeyTimestamps.length && aiKeyTimestamps[count] <= elapsed){
        count++;
      }
      aiCharsTyped = Math.min(raceChars.length, count);
    } else {
      const aiCharsPerSec = (aiTargetWpm * 5) / 60;
      const cadence = 1 + 0.05 * Math.sin(elapsed * 1.8);
      aiCharsTyped = Math.min(raceChars.length, Math.floor(elapsed * aiCharsPerSec * cadence));
    }

    const aiPct = Math.min(100, Math.round((aiCharsTyped / raceChars.length) * 100));
    if(raceTrackAiFillEl){
      raceTrackAiFillEl.style.width = aiPct + '%';
      raceTrackAiFillEl.classList.toggle('race-fast', aiTargetWpm >= 45);
    }
    if(raceTrackAiPctEl){
      raceTrackAiPctEl.textContent = aiPct + '%';
    }
    if(aiPct >= 100 && !aiFinished){
      aiFinished = true;
      aiFinishTime = elapsed;
    }

    // Dynamic AI live name / WPM label
    if(raceAiRacerNameEl){
      const isKm = typeof document !== 'undefined' && document.documentElement.classList.contains('site-km-mode');
      const bName = isKm && currentAiBot.nameKm ? currentAiBot.nameKm : currentAiBot.name;
      const statusText = aiFinished ? (isKm ? 'បានដល់ទី!' : 'FINISHED!') : `${aiTargetWpm} WPM`;
      raceAiRacerNameEl.textContent = `${bName} (${statusText})`;
    }
  }

  // Update live lead indicator
  const raceLeadBadgeEl = document.getElementById('raceLeadBadge');
  const raceLeadTextEl = document.getElementById('raceLeadText');
  if(raceLeadBadgeEl && raceLeadTextEl){
    const playerChars = raceIndex;
    const aiChars = aiCharsTyped;
    const charDiff = playerChars - aiChars;
    const isKm = typeof document !== 'undefined' && document.documentElement.classList.contains('site-km-mode');

    raceLeadBadgeEl.classList.remove('lead-player', 'lead-ai', 'lead-tied');
    if(charDiff > 0){
      raceLeadBadgeEl.classList.add('lead-player');
      raceLeadTextEl.textContent = isKm ? `នាំមុខ +${charDiff} តួ` : `+${charDiff} chars Ahead`;
    } else if(charDiff < 0){
      raceLeadBadgeEl.classList.add('lead-ai');
      raceLeadTextEl.textContent = isKm ? `តាមក្រោយ ${charDiff} តួ` : `${charDiff} chars Behind`;
    } else {
      raceLeadBadgeEl.classList.add('lead-tied');
      raceLeadTextEl.textContent = isKm ? `ស្មើគ្នា (Neck & neck)` : `Neck and neck`;
    }
  }
}

function raceTick(){
  if(!raceActive) return;
  raceUpdateHud();
  if(raceLength !== 'text'){
    const limit = parseInt(raceLength, 10);
    const remaining = limit - raceElapsedSeconds();
    if(remaining <= 0){
      raceFinish(true);
      return;
    }
  }
  raceTimerId = requestAnimationFrame(raceTick);
}

function raceEmberBurst(count){
  const rect = raceTextEl.getBoundingClientRect();
  for(let i=0;i<count;i++){
    const e = document.createElement('div');
    e.className = 'race-ember';
    const x = rect.width/2 + (Math.random()-0.5)*rect.width*0.6;
    const y = rect.height/2 + (Math.random()-0.5)*10;
    e.style.left = x+'px';
    e.style.top = y+'px';
    e.style.setProperty('--dx', ((Math.random()-0.5)*24).toFixed(1)+'px');
    e.style.setProperty('--dy', (-(20+Math.random()*24)).toFixed(1)+'px');
    raceTextEl.appendChild(e);
    setTimeout(()=>{ if(e.parentNode) e.remove(); }, 620);
  }
}

function raceHandleChar(val, el, stroke){
  if(!raceActive || !val) return;
  const expected = raceChars[raceIndex];
  let isMatch = (typeof compareTypingSequence === 'function')
    ? compareTypingSequence(val, expected)
    : (val === expected);
  let advanceUnits = 1;

  if(!isMatch && (raceIndex + 1 < raceChars.length)){
    const nextPair = expected + raceChars[raceIndex + 1];
    if(typeof compareTypingSequence === 'function' && compareTypingSequence(val, nextPair)){
      isMatch = true;
      advanceUnits = 2;
    }
  }

  if(typeof PK_TRACKER !== 'undefined' && typeof PK_TRACKER.recordTypingUnit === 'function'){
    PK_TRACKER.recordTypingUnit({
      layout: currentLayoutId,
      unitIndex: raceIndex,
      expected: expected,
      produced: val,
      correct: isMatch,
      strokeKeyId: stroke ? stroke.id : null,
      strokeLayer: stroke ? stroke.layer : null,
      expectedKeyId: raceKeyIds[raceIndex],
      expectedLayer: raceLayers[raceIndex]
    });
  }

  if(isMatch){
    recordKeystroke(true);
    raceCorrectTotal += advanceUnits;
    raceIndex += advanceUnits;
    raceLastStreakCorrect += advanceUnits;
    if(el){ el.classList.add('correct'); setTimeout(()=> el.classList.remove('correct'), 260); }
    emberBurst(el, null, raceLastStreakCorrect >= 8 ? 8 : 4, raceLastStreakCorrect >= 8 ? '#ff9d4d' : null);
    runeRing(el);
    if(raceLastStreakCorrect > 0 && raceLastStreakCorrect % 6 === 0) raceEmberBurst(6);
    raceRenderText();
    raceUpdateKeyHighlight();
    raceUpdateHud();
    if(raceIndex >= raceChars.length){
      raceFinish(false);
    }
  } else {
    raceMistakes++;
    raceLastStreakCorrect = 0;
    recordKeystroke(false);
    if(el){ el.classList.add('wrong'); setTimeout(()=> el.classList.remove('wrong'), 300); }
    const cur = raceTextEl.querySelector('.race-char.current');
    if(cur){
      cur.classList.add('wrong');
      setTimeout(()=> cur.classList.remove('wrong'), 320);
    }
    raceTextEl.classList.remove('shake'); void raceTextEl.offsetWidth; raceTextEl.classList.add('shake');
    setTimeout(()=> raceTextEl.classList.remove('shake'), 300);
    raceUpdateHud();
  }
}

function raceOpenSetup(){
  raceSetupEl.hidden = false;
  raceLiveEl.hidden = true;
  raceLeaderboardPanel.hidden = true;
  updateRaceSetupBest();
}

function raceReset(){
  if(raceTimerId){
    cancelAnimationFrame(raceTimerId);
    raceTimerId = null;
  }
  if(raceCountdownTimer){
    clearInterval(raceCountdownTimer);
    raceCountdownTimer = null;
  }
  raceActive = false;
  raceCountingDown = false;
  raceIndex = 0;
  raceMistakes = 0;
  raceCorrectTotal = 0;
  raceLastStreakCorrect = 0;
  aiCharsTyped = 0;
  aiFinished = false;
  aiFinishTime = 0;
  aiKeyTimestamps = [];
  raceCountdownEl.hidden = true;
  raceCountdownEl.classList.remove('pulse');
  if(raceTrackAiFillEl) raceTrackAiFillEl.style.width = '0%';
  if(raceTrackAiPctEl) raceTrackAiPctEl.textContent = '0%';
  if(raceTrackFillEl) raceTrackFillEl.style.width = '0%';
  if(raceTrackPctEl) raceTrackPctEl.textContent = '0%';
  const raceLeadBadgeEl = document.getElementById('raceLeadBadge');
  const raceLeadTextEl = document.getElementById('raceLeadText');
  if(raceLeadBadgeEl) raceLeadBadgeEl.className = 'race-lead-badge lead-tied';
  if(raceLeadTextEl) raceLeadTextEl.textContent = 'Ready to Race';
}

function enterRaceMode(){
  if(raceMode) return;
  if(typeof trialActive !== 'undefined' && trialActive && typeof stopTrial === 'function') stopTrial();
  if(typeof lessonActive !== 'undefined' && lessonActive){
    if(typeof executeLessonExit === 'function') executeLessonExit();
    else if(typeof exitLesson === 'function') exitLesson(true);
  }
  if(typeof window !== 'undefined' && window.adaptiveActive && typeof PK_ADAPTIVE !== 'undefined' && typeof PK_ADAPTIVE.exitSession === 'function'){
    PK_ADAPTIVE.exitSession(false);
  }
  const isKm = typeof document !== 'undefined' && document.documentElement.classList.contains('site-km-mode');
  raceMode = true;
  racePanel.hidden = false;
  raceToggle.classList.add('on');
  raceToggle.innerHTML = pkIcon('close', 14) + ' ' + (isKm ? 'ចាកចេញពីការប្រណាំង' : 'Exit Race');
  raceToggle.setAttribute('aria-pressed','true');
  setRacePill(raceDifficultyRow, 'difficulty', raceDifficulty);
  setRacePill(raceLengthRow, 'length', raceLength);
  if(raceAiOpponentRow) setRacePill(raceAiOpponentRow, 'aiBot', raceAiBotChoice);
  initRaceNameInput();
  raceOpenSetup();
  requestAnimationFrame(()=>{
    racePanel.scrollIntoView({ behavior:'smooth', block:'center' });
  });
}

function exitRaceMode(){
  if(!raceMode) return;
  raceReset();
  raceMode = false;
  racePanel.hidden = true;
  const isKm = typeof document !== 'undefined' && document.documentElement.classList.contains('site-km-mode');
  raceToggle.classList.remove('on');
  raceToggle.innerHTML = pkIcon('flag', 14) + ' ' + (isKm ? 'ប្រណាំងវាយអក្សរ' : 'Typing Race');
  raceToggle.setAttribute('aria-pressed','false');
  lockedLayer = null;
  render();
  if(highlightedKeyId && keyEls[highlightedKeyId]){
    keyEls[highlightedKeyId].classList.remove('lesson-target');
  }
  highlightedKeyId = null;
  if(raceHighlightedModifierKeyId && keyEls[raceHighlightedModifierKeyId]){
    keyEls[raceHighlightedModifierKeyId].classList.remove('modifier-target');
  }
  raceHighlightedModifierKeyId = null;
  setActiveFinger(null);
  const existing = document.querySelector('.race-result-overlay');
  if(existing) existing.remove();
}

raceToggle.addEventListener('click', ()=>{
  if(raceMode) exitRaceMode(); else enterRaceMode();
});
raceExitLiveBtn.addEventListener('click', exitRaceMode);

function raceRunCountdown(cb){
  if(raceCountingDown) return; // guard against repeated clicks starting multiple timers
  raceCountingDown = true;
  raceSetupEl.hidden = true;
  raceLiveEl.hidden = false;
  raceCountdownEl.hidden = false;
  let n = 3;
  raceCountdownEl.textContent = String(n);
  raceCountdownEl.classList.remove('pulse'); void raceCountdownEl.offsetWidth; raceCountdownEl.classList.add('pulse');
  raceCountdownTimer = setInterval(()=>{
    n--;
    if(n > 0){
      raceCountdownEl.textContent = String(n);
    } else if(n === 0){
      raceCountdownEl.textContent = 'GO!';
    } else {
      clearInterval(raceCountdownTimer);
      raceCountdownEl.hidden = true;
      raceCountingDown = false;
      cb();
      return;
    }
    raceCountdownEl.classList.remove('pulse'); void raceCountdownEl.offsetWidth; raceCountdownEl.classList.add('pulse');
  }, 700);
}

function startRace(){
  if(raceActive || raceCountingDown) return; // never start multiple race timers
  if(typeof trialActive !== 'undefined' && trialActive && typeof stopTrial === 'function') stopTrial();
  if(typeof lessonActive !== 'undefined' && lessonActive){
    if(typeof executeLessonExit === 'function') executeLessonExit();
    else if(typeof exitLesson === 'function') exitLesson(true);
  }
  if(typeof window !== 'undefined' && window.adaptiveActive && typeof PK_ADAPTIVE !== 'undefined' && typeof PK_ADAPTIVE.exitSession === 'function'){
    PK_ADAPTIVE.exitSession(false);
  }
  raceGenerateText();
  raceIndex = 0;
  raceMistakes = 0;
  raceCorrectTotal = 0;
  raceLastStreakCorrect = 0;

  // Initialize AI Bot opponent
  let botKey = raceAiBotChoice;
  if(botKey === 'auto'){
    botKey = raceDifficulty;
  }
  const botProfile = AI_BOTS[botKey] || AI_BOTS.easy;
  const spreadDelta = Math.floor((Math.random() - 0.5) * (botProfile.spread * 2));
  aiTargetWpm = Math.max(16, botProfile.baseWpm + spreadDelta);
  currentAiBot = {
    key: botProfile.key || botKey,
    name: botProfile.name,
    nameKm: botProfile.nameKm,
    title: botProfile.title,
    baseWpm: botProfile.baseWpm,
    targetWpm: aiTargetWpm
  };
  aiCharsTyped = 0;
  aiFinished = false;
  aiFinishTime = 0;
  aiKeyTimestamps = generateAiTimings(raceChars, aiTargetWpm, botProfile.variance || 0.08);

  if(raceAiRacerNameEl){
    const isKm = typeof document !== 'undefined' && document.documentElement.classList.contains('site-km-mode');
    const bName = (isKm && currentAiBot.nameKm) ? currentAiBot.nameKm : currentAiBot.name;
    raceAiRacerNameEl.textContent = `${bName} (${aiTargetWpm} WPM)`;
  }
  if(racePlayerTagLabelEl){
    const rName = getRaceName();
    racePlayerTagLabelEl.textContent = rName ? rName.toUpperCase() : 'YOU';
  }
  if(raceTrackAiFillEl) raceTrackAiFillEl.style.width = '0%';
  if(raceTrackAiPctEl) raceTrackAiPctEl.textContent = '0%';
  if(raceTrackFillEl) raceTrackFillEl.style.width = '0%';
  if(raceTrackPctEl) raceTrackPctEl.textContent = '0%';

  const isKm = typeof document !== 'undefined' && document.documentElement.classList.contains('site-km-mode');
  const diffKm = { easy: 'ងាយស្រួល', medium: 'មធ្យម', hard: 'ពិបាក', expert: 'ជំនាញ', nightmare: 'ល្បឿនកំពូល' }[raceDifficulty] || raceDifficulty;
  const diffName = isKm ? diffKm : (raceDifficulty.charAt(0).toUpperCase() + raceDifficulty.slice(1));
  const lenStr = raceLength === 'text' ? (isKm ? ' · អត្ថបទពេញ' : ' · Full Text') : (' · ' + raceLength + (isKm ? 'វ' : 's'));
  raceDifficultyLabelEl.textContent = diffName + lenStr;
  raceRenderText();
  raceUpdateHud();
  raceRunCountdown(()=>{
    raceActive = true;
    raceStartTime = Date.now();
    if(typeof PK_TRACKER !== 'undefined' && typeof PK_TRACKER.recordRaceStart === 'function'){
      PK_TRACKER.recordRaceStart({
        layout: currentLayoutId,
        difficulty: raceDifficulty,
        length: raceLength
      });
    }
    lockedLayer = null;
    render();
    raceUpdateKeyHighlight();
    raceTick();
    boardWrap.focus && boardWrap.focus();
  });
}
raceStartBtn.addEventListener('click', startRace);

function raceFinish(timedOut){
  if(!raceActive) return;
  const elapsed = Math.max(0.1, raceElapsedSeconds());
  const {accuracy, wpm} = raceCurrentStats();
  raceActive = false;
  cancelAnimationFrame(raceTimerId);
  if(raceCorrectTotal === 0 && raceMistakes === 0){
    raceReset();
    return;
  }
  const score = raceScore(wpm, accuracy, raceMistakes);
  const charsTyped = raceCorrectTotal;

  if(typeof PK_TRACKER !== 'undefined' && typeof PK_TRACKER.recordRaceComplete === 'function'){
    PK_TRACKER.recordRaceComplete({
      layout: currentLayoutId,
      difficulty: raceDifficulty,
      length: raceLength,
      wpm: wpm,
      accuracy: accuracy,
      score: score
    });
  }

  lockedLayer = null;
  render();
  if(highlightedKeyId && keyEls[highlightedKeyId]){
    keyEls[highlightedKeyId].classList.remove('lesson-target');
  }
  highlightedKeyId = null;
  if(raceHighlightedModifierKeyId && keyEls[raceHighlightedModifierKeyId]){
    keyEls[raceHighlightedModifierKeyId].classList.remove('modifier-target');
  }
  raceHighlightedModifierKeyId = null;
  setActiveFinger(null);

  const prevBest = getRaceBest(raceDifficulty, raceLength);
  const isNewBest = !prevBest || score > prevBest.score;
  const record = {
    wpm: isNewBest ? wpm : Math.max(wpm, prevBest.wpm),
    accuracy: isNewBest ? accuracy : Math.max(accuracy, prevBest.accuracy),
    time: isNewBest ? elapsed : Math.min(elapsed, prevBest.time ?? elapsed),
    score: isNewBest ? score : prevBest.score,
    races: (prevBest ? prevBest.races : 0) + 1,
  };
  saveRaceBest(raceDifficulty, raceLength, record);

  const racerName = getRaceName();
  saveRaceName(racerName);
  submitRaceToLeaderboard(racerName, raceDifficulty, raceLength, {wpm, accuracy, score});
  const lbList = loadRaceLeaderboard(raceDifficulty, raceLength);
  const rank = lbList.findIndex(e=> e.name.toLowerCase() === racerName.toLowerCase()) + 1;

  const rect = boardWrap.getBoundingClientRect();
  for(let i=0;i<6;i++){
    setTimeout(()=> emberBurst(boardWrap, {
      clientX: rect.left + rect.width*(0.25 + Math.random()*0.5),
      clientY: rect.top + rect.height*(0.3 + Math.random()*0.3)
    }, 10, '#ffd166'), i*80);
  }
  playChime();
  confettiBurst(rect.left + rect.width/2, rect.top + rect.height*0.3, accuracy === 100 ? 34 : 22);
  if(isNewBest) triggerRecordCelebration();

  const playerWon = (raceLength === 'text')
    ? (!aiFinished && raceIndex >= raceChars.length) || (wpm >= aiTargetWpm)
    : (wpm >= aiTargetWpm);
  const wpmDiff = Math.abs(wpm - aiTargetWpm);

  showRaceResults({
    wpm,
    accuracy,
    elapsed,
    charsTyped,
    mistakes: raceMistakes,
    score,
    isNewBest,
    timedOut,
    racerName,
    rank,
    lbTotal: lbList.length,
    duelResult: {
      playerWon,
      aiBot: currentAiBot || { name: 'AI Bot' },
      aiWpm: aiTargetWpm,
      wpmDiff
    }
  });
  achievementOnce('race-'+raceDifficulty+'-'+raceLength, pkIcon('flag', 20), 'Race complete!', 'Finished a ' + raceDifficulty + ' race');
}

function showRaceResults({wpm, accuracy, elapsed, charsTyped, mistakes, score, isNewBest, racerName, rank, lbTotal, duelResult}){
  const isKm = typeof document !== 'undefined' && document.documentElement.classList.contains('site-km-mode');
  const overlay = document.createElement('div');
  overlay.className = 'race-result-overlay';

  const duelHtml = duelResult ? `
    <div class="race-duel-badge ${duelResult.playerWon ? 'win' : 'loss'}">
      ${duelResult.playerWon ? pkIcon('trophy', 16) : pkIcon('flag', 16)}
      <span>${duelResult.playerWon ? (isKm ? 'អ្នកបានយកឈ្នះ AI!' : 'VICTORY OVER AI!') : (isKm ? 'AI ទទួលបានជ័យជម្នះ!' : 'AI BOT WON THE MATCH!')}</span>
    </div>
    <p class="race-duel-sub">
      ${duelResult.playerWon
        ? (isKm ? `អ្នកវាយបាន <b>${wpm} WPM</b> លើស ${escapeHtml(duelResult.aiBot.name)} (${duelResult.aiWpm} WPM) ចំនួន <b>+${duelResult.wpmDiff} WPM</b>!` : `You clocked <b>${wpm} WPM</b>, beating ${escapeHtml(duelResult.aiBot.name)} (${duelResult.aiWpm} WPM) by <b>+${duelResult.wpmDiff} WPM</b>!`)
        : (isKm ? `${escapeHtml(duelResult.aiBot.name)} វាយបាន <b>${duelResult.aiWpm} WPM</b> លើសអ្នក (${wpm} WPM) ចំនួន <b>+${duelResult.wpmDiff} WPM</b>។ ព្យាយាមម្តងទៀត!` : `${escapeHtml(duelResult.aiBot.name)} clocked <b>${duelResult.aiWpm} WPM</b> vs your <b>${wpm} WPM</b> (+${duelResult.wpmDiff} WPM advantage). Keep practicing!`)}
    </p>` : '';

  overlay.innerHTML = `
    <div class="race-result-card">
      <div class="race-badge">${duelResult && duelResult.playerWon ? pkIcon('trophy', 38) : pkIcon('flag', 38)}</div>
      <h2>${duelResult && duelResult.playerWon ? (isKm ? 'ជ័យជម្នះ!' : 'VICTORY!') : (isKm ? 'បញ្ចប់ការប្រណាំង!' : 'RACE FINISHED!')}</h2>
      ${duelHtml}
      <p class="race-pb" style="color:var(--ink-dim); text-transform:none; letter-spacing:0;">
        ${escapeHtml(racerName)} — ${isKm ? `ចំណាត់ថ្នាក់ <b style="color:var(--gold-bright)">#${rank}</b> ក្នុងចំណោម ${lbTotal} នៅលើតារាងនេះ` : `Rank <b style="color:var(--gold-bright)">#${rank}</b> of ${lbTotal} on this leaderboard`}
      </p>
      ${isNewBest ? '<p class="race-pb">' + pkIcon('zap', 14) + ' ' + (isKm ? 'កំណត់ត្រាល្អបំផុតថ្មី!' : 'New Personal Best!') + '</p>' : ''}
      <div class="race-result-grid">
        <div><b>${wpm}</b><span>WPM</span></div>
        <div><b>${accuracy}%</b><span>${isKm ? 'សុក្រឹតភាព' : 'Accuracy'}</span></div>
        <div><b>${elapsed.toFixed(1)}${isKm ? 'វ' : 's'}</b><span>${isKm ? 'រយៈពេល' : 'Time'}</span></div>
        <div><b>${charsTyped}</b><span>${isKm ? 'តួអក្សរ' : 'Characters'}</span></div>
        <div><b>${mistakes}</b><span>${isKm ? 'កំហុស' : 'Mistakes'}</span></div>
        <div><b>${score}</b><span>${isKm ? 'ពិន្ទុ' : 'Score'}</span></div>
      </div>
      <div class="race-result-actions">
        <button class="race-again primary">${pkIcon('reset', 14)} ${isKm ? 'ប្រណាំងម្តងទៀត' : 'Race Again'}</button>
        <button class="race-view-leaderboard">${pkIcon('trophy', 14)} ${isKm ? 'តារាងពិន្ទុ' : 'Leaderboard'}</button>
        <button class="race-change-difficulty">${pkIcon('settings', 14)} ${isKm ? 'ប្ដូរកម្រិតលំបាក' : 'Change Difficulty'}</button>
        <button class="race-exit">${isKm ? 'ចាកចេញ' : 'Exit Race'}</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);


  overlay.querySelector('.race-again').addEventListener('click', ()=>{
    overlay.remove();
    raceLiveEl.hidden = false;
    raceSetupEl.hidden = true;
    startRace();
  });
  overlay.querySelector('.race-view-leaderboard').addEventListener('click', ()=>{
    overlay.remove();
    raceReset();
    raceLbDifficulty = raceDifficulty;
    raceLbLength = raceLength;
    raceSetupEl.hidden = true;
    raceLiveEl.hidden = true;
    raceLeaderboardPanel.hidden = false;
    renderRaceLeaderboard();
  });
  overlay.querySelector('.race-change-difficulty').addEventListener('click', ()=>{
    overlay.remove();
    raceReset();
    raceOpenSetup();
  });
  overlay.querySelector('.race-exit').addEventListener('click', ()=>{
    overlay.remove();
    exitRaceMode();
  });
}

setRacePill(raceDifficultyRow, 'difficulty', raceDifficulty);
setRacePill(raceLengthRow, 'length', raceLength);

/* ---------- course builder ----------
   Builds the full 8-level progression. Level 1 starts with the home row anchor keys
   F and J (Left Index F = ថ, Right Index J = ញ), then D and K (Middle fingers = ដ & ក),
   then reach keys G and H (ង & ហ), S and L (ស & ល), pinky keys A, ;, ' (ា, ះ, ់),
   culminating in real Khmer home-row words! Every lesson features rich examples. */

function applyTypingContentData(data){
  if(!data) return;
  if(data.WORD_BANK) WORD_BANK.length = 0, WORD_BANK.push(...data.WORD_BANK);
  if(data.WORD_BANK_EN) WORD_BANK_EN.length = 0, WORD_BANK_EN.push(...data.WORD_BANK_EN);
}

// Window bindings for interoperability, developer console & testing
window.enterRaceMode = enterRaceMode;
window.exitRaceMode = exitRaceMode;
window.startRace = startRace;
window.raceHandleChar = raceHandleChar;
window.AI_BOTS = AI_BOTS;

try {
  Object.defineProperty(window, 'raceMode', { get: () => raceMode, set: v => { raceMode = v; }, configurable: true });
  Object.defineProperty(window, 'raceActive', { get: () => raceActive, set: v => { raceActive = v; }, configurable: true });
  Object.defineProperty(window, 'raceCountingDown', { get: () => raceCountingDown, set: v => { raceCountingDown = v; }, configurable: true });
  Object.defineProperty(window, 'raceChars', { get: () => raceChars, set: v => { raceChars = v; }, configurable: true });
  Object.defineProperty(window, 'raceKeyIds', { get: () => raceKeyIds, set: v => { raceKeyIds = v; }, configurable: true });
  Object.defineProperty(window, 'raceLayers', { get: () => raceLayers, set: v => { raceLayers = v; }, configurable: true });
  Object.defineProperty(window, 'raceIndex', { get: () => raceIndex, set: v => { raceIndex = v; }, configurable: true });
  Object.defineProperty(window, 'raceCorrectTotal', { get: () => raceCorrectTotal, set: v => { raceCorrectTotal = v; }, configurable: true });
  Object.defineProperty(window, 'raceMistakes', { get: () => raceMistakes, set: v => { raceMistakes = v; }, configurable: true });
  Object.defineProperty(window, 'currentAiBot', { get: () => currentAiBot, set: v => { currentAiBot = v; }, configurable: true });
  Object.defineProperty(window, 'aiTargetWpm', { get: () => aiTargetWpm, set: v => { aiTargetWpm = v; }, configurable: true });
  Object.defineProperty(window, 'aiCharsTyped', { get: () => aiCharsTyped, set: v => { aiCharsTyped = v; }, configurable: true });
} catch(e) {}
