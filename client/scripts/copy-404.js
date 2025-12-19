// Script to copy index.html to 404.html after build
// This enables React Router to work on GitHub Pages

const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const indexPath = path.join(buildDir, 'index.html');
const notFoundPath = path.join(buildDir, '404.html');

if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, notFoundPath);
  console.log('✓ Copied index.html to 404.html for GitHub Pages');
} else {
  console.error('✗ index.html not found in build directory');
  process.exit(1);
}

