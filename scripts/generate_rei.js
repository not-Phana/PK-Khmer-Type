const fs = require('fs');
const path = require('path');

const src = fs.readFileSync('index.html', 'utf8');

function buildReiHtml(isSubdir = false) {
  let html = src;

  // 1. Fix asset links if in subdir
  if (isSubdir) {
    html = html.replace(/href="css\//g, 'href="../css/');
    html = html.replace(/src="js\//g, 'src="../js/');
    html = html.replace(/src="data\//g, 'src="../data/');
    html = html.replace(/src="logo\.svg"/g, 'src="../logo.svg"');
    html = html.replace(/href="welcome\.html"/g, 'href="../welcome.html"');
    html = html.replace(/href="dashboard\.html"/g, 'href="../dashboard.html"');
    html = html.replace(/href="Documents\//g, 'href="../Documents/');
    html = html.replace(/src="assets\//g, 'src="../assets/');
  }

  // 2. Title & Rei Flag Meta
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>PK Khmer Type Rei — Cambodian & English Typing Tutor</title>\n  <meta name="color-scheme" content="light dark">\n  <script>window.__IS_REI__ = true; window.__IS_REI_SUBDIR__ = ${isSubdir ? 'true' : 'false'};</script>`
  );
  html = html.replace('<html lang="en"', '<html lang="en" class="is-rei"');
  html = html.replace('<body', '<body class="is-rei"');

  // Favicon update for Rei
  html = html.replace(/<link rel="icon" type="image\/svg\+xml" href="logo\.svg">/, '<link rel="icon" type="image/svg+xml" href="' + (isSubdir ? '../' : '') + 'assets/rei-logo.svg">');

  // 3. Top Actions Toolbar & Side Docks Removal (Matching User Images 1, 3, 5)
  // Replaces from <div class="top-actions" through </aside> (removing top buttons, #profileSidebar, and #guideDock)
  const topActionsAndDocksRegex = /<div class="top-actions" role="toolbar"[\s\S]*?<\/aside>/;
  const newTopActions = `<div class="top-actions" role="toolbar" aria-label="Rei Command Bar">
  <!-- Group 0: Brand Crest & Studio Switcher -->
  <a href="${isSubdir ? '../index.html' : 'index.html'}" class="rei-brand-link" title="PK Khmer Type Rei — Switch to Studio Mode" aria-label="PK Khmer Type Rei">
    <img src="${isSubdir ? '../' : ''}assets/rei-logo.svg" width="22" height="22" alt="Rei" class="rei-brand-logo-img">
    <span class="rei-brand-text">REI <span class="rei-brand-glyph">រៀន</span></span>
  </a>

  <div class="top-actions-divider" aria-hidden="true"></div>

  <!-- Group 1: Workspace Tools -->
  <div class="top-actions-group" role="group" aria-label="Workspace Tools">
    <button id="focusModeBtn" class="focus-mode-btn" aria-label="Toggle Focus Mode" title="Focus Mode (Hide distractions, Alt+F)"><svg class="pk-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></svg> <span class="focus-btn-text i18n-t" data-en="Focus" data-km="ផ្ដោត">Focus</span> <kbd class="focus-kbd-badge">Alt+F</kbd></button>
    <button id="tipsModalBtn" class="top-action-btn tips-modal-btn pro-tips-highlight-btn" title="Touch-Typing &amp; Khmer Mastery Tips (Alt+T)" aria-label="Open Mastery Tips"><svg class="pk-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> <span class="i18n-t" data-en="Pro Tips" data-km="គន្លឹះ">Pro Tips</span> <kbd class="top-lang-kbd" aria-hidden="true">Alt+T</kbd></button>
  </div>

  <div class="top-actions-divider" aria-hidden="true"></div>

  <!-- Group 2: Preferences (Language, Sound, Wallpaper, Dark/Light Theme) -->
  <div class="top-actions-group" role="group" aria-label="Preferences and Status">
    <button id="topLangToggleBtn" class="top-action-btn lang-toggle-btn" aria-label="Translate English to Khmer" title="Translate English ⇄ Khmer (Alt+L)">
      <span class="lang-switch-capsule" aria-hidden="true">
        <span class="lang-capsule-tag en active" id="topLangBadgeEn">EN</span>
        <span class="lang-capsule-arrow">
          <svg class="pk-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>
        </span>
        <span class="lang-capsule-tag km" id="topLangBadgeKm">ខ្មែរ</span>
      </span>
      <span id="topLangToggleLabel" class="top-lang-text-accessible">Translate to Khmer</span>
      <kbd class="top-lang-kbd" aria-hidden="true">Alt+L</kbd>
    </button>
    <button id="soundToggle" class="top-action-btn sound-toggle-btn on" aria-pressed="true" title="Toggle Mechanical Key Sound"><svg class="pk-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> <span class="i18n-t" data-en="Key sound" data-km="សំឡេងគ្រាប់ចុច">Key sound</span></button>
    <button id="reiWallpaperBtn" class="top-action-btn wallpaper-toggle-btn" title="Choose or Upload Wallpaper" aria-label="Change Background Wallpaper">
      <svg class="pk-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      <span class="i18n-t" data-en="Wallpaper" data-km="ផ្ទាំងរូបភាព">Wallpaper</span>
    </button>
    <button id="reiThemeToggleBtn" class="top-action-btn theme-toggle-btn" title="Change Color: Toggle Dark and Light Mode" aria-label="Change Color Theme">
      <svg class="pk-icon" id="reiThemeIcon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      <span class="i18n-t" id="reiThemeText" data-en="Light" data-km="ពន្លឺ">Light</span>
    </button>
    <button id="projectScaleBtnRei" class="top-action-btn scale-telemetry-btn" title="Inspect Project Scale &amp; Engine Scope (250K+ LOC)" aria-label="Open Project Scale Telemetry">
      <svg class="pk-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
      <span>250K LOC</span>
    </button>
  </div>
</div>`;
  html = html.replace(topActionsAndDocksRegex, newTopActions);

  // 4. Hero Title: Add Rei Crest Logo & Rei Badge
  html = html.replace(
    /(<div class="site-crest-icon"[^>]*>[\s\S]*?<img src=")[^"]*(" alt="PK Khmer Type Official Crest Logo"[^>]*>)/,
    `$1${isSubdir ? '../' : ''}assets/rei-logo.svg$2`
  );
  html = html.replace(
    'PK Khmer Type <span class="hero-edition-tag">Studio Pro</span>',
    'PK Khmer Type <span class="hero-edition-tag rei">Rei</span>'
  );
  html = html.replace(
    '<span class="pk-mdg-brand-name">PK KHMER TYPE STUDIO PRO</span>',
    '<span class="pk-mdg-brand-name">PK KHMER TYPE REI</span>'
  );

  // 5. Make Lesson Strip Easier to Understand:
  // Remove promotional clutter banners & adaptive card, add Stage Navigator in initial HTML
  const stageNavigator = `<div class="rei-how-to-use-guide" id="reiHowToUseGuide">
    <div class="rei-htu-step active">
      <span class="rei-htu-num">1</span>
      <span class="rei-htu-text">
        <span class="rei-htu-main i18n-t" data-en="Pick Stage" data-km="ជ្រើសរើសវគ្គ">Pick Stage</span>
        <span class="rei-htu-sub i18n-t" data-en="Home, Top, Bottom..." data-km="ជួរកណ្តាល, ជួរលើ...">Home, Top...</span>
      </span>
    </div>
    <svg class="pk-icon rei-htu-arrow" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
    <div class="rei-htu-step">
      <span class="rei-htu-num">2</span>
      <span class="rei-htu-text">
        <span class="rei-htu-main i18n-t" data-en="Choose Drill" data-km="ជ្រើសមេរៀន">Choose Drill</span>
        <span class="rei-htu-sub i18n-t" data-en="Click Start Drill" data-km="ចុចប៊ូតុងចាប់ផ្តើម">Click Start</span>
      </span>
    </div>
    <svg class="pk-icon rei-htu-arrow" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
    <div class="rei-htu-step">
      <span class="rei-htu-num">3</span>
      <span class="rei-htu-text">
        <span class="rei-htu-main i18n-t" data-en="Type by Guide" data-km="វាយតាមការណែនាំ">Type by Guide</span>
        <span class="rei-htu-sub i18n-t" data-en="Watch finger & keys" data-km="មើលម្រាមដៃ & គ្រាប់ចុច">Watch keys</span>
      </span>
    </div>
  </div>
  <div class="rei-strip-stages-bar" id="reiStripStagesBar">
    <button type="button" class="rei-stage-btn active" data-stage="1" title="Stage 1: Home Row Anchors & Vowels">1. Home Row</button>
    <button type="button" class="rei-stage-btn locked" data-stage="2" aria-disabled="true" title="Stage 2: Top Row Reaches (Locked · Complete Home Row first)">2. Top Row <span class="rei-stage-badge locked" title="Locked"><svg class="pk-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span></button>
    <button type="button" class="rei-stage-btn locked" data-stage="3" aria-disabled="true" title="Stage 3: Bottom Row Reaches (Locked · Complete Top Row first)">3. Bottom Row <span class="rei-stage-badge locked" title="Locked"><svg class="pk-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span></button>
    <button type="button" class="rei-stage-btn locked" data-stage="4" aria-disabled="true" title="Stage 4: Shift Consonants & Vowels (Locked)">4. Shift Keys <span class="rei-stage-badge locked" title="Locked"><svg class="pk-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span></button>
    <button type="button" class="rei-stage-btn locked" data-stage="5" aria-disabled="true" title="Stage 5: Subscripts & Diacritics (Locked)">5. Subscripts <span class="rei-stage-badge locked" title="Locked"><svg class="pk-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span></button>
    <button type="button" class="rei-stage-btn locked" data-stage="6" aria-disabled="true" title="Stage 6: Word Practice (Locked)">6. Words <span class="rei-stage-badge locked" title="Locked"><svg class="pk-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span></button>
    <button type="button" class="rei-stage-btn locked" data-stage="7" aria-disabled="true" title="Stage 7: Sentences & Flow (Locked)">7. Flow <span class="rei-stage-badge locked" title="Locked"><svg class="pk-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span></button>
    <button type="button" class="rei-stage-btn" data-stage="all" title="View All Lessons">All</button>
  </div>
  <div class="rei-stage-tip-banner" id="reiStageTipBanner">
    <div class="rst-header">
      <svg class="pk-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
      <span class="rst-title" id="reiStageTipTitle">Stage 1 · Home Row Foundation</span>
    </div>
    <p class="rst-desc" id="reiStageTipDesc">Anchor Left Index on F (ថ) and Right Index on J (ញ). Return fingers to home keys after every stroke without looking down.</p>
  </div>`;

  html = html.replace(/<div class="lesson-strip-banners-row">[\s\S]*?<\/button>\s*<\/div>/, stageNavigator);
  html = html.replace(/<div class="adaptive-sidebar-card" id="adaptiveSidebarCard">[\s\S]*?<\/button>\s*<\/div>/, '');
  html = html.replace(/<button type="button" class="lsh-adaptive-btn"[\s\S]*?<\/button>/, '');
  html = html.replace(/<button type="button" class="lsh-expand-btn"[\s\S]*?<\/button>/, '');

  
  // 5b. Interactive Live Finger Reach Guidance HUD in Lesson Panel
  html = html.replace(
    '<div class="lesson-char-row" id="lessonCharRow"></div>',
    `<div class="rei-finger-reach-hud" id="reiFingerReachHud" aria-live="polite">
      <span class="rei-reach-dot rest" style="background:#94a3b8;"></span>
      <span class="rei-reach-label">Home Row Resting (Index anchors on F & J)</span>
    </div>
    <div class="lesson-char-row" id="lessonCharRow"></div>`
  );

  // 6. Wallpaper Modal Enhancements:
  // Add Upload Image button into wallpaper-input-deck
  const uploadDeckBtn = `<input type="file" id="modalWallpaperFileInput" accept="image/*" style="display:none;">
      <button type="button" class="wallpaper-upload-btn" id="modalUploadWallpaperBtn" title="Upload local image from computer">
        <svg class="pk-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <span class="i18n-t" data-en="Upload Photo" data-km="ផ្ទុកឡើង">Upload Photo</span>
      </button>`;
  html = html.replace(
    '<button type="button" class="wallpaper-apply-btn" id="wallpaperApplyBtn">',
    `${uploadDeckBtn}\n      <button type="button" class="wallpaper-apply-btn" id="wallpaperApplyBtn">`
  );

  // Add Reset Default button into wallpaper-modal-footer
  const resetFooterBtn = `<button type="button" class="modal-secondary-btn danger" id="wallpaperModalResetBtn" title="Remove wallpaper and restore default background">
          <svg class="pk-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
          <span class="i18n-t" data-en="Reset Default" data-km="លុបផ្ទាំងរូបភាព">Reset Default</span>
        </button>`;
  html = html.replace(
    '<button type="button" class="modal-secondary-btn" id="wallpaperModalCancelBtn">',
    `${resetFooterBtn}\n        <button type="button" class="modal-secondary-btn" id="wallpaperModalCancelBtn">`
  );

  // 7. Remove Chassis Buttons: Dashboard STATS, Documents DOCS, 3D Studio 3D (Matching User Image 5)
  const chassisActionsRegex = /<div class="chassis-actions">[\s\S]*?<\/div>/;
  html = html.replace(chassisActionsRegex, '<div class="chassis-actions"></div>');

  // 8. Remove Lower Toolbar (Matching User Image 2)
  const toolbarRegex = /<div class="toolbar">[\s\S]*?<\/div>/;
  html = html.replace(toolbarRegex, '<!-- Lower toolbar omitted in Rei — Key Sound moved to Top Command Bar -->');

  // 8.1 Customize Quick Guide Hint copy for Rei Tutor
  const reiOldHintPattern = /<p class="hint i18n-t"[\s\S]*?<\/p>/;
  const reiNewHint = `<p class="hint i18n-t" data-en="Pick a layout above: the &lt;b&gt;Khmer Keyboard Layout&lt;/b&gt;, the official &lt;b&gt;Khmer NiDA Keyboard&lt;/b&gt;, or plain &lt;b&gt;English (US)&lt;/b&gt;. Blank keys carry no mapping on that layer — just like the real thing. Pick a &lt;b&gt;Stage&lt;/b&gt; and &lt;b&gt;Drill&lt;/b&gt; above to master touch-typing step-by-step." data-km="ជ្រើសរើសប្លង់ខាងលើ៖ &lt;b&gt;ប្លង់ក្តារចុចខ្មែរ&lt;/b&gt; ជាផ្លូវការ &lt;b&gt;ក្តារចុចខ្មែរ និដា&lt;/b&gt; ឬ &lt;b&gt;English (US)&lt;/b&gt; សុទ្ធ។ គ្រាប់ចុចទទេគ្មានតម្លៃលើស្រទាប់នោះទេ — ដូចក្តារចុចពិតដែរ។ ជ្រើសរើស &lt;b&gt;ដំណាក់កាល&lt;/b&gt; និង &lt;b&gt;លំហាត់&lt;/b&gt; ខាងលើ ដើម្បីហ្វឹកហាត់វាយអក្សរមួយជំហានម្តងៗ។">Pick a layout above: the <b>Khmer Keyboard Layout</b>, the official <b>Khmer NiDA Keyboard</b>, or plain <b>English (US)</b>. Blank keys carry no mapping on that layer — just like the real thing. Pick a <b>Stage</b> and <b>Drill</b> above to master touch-typing step-by-step.</p>`;
  html = html.replace(reiOldHintPattern, reiNewHint);


  // 9. Remove Site Footer and AI Alliance Box (Matching User Image 4)
  const footerRegex = /<footer class="site-footer" id="siteFooter">[\s\S]*?<\/footer>/;
  const newFooter = `<footer class="site-footer" style="margin-top: 32px; padding: 20px; text-align: center; color: var(--ink-dim); font-size: 0.82rem; border-top: 1px solid rgba(255,255,255,0.08);">
    <span>PK Khmer Type Rei · Traditional Touch-Typing Tutor</span>
    <span style="margin: 0 10px; opacity: 0.4;">·</span>
    <button type="button" id="projectScaleBtnReiFooter" class="rei-scale-btn" style="background:none; border:none; color: #38bdf8; cursor:pointer; font-size: 0.8rem; text-decoration: underline;">Scale: 250K+ LOC (412 Files · 199 Tests)</button>
    <span style="margin: 0 10px; opacity: 0.4;">·</span>
    <a href="${isSubdir ? '../index.html' : 'index.html'}" style="color: var(--gold); text-decoration: none;">Switch to Full Studio</a>
  </footer>`;
  html = html.replace(footerRegex, newFooter);

  // 10. Cleanly Remove pkCollaboratorsModal without leaving unbalanced divs
  const cleanCollabRegex = /<div class="modal-backdrop" id="pkCollaboratorsModal"[\s\S]*?(?=<!-- ================= Khmer NiDA Keyboard Guide & Download Modal)/;
  html = html.replace(cleanCollabRegex, '');

  // 11. Inject Dedicated Rei Responsive Styles in Head
  const reiCss = `
  <!-- PK Khmer Type Rei Dedicated Responsive Tutor Styles -->
  <style id="reiDedicatedStyles">
    /* Remove any leftover side drawers or floating widgets */
    #guideDock, .guide-dock, #profileSidebar, .profile-sidebar {
      display: none !important;
    }

    /* Sleek, Compact Top Actions Bar */
    .top-actions {
      padding: 3px 6px !important;
      gap: 4px !important;
    }
    .top-actions .top-actions-group {
      gap: 3px !important;
    }
    .top-actions button,
    .top-actions a.top-action-btn {
      height: 28px !important;
      min-height: 28px !important;
      padding: 0 8px !important;
      font-size: 0.71rem !important;
      gap: 5px !important;
    }
    .top-actions button .pk-icon,
    .top-actions a.top-action-btn .pk-icon {
      width: 13px !important;
      height: 13px !important;
    }
    .top-actions .focus-kbd-badge,
    .top-actions .top-lang-kbd {
      font-size: 0.58rem !important;
      padding: 1px 4px !important;
      border-radius: 4px !important;
    }
    .top-actions .top-actions-divider {
      height: 16px !important;
      margin: 0 1px !important;
    }

    /* Rei Header Brand Crest Link */
    .rei-brand-link {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 2px 8px 2px 5px;
      background: rgba(255, 209, 102, 0.08);
      border: 1px solid rgba(255, 209, 102, 0.25);
      border-radius: 20px;
      text-decoration: none;
      color: inherit;
      transition: all 0.2s ease;
      cursor: pointer;
      height: 28px;
      flex-shrink: 0;
    }
    .rei-brand-link:hover {
      background: rgba(255, 209, 102, 0.16);
      border-color: #ffd166;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(255, 209, 102, 0.2);
    }
    .rei-brand-logo-img {
      width: 18px;
      height: 18px;
      display: block;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
    }
    .rei-brand-text {
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      color: #ffd166;
    }
    .rei-brand-glyph {
      font-family: 'Noto Serif Khmer', 'Khmer OS Battambang', serif;
      font-weight: 600;
      color: #38bdf8;
      margin-left: 2px;
    }
    html.theme-light .rei-brand-link {
      background: rgba(217, 119, 6, 0.08);
      border-color: rgba(217, 119, 6, 0.25);
    }
    html.theme-light .rei-brand-text {
      color: #92400e;
    }
    html.theme-light .rei-brand-glyph {
      color: #0284c7;
    }

    /* Hide promotional clutter banners & adaptive practice card */
    .lesson-strip-banners-row,
    .adaptive-sidebar-card,
    .lsh-adaptive-btn,
    .lsh-expand-btn {
      display: none !important;
    }

    /* Desktop View (>= 1024px): Retain native right sidebar layout with centered main deck */
    @media(min-width: 1024px) {
      body.is-rei {
        padding-right: 375px !important;
        box-sizing: border-box !important;
      }
      .is-rei #lessonStrip,
      .is-rei .lesson-strip {
        position: fixed !important;
        right: 16px !important;
        top: 76px !important;
        bottom: 16px !important;
        width: 345px !important;
        max-height: calc(100vh - 92px) !important;
        margin: 0 !important;
        z-index: 60 !important;
        border-radius: 12px !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        background: rgba(14, 18, 36, 0.96) !important;
        border: 1px solid rgba(255, 209, 102, 0.28) !important;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 209, 102, 0.15) !important;
        backdrop-filter: blur(16px) !important;
        -webkit-backdrop-filter: blur(16px) !important;
        display: flex !important;
        flex-direction: column !important;
      }
      .is-rei .top-actions {
        max-width: 960px !important;
        margin: 0 auto 10px !important;
      }
      .is-rei .hero {
        margin-top: 10px !important;
        margin-bottom: 8px !important;
      }
      .is-rei .hero-tagline,
      .is-rei .profile-credit {
        display: none !important;
      }
      .is-rei .kb-layout-shelf {
        margin: 8px auto !important;
      }
      .is-rei .kb-stats-shelf {
        margin: 8px auto !important;
      }
      .is-rei .kb-layer-shelf {
        margin: 8px auto !important;
      }
      .is-rei .manuscript {
        max-width: 960px !important;
        margin: 10px auto !important;
      }
      .is-rei .board-wrap {
        max-width: 960px !important;
        margin: 0 auto 155px auto !important;
        transition: margin-bottom .28s cubic-bezier(.16,1,.3,1) !important;
      }
      html.hands-guide-off .is-rei .board-wrap,
      .is-rei .board-wrap.hands-hidden {
        margin: 0 auto 24px auto !important;
      }
      .is-rei .pro-tips-banner-card {
        margin: 0 auto 16px auto !important;
      }
      .is-rei .lesson-panel {
        max-width: 960px !important;
        margin: 10px auto !important;
      }
    }

    /* Tablet and Mobile (< 1024px) */
    @media(max-width: 1023px) {
      body.is-rei {
        padding-right: 0 !important;
      }
      .is-rei #lessonStrip,
      .is-rei .lesson-strip {
        position: relative !important;
        right: auto !important;
        top: auto !important;
        width: 100% !important;
        max-width: 960px !important;
        margin: 16px auto !important;
      }
    }

    
    /* Active Target Key Pulse Animation */
    @keyframes rei-target-pulse {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(255, 209, 102, 0.7), 0 0 12px rgba(255, 209, 102, 0.5);
      }
      50% {
        box-shadow: 0 0 0 5px rgba(255, 209, 102, 0), 0 0 20px rgba(255, 209, 102, 0.9);
      }
    }
    .is-rei .key.lesson-target,
    .is-rei .key.active-target {
      animation: rei-target-pulse 1.3s infinite cubic-bezier(0.4, 0, 0.6, 1) !important;
      border-color: #ffd166 !important;
      color: #ffd166 !important;
      z-index: 4 !important;
    }

    /* Live Finger Reach HUD */
    .rei-finger-reach-hud {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 7px 16px;
      margin: 4px auto 10px;
      max-width: 680px;
      background: rgba(14, 18, 36, 0.92);
      border: 1px solid rgba(255, 209, 102, 0.35);
      border-radius: 20px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
      font-size: 0.82rem;
      letter-spacing: 0.02em;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      transition: all 0.15s ease;
    }
    .rei-reach-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .rei-reach-finger {
      font-weight: 700;
    }
    .rei-reach-arrow {
      opacity: 0.6;
    }
    .rei-reach-key-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 2px 7px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.2);
      font-family: var(--font-mono, monospace);
      font-weight: 700;
      color: var(--gold, #ffd166);
    }
    .rei-reach-shift {
      color: #f472b6;
      font-size: 0.74rem;
    }
    .rei-reach-char {
      font-family: var(--font-khmer, sans-serif);
      font-size: 1.05rem;
      font-weight: 700;
      color: #ffffff;
      margin-left: 2px;
    }
    .rei-reach-action {
      font-size: 0.75rem;
      color: var(--ink-dim, #94a3b8);
      font-style: italic;
    }

    
/* Easy-To-Use 3-Step Guide */
.rei-how-to-use-guide {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 8px 10px;
  background: rgba(255, 209, 102, 0.05);
  border-bottom: 1px solid rgba(255, 209, 102, 0.15);
  font-size: 0.72rem;
  flex-shrink: 0;
}
.rei-htu-step {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.rei-htu-num {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: rgba(255, 209, 102, 0.2);
  color: var(--gold, #ffd166);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.65rem;
  flex-shrink: 0;
}
.rei-htu-step.active .rei-htu-num {
  background: var(--gold, #ffd166);
  color: #0f172a;
}
.rei-htu-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  overflow: hidden;
}
.rei-htu-main {
  font-weight: 700;
  color: var(--ink, #f1f5f9);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.rei-htu-sub {
  font-size: 0.62rem;
  color: var(--ink-dim, #94a3b8);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.rei-htu-arrow {
  color: var(--ink-dim, #94a3b8);
  opacity: 0.45;
  flex-shrink: 0;
}

/* Stage Tip Banner Progress and Quick Action */
.rst-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 3px;
}
.rst-progress-pill {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 8px;
  background: rgba(255, 209, 102, 0.18);
  color: var(--gold, #ffd166);
  white-space: nowrap;
  flex-shrink: 0;
}
.rst-progress-track {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 2px;
  margin: 6px 0 8px;
  overflow: hidden;
}
.rst-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #ffd166 0%, #10b981 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
}
.rst-action-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  flex-wrap: wrap;
}
.rst-quick-start-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 6px;
  background: linear-gradient(135deg, #ffd166 0%, #f59e0b 100%);
  color: #0f172a;
  border: none;
  font-weight: 700;
  font-size: 0.72rem;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(245, 158, 11, 0.35);
  transition: all 0.15s ease;
}
.rst-quick-start-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(245, 158, 11, 0.5);
}
.rst-done-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #10b981;
}
.rst-advance-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  border: none;
  font-weight: 700;
  font-size: 0.72rem;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.35);
  transition: all 0.15s ease;
}
.rst-advance-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.5);
}

/* Next Recommended Drill Highlight */
.lesson-card.next-recommended {
  border: 1.5px solid #10b981 !important;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(14, 18, 36, 0.95) 100%) !important;
  box-shadow: 0 0 16px rgba(16, 185, 129, 0.28) !important;
  position: relative;
}
.rei-next-tag {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  padding: 1px 5px;
  border-radius: 4px;
  background: #10b981;
  color: #ffffff;
  vertical-align: middle;
}
.rei-card-start-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  padding: 3px 8px;
  border-radius: 5px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  border: none;
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(5, 150, 105, 0.4);
  transition: all 0.12s ease;
}
.rei-card-start-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(5, 150, 105, 0.6);
}

/* Stage Complete Card */
.rei-stage-complete-card {
  margin: 10px 8px;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.35);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.rscc-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.74rem;
  color: var(--ink);
}
.rscc-text svg {
  color: #10b981;
  flex-shrink: 0;
}
.rscc-sub {
  font-size: 0.68rem;
  color: var(--ink-dim, #94a3b8);
}

/* Light Mode Overrides for Next Recommended and Guide */
html.theme-light .rei-how-to-use-guide {
  background: #f8fafc !important;
  border-bottom: 1px solid #e2e8f0 !important;
}
html.theme-light .rei-htu-main {
  color: #0f172a !important;
}
html.theme-light .rei-htu-num {
  background: #e2e8f0 !important;
  color: #475569 !important;
}
html.theme-light .rei-htu-step.active .rei-htu-num {
  background: #d97706 !important;
  color: #ffffff !important;
}
html.theme-light .rst-progress-pill {
  background: #fef3c7 !important;
  color: #b45309 !important;
}
html.theme-light .rst-progress-track {
  background: #e2e8f0 !important;
}
html.theme-light .lesson-card.next-recommended {
  border: 1.5px solid #059669 !important;
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%) !important;
  box-shadow: 0 4px 14px rgba(5, 150, 105, 0.18) !important;
}
html.theme-light .rei-stage-complete-card {
  background: #f0fdf4 !important;
  border-color: #86efac !important;
}
html.theme-light .rscc-text {
  color: #064e3b !important;
}
html.theme-light .rscc-sub {
  color: #047857 !important;
}

    /* Stage Pedagogical Tip Banner */
    .rei-stage-tip-banner {
      margin: 8px 10px 4px;
      padding: 8px 12px;
      background: rgba(255, 209, 102, 0.08);
      border: 1px solid rgba(255, 209, 102, 0.22);
      border-radius: 8px;
      font-size: 0.76rem;
      line-height: 1.45;
      color: var(--ink);
      flex-shrink: 0;
    }
    .rst-header {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 700;
      font-size: 0.72rem;
      color: var(--gold, #ffd166);
      margin-bottom: 3px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .rst-desc {
      margin: 0;
      color: var(--ink-dim, #cbd5e1);
      font-size: 0.74rem;
    }
    .rei-stage-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-left: 4px;
      padding: 1px 5px;
      font-size: 0.65rem;
      font-weight: 700;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.15);
      color: inherit;
    }
    .rei-stage-badge.check {
      background: #059669;
      color: #ffffff;
      padding: 1px 4px;
    }

    html.theme-light .rei-finger-reach-hud {
      background: rgba(255, 255, 255, 0.95) !important;
      border: 1px solid #cbd5e1 !important;
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06) !important;
      color: #0f172a !important;
    }
    html.theme-light .rei-reach-key-badge {
      background: #f1f5f9 !important;
      border-color: #cbd5e1 !important;
      color: #b45309 !important;
    }
    html.theme-light .rei-reach-char {
      color: #0f172a !important;
    }
    html.theme-light .rei-stage-tip-banner {
      background: #fefce8 !important;
      border-color: #fde047 !important;
      color: #713f12 !important;
    }
    html.theme-light .rst-header {
      color: #b45309 !important;
    }
    html.theme-light .rst-desc {
      color: #854d0e !important;
    }
    html.theme-light .is-rei .key.lesson-target,
    html.theme-light .is-rei .key.active-target {
      border-color: #d97706 !important;
      color: #92400e !important;
      box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.35), 0 4px 12px rgba(217, 119, 6, 0.25) !important;
    }

    /* Horizontal Stage Selector Bar inside Lesson Strip */
    .rei-strip-stages-bar {
      display: flex;
      gap: 6px;
      padding: 8px 10px;
      overflow-x: auto;
      background: rgba(0, 0, 0, 0.28);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      scrollbar-width: none;
      flex-wrap: nowrap;
      flex-shrink: 0;
    }
    .rei-strip-stages-bar::-webkit-scrollbar {
      display: none;
    }
    .rei-stage-btn {
      padding: 5px 11px;
      font-size: 0.72rem;
      font-weight: 600;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.07);
      color: var(--ink);
      border: 1px solid rgba(255, 255, 255, 0.12);
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
      transition: all 0.15s ease;
    }
    .rei-stage-btn:hover {
      background: rgba(255, 209, 102, 0.18);
      border-color: rgba(255, 209, 102, 0.35);
    }
        .rei-stage-btn.locked {
      opacity: 0.52 !important;
      background: rgba(15, 23, 42, 0.4) !important;
      border-color: rgba(255, 255, 255, 0.08) !important;
      color: #94a3b8 !important;
      cursor: not-allowed !important;
    }
    .rei-stage-btn.locked:hover {
      opacity: 0.85 !important;
      background: rgba(245, 158, 11, 0.12) !important;
      border-color: rgba(245, 158, 11, 0.4) !important;
      color: #ffd166 !important;
    }
    .rei-stage-badge.locked {
      background: rgba(245, 158, 11, 0.18) !important;
      border: 1px solid rgba(245, 158, 11, 0.35) !important;
      color: #f59e0b !important;
      padding: 1px 5px !important;
    }
    html.theme-light .rei-stage-btn.locked {
      opacity: 0.55 !important;
      background: #f1f5f9 !important;
      border-color: #cbd5e1 !important;
      color: #64748b !important;
    }
    html.theme-light .rei-stage-badge.locked {
      background: #fef3c7 !important;
      border-color: #f59e0b !important;
      color: #b45309 !important;
    }
    @keyframes pk-shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-4px); }
      40%, 80% { transform: translateX(4px); }
    }
    .shake {
      animation: pk-shake 0.42s ease !important;
    }

    .rei-stage-btn.active {
      background: var(--gold, #ffd166) !important;
      color: #0f172a !important;
      font-weight: 700 !important;
      border-color: var(--gold, #ffd166) !important;
      box-shadow: 0 2px 8px rgba(255, 209, 102, 0.35);
    }

    .lesson-level-header {
      cursor: pointer;
      user-select: none;
    }

    /* Upload & Reset Buttons inside Wallpaper Modal */
    .wallpaper-upload-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: 8px;
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.35);
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }
    .wallpaper-upload-btn:hover {
      background: rgba(59, 130, 246, 0.28);
      border-color: #60a5fa;
      color: #ffffff;
    }
    .modal-secondary-btn.danger {
      border-color: rgba(239, 68, 68, 0.4) !important;
      color: #f87171 !important;
    }
    .modal-secondary-btn.danger:hover {
      background: rgba(239, 68, 68, 0.15) !important;
      color: #ffffff !important;
    }

    /* ================= Elevated 3D Tactile Light Mode ================= */
    html.theme-light body {
      background: #f1f5f9 !important;
      color: #0f172a !important;
    }

    html.theme-light .hero-title {
      color: #0f172a !important;
      text-shadow: none !important;
    }

    /* 3D Tactile Keycaps in Light Mode */
    html.theme-light .board-chassis,
    html.theme-light .keyboard-board {
      background: #ffffff !important;
      border: 1px solid #cbd5e1 !important;
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08), 0 0 0 1px #e2e8f0 !important;
    }

    html.theme-light .key {
      background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%) !important;
      border: 1px solid #cbd5e1 !important;
      box-shadow: 0 3px 0 #94a3b8, 0 4px 8px rgba(15, 23, 42, 0.06) !important;
      color: #0f172a !important;
      transition: transform 0.08s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.08s ease, background 0.15s ease !important;
    }

    html.theme-light .key:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 5px 0 #94a3b8, 0 8px 16px rgba(15, 23, 42, 0.1) !important;
      background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%) !important;
    }

    html.theme-light .key:active,
    html.theme-light .key.is-down,
    html.theme-light .key.key-pressed {
      transform: translateY(2px) !important;
      box-shadow: 0 1px 0 #94a3b8, 0 2px 4px rgba(15, 23, 42, 0.08) !important;
    }

    html.theme-light .key.active-target,
    html.theme-light .key.highlight {
      background: linear-gradient(180deg, #fef3c7 0%, #fde68a 100%) !important;
      border-color: #f59e0b !important;
      box-shadow: 0 3px 0 #d97706, 0 4px 14px rgba(245, 158, 11, 0.35) !important;
      color: #92400e !important;
    }

    html.theme-light .key .key-char {
      color: #0f172a !important;
      font-weight: 700 !important;
    }

    html.theme-light .key .key-sub,
    html.theme-light .key .key-label {
      color: #64748b !important;
      font-weight: 600 !important;
    }

    /* Light Mode Manuscript & Prompt Display */
    html.theme-light .manuscript {
      background: #ffffff !important;
      border: 1px solid #cbd5e1 !important;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05) !important;
    }

    html.theme-light .prompt-text,
    html.theme-light .manuscript-prompt {
      color: #334155 !important;
    }

    html.theme-light .char.char-typed,
    html.theme-light .prompt-char.typed {
      color: #059669 !important;
    }

    html.theme-light .char.char-current,
    html.theme-light .prompt-char.active {
      background: rgba(245, 158, 11, 0.22) !important;
      border-bottom: 3px solid #d97706 !important;
      color: #0f172a !important;
    }

    /* Light Mode Telemetry & Shelves */
    html.theme-light .kb-stats-shelf,
    html.theme-light .kb-layout-shelf,
    html.theme-light .kb-layer-shelf {
      background: #ffffff !important;
      border: 1px solid #e2e8f0 !important;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04) !important;
    }

    html.theme-light .top-actions {
      background: rgba(255, 255, 255, 0.88) !important;
      border: 1px solid #cbd5e1 !important;
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06) !important;
    }

    html.theme-light .top-action-btn {
      background: #f8fafc !important;
      border: 1px solid #cbd5e1 !important;
      color: #334155 !important;
    }

    html.theme-light .top-action-btn:hover {
      background: #f1f5f9 !important;
      color: #0f172a !important;
    }

    /* Light Mode Lesson Sidebar & Cards */
    html.theme-light.is-rei #lessonStrip,
    html.theme-light .is-rei #lessonStrip {
      background: #ffffff !important;
      border: 1px solid #cbd5e1 !important;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.1) !important;
    }

    html.theme-light .rei-strip-stages-bar {
      background: #f8fafc !important;
      border-bottom: 1px solid #cbd5e1 !important;
    }

    html.theme-light .rei-stage-btn {
      background: #e2e8f0 !important;
      color: #334155 !important;
      border-color: #cbd5e1 !important;
    }

    html.theme-light .rei-stage-btn.active {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
      color: #ffffff !important;
      border-color: #b45309 !important;
      box-shadow: 0 3px 8px rgba(217, 119, 6, 0.3) !important;
    }

    html.theme-light .lesson-card {
      background: #ffffff !important;
      border: 1px solid #e2e8f0 !important;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04) !important;
    }

    html.theme-light .lesson-card:hover {
      background: #f8fafc !important;
      border-color: #cbd5e1 !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 6px 14px rgba(15, 23, 42, 0.08) !important;
    }

    html.theme-light .lesson-card.locked {
      background: #f8fafc !important;
      border-color: #e2e8f0 !important;
      opacity: 0.6 !important;
    }

    html.theme-light .lesson-card.active {
      background: #fffbeb !important;
      border: 2px solid #d97706 !important;
      box-shadow: 0 4px 16px rgba(217, 119, 6, 0.18) !important;
    }

    html.theme-light .lesson-card-title {
      color: #0f172a !important;
      font-weight: 600 !important;
    }

    html.theme-light .lesson-card-sub {
      color: #64748b !important;
    }

    html.theme-light .lesson-card-num {
      background: #f1f5f9 !important;
      color: #475569 !important;
      border: 1px solid #e2e8f0 !important;
    }
  </style>
</head>`;
  html = html.replace('</head>', reiCss);

  // 12. Rei Controller Script before closing </body>
  const reiControllerScript = `
  <!-- PK Khmer Type Rei Controller Script -->
  <script>
    (function(){
      // 1. Theme Switcher (Dark & Light)
      var themeBtn = document.getElementById('reiThemeToggleBtn');
      var themeText = document.getElementById('reiThemeText');
      var themeIcon = document.getElementById('reiThemeIcon');

      function updateThemeUI(isLight) {
        document.documentElement.classList.toggle('theme-light', isLight);
        if (themeText) themeText.textContent = isLight ? 'Dark' : 'Light';
        if (themeIcon) {
          themeIcon.innerHTML = isLight
            ? '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
            : '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
        }
      }

      var savedTheme = localStorage.getItem('pk_rei_theme') || (document.documentElement.classList.contains('theme-light') ? 'light' : 'dark');
      updateThemeUI(savedTheme === 'light');

      if (themeBtn) {
        themeBtn.addEventListener('click', function(){
          var currentlyLight = document.documentElement.classList.contains('theme-light');
          var nextIsLight = !currentlyLight;
          localStorage.setItem('pk_rei_theme', nextIsLight ? 'light' : 'dark');
          updateThemeUI(nextIsLight);
          if (typeof playClick === 'function') playClick('down');
        });
      }

      // 2. Wallpaper Studio Launcher
      var wpBtn = document.getElementById('reiWallpaperBtn');
      if (wpBtn) {
        wpBtn.addEventListener('click', function(){
          if (typeof window.openWallpaperUrlModal === 'function') {
            window.openWallpaperUrlModal();
          }
        });
      }
    })();
  </script>
</body>`;
  html = html.replace('</body>', reiControllerScript);

  return html;
}

const reiSubdirHtml = buildReiHtml(true);
const reiRootHtml = buildReiHtml(false);

fs.writeFileSync('rei/index.html', reiSubdirHtml, 'utf8');
fs.writeFileSync('rei.html', reiRootHtml, 'utf8');

// Ensure assets directory is copied to rei/assets for local resource resolution
const assetsSrcDir = path.resolve('assets');
const assetsDestDir = path.resolve('rei', 'assets');
if (fs.existsSync(assetsSrcDir)) {
  if (!fs.existsSync(assetsDestDir)) {
    fs.mkdirSync(assetsDestDir, { recursive: true });
  }
  fs.cpSync(assetsSrcDir, assetsDestDir, { recursive: true });
}

console.log('Successfully generated rei/index.html and rei.html with full native PK Khmer Type UI & assets!');
