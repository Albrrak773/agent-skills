#!/usr/bin/env node
// work-report, step 7: check a filled report before publishing. No dependencies.
//
//   node scripts/check-report.mjs <report-dir>/index.html
//
// Errors (exit 1) are things a reader would see as broken; warnings are judgment calls.
// It checks structure, not quality: passing says nothing about whether the writing is good.

import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

const file = process.argv[2];
if (!file) { console.error("usage: check-report.mjs <report>/index.html"); process.exit(2); }
const html = readFileSync(file, "utf8");
const dir = dirname(resolve(file));
const errors = [], warnings = [];
const err = (m) => errors.push(m), warn = (m) => warnings.push(m);
const lineOf = (idx) => html.slice(0, idx).split("\n").length;

// Page body only: the lightbox markup and script at the end are shared machinery.
const bodyEnd = html.indexOf('<dialog class="lb"');
const page = bodyEnd > 0 ? html.slice(0, bodyEnd) : html;
const noComments = page.replace(/<!--[\s\S]*?-->/g, (m) => " ".repeat(m.length));

// 1. placeholders left over
for (const m of noComments.matchAll(/\{\{[^}]*\}\}/g)) err(`line ${lineOf(m.index)}: unfilled placeholder ${m[0].slice(0, 60)}`);

// 2. title
const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
if (!title) err("no <title>");
else if (/[:|]| - /.test(title.replace(/\d:\d/g, ""))) warn(`title "${title}" carries an explainer; keep it a name ("<Project> Work Report, <dates>")`);

// 3. images: local file exists, alt and intrinsic size present
for (const m of noComments.matchAll(/<img\b[^>]*>/g)) {
  const tag = m[0], at = `line ${lineOf(m.index)}`;
  const src = (tag.match(/\bsrc="([^"]*)"/) || [])[1];
  if (!src) { err(`${at}: <img> without src`); continue; }
  if (!/^(data:|https?:)/.test(src) && !existsSync(resolve(dir, src))) err(`${at}: image file missing: ${src}`);
  if (!/\balt="[^"]+"/.test(tag)) err(`${at}: <img> without alt text (${src})`);
  if (!/\bwidth="\d+"/.test(tag) || !/\bheight="\d+"/.test(tag)) warn(`${at}: <img> without width/height; layout will jump (${src})`);
}

// 4. numbering: 01, 02 … contiguous across section headings and smaller-fix cards
const nums = [];
for (const m of noComments.matchAll(/<h([23])[^>]*>\s*<span class="num">([^<]+)<\/span>/g)) {
  const raw = m[2].trim(), at = lineOf(m.index);
  const range = raw.match(/^(\d+)\s*[–-]\s*(\d+)$/);
  if (range) nums.push({ kind: "range", lo: +range[1], hi: +range[2], at });
  else if (/^\d+$/.test(raw)) nums.push({ kind: "one", n: +raw, at });
  else err(`line ${at}: heading number "${raw}" is not a number or a range`);
}
const singles = nums.filter((x) => x.kind === "one").map((x) => x.n);
const sorted = [...singles].sort((a, b) => a - b);
sorted.forEach((n, i) => { if (n !== i + 1) err(`numbering: expected ${String(i + 1).padStart(2, "0")}, found ${String(n).padStart(2, "0")} (numbers must run 01, 02, … with no gaps or repeats)`); });
if (singles.join() !== sorted.join()) err(`numbering is out of order on the page: ${singles.join(", ")}`);
for (const r of nums.filter((x) => x.kind === "range")) {
  const inside = singles.filter((n) => n >= r.lo && n <= r.hi);
  if (inside.length !== r.hi - r.lo + 1) err(`line ${r.at}: range ${r.lo}–${r.hi} doesn't match the numbered cards under it (${inside.join(", ") || "none"})`);
}
if (!singles.length) warn("no numbered headings found; every thing shipped gets a number");

// 5. nav anchors <-> section ids
const ids = new Set([...noComments.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
const nav = (noComments.match(/<nav class="toc"[\s\S]*?<\/nav>/) || [""])[0];
const navTargets = [...nav.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
for (const t of navTargets) if (!ids.has(t)) err(`nav chip points at #${t}, which no element has`);
for (const m of noComments.matchAll(/<section class="theme" id="([^"]+)"/g)) if (!navTargets.includes(m[1])) err(`section #${m[1]} has no nav chip`);
const dupIds = [...noComments.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]).filter((v, i, a) => a.indexOf(v) !== i);
for (const d of new Set(dupIds)) err(`duplicate id "${d}"`);

// 6. every section shows its PRs, and chips link to real PRs
const sections = [...noComments.matchAll(/<section class="theme" id="([^"]+)"[\s\S]*?<\/section>/g)];
for (const s of sections) {
  const body = s[0], id = s[1];
  if (!/class="prs"/.test(body)) err(`section #${id} has no "Shipped in" PR chips`);
  for (const a of body.matchAll(/<div class="prs"[\s\S]*?<\/div>/g)) {
    for (const h of a[0].matchAll(/href="([^"]+)"/g)) if (!/\/pull\/\d+$/.test(h[1])) err(`section #${id}: PR chip href doesn't look like a PR: ${h[1]}`);
  }
  const isSmaller = /<h3[^>]*>\s*<span class="num">/.test(body);
  if (!isSmaller && !/class="better"/.test(body)) warn(`section #${id} has no "Why it's better" box`);
  if (!isSmaller && !/<details class="tech"/.test(body)) warn(`section #${id} has no Technical detail`);
  if (/label before/.test(body) && !/label after/.test(body)) err(`section #${id} has a Before without an After`);
}

// 7. mermaid pitfalls
for (const m of noComments.matchAll(/<pre class="mermaid">([\s\S]*?)<\/pre>/g)) {
  const src = m[1], at = lineOf(m.index);
  if (/<br\s*\/?>/i.test(src)) err(`line ${at}: <br> inside a mermaid label is dropped silently and words run together; use commas`);
  if (!/^\s*(flowchart|graph|sequenceDiagram|stateDiagram|stateDiagram-v2|erDiagram|classDiagram|gantt|timeline|journey|pie|mindmap|gitGraph|xychart-beta|block-beta|quadrantChart)\b/.test(src)) err(`line ${at}: mermaid block doesn't start with a diagram type`);
}

// 8. copy rules in visible text: no em dashes, no stat tile counting "things shipped"
const visible = noComments
  .replace(/<style[\s\S]*?<\/style>/g, "").replace(/<script[\s\S]*?<\/script>/g, "")
  .replace(/<pre[\s\S]*?<\/pre>/g, "").replace(/<code>[\s\S]*?<\/code>/g, "");
const text = visible.replace(/<[^>]+>/g, " ");
const dashes = (text.match(/—/g) || []).length;
if (dashes) err(`${dashes} em dash(es) in visible copy; use a period or a comma`);
if (/things shipped/i.test((page.match(/<div class="stats">[\s\S]*?<\/div>\s*<\/header>/) || [""])[0])) warn(`the stats strip counts "things shipped"; the numbered headings already say it`);
for (const w of ["robust", "seamless", "seamlessly", "leverage", "leverages", "streamline", "streamlined", "delve", "cutting-edge", "game-changer", "empower"]) {
  if (new RegExp(`\\b${w}\\b`, "i").test(text)) warn(`"${w}" in the copy reads generated; say what actually changed`);
}

for (const e of errors) console.log(`✗ ${e}`);
for (const w of warnings) console.log(`! ${w}`);
console.log(errors.length ? `\n${errors.length} error(s), ${warnings.length} warning(s)` : `\nok: ${singles.length} numbered things, ${sections.length} sections, ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
