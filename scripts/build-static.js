const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const outputDir = path.join(root, 'dist');
const entries = ['index.html', 'src'];

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

for (const entry of entries) {
  const from = path.join(root, entry);
  const to = path.join(outputDir, entry);
  fs.cpSync(from, to, { recursive: true });
}

console.log(`Static site built in ${path.relative(root, outputDir)}/`);
