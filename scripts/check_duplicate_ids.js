const fs = require('fs');

['dashboard.html', 'index.html', 'welcome.html'].forEach(fn => {
  const html = fs.readFileSync(fn, 'utf8');
  const re = /(?:^|[\s<])id=["']([^"']+)["']/g;
  const counts = {};
  let m;
  while ((m = re.exec(html)) !== null) {
    counts[m[1]] = (counts[m[1]] || 0) + 1;
  }
  const dups = Object.entries(counts).filter(([_, c]) => c > 1);
  console.log(`${fn}: ${dups.length} duplicate ID(s)`);
  dups.forEach(([id, c]) => console.log(`  - ${id} (${c} occurrences)`));
});
