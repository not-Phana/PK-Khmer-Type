// scripts/build_full_dashboard.js
// Assembles the enhanced, cooler dashboard.html for PK Khmer Type
// Compliant with Strict Zero-Emoji Policy: 100% SVG Vector Geometry

const fs = require('fs');
const path = require('path');

const styles = require('./dashboard_styles.js');
const markup = require('./dashboard_markup.js');
const script = require('./dashboard_script.js');

const targetPath = path.join(__dirname, '..', 'dashboard.html');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PK Khmer Type — Analytics &amp; Mastery Dashboard</title>
  <link rel="icon" type="image/svg+xml" href="assets/dashboard-logo.svg">
  <link rel="alternate icon" type="image/svg+xml" href="logo.svg">
  <link rel="apple-touch-icon" href="logo.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700;800&family=Kantumruy+Pro:wght@400;500;600;700&family=Moul&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
${styles}
  </style>
</head>
<body>

${markup}

  <!-- SCRIPT FOR LIVE TELEMETRY & ADAPTIVE MULTI-TRACK ENGINE -->
  <script>
${script}
  </script>
</body>
</html>
`;

fs.writeFileSync(targetPath, htmlContent, 'utf8');
console.log('Successfully wrote upgraded dashboard.html (' + htmlContent.length + ' bytes)');
