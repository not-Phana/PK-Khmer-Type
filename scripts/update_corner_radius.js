const fs = require('fs');
const path = require('path');

const targetFiles = [
  'css/base.css',
  'css/keyboard.css',
  'css/typing.css',
  'css/lessons.css',
  'css/responsive.css',
  'css/settings.css',
  'css/tutorial.css',
  'css/custom-lessons.css',
  'css/welcome.css',
  'Documents/docs.css',
  'launch/launch.css',
  'launch/launch-theme.css',
  'dashboard.html',
  '404.html',
  'motion-graphic.html',
  'index.html',
  'profile/Phana_Phley_KON_Biography.html',
  'docs/PK-KHMER-TYPE-ULTIMATE-MASTER-PLAN.html',
  'concepts/custom-cursor-showcase/step1-custom-cursor.html',
  'concepts/custom-cursor-showcase/step2-version1-pulse.html',
  'concepts/custom-cursor-showcase/step2-version2-tilt.html',
  'concepts/custom-cursor-showcase/step2-version3-glow-sweep.html',
  'concepts/lesson_chassis_redesigns/preview.html',
  'concepts/logo_drafts/preview.html',
  'concepts/celestial_starlight_pointer.html',
  'concepts/entropy-engine.html',
  'concepts/pk-cursor-system.html'
];

function transformRadius(val) {
  const trimmed = val.trim();
  const isImportant = /!important/i.test(trimmed);
  const cleanVal = trimmed.replace(/\s*!important/i, '').trim();

  // If already 50% or contains % (circular/ellipse graphics like flame or motes)
  if (cleanVal.includes('%')) {
    return trimmed;
  }
  // If inherit or 0
  if (cleanVal === '0' || cleanVal === '0px' || cleanVal === 'inherit' || cleanVal === 'none') {
    return trimmed;
  }
  // Directional with 0, like 0 8px 8px 0, 0 5px 5px 0, 0 9px 9px 0
  if (cleanVal === '0 8px 8px 0' || cleanVal === '0 5px 5px 0' || cleanVal === '0 9px 9px 0') {
    return isImportant ? '0 9px 9px 0 !important' : '0 9px 9px 0';
  }
  // Already 9px
  if (cleanVal === '9px') {
    return isImportant ? '9px !important' : '9px';
  }

  // Any other corner radius: 5px, 8px, 12px, 14px, 16px, 20px, 999px, 9999px, var(--radius-...)
  return isImportant ? '9px !important' : '9px';
}

function processFile(filePath, dryRun = true) {
  if (!fs.existsSync(filePath)) return { file: filePath, replaced: 0 };
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;

  // Add --radius design tokens to css/base.css root if missing
  if (filePath === 'css/base.css' && !content.includes('--radius:')) {
    content = content.replace(
      '--fx-border:rgba(180,220,255,0.2);',
      '--fx-border:rgba(180,220,255,0.2);\n    --radius:9px; --radius-sm:9px; --radius-md:9px; --radius-lg:9px; --radius-xl:9px;'
    );
    count++;
  }

  // Also update CSS variable definitions like --radius-sm, --radius-md, --radius-lg, --radius-xl
  let updatedContent = content.replace(/(--radius(?:-[a-z]+)?\s*:\s*)([0-9]+px);/g, (match, prefix, val) => {
    if (val !== '9px') {
      count++;
      return `${prefix}9px;`;
    }
    return match;
  });

  // Replace border-radius declarations
  updatedContent = updatedContent.replace(/(border-radius\s*:\s*)([^;}"']+)/g, (match, prefix, val) => {
    const newVal = transformRadius(val);
    if (newVal !== val.trim()) {
      count++;
      return `${prefix}${newVal}`;
    }
    return match;
  });

  if (!dryRun && count > 0) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
  }

  return { file: filePath, replaced: count };
}

const isApply = process.argv.includes('--apply');
const isPrintMappings = process.argv.includes('--mappings');
const isAudit = process.argv.includes('--audit');

if (isAudit) {
  function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      if (['node_modules', '.git', 'scratch', '.gemini'].includes(file)) return;
      const full = path.join(dir, file);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) results = results.concat(walk(full));
      else if (file.endsWith('.html') || file.endsWith('.css')) results.push(full.replace(/\\/g, '/'));
    });
    return results;
  }
  const all = walk('.');
  let non9pxCount = 0;
  all.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    const matches = content.match(/border-radius\s*:\s*([^;}"']+)/g) || [];
    matches.forEach(m => {
      const val = m.replace(/border-radius\s*:\s*/, '').trim();
      const clean = val.replace(/\s*!important/i, '').trim();
      if (clean.includes('%') || clean === '0' || clean === '0px' || clean === 'inherit' || clean === 'none' || clean === '9px' || clean === '0 9px 9px 0') {
        return;
      }
      console.log(`[AUDIT NON-9PX] ${f}: ${val}`);
      non9pxCount++;
    });
  });
  console.log(`\nAudit completed: ${non9pxCount} non-9px corner radius values found across all HTML/CSS files.`);
} else if (isPrintMappings) {
  const distinctReplacements = new Map();
  targetFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    const content = fs.readFileSync(f, 'utf8');
    content.replace(/(border-radius\s*:\s*)([^;}"']+)/g, (match, prefix, val) => {
      const newVal = transformRadius(val);
      if (newVal !== val.trim()) {
        distinctReplacements.set(val.trim(), newVal);
      }
    });
  });
  console.log('Distinct replacements count:', distinctReplacements.size);
  for (const [from, to] of distinctReplacements.entries()) {
    console.log(`  "${from}" => "${to}"`);
  }
} else {
  let grandTotal = 0;
  targetFiles.forEach(f => {
    const res = processFile(f, !isApply);
    console.log(`${res.file}: ${res.replaced} replacements`);
    grandTotal += res.replaced;
  });
  console.log(`\nGrand Total Replacements: ${grandTotal} (Mode: ${isApply ? 'APPLY' : 'DRY-RUN'})`);
}
