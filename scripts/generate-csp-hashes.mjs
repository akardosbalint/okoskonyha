// Regenerates the script-src / style-src hash allowlists in vercel.json's CSP header from the
// actual built HTML in dist/client. Astro externalizes most component <script>s automatically
// (already covered by script-src 'self'), but small scripts/styles used on a single page — the
// testimonial carousel, the newsletter form, the mobile sticky CTA, and every page's JSON-LD
// block — get inlined as an optimization. Hashing their exact content lets the CSP drop
// 'unsafe-inline' for scripts and styles entirely instead of trusting all inline execution.
//
// Vercel reads vercel.json from the committed repo state, not from files a build step mutates
// on disk — so this is a local/CI workflow step, not a production build hook. Run it after any
// change to a component with an inline <script> or <style> block, then rebuild and commit the
// updated vercel.json:
//
//   npm run build && npm run csp:hashes
//
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(rootDir, 'dist', 'client');
const vercelConfigPath = path.join(rootDir, 'vercel.json');

function walkHtmlFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtmlFiles(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function sha256(content) {
  return `'sha256-${createHash('sha256').update(content, 'utf8').digest('base64')}'`;
}

function collectInlineHashes(files) {
  const scriptTagRe = /<script([^>]*)>([\s\S]*?)<\/script>/g;
  const styleTagRe = /<style([^>]*)>([\s\S]*?)<\/style>/g;
  const hasSrcAttr = /\bsrc=/;

  const scripts = new Set();
  const styles = new Set();

  for (const file of files) {
    const html = readFileSync(file, 'utf-8');

    for (const [, attrs, content] of html.matchAll(scriptTagRe)) {
      if (hasSrcAttr.test(attrs) || !content.trim()) continue;
      scripts.add(sha256(content));
    }
    for (const [, attrs, content] of html.matchAll(styleTagRe)) {
      if (hasSrcAttr.test(attrs) || !content.trim()) continue;
      styles.add(sha256(content));
    }
  }

  return { scripts: [...scripts].sort(), styles: [...styles].sort() };
}

function replaceDirective(csp, directive, newValue) {
  const re = new RegExp(`${directive} [^;]*`);
  if (!re.test(csp)) {
    throw new Error(`generate-csp-hashes: CSP has no "${directive}" directive — refusing to guess, fix vercel.json manually.`);
  }
  return csp.replace(re, `${directive} ${newValue}`);
}

const files = walkHtmlFiles(distDir);
if (files.length === 0) {
  throw new Error(`generate-csp-hashes: no HTML files found under ${distDir} — run "astro build" first.`);
}

const { scripts, styles } = collectInlineHashes(files);
if (scripts.length === 0) {
  throw new Error('generate-csp-hashes: found 0 inline <script> blocks across the whole build — that contradicts the known site architecture, aborting instead of writing a CSP that would break GTM/JSON-LD.');
}

const config = JSON.parse(readFileSync(vercelConfigPath, 'utf-8'));
const cspEntry = config.headers?.[0]?.headers?.find((h) => h.key === 'Content-Security-Policy');
if (!cspEntry) {
  throw new Error('generate-csp-hashes: no Content-Security-Policy header found in vercel.json.');
}

let csp = cspEntry.value;
csp = replaceDirective(
  csp,
  'script-src',
  `'self' ${scripts.join(' ')} https://www.googletagmanager.com https://www.google-analytics.com`,
);
csp = replaceDirective(csp, 'style-src', `'self'${styles.length ? ' ' + styles.join(' ') : ''}`);
cspEntry.value = csp;

writeFileSync(vercelConfigPath, JSON.stringify(config, null, 2) + '\n');

console.log(
  `generate-csp-hashes: wrote ${scripts.length} script-src hash(es) and ${styles.length} style-src hash(es) into vercel.json (scanned ${files.length} HTML files).`,
);
