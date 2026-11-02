// scripts/dashboard_styles.js
// Complete CSS Styles for PK Khmer Type Analytics & Mastery Dashboard
// Pure Cyber-Angkor Dark Theme, Glassmorphism, Responsive Tables, Print CSS, Ultra-Cool Trajectory Telemetry

module.exports = `
    :root {
      --bg-deep: #07090e;
      --bg-surface: #0c101a;
      --bg-card: #111726;
      --bg-card-hover: #161e32;
      --border-subtle: rgba(255, 255, 255, 0.08);
      --border-gold: rgba(255, 209, 102, 0.35);
      --border-cyan: rgba(56, 189, 248, 0.35);
      --border-emerald: rgba(52, 211, 153, 0.35);
      --gold-primary: #ffd166;
      --gold-dim: #c79a32;
      --cyan-neon: #38bdf8;
      --emerald-neon: #34d399;
      --rose-neon: #fb7185;
      --violet-neon: #a78bfa;
      --amber-neon: #fbbf24;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --radius-sm: 9px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --radius-xl: 28px;
      --transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-deep);
      background-image: 
        radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.08) 0%, transparent 45%),
        radial-gradient(circle at 90% 20%, rgba(255, 209, 102, 0.06) 0%, transparent 40%),
        radial-gradient(circle at 10% 80%, rgba(167, 139, 250, 0.05) 0%, transparent 40%);
      color: var(--text-main);
      font-family: 'Inter', -apple-system, sans-serif;
      min-height: 100vh;
      padding: 18px 20px 60px;
      line-height: 1.5;
    }

    /* Zero-Emoji Policy: All icons are SVG vector geometry */
    .svg-icon {
      display: inline-block;
      width: 1em;
      height: 1em;
      vertical-align: -0.15em;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .dashboard-container {
      max-width: 1420px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    /* Top Demo Notice Banner */
    .demo-notice-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 18px;
      background: linear-gradient(90deg, rgba(255, 209, 102, 0.15), rgba(255, 209, 102, 0.05));
      border: 1px solid var(--border-gold);
      border-radius: var(--radius-md);
      font-size: 12px;
      color: var(--gold-primary);
    }

    .demo-notice-banner.hidden {
      display: none;
    }

    /* Top Command Header */
    .top-command-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 16px 22px;
      background: rgba(12, 16, 26, 0.88);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      backdrop-filter: blur(24px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .brand-cluster {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .brand-avatar-link {
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      outline: none;
      transition: var(--transition);
    }

    .brand-avatar-link:focus-visible {
      outline: 2px solid var(--gold-primary);
      outline-offset: 3px;
    }

    .brand-avatar {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: #0a0d18;
      border: 1.5px solid rgba(255, 209, 102, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5), 0 0 18px rgba(255, 209, 102, 0.25);
      transition: var(--transition);
      overflow: hidden;
      flex-shrink: 0;
    }

    .brand-avatar-link:hover .brand-avatar {
      border-color: var(--gold-primary);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.6), 0 0 28px rgba(255, 209, 102, 0.5);
      transform: translateY(-2px) scale(1.05);
    }

    .brand-logo-img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      border-radius: 12px;
    }

    .brand-info h1 {
      font-size: 17px;
      font-weight: 800;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .brand-info p {
      font-size: 12px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--emerald-neon);
      box-shadow: 0 0 10px var(--emerald-neon);
      display: inline-block;
      animation: livePulse 2s infinite ease-in-out;
    }

    @keyframes livePulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.2); }
    }

    /* Scribe Level & XP Badge */
    .scribe-level-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 209, 102, 0.1);
      border: 1px solid rgba(255, 209, 102, 0.35);
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      color: var(--gold-primary);
    }

    .scribe-xp-bar-wrap {
      width: 55px;
      height: 5px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 999px;
      overflow: hidden;
      display: inline-block;
    }

    .scribe-xp-bar-fill {
      height: 100%;
      background: var(--gold-primary);
      border-radius: 999px;
      transition: width 0.4s ease;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 9px;
      flex-wrap: wrap;
    }

    .nav-pill-btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 7px 14px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: var(--transition);
      white-space: nowrap;
    }

    .nav-pill-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }

    .nav-pill-btn.primary {
      background: linear-gradient(135deg, rgba(255, 209, 102, 0.25), rgba(255, 209, 102, 0.1));
      border-color: var(--gold-primary);
      color: var(--gold-primary);
    }

    .nav-pill-btn.primary:hover {
      background: var(--gold-primary);
      color: #000;
      box-shadow: 0 0 18px rgba(255, 209, 102, 0.45);
    }

    .nav-pill-btn.cyan {
      background: rgba(56, 189, 248, 0.12);
      border-color: var(--cyan-neon);
      color: var(--cyan-neon);
    }

    .nav-pill-btn.cyan:hover {
      background: var(--cyan-neon);
      color: #000;
      box-shadow: 0 0 16px rgba(56, 189, 248, 0.4);
    }

    /* NEXT RECOMMENDED LESSON SPOTLIGHT */
    .spotlight-card {
      background: linear-gradient(135deg, rgba(17, 23, 38, 0.95) 0%, rgba(12, 16, 26, 0.98) 100%);
      border: 1px solid rgba(255, 209, 102, 0.28);
      border-radius: var(--radius-lg);
      padding: 18px 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 209, 102, 0.2);
      position: relative;
      overflow: hidden;
    }

    .spotlight-card::before {
      content: '';
      position: absolute;
      top: -50px;
      right: -50px;
      width: 220px;
      height: 220px;
      background: radial-gradient(circle, rgba(255, 209, 102, 0.1) 0%, transparent 70%);
      pointer-events: none;
    }

    .spotlight-left {
      display: flex;
      align-items: center;
      gap: 16px;
      max-width: 780px;
    }

    .spotlight-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: rgba(255, 209, 102, 0.15);
      border: 1px solid rgba(255, 209, 102, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--gold-primary);
      font-size: 22px;
      flex-shrink: 0;
    }

    .spotlight-text h2 {
      font-size: 15px;
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 3px;
    }

    .spotlight-text p {
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.4;
    }

    .spotlight-action {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .spotlight-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 20px;
      border-radius: 999px;
      background: linear-gradient(135deg, var(--gold-primary), #f59e0b);
      color: #000;
      font-weight: 700;
      font-size: 13px;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: var(--transition);
      box-shadow: 0 4px 16px rgba(255, 209, 102, 0.35);
    }

    .spotlight-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(255, 209, 102, 0.55);
    }

    /* DAILY COMMITMENT & TARGET WIDGET */
    .daily-target-strip {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 14px;
    }

    @media (max-width: 860px) {
      .daily-target-strip { grid-template-columns: 1fr; }
    }

    .target-card {
      background: rgba(14, 19, 32, 0.65);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 14px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }

    .target-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .target-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .target-stat {
      font-family: 'JetBrains Mono', monospace;
      font-size: 20px;
      font-weight: 800;
      color: #fff;
    }

    .target-progress-wrap {
      flex: 1;
      min-width: 200px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .target-bar-bg {
      width: 100%;
      height: 8px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 999px;
      overflow: hidden;
    }

    .target-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--cyan-neon), var(--emerald-neon));
      border-radius: 999px;
      transition: width 0.4s ease;
    }

    .target-presets {
      display: inline-flex;
      gap: 5px;
    }

    .target-preset-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 11px;
      color: var(--text-muted);
      cursor: pointer;
      transition: var(--transition);
    }

    .target-preset-btn.active {
      background: rgba(56, 189, 248, 0.15);
      border-color: var(--cyan-neon);
      color: var(--cyan-neon);
      font-weight: 700;
    }

    /* Filter & Mode Toolbar */
    .filter-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      background: rgba(14, 19, 32, 0.7);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 10px 16px;
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .filter-label {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .segmented-control {
      display: inline-flex;
      background: rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 999px;
      padding: 3px;
      gap: 3px;
    }

    .segment-btn {
      background: transparent;
      border: none;
      border-radius: 999px;
      padding: 5px 12px;
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      transition: var(--transition);
    }

    .segment-btn.active {
      background: var(--bg-card);
      border: 1px solid rgba(255, 209, 102, 0.35);
      color: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    }

    .data-mode-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--text-muted);
    }

    /* HERO TELEMETRY SCORECARD */
    .hero-scorecard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 14px;
    }

    .hero-card {
      background: linear-gradient(180deg, #121828 0%, #0d121f 100%);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06);
      transition: var(--transition);
    }

    .hero-card:hover {
      border-color: rgba(255, 255, 255, 0.16);
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
    }

    .hero-card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--text-muted);
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .hero-icon-pill {
      width: 28px;
      height: 28px;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
    }

    .hero-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 30px;
      font-weight: 800;
      color: #fff;
      margin: 8px 0 4px;
      line-height: 1.1;
    }

    .hero-sub {
      font-size: 12px;
      color: var(--text-dim);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .trend-up { color: var(--emerald-neon); font-weight: 600; }

    /* VIEW NAVIGATION TABS */
    .view-tabs-bar {
      display: flex;
      align-items: center;
      gap: 6px;
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 4px;
      overflow-x: auto;
    }

    .view-tab-btn {
      background: transparent;
      border: none;
      padding: 10px 18px;
      font-size: 13px;
      font-weight: 700;
      color: var(--text-muted);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: var(--transition);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }

    .view-tab-btn:hover {
      color: var(--text-main);
    }

    .view-tab-btn.active {
      color: var(--gold-primary);
      border-bottom-color: var(--gold-primary);
    }

    /* Tab Panes */
    .tab-pane {
      display: none;
      flex-direction: column;
      gap: 20px;
    }

    .tab-pane.active {
      display: flex;
    }

    /* Common Card Module */
    .dash-module {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 22px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06);
    }

    .module-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 12px;
      flex-wrap: wrap;
    }

    .module-title {
      font-size: 15px;
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .module-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text-muted);
    }

    /* ULTRA-COOL PERFORMANCE TRAJECTORY HUD & VISUALIZATION */
    .chart-module {
      background: linear-gradient(180deg, #101626 0%, #0c101c 100%);
      border: 1px solid rgba(255, 209, 102, 0.25);
      position: relative;
      overflow: hidden;
    }

    .chart-module::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1.5px;
      background: linear-gradient(90deg, transparent, rgba(255, 209, 102, 0.7), rgba(56, 189, 248, 0.7), transparent);
    }

    .chart-top-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding-bottom: 12px;
    }

    .chart-telemetry-chips {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .chart-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 11px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 11px;
      color: var(--text-muted);
      transition: var(--transition);
    }

    .chart-chip strong {
      font-family: 'JetBrains Mono', monospace;
      color: #fff;
    }

    .chart-chip.gold { border-color: rgba(255, 209, 102, 0.4); color: var(--gold-primary); }
    .chart-chip.emerald { border-color: rgba(52, 211, 153, 0.4); color: var(--emerald-neon); }
    .chart-chip.cyan { border-color: rgba(56, 189, 248, 0.4); color: var(--cyan-neon); }

    .chart-stream-toggle {
      display: inline-flex;
      background: rgba(0, 0, 0, 0.55);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 999px;
      padding: 2.5px;
      gap: 2px;
    }

    .stream-toggle-btn {
      background: transparent;
      border: none;
      border-radius: 999px;
      padding: 4px 11px;
      font-size: 11px;
      font-weight: 700;
      color: var(--text-dim);
      cursor: pointer;
      transition: var(--transition);
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .stream-toggle-btn:hover { color: #fff; }
    .stream-toggle-btn.active {
      background: var(--bg-card);
      border: 1px solid rgba(255, 209, 102, 0.4);
      color: var(--gold-primary);
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    }

    .chart-container {
      width: 100%;
      height: 240px;
      position: relative;
      margin-top: 6px;
      user-select: none;
      cursor: crosshair;
    }

    .perf-chart-svg {
      width: 100%;
      height: 100%;
      overflow: visible;
      display: block;
    }

    /* Glowing Splines & Neon Area Ribbons */
    .spline-velocity {
      fill: none;
      stroke: var(--gold-primary);
      stroke-width: 2.8;
      stroke-linecap: round;
      stroke-linejoin: round;
      filter: drop-shadow(0 0 8px rgba(255, 209, 102, 0.65));
      transition: opacity 0.3s ease;
    }

    .spline-precision {
      fill: none;
      stroke: var(--emerald-neon);
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 4 4;
      filter: drop-shadow(0 0 8px rgba(52, 211, 153, 0.65));
      transition: opacity 0.3s ease;
    }

    .area-velocity {
      fill: url(#goldGradient);
      opacity: 0.85;
      transition: opacity 0.3s ease;
    }

    .area-precision {
      fill: url(#emeraldGradient);
      opacity: 0.7;
      transition: opacity 0.3s ease;
    }

    /* Holographic Laser Crosshair & Interactive HUD */
    .chart-laser-line {
      position: absolute;
      top: 15px;
      bottom: 25px;
      width: 1.5px;
      background: linear-gradient(180deg, rgba(255, 209, 102, 0.9), rgba(56, 189, 248, 0.9), transparent);
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.8);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s ease, left 0.06s ease-out;
      z-index: 5;
    }

    .chart-laser-line.active { opacity: 1; }

    .chart-reticle-gold, .chart-reticle-emerald {
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      opacity: 0;
      z-index: 6;
      transition: opacity 0.15s ease, left 0.06s ease-out, top 0.06s ease-out;
    }

    .chart-reticle-gold {
      background: var(--gold-primary);
      box-shadow: 0 0 14px var(--gold-primary), inset 0 0 3px #000;
      border: 2px solid #fff;
    }

    .chart-reticle-emerald {
      background: var(--emerald-neon);
      box-shadow: 0 0 14px var(--emerald-neon), inset 0 0 3px #000;
      border: 2px solid #fff;
    }

    .chart-reticle-gold.active, .chart-reticle-emerald.active { opacity: 1; }

    /* Interactive Holographic HUD Tooltip Card */
    .chart-hologram-hud {
      position: absolute;
      bottom: calc(100% - 15px);
      left: 0;
      transform: translateX(-50%);
      background: rgba(12, 17, 28, 0.95);
      border: 1px solid rgba(255, 209, 102, 0.45);
      border-radius: 9px;
      padding: 10px 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.8), 0 0 24px rgba(255, 209, 102, 0.2);
      backdrop-filter: blur(18px);
      pointer-events: none;
      opacity: 0;
      z-index: 20;
      min-width: 190px;
      transition: opacity 0.15s ease, left 0.06s ease-out;
    }

    .chart-hologram-hud.active { opacity: 1; }

    .hud-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 4px;
    }

    .hud-title {
      font-size: 11px;
      font-weight: 800;
      color: #fff;
    }

    .hud-date {
      font-size: 10px;
      color: var(--text-dim);
    }

    .hud-metrics {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .hud-metric-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 15px;
      font-weight: 800;
    }

    .hud-metric-label {
      font-size: 9px;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .hud-delta {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 4px;
      background: rgba(52, 211, 153, 0.15);
      color: var(--emerald-neon);
    }

    .hud-delta.down {
      background: rgba(251, 113, 133, 0.15);
      color: var(--rose-neon);
    }

    /* 30-DAY ACTIVITY PUNCHCARD */
    .punchcard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(28px, 1fr));
      gap: 6px;
      padding: 8px 0;
    }

    .punch-cell {
      aspect-ratio: 1;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.04);
      transition: var(--transition);
      cursor: pointer;
      position: relative;
    }

    .punch-cell:hover {
      transform: scale(1.15);
      z-index: 10;
      border-color: #fff;
    }

    .punch-cell.lvl-1 { background: rgba(52, 211, 153, 0.25); border-color: rgba(52, 211, 153, 0.4); }
    .punch-cell.lvl-2 { background: rgba(52, 211, 153, 0.55); border-color: var(--emerald-neon); }
    .punch-cell.lvl-3 { background: rgba(255, 209, 102, 0.7); border-color: var(--gold-primary); box-shadow: 0 0 8px rgba(255, 209, 102, 0.3); }
    .punch-cell.lvl-4 { background: #ffd166; border-color: #fff; box-shadow: 0 0 12px rgba(255, 209, 102, 0.6); }

    /* BIOMECHANICAL 8-FINGER RADAR */
    .finger-bars-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 8px;
      margin-top: 4px;
    }

    .finger-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .f-bar-wrap {
      width: 100%;
      height: 90px;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 9px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 3px;
      position: relative;
    }

    .f-bar-fill {
      width: 100%;
      border-radius: 5px;
      background: var(--cyan-neon);
      transition: height 0.3s ease;
    }

    .f-bar-fill.gold { background: var(--gold-primary); }
    .f-bar-fill.emerald { background: var(--emerald-neon); }
    .f-bar-fill.rose { background: var(--rose-neon); }

    .f-label {
      font-size: 10px;
      font-weight: 600;
      color: var(--text-dim);
      text-align: center;
      line-height: 1.1;
    }

    .f-pct {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      color: #fff;
    }

    /* Hand Workload Balance Ratio */
    .hand-balance-meter {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 12px 14px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: var(--radius-sm);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .balance-label-row {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
    }

    .balance-bar-track {
      width: 100%;
      height: 8px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 999px;
      overflow: hidden;
      display: flex;
    }

    .balance-bar-left {
      height: 100%;
      background: var(--cyan-neon);
      transition: width 0.3s ease;
    }

    .balance-bar-right {
      height: 100%;
      background: var(--violet-neon);
      transition: width 0.3s ease;
    }

    /* RESPONSIVE TABLE (Modern Web Guidance Compliant) */
    .table-wrapper {
      overflow: auto;
      max-inline-size: 100%;
      max-block-size: 450px;
      container-type: inline-size;
      border-radius: var(--radius-sm);
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .sessions-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 12px;
      --label-1: "Lesson / Drill";
      --label-2: "Track";
      --label-3: "Accuracy";
      --label-4: "Speed";
      --label-5: "Duration";
      --label-6: "Result";
    }

    .sessions-table thead {
      position: sticky;
      inset-block-start: 0;
      z-index: 2;
      background: #0f1422;
    }

    .sessions-table th {
      text-align: left;
      padding: 10px 14px;
      color: var(--text-dim);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .sessions-table td {
      padding: 12px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      color: var(--text-main);
    }

    .sessions-table tr:hover td {
      background: rgba(255, 255, 255, 0.03);
    }

    /* Stacked card view for small container widths */
    @container (width < 640px) {
      .sessions-table, 
      .sessions-table tbody, 
      .sessions-table tr, 
      .sessions-table td {
        display: block;
      }

      .sessions-table thead {
        display: none;
      }

      .sessions-table tr {
        margin-bottom: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-sm);
        background: rgba(0, 0, 0, 0.3);
        padding: 8px 12px;
      }

      .sessions-table td {
        border-bottom: none;
        padding: 5px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .sessions-table td:nth-child(1)::before { content: var(--label-1) ": "; color: var(--text-dim); font-size: 11px; }
      .sessions-table td:nth-child(2)::before { content: var(--label-2) ": "; color: var(--text-dim); font-size: 11px; }
      .sessions-table td:nth-child(3)::before { content: var(--label-3) ": "; color: var(--text-dim); font-size: 11px; }
      .sessions-table td:nth-child(4)::before { content: var(--label-4) ": "; color: var(--text-dim); font-size: 11px; }
      .sessions-table td:nth-child(5)::before { content: var(--label-5) ": "; color: var(--text-dim); font-size: 11px; }
      .sessions-table td:nth-child(6)::before { content: var(--label-6) ": "; color: var(--text-dim); font-size: 11px; }
    }

    /* CURRICULUM ACCORDION & LESSON CARDS */
    .curriculum-accordion-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .unit-accordion-item {
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: var(--radius-md);
      overflow: hidden;
      transition: var(--transition);
    }

    .unit-accordion-item.open {
      border-color: rgba(255, 209, 102, 0.25);
    }

    .unit-accordion-header {
      padding: 14px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      user-select: none;
      background: rgba(255, 255, 255, 0.02);
    }

    .unit-accordion-header:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .unit-header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .unit-header-title {
      font-size: 14px;
      font-weight: 700;
      color: #fff;
    }

    .unit-header-count {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--gold-primary);
      font-weight: 600;
    }

    .unit-accordion-body {
      display: none;
      padding: 14px 18px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(0, 0, 0, 0.2);
    }

    .unit-accordion-item.open .unit-accordion-body {
      display: block;
    }

    .lessons-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 10px;
    }

    .lesson-mini-card {
      background: #0f1422;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: var(--radius-sm);
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      transition: var(--transition);
    }

    .lesson-mini-card:hover {
      border-color: rgba(255, 255, 255, 0.18);
      transform: translateY(-2px);
    }

    .lesson-mini-card.mastered {
      border-color: rgba(52, 211, 153, 0.3);
      background: linear-gradient(180deg, rgba(52, 211, 153, 0.05) 0%, #0f1422 100%);
    }

    .lesson-card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .lesson-card-title {
      font-size: 13px;
      font-weight: 700;
      color: #fff;
    }

    .lesson-card-keys {
      font-family: 'Kantumruy Pro', sans-serif;
      font-size: 14px;
      color: var(--gold-primary);
      font-weight: 600;
    }

    .lesson-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 4px;
      padding-top: 6px;
      border-top: 1px solid rgba(255, 255, 255, 0.04);
    }

    /* ADAPTIVE CHARACTER MATRIX */
    .char-matrix-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(42px, 1fr));
      gap: 6px;
    }

    .char-badge {
      height: 48px;
      background: #0d121f;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 9px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition);
      font-family: 'Kantumruy Pro', sans-serif;
    }

    .char-badge:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
      border-color: var(--cyan-neon);
    }

    .char-glyph {
      font-size: 17px;
      font-weight: 700;
      color: #fff;
    }

    .char-acc-sub {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      font-weight: 700;
      color: var(--text-dim);
    }

    .char-badge.mastered {
      border-color: rgba(52, 211, 153, 0.5);
      background: #092c1d;
    }

    .char-badge.mastered .char-glyph { color: var(--emerald-neon); }

    .char-badge.familiar {
      border-color: rgba(255, 209, 102, 0.5);
      background: #2b2108;
    }

    .char-badge.familiar .char-glyph { color: var(--gold-primary); }

    .char-badge.weak {
      border-color: rgba(251, 113, 133, 0.6);
      background: #330c14;
    }

    .char-badge.weak .char-glyph { color: var(--rose-neon); }

    /* WEAK-KEY MATRIX & DRILL LAUNCHER */
    .weak-keys-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 12px;
    }

    .weak-key-card {
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(251, 113, 133, 0.25);
      border-radius: var(--radius-sm);
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      transition: var(--transition);
    }

    .weak-key-card:hover {
      border-color: var(--rose-neon);
      transform: translateY(-2px);
    }

    .weak-key-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .key-badge-square {
      width: 40px;
      height: 42px;
      background: linear-gradient(180deg, #24141e, #140910);
      border: 1.5px solid var(--rose-neon);
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Kantumruy Pro', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #fff;
      box-shadow: 0 0 10px rgba(251, 113, 133, 0.3);
    }

    .weak-key-meta h4 {
      font-size: 13px;
      font-weight: 700;
      color: #fff;
    }

    .weak-key-meta p {
      font-size: 11px;
      color: var(--text-muted);
    }

    .drill-mini-btn {
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(251, 113, 133, 0.15);
      border: 1px solid var(--rose-neon);
      color: var(--rose-neon);
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      transition: var(--transition);
      display: inline-flex;
      align-items: center;
      gap: 5px;
      white-space: nowrap;
    }

    .drill-mini-btn:hover {
      background: var(--rose-neon);
      color: #000;
      box-shadow: 0 0 12px rgba(251, 113, 133, 0.5);
    }

    /* INTERACTIVE 3D MECHANICAL KEYBOARD HEATMAP */
    .keyboard-heatmap-wrap {
      display: flex;
      flex-direction: column;
      gap: 6px;
      background: rgba(0, 0, 0, 0.5);
      padding: 16px;
      border-radius: var(--radius-md);
      border: 1px solid rgba(255, 255, 255, 0.06);
      user-select: none;
      overflow-x: auto;
    }

    .hm-row {
      display: flex;
      gap: 5px;
      justify-content: center;
      min-width: 680px;
    }

    .hm-key {
      flex: 1;
      height: 42px;
      max-width: 50px;
      background: #141a29;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 9px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      font-family: 'Kantumruy Pro', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #fff;
      cursor: pointer;
      transition: var(--transition);
      box-shadow: 0 4px 0 #090c14, 0 5px 10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12);
    }

    .hm-key:hover {
      transform: translateY(-2px);
      z-index: 10;
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.6);
      border-color: #fff;
    }

    .hm-key:active {
      transform: translateY(3px);
      box-shadow: 0 1px 0 #090c14, inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    .hm-key.w-15 { max-width: 72px; font-size: 11px; }
    .hm-key.w-20 { max-width: 90px; font-size: 11px; }
    .hm-key.w-space { max-width: 270px; font-size: 11px; }

    .hm-key.high {
      background: #093322;
      border-color: rgba(52, 211, 153, 0.6);
      color: var(--emerald-neon);
      box-shadow: 0 4px 0 #04170e, 0 6px 14px rgba(52, 211, 153, 0.3), inset 0 1px 0 rgba(52, 211, 153, 0.4);
    }

    .hm-key.mid {
      background: #3d2f09;
      border-color: rgba(255, 209, 102, 0.6);
      color: var(--gold-primary);
      box-shadow: 0 4px 0 #1f1704, 0 6px 14px rgba(255, 209, 102, 0.3), inset 0 1px 0 rgba(255, 209, 102, 0.4);
    }

    .hm-key.low {
      background: #3b0e17;
      border-color: rgba(251, 113, 133, 0.7);
      color: var(--rose-neon);
      box-shadow: 0 4px 0 #1f050b, 0 6px 14px rgba(251, 113, 133, 0.3), inset 0 1px 0 rgba(251, 113, 133, 0.4);
    }

    /* MILESTONE ACHIEVEMENTS & TROPHIES */
    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 14px;
    }

    .trophy-card {
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: var(--radius-md);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      position: relative;
      transition: var(--transition);
    }

    .trophy-card.unlocked {
      border-color: rgba(255, 209, 102, 0.38);
      background: linear-gradient(180deg, rgba(255, 209, 102, 0.09) 0%, rgba(0, 0, 0, 0.4) 100%);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }

    .trophy-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .trophy-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-dim);
      font-size: 17px;
    }

    .trophy-card.unlocked .trophy-icon {
      background: rgba(255, 209, 102, 0.2);
      color: var(--gold-primary);
    }

    .trophy-name {
      font-size: 14px;
      font-weight: 700;
      color: #fff;
    }

    .trophy-desc {
      font-size: 11px;
      color: var(--text-muted);
      line-height: 1.4;
    }

    .trophy-meter-bg {
      width: 100%;
      height: 6px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 999px;
      overflow: hidden;
      margin-top: 4px;
    }

    .trophy-meter-fill {
      height: 100%;
      background: var(--gold-primary);
      border-radius: 999px;
      transition: width 0.3s ease;
    }

    .trophy-status {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-unlocked { color: var(--emerald-neon); }
    .status-locked { color: var(--text-dim); }

    /* MODAL OVERLAYS */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.82);
      backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }

    .modal-backdrop.active {
      opacity: 1;
      pointer-events: auto;
    }

    .modal-content {
      background: #0e1320;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 26px;
      max-width: 580px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85);
      position: relative;
    }

    .modal-close-btn {
      position: absolute;
      top: 18px;
      right: 18px;
      background: rgba(255, 255, 255, 0.06);
      border: none;
      color: var(--text-muted);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition);
    }

    .modal-close-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
    }

    /* SCRIBE DIPLOMA & CERTIFICATE */
    .certificate-sheet {
      background: linear-gradient(135deg, #0d121f 0%, #060912 100%);
      border: 3px double rgba(255, 209, 102, 0.5);
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      position: relative;
      margin: 16px 0;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(255, 209, 102, 0.08);
    }

    .cert-heading-khmer {
      font-family: 'Moul', serif;
      font-size: 16px;
      color: var(--gold-primary);
      margin-bottom: 4px;
    }

    .cert-heading-en {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--text-muted);
      margin-bottom: 16px;
    }

    .cert-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 14px;
    }

    .cert-recipient {
      font-size: 22px;
      font-weight: 800;
      color: var(--gold-primary);
      border-bottom: 1px dashed rgba(255, 209, 102, 0.4);
      padding-bottom: 4px;
      display: inline-block;
      margin: 10px 0 16px;
    }

    .cert-stats-row {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 16px 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
    }

    /* FOOTER */
    .dash-footer {
      text-align: center;
      padding: 32px 20px 24px;
      color: var(--text-dim);
      font-size: 12px;
      border-top: 1px solid var(--border-subtle);
      margin-top: 24px;
    }

    .dash-footer-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .dash-footer-brand {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .dash-footer-logo {
      width: 22px;
      height: 22px;
      border-radius: 6px;
      border: 1px solid rgba(255, 209, 102, 0.4);
      box-shadow: 0 0 8px rgba(255, 209, 102, 0.2);
    }

    .dash-footer-name {
      font-weight: 700;
      font-size: 13px;
      color: var(--gold-primary);
      letter-spacing: 0.04em;
    }

    .dash-footer-chip {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 2px 7px;
      border-radius: 999px;
      background: rgba(255, 209, 102, 0.12);
      border: 1px solid rgba(255, 209, 102, 0.3);
      color: var(--gold-primary);
    }

    /* PRINT STYLING */
    @media print {
      body * {
        visibility: hidden;
      }
      .certificate-sheet, .certificate-sheet * {
        visibility: visible;
      }
      .certificate-sheet {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        margin: 0;
        border: 2px solid #000;
        color: #000;
        background: #fff;
      }
    }
`;
