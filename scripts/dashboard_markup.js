// scripts/dashboard_markup.js
// Complete HTML Markup for PK Khmer Type Analytics & Mastery Dashboard
// Strict Zero-Emoji Policy: 100% Inline SVG Vector Geometry

module.exports = `
  <div class="dashboard-container">
    
    <!-- DEMO MODE NOTICE BANNER (Toggleable) -->
    <div id="demoNoticeBanner" class="demo-notice-banner hidden">
      <div style="display:flex; align-items:center; gap:8px;">
        <svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span><strong>Preview Demonstration Telemetry Active:</strong> Showing benchmark learner profile data. Click toggle to switch back to your real local storage data.</span>
      </div>
      <button id="btnExitDemo" type="button" class="nav-pill-btn primary" style="padding:4px 12px; font-size:11px;">Return to Live Data</button>
    </div>

    <!-- TOP EXECUTIVE COMMAND BAR -->
    <header class="top-command-bar">
      <div class="brand-cluster">
        <a href="index.html" class="brand-avatar-link" title="Return to PK Khmer Type Studio" aria-label="Return to PK Khmer Type Studio">
          <div class="brand-avatar">
            <img src="assets/dashboard-logo.svg" onerror="this.onerror=null;this.src='logo.svg'" alt="PK Khmer Type Official Crest Logo" width="48" height="48" class="brand-logo-img">
          </div>
        </a>
        <div class="brand-info">
          <h1>
            <span>PK Khmer Type — Analytics &amp; Mastery Dashboard</span>
            <span class="live-dot" title="Telemetry Synchronized"></span>
          </h1>
          <p>
            <span>Active Typist Profile</span>
            <span>·</span>
            <span id="currentDateDisplay">October 2026</span>
            <span>·</span>
            <span id="activeLayoutBadge">Khmer Standard (ANSI 104)</span>
            <span>·</span>
            <span class="scribe-level-badge" id="scribeLevelBadge">
              <svg class="svg-icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span id="scribeLevelTitle">Level 1: Initiate Scribe</span>
              <span class="scribe-xp-bar-wrap"><span class="scribe-xp-bar-fill" id="scribeXpBarFill" style="width:20%;"></span></span>
              <span id="scribeXpText" style="font-family:'JetBrains Mono',monospace; font-size:10px;">0 XP</span>
            </span>
          </p>
        </div>
      </div>

      <div class="nav-actions">
        <button id="btnContinueLearningHeader" type="button" class="nav-pill-btn primary">
          <svg class="svg-icon" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span id="continueLearningBtnText">Continue Learning</span>
        </button>
        <a href="index.html" class="nav-pill-btn">
          <svg class="svg-icon" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="6" y1="12" x2="18" y2="12"></line></svg>
          <span>Practice Room</span>
        </a>
        <a href="Documents/index.html" class="nav-pill-btn">
          <svg class="svg-icon" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          <span>Documentation</span>
        </a>
        <button class="nav-pill-btn" id="btnToggleDemo" type="button" title="Toggle preview benchmark telemetry">
          <svg class="svg-icon" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          <span id="demoToggleLabel">Demo Preview</span>
        </button>
        <button class="nav-pill-btn cyan" id="btnOpenExportModal" type="button">
          <svg class="svg-icon" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
          <span>Certify &amp; Export</span>
        </button>
      </div>
    </header>

    <!-- NEXT RECOMMENDED LESSON SPOTLIGHT CARD -->
    <section class="spotlight-card" id="spotlightCard">
      <div class="spotlight-left">
        <div class="spotlight-icon-box">
          <svg class="svg-icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </div>
        <div class="spotlight-text">
          <h2>
            <span>Current Learning Frontier:</span>
            <span id="spotlightLessonTitle" style="color:var(--gold-primary);">Unit 1 · Lesson standard-L00-01</span>
          </h2>
          <p id="spotlightLessonDesc">Master keyboard orientation and tactile anchor keys to establish your touch typing habits.</p>
        </div>
      </div>
      <div class="spotlight-action">
        <button class="spotlight-btn" id="btnSpotlightLaunch" type="button">
          <svg class="svg-icon" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span>Start Next Lesson</span>
        </button>
      </div>
    </section>

    <!-- DAILY COMMITMENT & TARGET WIDGET -->
    <section class="daily-target-strip">
      <div class="target-card">
        <div class="target-info">
          <span class="target-title">
            <svg class="svg-icon" viewBox="0 0 24 24" style="color:var(--cyan-neon);"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
            <span>Today's Practice Target</span>
          </span>
          <div class="target-stat">
            <span id="todayKeyCount">0</span>
            <span style="font-size:14px; color:var(--text-dim);">/ <span id="todayKeyTarget">500</span> Keystrokes</span>
          </div>
        </div>
        <div class="target-progress-wrap">
          <div class="target-bar-bg">
            <div class="target-bar-fill" id="todayProgressBar" style="width:0%;"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted);">
            <span id="todayGoalPct">0% Goal Reached</span>
            <span id="todayRemainingStrokes">500 strokes to complete today's goal</span>
          </div>
        </div>
        <div class="target-presets" id="targetPresets">
          <button class="target-preset-btn" data-target="250" type="button">Casual (250)</button>
          <button class="target-preset-btn active" data-target="500" type="button">Steady (500)</button>
          <button class="target-preset-btn" data-target="1000" type="button">Intensive (1k)</button>
        </div>
      </div>

      <div class="target-card">
        <div class="target-info">
          <span class="target-title">
            <svg class="svg-icon" viewBox="0 0 24 24" style="color:var(--rose-neon);"><path d="M12 2c1.5 3 4 5 4 9a6 6 0 1 1-12 0c0-4 2.5-6 4-9 1 2 2 3 4 0z"></path></svg>
            <span>Devotion Streak</span>
          </span>
          <div class="target-stat" style="color:var(--gold-primary);">
            <span id="targetStreakDisplay">0</span>
            <span style="font-size:14px; color:var(--text-dim);">Days Active</span>
          </div>
        </div>
        <div style="font-size:11px; color:var(--text-muted); line-height:1.3;" id="targetStreakMessage">
          Practice a lesson today to maintain your consecutive daily learning streak.
        </div>
      </div>
    </section>

    <!-- FILTER & DATA MODE TOOLBAR -->
    <section class="filter-bar">
      <div class="filter-group">
        <span class="filter-label">Curriculum Track:</span>
        <div class="segmented-control" id="trackFilter">
          <button class="segment-btn active" data-track="standard" type="button">Khmer Standard (78)</button>
          <button class="segment-btn" data-track="nida" type="button">Khmer NiDA (78)</button>
          <button class="segment-btn" data-track="english" type="button">English US (66)</button>
        </div>
      </div>

      <div class="filter-group">
        <span class="filter-label">Timeframe:</span>
        <div class="segmented-control" id="timeFilter">
          <button class="segment-btn active" data-time="all" type="button">All Time</button>
          <button class="segment-btn" data-time="30d" type="button">Last 30 Days</button>
          <button class="segment-btn" data-time="7d" type="button">This Week</button>
          <button class="segment-btn" data-time="today" type="button">Today</button>
        </div>
      </div>

      <div class="data-mode-toggle">
        <span>Source:</span>
        <strong style="color:var(--gold-primary);" id="dataSourceLabel">Local Storage (Active Profile)</strong>
      </div>
    </section>

    <!-- HERO TELEMETRY SCORECARD -->
    <section class="hero-scorecard-grid">
      
      <!-- CARD 1: OVERALL SPEED -->
      <div class="hero-card">
        <div class="hero-card-head">
          <span>Typing Velocity</span>
          <div class="hero-icon-pill" style="background:rgba(255,209,102,0.15); color:var(--gold-primary);">
            <svg class="svg-icon" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          </div>
        </div>
        <div class="hero-val" id="metricWpm">0 <span style="font-size:16px; color:var(--text-dim);">WPM</span></div>
        <div class="hero-sub" id="metricWpmSub">
          <span style="color:var(--text-dim);">No drills recorded yet</span>
        </div>
      </div>

      <!-- CARD 2: ACCURACY RATE -->
      <div class="hero-card">
        <div class="hero-card-head">
          <span>Overall Accuracy</span>
          <div class="hero-icon-pill" style="background:rgba(52,211,153,0.15); color:var(--emerald-neon);">
            <svg class="svg-icon" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
        </div>
        <div class="hero-val" style="color:var(--emerald-neon);" id="metricAcc">—%</div>
        <div class="hero-sub" id="metricAccSub">
          <span>Target: 95.0% Mastery Threshold</span>
        </div>
      </div>

      <!-- CARD 3: KEYSTROKES LOGGED -->
      <div class="hero-card">
        <div class="hero-card-head">
          <span>Total Keystrokes</span>
          <div class="hero-icon-pill" style="background:rgba(56,189,248,0.15); color:var(--cyan-neon);">
            <svg class="svg-icon" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="6" y1="12" x2="18" y2="12"></line></svg>
          </div>
        </div>
        <div class="hero-val" id="metricKeys">0</div>
        <div class="hero-sub" id="metricKeysSub">
          <span>0 Keystrokes recorded</span>
        </div>
      </div>

      <!-- CARD 4: LESSONS MASTERED -->
      <div class="hero-card">
        <div class="hero-card-head">
          <span>Curriculum Mastery</span>
          <div class="hero-icon-pill" style="background:rgba(167,139,250,0.15); color:var(--violet-neon);">
            <svg class="svg-icon" viewBox="0 0 24 24"><polygon points="12 2 15 8 21 9 17 14 18 20 12 17 6 20 7 14 3 9 9 8 12 2"></polygon></svg>
          </div>
        </div>
        <div class="hero-val" id="metricLessons">0 <span style="font-size:16px; color:var(--text-dim);">/ 78</span></div>
        <div class="hero-sub" id="metricLessonsSub">
          <span style="color:var(--text-dim);">0.0% Curriculum Complete</span>
        </div>
      </div>

      <!-- CARD 5: PRACTICE STREAK -->
      <div class="hero-card">
        <div class="hero-card-head">
          <span>Daily Devotion Streak</span>
          <div class="hero-icon-pill" style="background:rgba(251,113,133,0.15); color:var(--rose-neon);">
            <svg class="svg-icon" viewBox="0 0 24 24"><path d="M12 2c1.5 3 4 5 4 9a6 6 0 1 1-12 0c0-4 2.5-6 4-9 1 2 2 3 4 0z"></path></svg>
          </div>
        </div>
        <div class="hero-val" style="color:var(--gold-primary);" id="metricStreak">0 <span style="font-size:16px; color:var(--text-dim);">Days</span></div>
        <div class="hero-sub" id="metricStreakSub">
          <span>Start your practice streak today</span>
        </div>
      </div>

      <!-- CARD 6: ACTIVE PRACTICE TIME -->
      <div class="hero-card">
        <div class="hero-card-head">
          <span>Active Study Time</span>
          <div class="hero-icon-pill" style="background:rgba(251,191,36,0.15); color:var(--amber-neon);">
            <svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
        </div>
        <div class="hero-val" id="metricTime">0m</div>
        <div class="hero-sub" id="metricTimeSub">
          <span>0 learning sessions</span>
        </div>
      </div>

    </section>

    <!-- VIEW TABS NAVIGATION BAR -->
    <nav class="view-tabs-bar" role="tablist" aria-label="Dashboard views">
      <button class="view-tab-btn active" data-tab="overview" role="tab" aria-selected="true" type="button">
        <svg class="svg-icon" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
        <span>Mastery Overview</span>
      </button>
      <button class="view-tab-btn" data-tab="curriculum" role="tab" aria-selected="false" type="button">
        <svg class="svg-icon" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
        <span>Curriculum Roadmap</span>
      </button>
      <button class="view-tab-btn" data-tab="adaptive" role="tab" aria-selected="false" type="button">
        <svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span>Adaptive Diagnostics &amp; Weak Keys</span>
      </button>
      <button class="view-tab-btn" data-tab="heatmap" role="tab" aria-selected="false" type="button">
        <svg class="svg-icon" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="6" y1="12" x2="18" y2="12"></line></svg>
        <span>Physical Keyboard Heatmap</span>
      </button>
      <button class="view-tab-btn" data-tab="trophies" role="tab" aria-selected="false" type="button">
        <svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
        <span>Trophy Vault &amp; Badges</span>
      </button>
    </nav>

    <!-- TAB 1: MASTERY OVERVIEW -->
    <div class="tab-pane active" id="pane-overview">
      
      <!-- DUAL-LINE VELOCITY TRAJECTORY & 30-DAY PUNCHCARD ROW -->
      <div style="display:grid; grid-template-columns: 2fr 1fr; gap:20px;">
        
        <!-- MODULE: ULTRA-COOL TRAJECTORY VELOCITY CHART -->
        <div class="dash-module chart-module">
          <div class="chart-top-bar">
            <div>
              <h2 class="module-title">
                <svg class="svg-icon" viewBox="0 0 24 24" style="color:var(--gold-primary);"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                <span>Performance Progression Trajectory</span>
              </h2>
              <div style="font-size:11px; color:var(--text-muted); margin-top:3px;">
                Real-time velocity wave &amp; precision harmonic curve across practice sessions.
              </div>
            </div>

            <!-- Telemetry Stream Mode Toggles -->
            <div class="chart-stream-toggle" id="chartStreamToggle">
              <button class="stream-toggle-btn active" data-stream="dual" type="button">
                <svg class="svg-icon" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                <span>Dual Stream</span>
              </button>
              <button class="stream-toggle-btn" data-stream="velocity" type="button">
                <svg class="svg-icon" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                <span>Velocity Wave</span>
              </button>
              <button class="stream-toggle-btn" data-stream="precision" type="button">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>Precision Wave</span>
              </button>
            </div>
          </div>

          <!-- Micro-Telemetry Stat Chips Row -->
          <div class="chart-telemetry-chips">
            <div class="chart-chip gold" id="chipPeakWpm">
              <svg class="svg-icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span>Peak: <strong>0 WPM</strong></span>
            </div>
            <div class="chart-chip cyan" id="chipAvgWpm">
              <svg class="svg-icon" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              <span>Avg: <strong>0 WPM</strong></span>
            </div>
            <div class="chart-chip emerald" id="chipMomentum">
              <svg class="svg-icon" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              <span>Momentum: <strong>+0%</strong></span>
            </div>
            <div class="chart-chip" id="chipConsistency" style="border-color:rgba(167,139,250,0.4); color:var(--violet-neon);">
              <svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle></svg>
              <span>Consistency: <strong>0%</strong></span>
            </div>
          </div>

          <!-- Interactive SVG Trajectory Canvas & Floating Holographic HUD -->
          <div class="chart-container" id="chartContainer">
            <div class="chart-laser-line" id="chartLaserLine"></div>
            <div class="chart-reticle-gold" id="chartReticleGold"></div>
            <div class="chart-reticle-emerald" id="chartReticleEmerald"></div>

            <!-- Floating Hologram Tooltip Card -->
            <div class="chart-hologram-hud" id="chartHologramHud">
              <div class="hud-header">
                <span class="hud-title" id="hudLessonTitle">Lesson Drill</span>
                <span class="hud-date" id="hudSessionDate">Oct 27</span>
              </div>
              <div class="hud-metrics">
                <div>
                  <div class="hud-metric-label">Velocity</div>
                  <div class="hud-metric-val" id="hudSpeedVal" style="color:var(--gold-primary);">0 WPM</div>
                </div>
                <div>
                  <div class="hud-metric-label">Precision</div>
                  <div class="hud-metric-val" id="hudAccVal" style="color:var(--emerald-neon);">0%</div>
                </div>
                <div>
                  <div class="hud-metric-label">Burst Delta</div>
                  <div class="hud-delta" id="hudDeltaVal">+0 WPM</div>
                </div>
              </div>
              <div style="font-size:10px; color:var(--text-dim); border-top:1px solid rgba(255,255,255,0.06); padding-top:4px;" id="hudDurationStrokes">
                00:00 · 0 Strokes
              </div>
            </div>

            <svg class="perf-chart-svg" id="perfChartSvg" viewBox="0 0 600 240"></svg>
          </div>
        </div>

        <!-- MODULE: 30-DAY ACTIVITY PUNCHCARD -->
        <div class="dash-module">
          <div class="module-head">
            <h2 class="module-title">
              <svg class="svg-icon" viewBox="0 0 24 24" style="color:var(--emerald-neon);"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>30-Day Activity Calendar</span>
            </h2>
            <span class="module-badge" id="punchcardBadge">Active Days</span>
          </div>
          <p style="font-size:11px; color:var(--text-muted);">Daily keystroke practice intensity across the past 30 days.</p>
          <div class="punchcard-grid" id="punchcardGrid"></div>
          <div style="display:flex; align-items:center; justify-content:space-between; font-size:10px; color:var(--text-dim); margin-top:6px;">
            <span>Less Active</span>
            <div style="display:flex; gap:3px;">
              <div style="width:10px; height:10px; background:rgba(255,255,255,0.04); border-radius:2px;"></div>
              <div style="width:10px; height:10px; background:rgba(52,211,153,0.3); border-radius:2px;"></div>
              <div style="width:10px; height:10px; background:rgba(52,211,153,0.7); border-radius:2px;"></div>
              <div style="width:10px; height:10px; background:#ffd166; border-radius:2px;"></div>
            </div>
            <span>Intensive Practice</span>
          </div>
        </div>

      </div>

      <!-- 8-FINGER RADAR & SESSIONS TABLE ROW -->
      <div style="display:grid; grid-template-columns: 1fr 2fr; gap:20px;">
        
        <!-- MODULE: 8-FINGER WORKLOAD & FATIGUE RADAR -->
        <div class="dash-module">
          <div class="module-head">
            <h2 class="module-title">
              <svg class="svg-icon" viewBox="0 0 24 24" style="color:var(--cyan-neon);"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v3M14 9V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v7M10 11V5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v9M10 19H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h2"></path></svg>
              <span>8-Finger Biomechanics</span>
            </h2>
            <span class="module-badge">Ergonomics</span>
          </div>

          <div class="finger-bars-grid" id="fingerBarsGrid"></div>

          <!-- Hand Balance Meter -->
          <div class="hand-balance-meter">
            <div class="balance-label-row">
              <span id="handBalanceLeftLabel">Left Hand: 50%</span>
              <span id="handBalanceRightLabel">Right Hand: 50%</span>
            </div>
            <div class="balance-bar-track">
              <div class="balance-bar-left" id="handBalanceLeft" style="width:50%;"></div>
              <div class="balance-bar-right" id="handBalanceRight" style="width:50%;"></div>
            </div>
          </div>
        </div>

        <!-- MODULE: RECENT PRACTICE SESSIONS TABLE -->
        <div class="dash-module">
          <div class="module-head">
            <h2 class="module-title">
              <svg class="svg-icon" viewBox="0 0 24 24" style="color:var(--cyan-neon);"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>Recent Session History Log</span>
            </h2>
            <span class="module-badge">Telemetry Log</span>
          </div>

          <div tabindex="0" role="region" aria-label="Recent Practice Sessions Table" class="table-wrapper">
            <table class="sessions-table">
              <thead>
                <tr>
                  <th>Lesson / Drill</th>
                  <th>Track</th>
                  <th>Accuracy</th>
                  <th>Speed</th>
                  <th>Duration</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody id="sessionsTableBody"></tbody>
            </table>
          </div>
        </div>

      </div>

    </div>

    <!-- TAB 2: CURRICULUM ROADMAP (All 78 Lessons) -->
    <div class="tab-pane" id="pane-curriculum">
      <div class="dash-module">
        <div class="module-head">
          <h2 class="module-title">
            <svg class="svg-icon" viewBox="0 0 24 24" style="color:var(--gold-primary);"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            <span id="curriculumModuleTitle">Curriculum Mastery by Unit (Khmer Standard)</span>
          </h2>
          <div style="display:flex; align-items:center; gap:10px;">
            <span class="module-badge" id="curriculumModuleBadge">78 Total Lessons</span>
          </div>
        </div>

        <div class="curriculum-accordion-list" id="curriculumAccordionList"></div>
      </div>
    </div>

    <!-- TAB 3: ADAPTIVE DIAGNOSTICS & WEAK KEYS -->
    <div class="tab-pane" id="pane-adaptive">
      
      <!-- TOP STUMBLING KEYS & REMEDIAL DRILLS -->
      <div class="dash-module">
        <div class="module-head">
          <h2 class="module-title">
            <svg class="svg-icon" viewBox="0 0 24 24" style="color:var(--rose-neon);"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span id="weakKeysModuleTitle">Top Stumbling Keys Diagnostic</span>
          </h2>
          <span class="module-badge" style="color:var(--rose-neon);">High Priority Remediation</span>
        </div>
        <p style="font-size:12px; color:var(--text-muted);">Keys with high error rates or prolonged reaction latency. Launch targeted drills to solidify muscle memory.</p>
        <div class="weak-keys-grid" id="weakKeysGrid"></div>
      </div>

      <!-- ADAPTIVE CHARACTER MASTERY MATRIX -->
      <div class="dash-module">
        <div class="module-head">
          <h2 class="module-title">
            <svg class="svg-icon" viewBox="0 0 24 24" style="color:var(--cyan-neon);"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            <span>Glyph &amp; Typing Unit Mastery Matrix</span>
          </h2>
          <div style="display:flex; align-items:center; gap:8px; font-size:11px;">
            <span style="color:var(--emerald-neon); font-weight:700;">● Mastered (&gt;95%)</span>
            <span style="color:var(--gold-primary); font-weight:700;">● Familiar (85-94%)</span>
            <span style="color:var(--rose-neon); font-weight:700;">● Struggling (&lt;85%)</span>
          </div>
        </div>
        <p style="font-size:12px; color:var(--text-muted);">Real-time mastery status per individual glyph. Click any character to inspect telemetry or launch targeted practice.</p>
        <div class="char-matrix-grid" id="charMatrixGrid"></div>
      </div>

    </div>

    <!-- TAB 4: PHYSICAL KEYBOARD HEATMAP -->
    <div class="tab-pane" id="pane-heatmap">
      <div class="dash-module">
        <div class="module-head">
          <h2 class="module-title">
            <svg class="svg-icon" viewBox="0 0 24 24" style="color:var(--emerald-neon);"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="6" y1="12" x2="18" y2="12"></line></svg>
            <span id="heatmapModuleTitle">Physical Keyboard Mastery Heatmap</span>
          </h2>
          <div style="display:flex; align-items:center; gap:10px; font-size:11px;">
            <span style="color:var(--emerald-neon); font-weight:700;">● Mastered (&gt;95%)</span>
            <span style="color:var(--gold-primary); font-weight:700;">● Good (85–94%)</span>
            <span style="color:var(--rose-neon); font-weight:700;">● Weak (&lt;80%)</span>
            <span style="color:var(--text-dim);">● Unencountered</span>
          </div>
        </div>
        <p style="font-size:12px; color:var(--text-muted);">ANSI 104 tactile keymap. Click any physical keycap to open the detailed diagnostic inspector.</p>
        <div class="keyboard-heatmap-wrap" id="keyboardHeatmapWrap"></div>
      </div>
    </div>

    <!-- TAB 5: TROPHY VAULT & BADGES -->
    <div class="tab-pane" id="pane-trophies">
      <div class="dash-module">
        <div class="module-head">
          <h2 class="module-title">
            <svg class="svg-icon" viewBox="0 0 24 24" style="color:var(--gold-primary);"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
            <span>Milestone Achievements &amp; Scribe Badges</span>
          </h2>
          <span class="module-badge" id="achievementsBadge">0 / 12 Unlocked</span>
        </div>
        <p style="font-size:12px; color:var(--text-muted);">Earn official badges and royal Angkorean honours by mastering speed, precision, and dedication.</p>
        <div class="achievements-grid" id="achievementsGrid"></div>
      </div>
    </div>

    <!-- FOOTER -->
    <footer class="dash-footer">
      <div class="dash-footer-inner">
        <div class="dash-footer-brand">
          <img src="assets/dashboard-logo.svg" onerror="this.onerror=null;this.src='logo.svg'" alt="PK Khmer Type Logo" width="22" height="22" class="dash-footer-logo">
          <span class="dash-footer-name">PK Khmer Type</span>
          <span class="dash-footer-chip">Analytics Engine</span>
        </div>
        <p>PK Khmer Type Analytics Engine · Built by Phanna Kurosaki · Strict Zero-Emoji Compliant · Connected to Local Storage</p>
      </div>
    </footer>

  </div>

  <!-- MODAL 1: INTERACTIVE KEY INSPECTOR -->
  <div class="modal-backdrop" id="keyInspectorModal" role="dialog" aria-modal="true" aria-labelledby="keyInspectorTitle">
    <div class="modal-content">
      <button class="modal-close-btn" id="btnCloseKeyInspector" type="button" aria-label="Close Inspector">
        <svg class="svg-icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <div style="display:flex; align-items:center; gap:16px; margin-bottom:16px;">
        <div id="inspectorKeySquare" class="key-badge-square" style="width:54px; height:56px; font-size:26px;">ក</div>
        <div>
          <h3 id="keyInspectorTitle" style="font-size:18px; font-weight:800; color:#fff;">Key Details</h3>
          <p id="keyInspectorSub" style="font-size:12px; color:var(--text-muted);">Physical key and assigned biomechanical finger</p>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:18px;">
        <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:10px; color:var(--text-dim); text-transform:uppercase;">Accuracy Rate</div>
          <div id="inspectorAcc" style="font-family:'JetBrains Mono',monospace; font-size:20px; font-weight:800; color:var(--emerald-neon);">98.5%</div>
        </div>
        <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:10px; color:var(--text-dim); text-transform:uppercase;">Total Strokes</div>
          <div id="inspectorAttempts" style="font-family:'JetBrains Mono',monospace; font-size:20px; font-weight:800; color:#fff;">142</div>
        </div>
        <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:10px; color:var(--text-dim); text-transform:uppercase;">Reaction Latency</div>
          <div id="inspectorLatency" style="font-family:'JetBrains Mono',monospace; font-size:20px; font-weight:800; color:var(--cyan-neon);">240ms</div>
        </div>
        <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:10px; color:var(--text-dim); text-transform:uppercase;">Finger Assignment</div>
          <div id="inspectorFinger" style="font-size:13px; font-weight:700; color:var(--gold-primary);">Right Index</div>
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:10px;">
        <button id="btnLaunchKeyDrill" type="button" class="spotlight-btn" style="width:100%; justify-content:center;">
          <svg class="svg-icon" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span>Launch Targeted Practice Drill</span>
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL 2: SCRIBE DIPLOMA & DOSSIER EXPORT -->
  <div class="modal-backdrop" id="exportModal" role="dialog" aria-modal="true" aria-labelledby="exportModalTitle">
    <div class="modal-content" style="max-width:640px;">
      <button class="modal-close-btn" id="btnCloseExportModal" type="button" aria-label="Close Export Modal">
        <svg class="svg-icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <h3 id="exportModalTitle" style="font-size:18px; font-weight:800; color:#fff; margin-bottom:4px;">Official Typographic Certification &amp; Scribe Dossier</h3>
      <p style="font-size:12px; color:var(--text-muted); margin-bottom:14px;">Print your official Diploma of Scribe Proficiency or export your comprehensive telemetry JSON dossier.</p>

      <!-- Diploma Preview Sheet -->
      <div class="certificate-sheet" id="certificateSheet">
        <div class="cert-heading-khmer">ព្រះរាជាណាចក្រកម្ពុជា · ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
        <div class="cert-heading-en">Kingdom of Cambodia · Nation Religion King</div>
        
        <div style="margin:8px auto; width:44px; height:44px; color:var(--gold-primary);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="width:100%; height:100%;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </div>

        <div class="cert-title">PK KHMER TYPE DIPLOMA OF SCRIBE MASTERY</div>
        <div style="font-size:12px; color:var(--text-muted);">This official certification attests that</div>

        <div class="cert-recipient" id="certRecipientName">Active Typist</div>

        <div style="font-size:12px; color:var(--text-muted); line-height:1.5;">
          has attained the distinguished rank of <strong id="certRankDisplay" style="color:var(--gold-primary);">Angkor Scholar</strong> in the 
          <span id="certTrackDisplay" style="color:#fff;">Khmer Standard</span> typographic curriculum.
        </div>

        <div class="cert-stats-row">
          <div><span style="color:var(--text-dim);">VELOCITY:</span> <strong id="certSpeedDisplay" style="color:var(--gold-primary);">0 WPM</strong></div>
          <div><span style="color:var(--text-dim);">ACCURACY:</span> <strong id="certAccDisplay" style="color:var(--emerald-neon);">0%</strong></div>
          <div><span style="color:var(--text-dim);">VERIFIED:</span> <span id="certDateDisplay" style="color:#fff;">October 2026</span></div>
        </div>

        <div style="font-size:10px; color:var(--text-dim); margin-top:10px;">PK KHMER TYPE TELEMETRY AUTHENTICATION ID: <span id="certAuthId" style="font-family:'JetBrains Mono',monospace;">PK-2026-SCRIBE</span></div>
      </div>

      <!-- Typist Name Customization -->
      <div style="margin-bottom:14px;">
        <label for="typistNameInput" style="font-size:11px; font-weight:700; color:var(--text-dim); text-transform:uppercase; display:block; margin-bottom:5px;">Certificate Name:</label>
        <input type="text" id="typistNameInput" value="Active Typist" placeholder="Enter your full name for certificate" style="width:100%; padding:8px 12px; border-radius:8px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.1); color:#fff; font-size:13px;">
      </div>

      <!-- Action Buttons -->
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button id="btnPrintCertificate" type="button" class="nav-pill-btn primary" style="flex:1; justify-content:center;">
          <svg class="svg-icon" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
          <span>Print / Save PDF Diploma</span>
        </button>
        <button id="btnDownloadJsonDossier" type="button" class="nav-pill-btn" style="flex:1; justify-content:center;">
          <svg class="svg-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>Export JSON Dossier</span>
        </button>
      </div>

    </div>
  </div>
`;
