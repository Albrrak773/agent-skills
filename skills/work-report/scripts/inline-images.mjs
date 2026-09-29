#!/usr/bin/env node
// work-report, step 8 fallback: when there's no Artifact tool, produce ONE self-contained file.
//
//   node scripts/inline-images.mjs <report-dir>/index.html <out.html>
//
// - Every local <img src="img/…"> becomes a data: URI, so the file can be emailed or attached.
// - Mermaid: the Artifact viewer renders <pre class="mermaid"> on its own. A plain browser
//   doesn't, so this adds the pinned mermaid build from jsdelivr plus a small theme-aware init.
//   The reader needs network access for the diagrams; everything else works offline.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve, extname } from "node:path";

const [src, dest] = process.argv.slice(2);
if (!src || !dest) { console.error("usage: inline-images.mjs <report>/index.html <out.html>"); process.exit(2); }
const dir = dirname(resolve(src));
const MIME = { ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".svg": "image/svg+xml" };
let html = readFileSync(src, "utf8");
let count = 0, bytes = 0;

html = html.replace(/(<img\b[^>]*\bsrc=")([^"]+)(")/g, (all, a, url, b) => {
  if (/^(data:|https?:)/.test(url)) return all;
  const path = resolve(dir, url);
  if (!existsSync(path)) { console.error(`missing image: ${url}`); process.exitCode = 1; return all; }
  const buf = readFileSync(path);
  count++; bytes += buf.length;
  return `${a}data:${MIME[extname(path).toLowerCase()] || "application/octet-stream"};base64,${buf.toString("base64")}${b}`;
});

const MERMAID = `
<script src="https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js"></script>
<script>
(function () {
  if (typeof mermaid === "undefined") return;
  var dark = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
  var theme = document.documentElement.getAttribute("data-theme");
  if (theme) dark = theme === "dark";
  mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: dark ? "dark" : "neutral",
    flowchart: { useMaxWidth: false }, sequence: { useMaxWidth: false }, state: { useMaxWidth: false } });
  mermaid.run({ querySelector: "pre.mermaid" });
})();
</script>`;
if (/<pre class="mermaid">/.test(html) && !/mermaid(\.min)?\.js/.test(html)) html = html.replace(/<\/body>|$/, (m) => MERMAID + "\n" + m);

// A bare fragment (how the report is authored) gets a real document around it.
if (!/<html[\s>]/i.test(html)) {
  html = `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n</head>\n<body>\n${html}\n</body>\n</html>\n`;
}
writeFileSync(dest, html);
console.log(`${dest}: ${count} image(s) inlined, ${(bytes / 1024).toFixed(0)} KB of images, ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB total`);
