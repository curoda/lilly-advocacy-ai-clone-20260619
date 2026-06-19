#!/usr/bin/env node
// Build generator: turns captured page.html files into the deployable static site.
const fs = require('fs');
const path = require('path');

const CAP = path.join(__dirname, 'capture');
const SITE = path.join(__dirname, 'site');

// slug -> output route directory (served as <route>/index.html)
const lines = fs.readFileSync(path.join(__dirname, 'capture', '_urls.tsv'), 'utf8')
  .trim().split('\n').map(l => l.split('\t'));

function routeFor(slug) {
  if (slug === 'home') return 'lilly-advocacy-ai';
  return slug; // e/<x> and privacy map 1:1
}

function transform(html) {
  // Keep internal navigation within the clone: rewrite absolute same-domain URLs to root-relative.
  html = html.split('https://events.helloeiko.com/').join('/');
  // Protocol-relative or accidental double — normalize any leftover //lilly etc not expected.
  return html;
}

let count = 0;
for (const [slug] of lines) {
  const src = path.join(CAP, slug, 'page.html');
  if (!fs.existsSync(src)) { console.error('MISSING capture for', slug); continue; }
  const route = routeFor(slug);
  const outDir = path.join(SITE, route);
  fs.mkdirSync(outDir, { recursive: true });
  const html = transform(fs.readFileSync(src, 'utf8'));
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  count++;
}
console.log('Generated', count, 'pages into site/');
