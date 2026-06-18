import fs from 'fs';
import path from 'path';

const root = process.cwd();
function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk(fp, acc);
    else if (fp.endsWith('.html')) acc.push(fp);
  }
  return acc;
}
const existing = new Set(walk(root).map(f => path.relative(root, f).split(path.sep).join('/').toLowerCase()));
// add all files (not just html) for asset existence
function walkAll(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walkAll(fp, acc); else acc.push(fp);
  }
  return acc;
}
const allSet = new Set(walkAll(root).map(f => path.relative(root, f).split(path.sep).join('/').toLowerCase()));

const htmlFiles = walk(root).filter(f => path.basename(f) !== 'TEMPLATE-subpage.html');
// match url('...'), url("..."), url(&quot;...&quot;), url(...)
const re = /url\(\s*(?:&quot;|['"])?\s*([^'")]+?\.(?:jpe?g|png|webp|gif|svg))\s*(?:&quot;|['"])?\s*\)/gi;

let broken = [];
for (const hf of htmlFiles) {
  const txt = fs.readFileSync(hf, 'utf8');
  const dir = path.dirname(hf);
  let m;
  while ((m = re.exec(txt))) {
    let u = m[1].trim();
    if (/^(https?:|data:)/i.test(u)) continue;
    const target = path.normalize(path.join(dir, u));
    const rel = path.relative(root, target).split(path.sep).join('/');
    if (!allSet.has(rel.toLowerCase())) broken.push([path.relative(root, hf).split(path.sep).join('/'), u]);
  }
}
console.log(`Missing background-image assets: ${broken.length}`);
const byFile = {};
for (const [f, u] of broken) (byFile[f] = byFile[f] || new Set()).add(u);
for (const f of Object.keys(byFile).sort()) console.log(`\n${f}\n   ${[...byFile[f]].join('\n   ')}`);
