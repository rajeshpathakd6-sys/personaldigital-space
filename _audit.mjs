import fs from 'fs';
import path from 'path';

const root = process.cwd();
function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk(fp, acc);
    else acc.push(fp);
  }
  return acc;
}
const allFiles = walk(root);
const htmlFiles = allFiles.filter(f => f.endsWith('.html'));
const existing = new Set(allFiles.map(f => path.relative(root, f).split(path.sep).join('/').toLowerCase()));
const exists = rel => existing.has(rel.split('\\').join('/').toLowerCase());

const attrRe = /(?:href|src)\s*=\s*"([^"]+)"/gi;
let broken = [];
let total = 0;
for (const hf of htmlFiles) {
  if (path.basename(hf) === 'TEMPLATE-subpage.html') continue;
  const txt = fs.readFileSync(hf, 'utf8');
  const dir = path.dirname(hf);
  let m;
  while ((m = attrRe.exec(txt))) {
    let url = m[1].trim();
    if (!url) continue;
    if (/^(https?:|mailto:|tel:|data:|#|javascript:)/i.test(url)) continue;
    url = url.split('#')[0].split('?')[0];
    if (!url) continue;
    total++;
    const target = path.normalize(path.join(dir, url));
    const rel = path.relative(root, target).split(path.sep).join('/');
    if (rel.startsWith('..')) { broken.push([path.relative(root, hf).split(path.sep).join('/'), m[1], 'ESCAPES ROOT']); continue; }
    if (!exists(rel)) broken.push([path.relative(root, hf).split(path.sep).join('/'), m[1], 'MISSING']);
  }
}
console.log(`Checked ${total} local href/src refs across ${htmlFiles.length} HTML files (TEMPLATE excluded).`);
console.log(`BROKEN: ${broken.length}`);
const byFile = {};
for (const [f, u, why] of broken) (byFile[f] = byFile[f] || []).push(`${why}: ${u}`);
for (const f of Object.keys(byFile).sort()) {
  console.log(`\n${f}  (${byFile[f].length})`);
  for (const u of byFile[f]) console.log(`   - ${u}`);
}
