const fs = require('fs');
const path = require('path');

const tutPath = path.join(__dirname, '../js/tutorial.js');
let code = fs.readFileSync(tutPath, 'utf8');

// 1. Add translations in en
const enSearch = "trackEngTag: '66 Lessons · Every Letter Included'";
const enAdd = "trackEngTag: '66 Lessons · Every Letter Included',\r\n      trackReiTitle: 'PK Khmer Type Rei (Zen Edition)',\r\n      trackReiDesc: 'Distraction-free Zen typing tutor with Angkor wallpapers and 7 guided stages. Best for pure typing practice.',\r\n      trackReiTag: 'Zen Mode · 7 Stages · Pure Typing'";
if (!code.includes('trackReiTitle')) {
  code = code.replace(enSearch, enAdd);
}

// 2. Add translations in km
const kmSearch = "trackEngTag: '៦៦ មេរៀន · រួមបញ្ចូលគ្រប់តួអក្សរ'";
const kmAdd = "trackEngTag: '៦៦ មេរៀន · រួមបញ្ចូលគ្រប់តួអក្សរ',\r\n      trackReiTitle: 'PK Khmer Type Rei (រៀន)',\r\n      trackReiDesc: 'កម្មវិធីហ្វឹកហាត់ស្ងប់ស្ងាត់ ផ្ដោតលើការរៀនវាយអក្សរសុទ្ធសាធ ៧ វគ្គ និងរូបភាពទេសភាពខ្មែរ ដោយគ្មានការរំខាន។',\r\n      trackReiTag: 'ផ្ដោតអារម្មណ៍ · ៧ វគ្គ · រៀនវាយសុទ្ធសាធ'";
if (!code.includes('PK Khmer Type Rei (រៀន)')) {
  code = code.replace(kmSearch, kmAdd);
}

// 3. Add rei to TUT_ICONS
const iconSearch = "globe: '<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"/><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"/></svg>',";
const iconAdd = iconSearch + "\r\n    rei: '<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9.5\" stroke-dasharray=\"52 6\"/><path d=\"M9 16.5l3-9 3 9M9.8 14h4.4\"/><line x1=\"8\" y1=\"20\" x2=\"16\" y2=\"20\"/></svg>',";
if (!code.includes("rei: '<svg viewBox=\"0 0 24 24\"")) {
  code = code.replace(iconSearch, iconAdd);
}

// 4. Add Rei Card HTML to ensureDOM()
const engCardEnd = `              <div class="pk-tut-track-card" data-track="english" tabindex="0" role="button" aria-pressed="false">
                <div class="pk-tut-track-icon-box" aria-hidden="true">\${TUT_ICONS.globe}</div>
                <div class="pk-tut-track-info">
                  <div class="pk-tut-track-title-row">
                    <span class="pk-tut-track-name" id="pkTutTrackEngName">English (US)</span>
                    <span class="pk-tut-track-badge" id="pkTutTrackEngTag">66 Lessons · Every Letter Included</span>
                  </div>
                  <div class="pk-tut-track-desc" id="pkTutTrackEngDesc">Structured QWERTY touch-typing curriculum from ASDF home row to high speed.</div>
                </div>
                <div class="pk-tut-track-check" aria-hidden="true">
                  <svg class="pk-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>`;

const reiCardHtml = `

              <div class="pk-tut-track-card pk-tut-track-rei" data-track="rei" tabindex="0" role="button" aria-pressed="false">
                <div class="pk-tut-track-icon-box" aria-hidden="true">\${TUT_ICONS.rei}</div>
                <div class="pk-tut-track-info">
                  <div class="pk-tut-track-title-row">
                    <span class="pk-tut-track-name" id="pkTutTrackReiName">PK Khmer Type Rei</span>
                    <span class="pk-tut-track-badge pk-tut-badge-rei" id="pkTutTrackReiTag">Zen Mode · 7 Stages · Pure Typing</span>
                  </div>
                  <div class="pk-tut-track-desc" id="pkTutTrackReiDesc">Distraction-free Zen typing tutor with Angkor wallpapers and 7 guided stages. Best for pure typing practice.</div>
                </div>
                <div class="pk-tut-track-check" aria-hidden="true">
                  <svg class="pk-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>`;

if (!code.includes('data-track="rei"')) {
  const normalizedEng = engCardEnd.replace(/\r\n/g, '\n');
  const codeNorm = code.replace(/\r\n/g, '\n');
  const replaced = codeNorm.replace(normalizedEng, normalizedEng + reiCardHtml.replace(/\r\n/g, '\n'));
  code = replaced.replace(/\n/g, '\r\n');
}

// 5. Update refreshLang()
const langRefreshTarget = `        const engTag = document.getElementById('pkTutTrackEngTag');
        if(engTag) engTag.textContent = this.t('trackEngTag');`;

const langRefreshAdd = `        const engTag = document.getElementById('pkTutTrackEngTag');
        if(engTag) engTag.textContent = this.t('trackEngTag');

        const reiName = document.getElementById('pkTutTrackReiName');
        if(reiName) reiName.textContent = this.t('trackReiTitle');
        const reiDesc = document.getElementById('pkTutTrackReiDesc');
        if(reiDesc) reiDesc.textContent = this.t('trackReiDesc');
        const reiTag = document.getElementById('pkTutTrackReiTag');
        if(reiTag) reiTag.textContent = this.t('trackReiTag');`;

if (!code.includes('pkTutTrackReiName')) {
  const normTarget = langRefreshTarget.replace(/\r\n/g, '\n');
  const normAdd = langRefreshAdd.replace(/\r\n/g, '\n');
  const codeNorm = code.replace(/\r\n/g, '\n');
  code = codeNorm.replace(normTarget, normAdd).replace(/\n/g, '\r\n');
}

// 6. Update showWelcome() click handler and priBtn.onclick
const origClickBlock = `          if(typeof window.switchLayout === 'function'){
            window.switchLayout(chosen);
          }
          if(typeof playHolographicChime === 'function'){
            playHolographicChime(chosen !== 'english');
          }`;

const newClickBlock = `          if(chosen === 'rei'){
            if(typeof playHolographicChime === 'function'){
              playHolographicChime(true);
            }
            return;
          }
          if(typeof window.switchLayout === 'function'){
            window.switchLayout(chosen);
          }
          if(typeof playHolographicChime === 'function'){
            playHolographicChime(chosen !== 'english');
          }`;

if (!code.includes("if(chosen === 'rei')")) {
  const normClickOrig = origClickBlock.replace(/\r\n/g, '\n');
  const normClickNew = newClickBlock.replace(/\r\n/g, '\n');
  const codeNorm = code.replace(/\r\n/g, '\n');
  code = codeNorm.replace(normClickOrig, normClickNew).replace(/\n/g, '\r\n');
}

const origPriBtn = `      priBtn.onclick = () => {
        this.currentModalMode = null;
        modal.style.display = 'none';
        maskSvg.style.display = 'block';
        tooltip.style.display = 'block';
        this.goToStep('lessons-sidebar');
      };`;

const newPriBtn = `      priBtn.onclick = () => {
        const activeCard = modal.querySelector('.pk-tut-track-card.active');
        const chosen = activeCard ? activeCard.dataset.track : 'standard';

        if(chosen === 'rei'){
          this.skip();
          window.location.href = 'rei.html';
          return;
        }

        this.currentModalMode = null;
        modal.style.display = 'none';
        maskSvg.style.display = 'block';
        tooltip.style.display = 'block';
        this.goToStep('lessons-sidebar');
      };`;

if (!code.includes("window.location.href = 'rei.html'")) {
  const normPriOrig = origPriBtn.replace(/\r\n/g, '\n');
  const normPriNew = newPriBtn.replace(/\r\n/g, '\n');
  const codeNorm = code.replace(/\r\n/g, '\n');
  code = codeNorm.replace(normPriOrig, normPriNew).replace(/\n/g, '\r\n');
}

fs.writeFileSync(tutPath, code, 'utf8');

// Also update css/tutorial.css
const cssPath = path.join(__dirname, '../css/tutorial.css');
let css = fs.readFileSync(cssPath, 'utf8');

if (!css.includes('.pk-tut-track-card.pk-tut-track-rei')) {
  const normCss = css.replace(/\r\n/g, '\n');
  
  // Add max-height to modal card if not present
  const modalTarget = 'width: min(92vw, 530px);\n  background: #0a0e1c;\n  border: 1px solid rgba(255, 209, 102, 0.45);\n  padding: 30px 28px 26px;';
  const modalReplace = 'width: min(92vw, 530px);\n  max-height: 94vh;\n  overflow-y: auto;\n  background: #0a0e1c;\n  border: 1px solid rgba(255, 209, 102, 0.45);\n  padding: 24px 26px 20px;';
  let updatedCss = normCss.replace(modalTarget, modalReplace);

  // Add Rei track card styles
  const reiCss = `
.pk-tut-track-card.pk-tut-track-rei:hover:not(.active) {
  border-color: rgba(255, 209, 102, 0.45);
  background: rgba(255, 209, 102, 0.09);
}

.pk-tut-track-card.pk-tut-track-rei .pk-tut-badge-rei {
  background: rgba(255, 209, 102, 0.14);
  border-color: rgba(255, 209, 102, 0.35);
  color: #ffd166;
}

.pk-tut-track-card.pk-tut-track-rei.active {
  background: linear-gradient(135deg, rgba(255, 209, 102, 0.22), rgba(15, 23, 42, 0.92));
  border: 1.5px solid #ffd166;
  box-shadow: 0 4px 22px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 209, 102, 0.35);
}
`;

  updatedCss = updatedCss.replace('.pk-tut-track-card.active {', reiCss.trim() + '\n\n.pk-tut-track-card.active {');
  fs.writeFileSync(cssPath, updatedCss.replace(/\n/g, '\r\n'), 'utf8');
}

console.log('Successfully updated js/tutorial.js and css/tutorial.css!');
