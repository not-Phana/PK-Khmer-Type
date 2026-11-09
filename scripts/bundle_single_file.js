/**
 * PK Khmer Type - Sovereign Single-File Offline Archival Bundler (Phase I)
 * Compiles index.html, all CSS stylesheets, JavaScript modules,
 * and critical offline data assets into a standalone single-file distribution.
 *
 * Strict Zero-Emoji Policy Enforced.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const OUTPUT_FILE = path.join(DIST_DIR, 'pk-khmer-type-standalone.html');

function readLocal(relPath) {
  const fullPath = path.join(ROOT_DIR, relPath.split('?')[0]);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Referenced asset does not exist: ${relPath} (${fullPath})`);
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function bundle() {
  console.log('[Phase I Bundler] Starting sovereign single-file archival compile...');

  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  let html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');

  // 1. Inline CSS stylesheets
  html = html.replace(/<link\s+rel=["']stylesheet["']\s+href=["']([^"']+)["']\s*\/?>/gi, (match, href) => {
    try {
      const css = readLocal(href);
      return `<style data-source="${href.split('?')[0]}">\n${css}\n</style>`;
    } catch (err) {
      console.warn(`[Phase I Bundler] Warning: Failed to inline stylesheet ${href}: ${err.message}`);
      return match;
    }
  });

  // 2. Pre-embed offline JSON datasets
  const keyboardJson = fs.existsSync(path.join(ROOT_DIR, 'data/keyboard.json'))
    ? fs.readFileSync(path.join(ROOT_DIR, 'data/keyboard.json'), 'utf8')
    : '{}';
  const literatureJson = fs.existsSync(path.join(ROOT_DIR, 'data/literature/khmer_classics.json'))
    ? fs.readFileSync(path.join(ROOT_DIR, 'data/literature/khmer_classics.json'), 'utf8')
    : '{}';

  const offlineDataShim = `
  <script id="pkOfflineStandaloneShim">
    window.__PK_STANDALONE_OFFLINE = true;
    window.__PK_EMBEDDED_KEYBOARD = ${keyboardJson};
    window.__PK_EMBEDDED_LITERATURE = ${literatureJson};

    // Virtual fetch shim for total air-gapped file:/// execution
    (function() {
      const origFetch = window.fetch;
      window.fetch = async function(resource, init) {
        const urlStr = typeof resource === 'string' ? resource : (resource && resource.url ? resource.url : '');
        if (urlStr.includes('keyboard.json')) {
          return new Response(JSON.stringify(window.__PK_EMBEDDED_KEYBOARD), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        if (urlStr.includes('khmer_classics.json')) {
          return new Response(JSON.stringify(window.__PK_EMBEDDED_LITERATURE), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        if (typeof origFetch === 'function') {
          return origFetch(resource, init);
        }
        return Promise.reject(new Error('Network offline'));
      };
    })();
  </script>
  `;

  // 3. Inline JavaScript files (deferred modules placed safely before </body>, async render-blocking in place)
  html = html.replace(/<script\s+(?:async\s+)?blocking=["']render["']\s+src=["']([^"']+)["'][^>]*><\/script>/gi, (match, src) => {
    if (/^https?:\/\//i.test(src)) return match;
    try {
      const js = readLocal(src);
      const safeJs = js.replace(/<\/script>/gi, '<\\/script>');
      return `<script data-source="${src.split('?')[0]}">\n${safeJs}\n</script>`;
    } catch (err) {
      console.warn(`[Phase I Bundler] Warning: Failed to inline script ${src}: ${err.message}`);
      return match;
    }
  });

  const inlinedDeferBlocks = [];
  html = html.replace(/<script\s+defer\s+src=["']([^"']+)["'][^>]*><\/script>/gi, (match, src) => {
    try {
      const js = readLocal(src);
      // Clean potential script closing tag collisions
      const safeJs = js.replace(/<\/script>/gi, '<\\/script>');
      inlinedDeferBlocks.push(`<script data-source="${src.split('?')[0]}">\n${safeJs}\n</script>`);
      return '';
    } catch (err) {
      console.warn(`[Phase I Bundler] Warning: Failed to inline script ${src}: ${err.message}`);
      inlinedDeferBlocks.push(match);
      return '';
    }
  });

  if (inlinedDeferBlocks.length > 0) {
    const payload = `${offlineDataShim}\n${inlinedDeferBlocks.join('\n')}\n</body>`;
    html = html.replace('</body>', () => payload);
  } else {
    html = html.replace(/<script defer src="js\/icons\.js[^"]*"><\/script>/, () => `${offlineDataShim}\n  <script defer src="js/icons.js?v=86"></script>`);
  }

  // 4. Verify Zero-Emoji compliance in output
  const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  if (emojiRegex.test(html)) {
    throw new Error('Zero-Emoji violation: Standalone bundle contains emoji characters!');
  }

  fs.writeFileSync(OUTPUT_FILE, html, 'utf8');
  const stats = fs.statSync(OUTPUT_FILE);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`[Phase I Bundler] Sovereign single-file standalone bundle successfully compiled.`);
  console.log(`[Phase I Bundler] Destination: ${OUTPUT_FILE}`);
  console.log(`[Phase I Bundler] Size: ${stats.size} bytes (${sizeMb} MB)`);
}

bundle();
