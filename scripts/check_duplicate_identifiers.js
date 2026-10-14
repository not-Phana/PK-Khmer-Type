const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatches = [...html.matchAll(/src=["'](js\/[^"']+|data\/[^"']+)["']/g)].map(m => m[1].replace(/\?.*$/, ''));
console.log('Included scripts in order:\n', scriptMatches.join('\n'));

const identifiers = {};
scriptMatches.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const m = line.match(/^(const|let)\s+([a-zA-Z0-9_$]+)/);
    if (m) {
      const name = m[2];
      if (!identifiers[name]) identifiers[name] = [];
      identifiers[name].push({ file, line: idx + 1 });
    }
  });
});

const duplicates = Object.entries(identifiers).filter(([k, v]) => v.length > 1);
console.log('\nDUPLICATE TOP-LEVEL CONST/LET IDENTIFIERS:');
duplicates.forEach(([name, locations]) => {
  console.log(` - ${name}:`);
  locations.forEach(loc => console.log(`     ${loc.file}:${loc.line}`));
});
